---
slug: codedrill
title: CodeDrill
subtitle: Java Coding Practice Platform
status: completed
featured: true
date: 2026-07
tech: [Java, Spring Boot, Vue 3]
tags: [Learning]
summary: 自己的 Java 练习平台：题目、判题与提交记录，用完整项目倒逼自己掌握 Spring Boot 全流程。
demo: https://anyuer678.github.io/codedrill/
github: https://github.com/anyuer678/codedrill
order: 2
---

## 项目介绍

学 Java 需要练，但刷题网站体验割裂。CodeDrill 是自己搭的练习平台，
从 0 到 1 走完 Spring Boot 后端 + Vue 前端的完整链路。

## 设计目标

- 覆盖 50 道自编 Java 练习题
- 提交即判题，结果与耗时反馈清晰
- 用真实项目理解 Web 开发全流程（不只看教程）

## 功能

- 题目列表与详情（支持 Markdown 题目描述）
- 代码提交与沙箱判题（编译、运行、用例比对）
- 提交历史与通过率统计

## 架构

Spring Boot（REST API + 判题队列）←→ Vue 3 前端；
判题任务放入内存队列异步执行，避免请求阻塞。

## 技术选择

- **Spring Boot**：学习主线的第一落点，标准 Web 栈
- **Vue 3**：与个人网站统一技术栈，维护成本低

## 开发过程

2026-06 起步 → 先做判题核心（编译与用例比对）→ 题目管理 → 前端界面 → 收尾。

## 挑战与解决

1. 沙箱安全 → 判题进程隔离 + 资源限制（时间/内存）
2. 判题耗时 → 异步队列 + 状态轮询

## 未来计划

- 已满足学习目标，转入维护模式（archived 候选）

## 源码与 Demo

- [GitHub](https://github.com/anyuer678/codedrill)
