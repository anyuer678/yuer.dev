<script setup>
// Timeline 页面（F05）：年份分组（降序）+ 组内 date 倒序（防御性排序，14 §5.9.5）
import { computed } from 'vue'
import PageHeader from '@/components/layout/PageHeader.vue'
import TimelineItem from '@/components/features/TimelineItem.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import { timeline } from '@/utils/content.js'
import { YEAR_SUMMARIES } from '@/utils/yearSummaries.js'

// 分组：年份降序、组内 date 倒序（同月保持 JSON 顺序——稳定排序，14 §5.9.5）
const groups = computed(() => {
  const map = new Map()
  for (const item of timeline) {
    const year = item.date.slice(0, 4)
    if (!map.has(year)) map.set(year, [])
    map.get(year).push(item)
  }
  return [...map.entries()]
    .sort(([a], [b]) => b.localeCompare(a)) // 年份降序
    .map(([year, items]) => [
      year,
      [...items].sort((x, y) => y.date.localeCompare(x.date)), // 组内 date 倒序
    ])
})
</script>

<template>
  <div class="container">
    <PageHeader
      title="时间线"
      description="记录学习、开发和探索的过程"
    />

    <EmptyState v-if="!timeline.length" message="时间线暂无内容" />

    <div v-else class="timeline">
      <section v-for="[year, items] in groups" :key="year" class="timeline__group">
        <h2 class="timeline__year">{{ year }}</h2>
        <p v-if="YEAR_SUMMARIES[year]" class="timeline__year-summary">{{ YEAR_SUMMARIES[year] }}</p>
        <!-- 竖线贯穿：左日期列与中节点列交界处 -->
        <ol class="timeline__list">
          <TimelineItem v-for="item in items" :key="`${item.date}-${item.title}`" :item="item" />
        </ol>
      </section>
    </div>
  </div>
</template>

<style scoped>
.timeline__group + .timeline__group {
  margin-top: var(--space-12);
}
.timeline__year {
  font-family: var(--font-display);
  font-size: var(--text-h2);
  line-height: var(--lh-h2);
  margin-bottom: var(--space-2);
}
.timeline__year-summary {
  margin-bottom: var(--space-4);
  font-size: var(--text-small);
  color: var(--color-text-secondary);
  max-width: 56ch;
}
.timeline__list {
  list-style: none;
  margin: 0;
  padding: 0;
  position: relative;
}
/* 竖线：沿节点列连续绘制（节点圆点背景色遮盖，形成断点效果）
   位置 = 日期列宽 + gap + 圆点半宽，与 TimelineItem grid 联动；
   移动端列宽变化由 --tl-col-w / --tl-gap 同步（TimelineItem media query） */
.timeline__list::before {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: calc(var(--tl-col-w, 48px) + var(--tl-gap, var(--space-3)) + 10px);
  width: 1px;
  background: var(--color-border);
}
@media (max-width: 639px) {
  .timeline__list::before {
    left: calc(36px + var(--space-2) + 10px); /* 与 TimelineItem 移动端 grid 对齐 */
  }
}
</style>
