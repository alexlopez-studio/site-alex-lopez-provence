'use client'

import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'

const motionInitial = { opacity: 0, y: 10 }
const motionAnimate = { opacity: 1, y: 0 }
const motionExit = { opacity: 0, y: -10 }
const motionTransition = { duration: 0.28, ease: [0.22, 1, 0.36, 1] as const }

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={motionInitial}
        animate={motionAnimate}
        exit={motionExit}
        transition={motionTransition}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
