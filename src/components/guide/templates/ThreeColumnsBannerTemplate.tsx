'use client'

import React from 'react'

export interface ThreeColumnsBannerTemplateProps {
  pageNumber?: number
  title?: string
  subtitle?: string
  columns?: { number: string; title: string; text: string }[]
  bannerText?: string
}

export function ThreeColumnsBannerTemplate({
  pageNumber = 17,
  title = 'places to research',
  subtitle = 'OÙ ET COMMENT ÉTUDIER LES VRAIS PRIX DU MARCHÉ EN PROVENCE ?',
  columns = [
    {
      number: '01',
      title: 'Base DVF (Demandes de Valeurs Foncières)',
      text: 'Consultez les prix réels enregistrés par les notaires sur votre commune au cours des 24 derniers mois.',
    },
    {
      number: '02',
      title: 'Portails d’Annonces Vendeurs',
      text: 'Analysez les biens comparables en vente actuellement, en appliquant une décote de négociation de 4% à 8%.',
    },
    {
      number: '03',
      title: 'Avis de Valeur Conseiller',
      text: 'Sollicitez un avis comparatif circonstancié pour apprécier les critères qualitatifs (vue, calme, état).',
    },
  ],
  bannerText = 'Une estimation n’est pas une formule mathématique théorique : c’est l’analyse croisée des transactions réelles et de la concurrence active.',
}: ThreeColumnsBannerTemplateProps) {
  return (
    <div className="a4-sheet relative flex h-full w-full flex-col justify-between overflow-hidden bg-white p-8 sm:p-12 text-[#0F172A] shadow-sm">
      {/* En-Tête Centré */}
      <div className="text-center mb-8">
        <h2 className="font-sans text-3xl sm:text-4xl md:text-[42px] font-black text-[#0F172A] lowercase tracking-tight mb-2">
          {title}
        </h2>
        <p className="text-xs sm:text-[13px] font-bold tracking-[0.18em] uppercase text-[#0077B6]">
          {subtitle}
        </p>
      </div>

      {/* 3 Colonnes Numérotées */}
      <div className="grid grid-cols-3 gap-6 my-auto items-start">
        {columns.map((col) => (
          <div key={col.number} className="flex flex-col items-center text-center">
            <span className="font-sans italic font-black text-3xl sm:text-4xl text-[#0077B6] mb-3">
              {col.number}
            </span>
            <div className="h-[2px] w-12 bg-[#0077B6]/30 mb-3" />
            <h4 className="font-sans text-xs sm:text-sm font-bold text-[#0F172A] mb-2 leading-snug">
              {col.title}
            </h4>
            <p className="text-xs leading-relaxed text-[#475569]">
              {col.text}
            </p>
          </div>
        ))}
      </div>

      {/* Bandeau Inférieur de Marque */}
      <div className="mt-8 bg-[#0F172A] text-white p-6 rounded-xl text-center shadow-lg border-l-4 border-[#00B4EC]">
        <p className="text-xs sm:text-sm font-medium leading-relaxed max-w-xl mx-auto">
          {bannerText}
        </p>
      </div>

      {/* Pied de Page */}
      <div className="flex items-center justify-between text-[10px] text-[#64748B] uppercase tracking-widest border-t border-[#E2E8F0] pt-4 mt-6">
        <span className="font-semibold text-[#0077B6]">ALEXANDRE LOPEZ · MÉTHODOLOGIE</span>
        <span>P. {String(pageNumber).padStart(2, '0')}</span>
      </div>
    </div>
  )
}
