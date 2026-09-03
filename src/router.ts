import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from './views/DashboardView.vue'
import QuickCreateView from './views/QuickCreateView.vue'
import StudioView from './views/StudioView.vue'
import ReviewView from './views/ReviewView.vue'
import ExportView from './views/ExportView.vue'
import SettingsView from './views/SettingsView.vue'
import AssetsView from './views/AssetsView.vue'
import LoginView from './views/LoginView.vue'
import GenerationTasksView from './views/GenerationTasksView.vue'
import { getToken } from './api/http'

export const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'login', component: LoginView, meta: { title: '登录', standalone: true } },
  { path: '/projects', name: 'dashboard', component: DashboardView, meta: { title: '项目中心', requiresAuth: true } },
  { path: '/tasks', name: 'generation-tasks', component: GenerationTasksView, meta: { title: '生成任务', requiresAuth: true } },
  { path: '/create', name: 'create', component: QuickCreateView, meta: { title: '创建视频', standalone: true, requiresAuth: true } },
  { path: '/studio/:id?', name: 'studio', component: StudioView, meta: { title: '专业工作台', requiresAuth: true } },
  { path: '/review', name: 'review', component: ReviewView, meta: { title: '审核中心', requiresAuth: true } },
  { path: '/exports', name: 'exports', component: ExportView, meta: { title: '导出中心', requiresAuth: true } },
  { path: '/assets', name: 'assets', component: AssetsView, meta: { title: '知识资产中心', requiresAuth: true } },
  { path: '/settings', name: 'settings', component: SettingsView, meta: { title: '系统设置', requiresAuth: true } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

router.beforeEach((to) => {
  const authenticated = Boolean(getToken())
  if (to.meta.requiresAuth && !authenticated) return { name: 'login', query: { redirect: to.fullPath } }
  if (to.name === 'login' && authenticated) return { name: 'dashboard' }
  return true
})

router.afterEach((to) => {
  document.title = `${String(to.meta.title ?? '工作台')} | 浙旅智创`
})

window.addEventListener('zlzc:auth-expired', () => {
  if (router.currentRoute.value.name !== 'login') void router.replace({ name: 'login', query: { expired: '1' } })
})

export default router
