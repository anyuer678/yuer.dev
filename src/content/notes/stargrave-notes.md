---
title: Star 清理建议器
date: 2026-08
tags: [GitHub, Python, 工具]
summary: 扫描 GitHub star 仓库，本地规则判断哪些已死、哪些值得复查，可选 LLM 复核，unstar 幂等可回滚；token 只走环境变量。雏形已实现，未完成。
---

## 背景

GitHub star 攒了一堆，很多仓库两年没动静、甚至 archived，躺在列表里成了噪声。想定期清理，但一个个看太费时间。

## 做了什么

`starclean` 命令行工具：扫描 star 列表 → 判定每仓库该 unstar / revisit / keep → 生成报告 → 安全执行 unstar，全程可回滚。

## 关键点

- **判定逻辑**：本地硬规则兜底（2 年无 push、archived、低 star），可选叠加 LLM 复核；没配 key 时优雅降级为纯规则，JSON 解析失败标记 unknown 且不动作
- **幂等 + 缓存**：`unstarred_at` 记录在案，重复执行自动跳过；仓库元数据 24h 本地缓存（SQLite），`--refresh` 强制刷新
- **限流保护**：请求间隔 0.5s，遇 403 立即急停
- **Token 安全**：只从环境变量读取，`--token` 仅接受 `env:VAR` 形式，拒绝明文
- **LLM 只读**：只收到仓库公开元数据摘要（名称、star 数、语言、最近 push、描述截断），要求返回 JSON 判定，不上传任何使用数据

## 现状

雏形可用，测试全部用 mock 假响应不触网；所有 unstar / undo 都要人工 `--yes` 最终确认。评分示例：仅 5 star 且 1038 天无 push 的仓库直接给 unstar 建议。

## 待补充

- 报告的可视化展示
- 与浏览器书签同步的考虑
