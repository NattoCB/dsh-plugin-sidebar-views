# dsh-plugin-sidebar-views

<!-- Hero -->
<div align="center">
  <b style="font-size: 1.15em;">给 DSH 侧栏装上双视图与固定会话:工作区 / 历史会话一键切换,automation 洪流不再淹没人工会话。</b><br /><br />
  <a href="https://github.com/NattoCB/dsh-plugin-sidebar-views"><img alt="License" src="https://img.shields.io/badge/License-MIT-yellow.svg" /></a>
  <a href="https://github.com/NattoCB/dsh-plugin-sidebar-views"><img alt="GitHub" src="https://img.shields.io/badge/GitHub-NattoCB%2Fdsh--plugin--sidebar--views-181717" /></a>
  <img alt="version" src="https://img.shields.io/badge/version-0.3.0-blue" /><br /><br />
  <img alt="双视图切换" src="https://img.shields.io/badge/-双视图切换-4d6bfe" />
  <img alt="固定会话分组" src="https://img.shields.io/badge/-固定会话分组-4d6bfe" />
  <img alt="工作区%2F外部调用分组" src="https://img.shields.io/badge/-工作区%2F外部调用分组-4d6bfe" />
  <img alt="行级菜单 · 复制 ID" src="https://img.shields.io/badge/-行级菜单%20·%20复制%20ID-4d6bfe" />
  <img alt="纯 DOM 零框架" src="https://img.shields.io/badge/-纯%20DOM%20零框架-4d6bfe" /><br /><br />
  <a href="https://awesome-dsh-plugin.com"><img src="https://awesome-dsh-plugin.com/badge.svg" alt="awesome · DSH 插件精选" /></a><br /><br />
  <b>集成面:</b>纯客户端注入(<code>window.__ModuleLoader__</code> bundle) · localStorage <code>dsx2-pins</code> / <code>dsx2-groups</code> · 声明 <code>dsh.bundle.patch</code> + <code>dsh.client</code>(web)
</div>

> **语言 / Language**:**中文** ｜ [English](./README.en.md)

> 一个 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 客户端插件,升级侧栏会话列表:
> 列表上方加「工作区 / 历史会话」切换条——工作区是原生分组,历史会话把全部会话按最近排序平铺,
> 带相对时间戳、运行状态点与所属工作区标签;固定会话分组常驻顶部。
> 0.3.0 起历史会话再分「工作区 / 外部调用」两组,automation 流量默认折叠、实时计数。
> 纯 DOM 实现——无 React、无 portal、不接管 slot;装进 `web` profile 重启即用。

## ✨ 功能一览

- **🔀 双视图切换条**:列表上方两个 tab——「工作区」(原生 workspace 分组)与「历史会话」(全部会话按最近排序的单层平铺列表,含相对时间戳、运行中/已完成/待处理状态点、所属工作区标签)。
- **📌 固定会话分组**:两种视图下都常驻列表顶部,实时计数、折叠状态记忆;已不存在的会话以置灰行显示,不会悄悄消失。
- **🗂️ 工作区 / 外部调用分组**:历史会话分两组——「工作区」(挂在常规 workspace 下的会话,默认展开)在上,「外部调用」(无 workspace 的 headless 会话 + `Automation-*` workspace 会话,即 automation 流量)在下,默认折叠并显示实时计数。automation run 会挂在真实 workspace 下,按 workspace 标题或目录名 `Automation-` 前缀识别。折叠状态存 localStorage(`dsx2-groups`);搜索时强制展开两组;折叠组完全跳过行渲染,上千条 automation 历史也不建 DOM。
- **⋯ 行级菜单**:每一行(固定组与平铺行)都有「⋯」菜单:固定 / 取消固定会话、复制 Session ID。
- **🔎 标题过滤**:历史会话视图内置过滤框,按标题实时筛选。
- **📁 在 Finder 中打开**:workspace 原生「…」菜单新增打开目录项,取菜单 fiber 携带的 workspace cwd,经宿主 `workspaces.openPath` 服务激活——无宿主侧代码。
- **🧩 纯 DOM、零框架**:不写 React、不开 portal、不接管 slot。切换条作为原生列表容器的第一个子元素植入;历史模式下用 CSS class 隐藏原生列表;keep-alive interval 在原生重渲染后自愈;`ResizeObserver` 在侧栏收窄成 rail 时整体隐藏。
- **⚡ 大列表性能**:DocumentFragment 批量插入、视口外分组 `content-visibility` 跳过 layout/paint、数据刷新 400ms 节流(tab 切换/折叠/搜索等直接交互路径不节流,保持即时);展开 2400+ 行实测毫秒级。
- **🔁 旧插件平滑迁移**:检测到旧 `dsh-plugin-pin-session` 时,启动时一次性合并其固定列表(id 去重、保持最旧优先,`GET /pin-session/pins`),过渡期每次固定/取消双写到旧插件 `POST /pin-session/pin|unpin`;旧插件移除后两者均为静默空操作。

## Quick Start

### 前置条件

- 已安装 DeepSeek Harness(`dsh web` 可运行)。
- 客户端 bundle 只在进程启动时进入 boot graph——安装后需要重启 `dsh web`。

### 安装(装入 `web` profile)

一条命令安装:

```bash
dsh plugin --profile web add github:NattoCB/dsh-plugin-sidebar-views
```

手动安装:在 profile 的 `package.json` 里,把包加入 `dependencies`、把插件名加入 `dsh.profile.bundles`,然后在 profile 目录跑 `pnpm install`,重启 `dsh web`。

### 运行

重启后侧栏列表上方即出现切换条,零配置。切换视图、固定会话、折叠分组的状态全部存浏览器 localStorage,刷新不丢。

## 存储与迁移

Pin 与分组状态都存浏览器 localStorage,固定关系跟随浏览器 profile,不跟随 DSH host:

| localStorage 键 | 内容 |
|:----------------|:-----|
| `dsx2-pins` | 固定列表(最旧优先 `[{ id, title?, pinnedAt }]`) |
| `dsx2-pins-collapsed` | 固定分组的折叠状态 |
| `dsx2-groups` | 工作区/外部调用分组的折叠状态(外部组默认折叠) |

对旧 `dsh-plugin-pin-session` 的迁移语义见功能一览 **🔁**:一次性合并 + 过渡期双写,均为静默容错。

## 卸载安全

从 profile `package.json` 的 **`dependencies` 与 `dsh.profile.bundles` 两处**同时移除本插件,然后重启 DSH。只删 `node_modules` 里的包而留下 bundles 条目,boot graph 会请求一个已不存在的 `client.js`——模块加载器将其视为致命错误,整个 web GUI 无法挂载。

## Development

```bash
npm test        # node --test: 包契约 + pin 合并逻辑
```

`client/client.js` 是 `window.__ModuleLoader__.load({ id, factory })` bundle,与 DSH 自家客户端 bundle 同形。pin 合并逻辑导出为 `exports._mergePins`,测试跑的是真实代码而非拷贝。

---

<div align="center">

[MIT License](https://github.com/NattoCB/dsh-plugin-sidebar-views) · [GitHub 仓库](https://github.com/NattoCB/dsh-plugin-sidebar-views) · [提 issue](https://github.com/NattoCB/dsh-plugin-sidebar-views/issues)

</div>
