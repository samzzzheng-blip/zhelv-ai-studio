export const motion = {
  duration: {
    instant: 0.16,
    standard: 0.34,
    expressive: 0.72,
  },
  ease: {
    enter: 'power3.out',
    move: 'power3.inOut',
    exit: 'power2.in',
  },
  stagger: {
    tight: 0.035,
    standard: 0.055,
  },
} as const

