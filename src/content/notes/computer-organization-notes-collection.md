---
title: "计算机组成原理课堂笔记合集"
date: "2025-06"
type: "learning"
tags: [计算机组成原理, RISC-V, ISA, 流水线, 存储器]
summary: "计算机组成原理课堂详细笔记合集，覆盖Introduction、ISA、Computer Organization、DDCAarm各章（共10篇章节笔记合并）"
---

# 计算机组成原理课堂笔记合集


---

## 章节：1 Introduction笔记

计算机组成原理 - 1 Introduction（引言）详细笔记

一、计算机系统概述

1.1 什么是计算机
计算机是一种能够按照程序自动、高速地进行大量数值计算和信息处理的电子设备。

计算机的主要特点：
1. 自动性：能够按照程序自动执行，不需要人工干预
2. 高速性：运算速度快，每秒可以执行数十亿次运算
3. 准确性：计算精度高，几乎不会出错
4. 存储性：能够存储大量的数据和程序
5. 通用性：能够处理各种不同的任务

1.2 计算机的发展历程

第一代计算机（1946-1957）：电子管计算机
- 主要元件：电子管
- 特点：体积大、功耗高、可靠性差、速度慢
- 代表：ENIAC（1946年，第一台通用电子计算机）
  - 使用18000个电子管
  - 重量30吨
  - 占地170平方米
  - 功耗150千瓦
  - 每秒5000次加法运算
- 编程语言：机器语言

第二代计算机（1958-1964）：晶体管计算机
- 主要元件：晶体管
- 特点：体积小、功耗低、可靠性高、速度快
- 代表：IBM 7090
- 编程语言：汇编语言、FORTRAN、COBOL

第三代计算机（1965-1971）：集成电路计算机
- 主要元件：集成电路（IC，Integrated Circuit）
- 特点：体积更小、功耗更低、可靠性更高、速度更快
- 代表：IBM System/360
- 编程语言：高级语言

第四代计算机（1972-至今）：大规模/超大规模集成电路计算机
- 主要元件：大规模集成电路（LSI）、超大规模集成电路（VLSI）
- 特点：微型化、低功耗、高可靠性、高速度
- 代表：个人计算机（PC）、智能手机
- 微处理器的发展：
  - 1971年：Intel 4004，4位，2300个晶体管
  - 1974年：Intel 8080，8位
  - 1978年：Intel 8086，16位
  - 1985年：Intel 80386，32位
  - 2003年：AMD Athlon 64，64位
  - 现在：数十亿个晶体管

第五代计算机（未来）：智能计算机
- 正在研究中
- 目标：具有人工智能、自然语言理解、学习能力

1.3 摩尔定律（Moore's Law）

摩尔定律的提出：
- 1965年，Intel联合创始人戈登·摩尔（Gordon Moore）提出
- 最初预测：集成电路上可容纳的晶体管数目，约每隔18-24个月便会增加一倍
- 实际上：这个预测持续了约50年

摩尔定律的影响：
- 计算机性能持续提升
- 价格持续下降
- 体积持续缩小
- 功耗持续降低

摩尔定律的终结：
- 物理限制：晶体管尺寸接近原子级别（目前约7nm）
- 量子效应：当晶体管太小，量子效应变得显著
- 功耗问题：功耗密度过大，散热困难
- 替代技术：量子计算、神经形态计算、光子计算等

二、计算机的硬件组成

2.1 冯·诺依曼结构（Von Neumann Architecture）

冯·诺依曼结构的提出：
- 1945年，约翰·冯·诺依曼（John von Neumann）提出
- 也称为普林斯顿结构

冯·诺依曼结构的核心思想：
1. 计算机由五大部件组成：运算器、控制器、存储器、输入设备、输出设备
2. 程序和数据以二进制形式存储在存储器中
3. 指令和数据同等对待，都存储在同一个存储器中
4. 指令在存储器中按顺序存放
5. 计算机以运算器为中心（现代计算机以存储器为中心）

冯·诺依曼结构的五大部件：

1. 运算器（Arithmetic Logic Unit，ALU）
   - 功能：进行算术运算和逻辑运算
   - 算术运算：加、减、乘、除
   - 逻辑运算：与、或、非、比较
   - 核心部件：算术逻辑单元（ALU）

2. 控制器（Control Unit，CU）
   - 功能：控制计算机各部件协调工作
   - 任务：
     - 从存储器中取出指令
     - 分析指令
     - 执行指令
   - 核心部件：程序计数器（PC）、指令寄存器（IR）、指令译码器

3. 存储器（Memory）
   - 功能：存储程序和数据
   - 分类：
     - 主存储器（内存）：速度快，容量小，临时存储
     - 辅助存储器（外存）：速度慢，容量大，永久存储

4. 输入设备（Input Device）
   - 功能：向计算机输入信息
   - 例子：键盘、鼠标、扫描仪、麦克风

5. 输出设备（Output Device）
   - 功能：从计算机输出信息
   - 例子：显示器、打印机、扬声器

运算器和控制器合称为中央处理器（CPU，Central Processing Unit）。

2.2 现代计算机的结构

现代计算机的特点：
- 以存储器为中心，而不是以运算器为中心
- 总线结构
- 层次化存储
- 并行处理

总线（Bus）：
- 定义：连接计算机各部件的一组公共信号线
- 分类：
  - 数据总线（Data Bus）：传输数据
  - 地址总线（Address Bus）：传输地址
  - 控制总线（Control Bus）：传输控制信号
- 特点：
  - 共享：多个部件共享同一条总线
  - 分时：同一时间只能有一个部件使用总线

三、计算机的软件组成

3.1 软件的分类

软件：计算机运行所需的程序、数据和相关文档的总称。

系统软件（System Software）：
- 管理和控制计算机硬件和软件资源
- 为应用软件提供服务
- 例子：
  - 操作系统（OS，Operating System）：Windows、Linux、macOS、Android、iOS
  - 语言处理程序：编译器、解释器、汇编器
  - 数据库管理系统（DBMS）：MySQL、Oracle、SQL Server
  - 工具软件：编辑器、调试器、性能监控工具

应用软件（Application Software）：
- 为解决特定问题而开发的软件
- 例子：
  - 办公软件：Microsoft Office、WPS
  - 浏览器：Chrome、Firefox、Edge
  - 游戏
  - 即时通讯：微信、QQ
  - 视频播放器

3.2 操作系统（OS）

操作系统的作用：
- 用户与计算机硬件之间的接口
- 管理计算机的硬件和软件资源
- 为应用程序提供运行环境

操作系统的主要功能：
1. 进程管理（Process Management）
   - 进程调度
   - 进程通信
   - 进程同步
2. 存储管理（Memory Management）
   - 内存分配
   - 内存保护
   - 虚拟内存
3. 文件管理（File Management）
   - 文件存储
   - 文件访问
   - 文件保护
4. 设备管理（Device Management）
   - 设备分配
   - 设备驱动
   - 缓冲管理
5. 用户接口（User Interface）
   - 命令行界面（CLI）
   - 图形用户界面（GUI）

四、计算机系统的层次结构

4.1 计算机系统的层次

从下到上依次为：

第1层：微程序设计层（Microprogramming Level）
- 微指令
- 硬件直接执行

第2层：机器语言层（Machine Language Level）
- 机器指令
- 由微程序解释执行

第3层：操作系统层（Operating System Level）
- 操作系统
- 管理系统资源

第4层：汇编语言层（Assembly Language Level）
- 汇编语言
- 由汇编器翻译成机器语言

第5层：高级语言层（High-Level Language Level）
- C、C++、Java、Python等
- 由编译器或解释器处理

第6层：应用程序层（Application Level）
- 应用软件
- 用户直接使用

4.2 各层之间的关系
- 下层为上层提供服务
- 上层使用下层的服务
- 每一层都把下一层看作一台虚拟机
- 层次化的好处：
  - 模块化
  - 可移植性
  - 易于理解和实现

五、计算机的性能指标

5.1 基本性能指标

字长（Word Size）：
- CPU一次能处理的二进制数据的位数
- 常见字长：8位、16位、32位、64位
- 字长越长，精度越高，处理能力越强

主频（Clock Rate）：
- CPU时钟频率
- 单位：Hz（赫兹）
- 常见：GHz（吉赫兹）
- 主频越高，速度越快（但不是唯一因素）

运算速度：
- MIPS（Million Instructions Per Second）：每秒百万条指令
- MFLOPS（Million Floating-point Operations Per Second）：每秒百万次浮点运算
- GFLOPS：每秒十亿次浮点运算
- TFLOPS：每秒万亿次浮点运算

存储容量：
- 位（bit，b）：0或1
- 字节（Byte，B）：8位
- 千字节（KB）：1024字节
- 兆字节（MB）：1024×1024字节
- 吉字节（GB）：1024×1024×1024字节
- 太字节（TB）：1024^4字节
- 注意：硬盘厂商常用1000而不是1024

5.2 响应时间和吞吐量

响应时间（Response Time）：
- 也叫执行时间（Execution Time）
- 从任务开始到完成的时间
- 包括CPU时间、I/O等待时间、等待时间等
- 响应时间越短越好

吞吐量（Throughput）：
- 单位时间内完成的任务数
- 单位：任务/秒、作业/小时
- 吞吐量越大越好

5.3 阿姆达尔定律（Amdahl's Law）

阿姆达尔定律的提出：
- 由吉恩·阿姆达尔（Gene Amdahl）提出

阿姆达尔定律的公式：
Speedup = 1 / [(1 - f) + f / k]
- Speedup：加速比
- f：可加速部分所占比例
- k：可加速部分的加速倍数

阿姆达尔定律的含义：
- 优化一小部分对整体性能的提升是有限的
- 要提高整体性能，需要优化大部分

例子：
- 假设一个程序中，40%的部分可以加速10倍
- Speedup = 1 / [(1 - 0.4) + 0.4 / 10] = 1 / [0.6 + 0.04] = 1 / 0.64 ≈ 1.56
- 整体只加速了约1.56倍

5.4 基准测试程序（Benchmark）

基准测试程序的作用：
- 客观地衡量计算机性能
- 比较不同计算机的性能

常见的基准测试程序：
1. SPEC（Standard Performance Evaluation Corporation）
   - SPECint：整数性能
   - SPECfp：浮点性能
2. Linpack：线性代数计算性能
3. Dhrystone：整数和字符串操作性能
4. Whetstone：浮点性能
5. PCMark：个人计算机整体性能
6. 3DMark：图形性能

六、计算机的分类

6.1 按用途分类

通用计算机（General-purpose Computer）：
- 可以执行各种不同的任务
- 例子：个人计算机、服务器

专用计算机（Special-purpose Computer）：
- 为特定任务设计
- 例子：ATM机、游戏机、嵌入式系统

6.2 按规模分类

巨型机（Supercomputer）：
- 速度最快、价格最贵、功能最强
- 用于科学计算、天气预报、核武器模拟等
- 例子：中国的天河、神威·太湖之光
- 性能：每秒数万亿次到数十万亿次浮点运算

大型机（Mainframe）：
- 规模大、性能高、可靠性高
- 用于银行、航空公司、政府等
- 例子：IBM z系列

小型机（Minicomputer）：
- 规模适中、性能适中
- 用于中型企业、科研机构
- 现在逐渐被服务器取代

微型机（Microcomputer）：
- 也叫个人计算机（PC）
- 体积小、价格低、使用方便
- 例子：台式机、笔记本电脑、平板电脑、智能手机

工作站（Workstation）：
- 高性能的微型机
- 用于CAD、图形处理、科学计算等
- 例子：Sun工作站、HP工作站

服务器（Server）：
- 为网络中的其他计算机提供服务
- 高可靠性、高可用性
- 例子：Web服务器、文件服务器、数据库服务器

嵌入式计算机（Embedded Computer）：
- 嵌入到其他设备中的计算机
- 专用性强
- 例子：智能电视、智能冰箱、汽车电子、工业控制

七、计算机的应用领域

7.1 科学计算
- 天气预报
- 核武器模拟
- 航空航天
- 石油勘探
- 量子化学

7.2 数据处理
- 银行金融
- 企业管理
- 库存管理
- 工资管理
- 数据分析

7.3 自动控制
- 工业控制
- 机器人
- 自动驾驶
- 航空航天控制
- 医疗设备

7.4 计算机辅助设计与制造
- CAD（Computer-Aided Design）：计算机辅助设计
- CAM（Computer-Aided Manufacturing）：计算机辅助制造
- CAE（Computer-Aided Engineering）：计算机辅助工程

7.5 人工智能
- 机器学习
- 深度学习
- 自然语言处理
- 计算机视觉
- 专家系统

7.6 网络与通信
- 互联网
- 电子邮件
- 即时通讯
- 视频会议
- 电子商务

7.7 多媒体
- 图形图像
- 音频视频
- 动画
- 游戏
- 虚拟现实（VR）
- 增强现实（AR）

7.8 教育
- 计算机辅助教学（CAI）
- 在线教育
- 电子书包
- 模拟实验

7.9 医疗
- 医学影像
- 诊断系统
- 远程医疗
- 医疗机器人
- 健康监测

八、总结

8.1 计算机系统的组成
- 硬件：运算器、控制器、存储器、输入设备、输出设备
- 软件：系统软件、应用软件

8.2 冯·诺依曼结构
- 五大部件
- 二进制存储
- 存储程序

8.3 计算机的性能
- 字长、主频、运算速度、存储容量
- 响应时间、吞吐量
- 阿姆达尔定律

8.4 计算机的发展趋势
- 更快的速度
- 更大的存储容量
- 更小的体积
- 更低的功耗
- 更高的智能化
- 更广泛的应用

8.5 学习计算机组成原理的意义
- 理解计算机的工作原理
- 写出更高效的程序
- 为计算机系统设计打下基础
- 更好地使用和维护计算机

---

## 章节：2 ISA笔记

计算机组成原理 - 2 ISA（指令集架构）详细笔记

一、ISA概述

1.1 什么是ISA

ISA（Instruction Set Architecture，指令集架构）的定义：
- ISA是计算机硬件与软件之间的接口
- ISA定义了计算机的指令集、寄存器、寻址方式等
- ISA是软件能够看到的计算机的抽象模型
- 程序员通过ISA与计算机交互

ISA的重要性：
- ISA是计算机设计的核心
- 同一ISA可以有不同的硬件实现（微架构）
- 同一ISA的软件可以在不同的实现上运行
- 例子：
  - x86 ISA：Intel、AMD都有实现
  - ARM ISA：ARM、高通、苹果都有实现

1.2 ISA的历史

早期计算机（1940s-1950s）：
- 没有统一的ISA概念
- 每个计算机都有自己的指令集
- 编程很困难

IBM System/360（1964）：
- 第一次提出ISA的概念
- 一系列兼容的计算机
- 相同的ISA，不同的性能
- 软件可以在全系列上运行
- 这是一个里程碑

CISC时代（1970s-1980s）：
- CISC（Complex Instruction Set Computer）
- 复杂指令集计算机
- 指令数量多，功能复杂
- 例子：x86、VAX、DEC Alpha

RISC时代（1980s至今）：
- RISC（Reduced Instruction Set Computer）
- 精简指令集计算机
- 指令数量少，功能简单
- 例子：ARM、MIPS、PowerPC、RISC-V

现代ISA：
- 融合了CISC和RISC的特点
- 例子：x86-64（复杂指令，但内部是RISC实现）
- ARM（RISC，但也有一些复杂指令）

1.3 ISA的内容

ISA包括：
1. 指令集（Instruction Set）
   - 指令的格式
   - 指令的类型
   - 指令的功能

2. 寄存器（Registers）
   - 通用寄存器
   - 特殊寄存器
   - 寄存器的大小

3. 寻址方式（Addressing Modes）
   - 如何访问内存
   - 如何计算地址

4. 内存模型（Memory Model）
   - 内存的组织方式
   - 字节序（大端/小端）
   - 内存对齐

5. 中断和异常（Interrupts and Exceptions）
   - 如何处理外部事件
   - 如何处理错误

6. I/O模型（I/O Model）
   - 如何与外设交互
   - 内存映射I/O vs 端口I/O

二、指令集

2.1 指令的组成

指令的组成：
- 操作码（Opcode）：指定要执行的操作
- 操作数（Operands）：操作的数据或数据的地址
  - 源操作数（Source Operands）：操作的输入
  - 目的操作数（Destination Operand）：操作的结果

指令的例子：
- ADD R1, R2, R3
  - 操作码：ADD
  - 源操作数：R2, R3
  - 目的操作数：R1
  - 功能：R1 = R2 + R3

- LOAD R1, 100(R2)
  - 操作码：LOAD
  - 源操作数：100(R2)
  - 目的操作数：R1
  - 功能：R1 = 内存[R2 + 100]

2.2 指令的格式

指令格式（Instruction Format）：
- 指令在机器中的二进制表示
- 不同的ISA有不同的指令格式
- 常见的指令格式：
  - 三地址指令
  - 二地址指令
  - 一地址指令
  - 零地址指令

1. 三地址指令（Three-Address Instruction）
   - 格式：OP D, S1, S2
   - 功能：D = S1 OP S2
   - 例子：ADD R1, R2, R3
   - 优点：灵活，一条指令完成一个操作
   - 缺点：指令较长
   - 使用：RISC架构（ARM、MIPS）

2. 二地址指令（Two-Address Instruction）
   - 格式：OP D, S
   - 功能：D = D OP S
   - 例子：ADD R1, R2（R1 = R1 + R2）
   - 优点：指令较短
   - 缺点：会修改一个源操作数
   - 使用：x86

3. 一地址指令（One-Address Instruction）
   - 格式：OP S
   - 功能：隐含使用累加器（Accumulator）
   - 例子：ADD X（AC = AC + X）
   - 优点：指令很短
   - 缺点：需要频繁访问累加器
   - 使用：早期计算机

4. 零地址指令（Zero-Address Instruction）
   - 格式：OP
   - 功能：使用栈（Stack）
   - 例子：ADD（弹出两个数，相加，结果压回）
   - 优点：指令最短
   - 缺点：需要频繁的栈操作
   - 使用：栈式计算机

2.3 指令的类型

指令的类型：
1. 数据传输指令（Data Transfer）
2. 算术运算指令（Arithmetic）
3. 逻辑运算指令（Logical）
4. 位操作指令（Bit Manipulation）
5. 控制转移指令（Control Transfer）
6. 系统指令（System）

1. 数据传输指令
   - 在寄存器和内存之间传输数据
   - 例子：
     - LOAD R1, X：从内存X加载到R1
     - STORE X, R1：将R1存储到内存X
     - MOV R1, R2：R1 = R2（寄存器之间）
     - PUSH R1：将R1压入栈
     - POP R1：从栈弹出到R1

2. 算术运算指令
   - 执行算术运算
   - 例子：
     - ADD R1, R2, R3：R1 = R2 + R3
     - SUB R1, R2, R3：R1 = R2 - R3
     - MUL R1, R2, R3：R1 = R2 × R3
     - DIV R1, R2, R3：R1 = R2 ÷ R3
     - INC R1：R1 = R1 + 1
     - DEC R1：R1 = R1 - 1
     - NEG R1：R1 = -R1

3. 逻辑运算指令
   - 执行逻辑运算
   - 例子：
     - AND R1, R2, R3：R1 = R2 & R3（按位与）
     - OR R1, R2, R3：R1 = R2 | R3（按位或）
     - XOR R1, R2, R3：R1 = R2 ^ R3（按位异或）
     - NOT R1, R2：R1 = ~R2（按位取反）

4. 位操作指令
   - 操作位
   - 例子：
     - SLL R1, R2, #n：R1 = R2 << n（逻辑左移）
     - SRL R1, R2, #n：R1 = R2 >> n（逻辑右移）
     - SRA R1, R2, #n：R1 = R2 >> n（算术右移）
     - ROL R1, R2, #n：循环左移
     - ROR R1, R2, #n：循环右移

5. 控制转移指令
   - 改变程序执行顺序
   - 例子：
     - JMP LABEL：无条件跳转到LABEL
     - BEQ R1, R2, LABEL：如果R1 == R2，跳转到LABEL
     - BNE R1, R2, LABEL：如果R1 != R2，跳转到LABEL
     - BLT R1, R2, LABEL：如果R1 < R2，跳转到LABEL
     - BGT R1, R2, LABEL：如果R1 > R2，跳转到LABEL
     - BLE R1, R2, LABEL：如果R1 <= R2，跳转到LABEL
     - BGE R1, R2, LABEL：如果R1 >= R2，跳转到LABEL
     - CALL LABEL：调用子程序
     - RET：从子程序返回

6. 系统指令
   - 与操作系统交互
   - 例子：
     - TRAP：系统调用
     - ERET：从异常返回
     - HALT：停机
     - NOP：空操作（No Operation）

2.4 CISC vs RISC

CISC（Complex Instruction Set Computer）特点：
1. 指令数量多（几百条）
2. 指令功能复杂
3. 指令长度不固定
4. 可以直接操作内存
5. 寻址方式多
6. 微码实现
7. 例子：x86、VAX

RISC（Reduced Instruction Set Computer）特点：
1. 指令数量少（几十条）
2. 指令功能简单
3. 指令长度固定
4. 只有LOAD/STORE可以访问内存
5. 寻址方式少
6. 硬连线实现
7. 例子：ARM、MIPS、RISC-V

CISC vs RISC比较：

| 特性 | CISC | RISC |
|------|------|------|
| 指令数量 | 多 | 少 |
| 指令复杂度 | 复杂 | 简单 |
| 指令长度 | 可变 | 固定 |
| 内存访问 | 任意指令 | 只有LOAD/STORE |
| 寻址方式 | 多 | 少 |
| 实现方式 | 微码 | 硬连线 |
| 代码大小 | 小 | 大 |
| 执行速度 | 慢（部分指令） | 快 |
| 编译器设计 | 简单 | 复杂 |

现代趋势：
- CISC处理器内部也用RISC实现
- x86处理器将复杂指令转换为微操作（μops）
- RISC也在增加一些复杂指令
- 两者的界限越来越模糊

三、寄存器

3.1 寄存器的作用

寄存器的作用：
- 寄存器是CPU内部的高速存储单元
- 用来暂存数据、地址、指令等
- 访问速度比内存快得多
- 是CPU与内存之间的桥梁

为什么需要寄存器：
1. 速度：寄存器比内存快得多
   - 寄存器访问：1个时钟周期
   - 内存访问：几百个时钟周期
2. 指令长度：寄存器编号短，可以缩短指令
3. 编译器优化：寄存器可以用来优化代码

3.2 寄存器的类型

寄存器的类型：
1. 通用寄存器（General-Purpose Registers）
2. 程序计数器（Program Counter，PC）
3. 指令寄存器（Instruction Register，IR）
4. 状态寄存器（Status Register / Flags Register）
5. 地址寄存器（Address Registers）
6. 其他特殊寄存器

1. 通用寄存器
   - 可以用来存储数据、地址等
   - 编译器可以自由使用
   - 数量：
     - RISC：16-32个
     - CISC：8-16个
   - 例子：
     - ARM：R0-R15（16个）
     - MIPS：$0-$31（32个）
     - x86-32：EAX, EBX, ECX, EDX, ESI, EDI, EBP, ESP（8个）
     - x86-64：RAX, RBX, RCX, RDX, RSI, RDI, RBP, RSP, R8-R15（16个）

2. 程序计数器（PC）
   - 也叫指令指针（Instruction Pointer，IP）
   - 保存下一条要执行的指令的地址
   - 每执行一条指令，PC自动增加
   - 控制转移指令（JMP、CALL、RET）会修改PC
   - 例子：
     - ARM：R15（PC）
     - MIPS：PC
     - x86：EIP（32位）/ RIP（64位）

3. 指令寄存器（IR）
   - 保存当前正在执行的指令
   - 从内存取指令时，指令放入IR
   - 译码器对IR中的指令进行译码
   - 用户程序通常不能直接访问IR

4. 状态寄存器
   - 也叫标志寄存器（Flags Register）
   - 保存算术/逻辑运算的结果状态
   - 常见的标志：
     - Z（Zero）：结果为零
     - N（Negative）：结果为负
     - C（Carry）：有进位/借位
     - V（Overflow）：有溢出
     - S（Sign）：符号位
     - P（Parity）：奇偶校验
   - 例子：
     - ARM：CPSR（Current Program Status Register）
     - MIPS：没有专用的状态寄存器
     - x86：EFLAGS（32位）/ RFLAGS（64位）

5. 地址寄存器
   - 用来保存内存地址
   - 例子：
     - MAR（Memory Address Register）：内存地址寄存器
     - MDR（Memory Data Register）：内存数据寄存器
   - 用户程序通常不能直接访问这些寄存器

6. 其他特殊寄存器
   - 栈指针（Stack Pointer，SP）：指向栈顶
   - 帧指针（Frame Pointer，FP）：指向当前栈帧
   - 基址寄存器（Base Register）：用于寻址
   - 例子：
     - ARM：R13（SP），R14（LR，链接寄存器）
     - MIPS：$sp（栈指针），$ra（返回地址）
     - x86：ESP（32位）/ RSP（64位，栈指针）

3.3 寄存器的大小

寄存器的大小：
- 通常与机器字长相同
- 8位计算机：8位寄存器
- 16位计算机：16位寄存器
- 32位计算机：32位寄存器
- 64位计算机：64位寄存器

例子：
- 8086（16位）：AX, BX, CX, DX（16位）
- 80386（32位）：EAX, EBX, ECX, EDX（32位）
- x86-64（64位）：RAX, RBX, RCX, RDX（64位）

有些寄存器可以分成更小的部分：
- x86-64的RAX：
  - RAX：64位
  - EAX：低32位
  - AX：低16位
  - AH：AX的高8位
  - AL：AX的低8位

3.4 寄存器的使用约定

寄存器的使用约定（Calling Convention）：
- 规定寄存器如何使用
- 包括：
  - 哪些寄存器用来传递参数
  - 哪些寄存器用来保存返回值
  - 哪些寄存器由调用者保存（Caller-saved）
  - 哪些寄存器由被调用者保存（Callee-saved）
- 不同的ISA有不同的约定
- 同一ISA也可能有不同的约定

例子：ARM AAPCS（ARM Architecture Procedure Call Standard）
- 参数传递：R0-R3
- 返回值：R0-R1
- 被调用者保存：R4-R11, R13（SP）, R14（LR）
- 调用者保存：R0-R3, R12（IP）, R15（PC）

例子：x86-64 System V ABI
- 参数传递：RDI, RSI, RDX, RCX, R8, R9
- 返回值：RAX, RDX
- 被调用者保存：RBX, RBP, R12-R15
- 调用者保存：RAX, RCX, RDX, RSI, RDI, R8-R11

四、寻址方式

4.1 什么是寻址方式

寻址方式（Addressing Mode）的定义：
- 寻址方式是如何计算操作数的地址
- 或者如何直接获取操作数
- 不同的ISA有不同的寻址方式
- 寻址方式影响指令的灵活性和效率

4.2 常见的寻址方式

1. 立即寻址（Immediate Addressing）
   - 操作数直接在指令中
   - 不需要访问内存
   - 例子：
     - ADD R1, R2, #10
     - R1 = R2 + 10
   - 优点：快，不需要访问内存
   - 缺点：操作数大小受限制

2. 寄存器寻址（Register Addressing）
   - 操作数在寄存器中
   - 不需要访问内存
   - 例子：
     - ADD R1, R2, R3
     - R1 = R2 + R3
   - 优点：最快，直接访问寄存器
   - 缺点：寄存器数量有限

3. 直接寻址（Direct Addressing）
   - 操作数的地址直接在指令中
   - 例子：
     - LOAD R1, 1000
     - R1 = 内存[1000]
   - 优点：简单
   - 缺点：地址大小受限制，访问固定地址

4. 寄存器间接寻址（Register Indirect Addressing）
   - 操作数的地址在寄存器中
   - 例子：
     - LOAD R1, (R2)
     - R1 = 内存[R2]
   - 优点：灵活，可以访问动态地址
   - 缺点：需要两次访问（先寄存器，再内存）

5. 变址寻址（Indexed Addressing）
   - 操作数的地址 = 基址 + 偏移
   - 例子：
     - LOAD R1, 100(R2)
     - R1 = 内存[R2 + 100]
   - 优点：灵活，适合访问数组、结构体
   - 缺点：需要计算地址

6. 基址加变址寻址（Based Indexed Addressing）
   - 操作数的地址 = 基址 + 变址
   - 例子：
     - LOAD R1, (R2, R3)
     - R1 = 内存[R2 + R3]
   - 优点：更灵活，适合二维数组
   - 缺点：需要计算地址

7. 相对寻址（PC-Relative Addressing）
   - 操作数的地址 = PC + 偏移
   - 例子：
     - JMP 100
     - PC = PC + 100
   - 优点：适合位置无关代码（Position-Independent Code，PIC）
   - 缺点：范围受限制

8. 堆栈寻址（Stack Addressing）
   - 操作数在栈中
   - 例子：
     - PUSH R1：将R1压入栈
     - POP R1：从栈弹出到R1
   - 优点：简单，适合函数调用
   - 缺点：只能访问栈顶

9. 内存间接寻址（Memory Indirect Addressing）
   - 操作数的地址在内存中
   - 例子：
     - LOAD R1, @1000
     - R1 = 内存[内存[1000]]
   - 优点：可以访问动态地址
   - 缺点：需要两次内存访问，慢

4.3 寻址方式的例子

例子：数组访问
- 数组A的基地址在R2中
- 访问A[i]：
  - i在R3中
  - A[i]的地址 = R2 + R3 × 4（每个元素4字节）
  - 指令：LOAD R1, (R2, R3, LSL #2)

例子：结构体访问
- 结构体S的地址在R2中
- 结构体有字段x（偏移0）、y（偏移4）、z（偏移8）
- 访问S.y：
  - 指令：LOAD R1, 4(R2)

五、内存模型

5.1 字节序

字节序（Endianness）的定义：
- 字节序是多字节数据在内存中的存储顺序
- 两种字节序：
  1. 大端序（Big-Endian）
  2. 小端序（Little-Endian）

大端序（Big-Endian）：
- 最高有效字节（Most Significant Byte，MSB）在最低地址
- 例子：
  - 数据：0x12345678
  - 地址：1000: 0x12, 1001: 0x34, 1002: 0x56, 1003: 0x78
- 使用：PowerPC、SPARC、Internet协议（TCP/IP）

小端序（Little-Endian）：
- 最低有效字节（Least Significant Byte，LSB）在最低地址
- 例子：
  - 数据：0x12345678
  - 地址：1000: 0x78, 1001: 0x56, 1002: 0x34, 1003: 0x12
- 使用：x86、ARM（可配置）

例子：
- 数据：0x12345678
- 大端序：
  - 地址1000: 12
  - 地址1001: 34
  - 地址1002: 56
  - 地址1003: 78
- 小端序：
  - 地址1000: 78
  - 地址1001: 56
  - 地址1002: 34
  - 地址1003: 12

字节序的问题：
- 不同字节序的计算机之间交换数据会有问题
- 解决方法：
  - 网络字节序（大端序）
  - 在发送前转换为网络字节序
  - 在接收后转换为主机字节序

5.2 内存对齐

内存对齐（Memory Alignment）的定义：
- 内存对齐是数据在内存中的存储位置满足一定的条件
- 通常要求：
  - n字节数据的地址是n的倍数
- 例子：
  - 2字节数据（16位）：地址是2的倍数
  - 4字节数据（32位）：地址是4的倍数
  - 8字节数据（64位）：地址是8的倍数

为什么需要对齐：
1. 性能：对齐的数据访问更快
   - 有些处理器只能访问对齐的数据
   - 访问未对齐的数据需要多次访问
2. 正确性：有些处理器不支持未对齐访问
   - 会产生异常

例子：
- 结构体：
  ```c
  struct S {
      char a;   // 1字节
      int b;    // 4字节
      char c;   // 1字节
  };
  ```
- 对齐后的布局（假设4字节对齐）：
  - 偏移0: a（1字节）
  - 偏移1: 填充（3字节）
  - 偏移4: b（4字节）
  - 偏移8: c（1字节）
  - 偏移9: 填充（3字节）
  - 总共12字节

5.3 地址空间

地址空间（Address Space）的定义：
- 地址空间是处理器能够访问的所有地址的集合
- 地址空间的大小：
  - 32位处理器：2^32 = 4GB
  - 64位处理器：2^64 = 16EB（很大，实际使用的少）

虚拟地址空间（Virtual Address Space）：
- 现代操作系统使用虚拟内存
- 每个进程有自己的虚拟地址空间
- 虚拟地址通过MMU（Memory Management Unit）转换为物理地址
- 好处：
  - 隔离进程
  - 可以使用比物理内存更大的地址空间
  - 简化内存管理

六、总结

6.1 ISA要点
- ISA是硬件与软件的接口
- ISA包括指令集、寄存器、寻址方式、内存模型等
- CISC和RISC是两种主要的ISA风格

6.2 指令集要点
- 指令由操作码和操作数组成
- 有三地址、二地址、一地址、零地址指令
- 指令类型：数据传输、算术、逻辑、位操作、控制转移、系统

6.3 寄存器要点
- 通用寄存器：R0-Rn
- 特殊寄存器：PC、IR、状态寄存器等
- 寄存器使用约定很重要

6.4 寻址方式要点
- 立即寻址、寄存器寻址、直接寻址、间接寻址、变址寻址等
- 不同的寻址方式适用于不同的场景

6.5 内存模型要点
- 字节序：大端序、小端序
- 内存对齐：提高性能和正确性
- 虚拟地址空间：每个进程有自己的地址空间

6.6 学习的意义
- 理解计算机的指令集架构
- 为编程和优化打下基础
- 理解不同ISA的特点

---

## 章节：3 Computer Organization笔记

计算机组成原理 - 3 Computer Organization（计算机组成）详细笔记

一、计算机组成概述

1.1 什么是计算机组成

计算机组成（Computer Organization）的定义：
- 计算机组成是计算机系统的硬件实现
- 它描述了计算机的各个部件以及它们之间的连接
- 计算机组成关注的是：
  - 数据通路（Datapath）
  - 控制单元（Control Unit）
  - 存储器层次（Memory Hierarchy）
  - 输入输出系统（I/O System）

计算机组成与计算机架构的关系：
- 计算机架构（ISA，指令集架构）：
  - 是软件可见的接口
  - 包括指令集、寄存器、寻址方式等
- 计算机组成：
  - 是架构的硬件实现
  - 同一架构可以有不同的组成实现
- 例子：
  - Intel和AMD的x86处理器：相同的ISA，不同的组成
  - ARM Cortex-A系列：相同的ISA，不同的实现

1.2 计算机组成的历史

早期计算机（1940s-1950s）：
- 冯·诺依曼架构
- 单一处理单元
- 串行执行
- 例子：ENIAC、EDSAC

晶体管时代（1950s-1960s）：
- 用晶体管代替真空管
- 更小、更快、更可靠
- 例子：IBM 7000系列

集成电路时代（1960s-1970s）：
- 集成电路（IC）
- 多个晶体管集成在一个芯片上
- 例子：IBM System/360

微处理器时代（1970s至今）：
- 单芯片微处理器
- 整个CPU在一个芯片上
- 例子：Intel 4004、8086、Pentium、Core

流水线和超标量（1980s至今）：
- 指令流水线
- 超标量执行
- 乱序执行
- 分支预测
- 例子：Intel Pentium Pro、Core系列

多核时代（2000s至今）：
- 多个处理器核心在一个芯片上
- 并行计算
- 例子：Intel Core i3/i5/i7、AMD Ryzen

1.3 冯·诺依曼架构

冯·诺依曼架构（Von Neumann Architecture）：
- 1945年，冯·诺依曼提出
- 也叫存储程序计算机（Stored-Program Computer）
- 核心思想：
  1. 数据和程序都存储在存储器中
  2. 指令和数据都用二进制表示
  3. 顺序执行指令（从存储器取指令、译码、执行）

冯·诺依曼架构的组成：
1. 运算器（Arithmetic Logic Unit，ALU）：执行算术和逻辑运算
2. 控制器（Control Unit，CU）：控制指令的取出、译码、执行
3. 存储器（Memory）：存储程序和数据
4. 输入设备（Input）：向计算机输入信息
5. 输出设备（Output）：从计算机输出信息

冯·诺依曼架构的框图：
```
        ┌─────────────────┐
        │   输入设备      │
        └────────┬────────┘
                 │
        ┌────────▼────────┐
        │   存储器        │
        └────────┬────────┘
                 │
        ┌────────▼────────┐
        │  运算器/控制器  │
        └────────┬────────┘
                 │
        ┌────────▼────────┐
        │   输出设备      │
        └─────────────────┘
```

冯·诺依曼瓶颈（Von Neumann Bottleneck）：
- CPU与存储器之间的数据传输速率限制了系统性能
- CPU执行指令的速度比访问存储器的速度快得多
- 这是现代计算机系统的主要性能瓶颈
- 解决方法：
  - 缓存（Cache）
  - 流水线
  - 并行处理

二、数据通路

2.1 什么是数据通路

数据通路（Datapath）的定义：
- 数据通路是处理器中执行数据操作的部件
- 它包括：
  - 算术逻辑单元（ALU）
  - 寄存器堆（Register File）
  - 内部总线（Internal Buses）
  - 多路选择器（Multiplexers）
  - 加法器（Adders）
  - 移位器（Shifters）

数据通路的作用：
- 执行指令中的数据操作
- 在寄存器之间传输数据
- 在寄存器和存储器之间传输数据

2.2 算术逻辑单元（ALU）

ALU（Arithmetic Logic Unit）的定义：
- ALU是执行算术和逻辑运算的部件
- 它是数据通路的核心

ALU的功能：
1. 算术运算：
   - 加法（Add）
   - 减法（Subtract）
   - 比较（Compare）
2. 逻辑运算：
   - 与（AND）
   - 或（OR）
   - 异或（XOR）
   - 非（NOT）
3. 移位运算：
   - 逻辑左移（Logical Shift Left）
   - 逻辑右移（Logical Shift Right）
   - 算术右移（Arithmetic Shift Right）

ALU的结构：
```
        ┌──────┐
  A ───→│      │
        │      │
  B ───→│ ALU  │──→ Result
        │      │
F ─────→│      │
        └──────┘
```
- A, B：输入操作数
- Result：输出结果
- F：功能选择（选择执行什么运算）

ALU的实现：
- 使用组合逻辑电路
- 可以用门电路实现
- 更复杂的ALU用多个层次的逻辑实现

一位ALU的例子：
- 可以执行AND、OR、加法
- 使用门电路实现

多位ALU：
- 将多个一位ALU级联
- 进位从低位传到高位
- 进位传播延迟是一个问题
- 可以用先行进位（Look-ahead Carry）来加速

2.3 寄存器堆

寄存器堆（Register File）的定义：
- 寄存器堆是一组寄存器的集合
- 通常有2读端口、1写端口
- 可以同时读两个寄存器，写一个寄存器

寄存器堆的结构：
```
        ┌─────────────┐
  RA1 ─→│             │──→ RD1
  RA2 ─→│             │──→ RD2
        │  寄存器堆    │
  WA  ─→│             │
  WD  ─→│             │
  WE  ─→│             │
        └─────────────┘
```
- RA1, RA2：读地址（选择要读的寄存器）
- RD1, RD2：读数据（读出的数据）
- WA：写地址（选择要写的寄存器）
- WD：写数据（要写入的数据）
- WE：写使能（Write Enable，是否写）

寄存器堆的实现：
- 使用D触发器（D Flip-Flop）
- 每个寄存器是一个D触发器阵列
- 读端口用多路选择器
- 写端口用译码器

2.4 总线

总线（Bus）的定义：
- 总线是连接多个部件的共享通信路径
- 多个部件可以通过总线传输数据
- 同一时间只能有一个部件发送数据
- 但可以有多个部件接收数据

总线的类型：
1. 地址总线（Address Bus）：传输地址
2. 数据总线（Data Bus）：传输数据
3. 控制总线（Control Bus）：传输控制信号

单总线架构：
- 所有部件连接到一条总线
- 简单，但性能低
- 例子：早期的微处理器

多总线架构：
- 多条总线
- 性能更高
- 例子：现代处理器

2.5 多路选择器

多路选择器（Multiplexer，MUX）的定义：
- 多路选择器是一个选择器
- 从多个输入中选择一个输出
- 用选择信号控制

2选1多路选择器：
```
        ┌─────┐
  D0 ───→│     │
        │ MUX │──→ Y
  D1 ───→│     │
        └─────┘
           ↑
           S
```
- D0, D1：输入
- Y：输出
- S：选择信号
  - S=0，Y=D0
  - S=1，Y=D1

4选1多路选择器：
- 4个输入
- 2位选择信号
- 从4个输入中选择1个

多路选择器的用途：
- 在数据通路中选择数据源
- 在ALU中选择操作
- 在寄存器堆中选择寄存器

2.6 加法器

加法器（Adder）的定义：
- 加法器是执行加法运算的部件
- 是ALU的重要组成部分

半加器（Half Adder）：
- 两个1位输入：A, B
- 两个输出：和S，进位C
- 真值表：
  | A | B | S | C |
  |---|---|---|---|
  | 0 | 0 | 0 | 0 |
  | 0 | 1 | 1 | 0 |
  | 1 | 0 | 1 | 0 |
  | 1 | 1 | 0 | 1 |
- 逻辑表达式：
  - S = A XOR B
  - C = A AND B

全加器（Full Adder）：
- 三个1位输入：A, B, Cin（进位输入）
- 两个输出：S, Cout（进位输出）
- 可以用两个半加器实现
- 真值表：
  | A | B | Cin | S | Cout |
  |---|---|-----|---|------|
  | 0 | 0 |  0  | 0 |  0   |
  | 0 | 0 |  1  | 1 |  0   |
  | 0 | 1 |  0  | 1 |  0   |
  | 0 | 1 |  1  | 0 |  1   |
  | 1 | 0 |  0  | 1 |  0   |
  | 1 | 0 |  1  | 0 |  1   |
  | 1 | 1 |  0  | 0 |  1   |
  | 1 | 1 |  1  | 1 |  1   |

行波进位加法器（Ripple Carry Adder，RCA）：
- 将n个全加器级联
- 进位从低位传到高位
- 延迟O(n)
- 简单，但慢

先行进位加法器（Carry Look-ahead Adder，CLA）：
- 提前计算进位
- 不等待进位传播
- 延迟O(log n)
- 更快，但更复杂

三、控制单元

3.1 什么是控制单元

控制单元（Control Unit，CU）的定义：
- 控制单元是处理器中控制指令执行的部件
- 它产生控制信号，控制数据通路的操作

控制单元的功能：
1. 取指令（Fetch）：从存储器取指令
2. 译码（Decode）：分析指令的功能
3. 执行（Execute）：执行指令的操作
4. 写回（Write Back）：将结果写回寄存器或存储器

3.2 指令周期

指令周期（Instruction Cycle）的定义：
- 执行一条指令的时间
- 通常包括以下步骤：
  1. 取指周期（Fetch Cycle）
  2. 译码周期（Decode Cycle）
  3. 执行周期（Execute Cycle）
  4. 访存周期（Memory Cycle，可选）
  5. 写回周期（Write Back Cycle，可选）

取指周期（Fetch）：
1. PC → MAR（程序计数器的值送到存储器地址寄存器）
2. 读存储器
3. MDR → IR（存储器数据寄存器的值送到指令寄存器）
4. PC + 4 → PC（PC自增，指向下一条指令）

译码周期（Decode）：
1. 分析IR中的指令
2. 确定指令类型
3. 读取操作数

执行周期（Execute）：
1. 执行指令的操作
2. 计算结果
3. 更新状态标志

访存周期（Memory，可选）：
1. 如果是load/store指令，访问存储器
2. 计算有效地址
3. 读或写存储器

写回周期（Write Back，可选）：
1. 将结果写回寄存器
2. 更新寄存器堆

3.3 硬连线控制

硬连线控制（Hardwired Control）的定义：
- 用组合逻辑电路实现控制单元
- 控制信号由逻辑门直接产生
- 也叫组合逻辑控制

硬连线控制的特点：
- 优点：
  - 速度快
  - 适合简单的指令集
- 缺点：
  - 设计复杂
  - 难以修改
  - 不适合复杂的指令集

硬连线控制的结构：
```
        ┌──────────┐
  IR ───→│          │
        │  控制逻辑  │──→ 控制信号
  状态 ─→│          │
        └──────────┘
```
- IR：指令寄存器
- 状态：ALU的状态标志
- 控制逻辑：组合逻辑电路

3.4 微程序控制

微程序控制（Microprogrammed Control）的定义：
- 用微程序实现控制单元
- 每条机器指令对应一个微程序
- 微程序存储在控制存储器（Control Memory）中
- 也叫存储逻辑控制

微程序控制的特点：
- 优点：
  - 设计简单
  - 易于修改
  - 适合复杂的指令集
- 缺点：
  - 速度较慢
  - 需要额外的控制存储器

微程序控制的术语：
1. 微指令（Microinstruction）：控制存储器中的一条指令
2. 微程序（Microprogram）：微指令的序列
3. 控制存储器（Control Memory）：存储微程序的存储器
4. 微程序计数器（Microprogram Counter，μPC）：指向当前微指令

微程序控制的结构：
```
        ┌──────────────┐
  IR ───→│  微地址生成   │
        └──────┬───────┘
               │ μPC
               ↓
        ┌──────────────┐
        │  控制存储器    │
        └──────┬───────┘
               │ 微指令
               ↓
        ┌──────────────┐
        │  微指令译码    │──→ 控制信号
        └──────────────┘
```

四、总结

4.1 计算机组成要点
- 计算机组成是ISA的硬件实现
- 包括数据通路、控制单元、存储器、I/O
- 冯·诺依曼架构是基础

4.2 数据通路要点
- ALU：执行算术和逻辑运算
- 寄存器堆：存储临时数据
- 总线：连接部件
- 多路选择器：选择数据
- 加法器：执行加法

4.3 控制单元要点
- 控制单元控制指令执行
- 指令周期：取指、译码、执行、访存、写回
- 硬连线控制：速度快，设计复杂
- 微程序控制：灵活，速度稍慢

4.4 学习的意义
- 理解计算机的硬件实现
- 理解指令如何执行
- 为理解处理器性能打下基础

---

## 章节：3 DDCAarm_Ch1笔记

# 3 DDCAarm_Ch1 笔记

## 一、ARM架构概述
### 1.1 ARM简介
ARM（Advanced RISC Machine）是一种精简指令集计算机（RISC）架构，由ARM公司设计。ARM架构具有以下特点：
- 高性能、低功耗
- 精简指令集
- 大量通用寄存器
- Load/Store架构
- 固定长度指令（32位ARM指令或16位Thumb指令）

### 1.2 ARM架构的发展
- **ARMv1**：最早的ARM架构
- **ARMv4**：引入Thumb指令集
- **ARMv5**：增强DSP支持
- **ARMv6**：SIMD支持
- **ARMv7**：分为A/R/M三个系列
- **ARMv8**：64位架构（AArch64）

### 1.3 ARM处理器系列
- **Cortex-A系列**：面向应用处理器，运行高性能操作系统
- **Cortex-R系列**：面向实时系统
- **Cortex-M系列**：面向微控制器，低成本、低功耗

## 二、ARM寄存器
### 2.1 通用寄存器
ARM有16个32位通用寄存器：R0-R15
- **R0-R12**：通用寄存器，用于数据操作
- **R13**：堆栈指针（SP）
- **R14**：链接寄存器（LR），保存返回地址
- **R15**：程序计数器（PC）

### 2.2 程序状态寄存器
- **CPSR**（Current Program Status Register）：当前程序状态寄存器
- **SPSR**（Saved Program Status Register）：保存的程序状态寄存器

**CPSR标志位**：
- **N**（Negative）：负标志
- **Z**（Zero）：零标志
- **C**（Carry）：进位/借位标志
- **V**（Overflow）：溢出标志
- **Q**（Saturation）：饱和标志
- **J**（Jazelle）：Jazelle状态标志
- **E**（Endian）：字节序标志
- **A**（Abort）：异步中止禁止位
- **I**（IRQ）：IRQ中断禁止位
- **F**（FIQ）：FIQ中断禁止位
- **T**（Thumb）：Thumb状态标志
- **M**（Mode）：模式位（5位）

### 2.3 处理器模式
ARM有7种处理器模式：
- **User**（用户模式）：非特权模式
- **FIQ**（快速中断模式）：处理快速中断
- **IRQ**（外部中断模式）：处理普通中断
- **SVC**（管理模式）：操作系统使用
- **Abort**（中止模式）：处理内存访问异常
- **Undef**（未定义模式）：处理未定义指令
- **System**（系统模式）：使用User模式的寄存器但有特权

## 三、ARM指令集
### 3.1 指令格式
ARM指令是32位固定长度，基本格式：
```
31 28 27 26 25 24 21 20 19 16 15 12 11 0
┌───┬───┬───┬───┬───┬───────┬───────┬───────┬─────────┐
│Cond│ 0 │ I │ Op│ S │  Rn   │  Rd   │  Sh   │ Operand2│
└───┴───┴───┴───┴───┴───────┴───────┴───────┴─────────┘
```

### 3.2 条件执行
几乎所有ARM指令都可以条件执行，条件码在指令的最高4位：
- **EQ**（Equal）：Z=1，相等
- **NE**（Not Equal）：Z=0，不相等
- **CS/HS**（Carry Set/Unsigned Higher or Same）：C=1
- **CC/LO**（Carry Clear/Unsigned Lower）：C=0
- **MI**（Minus/Negative）：N=1
- **PL**（Plus/Positive or Zero）：N=0
- **VS**（Overflow Set）：V=1
- **VC**（Overflow Clear）：V=0
- **HI**（Unsigned Higher）：C=1且Z=0
- **LS**（Unsigned Lower or Same）：C=0或Z=1
- **GE**（Signed Greater or Equal）：N==V
- **LT**（Signed Less Than）：N!=V
- **GT**（Signed Greater Than）：Z=0且N==V
- **LE**（Signed Less or Equal）：Z=1或N!=V
- **AL**（Always）：总是执行（无条件）

### 3.3 数据处理指令
**加法指令**：
```asm
ADD Rd, Rn, Operand2        ; Rd = Rn + Operand2
ADDS Rd, Rn, Operand2       ; Rd = Rn + Operand2，设置标志位
ADC Rd, Rn, Operand2        ; Rd = Rn + Operand2 + C
```

**减法指令**：
```asm
SUB Rd, Rn, Operand2        ; Rd = Rn - Operand2
SUBS Rd, Rn, Operand2       ; Rd = Rn - Operand2，设置标志位
SBC Rd, Rn, Operand2        ; Rd = Rn - Operand2 - !C
RSB Rd, Rn, Operand2        ; Rd = Operand2 - Rn
```

**逻辑指令**：
```asm
AND Rd, Rn, Operand2        ; 按位与
ORR Rd, Rn, Operand2        ; 按位或
EOR Rd, Rn, Operand2        ; 按位异或
BIC Rd, Rn, Operand2        ; 位清零：Rd = Rn & (~Operand2)
```

**比较指令**：
```asm
CMP Rn, Operand2            ; 比较：Rn - Operand2，设置标志位
CMN Rn, Operand2            ; 比较负数：Rn + Operand2，设置标志位
TST Rn, Operand2            ; 测试位：Rn & Operand2，设置标志位
TEQ Rn, Operand2            ; 测试相等：Rn ^ Operand2，设置标志位
```

**移位指令**：
```asm
MOV Rd, Rn, LSL #n          ; 逻辑左移n位
MOV Rd, Rn, LSR #n          ; 逻辑右移n位
MOV Rd, Rn, ASR #n          ; 算术右移n位
MOV Rd, Rn, ROR #n          ; 循环右移n位
```

### 3.4 Load/Store指令
**加载字**：
```asm
LDR Rd, [Rn]                ; Rd = memory[Rn]
LDR Rd, [Rn, #offset]       ; Rd = memory[Rn + offset]
LDR Rd, [Rn, Rm]            ; Rd = memory[Rn + Rm]
LDR Rd, [Rn, Rm, LSL #n]   ; Rd = memory[Rn + Rm << n]
LDR Rd, [Rn], #offset       ; Rd = memory[Rn], Rn = Rn + offset
```

**存储字**：
```asm
STR Rd, [Rn]                ; memory[Rn] = Rd
STR Rd, [Rn, #offset]       ; memory[Rn + offset] = Rd
```

**加载/存储字节**：
```asm
LDRB Rd, [Rn]               ; 加载无符号字节
LDRSB Rd, [Rn]              ; 加载有符号字节
STRB Rd, [Rn]               ; 存储字节
```

**加载/存储半字**：
```asm
LDRH Rd, [Rn]               ; 加载无符号半字
LDRSH Rd, [Rn]              ; 加载有符号半字
STRH Rd, [Rn]               ; 存储半字
```

**多寄存器加载/存储**：
```asm
LDMIA Rn!, {R0-R3}          ; 加载多个寄存器，Rn递增
STMIA Rn!, {R0-R3}          ; 存储多个寄存器，Rn递增
LDMFD SP!, {R0-R3, PC}      ; 从堆栈加载，恢复PC
STMFD SP!, {R0-R3, LR}      ; 存储到堆栈
```

### 3.5 分支指令
```asm
B label                      ; 无条件分支
BL label                     ; 分支并链接（调用子程序）
BX Rm                        ; 分支并交换状态（ARM/Thumb）
BLX Rm                       ; 分支链接并交换状态
```

### 3.6 软件中断指令
```asm
SWI #imm                     ; 软件中断
```

## 四、寻址方式
### 4.1 数据处理指令寻址方式
1. **立即数寻址**：
   ```asm
   ADD R0, R1, #5
   ```

2. **寄存器寻址**：
   ```asm
   ADD R0, R1, R2
   ```

3. **寄存器移位寻址**：
   ```asm
   ADD R0, R1, R2, LSL #3
   ```

### 4.2 Load/Store指令寻址方式
1. **偏移寻址**：
   ```asm
   LDR R0, [R1, #4]
   ```

2. **前变址寻址**：
   ```asm
   LDR R0, [R1, #4]!
   ```

3. **后变址寻址**：
   ```asm
   LDR R0, [R1], #4
   ```

4. **寄存器偏移**：
   ```asm
   LDR R0, [R1, R2]
   ```

## 五、程序设计示例
### 5.1 简单的加法程序
```asm
        .text
        .global _start
_start:
        MOV R0, #5          @ R0 = 5
        MOV R1, #3          @ R1 = 3
        ADD R2, R0, R1      @ R2 = R0 + R1 = 8
        MOV R7, #1          @ 系统调用号1: exit
        SWI 0               @ 执行系统调用
```

### 5.2 循环求和
```asm
        .text
        .global _start
_start:
        MOV R0, #0          @ sum = 0
        MOV R1, #1          @ i = 1
        MOV R2, #10         @ n = 10
loop:
        ADD R0, R0, R1      @ sum += i
        ADD R1, R1, #1      @ i++
        CMP R1, R2          @ 比较i和n
        BLE loop            @ 如果i <= n，继续循环
        MOV R7, #1
        SWI 0
```

### 5.3 函数调用
```asm
        .text
        .global _start
_start:
        MOV R0, #5
        MOV R1, #3
        BL add_func        @ 调用add_func
        MOV R7, #1
        SWI 0

add_func:
        ADD R0, R0, R1     @ R0 = R0 + R1
        MOV PC, LR          @ 返回
```

## 六、异常和中断
### 6.1 异常类型
- **Reset**：复位异常
- **Undefined Instruction**：未定义指令
- **Software Interrupt (SWI)**：软件中断
- **Prefetch Abort**：预取指中止
- **Data Abort**：数据中止
- **IRQ**：外部中断
- **FIQ**：快速中断

### 6.2 异常向量表
```
地址          异常类型
0x00000000    Reset
0x00000004    Undefined Instruction
0x00000008    Software Interrupt
0x0000000C    Prefetch Abort
0x00000010    Data Abort
0x00000014    保留
0x00000018    IRQ
0x0000001C    FIQ
```

## 七、ARM汇编器伪指令
```asm
.text                      @ 代码段
.data                      @ 数据段
.bss                       @ 未初始化数据段
.global symbol             @ 声明全局符号
.equ constant, value       @ 定义常量
.byte value                @ 定义字节
.hword value               @ 定义半字
.word value                @ 定义字
.asciz "string"            @ 定义以0结尾的字符串
.align n                   @ 对齐到2^n字节
```

---

## 章节：4 DDCAarm_Ch2笔记

# 4 DDCAarm_Ch2 笔记

## 一、ARM指令集架构
### 1.1 ARM指令集特点
ARM架构采用精简指令集计算机（RISC）设计原则：
1. **大量通用寄存器**：16个32位通用寄存器
2. **Load/Store架构**：数据处理只在寄存器中进行
3. **固定长度指令**：32位ARM指令或16位Thumb指令
4. **条件执行**：几乎所有指令都可以条件执行
5. **灵活的寻址方式**：多种寻址方式支持高效的数据访问

### 1.2 指令集版本
- **ARMv4**：引入Thumb指令集
- **ARMv5**：增强的DSP指令
- **ARMv6**：SIMD指令扩展
- **ARMv7**：分为A/R/M三个系列
- **ARMv8**：64位架构（AArch64）

## 二、ARM指令格式
### 2.1 32位ARM指令格式
```
31 28 27 26 25 24 21 20 19 16 15 12 11 0
┌───┬───┬───┬───┬───┬───────┬───────┬───────┬─────────┐
│Cond│ 0 │ I │ Op│ S │  Rn   │  Rd   │  Sh   │ Operand2│
└───┴───┴───┴───┴───┴───────┴───────┴───────┴─────────┘
```

**字段说明**：
- **Cond[31:28]**：条件码，决定指令是否执行
- **I[25]**：立即数标志，0=寄存器，1=立即数
- **Op[24:21]**：操作码
- **S[20]**：设置标志位，1=更新CPSR标志
- **Rn[19:16]**：第一个源寄存器
- **Rd[15:12]**：目标寄存器
- **Sh[11:4]**：移位操作
- **Operand2[3:0]**：第二个操作数

### 2.2 条件码
| 条件码 | 助记符 | 含义 | CPSR标志 |
|--------|--------|------|----------|
| 0000 | EQ | 相等 | Z=1 |
| 0001 | NE | 不相等 | Z=0 |
| 0010 | CS/HS | 进位/无符号大于等于 | C=1 |
| 0011 | CC/LO | 无进位/无符号小于 | C=0 |
| 0100 | MI | 负数/负 | N=1 |
| 0101 | PL | 正数/零 | N=0 |
| 0110 | VS | 溢出 | V=1 |
| 0111 | VC | 无溢出 | V=0 |
| 1000 | HI | 无符号大于 | C=1且Z=0 |
| 1001 | LS | 无符号小于等于 | C=0或Z=1 |
| 1010 | GE | 有符号大于等于 | N==V |
| 1011 | LT | 有符号小于 | N!=V |
| 1100 | GT | 有符号大于 | Z=0且N==V |
| 1101 | LE | 有符号小于等于 | Z=1或N!=V |
| 1110 | AL | 总是执行 | 任何 |
| 1111 | NV | 从不执行（保留） | - |

## 三、数据处理指令
### 3.1 算术指令
```asm
ADD Rd, Rn, Operand2        ; Rd = Rn + Operand2
ADDS Rd, Rn, Operand2       ; Rd = Rn + Operand2，更新标志
ADC Rd, Rn, Operand2        ; Rd = Rn + Operand2 + C
SUB Rd, Rn, Operand2        ; Rd = Rn - Operand2
SUBS Rd, Rn, Operand2       ; Rd = Rn - Operand2，更新标志
SBC Rd, Rn, Operand2        ; Rd = Rn - Operand2 - !C
RSB Rd, Rn, Operand2        ; Rd = Operand2 - Rn
RSC Rd, Rn, Operand2        ; Rd = Operand2 - Rn - !C
```

### 3.2 逻辑指令
```asm
AND Rd, Rn, Operand2        ; 按位与
ORR Rd, Rn, Operand2        ; 按位或
EOR Rd, Rn, Operand2        ; 按位异或
BIC Rd, Rn, Operand2        ; 位清零：Rd = Rn & (~Operand2)
```

### 3.3 比较指令
```asm
CMP Rn, Operand2            ; 比较：Rn - Operand2，更新标志
CMN Rn, Operand2            ; 比较负数：Rn + Operand2，更新标志
TST Rn, Operand2            ; 测试位：Rn & Operand2，更新标志
TEQ Rn, Operand2            ; 测试相等：Rn ^ Operand2，更新标志
```

### 3.4 移动指令
```asm
MOV Rd, Operand2            ; Rd = Operand2
MVN Rd, Operand2            ; Rd = ~Operand2（取反）
```

### 3.5 示例
```asm
@ R0 = R1 + R2
ADD R0, R1, R2

@ R0 = R1 + 5，更新标志
ADDS R0, R1, #5

@ R0 = R1 - R2
SUB R0, R1, R2

@ R0 = R1 & R2
AND R0, R1, R2

@ R0 = ~R1
MVN R0, R1

@ 比较R1和R2
CMP R1, R2

@ 条件执行：如果R1 > R2，则R0 = R1 + R2
CMP R1, R2
ADDGT R0, R1, R2
```

## 四、移位操作
### 4.1 移位类型
1. **LSL**：逻辑左移（Logical Shift Left）
2. **LSR**：逻辑右移（Logical Shift Right）
3. **ASR**：算术右移（Arithmetic Shift Right）
4. **ROR**：循环右移（Rotate Right）
5. **RRX**：带扩展的循环右移

### 4.2 移位示例
```asm
@ 立即数移位
MOV R0, R1, LSL #3        @ R0 = R1 << 3
MOV R0, R1, LSR #2        @ R0 = R1 >> 2（逻辑右移）
MOV R0, R1, ASR #2        @ R0 = R1 >> 2（算术右移）
MOV R0, R1, ROR #4        @ R0 = R1循环右移4位

@ 寄存器移位
MOV R0, R1, LSL R2        @ R0 = R1 << R2
```

## 五、Operand2的灵活使用
### 5.1 Operand2的两种形式
1. **立即数形式**：
   ```
   11 111  imm8  rotate (4位)
   ```
   立即数由8位立即数循环右移2×rotate位得到

2. **寄存器形式**：
   ```
   0  移位量  0  移位类型  Rm
   ```

### 5.2 合法的立即数
立即数必须是8位立即数循环右移偶数位得到的：
```asm
MOV R0, #0xFF        @ 合法：8位
MOV R0, #0xFF00      @ 合法：0xFF循环右移24位
MOV R0, #0xFF0000    @ 合法：0xFF循环右移16位
MOV R0, #0x101       @ 不合法：无法由8位循环右移得到
```

## 六、Load/Store指令
### 6.1 加载字
```asm
LDR Rd, [Rn]                @ Rd = memory[Rn]
LDR Rd, [Rn, #offset]       @ Rd = memory[Rn + offset]
LDR Rd, [Rn, Rm]            @ Rd = memory[Rn + Rm]
LDR Rd, [Rn, Rm, LSL #n]   @ Rd = memory[Rn + Rm << n]
```

### 6.2 存储字
```asm
STR Rd, [Rn]                @ memory[Rn] = Rd
STR Rd, [Rn, #offset]       @ memory[Rn + offset] = Rd
```

### 6.3 前变址和后变址
```asm
@ 前变址（更新基址寄存器）
LDR Rd, [Rn, #offset]!      @ Rd = memory[Rn + offset], Rn = Rn + offset

@ 后变址
LDR Rd, [Rn], #offset       @ Rd = memory[Rn], Rn = Rn + offset
```

### 6.4 加载/存储字节和半字
```asm
@ 字节
LDRB Rd, [Rn]               @ 加载无符号字节
LDRSB Rd, [Rn]              @ 加载有符号字节
STRB Rd, [Rn]               @ 存储字节

@ 半字
LDRH Rd, [Rn]               @ 加载无符号半字
LDRSH Rd, [Rn]              @ 加载有符号半字
STRH Rd, [Rn]               @ 存储半字
```

## 七、多寄存器Load/Store
### 7.1 指令格式
```asm
LDMIA Rn!, {寄存器列表}      @ 递增后加载
STMIA Rn!, {寄存器列表}      @ 递增后存储
LDMFD SP!, {寄存器列表}      @ 满递减栈加载
STMFD SP!, {寄存器列表}      @ 满递减栈存储
```

### 7.2 堆栈操作
```asm
@ 保存寄存器到堆栈
STMFD SP!, {R0-R3, LR}

@ 从堆栈恢复寄存器
LDMFD SP!, {R0-R3, PC}
```

### 7.3 示例：子程序调用
```asm
@ 调用子程序
BL my_function

@ 子程序
my_function:
    STMFD SP!, {R4-R7, LR}   @ 保存寄存器
    @ ... 函数体 ...
    LDMFD SP!, {R4-R7, PC}   @ 恢复寄存器并返回
```

## 八、分支指令
### 8.1 分支指令
```asm
B label                      @ 无条件分支
BL label                     @ 分支并链接（调用子程序）
BX Rm                        @ 分支并交换状态（ARM/Thumb）
BLX Rm                       @ 分支链接并交换状态
```

### 8.2 条件分支
```asm
CMP R0, R1
BEQ label                    @ 如果相等则分支
BNE label                    @ 如果不相等则分支
BGT label                    @ 如果大于则分支
BLT label                    @ 如果小于则分支
```

## 九、软件中断
```asm
SWI #imm                     @ 软件中断
```

## 十、PSR传输指令
### 10.1 MSR和MRS
```asm
MRS Rd, CPSR                 @ Rd = CPSR
MRS Rd, SPSR                 @ Rd = SPSR
MSR CPSR_f, Rm               @ CPSR的标志位 = Rm
MSR CPSR_c, Rm               @ CPSR的控制位 = Rm
```

### 10.2 示例：使能/禁用中断
```asm
@ 禁用IRQ中断
MRS R0, CPSR
ORR R0, R0, #0x80           @ 设置I位
MSR CPSR_c, R0

@ 使能IRQ中断
MRS R0, CPSR
BIC R0, R0, #0x80           @ 清除I位
MSR CPSR_c, R0
```

## 十一、Thumb指令集
### 11.1 Thumb指令特点
- 16位指令长度
- 代码密度高
- 功能子集
- 可以与ARM指令混合使用

### 11.2 ARM/Thumb状态切换
```asm
@ 切换到Thumb状态
BX R0                       @ R0的最低位为1

@ 切换到ARM状态
BX R0                       @ R0的最低位为0
```

## 十二、寻址方式总结
| 寻址方式 | 示例 | 说明 |
|----------|------|------|
| 立即数 | MOV R0, #5 | 立即数寻址 |
| 寄存器 | MOV R0, R1 | 寄存器寻址 |
| 寄存器移位 | MOV R0, R1, LSL #3 | 寄存器移位寻址 |
| 基址 | LDR R0, [R1] | 基址寻址 |
| 基址偏移 | LDR R0, [R1, #4] | 基址加偏移 |
| 前变址 | LDR R0, [R1, #4]! | 前变址，更新基址 |
| 后变址 | LDR R0, [R1], #4 | 后变址，更新基址 |
| 多寄存器 | LDMIA R0!, {R1-R3} | 多寄存器寻址 |

---

## 章节：5 DDCAarm_Ch3笔记

# 5 DDCAarm_Ch3 笔记

## 一、ARM程序设计基础
### 1.1 ARM汇编语言格式
```asm
[标号:] <指令|伪指令|宏指令> [操作数] [;注释]
```

**示例**：
```asm
        AREA    Example, CODE, READONLY
        ENTRY
start
        MOV     R0, #5          ; R0 = 5
        MOV     R1, #10         ; R1 = 10
        ADD     R2, R0, R1      ; R2 = R0 + R1 = 15
stop
        B       stop
        END
```

### 1.2 汇编语言程序结构
一个典型的ARM汇编程序包含：
1. **段定义**：使用AREA伪指令
2. **入口点**：使用ENTRY伪指令
3. **代码**：指令序列
4. **结束**：使用END伪指令

## 二、伪指令
### 2.1 段定义伪指令
```asm
AREA    段名, 属性1, 属性2, ...
```

**常用属性**：
- **CODE**：代码段
- **DATA**：数据段
- **READONLY**：只读
- **READWRITE**：读写
- **ALIGN=n**：2^n字节对齐

**示例**：
```asm
AREA    MyCode, CODE, READONLY
AREA    MyData, DATA, READWRITE
```

### 2.2 入口和结束
```asm
ENTRY           ; 指定程序入口点
END             ; 汇编结束
```

### 2.3 数据定义伪指令
```asm
DCB         ; 分配字节
DCW         ; 分配半字（2字节）
DCD         ; 分配字（4字节）
DCQ         ; 分配双字（8字节）
SPACE       ; 分配未初始化的空间
```

**示例**：
```asm
AREA    MyData, DATA, READWRITE
byte1   DCB     0x12                    ; 字节
half1   DCW     0x1234                  ; 半字
word1   DCD     0x12345678              ; 字
str1    DCB     "Hello, World!", 0      ; 字符串
buffer  SPACE   100                     ; 100字节缓冲区
```

### 2.4 符号定义伪指令
```asm
EQU         ; 定义常量
RLIST       ; 定义寄存器列表
```

**示例**：
```asm
COUNT   EQU     100             ; 定义常量COUNT=100
MYREG   RLIST   {R0-R3}        ; 定义寄存器列表
```

### 2.5 其他伪指令
```asm
ALIGN       ; 对齐
EXPORT      ; 导出符号
IMPORT      ; 导入符号
EXTERN      ; 外部符号
GET/INCLUDE ; 包含文件
```

## 三、寻址方式详细说明
### 3.1 立即数寻址
```asm
MOV     R0, #0xFF              ; R0 = 0xFF
MOV     R0, #0xFF00            ; R0 = 0xFF00
ADD     R0, R1, #100           ; R0 = R1 + 100
```

**注意**：立即数必须是8位立即数循环右移偶数位得到的。

### 3.2 寄存器寻址
```asm
MOV     R0, R1                 ; R0 = R1
ADD     R0, R1, R2             ; R0 = R1 + R2
```

### 3.3 寄存器移位寻址
```asm
MOV     R0, R1, LSL #3         ; R0 = R1 << 3
MOV     R0, R1, LSR #2         ; R0 = R1 >> 2 (逻辑右移)
MOV     R0, R1, ASR #2         ; R0 = R1 >> 2 (算术右移)
MOV     R0, R1, ROR #4         ; R0 = R1 循环右移4位
MOV     R0, R1, LSL R2         ; R0 = R1 << R2
```

### 3.4 基址寻址
```asm
LDR     R0, [R1]               ; R0 = memory[R1]
LDR     R0, [R1, #4]           ; R0 = memory[R1 + 4]
LDR     R0, [R1, R2]           ; R0 = memory[R1 + R2]
LDR     R0, [R1, R2, LSL #2]  ; R0 = memory[R1 + R2 * 4]
```

### 3.5 前变址寻址
```asm
LDR     R0, [R1, #4]!          ; R0 = memory[R1 + 4], R1 = R1 + 4
LDR     R0, [R1, R2]!          ; R0 = memory[R1 + R2], R1 = R1 + R2
```

### 3.6 后变址寻址
```asm
LDR     R0, [R1], #4           ; R0 = memory[R1], R1 = R1 + 4
LDR     R0, [R1], R2           ; R0 = memory[R1], R1 = R1 + R2
```

## 四、程序控制结构
### 4.1 顺序结构
```asm
@ 计算R1 = R2 + R3 - R4
ADD     R1, R2, R3
SUB     R1, R1, R4
```

### 4.2 分支结构
#### 4.2.1 简单if
```asm
@ if (R0 > 0) R1 = 1
        CMP     R0, #0
        MOVGT   R1, #1
```

#### 4.2.2 if-else
```asm
@ if (R0 == 0)
@     R1 = 1
@ else
@     R1 = 2
        CMP     R0, #0
        MOVEQ   R1, #1
        MOVNE   R1, #2
```

或者使用分支指令：
```asm
        CMP     R0, #0
        BEQ     then_part
        MOV     R1, #2
        B       end_if
then_part
        MOV     R1, #1
end_if
```

#### 4.2.3 多路分支
```asm
@ switch (R0) {
@     case 0: R1 = 0; break;
@     case 1: R1 = 1; break;
@     default: R1 = -1;
@ }
        CMP     R0, #0
        MOVEQ   R1, #0
        BEQ     end_switch
        CMP     R0, #1
        MOVEQ   R1, #1
        BEQ     end_switch
        MOV     R1, #-1
end_switch
```

### 4.3 循环结构
#### 4.3.1 while循环
```asm
@ while (R0 > 0) {
@     R1 = R1 + R0;
@     R0 = R0 - 1;
@ }
while_loop
        CMP     R0, #0
        BLE     end_while
        ADD     R1, R1, R0
        SUB     R0, R0, #1
        B       while_loop
end_while
```

#### 4.3.2 do-while循环
```asm
@ do {
@     R1 = R1 + R0;
@     R0 = R0 - 1;
@ } while (R0 > 0);
do_while
        ADD     R1, R1, R0
        SUB     R0, R0, #1
        CMP     R0, #0
        BGT     do_while
```

#### 4.3.3 for循环
```asm
@ for (i = 0; i < 10; i++) {
@     sum = sum + i;
@ }
        MOV     R0, #0          ; i = 0
        MOV     R1, #0          ; sum = 0
for_loop
        CMP     R0, #10
        BGE     end_for
        ADD     R1, R1, R0      ; sum = sum + i
        ADD     R0, R0, #1      ; i++
        B       for_loop
end_for
```

## 五、子程序调用
### 5.1 子程序调用和返回
```asm
@ 调用子程序
        BL      my_subroutine

@ 子程序
my_subroutine
        @ 子程序代码
        MOV     PC, LR          @ 返回
```

### 5.2 保存和恢复寄存器
```asm
@ 调用子程序，保存和恢复寄存器
        STMFD   SP!, {R4-R7, LR}   @ 保存寄存器
        BL      my_subroutine
        LDMFD   SP!, {R4-R7, PC}   @ 恢复寄存器并返回

my_subroutine
        @ 子程序代码，使用R4-R7
        @ ...
        MOV     PC, LR
```

### 5.3 参数传递和返回值
**约定**：
- R0-R3：传递参数
- R0：返回值
- R4-R11：被调用者保存
- R12：IP（Intra-Procedure-call scratch register）
- R13：SP（Stack Pointer）
- R14：LR（Link Register）
- R15：PC（Program Counter）

**示例**：
```asm
@ int add(int a, int b) {
@     return a + b;
@ }
add
        ADD     R0, R0, R1      @ R0 = a + b
        MOV     PC, LR           @ 返回

@ 调用：int c = add(3, 5);
        MOV     R0, #3
        MOV     R1, #5
        BL      add             @ 调用，结果在R0中
        MOV     R2, R0          @ c = result
```

## 六、汇编程序示例
### 6.1 示例1：求1到n的和
```asm
        AREA    Sum, CODE, READONLY
        ENTRY
start
        MOV     R0, #10         ; n = 10
        MOV     R1, #0          ; sum = 0
        MOV     R2, #1          ; i = 1
loop
        CMP     R2, R0
        BGT     end_loop
        ADD     R1, R1, R2      ; sum += i
        ADD     R2, R2, #1      ; i++
        B       loop
end_loop
stop
        B       stop
        END
```

### 6.2 示例2：数组求和
```asm
        AREA    ArraySum, CODE, READONLY
        ENTRY
start
        LDR     R0, =array      ; R0 = 数组地址
        MOV     R1, #5          ; R1 = 数组长度
        BL      array_sum       ; 调用求和函数
stop
        B       stop

@ array_sum(int *array, int length)
array_sum
        MOV     R2, #0          ; sum = 0
        MOV     R3, #0          ; i = 0
sum_loop
        CMP     R3, R1
        BGE     sum_end
        LDR     R4, [R0, R3, LSL #2]  ; R4 = array[i]
        ADD     R2, R2, R4      ; sum += array[i]
        ADD     R3, R3, #1      ; i++
        B       sum_loop
sum_end
        MOV     R0, R2          ; 返回sum
        MOV     PC, LR

        AREA    ArrayData, DATA, READWRITE
array   DCD     1, 2, 3, 4, 5
        END
```

### 6.3 示例3：字符串复制
```asm
        AREA    StrCopy, CODE, READONLY
        ENTRY
start
        LDR     R0, =src        ; R0 = 源字符串地址
        LDR     R1, =dst        ; R1 = 目标字符串地址
        BL      strcpy          ; 调用字符串复制
stop
        B       stop

@ strcpy(char *dst, char *src)
strcpy
strcpy_loop
        LDRB    R2, [R1], #1    ; R2 = *src++
        STRB    R2, [R0], #1    ; *dst++ = R2
        CMP     R2, #0
        BNE     strcpy_loop
        MOV     PC, LR

        AREA    StrData, DATA, READWRITE
src     DCB     "Hello, World!", 0
dst     SPACE   20
        END
```

## 七、C和汇编混合编程
### 7.1 汇编调用C函数
```asm
@ 汇编中调用C函数
        IMPORT  c_function      ; 声明C函数
        MOV     R0, #10         ; 参数
        BL      c_function      ; 调用
```

### 7.2 C调用汇编函数
```c
// C中声明汇编函数
extern int asm_function(int a, int b);

int main() {
    int result = asm_function(3, 5);
    return 0;
}
```

```asm
; 汇编函数实现
        EXPORT  asm_function
asm_function
        ADD     R0, R0, R1
        MOV     PC, LR
```

---

## 章节：6 DDCAarm_Ch4笔记

# 6 DDCAarm_Ch4 笔记

## 一、流水线技术概述
### 1.1 什么是流水线
流水线（Pipelining）是一种将一个任务分解为多个子任务，并让这些子任务重叠执行的技术。

### 1.2 流水线的类比
类比：汽车装配线
- 每个工人只负责一道工序
- 汽车在流水线上移动
- 多个汽车可以同时在不同工序上装配

### 1.3 流水线的优势
1. **提高吞吐量**：单位时间内完成更多任务
2. **提高资源利用率**：各部件同时工作
3. **降低延迟（可能）**：在理想情况下

## 二、ARM的流水线
### 2.1 经典的5级流水线
ARM7采用经典的5级流水线：

```
取指（Fetch）→ 译码（Decode）→ 执行（Execute）→ 访存（Memory）→ 写回（Writeback）
```

### 2.2 各阶段说明
1. **取指（IF，Instruction Fetch）**
   - 从存储器中取指令
   - PC自动加4
   - 放入指令寄存器

2. **译码（ID，Instruction Decode）**
   - 对指令进行译码
   - 读取寄存器操作数
   - 生成控制信号

3. **执行（EX，Execute）**
   - ALU进行运算
   - 计算存储器地址
   - 处理分支跳转

4. **访存（MEM，Memory）**
   - 读取/写入数据存储器
   - 或者只是通过

5. **写回（WB，Write Back）**
   - 将结果写回寄存器文件

### 2.3 流水线时空图
```
时间    1   2   3   4   5   6   7   8
----------------------------------------
指令1  IF  ID  EX  MEM WB
指令2      IF  ID  EX  MEM WB
指令3          IF  ID  EX  MEM WB
指令4              IF  ID  EX  MEM WB
指令5                  IF  ID  EX  MEM WB
```

## 三、流水线冒险
### 3.1 冒险的类型
1. **结构冒险（Structural Hazard）**：硬件资源冲突
2. **数据冒险（Data Hazard）**：数据依赖关系
3. **控制冒险（Control Hazard）**：分支指令引起

### 3.2 结构冒险
#### 3.2.1 产生原因
多个指令同时需要使用同一个硬件资源。

**示例**：
- 只有一个存储器，同时取指和访存
- 只有一个ALU，同时执行运算和计算地址

#### 3.2.2 解决方案
1. **增加资源**
   - 分离的指令存储器和数据存储器
   - 多个ALU

2. **流水线停顿**
   - 等待资源可用
   - 插入气泡（Bubble）

### 3.3 数据冒险
#### 3.3.1 数据依赖类型
1. **RAW（Read After Write）**：写后读
   ```asm
   ADD R1, R2, R3  ; 写R1
   SUB R4, R1, R5  ; 读R1（RAW冒险）
   ```

2. **WAR（Write After Read）**：读后写
   ```asm
   SUB R4, R1, R5  ; 读R1
   ADD R1, R2, R3  ; 写R1（WAR冒险）
   ```

3. **WAW（Write After Write）**：写后写
   ```asm
   ADD R1, R2, R3  ; 写R1
   SUB R1, R4, R5  ; 写R1（WAW冒险）
   ```

#### 3.3.2 数据冒险的解决方案
1. **流水线停顿**
   - 插入NOP
   - 等待数据准备好

2. **转发（Forwarding）/ 旁路（Bypassing）**
   - 直接从EX/MEM或MEM/WB寄存器转发数据
   - 不需要等待写回

3. **编译器调度**
   - 重新排列指令顺序
   - 避免数据冒险

### 3.4 控制冒险
#### 3.4.1 产生原因
分支指令需要知道是否跳转以及跳转到哪里，但这需要等待几个周期。

**示例**：
```asm
B   label    ; 分支指令
ADD R1, R2, R3
```

#### 3.4.2 控制冒险的解决方案
1. **流水线停顿**
   - 等待分支结果确定
   - 插入气泡

2. **预测分支**
   - 静态预测：总是预测不跳转，或总是预测跳转
   - 动态预测：根据历史记录预测

3. **延迟分支**
   - 分支指令后面的指令总是执行
   - 编译器填充延迟槽

4. **分支目标缓冲（BTB）**
   - 记录分支的目标地址
   - 提前取出目标地址的指令

## 四、流水线性能
### 4.1 性能指标
1. **时钟周期（Cycle Time）**：流水线的周期时间
2. **CPI（Cycles Per Instruction）**：每条指令的平均周期数
3. **吞吐率（Throughput）**：单位时间内完成的指令数

### 4.2 理想情况
在理想情况下（无冒险）：
- CPI = 1
- 吞吐率 = 1 / 时钟周期

### 4.3 加速比
```
加速比 = 非流水线时间 / 流水线时间
      = (n × t) / ((n + k - 1) × τ)
```
其中：
- n：指令数
- t：非流水线的单条指令时间
- k：流水线级数
- τ：流水线周期

当n很大时，加速比≈k

## 五、流水线实现细节
### 5.1 流水线寄存器
在每两个流水线阶段之间需要加入流水线寄存器：

```
IF/ID → ID/EX → EX/MEM → MEM/WB
```

**流水线寄存器保存的内容**：
- 指令
- 控制信号
- 数据（操作数、结果）
- PC值

### 5.2 控制信号
控制信号需要随着流水线一起流动：

1. **EX阶段**：ALU操作、ALU源选择
2. **MEM阶段**：存储器读写
3. **WB阶段**：寄存器写回

## 六、高级流水线技术
### 6.1 超标量（Superscalar）
在一个周期内发射多条指令：
- ARM Cortex-A8：双发射
- ARM Cortex-A9：双发射
- ARM Cortex-A15：三发射

### 6.2 乱序执行（Out-of-Order Execution）
指令不按程序顺序执行，而是根据数据可用性执行。

### 6.3 寄存器重命名（Register Renaming）
消除WAR和WAW冒险。

### 6.4 分支预测
**静态预测**：
- 总是不跳转
- 总是跳转
- 向后跳转预测跳转（循环）

**动态预测**：
- 1位预测器
- 2位预测器
- 相关预测器
-  Tournament预测器

## 七、ARM流水线实例
### 7.1 ARM7流水线（3级）
```
取指 → 译码 → 执行
```

### 7.2 ARM9流水线（5级）
```
取指 → 译码 → 执行 → 访存 → 写回
```

### 7.3 ARM10流水线（6级）
```
取指 → 发射 → 译码 → 执行 → 访存 → 写回
```

### 7.4 Cortex-A系列
- **Cortex-A8**：13级流水线，双发射
- **Cortex-A9**：8-11级流水线，双发射，乱序
- **Cortex-A15**：15-24级流水线，三发射，乱序

## 八、流水线设计的权衡
### 8.1 流水线级数
1. **级数少**
   - 优点：简单、设计容易
   - 缺点：性能提升有限

2. **级数多**
   - 优点：可能更高频率
   - 缺点：设计复杂、冒险更多、功耗大

### 8.2 深度与频率
更深的流水线可以达到更高的频率，但：
- 流水线开销增加
- 冒险惩罚更大
- 功耗增加

## 九、流水线总结
### 9.1 关键概念
1. **流水线阶段**：将指令执行分解为多个阶段
2. **流水线冒险**：结构、数据、控制
3. **冒险解决**：停顿、转发、预测
4. **性能**：CPI、吞吐率、加速比

### 9.2 设计原则
1. **阶段平衡**：各阶段延迟尽量相同
2. **减少冒险**：通过硬件和软件技术
3. **性能优化**：在频率和效率间权衡

---

## 章节：7 DDCAarm_Ch5笔记

# 7 DDCAarm_Ch5 存储系统笔记

## 一、存储系统概述
### 1.1 存储系统的层次结构
现代计算机系统采用多级存储层次结构：

```
寄存器 ← 最快，最小，最昂贵
  ↓
Cache ← 高速缓存
  ↓
主存 ← 主存储器
  ↓
辅存 ← 辅助存储器（硬盘、SSD等）
  ↓
海量存储 ← 磁带、光盘库等，最慢，最大，最便宜
```

### 1.2 存储系统的设计目标
1. **高速度**：尽可能快的访问速度
2. **大容量**：尽可能大的存储容量
3. **低成本**：尽可能低的单位成本

### 1.3 局部性原理
存储系统的设计基于程序访问的局部性原理：

1. **时间局部性**：
   - 一个被访问的存储单元，在不久的将来可能再次被访问
   - 原因：循环、频繁使用的变量

2. **空间局部性**：
   - 一个被访问的存储单元，其附近的单元也可能被访问
   - 原因：顺序执行的指令、数组访问

## 二、主存储器
### 2.1 主存的基本概念
主存储器（Main Memory），简称主存或内存，是CPU能直接寻址的存储空间。

**特点**：
- 速度快
- 容量有限
- 断电后数据丢失（易失性）

### 2.2 随机存取存储器（RAM）
RAM可以随机地读写任意存储单元。

#### 2.2.1 静态RAM（SRAM）
**特点**：
- 使用双稳态触发器存储信息
- 不需要刷新
- 速度快
- 集成度低
- 功耗大
- 成本高

**应用**：Cache

#### 2.2.2 动态RAM（DRAM）
**特点**：
- 使用电容存储信息
- 需要定期刷新（通常每64ms一次）
- 速度较慢
- 集成度高
- 功耗小
- 成本低

**应用**：主存

**刷新方式**：
1. **集中式刷新**：在一段时间内集中刷新
2. **分散式刷新**：每个刷新周期分散插入
3. **异步式刷新**：按行间隔刷新

### 2.3 只读存储器（ROM）
ROM中的内容在生产时或使用前写入，使用时只能读出。

#### 2.3.1 掩膜ROM（MROM）
- 生产时由厂家写入
- 内容不可更改
- 成本低，适合大批量生产

#### 2.3.2 可编程ROM（PROM）
- 用户可以一次写入
- 写入后不可更改
- 使用熔丝技术

#### 2.3.3 可擦除可编程ROM（EPROM）
- 可以多次擦除和写入
- 用紫外线擦除
- 擦除时间长（15-20分钟）

#### 2.3.4 电可擦除可编程ROM（EEPROM）
- 可以多次擦除和写入
- 用电擦除
- 可以按字节擦除

#### 2.3.5 闪速存储器（Flash Memory）
- 结合了EEPROM和RAM的优点
- 快速擦除和写入
- 按块擦除
- 非易失性

**应用**：U盘、SSD、存储卡

### 2.4 主存的组成
1. **存储体**：存储数据的核心部件
2. **地址译码器**：将地址信号转换为选择信号
3. **读/写电路**：控制数据的读写
4. **控制电路**：产生控制信号
5. **数据寄存器**：暂存读写的数据

### 2.5 主存的扩展
#### 2.5.1 位扩展
**目的**：增加字长

**方法**：多个存储器芯片并联，地址线和控制线共用，数据线分别连接。

**示例**：用8个1K×1位的芯片组成1K×8位的存储器。

#### 2.5.2 字扩展
**目的**：增加字数

**方法**：多个存储器芯片串联，数据线和部分地址线共用，高位地址线用于片选。

**示例**：用8个1K×8位的芯片组成8K×8位的存储器。

#### 2.5.3 字位扩展
**目的**：同时增加字数和字长

**方法**：结合位扩展和字扩展。

## 三、高速缓冲存储器（Cache）
### 3.1 Cache的基本原理
Cache是介于CPU和主存之间的高速小容量存储器。

**目标**：使访问速度接近Cache，容量接近主存。

**理论基础**：局部性原理

### 3.2 Cache的工作过程
1. **Cache命中**：
   - CPU要访问的数据在Cache中
   - 直接从Cache读取，速度快

2. **Cache不命中**：
   - CPU要访问的数据不在Cache中
   - 从主存读取，同时将该数据所在的块装入Cache

### 3.3 Cache的地址映射
地址映射是将主存地址映射到Cache地址。

#### 3.3.1 直接映射
**方法**：
- 主存块i映射到Cache块i mod C（C是Cache块数）
- 主存地址分为：标记、块号、块内地址

**优点**：
- 简单，硬件成本低

**缺点**：
- 冲突率高
- Cache利用率低

**示例**：
```
Cache有8块，主存块0→Cache块0，主存块8→Cache块0，冲突！
```

#### 3.3.2 全相联映射
**方法**：
- 主存的任意块可以映射到Cache的任意块
- 主存地址分为：标记、块内地址
- 需要使用相联存储器

**优点**：
- 冲突率低
- Cache利用率高

**缺点**：
- 硬件复杂
- 成本高
- 速度慢

#### 3.3.3 组相联映射
**方法**：
- Cache分为若干组
- 主存块i映射到Cache组i mod G（G是组数）
- 在组内采用全相联映射
- 主存地址分为：标记、组号、块内地址

**优点**：
- 结合了直接映射和全相联映射的优点
- 冲突率适中
- 硬件复杂度适中

**常用配置**：
- 2路组相联
- 4路组相联
- 8路组相联

### 3.4 Cache的替换策略
当Cache满了，需要替换旧块。

#### 3.4.1 随机替换（RAND）
- 随机选择一个块替换
- 简单，但可能替换掉有用的块

#### 3.4.2 先进先出（FIFO）
- 替换最早进入的块
- 简单，但可能替换掉频繁使用的块

#### 3.4.3 最近最少使用（LRU）
- 替换最久未使用的块
- 效果好，但硬件复杂
- 常用的实现：计数器、栈、最近未使用（NRU）

#### 3.4.4 最不经常使用（LFU）
- 替换使用次数最少的块
- 需要记录使用次数

### 3.5 Cache的写策略
#### 3.5.1 写直达（Write-through）
- 同时写入Cache和主存
- 实现简单
- 但写操作慢

#### 3.5.2 写回（Write-back）
- 只写入Cache
- 当块被替换时才写回主存
- 需要设置修改位（脏位）
- 写操作快
- 但实现复杂

#### 3.5.3 写分配（Write-allocate）
- 写不命中时，先将块装入Cache，再写
- 通常与写回配合使用

#### 3.5.4 不写分配（No-write-allocate）
- 写不命中时，直接写主存，不装入Cache
- 通常与写直达配合使用

### 3.6 Cache的性能分析
#### 3.6.1 命中率
```
命中率 = 命中次数 / 总访问次数
```

#### 3.6.2 平均访问时间
```
T_avg = T_cache × h + T_mem × (1 - h)
```
其中：
- T_cache：Cache访问时间
- T_mem：主存访问时间
- h：命中率

#### 3.6.3 加速比
```
加速比 = T_mem / T_avg
```

### 3.7 多级Cache
现代处理器通常使用多级Cache：

1. **L1 Cache**：
   - 在CPU核内
   - 容量小（几KB到几十KB）
   - 速度最快

2. **L2 Cache**：
   - 在CPU核内或CPU芯片上
   - 容量中等（几百KB到几MB）
   - 速度较快

3. **L3 Cache**：
   - 在CPU芯片上
   - 容量大（几MB到几十MB）
   - 共享给多个核
   - 速度较慢

## 四、虚拟存储器
### 4.1 虚拟存储器的概念
虚拟存储器将主存和辅存统一管理，为用户提供比主存大得多的地址空间。

**目标**：
- 扩大用户的地址空间
- 实现存储管理
- 提高主存利用率

### 4.2 虚拟地址和物理地址
- **虚拟地址（逻辑地址）**：程序员使用的地址
- **物理地址（实地址）**：主存的实际地址

### 4.3 虚拟存储器的分类
#### 4.3.1 页式虚拟存储器
**基本思想**：
- 将虚拟地址空间和物理地址空间都划分为固定大小的页
- 虚拟页可以映射到物理页

**地址结构**：
```
虚拟地址：虚页号 + 页内地址
物理地址：实页号 + 页内地址
```

**页表**：
- 记录虚页号到实页号的映射
- 每个程序一个页表

**快表（TLB，Translation Lookaside Buffer）**：
- Cache的一种
- 存储最近使用的页表项
- 加速地址变换

**地址变换过程**：
1. 虚页号查TLB
2. TLB命中：直接得到实页号
3. TLB不命中：查页表
4. 页表命中：得到实页号，更新TLB
5. 页表不命中：缺页，从辅存调入

#### 4.3.2 段式虚拟存储器
**基本思想**：
- 按程序的逻辑结构分段
- 每个段有段名和段长
- 段的大小不固定

**地址结构**：
```
虚拟地址：段号 + 段内地址
```

**段表**：
- 记录段号到物理地址的映射
- 每个表项包含：段起始地址、段长、访问权限

**优点**：
- 便于程序模块化
- 便于共享和保护

**缺点**：
- 容易产生碎片

#### 4.3.3 段页式虚拟存储器
**基本思想**：
- 结合段式和页式的优点
- 先分段，段内再分页

**地址结构**：
```
虚拟地址：段号 + 页号 + 页内地址
```

**优点**：
- 结合了段式和页式的优点
- 既便于模块化，又减少碎片

## 五、辅助存储器
### 5.1 磁盘存储器
#### 5.1.1 磁盘的结构
- **盘片**：多个盘片同轴旋转
- **盘面**：每个盘片有两个盘面
- **磁道**：盘面上的同心圆
- **扇区**：磁道上的扇形区域
- **柱面**：所有盘面上相同半径的磁道

#### 5.1.2 磁盘的性能指标
1. **存储容量**：
   - 格式化容量 = 面数 × 每面磁道数 × 每道扇区数 × 每扇区字节数

2. **平均寻道时间**：磁头移动到指定磁道的平均时间

3. **平均等待时间（旋转延迟）**：等待扇区旋转到磁头下的平均时间

4. **数据传输率**：单位时间内传输的数据量

5. **平均访问时间**：
   ```
   平均访问时间 = 平均寻道时间 + 平均等待时间 + 传输时间
   ```

#### 5.1.3 磁盘调度算法
1. **先来先服务（FCFS）**：按请求顺序处理
2. **最短寻道时间优先（SSTF）**：选择距离最近的请求
3. **扫描算法（SCAN）**：像电梯一样来回扫描
4. **循环扫描算法（C-SCAN）**：只在一个方向扫描

### 5.2 固态硬盘（SSD）
**特点**：
- 使用闪存存储
- 无机械部件
- 读写速度快
- 抗震
- 功耗低
- 寿命有限（擦写次数）

**与HDD的比较**：
- SSD速度快，但成本高
- HDD容量大，成本低，但速度慢

## 六、存储保护
### 6.1 存储保护的目的
1. **防止越界访问**：防止程序访问不属于自己的存储区域
2. **防止越权访问**：防止程序进行未授权的操作
3. **保护系统程序**：保护操作系统不受用户程序破坏

### 6.2 存储保护的方法
1. **界地址寄存器**：设置上界和下界寄存器
2. **存储键**：每个存储块有一个键，程序有访问键
3. **环保护**：不同特权级的程序访问不同的区域
4. **页表保护**：在页表中设置访问权限位

## 七、总结
存储系统是计算机系统的重要组成部分，采用多级层次结构以获得高速度、大容量和低成本的平衡。主存是CPU能直接访问的存储器，Cache利用局部性原理提高访问速度，虚拟存储器扩大了用户的地址空间。理解存储系统的工作原理对于系统设计和性能优化非常重要。

---

## 章节：8 DDCAarm_Ch6笔记

# 8 DDCAarm_Ch6 输入输出系统笔记

## 一、I/O系统概述
### 1.1 I/O系统的功能
输入输出（I/O）系统负责计算机与外部设备之间的数据传输。

**主要功能**：
1. **设备控制**：控制外部设备的操作
2. **数据传输**：在主机和外设之间传输数据
3. **缓冲管理**：协调不同速度的设备
4. **错误处理**：检测和处理传输错误

### 1.2 I/O系统的组成
1. **I/O设备**：输入设备、输出设备
2. **I/O接口**：设备控制器、I/O适配器
3. **I/O总线**：连接主机和I/O设备的总线
4. **I/O软件**：设备驱动程序、操作系统I/O模块

### 1.3 I/O设备的分类
#### 1.3.1 按使用特性分类
1. **输入设备**：键盘、鼠标、扫描仪、摄像头
2. **输出设备**：显示器、打印机、扬声器
3. **存储设备**：磁盘、磁带、光盘
4. **通信设备**：网卡、调制解调器

#### 1.3.2 按传输速率分类
1. **低速设备**：键盘、鼠标（几十字节/秒）
2. **中速设备**：打印机、扫描仪（几万字节/秒）
3. **高速设备**：磁盘、网卡（几百万字节/秒以上）

#### 1.3.3 按信息交换单位分类
1. **块设备**：以数据块为单位传输（磁盘）
2. **字符设备**：以字符为单位传输（键盘、串口）

## 二、I/O控制方式
### 2.1 程序查询方式（Programmed I/O）
#### 2.1.1 工作原理
CPU不断查询设备的状态，直到设备准备好才进行数据传输。

**流程**：
1. CPU向设备发出命令
2. CPU循环查询设备状态
3. 设备准备好后，CPU进行数据传输
4. 重复以上步骤

#### 2.1.2 优缺点
**优点**：
- 实现简单
- 硬件开销小

**缺点**：
- CPU利用率低（忙等待）
- 不能处理并发I/O
- 响应速度慢

#### 2.1.3 示例代码
```c
// 程序查询方式读取磁盘
void read_disk_programmed(int block_num, char *buffer) {
    // 1. 发送读命令和块号
    disk_command = READ;
    disk_block = block_num;
    
    // 2. 查询状态，等待准备好
    while (disk_status != READY) {
        // 忙等待
    }
    
    // 3. 传输数据
    for (int i = 0; i < BLOCK_SIZE; i++) {
        buffer[i] = disk_data;
    }
}
```

### 2.2 程序中断方式（Interrupt-driven I/O）
#### 2.2.1 工作原理
设备准备好后向CPU发送中断请求，CPU响应中断并执行中断服务程序。

**流程**：
1. CPU向设备发出命令
2. CPU继续执行其他程序
3. 设备准备好后向CPU发中断请求
4. CPU响应中断，保存现场
5. CPU执行中断服务程序，传输数据
6. CPU恢复现场，继续执行被中断的程序

#### 2.2.2 优缺点
**优点**：
- CPU利用率高
- 可以处理并发I/O
- 响应速度快

**缺点**：
- 中断处理开销
- 硬件复杂
- 需要保护和恢复现场

#### 2.2.3 示例代码
```c
// 中断服务程序
void disk_interrupt_handler() {
    // 传输数据
    for (int i = 0; i < BLOCK_SIZE; i++) {
        buffer[i] = disk_data;
    }
    
    // 清除中断请求
    disk_interrupt = CLEAR;
    
    // 发送完成信号
    io_done = TRUE;
}

// 主程序
void read_disk_interrupt(int block_num, char *buffer) {
    // 1. 发送读命令和块号
    disk_command = READ;
    disk_block = block_num;
    
    // 2. 启用中断
    disk_interrupt_enable = TRUE;
    
    // 3. 继续执行其他任务
    while (!io_done) {
        do_other_work();
    }
}
```

### 2.3 直接存储器访问方式（DMA，Direct Memory Access）
#### 2.3.1 工作原理
DMA控制器代替CPU控制数据传输，只在开始和结束时需要CPU干预。

**流程**：
1. CPU向DMA控制器发送参数（源地址、目的地址、传输长度）
2. CPU继续执行其他程序
3. DMA控制器控制数据在主存和外设之间传输
4. 传输完成后，DMA控制器向CPU发中断请求
5. CPU响应中断，进行后续处理

#### 2.3.2 DMA控制器的组成
1. **地址寄存器（AR）**：存放主存地址
2. **字计数器（WC）**：记录传输的字数
3. **数据缓冲寄存器（DR）**：暂存数据
4. **控制/状态逻辑**：产生控制信号

#### 2.3.3 DMA的工作方式
1. **停止CPU访问主存**：
   - DMA传输期间，CPU不能访问主存
   - 简单，但CPU利用率低

2. **周期挪用**：
   - DMA挪用一个或几个存取周期
   - CPU利用率高，实现复杂

3. **交替访存**：
   - CPU和DMA交替访问主存
   - 适合CPU周期比主存周期长的情况

#### 2.3.4 优缺点
**优点**：
- CPU利用率最高
- 传输速度快
- 适合大量数据传输

**缺点**：
- 硬件复杂
- 成本高

#### 2.3.5 示例代码
```c
// DMA初始化
void init_dma(int src_addr, int dst_addr, int count) {
    dma_source = src_addr;
    dma_dest = dst_addr;
    dma_count = count;
    dma_command = START;
}

// DMA中断服务程序
void dma_interrupt_handler() {
    dma_interrupt = CLEAR;
    io_done = TRUE;
}

// 主程序
void read_disk_dma(int block_num, char *buffer) {
    // 1. 计算磁盘地址和主存地址
    int disk_addr = block_num * BLOCK_SIZE;
    int mem_addr = (int)buffer;
    
    // 2. 初始化DMA
    init_dma(disk_addr, mem_addr, BLOCK_SIZE);
    
    // 3. 启用DMA中断
    dma_interrupt_enable = TRUE;
    
    // 4. 继续执行其他任务
    while (!io_done) {
        do_other_work();
    }
}
```

### 2.4 通道方式（Channel I/O）
#### 2.4.1 工作原理
通道是专门的I/O处理器，可以执行通道程序，控制多台设备。

**特点**：
- 通道有自己的指令系统
- 可以执行通道程序
- 进一步减少CPU干预

#### 2.4.2 通道的类型
1. **字节多路通道**：
   - 连接多台低速设备
   - 分时为多台设备服务

2. **数组选择通道**：
   - 连接多台高速设备
   - 一段时间只为一台设备服务

3. **数组多路通道**：
   - 结合前两者的优点
   - 多台高速设备交叉传输

## 三、中断系统
### 3.1 中断的基本概念
#### 3.1.1 中断的定义
中断是指CPU在执行程序的过程中，遇到某种紧急或特殊事件时，暂停执行当前程序，转去处理该事件，处理完后再返回到原程序继续执行。

#### 3.1.2 中断的相关概念
1. **中断源**：引起中断的事件
2. **中断请求**：中断源向CPU发出的请求
3. **中断响应**：CPU接受中断请求
4. **中断服务**：CPU执行中断服务程序
5. **中断返回**：CPU返回到原程序

#### 3.1.3 中断的分类
1. **按中断源分类**：
   - 内部中断：由CPU内部事件引起（如除法错、溢出）
   - 外部中断：由CPU外部事件引起（如I/O设备、时钟）

2. **按中断是否可屏蔽分类**：
   - 可屏蔽中断：可以被CPU屏蔽
   - 不可屏蔽中断（NMI）：不能被CPU屏蔽

3. **按处理方式分类**：
   - 向量中断：由硬件提供中断向量
   - 非向量中断：由软件查询确定中断源

### 3.2 中断处理过程
#### 3.2.1 中断请求
中断源向CPU发送中断请求信号。

**中断请求的条件**：
1. 中断源有请求
2. 中断未被屏蔽

#### 3.2.2 中断判优
多个中断同时请求时，确定优先处理哪个。

**判优方法**：
1. **硬件判优**：
   - 链式排队
   - 并行排队

2. **软件判优**：
   - 查询法
   - 按优先级顺序查询

#### 3.2.3 中断响应
CPU响应中断的条件：
1. 有中断请求
2. 中断未被屏蔽
3. CPU开中断
4. 当前指令执行完毕

**中断响应的操作**：
1. 关中断
2. 保存断点（PC）
3. 转中断服务程序

#### 3.2.4 保护现场
保存中断服务程序中要使用的寄存器。

```assembly
PUSH R0
PUSH R1
PUSH R2
; ...
```

#### 3.2.5 中断服务
执行中断服务程序，处理中断事件。

#### 3.2.6 恢复现场
恢复之前保存的寄存器。

```assembly
POP R2
POP R1
POP R0
; ...
```

#### 3.2.7 中断返回
返回到原程序继续执行。

```assembly
IRET  ; 中断返回指令
```

### 3.3 多重中断
#### 3.3.1 中断嵌套
在执行中断服务程序时，又响应更高级的中断。

**实现条件**：
1. 中断服务程序中开中断
2. 新中断的优先级更高

#### 3.3.2 中断屏蔽
通过屏蔽字控制哪些中断可以被响应。

**示例**：
```
屏蔽字：1 1 0 1 0 （1表示屏蔽，0表示允许）
表示：中断0、1、3被屏蔽，中断2、4允许
```

## 四、总线系统
### 4.1 总线的基本概念
#### 4.1.1 总线的定义
总线是连接多个部件的一组公共信号线，是各部件共享的传输介质。

#### 4.1.2 总线的特点
1. **共享性**：多个部件可以使用总线
2. **分时性**：同一时间只能有一个主设备控制总线

#### 4.1.3 总线的分类
1. **按功能分类**：
   - 数据总线：传输数据
   - 地址总线：传输地址
   - 控制总线：传输控制信号

2. **按层次分类**：
   - 片内总线：芯片内部
   - 系统总线：CPU、主存、I/O之间
   - 通信总线：计算机之间

3. **按时序分类**：
   - 同步总线：由统一时钟控制
   - 异步总线：没有统一时钟

### 4.2 总线的组成
1. **数据总线**：
   - 双向
   - 位数与字长有关

2. **地址总线**：
   - 单向（主设备→从设备）
   - 位数与地址空间有关

3. **控制总线**：
   - 传输控制信号
   - 包括：读/写、时钟、复位、中断、应答等

### 4.3 总线仲裁
多个主设备同时请求总线时，确定哪个设备获得总线控制权。

#### 4.3.1 集中式仲裁
1. **链式查询**：
   - 设备链式连接
   - 优先级固定
   - 简单，扩展性差

2. **计数器定时查询**：
   - 计数器循环计数
   - 优先级灵活
   - 稍复杂

3. **独立请求**：
   - 每个设备有独立的请求线
   - 响应快，优先级灵活
   - 控制线多，复杂

#### 4.3.2 分布式仲裁
每个设备都有仲裁逻辑，公平竞争。

### 4.4 总线操作定时
#### 4.4.1 同步定时
由统一时钟控制总线操作。

**优点**：
- 简单
- 速度快

**缺点**：
- 灵活性差
- 不适合速度差异大的设备

#### 4.4.2 异步定时
没有统一时钟，用握手信号协调。

**优点**：
- 灵活
- 适合速度差异大的设备

**缺点**：
- 复杂
- 速度稍慢

### 4.5 总线标准
常用的总线标准：
1. **ISA**：工业标准架构（旧）
2. **PCI**：外设部件互连
3. **PCI Express**：高速串行总线
4. **USB**：通用串行总线
5. **SATA**：串行ATA
6. **SCSI**：小型计算机系统接口

## 五、I/O接口
### 5.1 I/O接口的功能
1. **数据缓冲**：协调不同速度的设备
2. **信号转换**：电平、格式转换
3. **地址译码**：选择设备
4. **命令译码**：解释设备命令
5. **状态反馈**：报告设备状态
6. **中断控制**：管理中断

### 5.2 I/O接口的类型
1. **按数据传送方式分类**：
   - 并行接口：多位同时传输
   - 串行接口：一位一位传输

2. **按控制方式分类**：
   - 程序查询接口
   - 中断接口
   - DMA接口

### 5.3 端口寻址
1. **独立编址**：
   - I/O端口地址与主存地址分开
   - 有专门的I/O指令
   - 如x86的IN/OUT指令

2. **统一编址**：
   - I/O端口地址与主存地址统一
   - 用访存指令访问I/O
   - 如ARM的LOAD/STORE指令

## 六、常用I/O设备
### 6.1 键盘
- 输入设备
- 矩阵式键盘
- 按键识别：行扫描法、行列反转法

### 6.2 显示器
- 输出设备
- 分类：CRT、LCD、LED
- 主要指标：分辨率、刷新率、色彩深度

### 6.3 打印机
- 输出设备
- 分类：针式、喷墨、激光
- 主要指标：打印速度、分辨率

### 6.4 磁盘
- 存储设备
- 参见上一章存储系统

## 七、总结
输入输出系统是计算机系统的重要组成部分，负责主机与外部设备之间的数据传输。I/O控制方式从程序查询、程序中断到DMA和通道，不断提高CPU的利用率。中断系统是实现程序中断方式的关键，总线系统是连接各部件的基础设施。理解I/O系统对于系统设计和性能优化非常重要。

---

## 章节：计算机组成原理综合笔记

# 计算机组成原理综合笔记

## 一、计算机系统概述
### 1.1 计算机系统的组成
- **硬件系统**：
  - 运算器
  - 控制器
  - 存储器
  - 输入设备
  - 输出设备

- **软件系统**：
  - 系统软件
  - 应用软件

### 1.2 计算机的发展历程
1. **第一代**：电子管计算机（1946-1957）
2. **第二代**：晶体管计算机（1958-1964）
3. **第三代**：集成电路计算机（1965-1971）
4. **第四代**：大规模集成电路计算机（1972-至今）
5. **第五代**：智能计算机（未来）

### 1.3 计算机的主要性能指标
1. **字长**：计算机一次能处理的二进制数的位数
2. **主频**：CPU的时钟频率
3. **运算速度**：MIPS（每秒百万条指令）、MFLOPS（每秒百万次浮点运算）
4. **存储容量**：
   - 主存容量
   - 辅存容量
5. **吞吐量**：单位时间内处理的工作量
6. **响应时间**：从请求到响应的时间

## 二、计算机系统结构
### 2.1 冯·诺依曼结构
- **特点**：
  1. 计算机由运算器、控制器、存储器、输入设备和输出设备组成
  2. 指令和数据以同等地位存储在存储器中
  3. 指令和数据用二进制表示
  4. 指令由操作码和地址码组成
  5. 指令在存储器中按顺序存放
  6. 以运算器为中心

### 2.2 现代计算机结构
- **以存储器为中心**
- **总线结构**：
  - 地址总线
  - 数据总线
  - 控制总线

## 三、ARM架构
### 3.1 ARM架构概述
- **ARM**：Advanced RISC Machines
- **特点**：
  - RISC（精简指令集计算机）架构
  - 低功耗
  - 高性能
  - 广泛应用于嵌入式系统、智能手机等

### 3.2 ARM处理器模式
1. **用户模式（User）**：正常程序执行
2. **快速中断模式（FIQ）**：处理快速中断
3. **外部中断模式（IRQ）**：处理普通中断
4. **管理模式（SVC）**：操作系统使用
5. **数据访问中止模式（Abort）**：处理数据和指令预取中止
6. **未定义指令中止模式（Undef）**：处理未定义指令
7. **系统模式（System）**：运行特权操作系统任务

### 3.3 ARM寄存器
1. **通用寄存器**：
   - R0-R12：通用寄存器
   - R13：堆栈指针（SP）
   - R14：链接寄存器（LR）
   - R15：程序计数器（PC）

2. **程序状态寄存器（CPSR）**：
   - 条件码标志
   - 中断禁止位
   - 模式位

### 3.4 ARM指令集
1. **数据处理指令**：
   - ADD：加法
   - SUB：减法
   - AND：与
   - ORR：或
   - EOR：异或
   - LSL：逻辑左移
   - LSR：逻辑右移

2. **加载/存储指令**：
   - LDR：加载
   - STR：存储
   - LDM：加载多个
   - STM：存储多个

3. **分支指令**：
   - B：分支
   - BL：带链接的分支
   - BX：分支并切换指令集

4. **程序状态寄存器指令**：
   - MRS：读CPSR/SPSR
   - MSR：写CPSR/SPSR

## 四、指令系统
### 4.1 指令格式
- **指令的组成**：
  1. 操作码：指示操作的性质
  2. 地址码：指示操作数的地址

- **地址码的分类**：
  1. 零地址指令
  2. 一地址指令
  3. 二地址指令
  4. 三地址指令
  5. 多地址指令

### 4.2 指令寻址方式
1. **立即寻址**：操作数在指令中
2. **直接寻址**：操作数地址在指令中
3. **间接寻址**：操作数地址在内存单元中
4. **寄存器寻址**：操作数在寄存器中
5. **寄存器间接寻址**：操作数地址在寄存器中
6. **相对寻址**：PC + 位移量
7. **基址寻址**：基址寄存器 + 位移量
8. **变址寻址**：变址寄存器 + 位移量
9. **堆栈寻址**：使用堆栈

### 4.3 指令的分类
1. **数据传送类指令**
2. **算术运算类指令**
3. **逻辑运算类指令**
4. **程序控制类指令**
5. **输入输出类指令**
6. **其他指令**

### 4.4 CISC和RISC
1. **CISC（复杂指令集计算机）**：
   - 指令数量多
   - 指令长度不固定
   - 寻址方式多
   - 指令执行时间长
   - 代表：x86

2. **RISC（精简指令集计算机）**：
   - 指令数量少
   - 指令长度固定
   - 寻址方式少
   - 指令执行时间短
   - 大量使用寄存器
   - 代表：ARM、MIPS

## 五、中央处理器（CPU）
### 5.1 CPU的功能
1. **指令控制**：控制指令的执行顺序
2. **操作控制**：产生操作信号
3. **时间控制**：控制操作的时序
4. **数据加工**：对数据进行运算和处理

### 5.2 CPU的组成
1. **运算器**：
   - 算术逻辑单元（ALU）
   - 通用寄存器
   - 状态寄存器
   - 暂存器

2. **控制器**：
   - 程序计数器（PC）
   - 指令寄存器（IR）
   - 指令译码器
   - 操作控制器
   - 时序产生器

### 5.3 指令周期
- **指令周期**：取出并执行一条指令的时间
- **指令周期的步骤**：
  1. 取指周期
  2. 间址周期（如果有）
  3. 执行周期
  4. 中断周期（如果有）

### 5.4 时序系统
1. **机器周期**：完成一个基本操作的时间
2. **时钟周期**：CPU的基本时间单位
3. **工作脉冲**：最基本的时间单位

### 5.5 控制单元的设计
1. **硬布线控制**：
   - 用逻辑电路实现
   - 速度快
   - 难以修改

2. **微程序控制**：
   - 用微程序实现
   - 灵活性高
   - 易于修改

## 六、流水线技术
### 6.1 流水线的基本概念
- **流水线**：将一个任务分解为多个子任务，每个子任务在不同的功能段上同时执行
- **特点**：
  - 时间重叠
  - 资源共享

### 6.2 流水线的分类
1. **按级别**：
   - 部件级流水线
   - 处理机级流水线
   - 系统级流水线

2. **按功能**：
   - 单功能流水线
   - 多功能流水线

3. **按连接方式**：
   - 静态流水线
   - 动态流水线

4. **按数据表示**：
   - 标量流水线
   - 向量流水线

### 6.3 流水线的性能指标
1. **吞吐率（TP）**：单位时间内完成的任务数
2. **加速比（S）**：非流水线时间 / 流水线时间
3. **效率（E）**：设备的利用率

### 6.4 流水线的相关问题
1. **结构相关**：硬件资源冲突
2. **数据相关**：
   - 写后读（RAW）
   - 读后写（WAR）
   - 写后写（WAW）
3. **控制相关**：分支指令引起的

### 6.5 解决相关的方法
1. **结构相关**：
   - 增加硬件资源
   - 指令调度

2. **数据相关**：
   - 定向（旁路）技术
   - 插入气泡
   - 编译器调度

3. **控制相关**：
   - 分支预测
   - 延迟分支
   - 提前计算分支目标

## 七、存储系统
### 7.1 存储器的分类
1. **按存储介质**：
   - 半导体存储器
   - 磁表面存储器
   - 光存储器

2. **按存取方式**：
   - 随机存取存储器（RAM）
   - 只读存储器（ROM）
   - 顺序存取存储器（SAM）
   - 直接存取存储器（DAM）

3. **按作用**：
   - 主存储器
   - 辅助存储器
   - 高速缓冲存储器（Cache）

### 7.2 主存储器
1. **RAM（随机存取存储器）**：
   - SRAM（静态RAM）：速度快，集成度低，功耗大
   - DRAM（动态RAM）：速度较慢，集成度高，功耗小，需要刷新

2. **ROM（只读存储器）**：
   - MROM（掩膜ROM）：生产时写入
   - PROM（可编程ROM）：一次写入
   - EPROM（可擦除可编程ROM）：紫外线擦除
   - EEPROM（电可擦除可编程ROM）：电擦除
   - Flash Memory：闪速存储器

3. **主存的扩展**：
   - 位扩展：增加字长
   - 字扩展：增加字数
   - 字位扩展：同时增加字长和字数

### 7.3 高速缓冲存储器（Cache）
1. **Cache的基本原理**：
   - 基于程序访问的局部性原理
   - 时间局部性
   - 空间局部性

2. **Cache的地址映射**：
   - 直接映射
   - 全相联映射
   - 组相联映射

3. **Cache的替换策略**：
   - 随机替换（RAND）
   - 先进先出（FIFO）
   - 最近最少使用（LRU）
   - 最不经常使用（LFU）

4. **Cache的写策略**：
   - 写直达（Write-through）
   - 写回（Write-back）
   - 写分配（Write-allocate）
   - 不写分配（No-write-allocate）

### 7.4 虚拟存储器
1. **虚拟存储器的概念**：
   - 将主存和辅存统一管理
   - 为用户提供比主存大得多的地址空间

2. **虚拟存储器的分类**：
   - 页式虚拟存储器
   - 段式虚拟存储器
   - 段页式虚拟存储器

3. **页式虚拟存储器**：
   - 虚拟地址分为虚页号和页内地址
   - 物理地址分为实页号和页内地址
   - 页表记录虚页号到实页号的映射
   - 快表（TLB）加速地址变换

4. **段式虚拟存储器**：
   - 虚拟地址分为段号和段内地址
   - 段表记录段号到物理地址的映射

5. **段页式虚拟存储器**：
   - 结合了段式和页式的优点

## 八、输入输出系统
### 8.1 I/O系统的组成
1. **I/O设备**：
   - 输入设备
   - 输出设备

2. **I/O接口**：
   - 设备控制器
   - I/O适配器

3. **I/O总线**

### 8.2 I/O控制方式
1. **程序查询方式**：
   - CPU不断查询设备状态
   - CPU利用率低

2. **程序中断方式**：
   - 设备准备好后向CPU发中断请求
   - CPU响应中断，执行中断服务程序
   - CPU利用率高

3. **DMA方式**：
   - 直接存储器访问
   - DMA控制器控制数据传输
   - CPU只在开始和结束时干预

4. **通道方式**：
   - 通道是专门的I/O处理器
   - 执行通道程序
   - 进一步提高CPU利用率

### 8.3 中断系统
1. **中断的基本概念**：
   - 中断源
   - 中断请求
   - 中断响应
   - 中断服务
   - 中断返回

2. **中断的分类**：
   - 内部中断
   - 外部中断

3. **中断的处理过程**：
   - 中断请求
   - 中断判优
   - 中断响应
   - 保护现场
   - 中断服务
   - 恢复现场
   - 中断返回

4. **多重中断**：
   - 中断嵌套
   - 中断屏蔽

### 8.4 总线
1. **总线的概念**：
   - 连接多个部件的一组公共信号线
   - 分时共享

2. **总线的分类**：
   - 数据总线
   - 地址总线
   - 控制总线

3. **总线的特性**：
   - 物理特性
   - 功能特性
   - 电气特性
   - 时间特性

4. **总线的仲裁**：
   - 集中式仲裁
     - 链式查询
     - 计数器定时查询
     - 独立请求
   - 分布式仲裁

5. **总线的操作定时**：
   - 同步定时
   - 异步定时

6. **常用的总线标准**：
   - ISA
   - PCI
   - PCI Express
   - USB
   - SCSI

## 九、总结
计算机组成原理是计算机科学的基础课程，涵盖计算机系统概述、计算机系统结构、ARM架构、指令系统、中央处理器、流水线技术、存储系统和输入输出系统等内容。理解这些知识对于深入理解计算机的工作原理和进行系统设计都非常重要。