---
title: Developer Intelligence 平台设计
date: 2026-08
tags: [AI, 工具, Python]
summary: 让 AI Agent 深度理解代码仓库的平台：4 个子项目分层（引擎/引导/架构/GitHub），本地优先零 LLM 依赖，表驱动扩展新语言。
---

## 背景

AI Agent 读代码仓库时往往只看到文件内容，不理解模块结构、依赖关系和演化趋势。想做一个平台，让 Agent 真正"理解"仓库——从静态分析到 GitHub 全景。

## 做了什么

设计了 4 个子项目的分层架构：repo-intel-core（底层引擎）→ repo-onboarding-skill（新人引导）+ repo-architect-skill（架构报告）+ github-intelligence（GitHub 全景）。目前以规划文档和架构设计为主，repo-intel-core 开发中。

## 关键点

- **引擎/表现分离**：core 产出事实（RepoProfile JSON），LLM 解读交给上层消费者，避免幻觉污染事实
- **本地优先**：核心引擎零网络、零 LLM 依赖，扫描结果可追溯到具体证据
- **表驱动扩展**：新语言/框架只需添加 YAML 规则文件，不改引擎代码
- **幻觉防护**：所有声称必须追溯到扫描证据，缺失数据标注 "未检测到"
- **GitHub 全景**：SQLite + FTS5 全文搜索 + MCP 工具接口，暴露给 Agent 消费

## 现状

架构设计完成，4 个子项目定位清晰。repo-intel-core 静态分析引擎开发中。monorepo 仓库，规划文档齐全（00-总路线图 到 09-进度日志）。

## 待补充

- repo-intel-core v1.0 稳定版
- 与 Lumen Agent 集成，支持自然语言查询仓库信息
- 更多语言的 AST 解析支持
