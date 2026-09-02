---
title: "编译原理主题笔记合集（语法制导/语义/代码生成）"
date: "2025-06"
type: "learning"
tags: [编译原理, 语法制导, 中间代码, 代码生成, 运行时]
summary: "编译原理按主题整理的章节笔记合集，覆盖语法制导翻译、语义分析、中间表示、代码生成与优化、运行时环境（共9篇章节笔记合并）"
---

# 编译原理主题笔记合集（语法制导/语义/代码生成）


---

## 章节：第4章 语法制导翻译笔记

# 第4章 语法制导翻译笔记

## 一、语法制导翻译概述
### 1.1 什么是语法制导翻译
语法制导翻译（Syntax-Directed Translation）是一种在语法分析的同时进行语义分析和中间代码生成的方法。

**基本思想**：
- 为文法的每个产生式附加语义规则（或动作）
- 在语法分析过程中，根据产生式的应用执行相应的语义动作

### 1.2 语法制导定义
语法制导定义（Syntax-Directed Definition, SDD）是对上下文无关文法的推广，它将每个文法符号和一个属性集合相关联，将每个产生式和一组语义规则相关联。

**组成**：
1. **上下文无关文法**
2. **属性**：与文法符号相关联
3. **语义规则**：与产生式相关联

### 1.3 语法制导翻译方案
语法制导翻译方案（Syntax-Directed Translation Scheme, SDT）是将语义动作嵌入到产生式右部的适当位置。

## 二、属性
### 2.1 属性的分类
#### 2.1.1 综合属性（Synthesized Attribute）
- 自下而上传递信息
- 结点的属性值由其子结点的属性值确定
- 可以用分析栈来实现

**示例**：
```
产生式：E → E1 + T
语义规则：E.val = E1.val + T.val

产生式：E → T
语义规则：E.val = T.val

产生式：T → T1 * F
语义规则：T.val = T1.val * F.val

产生式：T → F
语义规则：T.val = F.val

产生式：F → ( E )
语义规则：F.val = E.val

产生式：F → digit
语义规则：F.val = digit.lexval
```

#### 2.1.2 继承属性（Inherited Attribute）
- 自上而下传递信息
- 结点的属性值由其父结点或兄弟结点的属性值确定

**示例**：
```
产生式：D → T L
语义规则：L.in = T.type

产生式：T → int
语义规则：T.type = integer

产生式：T → real
语义规则：T.type = real

产生式：L → L1, id
语义规则：L1.in = L.in
         addtype(id.entry, L.in)

产生式：L → id
语义规则：addtype(id.entry, L.in)
```

### 2.2 属性文法
如果一个语法制导定义只使用综合属性，则称为S-属性文法（S-Attributed Grammar）。

如果一个语法制导定义使用继承属性，但满足一定条件，则称为L-属性文法（L-Attributed Grammar）。

## 三、语法制导定义的应用
### 3.1 表达式求值
**SDD**：
```
产生式          语义规则
L → E n         print(E.val)
E → E1 + T      E.val = E1.val + T.val
E → T           E.val = T.val
T → T1 * F      T.val = T1.val * F.val
T → F           T.val = F.val
F → ( E )       F.val = E.val
F → digit       F.val = digit.lexval
```

**示例**：
输入：3 + 5 * 4 n

分析树和属性计算：
```
        L
        |
        E
       /|\
      E + T
      |  /|\
      T T * F
      | |   |
      F F digit (4)
      | |
   digit (3) F
             |
          digit (5)

E.val = 3 + (5 * 4) = 23
输出：23
```

### 3.2 类型检查
**SDD**：
```
产生式          语义规则
S → D           S.type = D.type
D → T L         L.in = T.type
                D.type = L.type
T → int         T.type = integer
T → real        T.type = real
L → L1, id     L1.in = L.in
                addtype(id.entry, L.in)
                L.type = if L1.type = error or id.type ≠ L.in
                           then error
                           else L.in
L → id          addtype(id.entry, L.in)
                L.type = if id.type = L.in then L.in else error
```

## 四、依赖图
### 4.1 依赖图的概念
依赖图（Dependency Graph）用于表示分析树中属性之间的依赖关系。

**构造规则**：
1. 为分析树中的每个结点的每个属性建立一个结点
2. 对于每个产生式的语义规则，若b依赖于a，则建立从a到b的有向边

### 4.2 依赖图示例
**产生式**：E → E1 + T
**语义规则**：E.val = E1.val + T.val

**依赖图**：
```
E.val ← E1.val
      ← T.val
```

### 4.3 完整的依赖图示例
**SDD**：
```
产生式          语义规则
L → E n         print(E.val)
E → E1 + T      E.val = E1.val + T.val
E → T           E.val = T.val
T → T1 * F      T.val = T1.val * F.val
T → F           T.val = F.val
F → ( E )       F.val = E.val
F → digit       F.val = digit.lexval
```

**输入**：`3 + 5 * 4 n`

**分析树**：
```
            L
          / | \
         E  n  print
       / | \
      E  +  T
      |   / | \
      T  T  *  F
      |  |     |
      F  F  digit (4)
      |  |
  digit (3) F
           |
        digit (5)
```

**依赖图**：
```
digit (3).lexval → F.val → T.val → E1.val
                                        ↘
                            E.val ← + ←
                                        ↗
digit (5).lexval → F.val → T1.val
                            ↘
                        T.val ← * ←
                            ↗
            digit (4).lexval → F.val
                                    ↘
                                print
```

### 4.4 依赖图的另一个示例：继承属性
**SDD**：
```
产生式          语义规则
D → T L         L.in = T.type
T → int         T.type = integer
T → real        T.type = real
L → L1, id     L1.in = L.in
                addtype(id.entry, L.in)
L → id          addtype(id.entry, L.in)
```

**输入**：`int a, b, c`

**分析树**：
```
        D
      / | \
     T  L
     | / | \
   int L1 , id
        / | \
       L2 , id
          |
          id (c)
```

**依赖图**：
```
T.type → L.in
         ↓
      L1.in → addtype (a)
         ↓
      L2.in → addtype (b)
         ↓
      addtype (c)
```

## 五、求值顺序
### 5.1 拓扑排序
依赖图的一个拓扑排序给出了属性求值的顺序。

**拓扑排序定义**：
对于有向无环图（DAG），拓扑排序是顶点的一个线性排列，使得对于每条有向边u→v，顶点u在排列中都出现在v的前面。

### 5.2 拓扑排序算法（Kahn算法）
```
算法：
1. 计算每个结点的入度
2. 将所有入度为0的结点加入队列
3. while 队列不为空：
   a. 取出结点u，加入拓扑排序结果
   b. 对于u的每个后继v：
      i. v的入度减1
      ii. 如果v的入度变为0，加入队列
4. 如果结果中的结点数 < 总结点数，说明有环
```

### 5.3 拓扑排序示例
**依赖图**：
```
A → B → C
 ↘   ↗
   D
```

**计算入度**：
```
A: 0
B: 1
C: 1
D: 1
```

**拓扑排序步骤**：
```
队列初始：[A]
取出A，结果：[A]
处理A的后继B、D：
  B的入度：1-1=0
  D的入度：1-1=0
队列变为：[B, D]

取出B，结果：[A, B]
处理B的后继C：
  C的入度：1-1=0
队列变为：[D, C]

取出D，结果：[A, B, D]
D无后继
队列变为：[C]

取出C，结果：[A, B, D, C]
C无后继
队列为空

一个拓扑排序：A, B, D, C
另一个可能的拓扑排序：A, D, B, C
```

### 5.4 S-属性文法的求值
S-属性文法可以在自下而上分析时同时计算属性值。

**实现方法**：
- 使用分析栈
- 每个栈元素保存文法符号和对应的属性值
- 归约时，根据产生式的语义规则计算父结点的属性

**示例**：
```
产生式：E → E1 + T
语义规则：E.val = E1.val + T.val

分析栈（符号+属性）：
...
E1 (val=3)
+
T (val=5)
...

归约时：
弹出E1、+、T
计算E.val = 3 + 5 = 8
压入E (val=8)
```

### 5.5 L-属性文法的求值
L-属性文法可以在自上而下分析时计算属性值。

**L-属性文法的条件**：
1. 综合属性
2. 继承属性，但继承属性只能依赖于：
   - 父结点的继承属性
   - 左边兄弟结点的任何属性

**实现方法**：
- 递归下降分析时传递继承属性
- 或者用预测分析器实现

## 六、语法制导翻译方案
### 6.1 SDT的概念
SDT将语义动作嵌入到产生式右部。

**示例**：
```
产生式：L → E { print(E.val) } n
产生式：E → E1 + T { E.val = E1.val + T.val }
产生式：E → T { E.val = T.val }
产生式：T → T1 * F { T.val = T1.val * F.val }
产生式：T → F { T.val = F.val }
产生式：F → ( E ) { F.val = E.val }
产生式：F → digit { F.val = digit.lexval }
```

### 6.2 SDT的实现
可以在递归下降分析器中实现SDT。

**递归下降分析器示例（表达式求值）**：
```python
def parse_L():
    val = parse_E()
    match('n')
    print(val)
    return val

def parse_E():
    val = parse_T()
    while next_token() == '+':
        match('+')
        t_val = parse_T()
        val = val + t_val
    return val

def parse_T():
    val = parse_F()
    while next_token() == '*':
        match('*')
        f_val = parse_F()
        val = val * f_val
    return val

def parse_F():
    if next_token() == '(':
        match('(')
        val = parse_E()
        match(')')
        return val
    elif next_token().isdigit():
        val = int(next_token())
        match(next_token())
        return val
    else:
        error()
```

### 6.3 后序SDT
对于S-属性文法，将语义动作放在产生式的最后。

**形式**：
```
A → X1 X2 ... Xn { 动作 }
```

**优点**：
- 容易实现
- 可以在自下而上分析时执行

### 6.4 带继承属性的SDT
对于L-属性文法，需要将语义动作放在适当的位置。

**示例**：
```
产生式：D → T { L.in = T.type } L
产生式：L → { L1.in = L.in } L1 , id { addtype(id.entry, L.in) }
产生式：L → id { addtype(id.entry, L.in) }
```

**注意**：
- 继承属性的计算必须在使用之前
- 动作的位置很重要

## 七、中间代码生成
### 7.1 三地址码
三地址码（Three-Address Code, TAC）是一种中间表示形式。

**形式**：
```
x = y op z
```

**示例**：
```
a = b + c
d = a * e
```

### 7.2 三地址码的更多形式
除了基本形式外，三地址码还有：
1. **复制语句**：x = y
2. **一元运算**：x = op y
3. **无条件跳转**：goto L
4. **条件跳转**：if x goto L, ifFalse x goto L
5. **条件跳转**：if x relop y goto L
6. **参数传递**：param x
7. **过程调用**：call p, n, y = call p, n
8. **返回**：return y
9. **索引赋值**：x = y[i], x[i] = y
10. **地址和指针**：x = &y, x = *y, *x = y

### 7.3 用SDD生成三地址码
**SDD**：
```
产生式          语义规则
S → E           S.code = E.code
E → E1 + T      E.code = E1.code || T.code ||
                      newtemp() '=' E1.place '+' T.place
                E.place = newtemp()
E → T           E.code = T.code
                E.place = T.place
T → T1 * F      T.code = T1.code || F.code ||
                      newtemp() '=' T1.place '*' F.place
                T.place = newtemp()
T → F           T.code = F.code
                T.place = F.place
F → ( E )       F.code = E.code
                F.place = E.place
F → id          F.code = ""
                F.place = id.name
```

### 7.4 三地址码生成的详细示例
**输入**：`a = b * c + d`

**分析树和属性计算**：
```
        S
        |
        E
       /|\
      E  +  T
      |     |
      T     F
     /|\    |
    T  *  F id (d)
    |     |
    F     id (c)
    |
  id (b)
```

**生成的三地址码**：
```
t1 = b * c
t2 = t1 + d
a = t2
```

**SDD计算过程**：
```
处理F→id (b):
  F.code = ""
  F.place = "b"

处理T→F:
  T.code = ""
  T.place = "b"

处理F→id (c):
  F.code = ""
  F.place = "c"

处理T→T1 * F:
  T1.code = ""
  F.code = ""
  newtemp() = "t1"
  T.code = "" || "" || "t1 = b * c"
  T.place = "t1"

处理E→T:
  E.code = "t1 = b * c"
  E.place = "t1"

处理F→id (d):
  F.code = ""
  F.place = "d"

处理T→F:
  T.code = ""
  T.place = "d"

处理E→E1 + T:
  E1.code = "t1 = b * c"
  T.code = ""
  newtemp() = "t2"
  E.code = "t1 = b * c" || "" || "t2 = t1 + d"
  E.place = "t2"

处理S→E:
  S.code = "t1 = b * c\nt2 = t1 + d"
  加上赋值：a = t2

最终三地址码：
t1 = b * c
t2 = t1 + d
a = t2
```

### 7.5 布尔表达式的三地址码生成
**布尔表达式**：`a < b and c < d`

**生成的三地址码**：
```
if a < b goto L1
goto Lfalse
L1:
if c < d goto Ltrue
goto Lfalse
Ltrue:
...
Lfalse:
...
```

**另一种方式（数值表示）**：
```
t1 = a < b
t2 = c < d
t3 = t1 and t2
```

## 八、总结
### 8.1 关键概念
- 语法制导定义（SDD）
- 语法制导翻译方案（SDT）
- 综合属性
- 继承属性
- S-属性文法
- L-属性文法
- 依赖图
- 三地址码

### 8.2 应用
- 表达式求值
- 类型检查
- 中间代码生成

---

## 章节：第5章 语义分析笔记

# 第5章 语义分析笔记

## 一、语义分析概述
### 1.1 语义分析的任务
语义分析的主要任务包括：
1. **类型检查**：验证操作符和操作数的类型是否兼容
2. **标识符检查**：验证标识符是否已声明且使用正确
3. **流程控制检查**：验证控制流是否正确（如break/continue必须在循环内）
4. **唯一性检查**：验证标识符在同一作用域中是否唯一
5. **表达式求值**：计算常量表达式的值

### 1.2 语义分析的位置
```
源程序 → 词法分析 → 语法分析 → 语义分析 → 中间代码生成
           记号流      语法树        带标注的语法树
```

## 二、符号表
### 2.1 符号表的作用
符号表（Symbol Table）用于存储标识符的信息：
- 标识符名称
- 类型
- 存储类别（static、auto、register等）
- 作用域
- 存储地址
- 其他属性

### 2.2 符号表的操作
1. **插入（Insert）**：将新标识符插入符号表
2. **查找（Lookup）**：查找标识符的信息
3. **删除（Delete）**：删除标识符（离开作用域时）

### 2.3 符号表的实现
#### 2.3.1 线性表
- 简单，但查找效率低
- 时间复杂度：O(n)

#### 2.3.2 哈希表
- 查找效率高
- 时间复杂度：O(1)平均

#### 2.3.3 二叉搜索树
- 支持有序遍历
- 时间复杂度：O(log n)

### 2.4 作用域处理
#### 2.4.1 静态作用域
大多数语言使用静态作用域。

**实现方法**：
- 栈式符号表
- 进入作用域时压入新符号表
- 离开作用域时弹出

**示例**：
```c
{
    int x;          // 作用域1
    {
        int y;      // 作用域2
        {
            int z;  // 作用域3
        }
    }
}
```

符号表栈变化：
```
进入作用域1: [表1]
进入作用域2: [表1, 表2]
进入作用域3: [表1, 表2, 表3]
离开作用域3: [表1, 表2]
离开作用域2: [表1]
离开作用域1: []
```

## 三、类型检查
### 3.1 类型系统
类型系统（Type System）是一组规则，用于给程序的各个部分指派类型。

### 3.2 类型表达式
类型表达式（Type Expression）用于描述类型。

**示例**：
```
基本类型：integer, real, boolean, char
数组类型：array(1..10, integer)
记录类型：record((a: integer), (b: real))
函数类型：integer → real
指针类型：pointer(integer)
```

### 3.3 类型等价
#### 3.3.1 名字等价
两个类型等价当且仅当它们有相同的名字。

**示例**：
```c
typedef int Age;
typedef int Weight;

Age x;
Weight y;
// x和y类型不等价（名字等价）
```

#### 3.3.2 结构等价
两个类型等价当且仅当它们的结构相同。

**示例**：
```c
typedef int Age;
typedef int Weight;

Age x;
Weight y;
// x和y类型等价（结构等价）
```

### 3.4 类型转换
#### 3.4.1 隐式转换（强制）
编译器自动进行的类型转换。

**C语言类型提升规则**：
```
char, short → int → unsigned → long → unsigned long → float → double → long double
```

**算术转换规则**：
```
1. 如果任一操作数是long double，另一个转换为long double
2. 否则，如果任一操作数是double，另一个转换为double
3. 否则，如果任一操作数是float，另一个转换为float
4. 否则，进行整数提升：char, short → int
5. 否则，如果一个是unsigned int，另一个是int，都转换为unsigned int
6. 否则，如果一个是long，另一个是unsigned int：
   - 如果long能表示所有unsigned int的值，都转换为long
   - 否则，都转换为unsigned long
7. 否则，如果一个是long，另一个转换为long
8. 否则，如果一个是unsigned long，另一个转换为unsigned long
```

**示例**：
```c
char c = 'a';
short s = 10;
int i = 100;
float f = 3.14;
double d = 2.718;

int result1 = c + s;  // char和short都提升为int
double result2 = i + d; // int转换为double
float result3 = f + i;  // int转换为float
```

#### 3.4.2 显式转换（强制类型转换）
程序员显式指定的类型转换。

**C语言的强制类型转换**：
```c
(type) expression
```

**示例**：
```c
double d = 3.14159;
int i = (int)d;  // double显式转换为int，结果为3

int x = 65;
char c = (char)x;  // c = 'A'

float f = 10.5;
int y = (int)f;  // y = 10（截断小数部分）
```

**指针类型转换**：
```c
int *p = (int *)malloc(4);  // void* 转换为 int*
void *q = p;  // int* 转换为 void*（隐式）
```

#### 3.4.3 类型转换的SDD实现
**SDD示例**：
```
产生式          语义规则
E → E1 + E2    E.type = max(E1.type, E2.type)
                生成类型转换代码
E → E1 * E2    类似+的规则
E → ( E1 )     E.type = E1.type
E → id         E.type = lookup(id).type
E → int        E.type = integer
E → real       E.type = real
```

**类型转换操作**：
```
widen(a, t)  // 将a从当前类型转换为类型t
```

### 3.5 类型检查规则
#### 3.5.1 表达式的类型检查
**加法和乘法**：
```
E → E1 + E2
  if E1.type = integer and E2.type = integer
    then E.type = integer
    E.code = E1.code || E2.code ||
              newtemp() '=' E1.place '+' E2.place
    E.place = newtemp()
  else if E1.type = real and E2.type = real
    then E.type = real
    E.code = E1.code || E2.code ||
              newtemp() '=' E1.place '+' E2.place
    E.place = newtemp()
  else if E1.type = integer and E2.type = real
    then E.type = real
    t1 = newtemp()
    E.code = E1.code || E2.code ||
              t1 '=' (real) E1.place ||
              newtemp() '=' t1 '+' E2.place
    E.place = newtemp()
  else if E1.type = real and E2.type = integer
    then E.type = real
    t1 = newtemp()
    E.code = E1.code || E2.code ||
              t1 '=' (real) E2.place ||
              newtemp() '=' E1.place '+' t1
    E.place = newtemp()
  else type_error

E → E1 * E2
  // 类似+的规则
```

**关系运算符**：
```
E → E1 < E2
  if E1.type = integer and E2.type = integer
    then E.type = boolean
    E.code = E1.code || E2.code ||
              newtemp() '=' E1.place '<' E2.place
    E.place = newtemp()
  else if E1.type = real and E2.type = real
    then E.type = boolean
    // 类似处理
  else if (E1.type = integer and E2.type = real) or
          (E1.type = real and E2.type = integer)
    then E.type = boolean
    // 类似处理
  else type_error

E → E1 == E2
  // 类似<的规则
```

**逻辑运算符**：
```
E → E1 and E2
  if E1.type = boolean and E2.type = boolean
    then E.type = boolean
    // 生成代码
  else type_error

E → E1 or E2
  // 类似and的规则

E → not E1
  if E1.type = boolean
    then E.type = boolean
    // 生成代码
  else type_error
```

**赋值表达式**：
```
E → id = E1
  if lookup(id).type = E1.type
    then E.type = lookup(id).type
    E.code = E1.code || id.name '=' E1.place
    E.place = id.name
  else if lookup(id).type = real and E1.type = integer
    then E.type = real
    t1 = newtemp()
    E.code = E1.code || t1 '=' (real) E1.place ||
              id.name '=' t1
    E.place = id.name
  else type_error
```

#### 3.5.2 语句的类型检查
**赋值语句**：
```
S → id = E ;
  if lookup(id).type = E.type
    then S.type = void
    S.code = E.code || id.name '=' E.place
  else if lookup(id).type = real and E.type = integer
    then S.type = void
    t1 = newtemp()
    S.code = E.code || t1 '=' (real) E.place ||
              id.name '=' t1
  else type_error
```

**复合语句**：
```
S → { S1 S2 ... Sn }
  if S1.type = void and S2.type = void and ... and Sn.type = void
    then S.type = void
    S.code = S1.code || S2.code || ... || Sn.code
  else type_error
```

**if语句**：
```
S → if ( E ) S1
  if E.type = boolean and S1.type = void
    then S.type = void
    newlabel(L1)
    newlabel(L2)
    S.code = E.code ||
              'if' E.place 'goto' L1 ||
              'goto' L2 ||
              L1 ':' || S1.code ||
              L2 ':'
  else type_error

S → if ( E ) S1 else S2
  if E.type = boolean and S1.type = void and S2.type = void
    then S.type = void
    newlabel(L1)
    newlabel(L2)
    newlabel(L3)
    S.code = E.code ||
              'if' E.place 'goto' L1 ||
              'goto' L2 ||
              L1 ':' || S1.code ||
              'goto' L3 ||
              L2 ':' || S2.code ||
              L3 ':'
  else type_error
```

**while循环**：
```
S → while ( E ) S1
  if E.type = boolean and S1.type = void
    then S.type = void
    newlabel(L1)
    newlabel(L2)
    newlabel(L3)
    S.code = L1 ':' ||
              E.code ||
              'if' E.place 'goto' L2 ||
              'goto' L3 ||
              L2 ':' || S1.code ||
              'goto' L1 ||
              L3 ':'
  else type_error
```

**for循环**：
```
S → for ( E1 ; E2 ; E3 ) S1
  if E1.type = void and E2.type = boolean and
     E3.type = void and S1.type = void
    then S.type = void
    newlabel(L1)
    newlabel(L2)
    newlabel(L3)
    newlabel(L4)
    S.code = E1.code ||
              L1 ':' ||
              E2.code ||
              'if' E2.place 'goto' L2 ||
              'goto' L4 ||
              L2 ':' || S1.code ||
              E3.code ||
              'goto' L1 ||
              L4 ':'
  else type_error
```

### 3.6 类型检查的完整示例
**源程序**：
```c
int main() {
    int a = 5;
    double b = 3.14;
    double c = a + b;
    if (c > 10) {
        c = c * 2;
    }
    return 0;
}
```

**类型检查过程**：
```
1. int a = 5;
   - a的类型：integer
   - 5的类型：integer
   - 类型匹配 ✓

2. double b = 3.14;
   - b的类型：real
   - 3.14的类型：real
   - 类型匹配 ✓

3. double c = a + b;
   - a的类型：integer
   - b的类型：real
   - a转换为real
   - a + b的类型：real
   - c的类型：real
   - 类型匹配 ✓

4. if (c > 10) {
   - c的类型：real
   - 10的类型：integer
   - 10转换为real
   - c > 10的类型：boolean
   - 类型匹配 ✓

5. c = c * 2;
   - c的类型：real
   - 2的类型：integer
   - 2转换为real
   - c * 2的类型：real
   - 类型匹配 ✓

6. return 0;
   - 0的类型：integer
   - main返回类型：integer
   - 类型匹配 ✓
```

## 四、控制流检查
### 4.1 break和continue
**规则**：
- break必须出现在循环或switch语句内
- continue必须出现在循环内

**示例**：
```c
for (int i = 0; i < 10; i++) {
    if (i == 5) {
        break;  // 正确，在循环内
    }
}

if (x > 0) {
    break;  // 错误，不在循环或switch内
}
```

### 4.2 return语句
**规则**：
- return语句返回值的类型必须与函数声明的返回类型兼容

**示例**：
```c
int add(int a, int b) {
    return a + b;  // 正确，int类型
}

double divide(int a, int b) {
    return a;  // 正确，int可转换为double
}

int error() {
    return "hello";  // 错误，类型不兼容
}
```

## 五、唯一性检查
### 5.1 标识符声明
**规则**：
- 同一作用域中，标识符只能声明一次

**示例**：
```c
{
    int x;
    int x;  // 错误，重复声明
}

{
    int x;
    {
        int x;  // 正确，不同作用域
    }
}
```

### 5.2 case标号
**规则**：
- switch语句中的case标号必须唯一

**示例**：
```c
switch (x) {
    case 1: ...
    case 1: ...  // 错误，重复的case
}
```

## 六、常量表达式求值
### 6.1 编译时常量求值
在编译时计算常量表达式的值。

**示例**：
```c
#define PI 3.14159
#define TWO_PI (2 * PI)  // 编译时计算为6.28318

int array[10 * 2];  // 编译时计算为20
```

### 6.2 求值规则
```
E → E1 + E2
  if E1.value 已知 and E2.value 已知
    then E.value = E1.value + E2.value

E → E1 * E2
  if E1.value 已知 and E2.value 已知
    then E.value = E1.value * E2.value

E → ( E1 )
  if E1.value 已知
    then E.value = E1.value

E → num
  E.value = num.value
```

## 七、语义分析器的实现
### 7.1 基于属性文法的实现
使用语法制导定义实现语义分析。

### 7.2 递归下降语义分析
在递归下降分析器中加入语义动作。

**示例**：
```c
void E() {
    T();
    while (token == PLUS) {
        match(PLUS);
        T();
        // 语义动作：生成加法代码
    }
}
```

### 7.3 错误恢复
语义错误的恢复策略：
1. **恐慌模式**：跳过符号直到找到同步符号
2. **短语级恢复**：局部修改
3. **错误产生式**：预测常见错误

## 八、总结
### 8.1 主要任务
- 符号表管理
- 类型检查
- 控制流检查
- 唯一性检查
- 常量表达式求值

### 8.2 关键概念
- 符号表
- 类型系统
- 类型表达式
- 类型等价
- 类型转换

---

## 章节：第6章 代码生成笔记

# 第6章 代码生成笔记

## 一、代码生成概述
### 1.1 代码生成的位置
```
中间表示 → 代码生成器 → 目标程序
        ↓
      目标代码
（汇编或机器码）
```

### 1.2 代码生成的任务
代码生成器的主要任务：
1. **指令选择**：选择合适的目标机器指令
2. **寄存器分配**：分配寄存器给变量和临时值
3. **指令调度**：安排指令的执行顺序
4. **代码优化**：进行简单的代码优化

### 1.3 目标语言
常见的目标语言：
1. **绝对机器语言**：可直接执行
2. **可重定位机器语言**：需要链接
3. **汇编语言**：需要汇编器

## 二、目标机器模型
### 2.1 简单的目标机器
假设一个简单的寄存器机器：
- 通用寄存器：R0, R1, ..., Rn-1
- 指令格式：
  - op src, dst
  - load addr, R
  - store R, addr

### 2.2 指令示例
```
load a, R0    // 将a的值加载到R0
add R0, R1   // R1 = R1 + R0
store R1, b    // 将R1的值存储到b
```

## 三、基本块和流图
### 3.1 基本块
基本块（Basic Block）是一个连续的语句序列，只有一个入口和一个出口。

**特点**：
- 只能从第一条语句进入
- 只能从最后一条语句离开
- 中间没有跳转

### 3.2 划分基本块的算法
```
1. 确定入口语句：
   - 第一个语句
   - 条件跳转或无条件跳转的目标语句
   - 紧跟在条件跳转后面的语句

2. 从每个入口语句开始，直到遇到跳转语句或下一个入口语句之前，构成一个基本块

### 3.3 流图
流图（Flow Graph）表示基本块之间的控制流。

**节点**：基本块
**边**：从块A到块B有边，如果B可能在A之后执行

## 四、简单的代码生成器
### 4.1 一个简单的代码生成策略
对于三地址码到目标代码的简单翻译：

**三地址码**：
```
x = y + z
```

**目标代码**：
```
load y, R0
add z, R0
store R0, x
```

### 4.2 寄存器描述符
寄存器描述符（Register Descriptor）记录每个寄存器的内容。

**数据结构**：
```
register_desc[R] = {变量1, 变量2, ...}
```

### 4.3 地址描述符
地址描述符（Address Descriptor）记录每个变量的存储位置。

**数据结构**：
```
address_desc[x] = {位置1, 位置2, ...}
```

### 4.4 代码生成算法
```
函数 getreg(I):
    返回一个寄存器用于执行指令I

函数 gen_code(x = y op z):
    R = getreg(x = y op z)
    if y不在寄存器中:
        生成 load y, R
    if z不在寄存器中:
        生成 op z, R
    else:
        生成 op Rz, R  // Rz是z的寄存器
    更新寄存器和地址描述符
```

## 五、寄存器分配
### 5.1 寄存器分配的重要性
寄存器分配的好坏对代码质量影响很大：
- 寄存器访问比内存快得多
- 好的寄存器分配可以减少内存访问

### 5.2 简单的寄存器分配策略
#### 5.2.1 就近分配
最近使用的变量优先分配寄存器。

#### 5.2.2 活跃变量分析
活跃变量（Live Variable）：在某点之后还会被使用的变量。

**活跃变量分析**：
- 找出每个变量的活跃区间
- 在活跃区间内分配寄存器

### 5.3 图着色寄存器分配
这是一种更高级的寄存器分配方法：
1. 构建冲突图
2. 用图着色算法分配寄存器

## 六、指令选择
### 6.1 指令选择的原则
1. **正确性**：生成的代码必须正确
2. **效率**：生成的代码应该高效
3. **代码质量**：生成的代码应该高质量

### 6.2 模式匹配
用模式匹配选择指令：

**模式**：
```
模式：x = y + z
指令：add y, z, x

模式：x = x + 1
指令：inc x
```

## 七、窥孔优化
### 7.1 窥孔优化的概念
窥孔优化（Peephole Optimization）是一种简单的代码优化方法，通过一个小窗口（窥孔）查看代码，尝试优化。

### 7.2 常见的窥孔优化
#### 7.2.1 冗余指令删除
```
before:
    load a, R0
    store R0, a

after:
    （删除）
```

#### 7.2.2 控制流优化
```
before:
    goto L1
L1: goto L2

after:
    goto L2
```

#### 7.2.3 代数化简
```
before:
    add x, 0, x

after:
    （删除）
```

#### 7.2.4 强度削弱
```
before:
    mul x, 2, x

after:
    add x, x, x
```

## 八、示例：完整的代码生成
### 8.1 源程序
```c
int fact(int n) {
    if (n <= 1)
        return 1;
    else
        return n * fact(n - 1);
}
```

### 8.2 三地址码
```
fact:
    if n <= 1 goto L1
    goto L2
L1:
    return 1
L2:
    t1 = n - 1
    t2 = fact(t1)
    t3 = n * t2
    return t3
```

### 8.3 目标代码（汇编）
```asm
fact:
    cmp n, 1
    jle L1
    jmp L2
L1:
    mov eax, 1
    ret
L2:
    mov eax, n
    sub eax, 1
    push eax
    call fact
    add esp, 4
    imul eax, n
    ret
```

## 九、总结
### 9.1 代码生成的任务
- 指令选择
- 寄存器分配
- 指令调度

### 9.2 关键概念
- 基本块
- 流图
- 寄存器描述符
- 地址描述符
- 窥孔优化

### 9.3 目标
生成正确、高效的目标代码

---

## 章节：第6章 属性文法和语法制导翻译笔记

# 第6章 属性文法和语法制导翻译笔记

## 一、属性文法
### 1.1 属性的概念
- **属性**：代表与文法符号相关的信息
- **属性的分类**：
  1. **综合属性（Synthesized Attribute）**：
     - 自底向上传递信息
     - 通过子结点的属性计算父结点的属性
  2. **继承属性（Inherited Attribute）**：
     - 自顶向下传递信息
     - 通过父结点或兄弟结点的属性计算子结点的属性

### 1.2 属性文法的定义
- **属性文法**：在上下文无关文法的基础上，为每个文法符号配备若干属性，并为每个产生式配备若干语义规则
- **形式**：A→α，{语义规则}

### 1.3 语义规则
- **语义规则的作用**：计算属性的值
- **语义规则的形式**：
  - 对于综合属性：A.a = f(X₁.x₁, X₂.x₂, ..., Xₙ.xₙ)
  - 对于继承属性：Xᵢ.x = f(A.a, X₁.x₁, ..., Xᵢ₋₁.xᵢ₋₁, Xᵢ₊₁.xᵢ₊₁, ..., Xₙ.xₙ)

### 1.4 S-属性文法
- **S-属性文法**：只含有综合属性的属性文法
- **特点**：
  - 可以在自底向上分析中计算属性
  - 适合LR分析器

### 1.5 L-属性文法
- **L-属性文法**：
  - 每个属性要么是综合属性
  - 要么是继承属性，且对于产生式A→X₁X₂...Xₙ，Xᵢ的继承属性仅依赖于：
    - A的继承属性
    - X₁, X₂, ..., Xᵢ₋₁的属性
- **特点**：
  - 可以在自顶向下分析中计算属性
  - 适合LL分析器或递归下降分析器

### 1.6 示例：简单算术表达式的属性文法
- **文法**：
  E→E₁+T    { E.val = E₁.val + T.val }
  E→T        { E.val = T.val }
  T→T₁*F    { T.val = T₁.val * F.val }
  T→F        { T.val = F.val }
  F→(E)      { F.val = E.val }
  F→digit    { F.val = digit.lexval }
- **说明**：val是综合属性，lexval是词法分析器提供的属性

## 二、语法制导翻译
### 2.1 语法制导翻译的基本思想
- **语法制导翻译**：在语法分析的同时，根据语义规则计算属性值，完成翻译工作
- **特点**：
  - 语法分析和语义分析同时进行
  - 以语法分析为主导
  - 语义规则依附于产生式

### 2.2 语法制导翻译的实现方法
1. **语法树遍历**：
   - 首先构造语法树
   - 然后遍历语法树计算属性
2. **分析过程中计算**：
   - 在语法分析的同时计算属性
   - 不需要显式构造语法树

### 2.3 带语义动作的翻译方案
- **翻译方案**：将语义动作嵌入到产生式右部的适当位置
- **形式**：A→α{动作}β
- **示例**：
  E→E₁+T    { print('+') }
  E→T
  T→T₁*F    { print('*') }
  T→F
  F→(E)
  F→digit    { print(digit.lexval) }

### 2.4 翻译方案的设计原则
1. **对于S-属性文法**：语义动作放在产生式末尾
2. **对于L-属性文法**：
   - 语义动作可以放在产生式右部的任何位置
   - 但动作中引用的属性必须已经计算出来

## 三、依赖图
### 3.1 依赖图的概念
- **依赖图**：表示属性之间依赖关系的有向图
- **结点**：每个属性一个结点
- **边**：若属性b依赖于属性a，则有一条从a到b的边

### 3.2 依赖图的构造
1. **对每个语法树结点**：
   - 为该结点的每个属性建立一个结点
2. **对每个产生式的每个语义规则**：
   - 若语义规则计算A.a = f(...)，则对每个依赖的属性X.x，建立一条从X.x到A.a的边

### 3.3 拓扑排序
- **拓扑排序**：依赖图的一个线性序列，满足若有边从a到b，则a在序列中出现在b之前
- **作用**：确定属性计算的顺序

## 四、综合属性的计算
### 4.1 在自底向上分析中计算综合属性
- **方法**：
  - 在分析栈中存放状态和综合属性值
  - 归约时，根据语义规则计算新的综合属性值
- **栈结构**：[状态₀, val₀][状态₁, val₁]...[状态ₙ, valₙ]

### 4.2 示例
- **产生式**：E→E₁+T
- **语义规则**：E.val = E₁.val + T.val
- **归约时**：
  - 弹出E₁、+、T
  - 计算E.val = E₁.val + T.val
  - 压入E和E.val

## 五、继承属性的计算
### 5.1 在自顶向下分析中计算继承属性
- **方法**：
  - 在递归下降分析中，通过参数传递继承属性
  - 综合属性作为返回值
- **示例**：
  ```c
  int E() {
      int t1 = T();
      while (lookahead == '+') {
          match('+');
          int t2 = T();
          t1 = t1 + t2;
      }
      return t1;
  }
  ```

### 5.2 模拟继承属性的计算
- **方法**：
  - 使用标记非终结符
  - 将继承属性转换为综合属性
- **标记非终结符**：
  - 产生式形式：M→ε
  - 用于插入语义动作

## 六、中间代码生成
### 6.1 常见的中间代码形式
1. **后缀式（逆波兰式）**
   - 操作符在操作数后面
   - 示例：a+b → ab+

2. **三地址代码**
   - 每条指令最多有三个操作数
   - 形式：x = y op z
   - 示例：t1 = a + b

3. **语法树**
   - 表示语法结构的树

4. **DAG（有向无环图）**
   - 语法树的优化形式，公共子表达式共享

### 6.2 三地址代码的类型
1. **赋值语句**：x = y op z
2. **复制语句**：x = y
3. **跳转语句**：goto L
4. **条件跳转**：if x relop y goto L
5. **参数传递**：param x
6. **函数调用**：call P, n
7. **返回语句**：return x

### 6.3 三地址代码的生成示例
- **产生式**：E→E₁+E₂
- **语义动作**：
  E.place = newtemp();
  emit(E.place '=' E₁.place '+' E₂.place);
- **说明**：
  - place是综合属性，存放临时变量名
  - newtemp()生成新的临时变量
  - emit()输出三地址代码

## 七、类型检查
### 7.1 类型检查的任务
- **检查表达式的类型是否正确**
- **检查运算符的操作数类型是否匹配**
- **检查函数调用的参数类型是否匹配**

### 7.2 类型表达式
- **基本类型**：integer, real, boolean, char
- **类型构造符**：
  - 数组：array(I, T)
  - 记录：record((id₁, T₁), (id₂, T₂), ...)
  - 函数：T₁ → T₂

### 7.3 类型转换
- **隐式类型转换（强制类型转换）**：
  - 编译器自动进行的类型转换
  - 示例：integer → real
- **显式类型转换**：
  - 程序员显式指定的类型转换
  - 示例：(real) x

## 八、总结
属性文法和语法制导翻译是语义分析和中间代码生成的重要方法。属性分为综合属性和继承属性，S-属性文法和L-属性文法是两类重要的属性文法。语法制导翻译在语法分析的同时计算属性，完成翻译工作。三地址代码是常用的中间代码形式。

---

## 章节：第7章 中间表示笔记

# 第7章 中间表示笔记

## 一、中间表示概述
### 1.1 为什么需要中间表示
使用中间表示（Intermediate Representation, IR）的原因：
1. **机器无关性**：便于移植到不同的目标机器
2. **优化便利**：便于进行与机器无关的代码优化
3. **模块化**：将编译器分为前端和后端，便于开发和维护
4. **多目标**：一个前端可以对接多个后端

### 1.2 编译器的结构
```
源程序 → 前端 → 中间表示 → 优化器 → 中间表示 → 后端 → 目标程序
```

## 二、中间表示的种类
### 2.1 高级中间表示
接近源语言，如抽象语法树（AST）。

**优点**：
- 容易生成
- 便于进行高级优化

**缺点**：
- 离目标机器远

### 2.2 低级中间表示
接近目标机器，如汇编语言。

**优点**：
- 离目标机器近
- 便于进行机器相关优化

**缺点**：
- 与机器相关
- 不便移植

### 2.3 三地址码
三地址码（Three-Address Code, TAC）是最常用的中间表示。

## 三、三地址码
### 3.1 三地址码的形式
**基本形式**：
```
x = y op z
```
其中：
- x：目标地址
- y、z：源地址
- op：运算符

### 3.2 三地址码的类型
#### 3.2.1 赋值语句
```
x = y op z        // 二元运算
x = op y          // 一元运算
x = y             // 复制
```

#### 3.2.2 跳转语句
```
goto L            // 无条件跳转
if x goto L       // 条件跳转（x为真）
if x relop y goto L  // 条件跳转
```

#### 3.2.3 过程调用
```
param x1          // 传递参数
param x2
...
call p, n         // 调用过程p，n个参数
y = call p, n     // 有返回值
return y          // 返回
```

#### 3.2.4 索引和地址
```
x = y[i]          // 索引赋值
x[i] = y          // 索引赋值
x = &y            // 取地址
x = *y            // 间接访问
*x = y            // 间接赋值
```

### 3.3 三地址码示例
**源程序1**：
```c
while (a < b) {
    if (c < d) {
        x = x + 1;
    }
    y = y * 2;
}
```

**三地址码1**：
```
L1: if a < b goto L2
    goto L3
L2: if c < d goto L4
    goto L5
L4: t1 = x + 1
    x = t1
L5: t2 = y * 2
    y = t2
    goto L1
L3:
```

**源程序2（更复杂的示例）**：
```c
int factorial(int n) {
    if (n <= 1) {
        return 1;
    } else {
        return n * factorial(n - 1);
    }
}
```

**三地址码2**：
```
factorial:
    param n
    if n <= 1 goto L1
    goto L2
L1: return 1
L2: t1 = n - 1
    param t1
    t2 = call factorial, 1
    t3 = n * t2
    return t3
```

**源程序3（数组操作）**：
```c
int sum(int a[], int n) {
    int s = 0;
    for (int i = 0; i < n; i++) {
        s = s + a[i];
    }
    return s;
}
```

**三地址码3**：
```
sum:
    param a
    param n
    s = 0
    i = 0
L1: if i < n goto L2
    goto L3
L2: t1 = i * 4
    t2 = a[t1]
    t3 = s + t2
    s = t3
    t4 = i + 1
    i = t4
    goto L1
L3: return s
```

### 3.4 三地址码的更多类型和细节
#### 3.4.1 数组操作
```
x = a[i]       // 从数组取元素
a[i] = x       // 给数组赋值
x = &a[i]      // 取数组元素的地址
x = a + i      // 数组基址加偏移
```

**数组访问的实现**：
假设数组a的基址是base，每个元素占4字节：
```
t1 = i * 4        // 计算偏移量
t2 = base + t1    // 计算元素地址
x = *t2           // 取值
```

#### 3.4.2 结构体操作
```
x = p->field     // 通过指针访问结构体成员
x = s.field      // 直接访问结构体成员
p->field = x     // 赋值
```

**结构体访问的实现**：
假设结构体S有两个成员：a（偏移0），b（偏移8）：
```
t1 = p + 8       // 计算成员b的地址
x = *t1          // 取值
```

#### 3.4.3 指针操作
```
x = &y           // 取地址
x = *y           // 间接访问
*x = y           // 间接赋值
x = y + 1        // 指针算术
```

**指针算术示例**：
```
int *p;
p = p + 1;       // 实际地址增加4（int大小）
```

## 四、四元式
### 4.1 四元式的结构
四元式（Quadruple）是三地址码的一种表示形式，包含四个字段：
- op：运算符
- arg1：第一个参数
- arg2：第二个参数
- result：结果

### 4.2 四元式示例
**三地址码**：
```
t1 = b * c
t2 = a + t1
t3 = t2 - d
x = t3
```

**四元式**：
```
(*, b, c, t1)
(+, a, t1, t2)
(-, t2, d, t3)
(=, t3, _, x)
```

### 4.3 四元式的完整示例
**源程序**：
```c
if (a < b) {
    x = a + b;
} else {
    x = a - b;
}
```

**三地址码**：
```
if a < b goto L1
goto L2
L1: t1 = a + b
    x = t1
    goto L3
L2: t2 = a - b
    x = t2
L3:
```

**四元式**：
```
(<, a, b, _)
(jmp_true, _, _, L1)
(jmp, _, _, L2)
(+, a, b, t1)
(=, t1, _, x)
(jmp, _, _, L3)
(-, a, b, t2)
(=, t2, _, x)
(label, _, _, L3)
```

### 4.4 四元式的数组表示
**数组表示**：
```
index | op        | arg1 | arg2 | result
------|-----------|------|------|-------
  0   | <         | a    | b    | 
  1   | jmp_true  |      |      | L1
  2   | jmp       |      |      | L2
  3   | +         | a    | b    | t1
  4   | =         | t1   |      | x
  5   | jmp       |      |      | L3
  6   | -         | a    | b    | t2
  7   | =         | t2   |      | x
  8   | label     |      |      | L3
```

## 五、三元式
### 5.1 三元式的结构
三元式（Triple）包含三个字段：
- op：运算符
- arg1：第一个参数
- arg2：第二个参数

**特点**：
- 用三元式的位置表示结果
- 节省空间
- 不需要临时变量名

### 5.2 三元式示例
**三地址码**：
```
t1 = b * c
t2 = a + t1
t3 = t2 - d
x = t3
```

**三元式**：
```
(0) (*, b, c)
(1) (+, a, (0))
(2) (-, (1), d)
(3) (=, (2), x)
```

### 5.3 三元式的完整示例
**源程序**：
```c
x = a * b + c * d;
```

**三地址码**：
```
t1 = a * b
t2 = c * d
t3 = t1 + t2
x = t3
```

**三元式**：
```
(0) (*, a, b)
(1) (*, c, d)
(2) (+, (0), (1))
(3) (=, (2), x)
```

### 5.4 三元式的优点和缺点
**优点**：
- 不需要临时变量名
- 节省空间
- 直接表示计算

**缺点**：
- 优化困难（移动三元式时需要修改所有引用它的地方）
- 难以进行代码重排序
- 表达式的值依赖于计算顺序

## 六、间接三元式
### 6.1 间接三元式的结构
间接三元式（Indirect Triple）使用两个数组：
1. 指针数组（Statement List）：保存三元式的索引
2. 三元式数组：保存实际的三元式

**优点**：
- 便于优化（可以重新排列指针数组而不改变三元式）
- 支持公共子表达式消除
- 容易进行代码移动

### 6.2 间接三元式示例
**三地址码**：
```
t1 = a * b
t2 = a * b
t3 = t1 + t2
x = t3
```

**间接三元式**：
```
指针数组（语句列表）：
  [0, 0, 1, 2]

三元式数组：
  (0) (*, a, b)
  (1) (+, (0), (0))
  (2) (=, (1), x)
```

**注意**：公共子表达式 a*b 只计算一次，在三元式(0)中

### 6.3 间接三元式的优化示例
**优化前**：
```
指针数组：[0, 1, 2, 3, 4]
三元式：
  (0) (*, a, b)
  (1) (+, (0), c)
  (2) (*, a, b)
  (3) (+, (2), d)
  (4) (=, (1), (3), x)
```

**优化后（公共子表达式消除）**：
```
指针数组：[0, 1, 0, 2, 3]
三元式：
  (0) (*, a, b)
  (1) (+, (0), c)
  (2) (+, (0), d)
  (3) (=, (1), (2), x)
```

## 七、抽象语法树
### 7.1 抽象语法树的概念
抽象语法树（Abstract Syntax Tree, AST）是源程序的抽象语法结构的树表示。

**与语法树的区别**：
- AST不表示语法细节（如括号、分号等）
- AST更简洁
- AST关注语义结构

### 7.2 AST示例
**表达式1**：`a + b * c`

**AST1**：
```
    +
   / \
  a   *
     / \
    b   c
```

**表达式2**：`(a + b) * c`

**AST2**：
```
    *
   / \
  +   c
 / \
a   b
```

**表达式3**：`if (a < b) then x + y else x - y`

**AST3**：
```
      if
     / | \
   <   +   -
  / \ / \ / \
 a b x y x y
```

### 7.3 构造AST的SDD
```
产生式              语义规则
E → E1 + T          E.node = new BinOpNode('+', E1.node, T.node)
E → E1 - T          E.node = new BinOpNode('-', E1.node, T.node)
E → T               E.node = T.node
T → T1 * F          T.node = new BinOpNode('*', T1.node, F.node)
T → T1 / F          T.node = new BinOpNode('/', T1.node, F.node)
T → F               T.node = F.node
F → ( E )           F.node = E.node
F → id              F.node = new IdNode(id)
F → num             F.node = new NumNode(num)
```

### 7.4 AST到三地址码的转换
**算法**：后序遍历AST，生成三地址码

**示例**：
AST：
```
    +
   / \
  a   *
     / \
    b   c
```

**生成三地址码**：
```
t1 = b * c
t2 = a + t1
```

**转换的SDD**：
```
产生式              语义规则
E → E1 + T          E.place = newtemp()
                    E.code = E1.code || T.code ||
                              E.place '=' E1.place '+' T.place
E → T               E.place = T.place
                    E.code = T.code
T → T1 * F          T.place = newtemp()
                    T.code = T1.code || F.code ||
                              T.place '=' T1.place '*' F.place
T → F               T.place = F.place
                    T.code = F.code
F → id              F.place = id.name
                    F.code = ""
F → num             F.place = num.value
                    F.code = ""
```

## 八、DAG表示
### 8.1 DAG的概念
有向无环图（Directed Acyclic Graph, DAG）可以表示公共子表达式。

**特点**：
- 公共子表达式只表示一次
- 每个结点有唯一的标识符
- 可以检测和消除公共子表达式

### 8.2 DAG示例
**表达式**：`a + a * (b - c) + (b - c) * d`

**DAG**：
```
        +
       / \
      +   *
     / \ / \
    a   *   d
       / \
      a   -
         / \
        b   c
```

**注意**：
- b-c 只计算一次（公共子表达式）
- a 出现两次但表示同一个变量
- 节省计算量

### 8.3 DAG的构造算法
**算法描述**：
```
函数构造DAG(表达式):
    创建空的结点表
    对于表达式中的每个运算:
        在结点表中查找是否已存在该运算
        如果存在:
            返回该结点
        如果不存在:
            创建新结点
            将新结点加入结点表
            返回新结点
```

**详细构造步骤**：
```
表达式：a + a * (b - c) + (b - c) * d

步骤1：处理a
  - 创建结点a

步骤2：处理b - c
  - 创建结点b
  - 创建结点c
  - 创建结点-（子结点b, c）

步骤3：处理a * (b - c)
  - 查找a（已存在）
  - 查找b - c（已存在）
  - 创建结点*（子结点a, -）

步骤4：处理a + a * (b - c)
  - 查找a（已存在）
  - 查找a * (b - c)（已存在）
  - 创建结点+（子结点a, *）

步骤5：处理(b - c) * d
  - 查找b - c（已存在）
  - 创建结点d
  - 创建结点*（子结点-, d）

步骤6：处理整个表达式
  - 查找左边的+（已存在）
  - 查找右边的*（已存在）
  - 创建根结点+（子结点+, *）

最终得到DAG！
```

### 8.4 从DAG生成三地址码
**算法**：后序遍历DAG

**示例**：
DAG：
```
        +
       / \
      +   *
     / \ / \
    a   *   d
       / \
      a   -
         / \
        b   c
```

**生成的三地址码**：
```
t1 = b - c
t2 = a * t1
t3 = a + t2
t4 = t1 * d
t5 = t3 + t4
```

**注意**：公共子表达式 b-c 只计算一次

### 8.5 DAG的优化
**公共子表达式消除**：
```
表达式：a * b + c + a * b
DAG中：a * b 只出现一次
```

**常量折叠**：
```
表达式：3 * 5 + 2
DAG中：3 * 5 = 15，然后 15 + 2 = 17
可以直接计算为17
```

**死代码消除**：
```
如果某个运算的结果从未被使用，可以从DAG中删除
```

## 四、四元式
### 4.1 四元式的结构
四元式（Quadruple）是三地址码的一种表示形式，包含四个字段：
- op：运算符
- arg1：第一个参数
- arg2：第二个参数
- result：结果

### 4.2 四元式示例
**三地址码**：
```
t1 = b * c
t2 = a + t1
```

**四元式**：
```
(*, b, c, t1)
(+, a, t1, t2)
```

### 4.3 四元式的表示
**数组表示**：
```
index | op   | arg1 | arg2 | result
------|------|------|------|-------
  0   | *    | b    | c    | t1
  1   | +    | a    | t1   | t2
```

## 五、三元式
### 5.1 三元式的结构
三元式（Triple）包含三个字段：
- op：运算符
- arg1：第一个参数
- arg2：第二个参数

**特点**：
- 用三元式的位置表示结果
- 节省空间

### 5.2 三元式示例
**三地址码**：
```
t1 = b * c
t2 = a + t1
```

**三元式**：
```
(0) (*, b, c)
(1) (+, a, (0))
```

### 5.3 三元式的优点和缺点
**优点**：
- 不需要临时变量名
- 节省空间

**缺点**：
- 优化困难（移动三元式时需要修改引用）

## 六、间接三元式
### 6.1 间接三元式的结构
间接三元式（Indirect Triple）使用一个指针数组指向三元式。

**优点**：
- 便于优化（可以重新排列指针数组）

### 6.2 间接三元式示例
**三地址码**：
```
t1 = b * c
t2 = a + t1
```

**间接三元式**：
```
指针数组：
  [0, 1]

三元式：
  (0) (*, b, c)
  (1) (+, a, (0))
```

## 七、抽象语法树
### 7.1 抽象语法树的概念
抽象语法树（Abstract Syntax Tree, AST）是源程序的抽象语法结构的树表示。

**与语法树的区别**：
- AST不表示语法细节（如括号、分号等）
- AST更简洁

### 7.2 AST示例
**表达式**：`a + b * c`

**AST**：
```
    +
   / \
  a   *
     / \
    b   c
```

### 7.3 构造AST的SDD
```
产生式          语义规则
E → E1 + T      E.node = new Node('+', E1.node, T.node)
E → T           E.node = T.node
T → T1 * F      T.node = new Node('*', T1.node, F.node)
T → F           T.node = F.node
F → ( E )       F.node = E.node
F → id          F.node = new Leaf(id)
```

## 八、DAG表示
### 8.1 DAG的概念
有向无环图（Directed Acyclic Graph, DAG）可以表示公共子表达式。

### 8.2 DAG示例
**表达式**：`a + a * (b - c) + (b - c) * d`

**DAG**：
```
        +
       / \
      +   *
     / \ / \
    a   *   d
       / \
      a   -
         / \
        b   c
```

**特点**：
- b-c 只计算一次
- 节省计算

## 九、中间表示的选择
### 9.1 选择因素
选择中间表示时考虑：
1. **编译器的用途**：是否需要多目标
2. **优化的级别**：需要什么级别的优化
3. **实现的复杂度**：实现难度
4. **效率**：时间和空间效率

### 9.2 常见选择
- **GCC**：RTL（Register Transfer Language）
- **LLVM**：LLVM IR
- **Java**：字节码
- **.NET**：CIL（Common Intermediate Language）

## 十、总结
### 10.1 中间表示的种类
- 三地址码
- 四元式
- 三元式
- 间接三元式
- 抽象语法树（AST）
- DAG

### 10.2 三地址码的类型
- 赋值语句
- 跳转语句
- 过程调用
- 索引和地址

### 10.3 选择原则
根据编译器的需求选择合适的中间表示。

---

## 章节：第7章 语义分析和中间代码产生笔记

# 第7章 语义分析和中间代码产生笔记

## 一、语义分析概述
### 1.1 语义分析的任务
- **主要任务**：
  1. 审查源程序有无语义错误
  2. 收集类型信息
  3. 为代码生成阶段做准备
- **输入**：语法树
- **输出**：注释了语义信息的语法树或中间代码

### 1.2 语义错误的类型
1. **类型错误**：运算符与操作数类型不匹配
2. **作用域错误**：变量未声明或重复声明
3. **参数错误**：函数调用参数个数或类型不匹配
4. **控制流错误**：break或continue不在循环中

## 二、说明语句
### 2.1 变量说明
- **作用**：将变量名、类型、相对地址等信息填入符号表
- **属性**：
  - type：类型
  - offset：相对地址
  - width：占用的存储单元数

### 2.2 符号表
- **符号表的作用**：存储标识符的信息
- **符号表的内容**：
  - 标识符名
  - 类型
  - 存储类别
  - 作用域
  - 相对地址

### 2.3 过程说明
- **过程参数的传递方式**：
  1. **值调用（Call by Value）**：传递参数的值
  2. **引用调用（Call by Reference）**：传递参数的地址
  3. **换名调用（Call by Name）**：用实参替换形参

## 三、赋值语句
### 3.1 简单赋值语句
- **形式**：id = E
- **语义**：计算E的值，存入id的存储单元
- **三地址代码**：
  - 计算E的三地址代码
  - t = E的结果
  - id = t

### 3.2 类型转换
- **隐式类型转换**：
  - 例如：integer → real
  - 需要生成类型转换指令：t = (real) i
- **显式类型转换**：
  - 例如：(real) x
  - 也需要生成类型转换指令

## 四、布尔表达式
### 4.1 布尔表达式的作用
1. **计算逻辑值**：true或false
2. **控制流语句的条件**：if、while等

### 4.2 布尔表达式的翻译方法
1. **数值表示**：
   - true用1表示，false用0表示
   - 直接计算布尔表达式的值

2. **控制流翻译**：
   - 通过控制流转移表示布尔值
   - 适合条件语句
   - 使用两个标号：true出口和false出口

### 4.3 数值表示的翻译
- **文法**：
  E→E₁∨E₂
  E→E₁∧E₂
  E→¬E₁
  E→id₁ relop id₂
  E→true
  E→false
- **语义规则**：
  E→E₁∨E₂  { E.place = newtemp(); emit(E.place '=' E₁.place 'or' E₂.place); }
  E→id₁ relop id₂  { E.place = newtemp(); emit('if' id₁ relop id₂ 'goto' nextstat+3); emit(E.place '=' '0'); emit('goto' nextstat+2); emit(E.place '=' '1'); }

### 4.4 控制流翻译
- **为每个布尔表达式E设置两个标号**：
  - E.true：E为真时转向的标号
  - E.false：E为假时转向的标号
- **文法**：
  E→E₁∨E₂
  E→E₁∧E₂
  E→¬E₁
  E→id₁ relop id₂
  E→true
  E→false
- **语义规则**：
  E→E₁∨E₂  { E₁.true = E.true; E₁.false = newlabel(); E₂.true = E.true; E₂.false = E.false; E.code = E₁.code || label(E₁.false) || E₂.code; }
  E→id₁ relop id₂  { E.code = 'if' id₁ relop id₂ 'goto' E.true || 'goto' E.false; }

## 五、控制流语句
### 5.1 条件语句
- **形式**：if E then S₁ else S₂
- **翻译**：
  - 翻译E，E.true为S₁的第一条语句，E.false为S₂的第一条语句
  - 翻译S₁
  - 在S₁后加上goto S.next
  - 翻译S₂
  - S.next是整个语句的出口

- **三地址代码结构**：
  ```
  E的代码
  if E.true goto L1
  goto L2
  L1:
  S₁的代码
  goto Lnext
  L2:
  S₂的代码
  Lnext:
  ```

### 5.2 while语句
- **形式**：while E do S
- **翻译**：
  - 设置标号Lbegin为循环开始
  - 翻译E，E.true为S的第一条语句，E.false为S.next
  - 翻译S
  - 在S后加上goto Lbegin

- **三地址代码结构**：
  ```
  Lbegin:
  E的代码
  if E.true goto L1
  goto Lnext
  L1:
  S的代码
  goto Lbegin
  Lnext:
  ```

### 5.3 重复语句
- **形式**：repeat S until E
- **翻译**：
  - 设置标号Lbegin为循环开始
  - 翻译S
  - 翻译E，E.true为S.next，E.false为Lbegin

- **三地址代码结构**：
  ```
  Lbegin:
  S的代码
  E的代码
  if E.true goto Lnext
  goto Lbegin
  Lnext:
  ```

### 5.4 for语句
- **形式**：for id := E₁ to E₂ step E₃ do S
- **翻译**：
  - 计算E₁，赋给id
  - 计算E₂，存入temp₂
  - 计算E₃，存入temp₃
  - 设置循环开始标号
  - 检查id > temp₂（如果E₃>0）或id < temp₂（如果E₃<0），若是则跳出
  - 翻译S
  - id = id + temp₃
  - 跳回循环开始

## 六、过程调用
### 6.1 过程调用的形式
- **形式**：call id(E₁, E₂, ..., Eₙ)

### 6.2 过程调用的翻译
- **步骤**：
  1. 计算每个实参Eᵢ的值
  2. 生成param语句，传递参数
  3. 生成call语句，调用过程
- **三地址代码**：
  ```
  计算E₁的代码
  param t₁
  计算E₂的代码
  param t₂
  ...
  计算Eₙ的代码
  param tₙ
  call id, n
  ```

### 6.3 参数传递
1. **值传递**：
   - 传递参数的值
   - 过程中修改形参不影响实参

2. **引用传递**：
   - 传递参数的地址
   - 过程中修改形参会影响实参

3. **换名调用**：
   - 用实参的文本替换形参
   - 每次使用形参时都重新计算实参

## 七、数组引用
### 7.1 数组元素的地址计算
- **一维数组**：
  - 假设数组A的基址是base，每个元素占w个单元
  - A[i]的地址：base + i * w
  - 或：(base - low * w) + i * w，其中low是下界

- **二维数组**：
  - 按行存放：A[i][j]的地址 = base + ((i - low₁) * n₂ + (j - low₂)) * w
  - 按列存放：A[i][j]的地址 = base + ((j - low₂) * n₁ + (i - low₁)) * w

### 7.2 数组引用的翻译
- **文法**：
  L→id[Elist] | id
  Elist→Elist₁, E | E
- **翻译方案**：
  - 计算数组下标表达式的值
  - 计算数组元素的地址
  - 生成三地址代码

## 八、记录和结构
### 8.1 记录的定义
- **记录**：将多个不同类型的数据组合在一起
- **示例**：
  ```
  record {
      integer id;
      real score;
      char[20] name;
  } student;
  ```

### 8.2 记录域的访问
- **记录域的地址计算**：基址 + 域的偏移量
- **示例**：student.id的地址 = &student + id的偏移量

### 8.3 记录的翻译
- **将记录的域信息填入符号表**
- **包括每个域的类型和偏移量**

## 九、总结
语义分析和中间代码产生是编译过程的重要阶段。本章介绍了说明语句、赋值语句、布尔表达式、控制流语句、过程调用、数组引用、记录和结构等的翻译方法。三地址代码是常用的中间代码形式，通过语法制导翻译可以生成中间代码。

---

## 章节：第8章 代码优化笔记

# 第8章 代码优化笔记

## 一、代码优化概述
### 1.1 什么是代码优化
代码优化（Code Optimization）是对程序进行等价变换，使得变换后的程序更高效。

**等价**：
- 对于相同的输入，产生相同的输出
- 不改变程序的语义

**更高效**：
- 运行速度更快
- 占用空间更小
- 能耗更低

### 1.2 优化的分类
#### 1.2.1 按优化级别分类
1. **局部优化**：在一个基本块内进行
2. **循环优化**：对循环进行优化
3. **全局优化**：在整个函数或程序内进行
4. **过程间优化**：跨过程进行

#### 1.2.2 按与机器的关系分类
1. **机器无关优化**：不依赖于目标机器
2. **机器相关优化**：依赖于目标机器

### 1.3 优化的原则
1. **等价性**：不能改变程序的语义
2. **有效性**：优化后的程序必须更高效
3. **性价比**：优化的收益应该大于优化的成本

## 二、局部优化
### 2.1 基本块的优化
基本块内的优化：

#### 2.1.1 公共子表达式删除
**公共子表达式**：计算结果相同的表达式。

**示例**：
```
before:
    t1 = a + b
    t2 = a + b
    t3 = t1 + t2

after:
    t1 = a + b
    t3 = t1 + t1
```

#### 2.1.2 复写传播
**复写传播**：如果有 x = y，则在后面可以用 y 代替 x。

**示例**：
```
before:
    x = y
    z = x + 1

after:
    x = y
    z = y + 1
```

#### 2.1.3 无用代码删除
**无用代码**：计算结果不会被使用的代码。

**示例**：
```
before:
    x = a + b
    y = x + 1
    x = 0
    return y

after:
    x = a + b
    y = x + 1
    return y
```

#### 2.1.4 代数化简
利用代数恒等式化简。

**示例**：
```
before:
    x = x + 0
    x = x * 1
    x = x - 0

after:
    （删除）
```

#### 2.1.5 强度削弱
用更高效的运算代替低效的运算。

**示例**：
```
before:
    x = y * 2
    x = y * 16

after:
    x = y + y
    x = y << 4
```

### 2.2 DAG优化
用DAG表示基本块，可以发现公共子表达式。

**示例**：
```
基本块：
    t1 = a + b
    t2 = a + b
    t3 = t1 + t2

DAG：
        +
       / \
      +   t1
     / \
    a   b
```

## 三、循环优化
### 3.1 循环的识别
#### 3.1.1 自然循环
自然循环（Natural Loop）具有以下性质：
- 有一个唯一的入口结点（首结点）
- 至少有一条回边

#### 3.1.2 回边
回边（Back Edge）是从结点a到结点b的边，其中b支配a。

### 3.2 代码外提
代码外提（Code Motion）将循环不变计算提到循环外面。

**循环不变计算**：在循环中每次计算结果都相同的计算。

**示例**：
```
before:
    for (i = 0; i < n; i++) {
        t = a * b;
        x[i] = t + i;
    }

after:
    t = a * b;
    for (i = 0; i < n; i++) {
        x[i] = t + i;
    }
```

### 3.3 强度削弱
强度削弱（Strength Reduction）用更高效的运算代替循环中的低效运算。

**示例**：
```
before:
    for (i = 0; i < n; i++) {
        t = i * 4;
        x[t] = 0;
    }

after:
    t = 0;
    for (i = 0; i < n; i++) {
        x[t] = 0;
        t = t + 4;
    }
```

### 3.4 归纳变量删除
归纳变量（Induction Variable）：在循环中按固定值递增或递减的变量。

**示例**：
```
before:
    j = 1;
    for (i = 0; i < 10; i++) {
        j = j + 2;
        a[j] = 0;
    }

after:
    for (j = 1; j < 21; j = j + 2) {
        a[j] = 0;
    }
```

### 3.5 循环展开
循环展开（Loop Unrolling）复制循环体，减少循环控制开销。

**示例**：
```
before:
    for (i = 0; i < 100; i++) {
        a[i] = 0;
    }

after:
    for (i = 0; i < 100; i = i + 4) {
        a[i] = 0;
        a[i+1] = 0;
        a[i+2] = 0;
        a[i+3] = 0;
    }
```

## 四、全局优化
### 4.1 数据流分析
数据流分析（Data Flow Analysis）收集程序中数据流动的信息。

#### 4.1.1 到达-定值分析
到达-定值（Reaching Definitions）：找出在某点之前可能到达该点的定值。

#### 4.1.2 活跃变量分析
活跃变量（Live Variables）：找出在某点之后还会被使用的变量。

#### 4.1.3 可用表达式分析
可用表达式（Available Expressions）：找出在某点之前已经计算过且没有被重新计算的表达式。

### 4.2 全局公共子表达式删除
利用可用表达式分析，找出全局公共子表达式。

## 五、过程间优化
### 5.1 过程内联
过程内联（Procedure Inlining）用函数体代替函数调用。

**示例**：
```
before:
    int square(int x) {
        return x * x;
    }

    int main() {
        int a = square(5);
        return 0;
    }

after:
    int main() {
        int a = 5 * 5;
        return 0;
    }
```

### 5.2 过程间常量传播
跨过程传播常量信息。

## 六、优化的顺序
典型的优化顺序：
1. 局部优化
2. 循环优化
3. 全局优化
4. 过程间优化
5. 寄存器分配
6. 窥孔优化

## 七、总结
### 7.1 优化技术
- 公共子表达式删除
- 复写传播
- 无用代码删除
- 代数化简
- 强度削弱
- 代码外提
- 归纳变量删除
- 循环展开
- 过程内联

### 7.2 数据流分析
- 到达-定值分析
- 活跃变量分析
- 可用表达式分析

### 7.3 原则
等价、有效、性价比

---

## 章节：第9章 运行时笔记

# 第9章 运行时笔记

## 一、运行时环境概述
### 1.1 什么是运行时环境
运行时环境（Runtime Environment）是支持程序运行的系统软件和硬件的集合。

### 1.2 运行时环境的职责
1. **存储分配**：为变量、数据分配存储空间
2. **名字绑定**：将名字映射到存储位置
3. **参数传递**：处理函数调用的参数传递
4. **控制转移**：处理函数调用和返回
5. **异常处理**：处理异常情况

## 二、存储组织
### 2.1 运行时内存的划分
典型的运行时内存划分：

```
高地址
    +-----------------+
    |   操作系统     |
    +-----------------+
    |      栈        | ← 向下增长
    |                 |
    |                 |
    |                 |
    |      堆        | ← 向上增长
    +-----------------+
    |   未初始化数据  |
    +-----------------+
    |   初始化数据    |
    +-----------------+
    |      代码       |
    +-----------------+
低地址
```

### 2.2 各区域的用途
1. **代码区**：存放程序的目标代码
2. **数据区**：
   - 初始化数据：存放已初始化的全局变量和静态变量
   - 未初始化数据：存放未初始化的全局变量和静态变量
3. **堆区**：动态分配的内存
4. **栈区**：函数调用的活动记录

## 三、活动记录
### 3.1 活动记录的结构
活动记录（Activation Record）是函数每次调用时在栈上分配的一块内存。

**典型的活动记录结构**：
```
高地址
    +-------------------+
    |   返回值         |
    +-------------------+
    |   参数区         |
    +-------------------+
    |   控制链         |
    +-------------------+
    |   访问链         |
    +-------------------+
    |   机器状态       |
    +-------------------+
    |   局部数据       |
    +-------------------+
    |   临时变量       |
    +-------------------+
低地址
```

### 3.2 各部分的说明
1. **返回值**：存放函数的返回值
2. **参数区**：存放函数的参数
3. **控制链**：指向调用者的活动记录
4. **访问链**：用于访问非局部变量
5. **机器状态**：保存调用前的机器状态（寄存器等）
6. **局部数据**：存放函数的局部变量
7. **临时变量**：存放编译器生成的临时变量

## 四、存储分配策略
### 4.1 静态存储分配
静态存储分配（Static Storage Allocation）在编译时确定所有变量的存储位置。

**特点**：
- 编译时分配
- 程序运行时位置不变
- 简单，但不灵活

**适用**：
- 全局变量
- 静态变量
- Fortran等语言

### 4.2 栈式存储分配
栈式存储分配（Stack Storage Allocation）在函数调用时在栈上分配活动记录。

**特点**：
- 函数调用时分配
- 函数返回时释放
- 支持递归
- 灵活

**适用**：
- C、C++、Java等语言的局部变量
- 函数参数

**示例**：
```c
void f(int x) {
    int a;
    ...
}

void g() {
    int b;
    f(10);
    ...
}

int main() {
    g();
    return 0;
}
```

**栈的变化**：
```
main调用g前：
    [main的活动记录]

main调用g后：
    [main的活动记录]
    [g的活动记录]

g调用f后：
    [main的活动记录]
    [g的活动记录]
    [f的活动记录]

f返回后：
    [main的活动记录]
    [g的活动记录]

g返回后：
    [main的活动记录]
```

### 4.3 堆式存储分配
堆式存储分配（Heap Storage Allocation）在堆区动态分配和释放内存。

**特点**：
- 运行时动态分配
- 需要显式或隐式释放
- 灵活，但可能产生碎片

**适用**：
- 动态数据结构（链表、树等）
- C的malloc/free
- C++的new/delete
- Java的new（垃圾回收）

**示例**：
```c
int *p = (int*)malloc(sizeof(int));
*p = 10;
free(p);
```

## 五、名字绑定和作用域
### 5.1 静态作用域
静态作用域（Static Scope）是指变量的作用域在编译时确定。

**规则**：
- 从内向外查找
- 最近嵌套原则

**示例**：
```c
int x = 1;          // 全局x

void f() {
    int x = 2;      // f的x
    {
        int x = 3;  // 内层的x
        printf("%d\n", x);  // 输出3
    }
    printf("%d\n", x);  // 输出2
}

int main() {
    f();
    printf("%d\n", x);  // 输出1
    return 0;
}
```

### 5.2 动态作用域
动态作用域（Dynamic Scope）是指变量的作用域在运行时确定。

**规则**：
- 沿调用链查找

**示例**：
```
int x = 1;

void f() {
    print(x);
}

void g() {
    int x = 2;
    f();
}

g();  // 动态作用域输出2，静态作用域输出1
```

### 5.3 访问链
访问链（Access Link）用于在静态作用域语言中访问非局部变量。

**原理**：
- 每个活动记录有一个访问链
- 访问链指向直接外层过程的活动记录

## 六、参数传递
### 6.1 传值调用
传值调用（Call by Value）：传递参数的值。

**特点**：
- 函数内修改参数不影响调用者

**示例**：
```c
void swap(int x, int y) {
    int temp = x;
    x = y;
    y = temp;
}

int main() {
    int a = 1, b = 2;
    swap(a, b);
    // a和b不变
    return 0;
}
```

### 6.2 传引用调用
传引用调用（Call by Reference）：传递参数的地址。

**特点**：
- 函数内修改参数影响调用者

**示例**（C++）：
```cpp
void swap(int &x, int &y) {
    int temp = x;
    x = y;
    y = temp;
}

int main() {
    int a = 1, b = 2;
    swap(a, b);
    // a和b交换
    return 0;
}
```

### 6.3 传值-结果调用
传值-结果调用（Call by Value-Result）：先传值，返回时复制结果。

### 6.4 传名调用
传名调用（Call by Name）：参数在每次使用时计算。

## 七、动态存储分配
### 7.1 显式分配
程序员显式分配和释放内存。

**示例**（C）：
```c
int *p = (int*)malloc(sizeof(int));
*p = 10;
free(p);
```

### 7.2 隐式分配（垃圾回收）
系统自动回收不再使用的内存。

**示例**（Java）：
```java
int[] a = new int[10];
a = null;  // 原来的数组可以被垃圾回收
```

### 7.3 垃圾回收算法
1. **标记-清除**：先标记，后清除
2. **复制**：将存活对象复制到新区域
3. **标记-整理**：标记后整理内存
4. **分代收集**：根据对象年龄不同采用不同策略

## 八、总结
### 8.1 存储组织
- 代码区
- 数据区
- 堆区
- 栈区

### 8.2 存储分配
- 静态分配
- 栈式分配
- 堆式分配

### 8.3 作用域
- 静态作用域
- 动态作用域

### 8.4 参数传递
- 传值调用
- 传引用调用
- 传值-结果调用
- 传名调用

---

## 章节：编译原理学习指导

# 编译原理学习指导

## 一、课程资料分析

### 资料结构
- **资料类型**：PPT课件（视频1.1-5.3.8）+ compiler-book-slides（1-10章）
- **内容覆盖**：编译过程、文法分析、词法分析、语法分析（LL/LR）、语法制导翻译、语义分析、中间代码生成、代码优化、运行时环境
- **新增资料**：compiler-book-slides（1-引言、2-词法分析、3-语法分析、4-语法制导翻译、5-语义分析、6-代码生成、7-中间表示、8-代码优化、9-运行时、10-课程实验）

### 详细知识点

#### 视频1.1-1 课程简介
- **编译原理课程目标**
  - 理解编译程序的工作原理
  - 掌握编译程序的构造方法
  - 培养系统设计和实现能力
  - 为后续课程（如操作系统、程序设计语言等）打下基础
- **编译程序的地位和作用**
  - 连接高级程序语言和机器语言的桥梁
  - 提高软件开发效率
  - 保证程序的正确性和可靠性
- **编译原理的应用领域**
  - 编译器和解释器的开发
  - 程序语言的设计和实现
  - 代码优化和重构工具
  - 软件测试和验证工具
  - 领域特定语言（DSL）的开发
- **编译器与解释器的区别**
  - **编译器**：将源程序一次性翻译成目标程序，然后执行目标程序
    - 优点：执行效率高，目标程序独立
    - 缺点：编译时间长，不便于调试
    - 例子：C、C++、Fortran编译器
  - **解释器**：逐条解释执行源程序，不生成独立的目标程序
    - 优点：便于调试，交互式执行
    - 缺点：执行效率低
    - 例子：Python、Ruby、JavaScript解释器
  - **混合型**：先编译成中间代码，再解释执行中间代码
    - 例子：Java（JVM）、C#（.NET）

#### 视频1.2 编译过程
- **编译的五个阶段详细说明**
  - **词法分析（Lexical Analysis）**
    - 任务：将源程序的字符流转换为单词符号（token）序列
    - 输入：源程序的字符流
    - 输出：单词符号序列
    - 主要工作：识别单词符号、过滤注释和空格、检查词法错误
    - **详细流程**：
      1. 从左到右扫描源程序字符
      2. 识别单词符号的开始和结束
      3. 分类单词符号（标识符、关键字、常数、运算符等）
      4. 构建token，包含类别和属性值
      5. 跳过空白字符和注释
      6. 检测并报告词法错误
    - **token的内部表示**：
      - 二元组：(token种别码, token属性值)
      - 例如：(标识符, "count")、(整数, 123)、(关键字, if)
  - **语法分析（Syntax Analysis）**
    - 任务：分析单词符号序列的语法结构，生成语法树或抽象语法树
    - 输入：单词符号序列
    - 输出：语法树或抽象语法树
    - 主要工作：分析语法结构、检查语法错误
    - **详细流程**：
      1. 根据文法规则分析token序列
      2. 验证语法结构的正确性
      3. 构建语法树或抽象语法树（AST）
      4. 检测并报告语法错误
      5. 进行错误恢复（可选）
  - **语义分析（Semantic Analysis）**
    - 任务：分析语法结构的语义，检查语义错误
    - 输入：语法树或抽象语法树
    - 输出：添加语义信息的语法树
    - 主要工作：类型检查、作用域分析、语义错误检查
    - **详细流程**：
      1. 收集标识符的声明信息
      2. 建立符号表
      3. 检查标识符的使用是否符合声明
      4. 进行类型检查和类型转换
      5. 检查控制流的正确性
      6. 检测并报告语义错误
  - **中间代码生成（Intermediate Code Generation）**
    - 任务：将语义分析后的语法树转换为中间代码
    - 输入：添加语义信息的语法树
    - 输出：中间代码（如三地址码、四元式等）
    - 主要工作：选择合适的中间代码形式、生成中间代码
    - **中间代码的优点**：
      1. 独立于目标机器，便于移植
      2. 便于进行代码优化
      3. 简化编译器的设计
  - **目标代码生成（Target Code Generation）**
    - 任务：将中间代码转换为目标机器的机器代码或汇编代码
    - 输入：中间代码
    - 输出：目标代码
    - 主要工作：寄存器分配、指令选择、代码优化
    - **详细流程**：
      1. 选择合适的指令序列
      2. 分配寄存器
      3. 生成机器代码或汇编代码
      4. 进行目标代码优化
- **编译程序的结构详细说明**
  - 前端（Front End）：词法分析、语法分析、语义分析、中间代码生成
    - 特点：依赖于源语言，独立于目标机器
  - 后端（Back End）：代码优化、目标代码生成
    - 特点：独立于源语言，依赖于目标机器
  - 表格管理：符号表、常数表、标识符表等
    - **符号表的作用**：
      - 存储标识符的属性信息（类型、作用域、存储位置等）
      - 支持标识符的快速查找
      - 辅助语义分析和代码生成
  - 出错处理：词法错误、语法错误、语义错误的检测和处理
    - **错误处理策略**：
      - 紧急方式恢复
      - 短语级恢复
      - 错误产生式
      - 全局纠正

#### 视频1.3 高级程序语言简介
- **程序语言的分类**
  - 按级别分类
    - 低级语言：机器语言、汇编语言
      - 特点：直接操作硬件，执行效率高，但编程困难
    - 高级语言：C、C++、Java、Python等
      - 特点：抽象程度高，编程容易，但执行效率相对较低
  - 按范型分类
    - 命令式语言：C、C++、Java
      - 特点：通过语句改变程序状态，强调"怎么做"
    - 函数式语言：Lisp、Haskell、ML
      - 特点：通过函数应用计算，强调"做什么"，无副作用
    - 逻辑式语言：Prolog
      - 特点：基于逻辑推理，描述问题而不是解决问题的步骤
    - 面向对象语言：C++、Java、C#
      - 特点：封装、继承、多态，以对象为中心
- **语言的语法和语义**
  - 语法（Syntax）：语言的结构规则
    - 规定了什么样的符号序列是合法的程序
  - 语义（Semantics）：语言的含义
    - 规定了合法程序的行为
    - 操作语义：通过执行步骤描述语义
    - 指称语义：通过数学函数描述语义
    - 公理语义：通过逻辑公理描述语义
  - 语用（Pragmatics）：语言的使用
    - 研究语言的使用环境和效果
- **程序语言的基本概念详解**
  - 标识符（Identifier）
    - 定义：用来命名程序实体的字符序列
    - 命名规则：通常以字母或下划线开头，后跟字母、数字或下划线
    - 例子：count、_temp、maxValue
  - 关键字（Keyword）
    - 定义：语言预定义的、具有特殊含义的标识符
    - 特点：不能用作普通标识符
    - 例子：if、else、while、for、int、float
  - 变量（Variable）
    - 定义：存储值的命名存储位置
    - 特点：值可以改变
    - 三要素：名字、类型、值
  - 常量（Constant）
    - 定义：值固定不变的量
    - 特点：值在程序运行过程中不能改变
    - 例子：3.14、"hello"、true
  - 数据类型（Data Type）
    - 定义：一组值以及在这些值上可以执行的操作
    - 作用：
      - 确定数据的存储方式
      - 确定可以执行的操作
      - 进行类型检查，防止错误
    - 分类：
      - 基本类型：整数、浮点数、布尔值、字符
      - 构造类型：数组、记录、结构体、类
      - 指针类型：指向其他类型的指针
  - 表达式（Expression）
    - 定义：由运算符和操作数组成的、可以计算出值的序列
    - 例子：a + b * 3、x > 5、!flag
  - 语句（Statement）
    - 定义：程序执行的基本单位
    - 分类：
      - 赋值语句：x = 5
      - 控制语句：if、while、for
      - 复合语句：{ ... }
  - 程序（Program）
    - 定义：完成特定任务的语句序列

#### 视频2.1 程序语言的定义
- **语法和语义的定义方法**
  - 语法的形式化定义
  - 语义的形式化定义（操作语义、指称语义、公理语义）
- **BNF范式（巴克斯-诺尔范式）详细说明**
  - BNF的基本符号
    - &lt;非终结符&gt;：用尖括号括起来的符号，表示语法范畴
    - 终结符：直接出现在语言中的符号
    - ::=：表示"定义为"
    - |：表示"或者"
  - BNF的例子
    - 简单算术表达式的BNF：
      ```
      &lt;表达式&gt; ::= &lt;项&gt; | &lt;表达式&gt; + &lt;项&gt; | &lt;表达式&gt; - &lt;项&gt;
      &lt;项&gt; ::= &lt;因子&gt; | &lt;项&gt; * &lt;因子&gt; | &lt;项&gt; / &lt;因子&gt;
      &lt;因子&gt; ::= &lt;标识符&gt; | &lt;常数&gt; | ( &lt;表达式&gt; )
      ```
    - 简单语句的BNF：
      ```
      &lt;语句&gt; ::= &lt;赋值语句&gt; | &lt;条件语句&gt; | &lt;循环语句&gt;
      &lt;赋值语句&gt; ::= &lt;标识符&gt; = &lt;表达式&gt;
      &lt;条件语句&gt; ::= if ( &lt;表达式&gt; ) &lt;语句&gt; else &lt;语句&gt;
      ```
- **推导和归约详解**
  - 推导（Derivation）：从开始符号出发，反复使用产生式替换非终结符，得到句子的过程
    - 推导的表示：α ⇒ β 表示一步推导
    - α ⇒* β 表示0步或多步推导
    - α ⇒+ β 表示1步或多步推导
  - 归约（Reduction）：推导的逆过程，从句子出发，反复使用产生式归约，得到开始符号的过程
  - 最左推导：每次总是替换最左边的非终结符
    - 例子：对于 E → E+T | T，T → T*F | F，F → id
      - 最左推导：E ⇒ E+T ⇒ T+T ⇒ F+T ⇒ id+T ⇒ id+F ⇒ id+id
  - 最右推导：每次总是替换最右边的非终结符
    - 也称为规范推导
    - 例子：
      - 最右推导：E ⇒ E+T ⇒ E+F ⇒ E+id ⇒ T+id ⇒ F+id ⇒ id+id

#### 视频2.2 文法的形式化定义和分类
- **文法的四元组定义（G=(V_N, V_T, P, S)）详细说明**
  - V_N：非终结符集合
    - 非终结符表示语法范畴，如&lt;表达式&gt;、&lt;语句&gt;
  - V_T：终结符集合
    - 终结符是语言的基本符号，如+、*、id、if
  - P：产生式集合
    - 产生式的形式：A → α，其中A∈V_N，α∈(V_N∪V_T)*
    - 产生式定义了非终结符的展开方式
  - S：开始符号，S∈V_N
    - 开始符号是文法的起点，代表整个语言
  - 要求：V_N∩V_T = ∅，S∈V_N
- **Chomsky文法分类详解**
  - **0型文法（短语文法，Phrase Structure Grammar）**
    - 产生式形式：α→β，其中α、β∈(V_N∪V_T)*且α至少包含一个非终结符
    - 能力：图灵机等价
    - 限制最少，能力最强
  - **1型文法（上下文有关文法，Context-Sensitive Grammar）**
    - 产生式形式：αAβ→αγβ，其中A∈V_N，α、β、γ∈(V_N∪V_T)*且γ≠ε
    - 或等价形式：|α|≤|β|（除了S→ε）
    - 含义：只有在上下文α...β中，A才能被替换为γ
    - 能力：线性有界自动机等价
  - **2型文法（上下文无关文法，Context-Free Grammar）**
    - 产生式形式：A→β，其中A∈V_N，β∈(V_N∪V_T)*
    - 特点：A的替换与上下文无关
    - 能力：下推自动机等价
    - 应用：程序设计语言的语法描述
    - 例子：表达式文法、语句文法
  - **3型文法（正则文法，Regular Grammar）**
    - 右线性文法：产生式形式：A→aB 或 A→a，其中A,B∈V_N，a∈V_T
    - 左线性文法：产生式形式：A→Ba 或 A→a，其中A,B∈V_N，a∈V_T
    - 能力：有限自动机等价
    - 应用：程序设计语言的词法描述
    - 例子：标识符、整数的描述

#### 视频2.3 文法和语言
- **推导和归约**
  - 推导的概念
  - 推导的长度：推导的步数
  - 推导的步数
- **句型和句子详解**
  - 句型（Sentential Form）：从开始符号出发，经过若干步推导得到的符号串
    - 可以包含非终结符和终结符
  - 句子（Sentence）：仅由终结符组成的句型
    - 是语言的一个元素
  - 例子：
    - 对于表达式文法，E、E+T、T*F、id+id都是句型
    - 只有id+id、id*id这样的串才是句子
- **语言的定义**
  - 语言L(G)：文法G产生的所有句子的集合
  - L(G) = {ω | S ⇒* ω 且 ω∈V_T*}
  - 语言的例子：
    - 平衡括号语言：{ε, (), (()), ()(), ((())), ...}
    - a^n b^n 语言：{ε, ab, aabb, aaabbb, ...}
- **文法的等价性**
  - 若两个文法G1和G2产生的语言相同，即L(G1)=L(G2)，则称G1和G2等价
  - 同一语言可以由多个不同的文法产生
  - 等价文法的例子：
    - G1: E→E+T | T, T→T*F | F, F→id
    - G2: E→E+E | E*E | id
    - L(G1)=L(G2)，但G1无二义，G2有二义

#### 视频2.4 语法分析树
- **语法树的构造详解**
  - 根节点：开始符号
  - 内部节点：非终结符
  - 叶节点：终结符或ε
  - 子节点的顺序：对应产生式右部的顺序
  - 语法树的构造过程：
    1. 以开始符号作为根节点
    2. 对于推导中的每一步，将非终结符替换为产生式右部
    3. 将产生式右部的符号作为该非终结符的子节点
    4. 重复直到所有叶节点都是终结符
  - 语法树的例子：
    - 句子id+id*id的语法树
    - 根是E，E有子节点E、+、T
    - 左E有子节点T，T有子节点F，F有子节点id
    - 右T有子节点T、*、F
    - 左T有子节点F，F有子节点id
    - 右F有子节点id
- **二义性文法详解**
  - 定义：如果一个文法存在某个句子，它有两棵不同的语法树，则称该文法是二义的
  - 等价定义：存在某个句子有两个不同的最左推导（或最右推导）
  - 例子：E→E+E | E*E | (E) | id
    - 句子id+id*id有两棵不同的语法树
    - 一棵对应(id+id)*id
    - 另一棵对应id+(id*id)
  - 二义性的消除方法：
    - 规定运算符的优先级和结合性
    - 改写文法
      - 例如，引入优先级层次：
        E→E+T | T
        T→T*F | F
        F→id | (E)
  - 二义性的危害：
    - 导致语法分析的不确定性
    - 可能产生不同的语义
- **消除二义性的详细方法**
  - 引入优先级
    - 高优先级的运算符先结合
    - 例如，*的优先级高于+
  - 引入结合性
    - 左结合：从左到右结合，如+、-
    - 右结合：从右到左结合，如赋值运算符=
  - 改写文法结构
    - 将不同优先级的运算符分到不同的非终结符
    - 左结合：递归在左边，如E→E+T
    - 右结合：递归在右边，如E→T=E

#### 视频3.1 词法分析概述
- **词法分析的任务详细说明**
  - 从左到右扫描源程序的字符流
  - 识别单词符号（token）
  - 过滤掉注释和空白字符
  - 检查词法错误
  - 生成单词符号序列
- **词法单元的定义详解**
  - 词法单元（Token）：单词符号的类别
    - 例如：标识符、关键字、整数、运算符、分隔符
  - 词素（Lexeme）：源程序中匹配某个词法单元的字符序列
    - 例如：count、if、123、+、;
  - 模式（Pattern）：描述词法单元的规则
    - 例如：标识符的模式是字母(字母|数字)*
  - 属性值（Attribute Value）：词素的具体值或附加信息
    - 例如：标识符的属性值是它的名字，整数的属性值是它的数值
  - token的完整表示：
    ```
    (token种别码, 属性值)
    ```
  - 例子：
    - (标识符, "count")
    - (关键字, "if")
    - (整数, 123)
    - (运算符, "+")
    - (分隔符, ";")
- **词法分析器的设计详解**
  - 确定单词符号的类别
    - 列出所有需要识别的token类型
  - 设计每个单词符号的识别规则
    - 用正规式描述每个token的模式
  - 实现词法分析器
    - 可以手写，也可以使用工具生成
  - 处理词法错误
    - 检测非法字符、超长标识符等
    - 进行错误恢复

#### 视频3.2 状态转换图
- **状态转换图的构造详解**
  - 节点：表示状态
    - 通常用圆圈表示
    - 可以给状态编号或命名
  - 边：表示状态转换
    - 从一个状态指向另一个状态
  - 边的标记：输入字符
    - 可以是单个字符、字符类或ε
  - 终态：用双圈表示
    - 表示一个token识别完成
  - 初态：通常用箭头标记
    - 表示开始识别的状态
  - 状态转换图的例子：
    - 标识符的状态转换图：
      - 初态0
      - 从0输入字母到状态1
      - 从1输入字母或数字到状态1
      - 状态1是终态
- **词法分析器的实现详解**
  - 用状态转换图描述词法分析器
  - 将状态转换图转换为程序
  - 使用switch-case或if-else实现状态转换
  - 实现框架：
    ```c
    int state = 0;
    char c;
    while ((c = getchar()) != EOF) {
        switch (state) {
            case 0:
                if (isalpha(c)) {
                    state = 1;
                } else if (isdigit(c)) {
                    state = 2;
                }
                break;
            case 1:
                if (isalnum(c)) {
                    state = 1;
                } else {
                    // 识别到标识符
                    state = 0;
                }
                break;
            // 其他状态...
        }
    }
    ```
- **状态转换图的简化**
  - 合并等价状态
  - 删除不可达状态
  - 简化状态转换

#### 视频3.3.1 正规式与正规集
- **正规式的定义详解**
  - 基础：
    - ε是正规式，表示空串
    - 对于每个a∈V_T，a是正规式，表示单字符集合{a}
  - 归纳：
    - 若r和s是正规式，则(r|s)是正规式，表示L(r)∪L(s)
    - 若r和s是正规式，则(rs)是正规式，表示L(r)L(s)
    - 若r是正规式，则(r*)是正规式，表示L(r)*（闭包）
  - 优先级（从高到低）：
    1. 闭包 *
    2. 连接（隐式）
    3. 选择 |
  - 正规式的例子：
    - 标识符：letter(letter|digit)*
    - 整数：digit+
    - 带符号整数：(+|-|ε)digit+
    - 实数：digit+ . digit* | . digit+ | digit+ ( . digit*)? (e(+|-|ε)digit+)?
- **正规集的运算详解**
  - 并（Union）：r|s
    - L(r|s) = L(r) ∪ L(s)
    - 例子：a|b 表示 {a, b}
  - 连接（Concatenation）：rs
    - L(rs) = {xy | x∈L(r), y∈L(s)}
    - 例子：ab 表示 {ab}
  - 闭包（Closure）：r*（0次或多次重复）
    - L(r*) = (L(r))* = {ε} ∪ L(r) ∪ L(r)L(r) ∪ ...
    - 例子：a* 表示 {ε, a, aa, aaa, ...}
  - 正闭包（Positive Closure）：r+（1次或多次重复）
    - r+ = rr*
    - L(r+) = L(r) ∪ L(r)L(r) ∪ ...
    - 例子：a+ 表示 {a, aa, aaa, ...}
  - 可选（Optional）：r?（0次或1次）
    - r? = r|ε
    - 例子：a? 表示 {ε, a}
- **正规式与正规集的关系**
  - 每个正规式对应一个正规集
  - 正规集是该正规式描述的所有字符串的集合
  - 常用正规式例子：
    - 标识符：[a-zA-Z_][a-zA-Z0-9_]*
    - 整数：[0-9]+
    - 注释：/\*.*?\*/
    - 字符串："([^"\\]|\\.)*"

#### 视频3.3.2 确定有限自动机
- **DFA的定义（M=(Q, Σ, δ, q0, F)）详细说明**
  - Q：有限状态集合
    - 例如：Q = {0, 1, 2}
  - Σ：有限输入字母表
    - 例如：Σ = {a, b}
  - δ：转移函数，δ: Q×Σ → Q
    - 例如：δ(0, a) = 1, δ(0, b) = 0, δ(1, a) = 1, δ(1, b) = 2
  - q0：初始状态，q0∈Q
    - 例如：q0 = 0
  - F：终态集合，F⊆Q
    - 例如：F = {2}
- **DFA的运行过程**
  - 从初始状态q0开始
  - 对于输入串的每个字符，根据转移函数δ转移到下一个状态
  - 当输入串处理完毕时，若当前状态在F中，则接受该串，否则拒绝
  - 例子：
    - 输入串：ab
    - 运行过程：0 →(a) 1 →(b) 2
    - 最终状态2在F中，接受
- **DFA的构造**
  - 从正规式构造DFA
  - 从NFA构造DFA
- **DFA的最小化详解**
  - 状态等价的定义
    - 两个状态p和q是等价的，当且仅当对于任何输入串ω，从p出发和从q出发都到达终态，或者都不到达终态
  - 不可区分状态的合并
  - Hopcroft算法
    - 基于划分的算法
    - 时间复杂度O(n log n)

#### 视频3.3.3 非确定有限自动机
- **NFA的定义详解**
  - NFA=(Q, Σ, δ, q0, F)
  - 转移函数δ: Q×(Σ∪{ε}) → 2^Q（可以有多个后继状态，或者ε转移）
  - NFA与DFA的区别：
    - DFA：每个状态对每个输入符号有且仅有一个转移
    - NFA：每个状态对每个输入符号可以有0个、1个或多个转移；可以有ε转移
- **NFA的运行过程**
  - 从初始状态q0开始
  - 在每一步，可以选择任何可能的转移（包括ε转移）
  - 只要存在一条路径，使得处理完输入串后到达终态，就接受该串
  - 例子：
    - NFA：0→(a)1, 0→(a)2, 1→(b)3, 2→(b)3, F={3}
    - 输入串：ab
    - 运行：0→1→3 或 0→2→3，都到达终态，接受
- **NFA到DFA的转换（子集构造法）详解**
  - ε-闭包（ε-closure）的计算
    - ε-closure(T)：从状态集合T出发，经过0步或多步ε转移可以到达的所有状态
    - 计算方法：
      1. 将T中的所有状态加入ε-closure(T)
      2. 对于ε-closure(T)中的每个状态p，若有ε转移到q，则将q加入ε-closure(T)
      3. 重复直到没有新状态加入
  - 子集构造算法详细步骤：
    1. 初始状态是ε-closure({q0})
    2. 对于每个状态子集T和每个输入符号a：
       a. 计算move(T, a) = {δ(t, a) | t∈T}
       b. 计算δ'(T, a) = ε-closure(move(T, a))
    3. 重复步骤2，直到没有新的状态子集产生
    4. 终态是所有包含原终态的状态子集
  - 例子：
    - 原NFA：0→ε1, 1→a2, 2→ε3, F={3}
    - ε-closure({0}) = {0,1}
    - move({0,1}, a) = {2}
    - ε-closure({2}) = {2,3}（这是终态）
    - DFA状态：{0,1}, {2,3}
    - 转移：{0,1}→(a){2,3}
- **NFA的优点和应用**
  - NFA比DFA更直观、更容易构造
  - 常用于词法分析器的设计
  - NFA到DFA的转换是词法分析器自动生成的关键

#### 视频3.3.4 正规式和有限自动机的等价性
- **正规式到NFA的转换（Thompson构造法）详解**
  - 对于ε：
    - 构造两个状态q0和q1，从q0到q1有一条ε边，q0是初态，q1是终态
  - 对于a（a∈Σ）：
    - 构造两个状态q0和q1，从q0到q1有一条a边，q0是初态，q1是终态
  - 对于r|s：
    - 构造r的NFA（r0, r1）和s的NFA（s0, s1）
    - 添加新的初态q0和终态q1
    - 从q0用ε边连接到r0和s0
    - 从r1和s1用ε边连接到q1
    - q0是新的初态，q1是新的终态
  - 对于rs：
    - 构造r的NFA（r0, r1）和s的NFA（s0, s1）
    - 将r1和s0用ε边连接
    - r0是新的初态，s1是新的终态
  - 对于r*：
    - 构造r的NFA（r0, r1）
    - 添加新的初态q0和终态q1
    - 从q0用ε边连接到r0和q1
    - 从r1用ε边连接到r0和q1
    - q0是新的初态，q1是新的终态
- **NFA到正规式的转换**
  - 使用状态消去法
  - 逐步消去状态，保留状态间的正规式
  - 最终得到初态到终态的正规式
- **正规式、NFA、DFA的等价性**
  - 定理：一个语言是正规的，当且仅当它可以被某个DFA、NFA或正规式描述
  - 这三者在描述能力上是等价的
  - 转换关系：
    - 正规式 → NFA（Thompson构造）
    - NFA → DFA（子集构造）
    - DFA → 正规式（状态消去）

#### 视频3.3.5 DFA的化简
- **DFA最小化算法详解**
  - Hopcroft算法
  - 基于划分的方法
- **状态等价的定义**
  - 两个状态p和q是等价的，当且仅当对于任何输入串ω，从p出发和从q出发都到达终态，或者都不到达终态
  - 不可区分的状态可以合并
- **最小化DFA的步骤详解**
  1. 初始划分：将状态划分为终态和非终态两个组
     - Π0 = {F, Q-F}
  2. 细化划分：对于每个组，检查组内的状态是否可以进一步划分
     - 对于Πi中的每个组G：
       - 将G划分为子组，使得同一子组中的状态对所有输入符号都转移到Πi的同一组
     - Πi+1是所有这样的子组的集合
  3. 重复步骤2，直到划分不再变化
     - 即Πi+1 = Πi
  4. 将每个不可区分的状态组合并为一个状态
  5. 构造最小化后的DFA
    - 状态是划分中的组
    - 转移：对于组G和输入a，转移到包含δ(g, a)的组，其中g∈G
    - 初态是包含q0的组
    - 终态是包含F中状态的组
- **例子**：
  - 假设有DFA：Q={0,1,2,3,4}, Σ={a,b}
  - 转移：
    - δ(0,a)=1, δ(0,b)=2
    - δ(1,a)=1, δ(1,b)=3
    - δ(2,a)=1, δ(2,b)=2
    - δ(3,a)=1, δ(3,b)=4
    - δ(4,a)=1, δ(4,b)=2
  - F={4}
  - 最小化过程：
    - Π0 = {{4}, {0,1,2,3}}
    - Π1：检查{0,1,2,3}
      - 0和2对b都转移到2（在同一组），所以可以合并
      - 1对b转移到3，3对b转移到4（在不同组），所以1和3要分开
      - Π1 = {{4}, {0,2}, {1}, {3}}
    - Π2：检查各组，没有新的划分
    - 最小化后的状态：{4}, {0,2}, {1}, {3}

#### 视频3.5.1 词法分析器的自动生成
- **LEX工具的使用详解**
  - LEX（GNU版本是Flex）是词法分析器的自动生成工具
  - LEX源文件的结构：
    - 定义段（Definitions）：
      - 声明和定义
      - %{ ... %} 之间的内容直接复制到生成的C代码中
      - 可以定义宏：name definition
    - 规则段（Rules）：
      - 模式 { 动作 }
      - 当输入匹配某个模式时，执行对应的动作
      - yytext：指向匹配的词素
      - yyleng：词素的长度
      - yylval：传递给语法分析器的属性值
    - 用户代码段（User Code）：
      - C语言代码
- **词法分析器的生成过程**
  - 编写LEX源文件（.l文件）
  - 使用LEX编译：lex filename.l
  - 生成C语言文件（lex.yy.c）
  - 编译C文件：gcc lex.yy.c -lfl
  - 生成可执行词法分析器
- **LEX源文件的完整例子**：
  ```
  %{
  #include &lt;stdio.h&gt;
  #include "y.tab.h"
  int line_num = 1;
  %}
  
  letter      [a-zA-Z_]
  digit       [0-9]
  id          {letter}({letter}|{digit})*
  integer     {digit}+
  real        {integer}\.{integer}([eE][+-]?{integer})?
  whitespace  [ \t\r]+
  newline     \n
  
  %%
  
  {whitespace}    ; /* ignore whitespace */
  {newline}       { line_num++; }
  "if"            { return IF; }
  "then"          { return THEN; }
  "else"          { return ELSE; }
  {id}            { yylval.strval = strdup(yytext); return ID; }
  {integer}       { yylval.intval = atoi(yytext); return INTEGER; }
  {real}          { yylval.realval = atof(yytext); return REAL; }
  "+"             { return PLUS; }
  "-"             { return MINUS; }
  "*"             { return MULT; }
  "/"             { return DIV; }
  "="             { return ASSIGN; }
  "("             { return LPAREN; }
  ")"             { return RPAREN; }
  ";"             { return SEMICOLON; }
  .               { fprintf(stderr, "Unknown character %c at line %d\n", yytext[0], line_num); }
  
  %%
  
  int yywrap() {
      return 1;
  }
  
  int main() {
      yylex();
      return 0;
  }
  ```

#### 视频3.5.2 词法分析程序实现实例
- **词法分析器的具体实现**
  - 手写词法分析器
    - 使用状态转换图
    - 使用C语言实现
    - 优点：灵活，可以高度优化
    - 缺点：开发时间长，维护困难
  - 使用LEX生成词法分析器
    - 优点：开发快速，易于维护
    - 缺点：灵活性稍差
- **词法分析器的测试**
  - 测试各种输入
  - 检查输出的单词符号序列
  - 处理边界情况和错误输入
- **词法分析器的优化**
  - 合并相似的模式
  - 优化状态转换
  - 减少不必要的计算

#### 视频4.1 语法分析简介
- **语法分析的任务详细说明**
  - 分析单词符号序列的语法结构
  - 构造语法树或抽象语法树
  - 检查语法错误
  - 报告语法错误的位置和类型
- **自顶向下和自底向上分析详细对比**
  - 自顶向下分析（Top-Down）
    - 从开始符号出发，尝试构造推导
    - 为输入串构造最左推导
    - 例子：递归下降分析、预测分析
    - 优点：
      - 概念简单，易于理解
      - 易于手工实现
      - 可以在分析的同时进行语义分析
    - 缺点：
      - 对文法有要求（不能有左递归，不能回溯）
      - 能处理的文法范围较窄
  - 自底向上分析（Bottom-Up）
    - 从输入串出发，尝试构造归约
    - 为输入串构造最右推导的逆过程（规范归约）
    - 例子：算符优先分析、LR分析
    - 优点：
      - 能处理更多类别的文法
      - 通常更高效
      - 有强大的自动生成工具（如YACC/Bison）
    - 缺点：
      - 概念较复杂
      - 手工实现较困难
- **语法分析器的设计**
  - 选择合适的分析方法
  - 设计语法分析器
  - 实现语法分析器
  - 处理语法错误

#### 视频4.2 自顶向下分析简介
- **递归下降分析详解**
  - 为每个非终结符编写一个递归子程序
  - 子程序的结构对应产生式的结构
  - 优点：简单、直观、易于实现
  - 缺点：效率较低、左递归会导致无限递归
- **预测分析**
  - 使用预测分析表
  - 分析过程是确定性的
  - 不需要回溯
  - 效率较高

#### 视频4.3.1 消除左递归和回溯
- **直接左递归的消除详解**
  - 对于产生式：A→Aα | β，其中β不以A开头
  - 替换为：A→βA'，A'→αA' | ε
  - 例子：
    - 原产生式：E→E+T | E-T | T
    - 消除后：
      - E→TE'
      - E'→+TE' | -TE' | ε
  - 一般形式：
    - 原产生式：A→Aα1 | Aα2 | ... | Aαm | β1 | β2 | ... | βn
    - 消除后：
      - A→β1A' | β2A' | ... | βnA'
      - A'→α1A' | α2A' | ... | αmA' | ε
- **间接左递归的消除详解**
  - 按某种顺序排列非终结符：A1, A2, ..., An
  - 对于每个i从1到n：
    - 对于每个j从1到i-1：
      - 将所有形如Ai→Ajγ的产生式替换为Ai→δ1γ | δ2γ | ... | δkγ，其中Aj→δ1 | δ2 | ... | δk是Aj的所有产生式
    - 消除Ai的直接左递归
  - 例子：
    - 原文法：
      - S→Aa | b
      - A→Ac | Sd | ε
    - 排序：S, A
    - 处理S：没有左递归
    - 处理A：
      - 将A→Sd替换为A→Aad | bd
      - 现在A的产生式：A→Ac | Aad | bd | ε
      - 消除直接左递归：
        - A→bdA' | A'
        - A'→cA' | adA' | ε
- **回溯的避免详解**
  - 提取左公因子：
    - 对于产生式A→αβ1 | αβ2 | ... | αβn | γ
    - 替换为A→αA' | γ，A'→β1 | β2 | ... | βn
  - 例子：
    - 原产生式：E→id | id(E)
    - 提取左公因子后：
      - E→idE'
      - E'→(E) | ε
  - 确保对于每个非终结符A的任意两个不同产生式A→α和A→β，FIRST(α)和FIRST(β)不相交
  - 如果β可以推导出ε，则FIRST(α)和FOLLOW(A)不相交

#### 视频4.3.2 LL(1)分析法的工作过程
- **LL(1)分析器的构造详解**
  - 分析表（预测分析表）
  - 分析栈
  - 输入缓冲区
- **LL(1)分析器的工作原理详解**
  - 初始时，分析栈中压入结束符#和开始符号S
  - 输入指针指向输入串的第一个符号
  - 设栈顶符号为X，当前输入符号为a：
    - 若X = a = #，分析成功，停止
    - 若X = a ≠ #，弹出X，输入指针前进
    - 若X是非终结符，查找分析表M[X,a]：
      - 若M[X,a] = X→Y1Y2...Yk，弹出X，按逆序压入Yk...Y2Y1
      - 若M[X,a]为空，报错
- **LL(1)的含义**
  - 第一个L：从左到右扫描输入
  - 第二个L：产生最左推导
  - 1：每次向前看1个输入符号
- **LL(1)分析的例子**：
  - 文法：
    - E→TE'
    - E'→+TE' | ε
    - T→FT'
    - T'→*FT' | ε
    - F→(E) | id
  - 输入：id+id*id
  - 分析过程：
    - 栈：#E，输入：id+id*id#
    - E→TE'，栈：#E'T，输入：id+id*id#
    - T→FT'，栈：#E'T'F，输入：id+id*id#
    - F→id，栈：#E'T'id，输入：id+id*id#
    - 匹配id，栈：#E'T'，输入：+id*id#
    - T'→ε，栈：#E'，输入：+id*id#
    - E'→+TE'，栈：#E'T+，输入：+id*id#
    - 匹配+，栈：#E'T，输入：id*id#
    - 继续分析...

#### 视频4.3.3 FIRST集和FOLLOW集的构造
- **FIRST集的定义和计算方法详解**
  - FIRST(α)：从α出发可以推导出的所有串的首终结符的集合
  - 若α ⇒* ε，则ε也在FIRST(α)中
  - 计算FIRST(X)，X∈V_N∪V_T：
    - 若X∈V_T，则FIRST(X) = {X}
    - 若X∈V_N，且有产生式X→aα，则a∈FIRST(X)
    - 若X∈V_N，且有产生式X→ε，则ε∈FIRST(X)
    - 若X∈V_N，且有产生式X→Y1Y2...Yk：
      - 若Y1≠ε，则FIRST(Y1)⊆FIRST(X)
      - 若Y1⇒*ε，则FIRST(Y1)-{ε}∪FIRST(Y2)⊆FIRST(X)
      - 依此类推，直到某个Yi不能推导出ε，或者所有Yi都能推导出ε，此时ε∈FIRST(X)
  - 计算FIRST(α)，α=X1X2...Xn：
    - F = FIRST(X1) - {ε}
    - i = 1
    - while ε∈FIRST(Xi)且i≤n:
      - F = F ∪ (FIRST(Xi+1) - {ε})
      - i = i + 1
    - if i = n+1且ε∈FIRST(Xn):
      - F = F ∪ {ε}
    - FIRST(α) = F
- **FOLLOW集的定义和计算方法详解**
  - FOLLOW(A)：在某个句型中，紧跟在A后面的终结符的集合
  - 若A是某个句型的最后一个符号，则#∈FOLLOW(A)
  - 计算FOLLOW(A)，A∈V_N：
    - 对于开始符号S，#∈FOLLOW(S)
    - 若有产生式A→αBβ，则FIRST(β)-{ε}⊆FOLLOW(B)
    - 若有产生式A→αB，或A→αBβ且β⇒*ε，则FOLLOW(A)⊆FOLLOW(B)
    - 重复上述步骤，直到FOLLOW集不再变化
  - FOLLOW集的例子：
    - 文法：
      - E→TE'
      - E'→+TE' | ε
      - T→FT'
      - T'→*FT' | ε
      - F→(E) | id
    - 计算：
      - FOLLOW(E) = {#, )}
      - FOLLOW(E') = FOLLOW(E) = {#, )}
      - FOLLOW(T) = FIRST(E') - {ε} ∪ FOLLOW(E) = {+} ∪ {#, )} = {+, #, )}
      - FOLLOW(T') = FOLLOW(T) = {+, #, )}
      - FOLLOW(F) = FIRST(T') - {ε} ∪ FOLLOW(T) = {*} ∪ {+, #, )} = {*, +, #, )}

#### 视频4.3.4 LL(1)分析表的构造
- **LL(1)分析表的构建算法详解**
  - 对于每个产生式A→α：
    - 对于每个a∈FIRST(α)，将A→α加入M[A,a]
    - 若ε∈FIRST(α)，则对于每个b∈FOLLOW(A)，将A→α加入M[A,b]
    - 若ε∈FIRST(α)且#∈FOLLOW(A)，则将A→α加入M[A,#]
  - 所有空白的条目标记为错误
- **LL(1)分析表的例子**：
  - 文法同上
  - 分析表：
    |     | id   | +    | *    | (    | )    | #    |
    |-----|------|------|------|------|------|------|
    | E   | E→TE'|      |      | E→TE'|      |      |
    | E'  |      | E'→+TE' |    |      | E'→ε | E'→ε |
    | T   | T→FT'|      |      | T→FT'|      |      |
    | T'  |      | T'→ε | T'→*FT' |    | T'→ε | T'→ε |
    | F   | F→id |      |      | F→(E) |     |      |
- **LL(1)文法的判断**
  - 一个文法是LL(1)的，当且仅当对于每个非终结符A的任意两个不同产生式A→α和A→β，满足：
    1. FIRST(α)∩FIRST(β) = ∅
    2. 若β⇒*ε，则FIRST(α)∩FOLLOW(A) = ∅

#### 视频4.4.1 递归子程序的原理
- **递归子程序的设计原理详解**
  - 每个非终结符对应一个递归子程序
  - 子程序的结构反映产生式的结构
  - 子程序的功能是识别该非终结符产生的串
- **递归子程序的实现详解**
  - 对于产生式A→X1X2...Xn：
    - 依次调用每个Xi对应的子程序
  - 对于产生式A→α1 | α2 | ... | αn：
    - 根据当前输入符号选择合适的产生式
  - 需要先消除左递归和提取左公因子
- **递归子程序的优缺点**
  - 优点：简单、直观、易于理解和实现
  - 缺点：效率较低、对文法有要求、左递归会导致栈溢出

#### 视频4.4.2 递归下降分析程序构造
- **递归下降分析器的实现**
  - 编写词法分析器或使用已有的词法分析器
  - 消除左递归和提取左公因子
  - 为每个非终结符编写递归子程序
  - 编写主程序
- **递归下降分析器的例子**：
  ```c
  void E() {
      T();
      Eprime();
  }
  
  void Eprime() {
      if (lookahead == '+') {
          match('+');
          T();
          Eprime();
      }
      // else do nothing (epsilon)
  }
  
  void T() {
      F();
      Tprime();
  }
  
  void Tprime() {
      if (lookahead == '*') {
          match('*');
          F();
          Tprime();
      }
      // else do nothing (epsilon)
  }
  
  void F() {
      if (lookahead == '(') {
          match('(');
          E();
          match(')');
      } else if (lookahead == ID) {
          match(ID);
      } else {
          error();
      }
  }
  
  void match(int t) {
      if (lookahead == t) {
          lookahead = nextToken();
      } else {
          error();
      }
  }
  ```
- **递归下降分析器的测试**
  - 测试各种合法输入
  - 测试各种错误输入
  - 检查错误处理
- **递归下降分析器的优化**
  - 优化子程序的实现
  - 减少递归调用的开销
  - 改进错误恢复

#### 视频5.1.1 自下而上分析方法的基本思想
- **自下而上分析的基本概念详解**
  - 从输入串出发，逐步进行归约
  - 目标是归约到开始符号
  - 每一步归约都将句柄替换为对应的非终结符
- **移进-归约分析详解**
  - 使用一个符号栈
  - 四种动作：
    - 移进（Shift）：将下一个输入符号移进栈
    - 归约（Reduce）：将栈顶的句柄归约为非终结符
    - 接受（Accept）：分析成功
    - 报错（Error）：发现语法错误
  - 移进-归约分析的关键问题：
    - 何时移进
    - 何时归约
    - 选择哪个产生式归约
- **自下而上分析的特点**
  - 可以处理更多类别的文法
  - 通常比自顶向下分析更高效
  - 实现较复杂

#### 视频5.1.2 分析树与规范规约
- **规范归约的定义详解**
  - 最右推导的逆过程
  - 每次归约都是归约当前句型的句柄
- **句柄的概念详解**
  - 句型的最左直接短语
  - 规范归约中每次归约的对象
  - 直接短语：某棵子树的叶节点从左到右排列
  - 句柄：最左的直接短语
  - 例子：
    - 句型：E+T*F
    - 短语：E+T*F, T*F, E, T, F
    - 直接短语：E, T*F
    - 句柄：E
- **规范归约的过程详解**
  - 从输入串出发
  - 每次归约句柄
  - 最终归约到开始符号

#### 视频5.1.3 符号栈的使用
- **符号栈在自下而上分析中的作用**
  - 保存已分析的部分
  - 帮助识别句柄
  - 实现移进-归约操作
- **符号栈的操作**
  - 压入（Push）
  - 弹出（Pop）
  - 查看栈顶
- **符号栈的实现**
  - 可以用数组或链表实现
  - 需要记录每个符号的状态信息

#### 视频5.2.1 算符优先文法
- **算符优先文法的定义详解**
  - 没有相邻的非终结符
  - 对于任意两个终结符a和b，至多只有一种优先关系（&lt;·、=·、·&gt;）
- **优先关系表的构造详解**
  - FIRSTVT集：非终结符A的最左终结符集合
  - LASTVT集：非终结符A的最右终结符集合
  - 构造优先关系：
    - 若有产生式A→...ab...或A→...aBb...，则a =· b
    - 若有产生式A→...aB...，且b∈FIRSTVT(B)，则a &lt;· b
    - 若有产生式A→...Bb...，且a∈LASTVT(B)，则a ·&gt; b
- **算符优先分析的特点**
  - 简单高效
  - 只分析终结符之间的优先关系
  - 不适合分析所有的文法

#### 视频5.2.2 优先表构造
- **FIRSTVT集和LASTVT集的定义和计算（规则1和规则2、迭代算法）**
  - **FIRSTVT集**：
    - 规则1：若有产生式P→a... 或 P→Qa...，则a ∈ FIRSTVT(P)
    - 规则2：若有产生式P→Q...，且a ∈ FIRSTVT(Q)，则a ∈ FIRSTVT(P)
    - 迭代算法：反复应用规则直到没有变化
  - **LASTVT集**：
    - 规则1：若有产生式P→...a 或 P→...aQ，则a ∈ LASTVT(P)
    - 规则2：若有产生式P→...Q，且a ∈ LASTVT(Q)，则a ∈ LASTVT(P)
  - **用关系矩阵计算FIRSTVT/LASTVT**：
    - 使用布尔矩阵表示关系
    - 初始化：对每个产生式P→a...或P→Qa...，置M[P,a] = true
    - 迭代：对每个产生式P→Q...，如果M[Q,a] = true，则置M[P,a] = true
- **优先关系的构造规则（≖、≺、≻）**
  - ≖关系：若有产生式P→...aQb...或P→...ab...，则a ≖ b
  - ≺关系：若有产生式P→...aQ...，则对任意b ∈ FIRSTVT(Q)，有a ≺ b
  - ≻关系：若有产生式P→...Qb...，则对任意a ∈ LASTVT(Q)，有a ≻ b

#### 视频5.2.3 算符优先分析算法
- **素短语和最左素短语的定义**
  - 素短语：至少包含一个终结符，且不再包含其他素短语的短语
  - 最左素短语：最左边的素短语
  - 注意：算符优先分析归约的是最左素短语，而不是句柄
- **算符优先分析算法详细步骤**
  1. 初始化栈为#
  2. 重复直到接受或报错：
     a. 找到栈中最右边的终结符a
     b. 比较a和当前输入b的优先关系
     c. 若a ≺ b或a ≖ b，则移进b
     d. 若a ≻ b，则找到最左素短语并归约
     e. 若栈底是#且输入是#，则接受
- **完整示例（id * id + id）**
  - 输入：id * id + id
  - 分析过程：详细的移进-归约步骤
- **错误恢复策略**
  - 紧急方式恢复：跳过输入符号直到找到同步符号
  - 短语级恢复：插入或删除符号进行局部修正

#### 视频5.2.4 优先函数
- **优先函数的构造方法（Floyd方法）**
  - 对于每个终结符a，构造两个函数f(a)和g(a)
  - 若a ≺ b，则f(a) &lt; g(b)
  - 若a ≖ b，则f(a) = g(b)
  - 若a ≻ b，则f(a) &gt; g(b)
- **优先函数 vs 优先表**
  - 优先函数节省空间
  - 但可能丢失某些信息

#### 视频5.3.1 LR分析器
- **LR分析器的基本结构（ACTION表、GOTO表、分析栈）**
  - ACTION表：[状态, 终结符] → 动作（移进、归约、接受、报错）
  - GOTO表：[状态, 非终结符] → 下一状态
  - 分析栈：存放（状态, 符号）对
- **LR分析的特点**
  - 能处理大多数上下文无关文法
  - 效率高
  - 有强大的自动生成工具（YACC/Bison）

#### 视频5.3.2 LR分析过程
- **LR分析的移进-归约过程**
  - 根据当前状态和输入符号查ACTION表
  - 执行相应动作（移进、归约、接受）
  - 归约后查GOTO表确定下一状态
- **ACTION/GOTO表的使用**

#### 视频5.3.3 构造识别活前缀的DFA
- **活前缀的定义**
  - 活前缀：规范前缀的前缀，不包含句柄右边的任何符号
  - 意义：活前缀是可以出现在分析栈中的符号串
- **LR(0)项目的定义和分类（移进、待约、归约、接受）**
  - 移进项目：A → α·aβ
  - 待约项目：A → α·Bβ
  - 归约项目：A → α·
  - 接受项目：S' → S·
- **项目集的闭包（CLOSURE）**
  - 如果A → α·Bβ在闭包中，则所有B→·γ也加入闭包
- **GO函数**
  - GO(I, X) = CLOSURE({A→αX·β | A→α·Xβ ∈ I})
- **项目集规范族的构造（完整示例：S0到S11）**
  - 从初始项目集S0 = CLOSURE({S'→·S})开始
  - 对每个项目集I和每个符号X，计算GO(I, X)
  - 重复直到没有新项目集产生

#### 视频5.3.4 LR(0)项目集规范族构造
- **LR(0)项目集规范族的构造算法**

#### 视频5.3.5 由DFA构造LR(0)分析表
- **LR(0)分析表的构建算法**
  - 对于每个项目集I和每个终结符a：
    - 若A→α·aβ ∈ I，则ACTION[I,a] = 移进J，其中J=GO(I,a)
    - 若A→α· ∈ I且A≠S'，则ACTION[I,a] = 归约A→α（对所有a）
    - 若S'→S· ∈ I，则ACTION[I,#] = 接受
  - 对于每个项目集I和每个非终结符A：
    - 若J=GO(I,A)，则GOTO[I,A] = J
- **LR(0)冲突（移进-归约、归约-归约）**

#### 视频5.3.6 SLR(1)分析法的思想
- **SLR(1)分析的改进（使用FOLLOW集解决冲突）**
  - 对于归约项目A→α·，只对a ∈ FOLLOW(A)进行归约

#### 视频5.3.7 SLR(1)分析表的构造
- **SLR(1)分析表的构建算法**

#### 视频5.3.8 二义文法的使用
- **二义文法在LR分析中的应用（使用优先级和结合性规则）**

#### compiler-book-slides新增章节
- **第4章 语法制导翻译**
  - 属性文法的定义
  - 综合属性和继承属性
  - S-属性文法和L-属性文法
  - 依赖图
  - 拓扑排序（Kahn算法）
  - SDT（语法制导翻译）方案
  - 中间代码生成（三地址码）
- **第5章 语义分析**
  - 语义分析的任务（类型检查、标识符检查、流程控制检查、唯一性检查）
  - 符号表管理（栈式符号表、作用域处理）
  - 类型检查（类型系统、类型表达式、类型等价：名字等价vs结构等价）
  - 类型转换（隐式转换：C语言类型提升规则、显式转换）
  - 控制流检查
  - 唯一性检查
- **第6章 代码生成**
  - 目标代码生成
  - 寄存器分配
  - 指令选择
- **第7章 中间表示**
  - 中间表示的作用（机器无关、优化便利、模块化）
  - 中间表示的种类（高级IR：AST；低级IR：汇编；三地址码）
  - 三地址码的形式和类型（赋值、跳转、过程调用、索引和地址）
  - 三地址码示例（阶乘、数组求和）
  - 四元式、三元式、间接三元式
  - 抽象语法树（AST）
  - 有向无环图（DAG）用于公共子表达式消除和常量折叠
- **第8章 代码优化**
  - 代码优化的原则
  - 局部优化
  - 循环优化
  - 全局优化
- **第9章 运行时**
  - 运行时环境
  - 存储分配（静态、栈式、堆式）
  - 活动记录
  - 参数传递
- **第10章 课程实验**
  - 实验指导
  - 编译器前端实现

## 二、学习重点分析

### 核心技能
- 理解编译过程的各个阶段
- 掌握文法分析和语法分析方法（LL(1)、LR分析）
- 理解语法制导翻译原理和属性文法
- 掌握中间代码生成（三地址码）
- 理解语义分析（类型检查、符号表管理）

### 学习建议
- 结合Flex/Bison工具实践词法语法分析器
- 重点掌握递归下降分析和LR分析算法
- 完成简单编译器前端实现
- 多做算符优先分析和LR分析的练习题

## 三、学习资源推荐

### 在线资源
- 《编译原理》龙书、虎书、《编译原理及实践》
- Flex/Bison官方文档

### 工具推荐
- Flex、Bison、ANTLR

## 四、笔记结构说明

本学习资料包含两部分笔记：
1. **总体笔记**：即本文件，提供编译原理的总体学习指导和知识点概览
2. **细分到每个课件的笔记**：编译原理笔记文件夹下有对应每个PPT/视频的详细笔记，包含：
   - 详细的知识点解析
   - 算法步骤和示例
   - 代码示例
   - 练习题和解答

---

## 五、速记宝典（口诀 + 对比表 + 算法速查）

> 以下内容专门帮助记忆和理解，用最少的字记住最多的知识点。

---

### 5.1 编译过程五阶段速记

**口诀**：「**词 语 义 中 目**」— 词语译中目（记成"词语翻译成中间目标"）

| 序号 | 阶段 | 输入 → 输出 | 一句话 |
|:--:|------|------------|--------|
| 1 | **词**法分析 | 字符流 → Token序列 | 把字符切分成单词 |
| 2 | **语**法分析 | Token序列 → 语法树AST | 检查单词排列对不对 |
| 3 | **语**义分析 | 语法树 → 带类型的语法树 | 检查意思对不对（类型） |
| 4 | **中**间代码生成 | 语法树 → 三地址码/四元式 | 翻译成通用中间语言 |
| 5 | **目**标代码生成 | 中间代码 → 机器码/汇编 | 翻译成机器能跑的语言 |

**前端 vs 后端记忆**：
- **前端** = 词法 + 语法 + 语义 + 中间代码（依赖源语言，不依赖目标机器）
- **后端** = 代码优化 + 目标代码生成（依赖目标机器，不依赖源语言）
- 记忆：**"前管来，后管去"** — 前端管源语言长什么样，后端管目标机器长什么样

**编译器 vs 解释器速记**：

| | 编译器 | 解释器 | 混合型(JVM) |
|---|---|---|---|
| 流程 | 源→目标→运行 | 源→逐句运行 | 源→字节码→解释 |
| 速度 | 快 | 慢 | 中等 |
| 调试 | 不方便 | 方便 | 中等 |
| 代表 | C, C++, Go | Python, JS, Ruby | Java, C# |
| 记忆 | **"先翻译再念"** | **"边念边翻译"** | **"先翻译成世界语再念"** |

---

### 5.2 Chomsky四级文法分类速记

**口诀**：「**零一上下，二无上下，三左右线**」

| 级别 | 名称 | 产生式限制 | 对应自动机 | 用途 | 速记 |
|:--:|------|----------|-----------|------|------|
| 0型 | 短语文法 | 无限制 α→β | 图灵机 | 最强 | **啥都能写** |
| 1型 | 上下文有关 | αAβ→αγβ (γ非空) | 线性有界自动机 | 自然语言 | **A看左右才能变** |
| 2型 | 上下文无关 | A→β (左边单NT) | 下推自动机 | **程序语法** | **A随便变，不看左右** |
| 3型 | 正则文法 | A→aB 或 A→a (右线性) | 有限自动机 | **词法** | **一条线往右走** |

**快速判断方法**：
- 产生式左边有多个符号 → **0型**
- 产生式左边有上下文（带α、β夹着A） → **1型**
- 产生式左边只有一个非终结符 → **2型**
- 产生式右边至多一个非终结符且在最左或最右 → **3型**

**能力递减口诀**：**"0 > 1 > 2 > 3，越往后越简单越好实现"**

---

### 5.3 正规式 / NFA / DFA 三角关系速记

**核心口诀**：「**正→N→D→小**」

```
正规式 ──Thompson构造──→ NFA
NFA    ──子集构造法───→ DFA
DFA    ──Hopcroft算法─→ 最小化DFA
DFA    ──状态消去法───→ 正规式
```

| 概念 | 特点 | 一句话 |
|------|------|--------|
| 正规式 | 描述字符串模式的表达式 | 像正则表达式 |
| NFA | 可以有多个后继 / ε转移 | **"不确定走哪条"** |
| DFA | 每个状态对每个输入唯一转移 | **"确定唯一的路"** |

**DFA五元组记忆**：`(Q, Σ, δ, q0, F)`
- **Q**ueue（状态队列/集合）
- **Σ**ymbol（符号表）
- **δ**elta（转移函数）— δ读作"delta"，像桥
- **q0**（起点）
- **F**inal（终点集合）

**子集构造法核心**：ε-closure(move(T, a))
- 先算能走到哪（move）
- 再算ε能漂到哪（closure）

---

### 5.4 文法相关核心概念速记

**推导 vs 归约**：
- **推导**：从开始符号 → 句子（自顶向下，展开）
- **归约**：从句子 → 开始符号（自底向上，压缩）
- 记忆：**"推导是展开，归约是压缩"**

**最左推导 vs 最右推导**：
- 最左推导：每次都替换最左边的非终结符（对应自顶向下）
- 最右推导 = 规范推导：每次都替换最右边的非终结符（逆过程=规范归约）

**句型 vs 句子**：
- **句型**：可能含有非终结符的中间产物
- **句子**：全是终结符的成品
- 记忆：**"句子是纯的，句型可能有杂质"**

**短语、直接短语、句柄**：
```
短语：某棵子树的叶子从左到右连起来
直接短语：只有一层的子树（父→子直接相连）
句柄：最左边的直接短语（归约时最先处理）
```
- 记忆：**"短语=子树叶子，直接短语=一层子树叶子，句柄=最左直接短语"**

**二义性文法速记**：
- 定义：同一个句子有两棵不同的语法树
- 危害：语法分析不确定，语义可能不同
- 消除方法：**"引优先级，定结合性，分层非终结符"**
  - 优先级：`expr → expr + term | term`（+比*低一层）
  - 结合性：左结合→左递归 `E→E+T`，右结合→右递归 `E→T=E`
- 经典例子：`id+id*id` 在没有优先级的文法中有两棵树

---

### 5.5 FIRST集 & FOLLOW集 & LL(1)分析表 算法速查

**FIRST(α) — 首符号集合**
```
算法：
1. 如果X是终结符 → FIRST(X) = {X}
2. 如果X→ε → ε加入FIRST(X)
3. 如果X→Y1Y2...Yk：
   - 把FIRST(Y1)-{ε}加入
   - 如果Y1能推出ε，把FIRST(Y2)-{ε}加入
   - 以此类推...
   - 全部能推出ε → ε也加入
```

**FOLLOW(A) — 后跟符号集合**
```
算法：
1. # 加入FOLLOW(开始符号)
2. 如果 B→αAβ → FIRST(β)-{ε} 加入FOLLOW(A)
3. 如果 B→αA 或 (B→αAβ且β能推出ε) → FOLLOW(B)加入FOLLOW(A)
```

**记忆口诀**：
- FIRST：**"自己能推啥就放啥，能推空就看下一个"**
- FOLLOW：**"右边紧跟我的是啥，没有就跟大哥走"**

**LL(1)分析表构造**：
```
对每个产生式 A→α：
  对每个 a∈FIRST(α)：  M[A,a] = A→α
  如果 ε∈FIRST(α)：   对每个 b∈FOLLOW(A)：M[A,b] = A→α
```

**LL(1)文法判定条件**（两个不相交）：
1. `FIRST(α) ∩ FIRST(β) = ∅`（不同产生式的FIRST不冲突）
2. 如果β能推出ε，则 `FIRST(α) ∩ FOLLOW(A) = ∅`（FIRST和FOLLOW不冲突）

**LL(1)含义记忆**：
- **L** ← Left to right（从左到右扫描）
- **L** ← Leftmost derivation（最左推导）
- **1** ← 1 lookahead（向前看1个符号）

---

### 5.6 自顶向下 vs 自底向上分析对比

| 对比项 | 自顶向下（LL系列） | 自底向上（LR/算符优先） |
|--------|-------------------|------------------------|
| 方向 | 从开始符号→句子 | 从句子→开始符号 |
| 操作 | 推导（展开） | 归约（压缩） |
| 关键问题 | 选哪个产生式展开 | 何时移进、何时归约 |
| 对文法的要求 | 无左递归、无回溯 | 无移进-归约冲突 |
| 代表性方法 | 递归下降、LL(1) | 算符优先、LR(0)、SLR(1)、LR(1)、LALR(1) |
| 实现难度 | 简单（手写容易） | 复杂（通常用工具） |
| 处理能力 | 较弱 | 更强 |
| 记忆 | **"站在山顶往下走"** | **"站在山脚往上爬"** |

**LL(1) vs LR(0) vs SLR(1) vs LR(1) vs LALR(1) 能力排序**：
```
LL(1) < LR(0) < SLR(1) < LALR(1) < LR(1)
越往右能力越强，代价越高
```

---

### 5.7 移进-归约分析 & 算符优先分析速记

**移进-归约四种动作**：
| 动作 | 含义 | 触发条件 |
|------|------|---------|
| Shift（移进） | 输入符号进栈 | 还没形成句柄 |
| Reduce（归约） | 栈顶句柄→非终结符 | 发现句柄 |
| Accept（接受） | 分析成功 | 栈底#+输入#，归约到开始符号 |
| Error（报错） | 语法错误 | 查表为空 |

**算符优先关系（三个符号）**：
- `a ≖ b`：a和b同级（同一产生式中相邻或隔一个NT）
- `a ⋖ b`：a优先级低于b（a后面跟的NT的FIRSTVT含b）
- `a ⋗ b`：a优先级高于b（b前面的NT的LASTVT含a）

**记忆**：
- `≖` = 同级（等于号的样子）
- `⋖` = a小于b（尖角指向小的那边）
- `⋗` = a大于b（尖角指向小的那边）

**FIRSTVT/LASTVT计算口诀**：
- FIRSTVT：**"看产生式右边，左边第一个终结符就是"**
- LASTVT：**"看产生式右边，右边最后一个终结符就是"**

**算符优先 vs LR分析的归约对象**：
- 算符优先归约的是 **最左素短语**（至少含一个终结符）
- LR分析归约的是 **句柄**
- 记忆：**"算符优先只看终结符，LR全都要看"**

---

### 5.8 LR分析全系列速记

**LR分析器结构**：`(ACTION表, GOTO表, 分析栈)`
- ACTION[状态, 终结符] → 动作
- GOTO[状态, 非终结符] → 新状态
- 分析栈存放 (状态, 符号) 对

**LR(0)项目分类速记**：

| 项目类型 | 形式 | 含义 | 速记 |
|---------|------|------|------|
| 移进项目 | A→α·aβ | 期待读入终结符a | **"点在终结符前"** |
| 待约项目 | A→α·Bβ | 期待归约非终结符B | **"点在非终结符前"** |
| 归约项目 | A→α· | 已经读完，可以归约 | **"点在最右边"** |
| 接受项目 | S'→S· | 分析成功 | **"扩展开始符号+点最右"** |

**LR各变体解决什么问题**：
| 方法 | 核心改进 | 一句话 |
|------|---------|--------|
| LR(0) | 无前瞻，只看栈内 | 最原始，容易冲突 |
| SLR(1) | 用FOLLOW集限制归约 | **"归约时看一眼FOLLOW"** |
| LR(1) | 每个项目带前瞻符 | 最强大，状态最多 |
| LALR(1) | LR(1)同心项目集合并 | **"LR(1)的能力，SLR的规模"** |

**LR冲突类型**：
- **移进-归约冲突**：同一个状态下，既可以移进也可以归约
- **归约-归约冲突**：同一个状态下，有多个产生式可以归约
- 记忆：**"移进和归约打架，归约之间打架"**

**活前缀**：可以出现在分析栈中而不含句柄右边符号的前缀
- 记忆：**"活的=还没死，句柄还没完全暴露"**

---

### 5.9 语法制导翻译（SDT）速记

**属性文法核心概念**：

| 属性类型 | 流向 | 计算方式 | 记忆 |
|---------|------|---------|------|
| 综合属性 | 子→父（↑） | 由子节点属性计算 | **"子传父，往上走"** |
| 继承属性 | 父→子 / 兄弟→兄弟（↓/→） | 由父节点或兄弟节点属性计算 | **"父传子，往下/右走"** |

**S-属性文法 vs L-属性文法**：
| | S-属性 | L-属性 |
|---|--------|--------|
| 属性类型 | 只有综合属性 | 综合+继承（继承有约束） |
| 适合 | 自底向上（LR） | 自顶向下（LL） |
| 约束 | 无特殊约束 | 继承属性只能依赖左边兄弟 |
| 记忆 | **"S=综合=synthetic"** | **"L=左=左边信息"** |

**依赖图 & 拓扑排序**：
- 如果属性之间有依赖（b依赖a），拓扑排序给出合法的计算顺序
- Kahn算法：每次选入度为0的节点

---

### 5.10 语义分析速记

**语义分析四大任务口诀**：「**类标流唯**」

| 检查项 | 内容 | 例子 |
|--------|------|------|
| **类**型检查 | 操作数类型是否匹配 | `int a = "hello"` → 报错 |
| **标**识符检查 | 变量/函数是否已声明 | 未声明的变量 → 报错 |
| **流**程控制检查 | break是否在循环内 | switch外break → 报错 |
| **唯**一性检查 | 同一作用域内不能重复定义 | 同函数内重复声明 |

**类型等价两种判断**：
| | 名字等价 | 结构等价 |
|---|---------|---------|
| 判断依据 | 类型名称相同 | 类型结构相同 |
| `type a = int; type b = int` | a≠b（名字不同） | a=b（都是int结构） |
| 记忆 | **"看名字"** | **"看内在"** |

**符号表管理**：栈式符号表→进入作用域push一层，离开作用域pop一层

---

### 5.11 中间代码速记

**三地址码形式**：最多三个地址（两个操作数 + 一个结果）
```
x = y op z    （双目运算）
x = op y      （单目运算）
goto L        （无条件跳转）
if x goto L   （条件跳转）
```

**四元式 / 三元式 / 间接三元式对比**：
| | 四元式 | 三元式 | 间接三元式 |
|---|--------|--------|-----------|
| 格式 | (op, arg1, arg2, result) | (op, arg1, arg2) | 三元式+间接索引表 |
| 临时变量 | 显式命名 | 用序号隐含 | 等同于三元式 |
| 优化时移动 | 方便（有名） | 困难（序号会变） | 方便（改索引表） |
| 记忆 | **"四个字段显式结果"** | **"三个字段序号代替"** | **"三元式+目录"** |

---

### 5.12 代码优化速记

**优化三个级别**：
| 级别 | 范围 | 技术举例 |
|------|------|---------|
| 局部优化 | 基本块内 | 常量折叠、公共子表达式消除、死代码消除 |
| 循环优化 | 循环体内 | 代码外提、强度削弱、归纳变量消除 |
| 全局优化 | 跨基本块 | 全局公共子表达式、数据流分析 |

**记忆口诀**：
- 局部优化：**"块内动手脚"**
- 循环优化：**"把不变的东西挪出去"**（最核心思想）
- 全局优化：**"放眼整个函数"**

---

### 5.13 运行时环境速记

**三种存储分配方式**：
| 方式 | 时机 | 特点 | 例子 |
|------|------|------|------|
| 静态分配 | 编译时 | 大小固定，效率高 | 全局变量、static变量 |
| 栈式分配 | 运行时（函数调用） | LIFO，自动回收 | 局部变量、函数参数 |
| 堆式分配 | 运行时（任意时刻） | 手动/GC回收，灵活 | malloc/new创建的对象 |

**记忆**：**"静的编译定，栈的调用生，堆的手动管"**

**活动记录（栈帧）内容**：参数、返回地址、局部变量、临时变量
- 记忆：**"参、返、局、临"**

---

### 5.14 终极对比速记表

**词法 vs 语法 vs 语义分析**：
| | 词法分析 | 语法分析 | 语义分析 |
|---|---------|---------|---------|
| 处理对象 | 字符 | Token | 语法树 |
| 用什么描述 | 正规式/DFA/NFA | 上下文无关文法 | 属性文法/类型系统 |
| 检查什么 | 单词拼写 | 句子结构 | 类型和逻辑 |
| 错误例子 | `@var` 非法字符 | `if (x {` 括号不匹配 | `int a = "hello"` |
| 记忆 | **"查字典"** | **"看句式"** | **"懂意思"** |

**LL(1) vs LR(1) 快速对比**：
| | LL(1) | LR(1) |
|---|-------|-------|
| 方向 | 自顶向下 | 自底向上 |
| 推导 | 最左推导 | 最右推导的逆 |
| 关键技术 | FIRST/FOLLOW/预测分析表 | 项目集规范族/DFA |
| 左递归 | 必须消除 | 可以保留 |
| 左公因子 | 必须提取 | 不必须 |
| 手写难度 | 简单 | 困难（一般用工具） |

---

### 5.15 考试高频易错点提醒

1. **最左推导 ≠ 最左归约**：最左推导是自顶向下，最右推导的逆才是规范归约！
2. **句柄是"最左直接短语"**，不是随便哪个短语
3. **算符优先归约的是"最左素短语"**，不是句柄！
4. **FIRST集含ε时，LL(1)分析表才用到FOLLOW**
5. **NFA可以有多个后继和ε转移，DFA不能有**
6. **LR(0)的归约是无条件归约，SLR(1)用FOLLOW限制**
7. **Chomsky分级：0→1→2→3，能力递减，限制递增**
8. **S-属性只有综合属性，L-属性可以有继承属性但有限制**

---

### 5.16 一句话总结各章核心

| 章节 | 一句话核心 |
|------|-----------|
| 编译过程 | 词法→语法→语义→中间→目标，外加表格和错误处理 |
| 文法 | 四元组(VN,VT,P,S)，乔姆斯基分四级，2型管语法3型管词法 |
| 词法分析 | 正规式→NFA→DFA→最小化DFA，就是识别单词的自动机 |
| 语法分析-LL | FIRST + FOLLOW → 预测分析表，无左递归无回溯才能用 |
| 语法分析-LR | 项目集→DFA→ACTION/GOTO表，移进-归约驱动 |
| 语法制导翻译 | 给文法符号加属性，综合往上继承往下 |
| 语义分析 | 类型检查+符号表+作用域，保证程序"说得通" |
| 中间代码 | 三地址码/四元式，承上启下，与机器无关 |
| 代码优化 | 局部→循环→全局，删冗余、提不变的、换便宜的操作 |
| 运行时 | 静态/栈/堆三种存储，栈帧=参数+返回+局部+临时 |