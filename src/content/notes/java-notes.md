---
title: "Java编程速记"
date: "2025-06"
type: "learning"
tags: [Java, 面向对象, 集合, 多线程, IO, 泛型, 异常]
summary: "Java编程核心知识点速记，涵盖面向对象、集合框架、多线程、IO流、泛型、异常处理等内容"
---

# Java编程速记

---

## 一、基础语法

### 1.1 数据类型

| 类型 | 关键字 | 字节数 | 默认值 | 取值范围 |
|------|--------|--------|--------|----------|
| 字节型 | byte | 1 | 0 | -128 ~ 127 |
| 短整型 | short | 2 | 0 | -32768 ~ 32767 |
| 整型 | int | 4 | 0 | -2^31 ~ 2^31-1 |
| 长整型 | long | 8 | 0L | -2^63 ~ 2^63-1 |
| 单精度 | float | 4 | 0.0f | IEEE 754 |
| 双精度 | double | 8 | 0.0 | IEEE 754 |
| 字符型 | char | 2 | '\u0000' | 0 ~ 65535 |
| 布尔型 | boolean | 1 bit | false | true / false |

> **自动类型提升路径**: byte -> short -> int -> long -> float -> double

### 1.2 运算符

- **算术运算符**: `+ - * / % ++ --`
- **关系运算符**: `== != > < >= <=`
- **逻辑运算符**: `&& || ! & | ^`
- **位运算符**: `& | ^ ~ << >> >>>`
- **赋值运算符**: `= += -= *= /= %=`
- **三元运算符**: `条件 ? 表达式1 : 表达式2`

> `&&` 短路与：左边为 false 则不执行右边；`&` 无论左右都会执行。

### 1.3 控制流

```java
// if-else
if (条件1) { ... } else if (条件2) { ... } else { ... }

// switch（Java 14+ 支持箭头语法）
switch (表达式) {
    case 值1: ...; break;
    case 值2 -> ...;       // 箭头语法无需 break
    default -> ...;
}

// for / for-each
for (int i = 0; i < 10; i++) { ... }
for (类型 变量 : 集合) { ... }

// while / do-while
while (条件) { ... }
do { ... } while (条件);
```

---

## 二、面向对象

### 2.1 封装

```java
public class Student {
    private String name;
    private int age;

    // Getter / Setter
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
}
```

- 用 `private` 修饰属性，通过公共的 getter/setter 方法访问
- `this` 关键字区分成员变量和局部变量

### 2.2 继承

```java
public class Person {
    protected String name;
    public Person(String name) { this.name = name; }
}

public class Student extends Person {
    private int score;
    public Student(String name, int score) {
        super(name);  // 调用父类构造方法
        this.score = score;
    }
}
```

- Java **单继承**，一个类只能有一个直接父类
- 子类继承父类的非 private 成员
- 构造方法不继承，通过 `super()` 显式调用

### 2.3 多态

```java
Animal animal = new Dog();  // 父类引用指向子类对象
animal.speak();             // 运行时调用 Dog 的 speak()

// 向下转型需先判断
if (animal instanceof Dog dog) {   // Java 16+ 模式匹配
    dog.fetch();
}
```

- **编译看左边**（引用类型决定可调用的方法），**运行看右边**（实际对象决定执行哪个实现）
- 多态的前提：继承/实现 + 方法重写 + 父类引用指向子类对象

### 2.4 抽象类

```java
public abstract class Shape {
    protected String color;

    // 抽象方法 —— 子类必须实现
    public abstract double area();

    // 普通方法 —— 可直接使用
    public void display() {
        System.out.println("颜色: " + color + ", 面积: " + area());
    }
}
```

- 抽象类**不能实例化**，可有构造方法供子类调用
- 含有抽象方法的类必须声明为抽象类
- 抽象类可以包含普通方法和成员变量

### 2.5 接口

```java
// Java 8+ 接口支持默认方法和静态方法
public interface Flyable {
    void fly();                       // 抽象方法

    default void land() {             // 默认方法（Java 8+）
        System.out.println("着陆");
    }

    static void info() {              // 静态方法（Java 8+）
        System.out.println("Flyable 接口");
    }
}

public class Bird implements Flyable {
    @Override
    public void fly() {
        System.out.println("鸟在飞");
    }
}
```

| 对比项 | 抽象类 | 接口 |
|--------|--------|------|
| 关键字 | `abstract class` | `interface` |
| 继承/实现 | 单继承 `extends` | 多实现 `implements` |
| 构造方法 | 有 | 无 |
| 成员变量 | 任意类型 | `public static final` |
| 方法 | 抽象方法 + 普通方法 | 抽象方法 + default + static |
| 设计层面 | "is-a" 关系 | "can-do" 能力 |

---

## 三、集合框架

### 3.1 整体结构

```
Iterable
├── Collection
│   ├── List（有序，可重复）
│   │   ├── ArrayList
│   │   ├── LinkedList
│   │   └── Vector / Stack
│   ├── Set（无序，不可重复）
│   │   ├── HashSet
│   │   ├── LinkedHashSet
│   │   └── TreeSet
│   └── Queue（队列）
│       ├── PriorityQueue
│       ├── ArrayDeque
│       └── LinkedList
└── Map（键值对）
    ├── HashMap
    ├── LinkedHashMap
    ├── TreeMap
    └── Hashtable / ConcurrentHashMap
```

### 3.2 核心实现类对比

| 实现类 | 底层结构 | 线程安全 | 允许 null | 有序性 | 性能特点 |
|--------|----------|----------|-----------|--------|----------|
| **ArrayList** | 动态数组 | 否 | key/value 均允许 | 按索引有序 | 随机访问 O(1)，增删 O(n) |
| **LinkedList** | 双向链表 | 否 | key/value 均允许 | 按插入有序 | 首尾增删 O(1)，随机访问 O(n) |
| **Vector** | 动态数组 | 是（synchronized） | key/value 均允许 | 按索引有序 | 性能较差，已过时 |
| **HashSet** | HashMap | 否 | 允许一个 null key | 无序 | 增删查均 O(1) |
| **LinkedHashSet** | LinkedHashMap | 否 | 允许一个 null key | 按插入有序 | O(1)，维护链表开销 |
| **TreeSet** | 红黑树 | 否 | 不允许 null | 自然排序/Comparator | 增删查均 O(log n) |
| **HashMap** | 数组+链表+红黑树 | 否 | key/value 均允许 | 无序 | 增删查均 O(1) |
| **LinkedHashMap** | HashMap+双向链表 | 否 | key/value 均允许 | 按插入/访问有序 | O(1)，可实现 LRU 缓存 |
| **TreeMap** | 红黑树 | 否 | key 不允许 null | 按 key 排序 | 增删查均 O(log n) |
| **ConcurrentHashMap** | 分段锁/CAS | 是 | key/value 均不允许 null | 无序 | 高并发性能优秀 |

### 3.3 常用操作示例

```java
// ArrayList
List<String> list = new ArrayList<>();
list.add("A");
list.remove(0);
list.get(0);
list.set(0, "B");

// HashMap
Map<String, Integer> map = new HashMap<>();
map.put("key", 1);
map.getOrDefault("key", 0);
map.forEach((k, v) -> System.out.println(k + "=" + v));

// Java 8 Stream 操作
List<String> result = list.stream()
    .filter(s -> s.length() > 3)
    .map(String::toUpperCase)
    .sorted()
    .collect(Collectors.toList());
```

---

## 四、多线程

### 4.1 线程创建方式对比

| 方式 | 实现方式 | 优点 | 缺点 | 适用场景 |
|------|----------|------|------|----------|
| **继承 Thread** | `class MyThread extends Thread` | 简单直接 | 无法继承其他类 | 快速原型，简单任务 |
| **实现 Runnable** | `class MyTask implements Runnable` | 可实现多个接口 | 无法获取返回值 | 推荐，解耦任务与线程 |
| **实现 Callable + FutureTask** | `class MyTask implements Callable<V>` | 有返回值、可抛异常 | 稍复杂 | 需要获取执行结果 |
| **线程池 ExecutorService** | `Executors.newFixedThreadPool(n)` | 复用线程、管理资源 | 需合理配置参数 | 生产环境推荐 |

### 4.2 线程池

```java
// 常用线程池
ExecutorService pool1 = Executors.newFixedThreadPool(5);      // 固定大小
ExecutorService pool2 = Executors.newSingleThreadExecutor();  // 单线程
ExecutorService pool3 = Executors.newCachedThreadPool();       // 按需创建
ScheduledExecutorService pool4 = Executors.newScheduledThreadPool(5); // 定时

// 推荐：手动创建 ThreadPoolExecutor
ThreadPoolExecutor executor = new ThreadPoolExecutor(
    4,                                      // 核心线程数
    8,                                      // 最大线程数
    60L, TimeUnit.SECONDS,                  // 空闲线程存活时间
    new LinkedBlockingQueue<>(100),          // 工作队列
    new ThreadFactoryBuilder().setNameFormat("worker-%d").build(),  // 线程工厂
    new ThreadPoolExecutor.CallerRunsPolicy()  // 拒绝策略
);

// 线程池参数含义
// 1. corePoolSize    — 核心线程数，即使空闲也不会回收
// 2. maximumPoolSize — 最大线程数
// 3. keepAliveTime   — 非核心线程空闲存活时间
// 4. unit            — 时间单位
// 5. workQueue       — 任务队列
// 6. threadFactory   — 线程创建工厂
// 7. handler         — 拒绝策略（AbortPolicy / CallerRunsPolicy / DiscardPolicy / DiscardOldestPolicy）
```

### 4.3 同步机制

```java
// 1. synchronized 关键字
public synchronized void method() { ... }     // 同步实例方法（锁 this）
public static synchronized void method2() { ... } // 同步静态方法（锁 Class）
synchronized (lockObject) { ... }             // 同步代码块

// 2. Lock 接口
ReentrantLock lock = new ReentrantLock();
lock.lock();
try {
    // 临界区
} finally {
    lock.unlock();  // 必须在 finally 中释放锁
}

// 3. volatile 关键字
private volatile boolean running = true;  // 保证可见性，禁止指令重排

// 4. CAS 原子操作
AtomicInteger count = new AtomicInteger(0);
count.incrementAndGet();  // 线程安全的自增
```

### 4.4 死锁

```java
// 死锁条件（四个条件同时满足）
// 1. 互斥条件：资源一次只能被一个线程持有
// 2. 持有并等待：线程持有资源并等待其他资源
// 3. 不可剥夺：已获得的资源不能被强制收回
// 4. 循环等待：线程之间形成资源的循环等待链

// 预防策略
// - 按固定顺序获取锁
// - 使用 tryLock 设置超时时间
// - 尽量减少锁的粒度和持有时间
```

---

## 五、IO流

### 5.1 分类体系

| 分类维度 | 类型 | 说明 |
|----------|------|------|
| **数据单位** | 字节流 | InputStream / OutputStream，处理二进制数据 |
| | 字符流 | Reader / Writer，处理文本数据（自动处理编码） |
| **角色** | 节点流 | 直接连接数据源（FileInputStream 等） |
| | 处理流 | 包装节点流，增强功能（BufferedInputStream 等） |

### 5.2 常用流

```java
// 字节流
FileInputStream fis = new FileInputStream("file.txt");
FileOutputStream fos = new FileOutputStream("out.txt");
fis.read();          // 读取一个字节
fos.write(byte[]);   // 写入字节数组

// 字符流
FileReader fr = new FileReader("file.txt");
FileWriter fw = new FileWriter("out.txt");
fr.read(char[]);     // 读取字符数组

// 缓冲流（性能优化，内部维护缓冲区）
BufferedReader br = new BufferedReader(new FileReader("file.txt"));
BufferedWriter bw = new BufferedWriter(new FileWriter("out.txt"));
BufferedInputStream bis = new BufferedInputStream(new FileInputStream("file.dat"));
BufferedOutputStream bos = new BufferedOutputStream(new FileOutputStream("out.dat"));

// 逐行读取
String line;
while ((line = br.readLine()) != null) {
    System.out.println(line);
}

// try-with-resources（自动关闭）
try (BufferedReader reader = new BufferedReader(new FileReader("file.txt"))) {
    String content = reader.lines().collect(Collectors.joining("\n"));
}
```

### 5.3 序列化

```java
// 实现 Serializable 接口
public class User implements Serializable {
    private static final long serialVersionUID = 1L;  // 版本控制
    private String name;
    private transient String password;  // transient 字段不参与序列化
}

// 序列化
ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream("user.dat"));
oos.writeObject(user);
oos.close();

// 反序列化
ObjectInputStream ois = new ObjectInputStream(new FileInputStream("user.dat"));
User user = (User) ois.readObject();
ois.close();
```

---

## 六、泛型

### 6.1 泛型类

```java
public class Box<T> {
    private T content;

    public void set(T content) { this.content = content; }
    public T get() { return content; }
}

// 使用
Box<String> stringBox = new Box<>();
stringBox.set("Hello");
String value = stringBox.get();  // 无需强转
```

### 6.2 泛型方法

```java
public <T> T getObject(T[] array, int index) {
    return array[index];
}

// 类型推断
String result = getObject(new String[]{"A", "B"}, 0);
```

### 6.3 通配符

| 通配符 | 含义 | 示例 |
|--------|------|------|
| `<?>` | 无界通配符，接受任意类型 | `List<?> list` |
| `<? extends T>` | 上界通配符，T 及其子类 | `List<? extends Number> list` |
| `<? super T>` | 下界通配符，T 及其父类 | `List<? super Integer> list` |

> **PECS 原则**: Producer Extends, Consumer Super
> - 从集合**读取**数据用 `<? extends T>`
> - 向集合**写入**数据用 `<? super T>`

```java
// 上界通配符 —— 只读
public double sum(List<? extends Number> list) {
    return list.stream().mapToDouble(Number::doubleValue).sum();
}

// 下界通配符 —— 可写
public void addNumbers(List<? super Integer> list) {
    list.add(1);
    list.add(2);
}
```

---

## 七、异常处理

### 7.1 异常体系

```
Throwable
├── Error（不可恢复，程序不应捕获）
│   ├── OutOfMemoryError
│   ├── StackOverflowError
│   └── NoClassDefFoundError
└── Exception
    ├── 受检异常（Checked Exception，必须处理）
    │   ├── IOException
    │   ├── SQLException
    │   └── ClassNotFoundException
    └── 非受检异常（Unchecked Exception / RuntimeException）
        ├── NullPointerException
        ├── ArrayIndexOutOfBoundsException
        ├── ClassCastException
        ├── IllegalArgumentException
        └── ArithmeticException
```

### 7.2 try-catch-finally

```java
try {
    // 可能抛出异常的代码
    int result = 10 / 0;
} catch (ArithmeticException e) {
    // 处理特定异常
    System.out.println("算术异常: " + e.getMessage());
} catch (Exception e) {
    // 处理其他异常（父类异常放最后）
    e.printStackTrace();
} finally {
    // 无论如何都会执行（常用于释放资源）
    System.out.println("finally 块");
}

// Java 7+ 多异常捕获
try {
    // ...
} catch (IOException | SQLException e) {
    // 同时捕获多种异常
    log.error("操作失败", e);
}

// try-with-resources
try (FileReader fr = new FileReader("file.txt");
     BufferedReader br = new BufferedReader(fr)) {
    // 自动调用 close()
}
```

### 7.3 自定义异常

```java
// 自定义受检异常
public class BusinessException extends Exception {
    private int code;

    public BusinessException(String message, int code) {
        super(message);
        this.code = code;
    }

    public int getCode() { return code; }
}

// 自定义非受检异常
public class InvalidParamException extends RuntimeException {
    public InvalidParamException(String message) {
        super(message);
    }
}

// 使用
public void process() throws BusinessException {
    throw new BusinessException("业务处理失败", 500);
}

// 抛出自定义异常
public void validate(String input) {
    if (input == null || input.isBlank()) {
        throw new InvalidParamException("参数不能为空");
    }
}
```

---

## 八、JVM

### 8.1 内存模型

```
┌─────────────────────────────────────────────┐
│                  JVM 内存结构                 │
├─────────────────────────────────────────────┤
│  线程私有          │        线程共享           │
│  ─────────         │        ─────────         │
│  · 虚拟机栈        │  · 堆 (Heap)             │
│    - 栈帧          │    - 新生代               │
│    - 局部变量表    │      - Eden 区            │
│    - 操作数栈      │      - Survivor 区       │
│    - 动态链接      │    - 老年代               │
│                    │                          │
│  · 本地方法栈      │  · 方法区/元空间          │
│                    │    - 类信息               │
│  · 程序计数器      │    - 常量池               │
│    - 当前执行行号  │    - 静态变量             │
└─────────────────────────────────────────────┘
```

| 区域 | 线程共享 | 存储内容 | 可能的异常 |
|------|----------|----------|------------|
| 堆 (Heap) | 共享 | 对象实例、数组 | OutOfMemoryError |
| 虚拟机栈 | 私有 | 栈帧（局部变量、操作数栈等） | StackOverflowError / OOM |
| 方法区/元空间 | 共享 | 类信息、常量、静态变量 | OutOfMemoryError |
| 程序计数器 | 私有 | 当前线程执行的字节码行号 | 无 |
| 本地方法栈 | 私有 | Native 方法 | StackOverflowError / OOM |

### 8.2 垃圾回收 (GC)

**回收算法**:

| 算法 | 原理 | 优点 | 缺点 |
|------|------|------|------|
| 标记-清除 | 标记可回收对象，统一清除 | 简单 | 内存碎片 |
| 标记-整理 | 标记后将存活对象移到一端 | 无碎片 | 移动开销 |
| 复制算法 | 分两半，每次只用一半，GC 时复制存活对象 | 高效无碎片 | 浪费空间 |
| 分代收集 | 新生代用复制，老年代用标记-整理 | 综合最优 | 实现复杂 |

**垃圾收集器**:

| 收集器 | 区域 | 算法 | 特点 |
|--------|------|------|------|
| Serial | 新生代 | 复制 | 单线程，简单高效，Client 模式默认 |
| ParNew | 新生代 | 复制 | Serial 的多线程版本 |
| Parallel Scavenge | 新生代 | 复制 | 吞吐量优先 |
| Serial Old | 老年代 | 标记-整理 | 单线程 |
| CMS | 老年代 | 标记-清除 | 低延迟，已废弃 |
| G1 | 全堆 | 分区 + 混合 | 可预测停顿，JDK 9+ 默认 |
| ZGC | 全堆 | 染色指针 + 读屏障 | 超低延迟（<10ms） |

**GC Roots**:
- 虚拟机栈中引用的对象
- 方法区中静态属性引用的对象
- 方法区中常量引用的对象
- 本地方法栈中 JNI 引用的对象

### 8.3 类加载

**加载过程**: 加载 -> 验证 -> 准备 -> 解析 -> 初始化

**类加载器**:

| 类加载器 | 加载路径 | 说明 |
|----------|----------|------|
| Bootstrap ClassLoader | `JAVA_HOME/lib` | C++ 实现，加载核心类库 |
| Extension ClassLoader | `JAVA_HOME/lib/ext` | 加载扩展类库 |
| Application ClassLoader | classpath | 加载应用类，自定义类加载器的父加载器 |
| 自定义 ClassLoader | 指定路径 | 通过继承 `ClassLoader` 实现 |

**双亲委派模型**:

```
自定义 ClassLoader
       ↓ 委派
Application ClassLoader
       ↓ 委派
Extension ClassLoader
       ↓ 委派
Bootstrap ClassLoader
       ↑ 返回
```

- 收到加载请求时，先委托父加载器加载
- 父加载器无法加载时，才自己尝试加载
- **作用**: 避免类的重复加载，保护核心类不被篡改

---

## 速查表

| 场景 | 推荐方案 |
|------|----------|
| 随机访问多，增删少 | ArrayList |
| 频繁增删，尤其首尾 | LinkedList |
| 键值存储，无序 | HashMap |
| 键值存储，按 key 排序 | TreeMap |
| 键值存储，按插入顺序 | LinkedHashMap |
| 高并发线程安全 Map | ConcurrentHashMap |
| 线程池 | ThreadPoolExecutor（手动配置） |
| 读写锁 | ReentrantReadWriteLock |
| 文件读取 | try-with-resources + BufferedReader |
| 大文件处理 | NIO (FileChannel) / Files.lines() |
| 序列化 | Serializable + transient 控制字段 |
