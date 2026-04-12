# Owltree Terminal Completion

## TL;DR
> **Summary**: Complete the terminal-default Owltree app by fixing existing build blockers, making terminal navigation/data real, adding an actual theme switch path, extending theme coverage to secondary routes, and updating stale tests/docs.
> **Deliverables**:
> - clean build
> - working terminal homepage navigation and project actions
> - persisted theme switcher with terminal default on first load
> - secondary pages themed via shared variables
> - refreshed tests and docs
> **Effort**: Large
> **Parallel**: YES - 3 waves
> **Critical Path**: 1 → 2/3 → 4/5 → 6/7 → Final Verification

## Context
### Original Request
- Integrate the terminal prototype into the main React app.
- Keep `terminal` as the default theme.
- Clean obsolete files.
- List what remains unimplemented/needs optimization, then execute all of it.

### Interview Summary
- User accepted `terminal` as the primary/default experience.
- User explicitly wants the remaining work executed end-to-end.
- User wants cleanup without deleting `.sisyphus/`.

### Metis Review (gaps addressed)
- Default behavior decision made: **terminal is default on first load only**; persisted user choice must win afterward.
- Scope guardrail: **do not invent new product areas** (no full Archive/Connect features in this pass).
- Route shell decision: keep `/games`, `/notes`, `/tools`, `/trends` visible, but make them consistent and non-broken.
- Acceptance criteria expanded for persistence, routing correctness, mobile behavior, and stale-doc/test updates.

## Work Objectives
### Core Objective
Ship a coherent terminal-default Owltree experience where the app builds, the homepage interactions are real, theme selection is exposed and persisted, secondary pages respect the active theme, and stale docs/tests no longer describe the pre-terminal app.

### Deliverables
- Fixed TypeScript/build blockers in game flow
- Terminal homepage with real module routing and project click-through behavior
- Theme switch UI wired to `ThemeContext`
- Theme-aware styling on Home/Games/Notes/Tools/Trends
- Updated tests matching terminal-default behavior
- Updated docs reflecting `theme/` directory and current React/Vite app architecture

### Definition of Done (verifiable conditions with commands)
- `npm run build` exits 0.
- `npm run test -- --runInBand` or project-equivalent unit test command exits 0.
- `npx playwright test e2e/portal.spec.ts` exits 0 or targeted terminal-home equivalent spec exits 0.
- Opening `/#/` shows terminal homepage on fresh storage state.
- Theme can be switched in UI and persists across reload.
- Clicking homepage modules routes to real pages using router paths, not hash fragments passed into `navigate()`.
- Clicking at least the playable/real homepage project entries opens the correct route or external target.
- README/AGENTS/CLAUDE no longer reference `prototypes/` or “pure HTML only” architecture.

### Must Have
- Terminal remains default on first load.
- No visible dead navigation chips on terminal home.
- No placeholder footer links.
- No build failures from touched files.

### Must NOT Have
- Must NOT add new routes like `/archive` or `/connect` in this pass.
- Must NOT create fake backend/data integrations just to make shells look “finished”.
- Must NOT hardcode more route-specific colors where theme variables should be used.
- Must NOT keep stale test assertions for `OWLTREE` / `PROJECTS` if current UI differs.

## Verification Strategy
> ZERO HUMAN INTERVENTION - all verification is agent-executed.
- Test decision: tests-after using existing TypeScript + Vitest + Playwright setup
- QA policy: Every task includes at least one happy path and one failure/edge scenario
- Evidence: `.sisyphus/evidence/task-{N}-{slug}.{ext}`

## Execution Strategy
### Parallel Execution Waves
Wave 1: build stability + homepage routing/data foundations
- Task 1 Build blockers in game flow
- Task 2 Terminal home route/data cleanup
- Task 3 Theme switch UX wiring

Wave 2: route theming + page behavior consistency
- Task 4 Secondary-page theme variable pass
- Task 5 Games/Tools/Trends/Notes interaction cleanup

Wave 3: validation surface updates
- Task 6 Tests refresh
- Task 7 Docs + dead-code cleanup

### Dependency Matrix (full, all tasks)
- 1 blocks 6 and final verification
- 2 blocks 5, 6, and final verification
- 3 blocks 4, 6, and final verification
- 4 blocks 6 and final verification
- 5 blocks 6 and final verification
- 6 blocks final verification
- 7 can start after 2/3/4 stabilize, blocks final verification

### Agent Dispatch Summary
- Wave 1 → 3 tasks → `quick`, `visual-engineering`, `unspecified-high`
- Wave 2 → 2 tasks → `visual-engineering`, `unspecified-high`
- Wave 3 → 2 tasks → `quick`, `writing`

## TODOs

- [x] 1. Fix build blockers in game state + action buttons

  **What to do**: Resolve current TypeScript/build failures in `src/hooks/useGameState.ts` and `src/components/moon-throw/ActionButtons.tsx`. Export/use the correct action type source, remove or wire unused props/locals, and ensure reducer indexing is fully typed.
  **Must NOT do**: Do not redesign game logic or alter gameplay balancing beyond what is needed to restore correct typing/runtime flow.

  **Recommended Agent Profile**:
  - Category: `quick` - Reason: narrow code-fix surface with concrete compiler failures
  - Skills: []
  - Omitted: [`tdd-workflow`] - existing tests already cover game engine; immediate goal is unblock build first

  **Parallelization**: Can Parallel: YES | Wave 1 | Blocks: 6 | Blocked By: none

  **References**:
  - `src/hooks/useGameState.ts:1-395` - current reducer/type mismatch source
  - `src/components/moon-throw/ActionButtons.tsx:1-89` - unused prop/local source
  - `src/game/engine/actions.ts` - source of exported runtime/type contracts
  - `src/game/types.ts` - existing game/shared type definitions

  **Acceptance Criteria**:
  - [ ] `npx tsc --noEmit` produces no errors from `src/hooks/useGameState.ts` or `src/components/moon-throw/ActionButtons.tsx`
  - [ ] `npm run build` no longer fails on these two files

  **QA Scenarios**:
  ```
  Scenario: compiler happy path
    Tool: Bash
    Steps: run `npx tsc --noEmit`
    Expected: zero diagnostics from ActionButtons/useGameState
    Evidence: .sisyphus/evidence/task-1-build-types.txt

  Scenario: game route still renders
    Tool: Playwright
    Steps: open `/#/moon-throw`; verify page contains `月抛模拟器`; verify at least one action button is visible
    Expected: route loads without runtime crash
    Evidence: .sisyphus/evidence/task-1-moon-throw.png
  ```

  **Commit**: NO | Message: `fix(game): restore build stability` | Files: `src/hooks/useGameState.ts`, `src/components/moon-throw/ActionButtons.tsx`

- [x] 2. Make terminal homepage navigation and project rows real

  **What to do**: Update `src/components/portal/TerminalHome.tsx` and `src/data/projects.ts` so module routing uses router paths (`/games`, `/notes`, `/tools`, `/trends`) instead of hash strings inside `navigate()`. Remove or hide dead `ARCHIVE`/`CONNECT` chips for this pass. Make project rows keyboard/click accessible and use `p.url` where meaningful (`/moon-throw`, external links, or intentionally non-clickable private items). Replace obvious placeholders like `TBD` where the data is already known; keep private items visibly private instead of fake-complete.
  **Must NOT do**: Do not invent full Archive/Connect routes; do not fabricate detail pages for private/internal projects.

  **Recommended Agent Profile**:
  - Category: `visual-engineering` - Reason: UI behavior + semantics + interaction fixes
  - Skills: []
  - Omitted: [`frontend-design`] - design already chosen; this is integration/parity work

  **Parallelization**: Can Parallel: YES | Wave 1 | Blocks: 5, 6 | Blocked By: none

  **References**:
  - `src/components/portal/TerminalHome.tsx:5-234` - current homepage behavior
  - `src/data/projects.ts:1-173` - project URLs/status/progress metadata
  - `src/App.tsx:13-21` - valid route paths
  - `theme/layouts/terminal.html:522-759` - chosen visual behavior baseline

  **Acceptance Criteria**:
  - [ ] Clicking `GAMES`, `NOTES`, `TOOLS`, `TRENDS` routes to the correct page
  - [ ] No visible dead `ARCHIVE` or `CONNECT` chip remains unless intentionally rendered disabled with explicit style
  - [ ] At least one real project entry opens its route/URL correctly
  - [ ] Homepage interactions are keyboard accessible for module chips and clickable project rows

  **QA Scenarios**:
  ```
  Scenario: terminal module routing
    Tool: Playwright
    Steps: open `/#/`; click `GAMES`; verify URL matches `#/games`; navigate back; repeat for `NOTES`, `TOOLS`, `TRENDS`
    Expected: each chip routes to the matching page without wildcard redirect surprises
    Evidence: .sisyphus/evidence/task-2-terminal-modules.png

  Scenario: project row action
    Tool: Playwright
    Steps: open `/#/`; click the `月抛模拟器` project row; verify URL becomes `#/moon-throw`
    Expected: playable project opens correctly
    Evidence: .sisyphus/evidence/task-2-project-click.png
  ```

  **Commit**: NO | Message: `fix(portal): wire terminal navigation` | Files: `src/components/portal/TerminalHome.tsx`, `src/data/projects.ts`

- [x] 3. Add a visible theme switcher with persisted behavior

  **What to do**: Add a UI theme switch control in the homepage shell (or shared layout if cleaner) that uses `ThemeContext`. Keep `terminal` as the default when no stored preference exists, but allow user-selected theme to persist in localStorage. Ensure non-terminal themes remain selectable even if they still share one fallback layout initially.
  **Must NOT do**: Do not force terminal after the user explicitly changes theme.

  **Recommended Agent Profile**:
  - Category: `visual-engineering` - Reason: visible control + theme-state UX
  - Skills: []
  - Omitted: [`frontend-patterns`] - scope is localized and already architecture-bound

  **Parallelization**: Can Parallel: YES | Wave 1 | Blocks: 4, 6 | Blocked By: none

  **References**:
  - `src/contexts/ThemeContext.tsx:1-55` - persistence logic
  - `src/pages/Home.tsx:1-34` - current terminal/default split
  - `README.md` current theme claims - must match behavior after implementation

  **Acceptance Criteria**:
  - [ ] A visible theme switch UI exists on the homepage
  - [ ] First load with empty storage shows terminal
  - [ ] Switching theme updates UI and persists after reload

  **QA Scenarios**:
  ```
  Scenario: default theme on fresh storage
    Tool: Playwright
    Steps: clear localStorage for `owltree-theme`; open `/#/`
    Expected: terminal homepage appears by default
    Evidence: .sisyphus/evidence/task-3-default-theme.png

  Scenario: persistence
    Tool: Playwright
    Steps: switch away from terminal in UI; reload page
    Expected: selected theme persists after reload
    Evidence: .sisyphus/evidence/task-3-theme-persist.png
  ```

  **Commit**: NO | Message: `feat(theme): add visible theme switcher` | Files: `src/pages/Home.tsx`, `src/contexts/ThemeContext.tsx`, any new small UI helper if needed

- [x] 4. Theme secondary routes with shared variables instead of hardcoded colors

  **What to do**: Refactor `src/pages/Games.tsx`, `src/pages/Notes.tsx`, `src/pages/Tools.tsx`, and `src/pages/Trends.tsx` to replace hardcoded page colors/backgrounds with shared CSS variables from `globals.css`. Make terminal theme visually coherent across routes while preserving each page’s information hierarchy.
  **Must NOT do**: Do not rewrite page information architecture or replace all route content in this task.

  **Recommended Agent Profile**:
  - Category: `visual-engineering` - Reason: theme consistency across route UIs
  - Skills: []
  - Omitted: [`ui-ux-pro-max`] - design direction already fixed; this is implementation alignment

  **Parallelization**: Can Parallel: YES | Wave 2 | Blocks: 6 | Blocked By: 3

  **References**:
  - `src/styles/globals.css` - theme variables and terminal blocks
  - `src/pages/Games.tsx:70-157`
  - `src/pages/Notes.tsx:100-202`
  - `src/pages/Tools.tsx:98-202`
  - `src/pages/Trends.tsx:114-307`

  **Acceptance Criteria**:
  - [ ] Secondary pages no longer depend primarily on hardcoded hex backgrounds for theme identity
  - [ ] Terminal theme remains visually coherent when navigating off home
  - [ ] Theme switch visibly affects at least home + four secondary pages

  **QA Scenarios**:
  ```
  Scenario: themed route sweep
    Tool: Playwright
    Steps: open `/#/games`, `/#/notes`, `/#/tools`, `/#/trends` under terminal theme
    Expected: each page uses terminal-consistent palette/typography and no bright fallback background dominates
    Evidence: .sisyphus/evidence/task-4-route-theme-sweep.png

  Scenario: theme switch cross-route consistency
    Tool: Playwright
    Steps: switch theme on home; navigate to one secondary route
    Expected: chosen theme remains applied on that route after navigation
    Evidence: .sisyphus/evidence/task-4-theme-cross-route.png
  ```

  **Commit**: NO | Message: `refactor(theme): align secondary routes` | Files: `src/pages/Games.tsx`, `src/pages/Notes.tsx`, `src/pages/Tools.tsx`, `src/pages/Trends.tsx`, `src/styles/globals.css`

- [x] 5. Make route shells honest and minimally functional

  **What to do**: Fix the most misleading interactions on the secondary pages. `Games` cards must actually navigate using `game.url`. `Tools` category pills must either filter real in-page data or be visually downgraded from interactive controls. `Trends` refresh button must either perform a real local refresh/mock reshuffle or be restyled as a non-action badge if no backend exists. `Notes` entries should be clearly static previews or clickable if a route is added in this pass.
  **Must NOT do**: Do not build a backend or invent new content systems.

  **Recommended Agent Profile**:
  - Category: `unspecified-high` - Reason: mixed interaction/product honesty cleanup across several routes
  - Skills: []
  - Omitted: [`backend-patterns`] - no backend work is in scope

  **Parallelization**: Can Parallel: YES | Wave 2 | Blocks: 6 | Blocked By: 2

  **References**:
  - `src/pages/Games.tsx:16-44,104-151`
  - `src/pages/Tools.tsx:15-64,132-195`
  - `src/pages/Trends.tsx:15-80,162-188`
  - `src/pages/Notes.tsx:16-53,134-195`

  **Acceptance Criteria**:
  - [ ] Games cards no longer fake clickability
  - [ ] Tools filters are either functional or explicitly non-interactive
  - [ ] Trends refresh affordance is truthful
  - [ ] Notes entries are visually honest about whether they are previews or links

  **QA Scenarios**:
  ```
  Scenario: games card navigation
    Tool: Playwright
    Steps: open `/#/games`; click `月抛模拟器`
    Expected: URL changes to `#/moon-throw`
    Evidence: .sisyphus/evidence/task-5-games-nav.png

  Scenario: no fake controls
    Tool: Playwright
    Steps: inspect Tools and Trends controls; attempt click interactions
    Expected: controls either perform real visible state changes or are clearly non-action styling, not deceptive buttons
    Evidence: .sisyphus/evidence/task-5-honest-controls.png
  ```

  **Commit**: NO | Message: `fix(routes): remove deceptive interactions` | Files: `src/pages/Games.tsx`, `src/pages/Tools.tsx`, `src/pages/Trends.tsx`, `src/pages/Notes.tsx`

- [x] 6. Refresh tests to match terminal-default behavior

  **What to do**: Update unit/E2E tests so they assert the current default terminal homepage, real terminal navigation, and the moon-throw route flow. Remove assumptions about old `OWLTREE`/`PROJECTS` hero copy if no longer rendered. Keep the assertions behavior-focused rather than implementation-fragile.
  **Must NOT do**: Do not delete all portal tests just to get green results.

  **Recommended Agent Profile**:
  - Category: `quick` - Reason: direct updates to existing stale tests
  - Skills: []
  - Omitted: [`python-testing`] - stack is TS/Vitest/Playwright, not Python

  **Parallelization**: Can Parallel: YES | Wave 3 | Blocks: Final Verification | Blocked By: 1,2,3,4,5

  **References**:
  - `src/test/App.test.tsx:1-19`
  - `e2e/portal.spec.ts:1-28`
  - `src/pages/Home.tsx:26-34`
  - `src/components/portal/TerminalHome.tsx:62-234`

  **Acceptance Criteria**:
  - [ ] Unit tests assert current default homepage behavior
  - [ ] Portal E2E validates terminal homepage and moon-throw navigation path

  **QA Scenarios**:
  ```
  Scenario: unit suite
    Tool: Bash
    Steps: run project unit test command
    Expected: relevant homepage tests pass with terminal-default expectations
    Evidence: .sisyphus/evidence/task-6-unit-tests.txt

  Scenario: portal E2E
    Tool: Bash
    Steps: run `npx playwright test e2e/portal.spec.ts`
    Expected: portal spec passes against terminal homepage
    Evidence: .sisyphus/evidence/task-6-portal-e2e.txt
  ```

  **Commit**: NO | Message: `test(portal): align with terminal default` | Files: `src/test/App.test.tsx`, `e2e/portal.spec.ts`

- [x] 7. Update docs and remove stale dead code/drift

  **What to do**: Update `README.md`, `AGENTS.md`, and `CLAUDE.md` so they describe the current React/Vite/TypeScript app, `theme/` directory naming, terminal-default status, and current route/theme reality. Remove or explicitly archive dead files like `src/components/portal/CyberSearch.tsx` and `src/hooks/useTheme.ts` if they are truly unused. Check UI utility classes (`glass-card`, `pixel-card`, `vn-window`, etc.) and either restore definitions or simplify references where dead.
  **Must NOT do**: Do not rewrite docs beyond current project truth; keep them concise and accurate.

  **Recommended Agent Profile**:
  - Category: `writing` - Reason: docs truthfulness + controlled cleanup narrative
  - Skills: []
  - Omitted: [`content-strategy`] - this is technical documentation, not marketing copy

  **Parallelization**: Can Parallel: YES | Wave 3 | Blocks: Final Verification | Blocked By: 2,3,4

  **References**:
  - `README.md`
  - `AGENTS.md`
  - `CLAUDE.md`
  - `src/components/portal/CyberSearch.tsx`
  - `src/hooks/useTheme.ts`
  - `src/components/ui/Button.tsx`, `Card.tsx`, `Badge.tsx`, `PixelDivider.tsx`

  **Acceptance Criteria**:
  - [ ] Docs no longer reference `prototypes/` or pure-HTML-only architecture
  - [ ] Dead unused files are removed or intentionally documented
  - [ ] Shared UI classes referenced in code are either defined or cleaned up

  **QA Scenarios**:
  ```
  Scenario: doc truth check
    Tool: Bash
    Steps: search docs for `prototypes/`, `other/moon-throw.html`, and “no build step” claims
    Expected: stale references removed or updated
    Evidence: .sisyphus/evidence/task-7-doc-search.txt

  Scenario: dead code sweep
    Tool: Bash
    Steps: search for imports/usages of removed or archived files/classes
    Expected: no broken imports or obvious stale references remain
    Evidence: .sisyphus/evidence/task-7-dead-code.txt
  ```

  **Commit**: NO | Message: `docs(repo): reflect terminal app reality` | Files: docs + dead code cleanup targets

## Final Verification Wave (MANDATORY — after ALL implementation tasks)
> 4 review agents run in PARALLEL. ALL must APPROVE. Present consolidated results to user and get explicit "okay" before completing.
> **Do NOT auto-proceed after verification. Wait for user's explicit approval before marking work complete.**
> **Never mark F1-F4 as checked before getting user's okay.** Rejection or user feedback -> fix -> re-run -> present again -> wait for okay.
- [ ] F1. Plan Compliance Audit — oracle
- [ ] F2. Code Quality Review — unspecified-high
- [ ] F3. Real Manual QA — unspecified-high (+ playwright if UI)
- [ ] F4. Scope Fidelity Check — deep

## Commit Strategy
- Commit 1: build + terminal routing/theme infrastructure
- Commit 2: route consistency + tests/docs cleanup
- Avoid committing mid-wave unless a stable, reviewable chunk is complete

## Success Criteria
- Terminal is the actual default experience without trapping users there permanently
- Homepage modules and project entries are truthful, usable, and keyboard-safe
- Secondary pages visually belong to the same theming system
- Build/tests/docs all reflect the current shipped product state
