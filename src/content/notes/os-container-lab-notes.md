---
title: 操作系统实验二：Docker、Nginx 与 K8s 部署链路
date: 2026-06
type: learning
tags: [Linux, Docker, Kubernetes, 实验]
summary: 开源操作系统实验二记录：从 Docker 容器化、Compose 多容器编排，到 Tomcat 集群 + Nginx 负载均衡，再到 K8s 基础环境搭建的实验笔记。
---

## 实验内容

《开源操作系统》实验二，主题是容器化与编排部署。按实验指导书走了一条完整链路：**安装 Docker → 编写 Dockerfile 容器化项目 → Compose 构建多容器集群 → 部署多 Tomcat 节点 → Nginx 负载均衡 → 安装 Kubernetes 基础环境**。

## 第一步：Docker 环境

安装并配置本地 Docker 环境。验证：`docker version`、`docker info`；拉镜像加速可以配 `/etc/docker/daemon.json` 的 registry-mirrors。这一步主要是把 Docker 装好、跑通 `hello-world`。

## 第二步：Dockerfile 容器化

把课程项目环境容器化，写一个基础 Dockerfile：

```dockerfile
FROM openjdk:8-jre
COPY app.war /usr/local/tomcat/webapps/
EXPOSE 8080
CMD ["catalina.sh", "run"]
```

要点：`FROM` 选基础镜像，`COPY` 把构建产物放进去，`EXPOSE` 声明端口。构建 `docker build -t myapp:v1.0 .`。

## 第三步：Compose 多容器编排

用 `docker-compose.yml` 构建多容器集群，常见组合是应用容器 + 数据库容器：

```yaml
services:
  app:
    build: .
    ports:
      - "8080:8080"
    depends_on:
      - db
  db:
    image: mysql:5.7
    environment:
      MYSQL_ROOT_PASSWORD: root
    volumes:
      - dbdata:/var/lib/mysql
volumes:
  dbdata:
```

命令：`docker-compose up -d` 启动、`docker-compose ps/logs -f` 查看、`down -v` 连带删卷。要点：`depends_on` 控制启动顺序，命名卷持久化数据。

## 第四步：Tomcat 集群

部署多 Tomcat 节点，修改端口避免冲突。常见做法是同一镜像跑多个容器，映射不同宿主机端口：

```bash
docker run -d -p 8081:8080 --name tomcat1 myapp:v1.0
docker run -d -p 8082:8080 --name tomcat2 myapp:v1.0
```

这样得到两个应用节点，为下一步负载均衡做准备。

## 第五步：Nginx 负载均衡

Nginx 做反向代理 + 负载均衡，把请求分发到两个 Tomcat 节点：

```nginx
upstream tomcat_cluster {
    server 127.0.0.1:8081;
    server 127.0.0.1:8082;
}

server {
    listen 80;
    location / {
        proxy_pass http://tomcat_cluster;
    }
}
```

验证：连续访问 Nginx 端口，观察请求被轮询分发到不同节点；停掉一个节点再访问，确认另一节点仍能服务（配合 `max_fails` 自动摘除）。

## 第六步：Kubernetes 基础环境

安装 Kubernetes 基础环境，这一步只搭环境不做应用编排。要点：kubeadm 初始化集群、kubelet/kube-proxy 组件、`kubectl get nodes` 验证节点 Ready。

## 实验收获

- Docker 的镜像分层 + 容器可写层模型，理解了"一次构建到处运行"
- Compose 用声明式 yaml 管理多容器，比一个个 `docker run` 清晰
- 负载均衡不是玄学：upstream + proxy_pass 三行配置就能把流量分到多个后端，配合健康检查能自动摘除故障节点
- 从 Docker 单机 → Compose 编排 → 集群 + 负载均衡 → K8s，是一条递进的学习路径，后面学编排就不会觉得 K8s 突兀
