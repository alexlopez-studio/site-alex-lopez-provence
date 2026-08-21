'use client'

import React from 'react'

export interface ArticleTwoColumnsPhotoTopTemplateProps {
  pageNumber?: number
  title?: string
  subtitle?: string
  heroImage?: string
  twoColumnsText?: { col1: string[]; col2: string[] }
}

export function ArticleTwoColumnsPhotoTopTemplate({
  pageNumber = 14,
  title = 'THE PROCESS OF PRICING',
  subtitle = 'COMMENT LE MARCHÉ RÉAGIT À VOTRE VALEUR AFFICHÉE EN PROVENCE',
  heroImage = 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80',
  twoColumnsText = {
    col1: [
      'Le prix de votre maison est l’élément le plus décisif de l’ensemble du processus. Une maison affichée au-dessus du marché stagnera pendant de longs mois.',
      'Durant ce temps, vous continuez à supporter les charges, taxes et frais d’entretien. Plus grave : les acheteurs supposeront que le bien a un problème caché car il ne s’est pas vendu rapidement.',
    ],
    col2: [
      'À l’inverse, certains vendeurs particuliers sous-estiment leur bien par méconnaissance des ventes récentes de leur secteur.',
      'Les acquéreurs aguerris surveillent les alertes chaque matin : en fixant le juste prix, vous suscitez de l’émulation et obtenez des offres au prix sans négociation subie.',
    ],
  },
}: ArticleTwoColumnsPhotoTopTemplateProps) {
  return (
    <div className="a4-sheet relative flex h-full w-full flex-col justify-between overflow-hidden bg-white p-0 text-[#0F172A] shadow-sm">
      {/* Photo Supérieure Pleine Largeur */}
      <div className="relative h-60 sm:h-72 w-full overflow-hidden bg-[#F8FAFC]">
        <img
          src={heroImage}
          alt={title}
          className="h-full w-full object-cover object-center"
        />
      </div>

      {/* Zone de Contenu Éditorial */}
      <div className="flex-1 flex flex-col justify-between p-8 sm:p-12 pt-6">
        <div>
          {/* Titre Centré */}
          <div className="text-center mb-8">
            <h2 className="font-sans text-3xl sm:text-4xl font-black text-[#0F172A] uppercase tracking-tight mb-1.5">
              {title}
            </h2>
            <p className="text-xs font-bold tracking-[0.18em] uppercase text-[#0077B6]">
              {subtitle}
            </p>
          </div>

          {/* 2 Colonnes de Texte */}
          <div className="grid grid-cols-2 gap-8 text-xs sm:text-sm leading-relaxed text-[#334155]">
            <div className="space-y-3.5">
              {twoColumnsText.col1.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <div className="space-y-3.5">
              {twoColumnsText.col2.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-[10px] text-[#64748B] uppercase tracking-widest border-t border-[#E2E8F0] pt-4 mt-6">
          <span className="font-semibold text-[#0077B6]">ALEXANDRE LOPEZ · ESTIMATION & PRIX</span>
          <span>P. {String(pageNumber).padStart(2, '0')}</span>
        </div>
      </div>
    </div>
  )
}
