<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { PhArrowClockwise, PhClock, PhImage, PhPlay, PhPlus, PhSlidersHorizontal, PhTrash, PhWarningCircle } from '@phosphor-icons/vue'
import StatusBadge from '@/components/StatusBadge.vue'
import EmptyState from '@/components/EmptyState.vue'
import { ApiError } from '@/api/http'
import { deleteProjects, listProjects } from '@/api/projects'
import type { Project } from '@/types'
import { toUiProject } from '@/utils/project'
import { useGsapScope } from '@/composables/useGsapScope'
import { Flip, gsap } from '@/motion/gsap'
import { motion } from '@/motion/tokens'

const router = useRouter()
const root = ref<HTMLElement | null>(null)
const projectGrid = ref<HTMLElement | null>(null)
const projects = ref<Project[]>([])
const search = ref('')
const activeFilter = ref('全部')
const loading = ref(true)
const error = ref('')
const deletingId = ref('')
const filters = ['全部', '生成中', '待审核', '已通过', '草稿']
const filtered = computed(() => projects.value.filter((project) => {
  const labels = { generating: '生成中', review: '待审核', approved: '已通过', draft: '草稿', rejected: '已驳回' }
  return (activeFilter.value === '全部' || labels[project.status] === activeFilter.value) && `${project.title}${project.city}${project.scene}`.toLowerCase().includes(search.value.toLowerCase())
}))
const reviewCount = computed(() => projects.value.filter((project) => project.status === 'review').length)
const completedRate = computed(() => projects.value.length ? Math.round(projects.value.filter((project) => project.status === 'approved').length / projects.value.length * 100) : 0)

useGsapScope(root, ({ reducedMotion }) => {
  if (reducedMotion) return
  gsap.timeline({ defaults: { ease: motion.ease.enter } })
    .from('.page-heading > *', { autoAlpha: 0, y: 14, duration: 0.5, stagger: 0.06 })
    .from('.toolbar', { autoAlpha: 0, y: 10, duration: 0.38 }, '-=0.28')
})

async function loadProjects() {
  loading.value = true
  error.value = ''
  try {
    const result = await listProjects({ pageNum: 1, pageSize: 100, orderByColumn: 'createTime', isAsc: 'desc' })
    projects.value = result.rows.map(toUiProject)
    await nextTick()
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const cards = root.value?.querySelectorAll('.project-card, .new-project-card')
      if (cards?.length) gsap.from(cards, { autoAlpha: 0, y: 18, duration: 0.56, stagger: motion.stagger.standard, clearProps: 'opacity,transform' })
    }
  } catch (cause) {
    error.value = cause instanceof ApiError ? cause.message : '项目数据加载失败。'
  } finally {
    loading.value = false
  }
}

async function selectFilter(filter: string) {
  if (filter === activeFilter.value) return
  const state = projectGrid.value ? Flip.getState(projectGrid.value.children) : undefined
  activeFilter.value = filter
  await nextTick()
  if (!state || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  Flip.from(state, { duration: motion.duration.standard, ease: motion.ease.move, absolute: true, stagger: motion.stagger.tight })
}

async function removeProject(project: Project) {
  if (!window.confirm(`确定删除“${project.title}”吗？后端将执行软删除。`)) return
  deletingId.value = project.id
  try {
    await deleteProjects([Number(project.id)])
    projects.value = projects.value.filter((item) => item.id !== project.id)
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : '删除失败。'
  } finally {
    deletingId.value = ''
  }
}

onMounted(loadProjects)
</script>

<template>
  <div ref="root" class="page dashboard-page">
    <section class="page-heading"><div><span class="page-kicker">CITY VIDEO WORKSPACE</span><h1>项目中心</h1><p>真实读取当前账号权限范围内的项目，继续创作并跟进状态。</p></div><div class="heading-stats"><div><strong>{{ projects.length }}</strong><span>全部项目</span></div><div><strong>{{ reviewCount }}</strong><span>待审核</span></div><div><strong>{{ completedRate }}%</strong><span>审核通过</span></div></div></section>
    <section class="toolbar panel-flat"><div class="filter-tabs"><button v-for="filter in filters" :key="filter" :class="{ active: activeFilter === filter }" @click="selectFilter(filter)">{{ filter }}</button></div><div class="toolbar-right"><span class="result-count">{{ filtered.length }} 个项目</span><label class="search-field"><input v-model="search" placeholder="搜索项目" /><PhSlidersHorizontal :size="18" /></label></div></section>
    <section v-if="error" class="api-alert" role="alert"><PhWarningCircle :size="20" /><span><strong>暂时无法读取项目</strong><small>{{ error }}</small></span><button @click="loadProjects"><PhArrowClockwise :size="16" />重试</button></section>
    <section v-if="loading" class="project-loading" aria-label="正在加载项目"><span v-for="item in 3" :key="item" /></section>
    <section v-else-if="filtered.length" ref="projectGrid" class="project-grid">
      <article v-for="project in filtered" :key="project.id" class="project-card" @click="router.push(`/studio/${project.id}`)">
        <div class="project-media"><img :src="project.thumbnail" :alt="`${project.title} 项目预览`" /><div class="project-media-top"><span>{{ project.scene }}</span><StatusBadge :status="project.status" /></div><button class="play-button" aria-label="打开项目"><PhPlay :size="18" weight="fill" /></button></div>
        <div class="project-content"><h2>{{ project.title }}</h2><p>{{ project.city }} · {{ project.style }}</p><div class="project-specs"><span><PhClock :size="14" />{{ project.duration }}s</span><span><PhImage :size="14" />{{ project.ratio }}</span><span>{{ project.owner }}</span></div><div v-if="project.status === 'generating'" class="progress-row"><div class="progress-track"><i :style="{ width: `${project.progress}%` }" /></div><span>{{ project.progress }}%</span></div><div class="project-foot"><span>更新于 {{ project.updatedAt }}</span><span class="project-actions"><button @click.stop="router.push(`/studio/${project.id}`)">打开项目</button><button class="danger-action" :disabled="deletingId === project.id" aria-label="删除项目" @click.stop="removeProject(project)"><PhTrash :size="15" /></button></span></div></div>
      </article>
      <button class="new-project-card" @click="router.push('/create')"><span><PhPlus :size="26" /></span><strong>创建新项目</strong><small>从场景模板或空白需求开始</small></button>
    </section>
    <EmptyState v-else-if="!error" title="还没有项目" description="创建第一个真实项目，它会保存到后端数据库。"><button class="primary-button" @click="router.push('/create')"><PhPlus :size="17" />创建项目</button></EmptyState>
  </div>
</template>
