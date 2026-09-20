<script setup>
// /w/:world 世界门槛 — 各世界版式分家，不是同一列表换色
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
  <div v-if="world" class="gate" :class="`gate--${id}`">
    <!-- —— 诗境：居中纸页，无列表壳 —— -->
    <template v-if="id === 'poetry'">
      <header class="p-head">
        <p class="p-kicker">诗境</p>
        <h1 class="p-title">{{ world.feel }}</h1>
        <p class="p-blurb">{{ world.blurb }}</p>
      </header>
      <ol class="p-list">
        <li v-for="(item, i) in picks" :key="item.to" class="p-item">
          <p class="p-num">{{ cnNum(i) }}</p>
          <h2 class="p-name">
            <RouterLink :to="item.to">{{ item.title }}</RouterLink>
          </h2>
          <p v-if="item.subtitle" class="p-date">{{ item.subtitle }}</p>
          <p v-if="item.blurb" class="p-sum">{{ item.blurb }}</p>
        </li>
      </ol>
    </template>

    <!-- —— 学习：课表 / 主题卡 —— -->
    <template v-else-if="id === 'learn'">
      <header class="l-head">
        <div>
          <p class="l-kicker">学习廊</p>
          <h1 class="l-title">{{ world.label }}</h1>
          <p class="l-feel">{{ world.feel }}</p>
        </div>
        <p class="l-count">{{ picks.length }} 篇节选</p>
      </header>
      <p class="l-blurb">{{ world.blurb }}</p>
      <div class="l-grid">
        <article v-for="item in picks" :key="item.to" class="l-card">
          <div class="l-card__top">
            <span class="l-card__kind">{{ item.kind }}</span>
            <span v-if="item.subtitle" class="l-card__date">{{ item.subtitle }}</span>
          </div>
          <h2 class="l-card__title">
            <RouterLink :to="item.to">{{ item.title }}</RouterLink>
          </h2>
          <p class="l-card__blurb">{{ item.blurb }}</p>
          <p v-if="item.meta?.length" class="l-card__tags">
            <span v-for="m in item.meta" :key="m">{{ m }}</span>
          </p>
        </article>
      </div>
    </template>

    <!-- —— 作品：案头目录，大号序号 + 产品感 —— -->
    <template v-else-if="id === 'works'">
      <header class="w-head">
        <p class="w-kicker">作品斋</p>
        <h1 class="w-title">{{ world.feel }}</h1>
        <p class="w-blurb">{{ world.blurb }}</p>
      </header>
      <ol class="w-list">
        <li v-for="(item, i) in picks" :key="item.to" class="w-row">
          <span class="w-idx">{{ String(i + 1).padStart(2, '0') }}</span>
          <div class="w-body">
            <div class="w-title-row">
              <h2 class="w-name">
                <RouterLink :to="item.to">{{ item.title }}</RouterLink>
              </h2>
              <span class="w-kind">{{ item.kind }}</span>
            </div>
            <p v-if="item.subtitle" class="w-sub">{{ item.subtitle }}</p>
            <p class="w-sum">{{ item.blurb }}</p>
            <p v-if="item.meta?.length" class="w-meta">
              <span v-for="m in item.meta" :key="m">{{ m }}</span>
            </p>
          </div>
        </li>
      </ol>
    </template>

    <!-- —— 实验：工作台草稿 —— -->
    <template v-else-if="id === 'lab'">
      <header class="b-head">
        <h1 class="b-title">实验场</h1>
        <p class="b-feel">{{ world.feel }}</p>
        <p class="b-blurb">{{ world.blurb }}</p>
      </header>
      <ul class="b-list">
        <li v-for="item in picks" :key="item.to" class="b-item">
          <span class="b-stamp">{{ item.kind }}</span>
          <div>
            <h2 class="b-name">
              <RouterLink :to="item.to">{{ item.title }}</RouterLink>
            </h2>
            <p class="b-desc">{{ item.blurb }}</p>
            <p v-if="item.subtitle" class="b-date">{{ item.subtitle }}</p>
          </div>
        </li>
      </ul>
    </template>

    <!-- —— 关于 / 其它：极简 —— -->
    <template v-else>
      <header class="a-head">
        <h1 class="a-title">{{ world.label }}</h1>
        <p class="a-feel">{{ world.feel }}</p>
        <p class="a-blurb">{{ world.blurb }}</p>
      </header>
      <ul class="a-list">
        <li v-for="item in picks" :key="item.to">
          <RouterLink :to="item.to" class="a-link">
            <span class="a-kind">{{ item.kind }}</span>
            <span class="a-name">{{ item.title }}</span>
            <span class="a-go" aria-hidden="true">→</span>
          </RouterLink>
          <p v-if="item.blurb" class="a-blurb2">{{ item.blurb }}</p>
        </li>
      </ul>
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

  <div v-else class="container container--narrow gate-miss">
    <h1>世界尚未命名</h1>
    <p><RouterLink to="/garden">回花庭</RouterLink> · <RouterLink to="/projects">项目</RouterLink></p>
  </div>
</template>

<style scoped>
.gate {
  min-height: 100%;
  padding: var(--space-8) clamp(16px, 4vw, 32px) var(--space-16);
}
.gate__foot {
  margin-top: var(--space-12);
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  padding-top: var(--space-6);
  border-top: var(--border-default);
}
.gate__all {
  font-family: var(--font-mono);
  font-size: var(--text-small);
  color: var(--color-accent);
  text-decoration: none;
}
.gate__nav {
  display: flex;
  gap: var(--space-4);
  font-family: var(--font-mono);
  font-size: var(--text-caption);
}
.gate__nav a {
  color: var(--color-text-secondary);
  text-decoration: none;
}
.gate__nav a:hover,
.gate__all:hover {
  color: var(--color-accent);
}
.gate-miss {
  padding-block: var(--space-16);
}

/* ========== 诗境 ========== */
.gate--poetry {
  max-width: 36rem;
  margin: 0 auto;
  text-align: center;
  background:
    radial-gradient(ellipse 90% 50% at 50% 0%, rgba(246, 233, 225, 0.45), transparent 70%);
}
.p-head {
  padding: var(--space-12) 0 var(--space-8);
}
.p-kicker {
  font-family: var(--font-display);
  font-size: var(--text-small);
  letter-spacing: 0.35em;
  color: var(--color-accent);
}
.p-title {
  margin-top: var(--space-4);
  font-family: var(--font-display);
  font-size: clamp(28px, 5vw, 40px);
  font-weight: 500;
  line-height: 1.3;
}
.p-blurb {
  margin: var(--space-6) auto 0;
  max-width: 22em;
  font-family: var(--font-display);
  font-size: var(--text-body);
  line-height: 1.9;
  color: var(--color-text-secondary);
}
.p-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: var(--space-12);
}
.p-item {
  padding: 0;
  border: none;
}
.p-num {
  font-family: var(--font-display);
  font-size: 13px;
  color: var(--color-text-tertiary);
  letter-spacing: 0.2em;
}
.p-name {
  margin-top: var(--space-3);
  font-family: var(--font-display);
  font-size: clamp(22px, 3.5vw, 28px);
  font-weight: 500;
  line-height: 1.45;
}
.p-name a {
  color: var(--color-text);
  text-decoration: none;
}
.p-name a:hover {
  color: var(--color-accent);
}
.p-date {
  margin-top: var(--space-2);
  font-family: var(--font-display);
  font-style: italic;
  font-size: var(--text-small);
  color: var(--color-text-tertiary);
}
.p-sum {
  margin: var(--space-4) auto 0;
  max-width: 28em;
  font-family: var(--font-display);
  font-size: var(--text-small);
  line-height: 1.85;
  color: var(--color-text-secondary);
}

/* ========== 学习 ========== */
.gate--learn {
  max-width: var(--container);
  margin: 0 auto;
  background: var(--color-surface-muted);
  border-bottom: var(--border-default);
}
.l-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: var(--space-4);
  padding-top: var(--space-8);
  margin-bottom: var(--space-3);
}
.l-kicker {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.16em;
  color: var(--color-accent);
}
.l-title {
  margin-top: 4px;
  font-family: var(--font-sans);
  font-size: var(--text-h1);
  font-weight: 700;
  letter-spacing: -0.02em;
}
.l-feel {
  margin-top: 4px;
  font-family: var(--font-mono);
  font-size: var(--text-caption);
  color: var(--color-text-secondary);
}
.l-count {
  font-family: var(--font-mono);
  font-size: var(--text-caption);
  color: var(--color-text-tertiary);
  white-space: nowrap;
}
.l-blurb {
  margin-bottom: var(--space-6);
  max-width: 52ch;
  font-size: var(--text-small);
  color: var(--color-text-secondary);
}
.l-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(260px, 100%), 1fr));
  gap: var(--space-4);
  padding-bottom: var(--space-4);
}
.l-card {
  background: var(--color-surface);
  border: var(--border-default);
  border-radius: var(--radius-md);
  padding: var(--space-5, 20px) var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  min-height: 160px;
}
.l-card__top {
  display: flex;
  justify-content: space-between;
  gap: var(--space-2);
  font-family: var(--font-mono);
  font-size: 11px;
}
.l-card__kind {
  color: var(--color-accent);
}
.l-card__date {
  color: var(--color-text-tertiary);
}
.l-card__title {
  font-family: var(--font-sans);
  font-size: 18px;
  font-weight: 600;
  line-height: 1.35;
}
.l-card__title a {
  color: var(--color-text);
  text-decoration: none;
}
.l-card__title a:hover {
  color: var(--color-accent);
}
.l-card__blurb {
  flex: 1;
  font-size: var(--text-caption);
  color: var(--color-text-secondary);
  line-height: 1.55;
}
.l-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  font-family: var(--font-mono);
  font-size: 11px;
}
.l-card__tags span {
  padding: 2px 6px;
  border-radius: 3px;
  background: var(--color-surface-muted);
  color: var(--color-text-secondary);
}

/* ========== 作品 ========== */
.gate--works {
  max-width: 720px;
  margin: 0 auto;
}
.w-head {
  padding: var(--space-8) 0 var(--space-6);
  border-bottom: 2px solid var(--color-text);
}
.w-kicker {
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.2em;
  color: var(--color-accent);
}
.w-title {
  margin-top: var(--space-2);
  font-family: var(--font-display);
  font-size: var(--text-h1);
  line-height: var(--lh-h1);
}
.w-blurb {
  margin-top: var(--space-3);
  color: var(--color-text-secondary);
  max-width: 40ch;
  font-size: var(--text-small);
}
.w-list {
  list-style: none;
  margin: 0;
  padding: 0;
}
.w-row {
  display: grid;
  grid-template-columns: 56px 1fr;
  gap: var(--space-4);
  padding: var(--space-6) 0;
  border-bottom: var(--border-default);
}
.w-idx {
  font-family: var(--font-mono);
  font-size: 22px;
  color: var(--color-accent);
  line-height: 1;
  padding-top: 4px;
}
.w-title-row {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: var(--space-3);
}
.w-name {
  font-family: var(--font-display);
  font-size: var(--text-h2);
  line-height: var(--lh-h2);
}
.w-name a {
  color: var(--color-text);
  text-decoration: none;
}
.w-name a:hover {
  color: var(--color-accent);
}
.w-kind {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.08em;
  color: var(--color-accent);
  background: var(--color-accent-soft);
  border-radius: 999px;
  padding: 2px 8px;
}
.w-sub {
  margin-top: 4px;
  font-family: var(--font-mono);
  font-size: var(--text-caption);
  color: var(--color-text-secondary);
}
.w-sum {
  margin-top: var(--space-3);
  font-size: var(--text-small);
  color: var(--color-text-secondary);
  max-width: 48ch;
}
.w-meta {
  margin-top: var(--space-3);
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--color-text-secondary);
}
.w-meta span:not(:last-child)::after {
  content: '·';
  margin-left: var(--space-2);
  color: var(--color-text-tertiary);
}

/* ========== 实验 ========== */
.gate--lab {
  max-width: 640px;
  margin: 0 auto;
  background-image: repeating-linear-gradient(
    -12deg,
    transparent,
    transparent 12px,
    rgba(176, 92, 58, 0.03) 12px,
    rgba(176, 92, 58, 0.03) 13px
  );
}
.b-head {
  padding: var(--space-8) 0 var(--space-5, 20px);
}
.b-title {
  font-family: var(--font-mono);
  font-size: var(--text-h1);
  letter-spacing: 0.06em;
}
.b-feel {
  margin-top: var(--space-2);
  font-family: var(--font-mono);
  font-size: var(--text-small);
  color: var(--color-accent);
}
.b-blurb {
  margin-top: var(--space-3);
  font-family: var(--font-mono);
  font-size: var(--text-caption);
  color: var(--color-text-secondary);
  max-width: 48ch;
}
.b-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: var(--space-3);
}
.b-item {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: var(--space-3);
  padding: var(--space-4);
  border: 1px dashed var(--color-border-strong);
  border-radius: var(--radius-sm);
  background: rgba(255, 255, 255, 0.55);
}
.b-stamp {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.1em;
  color: var(--color-accent);
  border: 1px dashed var(--color-accent);
  border-radius: 2px;
  padding: 2px 6px;
  height: fit-content;
  white-space: nowrap;
}
.b-name {
  font-family: var(--font-mono);
  font-size: 15px;
  font-weight: 600;
}
.b-name a {
  color: var(--color-text);
  text-decoration: none;
}
.b-name a:hover {
  color: var(--color-accent);
}
.b-desc {
  margin-top: 6px;
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--color-text-secondary);
  line-height: 1.55;
}
.b-date {
  margin-top: 6px;
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--color-text-tertiary);
}

/* ========== 关于 ========== */
.gate--about {
  max-width: 28rem;
  margin: 0 auto;
  padding-top: var(--space-16);
}
.a-title {
  font-family: var(--font-display);
  font-size: var(--text-h1);
}
.a-feel {
  margin-top: var(--space-2);
  font-family: var(--font-display);
  font-style: italic;
  color: var(--color-text-secondary);
}
.a-blurb {
  margin-top: var(--space-6);
  color: var(--color-text-secondary);
  line-height: 1.8;
}
.a-list {
  list-style: none;
  margin: var(--space-8) 0 0;
  padding: 0;
  display: grid;
  gap: var(--space-5, 20px);
}
.a-link {
  display: grid;
  grid-template-columns: 48px 1fr auto;
  gap: var(--space-3);
  align-items: baseline;
  text-decoration: none;
  padding-bottom: var(--space-2);
  border-bottom: 1px solid transparent;
}
.a-link:hover {
  border-bottom-color: var(--color-border);
}
.a-kind {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--color-text-tertiary);
}
.a-name {
  font-family: var(--font-display);
  font-size: var(--text-h3);
  color: var(--color-text);
}
.a-link:hover .a-name {
  color: var(--color-accent);
}
.a-go {
  color: var(--color-text-tertiary);
}
.a-blurb2 {
  margin-top: 4px;
  margin-left: calc(48px + var(--space-3));
  font-size: var(--text-caption);
  color: var(--color-text-secondary);
}

@media (max-width: 639px) {
  .w-row {
    grid-template-columns: 40px 1fr;
  }
  .l-head {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
