'use client'

import React from 'react'

export interface CoverTemplateProps {
  title?: string
  subtitle?: string
  heroImage?: string
  edition?: string
  region?: string
}

export function CoverTemplate({
  title = 'Selling Your Own Home',
  subtitle = 'Le guide complet étape par étape pour réussir votre vente en Provence Verte & Verdon',
  heroImage = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=85',
  edition = 'ÉDITION PROPRIÉTAIRE · MÉTHODE & OUTILS',
  region = 'ALEXANDRE LOPEZ · CONSEILLER IMMOBILIER IAD FRANCE',
}: CoverTemplateProps) {
  return (
    <div className="a4-sheet relative flex h-full w-full flex-col justify-between overflow-hidden bg-white text-[#0F172A] shadow-sm p-0">
      {/* En-Tête Haute Définition avec Signature de Marque */}
      <div className="pt-10 sm:pt-12 px-10 sm:px-14 pb-6 bg-white z-10 flex items-end justify-between border-b border-slate-100">
        <div>
          <span className="inline-block bg-[#E0F0FA] text-[#0077B6] font-bold text-[11px] uppercase tracking-[0.2em] px-3.5 py-1 rounded-full mb-3">
            GUIDE IMMOBILIER PRIVÉ
          </span>
          <h1 className="font-sans text-4xl sm:text-5xl md:text-[52px] font-black tracking-tight text-[#0F172A] leading-[1.05]">
            {title}
          </h1>
        </div>

        {/* Signature Script Emblématique */}
        <div className="hidden sm:flex flex-col items-end leading-none pb-1">
          <span className="font-script text-3xl text-[#0F172A]">Alexandre Lopez</span>
          <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#0077B6] mt-1">
            iad France · Provence
          </span>
        </div>
      </div>

      {/* Visuel Principal Provence & Cartouche de Présentation */}
      <div className="relative flex-1 w-full overflow-hidden bg-[#F8FAFC]">
        <img
          src={heroImage}
          alt={title}
          className="h-full w-full object-cover object-center"
        />

        {/* Cartouche d'Accroche Flottant aux Couleurs de la Marque */}
        <div className="absolute bottom-10 right-10 bg-white/95 backdrop-blur-md px-7 py-5 shadow-2xl border-l-4 border-[#0077B6] max-w-md text-left z-10 rounded-r-xl">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0077B6] mb-1">
            MÉTHODOLOGIE CONSEILLER
          </p>
          <p className="text-xs sm:text-sm font-semibold leading-snug tracking-normal text-[#0F172A]">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Pied de Page Officiel iad France */}
      <div className="bg-[#0F172A] text-white px-10 sm:px-14 py-4 flex items-center justify-between text-[10px] uppercase tracking-widest z-10">
        <span className="font-semibold text-white/90">{region}</span>
        <span className="text-[#00B4EC] font-bold">{edition}</span>
      </div>
    </div>
  )
}
