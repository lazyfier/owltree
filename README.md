# 🦉 Owltree

> 数字神殿 // 代码与创造

一个视觉小说游戏风格的个人门户主页，包含实验性互动叙事游戏「月抛模拟器」。

![Theme Preview](https://img.shields.io/badge/Theme-Visual%20Novel-ff6b6b)
![React](https://img.shields.io/badge/React-18-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6)

## ✨ 特性

- 🎨 **三主题切换** — 视觉小说 / 赛博朋克 / 极简风格一键切换
- 🎮 **视觉小说 UI** — Glitch 故障艺术 + 角色状态面板 + 像素风格
- 🎲 **月抛模拟器** — 关于选择与后果的实验性互动叙事游戏
- 🌐 **自动 i18n** — 根据浏览器语言自动切换中英文
- 🎯 **HashRouter** — 支持 GitHub Pages 部署的单页应用
- 💾 **主题持久化** — 自动记忆用户主题偏好

## 🛠️ 技术栈

- **框架**: React 18 + TypeScript
- **构建**: Vite
- **样式**: Tailwind CSS + CSS Variables
- **动画**: Framer Motion
- **状态**: React Context + localStorage
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
│   │   ├── portal/     # 门户首页组件
│   │   ├── moon-throw/ # 游戏组件
│   │   └── ui/         # 基础 UI 组件
│   ├── contexts/       # React Context (主题等)
│   ├── pages/          # 页面
│   ├── hooks/          # React Hooks
│   ├── game/           # 游戏引擎与数据
│   │   ├── engine/     # 游戏逻辑
│   │   └── data/       # 配置数据
│   ├── styles/         # 全局样式
│   └── lib/            # 工具函数
├── prototypes/         # HTML 原型
│   ├── archive/        # 废弃样式归档
│   ├── themes/         # 主题原型
│   └── moon-throw.html # 原始游戏原型
├── e2e/                # Playwright E2E 测试
├── dist/               # 构建输出
└── docs/               # 设计文档
```

## 🎨 主题系统

支持三种主题风格，点击右上角按钮切换：

| 主题 | 风格 | 预览 |
|------|------|------|
| 🎮 Galgame | 视觉小说 - 故障艺术 + 角色面板 | 默认 |
| ⚡ Cyber | 赛博朋克 - 霓虹光效 + 科技感 | 待完善 |
| ◐ Minimal | 极简主义 - 清爽留白 | 待完善 |

### 技术实现

- **CSS Variables**: 主题变量定义在 `:root` 和 `[data-theme]` 选择器中
- **Context API**: `ThemeContext` 管理全局主题状态
- **localStorage**: 自动持久化用户选择
- **动态切换**: 无刷新即时切换，过渡动画平滑

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

`prototypes/` 目录包含原始 HTML/JS 原型：

- `prototypes/moon-throw.html` — 原始游戏原型
- `prototypes/themes/style-visual-novel-personal.html` — 视觉小说主题原型
- `prototypes/archive/` — 废弃样式归档

## 📝 License

MIT
