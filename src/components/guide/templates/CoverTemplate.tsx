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
  title = 'SELLING YOUR OWN HOME',
  subtitle = 'Le guide complet étape par étape pour réussir votre vente en Provence',
  heroImage = '/images/provence-bastide-lavande.jpg',
  edition = 'ÉDITION PROPRIÉTAIRE · MÉTHODE & OUTILS',
  region = 'ALEXANDRE LOPEZ · CONSEILLER IMMOBILIER IAD FRANCE · PROVENCE VERTE & VERDON',
}: CoverTemplateProps) {
  return (
    <div className="a4-sheet relative flex h-full w-full flex-col justify-between overflow-hidden bg-[#0B132B] text-white shadow-2xl p-0 select-none aspect-[1/1.414]">
      {/* ─── FOND VISUEL PLEINE PAGE HAUTE DÉFINITION ─── */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt={title}
          className="h-full w-full object-cover object-center"
        />
        {/* Voile de dégradé cinématique haut & bas pour lisibilité */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B132B]/75 via-black/20 to-[#0B132B]/85" />
      </div>

      {/* ─── EN-TÊTE HAUT DE COUVERTURE CENTRÉ ─── */}
      <div className="relative z-10 pt-10 sm:pt-14 px-8 sm:px-12 text-center">
        {/* Surtitre Thématique */}
        <p className="text-[10px] sm:text-xs uppercase font-bold tracking-[0.32em] text-[#FDFBF7]/90 drop-shadow-md mb-3">
          IMMOBILIER & ART DE VIVRE EN PROVENCE
        </p>

        {/* Titre Monumental Serif Agrandit & Centré */}
        <h1 className="font-serif text-3xl sm:text-5xl md:text-[54px] font-black tracking-tight text-[#FDFBF7] uppercase leading-[1.04] drop-shadow-[0_4px_24px_rgba(0,0,0,0.7)] max-w-xl mx-auto">
          {title}
        </h1>

        {/* Signature Manuscrite Allura Centrée */}
        <div className="mt-3 flex items-center justify-center">
          <span className="font-script text-3xl sm:text-4xl text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
            Alexandre Lopez
          </span>
        </div>
      </div>

      {/* ─── CARTOUCHE FLOTTANT BLANC AUX ANGLES ARRONDIS ─── */}
      <div className="relative z-10 px-8 sm:px-14 my-auto">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-7 text-center shadow-[0_24px_50px_rgba(0,0,0,0.35)] border border-white/70 ring-1 ring-black/5 max-w-md mx-auto">
          {/* Filet d'accentuation supérieur */}
          <div className="w-10 h-[2px] bg-[#0077B6] mx-auto mb-3 rounded-full" />

          {/* Sous-titre de la méthode */}
          <p className="font-serif text-sm sm:text-base font-bold text-[#0F172A] leading-snug tracking-tight">
            {subtitle}
          </p>

          {/* Filet d'accentuation inférieur */}
          <div className="w-10 h-[2px] bg-[#0077B6] mx-auto mt-3 mb-2.5 rounded-full" />

          {/* Badge Méthode */}
          <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.18em] text-[#0077B6] font-extrabold m-0">
            41 FICHES MÉTHODIQUES · DONNÉES DVF RÉELLES
          </p>
        </div>
      </div>

      {/* ─── PIED DE PAGE ÉDITORIAL PRESTIGE ─── */}
      <div className="relative z-10 pb-8 sm:pb-10 px-8 sm:px-12 text-center space-y-1">
        <p className="text-[9px] sm:text-[10px] uppercase font-bold tracking-[0.24em] text-white/95 drop-shadow-md">
          {region}
        </p>
        <p className="text-[8px] sm:text-[9px] uppercase font-semibold tracking-[0.22em] text-[#00B4EC] drop-shadow-sm">
          {edition}
        </p>
      </div>
    </div>
  )
}
