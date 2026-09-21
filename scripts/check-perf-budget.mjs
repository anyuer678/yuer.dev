#!/usr/bin/env node
// 资源体积预算（npm run check:perf-budget）
// 覆盖 public/ 下 glb / 大图 / draco 等重资产；超阈值 warn 或 fail。
// 文档口径：07 工程规范 · 性能预算；不改变 UI，只约束资产债务。
import { readdirSync, statSync } from 'node:fs'
import { join, relative, extname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const PUBLIC = join(ROOT, 'public')

/** 阈值单位：KB。fail=硬失败；warn=打印警告不失败
 *  说明：项目封面 fail 放宽到 450KB，覆盖既有 portfolio 截图债务（cet6-vocabulary.png ~408KB），
 *  新增资产请压到 warn 线以下。 */
const BUDGETS = [
  { label: 'glb 模型', test: (rel) => rel.startsWith('models/') && rel.endsWith('.glb'), failKB: 1500, warnKB: 800 },
  { label: 'draco 解码器', test: (rel) => rel.startsWith('draco/'), failKB: 600, warnKB: 300 },
  { label: '项目封面图', test: (rel) => rel.startsWith('projects/'), failKB: 450, warnKB: 120 },
  { label: '房间/Garden 图', test: (rel) => rel.startsWith('images/'), failKB: 700, warnKB: 400 },
  { label: '任意 public 文件', test: () => true, failKB: 2000, warnKB: 1200 }
]

function walk(dir, base = dir) {
  const out = []
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name)
    if (e.isDirectory()) out.push(...walk(p, base))
    else out.push({ abs: p, rel: relative(base, p).replace(/\\/g, '/'), sizeKB: statSync(p).size / 1024 })
  }
  return out
}

const files = walk(PUBLIC)
const failures = []
const warnings = []
const rows = []

for (const f of files) {
  const ext = extname(f.rel).toLowerCase()
  if (!['.glb', '.png', '.jpg', '.jpeg', '.webp', '.wasm', '.js', '.json', '.svg'].includes(ext)) continue
  const matched = BUDGETS.filter((b) => b.test(f.rel))
  const budget = matched[0] // 最具体的一条
  if (!budget) continue
  const size = Math.round(f.sizeKB)
  rows.push({ rel: f.rel, size, label: budget.label })
  if (size >= budget.failKB) {
    failures.push(`FAIL ${budget.label} ${f.rel} = ${size}KB (上限 ${budget.failKB}KB)`)
  } else if (size >= budget.warnKB) {
    warnings.push(`WARN ${budget.label} ${f.rel} = ${size}KB (警戒 ${budget.warnKB}KB)`)
  }
}

rows.sort((a, b) => b.size - a.size)
console.log('yuer.dev perf budget — public/ 资产扫描')
console.log('Top assets:')
for (const r of rows.slice(0, 15)) {
  console.log(`  ${String(r.size).padStart(6)} KB  [${r.label}] ${r.rel}`)
}

if (warnings.length) {
  console.log('\nWarnings:')
  for (const w of warnings) console.log('  ' + w)
}

if (failures.length) {
  console.log('\nFailures:')
  for (const f of failures) console.log('  ' + f)
  console.error(`\nperf budget FAILED (${failures.length} violation(s))`)
  process.exit(1)
}

console.log('\nperf budget OK' + (warnings.length ? `（${warnings.length} 条警告）` : ''))
