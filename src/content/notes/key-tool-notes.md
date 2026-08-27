---
title: Key Tool 多租户网关
date: 2026-08
tags: [安全, API, Python]
summary: API Key 多维度限额签发与消费网关：项目体系 + 余额计费 + OpenAI 兼容转发，预扣+退差保证并发安全，65 项测试通过。
---

## 背景

自用/小团队需要给不同项目和人签发带限额的 API Key，但市面上没有轻量的多租户 Key 管理方案。想做一个网关：签发的 key 直接给 OpenAI SDK 用，消费自动按实际用量结算。

## 做了什么

FastAPI 网关 + Web 面板 + CLI 三种使用方式。支持 DeepSeek / OpenAI / Ollama / Kimi / 智谱 / Qwen 六家预设。65 项测试覆盖签发 / 消费 / 限流 / 退差 / 安全全链路。

## 关键点

- **四维限额**：次数 / token / 有效期 / 余额任一触顶即失效，`calls=1` 即一次性 key
- **预扣 + 退差**：按 max_tokens 预扣（token + 金额），成功按 usage 结算；上游 5xx 全额退；实际用量超预扣量按封顶计
- **并发安全**：原子条件 UPDATE + 幂等抢占，保证余额不为负
- **OpenAI 兼容**：`/v1/chat/completions` Bearer 鉴权 + SSE 流式，签发的 key 直接给 SDK / 客户端用
- **安全分层**：Admin Token + HttpOnly 签名会话 + Fernet 加密 api_key + 分层限流（消费默认 20 rps/key）
- **密钥存储**：只存 SHA-256 哈希，明文 key 仅签发时返回一次；api_key 支持 `${ENV}` 引用不落盘

## 现状

功能完整，Web 面板 / CLI / SDK 三种方式均可用。与 keyvault（本地加密钥匙串）是不同定位：keyvault 管"存"，key-tool 管"发"。

## 待补充

- Redis 多实例共享限流
- Webhook 通知额度告警
- 更多上游 Provider 适配
