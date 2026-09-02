---
title: 数字设计与计算机组成原理
date: 2025-12
tags: [CPU, ARM, 数字电路, 流水线]
summary: 数字设计与计算机组成原理课程：从布尔代数到 ARM CPU 设计，11 章笔记覆盖组合/时序逻辑、ALU、控制器、流水线、IO 系统。
---

## 背景

大二上学期课程，使用《Digital Design and Computer Architecture ARM Edition》（DDCA）教材。从数字电路基础到完整 ARM CPU 设计，理论+实验并行。

## 关键内容

### 数字电路基础（CH1-3）

- 布尔代数：AND / OR / NOT / NAND / NOR / XOR
- 组合逻辑：多路选择器、译码器、加法器、ALU
- SOP（积之和）与 POS（和之积）标准型转换
- 时序逻辑：SR 锁存器 → D 触发器 → 寄存器 → 计数器

### 计算机组成原理（CH4-7）

- ISA（指令集架构）：软件与硬件的接口
- ARM 指令集：数据处理 / 加载存储 / 分支
- 寄存器文件：R0-R30（通用）+ SP / LR / PC / CPSR
- 数据通路：取指 → 译码 → 执行 → 访存 → 写回

### CPU 设计（CH8-9）

- 单周期 CPU：一条指令一个时钟周期，简单但慢
- 多周期 CPU：指令分阶段执行，资源共享
- 流水线 CPU：五级流水（IF → ID → EX → MEM → WB）
- 流水线冒险：数据冒险（转发/旁路）、控制冒险（分支预测）、结构冒险（资源冲突）

### ARM 五级流水线

- IF（取指）→ ID（译码）→ EX（执行）→ MEM（访存）→ WB（写回）
- 时空图分析：吞吐率提升 vs 延迟不变
- 转发（Forwarding）解决数据冒险

### IO 系统（CH10-11）

- 中断驱动 IO vs 轮询 IO vs DMA
- 中断控制器：GIC（ARM Generic Interrupt Controller）
- 总线系统：AHB / APB

## 实验

- 实验一：组合逻辑电路设计（Digital 工具）
- 实验二：时序逻辑电路设计
- 实验三：单周期 ARM 处理器（Digital 仿真）
- 实验四：流水线 ARM 处理器

## 来源

- 课程笔记（11 章 markdown）：`D:\大二上及下的备份\数字设计与计算机组成原理\`
- 实验报告：同目录下实验文档
