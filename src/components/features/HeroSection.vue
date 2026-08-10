<script setup>
// HeroSection —— 首页首屏（05 §3：props 为 site 对象）
import TagRotator from '@/components/features/TagRotator.vue'

defineProps({
  site: { type: Object, required: true },
})
</script>

<template>
  <section class="hero">
    <div class="container hero__inner">
      <h1 class="hero__name">{{ site.name }}</h1>
      <!-- 副标题：静态文本（读屏可感知），TagRotator 轮换仅视觉增强（14 §5.12） -->
      <p class="hero__role">{{ site.role }} · {{ site.tagline.join(' / ') }}</p>
      <div class="hero__actions">
        <RouterLink to="/projects" class="btn btn--primary">View Projects</RouterLink>
        <a
          v-if="site.links.github"
          :href="site.links.github"
          class="btn btn--ghost"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
      </div>
      <TagRotator :tags="site.heroTags" />
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  min-height: 55vh; /* F02 */
  display: flex;
  align-items: center;
}
.hero__inner {
  position: relative;
  z-index: 1;
  padding-block: var(--space-16);
}
/* 网格纹理叠加层（03 §5：用叠加层实现，不直接放背景上） */
.hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(var(--color-border) 1px, transparent 1px),
    linear-gradient(90deg, var(--color-border) 1px, transparent 1px);
  background-size: 24px 24px;
  opacity: 0.5;
  pointer-events: none;
}
.hero__name {
  font-family: var(--font-display);
  font-size: var(--text-display); /* 40px */
  line-height: var(--lh-display);
}
.hero__role {
  margin-top: var(--space-3);
  font-family: var(--font-mono);
  font-size: var(--text-small);
  color: var(--color-text-secondary);
}
.hero__actions {
  margin-top: var(--space-6);
  display: flex;
  gap: var(--space-3);
  flex-wrap: wrap;
}
.hero .tag-rotator {
  display: block;
  margin-top: var(--space-6);
}
</style>
