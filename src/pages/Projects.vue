<script setup>
// Projects 列表页（F03）：query 即状态（14 §5.4 模式样板）
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PageHeader from '@/components/layout/PageHeader.vue'
import FilterBar from '@/components/features/FilterBar.vue'
import ProjectCard from '@/components/features/ProjectCard.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import SectionTitle from '@/components/ui/SectionTitle.vue'
import { projects, featuredProjects, techList } from '@/utils/content.js'
import { toQueryArray } from '@/utils/query.js'

const route = useRoute()
const router = useRouter()

const statusOptions = ['development', 'completed', 'archived', 'experiment']

const status = computed(() => (route.query.status ?? ''))
const techs = computed(() => toQueryArray(route.query.tech))

const isFiltering = computed(() => status.value !== '' || techs.value.length > 0)

const filtered = computed(() =>
  projects.filter(
    (p) =>
      (!status.value || p.status === status.value) &&
      (techs.value.length === 0 || techs.value.some((t) => p.tech.includes(t))) // OR
  )
)

// 精选区（无筛选时展示）：featured 项目 + 高亮大卡
const featured = computed(() => featuredProjects)
// 「全部项目」= 过滤后剔除已展示的精选，避免重复（按 featured 顺序优先展示）
const rest = computed(() => filtered.value.filter((p) => !featured.value.includes(p)))

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
    <PageHeader title="项目" description="作品集" :count="projects.length" />

    <FilterBar
      :status-options="statusOptions"
      :tech-options="techList"
      :model-value="modelValue"
      @update:model-value="applyFilter"
    />

    <!-- 无筛选：精选 + 全部 两级 -->
    <template v-if="!isFiltering">
      <section v-if="featured.length" class="projects-section">
        <SectionTitle index="01" title="Featured Projects" />
        <div class="project-grid project-grid--featured">
          <ProjectCard v-for="p in featured" :key="p.slug" :project="p" featured />
        </div>
      </section>

      <section v-if="rest.length" class="projects-section">
        <SectionTitle index="02" :title="`全部项目 · ${rest.length}`" />
        <div class="project-grid">
          <ProjectCard v-for="p in rest" :key="p.slug" :project="p" />
        </div>
      </section>

      <EmptyState v-if="!rest.length && !featured.length" message="还没有项目" />
    </template>

    <!-- 筛选中：扁平结果 -->
    <div v-else-if="filtered.length" class="project-grid">
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
.projects-section + .projects-section {
  margin-top: var(--space-12);
}
.project-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(320px, 100%), 1fr)); /* 防 <350px 溢出 */
  gap: var(--grid-gap);
}
.project-grid--featured {
  grid-template-columns: repeat(auto-fit, minmax(min(340px, 100%), 1fr));
}
</style>
