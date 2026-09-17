<script setup>
// Projects 列表页（F03）：query 即状态（14 §5.4 模式样板）
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PageHeader from '@/components/layout/PageHeader.vue'
import FilterBar from '@/components/features/FilterBar.vue'
import ProjectCard from '@/components/features/ProjectCard.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import SectionTitle from '@/components/ui/SectionTitle.vue'
import {
  projects,
  featuredProjects,
  productProjects,
  labProjects,
  techList,
} from '@/utils/content.js'
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

// 精选区（无筛选时展示）：flagship/featured
const featured = computed(() => featuredProjects)
// 无筛选时的三级列表；筛选中仍用 filtered 扁平展示
const productList = computed(() => productProjects)
const labList = computed(() => labProjects)

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

    <!-- 无筛选：Flagship → Product → Lab 三级（15 Wave 1.1） -->
    <template v-if="!isFiltering">
      <section v-if="featured.length" class="projects-section">
        <SectionTitle index="01" title="Flagship" />
        <div class="project-grid project-grid--featured">
          <ProjectCard v-for="p in featured" :key="p.slug" :project="p" featured />
        </div>
      </section>

      <section v-if="productList.length" class="projects-section">
        <SectionTitle index="02" :title="`产品与工具 · ${productList.length}`" />
        <div class="project-grid">
          <ProjectCard v-for="p in productList" :key="p.slug" :project="p" />
        </div>
      </section>

      <section v-if="labList.length" class="projects-section">
        <SectionTitle index="03" :title="`实验室与课程 · ${labList.length}`" />
        <details class="projects-lab">
          <summary>展开 {{ labList.length }} 项</summary>
          <div class="project-grid projects-lab__grid">
            <ProjectCard v-for="p in labList" :key="p.slug" :project="p" />
          </div>
        </details>
      </section>

      <EmptyState
        v-if="!featured.length && !productList.length && !labList.length"
        message="还没有项目"
      />
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
.projects-lab {
  margin-top: var(--space-4);
}
.projects-lab summary {
  cursor: pointer;
  font-family: var(--font-mono);
  font-size: var(--text-small);
  color: var(--color-text-secondary);
  padding: var(--space-3) 0;
  list-style-position: outside;
}
.projects-lab summary:hover {
  color: var(--color-accent);
}
.projects-lab__grid {
  margin-top: var(--space-4);
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
