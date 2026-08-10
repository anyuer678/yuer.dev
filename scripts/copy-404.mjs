// 深链兜底（07 §9.2）：构建后把 dist/index.html 复制为 dist/404.html
// GitHub Pages 对未匹配路径返回 404.html，SPA 前端路由得以接管深链。
import { copyFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const dist = join(process.cwd(), 'dist')
const src = join(dist, 'index.html')
const dest = join(dist, '404.html')

if (!existsSync(src)) {
  console.error('[copy-404] dist/index.html 不存在，先运行 npm run build')
  process.exit(1)
}
copyFileSync(src, dest)
console.log('[copy-404] dist/404.html 已生成')
