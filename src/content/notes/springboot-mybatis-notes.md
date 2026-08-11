---
title: Spring Boot 与持久层：ORM、MyBatis、MyBatis-Plus
date: 2026-06-20
type: learning
tags: [Spring Boot, MyBatis, Java, 课程笔记]
summary: 软件开发架构平台课程的持久层笔记：Spring Boot 配置与多环境、JPA 方法名查询、MyBatis 动态 SQL、缓存与分页、Hibernate 三状态、MyBatis-Plus。
---

## Spring Boot 核心

### 四大核心

- **Starter**：依赖整合，一个 starter 带一组依赖
- **自动配置**：条件化装配
- **CLI**：Groovy 脚本快速开发
- **Actuator**：监控

入口类：`@SpringBootApplication` + `SpringApplication.run()`。

### 配置文件与多环境

`application.properties` 配置项分类：

- **服务器**：`server.port=8080`、`server.servlet.context-path`
- **数据源**：`spring.datasource.url/driver-class-name/username/password`
- **JPA**：`spring.jpa.hibernate.ddl-auto`（update/create/none）
- **日志**：`logging.level.*`

**多环境**：`application-dev.properties`、`application-prod.properties`，在 `application.properties` 里 `spring.profiles.active=dev` 切换；启动参数 `--spring.profiles.active=prod` 可覆盖。

### Actuator 监控端点

- `health`（健康检查，配合探活）
- `info`（自定义信息）
- `metrics`（指标）
- `beans` / `mappings`（已注册 Bean / 路由映射）
- `env`（环境变量，注意别在生产暴露敏感值）
- `loggers`（运行时调日志级别）

默认只暴露 health；用 `management.endpoints.web.exposure.include=*` 全开（生产慎用）。

## ORM 是什么

ORM（对象关系映射）= 把瞬态内存数据映射到持久化存储。四层演进：

`JDBC → JDBC Template → MyBatis（半自动）→ Hibernate/JPA（全自动）`

JDBC 调用链：`Driver → Connection → Statement/PreparedStatement → ResultSet`。JDBC Template 的 `execute/update/batchUpdate/query/queryXXX` + `RowMapper` 做结果映射。

JPA 三方面：ORM 映射元数据 + API 接口 + JPQL。

## Spring Data JPA（方法名查询）

不用写 SQL，**接口方法名就是查询**：

```java
List<User> findByName(String name);
Optional<User> findByEmail(String email);
List<User> findByAgeGreaterThan(int age);
List<User> findByNameAndAge(String name, int age);
```

支持 `And/Or/Not`、`GreaterThan/LessThan/Between/In/Like`、`OrderBy` 组合；复杂查询用 `@Query("select u from User u where u.email = ?1")` 写 JPQL，或原生 SQL `@Query(value = "...", nativeQuery = true)`。

## MyBatis 四大件

1. `Configuration.xml`（全局配置）
2. `SqlSessionFactory / SqlMapper`
3. `Mapper.xml`
4. Java API

Mapper.xml 核心：`namespace`（唯一标识）+ `id` + `parameterType` + `resultType`。

关键点：

- **`#{}` vs `${}`**：`#{}` 预编译防注入，`${}` 直接拼接有风险
- **resultType vs resultMap**：resultType 简单（80% 场景），resultMap 复杂（20%），不可同时用；resultMap 可处理字段名与属性名不一致、一对一/一对多关联映射
- **动态 SQL 四标签**：`if`、`choose/when/otherwise`、`trim/where/set`、`foreach`
- **延迟加载**：`lazyLoadingEnabled=true`，关联对象用到时才查

### MyBatis 缓存

- **一级缓存**（默认开）：SqlSession 级别，同一个 session 内重复查询直接返回缓存结果；session 关闭即失效
- **二级缓存**（需配置）：namespace 级别，跨 session 共享；在 Mapper.xml 里用 `cache` 标签开启；注意缓存的是查询结果，数据变更（增删改）会触发缓存刷新
- 查询频繁、变更少的表适合开缓存；实时性要求高的数据慎用

### 分页：PageHelper

```java
PageHelper.startPage(1, 10);          // 当前页、每页条数
List<User> users = userMapper.findAll();
PageInfo<User> pageInfo = new PageInfo<>(users);  // 含 total/pages 等
```

依赖 `pagehelper-spring-boot-starter`，先 `startPage` 再执行查询，自动拼接 limit。

### 最佳实践

- 参数与返回都用类型别名（typeAliases 配置）少写全限定名
- 开日志（`logging.level.com.example.mapper=debug`）看实际执行的 SQL
- 事务：`@Transactional` 声明式事务，写操作默认自动提交需注意与批量操作配合
- SQL 优化：只查需要的列，避免 `select *`；索引列上用函数会让索引失效
- 合理使用缓存，不要所有表都开二级缓存

MyBatis 三剑客：generator（代码生成）、plugin（IDE 插件）、PageHelper（分页）。

## Hibernate 三状态

`transient（瞬时，new）→ persistence（持久，save）→ detached（脱管，close）`，`update` 可重回持久。

注解：`@Entity @Table @Id @GeneratedValue @Column`。

**阻抗不匹配**（对象模型 vs 关系模型）五方面：粒度、继承、标识、关联、数据导航。

## MyBatis-Plus

面向对象操作，Lambda + ActiveRecord，无侵入 AOP 实现——不用写 SQL 也能做基础 CRUD。

## 对比速查

| 对比 | 一句话 |
|---|---|
| MyBatis vs Hibernate | 半自动（自己写 SQL）vs 全自动（生成 SQL） |
| #{} vs ${} | 预编译安全 vs 拼接有风险 |
| resultType vs resultMap | 简单映射 vs 复杂映射 |
| JDBC Template vs MyBatis | 封装 JDBC vs 半自动 ORM |
| JPA 方法名查询 vs @Query | 简单查询靠命名约定 vs 复杂查询手写 JPQL |
