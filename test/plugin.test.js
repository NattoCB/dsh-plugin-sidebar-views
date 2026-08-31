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
