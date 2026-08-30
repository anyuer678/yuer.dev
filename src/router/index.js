import { createRouter, createWebHistory } from 'vue-router'
import { applyMeta } from '@/utils/seo.js'
import Home from '@/pages/Home.vue' // 静态导入：首页是首屏，避免动态 chunk 两阶段加载造成 CLS

// 路由表：path/name/title/description 的唯一权威是 02 §2/§8（14 §5.3）
const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: {
      nav: false,
      title: (s) => `${s.brand} · ${s.tagline[0]}`,
      description: (s) => s.bio,
    },
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/pages/About.vue'),
    meta: {
      nav: true,
      label: 'About',
      title: (s) => `关于 · ${s.name}`,
      description: (s) => `${s.name} 的自我介绍`,
    },
  },
  {
    path: '/projects',
    name: 'projects',
    component: () => import('@/pages/Projects.vue'),
    meta: {
      nav: true,
      label: 'Projects',
      title: (s) => `项目 · ${s.name}`,
      description: (s) => `${s.name} 的项目档案`,
    },
  },
  {
    path: '/projects/:slug',
    name: 'project-detail',
    component: () => import('@/pages/ProjectDetail.vue'),
    meta: { nav: false }, // title/description 组件内 watchEffect（14 §5.7）
  },
  {
    path: '/timeline',
    name: 'timeline',
    component: () => import('@/pages/Timeline.vue'),
    meta: {
      nav: true,
      label: 'Timeline',
      title: (s) => `时间线 · ${s.name}`,
      description: (s) => `${s.name} 的成长时间线`,
    },
  },
  {
    path: '/notes',
    name: 'notes',
    component: () => import('@/pages/Notes.vue'),
    meta: {
      nav: true,
      label: 'Notes',
      title: (s) => `笔记 · ${s.name}`,
      description: (s) => `${s.name} 的开发日志`,
    },
  },
  {
    path: '/notes/:slug',
    name: 'note-detail',
    component: () => import('@/pages/NoteDetail.vue'),
    meta: { nav: false },
  },
  {
    path: '/lab',
    name: 'lab',
    component: () => import('@/pages/Lab.vue'),
    meta: {
      nav: true,
      label: 'Lab',
      title: (s) => `实验室 · ${s.name}`,
      description: (s) => `${s.name} 的实验小项目`,
    },
  },
  {
    path: '/contact',
    name: 'contact',
    component: () => import('@/pages/Contact.vue'),
    meta: {
      nav: true,
      label: 'Contact',
      title: (s) => `联系 · ${s.name}`,
      description: (s) => `联系 ${s.name}`,
    },
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@/pages/Dashboard.vue'),
    meta: {
      nav: false,
      title: (s) => `作品集控制面板 · ${s.name}`,
      description: (s) => `${s.name} 的项目 CI/Release 状态面板`,
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/pages/NotFound.vue'),
    meta: {
      nav: false,
      title: (s) => `页面不存在 · ${s.name}`,
      description: () => '',
    },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL), // base 来自 vite.config.js
  routes,
  scrollBehavior: () => ({ top: 0 }), // 决策 D2：不保存列表滚动位置
})

router.afterEach((to) => applyMeta(to))
// v1.1：beforeEach 处理 redirects.json（14 §5.3）；v1 无守卫

export default router
export { routes } // AppHeader 导航从路由表派生（meta.nav）
