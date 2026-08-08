<script setup lang="ts">
import { computed, ref } from 'vue'
import { PhCheckCircle, PhDownloadSimple, PhFileArrowDown, PhMagnifyingGlass, PhPackage, PhPlay, PhSelectionAll } from '@phosphor-icons/vue'
import { projects } from '@/data/mock'
const selected = ref<string[]>([])
const format = ref('MP4 · H.264')
const quality = ref('1080P')
const exporting = ref(false)
const success = ref(false)
const feedback = ref('')
const approved = computed(() => projects.filter((project) => project.status === 'approved' || project.status === 'review'))
const allSelected = computed(() => selected.value.length === approved.value.length)
function toggleAll() { selected.value = allSelected.value ? [] : approved.value.map((project) => project.id) }
function startExport() { if (!selected.value.length) return; exporting.value = true; window.setTimeout(() => { exporting.value = false; success.value = true }, 1300) }
function notify(message: string) { feedback.value = message; window.setTimeout(() => { feedback.value = '' }, 2200) }
</script>
<template>
  <div class="page export-page"><section class="page-heading"><div><h1>导出中心</h1><p>选择已审核版本，批量派生平台规格并打包版权资料。</p></div></section><section class="export-toolbar panel-flat"><label class="page-search"><PhMagnifyingGlass :size="18" /><input placeholder="搜索可导出项目" /></label><button @click="toggleAll"><PhSelectionAll :size="18" />{{ allSelected ? '取消全选' : '全选' }}</button><span>已选择 {{ selected.length }} 项</span></section>
    <div class="export-layout"><section class="export-grid"><article v-for="project in approved" :key="project.id" class="export-card" :class="{ selected: selected.includes(project.id) }"><label class="select-box"><input v-model="selected" type="checkbox" :value="project.id" /><span><PhCheckCircle :size="20" weight="fill" /></span></label><div class="export-media"><img :src="project.thumbnail" :alt="`${project.title} 视频封面`" /><button aria-label="播放导出预览" @click="notify(`${project.title} 预览播放已开始`)"><PhPlay :size="19" weight="fill" /></button></div><div class="export-card-copy"><div><span>{{ project.scene }}</span><small><PhCheckCircle :size="13" weight="fill" />审核通过</small></div><h2>{{ project.title }}</h2><p>{{ project.city }} / {{ project.duration }}s / {{ project.ratio }}</p><footer><span>正式版本 V3</span><button @click="selected = [project.id]; startExport()"><PhDownloadSimple :size="16" />单独导出</button></footer></div></article></section>
      <aside class="export-config panel"><header><PhPackage :size="21" /><div><strong>导出配置</strong><span>统一应用于所选项目</span></div></header><div class="config-group"><label>目标平台</label><div class="platform-options"><label><input type="checkbox" checked /><span>抖音<small>9:16</small></span></label><label><input type="checkbox" checked /><span>视频号<small>9:16</small></span></label><label><input type="checkbox" /><span>小红书<small>3:4</small></span></label><label><input type="checkbox" /><span>大屏<small>16:9</small></span></label></div></div><div class="config-group"><label>视频格式</label><select v-model="format"><option>MP4 · H.264</option><option>MP4 · H.265</option><option>MOV · ProRes</option></select></div><div class="config-group"><label>清晰度</label><div class="segmented"><button v-for="item in ['720P','1080P','4K']" :key="item" :class="{ active: quality === item }" @click="quality = item">{{ item }}</button></div></div><div class="config-group extras"><label><input type="checkbox" checked />同时导出字幕文件</label><label><input type="checkbox" checked />生成版权清单 PDF</label><label><input type="checkbox" checked />打包项目封面</label></div><div class="export-estimate"><span>预计生成</span><strong>{{ Math.max(selected.length,1) * 4 }} 个文件</strong><small>约 1.2 GB，预计 3-5 分钟</small></div><button class="primary-button export-submit" :disabled="!selected.length || exporting" @click="startExport"><span v-if="exporting" class="button-loader" /><PhFileArrowDown v-else :size="18" />{{ exporting ? '正在创建任务' : '开始批量导出' }}</button><Transition name="panel-pop"><div v-if="success" class="export-success"><PhCheckCircle :size="20" weight="fill" /><span><strong>导出任务已创建</strong><small>可在导出记录中查看进度</small></span></div></Transition></aside>
    </div><Transition name="toast"><div v-if="feedback" class="toast-message"><PhCheckCircle :size="18" weight="fill" />{{ feedback }}</div></Transition>
  </div>
</template>
