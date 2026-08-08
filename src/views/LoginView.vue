<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import { useRouter } from 'vue-router'
import { PhArrowRight, PhCheck, PhDeviceMobile, PhShieldCheck, PhSparkle } from '@phosphor-icons/vue'

const router = useRouter()
const phone = ref('')
const code = ref('')
const agreed = ref(false)
const countdown = ref(0)
const error = ref('')
const loading = ref(false)
let timer: number | undefined

const canSend = computed(() => /^1\d{10}$/.test(phone.value) && countdown.value === 0)
const canLogin = computed(() => /^1\d{10}$/.test(phone.value) && /^\d{6}$/.test(code.value) && agreed.value && !loading.value)

function sendCode() {
  if (!canSend.value) { error.value = '请输入 11 位手机号后再获取验证码。'; return }
  error.value = ''
  countdown.value = 60
  timer = window.setInterval(() => {
    countdown.value -= 1
    if (countdown.value <= 0 && timer) window.clearInterval(timer)
  }, 1000)
}

function signIn() {
  if (!agreed.value) { error.value = '请先阅读并同意服务协议与隐私政策。'; return }
  if (!canLogin.value) { error.value = '请输入有效手机号和 6 位验证码。'; return }
  error.value = ''
  loading.value = true
  window.setTimeout(() => { void router.push('/projects') }, 700)
}

function enterDemo() {
  phone.value = '13800138000'
  code.value = '123456'
  agreed.value = true
  signIn()
}

onBeforeUnmount(() => { if (timer) window.clearInterval(timer) })
</script>

<template>
  <main class="login-page">
    <section class="login-visual" aria-label="江南山水品牌画面">
      <img src="/images/west-lake-boat.jpg" alt="西湖薄雾、游船与雷峰塔" />
      <div class="login-brand"><span class="brand-mark brand-mark--large"><span>浙</span></span><div><strong>浙旅智创</strong><small>AI VIDEO STUDIO</small></div></div>
      <div class="login-manifesto"><span><PhSparkle :size="17" weight="fill" />可信 · 可溯源 · 可协作</span><h1>让浙江的每一处风景，<br />都有准确而动人的表达。</h1><p>从权威事实到分镜、审核与多平台交付，一条可追溯的城市短视频生产链。</p></div>
      <div class="login-trust"><span><PhShieldCheck :size="18" />事实来源强绑定</span><span><PhCheck :size="18" />版权材料随片归档</span></div>
    </section>
    <section class="login-panel">
      <div class="login-card">
        <header><span class="login-mobile-mark"><PhDeviceMobile :size="22" /></span><div><h2>欢迎回来</h2><p>使用手机号验证码登录工作台</p></div></header>
        <form @submit.prevent="signIn">
          <label class="login-field"><span>手机号</span><input v-model.trim="phone" inputmode="tel" maxlength="11" autocomplete="tel" placeholder="请输入 11 位手机号" @input="error = ''" /></label>
          <label class="login-field"><span>验证码</span><div><input v-model.trim="code" inputmode="numeric" maxlength="6" autocomplete="one-time-code" placeholder="6 位验证码" @input="error = ''" /><button type="button" :disabled="!canSend" @click="sendCode">{{ countdown ? `${countdown}s` : '发送验证码' }}</button></div></label>
          <label class="agreement"><input v-model="agreed" type="checkbox" /><span>我已阅读并同意《用户服务协议》《隐私政策》和《AI 功能使用规范》</span></label>
          <p v-if="error" class="login-error" role="alert">{{ error }}</p>
          <button class="primary-button login-submit" type="submit" :disabled="!canLogin"><span v-if="loading" class="button-loader" />{{ loading ? '正在进入工作台' : '登录' }}<PhArrowRight v-if="!loading" :size="18" /></button>
        </form>
        <div class="login-divider"><span>或</span></div>
        <button class="demo-login" type="button" @click="enterDemo"><span class="demo-symbol">浙</span><span><strong>进入演示工作台</strong><small>无需真实账号，体验完整生成流程</small></span><PhArrowRight :size="18" /></button>
        <footer>当前为前端演示环境，验证码不会发送至真实手机。</footer>
      </div>
    </section>
  </main>
</template>
