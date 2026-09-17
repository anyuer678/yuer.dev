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
const layers = computed(() => scene.value?.layers ?? [])
const sceneImage = computed(() => (scene.value?.image ? baseUrl + scene.value.image : ''))

const selectedId = ref(null)
const hoverId = ref(null)
const easterOpen = ref(false)
const stageEl = ref(null)
const parallax = ref({ x: 0, y: 0 })

/** 交互项 = 分层物件 + 扁平热区 */
const interactives = computed(() => {
  const fromLayers = layers.value.map((l) => ({
    ...l,
    // 分层物件用中心点近似 veil
    h: l.w * 1.15,
  }))
  return [...fromLayers, ...hotspots.value]
})

const selected = computed(() => interactives.value.find((h) => h.id === selectedId.value) || null)
const hover = computed(() => interactives.value.find((h) => h.id === hoverId.value) || null)

/** 聚焦光斑：跟随 hover/选中物件中心 */
const veilStyle = computed(() => {
  const item = selected.value || hover.value
  if (!item) return {}
  const cx = (item.x ?? 50) + (item.w ?? 10) / 2
  const cy = (item.y ?? 50) + (item.h ?? item.w * 1.15) / 2
  const rx = Math.max(item.w ?? 12, item.h ?? 12) * 0.95 + 8
  return {
    '--vx': `${cx}%`,
    '--vy': `${cy}%`,
    '--vr': `${rx}%`,
  }
})

const states = ref({})
watch(
  scenes,
  (list) => {
    const next = {}
    for (const s of list) {
      const items = [...(s.layers || []), ...(s.hotspots || [])]
      for (const h of items) {
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
  parallax.value = { x: nx * 14, y: ny * 9 }
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

const onLabels = computed(() => interactives.value.filter(isOn).map((h) => h.label))

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
        :style="{ transform: `translate3d(${parallax.x}px, ${parallax.y}px, 0) scale(1.03)` }"
      >
        <Transition name="room-swap" mode="out-in">
          <img
            v-if="sceneImage"
            :key="`${activeScene}-bg`"
            class="room__art"
            :src="sceneImage"
            :alt="`${scene?.title || ''}场景`"
            decoding="async"
            draggable="false"
          />
        </Transition>

        <!-- 分层物件：本体图，hover 浮起发光 -->
        <button
          v-for="l in layers"
          :key="`${activeScene}-layer-${l.id}`"
          type="button"
          class="sprite"
          :class="{
            'sprite--hover': hoverId === l.id,
            'sprite--on': selectedId === l.id,
            'sprite--dim': (hoverId || selectedId) && hoverId !== l.id && selectedId !== l.id,
            'sprite--awake': isOn(l),
          }"
          :style="{
            left: l.x + '%',
            top: l.y + '%',
            width: l.w + '%',
            zIndex: l.z || 4,
          }"
          :aria-label="l.label"
          :aria-pressed="selectedId === l.id"
          @click.stop="activate(l)"
          @mouseenter="hoverId = l.id"
          @mouseleave="hoverId = null"
        >
          <img
            class="sprite__img"
            :src="baseUrl + l.src"
            :alt="l.label"
            decoding="async"
            draggable="false"
          />
        </button>
      </div>

      <!-- 聚焦压暗：无矩形框 -->
      <div
        class="room__veil"
        :class="{ 'room__veil--on': !!(hoverId || selectedId) }"
        aria-hidden="true"
        :style="veilStyle"
      />

      <!-- 扁平热区（书架/窗等背景层）：中心柔光，无矩形 -->
      <button
        v-for="h in hotspots"
        :key="`${activeScene}-hit-${h.id}`"
        type="button"
        class="hit"
        :class="{
          'hit--hover': hoverId === h.id,
          'hit--on': selectedId === h.id,
          'hit--dim': (hoverId || selectedId) && hoverId !== h.id && selectedId !== h.id,
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
        <span class="hit__aura" aria-hidden="true" />
        <span class="hit__core" aria-hidden="true" />
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
  inset: -18px;
  transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
  will-change: transform;
}
.room__art {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center center;
  user-select: none;
  -webkit-user-drag: none;
}
.room-swap-enter-active,
.room-swap-leave-active {
  transition: opacity 0.4s var(--ease-standard);
}
.room-swap-enter-from,
.room-swap-leave-to {
  opacity: 0;
}

/* 分层物件：本体图，hover 浮起 + 柔光（沿轮廓自然） */
.sprite {
  position: absolute;
  transform: translate(-50%, -50%);
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  line-height: 0;
  transition:
    transform 0.35s cubic-bezier(0.22, 1, 0.36, 1),
    filter 0.35s var(--ease-standard),
    opacity 0.3s;
}
.sprite__img {
  width: 100%;
  height: auto;
  display: block;
  pointer-events: none;
  user-select: none;
  -webkit-user-drag: none;
  filter: drop-shadow(0 2px 4px rgba(60, 40, 20, 0.12));
  transition:
    filter 0.35s var(--ease-standard),
    transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
}
.sprite:hover,
.sprite--hover {
  transform: translate(-50%, calc(-50% - 8px)) scale(1.04);
  z-index: 20 !important;
}
.sprite:hover .sprite__img,
.sprite--hover .sprite__img {
  filter:
    drop-shadow(0 14px 22px rgba(60, 40, 20, 0.28))
    drop-shadow(0 0 18px rgba(176, 92, 58, 0.35));
}
.sprite--on {
  transform: translate(-50%, calc(-50% - 12px)) scale(1.06);
  z-index: 22 !important;
}
.sprite--on .sprite__img {
  filter:
    drop-shadow(0 18px 28px rgba(60, 40, 20, 0.32))
    drop-shadow(0 0 28px rgba(176, 92, 58, 0.5));
}
.sprite--dim {
  opacity: 0.35;
  filter: grayscale(0.15);
}
.sprite--awake .sprite__img {
  filter:
    drop-shadow(0 4px 10px rgba(60, 40, 20, 0.18))
    drop-shadow(0 0 12px rgba(176, 92, 58, 0.25));
}
.sprite:focus-visible {
  outline: none;
}
.sprite:focus-visible .sprite__img {
  outline: 2px solid var(--color-accent);
  outline-offset: 6px;
  border-radius: 4px;
}

/* 聚焦压暗层：径向镂空，让物件像被灯打亮，而不是画方框 */
.room__veil {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.35s var(--ease-standard);
  background: radial-gradient(
    ellipse var(--vr, 28%) var(--vr, 28%) at var(--vx, 50%) var(--vy, 50%),
    transparent 0%,
    transparent 42%,
    rgba(43, 32, 22, 0.18) 68%,
    rgba(43, 32, 22, 0.38) 100%
  );
}
.room__veil--on {
  opacity: 1;
}

/* 热区：透明命中区 + 中心柔光，无矩形描边 */
.hit {
  position: absolute;
  z-index: 2;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: 40%;
}
.hit__aura {
  position: absolute;
  left: 50%;
  top: 50%;
  width: min(72%, 120px);
  aspect-ratio: 1;
  transform: translate(-50%, -50%) scale(0.55);
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(176, 92, 58, 0.38) 0%,
    rgba(176, 92, 58, 0.14) 42%,
    transparent 72%
  );
  opacity: 0;
  pointer-events: none;
  transition:
    opacity 0.28s var(--ease-standard),
    transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
  filter: blur(2px);
}
.hit__core {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 8px;
  height: 8px;
  margin: -4px 0 0 -4px;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 35%, #f3d2c0, var(--color-accent));
  box-shadow:
    0 0 0 2px rgba(255, 250, 245, 0.55),
    0 0 12px rgba(176, 92, 58, 0.55);
  opacity: 0.42;
  pointer-events: none;
  transition:
    opacity 0.25s,
    transform 0.3s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.3s;
  animation: core-breathe 3s ease-in-out infinite;
}
@keyframes core-breathe {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
}
@media (prefers-reduced-motion: reduce) {
  .hit__core {
    animation: none;
  }
  .room__parallax {
    transition: none;
  }
  .room__veil {
    transition: none;
  }
}

.hit:hover .hit__aura,
.hit--hover .hit__aura,
.hit--on .hit__aura {
  opacity: 1;
  transform: translate(-50%, -50%) scale(1);
}
.hit--on .hit__aura {
  transform: translate(-50%, -50%) scale(1.15);
  background: radial-gradient(
    circle,
    rgba(176, 92, 58, 0.48) 0%,
    rgba(176, 92, 58, 0.18) 48%,
    transparent 74%
  );
}
.hit:hover .hit__core,
.hit--hover .hit__core {
  opacity: 1;
  transform: scale(1.35);
  box-shadow:
    0 0 0 2px rgba(255, 250, 245, 0.7),
    0 0 18px rgba(176, 92, 58, 0.75);
  animation: none;
}
.hit--on .hit__core {
  opacity: 1;
  transform: scale(1.55);
  animation: none;
  box-shadow:
    0 0 0 2px rgba(255, 250, 245, 0.85),
    0 0 28px rgba(176, 92, 58, 0.95),
    0 0 48px rgba(176, 92, 58, 0.35);
}
/* 被聚焦时，其余热区退后 */
.hit--dim .hit__core {
  opacity: 0.18;
  transform: scale(0.85);
}
.hit--dim .hit__aura {
  opacity: 0;
}
.hit--awake .hit__core {
  box-shadow:
    0 0 0 2px rgba(255, 250, 245, 0.5),
    0 0 14px rgba(176, 92, 58, 0.45);
}
.hit:focus-visible {
  outline: none;
}
.hit:focus-visible .hit__core {
  outline: 2px solid var(--color-accent);
  outline-offset: 4px;
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
