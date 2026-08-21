'use client'

import React from 'react'
import { Star } from 'lucide-react'

export interface TestimonialTemplateProps {
  pageNumber?: number
  heroImage?: string
  stars?: number
  quote?: string
  author?: string
}

export function TestimonialTemplate({
  pageNumber = 2,
  heroImage = 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1400&q=85',
  stars = 5,
  quote = '« Faire appel à un conseiller méthodique et disponible a transformé notre vente en un parcours serein, sécurisé et parfaitement maîtrisé au meilleur prix. »',
  author = 'FAMILLE DUPONT — VENTE À COTIGNAC (PROVENCE VERTE)',
}: TestimonialTemplateProps) {
  return (
    <div className="a4-sheet relative flex h-full w-full flex-col justify-end overflow-hidden bg-[#0F172A] text-white shadow-sm p-0">
      {/* Photo Plein Format avec Voile Feutré */}
      <img
        src={heroImage}
        alt="Témoignage Client"
        className="absolute inset-0 h-full w-full object-cover object-center"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/95 via-[#0F172A]/55 to-[#0F172A]/20" />

      {/* Bloc de Témoignage Central */}
      <div className="relative z-10 mx-auto w-full max-w-xl px-8 pb-16 sm:pb-20 text-center text-white">
        {/* 5 Étoiles Dorées / Cyan Lumineux */}
        <div className="flex items-center justify-center gap-2 mb-4">
          {[...Array(stars)].map((_, i) => (
            <Star key={i} className="h-6 w-6 sm:h-7 sm:w-7 fill-[#00B4EC] text-[#00B4EC]" />
          ))}
        </div>

        {/* Filet Supérieur */}
        <div className="h-[2px] w-full max-w-md mx-auto bg-white/80 mb-6" />

        {/* Citation Client */}
        <blockquote className="font-sans text-base sm:text-lg md:text-xl font-normal leading-relaxed text-white tracking-normal px-4 mb-6">
          {quote}
        </blockquote>

        {/* Filet Inférieur */}
        <div className="h-[2px] w-full max-w-md mx-auto bg-white/80 mb-6" />

        {/* Auteur du Témoignage */}
        <p className="font-sans text-xs sm:text-sm font-black italic uppercase tracking-[0.2em] text-[#00B4EC]">
          {author}
        </p>
      </div>

      {/* Pied de Page Discret */}
      <div className="absolute bottom-6 left-8 right-8 flex justify-between text-[10px] text-white/70 uppercase tracking-widest z-10">
        <span>ALEXANDRE LOPEZ · EXPÉRIENCE CLIENT</span>
        <span>P. {String(pageNumber).padStart(2, '0')}</span>
      </div>
    </div>
  )
}
