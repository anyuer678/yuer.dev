---
title: Spring 核心速记：IoC、AOP 与 Spring MVC
date: 2026-06-20
type: learning
tags: [Spring, Java, 课程笔记]
summary: 软件开发架构平台课程的 Spring 部分笔记：IoC 控制反转、AOP 面向切面、Spring MVC 七步流程，基于老师课件整理。
---

## 这门课在讲什么

大二下的《软件开发架构平台》从 Java Web 的三大框架讲起：表示层（Struts / Spring MVC）、持久层（MyBatis / Hibernate）、容器类（Spring）。演进路线是 SSH → SSM → Spring Boot 版 SSM。下面是我按模块整理的笔记，表格居多，方便考前速查。

## 框架与 IoC

**MVC 三层**：`Servlet(Controller) → Service → DAO + POJO + JSP(View)`。

框架分两类：高侵入（继承框架类）和低侵入（反射 / IoC / AOP），Spring 走低侵入路线。Maven 负责依赖管理：POM + 坐标（groupId/artifactId/version）+ 仓库（本地/中央/私服）+ 约定目录，常用 6 个命令 `compile / test / clean / package / install / deploy`。

**IoC（控制反转）** = 组件的构建与使用分离，目标是高内聚低耦合。教材用"HelloWorld 五阶段"演示演进：硬编码 → 外部参数 → 面向对象 → 面向接口（构造注入）→ 工厂模式（完全解耦）。

实现三要素：面向接口编程 + 工厂模式 + 依赖注入（DI）。

| Bean 作用域 | 说明 |
|---|---|
| singleton | 默认，单例 |
| prototype | 每次新建 |
| request / session | Web 环境下按请求/会话 |

实例化三种方式：构造器（默认无参）、静态工厂（`factory-method`）、实例工厂（`factory-bean + factory-method`）。生命周期：实例化 → 属性赋值 → 初始化 → 销毁。

DI 两种方式：**构造注入**（强制依赖）vs **Setter 注入**（可选依赖）。注解用 `@Component/@Controller/@Service/@Repository` + `@Autowired` 自动装配。`BeanFactory` 是基础接口，`ApplicationContext` 在其上增加国际化与事件机制。

## AOP 面向切面

AOP 用横向抽取替代纵向继承，解决日志、安全、事务这类横切关注点。

概念链：关注点 → 横切关注点 → 切面（Aspect）→ 连接点（JoinPoint）→ 建议（Advice）→ 织入（Weaving）。

Advice 类型：`@Before / @After / @Around / @AfterThrowing / @AfterReturning`。三种实现：编译期（AspectJ）、类加载器（字节码增强）、运行时（动态代理）。动态横切改行为，静态横切（引介）改结构。Spring 推荐 AspectJ 方案：`@Aspect + @Around + @Pointcut`。

日志体系：门面（SLF4J/JCL）+ 实现（Log4j/Logback/JUL/Log4j2）分离。级别：`TRACE → DEBUG → INFO → WARN → ERROR → FATAL → OFF`。

## Spring MVC 七步流程

`DispatcherServlet → HandlerMapping → Controller → ModelAndView → ViewResolver → View 渲染 → Response`（口诀：前→映→控→M→视→渲→响）。

参数获取：`@RequestParam`（查询参数）、`@RequestBody`（JSON 体）、`@PathVariable`（路径变量）。响应：`@ResponseBody`（JSON）/ `ModelAndView`（视图）。映射：`@RequestMapping` 细分为 `@GetMapping/@PostMapping/@PutMapping/@DeleteMapping`。`@RestController = @Controller + @ResponseBody`。

参数校验：`@Valid`（JSR-303，可嵌套）vs `@Validation`（Spring，仅形参）。拦截器 `HandlerInterceptor` 三方法：`preHandle → postHandle → afterCompletion`，基于 AOP；Filter 是 Servlet 规范，Interceptor 是 Spring AOP。模板引擎演进：JSP → FreeMarker → Thymeleaf（推荐）。

## 对比速查（容易混的点）

| 对比 | 一句话 |
|---|---|
| IoC vs DI | IoC 是原则，DI 是实现 |
| 构造注入 vs Setter | 构造=强制，Setter=可选 |
| BeanFactory vs ApplicationContext | BF 基础，AC 加国际化事件 |
| singleton vs prototype | 单例 vs 每次新建 |
| 日志门面 vs 实现 | 门面=接口，实现=具体库 |
| Filter vs Interceptor | Servlet 规范 vs Spring AOP |
| @Valid vs @Validation | JSR-303 可嵌套 vs Spring 仅形参 |
