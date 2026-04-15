# Draft: Optimization Opportunities

## Requirements (confirmed)
- 帮我看看有什么可以优化的
- 优先方向：结构与工程优化

## Technical Decisions
- 先做仓库级静态排查，再收敛为可执行优化方向
- 当前按“标准”规划处理：先发现问题，再确认优先级，再生成单一执行计划
- 以“降低复杂度 + 提高后续迭代稳定性”为首要目标，而不是先做纯性能调优

## Research Findings
- `package.json`: 只有 `build` / `test:unit` / `test:e2e`，缺少独立 `typecheck`、lint、coverage、bundle 分析脚本
- `vite.config.ts`: 仅基础 React + alias 配置，未见手动 chunk、bundle 可视化或性能优化配置
- `vitest.config.ts`: 已有 jsdom 单测基础，但未配置 coverage
- `playwright.config.ts`: 已有 E2E 与 preview webServer，CI 下有重试，但未见更完整质量闸门
- `src/hooks/useGameState.ts`: 约 565 行，状态、成就、反馈、流程控制高度集中，属于明显可拆分热点
- `src/components/moon-throw/GameContainer.tsx`: 约 291 行，布局/交互/动画/游戏流程杂糅，渲染与维护复杂度高
- `src/components/portal/TerminalHome.tsx`: 直接操作 DOM、append 到 `document.body`、大量内联样式与 hover 卡片逻辑，存在可维护性与交互复杂度优化空间

## Open Questions
- 优化范围是否只聚焦 `月抛模拟器` 主链路，还是同时纳入首页 `TerminalHome` 与工程脚本治理

## Scope Boundaries
- INCLUDE: 前端结构、状态管理、构建测试链路、可维护性、性能机会点
- EXCLUDE: 未经确认的功能新增、实际代码实现
