---
title: 全可编程 SOC 实验：Vivado 硬件设计 + SDK 裸机程序
date: 2026-06-15
type: learning
tags: [计算机组成原理, 实验, Zynq, Vivado, 嵌入式]
summary: 计组实验四归纳：Vivado 搭 Zynq 全可编程 SOC 最小系统，Xilinx SDK 写裸机串口程序下载到开发板，含 MIO/AXI 概念与排错经验。
---

## 实验目标

在 Zynq 全可编程 SOC 上走通**软硬件协同设计**全流程：

1. Vivado 搭一个含 ARM 微处理器的最小片上系统（处理器 + 存储器 + UART 串口）
2. Xilinx SDK 写一个裸机程序，串口输出运行结果
3. 下载到实体开发板，上位机串口工具接收文本

## 关键概念

- **全可编程 SOC**：Zynq 芯片 = ARM 处理系统（PS）+ FPGA 可编程逻辑（PL）集成在一块芯片
- **MIO**：处理系统的多功能 I/O 引脚，可复用为 UART/SPI/I2C 等外设信号
- **AXI**：片内互联总线，PS 与 PL 之间、外设与处理器之间的高速通信通道
- **裸机程序**：不带操作系统的嵌入式程序，直接跑在硬件上（区别于跑 RTOS/Linux）
- **板级支持包（BSP）**：SDK 根据硬件导出文件生成的底层驱动库

## Vivado 硬件搭建（PS 侧）

流程：工程配置 → 建 Block Design → 加 ZYNQ IP 核 → 自动连线 → 配置外设 → 校验 → 生成 HDL 顶层 → 导出硬件。

- 新建工程：RTL 模式，选对应 FPGA 器件（本实验用 Zynq 开发板）
- **添加 ZYNQ IP 核**：`IP Integrator → Create Block Diagram → 添加 IP → ZYNQ`
- **Run Block Automation**：自动完成基础连线，开启交叉触发（Cross Trigger In/Out）
- 外设配置要点：
  - DDR 控制器：Memory Part 选 `MT41J256M16 RE-125`，总线宽 16bit
  - **UART0**：勾选 I/O Peripherals 下的 UART0，引脚配到 `MIO 14..15`
  - 时钟复位：`FCLK_CLK0` 与 `M_AXI_GP0_ACLK` 相连
- **Validate Design**：校验硬件设计，有错误会直接报出来
- Generate Output Products → Create HDL Wrapper → Export Hardware → Launch SDK

## SDK 软件设计

1. `File → New → Application Project`，选 **Hello World** 模板
2. SDK 根据导出的硬件信息自动生成 BSP
3. 确认 COM 口：插拔开发板 UART 连接的 USB 线，在**设备管理器**里看新增的 COM 号
4. SDK Terminal 连上该 COM 口，`Run As → Run Configurations` 下载程序

```c
// Hello World 模板核心：init_platform() 初始化硬件平台
printf("Hello World\n\r");
// 程序结束后不直接 return，否则会触发 abort 异常
```

## 实验结果

- 硬件校验无错误无严重告警，处理器/存储接口/串口外设/时钟/总线连接正常
- SDK 编译零报错，生成可执行程序
- 程序下载到开发板后，上位机串口调试工具正常收到文本，运行稳定

串口能输出 → 片上串口外设配置无误、引脚功能与线路连接正常、串口异步通信工作正常；程序能跑 → 存储模块配置正确、ARM 能正常执行嵌入式程序。

## 遇到的问题

- **Vivado 中文路径闪退**：工程路径含中文字符（中文用户名导致），Vivado 报错闪退 → 清理工程缓存后改用纯英文路径解决
- **SDK 启动卡死**：硬件导出后 SDK 无响应 → 关闭后台残留进程、重新导出硬件配置文件后恢复正常

## 小结

从完全陌生到跑通 **Vivado 框图设计 → SDK 裸机开发 → 板级运行** 全流程，建立了软硬件协同调试的思维。实验只用到了 PS 自带外设，后续可以：在 PL 端加自定义硬件模块做 PS-PL 数据交互、在软件层上 RTOS 实现多任务、扩展更多片内外设。
