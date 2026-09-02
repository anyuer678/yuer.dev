---
title: "软件开发架构平台完整知识点总结"
date: "2025-07"
type: "learning"
tags: [Spring, SpringBoot, MyBatis, AOP, IoC]
summary: "软件开发架构平台全课程完整知识点总结"
---

# 《软件开发架构平台》完整知识点总结

> 本总结涵盖CH01-CH12所有章节的核心知识点  
> 适用于期末复习和考试准备

---

## 目录

- [CH01 开发架构和框架技术概述](#ch01-开发架构和框架技术概述)
- [CH02 Spring IoC原理和实现](#ch02-spring-ioc原理和实现)
- [CH03 Spring AOP原理和实现](#ch03-spring-aop原理和实现)
- [CH04 Spring MVC](#ch04-spring-mvc)
- [CH05 Spring Boot和ORM简介](#ch05-spring-boot和orm简介)
- [CH06 ORM的实现方式](#ch06-orm的实现方式)
- [CH07 前后端分离与RESTful API简介](#ch07-前后端分离与restful-api简介)
- [CH08 RESTful API进阶](#ch08-restful-api进阶)
- [CH09 前端独立开发和ES6异步请求](#ch09-前端独立开发和es6异步请求)
- [CH10 前端工程化与模块化](#ch10-前端工程化与模块化)
- [CH11 前端框架技术简介](#ch11-前端框架技术简介)
- [CH12 前端框架技术进阶](#ch12-前端框架技术进阶)

---

## CH01 开发架构和框架技术概述

### 1.1 课程概述
- **课程名称**：软件开发架构平台（Java EE平台）
- **前置知识**：JavaSE, JDBC, JSP/Servlet, HTML/CSS/XML, JavaScript, DB/SQL
- **考试形式**：闭卷考试(60%) + 实验(40%)
- **参考书籍**：Spring in Action 4th & 5th

### 1.2 企业级Web应用核心技术
**开发架构（人）**：
- 系统分层MVC
- 前后端分离
- 各种框架技术

**系统架构（机器）**：
- 数据缓存技术
- 服务器集群部署
- 服务和Rest API设计

### 1.3 MVC架构细分
在应用开发中，Model进一步细分为：
- **业务Bean**：完成业务逻辑
- **DAO**（Data Access Object）：实现数据持久化操作
- **POJO**（Plain Old Java Object）：仅用于表达数据的值对象

### 1.4 框架分类
| 框架类型 | 代表框架 | 解决问题 |
|---------|---------|---------|
| 表示层框架 | Struts, Spring MVC | View层和Controller层的规范和简化 |
| 持久层框架 | MyBatis, Hibernate, JPA | Model层中DAO代码的规范和简化 |
| 容器类框架 | Spring, EJB | 各组件之间的耦合问题（横向和纵向） |

### 1.5 主流框架组合
- **SSH**：Spring + Struts2 + Hibernate
- **SSM**：Spring + Spring MVC + MyBatis
- **现代主流**：Spring Boot + Spring MVC + MyBatis

### 1.6 Struts框架发展

#### Struts 1
- 2000年5月，Craig R. McClanahan提交Web框架前身
- 2001年6月，Struts 1.0发布
- **2013年4月EOL（终止支持）**

#### Struts 2
- 基于WebWork 2.3进行改良
- 本质上和Struts 1.x没有关系
- 最新版本为2.5.26
- **目前Spring MVC使用率已超过Struts 2**

### 1.7 框架的侵入性

**高侵入性**：
- 直接继承或实现第三方框架的类或接口
- 项目脱离开框架时将无法运行
- 例如：Struts 1.x
- 缺点：重构和单元测试效率低，可维护性降低

**低侵入性**：
- 通过反射、动态代理等语言特性
- 结合IoC和AOP等架构理论，动态调用第三方框架
- 例如：Spring、MyBatis
- 优点：项目脱离框架仍可运行，提高可维护性和可扩展性

> 软件架构设计理论中的"高内聚、低耦合"主要目标也是为了降低侵入性。

### 1.8 Maven简介
- 基于项目对象模型（POM）的项目管理机制
- 通过"pom.xml"配置文件管理项目构建和依赖
- 核心功能：解决模块间和插件的依赖关系；实现项目自动化构建与部署

---

## CH02 Spring IoC原理和实现

### 2.1 IoC基本概念

**什么是IoC？**
- **控制反转**（Inversion of Control）：面向对象编程中的一种设计原则，用来降低代码之间的耦合度
- 常用实现方式：**依赖注入**（Dependency Injection，DI）
- 对象在被创建时，由外部实体将依赖的对象引用传递（注入）进来
- 最常见实现：**Spring Framework**

### 2.2 IoC原理演进

#### 1. 经典HelloWorld
```java
public class Helloworld {
    public static void main(String[] args) {
        System.out.println("Helloworld");
    }
}
```

#### 2. 面向对象版本（OOP）
三个功能模块：
- **FileHelloStr类**：从持久化数据中读取信息
- **HelloWorld类**：业务逻辑
- **HelloWorldClient类**：信息输出

**问题**：各部分相互依赖，可维护性和扩展性差

#### 3. 面向接口编程
- 用接口消除业务逻辑层和DAO层的耦合
- 业务逻辑针对接口操作
- 具体DAO类操作委托给外部类

#### 4. 工厂模式 + IoC容器
- 构建专门的工厂类负责创建和集成对象
- 使用通用外部工厂（IoC容器）统一管理对象
- 通过配置文件和反射技术自动创建对象

### 2.3 IoC核心思想
> **解耦合**：将组件的构建与使用分离，实现高内聚、低耦合

**实现基础**：
- 面向接口编程
- 工厂模式
- 依赖注入

### 2.4 Spring IoC容器

#### 核心组件
| 接口 | 说明 |
|-----|------|
| **BeanFactory** | 最基本的工厂接口，提供IoC容器功能 |
| **ApplicationContext** | 构建在BeanFactory之上，增加国际化、事件发布、资源加载等企业级功能 |

#### 使用流程
1. 导入Spring IoC相关依赖包（spring-context）
2. 创建配置文件（applicationContext.xml）
3. 添加`<bean>`配置，定义类、依赖关系
4. 初始化容器，通过`getBean()`获取装配好的对象

### 2.5 Spring Bean配置详解

#### XML配置方式

**基本配置**：
- `id/name`：Bean的唯一实例名
- `class`：类的完整限定名

**依赖注入方式**：
- **构造注入**：`<constructor-arg>`标签
- **Setter注入**：`<property>`标签

**Bean作用域（Scope）**：
| 作用域 | 说明 |
|-------|------|
| singleton | 单实例，IoC容器中只存在一个实例（默认） |
| prototype | 每次getBean()返回新实例 |
| request | 仅Web环境，每次HTTP请求创建新Bean |
| session | 仅Web环境，作用域等同HTTP Session |
| application | 仅Web环境，作用域等同Web Application |

**实例化方式**：
1. 类构造器实例化（默认无参构造）
2. 静态工厂实例化
3. 实例工厂实例化

**生命周期**：
实例化 → 属性赋值 → 初始化 → 销毁

#### 注解配置方式

| 注解 | 说明 |
|-----|------|
| `@Configuration` | 标注配置类 |
| `@Bean` | 方法返回Bean实例 |
| `@Autowired` | 自动装配依赖 |
| `@Component` | 通用组件注解 |
| `@Controller` | Web层组件 |
| `@Service` | 服务层组件 |
| `@Repository` | 持久层组件 |
| `@ComponentScan` | 指定扫描包路径 |

### 2.6 JUnit测试框架
- Java开源的单元测试事实标准框架
- 简化测试环境配置，被主流IDE集成
- 最新版本：JUnit 5.x

---

## CH03 Spring AOP原理和实现

### 3.1 AOP基本概念

**什么是AOP？**
- **面向切面编程**（Aspect Oriented Programming）
- 对OOP的完善和补充，用于减少代码重复
- 1990年由PARC研究人员提出
- 采取**横向抽取机制**，取代传统纵向继承体系

### 3.2 为什么需要AOP？
OOP的局限性：
- 在分散的、不具有继承层次的对象中引入公共行为时，OOP无法避免代码重复
- OOP适合定义从上到下（继承）的关系，不适合定义从左到右（横切）的关系
- 安全验证、日志记录等功能平均分散在所有对象层次中

### 3.3 AOP核心概念

| 概念 | 说明 |
|-----|------|
| **关注点** | 程序需要达到的目标，分为核心关注点和横切关注点 |
| **核心关注点** | 完成核心业务逻辑的关注点 |
| **横切关注点** | 实现代码散落在多个类或方法中的关注点 |
| **切面（Aspect）** | 对横切关注点的模块化封装 |
| **连接点（Join Point）** | 程序执行过程中的特定点（方法调用、字段访问、异常抛出） |
| **建议（Advice）** | 切面切入目标代码的方式（前置、后置、环绕） |
| **引介（Introduction）** | 为现有类或接口添加方法或字段 |
| **织入（Weaving）** | 将切面整合到完整执行流程的过程 |

### 3.4 AOP实现技术

| 时机 | 方式 | 特点 |
|-----|------|------|
| 编译期 | 语言扩展 | 编译器将切面增加到字节码，需定义新关键字 |
| 类加载器 | 特殊类加载器 | 目标类加载到JVM时，重新"增强"字节码 |
| 运行时 | 动态代理 | 通过JVM动态代理或第三方库实现运行期动态织入 |

#### 动态代理实现
- **JDK动态代理**：基于接口，通过`InvocationHandler`实现
- **CGLIB**：基于字节码生成

#### AspectJ实现
- Eclipse项目的一部分
- 使用`.aj`文件定义切面
- 支持动态横切和静态横切

### 3.5 Spring AOP使用
- 支持多种实现：动态代理、字节码生成（CGLIB）、AspectJ
- 从Spring 3.x起推荐使用AspectJ方式
- 配置方式：XML配置 或 注解配置（`@Aspect`、`@Before`、`@Around`等）

### 3.6 Java平台日志系统

#### 日志门面与实现
| 分类 | 描述 | 示例 |
|-----|------|------|
| **日志门面（Facade）** | 提供日志API定义，解耦接口与实现 | SLF4J、Commons-Logging（JCL） |
| **日志系统（Implementation）** | 提供具体的日志输出实现 | Log4j、JUL、Logback、Log4j2 |

#### 主要日志框架
- **Log4j**：Apache开源，7种日志级别
- **JUL**（java.util.logging）：JDK自带
- **JCL**（Apache Commons Logging）：通用日志API
- **SLF4J**：门面模式，统一API
- **Logback**：SLF4J的天然实现，性能优于Log4j
- **Log4j2**：最新日志系统，综合Log4j和Logback优点

---

## CH04 Spring MVC

### 4.1 Spring Framework概述

> "Spring is a Java platform that provides comprehensive infrastructure support for developing Java applications."

**核心理念**：
- 从"plain old Java objects"（POJO）构建应用
- 非侵入式地应用企业服务
- **Don't Reinvent the Wheel**（不要重复发明轮子）

**创始人**：Rod Johnson

### 4.2 Spring MVC简介
- Spring体系中的轻量级Web MVC（表示层）框架
- **核心**：Controller控制器，用于处理请求和响应
- 基于Spring IoC容器运行，所有对象被IoC容器管理

**版本要求**：
- **Spring 5.x**：JDK8+、Servlet 3.1（Tomcat 8.5+）
- **Spring 6.x**：JDK17+、Servlet 5.0（Tomcat 10.x）

### 4.3 Spring MVC体系架构

```
① 请求到达前端控制器(DispatcherServlet)
② 通过HandlerMapping找到URL对应的Controller
③ Controller处理请求（数据、业务逻辑）
④ 返回ModelAndView（模型数据+逻辑视图名）
⑤ ViewResolver将逻辑视图名匹配成具体视图
⑥ 视图进行模型数据和视图实现的渲染
⑦ 交付模型数据，给出Web响应
```

### 4.4 Spring MVC使用详解

#### 1. URL映射
| 注解 | 说明 |
|-----|------|
| `@RequestMapping` | 通用映射，不区分请求方法，常用于类级别 |
| `@GetMapping` | GET请求映射 |
| `@PostMapping` | POST请求映射 |
| `@PutMapping` | PUT请求映射 |
| `@DeleteMapping` | DELETE请求映射 |

#### 2. 获取请求参数
| 方式 | 注解/方法 | 说明 |
|-----|----------|------|
| 方法参数直接接收 | 无 | 前后端属性名一致 |
| 参数映射 | `@RequestParam` | 属性名不一致时 |
| JavaBean封装 | `@RequestBody` | 适合大量参数 |
| URI路径值 | `@PathVariable` | 获取URL中的值 |
| 请求头 | `@RequestHeader` | 获取请求头信息 |

#### 3. 响应处理
- `@ResponseBody`：直接返回响应文本（如JSON）
- `ModelAndView`：封装模型数据和视图名
- `Model/ModelMap`：存放数据，与视图结合

**视图层解决方案**：
- 传统JSP、FreeMarker
- **Thymeleaf**（Spring 3.x起推荐）

#### 4. 参数校验
- `@Validation`：Spring提供的验证机制
- `@Valid`：Hibernate验证（JSR-303），支持嵌套验证

#### 5. 拦截器（Interceptor）
- 作用：前置/后置处理，业务与非业务功能解耦
- 实现机制：基于Spring AOP
- 接口：`HandlerInterceptor`
  - `preHandle()`：前置处理
  - `postHandle()`：后置处理
  - `afterCompletion()`：最终处理

#### 拦截器与过滤器的区别
| 特性 | Filter | Interceptor |
|-----|--------|-------------|
| 基础 | Servlet规范 | Spring AOP |
| 拦截范围 | 任何资源（静态、动态） | 只拦截Controller请求 |
| 配置位置 | web.xml | Spring配置 |
| 执行顺序 | Filter → DispatcherServlet → Interceptor → Controller |

---

## CH05 Spring Boot和ORM简介

### 5.1 Spring Boot简介

**什么是Spring Boot？**
- Spring为简化Spring框架使用推出的组件（工具）
- 目前最新稳定版：3.0.4（基于Spring 6.x、JDK 17）

**主要特点**：
- 极低的学习成本
- 开发可独立运行的Web应用
- **"约定优于配置"**，极大提高开发效率
- 简单的组件依赖，自动发现与自动装配
- 提供运行时应用监控
- 与分布式架构、云计算和大数据组件良好集成

### 5.2 Spring Boot基本原理

#### 主要功能模块
| 模块 | 说明 |
|-----|------|
| **Spring Boot Starter** | 将常用依赖分组整合，合并到一个依赖中 |
| **自动配置** | 基于条件化配置特性，自动化推测和配置bean |
| **命令行接口（CLI）** | 结合Groovy/Gradle简化开发 |
| **Actuator** | 提供Spring框架的管理功能 |

#### 自动配置机制
- `@SpringBootApplication`组合注解包含：
  - `@SpringBootConfiguration`
  - `@EnableAutoConfiguration`
  - `@ComponentScan`
- 通过`@Conditional`注解判断加载条件

### 5.3 ORM简介

**什么是ORM？**
- **对象关系映射**（Object-Relational Mapping）
- 将瞬态数据（内存中的对象）保存到可永久保存的存储设备中

**持久化目标**：
1. 无结构文本文件（I/O技术）
2. 结构化文本文件（SDK API）
3. 关系型数据库（JDBC等）

**ORM实现方式**：
1. JDBC
2. 简化的JDBC（Spring JDBC Template）
3. 半自动ORM框架（MyBatis）
4. 全自动ORM框架（Hibernate、Spring Data JPA）

---

## CH06 ORM的实现方式

### 6.1 MyBatis

**简介**：
- 原名iBatis，2002年由Clinton Begin发布
- 2010年改名为MyBatis
- 基于SQL语句映射的低级别ORM方案

**特点**：
- 支持普通SQL查询、存储过程和高级映射
- 消除几乎所有JDBC代码和参数手工设置
- 使用简单XML或注解将Java POJOs映射成数据库记录

**核心组件**：
| 组件 | 说明 |
|-----|------|
| Configuration.xml | 全局配置文件，包含数据库环境和映射器路径 |
| SqlSessionFactory | 创建SqlSession的工厂类 |
| SqlSession | 用于执行SQL语句（线程非安全） |
| Mapper.xml | SQL映射文件 |

**动态SQL标签**：`<if>`、`<where>`、`<foreach>`、`<choose>`、`<set>`等

### 6.2 Hibernate

**对象三种状态**：
| 状态 | 说明 |
|-----|------|
| Transient（临时） | 通过new创建，未与Session关联 |
| Persistent（持久化） | 与Session关联，改动自动同步到数据库 |
| Detached（脱管） | Session关闭后的持久化对象 |

### 6.3 Spring Data JPA

**接口继承层次**：
```
Repository
  └── CrudRepository
        └── PagingAndSortingRepository
              └── JpaRepository
```

**查询方法命名规则**：
- 以`findBy`、`readBy`、`queryBy`开头
- 支持`And`、`Or`、`Between`、`Like`、`In`等关键字
- 支持`OrderBy`、`Asc`、`Desc`排序

### 6.4 MyBatis生态工具

**MyBatis三剑客**：
1. **MyBatis-Generator**：自动生成Java Bean、Mapper接口和XML文件
2. **MyBatis-Plugin**：IDE插件，快速导航、语法检查
3. **MyBatis-PageHelper**：通用分页插件

**MyBatis-Plus**：
- MyBatis的增强工具
- 特点：无侵入、损耗小、强大功能、简单易用
- 提供Lambda表达式、ActiveRecord模式、自动分页、条件构造器

---

## CH07 前后端分离与RESTful API简介

### 7.1 Web开发模式演变

| 阶段 | 特点 | 优缺点 |
|-----|------|--------|
| **Model I** | 简单快速，前后端不分工 | 不适合复杂业务，可维护性差 |
| **Model II (MVC)** | 开始有前后端分工 | 分工不明确，前端重度依赖后端 |
| **AJAX到前后端分离** | 分工清晰，强调用户体验 | 前端工作量大，带来技术问题 |
| **SPA/MPA** | 后端只提供API，前端独立 | 前后端完全解耦 |

### 7.2 Web服务器 vs 应用服务器
| 类型 | 代表 | 功能 |
|-----|------|------|
| Web服务器 | Apache、Nginx | 处理HTTP协议、静态文件、反向代理 |
| 应用服务器 | Tomcat、JBoss | 编译运行Java Web业务代码 |

### 7.3 RESTful API

**REST六大约束**：
1. 客户端-服务器
2. **无状态**
3. 缓存
4. 分层系统
5. **统一接口**
6. 按需代码（可选）

**HTTP方法**：
| 方法 | 操作 |
|-----|------|
| GET | 获取资源 |
| POST | 创建资源 |
| PUT | 更新完整资源 |
| PATCH | 部分更新资源 |
| DELETE | 删除资源 |

**常用状态码**：
| 状态码 | 含义 |
|-------|------|
| 200 | OK |
| 201 | Created |
| 204 | No Content |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Internal Server Error |

---

## CH08 RESTful API进阶

### 8.1 用户认证问题

**传统Session/Cookie的问题**：
- 前后端分离后浏览器不能自动使用Cookie
- 跨域问题
- 服务器集群后Session不便于存储

**Token机制**：
- 用户登录成功后，服务器生成字符串token
- 与Session的主要区别：服务器是否存储
- 后续请求客户端带上token，服务器根据token认证

### 8.2 JWT（JSON Web Token）

**结构**：Header.Payload.Signature

| 部分 | 说明 |
|-----|------|
| **Header** | 元数据（alg签名算法、typ类型） |
| **Payload** | 实际数据（iss签发人、exp过期时间、sub主题等） |
| **Signature** | 签名，防止数据篡改 |

**特点**：
- 默认不加密，但可选加密
- 可用于认证和数据传输
- 缺点：token发出后无法废止或修改
- 建议：设置短的有效时间，使用HTTPS传输

### 8.3 OAuth 2.0

**授权码流程**：
1. 用户授权
2. 获取授权码（code）
3. 获取access token
4. 访问资源

**四个角色**：
- 资源所有者
- 客户端
- 授权服务器
- 资源服务器

### 8.4 CORS（跨域资源共享）

**解决方案**：
- 开发环境：前端代理、后端配置CORS
- 生产环境：Nginx反向代理

---

## CH09 前端独立开发和ES6异步请求

### 9.1 Promise对象

**简介**：
- ES6引入的异步编程解决方案
- 用于替代传统的回调函数和事件处理
- 是一个容器，保存异步操作的结果

**三种状态**：
| 状态 | 说明 |
|-----|------|
| pending | 进行中（初始状态） |
| fulfilled | 已成功 |
| rejected | 已失败 |

**特点**：
- 状态不受外界影响
- 一旦状态改变，不会再变（不可逆）
- 通过`then()`、`catch()`、`finally()`处理结果

**链式调用**：替代回调地狱，使代码更清晰

### 9.2 async/await

- `async`：声明异步函数，返回Promise对象
- `await`：等待Promise状态改变，返回resolve值
- 优点：以同步方式编写异步代码，可读性强
- 注意：reject需用`try...catch`捕获

### 9.3 fetch()函数

- ES6标准中原生HTTP请求API
- 基于Promise实现
- 现代浏览器原生支持

**Response对象方法**：
- `response.ok`：HTTP状态码2xx为true
- `response.json()`：解析JSON
- `response.text()`：返回文本

**注意**：fetch()不会自动reject HTTP错误状态

### 9.4 axios

**特点**：
- 基于Promise的第三方HTTP库
- 浏览器和Node.js都可用
- 自动转换JSON数据
- 支持请求/响应拦截器
- 支持请求取消
- 更好的错误处理

**fetch() vs axios**：
| 特性 | fetch() | axios |
|-----|---------|-------|
| 是否原生 | 是 | 否（第三方） |
| JSON处理 | 手动 | 自动 |
| 错误处理 | 需手动检查 | 自动reject |
| 拦截器 | 不支持 | 支持 |
| 超时设置 | 不支持 | 支持 |
| 浏览器兼容 | 现代浏览器 | 兼容旧版本 |

---

## CH10 前端工程化与模块化

### 10.1 前端工程化概念

**四个方面**：
1. **模块化**：大工程拆分成小工程，编译或运行时拼装
2. **组件化**：UI拆分成独立、可复用的组件
3. **规范化**：代码风格、目录结构、开发流程标准
4. **自动化**：构建、测试、部署流程自动化

### 10.2 Node.js

**简介**：
- 跨平台、开源的服务端JavaScript运行环境
- 基于Chrome V8引擎
- 可运行在Windows、Linux、macOS等系统

**版本管理**：
- 使用NVM（Node Version Manager）管理多个版本

### 10.3 NPM

**常用命令**：
| 命令 | 说明 |
|-----|------|
| `npm init` | 初始化项目，生成package.json |
| `npm install <package>` | 安装依赖 |
| `npm install -D <package>` | 安装开发依赖 |
| `npm install -g <package>` | 全局安装 |

**其他包管理工具**：
- **Yarn**：Facebook推出，解决npm安装慢、版本一致性问题
- **pnpm**：速度更快，节省磁盘空间，支持monorepo

### 10.4 模块化规范

| 规范 | 导出 | 导入 | 特点 |
|-----|------|------|------|
| **CommonJS** | `module.exports` | `require()` | Node.js默认，运行时加载 |
| **ES6 Module** | `export` | `import` | 静态语法，编译时加载 |

**区别**：
- CommonJS导出值的拷贝，ES6导出值的引用
- CommonJS动态语法，ES6静态语法（只能写在顶层）

### 10.5 Webpack

**核心概念**：
| 概念 | 说明 |
|-----|------|
| **entry** | 入口，指定从哪个模块开始构建 |
| **output** | 输出，指定打包后文件的位置和文件名 |
| **loader** | 加载器，处理非JS资源（CSS、图片等） |
| **plugin** | 插件，执行更广范围的任务 |
| **mode** | 模式（development/production） |

### 10.6 Vite

**特点**：
- 极速服务启动（利用原生ESM）
- 优化的构建（基于Rollup）
- 轻量快速的热重载
- 开箱支持TypeScript、JSX、CSS

---

## CH11 前端框架技术简介

### 11.1 前端开发的问题

**代码层面**：
- 缺少规范，代码组织混乱
- 缺少限制和约束，变量作用域冲突
- 缺少支撑，对程序员能力要求高

**效率层面**：
- 项目没有结构化
- 团队协作效率低
- 测试效率低

### 11.2 模板渲染 - Hogan.js
- Twitter团队开发的Mustache模板语法解析器
- 不依赖其他库，高效率模板解析

### 11.3 Angular JS

**简介**：
- 2009年诞生，由Misko Hevery创建，后被Google收购
- 2022年1月正式停止支持

**主要贡献**：
- 在前端首次提出MVC(MVVM)概念
- 实现View和Model的双向绑定

**核心概念**：
- View（视图）
- Model（模型）
- Template（模板）
- ViewModel/Scope（视图模型/作用域）
- 数据绑定

### 11.4 Angular

**与Angular JS的区别**：
- Angular JS：2009年发布，已停止支持
- Angular：2016年发布，完全重新设计的框架
- 除了名字和团队类似外，没有其他联系

### 11.5 React

**简介**：
- 用于构建用户界面的JavaScript库
- 专注于视图层，不是完整的MVC框架
- 2013年由Facebook开源
- 目前最新版本：19.x
- 发展出React Native用于移动端开发

**核心特性**：
1. **虚拟DOM**：内存中轻量级DOM表示，通过Diff算法最小化真实DOM操作
2. **声明式编程 & JSX**：类似XML的JSX语法在JS中编写HTML
3. **组件化**：函数组件/类组件，通过Props接收数据，State管理内部状态

### 11.6 Vue

**简介**：
- 2014年由尤雨溪（Evan You）创建
- 渐进式框架，可逐步集成到现有项目
- 学习曲线平缓，API简洁

**核心特性**：
1. **模板语法与指令**：基于HTML的模板，使用`v-`指令
2. **响应式双向绑定**：数据变化自动更新视图
3. **组件化**：每个组件包含模板、数据、逻辑及生命周期
4. **虚拟DOM**（从2.x版本引入）
5. **进阶功能**：Vue Router、Vuex/Pinia

### 11.7 三大框架对比

| 对比维度 | Angular | React | Vue |
|---------|---------|-------|-----|
| 背景 | Google | Facebook | 尤雨溪/Alibaba |
| 数据绑定 | 双向绑定 | 单向绑定 | 双向绑定 |
| 模板能力 | 强大 | 自由（JSX） | 简洁（HTML模板） |
| 上手难度 | 较高 | 较高 | 一般 |
| 文档 | 英文 | 英文 | 多语言（中文支持好） |
| 核心贡献 | MVC/MVVM、双向绑定 | 虚拟DOM、JSX、组件化 | 渐进式、易用性 |

---

## CH12 前端框架技术进阶

### 12.1 React状态管理

**三个层次**：

#### 1. 组件内的状态管理
- 使用`useState` Hook
- 适合局部状态（输入框内容、点击次数等）

#### 2. 组件之间的状态管理（状态提升）
- 将共享状态提升到共同父组件
- 通过props向下传递
- 缺点：层级深时产生Props Drilling

#### 3. 全局状态管理（状态管理库）
| 工具 | 特点 |
|-----|------|
| **Context API** | React内置，适合轻量场景 |
| **Redux** | 工业级，单向数据流 |
| **Zustand** | 极简、Hooks风格 |
| **Recoil/Jotai/MobX** | 其他选择 |

**React Hooks概念**：
- Hooks是React提供的"钩子"
- 让函数组件"挂载"到React内部机制上
- 常用Hooks：`useState`、`useEffect`、`useContext`、`useReducer`、`useRef`

### 12.2 Vue状态管理

| 层次 | 使用方式 | 适用场景 |
|-----|----------|----------|
| 组件内部状态 | `data()`或`ref()` | 组件独享数据 |
| 父子组件传值 | `props`/`emit` | 一层层传递 |
| 跨组件共享 | `provide`/`inject` | 类似React Context |
| 全局状态 | **Pinia**（推荐）/ Vuex | 大型项目 |

### 12.3 路由管理

**什么是路由管理？**
- 单页应用（SPA）的关键工具
- 实现无刷新页面跳转
- 将"路径（URL）"映射到"组件"

#### React路由（React Router）
| 概念 | API |
|-----|-----|
| 创建路由 | `createBrowserRouter()` |
| 路由容器 | `<Routes>` / `<Route>` |
| 编程式导航 | `useNavigate()` |
| 声明式导航 | `<Link>` |

#### Vue路由（Vue Router）
| 概念 | API |
|-----|-----|
| 创建路由 | `createRouter()` |
| 路由视图 | `<RouterView>` |
| 编程式跳转 | `router.push()` |
| 声明式导航 | `<router-link>` |

#### 路由高级用法
1. **嵌套路由**：父路由内包含子路由
2. **懒加载**：按需加载页面组件，提升性能
3. **页面守卫**：路由跳转前进行权限验证

---

## 附录：技术栈总览

### 后端技术栈
| 领域 | 技术 |
|-----|------|
| 基础框架 | Spring Framework、Spring Boot |
| 数据访问 | JDBC、MyBatis、Hibernate、Spring Data JPA |
| Web层 | Spring MVC、RESTful API |
| 安全 | Spring Security、JWT、OAuth 2.0 |
| 构建工具 | Maven |
| 日志 | SLF4J、Logback、Log4j2 |

### 前端技术栈
| 领域 | 技术 |
|-----|------|
| 基础 | HTML5、CSS3、JavaScript(ES6+) |
| 异步编程 | Promise、async/await、fetch、axios |
| 模块化 | CommonJS、ES6 Module |
| 构建工具 | Webpack、Vite |
| 包管理 | NPM、Yarn、pnpm |
| 框架 | React、Vue、Angular |
| 路由 | React Router、Vue Router |
| 状态管理 | Redux、Pinia、Zustand |

---

*知识点总结完*
