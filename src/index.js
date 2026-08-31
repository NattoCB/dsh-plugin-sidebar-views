// Minimal host-half placeholder: this plugin is client-only (sidebar DOM
// enhancement). The empty Cordis plugin object keeps `exports["."]` valid so
// pnpm/file installs and any host-side bundle scan never trip on a missing
// entry point.
export default {};
