'use client'

import React from 'react'

export interface SplitPhotoTextTemplateProps {
  pageNumber?: number
  title?: string
  subtitle?: string
  paragraphs?: string[]
  heroImage?: string
}

export function SplitPhotoTextTemplate({
  pageNumber = 8,
  title = 'HOME PREPARATION',
  subtitle = 'LA MÉTHODE EN 20 POINTS DE VÉRIFICATION EN PROVENCE',
  paragraphs = [
    'Nous avons développé un protocole très précis pour valoriser votre logement rapidement et au meilleur prix.',
    '20 points de contrôle peuvent sembler exigeants, mais ils constituent le socle qui vous évitera toute mauvaise surprise ou négociation agressive de l’acheteur.',
    'Ne laissez rien au hasard : suivez cette méthodologie étape par étape.',
  ],
  heroImage = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1000&q=85',
}: SplitPhotoTextTemplateProps) {
  return (
    <div className="a4-sheet relative flex h-full w-full overflow-hidden bg-white text-[#0F172A] shadow-sm p-0">
      {/* Moitié Gauche : Grande Photo Verticale Plein Format */}
      <div className="w-[44%] h-full relative overflow-hidden bg-[#F8FAFC]">
        <img
          src={heroImage}
          alt={title}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0F172A]/10" />
      </div>

      {/* Moitié Droite : Contenu Éditorial & Marque */}
      <div className="w-[56%] h-full p-8 sm:p-12 flex flex-col justify-between">
        <div className="my-auto">
          <span className="inline-block bg-[#E0F0FA] text-[#0077B6] font-bold text-[10px] uppercase tracking-[0.2em] px-3 py-1 rounded-full mb-3">
            PROTOCOLE VALORISATION
          </span>
          <h1 className="font-sans text-3xl sm:text-4xl font-black text-[#0F172A] uppercase tracking-tight leading-tight mb-2">
            {title}
          </h1>
          <p className="text-xs font-bold tracking-[0.18em] uppercase text-[#0077B6] mb-8">
            {subtitle}
          </p>

          <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-[#334155]">
            {paragraphs.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between text-[10px] text-[#64748B] uppercase tracking-widest border-t border-[#E2E8F0] pt-4">
          <span className="font-semibold text-[#0077B6]">ALEXANDRE LOPEZ · IAD PROVENCE</span>
          <span>P. {String(pageNumber).padStart(2, '0')}</span>
        </div>
      </div>
    </div>
  )
}
