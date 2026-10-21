<script setup>
// 作品地图：图谱是主视图，列表是等价的可访问视图。
// 语义模型在 content/work-map.json（节点/边/坐标）；URL 即状态：?view=list&focus=lumen
import { computed, nextTick, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PageHeader from '@/components/layout/PageHeader.vue'
import SectionTitle from '@/components/ui/SectionTitle.vue'
import WorkMapGraph from '@/components/features/WorkMapGraph.vue'
import { KbCard, KbTag } from 'kb-ui-vue'
import 'kb-ui-vue/styles/tokens.css'
import 'kb-ui-vue/styles/Card.css'
import 'kb-ui-vue/styles/Tag.css'
import { site, workMap } from '@/utils/content.js'

const route = useRoute()
const router = useRouter()
const detailRef = ref(null)

const total = workMap.nodes.length
const relationSummary = [...new Set(workMap.edges.map((e) => e.label))].join(' / ')
const nodeById = Object.fromEntries(workMap.nodes.map((n) => [n.id, n]))
const clusterById = Object.fromEntries(workMap.clusters.map((c) => [c.id, c]))

const view = computed(() => (route.query.view === 'list' ? 'list' : 'map'))
const selectedId = computed(() => {
  const id = String(route.query.focus || '')
  return nodeById[id] ? id : ''
})
const selectedNode = computed(() => nodeById[selectedId.value] || null)
const selectedCluster = computed(() => (selectedNode.value ? clusterById[selectedNode.value.cluster] : null))

const nodesByCluster = computed(() => {
  const out = {}
  for (const c of workMap.clusters) out[c.id] = []
  for (const n of workMap.nodes) out[n.cluster]?.push(n)
  return out
})

// 一次构建双向关系表：图谱面板与列表共用同一份事实
const relationsById = computed(() => {
  const out = Object.fromEntries(workMap.nodes.map((n) => [n.id, []]))
  for (const e of workMap.edges) {
    out[e.from]?.push({ dir: 'out', label: e.label, otherId: e.to })
    out[e.to]?.push({ dir: 'in', label: e.label, otherId: e.from })
  }
  return out
})
function relationsFor(node) {
  return (relationsById.value[node.id] || []).map((r) => ({ ...r, other: nodeById[r.otherId] }))
}
const selectedRelations = computed(() => (selectedNode.value ? relationsFor(selectedNode.value) : []))
const selectedSiblings = computed(() =>
  selectedNode.value
    ? (nodesByCluster.value[selectedNode.value.cluster] || []).filter((n) => n.id !== selectedNode.value.id)
    : []
)
function countOf(clusterId) {
  return nodesByCluster.value[clusterId]?.length || 0
}

const ghUrl = site?.links?.github || 'https://github.com/anyuer678'
const ghUser = ghUrl.replace(/\/+$/, '').split('/').pop()
function githubOf(node) {
  return `https://github.com/${ghUser}/${node.repo}`
}

function replaceQuery(patch) {
  const query = { ...route.query, ...patch }
  for (const key of Object.keys(query)) {
    if (query[key] === null || query[key] === undefined || query[key] === '') delete query[key]
  }
  router.replace({ query })
}
function selectNode(id) {
  if (selectedId.value === id) return
  replaceQuery({ focus: id })
}
function clearFocus() {
  replaceQuery({ focus: null })
}
function setView(next) {
  if (next === view.value) return
  replaceQuery({ view: next === 'list' ? 'list' : null })
}

// 窄屏时详情在图的下一屏：选中后把它带进视野，否则点了节点没有任何反馈
watch(selectedId, async (id) => {
  if (!id || view.value !== 'map') return
  if (!window.matchMedia?.('(max-width: 1100px)').matches) return
  await nextTick()
  const el = detailRef.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  if (rect.bottom <= window.innerHeight && rect.top >= 0) return
  el.scrollIntoView({
    behavior: window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    block: 'nearest',
  })
})
</script>

<template>
  <div class="container container--wide">
    <PageHeader
      title="作品地图"
      description="仓库不是孤岛：三主线 + 一个回流口；四条关系都能在 README 与代码里验证。"
      :count="total"
    >
      <template #actions>
        <div class="view-switch" role="group" aria-label="地图视图">
          <button
            type="button"
            :aria-pressed="view === 'map'"
            @click="setView('map')"
          >
            图谱
          </button>
          <button
            type="button"
            :aria-pressed="view === 'list'"
            @click="setView('list')"
          >
            列表
          </button>
        </div>
      </template>
    </PageHeader>

    <!-- 图谱：节点=作品，线=可验证关系；列表视图是等价入口 -->
    <section v-if="view === 'map'" class="map-layout" aria-label="作品生态图谱">
      <div class="map-frame">
        <WorkMapGraph
          :model="workMap"
          :selected-id="selectedId"
          @select="selectNode"
          @clear="clearFocus"
        />
        <p class="map-hint">
          <span>实线 = 可验证关系（{{ relationSummary }}）；独立作品不连边。</span>
          <span class="map-hint__keys">悬停高亮 · 点击或 Enter 看详情 · Tab 浏览</span>
        </p>
      </div>

      <aside
        id="map-detail"
        ref="detailRef"
        class="map-panel"
        aria-label="节点详情"
        aria-live="polite"
      >
        <template v-if="selectedNode">
          <p class="panel__eyebrow">
            <span class="dot" :class="`dot--${selectedCluster.tone}`" />
            {{ selectedCluster.title }}
            <span class="panel__sep" aria-hidden="true">·</span>
            {{ selectedNode.role }}
          </p>
          <h2 class="panel__title">{{ selectedNode.repo }}</h2>
          <p class="panel__desc">{{ selectedNode.desc }}</p>

          <div v-if="selectedRelations.length" class="panel__block">
            <h3 class="panel__h3">可验证关系</h3>
            <ul class="rel-list">
              <li v-for="rel in selectedRelations" :key="rel.dir + rel.otherId">
                <span class="rel-list__dir" aria-hidden="true">{{ rel.dir === 'out' ? '→' : '←' }}</span>
                <button type="button" class="rel-list__node" @click="selectNode(rel.otherId)">
                  {{ rel.other.repo }}
                </button>
                <span class="rel-list__label">{{ rel.label }}</span>
              </li>
            </ul>
          </div>

          <div v-if="selectedSiblings.length" class="panel__block">
            <h3 class="panel__h3">同组</h3>
            <div class="chips">
              <button
                v-for="sibling in selectedSiblings"
                :key="sibling.id"
                type="button"
                class="chip"
                @click="selectNode(sibling.id)"
              >
                {{ sibling.repo }}
              </button>
            </div>
          </div>

          <div class="panel__actions">
            <RouterLink v-if="selectedNode.link" :to="selectedNode.link" class="btn btn--primary">
              站内档案
            </RouterLink>
            <a
              class="btn"
              :class="selectedNode.link ? 'btn--ghost' : 'btn--primary'"
              :href="githubOf(selectedNode)"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub <span aria-hidden="true">↗</span>
            </a>
          </div>
          <button type="button" class="panel__clear" @click="clearFocus">清除聚焦</button>
        </template>

        <template v-else>
          <p class="panel__eyebrow">读图指南</p>
          <h2 class="panel__title">三主线 + 一个回流口</h2>
          <p class="panel__desc">
            点是作品，线是可在仓库 README 或代码里验证的关系（{{ relationSummary }}）。
            独立作品不硬凑体系，所以不连边。
          </p>
          <ul class="legend">
            <li v-for="cluster in workMap.clusters" :key="cluster.id">
              <span class="dot" :class="`dot--${cluster.tone}`" />
              <span>{{ cluster.title }}</span>
              <em>{{ countOf(cluster.id) }}</em>
            </li>
          </ul>
          <p class="panel__hint">悬停高亮邻居；点击节点或按 Enter 查看详情；Tab 逐个浏览。</p>
        </template>
      </aside>
    </section>

    <!-- 列表：与图谱同源，中文说明完整保留 -->
    <section v-else class="map-groups" aria-label="作品列表视图">
      <div
        v-for="cluster in workMap.clusters"
        :key="cluster.id"
        class="map-group"
        :class="{ 'map-group--free': cluster.id === 'free' }"
      >
        <SectionTitle :index="cluster.index" :title="cluster.title" :description="cluster.desc" />
        <KbCard shadow="hover" class="map-card">
          <ul class="map-list">
            <li
              v-for="node in nodesByCluster[cluster.id]"
              :key="node.id"
              class="map-item"
              :class="{ 'is-focused': selectedId === node.id }"
            >
              <div class="map-item__head">
                <RouterLink v-if="node.link" :to="node.link" class="map-item__name">
                  {{ node.repo }}
                </RouterLink>
                <a
                  v-else
                  :href="githubOf(node)"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="map-item__name"
                >
                  {{ node.repo }}<span class="map-item__ext" aria-hidden="true">↗</span>
                </a>
                <KbTag :type="node.tone" size="small">{{ node.role }}</KbTag>
              </div>
              <p class="map-item__desc">{{ node.desc }}</p>
              <p v-if="relationsFor(node).length" class="map-item__rels">
                <span class="map-item__rels-cap">关系</span>
                <span v-for="rel in relationsFor(node)" :key="rel.dir + rel.otherId" class="map-rel">
                  <span aria-hidden="true">{{ rel.dir === 'out' ? '→' : '←' }}</span>
                  {{ rel.other.repo }} · {{ rel.label }}
                </span>
              </p>
            </li>
          </ul>
        </KbCard>
      </div>
    </section>

    <hr class="map-rule" />
    <p class="map-footnote">
      生态关系均可在各仓 README「生态」区块与代码中验证（lumen 的 MCP 注册、kb-ui 的 npm 包、题解转换工作流）；
      全部仓库的入口见
      <a :href="ghUrl" target="_blank" rel="noopener noreferrer">GitHub Profile</a>。
    </p>
  </div>
</template>

<style scoped>
/* 视图切换 */
.view-switch {
  display: inline-flex;
  padding: 2px;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  background: var(--color-surface-muted);
}
.view-switch button {
  min-height: 32px;
  padding: 5px 14px;
  border: 0;
  border-radius: 999px;
  background: transparent;
  color: var(--color-text-secondary);
  font: inherit;
  font-size: var(--text-small);
  cursor: pointer;
  transition: background var(--dur-fast) var(--ease-standard), color var(--dur-fast) var(--ease-standard);
}
.view-switch button:hover {
  color: var(--color-text);
}
.view-switch button[aria-pressed="true"] {
  background: var(--color-surface);
  color: var(--color-text);
  box-shadow: var(--shadow-card);
}

/* 图谱布局 */
.map-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 300px;
  gap: var(--space-6);
  align-items: start;
}
.map-frame {
  min-width: 0;
  padding: clamp(8px, 1.4vw, 18px);
  border: var(--border-default);
  border-radius: var(--radius-lg);
  background:
    radial-gradient(ellipse at 18% 0%, rgba(176, 92, 58, 0.055), transparent 58%),
    var(--color-surface);
  box-shadow: var(--shadow-card);
}
.map-hint {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: var(--space-2) var(--space-4);
  margin-top: var(--space-3);
  padding: var(--space-3) var(--space-2) 0;
  border-top: 1px dashed var(--color-border);
  font-size: var(--text-caption);
  color: var(--color-text-secondary);
}
.map-hint__keys {
  font-family: var(--font-mono);
  font-size: 11px;
}

/* 详情面板 */
.map-panel {
  position: sticky;
  top: 80px;
  min-height: 280px;
  padding: var(--space-6);
  border: var(--border-default);
  border-radius: var(--radius-lg);
  background: var(--color-surface);
  box-shadow: var(--shadow-card);
}
.panel__eyebrow {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.02em;
  color: var(--color-text-secondary);
}
.panel__sep {
  color: var(--color-text-tertiary);
}
.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
  background: var(--color-text-secondary);
}
.dot--agent {
  background: #b05c3a;
}
.dot--infra {
  background: #5a4b8a;
}
.dot--train {
  background: #336b43;
}
.dot--free {
  background: #6e6e68;
}
.panel__title {
  margin-top: var(--space-2);
  font-family: var(--font-display);
  font-size: 22px;
  line-height: 1.3;
  overflow-wrap: anywhere;
}
.panel__desc {
  margin-top: var(--space-3);
  font-size: var(--text-small);
  color: var(--color-text-secondary);
}
.panel__block {
  margin-top: var(--space-4);
  padding-top: var(--space-3);
  border-top: var(--border-default);
}
.panel__h3 {
  margin-bottom: var(--space-2);
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.06em;
  color: var(--color-text-secondary);
}
.panel__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-top: var(--space-5);
}
.panel__actions .btn {
  padding-inline: var(--space-4);
}
.panel__clear {
  margin-top: var(--space-4);
  padding: 0;
  border: 0;
  background: none;
  color: var(--color-text-tertiary);
  font: inherit;
  font-size: var(--text-caption);
  cursor: pointer;
}
.panel__clear:hover {
  color: var(--color-accent);
  text-decoration: underline;
}
.panel__hint {
  margin-top: var(--space-4);
  font-size: var(--text-caption);
  color: var(--color-text-secondary);
}

/* 关系与同组 */
.rel-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: var(--space-2);
}
.rel-list li {
  display: flex;
  align-items: baseline;
  gap: var(--space-2);
}
.rel-list__dir {
  font-family: var(--font-mono);
  color: var(--color-text-tertiary);
}
.rel-list__node {
  padding: 0;
  border: 0;
  background: none;
  color: var(--color-accent);
  font: inherit;
  font-size: var(--text-small);
  cursor: pointer;
}
.rel-list__node:hover {
  color: var(--color-accent-hover);
  text-decoration: underline;
}
.rel-list__label {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--color-text-secondary);
}
.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.chip {
  min-height: 28px;
  padding: 3px 10px;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  background: var(--color-surface-muted);
  color: var(--color-text-secondary);
  font-family: var(--font-mono);
  font-size: 11px;
  cursor: pointer;
}
.chip:hover {
  border-color: var(--color-border-strong);
  color: var(--color-accent);
}
.legend {
  list-style: none;
  margin: var(--space-4) 0 0;
  padding: 0;
}
.legend li {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: 7px 0;
  border-bottom: 1px dashed var(--color-border);
  font-size: var(--text-small);
  color: var(--color-text-secondary);
}
.legend em {
  margin-left: auto;
  font-family: var(--font-mono);
  font-style: normal;
  font-size: 11px;
  color: var(--color-text-tertiary);
}

/* 列表 */
.map-groups {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(440px, 100%), 1fr));
  gap: var(--space-6);
  align-items: start;
}
.map-group--free {
  grid-column: 1 / -1;
}
.map-group--free .map-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(300px, 100%), 1fr));
  gap: var(--space-4) var(--space-8);
}
.map-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: var(--space-4);
}
.map-item {
  padding-left: 0;
  border-left: 3px solid transparent;
  transition: border-color var(--dur-fast) var(--ease-standard);
}
.map-item.is-focused {
  border-left-color: var(--color-accent);
  padding-left: var(--space-3);
}
.map-item__head {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  flex-wrap: wrap;
}
.map-item__name {
  font-family: var(--font-mono);
  font-weight: 600;
  font-size: 1rem;
  overflow-wrap: anywhere;
}
.map-item__ext {
  margin-left: 2px;
  font-size: 0.75em;
  color: var(--color-text-tertiary);
}
.map-item__desc {
  margin-top: 0.2rem;
  font-size: var(--text-small);
  color: var(--color-text-secondary);
}
.map-item__rels {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 4px 12px;
  margin-top: var(--space-2);
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--color-text-secondary);
}
.map-item__rels-cap {
  padding: 1px 6px;
  border-radius: 999px;
  background: var(--color-surface-muted);
  color: var(--color-text-tertiary);
  font-size: 10px;
  letter-spacing: 0.04em;
}
.map-rule {
  margin: var(--space-10) 0 var(--space-4);
  border: 0;
  border-top: var(--border-default);
}
.map-footnote {
  font-size: var(--text-small);
  color: var(--color-text-secondary);
}

@media (max-width: 1100px) {
  .map-layout {
    grid-template-columns: 1fr;
  }
  .map-frame :deep(.workmap) {
    max-width: 560px;
    margin-inline: auto;
  }
  .map-panel {
    position: static;
  }
}
@media (max-width: 640px) {
  .map-hint__keys {
    display: none;
  }
  .map-groups {
    gap: var(--space-4);
  }
  .map-panel {
    padding: var(--space-5);
  }
}
</style>
