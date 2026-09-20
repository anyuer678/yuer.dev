<script setup>
// /bench 工具工作台 — 书房终端入口；命令仅展示可复制，不真实执行（15 §3.D）
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import bench from '@/content/bench.json'
import { site } from '@/utils/content.js'
import { setDescription, setTitle } from '@/utils/seo.js'
import ExternalLink from '@/components/ui/ExternalLink.vue'

const route = useRoute()
const router = useRouter()
const tools = computed(() => bench.tools || [])
const groups = computed(() => {
  const m = new Map()
  for (const t of tools.value) {
    const g = t.group || '其他'
    if (!m.has(g)) m.set(g, [])
    m.get(g).push(t)
  }
  return [...m.entries()]
})

const activeGroup = computed(() => String(route.query.group ?? ''))
const activeId = computed(() => String(route.query.tool ?? ''))

const visibleTools = computed(() => {
  if (!activeGroup.value) return tools.value
  return tools.value.filter((t) => t.group === activeGroup.value)
})

const activeTool = computed(
  () => tools.value.find((t) => t.id === activeId.value) || visibleTools.value[0] || tools.value[0]
)

const copied = ref('')
function copyText(text, key) {
  if (!text) return
  const done = () => {
    copied.value = key
    window.setTimeout(() => {
      if (copied.value === key) copied.value = ''
    }, 1600)
  }
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(text).then(done).catch(() => fallbackCopy(text, done))
  } else fallbackCopy(text, done)
}
function fallbackCopy(text, done) {
  const ta = document.createElement('textarea')
  ta.value = text
  ta.setAttribute('readonly', '')
  ta.style.position = 'fixed'
  ta.style.left = '-9999px'
  document.body.appendChild(ta)
  ta.select()
  try {
    document.execCommand('copy')
    done()
  } catch {
    /* ignore */
  }
  document.body.removeChild(ta)
}

function setQuery(patch) {
  const query = { ...route.query, ...patch }
  for (const k of Object.keys(query)) if (!query[k]) delete query[k]
  router.replace({ query })
}

onMounted(() => {
  setTitle(`工作台 · ${site?.name || 'Yuer'}`)
  setDescription('CLI 与本地工具墙：安装命令与示例可复制，详情进项目档案。')
})
</script>

<template>
  <div class="container bench">
    <header class="bench__head">
      <div>
        <p class="bench__kicker">Bench · 工具工作台</p>
        <h1 class="bench__title">纸面终端</h1>
        <p class="bench__desc">
          书房键盘推过来的工具墙。这里只展示命令，不会在你机器上执行任何东西。
        </p>
      </div>
      <div class="bench__nav">
        <RouterLink to="/room">← 回工作室</RouterLink>
        <RouterLink to="/lab">实验室</RouterLink>
        <RouterLink to="/garden">花庭</RouterLink>
      </div>
    </header>

    <div class="bench__layout">
      <aside class="bench__side">
        <button
          type="button"
          class="bench__filter"
          :class="{ 'is-on': !activeGroup }"
          @click="setQuery({ group: '', tool: '' })"
        >
          全部
        </button>
        <button
          v-for="[name] in groups"
          :key="name"
          type="button"
          class="bench__filter"
          :class="{ 'is-on': activeGroup === name }"
          @click="setQuery({ group: name, tool: '' })"
        >
          {{ name }}
        </button>
        <ul class="bench__list">
          <li v-for="t in visibleTools" :key="t.id">
            <button
              type="button"
              class="bench__item"
              :class="{ 'is-on': activeTool?.id === t.id }"
              @click="setQuery({ tool: t.id })"
            >
              <span class="bench__item-name">{{ t.name }}</span>
              <span class="bench__item-lang">{{ t.lang }}</span>
              <span class="bench__item-line">{{ t.oneLiner }}</span>
            </button>
          </li>
        </ul>
      </aside>

      <section v-if="activeTool" class="bench__panel" aria-live="polite">
        <header class="bench__panel-head">
          <div>
            <p class="bench__panel-group">{{ activeTool.group }}</p>
            <h2 class="bench__panel-title">{{ activeTool.name }}</h2>
          </div>
          <div class="bench__panel-links">
            <RouterLink v-if="activeTool.to" :to="activeTool.to">项目档案</RouterLink>
            <ExternalLink v-if="activeTool.repo" :href="activeTool.repo">GitHub</ExternalLink>
          </div>
        </header>
        <p class="bench__panel-desc">{{ activeTool.oneLiner }}</p>

        <div class="term">
          <div class="term__bar">
            <span /> <span /> <span />
            <em>paper-terminal</em>
          </div>
          <div class="term__body">
            <p class="term__cap"># 安装 / 获取</p>
            <div class="term__row">
              <code>{{ activeTool.install }}</code>
              <button
                type="button"
                class="term__copy"
                @click="copyText(activeTool.install, 'install')"
              >
                {{ copied === 'install' ? '已复制' : '复制' }}
              </button>
            </div>
            <p class="term__cap"># 示例</p>
            <div class="term__row">
              <code>{{ activeTool.example }}</code>
              <button
                type="button"
                class="term__copy"
                @click="copyText(activeTool.example, 'example')"
              >
                {{ copied === 'example' ? '已复制' : '复制' }}
              </button>
            </div>
            <p class="term__note">仅展示 · 非真实终端执行</p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.bench {
  padding-block: var(--space-8) var(--space-16);
}
.bench__head {
  display: flex;
  justify-content: space-between;
  gap: var(--space-6);
  flex-wrap: wrap;
  margin-bottom: var(--space-8);
  padding-bottom: var(--space-6);
  border-bottom: var(--border-default);
}
.bench__kicker {
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.12em;
  color: var(--color-accent);
}
.bench__title {
  margin-top: var(--space-2);
  font-family: var(--font-display);
  font-size: var(--text-h1);
  line-height: var(--lh-h1);
}
.bench__desc {
  margin-top: var(--space-3);
  color: var(--color-text-secondary);
  max-width: 48ch;
  font-size: var(--text-small);
}
.bench__nav {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  font-family: var(--font-mono);
  font-size: var(--text-caption);
  align-items: flex-start;
}
.bench__nav a {
  color: var(--color-text-secondary);
  text-decoration: none;
}
.bench__nav a:hover {
  color: var(--color-accent);
}
.bench__layout {
  display: grid;
  grid-template-columns: minmax(200px, 280px) 1fr;
  gap: var(--space-6);
  align-items: start;
}
.bench__side {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}
.bench__filter {
  text-align: left;
  font-family: var(--font-mono);
  font-size: var(--text-caption);
  padding: 6px 10px;
  border-radius: var(--radius-md);
  border: var(--border-default);
  background: var(--color-surface);
  color: var(--color-text-secondary);
  cursor: pointer;
}
.bench__filter.is-on,
.bench__filter:hover {
  border-color: var(--color-accent);
  color: var(--color-accent);
  background: var(--color-accent-soft);
}
.bench__list {
  list-style: none;
  margin: var(--space-3) 0 0;
  padding: 0;
  display: grid;
  gap: var(--space-2);
}
.bench__item {
  width: 100%;
  text-align: left;
  padding: var(--space-3);
  border: var(--border-default);
  border-radius: var(--radius-md);
  background: var(--color-surface);
  cursor: pointer;
  display: grid;
  gap: 2px;
}
.bench__item.is-on,
.bench__item:hover {
  border-color: var(--color-accent);
}
.bench__item-name {
  font-family: var(--font-display);
  font-size: var(--text-body);
  color: var(--color-text);
}
.bench__item-lang {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--color-accent);
}
.bench__item-line {
  font-size: var(--text-caption);
  color: var(--color-text-secondary);
}
.bench__panel {
  background: var(--color-surface);
  border: var(--border-default);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  box-shadow: var(--shadow-card);
}
.bench__panel-head {
  display: flex;
  justify-content: space-between;
  gap: var(--space-4);
  flex-wrap: wrap;
  margin-bottom: var(--space-3);
}
.bench__panel-group {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--color-accent);
}
.bench__panel-title {
  font-family: var(--font-display);
  font-size: var(--text-h2);
  line-height: var(--lh-h2);
}
.bench__panel-links {
  display: flex;
  gap: var(--space-3);
  font-family: var(--font-mono);
  font-size: var(--text-caption);
  align-items: flex-start;
}
.bench__panel-desc {
  color: var(--color-text-secondary);
  margin-bottom: var(--space-4);
  max-width: 52ch;
}
.term {
  border: var(--border-default);
  border-radius: var(--radius-md);
  overflow: hidden;
  background: var(--color-surface-muted);
}
.term__bar {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 12px;
  border-bottom: var(--border-default);
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--color-text-tertiary);
}
.term__bar span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-border-strong);
}
.term__bar span:first-child {
  background: var(--color-accent);
}
.term__bar em {
  margin-left: 8px;
  font-style: normal;
}
.term__body {
  padding: var(--space-4);
}
.term__cap {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--color-text-tertiary);
  margin-bottom: var(--space-2);
}
.term__row {
  display: flex;
  gap: var(--space-3);
  align-items: flex-start;
  margin-bottom: var(--space-4);
  flex-wrap: wrap;
}
.term__row code {
  flex: 1;
  min-width: 0;
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--color-text);
  background: var(--color-surface);
  border: var(--border-default);
  border-radius: var(--radius-sm);
  padding: 8px 12px;
  overflow-x: auto;
  white-space: pre-wrap;
  word-break: break-all;
}
.term__copy {
  flex-shrink: 0;
  font-family: var(--font-mono);
  font-size: 12px;
  padding: 8px 12px;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-accent);
  background: transparent;
  color: var(--color-accent);
  cursor: pointer;
}
.term__copy:hover {
  background: var(--color-accent-soft);
}
.term__copy:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}
.term__note {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--color-text-tertiary);
}
@media (max-width: 799px) {
  .bench__layout {
    grid-template-columns: 1fr;
  }
}
</style>
