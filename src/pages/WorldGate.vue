<script setup>
// /w/:world — 两种读法，不是五套皮肤
// essay：慢读（诗境 / 关于）；catalog：扫读（作品 / 学习 / 实验）
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import EmptyState from '@/components/ui/EmptyState.vue'
import { getWorld, getWorldPicks, listHref } from '@/utils/gardenCuration.js'
import { setDescription, setTitle } from '@/utils/seo.js'
import { site } from '@/utils/content.js'

const route = useRoute()
const world = computed(() => getWorld(String(route.params.world || '')))
const picks = computed(() => (world.value ? getWorldPicks(world.value.id) : []))
const allHref = computed(() => (world.value ? listHref(world.value) : null))
const id = computed(() => world.value?.id || 'works')
const mode = computed(() => (id.value === 'poetry' || id.value === 'about' ? 'essay' : 'catalog'))

function applyMeta() {
  const w = world.value
  if (!w) return
  setTitle(`${w.label} · ${site?.name || 'Yuer'}`)
  setDescription(w.blurb || w.feel || site.bio)
}
applyMeta()
watch(() => route.params.world, applyMeta)

function cnNum(i) {
  return ['一', '二', '三', '四', '五', '六'][i] || String(i + 1)
}
</script>

<template>
  <div v-if="world" class="gate" :class="`gate--${mode} gate--${id}`">
    <!-- essay：慢读 -->
    <template v-if="mode === 'essay'">
      <header class="e-head">
        <p class="e-mark">{{ world.label }}</p>
        <h1 class="e-title">{{ world.feel }}</h1>
        <p class="e-blurb">{{ world.blurb }}</p>
      </header>
      <ol class="e-list">
        <li v-for="(item, i) in picks" :key="item.to" class="e-item">
          <span class="e-num">{{ cnNum(i) }}</span>
          <h2 class="e-name">
            <RouterLink :to="item.to">{{ item.title }}</RouterLink>
          </h2>
          <p v-if="item.subtitle" class="e-sub">{{ item.subtitle }}</p>
          <p v-if="item.blurb" class="e-sum">{{ item.blurb }}</p>
        </li>
      </ol>
    </template>

    <!-- catalog：扫读 -->
    <template v-else>
      <header class="c-head">
        <div>
          <p class="c-kicker">{{ world.label }}</p>
          <h1 class="c-title">{{ world.feel }}</h1>
          <p class="c-blurb">{{ world.blurb }}</p>
        </div>
        <p class="c-count">{{ picks.length }}</p>
      </header>
      <ol class="c-list">
        <li v-for="(item, i) in picks" :key="item.to" class="c-row">
          <span class="c-idx">{{ String(i + 1).padStart(2, '0') }}</span>
          <div class="c-body">
            <div class="c-title-row">
              <h2 class="c-name">
                <RouterLink :to="item.to">{{ item.title }}</RouterLink>
              </h2>
              <span class="c-kind">{{ item.kind }}</span>
            </div>
            <p v-if="item.subtitle" class="c-sub">{{ item.subtitle }}</p>
            <p v-if="item.blurb" class="c-sum">{{ item.blurb }}</p>
            <p v-if="item.meta?.length" class="c-meta">
              <span v-for="m in item.meta" :key="m">{{ m }}</span>
            </p>
          </div>
        </li>
      </ol>
    </template>

    <EmptyState
      v-if="!picks.length"
      message="这个世界还很安静"
      action-label="回花庭"
      @action="$router.push('/garden')"
    />

    <footer class="gate__foot">
      <RouterLink v-if="allHref" class="gate__all" :to="allHref">
        {{ world.listLabel || '查看全部' }} →
      </RouterLink>
      <div class="gate__nav">
        <RouterLink to="/garden">回花庭</RouterLink>
        <RouterLink to="/room">书房</RouterLink>
        <RouterLink to="/">首页</RouterLink>
      </div>
    </footer>
  </div>

  <div v-else class="gate-miss">
    <h1>世界尚未命名</h1>
    <p><RouterLink to="/garden">回花庭</RouterLink></p>
  </div>
</template>

<style scoped>
.gate {
  min-height: 100%;
  padding: var(--space-8) clamp(16px, 5vw, 40px) var(--space-16);
}
.gate__foot {
  margin-top: var(--space-12);
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: var(--space-4);
  padding-top: var(--space-5, 20px);
  border-top: var(--border-default);
  font-family: var(--font-mono);
  font-size: var(--text-caption);
}
.gate__all {
  color: var(--color-accent);
  text-decoration: none;
}
.gate__nav {
  display: flex;
  gap: var(--space-4);
}
.gate__nav a {
  color: var(--color-text-secondary);
  text-decoration: none;
}
.gate__nav a:hover,
.gate__all:hover {
  color: var(--color-accent);
}

/* —— essay：明显更空、更居中、更大字 —— */
.gate--essay {
  max-width: 34rem;
  margin: 0 auto;
  text-align: center;
  padding-top: var(--space-16);
  background:
    linear-gradient(180deg, rgba(246, 233, 225, 0.55) 0%, transparent 280px),
    var(--color-bg);
}
.e-head {
  margin-bottom: var(--space-12);
  padding-bottom: var(--space-8);
  border-bottom: none;
}
.e-mark {
  font-family: var(--font-display);
  font-size: 12px;
  letter-spacing: 0.4em;
  color: var(--color-accent);
}
.e-title {
  margin-top: var(--space-6);
  font-family: var(--font-display);
  font-size: clamp(32px, 6vw, 44px);
  font-weight: 500;
  line-height: 1.25;
}
.e-blurb {
  margin: var(--space-8) auto 0;
  max-width: 18em;
  font-family: var(--font-display);
  font-size: var(--text-body);
  line-height: 2;
  color: var(--color-text-secondary);
}
.e-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: var(--space-16);
}
.e-num {
  display: block;
  font-family: var(--font-display);
  font-size: 14px;
  color: var(--color-text-tertiary);
  letter-spacing: 0.25em;
  margin-bottom: var(--space-4);
}
.e-name {
  font-family: var(--font-display);
  font-size: clamp(24px, 4vw, 32px);
  font-weight: 500;
  line-height: 1.4;
}
.e-name a {
  color: var(--color-text);
  text-decoration: none;
}
.e-name a:hover {
  color: var(--color-accent);
}
.e-sub {
  margin-top: var(--space-3);
  font-family: var(--font-display);
  font-style: italic;
  color: var(--color-text-tertiary);
  font-size: var(--text-small);
}
.e-sum {
  margin: var(--space-5, 20px) auto 0;
  max-width: 26em;
  font-family: var(--font-display);
  font-size: var(--text-small);
  line-height: 1.9;
  color: var(--color-text-secondary);
}

/* —— catalog：左对齐、密、可扫 —— */
.gate--catalog {
  max-width: 760px;
  margin: 0 auto;
  text-align: left;
  background: var(--color-bg);
}
.c-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: var(--space-4);
  padding-bottom: var(--space-4);
  margin-bottom: 0;
  border-bottom: 2px solid var(--color-text);
}
.c-kicker {
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.16em;
  color: var(--color-accent);
}
.c-title {
  margin-top: 4px;
  font-family: var(--font-sans);
  font-weight: 700;
  font-size: var(--text-h1);
  letter-spacing: -0.02em;
  line-height: var(--lh-h1);
}
.c-blurb {
  margin-top: var(--space-3);
  max-width: 46ch;
  font-size: var(--text-small);
  color: var(--color-text-secondary);
}
.c-count {
  font-family: var(--font-mono);
  font-size: 40px;
  line-height: 1;
  color: var(--color-border-strong);
  font-weight: 600;
}
.c-list {
  list-style: none;
  margin: 0;
  padding: 0;
}
.c-row {
  display: grid;
  grid-template-columns: 48px 1fr;
  gap: var(--space-4);
  padding: var(--space-5, 20px) 0;
  border-bottom: var(--border-default);
}
.c-idx {
  font-family: var(--font-mono);
  font-size: 18px;
  color: var(--color-accent);
  padding-top: 2px;
}
.c-title-row {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: var(--space-3);
}
.c-name {
  font-family: var(--font-sans);
  font-weight: 600;
  font-size: 20px;
  line-height: 1.3;
}
.c-name a {
  color: var(--color-text);
  text-decoration: none;
}
.c-name a:hover {
  color: var(--color-accent);
}
.c-kind {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--color-accent);
  background: var(--color-accent-soft);
  border-radius: 999px;
  padding: 2px 8px;
}
.c-sub {
  margin-top: 4px;
  font-family: var(--font-mono);
  font-size: var(--text-caption);
  color: var(--color-text-secondary);
}
.c-sum {
  margin-top: var(--space-2);
  font-size: var(--text-small);
  color: var(--color-text-secondary);
  max-width: 52ch;
}
.c-meta {
  margin-top: var(--space-3);
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  font-family: var(--font-mono);
  font-size: 11px;
}
.c-meta span {
  padding: 2px 7px;
  border: var(--border-default);
  border-radius: 3px;
  color: var(--color-text-secondary);
  background: var(--color-surface);
}

/* 仅 catalog 内极轻差异，不再做五套底 */
.gate--learn .c-row {
  background: linear-gradient(90deg, var(--color-surface-muted), transparent 85%);
}
.gate--lab .c-row {
  border-bottom-style: dashed;
}

.gate-miss {
  padding: var(--space-16) clamp(16px, 4vw, 32px);
}
@media (max-width: 639px) {
  .c-row {
    grid-template-columns: 36px 1fr;
  }
  .c-count {
    font-size: 28px;
  }
}
</style>
