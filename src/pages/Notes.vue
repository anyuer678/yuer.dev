<script setup>
// Notes 列表页（F06）：tag 单选过滤 + 关键词搜索 + 分页
// URL query 组合：?tag=&q=&page=（14 §5.4 同款模式）
import { computed, ref, watch, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PageHeader from '@/components/layout/PageHeader.vue'
import Tag from '@/components/ui/Tag.vue'
import NoteCard from '@/components/features/NoteCard.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import { notes, noteTags } from '@/utils/content.js'

const PAGE_SIZE = 10

// 标签分组（按主题）。命中顺序即展示顺序；未命中任何组进「其他」
const TAG_GROUPS = [
  { name: '课程学习', keys: ['课程笔记', '实验', '算法', '分治', '贪心', '动态规划', '回溯', '软件工程', '需求分析', '系统设计', 'UML', '敏捷', '编译原理', '词法分析', '语法分析', '计算机网络', 'TCP/IP', '数据结构', '线性表', '软件交互', '可用性', 'UI/UX', '人机交互', '面向对象', '继承', '多态', '教学', '想法', '实训', '团队项目'] },
  { name: '语言与框架', keys: ['Python', 'JavaScript', 'Java', 'C++', 'SystemVerilog', 'Spring Boot', 'Spring MVC', 'Spring', 'MyBatis-Plus', 'MyBatis', 'JSP', 'Flask', 'SQLAlchemy', 'Vue', 'Webpack', 'HTML', 'Qt', 'RESTful', '全栈', '前端工程化'] },
  { name: '数据库', keys: ['数据库', 'MySQL', 'SQL', 'SQLite', 'Redis', '索引', '存储', '触发器', '关系代数'] },
  { name: '系统与部署', keys: ['操作系统', 'Linux', 'Nginx', 'Docker', 'Kubernetes', '部署实践', '部署', '网络服务', 'DevOps', 'CI/CD', 'GitHub', '内存管理', '死锁', '进程', 'ChCore', 'ARM64', '页表', '微服务', '软件架构', '架构', '安全'] },
  { name: '硬件与嵌入式', keys: ['计算机组成原理', 'CPU', 'ARM', 'Zynq', 'Vivado', '嵌入式', '数字电路', 'ALU', '仿真'] },
  { name: 'AI 与工具', keys: ['AI', 'RAG', 'Ollama', 'Dify', '聊天机器人', 'MCP', '语音', '图片', '日志', '工具', '刷题', '测试', '设计', 'UI', '重构'] },
]

function groupOf(tag) {
  for (const g of TAG_GROUPS) {
    if (g.keys.some((k) => tag === k || tag.includes(k))) return g.name
  }
  return '其他'
}

// 每个标签的笔记数
const tagCounts = computed(() => {
  const m = {}
  for (const n of notes) for (const t of n.tags) m[t] = (m[t] || 0) + 1
  return m
})

// 分组后的标签（组内按笔记数降序）
const groupedTags = computed(() => {
  const byGroup = {}
  for (const t of noteTags) {
    const name = groupOf(t)
    ;(byGroup[name] ||= []).push({ label: t, count: tagCounts.value[t] })
  }
  const groups = []
  for (const g of TAG_GROUPS) {
    const tags = (byGroup[g.name] || []).sort((a, b) => b.count - a.count)
    if (tags.length) groups.push({ name: g.name, tags })
  }
  const rest = byGroup['其他'] || []
  if (rest.length) groups.push({ name: '其他', tags: rest.sort((a, b) => b.count - a.count) })
  return groups
})

const route = useRoute()
const router = useRouter()

const tag = computed(() => String(route.query.tag ?? '')) // 防数组形态 ?tag=a&tag=b
const q = computed(() => String(route.query.q ?? '').trim())

// 分组折叠：默认全部收起，只显示组标题行；选中被折叠组的标签时自动展开
const collapsedGroups = ref(new Set(TAG_GROUPS.map((g) => g.name).concat(['其他'])))
function toggleGroup(name) {
  const next = new Set(collapsedGroups.value)
  next.has(name) ? next.delete(name) : next.add(name)
  collapsedGroups.value = next
}
function isCollapsed(name) {
  return collapsedGroups.value.has(name)
}
watch(
  tag,
  (val) => {
    if (!val) return
    const g = groupedTags.value.find((grp) => grp.tags.some((t) => t.label === val))
    if (g && collapsedGroups.value.has(g.name)) {
      const next = new Set(collapsedGroups.value)
      next.delete(g.name)
      collapsedGroups.value = next
    }
  },
  { immediate: true },
)

// 先 tag 过滤，再关键词搜索（标题/摘要/标签，忽略大小写）
const filtered = computed(() => {
  let list = tag.value ? notes.filter((n) => n.tags.includes(tag.value)) : notes
  if (q.value) {
    const needle = q.value.toLowerCase()
    list = list.filter(
      (n) =>
        n.title.toLowerCase().includes(needle) ||
        n.summary.toLowerCase().includes(needle) ||
        n.tags.some((t) => t.toLowerCase().includes(needle)),
    )
  }
  return list
})

const totalPages = computed(() => Math.max(1, Math.ceil(filtered.value.length / PAGE_SIZE)))
const page = computed(() => {
  const p = parseInt(route.query.page, 10)
  return Number.isFinite(p) && p >= 1 ? Math.min(p, totalPages.value) : 1
})
const paged = computed(() => filtered.value.slice((page.value - 1) * PAGE_SIZE, page.value * PAGE_SIZE))

function goPage(n) {
  if (n < 1 || n > totalPages.value || n === page.value) return
  const query = { ...route.query }
  n === 1 ? delete query.page : (query.page = String(n))
  router.replace({ query })
}

function applyTag(next) {
  const query = { ...route.query }
  next === '' ? delete query.tag : (query.tag = next)
  delete query.page // 切换筛选回到第一页
  router.replace({ query })
}

function clearAll() {
  router.replace({ query: {} })
}

// 搜索框：本地输入 + 300ms 防抖写 query
const searchInput = ref(q.value)
let debounceTimer = null
watch(searchInput, (val) => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    const query = { ...route.query }
    const v = val.trim()
    v === '' ? delete query.q : (query.q = v)
    delete query.page
    router.replace({ query })
  }, 300)
})
// 外部导航（前进/后退、清空筛选）同步回输入框
watch(q, (val) => {
  if (searchInput.value.trim() !== val) searchInput.value = val
})
onBeforeUnmount(() => clearTimeout(debounceTimer))
</script>

<template>
  <div class="container">
    <PageHeader title="笔记" description="开发日志" :count="filtered.length">
      <template #actions>
        <input
          v-model="searchInput"
          class="note-search"
          type="search"
          placeholder="搜索标题、摘要或标签…"
          aria-label="搜索笔记"
        />
      </template>
    </PageHeader>

    <div v-if="groupedTags.length" class="note-toolbar">
      <div class="note-tags note-tags--all" role="group" aria-label="按标签筛选">
        <Tag label="全部" :clickable="true" :active="tag === ''" @click="applyTag('')" />
      </div>
      <div v-for="g in groupedTags" :key="g.name" class="tag-group">
        <button
          type="button"
          class="tag-group__head"
          :aria-expanded="!isCollapsed(g.name)"
          @click="toggleGroup(g.name)"
        >
          <span class="tag-group__name">{{ g.name }}</span>
          <span class="tag-group__meta">{{ g.tags.length }} 个标签</span>
          <span class="tag-group__arrow" :class="{ 'is-open': !isCollapsed(g.name) }">▸</span>
        </button>
        <div v-if="!isCollapsed(g.name)" class="tag-group__body" role="group" :aria-label="`${g.name}标签`">
          <Tag
            v-for="t in g.tags"
            :key="t.label"
            :label="t.label"
            :count="t.count"
            :clickable="true"
            :active="tag === t.label"
            @click="applyTag(t.label)"
          />
        </div>
      </div>
    </div>

    <div v-if="paged.length" class="note-list">
      <NoteCard v-for="n in paged" :key="n.slug" :note="n" />
    </div>
    <EmptyState v-else message="没有符合条件的笔记" action-label="清除筛选" @action="clearAll" />

    <nav v-if="totalPages > 1" class="pagination" aria-label="分页">
      <button
        type="button"
        class="pagination__btn"
        :disabled="page === 1"
        @click="goPage(page - 1)"
      >
        上一页
      </button>
      <button
        v-for="p in totalPages"
        :key="p"
        type="button"
        class="pagination__btn"
        :class="{ 'is-active': p === page }"
        :aria-current="p === page ? 'page' : undefined"
        @click="goPage(p)"
      >
        {{ p }}
      </button>
      <button
        type="button"
        class="pagination__btn"
        :disabled="page === totalPages"
        @click="goPage(page + 1)"
      >
        下一页
      </button>
    </nav>
  </div>
</template>

<style scoped>
.note-toolbar {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  margin-bottom: var(--space-6);
}
.note-search {
  width: 260px;
  max-width: 100%;
  padding: 8px 14px;
  font-family: var(--font-sans);
  font-size: var(--text-body);
  color: var(--color-text);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  transition:
    border-color var(--dur-fast) var(--ease-standard),
    box-shadow var(--dur-fast) var(--ease-standard);
}
.note-search::placeholder {
  color: var(--color-text-tertiary);
}
.note-search:focus {
  outline: none;
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px var(--color-accent-soft);
}
.note-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}
.note-tags--all {
  margin-bottom: var(--space-2);
}
.tag-group {
  border-top: 1px solid var(--color-border);
}
.tag-group__head {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  width: 100%;
  padding: var(--space-3) 0;
  font-family: var(--font-sans);
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
}
.tag-group__name {
  font-family: var(--font-display);
  font-size: var(--text-h3);
  line-height: var(--lh-h3);
  color: var(--color-text);
}
.tag-group__meta {
  font-family: var(--font-mono);
  font-size: var(--text-caption);
  color: var(--color-text-tertiary);
}
.tag-group__arrow {
  margin-left: auto;
  font-size: var(--text-caption);
  color: var(--color-text-tertiary);
  transition: transform var(--dur-fast) var(--ease-standard);
}
.tag-group__arrow.is-open {
  transform: rotate(90deg);
}
.tag-group__head:hover .tag-group__name {
  color: var(--color-accent);
}
.tag-group__body {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  padding-bottom: var(--space-4);
}
.note-list {
  display: grid;
  gap: var(--space-3);
}
.pagination {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--space-2);
  margin-top: var(--space-8);
}
.pagination__btn {
  min-width: 36px;
  min-height: 36px;
  padding: 0 12px;
  font-family: var(--font-mono);
  font-size: var(--text-caption);
  color: var(--color-text-secondary);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition:
    border-color var(--dur-fast) var(--ease-standard),
    color var(--dur-fast) var(--ease-standard);
}
.pagination__btn:hover:not(:disabled) {
  border-color: var(--color-border-strong);
  color: var(--color-text);
}
.pagination__btn.is-active {
  color: var(--color-accent);
  background: var(--color-accent-soft);
  border-color: var(--color-accent);
}
.pagination__btn:disabled {
  opacity: 0.5;
  cursor: default;
}
</style>
