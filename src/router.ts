import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from './views/DashboardView.vue'
import QuickCreateView from './views/QuickCreateView.vue'
import StudioView from './views/StudioView.vue'
import ReviewView from './views/ReviewView.vue'
import ExportView from './views/ExportView.vue'
import SettingsView from './views/SettingsView.vue'
import AssetsView from './views/AssetsView.vue'
import LoginView from './views/LoginView.vue'

export const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'login', component: LoginView, meta: { title: '登录', standalone: true } },
  { path: '/projects', name: 'dashboard', component: DashboardView, meta: { title: '项目中心' } },
  { path: '/create', name: 'create', component: QuickCreateView, meta: { title: '创建视频', standalone: true } },
  { path: '/studio/:id?', name: 'studio', component: StudioView, meta: { title: '专业工作台' } },
  { path: '/review', name: 'review', component: ReviewView, meta: { title: '审核中心' } },
  { path: '/exports', name: 'exports', component: ExportView, meta: { title: '导出中心' } },
  { path: '/assets', name: 'assets', component: AssetsView, meta: { title: '知识资产中心' } },
  { path: '/settings', name: 'settings', component: SettingsView, meta: { title: '系统设置' } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

router.afterEach((to) => {
  document.title = `${String(to.meta.title ?? '工作台')} | 浙旅智创`
})

export default router
