# 月抛模拟器 UX 综合优化实施计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 收敛结算页可靠性问题，补充 E2E 覆盖，优化结算页 UX 与信息层级，并将头像渲染统一为 emoji-only。

**Architecture:** `FeedbackModal` 退化为纯展示组件，`GameContainer` 用 `useNavigate` 统一接管路由与 replay 行为，`useGameState` 继续作为状态真源。头像分支从类型到组件一次性清理。

**Tech Stack:** React 18 + TypeScript + Vite + React Router HashRouter + Tailwind CSS + Framer Motion + Vitest + Playwright

---

## Pre-work

### Task 0: 检查当前代码能否通过 build 与测试

**Step 1: 运行 build**
```bash
npm run build
```
Expected: 0 errors

**Step 2: 运行单元测试**
```bash
npm run test:unit
```
Expected: 94 tests passing

**Step 3: 运行 E2E 测试**
```bash
npm run test:e2e
```
Expected: pass（注意当前断言可能已过时）

**Step 4: Commit baseline**
```bash
git add docs/plans/2026-04-15-moon-throw-ux-combined-pass-design.md
git commit -m "docs: add moon-throw ux combined pass design"
```

---

## Wave 1: 可靠性 + 测试

### Task 1: 清理 E2E 中断言以匹配当前 UI

**Files:**
- Modify: `e2e/game-flow.spec.ts`

**Step 1: 修正断言**
当前 `game-flow.spec.ts` 的断言假设页面一加载就显示口交/性交按钮，但实际上需要先点击“开始游戏”。

修改如下：
- 保留 `game page loads with correct initial state`
- `action buttons are present`：先点击“开始游戏”，再断言行为按钮可见
- `partner card renders with avatar`：移除对 `data-testid="partner-avatar"` 的断言，改为检查 emoji 头像可见（例如检查包含 emoji 的元素存在）

**Step 2: 运行 E2E**
```bash
npm run test:e2e
```
Expected: 通过

**Step 3: Commit**
```bash
git add e2e/game-flow.spec.ts
git commit -m "test: update e2e assertions to match current moon-throw ui"
```

---

### Task 2: 重构 FeedbackModal 为纯展示组件

**Files:**
- Modify: `src/components/moon-throw/FeedbackModal.tsx`

**Step 1: 修改接口**
将 props 改为：
```ts
interface FeedbackModalProps {
  show: boolean
  title: string
  message: string
  icon: string
  activeTab: 'result' | 'history'
  onTabChange: (tab: 'result' | 'history') => void
  onReturnHome: () => void
  onReplay: () => void
  isGameOver?: boolean
  history?: GameState['history']
  turn?: number
}
```

**Step 2: 移除内部状态**
删除 `const [activeTab, setActiveTab] = useState<'result' | 'history'>('result')`

**Step 3: 移除内部路由逻辑**
删除 `handleReturnHome`，直接调用 `onReturnHome`

**Step 4: 更新渲染逻辑**
- 所有 `activeTab` 引用改为使用 props `activeTab`
- 标签按钮 `onClick` 改为 `() => onTabChange(tab)`
- 返回首页按钮 `onClick` 改为 `onReturnHome`
- 再玩一次按钮 `onClick` 改为 `onReplay`
- 给所有 `<button>` 添加 `type="button"`（解决现有 LSP warning）

**Step 5: 验证类型**
```bash
npx tsc --noEmit
```
Expected: 0 errors

**Step 6: Commit**
```bash
git add src/components/moon-throw/FeedbackModal.tsx
git commit -m "refactor: make FeedbackModal a pure presentational component"
```

---

### Task 3: GameContainer 接管路由与 replay 行为

**Files:**
- Modify: `src/components/moon-throw/GameContainer.tsx`

**Step 1: 引入 useNavigate**
在文件顶部添加：
```ts
import { useNavigate } from 'react-router-dom'
```

**Step 2: 增加 settlementTab state**
在组件内增加：
```ts
const navigate = useNavigate()
const [settlementTab, setSettlementTab] = useState<'result' | 'history'>('result')
```

**Step 3: 实现 handler**
```ts
const handleReturnHome = () => {
  navigate('/')
}

const handleReplay = () => {
  startGame()
  setSettlementTab('result')
}
```

**Step 4: 更新 FeedbackModal 调用**
将：
```tsx
<FeedbackModal
  show={phase === 'gameover'}
  title={feedback?.title ?? ''}
  message={feedback?.message ?? ''}
  icon={feedback?.icon ?? ''}
  onClose={handleCloseResult}
  isGameOver={true}
  history={feedback?.history}
  turn={state.turn}
/>
```
改为：
```tsx
<FeedbackModal
  show={phase === 'gameover'}
  title={feedback?.title ?? ''}
  message={feedback?.message ?? ''}
  icon={feedback?.icon ?? ''}
  activeTab={settlementTab}
  onTabChange={setSettlementTab}
  onReturnHome={handleReturnHome}
  onReplay={handleReplay}
  isGameOver={true}
  history={feedback?.history}
  turn={state.turn}
/>
```

**Step 5: 验证 build + tests**
```bash
npm run build
npm run test:unit
```
Expected: build 0 errors, 94 tests passing

**Step 6: Commit**
```bash
git add src/components/moon-throw/GameContainer.tsx
git commit -m "refactor: let GameContainer own settlement routing and replay"
```

---

### Task 4: 补充 E2E 覆盖 — 返回首页与再玩一次

**Files:**
- Modify: `e2e/game-flow.spec.ts`

**Step 1: 添加返回首页测试**
```ts
test('return home from game over works', async ({ page }) => {
  await page.goto('/#/moon-throw')
  await page.getByRole('button', { name: '开始游戏' }).click()
  // 快进触发 game over（连续使用高危行为或快速结束）
  // 更简单的方式：通过多次点击“无套性交”快速结束
  for (let i = 0; i < 10; i++) {
    const rawBtn = page.locator('button', { hasText: '无套性交' })
    if (await rawBtn.isVisible().catch(() => false)) {
      await rawBtn.click()
      await page.waitForTimeout(600)
    } else {
      const continueBtn = page.locator('button', { hasText: '继续' })
      if (await continueBtn.isVisible().catch(() => false)) {
        await continueBtn.click()
        await page.waitForTimeout(200)
      }
    }
  }
  await page.getByRole('button', { name: '返回首页' }).click()
  await expect(page).toHaveURL(/#\/$/)
  await expect(page.locator('text=SYSTEM ONLINE')).toBeVisible()
})
```

**Step 2: 添加再玩一次测试**
```ts
test('replay from game over resets the game', async ({ page }) => {
  await page.goto('/#/moon-throw')
  await page.getByRole('button', { name: '开始游戏' }).click()
  // 同上快速触发 game over
  for (let i = 0; i < 10; i++) {
    const rawBtn = page.locator('button', { hasText: '无套性交' })
    if (await rawBtn.isVisible().catch(() => false)) {
      await rawBtn.click()
      await page.waitForTimeout(600)
    } else {
      const continueBtn = page.locator('button', { hasText: '继续' })
      if (await continueBtn.isVisible().catch(() => false)) {
        await continueBtn.click()
        await page.waitForTimeout(200)
      }
    }
  }
  await page.getByRole('button', { name: '再玩一次' }).click()
  await expect(page.locator('text=开始游戏')).toBeVisible()
})
```

**Step 3: 运行 E2E**
```bash
npm run test:e2e
```
Expected: 通过

**Step 4: Commit**
```bash
git add e2e/game-flow.spec.ts
git commit -m "test(e2e): add return-home and replay coverage for game over"
```

---

### Task 5: 补充 E2E 覆盖 — 非性行为结果可见与标签切换

**Files:**
- Modify: `e2e/game-flow.spec.ts`

**Step 1: 添加聊天结果可见测试**
```ts
test('chat action shows result feedback', async ({ page }) => {
  await page.goto('/#/moon-throw')
  await page.getByRole('button', { name: '开始游戏' }).click()
  await page.getByRole('button', { name: '试探聊天' }).click()
  await expect(page.locator('text=试探聊天')).toBeVisible()
})
```

**Step 2: 添加标签切换测试**
```ts
test('settlement tabs can be switched', async ({ page }) => {
  await page.goto('/#/moon-throw')
  await page.getByRole('button', { name: '开始游戏' }).click()
  // 快速结束一局
  for (let i = 0; i < 10; i++) {
    const rawBtn = page.locator('button', { hasText: '无套性交' })
    if (await rawBtn.isVisible().catch(() => false)) {
      await rawBtn.click()
      await page.waitForTimeout(600)
    } else {
      const continueBtn = page.locator('button', { hasText: '继续' })
      if (await continueBtn.isVisible().catch(() => false)) {
        await continueBtn.click()
        await page.waitForTimeout(200)
      }
    }
  }
  await page.getByRole('button', { name: '约会记录' }).click()
  await expect(page.locator('text=暂无约会记录').or(page.locator('.history-item').first())).toBeVisible()
  await page.getByRole('button', { name: '结算结果' }).click()
  await expect(page.locator('text=STATUS: TERMINATED')).toBeVisible()
})
```

**Step 3: 运行 E2E**
```bash
npm run test:e2e
```
Expected: 全部通过

**Step 4: Commit**
```bash
git add e2e/game-flow.spec.ts
git commit -m "test(e2e): add chat feedback and settlement tab switch coverage"
```

---

## Wave 2: UX 优化 + 头像清理

### Task 6: 头像收敛 — 移除 asciiPortrait 类型与渲染分支

**Files:**
- Modify: `src/game/types.ts`
- Modify: `src/components/moon-throw/VNPortrait.tsx`
- Modify: `src/game/engine/partner.ts`

**Step 1: 移除 Partner 类型中的 asciiPortrait**
在 `src/game/types.ts` 中，将：
```ts
export interface Partner {
  tags: PartnerTag[]
  diseases: DiseaseKey[]
  avatar: string
  asciiPortrait: string[]
}
```
改为：
```ts
export interface Partner {
  tags: PartnerTag[]
  diseases: DiseaseKey[]
  avatar: string
}
```

同时移除 `PartnerTemplate` 中的 `asciiPortrait` 字段：
```ts
export interface PartnerTemplate {
  templateId: string
  name: string
  backstory: string
  defaultTags: string[]
  personality: 'shy' | 'dominant' | 'playful' | 'cold' | 'anxious' | 'experienced' | 'romantic' | 'mysterious'
  dialogStyle: string
}
```

**Step 2: 更新 partner.ts 不再生成 asciiPortrait**
在 `src/game/engine/partner.ts` 中，移除返回对象里的 `asciiPortrait` 字段。

**Step 3: 简化 VNPortrait 为 emoji-only**
将 `src/components/moon-throw/VNPortrait.tsx` 改为只保留 emoji 渲染：
```tsx
interface VNPortraitProps {
  emoji: string
  name?: string
  size?: 'normal' | 'large'
}

export function VNPortrait({ emoji, name, size = 'normal' }: VNPortraitProps) {
  const fontSize = size === 'large' ? '4.5rem' : '2.75rem'
  return (
    <div className="vn-portrait-fade flex flex-col items-center">
      <div style={{ fontSize, lineHeight: '1', filter: 'drop-shadow(0 0 18px rgba(0,240,255,0.45))' }}>
        {emoji}
      </div>
      {name && <span className={`text-slate-500 mt-2 tracking-wider ${size === 'large' ? 'text-sm' : 'text-xs'}`}>{name}</span>}
    </div>
  )
}
```

**Step 4: 修复引用 VNPortrait 的地方**
`GameContainer.tsx` 中确保 `VNPortrait` 调用满足新的 props：
- `emoji={introEmoji}` 正确
- `emoji={partner?.avatar}` 正确（`name` 可传可不传）
- 移除任何传 `asciiArt` 的调用

**Step 5: 修复测试中的 Partner mock**
查找所有单元测试中构造 `Partner` 对象的 mock 数据，移除 `asciiPortrait` 字段：
```bash
grep -r "asciiPortrait" src/
```
受影响文件预计包括：
- `src/game/engine/__tests__/action-effects.test.ts`
- `src/game/engine/__tests__/delayed-diagnosis.test.ts`
- 其他涉及 partner 构造的测试文件

**Step 6: 运行 build + 单元测试**
```bash
npm run build
npm run test:unit
```
Expected: build 0 errors, 全部通过

**Step 7: Commit**
```bash
git add src/game/types.ts src/game/engine/partner.ts src/components/moon-throw/VNPortrait.tsx src/components/moon-throw/GameContainer.tsx src/game/engine/__tests__/
git commit -m "refactor: converge portraits to emoji-only and remove asciiPortrait data"
```

---

### Task 7: GameStatsPanel 卡片化布局

**Files:**
- Modify: `src/components/moon-throw/GameStatsPanel.tsx`
- Modify: `src/styles/game.css`（如有需要）

**Step 1: 修改布局**
将统计列表改为两列网格卡片：
```tsx
<div className="grid grid-cols-2 gap-3">
  {entries.map(([label, value]) => (
    <div key={label} className="bg-[#00f0ff]/5 border border-[#00f0ff]/20 rounded p-3 text-center">
      <div className="text-[#9090a0] text-xs mb-1">{label}</div>
      <div className="text-white text-lg font-bold">{value}</div>
    </div>
  ))}
</div>
```

**Step 2: 验证 build**
```bash
npm run build
```
Expected: 0 errors

**Step 3: Commit**
```bash
git add src/components/moon-throw/GameStatsPanel.tsx
git commit -m "ui: card-style layout for GameStatsPanel"
```

---

### Task 8: FeedbackModal 右侧“结算结果”增强摘要

**Files:**
- Modify: `src/components/moon-throw/FeedbackModal.tsx`

**Step 1: 丰富右侧面板内容**
在“结算结果”标签下，增加一个对局摘要面板，展示：
- 总回合数 `turn`
- 结局名称 `title`
- 是否感染（从 `history` 或 `stats` 推导，如果有感染记录显示“已感染”，否则“未感染”）
- 试纸使用次数（从 `stats` 中读取 `testkitUses`）
- 医院访问次数

如果 `stats` 里已有这些数据，直接读取展示。若缺失，可只展示 `turn` 和结局名称。

**Step 2: 布局微调**
将原来单薄的状态行扩展为多个小卡片，与左侧统计风格统一。

**Step 3: 验证 build**
```bash
npm run build
```
Expected: 0 errors

**Step 4: Commit**
```bash
git add src/components/moon-throw/FeedbackModal.tsx
git commit -m "ui: enhance settlement result panel with match summary"
```

---

### Task 9: 结算页按钮 CTA 与动效优化

**Files:**
- Modify: `src/components/moon-throw/FeedbackModal.tsx`

**Step 1: 主/次按钮视觉区分**
- `再玩一次`：使用更明亮的 cyan glow，hover 时 `scale(1.02)` + `box-shadow` 增强
- `返回首页`：使用 pink 但降低饱和度，hover 时同样增加微光效

**Step 2: 键盘焦点样式**
给按钮增加 `focus:outline-none focus:ring-2 focus:ring-[#00f0ff]/50`

**Step 3: Commit**
```bash
git add src/components/moon-throw/FeedbackModal.tsx
git commit -m "ui: improve settlement CTA buttons with glow and focus styles"
```

---

### Task 10: 结算页移动端与布局优化

**Files:**
- Modify: `src/components/moon-throw/FeedbackModal.tsx`

**Step 1: 响应式断点调整**
将左右分栏的断点从 `lg:flex-row lg:w-1/2` 提前到 `md:flex-row md:w-1/2`

**Step 2: 滚动边界**
确保左右/上下内容区都有 `overflow-y-auto`，底部按钮区固定

**Step 3: 验证浏览器视口**
```bash
npm run build
npm run preview
```
用 Playwright 截图或手动验证 375px 宽度下布局可用。

**Step 4: Commit**
```bash
git add src/components/moon-throw/FeedbackModal.tsx
git commit -m "ui: improve settlement responsive layout and scrolling"
```

---

### Task 11: 结算页 stagger 入场动画

**Files:**
- Modify: `src/components/moon-throw/FeedbackModal.tsx`

**Step 1: 给左侧面板内容增加 stagger 动画**
用 `motion.div` 包裹：
- 图标
- 标题
- 分隔线
- 消息区
- 统计区

每个元素设置递增的 `transition.delay`：
```tsx
<motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
  ...
</motion.div>
```

**Step 2: Commit**
```bash
git add src/components/moon-throw/FeedbackModal.tsx
git commit -m "feat: add staggered entrance animation to settlement screen"
```

---

### Task 12: HistoryPanel 时间线与高亮优化

**Files:**
- Modify: `src/components/moon-throw/HistoryPanel.tsx`

**Step 1: 增加回合分隔和时间线**
给每个历史条目增加左边小竖线（timeline），条目间增加细微间距

**Step 2: 关键行为高亮**
在显示 action 的同时增加小标签：
- 如果 action 是 `sex_raw` 或 `oral_raw`，显示红色小标签“高危”
- 如果使用了试纸，显示青色小标签“检测”

**Step 3: Commit**
```bash
git add src/components/moon-throw/HistoryPanel.tsx
git commit -m "ui: add timeline and highlight tags to HistoryPanel"
```

---

### Task 13: Intro 页 emoji 呼吸动画

**Files:**
- Modify: `src/components/moon-throw/GameContainer.tsx`
- Modify: `src/styles/game.css`

**Step 1: 给 intro 的 VNPortrait 增加呼吸动画类**
在 `game.css` 中增加：
```css
.vn-portrait-emoji-breathe {
  animation: vn-emoji-breathe 3s ease-in-out infinite;
}

@keyframes vn-emoji-breathe {
  0%, 100% { transform: scale(1); filter: drop-shadow(0 0 18px rgba(0,240,255,0.35)); }
  50% { transform: scale(1.06); filter: drop-shadow(0 0 28px rgba(0,240,255,0.6)); }
}
```

**Step 2: GameContainer 应用动画类**
在 intro 场景的 `VNPortrait` 外层 div 增加 `vn-portrait-emoji-breathe`

**Step 3: Commit**
```bash
git add src/components/moon-throw/GameContainer.tsx src/styles/game.css
git commit -m "feat: add breathe animation to intro emoji portrait"
```

---

## Final Verification

### Task 14: 全量验证

**Step 1: Build**
```bash
npm run build
```
Expected: 0 errors

**Step 2: 单元测试**
```bash
npm run test:unit
```
Expected: 94 tests passing

**Step 3: E2E 测试**
```bash
npm run test:e2e
```
Expected: 全部通过

**Step 4: LSP 诊断检查**
```bash
# 检查 TypeScript 错误
npx tsc --noEmit
```
Expected: 0 errors

**Step 5: 手动 QA（Playwright 浏览器）**
- 运行 `npm run preview`
- 访问 `/#/moon-throw`
- 完成一局游戏，验证结算页：
  - 返回首页能正确跳转
  - 再玩一次能重置游戏
  - 标签切换正常
  - 移动端布局可用

**Step 6: Commit any final fixes**
如有修复，单独 commit。

---

## 文件变更总览

| 文件 | 变更类型 | 说明 |
|---|---|---|
| `src/components/moon-throw/FeedbackModal.tsx` | 修改 | 纯展示化、按钮动效、响应式、stagger 动画、右侧面板增强 |
| `src/components/moon-throw/GameContainer.tsx` | 修改 | 接管路由/replay/tab 状态、intro 呼吸动画 |
| `src/components/moon-throw/VNPortrait.tsx` | 修改 | 简化为 emoji-only |
| `src/components/moon-throw/GameStatsPanel.tsx` | 修改 | 卡片式布局 |
| `src/components/moon-throw/HistoryPanel.tsx` | 修改 | 时间线 + 高亮标签 |
| `src/game/types.ts` | 修改 | 移除 `asciiPortrait` |
| `src/game/engine/partner.ts` | 修改 | 不再生成 `asciiPortrait` |
| `src/styles/game.css` | 修改 | 新增呼吸动画类、按钮/布局相关样式 |
| `e2e/game-flow.spec.ts` | 修改 | 修复过时断言 + 新增返回首页/再玩一次/聊天/标签切换覆盖 |
| `src/game/engine/__tests__/*.test.ts` | 修改 | 移除 mock 中的 `asciiPortrait` |

---

**Plan complete and saved to `docs/plans/2026-04-15-moon-throw-ux-combined-pass.md`.**
