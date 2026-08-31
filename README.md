# dsh-plugin-sidebar-views

A [DeepSeek Harness](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin) client-side plugin that upgrades the sidebar session list:

- **Two views with a switcher** above the sidebar list — **Workspaces** (the native grouping) and **Recent sessions** (every session in one recency-sorted flat list, with relative timestamps, running/completed/pending state dots, and the owning workspace as a tag).
- **Pinned sessions group** that stays above the list in both views, with a live count, collapse memory, and dimmed rows for sessions that no longer exist.
- **Per-row "⋯" menu** on every row (pinned and flat): pin/unpin the session, and **copy its session id**.
- **Title filter** box in the Recent view.

Everything is plain DOM — no React rendering, no portals, no slot takeover. The widget is planted as the first child of the native sidebar list container, hides the native list via a CSS class while in Recent mode, and survives re-renders with a keep-alive interval. A `ResizeObserver` hides it entirely when the sidebar rail is collapsed.

## Install

```bash
dsh plugin --profile web add github:NattoCB/dsh-plugin-sidebar-views
```

Or add it by hand: in the profile's `package.json`, add the package to `dependencies` and the plugin name to `dsh.profile.bundles`, then run `pnpm install` inside the profile directory. Restart the DSH web process — client bundles only join the boot graph at process start.

## Pin storage & migration

Pins live in the browser's `localStorage` under `dsx2-pins` (oldest-first `[{ id, title?, pinnedAt }]`); collapse state sits next to it in `dsx2-pins-collapsed`. Because storage is browser-local, pins follow the browser profile, not the DSH host.

If the older `dsh-plugin-pin-session` plugin is still installed, this plugin:

- merges its pin list once at startup via `GET /pin-session/pins` (id-deduplicated, result stays oldest-first), and
- dual-writes every pin/unpin to its `POST /pin-session/pin|unpin` endpoints during the transition.

Both calls are silent no-ops once the legacy plugin is gone.

## Uninstalling safely

Remove the plugin from **both** `dependencies` and `dsh.profile.bundles` in the profile `package.json`, then restart DSH. Deleting the package from `node_modules` while leaving the bundles entry in place makes the boot graph request a `client.js` that no longer exists — the module loader treats that as fatal and the whole web GUI fails to mount.

## Development

```bash
npm test        # node --test: package contract + pin merge logic
```

`client/client.js` is a `window.__ModuleLoader__.load({ id, factory })` bundle in the same shape as DSH's own client bundles. The pin-merge logic is exported as `exports._mergePins` so tests exercise the real code, not a copy.

## License

MIT
