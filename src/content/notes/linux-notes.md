---
title: "Linux系统速记"
date: "2025-06"
type: "learning"
tags: [Linux, Shell, 文件系统, 进程管理, 网络配置]
summary: "Linux系统核心知识点速记，涵盖文件系统、进程管理、Shell编程、网络配置、系统安全等内容"
---

# Linux系统速记

---

## 1. 文件系统

### 1.1 目录结构速查

| 目录 | 用途 |
|------|------|
| `/` | 根目录，所有目录的起点 |
| `/home` | 普通用户家目录 |
| `/root` | root用户家目录 |
| `/etc` | 系统配置文件 |
| `/var` | 可变数据（日志、缓存、邮件） |
| `/tmp` | 临时文件（重启可能清除） |
| `/usr` | 用户程序、库文件、文档 |
| `/usr/local` | 手动安装的软件 |
| `/bin` → `/usr/bin` | 基本用户命令 |
| `/sbin` → `/usr/sbin` | 系统管理命令 |
| `/lib` → `/usr/lib` | 共享库文件 |
| `/boot` | 内核与启动文件 |
| `/dev` | 设备文件（硬盘、终端等） |
| `/proc` | 进程与内核信息（虚拟文件系统） |
| `/sys` | 设备与驱动信息（虚拟文件系统） |
| `/mnt` / `/media` | 临时挂载点 |

### 1.2 文件权限

权限位结构：`rwxrwxrwx` = 所有者 | 所属组 | 其他用户

| 权限 | 字符 | 数字 | 含义 |
|------|------|------|------|
| 读 | `r` | 4 | 查看文件内容 |
| 写 | `w` | 2 | 修改文件内容 |
| 执行 | `x` | 1 | 运行文件/进入目录 |

```bash
# 权限数字计算示例
chmod 755 file    # rwxr-xr-x（所有者rwx，组r-x，其他r-x）
chmod 644 file    # rw-r--r--
chmod 700 dir     # rwx------
```

特殊权限：

| 权限 | 符号 | 数字 | 作用 |
|------|------|------|------|
| SUID | `s`（所有者x位） | 4 | 以文件所有者身份执行 |
| SGID | `s`（组x位） | 2 | 以文件所属组身份执行 |
| Sticky Bit | `t`（其他x位） | 1 | 仅文件所有者可删除目录内文件 |

### 1.3 常用文件操作命令

```bash
# 文件查找
find / -name "*.log" -mtime -7           # 7天内修改的.log文件
find / -size +100M                        # 大于100M的文件
find / -user username                     # 查找某用户拥有的文件
find / -type f -perm 777                  # 查找权限为777的文件
locate filename                           # 基于数据库快速查找（需updatedb）

# 文件内容处理
grep -rn "pattern" /path                  # 递归搜索，显示行号
grep -i "pattern" file                    # 忽略大小写
grep -E "regex" file                      # 扩展正则
grep -v "pattern" file                    # 反向匹配

# 文件比较与合并
diff file1 file2                          # 逐行比较
diff -u file1 file2                       # 统一格式diff
diff -rq dir1 dir2                        # 递归比较目录
patch -p0 < changes.patch                 # 应用补丁
```

---

## 2. 进程管理

### 2.1 常用命令速查

| 命令 | 用途 | 常用选项 |
|------|------|----------|
| `ps` | 查看进程快照 | `aux`, `ef`, `-eo pid,ppid,cmd` |
| `top` | 实时进程监控 | `-u username`, `-d 2`, `-bn1` |
| `htop` | 增强版top | 交互式界面 |
| `kill` | 发送信号给进程 | `-9`（强制）, `-15`（优雅终止） |
| `killall` | 按名称杀进程 | `-9`, `-u user` |
| `pkill` | 按模式杀进程 | `-f pattern` |
| `nohup` | 忽略挂起信号运行 | 重定向到 nohup.out |
| `&` | 后台运行 | 放在命令末尾 |
| `jobs` | 查看后台作业 | `-l` 显示PID |
| `fg` | 前台运行作业 | `%job_id` |
| `bg` | 后台继续作业 | `%job_id` |
| `nice` | 以指定优先级启动 | `-n 10`（值越大优先级越低） |
| `renice` | 调整运行中进程优先级 | `-p PID` `-n 10` |
| `strace` | 跟踪系统调用 | `-p PID`, `-e trace=network` |
| `lsof` | 查看打开的文件 | `-p PID`, `-i :80`, `-u username` |

### 2.2 ps 常用组合

```bash
ps aux                           # 所有用户的所有进程
ps -ef                           # 完整格式（含PPID）
ps -eo pid,ppid,user,%cpu,%mem,cmd --sort=-%cpu   # 按CPU排序
ps -eo pid,ppid,user,%cpu,%mem,cmd --sort=-%mem   # 按内存排序
ps -ejH                          # 树形显示
```

### 2.3 信号速查

| 信号 | 编号 | 作用 |
|------|------|------|
| `SIGHUP` | 1 | 挂起/重载配置 |
| `SIGINT` | 2 | 中断（Ctrl+C） |
| `SIGQUIT` | 3 | 退出并生成core dump |
| `SIGKILL` | 9 | 强制终止（不可捕获） |
| `SIGTERM` | 15 | 优雅终止（默认） |
| `SIGSTOP` | 19 | 暂停进程 |
| `SIGCONT` | 18 | 继续暂停的进程 |

### 2.4 后台运行与持久化

```bash
# 基本后台运行
command &

# 挂断终端后继续运行
nohup command > output.log 2>&1 &

# 使用 screen 持久化
screen -S mysession
screen -ls                        # 列出会话
screen -r mysession               # 恢复会话
# 断开：Ctrl+A, D

# 使用 tmux 持久化
tmux new -s mysession
tmux ls
tmux attach -t mysession
# 断开：Ctrl+B, D
```

---

## 3. 用户管理

### 3.1 常用命令速查

| 命令 | 用途 | 示例 |
|------|------|------|
| `useradd` | 创建用户 | `-m` 创建家目录, `-s /bin/bash`, `-G wheel` |
| `usermod` | 修改用户 | `-aG sudo user`, `-L` 锁定, `-U` 解锁 |
| `userdel` | 删除用户 | `-r` 同时删除家目录 |
| `passwd` | 修改密码 | `passwd username`, `-l` 锁定, `-u` 解锁 |
| `groupadd` | 创建组 | `groupadd groupname` |
| `groupmod` | 修改组 | `-n newname oldname` |
| `gpasswd` | 组管理 | `-a user group`, `-d user group` |
| `id` | 查看用户信息 | `id username` |
| `whoami` | 当前用户名 | |
| `groups` | 所属组列表 | `groups username` |
| `su` | 切换用户 | `-` 切换环境, `su - username` |
| `sudo` | 以root执行 | `-i` 交互式, `-u user` 指定用户 |

### 3.2 配置文件速查

| 文件 | 用途 |
|------|------|
| `/etc/passwd` | 用户账户信息 |
| `/etc/shadow` | 密码哈希（仅root可读） |
| `/etc/group` | 组信息 |
| `/etc/gshadow` | 组密码信息 |
| `/etc/sudoers` | sudo配置（用visudo编辑） |
| `/etc/login.defs` | 登录相关默认配置 |

### 3.3 sudo 配置示例

```bash
# /etc/sudoers 格式（使用 visudo 编辑）
username    ALL=(ALL:ALL)    ALL              # 完全权限
%wheel      ALL=(ALL:ALL)    ALL              # wheel组全部权限
username    ALL=(ALL)         NOPASSWD: ALL    # 免密码
username    ALL=(ALL)         /usr/bin/systemctl restart nginx  # 仅允许特定命令
```

---

## 4. 网络配置

### 4.1 网络工具对比速查

| 功能 | 旧命令 | 新命令（推荐） | 说明 |
|------|--------|----------------|------|
| 查看IP | `ifconfig` | `ip addr` | ifconfig 需安装 net-tools |
| 启用/禁网卡 | `ifconfig eth0 up/down` | `ip link set eth0 up/down` | |
| 设置IP | `ifconfig eth0 192.168.1.10` | `ip addr add 192.168.1.10/24 dev eth0` | |
| 路由表 | `route -n` | `ip route show` | |
| 添加路由 | `route add -net ...` | `ip route add ...` | |
| ARP表 | `arp -a` | `ip neigh` | |
| 端口监听 | `netstat -tlnp` | `ss -tlnp` | ss 更快 |
| 连接统计 | `netstat -s` | `ss -s` | |

### 4.2 常用网络命令

```bash
# 连通性测试
ping -c 4 example.com              # 发4个包
traceroute example.com             # 路由追踪
mtr example.com                    # 实时路由追踪（整合ping+traceroute）

# DNS 查询
nslookup example.com               # 基本DNS查询
dig example.com                    # 详细DNS查询
dig example.com +short             # 简短输出
dig @8.8.8.8 example.com           # 指定DNS服务器
host example.com                   # 简单DNS查询

# 端口与连接
ss -tlnp                           # 监听的TCP端口（-t TCP, -l 监听, -n 数字, -p 进程）
ss -ulnp                           # 监听的UDP端口
ss -s                              # 连接统计摘要
ss state established               # 已建立的连接
lsof -i :80                        # 80端口占用进程
curl -I https://example.com        # 只获取HTTP头
wget -q -O- https://example.com    # 下载到stdout
```

### 4.3 防火墙配置

**iptables 基本规则：**

```bash
# 查看规则
iptables -L -n -v
iptables -L -n --line-numbers

# 基本操作
iptables -A INPUT -p tcp --dport 80 -j ACCEPT     # 允许80端口
iptables -A INPUT -s 192.168.1.0/24 -j ACCEPT      # 允许某网段
iptables -A INPUT -p tcp --dport 22 -j DROP        # 拒绝22端口
iptables -D INPUT 3                                 # 删除第3条规则
iptables -F                                         # 清空所有规则
```

**firewalld 基本操作：**

```bash
firewall-cmd --state                                # 查看状态
firewall-cmd --list-all                             # 查看所有规则
firewall-cmd --add-port=8080/tcp --permanent        # 永久开放端口
firewall-cmd --add-service=http --permanent         # 永久开放服务
firewall-cmd --reload                               # 重载配置
firewall-cmd --remove-port=8080/tcp --permanent     # 移除端口
```

---

## 5. Shell 编程

### 5.1 变量

```bash
# 定义与使用
name="Linux"
echo ${name}
echo ${name:-default}              # 变量为空时使用默认值
echo ${name:=default}              # 变量为空时赋值
echo ${#name}                      # 字符串长度
echo ${name:0:3}                   # 子串（从0开始，取3个字符）

# 数组
arr=(apple banana cherry)
echo ${arr[0]}                     # 第一个元素
echo ${arr[@]}                     # 所有元素
echo ${#arr[@]}                    # 数组长度
arr+=(date)                        # 追加元素

# 环境变量
export PATH=$PATH:/new/path        # 临时导出
readonly CONST="value"             # 只读变量
```

### 5.2 条件判断

```bash
# 字符串比较
[ "$str1" = "$str2" ]              # 相等
[ "$str1" != "$str2" ]             # 不相等
[ -z "$str" ]                      # 为空
[ -n "$str" ]                      # 非空

# 数值比较
[ $a -eq $b ]     # 等于        [ $a -ne $b ]     # 不等于
[ $a -gt $b ]     # 大于        [ $a -lt $b ]     # 小于
[ $a -ge $b ]     # 大于等于    [ $a -le $b ]     # 小于等于
(( a > b ))       # 算术比较（推荐）

# 文件测试
[ -f file ]       # 是普通文件    [ -d dir ]        # 是目录
[ -e path ]       # 存在          [ -r file ]       # 可读
[ -w file ]       # 可写          [ -x file ]       # 可执行
[ -s file ]       # 文件非空      [ -L file ]       # 是符号链接

# 逻辑组合
[ condition1 ] && [ condition2 ]    # 与
[ condition1 ] || [ condition2 ]    # 或
[ ! condition ]                     # 非
[[ $str == pattern* ]]              # 通配符匹配
[[ $str =~ regex ]]                 # 正则匹配
```

### 5.3 循环

```bash
# for 循环
for i in 1 2 3 4 5; do echo $i; done
for i in {1..10}; do echo $i; done
for ((i=0; i<10; i++)); do echo $i; done
for f in *.txt; do echo "$f"; done

# while 循环
while [ $count -lt 10 ]; do
    echo $count
    ((count++))
done

# 读取文件每一行
while IFS= read -r line; do
    echo "$line"
done < file.txt

# until 循环（条件为假时执行）
until [ $count -ge 10 ]; do
    echo $count
    ((count++))
done
```

### 5.4 函数

```bash
# 函数定义
function greet() {
    local name=$1                  # local 定义局部变量
    echo "Hello, $name!"
}

# 调用
greet "World"

# 返回值
add() {
    echo $(( $1 + $2 ))           # 通过 echo 输出
}
result=$(add 3 5)
```

### 5.5 正则表达式速查

| 元字符 | 含义 | 示例 |
|--------|------|------|
| `.` | 匹配任意单个字符 | `a.c` 匹配 abc, aXc |
| `*` | 前一字符出现0次或多次 | `ab*c` 匹配 ac, abc, abbc |
| `+` | 前一字符出现1次或多次（扩展） | `ab+c` 匹配 abc, abbc |
| `?` | 前一字符出现0次或1次（扩展） | `ab?c` 匹配 ac, abc |
| `^` | 行首 | `^Hello` 匹配以Hello开头 |
| `$` | 行尾 | `world$` 匹配以world结尾 |
| `[]` | 字符集 | `[aeiou]` 匹配任一元音 |
| `[^]` | 排除字符集 | `[^0-9]` 匹配非数字 |
| `\b` | 单词边界 | `\bword\b` 精确匹配word |
| `{n,m}` | 出现次数范围（扩展） | `a{2,4}` 匹配 aa~aaaa |
| `\(\)` | 分组 | `\(ab\)\1` 反向引用 |

### 5.6 awk 速查

```bash
# 基本语法：awk 'pattern {action}' file

# 打印特定列
awk '{print $1, $3}' file                    # 第1、3列
awk -F: '{print $1}' /etc/passwd             # 指定分隔符

# 条件过滤
awk '$3 > 100' file                          # 第3列大于100
awk '/pattern/' file                         # 匹配行
awk '$1 == "root"' file                      # 精确匹配

# 内置变量
awk '{print NR, NF, $0}' file                # NR行号, NF列数, $0整行
awk 'END{print NR}' file                     # 总行数

# 计算
awk '{sum+=$1} END{print sum}' file          # 求和
awk '{sum+=$1} END{print sum/NR}' file       # 求平均

# 多文件处理
awk 'FNR==NR{a[$1]=$2; next} ($1 in a){print $0, a[$1]}' file1 file2
```

### 5.7 sed 速查

```bash
# 替换
sed 's/old/new/g' file                       # 全局替换（每行）
sed -i 's/old/new/g' file                    # 就地修改
sed -i.bak 's/old/new/g' file                # 备份后修改
sed -n '5,10p' file                          # 打印第5-10行
sed -n '/pattern/p' file                     # 打印匹配行
sed '/pattern/d' file                        # 删除匹配行
sed '3a\new line' file                       # 第3行后插入
sed '3i\new line' file                       # 第3行前插入
sed '3c\new line' file                       # 替换第3行
sed '1,3s/^/    /' file                      # 1-3行添加缩进
sed '/^$/d' file                             # 删除空行
sed 's/[[:space:]]*$//' file                 # 删除行尾空白
```

---

## 6. 系统管理

### 6.1 systemctl 服务管理

```bash
systemctl start nginx                        # 启动服务
systemctl stop nginx                         # 停止服务
systemctl restart nginx                      # 重启服务
systemctl reload nginx                       # 重载配置
systemctl status nginx                       # 查看状态
systemctl enable nginx                       # 开机自启
systemctl disable nginx                      # 取消开机自启
systemctl list-units --type=service          # 列出所有服务
systemctl list-unit-files --type=service     # 列出服务文件
systemctl is-active nginx                    # 是否运行
systemctl is-enabled nginx                   # 是否开机自启
systemctl mask nginx                         # 完全禁用服务
systemctl unmask nginx                       # 取消禁用
```

### 6.2 日志管理

```bash
# journalctl
journalctl -u nginx                          # 查看nginx日志
journalctl -u nginx --since "1 hour ago"     # 最近1小时
journalctl -u nginx -f                       # 实时跟踪
journalctl -p err                            # 只看错误级别
journalctl --boot                             # 本次启动日志
journalctl -k                                # 内核日志
journalctl --disk-usage                      # 日志占用空间
journalctl --vacuum-size=500M                # 清理到500M以下

# 日志级别：emerg, alert, crit, err, warning, notice, info, debug

# 传统日志文件
/var/log/syslog          # 系统日志（Debian/Ubuntu）
/var/log/messages        # 系统日志（RHEL/CentOS）
/var/log/auth.log        # 认证日志（Debian/Ubuntu）
/var/log/secure          # 认证日志（RHEL/CentOS）
/var/log/dmesg           # 内核环形缓冲区
/var/log/cron            # 定时任务日志
/var/log/boot.log        # 启动日志
```

### 6.3 crontab 定时任务

```bash
crontab -e               # 编辑当前用户定时任务
crontab -l               # 列出当前用户定时任务
crontab -u user -l       # 列出指定用户定时任务
```

**Cron 表达式格式：**

```
┌───────────── 分钟 (0-59)
│ ┌───────────── 小时 (0-23)
│ │ ┌───────────── 日 (1-31)
│ │ │ ┌───────────── 月 (1-12)
│ │ │ │ ┌───────────── 星期 (0-7, 0和7都是周日)
│ │ │ │ │
* * * * * command
```

| 表达式 | 含义 |
|--------|------|
| `* * * * *` | 每分钟 |
| `0 * * * *` | 每小时整点 |
| `0 2 * * *` | 每天凌晨2点 |
| `0 2 * * 1` | 每周一凌晨2点 |
| `0 0 1 * *` | 每月1号零点 |
| `*/5 * * * *` | 每5分钟 |
| `0 9-17 * * 1-5` | 工作日9-17点整点 |
| `0 0 * * 0,3` | 每周日和周三零点 |

---

## 7. 磁盘管理

### 7.1 磁盘信息查看

```bash
lsblk                                # 列出块设备（树形）
fdisk -l                             # 列出所有磁盘及分区
blkid                                # 查看分区UUID和文件系统
df -h                                # 磁盘空间使用
df -ih                               # inode使用
du -sh /path                         # 目录大小
du -h --max-depth=1 /                # 一级子目录大小
```

### 7.2 分区操作（fdisk / parted）

| 功能 | MBR（fdisk） | GPT（parted） |
|------|--------------|---------------|
| 创建分区 | `n` | `mkpart primary ext4 1MiB 10GiB` |
| 删除分区 | `d` | `rm 1` |
| 保存退出 | `w` | `print` 确认 |
| 最大容量 | 2TB | 8ZiB |
| 分区数量 | 4个主分区 | 128个 |
| 适用场景 | 旧系统、BIOS | 新系统、UEFI |

```bash
# fdisk 交互示例
fdisk /dev/sdb
# n → 新建分区 → p(主分区) → 1(编号) → 默认起始 → +10G(大小) → w(保存)

# parted 示例
parted /dev/sdb mklabel gpt
parted /dev/sdb mkpart primary ext4 1MiB 10GiB
```

### 7.3 文件系统管理

```bash
# 格式化
mkfs.ext4 /dev/sdb1                    # ext4格式
mkfs.xfs /dev/sdb1                     # xfs格式
mkfs.vfat /dev/sdb1                    # FAT32格式

# 挂载
mount /dev/sdb1 /mnt/data              # 临时挂载
umount /mnt/data                       # 卸载
mount -o ro /dev/sdb1 /mnt/data        # 只读挂载

# 永久挂载 /etc/fstab
echo '/dev/sdb1 /mnt/data ext4 defaults 0 2' >> /etc/fstab
mount -a                               # 验证fstab配置

# UUID挂载（推荐，设备名可能变化）
blkid /dev/sdb1                        # 获取UUID
echo 'UUID=xxxx /mnt/data ext4 defaults 0 2' >> /etc/fstab
```

### 7.4 LVM 逻辑卷管理

| 概念 | 说明 | 类比 |
|------|------|------|
| PV（Physical Volume） | 物理磁盘/分区 | 砖块 |
| VG（Volume Group） | PV的集合 | 砖墙 |
| LV（Logical Volume） | 从VG划分的逻辑分区 | 从墙上切下的块 |

```bash
# 创建流程：PV → VG → LV → 格式化 → 挂载
pvcreate /dev/sdb1 /dev/sdc1                # 创建物理卷
vgcreate myvg /dev/sdb1 /dev/sdc1           # 创建卷组
lvcreate -L 10G -n mylv myvg               # 创建逻辑卷
lvcreate -l 100%FREE -n mylv myvg          # 使用所有剩余空间
mkfs.ext4 /dev/myvg/mylv                   # 格式化
mount /dev/myvg/mylv /mnt/data             # 挂载

# 扩容
lvextend -L +5G /dev/myvg/mylv             # 扩大逻辑卷
resize2fs /dev/myvg/mylv                   # ext4在线扩容
xfs_growfs /mnt/data                       # xfs在线扩容

# 查看
pvs / pvdisplay                            # 物理卷信息
vgs / vgdisplay                            # 卷组信息
lvs / lvdisplay                            # 逻辑卷信息
```

### 7.5 RAID 配置

| RAID级别 | 最少磁盘 | 冗余 | 可用容量 | 特点 |
|----------|----------|------|----------|------|
| RAID 0 | 2 | 无 | 100% | 条带化，高性能，无容错 |
| RAID 1 | 2 | 镜像 | 50% | 完全冗余，读取快 |
| RAID 5 | 3 | 分布式奇偶校验 | (N-1)/N | 平衡性能与容错，坏1块 |
| RAID 6 | 4 | 双奇偶校验 | (N-2)/N | 坏2块磁盘 |
| RAID 10 | 4 | 镜像+条带 | 50% | 高性能+冗余 |

```bash
# 使用 mdadm 管理软件RAID
mdadm --create /dev/md0 --level=1 --raid-devices=2 /dev/sdb1 /dev/sdc1
mdadm --detail /dev/md0                   # 查看RAID状态
cat /proc/mdstat                          # 查看RAID状态
mdadm --manage /dev/md0 --add /dev/sdd1   # 添加热备
mdadm --manage /dev/md0 --remove /dev/sdb1 # 移除故障盘
mdadm --stop /dev/md0                     # 停止RAID
```

---

## 常用组合技巧

```bash
# 批量杀进程
ps aux | grep "pattern" | awk '{print $2}' | xargs kill -9

# 批量重命名
for f in *.txt; do mv "$f" "${f%.txt}.md"; done

# 查找大文件
find / -type f -size +100M -exec ls -lh {} \;

# 统计代码行数
find . -name "*.py" | xargs wc -l | tail -1

# 快速HTTP服务器（Python3）
python3 -m http.server 8080

# 实时查看日志
tail -f /var/log/syslog | grep --line-buffered "keyword"

# 磁盘IO监控
iostat -xz 2                               # 每2秒刷新
iotop                                       # 进程级IO监控

# 内存使用排序
ps aux --sort=-%mem | head -20

# 网络抓包
tcpdump -i eth0 port 80 -nn -X
tcpdump -i eth0 host 192.168.1.100 -w capture.pcap
```
