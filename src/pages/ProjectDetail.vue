<script setup>
// ProjectDetail 详情页（F04）：懒加载原文 + markdown 渲染
import { ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import StatusBadge from '@/components/ui/StatusBadge.vue'
import Tag from '@/components/ui/Tag.vue'
import ExternalLink from '@/components/ui/ExternalLink.vue'
import ArticleContent from '@/components/features/ArticleContent.vue'
import { getProject, projectRawFiles } from '@/utils/content.js'
import { renderMarkdown } from '@/utils/markdown.js'
import { setTitle, setDescription } from '@/utils/seo.js'

const route = useRoute()

const project = ref(getProject(route.params.slug))
const html = ref('')

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

  setTitle(`${project.value.title} · ${project.value.subtitle || ''}`)
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
  <div v-if="!project" class="container container--narrow">
    <!-- slug 不存在 → 404（F04） -->
    <p>项目不存在</p>
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
          <ExternalLink v-if="project.github" :href="project.github">GitHub</ExternalLink>
          <ExternalLink v-if="project.demo" :href="project.demo">Demo</ExternalLink>
        </div>
      </header>

      <hr class="project-detail__divider" />

      <ArticleContent :html="html" />
  </div>
</template>

<style scoped>
.back-link {
  display: inline-block;
  margin-block: var(--space-6) var(--space-2);
  font-size: var(--text-small);
  color: var(--color-text-tertiary);
}
.back-link:hover {
  color: var(--color-accent);
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
  color: var(--color-text-tertiary);
}
.project-detail__divider {
  margin: var(--space-8) 0;
  border: none;
  border-top: 1px solid var(--color-border);
}
</style>
