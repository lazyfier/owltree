# Owltree 项目目录说明

## 根目录

- `.claude/`
  - Claude Code / agent 相关配置、规则、技能。

- `.github/`
  - GitHub Actions、CI/CD、仓库自动化配置。

- `.playwright-mcp/`
  - Playwright / 浏览器调试过程生成的临时截图、快照、日志。
  - 结论：应持续视为临时目录，随用随清。

- `.sisyphus/`
  - AI 规划、执行记录、证据文件目录。
  - 不属于业务代码。

- `.worktrees/`
  - git worktree 相关目录，用于并行开发分支。

- `archive/`
  - 归档内容。
  - 放旧文档、旧原型、废弃组件、历史资料，不参与当前主线开发。

- `coverage/`
  - 测试覆盖率输出目录。
  - 结论：不进手工维护，按生成物处理。

- `dist/`
  - 构建产物目录。
  - 由 `npm run build` 生成。

- `docs/`
  - 设计文档、说明文档、非运行时代码资料。

- `e2e/`
  - Playwright 端到端测试。

- `theme/`
  - HTML/CSS 原型参考目录，不参与正式构建。
  - 其中 `theme/moon-throw.html` 是游戏原型的重要参考。

- `index.html`
  - Vite 入口 HTML。

- `AGENTS.md`
  - 面向 agent 的项目协作说明。

- `CLAUDE.md`
  - 当前项目的 Claude / AI 工作约束说明。

## src/ 主代码目录

- `src/components/`
  - React 组件层。

  ### `src/components/portal/`
  - 门户首页相关组件。
  - 例如 Hero、终端风格首页、分类网格等。

  ### `src/components/moon-throw/`
  - 月抛模拟器 UI 组件。
  - 包括头像区、动作面板、对话区、结算、复盘等。
  - 结论：游戏 UI 改动优先在这里进行。

  ### `src/components/layout/`
  - 全站布局组件。
  - 比如 Footer、主题切换器等。

  ### `src/components/ui/`
  - 通用基础 UI 组件。
  - 比如 Button、Card、Badge、背景特效等。

- `src/contexts/`
  - React Context，全局状态入口。
  - 当前主要承载主题系统。

- `src/pages/`
  - 路由页面级组件。
  - 如 `Home`、`Games`、`MoonThrow`、`Notes`、`Tools`、`Trends`。

- `src/hooks/`
  - 自定义 hooks。
  - 当前游戏状态驱动核心在 `useGameState`。

- `src/game/`
  - 纯 TypeScript 游戏引擎层，不依赖 React。
  - 这是规则和数据的核心层。

  ### `src/game/engine/`
  - 游戏逻辑实现。
  - 包括行动结算、聊天、医院检查、partner 生成、game over 判定等。

  ### `src/game/data/`
  - 游戏配置数据。
  - 包括标签、疾病、事件、角色模板、结局、对白等。

  ### `src/game/types.ts`
  - 游戏类型定义。

- `src/styles/`
  - 全局样式和页面样式。

  ### `src/styles/game.css`
  - 月抛模拟器专用样式。

  ### `src/styles/pages/`
  - 各页面独立样式。

- `src/lib/`
  - 工具函数、通用辅助逻辑。

- `src/test/`
  - 应用层测试文件。

## 如何判断改哪里

- 改界面
  - 优先：`src/components/moon-throw/`、`src/styles/game.css`

- 改游戏规则
  - 优先：`src/game/engine/`、`src/game/data/`

- 改页面入口 / 路由 / 页面跳转
  - 优先：`src/pages/`、`src/App.tsx`

- 改全局主题
  - 优先：`src/contexts/`、全局样式变量

- 改测试
  - 单元：`src/**/*.test.ts(x)`
  - E2E：`e2e/`

## 建议的长期整理规则

### 应长期保留

- `src/`
- `e2e/`
- `docs/`
- `theme/`
- `archive/`
- `.sisyphus/`
- `.github/`
- `.claude/`

### 应视为生成物 / 临时目录

- `dist/`
- `coverage/`
- `.playwright-mcp/`

结论：这些目录不要当资料仓库使用，需要时生成，不需要时清理。

### 文件放置约定

- 业务代码只放 `src/`
- 页面只放 `src/pages/`
- 可复用组件只放 `src/components/`
- 游戏规则不要混进 React 组件，放 `src/game/`
- 原型只放 `theme/`
- 历史废弃内容只放 `archive/`
- 截图不要再放项目根目录

## 当前建议

1. 继续保持截图不落在根目录。
2. `.playwright-mcp/` 继续作为临时目录使用，定期清空。
3. 如果后续要保存“正式展示截图”，单独新建 `docs/screenshots/`，不要混在根目录。
4. 如果 `archive/` 继续增大，建议按 `archive/prototypes/`、`archive/docs/`、`archive/legacy-components/` 继续细分。

## 一句话总结

这个项目可以按四层理解：

1. 页面层：`src/pages/`
2. 组件层：`src/components/`
3. 状态层：`src/hooks/` + `src/contexts/`
4. 引擎层：`src/game/`

月抛模拟器后续绝大多数改动，都会落在：

- `src/components/moon-throw/`
- `src/styles/game.css`
- `src/game/engine/`
- `src/game/data/`
