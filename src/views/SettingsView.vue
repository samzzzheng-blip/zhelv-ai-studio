<script setup lang="ts">
import { ref } from 'vue'
import { PhBuildings, PhCheck, PhDatabase, PhGear, PhKey, PhShieldCheck, PhUserCircleGear } from '@phosphor-icons/vue'
const activeTab = ref('组织信息')
const saved = ref(false)
const zhejiangCities = ['杭州', '宁波', '温州', '嘉兴', '湖州', '绍兴', '金华', '衢州', '舟山', '台州', '丽水']
const selectedCities = ref([...zhejiangCities])
const tabs = [
  { label: '组织信息', icon: PhBuildings, disabled: false },
  { label: '成员与权限', icon: PhUserCircleGear, disabled: true },
  { label: '模型与路由', icon: PhDatabase, disabled: true },
  { label: '安全策略', icon: PhShieldCheck, disabled: true },
  { label: '接口密钥', icon: PhKey, disabled: true },
]
function save() { saved.value = true; window.setTimeout(() => { saved.value = false }, 2200) }
function toggleCity(city: string) {
  selectedCities.value = selectedCities.value.includes(city)
    ? selectedCities.value.filter((item) => item !== city)
    : [...selectedCities.value, city]
}
</script>
<template>
  <div class="page settings-page"><section class="page-heading"><div><h1>系统设置</h1><p>管理组织信息、生成配额、成员权限与安全策略。</p></div><button class="primary-button" @click="save"><PhCheck :size="17" />保存更改</button></section>
    <div class="settings-layout"><aside class="settings-nav panel"><button v-for="tab in tabs" :key="tab.label" :class="{ active: activeTab === tab.label }" :disabled="tab.disabled" :title="tab.disabled ? '等待组织后台接口接入' : undefined" @click="activeTab = tab.label"><component :is="tab.icon" :size="19" />{{ tab.label }}<small v-if="tab.disabled">待接入</small></button></aside>
      <section class="settings-content panel"><header><span><PhGear :size="21" /></span><div><h2>{{ activeTab }}</h2><p>这些设置会影响当前组织内的全部项目与成员。</p></div></header>
        <form v-if="activeTab === '组织信息'" class="settings-form" @submit.prevent="save"><div class="form-row"><label for="org-name">组织名称</label><input id="org-name" value="浙江省文化和旅游厅内容运营组" /><small>用于项目归档和版权材料抬头。</small></div><div class="form-grid"><div class="form-row"><label for="org-code">组织编码</label><input id="org-code" value="ZJCT-OPS-01" disabled /></div><div class="form-row"><label for="contact">管理员邮箱</label><input id="contact" type="email" value="ops@example.gov.cn" /></div></div><div class="form-row"><label>默认城市库</label><div class="multi-choice"><button v-for="city in zhejiangCities" :key="city" type="button" :class="{ active: selectedCities.includes(city) }" :aria-pressed="selectedCities.includes(city)" @click="toggleCity(city)">{{ city }}</button></div><small>已覆盖浙江省全部 11 个设区市，可按需取消默认启用。</small></div><div class="quota-box"><div><strong>本月生成配额</strong><span>已使用 184 / 300 分钟</span></div><div class="quota-track"><i /></div><small>配额在每月 1 日重置。高清渲染和 AI 视频生成计入使用时长。</small></div><div class="switch-row"><div><strong>默认启用事实来源强绑定</strong><span>无来源的事实性表述将阻止项目进入审核。</span></div><label class="switch"><input type="checkbox" checked /><span /></label></div><div class="switch-row"><div><strong>自动保存项目草稿</strong><span>编辑内容将在空闲 2 秒后写入独立草稿版本。</span></div><label class="switch"><input type="checkbox" checked /><span /></label></div></form>
      </section>
    </div><Transition name="toast"><div v-if="saved" class="toast-message"><PhCheck :size="18" />设置已保存</div></Transition>
  </div>
</template>
