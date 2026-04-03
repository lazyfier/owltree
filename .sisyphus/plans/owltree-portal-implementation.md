# Owltree Portal — 完整实施计划

## TL;DR
> **Summary**: 将 owltree 仓库从纯 HTML 项目迁移为 Vite + React + TypeScript SPA，包含二次元赛博风门户首页和完整重写的月抛模拟器游戏，部署到 GitHub Pages。
> **Deliverables**: Portal 首页（Hero + 项目网格 + 个人资料占位）, Moon-Throw 游戏完整 React 重写, GitHub Pages 自动部署
> **Effort**: Large
> **Parallel**: YES — 5 waves
> **Critical Path**: Wave 1 (scaffold) → Wave 2 (game engine + characterization tests) → Wave 3 (game UI) ∥ Wave 4 (portal UI) → Wave 5 (deploy)

## Context
### Original Request
用户要求：① 将 index.html 打造为二次元风格的个人门户首页 + 项目中转站 ② 用 Vite+React 重写现有 moon-throw.html 游戏 ③ 视觉风格参考 kurama.cargo.site，组件参考 shadcn.net ④ 加入像素风元素 ⑤ 去掉紫色，用更高级的配色

### Interview Summary
- **技术栈**: 用户明确选择方案 B（Vite + React + TypeScript + Tailwind + Framer Motion）
- **配色**: 赛博青橙（深海黑 + 青玉高光 + 珊瑚点缀），无紫色
- **像素风**: 克制使用——像素字体仅用于装饰，像素边框/粒子混合，不全文像素化
- **个人资料**: 暂时占位，后续用户自行填写
- **语言**: 首页支持中英文自动切换（浏览器语言检测）

### Metis Review (Gaps Addressed)
- **行为清单**: 显式列出所有需保留的游戏机制，附源码行号
- **引擎先行**: 游戏逻辑必须先提取为纯 TS 引擎，通过 characterization tests 锁定行为，再包裹 React UI
- **可测试性**: 引入可注入 RNG（`seededRng`），概率逻辑可确定性测试
- **紫色重映射**: 原代码中 `bg-purple-*` 标签色 → 映射到新配色系统的 `bg-amber-*`/`bg-coral-*`
- **路由决策**: HashRouter + base `/owltree/`
- **游戏状态**: 离开即重置，无持久化
- **Non-Goals**: 明确列出，防止范围蔓延

### Decision Log
| # | Decision | Choice | Rationale |
|---|----------|--------|-----------|
| D1 | Router | HashRouter | 零配置不 404，GitHub Pages 最稳 |
| D2 | Base path | `/owltree/` | 项目页部署 |
| D3 | Game persistence | Auto-reset | 离开即重置，最简 |
| D4 | Portal language | Auto i18n | 浏览器 `navigator.language` 检测，中/英切换 |
| D5 | Color remap | Purple → amber/coral | 保留逻辑语义，视觉去紫 |
| D6 | Test framework | Vitest + RTL + Playwright | 引擎用 Vitest，组件用 RTL，E2E 用 Playwright |

## Work Objectives
### Core Objective
产出两个可访问页面：① `/` 门户首页（二次元赛博风）② `/#/moon-throw` 完整游戏

### Deliverables
1. `npm run dev` 正常启动开发服务器
2. `npm run build` 成功产出 dist/
3. `npm run test:unit` 全部通过（游戏引擎 characterization tests）
4. `npm run test:e2e` 全部通过（路由 + 游戏流程）
5. GitHub Actions 推送后自动部署

### Definition of Done
- [ ] `npm run build` exits 0
- [ ] `npm run test:unit` — 全绿
- [ ] `npm run test:e2e` — 全绿
- [ ] `npm run preview` → HashRouter `/` 显示门户首页
- [ ] `npm run preview` → HashRouter `/#/moon-throw` 显示游戏
- [ ] `npm run preview` → 游戏延迟诊断机制可完整走通
- [ ] `npm run preview` → 约束系统正常阻断按钮
- [ ] `npm run preview` → 恐慌模式触发时 UI 正确变化
- [ ] 无紫色残留（grep 验证）

### Must Have
- Portal 首页全部区块（Hero / ProfileCard / ProjectGrid / Footer）
- Moon-Throw 完整游戏逻辑（所有标签、疾病、约束、延迟诊断）
- 像素风装饰元素（字体、边框、粒子、分隔线）
- 玻璃态组件系统
- 响应式布局
- GitHub Pages 自动部署

### Must NOT Have
- ❌ 后端 / API / 数据库
- ❌ 用户认证
- ❌ CMS / 博客引擎
- ❌ localStorage 游戏存档
- ❌ 新增游戏机制或数值调整
- ❌ 国际化框架（i18next 等）—— 用简单 JS 检测即可
- ❌ 超过一个额外可交互项目（仅门户 + 游戏）
- ❌ CRT 扫描线效果
- ❌ 全页面像素化
- ❌ 像素字体用于正文

## Behavior Inventory (Preserved from moon-throw.html)

以下行为必须 100% 保留，附源码行号供 executor 参考：

| # | Mechanism | Source Lines | Description |
|---|-----------|-------------|-------------|
| B1 | State shape | 350-361 | frustration, anxiety, turn, items, partner, infected, history |
| B2 | Disease definitions | 365-372 | 6 diseases with risk types, descriptions |
| B3 | Tag system | 389-457 | 60+ tags with risk, constraint, hiddenChance, clue |
| B4 | Partner generation | 505-555 | Random tag selection, disease assignment, constraint compatibility |
| B5 | Constraint logic | 642-658 | no_condom, condom_only, no_oral, oral_only + mutual exclusion |
| B6 | Hidden tag guarantee | 532 | At least one tag must be revealed initially |
| B7 | Meters & thresholds | 557-582 | Frustration/anxiety bars, panic mode at anxiety≥80 |
| B8 | Action effects | CONFIG object 327-348 | Reward/stress per action type |
| B9 | Delayed diagnosis | 781-793 | Infection hidden, revealed only at hospital/endgame |
| B10 | Hospital mechanic | 781-793 | Clears anxiety, reveals infection status |
| B11 | Game over conditions | advanceTime() 674-692 | Frustration≥100, anxiety≥100 |
| B12 | Item usage (testkit) | 760-779 | Reveals all tags, shows disease result |
| B13 | Turn history recording | 694-724 | Records each turn with outcome classification |
| B14 | Panic mode visual | 557-582 | Blur, shake, hidden tags at anxiety≥80 |
| B15 | Button disable overlay | 660-670 | Disabled buttons get crossed-out overlay |

## Verification Strategy
- **Test decision**: Tests-after for engine (characterization), tests-after for UI
- **QA policy**: Every task has agent-executable QA scenarios
- **Evidence**: .sisyphus/evidence/task-{N}-{slug}.{ext}
- **Test scripts**:
  - `npm run test:unit` — Vitest for game engine
  - `npm run test:e2e` — Playwright for routes + game flow
- **Grep check**: `grep -r "purple\|violet\|#7c3aed\|#8b5cf6" src/ --include="*.tsx" --include="*.css"` must return 0 results

## Execution Strategy
### Parallel Execution Waves

**Wave 1**: Foundation — Scaffold, tooling, visual system (3 tasks)
**Wave 2**: Game Engine — Extract + characterize + implement pure TS engine (4 tasks)
**Wave 3**: Game UI — React components wrapping engine (3 tasks) ∥ Portal UI (4 tasks)
**Wave 4**: Integration — i18n, responsive polish, cross-route QA (3 tasks)
**Wave 5**: Deployment — GitHub Actions, base-path, final verification (2 tasks)

### Dependency Matrix
- Wave 1 → all others
- Wave 2 → Wave 3 (game UI needs engine)
- Wave 1 → Wave 3 (portal UI needs visual system, parallel with Wave 2)
- Wave 3 → Wave 4
- Wave 4 → Wave 5

### Agent Dispatch Summary
| Wave | Tasks | Categories |
|------|-------|-----------|
| 1 | 3 | quick, unspecified-high |
| 2 | 4 | deep, unspecified-high |
| 3 | 7 | visual-engineering, unspecified-high |
| 4 | 3 | unspecified-high |
| 5 | 2 | quick, unspecified-high |

## TODOs

### Wave 1: Foundation

- [x] 1. Scaffold Vite + React + TypeScript project with all tooling

  **What to do**:
  1. `npm create vite@latest . -- --template react-ts` (in a temp dir, then merge into repo preserving .git)
  2. Install deps: `tailwindcss postcss autoprefixer framer-motion react-router-dom lucide-react clsx tailwind-merge`
  3. Install dev deps: `vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom playwright @playwright/test`
  4. `npx tailwindcss init -p`
  5. Configure `tailwind.config.js` with extended colors (deep-sea, ink-blue, teal-accent, coral, amber-accent, rose-accent), fontFamily (sans, display, pixel), keyframes (float, glow, pixelBlink), boxShadow (pixel-border)
  6. Configure `vite.config.ts`: `base: '/owltree/'`, resolve alias `@/` → `src/`
  7. Add scripts to `package.json`: `test:unit`, `test:e2e`, `build`, `preview`
  8. Set up `vitest.config.ts` with jsdom environment
  9. Create `src/styles/globals.css` with: font imports (Inter, Noto Sans SC, Space Grotesk, Press Start 2P), tailwind directives, component classes (glass-card, glass-button, gradient-text, glow-border, pixel-card, pixel-badge, pixel-divider, pixel-text)
  10. Create `src/App.tsx` with HashRouter skeleton: `/` → placeholder, `/#/moon-throw` → placeholder
  11. Preserve existing `other/moon-throw.html` (do NOT delete it during migration)

  **Must NOT do**:
  - Do NOT delete .git history
  - Do NOT delete other/moon-throw.html
  - Do NOT start building UI components yet
  - Do NOT install any purple-related packages

  **Recommended Agent Profile**:
  - Category: `unspecified-high` — Reason: Multi-config setup requiring careful attention
  - Skills: [] — Standard tooling setup
  - Omitted: [] — No specialized skills needed

  **Parallelization**: Can Parallel: NO | Wave 1 | Blocks: all | Blocked By: none

  **References**:
  - AGENTS.md — Project conventions (no npm in root originally, now transitioning)
  - other/moon-throw.html:1-94 — Existing Tailwind CDN usage pattern
  - AGENTS.md anti-patterns — "Don't add npm/node_modules" is now overridden by user's explicit tech choice

  **Acceptance Criteria**:
  - [ ] `npm run dev` starts without errors on port 5173
  - [ ] `npm run build` exits 0
  - [ ] `npm run test:unit` runs (even if no tests yet)
  - [ ] Tailwind utility classes render correctly (verify with a test div)
  - [ ] `font-pixel` class applies Press Start 2P font
  - [ ] `glass-card` class applies backdrop-blur + border + shadow
  - [ ] `pixel-badge` class renders with hard edges + teal accent
  - [ ] HashRouter navigates between `/#/` and `/#/moon-throw`
  - [ ] `other/moon-throw.html` still exists unchanged

  **QA Scenarios**:
  ```
  Scenario: Dev server starts
    Tool: Bash
    Steps: npm run dev (background 5s), curl http://localhost:5173
    Expected: HTML response containing "Vite" or "React"
    Evidence: .sisyphus/evidence/task-1-dev-server.txt

  Scenario: Build succeeds
    Tool: Bash
    Steps: npm run build
    Expected: Exit code 0, dist/ directory exists
    Evidence: .sisyphus/evidence/task-1-build.txt

  Scenario: Tailwind classes work
    Tool: Bash
    Steps: Add test div with glass-card + pixel-badge classes to App.tsx, run build, grep output for backdrop-blur
    Expected: Output HTML contains backdrop-blur CSS
    Evidence: .sisyphus/evidence/task-1-tailwind.txt
  ```

  **Commit**: YES | Message: `feat: scaffold Vite React TypeScript project with Tailwind, Vitest, and Playwright` | Files: package.json, vite.config.ts, tailwind.config.js, tsconfig.json, vitest.config.ts, src/styles/globals.css, src/App.tsx, index.html

---

- [x] 2. Create base UI component library (Button, Card, Badge, PixelDivider)

  **What to do**:
  1. Create `src/components/ui/Button.tsx` — variants: primary (glass-button + teal), secondary (glass), ghost (transparent + hover glow), danger (coral border), pixel (hard-edge + pixel-shadow). Sizes: sm/md/lg. Props: variant, size, children, onClick, disabled, className, icon
  2. Create `src/components/ui/Card.tsx` — variants: glass (default rounded glass), interactive (hover lift + glow), pixel (hard-edge + offset shadow), featured (teal border highlight). Props: variant, children, className, onClick
  3. Create `src/components/ui/Badge.tsx` — variants: default (glass pill), pixel (hard-edge + teal accent). Props: variant, children, color (teal/coral/amber)
  4. Create `src/components/ui/PixelDivider.tsx` — Repeating 8px teal blocks pattern divider. Props: className
  5. Create `src/lib/cn.ts` — clsx + tailwind-merge utility
  6. Write basic RTL snapshot tests for each component variant

  **Must NOT do**:
  - Do NOT use any purple/violet colors
  - Do NOT make components overly complex — keep props minimal
  - Do NOT add Framer Motion animations yet (Wave 3)

  **Recommended Agent Profile**:
  - Category: `visual-engineering` — Reason: UI component creation with specific design system
  - Skills: [] — Standard React + Tailwind
  - Omitted: [] — No specialized skills needed

  **Parallelization**: Can Parallel: NO | Wave 1 | Blocks: Wave 3 | Blocked By: Task 1

  **References**:
  - src/styles/globals.css — CSS class definitions (glass-card, glass-button, pixel-card, pixel-badge, pixel-divider)
  - tailwind.config.js — Custom colors and fonts
  - other/moon-throw.html:28-32 — Existing button animation pattern (popIn)

  **Acceptance Criteria**:
  - [ ] All Button variants render without errors
  - [ ] All Card variants render without errors
  - [ ] Badge renders in both glass and pixel variants
  - [ ] PixelDivider renders 8px repeating block pattern
  - [ ] `cn()` utility correctly merges Tailwind classes
  - [ ] No purple/violet colors in any component (grep check)

  **QA Scenarios**:
  ```
  Scenario: Button variants render
    Tool: Bash
    Steps: npm run test:unit -- src/components/ui/
    Expected: All tests pass
    Evidence: .sisyphus/evidence/task-2-components.txt

  Scenario: No purple in components
    Tool: Bash
    Steps: grep -ri "purple\|violet\|#7c3aed\|#8b5cf6" src/components/ui/ --include="*.tsx"
    Expected: No matches
    Evidence: .sisyphus/evidence/task-2-no-purple.txt
  ```

  **Commit**: YES | Message: `feat: add base UI components (Button, Card, Badge, PixelDivider)` | Files: src/components/ui/*, src/lib/cn.ts

---

- [x] 3. Create ParticleBackground component with mixed particle system

  **What to do**:
  1. Create `src/components/ui/ParticleBackground.tsx` — Canvas-based particle system
  2. Particle types: 80% circles (2-4px, teal, smooth float), 20% squares (4-6px, teal, `steps()` motion)
  3. Circle particles: smooth `ease-in-out` float upward + gentle horizontal drift
  4. Square (pixel) particles: stepped motion using frame counter (every 3rd frame move), slight rotation
  5. Mouse interaction: particles within 100px radius gently pushed away (repulsion)
  6. Performance: use `requestAnimationFrame`, object pool (pre-allocate array), respect `prefers-reduced-motion`
  7. Responsive: particle count = `Math.floor(window.innerWidth * window.innerHeight / 15000)`, min 20, max 80
  8. Component unmounts cleanly (cancelAnimationFrame)

  **Must NOT do**:
  - Do NOT use Three.js or any 3D library
  - Do NOT make particles interactive beyond mouse repulsion
  - Do NOT couple particle system to any game state
  - Do NOT use purple particle colors

  **Recommended Agent Profile**:
  - Category: `unspecified-high` — Reason: Canvas performance optimization
  - Skills: [] — Standard Canvas API
  - Omitted: [] — No specialized skills needed

  **Parallelization**: Can Parallel: YES (with Task 2) | Wave 1 | Blocks: Wave 4 | Blocked By: Task 1

  **References**:
  - src/styles/globals.css — Color values for particles (teal-accent: #2dd4bf)
  - other/moon-throw.html:84-88 — Existing float animation pattern

  **Acceptance Criteria**:
  - [ ] Canvas renders on mount
  - [ ] Mix of circle and square particles visible
  - [ ] Square particles have stepped/jerky motion
  - [ ] Mouse repulsion works (particles move away from cursor)
  - [ ] `prefers-reduced-motion: reduce` → particles hidden or static
  - [ ] No memory leaks (cancelAnimationFrame on unmount)
  - [ ] Particle count adapts to screen size

  **QA Scenarios**:
  ```
  Scenario: Particles render and animate
    Tool: Bash
    Steps: Add ParticleBackground to a test page, run build, grep dist/index.html for canvas-related markup
    Expected: Built output contains canvas element reference
    Evidence: .sisyphus/evidence/task-3-particles.txt

  Scenario: Reduced motion respected
    Tool: Bash
    Steps: grep src/components/ui/ParticleBackground.tsx for "prefers-reduced-motion" or "reducedMotion"
    Expected: Code checks for reduced motion preference
    Evidence: .sisyphus/evidence/task-3-reduced-motion.txt
  ```

  **Commit**: YES | Message: `feat: add ParticleBackground with mixed circle/pixel particles` | Files: src/components/ui/ParticleBackground.tsx

---

### Wave 2: Game Engine (Characterization + Implementation)

- [x] 4. Extract game data models and constants into TypeScript

  **What to do**:
  1. Create `src/game/data/diseases.ts` — Port all 6 diseases from `other/moon-throw.html:365-372` with full TypeScript types: `{ id, name, riskType, desc, transmission }`
  2. Create `src/game/data/tags.ts` — Port all 60+ tags from `other/moon-throw.html:389-457` with types: `{ text, colorClass, risk?, constraint?, clue?, hiddenChance?, safeChance?, safetyBonus? }`. **IMPORTANT**: Map all `bg-purple-*` and `bg-violet-*` colors to new system: `bg-purple-700/800` → `bg-amber-700/800`, `bg-violet-*` → `bg-coral-700/800`. Keep red/amber/emerald/sky/slate as-is.
  3. Create `src/game/data/config.ts` — Port CONFIG from `other/moon-throw.html:327-348`
  4. Create `src/game/data/flirtLines.ts` — Port FLIRT_LINES array
  5. Create `src/game/data/avatars.ts` — Port AVATARS array
  6. Create `src/game/types.ts` — All shared types: `GameState`, `Partner`, `Tag`, `Disease`, `ActionType`, `TurnRecord`, `Constraint`

  **Must NOT do**:
  - Do NOT change any game logic values (probabilities, costs, thresholds)
  - Do NOT remove any tags or diseases
  - Do NOT simplify the tag schema — preserve ALL fields
  - Do NOT use purple in color mappings

  **Recommended Agent Profile**:
  - Category: `deep` — Reason: Must preserve exact behavior from complex source
  - Skills: [] — Data extraction task
  - Omitted: [] — No specialized skills needed

  **Parallelization**: Can Parallel: NO | Wave 2 | Blocks: Tasks 5, 6 | Blocked By: Task 1

  **References**:
  - other/moon-throw.html:327-348 — CONFIG object (exact values)
  - other/moon-throw.html:350-361 — STATE shape
  - other/moon-throw.html:363 — AVATARS array
  - other/moon-throw.html:365-372 — DISEASES definitions
  - other/moon-throw.html:374-387 — FLIRT_LINES
  - other/moon-throw.html:389-457 — ALL_TAGS array (60+ entries, each with multiple fields)

  **Acceptance Criteria**:
  - [ ] All 6 diseases ported with exact same riskType/desc values
  - [ ] All 60+ tags ported with exact same risk/constraint/hiddenChance values
  - [ ] Color mapping: zero instances of `purple` or `violet` in tag colors
  - [ ] TypeScript types compile without errors
  - [ ] Tag count matches source (count tags in source and target)

  **QA Scenarios**:
  ```
  Scenario: Disease count matches
    Tool: Bash
    Steps: Count exported diseases vs source DISEASES object keys
    Expected: Both have exactly 6 entries with same keys (HIV, SYPHILIS, HERPES, HPV, GONORRHEA, CRABS)
    Evidence: .sisyphus/evidence/task-4-diseases.txt

  Scenario: Tag count matches
    Tool: Bash
    Steps: Count exported tags vs source ALL_TAGS array length
    Expected: Both have same count (should be 60+)
    Evidence: .sisyphus/evidence/task-4-tags.txt

  Scenario: No purple in color mappings
    Tool: Bash
    Steps: grep -ri "purple\|violet" src/game/data/tags.ts
    Expected: No matches
    Evidence: .sisyphus/evidence/task-4-no-purple.txt
  ```

  **Commit**: YES | Message: `feat(game): extract game data models, diseases, tags, and types from moon-throw.html` | Files: src/game/data/*, src/game/types.ts

---

- [ ] 5. Create deterministic RNG interface and write characterization tests

  **What to do**:
  1. Create `src/game/engine/rng.ts` — Export `createRng(seed: number): () => number` (simple mulberry32 or similar). Also export `createRngFromMath(): () => number` for production use wrapping `Math.random()`
  2. Create `src/game/engine/__tests__/` directory
  3. Write characterization tests that lock down ALL behaviors from Behavior Inventory:
     - `partner-generation.test.ts`: Given seeded RNG, assert partner has correct tag count (3-4), at least one revealed tag, constraint compatibility (no oral_only + no_oral), disease assignment follows probability rules
     - `constraint-system.test.ts`: Assert no_condom blocks condom actions, oral_only blocks sex actions, incompatible constraints never coexist
     - `action-effects.test.ts`: Assert each action type returns correct frustration reward and anxiety cost from CONFIG
     - `delayed-diagnosis.test.ts`: Assert infection is NOT revealed after risky action, IS revealed at hospital, IS revealed at game over
     - `hidden-tag-invariant.test.ts`: Assert every generated partner has ≥1 revealed tag
     - `panic-mode.test.ts`: Assert panic mode activates at anxiety≥80, deactivates below
     - `game-over-conditions.test.ts`: Assert game ends at frustration≥100 and anxiety≥100
  4. These tests should FAIL initially (red phase) — they test against the engine that doesn't exist yet

  **Must NOT do**:
  - Do NOT implement game engine logic yet — only tests
  - Do NOT use `Math.random()` directly in tests — always inject seeded RNG
  - Do NOT test UI rendering — only pure logic

  **Recommended Agent Profile**:
  - Category: `deep` — Reason: Characterization testing requires deep understanding of game mechanics
  - Skills: [] — Standard Vitest
  - Omitted: [] — No specialized skills needed

  **Parallelization**: Can Parallel: NO | Wave 2 | Blocks: Task 6 | Blocked By: Task 4

  **References**:
  - src/game/types.ts — Type definitions for test assertions
  - src/game/data/tags.ts — Tag data for partner generation tests
  - src/game/data/config.ts — CONFIG values for action effect tests
  - other/moon-throw.html:505-555 — Partner generation logic (to understand what to test)
  - other/moon-throw.html:642-658 — Constraint logic (to understand what to test)
  - other/moon-throw.html:674-692 — Game over conditions

  **Acceptance Criteria**:
  - [ ] `createRng` produces deterministic sequences (same seed → same sequence)
  - [ ] All 7 test files exist and compile (they may fail)
  - [ ] Tests use seeded RNG, never Math.random()
  - [ ] Tests reference exact CONFIG values from source

  **QA Scenarios**:
  ```
  Scenario: RNG is deterministic
    Tool: Bash
    Steps: Call createRng(42) twice, compare first 10 values
    Expected: Identical sequences
    Evidence: .sisyphus/evidence/task-5-rng.txt

  Scenario: Tests exist and compile
    Tool: Bash
    Steps: npm run test:unit -- src/game/engine/__tests__/ --run
    Expected: Tests compile and run (may fail with import errors since engine doesn't exist)
    Evidence: .sisyphus/evidence/task-5-tests.txt
  ```

  **Commit**: YES | Message: `test(game): add RNG interface and characterization tests for game engine` | Files: src/game/engine/rng.ts, src/game/engine/__tests__/*

---

- [ ] 6. Implement pure TypeScript game engine

  **What to do**:
  1. Create `src/game/engine/state.ts` — `createInitialState(): GameState` returns fresh state
  2. Create `src/game/engine/partner.ts` — `generatePartner(rng): Partner` — Port logic from `other/moon-throw.html:505-555`. Must accept injected RNG. Must enforce: 3-4 tags, at least 1 revealed, constraint compatibility, disease probability
  3. Create `src/game/engine/actions.ts` — `executeAction(state, actionType, rng): GameState` — Port logic from `other/moon-throw.html:802+`. Returns new state with updated frustration, anxiety, turn, infection status. Does NOT mutate input state (immutable)
  4. Create `src/game/engine/hospital.ts` — `goToHospital(state): GameState` — Clears anxiety, reveals infection
  5. Create `src/game/engine/items.ts` — `useTestkit(partner): { message, icon, isPositive }` — Reveals all tags, checks diseases
  6. Create `src/game/engine/chat.ts` — `chat(partner, rng): Partner` — Reveals one hidden tag
  7. Create `src/game/engine/game-over.ts` — `checkGameOver(state): { isOver, reason } | null`
  8. Create `src/game/engine/index.ts` — Re-export all engine functions

  **Must NOT do**:
  - Do NOT import React or any UI library
  - Do NOT put probability math in components
  - Do NOT mutate state — always return new state objects
  - Do NOT change game balance (probabilities, costs, thresholds)
  - Do NOT add new mechanics

  **Recommended Agent Profile**:
  - Category: `deep` — Reason: Complex logic port with strict behavioral parity
  - Skills: [] — Pure TypeScript
  - Omitted: [] — No specialized skills needed

  **Parallelization**: Can Parallel: NO | Wave 2 | Blocks: Wave 3 | Blocked By: Tasks 4, 5

  **References**:
  - other/moon-throw.html:505-555 — generateNewPartner() full logic
  - other/moon-throw.html:674-692 — advanceTime() logic
  - other/moon-throw.html:760-779 — useItem('testkit') logic
  - other/moon-throw.html:781-793 — goToHospital() logic
  - other/moon-throw.html:802-855 — takeAction() full logic
  - src/game/engine/__tests__/* — Characterization tests that must pass

  **Acceptance Criteria**:
  - [ ] All characterization tests from Task 5 now PASS (green)
  - [ ] `npm run test:unit` — all game engine tests green
  - [ ] Engine has zero React imports
  - [ ] All engine functions are pure (no side effects, no mutation)
  - [ ] `generatePartner` with same seed produces same partner

  **QA Scenarios**:
  ```
  Scenario: All characterization tests pass
    Tool: Bash
    Steps: npm run test:unit -- src/game/engine/ --run
    Expected: All tests pass, 0 failures
    Evidence: .sisyphus/evidence/task-6-engine-tests.txt

  Scenario: No React in engine
    Tool: Bash
    Steps: grep -r "from 'react'\|from \"react\"" src/game/engine/ --include="*.ts"
    Expected: No matches
    Evidence: .sisyphus/evidence/task-6-no-react.txt
  ```

  **Commit**: YES | Message: `feat(game): implement pure TypeScript game engine with all mechanics` | Files: src/game/engine/*.ts

---

- [ ] 7. Add Playwright E2E test setup and game flow tests

  **What to do**:
  1. Create `playwright.config.ts` — base URL `http://localhost:4173`, webServer command `npm run preview`
  2. Create `e2e/game-flow.spec.ts` — Test scenarios:
     - Game page loads with correct initial state (frustration 50, anxiety 0, round 01)
     - Clicking action buttons updates meters
     - Partner card shows tags and avatar
     - Hospital visit reveals/clears status
     - Game over screen appears at threshold
  3. Create `e2e/portal.spec.ts` — Test scenarios:
     - Portal homepage loads at `/#/`
     - Project grid is visible
     - Navigation to `/#/moon-throw` works
     - Navigation back to `/#/` works
  4. These tests may initially FAIL since game UI doesn't exist yet — that's OK, they serve as acceptance criteria

  **Must NOT do**:
  - Do NOT implement UI to make tests pass — tests define what UI must do
  - Do NOT use vague selectors — use specific text content or data-testid attributes

  **Recommended Agent Profile**:
  - Category: `unspecified-high` — Reason: E2E test setup
  - Skills: [] — Standard Playwright
  - Omitted: [] — No specialized skills needed

  **Parallelization**: Can Parallel: YES (with Task 6) | Wave 2 | Blocks: Wave 5 | Blocked By: Task 1

  **References**:
  - src/game/engine/index.ts — Engine API for understanding what UI must trigger
  - src/game/data/config.ts — Expected initial values (frustration: 50, anxiety: 0)

  **Acceptance Criteria**:
  - [ ] `npx playwright test` runs (tests may fail)
  - [ ] Game flow test references specific text selectors
  - [ ] Portal test verifies route navigation

  **QA Scenarios**:
  ```
  Scenario: Playwright config valid
    Tool: Bash
    Steps: npx playwright test --list
    Expected: Lists test files without config errors
    Evidence: .sisyphus/evidence/task-7-playwright.txt
  ```

  **Commit**: YES | Message: `test(e2e): add Playwright setup with game flow and portal route tests` | Files: playwright.config.ts, e2e/*

---

### Wave 3: UI Implementation (Game UI ∥ Portal UI)

- [ ] 8. Build Moon-Throw game UI components

  **What to do**:
  1. Create `src/components/moon-throw/GameHeader.tsx` — Title "月抛模拟器" (font-pixel), round counter, styled header bar
  2. Create `src/components/moon-throw/StatsPanel.tsx` — Frustration bar (gradient teal→coral, animated width), Anxiety bar (gradient ink-blue→coral, animated width), panic warning text (visible at anxiety≥80), item counter (testkit x1)
  3. Create `src/components/moon-throw/PartnerCard.tsx` — Avatar (emoji, float animation), name, flirt quote, tag cloud (Badge component), revealed/hidden tag styling
  4. Create `src/components/moon-throw/ActionButtons.tsx` — Chat button, 4 action buttons (oral/sex × condom/raw), hospital button, refuse button, disabled overlay for constrained buttons
  5. Create `src/components/moon-throw/FeedbackModal.tsx` — Result display (icon, title, message), disease report section, history toggle, next/restart buttons
  6. Create `src/components/moon-throw/HelpModal.tsx` — Game rules, scrollable content, close button
   7. Create `src/components/moon-throw/IntroModal.tsx` — Start screen with game title, rules summary, start button, help button
   8. Create `src/components/moon-throw/GameContainer.tsx` — Top-level game wrapper that composes all sub-components (GameHeader, StatsPanel, PartnerCard, ActionButtons, FeedbackModal, HelpModal, IntroModal). Uses `useGameState` hook. This is the single component imported by the MoonThrow page.
   9. Create `src/hooks/useGameState.ts` — React hook wrapping game engine: manages state with `useReducer`, provides `startGame`, `takeAction`, `nextPartner`, `goToHospital`, `useTestkit`, `chat` actions. Uses `createRngFromMath()` for production. Resets on mount (auto-reset per user decision D3).
   10. Add Framer Motion animations: tag popIn (staggered), meter width transitions (spring), modal enter/exit (fade+scale), partner card switch (AnimatePresence slide), panic mode shake

  **Must NOT do**:
  - Do NOT put game logic (probabilities, disease checks) in components — use engine
  - Do NOT use purple/violet colors
  - Do NOT add new game features
  - Do NOT implement localStorage save/load

  **Recommended Agent Profile**:
  - Category: `visual-engineering` — Reason: Complex UI with animations
  - Skills: [] — Standard React + Framer Motion
  - Omitted: [] — No specialized skills needed

  **Parallelization**: Can Parallel: YES (with Tasks 9-11) | Wave 3 | Blocks: Wave 4 | Blocked By: Tasks 2, 6

  **References**:
  - src/game/engine/index.ts — Engine API (all actions)
  - src/game/types.ts — Type definitions
  - src/components/ui/* — Base UI components (Button, Card, Badge)
  - other/moon-throw.html:99-204 — Game container layout structure
  - other/moon-throw.html:207-270 — Intro modal and help modal content
  - other/moon-throw.html:272-323 — Feedback overlay structure
  - other/moon-throw.html:557-582 — Stats/meter UI logic

  **Acceptance Criteria**:
  - [ ] All 7 components render without errors
  - [ ] `useGameState` hook correctly wraps engine functions
  - [ ] Stats bars animate on value change
  - [ ] Modal enter/exit animations work
  - [ ] Tag badges stagger in on partner change
  - [ ] Disabled buttons show crossed-out overlay when constrained
  - [ ] Panic mode applies shake/blur at anxiety≥80
  - [ ] No purple/violet in game UI

  **QA Scenarios**:
  ```
  Scenario: Game renders with initial state
    Tool: Bash
    Steps: npm run build, grep dist/index.html for "月抛模拟器" or verify game route exists in bundle
    Expected: Game page bundle includes initial state values
    Evidence: .sisyphus/evidence/task-8-game-initial.txt

  Scenario: Action buttons exist in bundle
    Tool: Bash
    Steps: grep src/components/moon-throw/ActionButtons.tsx for all 4 action button labels ("戴套口交", "戴套性交", "无套口交", "无套性交")
    Expected: All 4 action labels present
    Evidence: .sisyphus/evidence/task-8-action-buttons.txt
  ```

  **Commit**: YES | Message: `feat(game): build Moon-Throw game UI with Framer Motion animations` | Files: src/components/moon-throw/*, src/hooks/useGameState.ts

---

- [ ] 9. Build Portal Hero section

  **What to do**:
  1. Create `src/components/portal/Hero.tsx`
  2. Logo: "OWLTREE" in `font-pixel` (Press Start 2P), `text-teal-accent`, with CSS `text-shadow` glow effect
  3. Subtitle: "Digital Shrine // Code & Create" in regular sans font, `text-slate-400`
  4. Pixel divider below logo
  5. Framer Motion entrance: Logo chars stagger in (each letter 100ms delay, using `steps(4)` easing for pixel feel), subtitle fades in smoothly after logo
  6. Optional: small pixel art owl emoji 🦉 as decorative element

  **Must NOT do**:
  - Do NOT make the entire hero pixel-styled — only the logo text
  - Do NOT add complex animations beyond entrance

  **Recommended Agent Profile**:
  - Category: `visual-engineering` — Reason: Animated entrance with mixed easing
  - Skills: [] — Standard React + Framer Motion
  - Omitted: [] — No specialized skills needed

  **Parallelization**: Can Parallel: YES (with Tasks 8, 10, 11) | Wave 3 | Blocks: Task 12 | Blocked By: Tasks 1, 2

  **References**:
  - src/components/ui/PixelDivider.tsx — Divider component
  - src/styles/globals.css — pixel-text class definition

  **Acceptance Criteria**:
  - [ ] "OWLTREE" renders in pixel font with teal glow
  - [ ] Subtitle renders in regular font
  - [ ] Entrance animation plays on page load
  - [ ] Pixel divider visible below logo

  **QA Scenarios**:
  ```
  Scenario: Hero renders with pixel logo
    Tool: Bash
    Steps: grep src/components/portal/Hero.tsx for "OWLTREE" and "font-pixel"
    Expected: Both present in component source
    Evidence: .sisyphus/evidence/task-9-hero.txt
  ```

  **Commit**: YES | Message: `feat(portal): build Hero section with pixel font logo and entrance animation` | Files: src/components/portal/Hero.tsx

---

- [ ] 10. Build Portal ProfileCard and ProjectGrid

  **What to do**:
  1. Create `src/components/portal/ProfileCard.tsx`:
     - Glass card container
     - Avatar placeholder: 120px circle with teal border + placeholder icon
     - Name: "Your Name" placeholder
     - Signature: Rotating quotes every 5s (Framer Motion AnimatePresence crossfade): ["在代码与灵感之间游走", "Digital Alchemist", "Building things that matter"]
     - Skills: Placeholder tags in pixel-badge style: ["React", "TypeScript", "Design", "..."]
     - Status indicator: small green dot (online)
  2. Create `src/components/portal/ProjectGrid.tsx`:
     - Section title: "PROJECTS" in pixel font
     - Grid layout: 1 col mobile, 2 cols tablet, 3 cols desktop
     - Each card: glass-card variant, icon (emoji), title, description, tags (Badge), "进入 →" link button
     - Featured card: glow-border variant
     - Hover: card lifts 8px + teal glow shadow (Framer Motion whileHover)
  3. Create `src/data/projects.ts`:
     ```typescript
     export const projects = [
       { id: 'moon-throw', name: '月抛模拟器', description: '关于选择与后果的实验性互动叙事', url: '/moon-throw', tags: ['游戏', '教育'], icon: '🌙', featured: true },
       { id: 'placeholder-2', name: 'Coming Soon', description: '更多项目正在路上...', url: '#', tags: ['待定'], icon: '⚡', featured: false },
     ]
     ```

  **Must NOT do**:
  - Do NOT add real personal info — all placeholder
  - Do NOT hardcode social links — leave placeholder

  **Recommended Agent Profile**:
  - Category: `visual-engineering` — Reason: Card layout and hover effects
  - Skills: [] — Standard React + Framer Motion
  - Omitted: [] — No specialized skills needed

  **Parallelization**: Can Parallel: YES (with Tasks 8, 9, 11) | Wave 3 | Blocks: Task 12 | Blocked By: Tasks 1, 2

  **References**:
  - src/components/ui/Card.tsx — Card component variants
  - src/components/ui/Badge.tsx — Badge component
  - src/styles/globals.css — glass-card, pixel-badge classes

  **Acceptance Criteria**:
  - [ ] ProfileCard renders with all placeholder content
  - [ ] Signature rotates every 5s
  - [ ] ProjectGrid shows 2 cards in grid
  - [ ] Moon-throw card links to `/#/moon-throw`
  - [ ] Featured card has glow border
  - [ ] Hover lift effect on cards

  **QA Scenarios**:
  ```
  Scenario: Profile card with rotating signature
    Tool: Bash
    Steps: grep src/components/portal/ProfileCard.tsx for signature array and rotation/setInterval logic
    Expected: Component contains multiple signature strings and timer logic
    Evidence: .sisyphus/evidence/task-10-profile.txt

  Scenario: Project card links to moon-throw
    Tool: Bash
    Steps: grep src/data/projects.ts for "/moon-throw"
    Expected: Moon-throw project URL points to correct route
    Evidence: .sisyphus/evidence/task-10-nav.txt
  ```

  **Commit**: YES | Message: `feat(portal): build ProfileCard and ProjectGrid with placeholder data` | Files: src/components/portal/ProfileCard.tsx, src/components/portal/ProjectGrid.tsx, src/data/projects.ts

---

- [ ] 11. Build Portal Footer and assemble Home page

  **What to do**:
  1. Create `src/components/layout/Footer.tsx`:
     - Pixel divider at top
     - Social links row: GitHub, Twitter/X, Email icons (Lucide React) — all `href="#"` placeholder
     - Copyright: "© 2026 Owltree. Built with caffeine and code."
     - Subtle text: `text-slate-500`, `text-xs`
  2. Create `src/pages/Home.tsx` — Assemble portal:
     ```tsx
     <div className="min-h-screen relative overflow-hidden">
       <ParticleBackground />
       <main className="relative z-10 flex flex-col items-center px-4 py-12">
         <Hero />
         <PixelDivider />
         <ProfileCard />
         <PixelDivider />
         <ProjectGrid />
       </main>
       <Footer />
     </div>
     ```
  3. Create `src/pages/MoonThrow.tsx` — Assemble game page:
     ```tsx
     <div className="min-h-screen bg-deep-sea flex items-center justify-center p-4">
       <GameContainer />
     </div>
     ```
  4. Update `src/App.tsx` — HashRouter with routes:
     ```tsx
     <HashRouter>
       <Routes>
         <Route path="/" element={<Home />} />
         <Route path="/moon-throw" element={<MoonThrow />} />
       </Routes>
     </HashRouter>
     ```

  **Must NOT do**:
  - Do NOT add BrowserRouter — user chose HashRouter
  - Do NOT add basename — HashRouter handles path internally

  **Recommended Agent Profile**:
  - Category: `quick` — Reason: Assembly task
  - Skills: [] — Standard React
  - Omitted: [] — No specialized skills needed

  **Parallelization**: Can Parallel: NO (depends on Task 8 for GameContainer) | Wave 3 | Blocks: Wave 4 | Blocked By: Tasks 1, 3, 8

  **References**:
  - src/components/portal/Hero.tsx — Hero component
  - src/components/portal/ProfileCard.tsx — Profile component
  - src/components/portal/ProjectGrid.tsx — Grid component
  - src/components/ui/ParticleBackground.tsx — Background component
  - src/components/layout/Footer.tsx — Footer component

  **Acceptance Criteria**:
  - [ ] `/#/` renders full portal page
  - [ ] `/#/moon-throw` renders game page
  - [ ] Route navigation works both directions
  - [ ] ParticleBackground renders on portal page
  - [ ] Footer visible with placeholder links

  **QA Scenarios**:
  ```
  Scenario: Full portal page renders
    Tool: Bash
    Steps: npm run build, grep dist/assets/*.js for "OWLTREE" and "PROJECTS" strings
    Expected: Both strings present in production bundle
    Evidence: .sisyphus/evidence/task-11-portal.txt

  Scenario: Route configuration exists
    Tool: Bash
    Steps: grep src/App.tsx for "HashRouter" and "Route.*moon-throw"
    Expected: Both route definitions present
    Evidence: .sisyphus/evidence/task-11-routing.txt
  ```

  **Commit**: YES | Message: `feat(portal): assemble Home page and MoonThrow page with HashRouter` | Files: src/pages/Home.tsx, src/pages/MoonThrow.tsx, src/components/layout/Footer.tsx, src/App.tsx

---

### Wave 4: Integration & Polish

- [ ] 12. Add i18n auto-detection and responsive polish

  **What to do**:
  1. Create `src/lib/i18n.ts` — Simple language detection:
     ```typescript
     export function getLocale(): 'zh' | 'en' {
       const lang = navigator.language.toLowerCase()
       return lang.startsWith('zh') ? 'zh' : 'en'
     }
     ```
  2. Create `src/data/i18n.ts` — Translation map for portal text:
     ```typescript
     const translations = {
       zh: { projects: '项目', comingSoon: '更多项目正在路上...', copyright: '© 2026 Owltree。咖啡与代码构建。', enter: '进入 →' },
       en: { projects: 'PROJECTS', comingSoon: 'More projects coming soon...', copyright: '© 2026 Owltree. Built with caffeine and code.', enter: 'Enter →' },
     }
     ```
  3. Apply translations to Hero, ProfileCard, ProjectGrid, Footer (use `getLocale()` on mount, store in state)
  4. Responsive polish:
     - Hero: text scales down on mobile (`text-3xl md:text-5xl`)
     - ProfileCard: stack layout on mobile
     - ProjectGrid: 1 col → 2 col → 3 col breakpoints
     - Game container: full width on mobile with `max-w-md mx-auto`
     - Footer: stack social links on mobile
  5. Add `prefers-reduced-motion` media query in globals.css: disable all animations, reduce transitions to 0ms

  **Must NOT do**:
  - Do NOT install i18next or any i18n framework
  - Do NOT add language switcher UI (auto-detect only per user request)
  - Do NOT translate the game (moon-throw stays Chinese-only)

  **Recommended Agent Profile**:
  - Category: `unspecified-high` — Reason: Cross-cutting i18n + responsive work
  - Skills: [] — Standard React
  - Omitted: [] — No specialized skills needed

  **Parallelization**: Can Parallel: NO | Wave 4 | Blocks: Wave 5 | Blocked By: Wave 3

  **References**:
  - src/pages/Home.tsx — Portal page components to apply i18n
  - src/styles/globals.css — Animation keyframes to disable

  **Acceptance Criteria**:
  - [ ] Chinese browser sees Chinese text
  - [ ] English browser sees English text
  - [ ] Game page always shows Chinese (not translated)
  - [ ] Responsive: 3-column grid on desktop, 1-column on mobile
  - [ ] `prefers-reduced-motion: reduce` → animations disabled

  **QA Scenarios**:
  ```
  Scenario: Chinese locale detected
    Tool: Bash
    Steps: grep src/lib/i18n.ts for "navigator.language" and "startsWith.*zh"
    Expected: Language detection logic present
    Evidence: .sisyphus/evidence/task-12-i18n-zh.txt

  Scenario: Responsive grid classes
    Tool: Bash
    Steps: grep src/components/portal/ProjectGrid.tsx for responsive breakpoint classes (grid-cols-1, md:grid-cols-2, lg:grid-cols-3)
    Expected: Responsive grid classes present
    Evidence: .sisyphus/evidence/task-12-responsive.txt
  ```

  **Commit**: YES | Message: `feat: add i18n auto-detection and responsive layout polish` | Files: src/lib/i18n.ts, src/data/i18n.ts, src/pages/Home.tsx (updated), src/styles/globals.css (updated)

---

- [ ] 13. Final purple audit and visual consistency check

  **What to do**:
  1. Grep entire `src/` for purple/violet color references: `grep -ri "purple\|violet\|#7c3aed\|#8b5cf6\|#a78bfa" src/ --include="*.tsx" --include="*.ts" --include="*.css"`
  2. If any found, remap to appropriate new colors (amber/coral/teal)
  3. Visual consistency audit:
     - All cards use glass-card or pixel-card variants (no inconsistent borders)
     - All interactive elements have hover states
     - All text uses defined color tokens (no hardcoded colors outside config)
     - Pixel elements (font, borders, dividers) are consistent in style
     - Glass elements (backdrop-blur, borders) are consistent in intensity
  4. Ensure `other/moon-throw.html` is NOT modified (original preserved)

  **Must NOT do**:
  - Do NOT change game logic values
  - Do NOT delete other/moon-throw.html
  - Do NOT add new visual effects

  **Recommended Agent Profile**:
  - Category: `quick` — Reason: Audit and grep task
  - Skills: [] — Standard search
  - Omitted: [] — No specialized skills needed

  **Parallelization**: Can Parallel: YES (with Task 14) | Wave 4 | Blocks: Wave 5 | Blocked By: Wave 3

  **References**:
  - src/styles/globals.css — Color definitions
  - tailwind.config.js — Custom color tokens

  **Acceptance Criteria**:
  - [ ] Zero purple/violet references in src/
  - [ ] other/moon-throw.html unchanged from original

  **QA Scenarios**:
  ```
  Scenario: No purple in codebase
    Tool: Bash
    Steps: grep -ri "purple\|violet" src/ --include="*.tsx" --include="*.ts" --include="*.css"
    Expected: Zero matches
    Evidence: .sisyphus/evidence/task-13-no-purple.txt

  Scenario: Original file preserved
    Tool: Bash
    Steps: git diff other/moon-throw.html
    Expected: No changes (empty diff)
    Evidence: .sisyphus/evidence/task-13-original.txt
  ```

  **Commit**: YES (if changes needed) | Message: `fix: remap remaining purple references to new color system` | Files: (varies)

---

- [ ] 14. Run full E2E test suite and fix failures

  **What to do**:
  1. Run `npm run test:unit` — all unit tests must pass
  2. Run `npm run test:e2e` — all E2E tests must pass
  3. For any failing E2E test:
     - If selector issue: add `data-testid` attributes to components
     - If timing issue: add appropriate waits
     - If logic issue: fix engine or component
  4. Run `npm run build` — must succeed with 0 errors
  5. Run `npm run preview` and manually verify both routes load

  **Must NOT do**:
  - Do NOT skip failing tests — fix them
  - Do NOT weaken test assertions

  **Recommended Agent Profile**:
  - Category: `deep` — Reason: Debugging test failures requires systematic approach
  - Skills: [] — Standard Vitest + Playwright
  - Omitted: [] — No specialized skills needed

  **Parallelization**: Can Parallel: YES (with Task 13) | Wave 4 | Blocks: Wave 5 | Blocked By: Wave 3

  **References**:
  - e2e/game-flow.spec.ts — Game E2E tests
  - e2e/portal.spec.ts — Portal E2E tests
  - src/game/engine/__tests__/* — Unit tests

  **Acceptance Criteria**:
  - [ ] `npm run test:unit` — 0 failures
  - [ ] `npm run test:e2e` — 0 failures
  - [ ] `npm run build` — exit 0

  **QA Scenarios**:
  ```
  Scenario: All tests green
    Tool: Bash
    Steps: npm run test:unit --run && npm run test:e2e
    Expected: All pass
    Evidence: .sisyphus/evidence/task-14-all-tests.txt
  ```

  **Commit**: YES (if fixes needed) | Message: `test: fix E2E failures and add missing data-testid attributes` | Files: (varies)

---

### Wave 5: Deployment

- [ ] 15. Configure GitHub Pages deployment with GitHub Actions

  **What to do**:
  1. Verify `vite.config.ts` has `base: '/owltree/'`
  2. Create `.github/workflows/deploy.yml`:
     ```yaml
     name: Deploy to GitHub Pages
     on:
       push:
         branches: [main]
     permissions:
       contents: read
       pages: write
       id-token: write
     concurrency:
       group: "pages"
       cancel-in-progress: false
     jobs:
       deploy:
         environment:
           name: github-pages
           url: ${{ steps.deployment.outputs.page_url }}
         runs-on: ubuntu-latest
         steps:
           - uses: actions/checkout@v4
           - uses: actions/setup-node@v4
             with:
               node-version: 20
           - run: npm ci
           - run: npm run build
           - uses: actions/configure-pages@v4
           - uses: actions/upload-pages-artifact@v3
             with:
               path: './dist'
           - uses: actions/deploy-pages@v4
             id: deployment
     ```
  3. Add `.gitignore` entries: `dist/`, `node_modules/`, `.playwright/`, `test-results/`
  4. Verify build output: `npm run build` → `dist/` contains `index.html`, assets, etc.
  5. Verify all asset paths in built HTML reference `/owltree/` base

  **Must NOT do**:
  - Do NOT commit dist/ to git
  - Do NOT use `gh-pages` package (GitHub Actions native is cleaner)
  - Do NOT hardcode absolute URLs

  **Recommended Agent Profile**:
  - Category: `quick` — Reason: Config file creation
  - Skills: [] — Standard GitHub Actions
  - Omitted: [] — No specialized skills needed

  **Parallelization**: Can Parallel: NO | Wave 5 | Blocks: Task 16 | Blocked By: Wave 4

  **References**:
  - vite.config.ts — base path configuration
  - package.json — build script

  **Acceptance Criteria**:
  - [ ] `.github/workflows/deploy.yml` exists with correct config
  - [ ] `.gitignore` includes dist/ and node_modules/
  - [ ] `npm run build` produces dist/ with correct base paths
  - [ ] Built index.html references `/owltree/assets/...` paths

  **QA Scenarios**:
  ```
  Scenario: Build output has correct base path
    Tool: Bash
    Steps: npm run build, grep 'href="/owltree/' dist/index.html
    Expected: Asset paths contain /owltree/ prefix
    Evidence: .sisyphus/evidence/task-15-base-path.txt

  Scenario: Gitignore correct
    Tool: Bash
    Steps: grep "dist/" .gitignore && grep "node_modules/" .gitignore
    Expected: Both patterns present
    Evidence: .sisyphus/evidence/task-15-gitignore.txt
  ```

  **Commit**: YES | Message: `ci: add GitHub Pages deployment workflow` | Files: .github/workflows/deploy.yml, .gitignore

---

- [ ] 16. Final build verification and cleanup

  **What to do**:
  1. Full clean build: `rm -rf node_modules dist && npm ci && npm run build`
  2. Verify dist/ structure: `ls -la dist/` shows index.html + assets/
  3. Serve preview: `npm run preview` — open both routes in browser
  4. Run full test suite one final time: `npm run test:unit && npm run test:e2e`
  5. Verify no TypeScript errors: `npx tsc --noEmit`
  6. Verify original moon-throw.html still exists: `ls other/moon-throw.html`
  7. Clean up any temporary files, console.logs, TODO comments

  **Must NOT do**:
  - Do NOT push to remote (user decides when to push)
  - Do NOT delete other/ directory
  - Do NOT modify .git history

  **Recommended Agent Profile**:
  - Category: `quick` — Reason: Final verification
  - Skills: [] — Standard commands
  - Omitted: [] — No specialized skills needed

  **Parallelization**: Can Parallel: NO | Wave 5 | Blocks: none | Blocked By: Task 15

  **References**:
  - All previous tasks — cumulative verification

  **Acceptance Criteria**:
  - [ ] Clean build succeeds from scratch
  - [ ] All tests pass
  - [ ] TypeScript: 0 errors
  - [ ] Preview server serves both routes correctly
  - [ ] other/moon-throw.html preserved

  **QA Scenarios**:
  ```
  Scenario: Clean build from scratch
    Tool: Bash
    Steps: rm -rf node_modules dist && npm ci && npm run build && npm run test:unit
    Expected: All succeed with 0 errors
    Evidence: .sisyphus/evidence/task-16-clean-build.txt

  Scenario: TypeScript clean
    Tool: Bash
    Steps: npx tsc --noEmit
    Expected: Exit 0, no errors
    Evidence: .sisyphus/evidence/task-16-tsc.txt
  ```

  **Commit**: YES (if cleanup needed) | Message: `chore: final cleanup and verification` | Files: (varies)

---

## Final Verification Wave (MANDATORY)
> 4 review agents run in PARALLEL. ALL must APPROVE. Present consolidated results to user and get explicit "okay" before completing.
> **Do NOT auto-proceed after verification. Wait for user's explicit approval before marking work complete.**

- [ ] F1. Plan Compliance Audit — oracle
  **QA Scenario**:
  ```
  Tool: Bash
  Steps: Run grep -c "purple\|violet" src/ --include="*.tsx" --include="*.ts" --include="*.css" -r
  Expected: 0 matches
  Evidence: .sisyphus/evidence/task-F1-no-purple.txt
  ```
  ```
  Tool: Bash
  Steps: ls other/moon-throw.html && git diff --stat other/moon-throw.html
  Expected: File exists, diff is empty (original preserved)
  Evidence: .sisyphus/evidence/task-F1-original.txt
  ```
  ```
  Tool: Bash
  Steps: grep -c "GameContainer" src/components/moon-throw/GameContainer.tsx
  Expected: File exists with content
  Evidence: .sisyphus/evidence/task-F1-gamecontainer.txt
  ```

- [ ] F2. Code Quality Review — unspecified-high
  **QA Scenario**:
  ```
  Tool: Bash
  Steps: npx tsc --noEmit 2>&1 | wc -l
  Expected: 0 lines of errors
  Evidence: .sisyphus/evidence/task-F2-tsc.txt
  ```
  ```
  Tool: Bash
  Steps: npm run test:unit --run 2>&1 | tail -5
  Expected: "Tests passed" or "0 failures"
  Evidence: .sisyphus/evidence/task-F2-unit-tests.txt
  ```

- [ ] F3. Real Manual QA — unspecified-high (+ playwright)
  **QA Scenario**:
  ```
  Tool: Bash
  Steps: npm run test:e2e 2>&1 | tail -10
  Expected: All tests passed, 0 failures
  Evidence: .sisyphus/evidence/task-F3-e2e.txt
  ```
  ```
  Tool: Bash
  Steps: npm run build 2>&1 | tail -5
  Expected: Build succeeds with dist/ output
  Evidence: .sisyphus/evidence/task-F3-build.txt
  ```

- [ ] F4. Scope Fidelity Check — deep
  **QA Scenario**:
  ```
  Tool: Bash
  Steps: grep -r "localStorage\|sessionStorage" src/ --include="*.ts" --include="*.tsx"
  Expected: 0 matches (no persistence per Non-Goals)
  Evidence: .sisyphus/evidence/task-F4-no-storage.txt
  ```
  ```
  Tool: Bash
  Steps: grep -r "i18next\|react-intl\|react-i18next" package.json
  Expected: 0 matches (no i18n framework per Non-Goals)
  Evidence: .sisyphus/evidence/task-F4-no-i18n-framework.txt
  ```
  ```
  Tool: Bash
  Steps: ls src/pages/ && ls src/game/engine/
  Expected: Exactly Home.tsx, MoonThrow.tsx in pages/; engine files in game/engine/
  Evidence: .sisyphus/evidence/task-F4-structure.txt
  ```

## Commit Strategy
Follow atomic commits per task. No commit mixes scaffolding + logic + UI. Every commit after Task 5 should leave tests green.

## Success Criteria
1. `npm run build` — 0 errors
2. `npm run test:unit` — 0 failures
3. `npm run test:e2e` — 0 failures
4. `npx tsc --noEmit` — 0 errors
5. `/#/` — Portal renders with Hero, ProfileCard, ProjectGrid, Footer
6. `/#/moon-throw` — Game fully playable with all original mechanics
7. Zero purple/violet in src/
8. other/moon-throw.html preserved unchanged
9. GitHub Actions workflow ready for deployment
