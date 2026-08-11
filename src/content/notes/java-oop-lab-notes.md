---
title: Java 面向对象实验：从类设计到接口与异常
date: 2025-05-21
type: learning
tags: [Java, 实验, 面向对象, 继承, 多态]
summary: Java 面向对象程序设计课程的八个实验归纳：类设计、继承、多态、异常处理、字符串与文件 I/O、抽象类与接口。按实验主题整理知识点与典型题。
---

## 实验系列总览

八个实验按 Java 学习路径递进：**基础语法 → 对象和类 → 继承 → 多态 → 异常 → 字符串与文件 → 抽象类与接口**。每个实验都是"设计类 + 画 UML + 写测试程序"三段式。

## 对象和类（实验 3）

典型题：`Book`（书籍）、`RegularPolygon`（正 n 边形）、`Circle2D`（圆）、`Queue`（队列）。

类设计的通用套路：

- **私有数据域 + 默认值**：如 `title` 默认 `"Unknown Title"`、`available` 默认 `true`
- **访问器/修改器**：每个私有字段配 get/set
- **构造方法重载**：无参构造 + 带参构造
- **toString()**：返回可读描述

```java
public class Book {
    private static final int HARDCOVER = 1, PAPERBACK = 2, EBOOK = 3;
    private String title = "Unknown Title";
    private boolean available = true;

    public String toString() {
        return available
            ? "《" + title + "》is available (Type: " + type + ")"
            : "《" + title + "》is not available";
    }
}
```

`Queue` 的实现细节：内部用数组存 int，容量满时**数组翻倍**；`dequeue` 后所有元素左移一位。

## 继承（实验 4）

- 子类用 `extends` 继承父类，`super()` 调用父类构造
- 方法重写（`@Override`）、字段遮蔽、构造链
- 练习：几何类层次（形状 → 圆/矩形/三角形）

## 多态（实验 5）

典型题：`SmartHome`（智能家居：SmartLight/SmartSpeaker 等设备类）、`Library`（图书馆系统）。

多态三要素：**继承、方法重写、父类引用指向子类对象**。

```java
// 设备接口/父类引用统一处理不同设备
Device d1 = new SmartLight();
Device d2 = new SmartSpeaker();
d1.turnOn();  // 运行期决定调用哪个实现
```

## 异常处理（实验 6）

典型题：`IllegalTriangleException` 自定义异常 + `Triangle` 类。三角形三边不合法时抛异常。

- 自定义异常继承 `Exception`（受检）或 `RuntimeException`
- `try-catch-finally` 捕获，`throw` 抛出
- 受检异常强制处理，非受检异常（运行时）可选

```java
public class Triangle {
    public Triangle(double a, double b, double c)
            throws IllegalTriangleException {
        if (a + b <= c || a + c <= b || b + c <= a)
            throw new IllegalTriangleException("三边不构成三角形");
        // ...
    }
}
```

## 字符串与文件 I/O（实验 7）

- `String` 常用方法：`length`、`charAt`、`substring`、`matches`（正则）
- 命令行参数：`main(String[] args)`
- 文件读写：`File`、`Scanner`（读文件）、`PrintWriter`（写文件）
- 典型题：密码规则校验（长度/字符类别）、统计文件的字符数/单词数/行数

```java
try (Scanner in = new Scanner(new File("input.txt"));
     PrintWriter out = new PrintWriter("output.txt")) {
    while (in.hasNextLine()) out.println(in.nextLine());
} // try-with-resources 自动关闭
```

## 抽象类与接口（实验 8）

- 抽象类：有抽象方法不能实例化，子类必须实现抽象方法
- 接口：`interface` 定义方法签名，`implements` 实现；Java 8+ 有 default 方法
- 典型题：`PasswordValidator`（密码校验接口）、`FileAnalyzer`（文件分析）、`FileSortPerformance`（文件排序性能对比）
- 接口 vs 抽象类：**接口多实现、抽象类单继承**；接口定义"能做什么"，抽象类定义"是什么"

## 小结

八个实验把 Java 面向对象主线走完：**封装（类）→ 复用（继承）→ 灵活（多态）→ 健壮（异常）→ 抽象（接口）**。练习都来自教材（Liang《Java 程序设计》），做完对"设计类再使用类"的流程有了手感。
