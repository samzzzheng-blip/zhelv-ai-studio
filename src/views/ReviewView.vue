<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import { PhCheckCircle, PhCircle, PhClock, PhFileText, PhMagnifyingGlass, PhPlay, PhShieldCheck, PhWarningCircle, PhXCircle } from '@phosphor-icons/vue'
import { projects, risks } from '@/data/mock'
import { useGsapScope } from '@/composables/useGsapScope'
import { gsap } from '@/motion/gsap'
import { motion } from '@/motion/tokens'
const root = ref<HTMLElement | null>(null)
const selectedProject = ref(projects[1])
const decision = ref<'approve' | 'reject' | null>(null)
const note = ref('')
const activeRisk = ref(risks[0].id)
const sourceOpen = ref(false)
const feedback = ref('')
const resolvedRisks = ref<string[]>([])
const currentRisk = computed(() => risks.find((risk) => risk.id === activeRisk.value) ?? risks[0])
const riskProgress = computed(() => ({ r1: 40, r2: 86, r3: 16 }[activeRisk.value] ?? 42))
function notify(message: string) { feedback.value = message; window.setTimeout(() => { feedback.value = '' }, 2200) }

useGsapScope(root, ({ reducedMotion }) => {
  const progress = riskProgress.value / 100
  gsap.set('.timeline-fill', { scaleX: progress, transformOrigin: 'left' })
  const track = root.value?.querySelector<HTMLElement>('.timeline-track')
  if (track) gsap.set('.timeline-marker', { x: track.clientWidth * progress })
  if (reducedMotion) return
  gsap.timeline({ defaults: { ease: motion.ease.enter } })
    .from('.review-queue', { autoAlpha: 0, x: -14, duration: 0.42 })
    .from('.review-video', { autoAlpha: 0, clipPath: 'inset(0 0 14% 0 round 12px)', duration: 0.55 }, 0.08)
    .from('.risk-summary > div', { autoAlpha: 0, y: 10, duration: 0.34, stagger: 0.045 }, 0.2)
    .from('.risk-list button', { autoAlpha: 0, y: 8, duration: 0.32, stagger: 0.045 }, 0.28)
    .from('.review-detail', { autoAlpha: 0, x: 14, duration: 0.46 }, 0.14)
})

async function selectRisk(id: string) {
  if (id === activeRisk.value) return
  const detail = root.value?.querySelector('.risk-detail')
  const fill = root.value?.querySelector('.timeline-fill')
  const marker = root.value?.querySelector('.timeline-marker')
  const track = root.value?.querySelector<HTMLElement>('.timeline-track')
  const progress = ({ r1: 40, r2: 86, r3: 16 }[id] ?? 42) / 100
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!reduced) {
    const timeline = gsap.timeline({ defaults: { ease: motion.ease.move } })
    if (fill) timeline.to(fill, { scaleX: progress, duration: 0.42, transformOrigin: 'left' }, 0)
    if (marker) timeline.to(marker, { x: (track?.clientWidth ?? 0) * progress, duration: 0.42 }, 0)
    timeline.to('.review-focus-tag', { autoAlpha: 0, y: -5, duration: 0.14 }, 0)
    if (detail) timeline.to(detail, { autoAlpha: 0, x: 8, duration: 0.14 }, 0)
  }
  activeRisk.value = id
  sourceOpen.value = false
  await nextTick()
  if (!reduced) {
    if (detail) gsap.fromTo(detail, { autoAlpha: 0, x: -8 }, { autoAlpha: 1, x: 0, duration: 0.3, ease: motion.ease.enter, clearProps: 'transform' })
    gsap.fromTo('.review-focus-tag', { autoAlpha: 0, y: 6 }, { autoAlpha: 1, y: 0, duration: 0.3, ease: motion.ease.enter })
    gsap.fromTo('.review-video img', { filter: 'brightness(1.12)' }, { filter: 'brightness(1)', duration: 0.55 })
  }
}

function toggleResolved() {
  const id = activeRisk.value
  resolvedRisks.value = resolvedRisks.value.includes(id) ? resolvedRisks.value.filter((item) => item !== id) : [...resolvedRisks.value, id]
  const card = root.value?.querySelector(`[data-risk="${id}"]`)
  if (card) gsap.fromTo(card, { scale: 0.98 }, { scale: 1, duration: 0.32, ease: motion.ease.enter, clearProps: 'transform' })
}

function selectProject(project: (typeof projects)[number]) {
  selectedProject.value = project
  const image = root.value?.querySelector('.review-video img')
  if (image) gsap.fromTo(image, { autoAlpha: 0.45, scale: 1.025 }, { autoAlpha: 1, scale: 1, duration: 0.45, ease: motion.ease.enter, clearProps: 'transform' })
}
</script>
<template>
  <div ref="root" class="page review-page"><section class="page-heading"><div><h1>审核中心</h1><p>集中核对事实、文化表述、内容安全与素材版权。</p></div><label class="page-search"><PhMagnifyingGlass :size="18" /><input placeholder="搜索待审核项目" /></label></section>
    <div class="review-layout"><aside class="review-queue panel"><header><div><strong>待审核项目</strong><span>3 项</span></div><button>按提交时间</button></header><button v-for="project in projects.slice(1,4)" :key="project.id" class="queue-item" :class="{ active: selectedProject.id === project.id }" @click="selectProject(project)"><img :src="project.thumbnail" alt="" /><span><strong>{{ project.title }}</strong><small>{{ project.city }} · {{ project.duration }}s</small></span><PhClock :size="16" /></button></aside>
      <section class="review-canvas"><div class="review-video"><img :src="selectedProject.thumbnail" :alt="`${selectedProject.title} 审核预览`" /><b class="review-focus-tag"><PhWarningCircle :size="14" weight="fill" />定位 {{ currentRisk.timecode }}</b><button aria-label="播放审核预览" @click="notify('审核预览播放已开始')"><PhPlay :size="28" weight="fill" /></button><div class="timeline"><span>00:00</span><div class="timeline-track"><i class="timeline-fill" /><i class="timeline-marker" /></div><span>00:45</span></div></div><div class="risk-summary"><div><span class="risk-number high">1</span><p><strong>高风险</strong><small>提交前必须处理</small></p></div><div><span class="risk-number medium">1</span><p><strong>需关注</strong><small>建议人工确认</small></p></div><div><span class="risk-number low">1</span><p><strong>低风险</strong><small>可优化表达</small></p></div><div><PhShieldCheck :size="28" /><p><strong>画面安全通过</strong><small>未发现违规内容</small></p></div></div><div class="risk-list"><button v-for="risk in risks" :key="risk.id" :data-risk="risk.id" :class="[`risk-${risk.level}`, { active: activeRisk === risk.id, resolved: resolvedRisks.includes(risk.id) }]" @click="selectRisk(risk.id)"><PhCheckCircle v-if="resolvedRisks.includes(risk.id)" :size="20" weight="fill" /><PhWarningCircle v-else :size="20" weight="fill" /><span><strong>{{ risk.title }}</strong><small>{{ risk.category }} · {{ risk.timecode }}</small></span><PhCheckCircle v-if="risk.level === 'low' || resolvedRisks.includes(risk.id)" :size="18" /></button></div></section>
      <aside class="review-detail panel"><header><PhFileText :size="20" /><strong>审核详情</strong></header><div class="project-facts"><dl><dt>提交人</dt><dd>{{ selectedProject.owner }}</dd><dt>城市</dt><dd>{{ selectedProject.city }}</dd><dt>画幅</dt><dd>{{ selectedProject.ratio }}</dd><dt>时长</dt><dd>{{ selectedProject.duration }} 秒</dd></dl></div><div class="risk-detail"><span :class="`level-${currentRisk.level}`">{{ currentRisk.level === 'high' ? '高风险' : currentRisk.level === 'medium' ? '需关注' : '低风险' }}</span><h2>{{ currentRisk.title }}</h2><p>{{ currentRisk.description }}</p><div class="risk-detail-actions"><button @click="sourceOpen = !sourceOpen">{{ sourceOpen ? '收起来源卡片' : '打开来源卡片' }}</button><button class="resolve-risk" :class="{ resolved: resolvedRisks.includes(activeRisk) }" @click="toggleResolved"><PhCheckCircle :size="15" />{{ resolvedRisks.includes(activeRisk) ? '已处理' : '标记已处理' }}</button></div><p v-if="sourceOpen" class="source-note">浙江省文化和旅游厅官方资料卡 · 更新于 2026-08</p></div><div class="review-decision"><label>审核结论</label><div><button :class="{ active: decision === 'approve' }" @click="decision = 'approve'"><PhCheckCircle :size="18" />通过</button><button :class="{ active: decision === 'reject' }" @click="decision = 'reject'"><PhXCircle :size="18" />驳回</button></div><textarea v-model="note" rows="4" placeholder="填写审核意见与修改建议..." /><button class="primary-button" :disabled="!decision" @click="notify(decision === 'approve' ? '审核已通过并进入导出中心' : '项目已驳回至创作工作台')">提交审核结果</button></div><div class="history"><strong>审核记录</strong><p><PhCircle :size="12" weight="fill" /><span>自动审核完成<small>今天 09:42</small></span></p><p><PhCircle :size="12" weight="fill" /><span>周亦安提交审核<small>今天 09:38</small></span></p></div></aside>
    </div><Transition name="toast"><div v-if="feedback" class="toast-message"><PhCheckCircle :size="18" weight="fill" />{{ feedback }}</div></Transition>
  </div>
</template>
