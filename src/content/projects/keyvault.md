---
slug: keyvault
title: API 密钥保险箱
subtitle: KeyVault
status: development
featured: false
date: 2026-08
tech: [Python]
tags: [安全, 工具]
summary: 本地加密钥匙串管 LLM API Key / GitHub Token：主密码不落盘，scrypt 派生 + AES-256-GCM 加密，audit 扫明文但值永不打印。
demo:
github: https://github.com/anyuer678/keyvault
order: 14
cover: projects/keyvault.svg
related: [keyvault-notes]
journey: [{"date": "2026-08", "title": "雏形", "desc": "AES-256-GCM 加密钥匙串 + audit 审计 + shell 注入"}]
---

## 项目介绍

API Key 越攒越多（OpenAI / DeepSeek / Anthropic / GitHub Token），散落在 .env 和配置文件里，既不安全也不好管理。`kv` 命令行工具 + tkinter GUI：主密码不落盘，密钥以 AES-256-GCM 密文存本地单文件 `secrets.db`。

## 设计目标

- 加密设计：scrypt（N=2^15, r=8, p=1）派生主密钥 + AES-256-GCM，每条独立 nonce，AAD 绑 name+provider 防篡改
- 主密钥只存进程内存，退出即失效；主密码丢失 = 数据不可恢复，无后门
- 零网络：除打印轮换指引 URL 外不发起任何网络调用

## 功能

- 命令集：init / add / get / list / use / edit / delete / audit / rotate / export-backup / import-backup / shell-init / gui
- 审计：`kv audit` 扫描 .env/.ini/.toml/.config 里的明文密钥，值永不打印（打码 REDACTED）
- 日常使用：`kv use deepseek` 注入当前 shell 或写 0600 临时 .env；`kv get` 默认只显示摘要（`sk-…****h4`）
- 篡改检测：密文/标签/nonce 被改直接抛错；删除需输 yes 确认

## 架构

```
kv CLI / tkinter GUI
  └── scrypt 派生主密钥（进程内存）
        └── AES-256-GCM 加密 → secrets.db（单文件，每条独立 nonce + AAD）
  └── kv audit → 扫描配置文件中的明文密钥（值打码）
```

## 技术选择

- **Python 标准库 + cryptography**：加密原语成熟，CLI 跨平台

## 开发过程

按文档实现后对照修正：先定加密设计（scrypt 派生 + AES-256-GCM + AAD），再实现命令集与审计；README 专门写了"实现说明（与架构文档的偏差）"一节。

## 挑战与解决

1. 密钥安全 → 主密码不落盘，主密钥只存进程内存、退出即失效；主密码丢失 = 数据不可恢复，无后门
2. 篡改防护 → 每条独立 nonce，AAD 绑 name+provider；密文/标签/nonce 被改直接抛错
3. Windows 权限 → os.chmod 的 0600 只影响只读位，README 提示需配合磁盘加密

## 未来计划

- 跨平台 GUI 打磨
- 与浏览器 / IDE 插件的集成

## 源码

- [GitHub](https://github.com/anyuer678/keyvault)
