<script setup>
// About 页（F08）：开发者档案——定位 → 简介 → Current Focus → 技术方向 → 代表作 → 成长路径
// 全部数据驱动（site.json + projects + timeline），不硬编码
import PageHeader from '@/components/layout/PageHeader.vue'
import ExternalLink from '@/components/ui/ExternalLink.vue'
import StatusBadge from '@/components/ui/StatusBadge.vue'
import SectionTitle from '@/components/ui/SectionTitle.vue'
import ProjectCard from '@/components/features/ProjectCard.vue'
import { site, projects, techList } from '@/utils/content.js'
import { timeline } from '@/utils/content.js'

// 代表作：order 前 3（旗舰优先）
const selectedProjects = [...projects].sort((a, b) => (a.order ?? 999) - (b.order ?? 999)).slice(0, 3)

// 成长路径：timeline 按年份分组（近 3 年）
const journey = Object.entries(
  [...timeline].reduce((acc, item) => {
    const year = item.date.slice(0, 4)
    ;(acc[year] ??= []).push(item)
    return acc
  }, {})
)
  .sort(([a], [b]) => b.localeCompare(a))
  .slice(0, 3)
</script>

<template>
  <div class="container">
    <PageHeader title="关于" description="做软件的 Yuer · 开发者档案" />

    <div class="about">
      <!-- 一句话定位 -->
      <section class="about__identity">
        <h2 class="about__hello">Hi, I'm {{ site.name }}.</h2>
        <p class="about__role">{{ site.role }}</p>
        <p class="about__positioning">{{ site.positioning }}</p>
        <p class="about__tagline">{{ site.tagline.join(' · ') }}</p>
      </section>

      <!-- 为什么写代码 -->
      <section class="about__block">
        <h2 class="about__sub">为什么写代码</h2>
        <p class="about__bio">{{ site.bio }}</p>
        <p class="about__path">
          从小工具起步，逐渐探索桌面应用、AI 系统与软件架构——把想法变成可用的软件，
          再把它整理成可以长期维护的系统。
        </p>
      </section>

      <!-- 当前在做 -->
      <section v-if="site.focus" class="about__block">
        <h2 class="about__sub">Currently Building</h2>
        <RouterLink :to="site.focus.link || '/projects'" class="about__focus">
          <span class="about__focus-title">{{ site.focus.title }}</span>
          <StatusBadge :status="site.focus.status" />
          <span v-if="site.focus.subtitle" class="about__focus-sub">{{ site.focus.subtitle }}</span>
          <span class="about__focus-goal">{{ site.focus.goal }}</span>
        </RouterLink>
      </section>

      <!-- 技术方向 -->
      <section class="about__block">
        <h2 class="about__sub">技术方向</h2>
        <div class="about__tech">
          <span v-for="t in techList" :key="t" class="about__tech-tag">{{ t }}</span>
        </div>
      </section>

      <!-- 代表作 -->
      <section class="about__block">
        <SectionTitle index="01" title="Selected Projects" to="/projects" />
        <div class="about__projects">
          <ProjectCard v-for="p in selectedProjects" :key="p.slug" :project="p" />
        </div>
      </section>

      <!-- 成长路径 -->
      <section class="about__block">
        <SectionTitle index="02" title="Journey" to="/timeline" />
        <div v-for="[year, items] in journey" :key="year" class="about__year">
          <h3 class="about__year-title">{{ year }}</h3>
          <ul class="about__year-list">
            <li v-for="item in items" :key="item.title" class="about__year-item">
              {{ item.title }}
            </li>
          </ul>
        </div>
      </section>

      <!-- 联系方式 -->
      <div class="about__links">
        <ExternalLink :href="site.links.github">{{ site.name }} on GitHub</ExternalLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.about {
  padding-bottom: var(--space-16);
}
.about__identity {
  padding-block: var(--space-8) var(--space-6);
  border-bottom: var(--border-default);
}
.about__hello {
  font-family: var(--font-display);
  font-size: var(--text-h1);
  line-height: var(--lh-h1);
}
.about__role {
  margin-top: var(--space-2);
  font-family: var(--font-mono);
  font-size: var(--text-small);
  color: var(--color-text-secondary);
}
.about__positioning {
  margin-top: var(--space-3);
  font-size: var(--text-h3);
  line-height: var(--lh-h3);
  color: var(--color-text);
}
.about__tagline {
  margin-top: var(--space-2);
  font-size: var(--text-small);
  color: var(--color-text-secondary);
}
.about__block {
  margin-top: var(--space-8);
}
.about__sub {
  font-family: var(--font-display);
  font-size: var(--text-h2);
  line-height: var(--lh-h2);
  margin-bottom: var(--space-3);
}
.about__bio {
  font-size: var(--text-body);
  line-height: var(--lh-body);
  color: var(--color-text);
  max-width: var(--container-narrow);
}
.about__path {
  margin-top: var(--space-2);
  font-size: var(--text-body);
  line-height: var(--lh-body);
  color: var(--color-text-secondary);
  max-width: var(--container-narrow);
}
.about__focus {
  display: grid;
  gap: var(--space-1);
  padding: var(--space-5);
  background: var(--color-surface-muted);
  border: var(--border-default);
  border-radius: var(--radius-lg);
  max-width: var(--container-narrow);
  transition: box-shadow var(--dur-fast) var(--ease-standard);
}
.about__focus:hover {
  box-shadow: var(--shadow-card-hover);
}
.about__focus-title {
  font-family: var(--font-display);
  font-size: var(--text-h3);
  color: var(--color-text);
  display: inline-flex;
  align-items: baseline;
  gap: var(--space-3);
}
.about__focus-sub {
  font-family: var(--font-mono);
  font-size: var(--text-small);
  color: var(--color-text-secondary);
}
.about__focus-goal {
  font-size: var(--text-small);
  color: var(--color-text);
}
.about__tech {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}
.about__tech-tag {
  padding: 2px 10px;
  font-family: var(--font-mono);
  font-size: var(--text-caption);
  color: var(--color-text-secondary);
  background: var(--color-surface-muted);
  border: 1px solid var(--color-border);
  border-radius: 999px;
}
.about__projects {
  margin-top: var(--space-4);
  display: grid;
  gap: var(--grid-gap);
}
.about__year {
  margin-top: var(--space-4);
}
.about__year-title {
  font-family: var(--font-display);
  font-size: var(--text-h3);
  margin-bottom: var(--space-2);
}
.about__year-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: var(--space-2);
}
.about__year-item {
  font-size: var(--text-small);
  color: var(--color-text-secondary);
  padding-left: var(--space-3);
  border-left: 2px solid var(--color-border-strong);
}
.about__links {
  margin-top: var(--space-10);
  padding-top: var(--space-6);
  border-top: var(--border-default);
  display: flex;
  gap: var(--space-6);
}
</style>
