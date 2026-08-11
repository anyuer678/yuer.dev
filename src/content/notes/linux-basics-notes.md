---
title: Linux 基础：文件系统、用户与 Shell
date: 2026-06
type: learning
tags: [Linux, 课程笔记]
summary: 开源操作系统课程的 Linux 基础部分：目录标准、权限模型、用户与进程、Shell 入门和脚本进阶，基于课件整理。
---

## 这门课在讲什么

大二下的《开源操作系统》从 Linux 说起：先讲操作系统是什么，再讲文件、用户、进程、网络这些基础概念，最后落到 Shell 和脚本。下面是基础部分的笔记，命令居多，适合当速查表。

## 操作系统与 Linux

操作系统五大功能：进程管理、内存管理、文件系统、设备管理、用户接口。Linux 由 Linus Torvalds 1991 年发布，特点是多用户多任务、网络功能强、可移植（x86/ARM/MIPS）。

发行版分三类：桌面（Ubuntu、Mint、Fedora）、服务器（CentOS、RHEL、Debian）、其他（Arch 滚动更新、Gentoo 源码编译）。开源许可证常见 GPL、BSD、MIT、Apache。

## 文件系统与权限

**FHS 目录标准**：`/bin` 可执行、`/etc` 配置、`/home` 用户家目录、`/dev` 设备、`/proc` 虚拟文件系统（内存中）、`/var` 变动数据、`/usr` 共享只读、`/tmp` 临时、`/opt` 第三方、`/mnt` 挂载点。

文件类型：普通 `-`、目录 `d`、字符设备 `c`、块设备 `b`、符号链接 `l`、套接字 `s`、管道 `p`。

权限模型：所有者 u / 所属组 g / 其他 o，读写执行 r=4 w=2 x=1，`-rwxr-xr--` 对应数字 `754`。命令 `chmod u+x file`、`chmod 755 file`、`chown user:group file`。

特殊权限：SUID(4000)、SGID(2000，目录下新文件继承组)、Sticky Bit(1000，仅所有者可删，如 `/tmp`)。

常用操作：`pwd cd ls mkdir cp mv rm ln`；查看 `cat less head tail`；查找 `find grep locate`。文件系统：Ext2/3/4、XFS、Btrfs；网络文件系统 NFS、SMB/CIFS。

## 用户、进程与网络

**用户**：root(UID 0)、系统用户(1-999)、普通用户(≥1000)。配置文件 `/etc/passwd`、`/etc/shadow`（加密密码）、`/etc/group`。命令 `useradd -m -s`、`usermod -L/-U`、`userdel -r`、`passwd`、`su`、`sudo`（配置 `/etc/sudoers`）。

**进程**：`ps aux` / `ps -ef`（STAT 含 Z 僵尸）、`top`、`pstree`、`pgrep`、`kill -9/-15`、`nice/renice`（-20~19）、`nohup &`、`jobs/fg/bg`。创建机制 fork/exec/wait。

**网络**：配置文件 `/etc/hostname`、`/etc/hosts`、`/etc/resolv.conf`。命令 `ip addr/route`、`ping`、`traceroute`、`netstat -ant`、`ss -tulw`、`dig/nslookup`、`curl`、`wget`、`ssh -p`、`scp`、`sftp`。防火墙：`iptables -A INPUT -p tcp --dport 22 -j ACCEPT`、`firewall-cmd --permanent --add-port=80/tcp`。

## Shell 入门

Shell 种类：bash（默认）、sh、csh、zsh、fish；`echo $SHELL` 查看、`chsh -s` 切换。命令格式「命令 [选项] [参数]」；`type` / `which` 看类型。

快捷键：Ctrl+C 终止、Ctrl+R 历史搜索、Ctrl+A/E 行首/行尾、Tab 补全。

变量：环境变量 PATH/HOME/PS1；位置变量 $0-$9；特殊变量 `$#`、`$?`、`$$`、`$!`；定义时等号两边不能有空格；`export`、`unset`、`readonly`。

引号：双引号展开变量、单引号原样保留、反引号/`$()` 命令替换。通配符：`* ? [a-z] [!1] {1,2,3}`。

重定向与管道：`> >> 2>&1`、`&>`、`<`、`<< EOF`、`command1 | command2`。执行控制：`; && ||`；历史 `history`、`!!`、`!n`；别名 `alias ll='ls -l'` 写入 `~/.bashrc`。

## Shell 脚本进阶

执行三种方式：`chmod +x && ./script.sh`、`bash script.sh`、`source script.sh`（当前 shell 执行）。

变量扩展：`${#var}` 长度、`${var:offset:length}` 截取、`${var:-default}` 默认值、`${var//pattern/repl}` 替换。数组：`array=(v1 v2)`、`${array[*]}`、`${#array[@]}` 长度、`array+=(new)`。

运算：`$((...))`、`let`、`expr 2 \* 3`；比较 `-eq -gt -le`；文件测试 `-e -f -d -r -x`。流程控制：`if/elif/else/fi`、`case ... esac`、`for/while/until`、`select` 菜单；`break/continue/exit`。

函数：`func(){}`、参数 $1-$9、`local` 局部变量、`return`（0-255）。调试：`bash -n/-v/-x`、`set -e`（出错退出）、`set -u`、`set -o pipefail`。

文本处理：`cut -d: -f1 /etc/passwd`、`sort -n`、`uniq -c`、`wc -l`、`tee`、`xargs`；`grep -E`、`sed 's/old/new/g' -i`、`awk -F: '{print $1}'`。

## 速查表（易混点）

| 对比 | 一句话 |
|---|---|
| SUID vs SGID vs Sticky | 提权 / 继承组 / 防删 |
| `$?` vs `$$` vs `$!` | 上条退出码 / 当前 PID / 后台任务 PID |
| 双引号 vs 单引号 | 展开变量 vs 原样保留 |
| `>` vs `>>` vs `2>&1` | 覆盖 / 追加 / 错误并入标准输出 |
| `&&` vs `;` | 前成功才执行 vs 无条件执行 |
| `bash script` vs `source script` | 子 shell 执行 vs 当前 shell 执行 |
