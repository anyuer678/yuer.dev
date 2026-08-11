---
title: ChCore 操作系统实验：启动流程、页表与物理内存管理
date: 2026-06-12
type: learning
tags: [操作系统, 实验, ChCore, ARM64, 页表, 内存管理]
summary: ChCore 操作系统实验归纳：Lab1 多核启动与 AArch64 页表建立，Lab2 buddy 伙伴系统与 slab 分配器实现，含主从核区分、块分裂合并的代码逻辑。
---

## 实验背景

ChCore 是上海交大开源的教学操作系统，实验在 QEMU 模拟的 AArch64 上跑。两个 Lab 分别对应"把内核跑起来"和"内存怎么分配"。

## Lab1：多核启动与页表

### 多核启动（思考题 1）

QEMU 会并发启动 4 个核，都从 `_start` 执行。start.S 开头通过读 **mpidr_el1** 区分主核与从核：

- 用 MPIDR（CPU 核唯一标识）区分主从核
- **标志位自旋等待**实现"主核先跑、从核待命"——从核自旋等主核初始化完内核再放行

### 为什么必须设栈（思考题 4）

C 语言运行依赖栈：函数调用要保存返回地址（x30）、帧指针（x29），局部变量也放栈里；ARM64 要求栈 16 字节对齐。

不设栈的后果：

- sp 是随机值，可能指向不可写内存（内核代码段）或其他核的内存
- 执行 `bl init_c` 跳进 C 函数时，函数开头就往栈写数据 → 立即 **Data Abort** 崩溃
- 多核共享错误栈地址会互相覆盖（内存踩踏）

**关键设计：每个核都要有独立启动栈**。

### AArch64 页表（思考题 8/9）

采用多级页表（4KB granule，每级 512 项，L0→L3）的原因：

- 只为用到的地址区间分配下级页表，稀疏空间省内存
- 支持更大虚拟地址空间
- 支持块映射（2MB/1GB）减少 TLB 压力
- 缺点：TLB miss 时多级遍历更慢、实现复杂

映射 0~4GB 的内存开销对比：

| 粒度 | 页表内存 | 页表页数 |
|---|---|---|
| 4KB（走 L3） | 约 8.02MB | 2054 个 |
| 2MB（L2 block） | 约 24KB | 6 个 |

**块映射省 300 多倍页表内存**。

低 1GB 用 2MB block 映射时：L0 1 条、L1 2 条（1 个 table + 1 个 block）、L2 512 条，总共 3 页 = 12KB。

### 设备内存映射（练习题 10）

外设区用 2MB block 直接映射（`va = pa`），并设 `DEVICE_MEMORY` 属性（不可缓存、不可推测执行）：

```c
for (vaddr = PERIPHERAL_BASE; vaddr < PHYSMEM_END; vaddr += SIZE_2M) {
    boot_ttbr0_l2[GET_L2_INDEX(vaddr)] = vaddr | UXN | ACCESSED | NG
                                       | DEVICE_MEMORY | IS_VALID;
}
```

## Lab2：buddy 伙伴系统 + slab

### 伙伴系统（练习题 1）

核心三函数：`split_chunk`（分裂）、`merge_chunk`（合并）、`buddy_get_pages/free_pages`（分配/释放）。

**分裂**：申请 order=0 但只有 order=3 的空闲块时，递归把 buddy 拆半挂到低一级 free list：

```c
high_order--;
chunk->order = high_order;
buddy_chunk = get_buddy_chunk(pool, chunk);   // 找到兄弟块
buddy_chunk->order = high_order;
buddy_chunk->allocated = 0;
list_add(&buddy_chunk->node, free_list);      // 兄弟块挂到低阶链表
return split_chunk(pool, order, chunk);       // 递归继续拆
```

**合并**：释放时检查 buddy 是否空闲且同阶，是则合并升阶继续向上合并：

```c
if (buddy_chunk->allocated == 1) return chunk;        // buddy 占用则停
if (buddy_chunk->order != chunk->order) return chunk; // 不同阶则停
buddy_chunk->order += 1; chunk->order += 1;
if (chunk > buddy_chunk) chunk = buddy_chunk;         // 地址小的做新块头
return merge_chunk(pool, chunk);                      // 递归向上合并
```

**分配**：从 order 开始往高阶找第一个非空 free list，取块，若阶高于需求则分裂，标记 allocated：

```c
for (cur_order = order; cur_order < BUDDY_MAX_ORDER; cur_order++) {
    if (list_empty(&pool->free_lists[cur_order].free_list)) continue;
    page = list_entry(free_list->next, struct page, node);
    list_del(&page->node);
    if (cur_order > order) page = split_chunk(pool, order, page);
    page->allocated = 1;
    break;
}
```

### slab（练习题 2）

slab 解决小对象分配（几字节到几 KB）——按对象大小分 slab，避免每分配一个对象就找 buddy：

- `choose_new_current_slab`：从 partial 链表取一块做 current_slab，空了置 NULL
- 分配路径：current_slab 有空闲对象 → 直接取；没有 → 从 partial/full 链表换；都没有 → 向 buddy 申请新 slab
- **内核对象分配是"先走 slab 快速路径，不够再下钻 buddy"**，两种机制分层配合

## 收获

- 多核启动的"自旋等待 + 标志位"模式、页表"先 identity map 再建内核映射"的时序
- buddy 的合并条件（buddy 空闲 + 同阶 + 地址相邻）和递归分裂，代码很短但边界条件多
- 深刻理解了"为什么内核要自己管内存"：用户态 malloc 背后是内核 buddy/slab 在支撑
