'use client'

import React from 'react'

export interface NumberedQuestionsTemplateProps {
  pageNumber?: number
  badgeText?: string
  subtitle?: string
  moduleTitle?: string
  numberedItems?: { number: string; title?: string; text: string }[]
  footerConditions?: { yesText: string; noText: string }
  heroImage?: string
}

export function NumberedQuestionsTemplate({
  badgeText = 'ASK YOURSELF...',
  subtitle = 'AVANT D’ALLER PLUS LOIN ET DE VOUS LANCER DANS CETTE AVENTURE, PRENEZ QUELQUES MINUTES POUR RÉPONDRE EN TOUTE FRANCHISE À CES 3 QUESTIONS :',
  numberedItems = [
    {
      number: '01',
      text: 'Avez-vous la disponibilité mentale et le temps nécessaire pour gérer 40 à 60 heures de travail effectif (appels impromptus à toute heure, visites le week-end et formalités juridiques du plus important actif de votre vie) ?',
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
    yesText: 'Si vous avez répondu OUI à chacune de ces 3 questions : parfait ! Passez directement au Chapitre 01.',
    noText: 'Si vous avez répondu NON à l’une de ces questions : prenez le temps d’étudier attentivement les 4 données clés de la page suivante.',
  },
}: NumberedQuestionsTemplateProps) {
  return (
    <div className="a4-sheet relative flex h-full w-full flex-col justify-between overflow-hidden bg-white px-8 sm:px-12 md:px-16 pt-10 sm:pt-14 md:pt-16 pb-12 sm:pb-16 text-zinc-900 shadow-2xl select-none aspect-[1/1.414]">
      {/* ─── 1. BADGE NOIR "ASK YOURSELF..." & SOUS-TITRE (STYLE EXACT LIVRET) ─── */}
      <div className="shrink-0">
        <div className="inline-block bg-black text-white text-xs sm:text-sm md:text-[15px] font-black tracking-widest uppercase px-5 py-2 mb-4">
          {badgeText}
        </div>
        <p className="text-[11px] sm:text-[12px] md:text-[13.5px] font-bold tracking-wider uppercase text-zinc-800 max-w-2xl leading-relaxed">
          {subtitle}
        </p>
      </div>

      {/* ─── 2. LES 3 QUESTIONS AVEC NUMÉRO ET FILET HORIZONTAL (STYLE ORIGINAL) ─── */}
      <div className="flex-1 flex flex-col justify-around py-6 sm:py-8">
        {numberedItems.map((item, idx) => (
          <div key={item.number || idx} className="space-y-3">
            <div className="flex items-end gap-4">
              <span className="font-serif italic font-bold text-3xl sm:text-4xl md:text-[44px] text-black leading-none">
                {item.number}
              </span>
              <div className="h-px bg-zinc-300 flex-1 mb-2" />
            </div>
            <p className="text-sm sm:text-[15px] md:text-[16.5px] leading-relaxed md:leading-[1.65] text-zinc-800 font-normal">
              {item.text}
            </p>
          </div>
        ))}
      </div>

      {/* ─── 3. CONDITIONS DE SORTIE EN BAS DE PAGE (STYLE ORIGINAL) ─── */}
      <div className="shrink-0 pt-6 border-t border-zinc-200 space-y-2 text-xs sm:text-[13px] md:text-[14px] leading-relaxed text-zinc-650">
        <p className="font-medium">
          {footerConditions.yesText}
        </p>
        <p className="font-semibold text-zinc-900">
          {footerConditions.noText}
        </p>
      </div>
    </div>
  )
}
