---
title: 数据结构实验：用线性表实现多项式加法
date: 2025-04-14
type: learning
tags: [数据结构, 实验, 线性表, C++]
summary: 数据结构实验归纳：用顺序表与链表两种方式实现一元多项式加法，涉及插入删除查找、同指数合并、按降幂排列。从 bug 中理解指针与内存管理。
---

## 实验任务

实现一元 n 次多项式的加法：输入各项（系数为浮点、指数为整型），输出合并同类项后的多项式。用**顺序表**和**链表**两种方式各做一遍。

## 顺序表实现

- 结构体 `PolynomialTerm { double coefficient; int exponent; }`
- 插入：找到位置后从尾部开始整体后移
- 删除：找到目标后向前覆盖
- 多项式加法：两个数组按指数降序遍历，指数大的先放入结果；指数相等则系数相加、指数不变

```cpp
bool insert(int pos, const PolynomialTerm& term) {
    if (pos < 0 || pos > (int)data.size()) return false;
    data.insert(data.begin() + pos, term);
    return true;
}
```

## 链表实现

用 `PolynomialNode` 存系数、指数、指针，`PolynomialList` 管理头结点：

- **插入**：按指数降序找位置，同指数合并系数，系数为 0 删节点
- **删除**：遍历找目标指数节点，删除并释放内存
- **查找**：返回节点指针，找不到返回 nullptr
- **显示**：处理指数 0 或 1 的特殊格式（`5`、`3x` 而非 `5x^0`、`3x^1`）
- **析构函数**：释放链表内存，防止内存泄漏

```cpp
PolynomialTerm* find(int exp) {
    auto it = find_if(data.begin(), data.end(),
        [exp](const PolynomialTerm& t) { return t.exponent == exp; });
    return it != data.end() ? &(*it) : nullptr;
}
```

## 加法合并逻辑（核心）

两个降幂排列的多项式相加：

1. 比较两个当前项指数，大的先入结果
2. 指数相等 → 系数相加，指数不变
3. 一个链表遍历完 → 剩余项整体追加

这样一趟 O(m+n) 完成合并，无需反复插入。

## 收获

- 顺序表 vs 链表：顺序表随机访问快、插入删除要搬移；链表插入删除 O(1)（已知位置）、但访问要遍历
- 链表最容易错的三处：**释放内存、空指针判断、头结点处理**——实验里"错了无数次"，每一次都加深了对指针和内存管理的理解
- 数据结构课还没学完，但"用结构组织数据"的思路已经能在具体问题上应用
