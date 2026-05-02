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

// Transitions définies en constantes (évite toute double-accolade inline en JSX).
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
const shapeAnimate = { opacity: 0.85, scale: 1.04 }
const haloInitial = { opacity: 0 }
const haloAnimate = { opacity: 0.4 }
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
 *   • halo principal (rapide)
 *   • halo secondaire (rapide)
 *   • portrait (amplitude visible)
 *
 * Respecte prefers-reduced-motion.
 *
 * Le composant remplit sa boîte parente (w-full h-full) — c'est au parent de
 * fixer la largeur max et la hauteur (ex. `max-w-md h-full`).
 */
export function HeroPhotoNoBg({
  src = '/alexandre-lopez-no-background.png',
  alt,
  className = '',
}: HeroPhotoNoBgProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()

  // Parallaxe basée sur le scroll global pour un effet plus visible
  const { scrollY } = useScroll()
  
  // Parallaxe : le portrait et les halos se déplacent à des vitesses différentes
  // Le portrait bouge plus lentement (effet de profondeur)
  const portraitY = useTransform(scrollY, [0, 800], [0, 80])
  const portraitScale = useTransform(scrollY, [0, 800], [1, 0.92])
  
  // Les halos bougent plus vite pour créer un effet de contre-parallaxe
  const shapeY = useTransform(scrollY, [0, 800], [0, 120])
  const shapeScale = useTransform(scrollY, [0, 800], [1.08, 0.85])

  const reduce = !!prefersReducedMotion

  return (
    <div
      ref={wrapperRef}
      className={'relative w-full h-full flex items-end justify-center ' + className}
    >
      {/* Halo principal — gradient brand-light derrière le portrait */}
      <motion.div
        aria-hidden="true"
        style={reduce ? undefined : { y: shapeY, scale: shapeScale }}
        initial={reduce ? false : shapeInitial}
        animate={reduce ? undefined : shapeAnimate}
        transition={shapeTransition}
        className="absolute inset-x-0 bottom-0 mx-auto w-[88%] h-[75%] rounded-t-[4rem] rounded-b-[2rem] bg-gradient-to-br from-brand-light via-brand-light/70 to-white blur-2xl pointer-events-none"
      />

      {/* Halo secondaire — touche de brand color pour la profondeur */}
      <motion.div
        aria-hidden="true"
        style={reduce ? undefined : { y: shapeY }}
        initial={reduce ? false : haloInitial}
        animate={reduce ? undefined : haloAnimate}
        transition={haloTransition}
        className="absolute top-[12%] right-[6%] w-52 h-52 rounded-full bg-brand/25 blur-3xl pointer-events-none"
      />

      {/* Parallaxe lente (translate Y + scale) */}
      <motion.div
        style={reduce ? undefined : { y: portraitY, scale: portraitScale }}
        className="relative z-10 w-full h-full flex items-end justify-center"
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
            sizes="(min-width: 1024px) 45vw, 90vw"
            className="object-contain object-bottom drop-shadow-[0_24px_60px_rgba(0,99,144,0.28)]"
          />
        </motion.div>
      </motion.div>
    </div>
  )
}

export default HeroPhotoNoBg
