# Owltree Performance Optimization

## TL;DR
> **Summary**: 通过路由级代码分割（React.lazy + Suspense）降低首屏加载体积，通过 memoization 减少大页面不必要的重渲染，通过 manualChunks 拆分大型 vendor 库。
> **Deliverables**:
> - App.tsx 改为 5 个路由懒加载 + Suspense fallback
> - 4 个大页面（Games/Notes/Tools/Trends）添加 useMemo 派生值缓存
> - vite.config.ts 添加 manualChunks 拆分 framer-motion 和 lucide-react
> - 加载前后 bundle 大小对比证据
> **Effort**: Medium
> **Parallel**: YES - 2 waves
> **Critical Path**: Task 1 → Task 3 → Task 4

## Context
### Original Request
- 用户选择"性能优先"方向：代码分割 + memoization。

### Interview Summary
- 代码分割方案确认：内联 `.then()` 映射，不新增 wrapper 文件。
- Home 页面保持静态导入（首屏关键路径）。
- 其余 5 个路由（Games/Notes/Tools/Trends/MoonThrow）使用 React.lazy。
- 不改变路由结构、不引入新运行时依赖、不改变视觉效果。

### Metis Review (gaps addressed)
- Metis 调用超时，已由自审补做。
- 自审 guardrails：
  - 确认 React.lazy 的 `.then()` 映射不会破坏 TypeScript 类型推导。
  - Suspense fallback 应足够轻量，避免引入额外 bundle 依赖。
  - memoization 应严格限于纯计算派生值，不包裹事件处理函数（除非子组件因引用不稳定导致重渲染）。
  - manualChunks 配置需验证不影响 tree-shaking。
  - E2E 测试使用 `npm run preview`，代码分割后 chunk 加载时序可能影响测试稳定性，需关注。

## Work Objectives
### Core Objective
降低首屏 JS 体积、减少大页面不必要的重渲染，同时保持所有现有功能和测试通过。

### Deliverables
- 懒加载后的 App.tsx（Home 静态 + 5 路由动态）
- 轻量 Loading fallback 组件
- 4 个大页面中关键派生值的 useMemo 缓存
- vite.config.ts 中的 manualChunks vendor 拆分
- 加载前后 bundle/chunk 大小对比证据

### Definition of Done (verifiable conditions with commands)
- `npm run build` 成功
- `npm run typecheck` 成功
- `npm run test:unit` 全部通过
- `npm run test:e2e` 全部通过
- `dist/assets/` 下存在多个 JS chunk 文件（而非单一 bundle）
- chunk 体积报告显示首屏 chunk 明显小于当前 436KB

### Must Have
- Home 页面保持静态导入，不延迟加载
- 所有懒加载页面在 Suspense fallback 中有合理等待状态
- useMemo 的依赖数组正确，不引入 stale closure
- manualChunks 不破坏 framer-motion 的 tree-shaking

### Must NOT Have (guardrails, AI slop patterns, scope boundaries)
- Must NOT 改变路由路径或 HashRouter 配置
- Must NOT 引入 React.lazy 之外的代码分割库（如 @loadable/components）
- Must NOT 对游戏引擎内部逻辑做 memoization（引擎已足够纯）
- Must NOT 将 Home 页面改为懒加载
- Must NOT 添加过度 memoization（如对简单字符串拼接使用 useMemo）

## Verification Strategy
> ZERO HUMAN INTERVENTION - all verification is agent-executed.
- Test decision: **tests-after** — 先改代码，再验证现有测试 + 新增性能验证
- QA policy: 每个任务包含 agent-executed 验证场景
- Evidence: `.sisyphus/evidence/task-{N}-{slug}.{ext}`

## Execution Strategy
### Parallel Execution Waves
> Target: 5-8 tasks per wave. <3 per wave (except final) = under-splitting.

Wave 1: App.tsx 代码分割 + Loading 组件 + memoization（核心改动，紧密耦合）

Wave 2: vendor chunk 拆分 + 集成验证 + bundle 对比

### Dependency Matrix (full, all tasks)
- Task 1 blocks Task 3, Task 4
- Task 2 blocks Task 3, Task 4
- Task 3 blocks Task 4
- Task 4 depends on Tasks 1, 2, 3

### Agent Dispatch Summary (wave → task count → categories)
- Wave 1 → 2 tasks → quick / unspecified-high
- Wave 2 → 2 tasks → quick / unspecified-high

## TODOs
> Implementation + Test = ONE task. Never separate.
> EVERY task MUST have: Agent Profile + Parallelization + QA Scenarios.

- [x] 1. Implement route-level code splitting with React.lazy + Suspense

  **What to do**:
  1. 在 `src/App.tsx` 中，将 Games、Notes、Tools、Trends、MoonThrow 5 个页面的静态 import 替换为 `React.lazy()` 动态导入。使用内联 `.then()` 映射命名导出为默认导出：
     ```tsx
     const Games = lazy(() => import('@/pages/Games').then(m => ({ default: m.Games })))
     const Notes = lazy(() => import('@/pages/Notes').then(m => ({ default: m.Notes })))
     const Tools = lazy(() => import('@/pages/Tools').then(m => ({ default: m.Tools })))
     const Trends = lazy(() => import('@/pages/Trends').then(m => ({ default: m.Trends })))
     const MoonThrow = lazy(() => import('@/pages/MoonThrow').then(m => ({ default: m.MoonThrow })))
     ```
  2. 在文件顶部添加 `import { lazy, Suspense } from 'react'`。
  3. 移除这 5 个页面的静态 import 语句。
  4. Home 保持静态导入不变：`import { Home } from '@/pages/Home'`。
  5. 在 `<Routes>` 外层包裹 `<Suspense fallback={<PageLoader />}>`，其中 `PageLoader` 是一个轻量内联组件（见下方），定义在同一文件中即可：
     ```tsx
     function PageLoader() {
       return (
         <div className="flex items-center justify-center min-h-screen" style={{ background: 'var(--bg-primary)' }}>
           <span style={{ color: 'var(--text-primary)', fontFamily: 'monospace' }}>Loading...</span>
         </div>
       )
     }
     ```
  6. 确保 `lazy` 的 TypeScript 类型推导正确：`React.lazy` 返回 `React.LazyExoticComponent<{}>`，与 `<Route element={...}>` 兼容。

  **Must NOT do**:
  - 不创建新的 wrapper 文件
  - 不将 Home 改为懒加载
  - 不改变 HashRouter 配置
  - 不引入额外的 loading 库或 spinner 组件

  **Recommended Agent Profile**:
  - Category: `quick` - Reason: 单文件改动，模式明确，风险低
  - Skills: [`coding-standards`] - 确保 TypeScript 类型和 React hooks 规范
  - Omitted: [`frontend-design`] - 无视觉改动

  **Parallelization**: Can Parallel: NO | Wave 1 | Blocks: [3, 4] | Blocked By: []

  **References**:
  - Pattern: `src/App.tsx:1-30` — 当前静态导入和路由定义，完整替换目标
  - Pattern: `src/pages/Games.tsx:1` — `export function Games()` 命名导出格式（所有页面相同）
  - Pattern: `src/pages/Notes.tsx:1` — 命名导出格式
  - Pattern: `src/pages/Tools.tsx:1` — 命名导出格式
  - Pattern: `src/pages/Trends.tsx:1` — 命名导出格式
  - Pattern: `src/pages/MoonThrow.tsx:1` — 命名导出格式
  - External: `https://react.dev/reference/react/lazy` — React.lazy 官方文档
  - External: `https://reactrouter.com/en/main/route/lazy/` — React Router 懒加载路由文档

  **Acceptance Criteria** (agent-executable only):
  - [ ] `npm run build` 成功
  - [ ] `npm run typecheck` 成功（React.lazy 类型正确）
  - [ ] `npm run test:unit` 全部通过
  - [ ] `npm run test:e2e` 全部通过
  - [ ] `dist/assets/` 下存在至少 3 个 JS chunk 文件（Home chunk + 懒加载 chunks + vendor）

  **QA Scenarios** (MANDATORY):
  ```
  Scenario: Code-split build produces multiple chunks
    Tool: Bash
    Steps: Run `npm run build`, then `ls -la dist/assets/*.js | wc -l`
    Expected: JS chunk 文件数量 >= 3（当前只有 1 个 index-*.js）
    Evidence: .sisyphus/evidence/task-1-code-split-build.txt

  Scenario: All tests pass after lazy loading refactor
    Tool: Bash
    Steps: Run `npm run typecheck && npm run test:unit && npm run build && npm run test:e2e`
    Expected: 全部命令退出码 0
    Evidence: .sisyphus/evidence/task-1-code-split-verify.txt

  Scenario: Home page loads immediately without lazy delay
    Tool: Bash
    Steps: Run `npm run test:e2e -- e2e/portal.spec.ts`，验证首页测试无需额外等待
    Expected: 首页测试在合理时间内通过（无新增 timeout）
    Evidence: .sisyphus/evidence/task-1-code-split-e2e.txt
  ```

  **Commit**: YES | Message: `perf(router): implement route-level code splitting` | Files: [`src/App.tsx`]

- [x] 2. Add useMemo memoization to large page components

  **What to do**:
  1. **Games.tsx**: 如果存在基于 data 数组的过滤或映射计算（如 `games.filter(...)` 或 `games.map(...)` 中有派生值），用 `useMemo` 包裹。如果页面主要是静态渲染（无过滤/排序），则跳过。
  2. **Notes.tsx**: 同上，检查是否有过滤/排序逻辑需要 memoization。
  3. **Tools.tsx**: 如果存在 `filteredTools` 或 `toolsByCategory` 等基于 state 的过滤逻辑，用 `useMemo` 包裹，依赖为 `[tools, activeCategory]` 或对应依赖。
  4. **Trends.tsx**: 如果存在 `filteredTrends` 或 `hotTrendCount` 等基于 state 的计算，用 `useMemo` 包裹，依赖为 `[trends, activeCategory]` 或对应依赖。
  5. 对每个页面，先 Read 文件确认具体有哪些派生值计算，然后仅对计算成本非零的派生值添加 useMemo。不要对简单字符串或常量使用 useMemo。
  6. 不要使用 `React.memo` 包裹页面组件本身（页面组件作为 Route element 不受益于 memo）。

  **Must NOT do**:
  - 不要对简单映射（如 `data.map(x => <Card key={x.id} ... />)`）添加 useMemo
  - 不要对事件处理函数使用 useCallback（除非有明确的子组件重渲染问题证据）
  - 不要对游戏引擎模块做 memoization
  - 不要引入 React.memo 包裹页面顶层组件

  **Recommended Agent Profile**:
  - Category: `unspecified-high` - Reason: 需要判断哪些派生值值得 memoize
  - Skills: [`coding-standards`] - 确保 useMemo 依赖数组正确
  - Omitted: [`frontend-design`] - 无视觉改动

  **Parallelization**: Can Parallel: YES | Wave 1 | Blocks: [3, 4] | Blocked By: []

  **References**:
  - Pattern: `src/pages/Games.tsx` — 完整文件，需 Read 后识别派生值
  - Pattern: `src/pages/Notes.tsx` — 完整文件
  - Pattern: `src/pages/Tools.tsx` — 完整文件
  - Pattern: `src/pages/Trends.tsx` — 完整文件

  **Acceptance Criteria** (agent-executable only):
  - [ ] `npm run build` 成功
  - [ ] `npm run typecheck` 成功
  - [ ] `npm run test:unit` 全部通过
  - [ ] `npm run test:e2e` 全部通过
  - [ ] 至少 2 个大页面中存在 `useMemo` 调用（如果有可 memoize 的派生值）

  **QA Scenarios** (MANDATORY):
  ```
  Scenario: Memoization doesn't break page rendering
    Tool: Bash
    Steps: Run `npm run typecheck && npm run test:unit && npm run build && npm run test:e2e`
    Expected: 全部命令退出码 0
    Evidence: .sisyphus/evidence/task-2-memoization-verify.txt
  ```

  **Commit**: YES | Message: `perf(pages): add useMemo for derived values in large pages` | Files: [`src/pages/Games.tsx`, `src/pages/Notes.tsx`, `src/pages/Tools.tsx`, `src/pages/Trends.tsx`（按实际改动）]

- [x] 3. Configure vendor chunk splitting via manualChunks

  **What to do**:
  1. 在 `vite.config.ts` 的 `build` 配置中添加 `rollupOptions.output.manualChunks`：
     ```ts
     build: {
       sourcemap: true,
       rollupOptions: {
         output: {
           manualChunks: {
             'framer-motion': ['framer-motion'],
             'lucide-react': ['lucide-react'],
           },
         },
       },
     },
     ```
  2. 这样 Vite 会将 framer-motion 和 lucide-react 的模块拆分为独立的 vendor chunk，浏览器可独立缓存。
  3. 如果 chunk 命名导致构建问题（如 hash 冲突），改用函数式 manualChunks（`manualChunks(id, { getModuleInfo, getModuleInfoFromModule })`），按模块路径前缀分组。

  **Must NOT do**:
  - 不要过度拆分导致 HTTP/1.1 下请求数过多
  - 不要手动指定所有 chunk，只拆大型 vendor
  - 不要改变 base 路径或 alias 配置

  **Recommended Agent Profile**:
  - Category: `quick` - Reason: 配置文件改动，模式成熟
  - Skills: [`coding-standards`] - Vite 配置规范
  - Omitted: [`frontend-design`] - 无视觉改动

  **Parallelization**: Can Parallel: NO | Wave 2 | Blocks: [4] | Blocked By: [1, 2]

  **References**:
  - Pattern: `vite.config.ts:1-17` — 当前配置，需扩展 build 部分
  - External: `https://vite.dev/guide/build.html#chunking-strategies` — Vite chunking 文档
  - External: `https://rollupjs.org/configuration-options/#output-manualchunks` — manualChunks API

  **Acceptance Criteria** (agent-executable only):
  - [ ] `npm run build` 成功
  - [ ] `dist/assets/` 中存在 `framer-motion-*.js` 和 `lucide-react-*.js` chunk（或类似命名）
  - [ ] 主 index chunk 体积小于代码分割前的 436KB
  - [ ] `npm run test:e2e` 全部通过

  **QA Scenarios** (MANDATORY):
  ```
  Scenario: Vendor chunks split correctly
    Tool: Bash
    Steps: Run `npm run build`, then `ls dist/assets/*.js` 列出所有 chunk 文件
    Expected: 至少有 framer-motion 和 lucide-react 相关的独立 chunk 文件
    Evidence: .sisyphus/evidence/task-3-vendor-chunks.txt
  ```

  **Commit**: YES | Message: `perf(build): split vendor chunks for framer-motion and lucide-react` | Files: [`vite.config.ts`]

- [x] 4. Verify performance improvements and integration

  **What to do**:
  1. 运行完整验证链：`npm run typecheck && npm run lint && npm run test:unit -- --coverage && npm run build && npm run test:e2e`
  2. 收集 bundle 大小对比证据：
     - 列出 `dist/assets/*.js` 所有文件及其大小
     - 计算主 chunk 大小，与之前的 436KB 对比
     - 计算所有 chunk 总大小
  3. 确认 E2E 测试（特别是懒加载路由的导航测试）通过，没有因 chunk 加载时序导致的 flaky test。
  4. 确认没有引入死代码或未使用的 import。

  **Must NOT do**:
  - 不能因为追求更小的 bundle 而削弱功能
  - 不能跳过 E2E 验证（代码分割可能引入时序问题）

  **Recommended Agent Profile**:
  - Category: `quick` - Reason: 验证 + 证据收集
  - Skills: [`verification-before-completion`] - 确保完整验证
  - Omitted: [`frontend-design`] - 无视觉改动

  **Parallelization**: Can Parallel: NO | Wave 2 | Blocks: [] | Blocked By: [1, 2, 3]

  **References**:
  - Pattern: `package.json` — 所有验证命令
  - Pattern: `.github/workflows/deploy.yml` — CI 验证链（确保与本地一致）

  **Acceptance Criteria** (agent-executable only):
  - [ ] 完整验证链通过（typecheck + lint + test:unit + build + test:e2e）
  - [ ] 主 chunk JS 文件体积 < 436KB
  - [ ] E2E 测试 8/8 通过
  - [ ] 无死代码或未使用的 import

  **QA Scenarios** (MANDATORY):
  ```
  Scenario: Full verification chain passes with code splitting
    Tool: Bash
    Steps: Run `npm run typecheck && npm run lint && npm run test:unit -- --coverage && npm run build && npm run test:e2e`
    Expected: 全部命令成功，测试数量 >= 114
    Evidence: .sisyphus/evidence/task-4-full-verify.txt

  Scenario: Bundle size comparison
    Tool: Bash
    Steps: Run `npm run build`, then `ls -la dist/assets/*.js`，记录每个文件大小
    Expected: 主 chunk < 436KB；总 chunk 数 >= 3；有独立的 framer-motion 和 lucide-react chunk
    Evidence: .sisyphus/evidence/task-4-bundle-comparison.txt
  ```

  **Commit**: YES | Message: `chore(repo): verify performance optimization integration` | Files: [evidence files]

## Final Verification Wave (MANDATORY — after ALL implementation tasks)
> 4 review agents run in PARALLEL. ALL must APPROVE. Present consolidated results to user and get explicit "okay" before completing.
> **Do NOT auto-proceed after verification. Wait for user's explicit approval before marking work complete.**
> **Never mark F1-F4 as checked before getting user's okay.** Rejection or user feedback -> fix -> re-run -> present again -> wait for okay.
- [x] F1. Plan Compliance Audit — oracle
- [x] F2. Code Quality Review — unspecified-high
- [x] F3. Real Manual QA — unspecified-high (+ playwright if UI)
- [x] F4. Scope Fidelity Check — deep

## Commit Strategy
- Commit after each task完成。
- Prefer commits:
  - `perf(router): implement route-level code splitting`
  - `perf(pages): add useMemo for derived values in large pages`
  - `perf(build): split vendor chunks for framer-motion and lucide-react`
  - `chore(repo): verify performance optimization integration`

## Success Criteria
- 首屏 JS chunk 体积 < 当前 436KB（预计可降至 ~300KB 以下）
- framer-motion 和 lucide-react 独立 chunk，可浏览器缓存
- 大页面不必要的重渲染减少
- 所有现有测试通过，E2E 稳定
- CI 验证链与本地一致
