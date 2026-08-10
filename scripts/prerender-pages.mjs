// 深链静态入口（替代纯 404 兜底）：构建后为每个已知路由生成 index.html 壳，
// 让 GitHub Pages 对深链返回 200（而非 404 + 404.html 兜底），消除 console 404 报错。
// 壳 = dist/index.html 副本：资源引用均为绝对路径 /yuer.dev/assets/...，子目录同样有效；
// SPA 接管后由 JS 覆盖 document.title 与内容。
// 真正不存在的路径仍由 404.html 兜底（前端 NotFound 组件渲染）。
import { copyFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const dist = join(process.cwd(), 'dist')
const src = join(dist, 'index.html')

if (!existsSync(src)) {
  console.error('[prerender] dist/index.html 不存在，先运行 npm run build')
  process.exit(1)
}

// 固定路由（router 中无参数的路由 path，除 '/' 与兜底）
const staticRoutes = ['about', 'projects', 'timeline', 'notes', 'lab', 'contact']
// 动态路由：content 目录 → 路由前缀
const dynamicRoutes = [
  ['src/content/projects', 'projects'],
  ['src/content/notes', 'notes'],
]

const written = []
const emit = (routePath) => {
  const dest = join(dist, routePath, 'index.html')
  mkdirSync(join(dist, routePath), { recursive: true })
  copyFileSync(src, dest)
  written.push(`/${routePath}/`)
}

for (const route of staticRoutes) emit(route)
for (const [dir, prefix] of dynamicRoutes) {
  const full = join(process.cwd(), dir)
  if (!existsSync(full)) continue
  for (const f of readdirSync(full)) {
    if (f.endsWith('.md')) emit(`${prefix}/${f.slice(0, -3)}`)
  }
}

// 保留 404.html（真正不存在的路径由 GitHub Pages 返回，前端 NotFound 接管）
copyFileSync(src, join(dist, '404.html'))
written.push('/404.html')

console.log(`[prerender] 已生成 ${written.length} 个深链入口：\n  ${written.join('\n  ')}`)
