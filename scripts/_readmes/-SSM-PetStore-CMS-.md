# 🐾 JPetStore — SSM PetStore CMS

**SSM（Spring + Spring MVC + MyBatis）宠物商店管理系统**

> 📦 **本仓库为备份存档**：备份自 [anyu999](https://github.com/anyu999/-SSM-PetStore-CMS-) 的原项目，保存最终构建产物与项目说明，供存档与分发使用。

---

## 关于项目

一个功能完整的宠物商店 Web 应用，基于 **SSM 架构**（Spring 5 / Spring MVC / MyBatis 3）开发，覆盖商品展示、购物车、订单、账户管理等电商核心流程。

## 核心功能

| 模块 | 说明 |
|------|------|
| 商品目录 | 分类浏览、商品搜索、多条件筛选 |
| 账户管理 | 用户注册、登录验证、个人资料维护 |
| 购物车 | 商品增删改查、数量调整、实时价格计算 |
| 订单系统 | 订单创建、状态追踪、历史记录查询 |
| 安全机制 | 验证码保护、会话管理、数据校验 |

## 技术栈

- **后端**: Java + Spring 5 + Spring MVC + MyBatis 3
- **前端**: HTML5 + CSS3 + JavaScript
- **数据库**: H2（开发）/ MySQL（生产）
- **构建**: Maven
- **部署**: Tomcat 9.x

## 安装部署

1. 从本仓库 **Releases** 下载 `jpetstore.war`（约 372 MB）
2. 将 war 文件放入 Tomcat 的 `webapps/` 目录
3. 启动 Tomcat：`bin/startup.sh`（或 `bin/startup.bat`）
4. 访问 `http://localhost:8080/jpetstore/`

## 默认账户

| 角色 | 用户名 | 密码 |
|------|--------|------|
| 管理员 | `admin` | `admin` |
| 测试用户 | `j2ee` | `j2ee` |

## 许可证

本项目基于 [Apache License 2.0](License) 开源。

---

*备份存档仓库 · 仅保存构建产物与说明文档*
