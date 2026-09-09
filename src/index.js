// Host half of dsh-plugin-sidebar-views.
//
// Cold-session title self-heal (v0.3.7): the host's session_projcache.json
// write path has been frozen since 2026-08-31, so sessions created after that
// carry no `title` projection in session.list and every sidebar row falls back
// to the workspace directory basename until the session is opened. This half
// serves GET /sidebar-views/titles — a persistent {sessionId: title} index
// built by streaming the session JSONL logs themselves (the `session/title`
// event is authoritative), which the client half injects into the client-side
// projection stores so both the native workspace tree and the sidebar views
// show real names immediately after a reload.
import { zstdDecompressSync } from 'node:zlib';
import fsp from 'node:fs/promises';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

export const name = 'sidebar-views';

/** Zstandard frame magic (little-endian u32). */
const ZSTD_MAGIC = 4247762216;
/** Per-session decode budget: frames scanned and plaintext bytes produced. */
const MAX_FRAMES_PER_SESSION = 8;
const MAX_PLAINTEXT_PER_SESSION = 16 * 1024 * 1024;
/** Rebuild trigger: a cached index older than this is refreshed in background. */
const STALE_MS = 60000;

/**
 * Locate complete zstd frame ranges without decompressing block payloads.
 * Mirrors dsh-session-persistence-jsonl's scanZstdFrames (structure-only
 * walk): magic, frame header descriptor, then block headers until last-block.
 * A torn final frame is simply not returned — its start would be a repair
 * offset for the persistence backend, not for this read-only index.
 * @param {Buffer} buffer - file bytes.
 * @param {number} maxFrames - stop after this many complete frames.
 * @returns {Array<{start: number, end: number}>}
 */
function scanFrames(buffer, maxFrames) {
	const frames = [];
	let offset = 0;
	while (offset < buffer.length && frames.length < maxFrames) {
		const start = offset;
		if (buffer.length - offset < 5) break;
		if (buffer.readUInt32LE(offset) !== ZSTD_MAGIC) break;
		offset += 4;
		const descriptor = buffer.readUInt8(offset);
		offset += 1;
		if ((descriptor & 24) !== 0) break;
		const contentSizeFlag = descriptor >>> 6;
		const singleSegment = (descriptor & 32) !== 0;
		const checksum = (descriptor & 4) !== 0;
		const dictionaryFlag = descriptor & 3;
		const dictionaryBytes = dictionaryFlag === 3 ? 4 : dictionaryFlag;
		const contentSizeBytes = contentSizeFlag === 0 ? (singleSegment ? 1 : 0) : 1 << contentSizeFlag;
		const headerRemaining = (singleSegment ? 0 : 1) + dictionaryBytes + contentSizeBytes;
		if (buffer.length - offset < headerRemaining) break;
		offset += headerRemaining;
		let torn = false;
		for (;;) {
			if (buffer.length - offset < 3) { torn = true; break; }
			const blockHeader = buffer[offset] | (buffer[offset + 1] << 8) | (buffer[offset + 2] << 16);
			offset += 3;
			const lastBlock = (blockHeader & 1) !== 0;
			const blockType = (blockHeader >>> 1) & 3;
			const blockSize = blockHeader >>> 3;
			if (blockType === 3) { torn = true; break; }
			const payloadBytes = blockType === 1 ? 1 : blockSize;
			if (buffer.length - offset < payloadBytes) { torn = true; break; }
			offset += payloadBytes;
			if (lastBlock) break;
		}
		if (torn) break;
		if (checksum) {
			if (buffer.length - offset < 4) break;
			offset += 4;
		}
		frames.push({ start, end: offset });
	}
	return frames;
}

/**
 * Pull the durable title out of one decoded frame's text. Sessions append
 * `session/title` events on first naming and later renames; the LAST one in
 * the decoded range is authoritative. Returns undefined when the frame has
 * none (the scan keeps going into later frames).
 * @param {Buffer} plaintext - decoded frame bytes.
 * @returns {string | undefined}
 */
function titleOfFrame(plaintext) {
	if (plaintext.length === 0) return undefined;
	let best;
	const text = plaintext.toString('utf8');
	for (const line of text.split('\n')) {
		if (line.indexOf('session/title') === -1) continue;
		const parseAt = line.indexOf('"session/title"');
		if (parseAt === -1) continue;
		try {
			const event = JSON.parse(line);
			if (event.type !== 'session/title') continue;
			const t = event.data && typeof event.data.title === 'string' ? event.data.title : undefined;
			if (t !== undefined && t !== '') best = t;
		} catch {
			// torn line at a chunk boundary — keep scanning
		}
	}
	return best;
}

/**
 * Decode a session log until a title shows up. Title events live in the
 * header's first frames (auto-naming happens at the first turn), so the scan
 * stays within a small frame budget and never touches deep history. Renames
 * append later title events, so the LAST one within the budget wins.
 * @param {Buffer} raw - session.jsonl.zstd bytes.
 * @returns {string | undefined}
 */
function extractTitle(raw) {
	const frames = scanFrames(raw, MAX_FRAMES_PER_SESSION);
	let budget = MAX_PLAINTEXT_PER_SESSION;
	let best;
	for (const { start, end } of frames) {
		if (budget <= 0) break;
		let plaintext;
		try {
			plaintext = zstdDecompressSync(raw.subarray(start, end));
		} catch {
			break; // corrupt frame — keep what earlier frames yielded, host owns repair
		}
		budget -= plaintext.length;
		const title = titleOfFrame(plaintext);
		if (title !== undefined) best = title;
	}
	return best;
}

/**
 * Walk every session log under the sessions root and build the title table.
 * Entries whose mtime is unchanged reuse the previous index verbatim, so the
 * steady-state rebuild is a directory stat sweep (~1k stats, tens of ms).
 * @param {string} sessionsRoot - the DSH sessions directory.
 * @param {{t: string, m: number}} [prev] - previous entries by session id.
 * @returns {Promise<{entries: Record<string, {t: string, m: number}>, missing: number}>}
 */
async function buildEntries(sessionsRoot, prev = {}) {
	const entries = {};
	let missing = 0;
	let keys;
	try {
		keys = await fsp.readdir(sessionsRoot);
	} catch {
		return { entries, missing };
	}
	for (const key of keys) {
		const keyDir = path.join(sessionsRoot, key);
		let ids;
		try {
			ids = await fsp.readdir(keyDir);
		} catch {
			continue;
		}
		for (const id of ids) {
			// session ids come in two shapes: session-<uuid> (interactive/subagent)
			// and dsh-automation-session-<uuid> (automation runs)
			if (id.startsWith('session-') === false && id.startsWith('dsh-automation-session-') === false) continue;
			const logPath = path.join(keyDir, id, 'session.jsonl.zstd');
			let stat;
			try {
				stat = await fsp.stat(logPath);
			} catch {
				continue; // plaintext logs or not-yet-created logs
			}
			const m = stat.mtimeMs;
			const previous = prev[id];
			if (previous !== undefined && previous.m === m && typeof previous.t === 'string') {
				entries[id] = previous;
				continue;
			}
			let raw;
			try {
				raw = await fsp.readFile(logPath);
			} catch {
				continue;
			}
			const t = extractTitle(raw);
			if (t === undefined) {
				missing += 1;
				continue;
			}
			entries[id] = { t, m };
		}
	}
	return { entries, missing };
}

/**
 * Read the persisted index file, tolerating absence and corruption.
 * @param {string} file - index path.
 * @returns {Promise<Record<string, {t: string, m: number}>>}
 */
async function readIndexFile(file) {
	try {
		const parsed = JSON.parse(await fsp.readFile(file, 'utf8'));
		return parsed && typeof parsed.entries === 'object' && parsed.entries !== null ? parsed.entries : {};
	} catch {
		return {};
	}
}

/**
 * Atomic index write: temp file + rename inside the same directory.
 * @param {string} file - index path.
 * @param {{v: number, builtAt: string, entries: object}} doc - index payload.
 */
async function writeIndexFile(file, doc) {
	await fsp.mkdir(path.dirname(file), { recursive: true });
	const tmp = file + '.tmp-' + process.pid;
	await fsp.writeFile(tmp, JSON.stringify(doc));
	await fsp.rename(tmp, file);
}

/** Register the HTTP endpoint for the client half. */
export function apply(ctx) {
	ctx.inject(['webServer'], (sctx) => {
		const dshHome = process.env.DSH_HOME || path.join(os.homedir(), '.dsh');
		const sessionsRoot = path.join(dshHome, 'sessions');
		const indexFile = path.join(dshHome, 'storages', 'sidebar-views', 'title-index.json');
		let cache = null; // { titles, builtAt }
		let building = null; // Promise | null — single-flight rebuild guard
		let lastBuiltAt = 0;

		const rebuild = () => {
			building ??= (async () => {
				const prev = await readIndexFile(indexFile);
				const { entries } = await buildEntries(sessionsRoot, prev);
				const titles = {};
				for (const [id, e] of Object.entries(entries)) titles[id] = e.t;
				const builtAt = new Date().toISOString();
				await writeIndexFile(indexFile, { v: 1, builtAt, entries });
				cache = { titles, builtAt };
				lastBuiltAt = Date.now();
				console.log(`[sidebar-views] title index rebuilt: ${Object.keys(titles).length} titles at ${builtAt}`);
			})()
				.catch((error) => console.warn('[sidebar-views] title index rebuild failed:', String((error && error.message) || error)))
				.finally(() => { building = null; });
			return building;
		};

		const ensureStarted = async () => {
			if (building !== null) return;
			if (cache !== null && Date.now() - lastBuiltAt < STALE_MS) return;
			const persisted = await readIndexFile(indexFile);
			if (cache === null && Object.keys(persisted).length > 0) {
				// Serve the persisted index immediately; a background pass then
				// picks up sessions created since the last build.
				const titles = {};
				for (const [id, e] of Object.entries(persisted)) titles[id] = e.t;
				cache = { titles, builtAt: 'persisted' };
			}
			rebuild();
		};

		sctx.effect(() => sctx.webServer.register({
			kind: 'prefix',
			path: '/sidebar-views',
			handler: (req, res) => {
				const send = (code, body) => {
					res.writeHead(code, { 'content-type': 'application/json; charset=utf-8' });
					res.end(JSON.stringify(body));
				};
				try {
					const url = new URL(req.url, 'http://dsh.local');
					if (url.pathname.replace(/^\/sidebar-views\/?/, '') !== 'titles') return send(404, { error: 'not found' });
					if (req.method !== 'GET') return send(405, { error: 'method not allowed' });
					ensureStarted();
					send(200, {
						titles: cache === null ? {} : cache.titles,
						builtAt: cache === null ? null : cache.builtAt,
						building: building !== null
					});
				} catch (error) {
					send(500, { error: String((error && error.message) || error) });
				}
			},
		}), 'sidebar-views:http');
	});
}

// Test seams (repo convention: `_`-prefixed pure-function exports).
export const _scanFrames = scanFrames;
export const _extractTitle = extractTitle;
export const _titleOfFrame = titleOfFrame;
