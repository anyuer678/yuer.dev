---
title: Linux 系统安全与防火墙：umask、特殊权限、SELinux 与 iptables
date: 2026-06
type: learning
tags: [Linux, 安全, 课程笔记]
summary: 开源操作系统课程的安全部分：umask 默认权限、SUID/SGID/Sticky 特殊权限、ACL 与 SELinux 强制访问控制、iptables 四表五链和 firewalld，基于课件整理。
---

## 文件默认权限：umask

新建文件的默认权限由 umask 决定，规则是「默认值减去掩码」：

- 文件默认 = 666 − umask；目录默认 = 777 − umask
- 常见值：`022` → 文件 644 / 目录 755（系统默认）；`027` → 640 / 750；`077` → 600 / 700（最严格）

```bash
umask        # 查看
umask 027    # 设置
```

## 特殊权限：SUID / SGID / Sticky

- **SUID（4000）**：对可执行文件设置后，执行时进程获得文件所有者的权限。典型例子 `/usr/bin/passwd`——普通用户靠它才能改自己的密码。字符表示是 `s` 出现在 owner 的 x 位：`-rwsr-xr-x`
- **SGID（2000）**：对文件，执行时获得所属组权限；对目录，新文件自动继承目录的组
- **Sticky（1000）**：只对目录有效，目录内文件只能被文件所有者（或 root）删除，典型例子 `/tmp`

```bash
chmod u+s file    # SUID
chmod 4755 file   # 数字方式
chmod 2770 dir    # SGID
chmod +t /tmp     # Sticky
```

查看特殊权限：`ls -l` 里小写 `s`/`t` 表示同时有执行权，大写 `S`/`T` 表示没有执行权。

## ACL 访问控制列表

当基础的 ugo 权限不够用时，ACL 可以对单个用户或组单独授权：

```bash
setfacl -m u:alice:rw file    # 给 alice 读+写
setfacl -m g:dev:r file       # 给 dev 组读
setfacl -x u:alice file       # 移除
getfacl file                  # 查看
```

设置 ACL 后 `ls -l` 权限位末尾会出现 `+` 号。

## SELinux：从 DAC 到 MAC

传统 Linux 权限是 **DAC**（自主访问控制）——文件所有者自己决定谁能访问；**SELinux** 是 **MAC**（强制访问控制）——由系统策略统一决定，即使文件权限是 777，进程类型不匹配照样被拒。

- 安全上下文格式 `identify:role:type`，其中 **type 最关键**（如 `httpd_t`、`etc_t`）
- 三种模式：`Enforcing`（强制）/ `Permissive`（只记录不阻止）/ `Disabled`

```bash
ls -Z / ps -Z / id -Z    # 查看上下文
chcon -t type file       # 临时改
restorecon -Rv /path     # 恢复默认
setenforce 0             # 临时切到 Permissive
```

排查经验：装了 Nginx 却访问 403，先看 `getenforce` 和 `setsebool -P httpd_can_network_connect on`，很多「诡异权限问题」是 SELinux 布尔值导致的。

## 防火墙：iptables 与 firewalld

Linux 防火墙内核框架叫 **Netfilter**，用户态工具从 iptables 演进到 nftables → firewalld（CentOS 7+），Ubuntu 用 ufw。

**iptables 四表五链**（按优先级 raw → mangle → nat → filter）：

| 链 | 时机 |
|---|---|
| PREROUTING | 数据包进入路由决策前 |
| INPUT | 进入本机 |
| FORWARD | 经本机转发 |
| OUTPUT | 本机发出 |
| POSTROUTING | 离开前 |

常用操作：

```bash
iptables -A INPUT -p tcp --dport 80 -j ACCEPT
iptables -A INPUT -s 192.168.1.0/24 -j ACCEPT
iptables -A INPUT -j DROP        # 默认拒绝放最后
iptables -I INPUT 1 -p tcp --dport 22 -j ACCEPT   # 插到最前
```

动作：`ACCEPT` / `DROP`（直接丢弃）/ `REJECT`（返回错误）；`SNAT` / `DNAT` / `MASQUERADE` 做地址转换。

**firewalld** 用 zone 管理，规则分临时（重启失效）和永久（`--permanent`）：

```bash
firewall-cmd --add-port=80/tcp --permanent
firewall-cmd --add-service=http --permanent
firewall-cmd --reload
```

**ufw**（Ubuntu）：`ufw allow 22`、`ufw allow from 192.168.1.0/24`、`ufw enable`。

## 易混点

- `DROP` vs `REJECT`：DROP 让客户端傻等超时，REJECT 立刻报错；公网防扫描多用 DROP
- DAC 看「谁拥有文件」，MAC 看「系统策略允许什么」
- umask 是减法不是加法：`umask 022` 不代表开放 022 权限
