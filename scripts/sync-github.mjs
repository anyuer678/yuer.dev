#!/usr/bin/env node
// scripts/sync-github.mjs —— 构建期拉取 GitHub 仓库元数据（15 Wave 1.3）
// 产出 src/content/github-data.json；失败时保留旧文件并 warning，不中断构建。
// 用法：GITHUB_TOKEN=... node scripts/sync-github.mjs
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const USER = 'anyuer678'
const OUT = join(ROOT, 'src/content/github-data.json')
const MAP = join(ROOT, 'src/content/repo-map.json')
const TOKEN = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || ''

const headers = {
  Accept: 'application/vnd.github+json',
  'User-Agent': 'yuer-dev-sync',
  'X-GitHub-Api-Version': '2022-11-28',
}
if (TOKEN) headers.Authorization = `Bearer ${TOKEN}`

async function gh(path) {
  const res = await fetch(`https://api.github.com${path}`, { headers })
  if (!res.ok) {
    const err = new Error(`GitHub ${path} → ${res.status}`)
    err.status = res.status
    throw err
  }
  return res.json()
}

function pagesUrl(name) {
  return `https://${USER}.github.io/${name}/`
}

function ciBadge(status) {
  // 仅归一化展示用
  if (status === 'success') return 'success'
  if (status === 'failure') return 'failure'
  if (status === 'pending' || status === 'in_progress') return 'pending'
  return 'unknown'
}

async function main() {
  if (!existsSync(MAP)) {
    console.error('repo-map.json missing')
    process.exit(1)
  }
  const map = JSON.parse(readFileSync(MAP, 'utf8'))
  let list
  try {
    list = await gh(`/users/${USER}/repos?per_page=100&sort=updated`)
  } catch (e) {
    console.warn(`[sync-github] list failed: ${e.message}; keep previous github-data.json`)
    process.exit(0)
  }

  const repos = {}
  const mappedNames = new Set(Object.keys(map).filter((k) => !map[k].ignore))

  for (const repo of list) {
    const name = repo.name
    const entry = map[name]
    if (entry?.ignore) continue

    const data = {
      name,
      slug: entry?.slug ?? null,
      language: repo.language ?? null,
      stars: repo.stargazers_count ?? 0,
      forks: repo.forks_count ?? 0,
      open_issues: repo.open_issues_count ?? 0,
      pushed_at: repo.pushed_at ?? null,
      updated_at: repo.updated_at ?? null,
      default_branch: repo.default_branch ?? null,
      topics: Array.isArray(repo.topics) ? repo.topics : [],
      homepage: repo.homepage || null,
      pages_url: repo.has_pages ? pagesUrl(name) : null,
      ci_status: 'unknown',
      release: null,
      license: repo.license?.spdx_id ?? null,
      description: repo.description ?? null,
    }

    // 未映射但非 ignore 的新仓：仍然收录，slug 为 null 供 CI 警告
    if (!entry) data.unmapped = true

    // CI（失败不阻断该仓）
    try {
      const runs = await gh(`/repos/${USER}/${name}/actions/runs?per_page=1`)
      if (runs.workflow_runs?.length) {
        data.ci_status = ciBadge(runs.workflow_runs[0].conclusion || runs.workflow_runs[0].status)
      }
    } catch {
      /* keep unknown */
    }

    // latest release
    try {
      const rel = await gh(`/repos/${USER}/${name}/releases/latest`)
      data.release = rel.tag_name || null
    } catch {
      /* no release or 404 */
    }

    repos[name] = data
  }

  // 映射了但 API 列表没有的仓（私有/改名）保留提示
  for (const name of mappedNames) {
    if (!repos[name]) {
      console.warn(`[sync-github] mapped repo not in public list: ${name}`)
    }
  }

  const payload = {
    generatedAt: new Date().toISOString(),
    user: USER,
    repos,
  }
  writeFileSync(OUT, JSON.stringify(payload, null, 2) + '\n', 'utf8')

  const unmapped = Object.values(repos).filter((r) => r.unmapped)
  if (unmapped.length) {
    console.warn(
      `[sync-github] ${unmapped.length} unmapped repo(s): ${unmapped.map((r) => r.name).join(', ')}`
    )
  }
  console.log(`[sync-github] wrote ${Object.keys(repos).length} repos → src/content/github-data.json`)
}

main().catch((e) => {
  console.warn(`[sync-github] failed: ${e.message}`)
  process.exit(0)
})
