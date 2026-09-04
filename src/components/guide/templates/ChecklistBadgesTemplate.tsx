'use client'

import React from 'react'

export interface ChecklistBadgesTemplateProps {
  pageNumber?: number
  title?: string
  subtitle?: string
  eyebrow?: string
  moduleTitle?: string
  itemsWithBadges?: { badge: string; text: string }[]
  heroImage?: string
  figureCaption?: string
  atmosphere?: 'dark' | 'light'
}

export function ChecklistBadgesTemplate({
  pageNumber = 9,
  title = 'Synchronisation des Calendriers',
  subtitle = 'Les leviers juridiques pour éviter le double déménagement',
  eyebrow,
  moduleTitle = 'Penser son projet (Vente ➔ Achat)',
  itemsWithBadges = [
    {
      badge: 'La vente longue (4 à 6 mois)',
      text: 'Négociez dès l’offre un délai prolongé entre le compromis et l’acte authentique (au lieu des 3 mois habituels). Cela vous offre le temps nécessaire pour visiter, faire une offre et synchroniser votre futur achat.',
    },
    {
      badge: 'Convention d’occupation',
      text: 'Insérez une convention d’occupation précaire dans l’acte authentique : vous touchez l’intégralité des fonds de la vente le jour J tout en restant dans les lieux 2 à 4 semaines moyennant indemnité séquestrée.',
    },
    {
      badge: 'Clause suspensive d’achat',
      text: 'En cas de chaîne de transactions, le notaire peut encadrer la date limite de libération des lieux pour faire coïncider les deux actes le même jour dans la même étude notariale.',
    },
    {
      badge: 'Éviter le garde-meuble',
      text: 'Une planification rigoureuse dès le premier jour de mise en vente permet d’éviter les coûts et la fatigue d’un déménagement temporaire et la location d’un box de stockage.',
    },
  ],
  heroImage = 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1400&q=85',
  figureCaption = 'Synchronisation notariale & gestion du calendrier de vente en Provence',
  atmosphere = 'dark',
}: ChecklistBadgesTemplateProps) {
  const actualEyebrow = eyebrow ?? `Module 01 · ${moduleTitle}`
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
        <h1
          className={`font-sans text-2xl sm:text-[28px] font-bold tracking-tight mb-1 leading-tight ${
            isDark ? 'text-white' : 'text-zinc-950'
          }`}
        >
          {title}
        </h1>
        <p
          className={`text-xs font-semibold uppercase tracking-wider ${
            isDark ? 'text-[#7DD3FC]' : 'text-[#006390]'
          }`}
        >
          {subtitle}
        </p>
      </div>

      {/* ─── 5. LISTE DES 4 DISPOSITIFS EN PURE TYPOGRAPHIE (SANS CARDS) ─── */}
      <div className="relative z-10 space-y-3.5 my-auto mb-4">
        {itemsWithBadges.map((item, idx) => (
          <div
            key={idx}
            className={`pt-2.5 border-t flex items-start gap-5 ${
              isDark ? 'border-white/20' : 'border-zinc-300'
            }`}
          >
            <div className="shrink-0 w-48">
              <span
                className={`text-[9px] font-mono font-bold tracking-widest uppercase block mb-0.5 ${
                  isDark ? 'text-[#7DD3FC]' : 'text-[#006390]'
                }`}
              >
                Dispositif 0{idx + 1}
              </span>
              <h3
                className={`text-xs sm:text-[13px] font-bold uppercase tracking-wide ${
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

      {/* ─── 6. ENCADRÉ CONSEIL (FORMAT CITATION ÉDITORIALE) ─── */}
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
          Le conseil d'Alexandre Lopez
        </div>
        <p className="text-[11.5px] sm:text-xs leading-relaxed italic">
          « N’acceptez jamais un compromis sans avoir validé la date de remise des clés en accord avec l’avancement de votre future acquisition. »
        </p>
      </div>

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

