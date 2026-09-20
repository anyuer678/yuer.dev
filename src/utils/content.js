// utils/content.js —— 内容管线：meta-only，不 import markdown-it（14 §5.1 决策 D1）
// 产物为纯静态模块级常量；正文原文走非 eager glob 进详情共享 chunk。
//
// frontmatter 元数据来自 src/content/_meta/*.json（由 scripts/gen-content-meta.mjs
// 生成，vite 插件在 dev / build 时自动刷新）。这里不能再直接 raw 读取 markdown —
// 112 篇笔记正文合计 3.1MB，eager 加载会把它们全塞进主包。
import notesMeta from '../content/_meta/notes.json'
import projectsMeta from '../content/_meta/projects.json'

const globJson = import.meta.glob('../content/*.json', {
  query: '?raw',
  import: 'default',
  eager: true,
})

function loadJson(name) {
  const raw = globJson[`../content/${name}.json`]
  return raw ? JSON.parse(raw) : undefined
}

export const site = loadJson('site')
export const gardenWorlds = loadJson('garden-worlds') ?? []
export const lab = loadJson('lab') ?? []
export const timeline = loadJson('timeline') ?? []
export const repoMap = loadJson('repo-map') ?? {}
export const room = loadJson('room') ?? { scenes: [] }
export const githubData = loadJson('github-data') ?? { repos: {} }

/** 仓名 → GitHub 元数据（构建期写入，零运行时 fetch） */
export function getRepoData(name) {
  if (!name) return undefined
  return githubData.repos?.[name]
}

/** 从 github URL 或 slug 反查仓名 */
function repoNameFromUrl(url) {
  if (!url) return undefined
  const m = /github\.com\/[^/]+\/([^/#?]+)/i.exec(url)
  return m ? m[1] : undefined
}

// 归一化：布尔/数组缺省补值、空值 → undefined（04 §8 字段约束）
function normalizeMeta(meta) {
  return {
    ...meta,
    featured: !!meta.featured,
    draft: !!meta.draft,
    tier: meta.tier === 'flagship' || meta.tier === 'product' ? meta.tier : 'lab',
    tech: Array.isArray(meta.tech) ? meta.tech : [],
    tags: Array.isArray(meta.tags) ? meta.tags : [],
    demo: meta.demo || undefined,
    github: meta.github || undefined,
    order: meta.order || undefined,
  }
}

/** 合并构建期 GitHub 数据 + demo 自动推导（15 Wave 1.3/1.4） */
function attachRepoStats(item) {
  const name = repoNameFromUrl(item.github) || item.slug
  const stats = getRepoData(name)
  if (!stats) return item
  const demo = item.demo || stats.pages_url || undefined
  return {
    ...item,
    demo,
    repoStats: {
      language: stats.language,
      stars: stats.stars,
      pushed_at: stats.pushed_at,
      ci_status: stats.ci_status,
      release: stats.release,
      pages_url: stats.pages_url,
      topics: stats.topics ?? [],
    },
  }
}

/** 从 frontmatter 索引构建元数据列表（索引里已排除 `_` 前缀模板文件） */
function buildMeta(index) {
  return Object.entries(index)
    .map(([slug, meta]) => ({ slug, ...normalizeMeta(meta) }))
    .filter((item) => !item.draft) // draft 已过滤，内存中恒为 false
}

// 排序：order 升序优先，同 order 按 date 降序（04 §8.3）
export const projects = buildMeta(projectsMeta)
  .map(attachRepoStats)
  .sort((a, b) => (a.order ?? 999) - (b.order ?? 999) || b.date.localeCompare(a.date))

export const flagshipProjects = projects.filter((p) => p.tier === 'flagship')
export const productProjects = projects.filter((p) => p.tier === 'product')
export const labProjects = projects.filter((p) => p.tier === 'lab')
export const notes = buildMeta(notesMeta).sort((a, b) => b.date.localeCompare(a.date))

export const getProject = (slug) => projects.find((p) => p.slug === slug)
export const getNote = (slug) => notes.find((n) => n.slug === slug)

// 首页精选：优先 flagship，其次 featured（兼容旧字段）
export const featuredProjects = (
  flagshipProjects.length >= 3
    ? flagshipProjects
    : projects.filter((p) => p.featured)
).slice(0, 3)
export const recentNotes = notes.slice(0, 3)

// 派生过滤集合（04 §9.3 校验配套：与内容同步变化）
export const techList = [...new Set(projects.flatMap((p) => p.tech))].sort((a, b) =>
  a.localeCompare(b, 'zh')
)
export const noteTags = [...new Set(notes.flatMap((n) => n.tags))].sort((a, b) =>
  a.localeCompare(b, 'zh')
)

// 原文懒加载（详情页用；非 eager → 与 markdown.js 共享详情 chunk）
export const projectRawFiles = Object.fromEntries(
  Object.entries(
    import.meta.glob('../content/projects/*.md', { query: '?raw', import: 'default' })
  )
    .filter(([path]) => !path.includes('_'))
    .map(([path, loader]) => [path.split('/').pop().replace(/\.md$/, ''), loader])
)
export const noteRawFiles = Object.fromEntries(
  Object.entries(
    import.meta.glob('../content/notes/*.md', { query: '?raw', import: 'default' })
  )
    .filter(([path]) => !path.includes('_'))
    .map(([path, loader]) => [path.split('/').pop().replace(/\.md$/, ''), loader])
)
