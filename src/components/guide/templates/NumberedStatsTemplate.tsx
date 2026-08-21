'use client'

import React from 'react'

export interface NumberedStatsTemplateProps {
  pageNumber?: number
  badgeText?: string
  subtitle?: string
  numberedItems?: { number: string; title: string; text: string }[]
  footerNote?: string
}

export function NumberedStatsTemplate({
  pageNumber = 5,
  badgeText = 'CONSIDER THIS',
  subtitle = 'SI VOUS HÉSITEZ ENCORE, ANALYSEZ CES 4 DONNÉES CLÉS CONSTATÉES SUR LE MARCHÉ IMMOBILIER EN PROVENCE :',
  numberedItems = [
    {
      number: '01',
      title: 'Un écart moyen de prix constaté de 6% à 9%',
      text: 'Les études notariales montrent qu’un bien vendu en direct subit souvent une négociation plus agressive faute de concurrence organisée et d’arguments comparatifs factuels.',
    },
    {
      number: '02',
      title: 'Un délai de vente moyen rallongé de 19 jours',
      text: 'Sans diffusion multi-portails professionnelle ni vivier d’acheteurs pré-qualifiés, la mise en relation prend mécaniquement plus de temps.',
    },
    {
      number: '03',
      title: 'Le casse-tête juridique : 1ère cause d’abandon',
      text: 'La constitution du dossier Loi ALUR, les diagnostics DPE et la sécurisation des clauses suspensives de prêt représentent le principal motif de découragement des vendeurs.',
    },
    {
      number: '04',
      title: '70% des vendeurs particuliers finissent par déléguer',
      text: 'Face à l’usure des visites non qualifiées et des rétractations bancaires, plus des deux tiers des propriétaires choisissent de confier leur bien à un conseiller de confiance.',
    },
  ],
  footerNote = 'Vendre seul peut être une expérience gratifiante si vous appliquez une méthode stricte. L’objectif de ce guide est de vous donner toutes les cartes pour réussir en toute sérénité.',
}: NumberedStatsTemplateProps) {
  return (
    <div className="a4-sheet relative flex h-full w-full flex-col justify-between overflow-hidden bg-white p-8 sm:p-12 text-[#0F172A] shadow-sm">
      <div className="flex-1 min-h-0 flex flex-col justify-center my-auto">
        {/* Badge Bleu Méditerranée */}
        <div className="inline-block bg-[#0077B6] text-white px-5 py-2 text-xs sm:text-sm font-black uppercase tracking-wider mb-3 rounded-lg shadow-sm">
          {badgeText}
        </div>

        <p className="text-xs sm:text-sm font-bold tracking-[0.14em] uppercase text-[#64748B] mb-6 max-w-2xl leading-relaxed">
          {subtitle}
        </p>

        {/* 4 Stats Rows avec Chiffres Bleu de Marque */}
        <div className="space-y-4">
          {numberedItems.map((item) => (
            <div key={item.number} className="flex items-baseline gap-5">
              <span className="font-sans italic font-black text-2xl sm:text-3xl md:text-4xl text-[#0077B6] shrink-0 w-12">
                {item.number}
              </span>
              <div className="flex-1">
                <div className="h-[1.5px] bg-[#E2E8F0] w-full mb-1.5" />
                <h4 className="font-sans text-xs sm:text-sm md:text-[14.5px] font-bold text-[#0F172A]">
                  {item.title}
                </h4>
                <p className="text-xs sm:text-[12.5px] md:text-[13px] leading-relaxed text-[#475569] mt-0.5">
                  {item.text}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Note de Bas de Page Teintée */}
        {footerNote && (
          <div className="border-t border-[#0077B6]/20 pt-4 mt-5 text-xs sm:text-[13px] leading-relaxed text-[#0F172A] bg-[#E0F0FA]/40 p-4 rounded-xl border border-[#0077B6]/20">
            <span className="font-bold text-[#0077B6] block mb-0.5">NOTE D’EXPERT :</span>
            {footerNote}
          </div>
        )}
      </div>

      {/* Pied de Page */}
      <div className="shrink-0 flex items-center justify-between text-[10px] text-[#64748B] uppercase tracking-widest border-t border-[#E2E8F0] pt-3 mt-3">
        <span className="font-semibold text-[#0077B6]">ALEXANDRE LOPEZ · CONSEILLER IMMOBILIER</span>
        <span>P. {String(pageNumber).padStart(2, '0')}</span>
      </div>
    </div>
  )
}
