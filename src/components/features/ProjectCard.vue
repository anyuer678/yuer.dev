<script setup>
// ProjectCard —— 项目档案卡片（05 §3；09 §5 骨架）
import StatusBadge from '@/components/ui/StatusBadge.vue'
import Tag from '@/components/ui/Tag.vue'
import ExternalLink from '@/components/ui/ExternalLink.vue'

defineProps({
  project: { type: Object, required: true },
  featured: { type: Boolean, default: false },
})
</script>

<template>
  <article class="project-card" :class="{ 'project-card--featured': featured }">
    <RouterLink :to="`/projects/${project.slug}`" class="project-card__link">
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
    </RouterLink>
  </article>
</template>

<style scoped>
.project-card {
  background: var(--color-surface);
  border: var(--border-default);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
  transition:
    box-shadow var(--dur-fast) var(--ease-standard),
    transform var(--dur-fast) var(--ease-standard);
}
.project-card:hover {
  box-shadow: var(--shadow-card-hover);
  transform: translateY(-2px);
}
.project-card__link {
  display: block;
  padding: var(--space-6);
  color: var(--color-text);
  text-decoration: none;
}
.project-card__link:hover {
  text-decoration: none;
  color: var(--color-text);
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
.project-card__foot {
  margin-top: var(--space-4);
  padding-top: var(--space-4);
  border-top: var(--border-default);
  display: flex;
  gap: var(--space-4);
}
/* featured 变体：加大内距与字号（05 §3） */
.project-card--featured .project-card__link {
  padding: var(--space-8);
}
.project-card--featured .project-card__title {
  font-size: var(--text-h2);
}
</style>
