# Changelog

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
