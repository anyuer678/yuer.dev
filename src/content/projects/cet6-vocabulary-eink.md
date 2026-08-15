---
slug: cet6-vocabulary-eink
title: CET-6 墨水屏版
subtitle: CET-6 Vocabulary (E-Ink)
status: completed
featured: false
date: 2026-07
tech: [JavaScript, Electron, Capacitor]
tags: [学习, E-Ink, 跨端]
summary: 针对 E-Ink 墨水屏优化的 CET-6 词汇应用：去彩色动画、保留完整学习功能，提供低功耗护眼阅读体验；Web / Android / Windows 三端。
demo: https://anyuer678.github.io/cet6-vocabulary-eink/
github: https://github.com/anyuer678/cet6-vocabulary-eink
order: 18
cover: projects/cet6-vocabulary-eink.svg
journey: [{"date": "2026-07", "title": "完成", "desc": "E-Ink 优化版：去动画、高对比度，三端构建"}]
---

## 项目介绍

针对 E-Ink 电子墨水屏设备优化的 CET-6 词汇学习应用：去除彩色动画和动效，保留完整学习功能，提供低功耗、护眼的阅读体验。与彩色版相比，主打高对比度、粗边框、衬线字体、纯色背景。

## 设计目标

- 护眼低功耗：去动画、黑白为主、纯色背景
- 功能完整：背诵 / 练习 / 错词本 / 统计一个不少
- 多端覆盖：Web / Android（APK）/ Windows（EXE）

## 功能

- 单词背诵：极简卡片式浏览
- 练习模式：释义猜词、默写、配对、听写、限时闯关、选择题
- 错词本：自动记录，针对性复习
- 学习统计：掌握进度、打卡、排行榜
- 笔记系统：纯文本笔记
- 显示设置：字号、卡片样式、背景主题、屏幕方向
- 发音设置：TTS 离线引擎（eSpeak-ng）、口音/语速调节

## 架构

```
word-eink/
  css/       E-Ink 优化样式
  js/        应用脚本（app.js）
  data/      词库数据（cet6-words.js）
  phon/      发音音频
  electron/  Electron 主进程（Windows EXE）
  android/   Android 工程（Capacitor，APK）
  scripts/   辅助脚本
```

## 技术选择

- **原生 HTML / CSS / JavaScript**：无框架，轻量启动
- **Electron**：Windows 桌面壳；**Capacitor**：Android 打包
- **eSpeak-ng**：TTS 离线发音引擎
- **localStorage**：数据本地持久化

## 开发过程

在彩色版基础上做 E-Ink 专项优化：先梳理彩色版的动画/主题/动效依赖点，再逐一替换为高对比度、粗边框、纯色背景的墨水屏样式；发音切到 eSpeak-ng 离线引擎，保留完整学习功能。

## 挑战与解决

1. 护眼与功能平衡 → 去彩色动画但保留背诵/练习/错词本/统计全部功能，黑白为主 + 衬线字体提升可读性
2. 静态环境限制 → TTS 离线发音引擎、IndexedDB 在 GitHub Pages 静态环境下受限，提供 Web / Android APK / Windows EXE 三端安装包
3. 多端构建 → Electron 桌面壳 + Capacitor Android 打包，`build.ps1` 交互式选择构建目标

## 未来计划

- 与彩色版功能同步迭代

## 源码与 Demo

- [GitHub](https://github.com/anyuer678/cet6-vocabulary-eink)
- [在线预览](https://anyuer678.github.io/cet6-vocabulary-eink/)
