<script setup>
import { ref, onMounted } from 'vue'

const repos = ref([])
const loading = ref(true)
const lastUpdate = ref('')

const REPO_LIST = [
  'desktoppet', 'lumen', 'kb-ui', 'codedrill', 'dsh-logtimeline',
  'voiceconsole', 'keyvault', 'picren', 'upgrademate', 'chatez',
  'evocode', 'developer-intelligence', 'stargrave', 'yuer.dev', 'ai-toolbox'
]

async function fetchRepos() {
  loading.value = true
  const results = []

  for (const name of REPO_LIST) {
    try {
      const repoRes = await fetch(`https://api.github.com/repos/anyuer678/${name}`)
      if (!repoRes.ok) {
        results.push({ name, language: null, pushed_at: '', ci_status: 'unknown', release: null, open_issues: 0 })
        continue
      }
      const repo = await repoRes.json()

      let ci_status = 'unknown'
      try {
        const ciRes = await fetch(`https://api.github.com/repos/anyuer678/${name}/actions/runs?per_page=1`)
        if (ciRes.ok) {
          const ci = await ciRes.json()
          if (ci.workflow_runs?.length > 0) {
            ci_status = ci.workflow_runs[0].conclusion || 'pending'
          }
        }
      } catch { /* ignore */ }

      let release = null
      try {
        const relRes = await fetch(`https://api.github.com/repos/anyuer678/${name}/releases/latest`)
        if (relRes.ok) {
          const rel = await relRes.json()
          release = rel.tag_name || null
        }
      } catch { /* ignore */ }

      results.push({
        name,
        language: repo.language,
        pushed_at: repo.pushed_at,
        ci_status,
        release,
        open_issues: repo.open_issues_count || 0,
      })
    } catch {
      results.push({ name, language: null, pushed_at: '', ci_status: 'unknown', release: null, open_issues: 0 })
    }
  }

  repos.value = results
  lastUpdate.value = new Date().toLocaleString('zh-CN')
  loading.value = false
}

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

onMounted(fetchRepos)
</script>

<template>
  <div class="container" style="padding: 32px 0">
    <h1 style="font-size: 24px; margin-bottom: 8px">📊 作品集控制面板</h1>
    <p style="color: var(--text-3, #888); margin-bottom: 24px">
      15 个仓库的 CI / Release / 活跃度概览
      <button
        v-if="!loading"
        style="margin-left: 12px; padding: 4px 12px; border: 1px solid #ccc; border-radius: 4px; cursor: pointer; font-size: 12px"
        @click="fetchRepos"
      >
        🔄 刷新
      </button>
      <span v-if="lastUpdate" style="margin-left: 8px; font-size: 12px; color: #aaa">
        更新于 {{ lastUpdate }}
      </span>
    </p>

    <div v-if="loading" style="text-align: center; padding: 40px; color: #888">
      加载中...
    </div>

    <table v-else style="width: 100%; border-collapse: collapse; font-size: 14px">
      <thead>
        <tr style="border-bottom: 2px solid #e2d9c3; text-align: left">
          <th style="padding: 8px 12px">仓库</th>
          <th style="padding: 8px 12px">语言</th>
          <th style="padding: 8px 12px">CI</th>
          <th style="padding: 8px 12px">Release</th>
          <th style="padding: 8px 12px">最后推送</th>
          <th style="padding: 8px 12px">Issues</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="repo in repos"
          :key="repo.name"
          style="border-bottom: 1px solid #f0ebe3"
          :style="{ background: repo.ci_status === 'failure' ? '#fef2f2' : undefined }"
        >
          <td style="padding: 8px 12px; font-weight: 600">
            <a
              :href="`https://github.com/anyuer678/${repo.name}`"
              target="_blank"
              style="color: inherit; text-decoration: none"
            >
              {{ repo.name }}
            </a>
          </td>
          <td style="padding: 8px 12px; color: #666">{{ repo.language || '-' }}</td>
          <td style="padding: 8px 12px">{{ ciBadge(repo.ci_status) }}</td>
          <td style="padding: 8px 12px; font-size: 12px; color: #666">{{ repo.release || '-' }}</td>
          <td style="padding: 8px 12px; font-size: 12px; color: #666">{{ timeAgo(repo.pushed_at) }}</td>
          <td style="padding: 8px 12px">{{ repo.open_issues }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
