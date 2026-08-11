---
title: Linux 服务管理：包管理、systemd、Nginx 与 Docker
date: 2026-06
type: learning
tags: [Linux, Nginx, Docker, 课程笔记]
summary: 开源操作系统课程的服务器部分：软件包与磁盘、systemd 服务与定时任务、Nginx 反向代理负载均衡、Docker 容器化，基于课件整理。
---

## 软件包管理

两大体系：RPM（CentOS/RedHat）和 DEB（Debian/Ubuntu），Arch 用 Pacman。

- RPM：`rpm -ivh` 安装、`-qa` 查询、`-ql/-qf/-qc` 看文件列表/归属/配置、`-e` 删除
- YUM/DNF：`yum install/remove/provides`，仓库配置 `/etc/yum.repos.d/*.repo`（含 gpgcheck）
- DPKG/APT：`dpkg -i/-r/-P`；`apt update/install/upgrade/autoremove`，源在 `/etc/apt/sources.list`

## 磁盘、LVM 与 RAID

磁盘命名：`/dev/sda`、`/dev/nvme0n1`。MBR（最多 4 主分区、≤2TB）vs GPT（≤128 分区）。

流程：`fdisk`（n/p/e/d/w）→ `mkfs.ext4` → `mount` → 写 `/etc/fstab`（设备 挂载点 类型 选项 转储 检查）；`blkid` 查 UUID；swap 用 `mkswap/swapon`，`free -h` 查看。

LVM：`pvcreate` → `vgcreate` → `lvcreate -L 10G -n`，扩容 `vgextend/lvextend/resize2fs`。

RAID：0 条带 / 1 镜像 / 5 奇偶校验 / 10；`mdadm --create /dev/md0 --level=5 --raid-devices=3`，查看 `cat /proc/mdstat`。

## 日志

rsyslog 配置 `/etc/rsyslog.conf`，级别 emerg→debug；文件 `/var/log/messages`、`/var/log/secure`。`journalctl -u -f -n 50 -p err --since`；`tail -f`、`dmesg`；logrotate 配置 `/etc/logrotate.d/`（daily/rotate 7/compress）。

## 进程与服务管理（systemd）

进程生命周期：创建(fork)→就绪→运行→阻塞→终止；`ulimit -a`、`-n` 文件描述符，持久化 `/etc/security/limits.conf`。

信号：SIGHUP 1（重载配置）、SIGINT 2、SIGKILL 9、SIGTERM 15；`kill -l` 查看。

systemd 单元：`.service/.socket/.target/.timer`；命令 `systemctl start/stop/restart/reload/status/enable/disable/daemon-reload`；目标切换 `multi-user.target`、`graphical.target`，`systemctl set-default`。

服务文件三段：

```ini
[Unit]
Description=...
After=network.target

[Service]
Type=simple
ExecStart=/usr/bin/myapp
Restart=on-failure
User=myuser

[Install]
WantedBy=multi-user.target
```

定时任务 cron：`crontab -e/-l/-r`，格式「分 时 日 月 周 命令」，示例 `*/10 * * * *`、`0 2 * * 1,3,5`；系统目录 `/etc/cron.daily/`。一次性任务 `at now + 5 minutes`、`atq/atrm`；systemd 定时器 `.timer` 文件 `OnCalendar=daily`、`systemctl list-timers`。

## Nginx：虚拟主机与反向代理

特点：事件驱动/异步非阻塞、高并发低内存。安装 `yum/apt install nginx` + `systemctl enable --now nginx`；源码编译 `./configure --with-http_ssl_module` → `make && make install`。

nginx.conf 三段式：全局块（`worker_processes auto`、`error_log`）、events 块（`worker_connections`、`use epoll`）、http 块（`include mime.types`、`gzip on`）。

虚拟主机三种：按域名 `server_name`、按端口 `listen`、按 IP。location 匹配优先级：`=` 精确 > `^~` 前缀 > `~`/`~*` 正则 > 无修饰符最长前缀。`root`（路径拼接）vs `alias`（替换）；`try_files $uri $uri/ /index.php`。

反向代理与负载均衡：

```nginx
upstream backend {
    server 127.0.0.1:8080 weight=3;
    server 127.0.0.1:8081 max_fails=3 fail_timeout=30s;
    ip_hash;
}

server {
    listen 80;
    location / {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

负载均衡算法：轮询（默认）、weight 加权轮询、ip_hash（会话保持）、least_conn（最小连接）、fair（响应时间）。upstream 健康检查：`max_fails` 失败次数 + `fail_timeout` 窗口 + `backup` 备用机，被动探测失败自动摘除。

**Nginx 缓存**：`proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=mycache:10m max_size=1g inactive=60m` 定义缓存目录与共享内存；location 里 `proxy_cache mycache;` 启用、`proxy_cache_valid 200 302 10m;` 按状态码设有效期、`proxy_cache_key` 自定义键（默认 scheme+host+uri）、`add_header X-Cache-Status $upstream_cache_status` 查看命中状态；清除缓存 `rm -rf /var/cache/nginx/*` 或加 `proxy_cache_purge`（需第三方模块）。

SSL：`listen 443 ssl http2`、`ssl_certificate`/`ssl_certificate_key`、`ssl_protocols TLSv1.2 TLSv1.3`；HTTP 跳 HTTPS `return 301`；certbot 免费证书 `certbot --nginx -d example.com`。

重写：`rewrite ^/article/(\d+)\.html$ /article.php?id=$1 last;`，flag 为 last/break/redirect/permanent。安全：`server_tokens off` 隐藏版本、`limit_req_zone rate=1r/s` 限流、`valid_referers` 防盗链。

常用命令：`nginx -t` 语法检查、`-s reload/stop/quit`、`-v/-V`。

## Docker 容器化

核心概念：镜像（只读分层模板）、容器（运行实例，可写层）、仓库（Docker Hub / 私有 Harbor）。容器 vs 虚拟机：进程级隔离、共享宿主机内核、秒级启动。

镜像：`docker pull/images/tag/rmi/save -o/load -i`；加速器 `/etc/docker/daemon.json` 的 registry-mirrors。容器：`docker run -d -p 8080:80 -v /host:/container -e KEY=value --memory=512m`；`exec -it`、`logs -f`、`stats`、`cp`。

Dockerfile 指令：FROM/RUN/CMD/ENTRYPOINT/COPY/ADD（自动解压 tar）/WORKDIR/EXPOSE/ENV/USER/VOLUME；`docker build -t myapp:v1.0 .`。镜像优化：多阶段构建 `COPY --from=builder /app/myapp .`、alpine 基础镜像、合并 RUN 减少层。

网络模式：bridge（默认）/host/none/container；`docker network create/connect`。数据卷：命名卷、匿名卷、绑定挂载；`docker volume ls/create/inspect`。

Compose：`docker-compose.yml`（services/ports/volumes/depends_on/networks）；命令 `up -d`、`down -v`（连带删卷）、`ps/logs -f/exec`。

## 速查表

| 对比 | 一句话 |
|---|---|
| RPM vs DEB | CentOS 系 vs Debian 系包格式 |
| MBR vs GPT | 4 主分区 ≤2TB vs 128 分区大磁盘 |
| LVM vs RAID | 逻辑卷可扩容 vs 磁盘阵列冗余/提速 |
| `proxy_pass` vs `alias` | 转发到后端 vs 替换路径 |
| 镜像 vs 容器 | 只读模板 vs 可写运行实例 |
| `docker run -d` vs `exec -it` | 后台启动 vs 进入容器交互 |
