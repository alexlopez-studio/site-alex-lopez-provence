'use client'

import React from 'react'

export interface CoverTemplateProps {
  title?: string
  subtitle?: string
  heroImage?: string
  edition?: string
  region?: string
}

export function CoverTemplate({
  title = 'Particulier, Comment Vendre Votre Bien ?',
  subtitle = 'Le guide pas-à-pas pour réussir votre vente en Provence & Côte d’Azur',
  heroImage = '/images/guide/provence-cote-dazur-cover.jpg',
  edition = 'Édition Propriétaire · 2026',
}: CoverTemplateProps) {
  return (
    <div className="a4-sheet relative flex h-full w-full flex-col justify-between overflow-hidden bg-zinc-900 text-white shadow-2xl p-10 sm:p-14 md:p-16 select-none aspect-[1/1.414]">
      {/* ─── Fond Photo Plein Format (Full Bleed) ─── */}
      <img
        src={heroImage}
        alt={title}
        className="absolute inset-0 h-full w-full object-cover object-center pointer-events-none"
      />

      {/* ─── Voile Délicat Lisibilité ─── */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/65 pointer-events-none" />

      {/* ─── 1. TITRE SUPÉRIEUR GAUCHE (STYLE ORIGINAL BOOKLET) ─── */}
      <div className="relative z-10 max-w-lg pt-4">
        <h1 className="font-sans text-3xl sm:text-4xl md:text-[44px] font-extrabold tracking-tight text-white uppercase leading-[1.08] drop-shadow-md">
          {title}
        </h1>
      </div>

      {/* ─── 2. SOUS-TITRE EN BAS À DROITE (STYLE ORIGINAL BOOKLET) ─── */}
      <div className="relative z-10 text-right max-w-xs ml-auto pb-4">
        <p className="text-xs sm:text-[13px] text-zinc-100 font-medium leading-relaxed drop-shadow-sm">
          {subtitle}
        </p>
        <div className="mt-4 pt-3 border-t border-white/20">
          <p className="text-[10px] text-zinc-300 uppercase tracking-[0.2em] font-semibold">
            Alexandre Lopez · {edition}
          </p>
        </div>
      </div>
    </div>
  )
}
