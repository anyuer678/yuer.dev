# CodeDrill

[![GitHub Pages](https://img.shields.io/badge/%F0%9F%8C%90-%E5%9C%A8%E7%BA%BF%E9%A2%84%E8%A7%88-2ea44f)](https://anyuer678.github.io/codedrill/)
> ⚠️ **在线预览功能受限**：部分交互（如离线训练数据持久化、TTS 语音合成、Android/iOS 原生功能）在 GitHub Pages 静态环境下不可用。建议下载安装包以获得完整体验。

**离线编程训练系统** — 最终版

支持 Web、Windows、Android 三端运行。通过代码临摹、填空、改错等训练模式，帮助开发者形成编程肌肉记忆。

## 功能特性

### 训练模式
- **代码临摹** — 照抄代码，熟悉语法结构和代码风格
- **代码填空** — 填写缺失的代码部分，强化记忆
- **改错练习** — 找出并修复代码错误，提升调试能力

### 支持语言
Java、Python、C++、JavaScript、TypeScript、Linux Shell、SQL

### 训练模块
循环、条件判断、数组操作、字符串处理、函数调用

### 界面与主题
- 22 种浅色主题（纯色/渐变/纸纹/水墨风格）
- 响应式设计，适配桌面和移动端

### 学习体系
- **成就系统** — 完成特定目标解锁成就
- **技能树** — 可视化技能掌握进度
- **遗忘曲线复习** — 基于艾宾浩斯曲线智能复习

## 快速开始

### 环境要求
- Node.js >= 18.0.0
- npm 或 yarn

### 安装与运行
```bash
# 克隆项目
git clone <repository-url>
cd codedrill

# 安装依赖
npm install

# 启动开发服务器
npm run dev
# 或使用 PowerShell 脚本
.\start.ps1
```

访问 http://localhost:3000 查看应用

## 构建

### 交互式构建
```bash
.\build.ps1    # 交互式选择构建目标
```

### 命令行构建
```bash
npm run build:www    # 构建 Web 版本 → dist/web/
npm run build:apk    # 构建 Android APK
npm run build:exe    # 构建 Windows 便携版 EXE
npm run build:all    # 构建全部平台
```

### 构建产物
- **Web**: `dist/web/` — 可直接部署到任意静态服务器
- **Windows**: `dist/electron-build/CodeDrill-便携版.exe` — 无需安装，双击运行
- **Android**: `android/app/build/outputs/apk/` — 需签名后安装

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端框架 | Vue 3 |
| 状态管理 | Pinia |
| 路由 | Vue Router |
| 构建工具 | Vite |
| 桌面端 | Electron + electron-builder |
| 移动端 | Capacitor (Android) |
| 测试 | Vitest |

## 平台支持

| 平台 | 格式 | 状态 |
|------|------|------|
| Web | HTML/CSS/JS | ✅ 完整支持 |
| Windows | EXE 便携版 | ✅ 完整支持 |
| Android | APK | ✅ 完整支持 |

## 项目结构

```
codedrill/
├── src/                    # Vue 3 前端源码
│   ├── views/              # 页面组件（首页、训练、统计等）
│   ├── stores/             # Pinia 状态管理（题目、进度、设置）
│   ├── components/         # 通用组件（卡片、按钮、弹窗等）
│   ├── design-system/      # 设计系统（主题、颜色、字体）
│   ├── router/             # 路由配置
│   ├── data/               # 静态数据
│   └── lib/                # 工具函数
├── core/                   # 题库数据
│   ├── questions/          # 225 道内置题目
│   └── bosses/             # Boss 关卡数据
├── public/                 # 静态资源（主题图、图标）
├── electron/               # Electron 主进程
│   ├── main.js             # 主进程入口
│   └── preload.js          # 预加载脚本
├── android/                # Android 工程（Capacitor）
├── dist/                   # 构建输出
│   ├── web/                # Web 构建产物
│   └── electron-build/     # Windows 构建产物
├── scripts/                # 辅助脚本
├── docs/                   # 项目文档
├── index.html              # 入口 HTML
├── vite.config.js          # Vite 配置
├── electron-builder.config.mjs  # Electron 打包配置
├── package.json            # 项目配置
├── start.ps1               # 开发启动脚本
└── build.ps1               # 构建脚本
```

## 开发状态

> **当前状态**：历史记录功能暂缓开发。后续将更换全新 UI 和架构，进行彻底重构。

## 已知问题

- 某些主题图片在构建时未正确解析，运行时动态加载
- Electron 版本未配置应用图标，使用默认图标

## 免责声明

本项目仅供学习交流与演示用途，不构成任何形式的商业服务或技术承诺。软件按「现状」提供，不作任何明示或暗示的保证。如您在使用过程中发现缺陷或问题，欢迎通过 [GitHub Issues](../../issues) 反馈，但作者不因使用本软件所直接或间接产生的任何损失承担责任。

## 开源协议

本项目基于 [GNU General Public License v3.0](LICENSE) 开源。

### 协议要点
- ✅ 自由使用、修改、分发
- ⚠️ 衍生作品必须以相同许可证 (GPL v3) 开源
- ❌ 禁止闭源商业化
