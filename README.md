# 🦉 owltree

> 数字神殿 // 代码与创造

终端风格的个人门户主页

![Theme Preview](https://img.shields.io/badge/Theme-Terminal-00ff00)
![React](https://img.shields.io/badge/React-18-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6)

## ✨ 特性

- 💻 **终端 UI** — CRT 扫描线 + 霓虹光标 + 命令行美学
- 📝 **递归笔记索引** — 从 `src/content/notes/` 递归读取 Markdown，展示文件夹与文件
- 📂 **项目入口配置** — `projects` 只展示真实配置的前端项目，显示与跳转可分开控制
- 🌐 **自动 i18n** — 根据浏览器语言自动切换中英文
- 🎯 **HashRouter** — 支持 GitHub Pages 部署的单页应用

## 🛠️ 技术栈

- **框架**: React 18 + TypeScript
- **构建**: Vite
- **样式**: Tailwind CSS + CSS Variables
- **动画**: Framer Motion
- **状态**: React Context
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
│   │   ├── layout/     # 全局布局组件
│   │   └── ui/         # 基础 UI 组件
│   ├── contexts/       # React Context
│   ├── pages/          # Home / Notes / NoteDetail / Projects
│   ├── hooks/          # React Hooks
│   ├── content/        # Markdown 内容目录
│   │   └── notes/      # 递归读取的笔记源文件
│   ├── styles/         # 全局样式
│   └── lib/            # 工具函数
├── theme/              # HTML 原型（主题参考，不参与运行时）
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

首页和 `#/projects` 的项目列表集中配置在 `src/data/projects.ts`，外部链接与显示开关由项目 `id` 自动推导环境变量名。

本地开发时可以复制 `.env.example` 为 `.env.local`，分别控制是否显示和是否可点击：

```bash
VITE_PROJECT_VISIBLE_API_GATEWAY=false
VITE_PROJECT_LINK_API_GATEWAY=https://example.com/api-gateway
VITE_PROJECT_VISIBLE_DATA_PIPELINE=true
VITE_PROJECT_LINK_DATA_PIPELINE=https://example.com/data-pipeline
```

- `VITE_PROJECT_VISIBLE_*` 控制是否显示该项目
- `VITE_PROJECT_LINK_*` 控制点击后跳转到哪里
- 链接留空时，项目可以显示但保持不可点击
- 例如项目 `id: "owltree-portal"` 对应 `VITE_PROJECT_VISIBLE_OWLTREE_PORTAL` 和 `VITE_PROJECT_LINK_OWLTREE_PORTAL`
- 目前默认只保留真实前端项目 `owltree portal`；新增项目只需要先在 `src/data/projects.ts` 登记，再按推导出的环境变量配置显示和跳转

## 🕒 更新时间元数据

`src/data/contentMetadata.generated.ts` 会在 `npm run dev` 和 `npm run build` 时由 Vite 自动刷新。

- notes 更新时间来自 `src/content/notes/**/*.md` 的本地文件修改时间
- projects 更新时间来自对应项目源文件的本地修改时间
- 不需要手动编辑这个 generated 文件

## 📝 Notes 目录

笔记内容从 `src/content/notes/` 递归读取，支持子文件夹显示与嵌套路由。

可用写法：

```text
src/content/notes/2026年05月21日-工作.md
src/content/notes/worklogs/weekly-sync.md
```

推荐 frontmatter：

```md
---
title: "2026年05月21日-工作"
date: 2026-05-21
type: dailywork
tags:
  - 工作日报
  - 日记
summary: 今日工作记录摘要
---
```

说明：
- 当前支持 `article`、`log`、`thought`、`dailywork`
- `tags` 支持逗号分隔或 YAML 列表
- 列表页支持按文件夹浏览，详情页路径为 `#/notes/<folder>/<file>`

## ⌨️ 快捷键

- `n` — 打开 `notes`
- `p` — 打开 `projects`
- `Esc` — 退到上一级路径，等价于 `..`
- `?` — 打开快捷键帮助

## 🚀 部署

项目配置为通过 GitHub Actions 自动部署到 GitHub Pages：

1. 在仓库 Settings > Pages 中启用 GitHub Actions 作为 Source
2. 推送到 `main` 分支将自动触发部署
3. 访问 `https://<username>.github.io/owltree/`

详见 `.github/workflows/deploy.yml`

## 📜 原型文件

`theme/` 目录只作为视觉参考，不作为运行时路由或主题入口。

## 📝 License

MIT
