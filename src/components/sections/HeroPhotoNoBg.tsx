'use client'

import { useRef } from 'react'
import Image from 'next/image'
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from 'framer-motion'

type HeroPhotoNoBgProps = {
  src?: string
  alt: string
  className?: string
}

// Transitions définies en constantes pour éviter les doubles-accolades inline en JSX.
const shapeTransition = {
  duration: 0.9,
  ease: [0.22, 1, 0.36, 1] as const,
  delay: 0.15,
}

const haloTransition = {
  duration: 1.1,
  ease: 'easeOut' as const,
  delay: 0.35,
}

const portraitTransition = {
  duration: 1.15,
  ease: [0.22, 1, 0.36, 1] as const,
  delay: 0.1,
}

const shapeInitial = { opacity: 0, scale: 0.92 }
const shapeAnimate = { opacity: 0.9, scale: 1.04 }
const haloInitial = { opacity: 0 }
const haloAnimate = { opacity: 0.45 }
const portraitInitial = {
  opacity: 0,
  scale: 0.94,
  y: 60,
  filter: 'blur(14px)',
}
const portraitAnimate = {
  opacity: 1,
  scale: 1,
  y: 0,
  filter: 'blur(0px)',
}

/**
 * Portrait détouré pour le hero.
 *
 * Effets à l'ouverture :
 *   • fade-in + scale doux
 *   • slide-up
 *   • blur-to-sharp
 *
 * Parallaxe au scroll :
 *   • halo décoratif derrière (rapide)
 *   • portrait (lent)
 *   → effet de profondeur
 *
 * Respecte prefers-reduced-motion.
 */
export function HeroPhotoNoBg({
  src = '/alexandre-lopez-no-background.png',
  alt,
  className = '',
}: HeroPhotoNoBgProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ['start end', 'end start'],
  })

  // Parallaxe : portrait lent, halos rapides
  const portraitY = useTransform(scrollYProgress, [0, 1], ['-4%', '6%'])
  const shapeY = useTransform(scrollYProgress, [0, 1], ['-14%', '16%'])
  const shapeScale = useTransform(scrollYProgress, [0, 1], [1.04, 0.9])

  const reduce = !!prefersReducedMotion

  return (
    <div
      ref={wrapperRef}
      className={'relative w-full h-full flex items-end justify-center ' + className}
    >
      {/* Halo principal — gradient brand/light */}
      <motion.div
        aria-hidden="true"
        style={reduce ? undefined : { y: shapeY, scale: shapeScale }}
        initial={reduce ? false : shapeInitial}
        animate={reduce ? undefined : shapeAnimate}
        transition={shapeTransition}
        className="absolute inset-x-0 bottom-0 mx-auto w-[82%] aspect-square rounded-t-[3rem] rounded-b-[2rem] bg-gradient-to-br from-brand-light via-brand-light/70 to-white blur-2xl pointer-events-none"
      />

      {/* Halo secondaire brand — profondeur */}
      <motion.div
        aria-hidden="true"
        style={reduce ? undefined : { y: shapeY }}
        initial={reduce ? false : haloInitial}
        animate={reduce ? undefined : haloAnimate}
        transition={haloTransition}
        className="absolute top-[18%] right-[10%] w-44 h-44 rounded-full bg-brand/25 blur-3xl pointer-events-none"
      />

      {/* Wrapper parallaxe lente (translate Y uniquement) */}
      <motion.div
        style={reduce ? undefined : { y: portraitY }}
        className="relative z-10 w-full max-w-sm aspect-[3/4] flex items-end justify-center"
      >
        {/* Opening animation: fade + scale + slide-up + blur-to-sharp */}
        <motion.div
          initial={reduce ? false : portraitInitial}
          animate={reduce ? undefined : portraitAnimate}
          transition={portraitTransition}
          className="relative w-full h-full flex items-end justify-center"
        >
          <Image
            src={src}
            alt={alt}
            fill
            priority
            sizes="(min-width: 1024px) 40vw, 90vw"
            className="object-contain object-bottom drop-shadow-[0_24px_60px_rgba(0,99,144,0.28)]"
          />
        </motion.div>
      </motion.div>
    </div>
  )
}

export default HeroPhotoNoBg
