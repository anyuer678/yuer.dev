<script setup>
// Timeline 页面（F05）：年份分组（降序）+ 组内 date 倒序（防御性排序，14 §5.9.5）
import { computed } from 'vue'
import PageHeader from '@/components/layout/PageHeader.vue'
import TimelineItem from '@/components/features/TimelineItem.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import { timeline } from '@/utils/content.js'

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
      description="从 2025 年学习 Java 开始，到如今构建 AI 平台 —— 持续积累，而非突然会 AI"
    />

    <EmptyState v-if="!timeline.length" message="时间线暂无内容" />

    <div v-else class="timeline">
      <section v-for="[year, items] in groups" :key="year" class="timeline__group">
        <h2 class="timeline__year">{{ year }}</h2>
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
  margin-bottom: var(--space-4);
}
.timeline__list {
  list-style: none;
  margin: 0;
  padding: 0;
  position: relative;
}
/* 竖线：沿节点列连续绘制（节点圆点背景色遮盖，形成断点效果）
   TimelineItem grid = 48px 日期列 + 12px gap + 20px 节点列；圆点中心 48+12+10=70px */
.timeline__list::before {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: calc(48px + var(--space-3) + 10px); /* 70px，与圆点中心对齐 */
  width: 1px;
  background: var(--color-border);
}
</style>
