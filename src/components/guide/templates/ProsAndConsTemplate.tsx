'use client'

import React from 'react'

export interface ProsAndConsTemplateProps {
  pageNumber?: number
  title?: string
  subtitle?: string
  moduleTitle?: string
  pros?: string[]
  cons?: string[]
  heroImage?: string
}

export function ProsAndConsTemplate({
  title = 'Pros & Cons',
  subtitle = 'OF SELLING ON YOUR OWN HOME',
  pros = [
    'Économie théorique des honoraires d’agence, préservant ainsi une marge financière sur le papier.',
    'Contrôle total sur l’ensemble du processus : calendrier des visites, choix des horaires et des supports.',
    'Vous êtes le meilleur connaisseur de votre lieu : vous connaissez chaque recoin, chaque saison et chaque détail.',
    'Satisfaction personnelle d’avoir mené à bien une transaction patrimoniale majeure par vous-même.',
  ],
  cons = [
    'Exposition à des acheteurs non solvables qui n’ont pas fait valider leur capacité d’emprunt bancaire.',
    'Charge mentale élevée : gestion des appels à toute heure, annulations de dernière minute et week-ends bloqués.',
    'Difficulté à rester neutre lors de la négociation face à des critiques touchant votre lieu de vie.',
    'Risque de « brûler l’annonce » sur les portails si le prix initial est mal positionné dès les premiers jours.',
  ],
}: ProsAndConsTemplateProps) {
  const displayTitle = title === 'Atouts & Exigences' ? 'Pros & Cons' : (title || 'Pros & Cons')
  const displaySubtitle =
    subtitle === 'DE LA VENTE IMMOBILIÈRE ENTRE PARTICULIERS'
      ? 'OF SELLING ON YOUR OWN HOME'
      : (subtitle || 'OF SELLING ON YOUR OWN HOME')

  return (
    <div className="a4-sheet relative flex h-full w-full flex-col justify-between overflow-hidden bg-white px-8 sm:px-12 md:px-16 pt-10 sm:pt-14 md:pt-16 pb-12 sm:pb-16 text-zinc-900 shadow-2xl select-none aspect-[1/1.414]">
      {/* ─── 1. TITRE "Pros & Cons" & SOUS-TITRE (GRAND FORMAT IMPACTANT DU MODÈLE) ─── */}
      <div className="text-center shrink-0 mb-8 sm:mb-10 md:mb-14">
        <h1 className="font-sans text-5xl sm:text-6xl md:text-[68px] lg:text-[76px] font-black text-black tracking-tight leading-none mb-3 sm:mb-4">
          {displayTitle}
        </h1>
        <p className="text-xs sm:text-sm md:text-[15px] font-extrabold uppercase tracking-[0.25em] text-zinc-700">
          {displaySubtitle}
        </p>
      </div>

      {/* ─── 2. DEUX COLONNES OCCUPANT PARFAITEMENT TOUTE LA HAUTEUR ET LARGEUR ─── */}
      <div className="relative flex-1 grid grid-cols-2 gap-x-8 sm:gap-x-12 md:gap-x-16 items-stretch pb-2">
        {/* Colonne PROS */}
        <div className="flex flex-col h-full items-center text-center px-2 sm:px-4 md:px-6">
          <h2 className="text-2xl sm:text-3xl md:text-[32px] font-black uppercase tracking-[0.25em] text-black mb-6 sm:mb-8 md:mb-10 shrink-0">
            PROS
          </h2>
          <div className="flex-1 flex flex-col justify-around py-2 sm:py-4 text-center text-[15px] sm:text-[16.5px] md:text-[18px] lg:text-[19px] leading-relaxed md:leading-[1.68] text-zinc-850 font-normal">
            {pros.map((p, idx) => (
              <p key={idx} className="w-full max-w-sm sm:max-w-md mx-auto">
                {p}
              </p>
            ))}
          </div>
        </div>

        {/* Ligne Séparatrice Verticale Centrale */}
        <div className="absolute top-1 bottom-4 left-1/2 -translate-x-1/2 w-px bg-zinc-300" />

        {/* Colonne CONS */}
        <div className="flex flex-col h-full items-center text-center px-2 sm:px-4 md:px-6">
          <h2 className="text-2xl sm:text-3xl md:text-[32px] font-black uppercase tracking-[0.25em] text-black mb-6 sm:mb-8 md:mb-10 shrink-0">
            CONS
          </h2>
          <div className="flex-1 flex flex-col justify-around py-2 sm:py-4 text-center text-[15px] sm:text-[16.5px] md:text-[18px] lg:text-[19px] leading-relaxed md:leading-[1.68] text-zinc-850 font-normal">
            {cons.map((c, idx) => (
              <p key={idx} className="w-full max-w-sm sm:max-w-md mx-auto">
                {c}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
