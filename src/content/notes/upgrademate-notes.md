---
title: 旧代码升级器
date: 2026-08
tags: [Python, 重构, 工具]
summary: 规则驱动的跨语言代码升级：行级正则替换生成 unified diff 与风险分级报告，--apply 前自动备份可回滚；可选 LLM 只提示不改文件。雏形已实现，未完成。
---

## 背景

老项目升级框架（比如 Spring Boot 2 → 3、Python 2 → 3）时，大量是机械的替换工作，手动改容易漏。想做一个规则驱动的升级工具：替换之前先看 diff，风险分级，还能回滚。

## 做了什么

`upgrade` 命令行工具 + 本地 Web 面板：按规则集（内置 springboot3 / python3 / mysql8）对旧代码做行级正则替换，输出 unified diff 与 high / medium / low 三级风险报告。

## 关键点

- **零第三方依赖**：Python 3.9+ 标准库实现
- **规则即 JSON**：`rules` 目录下每个 profile 一个 JSON 文件，字段含 id / priority / match / replace / explain / example_before / example_after；缺字段加载即报错，全库 id 唯一
- **安全默认**：dry-run 绝不写文件；`--apply` 前先备份原文件（权限尽量 0600）并记录 upgrade_log.json（含前后 SHA256）；写入用"临时文件 + os.replace"原子替换；`--restore` 按 SHA256 比对只还原差异文件
- **防呆**：正则静态检查拒绝灾难性回溯；单行替换用 re.subn，count=0 视为未命中；>100KB 超长行按未命中处理
- **LLM 可选**：`--llm` 对 high 风险且未覆盖的行给人工处理建议，只提示不改文件；退出码区分无 high / 有 high / 参数错误等

## 现状

雏形可用，测试会对每条内置规则做断言；webui 只做内存 dry-run，绝不写盘。免责声明明确：按行级正则语义工作，不解析语法，不保证升级后能编译、行为不变。

## 待补充

- 更多框架的规则集
- 跨行上下文匹配
