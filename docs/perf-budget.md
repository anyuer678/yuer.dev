# yuer.dev 资产性能预算

不改变 UI 视觉，只约束 **public/ 重资产** 进仓库/进部署包的体积。

## 脚本

```bash
npm run check:perf-budget
```

- 扫描 `public/models|draco|projects|images` 等
- **WARN**：打印但不失败
- **FAIL**：`process.exit(1)`，CI 阻断部署

## 当前阈值

| 类别 | 警戒 | 失败 |
|------|------|------|
| `models/**/*.glb` | 800 KB | 1500 KB |
| `draco/**` | 300 KB | 600 KB |
| `projects/**` 封面 | 120 KB | 450 KB |
| `images/**` | 400 KB | 700 KB |
| 任意 public 单文件 | 1200 KB | 2000 KB |

`draco/**` 现在只统计仍部署的 wasm wrapper 与 wasm；asm.js 回退 `draco_decoder.js` 已归档到 `assets-src/draco/`，非 WASM 环境会走 `/room` 的 2D 兜底。

## 已知债务（不阻断，但应逐步压缩）

- `models/study_room/study_room_web.opt.glb` ≈ 798.8 KiB（2026-10-22 按网格筛选减面后；perf budget 0 warning）
- 2.5D 房间底图已归档到 `assets-src/room-2d/`，不再部署；`/room` 线上只用 GLB
- 三张原始 PNG 封面已归档到 `assets-src/projects/`，线上封面为 WebP（三张合计约 83 KB）

### 书房 GLB 体积决策（2026-10-22）

- 原模型 1206.7 KiB：纹理 248.7 + Draco 766.8 + JSON 191.1；纹理全部被材质引用、几何 bufferView 无重复，删光纹理仍有约 958 KiB > 800
- 全量减面候选 797.8 KiB 达线，但近景花盆底部被减面拉平，否决
- 最终采用按网格筛选：保护植物/花盆/杯子/地球仪/钟/灯等 11 个圆物件，仅简化墙/地/书架/书本/桌面等大面；256px WebP + Draco 10/8/8/8
- 结果 798.8 KiB（纹理 49 + 几何 558.7 + JSON 191.1），171 nodes / 167 meshes / 58 materials 名称全保留，validate 通过
- 视觉 A/B：默认机位静态区域平均差 2.57/255；花盆、椅子、桌面、书架近景无明显差异

## 懒加载约定

- 路由级代码分割：除 Home 外全部 `() => import('@/pages/....vue')`
- `/room` 的 `RoomStage3D` 使用 `defineAsyncComponent`，three/GLB 不进 Room shell
- 项目卡片/详情图 `loading="lazy"` + `decoding="async"`
- 笔记正文走详情页动态 import（meta-only 主包，见 vite contentMetaPlugin）

## CI

`deploy.yml` 在 `npm run build` 前执行 `check:perf-budget`，超硬阈值直接失败。
