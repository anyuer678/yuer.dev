---
slug: lumen
title: Lumen
subtitle: 个人 AI Agent Runtime
status: development
featured: true
date: 2026-08
tech: [Go, React, LLM, AI, Docker]
tags: [AI, Agent, FullStack]
summary: 24/7 常驻运行的个人 AI Runtime：拥有记忆、推理、工具调用与计算机操作能力，全本地运行，默认只监听本机。
demo:
github: https://github.com/anyuer678/lumen
order: 1
related: [lumen-notes]
journey: [{"date": "2026-08", "title": "v3 Benchmark 通过", "desc": "100 用例全部通过，38 项测试 PASS，Agent Loop + 记忆 + 安全防护完整闭环"}]
---

## 项目介绍

市面上多数 Agent 停在 "LLM + Tools"。Lumen 额外补齐了很多人忽视、却决定 "Agent 能否长期可用" 的部分：可靠性、可观测、记忆、主动性。它不是又一个聊天壳，而是一个可以被桌宠、手机 App、CLI 复用的 Runtime 底座。

跟它说 "帮我整理下载目录"，它会自己规划 → 调用工具 → 执行 → 沉淀记忆 → 每天总结。全本地运行，默认只监听本机。

## 设计目标

- **可靠性**：上下文预算、宽容工具调用修复、Checkpoint 断点恢复
- **可观测**：每阶段轨迹追踪、失败自动分类
- **记忆**：评分 + 生命周期（防记忆膨胀）+ 用户画像提炼
- **主动**：事件驱动 + 策略规则，不只是被动回答问题

## 功能

| 能力 | 说明 |
|------|------|
| 真实 Agent Loop | 意图路由 → Planner → 执行 → 评估 → Replanner → 记忆 → 反馈 |
| 多模型路由 | 智谱 / DeepSeek / Ollama / OpenAI 兼容，按复杂度自动选模型 |
| 9 类工具 | Shell / 文件 / 浏览器 / 系统 / Windows / 子代理 / Computer / 安全 / MCP |
| 多模态 Vision | 截图 → base64 → 视觉模型 → UI 元素理解 |
| Tool Repair | 宽容解析 LLM 输出：JSON 修复、工具名归一化、参数修复 |
| Context Manager | Token 预算估算 + 滑动窗口，防止上下文泄漏 |
| Agent Trace | 每阶段 span 记录（stage/latency/success），排错神器 |
| Memory 2.0 | 记忆评分 + 生命周期（active→forgotten）+ 用户画像 |
| 事件驱动 | EventBus + Policy YAML，主动响应文件/任务/系统事件 |
| 工作流 DAG | 任务编排，支持依赖与并行 |
| Benchmark + 失败分析 | 100 用例 + 自动归类与修复建议 |
| 安全防护 | 命令黑名单 + 沙箱 + 权限分级 + 确认机制 + 默认仅本机监听 |

## 架构

```
用户输入
  │
  ▼
IntentRouter ── direct_answer / tool_call / remember / kb_query / llm_needed
  │
  ▼
Planner ── LLM 生成步骤计划（注入记忆 + 历史反馈建议）
  │
  ▼
ContextMgr ── 裁剪历史到 token 预算，防溢出
  │
  ▼
Tool Selection ── 工具选择 + RepairToolArgs 参数修复
  │
  ▼
Permission ── L1/L2/L3 分级，危险操作需人工确认
  │
  ▼
Execution ── 执行 + 重试 + 每步 Checkpoint
  │
  ├─ 失败 → Replanner 重新规划剩余步骤
  │
  ▼
Memory ── 沉淀记忆（评分 + 生命周期）
  │
  ▼
EventBus ── 广播 → Proactive 主动恢复 / 前端 SSE 实时推送
（每阶段 Trace span 落盘，GET /v1/traces/{id} 回放）
```

## 技术选择

- **Go 1.26+**：高并发 Agent Loop、内存控制、部署便捷
- **React 18**：前端 Dashboard + Today 助手日报
- **多模型路由**：智谱 / DeepSeek / Ollama / OpenAI 兼容，按复杂度自动选
- **Docker**：一键部署，环境隔离

## 开发过程

2026-08 启动 → Go Agent Loop 骨架 → 9 类工具接入 → 记忆系统（评分 + 生命周期）→ 安全防护（Token 认证 + 权限分级 + 命令黑名单）→ Benchmark v3（100 用例通过）→ React 前端 Dashboard。

## 挑战与解决

1. 上下文溢出 → Context Manager 做 Token 预算估算 + 滑动窗口裁剪
2. LLM 输出不规范 → Tool Repair 宽容解析：JSON 修复、工具名归一化、参数类型修复
3. 安全性 → Token 认证 + L1/L2/L3 权限分级 + 命令黑名单 + 默认仅 127.0.0.1

## 未来计划

- 更多工具接入（IDE 插件、手机 App）
- 多用户权限模型
- 与 Lumen 生态（lumen-log、lumen-home）联动

## 源码

- [GitHub](https://github.com/anyuer678/lumen)
