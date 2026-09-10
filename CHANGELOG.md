# Changelog

## 0.3.17 — 2026-09-09

- Groups with fewer than five sessions (no native overflow button) had
  their control row inserted inside the header wrapper span, landing
  ABOVE the sessions. The row now appends at the section tail for such
  groups. GUI-verified with a constructed 2-row group (tail, then
  auto-removed on empty). Tests 34/34.

## 0.3.16 — 2026-09-09

- State machine rebuilt around the native tree's actual four shapes
  (preview / expanded / folded-to-header / empty). Folding now always
  goes through the group header click — React's own toggle — so a folded
  group re-expands cleanly from the header with no stale state hiding it
  again (the cap-0 mechanism that fought React's folded shape and caused
  "展开的瞬间又被收起" is gone). Empty/folded shapes render no controls.
  Full transition matrix GUI-verified: C→A→B→page→C. Tests 33/33.

## 0.3.15 — 2026-09-09

- Re-lands 0.3.13's intent with the reverse path actually verified: a
  fully folded workspace shows only 展开其余 5 个会话 (the no-op 收起 is
  hidden), and unfolding from that state was tested end-to-end this time
  (fold → unfold → page, all steps green).
- Groups with zero rendered session rows (data still arriving, or truly
  empty workspaces) render no control row at all — no lone 收起 hanging
  under a bare header. Tests 31/31.

## 0.3.14 — 2026-09-09

- Reverted 0.3.13 (hiding 收起 on fully folded workspaces): it broke
  re-expanding from the folded state. Back to 0.3.12 behavior — the
  收起 button stays visible on a folded workspace and unfolding works.

## 0.3.13 — 2026-09-09

- A fully folded workspace no longer shows the 收起 button (it would be
  a no-op there). REVERTED in 0.3.14: it broke unfolding.

## 0.3.12 — 2026-09-09

- A group whose collapsed page already holds every session shows nothing
  but 收起 — the phantom 展开其余 5 个会话 is gone. The real remaining
  count is read from the native label (the DOM only ever holds the first
  5 rows). Tests 30/30.

## 0.3.11 — 2026-09-09

- Every workspace group shows 「展开其余 5 个会话 | 收起」 in its default
  state; the native overflow button (展开其余 165 个会话) can no longer
  appear — display:none!important via a hash-independent CSS rule, so
  React rebuilds cannot flash it back. 收起 folds the workspace to its
  header row. Injection hardened: sweep React-torn orphan controls,
  reuse the surviving row, compare-first writes (settled tree = zero
  mutations). Tests 29/29.

## 0.3.10 — 2026-09-09

- The native tree's expanded groups are capped to the first page with an
  展开更多 5 个会话 control; native rows keep lineage indentation, drag
  order and icons. Idempotent writes + a debounced body-level observer
  (an undebounced first draft scanned on every mutation and burned a CPU
  core — fixed before shipping). Tests 28/28.

## 0.3.9 — 2026-09-09

- Reverted 0.3.8's takeover of the workspaces tab: it replaced the native
  tree wholesale and lost lineage indentation, workspace drag-order and
  per-workspace icons. Pin reaches the native session menu through the
  same DOM-injection channel as 复制 Session ID (固定会话/取消固定,
  label reflecting live pin state). findSessionId anchors on both id
  shapes (session-<uuid> and dsh-automation-session-<uuid>). The show-more
  row in the history tab gained a 收起 control. Tests 27/27.

## 0.3.8 — 2026-09-09

- (SUPERSEDED — taken over the workspaces tab with a self-drawn group
  list; reverted in 0.3.9 as overreach.)

## 0.3.7 — 2026-09-09

- Feature: cold-session title self-heal. session_projcache.json stopped
  gaining rows on 2026-08-31 (host-side write path, upstream bug #2945
  family), so every session created after that date showed the workspace
  directory basename in the sidebar until it was opened. The host half now
  serves GET /sidebar-views/titles: a persistent {sessionId: title} index
  built from the session logs' own session/title events (frame-level zstd
  scan + decode, ≤8 frames / 16MB per log, last rename wins). The index
  persists at ~/.dsh/storages/sidebar-views/title-index.json; rebuilds are
  single-flight, incremental by mtime (~2.4ms per changed log, measured) and
  run in background — requests return the cached table immediately with
  building:true while the first cold build runs (~2s for 832 logs).
- The client fetches the index on mount and injects MISSING titles into the
  client-side projection stores (projectionStore(id).apply("title", t, 1)),
  which feeds both the sidebar-views rows AND the native workspace tree
  through the normal buildListSnapshot path — real names appear right after
  a reload, no clicking required. Existing rows are never overwritten: the
  seq watermark keeps host projections and rename pushes authoritative, and
  blank/never-named sessions keep their 新会话/basename fallback.
- Render cache integration: every applied title bumps a titleVersion that
  participates in the rows fingerprint, so healed titles repaint without
  violating the 0.3.6 skip logic.
- Host half changed → requires one dsh web restart to mount the route; the
  client degrades silently (fetch 404 → no-op) until then. Tests 25/25.
- Fix (same day, post-restart verify): projectionStore lives on
  sessions.manager (SessionManager), not on the SessionRuntime facade —
  injection is now resolved through a manager fallback (this was why the
  first restart looked like a no-op; titles only appeared for opened
  sessions via the host's live-registry merge).
- Grouping is membership-only again: removed the cwd-prefix fallback —
  headless AMV drain workers run inside workspace directories, so a cwd
  match wrongly exiled them into the workspace group (Jasper 2026-09-09).
  Unregistered sessions are 外部调用; host side also accepts
  dsh-automation-session-* log ids now (needs the next restart to serve
  them, though those logs carry no session/title events today).
- Pagination: the "show more" flow renders 5 rows at a time
  (展开更多 5 个会话) instead of 300 + 2000 — browsing 555 workspace
  sessions no longer dumps hundreds of rows per click. Tests 26/26.

## 0.3.6 — 2026-09-09

- Perf: the sidebar list no longer rebuilds the entire DOM per render at
  20k-session scale. Each group renders a capped first chunk (300 rows) plus
  a 显示其余 N 条 button that grows the cap by 2000; a row-model cache keyed
  on a cheap data fingerprint (counts + boundary ids + workspace shape +
  filter) skips re-filtering/re-sorting and DOM rebuilds entirely when only
  highlights or pins changed. The 30s ticker now rewrites the relative-time
  text of rendered rows (updateTimes) instead of rebuilding the list.
  Measured live at 20,305 sessions: tab switch → first paint 28ms, ~2k DOM
  nodes total (previously ~120k nodes / multi-second rebuilds).
- Perf: refreshBaseline() gains a 45s min-gap gate. The 120s ticker,
  visibilitychange and tab switches used to each trigger a full host
  session.list pull — a ~14s full-disk scan at this scale that stacked into
  concurrent 200%+ CPU spins; extra triggers inside the gap are absorbed and
  the next ticker picks them up.
- Live-verified in the real GUI at 20,305 sessions: show-more click 23ms
  (300→2300 rows), search "AMV" 51ms with capped rendering, group
  collapse/expand, pin/unpin (pins 9→10→9, no residue), tab switches all
  green. Tests 20/20.

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
