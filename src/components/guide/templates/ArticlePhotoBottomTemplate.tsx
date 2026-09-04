'use client'

import React from 'react'

export interface ArticlePhotoBottomTemplateProps {
  pageNumber?: number
  title?: string
  subtitle?: string
  eyebrow?: string
  moduleTitle?: string
  paragraphs?: string[]
  adviceBox?: { title?: string; text: string }
  heroImage?: string
  figureCaption?: string
  atmosphere?: 'dark' | 'light'
}

export function ArticlePhotoBottomTemplate({
  pageNumber = 16,
  title = 'CMA vs. Appraisal',
  subtitle = 'Quelle différence entre analyse comparative et expertise en Provence ?',
  eyebrow,
  moduleTitle = 'Stratégie de prix',
  paragraphs = [
    'L’Analyse Comparative de Marché (CMA) et l’expertise vénale sont deux méthodes professionnelles qui répondent à des objectifs complémentaires.',
    'Le conseiller immobilier réalise une CMA pour déterminer le prix optimal auquel le bien trouvera preneur dans le contexte concurrentiel actuel.',
    'L’expert ou le service bancaire évalue quant à lui la valeur intrinsèque pour sécuriser l’hypothèque du prêt de l’acquéreur.',
    'Si le prix convenu dépasse largement la valeur d’expertise, la banque peut refuser le financement de votre acheteur.',
  ],
  adviceBox,
  heroImage = 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1400&q=85',
  figureCaption = 'Analyse de marché & évaluation rigoureuse en Provence',
  atmosphere = 'dark',
}: ArticlePhotoBottomTemplateProps) {
  const actualEyebrow = eyebrow ?? `Module 02 · ${moduleTitle}`
  const isDark = atmosphere === 'dark'

  const effectiveAdvice = adviceBox ?? {
    title: 'Conseil d’arbitrage d’Alexandre Lopez',
    text: 'Une vente sécurisée concilie toujours la réalité commerciale du marché (le prix que les acheteurs sont prêts à payer) et la rigueur de l’expertise bancaire (la valeur que la banque accepte d’hypothéquer).',
  }

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

      {/* ─── 5. 4 POINTS MÉTHODOLOGIQUES EN PURE TYPOGRAPHIE (SANS CARDS) ─── */}
      <div className="relative z-10 space-y-3.5 my-auto mb-4">
        {paragraphs.map((p, i) => (
          <div
            key={i}
            className={`pt-2.5 border-t flex items-start gap-4 ${
              isDark ? 'border-white/20' : 'border-zinc-300'
            }`}
          >
            <span
              className={`font-mono text-xs font-bold shrink-0 pt-0.5 w-6 ${
                isDark ? 'text-[#7DD3FC]' : 'text-[#006390]'
              }`}
            >
              0{i + 1}.
            </span>
            <p
              className={`text-[12px] sm:text-[12.5px] leading-relaxed flex-1 ${
                isDark ? 'text-zinc-200' : 'text-zinc-700'
              }`}
            >
              {p}
            </p>
          </div>
        ))}
      </div>

      {/* ─── 6. ENCADRÉ CONSEIL EXPERT (FORMAT CITATION ÉDITORIALE) ─── */}
      {effectiveAdvice && (
        <div
          className={`relative z-10 border-l-2 pl-4 py-1 mb-4 ${
            isDark
              ? 'border-[#7DD3FC] text-zinc-200'
              : 'border-[#006390] text-zinc-800'
          }`}
        >
          <div
            className={`text-[9.5px] font-bold tracking-wider uppercase mb-1 ${
              isDark ? 'text-[#7DD3FC]' : 'text-[#006390]'
            }`}
          >
            {effectiveAdvice.title}
          </div>
          <p className="text-[11.5px] sm:text-xs leading-relaxed italic">
            « {effectiveAdvice.text} »
          </p>
        </div>
      )}

      {/* ─── 7. LÉGENDE PHOTO PLEINE PAGE & FOLIO INFÉRIEUR ─── */}
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
