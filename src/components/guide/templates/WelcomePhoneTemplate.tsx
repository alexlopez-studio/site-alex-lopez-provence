'use client'

import React from 'react'

export interface WelcomePhoneTemplateProps {
  pageNumber?: number
  title?: string
  subtitle?: string
  paragraphs?: string[]
  agentName?: string
  agentPhone?: string
  agentEmail?: string
  agentWebsite?: string
  agentPhoto?: string
}

export function WelcomePhoneTemplate({
  pageNumber = 3,
  title = 'welcome',
  subtitle = 'Je suis ravi de vous guider et de partager mes méthodes avec vous.',
  agentName = 'Alexandre Lopez',
  agentPhone = '06 13 18 01 68',
  agentEmail = 'alex@alexlopez-provence.fr',
  agentWebsite = 'alexlopez-provence.fr',
  agentPhoto = '/alexandre-lopez-no-background.png',
}: WelcomePhoneTemplateProps) {
  return (
    <div className="a4-sheet relative flex h-full w-full flex-col justify-between overflow-hidden bg-white p-8 sm:p-10 text-[#0F172A] shadow-sm">
      {/* ─── EN-TÊTE AVEC ACCENT BLEU MÉDITERRANÉE ─── */}
      <div className="shrink-0 mb-4 pt-1">
        <span className="inline-block bg-[#E0F0FA] text-[#0077B6] font-bold text-[11px] uppercase tracking-[0.2em] px-3.5 py-1 rounded-full mb-2">
          INTRODUCTION & MÉTHODE
        </span>
        <h1 className="font-sans text-5xl sm:text-6xl md:text-[62px] font-black tracking-[-0.035em] text-[#0F172A] lowercase leading-none">
          {title}
        </h1>
        <p className="font-sans text-sm sm:text-base md:text-[17px] font-bold text-[#0077B6] mt-1.5 tracking-tight leading-snug">
          {subtitle}
        </p>
      </div>

      {/* ─── CORPS PRINCIPAL : TEXTE ÉDITORIAL + SIGNATURE & MOCKUP IPHONE ─── */}
      <div className="grid grid-cols-12 gap-6 items-start flex-1 min-h-0">
        {/* COLONNE GAUCHE (55%) */}
        <div className="col-span-7 flex flex-col justify-between h-full pr-1 pb-1">
          <div className="space-y-2.5 text-[10.5px] sm:text-[11px] md:text-[11.5px] leading-[1.5] text-[#334155]">
            <p>
              Vendre son bien de particulier à particulier présente de vrais atouts. Avec une bonne méthode et de la rigueur, l’expérience peut s’avérer très gratifiante pour un propriétaire averti.
            </p>
            <p>
              Pour une personne expérimentée en valorisation et négociation, cela fait pleinement sens. Mais sans maîtrise du temps, de l’estimation ou du cadre légal, les conséquences financières et juridiques peuvent être lourdes.
            </p>
            <p>
              Les annonces en direct sont plus accessibles aujourd’hui grâce aux plateformes web et aux portails de diffusion ouverts à tous.
            </p>
            <p>
              Pourtant, vendre seul reste complexe : les études montrent que plus des deux tiers des vendeurs particuliers finissent par abandonner face à l’usure des démarches et des refus de prêt.
            </p>
            <p>
              <strong className="font-bold text-[#0F172A]">
                Beaucoup de professionnels gardent leurs méthodes secrètes, mais je ne suis pas un conseiller traditionnel.
              </strong>{' '}
              Dans ce guide, je vous livre toutes les étapes pour valoriser, négocier et vendre au juste prix en Provence. Et si vous souhaitez être épaulé, je reste à votre écoute.
            </p>
          </div>

          {/* Bloc Signature : Signature Script + Coordonnées de Marque */}
          <div className="pt-4 mt-auto border-t border-slate-100">
            <div className="flex items-center gap-3 mb-1">
              <span className="font-script text-3xl sm:text-[34px] text-[#0F172A] leading-none">
                Alexandre Lopez
              </span>
              <span className="bg-[#0077B6] text-white text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-xs">
                iad France
              </span>
            </div>
            <div className="font-sans italic text-xs sm:text-[13px] text-[#64748B] leading-snug space-y-0.5">
              <p className="font-semibold text-[#0077B6] not-italic">{agentPhone}</p>
              <p>{agentEmail}</p>
              <p>{agentWebsite}</p>
            </div>
          </div>
        </div>

        {/* COLONNE DROITE (45%) : Mockup iPhone aux Couleurs de la Marque */}
        <div className="col-span-5 flex justify-end items-center h-full pl-1">
          <div className="relative w-full max-w-[235px] sm:max-w-[250px] aspect-[9/18.5]">
            {/* Boutons Physiques Latéraux */}
            <div className="absolute -left-[4px] top-14 h-5 w-[4px] bg-[#1E293B] rounded-l-xs" />
            <div className="absolute -left-[4px] top-24 h-9 w-[4px] bg-[#1E293B] rounded-l-xs" />
            <div className="absolute -left-[4px] top-36 h-9 w-[4px] bg-[#1E293B] rounded-l-xs" />
            <div className="absolute -right-[4px] top-22 h-11 w-[4px] bg-[#1E293B] rounded-r-xs" />

            {/* Châssis iPhone */}
            <div className="relative h-full w-full rounded-[2.8rem] border-[8px] border-[#0F172A] bg-[#0F172A] shadow-[0_20px_45px_rgba(0,119,182,0.2)] p-1 overflow-hidden ring-1 ring-slate-200">
              {/* Dynamic Island */}
              <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-16 h-3.5 bg-black rounded-full z-30 flex items-center justify-end px-1.5">
                <div className="h-2 w-2 rounded-full bg-[#1E293B]" />
              </div>

              {/* Écran Intérieur avec Photo Alexandre Lopez sur Dégradé Ciel */}
              <div className="relative h-full w-full rounded-[2.2rem] overflow-hidden bg-gradient-to-b from-[#E0F0FA] via-white to-[#E0F0FA]/60 flex flex-col justify-end">
                <img
                  src={agentPhoto}
                  alt={agentName}
                  className="h-full w-full object-cover object-[50%_15%]"
                />
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#0F172A]/90 via-[#0F172A]/40 to-transparent p-4 text-white text-center">
                  <span className="font-script text-xl text-white block leading-none">Alexandre Lopez</span>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-[#00B4EC]">Conseiller iad Provence</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
