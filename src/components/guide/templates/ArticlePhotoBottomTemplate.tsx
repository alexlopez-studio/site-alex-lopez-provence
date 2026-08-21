'use client'

import React from 'react'

export interface ArticlePhotoBottomTemplateProps {
  pageNumber?: number
  title?: string
  subtitle?: string
  paragraphs?: string[]
  heroImage?: string
}

export function ArticlePhotoBottomTemplate({
  pageNumber = 16,
  title = 'CMA VS. APPRAISAL',
  subtitle = 'QUELLE DIFFÉRENCE ENTRE ANALYSE COMPARATIVE ET EXPERTISE EN PROVENCE ?',
  paragraphs = [
    'L’Analyse Comparative de Marché (CMA) et l’expertise vénale sont deux méthodes professionnelles qui répondent à des objectifs complémentaires.',
    'Le conseiller immobilier réalise une CMA pour déterminer le prix optimal auquel le bien trouvera preneur dans le contexte concurrentiel actuel.',
    'L’expert ou le service bancaire évalue quant à lui la valeur intrinsèque pour sécuriser l’hypothèque du prêt de l’acquéreur.',
    'Si le prix convenu dépasse largement la valeur d’expertise, la banque peut refuser le financement de votre acheteur.',
  ],
  heroImage = 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
}: ArticlePhotoBottomTemplateProps) {
  return (
    <div className="a4-sheet relative flex h-full w-full flex-col justify-between overflow-hidden bg-white p-0 text-[#0F172A] shadow-sm">
      {/* Zone Supérieure */}
      <div className="p-8 sm:p-12 pb-4">
        {/* Titre Centré */}
        <div className="text-center mb-6">
          <h2 className="font-sans text-3xl sm:text-4xl font-black text-[#0F172A] uppercase tracking-tight mb-1.5">
            {title}
          </h2>
          <p className="text-xs sm:text-sm font-bold tracking-[0.18em] uppercase text-[#0077B6]">
            {subtitle}
          </p>
        </div>

        <div className="space-y-3.5 text-xs sm:text-sm leading-relaxed text-[#334155]">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </div>

      {/* Photo Pleine Largeur en Bas */}
      <div className="relative h-60 sm:h-72 w-full overflow-hidden bg-[#F8FAFC] mt-auto">
        <img
          src={heroImage}
          alt={title}
          className="h-full w-full object-cover object-center"
        />

        <div className="absolute bottom-4 left-8 right-8 flex justify-between text-[10px] text-white uppercase tracking-widest z-10 bg-[#0F172A]/85 backdrop-blur-xs px-4 py-2 rounded-md">
          <span className="font-semibold">ALEXANDRE LOPEZ · CONSEILLER IAD PROVENCE</span>
          <span className="text-[#00B4EC]">P. {String(pageNumber).padStart(2, '0')}</span>
        </div>
      </div>
    </div>
  )
}
