'use client'

import React, { useState, useRef, useCallback } from 'react'
import Image from 'next/image'
import { Sparkles, MoveHorizontal } from 'lucide-react'

interface InteractiveBeforeAfterSliderProps {
  beforeImg?: string
  beforeLabel?: string
  afterImg?: string
  afterLabel?: string
}

export function InteractiveBeforeAfterSlider({
  beforeImg = '/maison-bleue-cotignac.jpg',
  beforeLabel = 'Photo smartphone amateur (faible contraste, contre-jour)',
  afterImg = '/village-cotignac.jpg',
  afterLabel = 'Reportage photo pro iad (HDR, grand angle, lumière provençale)',
}: InteractiveBeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const position = Math.max(0, Math.min(100, (x / rect.width) * 100))
    setSliderPosition(position)
  }, [])

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return
    handleMove(e.touches[0].clientX)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    handleMove(e.clientX)
  }

  return (
    <div className="w-full select-none">
      <div
        ref={containerRef}
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onMouseMove={handleMouseMove}
        onTouchStart={() => setIsDragging(true)}
        onTouchEnd={() => setIsDragging(false)}
        onTouchMove={handleTouchMove}
        className="relative aspect-[16/10] sm:aspect-[16/9] w-full cursor-ew-resize overflow-hidden rounded-3xl border-2 border-border/80 bg-slate-950 shadow-xl ring-1 ring-black/5"
      >
        {/* 1. Image APRES (Pleine largeur en arrière-plan) */}
        <div className="absolute inset-0 h-full w-full">
          <Image
            src={afterImg}
            alt="Après valorisation professionnelle"
            fill
            sizes="(max-width: 768px) 100vw, 800px"
            className="object-cover brightness-105 contrast-105"
            draggable={false}
          />
          <div className="absolute bottom-4 right-4 z-10 rounded-full bg-brand/90 px-3.5 py-1.5 text-xs font-bold text-white shadow-lg backdrop-blur-md flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-brand-light" />
            <span className="hidden sm:inline">Méthode Guide :</span>
            <span>{afterLabel.split('(')[0]}</span>
          </div>
        </div>

        {/* 2. Image AVANT (Clipée selon la position du slider) */}
        <div
          className="absolute inset-0 h-full w-full overflow-hidden"
          style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
        >
          <Image
            src={beforeImg}
            alt="Avant valorisation"
            fill
            sizes="(max-width: 768px) 100vw, 800px"
            className="object-cover grayscale-[35%] brightness-[80%]"
            draggable={false}
          />
          <div className="absolute bottom-4 left-4 z-10 rounded-full bg-slate-900/85 px-3.5 py-1.5 text-xs font-bold text-white/90 shadow-lg backdrop-blur-md">
            <span>Annonce Classique</span>
          </div>
        </div>

        {/* 3. Ligne de séparation verticale et poignée centrale */}
        <div
          className="absolute bottom-0 top-0 z-20 w-0.5 bg-white shadow-[0_0_12px_rgba(0,0,0,0.6)]"
          style={{ left: `${sliderPosition}%` }}
        >
          {/* Poignée interactive circulaire */}
          <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 flex h-11 w-11 sm:h-13 sm:w-13 items-center justify-center rounded-full bg-white text-foreground shadow-[0_6px_25px_rgba(0,0,0,0.35)] ring-4 ring-brand/40 transition-transform active:scale-95">
            <MoveHorizontal className="h-5 w-5 sm:h-6 sm:w-6 text-brand" />
          </div>
        </div>

        {/* Indication d'interaction en haut */}
        <div className="pointer-events-none absolute top-4 left-1/2 -translate-x-1/2 z-10 rounded-full bg-black/50 px-3.5 py-1 text-[11px] font-semibold text-white backdrop-blur-md border border-white/15">
          Glissez pour comparer l'impact visuel
        </div>
      </div>
    </div>
  )
}
