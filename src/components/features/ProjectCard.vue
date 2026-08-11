<script setup>
// ProjectCard —— 项目档案卡片（05 §3；09 §5 骨架）
// 主链接用 cover-link overlay 方案（14 §5.11）：<RouterLink class="cover"> 为空白
// 覆盖层，::after 绝对定位覆盖整卡；卡内 GitHub/Demo 等独立链接 z-index 抬升
// —— 禁止 a 嵌套 a
import StatusBadge from '@/components/ui/StatusBadge.vue'
import Tag from '@/components/ui/Tag.vue'
import ExternalLink from '@/components/ui/ExternalLink.vue'

const baseUrl = import.meta.env.BASE_URL

defineProps({
  project: { type: Object, required: true },
  featured: { type: Boolean, default: false },
  showCover: { type: Boolean, default: true },
})
</script>

<template>
  <article class="project-card" :class="{ 'project-card--featured': featured }">
    <!-- cover 覆盖层：absolute 铺满整卡，可点可聚焦；内部链接 z-index 抬升 -->
    <RouterLink
      :to="`/projects/${project.slug}`"
      class="project-card__cover"
      :aria-label="`查看项目 ${project.title} 详情`"
    />
    <img
      v-if="project.cover && showCover"
      :src="baseUrl + project.cover"
      :alt="`${project.title} 预览`"
      class="project-card__img"
      loading="lazy"
    />
    <header class="project-card__head">
      <h3 class="project-card__title">{{ project.title }}</h3>
      <StatusBadge :status="project.status" />
    </header>
    <p v-if="project.subtitle" class="project-card__subtitle">{{ project.subtitle }}</p>
    <p class="project-card__summary">{{ project.summary }}</p>
    <div class="project-card__tech">
      <Tag v-for="t in project.tech" :key="t" :label="t" />
    </div>
    <footer class="project-card__foot">
      <ExternalLink v-if="project.github" :href="project.github">GitHub</ExternalLink>
      <ExternalLink v-if="project.demo" :href="project.demo">Demo</ExternalLink>
    </footer>
  </article>
</template>

<style scoped>
.project-card {
  position: relative; /* cover ::after 定位基准 */
  background: var(--color-surface);
  border: var(--border-default);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
  padding: var(--space-6);
  transition:
    box-shadow var(--dur-fast) var(--ease-standard),
    transform var(--dur-fast) var(--ease-standard);
}
.project-card:hover {
  box-shadow: var(--shadow-card-hover);
  transform: translateY(-2px);
}
/* cover-link overlay（14 §5.11）：自身 absolute 铺满整卡的隐形链接层 */
.project-card__cover {
  position: absolute;
  inset: 0;
  z-index: 1;
  border-radius: inherit;
}
.project-card__img {
  display: block;
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
  object-position: center;
  border: var(--border-default);
  border-radius: var(--radius-md);
  margin-bottom: var(--space-4);
  background: var(--color-surface-muted);
}
.project-card__cover:focus-visible {
  outline-offset: -4px; /* 焦点环收进卡片内，避免被裁切 */
}
/* 独立可点内容（GitHub/Demo 等）抬升到覆盖层之上 */
.project-card__foot {
  margin-top: var(--space-4);
  padding-top: var(--space-4);
  border-top: var(--border-default);
  display: flex;
  gap: var(--space-4);
  position: relative;
  z-index: 2;
}
.project-card__head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--space-3);
}
.project-card__title {
  font-family: var(--font-display);
  font-size: var(--text-h3);
  line-height: var(--lh-h3);
  color: var(--color-text);
}
.project-card__subtitle {
  margin-top: var(--space-1);
  font-size: var(--text-small);
  color: var(--color-text-secondary);
}
.project-card__summary {
  margin-top: var(--space-3);
  font-size: var(--text-small);
  color: var(--color-text-secondary);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.project-card__tech {
  margin-top: var(--space-4);
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}
/* featured 变体：加大内距与字号（05 §3） */
.project-card--featured {
  padding: var(--space-8);
}
.project-card--featured .project-card__title {
  font-size: var(--text-h2);
}
</style>
