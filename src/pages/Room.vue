<script setup>
// /room —— 纸感工作室门厅（15 Wave 3.A）：多场景 + 热区；列表旁路保留
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import RoomHotspot from '@/components/features/room/RoomHotspot.vue'
import { room as roomConfig, githubData, site } from '@/utils/content.js'
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

const onLabels = computed(() =>
  hotspots.value.filter((h) => isOn(h)).map((h) => `${h.label}已唤醒`)
)

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
      <img
        v-if="sceneImage"
        class="room-art"
        :src="sceneImage"
        :alt="`${scene?.title || ''}场景插画`"
        width="2048"
        height="1152"
        decoding="async"
      />
      <div v-else class="room-art room-art--fallback" aria-hidden="true" />

      <RoomHotspot
        v-for="h in hotspots"
        :key="h.id"
        :hotspot="h"
        :active="activeHotspot === h.id || isOn(h)"
        @activate="activate"
      />

      <!-- 物件状态提示（终端亮起等） -->
      <div v-if="onLabels.length" class="room-state-chip" aria-live="polite">
        {{ onLabels.join(' · ') }}
      </div>

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
  object-fit: cover;
  object-position: center;
}
.room-art--fallback {
  background: var(--color-surface-muted);
}
.room-state-chip {
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
