---
title: 开源操作系统
date: 2025-12
tags: [Linux, Shell, Nginx, Docker]
summary: 开源操作系统课程（Linux）：12 章笔记覆盖 Linux 概述、文件系统、Shell 编程、进程管理、Nginx Web 服务器、Docker 容器化。
---

## 背景

大二下学期课程，系统学习 Linux 操作系统：从开源协议到 Shell 编程，从文件权限到 Nginx 配置，从进程管理到 Docker 容器化。12 章 PPT + 实验指导书。

## 关键内容

### Linux 基础（CH01-03）

- Linux 发展史：CTSS → Multics → UNICS → UNIX → Minix → Linux
- 开源协议：GPL / GNU / FSF；发行版 CentOS / Ubuntu / openEuler
- 文件系统层级标准（FHS）：/bin /etc /home /var /usr /tmp /proc
- UGO 权限模型：rwx（读/写/执行），chmod / chown / chgrp
- 磁盘与文件系统：MBR / GPT，ext2/ext3/ext4/xfs，inode 索引

### Shell 编程（CH04-05）

- Shell 语法：变量 / 条件 / 循环 / 函数
- 管道与重定向：`|` / `>` / `>>` / `<`
- 文本处理：grep / sed / awk
- 正则表达式基础

### 系统管理（CH06-07）

- 软件包管理：apt / yum / rpm
- 进程管理：ps / top / kill / systemctl
- 计划任务：crontab（分钟→月→星期→命令）
- 日志管理：rsyslog / journalctl / logrotate

### Web 服务器（CH08-09）

- Nginx 基础：安装 / 配置 / 虚拟主机
- Nginx 进阶：反向代理 / 负载均衡 / HTTPS / 缓存
- location 匹配规则：`=` > `^~` > `~` > `/`

### 容器化（CH10-12）

- Docker 基础：镜像 / 容器 / 仓库
- Dockerfile：构建自定义镜像
- Docker Compose：多容器编排
- 云原生基础：Kubernetes 概念

## 实验

- 实验一：Linux 基础命令与文件系统
- 实验二：Shell 编程与系统管理

## 来源

- 课程 PPT（12 章）：`D:\大二上及下的备份\材料\Linux\`
- 章节笔记（10 篇 markdown）：`D:\大二上及下的备份\材料\大二下\Linux笔记\`
- 总结笔记：`D:\大二上及下的备份\材料\开源操作系统_总结_目录版.md`
