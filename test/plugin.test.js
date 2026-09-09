import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const pkg = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));

/** Execute the bundle's ModuleLoader registration and return its exports. */
function loadClientExports() {
	const code = readFileSync(new URL("../client/client.js", import.meta.url), "utf8");
	let definition = null;
	globalThis.window = {
		__ModuleLoader__: {
			load(def) { definition = def; }
		}
	};
	try {
		new Function(code)();
	} finally {
		delete globalThis.window;
	}
	assert.ok(definition, "client.js never called window.__ModuleLoader__.load");
	assert.equal(definition.id, "dsh-plugin-sidebar-views");
	return definition.factory(() => {
		throw new Error("client.js must not require vendor modules at load time");
	});
}

test("package declares an installable client bundle", () => {
	assert.equal(pkg.name, "dsh-plugin-sidebar-views");
	assert.ok(pkg.dsh && pkg.dsh.bundle !== undefined, "dsh.bundle must be declared");
	assert.ok(pkg.dsh.client, "dsh.client must be declared");
	assert.equal(pkg.dsh.client.platform, "web");
	assert.equal(pkg.exports["./client"], "./client/client.js");
	assert.ok(pkg.exports["."], "host-side entry must exist");
});

test("client module exposes the plugin face", () => {
	const exports = loadClientExports();
	assert.deepEqual(exports.inject, ["sessions", "workspaces", "timer"]);
	assert.equal(typeof exports.apply, "function");
	assert.equal(typeof exports._mergePins, "function");
});

test("mergePins adds legacy pins without duplicating known ids", () => {
	const exports = loadClientExports();
	const local = [
		{ id: "session-b", title: "kept title", pinnedAt: 200 },
		{ id: "session-a", pinnedAt: 100 }
	];
	const remote = [
		{ id: "session-a", title: "legacy title", pinnedAt: 100 },
		{ id: "session-c", pinnedAt: 150 },
		{ id: "session-d" }
	];
	const merged = exports._mergePins(local, remote);
	assert.deepEqual(merged.map((p) => p.id), ["session-d", "session-a", "session-c", "session-b"]);
	assert.equal(merged.find((p) => p.id === "session-b").title, "kept title", "local entries must win over legacy");
	assert.equal(merged.find((p) => p.id === "session-d").pinnedAt, 0, "pins without a timestamp sort first");
});

test("mergePins tolerates malformed legacy rows and envelope shapes", () => {
	const exports = loadClientExports();
	const merged = exports._mergePins([], [null, { id: 42 }, { id: "session-ok", pinnedAt: "soon" }, { id: "session-ts", pinnedAt: 5 }]);
	assert.deepEqual(merged.map((p) => p.id), ["session-ok", "session-ts"]);
	assert.equal(merged.find((p) => p.id === "session-ok").pinnedAt, 0);
});

test("mergePins keeps results oldest-first", () => {
	const exports = loadClientExports();
	const merged = exports._mergePins(
		[{ id: "new", pinnedAt: 300 }],
		[{ id: "old", pinnedAt: 1 }, { id: "mid", pinnedAt: 2 }]
	);
	assert.deepEqual(merged.map((p) => p.id), ["old", "mid", "new"]);
});

test("partitionByWorkspace splits sessions by workspace membership", () => {
	const exports = loadClientExports();
	const rows = [
		{ id: "s-ws", updatedAt: 3 },
		{ id: "s-ext", updatedAt: 2 },
		{ id: "s-ws2", updatedAt: 1 }
	];
	const wsOf = new Map([
		["s-ws", { title: "Demo", path: "/tmp/Demo" }],
		["s-ws2", { title: "Demo", path: "/tmp/Demo" }]
	]);
	const parts = exports._partitionByWorkspace(rows, wsOf);
	assert.deepEqual(parts.ws.map((s) => s.id), ["s-ws", "s-ws2"]);
	assert.deepEqual(parts.ext.map((s) => s.id), ["s-ext"]);
});

test("partitionByWorkspace treats unknown and workspace-less sessions as external", () => {
	const exports = loadClientExports();
	const parts = exports._partitionByWorkspace([{ id: "a" }, { id: "b" }], new Map());
	assert.equal(parts.ws.length, 0, "no workspace membership means external");
	assert.deepEqual(parts.ext.map((s) => s.id), ["a", "b"]);
	assert.deepEqual(exports._partitionByWorkspace([], new Map()), { ws: [], ext: [] });
});

test("partitionByWorkspace keeps Automation-* workspace sessions in the workspace group; only workspace-less sessions are external", () => {
	const exports = loadClientExports();
	const rows = [{ id: "run-1" }, { id: "run-2" }, { id: "human-1" }, { id: "headless-1" }];
	const wsOf = new Map([
		// membership decides — a renamed Automation workspace is still a workspace
		["run-1", { title: "我的跑批", path: "/Volumes/x/Automation-AMV-Hourly" }],
		// default title (directory name), no special meaning
		["run-2", { title: "Automation-QF-Engine-Daily", path: "" }],
		["human-1", { title: "DeepSeekHarnessWorkspace", path: "/Users/x/Desktop/DeepSeekHarnessWorkspace" }]
		// headless-1: no entry → external
	]);
	const parts = exports._partitionByWorkspace(rows, wsOf);
	assert.deepEqual(parts.ws.map((s) => s.id), ["run-1", "run-2", "human-1"]);
	assert.deepEqual(parts.ext.map((s) => s.id), ["headless-1"]);
});

test("grouping is membership-only: unregistered sessions stay external even when cwd matches a workspace", () => {
	const exports = loadClientExports();
	const code = readFileSync(new URL("../client/client.js", import.meta.url), "utf8");
	assert.ok(code.includes("fillWorkspaceByCwd") === false, "the cwd-prefix fallback must stay removed (Jasper 2026-09-09: headless AMV drain workers live inside workspace dirs)");
	const workspaces = [{ title: "AMV", path: "/Volumes/x/Automation-AMV-Hourly", sessionIds: ["registered-1"] }];
	const wsOf = new Map([["registered-1", workspaces[0]]]);
	const rows = [
		{ id: "registered-1", cwd: "/Volumes/x/Automation-AMV-Hourly" },
		// headless drain worker: cwd inside the workspace dir but never registered
		{ id: "drain-worker", cwd: "/Volumes/x/Automation-AMV-Hourly/src" }
	];
	const parts = exports._partitionByWorkspace(rows, wsOf);
	assert.deepEqual(parts.ws.map((s) => s.id), ["registered-1"], "registry membership wins");
	assert.deepEqual(parts.ext.map((s) => s.id), ["drain-worker"], "unregistered sessions are 外部调用 regardless of cwd");
});

test("show-more pagination renders five rows per step", () => {
	const code = readFileSync(new URL("../client/client.js", import.meta.url), "utf8");
	assert.ok(/const RENDER_CHUNK_FIRST = 5;/.test(code), "first chunk is five rows");
	assert.ok(/const RENDER_CHUNK_MORE = 5;/.test(code), "each show-more adds five rows");
	assert.ok(code.includes("展开更多 "), "the button labels the batch size in sessions");
	assert.ok(code.includes("projectionStoreOf"), "title injection resolves the store through the manager fallback");
});

/** Build a fake fiber element: memoizedProps plus an optional parent. */
function fiberEl(props, parent) {
	const el = { memoizedProps: props, return: parent || null };
	el["__reactFiber$test"] = el; // the fiber node carries the .return chain
	return el;
}

test("findWorkspaceCwd reads the menu content payload up the fiber chain", () => {
	const exports = loadClientExports();
	// content is a React element: cwd lives on its props
	const menu = fiberEl({ className: "menu" },
		fiberEl({ anchor: {} },
			fiberEl({ content: { $$typeof: Symbol.for("react.element"), props: { label: "DeepSeekHarnessWorkspace", cwd: "/tmp/demo", createdAt: 1 } } })));
	assert.equal(exports._findWorkspaceCwd(menu), "/tmp/demo");
});

test("findWorkspaceCwd returns undefined for non-workspace menus and broken fibers", () => {
	const exports = loadClientExports();
	assert.equal(exports._findWorkspaceCwd(fiberEl({})), undefined, "no content payload anywhere");
	assert.equal(exports._findWorkspaceCwd(fiberEl({ content: { $$typeof: Symbol.for("react.element"), props: { label: "x" } } })), undefined, "content without cwd");
	assert.equal(
		exports._findWorkspaceCwd(fiberEl({ content: { $$typeof: Symbol.for("react.element"), props: { cwd: "" } } })),
		undefined,
		"empty cwd is not a workspace menu"
	);
	const noFiber = { memoizedProps: {} }; // element without a fiber key
	assert.equal(exports._findWorkspaceCwd(noFiber), undefined);
});

test("expandDisplayCwd passes non-display paths through untouched", () => {
	const exports = loadClientExports();
	assert.equal(exports._expandDisplayCwd("/tmp/demo", { items: [] }), "/tmp/demo");
	assert.equal(exports._expandDisplayCwd("/tmp/demo", undefined), "/tmp/demo");
	assert.equal(exports._expandDisplayCwd(undefined, { items: [] }), undefined);
	assert.equal(exports._expandDisplayCwd("~", { items: [{ path: "/home/u" }] }), "~", "bare ~ has no suffix to match");
});

test("expandDisplayCwd resolves the host display spelling against workspace paths", () => {
	const exports = loadClientExports();
	const wlist = { items: [
		{ path: "/Volumes/SSD_512G/DeepSeekHarnessWorkspace/Automation-FA-Daily" },
		{ path: "/Users/jasperbot1/Desktop/DeepSeekHarnessWorkspace" },
		{ path: "/Users/jasperbot1/.dsh/wechat-bridge/WeChatSpace" }
	] };
	assert.equal(
		exports._expandDisplayCwd("~/Desktop/DeepSeekHarnessWorkspace", wlist),
		"/Users/jasperbot1/Desktop/DeepSeekHarnessWorkspace"
	);
	assert.equal(
		exports._expandDisplayCwd("~/Desktop/DeepSeekHarnessWorkspace", undefined),
		"~/Desktop/DeepSeekHarnessWorkspace",
		"no workspace list: fall back to the display spelling"
	);
	assert.equal(
		exports._expandDisplayCwd("~/elsewhere/missing", wlist),
		"~/elsewhere/missing",
		"unmatched suffix: fall back to the display spelling"
	);
});

test("expandDisplayCwd matches case-insensitively and skips malformed entries", () => {
	const exports = loadClientExports();
	const wlist = { items: [null, 42, { title: "no path" }, { path: "/Users/jasperbot1/Desktop/DeepSeekHarnessWorkspace" }] };
	assert.equal(exports._expandDisplayCwd("~/Desktop/DeepSeekHarnessWorkspace", wlist), "/Users/jasperbot1/Desktop/DeepSeekHarnessWorkspace");
	assert.equal(exports._expandDisplayCwd("~/desktop/deepseekharnessworkspace", wlist), "/Users/jasperbot1/Desktop/DeepSeekHarnessWorkspace");
});

test("finder menu click hands openPath an expanded folder-reveal path", () => {
	const code = readFileSync(new URL("../client/client.js", import.meta.url), "utf8");
	assert.ok(code.includes("expandDisplayCwd(cwd"), "click handler must expand the display cwd before openPath");
	assert.ok(/openPath\(expandDisplayCwd\(cwd,\s*safeSnap\(wList\)\)\s*\+\s*"\/\."\)/.test(code), "the open must carry the folder-reveal gesture suffix");
});

test("stale session baseline: the view re-pulls so cli/automation-created sessions appear without a reload", () => {
	const code = readFileSync(new URL("../client/client.js", import.meta.url), "utf8");
	assert.ok(/function refreshBaseline\(\)/.test(code), "a refreshBaseline helper must exist");
	assert.ok(/typeof sessions\.refresh !== "function"/.test(code), "the helper must feature-detect the sessions facade");
	assert.ok(/sessions\.refresh\(\);/.test(code), "the helper must call sessions.refresh()");
	assert.ok(/mode === "recent"\)\s*\{\s*refreshBaseline\(\);\s*renderList\(\);/.test(code), "opening the recent tab must refresh before rendering");
	assert.ok(/timer\.interval\(\(\) => \{ if \(document\.visibilityState !== "hidden"\) refreshBaseline\(\); \}, \d+\)/.test(code), "a periodic refresh ticker must run while the page is visible");
	assert.ok(/addEventListener\("visibilitychange", onVisible\)/.test(code), "waking a background tab must trigger a refresh");
	assert.ok(/refreshTicker !== null\) \{ try \{ refreshTicker\(\); \} catch \(error\) \{\}\s*\}/.test(code), "the ticker must be disposed on cleanup");
	assert.ok(/removeEventListener\("visibilitychange", onVisible\)/.test(code), "the wake listener must be removed on cleanup");
});

test("service rebind: a rebuilt client-runtime instance must not orphan the view on an empty store", () => {
	const code = readFileSync(new URL("../client/client.js", import.meta.url), "utf8");
	// The client runtime can re-materialize its module graph and swap the
	// sessions facade + list store; a view holding the old store then reads
	// the constructor-initial snapshot (ids:0, phase:"pending") forever.
	assert.ok(/function rebindSessions\(\)/.test(code), "a rebindSessions helper must exist");
	assert.ok(/ctxRef\.get\("sessions"\)/.test(code), "rebind must re-read the live service from ctx");
	assert.ok(/sList = sessions\.list;/.test(code), "rebind must swap the list store reference");
	assert.ok(/unsub1 = sList\.subscribe\(onData\);/.test(code), "rebind must re-subscribe to the new store");
	assert.ok(/rebindSessions\(\);\n(\t+)if \(sessions === undefined \|\| typeof sessions\.refresh !== "function"\) return;/.test(code), "refreshBaseline must rebind before pulling");
	// The empty-and-pending snapshot must trigger a heal attempt, not just render an empty note.
	assert.ok(/ids\.length === 0 && list\.phase !== "ready"/.test(code), "renderList must detect the orphaned-store signature");
	assert.ok(/healOrphanedStore\(\)/.test(code), "the orphaned-store signature must trigger healOrphanedStore");
	assert.ok(/now - lastHealAt >= 4000/.test(code), "heal attempts must be throttled");
	// After a refresh completes, render explicitly — a swapped store may never notify the old subscription.
	assert.ok(/\.then\(\(\) => \{ renderList\(\); \}/.test(code), "refreshBaseline must re-render when its pull settles");
});

test("native session menus gain a copy-session-id item", () => {
	const code = readFileSync(new URL("../client/client.js", import.meta.url), "utf8");
	assert.ok(/function findSessionId\(/.test(code), "a session-menu fiber resolver must exist");
	assert.ok(/id\.indexOf\("session-"\) === 0 \|\| id\.indexOf\("dsh-automation-session-"\) === 0/.test(code), "the resolver must anchor on both session id shapes");
	assert.ok(/dsx2-sid-item/.test(code), "the injected item must carry a marker class");
	assert.ok(/"复制 Session ID"/.test(code), "the injected label must match the sidebar row menu wording");
	assert.ok(/copyText\(sid\)/.test(code), "the injected item must copy the resolved session id");
	assert.ok(/dismissNativeMenu\(\)/.test(code), "menu dismissal must go through the shared helper");
});

test("the finder item renders above destructive rows in the workspace menu", () => {
	const code = readFileSync(new URL("../client/client.js", import.meta.url), "utf8");
	assert.ok(/danger\.parentNode\.insertBefore\(item, danger\)/.test(code), "the finder item must insert beside the danger row inside its own parent");
	assert.ok(/\/\(\^\|\[\\s_-\]\)danger\/i\.test\(mi\.className\)/.test(code), "danger rows must be detected by class");
});

test("injected native-menu items survive react re-renders of the open menu", () => {
	const code = readFileSync(new URL("../client/client.js", import.meta.url), "utf8");
	assert.ok(/function watchMenuPortals\(\)/.test(code), "a menu portal watcher must exist");
	assert.ok(/new MutationObserver\(\(\) => scheduleWorkspaceScan\(\)\)/.test(code), "portal mutations must reschedule the scan");
	assert.ok(/menuFixObserver\.disconnect\(\)/.test(code).valueOf() && /watchMenuPortals\(\);\s*\n\t\t\}/.test(code), "enhance must arm the portal watcher");
	assert.ok(/if \(menuFixObserver !== null\) \{ try \{ menuFixObserver\.disconnect\(\); \} catch \(error\) \{\} menuFixObserver = null; \}/.test(code), "cleanup must disconnect the portal watcher");
	assert.ok(/querySelector\("\." \+ markerClass\)/.test(code), "re-injection must be guarded by the marker class");
});

// ── host half: cold-session title index (v0.3.7) ─────────────────────────

import { zstdCompressSync, zstdDecompressSync } from "node:zlib";
import { _scanFrames, _extractTitle, _titleOfFrame } from "../src/index.js";

/** Build the concatenated-frame container the persistence backend writes. */
function container(frames) {
	return Buffer.concat(frames.map((text) => zstdCompressSync(Buffer.from(text, "utf8"))));
}

test("scanFrames locates every complete frame in a multi-frame container", () => {
	const buf = container(["line-one\n", "line-two\n", "line-three\n"]);
	const frames = _scanFrames(buf, 8);
	assert.equal(frames.length, 3);
	assert.deepEqual(frames.map((f) => f.end - f.start < buf.length), [true, true, true]);
	// concatenated decode must reproduce the full text
	const text = frames.map((f) => buf.subarray(f.start, f.end)).map((b) => zstdDecompressSync(b).toString("utf8")).join("");
	assert.equal(text, "line-one\nline-two\nline-three\n");
});

test("scanFrames caps at maxFrames and skips torn tails", () => {
	const full = container(["aaa\n", "bbb\n"]);
	const torn = full.subarray(0, full.length - 4); // cut inside the last frame
	const frames = _scanFrames(torn, 8);
	assert.ok(frames.length >= 1 && frames.length < 2, "only complete frames count");
	assert.equal(_scanFrames(full, 1).length, 1, "maxFrames caps the scan");
});

test("extractTitle reads the session/title event and prefers the last rename", () => {
	const header = JSON.stringify({ type: "session", seq: 0, data: { id: "session-x" } }) + "\n";
	const named = JSON.stringify({ type: "session/title", seq: 4, data: { title: "第一版标题" } }) + "\n";
	const filler = JSON.stringify({ type: "session/stats", seq: 5 }) + "\n";
	const renamed = JSON.stringify({ type: "session/title", seq: 9, data: { title: "重命名后" } }) + "\n";
	assert.equal(_extractTitle(container([header, named, filler])), "第一版标题");
	assert.equal(_extractTitle(container([header, named, filler, renamed])), "重命名后");
});

test("extractTitle returns undefined for logs without a title event", () => {
	const header = JSON.stringify({ type: "session", seq: 0, data: { id: "session-y" } }) + "\n";
	const filler = JSON.stringify({ type: "session/stats", seq: 1 }) + "\n";
	assert.equal(_extractTitle(container([header, filler])), undefined);
	assert.equal(_extractTitle(Buffer.alloc(0)), undefined);
	assert.equal(_extractTitle(Buffer.from("not zstd at all")), undefined);
});

test("titleOfFrame tolerates torn lines and non-title JSON", () => {
	assert.equal(_titleOfFrame(Buffer.from('{"type":"session/title","data":{"title":"t"}}\n{"type":"other"'), "utf8"), "t");
	assert.equal(_titleOfFrame(Buffer.from("garbage \xff\xfe bytes"), "utf8"), undefined);
	assert.equal(_titleOfFrame(Buffer.alloc(0)), undefined);
});

test("native session menus gain a pin item and the show-more row gains 收起", () => {
	const code = readFileSync(new URL("../client/client.js", import.meta.url), "utf8");
	assert.ok(/dsx2-pin-item/.test(code), "the native session menu carries a marker-class pin item");
	assert.ok(/pinned \? "取消固定" : "固定会话"/.test(code), "the pin label reflects live pin state");
	assert.ok(/if \(pinned\) unpinSession\(sid\);/.test(code), "the pin item toggles through the shared pin store");
	assert.ok(/dsx2-collapse-btn/.test(code), "the show-more row carries a collapse control");
	assert.ok(/renderLimit\[key\] = RENDER_CHUNK_FIRST;/.test(code), "collapse resets the group cap to the first page");
});

test("workspaces tab: groups page 5-at-a-time with a fold control; the 165-count never shows", () => {
	const code = readFileSync(new URL("../client/client.js", import.meta.url), "utf8");
	assert.ok(/const WS_PAGE = 5;/.test(code), "the native-tree page size is five");
	assert.ok(/function applyWsCaps\(\)/.test(code), "an observer-driven cap applier exists");
	assert.ok(/\[class\*='groupSection'\]/.test(code), "caps target the native group sections (rows keep lineage/drag/icons)");
	assert.ok(/span\.style\.display !== want/.test(code), "row hiding is idempotent (no observer feedback loop)");
	assert.ok(/dsx2-cap-row/.test(code), "a self-drawn control row is injected per group");
	// the two-button control row: page forward + fold
	assert.ok(/"\\u5c55\\u5f00\\u66f4\\u591a " \+ Math\.min\(WS_PAGE, remaining\)/.test(code), "expanded groups show 展开更多 5 个会话");
	assert.ok(/"\\u5c55\\u5f00\\u5176\\u4f59 5 \\u4e2a\\u4f1a\\u8bdd"/.test(code), "folded-to-header state offers 展开其余 5 个会话");
	assert.ok(/fold\.textContent = "\\u6536\\u8d77"/.test(code), "every group gets a 收起 control");
	assert.ok(/wsCaps\.set\(title, 0\)/.test(code), "收起 folds the workspace to its header row (cap 0)");
	// the native overflow button is dead CSS-wise — the raw count can never show
	assert.ok(/\[class\*=\'sessionOverflow\'\]\{display:none!important\}/.test(code), "the native 展开其余 165 个会话 button is hidden by CSS (rebuild-proof)");
});

test("workspaces tab: injected controls survive React rebuilds (sweep-first, compare-first)", () => {
	const code = readFileSync(new URL("../client/client.js", import.meta.url), "utf8");
	assert.ok(/querySelectorAll\(":scope > \.dsx2-more-btn, :scope > \.dsx2-collapse-btn, \.dsx2-more-btn:not\(\.dsx2-cap-row \.dsx2-more-btn\), \.dsx2-collapse-btn:not\(\.dsx2-cap-row \.dsx2-collapse-btn\)"\)\) stale\.remove\(\)/.test(code), "every pass sweeps stale injected nodes React left behind");
assert.ok(/for \(const extra of sec\.querySelectorAll\("\.dsx2-cap-row"\)\) if \(extra !== ctrl\) extra\.remove\(\)/.test(code), "duplicate control rows are collapsed into one");
assert.ok(/more\.parentNode !== ctrl\) ctrl\.appendChild\(more\)/.test(code), "the control row is reused, not rebuilt, when it survives");
	assert.ok(/remaining > 0\) \{\n\t\t\t\t\t\tconst label = "\\u5c55\\u5f00\\u5176\\u4f59 " \+ Math\.min\(WS_PAGE, remaining\)/.test(code), "the collapsed page shows our own 展开其余 5 个会话 control when rows remain");
	assert.ok(/more\.textContent !== label\) more\.textContent = label/.test(code), "control labels are compare-first (settled tree = zero mutations)");
});

test("a 5-row group shows only 收起 — no phantom 展开其余 control", () => {
	const code = readFileSync(new URL("../client/client.js", import.meta.url), "utf8");
	assert.ok(code.includes("native.textContent.match(/(\\d+)/)"), "the real remaining count comes from the native label, not the 5-row DOM");
	assert.ok(/remaining = m !== null \? Number\(m\[1\]\) : 0;/.test(code), "a group with no overflow label shows no forward control");
	assert.ok(!/Math\.max\(total - WS_PAGE, 0\) \|\| WS_PAGE/.test(code), "the 0-fallback that fabricated a phantom count is gone");
});

test("a fully folded workspace shows no 收起 (it would be a no-op)", () => {
	const code = readFileSync(new URL("../client/client.js", import.meta.url), "utf8");
	assert.ok(/if \(folded\) \{[\s\S]*?fold\.style\.display = "none";/.test(code), "the folded branch hides the 收起 button");
	assert.ok(!/\n\t\t\t\tfold\.style\.display = "";/.test(code), "no unconditional fold re-show overrides the folded hide");
});
