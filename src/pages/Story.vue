<script setup>
// /stories/:slug 开卷叙事 — 签名时刻「点灯开卷」；减动效下纵向线性阅读
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import stories from '@/content/stories.json'
import { getProject, getRepoData, site } from '@/utils/content.js'
import { setDescription, setTitle } from '@/utils/seo.js'

const route = useRoute()
const story = computed(() => stories[String(route.params.slug || '')])
const project = computed(() => (story.value ? getProject(story.value.slug) : null))
const repo = computed(() => getRepoData(story.value?.slug))

const pulseRows = computed(() => {
  const r = repo.value
  if (!r) return []
  const rows = []
  if (r.language) rows.push({ k: '语言', v: r.language })
  if (r.release) rows.push({ k: 'Release', v: r.release })
  if (r.pushed_at) {
    const days = Math.floor((Date.now() - new Date(r.pushed_at).getTime()) / 86400000)
    rows.push({ k: '最后推送', v: days <= 0 ? '今天' : `${days} 天前` })
  }
  if (r.ci_status && r.ci_status !== 'unknown') rows.push({ k: 'CI', v: r.ci_status })
  return rows
})

const activeId = ref('')
let io = null

function applyMeta() {
  const s = story.value
  if (!s) return
  setTitle(`开卷 · ${s.title} · ${site?.name || 'Yuer'}`)
  setDescription(s.acts?.[0]?.body?.slice(0, 100) || site.bio)
}

applyMeta()
watch(() => route.params.slug, applyMeta)

onMounted(() => {
  const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  if (reduce) return
  const nodes = document.querySelectorAll('[data-act]')
  if (!nodes.length || !('IntersectionObserver' in window)) return
  io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) activeId.value = e.target.getAttribute('data-act') || ''
      }
    },
    { rootMargin: '-35% 0px -45% 0px', threshold: 0.01 }
  )
  nodes.forEach((n) => io.observe(n))
})

onBeforeUnmount(() => {
  io?.disconnect()
  io = null
})
</script>

<template>
  <div v-if="story" class="story">
    <header class="story__bar">
      <RouterLink :to="story.roomTo || '/room'">← 书房</RouterLink>
      <RouterLink :to="story.deskTo || `/desk/${story.slug}`">案头</RouterLink>
      <RouterLink to="/garden">花庭</RouterLink>
    </header>

    <section class="story__hero">
      <div class="container container--narrow">
        <p class="story__kicker">开卷 · Story</p>
        <h1 class="story__title">{{ story.title }}</h1>
        <p class="story__sub">{{ story.subtitle }}</p>
        <p class="story__hint">灯已亮。往下读五幕；随时可从页脚合上书。</p>
      </div>
    </section>

    <nav class="story__rail" aria-label="幕次">
      <a
        v-for="act in story.acts"
        :key="act.id"
        :href="`#act-${act.id}`"
        class="story__rail-item"
        :class="{ 'is-on': activeId === act.id }"
      >
        {{ act.id }} {{ act.title }}
      </a>
    </nav>

    <div class="container container--narrow story__body">
      <article
        v-for="act in story.acts"
        :id="`act-${act.id}`"
        :key="act.id"
        class="act"
        :data-act="act.id"
        :class="{ 'is-active': activeId === act.id }"
      >
        <header class="act__head">
          <span class="act__id">{{ act.id }}</span>
          <div>
            <h2 class="act__title">{{ act.title }}</h2>
            <p v-if="act.lead" class="act__lead">{{ act.lead }}</p>
          </div>
        </header>
        <p v-if="act.body" class="act__body">{{ act.body }}</p>

        <ul v-if="act.bullets?.length" class="act__bullets">
          <li v-for="b in act.bullets" :key="b">{{ b }}</li>
        </ul>

        <ol v-if="act.timeline?.length" class="act__timeline">
          <li v-for="t in act.timeline" :key="t.date + t.title">
            <span class="act__t-date">{{ t.date }}</span>
            <strong>{{ t.title }}</strong>
            <span class="act__t-desc">{{ t.desc }}</span>
          </li>
        </ol>

        <dl v-if="act.pulseKey && pulseRows.length" class="act__pulse">
          <div v-for="row in pulseRows" :key="row.k">
            <dt>{{ row.k }}</dt>
            <dd>{{ row.v }}</dd>
          </div>
        </dl>
        <p v-else-if="act.pulseKey" class="act__pulse-empty">
          构建期暂无仓库数据，可先看
          <RouterLink v-if="project" :to="`/projects/${project.slug}`">项目档案</RouterLink>。
        </p>

        <div v-if="act.links?.length" class="act__links">
          <RouterLink v-for="l in act.links" :key="l.label" :to="l.to" class="act__link">
            {{ l.label }}
          </RouterLink>
        </div>
      </article>
    </div>

    <footer class="story__end">
      <div class="container container--narrow">
        <p class="story__end-cap">合上书</p>
        <div class="story__end-actions">
          <RouterLink class="btn btn--primary" :to="story.roomTo || '/room'">回书房</RouterLink>
          <RouterLink class="btn btn--ghost" :to="story.projectTo || '/projects'">完整档案</RouterLink>
          <RouterLink v-if="story.noteTo" class="btn btn--ghost" :to="story.noteTo">架构笔记</RouterLink>
          <RouterLink class="btn btn--ghost" to="/garden">回花庭</RouterLink>
        </div>
      </div>
    </footer>
  </div>

  <div v-else class="container container--narrow story-missing">
    <h1>这卷尚未装订</h1>
    <p><RouterLink to="/room">回书房</RouterLink> · <RouterLink to="/desk/lumen">Lumen 案头</RouterLink></p>
  </div>
</template>

<style scoped>
.story {
  padding-bottom: var(--space-16);
  background: var(--color-bg);
}
.story__bar {
  max-width: var(--container-narrow);
  margin: 0 auto;
  padding: var(--space-4) clamp(16px, 4vw, 32px);
  display: flex;
  gap: var(--space-4);
  font-family: var(--font-mono);
  font-size: var(--text-caption);
}
.story__bar a {
  color: var(--color-text-secondary);
  text-decoration: none;
}
.story__bar a:hover {
  color: var(--color-accent);
}
.story__hero {
  padding: var(--space-8) 0 var(--space-10);
  border-bottom: var(--border-default);
  background:
    radial-gradient(ellipse 80% 60% at 20% 0%, rgba(246, 233, 225, 0.9), transparent 70%),
    var(--color-surface);
}
.story__kicker {
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.14em;
  color: var(--color-accent);
}
.story__title {
  margin-top: var(--space-3);
  font-family: var(--font-display);
  font-size: clamp(32px, 6vw, 48px);
  line-height: 1.15;
}
.story__sub {
  margin-top: var(--space-2);
  font-family: var(--font-mono);
  color: var(--color-text-secondary);
}
.story__hint {
  margin-top: var(--space-4);
  font-size: var(--text-small);
  color: var(--color-text-secondary);
}
.story__rail {
  position: sticky;
  top: 0;
  z-index: 2;
  display: flex;
  gap: var(--space-2);
  overflow-x: auto;
  padding: var(--space-3) clamp(16px, 4vw, 32px);
  background: rgba(250, 250, 248, 0.92);
  border-bottom: var(--border-default);
  backdrop-filter: blur(6px);
}
.story__rail-item {
  flex-shrink: 0;
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--color-text-tertiary);
  text-decoration: none;
  padding: 4px 8px;
  border-radius: 999px;
  border: 1px solid transparent;
}
.story__rail-item.is-on,
.story__rail-item:hover {
  color: var(--color-accent);
  border-color: var(--color-accent);
  text-decoration: none;
}
.story__body {
  padding-top: var(--space-8);
}
.act {
  padding: var(--space-8) 0;
  border-bottom: var(--border-default);
  opacity: 0.72;
  transition: opacity var(--dur-base) var(--ease-standard);
}
.act.is-active,
.act:last-child {
  opacity: 1;
}
.act__head {
  display: flex;
  gap: var(--space-4);
  align-items: flex-start;
  margin-bottom: var(--space-4);
}
.act__id {
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--color-accent);
  border: 1px solid var(--color-accent);
  border-radius: 999px;
  width: 40px;
  height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.act__title {
  font-family: var(--font-display);
  font-size: var(--text-h2);
  line-height: var(--lh-h2);
}
.act__lead {
  margin-top: 4px;
  font-family: var(--font-mono);
  font-size: var(--text-small);
  color: var(--color-text-secondary);
}
.act__body {
  color: var(--color-text-secondary);
  max-width: 52ch;
}
.act__bullets,
.act__timeline {
  margin-top: var(--space-4);
  padding-left: 1.2em;
  color: var(--color-text-secondary);
  max-width: 52ch;
}
.act__bullets li + li,
.act__timeline li + li {
  margin-top: var(--space-2);
}
.act__timeline {
  list-style: none;
  padding-left: 0;
  border-left: 1px solid var(--color-border-strong);
  margin-left: 8px;
  padding-left: var(--space-4);
}
.act__t-date {
  display: block;
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--color-text-tertiary);
}
.act__t-desc {
  display: block;
  font-size: var(--text-small);
  margin-top: 2px;
}
.act__pulse {
  margin-top: var(--space-4);
  border-top: var(--border-default);
}
.act__pulse > div {
  display: grid;
  grid-template-columns: 100px 1fr;
  padding: var(--space-2) 0;
  border-bottom: var(--border-default);
  font-family: var(--font-mono);
  font-size: var(--text-small);
}
.act__pulse dt {
  color: var(--color-text-tertiary);
}
.act__pulse dd {
  margin: 0;
}
.act__pulse-empty {
  margin-top: var(--space-3);
  font-size: var(--text-small);
  color: var(--color-text-secondary);
}
.act__links {
  margin-top: var(--space-6);
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}
.act__link {
  font-family: var(--font-mono);
  font-size: var(--text-small);
  color: var(--color-accent);
  text-decoration: none;
  border: 1px solid var(--color-accent);
  border-radius: 999px;
  padding: 6px 12px;
}
.act__link:hover {
  background: var(--color-accent-soft);
  text-decoration: none;
}
.story__end {
  margin-top: var(--space-8);
  padding-top: var(--space-8);
}
.story__end-cap {
  font-family: var(--font-display);
  font-size: var(--text-h2);
  margin-bottom: var(--space-4);
}
.story__end-actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
}
.story-missing {
  padding-block: var(--space-16);
}
@media (prefers-reduced-motion: reduce) {
  .act {
    opacity: 1;
  }
  .story__rail {
    position: static;
  }
}
</style>
