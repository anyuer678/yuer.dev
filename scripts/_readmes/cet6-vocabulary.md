# CET-6 词汇学习

[![GitHub Pages](https://img.shields.io/badge/%F0%9F%8C%90-%E5%9C%A8%E7%BA%BF%E9%A2%84%E8%A7%88-2ea44f)](https://anyuer678.github.io/cet6-vocabulary/)
> ⚠️ **在线预览功能受限**：TTS 离线发音引擎、语音识别、IndexedDB 持久化存储等功能在 GitHub Pages 静态环境下受限。建议下载安装包以获得完整体验。

**英语六级词汇背诵系统** — 最终版

包含 CET-6 考试大纲全部 5023 个单词，支持 Web、Windows、Android 三端。提供背诵、默写、回忆、选择题、错词本等多种学习模式，带完整动画、发音与彩色主题。

## 功能特性

### 核心学习模式
- **单词背诵** — 卡片式浏览，支持英式/美式发音切换
- **单词默写** — 根据释义与音标拼写单词，强化记忆
- **回忆训练** — 释义猜词、单词配对、听写练习、限时闯关
- **选择题** — 四选一释义选择，模拟考试场景

### 辅助功能
- **错词本** — 自动记录错误单词，支持针对性复习
- **学习统计** — 掌握进度、学习量、排行榜、打卡记录
- **番茄钟** — 专注学习计时，提高效率
- **笔记系统** — 每个单词可添加个人笔记
- **发音设置** — TTS 离线引擎、口音/语速调节

### 界面与主题
- 16 种彩色主题（支持深色/浅色模式）
- 完整动画效果，流畅交互体验
- 响应式设计，适配桌面和移动端

## 快速开始

### 方式一：直接运行（推荐）
```bash
# 启动本地服务器
npx http-server . -p 8080

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
npm run build:www    # 构建 Web 版本（文件已就绪，无需构建）
npm run build:apk    # 构建 Android APK
npm run build:exe    # 构建 Windows 便携版 EXE
npm run build:all    # 构建全部平台
```

### 构建产物
- **Web**: `www/` — 可直接部署到任意静态服务器
- **Windows**: `electron/release/CET-6词汇学习-便携版.exe` — 无需安装，双击运行
- **Android**: `android/app/build/outputs/apk/` — 需签名后安装

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端 | 原生 HTML / CSS / JavaScript (ES6+) |
| 语音合成 | eSpeak-ng TTS 离线引擎 |
| 桌面端 | Electron + electron-builder |
| 移动端 | Capacitor (Android) |
| 数据存储 | localStorage |

## 平台支持

| 平台 | 格式 | 状态 |
|------|------|------|
| Web | HTML/CSS/JS | ✅ 完整支持 |
| Windows | EXE 便携版 | ✅ 完整支持 |
| Android | APK | ✅ 完整支持 |

## 词库信息

| 词库 | 词汇量 | 说明 |
|------|--------|------|
| CET-6 | 5023 词 | 英语六级考试大纲完整词库 |

## 项目结构

```
word/
├── css/                    # 样式文件
│   ├── app.css             # 主样式
│   ├── themes/             # 16 个主题样式表
│   └── components/         # 组件样式
├── js/                     # 应用脚本
│   ├── app.js              # 主应用逻辑
│   ├── speech.js           # 语音合成模块
│   └── utils/              # 工具函数
├── data/                   # 词库数据
│   └── cet6-words.js       # CET-6 词库（5023 词）
├── phon/                   # 发音音频文件
├── theme-images/           # 主题背景图片
├── electron/               # Electron 主进程
│   ├── main.js             # 主进程入口
│   └── preload.js          # 预加载脚本
├── android/                # Android 工程（Capacitor）
├── scripts/                # 辅助脚本
├── public/                 # 静态资源（图标）
├── docs/                   # 项目文档
├── index.html              # 入口 HTML
├── package.json            # 项目配置
├── start.ps1               # 开发启动脚本
└── build.ps1               # 构建脚本
```

## 开发状态

> **当前状态**：后续将更换全新 UI 和架构，进行彻底重构。

## 已知问题

- 部分发音在某些浏览器上可能不支持
- 大词汇量下首次加载可能较慢

## 免责声明

本项目仅供学习交流与演示用途，不构成任何形式的商业服务或技术承诺。软件按「现状」提供，不作任何明示或暗示的保证。如您在使用过程中发现缺陷或问题，欢迎通过 [GitHub Issues](../../issues) 反馈，但作者不因使用本软件所直接或间接产生的任何损失承担责任。

## 开源协议

本项目基于 [GNU General Public License v3.0](LICENSE) 开源。

### 协议要点
- ✅ 自由使用、修改、分发
- ⚠️ 衍生作品必须以相同许可证 (GPL v3) 开源
- ❌ 禁止闭源商业化
