---
title: Reasonix Skills 技能包设计
date: 2026-08
tags: [AI, 工程范式, Markdown]
summary: 5 个纯 Markdown 技能，从 deepseek-harness 提炼可迁移工程原则：快照回归、决策留痕、可换后端、场景分组、架构范式，12 项引用零虚构。
---

## 背景

deepseek-harness（dsh）开源后两天 10.6 万 star，它的工程范式值得学习但代码量巨大。想把其中可迁移的原则提炼出来，写成零依赖的 Markdown 技能，任何 agent 环境都能用。

## 做了什么

5 个纯 Markdown 技能：snapshot-regression（快照回归）、decision-notes（决策留痕）、capability-seam（可换后端）、plugin-profile（场景分组）、dsh-patterns（架构范式）。408 行 / 17KB，12 项引用逐一在 dsh 源码中验证。

## 关键点

- **零依赖**：纯 Markdown，不装依赖、不执行脚本、不注册 hooks，放技能目录即可加载
- **引用真实性**：12 项引用（`docs/testing.md`、`docs/capability-seams.md`、`packages/fs` 等）逐一在 dsh 源码中验证，零虚构
- **实证验证**：snapshot-regression 核心逻辑编写真实代码执行——normalize 后契约一致 ✅、行为漂移被检测 ✅、未 normalize 原始输出不一致 ✅
- **dsh 规模可信度**：灵感来源有 692 个 spec 文件、49 个 packages、11 项 hygiene 门禁脚本、100% 覆盖率要求

## 现状

5 个技能全部通过验证（可发现性 5/5、引用真实性 12/12、核心逻辑实证 3/3）。按 Reasonix 的目录约定组织，可直接复制到技能库使用。

## 待补充

- 更多可迁移工程范式的提炼
- 与 Reasonix Agent 深度集成
