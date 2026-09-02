---
title: "Web系统与技术期末复习（详细版）"
date: "2025-06"
type: "learning"
tags: [Web, jpetstore, HTML, CSS, JS, XML]
summary: "Web系统与技术期末复习笔记，覆盖Web基础、jpetstore项目、前后端技术等内容"
---

# CH01 概述与基础知识
## 1.1 简答内容
### 1.1.1 Web和互联网的关系
**互联⽹是基础设施，Web是互联⽹的⼀项服务(应⽤)。**

互联网(Internet)：通过一系列网络协议实现计算机与计算机之间的网络通信，**是一种网络基础设施**(Infrastructure)，与之对应有局域网、城域网、广域网等。

**World Wide Web**：万维网，简称Web、WWW，是一种基于互联网进行访问的应用模式，其主要要素包括HTTP、HTML、URL、浏览器等。

万维网并不等同于互联网，万维网是基于互联网这一基础设施提供的服务之一，互联网上还要其他服务和应用类型，如电子邮件、网络游戏等。
### 1.1.2 Web的发展和1.0 2.0 3.0
诞生来源:超文本

超文本和互联网结合起来,通过超文本传输协议实现通信,标志Web的诞生

万维网的三个关键技术和一个软件:
1. 超文本标记语言HTML
2. 超文本传输协议HTTP
3. 统一资源标识符
4. 浏览器

- Web1.0:服务器提供静态或动态网页,平台管理内容,用户不参与内容创作,只读网络
- Web2.0:除了平台向用户提供内容,更多的是提供平台来共享用户之间的内容,并让用户间可以交互,是可读可写的网络
- Web3.0:Web3.0是近两三年来提出来的一个定义模糊的概念，大致思想包括去中心化、无需许可/审核、用户拥有内容、原生支付等。

### 1.1.3 请求响应模式
客户端把请求发送到服务器端的Web应用程序，Web应用程序接收请求后进行相关处理，并把客户端请求的资源以文本、图片、网页等形式(HTML),做为响应返回到客户端。

这种架构叫做B/S架构
### 1.1.4 B/S与C/S
C/S结构：即Client/Server（客户机/服务器）结构，是软件系统体系结构，通过将任务合理分配到Client端和Server端，降低了系统的通讯开销，可以充分利用两端硬件环境的优势。是建立在局域网的基础上；

B/S结构：即Browser/Server（浏览器/服务器）结构，C/S结构的一种变化或者改进的结构。在这结构下，用户界面完全通过www浏览器实现，一部分事务逻辑在前端实现，但是主要事务逻辑在服务器端实现，形成所谓3-tier结构。是建立在广域网的基础上。

B/S是C/S的一种
### 1.1.5 Web服务器
“Web服务器”⼀般来说是指安装了Web服务器应⽤(软件)的物理主机(硬件)的泛称。

常用的Web服务器软件有Apache和Nginx 
## 1.2 编程内容
### 1.2.1 HTTP请求
请求⾏包括请求⽅法、资源路径和协议/版本三个部分。

HTTP 1.1版本规定了7种请求⽅法，其中GET和POST⽅法常用于Web应用。
GET⽅法请求时没有请求体，参数直接置于URL中，POST⽅法请求时才有请
求体的部分。
### 1.2.2 HTTP响应
响应⾏包括协议/版本、状态码和状态码描述三个部分。

响应头包括响应的相关描述，其中最重要的为内容类型Content-Type。

响应体⼀般为HTML⽹页。

常⽤的内容类型Content-Type:
- 网页:text/html
- 字符串:text/plain
- pdf application/pdf
- 视频 video/quicktime
- 图片:image/jpeg
- 压缩文件 application/x-zip
- 应用程序 application/java
### 1.2.3 HTTP请求类型
- GET 从服务器获取资源
- POST 向服务器提交实体内容
- PUT 向服务器传输⽂件
- DELETE 请求删除服务器上资源
- HEAD 只获取服务器响应的头部
- OPTIONS 询问服务器⽀持的请求⽅法
- TRACE 请求跟踪路径
### 1.2.4 HTTP状态码
- 200 请求成功
- 201 请求成功并在服务器上创建新资源
- 202 请求被接受，但未处理完成
- 204 请求成功，但未发布任何新内容
- 404 请求的资源不可⽤
- 500 服务器发⽣内部错误
- 501 服务器不⽀持完成请求所需的功能
- 503 服务器过载，不能对请求进⾏服务
### 1.2.5 URL&URI
protocol://host[:port][/context][/resource][?query=string]

主机可以是IP地址(202.197.64.6)或能经DNS解析的主机名(www.csu.edu.cn)； 
# CH02 Servlet基础
## 2.1 简答内容
### 2.1.1 Web服务器和Web容器概念
容器：容器是中间件的一种，给处于其中的应用程序提供一个统一的环境，降低应用程序的复杂性。

给Web应用的服务端程序提供运行环境的容器就称为Web容器。常见的Web容器有Tomcat(Servlet容器)、JBoss(EJB容器)和IIS(ASP容器)等。

Web容器的主要功能包括通信支持、生命周期管理和多线程支持等。
### 2.1.2 Tomcat概念
Tomcat是Java Web应⽤开发中常⽤的开源Web容器：

Tomcat的准确定位应为：Java Web容器+Web服务器。

- 作为Web服务器：Tomcat能完成Apache的部分功能，如实现HTTP协议、
处理请求/响应等，默认在8080端口监听。
- 作为Java Web容器：Tomcat负责编译、运行、部署Servlet/JSP，也叫
Servlet容器。 
### 2.1.3 Tomcat目录结构
- bin目录：可执⾏程序，包括启动和关闭的脚本startup.sh和shutdown.sh
- conf目录：配置⽂件，包括核⼼配置⽂件server.xml和context.xml
- lib目录：库⽂件，包括编写Servlets必须servlet-api.jar和jsp-api.jar
- webapps目录：Web应用程序，每个Web应用程序都有⼀个目录，名称映射根路径
### 2.1.4 Tomcat的使用
### 2.1.5 XML的概念
XML：eXtensible Markup Language，可扩展标记语⾔
- XML是目前互联网中数据描述、存储和表达的事实标准。
- XML文件为纯文本的文档，被设计为简单、通用、自我描述。 
### 2.1.6 XML语法规范
XML语法规定⼀个XML⽂档由两部分组成：声明和⽂档元素。

声明设定文档的编码、版本等信息: <?xml version="1.0" encoding="UTF-8" ?>

文档元素由一个单根的树型自定义标记结构组成，类似HTML。

    <?xml version="1.0" encoding="UTF-8" ?>
    <movies>
    <movie type="冒险片">
    <title> 空中监狱 </title>
    <actor> 尼古拉斯凯奇 </actor>
    <rating> 家长指引 </rating>
    </movie>
    </movies>
## 2.2 编程内容
### 2.2.1 javax.servlet Servlet接口
#### 2.2.1.1 init()
init方法在第一次创建servlet时被调用，在后续每次请求时都不会被调用。

当用户调用servlet的时候，该servlet的一个实例就会被创建，并且为每一个用户产生一个新的线程，init()用于进行一些初始化数据的加载和处理，这些数据会被用于servlet的整个生命周期

Servlet引擎将Servlet容器对象和Servlet的配置信息封装到ServletConfig中，并在Servlet初始化时将ServletConfig传递给该Servlet

有两种情况会进行Servlet的初始化:
- Servlet被客户端首次请求访问时触发初始化方法
- 如果配置了load-on-startup元素，则在Servlet容器启动该Servlet所属Web应用时就会初始化该Servlet
#### 2.2.1.2 service()
service方法是实际处理请求的方法，servlet容器调用service方法来处理请求，并将响应写回到客户端，每次服务器接收到一个新的servlet请求时，服务器会产生一个新的线程来调用服务

在HttpServlet类中对于service()方法进行了处理，根据请求方式的不同，将请求分发到了不同的方法，而我们一般情况下写Servlet也是继承自HttpServlet的，所以在写请求处理逻辑时，只需要重写doGet()和doPost()方法即可

GET方法时浏览器向web服务器传递信息的默认方法，会在地址栏上产生很长的字符串，且GET方法有大小限制，请求字符串中最多只能有1024个字符

POST方法不将请求信息放到地址中
#### 2.2.1.3 destroy()
destory()方法只在servlet生命周期结束时被调用一次。可以在destory()方法中进行一些资源的清理，如关闭数据库连接、停止后台线程等
### 2.2.2 javax.servlet.http
#### 2.2.2.1 HttpServlet
HttpServlet是javax.servlet.http包中的一个抽象类，它继承自GenericServlet抽象类，而GenericServlet实现了Servlet接口。

当创建一个Servlet时，通常继承HttpServlet类来处理HTTP请求，这样可以利用HttpServlet提供的处理HTTP请求的标准机制。

doGet、doPost等方法的重写

重写原因：HttpServlet中的service方法会根据请求的HTTP方法类型（如GET、POST、PUT、DELETE等）来调用相应的doXXX方法，如对于GET请求调用doGet，对于POST请求调用doPost。一般情况下不需要重写service方法，只需重写doGet和doPost等方法来处理特定类型的请求。

重写方法：

`doGet`方法：用于处理GET请求，通常用于获取资源或查询操作。在重写的doGet方法中，可以通过HttpServletRequest对象获取请求参数，使用HttpServletResponse对象设置响应内容。示例代码如下：

    public class MyGetServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
            // 设置响应内容类型为HTML
            response.setContentType("text/html");
            // 获取输出流对象
            PrintWriter out = response.getWriter();
            // 输出HTML内容
            out.println("<html><body>");
            out.println("<h1>这是一个GET请求</h1>");
            // 获取请求参数
            String param = request.getParameter("paramName");
            if (param!= null) {
                out.println("<p>接收到的参数值为：" + param + "</p>");
            }
            out.println("</body></html>");
        }
    }

`doPost`方法：用于处理POST请求，通常用于提交表单数据或执行更新操作，请求参数包含在请求体中。重写doPost方法的示例代码如下：

    public class MyPostServlet extends HttpServlet {
        @Override
        protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
            // 设置响应内容类型为HTML
            response.setContentType("text/html");
            // 获取输出流对象
            PrintWriter out = response.getWriter();
            // 输出HTML内容
            out.println("<html><body>");
            out.println("<h1>这是一个POST请求</h1>");
            // 获取请求参数
            String param = request.getParameter("paramName");
            if (param!= null) {
                out.println("<p>接收到的参数值为：" + param + "</p>");
            }
            out.println("</body></html>");
        }
    }
#### 2.2.2.2 HttpServletRequest
常用方法:
- int getContentLength() 返回请求主体的字节数
- String getContentType() 返回请求主体的MIME类型
- **String getParameter(String name) 返回请求指定参数的值**
- String getContextPath() 返回请求上下⽂中的URI
- Cookie [] getCookies() 返回⼀个Cookie数组
- **HttpSession getSession() 返回与请求相关的Session对象**
#### 2.2.2.3 HttpServletResponse
常用方法:
- PrintWrite getWrite() 获取响应输出流
- void setContentType(String type) 设置响应的MIME类型
- **void sendRedirect(String url) 重定向到新的URL**
- void addHeader(String name, String value) 设置相应头的信息
#### 2.2.2.4 HttpSession
获取HttpSession对象:
1. HttpSession request.getSesssion()：如果当前会话已经有了session对象那么直接返回，如果当前会话还不存在会话，那么创建session并返回；

2. HttpSession request.getSession(boolean)：当参数为true时，与requeset.getSession()相同。如果参数为false，那么如果当前会话中存在session则返回，不存在返回null；

# CH03 Web应用开发基础和JSP
## 3.1 简答内容
### 3.1.1 组件关联关系
Web组件间⼀般有下列三种关联关系：
- 请求转发：forward
- 请求重定向：redirect
- 页面包含：include
#### 3.1.1.1 请求转发
请求转发是指将客户端的请求转发给同⼀个应⽤程序中的其他Web组件。

请求转发表明该次请求并没有完成，只是转交给其他组件去完成，客户端并不清楚转发的过程，客户端地址栏不发生改变。

- 在Servlet API中通过RequestDispatcher接口的forward()来实现HTTP请求的转发，同时将请求和响应对象
传递给目标组件。
- 具体的操作方式有：request.getRequestDispatcher(“目标”).forward()等。
### 3.1.1.2 请求重定向
请求重定向是指将客户端的请求重定向到其他任意的URL上

- 请求重定向后即表明该次请求响应流程已完成，返回一个响应给客户端(地址栏发生改变)，客户端根据响
应发起一次新的请求，不能使用之前的request对象。
- 在Servlet API中通过ServletResponse的sendRedirect()来实现重定向。
- 具体的操作方式有：response.sendRedirect(“目标”)。

### 3.1.2 会话跟踪
#### 3.1.2.1 URL重写实现会话跟踪
- URL重写的实现方式是将一个或多个token作为参数，添加到URL字符串中，每个token以
key=value的方式表现。
- URL重写适用于无需在太多页面之间保持会话的场景。

URL重写的会话跟踪有如下限制：
- URL字符串的总长度取决于浏览器限制
- URL重写需在服务端完成，token过于复杂难以操作
- 某些字符(空格，问号等)必须用base64编码
- 所有信息在地址栏均可见，安全性低

#### 3.1.2.2 使用隐藏域实现会话跟踪
使用隐藏域的实现方式和重写URL方法类似，区别是将附加在URL中的token信息放置到form表单的隐藏域中。 

    <body>
    <form action="login" method="post">
    <input type=“hidden” name=“id” value=“123”>
    ......
    </form>
    </body>

相对于URL重写⽅式：
- 没有字符数限制
- 无须进行特殊编码
#### 3.1.2.3 使用Cookies实现会话跟踪
- Cookie是一个对象，其内容主要包含以key-value形式保存的token信息
- Cookie作为HTTP请求头的一部分，其传输由HTTP协议控制。
- Cookie可以由服务端构建，也可以由浏览器端的JavaScript语言构建，最终都保存在
浏览器中。
- Cookie对象除了包含token信息外，还有maxAge、path等属性。
- 用Cookies方式来进行会话跟踪的主要缺点是用户可在浏览器进行限制。

#### 3.1.2.4 使用HttpSession实现会话跟踪
HttpSession是所有的会话跟踪技术中最安全和最常用的技术。

其基本原理是：用户第一次请求服务器时，由服务器创建HttpSession对
象，并生成唯一的用户ID(JSESSIONID)，其他会话token信息以key-value
的方式保存在HttpSession对象中，将用户ID以Cookie或URL的方式告知客
户端浏览器，整个过程由Web容器进行管理和控制。

服务端程序通过HttpServletRequest对象的getSession()方法获取
HttpSession对象，HttpSession提供一系列方法实现上述功能。
### 3.1.3 数据的作用域
按作⽤域的由⼩到⼤，作⽤域分为：
- 页面范围(page)：一个Servlet类或一个JSP页面；
- 请求范围(request)：一个请求过程的范围，请求被响应之间；
- 会话范围(session)：会话范围，整个会话持续过程；
- 应用范围(application)：服务器运行过程中(ServletContext)。

Web应⽤是通过将值或对象放⼊对应的作⽤域对象中，来实现数据作⽤域控制
的，作⽤域对象均提供setAttribute()和getAttribute()⽅法。
### 3.1.4 JSP和Servlet的关系
JSP是⼀种建⽴在Servlet规范提供的功能之上的动态⽹页技术。

JSP⽂件在⽤户第⼀次请求时，会被转译成Servlet，然后由这个
Servlet处理⽤户的请求，JSP可以看成是运⾏时的Servlet。

本质上说，JSP就是⼀种为了⽅便程序员编写的Servlet表现形式。

## 3.2 编程内容
### 3.2.1 JSP语法
#### 3.2.1.1 指令
JSP指令元素主要用来提供整个JSP页面相关的信息及属性，如编码方式、导入
类等，必须位于JSP页面的顶部。

基本语法为: <%@ directive attribute=“value” %>

JSP指令元素分为三种类型：
- page：设定整个页面的相关信息
- include：用于⽂件的动态包含
- taglib：用于使用第三⽅标签库

使用范例：

    <%@ page language="java" import="java.util.*" pageEncoding=“UTF-8" %>
#### 3.2.1.2 表达式
JSP表达式用于向页面中输出信息，其语法格式如下：

    <% = 表达式%>

表达式：可以是任何Java语言的完整表达式。该表达式的最终运算结果将转换为字符串。
例：使用JSP表达式在页面中输出信息，示例代码如下：

    <%String manager="mr"; %>	<!--定义保存管理员名的变量-->
    管理员：<%=manager %>		<!--输出结果为：管理员： mr-->
    <%="管理员："+manager %>		<!--输出结果为：管理员： mr -->
    <%= 7+6 %>					<!--输出结果为：13 -->
    <%String url="head01.jpg";%><!--定义保存文件名称的变量-->
    <img src="images/<%url %>">	<!--输出结果为：<img src="images/head01.jpg">-->
#### 3.2.1.3 标准动作
将使用JSP进行开发过程中常用的代码块（功能）用一个符号来表示，就是标准动作。

JSP2.4规范中提供8个标准动作，其中常用的有：
- <jsp:include> 主要用来在请求处理阶段动态地包含一个静态或者动态的文件。
- <jsp:forward> 用于将请求转发到Web应用的其他组件（如Servlet、Jsp或HTML文件等）处理。
- <jsp:useBean> 使用useBean动作声明并初始化一个bean对象，并指定其名称和作用范围。
- <jsp:setProperty>  用于设置标识Bean中的属性值。
- <jsp:getProperty> 用于获取标识bean的属性值。
#### 3.2.1.4 注释
JSP注释在JSP页面中使用，基本语法是 <%-- 注释内容 --%>

JSP注释在客户端页面中是无法看到的，只能在服务端页面中显示。

#### 3.2.1.5 隐式对象
隐式对象是指在JSP脚本元素中，不需要任何的声明和定义就可以直接使用的对象。

![alt text](img/3-1.png)

如需使用，直接在jsp页面中的脚本元素中使用即可。示例代码如下所示：

    <% 
        if(session.getAttribute("userName") != null){
            out.print("<h1>欢迎：" + session.getAttribute("userName") + "，恭喜登录成功</h1>");
        } else{
            out.print("<h1>登录已过期，请重新登录</h1>");
            out.print("<a href='./Login.jsp'>重新登录</a>");
        }
    %>

### 3.2.2 JDBC
JDBC是Java数据库连接(Java Database Connectivity)的简称。
常⽤JDBC API简介：
- DriverManager: 负责加载驱动程序(Driver)，并根据不同的请求返回对应的数据库连接对象(Connection)；
- Driver：驱动程序，由DriverManager工厂生成；
- Connection：数据库连接对象，负责与数据库间的通信及SQL语句的执行；
- Statement：用于执行静态SQL语句，该对象由Connection对象获得
- PreparedStatement：用于执行包含动态参数的SQL语句；
- ResultSet：用于指向执行查询SQL语句后结果集的接口。
#### 3.2.2.1 JDBC实现数据库的CRUD
#### 3.2.2.2 JDBC代码的优化


# CH04 开发模式和MVC
## 4.1 简答内容
### 4.1.1 开发模式的概念
当应⽤的业务和逻辑变复杂时,jsp写着会很复杂
### 4.1.2 ModelI
Model I是指基于JSP+JavaBean的开发模式，JSP负责Web相关的
部分，包括数据的展⽰，请求逻辑的控制等；JavaBean负责业务
逻辑的部分，包括数据的存取，业务的实现。

Model I只适⽤于中⼩型Web应⽤的开发，由于：
- 虽然使用JavaBean从Web应用中解耦了业务逻辑，但是用户的请求访问逻
辑、数据内容与表示仍然没有分离。
- JSP的固有特征使其更适合作为数据展示和表达的技术规范。
### 4.1.3 ModelII
Model II就是基于MVC的开发模式

MVC模式认为程序不论简单或复杂，从结构上看都可以分为三层：
- 视图层View：用户界面
- 数据层Model：程序中的数据或信息
- 控制层Controller：负责视图层和数据层的交互

Java Web中的MVC具体表现为：模型由JavaBeans组成，视图由
JSP页⾯组成，控制器由Servlets实现。

在Java Web应⽤的开发中，⼀般将Model还进⼀步细分为：完成
业务逻辑的业务Bean、实现数据持久化操作的DAO和仅⽤于表
达数据的值对象POJO。
## 4.2 编程内容
### 4.2.1 MVC基本原理
![alt text](img/4-1.png)

### 4.2.2 JavaWeb中MVC的实现
- LoginFormServlet
- POJO
- service
- DAO
### 4.2.3 项目结构和代码组织
![alt text](img/4-2.png)

# CH05 Servlet和JSP进阶
## 5.1 简答内容
### 5.1.1 过滤器使用场景
Servlet API还提供⼀系列的⽤于拦截Request请求和Response响
应的API接⼜，在Java Web应⽤的开发中通过调⽤这些API在⽤
户访问资源前或服务器完成响应后进⾏某些特定的处理。

过滤器在Web项⽬使⽤相当⼴泛，常⽤的场景有：
- 对用户请求进行统一认证
- 对用户访问进行审核和统计
- 对用户发送的数据进行过滤或替换
- 转换字符编码、图像格式等
- 对响应内容进行压缩，减少网络传输量
- 对请求或响应数据进行加/解密处理
### 5.1.2 监听器使用场景
Servlet API提供⼀系列的事件和事件监听接口，在Java Web应⽤
的开发中通过调⽤这些API可以进⾏事件驱动的开发。

常用使用场景有:
- 监听作用域对象的生命周期
- 监听作用域对象的内容改变
- 监听HttpSession的改变

### 5.1.3Java Web技术栈总结
![alt text](img/5-1.png)

## 5.2 编程内容
### 5.2.1 JSTL和EL
#### 5.2.1.1 EL基本概念
EL(Expression Language)表达式语⾔是JSP的重要特性之⼀

EL是⼀种简单⽽强⼤的语⾔，提供了在JSP脚本元素范围外使⽤运⾏时表达式的功能，主要包括：
- 基于命名空间与嵌套的属性访问；
- 对集合与操作符的访问；
- 一组隐式对象和映射到Java类中方法的可扩展函数

EL表达式可以⽤于JSP页⾯中的HTML部分的任意位置完成取值和显⽰。

常⽤场景：表达式求值、访问作⽤域变量和JavaBean、访问数组与集合。
#### 5.2.1.2 EL语法和用法
基本语法为:`${Expression}`

EL提供如下运算符操作：
- []和.运算符：用于对象属性或数组、集合
- Java支持的算术运算符、逻辑运算符和关系运算符；
- empty运算符。

示例代码:

    //访问JavaBean对象的值
    ${loginUser.name}或${loginUser[“name”]}
    //访问数组或集合
    ${userList[0].name}或${userList.get(0).name}
    ${userMap[“001”].name}或${userList.get(“001”).name}
    //访问作域对象或请求参数
    ${requestScope.loginUser.name}
    ${sessionScope.loginUser.name}
    ${paramValues.username}
#### 5.2.1.3 JSTL基本概念
标准标签库：JSTL，JSP Standard Tag Library
- 为了进一步提高代码的可重用性，JSP规范中允许用户自定义标签
- 一个自定义标签由标签描述文件(.tld)和标签处理程序(.java)两个部分组成
- SUN公司在JavaEE规范中提供一套较为通用的标签库：标准标签库(JSTL) 
#### 5.2.1.4 JSTL语法和用法
**常用标签之<c:if>**

if标签用于条件判断，其基本语法为：

    <c:if test=“条件表达式”>
    body content
    </c:if>

使用范例:

    <c:if test=“${sessionScope.loginUser != null}”>
    body content...
    </c:set>

**常用标签之<c:choose><c:when><c:otherwise>**

这一组标签可以实现条件嵌套和switch的功能，其基本语法为：

    <c:choose>
        <c:when test=“条件表达式”>
        </c:when>
        <c:when test=“条件表达式”>
        </c:when>
        <c:otherwise>
        </c:otherwise>
    </c:choose>

**常用标签之<c:forEach>**

forEach标签用于循环、遍历数组或集合对象，有两种形态，其基本语法为：

    <c:forEach [var=“name”] begin=“begin” end=“end” step=“step”>
        body content
    </c:forEach>

    <c:forEach items=“数组或集合”
    [var=“name”] [begin=“begin”] [end=“end”] [step=“step”]>
        body content
    </c:forEach>
    
**常用标签之<fmt:formatDate>**

formateDate标签用于对日期、时间、价格等进行格式化显示，其基本语法为：

    <fmt:formatDate value=“date”
    [type=“{time|date|both}”]
    [dateStyle=“{default|short|medium|long|full}”]
    [timeStyle=“{default|short|medium|long|full}”]
    [pattern=“{customPattern}”]
    [timeZone=“timeZone”]
    [var=“varName”]
    [scope=“{page|request|session|application}”]
    />

### 5.2.2 过滤器
实现过滤器的⽅法总体上和Servlet类似。
- 第一步：实现相关监听器接口，并完成具体的监听方法；
- 第二步：在容器内通过配置文件或注解配置监听器；

配置:

    <filter>
        <filter-name>XxxFilter</filter-name>
        <filter-class>servlet.XxxFilter</filter-class>
    </filter>
    <filter-mapping>
        <filter-name>XxxFilter</filter-name>
        <url-pattern>拦截的URL</url-pattern>
        <dispatcher>拦截的式</dispatcher>
    </filter-mapping>

过滤器的功能主要是通过doFilter()⽅法来实现的，⽅法原型为：

    void doFilter(ServletRequest request, ServletResponse response,FilterChain filterChain)

- 过滤器Filter的doFilter()⽅法有三个参数：请求对象request、响应对象
response和过滤器链对象filterChain。
- 过滤器Filter中doFilter()的最后⼀⾏⼀般会调⽤filterChain对象的
doFilter()⽅法，传递给过滤器链中的下⼀个过滤器，如果没有下⼀个过滤器，就进
⾏正常请求和响应；
- 如果不在Filter中doFilter()的最后⼀⾏调⽤filterChain.doFilter()⽅法即
表⽰⽤户请求到此结束。

使用范例:

    public class CodeFilter implements Filter{
        public void destroy() {}
        public void init(FilterConfig arg0) throws ServletException {}
        public void doFilter(ServletRequest request, ServletResponse response,
            FilterChain chain) throws IOException, ServletException {
            HttpServletRequest req = (HttpServletRequest)request;
            req.setCharacterEncoding("UTF-8");
            chain.doFilter(request, response);
        }
    }

### 5.2.3 监听器
编写监听器的⽅法和编写Servlet类似：
- 第一步：实现相关监听器接口，并完成具体的监听方法；
- 第二步：在容器内通过配置文件或使用注解配置监听器。

使用及配置:

    @WebListener
    public class XxxListener implements XxxXxxListener
    {
        //实现对应事件法
    }
    //web.xml
        <listener>
        <listener-class> fully-qualified class </listener-class>
        </listener>

使用范例:

    @WebListener
    public class AppListener implements ServletContextListener {
        @Override
        public void contextDestroyed(ServletContextEvent sce) {
        }
        @Override
        public void contextInitialized(ServletContextEvent sce) {
            ServletContext servletContext = sce.getServletContext();
            Map<String, String> countries = new HashMap<String, String>();
            countries.put("ca", "Canada");
            countries.put("us", "United States”);
            servletContext.setAttribute("countries", countries);
        }
    }

# CH06 AJAX简介
## 6.1 简答内容
### 6.1.1 为什么引入AJAX
Web2.0 可读可写网络 需要AJAX技术支持 主要目的是为了提高网页的交互性和用户体验‌
### 6.1.2 什么是AJAX
AJAX：Asynchronous JavaScript And XML(异步 JavaScript 和 XML),是一种创建交互式网页应用的网页开发技术。

Asynchronous：异步，客户端和服务端的通信方式

JavaScript：一种客户端脚本语言(HTML、CSS、DOM)

XML：数据的表示方式(JSON)
### 6.1.3 同步和异步的通信机制
- 同步通信方式：即典型的请求响应模型。在传统的Web应用模型下，大部分的用户操作都会发送一个HTTP请求给服务器，然后服务器开始处理(接收数据，执行业务逻辑，访问数据库等)，最后向浏览器返回HTML页面。
- 异步通信方式：异步发送请求，消除了传统的“发送请求－等待－发送请求－等待”的特性，极大的提高了用户体验，实现这种通信方式的核心技术是浏览器的XMLHttpRequest对象
### 6.1.4 HTML CSS JS 三者的关系
HTML（Hypertext Markup Language）是网页的骨架和内容载体。
CSS（Cascading Style Sheets）是用来控制网页的外观和布局的样式表语言。
JavaScript 是一种编程语言，用于实现网页的动态行为和交互功能。
它们在一起构建了现代网页和 Web 应用的用户界面。
## 6.2 编程部分
### 6.2.1 HTML5
略
### 6.2.2 CSS概念
CSS（层叠样式表，Cascading Style Sheets）是一种用于控制网页外观的样式表语言。通过定义样式规则，CSS 可以指定 HTML 页面中各个元素的显示方式，包括颜色、布局、字体、间距等。

与 HTML 专注于内容结构不同，CSS 的主要作用是美化和布局 HTML 页面，使网页在视觉上更具吸引力和一致性，帮助开发者定义 HTML 元素的颜色、字体、间距、位置、大小等视觉属性，使页面符合预期的设计效果。
### 6.2.3 CSS基础语法
#### 6.2.3.1 CSS选择器
1. 通配符选择器 全选: * {}
2. 标签选择器: h1 {}
3. 类选择器: .class {}
4. id选择器: #id {}
5. 子类选择器 父亲 > 儿子 儿子中个别选择（大于号） 直接父子关系: div>span {}
6. 祖先 后代 后代全部选择 （空格）: div span {}
7. 兄+弟 离哥最近的弟被选择（+）: span+div {}
8. 兄~弟 哥的所有弟都被选择 （~） : div~span {}
#### 6.2.3.2 属性
略
### 6.2.4 布局方式
CSS经典布局⽅式
- 基于盒状模型
- 依赖 display 属性 + position 属性 + oat 属性
- 对于那些特殊布局非常不方便

Flex布局的基本概念
- 采用ex布局的元素，称为ex容器，容器中所有子元素自动成为容器成员，称为ex项(ex item)
- 容器默认存在两根轴：水平的主轴(main axis)和垂直的交叉轴(cross axis)。
- 主轴的开始位置main start，结束位置main end；交叉轴的开始位置crossstart，结束位置cross end。
- ex项默认沿主轴排列，单个项占据的主轴空间叫做main size，占据的交叉轴空间叫做cross size。

# CH07 JS基础
## 7.1 简答部分
### 7.1.1 JS用途
JavaScript是目前广泛用于客户端开发的一种脚本语言，在“大前端”的背景下，也可用于服务端开发。 

用途举例:
- 前端开发 增强网页交互性
- 表单验证 数据处理
- 动态内容更新
- 创建动画与图形效果
- 服务器端开发
### 7.1.2 JS特点
动态、弱类型、基于原型的语言

解释性脚本语言、多范式、事件驱动
### 7.1.3 JS使用方式
- 内联方式‌：直接在HTML标签的属性中使用JavaScript代码。例如，在`<button>`标签的onclick属性中写入JavaScript代码来实现点击事件。这种方式简单直观，但不利于代码的复用和维护‌

- 嵌入式方式‌：在HTML文件中使用`<script>`标签来包含JavaScript代码。这种方式适合少量的脚本代码，但不利于大型项目的代码管理和复用‌

- 外部文件方式‌：将JavaScript代码写在单独的.js文件中，并通过`<script src="path/to/file.js"></script>`引入。这种方式有利于代码的复用和维护，是推荐的使用方式‌
## 7.2 编程部分
### 7.2.1 基本语法
部分基础见JS文档

#### 7.2.1.1 匿名函数

    let a = function(){
        //content
    }

#### 7.2.1.2 立即执行匿名函数

    //方法1
    (匿名函数)();

    //方法2
    (匿名函数());

    (function(){
        //content
    })();

    (function(){
        //content
    }());
### 7.2.2 内置对象
- DOM
- BOM
- 全局JS变量(String Number等)

# CH08 JS进阶
## 8.1 简答部分
### 8.1.1 BOM中常用对象
在JavaScript中，BOM是浏览器对象模型（Browser Object Model）的缩写。

常用对象有:
- window对象 BOM的核心对象，表示浏览器的一个实例。它既是浏览器窗口的一个接口，也是全局对象。
- document对象 文档对象 Document对象是JavaScript中的一个内置对象，表示整个HTML文档，它提供了访问和操作HTML文档的方法和属性。
- location对象 地址栏对象 Location对象是 JavaScript 中的一个内置对象，它表示当前窗口中加载的文档的URL；
- navigator对象 导航对象 Navigator对象是 JavaScript 中的一个内置对象，它提供了关于浏览器的信息和功能
- screen对象 屏幕对象 screen对象提供了有关用户屏幕的信息，可以访问用户屏幕的宽度、高度、颜色深度等属性，screen对象是一个全局对象，可以直接访问，无需实例化；
### 8.1.2 DOM树的概念
DOM：Document Object Model，⽂档对象模型。

⽂档对象模型DOM规定了浏览器应该如何创建HTML元素，以及JavaScript如何操作HTML元素。

- 当浏览器加载Web页面时，在内存中创建页面模型——DOM树对象模型
- JavaScript操作HTML页面内容时，是通过一系列API实现的——DOM API
### 8.1.3 原型对象与原型继承
Javascript中规定每个函数都有⼀个prototype属性，指向⼀个对象。

对于普通函数来说，该属性基本⽆⽤。但是对于构造函数来说，⽣成实例的时候，该属性会⾃动成为实例对象的原型——原型对象。

JavaScript 规定，所有对象都有⾃⼰的原型对象（prototype）。
⼀⽅⾯，任何⼀个对象，都可以充当其他对象的原型；另⼀⽅⾯，由于原型
对象也是对象，所以它也有⾃⼰的原型。因此，就会形成⼀个“原型链”
（prototype chain）：对象到原型，再到原型的原型……

如果⼀层层地上溯，所有对象的原型最终都可以上溯到Object.prototype，
即Object构造函数的prototype属性。Object.prototype的原型是null。
通过指定对象的原型对象的⽅式来实现的继承，就称为原型继承。
## 8.2 编程部分
### 8.2.1 使用JS访问DOM
#### 8.2.1.1 访问和更新元素
DOM常⽤API——访问元素

返回单一元素节点
- getElementById('id')
- querySelector('css selector')

返回一个或多个元素节点（NodeList）
- getElementByClassName('class')
- getElementByTagName('tag')
- querySelectorAll('css selector')

#### 8.2.1.2 访问和更新元素内容
DOM常⽤API——获取或更新元素内容

文本节点：nodeValue属性

元素节点:
- textContent属性
- innerText属性
- createElement()、createTextNode()、appendChild()和
- removeChild()法
- innerHTML属性

### 8.2.2 事件处理的基本概念
DOM模型针对浏览器和⽹页内容规定了⼀系列的⽤户动作⾏为，称为⽹页事件。

JavaScript事件处理分为三个步骤：选定元素、事件绑定、事件处理。

⽹页事件从类型上可以分为：
- 浏览器事件
- 键盘事件
- 鼠标事件
- 焦点事件
- 表单事件
- DOM事件
### 8.2.3 事件绑定的三种方式
事件绑定有三种⽅法：HTML绑定、传统DOM绑定和DOM监听器。

#### 8.2.3.1 HTML绑定

    <input type="button" onclick="clickBtn"/>    
    <script>
        function clickBtn(){
            //content
        }
    </script>
#### 8.2.3.2 传统DOM绑定

    <input type="button" id="btn" onclick="clickBtn"/>    
    <script>
        var elUser = document.getElementById("btn");
        elUser.onclick = clickBtn();
        function clickBtn() {
            //content
        }
    </script>
#### 8.2.3.3 DOM监听器

    element.addEventListener("event",function,boolean);

# CH09 AJAX的实现
## 9.1 简答部分
### 9.1.1 AJAX应用的流程
![alt text](img/9-1.png)
### 9.1.2 应用场景
经典的AJAX技术应⽤场景:
- 表单验证
- 动态加载列表框
- 创建自动刷新页面
- 显示进度条
- 创建工具提示
- 自动补全功能
- 访问Web服务
## 9.2 编程部分
### 9.2.1 XMLHttpRequest对象的使用
使用:

    var xhr = new XMLHttpRequest();

常用方法:
- abort() 停止当前请求
- getAllResponseHeaders() 将响应头作为键值对返回
- getResponseHeader(“header”) 返回指定头部字段的值
- open(”method”,”url”) 建立对服务器的调用。method参数表示请求方法
- url表示请求的资源。
- send(content) 向服务器发送请求
- setRequestHeader() 设置请求头中某个字段的值 

方法说明:

    void open(String method, String url, boolean asynch,String username, String password ):

这个⽅法会建立对服务器的调用。这是初始化⼀个请求的纯脚本⽅法。它有两个必要的参数，三个可选的参数。第三个boolean值用于指定是异步还是同步通信⽅式，默认为true，即异步。

    void send(content)
这个⽅法具体向服务器发出请求。如果请求声明为异步的，这个⽅法就会立即返回，否则它会等待直到接收到响应为⽌。可选参数可以是DOM对象的实例、输⼊流，或者串。传⼊这个⽅法的内容会作为请求体的⼀部分发送 

常⽤事件和属性:
- onreadystatechange 请求的状态发生改变时会触发这个事件，通常会调用一个JavaScript函数。
- readyState 表示请求状态的属性，有5个可取的值：0=未初始化，1=正在加载，2=已加载，3=交互中，4=完成。
- responseText 服务器的响应，表示为一个字符串
- responseXML 服务器的响应，用XML封装，可以被解析为DOM。
- status 服务器状态码
### 9.2.2 数据表示的三种方式
#### 9.2.2.1 字符串
简单字符串方式一般用于传递“Yes/No”此类数据本身无结构的数据
#### 9.2.2.2 XML
XML方式常用于复杂数据的表示，一般来说，数据本身有结构化要求，数据量也比较大。

使用JS处理XML数据:

![alt text](img/9-2.png)
#### 9.2.2.3 JSON
JSON是JavaScript Object Notation的缩写，是⼀种数据交换格式。

JSON基本语法
- JSON内容由“键-值”对组成，多个“键-值”对由“，”隔开
- 大括号“{ }”表示整个JSON对象
- 中括号“[ ]”表示数组，数组中包括多个JSON对象
- 键key和值value都必须用双引号表示
- JSON中必须使用UTF-8编码，转义字符由斜杠“\”表示
- 数据类型包括数值、布尔值和null等

JavaScript中使⽤JSON 首先需要区分两个概念：JSON字符串和JSON对象。
- JSON字符串：其本质是一个有格式要求的普通字符串。
- JSON对象：JavaScript语言中的一个内置对象。

JavaScript中通过名为“JSON”的对象提供二者的相互转换。

使用JS处理JSON:

![alt text](img/9-3.png)

在Java语言中使用JSON，就是最基本的字符串拼接和对象的创建。

此外，有大量第三方库提供支撑，比如net.sf.json包、Gson包、fastjson包

使用范例:
![alt text](img/9-4.png)

# CH10 JQuery
## 10.1 简答部分
### 10.1.1 为什么使用JQuery
使用AJAX技术的Web应用需要在HTML页面中编写大量的JavaScript代码。并且此类代码的复杂性主要体现在对DOM的操作。

用于简化JS代码和提高代码可维护
## 10.2 编程部分
### 10.2.1 JQuery使用方式
在开发中使用jQuery框架很简单，只需将相应版本的对应的.js文件(jquery-3.4.1.js)引入到项目中即可(线上部署项目还可以使用CDN方式引用jQuery)。 

    <script src=".../jquery.js">

    </script>
### 10.2.2 JQuery语法
#### 10.2.2.1 基础语法

    $(selector).action()

\$:用于在JavaScript语言中标识jQuery。

selector:选择器，用于查找或查询HTML元素。

action()：指对选择的元素执行的特定操作。

#### 10.2.2.2 文档就绪函数
为了防止HTML文档在完全加载之前运行jQuery代码，一般会将所有的jQuery调用放到文档就绪函数中。

    $(document).ready(function(){
        //content
    });
#### 10.2.2.3 常用动作
**获取元素内容**
- .html(): 获取元素的所有内容，包括元素
- .text(): 获取元素中所包含的⽂本内容

**修改元素内容**
- .html(‘内容’) .text(‘内容’)
- .replaceWith(‘内容’) .remove()

**插入元素**
- .before()
- .after()
- .prepend()
- .append()

![alt text](img/10-1.png)

#### 10.2.2.4 事件处理
用.on()

    $("li").on("click",function(){
        //content
    });

带事件对象的处理:

    $("li").on("click",function(e){
        //content
        //e.type
    });

完整用法:
![alt text](img/10-2.png)
### 10.2.3 使用JQuery简化AJAX操作常用API
jQuery提供⼀系列API简化AJAX操作,下表为请求相关API：
- $.ajax() 最核⼼的⽅法，下列各⽅法均为$.ajax()的简化
- $.get() 使用HTTP GET向服务器请求，并加载返回的结果
- $.post() 使用HTTP POST向服务器请求，并加载返回的结果
- $.getJSON() 使用HTTP GET向服务器请求JSON数据，并加载返回的结果
- $.getScript() 使用HTTP GET向服务器请求JavaScript数据，并加载返回的结果
- .load() 将HTML片段加载到元素中，这是最简单的获取数据的⽅法

响应相关API：
- responseText 返回的普通⽂本数据
- responseXML 返回的XML数据
- status 状态码
- statusText 状态描述
- .done() 请求成功执⾏的代码
- .fail() 请求失败执⾏的代码
- .always() 总会执⾏的代码
- .abort() 挂起通信

\$.ajax()的详细使用:
- type HTTP请求⽅法，包括GET、POST等
- url 请求的服务端URL
- data 发送给服务器或者从服务器获取的数据
- success 请求成功时的回调函数
- error 请求错误时的回调函数
- beforeSend 请求前运⾏的函数，⼀般用于加载图标或进度条
- complete 请求完成后运⾏的函数，⼀般用于移除图标或进度条
- timeout 超时时间

使用范例:
![alt text](img/10-3.png)