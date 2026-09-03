<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { PhArrowRight, PhArrowsClockwise, PhCheck, PhLockKey, PhShieldCheck, PhSparkle, PhUser } from '@phosphor-icons/vue'
import { getCaptcha } from '@/api/auth'
import { ApiError } from '@/api/http'
import { useAuthStore } from '@/stores/auth'
import { useGsapScope } from '@/composables/useGsapScope'
import { gsap } from '@/motion/gsap'
import { motion } from '@/motion/tokens'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()
const username = ref('')
const password = ref('')
const code = ref('')
const uuid = ref('')
const captchaImage = ref('')
const captchaEnabled = ref(false)
const captchaLoading = ref(false)
const agreed = ref(true)
const error = ref(route.query.expired ? '登录状态已过期，请重新登录。' : '')
const root = ref<HTMLElement | null>(null)

useGsapScope(root, ({ reducedMotion }) => {
  if (reducedMotion) return
  gsap.timeline({ defaults: { ease: motion.ease.enter } })
    .from('.login-visual > img', { scale: 1.09, duration: 1.4 })
    .from('.login-brand', { autoAlpha: 0, y: -14, duration: 0.48 }, 0.08)
    .from('.login-manifesto > *', { autoAlpha: 0, y: 22, duration: 0.68, stagger: 0.09 }, 0.2)
    .from('.login-trust span', { autoAlpha: 0, y: 10, duration: 0.45, stagger: 0.07 }, 0.48)
    .from('.login-card > *', { autoAlpha: 0, y: 16, duration: 0.5, stagger: 0.06 }, 0.25)
})

watch(error, (message) => {
  if (!message || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  gsap.fromTo('.login-card form', { x: -4 }, { x: 0, duration: 0.42, ease: 'elastic.out(1, 0.35)', clearProps: 'transform' })
})

const canLogin = computed(() => Boolean(username.value.trim() && password.value && (!captchaEnabled.value || code.value.trim()) && agreed.value && !auth.loading))

async function refreshCaptcha() {
  captchaLoading.value = true
  try {
    const result = await getCaptcha()
    captchaEnabled.value = result.captchaEnabled
    uuid.value = result.uuid ?? ''
    captchaImage.value = result.img ? `data:image/jpeg;base64,${result.img}` : ''
    code.value = ''
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : '验证码加载失败。'
  } finally {
    captchaLoading.value = false
  }
}

async function signIn() {
  if (!canLogin.value) return
  error.value = ''
  try {
    await auth.signIn({ username: username.value.trim(), password: password.value, code: code.value.trim(), uuid: uuid.value })
    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/projects'
    await router.replace(redirect)
  } catch (cause) {
    error.value = cause instanceof ApiError ? cause.message : '登录失败，请稍后重试。'
    if (captchaEnabled.value) await refreshCaptcha()
  }
}

function fillAdmin() {
  username.value = 'admin'
  password.value = 'admin123'
  error.value = captchaEnabled.value ? '已填入管理员账号，请输入图形验证码后登录。' : ''
}

onMounted(refreshCaptcha)
</script>

<template>
  <main ref="root" class="login-page">
    <section class="login-visual" aria-label="江南山水品牌画面">
      <img src="/images/west-lake-boat.jpg" alt="西湖薄雾、游船与雷峰塔" />
      <div class="login-brand"><span class="brand-mark brand-mark--large"><span>浙</span></span><div><strong>浙旅智创</strong><small>AI VIDEO STUDIO</small></div></div>
      <div class="login-manifesto"><span><PhSparkle :size="17" weight="fill" />可信 · 可溯源 · 可协作</span><h1>让浙江的每一处风景，<br /><em>都有准确而动人的表达。</em></h1><p>从权威事实到分镜、审核与多平台交付，一条可追溯的城市短视频生产链。</p></div>
      <div class="login-trust"><span><PhShieldCheck :size="18" />JWT 安全认证</span><span><PhCheck :size="18" />组织数据权限隔离</span></div>
    </section>
    <section class="login-panel">
      <div class="login-card">
        <header><span class="login-mobile-mark"><PhUser :size="22" /></span><div><h2>欢迎回来</h2><p>登录浙旅智创内容工作台</p></div></header>
        <form @submit.prevent="signIn">
          <label class="login-field"><span>账号</span><div><PhUser :size="18" /><input v-model.trim="username" autocomplete="username" placeholder="请输入账号" @input="error = ''" /></div></label>
          <label class="login-field"><span>密码</span><div><PhLockKey :size="18" /><input v-model="password" type="password" autocomplete="current-password" placeholder="请输入密码" @input="error = ''" /></div></label>
          <label v-if="captchaEnabled" class="login-field"><span>图形验证码</span><div class="captcha-field"><input v-model.trim="code" autocomplete="off" placeholder="请输入计算结果" @input="error = ''" /><button type="button" :disabled="captchaLoading" aria-label="刷新验证码" @click="refreshCaptcha"><img v-if="captchaImage" :src="captchaImage" alt="图形验证码" /><PhArrowsClockwise v-else :size="18" /></button></div></label>
          <label class="agreement"><input v-model="agreed" type="checkbox" /><span>我已阅读并同意《用户服务协议》《隐私政策》和《AI 功能使用规范》</span></label>
          <p v-if="error" class="login-error" role="alert">{{ error }}</p>
          <button class="primary-button login-submit" type="submit" :disabled="!canLogin"><span v-if="auth.loading" class="button-loader" />{{ auth.loading ? '正在验证身份' : '登录' }}<PhArrowRight v-if="!auth.loading" :size="18" /></button>
        </form>
        <div class="login-divider"><span>本地初始化账号</span></div>
        <button class="demo-login" type="button" @click="fillAdmin"><span class="avatar">管</span><span><strong>填入管理员账号</strong><small>admin / admin123，验证码仍需手动输入</small></span><PhArrowRight :size="17" /></button>
        <footer>账号与权限由浙旅智创后台统一管理</footer>
      </div>
    </section>
  </main>
</template>
