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
  heroImage = 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1400&q=85',
  stars = 5,
  quote = '« Vendre notre maison n’était pas une simple transaction, c’était quinze ans de souvenirs de famille. Ce qui a tout changé, c’est d’avoir suivi une méthode rigoureuse et factuelle : cela nous a permis de préserver notre valeur, d’éviter les pièges et de signer au juste prix en totale sérénité. »',
  author = 'M. & MME CHAUVIN · PROPRIÉTAIRES EN PROVENCE',
}: TestimonialTemplateProps) {
  return (
    <div className="a4-sheet relative flex h-full w-full flex-col justify-end overflow-hidden bg-[#001D2D] text-white shadow-2xl p-10 sm:p-14 md:p-16 select-none aspect-[1/1.414]">
      {/* ─── Fond Photo Plein Format (Full Bleed) ─── */}
      <img
        src={heroImage}
        alt="Témoignage Client"
        className="absolute inset-0 h-full w-full object-cover object-center pointer-events-none"
      />

      {/* ─── Voile Doux Dégradé pour Lisibilité Inférieure ─── */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent pointer-events-none" />

      {/* ─── CITATION CENTRALE BASSE (STYLE ORIGINAL BOOKLET) ─── */}
      <div className="relative z-10 max-w-xl mx-auto text-center pb-8 sm:pb-12">
        {/* 5 Étoiles Dorées */}
        <div className="flex items-center justify-center gap-1.5 mb-4">
          {[...Array(stars)].map((_, i) => (
            <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
          ))}
        </div>

        {/* Texte de la citation */}
        <blockquote className="font-serif text-base sm:text-lg md:text-[21px] font-normal leading-relaxed text-zinc-100 mb-5 italic drop-shadow-sm">
          {quote}
        </blockquote>

        <div className="w-12 h-px bg-white/40 mx-auto mb-3" />

        {/* Auteur en majuscules discrètes */}
        <p className="text-[11px] uppercase font-bold tracking-[0.2em] text-zinc-300">
          {author}
        </p>
      </div>
    </div>
  )
}
