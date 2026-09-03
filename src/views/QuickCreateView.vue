<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { PhArrowLeft, PhArrowUp, PhCheck, PhFilmSlate, PhImageSquare, PhMapPin, PhPlus, PhSparkle, PhTimer, PhUploadSimple, PhUsersThree } from '@phosphor-icons/vue'
import { ApiError } from '@/api/http'
import { createProject as createProjectApi, listProjects } from '@/api/projects'
import { useGsapScope } from '@/composables/useGsapScope'
import { gsap } from '@/motion/gsap'
import { motion } from '@/motion/tokens'
const router = useRouter()
const root = ref<HTMLElement | null>(null)
const background = ref<HTMLElement | null>(null)
const mode = ref<'quick' | 'pro'>('quick')
const prompt = ref('')
const city = ref('杭州')
const scene = ref('景区推荐')
const style = ref('山水风光')
const duration = ref(30)
const ratio = ref('9:16')
const isSubmitting = ref(false)
const submitError = ref('')
const showPanel = ref(false)
const hasDraft = computed(() => prompt.value.trim().length > 0 && prompt.value.trim().length <= 470)
const cities = ['杭州', '宁波', '温州', '嘉兴', '湖州', '绍兴', '金华', '衢州', '舟山', '台州', '丽水']
const suggestions = ['为西湖夏日夜游制作一支轻快的竖屏短片', '用宋韵水墨风介绍良渚古城遗址', '面向亲子家庭推荐宁波东钱湖周末路线']
const sceneValues = { 景区推荐: 'SCENIC', 城市形象: 'CITY', 节庆活动: 'FESTIVAL', 非遗文化: 'HERITAGE' } as const
const themeValues = { 山水风光: 'LANDSCAPE', 历史人文: 'HISTORY', 美食探店: 'FOOD', 夜经济: 'NIGHT' } as const
async function createProject() {
  if (!hasDraft.value || isSubmitting.value) return
  isSubmitting.value = true
  submitError.value = ''
  try {
    await createProjectApi({
      mode: mode.value === 'quick' ? '1' : '2',
      description: `【城市：${city.value}】\n${prompt.value.trim()}`,
      scene: sceneValues[scene.value as keyof typeof sceneValues],
      theme: themeValues[style.value as keyof typeof themeValues],
      duration: duration.value,
      aspectRatio: ratio.value as '9:16' | '16:9' | '1:1',
    })
    const latest = await listProjects({ pageNum: 1, pageSize: 1, orderByColumn: 'createTime', isAsc: 'desc' })
    await router.replace(latest.rows[0] ? `/studio/${latest.rows[0].projectId}` : '/projects')
  } catch (cause) {
    submitError.value = cause instanceof ApiError ? cause.message : '项目创建失败，请稍后重试。'
  } finally {
    isSubmitting.value = false
  }
}

useGsapScope(root, ({ reducedMotion }) => {
  if (reducedMotion) return
  gsap.timeline({ defaults: { ease: motion.ease.enter } })
    .from('.quick-header > *', { autoAlpha: 0, y: -10, duration: 0.42, stagger: 0.05 })
    .from('.create-copy > *', { autoAlpha: 0, y: 18, duration: 0.62, stagger: 0.08 }, '-=0.2')
    .from('.prompt-composer', { autoAlpha: 0, y: 22, scale: 0.985, duration: 0.68 }, '-=0.36')
    .from('.suggestions, .upload-strip', { autoAlpha: 0, y: 12, duration: 0.45, stagger: 0.08 }, '-=0.28')

  if (!background.value || window.matchMedia('(max-width: 900px)').matches) return
  const moveX = gsap.quickTo(background.value, 'x', { duration: 1.1, ease: 'power3.out' })
  const moveY = gsap.quickTo(background.value, 'y', { duration: 1.1, ease: 'power3.out' })
  const handlePointer = (event: PointerEvent) => {
    moveX(((event.clientX / window.innerWidth) - 0.5) * -12)
    moveY(((event.clientY / window.innerHeight) - 0.5) * -8)
  }
  window.addEventListener('pointermove', handlePointer, { passive: true })
  return () => window.removeEventListener('pointermove', handlePointer)
})
</script>
<template>
  <div ref="root" class="quick-create-page"><div ref="background" class="quick-bg" /><div class="quick-atmosphere" aria-hidden="true"><i /><i /></div>
    <header class="quick-header"><button class="back-button" aria-label="返回项目中心" @click="router.push('/projects')"><PhArrowLeft :size="21" /></button><div class="compact-brand"><span class="brand-mark"><span>浙</span></span><strong>浙旅智创</strong></div><button class="draft-save" :disabled="!hasDraft"><PhCheck :size="16" />草稿已自动保存</button></header>
    <main class="create-stage"><div class="create-copy"><span class="create-eyebrow">AIGC CITY STORYTELLING</span><div class="mode-switch"><button :class="{ active: mode === 'quick' }" @click="mode = 'quick'">极速模式</button><button :class="{ active: mode === 'pro' }" @click="mode = 'pro'">专业模式</button></div><h1>把一座城的灵感，<br /><span>变成一支好视频。</span></h1><p>说出你想表达的主题，系统会自动完成知识检索、文案、分镜与视频生成。</p></div>
      <section class="prompt-composer" :class="{ focused: showPanel }"><textarea v-model="prompt" maxlength="470" rows="5" placeholder="例如：为西湖夏日夜游制作一支 30 秒竖屏宣传片，面向年轻游客，节奏轻快..." @focus="showPanel = true" /><div class="composer-actions"><div><button disabled aria-label="素材上传接口待接入" title="后端暂未提供素材上传接口"><PhPlus :size="19" /></button><button @click="showPanel = !showPanel"><PhMapPin :size="17" />{{ city }}</button><button @click="showPanel = !showPanel"><PhFilmSlate :size="17" />{{ scene }}</button><button @click="showPanel = !showPanel"><PhSparkle :size="17" />{{ style }}</button><button @click="showPanel = !showPanel"><PhTimer :size="17" />{{ duration }}s</button><button @click="showPanel = !showPanel"><PhImageSquare :size="17" />{{ ratio }}</button></div><button class="submit-prompt" :disabled="!hasDraft || isSubmitting" aria-label="创建项目" @click="createProject"><span v-if="isSubmitting" class="button-loader" /><PhArrowUp v-else :size="20" weight="bold" /></button></div></section>
      <p v-if="submitError" class="create-error" role="alert">{{ submitError }}</p>
      <Transition name="panel-pop"><section v-if="showPanel" class="parameter-panel"><div class="city-choices"><label>城市</label><div class="choice-row"><button v-for="item in cities" :key="item" :class="{ active: city === item }" @click="city = item">{{ item }}</button></div></div><div><label>场景</label><div class="choice-row"><button v-for="item in ['景区推荐','城市形象','节庆活动','非遗文化']" :key="item" :class="{ active: scene === item }" @click="scene = item">{{ item }}</button></div></div><div><label>内容主题</label><div class="choice-row"><button v-for="item in ['山水风光','历史人文','美食探店','夜经济']" :key="item" :class="{ active: style === item }" @click="style = item">{{ item }}</button></div></div><div class="parameter-grid"><div><label>时长</label><select v-model="duration"><option :value="15">15 秒</option><option :value="30">30 秒</option><option :value="45">45 秒</option><option :value="60">60 秒</option></select></div><div><label>画幅</label><select v-model="ratio"><option>9:16</option><option>16:9</option><option>1:1</option></select></div></div></section></Transition>
      <div class="suggestions"><span>试试这样说</span><button v-for="suggestion in suggestions" :key="suggestion" @click="prompt = suggestion">{{ suggestion }}</button></div><button class="upload-strip" disabled title="后端暂未提供素材上传接口"><PhUploadSimple :size="19" /><span><strong>自有素材上传待后端接口</strong><small>项目创建已接入真实数据库，素材上传将在接口开放后启用</small></span><PhUsersThree :size="20" /></button>
    </main>
  </div>
</template>
