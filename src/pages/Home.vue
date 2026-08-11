<script setup>
// P2 完成：Hero + FeaturedProjects + RecentNotes（F02）
import HeroSection from '@/components/features/HeroSection.vue'
import SectionTitle from '@/components/ui/SectionTitle.vue'
import ProjectCard from '@/components/features/ProjectCard.vue'
import NoteCard from '@/components/features/NoteCard.vue'
import StatusBadge from '@/components/ui/StatusBadge.vue'
import { site, featuredProjects, recentNotes } from '@/utils/content.js'
</script>

<template>
  <div class="home">
    <HeroSection :site="site" />

    <!-- Current Focus：当前在做的事（活人感；site.focus 由内容驱动） -->
    <section v-if="site.focus" class="home-section">
      <div class="container">
        <SectionTitle index="01" title="Currently Building" to="/projects" />
        <RouterLink v-if="site.focus.link" :to="site.focus.link" class="focus-card">
          <div class="focus-card__head">
            <h3 class="focus-card__title">{{ site.focus.title }}</h3>
            <StatusBadge :status="site.focus.status" />
          </div>
          <p v-if="site.focus.subtitle" class="focus-card__subtitle">{{ site.focus.subtitle }}</p>
          <p v-if="site.focus.goal" class="focus-card__goal">{{ site.focus.goal }}</p>
        </RouterLink>
      </div>
    </section>

    <!-- 空状态：无 featured 项目时区块隐藏，首页保持克制（06 §1） -->
    <section v-if="featuredProjects.length" class="home-section">
      <div class="container">
        <SectionTitle index="02" title="Featured Projects" to="/projects" />
        <div class="project-grid">
          <ProjectCard v-for="p in featuredProjects" :key="p.slug" :project="p" featured :show-cover="false" />
        </div>
      </div>
    </section>

    <section v-if="recentNotes.length" class="home-section">
      <div class="container">
        <SectionTitle index="03" title="Recent Notes" to="/notes" />
        <div class="note-grid">
          <NoteCard v-for="n in recentNotes" :key="n.slug" :note="n" />
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home {
  /* 单根容器：保证 <Transition> 可动画（组件根必须是单元素，14 §5.1） */
}
.home-section {
  padding-block: var(--space-12);
}
.project-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(320px, 100%), 1fr)); /* 防 <350px 溢出（review 终审） */
  gap: var(--grid-gap);
}
.note-grid {
  display: grid;
  gap: var(--grid-gap);
}
/* Current Focus 卡片（首页活人感区块） */
.focus-card {
  display: block;
  position: relative; /* ::after 箭头定位基准 */
  padding: var(--space-6);
  padding-right: var(--space-8);
  background: var(--color-surface);
  border: var(--border-default);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card); /* 与 ProjectCard 画风一致 */
  transition:
    box-shadow var(--dur-fast) var(--ease-standard),
    transform var(--dur-fast) var(--ease-standard);
}
.focus-card::after {
  content: '→';
  position: absolute;
  right: var(--space-6);
  top: 50%;
  transform: translateY(-50%);
  font-size: var(--text-body);
  color: var(--color-text-secondary);
  transition: transform var(--dur-fast) var(--ease-standard);
}
.focus-card:hover {
  box-shadow: var(--shadow-card-hover);
  transform: translateY(-2px);
}
.focus-card:hover::after {
  transform: translateY(-50%) translateX(3px);
  color: var(--color-accent);
}
.focus-card__head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--space-3);
}
.focus-card__title {
  font-family: var(--font-display);
  font-size: var(--text-h3);
  line-height: var(--lh-h3);
  color: var(--color-text);
}
.focus-card__subtitle {
  margin-top: var(--space-1);
  font-family: var(--font-mono);
  font-size: var(--text-small);
  color: var(--color-text-secondary);
}
.focus-card__goal {
  margin-top: var(--space-1);
  font-size: var(--text-small);
  color: var(--color-text-secondary);
}
</style>
