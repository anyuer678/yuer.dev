# Yuer Studio

> 个人作品集与数字花园 — 把想法做成软件

[![Deploy](https://img.shields.io/github/actions/workflow/status/anyuer678/yuer.dev/deploy.yml?branch=main&label=deploy)](https://github.com/anyuer678/yuer.dev/actions)
[![Vue 3](https://img.shields.io/badge/Vue-3.5+-42b883?logo=vue.js)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-6+-646cff?logo=vite)](https://vite.dev/)
[![License](https://img.shields.io/github/license/anyuer678/yuer.dev)](LICENSE)

## 简介

Yuer Studio 是我的个人数字空间 —— 一个集 **项目展示**、**技术笔记**、**开发时间线** 于一体的静态站点。

没有后端，没有数据库，一切内容在构建期打包进浏览器。纯前端、零 fetch、秒开。

**在线访问** → [anyuer678.github.io/yuer.dev](https://anyuer678.github.io/yuer.dev/)

## 功能

- **Projects** — 展示所有项目的简介、技术栈、状态
- **Notes** — 技术笔记，从 AI 设计到数据库原理，60+ 篇 Markdown
- **Timeline** — 开发时间线，按月记录每个项目的诞生
- **Lab** — 实验性内容与探索
- **SEO** — 每个页面独立 meta、OG 标签、结构化数据

## 技术栈

| 层级 | 技术 |
|------|------|
| 框架 | Vue 3 + Composition API |
| 构建 | Vite 6 |
| 路由 | Vue Router 4 |
| Markdown | markdown-it + highlight.js |
| 部署 | GitHub Actions → GitHub Pages |

## 架构

7 层分层模型，依赖只能自上而下：

```
P0 展示层    pages/（10 个路由页面）
P1 业务组件  components/features/
P2 基础组件  components/ui/ + components/layout/
P3 服务层    composables/ + router/
P4 数据层    utils/content.js（静态导出）
P5 内容资产  src/content/*.md / *.json
P6 工程层    scripts/ + CI/CD
```

**三个核心设计决策：**

1. **meta-only 管线** — 主 bundle 只解析 frontmatter，Markdown 渲染移入详情页懒加载 chunk
2. **URL 即状态** — 列表过滤的唯一事实来源是 `route.query`，组件无过滤 state
3. **零运行时数据** — 一切内容构建期打包，浏览器零 fetch

## 本地开发

```bash
# 克隆
git clone https://github.com/anyuer678/yuer.dev.git
cd yuer.dev

# 安装（需要 Node >= 20）
npm install

# 开发服务器
npm run dev

# 校验内容 + Lint + 构建
npm run check
```

## 项目结构

```
src/
├── pages/            # 10 个路由页面
├── components/
│   ├── features/     # 业务组件（HeroSection、ProjectCard 等）
│   ├── layout/       # 布局组件（Header、Footer、PageTransition）
│   └── ui/           # 基础组件（Tag、StatusBadge、Icon）
├── content/
│   ├── projects/     # 项目 Markdown（23 个项目）
│   ├── notes/        # 笔记 Markdown（60+ 篇）
│   ├── lab.json      # 实验室数据
│   ├── timeline.json # 时间线数据
│   └── site.json     # 全站配置
├── utils/
│   ├── content.js    # 静态内容导出
│   └── markdown.js   # Markdown 渲染（懒加载）
└── router/           # 路由配置 + SEO 副作用
```

## 文档

本项目包含 14 份规范文档（`docs/`），记录了从需求到发布的完整设计过程：

| # | 文档 | 说明 |
|---|------|------|
| 01 | 需求规格 | 功能与非功能需求 |
| 02 | 信息架构与路由 | URL 设计、页面层级 |
| 03 | 设计系统 | 色彩、字体、间距 |
| 04 | 内容层规范 | Markdown frontmatter 定义 |
| 05 | 组件规范 | 组件命名、API、用法 |
| 06 | 页面布局规范 | 布局规则与响应式 |
| 07 | 工程规范 | 命名、目录、Git 约定 |
| 08 | 开发阶段计划 | 里程碑与排期 |
| 09 | 参考实现 | 关键代码示例 |
| 10 | 技术决策记录 | ADR |
| 11 | 内容维护手册 | 如何新增笔记/项目 |
| 12 | 内容种子数据 | 初始内容模板 |
| 13 | 测试与发布检查单 | 上线前 checklist |
| 14 | 技术架构设计 | 分层、模块、数据流 |

## License

MIT
