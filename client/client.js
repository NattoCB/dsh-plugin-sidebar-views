window.__ModuleLoader__.load({
	id: "dsh-plugin-sidebar-views",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });

		// ── CSS (sidebar views + pinned group + row menu) ─────────────────
		const css = ".dsx2-host{order:-1;flex:none;display:flex;flex-direction:column;gap:6px;padding:2px 0 6px}html.dsx2-recent-on .dsx2-host{flex:1 1 0;min-height:0}html.dsx2-recent-on [data-slot=\"sidebar.workspaces\"] > div > :not(.dsx2-host){display:none!important}.dsx2-bar{display:flex;align-items:center;gap:6px;flex:none}.dsx2-tabs{display:flex;flex:1;min-width:0;background:var(--dsw-alias-bg-layer-1,rgba(128,128,128,.08));border:1px solid var(--dsw-alias-border-l1,transparent);border-radius:9px;padding:2px;gap:2px}.dsx2-tab{flex:1;display:flex;align-items:center;justify-content:center;gap:5px;height:24px;border:none;border-radius:7px;background:transparent;color:var(--dsw-alias-label-secondary);cursor:pointer;font-size:12px;line-height:16px;padding:0 6px;white-space:nowrap;overflow:hidden;font-family:inherit}.dsx2-tab:hover{color:var(--dsw-alias-label-primary)}.dsx2-tab-active{background:var(--dsw-alias-bg-layer-2,rgba(128,128,128,.18));color:var(--dsw-alias-label-primary);font-weight:500}.dsx2-search{display:none;align-items:center;gap:6px;height:26px;padding:0 8px;border:1px solid var(--dsw-alias-border-l1,transparent);border-radius:8px;color:var(--dsw-alias-label-tertiary);flex:none}html.dsx2-recent-on .dsx2-search{display:flex}.dsx2-search-input{flex:1;min-width:0;border:none;outline:none;background:transparent;color:var(--dsw-alias-label-primary);font-size:12px;line-height:16px;font-family:inherit}.dsx2-search-input::placeholder{color:var(--dsw-alias-label-tertiary)}.dsx2-pinned{flex:none;display:flex;flex-direction:column;min-height:0}.dsx2-pinned-head{display:flex;align-items:center;gap:5px;height:26px;padding:0 6px;border-radius:8px;cursor:pointer;color:var(--dsw-alias-label-secondary);font-size:12px;font-weight:600;user-select:none;flex:none}.dsx2-pinned-head:hover{background:var(--dsw-alias-interactive-bg-hover,rgba(128,128,128,.12));color:var(--dsw-alias-label-primary)}.dsx2-pin-icon{flex:none;display:inline-flex;align-items:center;color:var(--dsw-alias-brand-primary,#6366f1)}.dsx2-chevron{flex:none;font-size:10px;line-height:1;color:var(--dsw-alias-label-tertiary);transition:transform .15s ease}.dsx2-chevron-closed{transform:rotate(-90deg)}.dsx2-pinned-count{flex:none;color:var(--dsw-alias-label-tertiary);font-weight:400;font-size:11px}.dsx2-pinned-rows{display:flex;flex-direction:column;max-height:150px;overflow-y:auto;padding-bottom:2px}.dsx2-pinned-closed .dsx2-pinned-rows{display:none}.dsx2-list{display:none;flex:1;min-height:0;overflow-y:auto;padding-bottom:12px}html.dsx2-recent-on .dsx2-list{display:block}.dsx2-row{display:flex;align-items:center;gap:7px;height:30px;padding:0 8px;border-radius:8px;cursor:pointer;color:var(--dsw-alias-label-primary);font-size:13px;user-select:none}.dsx2-row:hover{background:var(--dsw-alias-bg-layer-1,rgba(128,128,128,.1))}.dsx2-row-current{background:var(--dsw-alias-bg-layer-2,rgba(128,128,128,.18))}.dsx2-row-dead{opacity:.45;cursor:default}.dsx2-row-title{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.dsx2-row-pin{flex:none;display:inline-flex;align-items:center;color:var(--dsw-alias-brand-primary,#6366f1)}.dsx2-row-tag{flex:none;max-width:40%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--dsw-alias-label-tertiary);font-size:11px;background:var(--dsw-alias-bg-layer-1,rgba(128,128,128,.1));border-radius:5px;padding:1px 5px}.dsx2-row-time{flex:none;color:var(--dsw-alias-label-tertiary);font-size:11px}.dsx2-more{display:none;flex:none;width:20px;height:20px;align-items:center;justify-content:center;border:none;background:transparent;border-radius:5px;color:var(--dsw-alias-label-tertiary);cursor:pointer;font-size:13px;line-height:1;padding:0}.dsx2-row:hover .dsx2-more{display:inline-flex}.dsx2-more:hover{background:var(--dsw-alias-bg-layer-2,rgba(128,128,128,.18));color:var(--dsw-alias-label-primary)}.dsx2-dot{width:7px;height:7px;border-radius:50%;flex:none}.dsx2-dot-run{background:var(--dsw-alias-state-success-primary,#22c55e);animation:dsx2-pulse 1.6s ease-in-out infinite}.dsx2-dot-done{background:var(--dsw-alias-state-success-primary,#22c55e);opacity:.55}.dsx2-dot-warn{background:var(--dsw-alias-state-warn-primary,#f59e0b)}@keyframes dsx2-pulse{0%,100%{opacity:1}50%{opacity:.35}}.dsx2-empty{color:var(--dsw-alias-label-tertiary);padding:14px 10px;font-size:12px}.dsx2-more-btn{display:block;width:calc(100% - 16px);margin:2px 8px 0 8px;height:28px;border:none;background:transparent;border-radius:8px;color:var(--dsw-alias-label-tertiary);cursor:pointer;font-size:12px;font-family:inherit;text-align:left;padding:0 12px 0 28px}.dsx2-more-btn:hover{color:var(--dsw-alias-label-secondary);background:var(--dsw-alias-bg-layer-1,rgba(128,128,128,.1))}.dsx2-grp-rows{content-visibility:auto;contain-intrinsic-size:auto 30px}.dsx2-grp-head{margin-top:3px}.dsx2-grp-icon{color:var(--dsw-alias-label-tertiary)}.dsx2-menu{position:fixed;z-index:9999;min-width:170px;background:var(--dsw-alias-bg-layer-1,#ffffff);border:1px solid var(--dsw-alias-border-l2,rgba(0,0,0,.12));border-radius:10px;padding:4px;box-shadow:0 8px 24px rgba(0,0,0,.18);display:flex;flex-direction:column}.dsx2-menu-item{display:flex;align-items:center;gap:8px;height:30px;padding:0 10px;border:none;background:transparent;border-radius:7px;color:var(--dsw-alias-label-primary);cursor:pointer;font-size:13px;text-align:left;font-family:inherit;white-space:nowrap}.dsx2-menu-item:hover{background:var(--dsw-alias-interactive-bg-hover,rgba(128,128,128,.12))}@media (prefers-reduced-motion:reduce){.dsx2-dot-run{animation:none}}";
		const cssTagId = "dsh-plugin-sidebar-views/sidebar.css";
		if (typeof document !== "undefined" && !document.querySelector("style[data-plugin-css=\"" + cssTagId + "\"]")) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-plugin-sidebar-views";
			tag.dataset.pluginCss = cssTagId;
			tag.textContent = css;
			document.head.appendChild(tag);
		}

		const SEARCH_SVG = '<svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true"><circle cx="7" cy="7" r="4.2" stroke="currentColor" stroke-width="1.2"/><path d="m10.2 10.2 3 3" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>';
		const PIN_SVG = '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 17v5"/><path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1z"/></svg>';
		const TERMINAL_SVG = '<svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 4.5 6.5 8 3 11.5"/><path d="M8.5 11.5H13"/></svg>';

		function folderGlyphSvg() {
			return '<svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" aria-hidden="true">' + FOLDER_SVG_PATH + "</svg>";
		}

		const inject = ["sessions", "workspaces", "timer"];

		// ── state ──────────────────────────────────────────────────────────
		let sessions;
		let workspaces;
		let sList;
		let wList;
		let disposed = false;
		let mode = "workspaces";
		let filter = "";
		let grpState = { ws: false, ext: true };
		let railHidden = false;
		let hostDiv = null;
		let tabW = null;
		let tabR = null;
		let searchInput = null;
		let listDiv = null;
		let pinnedSection = null;
		let pinnedRows = null;
		let pinnedCount = null;
		let keepAlive = null;
		let timeTicker = null;
		let unsub1 = null;
		let unsub2 = null;
		let refreshTicker = null;
		let onVisible = null;
		let ctxRef = null;
		let lastHealAt = 0;
		let renderQueued = false;
		let resizer = null;
		let menuEl = null;
		let wsMenuObserver = null;

		// ── perf guards (20k-session scale, 2026-09-09) ────────────────────
		// Host session.list costs ~14s at 20k sessions, so every avoidable
		// full pull or full list rebuild is user-visible lag. Three guards:
		// refresh throttling, a row-model cache keyed on a data fingerprint,
		// and a per-group render cap with an incremental "show more" button.
		const REFRESH_MIN_GAP_MS = 45000;
		const RENDER_CHUNK_FIRST = 300;
		const RENDER_CHUNK_MORE = 2000;
		let lastRefreshAt = 0;
		let rowsCache = null;
		let lastRenderFp = "";
		let renderLimit = { ws: RENDER_CHUNK_FIRST, ext: RENDER_CHUNK_FIRST };

		// ── cold-session title self-heal (host index, 2026-09-09) ─────────
		// session_projcache.json stopped gaining rows on 2026-08-31, so
		// sessions created after that ship no `title` projection and every
		// row shows the workspace basename until opened. The host half serves
		// GET /sidebar-views/titles (persisted index built from the logs'
		// session/title events); the client injects missing titles into the
		// client-side projection stores, which feeds BOTH this view and the
		// native workspace tree through the normal summary path.
		let titleMap = null; // Map<sessionId, title> from the host index
		let titleInjected = new Set(); // ids already resolved or known-missing
		let titleRetries = 0;
		const TITLE_RETRY_MAX = 20;
		let titleVersion = 0; // bumps per applied title so the render fingerprint sees it

		function injectTitles() {
			if (titleMap === null || titleMap.size === 0) return;
			if (sessions === undefined || typeof sessions.projectionStore !== "function") return;
			const list = sList !== undefined ? safeSnap(sList) : undefined;
			if (list === undefined || list.ids === undefined) return;
			const byId = list.byId || {};
			for (const id of list.ids) {
				if (titleInjected.has(id)) continue;
				const s = byId[id];
				if (s === undefined) { titleInjected.add(id); continue; }
				if (s.title !== undefined && s.title !== "") { titleInjected.add(id); continue; }
				const t = titleMap.get(id);
				if (t === undefined || t === "") continue; // not in index — retry after next fetch
				try {
					const store = sessions.projectionStore(id);
					// Only fill a MISSING title; an existing row (host projection
					// or rename push) stays authoritative via the seq watermark.
					if (store !== undefined && store.get !== undefined && store.get("title") === undefined && typeof store.apply === "function") {
						store.apply("title", String(t), 1);
						titleVersion += 1;
					}
				} catch (error) {}
				titleInjected.add(id);
			}
		}

		function loadTitles() {
			if (disposed) return;
			fetch("/sidebar-views/titles").then((r) => (r.ok ? r.json() : null)).then((body) => {
				if (disposed || body === null || typeof body !== "object") return;
				const titles = body.titles !== null && typeof body.titles === "object" ? body.titles : {};
				titleMap = new Map(Object.entries(titles));
				// A completed index is authoritative for this pass: anything it
				// does not cover (blank/never-named sessions) is marked so the
				// per-data-tick scan stays O(new ids). A building response keeps
				// unknown ids retryable until the final fetch below.
				if (body.building !== true) {
					const ids = (sList !== undefined ? safeSnap(sList) : undefined)?.ids || [];
					for (const id of ids) if (titleMap.has(id) === false) titleInjected.add(id);
				}
				injectTitles();
				renderList();
				if (body.building === true && titleRetries < TITLE_RETRY_MAX) {
					titleRetries += 1;
					window.setTimeout(loadTitles, 3000);
				}
			}).catch(() => {});
		}

		// ── helpers ────────────────────────────────────────────────────────
		function relTime(ts, now) {
			const diff = Math.max(0, now - ts);
			if (diff < 60000) return "刚刚";
			if (diff < 3600000) return Math.floor(diff / 60000) + " 分钟前";
			if (diff < 86400000) return Math.floor(diff / 3600000) + " 小时前";
			if (diff < 7 * 86400000) return Math.floor(diff / 86400000) + " 天前";
			const d = new Date(ts);
			return (d.getMonth() + 1) + "/" + d.getDate();
		}

		function byRecency(a, b) {
			if (b.updatedAt !== a.updatedAt) return b.updatedAt - a.updatedAt;
			return a.id < b.id ? -1 : 1;
		}

		// Split recency-sorted rows into workspace-backed and external
		// sessions. External = created with no workspace at all (headless
		// base requests, e.g. `dsh --profile <x>` callers). Sessions attached
		// to any workspace are ordinary workspace sessions regardless of the
		// workspace's name — an Automation-* workspace is still a real
		// workspace, and its newest runs belong at the top of the workspace
		// group (Jasper, 2026-09-06).
		function partitionByWorkspace(rows, wsOf) {
			const ws = [];
			const ext = [];
			for (const s of rows) {
				const w = wsOf.get(s.id);
				if (w !== undefined) ws.push(s);
				else ext.push(s);
			}
			return { ws: ws, ext: ext };
		}

		// The host registers sessions into workspaces late (fleet runs show up
		// in session.list long before their workspace membership lands), so
		// registry-only membership bounces fresh runs into the external group.
		// Fall back to matching the session cwd against workspace paths —
		// longest matching prefix wins, registry entries always win.
		function fillWorkspaceByCwd(wsOf, rows, workspaces) {
			const prefixes = [];
			for (const w of workspaces || []) {
				if (typeof w.path === "string" && w.path !== "") {
					prefixes.push({ prefix: w.path.replace(/\/+$/, ""), w: w });
				}
			}
			if (prefixes.length === 0) return;
			for (const s of rows) {
				if (wsOf.has(s.id)) continue;
				const cwd = typeof s.cwd === "string" ? s.cwd.replace(/\/+$/, "") : "";
				if (cwd === "") continue;
				let best = null;
				for (const p of prefixes) {
					if (cwd === p.prefix || cwd.indexOf(p.prefix + "/") === 0) {
						if (best === null || p.prefix.length > best.prefix.length) best = p;
					}
				}
				if (best !== null) wsOf.set(s.id, best.w);
			}
		}

		function loadGroupState() {
			try {
				const raw = JSON.parse(window.localStorage.getItem("dsx2-groups") || "{}");
				return { ws: raw.ws === true, ext: raw.ext !== false };
			} catch (error) { return { ws: false, ext: true }; }
		}

		function saveGroupState() {
			try { window.localStorage.setItem("dsx2-groups", JSON.stringify(grpState)); } catch (error) {}
		}

		function safeSnap(source) {
			try { return source.getSnapshot(); } catch (error) { return undefined; }
		}

		// The client runtime only pulls the full session list when the page
		// (re)connects; sessions created afterwards by CLI or automation runs
		// arrive through no push frame, so this view (and the native tree) stay
		// stale until a reload. Re-pull the baseline ourselves — the store
		// merge is idempotent and the pull itself is single-flight.
		// At 20k sessions each pull is a ~14s host scan, so the 120s ticker,
		// visibilitychange and tab switches funnel through a min-gap gate:
		// within the gap a trigger is absorbed (the next ticker picks it up).
		function refreshBaseline() {
			if (disposed) return;
			const now = Date.now();
			if (now - lastRefreshAt < REFRESH_MIN_GAP_MS) return;
			lastRefreshAt = now;
			rebindSessions();
			if (sessions === undefined || typeof sessions.refresh !== "function") return;
			try {
				const done = sessions.refresh();
				// A swapped store may never notify the old subscription, so
				// render explicitly once the pull settles instead of waiting.
				if (done !== undefined && typeof done.then === "function") done.then(() => { renderList(); }, () => {});
			} catch (error) {}
		}

		// The runtime can re-materialize its module graph and swap the sessions
		// facade plus its list store; a view still holding the old store reads
		// the constructor-initial snapshot (ids:0, phase:"pending") forever, and
		// no pull ever reaches it. Re-read the live service from ctx and swap
		// every captured reference when the instance changed.
		function rebindSessions() {
			if (disposed || ctxRef === null) return;
			let live;
			try { live = ctxRef.get("sessions"); } catch (error) { return; }
			if (live === undefined || live === sessions) return;
			if (unsub1 !== null) { try { unsub1(); } catch (error) {} unsub1 = null; }
			sessions = live;
			sList = sessions.list;
			try { unsub1 = sList.subscribe(onData); } catch (error) {}
		}

		// The orphaned-store signature: zero ids while the store never became
		// ready. Throttled so repeated renders during one outage fire one heal.
		function healOrphanedStore() {
			if (disposed) return;
			const now = Date.now();
			if (now - lastHealAt >= 4000) {
				lastHealAt = now;
				refreshBaseline();
			}
		}

		function onData() {
			renderPinned();
			injectTitles();
			if (mode !== "recent" || renderQueued) return;
			renderQueued = true;
			window.setTimeout(() => {
				renderQueued = false;
				if (disposed === false && mode === "recent") renderList();
			}, 400);
		}

		function loadPins() {
			try {
				const raw = JSON.parse(window.localStorage.getItem("dsx2-pins") || "[]");
				return Array.isArray(raw) ? raw.filter((p) => p && typeof p.id === "string") : [];
			} catch (error) { return []; }
		}

		function savePins(pins) {
			try { window.localStorage.setItem("dsx2-pins", JSON.stringify(pins)); } catch (error) {}
		}

		function isPinned(id) {
			return loadPins().some((p) => p.id === id);
		}

		// Legacy dual-write: the old dsh-plugin-pin-session host API, if the
		// process still runs it, stays in sync; 404/dead fetches are harmless.
		function legacyPost(action, id) {
			try {
				fetch("/pin-session/" + action, {
					method: "POST",
					headers: { "content-type": "application/json" },
					body: JSON.stringify({ id })
				}).catch(() => {});
			} catch (error) {}
		}

		function pinSession(id, title) {
			const pins = loadPins();
			const old = pins.find((p) => p.id === id);
			const next = pins.filter((p) => p.id !== id);
			next.push({ id: id, title: title, pinnedAt: old !== undefined && Number.isFinite(old.pinnedAt) ? old.pinnedAt : Date.now() });
			savePins(next);
			legacyPost("pin", id);
			lastRenderFp = "";
			renderPinned();
			renderList();
		}

		function unpinSession(id) {
			savePins(loadPins().filter((p) => p.id !== id));
			legacyPost("unpin", id);
			lastRenderFp = "";
			renderPinned();
			renderList();
		}

		// Pure merge used by the one-shot migration: legacy pins are added by
		// id, never duplicated, and the result stays oldest-first. Exposed on
		// exports so tests exercise the real code path.
		function mergePins(local, remote) {
			const byId = new Map();
			for (const p of local) byId.set(p.id, p);
			for (const r of remote) {
				if (r && typeof r.id === "string" && byId.has(r.id) === false) {
					byId.set(r.id, { id: r.id, title: typeof r.title === "string" ? r.title : undefined, pinnedAt: Number.isFinite(r.pinnedAt) ? r.pinnedAt : 0 });
				}
			}
			return Array.from(byId.values()).sort((a, b) => a.pinnedAt - b.pinnedAt);
		}

		// One-shot merge migration from the legacy plugin while its API lives.
		function migratePins() {
			try {
				fetch("/pin-session/pins").then((r) => (r.ok ? r.json() : null)).then((body) => {
					if (disposed || body === null || typeof body !== "object") return;
					const remote = Array.isArray(body) ? body : (Array.isArray(body.pins) ? body.pins : []);
					if (remote.length === 0) return;
					savePins(mergePins(loadPins(), remote));
					renderPinned();
				}).catch(() => {});
			} catch (error) {}
		}

		function copyText(text) {
			if (navigator.clipboard !== undefined && navigator.clipboard.writeText !== undefined) {
				navigator.clipboard.writeText(text).catch(() => { fallbackCopy(text); });
			} else fallbackCopy(text);
		}

		function fallbackCopy(text) {
			const ta = document.createElement("textarea");
			ta.value = text;
			ta.style.position = "fixed";
			ta.style.opacity = "0";
			document.body.appendChild(ta);
			ta.select();
			try { document.execCommand("copy"); } catch (error) {}
			ta.remove();
		}

		function closeMenu() {
			if (menuEl !== null) { menuEl.remove(); menuEl = null; }
		}

		function menuItemsFor(id, title) {
			return isPinned(id)
				? [
					{ label: "取消固定", action: () => unpinSession(id) },
					{ label: "复制 Session ID", action: () => copyText(id) }
				]
				: [
					{ label: "固定会话", action: () => pinSession(id, title) },
					{ label: "复制 Session ID", action: () => copyText(id) }
				];
		}

		function openMenu(x, y, items) {
			closeMenu();
			menuEl = document.createElement("div");
			menuEl.className = "dsx2-menu";
			for (const it of items) {
				const btn = document.createElement("button");
				btn.type = "button";
				btn.className = "dsx2-menu-item";
				btn.textContent = it.label;
				btn.addEventListener("click", (e) => { e.stopPropagation(); closeMenu(); it.action(); });
				menuEl.appendChild(btn);
			}
			document.body.appendChild(menuEl);
			const rect = menuEl.getBoundingClientRect();
			const left = Math.max(8, Math.min(x, window.innerWidth - rect.width - 8));
			let top = y;
			if (y + rect.height > window.innerHeight - 8) top = y - rect.height;
			menuEl.style.left = left + "px";
			menuEl.style.top = Math.max(8, top) + "px";
			window.setTimeout(() => { document.addEventListener("click", closeMenu, { once: true }); }, 0);
		}

		function attachMore(parent, id, title) {
			const more = document.createElement("button");
			more.type = "button";
			more.className = "dsx2-more";
			more.title = "更多操作";
			more.textContent = "⋯";
			more.addEventListener("click", (e) => {
				e.stopPropagation();
				const r = more.getBoundingClientRect();
				openMenu(r.left, r.bottom + 4, menuItemsFor(id, title));
			});
			parent.appendChild(more);
		}

		// ── native workspace "…" menu: open in Finder ─────────────────────
		// The native menu portal reuses one container per surface, so toggling
		// it produces no childList mutations — a childList observer never
		// fires. Instead we rescan on every captured click (the "…" button
		// opens the menu) plus the existing slow host poll as a fallback, and
		// key the inserted item on a class so a React re-render re-adds it.
		function findWorkspaceCwd(el) {
			const fk = Object.keys(el).find((k) => k.startsWith("__reactFiber$"));
			if (fk === undefined) return undefined;
			let f = el[fk];
			let hops = 0;
			while (f !== null && f !== undefined && hops < 30) {
				const p = f.memoizedProps;
				if (p !== null && typeof p === "object" && p.content !== null && typeof p.content === "object") {
					const cwd = p.content.props !== null && typeof p.content.props === "object" ? p.content.props.cwd : undefined;
					if (typeof cwd === "string" && cwd.length > 0) return cwd;
				}
				f = f.return;
				hops += 1;
			}
			return undefined;
		}

		// Session id for a native session menu: the portal menu's fiber chain
		// crosses SessionNodeItem, whose props.node carries the session.
		function findSessionId(el) {
			const fk = Object.keys(el).find((k) => k.startsWith("__reactFiber$"));
			if (fk === undefined) return undefined;
			let f = el[fk];
			let hops = 0;
			while (f !== null && f !== undefined && hops < 30) {
				const p = f.memoizedProps;
				if (p !== null && typeof p === "object" && p.node !== null && typeof p.node === "object") {
					const id = p.node.id;
					if (typeof id === "string" && id.indexOf("session-") === 0) return id;
				}
				f = f.return;
				hops += 1;
			}
			return undefined;
		}

		// Folder glyph for the Finder item, drawn in the native icon style
		// (16x16, stroke inherits the item color).
		const FOLDER_SVG_PATH = '<path d="M1.75 4.6c0-1.05.85-1.9 1.9-1.9h2.5c.5 0 .98.2 1.34.55l.86.85h3.9c1.05 0 1.9.85 1.9 1.9v5.3c0 1.05-.85 1.9-1.9 1.9H3.65c-1.05 0-1.9-.85-1.9-1.9V4.6z" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/>';

		// Copy glyph in the same native icon style.
		const COPY_SVG_PATH = '<rect x="5.4" y="5.4" width="7.8" height="7.8" rx="1.6" stroke="currentColor" stroke-width="1.2" fill="none"/><path d="M10.6 3.2H4.4c-1 0-1.8.8-1.8 1.8v6.2" stroke="currentColor" stroke-width="1.2" fill="none" stroke-linecap="round"/>';

		// Build a native-looking menu item by cloning an existing one and
		// swapping the icon glyph and label.
		function buildMenuItem(menu, markerClass, svgPath, label) {
			if (menu.querySelector("." + markerClass) !== null) return null;
			const items = Array.from(menu.querySelectorAll('[role="menuitem"]'));
			if (items.length === 0) return null;
			const plain = items.find((mi) => !/(^|[\s_-])danger/i.test(mi.className)) || items[0];
			const item = plain.cloneNode(true);
			item.removeAttribute("data-disabled");
			item.setAttribute("aria-disabled", "false");
			item.classList.add(markerClass);
			item.classList.remove(...Array.from(item.classList).filter((c) => /danger/i.test(c)));
			const iconSpan = item.querySelector("span");
			const text = document.createTextNode(label);
			item.textContent = "";
			if (iconSpan !== null) {
				const svg = iconSpan.querySelector("svg");
				if (svg !== null) {
					svg.setAttribute("viewBox", "0 0 16 16");
					svg.innerHTML = svgPath;
				}
				item.appendChild(iconSpan);
			}
			item.appendChild(text);
			return item;
		}

		function dismissNativeMenu() {
			// The native Menu listens for pointerdown to dismiss.
			document.body.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }));
		}

		// React re-renders the open menu and wipes injected items; watch the
		// portal container and re-inject on the next scan. The marker-class
		// guard keeps re-injection a no-op once present, so the observer and
		// our own writes cannot feed each other.
		let menuFixObserver = null;
		function watchMenuPortals() {
			if (menuFixObserver !== null) { menuFixObserver.disconnect(); menuFixObserver = null; }
			const menu = document.querySelector('[role="menu"]');
			if (menu === null) return;
			menuFixObserver = new MutationObserver(() => scheduleWorkspaceScan());
			menuFixObserver.observe(menu, { childList: true, subtree: true });
		}

		function enhanceWorkspaceMenus() {
			for (const menu of document.querySelectorAll('[role="menu"]')) {
				const cwd = findWorkspaceCwd(menu);
				if (cwd !== undefined) {
					if (workspaces !== undefined && typeof workspaces.openPath === "function") {
						const item = buildMenuItem(menu, "dsx2-finder-item", FOLDER_SVG_PATH, "在 Finder 中打开");
						if (item === null) continue;
						item.addEventListener("click", (e) => {
							e.stopPropagation();
							dismissNativeMenu();
							try { workspaces.openPath(expandDisplayCwd(cwd, safeSnap(wList)) + "/."); } catch (error) {}
						});
						// Destructive rows (删除 workspace) render last; keep the
						// Finder entry above them so a stray click cannot delete. Items
						// may be nested in wrapper nodes, so insert beside the danger
						// row inside its own parent, not at the menu root.
						const danger = Array.from(menu.querySelectorAll('[role="menuitem"]')).find((mi) => /(^|[\s_-])danger/i.test(mi.className));
						if (danger !== undefined) danger.parentNode.insertBefore(item, danger);
						else menu.appendChild(item);
					}
					continue;
				}
				const sid = findSessionId(menu);
				if (sid !== undefined) {
					const item = buildMenuItem(menu, "dsx2-sid-item", COPY_SVG_PATH, "复制 Session ID");
					if (item === null) continue;
					item.addEventListener("click", (e) => {
						e.stopPropagation();
						dismissNativeMenu();
						copyText(sid);
					});
					menu.appendChild(item);
				}
			}
			watchMenuPortals();
		}

		// The native menu's cwd prop is a display spelling (the host abbreviates
		// the POSIX home to "~"), while openPath's contract expects the absolute
		// Host-facing form; better-sidebar's interception joins "~/x" onto the
		// workspace root and fails with ENOENT. Expand against the workspace
		// list's absolute paths; unmatched values pass through untouched.
		function expandDisplayCwd(cwd, wlist) {
			if (typeof cwd !== "string" || cwd.startsWith("~") === false) return cwd;
			const rest = cwd.slice(1).replace(/^\/+/, "").toLowerCase();
			if (rest === "") return cwd;
			const items = wlist !== null && typeof wlist === "object" && Array.isArray(wlist.items) ? wlist.items : [];
			for (const w of items) {
				const p = w !== null && typeof w === "object" ? w.path : undefined;
				if (typeof p === "string" && p.toLowerCase().endsWith("/" + rest)) return p;
			}
			return cwd;
		}

		let wsScanPending = false;
		function scheduleWorkspaceScan() {
			if (wsScanPending) return;
			wsScanPending = true;
			window.setTimeout(() => { wsScanPending = false; try { enhanceWorkspaceMenus(); } catch (error) {} }, 30);
		}

		function watchWorkspaceMenus() {
			if (wsMenuObserver === null) {
				document.addEventListener("click", scheduleWorkspaceScan, true);
				wsMenuObserver = { disconnect: () => document.removeEventListener("click", scheduleWorkspaceScan, true) };
			}
			scheduleWorkspaceScan();
		}

		function pinMark() {
			const pin = document.createElement("span");
			pin.className = "dsx2-row-pin";
			pin.innerHTML = PIN_SVG;
			return pin;
		}

		function applyModeClass() {
			const on = mode === "recent" && railHidden === false;
			document.documentElement.classList.toggle("dsx2-recent-on", on);
		}

		function syncTabs() {
			if (tabW === null) return;
			tabW.classList.toggle("dsx2-tab-active", mode === "workspaces");
			tabR.classList.toggle("dsx2-tab-active", mode === "recent");
		}

		function setMode(next) {
			mode = next;
			syncTabs();
			applyModeClass();
			if (mode === "recent") {
				refreshBaseline();
				renderList();
			}
		}

		function emptyNote(text) {
			const el = document.createElement("div");
			el.className = "dsx2-empty";
			el.textContent = text;
			return el;
		}

		// Collapsible group header styled after the pinned-session head.
		function groupHeadEl(iconSvg, label, count, collapsed, onToggle) {
			const head = document.createElement("div");
			head.className = "dsx2-pinned-head dsx2-grp-head";
			const icon = document.createElement("span");
			icon.className = "dsx2-pin-icon dsx2-grp-icon";
			icon.innerHTML = iconSvg;
			const text = document.createElement("span");
			text.textContent = label;
			const countEl = document.createElement("span");
			countEl.className = "dsx2-pinned-count";
			countEl.textContent = String(count);
			const chevron = document.createElement("span");
			chevron.className = "dsx2-chevron";
			chevron.textContent = "▾";
			head.appendChild(icon);
			head.appendChild(text);
			head.appendChild(countEl);
			head.appendChild(chevron);
			chevron.classList.toggle("dsx2-chevron-closed", collapsed);
			head.addEventListener("click", onToggle);
			return head;
		}

		function statusDot(s) {
			if (s === undefined) return null;
			const pending = s.pendingInteraction !== undefined && s.pendingInteraction !== null;
			const kind = pending ? "warn" : (s.running ? "run" : (s.completed === true ? "done" : ""));
			if (kind === "") return null;
			const dot = document.createElement("span");
			dot.className = "dsx2-dot dsx2-dot-" + kind;
			return dot;
		}

		function rowEl(s, current, now, wsOf, pinIds) {
			const row = document.createElement("div");
			row.className = "dsx2-row" + (s.id === current ? " dsx2-row-current" : "");
			const dot = statusDot(s);
			if (dot !== null) row.appendChild(dot);
			if (pinIds.has(s.id)) row.appendChild(pinMark());
			const title = document.createElement("span");
			title.className = "dsx2-row-title";
			title.textContent = s.blank === true ? "新会话" : String(s.displayTitle || s.id);
			row.appendChild(title);
			const wsItem = wsOf.get(s.id);
			const wsTitle = wsItem !== undefined ? wsItem.title : undefined;
			if (wsTitle !== undefined) {
				const tag = document.createElement("span");
				tag.className = "dsx2-row-tag";
				tag.textContent = wsTitle;
				row.appendChild(tag);
			}
			const time = document.createElement("span");
			time.className = "dsx2-row-time";
			time.dataset.ts = String(s.updatedAt);
			time.textContent = relTime(s.updatedAt, now);
			row.appendChild(time);
			attachMore(row, s.id, s.blank === true ? "新会话" : String(s.displayTitle || s.id));
			row.addEventListener("click", () => { try { sessions.open(s.id); } catch (error) {} });
			return row;
		}

		// Fingerprint of everything that shapes the row model: session store
		// contents, workspace membership, and the active filter. Cheap to
		// build (counts + boundary ids only) and stable across renders that
		// only differ in scroll/highlight, so repeated onData ticks reuse the
		// cached rows instead of re-filtering and re-sorting 20k entries.
		function rowsFingerprint(list, wlist) {
			const ids = list.ids || [];
			const head = ids.length > 0 ? ids[0] : "";
			const tail = ids.length > 0 ? ids[ids.length - 1] : "";
			const wsShape = (wlist.items || []).map((w) => w.workspaceId + ":" + ((w.sessionIds || []).length) + ":" + (w.archivedSessionIds || []).length).join("|");
			return ids.length + "~" + head + "~" + tail + "~" + String(list.current) + "~" + String(list.phase) + "~" + filter + "~" + wsShape + "~tv" + titleVersion;
		}

		// "Show remaining N" — grows one group's cap and rebuilds the list.
		function moreButtonEl(count, key) {
			const btn = document.createElement("button");
			btn.type = "button";
			btn.className = "dsx2-more-btn";
			btn.textContent = "显示其余 " + count + " 条";
			btn.addEventListener("click", () => {
				renderLimit[key] = (renderLimit[key] || RENDER_CHUNK_FIRST) + RENDER_CHUNK_MORE;
				lastRenderFp = "";
				renderList();
			});
			return btn;
		}

		// Rebuild only the visible DOM from the (capped) row model. Rows past
		// the cap stay data-only until "show more" raises the cap, so a 20k
		// workspace renders at most a few thousand nodes instead of ~120k.
		function renderList() {
			if (disposed || listDiv === null) return;
			const list = sList !== undefined ? safeSnap(sList) : undefined;
			const wlist = wList !== undefined ? safeSnap(wList) : undefined;
			if (list === undefined || wlist === undefined || list.ids === undefined) {
				lastRenderFp = "";
				listDiv.textContent = "";
				listDiv.appendChild(emptyNote("数据加载中…"));
				return;
			}
			const fp = rowsFingerprint(list, wlist);
			let parts;
			let wsOf;
			if (rowsCache === null || rowsCache.fp !== fp) {
				const current = list.current;
				const byId = list.byId || {};
				const archived = new Set(wlist.archivedSessionIds || []);
				const q = filter.trim().toLowerCase();
				wsOf = new Map();
				for (const w of wlist.items || []) {
					const sids = w.sessionIds || [];
					for (const id of sids) if (wsOf.has(id) === false) wsOf.set(id, w);
				}
				const rows = [];
				for (const id of list.ids) {
					const s = byId[id];
					if (s === undefined) continue;
					if (s.origin === "subagent" || archived.has(s.id)) continue;
					if (s.blank === true && s.id !== current) continue;
					if (q !== "" && String(s.displayTitle || "").toLowerCase().indexOf(q) === -1) continue;
					rows.push(s);
				}
				rows.sort(byRecency);
				fillWorkspaceByCwd(wsOf, rows, wlist.items);
				if (rows.length === 0 && q === "" && list.ids.length === 0 && list.phase !== "ready") healOrphanedStore();
				parts = partitionByWorkspace(rows, wsOf);
				rowsCache = { fp: fp, parts: parts, wsOf: wsOf };
			} else {
				parts = rowsCache.parts;
				wsOf = rowsCache.wsOf;
			}
			const viewFp = fp + "#" + renderLimit.ws + "," + renderLimit.ext + "#" + String(list.current) + "#" + (grpState.ws ? 1 : 0) + (grpState.ext ? 1 : 0);
			if (viewFp === lastRenderFp) return;
			lastRenderFp = viewFp;
			listDiv.textContent = "";
			if (parts.ws.length + parts.ext.length === 0) {
				listDiv.appendChild(emptyNote(filter.trim() !== "" ? "无匹配会话" : "暂无会话"));
				return;
			}
			const now = Date.now();
			const current = list.current;
			// One parse per render, not one per row.
			const pinIds = new Set(loadPins().map((p) => p.id));
			// While filtering, ignore collapse state so matches in the
			// (default-collapsed) external group stay reachable.
			const searching = filter.trim() !== "";
			const keepScroll = listDiv.scrollTop;
			const groups = [
				{ key: "ws", icon: folderGlyphSvg(), label: "工作区", items: parts.ws },
				{ key: "ext", icon: TERMINAL_SVG, label: "外部调用", items: parts.ext }
			];
			for (const g of groups) {
				if (g.items.length === 0) continue;
				const collapsed = searching ? false : grpState[g.key] === true;
				const toggle = () => {
					if (searching) return;
					grpState[g.key] = grpState[g.key] !== true;
					saveGroupState();
					renderList();
				};
				listDiv.appendChild(groupHeadEl(g.icon, g.label, g.items.length, collapsed, toggle));
				if (collapsed === false) {
					// Rows live in their own wrapper so content-visibility can
					// skip layout/paint for the offscreen rows.
					const wrap = document.createElement("div");
					wrap.className = "dsx2-grp-rows";
					const frag = document.createDocumentFragment();
					const cap = renderLimit[g.key] || RENDER_CHUNK_FIRST;
					const shown = Math.min(g.items.length, cap);
					for (let i = 0; i < shown; i++) frag.appendChild(rowEl(g.items[i], current, now, wsOf, pinIds));
					wrap.appendChild(frag);
					listDiv.appendChild(wrap);
					if (g.items.length > shown) listDiv.appendChild(moreButtonEl(g.items.length - shown, g.key));
				}
			}
			listDiv.scrollTop = keepScroll;
		}

		// Time-only refresh for the 30s ticker: rewrite the relative-time text
		// of already-rendered rows instead of rebuilding the whole list DOM.
		function updateTimes() {
			if (disposed || listDiv === null) return;
			const now = Date.now();
			for (const el of listDiv.querySelectorAll(".dsx2-row-time[data-ts]")) {
				const ts = Number(el.dataset.ts);
				if (Number.isFinite(ts)) el.textContent = relTime(ts, now);
			}
		}

		function renderPinned() {
			if (disposed || pinnedRows === null) return;
			const list = sList !== undefined ? safeSnap(sList) : undefined;
			const byId = list !== undefined ? (list.byId || {}) : {};
			const current = list !== undefined ? list.current : undefined;
			const pins = loadPins();
			if (pinnedCount !== null) pinnedCount.textContent = String(pins.length);
			pinnedRows.textContent = "";
			pinnedSection.style.display = pins.length === 0 ? "none" : "";
			for (const p of pins) {
				const s = byId[p.id];
				const row = document.createElement("div");
				row.className = "dsx2-row" + (p.id === current ? " dsx2-row-current" : "") + (s === undefined ? " dsx2-row-dead" : "");
				const dot = statusDot(s);
				if (dot !== null) row.appendChild(dot);
				row.appendChild(pinMark());
				const title = document.createElement("span");
				title.className = "dsx2-row-title";
				title.textContent = s !== undefined ? (s.blank === true ? "新会话" : String(s.displayTitle || p.id)) : String(p.title || p.id);
				row.appendChild(title);
				attachMore(row, p.id, title.textContent);
				if (s !== undefined) row.addEventListener("click", () => { try { sessions.open(p.id); } catch (error) {} });
				pinnedRows.appendChild(row);
			}
		}

		function build() {
			hostDiv = document.createElement("div");
			hostDiv.className = "dsx2-host";
			const bar = document.createElement("div");
			bar.className = "dsx2-bar";
			const tabs = document.createElement("div");
			tabs.className = "dsx2-tabs";
			tabW = document.createElement("button");
			tabW.type = "button";
			tabW.className = "dsx2-tab";
			tabW.textContent = "工作区";
			tabW.addEventListener("click", () => setMode("workspaces"));
			tabR = document.createElement("button");
			tabR.type = "button";
			tabR.className = "dsx2-tab";
			tabR.textContent = "历史会话";
			tabR.addEventListener("click", () => setMode("recent"));
			tabs.appendChild(tabW);
			tabs.appendChild(tabR);
			bar.appendChild(tabs);
			pinnedSection = document.createElement("div");
			pinnedSection.className = "dsx2-pinned";
			const head = document.createElement("div");
			head.className = "dsx2-pinned-head";
			const pinIcon = document.createElement("span");
			pinIcon.className = "dsx2-pin-icon";
			pinIcon.innerHTML = PIN_SVG;
			const chevron = document.createElement("span");
			chevron.className = "dsx2-chevron";
			chevron.textContent = "▾";
			const label = document.createElement("span");
			label.textContent = "固定会话";
			pinnedCount = document.createElement("span");
			pinnedCount.className = "dsx2-pinned-count";
			pinnedCount.textContent = "0";
			head.appendChild(pinIcon);
			head.appendChild(label);
			head.appendChild(pinnedCount);
			head.appendChild(chevron);
			let collapsed = false;
			try { collapsed = window.localStorage.getItem("dsx2-pins-collapsed") === "1"; } catch (error) {}
			const syncCollapse = () => {
				pinnedSection.classList.toggle("dsx2-pinned-closed", collapsed);
				chevron.classList.toggle("dsx2-chevron-closed", collapsed);
			};
			head.addEventListener("click", () => {
				collapsed = collapsed === false;
				try { window.localStorage.setItem("dsx2-pins-collapsed", collapsed ? "1" : "0"); } catch (error) {}
				syncCollapse();
			});
			syncCollapse();
			pinnedRows = document.createElement("div");
			pinnedRows.className = "dsx2-pinned-rows";
			pinnedSection.appendChild(head);
			pinnedSection.appendChild(pinnedRows);
			const search = document.createElement("div");
			search.className = "dsx2-search";
			const icon = document.createElement("span");
			icon.className = "dsx2-search-icon";
			icon.innerHTML = SEARCH_SVG;
			searchInput = document.createElement("input");
			searchInput.className = "dsx2-search-input";
			searchInput.placeholder = "过滤会话标题";
			searchInput.addEventListener("input", () => { filter = searchInput.value; renderList(); });
			search.appendChild(icon);
			search.appendChild(searchInput);
			listDiv = document.createElement("div");
			listDiv.className = "dsx2-list";
			hostDiv.appendChild(bar);
			hostDiv.appendChild(pinnedSection);
			hostDiv.appendChild(search);
			hostDiv.appendChild(listDiv);
		}

		function ensureHost() {
			if (disposed) return;
			const anchor = document.querySelector("[data-slot=\"sidebar.workspaces\"]");
			if (anchor === null) return;
			const root = anchor.firstElementChild;
			if (root === null) return;
			if (hostDiv === null) build();
			if (hostDiv.parentElement !== root) {
				if (hostDiv.parentElement !== null) hostDiv.parentElement.removeChild(hostDiv);
				root.insertBefore(hostDiv, root.firstChild);
				syncTabs();
				applyModeClass();
				renderPinned();
				renderList();
			}
			if (resizer === null) {
				try {
					resizer = new ResizeObserver((entries) => {
						if (disposed || entries.length === 0) return;
						const w = entries[0].contentRect.width;
						railHidden = w < 100;
						if (hostDiv !== null) hostDiv.style.display = railHidden ? "none" : "";
						applyModeClass();
					});
					resizer.observe(root);
				} catch (error) { resizer = null; }
			}
		}

		function mount(ctx) {
			grpState = loadGroupState();
			// Data pushes (automation runs mutate their sessions constantly)
			// coalesce into at most one list rebuild per window; direct user
			// actions (tab switch, toggle, search) still render immediately.
			// onData itself lives at module scope so rebindSessions can
			// re-subscribe the hoisted handler to a swapped store.
			if (sList !== undefined) { try { unsub1 = sList.subscribe(onData); } catch (error) {} }
			if (wList !== undefined) { try { unsub2 = wList.subscribe(onData); } catch (error) {} }
			const timer = ctx.get !== undefined ? ctx.get("timer") : undefined;
			if (timer !== undefined) {
				try { keepAlive = timer.interval(ensureHost, 800); } catch (error) {}
				try { timeTicker = timer.interval(() => { if (mode === "recent") updateTimes(); }, 30000); } catch (error) {}
				try { refreshTicker = timer.interval(() => { if (document.visibilityState !== "hidden") refreshBaseline(); }, 120000); } catch (error) {}
			}
			onVisible = () => { if (document.visibilityState !== "hidden") refreshBaseline(); };
			document.addEventListener("visibilitychange", onVisible);
			ensureHost();
			loadTitles();
			migratePins();
		}

		function cleanup() {
			if (disposed) return;
			disposed = true;
			closeMenu();
			if (keepAlive !== null) { try { keepAlive(); } catch (error) {} }
			if (timeTicker !== null) { try { timeTicker(); } catch (error) {} }
			if (refreshTicker !== null) { try { refreshTicker(); } catch (error) {} }
			if (unsub1 !== null) { try { unsub1(); } catch (error) {} }
			if (unsub2 !== null) { try { unsub2(); } catch (error) {} }
			if (onVisible !== null) { document.removeEventListener("visibilitychange", onVisible); onVisible = null; }
			if (resizer !== null) { try { resizer.disconnect(); } catch (error) {} }
			if (wsMenuObserver !== null) { try { wsMenuObserver.disconnect(); } catch (error) {} wsMenuObserver = null; }
			if (menuFixObserver !== null) { try { menuFixObserver.disconnect(); } catch (error) {} menuFixObserver = null; }
			if (hostDiv !== null && hostDiv.parentElement !== null) hostDiv.parentElement.removeChild(hostDiv);
			document.documentElement.classList.remove("dsx2-recent-on");
		}

		// A page opened during the host's own startup window can run apply()
		// before the injected services carry their observables; poll briefly
		// (same discipline as pin-session v0.1.10) instead of dying silently.
		function apply(ctx) {
			const RETRY_MS = 400;
			const RETRY_MAX = 75;
			let attempts = 0;
			let started = false;
			ctxRef = ctx;
			const start = () => {
				if (started || disposed) return;
				attempts += 1;
				sessions = typeof ctx.get === "function" ? ctx.get("sessions") : ctx.sessions;
				workspaces = typeof ctx.get === "function" ? ctx.get("workspaces") : ctx.workspaces;
				sList = sessions !== undefined ? sessions.list : undefined;
				wList = workspaces !== undefined ? workspaces.list : undefined;
				if (sList === undefined || wList === undefined) {
					if (attempts <= RETRY_MAX) window.setTimeout(start, RETRY_MS);
					else console.warn("[sidebar-views] giving up: sessions/workspaces never resolved");
					return;
				}
				started = true;
				ctx.effect(() => cleanup);
				mount(ctx);
				watchWorkspaceMenus();
			};
			start();
		}

		exports.inject = inject;
		exports._mergePins = mergePins;
		exports._partitionByWorkspace = partitionByWorkspace;
		exports._fillWorkspaceByCwd = fillWorkspaceByCwd;
		exports._findWorkspaceCwd = findWorkspaceCwd;
		exports._expandDisplayCwd = expandDisplayCwd;
		exports.apply = apply;
		return module.exports;
	}
});
