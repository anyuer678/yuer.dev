<script setup>
// /room —— 3D 书房：全幅视口 + 悬浮 HUD + 检视卡
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import RoomStage3D from '@/components/features/room/RoomStage3D.vue'
import roomBooks from '@/content/room-books.json'
import { githubData, site, featuredProjects } from '@/utils/content.js'
import { setTitle, setDescription } from '@/utils/seo.js'

const router = useRouter()

const stageReady = ref(false)
const selected = ref(null)
const openBookId = ref('')
const focusId = ref('')
const hoverItem = ref(null)
const easterOpen = ref(false)
const lampOn = ref(true)
const monitorOn = ref(false)
const drawerOpen = ref(false)
const hintDone = ref(sessionStorage.getItem('room:hint2') === '1')
const seen = ref(new Set(JSON.parse(sessionStorage.getItem('room:seen') || '[]')))
const catalogOpen = ref(true)

const KIND_LABEL = {
  projects: '项目',
  notes: '笔记',
  lab: '实验',
  about: '关于',
  contact: '联系',
  timeline: '时间线',
  flagship: '旗舰',
  desk: '物件',
  easter: '彩蛋',
  pulse: '动态',
  book: '书本',
}

const catalog = computed(() => {
  const ageOf = (repo) => {
    const r = githubData.repos?.[repo]
    if (!r?.pushed_at) return null
    return Math.floor((Date.now() - new Date(r.pushed_at).getTime()) / 86400000)
  }
  const desk = (roomBooks.deskBooks || []).map((b) => {
    const age = ageOf(b.repo)
    return {
      id: 'book:' + b.mesh,
      label: b.title,
      kind: 'book',
      blurb: b.blurb,
      cta: '翻开书',
      to: b.projectSlug ? `/projects/${b.projectSlug}` : `/notes/${b.slug}`,
      ageDays: age,
      dusty: age != null && age > 45,
    }
  })
  const core = [
    { id: 'monitor', label: '显示器', kind: 'projects', blurb: 'Flagship 与全部项目。', cta: '打开项目', to: '/projects' },
    { id: 'keyboard', label: '键盘', kind: 'projects', blurb: '敲出下一个想法。', cta: '项目', to: '/projects' },
    { id: 'lamp', label: '台灯', kind: 'timeline', blurb: '开关灯。', cta: '时间线', to: '/timeline' },
    { id: 'drawer', label: '抽屉', kind: 'lab', blurb: '实验室与课程。', cta: '实验室', to: '/lab' },
    { id: 'bookcase', label: '书架', kind: 'flagship', blurb: '满墙书脊。', cta: '项目', to: '/projects' },
    { id: 'globe', label: '地球仪', kind: 'lab', blurb: '基础设施实验。', cta: '实验室', to: '/lab' },
    { id: 'window', label: '窗', kind: 'contact', blurb: '光随时间变化。', cta: '联系', to: '/contact' },
    { id: 'clock', label: '挂钟', kind: 'pulse', blurb: '最近仓库动态。' },
    { id: 'mug', label: '茶杯', kind: 'easter', blurb: '「软件不是一次完成的作品…」' },
    { id: 'chair', label: '椅子', kind: 'contact', blurb: '坐下聊聊。', cta: '联系', to: '/contact' },
  ]
  // 书架前几本可点笔记
  const shelf = (roomBooks.shelfNotes || []).slice(0, 6).map((n, i) => ({
    id: `shelf-book-${i}`,
    label: n.title,
    kind: 'book',
    blurb: `书架：${n.title}`,
    cta: '打开笔记',
    to: `/notes/${n.slug}`,
    // 没有 3D id 时仅索引进入
    catalogOnly: true,
  }))
  return [...core, ...desk, ...shelf]
})

const pulseRepos = computed(() =>
  Object.values(githubData.repos || {})
    .filter((r) => r.pushed_at)
    .sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at))
    .slice(0, 5)
)

const progress = computed(() => `${seen.value.size}/${catalog.value.length}`)

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
  if (data.id === 'lamp' || data.id === 'floorlamp') lampOn.value = !lampOn.value
  if (data.id === 'monitor') monitorOn.value = !monitorOn.value
  if (data.id === 'drawer') drawerOpen.value = !drawerOpen.value

  // 书本：翻开动画 + 内容卡
  if (data.kind === 'book') {
    easterOpen.value = false
    if (openBookId.value === data.id) {
      // 再点 → 进入
      if (data.to) router.push(data.to)
      return
    }
    openBookId.value = data.id
    selected.value = data
    return
  }

  openBookId.value = ''
  if (data.kind === 'easter') {
    selected.value = data
    easterOpen.value = true
    return
  }
  if (data.kind === 'pulse' || data.id === 'clock') {
    easterOpen.value = false
    selected.value = { ...data, overlay: 'pulse' }
    return
  }
  easterOpen.value = false
  if (selected.value?.id === data.id && data.to) {
    router.push(data.to)
    return
  }
  selected.value = data
}

function pickFromCatalog(item) {
  if (item.catalogOnly) {
    // 仅索引进入的笔记，不飞镜头
    openBookId.value = ''
    selected.value = item
    easterOpen.value = false
    return
  }
  focusId.value = item.id
  if (item.id === 'lamp') lampOn.value = !lampOn.value
  if (item.id === 'monitor') monitorOn.value = !monitorOn.value
  if (item.id === 'drawer') drawerOpen.value = !drawerOpen.value
  if (item.kind === 'book') {
    openBookId.value = item.id
    selected.value = item
    easterOpen.value = false
    return
  }
  if (item.kind === 'easter') {
    selected.value = item
    easterOpen.value = true
    return
  }
  if (item.kind === 'pulse') {
    selected.value = { ...item, overlay: 'pulse' }
    easterOpen.value = false
    return
  }
  easterOpen.value = false
  selected.value = item
}

function clearSelection() {
  selected.value = null
  easterOpen.value = false
  openBookId.value = ''
}

function goSelected() {
  if (selected.value?.to) router.push(selected.value.to)
}

function dismissHint() {
  hintDone.value = true
  sessionStorage.setItem('room:hint2', '1')
}

function onKey(e) {
  if (e.key === 'Escape') clearSelection()
}

onMounted(() => {
  window.addEventListener('keydown', onKey)
})
onUnmounted(() => window.removeEventListener('keydown', onKey))

setTitle(`工作室 · ${site?.name || 'Yuer'}`)
setDescription('走进 3D 书房：拖动视角，点选屋里的物件与书本。')
</script>

<template>
  <div class="room" :class="{ 'room--in': stageReady }">
    <!-- 加载幕 -->
    <div v-if="!stageReady" class="boot" aria-live="polite">
      <div class="boot__inner">
        <span class="boot__mark" aria-hidden="true" />
        <p class="boot__kicker">Yuer Studio</p>
        <h1 class="boot__title">正在推开书房的门</h1>
        <div class="boot__bar" aria-hidden="true"><span /></div>
      </div>
    </div>

    <!-- 3D 舞台 -->
    <main class="stage" @click.self="clearSelection">
      <RoomStage3D
        :lamp-on="lampOn"
        :monitor-on="monitorOn"
        :drawer-open="drawerOpen"
        :open-book-id="openBookId"
        :focus-id="focusId"
        @select="onSelect"
        @hover="onHover"
        @ready="stageReady = true"
      />
      <div class="stage__vignette" aria-hidden="true" />
      <div class="stage__grain" aria-hidden="true" />

      <!-- 顶部 HUD -->
      <header class="hud">
        <div class="hud__brand">
          <span class="hud__dot" aria-hidden="true" />
          <div>
            <p class="hud__kicker">Studio</p>
            <h1 class="hud__title">工作室</h1>
          </div>
        </div>
        <p class="hud__help">拖动旋转 · 滚轮缩放 · 点击物件与书本</p>
        <div class="hud__actions">
          <span class="hud__prog">{{ progress }}</span>
          <button type="button" class="hud__btn" :class="{ 'hud__btn--on': lampOn }" @click="lampOn = !lampOn">
            {{ lampOn ? '灯 · 亮' : '灯 · 灭' }}
          </button>
          <button type="button" class="hud__btn" :class="{ 'hud__btn--on': catalogOpen }" @click="catalogOpen = !catalogOpen">
            物件
          </button>
          <RouterLink class="hud__btn hud__btn--link" to="/projects">列表</RouterLink>
        </div>
      </header>

      <!-- 左侧物件索引 -->
      <aside v-show="catalogOpen && stageReady" class="index">
        <p class="index__title">屋里有什么</p>
        <ul class="index__list">
          <li v-for="item in catalog" :key="item.id">
            <button
              type="button"
              class="index__item"
              :class="{ 'index__item--on': selected?.id === item.id, 'index__item--dusty': item.dusty }"
              @click="pickFromCatalog(item)"
            >
              <span class="index__kind">{{ KIND_LABEL[item.kind] || item.kind }}</span>
              <span class="index__label">
                {{ item.label }}
                <em v-if="item.dusty" class="index__dust">蒙尘</em>
              </span>
            </button>
          </li>
        </ul>
      </aside>

      <!-- 检视卡 -->
      <Transition name="card">
        <article v-if="selected && !easterOpen" :key="selected.id" class="card" :class="{ 'card--book': selected.kind === 'book' }">
          <div class="card__eyebrow">
            <span>{{ KIND_LABEL[selected.kind] || selected.kind }}</span>
            <button type="button" class="card__x" aria-label="关闭" @click="clearSelection">×</button>
          </div>
          <h2 class="card__title">{{ selected.label }}</h2>
          <p v-if="selected.dusty" class="dust">
            <span class="dust__dot" aria-hidden="true" />
            蒙尘 · 已 {{ selected.ageDays }} 天未推送
          </p>
          <p class="card__blurb">{{ selected.blurb }}</p>

          <!-- 打开的书：项目页 -->
          <div v-if="selected.kind === 'book'" class="book">
            <div class="book__page">
              <p class="book__cap">书中写着</p>
              <p class="book__project">{{ selected.projectTitle || selected.label }}</p>
              <p v-if="selected.projectSubtitle" class="book__sub">{{ selected.projectSubtitle }}</p>
              <p v-if="selected.noteSlug" class="book__note">相关笔记 · {{ selected.noteSlug }}</p>
            </div>
          </div>

          <div v-if="selected.id === 'monitor' && monitorOn" class="screen">
            <p class="screen__cap">显示器 · 在线</p>
            <RouterLink v-for="p in featuredProjects" :key="p.slug" :to="`/projects/${p.slug}`" class="screen__row">
              <span class="screen__name">{{ p.title }}</span>
              <span class="screen__sub">{{ p.subtitle }}</span>
            </RouterLink>
          </div>

          <div v-if="selected.overlay === 'pulse'" class="pulse">
            <div v-for="r in pulseRepos" :key="r.name" class="pulse__row">
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

          <div v-if="selected.to" class="card__cta-row">
            <button type="button" class="cta" @click="goSelected">
              {{ selected.cta || '打开' }}
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </article>
      </Transition>

      <Transition name="card">
        <article v-if="easterOpen" key="e" class="card card--quote">
          <div class="card__eyebrow">
            <span>彩蛋</span>
            <button type="button" class="card__x" aria-label="关闭" @click="clearSelection">×</button>
          </div>
          <h2 class="card__title">{{ selected?.label }}</h2>
          <p class="card__quote">{{ selected?.blurb }}</p>
        </article>
      </Transition>

      <!-- hover 标签 -->
      <Transition name="peek">
        <div v-if="hoverItem && !selected && stageReady" :key="hoverItem.id" class="peek">
          <span class="peek__kind">{{ KIND_LABEL[hoverItem.kind] || '物件' }}</span>
          <span class="peek__label">{{ hoverItem.label }}</span>
        </div>
      </Transition>

      <!-- 首次引导 -->
      <Transition name="hint">
        <button v-if="!hintDone && stageReady" type="button" class="hint" @click="dismissHint">
          <span class="hint__ring" aria-hidden="true" />
          <span>
            拖动看房间，点书本打开对应笔记
            <em>知道了</em>
          </span>
        </button>
      </Transition>
    </main>
  </div>
</template>

<style scoped>
.room {
  --ink: #2c241c;
  --paper: #f7f1e6;
  margin-inline: calc(50% - 50vw);
  width: 100vw;
  min-height: 100vh;
  min-height: 100dvh;
  background: #1a140e;
  color: var(--ink);
  opacity: 0;
  transition: opacity 0.7s var(--ease-standard);
}
.room--in {
  opacity: 1;
}

/* 加载幕 */
.boot {
  position: fixed;
  inset: 0;
  z-index: 40;
  display: grid;
  place-items: center;
  background:
    radial-gradient(ellipse at 50% 40%, #3a2e22 0%, #1a140e 70%);
  color: #f0e4d0;
  pointer-events: none;
  transition: opacity 0.6s;
}
.room--in .boot {
  opacity: 0;
}
.boot__inner {
  text-align: center;
  animation: boot-in 0.8s var(--ease-standard) both;
}
@keyframes boot-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
.boot__mark {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #c47850;
  box-shadow: 0 0 24px rgba(196, 120, 80, 0.7);
  margin-bottom: 16px;
}
.boot__kicker {
  margin: 0;
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #c47850;
}
.boot__title {
  margin: 8px 0 20px;
  font-family: var(--font-display);
  font-size: 28px;
  font-weight: 500;
}
.boot__bar {
  width: 160px;
  height: 2px;
  margin: 0 auto;
  background: rgba(255, 240, 220, 0.12);
  border-radius: 2px;
  overflow: hidden;
}
.boot__bar span {
  display: block;
  height: 100%;
  width: 40%;
  background: linear-gradient(90deg, transparent, #c47850, transparent);
  animation: boot-slide 1.1s ease-in-out infinite;
}
@keyframes boot-slide {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(300%);
  }
}

.stage {
  position: relative;
  min-height: 100dvh;
  overflow: hidden;
}
.stage__vignette {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 2;
  background: radial-gradient(ellipse at center, transparent 42%, rgba(12, 8, 4, 0.45) 100%);
}
.stage__grain {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 2;
  opacity: 0.07;
  mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  background-size: 160px;
}

/* HUD */
.hud {
  position: absolute;
  z-index: 10;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  background: linear-gradient(to bottom, rgba(20, 14, 8, 0.4), transparent);
  color: #f5ead8;
}
.hud__brand {
  display: flex;
  align-items: center;
  gap: 10px;
}
.hud__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #e0a070;
  box-shadow: 0 0 12px rgba(224, 160, 112, 0.8);
}
.hud__kicker {
  margin: 0;
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #d0a888;
}
.hud__title {
  margin: 0;
  font-family: var(--font-display);
  font-size: 16px;
  font-weight: 500;
}
.hud__help {
  flex: 1;
  margin: 0;
  text-align: center;
  font-family: var(--font-mono);
  font-size: 11px;
  color: rgba(245, 234, 216, 0.55);
}
.hud__actions {
  display: flex;
  align-items: center;
  gap: 8px;
}
.hud__prog {
  font-family: var(--font-mono);
  font-size: 11px;
  color: rgba(245, 234, 216, 0.5);
  margin-right: 4px;
}
.hud__btn {
  font-family: var(--font-mono);
  font-size: 12px;
  padding: 7px 12px;
  border-radius: 999px;
  border: 1px solid rgba(245, 234, 216, 0.22);
  background: rgba(20, 14, 8, 0.35);
  color: #f5ead8;
  cursor: pointer;
  text-decoration: none;
  backdrop-filter: blur(8px);
  transition:
    border-color 0.2s,
    background 0.2s;
}
.hud__btn:hover {
  border-color: rgba(224, 160, 112, 0.7);
  background: rgba(60, 40, 24, 0.55);
}
.hud__btn--on {
  border-color: #c47850;
  background: rgba(196, 120, 80, 0.25);
  color: #ffd2b0;
}

/* 物件索引 */
.index {
  position: absolute;
  z-index: 10;
  left: 12px;
  top: 56px;
  width: 176px;
  max-height: calc(100dvh - 120px);
  overflow: auto;
  padding: 10px 8px;
  border-radius: 12px;
  background: rgba(18, 12, 8, 0.48);
  border: 1px solid rgba(245, 234, 216, 0.08);
  backdrop-filter: blur(10px);
  color: #f5ead8;
}
.index__title {
  margin: 0 0 10px;
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #c9a888;
}
.index__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.index__item {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1px;
  padding: 8px 10px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: inherit;
  cursor: pointer;
  text-align: left;
  transition: background 0.18s;
}
.index__item:hover,
.index__item--on {
  background: rgba(196, 120, 80, 0.22);
}
.index__kind {
  font-family: var(--font-mono);
  font-size: 9px;
  letter-spacing: 0.08em;
  color: #d0a888;
  text-transform: uppercase;
}
.index__label {
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 6px;
}
.index__dust {
  font-style: normal;
  font-family: var(--font-mono);
  font-size: 9px;
  padding: 1px 6px;
  border-radius: 999px;
  background: rgba(180, 160, 140, 0.2);
  color: #c0b0a0;
}
.index__item--dusty .index__label {
  color: #c8b8a8;
}

/* 检视卡 */
.card {
  position: absolute;
  z-index: 12;
  right: 18px;
  bottom: 18px;
  width: min(380px, calc(100% - 36px));
  padding: 20px 20px 18px;
  border-radius: 16px;
  background: linear-gradient(160deg, rgba(255, 248, 236, 0.97), rgba(242, 230, 210, 0.95));
  border: 1px solid rgba(80, 50, 28, 0.12);
  box-shadow:
    0 28px 60px rgba(0, 0, 0, 0.4),
    0 1px 0 rgba(255, 255, 255, 0.65) inset;
  color: var(--ink);
}
.card--quote {
  background: linear-gradient(160deg, rgba(255, 244, 228, 0.98), rgba(248, 228, 200, 0.96));
}
.card--book {
  border-color: rgba(176, 92, 58, 0.28);
  box-shadow:
    0 28px 60px rgba(0, 0, 0, 0.42),
    0 0 0 1px rgba(176, 92, 58, 0.08) inset;
}
.dust {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin: 0 0 10px;
  padding: 4px 10px;
  border-radius: 999px;
  background: rgba(120, 100, 80, 0.12);
  font-family: var(--font-mono);
  font-size: 11px;
  color: #7a6858;
}
.dust__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #b0a090;
}
.book {
  margin: 0 0 12px;
  padding: 2px;
  border-radius: 8px;
  background: linear-gradient(135deg, #e8dcc8, #d4c4a8);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.5);
}
.book__page {
  padding: 14px 16px;
  border-radius: 6px;
  background:
    repeating-linear-gradient(
      to bottom,
      #faf6ec 0px,
      #faf6ec 26px,
      #f0e8d8 26px,
      #f0e8d8 27px
    );
  border: 1px solid rgba(120, 90, 60, 0.12);
  animation: page-in 0.45s cubic-bezier(0.22, 1, 0.36, 1) both;
}
@keyframes page-in {
  from {
    opacity: 0;
    transform: rotateX(12deg) translateY(6px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
.book__cap {
  margin: 0 0 6px;
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #a06040;
}
.book__project {
  margin: 0;
  font-family: var(--font-display);
  font-size: 20px;
  font-weight: 600;
  color: #2c241c;
}
.book__sub {
  margin: 4px 0 0;
  font-size: 13px;
  color: #6a5a48;
}
.book__note {
  margin: 10px 0 0;
  font-family: var(--font-mono);
  font-size: 11px;
  color: #9a8878;
}
.card__eyebrow {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #a06040;
}
.card__x {
  border: none;
  background: transparent;
  font-size: 22px;
  line-height: 1;
  color: #a09080;
  cursor: pointer;
}
.card__x:hover {
  color: var(--ink);
}
.card__title {
  margin: 0 0 8px;
  font-family: var(--font-display);
  font-size: 24px;
  font-weight: 600;
  letter-spacing: 0.01em;
}
.card__blurb {
  margin: 0 0 14px;
  font-size: 14px;
  line-height: 1.65;
  color: #5c5044;
}
.card__quote {
  margin: 0;
  font-family: var(--font-display);
  font-size: 17px;
  font-style: italic;
  line-height: 1.6;
  color: #3a3028;
}
.card__cta-row {
  margin-top: 4px;
}
.cta {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-mono);
  font-size: 13px;
  padding: 11px 18px;
  border: none;
  border-radius: 999px;
  background: #b05c3a;
  color: #fff8f0;
  cursor: pointer;
  box-shadow: 0 8px 20px rgba(176, 92, 58, 0.35);
  transition:
    transform 0.2s,
    background 0.2s;
}
.cta:hover {
  background: #97492c;
  transform: translateY(-1px);
}

.screen {
  margin: 0 0 12px;
  padding: 12px;
  border-radius: 10px;
  background: #0e1412;
  color: #9fd8b8;
  font-family: var(--font-mono);
  font-size: 12px;
}
.screen__cap {
  margin: 0 0 8px;
  font-size: 10px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  opacity: 0.55;
}
.screen__row {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  padding: 7px 0;
  color: inherit;
  text-decoration: none;
  border-bottom: 1px solid rgba(159, 216, 184, 0.12);
}
.screen__row:hover .screen__name {
  color: #e8fff0;
}
.screen__sub {
  opacity: 0.55;
  font-size: 11px;
}
.pulse {
  margin-bottom: 10px;
}
.pulse__row {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  font-size: 13px;
  padding: 7px 0;
  border-bottom: 1px dashed rgba(60, 40, 20, 0.12);
}
.pulse__row a {
  color: var(--ink);
  text-decoration: none;
}
.pulse__row a:hover {
  color: #b05c3a;
}
.pulse__row span {
  font-family: var(--font-mono);
  font-size: 11px;
  color: #9a8878;
}

.card-enter-active {
  transition:
    opacity 0.32s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.32s cubic-bezier(0.22, 1, 0.36, 1);
}
.card-leave-active {
  transition: opacity 0.18s, transform 0.18s;
}
.card-enter-from {
  opacity: 0;
  transform: translateY(16px) scale(0.98);
}
.card-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

.peek {
  position: absolute;
  z-index: 11;
  left: 50%;
  bottom: 22px;
  transform: translateX(-50%);
  display: flex;
  align-items: baseline;
  gap: 10px;
  padding: 10px 18px;
  border-radius: 999px;
  background: rgba(18, 12, 8, 0.62);
  border: 1px solid rgba(245, 234, 216, 0.12);
  backdrop-filter: blur(10px);
  color: #f5ead8;
  pointer-events: none;
  font-family: var(--font-mono);
}
.peek__kind {
  font-size: 10px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #d0a888;
}
.peek__label {
  font-size: 13px;
}
.peek-enter-active,
.peek-leave-active {
  transition:
    opacity 0.2s,
    transform 0.2s;
}
.peek-enter-from,
.peek-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(6px);
}

.hint {
  position: absolute;
  z-index: 14;
  left: 50%;
  top: 22%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 12px;
  max-width: min(420px, 90%);
  padding: 14px 18px;
  border-radius: 14px;
  border: 1px solid rgba(196, 120, 80, 0.4);
  background: rgba(28, 18, 10, 0.78);
  backdrop-filter: blur(12px);
  color: #f5ead8;
  cursor: pointer;
  font-size: 13px;
  line-height: 1.5;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.35);
  animation: hint-in 0.5s 1s both;
}
@keyframes hint-in {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%);
  }
}
.hint__ring {
  flex-shrink: 0;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid #e0a070;
  box-shadow: 0 0 0 4px rgba(224, 160, 112, 0.2);
}
.hint em {
  display: block;
  margin-top: 2px;
  font-style: normal;
  font-family: var(--font-mono);
  font-size: 11px;
  color: #e0a070;
}
.hint-leave-active {
  transition: opacity 0.25s, transform 0.25s;
}
.hint-leave-to {
  opacity: 0;
  transform: translateX(-50%) scale(0.96);
}

@media (max-width: 860px) {
  .hud__help {
    display: none;
  }
  .index {
    display: none;
  }
  .card {
    left: 12px;
    right: 12px;
    width: auto;
    bottom: 12px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .room,
  .boot__inner,
  .boot__bar span,
  .hud,
  .index,
  .hint,
  .card,
  .peek {
    animation: none !important;
    transition: none !important;
  }
}
</style>
