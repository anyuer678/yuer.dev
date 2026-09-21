<script setup>
// ProjectDetail 详情页（F04）：懒加载原文 + markdown 渲染
import { computed, ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import StatusBadge from '@/components/ui/StatusBadge.vue'
import Tag from '@/components/ui/Tag.vue'
import ExternalLink from '@/components/ui/ExternalLink.vue'
import ArticleContent from '@/components/features/ArticleContent.vue'
import { getProject, getNote, projectRawFiles, site } from '@/utils/content.js'
import { renderMarkdown } from '@/utils/markdown.js'
import { setTitle, setDescription } from '@/utils/seo.js'
import deskMap from '@/content/desk.json'

const baseUrl = import.meta.env.BASE_URL

const route = useRoute()

const project = ref(getProject(route.params.slug))
const html = ref('')
const relatedNotes = ref([])

const repoStats = computed(() => project.value?.repoStats)
const deskTo = computed(() => {
  const slug = project.value?.slug
  return slug && deskMap[slug] ? `/desk/${slug}` : null
})

function timeAgo(iso) {
  if (!iso) return ''
  const diff = Date.now() - new Date(iso).getTime()
  const days = Math.floor(diff / 86400000)
  if (days <= 0) return '今天'
  if (days === 1) return '昨天'
  if (days < 30) return `${days} 天前`
  const months = Math.floor(days / 30)
  if (months < 12) return `${months} 个月前`
  return `${Math.floor(months / 12)} 年前`
}

// 正文异步加载 + title/description 覆盖（14 §5.7）
// 竞态防护：slug 快速切换时丢弃过期 promise 结果（onInvalidate 清理）
watchEffect(async (onInvalidate) => {
  const slug = route.params.slug
  let cancelled = false
  onInvalidate(() => {
    cancelled = true
  })
  project.value = getProject(slug)
  if (!project.value) return // 404 兜底由下方 if 处理
  relatedNotes.value = (project.value.related ?? []).map(getNote).filter(Boolean)

  setTitle(`${project.value.title} · ${project.value.subtitle || site.name}`)
  setDescription(project.value.summary)

  const loader = projectRawFiles[slug]
  if (loader) {
    html.value = '' // 切换时清空旧正文，避免闪现
    const raw = await loader()
    if (!cancelled) html.value = renderMarkdown(raw, slug)
  }
})
</script>

<template>
  <div class="project-detail-root">
    <div v-if="!project" class="container container--narrow project-detail-missing">
      <!-- slug 不存在 → 404（F04） -->
      <h1>项目不存在</h1>
      <RouterLink to="/projects" class="back-link">← 返回项目列表</RouterLink>
    </div>

    <div v-else class="container container--narrow project-detail">
      <RouterLink to="/projects" class="back-link">← 返回项目列表</RouterLink>
      <header class="project-detail__head">
        <div class="project-detail__title-row">
          <h1>{{ project.title }}</h1>
          <StatusBadge :status="project.status" />
        </div>
        <p v-if="project.subtitle" class="project-detail__subtitle">{{ project.subtitle }}</p>
        <div class="project-detail__tech">
          <Tag v-for="t in project.tech" :key="t" :label="t" />
        </div>
        <div class="project-detail__meta">
          <time :datetime="project.date">{{ project.date }}</time>
          <RouterLink v-if="deskTo" :to="deskTo">入案头</RouterLink>
          <ExternalLink v-if="project.demo" :href="project.demo">在线试用</ExternalLink>
          <ExternalLink v-if="project.github" :href="project.github">GitHub</ExternalLink>
        </div>
      </header>

      <img
        v-if="project.cover"
        :src="baseUrl + project.cover"
        :alt="`${project.title} 预览`"
        class="project-detail__cover"
        loading="lazy"
        decoding="async"
      />

      <hr class="project-detail__divider" />

      <section v-if="repoStats" class="project-detail__repo" aria-label="仓库现场">
        <div class="project-detail__repo-grid">
          <div v-if="repoStats.language" class="project-detail__repo-item">
            <span class="project-detail__repo-label">语言</span>
            <span class="project-detail__repo-value">{{ repoStats.language }}</span>
          </div>
          <div v-if="repoStats.release" class="project-detail__repo-item">
            <span class="project-detail__repo-label">最新 Release</span>
            <span class="project-detail__repo-value">{{ repoStats.release }}</span>
          </div>
          <div v-if="repoStats.stars" class="project-detail__repo-item">
            <span class="project-detail__repo-label">Stars</span>
            <span class="project-detail__repo-value">{{ repoStats.stars }}</span>
          </div>
          <div v-if="repoStats.ci_status && repoStats.ci_status !== 'unknown'" class="project-detail__repo-item">
            <span class="project-detail__repo-label">CI</span>
            <span class="project-detail__repo-value project-detail__ci" :data-ci="repoStats.ci_status">
              {{ { success: '通过', failure: '失败', pending: '进行中' }[repoStats.ci_status] || repoStats.ci_status }}
            </span>
          </div>
          <div v-if="repoStats.pushed_at" class="project-detail__repo-item">
            <span class="project-detail__repo-label">最后推送</span>
            <span class="project-detail__repo-value">{{ timeAgo(repoStats.pushed_at) }}</span>
          </div>
        </div>
      </section>

      <section v-if="project.journey?.length" class="project-detail__journey">
        <h2 class="project-detail__journey-title">开发历程</h2>
        <ol class="project-detail__journey-list">
          <li v-for="(j, i) in project.journey" :key="i" class="project-detail__journey-item">
            <time class="project-detail__journey-date">{{ j.date }}</time>
            <span class="project-detail__journey-name">{{ j.title }}</span>
            <p v-if="j.desc" class="project-detail__journey-desc">{{ j.desc }}</p>
          </li>
        </ol>
      </section>

      <ArticleContent :html="html" />

      <section v-if="relatedNotes.length" class="project-detail__related">
        <h2 class="project-detail__related-title">相关笔记</h2>
        <ul class="project-detail__related-list">
          <li v-for="n in relatedNotes" :key="n.slug">
            <RouterLink :to="`/notes/${n.slug}`" class="project-detail__related-link">
              <span class="project-detail__related-name">{{ n.title }}</span>
              <span class="project-detail__related-summary">{{ n.summary }}</span>
            </RouterLink>
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>

<style scoped>
.project-detail-root {
  /* 单根容器：保证 <Transition> 可动画（组件根必须是单元素，14 §5.1） */
}
.project-detail-missing {
  padding-block: var(--space-12) var(--space-16);
}
.project-detail-missing h1 {
  font-size: var(--text-h1);
  line-height: var(--lh-h1);
}
.back-link {
  display: inline-block;
  margin-block: var(--space-6) var(--space-2);
  font-size: var(--text-small);
  color: var(--color-text-secondary);
  transition:
    color var(--dur-fast) var(--ease-standard),
    transform var(--dur-fast) var(--ease-standard);
}
.back-link:hover {
  color: var(--color-accent);
  transform: translateX(-2px);
}
.project-detail {
  max-width: var(--container-narrow);
  padding-bottom: var(--space-16);
}
.project-detail__title-row {
  display: flex;
  align-items: baseline;
  gap: var(--space-3);
  flex-wrap: wrap;
}
.project-detail h1 {
  font-family: var(--font-display);
  font-size: var(--text-h1);
  line-height: var(--lh-h1);
}
.project-detail__subtitle {
  margin-top: var(--space-2);
  font-family: var(--font-mono);
  font-size: var(--text-small);
  color: var(--color-text-secondary);
}
.project-detail__tech {
  margin-top: var(--space-4);
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}
.project-detail__meta {
  margin-top: var(--space-4);
  display: flex;
  align-items: center;
  gap: var(--space-6);
  font-family: var(--font-mono);
  font-size: var(--text-caption);
  color: var(--color-text-secondary);
}
.project-detail__cover {
  display: block;
  width: 100%;
  height: auto;
  border: var(--border-default);
  border-radius: var(--radius-lg);
  margin: var(--space-6) 0 0;
  background: var(--color-surface-muted);
}
.project-detail__divider {
  margin: var(--space-8) 0;
  border: none;
  border-top: 1px solid var(--color-border);
}
.project-detail__repo {
  margin-bottom: var(--space-8);
  padding: var(--space-5) var(--space-6);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface-muted);
}
.project-detail__repo-grid {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-5) var(--space-8);
}
.project-detail__repo-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 88px;
}
.project-detail__repo-label {
  font-size: var(--text-caption);
  color: var(--color-text-secondary);
}
.project-detail__repo-value {
  font-family: var(--font-mono);
  font-size: var(--text-small);
  color: var(--color-text);
}
.project-detail__ci[data-ci='success'] {
  color: var(--status-done-text, #2f6b3a);
}
.project-detail__ci[data-ci='failure'] {
  color: var(--status-archived-text, #a33);
}
.project-detail__journey {
  margin-bottom: var(--space-8);
  padding: var(--space-6);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface);
}
.project-detail__journey-title {
  font-family: var(--font-display);
  font-size: var(--text-h3);
  line-height: var(--lh-h3);
  margin-bottom: var(--space-5);
}
.project-detail__journey-list {
  list-style: none;
  margin: 0;
  padding: 0;
}
.project-detail__journey-item {
  position: relative;
  padding: 0 0 var(--space-5) var(--space-6);
  border-left: 1px solid var(--color-border);
  margin-left: var(--space-2);
}
.project-detail__journey-item:last-child {
  padding-bottom: 0;
}
.project-detail__journey-item::before {
  content: '';
  position: absolute;
  left: -5px;
  top: 3px;
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: var(--color-accent);
}
.project-detail__journey-date {
  display: inline-block;
  margin-right: var(--space-3);
  font-family: var(--font-mono);
  font-size: var(--text-caption);
  color: var(--color-accent);
}
.project-detail__journey-name {
  font-family: var(--font-display);
  color: var(--color-text);
}
.project-detail__journey-desc {
  margin-top: var(--space-1);
  font-size: var(--text-small);
  color: var(--color-text-secondary);
}
.project-detail__related {
  margin-top: var(--space-10);
  padding: var(--space-6);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface);
  box-shadow: var(--shadow-card);
}
.project-detail__related-title {
  font-family: var(--font-display);
  font-size: var(--text-h3);
  line-height: var(--lh-h3);
  margin-bottom: var(--space-4);
}
.project-detail__related-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}
.project-detail__related-link {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  padding: var(--space-3);
  border-radius: var(--radius-sm);
  transition:
    background var(--dur-fast) var(--ease-standard),
    color var(--dur-fast) var(--ease-standard);
}
.project-detail__related-link:hover {
  background: var(--color-surface-muted);
}
.project-detail__related-name {
  font-family: var(--font-display);
  color: var(--color-text);
}
.project-detail__related-link:hover .project-detail__related-name {
  color: var(--color-accent);
}
.project-detail__related-summary {
  font-size: var(--text-caption);
  color: var(--color-text-secondary);
}
</style>
