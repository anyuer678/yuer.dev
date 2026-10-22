// 深链静态入口（替代纯 404 兜底）：构建后为每个已知路由生成 index.html 壳，
// 让 GitHub Pages 对深链返回 200（而非 404 + 404.html 兜底），消除 console 404 报错。
// 壳 = dist/index.html 副本，并在 postbuild 注入逐页 head meta：
// title / description / OG / Twitter / canonical 在静态 HTML 阶段就正确，
// 不执行 JS 的社媒爬虫也能拿到真实文案；SPA 接管后再按路由覆盖一次。
// 资源引用均为绝对路径 /yuer.dev/assets/...，子目录同样有效。
// 真正不存在的路径仍由 404.html 兜底（前端 NotFound 组件渲染）。
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()
const dist = join(ROOT, 'dist')
const shellPath = join(dist, 'index.html')

if (!existsSync(shellPath)) {
  console.error('[prerender] dist/index.html 不存在，先运行 npm run build')
  process.exit(1)
}

const readJson = (p, fallback) => {
  try {
    return JSON.parse(readFileSync(p, 'utf8'))
  } catch {
    return fallback
  }
}
const site = readJson(join(ROOT, 'src/content/site.json'), {})
const projectsMeta = readJson(join(ROOT, 'src/content/_meta/projects.json'), {})
const notesMeta = readJson(join(ROOT, 'src/content/_meta/notes.json'), {})
const worlds = readJson(join(ROOT, 'src/content/garden-worlds.json'), [])
const shell = readFileSync(shellPath, 'utf8')

const SITE_URL = 'https://anyuer678.github.io/yuer.dev/'
const NAME = site.name || 'Yuer'
const BRAND = site.brand || 'Yuer Studio'
const truncate = (s, n) => String(s || '').slice(0, n)
const escapeAttr = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

function replaceMeta(html, attr, key, value) {
  const re = new RegExp(`<meta\\s+${attr}="${escapeRe(key)}"[^>]*>`, 'i')
  const tag = `<meta ${attr}="${key}" content="${escapeAttr(value)}" />`
  return re.test(html) ? html.replace(re, tag) : html.replace('</head>', `${tag}\n</head>`)
}

function injectMeta(html, meta, routePath) {
  const title = truncate(meta.title, 60)
  const desc = truncate(meta.description || site.bio, 120)
  // 目录路由带尾斜杠，和 sitemap/feed 与 GitHub Pages 的 301 目标一致
  const cleanPath = routePath ? `${routePath.replace(/^\/+|\/+$/g, '')}/` : ''
  const url = cleanPath ? new URL(cleanPath, SITE_URL).toString() : SITE_URL
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeAttr(title)}</title>`)
  html = replaceMeta(html, 'name', 'description', desc)
  html = replaceMeta(html, 'property', 'og:title', title)
  html = replaceMeta(html, 'property', 'og:description', desc)
  html = replaceMeta(html, 'property', 'og:url', url)
  html = replaceMeta(html, 'name', 'twitter:title', title)
  html = replaceMeta(html, 'name', 'twitter:description', desc)
  html = html.replace(
    /<link\s+rel="canonical"[^>]*>/i,
    `<link rel="canonical" href="${escapeAttr(url)}" />`
  )
  return html
}

// 固定路由（router 中无参数的路由 path，除 '/' 与兜底）
const staticRoutes = [
  'about',
  'projects',
  'timeline',
  'notes',
  'lab',
  'contact',
  'room',
  'garden',
  'w/works',
  'w/learn',
  'w/lab',
  'w/about',
  'desk/lumen',
  'desk/polycodehub',
  'desk/evocode',
  'stories/lumen',
  'stories/polycodehub',
  'stories/evocode',
  'bench',
  'dashboard',
  'map',
  // 重定向路由也要生成壳：否则 /poetry 落在 GitHub Pages 的 404.html 兜底上，
  // 深链返回 404 并在 console 留下一条 404 报错 —— 与本文档开头的目标相悖。
  // 壳返回 200 后由前端 router 完成 /poetry → 目标页的跳转。
  'poetry',
]
// 动态路由：content 目录 → 路由前缀
const dynamicRoutes = [
  ['src/content/projects', 'projects'],
  ['src/content/notes', 'notes'],
]

const staticMeta = {
  about: { title: `关于 · ${NAME}`, description: `${NAME} 的自我介绍` },
  projects: { title: `项目 · ${NAME}`, description: `${NAME} 的项目档案` },
  timeline: { title: `时间线 · ${NAME}`, description: `${NAME} 的成长时间线` },
  notes: { title: `笔记 · ${NAME}`, description: `${NAME} 的开发日志` },
  lab: { title: `实验室 · ${NAME}`, description: `${NAME} 的实验小项目` },
  contact: { title: `联系 · ${NAME}`, description: `联系 ${NAME}` },
  room: { title: `工作室 · ${NAME}`, description: `走进 ${NAME} 的纸感工作室` },
  garden: {
    title: `花庭 · ${BRAND}`,
    description: '风里偶尔有一朵不一样的花——从花庭遇见项目、笔记与书房。',
  },
  bench: { title: `工作台 · ${NAME}`, description: `${NAME} 的本地工具墙与纸面终端` },
  dashboard: { title: `作品集控制面板 · ${NAME}`, description: `${NAME} 的项目 CI/Release 状态面板` },
  map: {
    title: `地图 · ${NAME}`,
    description: `${NAME} 的作品生态关系图：三主线、独立作品与可验证关系`,
  },
  poetry: { title: `笔记 · ${NAME}`, description: `${NAME} 的开发日志` },
}
for (const w of worlds) {
  if (w.to?.startsWith('/w/')) {
    staticMeta[w.to.slice(1)] = { title: `${w.label} · ${NAME}`, description: w.blurb || w.feel || site.bio }
  }
}
for (const slug of ['lumen', 'polycodehub', 'evocode']) {
  const p = projectsMeta[slug]
  if (!p) continue
  staticMeta[`desk/${slug}`] = { title: `案头 · ${p.title} · ${NAME}`, description: p.summary }
  staticMeta[`stories/${slug}`] = { title: `开卷 · ${p.title} · ${NAME}`, description: p.summary }
}

const fallbackMeta = { title: BRAND, description: site.bio || site.positioning }
const homeMeta = { title: `${BRAND} · ${site.tagline?.[0] || ''}`, description: site.bio || site.positioning }

function metaForDynamic(routePath) {
  const [prefix, slug] = routePath.split('/')
  if (prefix === 'projects') {
    const p = projectsMeta[slug]
    if (p) return { title: `${p.title} · ${p.subtitle || NAME}`, description: p.summary }
  }
  if (prefix === 'notes') {
    const n = notesMeta[slug]
    if (n) return { title: `${n.title} · ${n.date}`, description: n.summary }
  }
  return fallbackMeta
}

const written = []
const emit = (routePath, meta) => {
  const dest = join(dist, routePath, 'index.html')
  mkdirSync(join(dist, routePath), { recursive: true })
  writeFileSync(dest, injectMeta(shell, meta, routePath))
  written.push(`/${routePath}/`)
}

// 首页壳也要正确：静态 HTML 先给首页文案，SPA 接管后保持一致
writeFileSync(shellPath, injectMeta(shell, homeMeta, ''))
for (const route of staticRoutes) emit(route, staticMeta[route] || fallbackMeta)
for (const [dir, prefix] of dynamicRoutes) {
  const full = join(ROOT, dir)
  if (!existsSync(full)) continue
  for (const f of readdirSync(full)) {
    if (!f.endsWith('.md')) continue
    const slug = f.slice(0, -3)
    emit(`${prefix}/${slug}`, metaForDynamic(`${prefix}/${slug}`))
  }
}

// 保留 404.html（真正不存在的路径由 GitHub Pages 返回，前端 NotFound 接管）
writeFileSync(
  join(dist, '404.html'),
  injectMeta(shell, { title: `页面不存在 · ${NAME}`, description: '你访问的页面不存在或已被移动。' }, '')
)
written.push('/404.html')

console.log(
  `[prerender] 已生成 ${written.length} 个深链入口，并注入逐页 head meta：\n  ${written.join('\n  ')}`
)
