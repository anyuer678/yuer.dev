// 内容校验（npm run validate）—— 04 §9 全 15 条规则
// frontmatter 解析复用浏览器同款实现，杜绝双实现漂移（依赖 package.json "type": "module"）。
import { readdirSync, readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { parseFrontmatter } from '../src/utils/parse-frontmatter.js'

const ROOT = 'src/content'
const errors = []
const report = (rule, file, msg) => errors.push(`ERROR [规则${rule}] ${file}: ${msg}`)

function walk(dir) {
  // _ 开头文件/目录一律跳过（模板不入管线，04 §2）
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.name.startsWith('_') ? [] : e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)]
  )
}

// --- 技术栈规范名表（04 §7） ---
const TECH_WHITELIST = new Set(
  'Vue 3, Vite, TypeScript, JavaScript, Spring Boot, Java, Python, LLM, Electron, Node.js, Docker, Linux, Git, MySQL, Redis, Flask, FastAPI, MCP, AI, OpenAI API, GitHub Actions, HTML, CSS'.split(
    ', '
  )
)
const STATUS_ENUM = new Set(['development', 'completed', 'archived', 'experiment'])
const NOTE_TYPE_ENUM = new Set(['project', 'learning', 'note', 'milestone'])
const PROJECT_REQUIRED = ['slug', 'title', 'subtitle', 'status', 'featured', 'date', 'tech', 'tags', 'summary', 'demo', 'github', 'order']
const NOTE_REQUIRED = ['slug', 'title', 'date', 'tags', 'summary']
const PROJECT_SECTIONS = ['项目介绍', '设计目标', '功能', '架构', '技术选择', '开发过程', '挑战与解决', '未来计划', '源码与 Demo']
const REQUIRED_SECTIONS = ['项目介绍', '设计目标', '功能', '架构', '技术选择', '未来计划'] // 规则 8

// --- 规则 12：JSON 文件合法 + schema ---
function checkJson(name) {
  const file = join(ROOT, `${name}.json`)
  if (!existsSync(file)) return
  const data = JSON.parse(readFileSync(file, 'utf8'))
  if (name === 'site.json') {
    for (const key of ['name', 'brand', 'role', 'bio']) {
      if (typeof data[key] !== 'string') report(12, file, `site.json.${key} 应为字符串`)
    }
    if (!Array.isArray(data.tagline) || !Array.isArray(data.heroTags))
      report(12, file, 'site.json.tagline/heroTags 应为数组')
    if (!data.links || typeof data.links.github !== 'string')
      report(12, file, 'site.json.links.github 应为字符串')
  } else if (!Array.isArray(data)) {
    report(12, file, `${name}.json 应为数组`)
  }
}
checkJson('site.json')
checkJson('lab.json')
checkJson('timeline.json')

// --- Markdown 内容校验 ---
const mdFiles = walk(ROOT).filter((f) => f.endsWith('.md'))
const allSlugs = new Set()
const featuredCount = { n: 0 }
const innerLinks = [] // 规则 10：跨文件统一复核

for (const file of mdFiles) {
  const raw = readFileSync(file, 'utf8')

  // 规则 1：frontmatter 可解析
  let meta, body
  try {
    ;({ meta, raw: body } = parseFrontmatter(raw))
  } catch {
    report(1, file, 'frontmatter 缺失或无法解析')
    continue
  }

  const norm = file.split(/[\\/]/).join('/') // Windows 路径归一化（join 生成 \）
  const isProject = norm.includes('/projects/')
  const isNote = norm.includes('/notes/')
  const required = isProject ? PROJECT_REQUIRED : NOTE_REQUIRED

  // 规则 2：必填字段齐全
  const missing = required.filter((k) => !(k in meta))
  if (missing.length) report(2, file, `缺必填字段: ${missing.join(', ')}`)

  // 规则 3：slug 唯一、kebab-case、与文件名一致
  const filename = file.split(/[\\/]/).pop().replace(/\.md$/, '')
  if (meta.slug && !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(meta.slug))
    report(3, file, `slug "${meta.slug}" 应为 kebab-case`)
  if (meta.slug !== filename) report(3, file, `slug "${meta.slug}" 与文件名 "${filename}" 不一致`)
  if (allSlugs.has(meta.slug)) report(3, file, `slug "${meta.slug}" 重复`)
  allSlugs.add(meta.slug)

  // 规则 4：枚举
  if (isProject && !STATUS_ENUM.has(meta.status)) report(4, file, `status "${meta.status}" 不在枚举内`)
  if (isNote && meta.type && !NOTE_TYPE_ENUM.has(meta.type)) report(4, file, `type "${meta.type}" 不在枚举内`)

  // 规则 5：date 格式
  if (meta.date && !/^\d{4}-\d{2}(-\d{2})?$/.test(meta.date))
    report(5, file, `date "${meta.date}" 格式应为 YYYY-MM 或 YYYY-MM-DD`)
  if (meta.date) {
    const m = /^(\d{4})-(\d{2})/.exec(meta.date)
    if (m && (Number(m[2]) < 1 || Number(m[2]) > 12)) report(5, file, `date 月份 ${m[2]} 非法`)
  }

  // 规则 6：tech 规范名
  if (isProject && Array.isArray(meta.tech)) {
    const bad = meta.tech.filter((t) => !TECH_WHITELIST.has(t))
    if (bad.length) report(6, file, `tech 含非规范名: ${bad.join(', ')}（先向 04 §7 表追加）`)
  } else if (isProject) {
    report(6, file, 'tech 应为数组')
  }

  // 规则 7：summary 长度、title 达标
  if (meta.summary && [...meta.summary].length > 100) report(7, file, `summary 超过 100 字（当前 ${[...meta.summary].length}）`)
  if (!meta.title) report(7, file, 'title 缺失')

  // 规则 8：项目必需段落（允许首发简写，但必需段落必须存在）
  if (isProject) {
    const missingS = REQUIRED_SECTIONS.filter((s) => !body.includes(`## ${s}`))
    if (missingS.length) report(8, file, `缺必需段落: ${missingS.join(', ')}`)
  }

  // 规则 9：demo / github / link 为 https URL
  for (const key of ['demo', 'github', 'link']) {
    const v = meta[key]
    if (v && !/^https:\/\/.+/.test(v)) report(9, file, `${key} "${v}" 应为 https:// URL`)
  }

  // 规则 10：站内链接指向存在的 slug（跨 projects/notes 校验，循环后复核）
  for (const m of body.matchAll(/\]\((\/(?:projects|notes)\/[a-z0-9-]+)(?:[?#][^)\s]*)?\)/g)) {
    innerLinks.push({ link: m[1], file })
  }

  // 规则 11：featured ≤ 3
  if (meta.featured === true) featuredCount.n++

  // 规则 13：<img> 必须带 alt
  for (const m of body.matchAll(/<img[^>]*>/g)) {
    if (!/alt=/.test(m[0])) report(13, file, 'img 标签缺少 alt 属性')
  }

  // 规则 14：数组字段元素为简单字符串
  for (const key of ['tech', 'tags']) {
    if (Array.isArray(meta[key])) {
      const bad = meta[key].filter((e) => typeof e !== 'string' || /[,\"'[\]]/.test(e))
      if (bad.length) report(14, file, `${key} 含非法元素: ${JSON.stringify(bad)}`)
    }
  }

  // 规则 15：非代码块内容不得出现 < 开头 HTML 标签（含结束标签 </xxx>）
  const nonCode = body
    .split(/^```/m)
    .filter((_, i) => i % 2 === 0) // 奇数索引为代码块，豁免
  for (const seg of nonCode) {
    for (const m of seg.matchAll(/<\/?[a-zA-Z][^>]*>/g)) {
      report(15, file, `正文出现 HTML 标签: ${m[0]}（代码块外禁止）`)
    }
  }
}

// --- 规则 11 汇总：featured ≤ 3 ---
if (featuredCount.n > 3) report(11, 'projects/*', `featured 项目 ${featuredCount.n} 个，超过 3 个上限`)

// --- 规则 10 汇总：站内链接目标存在（跨文件） ---
for (const { link, file } of innerLinks) {
  if (!allSlugs.has(link.split('/')[2])) report(10, file, `站内链接 "${link}" 指向不存在的 slug`)
}

// 收尾：全部检查完一次性打印（不 fail-fast），末尾汇总
if (errors.length) {
  console.error(errors.join('\n'))
  console.error(`共 ${errors.length} 个错误`)
  process.exit(1)
}
console.log('validate: OK')
