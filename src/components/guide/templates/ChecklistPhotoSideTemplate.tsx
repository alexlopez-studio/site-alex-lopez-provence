'use client'

import React from 'react'

export interface ChecklistPhotoSideTemplateProps {
  pageNumber?: number
  title?: string
  subtitle?: string
  eyebrow?: string
  moduleTitle?: string
  itemsWithBadges?: { badge: string; text: string }[]
  adviceBox?: { title?: string; text: string }
  heroImage?: string
  figureCaption?: string
  atmosphere?: 'dark' | 'light'
}

export function ChecklistPhotoSideTemplate({
  pageNumber = 12,
  title = 'Détails & Extérieurs',
  subtitle = 'Les points qui créent le sentiment de qualité en Provence',
  eyebrow,
  moduleTitle = 'Valorisation du Bien',
  itemsWithBadges = [
    {
      badge: 'Clôtures & Accès',
      text: 'Réparez les clôtures affaissées, portillons déboîtés ou grillages détendus pour délimiter nettement votre propriété.',
    },
    {
      badge: 'Toiture & Gouttières',
      text: 'Vérifiez la toiture : remplacez les tuiles ébréchées et nettoyez les gouttières encombrées par les feuilles mortes.',
    },
    {
      badge: 'Micro-fissures',
      text: 'Rebouchez les micro-fissures d’enduit sur les murets extérieurs et terrasses pour rassurer sur l’étanchéité.',
    },
    {
      badge: 'Touches de peinture',
      text: 'Passez un coup de peinture propre sur les chambranles de portes et angles de murs abîmés par les passages quotidiens.',
    },
    {
      badge: 'Test olfactif',
      text: 'Faites tester l’odeur de votre maison par un proche objectif 30 minutes après avoir aéré les pièces de vie.',
    },
  ],
  adviceBox,
  heroImage = 'https://images.unsplash.com/photo-1545083036-b175dd155a1d?auto=format&fit=crop&w=1400&q=85',
  figureCaption = 'Ambiance provençale soignée · Vue sur jardin & terrasse',
  atmosphere = 'dark',
}: ChecklistPhotoSideTemplateProps) {
  const actualEyebrow = eyebrow ?? `Module · ${moduleTitle}`
  const isDark = atmosphere === 'dark'
  const effectiveAdvice = adviceBox ?? {
    title: 'Conseil d’Alexandre Lopez',
    text: 'Les acheteurs inspectent en priorité les détails d’entretien. Un extérieur impeccable suggère immédiatement un bâti sain et choyé au fil des ans.',
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

      {/* ─── 5. LISTE DE CONTRÔLE EN PURE TYPOGRAPHIE (SANS CARDS) ─── */}
      <div className="relative z-10 space-y-3.5 my-auto mb-4">
        {itemsWithBadges.map((item, idx) => (
          <div
            key={idx}
            className={`pt-2.5 border-t flex items-start gap-4 ${
              isDark ? 'border-white/20' : 'border-zinc-300'
            }`}
          >
            <div className="shrink-0 w-44">
              <span
                className={`text-[9px] font-mono font-bold tracking-widest uppercase block mb-0.5 ${
                  isDark ? 'text-[#7DD3FC]' : 'text-[#006390]'
                }`}
              >
                Point 0{idx + 1}
              </span>
              <h3
                className={`text-[12px] sm:text-xs font-bold uppercase tracking-wide ${
                  isDark ? 'text-white' : 'text-zinc-900'
                }`}
              >
                {item.badge}
              </h3>
            </div>
            <p
              className={`text-[11.5px] sm:text-[12px] leading-relaxed flex-1 ${
                isDark ? 'text-zinc-200' : 'text-zinc-700'
              }`}
            >
              {item.text}
            </p>
          </div>
        ))}
      </div>

      {/* ─── 6. ENCADRÉ CONSEIL D'EXPERT (FORMAT CITATION ÉDITORIALE) ─── */}
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
