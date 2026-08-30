---
slug: picren
title: 图片批量 AI 重命名器
subtitle: PicRen
status: development
featured: false
date: 2026-08
tech: [Python, AI, LLM]
tags: [图片, 工具]
summary: 让 AI 看图把 IMG 照片改成中文语义名：默认 dry-run 只预览，--execute 才真改，--undo 可回滚；图片本地压缩后才上传，隐私安全。
demo:
github: https://github.com/anyuer678/picren
order: 14
cover: projects/picren.svg
related: [picrename-ai-notes]
journey: [{"date": "2026-08", "title": "雏形", "desc": "AI 看图 → 中文语义命名 → dry-run/execute/undo 全链路"}]
---

## 项目介绍

手机导出的照片全是 `IMG_20230101_103055.jpg` 这种文件名，想归档时根本不知道每张是什么。`picren` 命令行工具 + 本地 Web 面板：AI 识别图片内容，按模板生成中文语义名，如 `{date}_{category}_{subject}_{index}.{ext}` → "旅行_东京塔_2026.jpg"。

## 设计目标

- 安全第一：默认 dry-run 只预览，真实改名必须显式 `--execute`；绝不删文件
- 隐私：图片先在本地压缩（最长边 ≤800px、JPEG 质量 80）才发送，原图和 EXIF 不上传
- 可回滚：每次执行记录 `rename_map.csv`，`--undo` 可回滚

## 功能

- AI 看图命名：category 分旅行/美食/文档/宠物/人物/街拍/风景/运动/建筑/其他；subject 是 AI 生成的中文、最多 4 词
- 防错：新文件名自动过滤 Windows 非法字符、重名自动追加 `_1`，绝不覆盖已有文件
- 本地模型支持：支持 Ollama 等本地模型端点
- `--tags-only`：只生成 tags.csv 供人工核对
- API Key 优先级：`--api-key` 参数 > 环境变量 > `.env`；Web 页面 key 只存浏览器内存

## 架构

```
图片 → 本地 Pillow 压缩 → LLM 视觉识别 → 命名模板 → dry-run 预览
                                                    ↓ --execute
                                          rename_map.csv 记录 → 改名
                                                    ↓ --undo
                                          按记录回滚
```

## 技术选择

- **Python + Pillow**：本地图片压缩，控制上传体积
- **LLM 视觉**：OpenAI 兼容视觉接口，识别图片内容生成语义名

## 开发过程

先实现 dry-run 预览与命名模板，再接视觉识别与分类体系；回滚链路（rename_map.csv）与防覆盖逻辑在真实改名前接入。测试用 stub 注入模拟 API，离线可跑。

## 挑战与解决

1. 隐私 → 图片本地 Pillow 压缩（最长边 ≤800px、JPEG 质量 80）才发送，原图和 EXIF 不上传；支持 Ollama 等本地模型端点
2. 误改名/覆盖 → 默认 dry-run 只预览，`--execute` 才真改；新文件名过滤 Windows 非法字符、重名自动追加 `_1`，绝不覆盖已有文件
3. 识别失败 → 退出码区分正常 / 参数错误 / 识别失败超阈值（默认 20% 中止）

## 未来计划

- 更多分类体系与自定义模板
- 批量确认交互的打磨

## 源码与安装

```bash
pip install picren-ai
```

- [GitHub](https://github.com/anyuer678/picren)
- [PyPI](https://pypi.org/project/picren-ai/)
