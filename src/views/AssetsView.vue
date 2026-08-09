<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { PhBookOpenText, PhCheckCircle, PhClock, PhFileText, PhFunnel, PhImage, PhLink, PhMagnifyingGlass, PhPlus, PhShieldCheck, PhUploadSimple, PhX } from '@phosphor-icons/vue'
import { useGsapScope } from '@/composables/useGsapScope'
import { Flip, gsap } from '@/motion/gsap'
import { motion } from '@/motion/tokens'

type Asset = { id: string; title: string; city: string; kind: string; source: string; updated: string; image: string; uses: number; verified: boolean }
const route = useRoute()
const root = ref<HTMLElement | null>(null)
const assetGrid = ref<HTMLElement | null>(null)
const assetContent = ref<HTMLElement | null>(null)
const activeTab = ref<'media' | 'facts' | 'rights'>('media')
const search = ref(String(route.query.search ?? ''))
const city = ref('全部城市')
const selected = ref<Asset | null>(null)
const uploadInput = ref<HTMLInputElement | null>(null)
const feedback = ref('')
const assets = ref<Asset[]>([
  { id: 'a1', title: '西湖晨雾与雷峰塔', city: '杭州', kind: '视频素材', source: '杭州文旅素材库', updated: '今天 09:28', image: '/images/west-lake-boat.jpg', uses: 18, verified: true },
  { id: 'a2', title: '千岛湖湖面航拍', city: '杭州', kind: '视频素材', source: '淳安县文化和广电旅游体育局', updated: '昨天 16:42', image: '/images/qiandao-lake.jpg', uses: 11, verified: true },
  { id: 'a3', title: '江南水乡薄雾船影', city: '嘉兴', kind: '图片素材', source: '嘉兴城市影像库', updated: '8 月 6 日', image: '/images/jiangnan-boats.jpg', uses: 7, verified: true },
  { id: 'a4', title: '浙东山水全景', city: '宁波', kind: '视频素材', source: '项目自有素材', updated: '8 月 5 日', image: '/images/zhejiang-mist-lake.png', uses: 5, verified: false },
])
const facts = [
  { title: '西湖文化景观基础事实卡', city: '杭州', count: 42, source: '杭州市文化广电旅游局', status: '已核验', updated: '2026-08-07' },
  { title: '良渚古城遗址表达规范', city: '杭州', count: 28, source: '良渚遗址管理区管委会', status: '已核验', updated: '2026-08-06' },
  { title: '东钱湖景区开放信息', city: '宁波', count: 16, source: '东钱湖文旅集团', status: '待复核', updated: '2026-08-02' },
  { title: '乌镇戏剧节品牌用语', city: '嘉兴', count: 21, source: '活动官方资料包', status: '已核验', updated: '2026-08-01' },
]
const rights = [
  { name: 'west-lake-summer-v3.mp4', project: '西湖十景夏日特辑', scope: '信息流 / 政务新媒体', expires: '2027-08-01', state: '有效' },
  { name: 'dongqian-lake-music.wav', project: '东钱湖周末漫游', scope: '线上传播', expires: '2026-12-31', state: '需关注' },
  { name: 'wuzhen-poster-04.jpg', project: '乌镇戏剧节预热', scope: '活动期全渠道', expires: '2026-11-30', state: '有效' },
]
const filteredAssets = computed(() => assets.value.filter((item) => (city.value === '全部城市' || item.city === city.value) && `${item.title}${item.kind}${item.source}`.includes(search.value.trim())))

function notify(message: string) { feedback.value = message; window.setTimeout(() => { feedback.value = '' }, 2300) }
function upload(event: Event) {
  const files = Array.from((event.target as HTMLInputElement).files ?? [])
  if (!files.length) return
  notify(`已加入 ${files.length} 个文件，等待版权信息补充`)
  ;(event.target as HTMLInputElement).value = ''
}

useGsapScope(root, ({ reducedMotion }) => {
  if (reducedMotion) return
  gsap.timeline({ defaults: { ease: motion.ease.enter } })
    .from('.asset-overview', { autoAlpha: 0, clipPath: 'inset(0 14% 0 0 round 14px)', duration: 0.5 })
    .from('.asset-tabs, .asset-toolbar', { autoAlpha: 0, y: 8, duration: 0.34, stagger: 0.05 }, '-=0.22')
    .from('.asset-card, .asset-upload-card', { autoAlpha: 0, y: 14, duration: 0.42, stagger: 0.055 }, '-=0.16')
})

watch([search, city], async () => {
  const grid = assetGrid.value
  if (!grid || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const state = Flip.getState(grid.children)
  await nextTick()
  Flip.from(state, {
    duration: motion.duration.standard,
    ease: motion.ease.move,
    absolute: true,
    stagger: motion.stagger.tight,
    onEnter: (elements) => gsap.fromTo(elements, { autoAlpha: 0, scale: 0.97 }, { autoAlpha: 1, scale: 1, duration: 0.26 }),
    onLeave: (elements) => gsap.to(elements, { autoAlpha: 0, scale: 0.97, duration: 0.16 }),
  })
})

async function selectTab(tab: 'media' | 'facts' | 'rights') {
  if (tab === activeTab.value) return
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!reduced && assetContent.value) await gsap.to(assetContent.value, { autoAlpha: 0, x: 8, duration: 0.15, ease: motion.ease.exit })
  activeTab.value = tab
  await nextTick()
  if (!reduced && assetContent.value) gsap.fromTo(assetContent.value, { autoAlpha: 0, x: -8 }, { autoAlpha: 1, x: 0, duration: 0.32, ease: motion.ease.enter, clearProps: 'transform' })
}

async function openAsset(item: Asset) {
  selected.value = item
  await nextTick()
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  gsap.timeline({ defaults: { ease: motion.ease.enter } })
    .fromTo('.asset-drawer-scrim', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.22 }, 0)
    .fromTo('.asset-drawer', { x: 36, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.42 }, 0.03)
    .from('.asset-drawer > img', { clipPath: 'inset(0 0 100% 0 round 13px)', duration: 0.46 }, 0.12)
    .from('.asset-drawer dl, .drawer-proof, .asset-drawer > .primary-button', { autoAlpha: 0, y: 8, duration: 0.32, stagger: 0.045 }, 0.18)
}

async function closeDrawer() {
  if (!selected.value) return
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    await gsap.timeline({ defaults: { ease: motion.ease.exit } })
      .to('.asset-drawer', { x: 24, autoAlpha: 0, duration: 0.22 }, 0)
      .to('.asset-drawer-scrim', { autoAlpha: 0, duration: 0.18 }, 0.04)
  }
  selected.value = null
}
</script>

<template>
  <div ref="root" class="page assets-page">
    <section class="page-heading"><div><h1>知识资产中心</h1><p>统一管理可复用素材、权威事实卡与版权授权，让每次生成都有据可查。</p></div><button class="primary-button" @click="uploadInput?.click()"><PhUploadSimple :size="18" />上传资产</button><input ref="uploadInput" type="file" multiple hidden @change="upload" /></section>
    <section class="asset-overview" aria-label="资产概览"><div><strong>1,286</strong><span>可用素材</span></div><i /><div><strong>214</strong><span>权威事实卡</span></div><i /><div><strong>98.4%</strong><span>授权信息完整度</span></div><p><PhShieldCheck :size="18" weight="fill" />本周新增资产 34 项，3 项授权即将到期</p></section>
    <nav class="asset-tabs" aria-label="资产类型"><button :class="{ active: activeTab === 'media' }" @click="selectTab('media')"><PhImage :size="18" />素材库</button><button :class="{ active: activeTab === 'facts' }" @click="selectTab('facts')"><PhBookOpenText :size="18" />事实知识</button><button :class="{ active: activeTab === 'rights' }" @click="selectTab('rights')"><PhFileText :size="18" />版权台账</button></nav>
    <section class="asset-toolbar panel-flat"><label class="page-search"><PhMagnifyingGlass :size="18" /><input v-model="search" placeholder="搜索名称、来源或标签" /></label><label v-if="activeTab === 'media'" class="select-filter"><PhFunnel :size="17" /><select v-model="city"><option>全部城市</option><option>杭州</option><option>宁波</option><option>嘉兴</option></select></label><button class="secondary-button" @click="notify('筛选条件已重置'); search = ''; city = '全部城市'">重置</button></section>

    <div ref="assetContent" class="asset-content"><section v-if="activeTab === 'media'" ref="assetGrid" class="asset-grid">
      <button v-for="item in filteredAssets" :key="item.id" class="asset-card" @click="openAsset(item)"><span class="asset-image"><img :src="item.image" :alt="item.title" /><small>{{ item.kind }}</small><i v-if="item.verified"><PhCheckCircle :size="16" weight="fill" />来源已核验</i></span><span class="asset-copy"><strong>{{ item.title }}</strong><small>{{ item.city }} · {{ item.source }}</small><span><small><PhClock :size="14" />{{ item.updated }}</small><small>用于 {{ item.uses }} 个项目</small></span></span></button>
      <button class="asset-upload-card" @click="uploadInput?.click()"><span><PhPlus :size="24" /></span><strong>添加新素材</strong><small>支持图片、视频和音频文件</small></button>
    </section>
    <section v-else-if="activeTab === 'facts'" class="knowledge-list panel">
      <header><div><strong>事实知识包</strong><span>按城市与主题维护的结构化事实来源</span></div><button class="secondary-button" @click="notify('新建知识包功能已进入演示流程')"><PhPlus :size="17" />新建知识包</button></header>
      <article v-for="item in facts" :key="item.title"><span class="knowledge-icon"><PhBookOpenText :size="20" /></span><div><strong>{{ item.title }}</strong><small>{{ item.city }} · {{ item.source }}</small></div><span>{{ item.count }} 条事实</span><span :class="['fact-state', { warning: item.status === '待复核' }]">{{ item.status }}</span><time>{{ item.updated }}</time><button aria-label="查看知识包" @click="notify(`已打开${item.title}`)"><PhLink :size="17" /></button></article>
    </section>
    <section v-else class="rights-ledger panel">
      <header><div><strong>版权授权台账</strong><span>随项目归档授权范围与到期时间</span></div><button class="secondary-button" @click="notify('版权台账已导出为 CSV')">导出台账</button></header>
      <div class="rights-table"><div class="table-head"><span>资产文件</span><span>关联项目</span><span>授权范围</span><span>到期时间</span><span>状态</span></div><div v-for="item in rights" :key="item.name" class="table-row"><strong>{{ item.name }}</strong><span>{{ item.project }}</span><span>{{ item.scope }}</span><time>{{ item.expires }}</time><small :class="{ warning: item.state === '需关注' }">{{ item.state }}</small></div></div>
    </section></div>

    <div v-if="selected" class="asset-drawer-scrim" @click="closeDrawer" /><aside v-if="selected" class="asset-drawer"><header><div><small>素材详情</small><h2>{{ selected.title }}</h2></div><button class="icon-button" aria-label="关闭详情" @click="closeDrawer"><PhX :size="19" /></button></header><img :src="selected.image" :alt="selected.title" /><dl><dt>素材类型</dt><dd>{{ selected.kind }}</dd><dt>所属城市</dt><dd>{{ selected.city }}</dd><dt>权威来源</dt><dd>{{ selected.source }}</dd><dt>使用次数</dt><dd>{{ selected.uses }} 个项目</dd><dt>更新日期</dt><dd>{{ selected.updated }}</dd></dl><div class="drawer-proof"><PhShieldCheck :size="20" weight="fill" /><span><strong>{{ selected.verified ? '来源与授权已核验' : '需要补充授权证明' }}</strong><small>{{ selected.verified ? '生成时可直接引用并写入溯源清单' : '提交审核前必须完成版权信息' }}</small></span></div><button class="primary-button" @click="notify('已创建一个引用该素材的新项目'); closeDrawer()">使用此素材创建项目</button></aside>
    <Transition name="toast"><div v-if="feedback" class="toast-message"><PhCheckCircle :size="18" weight="fill" />{{ feedback }}</div></Transition>
  </div>
</template>
