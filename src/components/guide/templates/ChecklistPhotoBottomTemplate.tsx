'use client'

import React from 'react'

export interface ChecklistPhotoBottomTemplateProps {
  pageNumber?: number
  title?: string
  subtitle?: string
  itemsWithBadges?: { badge: string; text: string }[]
  heroImage?: string
}

export function ChecklistPhotoBottomTemplate({
  pageNumber = 10,
  title = 'Preparing your home',
  subtitle = 'DÉPERSONNALISATION & PURIFICATION DES ESPACES',
  itemsWithBadges = [
    {
      badge: 'REMOVE PERSONAL ITEMS',
      text: 'Retirez les photos de famille, diplômes et magnets sur le réfrigérateur. L’acheteur doit pouvoir s’imaginer chez lui, et non avoir l’impression de s’introduire dans l’intimité d’un tiers.',
    },
    {
      badge: 'FIX PET ISSUES',
      text: 'Faites disparaître les gamelles, litières et coussins d’animaux avant les visites. Aérez abondamment pour éliminer toute odeur perceptible.',
    },
    {
      badge: 'WASH THE EXTERIOR',
      text: 'Nettoyez la terrasse au jet haute pression, lavez les baies vitrées pour maximiser l’entrée de lumière et dégagez les volets.',
    },
    {
      badge: 'GET A HOME INSPECTION',
      text: 'Anticipez la réalisation du Dossier de Diagnostic Technique (DPE, électricité, amiante) pour ne pas être pris de court lors d’une offre.',
    },
  ],
  heroImage = 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
}: ChecklistPhotoBottomTemplateProps) {
  return (
    <div className="a4-sheet relative flex h-full w-full flex-col justify-between overflow-hidden bg-white p-0 text-[#0F172A] shadow-sm">
      {/* Zone Supérieure avec Badges Bleu Méditerranée */}
      <div className="p-8 sm:p-12 pb-2">
        <h2 className="font-sans text-3xl sm:text-4xl font-black text-[#0F172A] tracking-tight mb-1.5">
          {title}
        </h2>
        <p className="text-xs font-bold tracking-[0.18em] uppercase text-[#0077B6] mb-5">
          {subtitle}
        </p>

        <div className="space-y-3 mb-2">
          {itemsWithBadges.map((item, idx) => (
            <div key={idx} className="space-y-1">
              <div className="inline-block bg-[#0077B6] text-white px-3 py-0.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider rounded-md">
                {item.badge}
              </div>
              <p className="text-xs sm:text-[13px] leading-relaxed text-[#334155]">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Photo Pleine Largeur en Bas */}
      <div className="relative h-56 sm:h-64 w-full overflow-hidden bg-[#F8FAFC] mt-auto">
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
