---
title: "SQL速记"
date: "2025-06"
type: "learning"
tags: [SQL, 数据库, 查询, DDL, DML, 索引]
summary: "SQL核心语法速记，涵盖DDL、DML、DQL、DCL、视图、索引、存储过程、触发器等内容"
---

## DDL（数据定义语言）

| 操作 | 语法 |
|------|------|
| 建库 | `CREATE DATABASE db_name;` |
| 建表 | `CREATE TABLE t (id INT PRIMARY KEY AUTO_INCREMENT, name VARCHAR(50) NOT NULL);` |
| 改表 | `ALTER TABLE t ADD col type;` |
| 删表 | `DROP TABLE t;` |
| 建索引 | `CREATE INDEX idx_name ON t(col);` |

---

## DML（数据操作语言）

| 操作 | 语法 |
|------|------|
| 插入 | `INSERT INTO t(col1,col2) VALUES(v1,v2);` |
| 批量插入 | `INSERT INTO t(col1,col2) VALUES(v1,v2),(v3,v4);` |
| 更新 | `UPDATE t SET col=val WHERE condition;` |
| 删除 | `DELETE FROM t WHERE condition;` |
| 清空 | `TRUNCATE TABLE t;`（不可回滚，重置自增） |

**DELETE vs TRUNCATE vs DROP：**

| 操作 | 回滚 | 自增重置 | 速度 |
|------|------|----------|------|
| DELETE | ✅ | ❌ | 慢（逐行删） |
| TRUNCATE | ❌ | ✅ | 快（释放页） |
| DROP | ❌ | - | 最快（删结构） |

---

## DQL（数据查询语言）

### 基础查询
```sql
SELECT col1, col2 FROM t WHERE condition ORDER BY col LIMIT n;
```

### 聚合函数
```sql
SELECT COUNT(*), SUM(col), AVG(col), MAX(col), MIN(col)
FROM t GROUP BY col HAVING condition;
```

### 多表连接
```sql
-- 内连接
SELECT * FROM t1 INNER JOIN t2 ON t1.id = t2.t1_id;
-- 左连接
SELECT * FROM t1 LEFT JOIN t2 ON t1.id = t2.t1_id;
-- 右连接
SELECT * FROM t1 RIGHT JOIN t2 ON t1.id = t2.t1_id;
```

### 子查询
```sql
-- IN子查询
SELECT * FROM t1 WHERE t1.id IN (SELECT t1_id FROM t2);
-- EXISTS子查询
SELECT * FROM t1 WHERE EXISTS (SELECT 1 FROM t2 WHERE t2.t1_id = t1.id);
```

### 分页
```sql
-- MySQL
SELECT * FROM t LIMIT offset, count;
-- SQL Server
SELECT TOP n * FROM t;
-- Oracle
SELECT * FROM (SELECT t.*, ROWNUM rn FROM t) WHERE rn BETWEEN start AND end;
```

---

## WHERE vs HAVING

| 比较项 | WHERE | HAVING |
|--------|-------|--------|
| 作用对象 | 行 | 分组后的组 |
| 执行时机 | GROUP BY前 | GROUP BY后 |
| 能否用聚合 | ❌ | ✅ |
| 示例 | `WHERE age>18` | `HAVING COUNT(*)>5` |

---

## DCL（数据控制语言）

```sql
-- 授权
GRANT SELECT, INSERT ON db.t TO user@host IDENTIFIED BY 'password';
-- 撤销
REVOKE INSERT ON db.t FROM user@host;
-- 角色
CREATE ROLE 'read_only';
GRANT SELECT ON db.* TO 'read_only';
GRANT 'read_only' TO 'user'@'host';
```

---

## 视图

```sql
-- 创建视图
CREATE VIEW v_name AS SELECT col1, col2 FROM t WHERE condition;
-- 使用视图
SELECT * FROM v_name;
-- 删除视图
DROP VIEW v_name;
```

**视图特点：**
- 虚拟表，不存储数据
- 简化复杂查询
- 提供数据安全性（隐藏敏感列）
- 不支持索引

---

## 存储过程

```sql
DELIMITER //
CREATE PROCEDURE proc_name(IN param1 INT, OUT param2 VARCHAR(50))
BEGIN
    SELECT col INTO param2 FROM t WHERE id = param1;
END //
DELIMITER ;

-- 调用
CALL proc_name(1, @result);
SELECT @result;
```

---

## 触发器

```sql
CREATE TRIGGER trg_name
AFTER INSERT ON t
FOR EACH ROW
BEGIN
    INSERT INTO log(action, time) VALUES('insert', NOW());
END;
```

**触发器类型：**
- BEFORE INSERT / AFTER INSERT
- BEFORE UPDATE / AFTER UPDATE
- BEFORE DELETE / AFTER DELETE

---

## 事务

```sql
START TRANSACTION;
-- 操作
COMMIT;  -- 提交
ROLLBACK; -- 回滚
```

**ACID：**
| 特性 | 含义 |
|------|------|
| 原子性 | 要么全做，要么全不做 |
| 一致性 | 事务前后数据一致 |
| 隔离性 | 并发事务互不干扰 |
| 持久性 | 提交后永久保存 |

---

## 索引类型

| 类型 | 特点 |
|------|------|
| B+树索引 | 默认，有序，支持范围查询 |
| 哈希索引 | 等值查询O(1)，不支持范围 |
| 全文索引 | 文本搜索 |
| 复合索引 | 多列组合，遵循最左前缀原则 |

**最左前缀原则：**
- 索引(a,b,c)，查询条件必须包含a
- 可用：a / a,b / a,b,c
- 不可用：b / b,c / c

---

## 核心对比速查表

| 编号 | A | vs | B | 一句话 |
|------|---|----|---|--------|
| 1 | WHERE | HAVING | 行级过滤 vs 组级过滤 |
| 2 | DELETE | TRUNCATE | 可回滚逐行删 vs 不可回滚清空 |
| 3 | INNER JOIN | LEFT JOIN | 只取交集 vs 左表全取 |
| 4 | IN | EXISTS | 子查询结果集小用IN vs 外表小用EXISTS |

---

**使用建议**：GROUP BY + HAVING + 聚合函数的组合查询是考试大题常客。
