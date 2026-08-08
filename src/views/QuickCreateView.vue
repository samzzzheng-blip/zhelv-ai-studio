<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { PhArrowLeft, PhArrowUp, PhCheck, PhFilmSlate, PhImageSquare, PhMapPin, PhPlus, PhSparkle, PhTimer, PhUploadSimple, PhUsersThree } from '@phosphor-icons/vue'
const router = useRouter()
const mode = ref<'quick' | 'pro'>('quick')
const prompt = ref('')
const city = ref('杭州')
const scene = ref('景区推荐')
const style = ref('山海活力')
const duration = ref(30)
const ratio = ref('9:16')
const isSubmitting = ref(false)
const showPanel = ref(false)
const hasDraft = computed(() => prompt.value.trim().length > 0)
const suggestions = ['为西湖夏日夜游制作一支轻快的竖屏短片', '用宋韵水墨风介绍良渚古城遗址', '面向亲子家庭推荐宁波东钱湖周末路线']
function createProject() { if (!hasDraft.value) return; isSubmitting.value = true; window.setTimeout(() => { void router.push('/studio/new-project') }, 900) }
</script>
<template>
  <div class="quick-create-page"><div class="quick-bg" />
    <header class="quick-header"><button class="back-button" aria-label="返回项目中心" @click="router.push('/projects')"><PhArrowLeft :size="21" /></button><div class="compact-brand"><span class="brand-mark"><span>浙</span></span><strong>浙旅智创</strong></div><button class="draft-save" :disabled="!hasDraft"><PhCheck :size="16" />草稿已自动保存</button></header>
    <main class="create-stage"><div class="create-copy"><div class="mode-switch"><button :class="{ active: mode === 'quick' }" @click="mode = 'quick'">极速模式</button><button :class="{ active: mode === 'pro' }" @click="mode = 'pro'">专业模式</button></div><h1>把一座城的灵感，<br /><span>变成一支好视频。</span></h1><p>说出你想表达的主题，系统会自动完成知识检索、文案、分镜与视频生成。</p></div>
      <section class="prompt-composer" :class="{ focused: showPanel }"><textarea v-model="prompt" rows="5" placeholder="例如：为西湖夏日夜游制作一支 30 秒竖屏宣传片，面向年轻游客，节奏轻快..." @focus="showPanel = true" /><div class="composer-actions"><div><button aria-label="添加素材"><PhPlus :size="19" /></button><button @click="showPanel = !showPanel"><PhMapPin :size="17" />{{ city }}</button><button @click="showPanel = !showPanel"><PhFilmSlate :size="17" />{{ scene }}</button><button @click="showPanel = !showPanel"><PhSparkle :size="17" />{{ style }}</button><button @click="showPanel = !showPanel"><PhTimer :size="17" />{{ duration }}s</button><button @click="showPanel = !showPanel"><PhImageSquare :size="17" />{{ ratio }}</button></div><button class="submit-prompt" :disabled="!hasDraft || isSubmitting" aria-label="创建并生成" @click="createProject"><span v-if="isSubmitting" class="button-loader" /><PhArrowUp v-else :size="20" weight="bold" /></button></div></section>
      <Transition name="panel-pop"><section v-if="showPanel" class="parameter-panel"><div><label>城市</label><div class="choice-row"><button v-for="item in ['杭州','宁波','温州','嘉兴']" :key="item" :class="{ active: city === item }" @click="city = item">{{ item }}</button></div></div><div><label>场景</label><div class="choice-row"><button v-for="item in ['景区推荐','城市形象','节庆活动']" :key="item" :class="{ active: scene === item }" @click="scene = item">{{ item }}</button></div></div><div><label>视觉风格</label><div class="choice-row"><button v-for="item in ['山海活力','宋韵水墨','乡村治愈','都市现代']" :key="item" :class="{ active: style === item }" @click="style = item">{{ item }}</button></div></div><div class="parameter-grid"><div><label>时长</label><select v-model="duration"><option :value="15">15 秒</option><option :value="30">30 秒</option><option :value="45">45 秒</option><option :value="60">60 秒</option></select></div><div><label>画幅</label><select v-model="ratio"><option>9:16</option><option>16:9</option><option>1:1</option></select></div></div></section></Transition>
      <div class="suggestions"><span>试试这样说</span><button v-for="suggestion in suggestions" :key="suggestion" @click="prompt = suggestion">{{ suggestion }}</button></div><button class="upload-strip"><PhUploadSimple :size="19" /><span><strong>也可以先添加自有素材</strong><small>支持 JPG、PNG、MP4、MOV，系统将自动完成标签与版权信息预检</small></span><PhUsersThree :size="20" /></button>
    </main>
  </div>
</template>
