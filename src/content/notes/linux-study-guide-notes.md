---
title: "Linux系统学习指导（详细版）"
date: "2025-06"
type: "learning"
tags: [Linux, Shell, 文件系统, 进程管理, Nginx, 学习指导]
summary: "Linux系统全课程详细学习指导，覆盖文件系统、进程、Shell、网络、Nginx、Docker等内容"
---

# Linux操作系统学习指导

## 一、课程资料分析

### 资料结构
- **资料类型**：PDF课件（CH01-CH10）
- **内容覆盖**：开源操作系统概述、文件系统、用户进程网络、Shell编程、系统安全、日志任务、服务器配置等

### 详细知识点

#### CH01 开源操作系统概述
- Linux发展历史
  - Unix的起源和发展
  - Linux内核的诞生（Linus Torvalds）
  - 主要Linux发行版的发展历程
- 开源软件概念
  - 开源软件的定义
  - 开源许可证（GPL、BSD、Apache等）
  - 开源社区的运作模式
- Linux发行版
  - 商业发行版（Red Hat、SUSE）
  - 社区发行版（Ubuntu、Debian、CentOS）
  - 发行版的选择原则
- Linux系统架构
  - 内核空间与用户空间
  - Linux内核的组成（进程管理、内存管理、文件系统、设备驱动）
  - Linux系统调用
- Linux的特点和优势
  - 开源免费
  - 稳定可靠
  - 安全性能好
  - 多用户多任务
  - 良好的可移植性

#### CH02 文件与文件系统
- 文件类型详解
  - 普通文件（-）
    - 文本文件：ASCII、UTF-8等编码的可读文件
    - 二进制文件：可执行程序、库文件、图片等
  - 目录文件（d）
    - 存储文件名和inode编号的映射关系
    - 本质是特殊的文件，包含目录项
  - 符号链接（l）
    - 软链接，保存目标文件的路径字符串
    - ln -s source target 创建软链接
    - 可以跨文件系统，可以链接目录
    - ls -l显示链接指向
  - 硬链接
    - 多个文件名指向同一个inode
    - ln source target 创建硬链接
    - 不能跨文件系统，不能链接目录
    - 删除一个文件名不影响其他链接
  - 设备文件（c字符设备、b块设备）
    - 字符设备（c）：按字符流读写，如键盘、鼠标、终端
    - 块设备（b）：按块读写，支持随机访问，如硬盘、U盘
    - 主设备号：标识设备类型
    - 次设备号：标识具体设备
  - 管道文件（p）
    - 无名管道：半双工，父子进程间通信
    - 命名管道（FIFO）：mkfifo创建，任意进程间通信
  - 套接字文件（s）
    - 用于网络通信和进程间通信
    - Unix域套接字：本地进程间通信
- 目录结构深度解析
  - FHS（Filesystem Hierarchy Standard）标准
    - FHS 2.3和3.0版本
    - 目的：确保不同Linux发行版的目录结构一致性
  - 根目录（/）下的主要目录
    - /bin：用户二进制文件
      - 所有用户都可使用的基础命令
      - 如ls、cp、mv、cat等
      - 单用户模式也能使用
    - /sbin：系统二进制文件
      - 系统管理员使用的管理命令
      - 如fdisk、mkfs、ifconfig、reboot等
    - /etc：配置文件
      - 系统级配置文件
      - /etc/passwd：用户账户信息
      - /etc/shadow：用户密码（加密）
      - /etc/group：组信息
      - /etc/hosts：主机名解析
      - /etc/fstab：文件系统挂载表
      - /etc/sysconfig/：系统配置目录
    - /home：用户主目录
      - 每个用户有独立的子目录
      - 如/home/user1、/home/user2
      - 存储用户个人文件和配置
    - /root：root用户主目录
      - 超级用户的主目录
      - 不在/home下，确保单用户模式可访问
    - /usr：用户程序
      - Unix System Resources的缩写
      - /usr/bin：用户命令（更多）
      - /usr/sbin：系统管理命令（更多）
      - /usr/lib：库文件
      - /usr/include：头文件
      - /usr/local：本地安装的软件
      - /usr/share：共享数据（文档、图标等）
    - /var：可变数据
      - 经常变化的文件
      - /var/log：日志文件
      - /var/spool：队列数据（邮件、打印任务）
      - /var/lib：状态数据（数据库、包管理器）
      - /var/cache：缓存数据
      - /var/run：运行时数据（PID文件）
    - /tmp：临时文件
      - 所有用户可读写
      - 重启后可能被清空
      - /var/tmp：更持久的临时文件
    - /dev：设备文件
      - 内核创建的设备接口
      - /dev/null：空设备（丢弃数据）
      - /dev/zero：零设备（产生零字节）
      - /dev/random：随机数生成器
      - /dev/urandom：非阻塞随机数生成器
      - /dev/tty：当前终端
      - /dev/pts：伪终端
    - /proc：进程信息
      - 虚拟文件系统，内存中的数据
      - /proc/[pid]/：进程目录
        - /proc/[pid]/status：进程状态
        - /proc/[pid]/maps：内存映射
        - /proc/[pid]/fd：文件描述符
      - /proc/cpuinfo：CPU信息
      - /proc/meminfo：内存信息
      - /proc/filesystems：支持的文件系统
      - /proc/version：内核版本
      - /proc/sys/：可配置的内核参数
    - /sys：系统信息
      - 虚拟文件系统，2.6内核引入
      - 比/proc更结构化
      - /sys/devices：设备信息
      - /sys/class：设备分类
      - /sys/block：块设备
      - /sys/bus：总线信息
- 文件权限深度解析
  - 文件权限的表示（rwx）
    - r（read）：读权限，值为4
    - w（write）：写权限，值为2
    - x（execute）：执行权限，值为1
    - 三个组：所有者（user）、所属组（group）、其他用户（other）
    - 示例：-rwxr-xr-- 表示：
      - 所有者：rwx（可读可写可执行）
      - 所属组：r-x（可读可执行）
      - 其他用户：r--（只读）
  - 权限的数字表示法（421）
    - 每个组的权限相加
    - 示例：rwxr-xr-- = 754
      - 所有者：4+2+1=7
      - 所属组：4+0+1=5
      - 其他用户：4+0+0=4
  - chmod命令的使用
    - 符号方式：u（所有者）、g（组）、o（其他）、a（所有）
      - chmod u+x file：给所有者添加执行权限
      - chmod g-w file：去掉组的写权限
      - chmod o=r file：其他用户设为只读
      - chmod a=rwx file：所有用户设为rwx
    - 数字方式：chmod 755 file
    - 递归修改：chmod -R 755 dir
  - 文件所有者和所属组
    - 所有者：创建文件的用户
    - 所属组：文件关联的用户组
  - chown和chgrp命令
    - chown user file：修改所有者
    - chown user:group file：同时修改所有者和组
    - chown -R user:group dir：递归修改
    - chgrp group file：修改所属组
  - 特殊权限详解
    - SUID（Set User ID）
      - 作用：执行文件时以文件所有者的身份运行
      - 标识：所有者的x位变为s
      - 数字表示：4开头（如4755）
      - 示例：passwd命令（需要修改/etc/shadow）
      - 安全风险：滥用可能导致权限提升
    - SGID（Set Group ID）
      - 对文件：执行时以文件所属组的身份运行
      - 对目录：新创建的文件继承目录的组
      - 标识：组的x位变为s
      - 数字表示：2开头（如2755）
    - Sticky Bit（粘滞位）
      - 对目录：只有文件所有者、目录所有者、root可以删除文件
      - 标识：其他用户的x位变为t
      - 数字表示：1开头（如1777）
      - 示例：/tmp目录
  - umask的作用
    - 定义：用户创建文件时的默认权限掩码
    - 原理：从默认权限中减去umask
    - 文件默认权限：666（rw-rw-rw-）
    - 目录默认权限：777（rwxrwxrwx）
    - umask 022：文件644，目录755
    - umask 027：文件640，目录750
    - 查看umask：umask
    - 设置umask：umask 022
    - 永久设置：~/.bashrc或/etc/profile
- 文件操作命令
  - ls（列出文件和目录）
    - 常用选项：-l、-a、-h、-t、-r
  - cp（复制文件和目录）
    - 常用选项：-r、-p、-i
  - mv（移动或重命名文件）
  - rm（删除文件和目录）
    - 常用选项：-r、-f、-i
  - mkdir（创建目录）
    - 常用选项：-p
  - rmdir（删除空目录）
  - touch（创建空文件或修改时间戳）
  - cat（连接文件并打印）
  - more和less（分页显示文件内容）
  - head和tail（查看文件开头和结尾）
  - wc（统计文件行数、单词数、字符数）
  - grep（在文件中搜索字符串）
  - find（搜索文件）
  - locate（快速搜索文件）
- 文件系统类型
  - ext2、ext3、ext4
  - XFS
  - Btrfs
  - ReiserFS
  - vfat（FAT32）
  - ntfs
- 文件系统挂载和卸载
  - mount命令
  - umount命令
  - /etc/fstab文件
  - 自动挂载

#### CH03 用户、进程和网络
- 用户和组管理
  - 用户账户的概念
  - /etc/passwd文件
  - /etc/shadow文件
  - useradd命令（创建用户）
  - usermod命令（修改用户）
  - userdel命令（删除用户）
  - passwd命令（修改密码）
  - 组的概念
  - /etc/group文件
  - /etc/gshadow文件
  - groupadd命令（创建组）
  - groupmod命令（修改组）
  - groupdel命令（删除组）
  - gpasswd命令（管理组成员）
- 进程管理
  - 进程的概念
  - 进程的生命周期
  - 进程的状态
  - ps命令（查看进程）
    - 常用选项：aux、-ef
  - top命令（实时查看进程）
  - pstree命令（查看进程树）
  - kill命令（终止进程）
  - killall命令（按名称终止进程）
  - pkill命令（按模式终止进程）
  - nice和renice（调整进程优先级）
  - nohup和&（后台运行进程）
- 网络配置
  - 网络接口的概念
  - ifconfig命令（旧版网络配置工具）
  - ip命令（新版网络配置工具）
    - ip addr show（查看IP地址）
    - ip link set（启用/禁用接口）
  - netstat命令（查看网络连接）
  - ss命令（查看套接字统计）
  - ping命令（测试网络连通性）
  - traceroute/tracepath（追踪路由）
  - host/nslookup/dig（DNS查询）
  - /etc/hosts文件
  - /etc/resolv.conf文件
  - /etc/network/interfaces或NetworkManager配置
- 服务管理
  - System V init脚本
  - systemd服务管理
    - systemctl命令
    - 启动、停止、重启、重载服务
    - 启用/禁用服务自启动
    - 查看服务状态
  - 服务的运行级别

#### CH04 Shell脚本编程深度解析
- Shell脚本基础
  - 脚本文件的创建和执行
    - 创建：使用文本编辑器（vim、nano等）
    - 第一行：#!/bin/bash（Shebang）
    - 执行权限：chmod +x script.sh
    - 执行方式：./script.sh 或 bash script.sh
  - 注释
    - 单行注释：# 注释内容
    - 多行注释：: ' 注释内容 '
- Shell变量详解
  - 变量的定义和使用
    - 定义：variable=value（注意等号两边不能有空格）
    - 使用：$variable 或 ${variable}
    - 示例：name="Zhang San"; echo "Hello, $name"
  - 变量命名规则
    - 只能包含字母、数字、下划线
    - 不能以数字开头
    - 区分大小写
  - 环境变量
    - 系统级环境变量：/etc/profile、/etc/bashrc
    - 用户级环境变量：~/.bash_profile、~/.bashrc
    - 常用环境变量详解：
      - PATH：命令搜索路径，用冒号分隔
      - HOME：用户主目录
      - USER：当前用户名
      - SHELL：当前Shell类型
      - PWD：当前工作目录
      - OLDPWD：上一个工作目录
      - HISTSIZE：历史命令记录条数
      - HISTFILE：历史命令保存文件
    - export命令：将变量导出为环境变量
      - export variable=value
      - 子进程可以访问export的变量
  - 局部变量
    - 函数内使用local关键字定义
    - 只在函数内部有效
    - 示例：local var="local variable"
  - 位置参数详解
    - $0：脚本名称
    - $1：第一个参数
    - $2：第二个参数
    - ...
    - $9：第九个参数
    - ${10}：第十个及以上参数（需要花括号）
    - 示例：./script.sh arg1 arg2 → $0=./script.sh, $1=arg1, $2=arg2
  - 特殊变量详解
    - $#：参数个数（不包括$0）
    - $*：所有参数作为一个字符串
    - $@：所有参数作为独立的字符串（推荐使用）
    - $?：上一个命令的退出状态（0表示成功，非0表示失败）
    - $$：当前Shell的进程ID（PID）
    - $!：后台运行的最后一个进程的PID
    - $_：上一个命令的最后一个参数
  - 变量的替换和扩展
    - ${var:-default}：var未定义或为空，使用default
    - ${var:=default}：var未定义或为空，使用default并赋值给var
    - ${var:?message}：var未定义或为空，输出message并退出
    - ${var:+alt}：var已定义且非空，使用alt，否则为空
    - ${#var}：var的长度
    - ${var:offset}：从offset开始截取
    - ${var:offset:length}：从offset开始截取length个字符
    - ${var#pattern}：从开头删除最短匹配
    - ${var##pattern}：从开头删除最长匹配
    - ${var%pattern}：从结尾删除最短匹配
    - ${var%%pattern}：从结尾删除最长匹配
    - ${var/pattern/replacement}：替换第一个匹配
    - ${var//pattern/replacement}：替换所有匹配
- 控制结构深度解析
  - 条件语句详解
    - if-else语句
      - 基本语法：
        ```bash
        if [ condition ]; then
          commands
        fi
        ```
      - 带else的语法：
        ```bash
        if [ condition ]; then
          commands1
        else
          commands2
        fi
        ```
    - if-elif-else语句
      - 语法：
        ```bash
        if [ condition1 ]; then
          commands1
        elif [ condition2 ]; then
          commands2
        else
          commands3
        fi
        ```
    - test命令和[ ]表达式
      - test命令和[ ]是等价的
      - test condition 或 [ condition ]
      - 注意：[ ]内部两边必须有空格
    - [[ ]]扩展测试表达式
      - Bash的扩展特性
      - 支持模式匹配和正则表达式
      - 不需要对变量加引号
      - 支持&&和||逻辑运算
    - 数值比较操作详解
      - -eq：等于（equal）
      - -ne：不等于（not equal）
      - -lt：小于（less than）
      - -le：小于等于（less than or equal）
      - -gt：大于（greater than）
      - -ge：大于等于（greater than or equal）
      - 示例：if [ $a -eq $b ]; then echo "equal"; fi
    - 字符串比较详解
      - = 或 ==：相等（==在[[ ]]中支持模式匹配）
      - !=：不相等
      - <：小于（字典序）
      - >：大于（字典序）
      - -z：字符串为空（zero length）
      - -n：字符串非空（non-zero length）
      - 示例：if [ -z "$str" ]; then echo "empty"; fi
    - 文件测试详解
      - -e：文件存在（exist）
      - -f：文件存在且是普通文件（file）
      - -d：文件存在且是目录（directory）
      - -r：文件存在且可读（readable）
      - -w：文件存在且可写（writable）
      - -x：文件存在且可执行（executable）
      - -s：文件存在且非空（size > 0）
      - -L：文件存在且是符号链接（link）
      - -b：文件存在且是块设备（block）
      - -c：文件存在且是字符设备（character）
      - -p：文件存在且是管道（pipe）
      - -S：文件存在且是套接字（socket）
      - -nt：文件1比文件2新（newer than）
      - -ot：文件1比文件2旧（older than）
      - -ef：文件1和文件2是同一个文件（same inode）
  - 循环语句详解
    - for循环
      - 传统for循环（遍历列表）：
        ```bash
        for var in list; do
          commands
        done
        ```
      - 示例：for i in 1 2 3 4 5; do echo $i; done
      - 示例：for file in *.txt; do echo $file; done
      - C风格for循环：
        ```bash
        for ((i=0; i<10; i++)); do
          commands
        done
        ```
    - while循环
      - 语法：
        ```bash
        while [ condition ]; do
          commands
        done
        ```
      - 示例：while [ $i -lt 10 ]; do ((i++)); done
      - 无限循环：while true; do commands; done
    - until循环
      - 语法：
        ```bash
        until [ condition ]; do
          commands
        done
        ```
      - 条件为假时执行，条件为真时退出
    - break和continue
      - break：跳出循环
      - break n：跳出n层循环
      - continue：跳过本次循环，继续下一次
      - continue n：跳过n层循环
  - case语句详解
    - 语法：
      ```bash
      case $variable in
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
    - 模式匹配：
      - *：匹配任意字符
      - ?：匹配单个字符
      - []：匹配指定范围内的字符
      - |：或操作
    - 示例：
      ```bash
      case $action in
        start|restart)
          echo "Starting service"
          ;;
        stop)
          echo "Stopping service"
          ;;
        *)
          echo "Unknown action"
          ;;
      esac
      ```
- 函数
  - 函数的定义
  - 函数的调用
  - 函数参数
  - 函数返回值
  - 局部变量
- 正则表达式
  - 基本正则表达式（BRE）
  - 扩展正则表达式（ERE）
  - 常用元字符（.、*、+、?、^、$、[]、{}、()）
  - grep和正则表达式
  - sed流编辑器
  - awk文本处理语言
- 脚本调试
  - set -x（显示执行的命令）
  - set -e（遇到错误退出）
  - set -u（未定义变量报错）
  - bash -n（语法检查）
  - bashdb调试器
- 常见脚本示例
  - 备份脚本（自动备份指定目录）：
    ```bash
    #!/bin/bash
    BACKUP_SRC="/data/www"
    BACKUP_DEST="/backup"
    DATE=$(date +%Y%m%d_%H%M%S)
    BACKUP_FILENAME="backup_${DATE}.tar.gz"
    
    echo "开始备份: ${BACKUP_SRC}"
    
    if [ ! -d "${BACKUP_DEST}" ]; then
        mkdir -p "${BACKUP_DEST}"
    fi
    
    tar -czf "${BACKUP_DEST}/${BACKUP_FILENAME}" -C $(dirname ${BACKUP_SRC}) $(basename ${BACKUP_SRC})
    
    if [ $? -eq 0 ]; then
        echo "备份成功: ${BACKUP_FILENAME}"
        find "${BACKUP_DEST}" -name "backup_*.tar.gz" -mtime +7 -delete
        echo "已删除7天前的备份"
    else
        echo "备份失败!"
        exit 1
    fi
    ```
  - 系统监控脚本（CPU、内存、磁盘）：
    ```bash
    #!/bin/bash
    LOG_FILE="/var/log/system_monitor.log"
    DATE=$(date '+%Y-%m-%d %H:%M:%S')
    
    CPU_USAGE=$(top -bn1 | grep "Cpu(s)" | sed "s/.*, *\([0-9.]*\)%* id.*/\1/" | awk '{print 100 - $1}')
    MEM_TOTAL=$(free -m | awk '/Mem:/ {print $2}')
    MEM_USED=$(free -m | awk '/Mem:/ {print $3}')
    MEM_USAGE=$(awk "BEGIN {printf \"%.2f\", ($MEM_USED/$MEM_TOTAL)*100}")
    DISK_USAGE=$(df -h / | awk '/\// {print $5}' | sed 's/%//')
    
    echo "========== ${DATE} ==========" >> "${LOG_FILE}"
    echo "CPU使用率: ${CPU_USAGE}%" >> "${LOG_FILE}"
    echo "内存使用率: ${MEM_USAGE}%" >> "${LOG_FILE}"
    echo "磁盘使用率: ${DISK_USAGE}%" >> "${LOG_FILE}"
    
    if (( $(echo "${CPU_USAGE} > 80" | bc -l) )); then
        echo "警告: CPU使用率过高!" >> "${LOG_FILE}"
    fi
    
    if (( $(echo "${MEM_USAGE} > 80" | bc -l) )); then
        echo "警告: 内存使用率过高!" >> "${LOG_FILE}"
    fi
    
    if [ ${DISK_USAGE} -gt 80 ]; then
        echo "警告: 磁盘使用率过高!" >> "${LOG_FILE}"
    fi
    
    echo "" >> "${LOG_FILE}"
    ```
  - 网站可用性检测脚本：
    ```bash
    #!/bin/bash
    WEBSITES=("https://www.example.com" "https://www.test.com")
    LOG_FILE="/var/log/website_check.log"
    DATE=$(date '+%Y-%m-%d %H:%M:%S')
    
    for WEBSITE in "${WEBSITES[@]}"; do
        HTTP_CODE=$(curl -o /dev/null -s -w "%{http_code}\n" --connect-timeout 10 "${WEBSITE}")
        
        if [ "${HTTP_CODE}" == "200" ]; then
            echo "[${DATE}] ${WEBSITE} - 正常 (HTTP ${HTTP_CODE})" >> "${LOG_FILE}"
        else
            echo "[${DATE}] ${WEBSITE} - 异常 (HTTP ${HTTP_CODE})" >> "${LOG_FILE}"
            echo "发送告警邮件..."
        fi
    done
    ```
  - 自动化部署脚本：
    ```bash
    #!/bin/bash
    APP_NAME="myapp"
    GIT_REPO="https://github.com/user/myapp.git"
    APP_DIR="/opt/${APP_NAME}"
    BACKUP_DIR="/opt/backup/${APP_NAME}"
    DATE=$(date +%Y%m%d_%H%M%S)
    
    echo "开始部署 ${APP_NAME}..."
    
    cd /tmp || exit 1
    git clone "${GIT_REPO}" "${APP_NAME}_${DATE}" || { echo "Git克隆失败"; exit 1; }
    
    if [ -d "${APP_DIR}" ]; then
        echo "备份当前版本..."
        mkdir -p "${BACKUP_DIR}"
        mv "${APP_DIR}" "${BACKUP_DIR}/${APP_NAME}_${DATE}"
    fi
    
    mv "/tmp/${APP_NAME}_${DATE}" "${APP_DIR}"
    cd "${APP_DIR}" || exit 1
    
    echo "安装依赖..."
    pip install -r requirements.txt
    
    echo "重启服务..."
    systemctl restart "${APP_NAME}"
    
    if [ $? -eq 0 ]; then
        echo "部署成功!"
        find "${BACKUP_DIR}" -name "${APP_NAME}_*" -mtime +30 -delete
    else
        echo "部署失败，回滚..."
        rm -rf "${APP_DIR}"
        mv "${BACKUP_DIR}/${APP_NAME}_${DATE}" "${APP_DIR}"
        systemctl restart "${APP_NAME}"
        echo "回滚完成"
    fi
    ```
  - 日志分析脚本（统计Nginx访问日志）：
    ```bash
    #!/bin/bash
    LOG_FILE="/var/log/nginx/access.log"
    REPORT_FILE="/tmp/nginx_report_$(date +%Y%m%d).txt"
    
    echo "========== Nginx访问日志分析报告 ==========" > "${REPORT_FILE}"
    echo "生成时间: $(date)" >> "${REPORT_FILE}"
    echo "" >> "${REPORT_FILE}"
    
    echo "1. 访问量TOP 10 IP:" >> "${REPORT_FILE}"
    awk '{print $1}' "${LOG_FILE}" | sort | uniq -c | sort -rn | head -10 >> "${REPORT_FILE}"
    echo "" >> "${REPORT_FILE}"
    
    echo "2. 访问量TOP 10 URL:" >> "${REPORT_FILE}"
    awk '{print $7}' "${LOG_FILE}" | sort | uniq -c | sort -rn | head -10 >> "${REPORT_FILE}"
    echo "" >> "${REPORT_FILE}"
    
    echo "3. HTTP状态码统计:" >> "${REPORT_FILE}"
    awk '{print $9}' "${LOG_FILE}" | sort | uniq -c | sort -rn >> "${REPORT_FILE}"
    echo "" >> "${REPORT_FILE}"
    
    echo "4. 总访问次数: $(wc -l < "${LOG_FILE}")" >> "${REPORT_FILE}"
    
    echo "报告已生成: ${REPORT_FILE}"
    ```
  - 文件批量处理脚本（批量重命名）：
    ```bash
    #!/bin/bash
    DIR="/data/images"
    PREFIX="photo_"
    COUNT=1
    
    cd "${DIR}" || exit 1
    
    echo "开始批量重命名..."
    
    for FILE in *.jpg; do
        if [ -f "${FILE}" ]; then
            NEW_NAME=$(printf "${PREFIX}%04d.jpg" ${COUNT})
            mv "${FILE}" "${NEW_NAME}"
            echo "重命名: ${FILE} -> ${NEW_NAME}"
            ((COUNT++))
        fi
    done
    
    echo "完成! 共处理 $((COUNT-1)) 个文件"
    ```
  - 用户批量创建脚本：
    ```bash
    #!/bin/bash
    USERS=("user1" "user2" "user3" "user4" "user5")
    DEFAULT_PASSWORD="P@ssw0rd123"
    GROUP="developers"
    
    if ! getent group "${GROUP}" > /dev/null; then
        groupadd "${GROUP}"
        echo "创建组: ${GROUP}"
    fi
    
    for USER in "${USERS[@]}"; do
        if id "${USER}" &>/dev/null; then
            echo "用户 ${USER} 已存在，跳过"
            continue
        fi
        
        useradd -m -G "${GROUP}" -s /bin/bash "${USER}"
        echo "${USER}:${DEFAULT_PASSWORD}" | chpasswd
        chage -d 0 "${USER}"
        echo "创建用户: ${USER}"
    done
    
    echo "用户创建完成"
    ```

#### CH05 系统安全与防火墙
- 用户权限管理
  - sudo配置（/etc/sudoers）
  - visudo命令
  - su命令（切换用户）
- 防火墙配置
  - iptables防火墙
    - iptables的概念（表、链、规则
      - 表（Tables）：
        - filter：默认表，用于过滤数据包
        - nat：网络地址转换
        - mangle：修改数据包特性
        - raw：处理数据包标记
        - security：安全策略
      - 链（Chains）：
        - filter表的链：INPUT（入站）、OUTPUT（出站）、FORWARD（转发）
        - nat表的链：PREROUTING、POSTROUTING、OUTPUT
      - 规则（Rules）：匹配条件 + 动作
        - 动作：ACCEPT（接受）、DROP（丢弃）、REJECT（拒绝）、LOG（记录）、SNAT/DNAT（地址转换）
    - iptables命令的基本语法
      ```bash
      iptables [-t 表名] 命令 链名 [匹配条件] -j 动作
      ```
    - 常用命令：
      - -A：追加规则到链末尾
      - -I：插入规则到链开头或指定位置
      - -D：删除规则
      - -R：替换规则
      - -L：列出规则
      - -F：清空规则
      - -P：设置默认策略
      - -S：以规则
    - 常用匹配条件：
      - -p：协议（tcp、udp、icmp、all
      - -s：源IP地址
      - -d：目标IP地址
      - --sport：源端口
      - --dport：目标端口
      - -i：入站网卡
      - -o：出站网卡
      - --state：连接状态（NEW、ESTABLISHED、RELATED、INVALID）
    - 添加、删除、修改规则
      - 查看规则：
        ```bash
        iptables -L -n -v --line-numbers
        iptables -t nat -L -n -v
        ```
      - 设置默认策略：
        ```bash
        iptables -P INPUT DROP
        iptables -P OUTPUT ACCEPT
        iptables -P FORWARD DROP
        ```
    - 常用规则示例
      - 允许本地回环：
        ```bash
        iptables -A INPUT -i lo -j ACCEPT
        iptables -A OUTPUT -o lo -j ACCEPT
        ```
      - 允许已建立的连接：
        ```bash
        iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT
        ```
      - 允许SSH（22端口）：
        ```bash
        iptables -A INPUT -p tcp --dport 22 -j ACCEPT
        iptables -A INPUT -p tcp -s 192.168.1.0/24 --dport 22 -j ACCEPT
        ```
      - 允许HTTP（80）和HTTPS（443）：
        ```bash
        iptables -A INPUT -p tcp --dport 80 -j ACCEPT
        iptables -A INPUT -p tcp --dport 443 -j ACCEPT
        ```
      - 允许Ping：
        ```bash
        iptables -A INPUT -p icmp --icmp-type echo-request -j ACCEPT
        ```
      - 端口转发（DNAT）：
        ```bash
        iptables -t nat -A PREROUTING -p tcp -d 公网IP --dport 8080 -j DNAT --to-destination 192.168.1.100:80
        ```
      - 源地址转换（SNAT）：
        ```bash
        iptables -t nat -A POSTROUTING -s 192.168.1.0/24 -o eth0 -j SNAT --to-source 公网IP
        ```
      - 阻止特定IP：
        ```bash
        iptables -A INPUT -s 10.0.0.1 -j DROP
        ```
      - 限制连接数限制：
        ```bash
        iptables -A INPUT -p tcp --dport 80 -m connlimit --connlimit-above 100 -j DROP
        ```
    - 规则的保存和恢复
      - 保存规则（CentOS/RHEL）：
        ```bash
        service iptables save
        ```
      - 保存规则（Ubuntu/Debian）：
        ```bash
        iptables-save > /etc/iptables/rules.v4
        ```
      - 恢复规则：
        ```bash
        iptables-restore < /etc/iptables/rules.v4
        ```
    - 完整的防火墙配置脚本示例：
      ```bash
      #!/bin/bash
      echo "开始配置iptables防火墙..."
      
      iptables -F
      iptables -X
      iptables -t nat -F
      iptables -t nat -X
      iptables -t mangle -F
      iptables -t mangle -X
      
      iptables -P INPUT DROP
      iptables -P OUTPUT ACCEPT
      iptables -P FORWARD DROP
      
      iptables -A INPUT -i lo -j ACCEPT
      iptables -A OUTPUT -o lo -j ACCEPT
      
      iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT
      
      iptables -A INPUT -p tcp --dport 22 -j ACCEPT
      iptables -A INPUT -p tcp --dport 80 -j ACCEPT
      iptables -A INPUT -p tcp --dport 443 -j ACCEPT
      
      iptables -A INPUT -p icmp --icmp-type echo-request -j ACCEPT
      
      iptables -A INPUT -s 127.0.0.1 -j ACCEPT
      
      echo "iptables防火墙配置完成"
      iptables -L -n -v
      ```
  - firewalld防火墙
    - firewalld的概念（区域、服务）
    - firewall-cmd命令
    - 永久配置和运行时配置
    - 常用区域：public、trusted、home等
    - 添加/删除服务和端口
- SSH安全配置
  - SSH服务的配置文件（/etc/ssh/sshd_config）
  - 禁止root远程登录
  - 修改SSH端口
  - 禁用密码认证，启用密钥认证
  - 配置登录超时
  - 限制用户登录
  - SSH密钥的生成和使用
  - ssh-copy-id命令
- SELinux安全机制
  - SELinux的概念
  - SELinux的模式（enforcing、permissive、disabled）
  - 查看和设置SELinux模式
  - SELinux上下文
  - 常用SELinux命令（getenforce、setenforce、sestatus、restorecon）
- 系统日志安全审计
  - 日志的重要性
  - 常用日志文件位置（/var/log/）
  - 日志的查看和分析
  - logrotate日志轮转

#### CH06 引导、日志和计划任务
- GRUB引导配置
  - GRUB的概念和作用
  - GRUB2的配置文件（/boot/grub2/grub.cfg或/boot/grub/grub.cfg）
  - /etc/default/grub配置文件
  - grub-mkconfig命令
  - 启动菜单项的修改
  - 密码保护GRUB
  - 救援模式和单用户模式
- 系统日志管理
  - syslog系统
  - rsyslog服务
  - 日志配置文件（/etc/rsyslog.conf）
  - 日志设施（facility）和级别（priority）
  - journald日志系统（systemd）
  - journalctl命令
  - 常用日志文件
    - /var/log/messages：系统消息
    - /var/log/auth.log或/var/log/secure：认证日志
    - /var/log/kern.log：内核日志
    - /var/log/cron：计划任务日志
    - /var/log/maillog：邮件日志
- crontab计划任务
  - cron的概念
  - crontab文件的格式
    - 分 时 日 月 周 命令
    - 特殊字符：*、,、-、/
  - crontab命令
    - crontab -e：编辑
    - crontab -l：列出
    - crontab -r：删除
  - 系统级计划任务（/etc/crontab、/etc/cron.d/）
  - anacron
  - at命令（一次性计划任务）
- 系统启动流程
  - BIOS/UEFI
  - MBR/GPT
  - 引导加载器（GRUB）
  - 内核加载
  - initramfs
  - init进程（systemd或init）
  - 运行级别/目标
  - 服务启动
- 服务自启动配置
  - System V init（chkconfig命令）
  - systemd（systemctl enable/disable）

#### CH07 文件服务器
- NFS服务配置
  - NFS的概念和特点
  - NFS服务器端配置
    - 安装NFS软件包
    - 配置文件（/etc/exports）
    - 配置选项（rw、ro、sync、async、no_root_squash）
    - exportfs命令
  - NFS客户端配置
    - 挂载NFS共享
    - showmount命令
    - 自动挂载（/etc/fstab）
- Samba服务配置
  - Samba的概念和作用
  - Samba服务器端配置
    - 安装Samba软件包
    - 配置文件（/etc/samba/smb.conf）
    - [global]全局配置
    - 共享配置（[share]）
    - Samba用户管理（smbpasswd）
    - 测试配置（testparm）
  - Samba客户端配置
    - smbclient命令
    - 挂载Samba共享（mount.cifs）
- 文件共享权限管理
  - Linux文件权限
  - NFS权限配置
  - Samba权限配置
  - ACL访问控制列表（getfacl、setfacl）
- 服务启动和管理
  - 启动、停止、重启NFS和Samba服务
  - 配置服务自启动
  - 查看服务状态

#### CH08 Web服务器概述和Nginx入门
- Web服务器原理
  - HTTP协议基础
    - 请求方法（GET、POST、PUT、DELETE等）
    - 状态码（200、301、302、404、500等）
    - 请求头和响应头
  - Web服务器的工作原理
  - 静态内容和动态内容
  - CGI、FastCGI、PHP-FPM
- Nginx安装配置
  - Nginx的特点和优势
  - 安装Nginx（源码编译、包管理器）
  - Nginx配置文件结构（/etc/nginx/）
    - nginx.conf主配置文件
    - conf.d目录
    - sites-available和sites-enabled
  - 配置文件语法
    - 指令和块
    - 注释
  - 测试配置文件（nginx -t）
  - 重载和重启Nginx
- 虚拟主机配置
  - 基于域名的虚拟主机
  - 基于IP的虚拟主机
  - 基于端口的虚拟主机
  - server_name指令
  - root指令
  - index指令
- 反向代理设置
  - proxy_pass指令
  - proxy_set_header指令
  - 负载均衡基础
- Nginx基本命令
  - nginx（启动）
  - nginx -s stop（停止）
  - nginx -s quit（优雅停止）
  - nginx -s reload（重载配置）
  - nginx -s reopen（重新打开日志文件）

#### CH09 Nginx进阶
- Nginx负载均衡配置
  - upstream块
  - 负载均衡算法
    - round_robin（轮询）
    - least_conn（最少连接）
    - ip_hash（IP哈希）
    - fair（第三方模块）
    - url_hash（第三方模块）
  - 后端服务器配置
    - weight（权重）
    - max_fails（最大失败次数）
    - fail_timeout（失败超时）
    - backup（备份服务器）
    - down（标记为不可用）
  - **详细配置实例**：
    ```nginx
    upstream backend {
        least_conn;
        server 192.168.1.10:8080 weight=3 max_fails=3 fail_timeout=30s;
        server 192.168.1.11:8080 weight=2 max_fails=3 fail_timeout=30s;
        server 192.168.1.12:8080 weight=1 max_fails=3 fail_timeout=30s;
        server 192.168.1.13:8080 backup;
    }
    
    server {
        listen 80;
        server_name www.example.com;
        
        location / {
            proxy_pass http://backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_connect_timeout 60s;
            proxy_send_timeout 60s;
            proxy_read_timeout 60s;
        }
    }
    ```
- 缓存配置
  - proxy_cache指令
  - proxy_cache_path指令
  - proxy_cache_valid指令
  - proxy_cache_key指令
  - proxy_cache_bypass指令
  - 缓存的清除
- HTTPS配置
  - SSL/TLS基础
  - 证书的获取（自签名证书、Let's Encrypt）
  - ssl_certificate和ssl_certificate_key指令
  - ssl_protocols和ssl_ciphers指令
  - ssl_prefer_server_ciphers指令
  - HTTP到HTTPS的重定向
  - HSTS配置
- 性能优化
  - worker_processes（工作进程数）
  - worker_connections（每个工作进程的连接数）
  - use epoll（事件模型）
  - sendfile指令
  - tcp_nopush和tcp_nodelay指令
  - keepalive_timeout（长连接超时）
  - gzip压缩
  - 静态文件缓存
  - 连接数限制
- 日志配置
  - access_log指令
  - error_log指令
  - 日志格式（log_format）
  - 日志的轮转（logrotate）

#### CH10 缓存服务器和容器
- Redis缓存配置
  - Redis的特点和数据结构
  - 安装Redis
  - Redis配置文件（redis.conf）
  - 常用配置项
    - bind
    - port
    - daemonize
    - logfile
    - dir
    - maxmemory
    - maxmemory-policy
  - Redis的启动和停止
  - redis-cli命令行工具
  - 基本数据操作
  - 持久化配置（RDB、AOF）
- Docker容器基础
  - Docker的概念和特点
  - Docker与虚拟机的区别
  - Docker的安装
  - Docker镜像
    - 镜像的概念
      - 镜像是只读的模板，包含创建容器的文件系统
      - 镜像由多层组成，每层基于前一层，使用UnionFS
      - 镜像层可以共享，节省存储空间
    - Docker Hub
      - 官方镜像仓库
      - 搜索镜像：docker search 镜像名
      - 官方镜像标识：OFFICIAL
    - docker pull命令
      - 拉取镜像：docker pull 镜像名:标签
      - 不指定标签默认拉取latest
      - 示例：docker pull nginx:1.24-alpine
    - docker images命令
      - 查看本地镜像：docker images 或 docker image ls
      - 常用选项：-q（只显示ID）、--no-trunc（显示完整ID）
    - docker rmi命令
      - 删除镜像：docker rmi 镜像名:标签 或 镜像ID
      - -f：强制删除（即使有容器在使用）
      - 删除所有未使用的镜像：docker image prune -a
    - 镜像的构建（Dockerfile）
      - Dockerfile是构建镜像的文本文件，包含一系列指令
      - 常用指令详解：
        - FROM：基础镜像，必须是第一条指令
          ```dockerfile
          FROM ubuntu:22.04
          FROM nginx:1.24-alpine
          ```
        - MAINTAINER/LABEL：维护者信息（LABEL更推荐）
          ```dockerfile
          LABEL maintainer="yourname@example.com"
          LABEL version="1.0"
          LABEL description="This is a custom Nginx image"
          ```
        - RUN：在镜像构建时执行命令
          ```dockerfile
          RUN apt-get update && apt-get install -y nginx
          RUN yum install -y vim
          RUN pip install flask
          ```
        - COPY：将本地文件复制到镜像中
          ```dockerfile
          COPY index.html /usr/share/nginx/html/
          COPY app/ /opt/app/
          ```
        - ADD：与COPY类似，但支持URL和解压缩
          ```dockerfile
          ADD https://example.com/file.tar.gz /opt/
          ADD file.tar.gz /opt/
          ```
        - WORKDIR：设置工作目录
          ```dockerfile
          WORKDIR /opt/app
          ```
        - EXPOSE：声明容器要监听的端口
          ```dockerfile
          EXPOSE 80
          EXPOSE 443
          EXPOSE 8080/tcp
          ```
        - ENV：设置环境变量
          ```dockerfile
          ENV NODE_ENV=production
          ENV DB_HOST=localhost
          ENV DB_PORT=5432
          ```
        - CMD：容器启动时执行的默认命令（可被覆盖）
          ```dockerfile
          CMD ["nginx", "-g", "daemon off;"]
          CMD python app.py
          ```
        - ENTRYPOINT：容器启动时执行的命令（不可被覆盖）
          ```dockerfile
          ENTRYPOINT ["nginx"]
          ENTRYPOINT ["python", "app.py"]
          ```
        - USER：指定运行容器的用户
          ```dockerfile
          USER nginx
          USER 1001
          ```
        - VOLUME：声明数据卷
          ```dockerfile
          VOLUME /data
          VOLUME ["/var/log", "/var/lib"]
          ```
      - 完整Dockerfile示例（Nginx）：
        ```dockerfile
        FROM nginx:1.24-alpine
        LABEL maintainer="admin@example.com"
        LABEL version="1.0"
        
        COPY nginx.conf /etc/nginx/nginx.conf
        COPY html/ /usr/share/nginx/html/
        
        EXPOSE 80 443
        
        CMD ["nginx", "-g", "daemon off;"]
        ```
      - 完整Dockerfile示例（Python Flask应用）：
        ```dockerfile
        FROM python:3.11-slim
        
        WORKDIR /app
        
        COPY requirements.txt .
        RUN pip install --no-cache-dir -r requirements.txt
        
        COPY . .
        
        EXPOSE 5000
        
        ENV FLASK_APP=app.py
        ENV FLASK_ENV=production
        
        CMD ["flask", "run", "--host=0.0.0.0"]
        ```
      - 完整Dockerfile示例（Node.js应用）：
        ```dockerfile
        FROM node:18-alpine
        
        WORKDIR /app
        
        COPY package*.json ./
        RUN npm install --production
        
        COPY . .
        
        EXPOSE 3000
        
        USER node
        
        CMD ["node", "server.js"]
        ```
    - docker build命令
      - 构建镜像：docker build -t 镜像名:标签 上下文路径
      - -t：指定镜像名和标签
      - -f：指定Dockerfile文件路径
      --no-cache：不使用缓存
      - 示例：
        ```bash
        docker build -t mynginx:1.0 .
        docker build -t myapp:latest -f Dockerfile.prod .
        ```
  - Docker容器
    - 容器的概念
      - 容器是镜像的运行实例
      - 容器是轻量级的，包含应用及其依赖
      - 容器之间相互隔离
      - 容器具有自己的文件系统、网络、进程空间
    - docker run命令
      - 创建并启动容器：docker run [选项] 镜像名 [命令]
      - 常用选项详解：
        - -d：后台运行容器（detached）
        - -i：保持STDIN打开
        - -t：分配伪终端（TTY）
        - -it：交互式运行容器
        - --name：指定容器名称
        - -p：端口映射（宿主端口:容器端口）
        - -v：数据卷挂载（宿主路径:容器路径）
        - -e：设置环境变量
        - --rm：容器退出后自动删除
        - --restart：设置重启策略（no、always、on-failure、unless-stopped）
        - --network：指定网络
        - --link：链接到其他容器
      - 示例：
        ```bash
        docker run -d --name mynginx -p 8080:80 nginx:1.24
        docker run -it --rm ubuntu:22.04 /bin/bash
        docker run -d --name mysql -e MYSQL_ROOT_PASSWORD=123456 -p 3306:3306 -v /data/mysql:/var/lib/mysql mysql:8.0
        docker run -d --name redis -p 6379:6379 --restart=always redis:7-alpine
        ```
    - docker ps命令
      - 查看运行中的容器：docker ps
      - 查看所有容器（包括停止的）：docker ps -a
      - 常用选项：-q（只显示ID）、-l（最近创建的）、-s（显示大小）
      - 示例：
        ```bash
        docker ps
        docker ps -a
        docker ps -q
        ```
    - docker stop命令
      - 停止运行中的容器：docker stop 容器名/容器ID
      - 先发送SIGTERM信号，超时后发送SIGKILL
      - 示例：docker stop mynginx
    - docker start命令
      - 启动已停止的容器：docker start 容器名/容器ID
      - 示例：docker start mynginx
    - docker restart命令
      - 重启容器：docker restart 容器名/容器ID
      - 示例：docker restart mynginx
    - docker rm命令
      - 删除容器：docker rm 容器名/容器ID
      - -f：强制删除运行中的容器
      - -v：同时删除关联的卷
      - 删除所有停止的容器：docker container prune
      - 示例：
        ```bash
        docker rm mynginx
        docker rm -f mynginx
        docker rm $(docker ps -a -q)
        ```
    - docker exec命令
      - 在运行的容器中执行命令：docker exec [选项] 容器名/容器ID 命令
      - -it：交互式执行
      - 常用示例：
        ```bash
        docker exec -it mynginx /bin/sh
        docker exec -it mysql mysql -u root -p
        docker exec mynginx nginx -s reload
        ```
    - docker logs命令
      - 查看容器日志：docker logs [选项] 容器名/容器ID
      - -f：跟踪日志输出（follow）
      - --tail N：显示最后N行
      - --since：显示指定时间之后的日志
      - 示例：
        ```bash
        docker logs mynginx
        docker logs -f --tail 100 mynginx
        ```
    - docker inspect命令
      - 查看容器详细信息：docker inspect 容器名/容器ID
      - 输出JSON格式的详细信息
      - 使用--format格式化输出
      - 示例：
        ```bash
        docker inspect mynginx
        docker inspect --format='{{.NetworkSettings.IPAddress}}' mynginx
        ```
    - 端口映射（-p）
      - 格式：-p 宿主端口:容器端口
      - 格式：-p 宿主IP:宿主端口:容器端口
      - 格式：-p 容器端口（自动分配宿主端口）
      - 示例：
        ```bash
        -p 8080:80
        -p 192.168.1.100:8080:80
        -p 80
        ```
    - 数据卷（-v）
      - 格式：-v 宿主路径:容器路径
      - 格式：-v 卷名:容器路径
      - 格式：-v 容器路径（匿名卷）
      - -v 宿主路径:容器路径:ro：只读挂载
      - docker volume命令：
        ```bash
        docker volume create myvolume
        docker volume ls
        docker volume inspect myvolume
        docker volume rm myvolume
        ```
      - 示例：
        ```bash
        -v /data/nginx:/usr/share/nginx/html
        -v myvolume:/data
        -v /data/nginx:/usr/share/nginx/html:ro
        ```
    - 环境变量（-e）
      - 格式：-e KEY=VALUE
      - 多个-e设置多个环境变量
      - --env-file从文件读取环境变量
      - 示例：
        ```bash
        -e MYSQL_ROOT_PASSWORD=123456
        -e DB_HOST=mysql -e DB_PORT=3306
        --env-file .env
        ```
  - Docker仓库
    - 私有仓库的搭建
    - docker push命令
    - docker tag命令
- 容器编排（Docker Compose）
  - Docker Compose的概念
    - 用于定义和运行多容器Docker应用的工具
    - 使用YAML文件配置应用服务
    - 一键启动、停止所有服务
  - docker-compose.yml文件
    - 文件结构：version、services、volumes、networks
    - version：指定Compose文件格式版本（推荐3.x）
    - services：定义各个服务
    - volumes：定义数据卷
    - networks：定义网络
  - services配置详解
    - 常用配置项：
      - image：使用的镜像
      - build：从Dockerfile构建
      - ports：端口映射
      - volumes：数据卷挂载
      - environment：环境变量
      - depends_on：服务依赖关系
      - restart：重启策略
      - networks：连接的网络
      - command：覆盖默认命令
      - entrypoint：覆盖默认入口点
      - container_name：容器名称
      - healthcheck：健康检查
  - 完整docker-compose.yml示例（Nginx + PHP + MySQL）：
    ```yaml
    version: '3.8'
    
    services:
      nginx:
        image: nginx:1.24-alpine
        container_name: nginx
        ports:
          - "80:80"
          - "443:443"
        volumes:
          - ./nginx.conf:/etc/nginx/nginx.conf
          - ./html:/usr/share/nginx/html
          - ./logs/nginx:/var/log/nginx
        depends_on:
          - php
        networks:
          - app-network
        restart: unless-stopped
      
      php:
        image: php:8.2-fpm-alpine
        container_name: php
        volumes:
          - ./html:/usr/share/nginx/html
        networks:
          - app-network
        restart: unless-stopped
      
      mysql:
        image: mysql:8.0
        container_name: mysql
        environment:
          MYSQL_ROOT_PASSWORD: root123456
          MYSQL_DATABASE: mydb
          MYSQL_USER: myuser
          MYSQL_PASSWORD: mypassword
        ports:
          - "3306:3306"
        volumes:
          - mysql-data:/var/lib/mysql
          - ./init:/docker-entrypoint-initdb.d
        networks:
          - app-network
        restart: unless-stopped
        healthcheck:
          test: ["CMD", "mysqladmin", "ping", "-h", "localhost", "-u", "root", "-proot123456"]
          interval: 10s
          timeout: 5s
          retries: 5
    
    volumes:
      mysql-data:
    
    networks:
      app-network:
        driver: bridge
    ```
  - 完整docker-compose.yml示例（Web应用 + Redis + PostgreSQL）：
    ```yaml
    version: '3.8'
    
    services:
      web:
        build: .
        container_name: webapp
        ports:
          - "5000:5000"
        environment:
          - FLASK_ENV=production
          - REDIS_HOST=redis
          - DB_HOST=db
        depends_on:
          redis:
            condition: service_healthy
          db:
            condition: service_healthy
        networks:
          - app-network
        restart: unless-stopped
      
      redis:
        image: redis:7-alpine
        container_name: redis
        ports:
          - "6379:6379"
        volumes:
          - redis-data:/data
        networks:
          - app-network
        restart: unless-stopped
        healthcheck:
          test: ["CMD", "redis-cli", "ping"]
          interval: 10s
          timeout: 5s
          retries: 5
      
      db:
        image: postgres:15-alpine
        container_name: postgres
        environment:
          POSTGRES_USER: myuser
          POSTGRES_PASSWORD: mypassword
          POSTGRES_DB: mydb
        ports:
          - "5432:5432"
        volumes:
          - postgres-data:/var/lib/postgresql/data
        networks:
          - app-network
        restart: unless-stopped
        healthcheck:
          test: ["CMD-SHELL", "pg_isready -U myuser -d mydb"]
          interval: 10s
          timeout: 5s
          retries: 5
    
    volumes:
      redis-data:
      postgres-data:
    
    networks:
      app-network:
        driver: bridge
    ```
  - docker-compose常用命令
    - docker-compose up：启动服务
      - -d：后台运行
      - --build：重新构建镜像
      - --force-recreate：强制重新创建容器
    - docker-compose down：停止并删除服务
      - -v：同时删除数据卷
      - --rmi all：删除所有镜像
    - docker-compose ps：查看服务状态
    - docker-compose logs：查看日志
      - -f：跟踪日志
      --tail N：显示最后N行
    - docker-compose exec：在服务中执行命令
    - docker-compose stop：停止服务
    - docker-compose start：启动服务
    - docker-compose restart：重启服务
    - docker-compose build：构建镜像
    - 示例：
      ```bash
      docker-compose up -d
      docker-compose down
      docker-compose logs -f web
      docker-compose exec web /bin/bash
      docker-compose ps
      ```
  - 常用配置项
    - deploy：部署配置（Swarm模式）
    - configs：配置文件
    - secrets：密钥
    - logging：日志配置
    - devices：设备映射
- 容器网络配置
  - Docker网络模式
    - bridge（桥接）
    - host（主机）
    - none（无网络）
    - container（容器）
  - docker network命令
  - 创建自定义网络
  - 容器间的通信

## 二、学习重点

### 核心技能
- 掌握Linux文件系统操作命令
- 熟练编写Shell脚本实现自动化任务
- 理解Nginx服务器配置与优化
- 了解Docker容器基本操作
- 掌握系统安全配置

### 重点章节
- **CH04 Shell脚本编程**：自动化任务的核心
- **CH08-CH09 Nginx服务器**：Web服务部署的关键
- **CH10 缓存服务器和容器**：现代应用部署的基础

## 三、学习建议

### 实践建议
1. **搭建虚拟机环境**：使用VMware或VirtualBox安装Linux发行版
2. **命令练习**：每天练习10-20个Linux命令，熟悉常用操作
3. **脚本编写**：从简单脚本开始，逐步编写复杂的自动化脚本
4. **服务器配置**：搭建Nginx服务器，配置虚拟主机和反向代理
5. **容器实践**：使用Docker部署简单应用，熟悉容器生命周期

### 学习资源
- **书籍**：《鸟哥的Linux私房菜》、《Linux命令行与Shell脚本编程大全》
- **在线资源**：Linux命令手册、Nginx官方文档、Docker官方文档
- **工具推荐**：Xshell（远程连接）、WinSCP（文件传输）

### 学习路径
1. **基础阶段**：熟悉Linux基本命令和文件系统
2. **进阶阶段**：学习Shell脚本编程和系统管理
3. **应用阶段**：配置服务器和容器化部署

## 四、常见问题与解决方案

### 命令使用问题
- **问题**：忘记命令参数
  **解决**：使用man命令查看帮助文档，如`man ls`

### 权限问题
- **问题**：权限不足
  **解决**：使用sudo命令获取临时权限，或修改文件权限

### 服务启动问题
- **问题**：服务启动失败
  **解决**：查看系统日志，使用`systemctl status 服务名`检查状态

### 网络配置问题
- **问题**：网络连接失败
  **解决**：检查网络配置，使用`ping`和`traceroute`排查网络问题

## 五、总结

Linux操作系统是计算机专业的重要基础课程，掌握Linux系统管理和服务配置技能对于后续的服务器运维、应用部署等工作至关重要。通过系统学习和实践，你将能够：

1. 熟练使用Linux命令行进行系统管理
2. 编写Shell脚本实现自动化任务
3. 配置和优化Web服务器
4. 使用容器技术进行应用部署
5. 保障系统安全

建议在学习过程中注重实践，通过实际操作加深对知识点的理解，为后续的专业学习和工作打下坚实的基础。

---

## 六、速记宝典（口诀 + 对比表 + 命令速查）

### 6.1 Linux系统架构速记

**口诀**：「**内管进，外管件，Shell 连两端**」

| 层 | 组成 | 一句话 |
|---|------|--------|
| 硬件层 | CPU、内存、硬盘、外设 | 物理基础 |
| 内核层 | 进程管理、内存管理、文件系统、设备驱动、网络协议栈 | **Linux的心脏** |
| Shell层 | bash、zsh、sh | 用户与内核的翻译官 |
| 应用层 | vi、gcc、nginx、docker | 用户直接使用的程序 |

---

### 6.2 文件权限速记

**权限三组**：「**主-组-他**」= u-g-o

| 权限 | 数字 | 含义 | 记忆 |
|------|:--:|------|------|
| r (读) | 4 | 查看内容 | **Read** |
| w (写) | 2 | 修改内容 | **Write** |
| x (执行) | 1 | 运行/进入目录 | **eXecute** |

**数字权限速算**：rwx = 4+2+1=7, rw- = 4+2=6, r-- = 4, --- = 0
- `chmod 755 file` = rwxr-xr-x（所有者全权限，组和其他只读+执行）
- `chmod 644 file` = rw-r--r--（所有者读写，组和其他只读）

**文件类型速记**（ls -l 第一个字符）：
| 符号 | 类型 | 记忆 |
|:--:|------|------|
| `-` | 普通文件 | 一横，普普通通 |
| `d` | 目录 | **D**irectory |
| `l` | 软链接 | **L**ink（像箭头） |
| `b` | 块设备 | **B**lock（硬盘） |
| `c` | 字符设备 | **C**har（键盘） |
| `p` | 管道 | **P**ipe |
| `s` | 套接字 | **S**ocket |

**硬链接 vs 软链接**：
| | 硬链接 | 软链接 |
|---|--------|--------|
| 本质 | 同一个inode的多个名字 | 存目标路径的快捷方式 |
| 跨文件系统 | ❌ | ✅ |
| 链接目录 | ❌ | ✅ |
| 删原文件 | 不影响 | 链接失效 |
| 记忆 | **"同一个人的多个名字"** | **"指向目标的快捷方式"** |

---

### 6.3 目录结构速记（FHS标准）

**口诀**：「**bin放命令，etc配系统，home住用户，var存变化，usr装软件，tmp临时放**」

| 目录 | 用途 | 速记 |
|------|------|------|
| /bin | 基础命令 | **Bin**ary |
| /sbin | 管理命令 | **S**ystem Bin |
| /etc | 配置文件 | **E**dit **T**o **C**onfigure |
| /home | 用户目录 | **Home** 家 |
| /root | root的家 | **Root** 超级管理员 |
| /var | 日志/缓存/数据 | **Var**iable 变化的 |
| /usr | 用户程序/库 | **U**nix **S**ystem **R**esources |
| /tmp | 临时文件 | **T**e**mp**orary |
| /dev | 设备文件 | **Dev**ice |
| /proc | 进程/系统信息 | **Proc**ess 虚拟文件系统 |

---

### 6.4 常用命令分类速记

**文件操作**：「**增删改查移复链**」
- 增：`touch`（空文件）、`mkdir`（目录）
- 删：`rm`（文件）、`rm -r`（目录）
- 改：`vim/nano`
- 查：`cat`（全看）、`less`（翻页）、`head`/`tail`（头尾）、`grep`（搜索）
- 移：`mv`（移动+重命名）
- 复：`cp`
- 链：`ln` / `ln -s`

**权限管理**：「**chmod改权限，chown改主人，chgrp改组**」
- `chmod`：Change Mode
- `chown`：Change Owner
- `chgrp`：Change Group

**进程管理**：「**ps看快照，top看动态，kill发信号，jobs看后台**」
- `ps aux`：查看所有进程快照
- `top`：动态实时监控
- `kill -9 PID`：强制终止
- `jobs` / `fg` / `bg`：作业控制

**网络命令**：「**ping测通，ifconfig看IP，netstat看连接，curl发请求**」

**管道与重定向**：
| 符号 | 含义 | 记忆 |
|:--:|------|------|
| `|` | 管道：前命令输出→后命令输入 | 像水管连接 |
| `>` | 覆盖写入文件 | 箭头指向文件 |
| `>>` | 追加写入文件 | 双箭头追加 |
| `<` | 从文件读取输入 | 箭头指向命令 |

---

### 6.5 Shell脚本速记

**变量**：「**赋不加空格，取要加钱符**」
```bash
name="hello"      # 定义（等号两边不能有空格！）
echo $name        # 取值
echo ${name}world # 拼接（花括号保护边界）
```

**条件判断**：
| 文件测试 | 含义 | 数值比较 | 含义 |
|---------|------|---------|------|
| `-f` | 是普通文件 | `-eq` | 等于 |
| `-d` | 是目录 | `-ne` | 不等于 |
| `-x` | 可执行 | `-gt` | 大于 |
| `-z` | 字符串为空 | `-lt` | 小于 |

**流程控制记忆**：
```bash
if [ 条件 ]; then ... fi        # if-fi 包裹
for i in 列表; do ... done       # for-done 包裹
while [ 条件 ]; do ... done      # while-done 包裹
case $var in 模式) ... ;; esac   # case-esac（倒过来写）
```

---

### 6.6 各章一句话核心

| 章节 | 一句话核心 |
|------|-----------|
| CH01 开源操作系统 | Linux=开源Unix变种，内核+Shell+应用构成系统 |
| CH02 文件系统 | 一切皆文件：普通/目录/链接/设备，权限rwx三位一体 |
| CH03 用户进程网络 | 用户分root/普通，进程有父子，网络用ifconfig/ping |
| CH04 Shell脚本 | 变量+条件+循环+函数=自动化运维 |
| CH05 系统安全 | iptables/firewalld防火墙 + SSH安全配置 |
| CH06 引导日志计划 | systemd管理服务，journalctl看日志，crontab定时 |
| CH07 文件服务器 | Samba共享给Windows，NFS共享给Linux |
| CH08-09 Nginx | 反向代理+负载均衡+静态资源，配置=server+location |
| CH10 容器 | Docker：镜像→容器，打包一次到处运行 |

---

### 6.7 高频易错点

1. **等号两边不能有空格**：`name=value` ✅，`name = value` ❌
2. **rm没有回收站**，删了就没了！
3. **软链接删原文件会失效**，硬链接不会
4. **/bin vs /sbin**：s=system管理员用的命令
5. **chmod 777极度危险**，任何人都能读写执行
6. **`>`是覆盖，`>>`是追加**