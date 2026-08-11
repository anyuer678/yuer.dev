---
title: 数据库期末复习：从 ER 图到触发器
date: 2026-06-18
type: learning
tags: [数据库, SQL, 课程笔记]
summary: 数据库课程期末复习笔记：三级结构两级独立性、ER 图设计、关系模式规范化、视图/索引/存储过程/触发器，代码例题基于课程复习材料整理。
---

## 考纲回顾

选择 10 分、简答 25 分、ER 图 + 建表 15 分、范式分解与规范化 15 分、SQL 语句 35 分（关系代数、select、触发器）。下面按这个结构记。

## 数据库设计基础

**三级结构、两级独立性**：

- 外模式（用户视图）→ 模式（逻辑结构）→ 内模式（物理存储）
- 外模式/模式映像 → **逻辑独立性**；模式/内模式映像 → **物理独立性**

**ER 图**：实体（矩形）、属性（椭圆）、联系（菱形，1:1 / 1:N / M:N）。三个世界：现实世界 → 信息世界 → 机器世界。

**关系模型概念**：元组、属性、候选键、主键、外键。**为什么要规范化**：不规范的关系在增、删、改时都会出现异常（插入异常、删除异常、修改复杂、数据冗余）。

## 关系规范化

- 1NF：属性不可再分（原子性）
- 2NF：消除**非主属性对码的部分依赖**
- 3NF：消除非主属性对码的**传递依赖**
- BCNF：消除主属性对码的部分/传递依赖

分解要满足：无损连接 + 保持函数依赖。判断范式 → 找码 → 找依赖 → 分解成 3NF/BCNF。

## SQL 语句

SQL 组成：**DDL**（create/alter/drop）、**DML**（insert/update/delete/select）、**DCL**（grant/revoke）。完整性：实体完整性（主键）、参照完整性（外键）、用户定义完整性（check 约束）。

**关系代数**：选择 σ、投影 π、连接 ⋈、并 ∪、差 −、交 ∩、除 ÷。选择是行筛选，投影是列筛选。

**视图**：

- 视图是虚表，定义后像表一样查询
- 修改视图有限制：含分组/聚合/去重的视图不可更新；可更新视图要求能唯一映射回基表

```sql
create view v_UserInfo as
select CardNo, CardPwd from BankCard where IsLock = 0
```

**索引**：优点——加速查询；缺点——占存储、增删改要维护索引。**簇索引**决定物理存储顺序（每表一个），**非簇索引**是逻辑指针（每表可多个）。主键默认建簇索引。

## 存储过程

带输入输出参数的例子（按时间段统计存取款总额）：

```sql
create proc proc_SelectExchange
    @startTime varchar(20),
    @endTime varchar(20),
    @SumIn money output,
    @SumOut money output
as
select @SumIn  = sum(MoneyInBank)  from CardExchange
             where ExchangeTime between @startTime+' 00:00:00' and @endTime+' 23:59:59'
select @SumOut = sum(MoneyOutBank) from CardExchange
             where ExchangeTime between @startTime+' 00:00:00' and @endTime+' 23:59:59'
go
```

执行：

```sql
declare @SumIn money, @SumOut money
exec proc_SelectExchange '2018-1-1','2018-12-31', @SumIn output, @SumOut output
select @SumIn, @SumOut
```

密码升级（输入输出同参）：传入用户名密码，密码长度不足 8 位自动补齐——用 `while` 循环 + `floor(rand()*10)` 生成随机数字补齐并 update。

## 触发器

`inserted` / `deleted` 两张逻辑表：insert 后可从 `inserted` 查新增行，delete 后可查 `deleted`，update 同时有 `inserted`（新）和 `deleted`（旧）。

**插入联动**：添加员工时部门不存在则自动建部门：

```sql
create trigger tri_InsertPeople on People
after insert
as
declare @departId varchar(20)
set @departId = (select DepartmentId from inserted)
if not exists(select * from Department where DepartmentId = @departId)
    insert into Department(DepartmentId, DepartmentName) values(@departId, '新部门')
go
```

**删除联动**：删部门时连带删该部门所有员工：

```sql
create trigger tri_DeleteDept on Department
after delete
as
delete from People where People.DepartmentId = (select DepartmentId from deleted)
go
```

## 可靠性 / 安全性 / 完整性（简答常考）

- **完整性**：实体/参照/用户定义三类约束 + 触发器
- **安全性**：用户与权限（DCL）、视图隔离、加密
- **可靠性**：事务 ACID + 日志 + 备份恢复 + 并发控制（封锁）
