<script setup>
// About 页（F08）：开发者档案——定位 → 简介 → Current Focus → 技术方向 → 代表作 → 成长路径
// 全部数据驱动（site.json + projects + timeline），不硬编码
import PageHeader from '@/components/layout/PageHeader.vue'
import ExternalLink from '@/components/ui/ExternalLink.vue'
import SectionTitle from '@/components/ui/SectionTitle.vue'
import ProjectCard from '@/components/features/ProjectCard.vue'
import { site, projects, notes, lab, techList } from '@/utils/content.js'
import { timeline } from '@/utils/content.js'
import { YEAR_SUMMARIES } from '@/utils/yearSummaries.js'

// 数字统计（真实数据，视觉密度）
const stats = [
  { value: projects.length, label: '项目' },
  { value: notes.length, label: '笔记' },
  { value: lab.length, label: '实验' },
  { value: timeline.length, label: '时间线条目' },
]

// 代表作：order 前 3（旗舰优先）
const selectedProjects = [...projects].sort((a, b) => (a.order ?? 999) - (b.order ?? 999)).slice(0, 3)

// 当前在做：site.focus.link 指向的项目（默认 EvoCode），直接渲染标准项目卡
const currentFocus = projects.find((p) => p.slug === site.focus?.link?.split('/').filter(Boolean).pop()) ?? projects[0]

// What I Build：按方向归类真实项目（slug → 一句话，非详情页，仅方向展示）
const BUILD_AREAS = [
  {
    name: 'AI 应用',
    desc: '探索大语言模型在实际场景中的应用。构建 AI 助手、自动化工作流以及智能工具，让 AI 成为软件系统的一部分。',
    items: projects.filter((p) => ['chatez', 'evocode'].includes(p.slug)),
  },
  {
    name: '开发工具',
    desc: '创造提升开发效率的软件工具。关注代码学习、软件分析以及开发流程优化。',
    items: projects.filter((p) => ['codedrill', 'polycodehub'].includes(p.slug)),
  },
  {
    name: '个人软件',
    desc: '从日常需求出发，制作真正会被自己使用的软件。通过不断迭代，让小工具逐渐成长为完整产品。',
    items: projects.filter((p) => ['desktoppet', 'todo-list', 'cet6-vocabulary'].includes(p.slug)),
  },
].filter((area) => area.items.length)

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

// 技术方向分组（Current Stack）：静态类别映射，按实际 techList 归类
const STACK_GROUPS = [
  { name: '前端', keys: ['Vue 3', 'Vite', 'TypeScript', 'JavaScript', 'HTML', 'CSS', 'Electron'] },
  { name: '后端', keys: ['Spring Boot', 'Java', 'Python', 'FastAPI', 'Flask', 'Node.js', 'MySQL', 'Redis'] },
  { name: '基础设施', keys: ['Linux', 'Docker', 'Git', 'GitHub Actions', 'Nginx'] },
  { name: 'AI', keys: ['LLM', 'AI', 'OpenAI API', 'MCP', 'FastAPI'] },
]
const stackGroups = STACK_GROUPS.map((g) => ({
  name: g.name,
  items: techList.filter((t) => g.keys.includes(t)),
})).filter((g) => g.items.length)
</script>

<template>
  <div class="container">
    <PageHeader title="关于" description="一个喜欢构建软件的开发者 · 软件工程学生" />

    <div class="about">
      <!-- 一句话定位 -->
      <section class="about__identity">
        <h2 class="about__hello">Hi, I'm {{ site.name }}.</h2>
        <p class="about__role">{{ site.role }}</p>
        <p class="about__positioning">{{ site.positioning }}</p>
        <p class="about__tagline">{{ site.tagline.join(' · ') }}</p>
      </section>

      <!-- 数字统计（视觉密度，真实数据） -->
      <section class="about__stats">
        <div v-for="s in stats" :key="s.label" class="about__stat">
          <span class="about__stat-value">{{ s.value }}+</span>
          <span class="about__stat-label">{{ s.label }}</span>
        </div>
      </section>

      <!-- My Story -->
      <section class="about__block">
        <h2 class="about__sub">My Story</h2>
        <p class="about__bio">{{ site.bio }}</p>
        <ol class="about__story">
          <li class="about__story-step">
            <strong>小工具起步</strong>
            <span>用简单的脚本和应用解决身边的问题</span>
          </li>
          <li class="about__story-step">
            <strong>桌面应用</strong>
            <span>探索 Electron 等桌面端开发</span>
          </li>
          <li class="about__story-step">
            <strong>AI 应用</strong>
            <span>接触 LLM API，做 AI 助手与自动化</span>
          </li>
          <li class="about__story-step">
            <strong>软件架构</strong>
            <span>迈向大型系统与工程化平台</span>
          </li>
        </ol>
      </section>

      <!-- 开发理念 -->
      <section v-if="site.philosophy" class="about__block">
        <h2 class="about__sub">开发理念</h2>
        <p class="about__philosophy">{{ site.philosophy }}</p>
        <ol v-if="site.buildProcess?.length" class="about__process">
          <li v-for="step in site.buildProcess" :key="step" class="about__process-step">{{ step }}</li>
        </ol>
      </section>

      <!-- 当前在做 -->
      <section v-if="site.focus" class="about__block">
        <h2 class="about__sub">Currently Building</h2>
        <ProjectCard :project="currentFocus" />
      </section>

      <!-- 技术方向 -->
      <section class="about__block">
        <h2 class="about__sub">技术方向</h2>
        <div v-for="group in stackGroups" :key="group.name" class="about__stack">
          <h3 class="about__stack-name">{{ group.name }}</h3>
          <div class="about__tech">
            <span v-for="t in group.items" :key="t" class="about__tech-tag">{{ t }}</span>
          </div>
        </div>
      </section>

      <!-- What I Build：方向而非单个项目 -->
      <section v-if="BUILD_AREAS.length" class="about__block">
        <h2 class="about__sub">What I Build</h2>
        <div v-for="area in BUILD_AREAS" :key="area.name" class="about__area">
          <h3 class="about__area-name">{{ area.name }}</h3>
          <p class="about__area-desc">{{ area.desc }}</p>
          <ul class="about__area-list">
            <li v-for="p in area.items" :key="p.slug" class="about__area-item">
              <RouterLink :to="`/projects/${p.slug}`">{{ p.title }}</RouterLink>
              <span v-if="p.subtitle" class="about__area-sub">{{ p.subtitle }}</span>
            </li>
          </ul>
        </div>
      </section>

      <!-- 代表作 -->
      <section class="about__block">
        <SectionTitle index="01" title="Selected Projects" to="/projects" />
        <div class="about__projects">
          <ProjectCard v-for="p in selectedProjects" :key="p.slug" :project="p" />
        </div>
      </section>

      <!-- 成长路径（简略：年份 + 一句话摘要，详情见时间线页） -->
      <section class="about__block">
        <SectionTitle index="02" title="Journey" to="/timeline" />
        <div v-for="[year, items] in journey" :key="year" class="about__year">
          <h3 class="about__year-title">{{ year }} <span class="about__year-count">· {{ items.length }} 条</span></h3>
          <p v-if="YEAR_SUMMARIES[year]" class="about__year-summary">{{ YEAR_SUMMARIES[year] }}</p>
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
.about__stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: var(--space-3);
  margin-top: var(--space-6);
}
.about__stat {
  padding: var(--space-4);
  text-align: center;
  background: var(--color-surface-muted);
  border: var(--border-default);
  border-radius: var(--radius-md);
}
.about__stat-value {
  display: block;
  font-family: var(--font-display);
  font-size: var(--text-h2);
  line-height: var(--lh-h2);
  color: var(--color-accent);
}
.about__stat-label {
  display: block;
  margin-top: var(--space-1);
  font-size: var(--text-caption);
  color: var(--color-text-secondary);
}
.about__story {
  margin-top: var(--space-4);
  padding: 0;
  list-style: none;
  display: grid;
  gap: var(--space-2);
}
.about__story-step {
  display: grid;
  gap: var(--space-1);
  padding-left: var(--space-4);
  border-left: 2px solid var(--color-accent);
}
.about__story-step strong {
  font-size: var(--text-body);
  color: var(--color-text);
}
.about__story-step span {
  font-size: var(--text-small);
  color: var(--color-text-secondary);
}
.about__area {
  margin-top: var(--space-4);
}
.about__area-name {
  font-family: var(--font-display);
  font-size: var(--text-h3);
  line-height: var(--lh-h3);
}
.about__area-desc {
  margin-top: var(--space-1);
  font-size: var(--text-small);
  color: var(--color-text-secondary);
}
.about__area-list {
  margin-top: var(--space-2);
  padding: 0;
  list-style: none;
  display: grid;
  gap: var(--space-1);
}
.about__area-item {
  font-size: var(--text-small);
}
.about__area-item a {
  color: var(--color-accent);
}
.about__area-sub {
  margin-left: var(--space-2);
  color: var(--color-text-secondary);
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
.about__philosophy {
  font-size: var(--text-body);
  line-height: var(--lh-body);
  color: var(--color-text);
  max-width: var(--container-narrow);
}
.about__process {
  margin-top: var(--space-3);
  padding: 0;
  list-style: none;
  counter-reset: step;
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}
.about__process-step {
  counter-increment: step;
  padding: var(--space-2) var(--space-4);
  font-family: var(--font-mono);
  font-size: var(--text-caption);
  color: var(--color-text-secondary);
  background: var(--color-surface-muted);
  border: var(--border-default);
  border-radius: 999px;
}
.about__process-step::before {
  content: counter(step, decimal-leading-zero) ' ';
  color: var(--color-accent);
}
.about__stack {
  margin-top: var(--space-4);
}
.about__stack-name {
  font-family: var(--font-display);
  font-size: var(--text-h3);
  line-height: var(--lh-h3);
  margin-bottom: var(--space-2);
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
  margin-bottom: var(--space-1);
}
.about__year-count {
  font-size: var(--text-small);
  font-weight: 400;
  color: var(--color-text-secondary);
}
.about__year-summary {
  font-size: var(--text-small);
  line-height: var(--lh-body);
  color: var(--color-text-secondary);
  max-width: var(--container-narrow);
}
.about__links {
  margin-top: var(--space-10);
  padding-top: var(--space-6);
  border-top: var(--border-default);
  display: flex;
  gap: var(--space-6);
}
</style>
