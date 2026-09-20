<script setup>
// /w/:world 世界门槛 — 精选驻留，全文仍在 L1 列表（16 结构 · 体验架构 L3）
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import PageHeader from '@/components/layout/PageHeader.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import { getWorld, getWorldPicks, listHref } from '@/utils/gardenCuration.js'
import { setDescription, setTitle } from '@/utils/seo.js'
import { site } from '@/utils/content.js'

const route = useRoute()

const world = computed(() => getWorld(String(route.params.world || '')))
const picks = computed(() => (world.value ? getWorldPicks(world.value.id) : []))
const allHref = computed(() => (world.value ? listHref(world.value) : null))
// 世界气质：诗境更静、学习更条理，不共用一套「卡片说明书」
const mood = computed(() => world.value?.id || 'works')

function applyMeta() {
  const w = world.value
  if (!w) return
  setTitle(`${w.label} · ${site?.name || 'Yuer'}`)
  setDescription(w.blurb || w.feel || site.bio)
}

applyMeta()
watch(() => route.params.world, applyMeta)
</script>

<template>
  <div v-if="world" class="container container--narrow gate" :class="`gate--${mood}`">
    <PageHeader :title="world.label" :description="world.feel" />

    <p class="gate__blurb">{{ world.blurb }}</p>

    <section class="gate__picks" aria-label="精选">
      <article v-for="(item, i) in picks" :key="`${item.to}-${i}`" class="pick">
        <div class="pick__head">
          <span v-if="mood !== 'poetry'" class="pick__kind">{{ item.kind }}</span>
          <span v-if="item.subtitle && !item.title.includes(item.subtitle)" class="pick__sub">
            {{ item.subtitle }}
          </span>
        </div>
        <h2 class="pick__title">
          <RouterLink :to="item.to">{{ item.title }}</RouterLink>
        </h2>
        <p v-if="item.blurb" class="pick__blurb">{{ item.blurb }}</p>
        <ul v-if="item.meta?.length && mood !== 'poetry'" class="pick__meta">
          <li v-for="m in item.meta" :key="m">{{ m }}</li>
        </ul>
      </article>
    </section>

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
        <RouterLink to="/garden">← 回花庭</RouterLink>
        <RouterLink to="/room">去书房</RouterLink>
        <RouterLink to="/">首页</RouterLink>
      </div>
    </footer>
  </div>

  <div v-else class="container container--narrow gate">
    <PageHeader title="世界尚未命名" description="这朵花指向的地图上没有这一页。" />
    <p>
      <RouterLink to="/garden">回花庭</RouterLink>
      ·
      <RouterLink to="/projects">列表浏览</RouterLink>
    </p>
  </div>
</template>

<style scoped>
.gate {
  padding-block: var(--space-8) var(--space-16);
}
.gate__blurb {
  margin-top: calc(var(--space-4) * -1);
  margin-bottom: var(--space-8);
  color: var(--color-text-secondary);
  max-width: 48ch;
}
.gate__picks {
  display: grid;
  gap: 0;
  border-top: var(--border-default);
}
.pick {
  padding: var(--space-6) 0;
  border-bottom: var(--border-default);
}
.pick__head {
  display: flex;
  align-items: baseline;
  gap: var(--space-3);
  margin-bottom: var(--space-2);
}
.pick__kind {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.08em;
  color: var(--color-accent);
  border: 1px solid var(--color-accent);
  border-radius: 999px;
  padding: 1px 8px;
}
.pick__sub {
  font-family: var(--font-mono);
  font-size: var(--text-caption);
  color: var(--color-text-tertiary);
}
.pick__title {
  font-family: var(--font-display);
  font-size: var(--text-h2);
  line-height: var(--lh-h2);
}
.pick__title a {
  color: var(--color-text);
  text-decoration: none;
}
.pick__title a:hover {
  color: var(--color-accent);
}
.pick__blurb {
  margin-top: var(--space-3);
  color: var(--color-text-secondary);
  max-width: 56ch;
}
.pick__meta {
  margin-top: var(--space-3);
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  list-style: none;
  padding: 0;
}
.pick__meta li {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--color-text-secondary);
  background: var(--color-surface-muted);
  border-radius: var(--radius-sm);
  padding: 2px 8px;
}
.gate__foot {
  margin-top: var(--space-12);
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}
.gate__all {
  font-family: var(--font-mono);
  font-size: var(--text-small);
  color: var(--color-accent);
  text-decoration: none;
  letter-spacing: 0.04em;
}
.gate__all:hover {
  color: var(--color-accent-hover);
}
.gate__nav {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-4);
  font-family: var(--font-mono);
  font-size: var(--text-caption);
}
.gate__nav a {
  color: var(--color-text-secondary);
  text-decoration: none;
}
.gate__nav a:hover {
  color: var(--color-accent);
}

/* —— 世界气质 —— */
/* 诗境：更静的纸面阅读，去掉徽章/标签噪音 */
.gate--poetry {
  max-width: 40rem;
}
.gate--poetry .gate__blurb {
  font-family: var(--font-display);
  font-size: var(--text-h3);
  line-height: 1.7;
  color: var(--color-text-secondary);
  max-width: 28ch;
}
.gate--poetry .pick {
  padding: var(--space-8) 0;
  border-bottom: none;
}
.gate--poetry .gate__picks {
  border-top: none;
  gap: var(--space-2);
}
.gate--poetry .pick__title {
  font-size: var(--text-h1);
  line-height: var(--lh-h1);
  letter-spacing: 0.02em;
}
.gate--poetry .pick__sub {
  font-family: var(--font-display);
  font-style: italic;
  color: var(--color-text-tertiary);
  font-size: var(--text-small);
}
.gate--poetry .pick__blurb {
  font-family: var(--font-display);
  max-width: 36ch;
  color: var(--color-text-secondary);
}
.gate--poetry .gate__all,
.gate--poetry .gate__nav {
  font-family: var(--font-display);
}

/* 学习：条理感——细分隔、等宽元信息、弱面板 */
.gate--learn .pick__title {
  font-family: var(--font-sans);
  font-weight: 600;
  letter-spacing: -0.01em;
}
.gate--learn .pick {
  background: linear-gradient(90deg, var(--color-surface-muted), transparent 70%);
  padding-inline: var(--space-4);
  margin-inline: calc(var(--space-4) * -1);
  border-radius: var(--radius-md);
}
.gate--learn .pick__kind {
  color: var(--color-text-secondary);
  border-color: var(--color-border-strong);
  background: var(--color-surface);
}
.gate--learn .pick__meta li {
  font-family: var(--font-mono);
  font-size: 11px;
  background: var(--color-surface);
  border: var(--border-default);
}

/* 作品：案头气质，强调「能落地」 */
.gate--works .pick__title {
  font-size: var(--text-h2);
}
.gate--works .pick__kind {
  background: var(--color-accent-soft);
  border-color: transparent;
}

/* 实验：允许未完成——虚线框 */
.gate--lab .pick {
  border-bottom-style: dashed;
}
.gate--lab .pick__kind {
  border-style: dashed;
}

/* 关于：更少装饰 */
.gate--about .pick__kind {
  border: none;
  padding-left: 0;
  color: var(--color-text-tertiary);
}
</style>
