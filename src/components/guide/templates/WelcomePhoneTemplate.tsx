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
  title = 'welcome',
  subtitle = 'Je suis ravi de vous guider tout au long de cette aventure !',
  paragraphs = [
    'Votre maison n’est pas un bien de consommation courante. C’est le fruit d’années d’efforts, un lieu de vie chargé d’émotion et, très souvent, l’actif le plus précieux de votre patrimoine familial. Pourtant, chaque année en France, 70% des propriétaires qui tentent de vendre seuls sans protocole finissent par abandonner ou brader leur bien.',
    'Ce n’est pas un manque d’enthousiasme : c’est le piège de l’improvisation. Entre l’estimation au feeling, l’usure de l’annonce sur les portails, le défilé de curieux non solvables et l’extrême complexité juridique, une vente immobilière exige une rigueur méthodique absolue.',
    'Beaucoup de professionnels gardent jalousement leurs secrets. Ce n’est pas ma vision. Je crois qu’un propriétaire éclairé prend de bien meilleures décisions. Dans ce livret, je partage avec vous, en toute transparence et sans filtre, les protocoles exacts que j’applique sur le terrain en Provence & Côte d’Azur.',
    'Mon seul contrat d’exigence avec vous : accordez à ces pages 45 minutes de lecture attentive. C’est l’investissement le plus rentable de votre projet pour aborder votre vente avec lucidité, maîtrise et souveraineté.',
  ],
  agentName = 'Alexandre Lopez',
  agentPhone = '06 13 18 01 68',
  agentEmail = 'alex@alexlopez-provence.fr',
  agentWebsite = 'alexlopez-provence.fr',
  agentPhoto = '/alexandre-lopez.jpg',
}: WelcomePhoneTemplateProps) {
  return (
    <div className="a4-sheet relative flex h-full w-full flex-col justify-between overflow-hidden bg-white p-10 sm:p-14 md:p-16 text-zinc-900 shadow-2xl select-none aspect-[1/1.414]">
      {/* ─── 1. TITRE "welcome" & SOUS-TITRE (STYLE ORIGINAL BOOKLET) ─── */}
      <div className="mb-8">
        <h1 className="font-sans text-4xl sm:text-5xl font-black text-black tracking-tight mb-2 leading-none lowercase">
          {title}
        </h1>
        <p className="text-xs sm:text-[13px] font-bold text-zinc-700">
          {subtitle}
        </p>
      </div>

      {/* ─── 2. CORPS : TEXTE ÉDITORIAL À GAUCHE & MOCKUP SMARTPHONE À DROITE ─── */}
      <div className="grid grid-cols-12 gap-8 flex-1 min-h-0 items-center">
        {/* Colonne Gauche (Lettre & Contact) */}
        <div className="col-span-7 flex flex-col justify-between h-full py-1">
          <div className="space-y-3.5 text-[11px] sm:text-[11.5px] leading-relaxed text-zinc-700">
            {paragraphs.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </div>

          {/* Signature & Coordonnées directes (Style Booklet) */}
          <div className="pt-5 mt-4 border-t border-zinc-200">
            <h3 className="text-base font-extrabold text-black tracking-tight leading-tight">
              {agentName}
            </h3>
            <div className="text-[11px] text-zinc-600 font-medium space-y-0.5 mt-1.5">
              <p className="font-bold text-black">{agentPhone}</p>
              <p>{agentEmail}</p>
              <p>{agentWebsite}</p>
            </div>
          </div>
        </div>

        {/* Colonne Droite (Smartphone Mockup Style Livret Américain) */}
        <div className="col-span-5 flex items-center justify-center h-full">
          <div className="relative w-full max-w-[230px] aspect-[9/18.5] bg-black rounded-[36px] p-2.5 shadow-2xl border-4 border-zinc-800">
            {/* Encoche Smartphone */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-16 h-3 bg-black rounded-full z-20" />
            {/* Écran avec Photo */}
            <div className="relative h-full w-full rounded-[28px] overflow-hidden bg-zinc-100">
              <img
                src={agentPhoto}
                alt={agentName}
                className="h-full w-full object-cover object-top"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
