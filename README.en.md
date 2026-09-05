# dsh-plugin-sidebar-views

<!-- Hero -->
<div align="center">
  <b style="font-size: 1.15em;">Two views and pinned sessions for the DSH sidebar — switch between Workspaces and Recent sessions in one click; automation traffic no longer buries your own work.</b><br /><br />
  <a href="https://github.com/NattoCB/dsh-plugin-sidebar-views"><img alt="License" src="https://img.shields.io/badge/License-MIT-yellow.svg" /></a>
  <a href="https://github.com/NattoCB/dsh-plugin-sidebar-views"><img alt="GitHub" src="https://img.shields.io/badge/GitHub-NattoCB%2Fdsh--plugin--sidebar--views-181717" /></a>
  <img alt="version" src="https://img.shields.io/badge/version-0.3.0-blue" /><br /><br />
  <img alt="Two views" src="https://img.shields.io/badge/-Two%20views-4d6bfe" />
  <img alt="Pinned sessions group" src="https://img.shields.io/badge/-Pinned%20sessions%20group-4d6bfe" />
  <img alt="Workspace / external groups" src="https://img.shields.io/badge/-Workspace%20%2F%20external%20groups-4d6bfe" />
  <img alt="Row menu · copy ID" src="https://img.shields.io/badge/-Row%20menu%20·%20copy%20ID-4d6bfe" />
  <img alt="Plain DOM, zero framework" src="https://img.shields.io/badge/-Plain%20DOM%2C%20zero%20framework-4d6bfe" /><br /><br />
  <a href="https://awesome-dsh-plugin.com"><img src="https://awesome-dsh-plugin.com/badge.svg" alt="awesome · featured DSH plugin" /></a><br /><br />
  <b>Integration surface:</b> client-only injection (<code>window.__ModuleLoader__</code> bundle) · localStorage <code>dsx2-pins</code> / <code>dsx2-groups</code> · declares <code>dsh.bundle.patch</code> + <code>dsh.client</code>(web)
</div>

> **Language / 语言**:English ｜ [中文](./README.md)

> A [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) client-side plugin that upgrades the sidebar session list:
> a **Workspaces / Recent sessions** switcher above the list — Workspaces is the native grouping; Recent flattens every
> session into one recency-sorted list with relative timestamps, running-state dots, and the owning workspace as a tag.
> A pinned-sessions group stays on top in both views. Since 0.3.0 the Recent view splits into **Workspace / External**
> groups — automation traffic is collapsed by default with a live count.
> Plain DOM throughout — no React, no portals, no slot takeover. Install into the `web` profile and restart.

## ✨ Features

- **🔀 Two-view switcher**: two tabs above the list — **Workspaces** (the native grouping) and **Recent sessions** (every session in one recency-sorted flat list, with relative timestamps, running/completed/pending state dots, and the owning workspace as a tag).
- **📌 Pinned sessions group**: stays above the list in both views, with a live count, collapse memory, and dimmed rows for sessions that no longer exist.
- **🗂️ Workspace / external groups**: the Recent view splits into **Workspace** (sessions attached to a regular workspace, expanded by default) on top and **External** (workspace-less headless sessions plus `Automation-*` workspace sessions — i.e. automation traffic) below, collapsed by default with a live count. Automation runs do join a real workspace, matched by workspace title or directory basename prefix (`Automation-`). Collapse state persists in localStorage (`dsx2-groups`); searching always expands both groups; collapsed groups skip row rendering entirely, so thousands of automation history rows never build DOM.
- **⋯ Per-row menu**: every row (pinned and flat) gets a "⋯" menu: pin/unpin the session and copy its session id.
- **🔎 Title filter**: a filter box in the Recent view for instant title matching.
- **📁 Open in Finder**: the native workspace "…" menu gains an open-in-Finder item, using the workspace cwd carried by the menu's fiber payload and activated through the stock `workspaces.openPath` service — zero host-side code.
- **🧩 Plain DOM, zero framework**: no React rendering, no portals, no slot takeover. The switcher is planted as the first child of the native sidebar list container; a CSS class hides the native list in Recent mode; a keep-alive interval survives native re-renders; a `ResizeObserver` hides the widget entirely when the sidebar rail collapses.
- **⚡ Large-list performance**: DocumentFragment batch inserts, `content-visibility` so off-screen groups skip layout/paint, and a 400 ms throttle on data refreshes (direct interactions — tab switch, collapse, search — stay unthrottled). Expanding 2400+ rows measures in milliseconds.
- **🔁 Legacy migration**: when the older `dsh-plugin-pin-session` plugin is still installed, its pin list is merged once at startup via `GET /pin-session/pins` (id-deduplicated, stays oldest-first), and every pin/unpin is dual-written to its `POST /pin-session/pin|unpin` during the transition. Both calls are silent no-ops once the legacy plugin is gone.

## Quick Start

### Prerequisites

- DeepSeek Harness installed (`dsh web` runs).
- Client bundles join the boot graph only at process start — restart `dsh web` after installing.

### Install (into the `web` profile)

One command:

```bash
dsh plugin --profile web add github:NattoCB/dsh-plugin-sidebar-views
```

Manual install: in the profile's `package.json`, add the package to `dependencies` and the plugin name to `dsh.profile.bundles`, then run `pnpm install` inside the profile directory and restart `dsh web`.

### Run

After the restart the switcher appears above the sidebar list — zero configuration. View, pin, and collapse state all live in browser localStorage and survive refreshes.

## Storage & migration

Pins and group state live in browser localStorage — pins follow the browser profile, not the DSH host:

| localStorage key | Contents |
|:-----------------|:---------|
| `dsx2-pins` | Pin list (oldest-first `[{ id, title?, pinnedAt }]`) |
| `dsx2-pins-collapsed` | Collapse state of the pinned group |
| `dsx2-groups` | Collapse state of the workspace/external groups (external collapsed by default) |

Migration semantics toward the legacy `dsh-plugin-pin-session`: see **🔁** above — one-shot merge plus transition dual-writes, both silently fault-tolerant.

## Uninstalling safely

Remove the plugin from **both** `dependencies` and `dsh.profile.bundles` in the profile `package.json`, then restart DSH. Deleting the package from `node_modules` while leaving the bundles entry in place makes the boot graph request a `client.js` that no longer exists — the module loader treats that as fatal and the whole web GUI fails to mount.

## Development

```bash
npm test        # node --test: package contract + pin merge logic
```

`client/client.js` is a `window.__ModuleLoader__.load({ id, factory })` bundle in the same shape as DSH's own client bundles. The pin-merge logic is exported as `exports._mergePins` so tests exercise the real code, not a copy.

---

<div align="center">

[MIT License](https://github.com/NattoCB/dsh-plugin-sidebar-views) · [GitHub repository](https://github.com/NattoCB/dsh-plugin-sidebar-views) · [Open an issue](https://github.com/NattoCB/dsh-plugin-sidebar-views/issues)

</div>
