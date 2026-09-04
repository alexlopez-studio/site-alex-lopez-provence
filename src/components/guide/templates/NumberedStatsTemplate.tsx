'use client'

import React from 'react'

export interface NumberedStatsTemplateProps {
  pageNumber?: number
  badgeText?: string
  subtitle?: string
  moduleTitle?: string
  numberedItems?: { number: string; title?: string; text: string }[]
  footerNote?: string
  heroImage?: string
}

export function NumberedStatsTemplate({
  badgeText = 'CONSIDER THIS',
  subtitle = 'SI VOUS AVEZ RÉPONDU NON À L’UNE DE CES QUESTIONS, CONSIDÉREZ ATTENTIVEMENT CES 4 STATISTIQUES DU MARCHÉ :',
  numberedItems = [
    {
      number: '01',
      title: 'Un écart moyen de 6% à 9%',
      text: 'Les ventes en direct subissent une négociation plus agressive faute de concurrence organisée et d’arguments comparatifs factuels face aux acheteurs.',
    },
    {
      number: '02',
      title: 'Un délai moyen rallongé de 19 jours',
      text: 'Sans diffusion multi-portails professionnelle ni vivier d’acheteurs qualifiés, la mise en relation et la finalisation prennent mécaniquement plus de temps.',
    },
    {
      number: '03',
      title: 'Le dossier juridique : 1ère cause de blocage',
      text: 'DPE, conformité d’urbanisme et clauses suspensives représentent le principal motif d’échec ou de découragement au compromis notarié.',
    },
    {
      number: '04',
      title: '70% des vendeurs finissent par déléguer',
      text: 'Face à l’usure des visites non qualifiées et aux rétractations, plus des deux tiers choisissent finalement de confier leur bien à un professionnel.',
    },
  ],
  footerNote = 'Vendre seul peut être une expérience gratifiante si vous appliquez une méthode stricte. L’objectif de ce guide est de vous donner toutes les cartes pour réussir en toute sérénité.',
}: NumberedStatsTemplateProps) {
  return (
    <div className="a4-sheet relative flex h-full w-full flex-col justify-between overflow-hidden bg-white px-8 sm:px-12 md:px-16 pt-10 sm:pt-14 md:pt-16 pb-12 sm:pb-16 text-zinc-900 shadow-2xl select-none aspect-[1/1.414]">
      {/* ─── 1. BADGE NOIR "CONSIDER THIS" / "REPÈRES DE MARCHÉ" & SOUS-TITRE ─── */}
      <div className="shrink-0">
        <div className="inline-block bg-black text-white text-xs sm:text-sm md:text-[15px] font-black tracking-widest uppercase px-5 py-2 mb-4">
          {badgeText}
        </div>
        <p className="text-[11px] sm:text-[12.5px] md:text-[14px] font-extrabold tracking-wider uppercase text-zinc-800 max-w-2xl leading-relaxed">
          {subtitle}
        </p>
      </div>

      {/* ─── 2. LES 4 STATISTIQUES EN LISTE ALIGNÉE (OCCUPANT TOUTE LA HAUTEUR) ─── */}
      <div className="flex-1 flex flex-col justify-around py-6 sm:py-8">
        {numberedItems.map((item, idx) => (
          <div key={item.number || idx} className="flex items-start gap-6 sm:gap-8">
            <span className="font-serif italic font-bold text-4xl sm:text-5xl md:text-[54px] text-black shrink-0 w-14 sm:w-16 leading-none pt-0.5">
              {item.number}
            </span>
            <div className="space-y-1.5 flex-1">
              {item.title && (
                <h3 className="text-base sm:text-lg md:text-[19px] font-black uppercase tracking-wide text-black">
                  {item.title}
                </h3>
              )}
              <p className="text-[14.5px] sm:text-[16px] md:text-[17.5px] lg:text-[18px] leading-relaxed md:leading-[1.65] text-zinc-800 font-normal">
                {item.text}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ─── 3. ENCART NOTE DE CLÔTURE EN BAS DE PAGE (STYLE ORIGINAL DU LIVRET) ─── */}
      {footerNote && (
        <div className="shrink-0 pt-6 sm:pt-8 border-t border-zinc-300 space-y-2.5">
          {footerNote.split('\n\n').map((paragraph, idx) => (
            <p
              key={idx}
              className="text-[12.5px] sm:text-[13.5px] md:text-[14.5px] leading-relaxed text-zinc-700 font-normal"
            >
              {paragraph}
            </p>
          ))}
        </div>
      )}
    </div>
  )
}
