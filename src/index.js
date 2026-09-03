// Minimal host half: this plugin is client-only (sidebar DOM enhancement
// lives in client/client.js). The profile bundle loader requires every
// bundle's patch row to resolve to a real Cordis plugin, so this half
// contributes an inert service row; all behavior is browser-side.
export const name = 'sidebar-views';
export const apply = () => {};
