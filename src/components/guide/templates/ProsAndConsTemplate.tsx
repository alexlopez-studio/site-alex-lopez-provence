'use client'

import React from 'react'

export interface ProsAndConsTemplateProps {
  pageNumber?: number
  title?: string
  subtitle?: string
  pros?: string[]
  cons?: string[]
}

export function ProsAndConsTemplate({
  pageNumber = 6,
  title = 'Pros & Cons',
  subtitle = 'DE LA VENTE IMMOBILIÈRE ENTRE PARTICULIERS EN PROVENCE',
  pros = [
    'Économie théorique des honoraires d’agence, préservant ainsi une marge financière sur le papier.',
    'Contrôle total sur l’ensemble du processus : calendrier des visites, choix des horaires et des supports.',
    'Vous êtes le meilleur connaisseur de votre lieu : vous connaissez chaque recoin, chaque saison et chaque détail de votre maison.',
    'Satisfaction personnelle d’avoir mené à bien une transaction patrimoniale majeure par vous-même.',
  ],
  cons = [
    'Exposition à des acheteurs non solvables qui n’ont pas fait valider leur capacité d’emprunt bancaire.',
    'Charge mentale élevée : gestion des appels à toute heure, annulations de dernière minute et week-ends bloqués.',
    'Difficulté à rester neutre lors de la négociation face à des critiques touchant votre lieu de vie.',
    'Risque de « brûler l’annonce » sur les portails si le prix initial est mal positionné dès les premiers jours.',
  ],
}: ProsAndConsTemplateProps) {
  return (
    <div className="a4-sheet relative flex h-full w-full flex-col justify-between overflow-hidden bg-white p-8 sm:p-10 text-[#0F172A] shadow-sm">
      {/* En-Tête Centré avec Accents de Marque */}
      <div className="shrink-0 text-center mb-8 pt-1">
        <h1 className="font-sans text-4xl sm:text-5xl font-black text-[#0F172A] tracking-tight">
          {title}
        </h1>
        <p className="text-xs sm:text-sm font-bold tracking-[0.2em] uppercase text-[#0077B6] mt-1.5">
          {subtitle}
        </p>
      </div>

      {/* Deux Colonnes avec Séparateur Vertical */}
      <div className="flex-1 min-h-0 grid grid-cols-2 gap-8 items-start my-auto">
        {/* Colonne Gauche : PROS */}
        <div className="border-r border-[#E2E8F0] pr-8 h-full">
          <div className="bg-[#E0F0FA] text-[#0077B6] py-2 px-4 rounded-t-lg border-b-2 border-[#0077B6] mb-6 text-center">
            <h3 className="font-sans text-base sm:text-lg font-black uppercase tracking-wider">
              PROS · LES AVANTAGES
            </h3>
          </div>
          <div className="space-y-4 text-xs sm:text-[13px] text-[#334155] leading-relaxed text-center">
            {pros.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </div>
        </div>

        {/* Colonne Droite : CONS */}
        <div className="pl-2 h-full">
          <div className="bg-slate-100 text-slate-700 py-2 px-4 rounded-t-lg border-b-2 border-slate-400 mb-6 text-center">
            <h3 className="font-sans text-base sm:text-lg font-black uppercase tracking-wider">
              CONS · LES CONTRAINTES
            </h3>
          </div>
          <div className="space-y-4 text-xs sm:text-[13px] text-[#334155] leading-relaxed text-center">
            {cons.map((c, idx) => (
              <p key={idx}>{c}</p>
            ))}
          </div>
        </div>
      </div>

      {/* Pied de Page */}
      <div className="shrink-0 flex items-center justify-between text-[10px] text-[#64748B] uppercase tracking-widest border-t border-[#E2E8F0] pt-3 mt-4">
        <span className="font-semibold text-[#0077B6]">ALEXANDRE LOPEZ · GUIDE PRATIQUE</span>
        <span>P. {String(pageNumber).padStart(2, '0')}</span>
      </div>
    </div>
  )
}
