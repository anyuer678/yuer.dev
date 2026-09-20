# 17 花笺 Phase 1 — 技术实施规格

> 承接 `16-花笺-特别篇设计.md`。  
> Prototype v0（会话 `index.html`）只验证手感；**Phase 1 不直接搬 Demo，而是抽取三套机制重接花庭。**

## 0. 拍板规则

| 决策 | 结论 |
|------|------|
| 入口花数量 | **不同时展示 5–7 个导航**；视野内入口花 **≤1**（偶尔 2） |
| 出生位置 | 全部从**梅枝 / 画面上方**落下，禁止出生在屏幕中央 |
| 转场 | 参与「纸页」动作，不是纯白幕 modal |
| 目的地 | Phase 1 **直连真实路由** `/projects` `/notes` `/lab` `/about` `/room` 等，禁止「这里应打开…」占位 |
| 空间感 | 花庭 = 纸面 + 枝 + 远景 + 落花，不是裸 canvas |
| Demo 骨架 | 保留 Petal 风感与 Portal 三级状态；重写系统边界 |

## 1. 模块边界

```text
GardenPage (/garden 或 Lab→花笺)
├── Atmosphere     纸纹、梅枝、远景、光
├── PetalField     装饰花 + 入口花（同一粒子场）
├── PortalSystem   检测 / 标签 / 焦点 / 进入
└── TransitionSystem 风卷 + 纸页 + router
```

内容映射见 `16` §6；实现读 `content.js`，不复制正文。

## 2. 状态机（单入口花）

```text
idle
  → spawn（y<0，沿枝侧 x）
  → fall（与普通花同物理）
  → near（dist<100：轻躲）
  → label（dist<50 且 dwell≥600ms：淡名）
  → enter（click / Enter）
       → windSweep 400ms
       → paperTurn 300–400ms
       → router.push(target)
  → expire（出屏或超时）→ 回 idle → 下一朵稍后再 spawn
```

普通花：无 portal，永不 label。

### 三级距离（替代「一靠近就出字」）

| 距离 | 行为 |
|------|------|
| >100 | 无提示 |
| 100–50 | 花偏转、略加速 |
| <50 + 停留 600ms+ | 名字稳定；花轻微「停顿」感（减 vr） |

## 3. 入口花调度

- 池：`worlds[]`（6）打乱队列  
- 同时活跃 portal：`maxActive = 1`（桌面）/ `1`（手机）  
- 间隔：上一朵 expire/enter 后 `2–6s` 再 spawn  
- 可选：session 记忆「已进过的 world」降低权重，但不消失  

## 4. 转场时序（纸页）

```text
t0    label 点击
t0+   该 portal 花加速朝画面边缘飞（风）
t0+   其余花微偏，同向风
t0+120 纸层从一侧轻掀（translate + 轻 rotate + 柔阴影）
t0+350 内容层 opacity→0 或被纸完全盖住
t0+420 router.push(target)
t0+    新路由进入后 Garden 重置场（或 keep-alive 按路由策略）
```

禁：整屏纯色 fade 当最终效果；纸纹必须在转场层可见。

## 5. 路由接法（生产）

| portal id | 目标 |
|-----------|------|
| works | `/projects` |
| poetry | `/notes`（或未来 `/poetry`） |
| learn | `/notes` |
| lab | `/lab` |
| about | `/about` |
| room | `/room` |

- 普通站导航保留；花笺入口：`/lab` 内「特别篇」或 `/garden`  
- 旁路：花庭角落「列表浏览」→ `/projects`  
- SEO：`/garden` 可 `nav: false`；真实页面仍在 L1

## 6. 移动端

- 粒子数 ≤12；portal 仍 1  
- 触摸：tap 相当于 hover 短时；第二次 tap 进入或显名后 tap  
- 无 WebGL；Canvas 即可  
- `prefers-reduced-motion`：花不大幅摆动，转场改短 fade

## 7. 目录建议（个网）

```text
src/pages/Garden.vue
src/components/features/garden/
  Atmosphere.vue      # 枝 + 远景 + 纸
  PetalField.vue      # canvas 粒子 + portal 调度
  PortalOverlay.vue   # 标签层（受控 DOM）
  PaperTransition.vue # 纸页转场
src/content/garden-worlds.json   # id/label/to
```

`/garden` 进 router；`docs/16` 为视觉权威，本文为实现权威。

## 8. 验收

- [x] 打开时无「六个按钮」感；无中央出生的 portal  
- [x] 仅偶尔出现入口花；名字靠停留才出  
- [x] 点击后有纸页/风感，再进入真实路由  
- [x] 手机可完成「见花→进入→返回」（触摸粒子降载；列表/门槛页可直达）  
- [x] `/projects` 等列表页始终可直达（花庭「列表浏览」+ 主导航）  
- [x] 减动效可用（`prefers-reduced-motion` 降风与粒子）  

> Phase A（生产化）落地记录：`/garden` + `/w/:world` 门槛页已接入；入口花指向门槛而非裸列表；书房门/HUD 与花庭互达。

## 9. 明确不做（Phase 1）

- 三个 2D 女孩世界精修  
- 全套雨声/天气  
- 书房 GLB 大改（只保证 `/room` 可达）  
- 一瓣对应单个小工具  

---

*Demo v0：会话 `index.html` 已按本规格改一版（单 portal 流动 + 纸页转场 + 真实路由表）。*

## 10. 手感与花庭 UI（2026-09 拍板）

- 入口花：出现更勤（约 0.6–1.5s）、靠近悬停、显名更易；**外观与普通花同色系**，无偏红、无花心、无光晕。
- 花庭 **不设**「列表浏览 / 首页 / 世界列表」；仅书房门与极淡 hint：「风里偶尔有一朵不一样的花 · 靠近停一停」。
- 列表主路径仍在 Header / Lab / 页脚。
