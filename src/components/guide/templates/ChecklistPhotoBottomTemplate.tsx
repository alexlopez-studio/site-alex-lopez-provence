'use client'

import React from 'react'

export interface ChecklistPhotoBottomTemplateProps {
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

export function ChecklistPhotoBottomTemplate({
  pageNumber = 11,
  title = 'Cadrage Fiscal : RP vs Secondaire',
  subtitle = 'Anticiper la plus-value pour éviter les mauvaises surprises',
  eyebrow,
  moduleTitle = 'Penser son projet (Vente ➔ Achat)',
  itemsWithBadges = [
    {
      badge: 'Résidence principale',
      text: 'Exonération totale à 100% d’impôt sur le revenu et de prélèvements sociaux. Condition : occupation effective au moment de la vente (délai normal d’inoccupation admis fixé à 1 an max).',
    },
    {
      badge: 'Résidence secondaire',
      text: 'Taxation globale de 36,2% (19% IR + 17,2% prélèvements sociaux). L’exonération totale d’IR n’intervient qu’après 22 ans de détention, et 30 ans pour les prélèvements sociaux.',
    },
    {
      badge: 'Déduction des travaux',
      text: 'Vous pouvez majorer le prix d’achat du montant des travaux réels réalisés par des entreprises qualifiées (factures avec fourniture et pose), ou appliquer le forfait fiscal de 15% après 5 ans.',
    },
    {
      badge: 'Simulation notariée préalable',
      text: 'Règle d’or : demandez à votre notaire de calculer le montant exact de la plus-value avant de fixer votre prix pour ne pas découvrir une retenue imprévue le jour de la signature.',
    },
  ],
  adviceBox,
  heroImage = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=85',
  figureCaption = 'Propriété d’exception en Provence · Valorisation patrimoniale',
  atmosphere = 'dark',
}: ChecklistPhotoBottomTemplateProps) {
  const actualEyebrow = eyebrow ?? `Module 01 · ${moduleTitle}`
  const isTwoItems = itemsWithBadges.length <= 2
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

      {/* ─── 3. FOLIO SUPÉRIEUR (FILET MINIMALISTE ÉDITORIAL) ─── */}
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

      {/* ─── 4. TITRAGE MAJUSCULE & SOUS-TITRE PROPRE ─── */}
      <div className="relative z-10 mb-5">
        <h2
          className={`font-sans text-2xl sm:text-[28px] font-bold tracking-tight mb-1.5 leading-tight ${
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

      {/* ─── 5. CONTENU : PURE TYPOGRAPHIE SANS CARDS ─── */}
      <div className="relative z-10 flex-1 flex flex-col justify-between min-h-0 mb-4">
        {isTwoItems ? (
          /* Disposition 2 Éléments Épurée */
          <div className="space-y-4">
            {itemsWithBadges.map((item, idx) => (
              <div
                key={idx}
                className={`pt-3.5 border-t ${
                  isDark ? 'border-white/15' : 'border-zinc-300'
                }`}
              >
                <div className="flex items-baseline gap-3 mb-1">
                  <span
                    className={`font-mono text-xs font-bold tracking-wider ${
                      isDark ? 'text-[#7DD3FC]' : 'text-[#006390]'
                    }`}
                  >
                    0{idx + 1}
                  </span>
                  <h3
                    className={`text-sm font-bold uppercase tracking-wide ${
                      isDark ? 'text-white' : 'text-zinc-900'
                    }`}
                  >
                    {item.badge}
                  </h3>
                </div>
                <p
                  className={`text-xs sm:text-[12.5px] leading-relaxed pl-6 ${
                    isDark ? 'text-zinc-200 font-normal' : 'text-zinc-700 font-normal'
                  }`}
                >
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        ) : (
          /* Disposition 4 Éléments : Grille Typographique Aérée avec Filets Fiers */
          <div className="grid grid-cols-2 gap-x-8 gap-y-5">
            {itemsWithBadges.map((item, idx) => (
              <div
                key={idx}
                className={`pt-3 border-t flex flex-col justify-start ${
                  isDark ? 'border-white/20' : 'border-zinc-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className={`text-[9.5px] font-bold tracking-widest uppercase font-mono ${
                      isDark ? 'text-[#7DD3FC]' : 'text-[#006390]'
                    }`}
                  >
                    Point 0{idx + 1}
                  </span>
                  <div
                    className={`h-1 w-1 rounded-full ${
                      isDark ? 'bg-[#7DD3FC]/60' : 'bg-[#006390]/50'
                    }`}
                  />
                </div>
                <h3
                  className={`text-[12px] sm:text-[12.5px] font-bold uppercase tracking-wide mb-1.5 ${
                    isDark ? 'text-white' : 'text-zinc-900'
                  }`}
                >
                  {item.badge}
                </h3>
                <p
                  className={`text-[11.5px] sm:text-[12px] leading-relaxed ${
                    isDark ? 'text-zinc-200' : 'text-zinc-700'
                  }`}
                >
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* ─── ENCADRÉ CONSEIL D'EXPERT (FORMAT CITATION ÉDITORIALE, AUCUNE CARTE) ─── */}
        {adviceBox && (
          <div
            className={`mt-4 border-l-2 pl-4 py-1 ${
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
              {adviceBox.title || 'Conseil d’Alexandre Lopez'}
            </div>
            <p className="text-[11.5px] sm:text-xs leading-relaxed italic">
              « {adviceBox.text} »
            </p>
          </div>
        )}
      </div>

      {/* ─── 6. LÉGENDE DE LA PHOTO PLEINE PAGE & FOLIO INFÉRIEUR ─── */}
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
