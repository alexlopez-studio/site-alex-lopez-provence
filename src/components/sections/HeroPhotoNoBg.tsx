'use client'

import Image from 'next/image'
import {
  motion,
  useReducedMotion,
} from 'framer-motion'

type HeroPhotoNoBgProps = {
  src?: string
  alt: string
  className?: string
}

const portraitTransition = {
  duration: 1.15,
  ease: [0.22, 1, 0.36, 1] as const,
  delay: 0.1,
}

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
 * La photo prend toute la hauteur du hero section.
 *
 * Effets à l'ouverture :
 *   • fade-in + scale doux
 *   • slide-up
 *   • blur-to-sharp
 *
 * Respecte prefers-reduced-motion.
 */
export function HeroPhotoNoBg({
  src = '/alexandre-lopez-no-background.png',
  alt,
  className = '',
}: HeroPhotoNoBgProps) {
  const prefersReducedMotion = useReducedMotion()
  const reduce = !!prefersReducedMotion

  return (
    <div
      className={'relative w-full h-full flex items-end justify-center overflow-hidden ' + className}
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
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover object-bottom drop-shadow-[0_24px_60px_rgba(0,99,144,0.28)]"
        />
      </motion.div>
    </div>
  )
}

export default HeroPhotoNoBg