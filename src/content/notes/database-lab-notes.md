---
title: 数据库系统实验：从建表到触发器
date: 2026-05-14
type: learning
tags: [数据库, 实验, MySQL, SQL, 触发器]
summary: 数据库系统课程四个实验的归纳：建库建表与完整性、数据查询与更新、视图与存储过程、触发器与游标。环境为 Ubuntu 虚拟机里的 MySQL 8.0，全程命令行操作。
---

## 环境与约定

四个实验共用 Ubuntu 20.04 + MySQL 8.0（VMware 虚拟机），数据库名为 `student_xxxxxx`（班级学号），三张核心表：

- **S**（学生）：Sno 学号、Sname 姓名、Ssex 性别、Sage 年龄、sdept 所在系
- **C**（课程）：Cno 课程号、Cname 课程名、Cpno 先行课、ccredit 学分
- **SC**（选课）：Sno、Cno、grade 成绩，主键 (Sno, Cno)

## 实验一：建库建表与完整性

**要点**：CREATE DATABASE 指定字符集；建表时设置主键/外键；ALTER TABLE 增删列；mysqldump 备份还原。

```sql
CREATE DATABASE student_XXXXXXXX DEFAULT CHARACTER SET utf8;
CREATE TABLE S (
  Sno CHAR(10) PRIMARY KEY,
  Sname VARCHAR(20) NOT NULL,
  Ssex CHAR(2),
  Sage TINYINT,
  sdept VARCHAR(30)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
```

三种完整性：**实体完整性**（主键唯一非空）、**参照完整性**（外键指向主键）、**用户自定义完整性**（字段约束）。

**踩坑**：

- Ubuntu 的 MySQL 默认 `auth_socket` 认证，改认证方式后可能登不上 → 改回适配本地终端的模式
- MySQL 8.0 有密码强度组件，简单密码会被拒 → 实验环境临时卸载，生产环境仍应设强密码
- mysqldump 备份文件不含 CREATE DATABASE → 还原前先手动建同名空库再导入

## 实验二：数据查询与更新

**查询**对应关系代数的选择、投影、连接、除运算。印象深的几类：

- 分组统计：`GROUP BY sdept` + `COUNT/AVG` + `ORDER BY` 升/降序
- 每系年龄最大：相关子查询 `WHERE Sage = (SELECT MAX(Sage) FROM S s2 WHERE s2.sdept = s1.sdept)`
- 没选课的学生：`LEFT JOIN ... WHERE SC.Sno IS NULL`
- 选课 >3 门：`GROUP BY Sno HAVING COUNT(*) > 3`
- 所有成绩 ≥80：`NOT EXISTS (SELECT * FROM SC sc2 WHERE sc2.Sno = sc1.Sno AND sc2.grade < 80)`

**更新**：

- 主键重复、外键不存在的插入会被数据库拦截 → 直观感受到完整性约束
- 清空再还原：`DELETE FROM` 三表 → `mysql db < backup.sql`
- 联表更新：`UPDATE SC JOIN S ON ... SET SC.grade = 0 WHERE S.sdept = 'CS'`
- 删除低于平均分的记录：MySQL 不允许子查询直接引用被操作表 → 包一层派生表 `(SELECT AVG(grade) FROM ...) AS t`

**踩坑**：删除数据时 MySQL 不允许子查询直接引用被操作表，用临时表/派生表中转。

## 实验三：视图、完整性与存储过程

**视图**是虚拟表，只存定义不存数据：

- 行列子集视图支持增删改；含聚合、分组、去重的视图不可更新
- 用途：简化查询、屏蔽敏感列、逻辑独立性

```sql
CREATE VIEW V_S_C_G AS
SELECT S.Sno, S.Sname, C.Cno, C.Cname, SC.grade
FROM S JOIN SC ON S.Sno = SC.Sno JOIN C ON SC.Cno = C.Cno;
-- 通过视图插入/修改，观察基础表同步变化
INSERT INTO V_SSCH VALUES ('S12', 'YAN XI', 19, 'SSCH');
UPDATE V_SSCH SET Sname = '中南人' WHERE Sno = 'S12';
```

**完整性控制**：重建带约束的表。外键加 `ON DELETE CASCADE ON UPDATE CASCADE` 实现级联删除/更新——删主表记录时从表选课自动消失，改学号时从表同步更新。CHECK 约束（如 `Sage < 30`、学号范围）违反时直接报错。

**存储过程**：一组预编译 SQL，支持参数。用 `DELIMITER //` 改结束符，`CALL` 调用：

```sql
CREATE PROCEDURE CalculateStudentAvg(IN p_sno CHAR(10), OUT p_avg DECIMAL(5,2))
BEGIN
  SELECT AVG(grade) INTO p_avg FROM SC WHERE Sno = p_sno;
END //
CALL CalculateStudentAvg('20240001', @avg);
```

## 实验四：触发器与游标

**触发器**是事件（INSERT/UPDATE/DELETE）发生时自动执行的存储过程：

- BEFORE：事件前执行，用于数据验证、权限检查
- AFTER：事件后执行，用于审计日志、级联操作
- OLD / NEW：事件前/后的行数据

权限控制示例——只有 dbo 能删学生：

```sql
CREATE TRIGGER trg_s_delete_permission
BEFORE DELETE ON S
FOR EACH ROW
BEGIN
  IF CURRENT_USER() != 'dbo@localhost' AND CURRENT_USER() != 'dbo@%' THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = '权限错误：只有dbo用户可以删除学生表数据';
  END IF;
END //
```

审计日志示例——删除/更新后把 OLD 行写入日志表（student_delete_log / student_update_log）。

**游标**：逐行处理结果集。四步：声明 → 打开 → 遍历 → 关闭。**必须声明 `CONTINUE HANDLER FOR NOT FOUND SET done = 1`**，否则遍历到结果集末尾会抛错。

```sql
DECLARE grade_cursor CURSOR FOR SELECT Sno, Cno, grade FROM SC WHERE grade IS NOT NULL;
DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;
OPEN grade_cursor;
grade_loop: LOOP
  FETCH grade_cursor INTO v_sno, v_cno, v_grade;
  IF done = 1 THEN LEAVE grade_loop; END IF;
  -- 逐行处理
END LOOP;
CLOSE grade_cursor;
```

**踩坑**：MySQL 8.0 的 DEFAULT 子句不支持 `CURRENT_USER()`，要在触发器体内手动插入。

## 小结

四个实验走通了数据库的完整链路：**建模建表 → 查询更新 → 视图/存储过程封装 → 触发器/游标做自动化**。留下的待学项：窗口函数、CTE、索引优化、事务并发控制。
