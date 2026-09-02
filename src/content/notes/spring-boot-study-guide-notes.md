---
title: "软件开发架构平台学习指导（详细版）"
date: "2025-06"
type: "learning"
tags: [Spring, SpringBoot, MyBatis, RESTful, Vue, 学习指导]
summary: "软件开发架构平台全课程详细学习指导，覆盖Spring IoC/AOP/MVC、ORM、RESTful API、前端框架全部章节"
---

# 软件开发架构平台学习指导

## 一、课程资料分析

### 资料结构
- **资料类型**：PPT课件（CH01-CH12）+ Review.md
- **内容覆盖**：Spring IoC/AOP、MVC、ORM、RESTful API、前端框架、Maven

### 详细知识点

#### CH01 开发架构与框架技术概述
- 软件架构的概念
  - 开发架构（人）vs 系统架构（机器）
- 架构风格（分层架构、微服务架构、事件驱动架构）
- 框架的作用和分类
- 现代开发架构的趋势
- 框架技术的由来
  - MVC架构细分：业务Bean、DAO、POJO
  - MVC框架解决的两个问题：
    1. 约束程序员遵循MVC架构
    2. 简化和规范代码
  - 表示层框架的原理（以Servlet为例）：
    - 相同点：流程基本一致（获取数据、调用业务逻辑、响应视图）
    - 不同点：具体操作的数据不同
- 框架分类：
  - 表示层框架：Struts、Spring MVC
  - 持久层框架：MyBatis、Hibernate、JPA
  - 容器类框架：Spring、EJB
- 经典技术栈：
  - SSH：Spring、Struts2、Hibernate
  - SSM：Spring、Spring MVC、MyBatis
  - SSM：SpringBoot、Spring MVC、MyBatis
- 框架技术概览：
  - 框架侵入性概念：
    - 高侵入性：直接继承框架类/接口，项目脱离框架无法运行（如Struts 1.x）
    - 低侵入性：通过反射、动态代理，结合IoC和AOP，项目脱离框架仍可运行（如Spring、MyBatis）
  - 软件架构设计：高内聚、低耦合，目标是降低侵入性
  - Struts2基本原理：约定优于配置
  - Spring MVC框架基本原理：
    1. 请求到达前端控制器，委托给具体控制器
    2. 前端控制器通过处理器映射找到URL对应的控制器
    3. 控制器处理请求（处理数据、调用业务逻辑）
    4. 控制器返回模型数据和逻辑视图名
    5. 视图解析器将逻辑视图名匹配成具体视图实现
    6. 视图进行模型数据和视图实现的渲染
    7. 交付模型数据，给出Web响应
- Maven：
  - 定义：基于项目对象模型(POM)的项目管理机制
  - 核心功能：通过配置解决模块间和插件的依赖关系
  - 其他功能：自动化构建和部署运行
  - Maven仓库：
    - 分类：本地仓库、中央仓库、远程仓库(私服)
    - 中央仓库：https://mvnrepository.com/
  - Maven本地仓库：
    - 下载依赖包到本地
    - 搜索顺序：本地仓库->私服->中央仓库->远程仓库
  - POM：
    - 坐标三要素：groupId、artifactId、version
    - 依赖通过dependencies子节点声明
  - Maven构建命令：
    - 编译：mvn compile
    - 测试：mvn test
    - 清理：mvn clean
    - 打包：mvn package
    - 安装：mvn install
    - 部署：mvn deploy

#### CH02 Spring IoC原理和实现深度解析
- IoC（控制反转）概念深度解析
  - 传统编程方式 vs IoC方式
    - 传统方式：对象自己创建依赖对象，耦合度高
      ```java
      // 传统方式
      public class UserService {
          private UserDao userDao = new UserDaoImpl();
      }
      ```
    - IoC方式：依赖对象由外部注入，耦合度低
      ```java
      // IoC方式
      public class UserService {
          private UserDao userDao;
          public void setUserDao(UserDao userDao) {
              this.userDao = userDao;
          }
      }
      ```
  - IoC的核心思想
    - 控制权反转：从应用代码转移到容器
    - 依赖注入：容器负责装配对象之间的依赖关系
    - 优势：低耦合、易测试、易扩展
  - IoC的实现方式
    - 依赖注入（DI, Dependency Injection）：最常用
    - 依赖查找（DL, Dependency Lookup）：较老的方式
- 依赖注入（DI）深度解析
  - DI的三种方式
    - 构造器注入（Constructor Injection）
      - 通过构造函数传递依赖
      - 优点：依赖不可变、保证依赖完整性
      - 示例：
        ```java
        public class UserService {
            private final UserDao userDao;
            public UserService(UserDao userDao) {
                this.userDao = userDao;
            }
        }
        ```
    - Setter注入（Setter Injection）
      - 通过setter方法传递依赖
      - 优点：灵活、可选依赖
      - 示例：
        ```java
        public class UserService {
            private UserDao userDao;
            public void setUserDao(UserDao userDao) {
                this.userDao = userDao;
            }
        }
        ```
    - 字段注入（Field Injection）
      - 通过注解直接注入字段
      - 优点：简洁
      - 缺点：测试不便、依赖不明确
      - 示例：
        ```java
        public class UserService {
            @Autowired
            private UserDao userDao;
        }
        ```
  - 依赖注入的类型
    - byType：按类型匹配
    - byName：按名称匹配
    - constructor：按构造函数参数匹配
- Spring IoC容器详解
  - Spring IoC容器的类型
    - BeanFactory：基础容器，延迟加载
    - ApplicationContext：高级容器，立即加载，功能更丰富
      - ClassPathXmlApplicationContext：从类路径加载XML配置
      - FileSystemXmlApplicationContext：从文件系统加载XML配置
      - AnnotationConfigApplicationContext：从JavaConfig加载
      - WebApplicationContext：Web应用使用
  - ApplicationContext的优势
    - 自动初始化BeanFactory
    - 自动加载BeanPostProcessor
    - 支持国际化
    - 支持事件机制
    - 资源加载更强大
- Bean的生命周期深度解析
  - Bean生命周期阶段
    1. 实例化（Instantiation）
       - 调用构造函数创建Bean实例
    2. 属性赋值（Populate Properties）
       - 设置Bean的属性和依赖
    3. BeanNameAware
       - 如果实现了BeanNameAware，调用setBeanName()
    4. BeanClassLoaderAware
       - 如果实现了BeanClassLoaderAware，调用setBeanClassLoader()
    5. BeanFactoryAware
       - 如果实现了BeanFactoryAware，调用setBeanFactory()
    6. ApplicationContextAware
       - 如果实现了ApplicationContextAware，调用setApplicationContext()
    7. BeanPostProcessor前置处理
       - 调用BeanPostProcessor的postProcessBeforeInitialization()
    8. InitializingBean
       - 如果实现了InitializingBean，调用afterPropertiesSet()
    9. 自定义初始化方法
       - 调用配置的init-method
    10. BeanPostProcessor后置处理
        - 调用BeanPostProcessor的postProcessAfterInitialization()
    11. Bean就绪
        - Bean可以被使用
    12. DisposableBean
        - 如果实现了DisposableBean，调用destroy()
    13. 自定义销毁方法
        - 调用配置的destroy-method
  - BeanPostProcessor的作用
    - 在Bean初始化前后进行自定义处理
    - 示例：AOP代理就是通过BeanPostProcessor实现的
- Spring配置方式详解
  - XML配置方式
    - Bean定义：<bean id="..." class="...">
    - 属性注入：<property name="..." value="..."> 或 <ref bean="...">
    - 构造器注入：<constructor-arg index="..." value="...">
    - 示例：
      ```xml
      <beans>
          <bean id="userDao" class="com.example.UserDaoImpl"/>
          <bean id="userService" class="com.example.UserService">
              <property name="userDao" ref="userDao"/>
          </bean>
      </beans>
      ```
  - 注解配置方式
    - 组件扫描：<context:component-scan base-package="..."/>
    - 组件注解：
      - @Component：通用组件
      - @Service：业务层组件
      - @Repository：数据访问层组件
      - @Controller：控制器组件
    - 依赖注入注解：
      - @Autowired：按类型自动装配
      - @Qualifier：配合@Autowired使用，按名称装配
      - @Resource：按名称装配（JSR-250）
      - @Inject：按类型装配（JSR-330）
    - 示例：
      ```java
      @Service
      public class UserService {
          @Autowired
          private UserDao userDao;
      }
      ```
  - JavaConfig配置方式
    - @Configuration：标记配置类
    - @Bean：定义Bean
    - @ComponentScan：组件扫描
    - @Import：导入其他配置类
    - @PropertySource：加载属性文件
    - 示例：
      ```java
      @Configuration
      @ComponentScan("com.example")
      public class AppConfig {
          @Bean
          public UserDao userDao() {
              return new UserDaoImpl();
          }
          @Bean
          public UserService userService() {
              UserService service = new UserService();
              service.setUserDao(userDao());
              return service;
          }
      }
      ```
- Bean的作用域（Scope）详解
  - singleton（单例）：默认，每个容器一个实例
  - prototype（原型）：每次请求创建新实例
  - request：每次HTTP请求一个实例（Web应用）
  - session：每个HTTP会话一个实例（Web应用）
  - application：每个ServletContext一个实例（Web应用）
  - websocket：每个WebSocket会话一个实例（Web应用）
- Bean的自动装配（Autowiring）详解
  - no：不自动装配，显式配置
  - byName：按属性名自动装配
  - byType：按属性类型自动装配
  - constructor：按构造函数参数类型自动装配
- 控制反转IoC和依赖注入DI的基本原理
  - IoC定义：面向对象编程设计原则，降低耦合度
  - 常用实现方式：依赖注入（DI）
  - 原理：对象被创建时由外部实体注入依赖对象引用，而非内部创建
  - 常见实现：Spring Framework
  - 需求示例：修改输出内容
    - 简单方式：改变字符串，需重新编译和测试
    - 更好方案：应用从外部接受字符串，运行时决定显示内容
- Spring IoC的实现原理
  - 底层技术：反射、动态代理
  - Bean的创建过程：
    1. 读取配置元数据（XML、注解、JavaConfig）
    2. 将配置解析为BeanDefinition
    3. 根据BeanDefinition创建Bean实例
    4. 注入Bean的依赖
    5. 调用初始化方法
    6. 返回Bean给应用
  - 反射的作用：动态创建对象、调用方法、访问字段
  - 示例：反射创建对象
    ```java
    Class<?> clazz = Class.forName("com.example.UserService");
    Constructor<?> constructor = clazz.getConstructor(UserDao.class);
    UserService userService = (UserService) constructor.newInstance(userDao);
    ```

#### CH03 Spring AOP原理和实现深度解析
- AOP（面向切面编程）概念深度解析
  - 什么是AOP
    - Aspect-Oriented Programming，面向切面编程
    - 一种编程范式，用于处理横切关注点
  - 横切关注点（Cross-cutting Concerns）
    - 散布在应用多个模块的功能
    - 如：日志、事务、安全、性能监控、异常处理
  - OOP vs AOP
    - OOP：纵向抽象，按功能模块化
    - AOP：横向抽象，将横切关注点模块化
  - AOP的优势
    - 提高代码复用性
    - 降低耦合度
    - 提高可维护性
    - 关注点分离
- AOP核心概念详解
  - 切面（Aspect）
    - 横切关注点的模块化
    - 包含切点和通知
    - 示例：日志切面、事务切面
  - 连接点（JoinPoint）
    - 程序执行过程中的特定点
    - 如：方法调用、方法执行、字段访问
    - Spring AOP只支持方法执行连接点
  - 切点（Pointcut）
    - 匹配连接点的表达式
    - 定义哪些连接点需要被通知
    - 切点表达式语言
  - 通知（Advice）
    - 在切点处执行的动作
    - 通知的类型
  - 目标对象（Target Object）
    - 被通知的对象
    - 也叫被代理对象
  - AOP代理（AOP Proxy）
    - AOP框架创建的对象
    - 包含目标对象和通知
  - 织入（Weaving）
    - 将切面应用到目标对象，创建代理对象的过程
    - 织入时机：
      - 编译期（Compile Time）：AspectJ
      - 类加载期（Load Time）：LTW
      - 运行期（Runtime）：Spring AOP
- 通知（Advice）类型详解
  - 前置通知（Before Advice）
    - 在方法执行前执行
    - @Before
    - 示例：权限检查、日志记录
  - 返回通知（After Returning Advice）
    - 在方法正常返回后执行
    - @AfterReturning
    - 可以获取返回值
    - 示例：日志记录返回值
  - 异常通知（After Throwing Advice）
    - 在方法抛出异常后执行
    - @AfterThrowing
    - 可以获取异常对象
    - 示例：异常日志、异常处理
  - 后置通知（After Finally Advice）
    - 在方法执行后执行（无论正常返回还是异常）
    - @After
    - 类似finally块
    - 示例：资源清理
  - 环绕通知（Around Advice）
    - 在方法执行前后都执行
    - @Around
    - 最强大的通知类型
    - 可以控制方法是否执行
    - 可以修改方法参数和返回值
    - 示例：性能监控、事务管理
- 切点表达式（Pointcut Expression）详解
  - Spring AOP切点表达式类型
    - execution：匹配方法执行连接点
    - within：匹配指定类型内的方法
    - this：匹配AOP代理对象的类型
    - target：匹配目标对象的类型
    - args：匹配方法参数
    - @annotation：匹配有指定注解的方法
    - @within：匹配有指定注解的类
    - @target：匹配目标对象有指定注解
    - @args：匹配方法参数有指定注解
  - execution表达式语法
    ```
    execution(修饰符? 返回类型 类名? 方法名(参数) 异常?
    ```
  - execution表达式示例
    - 匹配public方法：execution(public * *(..))
    - 匹配以save开头的方法：execution(* save*(..))
    - 匹配指定包下的方法：execution(* com.example.service.*.*(..))
    - 匹配指定包及其子包：execution(* com.example.service..*.*(..))
    - 匹配指定返回类型：execution(String com.example..*.*(..))
    - 匹配无参数方法：execution(* *())
    - 匹配一个参数：execution(* *(..)
    - 匹配任意参数：execution(* *(..))
  - 逻辑运算符
    - &&：与
    - ||：或
    - !：非
  - 切点表达式组合示例
    - execution(* com.example.service.*.*(..)) && @annotation(com.example.Log)
- Spring AOP的实现方式详解
  - JDK动态代理（JDK Dynamic Proxy）
    - 基于接口的代理
    - 使用java.lang.reflect.Proxy
    - 要求目标对象必须实现至少一个接口
    - 示例：
      ```java
      public class MyInvocationHandler implements InvocationHandler {
          private Object target;
          public Object invoke(Object proxy, Method method, Object[] args) {
              // 前置通知
              Object result = method.invoke(target, args);
              // 后置通知
              return result;
          }
      }
      ```
  - CGLIB（Code Generation Library）
    - 基于继承的代理
    - 通过生成目标类的子类
    - 不要求目标对象实现接口
    - 不能代理final类和final方法
    - 性能比JDK动态代理稍好
  - Spring AOP的代理选择策略
    - 如果目标对象实现了接口，默认使用JDK动态代理
    - 如果目标对象没有实现接口，使用CGLIB
    - 可以通过配置强制使用CGLIB
    - Spring Boot 2.x+ 默认使用CGLIB
- Spring AOP的配置方式详解
  - XML配置方式
    ```xml
    <aop:config>
        <aop:aspect id="logAspect" ref="logAspect">
            <aop:pointcut id="servicePointcut" 
                expression="execution(* com.example.service.*.*(..))"/>
            <aop:before pointcut-ref="servicePointcut" method="beforeAdvice"/>
        </aop:aspect>
    </aop:config>
    ```
  - 注解配置方式
    - @Aspect：标记切面类
    - @Pointcut：定义切点
    - @Before、@AfterReturning、@AfterThrowing、@After、@Around：定义通知
    - 示例：
      ```java
      @Aspect
      @Component
      public class LogAspect {
          @Pointcut("execution(* com.example.service.*.*(..))")
          public void servicePointcut() {}
          
          @Before("servicePointcut()")
          public void beforeAdvice(JoinPoint joinPoint) {
              System.out.println("Before method: " + joinPoint.getSignature());
          }
          
          @Around("servicePointcut()")
          public Object aroundAdvice(ProceedingJoinPoint joinPoint) throws Throwable {
              long start = System.currentTimeMillis();
              Object result = joinPoint.proceed();
              long end = System.currentTimeMillis();
              System.out.println("Time: " + (end - start) + "ms");
              return result;
          }
      }
      ```
- Spring AOP的应用场景
  - 日志记录
  - 事务管理（Spring Transaction）
  - 权限控制
  - 性能监控
  - 异常处理
  - 缓存管理
  - 审计跟踪
- AOP vs OOP总结
  - OOP适合纵向分解
  - AOP适合横向分解
  - 两者互补，不是替代关系
  - Spring AOP是对OOP的补充

#### CH04 Spring MVC深度解析
- **MVC设计模式详解**
  - **Model（模型）**：数据模型，封装业务数据和逻辑
  - **View（视图）**：负责展示数据，生成界面
  - **Controller（控制器）**：接收请求，调用模型，选择视图
  - **工作原理**：
    1. 用户请求 → 2. 控制器处理 → 3. 模型更新 → 4. 视图渲染 → 5. 用户响应
  - **优点**：
    - 职责分离
    - 易于维护
    - 可重用性好
    - 便于测试
- **Spring MVC的工作流程深度解析**
  - **核心组件**：
    1. **DispatcherServlet（前端控制器）**：
       - Spring MVC的核心，负责请求分发
       - 拦截所有请求，委托给其他组件处理
    2. **HandlerMapping（处理器映射器）**：
       - 根据URL找到对应的Handler（Controller）
       - 实现：RequestMappingHandlerMapping（注解方式）
    3. **HandlerAdapter（处理器适配器）**：
       - 适配调用不同类型的Handler
       - 实现：RequestMappingHandlerAdapter（注解方式）
    4. **Controller（控制器）**：
       - 处理业务逻辑
       - 返回ModelAndView或ResponseEntity
    5. **ViewResolver（视图解析器）**：
       - 将逻辑视图名解析为具体View
       - 实现：InternalResourceViewResolver（JSP）
    6. **View（视图）**：
       - 渲染模型数据，生成响应
  - **详细工作流程**：
    1. 用户发送HTTP请求到DispatcherServlet
    2. DispatcherServlet调用HandlerMapping查找Handler
    3. HandlerMapping返回HandlerExecutionChain（包含Handler和Interceptors）
    4. DispatcherServlet调用HandlerAdapter执行Handler
    5. HandlerAdapter调用Controller的处理方法
    6. Controller执行业务逻辑，返回ModelAndView
    7. HandlerAdapter将ModelAndView返回给DispatcherServlet
    8. DispatcherServlet调用ViewResolver解析视图
    9. ViewResolver返回具体的View对象
    10. DispatcherServlet调用View渲染模型数据
    11. View生成HTML响应
    12. DispatcherServlet将响应返回给用户
- **控制器（Controller）详解**
  - **@Controller注解**：
    ```java
    @Controller
    @RequestMapping("/user")
    public class UserController {
        
        @GetMapping("/list")
        public String list(Model model) {
            List<User> users = userService.findAll();
            model.addAttribute("users", users);
            return "user/list";
        }
        
        @PostMapping("/add")
        public String add(@ModelAttribute User user) {
            userService.save(user);
            return "redirect:/user/list";
        }
    }
    ```
  - **@RestController注解**：返回JSON/XML，不返回视图
    ```java
    @RestController
    @RequestMapping("/api/users")
    public class UserRestController {
        
        @GetMapping
        public List<User> list() {
            return userService.findAll();
        }
        
        @GetMapping("/{id}")
        public User getById(@PathVariable Long id) {
            return userService.findById(id);
        }
        
        @PostMapping
        @ResponseStatus(HttpStatus.CREATED)
        public User create(@RequestBody User user) {
            return userService.save(user);
        }
        
        @PutMapping("/{id}")
        public User update(@PathVariable Long id, @RequestBody User user) {
            user.setId(id);
            return userService.save(user);
        }
        
        @DeleteMapping("/{id}")
        @ResponseStatus(HttpStatus.NO_CONTENT)
        public void delete(@PathVariable Long id) {
            userService.deleteById(id);
        }
    }
    ```
  - **请求映射注解**：
    - @RequestMapping：通用映射
    - @GetMapping：GET请求
    - @PostMapping：POST请求
    - @PutMapping：PUT请求
    - @DeleteMapping：DELETE请求
    - @PatchMapping：PATCH请求
  - **参数绑定**：
    - @PathVariable：URL路径变量
    - @RequestParam：请求参数
    - @RequestBody：请求体
    - @RequestHeader：请求头
    - @CookieValue：Cookie
    - @ModelAttribute：模型属性
    - 示例：
      ```java
      @GetMapping("/search")
      public String search(
          @RequestParam String keyword,
          @RequestParam(defaultValue = "1") int page,
          @RequestParam(defaultValue = "10") int size,
          Model model) {
          // ...
      }
      ```
- **视图解析器（ViewResolver）详解**
  - **InternalResourceViewResolver**：JSP视图解析器
    ```java
    @Configuration
    public class WebConfig implements WebMvcConfigurer {
        @Bean
        public ViewResolver viewResolver() {
            InternalResourceViewResolver resolver = new InternalResourceViewResolver();
            resolver.setPrefix("/WEB-INF/views/");
            resolver.setSuffix(".jsp");
            return resolver;
        }
    }
    ```
  - **ContentNegotiatingViewResolver**：内容协商视图解析器
  - **BeanNameViewResolver**：Bean名称视图解析器
  - **FreeMarkerViewResolver**：FreeMarker视图解析器
  - **ThymeleafViewResolver**：Thymeleaf视图解析器
- **拦截器（Interceptor）详解**
  - **HandlerInterceptor接口**：
    ```java
    public interface HandlerInterceptor {
        default boolean preHandle(HttpServletRequest request, 
                                  HttpServletResponse response, 
                                  Object handler) throws Exception {
            return true; // 继续执行
        }
        
        default void postHandle(HttpServletRequest request, 
                               HttpServletResponse response, 
                               Object handler, 
                               ModelAndView modelAndView) throws Exception {
        }
        
        default void afterCompletion(HttpServletRequest request, 
                                     HttpServletResponse response, 
                                     Object handler, 
                                     Exception ex) throws Exception {
        }
    }
    ```
  - **登录拦截器示例**：
    ```java
    @Component
    public class LoginInterceptor implements HandlerInterceptor {
        @Override
        public boolean preHandle(HttpServletRequest request, 
                                  HttpServletResponse response, 
                                  Object handler) throws Exception {
            HttpSession session = request.getSession();
            User user = (User) session.getAttribute("user");
            if (user == null) {
                response.sendRedirect("/login");
                return false;
            }
            return true;
        }
    }
    ```
  - **拦截器配置**：
    ```java
    @Configuration
    public class WebConfig implements WebMvcConfigurer {
        @Autowired
        private LoginInterceptor loginInterceptor;
        
        @Override
        public void addInterceptors(InterceptorRegistry registry) {
            registry.addInterceptor(loginInterceptor)
                   .addPathPatterns("/**")
                   .excludePathPatterns("/login", "/css/**", "/js/**");
        }
    }
    ```
  - **拦截器 vs 过滤器**：
    - 拦截器：Spring MVC组件，基于Java反射
    - 过滤器：Servlet组件，基于函数回调
    - 拦截器更强大，可以访问Spring上下文
- **数据绑定和验证详解**
  - **数据绑定**：
    - Spring自动将请求参数绑定到Java对象
    - 支持类型转换
    - 示例：
      ```java
      public class User {
          private Long id;
          private String username;
          private String password;
          private Integer age;
          private Date birthday;
          // getters and setters
      }
      
      @PostMapping("/register")
      public String register(@ModelAttribute User user) {
          userService.save(user);
          return "success";
      }
      ```
  - **数据验证（JSR-303/JSR-349）**：
    - 验证注解：
      - @NotNull：非空
      - @NotEmpty：非空集合
      - @NotBlank：非空字符串
      - @Min/@Max：数值范围
      - @Pattern：正则表达式
      - @Email：邮箱格式
      - @Past/@Future：日期范围
    - 示例：
      ```java
      public class User {
          @NotNull(message = "ID不能为空")
          private Long id;
          
          @NotBlank(message = "用户名不能为空")
          @Size(min = 3, max = 20, message = "用户名长度3-20")
          private String username;
          
          @NotBlank(message = "密码不能为空")
          @Size(min = 6, message = "密码至少6位")
          private String password;
          
          @Email(message = "邮箱格式不正确")
          private String email;
          
          @Min(value = 0, message = "年龄不能为负数")
          @Max(value = 150, message = "年龄最大150")
          private Integer age;
      }
      
      @PostMapping("/register")
      public String register(@Valid @ModelAttribute User user, 
                            BindingResult result) {
          if (result.hasErrors()) {
              return "register";
          }
          userService.save(user);
          return "success";
      }
      ```
  - **自定义验证器**：
    ```java
    public class PhoneValidator implements ConstraintValidator<Phone, String> {
        @Override
        public boolean isValid(String value, ConstraintValidatorContext context) {
            if (value == null) return true;
            return value.matches("^1[3-9]\\d{9}$");
        }
    }
    
    @Target({ElementType.FIELD})
    @Retention(RetentionPolicy.RUNTIME)
    @Constraint(validatedBy = PhoneValidator.class)
    public @interface Phone {
        String message() default "手机号格式不正确";
        Class<?>[] groups() default {};
        Class<? extends Payload>[] payload() default {};
    }
    
    // 使用
    public class User {
        @Phone
        private String phone;
    }
    ```

#### CH05 Spring Boot和ORM简介深度解析
- **Spring Boot的特点详解**
  - **自动配置（Auto-Configuration）**
    - 根据类路径下的依赖自动配置Spring应用
    - 条件化配置：@ConditionalOnClass、@ConditionalOnMissingBean等
    - 示例：如果classpath中有spring-boot-starter-web，自动配置DispatcherServlet
  - **约定优于配置（Convention over Configuration）**
    - 默认配置合理，减少配置文件
    - 默认项目结构：
      ```
      src/
      ├── main/
      │   ├── java/
      │   │   └── com/example/demo/
      │   │       ├── DemoApplication.java (主类)
      │   │       ├── controller/
      │   │       ├── service/
      │   │       ├── repository/
      │   │       └── entity/
      │   └── resources/
      │       ├── application.properties (配置文件)
      │       ├── static/ (静态资源)
      │       └── templates/ (模板文件)
      └── test/
          └── java/
      ```
  - **起步依赖（Starter Dependencies）**
    - 一组预配置的依赖集合
    - 示例：
      - spring-boot-starter-web：Web开发
      - spring-boot-starter-data-jpa：JPA数据访问
      - spring-boot-starter-security：安全认证
      - spring-boot-starter-test：测试
  - **内嵌服务器**
    - 默认Tomcat，可切换Jetty或Undertow
    - 无需部署WAR包，直接运行JAR
  - **生产就绪特性**
    - 健康检查（Health Check）
    - 指标监控（Metrics）
    - 外部化配置
    - 日志集成
- **Spring Boot项目创建**
  - **使用Spring Initializr**
    - 在线：https://start.spring.io/
    - IDE内置：IntelliJ IDEA、Eclipse
  - **pom.xml示例**
    ```xml
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.7.14</version>
    </parent>
    
    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
            <scope>runtime</scope>
        </dependency>
    </dependencies>
    ```
  - **主类示例**
    ```java
    @SpringBootApplication
    public class DemoApplication {
        public static void main(String[] args) {
            SpringApplication.run(DemoApplication.class, args);
        }
    }
    ```
  - **@SpringBootApplication注解**
    - 组合注解：
      - @Configuration：配置类
      - @EnableAutoConfiguration：启用自动配置
      - @ComponentScan：组件扫描
- **Spring Boot自动配置原理**
  - **@EnableAutoConfiguration**
    - 导入AutoConfigurationImportSelector
    - 读取META-INF/spring.factories
  - **spring.factories文件**
    - 列出所有自动配置类
    - 示例：
      ```
      org.springframework.boot.autoconfigure.EnableAutoConfiguration=\
      org.springframework.boot.autoconfigure.web.servlet.WebMvcAutoConfiguration,\
      org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration
      ```
  - **条件注解**
    - @ConditionalOnClass：类存在时生效
    - @ConditionalOnMissingBean：Bean不存在时生效
    - @ConditionalOnProperty：属性存在时生效
    - @ConditionalOnWebApplication：Web应用时生效
- **ORM的概念深度解析**
  - **ORM（Object-Relational Mapping，对象关系映射）**
    - 在对象模型和关系模型之间建立映射
    - 用面向对象的方式操作数据库
  - **优点**
    - 提高开发效率
    - 减少重复代码
    - 数据库移植性好
    - 代码更易维护
  - **缺点**
    - 性能可能略有损失
    - 复杂SQL需要手写
    - 学习曲线
  - **ORM框架对比**
    - MyBatis：半自动，SQL灵活
    - Hibernate：全自动，ORM完整
    - JPA：标准规范，多实现
- **JPA简介**
  - **JPA（Java Persistence API）**
    - Java EE标准的ORM规范
    - 不是具体实现，是接口定义
  - **JPA核心概念**
    - 实体（Entity）：@Entity
    - 主键（Primary Key）：@Id
    - 关系映射：@OneToOne、@OneToMany、@ManyToOne、@ManyToMany
    - 查询：JPQL、Criteria API
  - **JPA实现**
    - Hibernate（最常用）
    - EclipseLink
    - OpenJPA
  - **实体示例**
    ```java
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
        
        @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
        private List<Order> orders;
        
        // getters and setters
    }
    ```
  - **Repository接口**
    ```java
    public interface UserRepository extends JpaRepository<User, Long> {
        User findByUsername(String username);
        List<User> findByAgeGreaterThan(Integer age);
        @Query("SELECT u FROM User u WHERE u.email LIKE %:domain")
        List<User> findByEmailDomain(@Param("domain") String domain);
    }
    ```

#### CH06 ORM的实现方式和MyBatis深度解析
- **MyBatis的核心概念**
  - **MyBatis简介**
    - 持久层框架，支持定制化SQL、存储过程、高级映射
    - 避免几乎所有JDBC代码和手动设置参数及获取结果集
  - **核心组件**
    - SqlSessionFactory：创建SqlSession的工厂
    - SqlSession：执行SQL、管理事务
    - Mapper：映射接口，定义SQL操作
    - Mapper XML：SQL映射文件
- **MyBatis配置详解**
  - **mybatis-config.xml**
    ```xml
    <?xml version="1.0" encoding="UTF-8" ?>
    <!DOCTYPE configuration
            PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
            "http://mybatis.org/dtd/mybatis-3-config.dtd">
    <configuration>
        <settings>
            <setting name="cacheEnabled" value="true"/>
            <setting name="lazyLoadingEnabled" value="true"/>
            <setting name="logImpl" value="SLF4J"/>
        </settings>
        <typeAliases>
            <typeAlias alias="User" type="com.example.entity.User"/>
        </typeAliases>
        <environments default="development">
            <environment id="development">
                <transactionManager type="JDBC"/>
                <dataSource type="POOLED">
                    <property name="driver" value="com.mysql.cj.jdbc.Driver"/>
                    <property name="url" value="jdbc:mysql://localhost:3306/mybatis"/>
                    <property name="username" value="root"/>
                    <property name="password" value="password"/>
                </dataSource>
            </environment>
        </environments>
        <mappers>
            <mapper resource="mapper/UserMapper.xml"/>
        </mappers>
    </configuration>
    ```
- **Mapper映射文件详解**
  - **基本CRUD**
    ```xml
    <?xml version="1.0" encoding="UTF-8" ?>
    <!DOCTYPE mapper
            PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
            "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
    <mapper namespace="com.example.mapper.UserMapper">
        
        <resultMap id="UserResultMap" type="User">
            <id property="id" column="id"/>
            <result property="username" column="username"/>
            <result property="password" column="password"/>
        </resultMap>
        
        <select id="findById" parameterType="Long" resultMap="UserResultMap">
            SELECT * FROM user WHERE id = #{id}
        </select>
        
        <select id="findAll" resultMap="UserResultMap">
            SELECT * FROM user
        </select>
        
        <insert id="insert" parameterType="User" useGeneratedKeys="true" keyProperty="id">
            INSERT INTO user (username, password)
            VALUES (#{username}, #{password})
        </insert>
        
        <update id="update" parameterType="User">
            UPDATE user 
            SET username = #{username}, password = #{password}
            WHERE id = #{id}
        </update>
        
        <delete id="delete" parameterType="Long">
            DELETE FROM user WHERE id = #{id}
        </delete>
    </mapper>
    ```
  - **Mapper接口**
    ```java
    public interface UserMapper {
        User findById(Long id);
        List<User> findAll();
        void insert(User user);
        void update(User user);
        void delete(Long id);
    }
    ```
- **动态SQL详解**
  - **if标签**
    ```xml
    <select id="findByCondition" resultMap="UserResultMap">
        SELECT * FROM user
        <where>
            <if test="username != null and username != ''">
                AND username LIKE CONCAT('%', #{username}, '%')
            </if>
            <if test="age != null">
                AND age = #{age}
            </if>
        </where>
    </select>
    ```
  - **choose、when、otherwise标签**
    ```xml
    <select id="findByCondition" resultMap="UserResultMap">
        SELECT * FROM user
        <where>
            <choose>
                <when test="id != null">
                    AND id = #{id}
                </when>
                <when test="username != null">
                    AND username = #{username}
                </when>
                <otherwise>
                    AND 1=1
                </otherwise>
            </choose>
        </where>
    </select>
    ```
  - **foreach标签**
    ```xml
    <select id="findByIds" resultMap="UserResultMap">
        SELECT * FROM user
        WHERE id IN
        <foreach collection="list" item="id" open="(" separator="," close=")">
            #{id}
        </foreach>
    </select>
    
    <insert id="batchInsert" parameterType="java.util.List">
        INSERT INTO user (username, password)
        VALUES
        <foreach collection="list" item="user" separator=",">
            (#{user.username}, #{user.password})
        </foreach>
    </insert>
    ```
  - **set标签**
    ```xml
    <update id="updateSelective" parameterType="User">
        UPDATE user
        <set>
            <if test="username != null">username = #{username},</if>
            <if test="password != null">password = #{password},</if>
        </set>
        WHERE id = #{id}
    </update>
    ```
- **缓存机制详解**
  - **一级缓存（本地缓存）**
    - 默认开启，SqlSession级别
    - 同一个SqlSession内相同查询会缓存
    - 失效情况：
      - SqlSession关闭
      - 执行增删改操作
      - 手动清除缓存
  - **二级缓存（全局缓存）**
    - 默认关闭，需要配置开启
    - Mapper级别，多个SqlSession共享
    - 配置方式：
      ```xml
      <!-- mybatis-config.xml -->
      <setting name="cacheEnabled" value="true"/>
      
      <!-- Mapper XML -->
      <cache
          eviction="LRU"
          flushInterval="60000"
          size="512"
          readOnly="true"/>
      ```
  - **缓存策略**
    - LRU：最近最少使用（默认）
    - FIFO：先进先出
    - SOFT：软引用
    - WEAK：弱引用
- **MyBatis与Spring集成详解**
  - **添加依赖**
    ```xml
    <dependency>
        <groupId>org.mybatis</groupId>
        <artifactId>mybatis</artifactId>
        <version>3.5.13</version>
    </dependency>
    <dependency>
        <groupId>org.mybatis</groupId>
        <artifactId>mybatis-spring</artifactId>
        <version>2.1.0</version>
    </dependency>
    ```
  - **Spring Boot集成**
    ```xml
    <dependency>
        <groupId>org.mybatis.spring.boot</groupId>
        <artifactId>mybatis-spring-boot-starter</artifactId>
        <version>2.3.1</version>
    </dependency>
    ```
  - **配置application.properties**
    ```properties
    # 数据源配置
    spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
    spring.datasource.url=jdbc:mysql://localhost:3306/mybatis?useSSL=false&serverTimezone=UTC
    spring.datasource.username=root
    spring.datasource.password=password
    
    # MyBatis配置
    mybatis.mapper-locations=classpath:mapper/*.xml
    mybatis.type-aliases-package=com.example.entity
    mybatis.configuration.map-underscore-to-camel-case=true
    ```
  - **使用@Mapper注解**
    ```java
    @Mapper
    public interface UserMapper {
        User findById(Long id);
        List<User> findAll();
    }
    ```
  - **或使用@MapperScan**
    ```java
    @SpringBootApplication
    @MapperScan("com.example.mapper")
    public class DemoApplication {
        public static void main(String[] args) {
            SpringApplication.run(DemoApplication.class, args);
        }
    }
    ```

#### CH07 前后端分离和RESTful API简介深度解析
- **前后端分离的概念详解**
  - **传统开发模式**
    - 后端渲染（Server-Side Rendering, SSR）
    - JSP、PHP、ASP.NET
    - 前后端耦合，职责不清
  - **前后端分离模式**
    - 前端：独立应用，负责UI和交互
    - 后端：RESTful API，提供数据和服务
    - 通过API通信，职责清晰
  - **前后端分离的优势**
    - 前后端并行开发
    - 技术选型灵活
    - 提高开发效率
    - 便于维护和扩展
    - 支持多终端
- **RESTful API的设计原则详解**
  - **REST（Representational State Transfer）**
    - 一种软件架构风格
    - 核心概念：资源、表现层、状态转移
  - **REST设计原则**
    1. **资源标识（Resource Identification）**
       - 每个资源有唯一的URI
       - 使用名词，不使用动词
       - 示例：/users、/orders、/products
    2. **统一接口（Uniform Interface）**
       - 使用标准HTTP方法
       - GET：获取资源
       - POST：创建资源
       - PUT：更新资源（完整替换）
       - PATCH：更新资源（部分更新）
       - DELETE：删除资源
    3. **无状态（Stateless）**
       - 每个请求包含所有必要信息
       - 服务器不保存会话状态
    4. **可缓存（Cacheable）**
       - 响应应明确标注是否可缓存
       - 使用Cache-Control、ETag等
    5. **分层系统（Layered System）**
       - 客户端不知道是否直接连接到服务器
       - 可以使用代理、网关等
  - **REST API设计示例**
    | HTTP方法 | URI | 描述 |
    |----------|-----|------|
    | GET | /api/users | 获取所有用户 |
    | GET | /api/users/{id} | 获取指定用户 |
    | POST | /api/users | 创建新用户 |
    | PUT | /api/users/{id} | 更新用户（完整） |
    | PATCH | /api/users/{id} | 更新用户（部分） |
    | DELETE | /api/users/{id} | 删除用户 |
- **HTTP方法的使用详解**
  - **GET**
    - 安全、幂等
    - 用于查询
    - 参数在URL中
    - 示例：
      ```http
      GET /api/users?page=1&size=10 HTTP/1.1
      Host: example.com
      ```
  - **POST**
    - 不安全、非幂等
    - 用于创建
    - 参数在请求体
    - 示例：
      ```http
      POST /api/users HTTP/1.1
      Host: example.com
      Content-Type: application/json
      
      {
        "username": "test",
        "email": "test@example.com"
      }
      ```
  - **PUT**
    - 不安全、幂等
    - 用于完整更新
    - 示例：
      ```http
      PUT /api/users/1 HTTP/1.1
      Host: example.com
      Content-Type: application/json
      
      {
        "id": 1,
        "username": "test",
        "email": "test@example.com"
      }
      ```
  - **PATCH**
    - 不安全、非幂等
    - 用于部分更新
    - 示例：
      ```http
      PATCH /api/users/1 HTTP/1.1
      Host: example.com
      Content-Type: application/json-patch+json
      
      [
        {"op": "replace", "path": "/email", "value": "new@example.com"}
      ]
      ```
  - **DELETE**
    - 不安全、幂等
    - 用于删除
    - 示例：
      ```http
      DELETE /api/users/1 HTTP/1.1
      Host: example.com
      ```
- **HTTP状态码的使用**
  - **2xx 成功**
    - 200 OK：成功
    - 201 Created：创建成功
    - 204 No Content：无内容（删除成功）
  - **4xx 客户端错误**
    - 400 Bad Request：请求错误
    - 401 Unauthorized：未认证
    - 403 Forbidden：无权限
    - 404 Not Found：资源不存在
    - 405 Method Not Allowed：方法不允许
    - 409 Conflict：冲突
  - **5xx 服务器错误**
    - 500 Internal Server Error：服务器内部错误
    - 502 Bad Gateway：网关错误
    - 503 Service Unavailable：服务不可用
- **API设计规范**
  - **URI规范**
    - 使用小写字母和连字符
    - 使用复数形式
    - 层级关系清晰
    - 示例：/api/users/{id}/orders
  - **请求和响应格式**
    - 使用JSON
    - Content-Type: application/json
  - **分页**
    ```http
    GET /api/users?page=1&size=10&sort=id,desc
    ```
    响应：
    ```json
    {
      "content": [...],
      "page": 1,
      "size": 10,
      "totalElements": 100,
      "totalPages": 10
    }
    ```
  - **过滤**
    ```http
    GET /api/users?status=active&age=18
    ```
  - **搜索**
    ```http
    GET /api/users?q=keyword
    ```
- **前后端通信方式**
  - **AJAX（Asynchronous JavaScript and XML）**
  - **Fetch API**
  - **Axios**
  - **WebSocket（实时通信）**

#### CH08 RESTful API进阶深度解析
- **API版本控制详解**
  - **为什么需要版本控制**
    - 向后兼容
    - 平滑升级
    - 不破坏现有客户端
  - **版本控制策略**
    1. **URI版本**
       ```
       /api/v1/users
       /api/v2/users
       ```
    2. **查询参数版本**
       ```
       /api/users?version=1
       ```
    3. **请求头版本**
       ```http
       Accept: application/vnd.example.v1+json
       ```
    4. **内容协商**
       ```http
       Accept: application/json; version=1
       ```
  - **推荐方案**
    - URI版本：简单直观
    - 适合大多数场景
- **认证授权（JWT、OAuth2）详解**
  - **JWT（JSON Web Token）**
    - **结构**
      - Header：算法、类型
      - Payload：声明（用户信息、过期时间）
      - Signature：签名
    - **JWT示例**
      ```
      eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
      eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.
      SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
      ```
    - **JWT工作流程**
      1. 用户登录
      2. 服务器验证，生成JWT
      3. 客户端保存JWT
      4. 客户端请求时携带JWT
      5. 服务器验证JWT
    - **JWT Java示例**
      ```java
      // 生成JWT
      String token = Jwts.builder()
          .setSubject(username)
          .setIssuedAt(new Date())
          .setExpiration(new Date(System.currentTimeMillis() + 86400000))
          .signWith(SignatureAlgorithm.HS512, secretKey)
          .compact();
      
      // 验证JWT
      Claims claims = Jwts.parser()
          .setSigningKey(secretKey)
          .parseClaimsJws(token)
          .getBody();
      String username = claims.getSubject();
      ```
  - **OAuth2**
    - **角色**
      - Resource Owner：资源所有者
      - Resource Server：资源服务器
      - Client：客户端
      - Authorization Server：授权服务器
    - **授权流程**
      1. Authorization Code（授权码）：最安全
      2. Implicit（隐式）：纯前端应用
      3. Resource Owner Password Credentials（密码）：信任客户端
      4. Client Credentials（客户端凭证）：服务间通信
    - **授权码流程**
      1. 用户访问客户端
      2. 客户端重定向到授权服务器
      3. 用户授权
      4. 授权服务器返回授权码
      5. 客户端用授权码换取访问令牌
      6. 客户端用访问令牌访问资源
- **错误处理详解**
  - **统一错误响应格式**
    ```json
    {
      "timestamp": "2024-01-01T12:00:00Z",
      "status": 400,
      "error": "Bad Request",
      "message": "Validation failed",
      "details": [
        {
          "field": "username",
          "message": "Username is required"
        }
      ],
      "path": "/api/users"
    }
    ```
  - **Spring Boot异常处理**
    ```java
    @RestControllerAdvice
    public class GlobalExceptionHandler {
        
        @ExceptionHandler(ResourceNotFoundException.class)
        @ResponseStatus(HttpStatus.NOT_FOUND)
        public ErrorResponse handleNotFound(ResourceNotFoundException ex) {
            return new ErrorResponse(HttpStatus.NOT_FOUND, ex.getMessage());
        }
        
        @ExceptionHandler(MethodArgumentNotValidException.class)
        @ResponseStatus(HttpStatus.BAD_REQUEST)
        public ErrorResponse handleValidation(MethodArgumentNotValidException ex) {
            List<FieldError> errors = ex.getBindingResult().getFieldErrors();
            return new ErrorResponse(HttpStatus.BAD_REQUEST, "Validation failed", errors);
        }
    }
    ```
- **API文档（Swagger）详解**
  - **Swagger简介**
    - OpenAPI规范
    - 自动生成API文档
    - 交互式API测试
  - **Spring Boot集成Swagger**
    - 添加依赖：
      ```xml
      <dependency>
          <groupId>io.springfox</groupId>
          <artifactId>springfox-swagger2</artifactId>
          <version>2.9.2</version>
      </dependency>
      <dependency>
          <groupId>io.springfox</groupId>
          <artifactId>springfox-swagger-ui</artifactId>
          <version>2.9.2</version>
      </dependency>
      ```
    - 配置类：
      ```java
      @Configuration
      @EnableSwagger2
      public class SwaggerConfig {
          @Bean
          public Docket api() {
              return new Docket(DocumentationType.SWAGGER_2)
                  .select()
                  .apis(RequestHandlerSelectors.basePackage("com.example"))
                  .paths(PathSelectors.any())
                  .build()
                  .apiInfo(apiInfo());
          }
          
          private ApiInfo apiInfo() {
              return new ApiInfoBuilder()
                  .title("API文档")
                  .description("RESTful API文档")
                  .version("1.0.0")
                  .build();
          }
      }
      ```
    - 访问：http://localhost:8080/swagger-ui.html
  - **Swagger注解**
    ```java
    @Api(tags = "用户管理")
    @RestController
    @RequestMapping("/api/users")
    public class UserController {
        
        @ApiOperation("获取用户详情")
        @ApiResponses({
            @ApiResponse(code = 200, message = "成功"),
            @ApiResponse(code = 404, message = "用户不存在")
        })
        @GetMapping("/{id}")
        public User getById(
            @ApiParam("用户ID") @PathVariable Long id) {
            // ...
        }
    }
    ```
- **API测试工具（Postman）详解**
  - **Postman简介**
    - API测试工具
    - 支持HTTP/HTTPS
    - 支持环境变量
  - **Postman功能**
    - 请求构建
    - 集合（Collections）管理
    - 环境变量
    - 测试脚本
    - 自动化测试
  - **Postman测试脚本**
    ```javascript
    pm.test("Status code is 200", function () {
        pm.response.to.have.status(200);
    });
    
    pm.test("Response has username", function () {
        var jsonData = pm.response.json();
        pm.expect(jsonData.username).to.eql("test");
    });
    ```

#### CH09 前端独立开发和ES6异步请求深度解析
- **前端开发环境搭建详解**
  - **Node.js安装**
    - 官网：https://nodejs.org/
    - 验证安装：
      ```bash
      node -v
      npm -v
      ```
  - **npm（Node Package Manager）**
    - 初始化项目：
      ```bash
      npm init -y
      ```
    - 安装依赖：
      ```bash
      npm install axios
      npm install --save-dev webpack
      ```
    - 常用命令：
      ```bash
      npm install        # 安装所有依赖
      npm start          # 启动项目
      npm run build      # 构建项目
      npm test           # 运行测试
      ```
  - **yarn（替代npm）**
    ```bash
    yarn add axios
    yarn install
    yarn start
    ```
- **ES6特性详解**
  - **let和const**
    ```javascript
    let count = 0; // 可变
    const PI = 3.14; // 不可变
    ```
  - **箭头函数**
    ```javascript
    // 传统函数
    const add = function(a, b) {
        return a + b;
    };
    
    // 箭头函数
    const add = (a, b) => a + b;
    
    // 单参数
    const square = x => x * x;
    
    // 多行
    const sum = (a, b) => {
        const result = a + b;
        return result;
    };
    ```
  - **模板字符串**
    ```javascript
    const name = "World";
    const greeting = `Hello, ${name}!`;
    
    // 多行
    const html = `
      <div>
        <h1>Title</h1>
      </div>
    `;
    ```
  - **解构赋值**
    ```javascript
    // 数组解构
    const [a, b] = [1, 2];
    
    // 对象解构
    const { name, age } = user;
    const { name: username, age: userAge } = user;
    ```
  - **扩展运算符**
    ```javascript
    // 数组
    const arr1 = [1, 2, 3];
    const arr2 = [...arr1, 4, 5];
    
    // 对象
    const obj1 = { a: 1, b: 2 };
    const obj2 = { ...obj1, c: 3 };
    ```
  - **Promise**
    ```javascript
    const promise = new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve("Success");
        }, 1000);
    });
    
    promise
        .then(result => console.log(result))
        .catch(error => console.error(error))
        .finally(() => console.log("Done"));
    ```
  - **async/await**
    ```javascript
    async function fetchData() {
        try {
            const response = await fetch("/api/users");
            const data = await response.json();
            return data;
        } catch (error) {
            console.error(error);
        }
    }
    ```
- **异步请求详解**
  - **XMLHttpRequest**
    ```javascript
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "/api/users", true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const data = JSON.parse(xhr.responseText);
            console.log(data);
        }
    };
    xhr.send();
    ```
  - **Fetch API**
    ```javascript
    // GET
    fetch("/api/users")
        .then(response => response.json())
        .then(data => console.log(data));
    
    // POST
    fetch("/api/users", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: "test",
            email: "test@example.com"
        })
    })
        .then(response => response.json())
        .then(data => console.log(data));
    ```
  - **Axios**
    - 安装：
      ```bash
      npm install axios
      ```
    - 示例：
      ```javascript
      import axios from 'axios';
      
      // 创建实例
      const api = axios.create({
          baseURL: 'http://localhost:8080/api',
          timeout: 10000,
          headers: {
              'Content-Type': 'application/json'
          }
      });
      
      // 请求拦截器
      api.interceptors.request.use(
          config => {
              const token = localStorage.getItem('token');
              if (token) {
                  config.headers.Authorization = `Bearer ${token}`;
              }
              return config;
          },
          error => Promise.reject(error)
      );
      
      // 响应拦截器
      api.interceptors.response.use(
          response => response.data,
          error => {
              if (error.response?.status === 401) {
                  // 处理未认证
              }
              return Promise.reject(error);
          }
      );
      
      // GET
      api.get('/users', {
          params: { page: 1, size: 10 }
      });
      
      // POST
      api.post('/users', {
          username: 'test',
          email: 'test@example.com'
      });
      
      // PUT
      api.put('/users/1', {
          username: 'test',
          email: 'test@example.com'
      });
      
      // DELETE
      api.delete('/users/1');
      ```
- **前端模块化开发详解**
  - **为什么需要模块化**
    - 避免全局污染
    - 代码复用
    - 易于维护
    - 依赖管理
  - **模块化历史**
    - CommonJS（Node.js）
    - AMD（RequireJS）
    - CMD（Sea.js）
    - ES Modules（ES6+）

#### CH10 前端工程化与模块化深度解析
- **前端工程化的概念**
  - **什么是前端工程化**
    - 模块化
    - 组件化
    - 规范化
    - 自动化
  - **前端工程化内容**
    - 项目脚手架
    - 代码规范
    - 构建工具
    - 测试工具
    - 部署流程
- **Webpack详解**
  - **Webpack简介**
    - 模块打包器
    - 一切皆模块
  - **核心概念**
    - Entry：入口
    - Output：输出
    - Loader：模块转换器
    - Plugin：扩展插件
    - Mode：模式（development/production）
  - **webpack.config.js示例**
    ```javascript
    const path = require('path');
    const HtmlWebpackPlugin = require('html-webpack-plugin');
    const { CleanWebpackPlugin } = require('clean-webpack-plugin');
    
    module.exports = {
        entry: './src/index.js',
        output: {
            filename: 'bundle.[contenthash].js',
            path: path.resolve(__dirname, 'dist')
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader'
                    }
                },
                {
                    test: /\.css$/,
                    use: ['style-loader', 'css-loader']
                },
                {
                    test: /\.(png|jpg|gif)$/,
                    use: ['file-loader']
                }
            ]
        },
        plugins: [
            new CleanWebpackPlugin(),
            new HtmlWebpackPlugin({
                template: './src/index.html'
            })
        ],
        devServer: {
            contentBase: './dist',
            port: 3000,
            hot: true,
            proxy: {
                '/api': 'http://localhost:8080'
            }
        },
        mode: 'development'
    };
    ```
- **Babel详解**
  - **Babel简介**
    - JavaScript编译器
    - ES6+转ES5
  - **配置.babelrc**
    ```json
    {
        "presets": [
            ["@babel/preset-env", {
                "targets": {
                    "browsers": [">0.25%", "not dead"]
                }
            }]
        ],
        "plugins": []
    }
    ```
- **模块化详解**
  - **CommonJS**
    ```javascript
    // 导出
    module.exports = {
        add: (a, b) => a + b,
        subtract: (a, b) => a - b
    };
    
    // 导入
    const { add, subtract } = require('./math');
    ```
  - **ES Modules**
    ```javascript
    // 导出
    export const add = (a, b) => a + b;
    export const subtract = (a, b) => a - b;
    
    // 默认导出
    export default class Calculator {
        // ...
    }
    
    // 导入
    import { add, subtract } from './math';
    import Calculator from './Calculator';
    ```
- **前端构建工具对比**
  - **Webpack**：功能强大，配置复杂
  - **Vite**：新一代构建工具，开发体验好
  - **Rollup**：适合库开发
  - **Parcel**：零配置

#### CH11 前端框架技术简介深度解析
- **前端框架的发展**
  - **原生JavaScript**：复杂，繁琐
  - **jQuery**：DOM操作简化
  - **AngularJS**：第一代MVVM框架
  - **React**：组件化、虚拟DOM
  - **Vue.js**：渐进式、易上手
  - **Angular**：完整框架、TypeScript
- **Vue.js详解**
  - **Vue.js简介**
    - 渐进式JavaScript框架
    - 作者：尤雨溪
    - 特点：易用、灵活、高效
  - **核心概念**
    - **双向数据绑定**
      - v-model
      - 响应式系统
    - **组件化**
      - 单文件组件（SFC）
      - Props、Emit、Slots
  - **Vue 3示例**
    ```vue
    <!-- App.vue -->
    <template>
      <div>
        <h1>{{ title }}</h1>
        <input v-model="message" placeholder="输入消息" />
        <p>你输入的是: {{ message }}</p>
        <button @click="increment">计数: {{ count }}</button>
        <UserList :users="users" />
      </div>
    </template>
    
    <script setup>
    import { ref, reactive } from 'vue'
    import UserList from './components/UserList.vue'
    
    const title = ref('Vue 3 Demo')
    const message = ref('')
    const count = ref(0)
    const users = reactive([
        { id: 1, name: '张三' },
        { id: 2, name: '李四' }
    ])
    
    const increment = () => {
        count.value++
    }
    </script>
    
    <style scoped>
    h1 { color: #42b983; }
    </style>
    ```
  - **生命周期钩子**
    - onMounted
    - onUpdated
    - onUnmounted
- **React详解**
  - **React简介**
    - 用于构建用户界面的JavaScript库
    - 开发者：Facebook
    - 特点：组件化、虚拟DOM、单向数据流
  - **核心概念**
    - **虚拟DOM**
      - 内存中的DOM表示
      - Diff算法
      - 最小化DOM操作
    - **JSX**
      - JavaScript XML
      - 在JS中写HTML
    - **组件**
      - 函数组件
      - 类组件
  - **React示例**
    ```jsx
    // App.jsx
    import { useState, useEffect } from 'react'
    import UserList from './components/UserList'
    
    function App() {
        const [title, setTitle] = useState('React Demo')
        const [message, setMessage] = useState('')
        const [count, setCount] = useState(0)
        const [users, setUsers] = useState([])
        
        useEffect(() => {
            fetch('/api/users')
                .then(res => res.json())
                .then(data => setUsers(data))
        }, [])
        
        const increment = () => {
            setCount(count + 1)
        }
        
        return (
            <div>
                <h1>{title}</h1>
                <input 
                    value={message} 
                    onChange={e => setMessage(e.target.value)}
                    placeholder="输入消息"
                />
                <p>你输入的是: {message}</p>
                <button onClick={increment}>
                    计数: {count}
                </button>
                <UserList users={users} />
            </div>
        )
    }
    
    export default App
    ```
  - **Hooks**
    - useState
    - useEffect
    - useContext
    - useReducer
    - useCallback
    - useMemo
- **Angular详解**
  - **Angular简介**
    - 完整的Web应用框架
    - 开发者：Google
    - 特点：TypeScript、依赖注入、完整工具链
  - **核心概念**
    - **TypeScript**
      - JavaScript超集
      - 类型系统
    - **依赖注入**
      - 模块化
      - 可测试
    - **组件和模板**
      - @Component
      - 模板语法
  - **Angular示例**
    ```typescript
    // app.component.ts
    import { Component, OnInit } from '@angular/core'
    import { UserService } from './user.service'
    
    @Component({
        selector: 'app-root',
        template: `
            <div>
                <h1>{{ title }}</h1>
                <input [(ngModel)]="message" placeholder="输入消息" />
                <p>你输入的是: {{ message }}</p>
                <button (click)="increment()">计数: {{ count }}</button>
                <ul>
                    <li *ngFor="let user of users">{{ user.name }}</li>
                </ul>
            </div>
        `
    })
    export class AppComponent implements OnInit {
        title = 'Angular Demo'
        message = ''
        count = 0
        users = []
        
        constructor(private userService: UserService) {}
        
        ngOnInit() {
            this.userService.getUsers().subscribe(data => {
                this.users = data
            })
        }
        
        increment() {
            this.count++
        }
    }
    ```
- **各框架的比较**
  | 特性 | Vue.js | React | Angular |
  |------|--------|-------|---------|
  | 学习曲线 | 低 | 中 | 高 |
  | 灵活性 | 高 | 高 | 低 |
  | 类型安全 | 可选（TypeScript） | 可选（TypeScript） | 内置（TypeScript） |
  | 生态 | 丰富 | 最丰富 | 丰富 |
  | 企业级 | 好 | 好 | 最佳 |
  | 性能 | 优秀 | 优秀 | 优秀 |

#### CH12 前端框架技术进阶深度解析
- **组件化开发详解**
  - **组件设计原则**
    - 单一职责
    - 可复用性
    - 可维护性
    - 可测试性
  - **组件通信**
    - 父子组件通信：Props / Events
    - 兄弟组件通信：EventBus / 状态管理
    - 跨层级通信：Provide/Inject / Context
- **状态管理详解**
  - **为什么需要状态管理**
    - 共享状态
    - 状态变化可预测
    - 时间旅行调试
  - **Vuex（Vue）详解**
    - **核心概念**
      - State：状态
      - Getters：派生状态
      - Mutations：同步变更
      - Actions：异步操作
      - Modules：模块化
    - **Vuex示例**
      ```javascript
      // store/index.js
      import { createStore } from 'vuex'
      
      export default createStore({
          state: {
              count: 0,
              users: []
          },
          getters: {
              doubleCount: state => state.count * 2
          },
          mutations: {
              INCREMENT(state) {
                  state.count++
              },
              SET_USERS(state, users) {
                  state.users = users
              }
          },
          actions: {
              async fetchUsers({ commit }) {
                  const res = await fetch('/api/users')
                  const data = await res.json()
                  commit('SET_USERS', data)
              }
          }
      })
      
      // 使用
      import { useStore } from 'vuex'
      
      const store = useStore()
      const count = computed(() => store.state.count)
      const doubleCount = computed(() => store.getters.doubleCount)
      
      const increment = () => {
          store.commit('INCREMENT')
      }
      ```
  - **Pinia（Vue 3推荐）详解**
    ```javascript
    // stores/user.js
    import { defineStore } from 'pinia'
    
    export const useUserStore = defineStore('user', {
        state: () => ({
            count: 0,
            users: []
        }),
        getters: {
            doubleCount: (state) => state.count * 2
        },
        actions: {
            increment() {
                this.count++
            },
            async fetchUsers() {
                const res = await fetch('/api/users')
                this.users = await res.json()
            }
        }
    })
    
    // 使用
    const userStore = useUserStore()
    console.log(userStore.count)
    userStore.increment()
    ```
  - **Redux（React）详解**
    - **核心概念**
      - Store：单一数据源
      - State：只读
      - Reducer：纯函数
      - Action：描述变化
      - Dispatch：触发变化
    - **Redux示例**
      ```javascript
      // reducer.js
      const initialState = { count: 0, users: [] }
      
      function reducer(state = initialState, action) {
          switch (action.type) {
              case 'INCREMENT':
                  return { ...state, count: state.count + 1 }
              case 'SET_USERS':
                  return { ...state, users: action.payload }
              default:
                  return state
          }
      }
      
      // store.js
      import { createStore } from 'redux'
      import reducer from './reducer'
      
      const store = createStore(reducer)
      
      // 使用
      import { useSelector, useDispatch } from 'react-redux'
      
      function Counter() {
          const count = useSelector(state => state.count)
          const dispatch = useDispatch()
          
          return (
              <div>
                  <span>{count}</span>
                  <button onClick={() => dispatch({ type: 'INCREMENT' })}>
                      +
                  </button>
              </div>
          )
      }
      ```
  - **Redux Toolkit（推荐）**
    ```javascript
    import { createSlice, configureStore } from '@reduxjs/toolkit'
    
    const counterSlice = createSlice({
        name: 'counter',
        initialState: { count: 0 },
        reducers: {
            increment: state => { state.count++ },
            decrement: state => { state.count-- }
        }
    })
    
    const store = configureStore({
        reducer: {
            counter: counterSlice.reducer
        }
    })
    ```
- **路由详解**
  - **Vue Router详解**
    ```javascript
    // router/index.js
    import { createRouter, createWebHistory } from 'vue-router'
    import Home from '../views/Home.vue'
    import About from '../views/About.vue'
    
    const routes = [
        { path: '/', name: 'Home', component: Home },
        { path: '/about', name: 'About', component: About },
        { 
            path: '/user/:id', 
            name: 'User', 
            component: () => import('../views/User.vue') 
        }
    ]
    
    const router = createRouter({
        history: createWebHistory(),
        routes
    })
    
    export default router
    
    // 使用
    import { useRouter, useRoute } from 'vue-router'
    
    const router = useRouter()
    const route = useRoute()
    
    // 导航
    router.push('/about')
    router.push({ name: 'User', params: { id: 1 } })
    
    // 获取参数
    const userId = route.params.id
    ```
  - **React Router详解**
    ```jsx
    // App.jsx
    import { BrowserRouter, Routes, Route, Link, useParams, useNavigate } from 'react-router-dom'
    import Home from './Home'
    import About from './About'
    import User from './User'
    
    function App() {
        return (
            <BrowserRouter>
                <nav>
                    <Link to="/">首页</Link>
                    <Link to="/about">关于</Link>
                </nav>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/user/:id" element={<User />} />
                </Routes>
            </BrowserRouter>
        )
    }
    
    // User.jsx
    function User() {
        const { id } = useParams()
        const navigate = useNavigate()
        
        return (
            <div>
                <h1>用户 {id}</h1>
                <button onClick={() => navigate('/')}>返回</button>
            </div>
        )
    }
    ```
- **服务端渲染（SSR）详解**
  - **什么是SSR**
    - 服务端渲染HTML
    - 首次加载快
    - SEO友好
  - **SSR vs CSR**
    | 特性 | SSR | CSR |
    |------|-----|-----|
    | 首屏加载 | 快 | 慢 |
    | SEO | 友好 | 不友好 |
    | 服务器压力 | 大 | 小 |
    | 开发复杂度 | 高 | 低 |
  - **Vue SSR框架：Nuxt.js**
  - **React SSR框架：Next.js**
  - **Angular SSR：Angular Universal**
- **前端性能优化详解**
  - **加载性能优化**
    - 代码分割
    - 懒加载
    - 资源压缩
    - CDN加速
    - 缓存策略
  - **运行时性能优化**
    - 减少DOM操作
    - 虚拟列表
    - 防抖和节流
    - Web Workers
    - 使用requestAnimationFrame
  - **性能监控**
    - Lighthouse
    - Web Vitals
    - Performance API
  - **Vue性能优化**
    - v-once
    - v-memo
    - 计算属性缓存
    - 函数式组件
  - **React性能优化**
    - memo
    - useMemo
    - useCallback
    - 虚拟列表（react-window）

## 二、学习重点

### 核心技能
- 掌握Spring框架核心机制（IoC/AOP）
- 理解MVC设计模式和Spring MVC工作原理
- 掌握Maven项目管理和依赖管理
- 掌握MyBatis数据库访问框架
- 了解前后端分离开发模式
- 能够开发完整的Web应用

### 重点技术
- **CH01**：框架技术分类、侵入性、Spring MVC工作原理、Maven
- **CH02 Spring IoC**：依赖注入和Bean管理
- **CH06 MyBatis**：数据库访问和动态SQL
- **CH07 前后端分离**：RESTful API设计
- **CH11 前端框架**：Vue.js或React的使用

## 三、学习建议

### 实践建议
1. **Maven项目**：使用Maven创建和管理项目，掌握依赖配置
2. **Spring Boot项目**：创建Spring Boot项目，学习自动配置和项目结构
3. **数据库访问**：使用MyBatis实现数据库操作
4. **API设计**：设计和实现RESTful API
5. **前端开发**：学习Vue.js或React，实现前端界面
6. **全栈开发**：完成一个完整的前后端分离项目

### 学习资源
- **书籍**：《Spring实战》、《MyBatis从入门到精通》、《Maven实战》
- **在线资源**：Spring官方文档、Vue.js官方文档、React官方文档、Maven官方文档
- **工具推荐**：IntelliJ IDEA、VS Code、Postman、Maven

### 学习路径
1. **基础阶段**：学习Maven、Spring IoC和AOP
2. **进阶阶段**：学习Spring MVC和MyBatis
3. **应用阶段**：学习前后端分离和前端框架

## 四、常见问题与解决方案

### Spring配置问题
- **问题**：依赖注入失败
  **解决**：检查Bean的配置，确保依赖关系正确

### 数据库访问问题
- **问题**：SQL执行错误
  **解决**：检查SQL语句，使用MyBatis的日志功能查看生成的SQL

### API设计问题
- **问题**：API设计不规范
  **解决**：遵循RESTful API设计原则，使用Swagger生成API文档

### 前端开发问题
- **问题**：前端构建失败
  **解决**：检查webpack配置，确保依赖正确安装

### Maven问题
- **问题**：依赖下载失败
  **解决**：检查Maven仓库配置，确认网络连接，配置阿里云镜像

## 五、总结

软件开发架构平台是计算机专业的重要课程，掌握现代软件开发架构和框架对于开发高质量的软件系统至关重要。通过系统学习和实践，你将能够：

1. 掌握Spring框架核心机制
2. 理解MVC设计模式和RESTful API设计
3. 掌握Maven项目管理
4. 掌握MyBatis数据库访问框架
5. 了解前后端分离开发模式
6. 开发完整的Web应用

建议在学习过程中注重理论与实践相结合，通过实际项目加深对知识点的理解，为后续的专业学习和工作打下坚实的基础。

---

## 六、速记宝典（口诀 + 对比表 + 架构速查）

### 6.1 框架技术总体速记

**架构分层**：「**表业务持久**」

| 层 | 职责 | 框架 |
|------|------|------|
| 表示层 | 接收请求，返回响应 | Spring MVC, Struts2 |
| 业务层 | 业务逻辑处理 | Spring (IoC/AOP) |
| 持久层 | 数据库访问 | MyBatis, Hibernate, JPA |

**经典技术栈演变**：
- SSH = **S**truts2 + **S**pring + **H**ibernate（老一代）
- SSM = **S**pring MVC + **S**pring + **M**yBatis（经典）
- SSM+ = **S**pring Boot + **S**pring MVC + **M**yBatis（现代主流）

**框架侵入性**：
| 侵入性 | 特点 | 例子 |
|:--:|------|------|
| 高 | 必须继承框架类，脱离框架无法运行 | Struts 1.x |
| 低 | 通过注解/配置注入，脱离仍可运行 | Spring, MyBatis |
| 记忆 | **"高侵入=绑死了"** | **"低侵入=松耦合"** |

---

### 6.2 Spring IoC（控制反转）速记

**IoC核心思想**：「**我不创建，你来注入**」

传统方式 vs IoC：
```java
// 传统：自己new，高耦合
UserDao dao = new UserDaoImpl();

// IoC：容器注入，低耦合
@Autowired
UserDao dao;  // Spring帮你注入
```

**DI（依赖注入）三种方式**：
| 方式 | 注解 | 场景 | 记忆 |
|------|------|------|------|
| 构造器注入 | `@Autowired` 在构造器上 | 必须的依赖 | **"生来就有"** |
| Setter注入 | `@Autowired` 在setter上 | 可选的依赖 | **"后来给的"** |
| 字段注入 | `@Autowired` 在字段上 | 最常用最简单 | **"直接塞"** |

**Bean的作用域**：
| 作用域 | 含义 | 记忆 |
|--------|------|------|
| singleton | 整个容器只有一个实例 | **"单例，默认"** |
| prototype | 每次获取都创建新实例 | **"每次都新"** |
| request | 每个HTTP请求一个 | **"一次请求"** |
| session | 每个HTTP会话一个 | **"一次会话"** |

**注解速记**：
- `@Component` → 普通Bean
- `@Service` → 业务层Bean
- `@Repository` → 持久层Bean
- `@Controller` → 控制器Bean
- `@Autowired` → 自动注入
- 记忆：**"四注解分角色，一注解做注入"**

---

### 6.3 Spring AOP（面向切面编程）速记

**AOP核心概念**：
| 概念 | 含义 | 类比 |
|------|------|------|
| Aspect（切面） | 横切关注点的模块化 | 日志模块 |
| Join Point（连接点） | 程序执行中的点 | 方法调用处 |
| Advice（通知） | 在连接点做什么 | 记录日志的代码 |
| Pointcut（切点） | 匹配连接点的表达式 | "所有Service方法" |
| Weaving（织入） | 将切面应用到目标对象 | 组合在一起 |

**五种通知类型**：「**前、后、返、异、环**」

| 通知 | 注解 | 执行时机 |
|------|------|------|
| 前置通知 | `@Before` | 方法执行前 |
| 后置通知 | `@After` | 方法执行后（不论成功失败） |
| 返回通知 | `@AfterReturning` | 方法成功返回后 |
| 异常通知 | `@AfterThrowing` | 方法抛异常后 |
| 环绕通知 | `@Around` | 前后都管（最强） |

- 记忆：**"前Before，后After，返Returning，异Throwing，环Around"**

**AOP典型应用场景**：日志、事务、权限检查、性能监控
- 记忆：**"横切关注点：日志事务权限监控"**

---

### 6.4 Spring MVC速记

**MVC处理流程**：「**前→映→控→视→响**」
```
请求 → DispatcherServlet(前端控制器)
     → HandlerMapping(处理器映射，找URL对应的Controller)
     → Controller(处理请求，调用业务)
     → ModelAndView(返回数据+视图名)
     → ViewResolver(视图解析，找到具体视图)
     → View(渲染响应)
     → 返回给用户
```

**MVC常用注解**：
| 注解 | 含义 |
|------|------|
| `@Controller` | 标记为控制器 |
| `@RestController` | = @Controller + @ResponseBody（返回JSON） |
| `@RequestMapping` | 映射URL路径 |
| `@GetMapping/@PostMapping` | 映射GET/POST请求 |
| `@RequestParam` | 获取请求参数 |
| `@PathVariable` | 获取路径变量 |
| `@RequestBody` | 获取请求体（JSON→对象） |

---

### 6.5 MyBatis速记

**MyBatis核心**：「**XML写SQL，接口绑定**」

```java
// Mapper接口
@Mapper
public interface UserMapper {
    User findById(Long id);
}

// XML映射文件
<select id="findById" resultType="User">
    SELECT * FROM user WHERE id = #{id}
</select>
```

**#{} vs ${}**：
| | `#{}` | `${}` |
|---|-------|-------|
| 处理方式 | 预编译占位符(?) | 直接拼接字符串 |
| SQL注入 | 安全 ✅ | 危险 ❌ |
| 使用场景 | 参数值 | 表名/列名（动态） |
| 记忆 | **"#安全，万能选#"** | **"$拼接，有风险"** |

**MyBatis vs Hibernate/JPA**：
| | MyBatis | Hibernate/JPA |
|---|---------|--------------|
| 类型 | SQL映射框架 | ORM全自动框架 |
| SQL控制 | 自己写SQL | 自动生成SQL |
| 灵活性 | 高 | 中 |
| 学习曲线 | 低 | 高 |
| 适用 | SQL密集型应用 | CRUD常规操作 |
| 记忆 | **"半自动，方向盘在手"** | **"全自动，上车就行"** |

---

### 6.6 RESTful API速记

**RESTful核心原则**：「**URL表资源，动词用方法**」

| HTTP方法 | 操作 | SQL类比 |
|:--:|------|------|
| GET | 获取资源 | SELECT |
| POST | 创建资源 | INSERT |
| PUT | 更新资源（全量） | UPDATE |
| PATCH | 更新资源（部分） | UPDATE（部分） |
| DELETE | 删除资源 | DELETE |

**URL设计规范**：
- ✅ `GET /api/users/1`（获取用户1）
- ✅ `POST /api/users`（创建用户）
- ❌ `GET /api/getUser?id=1`（动词放URL里不对）
- 记忆：**"URL用名词复数，操作靠HTTP动词"**

**HTTP状态码速记**：
| 范围 | 含义 | 常用 |
|------|------|------|
| 2xx | 成功 | 200 OK, 201 Created |
| 3xx | 重定向 | 301 永久, 302 临时 |
| 4xx | 客户端错误 | 400 请求错, 401 未认证, 403 禁止, 404 未找到 |
| 5xx | 服务器错误 | 500 内部错误 |

---

### 6.7 Maven速记

**Maven核心**：「**POM管依赖，三坐标定唯一**」

**坐标三要素**：`groupId:artifactId:version`
```
<groupId>com.example</groupId>     // 组织
<artifactId>my-app</artifactId>    // 项目名
<version>1.0.0</version>          // 版本号
```

**Maven仓库搜索顺序**：`本地 → 私服 → 中央`
- 记忆：**"先家找，后公司找，再上网找"**

**Maven命令**：「**清编测打安部**」
| 命令 | 功能 |
|------|------|
| `mvn clean` | 清理target |
| `mvn compile` | 编译源码 |
| `mvn test` | 运行测试 |
| `mvn package` | 打包(jar/war) |
| `mvn install` | 安装到本地仓库 |
| `mvn deploy` | 部署到远程仓库 |

---

### 6.8 各章一句话核心

| 章节 | 一句话核心 |
|------|-----------|
| CH01 框架概述 | 架构分三层（表/业务/持久），SSM是Java开发标配 |
| CH02 Spring IoC | 控制反转：不自己new，让容器给你注入 |
| CH03 Spring AOP | 横切关注点（日志/事务）从业务代码中剥离 |
| CH04 Spring MVC | 前端控制器分发→Controller处理→视图渲染返回 |
| CH05 Spring Boot | 约定大于配置，自动配置开箱即用 |
| CH06 MyBatis | XML写SQL+接口绑定，#{}防注入，半自动ORM |
| CH07-08 RESTful API | URL定位资源，HTTP方法定操作，JSON传输数据 |
| CH09-10 前端 | ES6异步+模块化，前后端分离成主流 |
| CH11-12 前端框架 | Vue/React：组件化+响应式+虚拟DOM |

---

### 6.9 高频易错点

1. **IoC≠DI**：IoC是思想（控制反转），DI是实现方式（依赖注入）
2. **MyBatis的#{}和${}区别**：#预编译安全，$直接拼接有SQL注入风险
3. **RESTful URL用名词复数，动作靠HTTP方法**，不要在URL里写动词
4. **@RestController = @Controller + @ResponseBody**（每个方法都返回JSON）
5. **Spring Boot自动配置≠不用配置**，核心配置仍在application.yml
6. **Maven的package打jar，install才放到本地仓库**