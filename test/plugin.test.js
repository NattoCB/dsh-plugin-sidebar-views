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

test("partitionByWorkspace sends Automation-* workspace sessions to the external group", () => {
	const exports = loadClientExports();
	const rows = [{ id: "run-1" }, { id: "run-2" }, { id: "human-1" }];
	const wsOf = new Map([
		// title renamed away, path still betrays the automation directory
		["run-1", { title: "我的跑批", path: "/Volumes/x/Automation-AMV-Hourly" }],
		// default title (directory name) marks it even if path is missing
		["run-2", { title: "Automation-QF-Engine-Daily", path: "" }],
		["human-1", { title: "DeepSeekHarnessWorkspace", path: "/Users/x/Desktop/DeepSeekHarnessWorkspace" }]
	]);
	const parts = exports._partitionByWorkspace(rows, wsOf);
	assert.deepEqual(parts.ext.map((s) => s.id), ["run-1", "run-2"]);
	assert.deepEqual(parts.ws.map((s) => s.id), ["human-1"]);
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
