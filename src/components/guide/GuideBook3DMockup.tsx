'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'

interface GuideBook3DMockupProps {
  onOpenModal: () => void
}

export function GuideBook3DMockup({ onOpenModal }: GuideBook3DMockupProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onOpenModal}
      className="relative flex items-center justify-center p-2 cursor-pointer group select-none"
      style={{ perspective: 1200 }}
    >
      {/* ─── SCÈNE 3D DU LIVRE FORMAT A4 (ÉLÉGANTE, LARGE ET NOBLE) ─── */}
      <motion.div
        animate={{
          rotateX: 5,
          rotateY: -10,
          rotateZ: -1,
          y: isHovered ? -5 : 0,
          scale: isHovered ? 1.015 : 1,
        }}
        transition={{ type: 'spring', stiffness: 220, damping: 26 }}
        style={{ transformStyle: 'preserve-3d' }}
        className="relative w-[275px] sm:w-[310px] md:w-[335px] aspect-[1/1.35]"
      >
        {/* Ombre portée réaliste au sol */}
        <div
          className="absolute -bottom-9 inset-x-3 h-12 rounded-full bg-black/65 blur-xl transition-opacity duration-300 pointer-events-none"
          style={{
            transform: 'rotateX(80deg) translateZ(-50px)',
            opacity: isHovered ? 0.85 : 0.65,
            transformOrigin: 'bottom center',
          }}
        />

        {/* ─── TRANCHE DU LIVRE (DOS CLAIR NATUREL À GAUCHE) ─── */}
        <div
          className="absolute left-0 top-0 bottom-0 w-[27px] rounded-l-[3px] overflow-hidden"
          style={{
            transformOrigin: 'left center',
            transform: 'rotateY(-90deg) translateZ(0px)',
            background: 'linear-gradient(90deg, #d4d0c3 0%, #f6f4ee 35%, #e8e4d9 70%, #cbc6b7 100%)',
            boxShadow: 'inset 0 0 6px rgba(0,0,0,0.2)',
          }}
        >
          {/* Reflet sur la courbure du dos */}
          <div className="absolute inset-y-0 left-0.5 w-1 bg-white/40 blur-[0.5px]" />

          {/* Titre vertical de la tranche */}
          <div className="absolute inset-0 flex items-center justify-between py-6 px-1 [writing-mode:vertical-rl] rotate-180 text-zinc-800 select-none">
            <span className="text-[9px] font-bold tracking-[0.22em] text-[#006390] uppercase">
              2026
            </span>
            <span className="text-[9.5px] font-bold tracking-[0.16em] uppercase text-zinc-900">
              Particulier, Comment Vendre Votre Bien ?
            </span>
            <span className="text-[9px] font-semibold tracking-[0.2em] text-zinc-700 uppercase">
              Alexandre Lopez
            </span>
          </div>
        </div>

        {/* ─── BLOC DES PAGES (TRANCHE DROITE & INFÉRIEURE) ─── */}
        {/* Tranche droite */}
        <div
          className="absolute right-0 top-[2px] bottom-[2px] w-[23px] rounded-r-[2px] overflow-hidden"
          style={{
            transformOrigin: 'right center',
            transform: 'rotateY(90deg) translateZ(0px)',
            background: 'repeating-linear-gradient(to right, #f2f0ea 0px, #e3e1d6 1px, #ffffff 2px, #dad6c8 3px)',
            boxShadow: 'inset 3px 0 6px rgba(0,0,0,0.2)',
          }}
        />

        {/* Tranche inférieure */}
        <div
          className="absolute inset-x-[2px] bottom-0 h-[23px] rounded-b-[2px] overflow-hidden"
          style={{
            transformOrigin: 'bottom center',
            transform: 'rotateX(-90deg) translateZ(0px)',
            background: 'repeating-linear-gradient(to bottom, #f2f0ea 0px, #e3e1d6 1px, #ffffff 2px, #dad6c8 3px)',
            boxShadow: 'inset 0 3px 6px rgba(0,0,0,0.25)',
          }}
        />

        {/* ─── VRAIE COUVERTURE DE LIVRE (AUTEUR, TITRE & SOUS-TITRE) ─── */}
        <div
          className="relative w-full h-full rounded-r-lg rounded-l-[2px] overflow-hidden p-5 sm:p-6 flex flex-col justify-between"
          style={{
            transform: 'translateZ(13px)',
            boxShadow: '0 24px 45px -10px rgba(0, 0, 0, 0.65), inset -1px 0 1px rgba(255, 255, 255, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.3)',
          }}
        >
          {/* Photo plein format fusion Provence (Bastide, pierres, lavandes) & Côte d'Azur (Mer Méditerranée turquoise) */}
          <Image
            src="/images/guide/provence-cote-dazur-cover.jpg"
            alt="Particulier, Comment Vendre Votre Bien ? - Alexandre Lopez"
            fill
            className="object-cover object-center"
            priority
          />

          {/* Dégradé doux assurant un contraste éditorial parfait en haut et en bas */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/30 to-black/75 pointer-events-none" />

          {/* Filet d'encadrement classique des beaux livres d'art */}
          <div className="absolute inset-2 sm:inset-3 border border-white/20 rounded-[4px] pointer-events-none z-10" />

          {/* Mors du livre (rainure d'ouverture en creux à gauche) */}
          <div className="absolute left-[12px] top-0 bottom-0 w-[2px] bg-black/45 shadow-[1px_0_0_rgba(255,255,255,0.2)] pointer-events-none z-10" />

          {/* Reflet satiné discret */}
          <div
            className={`absolute inset-0 bg-gradient-to-tr from-transparent via-white/15 to-transparent pointer-events-none transition-opacity duration-500 z-10 ${
              isHovered ? 'opacity-100' : 'opacity-25'
            }`}
          />

          {/* ─── 1. NOM DE L'AUTEUR (EN HAUT) ─── */}
          <div className="relative z-20 pt-1 text-center">
            <span className="text-[11px] sm:text-xs font-bold tracking-[0.28em] text-white/95 uppercase drop-shadow-md">
              Alexandre Lopez
            </span>
          </div>

          {/* ─── 2. TITRE & SOUS-TITRE (AU CENTRE - IDENTIQUE AU HERO) ─── */}
          <div className="relative z-20 my-auto text-center px-1">
            <h3 className="text-base sm:text-lg font-bold uppercase tracking-tight text-white leading-[1.15] drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]">
              Particulier, <br />
              Comment Vendre <br />
              <span className="text-[#25cfff]">Votre Bien ?</span>
            </h3>

            {/* Filet de séparation éditorial */}
            <div className="w-8 h-[1.5px] bg-[#25cfff] mx-auto my-2.5 opacity-85 shadow-xs" />

            {/* Sous-titre */}
            <p className="text-[11px] sm:text-xs text-white/95 font-medium leading-relaxed drop-shadow-md max-w-[210px] mx-auto italic">
              Le guide pratique pour réussir votre vente entre particuliers
            </p>
          </div>

          {/* ─── 3. ANCRAGE ÉDITORIAL (EN BAS) ─── */}
          <div className="relative z-20 pb-1 text-center">
            <span className="text-[9px] sm:text-[10px] font-semibold tracking-[0.25em] text-white/80 uppercase drop-shadow-sm">
              Provence & Côte d’Azur
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
