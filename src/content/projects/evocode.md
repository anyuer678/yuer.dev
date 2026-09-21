---
slug: evocode
title: EvoCode
subtitle: AI 软件维护与演化平台
status: development
tier: flagship
featured: true
date: 2026-08
tech: [Vue 3, TypeScript, Spring Boot, Python, PostgreSQL, Redis, LLM, Docker]
tags: [AI, FullStack]
summary: 本机软件体检（local-tool）：规则引擎扫描 + 可选 LLM；无认证，勿公网。tree-sitter 架构解析真实存在，无 key 时报告降级。
demo:
github: https://github.com/anyuer678/evocode
order: 2
related: [evocode-architecture]
journey: [{"date": "2026-08", "title": "立项", "desc": "AI 软件维护与演化平台，GitHub 仓库建立，开发中"}]
---

## 项目介绍

一个探索 AI 辅助软件工程的项目。目标是让 AI 不仅能够生成代码，也能够理解已有软件，帮助开发者完成分析、维护和优化。

目前已完成 v0.1 代码体检 MVP：上传项目（zip 或 GitHub 地址）→ 扫描 → 质量/架构/演化分析 → AI 体检报告，端到端跑通。AI 医生与技术债看板还在开发中。

## 设计目标

做它之前，我先定了三条原则：

- 任意规模的仓库都能出一份"架构全景"报告（模块、依赖、数据流）
- 新维护者的上手时间从"几天"压到"30 分钟"
- 架构知识可沉淀、可检索，不靠个人记忆

## 功能

- 软件结构分析：模块、依赖关系与数据流可视化
- 代码质量评估：识别代码问题与潜在风险
- 技术债发现：定位不合理设计与过期实现
- 重构建议：给出可执行的改进方案
- 软件升级辅助：辅助版本升级与兼容性分析
- AI 报告与会话问答：基于分析结果生成中文文档，支持针对仓库提问

## 架构

```
Vue 3 前端 ──→ Spring Boot API Gateway ──→ Python 分析服务
                        │                      ├── 代码解析器（AST）
                        │                      ├── 依赖图构建
                        └── LLM 服务 ──────────└── 报告生成（上下文拼装）
```

前端负责交互与报告展示；Gateway 统一鉴权与路由；分析服务负责确定性分析；
LLM 只做"基于分析结果的生成"，避免幻觉污染事实。

## 技术选择

- **Vue 3**：交互密集的报告查看器，组合式 API 组织状态更清晰
- **Spring Boot**：团队最熟悉的后端框架，网关/权限/任务调度生态齐全
- **Python**：AST 生态成熟（tree-sitter），分析管线迭代最快
- **LLM**：负责自然语言化输出；事实部分由确定性分析兜底

## 开发过程

2026-08 立项 → Python 分析服务（扫描/质量/架构/演化）→ Spring Boot 后端 → Vue 3 前端 → LLM 报告接入。目前 P0–P5 已完成，正在做 AI 医生（P6）与技术债看板（P7）。

## 挑战与解决

1. 大仓库分析超时 → 分析任务异步化 + 增量解析（只重建变更部分）
2. LLM 输出幻觉 → 报告模板约束 + 只允许引用分析器给出的事实
3. 多模型切换成本高 → Gateway 层抽象 Provider 接口，模型可插拔

## 未来计划

- 增量分析与监听模式（仓库变化自动更新架构图）
- 维护建议知识库（常见反模式与修复方案）
- 明确不做：自动改代码（v1 只做"理解"与"建议"）

## 深度复盘（规则引擎为主）

### 问题
「AI 体检」容易名实不符：核心若是 LLM，无网即空。

### 事实
- 核心是 **确定性规则扫描**（安全/复杂度/重复/架构…）
- LLM 为可选增强；无 key 降级 `source=RULES`
- tree-sitter 在 analyzer 依赖与 parser 中**真实存在**
- 定位：`local-tool`，无认证，仅本机

### 配套
- `docker-compose.full.yml` + bind guard（非 loopback 默认拒绝）
- `analyzer/run.py` 安全启动入口

### 一句话
能降级的 AI 才叫工具；写死宣传的 AI 只是故事。


## 架构速览

```text
Vue3 前端
   │  /api/v1（仅 127.0.0.1）
   ▼
Spring Boot Backend ── PostgreSQL(pgvector) / Redis
   │  /analyze/v1（仅本机）
   ▼
FastAPI Analyzer
   ├─ 规则扫描：security / complexity / duplication / style …
   ├─ 架构：tree-sitter（py/java/js/ts/go）+ 分层/环检测
   ├─ 演化：git log 信号
   └─ LLM（可选）：报告 / AI 医生 / RAG — 无 key 则 RULES 降级
```

- 护栏：`docker-compose.full.yml` 端口仅 127.0.0.1；`scripts/check_bind_guard.py`
- 启动：`python analyzer/run.py`（默认 loopback；公网需显式 opt-in）

## 源码与 Demo

- GitHub：https://github.com/anyuer678/evocode
- Demo：待补充
