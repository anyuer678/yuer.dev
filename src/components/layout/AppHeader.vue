<script setup>
import { inject, ref, onMounted, onBeforeUnmount } from 'vue'
import { routes } from '@/router'
import Icon from '@/components/ui/Icon.vue'

const site = inject('site')
const navItems = routes.filter((r) => r.meta?.nav)

// 移动端抽屉（02 §3 / 05 §1 / 14 §5.8）
const open = ref(false)
const menuBtn = ref(null)
const drawer = ref(null)

// 焦点陷阱：抽屉打开时焦点移入首项，Tab/Shift+Tab 循环限制在抽屉内
function onKeydown(e) {
  if (!open.value) return
  if (e.key === 'Escape') {
    close()
    return
  }
  if (e.key !== 'Tab') return
  const focusables = drawer.value?.querySelectorAll('a[href], button:not([disabled])')
  if (!focusables?.length) return
  const first = focusables[0]
  const last = focusables[focusables.length - 1]
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault()
    last.focus()
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault()
    first.focus()
  }
}
function openDrawer() {
  open.value = true
  document.body.style.overflow = 'hidden' // 锁定 body 滚动
  requestAnimationFrame(() => drawer.value?.querySelector('a')?.focus()) // 焦点移入抽屉
}
function close() {
  open.value = false
  document.body.style.overflow = ''
  menuBtn.value?.focus() // 关闭后焦点回按钮
}

onMounted(() => document.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})
</script>

<template>
  <header class="app-header">
    <div class="container app-header__inner">
      <RouterLink to="/" class="app-header__brand">{{ site.brand }}</RouterLink>

      <!-- 桌面导航 -->
      <nav class="app-header__nav" aria-label="主导航">
        <RouterLink
          v-for="item in navItems"
          :key="item.name"
          :to="item.path"
          class="app-header__link"
          exact-active-class="is-active"
        >
          {{ item.meta.label }}
        </RouterLink>
      </nav>

      <!-- 移动端菜单按钮 -->
      <button
        ref="menuBtn"
        class="app-header__menu no-print"
        :aria-expanded="open"
        aria-controls="mobile-nav"
        aria-label="打开导航菜单"
        @click="open ? close() : openDrawer()"
      >
        <Icon name="menu" :size="20" aria-label="打开导航菜单" />
      </button>

      <!-- 移动端抽屉（Teleport 到 body） -->
      <Teleport to="body">
        <Transition name="drawer">
          <div v-if="open" class="drawer-overlay" @click="close" />
        </Transition>
        <Transition name="drawer">
          <nav v-if="open" id="mobile-nav" ref="drawer" class="drawer" aria-label="移动端导航">
            <RouterLink
              v-for="item in navItems"
              :key="item.name"
              :to="item.path"
              class="drawer__link"
              exact-active-class="is-active"
              @click="close"
            >
              {{ item.meta.label }}
            </RouterLink>
          </nav>
        </Transition>
      </Teleport>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(250, 250, 248, 0.9); /* 半透明 + 毛玻璃（14 §5.8） */
  -webkit-backdrop-filter: blur(8px);
  backdrop-filter: blur(8px);
  border-bottom: var(--border-default);
}
.app-header__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-6);
  height: 56px;
}
.app-header__brand {
  font-family: var(--font-display);
  font-size: var(--text-h3);
  color: var(--color-text);
  white-space: nowrap;
}
.app-header__brand:hover {
  color: var(--color-accent);
  text-decoration: none;
}
.app-header__nav {
  display: flex;
  gap: var(--space-6);
}
.app-header__link {
  font-size: var(--text-small);
  color: var(--color-text-secondary);
  padding: var(--space-2) 0;
}
.app-header__link:hover {
  color: var(--color-text);
  text-decoration: none;
}
.app-header__link.is-active {
  color: var(--color-accent);
  font-weight: 600;
}
.app-header__menu {
  display: none;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background: none;
  border: none;
  border-radius: var(--radius-sm);
  color: var(--color-text);
  cursor: pointer;
}
.app-header__menu:hover {
  background: var(--color-surface-muted);
}

/* 移动端抽屉 */
.drawer-overlay {
  position: fixed;
  inset: 0;
  z-index: 60;
  background: rgba(0, 0, 0, 0.3);
}
.drawer {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 61;
  width: min(280px, 80vw);
  padding: var(--space-6);
  background: var(--color-surface);
  box-shadow: -8px 0 24px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}
.drawer__link {
  font-size: var(--text-body);
  color: var(--color-text);
  padding: var(--space-3) var(--space-2);
  border-radius: var(--radius-sm);
}
.drawer__link:hover {
  background: var(--color-surface-muted);
  text-decoration: none;
}
.drawer__link.is-active {
  color: var(--color-accent);
  font-weight: 600;
  background: var(--color-accent-soft);
}
.drawer-enter-active,
.drawer-leave-active {
  transition: opacity var(--dur-fast) var(--ease-standard);
}
.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
}

/* 响应式：< 640px 折叠为抽屉（02 §3） */
@media (max-width: 639px) {
  .app-header__nav {
    display: none;
  }
  .app-header__menu {
    display: flex;
  }
}
</style>
