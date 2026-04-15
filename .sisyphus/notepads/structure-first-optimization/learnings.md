## 2026-04-15
- Splitting a large hook worked cleanly by separating pure feedback builders, progress/achievement helpers, reducer orchestration, and derived selectors into `src/hooks/useGameState/`, leaving the top-level hook as a thin orchestration wrapper.
- Characterization tests for extracted pure helpers gave a safe refactor seam without touching gameplay engine modules or consumer components.

- 2026-04-15: Restoring pre-refactor behavior requires validating both historical code and current product expectations. For `handleChat`, the regression fix needed explicit feedback state (`phase: 'feedback'`, `feedback.keepPartner: true`) plus passing `trigger: 'END_DIALOGUE'` into `applyProgressChecks`; tightening shared option types can require updating sibling call sites like `handleUseTestkit`.

- 2026-04-15: With project-reference TypeScript configs, `tsc --noEmit` can miss application files; use `tsc -b --noEmit` for real typechecking. When widening a reducer helper from `ActionType` to `GameAction`, narrow back to `ActionType` only after excluding non-action cases before indexing action-based config maps.
