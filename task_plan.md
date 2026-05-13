# Task Plan: Owltree Cleanup And Maintenance

## Goal
Bring the Owltree repository to a clean, maintainable baseline by fixing current verification failures, removing obvious repository cruft, correcting stale maintenance documentation, and re-running the standard checks.

## Current Phase
Complete

## Phases

### Phase 1: Baseline And Discovery
- [x] Capture the user's requested maintenance scope.
- [x] Read project instructions and planning-with-files workflow.
- [x] Record current repository health and known drift.
- **Status:** complete

### Phase 2: Fix Current Verification Failure
- [x] Diagnose the failing unit test around `window.localStorage`.
- [x] Apply the smallest durable fix.
- [x] Re-run the targeted test and typecheck.
- **Status:** complete

### Phase 3: Repository Cleanup
- [x] Identify tracked/generated cruft that should not live in source.
- [x] Remove only safe, obvious cleanup targets.
- [x] Keep tooling from scanning local auxiliary worktrees.
- [x] Avoid deleting useful archives, plans, or user work.
- **Status:** complete

### Phase 4: Documentation And Maintenance Alignment
- [x] Correct stale docs that contradict current implementation.
- [x] Align directory guidance with the current host/project split.
- [x] Keep documentation aligned with terminal-only theme behavior.
- [x] Preserve project-specific placement rules from `AGENTS.md`.
- **Status:** complete

### Phase 5: Full Verification And Handoff
- [x] Run typecheck.
- [x] Run unit tests.
- [x] Run lint.
- [x] Run build/e2e as feasible.
- [x] Summarize changed files, verification evidence, and remaining risks.
- **Status:** complete

### Phase 6: Project Link Configuration
- [x] Add centralized project link configuration for the terminal homepage.
- [x] Document `.env.local` values through `.env.example` and README.
- [x] Preserve internal routing for built-in projects.
- [x] Add focused test coverage for link classification.
- [x] Run final verification after configuration changes.
- [x] Confirm the dev server URL for local viewing.
- **Status:** complete

## Key Questions
1. Why does the current Vitest run fail on `window.localStorage.setItem`?
2. Which tracked files are obvious machine cruft rather than useful project artifacts?
3. Which docs are stale enough to mislead future maintainers?
4. Do the standard commands pass after cleanup?

## Decisions Made
| Decision | Rationale |
|----------|-----------|
| Keep scope conservative | The user asked for cleanup/maintenance, not a redesign or feature migration. |
| Fix current failing test first | It gives a reliable baseline before broader cleanup. |
| Treat plan files as project working memory | The invoked skill requires `task_plan.md`, `findings.md`, and `progress.md` in the project root. |
| Put project links in `src/config` | These links are host portal navigation config, not one project's private implementation. |

## Errors Encountered
| Error | Attempt | Resolution |
|-------|---------|------------|
| `npm run test:unit` fails because `window.localStorage.setItem` is not a function in `src/test/App.test.tsx` | 1 | Added Vitest in-memory Storage shim in `src/test/setup.ts`; targeted App test passes. |
| `npm run lint` scans `.worktrees/moon-throw-ux` and reports unrelated errors | 1 | Added `.worktrees` to ESLint ignores; lint passes. |
| `npm run test:e2e` failed because the Moon Throw home control is a button while the test expected a link | 1 | Updated E2E selector to `getByRole('button', { name: /返回首页/ })`. |
| Parallel `npm run lint` and Playwright targeted test caused ESLint `ENOENT` on `test-results` | 1 | Added Playwright generated report directories to ESLint ignores and switched final verification to sequential runs. |

## Notes
- Current implementation forces `terminal` theme; docs still mention four active themes and theme persistence.
- Typecheck passed before maintenance changes.
- Worktree was clean before creating planning files.
- Final verification passed: lint, typecheck, unit tests, production build, and E2E.
- Link configuration verification passed: typecheck, lint, unit tests, production build, and browser smoke test at `http://127.0.0.1:5173/owltree/#/`.
