'use client'

import React from 'react'

export interface StagingComparisonVsTemplateProps {
  pageNumber?: number
  title?: string
  subtitle?: string
  eyebrow?: string
  moduleTitle?: string
  paragraphs?: string[]
  leftImage?: { url: string; label: string }
  rightImage?: { url: string; label: string }
  beforeAfter?: { beforeLabel: string; beforeImg: string; afterLabel: string; afterImg: string }
}

export function StagingComparisonVsTemplate({
  pageNumber = 12,
  title = 'La Mise en Valeur des Volumes',
  subtitle = 'L’impact du home staging sur la projection immédiate de l’acquéreur',
  eyebrow,
  moduleTitle = 'Préparation du Bien',
  paragraphs = [
    'Le home staging ne consiste pas à masquer des défauts, mais à révéler le plein potentiel des volumes et la circulation de la lumière naturelle.',
    'Un logement désencombré et harmonisé permet aux acquéreurs de se projeter instantanément avec leur propre mobilier, sans être distraits par votre quotidien.',
  ],
  leftImage,
  rightImage,
  beforeAfter,
}: StagingComparisonVsTemplateProps) {
  const actualEyebrow = eyebrow ?? `Module · ${moduleTitle}`

  const actualLeftImage = beforeAfter
    ? { url: beforeAfter.beforeImg, label: beforeAfter.beforeLabel }
    : (leftImage ?? {
        url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
        label: 'Espace encombré et sombre',
      })

  const actualRightImage = beforeAfter
    ? { url: beforeAfter.afterImg, label: beforeAfter.afterLabel }
    : (rightImage ?? {
        url: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80',
        label: 'Volume valorisé, épuré et lumineux',
      })

  return (
    <div className="a4-sheet relative flex h-full w-full flex-col justify-between overflow-hidden bg-white p-8 sm:p-10 md:p-11 text-zinc-800 shadow-2xl select-none aspect-[1/1.414]">
      {/* ─── 1. FOLIO SUPÉRIEUR ─── */}
      <div className="border-b border-zinc-200 pb-2.5 mb-4 flex items-center justify-between text-[9px] uppercase tracking-[0.2em] font-semibold text-zinc-400">
        <span className="text-[#006390] font-bold">
          {actualEyebrow}
        </span>
        <span>
          Guide Pratique du Vendeur · Alexandre Lopez
        </span>
      </div>

      {/* ─── 2. TITRE & SOUS-TITRE ─── */}
      <div className="mb-4">
        <h2 className="font-sans text-2xl sm:text-[27px] font-bold text-zinc-900 tracking-tight mb-1 leading-tight">
          {title}
        </h2>
        <p className="text-xs font-semibold text-[#006390] uppercase tracking-wider">
          {subtitle}
        </p>
      </div>

      {/* ─── 3. ANALYSE ÉDITORIALE EN 2 BLOCS ─── */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {paragraphs.map((p, idx) => (
          <div
            key={idx}
            className="bg-zinc-50/60 border border-zinc-200/80 rounded-lg p-3"
          >
            <span className="text-[9.5px] font-bold tracking-wider text-[#006390] uppercase block mb-1">
              {idx === 0 ? 'Principe fondamental' : 'Bénéfice acquéreur'}
            </span>
            <p className="text-[11.5px] sm:text-xs leading-relaxed text-zinc-600">
              {p}
            </p>
          </div>
        ))}
      </div>

      {/* ─── 4. PLANCHE COMPARATIVE ARCHITECTURALE ─── */}
      <div className="flex-1 min-h-[190px] grid grid-cols-2 gap-3 mb-3">
        {/* Photo Gauche */}
        <div className="relative rounded-lg overflow-hidden border border-zinc-200 shadow-xs bg-zinc-100 flex flex-col justify-end">
          <img
            src={actualLeftImage.url}
            alt={actualLeftImage.label}
            className="absolute inset-0 h-full w-full object-cover object-center grayscale-[15%]"
          />
          <div className="relative z-10 m-2.5 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded text-[9.5px] font-semibold text-zinc-600 border border-zinc-200/80 shadow-2xs">
            {actualLeftImage.label}
          </div>
        </div>

        {/* Photo Droite */}
        <div className="relative rounded-lg overflow-hidden border border-[#006390]/40 shadow-xs bg-zinc-100 flex flex-col justify-end">
          <img
            src={actualRightImage.url}
            alt={actualRightImage.label}
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
          <div className="relative z-10 m-2.5 bg-[#001D2D]/90 backdrop-blur-xs px-2.5 py-1 rounded text-[9.5px] font-semibold text-white border border-white/10 shadow-2xs">
            {actualRightImage.label}
          </div>
        </div>
      </div>

      {/* ─── 5. FOLIO INFÉRIEUR ─── */}
      <div className="border-t border-zinc-200 pt-2.5 flex items-center justify-between text-[10px] uppercase tracking-wider text-zinc-400 font-medium">
        <span>Alexandre Lopez · Conseiller en Immobilier iad</span>
        <span className="font-bold text-zinc-700">
          Page {String(pageNumber).padStart(2, '0')}
        </span>
      </div>
    </div>
  )
}
