'use client'

import React from 'react'

export interface ChecklistPhotoSideTemplateProps {
  pageNumber?: number
  title?: string
  subtitle?: string
  itemsWithBadges?: { badge: string; text: string }[]
  heroImage?: string
}

export function ChecklistPhotoSideTemplate({
  pageNumber = 11,
  title = 'Détails & Extérieurs',
  subtitle = 'LES POINTS QUI CRÉENT LE SENTIMENT DE QUALITÉ EN PROVENCE',
  itemsWithBadges = [
    {
      badge: 'FIX FENCING',
      text: 'Réparez les clôtures affaissées, portillons déboîtés ou grillages détendus pour délimiter nettement votre propriété.',
    },
    {
      badge: 'ROOF REPAIRS',
      text: 'Vérifiez la toiture : remplacez les tuiles ébréchées et nettoyez les gouttières encombrées par les feuilles mortes.',
    },
    {
      badge: 'FIX CRACKS',
      text: 'Rebouchez les micro-fissures d’enduit sur les murets extérieurs et terrasses pour rassurer sur l’étanchéité.',
    },
    {
      badge: 'TOUCH UP ANY SCUFF MARKS',
      text: 'Passez un coup de peinture propre sur les chambranles de portes et angles de murs abîmés par les passages quotidiens.',
    },
    {
      badge: 'CONDUCT A SMELL TEST',
      text: 'Faites tester l’odeur de votre maison par un ami objectif 30 minutes après avoir aéré les pièces.',
    },
  ],
  heroImage = 'https://images.unsplash.com/photo-1545083036-b175dd155a1d?auto=format&fit=crop&w=800&q=85',
}: ChecklistPhotoSideTemplateProps) {
  return (
    <div className="a4-sheet relative flex h-full w-full overflow-hidden bg-white text-[#0F172A] shadow-sm p-0">
      {/* Colonne Gauche : Badges Bleu Méditerranée & Contenu */}
      <div className="w-[58%] h-full p-8 sm:p-12 flex flex-col justify-between">
        <div className="my-auto">
          <h2 className="font-sans text-3xl sm:text-4xl font-black text-[#0F172A] tracking-tight mb-1.5">
            {title}
          </h2>
          <p className="text-xs font-bold tracking-[0.18em] uppercase text-[#0077B6] mb-6">
            {subtitle}
          </p>

          <div className="space-y-3.5">
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

        <div className="text-[10px] text-[#64748B] uppercase tracking-widest border-t border-[#E2E8F0] pt-4">
          <span className="font-semibold text-[#0077B6]">ALEXANDRE LOPEZ · P. {String(pageNumber).padStart(2, '0')}</span>
        </div>
      </div>

      {/* Colonne Droite : Photo Verticale Plein Format */}
      <div className="w-[42%] h-full relative overflow-hidden bg-[#F8FAFC]">
        <img
          src={heroImage}
          alt={title}
          className="h-full w-full object-cover object-center"
        />
      </div>
    </div>
  )
}
