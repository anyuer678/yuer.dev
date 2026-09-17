<script setup>
// /room —— 纸感工作室：电影感场景 + 光标追光 + 编排动效（expressive）
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
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

const ready = ref(false)
const selectedId = ref(null)
const hoverId = ref(null)
const easterOpen = ref(false)
const stageEl = ref(null)
const parallax = ref({ x: 0, y: 0 })
const cursor = ref({ x: -999, y: -999, on: false })
const sceneKey = ref(0)
const bloomId = ref(null)
const hintDone = ref(sessionStorage.getItem('room:hint') === '1')
const discovered = ref(new Set(JSON.parse(sessionStorage.getItem('room:seen') || '[]')))

const selected = computed(() => hotspots.value.find((h) => h.id === selectedId.value) || null)
const hover = computed(() => hotspots.value.find((h) => h.id === hoverId.value) || null)

const veilStyle = computed(() => {
  const item = selected.value || hover.value
  if (!item) return {}
  return {
    '--vx': `${item.x + item.w / 2}%`,
    '--vy': `${item.y + item.h / 2}%`,
    '--vr': `${Math.max(item.w, item.h) * 0.9 + 6}%`,
  }
})

const progress = computed(() => {
  const total = hotspots.value.length || 1
  return `${discovered.value.size}/${total}`
})

const states = ref({})
watch(
  scenes,
  (list) => {
    const next = {}
    for (const s of list) {
      for (const h of s.hotspots || []) {
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

function markSeen(id) {
  discovered.value = new Set([...discovered.value, id])
  sessionStorage.setItem('room:seen', JSON.stringify([...discovered.value]))
}

function onHoverIn(h) {
  hoverId.value = h.id
  markSeen(h.id)
}

function setScene(id) {
  if (id === activeScene.value) return
  selectedId.value = null
  hoverId.value = null
  easterOpen.value = false
  sceneKey.value++
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

function flashBloom(id) {
  bloomId.value = id
  setTimeout(() => {
    if (bloomId.value === id) bloomId.value = null
  }, 520)
}

function activate(h) {
  markSeen(h.id)
  flashBloom(h.id)

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
  if (h.sceneJump && sceneIds.value.includes(h.sceneJump)) {
    setTimeout(() => setScene(h.sceneJump), 320)
  }
}

function clearSelection() {
  selectedId.value = null
  easterOpen.value = false
}

function goSelected() {
  if (selected.value?.to) router.push(selected.value.to)
}

function dismissHint() {
  hintDone.value = true
  sessionStorage.setItem('room:hint', '1')
}

function onKey(e) {
  if (e.key === 'Escape') clearSelection()
  if (e.key >= '1' && e.key <= String(scenes.value.length)) {
    setScene(sceneIds.value[Number(e.key) - 1])
  }
}

function onMove(e) {
  const el = stageEl.value
  if (!el) return
  const r = el.getBoundingClientRect()
  const px = e.clientX - r.left
  const py = e.clientY - r.top
  cursor.value = { x: px, y: py, on: true }
  const nx = (px / r.width - 0.5) * 2
  const ny = (py / r.height - 0.5) * 2
  parallax.value = { x: nx * 7, y: ny * 4.5 }
}

function onLeave() {
  parallax.value = { x: 0, y: 0 }
  cursor.value = { ...cursor.value, on: false }
}

const pulseRepos = computed(() =>
  Object.values(githubData.repos || {})
    .filter((r) => r.pushed_at)
    .sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at))
    .slice(0, 6)
)

const onLabels = computed(() => hotspots.value.filter(isOn).map((h) => h.label))

onMounted(() => {
  window.addEventListener('keydown', onKey)
  requestAnimationFrame(() => {
    ready.value = true
  })
})
onUnmounted(() => {
  window.removeEventListener('keydown', onKey)
})

watch(activeScene, async () => {
  await nextTick()
})

setTitle(`工作室 · ${site?.name || 'Yuer'}`)
setDescription('走进纸感工作室：点一点屋里的东西。')
</script>

<template>
  <div class="room" :class="{ 'room--ready': ready }" @click.self="clearSelection">
    <!-- 顶栏：细仪表条 -->
    <header class="bar">
      <div class="bar__brand">
        <span class="bar__mark" aria-hidden="true" />
        <div>
          <p class="bar__kicker">Studio</p>
          <h1 class="bar__title">工作室</h1>
        </div>
      </div>

      <nav class="bar__scenes" aria-label="场景">
        <button
          v-for="(s, i) in scenes"
          :key="s.id"
          type="button"
          class="scene"
          :class="{ 'scene--on': s.id === activeScene }"
          :aria-current="s.id === activeScene ? 'page' : undefined"
          @click="setScene(s.id)"
        >
          <span class="scene__num">{{ String(i + 1).padStart(2, '0') }}</span>
          <span class="scene__name">{{ s.title }}</span>
          <span v-if="s.subtitle" class="scene__sub">{{ s.subtitle }}</span>
        </button>
      </nav>

      <div class="bar__meta">
        <span class="bar__progress" title="本场景已探索物件">{{ progress }}</span>
        <RouterLink class="bar__exit" :to="roomConfig?.listFallbackHref || '/projects'">
          列表浏览
        </RouterLink>
      </div>
    </header>

    <!-- 舞台 -->
    <main
      ref="stageEl"
      class="stage"
      :data-scene="activeScene"
      @mousemove="onMove"
      @mouseleave="onLeave"
      @click.self="clearSelection"
    >
      <!-- 纸纹 + 环境光 -->
      <div class="stage__grain" aria-hidden="true" />
      <div
        class="stage__glow"
        aria-hidden="true"
        :style="{
          '--cx': cursor.on ? `${cursor.x}px` : '50%',
          '--cy': cursor.on ? `${cursor.y}px` : '40%',
          opacity: cursor.on ? 1 : 0.35,
        }"
      />

      <div
        :key="sceneKey"
        class="frame"
        :style="{ transform: `translate3d(${parallax.x}px, ${parallax.y}px, 0)` }"
      >
        <Transition name="room-swap" mode="out-in">
          <img
            v-if="sceneImage"
            :key="activeScene"
            class="frame__img"
            :src="sceneImage"
            :alt="`${scene?.title || ''}场景`"
            decoding="async"
            draggable="false"
          />
        </Transition>

        <div class="frame__veil" :class="{ 'frame__veil--on': !!(hoverId || selectedId) }" aria-hidden="true" :style="veilStyle" />

        <button
          v-for="(h, idx) in hotspots"
          :key="`${activeScene}-${h.id}`"
          type="button"
          class="hit"
          :class="{
            'hit--hover': hoverId === h.id,
            'hit--on': selectedId === h.id,
            'hit--dim': (hoverId || selectedId) && hoverId !== h.id && selectedId !== h.id,
            'hit--awake': isOn(h),
            'hit--bloom': bloomId === h.id,
          }"
          :style="{
            left: h.x + '%',
            top: h.y + '%',
            width: h.w + '%',
            height: h.h + '%',
            '--d': `${180 + idx * 55}ms`,
          }"
          :aria-label="h.label"
          :aria-pressed="selectedId === h.id"
          @click.stop="activate(h)"
          @mouseenter="onHoverIn(h)"
          @mouseleave="hoverId = null"
        >
          <span class="hit__aura" aria-hidden="true" />
          <span class="hit__core" aria-hidden="true" />
          <span v-if="bloomId === h.id" class="hit__bloom" aria-hidden="true" />
        </button>
      </div>

      <!-- 检视浮卡 -->
      <Transition name="card">
        <article v-if="selected && !easterOpen" :key="selected.id" class="card">
          <header class="card__head">
            <span class="card__kind">{{ selected.kind || 'object' }}</span>
            <button type="button" class="card__close" aria-label="关闭" @click="clearSelection">×</button>
          </header>
          <h2 class="card__title">{{ selected.label }}</h2>
          <p class="card__blurb">{{ selected.blurb }}</p>

          <div v-if="selected.overlay === 'pulse'" class="card__list">
            <div v-for="r in pulseRepos" :key="r.name" class="card__row">
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

          <footer v-if="selected.to" class="card__foot">
            <button type="button" class="card__cta" @click="goSelected">
              <span>{{ selected.cta || '打开' }}</span>
              <span class="card__cta-arrow" aria-hidden="true">→</span>
            </button>
            <span class="card__tip">再点物件也可进入</span>
          </footer>
        </article>
      </Transition>

      <Transition name="card">
        <article v-if="easterOpen" key="easter" class="card card--quote">
          <header class="card__head">
            <span class="card__kind">easter egg</span>
            <button type="button" class="card__close" aria-label="关闭" @click="clearSelection">×</button>
          </header>
          <h2 class="card__title">咖啡因语录</h2>
          <p class="card__quote">{{ selected?.blurb || site?.philosophy }}</p>
        </article>
      </Transition>

      <!-- hover 提示 -->
      <Transition name="peek">
        <div v-if="hover && !selected" :key="hover.id" class="peek">
          <span class="peek__label">{{ hover.label }}</span>
          <span v-if="hover.blurb" class="peek__blurb">{{ hover.blurb }}</span>
        </div>
      </Transition>

      <!-- 状态 / 快捷键 -->
      <div v-if="onLabels.length" class="status" aria-live="polite">
        <span class="status__dot" aria-hidden="true" />
        已唤醒 · {{ onLabels.join(' · ') }}
      </div>
      <p class="keys">1 / 2 / 3 切换 · Esc 关闭 · 进度 {{ progress }}</p>

      <!-- 首次引导 -->
      <Transition name="hint">
        <button v-if="!hintDone" type="button" class="hint" @click="dismissHint">
          <span class="hint__ring" aria-hidden="true" />
          <span class="hint__text">
            移动鼠标「照亮」房间，点发光的物件探索
            <em>知道了</em>
          </span>
        </button>
      </Transition>
    </main>

    <!-- 底栏精选 -->
    <footer v-if="featuredProjects.length" class="dock">
      <p class="dock__label">桌上没写完的事</p>
      <div class="dock__row">
        <RouterLink
          v-for="(p, i) in featuredProjects"
          :key="p.slug"
          :to="`/projects/${p.slug}`"
          class="chip"
          :style="{ '--d': `${i * 80}ms` }"
        >
          <span class="chip__idx">{{ String(i + 1).padStart(2, '0') }}</span>
          <span class="chip__body">
            <span class="chip__title">{{ p.title }}</span>
            <span class="chip__sub">{{ p.subtitle }}</span>
          </span>
        </RouterLink>
      </div>
    </footer>
  </div>
</template>

<style scoped>
/* —— tokens 延续站点纸感 + 陶土 —— */
.room {
  --room-ink: #3a2e24;
  --room-paper: #f3eee4;
  --room-deep: #2a2118;
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  margin-inline: calc(50% - 50vw);
  width: 100vw;
  background: var(--room-paper);
  color: var(--room-ink);
  opacity: 0;
  transition: opacity 0.6s var(--ease-standard);
}
.room--ready {
  opacity: 1;
}

/* —— 顶栏 —— */
.bar {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: var(--space-4);
  padding: 10px var(--space-5);
  background: color-mix(in srgb, var(--color-surface) 82%, transparent);
  backdrop-filter: blur(14px) saturate(1.1);
  border-bottom: 1px solid color-mix(in srgb, var(--room-ink) 8%, transparent);
  z-index: 20;
}
.bar__brand {
  display: flex;
  align-items: center;
  gap: 12px;
}
.bar__mark {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 35%, #f0c4b0, var(--color-accent));
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-accent) 18%, transparent);
  animation: mark-pulse 3.2s ease-in-out infinite;
}
@keyframes mark-pulse {
  0%,
  100% {
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-accent) 16%, transparent);
  }
  50% {
    box-shadow: 0 0 0 6px color-mix(in srgb, var(--color-accent) 8%, transparent);
  }
}
.bar__kicker {
  margin: 0;
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--color-accent);
}
.bar__title {
  margin: 0;
  font-family: var(--font-display);
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 0.02em;
}
.bar__scenes {
  display: flex;
  gap: 4px;
}
.scene {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1px;
  min-width: 88px;
  padding: 8px 14px 10px;
  border: 1px solid transparent;
  border-radius: 10px;
  background: transparent;
  cursor: pointer;
  text-align: left;
  transition:
    background 0.25s,
    border-color 0.25s,
    transform 0.25s var(--ease-standard);
}
.scene:hover {
  background: color-mix(in srgb, var(--color-accent) 6%, transparent);
}
.scene--on {
  background: var(--color-accent-soft);
  border-color: color-mix(in srgb, var(--color-accent) 35%, transparent);
  transform: translateY(-1px);
}
.scene__num {
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--color-text-tertiary);
  letter-spacing: 0.08em;
}
.scene--on .scene__num {
  color: var(--color-accent);
}
.scene__name {
  font-family: var(--font-display);
  font-size: 14px;
  color: var(--color-text);
}
.scene__sub {
  font-size: 11px;
  color: var(--color-text-tertiary);
}
.bar__meta {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 14px;
}
.bar__progress {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--color-text-tertiary);
  letter-spacing: 0.06em;
}
.bar__exit {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--color-text-secondary);
  text-decoration: none;
  padding: 6px 10px;
  border-radius: 999px;
  border: 1px solid color-mix(in srgb, var(--room-ink) 12%, transparent);
  transition:
    color 0.2s,
    border-color 0.2s,
    background 0.2s;
}
.bar__exit:hover {
  color: var(--color-accent);
  border-color: var(--color-accent);
  background: var(--color-accent-soft);
}

/* —— 舞台 —— */
.stage {
  position: relative;
  flex: 1;
  min-height: calc(100dvh - 168px);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  cursor: default;
  background:
    radial-gradient(ellipse 80% 70% at 50% 35%, #faf6ef 0%, #ebe4d6 55%, #ddd4c4 100%);
}
.stage__grain {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.35;
  mix-blend-mode: multiply;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E");
  background-size: 180px 180px;
  z-index: 1;
}
/* 光标追光 */
.stage__glow {
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  transition: opacity 0.4s;
  background: radial-gradient(
    circle 220px at var(--cx, 50%) var(--cy, 40%),
    rgba(255, 236, 210, 0.22) 0%,
    transparent 70%
  );
  mix-blend-mode: soft-light;
}

.frame {
  position: relative;
  z-index: 3;
  width: min(100% - 32px, calc((100dvh - 168px) * 1.74));
  aspect-ratio: 1844 / 1060;
  border-radius: 6px;
  overflow: hidden;
  box-shadow:
    0 0 0 1px color-mix(in srgb, var(--room-ink) 10%, transparent),
    0 30px 80px rgba(70, 48, 28, 0.18),
    0 2px 0 rgba(255, 255, 255, 0.45) inset;
  transition: transform 0.55s cubic-bezier(0.22, 1, 0.36, 1);
  animation: frame-in 0.9s cubic-bezier(0.22, 1, 0.36, 1) both;
}
@keyframes frame-in {
  from {
    opacity: 0;
    transform: translateY(18px) scale(0.985);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
.frame__img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center;
  background: #f0ebe1;
  user-select: none;
  -webkit-user-drag: none;
}
.room-swap-enter-active,
.room-swap-leave-active {
  transition:
    opacity 0.45s var(--ease-standard),
    transform 0.45s var(--ease-standard);
}
.room-swap-enter-from {
  opacity: 0;
  transform: scale(1.02);
}
.room-swap-leave-to {
  opacity: 0;
  transform: scale(0.99);
}

.frame__veil {
  position: absolute;
  inset: 0;
  z-index: 4;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.45s var(--ease-standard);
  background: radial-gradient(
    ellipse var(--vr, 26%) var(--vr, 26%) at var(--vx, 50%) var(--vy, 50%),
    transparent 0%,
    transparent 38%,
    rgba(42, 30, 18, 0.16) 62%,
    rgba(42, 30, 18, 0.42) 100%
  );
}
.frame__veil--on {
  opacity: 1;
}

/* 热区 */
.hit {
  position: absolute;
  z-index: 5;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: 42%;
  opacity: 0;
  animation: hit-in 0.55s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  animation-delay: var(--d, 0ms);
}
@keyframes hit-in {
  from {
    opacity: 0;
    transform: scale(0.7);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
.hit__aura {
  position: absolute;
  left: 50%;
  top: 50%;
  width: min(78%, 140px);
  aspect-ratio: 1;
  transform: translate(-50%, -50%) scale(0.5);
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(176, 92, 58, 0.42) 0%,
    rgba(176, 92, 58, 0.16) 45%,
    transparent 72%
  );
  opacity: 0;
  pointer-events: none;
  filter: blur(3px);
  transition:
    opacity 0.3s var(--ease-standard),
    transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
}
.hit__core {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 9px;
  height: 9px;
  margin: -4.5px 0 0 -4.5px;
  border-radius: 50%;
  background: radial-gradient(circle at 32% 32%, #ffe8d8, var(--color-accent));
  box-shadow:
    0 0 0 2px rgba(255, 250, 244, 0.65),
    0 0 14px rgba(176, 92, 58, 0.5);
  opacity: 0.4;
  pointer-events: none;
  transition:
    opacity 0.28s,
    transform 0.32s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.32s;
  animation: core-breathe 2.8s ease-in-out infinite;
  animation-delay: var(--d, 0ms);
}
@keyframes core-breathe {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.22);
  }
}
.hit:hover .hit__aura,
.hit--hover .hit__aura,
.hit--on .hit__aura {
  opacity: 1;
  transform: translate(-50%, -50%) scale(1);
}
.hit--on .hit__aura {
  transform: translate(-50%, -50%) scale(1.2);
}
.hit:hover .hit__core,
.hit--hover .hit__core {
  opacity: 1;
  transform: scale(1.4);
  animation: none;
  box-shadow:
    0 0 0 2px rgba(255, 250, 244, 0.75),
    0 0 20px rgba(176, 92, 58, 0.8);
}
.hit--on .hit__core {
  opacity: 1;
  transform: scale(1.6);
  animation: none;
  box-shadow:
    0 0 0 2px rgba(255, 250, 244, 0.9),
    0 0 28px rgba(176, 92, 58, 0.95),
    0 0 52px rgba(176, 92, 58, 0.4);
}
.hit--dim .hit__core {
  opacity: 0.16;
  transform: scale(0.8);
}
.hit--dim .hit__aura {
  opacity: 0;
}
.hit--bloom .hit__bloom {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 24px;
  height: 24px;
  margin: -12px 0 0 -12px;
  border-radius: 50%;
  border: 2px solid rgba(176, 92, 58, 0.55);
  animation: bloom 0.55s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  pointer-events: none;
}
@keyframes bloom {
  from {
    transform: scale(0.4);
    opacity: 0.9;
  }
  to {
    transform: scale(4.5);
    opacity: 0;
  }
}
.hit:focus-visible {
  outline: none;
}
.hit:focus-visible .hit__core {
  outline: 2px solid var(--color-accent);
  outline-offset: 5px;
}

/* 浮卡 */
.card {
  position: absolute;
  z-index: 10;
  right: max(20px, 4vw);
  bottom: max(20px, 4vh);
  width: min(360px, calc(100% - 40px));
  padding: 22px 22px 18px;
  background: color-mix(in srgb, #fffcf7 92%, transparent);
  backdrop-filter: blur(16px) saturate(1.05);
  border: 1px solid color-mix(in srgb, var(--room-ink) 10%, transparent);
  border-radius: 14px;
  box-shadow:
    0 24px 48px rgba(50, 32, 16, 0.16),
    0 1px 0 rgba(255, 255, 255, 0.7) inset;
}
.card--quote {
  border-color: color-mix(in srgb, var(--color-accent) 40%, transparent);
}
.card__head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}
.card__kind {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-accent);
}
.card__close {
  border: none;
  background: transparent;
  font-size: 22px;
  line-height: 1;
  color: var(--color-text-tertiary);
  cursor: pointer;
  padding: 0 4px;
  transition: color 0.2s, transform 0.2s;
}
.card__close:hover {
  color: var(--room-ink);
  transform: scale(1.1);
}
.card__title {
  margin: 0 0 8px;
  font-family: var(--font-display);
  font-size: 22px;
  font-weight: 600;
  letter-spacing: 0.01em;
}
.card__blurb,
.card__quote {
  margin: 0 0 16px;
  font-size: 14px;
  line-height: 1.65;
  color: var(--color-text-secondary);
}
.card__quote {
  font-family: var(--font-display);
  font-size: 16px;
  color: var(--color-text);
  font-style: italic;
}
.card__list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
  font-size: 13px;
}
.card__row {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  padding-bottom: 8px;
  border-bottom: 1px dashed color-mix(in srgb, var(--room-ink) 10%, transparent);
}
.card__row:last-child {
  border-bottom: none;
}
.card__row a {
  color: var(--color-text);
  text-decoration: none;
}
.card__row a:hover {
  color: var(--color-accent);
}
.card__row span {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--color-text-tertiary);
  flex-shrink: 0;
}
.card__foot {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}
.card__cta {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-mono);
  font-size: 13px;
  padding: 11px 16px;
  border: none;
  border-radius: 999px;
  background: var(--color-accent);
  color: #fff;
  cursor: pointer;
  transition:
    background 0.2s,
    transform 0.2s var(--ease-standard),
    box-shadow 0.2s;
  box-shadow: 0 6px 16px rgba(176, 92, 58, 0.28);
}
.card__cta:hover {
  background: var(--color-accent-hover);
  transform: translateY(-1px);
  box-shadow: 0 10px 22px rgba(176, 92, 58, 0.35);
}
.card__cta-arrow {
  transition: transform 0.2s;
}
.card__cta:hover .card__cta-arrow {
  transform: translateX(3px);
}
.card__tip {
  font-size: 12px;
  color: var(--color-text-tertiary);
}
.card-enter-active {
  transition:
    opacity 0.32s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.32s cubic-bezier(0.22, 1, 0.36, 1);
}
.card-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}
.card-enter-from {
  opacity: 0;
  transform: translateY(14px) scale(0.98);
}
.card-leave-to {
  opacity: 0;
  transform: translateY(6px);
}

.peek {
  position: absolute;
  z-index: 8;
  left: 50%;
  bottom: 18px;
  transform: translateX(-50%);
  max-width: min(560px, 88%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 10px 20px;
  border-radius: 999px;
  background: color-mix(in srgb, #fffcf7 88%, transparent);
  backdrop-filter: blur(10px);
  border: 1px solid color-mix(in srgb, var(--room-ink) 8%, transparent);
  pointer-events: none;
  box-shadow: 0 10px 28px rgba(50, 32, 16, 0.1);
}
.peek__label {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--color-accent);
  letter-spacing: 0.04em;
}
.peek__blurb {
  font-size: 12px;
  color: var(--color-text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}
.peek-enter-active,
.peek-leave-active {
  transition:
    opacity 0.22s,
    transform 0.22s var(--ease-standard);
}
.peek-enter-from,
.peek-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(6px);
}

.status {
  position: absolute;
  z-index: 8;
  left: 18px;
  top: 16px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--color-accent);
  background: color-mix(in srgb, #fffcf7 90%, transparent);
  border: 1px solid color-mix(in srgb, var(--color-accent) 25%, transparent);
  border-radius: 999px;
  padding: 5px 12px;
  pointer-events: none;
}
.status__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-accent);
  animation: core-breathe 1.6s ease-in-out infinite;
}
.keys {
  position: absolute;
  z-index: 8;
  left: 18px;
  bottom: 14px;
  margin: 0;
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--color-text-tertiary);
  pointer-events: none;
}
.stage:has(.card) .keys,
.stage:has(.card) .peek {
  opacity: 0;
  transition: opacity 0.2s;
}

.hint {
  position: absolute;
  z-index: 12;
  left: 50%;
  top: 18%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 12px;
  max-width: min(420px, 90%);
  padding: 14px 18px;
  border: 1px solid color-mix(in srgb, var(--color-accent) 30%, transparent);
  border-radius: 14px;
  background: color-mix(in srgb, #fffcf7 94%, transparent);
  backdrop-filter: blur(12px);
  cursor: pointer;
  box-shadow: 0 16px 40px rgba(50, 32, 16, 0.14);
  animation: hint-in 0.7s 1.2s cubic-bezier(0.22, 1, 0.36, 1) both;
}
@keyframes hint-in {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%);
  }
}
.hint__ring {
  flex-shrink: 0;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 2px solid var(--color-accent);
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--color-accent) 15%, transparent);
  animation: mark-pulse 1.8s ease-in-out infinite;
}
.hint__text {
  font-size: 13px;
  line-height: 1.5;
  color: var(--color-text-secondary);
  text-align: left;
}
.hint__text em {
  display: block;
  margin-top: 4px;
  font-style: normal;
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--color-accent);
}
.hint-enter-active,
.hint-leave-active {
  transition:
    opacity 0.3s,
    transform 0.3s;
}
.hint-leave-to {
  opacity: 0;
  transform: translateX(-50%) scale(0.96);
}

/* 底栏 */
.dock {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 10px var(--space-5) 12px;
  border-top: 1px solid color-mix(in srgb, var(--room-ink) 8%, transparent);
  background: var(--color-surface);
  overflow: hidden;
}
.dock__label {
  margin: 0;
  flex-shrink: 0;
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-text-tertiary);
}
.dock__row {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 2px;
}
.chip {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 200px;
  padding: 10px 14px;
  border: 1px solid color-mix(in srgb, var(--room-ink) 10%, transparent);
  border-radius: 12px;
  text-decoration: none;
  color: inherit;
  background: color-mix(in srgb, var(--color-paper, #fafaf8) 100%, transparent);
  transition:
    border-color 0.22s,
    box-shadow 0.22s,
    transform 0.22s var(--ease-standard);
  animation: chip-in 0.5s var(--d, 0ms) cubic-bezier(0.22, 1, 0.36, 1) both;
}
@keyframes chip-in {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
.chip:hover {
  border-color: var(--color-accent);
  box-shadow: 0 8px 20px rgba(176, 92, 58, 0.12);
  transform: translateY(-2px);
}
.chip__idx {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--color-accent);
}
.chip__body {
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
}
.chip__title {
  font-family: var(--font-display);
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.chip__sub {
  font-size: 11px;
  color: var(--color-text-tertiary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

@media (prefers-reduced-motion: reduce) {
  .room,
  .frame,
  .hit,
  .chip,
  .hint,
  .bar__mark,
  .status__dot,
  .hit__core {
    animation: none !important;
  }
  .frame,
  .card,
  .peek,
  .room-swap-enter-active,
  .room-swap-leave-active {
    transition: none !important;
  }
  .stage__glow {
    display: none;
  }
}

@media (max-width: 860px) {
  .bar {
    grid-template-columns: 1fr auto;
    grid-template-rows: auto auto;
  }
  .bar__scenes {
    grid-column: 1 / -1;
    justify-content: stretch;
  }
  .scene {
    flex: 1;
    min-width: 0;
  }
  .frame {
    width: min(100% - 16px, calc((100dvh - 220px) * 1.74));
  }
  .card {
    left: 12px;
    right: 12px;
    width: auto;
    bottom: 12px;
  }
  .dock__label {
    display: none;
  }
}
</style>
