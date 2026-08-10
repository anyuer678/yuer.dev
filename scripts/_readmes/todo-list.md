# 航海日志 · Todo List

[![GitHub Pages](https://img.shields.io/badge/%F0%9F%8C%90-%E5%9C%A8%E7%BA%BF%E9%A2%84%E8%A7%88-2ea44f)](https://anyuer678.github.io/todo-list/)
> ⚠️ **在线预览功能受限**：本地通知提醒、数据持久化存储、系统托盘等功能在 GitHub Pages 静态环境下不可用。建议下载安装包以获得完整体验。

**轻量级个人待办事项应用** — 最终版

集待办管理、番茄钟、统计于一体，支持 Web、Windows、Android 三端。提供简洁高效的待办管理体验，帮助用户高效规划每日任务。

## 功能特性

### 核心功能
- **今日视图** — 逾期提醒、统计概览，一目了然掌握今日任务
- **收件箱** — 快速记录想法，随时捕捉灵感
- **星标事项** — 重要任务标记，优先处理关键事项
- **任务管理** — 优先级设置、重复任务、批量操作

### 效率工具
- **番茄钟** — 专注计时，提升工作效率
- **本地通知提醒** — 重要事项不遗漏
- **数据备份/恢复** — 数据安全无忧

### 界面与体验
- **多主题切换** — 纸纹/风景/水墨等丰富背景，暗色主题专属配色
- **系统托盘** — Windows 悬浮窗快捷操作
- **响应式设计** — 适配桌面和移动端

## 快速开始

### 方式一：直接运行（推荐）
```bash
# 启动本地服务器
npx http-server www -p 8080

# 或使用 PowerShell 脚本
.\start.ps1
```

访问 http://localhost:8080 查看应用

### 方式二：开发模式
```bash
# 安装依赖（可选，用于构建）
npm install

# 启动开发服务器
npm run dev
```

## 构建

### 交互式构建
```bash
.\build.ps1    # 交互式选择构建目标
```

### 命令行构建
```bash
npm run build:www    # 构建 Web 版本（www 目录已就绪）
npm run build:apk    # 构建 Android APK
npm run build:exe    # 构建 Windows 便携版 EXE
npm run build:all    # 构建全部平台
```

### 构建产物
- **Web**: `www/` — 可直接部署到任意静态服务器
- **Windows**: `electron/dist-build/TodoList-便携版.exe` — 无需安装，双击运行
- **Android**: `android/app/build/outputs/apk/` — 需签名后安装

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端 | HTML5 / CSS3 / JavaScript (ES6+) |
| 桌面端 | Electron + electron-builder |
| 移动端 | Capacitor (Android) |
| 数据存储 | localStorage |

## 平台支持

| 平台 | 格式 | 状态 |
|------|------|------|
| Web | HTML/CSS/JS | ✅ 完整支持 |
| Windows | EXE 便携版 | ✅ 完整支持（系统托盘） |
| Android | APK | ✅ 完整支持 |

## 项目结构

```
todolist/
├── www/                    # Web 前端源码
│   ├── index.html          # 入口 HTML
│   ├── app.js              # 主应用逻辑
│   ├── components.css      # 组件样式
│   ├── mobile.css          # 移动端适配
│   ├── icons/              # 图标资源
│   └── locales.json        # 国际化配置
├── electron/               # Electron 主进程
│   ├── main.js             # 主进程入口
│   └── preload.js          # 预加载脚本
├── android/                # Android 工程（Capacitor）
├── assets/                 # 图标资源
├── docs/                   # 项目文档
├── package.json            # 项目配置
├── capacitor.config.json   # Capacitor 配置
├── start.ps1               # 开发启动脚本
└── build.ps1               # 构建脚本
```

## 开发状态

> **当前状态**：后续将更换全新 UI 和架构，进行彻底重构。

## 已知问题

- 部分功能在移动浏览器上可能受限
- localStorage 存储有容量限制

## 免责声明

本项目仅供学习交流与演示用途，不构成任何形式的商业服务或技术承诺。软件按「现状」提供，不作任何明示或暗示的保证。如您在使用过程中发现缺陷或问题，欢迎通过 [GitHub Issues](../../issues) 反馈，但作者不因使用本软件所直接或间接产生的任何损失承担责任。

## 开源协议

本项目基于 [GNU General Public License v3.0](LICENSE) 开源。

### 协议要点
- ✅ 自由使用、修改、分发
- ⚠️ 衍生作品必须以相同许可证 (GPL v3) 开源
- ❌ 禁止闭源商业化
