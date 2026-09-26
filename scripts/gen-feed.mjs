// gen-feed.mjs —— 构建后生成 dist/feed.xml（RSS 2.0）与 dist/sitemap.xml。
//
// 为什么：数字花园的发现性基础设施——114 篇笔记此前没有任何订阅/收录通道，
// RSS 让读者与聚合器能在不访问站点的情况下感知更新；sitemap 帮搜索引擎收录深链。
//
// 路由口径与 prerender-pages.mjs 保持一致（staticRoutes + notes/projects 动态路由），
// 若新增静态路由请同步两处的列表。
//
// 运行：postbuild 钩子自动执行（npm run build 之后）；也可手动 node scripts/gen-feed.mjs
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const SITE = 'https://anyuer678.github.io/yuer.dev/'
const dist = join(process.cwd(), 'dist')
const metaDir = join(process.cwd(), 'src', 'content', '_meta')

if (!existsSync(dist)) {
  console.error('[feed] dist/ 不存在，先运行 npm run build')
  process.exit(1)
}

const notes = JSON.parse(readFileSync(join(metaDir, 'notes.json'), 'utf8'))
const projects = JSON.parse(readFileSync(join(metaDir, 'projects.json'), 'utf8'))

// 与 prerender-pages.mjs 的 staticRoutes 保持同步
const staticRoutes = [
  'about', 'projects', 'timeline', 'notes', 'lab', 'contact', 'room', 'garden',
  'w/works', 'w/learn', 'w/lab', 'w/about',
  'desk/lumen', 'desk/polycodehub', 'desk/evocode',
  'stories/lumen', 'stories/polycodehub', 'stories/evocode',
  'bench', 'dashboard', 'poetry',
]

const esc = (s) =>
  String(s ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')

/** YYYY-MM / YYYY-MM-DD → RFC 822 pubDate（缺省日取 1 号） */
function toRFC822(date) {
  const iso = date.length === 7 ? `${date}-01` : date
  return new Date(`${iso}T00:00:00Z`).toUTCString()
}

const sortedNotes = Object.entries(notes)
  .map(([slug, m]) => ({ slug, ...m }))
  .sort((a, b) => b.date.localeCompare(a.date))

/* ---------- RSS 2.0（最近 50 篇笔记） ---------- */
const items = sortedNotes
  .slice(0, 50)
  .map((n) => {
    const url = `${SITE}notes/${n.slug}/`
    return [
      '    <item>',
      `      <title>${esc(n.title)}</title>`,
      `      <link>${url}</link>`,
      `      <guid isPermaLink="true">${url}</guid>`,
      `      <pubDate>${toRFC822(n.date)}</pubDate>`,
      `      <description>${esc(n.summary || '')}</description>`,
      ...(n.tags || []).map((t) => `      <category>${esc(t)}</category>`),
      '    </item>',
    ].join('\n')
  })
  .join('\n')

const latest = sortedNotes[0]?.date
const feed = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
  '  <channel>',
  '    <title>Yuer Studio — 数字花园</title>',
  `    <link>${SITE}</link>`,
  '    <description>Yuer 的个人作品集与数字花园：AI 应用与工程化，从需求到部署自己搞定。</description>',
  '    <language>zh-CN</language>',
  ...(latest ? [`    <lastBuildDate>${toRFC822(latest)}</lastBuildDate>`] : []),
  `    <atom:link href="${SITE}feed.xml" rel="self" type="application/rss+xml" />`,
  items,
  '  </channel>',
  '</rss>',
  '',
].join('\n')

writeFileSync(join(dist, 'feed.xml'), feed)

/* ---------- sitemap.xml ---------- */
const today = new Date().toISOString().slice(0, 10)
const urls = [
  ['', 'monthly', '1.0'],
  ...staticRoutes.map((r) => [r, 'monthly', '0.7']),
  ...Object.keys(notes).map((slug) => [`notes/${slug}`, 'monthly', '0.6']),
  ...Object.keys(projects).map((slug) => [`projects/${slug}`, 'monthly', '0.6']),
]

const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...urls.map(([route, , priority]) => {
    const lastmod = route.startsWith('notes/') && notes[route.slice(6)]
      ? notes[route.slice(6)].date
      : route.startsWith('projects/') && projects[route.slice(9)]
        ? projects[route.slice(9)].date
        : today
    return [
      '  <url>',
      `    <loc>${SITE}${route}${route ? '/' : ''}</loc>`,
      `    <lastmod>${lastmod}</lastmod>`,
      `    <priority>${priority}</priority>`,
      '  </url>',
    ].join('\n')
  }),
  '</urlset>',
  '',
].join('\n')

writeFileSync(join(dist, 'sitemap.xml'), sitemap)

/* ---------- robots.txt（声明 sitemap） ---------- */
writeFileSync(
  join(dist, 'robots.txt'),
  `User-agent: *\nAllow: /\nSitemap: ${SITE}sitemap.xml\n`,
)

console.log(`[feed] feed.xml（${Math.min(50, sortedNotes.length)} 条）+ sitemap.xml（${urls.length} 个 URL）+ robots.txt 已生成`)
