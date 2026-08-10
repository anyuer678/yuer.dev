<script setup>
// Lab 页面（F07）：原生 select 状态筛选，URL query ?status=（14 §5.9.8）
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PageHeader from '@/components/layout/PageHeader.vue'
import LabItem from '@/components/features/LabItem.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import { lab } from '@/utils/content.js'

const route = useRoute()
const router = useRouter()

const STATUS_LABELS = { completed: '已完成', archived: '已归档', experiment: '实验' }
const CATEGORY_LABELS = { AI: 'AI 实验', Desktop: '桌面应用', Infrastructure: '基础设施' }

const status = computed(() => route.query.status ?? '')
const filtered = computed(() => (status.value ? lab.filter((i) => i.status === status.value) : lab))
// 按 date 倒序（F07：按日期倒序）
const sorted = computed(() => [...filtered.value].sort((a, b) => b.date.localeCompare(a.date)))
// 分类分组（category 缺省归入「其他」）
const grouped = computed(() => {
  const groups = {}
  for (const item of sorted.value) {
    const cat = item.category || '其他'
    ;(groups[cat] ??= []).push(item)
  }
  return Object.entries(groups)
})

function applyStatus(next) {
  const query = { ...route.query }
  next === '' ? delete query.status : (query.status = next)
  router.replace({ query })
}
</script>

<template>
  <div class="container">
    <PageHeader title="实验室" description="不成熟但真实的小项目" :count="sorted.length" />

    <div class="lab-filter">
      <label class="lab-filter__label" for="lab-status">状态</label>
      <select
        id="lab-status"
        class="lab-filter__select"
        :value="status"
        @change="applyStatus($event.target.value)"
      >
        <option value="">全部</option>
        <option v-for="(label, value) in STATUS_LABELS" :key="value" :value="value">
          {{ label }}
        </option>
      </select>
    </div>

    <div v-if="sorted.length" class="lab-groups">
      <section v-for="[cat, items] in grouped" :key="cat" class="lab-group">
        <h2 class="lab-group__title">{{ CATEGORY_LABELS[cat] || cat }}</h2>
        <div class="lab-grid">
          <LabItem v-for="(item, i) in items" :key="`${item.title}-${i}`" :item="item" />
        </div>
      </section>
    </div>
    <EmptyState v-else message="没有符合条件的实验项目" action-label="清除筛选" @action="applyStatus('')" />
  </div>
</template>

<style scoped>
.lab-filter {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-bottom: var(--space-6);
}
.lab-filter__label {
  font-size: var(--text-small);
  color: var(--color-text-secondary);
}
.lab-filter__select {
  padding: var(--space-2) var(--space-4);
  font-size: var(--text-small);
  border: var(--border-default);
  border-radius: var(--radius-md);
  background: var(--color-surface);
  color: var(--color-text);
  cursor: pointer;
}
.lab-groups {
  display: grid;
  gap: var(--space-10);
}
.lab-group__title {
  font-family: var(--font-display);
  font-size: var(--text-h2);
  line-height: var(--lh-h2);
  margin-bottom: var(--space-4);
}
.lab-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(280px, 100%), 1fr)); /* 防 <300px 溢出 */
  gap: var(--grid-gap);
}
</style>
