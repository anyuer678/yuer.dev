<script setup>
// /room —— 3D 书房：全屏沉浸式舞台 + 两端极简 HUD + 底部索引 dock + 检视信息条
// 布局约定：控件只出现在「顶部两端」和「底部边缘」，
// 画面中央与左上（书架所在）完全留给场景。
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import RoomStage3D from '@/components/features/room/RoomStage3D.vue'
import roomBooks from '@/content/room-books.json'
import { featuredProjects, githubData, productProjects, projects, site } from '@/utils/content.js'
import { setTitle, setDescription } from '@/utils/seo.js'

const router = useRouter()

const stageReady = ref(false)
const stageFailed = ref(false)
const selected = ref(null)
const openBookId = ref('')
const focusId = ref('')
const easterOpen = ref(false)
const lampOn = ref(true)
const monitorOn = ref(false)
const drawerOpen = ref(false)
const hintDone = ref(sessionStorage.getItem('room:hint2') === '1')
const hintAuto = ref(false)
const seen = ref(new Set(JSON.parse(sessionStorage.getItem('room:seen') || '[]')))
const catalogOpen = ref(true)
// 书架 18 本「真书」的锚点由 3D 侧算好后回传（shelfmap），两边不各写一份映射
const shelfAnchors = ref([])
const shelfExpanded = ref(false)
// 书架挂画 → 轻量星图（15 §3.E 降级方案）
const atlasOpen = ref(false)
// 是否已经"走近书架"（刻字只有凑近才读得到，见 RoomStage3D 的镜头导航）
const shelfView = ref(false)
// 悬停纸签：贴在指针所指的物件旁边，任意距离都能读到名字
const hoverTag = ref(null)
// dock 里书架默认只露前几本，其余收进「+N」里，免得底部压成三行。
// 5 不是随手取的：书本分组是一整个不可拆的 flex 项，实测 6 本时整组宽 1211px，
// 比 dock 内容宽（1180 − 36 内边距）多出 69px，末位的「书架 +N」会被裁掉 ——
// 而那正是展开全部 18 本的入口。降到 5 本留出约 48px 余量。
const SHELF_PREVIEW = 5
// 触屏没有 hover、也没有滚轮，引导文案得跟着换（判定同 RoomStage3D：
// 只看 pointer:coarse 会在无头/笔电触屏上假阳性，必须叠加 maxTouchPoints）
const isTouch =
  typeof window !== 'undefined' &&
  !!window.matchMedia?.('(pointer: coarse)').matches &&
  (navigator.maxTouchPoints || 0) > 0

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
    // 旗舰书先落案头（/desk/:slug），再从案头开卷/进档案
    const to = b.projectSlug ? `/desk/${b.projectSlug}` : `/notes/${b.slug}`
    return {
      id: 'book:' + b.mesh,
      label: b.title,
      kind: 'book',
      blurb: b.blurb,
      cta: b.projectSlug ? '入案头' : '翻开书',
      to,
      projectSlug: b.projectSlug || undefined,
      noteSlug: b.projectSlug ? b.slug : b.slug,
      storyTo: b.projectSlug ? `/stories/${b.projectSlug}` : undefined,
      ageDays: age,
      dusty: age != null && age > 45,
    }
  })
  // 物件 → 世界门槛（Phase C）：先进气质，再进全量列表；书仍走案头/笔记
  const core = [
    {
      id: 'monitor',
      label: '显示器',
      kind: 'projects',
      blurb: '旗舰与产品先在作品斋落座。',
      cta: '作品斋',
      to: '/w/works',
    },
    {
      id: 'keyboard',
      label: '键盘',
      kind: 'projects',
      blurb: '纸面终端：工具墙与可复制命令。',
      cta: '工作台',
      to: '/bench',
    },
    {
      id: 'lamp',
      label: '台灯',
      kind: 'timeline',
      blurb: '开关灯；灯亮着说明还在写。',
      cta: '时间线',
      to: '/timeline',
    },
    {
      id: 'drawer',
      label: '抽屉',
      kind: 'lab',
      blurb: '半成品与课程实验收在这里。',
      cta: '实验场',
      to: '/w/lab',
    },
    {
      id: 'bookcase',
      label: '书架',
      kind: 'flagship',
      blurb: '满墙书脊——挂画是星图。',
      cta: '看星图',
      overlay: 'atlas',
    },
    {
      id: 'globe',
      label: '地球仪',
      kind: 'lab',
      blurb: '服务器与基础设施实验。',
      cta: '实验场',
      to: '/w/lab',
    },
    {
      id: 'window',
      label: '窗',
      kind: 'contact',
      blurb: '光随时间变化。门外是花庭。',
      cta: '回花庭',
      to: '/garden',
    },
    { id: 'clock', label: '挂钟', kind: 'pulse', blurb: '最近仓库动态。' },
    { id: 'mug', label: '茶杯', kind: 'easter', blurb: '「软件不是一次完成的作品…」' },
    {
      id: 'chair',
      label: '椅子',
      kind: 'contact',
      blurb: '坐下聊聊——人在但不吵。',
      cta: '关于檐',
      to: '/w/about',
    },
  ]
  // 侧桌那本也摆进索引：它在场景里同样可点，之前被漏掉了
  const side = roomBooks.sideBook
    ? [{
        id: 'book:' + roomBooks.sideBook.mesh,
        label: roomBooks.sideBook.title,
        kind: 'book',
        blurb: roomBooks.sideBook.blurb,
        cta: '翻开书',
        to: `/notes/${roomBooks.sideBook.slug}`,
        noteSlug: roomBooks.sideBook.slug,
      }]
    : []
  // 书架上 18 篇笔记各对应一本刻了书名的「真书」。
  // id 直接指向真实 mesh —— 点索引就能高亮到那一本，不再是拨不通的死链。
  const shelf = shelfAnchors.value.map((a, i) => ({
    id: 'book:' + a.mesh,
    label: a.title,
    kind: 'book',
    blurb: `书架第 ${i + 1} 本 · ${a.title}`,
    cta: '翻开书',
    to: `/notes/${a.slug}`,
    noteSlug: a.slug,
    shelfIndex: i,
    // 收起时只露前 SHELF_PREVIEW 本，其余靠「+N」展开
    folded: i >= SHELF_PREVIEW,
  }))
  return [...core, ...desk, ...side, ...shelf]
})

// dock 分两组：物件（可开关 / 可查看）与书本（打开笔记），
// 两者的交互语义完全不同，混在一个扁平列表里会让人猜不到点了会发生什么
const propsItems = computed(() => catalog.value.filter((i) => i.kind !== 'book'))
const bookItems = computed(() =>
  catalog.value.filter((i) => i.kind === 'book' && (shelfExpanded.value || !i.folded))
)
const foldedShelfCount = computed(() =>
  shelfAnchors.value.length > SHELF_PREVIEW ? shelfAnchors.value.length - SHELF_PREVIEW : 0
)
const progressRatio = computed(() =>
  catalog.value.length ? seen.value.size / catalog.value.length : 0
)

const pulseRepos = computed(() =>
  Object.values(githubData.repos || {})
    .filter((r) => r.pushed_at)
    .sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at))
    .slice(0, 5)
)

// 星图节点：旗舰居中近距，产品环绕；案头存在则优先案头
const atlasNodes = computed(() => {
  const deskSlugs = new Set(['lumen', 'polycodehub', 'evocode'])
  const list = featuredProjects.length ? featuredProjects : projects.slice(0, 3)
  const extra = productProjects.slice(0, 3)
  const all = [...list, ...extra]
  const pos = [
    { x: 70, y: 40, r: 10 },
    { x: 280, y: 48, r: 9 },
    { x: 300, y: 120, r: 9 },
    { x: 60, y: 120, r: 7 },
    { x: 140, y: 140, r: 7 },
    { x: 240, y: 20, r: 7 },
  ]
  return all.slice(0, 6).map((p, idx) => ({
    slug: p.slug,
    title: p.title,
    tier: p.tier,
    to: deskSlugs.has(p.slug) ? `/desk/${p.slug}` : `/projects/${p.slug}`,
    ...pos[idx],
    fill: p.tier === 'flagship' ? '#f6e9e1' : '#f3f2ec',
  }))
})

function goAtlas(p) {
  if (!p?.to) return
  atlasOpen.value = false
  router.push(p.to)
}

function markSeen(id) {
  if (!id) return
  seen.value = new Set([...seen.value, id])
  sessionStorage.setItem('room:seen', JSON.stringify([...seen.value]))
}

// 纸签的定时收尾：触摸轻点之后没有"指针移开"这个动作，不自毁就会永久留在屏上
let tagTimer = 0
function clearTagTimer() {
  if (tagTimer) {
    clearTimeout(tagTimer)
    tagTimer = 0
  }
}
function dropTag() {
  clearTagTimer()
  hoverTag.value = null
}

function onHover(data) {
  if (!data?.id) {
    dropTag()
    return
  }
  markSeen(data.id)
  const at = data.at
  if (!at) {
    dropTag()
    return
  }
  // 纸签跟着所指的物件走。估宽是为了不越出视口右边（纸签是 nowrap 的）
  const est = 96 + String(data.label || '').length * 13
  hoverTag.value = {
    kind: data.kind,
    label: data.label,
    x: Math.max(12, Math.min(at.x + 20, window.innerWidth - est)),
    y: Math.max(12, Math.min(at.y + 18, window.innerHeight - 54)),
  }
  clearTagTimer()
  // 触摸点出来的纸签给 2.6s 自毁；鼠标悬停的纸签照旧跟到指针移开为止
  if (data.transient) tagTimer = setTimeout(dropTag, 2600)
}

function onSelect(data) {
  if (!data?.id) return
  markSeen(data.id)
  if (data.id === 'lamp' || data.id === 'floorlamp') lampOn.value = !lampOn.value
  if (data.id === 'monitor') monitorOn.value = !monitorOn.value
  if (data.id === 'drawer') drawerOpen.value = !drawerOpen.value
  if (data.id === 'bookcase' || data.overlay === 'atlas' || data.id === 'atlas') {
    atlasOpen.value = true
    selected.value = data
    return
  }

  // 书本：高亮 + 内容卡（不改 3D 姿态）
  if (data.kind === 'book') {
    easterOpen.value = false
    if (openBookId.value === data.id) {
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
  // 从 dock 点条目 = 用户在看新东西了，上一枚纸签就过期了
  dropTag()
  if (item.overlay === 'atlas' || item.id === 'bookcase') {
    atlasOpen.value = true
    selected.value = item
    openBookId.value = ''
    return
  }
  // 不飞镜头，只更新选中与浮卡
  if (item.kind === 'book' && !item.catalogOnly) {
    openBookId.value = item.id
  } else {
    openBookId.value = ''
  }
  if (item.id === 'lamp') lampOn.value = !lampOn.value
  if (item.id === 'monitor') monitorOn.value = !monitorOn.value
  if (item.id === 'drawer') drawerOpen.value = !drawerOpen.value
  // 书架上的书名刻在书脊上，默认机位读不出来 —— 点条目顺手把镜头送到那本书前。
  // 时间戳只是为了让"点同一本"也能再触发一次镜头导航。
  if (item.shelfIndex != null) focusId.value = `${item.id}@${Date.now()}`
  else if (item.id === 'bookcase') focusId.value = `bookcase@${Date.now()}`
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
  dropTag()
  selected.value = null
  easterOpen.value = false
  openBookId.value = ''
  atlasOpen.value = false
}

function goSelected() {
  if (selected.value?.to) router.push(selected.value.to)
}

// 签名时刻：灯灭则先亮灯；灯亮则进开卷叙事
function openStory(item) {
  if (!item?.storyTo) return
  if (!lampOn.value) lampOn.value = true
  router.push(item.storyTo)
}

function returnToRoom() {
  dropTag()
  focusId.value = `room@${Date.now()}`
}

// 沉浸式下没有全局导航，必须自带出口；无历史时回花庭（与书房同一宇宙）
function goBack() {
  if (window.history.state?.back) router.back()
  else router.push('/garden')
}

// dock 装的是 19 个条目，窄屏和 16:9 以下必然溢出。
// 把垂直滚轮也接到横向推进上，否则用户只会看到右边被切掉一截。
function onDockWheel(e) {
  const el = e.currentTarget
  if (!el || el.scrollWidth <= el.clientWidth) return
  e.preventDefault()
  el.scrollLeft += e.deltaY || e.deltaX
}

function dismissHint() {
  hintDone.value = true
  sessionStorage.setItem('room:hint2', '1')
}

function onKey(e) {
  if (e.key === 'Escape') {
    if (atlasOpen.value) atlasOpen.value = false
    clearSelection()
  }
}

// 引导提示只负责「教会一次」，常驻会一直压住画面中心
let hintTimer = 0
let failTimer = 0
watch(stageReady, (ready) => {
  if (!ready || hintDone.value) return
  hintTimer = setTimeout(() => {
    hintAuto.value = true
  }, 8000)
})

function onStageReady() {
  clearTimeout(failTimer)
  stageReady.value = true
  stageFailed.value = false
}

function onStageFailed() {
  clearTimeout(failTimer)
  stageFailed.value = true
  // 3D 不可用时仍开放 HUD/dock：信息架构不残缺
  stageReady.value = true
}

onMounted(() => {
  window.addEventListener('keydown', onKey)
  // 弱网兜底：12s 仍未 ready 则切 2D 索引（避免卡在「推门」）
  failTimer = window.setTimeout(() => {
    if (!stageReady.value) onStageFailed()
  }, 12000)
})
onUnmounted(() => {
  window.removeEventListener('keydown', onKey)
  clearTimeout(hintTimer)
  clearTimeout(failTimer)
  clearTagTimer()
})

setTitle(`工作室 · ${site?.name || 'Yuer'}`)
setDescription('走进 3D 书房：拖动视角，点选屋里的物件与书本。')
</script>

<template>
  <div class="room" :class="{ 'room--in': stageReady }">
    <!-- 加载幕 -->
    <div v-if="!stageReady && !stageFailed" class="boot" aria-live="polite">
      <div class="boot__inner">
        <span class="boot__mark" aria-hidden="true" />
        <p class="boot__kicker">Yuer Studio</p>
        <h1 class="boot__title">正在推开书房的门</h1>
        <div class="boot__bar" aria-hidden="true"><span /></div>
      </div>
    </div>

    <!-- 2D 降级：无 WebGL / 弱网超时 — 索引仍可用，列表主路径不受影响 -->
    <div v-if="stageFailed" class="fallback" role="status">
      <div class="fallback__inner">
        <p class="fallback__kicker">书房 · 简本</p>
        <h2 class="fallback__title">3D 场景暂不可用</h2>
        <p class="fallback__desc">
          本机无法加载 WebGL 场景或网络较慢。物件与书本仍在下方索引里，档案与花庭不受影响。
        </p>
        <div class="fallback__links">
          <RouterLink to="/garden">花庭</RouterLink>
          <RouterLink to="/w/works">作品斋</RouterLink>
          <RouterLink to="/desk/lumen">Lumen 案头</RouterLink>
          <RouterLink to="/bench">工作台</RouterLink>
          <RouterLink to="/projects">项目列表</RouterLink>
        </div>
      </div>
    </div>

    <!-- 3D 舞台 -->
    <main class="stage" @click.self="clearSelection">
      <RoomStage3D
        v-if="!stageFailed"
        :lamp-on="lampOn"
        :monitor-on="monitorOn"
        :drawer-open="drawerOpen"
        :open-book-id="openBookId"
        :focus-id="focusId"
        @select="onSelect"
        @hover="onHover"
        @shelfmap="shelfAnchors = $event"
        @viewchange="shelfView = $event === 'shelf'"
        @ready="onStageReady"
        @failed="onStageFailed"
      />
      <div v-if="!stageFailed" class="stage__vignette" aria-hidden="true" />
      <div v-if="!stageFailed" class="stage__grain" aria-hidden="true" />

      <!-- 探索进度：贴屏幕顶边的一条细线，不占位、不抢注意力 -->
      <div class="progress" aria-hidden="true">
        <span :style="{ transform: `scaleX(${progressRatio})` }" />
      </div>

      <!-- 顶部 HUD：只有两端有东西，中间整段留给场景 -->
      <header class="hud">
        <button type="button" class="hud__back" @click="goBack">
          <span aria-hidden="true">←</span> 返回
        </button>
        <div class="hud__actions">
          <RouterLink class="hud__btn hud__btn--link" to="/garden">花庭</RouterLink>
          <button
            v-if="shelfView"
            type="button"
            class="hud__btn hud__btn--on"
            @click="returnToRoom"
          >
            回到房间
          </button>
          <button
            type="button"
            class="hud__btn"
            :class="{ 'hud__btn--on': lampOn }"
            @click="lampOn = !lampOn"
          >
            灯 · {{ lampOn ? '亮' : '灭' }}
          </button>
          <button
            type="button"
            class="hud__btn"
            :class="{ 'hud__btn--on': catalogOpen }"
            @click="catalogOpen = !catalogOpen"
          >
            索引
          </button>
          <RouterLink class="hud__btn hud__btn--link" to="/projects">项目</RouterLink>
        </div>
      </header>

      <!-- 首次引导：贴 HUD 下沿，8 秒后自动退场 -->
      <Transition name="hint">
        <button
          v-if="!hintDone && !hintAuto && stageReady"
          type="button"
          class="hint"
          @click="dismissHint"
        >
          <span class="hint__ring" aria-hidden="true" />
          <span>
            {{ stageFailed
              ? '3D 不可用时仍可用下方索引浏览屋里的一切'
              : isTouch
                ? '拖动看房间 · 点一下书能看名字'
                : '拖动看房间 · 指针停到书上会浮出书名' }}
            <em>知道了</em>
          </span>
        </button>
      </Transition>

      <!-- 底部区：检视信息条从索引 dock 上方升起，两者共用同一列 -->
      <div class="bottom" :class="{ 'bottom--shelf': shelfView }">
        <Transition name="sheet">
          <article
            v-if="selected && !easterOpen"
            :key="selected.id"
            class="sheet"
            :class="{ 'sheet--book': selected.kind === 'book' }"
          >
            <div class="sheet__eyebrow">
              <span>{{ KIND_LABEL[selected.kind] || selected.kind }}</span>
              <button type="button" class="sheet__x" aria-label="关闭" @click="clearSelection">×</button>
            </div>
            <h2 class="sheet__title">{{ selected.label }}</h2>
            <p v-if="selected.dusty" class="dust">
              <span class="dust__dot" aria-hidden="true" />
              蒙尘 · 已 {{ selected.ageDays }} 天未推送
            </p>
            <p class="sheet__blurb">{{ selected.blurb }}</p>

            <!-- 打开的书：案头 / 开卷 / 笔记 -->
            <div v-if="selected.kind === 'book'" class="book">
              <div class="book__page">
                <p class="book__cap">书中写着</p>
                <p class="book__project">{{ selected.projectTitle || selected.label }}</p>
                <p v-if="selected.projectSubtitle" class="book__sub">{{ selected.projectSubtitle }}</p>
                <p v-if="selected.noteSlug" class="book__note">相关笔记 · {{ selected.noteSlug }}</p>
                <div v-if="selected.storyTo" class="book__open">
                  <p class="book__open-hint">
                    {{ lampOn ? '灯亮着，可以开卷。' : '先点亮台灯，再开卷。' }}
                  </p>
                  <div class="book__open-actions">
                    <button
                      type="button"
                      class="cta"
                      @click="openStory(selected)"
                    >
                      {{ lampOn ? '点灯开卷' : '点灯 · 开卷' }}
                      <span aria-hidden="true">→</span>
                    </button>
                    <RouterLink v-if="selected.to" class="book__desk-link" :to="selected.to">
                      入案头
                    </RouterLink>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="selected.id === 'monitor' && monitorOn" class="screen">
              <p class="screen__cap">显示器 · 在线</p>
              <RouterLink
                v-for="p in featuredProjects"
                :key="p.slug"
                :to="`/projects/${p.slug}`"
                class="screen__row"
              >
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

            <div v-if="selected.to" class="sheet__cta-row">
              <button type="button" class="cta" @click="goSelected">
                {{ selected.cta || '打开' }}
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </article>
        </Transition>

        <Transition name="sheet">
          <article v-if="easterOpen" key="e" class="sheet sheet--quote">
            <div class="sheet__eyebrow">
              <span>彩蛋</span>
              <button type="button" class="sheet__x" aria-label="关闭" @click="clearSelection">×</button>
            </div>
            <h2 class="sheet__title">{{ selected?.label }}</h2>
            <p class="sheet__quote">{{ selected?.blurb }}</p>
          </article>
        </Transition>

        <!-- 书架挂画：轻量星图（节点=旗舰/产品，点击进档案或案头） -->
        <Transition name="sheet">
          <article v-if="atlasOpen" key="atlas" class="sheet sheet--atlas">
            <div class="sheet__eyebrow">
              <span>挂画 · 星图</span>
              <button type="button" class="sheet__x" aria-label="关闭" @click="clearSelection">×</button>
            </div>
            <h2 class="sheet__title">墙上那幅星图</h2>
            <p class="sheet__blurb">按层级点选节点；列表仍是主路径。</p>
            <div class="atlas">
              <svg class="atlas__svg" viewBox="0 0 360 160" role="img" aria-label="项目星图">
                <line
                  v-for="p in atlasNodes"
                  :key="'l' + p.slug"
                  :x1="180"
                  y1="80"
                  :x2="p.x"
                  :y2="p.y"
                  stroke="#d6d5ce"
                  stroke-width="1"
                />
                <g
                  v-for="p in atlasNodes"
                  :key="p.slug"
                  class="atlas__node"
                  tabindex="0"
                  role="link"
                  :aria-label="p.title"
                  @click="goAtlas(p)"
                  @keydown.enter="goAtlas(p)"
                >
                  <circle :cx="p.x" :cy="p.y" :r="p.r" :fill="p.fill" stroke="#b05c3a" stroke-width="1" />
                  <text :x="p.x" :y="p.y + p.r + 12" text-anchor="middle" class="atlas__label">
                    {{ p.title }}
                  </text>
                </g>
                <circle cx="180" cy="80" r="6" fill="#b05c3a" />
                <text x="180" y="100" text-anchor="middle" class="atlas__label">Yuer</text>
              </svg>
              <ul class="atlas__legend">
                <li v-for="p in atlasNodes" :key="p.slug">
                  <RouterLink :to="p.to">{{ p.title }}</RouterLink>
                  <span>{{ p.tier }}</span>
                </li>
              </ul>
              <RouterLink class="atlas__all" to="/w/works">作品斋 →</RouterLink>
            </div>
          </article>
        </Transition>

        <!-- 索引 dock：横向一行，不遮挡书架与窗 -->
        <Transition name="dock">
          <nav v-if="catalogOpen && stageReady" class="dock" aria-label="屋里有什么" @wheel="onDockWheel">
            <div class="dock__group">
              <span class="dock__cap">物件</span>
              <ul class="dock__list">
                <li v-for="item in propsItems" :key="item.id">
                  <button
                    type="button"
                    class="dock__item"
                    :class="{ 'is-on': selected?.id === item.id }"
                    :title="item.blurb"
                    @click="pickFromCatalog(item)"
                  >
                    {{ item.label }}
                  </button>
                </li>
              </ul>
            </div>
            <span class="dock__sep" aria-hidden="true" />
            <div class="dock__group">
              <span class="dock__cap">书本</span>
              <ul class="dock__list">
                <li v-for="item in bookItems" :key="item.id">
                  <button
                    type="button"
                    class="dock__item"
                    :class="{ 'is-on': selected?.id === item.id, 'is-dusty': item.dusty }"
                    :title="item.dusty ? `${item.blurb || ''}（蒙尘 ${item.ageDays} 天）` : item.blurb"
                    @click="pickFromCatalog(item)"
                  >
                    {{ item.label }}
                    <span v-if="item.dusty" class="dock__dust" aria-hidden="true" />
                  </button>
                </li>
                <li v-if="foldedShelfCount">
                  <button
                    type="button"
                    class="dock__item dock__more"
                    :title="shelfExpanded ? '收起书架' : '展开书架上的全部 18 本'"
                    @click="shelfExpanded = !shelfExpanded"
                  >
                    {{ shelfExpanded ? '收起书架' : `书架 +${foldedShelfCount}` }}
                  </button>
                </li>
              </ul>
            </div>
          </nav>
        </Transition>
      </div>
    </main>

    <!-- 悬停纸签：钉在指针所指的物件旁边，永远朝屏幕、永远清晰。
         书脊只有 1.7cm 宽，刻字在默认机位下不到 10px —— 真正能"认书"的是这张纸签 -->
    <Transition name="tag">
      <div
        v-if="hoverTag"
        class="tag"
        :class="{ 'tag--book': hoverTag.kind === 'book' }"
        :style="{ left: hoverTag.x + 'px', top: hoverTag.y + 'px' }"
      >
        <span class="tag__kind">{{ KIND_LABEL[hoverTag.kind] || '物件' }}</span>
        <span class="tag__label">{{ hoverTag.label }}</span>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.room {
  --ink: #2c241c;
  --paper: #f7f1e6;
  margin-inline: calc(50% - 50vw);
  width: 100vw;
  height: 100vh;
  height: 100dvh;
  overflow: hidden;
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

/* 2D 降级说明条 */
.fallback {
  position: fixed;
  inset: 0 0 auto 0;
  z-index: 30;
  padding: 72px 24px 24px;
  pointer-events: none;
  display: grid;
  place-items: center;
}
.fallback__inner {
  pointer-events: auto;
  max-width: 480px;
  padding: 20px 22px;
  border-radius: 12px;
  background: rgba(247, 241, 230, 0.92);
  border: 1px solid #d6c4b0;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.25);
  color: var(--ink);
}
.fallback__kicker {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.12em;
  color: #b05c3a;
}
.fallback__title {
  margin-top: 6px;
  font-family: var(--font-display);
  font-size: 20px;
}
.fallback__desc {
  margin-top: 8px;
  font-size: 13px;
  color: #6a5a48;
  line-height: 1.6;
}
.fallback__links {
  margin-top: 14px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  font-family: var(--font-mono);
  font-size: 12px;
}
.fallback__links a {
  color: #b05c3a;
  text-decoration: none;
  border: 1px solid #b05c3a;
  border-radius: 999px;
  padding: 4px 10px;
}
.fallback__links a:hover {
  background: #f6e9e1;
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
  height: 100vh;
  height: 100dvh;
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

/* 顶部进度细线 */
.progress {
  position: absolute;
  z-index: 20;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: rgba(245, 234, 216, 0.08);
}
.progress span {
  display: block;
  height: 100%;
  transform-origin: left center;
  background: #c47850;
  transition: transform 0.45s var(--ease-standard);
}

/* HUD：只占两端 */
.hud {
  position: absolute;
  z-index: 10;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 16px;
  pointer-events: none;
  color: #f5ead8;
}
.hud > * {
  pointer-events: auto;
}
.hud__back {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-mono);
  font-size: 12px;
  padding: 8px 14px;
  border-radius: 999px;
  border: 1px solid rgba(245, 234, 216, 0.2);
  background: rgba(20, 14, 8, 0.42);
  color: #f5ead8;
  cursor: pointer;
  backdrop-filter: blur(10px);
  transition:
    border-color 0.2s,
    background 0.2s;
}
.hud__back:hover {
  border-color: rgba(224, 160, 112, 0.7);
  background: rgba(60, 40, 24, 0.6);
}
.hud__actions {
  display: flex;
  align-items: center;
  gap: 8px;
}
.hud__btn {
  font-family: var(--font-mono);
  font-size: 12px;
  padding: 8px 14px;
  border-radius: 999px;
  border: 1px solid rgba(245, 234, 216, 0.2);
  background: rgba(20, 14, 8, 0.42);
  color: #f5ead8;
  cursor: pointer;
  text-decoration: none;
  backdrop-filter: blur(10px);
  transition:
    border-color 0.2s,
    background 0.2s;
}
.hud__btn:hover {
  border-color: rgba(224, 160, 112, 0.7);
  background: rgba(60, 40, 24, 0.6);
}
.hud__btn--on {
  border-color: #c47850;
  background: rgba(196, 120, 80, 0.28);
  color: #ffd2b0;
}

/* 底部区：dock + 信息条共用一个列，居中贴底 */
.bottom {
  position: absolute;
  z-index: 12;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 0 16px 16px;
  pointer-events: none;
}
.bottom > * {
  pointer-events: auto;
}
/* 走近书架时信息卡靠右：镜头正对着的那本书在画面中央，
   卡片居中会正好把它盖住（实测：卡片 560px 宽，压住整条书脊） */
.bottom--shelf {
  align-items: flex-end;
}
.bottom--shelf .dock {
  align-self: center;
}

/* 索引 dock */
.dock {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 8px 12px;
  max-width: min(100%, 1180px);
  padding: 9px 18px;
  border-radius: 16px;
  background: rgba(18, 12, 8, 0.55);
  border: 1px solid rgba(245, 234, 216, 0.1);
  backdrop-filter: blur(14px);
  color: #f5ead8;
  /* 单个分组仍宽于容器时（窄桌面）允许横滚，避免内容戳出背景框 */
  overflow-x: auto;
  overscroll-behavior-x: contain;
  scrollbar-width: none;
}
.dock::-webkit-scrollbar {
  display: none;
}
.dock__group {
  display: flex;
  align-items: center;
  gap: 7px;
  flex-shrink: 0;
}
.dock__cap {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #c9a888;
  flex-shrink: 0;
}
.dock__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
  gap: 5px;
}
.dock__list > li {
  flex-shrink: 0;
}
.dock__sep {
  width: 1px;
  height: 20px;
  background: rgba(245, 234, 216, 0.14);
  flex-shrink: 0;
}
.dock__item {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-family: var(--font-mono);
  font-size: 12px;
  padding: 7px 11px;
  border-radius: 999px;
  border: 1px solid rgba(245, 234, 216, 0.12);
  background: rgba(20, 14, 8, 0.35);
  color: #e8dcc8;
  cursor: pointer;
  white-space: nowrap;
  transition:
    background 0.18s,
    border-color 0.18s,
    color 0.18s;
}
.dock__item:hover {
  background: rgba(196, 120, 80, 0.24);
  border-color: rgba(196, 120, 80, 0.5);
  color: #ffd2b0;
}
.dock__item.is-on {
  background: rgba(196, 120, 80, 0.34);
  border-color: #c47850;
  color: #ffd2b0;
}
.dock__item.is-dusty {
  color: #b8a898;
}
.dock__more {
  border-style: dashed;
  color: #c9a888;
}
.dock__dust {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #a09080;
}
.dock-enter-active,
.dock-leave-active {
  transition:
    opacity 0.28s var(--ease-standard),
    transform 0.28s var(--ease-standard);
}
.dock-enter-from,
.dock-leave-to {
  opacity: 0;
  transform: translateY(14px);
}

/* 检视信息条 */
.sheet {
  width: min(560px, 100%);
  max-height: min(46dvh, 360px);
  overflow: auto;
  padding: 18px 20px 16px;
  border-radius: 16px;
  background: linear-gradient(160deg, rgba(255, 248, 236, 0.97), rgba(242, 230, 210, 0.95));
  border: 1px solid rgba(80, 50, 28, 0.12);
  box-shadow: 0 20px 44px rgba(0, 0, 0, 0.38);
  color: var(--ink);
}
.sheet--quote {
  background: linear-gradient(160deg, rgba(255, 244, 228, 0.98), rgba(248, 228, 200, 0.96));
}
.sheet--book {
  border-color: rgba(176, 92, 58, 0.28);
}
.sheet__eyebrow {
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
.sheet__x {
  border: none;
  background: transparent;
  font-size: 20px;
  line-height: 1;
  color: #a09080;
  cursor: pointer;
}
.sheet__x:hover {
  color: var(--ink);
}
.sheet__title {
  margin: 0 0 8px;
  font-family: var(--font-display);
  font-size: 22px;
  font-weight: 600;
  letter-spacing: 0.01em;
}
.sheet__blurb {
  margin: 0 0 12px;
  font-size: 14px;
  line-height: 1.65;
  color: #5c5044;
}
.sheet__quote {
  margin: 0;
  font-family: var(--font-display);
  font-size: 17px;
  font-style: italic;
  line-height: 1.6;
  color: #3a3028;
}
.sheet__cta-row {
  margin-top: 4px;
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
.book__open {
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px dashed #d6c4b0;
}
.book__open-hint {
  margin: 0 0 10px;
  font-family: var(--font-mono);
  font-size: 12px;
  color: #6a5a48;
}
.book__open-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
}
.book__desk-link {
  font-family: var(--font-mono);
  font-size: 12px;
  color: #b05c3a;
  text-decoration: none;
}
.book__desk-link:hover {
  text-decoration: underline;
}
.sheet--atlas {
  max-width: 420px;
}
.atlas__svg {
  width: 100%;
  height: auto;
  margin-top: 8px;
  background: #fffcf6;
  border: 1px solid #e8e8e4;
  border-radius: 8px;
}
.atlas__label {
  font-family: ui-monospace, Consolas, monospace;
  font-size: 10px;
  fill: #6a5a48;
}
.atlas__node {
  cursor: pointer;
}
.atlas__node:hover circle,
.atlas__node:focus-visible circle {
  stroke-width: 2;
}
.atlas__legend {
  list-style: none;
  margin: 12px 0 0;
  padding: 0;
  display: grid;
  gap: 6px;
}
.atlas__legend li {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  font-family: ui-monospace, Consolas, monospace;
  font-size: 12px;
}
.atlas__legend a {
  color: #b05c3a;
  text-decoration: none;
}
.atlas__all {
  display: inline-block;
  margin-top: 10px;
  font-family: ui-monospace, Consolas, monospace;
  font-size: 12px;
  color: #b05c3a;
  text-decoration: none;
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

.sheet-enter-active {
  transition:
    opacity 0.32s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.32s cubic-bezier(0.22, 1, 0.36, 1);
}
.sheet-leave-active {
  transition:
    opacity 0.18s,
    transform 0.18s;
}
.sheet-enter-from {
  opacity: 0;
  transform: translateY(18px) scale(0.98);
}
.sheet-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* 悬停纸签：钉在指针所指的物件旁边。任意距离、任意视角都读得清，
   "书脊上刻的字"只负责凑近时的仪式感 */
.tag {
  position: fixed;
  z-index: 18;
  display: flex;
  align-items: baseline;
  gap: 9px;
  max-width: min(300px, 60vw);
  padding: 8px 14px;
  border-radius: 10px;
  background: rgba(18, 12, 8, 0.78);
  border: 1px solid rgba(245, 234, 216, 0.14);
  backdrop-filter: blur(10px);
  color: #f5ead8;
  pointer-events: none;
  font-family: var(--font-mono);
  /* 指针移动时纸签平滑跟随，不闪跳 */
  transition:
    left 0.12s linear,
    top 0.12s linear;
}
.tag--book {
  background: rgba(58, 38, 20, 0.86);
  border-color: rgba(214, 166, 110, 0.42);
}
.tag__kind {
  font-size: 10px;
  letter-spacing: 0.1em;
  color: #d0a888;
  flex-shrink: 0;
}
.tag__label {
  font-size: 13px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.tag-enter-active,
.tag-leave-active {
  transition: opacity 0.16s;
}
.tag-enter-from,
.tag-leave-to {
  opacity: 0;
}

/* 引导：贴 HUD 下沿，不再压画面中心 */
.hint {
  position: absolute;
  z-index: 14;
  left: 50%;
  top: 62px;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 12px;
  max-width: min(420px, calc(100% - 32px));
  padding: 12px 16px;
  border-radius: 14px;
  border: 1px solid rgba(196, 120, 80, 0.4);
  background: rgba(28, 18, 10, 0.8);
  backdrop-filter: blur(12px);
  color: #f5ead8;
  cursor: pointer;
  font-size: 13px;
  line-height: 1.5;
  box-shadow: 0 16px 32px rgba(0, 0, 0, 0.32);
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
.hint-enter-active {
  transition:
    opacity 0.4s var(--ease-standard),
    transform 0.4s var(--ease-standard);
}
.hint-leave-active {
  transition:
    opacity 0.25s,
    transform 0.25s;
}
.hint-enter-from {
  opacity: 0;
  transform: translateX(-50%) translateY(-8px);
}
.hint-leave-to {
  opacity: 0;
  transform: translateX(-50%) scale(0.97);
}

/* 窄屏：dock 保持可用并横向滚动，info 条铺满宽度 */
@media (max-width: 860px) {
  .hud {
    padding: 12px;
  }
  .hud__back span {
    display: none;
  }
  .hud__btn {
    padding: 7px 11px;
  }
  .dock {
    /* 窄屏放不下就回到单行横向滚动，而不是把画面挤成一摞 */
    flex-wrap: nowrap;
    justify-content: flex-start;
    max-width: 100%;
    overflow-x: auto;
    overscroll-behavior-x: contain;
    border-radius: 14px;
    padding: 8px 12px;
  }
  .sheet {
    width: 100%;
    max-height: 52dvh;
  }
  .hint {
    top: 58px;
    font-size: 12px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .room,
  .boot__inner,
  .boot__bar span,
  .hud,
  .dock,
  .hint,
  .sheet,
  .peek,
  .progress span,
  .fallback__inner {
    animation: none !important;
    transition: none !important;
  }
}
</style>
