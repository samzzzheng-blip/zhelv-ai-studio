<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { PhCheckCircle, PhDownloadSimple, PhFileArrowDown, PhMagnifyingGlass, PhPackage, PhPlay, PhSelectionAll } from '@phosphor-icons/vue'
import { projects } from '@/data/mock'
import { useGsapScope } from '@/composables/useGsapScope'
import { gsap } from '@/motion/gsap'
import { motion } from '@/motion/tokens'
const root = ref<HTMLElement | null>(null)
const selected = ref<string[]>([])
const format = ref('MP4 · H.264')
const quality = ref('1080P')
const exporting = ref(false)
const success = ref(false)
const feedback = ref('')
const progress = ref(0)
let exportTimer: number | undefined
const approved = computed(() => projects.filter((project) => project.status === 'approved' || project.status === 'review'))
const allSelected = computed(() => selected.value.length === approved.value.length)
const exportStage = computed(() => progress.value < 24 ? '准备项目文件' : progress.value < 52 ? '适配平台画幅' : progress.value < 82 ? '生成字幕与版权清单' : '打包交付文件')
const stages = ['准备文件', '平台适配', '资料生成', '打包交付']
function toggleAll() { selected.value = allSelected.value ? [] : approved.value.map((project) => project.id) }
function startExport() {
  if (!selected.value.length || exporting.value) return
  success.value = false
  exporting.value = true
  progress.value = 6
  if (exportTimer) window.clearInterval(exportTimer)
  exportTimer = window.setInterval(() => {
    progress.value = Math.min(100, progress.value + 7)
    if (progress.value >= 100) {
      if (exportTimer) window.clearInterval(exportTimer)
      exporting.value = false
      success.value = true
      const successPanel = root.value?.querySelector('.export-success')
      if (successPanel) gsap.fromTo(successPanel, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.38, ease: motion.ease.enter })
    }
  }, 170)
}
function notify(message: string) { feedback.value = message; window.setTimeout(() => { feedback.value = '' }, 2200) }

useGsapScope(root, ({ reducedMotion }) => {
  if (reducedMotion) return
  gsap.timeline({ defaults: { ease: motion.ease.enter } })
    .from('.export-toolbar', { autoAlpha: 0, y: 8, duration: 0.34 })
    .from('.export-card', { autoAlpha: 0, y: 12, duration: 0.42, stagger: 0.055 }, '-=0.16')
    .from('.export-config', { autoAlpha: 0, x: 14, duration: 0.46 }, 0.08)
})

watch(progress, (value) => {
  const fill = root.value?.querySelector('.export-job-progress i')
  if (fill) gsap.to(fill, { scaleX: value / 100, transformOrigin: 'left', duration: 0.22, ease: 'power2.out' })
})

watch(selected, () => {
  const estimate = root.value?.querySelector('.export-estimate strong')
  if (estimate && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    gsap.fromTo(estimate, { y: -4, autoAlpha: 0.4 }, { y: 0, autoAlpha: 1, duration: 0.26, ease: motion.ease.enter, clearProps: 'transform' })
  }
}, { deep: true })

onBeforeUnmount(() => { if (exportTimer) window.clearInterval(exportTimer) })
</script>
<template>
  <div ref="root" class="page export-page"><section class="page-heading"><div><h1>导出中心</h1><p>选择已审核版本，批量派生平台规格并打包版权资料。</p></div></section><section class="export-toolbar panel-flat"><label class="page-search"><PhMagnifyingGlass :size="18" /><input placeholder="搜索可导出项目" /></label><button @click="toggleAll"><PhSelectionAll :size="18" />{{ allSelected ? '取消全选' : '全选' }}</button><span>已选择 {{ selected.length }} 项</span></section>
    <div class="export-layout"><section class="export-grid"><article v-for="project in approved" :key="project.id" class="export-card" :class="{ selected: selected.includes(project.id) }"><label class="select-box"><input v-model="selected" type="checkbox" :value="project.id" :aria-label="`选择${project.title}`" /><span><PhCheckCircle :size="20" weight="fill" /></span></label><div class="export-media"><img :src="project.thumbnail" :alt="`${project.title} 视频封面`" /><button aria-label="播放导出预览" @click="notify(`${project.title} 预览播放已开始`)"><PhPlay :size="19" weight="fill" /></button></div><div class="export-card-copy"><div><span>{{ project.scene }}</span><small><PhCheckCircle :size="13" weight="fill" />审核通过</small></div><h2>{{ project.title }}</h2><p>{{ project.city }} / {{ project.duration }}s / {{ project.ratio }}</p><footer><span>正式版本 V3</span><button @click="selected = [project.id]; startExport()"><PhDownloadSimple :size="16" />单独导出</button></footer></div></article></section>
      <aside class="export-config panel"><header><PhPackage :size="21" /><div><strong>导出配置</strong><span>统一应用于所选项目</span></div></header><div class="config-group"><label>目标平台</label><div class="platform-options"><label><input type="checkbox" checked /><span>抖音<small>9:16</small></span></label><label><input type="checkbox" checked /><span>视频号<small>9:16</small></span></label><label><input type="checkbox" /><span>小红书<small>3:4</small></span></label><label><input type="checkbox" /><span>大屏<small>16:9</small></span></label></div></div><div class="config-group"><label>视频格式</label><select v-model="format"><option>MP4 · H.264</option><option>MP4 · H.265</option><option>MOV · ProRes</option></select></div><div class="config-group"><label>清晰度</label><div class="segmented"><button v-for="item in ['720P','1080P','4K']" :key="item" :class="{ active: quality === item }" @click="quality = item">{{ item }}</button></div></div><div class="config-group extras"><label><input type="checkbox" checked />同时导出字幕文件</label><label><input type="checkbox" checked />生成版权清单 PDF</label><label><input type="checkbox" checked />打包项目封面</label></div><div class="export-estimate"><span>预计生成</span><strong>{{ Math.max(selected.length,1) * 4 }} 个文件</strong><small>约 1.2 GB，预计 3-5 分钟</small></div><div v-if="exporting || success" class="export-job" :class="{ complete: success }"><header><span>{{ success ? '任务已完成' : exportStage }}</span><strong>{{ progress }}%</strong></header><div class="export-job-progress"><i /></div><div class="export-stages"><span v-for="(stage, index) in stages" :key="stage" :class="{ active: progress >= index * 25 + 6, done: progress >= (index + 1) * 25 }"><i /><small>{{ stage }}</small></span></div></div><button class="primary-button export-submit" :disabled="!selected.length || exporting" @click="startExport"><span v-if="exporting" class="button-loader" /><PhFileArrowDown v-else :size="18" />{{ exporting ? `正在导出 ${progress}%` : success ? '再次导出' : '开始批量导出' }}</button><Transition name="panel-pop"><div v-if="success" class="export-success"><PhCheckCircle :size="20" weight="fill" /><span><strong>导出文件已准备完成</strong><small>{{ Math.max(selected.length,1) * 4 }} 个文件已写入交付包</small></span></div></Transition></aside>
    </div><Transition name="toast"><div v-if="feedback" class="toast-message"><PhCheckCircle :size="18" weight="fill" />{{ feedback }}</div></Transition>
  </div>
</template>
