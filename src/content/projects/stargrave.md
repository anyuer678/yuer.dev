---
slug: stargrave
title: Star 清理建议器
subtitle: StarGrave
status: development
featured: false
date: 2026-08
tech: [Python, LLM, AI]
tags: [GitHub, 工具]
summary: 扫描 GitHub star 仓库，本地规则判断哪些已死、哪些值得复查，可选 LLM 复核，unstar 幂等可回滚；token 只走环境变量。
demo:
github: https://github.com/anyuer678/stargrave
order: 10
cover: projects/stargrave.svg
related: [stargrave-notes]
journey: [{"date": "2026-08", "title": "雏形", "desc": "扫描 → 规则判定 → LLM 复核 → 安全 unstar 全链路"}]
---

## 项目介绍

GitHub star 攒了一堆，很多仓库两年没动静、甚至 archived，躺在列表里成了噪声。`starclean` 命令行工具：扫描 star 列表 → 判定每仓库该 unstar / revisit / keep → 生成报告 → 安全执行 unstar，全程可回滚。

## 设计目标

- 本地规则兜底：无 LLM key 也能用
- 安全执行：所有 unstar / undo 都要人工 `--yes` 最终确认
- Token 安全：只从环境变量读取，拒绝明文

## 功能

- 判定逻辑：本地硬规则（2 年无 push、archived、低 star），可选叠加 LLM 复核
- 幂等 + 缓存：`unstarred_at` 记录在案，重复执行自动跳过；仓库元数据 24h 本地缓存（SQLite），`--refresh` 强制刷新
- 限流保护：请求间隔 0.5s，遇 403 立即急停
- LLM 只读：只收到仓库公开元数据摘要，要求返回 JSON 判定，不上传使用数据

## 架构

```
star 列表扫描 → 规则引擎（硬规则 / LLM 复核）→ 报告 → unstar（幂等，可回滚）
                     ↑
              SQLite 24h 缓存 / 限流保护
```

## 技术选择

- **Python**：CLI 工具生态成熟，标准库 + requests 即可
- **SQLite**：仓库元数据缓存，零部署成本

## 开发过程

先实现本地硬规则判定（2 年无 push、archived、低 star），再叠加可选 LLM 复核；unstar 执行走幂等 + 缓存设计。测试全部用 mock 假响应，不触网。

## 挑战与解决

1. 误操作风险 → 所有 unstar / undo 必须人工 `--yes` 确认，`unstarred_at` 记录实现幂等跳过
2. Token 安全 → 只从环境变量读取，`--token` 仅接受 `env:VAR` 形式，拒绝明文
3. API 限流 → 请求间隔 0.5s，遇 403 立即急停；仓库元数据 24h SQLite 缓存，`--refresh` 强制刷新

## 未来计划

- 报告的可视化展示
- 与浏览器书签同步的考虑

## 源码

- [GitHub](https://github.com/anyuer678/stargrave)
