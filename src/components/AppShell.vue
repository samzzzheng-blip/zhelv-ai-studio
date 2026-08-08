<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { PhArchiveTray, PhBell, PhBooks, PhCaretLeft, PhCaretRight, PhCheckCircle, PhCheckSquare, PhGear, PhList, PhMagnifyingGlass, PhPlus, PhSignOut, PhSquaresFour, PhUserCircle, PhVideoCamera } from '@phosphor-icons/vue'

const collapsed = ref(false)
const mobileOpen = ref(false)
const noticeOpen = ref(false)
const userOpen = ref(false)
const globalSearch = ref('')
const searchInput = ref<HTMLInputElement | null>(null)
const route = useRoute()
const router = useRouter()
const nav = [
  { label: '项目中心', icon: PhSquaresFour, to: '/projects' },
  { label: '专业工作台', icon: PhVideoCamera, to: '/studio/p-2408-01' },
  { label: '审核中心', icon: PhCheckSquare, to: '/review' },
  { label: '导出中心', icon: PhArchiveTray, to: '/exports' },
  { label: '知识资产', icon: PhBooks, to: '/assets' },
  { label: '系统设置', icon: PhGear, to: '/settings' },
]
const pageTitle = computed(() => String(route.meta.title ?? '浙旅智创'))
function navigate(to: string) { mobileOpen.value = false; void router.push(to) }
function runSearch() {
  const query = globalSearch.value.trim()
  if (query) void router.push({ path: '/assets', query: { search: query } })
}
function handleShortcut(event: KeyboardEvent) {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault()
    searchInput.value?.focus()
  }
}
onMounted(() => window.addEventListener('keydown', handleShortcut))
onBeforeUnmount(() => window.removeEventListener('keydown', handleShortcut))
</script>

<template>
  <div class="app-frame" :class="{ 'is-collapsed': collapsed, 'has-mobile-nav': mobileOpen }">
    <aside class="sidebar" aria-label="主导航">
      <button class="brand" type="button" aria-label="返回项目中心" @click="navigate('/projects')">
        <span class="brand-mark"><span>浙</span></span>
        <span v-if="!collapsed" class="brand-copy"><strong>浙旅智创</strong><small>AI VIDEO STUDIO</small></span>
      </button>
      <nav class="nav-list">
        <button v-for="item in nav" :key="item.to" class="nav-item" :class="{ active: route.path === item.to || (item.to !== '/' && route.path.startsWith(item.to.split('/:')[0])) }" type="button" :title="collapsed ? item.label : undefined" @click="navigate(item.to)">
          <component :is="item.icon" :size="20" weight="regular" /><span v-if="!collapsed">{{ item.label }}</span>
        </button>
      </nav>
      <div class="sidebar-foot">
        <div class="org-card" :class="{ compact: collapsed }"><span class="avatar avatar--photo">文</span><span v-if="!collapsed"><strong>浙江文旅局</strong><small>内容运营组</small></span></div>
        <button class="collapse-button" type="button" :aria-label="collapsed ? '展开侧栏' : '收起侧栏'" @click="collapsed = !collapsed"><PhCaretRight v-if="collapsed" :size="18" /><PhCaretLeft v-else :size="18" /></button>
      </div>
    </aside>
    <div class="mobile-scrim" @click="mobileOpen = false" />
    <section class="app-main">
      <header class="topbar">
        <button class="icon-button mobile-menu" type="button" aria-label="打开菜单" @click="mobileOpen = true"><PhList :size="22" /></button>
        <div class="topbar-title"><span>工作台</span><strong>{{ pageTitle }}</strong></div>
        <div class="topbar-actions">
          <label class="global-search"><PhMagnifyingGlass :size="18" /><input ref="searchInput" v-model="globalSearch" aria-label="全局搜索" placeholder="搜索项目、素材或任务" @keydown.enter="runSearch" /><kbd>Ctrl K</kbd></label>
          <button class="icon-button notification" type="button" aria-label="通知" :aria-expanded="noticeOpen" @click="noticeOpen = !noticeOpen; userOpen = false"><PhBell :size="20" /><span>3</span></button>
          <button class="user-menu" type="button" :aria-expanded="userOpen" @click="userOpen = !userOpen; noticeOpen = false"><span class="avatar">林</span><span class="user-copy"><strong>林知夏</strong><small>项目管理员</small></span></button>
          <button class="primary-button top-create" type="button" @click="navigate('/create')"><PhPlus :size="17" weight="bold" />新建项目</button>
          <Transition name="panel-pop"><aside v-if="noticeOpen" class="top-popover notice-popover"><header><strong>通知</strong><button @click="noticeOpen = false">全部已读</button></header><p><PhCheckCircle :size="18" weight="fill" /><span><strong>良渚文明城市名片</strong><small>自动审核已完成，发现 2 项需确认内容</small></span></p><p><PhArchiveTray :size="18" /><span><strong>东钱湖周末漫游</strong><small>导出包已准备完成</small></span></p><p><PhBooks :size="18" /><span><strong>知识库更新</strong><small>杭州新增 12 条权威事实卡</small></span></p></aside></Transition>
          <Transition name="panel-pop"><aside v-if="userOpen" class="top-popover user-popover"><button @click="navigate('/settings'); userOpen = false"><PhUserCircle :size="18" />账户与组织</button><button @click="navigate('/login'); userOpen = false"><PhSignOut :size="18" />退出演示</button></aside></Transition>
        </div>
      </header>
      <main class="page-stage"><slot /></main>
    </section>
  </div>
</template>
