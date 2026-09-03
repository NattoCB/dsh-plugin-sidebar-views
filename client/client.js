window.__ModuleLoader__.load({
	id: "dsh-plugin-sidebar-views",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });

		// ── CSS (sidebar views + pinned group + row menu) ─────────────────
		const css = ".dsx2-host{order:-1;flex:none;display:flex;flex-direction:column;gap:6px;padding:2px 0 6px}html.dsx2-recent-on .dsx2-host{flex:1 1 0;min-height:0}html.dsx2-recent-on [data-slot=\"sidebar.workspaces\"] > div > :not(.dsx2-host){display:none!important}.dsx2-bar{display:flex;align-items:center;gap:6px;flex:none}.dsx2-tabs{display:flex;flex:1;min-width:0;background:var(--dsw-alias-bg-layer-1,rgba(128,128,128,.08));border:1px solid var(--dsw-alias-border-l1,transparent);border-radius:9px;padding:2px;gap:2px}.dsx2-tab{flex:1;display:flex;align-items:center;justify-content:center;gap:5px;height:24px;border:none;border-radius:7px;background:transparent;color:var(--dsw-alias-label-secondary);cursor:pointer;font-size:12px;line-height:16px;padding:0 6px;white-space:nowrap;overflow:hidden;font-family:inherit}.dsx2-tab:hover{color:var(--dsw-alias-label-primary)}.dsx2-tab-active{background:var(--dsw-alias-bg-layer-2,rgba(128,128,128,.18));color:var(--dsw-alias-label-primary);font-weight:500}.dsx2-plus{width:26px;height:26px;flex:none;display:inline-flex;align-items:center;justify-content:center;border:none;background:transparent;border-radius:50%;color:var(--dsw-alias-label-secondary);cursor:pointer;padding:0}.dsx2-plus:hover{background:var(--dsw-alias-interactive-bg-hover,rgba(128,128,128,.15));color:var(--dsw-alias-label-primary)}.dsx2-search{display:none;align-items:center;gap:6px;height:26px;padding:0 8px;border:1px solid var(--dsw-alias-border-l1,transparent);border-radius:8px;color:var(--dsw-alias-label-tertiary);flex:none}html.dsx2-recent-on .dsx2-search{display:flex}.dsx2-search-input{flex:1;min-width:0;border:none;outline:none;background:transparent;color:var(--dsw-alias-label-primary);font-size:12px;line-height:16px;font-family:inherit}.dsx2-search-input::placeholder{color:var(--dsw-alias-label-tertiary)}.dsx2-pinned{flex:none;display:flex;flex-direction:column;min-height:0}.dsx2-pinned-head{display:flex;align-items:center;gap:5px;height:26px;padding:0 6px;border-radius:8px;cursor:pointer;color:var(--dsw-alias-label-secondary);font-size:12px;font-weight:600;user-select:none;flex:none}.dsx2-pinned-head:hover{background:var(--dsw-alias-interactive-bg-hover,rgba(128,128,128,.12));color:var(--dsw-alias-label-primary)}.dsx2-pin-icon{flex:none;display:inline-flex;align-items:center;color:var(--dsw-alias-brand-primary,#6366f1)}.dsx2-chevron{flex:none;font-size:10px;line-height:1;color:var(--dsw-alias-label-tertiary);transition:transform .15s ease}.dsx2-chevron-closed{transform:rotate(-90deg)}.dsx2-pinned-count{flex:none;color:var(--dsw-alias-label-tertiary);font-weight:400;font-size:11px}.dsx2-pinned-rows{display:flex;flex-direction:column;max-height:150px;overflow-y:auto;padding-bottom:2px}.dsx2-pinned-closed .dsx2-pinned-rows{display:none}.dsx2-list{display:none;flex:1;min-height:0;overflow-y:auto;padding-bottom:12px}html.dsx2-recent-on .dsx2-list{display:block}.dsx2-row{display:flex;align-items:center;gap:7px;height:30px;padding:0 8px;border-radius:8px;cursor:pointer;color:var(--dsw-alias-label-primary);font-size:13px;user-select:none}.dsx2-row:hover{background:var(--dsw-alias-bg-layer-1,rgba(128,128,128,.1))}.dsx2-row-current{background:var(--dsw-alias-bg-layer-2,rgba(128,128,128,.18))}.dsx2-row-dead{opacity:.45;cursor:default}.dsx2-row-title{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.dsx2-row-pin{flex:none;display:inline-flex;align-items:center;color:var(--dsw-alias-brand-primary,#6366f1)}.dsx2-row-tag{flex:none;max-width:40%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--dsw-alias-label-tertiary);font-size:11px;background:var(--dsw-alias-bg-layer-1,rgba(128,128,128,.1));border-radius:5px;padding:1px 5px}.dsx2-row-time{flex:none;color:var(--dsw-alias-label-tertiary);font-size:11px}.dsx2-more{display:none;flex:none;width:20px;height:20px;align-items:center;justify-content:center;border:none;background:transparent;border-radius:5px;color:var(--dsw-alias-label-tertiary);cursor:pointer;font-size:13px;line-height:1;padding:0}.dsx2-row:hover .dsx2-more{display:inline-flex}.dsx2-more:hover{background:var(--dsw-alias-bg-layer-2,rgba(128,128,128,.18));color:var(--dsw-alias-label-primary)}.dsx2-dot{width:7px;height:7px;border-radius:50%;flex:none}.dsx2-dot-run{background:var(--dsw-alias-state-success-primary,#22c55e);animation:dsx2-pulse 1.6s ease-in-out infinite}.dsx2-dot-done{background:var(--dsw-alias-state-success-primary,#22c55e);opacity:.55}.dsx2-dot-warn{background:var(--dsw-alias-state-warn-primary,#f59e0b)}@keyframes dsx2-pulse{0%,100%{opacity:1}50%{opacity:.35}}.dsx2-empty{color:var(--dsw-alias-label-tertiary);padding:14px 10px;font-size:12px}.dsx2-menu{position:fixed;z-index:9999;min-width:170px;background:var(--dsw-alias-bg-layer-1,#ffffff);border:1px solid var(--dsw-alias-border-l2,rgba(0,0,0,.12));border-radius:10px;padding:4px;box-shadow:0 8px 24px rgba(0,0,0,.18);display:flex;flex-direction:column}.dsx2-menu-item{display:flex;align-items:center;gap:8px;height:30px;padding:0 10px;border:none;background:transparent;border-radius:7px;color:var(--dsw-alias-label-primary);cursor:pointer;font-size:13px;text-align:left;font-family:inherit;white-space:nowrap}.dsx2-menu-item:hover{background:var(--dsw-alias-interactive-bg-hover,rgba(128,128,128,.12))}@media (prefers-reduced-motion:reduce){.dsx2-dot-run{animation:none}}";
		const cssTagId = "dsh-plugin-sidebar-views/sidebar.css";
		if (typeof document !== "undefined" && !document.querySelector("style[data-plugin-css=\"" + cssTagId + "\"]")) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-plugin-sidebar-views";
			tag.dataset.pluginCss = cssTagId;
			tag.textContent = css;
			document.head.appendChild(tag);
		}

		const PLUS_SVG = '<svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M8 3.5v9M3.5 8h9" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>';
		const SEARCH_SVG = '<svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true"><circle cx="7" cy="7" r="4.2" stroke="currentColor" stroke-width="1.2"/><path d="m10.2 10.2 3 3" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>';
		const PIN_SVG = '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 17v5"/><path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1z"/></svg>';

		const inject = ["sessions", "workspaces", "timer"];

		// ── state ──────────────────────────────────────────────────────────
		let sessions;
		let workspaces;
		let sList;
		let wList;
		let disposed = false;
		let mode = "workspaces";
		let filter = "";
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
		let resizer = null;
		let menuEl = null;
		let wsMenuObserver = null;

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

		function safeSnap(source) {
			try { return source.getSnapshot(); } catch (error) { return undefined; }
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
			renderPinned();
			renderList();
		}

		function unpinSession(id) {
			savePins(loadPins().filter((p) => p.id !== id));
			legacyPost("unpin", id);
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

		function enhanceWorkspaceMenus() {
			if (workspaces === undefined || typeof workspaces.openPath !== "function") return;
			for (const menu of document.querySelectorAll('[role="menu"]')) {
				if (menu.querySelector(".dsx2-finder-item") !== null) continue;
				const cwd = findWorkspaceCwd(menu);
				if (cwd === undefined) continue;
				const items = menu.querySelectorAll('[role="menuitem"]');
				if (items.length === 0) continue;
				const item = items[items.length - 1].cloneNode(false);
				item.removeAttribute("data-disabled");
				item.setAttribute("aria-disabled", "false");
				item.classList.add("dsx2-finder-item");
				item.textContent = "在 Finder 中打开";
				item.addEventListener("click", (e) => {
					e.stopPropagation();
					// The native Menu listens for pointerdown to dismiss.
					document.body.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }));
					try { workspaces.openPath(cwd); } catch (error) {}
				});
				menu.appendChild(item);
			}
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
			if (mode === "recent") renderList();
		}

		function emptyNote(text) {
			const el = document.createElement("div");
			el.className = "dsx2-empty";
			el.textContent = text;
			return el;
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

		function rowEl(s, current, now, wsTitleOf) {
			const row = document.createElement("div");
			row.className = "dsx2-row" + (s.id === current ? " dsx2-row-current" : "");
			const dot = statusDot(s);
			if (dot !== null) row.appendChild(dot);
			if (isPinned(s.id)) row.appendChild(pinMark());
			const title = document.createElement("span");
			title.className = "dsx2-row-title";
			title.textContent = s.blank === true ? "新会话" : String(s.displayTitle || s.id);
			row.appendChild(title);
			const wsTitle = wsTitleOf.get(s.id);
			if (wsTitle !== undefined) {
				const tag = document.createElement("span");
				tag.className = "dsx2-row-tag";
				tag.textContent = wsTitle;
				row.appendChild(tag);
			}
			const time = document.createElement("span");
			time.className = "dsx2-row-time";
			time.textContent = relTime(s.updatedAt, now);
			row.appendChild(time);
			attachMore(row, s.id, s.blank === true ? "新会话" : String(s.displayTitle || s.id));
			row.addEventListener("click", () => { try { sessions.open(s.id); } catch (error) {} });
			return row;
		}

		function renderList() {
			if (disposed || listDiv === null) return;
			const list = sList !== undefined ? safeSnap(sList) : undefined;
			const wlist = wList !== undefined ? safeSnap(wList) : undefined;
			listDiv.textContent = "";
			if (list === undefined || wlist === undefined || list.ids === undefined) {
				listDiv.appendChild(emptyNote("数据加载中…"));
				return;
			}
			const now = Date.now();
			const current = list.current;
			const byId = list.byId || {};
			const archived = new Set(wlist.archivedSessionIds || []);
			const q = filter.trim().toLowerCase();
			const wsTitleOf = new Map();
			for (const w of wlist.items || []) {
				const sids = w.sessionIds || [];
				for (const id of sids) if (wsTitleOf.has(id) === false) wsTitleOf.set(id, w.title);
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
			if (rows.length === 0) {
				listDiv.appendChild(emptyNote(q !== "" ? "无匹配会话" : "暂无会话"));
				return;
			}
			const keepScroll = listDiv.scrollTop;
			for (const s of rows) listDiv.appendChild(rowEl(s, current, now, wsTitleOf));
			listDiv.scrollTop = keepScroll;
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
			tabR.textContent = "最新会话";
			tabR.addEventListener("click", () => setMode("recent"));
			tabs.appendChild(tabW);
			tabs.appendChild(tabR);
			bar.appendChild(tabs);
			if (workspaces !== undefined) {
				const plus = document.createElement("button");
				plus.type = "button";
				plus.className = "dsx2-plus";
				plus.title = "新会话";
				plus.innerHTML = PLUS_SVG;
				plus.addEventListener("click", () => { try { workspaces.startSession(); } catch (error) {} });
				bar.appendChild(plus);
			}
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
			const onData = () => { renderPinned(); if (mode === "recent") renderList(); };
			if (sList !== undefined) { try { unsub1 = sList.subscribe(onData); } catch (error) {} }
			if (wList !== undefined) { try { unsub2 = wList.subscribe(onData); } catch (error) {} }
			const timer = ctx.get !== undefined ? ctx.get("timer") : undefined;
			if (timer !== undefined) {
				try { keepAlive = timer.interval(ensureHost, 800); } catch (error) {}
				try { timeTicker = timer.interval(() => { if (mode === "recent") renderList(); }, 30000); } catch (error) {}
			}
			ensureHost();
			migratePins();
		}

		function cleanup() {
			if (disposed) return;
			disposed = true;
			closeMenu();
			if (keepAlive !== null) { try { keepAlive(); } catch (error) {} }
			if (timeTicker !== null) { try { timeTicker(); } catch (error) {} }
			if (unsub1 !== null) { try { unsub1(); } catch (error) {} }
			if (unsub2 !== null) { try { unsub2(); } catch (error) {} }
			if (resizer !== null) { try { resizer.disconnect(); } catch (error) {} }
			if (wsMenuObserver !== null) { try { wsMenuObserver.disconnect(); } catch (error) {} wsMenuObserver = null; }
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
		exports._findWorkspaceCwd = findWorkspaceCwd;
		exports.apply = apply;
		return module.exports;
	}
});
