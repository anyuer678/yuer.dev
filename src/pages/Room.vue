<script setup>
// /room —— Three.js 沉浸式书房 + 检视浮卡
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import RoomStage3D from '@/components/features/room/RoomStage3D.vue'
import { room as roomConfig, githubData, site, featuredProjects } from '@/utils/content.js'
import { setTitle, setDescription } from '@/utils/seo.js'

const router = useRouter()

const ready = ref(false)
const selected = ref(null)
const hoverItem = ref(null)
const easterOpen = ref(false)
const lampOn = ref(true)
const laptopOn = ref(false)
const drawerOpen = ref(false)
const hintDone = ref(sessionStorage.getItem('room:hint') === '1')
const seen = ref(new Set(JSON.parse(sessionStorage.getItem('room:seen') || '[]')))

const pulseRepos = computed(() =>
  Object.values(githubData.repos || {})
    .filter((r) => r.pushed_at)
    .sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at))
    .slice(0, 6)
)

const progress = computed(() => `${seen.value.size}/10`)

function markSeen(id) {
  if (!id) return
  seen.value = new Set([...seen.value, id])
  sessionStorage.setItem('room:seen', JSON.stringify([...seen.value]))
}

function onHover(data) {
  hoverItem.value = data
  if (data?.id) markSeen(data.id)
}

function onSelect(data) {
  if (!data?.id) return
  markSeen(data.id)

  // 物件物理状态
  if (data.id === 'lamp') lampOn.value = !lampOn.value
  if (data.id === 'laptop') laptopOn.value = !laptopOn.value
  if (data.id === 'drawer') drawerOpen.value = !drawerOpen.value

  if (data.kind === 'easter') {
    selected.value = data
    easterOpen.value = true
    return
  }

  easterOpen.value = false
  // 再点同一物件且有链接 → 进入
  if (selected.value?.id === data.id && data.to) {
    router.push(data.to)
    return
  }
  selected.value = data
}

function clearSelection() {
  selected.value = null
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
}

onMounted(() => {
  window.addEventListener('keydown', onKey)
  requestAnimationFrame(() => {
    ready.value = true
  })
})
onUnmounted(() => window.removeEventListener('keydown', onKey))

setTitle(`工作室 · ${site?.name || 'Yuer'}`)
setDescription('走进 3D 书房：拖动视角，点选屋里的物件。')
</script>

<template>
  <div class="room" :class="{ 'room--ready': ready }" @click.self="clearSelection">
    <header class="bar">
      <div class="bar__brand">
        <span class="bar__mark" aria-hidden="true" />
        <div>
          <p class="bar__kicker">Studio · 3D</p>
          <h1 class="bar__title">工作室</h1>
        </div>
      </div>

      <p class="bar__tip">拖动旋转视角 · 滚轮缩放 · 点击物件</p>

      <div class="bar__meta">
        <span class="bar__progress">{{ progress }}</span>
        <button
          type="button"
          class="bar__toggle"
          :class="{ 'bar__toggle--on': lampOn }"
          @click="lampOn = !lampOn"
        >
          {{ lampOn ? '灯亮' : '灯灭' }}
        </button>
        <RouterLink class="bar__exit" :to="roomConfig?.listFallbackHref || '/projects'">
          列表浏览
        </RouterLink>
      </div>
    </header>

    <main class="stage" @click.self="clearSelection">
      <RoomStage3D
        :lamp-on="lampOn"
        :laptop-on="laptopOn"
        :drawer-open="drawerOpen"
        @select="onSelect"
        @hover="onHover"
      />

      <Transition name="card">
        <article v-if="selected && !easterOpen" :key="selected.id" class="card">
          <header class="card__head">
            <span class="card__kind">{{ selected.kind || 'object' }}</span>
            <button type="button" class="card__close" aria-label="关闭" @click="clearSelection">×</button>
          </header>
          <h2 class="card__title">{{ selected.label }}</h2>
          <p class="card__blurb">{{ selected.blurb }}</p>
          <div v-if="selected.id === 'laptop' && laptopOn" class="card__screen">
            <p class="card__screen-label">屏幕上</p>
            <RouterLink v-for="p in featuredProjects" :key="p.slug" :to="`/projects/${p.slug}`" class="card__screen-row">
              <span>{{ p.title }}</span>
              <span>{{ p.subtitle }}</span>
            </RouterLink>
          </div>
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
              <span aria-hidden="true">→</span>
            </button>
            <span class="card__tip">再点一次也可进入</span>
          </footer>
        </article>
      </Transition>

      <Transition name="card">
        <article v-if="easterOpen" key="easter" class="card card--quote">
          <header class="card__head">
            <span class="card__kind">easter egg</span>
            <button type="button" class="card__close" aria-label="关闭" @click="clearSelection">×</button>
          </header>
          <h2 class="card__title">{{ selected?.label }}</h2>
          <p class="card__quote">{{ selected?.blurb }}</p>
        </article>
      </Transition>

      <Transition name="peek">
        <div v-if="hoverItem && !selected" :key="hoverItem.id" class="peek">
          <span class="peek__label">{{ hoverItem.label }}</span>
        </div>
      </Transition>

      <Transition name="hint">
        <button v-if="!hintDone" type="button" class="hint" @click="dismissHint">
          <span class="hint__text">
            拖动旋转 · 点台灯/电脑/抽屉/书
            <em>知道了</em>
          </span>
        </button>
      </Transition>
    </main>

    <footer v-if="featuredProjects.length" class="dock">
      <p class="dock__label">Focus</p>
      <div class="dock__row">
        <RouterLink
          v-for="(p, i) in featuredProjects"
          :key="p.slug"
          :to="`/projects/${p.slug}`"
          class="chip"
          :style="{ '--d': `${i * 70}ms` }"
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
/* —— 3D 工作室壳 —— */
.room {
  --room-ink: #3a2e24;
  --room-paper: #f3eee4;
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  margin-inline: calc(50% - 50vw);
  width: 100vw;
  background: var(--room-paper);
  color: var(--room-ink);
  opacity: 0;
  transition: opacity 0.5s var(--ease-standard);
}
.room--ready {
  opacity: 1;
}

.bar {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: var(--space-4);
  padding: 10px var(--space-5);
  background: color-mix(in srgb, var(--color-surface) 88%, transparent);
  backdrop-filter: blur(12px);
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
  background: radial-gradient(circle at 35% 35%, #ffe0b0, var(--color-accent));
  box-shadow: 0 0 12px rgba(176, 92, 58, 0.55);
}
.bar__kicker {
  margin: 0;
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-accent);
}
.bar__title {
  margin: 0;
  font-family: var(--font-display);
  font-size: 15px;
}
.bar__tip {
  margin: 0;
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--color-text-tertiary);
  text-align: center;
}
.bar__meta {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
}
.bar__progress {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--color-text-tertiary);
}
.bar__toggle {
  font-family: var(--font-mono);
  font-size: 12px;
  padding: 6px 12px;
  border-radius: 999px;
  border: 1px solid color-mix(in srgb, var(--room-ink) 14%, transparent);
  background: transparent;
  color: var(--color-text-secondary);
  cursor: pointer;
}
.bar__toggle--on {
  background: var(--color-accent-soft);
  border-color: var(--color-accent);
  color: var(--color-accent);
}
.bar__exit {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--color-text-secondary);
  text-decoration: none;
  padding: 6px 10px;
  border-radius: 999px;
  border: 1px solid color-mix(in srgb, var(--room-ink) 12%, transparent);
}
.bar__exit:hover {
  color: var(--color-accent);
  border-color: var(--color-accent);
}

.stage {
  position: relative;
  flex: 1;
  min-height: calc(100dvh - 148px);
  overflow: hidden;
  background: #1c1610;
}

.card {
  position: absolute;
  z-index: 10;
  right: max(16px, 3vw);
  bottom: max(16px, 3vh);
  width: min(360px, calc(100% - 32px));
  padding: 22px;
  background: color-mix(in srgb, #fffcf7 94%, transparent);
  backdrop-filter: blur(16px);
  border: 1px solid color-mix(in srgb, var(--room-ink) 10%, transparent);
  border-radius: 14px;
  box-shadow: 0 24px 48px rgba(20, 12, 4, 0.35);
}
.card__head {
  display: flex;
  justify-content: space-between;
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
  color: var(--color-text-tertiary);
  cursor: pointer;
}
.card__title {
  margin: 0 0 8px;
  font-family: var(--font-display);
  font-size: 22px;
}
.card__blurb {
  margin: 0 0 14px;
  font-size: 14px;
  line-height: 1.6;
  color: var(--color-text-secondary);
}
.card__quote {
  margin: 0;
  font-family: var(--font-display);
  font-size: 16px;
  font-style: italic;
  color: var(--color-text);
}
.card__screen {
  margin: 0 0 12px;
  padding: 12px;
  border-radius: 8px;
  background: #121816;
  color: #b8e0c8;
  font-family: var(--font-mono);
  font-size: 12px;
}
.card__screen-label {
  margin: 0 0 8px;
  opacity: 0.6;
  font-size: 10px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
.card__screen-row {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  padding: 6px 0;
  color: inherit;
  text-decoration: none;
  border-bottom: 1px solid rgba(184, 224, 200, 0.12);
}
.card__screen-row:hover {
  color: #e8fff0;
}
.card__list {
  margin-bottom: 12px;
}
.card__row {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  font-size: 13px;
  padding: 6px 0;
  border-bottom: 1px dashed color-mix(in srgb, var(--room-ink) 10%, transparent);
}
.card__row a {
  color: var(--color-text);
  text-decoration: none;
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
}
.card__cta:hover {
  background: var(--color-accent-hover);
}
.card__tip {
  font-size: 12px;
  color: var(--color-text-tertiary);
}
.card-enter-active {
  transition:
    opacity 0.3s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}
.card-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}
.card-enter-from {
  opacity: 0;
  transform: translateY(12px);
}
.card-leave-to {
  opacity: 0;
}

.peek {
  position: absolute;
  z-index: 8;
  left: 50%;
  bottom: 16px;
  transform: translateX(-50%);
  padding: 8px 16px;
  border-radius: 999px;
  background: color-mix(in srgb, #fffcf7 90%, transparent);
  border: 1px solid color-mix(in srgb, var(--room-ink) 8%, transparent);
  pointer-events: none;
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--color-accent);
}
.peek-enter-active,
.peek-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}
.peek-enter-from,
.peek-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(6px);
}

.hint {
  position: absolute;
  z-index: 12;
  left: 50%;
  top: 16%;
  transform: translateX(-50%);
  padding: 14px 18px;
  border-radius: 12px;
  border: 1px solid color-mix(in srgb, var(--color-accent) 35%, transparent);
  background: color-mix(in srgb, #fffcf7 94%, transparent);
  cursor: pointer;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.35);
}
.hint__text {
  font-size: 13px;
  color: var(--color-text-secondary);
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
  transition: opacity 0.3s, transform 0.3s;
}
.hint-leave-to {
  opacity: 0;
  transform: translateX(-50%) scale(0.96);
}

.dock {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 10px var(--space-5) 12px;
  border-top: 1px solid color-mix(in srgb, var(--room-ink) 8%, transparent);
  background: var(--color-surface);
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
}
.chip {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 190px;
  padding: 10px 14px;
  border: 1px solid color-mix(in srgb, var(--room-ink) 10%, transparent);
  border-radius: 12px;
  text-decoration: none;
  color: inherit;
  transition:
    border-color 0.2s,
    transform 0.2s;
  animation: chip-in 0.45s var(--d, 0ms) both;
}
@keyframes chip-in {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
.chip:hover {
  border-color: var(--color-accent);
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
}

@media (prefers-reduced-motion: reduce) {
  .room,
  .chip,
  .hint {
    animation: none !important;
  }
  .card,
  .peek {
    transition: none !important;
  }
}

@media (max-width: 720px) {
  .bar {
    grid-template-columns: 1fr auto;
  }
  .bar__tip {
    display: none;
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
