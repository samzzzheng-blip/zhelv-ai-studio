<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { PhArrowClockwise, PhCheck, PhCheckCircle, PhCopy, PhDownloadSimple, PhFileVideo, PhInfo, PhSpinnerGap, PhWarningCircle, PhX } from '@phosphor-icons/vue'
import type { GenerationStage, GenerationTask } from '@/api/generationTasks'
import TaskStatusBadge from './TaskStatusBadge.vue'

const props = defineProps<{ task: GenerationTask | null; busy?: boolean }>()
const emit = defineEmits<{ close: []; retry: [task: GenerationTask]; cancel: [task: GenerationTask]; openProject: [task: GenerationTask] }>()
const closeButton = ref<HTMLButtonElement | null>(null)
const copied = ref(false)
let previousFocus: HTMLElement | null = null

const canRetry = computed(() => props.task?.status === 'FAILED' || props.task?.status === 'CANCELED')
const canCancel = computed(() => props.task?.status === 'QUEUED' || props.task?.status === 'RUNNING')
const statusLabel = (status: GenerationStage['status']) => ({ DONE: '已完成', RUNNING: '执行中', WAITING: '等待中', FAILED: '执行失败', SKIPPED: '已跳过' }[status])

async function copyTaskId() {
  if (!props.task) return
  await navigator.clipboard?.writeText(props.task.taskId)
  copied.value = true
  window.setTimeout(() => { copied.value = false }, 1600)
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') emit('close')
  if (event.key !== 'Tab' || !props.task) return
  const modal = closeButton.value?.closest<HTMLElement>('.task-modal')
  const focusable = Array.from(modal?.querySelectorAll<HTMLElement>('button:not(:disabled), [href], input:not(:disabled), [tabindex]:not([tabindex="-1"])') ?? [])
  const first = focusable[0]
  const last = focusable[focusable.length - 1]
  if (!first || !last) return
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first.focus()
  }
}

watch(() => props.task, async (task) => {
  document.body.style.overflow = task ? 'hidden' : ''
  if (task) {
    previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
    await nextTick().then(() => closeButton.value?.focus())
  } else {
    previousFocus?.focus()
    previousFocus = null
  }
}, { immediate: true })

onMounted(() => window.addEventListener('keydown', handleKeydown))
onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <Transition name="task-modal">
      <div v-if="task" class="task-modal-layer" @mousedown.self="emit('close')">
        <section class="task-modal" role="dialog" aria-modal="true" :aria-labelledby="`task-title-${task.taskId}`">
          <header class="task-modal__header">
            <div>
              <h2 :id="`task-title-${task.taskId}`">{{ task.taskName }}</h2>
              <button class="task-id-copy" type="button" @click="copyTaskId">
                <span>{{ task.taskId }}</span><PhCheck v-if="copied" :size="14" /><PhCopy v-else :size="14" />{{ copied ? '已复制' : '复制' }}
              </button>
            </div>
            <div class="task-modal__status"><span class="demo-data-note">演示数据</span><TaskStatusBadge :status="task.status" /><button ref="closeButton" class="task-modal__close" type="button" aria-label="关闭详情" @click="emit('close')"><PhX :size="20" /></button></div>
          </header>

          <div class="task-modal__body">
            <section class="task-overview" aria-label="任务概览">
              <dl>
                <div><dt>所属项目</dt><dd>{{ task.projectName }}</dd></div>
                <div><dt>城市与规格</dt><dd>{{ task.city }} · {{ task.duration }}s · {{ task.aspectRatio }}</dd></div>
                <div><dt>生成模式</dt><dd>{{ task.mode === '1' ? '极速模式' : '专业模式' }}</dd></div>
                <div><dt>创建人</dt><dd>{{ task.creatorName }}</dd></div>
                <div><dt>提交时间</dt><dd>{{ task.createdTime }}</dd></div>
                <div><dt>总耗时</dt><dd>{{ task.elapsed }}</dd></div>
              </dl>
              <div v-if="task.status === 'RUNNING'" class="task-live-progress">
                <span><PhSpinnerGap :size="17" class="spinning" />{{ task.currentStage }}</span><strong>{{ task.progress }}%</strong>
                <div><i :style="{ transform: `scaleX(${task.progress / 100})` }" /></div>
              </div>
            </section>

            <section class="task-detail-section">
              <header><div><h3>生成流程</h3><p>每一步的执行状态与耗时都会保留在任务中。</p></div><span>{{ task.stages.filter((item) => item.status === 'DONE').length }}/{{ task.stages.length }} 完成</span></header>
              <ol class="task-pipeline">
                <li v-for="(item, index) in task.stages" :key="item.key" :class="`stage--${item.status.toLowerCase()}`">
                  <span class="stage-marker"><PhCheck v-if="item.status === 'DONE'" :size="14" weight="bold" /><PhWarningCircle v-else-if="item.status === 'FAILED'" :size="15" weight="fill" /><PhSpinnerGap v-else-if="item.status === 'RUNNING'" :size="15" class="spinning" /><span v-else>{{ index + 1 }}</span></span>
                  <div class="stage-copy"><div><strong>{{ item.name }}</strong><span>{{ statusLabel(item.status) }}<template v-if="item.duration"> · {{ item.duration }}</template></span></div><p>{{ item.message || item.description }}</p><div v-if="item.status === 'RUNNING'" class="stage-progress"><i :style="{ transform: `scaleX(${item.progress / 100})` }" /></div></div>
                </li>
              </ol>
            </section>

            <section v-if="task.status === 'FAILED'" class="task-error-panel" role="alert">
              <PhWarningCircle :size="22" weight="fill" />
              <div><span>失败原因 · {{ task.errorCode }}</span><strong>{{ task.errorMessage }}</strong><p>建议检查异常节点后重新生成；已完成的节点结果将被保留。</p></div>
            </section>

            <section v-if="task.status === 'SUCCEEDED'" class="task-output-panel">
              <span><PhFileVideo :size="24" /></span>
              <div><small>最终成片</small><strong>{{ task.outputName }}</strong><p>{{ task.outputSize }} · {{ task.aspectRatio }} · H.264</p></div>
              <button type="button" disabled title="演示页暂无真实文件"><PhDownloadSimple :size="17" />查看成片</button>
            </section>

            <section class="task-run-meta">
              <PhInfo :size="18" />
              <p><strong>执行记录</strong><span>开始 {{ task.startedTime || '尚未开始' }} · 结束 {{ task.finishedTime || '—' }} · 第 {{ task.retryCount + 1 }} 次执行</span></p>
            </section>
          </div>

          <footer class="task-modal__footer">
            <span>数据将在后端任务接口提供后切换为实时状态。</span>
            <div><button class="secondary-button" type="button" @click="emit('close')">关闭</button><button v-if="canCancel" class="danger-outline-button" type="button" :disabled="busy" @click="emit('cancel', task)"><PhX :size="16" />{{ busy ? '正在取消' : '取消任务' }}</button><button v-if="canRetry" class="primary-button" type="button" :disabled="busy" @click="emit('retry', task)"><PhArrowClockwise :size="16" />{{ busy ? '正在提交' : '重新生成' }}</button><button v-if="task.status === 'SUCCEEDED'" class="primary-button" type="button" @click="emit('openProject', task)"><PhCheckCircle :size="16" />打开项目</button></div>
          </footer>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>
