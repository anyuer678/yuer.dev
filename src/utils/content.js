// utils/content.js —— 内容管线：meta-only，不 import markdown-it（14 §5.1 决策 D1）
// 产物为纯静态模块级常量；正文原文走非 eager glob 进详情共享 chunk。
import { parseFrontmatter } from './parse-frontmatter.js'

const globProjects = import.meta.glob('../content/projects/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})
const globNotes = import.meta.glob('../content/notes/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})
const globJson = import.meta.glob('../content/*.json', {
  query: '?raw',
  import: 'default',
  eager: true,
})

function loadJson(name) {
  const raw = globJson[`../content/${name}.json`]
  return raw ? JSON.parse(raw) : undefined
}

export const site = loadJson('site.json')
export const lab = loadJson('lab.json') ?? []
export const timeline = loadJson('timeline.json') ?? []

// 归一化：布尔/数组缺省补值、空值 → undefined（04 §8 字段约束）
function normalizeMeta(meta) {
  return {
    ...meta,
    featured: !!meta.featured,
    draft: !!meta.draft,
    tech: Array.isArray(meta.tech) ? meta.tech : [],
    tags: Array.isArray(meta.tags) ? meta.tags : [],
    demo: meta.demo || undefined,
    github: meta.github || undefined,
    order: meta.order || undefined,
  }
}

function buildMeta(entries) {
  return entries
    .filter(([path]) => !path.includes('_')) // 模板不入管线
    .map(([path, raw]) => {
      const { meta } = parseFrontmatter(raw)
      return { slug: path.split('/').pop().replace(/\.md$/, ''), meta: normalizeMeta(meta) }
    })
    .filter((item) => !item.meta.draft) // draft 已过滤，内存中恒为 false
}

// 排序：order 升序优先，同 order 按 date 降序（04 §8.3）
export const projects = buildMeta(Object.entries(globProjects)).sort(
  (a, b) => (a.meta.order ?? 999) - (b.meta.order ?? 999) || b.meta.date.localeCompare(a.meta.date)
)
export const notes = buildMeta(Object.entries(globNotes)).sort((a, b) =>
  b.meta.date.localeCompare(a.meta.date)
)

export const getProject = (slug) => projects.find((p) => p.slug === slug)
export const getNote = (slug) => notes.find((n) => n.slug === slug)

export const featuredProjects = projects.filter((p) => p.meta.featured).slice(0, 3)
export const recentNotes = notes.slice(0, 3)

// 派生过滤集合（04 §9.3 校验配套：与内容同步变化）
export const techList = [...new Set(projects.flatMap((p) => p.meta.tech))].sort((a, b) =>
  a.localeCompare(b, 'zh')
)
export const noteTags = [...new Set(notes.flatMap((n) => n.meta.tags))].sort((a, b) =>
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
