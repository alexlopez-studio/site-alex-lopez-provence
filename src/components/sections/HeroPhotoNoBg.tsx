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
 *
 * IMPORTANT — pour les PNG à fond transparent :
 *   • on utilise object-contain (pas object-cover) pour ne PAS étirer/zoomer la photo
 *     à grande résolution. object-cover provoquait des artefacts verticaux sur les bords
 *     du PNG transparent quand le conteneur devenait plus large que la photo.
 *   • object-bottom pour ancrer la photo en bas du conteneur.
 *   • pas de drop-shadow filter (causait des halos sur les bords transparents).
 *
 * Sur grands écrans, on agrandit la photo via un scale CSS (origin-bottom) pour
 * qu'Alexandre prenne plus de place verticalement et ne paraisse plus « tassé en bas ».
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
        className="relative w-full h-full flex items-end justify-center select-none pointer-events-none"
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-contain object-bottom origin-bottom lg:scale-110 xl:scale-125"
        />
      </motion.div>
    </div>
  )
}

export default HeroPhotoNoBg
