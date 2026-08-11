<script setup>
// TimelineItem —— 时间线条目（05 §3；F05）
// 圆点按 type 着色：project=accent / learning=green / note=purple / milestone=text
defineProps({
  item: { type: Object, required: true },
})

const TYPE_LABELS = { project: '项目', learning: '学习', note: '笔记', milestone: '里程碑' }
</script>

<template>
  <li class="timeline-item">
    <!-- 左列：月份 -->
    <time class="timeline-item__date" :datetime="item.date">{{ item.date.slice(5) }}</time>
    <!-- 中列：节点圆点（竖线由外层 ::before 连续绘制） -->
    <span class="timeline-item__dot" :class="`dot--${item.type}`" aria-hidden="true" />
    <!-- 右列：标题 + 类型徽章 -->
    <div class="timeline-item__content">
      <RouterLink v-if="item.link" :to="item.link" class="timeline-item__title">
        {{ item.title }}
      </RouterLink>
      <span v-else class="timeline-item__title">{{ item.title }}</span>
      <span class="timeline-item__badge">{{ TYPE_LABELS[item.type] || item.type }}</span>
    </div>
  </li>
</template>

<style scoped>
.timeline-item {
  display: grid;
  grid-template-columns: 48px 20px 1fr; /* 月份 | 节点 | 内容 */
  align-items: baseline;
  column-gap: var(--space-3);
  padding-block: var(--space-3);
}
.timeline-item__date {
  font-family: var(--font-mono);
  font-size: var(--text-caption);
  color: var(--color-text-secondary);
  text-align: right;
}
.timeline-item__dot {
  position: relative;
  justify-self: center;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  align-self: center;
}
/* 类型着色（05 §3） */
.dot--project {
  background: var(--color-accent);
}
.dot--learning {
  background: #336b43;
}
.dot--note {
  background: #5a4b8a;
}
.dot--milestone {
  background: var(--color-text);
}
.timeline-item__content {
  display: flex;
  align-items: baseline;
  gap: var(--space-3);
}
.timeline-item__title {
  font-size: var(--text-body);
  color: var(--color-text);
  text-decoration: none;
  transition: color var(--dur-fast) var(--ease-standard);
}
a.timeline-item__title:hover {
  color: var(--color-accent);
}
.timeline-item__badge {
  font-size: var(--text-caption);
  color: var(--color-text-secondary);
}
/* 响应式（14 §5.10）：<640 月列收窄 */
@media (max-width: 639px) {
  .timeline-item {
    grid-template-columns: 36px 20px 1fr;
    column-gap: var(--space-2);
  }
  .timeline-item__date {
    text-align: right;
  }
}
</style>
