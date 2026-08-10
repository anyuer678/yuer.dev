// 内容校验（npm run validate）—— L1 基础骨架（P0）
// 规则清单 04 §9；完整实现 P2 补全（规则 1–15 按 14 §6.4 表）。
// frontmatter 解析复用浏览器同款实现，杜绝双实现漂移（依赖 package.json "type": "module"）。
import { readdirSync, readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { parseFrontmatter } from '../src/utils/parse-frontmatter.js'

const ROOT = 'src/content'
const errors = []
const report = (rule, file, msg) => errors.push(`ERROR [规则${rule}] ${file}: ${msg}`)

function walk(dir) {
  // _ 开头文件/目录一律跳过（模板不入管线）
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.name.startsWith('_') ? [] : e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)]
  )
}

function checkJson(file, schemaName) {
  if (!existsSync(file)) return
  try {
    const data = JSON.parse(readFileSync(file, 'utf8'))
    if (!Array.isArray(data) && typeof data !== 'object') {
      report(12, file, `${schemaName} 应为对象或数组`)
    }
  } catch (e) {
    report(12, file, `JSON 解析失败：${e.message}`)
  }
}

// --- 规则 1：每个 md 文件 frontmatter 可解析 ---
const mdFiles = walk(ROOT).filter((f) => f.endsWith('.md'))
for (const file of mdFiles) {
  const raw = readFileSync(file, 'utf8')
  try {
    parseFrontmatter(raw)
  } catch {
    report(1, file, 'frontmatter 缺失或无法解析（须以 --- 开头）')
  }
}

// --- 规则 12：site.json / lab.json / timeline.json 合法 JSON ---
checkJson(join(ROOT, 'site.json'), 'site.json')
checkJson(join(ROOT, 'lab.json'), 'lab.json')
checkJson(join(ROOT, 'timeline.json'), 'timeline.json')

// 收尾：全部检查完一次性打印（不 fail-fast），末尾汇总
if (errors.length) {
  console.error(errors.join('\n'))
  console.error(`共 ${errors.length} 个错误`)
  process.exit(1)
}
console.log('validate: OK')
