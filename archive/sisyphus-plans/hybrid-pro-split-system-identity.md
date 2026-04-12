# Hybrid Pro Split — Screen 1 System Identity + Project Module

## TL;DR
> **Summary**: Refine `prototypes/layouts/hybrid-pro-split.html` without changing its core aesthetic. Screen 1 becomes a stronger premium identity panel plus a fixed-height `Active Projects` module with internal scrolling; screen 2 stays structurally intact.
> **Deliverables**: Upgraded `System Identity` card, fixed-height `Active Projects` scroll module, responsive overflow-safe screen 1, preserved screen 2 module grid
> **Effort**: Short
> **Parallel**: YES - 2 waves
> **Critical Path**: Task 1 → Task 3 → Task 4

## Context
### Original Request
用户要求基于 `@prototypes/layouts/hybrid-pro.html` 再写一版分两屏展示；随后确认 `profile-card` 可以对齐但内容一般，希望有更好的方案；同时要求 `Active Projects` 做成模块，并在项目变多时允许继续浏览。最终确认：`Profile Card = System Identity`，`Active Projects = Fixed Module + Internal Scroll`。

### Interview Summary
- 保留 `hybrid-pro` / `hybrid-pro-split` 的视觉语言：粒子、故障标题、玻璃态、霓虹点缀、两屏结构
- 本次只处理原型文件，不动 React 主实现
- 左侧不是简历卡，也不是技能堆料卡；应做成更高级的“个人系统身份面板”
- 右侧不是普通列表；应做成真正独立的大模块，默认固定高度，列表在模块内部滚动
- 第二屏保留现有结构，只允许做共享样式级别的小同步，不允许重构

### Metis Review (gaps addressed)
- 防止 scope creep：Screen 1 必须是 premium identity panel，不得膨胀成 full dashboard
- `Active Projects` 不能在实现时偷偷退化回普通竖向列表
- 明确 overflow 策略：默认采用 **fixed-height project module + internal vertical scroll + fixed header + soft overflow affordance**
- 明确边界：只改 `prototypes/layouts/hybrid-pro-split.html`，不动 `src/`、测试文件、其他原型
- 明确 edge cases：0/1/多项目、长标题、窄屏、卡片高度不齐

## Work Objectives
### Core Objective
把 `hybrid-pro-split` 的第一屏打磨成更强的个人门户首屏：左侧为有观点的 `System Identity`，右侧为可扩展的 `Active Projects` 固定模块，项目在模块内部滚动。

### Deliverables
1. `prototypes/layouts/hybrid-pro-split.html` 的第一屏完成结构升级
2. `profile-card` 改为 `System Identity` 内容体系
3. `Active Projects` 改为固定高度的内部滚动项目模块
4. 第二屏模块区保持现有布局与视觉层级

### Definition of Done (verifiable conditions with commands)
- [ ] `python3 -m http.server 4173` in repo root serves the prototype successfully
- [ ] Open `http://127.0.0.1:4173/prototypes/layouts/hybrid-pro-split.html` and screen 1 loads with no vertical overflow at desktop viewport `1440x1024`
- [ ] Screen 1 left column renders `System Identity` content blocks instead of tech-stack/social filler
- [ ] Screen 1 right column renders a fixed-height project module whose header stays visible while the project list scrolls internally
- [ ] Screen 2 still shows 6 modules in the existing asymmetric structure
- [ ] Browser console shows no runtime errors during hover, cursor, particle, project-module scrolling, and module interactions

### Must Have
- Preserve current background effects, cursor behavior, particles, glitch title, corner decorations
- Keep the two-screen scroll-snap experience
- Replace generic left-card filler with high-signal identity content
- Turn projects into a bounded fixed-height module with strong affordance for internal overflow
- Keep naming compatible with existing portal language (`Projects`, `Games`, `Notes`, `Tools`, `Trends`)

### Must NOT Have
- ❌ No edits outside `prototypes/layouts/hybrid-pro-split.html`
- ❌ No React/component integration in `src/`
- ❌ No redesign of screen 2 layout structure
- ❌ No resume-style skill dump, social-button filler, or fake dashboard metrics overload
- ❌ No fallback to a standard vertical project list on desktop
- ❌ No new dependencies, build tooling, or external libraries

## Verification Strategy
> ZERO HUMAN INTERVENTION - all verification is agent-executed.
- Test decision: none for prototype file; verification is browser-driven QA + console/runtime checks
- QA policy: Every task has agent-executed scenarios
- Evidence: `.sisyphus/evidence/task-{N}-{slug}.{ext}`
- Runtime validation server: `python3 -m http.server 4173`

## Execution Strategy
### Parallel Execution Waves
> Target: 5-8 tasks per wave. <3 per wave (except final) = under-splitting.
> Extract shared dependencies as Wave-1 tasks for max parallelism.

Wave 1: screen-1 shell + system identity copy architecture
Wave 2: project module internal-scroll behavior + responsive/interaction hardening

### Dependency Matrix (full, all tasks)
| Task | Blocks | Blocked By |
|---|---|---|
| 1. Screen-1 shell refactor | 3, 4 | — |
| 2. System Identity content system | 4 | — |
| 3. Fixed-height project module with internal scroll | 4 | 1 |
| 4. Overflow, responsiveness, and regression polish | F1-F4 | 1, 2, 3 |

### Agent Dispatch Summary (wave → task count → categories)
| Wave | Tasks | Categories |
|---|---:|---|
| 1 | 2 | visual-engineering |
| 2 | 2 | visual-engineering |
| Final | 4 | oracle, unspecified-high, deep |

## TODOs
> Implementation + Test = ONE task. Never separate.
> EVERY task MUST have: Agent Profile + Parallelization + QA Scenarios.

- [x] 1. Refactor Screen 1 shell into a stable identity + project-module stage

  **What to do**: Rework the `screen-overview` layout in `prototypes/layouts/hybrid-pro-split.html` so the first screen clearly has two balanced zones: a bounded left `System Identity` panel and a dominant right project-module zone. Preserve existing background FX, glitch title, cursor, particles, scroll indicator, and screen 2 structure. Keep screen 1 within the viewport at desktop (`1440x1024`) without requiring vertical page scroll.
  **Must NOT do**: Do not touch screen 2 module placement. Do not remove particles/cursor/grid. Do not introduce a dashboard top bar, side nav, or extra sections beyond the agreed left identity + right project module composition.

  **Recommended Agent Profile**:
  - Category: `visual-engineering` - Reason: this is a structure-and-composition prototype change with strong visual constraints
  - Skills: [`frontend-design`] - why needed: preserve the hybrid-pro aesthetic while making the composition feel premium rather than generic
  - Omitted: [`backend-patterns`] - why not needed: no backend or data work

  **Parallelization**: Can Parallel: YES | Wave 1 | Blocks: 3, 4 | Blocked By: none

  **References** (executor has NO interview context - be exhaustive):
  - Pattern: `prototypes/layouts/hybrid-pro-split.html:889-1029` - current screen-1 composition to refactor without discarding its overall style
  - Pattern: `prototypes/layouts/split-view.html:47-55` - clean two-column overview balance reference
  - Pattern: `prototypes/layouts/split-view.html:130-155` - bounded project-panel framing reference
  - Pattern: `src/pages/Home.tsx:8-16` - current home page keeps a restrained main content stack; avoid overcomplicating screen 1 into app chrome

  **Acceptance Criteria** (agent-executable only):
  - [ ] `prototypes/layouts/hybrid-pro-split.html` still contains two screens and `#s2` remains present
  - [ ] At browser viewport `1440x1024`, the entirety of screen 1 content is visible without vertical clipping
  - [ ] Left and right columns feel intentionally balanced, with the right project module visually dominant
  - [ ] Screen 2 asymmetric module grid remains structurally unchanged

  **QA Scenarios** (MANDATORY - task incomplete without these):
  ```
  Scenario: Desktop screen-one fit check
    Tool: Playwright
    Steps: Start `python3 -m http.server 4173`; open `http://127.0.0.1:4173/prototypes/layouts/hybrid-pro-split.html`; resize to 1440x1024; verify the first screen before scrolling
    Expected: Profile panel, title, and project module all fit inside the first viewport; scroll indicator is visible; no content is cut off
    Evidence: .sisyphus/evidence/task-1-screen-shell.png

  Scenario: Screen-two regression check
    Tool: Playwright
    Steps: From the same page, scroll to `#s2`; inspect module count and asymmetric layout
    Expected: Six modules are visible and the `Games` module still occupies the large dominant slot
    Evidence: .sisyphus/evidence/task-1-screen-shell-screen2.png
  ```

  **Commit**: NO | Message: `update(prototype): stabilize hybrid split screen shell` | Files: `prototypes/layouts/hybrid-pro-split.html`

- [x] 2. Replace filler profile content with a premium System Identity panel

  **What to do**: Remove the current low-signal filler sections (`Tech Stack`, `Connect`) and replace them with a tighter `System Identity` composition. Required content blocks: identity mark/status, avatar/name/role, one-line manifesto, `Current Focus`, `Now Building`, and `Availability`. Keep copy concise and high-signal so the panel reads like an editorial personal system, not a resume and not a settings card.
  **Must NOT do**: Do not add skill-chip dumps, social icon rows, fake analytics, long biographies, or more than three lower supporting blocks below the headline identity area.

  **Recommended Agent Profile**:
  - Category: `visual-engineering` - Reason: content architecture and visual hierarchy must work together
  - Skills: [`frontend-design`] - why needed: the panel needs high-end editorial information design, not generic UI widgets
  - Omitted: [`copywriting`] - why not needed: this is microcopy inside a prototype, not marketing page writing

  **Parallelization**: Can Parallel: YES | Wave 1 | Blocks: 4 | Blocked By: none

  **References** (executor has NO interview context - be exhaustive):
  - Pattern: `prototypes/layouts/hybrid-pro-split.html:891-941` - current profile-card region to replace selectively
  - Pattern: `prototypes/layouts/hybrid-pro.html:731-753` - original compact identity block proportions to preserve
  - Pattern: `prototypes/layouts/split-view.html:99-128` - concise metric rhythm reference for compact info rows
  - Pattern: `src/components/portal/CategoryGrid.tsx:38-80` - concise portal tone and section-description style to emulate

  **Acceptance Criteria** (agent-executable only):
  - [ ] The left card contains `Current Focus`, `Now Building`, and `Availability`
  - [ ] The left card no longer contains the current `Tech Stack` or `Connect` filler sections
  - [ ] Total supporting content stays compact enough to fit the desktop viewport without pushing screen 1 taller than one viewport
  - [ ] The copy reads as specific and system-like, not generic placeholder portfolio text

  **QA Scenarios** (MANDATORY - task incomplete without these):
  ```
  Scenario: Identity panel content audit
    Tool: Playwright
    Steps: Open the prototype at `http://127.0.0.1:4173/prototypes/layouts/hybrid-pro-split.html`; inspect the left column text blocks
    Expected: `Current Focus`, `Now Building`, and `Availability` are visible; `Tech Stack` and `Connect` are absent
    Evidence: .sisyphus/evidence/task-2-system-identity.png

  Scenario: Anti-generic content check
    Tool: Playwright
    Steps: Capture the left panel at desktop width and review spacing/line lengths
    Expected: No chip cloud or social-button filler appears; copy fits inside the card without overflow or cramped wrapping
    Evidence: .sisyphus/evidence/task-2-system-identity-tightness.png
  ```

  **Commit**: NO | Message: `update(prototype): rewrite profile card as system identity` | Files: `prototypes/layouts/hybrid-pro-split.html`

- [x] 3. Rebuild Active Projects as a fixed-height module with internal scroll

  **What to do**: Replace the current generic `project-list` with a true bounded project module. The module must include: a fixed header row (`Active Projects` + lightweight status/count), a fixed-height body area, and an internally scrollable vertical project stack. The header must stay visible while only the project list scrolls. Each project card should keep project name, tags, recency text, and progress treatment, but the list should feel like a premium panel rather than a plain feed.
  **Must NOT do**: Do not switch to horizontal rail behavior. Do not move the module to screen 2. Do not add pagination overlays, modal detail views, or data fetching.

  **Recommended Agent Profile**:
  - Category: `visual-engineering` - Reason: this is a high-judgment layout and interaction problem inside a static prototype
  - Skills: [`frontend-design`] - why needed: the module needs to feel like a premium content block, not a generic dashboard list
  - Omitted: [`frontend-patterns`] - why not needed: framework-level component patterns are irrelevant to a single-file prototype

  **Parallelization**: Can Parallel: NO | Wave 2 | Blocks: 4 | Blocked By: 1

  **References** (executor has NO interview context - be exhaustive):
  - Pattern: `prototypes/layouts/hybrid-pro-split.html:947-1022` - current project section to replace selectively
  - Pattern: `prototypes/layouts/hybrid-pro.html:461-571` - card treatment, progress styling, and hover rhythm to preserve
  - Pattern: `prototypes/layouts/split-view.html:146-225` - concise project metadata and progress density reference
  - Pattern: `src/components/portal/ProjectGrid.tsx:19-49` - current portal project naming, tags, and CTA language
  - Pattern: `e2e/portal.spec.ts:12-19` - existing portal terminology around `PROJECTS` and `月抛模拟器`

  **Acceptance Criteria** (agent-executable only):
  - [ ] The project section renders as a fixed-height module with a non-scrolling header and an internally scrolling list body
  - [ ] At least 6 project cards can be placed in the module without growing screen 1 taller than the viewport at desktop width
  - [ ] Internal scrolling is visually obvious and usable by wheel/trackpad inside the module area
  - [ ] Each card still shows project title, tags/metadata, and progress

  **QA Scenarios** (MANDATORY - task incomplete without these):
  ```
  Scenario: Internal module scroll behavior
    Tool: Playwright
    Steps: Open the prototype; locate `Active Projects`; hover inside the module body; use mouse wheel/trackpad to scroll within the project list
    Expected: The project list scrolls inside its own bounded area while the module header remains fixed and the overall page stays on screen 1
    Evidence: .sisyphus/evidence/task-3-project-module-scroll.png

  Scenario: Overflow scale check
    Tool: Playwright
    Steps: Temporarily duplicate project cards in the HTML to 6+ items; reload the prototype at 1440x1024; inspect the module
    Expected: The module remains bounded, cards remain legible, and overflow stays inside the module instead of stretching screen 1 taller
    Evidence: .sisyphus/evidence/task-3-project-module-overflow.png
  ```

  **Commit**: NO | Message: `update(prototype): convert active projects into fixed scroll module` | Files: `prototypes/layouts/hybrid-pro-split.html`

- [x] 4. Harden responsiveness, interaction polish, and screen-two regression boundaries

  **What to do**: Finish the prototype by tightening desktop/mobile behavior around the new screen-1 composition. Ensure narrow viewports stack gracefully, the project module remains usable, long project titles do not blow up card height, and scroll indicator/back-to-top behavior still works. Apply only minimal shared-style synchronization to screen 2 if needed for consistency; do not change its structure, module ordering, or asymmetry.
  **Must NOT do**: Do not redesign the second screen. Do not add new modules. Do not add drag libraries, custom scrollbars requiring dependencies, or bespoke mobile-only alternate screens.

  **Recommended Agent Profile**:
  - Category: `visual-engineering` - Reason: this is primarily polish, responsive design, and regression control
  - Skills: [`frontend-design`] - why needed: responsive polish must preserve the design’s tone, not flatten it
  - Omitted: [`vercel-react-best-practices`] - why not needed: no React/Next rendering path is involved here

  **Parallelization**: Can Parallel: NO | Wave 2 | Blocks: F1-F4 | Blocked By: 1, 2, 3

  **References** (executor has NO interview context - be exhaustive):
  - Pattern: `prototypes/layouts/hybrid-pro-split.html:858-877` - current responsive breakpoints to revise, not replace wholesale
  - Pattern: `prototypes/layouts/hybrid-pro-split.html:1026-1088` - screen-2 structure that must remain stable
  - Pattern: `src/components/portal/CategoryGrid.tsx:41-80` - concise module naming and subtitle tone; preserve this restraint if any copy is touched
  - Pattern: `e2e/portal.spec.ts:8-27` - preserve obvious portal language and homepage behavior expectations if terminology is reused later

  **Acceptance Criteria** (agent-executable only):
  - [ ] At `1024x768`, screen 1 stacks without overlapping or clipping identity/module content
  - [ ] At `390x844`, the project module remains usable and cards stay readable
  - [ ] Long project names wrap cleanly without making neighboring cards visually broken
  - [ ] Screen 2 still presents the same six modules and same dominant `Games` tile
  - [ ] Browser console stays free of runtime errors during cursor, particle, hover, and scroll interactions

  **QA Scenarios** (MANDATORY - task incomplete without these):
  ```
  Scenario: Tablet and mobile regression sweep
    Tool: Playwright
    Steps: Open the prototype; test at 1024x768 and 390x844; inspect screen 1 before scrolling and interact with the project module scroll area
    Expected: No overlap, no clipped identity content, and project cards remain readable and navigable
    Evidence: .sisyphus/evidence/task-4-responsive-regression.png

  Scenario: Console/runtime stability check
    Tool: Playwright
    Steps: Load the page, hover project cards and modules, scroll between screens, then read browser console
    Expected: No uncaught errors; cursor and particle systems continue functioning after the project-module rewrite
    Evidence: .sisyphus/evidence/task-4-console.txt
  ```

  **Commit**: YES | Message: `update(prototype): refine hybrid split identity and project module` | Files: `prototypes/layouts/hybrid-pro-split.html`

## Final Verification Wave (MANDATORY — after ALL implementation tasks)
> 4 review agents run in PARALLEL. ALL must APPROVE. Present consolidated results to user and get explicit "okay" before completing.
> **Do NOT auto-proceed after verification. Wait for user's explicit approval before marking work complete.**
> **Never mark F1-F4 as checked before getting user's okay.** Rejection or user feedback -> fix -> re-run -> present again -> wait for okay.
- [ ] F1. Plan Compliance Audit — oracle
- [ ] F2. Code Quality Review — unspecified-high
- [ ] F3. Real Manual QA — unspecified-high (+ playwright if UI)
- [ ] F4. Scope Fidelity Check — deep

## Commit Strategy
- Single commit after Task 4 and before Final Verification Wave
- Commit message: `update(prototype): refine hybrid split identity and project module`

## Success Criteria
- Screen 1 feels intentionally editorial/systemic rather than generic portfolio filler
- Project browsing scales within the bounded module without breaking composition
- Screen 2 remains recognizably the same design
- The prototype is implementation-ready as the preferred reference for later React adaptation
