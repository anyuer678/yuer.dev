<script setup>
// /desk/:slug 案头 — 旗舰展开；正文仍在 L1 项目/笔记页
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import deskMap from '@/content/desk.json'
import { getProject, getRepoData, site } from '@/utils/content.js'
import { setDescription, setTitle } from '@/utils/seo.js'
import StatusBadge from '@/components/ui/StatusBadge.vue'
import ExternalLink from '@/components/ui/ExternalLink.vue'

const route = useRoute()

const spread = computed(() => deskMap[String(route.params.slug || '')])
const project = computed(() => (spread.value ? getProject(spread.value.slug) : null))
const repo = computed(() => getRepoData(spread.value?.slug))

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
  if (r.stars != null) rows.push({ k: 'Stars', v: String(r.stars) })
  return rows
})

const metaLine = computed(() => {
  const p = project.value
  if (!p) return ''
  return [p.subtitle, p.tech?.slice(0, 4).join(' · ')].filter(Boolean).join(' · ')
})

function applyMeta() {
  const s = spread.value
  if (!s) return
  setTitle(`案头 · ${s.title} · ${site?.name || 'Yuer'}`)
  setDescription(s.threeLines?.[0]?.text || project.value?.summary || site.bio)
}

applyMeta()
watch(() => route.params.slug, applyMeta)
</script>

<template>
  <div v-if="spread" class="desk">
    <header class="desk__bar">
      <RouterLink to="/projects">项目</RouterLink>
      <RouterLink to="/room">书房</RouterLink>
      <RouterLink to="/garden">花庭</RouterLink>
    </header>

    <div class="container container--narrow desk__sheet">
      <p class="desk__kicker">案头 · Desk Spread</p>
      <div class="desk__title-row">
        <h1 class="desk__title">{{ spread.title }}</h1>
        <StatusBadge v-if="project?.status" :status="project.status" />
      </div>
      <p v-if="spread.subtitle" class="desk__subtitle">{{ spread.subtitle }}</p>
      <p v-if="spread.tagline" class="desk__tagline">{{ spread.tagline }}</p>
      <p v-if="metaLine" class="desk__meta">{{ metaLine }}</p>

      <!-- 纸面终端式主视觉：无封面时的品牌块，不落灰方块 -->
      <div class="desk__terminal" aria-hidden="true">
        <div class="desk__terminal-dots">
          <span /><span /><span />
        </div>
        <pre class="desk__terminal-pre"><code>$ lumen status
runtime  ·  local only
loop     ·  intent → plan → tools → memory
focus    ·  {{ spread.subtitle }}</code></pre>
      </div>

      <section class="desk__lines" aria-label="三行定调">
        <article v-for="line in spread.threeLines" :key="line.key" class="line">
          <h2 class="line__key">{{ line.key }}</h2>
          <p class="line__text">{{ line.text }}</p>
        </article>
      </section>

      <section v-if="spread.highlights?.length" class="desk__highlights">
        <h2 class="desk__h2">桌上摊开的几页</h2>
        <ul class="desk__chips">
          <li v-for="h in spread.highlights" :key="h">{{ h }}</li>
        </ul>
      </section>

      <section v-if="pulseRows.length" class="desk__pulse">
        <h2 class="desk__h2">仓库现场</h2>
        <dl class="pulse">
          <div v-for="row in pulseRows" :key="row.k" class="pulse__row">
            <dt>{{ row.k }}</dt>
            <dd>{{ row.v }}</dd>
          </div>
        </dl>
      </section>

      <section class="desk__exits">
        <h2 class="desk__h2">出口</h2>
        <div class="exits">
          <template v-for="ex in spread.exits" :key="ex.label">
            <ExternalLink v-if="ex.href" :href="ex.href" class="exit">
              <span class="exit__label">{{ ex.label }}</span>
              <span class="exit__desc">{{ ex.desc }}</span>
            </ExternalLink>
            <RouterLink v-else :to="ex.to" class="exit">
              <span class="exit__label">{{ ex.label }}</span>
              <span class="exit__desc">{{ ex.desc }}</span>
            </RouterLink>
          </template>
        </div>
      </section>

      <footer class="desk__foot">
        <RouterLink v-if="spread.storyTo" class="btn btn--primary" :to="spread.storyTo">
          {{ spread.storyLabel || '开卷' }}
        </RouterLink>
        <RouterLink class="btn btn--ghost" :to="spread.roomTo || '/room'">回书房</RouterLink>
        <RouterLink class="btn btn--ghost" :to="spread.gardenTo || '/garden'">回花庭</RouterLink>
        <RouterLink class="btn btn--ghost" to="/bench">工作台</RouterLink>
      </footer>
    </div>
  </div>

  <div v-else class="container container--narrow desk-missing">
    <h1>这张案头还空着</h1>
    <p>旗舰案头目前只给正在写的那一本。</p>
    <p>
      <RouterLink to="/projects">项目档案</RouterLink>
      ·
      <RouterLink to="/room">书房</RouterLink>
    </p>
  </div>
</template>

<style scoped>
.desk {
  padding-bottom: var(--space-16);
  background:
    linear-gradient(180deg, var(--color-surface-muted) 0%, var(--color-bg) 220px),
    var(--color-bg);
}
.desk__bar {
  max-width: var(--container-narrow);
  margin: 0 auto;
  padding: var(--space-4) clamp(16px, 4vw, 32px);
  display: flex;
  gap: var(--space-4);
  font-family: var(--font-mono);
  font-size: var(--text-caption);
}
.desk__bar a {
  color: var(--color-text-secondary);
  text-decoration: none;
}
.desk__bar a:hover {
  color: var(--color-accent);
}
.desk__sheet {
  background: var(--color-surface);
  border: var(--border-default);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
  padding: var(--space-8) clamp(20px, 4vw, 40px) var(--space-10);
}
.desk__kicker {
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.12em;
  color: var(--color-accent);
}
.desk__title-row {
  margin-top: var(--space-3);
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--space-3);
  flex-wrap: wrap;
}
.desk__title {
  font-family: var(--font-display);
  font-size: var(--text-h1);
  line-height: var(--lh-h1);
}
.desk__subtitle {
  margin-top: var(--space-2);
  font-family: var(--font-mono);
  font-size: var(--text-small);
  color: var(--color-text-secondary);
}
.desk__tagline {
  margin-top: var(--space-4);
  font-family: var(--font-display);
  font-size: var(--text-h3);
  color: var(--color-text);
  max-width: 36ch;
}
.desk__meta {
  margin-top: var(--space-2);
  font-family: var(--font-mono);
  font-size: var(--text-caption);
  color: var(--color-text-tertiary);
}
.desk__terminal {
  margin-top: var(--space-6);
  border: var(--border-default);
  border-radius: var(--radius-md);
  background: var(--color-surface-muted);
  overflow: hidden;
}
.desk__terminal-dots {
  display: flex;
  gap: 6px;
  padding: 10px 12px;
  border-bottom: var(--border-default);
}
.desk__terminal-dots span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-border-strong);
}
.desk__terminal-dots span:nth-child(1) {
  background: var(--color-accent);
}
.desk__terminal-pre {
  margin: 0;
  padding: var(--space-4) var(--space-6);
  font-family: var(--font-mono);
  font-size: 13px;
  line-height: 1.7;
  color: var(--color-text);
  overflow-x: auto;
}
.desk__lines {
  margin-top: var(--space-8);
  display: grid;
  gap: var(--space-4);
}
.line {
  padding-bottom: var(--space-4);
  border-bottom: var(--border-default);
}
.line__key {
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.08em;
  color: var(--color-accent);
  margin-bottom: var(--space-2);
}
.line__text {
  color: var(--color-text-secondary);
  max-width: 52ch;
}
.desk__h2 {
  font-family: var(--font-display);
  font-size: var(--text-h3);
  margin-bottom: var(--space-3);
}
.desk__highlights,
.desk__pulse,
.desk__exits {
  margin-top: var(--space-8);
}
.desk__chips {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}
.desk__chips li {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--color-text-secondary);
  background: var(--color-surface-muted);
  border: var(--border-default);
  border-radius: 999px;
  padding: 4px 10px;
}
.pulse {
  margin: 0;
  border-top: var(--border-default);
}
.pulse__row {
  display: grid;
  grid-template-columns: 100px 1fr;
  gap: var(--space-3);
  padding: var(--space-3) 0;
  border-bottom: var(--border-default);
  font-family: var(--font-mono);
  font-size: var(--text-small);
}
.pulse__row dt {
  color: var(--color-text-tertiary);
}
.pulse__row dd {
  margin: 0;
  color: var(--color-text);
}
.exits {
  display: grid;
  gap: var(--space-3);
}
.exit {
  display: block;
  padding: var(--space-4);
  border: var(--border-default);
  border-radius: var(--radius-md);
  text-decoration: none;
  color: inherit;
  background: var(--color-surface);
  transition: border-color var(--dur-fast) var(--ease-standard);
}
.exit:hover {
  border-color: var(--color-accent);
  text-decoration: none;
}
.exit__label {
  display: block;
  font-family: var(--font-display);
  font-size: var(--text-h3);
  color: var(--color-text);
}
.exit:hover .exit__label {
  color: var(--color-accent);
}
.exit__desc {
  display: block;
  margin-top: 4px;
  font-family: var(--font-mono);
  font-size: var(--text-caption);
  color: var(--color-text-secondary);
}
.desk__foot {
  margin-top: var(--space-10);
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
}
.desk :focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}
.desk-missing {
  padding-block: var(--space-16);
}
@media (max-width: 639px) {
  .pulse__row {
    grid-template-columns: 84px 1fr;
  }
}
</style>
