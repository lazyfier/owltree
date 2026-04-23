# 月抛模拟器 · 视觉小说风格全面升级

## TL;DR
> **Summary**: 将月抛模拟器从暗蓝UI重构为日系视觉小说风格，同时大幅扩充游戏内容（标签/台词/疾病/事件）和深化机制（难度递增/试纸补充/随机事件/成就系统）。
> **Deliverables**: 全新视觉小说UI组件、多轮对话系统、扩充数据层、新引擎模块（事件/成就/难度）、过渡动画、修复现有LSP错误
> **Effort**: XL（3层全改：UI重做 + 引擎扩展 + 数据扩充）
> **Parallel**: YES - 5 waves
> **Critical Path**: Task 1(数据层) → Task 5(对话系统引擎) → Task 7(VN UI) → Task 12(集成) → F1-F4

## Context
### Original Request
用户要求"再完善下月抛模拟器"，经过三轮访谈确认：
1. 内容丰富化 + 机制深化
2. UI改为视觉小说风格（日系Galgame），外部保持门户框架，内部独立主题
3. 角色立绘用ASCII/像素画，交互改为多轮对话选择
4. 门户→游戏有过渡动画
5. 内容量翻3-5倍（标签翻倍、台词接入引擎、疾病增加、伙伴背景、随机事件）

### Interview Summary
- 视觉风格：视觉小说（ASCII/像素画立绘 + 对话框 + 选项按钮）
- 交互：多轮对话选择替代直接行动按钮
- 机制：难度递增 + 试纸补充 + 随机事件 + 成就/结局收集
- 内容：大幅扩充，3-5倍体量
- 过渡：门户→游戏有过渡动画

### Metis Review (gaps addressed)
- **Guardrail**: 保持引擎纯TS无React依赖的设计原则，UI层不侵入引擎
- **Guardrail**: 新增引擎模块必须包含确定性RNG支持，确保可测试
- **Scope risk**: 内容创作（对话文本/事件文本）容易无限膨胀 → 限制首批内容量，留扩展接口
- **Edge case**: 多轮对话中的状态一致性 → 对话系统必须基于引擎state而非UI state
- **LSP errors**: 现有代码有5处需修复（missing type prop, array index key, static div click）

## Work Objectives
### Core Objective
将月抛模拟器升级为视觉小说风格的完整游戏体验，包含多轮对话、随机事件、成就系统和丰富的内容。

### Deliverables
1. 视觉小说UI组件套件（对话框、立绘区、选项按钮、场景背景）
2. 多轮对话系统（引擎层 + UI层）
3. 扩充数据文件（标签、台词、疾病、伙伴模板、随机事件）
4. 新引擎模块（事件系统、成就系统、难度递增、试纸补充）
5. 门户→游戏过渡动画
6. 修复现有LSP错误
7. 扩展测试覆盖

### Definition of Done
- `npm run build` 零错误
- `npm run test:unit` 全部通过，新增测试覆盖新模块
- 游戏可从门户完整流程玩到结局
- 视觉小说风格UI与门户风格明确区分
- 过渡动画流畅（无闪烁）

### Must Have
- ASCII/像素画角色立绘（每个伙伴有独特外观描述）
- 多轮对话选择（每回合有2-3个对话选项影响后续）
- 对话框UI（底部对话框 + 角色名 + 文字逐字显示效果）
- 选项按钮UI（视觉小说风格的选择按钮）
- 随机事件系统（每回合有概率触发）
- 成就/结局追踪
- 返回首页按钮（门户壳）
- 过渡动画

### Must NOT Have
- AI生成的图片（不依赖外部图片服务）
- 门户主题变量的直接复用（游戏有自己的CSS变量体系）
- 引擎代码中的React依赖
- `as any` 类型强转
- 硬编码的中文文案（对话文本走数据层）

## Verification Strategy
- Test decision: tests-after for UI + 扩展现有引擎测试
- QA policy: 每个任务有agent可执行的QA场景
- Evidence: .sisyphus/evidence/task-{N}-{slug}.{ext}

## Execution Strategy
### Parallel Execution Waves

**Wave 1: Foundation (4 tasks)**
- 数据层扩充（标签、疾病、台词、事件模板）
- 现有LSP错误修复
- 游戏CSS变量体系设计
- 成就/结局类型定义

**Wave 2: Engine Expansion (4 tasks)**
- 对话系统引擎
- 随机事件系统引擎
- 难度递增 + 试纸补充机制
- 成就系统引擎

**Wave 3: UI Core (4 tasks)**
- 视觉小说对话框组件
- ASCII立绘区组件
- 选项按钮组件
- 过渡动画

**Wave 4: UI Assembly (3 tasks)**
- GameContainer重构（壳+内核架构）
- 多轮对话流程UI
- 成就/结局展示UI

**Wave 5: Integration & Polish (3 tasks)**
- 全流程集成
- 数据内容填充
- 测试扩展

### Dependency Matrix
- Task 1-4 (Wave 1): 无依赖，全部并行
- Task 5 (对话引擎): 依赖 Task 1（数据）
- Task 6 (事件引擎): 依赖 Task 1（数据）
- Task 7 (难度/试纸): 依赖 Task 1（CONFIG数据）
- Task 8 (成就引擎): 依赖 Task 4（类型）
- Task 9 (对话框): 依赖 Task 3（CSS变量）
- Task 10 (立绘区): 依赖 Task 3（CSS变量）
- Task 11 (选项按钮): 依赖 Task 3（CSS变量）
- Task 12 (过渡动画): 依赖 Task 3（CSS变量）
- Task 13 (GameContainer重构): 依赖 Task 5,9,10,11,12
- Task 14 (对话流程UI): 依赖 Task 5,13
- Task 15 (成就展示UI): 依赖 Task 8,13
- Task 16 (全流程集成): 依赖 Task 13,14,15
- Task 17 (内容填充): 依赖 Task 5,6（引擎接口）
- Task 18 (测试扩展): 依赖 Task 5,6,7,8

### Agent Dispatch Summary
- Wave 1: 4 tasks → quick, quick, visual-engineering, quick
- Wave 2: 4 tasks → deep, deep, deep, deep
- Wave 3: 4 tasks → visual-engineering, visual-engineering, visual-engineering, visual-engineering
- Wave 4: 3 tasks → visual-engineering, visual-engineering, visual-engineering
- Wave 5: 3 tasks → unspecified-high, writing, deep

## TODOs

### Wave 1: Foundation

- [x] 1. 扩充游戏数据层

  **What to do**:
  - `src/game/data/tags.ts`: 将 ALL_TAGS 从 66 行扩充到 ~150 行，新增标签类别（外貌描述类、性格特质类、行为偏好类、背景线索类），每个标签保留 riskMap、constraint、clues、hiddenChance、safeChance、colorClass 字段
  - `src/game/data/diseases.ts`: 从 4 种疾病扩充到 7 种，新增 3 种真实疾病条目（保留 name、riskType、desc、transmission、severity 字段）
  - `src/game/data/flirtLines.ts`: 从 14 条扩充到 ~60 条，分类为：初次搭讪(10)、暧昧期(15)、深入交流(15)、危险信号(10)、安全信号(10)。增加字段：category、conditions（触发条件，如"标签包含'大学生'"）
  - `src/game/data/partners.ts` (新文件): 创建伙伴模板系统，定义 10-15 个伙伴模板（背景故事、默认标签组合、性格倾向、对话风格）。每个模板包含：templateId、name、backstory、defaultTags、personality、dialogStyle、asciiPortrait（ASCII字符画描述）
  - `src/game/data/events.ts` (新文件): 创建随机事件模板，定义 10-15 个事件（前任出现、朋友警告、网络约炮推荐、体检广告、安全套促销、深夜冲动等）。每个事件包含：eventId、title、description、choices（2-3个选项）、effects（对各数值的影响）、triggerCondition、priority

  **Must NOT do**: 不创建超过 20 个伙伴模板或 20 个事件（控制首批范围），不使用外部图片URL

  **Recommended Agent Profile**:
  - Category: `writing` - Reason: 大量中文文案创作
  - Skills: [] - 不需要特殊技能
  - Omitted: [] -

  **Parallelization**: Can Parallel: YES | Wave 1 | Blocks: [5, 6, 7, 17] | Blocked By: []

  **References**:
  - Pattern: `src/game/data/tags.ts:1-66` - 现有标签格式和字段结构
  - Pattern: `src/game/data/diseases.ts:1-10` - 现有疾病格式
  - Pattern: `src/game/data/flirtLines.ts:1-14` - 现有台词格式
  - Pattern: `src/game/types.ts:1-76` - Partner、Tag、Disease 类型定义
  - Type: `src/game/types.ts:Tag` - 标签类型约束
  - Type: `src/game/types.ts:Partner` - 伙伴类型约束
  - Type: `src/game/types.ts:Disease` - 疾病类型约束
  - Type: `src/game/types.ts:PartnerTag` - 伙伴标签类型

  **Acceptance Criteria**:
  - [ ] `tags.ts` 包含 ≥30 个标签定义
  - [ ] `diseases.ts` 包含 ≥7 种疾病
  - [ ] `flirtLines.ts` 包含 ≥50 条台词且每条有 category 字段
  - [ ] `partners.ts` 包含 ≥10 个伙伴模板
  - [ ] `events.ts` 包含 ≥10 个事件模板
  - [ ] 所有新数据文件的类型与 `types.ts` 兼容
  - [ ] `npm run build` 通过

  **QA Scenarios**:
  ```
  Scenario: 数据文件完整性
    Tool: Bash
    Steps: 运行 `npx tsc --noEmit` 检查类型错误
    Expected: 零错误
    Evidence: .sisyphus/evidence/task-1-data-layer.txt

  Scenario: 数据量验证
    Tool: Bash
    Steps: 用 grep 统计各文件条目数量
    Expected: tags≥30, diseases≥7, flirtLines≥50, partners≥10, events≥10
    Evidence: .sisyphus/evidence/task-1-data-counts.txt
  ```

  **Commit**: YES | Message: `feat(game): expand data layer with partner templates, events, and enriched content` | Files: [src/game/data/tags.ts, src/game/data/diseases.ts, src/game/data/flirtLines.ts, src/game/data/partners.ts, src/game/data/events.ts]

- [x] 2. 修复现有LSP错误

  **What to do**:
  - `src/components/moon-throw/StatsPanel.tsx:58`: 将 `<div onClick>` 改为 `<button type="button" onClick>`（修复 static element interactive 错误）
  - `src/components/moon-throw/FeedbackModal.tsx:69,77,101`: 三个 `<button>` 添加 `type="button"`
  - `src/components/moon-throw/PartnerCard.tsx:52`: 将 `key={...idx}` 改为 `key={tag.text + '-' + idx}` 或使用 tag.id（修复 array index as key）
  - `src/components/moon-throw/HistoryPanel.tsx:24`: 将 `key={idx}` 改为 `key={item.avatar + '-' + idx}`
  - `src/hooks/useGameState.ts:74`: 移除 `as any` 强转，使用正确的类型断言

  **Must NOT do**: 不改变任何组件的功能逻辑，只修复类型和可访问性

  **Recommended Agent Profile**:
  - Category: `quick` - Reason: 小范围修复，<10行改动
  - Skills: [] -
  - Omitted: [] -

  **Parallelization**: Can Parallel: YES | Wave 1 | Blocks: [] | Blocked By: []

  **References**:
  - Pattern: `src/components/moon-throw/StatsPanel.tsx:58-75` - 需改为button的div
  - Pattern: `src/components/moon-throw/FeedbackModal.tsx:69,77,101` - 缺少type的button
  - Pattern: `src/components/moon-throw/PartnerCard.tsx:52` - index作为key
  - Pattern: `src/components/moon-throw/HistoryPanel.tsx:24` - index作为key
  - Pattern: `src/hooks/useGameState.ts:74` - as any强转

  **Acceptance Criteria**:
  - [ ] `npx tsc --noEmit` 零错误
  - [ ] LSP诊断面板无 ERROR 级别提示
  - [ ] 所有改动为纯类型/可访问性修复，无功能变更

  **QA Scenarios**:
  ```
  Scenario: TypeScript编译检查
    Tool: Bash
    Steps: 运行 `npx tsc --noEmit`
    Expected: 零错误输出
    Evidence: .sisyphus/evidence/task-2-lsp-fix.txt

  Scenario: 现有测试不回归
    Tool: Bash
    Steps: 运行 `npm run test:unit`
    Expected: 所有测试通过
    Evidence: .sisyphus/evidence/task-2-tests.txt
  ```

  **Commit**: YES | Message: `fix(game): resolve LSP errors - button types, key props, type assertions` | Files: [src/components/moon-throw/StatsPanel.tsx, src/components/moon-throw/FeedbackModal.tsx, src/components/moon-throw/PartnerCard.tsx, src/components/moon-throw/HistoryPanel.tsx, src/hooks/useGameState.ts]

- [x] 3. 设计游戏CSS变量体系和主题文件

  **What to do**:
  - 创建 `src/styles/game.css` — 游戏独立CSS变量体系，不依赖门户的 `--bg-primary` 等变量
  - 定义游戏专属CSS变量：
    - `--vn-bg`: 游戏背景色（深紫黑 #0d0a1a）
    - `--vn-text`: 对话文本色（浅米白 #e8e0d0）
    - `--vn-name`: 角色名颜色（柔粉 #f0a0b0）
    - `--vn-accent`: 强调色（淡紫 #b8a0d8）
    - `--vn-choice-bg`: 选项背景（半透明深色）
    - `--vn-choice-hover`: 选项悬停（发光边框）
    - `--vn-dialogue-bg`: 对话框背景（渐变黑）
    - `--vn-portrait-bg`: 立绘区背景（微光）
    - `--vn-border`: 边框色（淡紫半透明）
    - `--vn-success`: 安全信号（柔绿 #a0d8a0）
    - `--vn-danger`: 危险信号（柔红 #e0a0a0）
    - `--vn-warning`: 警告信号（柔黄 #e0d0a0）
  - 定义游戏字体：对话框用系统字体（非Monaco，视觉小说风格），ASCII立绘用等宽字体
  - 定义对话框样式：底部半透明黑底 + 圆角 + 角色名标签 + 文字区域
  - 定义选项按钮样式：2-3个并排，hover发光效果，选中后高亮
  - 定义ASCII立绘区样式：居中大字，带微光背景动画
  - 定义场景背景样式：支持渐变背景模拟不同场景（酒吧/卧室/公园/诊所等）
  - 在 `MoonThrow.tsx` 中引入 `game.css`
  - 在 `MoonThrow.tsx` 外层添加返回首页按钮（门户壳）

  **Must NOT do**: 不修改 `globals.css` 或 `_theme-atmosphere.css`，不使用门户CSS变量

  **Recommended Agent Profile**:
  - Category: `visual-engineering` - Reason: 视觉小说风格CSS设计
  - Skills: [`frontend-design`] - 视觉小说风格需要高质量设计
  - Omitted: [] -

  **Parallelization**: Can Parallel: YES | Wave 1 | Blocks: [9, 10, 11, 12] | Blocked By: []

  **References**:
  - Pattern: `src/styles/globals.css` - 现有CSS变量定义模式
  - Pattern: `src/styles/pages/_theme-atmosphere.css` - 现有主题氛围CSS参考
  - Pattern: `src/pages/MoonThrow.tsx:1-9` - 需要添加CSS引入和壳组件
  - Reference: 日系视觉小说配色参考（深紫+米白+柔粉色调）

  **Acceptance Criteria**:
  - [ ] `src/styles/game.css` 存在且定义了所有必需的CSS变量
  - [ ] `MoonThrow.tsx` 引入了 `game.css`
  - [ ] `MoonThrow.tsx` 有返回首页按钮
  - [ ] 所有CSS变量有合理的fallback值
  - [ ] `npm run build` 通过

  **QA Scenarios**:
  ```
  Scenario: CSS文件存在且有效
    Tool: Bash
    Steps: 检查 game.css 文件存在且有CSS变量定义
    Expected: 文件存在，包含 --vn-* 变量
    Evidence: .sisyphus/evidence/task-3-game-css.txt

  Scenario: 构建通过
    Tool: Bash
    Steps: 运行 `npm run build`
    Expected: 构建成功，无CSS相关错误
    Evidence: .sisyphus/evidence/task-3-build.txt
  ```

  **Commit**: YES | Message: `feat(game): add visual novel CSS variable system and game shell` | Files: [src/styles/game.css, src/pages/MoonThrow.tsx]

- [x] 4. 定义成就/结局类型系统

  **What to do**:
  - 在 `src/game/types.ts` 中新增类型：
    - `Achievement`: { id, name, description, icon, condition, unlocked }
    - `GameEnding`: { id, name, description, icon, condition }
    - `GameAchievements`: { unlocked: string[], endingsSeen: string[], stats: Record<string, number> }
  - 在 `src/game/data/achievements.ts` (新文件) 中定义成就列表（10-15个）：
    - "谨慎玩家"：整局未进行无套行为
    - "社交达人"：与≥10个伙伴互动
    - "幸运儿"：进行≥5次高危行为未被感染
    - "信息收集者"：揭示所有伙伴的所有隐藏标签
    - "体检常客"：去医院≥3次
    - "孤狼"：拒绝≥5次
    - "首次幸存"：首次通关（健康）
    - "糟糕的觉醒"：首次遭遇"糟糕的胜利"
    - "速度选手"：在≤5回合内通关
    - "拖延症患者"：存活≥20回合
  - 在 `src/game/data/endings.ts` (新文件) 中定义结局列表：
    - 已有：幸存者、糟糕的胜利、欲火焚身、精神崩溃、确诊感染
    - 新增：秘密携带者（全程未发现感染但已感染）、完美主义（零焦虑通关）、极限求生（anxiety达到99后恢复并通关）
  - 在 GameState 类型中添加 `achievements: GameAchievements` 字段
  - 更新 `createInitialState()` 包含空的 achievements

  **Must NOT do**: 不实现成就的解锁逻辑（只定义类型和数据），不超过 15 个成就

  **Recommended Agent Profile**:
  - Category: `quick` - Reason: 类型定义和数据，不涉及复杂逻辑
  - Skills: [] -
  - Omitted: [] -

  **Parallelization**: Can Parallel: YES | Wave 1 | Blocks: [8] | Blocked By: []

  **References**:
  - Pattern: `src/game/types.ts:1-76` - 现有类型定义
  - Pattern: `src/game/types.ts:GameState` - 需要扩展的类型
  - Pattern: `src/game/engine/state.ts:1-15` - 需要更新的初始化函数

  **Acceptance Criteria**:
  - [ ] `types.ts` 包含 Achievement、GameEnding、GameAchievements 类型
  - [ ] `achievements.ts` 包含 ≥10 个成就定义
  - [ ] `endings.ts` 包含 ≥7 个结局定义
  - [ ] `GameState` 包含 achievements 字段
  - [ ] `npm run build` 通过

  **QA Scenarios**:
  ```
  Scenario: 类型定义完整
    Tool: Bash
    Steps: 运行 `npx tsc --noEmit`
    Expected: 零错误
    Evidence: .sisyphus/evidence/task-4-types.txt
  ```

  **Commit**: YES | Message: `feat(game): add achievement and ending type system with data definitions` | Files: [src/game/types.ts, src/game/engine/state.ts, src/game/data/achievements.ts, src/game/data/endings.ts]

### Wave 2: Engine Expansion

- [ ] 5. 实现多轮对话系统引擎

  **What to do**:
  - 创建 `src/game/engine/dialogue.ts` — 对话系统核心
  - 对话数据结构：
    - `DialogueNode`: { id, speaker('player'|'partner'|'narrator'), text, choices?: DialogueChoice[], nextNodeId?: string, effects?: DialogueEffects, revealTag?: string }
    - `DialogueChoice`: { text, nextNodeId, effects?: DialogueEffects, condition?: (state, partner) => boolean }
    - `DialogueEffects`: { frustration?: number, anxiety?: number, items?: Partial<InventoryItems>, revealTag?: string }
    - `DialogueTree`: { id, nodes: Map<string, DialogueNode>, startNodeId: string }
  - 创建 `src/game/data/dialogues.ts` — 预设对话树
    - 初次见面对话树（3-5个节点，含2-3个选择分支）
    - 深入交流对话树（4-6个节点，选择影响标签揭示）
    - 危险信号对话树（选择是否冒险）
    - 拒绝场景对话树（礼貌/直接拒绝）
    - 医院场景对话树（检查流程）
  - 实现引擎函数：
    - `startDialogue(state, treeId)`: 返回新的 state + 当前对话节点
    - `chooseOption(state, choiceIndex)`: 应用选择效果，推进到下一节点
    - `getCurrentNode(state)`: 获取当前对话节点
    - `isDialogueActive(state)`: 是否在对话中
    - `endDialogue(state)`: 结束对话，结算效果
  - 对话选择可以触发：标签揭示、数值变化、物品获取、进入行动
  - 更新 `useGameState.ts` 添加对话相关的 reducer actions：START_DIALOGUE, CHOOSE_OPTION, END_DIALOGUE
  - 接入 FLIRT_LINES：在初次见面对话中随机使用 flirtLines 作为伙伴台词
  - 对话结束后，根据对话内容自动决定是否进入行动阶段或回到伙伴选择

  **Must NOT do**: 不在引擎中使用 React hooks，不硬编码中文文案（走数据层），不超过 6 个预设对话树

  **Recommended Agent Profile**:
  - Category: `deep` - Reason: 新的引擎模块，需要仔细的状态管理设计
  - Skills: [] -
  - Omitted: [] -

  **Parallelization**: Can Parallel: NO | Wave 2 | Blocks: [14] | Blocked By: [1]

  **References**:
  - Pattern: `src/game/engine/chat.ts:1-12` - 现有聊天逻辑（将被对话系统替代/扩展）
  - Pattern: `src/game/engine/actions.ts:1-141` - 现有行动效果模式
  - Pattern: `src/game/engine/rng.ts:1-18` - RNG使用模式
  - Type: `src/game/types.ts:GameState` - 需要添加 dialogueState 字段
  - Type: `src/game/types.ts:Partner` - 对话系统需要读取伙伴标签
  - Data: `src/game/data/flirtLines.ts` - 需要接入的台词数据
  - Data: `src/game/data/partners.ts` - 伙伴模板的对话风格字段
  - Hook: `src/hooks/useGameState.ts:90-328` - reducer模式参考

  **Acceptance Criteria**:
  - [ ] `dialogue.ts` 导出 startDialogue, chooseOption, getCurrentNode, isDialogueActive, endDialogue
  - [ ] `dialogues.ts` 包含 ≥5 个对话树
  - [ ] useGameState 支持对话相关的 dispatch actions
  - [ ] 对话选择可以修改 frustration/anxiety/items
  - [ ] 对话可以选择性揭示伙伴标签
  - [ ] `npm run build` 通过
  - [ ] `npm run test:unit` 通过

  **QA Scenarios**:
  ```
  Scenario: 对话流程完整性
    Tool: Bash
    Steps: 运行 `npm run test:unit -- --grep "dialogue"`
    Expected: 对话相关测试通过
    Evidence: .sisyphus/evidence/task-5-dialogue-engine.txt

  Scenario: 对话效果应用
    Tool: Bash
    Steps: 检查对话选择效果是否正确修改state
    Expected: frustration/anxiety/items 按预期变化
    Evidence: .sisyphus/evidence/task-5-dialogue-effects.txt
  ```

  **Commit**: YES | Message: `feat(game): implement multi-turn dialogue system engine with preset dialogue trees` | Files: [src/game/engine/dialogue.ts, src/game/data/dialogues.ts, src/game/types.ts, src/game/engine/index.ts, src/hooks/useGameState.ts]

- [ ] 6. 实现随机事件系统引擎

  **What to do**:
  - 创建 `src/game/engine/events.ts` — 事件系统核心
  - 事件处理函数：
    - `checkEventTrigger(state, rng)`: 每回合开始时检查是否有事件触发（基于 turn、frustration、anxiety 等条件）
    - `applyEventChoice(state, event, choiceIndex, rng)`: 应用事件选择效果
    - `getActiveEvent(state)`: 获取当前活跃事件
    - `dismissEvent(state)`: 关闭事件
  - 事件触发逻辑：
    - 基础概率：每回合 20% 概率检查事件
    - 条件筛选：根据当前 state 筛选可触发事件
    - 优先级排序：高优先级事件优先触发
    - 冷却机制：同一事件不会连续触发
  - 更新 GameState 添加 `activeEvent` 字段
  - 更新 `useGameState.ts` 添加事件相关 reducer actions：TRIGGER_EVENT, CHOOSE_EVENT_OPTION, DISMISS_EVENT
  - 事件在"换伙伴"（NEXT_PARTNER）时触发检查
  - 事件选择效果可以：修改 frustration/anxiety、给予/消耗 items、揭示信息、触发特殊对话

  **Must NOT do**: 不在引擎中使用 React，事件效果不超过 3 个选项

  **Recommended Agent Profile**:
  - Category: `deep` - Reason: 新引擎模块，概率和状态管理
  - Skills: [] -
  - Omitted: [] -

  **Parallelization**: Can Parallel: YES | Wave 2 | Blocks: [17] | Blocked By: [1]

  **References**:
  - Pattern: `src/game/engine/actions.ts:1-141` - 效果应用模式
  - Pattern: `src/game/engine/rng.ts:1-18` - RNG使用模式
  - Type: `src/game/types.ts:GameState` - 需要添加 activeEvent 字段
  - Data: `src/game/data/events.ts` - 事件模板数据（Task 1创建）
  - Hook: `src/hooks/useGameState.ts:90-328` - reducer模式

  **Acceptance Criteria**:
  - [ ] `events.ts` 导出 checkEventTrigger, applyEventChoice, getActiveEvent, dismissEvent
  - [ ] 事件基于 turn/条件概率触发
  - [ ] 同一事件不会连续触发
  - [ ] useGameState 支持事件 dispatch
  - [ ] `npm run build` 通过

  **QA Scenarios**:
  ```
  Scenario: 事件触发概率
    Tool: Bash
    Steps: 运行 `npm run test:unit -- --grep "event"`
    Expected: 事件相关测试通过
    Evidence: .sisyphus/evidence/task-6-events-engine.txt
  ```

  **Commit**: YES | Message: `feat(game): implement random event system engine with conditional triggers` | Files: [src/game/engine/events.ts, src/game/types.ts, src/game/engine/index.ts, src/hooks/useGameState.ts]

- [x] 7. 实现难度递增和试纸补充机制

  **What to do**:
  - 修改 `src/game/data/config.ts`：
    - 添加难度参数：`difficultyScale: number`（每回合增长系数）
    - 添加试纸补充规则：`testkitRewardConditions` — 定义哪些行为奖励试纸
    - 修改 `chatCost` 为动态值（基于 turn 递增）
  - 修改 `src/game/engine/partner.ts`：
    - `generatePartner(rng, turn)`: 随着回合数增加，伙伴携带疾病的概率上升
    - 回合≥5：疾病概率 +10%；回合≥10：+20%；回合≥15：+30%
    - 隐藏标签比例随回合增加
  - 修改 `src/game/engine/actions.ts`：
    - 拒绝行为有概率奖励试纸（30%概率，回合≥3后）
    - 医院检查后如果为阴性，奖励 1 个试纸
  - 修改 `src/game/engine/state.ts`：
    - 添加 `difficulty: number` 字段到 GameState
    - createInitialState 设置 difficulty = 1

  **Must NOT do**: 不改变现有游戏的核心平衡（初始frustration=50不变），不超过 3 个CONFIG新字段

  **Recommended Agent Profile**:
  - Category: `deep` - Reason: 涉及多个引擎文件的协调修改
  - Skills: [] -
  - Omitted: [] -

  **Parallelization**: Can Parallel: YES | Wave 2 | Blocks: [] | Blocked By: [1]

  **References**:
  - Pattern: `src/game/data/config.ts:1-22` - 现有CONFIG
  - Pattern: `src/game/engine/partner.ts:1-75` - 伙伴生成逻辑
  - Pattern: `src/game/engine/actions.ts:1-141` - 行动效果逻辑
  - Pattern: `src/game/engine/state.ts:1-15` - 状态初始化
  - Type: `src/game/types.ts:GameState` - 需要添加 difficulty 字段

  **Acceptance Criteria**:
  - [ ] partner.ts 的 generatePartner 接受 turn 参数
  - [ ] 疾病概率随回合递增
  - [ ] 拒绝行为可奖励试纸
  - [ ] 医院阴性后奖励试纸
  - [ ] 现有测试不回归
  - [ ] `npm run test:unit` 通过

  **QA Scenarios**:
  ```
  Scenario: 现有测试不回归
    Tool: Bash
    Steps: 运行 `npm run test:unit`
    Expected: 所有测试通过
    Evidence: .sisyphus/evidence/task-7-difficulty-tests.txt
  ```

  **Commit**: YES | Message: `feat(game): add difficulty progression and testkit refill mechanics` | Files: [src/game/data/config.ts, src/game/engine/partner.ts, src/game/engine/actions.ts, src/game/engine/state.ts, src/game/types.ts]

- [x] 8. 实现成就系统引擎

  **What to do**:
  - 创建 `src/game/engine/achievements.ts`
  - 实现函数：
    - `checkAchievements(state)`: 检查所有成就条件，返回新解锁的成就列表
    - `unlockAchievement(state, achievementId)`: 标记成就已解锁
    - `checkEnding(state)`: 检查是否触发特殊结局（扩展 checkGameOver）
    - `getUnlockedAchievements(state)`: 获取已解锁成就列表
    - `getSeenEndings(state)`: 获取已见结局列表
  - 成就检查时机：
    - 每次行动后（TAKE_ACTION）
    - 对话结束后（END_DIALOGUE）
    - 事件选择后（CHOOSE_EVENT_OPTION）
    - 游戏结束时
  - 结局检查：扩展现有的 checkGameOver，增加对"秘密携带者"等特殊结局的检测
  - 使用 localStorage 持久化成就和结局数据（跨周目保留）
  - 更新 useGameState 添加成就检查逻辑

  **Must NOT do**: 不使用服务端存储，不超过 15 个成就条件检查

  **Recommended Agent Profile**:
  - Category: `deep` - Reason: 状态管理和持久化逻辑
  - Skills: [] -
  - Omitted: [] -

  **Parallelization**: Can Parallel: YES | Wave 2 | Blocks: [15] | Blocked By: [4]

  **References**:
  - Pattern: `src/game/engine/game-over.ts:1-29` - 现有结局检查逻辑
  - Type: `src/game/types.ts:GameState` - 需要读取的state字段
  - Data: `src/game/data/achievements.ts` - 成就定义（Task 4创建）
  - Data: `src/game/data/endings.ts` - 结局定义（Task 4创建）
  - Hook: `src/hooks/useGameState.ts` - 需要在reducer中调用检查

  **Acceptance Criteria**:
  - [ ] `achievements.ts` 导出所有必需函数
  - [ ] 成就在正确时机被检查
  - [ ] 成就/结局数据持久化到 localStorage
  - [ ] `npm run build` 通过

  **QA Scenarios**:
  ```
  Scenario: 成就持久化
    Tool: Bash
    Steps: 运行 `npm run test:unit -- --grep "achievement"`
    Expected: 测试通过
    Evidence: .sisyphus/evidence/task-8-achievements.txt
  ```

  **Commit**: YES | Message: `feat(game): implement achievement and ending tracking system with localStorage persistence` | Files: [src/game/engine/achievements.ts, src/game/engine/index.ts, src/hooks/useGameState.ts]

### Wave 3: UI Core Components

- [ ] 9. 创建视觉小说对话框组件

  **What to do**:
  - 创建 `src/components/moon-throw/VNDialogueBox.tsx`
  - 组件结构：
    - 底部固定定位的全宽对话框
    - 左上角角色名标签（使用 `--vn-name` 颜色）
    - 对话文本区域（使用 `--vn-text` 颜色，`--vn-dialogue-bg` 背景）
    - 文字逐字显示效果（typewriter effect），每字间隔 30-50ms
    - 点击可跳过逐字显示，直接显示全文
    - 点击全文后再点击进入下一句/显示选项
  - Props: `{ speaker, text, onComplete, onSkip, isVisible }`
  - 动画：对话框从底部滑入（framer-motion），文本出现时有淡入效果
  - 支持旁白模式（speaker='narrator'时，对话框样式不同：居中、无角色名、斜体）
  - 支持系统消息模式（speaker='system'时，对话框变为提示条样式）

  **Must NOT do**: 不使用第三方打字机效果库，自己实现（<100行），不硬编码颜色值

  **Recommended Agent Profile**:
  - Category: `visual-engineering` - Reason: 视觉小说核心UI组件，需要高质量动画
  - Skills: [`frontend-design`] - 视觉小说对话框需要精致的动效设计
  - Omitted: [] -

  **Parallelization**: Can Parallel: YES | Wave 3 | Blocks: [13, 14] | Blocked By: [3]

  **References**:
  - Pattern: `src/components/moon-throw/FeedbackModal.tsx:1-115` - 现有模态框动画参考
  - Pattern: `src/components/moon-throw/PartnerCard.tsx:1-79` - AnimatePresence使用参考
  - CSS: `src/styles/game.css` - 游戏CSS变量（Task 3创建）

  **Acceptance Criteria**:
  - [ ] 组件支持 speaker/text/onComplete/onSkip/isVisible props
  - [ ] 文字逐字显示效果（30-50ms间隔）
  - [ ] 点击跳过逐字显示
  - [ ] 旁白/系统消息模式样式区分
  - [ ] 对话框从底部滑入动画
  - [ ] 使用 game.css 中的 CSS 变量
  - [ ] `npm run build` 通过

  **QA Scenarios**:
  ```
  Scenario: 对话框渲染
    Tool: Bash
    Steps: 运行 `npm run build`
    Expected: 构建成功
    Evidence: .sisyphus/evidence/task-9-dialogue-box.txt

  Scenario: 组件导出
    Tool: Bash
    Steps: 检查组件文件存在且正确导出
    Expected: VNDialogueBox 组件存在
    Evidence: .sisyphus/evidence/task-9-export.txt
  ```

  **Commit**: YES | Message: `feat(game): add visual novel dialogue box component with typewriter effect` | Files: [src/components/moon-throw/VNDialogueBox.tsx]

- [ ] 10. 创建ASCII立绘区组件

  **What to do**:
  - 创建 `src/components/moon-throw/VNPortrait.tsx`
  - 组件结构：
    - 游戏上半部分的立绘展示区
    - 中央大号ASCII/像素画字符（4-6行，每行20-30字符）
    - 伙伴头像用更大的emoji显示在ASCII画上方
    - 标签以小标签形式排列在立绘下方（复用现有的标签展示逻辑，但用游戏主题色）
    - 检测试纸结果时显示红色⚠️徽章
    - 恐慌模式下立绘有抖动/模糊效果
  - ASCII肖像模板（根据伙伴模板的 asciiPortrait 字段渲染）：
    ```
    ╭──────────╮
    │  ○    ○  │
    │    ──    │
    │   ╰──╯   │
    │  /    \  │
    ╰──────────╯
    ```
  - 不同伙伴类型有不同的ASCII画风格（长发/短发/戴眼镜/帽子等通过字符差异表示）
  - 背景使用 `--vn-portrait-bg` 渐变，带微妙的呼吸光效动画

  **Must NOT do**: 不使用外部图片，ASCII画不超过 8 行高度，不硬编码颜色

  **Recommended Agent Profile**:
  - Category: `visual-engineering` - Reason: ASCII艺术组件需要创意设计
  - Skills: [`frontend-design`] - ASCII艺术需要视觉设计感
  - Omitted: [] -

  **Parallelization**: Can Parallel: YES | Wave 3 | Blocks: [13] | Blocked By: [3]

  **References**:
  - Pattern: `src/components/moon-throw/PartnerCard.tsx:1-79` - 现有伙伴卡片逻辑
  - Pattern: `src/components/moon-throw/PartnerCard.tsx:31-38` - 头像和徽章逻辑
  - Data: `src/game/data/partners.ts` - asciiPortrait 字段（Task 1创建）
  - CSS: `src/styles/game.css` - CSS变量

  **Acceptance Criteria**:
  - [ ] 组件接受 partner/isPanic/showDangerBadge/flirtLine props
  - [ ] ASCII肖像根据伙伴模板渲染
  - [ ] 标签使用游戏主题色显示
  - [ ] 恐慌模式有视觉反馈
  - [ ] `npm run build` 通过

  **QA Scenarios**:
  ```
  Scenario: 立绘区渲染
    Tool: Bash
    Steps: 运行 `npm run build`
    Expected: 构建成功
    Evidence: .sisyphus/evidence/task-10-portrait.txt
  ```

  **Commit**: YES | Message: `feat(game): add ASCII portrait component with panic effects and tag display` | Files: [src/components/moon-throw/VNPortrait.tsx]

- [ ] 11. 创建视觉小说选项按钮组件

  **What to do**:
  - 创建 `src/components/moon-throw/VNChoices.tsx`
  - 组件结构：
    - 2-3个垂直排列的选项按钮（在对话框上方显示）
    - 每个按钮：半透明背景 + 发光边框 + hover时边框变亮
    - 选中后按钮高亮，其他淡出
    - 选项从底部依次滑入（stagger动画，每个间隔 100ms）
  - Props: `{ choices: Array<{text, id, disabled?, conditionMet?}>, onSelect, isVisible }`
  - 样式：
    - 使用 `--vn-choice-bg` 和 `--vn-choice-hover` CSS变量
    - 不可选选项灰色显示（disabled状态）
    - 条件不满足的选项用虚线边框+提示文字
  - 支持"对话选项"和"行动选项"两种模式：
    - 对话选项：文字描述（如"你看起来很紧张"）
    - 行动选项：带emoji和风险等级标识（如"🔥 无套性交 [高风险]"）

  **Must NOT do**: 不超过 4 个选项按钮，不硬编码颜色

  **Recommended Agent Profile**:
  - Category: `visual-engineering` - Reason: 选项按钮是视觉小说的核心交互
  - Skills: [`frontend-design`] - 选项按钮需要精致的设计
  - Omitted: [] -

  **Parallelization**: Can Parallel: YES | Wave 3 | Blocks: [13, 14] | Blocked By: [3]

  **References**:
  - Pattern: `src/components/moon-throw/ActionButtons.tsx:1-89` - 现有按钮逻辑参考
  - Pattern: `src/components/moon-throw/ActionButtons.tsx:54-77` - 2x2网格按钮
  - CSS: `src/styles/game.css` - CSS变量

  **Acceptance Criteria**:
  - [ ] 组件接受 choices/onSelect/isVisible props
  - [ ] 选项依次滑入动画
  - [ ] disabled 和 conditionMet 状态视觉区分
  - [ ] 支持对话选项和行动选项两种模式
  - [ ] `npm run build` 通过

  **QA Scenarios**:
  ```
  Scenario: 选项组件渲染
    Tool: Bash
    Steps: 运行 `npm run build`
    Expected: 构建成功
    Evidence: .sisyphus/evidence/task-11-choices.txt
  ```

  **Commit**: YES | Message: `feat(game): add visual novel choice button component with stagger animations` | Files: [src/components/moon-throw/VNChoices.tsx]

- [ ] 12. 实现门户→游戏过渡动画

  **What to do**:
  - 创建 `src/components/moon-throw/VNTransition.tsx`
  - 过渡效果：全屏渐变遮罩 + 文字提示 + 淡入淡出
    - 阶段1（0-0.5s）：白色/紫色闪光遮罩从中心扩散
    - 阶段2（0.5-1.5s）：显示游戏标题"月抛模拟器"大字+副标题
    - 阶段3（1.5-2s）：标题淡出，游戏界面淡入
  - 在 `MoonThrow.tsx` 中集成过渡动画
  - 首次进入游戏显示完整过渡，从结算页返回首页时显示反向过渡
  - 使用 framer-motion 的 AnimatePresence 管理过渡状态

  **Must NOT do**: 过渡不超过 2.5 秒，不使用外部动画库

  **Recommended Agent Profile**:
  - Category: `visual-engineering` - Reason: 过渡动画需要精致的时序控制
  - Skills: [`frontend-design`] - 过渡效果需要视觉设计
  - Omitted: [] -

  **Parallelization**: Can Parallel: YES | Wave 3 | Blocks: [13] | Blocked By: [3]

  **References**:
  - Pattern: `src/components/moon-throw/IntroModal.tsx:1-51` - 现有入场动画参考
  - Pattern: `src/components/moon-throw/IntroModal.tsx:10-20` - framer-motion动画配置
  - CSS: `src/styles/game.css` - CSS变量
  - Page: `src/pages/MoonThrow.tsx` - 需要集成的页面

  **Acceptance Criteria**:
  - [ ] 过渡动画持续 2-2.5 秒
  - [ ] 有标题展示阶段
  - [ ] 使用 framer-motion
  - [ ] `npm run build` 通过

  **QA Scenarios**:
  ```
  Scenario: 过渡动画构建
    Tool: Bash
    Steps: 运行 `npm run build`
    Expected: 构建成功
    Evidence: .sisyphus/evidence/task-12-transition.txt
  ```

  **Commit**: YES | Message: `feat(game): add portal-to-game transition animation with title reveal` | Files: [src/components/moon-throw/VNTransition.tsx, src/pages/MoonThrow.tsx]

### Wave 4: UI Assembly

- [ ] 13. 重构 GameContainer（壳+内核架构）

  **What to do**:
  - 重写 `src/components/moon-throw/GameContainer.tsx`
  - 新架构：
    - **壳层**（GameShell）：返回首页按钮 + 游戏标题 + 回合数（使用门户终端风格）
    - **内核层**（GameCore）：完全使用游戏CSS变量，渲染视觉小说UI
  - GameCore 内部布局（从上到下）：
    1. 场景背景（渐变色，根据当前场景变化）
    2. ASCII立绘区（VNPortrait）
    3. 状态栏（简化版：只显示回合数 + 压抑/焦虑小条）
    4. 选项区域（VNChoices，在对话框上方）
    5. 对话框（VNDialogueBox，底部固定）
  - 状态机（phase扩展）：
    - 'intro' → 过渡动画 → 'playing' → 'dialogue' ↔ 'choices' → 'feedback' → 'playing'
    - 'event' → 事件展示 → 'choices' → 'playing'
    - 任何状态 → 'gameover'
  - 保留现有的返回首页逻辑（handleCloseFeedback → restart）
  - 移除对旧组件的直接引用（StatsPanel、PartnerCard、ActionButtons、IntroModal、HelpModal），替换为新组件
  - 保留 HelpModal 和 FeedbackModal（可能需要样式适配）

  **Must NOT do**: 不破坏 useGameState hook 的接口，不改变引擎逻辑

  **Recommended Agent Profile**:
  - Category: `visual-engineering` - Reason: 核心布局重构，需要精确的视觉层次
  - Skills: [`frontend-design`] - 布局设计
  - Omitted: [] -

  **Parallelization**: Can Parallel: NO | Wave 4 | Blocks: [14, 15, 16] | Blocked By: [5, 9, 10, 11, 12]

  **References**:
  - Pattern: `src/components/moon-throw/GameContainer.tsx:1-98` - 现有GameContainer
  - Pattern: `src/hooks/useGameState.ts:337-395` - useGameState返回值
  - Component: `src/components/moon-throw/VNDialogueBox.tsx` - 对话框
  - Component: `src/components/moon-throw/VNPortrait.tsx` - 立绘区
  - Component: `src/components/moon-throw/VNChoices.tsx` - 选项按钮
  - Component: `src/components/moon-throw/VNTransition.tsx` - 过渡动画
  - CSS: `src/styles/game.css` - 游戏CSS变量

  **Acceptance Criteria**:
  - [ ] GameContainer 使用壳+内核架构
  - [ ] 壳层有返回首页按钮
  - [ ] 内核层渲染视觉小说UI组件
  - [ ] 状态机正确流转
  - [ ] `npm run build` 通过

  **QA Scenarios**:
  ```
  Scenario: GameContainer渲染
    Tool: Bash
    Steps: 运行 `npm run build`
    Expected: 构建成功
    Evidence: .sisyphus/evidence/task-13-container.txt
  ```

  **Commit**: YES | Message: `feat(game): refactor GameContainer to shell+core architecture with VN components` | Files: [src/components/moon-throw/GameContainer.tsx]

- [ ] 14. 实现多轮对话流程UI

  **What to do**:
  - 创建 `src/components/moon-throw/VNDialogueFlow.tsx`
  - 组件职责：协调对话系统引擎和UI组件
  - 流程：
    1. 从 engine 获取当前对话节点
    2. 根据 speaker 类型选择 VNDialogueBox 的样式模式
    3. 如果节点有 choices，显示 VNChoices
    4. 如果节点是终端节点（无choices无nextNodeId），触发 onDialogueEnd
    5. 如果节点有 revealTag，触发标签揭示动画
  - 对话结束后：
    - 如果对话涉及行动（如选择了"更进一步"），进入行动选择阶段
    - 如果对话是普通交流，回到伙伴展示阶段
  - 对话中的标签揭示：当 chooseOption 揭示标签时，VNPortrait 中的标签有揭示动画
  - 行动选择阶段：显示4个行动按钮（复用 VNChoices 的行动选项模式）

  **Must NOT do**: 不在UI组件中处理游戏逻辑（全部通过useGameState dispatch）

  **Recommended Agent Profile**:
  - Category: `visual-engineering` - Reason: 对话流程是游戏的核心体验
  - Skills: [`frontend-design`] - 流程设计
  - Omitted: [] -

  **Parallelization**: Can Parallel: NO | Wave 4 | Blocks: [16] | Blocked By: [5, 13]

  **References**:
  - Engine: `src/game/engine/dialogue.ts` - 对话引擎（Task 5创建）
  - Component: `src/components/moon-throw/VNDialogueBox.tsx` - 对话框
  - Component: `src/components/moon-throw/VNChoices.tsx` - 选项按钮
  - Component: `src/components/moon-throw/VNPortrait.tsx` - 立绘区
  - Hook: `src/hooks/useGameState.ts` - 对话相关dispatch

  **Acceptance Criteria**:
  - [ ] 对话节点正确渲染到VNDialogueBox
  - [ ] 选项正确渲染到VNChoices
  - [ ] 对话结束后正确流转到下一阶段
  - [ ] 标签揭示有动画效果
  - [ ] `npm run build` 通过

  **QA Scenarios**:
  ```
  Scenario: 对话流程渲染
    Tool: Bash
    Steps: 运行 `npm run build`
    Expected: 构建成功
    Evidence: .sisyphus/evidence/task-14-dialogue-flow.txt
  ```

  **Commit**: YES | Message: `feat(game): implement visual novel dialogue flow UI with tag reveal animations` | Files: [src/components/moon-throw/VNDialogueFlow.tsx]

- [ ] 15. 实现成就/结局展示UI

  **What to do**:
  - 创建 `src/components/moon-throw/VNAchievements.tsx`
  - 成就面板（从游戏内可查看）：
    - 网格展示所有成就（已解锁/未解锁）
    - 已解锁成就有图标+名称+描述，金色边框
    - 未解锁成就显示"???"，灰色边框
  - 结局收集面板：
    - 列出所有结局（已见/未见）
    - 已见结局显示图标+名称
    - 未见结局显示剪影
  - 结算页面增强（修改 FeedbackModal 或创建新组件）：
    - 游戏结束时显示达成成就
    - 显示已解锁的新结局
    - 显示本次游戏统计（复用现有 GameStatsPanel）
  - 在 HelpModal 或新建的菜单中添加"成就"入口
  - 使用 localStorage 数据渲染已解锁的成就/结局

  **Must NOT do**: 不创建成就商店或解锁系统（纯展示），不超过 2 个新组件

  **Recommended Agent Profile**:
  - Category: `visual-engineering` - Reason: 成就展示需要精致的卡片设计
  - Skills: [`frontend-design`] - 成就卡片设计
  - Omitted: [] -

  **Parallelization**: Can Parallel: YES | Wave 4 | Blocks: [16] | Blocked By: [8, 13]

  **References**:
  - Pattern: `src/components/moon-throw/GameStatsPanel.tsx:1-66` - 现有统计面板
  - Pattern: `src/components/moon-throw/FeedbackModal.tsx:1-115` - 现有结算页面
  - Data: `src/game/data/achievements.ts` - 成就数据
  - Data: `src/game/data/endings.ts` - 结局数据
  - Engine: `src/game/engine/achievements.ts` - 成就引擎

  **Acceptance Criteria**:
  - [ ] 成就面板展示所有成就
  - [ ] 已解锁/未解锁视觉区分
  - [ ] 结局收集面板展示所有结局
  - [ ] 结算页面显示新达成的成就
  - [ ] `npm run build` 通过

  **QA Scenarios**:
  ```
  Scenario: 成就UI渲染
    Tool: Bash
    Steps: 运行 `npm run build`
    Expected: 构建成功
    Evidence: .sisyphus/evidence/task-15-achievements.txt
  ```

  **Commit**: YES | Message: `feat(game): add achievement gallery and ending collection display UI` | Files: [src/components/moon-throw/VNAchievements.tsx]

### Wave 5: Integration & Polish

- [ ] 16. 全流程集成测试和修复

  **What to do**:
  - 从门户首页开始，完整走一遍游戏流程：
    1. 门户首页 → 点击游戏入口 → 过渡动画 → 游戏界面
    2. 开始游戏 → 对话系统启动 → 多轮对话选择
    3. 行动选择 → 反馈显示 → 下一伙伴
    4. 随机事件触发 → 事件选择
    5. 试纸使用 → 医院检查
    6. 游戏结束 → 结算页面 → 成就展示
    7. 返回首页 → 反向过渡
  - 修复集成中发现的问题
  - 确保所有状态转换正确
  - 确保所有CSS变量正确生效
  - 清理不再使用的旧组件（如果已被新组件完全替代）
  - 确保过渡动画流畅无闪烁

  **Must NOT do**: 不添加新功能，只修复集成问题

  **Recommended Agent Profile**:
  - Category: `unspecified-high` - Reason: 需要全面的集成测试和修复
  - Skills: [] -
  - Omitted: [] -

  **Parallelization**: Can Parallel: NO | Wave 5 | Blocks: [F1-F4] | Blocked By: [13, 14, 15]

  **References**:
  - All previous tasks' deliverables
  - Page: `src/pages/MoonThrow.tsx` - 游戏页面入口
  - Hook: `src/hooks/useGameState.ts` - 完整的state管理

  **Acceptance Criteria**:
  - [ ] 完整游戏流程可玩
  - [ ] 过渡动画流畅
  - [ ] 所有状态转换正确
  - [ ] `npm run build` 零错误
  - [ ] `npm run test:unit` 全部通过

  **QA Scenarios**:
  ```
  Scenario: 完整构建和测试
    Tool: Bash
    Steps: 运行 `npm run build && npm run test:unit`
    Expected: 全部通过
    Evidence: .sisyphus/evidence/task-16-integration.txt
  ```

  **Commit**: YES | Message: `fix(game): integrate all VN components and fix flow issues` | Files: [varies based on fixes]

- [ ] 17. 填充游戏内容数据

  **What to do**:
  - 扩充 `src/game/data/dialogues.ts`：
    - 为每个伙伴模板创建独特的对话树（至少 3 个变体）
    - 增加场景对话：酒吧搭讪、公园偶遇、网上认识、朋友介绍等
    - 增加深入交流的对话分支（基于已揭示的标签动态变化）
  - 扩充 `src/game/data/events.ts`：
    - 为每个事件添加更丰富的描述文本和选项文本
    - 增加事件的后续影响（某些事件会影响后续回合）
  - 扩充 `src/game/data/partners.ts`：
    - 完善伙伴背景故事（每个至少 2-3 句）
    - 为每个伙伴设计独特的 ASCII 肖像变体
  - 扩充 `src/game/data/flirtLines.ts`：
    - 增加更多分类型的台词
    - 为特定伙伴类型添加专属台词（如"大学生"类型的校园相关台词）

  **Must NOT do**: 不创建超过 30 个对话树变体，每个对话树不超过 8 个节点

  **Recommended Agent Profile**:
  - Category: `writing` - Reason: 大量中文创意文案
  - Skills: [] -
  - Omitted: [] -

  **Parallelization**: Can Parallel: YES | Wave 5 | Blocks: [] | Blocked By: [5, 6]

  **References**:
  - Data: `src/game/data/dialogues.ts` - 现有对话树（Task 5创建）
  - Data: `src/game/data/events.ts` - 现有事件（Task 1创建）
  - Data: `src/game/data/partners.ts` - 现有伙伴模板（Task 1创建）
  - Data: `src/game/data/flirtLines.ts` - 现有台词（Task 1扩充）

  **Acceptance Criteria**:
  - [ ] 每个伙伴模板有独特对话变体
  - [ ] 事件有丰富的描述和选项
  - [ ] 伙伴有完整背景故事
  - [ ] `npm run build` 通过

  **QA Scenarios**:
  ```
  Scenario: 内容数据完整性
    Tool: Bash
    Steps: 运行 `npm run build`
    Expected: 构建成功
    Evidence: .sisyphus/evidence/task-17-content.txt
  ```

  **Commit**: YES | Message: `feat(game): enrich game content with unique dialogues, events, and partner stories` | Files: [src/game/data/dialogues.ts, src/game/data/events.ts, src/game/data/partners.ts, src/game/data/flirtLines.ts]

- [ ] 18. 扩展引擎测试覆盖

  **What to do**:
  - 创建/扩展以下测试文件：
    - `src/game/engine/__tests__/dialogue.test.ts`: 测试对话系统（开始对话、选择选项、效果应用、对话结束）
    - `src/game/engine/__tests__/events.test.ts`: 测试事件系统（触发条件、冷却机制、效果应用）
    - `src/game/engine/__tests__/achievements.test.ts`: 测试成就系统（解锁条件、持久化、结局检测）
    - `src/game/engine/__tests__/difficulty.test.ts`: 测试难度递增（疾病概率随回合变化、试纸奖励条件）
    - `src/game/engine/__tests__/stats.test.ts`: 测试 computeStats（覆盖率补充）
  - 每个测试文件至少 5 个测试用例
  - 使用确定性 RNG 确保测试可重现
  - 覆盖边界条件（frustration=0, anxiety=100, 空对话树等）

  **Must NOT do**: 不测试UI组件（UI由E2E覆盖），不使用真实随机数

  **Recommended Agent Profile**:
  - Category: `deep` - Reason: 引擎测试需要仔细设计用例
  - Skills: [] -
  - Omitted: [] -

  **Parallelization**: Can Parallel: YES | Wave 5 | Blocks: [] | Blocked By: [5, 6, 7, 8]

  **References**:
  - Pattern: `src/game/engine/__tests__/partner-generation.test.ts` - 现有测试模式
  - Pattern: `src/game/engine/__tests__/action-effects.test.ts` - 现有测试模式
  - Pattern: `src/game/engine/__tests__/game-over-conditions.test.ts` - 现有测试模式
  - Engine: `src/game/engine/rng.ts` - 确定性RNG

  **Acceptance Criteria**:
  - [ ] 对话系统测试 ≥5 个用例
  - [ ] 事件系统测试 ≥5 个用例
  - [ ] 成就系统测试 ≥5 个用例
  - [ ] 难度递增测试 ≥5 个用例
  - [ ] stats测试 ≥3 个用例
  - [ ] `npm run test:unit` 全部通过

  **QA Scenarios**:
  ```
  Scenario: 全部测试通过
    Tool: Bash
    Steps: 运行 `npm run test:unit`
    Expected: 所有测试通过（旧测试+新测试）
    Evidence: .sisyphus/evidence/task-18-tests.txt
  ```

  **Commit**: YES | Message: `test(game): add engine tests for dialogue, events, achievements, and difficulty systems` | Files: [src/game/engine/__tests__/dialogue.test.ts, src/game/engine/__tests__/events.test.ts, src/game/engine/__tests__/achievements.test.ts, src/game/engine/__tests__/difficulty.test.ts, src/game/engine/__tests__/stats.test.ts]

## Final Verification Wave (MANDATORY — after ALL implementation tasks)
- [x] F1. Plan Compliance Audit — oracle
- [x] F2. Code Quality Review — unspecified-high
- [ ] F3. Real Manual QA — unspecified-high (+ playwright)
- [x] F4. Scope Fidelity Check — deep

## Commit Strategy
- Wave 1: 4 commits (data, fixes, css, types)
- Wave 2: 4 commits (dialogue engine, events engine, difficulty, achievements)
- Wave 3: 4 commits (dialogue box, portrait, choices, transition)
- Wave 4: 3 commits (container refactor, dialogue flow, achievements UI)
- Wave 5: 3 commits (integration, content, tests)
- Total: ~18 commits

## Success Criteria
- `npm run build` 零错误
- `npm run test:unit` 全部通过（现有59 + 新增≥23 = ≥82用例）
- 游戏从门户完整可玩，视觉小说风格UI
- 多轮对话系统正常工作
- 随机事件正确触发
- 成就/结局正确追踪
- 过渡动画流畅
- 门户→游戏→返回首页完整闭环
