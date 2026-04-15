# Owltree Structure-First Optimization

## TL;DR
> **Summary**: Reduce structural complexity in the moon-throw game flow and terminal homepage while adding missing engineering quality gates so future changes are safer and cheaper.
> **Deliverables**:
> - Decomposed `useGameState` responsibilities into smaller pure modules
> - Slimmer `GameContainer` with extracted scene/panel components
> - Slimmer `TerminalHome` with isolated hover-card/positioning logic
> - Added engineering scripts and CI quality gates for typecheck, lint, coverage, and bundle inspection
> - Regression tests covering game flow, homepage behavior, and new module boundaries
> **Effort**: Large
> **Parallel**: YES - 3 waves
> **Critical Path**: Task 1 → Task 2 → Task 3 → Task 5 → Task 7

## Context
### Original Request
- 用户请求：看看仓库有什么可以优化。

### Interview Summary
- 优先方向已确认：**结构优先**，不是先做纯性能调优。
- 优化范围已确认：**游戏主链路 + 首页 `TerminalHome` + 工程质量闸门**。
- 目标是降低复杂度、提升后续迭代稳定性，并保持当前 UX 与功能行为不变。

### Metis Review (gaps addressed)
- Metis 调用未返回可用分析，已由主规划流程补做自审。
- 已显式加入 guardrails：不新增产品功能、不重做视觉风格、不改变现有路由和主题机制。
- 已补足 acceptance 方向：模块边界、回归测试、CI 闸门、bundle 可见性、行为不回归。

## Work Objectives
### Core Objective
在不改变现有产品功能和主题体验的前提下，降低 `月抛模拟器` 状态与容器复杂度，降低 `TerminalHome` 的 DOM/样式耦合，并建立工程级质量闸门。

### Deliverables
- 更清晰的 moon-throw 状态层、派生选择器层、反馈/结局构建层、action handler 层
- 更小粒度的 `GameContainer` 子组件与场景切换逻辑
- 可测试的 `TerminalHome` hover-card 与定位机制
- 新的 npm scripts / config / CI 检查
- 覆盖关键重构边界的 unit + E2E 回归测试

### Definition of Done (verifiable conditions with commands)
- `npm run build` 成功
- `npm run typecheck` 成功
- `npm run lint` 成功
- `npm run test:unit -- --coverage` 成功并输出 coverage 摘要
- `npm run test:e2e` 成功
- `npm run analyze` 能生成 bundle 分析结果或可视化构建输出
- GitHub Actions 在构建前执行质量检查（typecheck/lint/unit/e2e 依项目策略）

### Must Have
- Preserve current routes, theme switching, moon-throw gameplay semantics, and homepage navigation
- Extract pure logic from `useGameState` before changing rendered behavior
- Keep game engine pure TypeScript with no React dependency bleed
- Prefer small pure utilities/selectors over new global state libraries
- Add or strengthen tests around refactored boundaries before/with refactor

### Must NOT Have (guardrails, AI slop patterns, scope boundaries)
- Must NOT redesign page visuals or change copy unless required by tests/selectors
- Must NOT introduce Redux/Zustand/XState or any new state framework
- Must NOT rewrite the game engine rules or rebalance gameplay numbers
- Must NOT collapse all optimizations into one giant diff without intermediate verification
- Must NOT add speculative abstractions that are not used immediately

## Verification Strategy
> ZERO HUMAN INTERVENTION - all verification is agent-executed.
- Test decision: **tests-after with targeted safety tests first** using Vitest + Testing Library + Playwright
- QA policy: Every implementation task includes agent-executed happy-path and failure/edge scenarios
- Evidence: `.sisyphus/evidence/task-{N}-{slug}.{ext}`

## Execution Strategy
### Parallel Execution Waves
> Target: 5-8 tasks per wave. <3 per wave (except final) = under-splitting.
> Extract shared dependencies as Wave-1 tasks for max parallelism.

Wave 1: engineering baseline + game-state decomposition foundation

Wave 2: game container decomposition + homepage decomposition

Wave 3: regression coverage + CI enforcement + cleanup

### Dependency Matrix (full, all tasks)
- Task 1 blocks Tasks 2, 5, 6, 7
- Task 2 blocks Tasks 3 and 4
- Task 3 blocks Task 5 and partially informs Task 7
- Task 4 can run after Task 2; blocks Task 7 homepage regression assertions
- Task 5 depends on Task 3
- Task 6 depends on Tasks 1, 3, 4, 5
- Task 7 depends on Tasks 1, 3, 4, 5, 6

### Agent Dispatch Summary (wave → task count → categories)
- Wave 1 → 2 tasks → quick / unspecified-high
- Wave 2 → 3 tasks → unspecified-high / visual-engineering
- Wave 3 → 2 tasks → quick / unspecified-high

## TODOs
> Implementation + Test = ONE task. Never separate.
> EVERY task MUST have: Agent Profile + Parallelization + QA Scenarios.

- [x] 1. Establish engineering quality baseline

  **What to do**: Add dedicated frontend engineering scripts and configs for `typecheck`, `lint`, coverage reporting, and bundle analysis. Update CI so deployment is gated by quality checks instead of build-only. Prefer minimal-tooling additions that fit Vite + React + TypeScript. If lint is absent, add ESLint with TypeScript/React rules and wire it into npm scripts and CI.
  **Must NOT do**: Must NOT introduce heavy formatting/process tooling unrelated to this plan (e.g. Storybook, Husky, Changesets, monorepo tooling). Must NOT change deployment target or GitHub Pages routing.

  **Recommended Agent Profile**:
  - Category: `quick` - Reason: mostly configuration and script wiring with bounded blast radius
  - Skills: [`coding-standards`] - enforce sane TS/React lint defaults; [`verification-before-completion`] - ensure commands actually run
  - Omitted: [`frontend-design`] - no UI work needed

  **Parallelization**: Can Parallel: NO | Wave 1 | Blocks: [2, 5, 6, 7] | Blocked By: []

  **References** (executor has NO interview context - be exhaustive):
  - Pattern: `package.json:6-38` - current scripts surface; add new commands without breaking existing ones
  - Pattern: `vite.config.ts:1-14` - minimal Vite config; bundle analysis should extend this file
  - Pattern: `vitest.config.ts:1-18` - existing test runner config; coverage should be added here or via CLI-compatible config
  - Pattern: `playwright.config.ts:1-25` - E2E is already wired to `npm run preview`
  - Pattern: `.github/workflows/deploy.yml:1-44` - existing CI only runs `npm ci` and `npm run build`
  - External: `https://vite.dev/guide/` - Vite plugin/config reference

  **Acceptance Criteria** (agent-executable only):
  - [ ] `npm run typecheck` exits 0
  - [ ] `npm run lint` exits 0
  - [ ] `npm run test:unit -- --coverage` exits 0 and prints coverage summary
  - [ ] `npm run analyze` exits 0 and emits bundle analysis artifact/output
  - [ ] `.github/workflows/deploy.yml` includes quality checks before build/deploy

  **QA Scenarios** (MANDATORY - task incomplete without these):
  ```
  Scenario: Baseline quality gate passes
    Tool: Bash
    Steps: Run `npm run typecheck && npm run lint && npm run test:unit -- --coverage`
    Expected: All commands succeed with zero non-ignored errors
    Evidence: .sisyphus/evidence/task-1-quality-baseline.txt

  Scenario: Bundle analysis command is wired correctly
    Tool: Bash
    Steps: Run `npm run analyze`
    Expected: Command succeeds and emits analyzer output/artifact instead of “missing script” or config failure
    Evidence: .sisyphus/evidence/task-1-quality-baseline-analyze.txt
  ```

  **Commit**: YES | Message: `chore(tooling): add frontend quality gates` | Files: [`package.json`, `vite.config.ts`, `vitest.config.ts`, `.github/workflows/deploy.yml`, new lint config if added]

- [x] 2. Split moon-throw state orchestration into focused modules

  **What to do**: Refactor `src/hooks/useGameState.ts` by extracting pure logic into adjacent modules under `src/hooks/` or a `src/hooks/useGameState/` folder. Separate at least: feedback/endings builders, progress/achievement updates, reducer action handlers, and derived selectors. Keep exported `useGameState()` API stable unless all internal call sites are updated in the same task and tests prove no regression.
  **Must NOT do**: Must NOT move core deterministic game rules out of `src/game/engine/`. Must NOT add a new global store library. Must NOT change gameplay values in `CONFIG` or data files.

  **Recommended Agent Profile**:
  - Category: `unspecified-high` - Reason: non-trivial refactor with many behavior branches
  - Skills: [`coding-standards`] - maintain TS ergonomics; [`tdd-workflow`] - enforce safe refactor sequencing
  - Omitted: [`frontend-design`] - no presentational redesign

  **Parallelization**: Can Parallel: NO | Wave 1 | Blocks: [3, 4] | Blocked By: [1]

  **References** (executor has NO interview context - be exhaustive):
  - Pattern: `src/hooks/useGameState.ts:27-58` - current store/action type definitions
  - Pattern: `src/hooks/useGameState.ts:73-170` - feedback/progress helper logic already present and extractable
  - Pattern: `src/hooks/useGameState.ts:265-500` - reducer branches to split by action domain
  - Pattern: `src/hooks/useGameState.ts:503-565` - exported hook API that should remain stable
  - API/Type: `src/game/types.ts` - core `GameState`, `Constraint`, `GameEnding` contracts
  - Test: `src/game/engine/__tests__/*.test.ts` - existing engine safety net; refactor should not break engine behavior
  - Test: `src/test/App.test.tsx:42-47` - app-level moon-throw route smoke coverage

  **Acceptance Criteria** (agent-executable only):
  - [ ] `useGameState.ts` is materially smaller and primarily orchestration-facing
  - [ ] Extracted modules contain pure or narrowly scoped logic with explicit exports
  - [ ] Existing `GameContainer` call sites compile without broken imports
  - [ ] `npm run test:unit` passes after refactor

  **QA Scenarios** (MANDATORY - task incomplete without these):
  ```
  Scenario: Moon-throw state hook still supports intro-to-play flow
    Tool: Bash
    Steps: Run targeted unit tests touching app shell and any new hook/reducer tests, e.g. `npm run test:unit -- App.test.tsx useGameState`
    Expected: Tests pass and no reducer/action branch snapshots/assertions fail
    Evidence: .sisyphus/evidence/task-2-state-split.txt

  Scenario: Type safety catches broken exports after extraction
    Tool: Bash
    Steps: Run `npm run typecheck`
    Expected: No unresolved imports, type mismatches, or circular refactor breakage
    Evidence: .sisyphus/evidence/task-2-state-split-typecheck.txt
  ```

  **Commit**: YES | Message: `refactor(game): split moon-throw state orchestration` | Files: [`src/hooks/useGameState.ts`, extracted hook helper modules, any new tests]

- [x] 3. Decompose `GameContainer` into scene and panel components

  **What to do**: Break `src/components/moon-throw/GameContainer.tsx` into smaller presentational components with explicit responsibilities: terminal shell/header, stats panel, portrait/tag panel, action panel, scene renderer (intro/dialogue/action/result), and result/feedback bridge if needed. Keep `GameContainer` as composition root that consumes `useGameState()` and local UI-only scene/fullscreen state. Move duplicated class-heavy blocks into focused components without changing visible behavior.
  **Must NOT do**: Must NOT change route structure, main game copy, panic-mode semantics, or action availability rules. Must NOT migrate state from hook into component-local state except UI-only concerns.

  **Recommended Agent Profile**:
  - Category: `unspecified-high` - Reason: medium-large React decomposition with behavior preservation
  - Skills: [`frontend-patterns`] - component extraction patterns; [`coding-standards`] - typed props discipline
  - Omitted: [`frontend-design`] - preserve current visuals instead of redesigning

  **Parallelization**: Can Parallel: NO | Wave 2 | Blocks: [5, 6, 7] | Blocked By: [2]

  **References** (executor has NO interview context - be exhaustive):
  - Pattern: `src/components/moon-throw/GameContainer.tsx:22-90` - current data + handler setup
  - Pattern: `src/components/moon-throw/GameContainer.tsx:117-289` - current scene layout sections to separate
  - Pattern: `src/components/moon-throw/VNDialogueBox.tsx` - existing dialogue presentational primitive
  - Pattern: `src/components/moon-throw/VNPortrait.tsx` - portrait rendering primitive
  - Pattern: `src/components/moon-throw/VNChoices.tsx` - action choice primitive
  - Pattern: `src/components/moon-throw/FeedbackModal.tsx` - existing gameover modal bridge
  - Test: `e2e/game-flow.spec.ts:1-25` - current shallow flow coverage to preserve selectors/behavior

  **Acceptance Criteria** (agent-executable only):
  - [ ] `GameContainer.tsx` is materially smaller and primarily composition/orchestration
  - [ ] Extracted components use typed props and no duplicated gameplay logic
  - [ ] Intro, dialogue, action, result, and gameover flows still render correctly
  - [ ] `npm run build` and relevant tests pass

  **QA Scenarios** (MANDATORY - task incomplete without these):
  ```
  Scenario: Core moon-throw UI still renders and transitions
    Tool: Bash
    Steps: Run `npm run test:e2e -- e2e/game-flow.spec.ts`
    Expected: Existing moon-throw E2E coverage passes without selector regressions
    Evidence: .sisyphus/evidence/task-3-game-container-e2e.txt

  Scenario: Intro route still mounts after component extraction
    Tool: Bash
    Steps: Run `npm run test:unit -- App.test.tsx`
    Expected: The moon-throw route test still passes and build-facing render errors are absent
    Evidence: .sisyphus/evidence/task-3-game-container-unit.txt
  ```

  **Commit**: YES | Message: `refactor(game-ui): decompose game container scenes` | Files: [`src/components/moon-throw/GameContainer.tsx`, extracted moon-throw UI components, related tests]

- [x] 4. Isolate `TerminalHome` DOM and hover-card logic

  **What to do**: Refactor `src/components/portal/TerminalHome.tsx` so data mapping, hover-card rendering, and card positioning/portal behavior are isolated into dedicated components/hooks. Replace ad hoc `document.body.appendChild` wiring with a React-friendly portal pattern or encapsulated hook that owns mount/unmount behavior and is testable. Centralize repetitive inline style decisions where practical without changing the terminal aesthetic.
  **Must NOT do**: Must NOT redesign terminal visual language, change project list content, alter routes, or remove current hover-card functionality. Must NOT introduce a generic overlay framework that is only used once.

  **Recommended Agent Profile**:
  - Category: `visual-engineering` - Reason: UI structure refactor with DOM-behavior preservation
  - Skills: [`frontend-patterns`] - component/hook decomposition; [`coding-standards`] - safe TS/React boundaries
  - Omitted: [`ui-ux-pro-max`] - no visual redesign requested

  **Parallelization**: Can Parallel: YES | Wave 2 | Blocks: [6, 7] | Blocked By: [2]

  **References** (executor has NO interview context - be exhaustive):
  - Pattern: `src/components/portal/TerminalHome.tsx:22-58` - current ref map + DOM append/remove logic
  - Pattern: `src/components/portal/TerminalHome.tsx:128-203` - project row + hover card coupling
  - Pattern: `src/components/portal/TerminalHome.tsx:213-223` - module navigation button rendering
  - API/Type: `src/data/projects.ts:1-173` - project card data contract to preserve
  - Test: `e2e/portal.spec.ts:1-29` - navigation behaviors that must survive refactor
  - Test: `src/test/App.test.tsx:36-40` - home route smoke assertion

  **Acceptance Criteria** (agent-executable only):
  - [ ] `TerminalHome.tsx` is materially smaller and primarily composition-focused
  - [ ] Hover-card positioning logic is isolated from markup mapping
  - [ ] Portal/home navigation behavior remains unchanged
  - [ ] Home route tests and portal E2E tests pass

  **QA Scenarios** (MANDATORY - task incomplete without these):
  ```
  Scenario: Terminal homepage still loads and navigates
    Tool: Bash
    Steps: Run `npm run test:e2e -- e2e/portal.spec.ts`
    Expected: Portal homepage tests pass, including navigation into moon-throw and back home
    Evidence: .sisyphus/evidence/task-4-terminal-home-e2e.txt

  Scenario: Home route still renders terminal shell after decomposition
    Tool: Bash
    Steps: Run `npm run test:unit -- App.test.tsx`
    Expected: `SYSTEM ONLINE` assertion still passes and no portal-related render errors occur
    Evidence: .sisyphus/evidence/task-4-terminal-home-unit.txt
  ```

  **Commit**: YES | Message: `refactor(home): isolate terminal hover card logic` | Files: [`src/components/portal/TerminalHome.tsx`, extracted portal components/hooks, related tests]

- [x] 5. Add focused regression tests for extracted game boundaries

  **What to do**: Add unit tests around the newly extracted game-state helpers/selectors and at least one render-level test for the decomposed moon-throw container flow. Cover the highest-risk branches: action feedback, gameover transition, hidden/revealed tags count, and partner replacement/retention behavior on feedback close.
  **Must NOT do**: Must NOT rely only on broad app smoke tests. Must NOT snapshot massive rendered trees when targeted assertions are clearer.

  **Recommended Agent Profile**:
  - Category: `unspecified-high` - Reason: test design around refactor seams needs judgment
  - Skills: [`tdd-workflow`] - precise regression coverage; [`coding-standards`] - keep tests maintainable
  - Omitted: [`frontend-design`] - test-only focus

  **Parallelization**: Can Parallel: NO | Wave 2 | Blocks: [6, 7] | Blocked By: [3]

  **References** (executor has NO interview context - be exhaustive):
  - Pattern: `src/hooks/useGameState.ts:283-496` - current branch behaviors that deserve targeted regression tests
  - Test: `src/game/engine/__tests__/dialogue-system.test.ts` - existing deterministic style for game assertions
  - Test: `src/game/engine/__tests__/game-over-conditions.test.ts` - domain-level game over examples
  - Test: `src/test/App.test.tsx:42-47` - current route-level render smoke
  - Test: `e2e/game-flow.spec.ts:1-25` - current shallow E2E that should be complemented, not replaced

  **Acceptance Criteria** (agent-executable only):
  - [ ] New tests cover extracted helper modules or reducer seams directly
  - [ ] At least one test asserts feedback close behavior / partner retention semantics
  - [ ] At least one test asserts gameover/result transition behavior
  - [ ] `npm run test:unit -- --coverage` passes

  **QA Scenarios** (MANDATORY - task incomplete without these):
  ```
  Scenario: New moon-throw regression tests pass
    Tool: Bash
    Steps: Run targeted unit tests for new game state/helper/component specs
    Expected: All targeted tests pass and explicitly cover extracted seams
    Evidence: .sisyphus/evidence/task-5-game-regression.txt

  Scenario: Coverage run remains green after added tests
    Tool: Bash
    Steps: Run `npm run test:unit -- --coverage`
    Expected: Coverage report completes successfully with no newly failing test suites
    Evidence: .sisyphus/evidence/task-5-game-regression-coverage.txt
  ```

  **Commit**: YES | Message: `test(game): add moon-throw regression coverage` | Files: [new/updated hook and component test files]

- [x] 6. Strengthen homepage and shell regression coverage

  **What to do**: Add focused tests for `TerminalHome` and app shell behavior that validate home rendering, module navigation, and hover-card/path logic at the right level. Prefer React Testing Library for structure/behavior and keep Playwright for true route flow. If portal extraction introduces hooks/utilities, add unit tests for positioning decisions with deterministic viewport assumptions.
  **Must NOT do**: Must NOT overfit tests to implementation details like private state names. Must NOT duplicate the exact same assertion across unit and E2E layers.

  **Recommended Agent Profile**:
  - Category: `quick` - Reason: bounded regression test expansion once refactor lands
  - Skills: [`tdd-workflow`] - layered test choices; [`coding-standards`] - avoid brittle tests
  - Omitted: [`frontend-design`] - not relevant

  **Parallelization**: Can Parallel: YES | Wave 3 | Blocks: [7] | Blocked By: [1, 3, 4, 5]

  **References** (executor has NO interview context - be exhaustive):
  - Pattern: `src/test/App.test.tsx:1-48` - current shell test style and setup
  - Pattern: `src/components/portal/TerminalHome.tsx:60-236` - home UI behavior under test
  - API/Type: `src/data/projects.ts:19-173` - stable data displayed in terminal rows/cards
  - Test: `e2e/portal.spec.ts:1-29` - route-level expectations to keep

  **Acceptance Criteria** (agent-executable only):
  - [ ] Unit tests cover homepage rendering plus at least one interaction path beyond simple smoke text
  - [ ] Tests remain stable under current hash routing
  - [ ] `npm run test:unit` and `npm run test:e2e -- e2e/portal.spec.ts` pass

  **QA Scenarios** (MANDATORY - task incomplete without these):
  ```
  Scenario: Homepage unit regression suite passes
    Tool: Bash
    Steps: Run targeted app/homepage tests
    Expected: Home shell and portal interactions pass without brittle timing failures
    Evidence: .sisyphus/evidence/task-6-home-regression.txt

  Scenario: Portal route flow still works end-to-end
    Tool: Bash
    Steps: Run `npm run test:e2e -- e2e/portal.spec.ts`
    Expected: Route transitions between home, games, and moon-throw pass
    Evidence: .sisyphus/evidence/task-6-home-regression-e2e.txt
  ```

  **Commit**: YES | Message: `test(portal): strengthen homepage regression coverage` | Files: [`src/test/App.test.tsx`, new portal/home tests, optional hook tests]

- [x] 7. Integrate and verify end-to-end engineering workflow

  **What to do**: Perform final integration cleanup across refactored modules and quality gates. Update any remaining imports, remove dead code left by extractions, ensure analyzer/coverage/lint docs in scripts are coherent, and validate the full command chain used by CI and local development. If deploy workflow should skip E2E due to GitHub Pages preview constraints, document and encode the chosen check set explicitly rather than leaving ambiguity.
  **Must NOT do**: Must NOT silently weaken checks to get green. Must NOT leave duplicate legacy code paths or unused helper modules behind.

  **Recommended Agent Profile**:
  - Category: `unspecified-high` - Reason: repo-wide integration sweep after multiple refactors
  - Skills: [`verification-before-completion`] - final evidence-driven validation; [`coding-standards`] - cleanup discipline
  - Omitted: [`frontend-design`] - no UI redesign

  **Parallelization**: Can Parallel: NO | Wave 3 | Blocks: [F1, F2, F3, F4] | Blocked By: [1, 3, 4, 5, 6]

  **References** (executor has NO interview context - be exhaustive):
  - Pattern: `package.json:6-38` - final command surface must remain coherent
  - Pattern: `.github/workflows/deploy.yml:17-44` - final quality-gated workflow shape
  - Pattern: `playwright.config.ts:1-25` - confirm E2E server assumptions still hold
  - Pattern: `src/App.tsx` - verify top-level routing and page integration after refactors
  - Test: `src/test/App.test.tsx`, `e2e/portal.spec.ts`, `e2e/game-flow.spec.ts` - final repo regression suite anchors

  **Acceptance Criteria** (agent-executable only):
  - [ ] `npm run typecheck && npm run lint && npm run test:unit -- --coverage && npm run build` all succeed
  - [ ] `npm run test:e2e` succeeds or CI exclusion is explicitly justified/configured in code/workflow
  - [ ] No dead imports / obviously orphaned files remain from refactor
  - [ ] Final diff matches scope: structure-first optimization only

  **QA Scenarios** (MANDATORY - task incomplete without these):
  ```
  Scenario: Full local verification chain passes
    Tool: Bash
    Steps: Run `npm run typecheck && npm run lint && npm run test:unit -- --coverage && npm run build && npm run test:e2e`
    Expected: Entire validation chain succeeds end-to-end
    Evidence: .sisyphus/evidence/task-7-final-integration.txt

  Scenario: Scope fidelity check on changed files
    Tool: Bash
    Steps: Review `git diff --name-only` and `git diff --stat` after implementation
    Expected: Changed files are limited to game/homepage structure, tests, tooling, and CI-related paths; no unrelated feature work appears
    Evidence: .sisyphus/evidence/task-7-final-integration-scope.txt
  ```

  **Commit**: YES | Message: `chore(repo): finalize structure-first optimization workflow` | Files: [all remaining touched files in scope]

## Final Verification Wave (MANDATORY — after ALL implementation tasks)
> 4 review agents run in PARALLEL. ALL must APPROVE. Present consolidated results to user and get explicit "okay" before completing.
> **Do NOT auto-proceed after verification. Wait for user's explicit approval before marking work complete.**
> **Never mark F1-F4 as checked before getting user's okay.** Rejection or user feedback -> fix -> re-run -> present again -> wait for okay.
- [x] F1. Plan Compliance Audit — oracle
- [x] F2. Code Quality Review — unspecified-high
- [x] F3. Real Manual QA — unspecified-high (+ playwright if UI)
- [x] F4. Scope Fidelity Check — deep

## Commit Strategy
- Commit after each major task or tightly related task pair.
- Prefer commits:
  - `chore(tooling): add frontend quality gates`
  - `refactor(game): split moon-throw state orchestration`
  - `refactor(game-ui): decompose game container scenes`
  - `refactor(home): isolate terminal hover card logic`
  - `test(regression): strengthen portal and game coverage`

## Success Criteria
- Refactored files are materially smaller and more focused
- Critical behavior is covered by executable tests rather than manual confidence
- CI validates more than build alone
- Future feature work can target smaller modules with less merge risk
