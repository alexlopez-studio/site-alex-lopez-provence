'use client'

import React from 'react'

export interface BeforeAfterPhotographyTemplateProps {
  pageNumber?: number
  title?: string
  subtitle?: string
  paragraphs?: string[]
  beforeImage?: { url: string; label: string }
  afterImage?: { url: string; label: string }
}

export function BeforeAfterPhotographyTemplate({
  pageNumber = 19,
  title = 'THE VALUE OF PHOTOGRAPHY',
  subtitle = 'POURQUOI LES PHOTOS PROFESSIONNELLES DÉTERMINENT 90% DES VISITES',
  paragraphs = [
    'Une photo prise au smartphone avec des contre-jours ou un objectif déformant peut faire perdre jusqu’à 30% d’acquéreurs qualifiés dès la première semaine de diffusion.',
    'À l’inverse, un reportage photographique avec grand-angle calibré, traitement HDR de la lumière et mise en valeur des volumes provençaux déclenche l’effet coup de cœur.',
  ],
  beforeImage = {
    url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
    label: 'PHOTO SMARTPHONE CLASSIQUE',
  },
  afterImage = {
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    label: 'REPORTAGE PRO HDR & GRAND ANGLE',
  },
}: BeforeAfterPhotographyTemplateProps) {
  return (
    <div className="a4-sheet relative flex h-full w-full flex-col justify-between overflow-hidden bg-white p-8 sm:p-12 text-[#0F172A] shadow-sm">
      {/* En-Tête Centré */}
      <div className="text-center mb-6">
        <h2 className="font-sans text-3xl sm:text-4xl md:text-[40px] font-black text-[#0F172A] uppercase tracking-tight mb-2">
          {title}
        </h2>
        <p className="text-xs sm:text-[13px] font-bold tracking-[0.18em] uppercase text-[#0077B6] mb-4">
          {subtitle}
        </p>

        <div className="max-w-xl mx-auto space-y-2 text-xs sm:text-[13px] leading-relaxed text-[#334155]">
          {paragraphs.map((p, idx) => (
            <p key={idx}>{p}</p>
          ))}
        </div>
      </div>

      {/* Double Photo Comparatif Avant/Après */}
      <div className="relative my-auto grid grid-cols-2 gap-4 items-center">
        {/* Photo Avant */}
        <div className="relative h-64 sm:h-72 rounded-xl overflow-hidden bg-[#F8FAFC] shadow-md">
          <img
            src={beforeImage.url}
            alt={beforeImage.label}
            className="h-full w-full object-cover grayscale-[30%]"
          />
          <div className="absolute bottom-3 left-3 right-3 bg-[#0F172A]/85 backdrop-blur-xs text-white py-1.5 px-3 rounded-md text-center text-[10px] font-bold uppercase tracking-wider">
            {beforeImage.label}
          </div>
        </div>

        {/* Photo Après */}
        <div className="relative h-64 sm:h-72 rounded-xl overflow-hidden bg-[#F8FAFC] shadow-md border-2 border-[#0077B6]">
          <img
            src={afterImage.url}
            alt={afterImage.label}
            className="h-full w-full object-cover"
          />
          <div className="absolute bottom-3 left-3 right-3 bg-[#0077B6]/95 backdrop-blur-xs text-white py-1.5 px-3 rounded-md text-center text-[10px] font-bold uppercase tracking-wider">
            {afterImage.label}
          </div>
        </div>
      </div>

      {/* Pied de Page */}
      <div className="flex items-center justify-between text-[10px] text-[#64748B] uppercase tracking-widest border-t border-[#E2E8F0] pt-4 mt-6">
        <span className="font-semibold text-[#0077B6]">ALEXANDRE LOPEZ · MARKETING VISUEL</span>
        <span>P. {String(pageNumber).padStart(2, '0')}</span>
      </div>
    </div>
  )
}
