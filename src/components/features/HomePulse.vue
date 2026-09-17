<script setup>
// HomePulse —— 构建期 GitHub 活动条（15 Wave 2.1）；零运行时 fetch
import { computed } from 'vue'
import { githubData } from '@/utils/content.js'

const USER = computed(() => githubData.user || 'anyuer678')

const items = computed(() => {
  const repos = Object.values(githubData.repos || {})
  if (!repos.length) return []
  const out = []

  const withRelease = repos
    .filter((r) => r.release)
    .sort((a, b) => new Date(b.pushed_at || 0) - new Date(a.pushed_at || 0))[0]
  if (withRelease) {
    out.push({
      kind: 'release',
      label: `${withRelease.name} ${withRelease.release}`,
      to: withRelease.slug ? `/projects/${withRelease.slug}` : null,
      href: withRelease.slug
        ? null
        : `https://github.com/${USER.value}/${withRelease.name}/releases`,
      detail: '发布',
    })
  }

  const recent = repos
    .filter((r) => r.pushed_at)
    .sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at))
    .slice(0, 3)
  for (const r of recent) {
    out.push({
      kind: 'push',
      label: r.name,
      to: r.slug ? `/projects/${r.slug}` : null,
      href: r.slug ? null : `https://github.com/${USER.value}/${r.name}`,
      detail: timeAgo(r.pushed_at),
    })
  }

  const unmapped = repos.find((r) => r.unmapped)
  if (unmapped) {
    out.push({
      kind: 'new',
      label: unmapped.name,
      to: null,
      href: `https://github.com/${USER.value}/${unmapped.name}`,
      detail: '新仓',
    })
  }

  return out.slice(0, 4)
})

function timeAgo(iso) {
  if (!iso) return ''
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000)
  if (days <= 0) return '今天'
  if (days === 1) return '昨天'
  if (days < 30) return `${days} 天前`
  return `${Math.floor(days / 30)} 个月前`
}

const kindLabel = { release: 'Release', push: '推送', new: '新仓' }
</script>

<template>
  <aside v-if="items.length" class="pulse" aria-label="最近动态">
    <div class="container pulse__inner">
      <span class="pulse__mark">最近</span>
      <template v-for="(item, i) in items" :key="`${item.kind}-${item.label}`">
        <span v-if="i" class="pulse__dot" aria-hidden="true">·</span>
        <RouterLink v-if="item.to" :to="item.to" class="pulse__link">
          <span class="pulse__kind">{{ kindLabel[item.kind] }}</span>
          <span class="pulse__label">{{ item.label }}</span>
          <span v-if="item.kind === 'push'" class="pulse__detail">{{ item.detail }}</span>
        </RouterLink>
        <a
          v-else
          class="pulse__link"
          :href="item.href"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span class="pulse__kind">{{ kindLabel[item.kind] }}</span>
          <span class="pulse__label">{{ item.label }}</span>
          <span v-if="item.kind === 'push'" class="pulse__detail">{{ item.detail }}</span>
        </a>
      </template>
    </div>
  </aside>
</template>

<style scoped>
.pulse {
  border-block: var(--border-default);
  background: var(--color-surface-muted);
}
.pulse__inner {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-2) var(--space-3);
  padding-block: var(--space-3);
  font-family: var(--font-mono);
  font-size: var(--text-caption);
  color: var(--color-text-secondary);
}
.pulse__mark {
  color: var(--color-accent);
  letter-spacing: 0.04em;
  flex-shrink: 0;
}
.pulse__dot {
  color: var(--color-text-tertiary);
}
.pulse__link {
  display: inline-flex;
  align-items: baseline;
  gap: var(--space-2);
  color: inherit;
  text-decoration: none;
  max-width: 100%;
  min-width: 0;
}
.pulse__link:hover .pulse__label {
  color: var(--color-accent);
}
.pulse__kind {
  color: var(--color-text-tertiary);
  font-size: 11px;
  flex-shrink: 0;
}
.pulse__label {
  color: var(--color-text);
  transition: color var(--dur-fast) var(--ease-standard);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.pulse__detail {
  color: var(--color-text-tertiary);
  flex-shrink: 0;
}
</style>
