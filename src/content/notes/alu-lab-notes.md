---
title: 数字电路实验：用 SystemVerilog 写一个带标志位的 ALU
date: 2026-05-20
type: learning
tags: [数字电路, 实验, SystemVerilog, ALU, 仿真]
summary: 数电实验归纳：用 SystemVerilog 实现带负/零/进位/溢出标志的 4 位 ALU（加/减/与/或），并用 Icarus Verilog 仿真验证。含进位与溢出判定的推导。
---

## 实验内容

用 SystemVerilog 写一个参数化位宽的 ALU，支持四种运算：**加法、减法、按位与、按位或**，并输出 4 个状态标志：N（负）、Z（零）、C（进位）、V（溢出）。

仿真环境：Icarus Verilog（iverilog + vvp + gtkwave 看波形），SystemVerilog 语法需要 `-g2012` 选项。

## ALU 核心代码

```systemverilog
module alu #(parameter WIDTH = 3)(
  input  logic [WIDTH:0] a, b,
  input  logic [1:0]  ALUControl,
  output logic [WIDTH:0] Result,
  output logic [3:0]  ALUFlags
);

  logic [WIDTH+1:0] sum;   // 加宽两位：存进位
  assign sum = a + b + ALUControl[0];  // 减 = 加补码（借位当进位加 1）
  ...
endmodule
```

关键点：

- **减法实现**：`ALUControl[0]` 兼作"加 1"，减法时对 b 取反再补 1，等价于 a + (~b) + 1
- **sum 加宽两位**（`WIDTH+1:0`）：最高位存进位，才能正确判断 carry
- 各标志的判定：
  - **neg**：结果最高位（符号位）为 1
  - **zero**：结果全 0
  - **carry**：`ALUControl[1]==0`（仅算术运算）且 `sum[WIDTH+1]`（最高进位）
  - **overflow**：两个操作数符号相同且与结果符号不同 → 符号位异或判定

```systemverilog
assign overflow = (ALUControl[1] == 1'b0) &
                  ~(a[WIDTH] ^ b[WIDTH] ^ ALUControl[0]) &
                  (a[WIDTH] ^ sum[WIDTH]);
```

溢出判定推导：`a[WIDTH] ^ b[WIDTH]` 判断两操作数符号是否相同（减法则异或上借位信号），`a[WIDTH] ^ sum[WIDTH]` 判断操作数符号与结果是否相反。两者同时成立即为溢出。

## 测试平台

testbench 覆盖四种运算各一组用例：2+4=6、4-2=2、4&2=0、4|2=6，并用 `$display` 输出 pass/fail：

```systemverilog
ALU myALU(.a(X), .b(Y), .ALUControl(C), .Result(Z), .ALUFlags(F));
X = 4'd2; Y = 4'd4; C = 2'b00;
if (Z !== 4'd6) $display("2+4 failed.");
else $display("2+4=6 success.");
```

仿真流程：

```bash
iverilog -g2012 -o test_ALU.vvp ALU.sv test_ALU.sv
vvp test_ALU.vvp
gtkwave test_ALU.vcd   # 查看波形
```

testbench 里用 `$dumpfile` + `$dumpvars` 生成 vcd 波形文件，gtkwave 可视化观察信号变化。

## 收获

- 减法转加法的补码思路，让 ALU 只需一个加法器
- 溢出和进位是两回事：**进位看最高位进位，溢出看符号位是否被破坏**（正+正得负 / 负+负得正）
- 参数化（`#(parameter WIDTH)`）让 ALU 可复用，换个位宽不用改逻辑
- 仿真先行：先写 testbench 定预期，再实现功能，跑通后看波形确认时序
