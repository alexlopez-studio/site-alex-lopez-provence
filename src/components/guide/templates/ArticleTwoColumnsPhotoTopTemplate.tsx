'use client'

import React from 'react'

export interface ArticleTwoColumnsPhotoTopTemplateProps {
  pageNumber?: number
  title?: string
  subtitle?: string
  heroImage?: string
  figureCaption?: string
  moduleTitle?: string
  twoColumnsText?: { col1: string[]; col2: string[] }
  atmosphere?: 'dark' | 'light'
}

export function ArticleTwoColumnsPhotoTopTemplate({
  pageNumber = 8,
  title = 'Vendre ou Acheter d’Abord ?',
  subtitle = 'Arbitrer entre sécurité financière et sérénité du relogement',
  heroImage = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1400&q=85',
  figureCaption = 'Arbitrage financier & sérénité du relogement en Provence',
  moduleTitle = 'Penser son projet (Vente ➔ Achat)',
  twoColumnsText = {
    col1: [
      'Le mirage du coup de cœur : acheter avant d’avoir vendu nécessite la souscription d’un prêt relais dont les taux pèsent lourdement sur le budget familial.',
      'La banque accorde 12 à 24 mois maximum. La pression psychologique augmente au fil des mois sans acheteur, obligeant souvent à brader son bien.',
    ],
    col2: [
      'La sécurité financière absolue : vendre d’abord permet de connaître votre budget au centime près et de négocier votre futur bien en position de force.',
      'La crainte du relogement temporaire se résout facilement grâce aux leviers juridiques détaillés en page suivante.',
    ],
  },
  atmosphere = 'dark',
}: ArticleTwoColumnsPhotoTopTemplateProps) {
  const actualEyebrow = `Module 01 · ${moduleTitle}`
  const isDark = atmosphere === 'dark'

  return (
    <div
      className={`a4-sheet relative flex h-full w-full flex-col justify-between overflow-hidden shadow-2xl p-8 sm:p-10 md:p-11 select-none aspect-[1/1.414] ${
        isDark ? 'bg-[#001D2D] text-white' : 'bg-white text-zinc-900'
      }`}
    >
      {/* ─── 1. FOND PHOTO PLEINE PAGE ARCHITECTURALE (FULL BLEED) ─── */}
      <img
        src={heroImage}
        alt={title}
        className="absolute inset-0 h-full w-full object-cover object-center pointer-events-none"
      />

      {/* ─── 2. VOILE ÉDITORIAL DE LISIBILITÉ & PROFONDEUR ─── */}
      {isDark ? (
        <div className="absolute inset-0 bg-gradient-to-b from-[#001D2D]/94 via-[#001D2D]/84 to-[#001D2D]/95 pointer-events-none" />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-b from-white/94 via-white/86 to-white/95 backdrop-blur-[0.5px] pointer-events-none" />
      )}

      {/* ─── 3. FOLIO SUPÉRIEUR ─── */}
      <div
        className={`relative z-10 pb-2.5 mb-4 flex items-center justify-between text-[9px] uppercase tracking-[0.2em] font-semibold border-b ${
          isDark ? 'border-white/15 text-white/60' : 'border-zinc-300 text-zinc-500'
        }`}
      >
        <span className={isDark ? 'text-[#7DD3FC] font-bold' : 'text-[#006390] font-bold'}>
          {actualEyebrow}
        </span>
        <span>Guide Pratique du Vendeur · Alexandre Lopez</span>
      </div>

      {/* ─── 4. TITRE & SOUS-TITRE ─── */}
      <div className="relative z-10 mb-5">
        <h2
          className={`font-sans text-2xl sm:text-[28px] font-bold tracking-tight mb-1 leading-tight ${
            isDark ? 'text-white' : 'text-zinc-950'
          }`}
        >
          {title}
        </h2>
        <p
          className={`text-xs font-semibold uppercase tracking-wider ${
            isDark ? 'text-[#7DD3FC]' : 'text-[#006390]'
          }`}
        >
          {subtitle}
        </p>
      </div>

      {/* ─── 5. DEUX OPTIONS COMPARATIVES EN PURE TYPOGRAPHIE (SANS CARDS) ─── */}
      <div className="relative z-10 grid grid-cols-2 gap-x-8 my-auto mb-4">
        {/* Option A */}
        <div
          className={`pt-3 border-t flex flex-col justify-between ${
            isDark ? 'border-white/20' : 'border-zinc-300'
          }`}
        >
          <div>
            <div
              className={`text-xs font-bold tracking-wider uppercase mb-3 flex items-center justify-between ${
                isDark ? 'text-zinc-300' : 'text-zinc-600'
              }`}
            >
              <span>Option A · Acheter d’abord</span>
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  isDark ? 'bg-zinc-400' : 'bg-zinc-400'
                }`}
              />
            </div>
            <div className="space-y-2.5">
              {twoColumnsText.col1.map((p, i) => (
                <p
                  key={i}
                  className={`text-[12px] sm:text-[12.5px] leading-relaxed ${
                    isDark ? 'text-zinc-300' : 'text-zinc-700'
                  }`}
                >
                  {p}
                </p>
              ))}
            </div>
          </div>
          <div
            className={`mt-4 pt-2.5 border-t text-[11px] font-medium italic ${
              isDark ? 'border-white/10 text-amber-300/90' : 'border-zinc-200 text-amber-800'
            }`}
          >
            Prêt relais lourd et risque de brader sous la pression des délais bancaires.
          </div>
        </div>

        {/* Option B */}
        <div
          className={`pt-3 border-t flex flex-col justify-between ${
            isDark ? 'border-[#7DD3FC]' : 'border-[#006390]'
          }`}
        >
          <div>
            <div
              className={`text-xs font-bold tracking-wider uppercase mb-3 flex items-center justify-between ${
                isDark ? 'text-[#7DD3FC]' : 'text-[#006390]'
              }`}
            >
              <span>Option B · Vendre d’abord (Recommandé)</span>
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  isDark ? 'bg-[#7DD3FC]' : 'bg-[#006390]'
                }`}
              />
            </div>
            <div className="space-y-2.5">
              {twoColumnsText.col2.map((p, i) => (
                <p
                  key={i}
                  className={`text-[12px] sm:text-[12.5px] leading-relaxed font-normal ${
                    isDark ? 'text-zinc-100' : 'text-zinc-800'
                  }`}
                >
                  {p}
                </p>
              ))}
            </div>
          </div>
          <div
            className={`mt-4 pt-2.5 border-t text-[11px] font-bold ${
              isDark ? 'border-[#7DD3FC]/30 text-[#7DD3FC]' : 'border-[#006390]/30 text-[#006390]'
            }`}
          >
            Maîtrise financière totale et négociation en position de force.
          </div>
        </div>
      </div>

      {/* ─── 6. LÉGENDE PHOTO PLEINE PAGE & FOLIO INFÉRIEUR ─── */}
      <div
        className={`relative z-10 border-t pt-2.5 flex items-center justify-between text-[10px] uppercase tracking-wider font-medium ${
          isDark ? 'border-white/15 text-white/60' : 'border-zinc-300 text-zinc-500'
        }`}
      >
        <div className="flex items-center gap-2">
          <span className={isDark ? 'text-white/80' : 'text-zinc-800'}>
            Alexandre Lopez · Conseiller en Immobilier iad
          </span>
          <span className="opacity-40">·</span>
          <span className="italic normal-case text-[9.5px] opacity-70">
            {figureCaption}
          </span>
        </div>
        <span className={`font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>
          Page {String(pageNumber).padStart(2, '0')}
        </span>
      </div>
    </div>
  )
}
