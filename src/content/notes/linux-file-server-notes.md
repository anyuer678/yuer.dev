---
title: Linux 文件服务器与 Nginx 进阶：NFS、Samba、FTP 与 HTTPS 负载均衡
date: 2026-06
type: learning
tags: [Linux, Nginx, 网络服务, 课程笔记]
summary: 开源操作系统课程的服务部分：NFS 网络文件共享、Samba 与 Windows 互通、vsftpd 主动/被动模式，以及 Nginx HTTPS 配置、负载均衡策略与一致性哈希，基于课件整理。
---

## NFS：Linux 之间的文件共享

NFS 把远程目录挂载到本地，像本地文件一样用。服务端导出目录，客户端挂载。

```bash
# 服务端：编辑 /etc/exports
/shared 192.168.1.0/24(rw,sync,no_root_squash)

exportfs -r        # 重载导出
systemctl start nfs-server

# 客户端
mount -t nfs server:/shared /mnt/nfs
```

常用选项：`rw/ro`（读写/只读）、`sync`（同步写盘）、`no_root_squash`（保留 root 权限，慎用）。开机自动挂载写 `/etc/fstab`，或用 autofs 按需挂载。

## Samba：Linux 与 Windows 文件互通

Samba 是 SMB/CIFS 协议的开源实现。组件分两个：`smbd`（文件/打印共享，TCP 139/445）和 `nmbd`（NetBIOS 名称解析，UDP 137/138）。

- SMB 版本：SMB1 旧版漏洞多（WannaCry 就是利用它），用 SMB2/SMB3
- 配置在 `/etc/samba/smb.conf`，核心是 `[global]` + 各共享段

```ini
[shared]
    path = /samba/shared
    writable = yes
    valid users = @smbgroup
```

```bash
smbpasswd -a smbuser          # 添加 Samba 用户（需系统用户先存在）
smbclient //server/shared -U user
mount -t cifs //server/shared /mnt/samba -o username=user
```

## vsftpd：FTP 主动与被动模式

FTP 有两个连接：**控制连接（TCP 21）**和**数据连接**。数据连接的建立方式区分两种模式：

| 模式 | 数据连接方向 | 适用场景 |
|---|---|---|
| 主动 PORT | 服务器:20 → 客户端 | 服务器有公网 IP |
| 被动 PASV | 客户端 → 服务器随机端口 | 客户端在 NAT 后 |

防火墙后面部署必须用被动模式，并放行 `pasv_min_port`~`pasv_max_port` 区间的端口。

```ini
# /etc/vsftpd/vsftpd.conf 关键项
anonymous_enable=NO      # 禁匿名
local_enable=YES
chroot_local_user=YES    # 限制用户在家目录
pasv_enable=YES
pasv_min_port=30000
pasv_max_port=31000
```

## Nginx HTTPS 配置

HTTPS = HTTP + SSL/TLS，默认 443 端口，证书由 CA 签发。配置要点：

```nginx
server {
    listen 443 ssl;
    server_name example.com;
    ssl_certificate     /etc/nginx/ssl/example.com.crt;
    ssl_certificate_key /etc/nginx/ssl/example.com.key;
    ssl_protocols TLSv1.2 TLSv1.3;     # 别开老版本
    ssl_ciphers HIGH:!aNULL:!MD5;
}

# HTTP 跳 HTTPS
server {
    listen 80;
    return 301 https://$server_name$request_uri;
}
```

自签证书做本地测试：`openssl req -x509 -newkey rsa:2048 -nodes -days 365 ...`。

## Nginx 负载均衡策略

用 `upstream` 定义后端组，`proxy_pass` 转发：

```nginx
upstream backend {
    server 192.168.1.10:8080 weight=3;   # 权重
    server 192.168.1.11:8080;
}
server {
    location / { proxy_pass http://backend; }
}
```

| 策略 | 特点 | 适用 |
|---|---|---|
| 轮询 RR | 默认，按时间轮流 | 后端性能相近 |
| 权重 | 按 weight 比例分配 | 后端性能不同 |
| ip_hash | 同一 IP 固定到同一后端 | 需要会话保持 |
| least_conn | 分给连接数最少的 | 长连接场景 |

## 一致性哈希

传统哈希取模在节点增减时几乎全部 key 要重新映射，缓存命中率骤降。一致性哈希把哈希空间组织成环（0 ~ 2^32−1），节点和数据都映射到环上，数据存到顺时针方向最近的节点——增减节点只影响环上邻近的一小段。

**虚拟节点**解决数据倾斜：每个物理节点在环上放多个虚拟节点，让数据分布更均匀。

## 易混点

- NFS 用于 Linux↔Linux，Samba 用于 Linux↔Windows
- FTP 主动/被动模式看的是**数据连接**谁连谁，不是控制连接
- ip_hash 保的是会话，不是负载均衡均匀性
