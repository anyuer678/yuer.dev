---
title: 决策留痕与可换后端设计
date: 2026-08
tags: [工程方法论, 决策, 架构, DeepSeek Harness]
summary: 两套从 DeepSeek Harness 借鉴的工程纪律：决策留痕（每个非平凡决策留下可追溯记录）和可换后端设计（三角模型抽象，换实现不改消费方）。配合使用效果最佳。
---

## 背景

做个人项目的常见问题：代码写了三个月后回头看，已经不记得"为什么选 A 不选 B"。更糟的是，换一个库/后端时发现到处硬编码，改一处崩三处。DeepSeek Harness 的工程实践提供了两个轻量解法。

## 一、决策留痕（Decision Notes）

### 核心理念

**每个非平凡决策都留下可追溯、可检索、可重建的记录。** 结论换会话/换人也能重建。

### 什么时候写

**必须写：**
- 架构 / 模块取舍（为什么选 A 不选 B）
- 配置变更（改了什么、为什么、怎么验证的）
- 技能 / 插件装配（来源、许可证、安全措施）
- 踩坑修复（根因 + 修复 + 防复发）

**不用写：** 打字修复、琐碎重构、纯格式调整。

### 模板

```markdown
# <YYYY-MM-DD>-<主题>

## 背景
（问题或上下文，一句话到三段）

## 决策
（做了什么选择，给出明确的结论句）

## 依据
（为什么选这个：技术约束、成本、风险、 precedent）

## 影响
（谁会受影响、需要同步改什么、有没有 breaking change）

## 状态
implemented → archived（已归档 = 已验证无副作用）
```

### 生命周期

```
草稿 → implemented → archived
         ↓
      （如果发现决策有误）重新打开 → 修正 → archived
```

## 二、可换后端设计（Capability Seam）

### 核心理念

**一个可替换的能力 = 三个角色**——Service Definition（接口）、Service Provider（实现）、Consumer（使用者）。三个角色齐了才算完整。

### 三角色职责

| 角色 | 职责 | 反模式 |
|---|---|---|
| **Service Definition** | 声明能力接口、契约、事件；不碰实现 | 接口泄漏实现细节 |
| **Service Provider** | 实现接口；可多个并存、按配置选择 | provider 之间互相 import |
| **Consumer** | 只用 Definition 声明的接口做事 | import 具体 provider |

### 什么时候需要

**需要：**
- 同一能力有多个候选实现（本地 / 远程、免费 / 付费）
- 换实现时不想动使用方代码
- 能力边界清晰、可以独立演进

**不需要（别过度设计）：**
- 只有一个实现、也没有替换预期
- 接口只有一个使用者、实现也不变

### 实战示例：LLM 调用

```ts
// Definition
interface LLMProvider {
  chat(messages: Message[], options?: ChatOptions): Promise<Response>
}

// Providers（可多个并存）
class DeepSeekProvider implements LLMProvider { ... }
class ZhipuProvider implements LLMProvider { ... }

// Consumer（只依赖 Definition）
function askQuestion(provider: LLMProvider, q: string) {
  return provider.chat([{ role: 'user', content: q }])
}
```

换后端时：只改配置，Consumer 代码零改动。

## 两者配合

决策留痕解决"为什么这么设计"，可换后端解决"怎么设计才能灵活"。最佳实践：

1. **设计阶段**：用 capability seam 三角模型评估是否需要抽象
2. **决策时刻**：用 decision-notes 模板记录"为什么选这个抽象级别"
3. **维护阶段**：archived 的决策笔记 = 系统的"设计意图文档"
