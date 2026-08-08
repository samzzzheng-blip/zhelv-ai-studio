<script setup lang="ts">
import type { ProjectStatus } from '@/types'
const props = defineProps<{ status: ProjectStatus }>()
const labels: Record<ProjectStatus, string> = { draft: '草稿', generating: '生成中', review: '待审核', approved: '已通过', rejected: '已驳回' }
</script>
<template><span class="status-badge" :class="`status-${props.status}`">{{ labels[props.status] }}</span></template>
