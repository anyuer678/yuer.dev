<script setup>
// /room —— 纸感工作室门厅（15 Wave 3.A）：多场景 + 热区；列表旁路保留
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import RoomHotspot from '@/components/features/room/RoomHotspot.vue'
import { room as roomConfig, githubData, site } from '@/utils/content.js'
import { setTitle, setDescription } from '@/utils/seo.js'

const route = useRoute()
const router = useRouter()

const scenes = computed(() => roomConfig?.scenes ?? [])
const sceneIds = computed(() => scenes.value.map((s) => s.id))

const activeScene = computed(() => {
  const q = route.query.scene
  return sceneIds.value.includes(q) ? q : sceneIds.value[0] || 'desk'
})

const scene = computed(() => scenes.value.find((s) => s.id === activeScene.value))
const hotspots = computed(() => scene.value?.hotspots ?? [])

/** 物件状态（session 记忆，可重置） */
const states = ref({})
watch(
  scenes,
  (list) => {
    const next = {}
    for (const s of list) {
      for (const h of s.hotspots) {
        if (!h.stateful) continue
        const key = `${s.id}:${h.id}`
        const saved = sessionStorage.getItem(`room:${key}`)
        next[key] = saved || h.defaultState || 'closed'
      }
    }
    states.value = next
  },
  { immediate: true }
)

function setScene(id) {
  router.replace({ query: { ...route.query, scene: id === sceneIds.value[0] ? undefined : id } })
}

const activeHotspot = ref(null)
const easter = ref('')

function activate(h) {
  if (h.stateful) {
    const key = `${activeScene.value}:${h.id}`
    const cur = states.value[key] || h.defaultState || 'closed'
    const next = cur === 'open' || cur === 'on' ? (cur === 'on' ? 'off' : 'closed') : cur === 'off' ? 'on' : 'open'
    states.value = { ...states.value, [key]: next }
    sessionStorage.setItem(`room:${key}`, next)
  }

  if (h.overlay === 'easter') {
    easter.value = h.blurb || site?.philosophy || ''
    activeHotspot.value = h.id
    return
  }
  if (h.overlay === 'pulse') {
    activeHotspot.value = activeHotspot.value === h.id ? null : h.id
    return
  }

  if (h.to) {
    router.push(h.to)
  } else {
    activeHotspot.value = activeHotspot.value === h.id ? null : h.id
  }
}

function isOn(h) {
  if (!h.stateful) return false
  const s = states.value[`${activeScene.value}:${h.id}`]
  return s === 'open' || s === 'on'
}

const pulseRepos = computed(() => {
  const repos = Object.values(githubData.repos || {})
  return repos
    .filter((r) => r.pushed_at)
    .sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at))
    .slice(0, 5)
})

const blurb = computed(() => {
  if (activeHotspot.value) {
    const h = hotspots.value.find((x) => x.id === activeHotspot.value)
    if (h?.blurb) return h.blurb
  }
  return scene.value?.blurb || ''
})

setTitle(`工作室 · ${site?.name || 'Yuer'}`)
setDescription('走进纸感工作室：书桌、书架与窗边，藏着项目、笔记与时间线。')
</script>

<template>
  <div class="room-root container">
    <header class="room-head">
      <div>
        <p class="room-kicker">Studio</p>
        <h1>工作室</h1>
        <p class="room-sub">点一点桌上的东西——内容也都在导航里。</p>
      </div>
      <nav class="room-scenes" aria-label="场景">
        <button
          v-for="s in scenes"
          :key="s.id"
          type="button"
          class="room-scenes__btn"
          :class="{ 'room-scenes__btn--on': s.id === activeScene }"
          :aria-current="s.id === activeScene ? 'page' : undefined"
          @click="setScene(s.id)"
        >
          {{ s.title }}
        </button>
      </nav>
    </header>

    <div class="room-stage" :data-scene="activeScene">
      <!-- 纸感插画底：SVG 分层，无外链资源 -->
      <svg
        class="room-art"
        viewBox="0 0 960 540"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        focusable="false"
      >
        <rect width="960" height="540" fill="#f3f2ec" />
        <!-- 墙 -->
        <rect x="0" y="0" width="960" height="360" fill="#fafaf8" />
        <line x1="0" y1="360" x2="960" y2="360" stroke="#e8e8e4" stroke-width="2" />
        <!-- 地板 -->
        <rect x="0" y="360" width="960" height="180" fill="#ebe8df" />

        <template v-if="activeScene === 'desk'">
          <!-- 窗 -->
          <rect x="380" y="40" width="200" height="140" rx="6" fill="#e8eef2" stroke="#d6d5ce" />
          <line x1="480" y1="40" x2="480" y2="180" stroke="#d6d5ce" />
          <line x1="380" y1="110" x2="580" y2="110" stroke="#d6d5ce" />
          <!-- 相框 -->
          <rect x="60" y="100" width="100" height="120" rx="4" fill="#fff" stroke="#d6d5ce" />
          <rect x="72" y="112" width="76" height="70" fill="#f6e9e1" />
          <!-- 书桌 -->
          <rect x="120" y="300" width="720" height="24" rx="4" fill="#c4a882" />
          <rect x="140" y="324" width="24" height="120" fill="#b0956f" />
          <rect x="796" y="324" width="24" height="120" fill="#b0956f" />
          <!-- 笔记本 -->
          <g :opacity="isOn(hotspots[0]) ? 1 : 0.92">
            <rect x="180" y="250" width="160" height="50" rx="3" fill="#fff" stroke="#d6d5ce" />
            <line x1="260" y1="250" x2="260" y2="300" stroke="#e8e8e4" />
            <path v-if="isOn(hotspots[0])" d="M260 250 L300 230 L300 280 L260 300 Z" fill="#fafaf8" stroke="#d6d5ce" />
          </g>
          <!-- 终端 -->
          <rect x="480" y="200" width="240" height="100" rx="6" fill="#1f1f1d" />
          <rect x="492" y="212" width="216" height="76" rx="3" :fill="isOn(hotspots[1]) ? '#2a3a2e' : '#2a2a28'" />
          <text v-if="isOn(hotspots[1])" x="504" y="248" fill="#b05c3a" font-family="monospace" font-size="14">~/projects $</text>
          <text v-else x="504" y="248" fill="#6e6e68" font-family="monospace" font-size="14">sleep</text>
          <!-- 便签 -->
          <rect x="780" y="270" width="90" height="70" rx="2" fill="#f6e9e1" stroke="#e8d5c8" transform="rotate(-4 825 305)" />
          <!-- 杯子 -->
          <rect x="880" y="270" width="40" height="48" rx="4" fill="#fff" stroke="#d6d5ce" />
          <path d="M920 280 h16 a12 12 0 0 1 0 24 h-16" fill="none" stroke="#d6d5ce" stroke-width="3" />
        </template>

        <template v-else-if="activeScene === 'shelf'">
          <rect x="80" y="60" width="800" height="28" fill="#c4a882" />
          <rect x="80" y="160" width="800" height="28" fill="#c4a882" />
          <rect x="80" y="260" width="800" height="28" fill="#c4a882" />
          <!-- 书脊示意 -->
          <rect v-for="i in 12" :key="'a'+i" :x="100 + (i-1)*60" y="90" width="40" height="70" rx="2" :fill="i%3===0 ? '#b05c3a' : i%2===0 ? '#6e6e68' : '#d6d5ce'" />
          <rect v-for="i in 10" :key="'b'+i" :x="110 + (i-1)*70" y="190" width="48" height="70" rx="2" fill="#fafaf8" stroke="#d6d5ce" />
          <rect x="120" y="290" width="200" height="50" rx="4" fill="#fff" stroke="#d6d5ce" />
          <text x="140" y="322" fill="#6e6e68" font-family="monospace" font-size="14">lab drawer</text>
        </template>

        <template v-else>
          <!-- 窗边 -->
          <rect x="140" y="40" width="680" height="280" rx="8" fill="#dfe8ee" stroke="#d6d5ce" stroke-width="3" />
          <line x1="480" y1="40" x2="480" y2="320" stroke="#d6d5ce" stroke-width="3" />
          <line x1="140" y1="180" x2="820" y2="180" stroke="#d6d5ce" stroke-width="3" />
          <circle cx="700" cy="100" r="36" fill="#f6e9e1" />
          <rect x="300" y="400" width="360" height="20" rx="3" fill="#c4a882" />
        </template>
      </svg>

      <RoomHotspot
        v-for="h in hotspots"
        :key="h.id"
        :hotspot="h"
        :active="activeHotspot === h.id || isOn(h)"
        @activate="activate"
      />

      <!-- 浮层：彩蛋 / Pulse -->
      <div v-if="easter || activeHotspot === 'sky'" class="room-float">
        <template v-if="easter">
          <p class="room-float__label">咖啡因语录</p>
          <p class="room-float__text">{{ easter }}</p>
          <button type="button" class="room-float__close" @click="easter = ''; activeHotspot = null">关闭</button>
        </template>
        <template v-else>
          <p class="room-float__label">窗外 · 最近</p>
          <ul class="room-float__list">
            <li v-for="r in pulseRepos" :key="r.name">
              <RouterLink v-if="r.slug" :to="`/projects/${r.slug}`">{{ r.name }}</RouterLink>
              <a
                v-else
                :href="`https://github.com/${githubData.user || 'anyuer678'}/${r.name}`"
                target="_blank"
                rel="noopener noreferrer"
              >{{ r.name }}</a>
              <span v-if="r.release" class="room-float__meta">{{ r.release }}</span>
            </li>
          </ul>
          <button type="button" class="room-float__close" @click="activeHotspot = null">关闭</button>
        </template>
      </div>
    </div>

    <p class="room-blurb" aria-live="polite">{{ blurb }}</p>

    <footer class="room-foot">
      <RouterLink class="room-list-link" :to="roomConfig?.listFallbackHref || '/projects'">
        以列表浏览全部项目 →
      </RouterLink>
      <p class="room-hint">键盘：Tab 可聚焦物件；Enter 打开。手机可点选，无需拖拽。</p>
    </footer>
  </div>
</template>

<style scoped>
.room-root {
  padding-block: var(--space-8) var(--space-16);
}
.room-head {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--space-4);
  margin-bottom: var(--space-6);
}
.room-kicker {
  font-family: var(--font-mono);
  font-size: var(--text-caption);
  color: var(--color-accent);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin: 0;
}
.room-head h1 {
  font-family: var(--font-display);
  font-size: var(--text-h1);
  line-height: var(--lh-h1);
  margin: var(--space-1) 0;
}
.room-sub {
  margin: 0;
  font-size: var(--text-small);
  color: var(--color-text-secondary);
}
.room-scenes {
  display: flex;
  gap: var(--space-2);
}
.room-scenes__btn {
  font-family: var(--font-mono);
  font-size: var(--text-caption);
  padding: var(--space-2) var(--space-4);
  border: var(--border-default);
  border-radius: 999px;
  background: var(--color-surface);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition:
    color var(--dur-fast) var(--ease-standard),
    border-color var(--dur-fast) var(--ease-standard),
    background var(--dur-fast) var(--ease-standard);
}
.room-scenes__btn:hover {
  color: var(--color-accent);
  border-color: var(--color-accent);
}
.room-scenes__btn--on {
  background: var(--color-accent-soft);
  border-color: var(--color-accent);
  color: var(--color-accent);
}
.room-stage {
  position: relative;
  border: var(--border-default);
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: var(--color-surface-muted);
  box-shadow: var(--shadow-card);
  aspect-ratio: 16 / 9;
}
.room-art {
  display: block;
  width: 100%;
  height: 100%;
}
.room-float {
  position: absolute;
  z-index: 3;
  right: var(--space-4);
  top: var(--space-4);
  width: min(280px, 70%);
  padding: var(--space-4);
  background: var(--color-surface);
  border: var(--border-default);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-card-hover);
}
.room-float__label {
  margin: 0 0 var(--space-2);
  font-family: var(--font-mono);
  font-size: var(--text-caption);
  color: var(--color-accent);
}
.room-float__text {
  margin: 0 0 var(--space-3);
  font-size: var(--text-small);
  color: var(--color-text);
  line-height: var(--lh-small);
}
.room-float__list {
  list-style: none;
  margin: 0 0 var(--space-3);
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  font-size: var(--text-small);
}
.room-float__list a {
  color: var(--color-text);
}
.room-float__list a:hover {
  color: var(--color-accent);
}
.room-float__meta {
  margin-left: var(--space-2);
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--color-text-tertiary);
}
.room-float__close {
  font-size: var(--text-caption);
  color: var(--color-text-secondary);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  text-decoration: underline;
  text-underline-offset: 3px;
}
.room-blurb {
  margin: var(--space-4) 0 0;
  font-size: var(--text-small);
  color: var(--color-text-secondary);
  min-height: 1.6em;
}
.room-foot {
  margin-top: var(--space-8);
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
}
.room-list-link {
  font-family: var(--font-mono);
  font-size: var(--text-small);
  color: var(--color-accent);
  text-decoration: none;
}
.room-list-link:hover {
  text-decoration: underline;
  text-underline-offset: 3px;
}
.room-hint {
  margin: 0;
  font-size: var(--text-caption);
  color: var(--color-text-tertiary);
}
@media (max-width: 640px) {
  .room-stage {
    aspect-ratio: 4 / 3;
  }
  .room-float {
    left: var(--space-3);
    right: var(--space-3);
    width: auto;
  }
}
</style>
