'use client'

import React from 'react'

export interface StagingComparisonVsTemplateProps {
  pageNumber?: number
  title?: string
  subtitle?: string
  paragraphs?: string[]
  leftImage?: { url: string; label: string }
  rightImage?: { url: string; label: string }
  beforeAfter?: { beforeLabel: string; beforeImg: string; afterLabel: string; afterImg: string }
}

export function StagingComparisonVsTemplate({
  pageNumber = 12,
  title = 'staging your home',
  subtitle = 'LA TRANSFORMATION VISUELLE QUI PROVOQUE LE COUP DE CŒUR',
  paragraphs = [
    'Le home staging ne consiste pas à masquer les défauts, mais à révéler le plein potentiel des volumes et de la lumière naturelle.',
    'Un logement désencombré et harmonisé permet aux acquéreurs de se projeter instantanément avec leur propre mobilier, sans être distraits par votre quotidien.',
  ],
  leftImage,
  rightImage,
  beforeAfter,
}: StagingComparisonVsTemplateProps) {
  const actualLeftImage = beforeAfter
    ? { url: beforeAfter.beforeImg, label: beforeAfter.beforeLabel }
    : (leftImage ?? {
        url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
        label: 'AVANT : ESPACE CHARGÉ & SOMBRE',
      })

  const actualRightImage = beforeAfter
    ? { url: beforeAfter.afterImg, label: beforeAfter.afterLabel }
    : (rightImage ?? {
        url: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80',
        label: 'APRÈS : LUMINEUX & ÉPURÉ',
      })
  return (
    <div className="a4-sheet relative flex h-full w-full flex-col justify-between overflow-hidden bg-white p-8 sm:p-12 text-[#0F172A] shadow-sm">
      {/* En-Tête Centré */}
      <div className="text-center mb-6">
        <h2 className="font-sans text-3xl sm:text-4xl md:text-[42px] font-black text-[#0F172A] lowercase tracking-tight mb-2">
          {title}
        </h2>
        <p className="text-xs sm:text-[13px] font-bold tracking-[0.18em] uppercase text-[#0077B6] mb-4">
          {subtitle}
        </p>

        <div className="max-w-xl mx-auto space-y-2 text-xs sm:text-[13px] leading-relaxed text-[#334155]">
          {paragraphs.map((p, idx) => (
            <p key={idx}>{p}</p>
          ))}
        </div>
      </div>

      {/* Double Photo Comparatif avec Badge Central VS Bleu Méditerranée */}
      <div className="relative my-auto grid grid-cols-2 gap-4 items-center">
        {/* Photo Gauche */}
        <div className="relative h-64 sm:h-72 rounded-xl overflow-hidden bg-[#F8FAFC] shadow-md">
          <img
            src={actualLeftImage.url}
            alt={actualLeftImage.label}
            className="h-full w-full object-cover grayscale-[20%]"
          />
          <div className="absolute bottom-3 left-3 right-3 bg-[#0F172A]/85 backdrop-blur-xs text-white py-1.5 px-3 rounded-md text-center text-[10px] font-bold uppercase tracking-wider">
            {actualLeftImage.label}
          </div>
        </div>

        {/* Badge Central VS */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 h-14 w-14 rounded-full bg-[#0077B6] text-white flex items-center justify-center font-black text-lg shadow-[0_8px_25px_rgba(0,119,182,0.5)] border-4 border-white">
          VS
        </div>

        {/* Photo Droite */}
        <div className="relative h-64 sm:h-72 rounded-xl overflow-hidden bg-[#F8FAFC] shadow-md">
          <img
            src={actualRightImage.url}
            alt={actualRightImage.label}
            className="h-full w-full object-cover"
          />
          <div className="absolute bottom-3 left-3 right-3 bg-[#0077B6]/90 backdrop-blur-xs text-white py-1.5 px-3 rounded-md text-center text-[10px] font-bold uppercase tracking-wider">
            {actualRightImage.label}
          </div>
        </div>
      </div>

      {/* Pied de Page */}
      <div className="flex items-center justify-between text-[10px] text-[#64748B] uppercase tracking-widest border-t border-[#E2E8F0] pt-4 mt-6">
        <span className="font-semibold text-[#0077B6]">ALEXANDRE LOPEZ · MISE EN VALEUR</span>
        <span>P. {String(pageNumber).padStart(2, '0')}</span>
      </div>
    </div>
  )
}
