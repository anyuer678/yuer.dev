<script setup>
// WorkMapGraph —— 作品生态图：语义在 work-map.json，坐标在节点的 at.wide/at.compact。
// 只渲染可验证关系；独立作品不连边。
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

const props = defineProps({
  model: { type: Object, required: true },
  selectedId: { type: String, default: '' },
})
const emit = defineEmits(['select', 'clear'])

const MQ = '(max-width: 1100px)'
const mq = typeof window === 'undefined' ? null : window.matchMedia(MQ)
const compact = ref(mq?.matches ?? false)
function onMq(e) {
  compact.value = e.matches
}
onMounted(() => mq?.addEventListener?.('change', onMq))
onBeforeUnmount(() => mq?.removeEventListener?.('change', onMq))

const mode = computed(() => (compact.value ? 'compact' : 'wide'))
const viewBox = computed(() => (compact.value ? '0 0 390 1066' : '0 0 1000 720'))
const width = computed(() => (compact.value ? 390 : 1000))
const height = computed(() => (compact.value ? 1066 : 720))

const clusters = computed(() => props.model.clusters)
const nodes = computed(() => props.model.nodes)
const edges = computed(() => props.model.edges)
const nodeById = computed(() => Object.fromEntries(nodes.value.map((n) => [n.id, n])))
const clusterById = computed(() => Object.fromEntries(clusters.value.map((c) => [c.id, c])))

const hoverId = ref('')
const activeId = computed(() => hoverId.value || props.selectedId)

const related = computed(() => {
  if (!activeId.value) return null
  const set = new Set([activeId.value])
  for (const e of edges.value) {
    if (e.from === activeId.value) set.add(e.to)
    if (e.to === activeId.value) set.add(e.from)
  }
  return set
})

function pos(node) {
  const p = node.at[mode.value]
  return { x: p[0], y: p[1] }
}
function radius(node) {
  if (node.core) return compact.value ? 25 : 31
  if (node.cluster === 'free') return compact.value ? 17 : 20
  return compact.value ? 18 : 22
}
function hitRadius(node) {
  return radius(node) + (compact.value ? (node.cluster === 'free' ? 9 : 12) : 14)
}
function clusterOf(id) {
  return clusterById.value[nodeById.value[id]?.cluster]
}
function nodeClass(node) {
  const state = !activeId.value
    ? 'is-idle'
    : related.value.has(node.id)
      ? 'is-related'
      : 'is-dim'
  return [
    `map-node--${clusterOf(node.id)?.tone || 'free'}`,
    { 'is-core': node.core, 'is-selected': props.selectedId === node.id, 'is-active': activeId.value === node.id, [state]: true },
  ]
}
function edgeClass(edge) {
  const state = !activeId.value
    ? 'is-idle'
    : edge.from === activeId.value || edge.to === activeId.value
      ? 'is-related'
      : 'is-dim'
  return [`map-edge--${clusterOf(edge.from)?.tone || 'free'}`, state]
}

function edgeGeometry(edge) {
  const a = pos(nodeById.value[edge.from])
  const b = pos(nodeById.value[edge.to])
  const ra = radius(nodeById.value[edge.from]) + 6
  const rb = radius(nodeById.value[edge.to]) + 9
  const dx = b.x - a.x
  const dy = b.y - a.y
  const d = Math.hypot(dx, dy) || 1
  const x1 = a.x + (dx / d) * ra
  const y1 = a.y + (dy / d) * ra
  const x2 = b.x - (dx / d) * rb
  const y2 = b.y - (dy / d) * rb
  const mx = (x1 + x2) / 2
  const my = (y1 + y2) / 2
  const nx = -dy / d
  const ny = dx / d
  const c = edge.curve || 0
  return {
    d: `M${x1.toFixed(1)},${y1.toFixed(1)} Q${(mx + nx * c).toFixed(1)},${(my + ny * c).toFixed(1)} ${x2.toFixed(1)},${y2.toFixed(1)}`,
  }
}

function wrapText(text, maxChars) {
  const lines = []
  let line = ''
  for (const token of text.match(/[A-Za-z0-9./+~_-]+|\s+|./gu) || []) {
    if (line.length + token.length > maxChars && line.trim()) {
      lines.push(line.trimEnd())
      line = ''
    }
    line += token
  }
  if (line.trim()) lines.push(line.trimEnd())
  // 避免孤零零的句号被折到下一行（`。` 单独一行比轻微超宽更难读）
  if (lines.length > 1 && [...lines[lines.length - 1]].length <= 2) {
    lines[lines.length - 2] += lines.pop()
  }
  return lines
}
function descLines(cluster) {
  const island = cluster.island[mode.value]
  const size = compact.value ? 11.5 : 13
  return wrapText(cluster.desc, Math.floor((island[2] - 44) / size))
}

function select(id) {
  hoverId.value = ''
  emit('select', id)
}
function onNodeKey(e, id) {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    select(id)
  } else if (e.key === 'Escape') {
    emit('clear')
  }
}
function onLeave() {
  hoverId.value = ''
}
</script>

<template>
  <svg
    class="workmap"
    :class="{ 'is-compact': compact }"
    :viewBox="viewBox"
    :width="width"
    :height="height"
    preserveAspectRatio="xMidYMid meet"
    role="group"
    aria-label="作品生态关系图：三主线、独立作品与四条可验证关系"
  >
    <title>作品生态关系图</title>
    <desc>
      共四组作品。实线表示可在仓库 README 或代码中验证的关系：keyvault 为 lumen 提供密钥前置，
      voiceconsole 与 dsh-logtimeline 注册进 lumen，codedrill 的题解回流到 polycodehub。
      独立作品不与主线连边。
    </desc>

    <defs>
      <pattern id="map-dots" width="20" height="20" patternUnits="userSpaceOnUse">
        <circle cx="1.2" cy="1.2" r="0.9" fill="currentColor" opacity="0.16" />
      </pattern>
      <marker
        v-for="tone in ['agent', 'infra', 'train', 'free']"
        :id="`map-arrow-${tone}`"
        :key="tone"
        viewBox="0 0 8 8"
        refX="7"
        refY="4"
        markerWidth="7"
        markerHeight="7"
        orient="auto-start-reverse"
      >
        <path d="M0,0 L8,4 L0,8 z" :class="`marker-fill--${tone}`" />
      </marker>
    </defs>

    <rect class="map-bg" :width="width" :height="height" fill="url(#map-dots)" />

    <!-- 组底图 -->
    <g v-for="cluster in clusters" :key="`island-${cluster.id}`" class="island" :class="`cluster--${cluster.tone}`" aria-hidden="true">
      <rect
        class="island__bg"
        :x="cluster.island[mode][0]"
        :y="cluster.island[mode][1]"
        :width="cluster.island[mode][2]"
        :height="cluster.island[mode][3]"
        rx="20"
      />
      <text class="island__index" :x="cluster.island[mode][0] + cluster.island[mode][2] - 20" :y="cluster.island[mode][1] + 32" text-anchor="end">
        {{ cluster.index }}
      </text>
      <text class="island__title" :x="cluster.titleAt[mode][0]" :y="cluster.titleAt[mode][1]">
        {{ cluster.title }}
      </text>
      <text
        v-for="(line, i) in descLines(cluster)"
        :key="`${cluster.id}-d${i}`"
        class="island__desc"
        :x="cluster.descAt[mode][0]"
        :y="cluster.descAt[mode][1] + i * (compact ? 14 : 15)"
      >
        {{ line }}
      </text>
    </g>

    <!-- 关系线 -->
    <g
      v-for="edge in edges"
      :key="`${edge.from}-${edge.to}`"
      class="map-edge"
      :class="edgeClass(edge)"
      aria-hidden="true"
    >
      <path
        class="map-edge__line"
        :d="edgeGeometry(edge).d"
        :marker-end="`url(#map-arrow-${clusterOf(edge.from)?.tone || 'free'})`"
        vector-effect="non-scaling-stroke"
      />
    </g>

    <!-- 节点 -->
    <g
      v-for="node in nodes"
      :key="node.id"
      class="map-node"
      :class="nodeClass(node)"
      :transform="`translate(${pos(node).x} ${pos(node).y})`"
      role="button"
      tabindex="0"
      :aria-label="`${node.repo}，${node.role}。${node.core ? '核心节点。' : ''}查看关系与档案`"
      :aria-pressed="selectedId === node.id"
      @mouseenter="hoverId = node.id"
      @mouseleave="hoverId = ''"
      @focus="hoverId = node.id"
      @blur="onLeave"
      @click="select(node.id)"
      @keydown="onNodeKey($event, node.id)"
    >
      <title>{{ node.repo }} · {{ node.role }}</title>
      <circle class="map-node__hit" :r="hitRadius(node)" />
      <circle v-if="node.core" class="map-node__halo" :r="radius(node) + 7" />
      <circle class="map-node__focus" :r="radius(node) + 6" />
      <circle class="map-node__body" :r="radius(node)" vector-effect="non-scaling-stroke" />
      <circle class="map-node__pin" :r="node.core ? 4.2 : 2.6" />
      <text
        class="map-node__name"
        :y="radius(node) + (compact ? 16 : 18)"
        text-anchor="middle"
        :class="{ 'is-long': node.repo.length > 17 }"
      >
        {{ node.repo }}
      </text>
      <text
        v-if="!compact || node.core || selectedId === node.id"
        class="map-node__role"
        :y="radius(node) + (compact ? 28 : 32)"
        text-anchor="middle"
      >
        {{ node.role }}
      </text>
    </g>
  </svg>
</template>

<style scoped>
.workmap {
  display: block;
  width: 100%;
  height: auto;
  color: var(--color-border-strong);
  overflow: visible;
}

/* 组色：三主线各一色，独立作品中性 */
.cluster--agent,
.map-node--agent,
.map-edge--agent {
  --c: #b05c3a;
  --c-soft: #f6e9e1;
}
.cluster--infra,
.map-node--infra,
.map-edge--infra {
  --c: #5a4b8a;
  --c-soft: #ece9f4;
}
.cluster--train,
.map-node--train,
.map-edge--train {
  --c: #336b43;
  --c-soft: #e6f0e8;
}
.cluster--free,
.map-node--free,
.map-edge--free {
  --c: #6e6e68;
  --c-soft: #f3f2ec;
}
.marker-fill--agent {
  fill: #b05c3a;
}
.marker-fill--infra {
  fill: #5a4b8a;
}
.marker-fill--train {
  fill: #336b43;
}
.marker-fill--free {
  fill: #6e6e68;
}

.map-bg {
  pointer-events: none;
}

/* 岛屿 */
.island__bg {
  fill: var(--color-surface);
  stroke: var(--c);
  stroke-opacity: 0.22;
  stroke-width: 1.2;
}
.cluster--free .island__bg {
  fill-opacity: 0.55;
  stroke-dasharray: 3 6;
  stroke-opacity: 0.35;
}
.island__index {
  font-family: var(--font-mono);
  font-size: 9.5px;
  letter-spacing: 0.08em;
  fill: var(--c);
  opacity: 0.55;
}
.island__title {
  font-family: var(--font-display);
  font-size: 19px;
  font-weight: 600;
  fill: var(--color-text);
}
.island__desc {
  font-size: 13px;
  fill: var(--color-text-secondary);
}

/* 关系线 */
.map-edge__line {
  fill: none;
  stroke: var(--c);
  stroke-opacity: 0.42;
  stroke-width: 1.3;
  transition: stroke-opacity var(--dur-fast) var(--ease-standard), stroke-width var(--dur-fast) var(--ease-standard);
}
.map-edge.is-related .map-edge__line {
  stroke-opacity: 0.95;
  stroke-width: 2;
}
.map-edge.is-dim {
  opacity: 0.22;
}
/* 窄屏：SVG 按容器宽度放大，字号回落一档 */
.workmap.is-compact .island__title {
  font-size: 17px;
}
.workmap.is-compact .island__desc {
  font-size: 11.5px;
}
.workmap.is-compact .map-node__name {
  font-size: 14px;
}
.workmap.is-compact .map-node__name.is-long {
  font-size: 13px;
}
.workmap.is-compact .map-node__role {
  font-size: 11.5px;
}

/* 节点 */
.map-node {
  cursor: pointer;
  outline: none;
  transition: opacity var(--dur-fast) var(--ease-standard);
}
.map-node__hit {
  fill: transparent;
}
.map-node__halo {
  fill: var(--c);
  opacity: 0.07;
}
.map-node__body {
  fill: var(--c-soft);
  stroke: var(--c);
  stroke-width: 1.4;
  transition: fill var(--dur-fast) var(--ease-standard), stroke-width var(--dur-fast) var(--ease-standard);
}
.map-node__pin {
  fill: var(--c);
}
.map-node__focus {
  fill: none;
  stroke: var(--c);
  stroke-width: 1.6;
  opacity: 0;
  transition: opacity var(--dur-fast) var(--ease-standard);
}
.map-node.is-selected .map-node__focus,
.map-node:focus-visible .map-node__focus {
  opacity: 1;
}
.map-node.is-active .map-node__body {
  stroke-width: 2.2;
  fill: var(--c);
}
.map-node.is-active .map-node__pin {
  fill: var(--color-surface);
}
.map-node.is-dim {
  opacity: 0.32;
}
.map-node.is-dim .map-node__body {
  fill: var(--color-surface-muted);
}
.map-node__name {
  font-family: var(--font-mono);
  font-size: 17px;
  font-weight: 600;
  fill: var(--color-text);
  paint-order: stroke;
  stroke: var(--color-surface);
  stroke-width: 3px;
  stroke-linejoin: round;
  pointer-events: none;
}
.map-node__name.is-long {
  font-size: 15px;
}
.map-node.is-selected .map-node__name,
.map-node.is-active .map-node__name {
  fill: var(--c);
}
.map-node__role {
  font-size: 13px;
  fill: var(--color-text-secondary);
  paint-order: stroke;
  stroke: var(--color-surface);
  stroke-width: 3px;
  stroke-linejoin: round;
  pointer-events: none;
}
.map-node.is-dim .map-node__name,
.map-node.is-dim .map-node__role {
  fill: var(--color-text-secondary);
}
</style>
