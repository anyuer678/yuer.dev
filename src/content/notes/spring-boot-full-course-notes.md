---
title: "软件开发架构平台全课程总结（完整版）"
date: "2025-07"
type: "learning"
tags: [Spring, SpringBoot, RESTful, Vue, React]
summary: "软件开发架构平台全课程完整版总结，覆盖CH01-CH12全部章节"
---

***

1. 课程总体介绍

- 课程名称：软件开发架构平台（Java EE平台）

- 前置知识：JavaSE、JDBC、JSP/Servlet、HTML/CSS/XML、JavaScript、DB/SQL

- 课程内容涵盖：

   - 系统分层MVC、前后端分离

   - 各种框架技术（Spring、MyBatis、Hibernate、JPA等）

   - 数据缓存、服务器集群、REST API设计等企业级Web应用架构

- 考试与实验：

   - 闭卷考试（60%）+ 实验（40%）

   - 实验分组进行，每组4-6人

- 参考书籍：《Spring in Action》第4版、第5版

***

2. 开发架构与框架技术的发展

2.1 经典MVC架构

- MVC（Model-View-Controller）已成为事实标准。

- Model可进一步细分为：

   - 业务Bean（业务逻辑）

   - DAO（数据持久化操作）

   - POJO（值对象，仅表达数据）

2.2 框架技术解决的问题

- 约束MVC规范：通过框架强制开发者遵循MVC分层。

- 简化与规范代码：利用配置文件分离可变部分，固定不变部分。

2.3 框架分类

- 表示层框架（Struts、Spring MVC）：解决View层和Controller层的规范与简化。

- 持久层框架（MyBatis、Hibernate、JPA）：解决Model中DAO代码的规范与简化。

- 容器类框架（Spring、EJB）：解决组件间的耦合问题（横向与纵向）。

2.4 主流框架组合

- SSH：Spring、Struts2、Hibernate

- SSM：Spring、Spring MVC、MyBatis

- Spring Boot + Spring MVC + MyBatis（现代主流）

***

3. 框架技术详解

3.1 Struts框架发展

- Struts 1（2001年发布，2013年终止）基于Servlet+ActionForm+Action。

- Struts 2（基于WebWork 2.3）与Struts 1无关，本质上是拦截器+Action。

- 目前Spring MVC使用率已超过Struts 2。

3.2 框架的侵入性

- 高侵入性：需继承或实现框架类/接口（如Struts 1），脱离框架无法运行。

- 低侵入性：通过反射、动态代理、IoC/AOP等实现（如Spring、MyBatis），可重构和单元测试。

- 软件设计追求“高内聚、低耦合”以降低侵入性。

3.3 Struts 1基本原理

- 核心组件：ActionServlet（前端控制器）、ActionForm（表单）、Action（业务处理）

- 配置文件：web.xml（接管请求）、struts-config.xml（映射）

- 流程：请求→ActionServlet→ActionForm→Action→JSP响应

3.4 Struts 2基本原理

- 核心思想：约定优于配置

- 使用FilterDispatcher代替Servlet，与Java Web容器解耦。

- 核心组件：拦截器栈、ActionProxy、ActionInvocation、Result（JSP等）

- 配置：web.xml（Filter）、struts.xml

3.5 Spring MVC基本原理

- 核心组件：DispatcherServlet（前端控制器）、HandlerMapping、Controller、ViewResolver、View

- 流程：

   1. 请求到达DispatcherServlet

   2. HandlerMapping找到对应Controller

   3. Controller处理请求（数据、业务逻辑）

   4. 返回ModelAndView（模型+逻辑视图名）

   5. ViewResolver解析逻辑视图名为具体视图

   6. 视图渲染模型数据，返回响应

- 配置：web.xml（DispatcherServlet）、applicationContext.xml（组件扫描、视图解析器等）

- 低侵入性：Controller为普通POJO，通过注解配置（@Controller、@RequestMapping）

***

4. Maven项目管理工具

4.1 Maven简介

- 基于项目对象模型（POM） 的项目管理机制。

- 通过"pom.xml"配置文件管理项目构建和依赖。

- 核心功能：解决模块间和插件的依赖关系；实现项目自动化构建与部署。

4.2 Maven仓库

- 本地仓库：默认在"~/.m2/repository"

- 中央仓库：https://mvnrepository.com/

- 远程仓库（私服）：企业自定义仓库，可在"settings.xml"中配置。

- 搜索顺序：本地仓库 → 私服 → 中央仓库 → 远程仓库。

4.3 POM（Project Object Model）

- 每个Maven项目有唯一的"pom.xml"。

- 坐标（三要素）："groupId:artifactId:version"

- 依赖声明："<dependencies>"节点内每个"<dependency>"包含坐标。

4.4 Maven约定

- 项目目录结构规范：

   - "src/main/java"：Java源代码

   - "src/main/resources"：资源文件

   - "src/test/java"：测试代码

   - "target/"：编译输出

   - "web/"：Web资源（HTML/CSS/JS）

- "pom.xml"位于项目根目录。

4.5 Maven常用命令

- "mvn compile"：编译src/main/java

- "mvn test"：编译并运行测试代码

- "mvn clean"：删除target目录

- "mvn package"：生成jar/war包

- "mvn install"：将包安装到本地仓库

- "mvn deploy"：将包部署到远程仓库或服务器

***

5. 总结

本章介绍了软件开发架构平台课程的概况，重点讲解了MVC架构、框架技术（Struts1/2、Spring MVC）的发展与原理，并引入了Maven作为项目管理工具。关键概念包括：

- 框架的目的：强制规范、简化代码、降低耦合。

- 侵入性：低侵入性框架更具可维护性和可扩展性。

- Spring MVC作为现代主流表示层框架，结合Maven实现高效的项目开发与依赖管理。

后续章节将深入Spring IoC、AOP、Spring MVC、MyBatis、前后端分离等技术。

---

***

一、内容回顾与本章概述

- 回顾：课程先简要回顾了Struts框架的工作原理（通过web.xml、struts-config.xml、ActionServlet等组件处理请求-响应流程）以及Maven构建工具的作用，为理解Spring IoC奠定基础。

- 本章核心：

   - 控制反转（IoC）与依赖注入（DI）的基本原理。

   - Spring IoC容器的实现机制。

   - Spring Bean的两种配置方式：XML配置文件方式和注解方式。

   - JUnit测试框架的使用。

***

二、控制反转（IoC）与依赖注入（DI）的基本原理

1. 什么是IoC？

- 定义：控制反转是面向对象编程中的一种设计原则，用于降低代码间的耦合度。其常用实现方式是依赖注入（DI）。

- 核心思想：对象在被创建时，由外部实体（如容器）将依赖的对象的引用传递（注入）进来，而非对象内部自行创建。Spring Framework是最常见的实现。

2. 从经典HelloWorld到IoC的演变（逐步解耦）

- 经典版本：直接在代码中硬编码输出字符串，修改需重新编译。

- 面向对象版本（OOP）：将功能拆分为三个模块类（FileHelloStr读取数据、HelloWorld处理业务、HelloWorldClient展示），但存在强依赖，耦合度高，不适合大型应用。

- 面向接口版本：通过引入接口（如HelloStr），业务层针对接口编程，将具体实现类的选择权交给外部客户端（HelloWorldClient），实现业务逻辑与数据访问的解耦，但界面层仍依赖其他两层。

- 工厂模式版本：构建专门的工厂类（HelloworldFactory）负责创建和集成对象，使业务层、数据访问层、界面层完全解耦。此时已通过DI+工厂模式实现IoC。

- 进一步抽象：使用通用外部工厂（即IoC容器）统一管理对象，通过配置文件（替代硬编码）和反射技术自动创建对象。

3. IoC原理总结

- 核心目标：解耦合，将组件的构建与使用分离，强调高内聚、低耦合。

- 实现基础：面向接口编程 + 工厂模式 + 依赖注入。三者协同工作，使组件生产、接口定义、运行时注入各司其职。

4. 打印机范例（理解IoC的直观案例）

- 步骤：

   1. 定义墨盒（Ink）和纸张（Paper）接口标准。

   2. 使用接口开发打印机类（Printer）。

   3. 组装打印机：提供具体实现类（如彩色墨盒、A4纸）。

   4. 运行打印机。

- 关键：打印机不关心墨盒和纸张的具体实现，仅依赖接口；外部容器（Spring IoC容器）负责在运行时注入具体实现，实现解耦。

***

三、Spring IoC的实现

1. IoC容器核心组件

- BeanFactory：最基本的工厂接口，提供IoC容器功能。

- ApplicationContext：构建在BeanFactory之上，增加了国际化、事件发布、资源加载等企业级功能，是实际开发中最常用的容器。

2. 使用Spring IoC容器的基本流程

- 第一步：导入Spring IoC相关依赖包（如spring-context）。

- 第二步：创建配置文件（如"applicationContext.xml"）。

- 第三步：在配置文件中添加"<bean>"配置，定义类、依赖关系等。

- 第四步：初始化容器（如"ClassPathXmlApplicationContext"），通过"getBean()"获取装配好的对象。

***

四、Spring Bean的配置详解

（一）XML配置方式

1. 基本配置

- id / name：指定Bean的唯一实例名（id必须唯一）；若含特殊字符则使用name。

- class：设置类的完整限定名。

2. 依赖注入的两种方式

- 构造注入：使用"<constructor-arg>"标签，通过构造函数参数传递依赖。

- setter注入：使用"<property>"标签，通过setter方法设置属性。

- 其他注入：支持复杂数据类型（List、Set、Map）、p名称空间简化、SpEL表达式（"#{表达式}"）。

3. Bean的懒加载

- 默认容器启动时即实例化所有Bean。通过"lazy-init="true""可设置懒加载，让Bean在使用时才被实例化，提高启动效率。

4. Bean的作用域（Scope）

| 作用域 | 说明 |

|--------|------|

| singleton | 单实例，IoC容器中只存在一个实例（默认） |

| prototype | 每次getBean()返回新实例 |

| request | 仅Web环境，每次HTTP请求创建一个新Bean |

| session | 仅Web环境，作用域等同HTTP Session |

| application | 仅Web环境，作用域等同Web Application |

5. 三种实例化方式

- 类构造器实例化：默认无参构造方法（class属性直接填类名）。

- 静态工厂实例化：在class属性中填静态工厂类名，"factory-method"指定工厂方法。

- 实例工厂实例化：先定义工厂Bean，再通过"factory-bean"和"factory-method"属性指定。

6. Bean的生命周期

- 步骤：实例化（Instantiation） → 属性赋值（Populate） → 初始化（Initialization） → 销毁（Destruction）。

- 扩展点：可调用自定义init-method、destroy-method；实现"InitializingBean"、"DisposableBean"接口；使用"BeanPostProcessor"进行前后处理。

***

（二）注解配置方式

1. 使用@Configuration和@Bean

- 用"@Configuration"注解标注配置类，"@Bean"注解方法返回Bean实例，完全替代XML配置文件。

2. 使用@Autowired实现自动装配

- 在字段、setter或构造函数上添加"@Autowired"，Spring IoC容器会自动注入匹配的Bean。

3. 使用@Component系列注解实现零配置

- @Component：通用注解，表示该类由Spring容器管理。

- 衍生注解："@Controller"、"@Service"、"@Repository"分别用于Web层、服务层、持久层，与"@Component"功能相同但语义清晰。

- @ComponentScan：配置类上添加该注解，指定扫描的包路径，自动发现并注册带有上述注解的类。实现“零XML”配置。

***

五、JUnit测试框架

1. JUnit简介

- 单元测试：针对最小功能单元编写测试代码，验证正确性。

- JUnit：Java开源的单元测试事实标准框架，简化测试环境配置，被主流IDE集成。最新版本为5.x。

2. JUnit与Spring IoC的结合使用

- 在测试代码中，可结合Spring的测试模块（如"@RunWith(SpringRunner.class)"、"@ContextConfiguration"），在测试类中注入Spring容器管理的Bean，便于测试依赖注入的正确性。

- 对比：不使用JUnit时，需手动创建容器和获取Bean，测试代码冗余；使用JUnit可大幅简化。

***

六、整体总结

本课程从IoC/DI的基本原理出发，通过HelloWorld的逐步演化（面向对象→面向接口→工厂模式）和打印机案例，透彻解释了控制反转如何降低组件间的耦合。随后详细介绍了Spring IoC容器的核心概念和Bean的配置方法（XML与注解双路径），并覆盖了依赖注入方式、作用域、懒加载、实例化方式、生命周期等关键细节。最后引入JUnit测试框架，说明其在Spring开发中如何辅助进行高效单元测试。整个内容环环相扣，既强调了理论设计原则，又提供了实际配置技巧，为后续深入学习Spring全家桶打下了坚实基础。

---

***

一、软件开发架构平台——Spring AOP原理和实现

1. 内容回顾：IoC与DI

- IoC（控制反转）核心思想：解耦合，将组件的构建与组件的使用分离。每个组件只关注内部逻辑，通过定义清晰的接口实现组件间的协作，达到高内聚、低耦合。

- IoC实现基础：面向接口编程 + 工厂模式 + 依赖注入（DI）。

- Spring IoC容器：通过配置文件（XML）或注解方式管理Bean的创建、装配和生命周期。常见接口："ApplicationContext"、"BeanFactory"等。

- 示例：打印机功能依赖于墨盒和纸张接口，通过Spring IoC将具体实现类（如彩色墨盒、A4纸）注入到打印机对象中。

***

2. 面向切面编程（AOP）概述

2.1 为什么需要AOP？

- OOP的局限性：当需要在分散的、不具有继承层次的对象中引入公共行为（如日志、安全验证、事务管理）时，会导致大量重复代码。

- 典型场景：每个DAO类中都需要日志记录，若直接在每个方法中编写日志逻辑，维护困难。传统纵向继承方式虽能减少重复，但不够灵活，且仍会耦合。

2.2 AOP基本概念

- 关注点：程序需要达到的目标，分为：

   - 核心关注点：完成核心业务逻辑（如用户登录、数据查询）。

   - 横切关注点：散落在多个类或方法中的公共功能（如日志、安全、事务）。

- 切面（Aspect）：对横切关注点的模块化封装，类似于OOP中的类，代表对象间横向关系。

- 连接点（Join Point）：程序执行过程中的特定点，如方法调用、字段访问、异常抛出。

- 建议（Advice）：切面切入目标代码的方式，包括：

   - 前置建议（Before）

   - 后置建议（After）

   - 环绕建议（Around）

- 引介（Introduction）：为一个现有类或接口添加新方法或字段。

- 织入（Weaving）：将切面整合到完整执行流程或类的过程。

***

3. AOP的实现技术

3.1 三种实现原理

| 时机 | 方式 | 特点 |

|------|------|------|

| 编译期 | 语言扩展（如AspectJ编译器） | 在编译时由编译器将切面增强到字节码，需定义新关键字。 |

| 类加载器 | 特殊类加载器 | 在目标类加载到JVM时，重新“增强”字节码。 |

| 运行时 | 动态代理（JDK Proxy、CGLIB） | 目标对象和切面均为普通Java类，通过JVM动态代理或第三方库在运行期织入。 |

3.2 动态代理实现AOP

- JDK动态代理：基于接口，通过"InvocationHandler"实现。示例中"MyJDKProxy"代理"UserDaoImpl"，在方法调用前后加入日志记录。

- 代理运行：新增/删除/修改/查询用户时，自动执行后置建议（日志记录）。

3.3 AspectJ实现AOP

- AspectJ：Eclipse项目，使用".aj"文件定义切面。支持动态横切和静态横切。

- 动态横切：通过切入点和连接点向方法添加行为（如安全验证、事务管理）。

- 静态横切（Introduction/Mixin）：不改变执行行为，而是修改对象的结构，如为"Product"类增加"isOnSale()"方法，或实现"Comparable"接口。

***

4. Spring AOP的使用

- Spring AOP支持多种实现：动态代理、字节码生成（CGLIB）、AspectJ。从Spring 3.x起推荐使用AspectJ方式。

- 配置方式：XML配置 或 注解配置（如"@Aspect"、"@Before"、"@Around"等）。

- 实际项目中的典型用法：将切面定义为注解，精确控制切入位置。示例：自定义"@PerformanceMonitor"注解，实现对方法的性能监控。

***

5. IoC和AOP原理总结

- IoC容器：管理所有业务Bean（表示层、业务逻辑层、模型层）的创建和依赖注入。

- AOP切面：将横切关注点（权限、事务、日志）模块化，通过容器织入到业务逻辑中。

- 整体架构：表示层（Servlet/JSP）→ 业务逻辑层（Service）→ 模型层（DAO），IoC容器作为Bean工厂，AOP切面（权限、事务、日志）横切各层，实现解耦和复用。

***

二、Java平台日志系统

1. 日志处理简介

- 什么是日志：在程序运行过程中输出监测信息，简单如"System.out.println()"，但更专业的做法是使用日志框架。

- JUL（java.util.logging）：JDK自带的日志系统，从1.4开始提供。

2. 日志门面与日志实现

| 分类 | 描述 | 示例 |

|------|------|------|

| 日志门面（Facade） | 提供日志API定义，不提供具体实现，解耦接口与实现。 | SLF4J、Commons-Logging（JCL） |

| 日志系统（Implementation） | 提供具体的日志输出实现。 | Log4j、JUL、Logback、Log4j2 |

- 门面模式优势：允许应用程序灵活切换日志框架，无需修改代码，只需在部署时绑定具体实现。

3. 主要日志框架特点

3.1 Log4j

- Apache开源，功能强大，常与JCL搭配。

- 特点：

   - 可控制日志输出目的地（控制台、文件、数据库等）。

   - 支持7种日志级别：TRACE < DEBUG < INFO < WARN < ERROR < FATAL < OFF。

   - 可自定义输出格式。

3.2 JUL（java.util.logging）

- JDK自带，同时提供门面（Logger）和实现（Handler）。

- 日志级别（从高到低）：SEVERE、WARNING、INFO、CONFIG、FINE、FINER、FINEST。

- 通过配置文件指定多个Handler，多个Handler之间用逗号分隔。

3.3 JCL（Apache Commons Logging）

- 通用日志API，运行时动态查找真实的日志系统。

- 默认使用JUL（若未配置其他实现）。

- 通过动态查找机制适配Log4j、JUL等。

3.4 SLF4J（Simple Logging Facade for Java）

- 门面模式，提供统一API，编译部署时静态绑定真正日志库（如Logback）。

- 核心接口："Logger"、"LoggerFactory"。

- 代码规约：应用中不可直接使用日志系统（Log4j、Logback）的API，而应依赖SLF4J的API，有利于统一维护。

3.5 Logback 和 Log4j2

- Logback：SLF4J的天然实现，性能优于Log4j，与SLF4J同一作者（针对Log4j改进）。

- Log4j2：最新日志系统，综合Log4j和Logback优点，尤其在分布式异步日志性能表现突出。

***

总结要点

1. AOP：通过横向抽取机制解决OOP中重复横切代码问题，核心概念包括切面、连接点、建议、织入。实现技术有编译期、类加载器、运行时动态代理。Spring推荐使用AspectJ方式，通过注解或XML配置实现。

2. 日志系统：采用门面模式（SLF4J、JCL）解耦，具体实现（Log4j、Logback、Log4j2等）可灵活切换。遵循代码规约，统一使用日志门面API。

3. IoC与AOP结合：IoC容器负责管理Bean，AOP切面负责横切关注点，两者共同构成Spring框架的核心，实现高内聚低耦合的模块化开发。

---

***

一、课程背景与内容回顾

1. 面向切面编程（AOP）概述

- 实现方式：Spring AOP 的使用。

- Java平台日志系统：与 AOP 结合实现日志管理。

- IoC 和 AOP 原理总结：IoC（控制反转）管理 Bean 的创建与依赖，AOP（面向切面编程）实现横切关注点（如权限、事务、日志）的模块化。

2. 系统分层与切面

- 表示层（Servlet/JSP）→ 权限切面

- 业务逻辑层（Business/Service）→ 事务切面

- 模型层（Bean/DAO）→ 事务管理

- IoC/Bean 容器、日志管理、安全切面贯穿各层。

***

二、Spring 框架概述

1. Spring Framework 定位

- 官网定义：Spring 是一个 Java 平台，为开发 Java 应用提供全面的基础设施支持，让开发者专注于业务逻辑。

- 核心理念：从“普通 Java 对象”（POJO）构建应用，非侵入式地应用企业服务。

- 创始人：Rod Johnson（著有《Expert one-on-one J2EE Development without EJB》），强调“不要重复发明轮子”。

2. Spring Framework 运行时模块

- 核心容器：Core、Beans、Context、Expression Language

- 数据访问/集成：JDBC、ORM、OXM、JMS、事务

- Web：MVC / Remoting、Servlet、Portlet、Struts

- AOP、Aspects、Instrumentation

- 测试：Test

3. 版本要求

- Spring 5.x：最低 JDK 8、Servlet 3.1（Tomcat 8.5+），支持响应式编程。

- Spring 6.x：最低 JDK 17、Servlet 5.0（Tomcat 10.x）。

***

三、Spring MVC 入门

1. Spring MVC 简介

- 轻量级 Web MVC 框架，属于 Spring 体系。

- 核心：Controller 控制器，处理请求和响应。

- 基于 Spring IoC 容器：所有对象（Controller、Service 等）由容器管理。

2. Spring MVC 体系架构（DispatcherServlet 为中心）

1. 请求到达 DispatcherServlet（前端控制器）。

2. DispatcherServlet 通过 HandlerMapping 查找对应 URL 的 Controller。

3. Controller 处理请求（数据、业务逻辑）。

4. Controller 返回 ModelAndView（模型数据 + 逻辑视图名）。

5. ViewResolver 将逻辑视图名解析为具体视图（如 JSP、Thymeleaf）。

6. 视图渲染模型数据。

7. 返回响应。

3. 第一个 Spring MVC 应用（HelloWorld）

- Maven 依赖："spring-webmvc"

- 配置 web.xml：注册 DispatcherServlet。

- 配置 applicationContext.xml：组件扫描、视图解析器等。

- 编写 Controller：使用 "@Controller" 和 "@RequestMapping" 注解。

***

四、Spring MVC 使用详解

1. URL 映射（请求映射）

- @RequestMapping：通用映射，可作用于类（全局路径）和方法，不区分请求方法。

- 特殊方法映射："@GetMapping"、"@PostMapping"、"@PutMapping"、"@DeleteMapping" 等。

- 优点：基于方法，比 Servlet 映射粒度更细，使用灵活。

2. 获取请求参数

方式一：方法参数直接接收（属性名一致）

- 确保前后端参数名一致，Spring MVC 自动绑定。

方式二：@RequestParam 映射（属性名不一致时）

- 指定请求参数名与方法参数名的映射。

方式三：JavaBean 封装（常用）

- 使用 "@RequestBody" 或直接绑定 JavaBean，适合大量参数。

- 自动将请求参数映射到 JavaBean 属性。

方式四：@PathVariable（获取 URI 中的值）

- 例如 "/user/{id}"，使用 "@PathVariable("id")" 获取。

方式五：@RequestHeader（获取请求头）

3. 响应处理

常用方式

- @ResponseBody：直接返回响应文本（如 JSON），不进行视图跳转。

- ModelAndView：封装模型数据和视图名，通过视图解析器渲染。

- Model / ModelMap：由拦截器自动创建，用于存放数据，最终与视图结合。

视图层解决方案

- 传统 JSP、FreeMarker（老版本推荐）。

- Thymeleaf（Spring 3.x 起推荐）：数据和 HTML 分离，支持 "th:text"、"th:value"、"th:each"、"th:if"、"th:fragment"、"th:insert" 等属性，以及表达式语法。

4. 参数校验

- @Validation：Spring 提供的验证机制（JSR-303 变种），可用于类型、方法、方法参数，但不能用于成员属性。

- @Valid：Hibernate 验证（符合 JSR-303），支持嵌套验证（可用于成员属性），功能更强大。

- 常用注解："@NotNull"、"@Null"、"@AssertTrue"、"@AssertFalse"、"@Digits"、"@Max"、"@Min"、"@Length"、"@NotEmpty"、"@NotBlank"、"@Email"、"@Pattern"。

5. Web 容器对象的使用

- 耦合方式：直接在 Controller 方法参数中声明 "HttpServletRequest"、"HttpSession" 等，由 Spring MVC 自动注入。

- 非耦合方式：通过 Spring 提供的接口（如 "RequestContextHolder"）或使用 "@Autowired" 注入 "HttpServletRequest"（需配置）。

- 推荐：使用非耦合方式降低对 Servlet API 的依赖。

6. 拦截器（Interceptor）

- 作用：类似 Servlet 的 Filter，用于前置/后置处理，实现业务与非业务功能解耦。

- 实现机制：基于 Spring AOP，与 Filter 不同。

- 接口："HandlerInterceptor"，提供三个方法：

   - "preHandle()"：前置处理，返回 true 继续执行，false 中断。

   - "postHandle()"：后置处理，在 Controller 执行后、视图渲染前。

   - "afterCompletion()"：最终处理，在视图渲染后。

- 配置：在 Spring 配置文件中注册拦截器，指定拦截路径。

- 示例：结合 Logback 实现“用户流量监控”。

7. 拦截器与过滤器的区别

- Filter：基于 Servlet 规范，可拦截任何资源（静态、动态），在 Web.xml 中配置。

- Interceptor：基于 Spring AOP，只拦截 Controller 请求，在 Spring 配置中注册。

- 执行顺序：Filter → DispatcherServlet → Interceptor → Controller。

***

五、作业与课后要求

- 课后自学：深入理解 "@Valid" 和 "@Validation" 的区别和使用场景。

- 实践作业：完成 PetStore 项目的 JSP 和 Servlet 层重构，使用 Spring MVC 替换。

***

六、总结图表（架构流程图）

文档最后以流程图方式回顾 Spring MVC 核心流程：

1. 请求 → DispatcherServlet

2. DispatcherServlet → HandlerMapping → Controller

3. Controller → ModelAndView

4. DispatcherServlet → ViewResolver → View

5. View → 响应

---

***

1. Spring MVC 回顾

1.1 体系架构

Spring MVC 基于前端控制器（DispatcherServlet）模式，处理流程如下：

- 请求到达前端控制器。

- 前端控制器通过处理器映射（HandlerMapping） 找到对应 URL 的控制器（Controller）。

- 控制器处理请求，进行数据操作和业务逻辑调用。

- 控制器返回模型数据（Model） 和逻辑视图名。

- 视图解析器（ViewResolver） 将逻辑视图名解析为具体视图实现。

- 视图渲染模型数据，生成 Web 响应。

1.2 使用详解

- URL 映射：通过 "@RequestMapping" 等注解匹配请求路径。

- 获取请求参数：使用 "@RequestParam"、"@ModelAttribute" 等注解获取参数并封装到 Model。

- 响应处理：通常结合 Thymeleaf 模板引擎渲染视图。

- 类型转换与参数校验：支持自定义类型转换器和 JSR 303 校验注解。

- Web容器对象：通过 "HttpServletRequest"、"HttpSession" 等原生对象操作。

- 拦截器：实现 "HandlerInterceptor" 接口，对请求进行预处理和后处理。

***

2. Spring Boot 简介

2.1 什么是 Spring Boot

- Spring Boot 是 Spring 框架的一个子项目，旨在简化 Spring 应用的搭建和开发。

- 目标是让开发者能够“just run”一个独立、生产级的 Spring 应用。

- 当前最新稳定版为 3.0.4（基于 Spring 6.x，要求 JDK 17）。

2.2 主要特点

- 极低的学习成本：开箱即用，减少配置。

- 独立运行：内嵌 Tomcat、Jetty 等 Web 容器，可打包为可执行 JAR。

- 约定优于配置：自动配置大量默认行为，提高开发效率。

- 简单的组件依赖：通过 Starter 整合常用依赖，自动发现并装配。

- 运行时监控：提供 Actuator 模块，支持健康检查、指标收集等。

- 分布式与云集成：与 Spring Cloud、大数据组件良好集成。

2.3 与传统的对比

- 传统 Spring 开发：需手动配置环境、创建工程目录、管理依赖、配置 Web 容器、部署等。

- Spring Boot 开发：通过 Spring Initializr 快速创建项目，自动配置环境、依赖管理、内嵌容器，简化测试与部署。

***

3. Spring Boot 基本原理

3.1 主要功能模块

- Spring Boot Starter：将常用依赖（如 web、data、security）整合为一个 Starter，统一版本管理。例如 "spring-boot-starter-web" 包含 Spring MVC、内嵌 Tomcat 等。

- 自动配置：基于 "@EnableAutoConfiguration" 和条件注解（"@ConditionalOnClass"、"@ConditionalOnMissingBean" 等），自动推断并配置 Bean。

- 命令行接口（CLI）：结合 Groovy 或 Gradle，可快速运行 Spring 脚本。

- Actuator：提供生产级监控和管理端点（如 "/health"、"/metrics"）。

3.2 Starter 依赖管理

- 项目通常继承 "spring-boot-starter-parent"，该父 POM 定义了常用依赖的版本和兼容关系，避免版本冲突。

3.3 条件配置与自动装配

- "@SpringBootApplication" 是一个组合注解，包含：

   - "@SpringBootConfiguration"（实质上是 "@Configuration"）。

   - "@EnableAutoConfiguration"：启用自动配置机制，通过 "AutoConfigurationImportSelector" 导入条件配置。

   - "@ComponentScan"：扫描当前包及子包下的组件。

- 自动配置的生效依赖于条件注解，如 "@ConditionalOnClass" 表示当类路径存在某类时才加载对应配置。

***

4. 使用 Spring Boot

4.1 环境与工具要求

- JDK 17 及以上。

- IntelliJ IDEA Ultimate（推荐使用 Spring Initializr 创建项目）。

4.2 项目目录结构（Maven 项目）

- "src/main/java"：Java 源代码。

- "src/main/resources"：资源文件，包括：

   - "static"：静态资源（CSS、JS、图片）。

   - "templates"：Thymeleaf 模板页面。

   - "application.properties"（或 "application.yml"）：Spring Boot 配置文件。

- "src/test"：测试代码。

- "pom.xml"：Maven 依赖管理文件。

4.3 入口类

- 类名一般以 "Application" 结尾（如 "SpringdemoApplication"）。

- 使用 "@SpringBootApplication" 注解。

- 通过 "SpringApplication.run(类名.class, args)" 启动应用。

4.4 启动流程

- 加载 "application.properties" 配置文件。

- 根据 "spring-boot-starter-*" 自动装配相应组件（如 web、data、logging）。

- 注册 "@Repository"、"@Controller"、"@Entity" 等注解的 Bean。

- 初始化应用上下文，启动内嵌 Web 容器。

4.5 常用配置项（"application.properties" 示例）

- 服务器端口："server.port=8080"

- 数据库连接："spring.datasource.url=jdbc:mysql://..."

- 日志级别："logging.level.org.springframework=DEBUG"

***

5. ORM 概述

5.1 定义与目的

- ORM（Object-Relational Mapping，对象关系映射）：将内存中的对象（瞬态数据）持久化到关系型数据库（或文件）中。

- 持久化目标：

   - 无结构文本文件（I/O 技术）。

   - 结构化文本文件（SDK API）。

   - 关系型数据库（JDBC 等）。

5.2 瞬态与持久状态

- 瞬态：程序运行时的内存数据，程序结束后消失。

- 持久：保存在磁盘等永久存储设备上的数据，程序结束后仍存在。

- ORM 的职责就是在这两种状态之间进行转换。

5.3 JDBC 开发流程

- 程序员通过 JDBC API 操作数据库：

   - 获取 "Connection"。

   - 创建 "Statement" 或 "PreparedStatement"。

   - 执行 SQL（"executeQuery"、"executeUpdate"）。

   - 处理 "ResultSet"。

5.4 JPA 规范

- JPA（Java Persistence API） 是 Java EE 规范之一（JSR 202），定义了 ORM 的标准。

- 包含三部分：

   - ORM 映射元数据：可通过 XML 或注解（如 "@Entity"、"@Table"）描述对象与表的映射。

   - API 接口："EntityManager" 等用于 CRUD 操作。

   - JPQL：面向对象的查询语言。

- JPA 本身只提供规范，具体实现由框架提供（如 Hibernate、EclipseLink）。

***

6. ORM 的实现方式

6.1 四种主要方式

1. JDBC：直接使用原生 JDBC API，代码繁琐。

2. JDBC Template：Spring 提供的简化模板，通过 IoC 容器管理数据源，封装了常见操作。

3. 半自动 ORM：如 MyBatis，手动编写 SQL，灵活控制映射。

4. 全自动 ORM：如 Hibernate、Spring Data JPA，自动生成 SQL，完全面向对象。

6.2 JDBC Template 详解

- 注册到 IoC 容器：需配置 "DataSource" 和 "JdbcTemplate" Bean。

- 主要 API：

   - "execute()"：执行 DDL 语句。

   - "update()" / "batchUpdate()"：增、删、改操作。

   - "query()" / "queryForObject()"：查询操作，可通过 "RowMapper" 将结果集映射为对象。

   - "call()"：调用存储过程。

- 优点：在保留灵活性（可直接写 SQL）的同时，减少样板代码。

6.3 MyBatis 框架详解

6.3.1 背景与特点

- 原名为 iBatis，2010 年改名为 MyBatis。

- 支持普通 SQL、存储过程、高级映射，免除了大部分 JDBC 代码。

- 通过 XML 或注解配置映射，将 Java POJOs 映射为数据库记录。

6.3.2 基本原理

- 在 XML 文件中定义 SQL 语句，使用占位符（"#{}"）预留参数位置。

- 运行时，参数映射表、JavaBean 属性或简单对象替换占位符。

- 执行 SQL 后，结果字段映射到 Java 对象（通过 "resultType" 或 "resultMap"）。

6.3.3 核心组件

- Configuration.xml：包含数据库环境配置（"<environments>"）和映射器路径（"<mappers>"）。

- SqlSessionFactory：根据 Configuration.xml 创建，线程安全。

- SqlSession：线程非安全，用于执行 SQL 语句。

- Mapper.xml：包含 SQL 映射语句，每个语句通过 "namespace" + "id" 唯一标识。

   - 常用标签："<select>"、"<insert>"、"<update>"、"<delete>"。

   - 属性："parameterType"（输入参数类型）、"resultType"（输出结果类型）。

6.3.4 CRUD 操作示例

1. 获取 "SqlSession" 实例："SqlSession session = sqlSessionFactory.openSession()"

2. 调用方法：

   - "session.selectOne("namespace.id", param)"

   - "session.insert("namespace.id", obj)"

   - "session.update(...)"

   - "session.delete(...)"

3. 关闭 "session.close()"

***

7. 课后作业与小组展示

- 小组展示：使用 Spring JDBC Template 完成示例数据库表（用户信息表 "userinfo"）的 CRUD 操作。

- 课后作业：使用 Spring Boot + Spring MVC 重构 PetStore 项目中的 JSP 和 Servlet 层，实现基于 Spring Boot 的独立运行应用。

---

核心概念：ORM

* 定义：ORM（Object-Relational Mapping，对象关系映射）是一种编程技术，用于在关系型数据库和面向对象编程语言（如Java）之间转换数据。

* 目标：实现数据的持久化，即将内存中的瞬时对象数据保存到可永久存储的设备中。

* 数据持久化的方式：

   1. 无结构文本文件：通过I/O技术读写。

   2. 结构化文本文件：通过SDK提供的API读写。

   3. 关系型数据库：通过数据库驱动技术（如JDBC）读写，ORM正是解决这种场景下的对象与关系数据映射的机制。

ORM的实现方式演进

文档主要介绍了以下几种ORM实现方式，从底层到高层，从繁琐到简化：

1. JDBC (Java Database Connectivity)

   * 基础：最底层的数据库访问技术，直接操作SQL语句。

   * 特点：代码繁琐，需要手动编写SQL、设置参数、处理结果集，开发效率低。

2. 简化的JDBC (如Spring JDBC Template)

   * 改进：对原生JDBC进行封装，简化了资源管理、异常处理等重复性工作。

   * 特点：仍然是基于SQL的编程模型，但比纯JDBC更简洁。

3. 半自动ORM框架 (代表：MyBatis)

   * 核心思想：

      * 将SQL语句和Java代码解耦，通过XML或注解来定义SQL映射。

      * 开发者仍需编写SQL，是“手写SQL”的框架，提供了更大的灵活性和优化空间。

   * 框架特点：

      * 支持普通SQL、存储过程和高级映射。

      * 将Java POJOs (Plain Old Java Objects) 映射成数据库中的记录。

      * 消除了大部分JDBC代码、参数设置和结果集的检索工作。

   * 基本原理：

      1. 在XML文件中定义SQL语句，并预留参数占位符。

      2. 运行时，占位符被替换为指定的参数值。

      3. 执行SQL后，结果集字段自动映射到Java对象。

   * 核心组件：

      * "Configuration.xml"：全局配置文件，配置数据库连接、映射器路径等。

      * "SqlSessionFactory"：用于创建"SqlSession"的核心工厂类。

      * "Mapper.xml"：包含SQL语句和映射规则的映射文件。

      * "MyBatis Java API"：用于执行CRUD操作的编程接口。

   * 在Spring Boot中使用：

      * 简化了XML配置，将"Configuration.xml"的内容整合到"application.properties"中。

      * 使用Spring IoC容器管理"SqlSessionFactory"和"SqlSession"。

      * 通过面向接口（Mapper接口）和Mapper配置文件的方式实现DAO层。

      * 支持注解编程。

   * 关键配置：

      * "mybatis.type-aliases-package"：配置包名，简化在Mapper文件中使用的类名。

      * "mybatis.configuration.lazy-loading-enabled"：开启或关闭懒加载，提升关联查询效率。

      * "mybatis.type-handlers-package"：配置自定义类型处理器，处理数据库与Java类型不匹配问题。

   * Mapper高级特性：

      * ResultMap：复杂结果映射，用于处理非标准映射关系（如字段名不一致、聚合查询等）。

      * 动态SQL：通过"<if>"、"<choose>"、"<where>"、"<foreach>"等标签，根据条件动态拼接SQL语句，解决了传统JDBC中字符串拼接的繁琐和易错问题。

      * 参数类型指定：解决Java类型和数据库字段类型不匹配的问题。

4. 全自动ORM框架 (代表：Hibernate / Spring Data JPA)

   * 核心思想：

      * Hibernate：完全封装了JDBC，开发者不需要编写SQL。它将Java对象直接映射到数据库表，通过操作对象的方式来操作数据库，框架自动生成SQL。

      * Spring Data JPA：基于JPA（Java Persistence API）规范，Spring提供的更进一步封装。开发者只需定义接口，遵循特定的命名规则（如"findByName"），框架就能自动实现查询。

   * 对象状态管理 (Hibernate)：

      * 临时状态 (Transient)：通过"new"创建，未与Session关联，不被持久化。

      * 持久化状态 (Persistent)：与Session关联，对对象的任何改动都会自动同步到数据库。

      * 脱管/游离状态 (Detached)：Session关闭后的持久化对象，引用依然有效，可重新关联。

   * 关联查询 (Spring Data JPA)：提供了简便的方法来处理对象之间的关联关系，例如"@OneToMany"、"@ManyToMany"等。

全自动与半自动对比

* 半自动 (MyBatis)：优点在于灵活性高，可以随时优化SQL；缺点是需要手动编写大量SQL。

* 全自动 (Hibernate/Spring Data JPA)：优点在于开发效率高，通过操作对象或定义接口即可完成操作；缺点是SQL由框架自动生成，对于复杂查询或性能调优，灵活性较差，学习成本更高。

MyBatis生态与高级工具

1. MyBatis三剑客：

   * MyBatis-Generator：自动生成Java Bean、Mapper接口和XML文件等代码的代码生成器。

   * MyBatis-Plugin (IDE插件)：提高开发效率的辅助工具，如实现Mapper接口和XML之间的快速导航、XML语法错误检查等。

   * MyBatis-PageHelper：简化分页功能的通用分页插件，只需少量配置即可实现分页。

2. MyBatis-Plus (MP)

   * 定位：MyBatis的增强工具，而非替代品，在MyBatis的基础上只做增强不做改变。

   * 特点：

      * 无侵入：引入后不会对现有MyBatis项目造成影响。

      * 损耗小：启动时注入基本的CRUD操作，运行时几乎无性能损耗。

      * 强大功能：集成了“三剑客”的功能，并提供Lambda表达式、ActiveRecord模式、自动分页、条件构造器("Wrapper")等高级特性。

      * 简单易用：通过继承或实现预定义的接口（如"BaseMapper"），即可获得大量常用的CRUD方法。

结语与讨论

* 是否使用ORM框架？

   * 倾向于使用：ORM框架大大提高了开发效率，减少了冗余代码，使开发者能更专注于业务逻辑。

* 如何选择？

   * MyBatis/MyBatis-Plus：适合SQL优化频繁、业务逻辑复杂、需要对数据库有精细化控制的项目。尤其适合团队熟悉SQL、追求灵活性和性能的场景。

   * Spring Data JPA / Hibernate：适合标准化的CRUD操作较多、开发速度优先、团队对SQL控制要求不高的项目。它能快速构建应用，但遇到复杂查询时可能需要用原生SQL或JPA的复杂查询（如Criteria API）。

   * 综合建议：当前主流趋势是 MyBatis-Plus 因其开发效率和灵活性兼具而广受欢迎。对于新项目，可以优先考虑MyBatis-Plus。对于传统或复杂的企业级项目，Hibernate/JPA仍然是成熟的选择。最终选择应基于项目规模、团队技术栈和业务需求。

---

***

一、Web开发模式演变

1. 早期时代（Model I）

- 特点：简单快速，适用于小规模项目；前后端不分工，所有逻辑（HTML、JSP、Java等）混杂在一起。

- 缺点：不适合复杂业务逻辑，可维护性差，协作性差。

- 示意图：浏览器直接请求Web服务器，服务器通过JSP/Servlet动态生成HTML返回。

2. MVC时代（Model II）

- 特点：开始有前后端分工（Controller、Model、View），协作性提高，可维护性明显好转。

- 缺点：分工仍不明确，前端重度依赖后端（如JSP中嵌入Java代码），用户体验不佳。

- 代表技术：Struts、Spring MVC等。

3. 从AJAX到前后端分离

- 特点：前后端分工清晰明确，前端通过AJAX获取数据并独立渲染，用户体验提升。

- 挑战：前端工作量变大，带来一系列技术问题（如跨域、状态管理、路由等）。

- 技术栈：前端使用HTML、CSS、JavaScript + AJAX；后端只提供数据接口（JSON/XML）。

4. 前后端分离（SPA/MVP/MVVM）

- 架构：后端只提供数据（Model）和API接口；前端独立实现视图（View）和业务逻辑（Controller/ViewModel）。

- 典型模式：SPA（单页应用）使用前端路由，局部更新页面，交互流畅。

- 与SPA/MPA的关系：

   - 前后端不分离+MPA：传统模式，后端直接生成HTML，适合SEO要求高的简单网站。

   - 前后端分离+SPA：现代主流，前端独立开发，交互流畅，但SEO较差，首屏加载慢。

   - 前后端分离+MPA：每个页面独立，SEO友好，但页面刷新较慢，适用于大型门户。

5. 相关技术概念

- Web服务器 vs 应用服务器：Web服务器处理HTTP协议、静态文件（如Apache、Nginx）；应用服务器（如Tomcat）运行Java Web业务代码。

- CDN：内容分发网络，通过边缘服务器加速静态资源访问，常用于前后端分离架构中前端页面的部署。

***

二、Web Service和REST简介

1. Web Service概述

- 定义：基于Web的远程调用技术，实现不同系统间的互操作（语言无关、平台无关）。

- 传统实现：SOAP（Simple Object Access Protocol），基于XML、WSDL、UDDI，支持多种传输协议（HTTP、SMTP、JMS）。

- SOAP特点：复杂、重量级，适合企业级高安全场景（银行、金融等）。

2. REST（Representational State Transfer）

- 起源：Roy Fielding于2000年博士论文中提出，是HTTP规范的主要作者之一。

- 核心概念：

   - 资源：网络上的任何实体（文档、图片、服务等），通过URI唯一标识。

   - 表述性：资源的表现形式（XML、JSON、HTML等）。

   - 状态转移：客户端通过操作资源的表述来改变服务器端资源的状态。

- 六大约束：

   1. 客户端-服务器：分离关注点，提高可移植性和简单性。

   2. 无状态：每个请求包含所有必要信息，会话保存在客户端，提升可靠性。

   3. 缓存：响应明确标识是否可缓存，减少交互次数。

   4. 分层系统：客户端无法直接感知中间层（代理、负载均衡等），隐藏实现细节。

   5. 统一接口：使用统一的URI结构、HTTP方法、一致的JSON/XML响应格式。

   6. 按需代码（可选）：客户端可下载并执行服务端脚本（如JavaScript）。

3. RESTful API

- 定义：完全或基本遵循REST六大约束的API称为RESTful API。

- 与SOAP对比：

   - 协议：REST主要基于HTTP，SOAP支持多种协议。

   - 数据格式：REST常用JSON（轻量级），SOAP强制使用XML。

   - 消息结构：REST简单（HTTP+JSON），SOAP复杂（SOAP Envelope）。

   - 性能：REST更优（XML解析慢）。

   - 安全性：SOAP内置安全机制（WS-Security），REST需手动实现（OAuth2.0、JWT等）。

***

三、RESTful API最佳实践

1. 请求设计规范

- URI命名：使用名词，尽量用复数（如"/orders"）；使用嵌套表示关联（如"/users/1/orders/3"）。

- HTTP方法：

   - "GET"：获取资源

   - "POST"：新建资源

   - "PUT"：更新完整资源

   - "PATCH"：部分更新资源

   - "DELETE"：删除资源

- 非CRUD操作：可用"POST"+动词、查询字符串"?action=xxx"或设计子资源。

2. 响应设计规范

- 过滤信息：支持分页（"?page=2&per_page=100"）、排序（"?sortby=name&order=asc"）、筛选（"?animal_type_id=1"）。

- 状态码：

   - 200 OK（GET成功）

   - 201 Created（POST/PUT/PATCH成功）

   - 204 No Content（DELETE成功）

   - 400 Bad Request（请求错误）

   - 401 Unauthorized（未认证）

   - 403 Forbidden（无权限）

   - 404 Not Found（资源不存在）

   - 406 Not Acceptable（格式不可得）

   - 410 Gone（资源永久删除）

   - 422 Unprocessable Entity（验证错误）

   - 500 Internal Server Error（服务器错误）

- 错误信息：非2xx响应应包含具体错误描述（如"{"error": "Invalid username"}"）。

- 返回结果：

   - GET /collection → 列表（数组）

   - GET /collection/resource → 单个对象

   - POST /collection → 新创建的对象

   - PUT/PATCH /collection/resource → 完整的资源对象

   - DELETE /collection/resource → 空文档

- 超链接（HATEOAS）：响应中应包含相关资源的链接（如GitHub API）。

- 其他建议：

   - 使用HTTPS协议

   - 采用标准认证（OAuth2.0、JWT）

   - 数据格式首选JSON

***

四、使用SpringBoot实现RESTful API

1. 控制器的请求注解

- @RequestParam：获取URL查询参数（如"?username=admin"）或表单参数。

- @RequestBody：获取POST/PUT请求体中的JSON对象（需设置"Content-Type: application/json"）。

- @PathVariable：获取URL路径参数（如"/orders/{id}"中的"id"）。

2. 响应的JSON序列化

- 使用"@ResponseBody"注解自动将返回对象序列化为JSON。

- @RestController = "@Controller" + "@ResponseBody"，简化控制器定义。

- 设计统一的响应格式：包含状态码、错误码、数据封装（如"{"code":200, "message":"success", "data":...}"）。

3. 设计范例

- 登录接口："POST /user/login"，参数"username, password"。

- 注册接口："POST /user/register"。

- 资源接口：如"/orders"、"/customers"、"/accounts"等，遵循RESTful风格重构原有Controller。

4. 测试工具

- Postman：用于测试RESTful API，支持设置Headers、Params、Body，查看响应状态码、时间、数据等。

***

五、作业与延伸

- 作业：设计PetStore用户端的RESTful API（包括用户、商品、订单等资源的CRUD操作）。

- 课程后续：CH08将深入RESTful API进阶，CH09-11介绍ES6、前端模块化、前端框架（Vue/React等），CH12 SpringBoot与Node.js进阶。

***

总结

本章系统讲解了Web开发从传统Model I到前后端分离（SPA/MPA）的演变历程，对比了SOAP与REST两种Web Service实现方式，重点阐述了RESTful API的六大约束和最佳实践（请求、响应、状态码、错误处理、超链接等），并初步介绍了SpringBoot中如何通过注解实现RESTful API。通过这些内容，学员能够理解前后端分离架构的核心思想，并掌握设计高质量的RESTful API的基本规范。

---

***

一、Web开发模式演变与RESTful API基础

1. 前后端分离

   - 前端（Client）与后端（Server）通过JSON进行数据交互，不再依赖传统的Session/Cookie会话跟踪。

   - 后端仅需提供RESTful API，前端负责渲染和路由。

2. Web Service（SOAP） vs RESTful API

   - 协议：SOAP支持HTTP、SMTP、JMS等；REST主要基于HTTP。

   - 数据格式：SOAP多用XML；REST常用JSON（更轻量）。

   - 消息结构：SOAP复杂（有Envelope）；REST简单（HTTP + JSON）。

   - 状态管理：SOAP可有状态或无状态；REST强制无状态。

   - 性能：SOAP因XML解析较慢；REST性能更好。

   - 安全性：SOAP内置WS-Security；REST需手动实现（如OAuth 2.0、JWT）。

   - 适用场景：SOAP适用于企业级高安全场景；REST适用于Web、微服务、移动端、物联网。

3. 资源设计范例（/orders、/customers）

   - 展示了如何将CRUD操作映射为HTTP方法（GET、POST、PUT、DELETE）及路径参数。

***

二、用户认证与API安全问题

1. 用户认证的挑战

- 传统Session/Cookie的问题：前后端分离后，浏览器无法自动处理Cookie（特别是跨域），服务器集群中Session难以共享。

- 引入Token机制：用户登录成功后服务器生成一个加密的字符串（Token），客户端后续请求携带该Token，服务器通过验证Token实现用户认证，无需服务端存储（无状态）。

2. JWT（JSON Web Token）

- 标准：RFC 7519，是目前最流行的无状态认证方案。

- 结构：由三部分组成，用"."分隔：

   - Header：描述元数据，如签名的算法（alg）和token类型（typ）。

   - Payload：存放实际数据，包括标准声明（iss、exp、sub、aud、nbf、iat、jti）和自定义字段。

   - Signature：对Header和Payload的签名，防止篡改（默认HMAC SHA256，也可用RSA/ECDSA）。

- 特点：

   - 默认不加密，但可对生成的Token进行二次加密。

   - 可用于认证和数据传输（减少对服务器的查询）。

   - 缺点：Token一旦发出，中途无法废止或修改；建议设置较短的过期时间；必须使用HTTPS传输。

3. 使用Spring Boot + JWT实现用户认证（详细步骤）

- 项目结构：包含实体、工具类、服务、控制器、过滤器、安全配置。

- 添加依赖：spring-boot-starter-security，io.jsonwebtoken（jjwt）。

- JWT工具类（JwtUtil）：生成Token（设置签名、过期时间）、解析Token（提取用户名）、验证Token。

- 用户服务：模拟用户数据，提供登录校验。

- 认证控制器（AuthController）：接收用户名和密码，调用服务验证，成功后返回JWT。

- JWT过滤器（JwtAuthFilter）：继承OncePerRequestFilter，从请求头Authorization（Bearer token）中提取Token并验证，无效则返回401。

- 安全配置：允许"/auth/login"公开，其他API需认证；添加JWT过滤器。

- 受保护的API：前端需在请求头携带"Authorization: Bearer <token>"，否则返回401。

***

三、用户鉴权（授权）问题 – OAuth 2.0

1. 鉴权需求

- 解决“第三方用户如何在不泄露自己密码的情况下获取临时访问权限”的问题（如快递员进小区门禁）。

- OAuth 2.0：开放标准，用于授权（Authorization），允许第三方应用代表用户访问受保护资源。

2. 快递员范例（授权码流程）

- 快递员按下“获取授权”按钮 → 业主确认 → 门禁系统颁发临时令牌（Access Token，短期有效） → 快递员输入令牌进入。

3. Spring Boot + OAuth2 + JWT + GitHub登录实现

- 目标：用户通过GitHub账户登录，服务端生成JWT作为访问令牌，保护API。

- 步骤：

   1. 在GitHub创建OAuth App，获取Client ID和Client Secret。

   2. 添加依赖：spring-boot-starter-oauth2-client、spring-security-oauth2-jose、jjwt。

   3. 配置application.yml：spring.security.oauth2.client.registration.github（client-id, client-secret, redirect-uri等）。

   4. 创建JWT工具类（同前）。

   5. 创建OAuth2认证控制器：接收GitHub回调的code，使用RestTemplate获取access_token，再调用GitHub API获取用户信息，最后生成JWT返回。

   6. 保护API：与JWT过滤器配合，只有携带有效JWT才能访问"/users/profile"。

- 测试：访问GitHub登录 → 回调返回JWT → 携带JWT访问受保护API。

***

四、基于Token机制的用户模块RESTful API设计

- 资源路径示例："/accounts/{id}"、"/tokens"（用于登录/登出）。

- API操作映射：

   - "POST /accounts" – 注册

   - "POST /tokens" – 登录（返回token）

   - "DELETE /tokens" – 注销

   - "GET /accounts/{id}" – 获取账户详情

   - "PUT /accounts/{id}" – 修改账户信息

- 强调：RESTful风格下，身份认证操作也需符合资源设计思想。

***

五、跨域问题（CORS）

- 产生原因：前后端不同源（域名、协议、端口不同）。

- 解决方案：

   - 开发环境：前端使用代理（如webpack-dev-server）、后端通过CORS允许特定源。

   - 生产环境：使用Nginx反向代理，将前后端部署在同一域名下（推荐）；或后端配置CORS。

- CORS原理：服务器在响应头中加入"Access-Control-Allow-Origin"等字段，告知浏览器允许跨域请求。

***

六、Java对象的JSON序列化

- 常用工具：Jackson（Spring Boot默认）、Gson、fastjson。

- 控制序列化：

   - 默认序列化所有非静态、非构造方法、public getter返回值。

   - 通过注解"@JsonIgnore"排除字段，"@JsonInclude"控制包含条件（如非空）。

- 对象分层（解耦）：

   - DTO（Data Transfer Object）：API交互对象。

   - VO（View Object）：前端展示对象。

   - BO（Business Object）：业务逻辑对象。

   - DO/PO（Domain Object/Persistent Object）：数据库映射实体。

   - 分层有助于维护和扩展，各层间通过DTO传递数据。

***

七、统一全局异常处理

- 使用："@ControllerAdvice" + "@ExceptionHandler"。

- 作用：捕获所有Controller抛出的异常，返回统一的JSON错误响应，隐藏服务端细节，提升安全性。

- 作业要求：设计全局异常处理切面，完成功能（即实现一个全局异常处理器）。

***

八、其他补充（内容回顾与作业）

- 内容回顾：文档还重复强调了Web Service与REST的对比、JWT原理、OAuth2流程。

- 作业：除全局异常处理外，还提及“设计基于token的用户模块API”作为练习。

---

***

一、内容回顾

文档首先回顾了Web开发模式的演变过程，从传统的服务端渲染（如JSP、ASP）到前后端分离的架构演变。接着介绍了Web Service和REST（Representational State Transfer）的基本概念，强调RESTful API作为现代Web服务的主流设计风格，其核心原则包括资源导向、统一接口、无状态等。最后，文档提及了RESTful API的实现方式，如通过HTTP动词（GET、POST、PUT、DELETE）对资源进行操作。

二、本章内容概述

本章重点讲解前端独立开发的技术要点和ES6异步编程解决方案，涵盖：

- 前端独立开发简介（开发工具、项目结构、实例）

- Promise对象与异步请求（Promise基本用法、状态管理、链式调用）

- async/await关键字（异步变同步的语法糖）

- fetch()函数（原生HTTP请求API）

- axios对象（第三方Promise网络库）

三、前端独立开发

1. 开发工具

前端独立开发常用的IDE包括Visual Studio Code（VS Code）和WebStorm（JetBrains出品）。VS Code轻量开源，插件丰富；WebStorm功能强大，集成度高。

2. 项目目录结构

前端项目可选用多页应用（MPA）或单页应用（SPA）架构。文档以MyPetStore项目为例展示了典型目录结构：

MYPETSTORE-WEB-FRONT-DEMO/

├── src/

│   ├── css/          (样式文件)

│   ├── htm/          (HTML页面文件，如catalog-main.htm、cart-list.htm等)

│   ├── images/       (图片资源)

│   ├── js/           (JavaScript文件，如catalog.js、cart.js、user-login.js等)

│   └── index.htm     (入口页面)

3. MyPetStore项目实例

项目展示了宠物商店的目录功能，通过RESTful API获取数据。例如，通过"/catalog/categories/{id}/products"接口获取某分类下的所有产品，URL示例："/catalog/categories/BIRDS/products"。返回的JSON数据包含"productId"、"categoryId"、"name"、"description"等字段。

前端页面（如catalog-list.html）通过URL参数"?id=BIRDS&route=product"传递请求，由JavaScript函数"renderProductList(data)"渲染产品列表。该实例体现了前后端分离的思想：前端独立开发页面，通过异步请求获取后端数据。

***

四、Promise对象与异步请求

1. Promise简介

Promise是ES6引入的异步编程解决方案，用于替代传统的回调函数和事件处理。它本质上是一个容器，保存着某个未来才会结束的事件（异步操作）的结果。Promise有三种状态：

- pending（进行中）：初始状态

- fulfilled（已成功）：操作成功完成

- rejected（已失败）：操作失败

状态变化不可逆：只能从pending变为fulfilled，或从pending变为rejected。一旦状态改变，Promise对象就定型（resolved），后续添加的回调函数会立即执行。

2. 同步与异步差异及回调地狱

异步代码不能通过return返回结果，需借助回调函数。但多层嵌套回调会造成“回调地狱”，代码难以维护。Promise通过链式调用（".then()"）替代嵌套，使代码更清晰。

3. Promise基本用法

- 创建Promise对象："new Promise((resolve, reject) => { ... })"

- 状态变更：成功调用"resolve(value)"，失败调用"reject(reason)"

- 处理结果：通过"Promise.then(onFulfilled, onRejected)"或"Promise.catch(onRejected)"

- 链式调用：每个".then()"返回新的Promise，可继续调用".then()"

4. Promise的其他API

- "Promise.prototype.catch()"：专门处理rejected状态，相当于".then(null, onRejected)"

- "Promise.prototype.finally()"：无论成功或失败都会执行的回调

- "Promise.all(iterable)"：等待所有Promise完成，返回一个Promise；若有一个失败则立即失败

***

五、async和await关键字

1. async

"async"用于声明异步函数，函数返回一个Promise对象。语法上简化了Promise的创建，本质是Promise的语法糖。

2. await

"await"只能在"async"函数内部使用。它会阻塞当前"async"函数内的代码，直到等待的Promise状态改变，并自动返回其resolve的值。若Promise被reject，则抛出异常，需用"try...catch"捕获。

3. 使用注意事项

- "await"只阻塞"async"函数内部的代码，不影响外部线程。

- 优点是以同步方式编写异步代码，可读性强。

- 缺点是reject回调被忽略，必须用"try...catch"处理错误。

- 示例："let result = await fetch(url);" 使得请求变成顺序执行。

***

六、fetch()函数

1. 什么是fetch()

"fetch()"是ES6标准中用于替代XMLHttpRequest的原生HTTP请求API，基于Promise实现。现代浏览器原生支持，无需引入第三方库。

2. 基本用法

fetch(url, options)   // options可选，默认GET请求

- GET请求：直接"fetch(url)"，返回Promise。

- POST请求：需设置"method: 'POST'"、"body"（JSON字符串）、"headers"（如"'Content-Type': 'application/json'"）。

3. Response对象

"fetch()"返回的Promise resolve后得到一个"Response"对象，常用属性和方法：

- "response.ok"（布尔值，HTTP状态码2xx为true）

- "response.status"（整型状态码）

- "response.text()"（返回文本字符串）

- "response.json()"（返回解析后的JSON对象）

- "response.clone()"（由于底层基于Stream流只能读取一次，clone()可创建副本）

4. 注意

"fetch()"不会对HTTP错误状态（如404、500）自动reject，需要手动判断"response.ok"。

***

七、Axios

1. 简介

Axios是一个基于Promise的第三方HTTP库，可在浏览器和Node.js中使用。它对原生XHR进行了封装，提供更友好的API。

2. 主要特性

- 自动转换JSON数据（请求和响应）

- 支持请求和响应拦截器（如统一添加token）

- 支持请求取消（通过CancelToken或AbortController）

- 更丰富的配置（超时、请求头转换）

- 更好的错误处理：HTTP错误状态（404、500）会自动进入".catch()"

- 更好的浏览器兼容性（支持老版本浏览器）

3. 使用范例

axios.get(url)

  .then(response => { console.log(response.data); })

  .catch(error => { console.error(error); });

POST请求："axios.post(url, data, config)"。

***

八、fetch()与axios对比

| 特性 | fetch() | axios |

|------|---------|-------|

| 是否原生 | 原生API，无需额外依赖 | 第三方库，需引入 |
| JSON处理 | 手动调用".json()" | 自动转换 |
| 错误处理 | 仅网络错误reject，HTTP错误需手动检查"ok" | HTTP错误自动reject，进入catch |
| 请求取消 | 需配合AbortController | 支持CancelToken/AbortController |
| 拦截器 | 不支持 | 支持请求/响应拦截 |
| 超时设置 | 不支持原生超时，需手动封装 | 支持"timeout"配置 |
| 浏览器兼容 | 现代浏览器支持，IE不支持 | 兼容老版本浏览器 |
| 流式处理 | 支持ReadableStream（适合大文件渐进加载） | 不支持原生Stream |

选择建议：若项目较小、无需复杂配置，可用原生fetch；若需要拦截器、超时、自动转换、兼容旧浏览器等功能，推荐使用axios。

***

九、课堂展示与讨论

1. 课堂展示

文档提出一个实际案例：分别使用“XHR + Promise对象”、“fetch()”和“axios”实现用户注册功能，其中包含判断用户名是否可用的异步校验。该实践旨在让学生体会三种方式在代码简洁性、错误处理、可维护性上的差异。

2. 讨论：前端独立开发该如何演进？

- 模块化与组件化：从传统HTML+CSS+JS混乱结构走向组件化开发（如React、Vue）。
- 异步标准化：从回调→Promise→async/await，代码更清晰。
- API设计：RESTful到GraphQL等演进，提升数据查询效率。
- 工具链：Webpack、Vite等打包工具，以及ESLint、Prettier等代码规范工具。
- 跨平台：前端技术扩展到移动端（React Native）、桌面端（Electron）。
- 微前端：大型项目可采用微前端架构实现独立开发与部署。

***

十、总结

本章系统介绍了前端独立开发的核心技术栈，从异步编程的痛点（回调地狱）出发，讲述了Promise对象的基本原理与链式调用，进而引出async/await这一优雅的语法糖，使异步代码接近同步写法。同时，对比了原生fetch与第三方axios的优劣，并通过MyPetStore实例展示了真实项目中如何组织前端代码、调用RESTful API。最后，课堂展示和讨论环节引导学生思考前端开发的演进方向，强调了模块化、标准化和工具化对开发效率的提升作用。掌握这些知识，是成为现代前端开发者的重要基础。

---

***

一、前端工程化的概念

前端工程化属于软件工程的一种，包括四个方面：

- 模块化：将大工程拆分成相互依赖的小工程（文件），编译或运行时拼装加载。

- 组件化：将UI拆分成独立、可复用的组件。

- 规范化：制定代码风格、目录结构、开发流程等标准。

- 自动化：通过工具实现构建、测试、部署等流程自动化。

«狭义的工程化有时特指模块化。»

***

二、前端模块化的由来与分类

1. 由来

以“登录范例”为例，传统前端开发存在以下问题：

- 代码层面：繁琐、可读性差、质量低，不适合复杂业务。

- 效率层面：多次异步请求，服务器压力大。

- 架构层面：缺乏开发流程、构建规范，难以复用。

2. 分类

- 外部模块化：引入第三方包或插件（如jQuery、Vue等），通常由多个JS文件组成。

- 内部模块化：项目内部按功能分层或分类，每个模块通常由一个JS文件表示。

***

三、模块化的主要内容

1. 外部模块的管理：使用Node.js和NPM等工具管理第三方依赖。

2. 内部模块的组织：使用CommonJS或ES6模块语法组织代码。

3. 模块的编译与转换：使用Babel、Webpack等工具将模块化源码编译为浏览器可运行的代码。

***

四、Node.js与NPM

1. Node.js

- 跨平台、开源的服务端JavaScript运行环境，基于Chrome V8引擎。

- 可运行Windows、Linux、macOS等系统。

- 官网提供HTTP Server、文件读写、流管道、多线程等示例。

2. 版本管理

- 常见版本：Node.js 14、16、18、20等，有LTS（长期支持）和Current版本。

- 可使用NVM（Node Version Manager）管理多个Node.js版本。

3. NPM (Node Package Manager)

- Node.js内置的包管理工具，通过"package.json"管理项目依赖。

- 常用命令：

   - "npm init"：初始化项目，生成"package.json"。

   - "npm install <package>"：安装依赖，默认放入"node_modules"，并记录到"dependencies"。

   - "npm install <package>@<version>"：安装指定版本。

   - "npm install -D <package>"：安装开发依赖（devDependencies），生产环境不包含。

   - "npm install -g <package>"：全局安装（常用于命令行工具）。

- 生成"package-lock.json"锁定版本。

4. 其他包管理工具

- Yarn：由Facebook等推出，解决npm安装慢、版本一致性问题。提供"yarn.lock"，支持并行安装、本地缓存。

- pnpm：速度更快，节省磁盘空间（硬链接/克隆），支持单体仓库（monorepo），权限更严格（非扁平结构）。

***

五、内部模块的组织方式（演变）

1. 原始阶段

- 在HTML中通过多个"<script>"标签引入JS文件，每个文件代表一个模块。

- 问题：全局变量污染、依赖顺序难管理、需同步加载易卡死、HTTP请求多。

2. 在线处理阶段

- AMD（如RequireJS）和CMD（如SeaJS）：通过API声明模块和依赖，在浏览器下载后逐步分析加载。

- 问题：在线编译增加加载时间，产生大量HTTP请求，性能下降。

3. 预处理阶段（主流方式）

- CommonJS和ES6 Module：使用特殊语法在代码构建前完成模块合并，输出少量文件，减少HTTP请求。

- 优点：开发时模块化，运行时高效。

***

六、CommonJS与ES6模块化

1. CommonJS

- 每个文件是一个模块，有自己的作用域。

- "module.exports"导出，"require()"加载。

- 模块第一次加载后缓存结果，后续直接读取缓存。

- 所有代码运行在模块作用域，不污染全局。

- 加载顺序按代码出现顺序（同步）。

2. ES6 Module

- 原生JavaScript模块系统，使用"export"导出，"import"导入。

- 与CommonJS的区别：

   - CommonJS导出值的拷贝，ES6 Module导出值的绑定（引用）。

   - CommonJS单个值导出，ES6可导出多个。

   - CommonJS动态语法（可写在条件判断中），ES6静态语法（只能写在顶层）。

   - CommonJS中"this"指向当前模块，ES6 Module中"this"为"undefined"。

***

七、前端模块化的目标

开发时模块化，运行时非模块化。

步骤：

1. 使用CommonJS或ES6实现JavaScript模块化。

2. 使用Webpack等工具实现HTML、CSS、图片等资源的模块化。

***

八、Webpack

1. 定义

- 前端资源加载和打包工具，根据模块依赖关系静态分析，生成指定规则下的静态资源。

- 可将多种资源（JS、CSS、HTML等）合并成少数文件，减少页面请求。

2. 安装

- 全局安装："npm install -g webpack"

- 项目安装："npm install --save-dev webpack"

3. 基本概念

- 入口（entry）：指定webpack从哪个模块开始构建依赖图。

- 输出（output）：指定打包后文件的输出位置和文件名。

- 加载器（loader）：让webpack处理非JS资源（如CSS、图片），需安装css-loader、style-loader等。

- 插件（plugin）：执行范围更广的任务（如压缩、环境变量、HTML打包等），需require并加入plugins数组。

- 模式（mode）：开发模式（development）或生产模式（production），生产模式会压缩和加密代码。

4. 使用示例

- 配置"webpack.config.js"，指定entry、output、module（loader）、plugins等。

- 运行"webpack"命令生成打包文件到"dist"目录。

***

九、Vite

下一代前端工具链，特点：

- 极速服务启动：利用原生ESM，无需打包。

- 优化的构建：基于Rollup，支持多页应用或库模式。

- 轻量快速的热重载：无论应用大小，模块热替换（HMR）始终保持极速。

- 通用插件接口：开发与构建共享Rollup-superset插件系统。

- 丰富功能：开箱支持TypeScript、JSX、CSS等。

- 完全类型化的API：灵活且完整类型支持。

***

十、课堂展示（示例）

- 使用Webpack完成PetStore某个功能模块的开发和构建。

- 使用Vite完成PetStore某个功能模块的开发和构建。

***

总结

前端工程化与模块化为现代前端开发提供了可维护、可复用、可扩展的基础。通过Node.js和NPM管理外部依赖，使用CommonJS或ES6组织内部模块，再借助Webpack或Vite等工具完成打包与优化，最终实现高效、高性能的前端项目。理解这些概念和工具的使用，是成为一名合格前端开发者的关键。

---

***

一、前端开发面临的问题

1. 代码层面的问题

   - 缺少规范，代码组织混乱，随业务复杂度增加难以维护。

   - 缺少约束，变量和作用域易冲突，项目协作困难。

   - 缺少支撑，对程序员能力要求高。

2. 效率层面的问题

   - 项目无结构化，程序员需关注所有模块和流程。

   - 团队协作效率低，无法分工并行开发。

   - 测试需启动整个项目，效率低。

以上问题通过模块化（如CommonJS、ES Module、Webpack、Vite等）已得到有效解决。

***

二、前端框架的前身——模板渲染

- Hogan.js

Twitter团队开发的Mustache模板语法解析器，不依赖其他库，高效解析模板。它代表了早期通过模板引擎将数据渲染到DOM的思路，但仍是操作DOM的方式之一。

***

三、前端框架技术概述

1. Angular JS 与 Angular

- Angular JS（2009年诞生，后被Google收购）

   - 首次在前端引入MVC（MVVM）模式，实现View与Model的双向绑定。

   - 核心概念：View、Model、Template、ViewModel（$scope与数据绑定）。

   - 2022年1月正式停止支持。

- Angular（2016年发布）

   - 与Angular JS名称相似但无直接联系，是重新设计的框架。

   - 使用TypeScript，支持组件化、依赖注入、路由等完整解决方案。

2. React

- 背景：2013年由Facebook开源，专注于视图层的JavaScript库。

- 主要特点

   - 虚拟DOM：内存中轻量级DOM表示，通过Diff算法最小化真实DOM操作，提升性能。

   - 声明式编程 & JSX：使用类似XML的JSX语法在JS中编写HTML，直观定义UI。

   - 组件化：函数组件/类组件，通过Props接收父组件数据，State管理内部状态，现代React多使用函数组件+Hooks。

- 扩展：React Native用于移动原生应用开发；目前最新版本19.x。

3. Vue

- 背景：2014年由尤雨溪（Evan You）创建，渐进式框架，可逐步集成到现有项目。

- 主要特点

   - 模板语法与指令：基于HTML的模板，使用"v-"指令扩展功能。

   - 响应式双向绑定：数据变化自动更新视图，异步且高效。

   - 组件化：每个组件包含模板、数据、逻辑及生命周期。

   - 虚拟DOM（从2.x版本引入）。

   - 进阶功能：Vue Router（路由）、Vuex → Pinia（状态管理）。

- 优势：学习曲线平缓，API简洁，轻量高效。

***

四、三大框架对比总结

| 对比维度 | Angular JS → Angular | React | Vue |

|---------|-----------------------|-------|-----|

| 背景 | Google | Facebook | Alibaba（尤雨溪个人项目，后被阿里采用） |

| 数据绑定 | 双向绑定（Angular JS） | 单向绑定 | 双向绑定 |

| 模板能力 | 强大 | 自由（JSX） | 简洁（HTML模板） |

| 自由度 | 较小 | 大 | 较大 |

| 文档 | 英文 | 英文 | 多语言（中文支持好） |

| 上手难度 | 较高 | 较高 | 一般 |

| 核心贡献 | MVC/MVVM、双向绑定 | 虚拟DOM、声明式JSX、组件化 | 渐进式、易用性、集大成 |

下载趋势（近5年）

- Vue 的下载量在近几年显著增长，尤其在中国市场；React 和 Angular 长期领先，但 Vue 紧随其后。

***

五、课堂展示要求

- 使用 Angular、React、Vue 三大框架之一实现用户注册和登录功能，作为实践环节。

***

六、小结

本章从前端开发的实际问题出发，引出模块化解决方案，然后介绍了模板渲染工具（Hogan.js）作为过渡，最终详细阐述了 Angular JS/Angular、React、Vue 三者的核心原理、特点与使用方式，并通过对比帮助开发者根据项目需求选择合适的框架。

---

***

一、内容回顾与本章目标

- 内容回顾：前端三大主流框架 Angular、React、Vue 的基本概念。

- 课堂展示要求：使用三大框架之一实现用户注册和登录功能。

- 本章核心内容：

   - 框架中组件的状态管理（React & Vue）

   - 路由管理（React Router & Vue Router）

***

二、React 状态管理

React 是响应式框架，状态变化会自动触发 UI 刷新。状态管理分为三个层次：

1. 组件内的状态管理

- 使用 "useState" Hook 管理组件局部状态。

- 示例：计数器组件，"useState(0)" 定义 "count"，通过 "setCount" 更新，UI 自动刷新。

- 适用场景：输入框内容、点击次数等只在本组件使用的数据。

2. 组件之间的状态管理（状态提升）

- 将共享状态提升到共同父组件，通过 "props" 向下传递数据和修改方法。

- 示例：App 父组件管理 "count"，通过 props 传给子组件 Display（展示）和 Controls（控制按钮）。

- 缺点：层级深时会产生 Props Drilling，维护困难。

3. 全局状态管理（状态管理库）

- 适用于状态多、组件结构复杂的大型项目。

- 常见工具/库：

   - Context API：React 内置，适合轻量场景，通过 "createContext" + "useContext" 实现。

   - Redux：工业级，单向数据流，支持中间件，适合大项目。

   - Zustand：极简、Hooks 风格，写法简单，流行度高。

   - Recoil、Jotai、MobX 等，依项目需求选择。

4. React Hooks 概念

- Hooks 是 React 提供的“钩子”，让函数组件“挂载”到 React 内部机制上：

   - "useState" → 挂到状态管理系统

   - "useEffect" → 挂到副作用（生命周期）机制

   - "useContext" → 挂到 Context 读取全局状态

   - "useReducer" → 挂到 reducer 模式的状态管理

   - "useRef" → 挂到引用系统

- 比喻：组件像船，Hooks 是挂钩，无需编写 class 就能拥有 React 特性。

***

三、Vue 状态管理

Vue 的状态管理思路与 React 类似，但写法更简洁、响应式更“傻瓜式”。

| 层次 | 使用方式 | 适用场景 |

|------|----------|----------|

| 组件内部状态 | "data()" 或 "ref()" | 组件独享数据 |

| 父子组件传值 | "props" / "emit" | 一层层传递数据 |

| 跨组件共享（中小项目） | "provide" / "inject" | 类似 React 的 Context API |

| 全局状态（大型项目） | Pinia（推荐） / Vuex（旧） | 集中管理所有状态 |

- 示例：Vue 3 父子组件计数器，父组件通过 "props" 传值，子组件通过 "emit" 触发父组件事件修改状态。

***

四、路由管理（核心概念与功能）

1. 什么是路由管理

- 单页应用（SPA）的关键工具，实现无刷新页面跳转，将 URL 路径 映射到 组件。

2. React 路由（React Router）

- React 不内置路由，常用第三方库 "React Router"。

- 核心概念对应：

   - "createBrowserRouter()" 创建路由

   - "<Routes>" / "<Route>" 路由容器与配置

   - "useNavigate()" 编程式导航

   - "<Link>" 声明式导航

3. Vue 路由（Vue Router）

- Vue 官方路由库，API 与 React Router 功能对等。

- 对应关系：

   - "createRouter()" + "<RouterView>"

   - "routes" 配置

   - "router.push()" 编程式跳转

   - "<router-link>" 声明式导航

4. 路由管理的三个高级用法

1. 嵌套路由：父路由内包含子路由（如 "/dashboard/overview"、"/dashboard/settings"）。

2. 懒加载：使用 "React.lazy()"（React）或动态 "import()"（Vue）按需加载页面组件，提升性能。

3. 页面守卫（登录拦截）：在路由跳转前进行权限验证，React 通过自定义守卫组件，Vue 通过 "beforeEnter" 或 "router.beforeEach"。

***

五、路由管理实例（购物应用）

文档展示了一个示例项目的路由结构：

src/

├─ main.js

├─ App.vue

├─ router/

│  └─ index.js

└─ views/

   ├─ Home.vue          # 首页（商品列表）

   ├─ Product.vue       # /product/:id 商品详情

   ├─ Cart.vue          # /cart 购物车

   └─ Checkout.vue      # /checkout 结算页（模拟登录守卫）

各路由对应的页面功能清晰，并强调了登录守卫的模拟实现。

***

六、总结

- 状态管理：React 和 Vue 都提供了从组件内到全局的分层方案，React 依赖 Hooks，Vue 依赖 Composition API 或 Options API。选择合适的状态管理方式有助于提高代码可维护性。

- 路由管理：React Router 和 Vue Router 均支持嵌套路由、懒加载、页面守卫等高级功能，是构建现代 SPA 的必备工具。

- 实战建议：根据项目规模选择状态管理工具（小项目用 Context/provide，大项目用 Redux/Pinia），并且合理利用路由懒加载和守卫优化用户体验和安全性。