---
slug: voiceconsole
title: 语音指令控制台
subtitle: Voice Command Console (MCP)
status: development
featured: false
date: 2026-08
tech: [Python, LLM, MCP, AI]
tags: [语音, 工具]
summary: 对着电脑说一句就执行并播报：本地语音识别 → 意图解析 → MCP 工具调用，白名单 + 语音确认两道安全门，雏形链路完整。
demo:
github: https://github.com/anyuer678/voiceconsole
order: 9
cover: projects/voiceconsole.svg
related: [voice-console-mcp-notes]
journey: [{"date": "2026-08", "title": "雏形", "desc": "五层链路打通：STT → 意图解析 → MCP 工具 → 安全校验 → TTS 播报"}]
---

## 项目介绍

给命令行和 MCP 加一层本地语音入口：说一句话，它听懂、执行、再播报结果。键盘打字有时候是多余的——想解放双手直接对电脑说话。

## 设计目标

- 本地优先：STT 用 faster-whisper 本地识别，数据不出本机
- 安全第一：命令先过校验，再查黑白名单，剩余必须语音确认
- 可演示：免麦克风模式，`main.py --text` 直接演示整条链路

## 功能

- 五层链路：STT 识别 → 意图解析 → `mcp_server.py` 注册 5 个工具（run_cli / find_file / open_folder / speak / confirm）→ 安全校验 → 执行并 TTS 播报
- 二阶段语音确认：30 秒超时自动取消，执行统一超时 10 秒
- 低置信（低于 0.55）或没听清时只播报"没听懂"，不执行
- Web 面板：标准库 http.server 实现，零第三方依赖，只监听 127.0.0.1
- `Ctrl+Shift+Space` 录音、`Ctrl+Shift+Q` 退出；密钥走环境变量

## 架构

```
麦克风 → faster-whisper(STT) → 意图解析 → mcp_server.py（5 个工具）
                                              │
                           安全校验（空值/注入 → 黑名单 → 白名单 → 语音确认）
                                              ↓
                                        执行 + edge-tts 播报
```

## 技术选择

- **Python**：生态齐全，STT / TTS / MCP 三方库都能覆盖
- **faster-whisper**：本地语音识别，首次运行下载 base 模型约 150MB
- **edge-tts**：TTS 播报，失败自动降级系统播报
- **MCP**：以标准工具协议暴露执行能力，便于扩展

## 开发过程

先搭 STT → 意图解析的骨架，再把执行能力收进 `mcp_server.py` 的 5 个工具；安全门最后接入（先空值/注入检查，再黑名单、白名单，剩余走语音确认）。测试覆盖了安全门、意图解析、执行体、STT 与 MCP 真实 stdio 子进程握手。

## 挑战与解决

1. 误触发风险 → 二阶段语音确认：命令先过静态校验，白名单外必须口头确认，30 秒超时自动取消
2. 隐私与本地优先 → faster-whisper 本地识别，Web 面板只监听 127.0.0.1，密钥走环境变量
3. 使用门槛 → `keyboard` 热键在 Windows 需要管理员权限，提供 `main.py --text` 免麦克风演示模式

## 未来计划

- 更细的意图分类与多轮对话
- 常用场景的预置白名单命令

## 源码

- [GitHub](https://github.com/anyuer678/voiceconsole)
