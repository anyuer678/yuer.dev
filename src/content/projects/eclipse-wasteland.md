---
slug: eclipse-wasteland
title: ECLIPSE 荒原防线
subtitle: Browser FPS PVE Shooter
status: development
featured: false
date: 2026-08
tech: [TypeScript, Vite, Three.js]
tags: [游戏, Three.js, 前端]
summary: 浏览器端 FPS PVE 射击游戏：多波次副本、无尽爬塔、Roguelite 局内成长与深度养成系统，纯前端无后端，Three.js 渲染。
demo: https://anyuer678.github.io/eclipse-wasteland/
github: https://github.com/anyuer678/eclipse-wasteland
order: 15
cover: projects/eclipse-wasteland.svg
journey: [{"date": "2026-08", "title": "开发中", "desc": "副本/爬塔 + 局内成长 + 深度养成系统，AI 协同开发"}]
---

## 项目介绍

浏览器端 FPS PVE 射击游戏：多波次副本、无尽爬塔、Roguelite 局内成长与深度养成系统。集百家之所长：武器机制、数值体系、敌人设计与养成框架的灵感来自多款经典射击与 Roguelite 游戏，经过重新设计与融合，形成一套原创的 PVE 玩法循环。

## 设计目标

- 纯前端：localStorage 存档，无后端，任意静态服务器可部署
- 深度养成：武器同步 / 进阶 / 符文词缀 / 附魔 / 巅峰突破 + 天赋树
- 局内构筑：击杀升级 → 三选一强化（12 种 BUFF 可叠加），每局独立

## 功能

- 副本：废弃设施 / 废弃矿场 / 地下实验室，多波次 PVE，通关结算
- 试炼之塔：无限层爬塔，精英层（每 3 层）与补给层（每 7 层）制造节奏起伏
- 敌人：7 种兵种 + 精英词缀（狂怒/厚甲/再生）+ 2 个 BOSS
- 武器：10 把 × 10 种机制（能量爆发 / 形态切换 / 索敌 / 减速 / 蓄力 / 光束 / 连锁闪电 / 治疗 / 三连发 / 穿透）
- 角色：5 名（影袭者隐身 / 机甲师召唤 / 炎术士灼烧场 / 圣徒治疗场 / 狂战士狂暴）
- 战斗细节：弹道亮线 / 伤害数字 / 连杀 / BUFF 球 / 高地加成 / 可破坏箱 / 毒池陷阱 / 局内商店

## 架构

```
src/
  arsenal/   武器配表 / 弹道 / 持枪视角
  campaign/  任务流程 / BOSS / 波次
  growth/    养成（武器 / 天赋 / 角色 / 每日 / 成就）
  horde/     敌人定义 / 生成器
  play/      角色 / 局内商店 / 武器库
  render/    世界构建 / 材质 / 光照
  shell/     UI 外壳（菜单 / HUD / 各界面）
  main.ts    主循环
```

## 技术选择

- **Three.js**：程序化建模 + 开源 GLB 模型 + 阴影，浏览器 3D 渲染
- **TypeScript + Vite**：类型安全与快速构建

## 开发过程

AI 协同开发：DeepSeek 全程深度参与——资料搜集与设计（多款射击与 Roguelite 游戏的武器机制、数值体系、养成框架调研整理成设计依据）、10 把武器的机制差异与敌人行为树、BOSS 招式、局内成长构筑均由 AI 设计实现；玩家侧负责提出设计思路、修正数值与体验问题（命中判定、地形高度、UI 布局），并全程把关功能迭代方向。代码审查（正确性/性能/存档安全）由子代理执行并修复。

## 挑战与解决

1. 玩法深度 → 集百家之长的设计：武器 10 种机制 × 敌人 7 兵种 + 精英词缀 + 2 BOSS + 12 种局内 BUFF，形成原创 PVE 循环
2. 纯前端约束 → localStorage 存档，无后端，任意静态服务器可部署
3. 数据安全 → 存档安全纳入代码审查项，养成数据与局内构筑独立管理

## 未来计划

- 更多武器机制与敌人行为树
- 局内构筑的深度扩展

## 源码与 Demo

- [GitHub](https://github.com/anyuer678/eclipse-wasteland)
- [在线预览](https://anyuer678.github.io/eclipse-wasteland/)
