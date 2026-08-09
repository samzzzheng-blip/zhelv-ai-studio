import { onBeforeUnmount, onMounted, type Ref } from 'vue'
import { gsap } from '@/motion/gsap'

type MotionSetup = (options: { reducedMotion: boolean }) => void | (() => void)

export function useGsapScope(root: Ref<HTMLElement | null>, setup: MotionSetup) {
  let context: gsap.Context | undefined
  let cleanup: void | (() => void)

  onMounted(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    context = gsap.context(() => {
      cleanup = setup({ reducedMotion })
    }, root.value ?? undefined)
  })

  onBeforeUnmount(() => {
    cleanup?.()
    context?.revert()
  })
}

