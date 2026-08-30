---
slug: kb-ui
title: KB UI
subtitle: Vue 3 组件库与工程模板集
status: development
featured: false
date: 2026-08
tech: [Vue 3, TypeScript, Vite]
tags: [组件库, 工程化, monorepo]
summary: 自建前端素材库与工程模板集：55+ 组件、46 套主题、36 个页面模块、60+ 工具函数、7 种脚手架模板，零运行时依赖、CSS 变量驱动。
demo: https://anyuer678.github.io/kb-ui/
github: https://github.com/anyuer678/kb-ui
order: 20
cover: projects/kb-ui.svg
journey: [{"date": "2026-08", "title": "开发中", "desc": "组件库 + 主题系统 + 页面模块 + 脚手架模板 + DevOps 资产"}]
---

## 项目介绍

一套自建的前端素材库与工程模板集：Vue 3 组件库 + 36 个完整页面模块 + 46 套多风格主题 + 通用工具函数 + 7 种项目脚手架模板 + DevOps 资产，全部零运行时依赖、CSS 变量驱动。

## 设计目标

- 零运行时依赖：样式全部原生 CSS + 设计 token，无第三方样式框架
- CSS 变量驱动：主题切换一行代码生效
- 按需引入：每个组件独立 `style.css`，构建产物可单独引入

## 功能

- 组件库（@kb/ui，55+ 组件）：基础 / 表单 / 反馈 / 数据全覆盖，函数式 API（message / notification）
- 主题系统（46 套）：46 套主题（圆润/扁平/渐变/玻璃/赛博/终端/水墨/孟菲斯…），深色模式组合切换
- 页面模块模板（36 个）：登录 / 仪表盘 / 数据大屏 / 任务看板 / 聊天窗口 / 音乐播放器 等，playground 内全部可切换预览
- 通用工具库（@kb/utils，60+ 函数）：格式化 / 数组 / 对象 / 字符串 / 并发控制 / 防抖节流 / 存储封装
- 脚手架模板（create-kb，7 种）：base / starter / api / fullstack / electron / react / ai
- DevOps 资产：CI、changesets 自动发布、docker-compose、部署检查清单

## 架构

```
kb-ui/（pnpm workspace monorepo）
  packages/
    ui/            @kb/ui 组件库（55+ 组件）
    utils/         @kb/utils 工具函数库
    config/        共享工程配置（tsconfig/eslint/prettier/stylelint）
    create-kb/     脚手架 CLI（7 种模板）
  playground/      组件演示站（46 主题 + 36 模块预览）
  docs/            Vitepress 文档站 + DevOps 模板
```

## 技术选择

- **Vue 3.5 + TypeScript 5.9**：组件库与类型安全
- **Vite 8（lib mode）+ tsup**：构建；pnpm 10 workspace monorepo 管理多包
- **Vitest + Playwright**：239 例单测 + 19 项 e2e

## 开发过程

按包分层推进：先建 monorepo 骨架与共享配置（tsconfig/eslint/prettier/stylelint），再实现组件库与主题系统，随后补工具库、脚手架模板与 DevOps 资产；docs 用 Vitepress 承载组件文档与模板说明。

## 挑战与解决

1. 零运行时依赖 → 样式全部原生 CSS + 设计 token，每个组件独立 `style.css`，构建产物 `dist/styles/*` 可单独引入
2. 多包管理 → pnpm workspace monorepo + changesets 管理版本与 changelog，CI 自动创建版本 PR
3. 工程质量 → Vitest 239 例单测 + Playwright 19 项 e2e，覆盖组件与文档站

## 未来计划

- 组件库发布到 npm（当前私有仓库开发调试）
- 更多业务组件与页面模块

## 源码与安装

```bash
npm install kb-ui-vue
```

- [GitHub](https://github.com/anyuer678/kb-ui)
- [npm](https://www.npmjs.com/package/kb-ui-vue)
- [在线预览](https://anyuer678.github.io/kb-ui/)
