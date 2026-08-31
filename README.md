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

## License

MIT
