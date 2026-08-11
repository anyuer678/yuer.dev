---
title: Spring Boot 与持久层：ORM、MyBatis、MyBatis-Plus
date: 2026-06-20
type: learning
tags: [Spring Boot, MyBatis, Java, 课程笔记]
summary: 软件开发架构平台课程的持久层笔记：Spring Boot 四大核心、JDBC 调用链、MyBatis 四大件与动态 SQL、Hibernate 三状态、MyBatis-Plus，基于老师课件整理。
---

## Spring Boot 四大核心

- **Starter**：依赖整合，一个 starter 带一组依赖
- **自动配置**：条件化装配
- **CLI**：Groovy 脚本快速开发
- **Actuator**：监控

入口类：`@SpringBootApplication` + `SpringApplication.run()`。

## ORM 是什么

ORM（对象关系映射）= 把瞬态内存数据映射到持久化存储。四层演进：

`JDBC → JDBC Template → MyBatis（半自动）→ Hibernate/JPA（全自动）`

JDBC 调用链：`Driver → Connection → Statement/PreparedStatement → ResultSet`。JDBC Template 的 `execute/update/batchUpdate/query/queryXXX` + `RowMapper` 做结果映射。

JPA 三方面：ORM 映射元数据 + API 接口 + JPQL。

## MyBatis 四大件

1. `Configuration.xml`（全局配置）
2. `SqlSessionFactory / SqlMapper`
3. `Mapper.xml`
4. Java API

Mapper.xml 核心：`namespace`（唯一标识）+ `id` + `parameterType` + `resultType`。

关键点：

- **`#{}` vs `${}`**：`#{}` 预编译防注入，`${}` 直接拼接有风险
- **resultType vs resultMap**：resultType 简单（80% 场景），resultMap 复杂（20%），不可同时用
- **动态 SQL 四标签**：`if`、`choose/when/otherwise`、`trim/where/set`、`foreach`
- **延迟加载**：`lazyLoadingEnabled=true`，关联对象用到时才查

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
