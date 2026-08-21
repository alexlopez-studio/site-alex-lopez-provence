'use client'

import React from 'react'

export interface ChecklistBadgesTemplateProps {
  pageNumber?: number
  title?: string
  subtitle?: string
  itemsWithBadges?: { badge: string; text: string }[]
}

export function ChecklistBadgesTemplate({
  pageNumber = 9,
  title = 'Preparation of your home',
  subtitle = 'LES TRAVAUX & RÉPARATIONS STRATÉGIQUES QUI CRÉENT LA VALEUR',
  itemsWithBadges = [
    {
      badge: 'MAKE REPAIRS',
      text: 'Réparez les poignées de porte branlantes, les carreaux ébréchés, les prises dévissées et les fuites de robinet. Les acheteurs déduisent souvent le triple du coût réel des petits travaux lors de leur offre.',
    },
    {
      badge: 'FINISH PROJECTS',
      text: 'Terminez les plinthes non posées, les peintures inachevées ou les luminaires en attente avec fils apparents. Une maison finie inspire confiance et prouve un entretien régulier.',
    },
    {
      badge: 'PAINT THE WALLS',
      text: 'Privilégiez des teintes neutres (blanc chaud, lin, grège). Les couleurs vives ou trop personnalisées freinent la capacité de projection des acquéreurs potentiels.',
    },
    {
      badge: 'REPLACE LIGHTBULBS',
      text: 'Installez des ampoules LED à lumière chaude (2700K) de puissance identique dans chaque pièce. La luminosité est le premier critère émotionnel de visite.',
    },
    {
      badge: 'FLOORING UPGRADE',
      text: 'Nettoyez en profondeur les joints de carrelage et faites disparaître les rayures sur les parquets. Le sol est le premier contact visuel lorsque l’on franchit le seuil.',
    },
  ],
}: ChecklistBadgesTemplateProps) {
  return (
    <div className="a4-sheet relative flex h-full w-full flex-col justify-between overflow-hidden bg-white p-8 sm:p-12 text-[#0F172A] shadow-sm">
      <div className="my-auto">
        <h1 className="font-sans text-3xl sm:text-4xl md:text-[40px] font-black text-[#0F172A] tracking-tight mb-2">
          {title}
        </h1>
        <p className="text-xs sm:text-[13px] font-bold tracking-[0.18em] uppercase text-[#0077B6] mb-8">
          {subtitle}
        </p>

        {/* Liste des Badges Bleu Méditerranée */}
        <div className="space-y-4">
          {itemsWithBadges.map((item, idx) => (
            <div key={idx} className="space-y-1.5 border-b border-slate-100 pb-3 last:border-0">
              <div className="inline-block bg-[#0077B6] text-white px-3.5 py-1 text-[11px] sm:text-xs font-bold uppercase tracking-wider rounded-md shadow-xs">
                {item.badge}
              </div>
              <p className="text-xs sm:text-sm leading-relaxed text-[#334155]">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Pied de Page */}
      <div className="flex items-center justify-between text-[10px] text-[#64748B] uppercase tracking-widest border-t border-[#E2E8F0] pt-4 mt-6">
        <span className="font-semibold text-[#0077B6]">ALEXANDRE LOPEZ · CHECKLIST VENTE</span>
        <span>P. {String(pageNumber).padStart(2, '0')}</span>
      </div>
    </div>
  )
}
