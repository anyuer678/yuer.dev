---
title: "Linux系统章节笔记合集（CH01-10）"
date: "2025-06"
type: "learning"
tags: [Linux, 文件系统, Shell, Nginx, Docker, 进程管理]
summary: "Linux系统各章详细笔记合集，覆盖开源OS概述、文件系统、进程网络、Shell、Nginx、Docker等（共10篇章节笔记合并）"
---

# Linux系统章节笔记合集（CH01-10）


---

## 章节：CH01 开源操作系统概述笔记

# CH01 开源操作系统概述笔记

## 一、操作系统基本概念
### 1.1 什么是操作系统
- **定义**：操作系统是管理计算机硬件和软件资源的系统软件
- **作用**：
  - 作为用户与计算机硬件之间的接口
  - 管理计算机资源（CPU、内存、I/O设备等）
  - 提供用户友好的操作环境
  - 确保系统安全和稳定运行

### 1.2 操作系统的主要功能
1. **进程管理**
   - 进程调度
   - 进程通信
   - 进程同步

2. **内存管理**
   - 内存分配
   - 虚拟内存
   - 内存保护

3. **文件系统管理**
   - 文件操作
   - 目录管理
   - 磁盘空间管理

4. **设备管理**
   - I/O控制
   - 设备驱动
   - 缓冲管理

5. **用户接口**
   - 命令行界面（CLI）
   - 图形用户界面（GUI）

## 二、开源软件与开源操作系统
### 2.1 开源软件的概念
- **开源定义**：软件的源代码可以被任何人查看、修改和分发
- **开源许可证**：
  - GPL（GNU General Public License）
  - BSD（Berkeley Software Distribution）
  - MIT许可证
  - Apache许可证

### 2.2 开源操作系统的优势
1. **成本优势**
   - 免费获取和使用
   - 无授权费用

2. **技术优势**
   - 源代码公开，可根据需要修改
   - 全球开发者社区参与开发
   - 安全性高，漏洞修复快
   - 稳定性好，可长期稳定运行

3. **灵活性**
   - 可根据需求定制
   - 支持多种硬件平台
   - 丰富的软件生态

### 2.3 主流开源操作系统
1. **Linux**
   - 最流行的开源操作系统
   - 发行版众多（Ubuntu、CentOS、Debian、Red Hat等）
   - 广泛应用于服务器、桌面、嵌入式等领域

2. **FreeBSD**
   - 从BSD Unix发展而来
   - 稳定性极佳
   - 常用于服务器和网络设备

3. **OpenBSD**
   - 注重安全性
   - 代码质量高
   - 适合安全要求高的场景

## 三、Linux操作系统简介
### 3.1 Linux的起源
- **创始人**：Linus Torvalds（1991年）
- **第一个版本**：Linux 0.01（1991年）
- **发展历程**：从个人项目发展成为全球最重要的操作系统之一

### 3.2 Linux的特点
1. **多用户多任务**
   - 支持多个用户同时登录
   - 支持多个程序同时运行

2. **强大的网络功能**
   - 天生为网络设计
   - 支持多种网络协议

3. **良好的移植性**
   - 支持多种硬件架构（x86、ARM、MIPS等）
   - 从服务器到嵌入式设备都能运行

4. **丰富的软件资源**
   - 大量的开源软件
   - 强大的包管理系统

### 3.3 Linux发行版
1. **桌面发行版**
   - Ubuntu：最流行的桌面Linux
   - Linux Mint：基于Ubuntu，用户友好
   - Fedora：新技术尝鲜

2. **服务器发行版**
   - CentOS：稳定，企业级
   - Red Hat Enterprise Linux (RHEL)：商业支持
   - Debian：稳定可靠
   - SUSE Linux Enterprise Server (SLES)

3. **其他发行版**
   - Arch Linux：滚动更新，DIY
   - Gentoo：源代码编译，高度定制

## 四、Linux的应用领域
### 4.1 服务器领域
- Web服务器（Apache、Nginx）
- 数据库服务器（MySQL、PostgreSQL）
- 应用服务器
- 云计算平台

### 4.2 桌面领域
- 日常办公
- 软件开发
- 图形设计

### 4.3 嵌入式领域
- 智能手机（Android基于Linux）
- 路由器、交换机
- 智能家居设备
- 工业控制系统

### 4.4 科学计算
- 超级计算机
- 数据分析
- 科研计算

## 五、学习Linux的重要性
### 5.1 就业需求
- 服务器运维工程师
- 系统管理员
- DevOps工程师
- 云平台工程师

### 5.2 技术发展
- 理解操作系统原理
- 学习开源文化
- 参与开源社区

### 5.3 个人成长
- 提高技术能力
- 拓宽技术视野
- 培养解决问题的能力

## 六、总结
Linux作为最成功的开源操作系统，具有稳定、安全、灵活、免费等特点，广泛应用于各个领域。学习Linux不仅可以理解操作系统的工作原理，还能为职业发展打下坚实基础。

---

## 章节：CH02 文件与文件系统笔记

# CH02 文件与文件系统笔记

## 一、文件系统基础概念
### 1.1 什么是文件系统
- **定义**：操作系统中负责管理和存储文件的软件模块
- **作用**：
  - 组织和管理文件
  - 提供文件访问接口
  - 保证数据安全和可靠
  - 提高存储效率

### 1.2 文件的概念
- **文件定义**：存储在外存上的一组相关信息的集合
- **文件属性**：
  - 文件名
  - 文件类型
  - 文件大小
  - 创建时间
  - 修改时间
  - 访问权限
  - 所有者

## 二、Linux文件系统层次结构（FHS）
### 2.1 FHS标准
- **FHS**：Filesystem Hierarchy Standard（文件系统层次结构标准）
- **目的**：统一Linux发行版的目录结构

### 2.2 主要目录说明
1. **/（根目录）**
   - 文件系统的最顶层
   - 所有其他目录都从这里开始

2. **/bin（二进制文件）**
   - 存放系统必需的命令
   - 普通用户和管理员都可以使用
   - 例如：ls、cp、mv、cat

3. **/sbin（系统二进制文件）**
   - 存放系统管理命令
   - 通常只有管理员可以使用
   - 例如：ifconfig、reboot、fdisk

4. **/boot（启动文件）**
   - 存放系统启动相关文件
   - 包括内核、引导加载程序等

5. **/dev（设备文件）**
   - 存放设备文件
   - 所有硬件设备都以文件形式表示
   - 例如：/dev/sda（硬盘）、/dev/tty（终端）

6. **/etc（配置文件）**
   - 存放系统和应用程序的配置文件
   - 大多数是文本文件
   - 例如：/etc/passwd（用户信息）、/etc/hosts（主机名解析）

7. **/home（用户主目录）**
   - 存放用户个人文件
   - 每个用户有一个子目录
   - 例如：/home/user1、/home/user2

8. **/lib（库文件）**
   - 存放系统和程序的共享库
   - 类似于Windows的DLL文件

9. **/media（可移动媒体）**
   - 挂载可移动设备的目录
   - 例如：U盘、光盘

10. **/mnt（临时挂载）**
    - 临时挂载文件系统的目录

11. **/opt（可选软件）**
    - 存放第三方软件
    - 例如：/opt/google/chrome

12. **/proc（进程信息）**
    - 虚拟文件系统
    - 存放当前运行进程和系统信息
    - 内容在内存中，不占用磁盘空间

13. **/root（root用户主目录）**
    - 超级用户root的主目录

14. **/run（运行时数据）**
    - 存放系统运行时的临时数据
    - 系统重启后清空

15. **/srv（服务数据）**
    - 存放服务提供的数据
    - 例如：Web服务器的网页文件

16. **/sys（系统信息）**
    - 虚拟文件系统
    - 存放内核和设备信息

17. **/tmp（临时文件）**
    - 存放临时文件
    - 所有用户都可以读写
    - 系统重启后可能清空

18. **/usr（用户程序）**
    - 存放用户应用程序和文件
    - 包含子目录：
      - /usr/bin：用户命令
      - /usr/sbin：系统管理命令
      - /usr/lib：库文件
      - /usr/share：共享数据
      - /usr/local：本地安装的软件

19. **/var（可变数据）**
    - 存放经常变化的文件
    - 包含子目录：
      - /var/log：日志文件
      - /var/cache：缓存数据
      - /var/spool：队列数据
      - /var/lib：状态数据

## 三、Linux文件类型
### 3.1 普通文件（-）
- 存储数据的文件
- 例如：文本文件、二进制文件、图片、视频

### 3.2 目录文件（d）
- 存放其他文件的文件
- 相当于Windows的文件夹

### 3.3 设备文件
- **字符设备文件（c）**
  - 按字符读写
  - 例如：终端、键盘、鼠标

- **块设备文件（b）**
  - 按块读写
  - 例如：硬盘、U盘

### 3.4 符号链接文件（l）
- 指向另一个文件的指针
- 类似于Windows的快捷方式

### 3.5 套接字文件（s）
- 用于进程间通信
- 网络编程中常用

### 3.6 管道文件（p）
- 用于进程间通信
- 有名管道

## 四、文件权限
### 4.1 权限表示
- **三种用户类型**：
  - 所有者（u）
  - 所属组（g）
  - 其他用户（o）

- **三种权限**：
  - 读（r）：4
  - 写（w）：2
  - 执行（x）：1

### 4.2 权限表示方式
1. **符号表示**
   - 例如：-rwxr-xr--
   - 解释：
     - 第一位：文件类型
     - 2-4位：所有者权限
     - 5-7位：所属组权限
     - 8-10位：其他用户权限

2. **数字表示**
   - 例如：754
   - 解释：
     - 7（4+2+1）：所有者读写执行
     - 5（4+0+1）：所属组读执行
     - 4（4+0+0）：其他用户读

### 4.3 修改权限命令
1. **chmod**：修改文件权限
   - 符号方式：chmod u+x file
   - 数字方式：chmod 755 file

2. **chown**：修改文件所有者
   - chown user:group file

3. **chgrp**：修改文件所属组
   - chgrp group file

### 4.4 特殊权限
1. **SUID（Set User ID）**
   - 以文件所有者身份执行
   - 权限位：s（在所有者执行位）
   - 数字：4000

2. **SGID（Set Group ID）**
   - 以文件所属组身份执行
   - 对目录：新文件继承目录的组
   - 权限位：s（在所属组执行位）
   - 数字：2000

3. **Sticky Bit**
   - 只有文件所有者可以删除/重命名
   - 权限位：t（在其他用户执行位）
   - 数字：1000

## 五、文件操作命令
### 5.1 目录操作
- **pwd**：显示当前目录
- **cd**：切换目录
- **ls**：列出目录内容
- **mkdir**：创建目录
- **rmdir**：删除空目录
- **tree**：树形显示目录结构

### 5.2 文件操作
- **touch**：创建空文件或修改时间戳
- **cp**：复制文件
- **mv**：移动或重命名文件
- **rm**：删除文件
- **ln**：创建链接

### 5.3 文件查看
- **cat**：显示文件内容
- **more**：分页显示（向后）
- **less**：分页显示（双向）
- **head**：显示文件开头
- **tail**：显示文件结尾

### 5.4 文件查找
- **find**：查找文件
- **grep**：在文件中查找内容
- **locate**：快速查找文件（使用数据库）

## 六、常用文件系统
### 6.1 Ext系列
- **Ext2**：早期Linux文件系统
- **Ext3**：Ext2的日志版本
- **Ext4**：当前主流，支持大文件和大容量

### 6.2 其他文件系统
- **XFS**：高性能，适合大文件
- **Btrfs**：新一代，支持快照
- **ReiserFS**：适合小文件
- **ZFS**：高级特性，数据完整性

### 6.3 网络文件系统
- **NFS**：Network File System
- **SMB/CIFS**：Windows文件共享
- **FTP/SFTP**：文件传输

## 七、总结
Linux文件系统层次清晰，权限管理严格，文件类型丰富。理解FHS标准、文件权限和基本操作命令是学习Linux的基础。熟练掌握这些知识可以高效地管理和使用Linux系统。

---

## 章节：CH03 用户、进程和网络笔记

Linux - CH03 用户、进程和网络 详细笔记

一、Linux用户管理

1.1 用户和用户组

Linux用户的概念：
- Linux是一个多用户多任务的操作系统
- 每个用户都有一个唯一的用户标识（UID）
- 每个用户属于一个或多个用户组
- 每个用户组有一个唯一的组标识（GID）

用户类型：
1. 超级用户（root）
   - UID为0
   - 拥有系统的所有权限
   - 可以执行任何操作
   - 谨慎使用root用户

2. 系统用户
   - UID通常为1-999
   - 用于运行系统服务
   - 通常没有登录权限

3. 普通用户
   - UID通常为1000以上
   - 普通用户登录系统
   - 权限受限

用户配置文件：
1. /etc/passwd
   - 用户信息文件
   - 格式：
     username:x:UID:GID:comment:home_directory:shell
   - 字段说明：
     - username：用户名
     - x：密码占位符（实际密码在/etc/shadow）
     - UID：用户ID
     - GID：主组ID
     - comment：注释
     - home_directory：主目录
     - shell：登录Shell
   - 例子：
     root:x:0:0:root:/root:/bin/bash
     user:x:1000:1000:User:/home/user:/bin/bash

2. /etc/shadow
   - 用户密码文件（加密）
   - 只有root可以读取
   - 格式：
     username:password:last_change:min_days:max_days:warn:expire:disable:reserved
   - 例子：
     root:$6$rounds=4096$...:18000:0:99999:7:::

3. /etc/group
   - 用户组信息文件
   - 格式：
     group_name:x:GID:user_list
   - 例子：
     root:x:0:
     user:x:1000:user

4. /etc/gshadow
   - 用户组密码文件

1.2 用户管理命令

用户管理命令：

1. useradd
   - 创建新用户
   - 常用选项：
     - -m：创建主目录
     - -s：指定登录Shell
     - -g：指定主组
     - -G：指定附加组
     - -u：指定UID
   - 例子：
     useradd -m -s /bin/bash newuser
     useradd -m -g users -G wheel newuser

2. usermod
   - 修改用户信息
   - 常用选项：
     - -l：修改用户名
     - -s：修改Shell
     - -g：修改主组
     - -G：修改附加组
     - -u：修改UID
     - -L：锁定用户
     - -U：解锁用户
   - 例子：
     usermod -s /bin/zsh user
     usermod -L user
     usermod -U user

3. userdel
   - 删除用户
   - 常用选项：
     - -r：删除主目录和邮箱
   - 例子：
     userdel -r olduser

4. passwd
   - 修改用户密码
   - 例子：
     passwd
     passwd user

5. id
   - 显示用户信息
   - 例子：
     id
     id user

6. who
   - 显示当前登录用户
   - 例子：
     who

7. w
   - 显示当前登录用户和他们的活动
   - 例子：
     w

8. su
   - 切换用户
   - 例子：
     su - root
     su user

9. sudo
   - 以其他用户身份执行命令
   - 配置文件：/etc/sudoers
   - 例子：
     sudo command
     sudo -i

1.3 用户组管理命令

用户组管理命令：

1. groupadd
   - 创建新用户组
   - 例子：
     groupadd newgroup
     groupadd -g 2000 newgroup

2. groupmod
   - 修改用户组
   - 例子：
     groupmod -n newname oldname
     groupmod -g 2001 group

3. groupdel
   - 删除用户组
   - 例子：
     groupdel oldgroup

4. groups
   - 显示用户所属的组
   - 例子：
     groups
     groups user

5. gpasswd
   - 管理用户组
   - 例子：
     gpasswd -a user group
     gpasswd -d user group

二、Linux进程管理

2.1 进程的概念

进程（Process）的定义：
- 进程是程序的一次执行
- 进程是系统资源分配的基本单位
- 每个进程有一个唯一的进程ID（PID）

进程的特点：
1. 动态性：进程是程序的执行，有生命周期
2. 并发性：多个进程可以同时执行
3. 独立性：进程有自己的地址空间
4. 异步性：进程以不可预知的速度向前推进

进程的状态：
1. 运行态（Running）：正在CPU上执行
2. 就绪态（Ready）：等待CPU
3. 阻塞态（Blocked）：等待事件（如I/O）

进程状态转换：
```
        调度
   ┌────────→ 运行
   │        ↓ |
   │   时间片 |
   │        ↓ |
就绪 ←────────┘
   ↑
   │ 事件发生
   │
阻塞 ←─── 等待事件
```

2.2 进程管理命令

进程管理命令：

1. ps
   - 显示进程状态
   - 常用选项：
     - a：显示所有用户的进程
     - u：显示详细信息
     - x：显示没有控制终端的进程
     - -e：显示所有进程
     - -f：显示完整格式
     - -l：显示长格式
   - 例子：
     ps
     ps aux
     ps -ef
     ps -ef | grep ssh

   ps aux输出字段说明：
   - USER：进程所属用户
   - PID：进程ID
   - %CPU：CPU使用率
   - %MEM：内存使用率
   - VSZ：虚拟内存大小
   - RSS：常驻内存大小
   - TTY：终端
   - STAT：进程状态
     - R：运行
     - S：睡眠
     - D：不可中断的睡眠
     - T：停止
     - Z：僵尸
   - START：进程启动时间
   - TIME：CPU时间
   - COMMAND：命令

2. top
   - 实时显示进程信息
   - 交互式命令：
     - h：帮助
     - k：杀死进程
     - r：修改优先级
     - P：按CPU排序
     - M：按内存排序
     - T：按时间排序
     - q：退出
   - 例子：
     top

3. pstree
   - 以树状图显示进程
   - 例子：
     pstree
     pstree -p

4. pgrep
   - 按名称查找进程
   - 例子：
     pgrep ssh
     pgrep -u user

5. pkill
   - 按名称杀死进程
   - 例子：
     pkill ssh

6. kill
   - 向进程发送信号
   - 常用信号：
     - 1 (SIGHUP)：挂起
     - 9 (SIGKILL)：强制终止
     - 15 (SIGTERM)：终止（默认）
   - 例子：
     kill PID
     kill -9 PID
     kill -l

7. killall
   - 按命令名杀死进程
   - 例子：
     killall firefox

8. nice
   - 设置进程优先级
   - 优先级范围：-20（最高）到19（最低）
   - 例子：
     nice -n 10 command
     nice command

9. renice
   - 修改进程优先级
   - 例子：
     renice 10 PID
     renice -n 5 -u user

10. nohup
    - 不挂起执行命令
    - 输出重定向到nohup.out
    - 例子：
      nohup command &

11. &
    - 后台执行命令
    - 例子：
      command &

12. jobs
    - 显示后台作业
    - 例子：
      jobs

13. fg
    - 将后台作业放到前台
    - 例子：
      fg %1

14. bg
    - 将作业放到后台
    - 例子：
      bg %1

2.3 进程的创建

进程创建：

1. fork
   - 创建子进程
   - 子进程是父进程的副本
   - 返回值：
     - 父进程：返回子进程PID
     - 子进程：返回0

2. exec
   - 用新程序替换当前进程
   - 不创建新进程，替换当前进程

3. wait
   - 等待子进程结束
   - 父进程等待子进程

例子（Shell脚本）：
```bash
#!/bin/bash
echo "Parent process, PID: $$"
sleep 2 &
echo "Child process, PID: $!"
wait $!
echo "Child process finished"
```

2.4 守护进程

守护进程（Daemon）：
- 在后台运行的进程
- 不与任何终端关联
- 通常在系统启动时启动
- 例子：
  - sshd：SSH服务
  - httpd：Web服务器
  - mysqld：数据库服务器

查看守护进程：
```bash
ps -ef | grep sshd
```

三、Linux网络管理

3.1 网络配置文件

网络配置文件：

1. /etc/hostname
   - 主机名配置文件
   - 例子：
     myhostname

2. /etc/hosts
   - 主机名解析文件
   - 格式：
     IP_address hostname aliases
   - 例子：
     127.0.0.1   localhost
     192.168.1.10 server.example.com server

3. /etc/resolv.conf
   - DNS服务器配置
   - 例子：
     nameserver 8.8.8.8
     nameserver 8.8.4.4
     search example.com

4. /etc/nsswitch.conf
   - 名称服务切换配置
   - 例子：
     hosts: files dns

5. 网络接口配置（不同发行版不同）
   - CentOS/RHEL：/etc/sysconfig/network-scripts/ifcfg-*
   - Debian/Ubuntu：/etc/network/interfaces
   - 现代：使用NetworkManager或systemd-networkd

3.2 网络管理命令

网络管理命令：

1. ifconfig
   - 配置网络接口
   - 例子：
     ifconfig
     ifconfig eth0
     ifconfig eth0 192.168.1.10 netmask 255.255.255.0
     ifconfig eth0 up
     ifconfig eth0 down

2. ip
   - 新一代网络配置工具
   - 常用子命令：
     - addr：地址管理
     - link：链路管理
     - route：路由管理
   - 例子：
     ip addr show
     ip addr add 192.168.1.10/24 dev eth0
     ip link set eth0 up
     ip link set eth0 down
     ip route show

3. ping
   - 测试网络连通性
   - 例子：
     ping 8.8.8.8
     ping -c 4 8.8.8.8

4. traceroute
   - 追踪路由
   - 例子：
     traceroute 8.8.8.8

5. netstat
   - 网络统计
   - 常用选项：
     - -a：所有连接
     - -t：TCP
     - -u：UDP
     - -n：数字格式
     - -p：显示进程
     - -r：路由表
   - 例子：
     netstat -ant
     netstat -r

6. ss
   - 新一代网络统计工具（替代netstat）
   - 例子：
     ss -ant
     ss -tulw

7. route
   - 查看和配置路由表
   - 例子：
     route
     route add -net 192.168.2.0 netmask 255.255.255.0 gw 192.168.1.1
     route del -net 192.168.2.0

8. arp
   - 查看和配置ARP表
   - 例子：
     arp -a
     arp -s 192.168.1.1 00:11:22:33:44:55

9. hostname
   - 查看和设置主机名
   - 例子：
     hostname
     hostname newname

10. host
    - DNS查询
    - 例子：
      host www.example.com

11. nslookup
    - DNS查询
    - 例子：
      nslookup www.example.com

12. dig
    - DNS查询（更详细）
    - 例子：
      dig www.example.com

13. curl
    - 传输数据
    - 例子：
      curl http://www.example.com
      curl -O http://www.example.com/file.txt

14. wget
    - 下载文件
    - 例子：
      wget http://www.example.com/file.txt

15. ssh
    - 安全Shell
    - 例子：
      ssh user@host
      ssh -p 2222 user@host

16. scp
    - 安全复制
    - 例子：
      scp file.txt user@host:/path
      scp user@host:/path/file.txt .

17. sftp
    - 安全FTP
    - 例子：
      sftp user@host

3.3 防火墙

防火墙（Firewall）：

1. iptables
   - Linux的防火墙工具
   - 例子：
     iptables -L
     iptables -A INPUT -p tcp --dport 22 -j ACCEPT
     iptables -A INPUT -j DROP
     service iptables save

2. firewalld
   - 新一代防火墙管理工具（CentOS 7+）
   - 例子：
     firewall-cmd --list-all
     firewall-cmd --permanent --add-service=ssh
     firewall-cmd --permanent --add-port=80/tcp
     firewall-cmd --reload

3. ufw
   - 简单防火墙（Ubuntu）
   - 例子：
     ufw status
     ufw allow ssh
     ufw allow 80/tcp
     ufw enable

3.4 网络服务

常见的网络服务：

1. SSH（Secure Shell）
   - 安全远程登录
   - 服务名：sshd
   - 端口：22
   - 配置文件：/etc/ssh/sshd_config
   - 启动：
     systemctl start sshd
     systemctl enable sshd

2. HTTP/Web服务器
   - Apache：httpd
   - Nginx：nginx
   - 端口：80（HTTP），443（HTTPS）

3. 邮件服务器
   - SMTP（发送）：端口25
   - POP3（接收）：端口110
   - IMAP（接收）：端口143

4. 文件服务器
   - FTP：端口21
   - NFS：Network File System
   - Samba：Windows文件共享

5. 数据库服务器
   - MySQL/MariaDB：端口3306
   - PostgreSQL：端口5432
   - MongoDB：端口27017

四、总结

4.1 用户管理要点
- /etc/passwd、/etc/shadow、/etc/group
- useradd、usermod、userdel、passwd
- 超级用户root要谨慎使用

4.2 进程管理要点
- ps、top、pstree
- kill、killall、pkill
- nice、renice
- 前台和后台作业

4.3 网络管理要点
- ifconfig、ip
- ping、traceroute
- netstat、ss
- 防火墙：iptables、firewalld、ufw
- SSH、scp、sftp

4.4 学习的意义
- 掌握Linux用户和用户组管理
- 掌握Linux进程管理
- 掌握Linux网络管理
- 能够管理Linux系统

---

## 章节：CH04 Shell入门与基础笔记

# CH04 Shell入门与基础笔记

## 一、Shell基础概念
### 1.1 什么是Shell
- **定义**：Shell是用户与Linux内核之间的接口程序
- **作用**：
  - 接收用户输入的命令
  - 解释命令
  - 调用系统内核执行命令
  - 返回执行结果给用户

### 1.2 常见Shell
1. **Bash（Bourne Again Shell）**
   - 最流行的Shell
   - 大多数Linux发行版的默认Shell
   - 兼容sh，功能强大

2. **sh（Bourne Shell）**
   - 最早的UNIX Shell
   - 兼容性好

3. **csh（C Shell）**
   - 语法类似C语言

4. **tcsh**
   - csh的增强版

5. **zsh**
   - 功能强大，高度可配置
   - Oh My Zsh框架

6. **fish**
   - 友好的交互式Shell

### 1.3 查看和切换Shell
1. **查看当前Shell**
   - echo $SHELL
   - echo $0

2. **查看系统可用Shell**
   - cat /etc/shells

3. **切换Shell**
   - chsh -s /bin/bash
   - chsh -s /bin/zsh

## 二、Shell命令基础
### 2.1 命令格式
- **格式**：命令 [选项] [参数]
- **示例**：ls -l /home
  - ls：命令
  - -l：选项
  - /home：参数

### 2.2 命令类型
1. **内部命令**
   - Shell内置的命令
   - 执行速度快
   - 例如：cd、echo、exit、history

2. **外部命令**
   - 独立的可执行文件
   - 存放在/bin、/usr/bin等目录
   - 例如：ls、cp、grep

3. **查看命令类型**
   - type command
   - which command
   - whereis command

### 2.3 常用快捷键
- **Ctrl+C**：终止当前命令
- **Ctrl+D**：退出当前Shell（EOF）
- **Ctrl+L**：清屏
- **Ctrl+A**：光标移到行首
- **Ctrl+E**：光标移到行尾
- **Ctrl+U**：删除光标到行首
- **Ctrl+K**：删除光标到行尾
- **Ctrl+W**：删除光标前的单词
- **Ctrl+R**：搜索历史命令
- **Tab**：自动补全

## 三、Shell变量
### 3.1 变量类型
1. **环境变量**
   - 系统定义的变量
   - 对所有Shell进程有效
   - 大写字母
   - 例如：PATH、HOME、USER、PWD

2. **用户自定义变量**
   - 用户自己定义的变量
   - 仅在当前Shell有效
   - 通常小写字母

3. **位置变量**
   - $0：脚本名
   - $1-$9：第1-9个参数
   - ${10}：第10个及以后的参数

4. **特殊变量**
   - $#：参数个数
   - $*：所有参数（作为一个字符串）
   - $@：所有参数（每个参数独立）
   - $?：上一个命令的退出状态
   - $$：当前Shell的PID
   - $!：最后一个后台进程的PID

### 3.2 变量操作
1. **定义变量**
   - variable=value
   - 注意：等号两边不能有空格

2. **引用变量**
   - $variable
   - ${variable}

3. **删除变量**
   - unset variable

4. **只读变量**
   - readonly variable

5. **导出变量（环境变量）**
   - export variable

### 3.3 常用环境变量
- **PATH**：命令搜索路径
- **HOME**：用户主目录
- **USER**：当前用户名
- **PWD**：当前目录
- **SHELL**：当前Shell
- **PS1**：命令提示符
- **LANG**：语言设置
- **TERM**：终端类型

## 四、Shell引号
### 4.1 双引号（" "）
- 保留空格和换行
- 变量会被展开
- 通配符不会被展开

### 4.2 单引号（' '）
- 保留所有字符
- 变量不会被展开
- 通配符不会被展开

### 4.3 反引号（` `）或 $()
- 命令替换
- 执行命令并将输出作为字符串

## 五、Shell通配符
### 5.1 常用通配符
1. *****：匹配任意字符（包括空字符）
   - ls *.txt：匹配所有txt文件

2. **?**：匹配任意单个字符
   - ls file?.txt：匹配file1.txt、file2.txt等

3. **[]**：匹配指定范围内的字符
   - ls file[123].txt：匹配file1.txt、file2.txt、file3.txt
   - ls file[a-z].txt：匹配filea.txt到filez.txt
   - ls file[!1].txt：匹配除file1.txt外的文件

4. **{}**：扩展模式
   - ls file{1,2,3}.txt：匹配file1.txt、file2.txt、file3.txt
   - ls file{1..5}.txt：匹配file1.txt到file5.txt

## 六、输入输出重定向
### 6.1 标准文件描述符
- **0**：标准输入（stdin）
- **1**：标准输出（stdout）
- **2**：标准错误（stderr）

### 6.2 输出重定向
1. **>**：覆盖输出
   - command > file：将标准输出覆盖到file
   - command 1> file：同上
   - command 2> file：将标准错误覆盖到file
   - command > file 2>&1：将标准输出和错误都覆盖到file
   - command &> file：同上

2. **>>**：追加输出
   - command >> file：将标准输出追加到file
   - command 2>> file：将标准错误追加到file
   - command >> file 2>&1：将标准输出和错误都追加到file

### 6.3 输入重定向
1. **<**：从文件读取输入
   - command < file

2. **<<**：Here Document
   ```
   command << EOF
   content
   EOF
   ```

3. **<<<**：Here String
   - command <<< "string"

### 6.4 管道（|）
- 将一个命令的输出作为另一个命令的输入
- command1 | command2
- 示例：ls -l | grep ".txt"

## 七、命令执行控制
### 7.1 命令顺序执行
- **;**：顺序执行，不管前一个命令是否成功
  - command1 ; command2

### 7.2 逻辑与
- **&&**：前一个命令成功才执行后一个
  - command1 && command2

### 7.3 逻辑或
- **||**：前一个命令失败才执行后一个
  - command1 || command2

## 八、Shell命令历史
### 8.1 历史命令
1. **history**：显示历史命令
   - history：显示所有历史命令
   - history n：显示最近n条命令

2. **执行历史命令**
   - !!：执行上一条命令
   - !n：执行第n条命令
   - !-n：执行倒数第n条命令
   - !string：执行最近一条以string开头的命令

3. **历史命令相关变量**
   - HISTSIZE：历史命令条数
   - HISTFILE：历史命令文件
   - HISTFILESIZE：历史文件大小

## 九、Shell别名
### 9.1 别名操作
1. **定义别名**
   - alias name='command'
   - 示例：alias ll='ls -l'

2. **查看别名**
   - alias
   - alias name

3. **删除别名**
   - unalias name

4. **永久别名**
   - 写入~/.bashrc或~/.bash_profile

## 十、总结
Shell是Linux系统的核心接口，掌握Shell基础是学习Linux的关键。本章介绍了Shell的基本概念、命令格式、变量、引号、通配符、重定向、管道等基础知识，这些是编写Shell脚本和高效使用Linux系统的基础。

---

## 章节：CH05 Shell进阶笔记

# CH05 Shell进阶笔记

## 一、Shell脚本基础
### 1.1 什么是Shell脚本
- **定义**：包含一系列Shell命令的文本文件
- **作用**：自动化执行任务
- **扩展名**：通常使用.sh（不是必需的）

### 1.2 第一个Shell脚本
```bash
#!/bin/bash
# 这是一个注释
echo "Hello, World!"
```

### 1.3 脚本执行方式
1. **赋予执行权限后执行**
   - chmod +x script.sh
   - ./script.sh

2. **使用Shell解释器执行**
   - bash script.sh
   - sh script.sh

3. **使用source或.执行**
   - source script.sh
   - . script.sh（在当前Shell中执行）

## 二、Shell脚本变量
### 2.1 变量定义和使用
```bash
#!/bin/bash
name="张三"
age=20
echo "姓名: $name"
echo "年龄: $age"
echo "姓名: ${name}"
```

### 2.2 变量作用域
1. **局部变量**
   - 仅在函数或脚本中有效
   - 使用local关键字

2. **环境变量**
   - 使用export导出
   - 对子进程有效

### 2.3 变量操作
1. **字符串长度**
   - ${#variable}

2. **字符串截取**
   - ${variable:offset}
   - ${variable:offset:length}

3. **字符串替换**
   - ${variable/pattern/replacement}：替换第一个
   - ${variable//pattern/replacement}：替换所有

4. **变量默认值**
   - ${variable:-default}：未定义则使用default
   - ${variable:=default}：未定义则赋值并使用default
   - ${variable:+replacement}：已定义则使用replacement
   - ${variable:?message}：未定义则显示错误消息

## 三、数组
### 3.1 数组定义
```bash
# 方式1
array=("value1" "value2" "value3")

# 方式2
array[0]="value1"
array[1]="value2"
array[2]="value3"

# 方式3
array=([0]="value1" [1]="value2" [2]="value3")
```

### 3.2 数组操作
1. **访问数组元素**
   - ${array[index]}
   - ${array[0]}：第一个元素

2. **访问所有元素**
   - ${array[*]}
   - ${array[@]}

3. **获取数组长度**
   - ${#array[*]}
   - ${#array[@]}

4. **数组切片**
   - ${array[@]:start:length}

5. **添加元素**
   - array+=("newvalue")

6. **删除元素**
   - unset array[index]

## 四、Shell运算符
### 4.1 算术运算符
1. **使用expr**
   - expr 2 + 3
   - expr 2 \* 3（*需要转义）

2. **使用$((...))**
   - result=$((2 + 3))
   - result=$((2 * 3))

3. **使用let**
   - let result=2+3
   - let "result = 2 * 3"

4. **运算符**
   - +：加法
   - -：减法
   - *：乘法
   - /：除法
   - %：取余
   - **：幂运算

### 4.2 关系运算符
- -eq：等于
- -ne：不等于
- -gt：大于
- -lt：小于
- -ge：大于等于
- -le：小于等于

### 4.3 布尔运算符
- !：非
- -o：或
- -a：与

### 4.4 逻辑运算符
- &&：逻辑与
- ||：逻辑或

### 4.5 字符串运算符
- =：相等
- !=：不相等
- -z：长度为0
- -n：长度不为0
- str：字符串不为空

### 4.6 文件测试运算符
- -e：文件存在
- -f：是普通文件
- -d：是目录
- -r：可读
- -w：可写
- -x：可执行
- -s：文件大小不为0

## 五、流程控制
### 5.1 if语句
```bash
if [ condition ]; then
    commands
fi

if [ condition ]; then
    commands1
else
    commands2
fi

if [ condition1 ]; then
    commands1
elif [ condition2 ]; then
    commands2
else
    commands3
fi
```

### 5.2 case语句
```bash
case variable in
    pattern1)
        commands1
        ;;
    pattern2)
        commands2
        ;;
    *)
        default_commands
        ;;
esac
```

### 5.3 for循环
```bash
# 方式1
for variable in list; do
    commands
done

# 方式2
for ((i=0; i<10; i++)); do
    commands
done
```

### 5.4 while循环
```bash
while [ condition ]; do
    commands
done
```

### 5.5 until循环
```bash
until [ condition ]; do
    commands
done
```

### 5.6 select循环（菜单）
```bash
select variable in option1 option2 option3; do
    commands
    break
done
```

### 5.7 循环控制
- break：跳出循环
- continue：跳过本次循环
- exit：退出脚本

## 六、函数
### 6.1 函数定义
```bash
# 方式1
function function_name {
    commands
}

# 方式2
function_name() {
    commands
}
```

### 6.2 函数调用
```bash
function_name
function_name arg1 arg2
```

### 6.3 函数参数
- $1, $2, ...：第1、2...个参数
- $#：参数个数
- $*：所有参数
- $@：所有参数

### 6.4 函数返回值
- return：返回数值（0-255）
- echo：返回字符串
- $?：获取返回值

### 6.5 函数变量
- local：局部变量
- 全局变量：不加local

## 七、Shell脚本调试
### 7.1 调试选项
1. **-n**：检查语法错误，不执行
   - bash -n script.sh

2. **-v**：显示执行的命令
   - bash -v script.sh

3. **-x**：显示执行的命令和结果
   - bash -x script.sh

4. **在脚本中设置**
   - set -x：开始调试
   - set +x：结束调试

### 7.2 常用调试技巧
- 使用echo输出变量值
- 使用trap捕获信号
- 使用set -e：出错即退出
- 使用set -u：使用未定义变量报错
- 使用set -o pipefail：管道中任何命令失败则返回失败

## 八、常用Shell命令
### 8.1 文本处理
1. **cut**：按列提取
   - cut -d: -f1 /etc/passwd

2. **sort**：排序
   - sort file
   - sort -n file：数值排序
   - sort -r file：反向排序

3. **uniq**：去重
   - uniq file
   - uniq -c file：显示重复次数

4. **wc**：统计
   - wc -l：行数
   - wc -w：单词数
   - wc -c：字符数

5. **tee**：同时输出到文件和屏幕
   - command | tee file

6. **xargs**：参数传递
   - find . -name "*.txt" | xargs rm

### 8.2 正则表达式
1. **grep**：搜索
   - grep pattern file
   - grep -i pattern file：忽略大小写
   - grep -v pattern file：反向匹配
   - grep -E pattern file：扩展正则
   - grep -r pattern directory：递归搜索

2. **sed**：流编辑器
   - sed 's/old/new/g' file：替换
   - sed -i 's/old/new/g' file：原地修改
   - sed 'n'p file：打印第n行
   - sed 'n'd file：删除第n行

3. **awk**：文本处理语言
   - awk '{print $1}' file：打印第一列
   - awk -F: '{print $1}' /etc/passwd：指定分隔符
   - awk '$3 > 100' file：条件过滤
   - awk 'BEGIN{sum=0}{sum+=$1}END{print sum}' file：求和

## 九、总结
Shell脚本是Linux自动化运维的重要工具。本章介绍了Shell脚本的基础知识，包括变量、数组、运算符、流程控制、函数、调试和常用文本处理命令。掌握这些内容可以编写功能强大的Shell脚本，提高工作效率。

---

## 章节：CH06 软件包管理、磁盘与日志管理笔记

# CH06 软件包管理、磁盘与日志管理笔记

## 一、软件包管理
### 1.1 软件包管理概述
- **作用**：方便地安装、升级、删除软件
- **主流包管理系统**：
  - RPM（Red Hat Package Manager）：Red Hat、CentOS、Fedora
  - DEB：Debian、Ubuntu
  - Pacman：Arch Linux
  - Portage：Gentoo

### 1.2 RPM包管理
1. **RPM包命名规则**
   - name-version-release.arch.rpm
   - 示例：nginx-1.18.0-1.el7.x86_64.rpm

2. **安装RPM包**
   - rpm -i package.rpm：安装
   - rpm -ivh package.rpm：显示进度安装
   - rpm -U package.rpm：升级（不存在则安装）
   - rpm -F package.rpm：更新（仅更新已安装的）

3. **查询RPM包**
   - rpm -q package：查询是否安装
   - rpm -qa：查询所有已安装的包
   - rpm -qi package：查询包信息
   - rpm -ql package：查询包安装的文件
   - rpm -qf file：查询文件属于哪个包
   - rpm -qc package：查询配置文件
   - rpm -qd package：查询文档文件

4. **删除RPM包**
   - rpm -e package：删除
   - rpm -e --nodeps package：忽略依赖删除

5. **验证RPM包**
   - rpm -V package：验证包
   - rpm -Va：验证所有包

### 1.3 YUM/DNF包管理（RPM的前端）
1. **YUM（Yellowdog Updater, Modified）**
   - CentOS 7及之前

2. **DNF（Dandified YUM）**
   - CentOS 8及以后
   - YUM的下一代版本

3. **常用命令**
   - yum install package：安装
   - yum remove package：删除
   - yum update package：更新
   - yum update：更新所有
   - yum search keyword：搜索
   - yum list：列出所有包
   - yum list installed：列出已安装的包
   - yum info package：显示包信息
   - yum provides file：查询文件属于哪个包
   - yum clean all：清理缓存
   - yum makecache：生成缓存

4. **YUM仓库配置**
   - 配置文件：/etc/yum.repos.d/*.repo
   - 示例配置：
     ```
     [base]
     name=CentOS-$releasever - Base
     baseurl=http://mirror.centos.org/centos/$releasever/os/$basearch/
     gpgcheck=1
     gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-CentOS-7
     enabled=1
     ```

### 1.4 DEB包管理（Debian/Ubuntu）
1. **dpkg命令**
   - dpkg -i package.deb：安装
   - dpkg -r package：删除（保留配置）
   - dpkg -P package：彻底删除
   - dpkg -l：列出所有包
   - dpkg -s package：查询包信息
   - dpkg -L package：查询包安装的文件
   - dpkg -S file：查询文件属于哪个包

2. **apt命令**
   - apt update：更新包列表
   - apt install package：安装
   - apt remove package：删除（保留配置）
   - apt purge package：彻底删除
   - apt upgrade：升级所有包
   - apt full-upgrade：完整升级
   - apt search keyword：搜索
   - apt show package：显示包信息
   - apt list：列出包
   - apt autoremove：自动删除不需要的包

3. **apt-get命令**
   - apt-get update
   - apt-get install package
   - apt-get upgrade

4. **APT源配置**
   - 配置文件：/etc/apt/sources.list
   - /etc/apt/sources.list.d/*.list

## 二、磁盘管理
### 2.1 磁盘设备命名
- **IDE硬盘**：/dev/hda、/dev/hdb
- **SATA/SCSI硬盘**：/dev/sda、/dev/sdb
- **NVMe SSD**：/dev/nvme0n1、/dev/nvme1n1
- **分区**：/dev/sda1、/dev/sda2

### 2.2 磁盘分区
1. **MBR分区**
   - 最多4个主分区
   - 或3个主分区+1个扩展分区
   - 最大支持2TB磁盘

2. **GPT分区**
   - 最多128个分区
   - 支持大于2TB磁盘
   - 现代系统推荐使用

3. **分区工具**
   - fdisk：MBR分区
   - gdisk：GPT分区
   - parted：通用分区工具

4. **fdisk使用示例**
   ```
   fdisk /dev/sda
   n：创建新分区
   p：主分区
   e：扩展分区
   d：删除分区
   w：保存退出
   q：不保存退出
   ```

### 2.3 文件系统
1. **创建文件系统（格式化）**
   - mkfs.ext4 /dev/sda1
   - mkfs.xfs /dev/sda1
   - mkfs.vfat /dev/sda1

2. **文件系统检查**
   - fsck /dev/sda1
   - fsck.ext4 /dev/sda1
   - e2fsck /dev/sda1（ext2/3/4）
   - xfs_repair /dev/sda1（XFS）

3. **文件系统标签**
   - e2label /dev/sda1 label（ext2/3/4）
   - xfs_admin -L label /dev/sda1（XFS）

### 2.4 挂载文件系统
1. **手动挂载**
   - mount /dev/sda1 /mnt
   - mount -t ext4 /dev/sda1 /mnt
   - mount -o ro /dev/sda1 /mnt（只读）
   - mount -o remount,rw /dev/sda1（重新挂载）

2. **查看挂载**
   - mount
   - df -h
   - cat /proc/mounts

3. **卸载**
   - umount /dev/sda1
   - umount /mnt
   - umount -l /mnt（延迟卸载）

4. **永久挂载（/etc/fstab）**
   - 格式：设备 挂载点 文件系统类型 选项 转储 检查
   - 示例：
     ```
     /dev/sda1    /        ext4    defaults    0 1
     /dev/sda2    swap     swap    defaults    0 0
     UUID=xxx     /data    ext4    defaults    0 2
     ```

5. **查看UUID**
   - blkid
   - lsblk -f

### 2.5 交换空间（Swap）
1. **创建交换分区**
   - fdisk创建分区，类型设为82
   - mkswap /dev/sda2
   - swapon /dev/sda2

2. **创建交换文件**
   - dd if=/dev/zero of=/swapfile bs=1G count=2
   - chmod 600 /swapfile
   - mkswap /swapfile
   - swapon /swapfile

3. **永久启用**
   - 编辑/etc/fstab：/swapfile swap swap defaults 0 0

4. **查看交换空间**
   - free -h
   - swapon -s

### 2.6 LVM（逻辑卷管理）
1. **LVM概念**
   - PV（物理卷）：物理硬盘或分区
   - VG（卷组）：多个PV组成
   - LV（逻辑卷）：从VG中划分

2. **创建LVM**
   - 创建PV：pvcreate /dev/sdb1 /dev/sdc1
   - 创建VG：vgcreate vgdata /dev/sdb1 /dev/sdc1
   - 创建LV：lvcreate -L 10G -n lvdata vgdata

3. **格式化和挂载**
   - mkfs.ext4 /dev/vgdata/lvdata
   - mount /dev/vgdata/lvdata /data

4. **扩展LVM**
   - 扩展VG：vgextend vgdata /dev/sdd1
   - 扩展LV：lvextend -L +5G /dev/vgdata/lvdata
   - 扩展文件系统：resize2fs /dev/vgdata/lvdata

5. **查看LVM**
   - pvdisplay
   - vgdisplay
   - lvdisplay

### 2.7 RAID（磁盘阵列）
1. **RAID级别**
   - RAID 0：条带化，性能好，无冗余
   - RAID 1：镜像，冗余好，性能一般
   - RAID 5：条带化+奇偶校验，平衡性能和冗余
   - RAID 6：RAID 5+双奇偶校验，更多冗余
   - RAID 10：RAID 1+0，性能和冗余都好

2. **mdadm创建RAID**
   - mdadm --create /dev/md0 --level=5 --raid-devices=3 /dev/sdb1 /dev/sdc1 /dev/sdd1
   - mkfs.ext4 /dev/md0
   - mount /dev/md0 /data

3. **查看RAID**
   - cat /proc/mdstat
   - mdadm --detail /dev/md0

## 三、日志管理
### 3.1 syslog系统日志
1. **传统syslog**
   - 守护进程：syslogd
   - 配置文件：/etc/syslog.conf

2. **rsyslog**
   - 现代系统的syslog实现
   - 配置文件：/etc/rsyslog.conf
   - 配置目录：/etc/rsyslog.d/

3. **syslog日志级别**
   - emerg：紧急
   - alert：警报
   - crit：严重
   - err：错误
   - warning：警告
   - notice：通知
   - info：信息
   - debug：调试

4. **syslog设施**
   - auth：认证
   - authpriv：认证（私有）
   - cron：定时任务
   - daemon：守护进程
   - kern：内核
   - mail：邮件
   - news：新闻
   - user：用户
   - local0-local7：本地自定义

### 3.2 常见日志文件
- **/var/log/messages**：系统消息（CentOS）
- **/var/log/syslog**：系统消息（Ubuntu）
- **/var/log/kern.log**：内核日志
- **/var/log/auth.log**：认证日志（Ubuntu）
- **/var/log/secure**：安全日志（CentOS）
- **/var/log/cron**：cron日志
- **/var/log/maillog**：邮件日志
- **/var/log/dmesg**：内核启动日志
- **/var/log/boot.log**：系统启动日志

### 3.3 journald（systemd日志）
1. **journalctl命令**
   - journalctl：查看所有日志
   - journalctl -u service：查看服务日志
   - journalctl -f：实时查看
   - journalctl -n 50：查看最后50行
   - journalctl --since "2023-01-01" --until "2023-01-02"：按时间范围
   - journalctl -p err：查看错误级别
   - journalctl -k：查看内核日志
   - journalctl _PID=1234：查看指定PID日志
   - journalctl _UID=1000：查看指定UID日志

2. **journald配置**
   - 配置文件：/etc/systemd/journald.conf
   - 存储：/var/log/journal/（持久化）或/run/log/journal/（临时）

### 3.4 日志查看工具
1. **dmesg**：查看内核日志
   - dmesg
   - dmesg | less
   - dmesg -T：显示时间

2. **tail**：查看日志末尾
   - tail /var/log/messages
   - tail -f /var/log/messages：实时监控
   - tail -n 100 /var/log/messages：最后100行

3. **grep**：搜索日志
   - grep error /var/log/messages
   - grep -i error /var/log/messages：忽略大小写

4. **less**：分页查看
   - less /var/log/messages

### 3.5 日志轮转（logrotate）
1. **logrotate作用**
   - 定期轮转日志文件
   - 压缩旧日志
   - 删除过期日志

2. **配置文件**
   - 主配置：/etc/logrotate.conf
   - 配置目录：/etc/logrotate.d/

3. **配置示例**
   ```
   /var/log/messages {
       daily
       rotate 7
       compress
       delaycompress
       missingok
       notifempty
       create 0600 root root
       postrotate
           /bin/kill -HUP `cat /var/run/syslogd.pid 2> /dev/null` 2> /dev/null || true
       endscript
   }
   ```

4. **手动执行**
   - logrotate /etc/logrotate.conf
   - logrotate -f /etc/logrotate.conf：强制轮转

## 四、总结
软件包管理、磁盘管理和日志管理是Linux系统管理的重要内容。掌握RPM/YUM和DEB/APT等包管理工具，可以方便地管理软件；掌握磁盘分区、LVM、RAID和文件系统，可以高效地管理存储；掌握syslog和journald等日志系统，可以快速定位和解决问题。这些知识对于系统维护和故障排查都非常重要。

---

## 章节：CH07 进程与服务管理笔记

# CH07 进程与服务管理笔记

## 一、进程概念深入
### 1.1 进程生命周期
1. **创建（Created）**
   - fork()系统调用创建新进程
   - 复制父进程的地址空间

2. **就绪（Ready）**
   - 等待CPU调度
   - 在运行队列中

3. **运行（Running）**
   - 占用CPU执行
   - 时间片用完或等待事件时切换

4. **阻塞（Blocked）**
   - 等待I/O或其他事件
   - 移出运行队列

5. **终止（Terminated）**
   - 执行结束或被终止
   - 释放资源

### 1.2 进程属性
- **PID**：进程ID
- **PPID**：父进程ID
- **UID**：用户ID
- **GID**：组ID
- **状态**：R（运行）、S（睡眠）、D（不可中断睡眠）、T（停止）、Z（僵尸）
- **优先级**：nice值（-20到19）
- **内存使用**：VSZ（虚拟内存大小）、RSS（常驻内存大小）

## 二、进程监控与管理
### 2.1 进程查看命令详解
1. **ps命令详细选项**
   - a：显示所有用户的进程
   - u：显示用户信息
   - x：显示没有控制终端的进程
   - -e：显示所有进程
   - -f：完整格式
   - -l：长格式
   - -o：自定义输出格式
   - 常用组合：
     - ps aux
     - ps -ef
     - ps -eo pid,ppid,cmd,%mem,%cpu

2. **top命令详细使用**
   - 交互命令：
     - h：帮助
     - k：杀死进程
     - r：调整优先级
     - P：按CPU排序
     - M：按内存排序
     - T：按时间排序
     - u：过滤用户
     - 1：显示每个CPU核心
     - f：选择显示字段
   - 输出字段解释：
     - PID：进程ID
     - USER：用户
     - PR：优先级
     - NI：nice值
     - VIRT：虚拟内存
     - RES：常驻内存
     - SHR：共享内存
     - S：状态
     - %CPU：CPU使用率
     - %MEM：内存使用率
     - TIME+：CPU时间
     - COMMAND：命令

3. **htop命令（增强版top）**
   - 功能：
     - 彩色显示
     - 鼠标支持
     - 进程树显示
     - 垂直/水平滚动
   - 常用快捷键：
     - F2：设置
     - F3：搜索
     - F4：过滤
     - F5：树视图
     - F9：杀死进程

### 2.2 进程操作深入
1. **信号（Signal）**
   - 常用信号：
     - 1 (SIGHUP)：重新加载配置
     - 2 (SIGINT)：中断（Ctrl+C）
     - 3 (SIGQUIT)：退出（Ctrl+\）
     - 9 (SIGKILL)：强制杀死
     - 15 (SIGTERM)：正常终止
     - 18 (SIGCONT)：继续
     - 19 (SIGSTOP)：停止
   - 查看所有信号：kill -l

2. **进程优先级调整**
   - nice：启动时指定优先级
     - nice -n -10 command：高优先级
     - nice -n 10 command：低优先级
   - renice：调整运行中进程的优先级
     - renice -n -10 -p PID
     - renice -n -10 -u user

3. **进程资源限制（ulimit）**
   - 查看限制：ulimit -a
   - 常用限制：
     - -n：文件描述符数量
     - -u：用户进程数
     - -s：栈大小
     - -v：虚拟内存大小
   - 临时设置：ulimit -n 65535
   - 永久设置：编辑/etc/security/limits.conf
     ```
     * soft nofile 65535
     * hard nofile 65535
     ```

## 三、守护进程（Daemon）
### 3.1 守护进程概念
- **定义**：在后台运行的特殊进程
- **特点**：
  - 没有控制终端
  - 长期运行
  - 周期性执行任务或等待事件
  - 通常以root用户运行

### 3.2 编写守护进程的步骤
1. 创建子进程，父进程退出
2. 在子进程中创建新会话
3. 改变当前工作目录
4. 重设文件权限掩码
5. 关闭不需要的文件描述符
6. 处理SIGCHLD信号

### 3.3 常见守护进程
- **sshd**：SSH服务
- **httpd/nginx**：Web服务
- **mysqld**：MySQL服务
- **crond**：定时任务
- **syslogd/rsyslogd**：日志服务

## 四、系统服务管理（systemd）
### 4.1 systemd概述
- **systemd**：现代Linux系统的初始化系统和服务管理器
- **特点**：
  - 并行启动服务
  - 按需启动
  - 依赖管理
  - 日志管理（journald）
  - 统一的配置格式

### 4.2 systemd单元类型
- **.service**：服务单元
- **.socket**：套接字单元
- **.target**：目标单元
- **.mount**：挂载单元
- **.timer**：定时器单元
- **.path**：路径监控单元

### 4.3 服务管理命令
1. **基本操作**
   - systemctl start service：启动
   - systemctl stop service：停止
   - systemctl restart service：重启
   - systemctl reload service：重新加载
   - systemctl status service：查看状态

2. **开机自启**
   - systemctl enable service：启用自启
   - systemctl disable service：禁用自启
   - systemctl is-enabled service：查看是否自启
   - systemctl list-unit-files --type=service：列出所有服务

3. **查看服务**
   - systemctl list-units --type=service：列出运行中的服务
   - systemctl list-units --type=service --all：列出所有服务
   - systemctl cat service：查看服务配置

4. **故障排查**
   - systemctl is-active service：是否活跃
   - systemctl is-failed service：是否失败
   - systemctl reset-failed service：重置失败状态

### 4.4 系统状态管理
1. **关机和重启**
   - systemctl poweroff：关机
   - systemctl reboot：重启
   - systemctl halt：挂起
   - systemctl suspend：挂起到内存
   - systemctl hibernate：挂起到磁盘

2. **救援模式**
   - systemctl rescue：进入救援模式
   - systemctl emergency：进入紧急模式

3. **目标（Target）**
   - systemctl get-default：查看默认目标
   - systemctl set-default target：设置默认目标
   - systemctl isolate target：切换目标
   - 常用目标：
     - multi-user.target：多用户文本模式
     - graphical.target：图形模式
     - rescue.target：救援模式
     - emergency.target：紧急模式

### 4.5 编写systemd服务文件
1. **服务文件位置**
   - /etc/systemd/system/：系统管理员创建
   - /usr/lib/systemd/system/：发行版提供

2. **服务文件示例**
   ```
   [Unit]
   Description=My Custom Service
   After=network.target

   [Service]
   Type=simple
   ExecStart=/usr/local/bin/myservice
   ExecReload=/bin/kill -HUP $MAINPID
   Restart=on-failure
   User=nobody
   WorkingDirectory=/var/lib/myservice

   [Install]
   WantedBy=multi-user.target
   ```

3. **常用选项**
   - [Unit]段：
     - Description：描述
     - After：在哪些服务之后启动
     - Requires：依赖的服务
     - Wants：建议依赖的服务
   - [Service]段：
     - Type：服务类型（simple、forking、oneshot、dbus、notify）
     - ExecStart：启动命令
     - ExecStop：停止命令
     - ExecReload：重载命令
     - Restart：重启策略（no、on-success、on-failure、always）
     - User：运行用户
     - Group：运行组
     - WorkingDirectory：工作目录
   - [Install]段：
     - WantedBy：被哪些目标需要

4. **应用新服务**
   - systemctl daemon-reload：重载配置
   - systemctl start myservice：启动服务
   - systemctl enable myservice：启用自启

## 五、定时任务
### 5.1 cron定时任务
1. **cron服务**
   - crond：cron守护进程
   - systemctl status crond：查看状态

2. **crontab命令**
   - crontab -e：编辑当前用户的crontab
   - crontab -l：列出当前用户的crontab
   - crontab -r：删除当前用户的crontab
   - crontab -u user -e：编辑指定用户的crontab

3. **crontab格式**
   ```
   分 时 日 月 周 命令
   *  *  *  *  *  command
   -  -  -  -  -
   |  |  |  |  |
   |  |  |  |  +--- 星期几 (0-7, 0和7都是周日)
   |  |  |  +------ 月份 (1-12)
   |  |  +--------- 日期 (1-31)
   |  +------------ 小时 (0-23)
   +--------------- 分钟 (0-59)
   ```

4. **特殊字符**
   - *：任意值
   - ,：分隔多个值
   - -：范围
   - /：间隔

5. **示例**
   - 每小时执行：0 * * * * command
   - 每天凌晨2点执行：0 2 * * * command
   - 每周日凌晨3点执行：0 3 * * 0 command
   - 每月1号凌晨4点执行：0 4 1 * * command
   - 每10分钟执行：*/10 * * * * command
   - 每天8点到18点每小时执行：0 8-18 * * * command
   - 每周一、三、五凌晨2点执行：0 2 * * 1,3,5 command

6. **系统cron任务**
   - /etc/crontab：系统crontab
   - /etc/cron.d/：系统cron目录
   - /etc/cron.hourly/：每小时执行
   - /etc/cron.daily/：每天执行
   - /etc/cron.weekly/：每周执行
   - /etc/cron.monthly/：每月执行

7. **cron日志**
   - /var/log/cron：cron日志
   - tail -f /var/log/cron：实时监控

### 5.2 at一次性任务
1. **at命令**
   - at time：在指定时间执行任务
   - at now + 5 minutes：5分钟后执行
   - at now + 1 hour：1小时后执行
   - at 10:00：今天10点执行
   - at 10:00 tomorrow：明天10点执行
   - at 10:00 2024-01-01：2024年1月1日10点执行

2. **管理at任务**
   - atq：列出at任务
   - atrm job：删除at任务

3. **batch命令**
   - 类似at，但在系统负载低时执行

### 5.3 systemd定时器
1. **定时器单元文件**
   - myservice.timer：定时器文件
   - myservice.service：服务文件

2. **定时器示例**
   ```
   [Unit]
   Description=Run My Service Daily

   [Timer]
   OnCalendar=daily
   Persistent=true

   [Install]
   WantedBy=timers.target
   ```

3. **OnCalendar格式**
   - daily：每天
   - weekly：每周
   - monthly：每月
   - hourly：每小时
   - *-*-* 00:00:00：每天0点
   - Mon *-*-* 02:00:00：每周一2点

4. **管理定时器**
   - systemctl start myservice.timer：启动
   - systemctl enable myservice.timer：自启
   - systemctl list-timers：列出定时器

## 六、总结
进程和服务管理是Linux系统管理的核心内容。深入理解进程生命周期、掌握进程监控和管理工具、熟悉systemd服务管理和cron定时任务，对于系统维护、性能优化和故障排查都非常重要。这些知识可以帮助管理员高效地管理系统，确保服务稳定运行。

---

## 章节：CH08 Nginx 1笔记

# CH08 Nginx 1笔记

## 一、Nginx概述
### 1.1 Nginx简介
- **Nginx（Engine X）**：高性能的Web服务器和反向代理服务器
- **开发者**：Igor Sysoev
- **首次发布**：2004年
- **特点**：
  - 高性能、高并发
  - 内存占用少
  - 配置简单
  - 稳定性好
  - 模块化设计

### 1.2 Nginx应用场景
1. **Web服务器**
   - 静态资源服务
   - 虚拟主机

2. **反向代理**
   - 负载均衡
   - 缓存
   - SSL终止

3. **邮件代理服务器**
   - IMAP/POP3/SMTP代理

4. **API网关**
   - 请求路由
   - 限流
   - 认证

### 1.3 Nginx与Apache对比
| 特性 | Nginx | Apache |
|------|-------|--------|
| 架构 | 事件驱动、异步非阻塞 | 进程/线程驱动 |
| 并发 | 高并发（数万连接） | 中低并发 |
| 内存 | 占用少 | 占用多 |
| 模块 | 较少，核心稳定 | 丰富，功能多样 |
| 配置 | 简单 | 相对复杂 |
| 重写规则 | 支持 | 支持，更强大 |

## 二、Nginx安装
### 2.1 使用包管理器安装
1. **CentOS/RHEL**
   ```bash
   yum install epel-release
   yum install nginx
   systemctl start nginx
   systemctl enable nginx
   ```

2. **Ubuntu/Debian**
   ```bash
   apt update
   apt install nginx
   systemctl start nginx
   systemctl enable nginx
   ```

### 2.2 源码编译安装
1. **安装依赖**
   - CentOS:
     ```bash
     yum install gcc pcre-devel zlib-devel openssl-devel
     ```
   - Ubuntu:
     ```bash
     apt install build-essential libpcre3-dev zlib1g-dev libssl-dev
     ```

2. **下载源码**
   ```bash
   wget http://nginx.org/download/nginx-1.24.0.tar.gz
   tar -zxf nginx-1.24.0.tar.gz
   cd nginx-1.24.0
   ```

3. **配置编译选项**
   ```bash
   ./configure \
       --prefix=/usr/local/nginx \
       --with-http_ssl_module \
       --with-http_v2_module \
       --with-http_realip_module \
       --with-http_gzip_static_module \
       --with-stream
   ```

4. **编译安装**
   ```bash
   make
   make install
   ```

5. **创建systemd服务文件**
   ```
   [Unit]
   Description=nginx - high performance web server
   After=network.target

   [Service]
   Type=forking
   PIDFile=/usr/local/nginx/logs/nginx.pid
   ExecStart=/usr/local/nginx/sbin/nginx
   ExecReload=/usr/local/nginx/sbin/nginx -s reload
   ExecStop=/usr/local/nginx/sbin/nginx -s stop

   [Install]
   WantedBy=multi-user.target
   ```

## 三、Nginx基本配置
### 3.1 Nginx目录结构
- **/etc/nginx/**：配置目录（包管理器安装）
  - nginx.conf：主配置文件
  - conf.d/：子配置目录
  - sites-available/：可用站点
  - sites-enabled/：启用站点

- **/usr/local/nginx/**：安装目录（源码安装）
  - conf/：配置文件
  - html/：默认网页目录
  - logs/：日志目录
  - sbin/：可执行文件

### 3.2 nginx.conf主配置文件结构
```nginx
# 全局块
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log;
pid /run/nginx.pid;

# events块
events {
    worker_connections 1024;
    use epoll;
}

# http块
http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;

    sendfile        on;
    tcp_nopush      on;
    tcp_nodelay     on;
    keepalive_timeout  65;
    gzip  on;

    include /etc/nginx/conf.d/*.conf;
    include /etc/nginx/sites-enabled/*;
}
```

### 3.3 全局块配置
1. **user**：运行Nginx的用户和组
   ```nginx
   user nginx;
   user www-data;
   ```

2. **worker_processes**：工作进程数
   ```nginx
   worker_processes auto;  # 自动设置为CPU核心数
   worker_processes 4;     # 手动设置为4
   ```

3. **error_log**：错误日志
   ```nginx
   error_log /var/log/nginx/error.log;
   error_log /var/log/nginx/error.log warn;  # 指定日志级别
   ```

4. **pid**：PID文件
   ```nginx
   pid /run/nginx.pid;
   ```

### 3.4 events块配置
1. **worker_connections**：每个工作进程的最大连接数
   ```nginx
   worker_connections 1024;
   worker_connections 2048;
   ```

2. **use**：事件模型
   ```nginx
   use epoll;  # Linux
   use kqueue; # BSD/Mac
   ```

3. **multi_accept**：是否同时接受多个连接
   ```nginx
   multi_accept on;
   ```

### 3.5 http块基本配置
1. **include mime.types**：包含MIME类型文件
   ```nginx
   include /etc/nginx/mime.types;
   default_type application/octet-stream;
   ```

2. **日志配置**
   ```nginx
   log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                   '$status $body_bytes_sent "$http_referer" '
                   '"$http_user_agent" "$http_x_forwarded_for"';
   access_log /var/log/nginx/access.log main;
   ```

3. **性能优化**
   ```nginx
   sendfile on;
   tcp_nopush on;
   tcp_nodelay on;
   keepalive_timeout 65;
   ```

4. **Gzip压缩**
   ```nginx
   gzip on;
   gzip_vary on;
   gzip_min_length 1000;
   gzip_types text/plain text/css text/xml text/javascript application/javascript application/json application/xml;
   gzip_comp_level 6;
   ```

## 四、虚拟主机配置
### 4.1 基于域名的虚拟主机
```nginx
server {
    listen 80;
    server_name example.com www.example.com;
    root /var/www/example.com;
    index index.html index.htm;

    location / {
        try_files $uri $uri/ =404;
    }
}

server {
    listen 80;
    server_name test.com www.test.com;
    root /var/www/test.com;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }
}
```

### 4.2 基于端口的虚拟主机
```nginx
server {
    listen 80;
    server_name example.com;
    root /var/www/site1;
    index index.html;
}

server {
    listen 8080;
    server_name example.com;
    root /var/www/site2;
    index index.html;
}
```

### 4.3 基于IP的虚拟主机
```nginx
server {
    listen 192.168.1.100:80;
    server_name _;
    root /var/www/site1;
}

server {
    listen 192.168.1.101:80;
    server_name _;
    root /var/www/site2;
}
```

### 4.4 server块常用配置
1. **listen**：监听端口
   ```nginx
   listen 80;
   listen 443 ssl;
   listen [::]:80;
   listen 127.0.0.1:8080;
   ```

2. **server_name**：服务器名
   ```nginx
   server_name example.com;
   server_name www.example.com example.com;
   server_name *.example.com;
   server_name _;  # 匹配所有
   ```

3. **root**：网站根目录
   ```nginx
   root /var/www/html;
   ```

4. **index**：默认首页
   ```nginx
   index index.html index.htm index.php;
   ```

## 五、location配置
### 5.1 location语法
```nginx
location [=|~|~*|^~] uri {
    ...
}
```

### 5.2 location匹配规则
1. **=**：精确匹配
   ```nginx
   location = / {
       # 仅匹配/
   }
   ```

2. **^~**：前缀匹配，优先级高于正则
   ```nginx
   location ^~ /images/ {
       # 匹配以/images/开头的URL
   }
   ```

3. **~**：正则匹配（区分大小写）
   ```nginx
   location ~ \.php$ {
       # 匹配.php结尾的URL
   }
   ```

4. **~***：正则匹配（不区分大小写）
   ```nginx
   location ~* \.(jpg|png|gif)$ {
       # 匹配.jpg/.png/.gif结尾的URL
   }
   ```

5. **无修饰符**：前缀匹配
   ```nginx
   location / {
       # 匹配所有URL
   }
   ```

### 5.3 location匹配优先级
1. = 精确匹配 → 找到立即停止
2. ^~ 前缀匹配 → 找到立即停止
3. ~ / ~* 正则匹配 → 按顺序匹配，找到第一个立即停止
4. 无修饰符前缀匹配 → 最长匹配

### 5.4 location常用指令
1. **root**：根目录
   ```nginx
   location /images/ {
       root /var/www;
       # /images/logo.png → /var/www/images/logo.png
   }
   ```

2. **alias**：别名
   ```nginx
   location /images/ {
       alias /var/www/pics/;
       # /images/logo.png → /var/www/pics/logo.png
   }
   ```

3. **index**：默认文件
   ```nginx
   location / {
       index index.html index.php;
   }
   ```

4. **try_files**：尝试文件
   ```nginx
   location / {
       try_files $uri $uri/ /index.php?$query_string;
   }
   ```

5. **deny/allow**：访问控制
   ```nginx
   location /admin/ {
       deny 192.168.1.100;
       allow 192.168.1.0/24;
       deny all;
   }
   ```

## 六、Nginx命令
### 6.1 基本命令
1. **启动**
   ```bash
   nginx
   systemctl start nginx
   ```

2. **停止**
   ```bash
   nginx -s stop    # 立即停止
   nginx -s quit    # 优雅停止
   systemctl stop nginx
   ```

3. **重载配置**
   ```bash
   nginx -s reload
   systemctl reload nginx
   ```

4. **重启**
   ```bash
   systemctl restart nginx
   ```

5. **查看状态**
   ```bash
   systemctl status nginx
   ```

### 6.2 配置检查
```bash
nginx -t          # 检查配置文件语法
nginx -T          # 检查配置并打印
nginx -v          # 查看版本
nginx -V          # 查看版本和编译参数
```

## 七、总结
Nginx是一款高性能的Web服务器和反向代理服务器。本章介绍了Nginx的基本概念、安装方法、主配置文件结构、虚拟主机配置、location匹配规则等内容。掌握这些基础知识是使用Nginx的第一步，为后续学习反向代理、负载均衡、SSL等高级功能打下基础。

---

## 章节：CH09 Nginx 2笔记

# CH09 Nginx 2笔记

## 一、Nginx反向代理
### 1.1 反向代理概述
- **反向代理**：位于客户端和真实服务器之间，代表服务器接收请求
- **作用**：
  - 负载均衡
  - 缓存
  - SSL终止
  - 安全防护
  - 请求路由

### 1.2 基本反向代理配置
```nginx
server {
    listen 80;
    server_name example.com;

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 1.3 常用proxy指令
1. **proxy_pass**：后端服务器地址
   ```nginx
   proxy_pass http://127.0.0.1:8080;
   proxy_pass http://backend;  # upstream名称
   ```

2. **proxy_set_header**：设置请求头
   ```nginx
   proxy_set_header Host $host;
   proxy_set_header X-Real-IP $remote_addr;
   proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
   proxy_set_header X-Forwarded-Proto $scheme;
   ```

3. **proxy_connect_timeout**：连接超时
   ```nginx
   proxy_connect_timeout 60s;
   ```

4. **proxy_send_timeout**：发送超时
   ```nginx
   proxy_send_timeout 60s;
   ```

5. **proxy_read_timeout**：读取超时
   ```nginx
   proxy_read_timeout 60s;
   ```

6. **proxy_buffering**：缓冲
   ```nginx
   proxy_buffering on;
   proxy_buffers 8 4k;
   proxy_buffer_size 4k;
   ```

7. **proxy_redirect**：重写重定向URL
   ```nginx
   proxy_redirect http://backend/ http://frontend/;
   proxy_redirect default;
   ```

## 二、Nginx负载均衡
### 2.1 负载均衡概述
- **作用**：将请求分发到多个后端服务器
- **优势**：
  - 提高性能
  - 增加可靠性
  - 易于扩展

### 2.2 upstream配置
```nginx
upstream backend {
    server 192.168.1.10:8080;
    server 192.168.1.11:8080;
    server 192.168.1.12:8080;
}

server {
    listen 80;
    server_name example.com;

    location / {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 2.3 负载均衡算法
1. **轮询（round_robin）**：默认
   ```nginx
   upstream backend {
       server 192.168.1.10:8080;
       server 192.168.1.11:8080;
   }
   ```

2. **加权轮询（weight）**
   ```nginx
   upstream backend {
       server 192.168.1.10:8080 weight=3;
       server 192.168.1.11:8080 weight=2;
       server 192.168.1.12:8080 weight=1;
   }
   ```

3. **IP哈希（ip_hash）**：同一客户端访问同一服务器
   ```nginx
   upstream backend {
       ip_hash;
       server 192.168.1.10:8080;
       server 192.168.1.11:8080;
   }
   ```

4. **最少连接（least_conn）**：分发给连接数最少的服务器
   ```nginx
   upstream backend {
       least_conn;
       server 192.168.1.10:8080;
       server 192.168.1.11:8080;
   }
   ```

5. **fair**：根据响应时间（需要第三方模块）
   ```nginx
   upstream backend {
       fair;
       server 192.168.1.10:8080;
       server 192.168.1.11:8080;
   }
   ```

### 2.4 server参数
1. **weight**：权重
   ```nginx
   server 192.168.1.10:8080 weight=3;
   ```

2. **max_fails**：最大失败次数
   ```nginx
   server 192.168.1.10:8080 max_fails=3;
   ```

3. **fail_timeout**：失败超时时间
   ```nginx
   server 192.168.1.10:8080 fail_timeout=30s;
   ```

4. **backup**：备份服务器
   ```nginx
   server 192.168.1.10:8080;
   server 192.168.1.11:8080 backup;
   ```

5. **down**：标记为不可用
   ```nginx
   server 192.168.1.10:8080 down;
   ```

### 2.5 健康检查
1. **被动健康检查**
   ```nginx
   upstream backend {
       server 192.168.1.10:8080 max_fails=3 fail_timeout=30s;
       server 192.168.1.11:8080 max_fails=3 fail_timeout=30s;
   }
   ```

2. **主动健康检查（需要nginx_upstream_check_module）**
   ```nginx
   upstream backend {
       server 192.168.1.10:8080;
       server 192.168.1.11:8080;
       check interval=3000 rise=2 fall=3 timeout=1000 type=http;
       check_http_send "HEAD / HTTP/1.0\r\n\r\n";
       check_http_expect_alive http_2xx http_3xx;
   }
   ```

## 三、Nginx缓存
### 3.1 缓存配置
```nginx
http {
    proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=my_cache:10m max_size=1g inactive=60m use_temp_path=off;

    server {
        listen 80;
        server_name example.com;

        location / {
            proxy_pass http://backend;
            proxy_cache my_cache;
            proxy_cache_valid 200 302 10m;
            proxy_cache_valid 404 1m;
            proxy_cache_key "$scheme$request_method$host$request_uri";
            add_header X-Cache-Status $upstream_cache_status;
        }
    }
}
```

### 3.2 proxy_cache_path参数
- **path**：缓存目录
- **levels**：目录层次结构
- **keys_zone**：共享内存区域名称和大小
- **max_size**：最大缓存大小
- **inactive**：缓存未被访问的过期时间
- **use_temp_path**：是否使用临时目录

### 3.3 缓存相关指令
1. **proxy_cache**：使用缓存
   ```nginx
   proxy_cache my_cache;
   ```

2. **proxy_cache_valid**：缓存有效期
   ```nginx
   proxy_cache_valid 200 302 10m;
   proxy_cache_valid 404 1m;
   proxy_cache_valid any 1h;
   ```

3. **proxy_cache_key**：缓存键
   ```nginx
   proxy_cache_key "$scheme$request_method$host$request_uri";
   ```

4. **proxy_cache_bypass**：绕过缓存的条件
   ```nginx
   proxy_cache_bypass $cookie_nocache $arg_nocache;
   ```

5. **proxy_no_cache**：不缓存的条件
   ```nginx
   proxy_no_cache $cookie_nocache $arg_nocache;
   ```

6. **proxy_cache_revalidate**：重新验证缓存
   ```nginx
   proxy_cache_revalidate on;
   ```

7. **proxy_cache_use_stale**：使用过期缓存的条件
   ```nginx
   proxy_cache_use_stale error timeout updating http_500 http_502 http_503 http_504;
   ```

8. **proxy_cache_lock**：缓存锁
   ```nginx
   proxy_cache_lock on;
   proxy_cache_lock_timeout 5s;
   ```

### 3.4 清除缓存
1. **proxy_cache_purge**（需要ngx_cache_purge模块）
   ```nginx
   location ~ /purge(/.*) {
       allow 127.0.0.1;
       deny all;
       proxy_cache_purge my_cache $scheme$request_method$host$1;
   }
   ```

2. **手动清除**
   ```bash
   rm -rf /var/cache/nginx/*
   ```

## 四、Nginx SSL配置
### 4.1 HTTPS配置
```nginx
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name example.com www.example.com;

    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 1d;
    ssl_session_tickets off;

    location / {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

server {
    listen 80;
    listen [::]:80;
    server_name example.com www.example.com;
    return 301 https://$server_name$request_uri;
}
```

### 4.2 SSL相关指令
1. **ssl_certificate**：证书文件
   ```nginx
   ssl_certificate /etc/nginx/ssl/cert.pem;
   ```

2. **ssl_certificate_key**：私钥文件
   ```nginx
   ssl_certificate_key /etc/nginx/ssl/key.pem;
   ```

3. **ssl_protocols**：SSL协议版本
   ```nginx
   ssl_protocols TLSv1.2 TLSv1.3;
   ```

4. **ssl_ciphers**：加密套件
   ```nginx
   ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;
   ```

5. **ssl_prefer_server_ciphers**：优先使用服务器端加密套件
   ```nginx
   ssl_prefer_server_ciphers on;
   ```

6. **ssl_session_cache**：会话缓存
   ```nginx
   ssl_session_cache shared:SSL:10m;
   ```

7. **ssl_session_timeout**：会话超时
   ```nginx
   ssl_session_timeout 1d;
   ```

### 4.3 Let's Encrypt免费证书
1. **安装certbot**
   ```bash
   yum install certbot python3-certbot-nginx  # CentOS
   apt install certbot python3-certbot-nginx  # Ubuntu
   ```

2. **获取证书**
   ```bash
   certbot --nginx -d example.com -d www.example.com
   ```

3. **自动续期**
   ```bash
   certbot renew --dry-run
   ```

## 五、Nginx重写规则
### 5.1 rewrite指令
```nginx
rewrite regex replacement [flag];
```

### 5.2 flag参数
- **last**：停止处理当前ngx_http_rewrite_module指令集，开始搜索匹配新URI的location
- **break**：停止处理当前ngx_http_rewrite_module指令集
- **redirect**：返回302临时重定向
- **permanent**：返回301永久重定向

### 5.3 常见重写规则示例
1. **域名重定向**
   ```nginx
   server {
       listen 80;
       server_name www.example.com;
       rewrite ^(.*)$ https://example.com$1 permanent;
   }
   ```

2. **HTTP重定向到HTTPS**
   ```nginx
   server {
       listen 80;
       server_name example.com;
       return 301 https://$server_name$request_uri;
   }
   ```

3. **去掉www**
   ```nginx
   server {
       listen 80;
       server_name www.example.com;
       rewrite ^/(.*)$ http://example.com/$1 permanent;
   }
   ```

4. **添加www**
   ```nginx
   server {
       listen 80;
       server_name example.com;
       rewrite ^/(.*)$ http://www.example.com/$1 permanent;
   }
   ```

5. **伪静态**
   ```nginx
   rewrite ^/article/(\d+)\.html$ /article.php?id=$1 last;
   ```

6. **目录重定向**
   ```nginx
   rewrite ^/old/(.*)$ /new/$1 permanent;
   ```

### 5.4 if指令
```nginx
if ($request_method = POST) {
    return 405;
}

if ($http_user_agent ~* "bot") {
    return 403;
}

if (!-f $request_filename) {
    rewrite ^/(.*)$ /index.php?$1 last;
}
```

## 六、Nginx安全配置
### 6.1 隐藏版本号
```nginx
server_tokens off;
```

### 6.2 限制请求方法
```nginx
if ($request_method !~ ^(GET|HEAD|POST)$) {
    return 405;
}
```

### 6.3 防止盗链
```nginx
location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
    valid_referers none blocked server_names *.example.com;
    if ($invalid_referer) {
        return 403;
    }
}
```

### 6.4 限制连接数
```nginx
http {
    limit_conn_zone $binary_remote_addr zone=conn_limit:10m;

    server {
        location / {
            limit_conn conn_limit 10;
        }
    }
}
```

### 6.5 限制请求速率
```nginx
http {
    limit_req_zone $binary_remote_addr zone=req_limit:10m rate=1r/s;

    server {
        location / {
            limit_req zone=req_limit burst=5;
        }
    }
}
```

## 七、总结
本章深入介绍了Nginx的高级功能，包括反向代理、负载均衡、缓存、SSL配置、重写规则和安全配置。这些功能使Nginx成为一个强大的Web服务器和反向代理服务器，广泛应用于生产环境。掌握这些高级功能对于构建高性能、高可用的Web服务至关重要。

---

## 章节：CH10 Docker笔记

# CH10 Docker笔记

## 一、Docker概述
### 1.1 什么是Docker
- **Docker**：开源的容器化平台
- **开发者**：Docker公司
- **首次发布**：2013年
- **特点**：
  - 轻量级
  - 快速启动
  - 一致的环境
  - 易于部署
  - 版本控制

### 1.2 容器与虚拟机对比
| 特性 | 容器（Docker） | 虚拟机（VM） |
|------|---------------|--------------|
| 隔离级别 | 进程级隔离 | 完全隔离 |
| 内核 | 共享宿主机内核 | 独立内核 |
| 启动速度 | 秒级 | 分钟级 |
| 资源占用 | 少（MB级） | 多（GB级） |
| 性能 | 接近原生 | 有损耗 |
| 镜像大小 | 小 | 大 |

### 1.3 Docker核心概念
1. **镜像（Image）**
   - 只读模板
   - 用于创建容器
   - 分层存储

2. **容器（Container）**
   - 镜像的运行实例
   - 可读写层
   - 独立运行环境

3. **仓库（Repository）**
   - 存储镜像的地方
   - 公共仓库：Docker Hub
   - 私有仓库：Harbor、Registry

4. **Dockerfile**
   - 构建镜像的文本文件
   - 包含一系列指令

### 1.4 Docker应用场景
- **应用打包和分发**
- **微服务架构**
- **持续集成/持续部署（CI/CD）**
- **开发环境一致性**
- **快速弹性伸缩**

## 二、Docker安装
### 2.1 CentOS/RHEL安装
```bash
# 卸载旧版本
yum remove docker docker-client docker-client-latest docker-common docker-latest docker-latest-logrotate docker-logrotate docker-engine

# 安装依赖
yum install -y yum-utils

# 添加Docker仓库
yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo

# 安装Docker
yum install docker-ce docker-ce-cli containerd.io

# 启动Docker
systemctl start docker
systemctl enable docker

# 验证安装
docker --version
docker run hello-world
```

### 2.2 Ubuntu/Debian安装
```bash
# 更新包索引
apt update

# 安装依赖
apt install -y ca-certificates curl gnupg lsb-release

# 添加GPG密钥
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# 添加Docker仓库
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null

# 安装Docker
apt update
apt install -y docker-ce docker-ce-cli containerd.io

# 启动Docker
systemctl start docker
systemctl enable docker

# 验证安装
docker --version
docker run hello-world
```

### 2.3 配置镜像加速器
```bash
# 创建配置目录
mkdir -p /etc/docker

# 编辑配置文件
cat > /etc/docker/daemon.json <<EOF
{
  "registry-mirrors": [
    "https://docker.mirrors.ustc.edu.cn",
    "https://hub-mirror.c.163.com"
  ]
}
EOF

# 重启Docker
systemctl daemon-reload
systemctl restart docker
```

## 三、Docker镜像管理
### 3.1 搜索镜像
```bash
docker search ubuntu
docker search --filter=stars=100 ubuntu
docker search --format "table {{.Name}}\t{{.Stars}}\t{{.Description}}" ubuntu
```

### 3.2 拉取镜像
```bash
docker pull ubuntu
docker pull ubuntu:20.04
docker pull nginx:alpine
```

### 3.3 查看镜像
```bash
docker images
docker image ls
docker images ubuntu
```

### 3.4 查看镜像详细信息
```bash
docker inspect ubuntu
docker inspect --format='{{.Config.Image}}' ubuntu
```

### 3.5 删除镜像
```bash
docker rmi ubuntu
docker rmi -f ubuntu
docker image rm ubuntu
docker image prune  # 删除悬空镜像
docker image prune -a  # 删除所有未使用的镜像
```

### 3.6 镜像标签
```bash
docker tag ubuntu:latest myubuntu:v1.0
docker tag myubuntu:v1.0 myregistry.com/myubuntu:v1.0
```

### 3.7 保存和加载镜像
```bash
# 保存镜像到文件
docker save -o ubuntu.tar ubuntu
docker save ubuntu | gzip > ubuntu.tar.gz

# 从文件加载镜像
docker load -i ubuntu.tar
docker load < ubuntu.tar.gz
```

## 四、Docker容器管理
### 4.1 创建并启动容器
```bash
# 基本用法
docker run ubuntu

# 交互式运行
docker run -it ubuntu /bin/bash

# 后台运行
docker run -d nginx

# 指定名称
docker run --name mynginx -d nginx

# 端口映射
docker run -d -p 80:80 nginx
docker run -d -p 8080:80 nginx
docker run -d -p 192.168.1.100:80:80 nginx

# 目录挂载
docker run -d -v /host/path:/container/path nginx
docker run -d -v data:/data nginx  # 命名卷
docker run -d -v /host/path:/container/path:ro nginx  # 只读

# 环境变量
docker run -d -e KEY=value -e KEY2=value2 nginx

# 资源限制
docker run -d --memory=512m --cpus=2 nginx

# 完整示例
docker run -d \
  --name myapp \
  -p 8080:80 \
  -v /data:/app/data \
  -e DB_HOST=db \
  --network mynetwork \
  --memory=1g \
  --cpus=2 \
  myapp:v1.0
```

### 4.2 查看容器
```bash
# 查看运行中的容器
docker ps

# 查看所有容器
docker ps -a

# 查看容器详细信息
docker inspect mynginx

# 查看容器日志
docker logs mynginx
docker logs -f mynginx  # 实时查看
docker logs --tail 100 mynginx

# 查看容器进程
docker top mynginx

# 查看容器资源使用
docker stats
docker stats mynginx
```

### 4.3 操作容器
```bash
# 启动容器
docker start mynginx

# 停止容器
docker stop mynginx
docker kill mynginx  # 强制停止

# 重启容器
docker restart mynginx

# 暂停容器
docker pause mynginx
docker unpause mynginx

# 删除容器
docker rm mynginx
docker rm -f mynginx  # 强制删除
docker container prune  # 删除所有停止的容器

# 进入容器
docker exec -it mynginx /bin/bash
docker exec mynginx ls -l

# 复制文件
docker cp file.txt mynginx:/path/
docker cp mynginx:/path/file.txt .
```

### 4.4 容器生命周期
```bash
# 创建容器但不启动
docker create --name mynginx nginx

# 启动容器
docker start mynginx

# 停止容器
docker stop mynginx

# 删除容器
docker rm mynginx
```

## 五、Dockerfile
### 5.1 Dockerfile指令
1. **FROM**：基础镜像
   ```dockerfile
   FROM ubuntu:20.04
   FROM nginx:alpine
   ```

2. **MAINTAINER**：维护者信息（已弃用，用LABEL）
   ```dockerfile
   MAINTAINER name <email>
   ```

3. **LABEL**：镜像元数据
   ```dockerfile
   LABEL maintainer="name <email>"
   LABEL version="1.0"
   LABEL description="My image"
   ```

4. **RUN**：执行命令
   ```dockerfile
   RUN apt update && apt install -y nginx
   RUN ["echo", "Hello World"]
   ```

5. **CMD**：容器启动命令
   ```dockerfile
   CMD nginx -g "daemon off;"
   CMD ["nginx", "-g", "daemon off;"]
   ```

6. **ENTRYPOINT**：容器入口点
   ```dockerfile
   ENTRYPOINT ["nginx", "-g", "daemon off;"]
   ```

7. **EXPOSE**：暴露端口
   ```dockerfile
   EXPOSE 80
   EXPOSE 80/tcp 443/tcp
   ```

8. **ENV**：环境变量
   ```dockerfile
   ENV MYSQL_ROOT_PASSWORD=123456
   ENV PATH /usr/local/bin:$PATH
   ```

9. **ADD**：添加文件
   ```dockerfile
   ADD file.txt /path/
   ADD https://example.com/file.tar.gz /path/
   ADD file.tar.gz /path/  # 自动解压
   ```

10. **COPY**：复制文件
    ```dockerfile
    COPY file.txt /path/
    COPY . /app/
    ```

11. **WORKDIR**：工作目录
    ```dockerfile
    WORKDIR /app
    ```

12. **USER**：指定用户
    ```dockerfile
    USER nginx
    USER 1000
    ```

13. **VOLUME**：定义卷
    ```dockerfile
    VOLUME /data
    ```

14. **ARG**：构建参数
    ```dockerfile
    ARG VERSION=1.0
    FROM ubuntu:${VERSION}
    ```

15. **ONBUILD**：触发器
    ```dockerfile
    ONBUILD ADD . /app/src
    ONBUILD RUN cd /app/src && make
    ```

### 5.2 Dockerfile示例
```dockerfile
# 基础镜像
FROM node:18-alpine

# 作者信息
LABEL maintainer="admin@example.com"

# 工作目录
WORKDIR /app

# 复制package.json
COPY package*.json ./

# 安装依赖
RUN npm install --production

# 复制应用代码
COPY . .

# 暴露端口
EXPOSE 3000

# 启动命令
CMD ["node", "server.js"]
```

### 5.3 构建镜像
```bash
# 基本构建
docker build -t myapp:v1.0 .

# 指定Dockerfile
docker build -f Dockerfile.prod -t myapp:v1.0 .

# 构建参数
docker build --build-arg VERSION=1.0 -t myapp:v1.0 .

# 不使用缓存
docker build --no-cache -t myapp:v1.0 .
```

### 5.4 镜像优化
1. **使用多阶段构建**
   ```dockerfile
   # 构建阶段
   FROM golang:1.20 AS builder
   WORKDIR /app
   COPY . .
   RUN go build -o myapp .

   # 生产阶段
   FROM alpine:3.18
   WORKDIR /app
   COPY --from=builder /app/myapp .
   CMD ["./myapp"]
   ```

2. **使用轻量级基础镜像**
   - alpine
   - slim
   - distroless

3. **合并RUN命令**
   ```dockerfile
   RUN apt update && apt install -y nginx && rm -rf /var/lib/apt/lists/*
   ```

4. **合理使用缓存**
   - 将变化少的指令放在前面
   - 将变化多的指令放在后面

## 六、Docker仓库
### 6.1 Docker Hub
```bash
# 登录
docker login

# 推送到Docker Hub
docker tag myapp:v1.0 username/myapp:v1.0
docker push username/myapp:v1.0

# 从Docker Hub拉取
docker pull username/myapp:v1.0

# 登出
docker logout
```

### 6.2 私有仓库
```bash
# 运行Registry容器
docker run -d -p 5000:5000 --name registry registry:2

# 推送镜像
docker tag myapp:v1.0 localhost:5000/myapp:v1.0
docker push localhost:5000/myapp:v1.0

# 拉取镜像
docker pull localhost:5000/myapp:v1.0
```

## 七、Docker网络
### 7.1 网络模式
1. **bridge**：默认，桥接网络
   ```bash
   docker run -d --name mynginx nginx
   ```

2. **host**：使用宿主机网络
   ```bash
   docker run -d --network host --name mynginx nginx
   ```

3. **none**：无网络
   ```bash
   docker run -d --network none --name mynginx nginx
   ```

4. **container**：共享容器网络
   ```bash
   docker run -d --network container:othercontainer --name mynginx nginx
   ```

### 7.2 网络管理
```bash
# 查看网络
docker network ls

# 创建网络
docker network create mynetwork
docker network create --driver bridge mynetwork

# 查看网络详情
docker network inspect mynetwork

# 连接容器到网络
docker network connect mynetwork mycontainer

# 断开容器网络
docker network disconnect mynetwork mycontainer

# 删除网络
docker network rm mynetwork
docker network prune
```

## 八、Docker数据卷
### 8.1 数据卷类型
1. **命名卷**
   ```bash
   docker run -d -v mydata:/data nginx
   ```

2. **匿名卷**
   ```bash
   docker run -d -v /data nginx
   ```

3. **绑定挂载**
   ```bash
   docker run -d -v /host/path:/container/path nginx
   ```

### 8.2 数据卷管理
```bash
# 查看卷
docker volume ls

# 创建卷
docker volume create mydata

# 查看卷详情
docker volume inspect mydata

# 删除卷
docker volume rm mydata
docker volume prune
```

## 九、Docker Compose
### 9.1 Docker Compose概述
- **作用**：定义和运行多容器Docker应用
- **配置文件**：docker-compose.yml

### 9.2 docker-compose.yml示例
```yaml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "80:80"
    volumes:
      - ./html:/usr/share/nginx/html
    depends_on:
      - db
    networks:
      - mynetwork

  db:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: 123456
      MYSQL_DATABASE: mydb
    volumes:
      - db_data:/var/lib/mysql
    networks:
      - mynetwork

volumes:
  db_data:

networks:
  mynetwork:
```

### 9.3 Docker Compose命令
```bash
# 启动服务
docker-compose up
docker-compose up -d

# 停止服务
docker-compose stop

# 启动已停止的服务
docker-compose start

# 重启服务
docker-compose restart

# 停止并删除容器
docker-compose down
docker-compose down -v  # 同时删除卷

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs
docker-compose logs -f

# 执行命令
docker-compose exec web /bin/bash

# 构建镜像
docker-compose build
```

## 十、总结
Docker是现代应用开发和部署的重要工具。本章介绍了Docker的核心概念、安装方法、镜像管理、容器管理、Dockerfile、网络、数据卷和Docker Compose等内容。掌握Docker可以实现应用的快速部署、环境一致性和高效的资源利用，对于DevOps实践和微服务架构都非常重要。