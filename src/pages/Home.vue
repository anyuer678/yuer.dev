<script setup>
// P2 完成：Hero + FeaturedProjects + RecentNotes（F02）
import HeroSection from '@/components/features/HeroSection.vue'
import SectionTitle from '@/components/ui/SectionTitle.vue'
import ProjectCard from '@/components/features/ProjectCard.vue'
import NoteCard from '@/components/features/NoteCard.vue'
import { site, featuredProjects, recentNotes } from '@/utils/content.js'
</script>

<template>
  <HeroSection :site="site" />

  <!-- 空状态：无 featured 项目时区块隐藏，首页保持克制（06 §1） -->
  <section v-if="featuredProjects.length" class="home-section">
    <div class="container">
      <SectionTitle index="01" title="Featured Projects" to="/projects" />
      <div class="project-grid">
        <ProjectCard v-for="p in featuredProjects" :key="p.slug" :project="p" featured />
      </div>
    </div>
  </section>

  <section v-if="recentNotes.length" class="home-section">
    <div class="container">
      <SectionTitle index="02" title="Recent Notes" to="/notes" />
      <div class="note-grid">
        <NoteCard v-for="n in recentNotes" :key="n.slug" :note="n" />
      </div>
    </div>
  </section>
</template>

<style scoped>
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
</style>
