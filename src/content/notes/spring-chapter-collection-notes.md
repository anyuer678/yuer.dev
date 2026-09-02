---
title: "软件开发架构平台章节笔记合集（CH01-08）"
date: "2025-06"
type: "learning"
tags: [Spring, SpringBoot, MyBatis, Maven, Vue]
summary: "软件开发架构平台各章详细笔记合集，覆盖架构框架概述、Spring基础、AOP、MVC、Boot、ORM、RESTful、Vue（共8篇章节笔记合并）"
---

# 软件开发架构平台章节笔记合集（CH01-08）


---

## 章节：CH01+开发架构与框架技术概述笔记

软件开发架构平台 - CH01 开发架构与框架技术概述 详细笔记

一、软件开发架构概述

1.1 什么是软件架构

软件架构的定义：
- 软件架构是软件系统的高层次结构
- 它描述了系统的组成部分、各组成部分之间的关系以及它们与环境之间的关系
- 软件架构是系统设计的早期决策，对系统的质量和性能有深远影响
- 软件架构是可重用的设计知识

软件架构的重要性：
1. 沟通工具：架构是项目干系人之间沟通的基础
2. 早期设计决策：架构包含了系统的早期设计决策，影响深远
3. 可转移性：架构知识可以转移到其他系统
4. 质量保证：架构直接影响系统的质量属性（性能、安全性、可维护性等）
5. 项目管理：架构影响项目的组织和管理

1.2 软件架构的历史

第一阶段（20世纪60-70年代）：无架构阶段
- 软件规模小，架构不明显
- 主要关注算法和数据结构
- 例子：早期的科学计算程序

第二阶段（20世纪80年代）：结构化设计阶段
- 自顶向下，逐步分解
- 模块化设计
- 例子：结构化分析与设计方法（SA/SD）

第三阶段（20世纪90年代）：面向对象阶段
- 面向对象分析与设计（OOAD）
- 设计模式（Design Patterns）
- 例子：C++、Java应用

第四阶段（2000年代至今）：架构阶段
- 软件架构成为独立的研究领域
- 架构风格和模式
- 架构描述语言（ADL）
- 例子：微服务、云原生架构

1.3 软件架构的质量属性

质量属性（Quality Attributes）：
- 也叫非功能需求（NFR，Non-Functional Requirements）
- 描述系统的质量特征，而不是功能特征
- 架构设计的主要目标是满足质量属性

常见的质量属性：

1. 性能（Performance）
   - 响应时间（Response Time）：系统对请求的响应时间
   - 吞吐量（Throughput）：单位时间内处理的请求数
   - 资源利用率（Resource Utilization）：CPU、内存、网络等的利用率
   - 影响因素：架构设计、算法选择、数据结构

2. 可修改性（Modifiability）
   - 可维护性（Maintainability）：修复bug和改进功能的难易程度
   - 可扩展性（Extensibility）：添加新功能的难易程度
   - 可重用性（Reusability）：组件在其他系统中重用的难易程度
   - 可移植性（Portability）：系统从一个环境迁移到另一个环境的难易程度

3. 可用性（Availability）
   - 可用性 = 正常运行时间 / 总时间
   - 通常用"9"表示：
     - 99%：每年停机约3.65天
     - 99.9%：每年停机约8.76小时
     - 99.99%：每年停机约52.56分钟
     - 99.999%：每年停机约5.26分钟
   - 提高可用性的方法：冗余、容错、故障检测和恢复

4. 安全性（Security）
   - 机密性（Confidentiality）：数据不被未授权访问
   - 完整性（Integrity）：数据不被篡改
   - 可用性（Availability）：服务可用
   - 认证（Authentication）：确认用户身份
   - 授权（Authorization）：控制用户权限
   - 不可否认（Non-repudiation）：防止否认行为

5. 易用性（Usability）
   - 学习难度：用户学习使用系统的难易程度
   - 操作效率：用户完成任务的效率
   - 出错率：用户使用时出错的概率
   - 满意度：用户对系统的满意程度

6. 可测试性（Testability）
   - 可观察性（Observability）：观察系统状态的难易程度
   - 可控制性（Controllability）：控制系统输入的难易程度
   - 可诊断性（Diagnosability）：定位故障的难易程度

7. 其他质量属性
   - 可靠性（Reliability）：系统在规定时间内无故障运行的概率
   - 健壮性（Robustness）：系统在异常情况下的行为
   - 互操作性（Interoperability）：系统与其他系统交互的能力
   - 合规性（Compliance）：系统符合法规和标准的程度

1.4 架构设计的原则

1. 关注点分离（Separation of Concerns，SoC）
   - 将不同的功能分离到不同的模块
   - 每个模块只关注一个特定的关注点
   - 例子：MVC模式分离了模型、视图、控制器

2. 单一职责原则（Single Responsibility Principle，SRP）
   - 一个类或模块应该只有一个改变的理由
   - 每个类只负责一个功能

3. 开闭原则（Open/Closed Principle，OCP）
   - 对扩展开放，对修改关闭
   - 通过添加新代码来扩展功能，而不是修改现有代码

4. 里氏替换原则（Liskov Substitution Principle，LSP）
   - 子类应该可以替换父类
   - 子类不能改变父类的行为

5. 接口隔离原则（Interface Segregation Principle，ISP）
   - 不应该强迫客户依赖他们不需要的接口
   - 接口应该小而专一

6. 依赖倒置原则（Dependency Inversion Principle，DIP）
   - 高层模块不应该依赖低层模块，都应该依赖抽象
   - 抽象不应该依赖细节，细节应该依赖抽象

7. 高内聚（High Cohesion）
   - 一个模块内部的元素紧密相关
   - 模块只做一件事，并且做好

8. 低耦合（Low Coupling）
   - 模块之间的依赖关系松散
   - 一个模块的变化对其他模块的影响小

9. 信息隐藏（Information Hiding）
   - 隐藏模块的内部实现细节
   - 只通过接口与外部交互

10. 不要重复自己（Don't Repeat Yourself，DRY）
    - 避免代码重复
    - 每个知识只在一个地方表示

二、软件架构风格

2.1 什么是架构风格

架构风格（Architectural Style）的定义：
- 架构风格是一种惯用的模式，描述了系统的组织方式
- 架构风格定义了组件的类型、组件之间的连接方式以及拓扑约束
- 架构风格可以重用

架构风格的好处：
- 促进设计重用
- 促进代码重用
- 提供通用的术语
- 便于分析和评估
- 降低复杂性

2.2 常见的架构风格

1. 分层架构（Layered Architecture）
   - 也叫N层架构
   - 将系统分为多个层次
   - 每层只依赖下层，为上层提供服务
   - 常见的层次：
     - 表现层（Presentation Layer）：用户界面
     - 业务层（Business Layer）：业务逻辑
     - 持久层（Persistence Layer）：数据访问
     - 数据层（Data Layer）：数据存储
   - 例子：传统的企业应用、桌面应用
   - 优点：
     - 简单易懂
     - 易于开发
     - 易于测试
     - 易于维护
   - 缺点：
     - 可能导致"污水池反模式"（所有东西都放在中间层）
     - 性能可能较差（每层都有开销）
     - 扩展性有限

2. 客户端-服务器架构（Client-Server Architecture）
   - 两个部分：客户端和服务器
   - 客户端请求服务，服务器提供服务
   - 例子：Web应用（浏览器-服务器）、数据库应用
   - 优点：
     - 职责分离
     - 数据集中管理
     - 易于维护
   - 缺点：
     - 服务器是单点故障
     - 服务器可能成为瓶颈

3. 主从架构（Master-Slave Architecture）
   - 一个主节点，多个从节点
   - 主节点负责协调，从节点负责执行
   - 例子：数据库主从复制、并行计算
   - 优点：
     - 提高性能
     - 提高可用性
   - 缺点：
     - 主节点是单点故障
     - 数据一致性问题

4. 管道-过滤器架构（Pipe-Filter Architecture）
   - 组件：过滤器（Filter）、管道（Pipe）
   - 过滤器：处理数据
   - 管道：在过滤器之间传递数据
   - 例子：Unix shell管道、编译器
   - 优点：
     - 简单
     - 可重用
     - 可并行
   - 缺点：
     - 不适合交互式应用
     - 数据转换开销

5. 事件驱动架构（Event-Driven Architecture，EDA）
   - 通过事件进行通信
   - 组件：事件生产者、事件消费者、事件通道
   - 例子：GUI应用、消息队列系统
   - 优点：
     - 松耦合
     - 可扩展
     - 异步
   - 缺点：
     - 调试困难
     - 事件顺序问题

6. 微内核架构（Microkernel Architecture）
   - 也叫插件架构（Plugin Architecture）
   - 核心系统 + 插件
   - 核心系统提供基本功能，插件提供扩展功能
   - 例子：Eclipse、VS Code、浏览器
   - 优点：
     - 灵活
     - 可扩展
     - 可定制
   - 缺点：
     - 设计复杂
     - 性能可能较差

7. 微服务架构（Microservices Architecture）
   - 将应用拆分为多个小的、独立的服务
   - 每个服务：
     - 独立部署
     - 独立扩展
     - 使用自己的数据库
     - 通过API通信
   - 例子：Netflix、Amazon、Uber
   - 优点：
     - 可独立部署和扩展
     - 技术栈灵活
     - 容错性好
     - 易于理解和维护
   - 缺点：
     - 复杂性高
     - 分布式系统问题
     - 运维成本高
     - 数据一致性困难

8. 云原生架构（Cloud Native Architecture）
   - 为云环境设计的架构
   - 特点：
     - 微服务
     - 容器化（Docker）
     - 容器编排（Kubernetes）
     - 持续集成/持续部署（CI/CD）
     - 自动化运维
     - 弹性伸缩
   - 例子：基于云平台的现代应用
   - 优点：
     - 弹性
     - 高可用
     - 低成本
     - 快速交付

9. 领域驱动设计（Domain-Driven Design，DDD）
   - 以领域为核心的设计方法
   - 核心概念：
     - 限界上下文（Bounded Context）
     - 聚合（Aggregate）
     - 实体（Entity）
     - 值对象（Value Object）
     - 领域服务（Domain Service）
     - 领域事件（Domain Event）
   - 优点：
     - 业务清晰
     - 模型与实现一致
     - 易于沟通

2.3 架构风格的选择

选择架构风格的考虑因素：
1. 需求：功能需求和非功能需求
2. 团队：团队的经验和技能
3. 技术：可用的技术和工具
4. 时间：项目的时间要求
5. 成本：项目的预算
6. 演进：系统的未来发展

没有最好的架构风格，只有最适合的架构风格。

三、软件框架概述

3.1 什么是软件框架

软件框架（Framework）的定义：
- 框架是一个可复用的软件结构
- 它提供了通用的功能和服务
- 应用程序通过填充框架的"热点"来定制
- 框架控制应用程序的流程（控制反转，IoC）

框架与库（Library）的区别：
- 库（Library）：
  - 是一组可重用的函数和类
  - 应用程序调用库
  - 应用程序控制流程
- 框架（Framework）：
  - 是一个可重用的骨架
  - 框架调用应用程序的代码
  - 框架控制流程（好莱坞原则："不要打电话给我们，我们会打电话给你"）

例子：
- 库：printf()、sort()、jQuery
- 框架：Spring、Django、React

3.2 框架的好处

1. 提高开发效率
   - 提供通用功能
   - 减少重复代码
   - 加快开发速度

2. 提高软件质量
   - 经过验证的架构
   - 最佳实践
   - 减少错误

3. 降低学习曲线
   - 统一的开发方式
   - 丰富的文档和社区
   - 大量的示例

4. 促进团队协作
   - 统一的架构
   - 统一的编码规范
   - 便于代码审查

5. 便于维护和扩展
   - 清晰的结构
   - 模块化设计
   - 易于理解和修改

3.3 框架的类型

按应用领域分类：
1. Web框架
   - 后端：Spring、Django、Express、Flask
   - 前端：React、Vue、Angular
2. 移动应用框架
   - Android：Android SDK
   - iOS：iOS SDK
   - 跨平台：React Native、Flutter、Xamarin
3. 游戏框架
   - Unity、Unreal Engine、Cocos2d
4. 桌面应用框架
   - Qt、Electron、WinForms、WPF
5. 数据处理框架
   - Hadoop、Spark、Flink

按编程语言分类：
1. Java框架
   - Spring、Spring Boot、MyBatis、Hibernate
2. Python框架
   - Django、Flask、Tornado
3. JavaScript框架
   - React、Vue、Angular、Express
4. C#框架
   - ASP.NET、.NET Core
5. Go框架
   - Gin、Echo、Beego

3.4 常见的Java企业级框架

1. Spring框架
   - 最流行的Java企业级框架
   - 核心功能：
     - 控制反转（IoC）
     - 面向切面编程（AOP）
     - 数据访问
     - Web开发
     - 测试支持
   - 生态系统：Spring Boot、Spring Cloud、Spring Data、Spring Security等

2. Spring Boot
   - 基于Spring的快速开发框架
   - 特点：
     - 约定优于配置
     - 自动配置
     - 内嵌服务器
     - 生产就绪
     - 无需XML配置
   - 目标：快速开发独立的、生产级的Spring应用

3. MyBatis
   - 持久层框架
   - 特点：
     - SQL映射
     - 灵活的SQL
     - 简单易用
     - 与Spring集成良好
   - 对比Hibernate：
     - MyBatis：SQL控制灵活，适合复杂查询
     - Hibernate：ORM，开发效率高，SQL控制较弱

4. Spring MVC
   - Web框架
   - 基于MVC模式
   - 特点：
     - 灵活
     - 可扩展
     - 与Spring集成
   - 核心组件：
     - DispatcherServlet
     - Controller
     - Model
     - View

5. Spring Cloud
   - 微服务框架
   - 特点：
     - 服务发现
     - 配置管理
     - 熔断器
     - 网关
     - 分布式追踪

四、架构与框架的关系

4.1 架构与框架的区别

架构（Architecture）：
- 是设计决策
- 是系统的结构
- 比较抽象
- 可以用不同的技术实现

框架（Framework）：
- 是软件实现
- 是代码
- 比较具体
- 是架构的一种实现

4.2 架构与框架的联系

- 框架可以帮助实现架构
- 框架通常体现了某种架构风格
- 选择框架时要考虑架构需求
- 可以在框架的基础上进行架构设计

五、总结

5.1 软件架构要点
- 架构是系统的高层次结构
- 架构影响系统的质量属性
- 有多种架构风格
- 选择合适的架构风格很重要

5.2 软件框架要点
- 框架是可复用的软件结构
- 框架提供通用功能
- 框架控制流程（IoC）
- 框架可以提高开发效率和软件质量

5.3 架构与框架的选择
- 根据需求选择
- 考虑团队技能
- 考虑技术生态
- 考虑未来发展

5.4 学习的意义
- 理解常见的架构风格
- 掌握主流框架的使用
- 能够根据需求进行架构设计
- 能够选择合适的框架

---

## 章节：CH02+Spring框架基础笔记

软件开发架构平台 - CH02 Spring框架基础 详细笔记

一、Spring框架概述

1.1 什么是Spring

Spring框架的定义：
- Spring是一个轻量级的Java企业级应用开发框架
- 由Rod Johnson在2003年创建
- Spring的核心是控制反转（IoC）和面向切面编程（AOP）
- Spring的目标是简化Java企业级应用开发

Spring的设计理念：
1. 轻量级（Lightweight）：Spring本身很小，不需要很多依赖
2. 非侵入式（Non-invasive）：应用程序代码不依赖Spring API
3. 控制反转（IoC）：将对象的创建和依赖管理交给Spring
4. 面向切面编程（AOP）：将横切关注点与业务逻辑分离
5. 容器（Container）：Spring是一个容器，管理应用程序对象
6. 一站式（One-stop shop）：Spring提供企业级应用需要的所有功能

1.2 Spring的历史

Spring的起源：
- 2002年，Rod Johnson写了一本书《Expert One-on-One J2EE Design and Development》
- 书中提出了一个简单的框架来简化J2EE开发
- 这个框架后来发展成为Spring框架

Spring的发展：
- 2003年：Spring 1.0发布
- 2006年：Spring 2.0发布
- 2009年：Spring 3.0发布
- 2013年：Spring 4.0发布
- 2017年：Spring 5.0发布（支持Java 8、响应式编程）
- 2022年：Spring 6.0发布（支持Java 17、Jakarta EE）

Spring生态系统：
- Spring Framework：核心框架
- Spring Boot：快速开发框架
- Spring Cloud：微服务框架
- Spring Data：数据访问框架
- Spring Security：安全框架
- Spring Batch：批处理框架
- Spring Integration：集成框架
- 等等

1.3 Spring的优点

Spring的优点：
1. 降低开发难度
   - 简化了企业级应用开发
   - 减少了样板代码

2. 提高开发效率
   - 提供了丰富的功能
   - 可以快速开发应用

3. 提高代码质量
   - 促进了好的编程实践
   - 代码更容易测试

4. 降低耦合度
   - 依赖注入降低了组件之间的耦合
   - 代码更容易维护和扩展

5. 提高可测试性
   - 依赖注入使得代码更容易单元测试
   - 可以轻松地替换依赖

6. 一站式解决方案
   - 提供了企业级应用需要的所有功能
   - 不需要学习多个框架

1.4 Spring的模块

Spring框架的模块：
```
spring-core
  ├── spring-core（核心工具）
  ├── spring-beans（Bean管理）
  ├── spring-context（上下文）
  ├── spring-context-support（上下文支持）
  ├── spring-expression（表达式语言）
spring-aop
  ├── spring-aop（面向切面编程）
  ├── spring-aspects（AspectJ集成）
spring-data
  ├── spring-jdbc（JDBC）
  ├── spring-tx（事务）
  ├── spring-orm（ORM）
  ├── spring-oxm（对象/XML映射）
  ├── spring-jms（JMS）
spring-web
  ├── spring-web（Web基础）
  ├── spring-webmvc（Web MVC）
  ├── spring-websocket（WebSocket）
spring-test
  ├── spring-test（测试）
```

主要模块说明：
1. Core Container（核心容器）
   - spring-core：Spring的核心工具类
   - spring-beans：Bean工厂，管理Bean的创建和依赖
   - spring-context：上下文，基于核心容器构建，提供更多功能
   - spring-context-support：支持集成第三方库
   - spring-expression：Spring表达式语言（SpEL）

2. AOP（面向切面编程）
   - spring-aop：AOP联盟的AOP实现
   - spring-aspects：与AspectJ的集成

3. Data Access/Integration（数据访问/集成）
   - spring-jdbc：JDBC支持，简化JDBC编程
   - spring-tx：事务管理
   - spring-orm：ORM集成（Hibernate、JPA等）
   - spring-oxm：对象/XML映射
   - spring-jms：JMS支持

4. Web（Web）
   - spring-web：Web基础功能
   - spring-webmvc：Spring MVC框架
   - spring-websocket：WebSocket支持

5. Test（测试）
   - spring-test：Spring应用的测试支持

二、控制反转（IoC）

2.1 什么是IoC

IoC（Inversion of Control，控制反转）的定义：
- 控制反转是一种设计思想
- 将对象的创建和依赖管理的控制权从应用程序代码反转给框架
- 传统方式：应用程序自己创建对象，管理依赖
- IoC方式：框架创建对象，注入依赖

IoC的核心：
- 依赖查找（Dependency Lookup）：容器中查找依赖
- 依赖注入（Dependency Injection，DI）：容器注入依赖

2.2 为什么需要IoC

传统方式的问题：
```java
public class UserService {
    private UserDao userDao = new UserDaoImpl(); // 硬编码依赖
    
    public void addUser(User user) {
        userDao.add(user);
    }
}
```
问题：
1. 耦合度高：UserService直接依赖UserDaoImpl
2. 难以测试：不能轻松替换UserDao
3. 难以扩展：如果要换一个UserDao实现，需要修改代码

IoC方式的解决：
```java
public class UserService {
    private UserDao userDao;
    
    // 构造器注入
    public UserService(UserDao userDao) {
        this.userDao = userDao;
    }
    
    public void addUser(User user) {
        userDao.add(user);
    }
}
```
优点：
1. 耦合度低：UserService不依赖具体实现
2. 易于测试：可以注入Mock对象
3. 易于扩展：可以轻松替换实现

2.3 依赖注入（DI）

依赖注入（Dependency Injection，DI）的定义：
- DI是IoC的一种实现方式
- 容器将依赖注入到对象中
- 不需要对象自己查找依赖

依赖注入的方式：
1. 构造器注入（Constructor Injection）
2. Setter注入（Setter Injection）
3. 字段注入（Field Injection）

1. 构造器注入
```java
public class UserService {
    private UserDao userDao;
    
    public UserService(UserDao userDao) {
        this.userDao = userDao;
    }
}
```
优点：
- 依赖不可变（可以声明为final）
- 保证对象总是处于有效状态
- 更容易测试
缺点：
- 如果依赖很多，构造器会很长

2. Setter注入
```java
public class UserService {
    private UserDao userDao;
    
    public void setUserDao(UserDao userDao) {
        this.userDao = userDao;
    }
}
```
优点：
- 灵活，可以在对象创建后修改依赖
- 适合可选依赖
缺点：
- 对象可能处于无效状态（忘记设置依赖）
- 依赖可变

3. 字段注入
```java
public class UserService {
    @Autowired
    private UserDao userDao;
}
```
优点：
- 代码简洁
缺点：
- 依赖不可见
- 难以测试
- 违反单一职责原则（依赖容器）

推荐：
- 优先使用构造器注入
- 可选依赖使用Setter注入
- 避免使用字段注入

2.4 IoC容器

IoC容器的定义：
- IoC容器是Spring的核心
- 负责创建对象，管理依赖
- 也叫Bean容器

Spring的IoC容器：
1. BeanFactory：最基本的容器
2. ApplicationContext：更高级的容器，基于BeanFactory

BeanFactory：
- 最基本的IoC容器
- 延迟初始化（Lazy initialization）
- 只有在需要Bean时才创建
- 适合资源受限的环境

ApplicationContext：
- 更高级的IoC容器
- 继承BeanFactory的所有功能
- 提供更多功能：
  - 事件发布
  - 国际化
  - AOP集成
  - Web应用支持
- 立即初始化（Eager initialization）
- 启动时创建所有单例Bean
- 推荐使用

ApplicationContext的实现类：
1. ClassPathXmlApplicationContext：从classpath加载XML配置
2. FileSystemXmlApplicationContext：从文件系统加载XML配置
3. AnnotationConfigApplicationContext：从注解配置加载
4. WebApplicationContext：Web应用使用

例子：使用ClassPathXmlApplicationContext
```java
// 加载配置文件
ApplicationContext context = new ClassPathXmlApplicationContext("applicationContext.xml");

// 获取Bean
UserService userService = context.getBean(UserService.class);

// 使用Bean
userService.addUser(user);
```

例子：使用AnnotationConfigApplicationContext
```java
// 加载配置类
ApplicationContext context = new AnnotationConfigApplicationContext(AppConfig.class);

// 获取Bean
UserService userService = context.getBean(UserService.class);

// 使用Bean
userService.addUser(user);
```

三、Bean管理

3.1 什么是Bean

Bean的定义：
- Bean是由Spring IoC容器管理的对象
- 任何Java对象都可以是Bean
- Bean由容器创建、组装、管理

Bean与普通对象的区别：
- 普通对象：应用程序自己创建
- Bean：Spring容器创建和管理

3.2 配置Bean

配置Bean的方式：
1. XML配置
2. 注解配置
3. Java配置

方式1：XML配置
```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
           http://www.springframework.org/schema/beans/spring-beans.xsd">

    <!-- 配置UserDaoImpl -->
    <bean id="userDao" class="com.example.dao.UserDaoImpl"/>

    <!-- 配置UserService，注入userDao -->
    <bean id="userService" class="com.example.service.UserService">
        <!-- 构造器注入 -->
        <constructor-arg ref="userDao"/>
    </bean>

</beans>
```

方式2：注解配置
```java
// 配置类，启用组件扫描
@Configuration
@ComponentScan("com.example")
public class AppConfig {
}

// UserDaoImpl，使用@Component注解
@Component
public class UserDaoImpl implements UserDao {
    public void add(User user) {
        System.out.println("Adding user: " + user);
    }
}

// UserService，使用@Component注解，构造器注入
@Component
public class UserService {
    private UserDao userDao;
    
    @Autowired
    public UserService(UserDao userDao) {
        this.userDao = userDao;
    }
    
    public void addUser(User user) {
        userDao.add(user);
    }
}
```

常用的组件注解：
- @Component：通用组件
- @Repository：持久层组件（DAO）
- @Service：业务层组件（Service）
- @Controller：控制层组件（Controller）
- @RestController：REST控制器

这些注解的作用是相同的，只是为了语义更清晰。

方式3：Java配置
```java
@Configuration
public class AppConfig {
    
    @Bean
    public UserDao userDao() {
        return new UserDaoImpl();
    }
    
    @Bean
    public UserService userService(UserDao userDao) {
        return new UserService(userDao);
    }
}
```

3.3 Bean的作用域

Bean的作用域（Scope）：
- 作用域定义了Bean的生命周期
- Spring提供了6种作用域

| 作用域 | 说明 |
|--------|------|
| singleton | 单例，整个应用只有一个实例（默认） |
| prototype | 原型，每次获取都创建新实例 |
| request | Web应用，每个HTTP请求一个实例 |
| session | Web应用，每个HTTP会话一个实例 |
| application | Web应用，每个ServletContext一个实例 |
| websocket | Web应用，每个WebSocket一个实例 |

1. singleton（单例）
- 默认作用域
- 容器中只有一个Bean实例
- 所有请求共享同一个实例
- 适合无状态的Bean
- 例子：
```xml
<bean id="userService" class="com.example.UserService" scope="singleton"/>
```
或者：
```java
@Component
@Scope("singleton")
public class UserService {
}
```

2. prototype（原型）
- 每次获取Bean都创建新实例
- 适合有状态的Bean
- 例子：
```xml
<bean id="user" class="com.example.User" scope="prototype"/>
```
或者：
```java
@Component
@Scope("prototype")
public class User {
}
```

3. request
- 每个HTTP请求创建一个Bean实例
- 只在Web应用中有效
- 例子：
```java
@Component
@Scope("request")
public class RequestContext {
}
```

4. session
- 每个HTTP会话创建一个Bean实例
- 只在Web应用中有效
- 例子：
```java
@Component
@Scope("session")
public class UserSession {
}
```

3.4 Bean的生命周期

Bean的生命周期：
1. 实例化（Instantiation）：创建Bean实例
2. 属性赋值（Populate properties）：注入依赖
3. 初始化前（Before initialization）：BeanPostProcessor.postProcessBeforeInitialization
4. 初始化（Initialization）：
   - @PostConstruct方法
   - InitializingBean.afterPropertiesSet
   - init-method
5. 初始化后（After initialization）：BeanPostProcessor.postProcessAfterInitialization
6. 使用（Use）：Bean可以使用了
7. 销毁（Destruction）：
   - @PreDestroy方法
   - DisposableBean.destroy
   - destroy-method

生命周期回调的方式：
1. 注解方式：@PostConstruct、@PreDestroy
2. 接口方式：InitializingBean、DisposableBean
3. XML配置方式：init-method、destroy-method

例子1：注解方式
```java
@Component
public class UserService {
    private UserDao userDao;
    
    @Autowired
    public UserService(UserDao userDao) {
        this.userDao = userDao;
    }
    
    @PostConstruct
    public void init() {
        System.out.println("UserService initialized");
    }
    
    @PreDestroy
    public void destroy() {
        System.out.println("UserService destroyed");
    }
}
```

例子2：接口方式
```java
@Component
public class UserService implements InitializingBean, DisposableBean {
    private UserDao userDao;
    
    @Autowired
    public UserService(UserDao userDao) {
        this.userDao = userDao;
    }
    
    @Override
    public void afterPropertiesSet() throws Exception {
        System.out.println("UserService initialized");
    }
    
    @Override
    public void destroy() throws Exception {
        System.out.println("UserService destroyed");
    }
}
```

例子3：XML方式
```xml
<bean id="userService" class="com.example.UserService"
      init-method="init" destroy-method="destroy">
    <constructor-arg ref="userDao"/>
</bean>
```

四、面向切面编程（AOP）

4.1 什么是AOP

AOP（Aspect-Oriented Programming，面向切面编程）的定义：
- AOP是一种编程思想
- 将横切关注点（Cross-cutting concerns）与业务逻辑分离
- 横切关注点：日志、事务、安全、性能监控等
- 这些功能分散在多个模块中，很难维护
- AOP可以将这些功能集中管理

AOP的术语：
1. 切面（Aspect）：横切关注点的模块化
2. 连接点（Join point）：程序执行过程中的点
3. 通知（Advice）：在连接点执行的动作
4. 切入点（Pointcut）：匹配连接点的表达式
5. 织入（Weaving）：将切面应用到目标对象的过程

4.2 AOP的通知类型

通知（Advice）的类型：
1. 前置通知（Before）：在方法执行前执行
2. 后置通知（After）：在方法执行后执行（无论是否异常）
3. 返回通知（After Returning）：在方法成功返回后执行
4. 异常通知（After Throwing）：在方法抛出异常后执行
5. 环绕通知（Around）：包围方法执行，可以在方法前后执行

例子：
```java
@Aspect
@Component
public class LoggingAspect {
    
    @Before("execution(* com.example.service.*.*(..))")
    public void before(JoinPoint joinPoint) {
        System.out.println("Before method: " + joinPoint.getSignature());
    }
    
    @After("execution(* com.example.service.*.*(..))")
    public void after(JoinPoint joinPoint) {
        System.out.println("After method: " + joinPoint.getSignature());
    }
    
    @AfterReturning(pointcut = "execution(* com.example.service.*.*(..))",
                    returning = "result")
    public void afterReturning(JoinPoint joinPoint, Object result) {
        System.out.println("Method returned: " + result);
    }
    
    @AfterThrowing(pointcut = "execution(* com.example.service.*.*(..))",
                   throwing = "ex")
    public void afterThrowing(JoinPoint joinPoint, Exception ex) {
        System.out.println("Method threw exception: " + ex);
    }
    
    @Around("execution(* com.example.service.*.*(..))")
    public Object around(ProceedingJoinPoint joinPoint) throws Throwable {
        long start = System.currentTimeMillis();
        Object result = joinPoint.proceed();
        long end = System.currentTimeMillis();
        System.out.println("Method took: " + (end - start) + "ms");
        return result;
    }
}
```

4.3 切入点表达式

切入点表达式（Pointcut Expression）：
- 用于匹配连接点
- Spring使用AspectJ的切入点表达式

常用的切入点指示器：
- execution：匹配方法执行
- within：匹配类型
- this：匹配Bean实例
- target：匹配目标对象
- @annotation：匹配注解

execution表达式的语法：
```
execution(modifiers-pattern? ret-type-pattern declaring-type-pattern? 
          name-pattern(param-pattern) throws-pattern?)
```
- modifiers-pattern：修饰符（可选）
- ret-type-pattern：返回类型（必需）
- declaring-type-pattern：声明类型（可选）
- name-pattern：方法名（必需）
- param-pattern：参数（必需）
- throws-pattern：异常（可选）

例子：
1. 匹配所有public方法：
   ```
   execution(public * *(..))
   ```

2. 匹配所有以get开头的方法：
   ```
   execution(* get*(..))
   ```

3. 匹配com.example.service包下所有类的所有方法：
   ```
   execution(* com.example.service.*.*(..))
   ```

4. 匹配com.example.service包及其子包下所有类的所有方法：
   ```
   execution(* com.example.service..*.*(..))
   ```

5. 匹配所有返回String的方法：
   ```
   execution(String *(..))
   ```

6. 匹配所有只有一个参数且是String的方法：
   ```
   execution(* *(String))
   ```

7. 匹配所有有两个参数且第一个是String的方法：
   ```
   execution(* *(String, ..))
   ```

五、总结

5.1 Spring框架要点
- Spring是一个轻量级的Java企业级框架
- 核心是IoC和AOP
- 模块化设计，按需使用

5.2 IoC要点
- 控制反转：将对象创建和依赖管理交给Spring
- 依赖注入：构造器注入、Setter注入、字段注入
- IoC容器：BeanFactory、ApplicationContext

5.3 Bean管理要点
- 配置方式：XML、注解、Java配置
- 作用域：singleton、prototype、request、session等
- 生命周期：实例化、属性赋值、初始化、使用、销毁

5.4 AOP要点
- 面向切面编程：分离横切关注点
- 通知类型：Before、After、AfterReturning、AfterThrowing、Around
- 切入点表达式：execution等

5.5 学习的意义
- 理解Spring的核心概念
- 掌握Spring的基本使用
- 为学习Spring Boot和Spring Cloud打下基础

---

## 章节：CH03+Spring+AOP原理和实现笔记

软件开发架构平台 - CH03 Spring AOP原理和实现 详细笔记

一、AOP概述

1.1 什么是AOP

AOP（Aspect-Oriented Programming，面向切面编程）的定义：
- AOP是一种编程思想
- 它将横切关注点（Cross-cutting Concerns）与业务逻辑分离
- 横切关注点：散布在多个模块中的功能
- 例子：日志、事务、安全、性能监控、异常处理

为什么需要AOP：
- 传统的OOP（面向对象编程）将功能分解为对象
- 但有些功能不适合用对象表示
- 这些功能会散布在多个对象中
- 导致代码混乱、难以维护

横切关注点的例子：
1. 日志（Logging）：记录方法调用
2. 事务（Transaction）：管理事务边界
3. 安全（Security）：检查权限
4. 性能监控（Performance Monitoring）：统计执行时间
5. 缓存（Caching）：缓存方法结果
6. 异常处理（Exception Handling）：统一处理异常

没有AOP的问题：
```java
public class UserService {
    public void addUser(User user) {
        // 日志
        System.out.println("addUser called with: " + user);
        // 安全检查
        if (!hasPermission()) {
            throw new SecurityException();
        }
        // 事务开始
        beginTransaction();
        try {
            // 业务逻辑
            userDao.add(user);
            // 事务提交
            commitTransaction();
        } catch (Exception e) {
            // 事务回滚
            rollbackTransaction();
            throw e;
        }
        // 日志
        System.out.println("addUser completed");
    }
}
```
问题：
- 代码混乱：业务逻辑和横切关注点混在一起
- 代码重复：每个方法都要写相同的代码
- 难以维护：修改横切关注点需要修改所有方法

使用AOP的解决：
```java
public class UserService {
    public void addUser(User user) {
        // 只有业务逻辑
        userDao.add(user);
    }
}

// 切面
@Aspect
public class LoggingAspect {
    @Before("execution(* com.example.service.*.*(..))")
    public void logBefore(JoinPoint joinPoint) {
        System.out.println("Before: " + joinPoint.getSignature());
    }
}
```
优点：
- 业务逻辑清晰：只有业务逻辑
- 代码不重复：横切关注点集中在一个地方
- 易于维护：修改横切关注点只需要修改一个地方

1.2 AOP的历史

AOP的起源：
- 1990年代，施乐帕洛阿尔托研究中心（Xerox PARC）
- Gregor Kiczales等人提出AOP
- 1997年，AspectJ（AOP的Java实现）发布

Spring AOP：
- Spring框架集成了AOP
- 2004年，Spring 1.0发布，包含AOP支持
- Spring AOP比AspectJ简单，但功能也少一些
- Spring可以集成AspectJ

1.3 AOP的术语

AOP的核心术语：
1. 切面（Aspect）：横切关注点的模块化
2. 连接点（Join Point）：程序执行过程中的点
3. 通知（Advice）：在连接点执行的动作
4. 切入点（Pointcut）：匹配连接点的表达式
5. 织入（Weaving）：将切面应用到目标对象的过程
6. 目标对象（Target Object）：被通知的对象
7. AOP代理（AOP Proxy）：Spring AOP创建的代理对象
8. 引入（Introduction）：为类添加新方法和字段

1. 切面（Aspect）
- 切面是横切关注点的模块化
- 切面包含通知和切入点
- 例子：
  ```java
  @Aspect
  public class LoggingAspect {
      // 切入点和通知
  }
  ```

2. 连接点（Join Point）
- 连接点是程序执行过程中的点
- 例子：
  - 方法调用
  - 方法执行
  - 异常抛出
  - 字段访问
- Spring AOP只支持方法执行连接点

3. 通知（Advice）
- 通知是在连接点执行的动作
- 通知类型：
  - 前置通知（Before）：在方法执行前
  - 后置通知（After）：在方法执行后（无论是否异常）
  - 返回通知（After Returning）：在方法成功返回后
  - 异常通知（After Throwing）：在方法抛出异常后
  - 环绕通知（Around）：包围方法执行

4. 切入点（Pointcut）
- 切入点是匹配连接点的表达式
- 切入点决定通知在哪些连接点执行
- 例子：
  ```java
  @Pointcut("execution(* com.example.service.*.*(..))")
  public void serviceLayer() {}
  ```

5. 织入（Weaving）
- 织入是将切面应用到目标对象的过程
- 织入时机：
  - 编译时（Compile Time）：AspectJ编译器
  - 类加载时（Load Time）：使用特殊的类加载器
  - 运行时（Runtime）：Spring AOP使用动态代理

6. 目标对象（Target Object）
- 目标对象是被通知的对象
- 也叫被代理对象（Advised Object）
- 例子：
  ```java
  @Service
  public class UserServiceImpl implements UserService {
      // 目标对象
  }
  ```

7. AOP代理（AOP Proxy）
- AOP代理是Spring AOP创建的对象
- 代理对象包装目标对象
- 代理对象执行通知
- Spring AOP使用两种代理：
  - JDK动态代理：接口代理
  - CGLIB代理：类代理

8. 引入（Introduction）
- 引入是为类添加新方法和字段
- 也叫类型间声明（Inter-type Declaration）
- 例子：
  ```java
  @DeclareParents(value = "com.example.service.*+",
                  defaultImpl = AuditableImpl.class)
  public static Auditable mixin;
  ```

二、Spring AOP的实现

2.1 Spring AOP的代理机制

Spring AOP的代理：
- Spring AOP使用动态代理
- 两种代理方式：
  1. JDK动态代理：基于接口
  2. CGLIB代理：基于类

JDK动态代理：
- 要求目标对象实现接口
- 使用java.lang.reflect.Proxy
- 创建接口的代理实现
- 例子：
  ```java
  public interface UserService {
      void addUser(User user);
  }
  
  public class UserServiceImpl implements UserService {
      public void addUser(User user) {
          // ...
      }
  }
  
  // 使用JDK动态代理
  UserService target = new UserServiceImpl();
  UserService proxy = (UserService) Proxy.newProxyInstance(
      target.getClass().getClassLoader(),
      target.getClass().getInterfaces(),
      new InvocationHandler() {
          public Object invoke(Object proxy, Method method, Object[] args) 
              throws Throwable {
              // 前置通知
              Object result = method.invoke(target, args);
              // 后置通知
              return result;
          }
      }
  );
  ```

CGLIB代理：
- 不要求目标对象实现接口
- 使用CGLIB库
- 创建目标类的子类
- 例子：
  ```java
  public class UserService {
      public void addUser(User user) {
          // ...
      }
  }
  
  // 使用CGLIB代理
  Enhancer enhancer = new Enhancer();
  enhancer.setSuperclass(UserService.class);
  enhancer.setCallback(new MethodInterceptor() {
      public Object intercept(Object obj, Method method, Object[] args, 
                              MethodProxy proxy) throws Throwable {
          // 前置通知
          Object result = proxy.invokeSuper(obj, args);
          // 后置通知
          return result;
      }
  });
  UserService proxy = (UserService) enhancer.create();
  ```

Spring AOP的选择：
- 如果目标对象实现了接口，使用JDK动态代理
- 如果目标对象没有实现接口，使用CGLIB代理
- 可以强制使用CGLIB代理：
  ```xml
  <aop:config proxy-target-class="true"/>
  ```
  或者：
  ```java
  @EnableAspectJAutoProxy(proxyTargetClass = true)
  ```

2.2 通知类型详解

通知类型：
1. 前置通知（@Before）
2. 后置通知（@After）
3. 返回通知（@AfterReturning）
4. 异常通知（@AfterThrowing）
5. 环绕通知（@Around）

1. 前置通知（@Before）
- 在方法执行前执行
- 不能阻止方法执行（除非抛出异常）
- 例子：
  ```java
  @Aspect
  @Component
  public class LoggingAspect {
      
      @Before("execution(* com.example.service.*.*(..))")
      public void logBefore(JoinPoint joinPoint) {
          System.out.println("Before method: " + joinPoint.getSignature());
          Object[] args = joinPoint.getArgs();
          System.out.println("Arguments: " + Arrays.toString(args));
      }
  }
  ```

2. 后置通知（@After）
- 在方法执行后执行
- 无论方法是否正常返回或抛出异常都会执行
- 例子：
  ```java
  @After("execution(* com.example.service.*.*(..))")
  public void logAfter(JoinPoint joinPoint) {
      System.out.println("After method: " + joinPoint.getSignature());
  }
  ```

3. 返回通知（@AfterReturning）
- 在方法成功返回后执行
- 可以访问返回值
- 如果方法抛出异常，不会执行
- 例子：
  ```java
  @AfterReturning(pointcut = "execution(* com.example.service.*.*(..))",
                  returning = "result")
  public void logAfterReturning(JoinPoint joinPoint, Object result) {
      System.out.println("Method returned: " + joinPoint.getSignature());
      System.out.println("Return value: " + result);
  }
  ```

4. 异常通知（@AfterThrowing）
- 在方法抛出异常后执行
- 可以访问抛出的异常
- 如果方法正常返回，不会执行
- 例子：
  ```java
  @AfterThrowing(pointcut = "execution(* com.example.service.*.*(..))",
                 throwing = "ex")
  public void logAfterThrowing(JoinPoint joinPoint, Exception ex) {
      System.out.println("Method threw exception: " + joinPoint.getSignature());
      System.out.println("Exception: " + ex);
  }
  ```

5. 环绕通知（@Around）
- 包围方法执行
- 可以在方法前后执行
- 可以控制方法是否执行
- 可以修改方法的参数和返回值
- 必须调用proceed()来执行目标方法
- 例子：
  ```java
  @Around("execution(* com.example.service.*.*(..))")
  public Object logAround(ProceedingJoinPoint joinPoint) throws Throwable {
      System.out.println("Around before: " + joinPoint.getSignature());
      
      long start = System.currentTimeMillis();
      Object result = joinPoint.proceed(); // 执行目标方法
      long end = System.currentTimeMillis();
      
      System.out.println("Around after: " + joinPoint.getSignature());
      System.out.println("Time taken: " + (end - start) + "ms");
      
      return result;
  }
  ```

2.3 切入点表达式

切入点表达式（Pointcut Expression）：
- Spring AOP使用AspectJ的切入点表达式
- 用于匹配连接点
- Spring AOP支持的切入点指示器：
  - execution：匹配方法执行
  - within：匹配类型
  - this：匹配Bean实例（代理对象）
  - target：匹配目标对象
  - args：匹配参数
  - @target：匹配注解（目标对象）
  - @args：匹配注解（参数）
  - @within：匹配注解（类型）
  - @annotation：匹配注解（方法）

execution表达式的语法：
```
execution(modifiers-pattern? ret-type-pattern declaring-type-pattern? 
          name-pattern(param-pattern) throws-pattern?)
```
- modifiers-pattern：修饰符（可选）
- ret-type-pattern：返回类型（必需）
- declaring-type-pattern：声明类型（可选）
- name-pattern：方法名（必需）
- param-pattern：参数（必需）
- throws-pattern：异常（可选）

通配符：
- *：匹配任意字符
- ..：匹配任意多个参数，或任意多个子包
- +：匹配子类

例子1：匹配所有public方法
```java
execution(public * *(..))
```

例子2：匹配所有以get开头的方法
```java
execution(* get*(..))
```

例子3：匹配com.example.service包下所有类的所有方法
```java
execution(* com.example.service.*.*(..))
```

例子4：匹配com.example.service包及其子包下所有类的所有方法
```java
execution(* com.example.service..*.*(..))
```

例子5：匹配所有返回String的方法
```java
execution(String *(..))
```

例子6：匹配所有只有一个参数且是String的方法
```java
execution(* *(String))
```

例子7：匹配所有带@Log注解的方法
```java
@annotation(com.example.annotation.Log)
```

例子8：匹配所有带@Service注解的类的所有方法
```java
@within(org.springframework.stereotype.Service)
```

切入点的组合：
- &&：与
- ||：或
- !：非

例子：
```java
execution(* com.example.service.*.*(..)) && !execution(* get*(..))
```
匹配service包下所有非get开头的方法

命名切入点：
- 可以给切入点起名字
- 方便重用
- 例子：
  ```java
  @Aspect
  @Component
  public class LoggingAspect {
      
      @Pointcut("execution(* com.example.service.*.*(..))")
      public void serviceLayer() {}
      
      @Before("serviceLayer()")
      public void logBefore(JoinPoint joinPoint) {
          // ...
      }
      
      @After("serviceLayer()")
      public void logAfter(JoinPoint joinPoint) {
          // ...
      }
  }
  ```

三、Spring AOP的使用

3.1 配置Spring AOP

配置方式：
1. XML配置
2. 注解配置

方式1：XML配置
```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:aop="http://www.springframework.org/schema/aop"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
           http://www.springframework.org/schema/beans/spring-beans.xsd
           http://www.springframework.org/schema/aop
           http://www.springframework.org/schema/aop/spring-aop.xsd">

    <!-- 启用AspectJ自动代理 -->
    <aop:aspectj-autoproxy/>

    <!-- 目标对象 -->
    <bean id="userService" class="com.example.service.UserServiceImpl"/>

    <!-- 切面 -->
    <bean id="loggingAspect" class="com.example.aspect.LoggingAspect"/>

    <!-- AOP配置 -->
    <aop:config>
        <aop:aspect ref="loggingAspect">
            <aop:pointcut id="servicePointcut"
                          expression="execution(* com.example.service.*.*(..))"/>
            <aop:before pointcut-ref="servicePointcut" method="logBefore"/>
            <aop:after pointcut-ref="servicePointcut" method="logAfter"/>
        </aop:aspect>
    </aop:config>

</beans>
```

方式2：注解配置
```java
@Configuration
@ComponentScan("com.example")
@EnableAspectJAutoProxy  // 启用AspectJ自动代理
public class AppConfig {
}

@Aspect
@Component
public class LoggingAspect {
    
    @Before("execution(* com.example.service.*.*(..))")
    public void logBefore(JoinPoint joinPoint) {
        System.out.println("Before: " + joinPoint.getSignature());
    }
    
    @After("execution(* com.example.service.*.*(..))")
    public void logAfter(JoinPoint joinPoint) {
        System.out.println("After: " + joinPoint.getSignature());
    }
}
```

3.2 AOP实例

实例1：性能监控
```java
@Aspect
@Component
public class PerformanceAspect {
    
    @Around("execution(* com.example.service.*.*(..))")
    public Object monitorPerformance(ProceedingJoinPoint joinPoint) 
        throws Throwable {
        long start = System.currentTimeMillis();
        Object result = joinPoint.proceed();
        long end = System.currentTimeMillis();
        System.out.println(joinPoint.getSignature() + " took " + 
                          (end - start) + "ms");
        return result;
    }
}
```

实例2：事务管理
```java
@Aspect
@Component
public class TransactionAspect {
    
    @Around("execution(* com.example.service.*.*(..))")
    public Object manageTransaction(ProceedingJoinPoint joinPoint) 
        throws Throwable {
        System.out.println("Begin transaction");
        try {
            Object result = joinPoint.proceed();
            System.out.println("Commit transaction");
            return result;
        } catch (Exception e) {
            System.out.println("Rollback transaction");
            throw e;
        }
    }
}
```

实例3：安全检查
```java
@Aspect
@Component
public class SecurityAspect {
    
    @Before("execution(* com.example.service.*.*(..))")
    public void checkSecurity(JoinPoint joinPoint) {
        if (!hasPermission()) {
            throw new SecurityException("Access denied");
        }
    }
    
    private boolean hasPermission() {
        // 检查权限
        return true;
    }
}
```

四、总结

4.1 AOP要点
- AOP将横切关注点与业务逻辑分离
- 横切关注点：日志、事务、安全、性能等
- 解决了OOP的局限性

4.2 AOP术语要点
- 切面（Aspect）：横切关注点的模块化
- 连接点（Join Point）：程序执行的点
- 通知（Advice）：在连接点执行的动作
- 切入点（Pointcut）：匹配连接点的表达式
- 织入（Weaving）：将切面应用到目标对象

4.3 Spring AOP实现要点
- 使用JDK动态代理或CGLIB代理
- JDK动态代理：基于接口
- CGLIB代理：基于类
- 通知类型：@Before、@After、@AfterReturning、@AfterThrowing、@Around

4.4 切入点表达式要点
- execution：匹配方法执行
- 支持通配符：*、..、+
- 可以组合：&&、||、!
- 可以命名切入点

4.5 学习的意义
- 理解AOP的思想
- 掌握Spring AOP的使用
- 能够应用AOP解决实际问题

---

## 章节：CH04 Spring MVC笔记

# CH04 Spring MVC笔记

## 一、Spring MVC概述
### 1.1 MVC设计模式
MVC是Model-View-Controller的缩写，是一种软件设计模式，将应用程序分为三个核心部分：

1. **Model（模型）**：
   - 表示应用程序的数据和业务逻辑
   - 负责数据的存储和检索
   - 不依赖于View和Controller

2. **View（视图）**：
   - 负责数据的展示
   - 从Model获取数据
   - 不包含业务逻辑

3. **Controller（控制器）**：
   - 处理用户请求
   - 调用Model处理业务逻辑
   - 选择View进行响应

### 1.2 Spring MVC的特点
1. **与Spring框架无缝集成**
2. **灵活的配置**
3. **强大的数据绑定和类型转换**
4. **支持多种视图技术**（JSP、Thymeleaf、FreeMarker等）
5. **RESTful风格支持**
6. **良好的测试支持**
7. **丰富的标签库**

### 1.3 Spring MVC的核心组件
1. **DispatcherServlet**：前端控制器
2. **HandlerMapping**：处理器映射器
3. **HandlerAdapter**：处理器适配器
4. **Handler（Controller）**：处理器/控制器
5. **ViewResolver**：视图解析器
6. **View**：视图
7. **ModelAndView**：模型和视图

## 二、Spring MVC的工作流程
### 2.1 请求处理流程
```
用户请求
    ↓
DispatcherServlet（前端控制器）
    ↓
HandlerMapping（查找Handler）
    ↓
HandlerAdapter（执行Handler）
    ↓
Handler（Controller，业务处理）
    ↓
ModelAndView（返回模型和视图）
    ↓
ViewResolver（解析视图）
    ↓
View（渲染视图）
    ↓
响应给用户
```

### 2.2 详细步骤
1. **用户发送请求**到DispatcherServlet
2. **DispatcherServlet接收请求**，调用HandlerMapping
3. **HandlerMapping**根据请求URL找到对应的Handler（Controller）
4. **HandlerAdapter**调用Handler执行
5. **Handler执行**，返回ModelAndView
6. **DispatcherServlet**将ModelAndView传给ViewResolver
7. **ViewResolver**解析视图，返回View对象
8. **View渲染**，将模型数据填充到视图
9. **DispatcherServlet**响应给用户

## 三、Spring MVC的配置
### 3.1 基于XML的配置
**web.xml配置**：
```xml
<web-app>
    <servlet>
        <servlet-name>dispatcher</servlet-name>
        <servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
        <init-param>
            <param-name>contextConfigLocation</param-name>
            <param-value>/WEB-INF/spring-mvc.xml</param-value>
        </init-param>
        <load-on-startup>1</load-on-startup>
    </servlet>
    
    <servlet-mapping>
        <servlet-name>dispatcher</servlet-name>
        <url-pattern>/</url-pattern>
    </servlet-mapping>
</web-app>
```

**spring-mvc.xml配置**：
```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xmlns:mvc="http://www.springframework.org/schema/mvc"
       xsi:schemaLocation="
           http://www.springframework.org/schema/beans
           http://www.springframework.org/schema/beans/spring-beans.xsd
           http://www.springframework.org/schema/context
           http://www.springframework.org/schema/context/spring-context.xsd
           http://www.springframework.org/schema/mvc
           http://www.springframework.org/schema/mvc/spring-mvc.xsd">
    
    <!-- 扫描Controller -->
    <context:component-scan base-package="com.example.controller"/>
    
    <!-- 启用注解驱动 -->
    <mvc:annotation-driven/>
    
    <!-- 视图解析器 -->
    <bean class="org.springframework.web.servlet.view.InternalResourceViewResolver">
        <property name="prefix" value="/WEB-INF/views/"/>
        <property name="suffix" value=".jsp"/>
    </bean>
    
    <!-- 静态资源处理 -->
    <mvc:default-servlet-handler/>
    
</beans>
```

### 3.2 基于Java配置
```java
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.ViewResolver;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.view.InternalResourceViewResolver;

@Configuration
@EnableWebMvc
@ComponentScan(basePackages = "com.example.controller")
public class WebConfig implements WebMvcConfigurer {
    
    @Bean
    public ViewResolver viewResolver() {
        InternalResourceViewResolver resolver = new InternalResourceViewResolver();
        resolver.setPrefix("/WEB-INF/views/");
        resolver.setSuffix(".jsp");
        return resolver;
    }
    
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/static/**")
                .addResourceLocations("/static/");
    }
}
```

**WebApplicationInitializer配置**：
```java
import org.springframework.web.servlet.support.AbstractAnnotationConfigDispatcherServletInitializer;

public class WebAppInitializer extends AbstractAnnotationConfigDispatcherServletInitializer {
    
    @Override
    protected Class<?>[] getRootConfigClasses() {
        return null;
    }
    
    @Override
    protected Class<?>[] getServletConfigClasses() {
        return new Class<?>[]{WebConfig.class};
    }
    
    @Override
    protected String[] getServletMappings() {
        return new String[]{"/"};
    }
}
```

## 四、Controller的编写
### 4.1 基于注解的Controller
```java
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller
@RequestMapping("/hello")
public class HelloController {
    
    @GetMapping
    public ModelAndView hello() {
        ModelAndView mav = new ModelAndView();
        mav.addObject("message", "Hello Spring MVC!");
        mav.setViewName("hello");
        return mav;
    }
}
```

### 4.2 请求映射
```java
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/user")
public class UserController {
    
    @GetMapping("/list")
    public String list() {
        return "user/list";
    }
    
    @GetMapping("/{id}")
    public String detail(@PathVariable Long id, Model model) {
        model.addAttribute("userId", id);
        return "user/detail";
    }
    
    @GetMapping("/search")
    public String search(@RequestParam String keyword, Model model) {
        model.addAttribute("keyword", keyword);
        return "user/search";
    }
    
    @PostMapping("/add")
    public String add(@ModelAttribute User user) {
        // 保存用户
        return "redirect:/user/list";
    }
}
```

### 4.3 参数绑定
```java
@Controller
public class ParamController {
    
    // 基本类型参数
    @GetMapping("/param1")
    public String param1(@RequestParam int id, 
                         @RequestParam(required = false, defaultValue = "0") int page) {
        return "result";
    }
    
    // 路径变量
    @GetMapping("/user/{id}")
    public String pathVariable(@PathVariable Long id) {
        return "user/detail";
    }
    
    // 表单对象
    @PostMapping("/user/save")
    public String saveUser(@ModelAttribute User user) {
        return "redirect:/user/list";
    }
    
    // 请求体
    @PostMapping("/api/user")
    @ResponseBody
    public User createUser(@RequestBody User user) {
        return userService.save(user);
    }
    
    // Servlet API
    @GetMapping("/servlet")
    public String servletApi(HttpServletRequest request,
                             HttpServletResponse response,
                             HttpSession session) {
        return "result";
    }
}
```

## 五、数据绑定和类型转换
### 5.1 数据绑定
Spring MVC自动将请求参数绑定到方法参数：
- 基本类型：int, long, double, boolean等
- 包装类型：Integer, Long, Double, Boolean等
- String
- 日期：Date, LocalDate, LocalDateTime等
- 数组和集合
- 自定义对象

### 5.2 类型转换
```java
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@Component
public class StringToLocalDateConverter implements Converter<String, LocalDate> {
    
    @Override
    public LocalDate convert(String source) {
        return LocalDate.parse(source, DateTimeFormatter.ofPattern("yyyy-MM-dd"));
    }
}
```

## 六、视图解析
### 6.1 JSP视图
```jsp
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<html>
<head>
    <title>Hello</title>
</head>
<body>
    <h1>${message}</h1>
    
    <c:forEach items="${users}" var="user">
        <p>${user.name}</p>
    </c:forEach>
</body>
</html>
```

### 6.2 Thymeleaf视图
```html
<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">
<head>
    <title>Hello</title>
</head>
<body>
    <h1 th:text="${message}">Hello</h1>
    
    <div th:each="user : ${users}">
        <p th:text="${user.name}">Name</p>
    </div>
</body>
</html>
```

## 七、RESTful风格
### 7.1 RESTful API设计
```java
@RestController
@RequestMapping("/api/users")
public class UserRestController {
    
    @Autowired
    private UserService userService;
    
    @GetMapping
    public List<User> list() {
        return userService.findAll();
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<User> get(@PathVariable Long id) {
        User user = userService.findById(id);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(user);
    }
    
    @PostMapping
    public ResponseEntity<User> create(@RequestBody User user) {
        User savedUser = userService.save(user);
        URI location = URI.create("/api/users/" + savedUser.getId());
        return ResponseEntity.created(location).body(savedUser);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<User> update(@PathVariable Long id, @RequestBody User user) {
        User updatedUser = userService.update(id, user);
        return ResponseEntity.ok(updatedUser);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        userService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
```

### 7.2 HTTP状态码
- 200 OK：成功
- 201 Created：创建成功
- 204 No Content：无内容
- 400 Bad Request：请求错误
- 404 Not Found：未找到
- 500 Internal Server Error：服务器错误

## 八、文件上传
### 8.1 配置
```java
@Bean
public MultipartResolver multipartResolver() {
    CommonsMultipartResolver resolver = new CommonsMultipartResolver();
    resolver.setMaxUploadSize(10 * 1024 * 1024); // 10MB
    resolver.setDefaultEncoding("UTF-8");
    return resolver;
}
```

### 8.2 Controller
```java
@PostMapping("/upload")
public String upload(@RequestParam("file") MultipartFile file, Model model) {
    if (file.isEmpty()) {
        model.addAttribute("message", "请选择文件");
        return "upload";
    }
    
    try {
        byte[] bytes = file.getBytes();
        Path path = Paths.get("uploads/" + file.getOriginalFilename());
        Files.write(path, bytes);
        model.addAttribute("message", "上传成功");
    } catch (IOException e) {
        model.addAttribute("message", "上传失败: " + e.getMessage());
    }
    
    return "upload";
}
```

## 九、拦截器
### 9.1 自定义拦截器
```java
import org.springframework.web.servlet.HandlerInterceptor;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class LoginInterceptor implements HandlerInterceptor {
    
    @Override
    public boolean preHandle(HttpServletRequest request,
                            HttpServletResponse response,
                            Object handler) throws Exception {
        Object user = request.getSession().getAttribute("user");
        if (user == null) {
            response.sendRedirect("/login");
            return false;
        }
        return true;
    }
}
```

### 9.2 注册拦截器
```java
@Override
public void addInterceptors(InterceptorRegistry registry) {
    registry.addInterceptor(new LoginInterceptor())
            .addPathPatterns("/**")
            .excludePathPatterns("/login", "/static/**");
}
```

## 十、异常处理
### 10.1 全局异常处理
```java
@ControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(RuntimeException.class)
    public ModelAndView handleRuntimeException(RuntimeException e) {
        ModelAndView mav = new ModelAndView("error");
        mav.addObject("message", e.getMessage());
        return mav;
    }
    
    @ExceptionHandler(Exception.class)
    @ResponseBody
    public ResponseEntity<Map<String, Object>> handleException(Exception e) {
        Map<String, Object> result = new HashMap<>();
        result.put("success", false);
        result.put("message", e.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(result);
    }
}
```

---

## 章节：CH05 Spring Boot和ORM简介笔记

# CH05 Spring Boot和ORM简介笔记

## 一、Spring Boot概述
### 1.1 Spring Boot简介
Spring Boot是Spring框架的一个子项目，旨在简化Spring应用的初始搭建和开发过程。

**Spring Boot的特点**：
1. **快速开发**：快速创建独立的Spring应用
2. **自动配置**：自动配置Spring和第三方库
3. **内嵌服务器**：内嵌Tomcat、Jetty等Web服务器
4. **简化依赖**：提供starter依赖，简化Maven/Gradle配置
5. **生产就绪**：提供生产环境特性（指标、健康检查等）
6. **无代码生成**：无需XML配置

### 1.2 Spring Boot的优势
1. **简化配置**：自动配置，减少样板代码
2. **快速上手**：几分钟内创建可运行的应用
3. **约定优于配置**：提供合理的默认值
4. **生态丰富**：与Spring生态系统无缝集成
5. **社区活跃**：强大的社区支持

## 二、Spring Boot快速入门
### 2.1 创建Spring Boot项目
**使用Spring Initializr**：
1. 访问 https://start.spring.io
2. 选择项目元数据（Group、Artifact、Name等）
3. 选择依赖（Web、JPA、MySQL等）
4. 生成并下载项目
5. 解压并导入IDE

### 2.2 最简单的Spring Boot应用
```java
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class HelloApplication {
    
    public static void main(String[] args) {
        SpringApplication.run(HelloApplication.class, args);
    }
}
```

### 2.3 @SpringBootApplication注解
@SpringBootApplication是一个复合注解，包含：
1. **@Configuration**：配置类
2. **@EnableAutoConfiguration**：启用自动配置
3. **@ComponentScan**：组件扫描

### 2.4 编写Controller
```java
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloController {
    
    @GetMapping("/hello")
    public String hello() {
        return "Hello Spring Boot!";
    }
}
```

### 2.5 运行应用
```bash
mvn spring-boot:run
```
或直接运行main方法。

访问：http://localhost:8080/hello

## 三、Spring Boot核心特性
### 3.1 自动配置
Spring Boot的自动配置会根据类路径下的jar包自动配置Spring应用。

**自动配置原理**：
1. @EnableAutoConfiguration导入AutoConfigurationImportSelector
2. 从META-INF/spring.factories加载自动配置类
3. 根据条件（@Conditional）决定是否应用配置

**排除自动配置**：
```java
@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class})
public class App {
}
```

### 3.2 Starter依赖
Starter是一组方便的依赖描述符，可以简化Maven/Gradle配置。

**常用Starter**：
```xml
<!-- Web开发 -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>

<!-- JPA -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>

<!-- MySQL -->
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
</dependency>

<!-- Thymeleaf -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-thymeleaf</artifactId>
</dependency>

<!-- 测试 -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-test</artifactId>
    <scope>test</scope>
</dependency>
```

### 3.3 配置文件
Spring Boot支持多种配置文件格式：
- application.properties
- application.yml
- application.yaml

**application.properties示例**：
```properties
# 服务器配置
server.port=8080
server.servlet.context-path=/api

# 数据源配置
spring.datasource.url=jdbc:mysql://localhost:3306/test
spring.datasource.username=root
spring.datasource.password=123456
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA配置
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true

# 日志配置
logging.level.root=INFO
logging.level.com.example=DEBUG
```

**application.yml示例**：
```yaml
server:
  port: 8080
  servlet:
    context-path: /api

spring:
  datasource:
    url: jdbc:mysql://localhost:3306/test
    username: root
    password: 123456
    driver-class-name: com.mysql.cj.jdbc.Driver
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
    properties:
      hibernate:
        format_sql: true

logging:
  level:
    root: INFO
    com.example: DEBUG
```

### 3.4 多环境配置
**application-dev.properties**：
```properties
server.port=8081
spring.datasource.url=jdbc:mysql://localhost:3306/dev_db
```

**application-prod.properties**：
```properties
server.port=80
spring.datasource.url=jdbc:mysql://prod-host:3306/prod_db
```

**激活配置**：
```properties
# application.properties
spring.profiles.active=dev
```

## 四、ORM概述
### 4.1 ORM的概念
ORM（Object-Relational Mapping，对象关系映射）是一种将面向对象模型映射到关系数据库的技术。

**ORM的作用**：
1. 消除SQL代码
2. 自动实现对象到表的映射
3. 提供统一的数据访问API
4. 提高开发效率

### 4.2 常见的ORM框架
1. **Hibernate**：最流行的ORM框架
2. **MyBatis**：半自动化ORM框架
3. **Spring Data JPA**：Spring Data项目的子项目
4. **TopLink**：Oracle的ORM框架
5. **EclipseLink**：TopLink的开源版本

### 4.3 ORM的优缺点
**优点**：
1. 提高开发效率
2. 减少重复代码
3. 代码更易维护
4. 数据库移植性好
5. 面向对象编程

**缺点**：
1. 学习曲线陡峭
2. 性能可能不如手写SQL
3. 复杂查询可能困难
4. 过度封装可能导致性能问题

## 五、JPA简介
### 5.1 JPA的概念
JPA（Java Persistence API）是Java EE标准的持久化API，提供了对象关系映射的标准规范。

**JPA的特点**：
1. 标准规范，不依赖具体实现
2. 基于注解和XML配置
3. 提供统一的API
4. 支持多种ORM实现（Hibernate、EclipseLink等）

### 5.2 JPA核心概念
1. **实体（Entity）**：映射到数据库表的Java类
2. **实体管理器（EntityManager）**：执行CRUD操作
3. **实体管理器工厂（EntityManagerFactory）**：创建EntityManager
4. **持久化单元（Persistence Unit）**：配置信息

## 六、Spring Data JPA
### 6.1 Spring Data JPA简介
Spring Data JPA是Spring Data项目的一部分，简化了JPA的数据访问层开发。

**Spring Data JPA的特点**：
1. 无需编写DAO实现类
2. 提供通用的Repository接口
3. 支持方法名解析查询
4. 支持@Query注解自定义查询
5. 自动实现CRUD操作

### 6.2 快速开始
**1. 添加依赖**：
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
</dependency>
```

**2. 配置数据源**：
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/test
spring.datasource.username=root
spring.datasource.password=123456
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

**3. 定义实体类**：
```java
import javax.persistence.*;

@Entity
@Table(name = "user")
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "username", unique = true, nullable = false)
    private String username;
    
    @Column(name = "password")
    private String password;
    
    @Column(name = "email")
    private String email;
    
    @Column(name = "age")
    private Integer age;
    
    // getters and setters
}
```

**4. 定义Repository接口**：
```java
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    // 根据用户名查询
    User findByUsername(String username);
    
    // 根据邮箱查询
    List<User> findByEmail(String email);
    
    // 根据年龄大于等于查询
    List<User> findByAgeGreaterThanEqual(Integer age);
    
    // 根据用户名和邮箱查询
    User findByUsernameAndEmail(String username, String email);
}
```

**5. 使用Repository**：
```java
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    // 保存用户
    public User saveUser(User user) {
        return userRepository.save(user);
    }
    
    // 根据ID查询
    public User getUserById(Long id) {
        Optional<User> optional = userRepository.findById(id);
        return optional.orElse(null);
    }
    
    // 查询所有用户
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    
    // 根据用户名查询
    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }
    
    // 更新用户
    public User updateUser(User user) {
        return userRepository.save(user);
    }
    
    // 删除用户
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}
```

### 6.3 方法名查询
Spring Data JPA支持通过方法名自动生成查询：

| 关键字 | 示例 | 等价SQL |
|--------|------|---------|
| And | findByUsernameAndEmail | where username = ? and email = ? |
| Or | findByUsernameOrEmail | where username = ? or email = ? |
| Between | findByAgeBetween | where age between ? and ? |
| LessThan | findByAgeLessThan | where age < ? |
| GreaterThan | findByAgeGreaterThan | where age > ? |
| Like | findByUsernameLike | where username like ? |
| In | findByAgeIn | where age in (?) |
| OrderBy | findByAgeOrderByUsernameDesc | where age = ? order by username desc |

### 6.4 @Query注解
**自定义JPQL查询**：
```java
@Query("SELECT u FROM User u WHERE u.age > :minAge")
List<User> findUsersOlderThan(@Param("minAge") Integer minAge);
```

**原生SQL查询**：
```java
@Query(value = "SELECT * FROM user WHERE age > :minAge", nativeQuery = true)
List<User> findUsersOlderThanNative(@Param("minAge") Integer minAge);
```

**修改查询**：
```java
@Modifying
@Query("UPDATE User u SET u.email = :email WHERE u.id = :id")
int updateEmail(@Param("id") Long id, @Param("email") String email);
```

## 七、Spring Boot Actuator
### 7.1 Actuator简介
Spring Boot Actuator提供了生产级别的监控和管理功能。

**添加依赖**：
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

### 7.2 常用端点
```properties
# 暴露所有端点
management.endpoints.web.exposure.include=*

# 暴露特定端点
management.endpoints.web.exposure.include=health,info,metrics
```

**访问端点**：
- /actuator/health：健康检查
- /actuator/info：应用信息
- /actuator/metrics：指标
- /actuator/env：环境信息
- /actuator/loggers：日志配置

## 八、Spring Boot测试
### 8.1 测试支持
```java
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class UserServiceTest {
    
    @Autowired
    private UserService userService;
    
    @Test
    void testSaveUser() {
        User user = new User();
        user.setUsername("test");
        user.setPassword("123456");
        user.setEmail("test@example.com");
        
        User savedUser = userService.saveUser(user);
        
        assertNotNull(savedUser.getId());
        assertEquals("test", savedUser.getUsername());
    }
}
```

---

## 章节：CH06 ORM的实现方式和MyBatis笔记

# CH06 ORM的实现方式和MyBatis笔记

## 一、ORM实现方式概述
### 1.1 ORM的实现层次
ORM的实现可以分为不同的层次：

1. **纯SQL映射**
   - 开发者编写SQL
   - 框架负责对象映射
   - 代表：MyBatis

2. **半自动ORM**
   - 提供基本的CRUD操作
   - 复杂查询需要手写SQL
   - 代表：MyBatis、Hibernate（部分）

3. **全自动ORM**
   - 完全不需要手写SQL
   - 框架自动生成SQL
   - 代表：Hibernate、Spring Data JPA

### 1.2 常见ORM框架对比
| 特性 | MyBatis | Hibernate | Spring Data JPA |
|------|---------|-----------|-----------------|
| SQL控制 | 完全控制 | 自动生成 | 混合 |
| 学习曲线 | 较低 | 较高 | 中等 |
| 性能 | 较好 | 一般 | 中等 |
| 灵活性 | 高 | 低 | 中等 |
| 移植性 | 一般 | 好 | 好 |

## 二、MyBatis概述
### 2.1 MyBatis简介
MyBatis是一款优秀的持久层框架，支持定制化SQL、存储过程以及高级映射。

**MyBatis的特点**：
1. **SQL与代码分离**：SQL写在XML文件中
2. **灵活的SQL控制**：完全控制SQL
3. **简单易用**：学习曲线低
4. **优秀的映射**：强大的结果映射
5. **动态SQL**：支持动态SQL
6. **缓存机制**：一级缓存和二级缓存

### 2.2 MyBatis的历史
- **iBATIS**：最初由Clinton Begin开发
- **2010年**：迁移到Google Code，改名为MyBatis
- **2013年**：迁移到GitHub
- **现在**：Apache顶级项目

## 三、MyBatis快速入门
### 3.1 添加依赖
**Maven依赖**：
```xml
<dependency>
    <groupId>org.mybatis</groupId>
    <artifactId>mybatis</artifactId>
    <version>3.5.13</version>
</dependency>
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <version>8.0.33</version>
</dependency>
```

**Spring Boot整合MyBatis**：
```xml
<dependency>
    <groupId>org.mybatis.spring.boot</groupId>
    <artifactId>mybatis-spring-boot-starter</artifactId>
    <version>3.0.2</version>
</dependency>
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
</dependency>
```

### 3.2 核心配置文件
**mybatis-config.xml**：
```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE configuration
        PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
        "https://mybatis.org/dtd/mybatis-3-config.dtd">
<configuration>
    <!-- 环境配置 -->
    <environments default="development">
        <environment id="development">
            <transactionManager type="JDBC"/>
            <dataSource type="POOLED">
                <property name="driver" value="com.mysql.cj.jdbc.Driver"/>
                <property name="url" value="jdbc:mysql://localhost:3306/mybatis"/>
                <property name="username" value="root"/>
                <property name="password" value="123456"/>
            </dataSource>
        </environment>
    </environments>
    
    <!-- 映射器 -->
    <mappers>
        <mapper resource="com/example/mapper/UserMapper.xml"/>
    </mappers>
</configuration>
```

**application.yml（Spring Boot）**：
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/mybatis
    username: root
    password: 123456
    driver-class-name: com.mysql.cj.jdbc.Driver

mybatis:
  mapper-locations: classpath:mapper/*.xml
  type-aliases-package: com.example.entity
  configuration:
    map-underscore-to-camel-case: true
    log-impl: org.apache.ibatis.logging.stdout.StdOutImpl
```

### 3.3 实体类
```java
public class User {
    private Long id;
    private String username;
    private String password;
    private String email;
    private Integer age;
    
    // getters and setters
}
```

### 3.4 Mapper接口
```java
public interface UserMapper {
    
    User findById(Long id);
    
    List<User> findAll();
    
    void insert(User user);
    
    void update(User user);
    
    void deleteById(Long id);
}
```

### 3.5 Mapper XML文件
```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "https://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.example.mapper.UserMapper">
    
    <select id="findById" resultType="com.example.entity.User">
        SELECT * FROM user WHERE id = #{id}
    </select>
    
    <select id="findAll" resultType="com.example.entity.User">
        SELECT * FROM user
    </select>
    
    <insert id="insert" parameterType="com.example.entity.User" useGeneratedKeys="true" keyProperty="id">
        INSERT INTO user (username, password, email, age)
        VALUES (#{username}, #{password}, #{email}, #{age})
    </insert>
    
    <update id="update" parameterType="com.example.entity.User">
        UPDATE user
        SET username = #{username},
            password = #{password},
            email = #{email},
            age = #{age}
        WHERE id = #{id}
    </update>
    
    <delete id="deleteById">
        DELETE FROM user WHERE id = #{id}
    </delete>
    
</mapper>
```

### 3.6 使用MyBatis
**纯MyBatis**：
```java
String resource = "mybatis-config.xml";
InputStream inputStream = Resources.getResourceAsStream(resource);
SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);

try (SqlSession session = sqlSessionFactory.openSession()) {
    UserMapper mapper = session.getMapper(UserMapper.class);
    
    // 查询
    User user = mapper.findById(1L);
    System.out.println(user);
    
    // 插入
    User newUser = new User();
    newUser.setUsername("test");
    newUser.setPassword("123456");
    mapper.insert(newUser);
    session.commit();
}
```

**Spring Boot中使用**：
```java
@Service
public class UserService {
    
    @Autowired
    private UserMapper userMapper;
    
    public User findById(Long id) {
        return userMapper.findById(id);
    }
    
    public List<User> findAll() {
        return userMapper.findAll();
    }
    
    @Transactional
    public void save(User user) {
        if (user.getId() == null) {
            userMapper.insert(user);
        } else {
            userMapper.update(user);
        }
    }
    
    @Transactional
    public void deleteById(Long id) {
        userMapper.deleteById(id);
    }
}
```

## 四、MyBatis核心概念
### 4.1 SqlSessionFactory
SqlSessionFactory是MyBatis的核心，用于创建SqlSession。

**创建方式**：
```java
String resource = "mybatis-config.xml";
InputStream inputStream = Resources.getResourceAsStream(resource);
SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);
```

### 4.2 SqlSession
SqlSession是MyBatis的主要接口，用于执行SQL、获取Mapper、管理事务。

**常用方法**：
```java
try (SqlSession session = sqlSessionFactory.openSession()) {
    // 获取Mapper
    UserMapper mapper = session.getMapper(UserMapper.class);
    
    // 直接执行SQL
    User user = session.selectOne("com.example.mapper.UserMapper.findById", 1L);
    
    // 事务
    session.commit();
    session.rollback();
}
```

### 4.3 Mapper
Mapper是MyBatis的核心概念，由接口和XML文件组成。

**Mapper的两种方式**：
1. **XML映射文件**：SQL写在XML中
2. **注解**：SQL写在注解中

### 4.4 注解方式
```java
public interface UserMapper {
    
    @Select("SELECT * FROM user WHERE id = #{id}")
    User findById(Long id);
    
    @Select("SELECT * FROM user")
    List<User> findAll();
    
    @Insert("INSERT INTO user (username, password) VALUES (#{username}, #{password})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    void insert(User user);
    
    @Update("UPDATE user SET username = #{username} WHERE id = #{id}")
    void update(User user);
    
    @Delete("DELETE FROM user WHERE id = #{id}")
    void deleteById(Long id);
}
```

## 五、MyBatis高级特性
### 5.1 结果映射
**简单结果映射**：
```xml
<resultMap id="UserResultMap" type="com.example.entity.User">
    <id property="id" column="id"/>
    <result property="username" column="username"/>
    <result property="password" column="password"/>
    <result property="email" column="email"/>
    <result property="age" column="age"/>
</resultMap>

<select id="findById" resultMap="UserResultMap">
    SELECT * FROM user WHERE id = #{id}
</select>
```

**一对一关联**：
```xml
<resultMap id="UserResultMap" type="com.example.entity.User">
    <id property="id" column="id"/>
    <result property="username" column="username"/>
    <association property="profile" javaType="com.example.entity.Profile">
        <id property="id" column="profile_id"/>
        <result property="nickname" column="nickname"/>
    </association>
</resultMap>
```

**一对多关联**：
```xml
<resultMap id="UserResultMap" type="com.example.entity.User">
    <id property="id" column="id"/>
    <result property="username" column="username"/>
    <collection property="orders" ofType="com.example.entity.Order">
        <id property="id" column="order_id"/>
        <result property="amount" column="amount"/>
    </collection>
</resultMap>
```

### 5.2 动态SQL
**if标签**：
```xml
<select id="findByCondition" resultType="User">
    SELECT * FROM user
    WHERE 1=1
    <if test="username != null">
        AND username = #{username}
    </if>
    <if test="email != null">
        AND email = #{email}
    </if>
</select>
```

**choose标签**：
```xml
<select id="findByCondition" resultType="User">
    SELECT * FROM user
    WHERE 1=1
    <choose>
        <when test="username != null">
            AND username = #{username}
        </when>
        <when test="email != null">
            AND email = #{email}
        </when>
        <otherwise>
            AND status = 1
        </otherwise>
    </choose>
</select>
```

**where标签**：
```xml
<select id="findByCondition" resultType="User">
    SELECT * FROM user
    <where>
        <if test="username != null">
            username = #{username}
        </if>
        <if test="email != null">
            AND email = #{email}
        </if>
    </where>
</select>
```

**trim标签**：
```xml
<update id="updateUser">
    UPDATE user
    <set>
        <if test="username != null">username = #{username},</if>
        <if test="email != null">email = #{email},</if>
    </set>
    WHERE id = #{id}
</update>
```

**foreach标签**：
```xml
<select id="findByIds" resultType="User">
    SELECT * FROM user
    WHERE id IN
    <foreach collection="ids" item="id" open="(" separator="," close=")">
        #{id}
    </foreach>
</select>
```

### 5.3 缓存
**一级缓存**：
```java
try (SqlSession session = sqlSessionFactory.openSession()) {
    UserMapper mapper = session.getMapper(UserMapper.class);
    
    // 第一次查询，从数据库查询
    User user1 = mapper.findById(1L);
    
    // 第二次查询，从一级缓存查询
    User user2 = mapper.findById(1L);
    
    // user1 == user2
}
```

**二级缓存**：
```xml
<!-- mapper.xml中启用二级缓存 -->
<cache/>

<!-- 或者配置缓存 -->
<cache
    eviction="LRU"
    flushInterval="60000"
    size="512"
    readOnly="true"/>
```

## 六、MyBatis与Spring Boot整合
### 6.1 启动类
```java
@SpringBootApplication
@MapperScan("com.example.mapper")
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
```

### 6.2 分页插件
**添加依赖**：
```xml
<dependency>
    <groupId>com.github.pagehelper</groupId>
    <artifactId>pagehelper-spring-boot-starter</artifactId>
    <version>1.4.6</version>
</dependency>
```

**使用分页**：
```java
PageHelper.startPage(1, 10);
List<User> users = userMapper.findAll();
PageInfo<User> pageInfo = new PageInfo<>(users);
```

## 七、MyBatis最佳实践
1. **使用parameterType和resultType**
2. **合理使用缓存**
3. **SQL优化**
4. **使用类型别名**
5. **日志配置**
6. **事务管理**

---

## 章节：CH07 前后端分离和RESTful API简介笔记

# CH07 前后端分离和RESTful API简介笔记

## 一、前后端分离概述
### 1.1 传统开发模式 vs 前后端分离
#### 传统开发模式（MVC）
```
前端（JSP/Thymeleaf） ←→ 后端（Controller） ←→ 数据库
     ↓                    ↓
   渲染页面            业务逻辑
```
特点：
- 前后端耦合度高
- 前端依赖后端环境
- 难以并行开发
- 部署复杂

#### 前后端分离模式
```
前端（Vue/React） ←→ RESTful API ←→ 后端（Spring Boot） ←→ 数据库
     ↓                          ↓
   独立部署                   独立部署
```
特点：
- 前后端解耦
- 独立开发和部署
- 并行开发效率高
- 职责清晰

### 1.2 前后端分离的优势
1. **职责分离**
   - 前端：用户交互、页面渲染
   - 后端：业务逻辑、数据处理

2. **技术栈灵活**
   - 前端可以使用Vue、React、Angular等
   - 后端可以使用Spring Boot、Node.js、Python等

3. **开发效率高**
   - 前后端可以并行开发
   - 通过API文档协作
   - Mock数据支持前端独立开发

4. **部署灵活**
   - 前后端独立部署
   - 可以独立扩展
   - CDN加速前端

5. **用户体验好**
   - 单页应用（SPA）
   - 无刷新交互
   - 响应式设计

## 二、RESTful API概述
### 2.1 REST的概念
REST（Representational State Transfer，表述性状态转移）是一种软件架构风格。

### 2.2 REST的六个约束
1. **客户端-服务器（Client-Server）**
   - 关注点分离
   - 客户端和服务器独立演化

2. **无状态（Stateless）**
   - 每个请求包含所有必要信息
   - 服务器不保存客户端状态
   - 可扩展性好

3. **缓存（Cache）**
   - 响应可以被缓存
   - 提高性能
   - 减少服务器负载

4. **统一接口（Uniform Interface）**
   - 资源标识
   - 通过表述操作资源
   - 自描述消息
   - 超媒体作为应用状态引擎

5. **分层系统（Layered System）**
   - 多层架构
   - 每一层只知道相邻层
   - 提高扩展性

6. **按需代码（Code on Demand，可选）**
   - 服务器可以传输代码给客户端执行
   - 扩展客户端功能

### 2.3 RESTful API的设计原则
1. **资源导向**
   - 使用名词表示资源
   - 复数形式
   - 例如：/users, /orders, /products

2. **使用HTTP方法**
   - GET：查询
   - POST：创建
   - PUT：更新（完整更新）
   - PATCH：更新（部分更新）
   - DELETE：删除

3. **使用HTTP状态码**
   - 200 OK：成功
   - 201 Created：创建成功
   - 204 No Content：无内容
   - 400 Bad Request：请求错误
   - 401 Unauthorized：未授权
   - 403 Forbidden：禁止访问
   - 404 Not Found：未找到
   - 500 Internal Server Error：服务器错误

4. **使用JSON**
   - 请求和响应使用JSON格式
   - 简洁、易读、跨语言

## 三、RESTful API设计示例
### 3.1 用户管理API
| 方法 | 路径 | 描述 |
|------|------|------|
| GET | /api/users | 获取用户列表 |
| GET | /api/users/{id} | 获取单个用户 |
| POST | /api/users | 创建用户 |
| PUT | /api/users/{id} | 更新用户（完整） |
| PATCH | /api/users/{id} | 更新用户（部分） |
| DELETE | /api/users/{id} | 删除用户 |

### 3.2 请求和响应示例
**获取用户列表**：
```http
GET /api/users?page=1&size=10 HTTP/1.1
Host: example.com
Accept: application/json
```

响应：
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "code": 200,
  "message": "success",
  "data": {
    "items": [
      {
        "id": 1,
        "username": "zhangsan",
        "email": "zhangsan@example.com",
        "age": 20
      },
      {
        "id": 2,
        "username": "lisi",
        "email": "lisi@example.com",
        "age": 25
      }
    ],
    "total": 100,
    "page": 1,
    "size": 10
  }
}
```

**创建用户**：
```http
POST /api/users HTTP/1.1
Host: example.com
Content-Type: application/json

{
  "username": "wangwu",
  "password": "123456",
  "email": "wangwu@example.com",
  "age": 30
}
```

响应：
```http
HTTP/1.1 201 Created
Content-Type: application/json
Location: /api/users/3

{
  "code": 201,
  "message": "创建成功",
  "data": {
    "id": 3,
    "username": "wangwu",
    "email": "wangwu@example.com",
    "age": 30
  }
}
```

**更新用户**：
```http
PUT /api/users/1 HTTP/1.1
Host: example.com
Content-Type: application/json

{
  "username": "zhangsan123",
  "email": "zhangsan123@example.com",
  "age": 21
}
```

响应：
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "code": 200,
  "message": "更新成功",
  "data": {
    "id": 1,
    "username": "zhangsan123",
    "email": "zhangsan123@example.com",
    "age": 21
  }
}
```

**删除用户**：
```http
DELETE /api/users/1 HTTP/1.1
Host: example.com
```

响应：
```http
HTTP/1.1 204 No Content
```

## 四、Spring Boot实现RESTful API
### 4.1 实体类
```java
@Entity
@Table(name = "user")
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String username;
    private String password;
    private String email;
    private Integer age;
    
    // getters and setters
}
```

### 4.2 Repository
```java
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    List<User> findByAgeGreaterThan(Integer age);
}
```

### 4.3 Service
```java
@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    public List<User> findAll() {
        return userRepository.findAll();
    }
    
    public User findById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
    
    public User create(User user) {
        return userRepository.save(user);
    }
    
    public User update(Long id, User user) {
        User existingUser = findById(id);
        existingUser.setUsername(user.getUsername());
        existingUser.setEmail(user.getEmail());
        existingUser.setAge(user.getAge());
        return userRepository.save(existingUser);
    }
    
    public void delete(Long id) {
        userRepository.deleteById(id);
    }
}
```

### 4.4 Controller
```java
@RestController
@RequestMapping("/api/users")
public class UserController {
    
    @Autowired
    private UserService userService;
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<User>>> list() {
        List<User> users = userService.findAll();
        return ResponseEntity.ok(ApiResponse.success(users));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<User>> getById(@PathVariable Long id) {
        User user = userService.findById(id);
        return ResponseEntity.ok(ApiResponse.success(user));
    }
    
    @PostMapping
    public ResponseEntity<ApiResponse<User>> create(@Valid @RequestBody User user) {
        User createdUser = userService.create(user);
        URI location = URI.create("/api/users/" + createdUser.getId());
        return ResponseEntity.created(location)
                .body(ApiResponse.success("创建成功", createdUser));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<User>> update(@PathVariable Long id,
                                                     @Valid @RequestBody User user) {
        User updatedUser = userService.update(id, user);
        return ResponseEntity.ok(ApiResponse.success("更新成功", updatedUser));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        userService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
```

### 4.5 统一响应格式
```java
public class ApiResponse<T> {
    
    private int code;
    private String message;
    private T data;
    
    public static <T> ApiResponse<T> success(T data) {
        ApiResponse<T> response = new ApiResponse<>();
        response.setCode(200);
        response.setMessage("success");
        response.setData(data);
        return response;
    }
    
    public static <T> ApiResponse<T> success(String message, T data) {
        ApiResponse<T> response = new ApiResponse<>();
        response.setCode(200);
        response.setMessage(message);
        response.setData(data);
        return response;
    }
    
    public static <T> ApiResponse<T> error(int code, String message) {
        ApiResponse<T> response = new ApiResponse<>();
        response.setCode(code);
        response.setMessage(message);
        return response;
    }
    
    // getters and setters
}
```

### 4.6 异常处理
```java
@RestControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleResourceNotFound(ResourceNotFoundException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error(404, e.getMessage()));
    }
    
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Void>> handleValidationException(MethodArgumentNotValidException e) {
        String message = e.getBindingResult().getFieldError().getDefaultMessage();
        return ResponseEntity.badRequest()
                .body(ApiResponse.error(400, message));
    }
    
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleException(Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "服务器内部错误"));
    }
}
```

## 五、前后端分离的开发流程
### 5.1 API设计
1. **需求分析**
2. **API设计**
3. **API文档编写**
4. **API评审**

### 5.2 并行开发
1. **前端开发**
   - 使用Mock数据
   - 调用Mock API
   - 页面开发
   - 交互开发

2. **后端开发**
   - 数据库设计
   - 业务逻辑开发
   - API实现
   - API测试

### 5.3 联调测试
1. **前后端联调**
2. **集成测试**
3. **Bug修复**

### 5.4 部署上线
1. **前端部署**
2. **后端部署**
3. **线上测试**

## 六、API文档工具
### 6.1 Swagger/OpenAPI
**添加依赖**：
```xml
<dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
    <version>2.2.0</version>
</dependency>
```

**使用注解**：
```java
@Tag(name = "用户管理", description = "用户CRUD操作")
@RestController
@RequestMapping("/api/users")
public class UserController {
    
    @Operation(summary = "获取用户列表")
    @GetMapping
    public ResponseEntity<ApiResponse<List<User>>> list() {
        // ...
    }
    
    @Operation(summary = "获取单个用户")
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<User>> getById(
            @Parameter(description = "用户ID") @PathVariable Long id) {
        // ...
    }
}
```

**访问Swagger UI**：
http://localhost:8080/swagger-ui.html

## 七、前后端分离的最佳实践
1. **API设计规范**
   - RESTful风格
   - 统一响应格式
   - 合理的状态码

2. **API版本管理**
   - URL版本：/api/v1/users
   - Header版本：Accept: application/vnd.example.v1+json

3. **安全**
   - 认证：JWT、OAuth2
   - 授权：RBAC、ABAC
   - HTTPS
   - 输入验证

4. **性能优化**
   - 缓存
   - 分页
   - 压缩
   - CDN

5. **监控和日志**
   - API调用日志
   - 性能监控
   - 错误告警

---

## 章节：CH08 Vue.js基础笔记

# CH08 Vue.js基础笔记

## 一、Vue.js概述
### 1.1 什么是Vue.js
Vue.js是一套用于构建用户界面的渐进式JavaScript框架。

**特点**：
- 渐进式框架：可以逐步采用
- 响应式数据绑定
- 组件化开发
- 简单易学
- 性能优秀

### 1.2 Vue.js的核心特性
1. **声明式渲染**
   ```html
   <div id="app">
     {{ message }}
   </div>
   ```

2. **响应式数据**
   - 数据变化自动更新视图
   - 视图变化自动更新数据

3. **组件化**
   - 可复用的组件
   - 清晰的组件接口

4. **指令系统**
   - v-bind、v-model、v-for、v-if等

5. **过渡和动画**
   - 便捷的过渡效果
   - 动画系统

## 二、Vue.js快速开始
### 2.1 引入Vue.js
```html
<!-- 开发环境版本 -->
<script src="https://cdn.jsdelivr.net/npm/vue@3/dist/vue.global.js"></script>

<!-- 生产环境版本 -->
<script src="https://cdn.jsdelivr.net/npm/vue@3/dist/vue.global.prod.js"></script>
```

### 2.2 Hello World示例
```html
<!DOCTYPE html>
<html>
<head>
  <title>Vue.js Hello World</title>
  <script src="https://cdn.jsdelivr.net/npm/vue@3/dist/vue.global.js"></script>
</head>
<body>
  <div id="app">
    {{ message }}
  </div>

  <script>
    const app = Vue.createApp({
      data() {
        return {
          message: 'Hello, Vue!'
        }
      }
    })
    
    app.mount('#app')
  </script>
</body>
</html>
```

## 三、模板语法
### 3.1 插值
#### 3.1.1 文本插值
```html
<span>Message: {{ message }}</span>
```

#### 3.1.2 原始HTML
```html
<div v-html="rawHtml"></div>
```

#### 3.1.3 特性
```html
<div v-bind:id="dynamicId"></div>
<!-- 简写 -->
<div :id="dynamicId"></div>
```

#### 3.1.4 使用JavaScript表达式
```html
{{ number + 1 }}
{{ ok ? 'YES' : 'NO' }}
{{ message.split('').reverse().join('') }}
```

### 3.2 指令
#### 3.2.1 v-bind
```html
<a v-bind:href="url">链接</a>
<img :src="imageUrl" :alt="imageAlt">
```

#### 3.2.2 v-model
```html
<input v-model="message">
```

#### 3.2.3 v-if / v-else-if / v-else
```html
<div v-if="type === 'A'">A</div>
<div v-else-if="type === 'B'">B</div>
<div v-else>C</div>
```

#### 3.2.4 v-show
```html
<div v-show="isVisible">显示</div>
```

**v-if vs v-show**：
- v-if：真正的条件渲染，切换代价高
- v-show：只是切换display样式，初始渲染代价高

#### 3.2.5 v-for
```html
<!-- 遍历数组 -->
<ul>
  <li v-for="item in items" :key="item.id">
    {{ item.name }}
  </li>
</ul>

<!-- 遍历对象 -->
<ul>
  <li v-for="(value, key, index) in object" :key="key">
    {{ index }}. {{ key }}: {{ value }}
  </li>
</ul>
```

#### 3.2.6 v-on
```html
<button v-on:click="increment">点击</button>
<!-- 简写 -->
<button @click="increment">点击</button>

<!-- 事件修饰符 -->
<form @submit.prevent="onSubmit"></form>
<a @click.stop="doSomething"></a>
```

#### 3.2.7 计算属性
```javascript
computed: {
  reversedMessage() {
    return this.message.split('').reverse().join('')
  }
}
```

#### 3.2.8 监听器
```javascript
watch: {
  message(newVal, oldVal) {
    console.log('message changed from', oldVal, 'to', newVal)
  }
}
```

## 四、组件基础
### 4.1 定义组件
```javascript
app.component('todo-item', {
  props: ['todo'],
  template: `
    <li>{{ todo.text }}</li>
  `
})
```

### 4.2 使用组件
```html
<todo-item 
  v-for="item in groceryList" 
  :todo="item" 
  :key="item.id"
></todo-item>
```

### 4.3 父子组件通信
#### 4.3.1 父传子：Props
```javascript
// 子组件
app.component('blog-post', {
  props: ['title'],
  template: '<h3>{{ title }}</h3>'
})

// 父组件使用
<blog-post title="My journey with Vue"></blog-post>
```

#### 4.3.2 子传父：事件
```javascript
// 子组件
app.component('blog-post', {
  props: ['title'],
  template: `
    <div>
      <h3>{{ title }}</h3>
      <button @click="$emit('enlarge-text')">
        Enlarge text
      </button>
    </div>
  `
})

// 父组件
<blog-post
  v-for="post in posts"
  :key="post.id"
  :title="post.title"
  @enlarge-text="postFontSize += 0.1"
></blog-post>
```

### 4.4 组件生命周期
```javascript
app.component('my-component', {
  created() {
    console.log('组件已创建')
  },
  mounted() {
    console.log('组件已挂载')
  },
  updated() {
    console.log('组件已更新')
  },
  unmounted() {
    console.log('组件已卸载')
  }
})
```

## 五、单文件组件（SFC）
### 5.1 SFC结构
```vue
<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  }
}
</script>

<style scoped>
.hello {
  text-align: center;
  padding: 40px 0;
  background-color: #fff;
}
</style>
```

## 六、Vue CLI
### 6.1 安装Vue CLI
```bash
npm install -g @vue/cli
```

### 6.2 创建项目
```bash
vue create my-project
```

### 6.3 项目结构
```
my-project/
├── node_modules/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── assets/
│   ├── components/
│   │   └── HelloWorld.vue
│   ├── App.vue
│   └── main.js
├── package.json
└── README.md
```

## 七、Vue Router
### 7.1 安装
```bash
npm install vue-router@4
```

### 7.2 配置路由
```javascript
// router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import About from '../views/About.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: About
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
```

### 7.3 使用路由
```vue
<template>
  <div>
    <router-link to="/">Home</router-link>
    <router-link to="/about">About</router-link>
    <router-view></router-view>
  </div>
</template>
```

## 八、Vuex状态管理
### 8.1 安装
```bash
npm install vuex@4
```

### 8.2 配置Vuex
```javascript
// store/index.js
import { createStore } from 'vuex'

export default createStore({
  state: {
    count: 0
  },
  mutations: {
    increment(state) {
      state.count++
    }
  },
  actions: {
    incrementAsync({ commit }) {
      setTimeout(() => {
        commit('increment')
      }, 1000)
    }
  },
  getters: {
    doubleCount: state => state.count * 2
  }
})
```

### 8.3 在组件中使用
```javascript
computed: {
  count() {
    return this.$store.state.count
  },
  doubleCount() {
    return this.$store.getters.doubleCount
  }
},
methods: {
  increment() {
    this.$store.commit('increment')
  },
  incrementAsync() {
    this.$store.dispatch('incrementAsync')
  }
}
```

## 九、Composition API
### 9.1 setup函数
```vue
<script>
import { ref, computed } from 'vue'

export default {
  setup() {
    const count = ref(0)
    const doubleCount = computed(() => count.value * 2)
    
    function increment() {
      count.value++
    }
    
    return {
      count,
      doubleCount,
      increment
    }
  }
}
</script>
```

### 9.2 响应式API
```javascript
import { ref, reactive, computed, watch } from 'vue'

// ref
const count = ref(0)

// reactive
const state = reactive({
  count: 0,
  name: 'Vue'
})

// computed
const doubleCount = computed(() => count.value * 2)

// watch
watch(count, (newVal, oldVal) => {
  console.log(`count changed: ${oldVal} -> ${newVal}`)
})
```

## 十、最佳实践
1. **组件命名**：使用PascalCase
2. **Props定义**：明确定义类型和验证
3. **Key属性**：v-for必须使用key
4. **计算属性**：复杂逻辑使用计算属性
5. **事件命名**：使用kebab-case
6. **样式作用域**：使用scoped样式
7. **组件复用**：提取可复用组件
8. **代码组织**：按功能组织文件