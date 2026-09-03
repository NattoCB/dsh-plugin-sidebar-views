# Changelog

## 0.2.1 — 2026-09-03

- Installable as a profile bundle: declare `dsh.bundle.patch` → `cordis.patch.yml`
  (the loader requires a resolvable patch file per bundle, not just a truthy
  `dsh.bundle`) and give the host half a real `apply`. Behavior unchanged.
- Finder menu item: clone a plain row (normal color) and draw a folder glyph
  in the native icon span instead of inheriting the danger-row styling.

## 0.2.0 — 2026-09-03

- Native workspace "…" menu gains an open-in-Finder item: the menu's fiber
  payload carries the workspace cwd, activated through the stock
  `workspaces.openPath` service (no host-side code). Rescans on captured
  clicks plus a slow fallback poll because the portal reuses its container.

## 0.1.0 — 2026-08-31

Initial release.

- Workspaces / Recent sessions switcher above the sidebar list, with a
  new-session button and a title filter in the Recent view.
- Pinned sessions group in both views: live count, collapse memory, dimmed
  rows for sessions that no longer exist, pin markers on flat rows.
- Per-row menu: pin/unpin and copy session id.
- Pin state in `localStorage` (`dsx2-pins`, oldest-first) with a one-shot
  id-deduplicated migration from the legacy `dsh-plugin-pin-session` API and
  dual-writes to it while it still runs.
