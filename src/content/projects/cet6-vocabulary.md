---
slug: cet6-vocabulary
title: CET-6 词汇背诵系统
subtitle: CET-6 词汇学习系统
status: completed
featured: false
date: 2026-07
tech: [JavaScript, HTML, CSS]
tags: [Learning]
summary: CET-6 全词库 5023 词：背诵、默写、回忆、选择题四种模式 + 错词本，离线发音，Web / Windows / Android 三端。
demo: https://anyuer678.github.io/cet6-vocabulary/
github: https://github.com/anyuer678/cet6-vocabulary
order: 5
related: [quiz-tools-notes, ai-design-notes]
cover: projects/cet6-vocabulary.png
journey: [{"date": "2026-07", "title": "开始开发", "desc": "CET-6 词汇背诵系统，覆盖考试大纲全部 5023 词"}]
---

## 项目介绍

一套 CET-6 背词工具，覆盖考试大纲全部 5023 词：背诵、默写、回忆、选择题四种学习模式，带动画、离线发音、错词本与彩色主题，支持 Web、Windows、Android 三端。

## 设计目标

- 全词库：CET-6 考试大纲全部 5023 词
- 多模式：背、默、回忆、考试场景全覆盖
- 坚持导向：错词本 + 学习统计 + 番茄钟，让复习有节奏

## 功能

- 单词背诵：卡片式浏览，英式/美式发音切换
- 单词默写：根据释义与音标拼写单词
- 回忆训练：释义猜词、单词配对、听写练习、限时闯关
- 选择题：四选一释义选择，模拟考试场景
- 错词本：自动记录错误单词，针对性复习
- 学习统计：掌握进度、学习量、排行榜、打卡记录
- 番茄钟专注计时，单词笔记，TTS 离线发音（口音/语速可调）
- 16 种彩色主题，深色/浅色模式

## 架构

原生 HTML/CSS/JS 单页应用（www/）+ Electron 桌面壳 + Capacitor Android 壳；
词库与进度存 localStorage，TTS 走 eSpeak-ng 离线引擎。

## 技术选择

- **原生 JavaScript (ES6+)**：零框架依赖，三端一套源码
- **eSpeak-ng**：离线 TTS，发音不依赖网络
- **Electron / Capacitor**：桌面与移动端壳，复用同一份 www

## 开发过程

先做背诵核心 + 词库 → 加默写与回忆模式 → 错词本与统计 →
发音引擎接入 → Electron / Android 打包 → 迭代至最终版。

## 挑战与解决

1. 离线发音 → eSpeak-ng 本地合成，口音/语速可调
2. 大词库性能 → 按需加载 + localStorage 分批持久化
3. 复习节奏 → 错词本 + 统计热区，优先复习薄弱词

## 未来计划

- 计划更换全新 UI 与架构，进行彻底重构
- 墨水屏版（eink）已在开发中，见下方链接

## 源码与 Demo

- [GitHub](https://github.com/anyuer678/cet6-vocabulary)
- [在线预览（功能受限）](https://anyuer678.github.io/cet6-vocabulary/)
- 墨水屏版：[cet6-vocabulary-eink](https://github.com/anyuer678/cet6-vocabulary-eink)（同系列）
