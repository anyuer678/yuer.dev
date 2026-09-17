<script setup>
// /room —— 沉浸式工作室：房间占满主界面，浮层检视，自然描边高亮
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
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
const easterOpen = ref(false)
const stageEl = ref(null)
const parallax = ref({ x: 0, y: 0 })

const selected = computed(() => hotspots.value.find((h) => h.id === selectedId.value) || null)
const hover = computed(() => hotspots.value.find((h) => h.id === hoverId.value) || null)

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
  easterOpen.value = false
  router.replace({ query: { ...route.query, scene: id === sceneIds.value[0] ? undefined : id } })
}

function toggleState(h) {
  if (!h.stateful) return
  const key = `${activeScene.value}:${h.id}`
  const cur = states.value[key] || h.defaultState || 'closed'
  const next =
    cur === 'open' || cur === 'on' ? (cur === 'on' ? 'off' : 'closed') : cur === 'off' ? 'on' : 'open'
  states.value = { ...states.value, [key]: next }
  sessionStorage.setItem(`room:${key}`, next)
}

function activate(h) {
  // 再点已选中且有链接 → 进入；否则选中
  if (selectedId.value === h.id && h.to && !h.overlay) {
    router.push(h.to)
    return
  }
  if (h.overlay === 'easter') {
    selectedId.value = h.id
    easterOpen.value = true
    return
  }
  if (h.overlay === 'pulse') {
    selectedId.value = selectedId.value === h.id ? null : h.id
    easterOpen.value = false
    return
  }
  selectedId.value = h.id
  easterOpen.value = false
  toggleState(h)
  // 场景跳转物件：书架/窗
  if (h.sceneJump && sceneIds.value.includes(h.sceneJump)) {
    // 延迟一拍让用户看到选中反馈
    setTimeout(() => setScene(h.sceneJump), 280)
  }
}

function clearSelection() {
  selectedId.value = null
  easterOpen.value = false
}

function goSelected() {
  if (selected.value?.to) router.push(selected.value.to)
}

function onKey(e) {
  if (e.key === 'Escape') clearSelection()
  if (e.key === '1') setScene(sceneIds.value[0])
  if (e.key === '2') setScene(sceneIds.value[1])
  if (e.key === '3') setScene(sceneIds.value[2])
}

function onMove(e) {
  const el = stageEl.value
  if (!el) return
  const r = el.getBoundingClientRect()
  const nx = ((e.clientX - r.left) / r.width - 0.5) * 2
  const ny = ((e.clientY - r.top) / r.height - 0.5) * 2
  parallax.value = { x: nx * 8, y: ny * 5 }
}

function onLeave() {
  parallax.value = { x: 0, y: 0 }
}

onMounted(() => {
  window.addEventListener('keydown', onKey)
})
onUnmounted(() => {
  window.removeEventListener('keydown', onKey)
})

const pulseRepos = computed(() =>
  Object.values(githubData.repos || {})
    .filter((r) => r.pushed_at)
    .sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at))
    .slice(0, 6)
)

const onLabels = computed(() => hotspots.value.filter(isOn).map((h) => h.label))

setTitle(`工作室 · ${site?.name || 'Yuer'}`)
setDescription('走进纸感工作室：点一点屋里的东西。')
</script>

<template>
  <div class="room" @click.self="clearSelection">
    <!-- 极简顶栏：不抢房间面积 -->
    <header class="room__bar">
      <div class="room__brand">
        <span class="room__brand-kicker">Studio</span>
        <strong>工作室</strong>
      </div>
      <nav class="room__scenes" aria-label="场景">
        <button
          v-for="(s, i) in scenes"
          :key="s.id"
          type="button"
          class="room__scene"
          :class="{ 'room__scene--on': s.id === activeScene }"
          :title="`快捷键 ${i + 1}`"
          @click="setScene(s.id)"
        >
          {{ s.title }}
        </button>
      </nav>
      <RouterLink class="room__exit" :to="roomConfig?.listFallbackHref || '/projects'">
        列表浏览
      </RouterLink>
    </header>

    <!-- 房间主体：占满剩余视口 -->
    <main
      ref="stageEl"
      class="room__stage"
      :data-scene="activeScene"
      @mousemove="onMove"
      @mouseleave="onLeave"
      @click.self="clearSelection"
    >
      <div
        class="room__parallax"
        :style="{ transform: `translate3d(${parallax.x}px, ${parallax.y}px, 0) scale(1.02)` }"
      >
        <Transition name="room-swap" mode="out-in">
          <img
            v-if="sceneImage"
            :key="activeScene"
            class="room__art"
            :src="sceneImage"
            :alt="`${scene?.title || ''}场景`"
            width="1803"
            height="1037"
            decoding="async"
            draggable="false"
          />
        </Transition>
      </div>

      <!-- 热区层 -->
      <button
        v-for="h in hotspots"
        :key="`${activeScene}-${h.id}`"
        type="button"
        class="hit"
        :class="{
          'hit--hover': hoverId === h.id,
          'hit--on': selectedId === h.id,
          'hit--dim': selectedId && selectedId !== h.id,
          'hit--awake': isOn(h),
        }"
        :style="{
          left: h.x + '%',
          top: h.y + '%',
          width: h.w + '%',
          height: h.h + '%',
        }"
        :aria-label="h.label"
        :aria-pressed="selectedId === h.id"
        @click.stop="activate(h)"
        @mouseenter="hoverId = h.id"
        @mouseleave="hoverId = null"
      >
        <span class="hit__glow" aria-hidden="true" />
        <span class="hit__pin" aria-hidden="true" />
      </button>

      <!-- 选中浮卡：贴在房间上，而不是侧栏 -->
      <Transition name="room-card">
        <div v-if="selected && !easterOpen" :key="selected.id" class="card">
          <div class="card__head">
            <span class="card__kind">{{ selected.kind || 'object' }}</span>
            <button type="button" class="card__x" aria-label="关闭" @click="clearSelection">×</button>
          </div>
          <h2 class="card__title">{{ selected.label }}</h2>
          <p class="card__blurb">{{ selected.blurb }}</p>
          <div v-if="selected.overlay === 'pulse'" class="card__pulse">
            <div v-for="r in pulseRepos" :key="r.name" class="card__pulse-row">
              <RouterLink v-if="r.slug" :to="`/projects/${r.slug}`">{{ r.name }}</RouterLink>
              <a
                v-else
                :href="`https://github.com/${githubData.user || 'anyuer678'}/${r.name}`"
                target="_blank"
                rel="noopener noreferrer"
              >{{ r.name }}</a>
              <span v-if="r.release">{{ r.release }}</span>
            </div>
          </div>
          <div v-if="selected.to" class="card__actions">
            <button type="button" class="card__cta" @click="goSelected">
              {{ selected.cta || '打开' }} →
            </button>
            <span class="card__hint">再点物件也可进入</span>
          </div>
        </div>
      </Transition>

      <Transition name="room-card">
        <div v-if="easterOpen" key="easter" class="card card--easter">
          <div class="card__head">
            <span class="card__kind">easter egg</span>
            <button type="button" class="card__x" aria-label="关闭" @click="clearSelection">×</button>
          </div>
          <h2 class="card__title">咖啡因语录</h2>
          <p class="card__blurb">{{ selected?.blurb || site?.philosophy }}</p>
        </div>
      </Transition>

      <!-- hover 预览（未选中时） -->
      <div v-if="hover && !selected" class="peek" aria-hidden="true">
        <span class="peek__label">{{ hover.label }}</span>
        <span v-if="hover.blurb" class="peek__blurb">{{ hover.blurb }}</span>
      </div>

      <div v-if="onLabels.length" class="room__status" aria-live="polite">
        已唤醒 · {{ onLabels.join(' · ') }}
      </div>
      <p class="room__keys">1 / 2 / 3 切换场景 · Esc 取消选择</p>
    </main>

    <!-- 底部：精选条，不抢主视觉 -->
    <footer v-if="featuredProjects.length" class="room__dock">
      <RouterLink
        v-for="p in featuredProjects"
        :key="p.slug"
        :to="`/projects/${p.slug}`"
        class="room__chip"
      >
        <span class="room__chip-title">{{ p.title }}</span>
        <span class="room__chip-sub">{{ p.subtitle }}</span>
      </RouterLink>
    </footer>
  </div>
</template>

<style scoped>
.room {
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  background: var(--color-surface-muted);
  /* 破掉 container 约束：本页全宽 */
  margin-inline: calc(50% - 50vw);
  width: 100vw;
}

.room__bar {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-3) var(--space-5);
  background: color-mix(in srgb, var(--color-surface) 88%, transparent);
  backdrop-filter: blur(10px);
  border-bottom: var(--border-default);
  z-index: 10;
}
.room__brand {
  display: flex;
  flex-direction: column;
  gap: 0;
  min-width: 88px;
}
.room__brand-kicker {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-accent);
}
.room__brand strong {
  font-family: var(--font-display);
  font-size: var(--text-small);
  font-weight: 600;
}
.room__scenes {
  display: flex;
  gap: 6px;
  flex: 1;
  justify-content: center;
}
.room__scene {
  font-family: var(--font-mono);
  font-size: 12px;
  padding: 8px 16px;
  border-radius: 999px;
  border: var(--border-default);
  background: transparent;
  color: var(--color-text-secondary);
  cursor: pointer;
}
.room__scene--on,
.room__scene:hover {
  color: var(--color-accent);
  border-color: var(--color-accent);
  background: var(--color-accent-soft);
}
.room__exit {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--color-text-secondary);
  text-decoration: none;
}
.room__exit:hover {
  color: var(--color-accent);
}

.room__stage {
  position: relative;
  flex: 1;
  min-height: calc(100dvh - 140px);
  overflow: hidden;
  cursor: default;
  background: #ebe8df;
}
.room__parallax {
  position: absolute;
  inset: -12px;
  transition: transform 0.35s var(--ease-out);
  will-change: transform;
}
.room__art {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  user-select: none;
  -webkit-user-drag: none;
}
.room-swap-enter-active,
.room-swap-leave-active {
  transition: opacity 0.35s var(--ease-standard);
}
.room-swap-enter-from,
.room-swap-leave-to {
  opacity: 0;
}

/* 热区 */
.hit {
  position: absolute;
  z-index: 2;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: 14px;
}
.hit__glow {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  border: 1.5px solid transparent;
  background: transparent;
  transition:
    border-color 0.18s var(--ease-standard),
    background 0.18s var(--ease-standard),
    box-shadow 0.18s var(--ease-standard);
  pointer-events: none;
}
.hit__pin {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 12px;
  height: 12px;
  margin: -6px 0 0 -6px;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 35%, #f0c4b0, var(--color-accent));
  box-shadow:
    0 0 0 3px color-mix(in srgb, var(--color-accent) 22%, transparent),
    0 2px 6px rgba(0, 0, 0, 0.12);
  opacity: 0.5;
  pointer-events: none;
  transition:
    opacity 0.18s,
    transform 0.18s var(--ease-standard);
  animation: pin-breathe 2.8s ease-in-out infinite;
}
@keyframes pin-breathe {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.18);
  }
}
@media (prefers-reduced-motion: reduce) {
  .hit__pin {
    animation: none;
  }
  .room__parallax {
    transition: none;
  }
}
.hit:hover .hit__glow,
.hit--hover .hit__glow {
  border-color: color-mix(in srgb, var(--color-accent) 70%, transparent);
  background: color-mix(in srgb, var(--color-accent-soft) 35%, transparent);
  box-shadow: 0 0 0 1px color-mix(in srgb, var(--color-accent) 25%, transparent);
}
.hit:hover .hit__pin,
.hit--hover .hit__pin {
  opacity: 1;
  transform: scale(1.25);
}
/* 选中：自然描边高亮 + 外发光 */
.hit--on .hit__glow {
  border-color: var(--color-accent);
  border-width: 2px;
  background: color-mix(in srgb, var(--color-accent-soft) 42%, transparent);
  box-shadow:
    0 0 0 3px color-mix(in srgb, var(--color-accent) 18%, transparent),
    0 0 24px color-mix(in srgb, var(--color-accent) 22%, transparent);
}
.hit--on .hit__pin {
  opacity: 1;
  transform: scale(1.35);
  animation: none;
}
.hit--dim {
  opacity: 0.45;
}
.hit--awake .hit__glow {
  border-style: dashed;
  border-color: color-mix(in srgb, var(--color-accent) 45%, transparent);
}
.hit:focus-visible {
  outline: none;
}
.hit:focus-visible .hit__glow {
  outline: 2px solid var(--color-accent);
  outline-offset: 3px;
}

/* 浮卡 */
.card {
  position: absolute;
  z-index: 5;
  right: var(--space-5);
  bottom: var(--space-5);
  width: min(360px, calc(100% - 32px));
  padding: var(--space-5);
  background: color-mix(in srgb, var(--color-surface) 94%, transparent);
  backdrop-filter: blur(12px);
  border: var(--border-default);
  border-radius: var(--radius-lg);
  box-shadow: 0 12px 40px rgba(31, 31, 29, 0.12);
}
.card--easter {
  border-color: color-mix(in srgb, var(--color-accent) 40%, var(--color-border));
}
.card__head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-2);
}
.card__kind {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-accent);
}
.card__x {
  border: none;
  background: transparent;
  font-size: 20px;
  line-height: 1;
  color: var(--color-text-tertiary);
  cursor: pointer;
  padding: 0 4px;
}
.card__x:hover {
  color: var(--color-text);
}
.card__title {
  margin: 0 0 var(--space-2);
  font-family: var(--font-display);
  font-size: var(--text-h3);
}
.card__blurb {
  margin: 0 0 var(--space-4);
  font-size: var(--text-small);
  color: var(--color-text-secondary);
  line-height: var(--lh-small);
}
.card__actions {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  flex-wrap: wrap;
}
.card__cta {
  font-family: var(--font-mono);
  font-size: 13px;
  padding: 10px 16px;
  border: none;
  border-radius: var(--radius-md);
  background: var(--color-accent);
  color: #fff;
  cursor: pointer;
}
.card__cta:hover {
  background: var(--color-accent-hover);
}
.card__hint {
  font-size: 12px;
  color: var(--color-text-tertiary);
}
.card__pulse {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: var(--space-3);
  font-size: var(--text-caption);
}
.card__pulse-row {
  display: flex;
  justify-content: space-between;
  gap: 8px;
}
.card__pulse-row a {
  color: var(--color-text);
  text-decoration: none;
}
.card__pulse-row a:hover {
  color: var(--color-accent);
}
.card__pulse-row span {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--color-text-tertiary);
  flex-shrink: 0;
}
.room-card-enter-active,
.room-card-leave-active {
  transition:
    opacity 0.2s,
    transform 0.2s var(--ease-standard);
}
.room-card-enter-from,
.room-card-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

/* hover 预览条 */
.peek {
  position: absolute;
  z-index: 4;
  left: 50%;
  bottom: 18px;
  transform: translateX(-50%);
  max-width: min(520px, 90%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 10px 18px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--color-surface) 90%, transparent);
  backdrop-filter: blur(8px);
  border: var(--border-default);
  pointer-events: none;
}
.peek__label {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--color-accent);
}
.peek__blurb {
  font-size: 12px;
  color: var(--color-text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.room__status {
  position: absolute;
  z-index: 3;
  left: var(--space-4);
  top: var(--space-4);
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--color-accent);
  background: color-mix(in srgb, var(--color-surface) 88%, transparent);
  border: var(--border-default);
  border-radius: 999px;
  padding: 4px 12px;
  pointer-events: none;
}
.room__keys {
  position: absolute;
  z-index: 3;
  left: var(--space-4);
  bottom: var(--space-4);
  margin: 0;
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--color-text-tertiary);
  pointer-events: none;
}
/* 选中时让开浮卡 */
.room__stage:has(.card) .room__keys,
.room__stage:has(.card) .peek {
  opacity: 0;
}

.room__dock {
  display: flex;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-5);
  overflow-x: auto;
  border-top: var(--border-default);
  background: var(--color-surface);
}
.room__chip {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 160px;
  padding: 10px 14px;
  border: var(--border-default);
  border-radius: var(--radius-md);
  text-decoration: none;
  color: inherit;
  flex-shrink: 0;
  transition: border-color var(--dur-fast);
}
.room__chip:hover {
  border-color: var(--color-accent);
  background: var(--color-accent-soft);
}
.room__chip-title {
  font-family: var(--font-display);
  font-size: var(--text-small);
}
.room__chip-sub {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--color-accent);
}

@media (max-width: 720px) {
  .room__stage {
    min-height: calc(100dvh - 160px);
  }
  .room__parallax {
    transform: none !important;
    inset: 0;
  }
  .card {
    left: var(--space-3);
    right: var(--space-3);
    width: auto;
    bottom: var(--space-3);
  }
  .room__scenes {
    justify-content: flex-end;
  }
  .room__scene {
    padding: 6px 10px;
    font-size: 11px;
  }
}
</style>
