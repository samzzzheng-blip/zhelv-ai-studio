<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import { useRouter } from 'vue-router'
import { PhClock, PhImage, PhPlay, PhPlus, PhSlidersHorizontal } from '@phosphor-icons/vue'
import StatusBadge from '@/components/StatusBadge.vue'
import EmptyState from '@/components/EmptyState.vue'
import { projects } from '@/data/mock'
import { useGsapScope } from '@/composables/useGsapScope'
import { Flip, gsap } from '@/motion/gsap'
import { motion } from '@/motion/tokens'
const router = useRouter()
const root = ref<HTMLElement | null>(null)
const projectGrid = ref<HTMLElement | null>(null)
const search = ref('')
const activeFilter = ref('全部')
const filters = ['全部', '生成中', '待审核', '已通过', '草稿']
const filtered = computed(() => projects.filter((project) => {
  const labels = { generating: '生成中', review: '待审核', approved: '已通过', draft: '草稿', rejected: '已驳回' }
  return (activeFilter.value === '全部' || labels[project.status] === activeFilter.value) && `${project.title}${project.city}${project.scene}`.toLowerCase().includes(search.value.toLowerCase())
}))

useGsapScope(root, ({ reducedMotion }) => {
  if (reducedMotion) return
  gsap.timeline({ defaults: { ease: motion.ease.enter } })
    .from('.page-heading > *', { autoAlpha: 0, y: 14, duration: 0.5, stagger: 0.06 })
    .from('.toolbar', { autoAlpha: 0, y: 10, duration: 0.38 }, '-=0.28')
    .from('.project-card, .new-project-card', { autoAlpha: 0, y: 18, duration: 0.56, stagger: motion.stagger.standard, clearProps: 'opacity,transform' }, '-=0.18')
})

async function selectFilter(filter: string) {
  if (filter === activeFilter.value) return
  const state = projectGrid.value ? Flip.getState(projectGrid.value.children) : undefined
  activeFilter.value = filter
  await nextTick()
  if (!state || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  Flip.from(state, {
    duration: motion.duration.standard,
    ease: motion.ease.move,
    absolute: true,
    stagger: motion.stagger.tight,
    onEnter: (elements) => gsap.fromTo(elements, { autoAlpha: 0, scale: 0.97 }, { autoAlpha: 1, scale: 1, duration: 0.28 }),
    onLeave: (elements) => gsap.to(elements, { autoAlpha: 0, scale: 0.97, duration: 0.18 }),
  })
}
</script>
<template>
  <div ref="root" class="page dashboard-page">
    <section class="page-heading"><div><span class="page-kicker">CITY VIDEO WORKSPACE</span><h1>项目中心</h1><p>继续创作、跟进生成进度，并处理即将进入审核的城市视频。</p></div><div class="heading-stats"><div><strong>12</strong><span>本周项目</span></div><div><strong>3</strong><span>待审核</span></div><div><strong>86%</strong><span>按时完成</span></div></div></section>
    <section class="toolbar panel-flat"><div class="filter-tabs"><button v-for="filter in filters" :key="filter" :class="{ active: activeFilter === filter }" @click="selectFilter(filter)">{{ filter }}</button></div><div class="toolbar-right"><span class="result-count">{{ filtered.length }} 个项目</span><label class="search-field"><input v-model="search" placeholder="搜索项目" /><PhSlidersHorizontal :size="18" /></label></div></section>
    <section v-if="filtered.length" ref="projectGrid" class="project-grid">
      <article v-for="project in filtered" :key="project.id" class="project-card" @click="router.push(`/studio/${project.id}`)">
        <div class="project-media"><img :src="project.thumbnail" :alt="`${project.title} 项目预览`" /><div class="project-media-top"><span>{{ project.scene }}</span><StatusBadge :status="project.status" /></div><button class="play-button" aria-label="预览视频"><PhPlay :size="18" weight="fill" /></button></div>
        <div class="project-content"><h2>{{ project.title }}</h2><p>{{ project.city }} · {{ project.style }}</p><div class="project-specs"><span><PhClock :size="14" />{{ project.duration }}s</span><span><PhImage :size="14" />{{ project.ratio }}</span><span>{{ project.owner }}</span></div><div v-if="project.status === 'generating'" class="progress-row"><div class="progress-track"><i :style="{ width: `${project.progress}%` }" /></div><span>{{ project.progress }}%</span></div><div class="project-foot"><span>更新于 {{ project.updatedAt }}</span><button>打开项目</button></div></div>
      </article>
      <button class="new-project-card" @click="router.push('/create')"><span><PhPlus :size="26" /></span><strong>创建新项目</strong><small>从场景模板或空白需求开始</small></button>
    </section>
    <EmptyState v-else title="没有匹配的项目" description="调整搜索内容或清除筛选条件后再试。"><button class="secondary-button" @click="search = ''; activeFilter = '全部'">清除筛选</button></EmptyState>
  </div>
</template>
