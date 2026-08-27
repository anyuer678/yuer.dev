---
slug: key-tool
title: Key Tool
subtitle: API Key 多租户网关
status: development
featured: false
date: 2026-08
tech: [Python, FastAPI, OpenAI API]
tags: [安全, API, 工具]
summary: 多维度限额密钥签发与消费网关：项目体系 / 余额计费 / 模型绑定 / 限流，转发任意 OpenAI 兼容上游，支持 SDK 直连与流式。
demo:
github: https://github.com/anyuer678/key-tool
order: 18
related: [key-tool-notes]
journey: [{"date": "2026-08", "title": "功能完整", "desc": "Web 面板 + CLI + OpenAI SDK 三种使用方式，65 项测试通过"}]
---

## 项目介绍

给自用 / 小团队签发带限额的 API Key：次数、token、有效期、余额四个维度可组合，任一触顶即失效；签发的 key 可直接给 OpenAI SDK / 任意客户端用，消费自动按实际用量结算退差。支持 DeepSeek / OpenAI / Ollama / Kimi / 智谱 / Qwen 六家预设。

## 设计目标

- **多维度限额**：次数 / token / 有效期 / 余额四维组合
- **预扣 + 退差**：按 max_tokens 预扣，成功按实际 usage 结算，5xx 全额退
- **OpenAI 兼容**：签发的 key 直接给 SDK / 客户端用，零改动
- **安全优先**：密钥只存哈希，明文 key 仅签发时出现一次

## 功能

- 项目体系：key 归属项目；项目级共享额度池 + key 独立上限
- 余额计费：项目余额 + 定价表（元/1M tokens），预扣防超支
- OpenAI 兼容消费：`/v1/chat/completions`，Bearer 鉴权 + SSE 流式
- 预设服务商：DeepSeek / OpenAI / Ollama / Kimi / 智谱 / Qwen，填 api_key 即用
- 模型绑定：签发可绑 provider/model，冲突 403
- 安全：Admin Token + HttpOnly 签名会话 + Fernet 加密 + 分层限流
- 审计报表：全量 usage_logs（含金额），按天/项目聚合
- 三种界面：Web 面板 / OpenAI SDK / CLI

## 架构

```
Web 面板 / CLI / OpenAI SDK
  │
  ▼
FastAPI 网关
  ├── 管理层（签发 / 项目 / 服务商 / 定价 / 审计）
  ├── 消费层（OpenAI 兼容 /v1/chat/completions）
  └── 安全层（Admin Token / 限流 / Fernet 加密）
        │
        ▼
      上游 Provider（DeepSeek / OpenAI / Ollama / 智谱 …）
```

## 技术选择

- **Python + FastAPI**：异步网关，SSE 流式透传
- **SQLite + FTS5**：本地存储，审计日志全文搜索
- **Fernet 加密**：服务商 api_key 加密存储
- **预扣 + 原子条件 UPDATE**：并发安全的额度扣减

## 开发过程

先实现密钥签发与限额扣减核心逻辑，再搭 FastAPI 网关接入 OpenAI 兼容消费；Web 面板、CLI、审计报表逐步补齐。65 项测试覆盖签发 / 消费 / 限流 / 退差 / 安全全链路。

## 挑战与解决

1. 并发扣减 → 预扣 + 退差 + 原子条件 UPDATE + 幂等抢占，保证余额不为负
2. 上游不稳定 → 5xx 全额退预扣；实际用量超预扣量按封顶计
3. 安全 → 密钥只存 SHA-256 哈希，明文仅签发时返回；api_key Fernet 加密；分层限流

## 未来计划

- Redis 多实例共享限流
- Webhook 通知额度告警
- 更多上游 Provider 适配

## 源码

- [GitHub](https://github.com/anyuer678/key-tool)
