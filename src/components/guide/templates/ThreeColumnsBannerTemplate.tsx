'use client'

import React from 'react'

export interface ThreeColumnsBannerTemplateProps {
  pageNumber?: number
  title?: string
  subtitle?: string
  moduleTitle?: string
  columns?: { number: string; title: string; text: string }[]
  threeColumns?: { number: string; title: string; text: string }[]
  bannerText?: string
  bannerBox?: { title?: string; text: string }
  heroImage?: string
  figureCaption?: string
  atmosphere?: 'dark' | 'light'
}

export function ThreeColumnsBannerTemplate({
  pageNumber = 10,
  title = 'Le Capital Net Réinvestissable',
  subtitle = 'Calculer votre capacité de réinvestissement au centime près',
  moduleTitle = 'Penser son projet (Vente ➔ Achat)',
  columns,
  threeColumns,
  bannerText,
  bannerBox,
  heroImage = 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1400&q=85',
  figureCaption = 'Arbitrage notarial & sécurisation du capital en Provence',
  atmosphere = 'dark',
}: ThreeColumnsBannerTemplateProps) {
  const actualColumns = threeColumns ?? columns ?? [
    {
      number: '01',
      title: 'Capital restant dû',
      text: 'Le solde de votre prêt en cours auprès de la banque, augmenté des indemnités de remboursement anticipé (IRA, plafonnées à 3% du capital ou 6 mois d’intérêts).',
    },
    {
      number: '02',
      title: 'Mainlevée d’hypothèque',
      text: 'Si votre bien est garanti par une hypothèque ou un PPD, prévoyez environ 0,3% à 0,5% du crédit initial pour radier l’inscription au service foncier.',
    },
    {
      number: '03',
      title: 'Impôt sur la plus-value',
      text: 'Hors résidence principale, la taxation (19% IR + 17,2% prélèvements sociaux) est directement calculée et retenue à la source par le notaire le jour de l’acte.',
    },
  ]

  const actualBannerTitle = bannerBox?.title ?? 'La formule du capital réinvestissable réel'
  const actualBannerText =
    bannerBox?.text ??
    bannerText ??
    'Prix de vente acte − Remboursement crédit − Mainlevée − Coûts diagnostics − Fiscalité = Votre apport cash réel. Sur votre future acquisition, n’oubliez jamais d’anticiper environ 7% à 8% de frais d’acte notarié.'

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

      {/* ─── 5. 3 COLONNES EN PURE TYPOGRAPHIE (SANS CARDS) ─── */}
      <div className="relative z-10 grid grid-cols-3 gap-x-6 my-auto mb-4">
        {actualColumns.map((col, idx) => (
          <div
            key={col.number}
            className={`pt-3 border-t flex flex-col justify-start ${
              isDark ? 'border-white/20' : 'border-zinc-300'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span
                className={`font-mono text-sm font-bold tracking-tight ${
                  isDark ? 'text-[#7DD3FC]' : 'text-[#006390]'
                }`}
              >
                {col.number}
              </span>
              <span
                className={`text-[8.5px] font-mono uppercase tracking-widest ${
                  isDark ? 'text-white/50' : 'text-zinc-400'
                }`}
              >
                Poste 0{idx + 1}
              </span>
            </div>
            <h3
              className={`text-[12px] sm:text-[12.5px] font-bold uppercase tracking-wide mb-1.5 leading-snug ${
                isDark ? 'text-white' : 'text-zinc-900'
              }`}
            >
              {col.title}
            </h3>
            <p
              className={`text-[11px] sm:text-[11.5px] leading-relaxed ${
                isDark ? 'text-zinc-200' : 'text-zinc-700'
              }`}
            >
              {col.text}
            </p>
          </div>
        ))}
      </div>

      {/* ─── 6. ENCADRÉ FORMULE NOTARIALE (FORMAT CITATION ÉDITORIALE) ─── */}
      <div
        className={`relative z-10 border-l-2 pl-4 py-1 mb-4 ${
          isDark
            ? 'border-[#7DD3FC] text-zinc-200'
            : 'border-[#006390] text-zinc-800'
        }`}
      >
        {actualBannerTitle && (
          <div
            className={`text-[9.5px] font-bold tracking-wider uppercase mb-1 ${
              isDark ? 'text-[#7DD3FC]' : 'text-[#006390]'
            }`}
          >
            {actualBannerTitle}
          </div>
        )}
        <p className="text-[11.5px] sm:text-xs leading-relaxed italic">
          « {actualBannerText} »
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
