'use client'

import React from 'react'

export interface NumberedQuestionsTemplateProps {
  pageNumber?: number
  badgeText?: string
  subtitle?: string
  numberedItems?: { number: string; title?: string; text: string }[]
  footerConditions?: { yesText: string; noText: string }
}

export function NumberedQuestionsTemplate({
  pageNumber = 4,
  badgeText = 'ASK YOURSELF...',
  subtitle = 'AVANT D’ALLER PLUS LOIN DANS CETTE AVENTURE, PRENEZ QUELQUES MINUTES POUR RÉPONDRE EN TOUTE FRANCHISE À CES 3 QUESTIONS CLÉS.',
  numberedItems = [
    {
      number: '01',
      text: 'Avez-vous la disponibilité mentale et le temps nécessaire pour gérer 40 à 60 heures de travail effectif (appels impromptus, visites le week-end et formalités juridiques du plus important actif de votre vie) ?',
    },
    {
      number: '02',
      text: 'Maîtrisez-vous les outils digitaux et le marketing visuel pour valoriser votre logement comme un magazine d’architecture et capter les 95% d’acheteurs qui effectuent leur premier tri sur écran ?',
    },
    {
      number: '03',
      text: 'Êtes-vous prêt à négocier face à des acheteurs exigeants qui pointent chaque imperfection, à filtrer rigoureusement leur solvabilité bancaire et à défendre votre prix sans laisser parler l’affect ?',
    },
  ],
  footerConditions = {
    yesText: 'Si vous avez répondu OUI à chacune de ces 3 questions : parfait ! Passez directement à l’ÉTAPE 1.',
    noText: 'Si vous avez répondu NON à l’une de ces questions : prenez le temps d’étudier attentivement les 4 données clés de la page suivante.',
  },
}: NumberedQuestionsTemplateProps) {
  return (
    <div className="a4-sheet relative flex h-full w-full flex-col justify-between overflow-hidden bg-white px-12 py-12 sm:px-16 sm:py-14 text-[#0F172A] shadow-sm">
      {/* ─── 1. EN-TÊTE AVEC BADGE BLEU MÉDITERRANÉE ─── */}
      <div className="shrink-0">
        <div className="inline-block bg-[#0077B6] text-white px-7 py-3 sm:px-8 sm:py-3.5 text-2xl sm:text-3xl md:text-[34px] font-black uppercase tracking-wider leading-none rounded-lg shadow-md mb-4">
          {badgeText}
        </div>
        <p className="font-sans text-xs sm:text-[13px] font-bold tracking-[0.16em] uppercase text-[#64748B] leading-relaxed max-w-xl">
          {subtitle}
        </p>
      </div>

      {/* ─── 2. SECTION CENTRALE : 3 QUESTIONS AVEC CHIFFRES BLEU MÉDITERRANÉE & LIGNES NETTES ─── */}
      <div className="flex-1 flex flex-col justify-evenly py-6 sm:py-8 w-full max-w-2xl">
        {/* Ligne Supérieure */}
        <div className="w-full h-[1.5px] bg-[#E2E8F0]" />

        {numberedItems.map((item, idx) => (
          <React.Fragment key={item.number || idx}>
            <div className="flex items-center gap-8 sm:gap-10 py-5 sm:py-7">
              {/* Chiffre 01, 02, 03 en Bleu Méditerranée */}
              <span className="font-sans italic font-black text-4xl sm:text-5xl md:text-[54px] text-[#0077B6] shrink-0 w-16 sm:w-20 text-center leading-none">
                {item.number}
              </span>

              {/* Texte de la question */}
              <div className="flex-1">
                <p className="font-sans text-xs sm:text-[13px] md:text-sm leading-relaxed text-[#1E293B] font-normal">
                  {item.text || item.title}
                </p>
              </div>
            </div>

            {/* Ligne Séparatrice */}
            <div className="w-full h-[1.5px] bg-[#E2E8F0]" />
          </React.Fragment>
        ))}
      </div>

      {/* ─── 3. TEXTE CONDITIONNEL DU BAS ─── */}
      <div className="shrink-0 space-y-2.5 pt-2 text-xs sm:text-[13px] text-[#334155] leading-relaxed">
        <p className="font-semibold text-[#0077B6]">
          {footerConditions.yesText}
        </p>
        <p className="font-normal text-[#64748B]">
          {footerConditions.noText}
        </p>
      </div>
    </div>
  )
}
