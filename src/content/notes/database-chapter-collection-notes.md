---
title: "数据库系统章节笔记合集（ch1-10）"
date: "2025-06"
type: "learning"
tags: [数据库, 关系代数, SQL, ER模型, 规范化, 索引]
summary: "数据库系统各章详细笔记合集，覆盖绪论、关系代数、关系演算、SQL、ER模型、规范化、数据库设计、索引（共8篇章节笔记合并）"
---

# 数据库系统章节笔记合集（ch1-10）


---

## 章节：数据库系统PPT-ch10- DataBase Index笔记

# 数据库系统PPT-ch10- DataBase Index笔记

## 一、索引的基本概念
### 1.1 什么是索引
- **索引**：是对数据库表中一列或多列的值进行排序的一种结构，使用索引可快速访问数据库表中的特定信息
- **类比**：索引就像书的目录，可以快速找到需要的内容，而不需要逐页查找
- **作用**：
  - 加快数据的查询速度（最主要的作用）
  - 保证数据记录的唯一性
  - 实现表与表之间的参照完整性
  - 在使用ORDER BY和GROUP BY子句进行数据检索时，可以显著减少查询中分组和排序的时间
  - 加速WHERE条件的筛选

### 1.2 索引的优缺点

**优点**：
1. **大大加快数据的检索速度**：这是创建索引的最主要原因
2. **创建唯一性索引，保证数据库表中每一行数据的唯一性**
3. **加速表与表之间的连接**：特别是在实现数据的参考完整性方面特别有意义
4. **在使用分组和排序子句进行数据检索时，可以显著减少查询中分组和排序的时间**
5. **通过使用索引，可以在查询的过程中使用优化隐藏器，提高系统的性能**

**缺点**：
1. **创建索引和维护索引要耗费时间，这种时间随着数据量的增加而增加**
2. **索引需要占物理空间**：除了数据表占数据空间之外，每一个索引还要占一定的物理空间，如果要建立聚簇索引，那么需要的空间就会更大
3. **当对表中的数据进行增加、删除和修改的时候，索引也要动态的维护，这样就降低了数据的维护速度**
4. **过多的索引会占用大量磁盘空间，影响系统性能**

### 1.3 索引的工作原理

没有索引时，数据库会进行全表扫描（Table Scan），逐行检查每一条记录，直到找到符合条件的记录。

有索引时，数据库会先在索引中查找，找到符合条件的记录的物理地址，然后直接到数据文件中读取对应的记录。

**示例**：
- 假设有一个表 `student`，包含 `id`、`name`、`age` 等字段
- 没有索引时，查询 `SELECT * FROM student WHERE name = '张三'` 需要扫描整张表
- 有索引时，在 `name` 字段上建立索引，查询时先在索引中找到 '张三' 对应的记录位置，然后直接读取

## 二、索引的分类
### 2.1 按存储结构分类

1. **聚簇索引（Clustered Index）**
   - **定义**：索引顺序和数据的物理存储顺序相同
   - **特点**：
     - 一个表只能有一个聚簇索引
     - 查询效率高，特别是范围查询
     - 数据行按索引顺序物理存储
     - 插入、删除、更新操作的开销较大，因为需要移动数据
   - **适用场景**：
     - 经常按范围查询的列
     - 经常用于排序的列
   - **示例**：
     ```sql
     -- SQL Server
     CREATE CLUSTERED INDEX idx_student_id ON student(id);
     
     -- MySQL (InnoDB)
     -- InnoDB表的主键默认就是聚簇索引
     ```

2. **非聚簇索引（Non-clustered Index）**
   - **定义**：索引顺序和数据的物理存储顺序不同
   - **特点**：
     - 一个表可以有多个非聚簇索引
     - 需要额外的存储空间
     - 索引中只包含索引字段的值和指向数据行的指针
     - 查询需要两次查找：先找索引，再找数据
   - **适用场景**：
     - 经常用于等值查询的列
     - 需要多个索引的表
   - **示例**：
     ```sql
     -- MySQL
     CREATE INDEX idx_student_name ON student(name);
     ```

### 2.2 按功能分类

1. **普通索引**
   - 最基本的索引，没有任何限制
   - 用于加速查询
   - 可以创建在任何字段上
   - 示例：
     ```sql
     CREATE INDEX idx_student_age ON student(age);
     ```

2. **唯一索引**
   - 索引列的值必须唯一，但允许有空值（NULL）
   - 保证数据的唯一性
   - 可以有多个NULL值（因为NULL不等于NULL）
   - 示例：
     ```sql
     CREATE UNIQUE INDEX idx_student_email ON student(email);
     ```

3. **主键索引**
   - 特殊的唯一索引，不允许有空值
   - 一个表只能有一个主键索引
   - 通常在建表时指定主键
   - 主键索引一般是聚簇索引（取决于数据库）
   - 示例：
     ```sql
     -- 建表时指定主键
     CREATE TABLE student (
         id INT PRIMARY KEY,
         name VARCHAR(50),
         age INT
     );
     
     -- 或单独添加
     ALTER TABLE student ADD PRIMARY KEY (id);
     ```

4. **复合索引（组合索引）**
   - 在多个字段上创建的索引
   - 使用时遵循"最左前缀"原则
   - 可以覆盖多个查询条件
   - 示例：
     ```sql
     CREATE INDEX idx_student_name_age ON student(name, age);
     ```
   - 可以使用的查询：
     - WHERE name = '张三'
     - WHERE name = '张三' AND age = 20
     - WHERE name = '张三' AND age > 18
   - 不能使用的查询：
     - WHERE age = 20（没有name）
     - WHERE age = 20 AND name = '张三'（顺序不对，有些数据库可以，有些不行）

5. **全文索引**
   - 用于全文搜索
   - 支持模糊匹配
   - 适用于大文本字段
   - 示例：
     ```sql
     -- MySQL
     CREATE FULLTEXT INDEX idx_article_content ON article(content);
     
     -- 使用全文索引查询
     SELECT * FROM article WHERE MATCH(content) AGAINST('数据库');
     ```

6. **空间索引**
   - 用于空间数据类型
   - 支持地理位置查询
   - 示例：
     ```sql
     -- MySQL
     CREATE SPATIAL INDEX idx_location_point ON location(point);
     ```

### 2.3 其他分类

1. **前缀索引**
   - 只索引列的前几个字符
   - 节省空间
   - 适用于长字符串列
   - 示例：
     ```sql
     -- 只索引name的前10个字符
     CREATE INDEX idx_student_name_prefix ON student(name(10));
     ```

2. **函数索引（表达式索引）**
   - 索引函数或表达式的结果
   - 适用于需要经常按函数结果查询的场景
   - 示例：
     ```sql
     -- MySQL 5.7+
     CREATE INDEX idx_student_lower_name ON student((LOWER(name)));
     
     -- Oracle
     CREATE INDEX idx_student_lower_name ON student(LOWER(name));
     ```

## 三、索引的数据结构
### 3.1 B树（B-tree）

B树是一种平衡的多路查找树，是数据库索引中常用的数据结构之一。

#### 3.1.1 B树的定义

一棵m阶的B树，满足下列条件：
1. 每个结点最多有m个子结点
2. 除根结点和叶子结点外，每个结点至少有⌈m/2⌉个子结点
3. 根结点如果不是叶子结点，至少有2个子结点
4. 所有叶子结点在同一层
5. 非叶子结点包含k-1个关键字，k个子结点（⌈m/2⌉ ≤ k ≤ m）
6. 关键字按顺序排列

#### 3.1.2 B树的结构示例

```
                              [ 100, 200 ]
                             /    |     \
                            /     |      \
                     [50, 70]  [150]  [250, 300, 350]
                    /  |  \     |      /   |   |   \
                   /   |   \    |     /    |   |    \
               叶子结点  ...   ...   ...   ...  ...  ...
```

#### 3.1.3 B树的特点

1. **平衡树**：所有叶子结点在同一层
2. **多路查找**：每个结点可以有多个关键字和多个子结点
3. **磁盘IO少**：树的高度较低，查找时需要读取的磁盘块少
4. **支持范围查询**：可以方便地进行范围查询

#### 3.1.4 B树的操作

1. **查找**：
   - 从根结点开始
   - 在结点内二分查找关键字
   - 如果找到，返回
   - 如果没找到，根据大小关系进入相应的子结点
   - 重复直到找到或到达叶子结点

2. **插入**：
   - 查找插入位置
   - 如果结点未满，直接插入
   - 如果结点已满，分裂结点
   - 可能需要向上传播分裂

3. **删除**：
   - 查找删除位置
   - 如果是叶子结点，直接删除
   - 如果是非叶子结点，用后继或前驱替换
   - 如果结点关键字数少于下限，需要合并或借位

### 3.2 B+树（B+-tree）

B+树是B树的变体，是目前数据库中最常用的索引数据结构。

#### 3.2.1 B+树的定义

B+树是B树的一种变形树，它与B树的主要区别在于：
1. 所有叶子结点包含全部关键字信息
2. 所有叶子结点按顺序链接
3. 非叶子结点只起索引作用，不存储数据
4. 每个关键字对应一个指向叶子结点的指针

#### 3.2.2 B+树的结构示例

```
                              [ 100, 200 ]
                             /    |     \
                            /     |      \
                     [50, 70]  [150]  [250, 300, 350]
                    /  |  \     |      /   |   |   \
                   /   |   \    |     /    |   |    \
               [30,40] [60] [80] [120,140] [220] [270,290] [320] [360,380]
                 |       |    |      |        |      |       |     |
                 v       v    v      v        v      v       v     v
               数据块   数据块 数据块 数据块   数据块 数据块  数据块 数据块
               
               叶子结点之间按顺序链接
```

#### 3.2.3 B+树的特点

1. **所有叶子结点包含全部关键字信息**：
   - 非叶子结点只起索引作用
   - 叶子结点才包含完整的数据或指针

2. **所有叶子结点按顺序链接**：
   - 形成一个有序链表
   - 范围查询效率高

3. **非叶子结点只起索引作用**：
   - 可以存储更多的索引项
   - 树的高度更低
   - 磁盘IO更少

4. **查询性能稳定**：
   - 任何查询都要走到叶子结点
   - 查询时间稳定

5. **范围查询效率高**：
   - 叶子结点按顺序链接
   - 范围查询时可以直接遍历叶子结点

#### 3.2.4 B+树的优点（与B树相比）

1. **查询性能稳定**：
   - B树：最好情况在根结点，最坏情况在叶子结点
   - B+树：所有查询都要到叶子结点，性能稳定

2. **范围查询效率高**：
   - B树：范围查询需要中序遍历
   - B+树：叶子结点有序链接，范围查询更高效

3. **全表扫描效率高**：
   - B+树：只需要遍历叶子结点链表
   - B树：需要中序遍历整棵树

4. **磁盘IO更少**：
   - B+树的非叶子结点不存储数据，可以存储更多的索引项
   - 树的高度更低，磁盘IO更少

#### 3.2.5 B+树的操作

1. **查找**：
   - 与B树类似
   - 必须走到叶子结点
   - 如果是范围查询，可以从叶子结点链表继续查找

2. **插入**：
   - 查找插入位置（叶子结点）
   - 插入叶子结点
   - 如果叶子结点已满，分裂
   - 可能需要向上传播分裂（非叶子结点）

3. **删除**：
   - 查找删除位置（叶子结点）
   - 从叶子结点删除
   - 如果叶子结点关键字数少于下限，合并或借位
   - 可能需要更新非叶子结点的索引项

#### 3.2.6 B+树在数据库中的应用

- **MySQL InnoDB**：使用B+树作为索引结构
- **MySQL MyISAM**：使用B+树作为索引结构
- **Oracle**：使用B+树作为索引结构
- **SQL Server**：使用B+树作为索引结构

### 3.3 哈希索引（Hash Index）

哈希索引基于哈希表，通过哈希函数将索引键映射到哈希表的位置。

#### 3.3.1 哈希索引的定义

- **哈希函数**：将索引键转换为哈希值的函数
- **哈希桶**：存储哈希值相同的数据的位置
- **碰撞处理**：处理哈希值相同的情况

#### 3.3.2 哈希索引的结构示例

```
哈希表：
[0] → [键=100, 数据]
[1] → [键=200, 数据] → [键=500, 数据]（链表，碰撞）
[2] → [键=300, 数据]
[3] → [键=400, 数据]
...
```

#### 3.3.3 哈希索引的特点

1. **精确查找快**：
   - O(1)的时间复杂度
   - 比B+树更快

2. **不支持范围查询**：
   - 无法使用哈希索引进行范围查询
   - 例如：WHERE age > 20

3. **不支持排序**：
   - 无法使用哈希索引进行排序
   - 例如：ORDER BY age

4. **不支持前缀匹配**：
   - 无法使用哈希索引进行前缀匹配
   - 例如：WHERE name LIKE '张%'

5. **不支持部分索引列查询**：
   - 复合哈希索引必须使用所有索引列
   - 例如：索引是(name, age)，查询WHERE name = '张三' 无法使用哈希索引

6. **哈希碰撞**：
   - 不同的键可能有相同的哈希值
   - 需要处理碰撞（链表法、开放寻址法等）

#### 3.3.4 哈希索引的适用场景

- 只需要等值查询的场景
- 不需要范围查询、排序、前缀匹配的场景
- 示例：
  - 用户登录（WHERE username = ? AND password = ?）
  - 订单查询（WHERE order_id = ?）

#### 3.3.5 哈希索引在数据库中的应用

- **MySQL Memory存储引擎**：默认使用哈希索引
- **MySQL InnoDB**：自适应哈希索引（Adaptive Hash Index）
- **Redis**：基于哈希表

### 3.4 位图索引（Bitmap Index）

位图索引使用位图来表示索引，适用于低基数列（不同值少的列）。

#### 3.4.1 位图索引的定义

- **位图**：每一位表示一个行是否包含某个值
- **低基数列**：不同值的数量较少的列（例如：性别、状态、部门等）

#### 3.4.2 位图索引的结构示例

假设有一个表，包含性别列（男、女）：

```
行号  性别
1     男
2     女
3     男
4     男
5     女
```

位图索引：
- 男：1 0 1 1 0（第1、3、4行是男）
- 女：0 1 0 0 1（第2、5行是女）

#### 3.4.3 位图索引的特点

1. **适合低基数列**：
   - 列的不同值较少
   - 例如：性别、状态、地区、部门等

2. **空间效率高**：
   - 使用位图存储，节省空间

3. **查询速度快**：
   - 可以使用位运算（AND、OR、NOT）
   - 多个条件查询时效率高

4. **不适合高基数列**：
   - 列的不同值较多时，位图索引会变得很大
   - 维护成本高

5. **不适合频繁更新**：
   - 更新操作需要修改多个位图
   - 锁粒度大，并发性能差

#### 3.4.4 位图索引的适用场景

- 数据仓库
- 决策支持系统
- 低基数列
- 查询多、更新少的场景

#### 3.4.5 位图索引在数据库中的应用

- **Oracle**：支持位图索引
- **SQL Server**：支持位图索引
- **PostgreSQL**：支持位图索引（通过插件）

### 3.5 R树（R-tree）

R树用于空间数据索引，支持地理位置查询。

#### 3.5.1 R树的定义

R树是一种用于空间数据的索引结构，使用最小边界矩形（MBR）来组织数据。

#### 3.5.2 R树的特点

1. **支持空间查询**：
   - 点查询
   - 范围查询
   - 最近邻查询
   - 空间关系查询（包含、相交等）

2. **适用于空间数据**：
   - 点
   - 线
   - 多边形

#### 3.5.3 R树在数据库中的应用

- **MySQL**：支持空间索引（使用R树）
- **PostgreSQL**：支持空间索引（PostGIS）
- **Oracle**：支持空间索引

### 3.6 倒排索引（Inverted Index）

倒排索引用于全文搜索，是搜索引擎的核心数据结构。

#### 3.6.1 倒排索引的定义

- **正排索引**：文档 → 关键词
- **倒排索引**：关键词 → 文档

#### 3.6.2 倒排索引的结构示例

```
文档1：数据库系统
文档2：数据库原理
文档3：操作系统

倒排索引：
数据库 → [文档1, 文档2]
系统 → [文档1]
原理 → [文档2]
操作 → [文档3]
```

#### 3.6.3 倒排索引的特点

1. **支持全文搜索**：
   - 关键词搜索
   - 短语搜索
   - 模糊搜索

2. **搜索速度快**：
   - 根据关键词快速找到文档

#### 3.6.4 倒排索引在数据库中的应用

- **MySQL**：全文索引（使用倒排索引）
- **Elasticsearch**：基于倒排索引
- **Solr**：基于倒排索引

## 四、索引设计原则
### 4.1 选择索引的列

1. **经常在WHERE子句中出现的列**：
   - 这些列经常用于筛选数据
   - 建立索引可以快速找到符合条件的行

2. **经常在ORDER BY、GROUP BY子句中出现的列**：
   - 这些列经常用于排序和分组
   - 建立索引可以避免数据库进行额外的排序操作

3. **经常用于连接的列（JOIN）**：
   - 这些列用于表之间的连接
   - 建立索引可以加速连接操作

4. **选择性高的列（不同值多的列）**：
   - 选择性 = 不同值的数量 / 总行数
   - 选择性越高，索引效率越高
   - 例如：主键、唯一键的选择性是1，效率最高
   - 性别列的选择性很低（只有2个值），索引效率低

5. **数据类型小的列**：
   - 数据类型越小，索引占用的空间越小
   - 磁盘IO越少
   - 例如：INT比VARCHAR好

### 4.2 避免创建索引的列

1. **很少查询的列**：
   - 不需要为很少使用的列创建索引
   - 浪费空间，增加维护成本

2. **选择性低的列（不同值少的列）**：
   - 例如：性别、状态（只有几个值）
   - 索引效率低，甚至不如全表扫描

3. **频繁更新的列**：
   - 更新数据时，索引也需要更新
   - 频繁更新会降低性能

4. **数据量小的表**：
   - 小表全表扫描很快
   - 不需要索引

5. **大对象列（TEXT、BLOB）**：
   - 这些列的数据很大
   - 不适合建立索引

### 4.3 复合索引设计

1. **最左前缀原则**：
   - 查询时从索引的最左列开始，不跳过中间的列
   - 例如：索引是(a, b, c)
     - WHERE a = 1 AND b = 2 AND c = 3 ✓（使用全部）
     - WHERE a = 1 AND b = 2 ✓（使用a, b）
     - WHERE a = 1 ✓（使用a）
     - WHERE b = 2 AND c = 3 ✗（不使用，没有a）
     - WHERE a = 1 AND c = 3 ✓（使用a，c不能用）

2. **选择性高的列放在前面**：
   - 选择性高的列可以更快地过滤数据
   - 例如：索引是(a, b)，a的选择性高
   - 查询WHERE a = 1 AND b = 2时，先通过a过滤大部分数据，再通过b过滤

3. **考虑查询的顺序**：
   - 根据实际查询的模式设计复合索引
   - 例如：如果经常查询WHERE a = 1 AND b = 2，那么索引(a, b)比(b, a)好

4. **不要过度索引**：
   - 复合索引包含的列不要太多
   - 一般不超过5个列

### 4.4 索引设计的其他原则

1. **索引列不能为空**：
   - 虽然允许NULL，但NULL值的处理比较特殊
   - 尽量使用NOT NULL

2. **使用前缀索引**：
   - 对于长字符串列，可以只索引前几个字符
   - 节省空间，提高效率

3. **避免在索引列上使用函数或运算**：
   - 例如：WHERE YEAR(create_time) = 2024
   - 这样无法使用索引
   - 改为：WHERE create_time >= '2024-01-01' AND create_time < '2025-01-01'

4. **定期维护索引**：
   - 重建索引
   - 优化索引
   - 删除不再使用的索引

## 五、SQL中的索引操作
### 5.1 创建索引

```sql
-- 普通索引
CREATE INDEX index_name ON table_name(column_name);

-- 复合索引
CREATE INDEX index_name ON table_name(column1, column2);

-- 唯一索引
CREATE UNIQUE INDEX index_name ON table_name(column_name);

-- 聚簇索引（部分数据库支持）
CREATE CLUSTERED INDEX index_name ON table_name(column_name);

-- 全文索引
CREATE FULLTEXT INDEX index_name ON table_name(column_name);

-- 前缀索引
CREATE INDEX index_name ON table_name(column_name(length));

-- 建表时创建索引
CREATE TABLE table_name (
    id INT PRIMARY KEY,
    name VARCHAR(50),
    age INT,
    INDEX idx_name (name),
    UNIQUE INDEX idx_age (age)
);
```

### 5.2 删除索引

```sql
-- MySQL
DROP INDEX index_name ON table_name;
-- 或
ALTER TABLE table_name DROP INDEX index_name;

-- Oracle
DROP INDEX index_name;

-- SQL Server
DROP INDEX table_name.index_name;
```

### 5.3 查看索引

```sql
-- MySQL
SHOW INDEX FROM table_name;
-- 或
SHOW KEYS FROM table_name;

-- Oracle
SELECT * FROM user_indexes WHERE table_name = 'TABLE_NAME';
SELECT * FROM user_ind_columns WHERE table_name = 'TABLE_NAME';

-- SQL Server
EXEC sp_helpindex 'table_name';

-- PostgreSQL
\d table_name
-- 或
SELECT * FROM pg_indexes WHERE tablename = 'table_name';
```

## 六、索引优化
### 6.1 查询优化

1. **避免在索引列上使用函数或运算**：
   ```sql
   -- 不好：无法使用索引
   SELECT * FROM student WHERE YEAR(create_time) = 2024;
   
   -- 好：可以使用索引
   SELECT * FROM student WHERE create_time >= '2024-01-01' AND create_time < '2025-01-01';
   ```

2. **避免使用SELECT ***：
   ```sql
   -- 不好：查询所有列
   SELECT * FROM student;
   
   -- 好：只查询需要的列
   SELECT id, name, age FROM student;
   
   -- 更好：使用覆盖索引（如果索引包含这些列）
   SELECT id, name, age FROM student WHERE name = '张三';
   ```

3. **合理使用JOIN**：
   - 在连接列上建立索引
   - 小表驱动大表

4. **使用EXPLAIN分析查询执行计划**：
   ```sql
   EXPLAIN SELECT * FROM student WHERE name = '张三';
   ```

### 6.2 索引维护

1. **定期重建索引**：
   - 数据大量更新后，索引可能会碎片化
   - 重建索引可以提高性能
   ```sql
   -- MySQL
   ALTER TABLE table_name ENGINE=InnoDB;
   -- 或
   OPTIMIZE TABLE table_name;
   
   -- Oracle
   ALTER INDEX index_name REBUILD;
   
   -- SQL Server
   ALTER INDEX index_name ON table_name REBUILD;
   ```

2. **定期分析索引使用情况**：
   - 找出不再使用的索引
   - 删除无用的索引

3. **删除不再使用的索引**：
   - 无用的索引浪费空间
   - 增加维护成本

### 6.3 使用EXPLAIN

EXPLAIN可以查看查询的执行计划，帮助分析索引是否被使用。

```sql
-- MySQL
EXPLAIN SELECT * FROM student WHERE name = '张三';

-- 输出字段说明：
-- id：查询序号
-- select_type：查询类型
-- table：表名
-- type：访问类型（ALL、index、range、ref、eq_ref、const、system）
-- possible_keys：可能使用的索引
-- key：实际使用的索引
-- key_len：使用的索引长度
-- ref：与索引比较的列
-- rows：预计扫描的行数
-- Extra：额外信息

-- type的值从好到坏：
-- system > const > eq_ref > ref > range > index > ALL

-- Extra的值：
-- Using index：使用覆盖索引，很好
-- Using where：使用WHERE过滤
-- Using temporary：使用临时表，不好
-- Using filesort：使用文件排序，不好
```

## 七、索引的最佳实践

### 7.1 索引设计的最佳实践

1. **先查询，后索引**：
   - 先了解查询模式
   - 再根据查询设计索引

2. **小表不建索引**：
   - 小表全表扫描很快
   - 不需要索引

3. **索引不是越多越好**：
   - 过多的索引会占用大量空间
   - 增加维护成本
   - 一般不超过5-10个索引

4. **优先考虑复合索引**：
   - 一个复合索引可以支持多个查询
   - 比多个单列索引更好

5. **覆盖索引**：
   - 索引包含查询需要的所有列
   - 不需要回表，性能最好

### 7.2 索引使用的最佳实践

1. **避免隐式类型转换**：
   ```sql
   -- 不好：隐式类型转换，无法使用索引
   SELECT * FROM student WHERE id = '123';
   
   -- 好：类型匹配
   SELECT * FROM student WHERE id = 123;
   ```

2. **避免使用OR**：
   ```sql
   -- 不好：OR可能无法使用索引
   SELECT * FROM student WHERE name = '张三' OR age = 20;
   
   -- 好：使用UNION
   SELECT * FROM student WHERE name = '张三'
   UNION
   SELECT * FROM student WHERE age = 20;
   ```

3. **避免使用LIKE '%...'**：
   ```sql
   -- 不好：前导通配符，无法使用索引
   SELECT * FROM student WHERE name LIKE '%张三';
   
   -- 好：后导通配符，可以使用索引
   SELECT * FROM student WHERE name LIKE '张三%';
   ```

4. **避免使用NOT IN或NOT EXISTS**：
   ```sql
   -- 不好：NOT IN可能无法使用索引
   SELECT * FROM student WHERE id NOT IN (1, 2, 3);
   
   -- 好：使用LEFT JOIN
   SELECT s.* FROM student s
   LEFT JOIN exclude e ON s.id = e.id
   WHERE e.id IS NULL;
   ```

## 八、总结

索引是数据库性能优化的重要手段。合理的索引设计可以大幅提高查询效率，但也需要考虑索引的维护成本和存储空间。

**关键点**：
1. **理解索引的原理**：B+树是最常用的索引数据结构
2. **选择合适的索引类型**：根据查询模式选择聚簇索引、非聚簇索引、复合索引等
3. **遵循索引设计原则**：选择合适的列，避免不必要的索引
4. **定期维护索引**：重建、优化、删除无用索引
5. **使用EXPLAIN分析**：查看查询执行计划，验证索引是否被使用

理解索引的原理、选择合适的索引列、设计合理的索引结构是数据库管理员和开发人员的重要技能。

---

## 章节：数据库系统PPT-ch1笔记

数据库系统 - ch1 数据库系统概述 详细笔记

一、数据库系统概述

1.1 什么是数据库

数据库（Database，DB）的定义：
- 数据库是长期存储在计算机内的、有组织的、可共享的大量数据的集合
- 数据库的特点：
  1. 永久存储：数据长期保存
  2. 有组织：数据按一定的结构组织
  3. 可共享：多个用户可以同时使用
  4. 大量数据：存储大量的数据

数据库的例子：
- 银行的账户信息
- 航空公司的机票预订信息
- 电商网站的商品信息
- 学校的学生信息
- 图书馆的图书信息

1.2 数据库管理系统

数据库管理系统（Database Management System，DBMS）的定义：
- DBMS是位于用户和操作系统之间的一层数据管理软件
- 它用于科学地组织和存储数据，高效地获取和维护数据
- DBMS是数据库系统的核心

DBMS的主要功能：
1. 数据定义功能（DDL，Data Definition Language）
   - 定义数据库的结构
   - 定义表、索引、视图等
   - 例子：CREATE TABLE、CREATE INDEX

2. 数据操作功能（DML，Data Manipulation Language）
   - 增删改查数据
   - 例子：SELECT、INSERT、UPDATE、DELETE

3. 数据库运行管理
   - 事务管理
   - 并发控制
   - 完整性检查
   - 安全性检查

4. 数据库的建立和维护
   - 数据库的建立
   - 数据库的备份和恢复
   - 数据库的重组
   - 数据库的性能监控

常见的DBMS：
- 关系型DBMS：
  - MySQL
  - Oracle
  - SQL Server
  - PostgreSQL
  - DB2
- NoSQL DBMS：
  - MongoDB（文档数据库）
  - Redis（键值数据库）
  - Cassandra（列族数据库）
  - Neo4j（图数据库）

1.3 数据库系统

数据库系统（Database System，DBS）的定义：
- 数据库系统是指在计算机系统中引入数据库后的系统
- 数据库系统由以下部分组成：
  1. 数据库（DB）
  2. 数据库管理系统（DBMS）
  3. 应用程序
  4. 数据库管理员（DBA）
  5. 用户

数据库系统的组成图：
```
        ┌───────────────┐
        │     用户      │
        └───────┬───────┘
                │
        ┌───────▼───────┐
        │   应用程序    │
        └───────┬───────┘
                │
        ┌───────▼───────┐
        │     DBMS      │
        └───────┬───────┘
                │
        ┌───────▼───────┐
        │     数据库     │
        └───────────────┘
```

1.4 数据管理技术的发展

数据管理技术的三个阶段：
1. 人工管理阶段（1940s-1950s中期）
2. 文件系统阶段（1950s后期-1960s中期）
3. 数据库系统阶段（1960s后期至今）

阶段1：人工管理阶段
- 特点：
  - 数据不保存
  - 应用程序管理数据
  - 数据不共享
  - 数据不具有独立性
- 例子：
  - 早期的科学计算
  - 纸带、卡片存储

阶段2：文件系统阶段
- 特点：
  - 数据可以长期保存
  - 文件系统管理数据
  - 数据共享性差
  - 数据独立性差
  - 数据结构化程度低
- 问题：
  - 数据冗余（Data Redundancy）
  - 数据不一致（Data Inconsistency）
  - 数据联系弱
- 例子：
  - 多个文件存储学生信息、课程信息、成绩信息

阶段3：数据库系统阶段
- 特点：
  - 数据结构化（整体结构化）
  - 数据共享性高，冗余度低，易扩充
  - 数据独立性高
  - 数据由DBMS统一管理和控制
- 优势：
  - 减少数据冗余
  - 避免数据不一致
  - 数据独立性高
  - 便于数据共享
  - 便于数据管理

数据管理技术的对比：

| 特性 | 人工管理 | 文件系统 | 数据库系统 |
|------|----------|----------|------------|
| 数据的保存 | 不保存 | 保存 | 保存 |
| 数据管理 | 应用程序 | 文件系统 | DBMS |
| 数据共享 | 不共享 | 共享性差 | 共享性好 |
| 数据独立性 | 无独立性 | 独立性差 | 独立性高 |
| 数据结构化 | 无结构 | 记录内有结构，整体无结构 | 整体结构化 |
| 数据控制 | 应用程序 | 文件系统 | DBMS |

二、数据模型

2.1 什么是数据模型

数据模型（Data Model）的定义：
- 数据模型是对现实世界数据特征的抽象
- 数据模型是数据库系统的核心和基础
- 数据模型用来描述数据、组织数据和对数据进行操作

数据模型的三要素：
1. 数据结构（Data Structure）
   - 描述数据库的对象和对象之间的联系
   - 是系统静态特性的描述

2. 数据操作（Data Operation）
   - 描述对数据库可以执行的操作
   - 是系统动态特性的描述
   - 例子：查询、插入、删除、修改

3. 数据的约束条件（Data Constraints）
   - 描述数据及其联系应满足的规则
   - 保证数据的正确性、有效性和相容性
   - 例子：主键约束、外键约束、非空约束

2.2 数据模型的分类

数据模型的分类：
1. 概念模型（Conceptual Model）
   - 也叫信息模型
   - 按用户的观点来对数据和信息建模
   - 用于数据库设计
   - 例子：E-R模型（实体-联系模型）

2. 逻辑模型（Logical Model）
   - 按计算机系统的观点对数据建模
   - 用于DBMS实现
   - 例子：
     - 层次模型（Hierarchical Model）
     - 网状模型（Network Model）
     - 关系模型（Relational Model）
     - 面向对象模型（Object-Oriented Model）
     - 对象关系模型（Object-Relational Model）

3. 物理模型（Physical Model）
   - 描述数据在物理存储介质上的组织结构
   - 与具体的DBMS和硬件有关

2.3 概念模型（E-R模型）

E-R模型（Entity-Relationship Model，实体-联系模型）：
- 1976年由P.S.Chen提出
- 是最常用的概念模型
- 用于数据库设计

E-R模型的基本概念：
1. 实体（Entity）
   - 客观存在并可相互区别的事物
   - 例子：一个学生、一门课程、一个订单
   - 用矩形表示

2. 属性（Attribute）
   - 实体所具有的某一特性
   - 例子：学生的学号、姓名、年龄
   - 用椭圆表示

3. 码（Key）
   - 唯一标识实体的属性集
   - 例子：学生的学号
   - 用下划线表示

4. 域（Domain）
   - 属性的取值范围
   - 例子：性别的域是{男,女}

5. 实体型（Entity Type）
   - 具有相同属性的实体的集合
   - 用实体名和属性名集合来抽象
   - 例子：学生(学号,姓名,性别,年龄,系)

6. 实体集（Entity Set）
   - 同一类型实体的集合
   - 例子：所有学生的集合

7. 联系（Relationship）
   - 实体之间的关联
   - 例子：学生选课（学生和课程之间的联系）
   - 用菱形表示

联系的类型：
1. 一对一联系（1:1）
   - 实体集A中的一个实体，实体集B中至多有一个实体与之联系
   - 反之亦然
   - 例子：班级和班长（一个班级有一个班长，一个班长属于一个班级）

2. 一对多联系（1:n）
   - 实体集A中的一个实体，实体集B中有n个实体与之联系
   - 实体集B中的一个实体，实体集A中至多有一个实体与之联系
   - 例子：班级和学生（一个班级有多个学生，一个学生属于一个班级）

3. 多对多联系（m:n）
   - 实体集A中的一个实体，实体集B中有n个实体与之联系
   - 实体集B中的一个实体，实体集A中有m个实体与之联系
   - 例子：学生和课程（一个学生选多门课程，一门课程被多个学生选）

E-R图的例子（学生选课系统）：
```
    ┌──────────┐         选          ┌──────────┐
    │  学生    │<──────────────────>│  课程    │
    └────┬─────┘       m:n         └────┬─────┘
         │                                │
    ┌────▼────┐                      ┌────▼────┐
    │  学号   │                      │  课程号 │
    │  姓名   │                      │  课程名 │
    │  性别   │                      │  学分   │
    │  年龄   │                      └─────────┘
    │  系     │
    └─────────┘
```

2.4 关系模型

关系模型（Relational Model）：
- 1970年由E.F.Codd提出
- 是目前最常用的数据模型
- 用二维表（关系）来表示数据

关系模型的基本概念：
1. 关系（Relation）
   - 一个关系对应一张二维表
   - 例子：学生表

2. 元组（Tuple）
   - 表中的一行
   - 也叫记录
   - 例子：一个学生的信息

3. 属性（Attribute）
   - 表中的一列
   - 也叫字段
   - 例子：学号、姓名

4. 码（Key）
   - 唯一标识元组的属性或属性组
   - 候选码（Candidate Key）：可以作为码的属性组
   - 主码（Primary Key）：选中的候选码
   - 外码（Foreign Key）：另一个关系的主码

5. 域（Domain）
   - 属性的取值范围
   - 例子：性别的域是{男,女}

6. 分量（Component）
   - 元组中的一个属性值

7. 关系模式（Relation Schema）
   - 对关系的描述
   - 表示为：关系名(属性1,属性2,...,属性n)
   - 例子：学生(学号,姓名,性别,年龄,系)

关系模型的优点：
1. 建立在严格的数学概念基础上
2. 概念单一（实体和联系都用关系表示）
3. 存取路径对用户透明
4. 数据独立性高
5. 具有坚实的理论基础

关系模型的缺点：
1. 查询效率不如非关系模型
2. 为了提高效率，需要对查询进行优化

关系模型的数据操作：
1. 查询（Query）：SELECT
2. 插入（Insert）：INSERT
3. 删除（Delete）：DELETE
4. 修改（Update）：UPDATE

关系模型的完整性约束：
1. 实体完整性（Entity Integrity）：主码不能为空
2. 参照完整性（Referential Integrity）：外码必须是主码的有效值或空
3. 用户定义的完整性（User-defined Integrity）：用户自定义的约束

关系模型的例子（学生选课系统）：

学生表（Student）：
| 学号 | 姓名 | 性别 | 年龄 | 系 |
|------|------|------|------|----|
| S001 | 张三 | 男 | 20 | 计算机 |
| S002 | 李四 | 女 | 19 | 电子 |
| S003 | 王五 | 男 | 21 | 计算机 |

课程表（Course）：
| 课程号 | 课程名 | 学分 |
|--------|--------|------|
| C001 | 数据库 | 4 |
| C002 | 操作系统 | 4 |
| C003 | 数据结构 | 3 |

选课表（SC）：
| 学号 | 课程号 | 成绩 |
|------|--------|------|
| S001 | C001 | 85 |
| S001 | C002 | 90 |
| S002 | C001 | 88 |
| S003 | C003 | 78 |

三、数据库系统的结构

3.1 数据库系统的模式结构

数据库系统的三级模式结构：
1. 内模式（Internal Schema）
   - 也叫存储模式
   - 是数据物理结构和存储方式的描述
   - 是数据在数据库内部的表示方式
   - 一个数据库只有一个内模式

2. 模式（Schema）
   - 也叫逻辑模式
   - 是数据库中全体数据的逻辑结构和特征的描述
   - 是所有用户的公共数据视图
   - 一个数据库只有一个模式

3. 外模式（External Schema）
   - 也叫子模式或用户模式
   - 是数据库用户看到和使用的局部数据的逻辑结构和特征的描述
   - 是数据库用户的数据视图
   - 一个数据库可以有多个外模式

三级模式结构的图：
```
        ┌─────────────────────────┐
        │      外模式（多个）      │ ← 用户视图
        └────────────┬────────────┘
                     │ 外模式/模式映像
        ┌────────────▼────────────┐
        │       模式（一个）       │ ← 全局逻辑视图
        └────────────┬────────────┘
                     │ 模式/内模式映像
        ┌────────────▼────────────┐
        │      内模式（一个）      │ ← 物理存储视图
        └─────────────────────────┘
```

三级模式的优点：
1. 保证数据的独立性
2. 简化了用户接口
3. 有利于数据共享
4. 有利于数据的安全和保密

3.2 数据独立性

数据独立性的定义：
- 数据独立性是指应用程序和数据之间相互独立，互不影响
- 数据独立性包括：
  1. 物理数据独立性（Physical Data Independence）
  2. 逻辑数据独立性（Logical Data Independence）

物理数据独立性：
- 物理独立性是指用户的应用程序与存储在磁盘上的数据库中数据是相互独立的
- 当数据的物理存储改变时，应用程序不需要改变
- 通过模式/内模式映像实现

逻辑数据独立性：
- 逻辑独立性是指用户的应用程序与数据库的逻辑结构是相互独立的
- 当数据的逻辑结构改变时，应用程序不需要改变
- 通过外模式/模式映像实现

数据独立性的好处：
- 应用程序不需要随数据结构的改变而改变
- 减少了应用程序的维护成本
- 提高了系统的可扩展性

四、数据库系统的组成

4.1 数据库系统的组成部分

数据库系统的组成：
1. 数据库（DB）
2. 数据库管理系统（DBMS）
3. 应用程序
4. 数据库管理员（DBA）
5. 用户

4.2 数据库管理员（DBA）

数据库管理员（Database Administrator，DBA）的职责：
1. 决定数据库中的信息内容和结构
2. 决定数据库的存储结构和存取策略
3. 定义数据的安全性要求和完整性约束条件
4. 监控数据库的使用和运行
5. 数据库的改进和重组重构
6. 数据库的备份和恢复

4.3 用户

数据库系统的用户类型：
1. 最终用户（End User）
   - 通过应用程序使用数据库
   - 不直接使用SQL
   - 例子：银行柜员、网上购物用户

2. 应用程序员（Application Programmer）
   - 开发应用程序
   - 使用SQL访问数据库
   - 例子：软件工程师

3. 数据库管理员（DBA）
   - 管理和维护数据库
   - 全面负责数据库系统
   - 例子：DBA

4. 系统分析员和数据库设计人员
   - 系统分析员：负责需求分析和系统设计
   - 数据库设计人员：负责数据库设计

五、总结

5.1 数据库系统概述要点
- 数据库：有组织的、可共享的数据集合
- DBMS：数据管理软件
- DBS：数据库系统

5.2 数据管理技术发展要点
- 三个阶段：人工管理、文件系统、数据库系统
- 数据库系统阶段的特点：结构化、共享性高、独立性高

5.3 数据模型要点
- 概念模型：E-R模型
- 逻辑模型：关系模型（最常用）
- 关系模型用二维表表示数据

5.4 数据库系统结构要点
- 三级模式：外模式、模式、内模式
- 两级映像：外模式/模式、模式/内模式
- 数据独立性：物理独立性、逻辑独立性

5.5 学习的意义
- 理解数据库的基本概念
- 掌握E-R模型和关系模型
- 为学习SQL和数据库设计打下基础

---

## 章节：数据库系统PPT-ch2_1~5关系代数笔记

# 数据库系统PPT-ch2_1~5关系代数笔记

## 一、关系数据结构
### 1.1 关系
- **笛卡尔积**：D1×D2×...×Dn = {(d1, d2, ..., dn) | di ∈ Di}
- **关系**：笛卡尔积的子集，表示为R(D1, D2, ..., Dn)
- **元组（Tuple）**：关系中的一行
- **属性（Attribute）**：关系中的一列
- **域（Domain）**：属性的取值范围
- **候选码（Candidate Key）**：能唯一标识元组的最小属性集
- **主码（Primary Key）**：选定的一个候选码
- **外码（Foreign Key）**：引用其他关系主码的属性

### 1.2 关系的性质
1. 列是同质的
2. 不同的列可出自同一个域
3. 列的顺序无所谓
4. 任意两个元组不能完全相同
5. 行的顺序无所谓
6. 分量必须取原子值

## 二、关系代数的基本运算
### 2.1 选择（Selection）
- **符号**：σ
- **定义**：σF(R) = {t | t ∈ R ∧ F(t) = 真}
- **示例**：
  - σ年龄>20(学生)
  - σ性别='男'∧系='计算机'(学生)

### 2.2 投影（Projection）
- **符号**：π
- **定义**：πA(R) = {t[A] | t ∈ R}
- **示例**：
  - π姓名,年龄(学生)
  - π系(学生) 会自动去重

### 2.3 并（Union）
- **符号**：∪
- **定义**：R∪S = {t | t ∈ R ∨ t ∈ S}
- **条件**：R和S必须相容（同目、对应属性同域）

### 2.4 差（Difference）
- **符号**：−
- **定义**：R−S = {t | t ∈ R ∧ t ∉ S}
- **条件**：R和S必须相容

### 2.5 笛卡尔积（Cartesian Product）
- **符号**：×
- **定义**：R×S = {tr⌒ts | tr ∈ R ∧ ts ∈ S}

## 三、关系代数的扩充运算
### 3.1 交（Intersection）
- **符号**：∩
- **定义**：R∩S = {t | t ∈ R ∧ t ∈ S}
- **等价表示**：R∩S = R−(R−S)

### 3.2 θ连接（Theta Join）
- **符号**：⋈θ
- **定义**：R⋈θS = σθ(R×S)
- **θ为比较运算符（=, ≠, <, ≤, >, ≥）**

### 3.3 等值连接（Equijoin）
- **θ为=的连接**
- **示例**：R⋈R.A=S.B S

### 3.4 自然连接（Natural Join）
- **符号**：⋈
- **在等值连接基础上，去掉重复属性列**
- **示例**：学生⋈选课

### 3.5 除（Division）
- **符号**：÷
- **定义**：R÷S = {tr[X] | tr ∈ R ∧ ∀ts ∈ S, tr⌒ts ∈ R}
- **适用场景**：查询"全部"、"所有"的问题

---

## 章节：数据库系统PPT-ch2_6关系演算-域演算-ok笔记

# 数据库系统PPT-ch2_6关系演算-域演算-ok笔记

## 一、关系演算概述
- **关系演算**：基于数理逻辑谓词演算的查询语言
- **分类**：
  - 元组关系演算（Tuple Relational Calculus）
  - 域关系演算（Domain Relational Calculus）

## 二、元组关系演算
### 2.1 元组关系演算表达式
- **形式**：{t | P(t)}
- **t**：元组变量
- **P(t)**：谓词公式

### 2.2 原子公式
1. **s ∈ R**：s是关系R的元组
2. **s[i] θ u[j]**：元组s的第i个分量与元组u的第j个分量满足θ关系
3. **s[i] θ c**：元组s的第i个分量与常量c满足θ关系

### 2.3 公式的递归定义
1. 原子公式是公式
2. 若P是公式，则¬P也是公式
3. 若P1、P2是公式，则P1∧P2、P1∨P2也是公式
4. 若P(t)是公式，则(∃t)P(t)、(∀t)P(t)也是公式

### 2.4 示例
1. 查询计算机系的学生：
   - {t | t ∈ 学生 ∧ t[5] = '计算机'}

2. 查询年龄大于20岁的学生姓名：
   - {t[2] | t ∈ 学生 ∧ t[4] > 20}

3. 查询选修了课程号为'001'的学生学号：
   - {t[1] | t ∈ 选课 ∧ t[2] = '001'}

## 三、域关系演算
### 3.1 域关系演算表达式
- **形式**：{<x1, x2, ..., xn> | P(x1, x2, ..., xn)}
- **xi**：域变量

### 3.2 原子公式
1. **<x1, x2, ..., xn> ∈ R**：域变量组成的元组属于关系R
2. **x θ y**：域变量x和域变量y满足θ关系
3. **x θ c**：域变量x和常量c满足θ关系

### 3.3 示例
1. 查询计算机系的学生：
   - {<sno, sname, ssex, sage, sdept> | <sno, sname, ssex, sage, sdept> ∈ 学生 ∧ sdept = '计算机'}

2. 查询年龄大于20岁的学生姓名：
   - {<sname> | ∃sno, ssex, sage, sdept (<sno, sname, ssex, sage, sdept> ∈ 学生 ∧ sage > 20)}

3. 查询选修了课程号为'001'的学生学号：
   - {<sno> | ∃cno, grade (<sno, cno, grade> ∈ 选课 ∧ cno = '001')}

## 四、关系代数与关系演算的等价性
- **关系代数和安全的元组关系演算在表达能力上等价**
- **关系代数和安全的域关系演算在表达能力上等价**

## 五、QBE（Query By Example）
- **基于域关系演算的语言**
- **通过示例查询**
- **特点**：直观、易用

---

## 章节：数据库系统PPT-ch3-4-sqlnew笔记

# 数据库系统PPT-ch3-4-sqlnew笔记

## 一、SQL概述
### 1.1 SQL的特点
1. **综合统一**：集DDL、DML、DCL于一体
2. **高度非过程化**：只需要提出"做什么"，不需要关心"怎么做"
3. **面向集合的操作方式**：操作对象和结果都是集合
4. **以同一种语法结构提供多种使用方式**：自含式、嵌入式
5. **语言简洁，易学易用**：核心动词只有9个

### 1.2 SQL的组成
1. **数据定义语言（DDL）**：CREATE、DROP、ALTER
2. **数据查询语言（DQL）**：SELECT
3. **数据操纵语言（DML）**：INSERT、UPDATE、DELETE
4. **数据控制语言（DCL）**：GRANT、REVOKE

## 二、数据定义
### 2.1 模式定义
```sql
CREATE SCHEMA 模式名 AUTHORIZATION 用户名;
DROP SCHEMA 模式名 CASCADE|RESTRICT;
```

### 2.2 基本表定义
```sql
CREATE TABLE 表名 (
    列名 数据类型 [列级完整性约束],
    ...
    [表级完整性约束]
);

-- 示例
CREATE TABLE Student (
    Sno CHAR(9) PRIMARY KEY,
    Sname CHAR(20) NOT NULL,
    Ssex CHAR(2),
    Sage SMALLINT,
    Sdept CHAR(20)
);

CREATE TABLE Course (
    Cno CHAR(4) PRIMARY KEY,
    Cname CHAR(40) NOT NULL,
    Cpno CHAR(4),
    Ccredit SMALLINT,
    FOREIGN KEY (Cpno) REFERENCES Course(Cno)
);

CREATE TABLE SC (
    Sno CHAR(9),
    Cno CHAR(4),
    Grade SMALLINT,
    PRIMARY KEY (Sno, Cno),
    FOREIGN KEY (Sno) REFERENCES Student(Sno),
    FOREIGN KEY (Cno) REFERENCES Course(Cno)
);
```

### 2.3 修改基本表
```sql
ALTER TABLE 表名
[ADD [COLUMN] 新列名 数据类型 [完整性约束]]
[ADD [表级完整性约束]]
[DROP [COLUMN] 列名 [CASCADE|RESTRICT]]
[DROP CONSTRAINT 完整性约束名 [CASCADE|RESTRICT]]
[ALTER COLUMN 列名 数据类型];

-- 示例
ALTER TABLE Student ADD S_entrance DATE;
ALTER TABLE Student ALTER COLUMN Sage INT;
ALTER TABLE Student DROP COLUMN S_entrance;
```

### 2.4 删除基本表
```sql
DROP TABLE 表名 [CASCADE|RESTRICT];

-- 示例
DROP TABLE SC;
```

### 2.5 索引定义
```sql
CREATE [UNIQUE] [CLUSTERED] INDEX 索引名
ON 表名 (列名 [ASC|DESC], ...);

-- 示例
CREATE UNIQUE INDEX Stusno ON Student(Sno);
CREATE INDEX Stusname ON Student(Sname);
CREATE INDEX SCno ON SC(Sno ASC, Cno DESC);

-- 删除索引
DROP INDEX 索引名;
```

## 三、数据查询
### 3.1 单表查询
```sql
-- 基本查询
SELECT Sno, Sname FROM Student;
SELECT * FROM Student;
SELECT Sname, 2024-Sage FROM Student;
SELECT Sname, 2024-Sage AS 出生年份 FROM Student;

-- 消除重复行
SELECT DISTINCT Sno FROM SC;

-- 查询条件
SELECT Sname FROM Student WHERE Sdept='计算机';
SELECT Sname FROM Student WHERE Sage BETWEEN 20 AND 23;
SELECT Sname FROM Student WHERE Sdept IN ('计算机', '数学', '信息');
SELECT Sname FROM Student WHERE Sname LIKE '张%';
SELECT Sname FROM Student WHERE Sname LIKE '张_';

-- 排序
SELECT * FROM Student ORDER BY Sdept, Sage DESC;

-- 聚集函数
SELECT COUNT(*) FROM Student;
SELECT COUNT(DISTINCT Sno) FROM SC;
SELECT AVG(Grade) FROM SC WHERE Cno='1';
SELECT MAX(Grade) FROM SC WHERE Cno='1';
SELECT SUM(Ccredit) FROM Course;

-- 分组
SELECT Sno, COUNT(*) FROM SC GROUP BY Sno;
SELECT Sno, COUNT(*) FROM SC GROUP BY Sno HAVING COUNT(*) > 3;
```

### 3.2 连接查询
```sql
-- 等值连接
SELECT Student.*, SC.* FROM Student, SC WHERE Student.Sno = SC.Sno;

-- 自然连接
SELECT Student.Sno, Sname, Ssex, Sage, Sdept, Cno, Grade
FROM Student, SC
WHERE Student.Sno = SC.Sno;

-- 自身连接
SELECT FIRST.Cno, SECOND.Cpno
FROM Course FIRST, Course SECOND
WHERE FIRST.Cpno = SECOND.Cno;

-- 外连接
SELECT Student.Sno, Sname, Cno, Grade
FROM Student LEFT OUTER JOIN SC ON (Student.Sno = SC.Sno);

-- 多表连接
SELECT Student.Sno, Sname, Cname, Grade
FROM Student, SC, Course
WHERE Student.Sno = SC.Sno AND SC.Cno = Course.Cno;
```

### 3.3 嵌套查询
```sql
-- 不相关子查询
SELECT Sname FROM Student
WHERE Sno IN (
    SELECT Sno FROM SC WHERE Cno = '2'
);

SELECT Sname FROM Student
WHERE Sno IN (
    SELECT Sno FROM SC WHERE Cno IN (
        SELECT Cno FROM Course WHERE Cname = '信息系统'
    )
);

-- 相关子查询
SELECT Sno, Cno FROM SC x
WHERE Grade >= (SELECT AVG(Grade) FROM SC y WHERE y.Sno = x.Sno);

-- EXISTS子查询
SELECT Sname FROM Student
WHERE EXISTS (
    SELECT * FROM SC WHERE Sno = Student.Sno AND Cno = '1'
);

SELECT Sname FROM Student
WHERE NOT EXISTS (
    SELECT * FROM Course WHERE NOT EXISTS (
        SELECT * FROM SC WHERE Sno = Student.Sno AND Cno = Course.Cno
    )
);
```

### 3.4 集合查询
```sql
-- 并
SELECT Sno FROM SC WHERE Cno = '1'
UNION
SELECT Sno FROM SC WHERE Cno = '2';

-- 交
SELECT Sno FROM SC WHERE Cno = '1'
INTERSECT
SELECT Sno FROM SC WHERE Cno = '2';

-- 差
SELECT Sno FROM SC WHERE Cno = '1'
EXCEPT
SELECT Sno FROM SC WHERE Cno = '2';
```

## 四、数据更新
### 4.1 插入数据
```sql
-- 插入单个元组
INSERT INTO Student VALUES ('2021001', '张三', '男', 20, '计算机');
INSERT INTO Student(Sno, Sname, Sdept) VALUES ('2021002', '李四', '数学');

-- 插入子查询结果
INSERT INTO Dept_age(Sdept, Avg_age)
SELECT Sdept, AVG(Sage) FROM Student GROUP BY Sdept;
```

### 4.2 修改数据
```sql
-- 修改单个元组
UPDATE Student SET Sage = 22 WHERE Sno = '2021001';

-- 修改多个元组
UPDATE Student SET Sage = Sage + 1;

-- 带子查询的修改
UPDATE SC SET Grade = 0
WHERE Sno IN (SELECT Sno FROM Student WHERE Sdept = '计算机');
```

### 4.3 删除数据
```sql
-- 删除单个元组
DELETE FROM Student WHERE Sno = '2021001';

-- 删除多个元组
DELETE FROM SC;

-- 带子查询的删除
DELETE FROM SC
WHERE Sno IN (SELECT Sno FROM Student WHERE Sdept = '计算机');
```

## 五、视图
### 5.1 定义视图
```sql
CREATE VIEW 视图名 [(列名, ...)]
AS 子查询
[WITH CHECK OPTION];

-- 示例
CREATE VIEW IS_Student AS
SELECT Sno, Sname, Sage FROM Student WHERE Sdept = '计算机';

CREATE VIEW IS_S1(Sno, Sname, Grade) AS
SELECT Student.Sno, Sname, Grade
FROM Student, SC
WHERE Student.Sno = SC.Sno AND Cno = '1' AND Sdept = '计算机';

CREATE VIEW S_G(Sno, Gavg) AS
SELECT Sno, AVG(Grade) FROM SC GROUP BY Sno;
```

### 5.2 删除视图
```sql
DROP VIEW 视图名 [CASCADE];
```

### 5.3 查询视图
```sql
SELECT * FROM IS_Student WHERE Sage < 20;
SELECT Sno, Gavg FROM S_G WHERE Gavg >= 90;
```

### 5.4 更新视图
```sql
UPDATE IS_Student SET Sname = '张三' WHERE Sno = '2021001';
INSERT INTO IS_Student VALUES ('2021003', '王五', 18);
DELETE FROM IS_Student WHERE Sno = '2021001';
```

## 六、数据控制
### 6.1 授权
```sql
GRANT 权限
ON 对象类型 对象名
TO 用户
[WITH GRANT OPTION];

-- 示例
GRANT SELECT ON TABLE Student TO U1;
GRANT ALL PRIVILEGES ON TABLE Student, Course TO U2, U3;
GRANT SELECT ON TABLE SC TO PUBLIC;
GRANT UPDATE(Sno), SELECT ON TABLE Student TO U4;
GRANT SELECT ON TABLE SC TO U5 WITH GRANT OPTION;
```

### 6.2 收回权限
```sql
REVOKE 权限
ON 对象类型 对象名
FROM 用户 [CASCADE|RESTRICT];

-- 示例
REVOKE SELECT ON TABLE Student FROM U1;
REVOKE UPDATE(Sno) ON TABLE Student FROM U4;
REVOKE SELECT ON TABLE SC FROM U5 CASCADE;
```

---

## 章节：数据库系统PPT-ch7-Entity-Relation Model笔记

# 数据库系统PPT-ch7-Entity-Relation Model笔记

## 一、E-R模型基本概念
### 1.1 实体（Entity）
- **定义**：客观存在并可相互区别的事物
- **示例**：学生、课程、教师

### 1.2 属性（Attribute）
- **定义**：实体所具有的某一特性
- **分类**：
  1. **简单属性**：不可再分的属性
  2. **复合属性**：可再分的属性
  3. **单值属性**：每个实体只有一个值
  4. **多值属性**：每个实体可能有多个值
  5. **派生属性**：从其他属性派生出来的属性

### 1.3 码（Key）
- **候选码**：能唯一标识实体的最小属性集
- **主码**：选定的一个候选码
- **外码**：引用其他关系主码的属性

### 1.4 实体型（Entity Type）
- **定义**：具有相同属性的实体的抽象
- **表示**：实体名(属性1, 属性2, ..., 属性n)

### 1.5 实体集（Entity Set）
- **定义**：同一类型实体的集合

## 二、联系（Relationship）
### 2.1 联系的概念
- **定义**：实体之间的相互关联
- **联系型**：同类联系的抽象
- **联系集**：同类联系的集合

### 2.2 联系的度数（Degree）
- **一元联系（Degree 1）**：一个实体型内的联系
- **二元联系（Degree 2）**：两个实体型之间的联系
- **多元联系（Degree > 2）**：三个或更多实体型之间的联系

### 2.3 二元联系的类型
1. **一对一联系（1:1）**
   - 定义：实体集A中的一个实体至多与实体集B中的一个实体相联系，反之亦然
   - 示例：班级与班长

2. **一对多联系（1:n）**
   - 定义：实体集A中的一个实体可与实体集B中的多个实体相联系，而实体集B中的一个实体至多与实体集A中的一个实体相联系
   - 示例：班级与学生

3. **多对多联系（m:n）**
   - 定义：实体集A中的一个实体可与实体集B中的多个实体相联系，反之亦然
   - 示例：学生与课程

### 2.4 联系的属性
- **联系也可以有属性**
- **示例**：学生与课程的联系"选课"可以有属性"成绩"

## 三、E-R图
### 3.1 E-R图的表示方法
1. **实体型**：矩形框
2. **属性**：椭圆或圆角矩形，用连线与实体连接
3. **联系**：菱形框，用连线与实体连接
4. **基数（Cardinality）**：在连线上标注联系的类型

### 3.2 E-R图示例
```
  [学生]        [选课]        [课程]
  Sno           Grade         Cno
  Sname                       Cname
  Ssex                        Cpno
  Sage                        Ccredit
  Sdept

  学生 ------<选课>------ 课程
       m            n
```

## 四、E-R模型向关系模型的转换
### 4.1 实体型的转换
- **规则**：一个实体型转换为一个关系模式
- **实体的属性**：关系的属性
- **实体的码**：关系的码

- **示例**：
  - 学生实体 → 学生(Sno, Sname, Ssex, Sage, Sdept)
  - 课程实体 → 课程(Cno, Cname, Cpno, Ccredit)

### 4.2 联系的转换
1. **1:1联系**
   - 方法1：转换为独立的关系模式
   - 方法2：与任意一端的实体合并
   - 示例：班级与班长
     - 班级(班号, 班名, ...)
     - 班长(学号, 姓名, ..., 班号)

2. **1:n联系**
   - 方法1：转换为独立的关系模式
   - 方法2：与n端实体合并（推荐）
   - 示例：班级与学生
     - 班级(班号, 班名, ...)
     - 学生(学号, 姓名, ..., 班号)

3. **m:n联系**
   - 必须转换为独立的关系模式
   - 属性：两端实体的码 + 联系自身的属性
   - 码：两端实体码的组合
   - 示例：学生与课程
     - 选课(学号, 课程号, 成绩)

### 4.3 多元联系的转换
- **转换为独立的关系模式**
- **属性**：各端实体的码 + 联系自身的属性
- **码**：各端实体码的组合

### 4.4 特殊情况的处理
1. **多值属性**
   - 转换为独立的关系模式
   - 属性：原实体的码 + 多值属性

2. **复合属性**
   - 分解为简单属性
   - 每个简单属性作为关系的一个属性

3. **派生属性**
   - 通常不存储在关系中
   - 可以通过计算得到

## 五、E-R模型设计的原则
1. **真实性**：准确反映现实世界
2. **避免冗余**：避免不必要的数据重复
3. **简单性**：结构清晰，易于理解
4. **完整性**：保证数据的完整性约束

## 六、E-R模型的优化
1. **合并实体型**：如果有1:1联系，可以考虑合并
2. **消除冗余属性**：删除可以通过其他属性计算得到的属性
3. **消除冗余联系**：删除可以通过其他联系推导出来的联系

---

## 章节：数据库系统PPT-ch8-规范化笔记

# 数据库系统PPT-ch8-规范化笔记

## 一、问题的提出
### 1.1 关系模式的冗余问题
- **数据冗余**：相同数据重复存储
- **更新异常**：更新数据时可能导致不一致
- **插入异常**：应该插入的数据无法插入
- **删除异常**：不该删除的数据被删除

### 1.2 示例
关系模式：S-L-C(Sno, Sdept, Sloc, Cno, Grade)
- 问题：
  - 数据冗余：Sdept、Sloc重复存储
  - 更新异常：修改Sdept需要修改多个地方
  - 插入异常：新学生还没选课无法插入
  - 删除异常：删除选课信息会删除学生信息

## 二、函数依赖
### 2.1 函数依赖的定义
- **定义**：设R(U)是一个属性集U上的关系模式，X和Y是U的子集。若对于R(U)的任意一个可能的关系r，r中不可能存在两个元组在X上的属性值相等，而在Y上的属性值不等，则称"X函数确定Y"或"Y函数依赖于X"，记作X→Y。

### 2.2 函数依赖的分类
1. **平凡函数依赖**：Y⊆X
2. **非平凡函数依赖**：Y⊈X
3. **完全函数依赖**：X→Y，且对于X的任何真子集X'，都有X'↛Y，记作X→F→Y
4. **部分函数依赖**：X→Y，且存在X的真子集X'，使得X'→Y，记作X→P→Y
5. **传递函数依赖**：X→Y，Y→Z，且Y↛X，Y⊈X，Z⊈Y，则称Z传递函数依赖于X

### 2.3 码的定义
1. **候选码**：设K为R<U,F>中的属性或属性组合，若K→F→U，则K为R的候选码
2. **主码**：选定的一个候选码
3. **主属性**：包含在任何候选码中的属性
4. **非主属性**：不包含在任何候选码中的属性
5. **全码**：整个属性组都是码

### 2.4 函数依赖的公理系统
1. **自反律**：若Y⊆X⊆U，则X→Y为F所蕴含
2. **增广律**：若X→Y为F所蕴含，且Z⊆U，则XZ→YZ为F所蕴含
3. **传递律**：若X→Y和Y→Z为F所蕴含，则X→Z为F所蕴含

### 2.5 推理规则
1. **合并规则**：由X→Y，X→Z，有X→YZ
2. **伪传递规则**：由X→Y，WY→Z，有XW→Z
3. **分解规则**：由X→Y及Z⊆Y，有X→Z

## 三、范式（Normal Form）
### 3.1 第一范式（1NF）
- **定义**：关系模式R的所有属性都是不可再分的基本数据项
- **示例**：
  - 不符合1NF：学生(学号, 姓名, 成绩(数学, 英语))
  - 符合1NF：学生(学号, 姓名, 数学, 英语)

### 3.2 第二范式（2NF）
- **定义**：若R∈1NF，且每一个非主属性完全函数依赖于任何一个候选码，则R∈2NF
- **作用**：消除部分函数依赖
- **示例**：
  - 原模式：S-L-C(Sno, Sdept, Sloc, Cno, Grade)，主码(Sno, Cno)
    - Sno→Sdept（部分函数依赖）
    - Sno→Sloc（部分函数依赖）
    - (Sno, Cno)→F→Grade
    - 不属于2NF
  - 分解为：
    - S-C(Sno, Cno, Grade)
    - S-L(Sno, Sdept, Sloc)
    - 都属于2NF

### 3.3 第三范式（3NF）
- **定义**：关系模式R<U,F>中若不存在这样的码X、属性组Y及非主属性Z(Z⊈Y)，使得X→Y，Y→Z成立，Y↛X，则称R<U,F>∈3NF
- **等价定义**：若R∈2NF，且每一个非主属性都不传递依赖于码，则R∈3NF
- **作用**：消除传递函数依赖
- **示例**：
  - 原模式：S-L(Sno, Sdept, Sloc)，主码Sno
    - Sno→Sdept
    - Sdept→Sloc
    - Sno→传递→Sloc
    - 不属于3NF
  - 分解为：
    - S-D(Sno, Sdept)
    - D-L(Sdept, Sloc)
    - 都属于3NF

### 3.4 BC范式（BCNF）
- **定义**：关系模式R<U,F>∈1NF，若X→Y且Y⊈X时X必含有码，则R<U,F>∈BCNF
- **等价定义**：每一个决定属性因素都包含码
- **作用**：消除主属性对码的部分和传递依赖
- **示例**：
  - 关系模式：STJ(S, T, J)，函数依赖：
    - (S, J)→T
    - (S, T)→J
    - T→J
    - 候选码：(S, J)和(S, T)
    - 属于3NF（没有非主属性），但不属于BCNF（T→J，T不包含码）
  - 分解为：
    - ST(S, T)
    - TJ(T, J)
    - 都属于BCNF

### 3.5 第四范式（4NF）
- **定义**：关系模式R<U,F>∈1NF，如果对于R的每个非平凡多值依赖X→→Y(Y⊈X)，X都含有码，则R∈4NF
- **作用**：消除多值依赖

## 四、关系模式的规范化
### 4.1 规范化的基本思想
- **逐步消除数据依赖中不合适的部分**
- **使模式中的各关系模式达到某种程度的"分离"**
- **采用"一事一地"的模式设计原则**

### 4.2 规范化步骤
1. **1NF**：消除非原子属性
2. **2NF**：消除部分函数依赖
3. **3NF**：消除传递函数依赖
4. **BCNF**：消除主属性对码的部分和传递依赖
5. **4NF**：消除多值依赖

### 4.3 模式分解的准则
1. **分解具有无损连接性**：分解后的关系通过自然连接可以恢复原关系
2. **分解要保持函数依赖**：分解后的关系能够保持原有的函数依赖

## 五、总结
规范化理论是数据库设计的重要理论基础。通过逐步消除不合适的数据依赖，可以设计出结构合理的数据库模式，避免数据冗余、更新异常、插入异常和删除异常等问题。在实际应用中，需要根据具体需求权衡，不一定非要达到最高范式。

---

## 章节：数据库系统PPT-ch9- DataBase Design-OK笔记

# 数据库系统PPT-ch9- DataBase Design-OK笔记

## 一、数据库设计概述
### 1.1 数据库设计的概念
- **数据库设计**：对于一个给定的应用环境，构造最优的数据库模式，建立数据库及其应用系统，使之能够有效地存储数据，满足各种用户的应用需求
- **目标**：
  - 满足用户的应用需求
  - 良好的数据库性能
  - 易于理解和维护

### 1.2 数据库设计的特点
1. **三分技术，七分管理，十二分基础数据**
2. **数据库设计应该与应用系统设计相结合**

### 1.3 数据库设计的方法
1. **手工试凑法**：早期方法，缺乏科学理论和工程方法
2. **规范化设计法**：基于E-R模型
3. **计算机辅助设计法**：使用设计工具

## 二、数据库设计的步骤
### 2.1 需求分析
- **任务**：详细调查现实世界要处理的对象，充分了解原系统的工作概况，明确用户的各种需求
- **方法**：
  - 调查组织机构情况
  - 调查各部门的业务活动情况
  - 协助用户明确对新系统的各种要求
  - 确定新系统的边界
- **成果**：数据流图（DFD）、数据字典（DD）

### 2.2 概念结构设计
- **任务**：将需求分析得到的用户需求抽象为信息结构
- **方法**：E-R模型方法
- **设计策略**：
  - 自顶向下：首先定义全局概念结构，然后逐步细化
  - 自底向上：首先定义各局部应用的概念结构，然后集成
  - 逐步扩张：首先定义最重要的核心概念结构，然后向外扩充
  - 混合策略：自顶向下和自底向上相结合
- **步骤**：
  1. 选择局部应用
  2. 逐一设计分E-R图
  3. 集成各分E-R图，生成初步E-R图
  4. 修改与重构，生成基本E-R图
- **E-R图集成时的冲突**：
  1. 属性冲突：属性域冲突、属性取值单位冲突
  2. 命名冲突：同名异义、异名同义
  3. 结构冲突：同一对象在不同应用中具有不同的抽象、同一实体在不同分E-R图中所包含的属性个数和排列次序不完全相同、实体之间的联系在不同分E-R图中呈现不同的类型

### 2.3 逻辑结构设计
- **任务**：将概念结构转换为某个DBMS所支持的数据模型，并对其进行优化
- **步骤**：
  1. 将概念结构转换为一般的关系、网状、层次模型
  2. 将转换来的关系、网状、层次模型向特定DBMS支持下的数据模型转换
  3. 对数据模型进行优化
- **E-R模型向关系模型转换**：
  - 实体型转换为关系模式
  - 联系转换为关系模式（1:1、1:n、m:n）
- **数据模型优化**：
  - 确定数据依赖
  - 对数据依赖进行极小化处理
  - 确定各关系模式属于第几范式
  - 根据需求分析阶段得到的处理要求，分析对于这样的应用环境这些模式是否合适，确定是否要对它们进行合并或分解
  - 对关系模式进行必要的调整

### 2.4 物理结构设计
- **任务**：为逻辑数据模型选取一个最适合应用环境的物理结构
- **内容**：
  - 为关系模式选择存取方法（建立索引）
  - 设计关系、索引等数据库文件的物理存储结构
- **存取方法选择**：
  - 索引方法：B+树索引、哈希索引
  - 聚簇方法：将有关的元组集中存放在一个物理块内
- **确定数据库的存储结构**：
  - 确定数据的存放位置
  - 确定系统配置

### 2.5 数据库实施
- **任务**：用DDL定义数据库结构，组织数据入库，编制与调试应用程序，数据库试运行
- **步骤**：
  1. 定义数据库结构
  2. 数据的载入
  3. 应用程序的调试
  4. 数据库试运行

### 2.6 数据库运行和维护
- **任务**：数据库的转储和恢复，数据库的安全性、完整性控制，数据库性能的监督、分析和改进，数据库的重组织和重构造
- **内容**：
  1. 数据库的转储和恢复
  2. 数据库的安全性、完整性控制
  3. 数据库性能的监督、分析和改进
  4. 数据库的重组织
  5. 数据库的重构造

## 三、数据库设计的原则
1. **了解用户需求**：充分了解用户的需求
2. **规范化与非规范化**：根据实际需求权衡
3. **数据完整性**：保证数据的正确性和一致性
4. **性能考虑**：考虑查询性能、更新性能
5. **扩展性**：考虑未来的扩展需求

## 四、数据库设计的工具
1. **E-R图设计工具**：PowerDesigner、ERWin、Visio
2. **数据库建模工具**：MySQL Workbench、Oracle SQL Developer Data Modeler
3. **CASE工具**：Rational Rose、PowerDesigner