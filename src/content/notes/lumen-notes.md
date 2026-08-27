---
title: Lumen Agent Runtime
date: 2026-08
tags: [AI, Agent, Go, React]
summary: 24/7 常驻的个人 AI Runtime：Go 实现 Agent Loop + 9 类工具 + 记忆 + 安全，React Dashboard，v3 100 用例全通过。
---

## 背景

市面上多数 Agent 停在 "LLM + Tools"，缺可靠性、可观测、记忆和主动性。想做一个真正能长期运行的个人 AI Runtime——不只是聊天壳，而是可以被桌宠、手机 App、CLI 复用的底座。

## 做了什么

Go 实现完整 Agent Loop：IntentRouter → Planner → ContextMgr → Tool Selection → Permission → Execution → Memory → Feedback → EventBus。React 前端 Dashboard + Today 助手日报。v3 Benchmark 100 用例全部通过，38 项测试 PASS。

## 关键点

- **Agent Loop 数据流**：意图路由（direct_answer / tool_call / remember / kb_query / llm_needed）→ Planner 生成步骤计划 → ContextMgr 裁剪历史防溢出 → 工具选择 + RepairToolArgs 参数修复 → L1/L2/L3 权限分级 → 执行 + 重试 + Checkpoint → 失败走 Replanner → 记忆沉淀（评分 + 生命周期）→ EventBus 广播
- **多模型路由**：智谱 / DeepSeek / Ollama / OpenAI 兼容，按复杂度自动选模型
- **9 类工具**：Shell / 文件 / 浏览器 / 系统 / Windows / 子代理 / Computer / 安全 / MCP
- **Tool Repair**：宽容解析 LLM 输出——JSON 修复、工具名归一化、参数类型修复
- **Context Manager**：Token 预算估算 + 滑动窗口，防止上下文泄漏
- **Memory 2.0**：记忆评分 + 生命周期（active→forgotten）+ 用户画像提炼
- **安全防护**：Token 认证 + 命令黑名单 + 沙箱 + 权限分级 + 默认仅 127.0.0.1

## 现状

v3 Benchmark 全通过，核心链路完整。Go + React 技术栈，660KB 仓库体量。处于早期测试阶段，安全性未经过完整独立审计。

## 待补充

- 更多工具接入（IDE 插件、手机 App）
- 多用户权限模型
- 与 Lumen 生态（lumen-log、lumen-home）联动
