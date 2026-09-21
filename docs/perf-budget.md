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
| `projects/**` 封面 | 120 KB | 450 KB（覆盖既有截图债务） |
| `images/**` | 400 KB | 700 KB |
| 任意 public 单文件 | 1200 KB | 2000 KB |

## 已知债务（不阻断，但应逐步压缩）

- `models/study_room/study_room_web.opt.glb` ≈ 1.2 MB（接近 glb fail 线；Room 页懒加载后对首屏无影响）
- `images/room/*.webp` 单张约 350–560 KB（房间沉浸页资源）
- `projects/cet6-vocabulary.png` ≈ 408 KB（WARN；应压到 <120 KB 或转为 webp/svg）

## 懒加载约定

- 路由级代码分割：除 Home 外全部 `() => import('@/pages/....vue')`
- `/room` 的 `RoomStage3D` 使用 `defineAsyncComponent`，three/GLB 不进 Room shell
- 项目卡片/详情图 `loading="lazy"` + `decoding="async"`
- 笔记正文走详情页动态 import（meta-only 主包，见 vite contentMetaPlugin）

## CI

`deploy.yml` 在 `npm run build` 前执行 `check:perf-budget`，超硬阈值直接失败。
