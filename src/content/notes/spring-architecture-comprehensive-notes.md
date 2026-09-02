---
title: "软件开发架构平台综合笔记"
date: "2025-06"
type: "learning"
tags: [Spring, SpringBoot, MyBatis, RESTful, Vue, 综合笔记]
summary: "软件开发架构平台全课程综合整理笔记，串联各章知识点形成完整知识体系"
---

# 软件开发架构平台综合笔记

## 一、开发架构与框架技术概述
### 1.1 软件架构
- **软件架构**：是有关软件整体结构与组件的抽象描述，用于指导大型软件系统各个方面的设计
- **架构的作用**：
  1. 重用设计和代码
  2. 提高开发效率
  3. 提高系统质量
  4. 降低维护成本

### 1.2 常见的软件架构模式
1. **分层架构**：
   - 表示层
   - 业务逻辑层
   - 数据访问层
   - 数据层

2. **MVC模式**：
   - Model（模型）
   - View（视图）
   - Controller（控制器）

3. **MVVM模式**：
   - Model
   - View
   - ViewModel

4. **微服务架构**：
   - 将应用拆分为多个独立的服务
   - 每个服务独立部署、独立扩展

### 1.3 框架
- **框架**：是一个可复用的设计构件，它规定了应用的体系结构，阐明了整个设计、协作构件之间的依赖关系、责任分配和控制流程
- **框架的特点**：
  - 半成品
  - 提供通用功能
  - 可扩展
  - 规定架构

### 1.4 库与框架的区别
- **库**：
  - 是一组可以被调用的函数
  - 你调用库
  - 控制在你手中

- **框架**：
  - 是一个骨架
  - 框架调用你
  - 控制在框架手中

### 1.5 常见的Java开发框架
1. **Spring**：企业级应用开发框架
2. **Spring Boot**：快速开发框架
3. **Spring MVC**：Web框架
4. **MyBatis**：持久层框架
5. **Hibernate**：持久层框架
6. **Struts2**：Web框架（较老）

## 二、Spring IoC原理和实现
### 2.1 IoC概述
- **IoC（Inversion of Control）**：控制反转
- **DI（Dependency Injection）**：依赖注入
- **核心思想**：
  - 将对象的创建和依赖关系的管理交给容器
  - 而不是由对象自己管理

### 2.2 IoC的优点
1. **降低耦合度**
2. **提高可测试性**
3. **提高可维护性**
4. **提高可扩展性**

### 2.3 IoC的实现方式
1. **构造器注入**
2. **Setter注入**
3. **接口注入**

### 2.4 Spring IoC容器
1. **BeanFactory**：
   - Spring的基础容器
   - 延迟初始化

2. **ApplicationContext**：
   - BeanFactory的子接口
   - 功能更强大
   - 立即初始化
   - 常用实现：
     - ClassPathXmlApplicationContext
     - FileSystemXmlApplicationContext
     - AnnotationConfigApplicationContext

### 2.5 Bean的配置
1. **XML配置**：
   ```xml
   <bean id="userService" class="com.example.UserService">
       <property name="userDao" ref="userDao"/>
   </bean>
   <bean id="userDao" class="com.example.UserDaoImpl"/>
   ```

2. **注解配置**：
   - @Component：通用组件
   - @Service：业务层
   - @Repository：数据访问层
   - @Controller：控制层
   - @Autowired：自动装配
   - @Qualifier：指定Bean名称

3. **Java配置**：
   ```java
   @Configuration
   public class AppConfig {
       @Bean
       public UserService userService() {
           UserService userService = new UserService();
           userService.setUserDao(userDao());
           return userService;
       }

       @Bean
       public UserDao userDao() {
           return new UserDaoImpl();
       }
   }
   ```

### 2.6 Bean的作用域
1. **singleton**：单例，默认
2. **prototype**：原型，每次请求创建新实例
3. **request**：HTTP请求
4. **session**：HTTP会话
5. **application**：ServletContext
6. **websocket**：WebSocket

### 2.7 Bean的生命周期
1. **实例化**
2. **属性赋值**
3. **BeanNameAware**
4. **BeanFactoryAware**
5. **ApplicationContextAware**
6. **BeanPostProcessor前置处理**
7. **InitializingBean**
8. **init-method**
9. **BeanPostProcessor后置处理**
10. **使用Bean**
11. **DisposableBean**
12. **destroy-method**

## 三、Spring AOP原理和实现
### 3.1 AOP概述
- **AOP（Aspect-Oriented Programming）**：面向切面编程
- **核心思想**：
  - 将横切关注点从业务逻辑中分离出来
  - 提高代码的模块化程度

### 3.2 AOP的核心概念
1. **Aspect（切面）**：横切关注点的模块化
2. **Join Point（连接点）**：程序执行过程中的某个特定点
3. **Advice（通知）**：在切面的某个特定连接点上执行的动作
4. **Pointcut（切入点）**：匹配连接点的断言
5. **Introduction（引介）**：为类型添加额外的方法或字段
6. **Target Object（目标对象）**：被一个或多个切面通知的对象
7. **AOP Proxy（AOP代理）**：AOP框架创建的对象
8. **Weaving（织入）**：把切面连接到其他应用程序类型或对象上

### 3.3 Advice的类型
1. **Before**：前置通知，在方法执行前执行
2. **After Returning**：返回通知，在方法正常返回后执行
3. **After Throwing**：异常通知，在方法抛出异常后执行
4. **After**：后置通知，在方法执行后（无论成功或失败）执行
5. **Around**：环绕通知，包围一个方法的执行

### 3.4 Spring AOP的实现
1. **基于XML配置**：
   ```xml
   <aop:config>
       <aop:aspect id="logAspect" ref="logAspect">
           <aop:pointcut id="servicePointcut" 
               expression="execution(* com.example.service.*.*(..))"/>
           <aop:before pointcut-ref="servicePointcut" method="before"/>
           <aop:after-returning pointcut-ref="servicePointcut" method="afterReturning"/>
       </aop:aspect>
   </aop:config>
   ```

2. **基于注解配置**：
   ```java
   @Aspect
   @Component
   public class LogAspect {
       @Pointcut("execution(* com.example.service.*.*(..))")
       public void servicePointcut() {}

       @Before("servicePointcut()")
       public void before(JoinPoint joinPoint) {
           System.out.println("Before: " + joinPoint.getSignature().getName());
       }

       @AfterReturning(pointcut = "servicePointcut()", returning = "result")
       public void afterReturning(JoinPoint joinPoint, Object result) {
           System.out.println("After returning: " + result);
       }
   }
   ```

### 3.5 切入点表达式
- **execution**：匹配方法执行
- **within**：匹配特定类型
- **this**：匹配代理对象
- **target**：匹配目标对象
- **args**：匹配参数
- **@target**：匹配有特定注解的目标对象
- **@args**：匹配有特定注解的参数
- **@within**：匹配有特定注解的类型
- **@annotation**：匹配有特定注解的方法

### 3.6 代理方式
1. **JDK动态代理**：
   - 基于接口
   - 要求目标类实现接口

2. **CGLIB代理**：
   - 基于继承
   - 不要求目标类实现接口

## 四、Spring MVC
### 4.1 Spring MVC概述
- **Spring MVC**：基于Spring的Web框架
- **核心思想**：MVC模式

### 4.2 Spring MVC的工作流程
1. **DispatcherServlet**：前端控制器，接收所有请求
2. **HandlerMapping**：处理器映射器，找到对应的Handler
3. **HandlerAdapter**：处理器适配器，执行Handler
4. **Controller**：控制器，处理业务逻辑
5. **ModelAndView**：模型和视图
6. **ViewResolver**：视图解析器，解析视图
7. **View**：视图，渲染页面

### 4.3 Spring MVC的配置
1. **web.xml配置**：
   ```xml
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
   ```

2. **Spring MVC配置**：
   ```xml
   <context:component-scan base-package="com.example.controller"/>
   <mvc:annotation-driven/>
   <bean class="org.springframework.web.servlet.view.InternalResourceViewResolver">
       <property name="prefix" value="/WEB-INF/views/"/>
       <property name="suffix" value=".jsp"/>
   </bean>
   ```

### 4.4 Controller的开发
1. **基于注解的Controller**：
   ```java
   @Controller
   @RequestMapping("/user")
   public class UserController {

       @Autowired
       private UserService userService;

       @RequestMapping("/list")
       public String list(Model model) {
           List<User> users = userService.findAll();
           model.addAttribute("users", users);
           return "user/list";
       }

       @RequestMapping("/add")
       public String add(@ModelAttribute User user) {
           userService.save(user);
           return "redirect:/user/list";
       }

       @RequestMapping("/delete/{id}")
       public String delete(@PathVariable Long id) {
           userService.delete(id);
           return "redirect:/user/list";
       }
   }
   ```

2. **常用注解**：
   - @Controller
   - @RequestMapping
   - @GetMapping
   - @PostMapping
   - @PutMapping
   - @DeleteMapping
   - @RequestParam
   - @PathVariable
   - @RequestBody
   - @ResponseBody
   - @ModelAttribute
   - @SessionAttribute

### 4.5 参数绑定
1. **简单类型参数**：
   - String、int、long等
   - @RequestParam

2. **对象类型参数**：
   - @ModelAttribute

3. **路径变量**：
   - @PathVariable

4. **JSON参数**：
   - @RequestBody

5. **文件上传**：
   - MultipartFile

### 4.6 返回值处理
1. **String**：视图名
2. **ModelAndView**：模型和视图
3. **void**：根据请求路径找视图
4. **@ResponseBody**：直接返回数据

## 五、Spring Boot和ORM简介
### 5.1 Spring Boot概述
- **Spring Boot**：快速开发Spring应用的框架
- **特点**：
  - 独立运行
  - 内嵌Servlet容器
  - 提供starter简化依赖配置
  - 自动配置Spring
  - 提供生产级功能
  - 无需XML配置

### 5.2 Spring Boot的核心
1. **起步依赖（Starter）**：
   - spring-boot-starter-web
   - spring-boot-starter-data-jpa
   - spring-boot-starter-data-redis
   - spring-boot-starter-security

2. **自动配置（Auto-configuration）**：
   - 根据类路径自动配置Spring
   - @SpringBootApplication
   - @EnableAutoConfiguration

3. **内嵌服务器**：
   - Tomcat（默认）
   - Jetty
   - Undertow

### 5.3 Spring Boot的使用
1. **创建Spring Boot应用**：
   ```java
   @SpringBootApplication
   public class Application {
       public static void main(String[] args) {
           SpringApplication.run(Application.class, args);
       }
   }
   ```

2. **配置文件**：
   - application.properties
   - application.yml
   ```yaml
   server:
     port: 8080
   spring:
     datasource:
       url: jdbc:mysql://localhost:3306/mydb
       username: root
       password: 123456
   ```

### 5.4 ORM概述
- **ORM（Object-Relational Mapping）**：对象关系映射
- **作用**：
  - 将Java对象映射到数据库表
  - 自动生成SQL
  - 简化数据访问

### 5.5 常见的ORM框架
1. **Hibernate**：
   - 功能强大
   - 全自动
   - 学习曲线较陡

2. **MyBatis**：
   - 灵活
   - SQL可控
   - 半自动

3. **Spring Data JPA**：
   - 基于Hibernate
   - 简化CRUD操作
   - 方法名查询

## 六、MyBatis
### 6.1 MyBatis概述
- **MyBatis**：优秀的持久层框架
- **特点**：
  - SQL和Java代码分离
  - 灵活的SQL映射
  - 动态SQL
  - 结果映射

### 6.2 MyBatis的核心概念
1. **SqlSessionFactory**：创建SqlSession的工厂
2. **SqlSession**：执行SQL的会话
3. **Mapper**：映射器接口
4. **XML映射文件**：定义SQL语句

### 6.3 MyBatis的配置
1. **mybatis-config.xml**：
   ```xml
   <configuration>
       <environments default="development">
           <environment id="development">
               <transactionManager type="JDBC"/>
               <dataSource type="POOLED">
                   <property name="driver" value="com.mysql.cj.jdbc.Driver"/>
                   <property name="url" value="jdbc:mysql://localhost:3306/mydb"/>
                   <property name="username" value="root"/>
                   <property name="password" value="123456"/>
               </dataSource>
           </environment>
       </environments>
       <mappers>
           <mapper resource="com/example/mapper/UserMapper.xml"/>
       </mappers>
   </configuration>
   ```

2. **与Spring整合**：
   ```java
   @Configuration
   @MapperScan("com.example.mapper")
   public class MyBatisConfig {
       @Bean
       public SqlSessionFactory sqlSessionFactory(DataSource dataSource) throws Exception {
           SqlSessionFactoryBean sessionFactory = new SqlSessionFactoryBean();
           sessionFactory.setDataSource(dataSource);
           return sessionFactory.getObject();
       }
   }
   ```

### 6.4 MyBatis的映射
1. **Mapper接口**：
   ```java
   public interface UserMapper {
       User findById(Long id);
       List<User> findAll();
       void insert(User user);
       void update(User user);
       void delete(Long id);
   }
   ```

2. **XML映射文件**：
   ```xml
   <mapper namespace="com.example.mapper.UserMapper">
       <select id="findById" resultType="com.example.entity.User">
           SELECT * FROM user WHERE id = #{id}
       </select>
       
       <select id="findAll" resultType="com.example.entity.User">
           SELECT * FROM user
       </select>
       
       <insert id="insert" parameterType="com.example.entity.User">
           INSERT INTO user(username, password) VALUES(#{username}, #{password})
       </insert>
       
       <update id="update" parameterType="com.example.entity.User">
           UPDATE user SET username = #{username}, password = #{password} WHERE id = #{id}
       </update>
       
       <delete id="delete" parameterType="java.lang.Long">
           DELETE FROM user WHERE id = #{id}
       </delete>
   </mapper>
   ```

### 6.5 动态SQL
1. **if**：
   ```xml
   <select id="findByCondition" resultType="com.example.entity.User">
       SELECT * FROM user
       <where>
           <if test="username != null">
               AND username LIKE #{username}
           </if>
           <if test="email != null">
               AND email = #{email}
           </if>
       </where>
   </select>
   ```

2. **choose/when/otherwise**：
   ```xml
   <select id="findByCondition" resultType="com.example.entity.User">
       SELECT * FROM user
       <where>
           <choose>
               <when test="username != null">
                   AND username LIKE #{username}
               </when>
               <when test="email != null">
                   AND email = #{email}
               </when>
               <otherwise>
                   AND 1=1
               </otherwise>
           </choose>
       </where>
   </select>
   ```

3. **trim/where/set**：
   ```xml
   <update id="update" parameterType="com.example.entity.User">
       UPDATE user
       <set>
           <if test="username != null">username = #{username},</if>
           <if test="email != null">email = #{email},</if>
       </set>
       WHERE id = #{id}
   </update>
   ```

4. **foreach**：
   ```xml
   <select id="findByIds" resultType="com.example.entity.User">
       SELECT * FROM user
       WHERE id IN
       <foreach collection="list" item="id" open="(" separator="," close=")">
           #{id}
       </foreach>
   </select>
   ```

### 6.6 结果映射
```xml
<resultMap id="userResultMap" type="com.example.entity.User">
    <id property="id" column="id"/>
    <result property="username" column="username"/>
    <result property="password" column="password"/>
</resultMap>

<select id="findById" resultMap="userResultMap">
    SELECT * FROM user WHERE id = #{id}
</select>
```

## 七、前后端分离和RESTful API
### 7.1 前后端分离
- **前后端分离**：前端和后端独立开发和部署
- **优点**：
  - 前后端并行开发
  - 前端可独立部署
  - 更好的用户体验
  - 支持多端

### 7.2 RESTful API
- **REST（Representational State Transfer）**：表述性状态转移
- **RESTful API**：符合REST架构风格的API
- **特点**：
  - 资源导向
  - 使用HTTP方法
  - 无状态
  - 统一接口

### 7.3 HTTP方法的使用
1. **GET**：获取资源
2. **POST**：创建资源
3. **PUT**：更新资源（全量）
4. **PATCH**：更新资源（部分）
5. **DELETE**：删除资源

### 7.4 URI设计
1. **使用名词**：/users，/orders
2. **使用复数**：/users，不是/user
3. **层级关系**：/users/{id}/orders
4. **版本控制**：/api/v1/users

### 7.5 HTTP状态码
1. **2xx**：成功
   - 200 OK：成功
   - 201 Created：创建成功
   - 204 No Content：成功但无内容

2. **4xx**：客户端错误
   - 400 Bad Request：请求错误
   - 401 Unauthorized：未授权
   - 403 Forbidden：禁止访问
   - 404 Not Found：未找到

3. **5xx**：服务器错误
   - 500 Internal Server Error：服务器内部错误

### 7.6 Spring Boot实现RESTful API
```java
@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<List<User>> findAll() {
        List<User> users = userService.findAll();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> findById(@PathVariable Long id) {
        User user = userService.findById(id);
        return ResponseEntity.ok(user);
    }

    @PostMapping
    public ResponseEntity<User> create(@RequestBody User user) {
        userService.save(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(user);
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> update(@PathVariable Long id, @RequestBody User user) {
        user.setId(id);
        userService.update(user);
        return ResponseEntity.ok(user);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        userService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
```

## 八、前端框架技术
### 8.1 前端框架概述
- **前端框架**：帮助构建用户界面的框架
- **主流框架**：
  1. **Vue.js**：渐进式JavaScript框架
  2. **React**：用于构建用户界面的JavaScript库
  3. **Angular**：完整的前端框架

### 8.2 Vue.js
1. **Vue的核心概念**：
   - 响应式数据
   - 组件
   - 指令
   - 事件
   - 插槽

2. **Vue组件示例**：
   ```vue
   <template>
       <div>
           <h1>{{ title }}</h1>
           <ul>
               <li v-for="item in items" :key="item.id">{{ item.name }}</li>
           </ul>
           <button @click="addItem">添加</button>
       </div>
   </template>

   <script>
   export default {
       data() {
           return {
               title: '用户列表',
               items: []
           }
       },
       methods: {
           addItem() {
               this.items.push({ id: Date.now(), name: '新用户' });
           }
       },
       mounted() {
           fetch('/api/users')
               .then(res => res.json())
               .then(data => {
                   this.items = data;
               });
       }
   }
   </script>
   ```

3. **Vue Router**：
   - 路由管理
   - 示例：
     ```javascript
     import Vue from 'vue'
     import Router from 'vue-router'
     import Home from './views/Home.vue'
     import User from './views/User.vue'

     Vue.use(Router)

     export default new Router({
         routes: [
             { path: '/', component: Home },
             { path: '/user', component: User }
         ]
     })
     ```

4. **Vuex**：
   - 状态管理
   - 示例：
     ```javascript
     import Vue from 'vue'
     import Vuex from 'vuex'

     Vue.use(Vuex)

     export default new Vuex.Store({
         state: {
             count: 0
         },
         mutations: {
             increment(state) {
                 state.count++
             }
         },
         actions: {
             increment({ commit }) {
                 commit('increment')
             }
         }
     })
     ```

### 8.3 React
1. **React的核心概念**：
   - 组件
   - JSX
   - 状态（State）
   - 属性（Props）
   - 生命周期
   - Hooks

2. **React组件示例**：
   ```jsx
   import React, { useState, useEffect } from 'react';

   function UserList() {
       const [title] = useState('用户列表');
       const [items, setItems] = useState([]);

       useEffect(() => {
           fetch('/api/users')
               .then(res => res.json())
               .then(data => {
                   setItems(data);
               });
       }, []);

       const addItem = () => {
           setItems([...items, { id: Date.now(), name: '新用户' }]);
       };

       return (
           <div>
               <h1>{title}</h1>
               <ul>
                   {items.map(item => (
                       <li key={item.id}>{item.name}</li>
                   ))}
               </ul>
               <button onClick={addItem}>添加</button>
           </div>
       );
   }

   export default UserList;
   ```

3. **React Router**：
   ```jsx
   import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
   import Home from './views/Home';
   import User from './views/User';

   function App() {
       return (
           <Router>
               <Routes>
                   <Route path="/" element={<Home />} />
                   <Route path="/user" element={<User />} />
               </Routes>
           </Router>
       );
   }
   ```

4. **Redux**：
   ```javascript
   import { createStore } from 'redux';

   const initialState = { count: 0 };

   function reducer(state = initialState, action) {
       switch (action.type) {
           case 'INCREMENT':
               return { count: state.count + 1 };
           default:
               return state;
       }
   }

   const store = createStore(reducer);
   ```

### 8.4 前端工程化
1. **Webpack**：
   - 模块打包工具
   - 配置示例：
     ```javascript
     module.exports = {
         entry: './src/index.js',
         output: {
             path: __dirname + '/dist',
             filename: 'bundle.js'
         },
         module: {
             rules: [
                 { test: /\.js$/, use: 'babel-loader' },
                 { test: /\.css$/, use: ['style-loader', 'css-loader'] }
             ]
         }
     };
     ```

2. **Babel**：
   - JavaScript编译器
   - 将ES6+代码转换为ES5代码

3. **npm/yarn**：
   - 包管理器
   - 常用命令：
     - npm install
     - npm run dev
     - npm run build

## 九、总结
软件开发架构平台涵盖了Spring IoC、Spring AOP、Spring MVC、Spring Boot、MyBatis、RESTful API、前端框架等内容。Spring是Java企业级开发的核心框架，提供了IoC、AOP等核心功能。Spring Boot简化了Spring应用的开发。MyBatis是优秀的持久层框架。前后端分离和RESTful API是现代Web开发的主流模式。Vue.js和React是主流的前端框架。掌握这些技术可以高效地开发现代化的Web应用。