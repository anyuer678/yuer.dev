---
title: "软件开发架构平台速记"
date: "2025-05"
type: "learning"
tags: [Spring, SpringBoot, MyBatis, RESTful, React, Vue, 前后端分离]
summary: "软件开发架构平台核心知识点速记，涵盖Spring IoC/AOP/MVC、MyBatis、RESTful API、ES6异步、React/Vue等内容"
---

# 软件开发架构平台 — 核心知识速记

---

## 模块A：Spring核心（CH01-04）

### CH01 框架概述
| 知识点 | 核心 |
|--------|------|
| MVC三层 | `Servlet(Controller) → Service → DAO + POJO + JSP(View)` |
| 三类框架 | 表示层(Struts/SpringMVC)、持久层(MyBatis/Hibernate)、容器类(Spring) |
| 框架侵入性 | 高侵入=继承框架类；低侵入=反射/IoC/AOP（Spring路线） |
| 组合演进 | SSH → SSM → SpringBoot版SSM |
| Maven | POM+坐标(g/a/v)+仓库(本地/中央/私服)+约定目录+6命令(compile/test/clean/package/install/deploy) |

### CH02 IoC
| 知识点 | 核心 |
|--------|------|
| IoC定义 | 控制反转=组件的构建与使用分离=高内聚低耦合 |
| HelloWorld五阶段 | 硬编码→外部参数→面向对象→面向接口(构造注入)→工厂模式(完全解耦) |
| 实现三要素 | 面向接口编程 + 工厂模式 + 依赖注入 |
| Bean作用域 | singleton(默认单例)、prototype(每次新建)、request、session |
| 实例化方式 | 构造器(默认无参)、静态工厂(factory-method)、实例工厂(factory-bean+factory-method) |
| 生命周期 | 实例化→属性赋值→初始化→销毁 |
| DI两方式 | 构造注入(强制依赖) vs Setter注入(可选依赖) |
| 注解 | `@Component/@Controller/@Service/@Repository` + `@Autowired`自动装配 |
| BeanFactory vs AppContext | BF基础接口；AC增加国际化+事件机制 |

### CH03 AOP
| 知识点 | 核心 |
|--------|------|
| AOP定义 | 面向切面编程，横向抽取替代纵向继承，解决横切关注点(日志/安全/事务) |
| 概念链 | 关注点→横切关注点→切面(Aspect)→连接点(JoinPoint)→建议(Advice)→织入(Weaving) |
| Advice类型 | @Before/@After/@Around/@AfterThrowing/@AfterReturning |
| 三种实现 | 编译期(AspectJ)、类加载器(字节码增强)、运行时(动态代理) |
| 动静横切 | 动态横切=改行为(Advice)；静态横切/引介=改结构(添加方法字段) |
| Spring AOP | 推荐AspectJ方案：`@Aspect + @Around + @Pointcut` |
| 日志体系 | 门面(SLF4J/JCL) + 实现(Log4j/Logback/JUL/Log4j2)分离 |
| 日志级别 | Log4j: TRACE→DEBUG→INFO→WARN→ERROR→FATAL→OFF |

### CH04 Spring MVC
| 知识点 | 核心 |
|--------|------|
| 七步流程 | DispatcherServlet→HandlerMapping→Controller→ModelAndView→ViewResolver→View渲染→Response |
| 参数获取 | @RequestParam(查询参数)→@RequestBody(JSON体)→@PathVariable(路径变量) |
| 响应方式 | @ResponseBody(JSON) / ModelAndView(视图渲染) |
| 注解映射 | @RequestMapping→@GetMapping/@PostMapping/@PutMapping/@DeleteMapping |
| @RestController | = @Controller + @ResponseBody |
| 参数校验 | @Valid(JSR-303,可嵌套) vs @Validation(Spring,仅形参) |
| 拦截器 | HandlerInterceptor三方法: preHandle→postHandle→afterCompletion，基于AOP |
| Filter vs Interceptor | Filter=Servlet规范，Interceptor=Spring AOP |
| 模板引擎 | JSP→FreeMarker→Thymeleaf(推荐) |

---

## 模块B：持久层（CH05-06）

### CH05 Spring Boot + ORM入门
| 知识点 | 核心 |
|--------|------|
| SpringBoot四大核心 | Starter(依赖整合)、自动配置(条件化)、CLI(Groovy)、Actuator(监控) |
| 入口类 | `@SpringBootApplication` + `SpringApplication.run()` |
| ORM定义 | 对象关系映射=瞬态内存数据→持久化存储 |
| ORM四层级 | JDBC→JDBC Template→MyBatis(半自动)→Hibernate/JPA(全自动) |
| JDBC调用链 | Driver→Connection→Statement/PreparedStatement→ResultSet |
| JPA三方面 | ORM映射元数据 + API接口 + JPQL |
| JDBC Template | execute/update&batchUpdate/query&queryXXX + RowMapper(结果映射) |

### CH06 ORM深入
| 知识点 | 核心 |
|--------|------|
| MyBatis四大件 | Configuration.xml + SqlSessionFactory/SqlMapper + Mapper.xml + Java API |
| Mapper.xml核心 | namespace(唯一标识) + id + parameterType + resultType |
| #{} vs ${} | #{}预编译防注入，${}直接拼接有风险 |
| resultType vs resultMap | resultType简单(80%)，resultMap复杂(20%)，不可同时用 |
| 动态SQL四标签 | `<if>` `<choose/when/otherwise>` `<trim/where/set>` `<foreach>` |
| 延迟加载 | lazyLoadingEnabled=true，关联对象用时才查 |
| Hibernate三状态 | transient(瞬时,new)→persistence(持久,save)→detached(脱管,close)，update可重回持久 |
| 阻抗不匹配五方面 | 粒度、继承、标识、关联、数据导航 |
| @Entity等注解 | `@Entity @Table @Id @GeneratedValue @Column` |
| MyBatis三剑客 | generator(代码生成)、plugin(IDE插件)、PageHelper(分页) |
| MyBatis-Plus | 面向对象操作，Lambda+ActiveRecord，无侵入AOP实现 |

---

## 模块C：前后端分离（CH07-08）

### CH07 RESTful API基础
| 知识点 | 核心 |
|--------|------|
| Web模式三阶段 | Model I(不分前后端)→Model II(MVC)→AJAX/前后端分离 |
| SPA vs MPA | SPA单页不刷新；MPA多页重新加载 |
| SOAP vs REST | SOAP重型XML+WSDL+UDDI；REST轻量JSON+HTTP |
| REST三要素 | 资源(Resources) + 表述性(Representational) + 状态转换(State Transfer) |
| REST六大约束 | (1)客户端-服务器 (2)无状态 (3)缓存 (4)分层系统 (5)统一接口 (6)按需代码 |
| 统一接口四原则 | URI标识→表述操作→自描述消息→HATEOAS |
| HTTP方法 | GET(查) POST(增) PUT(全量改) PATCH(部分改) DELETE(删) |
| URI设计 | 名词复数(/users)、嵌套(/users/1/orders/3) |
| 响应规范 | 状态码+错误信息+分页过滤+超链接(HATEOAS)+HTTPS+JSON |
| SpringBoot实现 | @RestController + @RequestMapping/@GetMapping |
| 测试工具 | Postman |

### CH08 RESTful API进阶
| 知识点 | 核心 |
|--------|------|
| Session vs Token | Session服务器存储；Token客户端存储，服务器不存用户状态 |
| JWT三部分 | Header(alg+typ) + Payload(标准字段iss/exp+自定义) + Signature(HMAC SHA256) |
| JWT流程 | 登录→服务器生成Token→客户端保存→每次请求带`Authorization: Bearer <token>`→服务器验证 |
| JWT特点 | 默认不加密/无法废止/短有效期/建议HTTPS |
| 认证 vs 鉴权 | Authentication=你是谁；Authorization=你能干什么 |
| OAuth 2.0 | 第三方登录鉴权开放标准，Spring Security OAuth2集成 |
| 跨域解决 | CORS(后端`Access-Control-Allow-Origin`) / Nginx反向代理 / 同域部署 |
| JSON序列化 | fastjson(阿里)/jackson(Apache)/Gson(Google)，SpringBoot默认jackson+Gson |
| 注解控制 | @JsonIgnore(忽略) @JsonInclude(条件包含) |
| 对象分层 | DTO(传输)→VO(视图)→BO(业务)→DO(领域)→PO(持久) |
| 全局异常 | `@ControllerAdvice` + `@ExceptionHandler` |

---

## 模块D：前端技术栈（CH09-12）

### CH09 ES6异步
| 知识点 | 核心 |
|--------|------|
| Promise三状态 | pending→fulfilled/rejected，不可逆 |
| then() | 两个回调(成功,失败)→链式调用解回调地狱 |
| Promise API | catch() finally() all() |
| async/await | 语法糖，await阻塞async函数内，需try-catch |
| fetch() | ES6原生，Promise封装，手动.json()，HTTP错误不reject(需检查ok) |
| axios | 第三方，自动JSON，HTTP错误进catch，拦截器+超时+AbortController取消 |

### CH10 工程化
| 知识点 | 核心 |
|--------|------|
| 工程化四方面 | 模块化 + 组件化 + 规范化 + 自动化 |
| NPM | dependencies(生产) vs devDependencies(开发) |
| Yarn | 并行安装+本地缓存+yarn.lock锁版本 |
| 模块化四阶段 | 原始(script)→函数封装→AMD(require.js)/CMD(sea.js)→CommonJS/ES6 Module |
| CommonJS vs ES6 | (1)值拷贝vs值绑定 (2)单值vs多值 (3)动态vs静态语法 (4)this指向不同 |
| Webpack五核心 | entry(入口)→output(输出)+loader(处理非JS)+plugin(扩展)+mode(dev/prod) |
| Vite | 新一代构建工具 |

### CH11 框架入门
| 知识点 | 核心 |
|--------|------|
| AngularJS(≠Angular) | Google 09年，首创MVC/MVVM+双向绑定(View↔Model通过$Scope) |
| React三大特点 | 虚拟DOM(Diff算法最小同步) + 声明式JSX + 组件化 |
| JSX | 类XML语法→编译为`React.createElement` |
| props vs state | props父传子只读；state组件内可变 |
| Hooks | 函数组件管理状态和生命周期，`useState`返回[值,setter] |
| Vue | 渐进式：模板语法{{}}+指令(v-)+双向绑定(v-model)+虚拟DOM |
| Vue生态 | Vue Router(路由) + Vuex/Pinia(状态管理) |
| 框架贡献 | AngularJS引入MVVM→React引入虚拟DOM组件化→Vue融合简化 |

### CH12 框架进阶
| 知识点 | 核心 |
|--------|------|
| 状态管理三层 | 组件内(useState)→组件间(状态提升+props)→全局(Context API/Redux) |
| Hook概念 | 让函数组件"挂钩"React内部系统，替代class写法 |
| props drilling | 多层传递导致复杂→Context API解决 |
| 路由管理 | URL路径映射组件，无刷新页面跳转(SPA核心) |
| 路由三进阶 | 嵌套路由(父子结构) + React.lazy()懒加载 + 页面守卫/登录拦截 |
| Vue通信 | props向下传递 + emit向上触发事件 |

---

## 核心对比速查表

| 编号 | A | vs | B | 一句话 |
|------|---|----|---|--------|
| 1 | IoC | DI | IoC是原则，DI是实现 |
| 2 | 构造注入 | Setter注入 | 构造=强制，Setter=可选 |
| 3 | BeanFactory | ApplicationContext | BF基础，AC加国际化事件 |
| 4 | singleton | prototype | singleton单例，prototype每次新建 |
| 5 | 动态横切 | 静态横切 | 动态改行为，静态改结构 |
| 6 | 日志门面 | 日志实现 | 门面=接口，实现=具体库 |
| 7 | MyBatis | Hibernate | 半自动(写SQL) vs 全自动(生成SQL) |
| 8 | #{} | ${} | #{}预编译安全，${}拼接有风险 |
| 9 | resultType | resultMap | 简单映射 vs 复杂映射 |
| 10 | SOAP | REST | 重型XML vs 轻量JSON |
| 11 | Authentication | Authorization | 认证=你是谁，鉴权=能干啥 |
| 12 | Session | Token | 服务端存储 vs 客户端存储 |
| 13 | Filter | Interceptor | Servlet规范 vs Spring AOP |
| 14 | @Valid | @Validation | JSR-303可嵌套 vs Spring仅形参 |
| 15 | SPA | MPA | 单页不刷新 vs 多页重新加载 |
| 16 | fetch | axios | 原生手动JSON vs 第三方自动JSON |
| 17 | dependencies | devDependencies | 生产用 vs 仅开发用 |
| 18 | CommonJS | ES6 Module | 动态+值拷贝 vs 静态+值绑定 |
| 19 | props | state | 父传子只读 vs 组件内可变 |
| 20 | ModelAndView | Model/ModelMap | MAndV带视图，Model/Map自动创建 |

---

## 必记流程口诀

| 流程 | 口诀 |
|------|------|
| Spring MVC 7步 | **前→映→控→M→视→渲→响** |
| HelloWorld 5步 | **硬→参→对→口→厂** |
| Bean生命周期 | **实→赋→初→销** |
| JWT 5步 | **登→生→存→带→验** |
| 模块化演进 | **原→函→A/C→C/E** |
| JDBC调用链 | **D→C→S→R** |

## 必记数字清单

| 项 | 数 | 内容 |
|----|----|------|
| REST约束 | 6 | 客户端服务器/无状态/缓存/分层/统一接口/按需代码 |
| Bean作用域 | 4 | singleton/prototype/request/session |
| Bean实例化 | 3 | 构造器/静态工厂/实例工厂 |
| ORM层级 | 4 | JDBC→JDBC Template→MyBatis→Hibernate |
| Hibernate状态 | 3 | transient/persistence/detached |
| 阻抗不匹配 | 5 | 粒度/继承/标识/关联/数据导航 |
| Promise状态 | 3 | pending/fulfilled/rejected |
| Webpack核心 | 5 | entry/output/loader/plugin/mode |
| 对象分层 | 5 | DTO→VO→BO→DO→PO |
| React特点 | 3 | 虚拟DOM/声明式JSX/组件化 |
| 动态SQL标签 | 4 | if/choose/trim/foreach |

---

**使用建议**：每天睡前15分钟闭眼回忆以上内容，按模块逐行过，标记卡顿点次日重点复习。