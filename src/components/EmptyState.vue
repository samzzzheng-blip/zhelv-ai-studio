<script setup lang="ts">
import { PhFolderDashed } from '@phosphor-icons/vue'
defineProps<{ title: string; description: string }>()
</script>
<template><div class="empty-state"><span><PhFolderDashed :size="30" /></span><strong>{{ title }}</strong><p>{{ description }}</p><slot /></div></template>
