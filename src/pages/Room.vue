<script setup>
// /room —— 纸感工作室：舞台 + 检视面板 + 物件目录（15 Wave 3.A）
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import RoomHotspot from '@/components/features/room/RoomHotspot.vue'
import { room as roomConfig, githubData, site, featuredProjects } from '@/utils/content.js'
import { setTitle, setDescription } from '@/utils/seo.js'

const route = useRoute()
const router = useRouter()
const baseUrl = import.meta.env.BASE_URL

const scenes = computed(() => roomConfig?.scenes ?? [])
const sceneIds = computed(() => scenes.value.map((s) => s.id))

const activeScene = computed(() => {
  const q = route.query.scene
  return sceneIds.value.includes(q) ? q : sceneIds.value[0] || 'desk'
})
const scene = computed(() => scenes.value.find((s) => s.id === activeScene.value))
const hotspots = computed(() => scene.value?.hotspots ?? [])
const sceneImage = computed(() => (scene.value?.image ? baseUrl + scene.value.image : ''))

const selectedId = ref(null)
const hoverId = ref(null)
const easter = ref('')

const selected = computed(
  () => hotspots.value.find((h) => h.id === selectedId.value) || null
)
const hovered = computed(
  () => hotspots.value.find((h) => h.id === hoverId.value) || null
)
const focusHotspot = computed(() => selected.value || hovered.value)

/** 物件状态 session 记忆 */
const states = ref({})
watch(
  scenes,
  (list) => {
    const next = {}
    for (const s of list) {
      for (const h of s.hotspots) {
        if (!h.stateful) continue
        const key = `${s.id}:${h.id}`
        next[key] = sessionStorage.getItem(`room:${key}`) || h.defaultState || 'closed'
      }
    }
    states.value = next
  },
  { immediate: true }
)

function isOn(h) {
  if (!h?.stateful) return false
  const s = states.value[`${activeScene.value}:${h.id}`]
  return s === 'open' || s === 'on'
}

function setScene(id) {
  selectedId.value = null
  hoverId.value = null
  easter.value = ''
  router.replace({ query: { ...route.query, scene: id === sceneIds.value[0] ? undefined : id } })
}

function activate(h) {
  if (h.stateful) {
    const key = `${activeScene.value}:${h.id}`
    const cur = states.value[key] || h.defaultState || 'closed'
    const next =
      cur === 'open' || cur === 'on' ? (cur === 'on' ? 'off' : 'closed') : cur === 'off' ? 'on' : 'open'
    states.value = { ...states.value, [key]: next }
    sessionStorage.setItem(`room:${key}`, next)
  }

  if (h.overlay === 'easter') {
    selectedId.value = h.id
    easter.value = h.blurb || site?.philosophy || ''
    return
  }
  if (h.overlay === 'pulse') {
    selectedId.value = selectedId.value === h.id ? null : h.id
    return
  }

  // 先选中展示详情，再提供 CTA；双击/再点同一物件可直接进入
  if (selectedId.value === h.id && h.to) {
    router.push(h.to)
    return
  }
  selectedId.value = h.id
}

function goSelected() {
  if (selected.value?.to) router.push(selected.value.to)
}

function selectFromList(h) {
  selectedId.value = h.id
  hoverId.value = h.id
}

const pulseRepos = computed(() => {
  return Object.values(githubData.repos || {})
    .filter((r) => r.pushed_at)
    .sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at))
    .slice(0, 6)
})

const onLabels = computed(() =>
  hotspots.value.filter((h) => isOn(h)).map((h) => h.label)
)

const panelTitle = computed(() => {
  if (easter.value) return '咖啡因语录'
  if (selected.value?.overlay === 'pulse') return '窗外 · 最近动态'
  return focusHotspot.value?.label || scene.value?.title || '工作室'
})

const panelBlurb = computed(() => {
  if (easter.value) return easter.value
  return focusHotspot.value?.blurb || scene.value?.blurb || ''
})

const panelCta = computed(() => {
  if (easter.value || selected.value?.overlay === 'pulse') return null
  return focusHotspot.value?.cta || (focusHotspot.value?.to ? '打开' : null)
})

setTitle(`工作室 · ${site?.name || 'Yuer'}`)
setDescription('走进纸感工作室：书桌、书架与窗边，藏着项目、笔记与时间线。')
</script>

<template>
  <div class="room">
    <div class="container room__intro">
      <div>
        <p class="room__kicker">Studio · 特别篇</p>
        <h1>工作室</h1>
        <p class="room__sub">
          点一点屋里的东西。也可以
          <RouterLink :to="roomConfig?.listFallbackHref || '/projects'">用列表浏览</RouterLink>
          ——内容都在。
        </p>
      </div>
      <nav class="room__scenes" aria-label="场景切换">
        <button
          v-for="s in scenes"
          :key="s.id"
          type="button"
          class="room__scene-btn"
          :class="{ 'room__scene-btn--on': s.id === activeScene }"
          :aria-current="s.id === activeScene ? 'page' : undefined"
          @click="setScene(s.id)"
        >
          <span class="room__scene-title">{{ s.title }}</span>
          <span v-if="s.subtitle" class="room__scene-sub">{{ s.subtitle }}</span>
        </button>
      </nav>
    </div>

    <div class="room__layout container">
      <!-- 舞台 -->
      <section class="room__stage-wrap" aria-label="工作室场景">
        <div class="room__stage" :data-scene="activeScene">
          <Transition name="room-fade" mode="out-in">
            <img
              v-if="sceneImage"
              :key="activeScene"
              class="room__art"
              :src="sceneImage"
              :alt="`${scene?.title || ''}场景插画`"
              width="2048"
              height="1152"
              decoding="async"
            />
          </Transition>

          <RoomHotspot
            v-for="h in hotspots"
            :key="`${activeScene}-${h.id}`"
            :hotspot="h"
            :active="selectedId === h.id || isOn(h)"
            :dimmed="!!selectedId && selectedId !== h.id"
            @activate="activate"
            @hover="(hp) => (hoverId = hp?.id || null)"
          />

          <div v-if="onLabels.length" class="room__wake" aria-live="polite">
            已唤醒：{{ onLabels.join(' · ') }}
          </div>
        </div>

        <!-- 物件目录 -->
        <div class="room__catalog" role="list" aria-label="本场景物件">
          <button
            v-for="h in hotspots"
            :key="h.id"
            type="button"
            role="listitem"
            class="room__catalog-item"
            :class="{ 'room__catalog-item--on': selectedId === h.id }"
            @click="selectFromList(h)"
            @mouseenter="hoverId = h.id"
            @mouseleave="hoverId = null"
          >
            <span class="room__catalog-dot" aria-hidden="true" />
            <span class="room__catalog-label">{{ h.label }}</span>
            <span v-if="isOn(h)" class="room__catalog-state">开</span>
          </button>
        </div>
      </section>

      <!-- 检视面板 -->
      <aside class="room__panel" aria-live="polite">
        <p class="room__panel-kicker">{{ scene?.subtitle || 'Inspector' }}</p>
        <h2 class="room__panel-title">{{ panelTitle }}</h2>
        <p class="room__panel-blurb">{{ panelBlurb }}</p>

        <template v-if="selected?.overlay === 'pulse'">
          <ul class="room__pulse">
            <li v-for="r in pulseRepos" :key="r.name">
              <RouterLink v-if="r.slug" :to="`/projects/${r.slug}`">{{ r.name }}</RouterLink>
              <a
                v-else
                :href="`https://github.com/${githubData.user || 'anyuer678'}/${r.name}`"
                target="_blank"
                rel="noopener noreferrer"
              >{{ r.name }}</a>
              <span v-if="r.release" class="room__pulse-meta">{{ r.release }}</span>
            </li>
          </ul>
        </template>

        <div v-if="panelCta" class="room__panel-actions">
          <button v-if="!selected?.to" type="button" class="room__cta room__cta--primary" disabled>
            {{ panelCta }}
          </button>
          <button v-else type="button" class="room__cta room__cta--primary" @click="goSelected">
            {{ panelCta }} →
          </button>
        </div>
        <p v-else-if="selected && !easter" class="room__panel-hint">再点一次可直接打开</p>

        <div v-if="selected && selected.to" class="room__panel-link">
          <RouterLink :to="selected.to">{{ selected.to }}</RouterLink>
        </div>

        <footer class="room__panel-foot">
          <p class="room__panel-hint">Tab 聚焦物件 · Enter 选中 · 再按进入</p>
          <RouterLink class="room__panel-list" :to="roomConfig?.listFallbackHref || '/projects'">
            以列表浏览全部项目 →
          </RouterLink>
        </footer>
      </aside>
    </div>

    <section v-if="featuredProjects.length" class="container room__featured">
      <h2 class="room__featured-title">桌上没写完的事</h2>
      <div class="room__featured-grid">
        <RouterLink
          v-for="p in featuredProjects"
          :key="p.slug"
          :to="`/projects/${p.slug}`"
          class="room__fp"
        >
          <span class="room__fp-title">{{ p.title }}</span>
          <span class="room__fp-sub">{{ p.subtitle }}</span>
          <span class="room__fp-sum">{{ p.summary }}</span>
        </RouterLink>
      </div>
    </section>
  </div>
</template>

<style scoped>
.room {
  padding-bottom: var(--space-16);
}
.room__intro {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--space-4);
  padding-block: var(--space-8) var(--space-6);
}
.room__kicker {
  margin: 0;
  font-family: var(--font-mono);
  font-size: var(--text-caption);
  color: var(--color-accent);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.room__intro h1 {
  font-family: var(--font-display);
  font-size: var(--text-h1);
  line-height: var(--lh-h1);
  margin: var(--space-1) 0;
}
.room__sub {
  margin: 0;
  font-size: var(--text-small);
  color: var(--color-text-secondary);
}
.room__sub a {
  color: var(--color-accent);
}
.room__scenes {
  display: flex;
  gap: var(--space-2);
}
.room__scene-btn {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  padding: var(--space-3) var(--space-5);
  border: var(--border-default);
  border-radius: var(--radius-md);
  background: var(--color-surface);
  cursor: pointer;
  text-align: left;
  transition:
    border-color var(--dur-fast) var(--ease-standard),
    background var(--dur-fast) var(--ease-standard);
}
.room__scene-btn:hover {
  border-color: var(--color-accent);
}
.room__scene-btn--on {
  border-color: var(--color-accent);
  background: var(--color-accent-soft);
}
.room__scene-title {
  font-family: var(--font-display);
  font-size: var(--text-small);
  color: var(--color-text);
}
.room__scene-sub {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--color-text-tertiary);
}

.room__layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(260px, 320px);
  gap: var(--space-6);
  align-items: start;
}
.room__stage {
  position: relative;
  border: var(--border-default);
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: var(--color-surface-muted);
  box-shadow: var(--shadow-card);
  aspect-ratio: 16 / 9;
}
.room__art {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}
.room-fade-enter-active,
.room-fade-leave-active {
  transition: opacity var(--dur-base) var(--ease-standard);
}
.room-fade-enter-from,
.room-fade-leave-to {
  opacity: 0;
}
.room__wake {
  position: absolute;
  z-index: 3;
  left: var(--space-4);
  bottom: var(--space-4);
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--color-accent);
  background: color-mix(in srgb, var(--color-surface) 92%, transparent);
  border: var(--border-default);
  border-radius: 999px;
  padding: 4px 12px;
  pointer-events: none;
}

.room__catalog {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-top: var(--space-3);
}
.room__catalog-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border: var(--border-default);
  border-radius: 999px;
  background: var(--color-surface);
  font-size: var(--text-caption);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition:
    color var(--dur-fast) var(--ease-standard),
    border-color var(--dur-fast) var(--ease-standard),
    background var(--dur-fast) var(--ease-standard);
}
.room__catalog-item:hover,
.room__catalog-item--on {
  color: var(--color-accent);
  border-color: var(--color-accent);
  background: var(--color-accent-soft);
}
.room__catalog-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-accent);
  opacity: 0.7;
}
.room__catalog-state {
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--color-accent);
}

.room__panel {
  position: sticky;
  top: calc(var(--space-8) + 48px);
  padding: var(--space-6);
  background: var(--color-surface);
  border: var(--border-default);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
  min-height: 280px;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}
.room__panel-kicker {
  margin: 0;
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--color-text-tertiary);
}
.room__panel-title {
  margin: 0;
  font-family: var(--font-display);
  font-size: var(--text-h2);
  line-height: var(--lh-h2);
}
.room__panel-blurb {
  margin: 0;
  font-size: var(--text-small);
  color: var(--color-text-secondary);
  line-height: var(--lh-small);
  flex: 1;
}
.room__panel-actions {
  display: flex;
  gap: var(--space-2);
}
.room__cta {
  font-family: var(--font-mono);
  font-size: var(--text-caption);
  padding: 10px 16px;
  border-radius: var(--radius-md);
  border: var(--border-default);
  background: var(--color-surface);
  color: var(--color-text);
  cursor: pointer;
}
.room__cta--primary {
  background: var(--color-accent);
  border-color: var(--color-accent);
  color: #fff;
}
.room__cta--primary:hover:not(:disabled) {
  background: var(--color-accent-hover);
}
.room__cta:disabled {
  opacity: 0.5;
  cursor: default;
}
.room__panel-hint {
  margin: 0;
  font-size: var(--text-caption);
  color: var(--color-text-tertiary);
}
.room__panel-link {
  font-family: var(--font-mono);
  font-size: 12px;
}
.room__panel-link a {
  color: var(--color-accent);
}
.room__panel-foot {
  margin-top: auto;
  padding-top: var(--space-4);
  border-top: var(--border-default);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}
.room__panel-list {
  font-family: var(--font-mono);
  font-size: var(--text-caption);
  color: var(--color-accent);
  text-decoration: none;
}
.room__panel-list:hover {
  text-decoration: underline;
  text-underline-offset: 3px;
}
.room__pulse {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  font-size: var(--text-small);
}
.room__pulse a {
  color: var(--color-text);
}
.room__pulse a:hover {
  color: var(--color-accent);
}
.room__pulse-meta {
  margin-left: var(--space-2);
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--color-text-tertiary);
}

.room__featured {
  margin-top: var(--space-12);
}
.room__featured-title {
  font-family: var(--font-display);
  font-size: var(--text-h3);
  margin: 0 0 var(--space-4);
}
.room__featured-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(240px, 100%), 1fr));
  gap: var(--space-4);
}
.room__fp {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: var(--space-5);
  border: var(--border-default);
  border-radius: var(--radius-md);
  background: var(--color-surface);
  text-decoration: none;
  color: inherit;
  transition:
    border-color var(--dur-fast) var(--ease-standard),
    box-shadow var(--dur-fast) var(--ease-standard);
}
.room__fp:hover {
  border-color: var(--color-accent);
  box-shadow: var(--shadow-card-hover);
}
.room__fp-title {
  font-family: var(--font-display);
  font-size: var(--text-h3);
}
.room__fp-sub {
  font-family: var(--font-mono);
  font-size: var(--text-caption);
  color: var(--color-accent);
}
.room__fp-sum {
  font-size: var(--text-caption);
  color: var(--color-text-secondary);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@media (max-width: 900px) {
  .room__layout {
    grid-template-columns: 1fr;
  }
  .room__panel {
    position: static;
    min-height: 0;
  }
}
@media (max-width: 640px) {
  .room__stage {
    aspect-ratio: 4 / 3;
  }
  .room__scene-btn {
    flex: 1;
  }
}
</style>
