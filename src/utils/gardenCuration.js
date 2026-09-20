// 花笺世界门槛精选：构建期元数据策展，不复制正文（16/17 · Phase C 强化）
import deskMap from '../content/desk.json'
import gardenWorlds from '../content/garden-worlds.json'
import { lab, notes, productProjects, projects, site } from './content.js'

export { gardenWorlds }

const POETRY_TAGS = ['架构', '设计', '理念', '思考', '复盘', 'Agent', 'AI']
const POETRY_SLUGS = [
  'evocode-architecture',
  'dsh-architecture-patterns',
  'decision-notes-and-capability-seam',
  'ai-design-notes',
  'polycodehub-architecture',
  'lumen-notes',
  'idea-backlog-notes',
]
// 诗境排除课业/刷题/速记，与学习廊彻底分家
const POETRY_NOISE = /实验|速记|真题|刷题|章节|复习|期末|考点/

const LEARN_BUCKETS = [
  ['算法', '数据结构'],
  ['操作系统', 'Linux', 'ChCore', '进程'],
  ['数据库', 'MySQL', 'SQL', 'Redis'],
  ['计算机网络', '网络', 'TCP'],
  ['编译原理', '词法', '语法'],
  ['软件工程', '需求分析', 'UML'],
  ['Spring', 'Java', 'MyBatis'],
]

function toItem({ kind, title, subtitle, blurb, to, meta }) {
  return { kind, title, subtitle, blurb, to, meta }
}

function deskOrProject(slug) {
  return deskMap[slug] ? `/desk/${slug}` : `/projects/${slug}`
}

function pickWorks() {
  const flagship = projects.filter((p) => p.tier === 'flagship')
  const pad = productProjects.filter((p) => !flagship.some((f) => f.slug === p.slug))
  return [...flagship, ...pad].slice(0, 3).map((p) => {
    const hasDesk = !!deskMap[p.slug]
    return toItem({
      kind: hasDesk ? '案头' : p.tier === 'flagship' ? '旗舰' : '产品',
      title: p.title,
      subtitle: p.subtitle,
      blurb: p.summary,
      to: deskOrProject(p.slug),
      meta: [
        ...(p.tech?.slice(0, 2) ?? []),
        ...(p.repoStats?.pushed_at
          ? [
              `${Math.floor((Date.now() - new Date(p.repoStats.pushed_at).getTime()) / 86400000)} 天前推送`,
            ]
          : []),
      ],
    })
  })
}

function pickPoetry() {
  const reflective = notes.filter(
    (n) => n.type !== 'learning' && !POETRY_NOISE.test(n.title || '')
  )
  const scored = reflective
    .map((n) => {
      let score = 0
      const idx = POETRY_SLUGS.indexOf(n.slug)
      if (idx >= 0) score += 24 - idx
      for (const t of POETRY_TAGS) {
        if (n.tags?.includes(t)) score += 2
      }
      // 标题/摘要里的架构、设计、理念加分
      const hay = `${n.title}${n.summary}`
      if (/架构|设计|理念|演化|Agent Runtime/.test(hay)) score += 3
      return { n, score }
    })
    .sort((a, b) => b.score - a.score || b.n.date.localeCompare(a.n.date))
  return scored.slice(0, 3).map(({ n }) =>
    toItem({
      kind: '短文',
      title: n.title,
      subtitle: n.date,
      blurb: n.summary,
      to: `/notes/${n.slug}`,
      meta: n.tags?.slice(0, 3) ?? [],
    })
  )
}

function pickLearn() {
  const learning = notes.filter((n) => n.type === 'learning')
  const used = new Set()
  const picks = []
  for (const keys of LEARN_BUCKETS) {
    if (picks.length >= 3) break
    const hit = learning.find(
      (n) =>
        !used.has(n.slug) &&
        (n.tags || []).some((t) => keys.some((k) => t === k || t.includes(k)))
    )
    if (hit) {
      used.add(hit.slug)
      picks.push(hit)
    }
  }
  // 不足则按日期补满
  for (const n of learning) {
    if (picks.length >= 3) break
    if (!used.has(n.slug)) {
      used.add(n.slug)
      picks.push(n)
    }
  }
  return picks.map((n) =>
    toItem({
      kind: '学习',
      title: n.title,
      subtitle: n.date,
      blurb: n.summary,
      to: `/notes/${n.slug}`,
      meta: n.tags?.slice(0, 3) ?? [],
    })
  )
}

function pickLab() {
  return lab
    .filter((i) => i.status === 'experiment' || i.status === 'idea')
    .slice()
    .sort((a, b) => {
      // 有链接的实验优先，其次 idea，再按日期
      const la = a.link ? 0 : 1
      const lb = b.link ? 0 : 1
      if (la !== lb) return la - lb
      const sa = a.status === 'experiment' ? 0 : 1
      const sb = b.status === 'experiment' ? 0 : 1
      if (sa !== sb) return sa - sb
      return (b.date || '').localeCompare(a.date || '')
    })
    .slice(0, 3)
    .map((i) =>
      toItem({
        kind: i.status === 'idea' ? '想法' : '实验',
        title: i.title,
        subtitle: i.date,
        blurb: i.description,
        to: i.link || '/lab',
        meta: i.tags?.slice(0, 3) ?? [],
      })
    )
}

function pickAbout() {
  const focusSlug = site.focus?.link?.split('/').filter(Boolean).pop()
  return [
    toItem({
      kind: '自述',
      title: site.name,
      subtitle: site.role,
      blurb: site.bio,
      to: '/about',
      meta: [],
    }),
    toItem({
      kind: '在做',
      title: site.focus?.title || 'Current Focus',
      subtitle: site.focus?.subtitle,
      blurb: site.focus?.goal,
      to: focusSlug ? deskOrProject(focusSlug) : site.focus?.link || '/projects',
      meta: [],
    }),
    toItem({
      kind: '时间线',
      title: '成长路径',
      subtitle: 'Timeline',
      blurb: '按月记录每个项目是怎么长出来的。',
      to: '/timeline',
      meta: [],
    }),
  ]
}

const CURATORS = {
  works: pickWorks,
  poetry: pickPoetry,
  learn: pickLearn,
  lab: pickLab,
  about: pickAbout,
  room: () => [],
}

export function getWorld(id) {
  return gardenWorlds.find((w) => w.id === id)
}

export function getWorldPicks(id) {
  return CURATORS[id]?.() ?? []
}

export function listHref(world) {
  if (!world?.listTo) return null
  const q = world.listQuery
  if (!q) return world.listTo
  const params = new URLSearchParams(q).toString()
  return params ? `${world.listTo}?${params}` : world.listTo
}

/** 花庭入口花队列（书房也在其中，门是常驻旁路） */
export function portalWorlds() {
  return gardenWorlds.map((w) => ({ label: w.label, id: w.id, to: w.to, feel: w.feel }))
}

export function hasDesk(slug) {
  return !!deskMap[slug]
}
