---
slug: reasonix-skills
title: Reasonix Skills
subtitle: 可迁移 Markdown 技能包
status: completed
featured: false
date: 2026-08
tech: [Markdown, AI]
tags: [工具, 工程化, AI]
summary: 5 个纯 Markdown 技能，把 DeepSeek Harness 的工程范式沉淀为可复用的开发指导：快照回归、决策留痕、可换后端、场景分组、架构范式。
demo:
github: https://github.com/anyuer678/reasonix-skills
order: 22
journey: [{"date": "2026-08", "title": "完成", "desc": "5 个技能全部通过验证，408 行 / 17KB，12 项引用零虚构"}]
---

## 项目介绍

灵感来自 DeepSeek AI 官方开源项目 deepseek-harness（两天 10.6 万 star）。本项目不包含 dsh 代码，只提炼其可迁移的工程原则，写成零依赖的 Markdown 技能。不装依赖、不执行脚本、不注册 hooks——把 SKILL.md 放进技能目录即可被加载。

## 设计目标

- **零依赖**：纯 Markdown，无脚本、无 hooks
- **可发现**：按目录结构组织，agent 自动加载技能索引
- **实证有效**：每个技能附带验证数据，引用全部真实可查

## 功能

| 技能 | 功能 | 解决的痛点 |
|------|------|-----------|
| snapshot-regression | 快照回归纪律：稳定契约用 vitest 快照锁定 | 输出契约悄悄漂移无人发现 |
| decision-notes | 决策留痕：非平凡决策双落点 + 冻结归档 | 决策不沉淀，换会话无法重建 |
| capability-seam | 可换后端设计：Definition / Provider / Consumer 三角 | 换后端要改全家 |
| plugin-profile | 技能场景分组：full / quick / frontend / backend | 技能全量加载的噪音 |
| dsh-patterns | 架构范式 6 原则，各配好坏代码对比 | 系统长歪无准则可依 |

## 架构

```
reasonix-skills/
├── skills/
│   ├── snapshot-regression/SKILL.md
│   ├── decision-notes/SKILL.md
│   ├── capability-seam/SKILL.md
│   ├── plugin-profile/SKILL.md
│   └── dsh-patterns/SKILL.md
├── LICENSE (GPL-3.0)
└── README.md
```

## 技术选择

- **纯 Markdown**：零依赖、零执行，agent 直接读取理解
- **frontmatter 元数据**：name + description，支持自动索引
- **目录约定**：遵循 Reasonix / DSH 的技能目录规范

## 开发过程

研究 deepseek-harness 源码（692 个 spec 文件、49 个 packages）→ 提炼 5 个可迁移原则 → 编写 Markdown 技能 → 逐一验证（可发现性 / 内容结构 / 引用真实性 / 核心逻辑实证）。

## 挑战与解决

1. 引用真实性 → 12 项引用逐一在 dsh 源码中验证，零虚构
2. 技能可发现性 → frontmatter + 目录约定，通过 read_skill 加载测试
3. 实证有效性 → snapshot-regression 核心逻辑编写真实代码执行验证

## 未来计划

- 更多可迁移工程范式的提炼
- 与 Reasonix Agent 深度集成

## 源码

- [GitHub](https://github.com/anyuer678/reasonix-skills)
