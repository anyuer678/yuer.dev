// scripts/gen-content-meta.mjs —— 把 content/{notes,projects}/*.md 的 frontmatter
// 抽成 src/content/_meta/*.json。
//
// 为什么需要：utils/content.js 原先用 `eager: true` 的 raw glob 读取全部 markdown，
// 只为解析每篇的 frontmatter。112 篇笔记合计 3.1MB（其中 8 篇超长笔记就占一半），
// 全部被打进主包 —— 首屏 gzip 因此多出约 900KB。
// 正文并不需要进主包：noteRawFiles / projectRawFiles 已经用非 eager glob 按需加载。
//
// 复用 src/utils/parse-frontmatter.js，保证解析行为与内容校验脚本完全一致。
// 独立可执行（npm run content:meta），也被 vite 插件调用，保证 dev/build 时数据新鲜。
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const KINDS = ['notes', 'projects']

export async function generateContentMeta(rootDir = process.cwd()) {
  const { parseFrontmatter } = await import(
    pathToFileURL(path.join(rootDir, 'src/utils/parse-frontmatter.js')).href
  )
  const outDir = path.join(rootDir, 'src/content/_meta')
  fs.mkdirSync(outDir, { recursive: true })

  const stats = {}
  for (const kind of KINDS) {
    const dir = path.join(rootDir, 'src/content', kind)
    if (!fs.existsSync(dir)) {
      stats[kind] = 0
      continue
    }
    const index = {}
    const failed = []
    for (const f of fs.readdirSync(dir).sort()) {
      // _ 前缀是模板文件，与 content.js 的入管线规则保持一致
      if (!f.endsWith('.md') || f.startsWith('_')) continue
      const raw = fs.readFileSync(path.join(dir, f), 'utf8')
      try {
        index[f.replace(/\.md$/, '')] = parseFrontmatter(raw).meta
      } catch (e) {
        failed.push(`${kind}/${f}: ${e.message}`)
      }
    }
    if (failed.length) {
      // frontmatter 缺失等问题由 npm run validate 统一拦截，这里只提示
      console.warn('[content-meta] 跳过 %d 个文件:\n  %s', failed.length, failed.join('\n  '))
    }
    const file = path.join(outDir, `${kind}.json`)
    const next = JSON.stringify(index, null, 2) + '\n'
    // 内容没变就不写盘，否则 dev 下会触发无意义的循环刷新
    const prev = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : null
    if (prev !== next) fs.writeFileSync(file, next)
    stats[kind] = Object.keys(index).length
  }
  return stats
}

// 作为脚本直接执行时跑一次
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const stats = await generateContentMeta(process.cwd())
  console.log(
    '[content-meta] notes=%d projects=%d -> src/content/_meta/',
    stats.notes,
    stats.projects
  )
}
