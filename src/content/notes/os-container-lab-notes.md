---
title: 把 JPetStore 部署上线：从 Linux 裸机到 K8s 集群
date: 2026-06
type: learning
tags: [Linux, Nginx, Docker, Kubernetes, 部署实践]
summary: 把 JPetStore 用三种方式部署：Linux 裸机 + Nginx、Docker Compose 容器化、Tomcat 集群与 K8s（选做）。踩坑 16 个，大半是环境兼容问题。
---

## 这次做了什么

课程要求搭一套完整的 Web 服务器环境并把前后端分离项目部署上去。我拿 JPetStore（Java Web 项目）当实验对象，先后用三种方式把它跑起来：**Linux 裸机部署 → Docker 容器化 → 分布式集群（选做）**。做完最大的感受是：部署的核心工作不是"执行命令"，而是"解决兼容性问题"。

## 第一条路：Linux 裸机部署

在虚拟机（192.168.33.128）上从零装环境：OpenJDK 17、Git、Node.js 20、Maven、Tomcat 9、Nginx、MySQL、Redis，然后 Git 拉源码 → MySQL 初始化建表 → Maven 打 war 包 → 部署到 Tomcat → Nginx 反向代理。

这部分写了 9 个小任务，最有价值的两个：

**自动化部署脚本**：手动部署要敲几十条命令，错一步从头排查。我把"停服务 → 清缓存 → Maven 构建 → 拷 war 包 → 启动 → 等初始化"写成一个 `deploy_all.sh`，一键完成。这是这次实验里最实用的一步。

**定时备份日志**：用 cron 每天凌晨 2 点把 Tomcat/Nginx 日志打包到 `/data/logs/bak`，同时自动删掉 7 天前的旧包。第一次体会到运维里"无人值守"是怎么实现的。

## 第二条路：Docker 容器化

写了 Dockerfile（openjdk:17-jdk-slim 基础镜像 + war 包 + EXPOSE 8080），再用 docker-compose.yml 编排 **3 个容器**：后端服务、MySQL 8.0、Nginx 反代入口。`docker-compose up -d` 一条命令全部起来，页面和裸机部署完全一致。

这一步让我真正理解了容器化的价值：之前"我本地能跑，虚拟机跑不起来"的环境一致性问题，容器直接打包掉了——项目和依赖一起进镜像，任何机器一键启动。

## 第三条路：分布式集群（选做）

两个方案都做了：

**多 Tomcat + Nginx 负载均衡**：复制 Tomcat 目录做两个节点（改端口 8080/8081 避免冲突），Nginx upstream 轮询分发。验证时用 `ps -ef | grep tomcat` 确认两个进程都在跑，单节点挂了另一个还能服务。

**Docker + K8s 单节点集群**：kubeadm init 建集群 → 移除 master 污点 → Flannel 网络插件 → Deployment 起 3 个 Pod 副本 → Service（NodePort 30080）做统一入口。`kubectl scale --replicas=5` 一条命令扩到 5 个副本。

对比下来：传统集群简单直接，适合中小项目；K8s 除了分发还带扩缩容、故障自愈，是云服务的主流方向。这条演进线（物理机 → 容器 → 云原生）是这次实验额外收获的视野。

## 踩坑记录（16 个问题的归纳）

大部分问题不是代码 bug，而是**环境与项目预期不匹配**：

| 类别 | 问题 | 根因与解法 |
|---|---|---|
| JDK 版本 | war 包部署后页面 404 | 项目要 Java 17，Tomcat 默认 JDK 8，字节码加载失败。装 JDK 17 + setenv.sh 指定 JAVA_HOME |
| 跨平台构建 | Maven 构建报 cmd 不存在 | pom 里 exec 插件绑了 Windows 批处理。加 `-Dmaven.exec.skip=true` 跳过 |
| Nginx 占端口 | 80 端口一直显示欢迎页 | Ubuntu 默认 sites-enabled/default 优先级更高。删掉默认站点 |
| 上下文路径 | 图片/样式 404 裂图 | 项目上下文是 /jpetstore，代理转发到根路径丢了前缀。改首页 302 跳转带完整前缀 |
| 路径叠加 | 加 rewrite 后大面积 404 | rewrite 补前缀 + location 转发叠加成 /jpetstore/jpetstore/。移除 rewrite，拆两条规则 |
| K8s 端口 | kubeadm init 预检失败 | kubelet 提前启动常驻占端口。停用并清理所有 kube 进程后重启 |
| containerd | 版本过高降级警告 | 系统 containerd 比 K8s 1.28 新。init 时 `--cri-socket` 显式指定 |
| docker.sock | 日志刷屏警告 | 只装了 containerd 没装 Docker。init 加 `--cri-socket` 屏蔽 docker 探测 |
| swap | 重启后预检警告 | 只 swapoff -a 没改 /etc/fstab，重启复原。永久注释 fstab 挂载项 |
| 内核网络 | Flannel 装完节点 NotReady | 没加载 overlay/br_netfilter，没配网桥转发。modprobe + sysctl 全局生效 |
| 权限 | docker build 拒绝连接 | 用户没加 docker 组。usermod -aG docker + newgrp |
| 操作 | 终端直接粘贴 YAML 报"未找到命令" | 终端把 apiVersion 当命令执行。vim 建文件再 kubectl apply -f |

还有一个插曲：SFTP 文件服务器方案尝试失败后换了别的方式传文件——"一计不成，再换方法"。

## 我的体会

- **代码能本地跑 ≠ 能部署成功**。环境配置、路径匹配、权限管理这些细节才是生产部署的核心难点
- 排查要按"日志 → 原理 → 根因"走，盲目试错最浪费时间
- 这轮实验时间跨度很大（电脑崩坏重装后环境反复出问题，实验做了很多次），过程中不停查资料、问同学和 AI，攒下的排查经验比结果本身值钱
