# Changelog

## 0.3.5 — 2026-09-06

- Fix: the native workspace menu's "在 Finder 中打开" entry rendered below
  删除工作区 (a destructive red row), a misclick hazard Jasper called out. It
  now inserts directly above the danger row — inside the danger row's own
  parent, since native menu items can be nested in wrapper nodes and a menu
  root-level insertBefore throws (silently swallowed by the scan, killing the
  whole enhancement branch).
- Native session menus in the 工作区 view (重命名/分叉会话/归档会话) gain a
  复制 Session ID item, matching the sidebar row menu. The session id is
  resolved from the open menu's React fiber chain (SessionNodeItem
  props.node), not from DOM text.
- Injected native-menu items now survive React re-renders of an open menu: a
  MutationObserver on the menu portal container reschedules the scan when the
  open menu's content mutates; the marker-class guard keeps re-injection a
  no-op once present.
- Live-verified in the real GUI: workspace menu order is 重命名 / 在 Finder
  中打开 / 删除工作区, and the session menu copies the exact session id
  (clipboard spy verified). Tests 20/20.

## 0.3.4 — 2026-09-06

## 0.3.4 — 2026-09-06

- Fix: the 外部调用 group membership was name-based — sessions in any
  workspace whose title or directory started with `Automation-` were exiled
  to the (default-collapsed) external group, so fresh automation runs never
  showed at the top of 历史会话 even when the data was fine. Jasper clarified
  the intent: 外部调用 means sessions created with no workspace at all
  (headless base requests, e.g. `dsh --profile <x>` callers), not
  "workspaces that look automated".
- Membership now decides: any workspace-attached session — including
  `Automation-*` workspaces — lands in the 工作区 group, recency-sorted, so
  the newest fleet run sits at the very top of the list.
- The host registers sessions into workspaces late (2,383 AMV-cwd sessions
  vs only 351 registered at diagnosis time), so registry-only membership
  would bounce fresh runs back into the external group. A cwd fallback now
  matches session cwd against workspace paths (longest prefix wins, registry
  entries always win) and the row's workspace label benefits too.
- Live-verified in the real GUI: 工作区 2,826 rows with the freshest
  `Automation-AMV-Hourly` runs ("刚刚") at the absolute top; 外部调用 down to
  the single true headless session.

## 0.3.3 — 2026-09-06

- Fix for real: 0.3.2's re-pull could not help when the client runtime
  re-materializes its module graph — the view then holds an orphaned list
  store that reads the constructor-initial snapshot (`ids: 0,
  phase: "pending"`) forever, while every pull lands in the replacement store
  it no longer points at. The view now re-reads the live `sessions` service
  from ctx on every refresh (`rebindSessions`), re-subscribing to the swapped
  store when the instance changed, and re-renders explicitly once its pull
  settles instead of waiting for a notification that never comes.
- An empty-and-pending snapshot (the orphaned-store signature) now triggers a
  throttled heal (4 s) right from `renderList`, so recovery also runs while
  the page sits in the affected state, not only on the next trigger.
- Live evidence for the failure mode: with 0.3.2, a real page sat in the
  orphaned state — pulls returned the full list (2,996 items) yet the view
  stayed "暂无会话" until a manual reload. With 0.3.3 the same state is
  structurally covered (rebind + throttled heal + explicit re-render); the
  swap itself could not be reproduced on demand, so the heal path is locked
  by wiring tests and the healthy path (boot, occlusion cycle, wake, tab
  switch) is verified live in the real GUI.

## 0.3.2 — 2026-09-05

- Fix: sessions created after the page loaded (dsh CLI runs, automation
  pipelines) never showed up in 历史会话 — the client runtime only pulls the
  full session list on (re)connect and no push frame announces externally
  created sessions. The view now re-pulls the baseline itself: every 2 minutes
  while the page is visible, on tab wake from a backgrounded window, and when
  the 历史会话 tab is opened. Feature-detects `sessions.refresh`, so older
  runtimes degrade to the old behavior.

## 0.3.1 — 2026-09-05

- Perf: toggling the external group no longer stutters — batch row insertion
  via DocumentFragment, `content-visibility: auto` on the group row container,
  per-render pin-set parsing, and a 400 ms coalescing throttle on data pushes
  (direct interactions stay immediate).
- Compat (with better-sidebar): the Finder menu item now expands the display
  spelling (`~/…`) against the workspace list and appends `/.` so the folder
  reveal gesture routes to the explorer instead of failing with ENOENT.

## 0.3.0 — 2026-09-05

- Recent sessions split into two collapsible groups: 工作区 (sessions in a
  regular workspace) on top, 外部调用 (automation traffic) below it. External
  covers both workspace-less sessions (headless callers) and sessions attached
  to an `Automation-*` workspace — automation runs do join a real workspace,
  matched by workspace title or directory basename prefix (`Automation-`),
  with a live count so hands-on workspace sessions are no longer buried.
- Collapse state persists in `localStorage` (`dsx2-groups`); searching always
  expands both groups so matches stay reachable. Collapsed groups skip row
  rendering entirely, keeping large automation histories cheap.
- Pinned sessions group unchanged and stays above both groups.

## 0.2.1 — 2026-09-03

- Installable as a profile bundle: declare `dsh.bundle.patch` → `cordis.patch.yml`
  (the loader requires a resolvable patch file per bundle, not just a truthy
  `dsh.bundle`) and give the host half a real `apply`. Behavior unchanged.
- Tab bar: drop the duplicate "+" new-session button (same `startSession`
  flow as the header button) and rename the second tab to 历史会话.
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
