<script setup lang="ts">
import { PhCheckCircle, PhClock, PhProhibit, PhSpinnerGap, PhWarningCircle } from '@phosphor-icons/vue'
import type { GenerationTaskStatus } from '@/api/generationTasks'

defineProps<{ status: GenerationTaskStatus }>()

const config = {
  QUEUED: { label: '待处理', icon: PhClock },
  RUNNING: { label: '生成中', icon: PhSpinnerGap },
  SUCCEEDED: { label: '已完成', icon: PhCheckCircle },
  FAILED: { label: '失败', icon: PhWarningCircle },
  CANCELED: { label: '已取消', icon: PhProhibit },
} as const
</script>

<template>
  <span class="task-status" :class="`task-status--${status.toLowerCase()}`">
    <component :is="config[status].icon" :size="14" :class="{ spinning: status === 'RUNNING' }" />
    {{ config[status].label }}
  </span>
</template>
