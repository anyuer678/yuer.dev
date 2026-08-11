---
title: API 密钥保险箱
date: 2026-08
tags: [安全, Python, 工具]
summary: 本地加密钥匙串管 LLM API Key / GitHub Token：主密码不落盘，scrypt 派生 + AES-256-GCM 加密，audit 扫明文但值永不打印。雏形已实现，未完成。
---

## 背景

API Key 越攒越多（OpenAI / DeepSeek / Anthropic / GitHub Token），散落在 .env 和配置文件里，既不安全也不好管理。想做一个本地加密钥匙串。

## 做了什么

`kv` 命令行工具 + tkinter GUI：主密码（Key）不落盘，密钥以 AES-256-GCM 密文存本地单文件 `secrets.db`，支持 init / add / get / list / use / edit / delete / audit / rotate / export-backup / import-backup / shell-init / gui 等命令。

## 关键点

- **加密设计**：scrypt（N=2^15, r=8, p=1）派生主密钥 + AES-256-GCM，每条独立 nonce，AAD 绑 name+provider 防篡改；主密钥只存进程内存，退出即失效
- **零网络**：除打印轮换指引 URL 外不发起任何网络调用
- **审计**：`kv audit` 扫描 .env/.ini/.toml/.config 里的明文密钥，值永不打印（打码 REDACTED）
- **日常使用**：`kv use deepseek` 可注入当前 shell 或写 0600 临时 .env；`kv get` 默认只显示摘要（`sk-…****h4`）
- **安全边界**：主密码丢失 = 数据不可恢复，无后门；篡改密文/标签/nonce 直接抛错；删除需输 yes 确认

## 现状

雏形可用，README 有测试章节和"实现说明（与架构文档的偏差）"一节，说明是按文档实现后再对照修正的。Windows 上 os.chmod 的 0600 只影响只读位，README 提示需配合磁盘加密。

## 待补充

- 跨平台 GUI 打磨
- 与浏览器 / IDE 插件的集成
