<script setup>
import { ref, computed, onMounted } from 'vue'
import { githubData } from '@/utils/content.js'

// 仓单（15 仓）：保持 docs/15 §1 记录的既有形态，本次不改动收录范围。
const REPO_LIST = [
  'desktoppet', 'lumen', 'kb-ui', 'codedrill', 'dsh-logtimeline',
  'voiceconsole', 'keyvault', 'picren', 'upgrademate', 'chatez',
  'evocode', 'developer-intelligence', 'stargrave', 'yuer.dev', 'ai-toolbox',
]

// 构建期数据：scripts/sync-github.mjs 在 CI 里带 GITHUB_TOKEN 拉取后写入
// src/content/github-data.json（.github/workflows/deploy.yml 的 sync:github 步）。
// 它的字段与下面要展示的列一一对应，所以可以直接当"兜底底稿"用。
const BUILT = githubData.repos || {}
const BUILT_AT = githubData.generatedAt || ''

// 匿名 GitHub API 的额度是 60 次/小时/IP，而完整刷一遍要 ~30–45 次请求。
// 原先每次打开都无条件刷一遍 → 同一小时内第二次访问时额度已耗尽，
// 整张表会退化成一片 ⚪（还不知道为什么）。缓存窗口与限流窗口对齐即可根治。
const CACHE_KEY = 'yuer.dashboard.live.v1'
const CACHE_TTL = 60 * 60 * 1000

function fromBuild(name) {
  const r = BUILT[name]
  return {
    name,
    language: r?.language ?? null,
    pushed_at: r?.pushed_at ?? '',
    ci_status: r?.ci_status ?? 'unknown',
    release: r?.release ?? null,
    open_issues: r?.open_issues ?? 0,
  }
}

// 先用构建期数据铺底：网络慢或被限额时，第一屏仍是正确内容，而不是 20 秒白屏 + "加载中..."
const repos = ref(REPO_LIST.map(fromBuild))
const loading = ref(false)
const source = ref('build') // build | live | cache
const at = ref('')
const error = ref('')

const stampLabel = computed(() => {
  if (source.value === 'live') return `实时数据 · ${at.value}`
  if (source.value === 'cache') return `缓存数据 · ${at.value}`
  if (!BUILT_AT) return ''
  const d = new Date(BUILT_AT)
  return Number.isNaN(d.getTime()) ? '' : `构建期数据 · ${d.toLocaleString('zh-CN')}`
})

function readCache() {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const c = JSON.parse(raw)
    if (!c || typeof c.at !== 'number') return null
    if (Date.now() - c.at > CACHE_TTL) return null
    if (!Array.isArray(c.rows) || c.rows.length !== REPO_LIST.length) return null
    return c
  } catch {
    // 隐私模式 / 禁用了存储：直接走实时拉取
    return null
  }
}

function writeCache() {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), rows: repos.value }))
  } catch {
    /* 存不下就算了，只是下次要重新拉 */
  }
}

async function refresh() {
  loading.value = true
  error.value = ''

  // 从构建期数据起步：任何单仓失败都保留构建期值，而不是把它抹成 null
  const next = REPO_LIST.map(fromBuild)
  let forbidden = 0
  let resolved = 0

  for (let i = 0; i < REPO_LIST.length; i++) {
    const name = REPO_LIST[i]
    try {
      const repoRes = await fetch(`https://api.github.com/repos/anyuer678/${name}`)
      if (repoRes.status === 403 || repoRes.status === 429) {
        forbidden++
        continue
      }
      if (!repoRes.ok) continue

      const repo = await repoRes.json()
      resolved++
      next[i].language = repo.language ?? null
      next[i].pushed_at = repo.pushed_at ?? ''
      next[i].open_issues = repo.open_issues_count || 0

      try {
        const ciRes = await fetch(`https://api.github.com/repos/anyuer678/${name}/actions/runs?per_page=1`)
        if (ciRes.ok) {
          const ci = await ciRes.json()
          if (ci.workflow_runs?.length > 0) {
            next[i].ci_status = ci.workflow_runs[0].conclusion || 'pending'
          }
        }
      } catch {
        /* 保留构建期值 */
      }

      // 构建期已知「没有 release」的仓不再打 releases/latest：
      // 那是每次必然 404 的请求（实测 45 次里 11 次是这类），既浪费额度又刷 console 报错。
      if (next[i].release) {
        try {
          const relRes = await fetch(`https://api.github.com/repos/anyuer678/${name}/releases/latest`)
          if (relRes.ok) next[i].release = (await relRes.json()).tag_name || null
        } catch {
          /* 保留构建期值 */
        }
      }
    } catch {
      /* 单仓网络失败不影响其余仓 */
    }
  }

  repos.value = next
  loading.value = false

  if (forbidden) {
    error.value = `GitHub API 返回 ${forbidden} 次限流（匿名额度 60 次/小时/IP）。已回退到构建期数据，约一小时后可重试。`
    return
  }
  if (!resolved) {
    error.value = '未能获取实时数据，当前显示构建期数据。'
    return
  }

  source.value = 'live'
  at.value = new Date().toLocaleString('zh-CN')
  writeCache()
}

onMounted(() => {
  const c = readCache()
  if (c) {
    repos.value = c.rows
    source.value = 'cache'
    at.value = new Date(c.at).toLocaleString('zh-CN')
    return
  }
  refresh()
})

function ciBadge(status) {
  switch (status) {
    case 'success': return '🟢'
    case 'failure': return '🔴'
    case 'pending': return '🟡'
    default: return '⚪'
  }
}

function timeAgo(dateStr) {
  if (!dateStr) return '-'
  const diff = Date.now() - new Date(dateStr).getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return '今天'
  if (days === 1) return '昨天'
  return `${days} 天前`
}
</script>

<template>
  <div class="dash">
    <h1 class="dash__title">📊 作品集控制面板</h1>
    <p class="dash__lead">
      15 个仓库的 CI / Release / 活跃度概览
      <button v-if="!loading" class="dash__btn" @click="refresh">🔄 刷新</button>
      <span v-if="stampLabel" class="dash__stamp">{{ stampLabel }}</span>
    </p>

    <p v-if="loading" class="dash__note">正在获取实时数据…</p>
    <p v-if="error" class="dash__warn" role="status">{{ error }}</p>

    <table class="dash__table">
      <thead>
        <tr>
          <th>仓库</th>
          <th>语言</th>
          <th>CI</th>
          <th>Release</th>
          <th>最后推送</th>
          <th>Issues</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="repo in repos"
          :key="repo.name"
          :class="{ 'dash__row--fail': repo.ci_status === 'failure' }"
        >
          <td class="dash__name">
            <a :href="`https://github.com/anyuer678/${repo.name}`" target="_blank" rel="noopener">
              {{ repo.name }}
            </a>
          </td>
          <td class="dash__dim">{{ repo.language || '-' }}</td>
          <td>{{ ciBadge(repo.ci_status) }}</td>
          <td class="dash__dim">{{ repo.release || '-' }}</td>
          <td class="dash__dim">{{ timeAgo(repo.pushed_at) }}</td>
          <td>{{ repo.open_issues }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.dash {
  padding: 32px 0;
}
.dash__title {
  font-size: 24px;
  margin-bottom: 8px;
}
.dash__lead {
  color: var(--text-3, #888);
  margin-bottom: 12px;
}
.dash__btn {
  margin-left: 12px;
  padding: 4px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}
.dash__stamp {
  margin-left: 8px;
  font-size: 12px;
  color: #aaa;
}
.dash__note {
  color: #888;
  font-size: 13px;
  margin-bottom: 8px;
}
.dash__warn {
  color: #9a5b1e;
  font-size: 13px;
  margin-bottom: 12px;
}
.dash__table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}
.dash__table th {
  padding: 8px 12px;
  text-align: left;
  border-bottom: 2px solid #e2d9c3;
}
.dash__table td {
  padding: 8px 12px;
  border-bottom: 1px solid #f0ebe3;
}
.dash__row--fail {
  background: #fef2f2;
}
.dash__name {
  font-weight: 600;
}
.dash__name a {
  color: inherit;
  text-decoration: none;
}
.dash__dim {
  font-size: 12px;
  color: #666;
}
</style>
