<script setup>
// FilterBar —— 列表页筛选（05 §3）：状态单选 + 技术多选（OR）
// 组件不直接改路由；modelValue 变化由页面监听并写 query（14 §5.4 决策 D2）
import Tag from '@/components/ui/Tag.vue'

const props = defineProps({
  statusOptions: { type: Array, default: () => [] },
  techOptions: { type: Array, default: () => [] },
  modelValue: {
    type: Object,
    default: () => ({ status: '', tech: [] }),
  },
})
const emit = defineEmits(['update:modelValue'])

const STATUS_LABELS = { development: '开发中', completed: '已完成', archived: '已归档', experiment: '实验' }

function setStatus(status) {
  emit('update:modelValue', { ...props.modelValue, status })
}
function toggleTech(tech) {
  const next = props.modelValue.tech.includes(tech)
    ? props.modelValue.tech.filter((t) => t !== tech)
    : [...props.modelValue.tech, tech]
  emit('update:modelValue', { ...props.modelValue, tech: next })
}
</script>

<template>
  <div class="filter-bar">
    <!-- 状态：单选标签组（含"全部"） -->
    <div v-if="statusOptions.length" class="filter-bar__row" role="group" aria-label="按状态筛选">
      <Tag
        label="全部"
        :clickable="true"
        :active="modelValue.status === ''"
        @click="setStatus('')"
      />
      <Tag
        v-for="s in statusOptions"
        :key="s"
        :label="STATUS_LABELS[s] || s"
        :clickable="true"
        :active="modelValue.status === s"
        @click="setStatus(s)"
      />
    </div>
    <!-- 技术栈：多选（OR 逻辑） -->
    <div v-if="techOptions.length" class="filter-bar__row" role="group" aria-label="按技术栈筛选">
      <Tag
        v-for="t in techOptions"
        :key="t"
        :label="t"
        :clickable="true"
        :active="modelValue.tech.includes(t)"
        @click="toggleTech(t)"
      />
    </div>
  </div>
</template>

<style scoped>
.filter-bar {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  margin-bottom: var(--space-6);
}
.filter-bar__row {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}
</style>
