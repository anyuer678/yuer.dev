---
slug: polycodehub
title: PolyCodeHub
subtitle: Full-stack Online Judge Platform
status: development
featured: false
date: 2026-08
tech: [TypeScript, JavaScript, Java, Spring Boot, Python, FastAPI, Node.js, Docker, Redis]
tags: [OJ, 全栈, 判题沙箱]
summary: 全栈在线判题（OJ）平台：题库练习、代码提交、实时判题、比赛与开发者社区，判题运行在进程级隔离沙箱中。
demo: https://anyuer678.github.io/polycodehub/
github: https://github.com/anyuer678/polycodehub
order: 7
---

## 项目介绍

背景：2025 年中期开始构思，2025 年 9 月写出雏形，2026 年迁移并持续完善。目标是做一个自用的在线判题平台：既能沉淀算法练习，又能承载比赛、题解与社区互动，把"练习 → 提交 → 判题 → 讨论"的闭环放在一个系统里。

现有方案（LeetCode / 各类 OJ）功能完整，但都是托管服务，无法自己掌控判题细节、数据与扩展方向，因此自己实现了一套从题库到判题沙箱的全栈方案。

## 设计目标

- 支持多语言提交：Python 3 / Node.js / C++ (g++ 14) / C (gcc 14) / Java 21
- 判题运行在进程级隔离沙箱中（`setuid` 降权 + seccomp 网络隔离 + 资源限制）
- Web 端覆盖完整使用：题库、提交、判题、比赛、每日一题、题解与社区
- 异步任务链路：判题任务经消息队列解耦，网关与判题服务各自伸缩
- 一键启动：Docker Compose 编排，脚本自动生成环境配置并做健康检查

## 功能

- 题库练习：题目列表、详情、难度与标签筛选
- 代码提交：多语言在线编辑器、提交记录与状态跟踪
- 实时判题：进程级沙箱评测，多测试点、内存/CPU/文件大小限制
- 比赛与每日一题：排位与日常练习入口
- 题解分享与社区：用户互动、讨论区
- 管理后台：题目、用户、比赛的维护入口

## 架构

```
Next.js 前端 ──→ Node.js + Express API 网关 ──→ Java 21 + Spring Boot 认证服务
                            │                          │
                            ├── Python 3.12 + FastAPI 判题服务（进程级沙箱）
                            │          └── RabbitMQ 异步判题链路
                            └── PostgreSQL 16（题库/用户/提交记录）
                                 Redis 7（排行榜 / 限流 / 鉴权缓存）
```

判题代码在沙箱内以 `setuid` 降权到专用 sandbox 用户，seccomp 拦截网络 socket，配合虚拟内存 / CPU / 进程数 / 文件描述符限制，防止提交代码触达内网或滥用资源。

## 技术选择

- **TypeScript / Next.js**：前端与类型安全，社区生态成熟，适合全栈快速迭代
- **Java 21 + Spring Boot**：认证服务，工程化成熟、稳定性好
- **Python 3.12 + FastAPI**：判题服务，脚本语言贴合评测逻辑，进程级沙箱方案可控
- **Node.js + Express**：API 网关，轻量且与前端同语言
- **PostgreSQL + Redis + RabbitMQ**：主存储、缓存/排行榜、异步任务解耦
- **Docker Compose**：编排与一键启动，统一开发与部署环境

## 开发过程

2025 年中期构思，9 月完成雏形；2026 年迁移到当前仓库并重构：补齐判题沙箱的安全边界（seccomp 网络隔离、资源限制），引入消息队列拆分判题链路，完善前端与后台功能。

## 挑战与解决

1. 判题安全 → 非容器进程级隔离：`setuid` 降权 + 清空补充组 + seccomp 拦截 `AF_INET`/`AF_INET6`/`AF_NETLINK`
2. 判题阻塞 → RabbitMQ 异步链路，判题任务排队执行，网关不阻塞
3. 一键部署 → `scripts/start.ps1` 自动检测 Docker daemon、生成 `.env`（随机强密码 + JWT 密钥）、健康检查等待

## 未来计划

- 题目数据扩充与难度体系完善
- 比赛系统完整化（报名、计分、榜单）
- 判题沙箱进一步加固与测试覆盖
- 支持更多语言与交互式判题

## 源码与 Demo

- [GitHub](https://github.com/anyuer678/polycodehub)
- [在线预览](https://anyuer678.github.io/polycodehub/)
