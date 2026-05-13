# 🦉 owltree

> 数字神殿 // 代码与创造

终端风格的个人门户主页

![Theme Preview](https://img.shields.io/badge/Theme-Terminal-00ff00)
![React](https://img.shields.io/badge/React-18-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6)

## ✨ 特性

- 💻 **终端 UI** — CRT 扫描线 + 霓虹光标 + 命令行美学
- 🎨 **原型参考** — `theme/` 保留视觉小说等 HTML/CSS 原型，不参与运行时主题切换
- 🎲 **月抛模拟器** — 关于选择与后果的实验性互动叙事游戏
- 🌐 **自动 i18n** — 根据浏览器语言自动切换中英文
- 🎯 **HashRouter** — 支持 GitHub Pages 部署的单页应用
- 💾 **游戏进度存储** — 使用浏览器存储保存月抛模拟器成就进度

## 🛠️ 技术栈

- **框架**: React 18 + TypeScript
- **构建**: Vite
- **样式**: Tailwind CSS + CSS Variables
- **动画**: Framer Motion
- **状态**: React Context + 浏览器存储（游戏成就）
- **测试**: Vitest (单元) + Playwright (E2E)

## 🚀 快速开始

```bash
# 安装依赖
npm install

# 开发服务器
npm run dev

# 构建
npm run build

# 预览生产构建
npm run preview

# 运行测试
npm run test:unit
npm run test:e2e
```

## 📁 目录结构

```
owltree/
├── src/
│   ├── components/     # UI 组件
│   │   ├── portal/     # 终端门户首页组件
│   │   ├── moon-throw/ # 游戏组件
│   │   ├── layout/     # 全局布局组件
│   │   └── ui/         # 基础 UI 组件
│   ├── contexts/       # React Context
│   ├── pages/          # 页面
│   ├── hooks/          # React Hooks
│   ├── game/           # 游戏引擎与数据
│   │   ├── engine/     # 游戏逻辑
│   │   └── data/       # 配置数据
│   ├── styles/         # 全局样式
│   └── lib/            # 工具函数
├── theme/            # HTML 原型（主题参考）
│   ├── archive/      # 废弃样式归档
│   ├── themes/       # 主题原型
│   └── moon-throw.html # 原始游戏原型
├── e2e/                # Playwright E2E 测试
├── dist/               # 构建输出（生成物，默认忽略）
└── docs/               # 设计文档
```

## 🎨 主题系统

当前运行时固定使用 `terminal` 主题。`ThemeContext` 会在根元素上设置 `data-theme="terminal"`，并忽略旧版本可能留下的主题 localStorage 值。

| 主题 | 风格 | 预览 |
|------|------|------|
| 💻 Terminal | 终端 - CRT 扫描线 + 霓虹光标 | 当前运行时主题 |

### 技术实现

- **CSS Variables**: 变量定义在 `:root` 和 `[data-theme="terminal"]` 选择器中
- **Context API**: `ThemeContext` 提供固定终端主题
- **原型隔离**: 其他视觉方向保留在 `theme/` 作为参考，不作为运行时主题入口

## 🔗 项目链接配置

首页项目列表的外部链接集中配置在 `src/config/projectLinks.ts`。

本地开发时可以复制 `.env.example` 为 `.env.local`，填写对应的 `VITE_PROJECT_LINK_*`：

```bash
VITE_PROJECT_LINK_API_GATEWAY=https://example.com/api-gateway
VITE_PROJECT_LINK_DATA_PIPELINE=https://example.com/data-pipeline
```

留空或不配置时，对应项目会保持不可点击；内部项目如 `moon-throw` 仍使用站内路由。

## 🌙 月抛模拟器

一个关于性行为风险教育的实验性互动叙事游戏。

**游戏机制**:
- 管理「生理压抑」与「心理压力」两个核心数值
- 与随机生成的伙伴互动，每个伙伴有独特的标签和约束
- 选择不同的性行为方式，权衡风险与收益
- 使用检测试剂识别潜在风险
- 避免「欲火焚身」或「精神崩溃」导致游戏结束

**技术实现**:
- 纯 TypeScript 游戏引擎，无 React 依赖
- 完整的单元测试覆盖（ characterization tests ）
- 确定性随机数生成器（RNG）支持可重现测试

## 🚀 部署

项目配置为通过 GitHub Actions 自动部署到 GitHub Pages：

1. 在仓库 Settings > Pages 中启用 GitHub Actions 作为 Source
2. 推送到 `main` 分支将自动触发部署
3. 访问 `https://<username>.github.io/owltree/`

详见 `.github/workflows/deploy.yml`

## 📜 原型文件

`theme/` 目录包含原始 HTML/JS 原型（参考实现）：

- `theme/moon-throw.html` — 原始游戏原型
- `theme/themes/style-visual-novel-personal.html` — 视觉小说主题原型
- `theme/layouts/terminal.html` — 终端布局原型

## 📝 License

MIT
