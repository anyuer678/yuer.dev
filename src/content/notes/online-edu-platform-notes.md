---
title: OnlineEduPlatform 在线教育平台（实训笔记）
date: 2026-07
type: project
tags: [Qt, C++, SQLite, 实训]
summary: 暑期实训团队项目：Qt/C++ 在线教育平台，课程直播、录播回放、在线作业、互动白板四大模块，SQLite 持久化。
---

## 项目介绍

暑期实训的团队项目，用 Qt 写一个在线教育平台 OnlineEduPlatform。定位是桌面端在线教学工具，功能围绕"教"和"学"展开：老师可以直播和布置作业，学生可以看回放、交作业，双方共用互动白板。

## 技术栈

Qt 5.15 Widgets + Qt Quick/QML，C++17。pro 文件引入 multimedia、sql、network、concurrent、websockets 模块。后端逻辑集成在 Qt 应用内（EduBackend），数据用 SQLite（edu_data.db，自动建 courses 等表）。

## 功能模块

| 模块 | 内容 |
|---|---|
| 课程直播 | QCamera 本地推流与录制（录到 Videos/EduTech 目录） |
| 录播回放 | EduMediaHandler 管理媒体文件 |
| 在线作业 | 教师端布置 / 学生端提交，按角色区分页面 |
| 互动白板 | WhiteboardManager 画图并保存 png 截图 |
| 附加 | 弹幕（Danmaku）、学习进度追踪、中英语言切换、屏幕共享 |

## 踩过的坑

- QML 与 C++ 交互：属性绑定和信号槽要理清，白板画图坐标在窗口缩放后会偏移，需要按缩放比例换算
- 本地推流录制：QCamera 采集的格式和 QMediaRecorder 期望的容器要匹配，否则录出来打不开
- SQLite 并发访问：作业提交和进度写入同时发生会锁库，改成单连接 + 队列写入

## 我的收获

- Qt Quick/QML 的开发模式和 Widgets 差别很大，声明式 UI 写起来快，但和 C++ 数据模型对接时要小心生命周期
- 桌面应用的多媒体链路（采集 → 编码 → 存储 → 回放）比想象中复杂，每一环的格式都要对齐
- 团队实训的文档交付（分析报告、需求说明书、总结报告、实习日志）本身就是一次完整软件工程演练
