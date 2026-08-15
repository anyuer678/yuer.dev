---
slug: upgrademate
title: 旧代码升级器
subtitle: UpgradeMate
status: development
featured: false
date: 2026-08
tech: [Python, LLM]
tags: [重构, 工具]
summary: 规则驱动的跨语言代码升级：行级正则替换生成 unified diff 与风险分级报告，--apply 前自动备份可回滚；可选 LLM 只提示不改文件。
demo:
github: https://github.com/anyuer678/upgrademate
order: 11
cover: projects/upgrademate.svg
related: [upgrademate-notes]
journey: [{"date": "2026-08", "title": "雏形", "desc": "规则集驱动 + 三级风险报告 + 备份回滚"}]
---

## 项目介绍

老项目升级框架（Spring Boot 2 → 3、Python 2 → 3）时，大量是机械的替换工作，手动改容易漏。`upgrade` 命令行工具 + 本地 Web 面板：按规则集对旧代码做行级正则替换，输出 unified diff 与 high / medium / low 三级风险报告。

## 设计目标

- 安全默认：dry-run 绝不写文件；`--apply` 前先备份原文件并记录 upgrade_log.json（含前后 SHA256）
- 规则即 JSON：profile 一个 JSON 文件，缺字段加载即报错，全库 id 唯一
- 零第三方依赖：Python 3.9+ 标准库实现

## 功能

- 内置规则集：springboot3 / python3 / mysql8，行级正则替换
- 三级风险报告：high / medium / low，逐条附 explain 与示例
- 原子写入：临时文件 + os.replace；`--restore` 按 SHA256 比对只还原差异文件
- 防呆：正则静态检查拒绝灾难性回溯；超长行按未命中处理
- LLM 可选：对 high 风险且未覆盖的行给人工处理建议，只提示不改文件

## 架构

```
rules/*.json（id / priority / match / replace / explain / example）
        ↓
CLI upgrade → 规则加载校验 → dry-run 生成 diff + 风险报告
        ↓ --apply
备份原文件 → 原子替换 → upgrade_log.json（前后 SHA256）
        ↓ --restore
按 SHA256 比对还原
```

## 技术选择

- **Python 3.9+**：标准库实现，零第三方依赖，跨平台

## 开发过程

先定"规则即 JSON"的 profile 契约（id / priority / match / replace / explain / example），再实现 dry-run 与 diff 生成；安全链路（备份 → 原子替换 → 日志）最后接入。测试会对每条内置规则做断言。

## 挑战与解决

1. 替换破坏代码 → 默认 dry-run 绝不写文件；`--apply` 前备份原文件并记录前后 SHA256，`--restore` 按 SHA256 比对还原
2. 正则灾难性回溯 → 加载时静态检查拒绝；单行用 `re.subn`，count=0 视为未命中；>100KB 超长行按未命中处理
3. 写入安全 → 临时文件 + `os.replace` 原子替换，备份权限尽量 0600

## 未来计划

- 更多框架的规则集
- 跨行上下文匹配

## 源码

- [GitHub](https://github.com/anyuer678/upgrademate)
