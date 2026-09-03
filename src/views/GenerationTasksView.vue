<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { PhArrowClockwise, PhCaretLeft, PhCaretRight, PhCheckCircle, PhClock, PhEye, PhMagnifyingGlass, PhPause, PhPlay, PhWarningCircle, PhX } from '@phosphor-icons/vue'
import { cancelGenerationTask, listGenerationTasks, retryGenerationTask } from '@/api/generationTasks'
import type { GenerationTask, GenerationTaskStatus } from '@/api/generationTasks'
import TaskStatusBadge from '@/components/tasks/TaskStatusBadge.vue'
import TaskDetailModal from '@/components/tasks/TaskDetailModal.vue'
import EmptyState from '@/components/EmptyState.vue'
import { useGsapScope } from '@/composables/useGsapScope'
import { gsap } from '@/motion/gsap'
import { motion } from '@/motion/tokens'

type FilterStatus = 'ALL' | GenerationTaskStatus
const route = useRoute()
const router = useRouter()
const root = ref<HTMLElement | null>(null)
const tasks = ref<GenerationTask[]>([])
const counts = ref<Record<FilterStatus, number>>({ ALL: 0, QUEUED: 0, RUNNING: 0, SUCCEEDED: 0, FAILED: 0, CANCELED: 0 })
const validStatuses: FilterStatus[] = ['ALL', 'QUEUED', 'RUNNING', 'SUCCEEDED', 'FAILED', 'CANCELED']
const routeStatus = String(route.query.status || 'ALL') as FilterStatus
const activeStatus = ref<FilterStatus>(validStatuses.includes(routeStatus) ? routeStatus : 'ALL')
const keyword = ref(String(route.query.keyword || ''))
const appliedKeyword = ref(keyword.value)
const parsedPage = Number(route.query.page || 1)
const pageNum = ref(Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1)
const pageSize = 8
const total = ref(0)
const loading = ref(true)
const refreshing = ref(false)
const error = ref('')
const selectedTask = ref<GenerationTask | null>(null)
const actionBusy = ref(false)
const notice = ref('')
let pollingTimer: number | undefined

const filters: { value: FilterStatus; label: string }[] = [
  { value: 'ALL', label: '全部' }, { value: 'QUEUED', label: '待处理' }, { value: 'RUNNING', label: '生成中' },
  { value: 'SUCCEEDED', label: '已完成' }, { value: 'FAILED', label: '失败' }, { value: 'CANCELED', label: '已取消' },
]
const pageCount = computed(() => Math.max(1, Math.ceil(total.value / pageSize)))
const visibleStart = computed(() => total.value ? (pageNum.value - 1) * pageSize + 1 : 0)
const visibleEnd = computed(() => Math.min(pageNum.value * pageSize, total.value))

useGsapScope(root, ({ reducedMotion }) => {
  if (reducedMotion) return
  gsap.timeline({ defaults: { ease: motion.ease.enter } })
    .from('.tasks-heading > div:first-child', { autoAlpha: 0, y: 14, duration: 0.5 })
    .from('.task-health', { autoAlpha: 0, clipPath: 'inset(0 12% 0 0 round 14px)', duration: 0.56 }, 0.08)
    .from('.task-filter-rail', { autoAlpha: 0, y: 10, duration: 0.4 }, 0.18)
    .from('.task-table-shell', { autoAlpha: 0, y: 15, duration: 0.48 }, 0.24)
})

function syncQuery() {
  void router.replace({ query: {
    ...(activeStatus.value === 'ALL' ? {} : { status: activeStatus.value }),
    ...(appliedKeyword.value ? { keyword: appliedKeyword.value } : {}),
    ...(pageNum.value > 1 ? { page: String(pageNum.value) } : {}),
  } })
}

async function loadTasks(background = false) {
  if (background) refreshing.value = true
  else loading.value = true
  error.value = ''
  try {
    const result = await listGenerationTasks({ pageNum: pageNum.value, pageSize, status: activeStatus.value === 'ALL' ? undefined : activeStatus.value, keyword: appliedKeyword.value })
    tasks.value = result.rows
    counts.value = result.counts
    total.value = result.total
    if (pageNum.value > pageCount.value) {
      pageNum.value = pageCount.value
      await loadTasks(background)
      return
    }
    if (background && selectedTask.value) selectedTask.value = tasks.value.find((task) => task.taskId === selectedTask.value?.taskId) ?? selectedTask.value
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : '任务数据读取失败。'
  } finally {
    loading.value = false
    refreshing.value = false
  }
}

async function setStatus(status: FilterStatus) {
  if (status === activeStatus.value) return
  activeStatus.value = status
  pageNum.value = 1
  syncQuery()
  await loadTasks()
}

async function searchTasks() {
  appliedKeyword.value = keyword.value.trim()
  pageNum.value = 1
  syncQuery()
  await loadTasks()
}

async function clearSearch() {
  keyword.value = ''
  appliedKeyword.value = ''
  pageNum.value = 1
  syncQuery()
  await loadTasks()
}

async function resetFilters() {
  keyword.value = ''
  appliedKeyword.value = ''
  activeStatus.value = 'ALL'
  pageNum.value = 1
  syncQuery()
  await loadTasks()
}

async function changePage(nextPage: number) {
  pageNum.value = Math.min(Math.max(nextPage, 1), pageCount.value)
  syncQuery()
  await loadTasks()
  await nextTick()
  root.value?.querySelector<HTMLElement>('.task-table-shell')?.focus({ preventScroll: true })
}

function showNotice(message: string) {
  notice.value = message
  window.setTimeout(() => { notice.value = '' }, 2400)
}

async function handleRetry(task: GenerationTask) {
  if (!window.confirm(`确定重新生成“${task.taskName}”吗？`)) return
  actionBusy.value = true
  try {
    await retryGenerationTask(task.taskId)
    selectedTask.value = null
    await loadTasks(true)
    showNotice('已提交重试，任务正在等待调度。')
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : '重试提交失败，请刷新后再试。'
  } finally { actionBusy.value = false }
}

async function handleCancel(task: GenerationTask) {
  if (!window.confirm(`确定取消“${task.taskName}”吗？已完成的中间结果会被保留。`)) return
  actionBusy.value = true
  try {
    await cancelGenerationTask(task.taskId)
    selectedTask.value = null
    await loadTasks(true)
    showNotice('任务已取消。')
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : '取消任务失败，请刷新后再试。'
  } finally { actionBusy.value = false }
}

function startPolling() {
  window.clearInterval(pollingTimer)
  pollingTimer = window.setInterval(() => {
    if (!document.hidden && counts.value.RUNNING > 0) void loadTasks(true)
  }, 5000)
}

watch(() => route.query, (query) => {
  const nextStatusValue = String(query.status || 'ALL') as FilterStatus
  const nextStatus = validStatuses.includes(nextStatusValue) ? nextStatusValue : 'ALL'
  const nextKeyword = String(query.keyword || '')
  const nextPageValue = Number(query.page || 1)
  const nextPage = Number.isInteger(nextPageValue) && nextPageValue > 0 ? nextPageValue : 1
  if (nextStatus === activeStatus.value && nextKeyword === appliedKeyword.value && nextPage === pageNum.value) return
  activeStatus.value = nextStatus
  appliedKeyword.value = nextKeyword
  keyword.value = nextKeyword
  pageNum.value = nextPage
  void loadTasks()
})

onMounted(async () => {
  await loadTasks()
  startPolling()
})
onBeforeUnmount(() => window.clearInterval(pollingTimer))
</script>

<template>
  <!--
  THESIS: Generation is a visible production line, not a mysterious spinner; the page puts exceptions and current stage ahead of decorative metrics.
  OWN-WORLD: Mineral teal controls, mist-white operational surfaces, wet-ink text, thin waterline dividers, and low-saturation semantic status.
  STORY: Operators scan the live queue, isolate a status, understand the blocked stage, and take a safe next action.
  FIRST VIEWPORT: A compact health strip flows directly into a status rail and a dense, legible task ledger with progress embedded in each active row.
  FORM: Operate mode, precise task-ledger extension in the established world. Seed key: tasks-ledger-20260903.
  FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
  -->
  <div ref="root" class="page generation-tasks-page">
    <section class="tasks-heading">
      <div><h1>生成任务</h1><p>跟踪每一次生成的当前节点、处理进度与异常原因。</p></div>
      <div class="task-heading-actions"><span class="demo-data-note">演示数据</span><button class="secondary-button" type="button" :disabled="refreshing" @click="loadTasks(true)"><PhArrowClockwise :size="17" :class="{ spinning: refreshing }" />{{ refreshing ? '刷新中' : '刷新状态' }}</button></div>
    </section>

    <section class="task-health" aria-label="生成任务概况">
      <div class="task-health__lead"><span><PhPlay :size="17" weight="fill" /></span><p><strong>{{ counts.RUNNING }} 个任务正在生成</strong><small>{{ counts.QUEUED }} 个等待调度，运行中任务每 5 秒自动更新</small></p></div>
      <div class="task-health__signals"><p><span class="signal-dot signal-dot--ok" /><strong>{{ counts.SUCCEEDED }}</strong><small>已完成</small></p><p><span class="signal-dot signal-dot--danger" /><strong>{{ counts.FAILED }}</strong><small>需要处理</small></p><p><PhClock :size="17" /><strong>{{ counts.ALL }}</strong><small>全部记录</small></p></div>
    </section>

    <section class="task-filter-rail">
      <div class="task-status-filters" role="group" aria-label="按状态筛选">
        <button v-for="filter in filters" :key="filter.value" type="button" :class="{ active: activeStatus === filter.value }" :aria-pressed="activeStatus === filter.value" @click="setStatus(filter.value)"><span>{{ filter.label }}</span><b>{{ counts[filter.value] }}</b></button>
      </div>
      <form class="task-search" role="search" @submit.prevent="searchTasks"><PhMagnifyingGlass :size="18" /><input v-model="keyword" aria-label="搜索生成任务" placeholder="搜索任务、项目或创建人" /><button v-if="keyword" type="button" aria-label="清空搜索" @click="clearSearch"><PhX :size="15" /></button><button type="submit">搜索</button></form>
    </section>

    <section v-if="error" class="api-alert" role="alert"><PhWarningCircle :size="20" /><span><strong>暂时无法读取任务</strong><small>{{ error }}</small></span><button @click="loadTasks()"><PhArrowClockwise :size="16" />重试</button></section>

    <section v-if="loading" class="task-table-loading" aria-label="正在加载任务"><span v-for="item in 6" :key="item" /></section>
    <section v-else-if="tasks.length" class="task-table-shell" tabindex="-1" aria-label="生成任务列表">
      <div class="task-table-head" aria-hidden="true"><span>任务 / 项目</span><span>规格</span><span>提交信息</span><span>生成进度</span><span>状态</span><span>操作</span></div>
      <article v-for="task in tasks" :key="task.taskId" class="task-row" :class="{ 'task-row--attention': task.status === 'FAILED' }">
        <div class="task-identity"><span class="task-mode" :class="{ professional: task.mode === '2' }">{{ task.mode === '1' ? '极' : '专' }}</span><p><strong>{{ task.taskName }}</strong><small>{{ task.taskId }} · {{ task.projectName }}</small></p></div>
        <div class="task-spec"><strong>{{ task.duration }}s</strong><span>{{ task.aspectRatio }}</span><small>{{ task.city }}</small></div>
        <div class="task-submission"><strong>{{ task.creatorName }}</strong><span>{{ task.createdTime }}</span><small v-if="task.retryCount">已重试 {{ task.retryCount }} 次</small></div>
        <div class="task-progress-cell"><div><strong>{{ task.currentStage }}</strong><span>{{ task.status === 'RUNNING' ? `${task.progress}%` : task.elapsed }}</span></div><div class="task-progress-track" :class="`track--${task.status.toLowerCase()}`"><i :style="{ transform: `scaleX(${task.status === 'QUEUED' ? 0 : task.progress / 100})` }" /></div><small v-if="task.status === 'FAILED'">{{ task.errorMessage }}</small></div>
        <TaskStatusBadge :status="task.status" />
        <div class="task-row-actions"><button type="button" aria-label="查看任务详情" :disabled="actionBusy" @click="selectedTask = task"><PhEye :size="17" />详情</button><button v-if="task.status === 'RUNNING' || task.status === 'QUEUED'" class="row-icon-action" type="button" aria-label="取消任务" :disabled="actionBusy" @click="handleCancel(task)"><PhPause :size="16" /></button><button v-if="task.status === 'FAILED' || task.status === 'CANCELED'" class="row-icon-action" type="button" aria-label="重新生成" :disabled="actionBusy" @click="handleRetry(task)"><PhArrowClockwise :size="16" /></button></div>
      </article>
      <footer class="task-pagination"><span>显示 {{ visibleStart }}–{{ visibleEnd }} 条，共 {{ total }} 条任务</span><div><button type="button" :disabled="pageNum === 1" aria-label="上一页" @click="changePage(pageNum - 1)"><PhCaretLeft :size="16" /></button><span>第 {{ pageNum }} / {{ pageCount }} 页</span><button type="button" :disabled="pageNum === pageCount" aria-label="下一页" @click="changePage(pageNum + 1)"><PhCaretRight :size="16" /></button></div></footer>
    </section>

    <EmptyState v-else-if="!error" title="没有找到匹配的任务" description="试试切换状态，或清空当前搜索条件。"><button class="secondary-button" type="button" @click="resetFilters">清空筛选</button></EmptyState>

    <TaskDetailModal :task="selectedTask" :busy="actionBusy" @close="selectedTask = null" @retry="handleRetry" @cancel="handleCancel" @open-project="router.push(`/studio/${$event.projectId}`)" />
    <Transition name="toast"><div v-if="notice" class="toast-message"><PhCheckCircle :size="18" weight="fill" />{{ notice }}</div></Transition>
  </div>
</template>
