'use client'

import React from 'react'

export interface StageCoverTemplateProps {
  pageNumber?: number
  stageNumber?: string
  title?: string
  subtitle?: string
  paragraphs?: string[]
  heroImage?: string
}

export function StageCoverTemplate({
  stageNumber = 'STAGE ONE',
  title = 'Penser son Projet dans sa Globalité',
  subtitle,
  paragraphs = [
    'Vendre une maison en Provence n’est presque jamais un acte isolé. C’est le pivot central d’une nouvelle trajectoire de vie : acquisition d’un nouveau bien, installation en village, retraite ou rapprochement familial.',
    'Aborder la mise en vente sans avoir synchronisé les calendriers et le capital financier avec votre future acquisition est la première cause de stress, de double déménagement et de décisions prises dans l’urgence.',
    'Prenez le temps d’anticiper chaque paramètre pour aborder cette étape en position de force.',
  ],
  heroImage = 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1400&q=85',
}: StageCoverTemplateProps) {
  return (
    <div className="a4-sheet relative flex h-full w-full flex-col justify-start overflow-hidden bg-zinc-900 text-white shadow-2xl p-10 sm:p-14 md:p-16 select-none aspect-[1/1.414]">
      {/* ─── Fond Photo Plein Format (Full Bleed) ─── */}
      <img
        src={heroImage}
        alt={title}
        className="absolute inset-0 h-full w-full object-cover object-center pointer-events-none"
      />

      {/* ─── Voile Sombre pour Lisibilité Supérieure ─── */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/55 to-black/30 pointer-events-none" />

      {/* ─── CONTENU HAUT GAUCHE (STYLE EXACT LIVRET STAGE ONE) ─── */}
      <div className="relative z-10 max-w-lg pt-4">
        {/* Badge Noir */}
        <div className="inline-block bg-black text-white text-xs font-black tracking-widest uppercase px-3.5 py-1 mb-4">
          {stageNumber}
        </div>

        {/* Titre Blanc Imposant */}
        <h1 className="font-sans text-3xl sm:text-4xl md:text-[42px] font-black tracking-tight text-white leading-tight mb-4 drop-shadow-md">
          {title}
        </h1>

        {subtitle && (
          <p className="text-xs sm:text-sm font-semibold text-zinc-200 uppercase tracking-wider mb-6">
            {subtitle}
          </p>
        )}

        {/* Paragraphes de Cadrage Blancs */}
        <div className="space-y-4 text-xs sm:text-[13px] leading-relaxed text-zinc-100 max-w-md font-normal drop-shadow-xs">
          {paragraphs.map((p, idx) => (
            <p key={idx}>{p}</p>
          ))}
        </div>
      </div>
    </div>
  )
}
