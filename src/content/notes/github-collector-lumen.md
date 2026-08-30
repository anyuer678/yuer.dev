---
title: 让 Agent 看懂我的 28 个仓库
date: 2026-08
tags: [lumen, developer-intelligence, 架构, MCP, 采集器]
summary: 打通"GitHub 采集器 → SQLite 事实库 → Analyst 检索 → lumen MCP 调用"的完整闭环——方向 B（代码智能）从空中楼阁变成可运行插件，评分 6.0→6.8。
---

## 背景

developer-intelligence 的 repo-intel-core 引擎有 110 个测试，但核心产品 github-intelligence 的**采集器**一直标着"时序锁"未开工——没有数据源的"理解平台"不成立，产品分只有 3.5。

## 这一轮做了什么

### 1. 采集器（pgi sync）

新写 `src/pgi/sync.py`：GitHub REST 分页采集 repos/commits/issues/releases/my_stars 五类事实，UPSERT 幂等，sync_state 游标增量。

```bash
GITHUB_TOKEN=xxx pgi sync --db pgi.db
```

**验收教训**：第一次提交没跑本地测试（只做了语法检查），mock 契约错误导致 1 个测试红——验收 AI 实测时抓到。教训：**语法检查≠测试通过，涉及逻辑的提交必须真跑 pytest**。

### 2. 端到端验证闭环

匿名限流下真实采集到 3 个仓库 + 1 个 release，确认 `扫描 → 入库 → Timeline/Analyst 查询` 链路真的通。

### 3. lumen 接入（MCP 插件化）

pgi 本就有 5 个 memory.* 工具 + stdio JSON-RPC 调度器，lumen 的 MCP 客户端支持 stdio 且 `python` 在命令白名单内——两边的接入点都是现成的。

```bash
curl -X POST http://127.0.0.1:18080/v1/mcp \
  -d '{"name":"pgi-memory","command":"python",
       "args":["-m","pgi","mcp","--db","<abs>/pgi.db"],
       "transport":"stdio"}'
```

## 通路

```
GITHUB_TOKEN=xxx pgi sync
  → SQLite(事实)                      # repos/commits/issues/releases/stars
    → pgi ask                          # CLI 直接问（无 lumen 也能用）
    → lumen MCP (memory_search 等 5 工具)
      → "lumen，分析我哪个仓库最有救"
```

## 为什么这符合方向 A

方向 B（代码智能）的采集器不独立作战，而是**成为 lumen 的"理解仓库"插件**——两条主线在采集器这里交汇。lumen 是 Agent 基础设施的主角，pgi 给它装上"看懂代码世界"的眼睛。

## 下一步

1. 用 pgi sync 对自己的 28 个仓库跑一遍完整采集，把真实数据喂给 Analyst
2. lumen 注册 pgi-memory 后，让它回答"我哪个仓库值得继续投入"
3. 把结果写进月报——这既是 dogfood 也是最好的产品文档