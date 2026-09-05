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
