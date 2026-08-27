---
slug: developer-intelligence
title: Developer Intelligence
subtitle: 代码仓库智能分析平台
status: development
featured: false
date: 2026-08
tech: [Python, LLM, AI, SQLite, AST]
tags: [AI, 工具, 分析]
summary: 让 AI Agent 深度理解你的代码仓库——从静态分析到 GitHub 全景，本地优先，零 LLM 依赖。含 4 个子项目。
demo:
github: https://github.com/anyuer678/developer-intelligence
order: 10
journey: [{"date": "2026-08", "title": "架构规划", "desc": "4 个子项目架构设计完成，repo-intel-core 静态分析引擎开发中"}]
---

## 项目介绍

一个面向 AI Agent 的代码仓库理解平台。目标是让 Agent 不只是 "读代码"，而是真正理解仓库的结构、依赖、演化趋势和团队模式。本地优先，核心引擎零网络、零 LLM 依赖。

## 设计目标

- **本地优先**：核心引擎零网络、零 LLM 依赖
- **幻觉防护**：所有声称追溯到扫描证据，缺失数据标注 "未检测到"
- **表驱动扩展**：新语言/框架只需添加 YAML 规则文件
- **引擎/表现分离**：core 产出事实，LLM 解读交给上层消费者

## 功能

| 子项目 | 说明 | 状态 |
|--------|------|------|
| repo-intel-core | 跨语言仓库静态解析引擎，输出结构化 RepoProfile JSON | v0.1.0a0 |
| repo-onboarding-skill | 新人入门指南生成器，双模式（lite/full） | v0.1.0 |
| repo-architect-skill | 架构体检报告生成器，含 mermaid 图 | v0.1.0 |
| github-intelligence | 个人 GitHub 分析，SQLite + FTS5 + MCP 工具 | v0.0.1a0 |

- 扫描任意仓库 → 输出结构化 RepoProfile（模块/依赖/入口点/技术栈）
- 生成新人入门指南（lite 5 分钟速览 / full 深度文档）
- 架构体检报告（含 mermaid 依赖图）
- GitHub 全景分析（SQLite + FTS5 全文搜索 + MCP 工具接口）

## 架构

```
repo-intel-core（底层引擎）
    ├── repo-onboarding-skill（新人引导文档）
    ├── repo-architect-skill（架构健康报告）
    └── github-intelligence（GitHub 全景分析 → lumen Agent）
```

## 技术选择

- **Python 3.11+**：pydantic v2 数据模型 + PyYAML 规则驱动
- **SQLite（WAL）+ FTS5**：本地全文搜索，零部署
- **可选 tree-sitter**：AST 级精确解析
- **MCP 工具接口**：标准化暴露给 AI Agent 消费

## 开发过程

2026-08 立项 → 架构设计（4 子项目分层）→ repo-intel-core 静态分析引擎开发 → repo-onboarding-skill / repo-architect-skill 文档生成 → github-intelligence GitHub 数据采集。

## 挑战与解决

1. 多语言支持 → 表驱动设计：新语言只需 YAML 规则文件，不改引擎代码
2. 分析准确性 → 所有结论必须追溯到扫描证据，缺失数据标注 "未检测到"
3. 大仓库性能 → 增量解析 + 模块级缓存

## 未来计划

- 完成 repo-intel-core v1.0 稳定版
- 与 Lumen Agent 集成，支持自然语言查询仓库信息
- 更多语言的 AST 解析支持

## 源码

- [GitHub](https://github.com/anyuer678/developer-intelligence)
