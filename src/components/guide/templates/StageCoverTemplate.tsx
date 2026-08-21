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
  pageNumber = 7,
  stageNumber = 'STAGE ONE',
  title = 'Preparation of Your Home',
  paragraphs = [
    'La clé d’une vente réussie réside dans la préparation en amont. Si votre bien n’est pas parfaitement prêt, il risque de stagner sur le marché et de subir une décote évitable.',
    'Dans cette première section, nous allons aborder chaque point de contrôle pour transformer votre logement en un coup de cœur évident dès la première visite.',
  ],
  heroImage = 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1400&q=85',
}: StageCoverTemplateProps) {
  return (
    <div className="a4-sheet relative flex h-full w-full flex-col justify-start overflow-hidden bg-[#0F172A] text-white shadow-sm p-0">
      {/* Photo Plein Format avec Voile Teinté Anthracite / Bleu Nuit */}
      <img
        src={heroImage}
        alt={title}
        className="absolute inset-0 h-full w-full object-cover object-center brightness-[75%] contrast-[105%]"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0F172A]/85 via-[#0F172A]/45 to-[#0F172A]/90" />

      {/* Contenu de l'Étape avec Badge Bleu Méditerranée */}
      <div className="relative z-10 max-w-xl p-10 sm:p-14 pt-14 sm:pt-16">
        <div className="inline-block bg-[#0077B6] text-white px-5 py-2 text-xs sm:text-sm font-black uppercase tracking-wider mb-6 rounded-md shadow-lg">
          {stageNumber}
        </div>
        <h1 className="font-sans text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-tight mb-6">
          {title}
        </h1>
        <div className="space-y-4 text-sm sm:text-base leading-relaxed text-white/95 font-normal">
          {paragraphs.map((p, idx) => (
            <p key={idx}>{p}</p>
          ))}
        </div>
      </div>

      {/* Pied de Page Officiel */}
      <div className="absolute bottom-8 left-10 right-10 flex justify-between text-[10px] text-white/70 uppercase tracking-widest z-10 border-t border-white/15 pt-3">
        <span className="font-semibold text-white/90">ALEXANDRE LOPEZ · CONSEILLER IAD PROVENCE VERTE & VERDON</span>
        <span className="text-[#00B4EC] font-bold">P. {String(pageNumber).padStart(2, '0')}</span>
      </div>
    </div>
  )
}
