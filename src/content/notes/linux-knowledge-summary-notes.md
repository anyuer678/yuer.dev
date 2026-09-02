---
title: "Linux知识点汇总"
date: "2025-07"
type: "learning"
tags: [Linux, 文件系统, Shell, 进程, 网络]
summary: "Linux操作系统知识点汇总，覆盖文件系统、用户进程网络、Shell脚本、系统安全等章节"
---

# Linux操作系统 知识点汇总

---

## 精简目录

### CH01 开源操作系统概述
- Linux定义与发展史
- 开源协议(GPL/GNU/FSF)
- Linux发行版(CentOS/Ubuntu/openEuler)
- Linux系统特点
- 安装与界面
- Android架构(四层/四大组件/沙箱)
- HarmonyOS(多内核异构/分布式/ArkTS)

### CH02 文件与文件系统
- 终端与Shell
- 命令语法与路径
- FHS目录结构
- 常用命令(ls/cd/pwd/cat/less/head/tail/touch/mkdir/cp/rm)
- 文件搜索(which/whereis/locate/find)
- UGO权限模型
- chmod/chown/chgrp
- 磁盘概念(MBR/GPT)
- 文件系统(ext2-4/xfs)
- 索引式文件系统(inode/超级区块/数据区块)
- 硬链接与软链接

### CH03 用户、进程和网络
- 用户管理(/etc/passwd/shadow/group)
- UID分类/有效用户组
- useradd/passwd/usermod/userdel
- su/sudo
- ps命令/nice值/守护进程
- /proc伪文件系统
- 进程管理(&/fg/bg/jobs/kill)
- systemctl
- 网络配置文件
- ifconfig/route/ping/netstat
- SSH/Telnet

### CH04 Shell脚本编程
- 数据流重定向(stdin/stdout/stderr)
- 管道(|)
- Shell三剑客(grep/sed/awk)
- Shell脚本基础
- 通配符(*,?,[])
- VIM编辑器
- 变量(echo/read/declare/export)
- test命令
- 脚本参数($0,$#,$@)
- 条件语句(if/case)
- 循环语句(while/until/for)
- 函数与调试

### CH05 系统安全与防火墙
- umask
- 特殊权限(SUID/SGID/SBIT)
- ACL权限
- SELinux(DAC/MAC/三种模式)
- 防火墙类型(包过滤/代理)
- iptables(四表五链)
- firewall-cmd

### CH06 引导、日志和计划任务
- 引导流程(BIOS→GRUB→内核→init)
- BIOS与UEFI对比
- GRUB配置
- 运行级别(0-6)
- init与systemd
- 日志系统(journald/rsyslogd/logrotate)
- journalctl
- 日志等级
- at任务
- crontab

### CH07 文件服务器
- wget/scp
- NFS(配置/挂载)
- Samba(SMB/CIFS)
- FTP(主动/被动模式)
- vsftpd
- Git/GitHub/GitLab

### CH08 Web服务器和Nginx入门
- HTTP协议
- Apache特点
- Nginx特点(C10K/异步非阻塞)
- Apache vs Nginx对比
- Nginx配置结构
- Nginx进程(master/worker)
- 正向代理/反向代理
- Nginx反向代理配置

### CH09 Nginx进阶
- HTTPS配置
- 负载均衡(RR/权重/IP哈希/fair/URL哈希)
- 哈希一致性
- Nginx防盗链
- fork/exec/system函数
- 进程同步(wait/僵尸进程)
- 信号机制(SIGINT/SIGKILL/SIGTERM)

### CH10 缓存服务器和容器简介
- 缓存概念(本地/分布式)
- Redis(特点/数据类型/持久化/常见问题)
- Docker(镜像/容器/仓库)
- Kubernetes
- 软件架构演进

---

## 详细版

---

## CH01 开源操作系统概述

### 1.1 Linux定义
- Linux是一种免费的Unix类操作系统
- 由Linus Torvalds创建
- 在GNU通用公共许可证(GPL)下发布
- 源代码对所有人免费开放

### 1.2 Linux发展史
- **1960年代初**：MIT开发分时操作系统CTSS(Compatible Time-Sharing System)
- **1965-1969年**：Multics项目
- **1969年**：Ken Thompson用汇编语言编写UNICS，运行在DEC PDP-7上，第一次以文件为基本单位
- **C语言重写**：Ken Thompson与Dennis Ritchie发明C语言，重写UNICS内核，正式命名为UNIX
- **1973年**：贝尔实验室与加州大学伯克利分校合作
- **1977年**：发布BSD系统(Berkeley Software Distribution)
- **1979年**：AT&T推出System V，收回Unix版权
- **1984-1986年**：Andrew Tanenbaum完成Minix系统
- **1984年**：GNU项目与FSF基金会成立

### 1.3 开源协议
- **GNU**：GNU's Not Unix
- **FSF**：Free Software Foundation
- **GPL**：GNU General Public License
- "Free software"指用户可以运行、复制、分发、研究、更改和改进软件
- 强调"自由"而非"免费"

### 1.4 GNU项目主要成果
- Emacs（文本编辑器）
- gcc（编译器）
- glibc（C库）
- bash（Shell）

### 1.5 Linux发行版
- **CentOS**：基于RHEL源码编译，稳定性好，每版10年支持，约两年发行新版
- **Ubuntu**：基于Debian和Gnome桌面，适合初学者，有中国衍生版Ubuntu Kylin(优麒麟)
- **openEuler**：华为EulerOS开源版，面向企业级服务器，支持鲲鹏处理器

### 1.6 Linux系统特点
- 与Unix兼容：按POSIX 1003.1标准开发
- 广泛的硬件运行环境：内核精简，对运行条件要求低
- 强大的网络功能：支持Ethernet、PPP、SLIP、NFS、IPX/SPX等协议
- 多用户多任务支持：多个用户可同时使用，多个进程可并行运行
- 多硬件平台支撑和可移植性
- 良好的设备独立性：设备抽象为文件，统一接口

### 1.7 Linux安装与界面
- 三种安装方式：直接硬件安装、虚拟机安装、云服务器安装
- 虚拟机：VMware、Parallel Desktop、VirtualBox、HyperV
- 用户界面：图形化(GNOME/UKUI)、命令行CLI、CLI模拟器

### 1.8 Android操作系统
- 由Android Inc.开发，2005年被Google收购
- 四层架构：Linux内核层→系统运行库和运行时层→应用框架层→应用层
- 宏内核架构，基于Linux内核
- 四大组件：Activity、Service、Content Provider、Broadcast Receiver
- Binder IPC驱动实现进程间通信
- 应用沙箱：每个应用分配独立Linux用户ID，在独立进程空间运行
- 早期使用Dalvik虚拟机，后改用ART(Android Runtime)
- 采用Apache License 2.0开源（内核部分GPL）

### 1.9 HarmonyOS鸿蒙操作系统
- 2019年8月发布，华为面向万物互联的分布式操作系统
- 多内核异构架构：大型设备用Linux内核，小型IoT用LiteOS内核
- HarmonyOS Next：完全剔除Android代码，转向自研微内核，不再兼容APK
- 分布式能力：分布式软总线、分布式数据管理、分布式安全
- 全栈自研：ArkTS语言、DevEco Studio、ArkUI框架

---

## CH02 文件与文件系统

### 2.1 终端与命令行
- **终端(Terminal)**：最初指连接主机的键盘+显示器(TTY-Teletypewriter)
- **终端模拟器**：在图形界面中模拟终端功能的软件
- **Shell**：运行在终端中的程序，解释命令与操作系统交互
- 常见Shell：bash(默认)、zsh、fish、dash、tcsh

### 2.2 命令提示符
- 格式：[用户名@机器名 工作目录]$
- $表示普通用户，#表示超级管理员(root)

### 2.3 命令语法
- 格式：命令 [-选项] [选项参数] [命令参数]
- 大小写严格区分，一般为小写
- 选项分长格式(--)和短格式(-)

### 2.4 常用路径
- /：根目录
- ~/：用户主目录
- ./：当前目录
- ../：上一级目录

### 2.5 CLI技巧
- 命令历史：上下箭头
- 自动补全：Tab键
- 查看手册：man命令或命令 -h/--help

### 2.6 Linux文件系统特点
- 一切皆文件：普通文件和特殊文件（硬件、内存、进程等）
- 单根、分层、树形结构，根目录用"/"表示
- 文件名严格区分大小写
- "."开始的文件名为隐藏文件
- 后缀名不是必需要素

### 2.7 FHS目录结构
| 目录 | 用途 |
|------|------|
| /bin | 可执行二进制文件 |
| /boot | 引导目录 |
| /dev | 硬件设备文件 |
| /etc | 系统配置文件 |
| /home | 家目录 |
| /root | 超级管理员家目录 |
| /var | 内容变动频繁的文件（日志等） |
| /usr | 软件安装目录 |
| /tmp | 临时文件目录 |
| /proc | 系统实时信息 |
| /opt | 用户安装的大型应用软件 |
| /sbin | 超级管理员权限的可执行文件 |
| /lib | 系统运行的库文件 |
| /media | 外部挂载设备 |
| /sys | 系统底层信息 |

### 2.8 目录操作命令
- **pwd**：显示当前工作目录，-P显示真实路径
- **ls**：列出目录内容
  - -a 全部（含隐藏）
  - -l 长格式
  - -d 目录本身
  - -h 可读大小
  - -r 反序
  - -S 按大小
  - -t 按时间
- **cd**：切换目录（. .. - ~）
- **du**：显示目录大小（-h -a -s）

### 2.9 文件查看命令
- **cat**：一次性显示文件内容
- **less**：分页显示（空格/回车/b/y/q/=/搜索）
- **head**：显示文件前n行
- **tail**：显示文件后n行，-f实时追踪
- **od**：以进制方式显示

### 2.10 文件操作命令
- **touch**：修改时间戳，不存在则新建
- **mkdir**：创建目录（-m指定权限，-p递归创建）
- **cp**：拷贝文件（-a相当于-pdr，-d复制链接本身，-i交互，-p保留属性，-r递归）
- **rm**：删除文件（-f强制，-i交互，-r递归）

### 2.11 文件搜索命令
- **which**：在$PATH中查找命令
- **whereis**：在系统常用目录内查找
- **locate**：在索引数据库内搜索（-i忽略大小写，-c输出数量，-r正则）
- **find**：通用查找
  - 时间：-mtime(修改时间)、-atime(访问时间)、-ctime(属性更改时间)
  - -mtime +3（3天前）、-mtime -3（3天内）
  - 用户：-user、-uid
  - 权限：-perm
  - 大小：-size
  - 类型：-type(f文件、d目录)
  - -exec 命令 {} \;

### 2.12 UGO权限模型
- U：文件所有者(User)
- G：所有者所在组(Group)
- O：其他用户(Other)
- 9个权限字符，3个一组，分别代表rwx

### 2.13 文件类型标识
| 标识 | 类型 |
|------|------|
| d | 目录 |
| - | 普通文件 |
| l | 链接 |
| b | 块设备 |
| c | 字符设备 |

### 2.14 chmod命令
- 数字方式：chmod 755 file
- 字符方式：chmod u+x file
  - 对象：u(所有者) g(组) o(其他) a(所有人)
  - 动作：+(增加) -(去除) =(设置)
  - 权限：r(读) w(写) x(执行)

### 2.15 权限对照表
| 字符 | 八进制 |
|------|--------|
| --- | 0 |
| --x | 1 |
| -w- | 2 |
| -wx | 3 |
| r-- | 4 |
| r-x | 5 |
| rw- | 6 |
| rwx | 7 |

### 2.16 chown/chgrp
- chown：修改文件所有者
- chgrp：修改文件所属组
- -R：递归修改

### 2.17 权限对文件和目录的意义
- **文件权限**：
  - r：读取内容
  - w：编辑内容（不含删除）
  - x：可执行（与后缀名无关）
- **目录权限**：
  - r：用ls查看目录内容
  - w：新建/删除/重命名文件
  - x：能否进入目录

### 2.18 磁盘基本概念
- 磁头(head)、柱面(cylinder)、扇区(sector)
- MBR：最多4个主分区，最大2TB
- GPT：支持超2TB

### 2.19 文件系统类型
- ext2：无日志，适合小容量
- ext3：支持日志，适合稳定型服务器
- ext4：支持日志、延迟分配、范围分配
- xfs：CentOS 7.x默认

### 2.20 磁盘管理三步骤
1. fdisk/gdisk分区
2. mke2fs格式化
3. mount挂载

### 2.21 索引式文件系统
- **超级区块**：记录文件系统整体信息
- **inode**：描述文件元信息的结构体，一个文件占用一个inode
- **数据区块**：实际保存文件内容

### 2.22 硬链接与软链接
- **硬链接**：
  - 多个文件名共享同一个inode
  - 删除任意一个不影响其他
  - 不能跨文件系统
  - 不能链接目录
- **软链接**：
  - 存储源文件路径，有自己的inode
  - 源文件删除后变成悬挂链接
  - 可以跨文件系统
- **ln命令**：ln [-sf] 源文件 目标文件
  - -s创建软链接
  - -f强制覆盖

---

## CH03 用户、进程和网络

### 3.1 用户与用户组
- 用户分为：所有者(User)、组内用户(Group)、其他用户(Other)
- 每个用户必须隶属一个或多个组

### 3.2 用户相关文件
| 文件 | 内容 |
|------|------|
| /etc/passwd | 用户账号信息（账号名:密码:UID:GID:用户信息:主文件夹:Shell） |
| /etc/shadow | 用户密码信息 |
| /etc/group | 组账号信息 |
| /etc/gshadow | 组管理及密码信息 |

### 3.3 UID分类
- 0：系统管理员(root)
- 1-499：系统账号
- 500+：一般用户

### 3.4 初始用户组和有效用户组
- 有效用户组决定新建文件的属性
- groups命令查看用户所属用户组
- newgrp命令修改有效用户组

### 3.5 账号管理命令
- **useradd**：新增用户（-u UID, -g 初始组, -G 有效组, -d 主目录, -s Shell, -r 系统账号）
- **passwd**：设定/修改密码（-l锁定, -u解锁, -S显示信息, --stdin从流输入）
- **usermod**：修改用户
- **userdel**：删除用户
- **groupadd/groupmod/groupdel**：管理组

### 3.6 su和sudo
- **su**：切换用户
  - 无参数：只切换用户，不切换环境
  - - ：切换用户并切换环境
  - -c：执行单个命令
- **sudo**：以其他用户身份执行操作
  - 配置文件：/etc/sudoers（通过visudo编辑）
  - 使用sudo而非su的原因：
    1. 最小权限原则
    2. 安全审计与日志记录
    3. 不暴露root密码
    4. 权限分级与团队协作

### 3.7 ps命令
- ps -aux：观察所有进程
- 常用属性：UID、PID、PPID、PRI、STAT、TTY、TIME、COMMAND
- STAT状态：R(运行)、S(睡眠)、D(不可中断)、T(停止)、Z(僵尸)

### 3.8 nice值
- 用户可控优先级，范围[-20,20]
- 值越小优先级越高

### 3.9 守护进程(Daemon)
- 后台运行，不依附终端
- TTY显示为?

### 3.10 /proc伪文件系统
- 不占实际磁盘空间
- 每个进程在/proc/[pid]/下有自己的信息

### 3.11 进程管理命令
- **&**：后台执行
- **fg**：将作业调回前台
- **bg**：在后台继续运行
- **jobs**：显示所有作业
- **Ctrl+Z**：挂起前台进程
- **Ctrl+C**：终止前台进程
- **kill**：发送信号终止进程（作业ID以%开始）

### 3.12 systemctl
- start：启动服务
- stop：停止服务
- restart：重启服务
- reload：重载配置
- enable：设置开机启动
- disable：禁止开机启动

### 3.13 网络配置文件
| 文件 | 内容 |
|------|------|
| /etc/sysconfig/network-scripts/ifcfg-网卡名 | IP地址、子网掩码、网关 |
| /etc/sysconfig/network | 主机名 |
| /etc/resolv.conf | DNS |
| /etc/hosts | 私有IP主机名映射 |

### 3.14 网络命令
- **ifconfig**：查询、设置网卡和IP
- **route**：查看、配置路由表
- **ip**：整合式命令
- **ping**：发送ICMP数据包测试连通性（-c次数, -n数字格式）
- **traceroute**：路由跟踪
- **netstat**：查看网络状态（-t TCP, -u UDP, -l 监听, -n 数字, -p 进程）

### 3.15 Telnet
- 早期协议，默认端口23
- 明文传输，不安全

### 3.16 SSH
- 基于加密机制的安全连接协议，默认端口22
- 命令行登录：ssh user@host
- 公钥登录：ssh-keygen生成密钥对 → ssh-copy-id上传公钥 → ssh直接登录
- 安全通信原理：先用非对称加密交换密钥，再用对称加密通信

---

## CH04 Shell脚本编程

### 4.1 数据流重定向
- 标准输入stdin：代码0，符号<或<<
- 标准输出stdout：代码1，符号>或>>
- 标准错误stderr：代码2，符号2>或2>>
- /dev/null：黑洞，忽略输出
- <<：Here Document，设定结束关键字

### 4.2 管道命令
- 管道符号"|"，仅处理stdout，忽略stderr
- **cut**：切割行内字段（-d分隔符, -f字段, -c字符位置）
- **sort**：排序（-f忽略大小写, -b忽略空格, -r反序, -u去重）
- **wc**：统计（-l行数, -w单词数, -m字符数）
- **uniq**：去重
- **grep**：筛选行（-c计数, -i忽略大小写, -n显示行号, -v反向匹配）

### 4.3 Shell三剑客
- **grep**：筛选符合模式的文本行
- **sed**：查找替换、插入、删除
  - -n：只输出匹配行
  - -i：直接修改文件（.bak备份）
  - 指令：d删除, p打印, a追加, i插入, c替换, s///替换
- **awk**：按列处理、格式化输出
  - -F：指定分隔符
  - $1,$2：列，$0：整行
  - BEGIN/END模式

### 4.4 Shell脚本基础
- 可执行的纯文本文件，由多个Shell命令组成
- 从上至下、从左至右依次解释执行
- #是注释，#!指定Shell版本
- 一般以.sh为后缀
- 两种执行方式：直接命令行执行、bash进程执行

### 4.5 命令类型
- 内部命令：Shell自身的一部分
- 外部命令：通过$PATH搜索的可执行程序
- type命令查看命令类型（-t类型, -p路径, -a所有）

### 4.6 通配符
- *：匹配零个或多个任意字符
- ?：匹配任意一个字符
- [字符集]：匹配字符集中的一个字符
- [!字符集]：匹配不在字符集中的字符
- [[:字符类:]]：[:alnum:], [:alpha:], [:digit:], [:lower:], [:upper:]

### 4.7 VIM编辑器
- 两种模式：命令模式和插入模式
- 退出：:wq(保存退出) :q!(不保存退出)
- 设置：syntax on/off, set number/nonumber

### 4.8 Shell变量
- 变量表示：$变量名或${变量名}
- 设置：变量名=变量值，取消：unset
- echo：显示文本（单引号原样，双引号可转义）
- read：从终端输入（-p提示, -t超时）
- declare：声明类型（-a数组, -i整型, -x环境变量, -r只读）
- export：将自定义变量转化为环境变量
- 数值运算：$(())或declare -i

### 4.9 test命令
- 测试文件：-e(存在), -f(文件), -d(目录), -r(可读), -w(可写), -x(可执行)
- 测试值：-eq(等于), -ne(不等于)
- 测试字符串：str1=str2, -z(空)

### 4.10 脚本参数
- $0：脚本名
- $1-$n：参数
- $#：总参数个数
- $@：所有参数字符串

### 4.11 条件语句
- **if语句**：
  - 三种形态：if-fi, if-else-fi, if-elif-else-fi
  - 条件用[]，与括号间有空格
- **case语句**：
  - 类似switch，每个分支以;;结束

### 4.12 循环语句
- **while**：条件成立时循环
- **until**：条件不成立时循环
- **for**：遍历列表或C风格循环

### 4.13 函数与调试
- 函数定义必须在脚本最前面
- 函数内用$1、$2访问参数
- 调试：sh -n(语法检查), sh -v(执行前显示), sh -x(执行后显示)

---

## CH05 系统安全与防火墙

### 5.1 默认权限与umask
- 新建文件默认权限 = 666 - umask值
- 新建目录默认权限 = 777 - umask值

### 5.2 特殊权限
| 权限 | 数字 | 作用 |
|------|------|------|
| SUID | 4 | 设定二进制程序执行时的用户权限，仅对二进制文件有效 |
| SGID | 2 | 设定执行时的组权限 |
| SBIT | 1 | 防止其他用户删除目录下文件 |

### 5.3 ACL权限
- ACL(Access Control List)：访问控制列表
- 在UGO模型之上提供更细粒度的权限管理
- setfacl：设定ACL（-m设定, -x删除, -b清除, -R递归）
- getfacl：查看ACL
- ACL参数：u:[用户]:[rwx] g:[组]:[rwx] m:[rwx]

### 5.4 SELinux
- 由NSA开发，解决"内部员工误用"问题
- DAC(自主访问控制) → MAC(委托访问控制)
- 主体：进程；目标：资源/文件；策略：规则集
- 安全上下文：identify:role:type
- 三种运行模式：
  - enforcing：强制模式
  - Permissive：宽容模式（只警告）
  - disabled：关闭
- 配置文件：/etc/selinux/config

### 5.5 防火墙类型
- 包过滤防火墙：在网络层依据规则对数据包进行选择
- 代理服务防火墙：链路级网关，中间由代理服务转发

### 5.6 Linux防火墙技术体系
- Netfilter：内核包过滤框架
- iptables：CentOS 6.x命令接口
- nftables：Linux 3.13引入，取代iptables
- firewall：CentOS 7.x改进版
- ufw：Ubuntu的防火墙工具

### 5.7 iptables四表五链
- **四表**：filter(默认)、nat、mangle、raw
- **五链**：prerouting、input、forward、output、postrouting
- **规则动作**：ACCEPT、DROP、REJECT、SNAT、DNAT、LOG

### 5.8 firewall-cmd
- 开启/关闭：systemctl start/stop firewalld.service
- 开放端口：firewall-cmd --add-port=80/tcp --permanent
- 重新加载：firewall-cmd --reload

---

## CH06 引导、日志和计划任务

### 6.1 引导流程
1. **BIOS/UEFI固件阶段**：硬件自检(POST)，初始化CPU、内存
2. **GRUB引导加载程序阶段**：提供启动菜单，加载内核和initramfs
3. **内核加载与初始化**：硬件初始化，挂载根文件系统，启动init(PID=1)
4. **init系统初始化**：启动服务、挂载文件系统、启动登录管理器

### 6.2 BIOS与UEFI对比
| 特性 | BIOS | UEFI |
|------|------|------|
| 分区表 | MBR(最多2TB) | GPT(超2TB) |
| 界面 | 文本 | 图形化 |
| 安全 | 无 | Secure Boot |

### 6.3 GRUB配置
- /etc/default/grub：默认设置
- /boot/grub/grub.cfg：主配置脚本
- 关键参数：default、timeout、root、kernel、initrd

### 6.4 运行级别
| 级别 | 含义 |
|------|------|
| 0 | 关机 |
| 1 | 单用户模式 |
| 2 | 无网络的多用户 |
| 3 | 普通多用户 |
| 4 | 未使用 |
| 5 | 图形化界面 |
| 6 | 重启 |

### 6.5 init与systemd
- init缺点：串行启动、脚本复杂
- systemd特点：
  - 并行启动
  - 服务单元(unit)
  - systemctl统一管理
  - 向下兼容init.d
- 服务类型：.service、.socket、.target

### 6.6 日志架构
- systemd-journald：二进制存储，收集日志
- rsyslogd：文本格式持久化日志
- logrotate：日志轮替

### 6.7 常见日志文件
| 文件 | 内容 |
|------|------|
| /var/log/messages | 核心系统消息 |
| /var/log/secure | 安全日志 |
| /var/log/cron | cron日志 |
| /var/log/httpd/* | Web服务器日志 |

### 6.8 journalctl命令
- journalctl：查看所有日志
- journalctl -b：本次启动以来
- journalctl -u sshd：指定服务日志
- journalctl --since "1 hour ago"：时间筛选

### 6.9 日志等级（从低到高）
info → notice → warning → error → crit → alert → emerg

操作符：.(大于等于), .=(等于), .!(除外)

### 6.10 计划任务
- **at**：单次计划任务
  - 依赖atd服务
  - 保存在/var/spool/at/
  - 权限：/etc/at.allow(白名单), /etc/at.deny(黑名单)
  - at/atq/atrm：设置/查看/取消
- **cron**：例行性计划任务
  - 依赖crond服务
  - crontab -e编辑, -l查看, -r删除
  - 格式：分 时 日 月 周
  - 特殊字符：*(任意), ,(分隔), -(范围), /n(每隔n)

---

## CH07 文件服务器

### 7.1 文件传输
- **wget**：下载文件，-c断点续传
- **scp**：基于SSH的安全拷贝

### 7.2 NFS文件共享
- 由Sun Microsystems制定的分布式文件系统协议
- 客户机/服务器架构
- NFSv3无状态，NFSv4有状态连接
- 通过RPC服务注册端口
- 配置文件：/etc/exports
- 适用场景：Linux/Unix局域网内共享

### 7.3 Samba文件共享
- Linux/Unix上SMB/CIFS协议的开源实现
- 实现跨平台文件共享
- 两个守护进程：smbd(TCP 139/445)、nmbd(UDP 137/138)
- 配置文件：/etc/samba/smb.conf
- 适用场景：异构网络环境

### 7.4 FTP文件传输
- 控制连接TCP 21，数据连接TCP 20(主动)或随机端口(被动)
- 主动模式：服务器从20端口主动连接客户端
- 被动模式：客户端主动连接服务器随机端口
- vsftpd：安全性高的FTP服务器
- 配置文件：/etc/vsftpd/vsftpd.conf
- 安全建议：使用SFTP或FTPS

### 7.5 Git版本控制
- 分布式版本控制系统
- 由Linus Torvalds于2005年开发
- 每个开发者持有完整代码仓库副本
- 功能：版本跟踪、分支管理、多人协作、代码备份

### 7.6 GitHub与GitLab
- GitHub：基于云的代码托管平台
- GitLab：支持私有部署，提供CI/CD流水线

---

## CH08 Web服务器概述和Nginx入门

### 8.1 Web服务器概述
- HTTP协议基于"请求-响应"模式
- 常用服务器：Apache、Tomcat、Nginx、IIS等

### 8.2 Apache
- 第一个大规模应用的Web服务器
- C语言模块化开发
- 优点：跨平台、稳定、按需加载、支持.htaccess

### 8.3 Nginx
- 轻量级、面向性能设计
- 解决C10K问题
- 异步非阻塞事件驱动架构
- 市场占有率超过40%
- 衍生版本：Tengine(淘宝)、OpenResty

### 8.4 Apache与Nginx对比
| 特性 | Apache | Nginx |
|------|--------|-------|
| 架构 | 多进程/多线程 | 异步非阻塞事件驱动 |
| 性能 | 并发高时开销大 | 高并发更优 |
| 配置 | 相对繁琐 | 简洁，支持热加载 |
| 适用 | 动态内容 | 反向代理/负载均衡/静态文件 |

### 8.5 Nginx配置文件结构
- 全局块：worker进程数、I/O模型
- events块：网络连接参数
- http块：http全局块 + server块 + location块

### 8.6 Nginx进程结构
- 一个master进程 + 多个worker进程
- master负责读取配置，维持运行
- worker负责处理具体连接和请求
- worker数一般等于CPU核心数

### 8.7 关键指令
- worker_processes：worker进程数
- worker_connections：每个worker最大连接数
- listen：监听端口
- server_name：虚拟主机名
- root：文档根目录
- index：默认索引文件
- include：引入其他配置文件

### 8.8 代理服务器
- **正向代理**：代理客户端访问目标服务器，隐藏客户端信息
- **反向代理**：代理服务端，按策略分发请求，隐藏服务端信息
  - 优点：保护安全、动静态分离、缓存、负载均衡

### 8.9 Nginx反向代理配置
- upstream块：指定后端服务器地址和端口
- location块：配置proxy_pass完成反向代理

---

## CH09 Nginx进阶

### 9.1 HTTPS配置
- 监听443端口，使用SSL证书
- 配置ssl_certificate和ssl_certificate_key
- 可限制协议版本（如TLS1.2和1.3）
- HTTP跳转HTTPS：在80端口server块中添加重定向

### 9.2 负载均衡策略
| 策略 | 特点 |
|------|------|
| RR(轮询) | 按时间顺序逐一分配 |
| 权重 | 指定轮询概率，适合性能不均 |
| IP哈希 | 每个访客固定访问一个后端 |
| fair | 按响应时间分配（第三方） |
| URL哈希 | 按URL哈希分配（第三方） |

### 9.3 哈希一致性
- 问题：节点增减时大量数据迁移
- 解决：构建虚拟节点和哈希环

### 9.4 Nginx其他功能
- 防盗链：禁止其他站点直接访问资源
- 免备案域名访问：通过反向代理实现

### 9.5 Linux进程模型
- **fork函数**：复制当前进程创建新进程
  - 返回值：0(子进程)、>0(父进程PID)、-1(失败)
- **exec系列函数**：将当前进程替换为新进程
- **system函数**：fork-and-exec模式，在子进程中执行shell命令

### 9.6 进程同步与信号机制
- **wait函数**：父进程等待子进程结束
- **僵尸进程**：子进程终止但父进程未调用wait()
- **信号**：SIGINT(Ctrl+C)、SIGKILL(不能捕获)、SIGTERM、SIGALRM
- **signal()函数**：捕获信号，设置处理函数或SIG_IGN/SIG_DFL
- **kill()函数**：向进程发送信号
- **alarm()函数**：定时发送SIGALRM信号

---

## CH10 缓存服务器和容器简介

### 10.1 缓存概念
- 缓存：临时存储数据到内存中，提高访问速度
- **本地缓存**：应用内缓存，快速但不可共享（Guava Cache、Caffeine、Ehcache）
- **分布式缓存**：独立应用，可共享但依赖网络（Memcached、Redis）

### 10.2 Redis简介
- Remote Dictionary Server，键值对存储
- 所有数据存储在内存中
- 单机qps：读110000次/s，写81000次/s
- 单线程，非阻塞I/O多路复用
- 5种基本数据类型：String、List、Hash、Set、SortedSet
- 支持事务、原子性、持久化、发布/订阅

### 10.3 Redis安装与使用
- 安装：yum install redis
- 启动：redis-server
- 客户端：redis-cli
- 支持Java(Jedis)、SpringBoot(RedisTemplate)

### 10.4 Redis持久化
- **RDB**：生成快照存储到磁盘
- **AOF**：记录所有写指令，重启时重新执行

### 10.5 Redis常见问题
- **双写一致性**：先更新数据库再删除缓存，设置过期时间
- **缓存雪崩**：大面积缓存失效，解决：高可用+限流+持久化恢复
- **缓存穿透**：请求不存在的数据，解决：互斥锁、布隆过滤器
- **缓存并发竞争**：多线程同时set，解决：分布式锁、incr命令、消息队列
- **过期策略**：定期删除、惰性删除、内存淘汰机制

### 10.6 Docker容器
- 容器化：将应用程序打包成容器运行
- 与虚拟机区别：容器共享宿主机内核，更轻量级
- 基本概念：
  - 镜像(image)：只读模板
  - 容器(container)：镜像的运行实例
  - 仓库(Registry)：存储和分享镜像
  - Docker daemon：后台服务
  - Docker Client：客户端
- Dockerfile：定义容器化步骤
- Docker Compose：定义和运行多容器应用

### 10.7 Kubernetes
- 基于Docker的大规模分布式应用部署平台

### 10.8 软件架构演进
All-in-One → 按功能分离服务器 → 使用缓存服务器 → 应用服务器集群+负载均衡 → 会话管理 → 数据库读写分离 → CDN和反向代理 → 专库专用 → 搜索引擎和NoSQL

---

## 附录：常用端口号

| 服务 | 端口 |
|------|------|
| FTP控制 | 21 |
| FTP数据 | 20 |
| SSH | 22 |
| Telnet | 23 |
| HTTP | 80 |
| HTTPS | 443 |
| NFS | 2049 |
| Samba(smbd) | 139/445 |
| Samba(nmbd) | 137/138 |
| MySQL | 3306 |
| Redis | 6379 |
| Nginx | 80 |
