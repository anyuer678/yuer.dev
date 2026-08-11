---
title: Redis 缓存与云原生运维：DevOps、CI/CD、IaC 与监控
date: 2026-06
type: learning
tags: [Redis, DevOps, CI/CD, 课程笔记]
summary: 开源操作系统课程的后半部分：Redis 数据类型与缓存三大问题、DevOps 与 CI/CD 流水线、Ansible/Terraform 基础设施即代码、Prometheus 监控，基于课件整理。
---

## 缓存分类与作用

| 类型 | 特点 | 示例 |
|---|---|---|
| 本地缓存 | 应用内，不可跨进程共享 | Caffeine, Ehcache |
| 分布式缓存 | 独立应用，可跨进程共享 | Redis, Memcached |

缓存解决三件事：减少数据库压力、提高响应速度、提升系统吞吐量。

## Redis 基础

Redis 是内存键值存储，单线程 + 非阻塞 I/O 多路复用（epoll）。

**5 种基本数据类型：**

| 类型 | 说明 | 常用命令 |
|---|---|---|
| String | 字符串 | SET, GET, INCR, APPEND |
| List | 双向链表 | LPUSH, RPUSH, LRANGE, LPOP |
| Hash | 哈希表 | HSET, HGET, HGETALL |
| Set | 无序集合 | SADD, SMEMBERS, SINTER, SUNION |
| Sorted Set | 有序集合 | ZADD, ZRANGE, ZRANGEBYSCORE |

Sorted Set 常用来做排行榜（score 排序）；`EXPIRE key 3600` 设过期时间。

**持久化两种方式：**

| 方式 | 原理 | 优点 | 缺点 |
|---|---|---|---|
| RDB | 定期快照 | 恢复快、文件小 | 可能丢数据 |
| AOF | 记录写命令 | 数据更安全 | 文件大、恢复慢 |

AOF 用 `appendfsync everysec` 每秒刷盘，兼顾安全与性能。

## 缓存三大问题

| 问题 | 现象 | 解决方案 |
|---|---|---|
| 缓存雪崩 | 大量 key 同时过期，请求全打到 DB | 过期时间加随机值 |
| 缓存穿透 | 查不存在的 key，每次都穿透到 DB | 布隆过滤器、缓存空值 |
| 缓存击穿 | 热点 key 过期瞬间高并发 | 互斥锁、逻辑过期 |

**双写一致性**：先更新数据库，再删除缓存（Cache Aside），不要先写缓存。

## DevOps 与 CI/CD

DevOps 是开发与运维协作的理念，靠自动化打通「代码 → 构建 → 测试 → 部署 → 监控」。CI/CD 是落地手段：

- **CI（持续集成）**：每次提交自动构建 + 跑测试，尽早发现集成问题
- **CD（持续交付/部署）**：通过验证的代码自动发布到环境

GitHub Actions 的 `on: push` + job 定义就是典型 CI；GitLab CI 用 `.gitlab-ci.yml` 写 stages（build → test → deploy）。

## 基础设施即代码（IaC）

用代码定义基础设施，可版本控制、可重复、可审计。两类工具：

| 工具 | 类型 | 语言 | 适用 |
|---|---|---|---|
| Ansible | 配置管理 | YAML | 服务器配置、应用部署 |
| Terraform | 资源编排 | HCL | 云资源管理 |

**Ansible 特点**：无 Agent（走 SSH）、Playbook 是 YAML、幂等（多次执行结果一致）。命令：`ansible-playbook site.yml --check` 预演、`--limit host1` 限定主机。

**Terraform 特点**：声明式定义期望状态、支持多云、用 state 文件跟踪资源。命令流：`terraform init` → `plan`（预览）→ `apply`（应用）→ `destroy`（销毁）。

## 监控与可观测性

可观测性三支柱：

| 支柱 | 说明 | 工具 |
|---|---|---|
| Metrics 指标 | 数值型时序数据 | Prometheus, InfluxDB |
| Logging 日志 | 文本事件记录 | ELK/EFK, Loki |
| Tracing 链路追踪 | 请求调用链 | Jaeger, Zipkin, SkyWalking |

**Prometheus** 是时序数据库，Pull 模式抓指标，PromQL 查询，AlertManager 告警：

```promql
# CPU 使用率
100 - avg by(instance)(rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100
```

**ELK 日志栈**：Elasticsearch（搜索分析）+ Logstash/Fluentd（收集处理）+ Kibana（可视化）。

## 易混点

- 雪崩是「大量同时过期」，穿透是「查不存在」，击穿是「单个热点过期」
- RDB 是快照、AOF 是追加命令日志；RDB 丢数据但快，AOF 安全但慢
- Ansible 管「服务器上的配置」，Terraform 管「云上的资源」；Ansible 幂等，Terraform 有状态
