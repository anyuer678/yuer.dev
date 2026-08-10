<script setup>
// Projects 列表页（F03）：query 即状态（14 §5.4 模式样板）
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PageHeader from '@/components/layout/PageHeader.vue'
import FilterBar from '@/components/features/FilterBar.vue'
import ProjectCard from '@/components/features/ProjectCard.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import { projects, techList } from '@/utils/content.js'
import { toQueryArray } from '@/utils/query.js'

const route = useRoute()
const router = useRouter()

const statusOptions = ['development', 'completed', 'archived', 'experiment']

const status = computed(() => (route.query.status ?? ''))
const techs = computed(() => toQueryArray(route.query.tech))

const filtered = computed(() =>
  projects.filter(
    (p) =>
      (!status.value || p.status === status.value) &&
      (techs.value.length === 0 || techs.value.some((t) => p.tech.includes(t))) // OR
  )
)

const modelValue = computed(() => ({ status: status.value, tech: techs.value }))

function applyFilter(next) {
  const query = { ...route.query }
  next.status === '' ? delete query.status : (query.status = next.status)
  next.tech.length === 0 ? delete query.tech : (query.tech = next.tech)
  router.replace({ query }) // 空值不写入 query（14 §5.4）
}

function clearFilter() {
  router.replace({ query: {} })
}
</script>

<template>
  <div class="container">
    <PageHeader title="项目" description="作品集" :count="filtered.length" />

    <FilterBar
      :status-options="statusOptions"
      :tech-options="techList"
      :model-value="modelValue"
      @update:model-value="applyFilter"
    />

    <div v-if="filtered.length" class="project-grid">
      <ProjectCard v-for="p in filtered" :key="p.slug" :project="p" />
    </div>
    <EmptyState
      v-else
      message="没有符合条件的项目"
      action-label="清除筛选"
      @action="clearFilter"
    />
  </div>
</template>

<style scoped>
.project-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(320px, 100%), 1fr)); /* 防 <350px 溢出 */
  gap: var(--grid-gap);
}
</style>
