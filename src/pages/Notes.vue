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
const VISIBLE_TAGS = 10 // 筛选区默认显示的标签数，其余折叠收纳

const route = useRoute()
const router = useRouter()

const tag = computed(() => String(route.query.tag ?? '')) // 防数组形态 ?tag=a&tag=b
const q = computed(() => String(route.query.q ?? '').trim())

// 筛选区标签收纳：选中标签被折叠时自动展开
const showAllTags = ref(false)
watch(
  tag,
  (val) => {
    if (val && noteTags.indexOf(val) >= VISIBLE_TAGS) showAllTags.value = true
  },
  { immediate: true },
)
const visibleTags = computed(() => (showAllTags.value ? noteTags : noteTags.slice(0, VISIBLE_TAGS)))

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

    <div v-if="noteTags.length" class="note-toolbar">
      <div class="note-tags" role="group" aria-label="按标签筛选">
        <Tag label="全部" :clickable="true" :active="tag === ''" @click="applyTag('')" />
        <Tag
          v-for="t in visibleTags"
          :key="t"
          :label="t"
          :clickable="true"
          :active="tag === t"
          @click="applyTag(t)"
        />
      </div>
      <button v-if="noteTags.length > VISIBLE_TAGS" type="button" class="note-tags-toggle" @click="showAllTags = !showAllTags">
        {{ showAllTags ? '收起标签' : `更多标签（${noteTags.length}）` }}
      </button>
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
.note-tags-toggle {
  align-self: flex-start;
  padding: 0;
  font-family: var(--font-mono);
  font-size: var(--text-caption);
  color: var(--color-accent);
  background: none;
  border: none;
  border-bottom: 1px solid transparent;
  cursor: pointer;
  transition:
    border-color var(--dur-fast) var(--ease-standard),
    color var(--dur-fast) var(--ease-standard);
}
.note-tags-toggle:hover {
  border-bottom-color: var(--color-accent);
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
