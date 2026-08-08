<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import AppShell from '@/components/AppShell.vue'

const route = useRoute()
const isStandalone = computed(() => Boolean(route.meta.standalone))
const booting = ref(true)
window.setTimeout(() => { booting.value = false }, 520)
</script>

<template>
  <!--
  THESIS: A calm Zhejiang production room where every generation step is visible and accountable; it refuses generic AI dashboard spectacle.
  OWN-WORLD: Cloud-white surfaces, mineral teal controls, ink text, misted landscape media, 14px soft geometry, and precise operational states.
  STORY: Operators find a project, generate through fast or professional mode, inspect traceable results, review risks, and export approved versions.
  FIRST VIEWPORT: A compact navigation rail opens into a generous project workspace with a clear title, primary action, filters, and visual project grid.
  FORM: Operate mode, inherited from the supplied UI authority. Seed key: jsdesign-wA2m7A.
  FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md
  -->
  <Transition name="boot-fade">
    <div v-if="booting" class="boot-screen" aria-label="正在加载浙旅智创">
      <div class="brand-mark brand-mark--large"><span>浙</span></div>
      <p>浙旅智创</p>
      <div class="boot-line"><i /></div>
    </div>
  </Transition>
  <RouterView v-if="isStandalone" />
  <AppShell v-else>
    <RouterView v-slot="{ Component }">
      <Transition name="page" mode="out-in"><component :is="Component" /></Transition>
    </RouterView>
  </AppShell>
</template>
