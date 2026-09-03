<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import { PhArrowClockwise, PhArrowRight, PhCaretRight, PhChatCircleText, PhCheckCircle, PhClockCountdown, PhCornersOut, PhDotsThree, PhPaperPlaneTilt, PhPause, PhPlay, PhSparkle, PhWarningCircle } from '@phosphor-icons/vue'
import { nodes } from '@/data/mock'
import { useGsapScope } from '@/composables/useGsapScope'
import { gsap } from '@/motion/gsap'
import { motion } from '@/motion/tokens'
const root = ref<HTMLElement | null>(null)
const selectedId = ref('media')
const chat = ref('')
const toast = ref('')
const selected = computed(() => nodes.find((node) => node.id === selectedId.value) ?? nodes[0])
function notify(message: string) { toast.value = message; window.setTimeout(() => { toast.value = '' }, 2400) }

useGsapScope(root, ({ reducedMotion }) => {
  if (reducedMotion) return
  const timeline = gsap.timeline({ defaults: { ease: motion.ease.enter } })
  timeline
    .from('.studio-heading > *', { autoAlpha: 0, y: 12, duration: 0.42, stagger: 0.06 })
    .from('.workspace-header', { autoAlpha: 0, y: 8, duration: 0.34 }, '-=0.2')
    .from('.node-card', { autoAlpha: 0, x: -14, duration: 0.42, stagger: 0.075 }, '-=0.14')
    .from('.node-arrow', { autoAlpha: 0, scaleX: 0, transformOrigin: 'left center', duration: 0.28, stagger: 0.075 }, '<0.08')
    .from('.node-detail', { autoAlpha: 0, y: 14, duration: 0.46 }, '-=0.18')
    .from('.copilot-panel', { autoAlpha: 0, x: 16, duration: 0.48 }, 0.16)
    .fromTo('.node-progress i', { scaleX: 0 }, { scaleX: 0.68, transformOrigin: 'left', duration: 0.9, ease: 'power2.inOut' }, '-=0.3')
    .fromTo('.node-running .node-status-icon', { boxShadow: '0 0 0 0 rgba(57,127,122,0)' }, { boxShadow: '0 0 0 7px rgba(57,127,122,0)', duration: 0.8, repeat: 1 }, '<')
})

async function selectNode(id: string) {
  if (id === selectedId.value) return
  const detail = root.value?.querySelector('.node-detail')
  if (detail && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    await gsap.to(detail, { autoAlpha: 0, x: 10, duration: 0.16, ease: motion.ease.exit })
  }
  selectedId.value = id
  await nextTick()
  if (detail) gsap.fromTo(detail, { autoAlpha: 0, x: -10 }, { autoAlpha: 1, x: 0, duration: 0.34, ease: motion.ease.enter, clearProps: 'transform' })
  const activeCard = root.value?.querySelector('.node-card.selected')
  if (activeCard) gsap.fromTo(activeCard, { scale: 0.985 }, { scale: 1, duration: 0.32, ease: motion.ease.enter, clearProps: 'transform' })
}
</script>
<template>
  <div ref="root" class="page studio-page">
    <section class="studio-heading"><div><p class="breadcrumb"><span>项目中心</span><PhCaretRight :size="14" />西湖十景夏日特辑</p><h1>专业工作台</h1></div><div class="studio-actions"><span class="autosave"><PhCheckCircle :size="16" weight="fill" />已保存</span><button class="secondary-button" @click="notify('任务已暂停，可随时继续')"><PhPause :size="16" />暂停任务</button><button class="primary-button" @click="notify('已提交预览渲染')"><PhPlay :size="16" weight="fill" />生成预览</button></div></section>
    <div class="studio-layout"><section class="pipeline-workspace"><div class="workspace-header"><div><strong>生成流程</strong><span>4 / 5 节点已启动</span></div><button class="icon-button" aria-label="更多选项" @click="notify('流程操作菜单已打开')"><PhDotsThree :size="20" /></button></div>
      <div class="node-grid"><template v-for="(node, index) in nodes" :key="node.id"><article class="node-card" :class="[`node-${node.status}`, { selected: selectedId === node.id }]" :aria-current="selectedId === node.id ? 'step' : undefined" @click="selectNode(node.id)"><div class="node-status-icon"><PhCheckCircle v-if="node.status === 'done'" :size="18" weight="fill" /><PhClockCountdown v-else-if="node.status === 'running'" :size="18" /><PhWarningCircle v-else-if="node.status === 'warning'" :size="18" /><span v-else>{{ index + 1 }}</span></div><div><h2>{{ node.title }}</h2><p>{{ node.description }}</p></div><button class="icon-button" aria-label="展开节点" @click.stop="selectNode(node.id)"><PhCornersOut :size="17" /></button><div v-if="node.status === 'running'" class="node-progress"><i /><span>68%</span></div></article><PhArrowRight v-if="index < nodes.length - 1" class="node-arrow" :size="20" /></template></div>
      <div class="node-detail"><header><div><span class="detail-icon"><PhSparkle :size="20" /></span><div><h3>{{ selected.title }}</h3><p>{{ selected.description }}</p></div></div><button class="secondary-button" @click="notify('已创建新的节点版本')"><PhArrowClockwise :size="16" />局部重生成</button></header><div class="detail-content"><div class="detail-copy"><h4>当前节点内容</h4><p>{{ selected.detail }}</p><div class="fact-strip"><PhCheckCircle :size="17" weight="fill" /><span>已关联 12 张事实卡片，全部来自官方或权威来源</span><button @click="notify('已打开 12 张事实来源卡片')">查看来源</button></div></div><div class="video-preview"><img src="/images/zhejiang-mist-lake.png" alt="西湖项目视频预览画面" /><button aria-label="播放预览" @click="notify('预览播放已开始')"><PhPlay :size="24" weight="fill" /></button><span>00:31 / 01:00</span></div></div></div>
    </section>
    <aside class="copilot-panel"><header><div><PhChatCircleText :size="20" /><div><strong>创作助手</strong><span>已读取当前项目上下文</span></div></div><button class="icon-button" aria-label="助手选项" @click="notify('助手设置已打开')"><PhDotsThree :size="20" /></button></header><div class="chat-stream"><div class="assistant-message"><span class="assistant-avatar"><PhSparkle :size="17" /></span><div><p>音视频节点已完成 5 个镜头。镜头 5 的云层补帧存在轻微跳动，我建议只重生成这一段。</p><button @click="notify('已定位镜头 5')">定位镜头 5</button></div></div><div class="assistant-message"><span class="assistant-avatar"><PhSparkle :size="17" /></span><div><p>旁白中的景区开放时间与最新事实卡片不一致，已在审核中心预先标记。</p></div></div></div><div class="quick-prompts"><button @click="chat = '让镜头节奏更轻快一些'">调整节奏</button><button @click="chat = '检查整片的风格一致性'">检查风格</button><button @click="chat = '说明这次生成使用了哪些素材'">素材溯源</button></div><form class="chat-composer" @submit.prevent="notify('创作建议已发送'); chat = ''"><textarea v-model="chat" rows="3" placeholder="描述你想修改的内容..." /><div><span>按 Enter 发送</span><button type="submit" :disabled="!chat.trim()"><PhPaperPlaneTilt :size="18" weight="fill" /></button></div></form></aside></div>
    <Transition name="toast"><div v-if="toast" class="toast-message"><PhCheckCircle :size="18" weight="fill" />{{ toast }}</div></Transition>
  </div>
</template>
