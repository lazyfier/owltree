## 2026-04-15
- Added repo-level quality gates through npm scripts and CI checks without touching application source directories.
- Kept Vite bundle analysis ready by enabling production sourcemaps and wiring an `analyze` script to `vite-bundle-visualizer`.
- Scoped the initial ESLint baseline to a reduced rule set and explicit ignores for existing source-file violations because the task prohibited modifying `src/` while CI lint needed to pass.
