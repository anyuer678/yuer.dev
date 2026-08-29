---
title: 从 DeepSeek Harness 提炼的 6 条架构原则
date: 2026-08
tags: [架构, 原则, DeepSeek Harness, 工程方法论]
summary: 从 DeepSeek Harness 提炼的 6 条可迁移架构原则——注册即副作用、模型所见必可重建、显式优于隐式、错误要大声、事件是扩展点、能力可换后端。
---

## 背景

DeepSeek Harness（dsh）是一个开源 AI Agent 框架，一切皆插件——模型、工具、沙箱、会话存储、UI 甚至 Agent 循环本身都是插件。这种极端插件化的设计迫使它在架构层面解决了很多"系统长歪了"的共性问题。以下 6 条原则是从中提炼的可迁移范式，不绑定 dsh 内部 API。

## 6 条原则

### 1. 注册即副作用（Registrations are effects）

一切"把自己挂到系统上"的动作都是**可逆副作用**：注册返回 disposer（卸载函数），卸载时完整回滚。

```ts
// 好：注册即返回撤销
const dispose = registry.register(x)
// 生命周期结束 → dispose()

// 坏：全局塞进数组/单例，没人负责撤销
globalRegistry.push(x) // 卸载时怎么办？
```

**适用**：插件系统、事件监听、动态能力。**判断标准**：你的"注册"能撤销吗？不能就是隐患。

### 2. 模型所见必可重建（Model-visible ⟺ logged）

任何到达模型（或用户）的输入，必须能从持久日志重建。加新输入 = 加新日志事件。

```ts
// 好：注入上下文先落日志，再从日志派生态模型输入
const context = buildContext(logEntries)

// 坏：内存里算完直接塞给模型，日志里查不到
const context = computeInMemory()
```

**适用**：Agent 上下文管理、审计日志、可观测性。**判断标准**：如果日志丢了，模型的输入能从头重建吗？

### 3. 显式优于隐式（Explicit over implicit）

配置、依赖、行为变更必须有显式的声明点。不要靠"约定"、"默认值"或"全局状态"传递隐式信息。

```ts
// 好：显式声明依赖
const service = createService({ db, logger, config })

// 坏：全局变量/单例隐式注入
import { db } from '@/globals' // 谁都可能改它
```

**适用**：依赖注入、配置管理、模块间通信。**判断标准**：读代码的人能从调用签名看出所有依赖吗？

### 4. 错误要大声（Errors must be loud）

错误不能被吞掉、静默降级或返回 null 让调用方自己猜。要么抛出，要么写日志，要么返回明确的错误类型。

```ts
// 好：错误明确且可追踪
if (!result) throw new Error(`Failed to load config: ${path}`)

// 坏：静默返回空，调用方不知道发生了什么
return result ?? null // 调用方：是没配置还是配置错了？
```

**适用**：所有错误路径。**判断标准**：出错后，用户/开发者能在 30 秒内定位原因吗？

### 5. 事件是扩展点（Events are extension points）

系统行为变更优先通过事件机制扩展，而不是修改核心代码。事件 = 可订阅的钩子，不是"广播通知"。

```ts
// 好：通过事件扩展行为
emitter.on('tool:beforeExecute', (tool) => {
  if (isDangerous(tool)) return cancel()
})

// 坏：在核心循环里 hardcode 扩展逻辑
if (tool.name === 'dangerous-tool') { /* 特殊处理 */ }
```

**适用**：插件系统、中间件、拦截器。**判断标准**：不改核心代码，能增加/修改系统行为吗？

### 6. 能力可换后端（Capability seam）

当一个能力可能有多个实现时，用三角模型抽象：Service Definition（接口）/ Provider（实现）/ Consumer（使用者）。换后端不改消费方。

```ts
// Service Definition：声明能力接口
interface LLMProvider { chat(messages: Message[]): Promise<Response> }

// Provider：具体实现（可以有多个）
class OpenAIProvider implements LLMProvider { ... }
class DeepSeekProvider implements LLMProvider { ... }

// Consumer：只依赖 Definition
function askLLM(provider: LLMProvider, question: string) { ... }
```

**适用**：LLM 调用、存储后端、外部服务集成。**判断标准**：换一个实现，消费方代码需要改吗？

## 实战对照

| 原则 | dsh 中的体现 | 我的项目中可以怎么用 |
|---|---|---|
| 注册即副作用 | 插件注册返回 disposer | lumen 的工具注册、kb-ui 的事件监听 |
| 模型所见必可重建 | Agent 上下文从日志重建 | lumen 的 Checkpoint/恢复机制 |
| 显式优于隐式 | 插件声明 `dsh.bundle` 依赖 | 所有项目的配置管理 |
| 错误要大声 | 工具调用失败必须报告 | lumen 的 command_safety 分类 |
| 事件是扩展点 | Agent 循环通过事件扩展 | lumen 的 MCP 扩展机制 |
| 能力可换后端 | LLM/存储/沙箱均可替换 | lumen 的多模型路由 |
