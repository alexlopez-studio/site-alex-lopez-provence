'use client'

import React, { useState, useRef } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ShieldCheck, BookOpen, Sparkles, Check, ArrowRight } from 'lucide-react'

interface Interactive3DBookMockupProps {
  onOpenModal?: () => void
}

export function Interactive3DBookMockup({ onOpenModal }: Interactive3DBookMockupProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [rotateX, setRotateX] = useState(0)
  const [rotateY, setRotateY] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    // Calcul de l'angle d'inclinaison 3D doux
    const newRotateX = ((y - centerY) / centerY) * -10
    const newRotateY = ((x - centerX) / centerX) * 10

    setRotateX(newRotateX)
    setRotateY(newRotateY)
  }

  const handleMouseLeave = () => {
    setRotateX(0)
    setRotateY(0)
    setIsHovered(false)
  }

  return (
    <div
      className="relative flex items-center justify-center p-4 sm:p-8"
      style={{ perspective: 1200 }}
    >
      {/* ─── CONTENEUR 3D PRINCIPAL ─── */}
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        animate={{
          rotateX,
          rotateY,
          scale: isHovered ? 1.03 : 1,
        }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        style={{ transformStyle: 'preserve-3d' }}
        className="relative cursor-pointer group max-w-sm sm:max-w-md w-full"
        onClick={onOpenModal}
      >
        {/* Ombre portée dynamique sous le livre */}
        <div
          className={`absolute -bottom-8 inset-x-8 h-12 rounded-full bg-brand/25 blur-2xl transition-all duration-500 ${
            isHovered ? 'scale-110 opacity-100' : 'scale-95 opacity-60'
          }`}
        />

        {/* ─── TRANCHES DE PAGES SUPERPOSÉES (Effet 41 pages A4) ─── */}
        <div
          className="absolute -right-3 top-3 bottom-3 w-4 rounded-r-lg bg-gradient-to-r from-slate-200 via-white to-slate-300 border-y border-r border-slate-300/80 shadow-md"
          style={{ transform: 'translateZ(-15px)' }}
        />
        <div
          className="absolute -right-1.5 top-1.5 bottom-1.5 w-2 rounded-r-md bg-white border-y border-r border-slate-200"
          style={{ transform: 'translateZ(-8px)' }}
        />

        {/* ─── COUVERTURE DU LIVRE (DOUBLE-BEZEL ARCHITECTURE) ─── */}
        <div className="relative rounded-3xl bg-slate-900 p-2 shadow-[0_30px_70px_rgba(0,119,182,0.22)] ring-1 ring-white/20 overflow-hidden">
          {/* Reflet de lumière sur la couverture qui réagit au survol */}
          <div
            className={`pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/15 to-transparent transition-opacity duration-500 z-30 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          />

          {/* Corps de la couverture */}
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-b from-[#0F172A] via-[#023e8a] to-[#0077b6] p-6 sm:p-7 text-white flex flex-col justify-between aspect-[3/4] min-h-[460px]">
            {/* Texture de fond photo provençale tamisée */}
            <div className="absolute inset-0 opacity-25 mix-blend-overlay">
              <Image
                src="/village-cotignac.jpg"
                alt="Texture de couverture"
                fill
                className="object-cover"
              />
            </div>

            {/* Haut de couverture */}
            <div className="relative z-10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 backdrop-blur-md px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.2em] text-brand-light border border-white/20">
                  <Sparkles className="h-3 w-3" />
                  Édition 2026
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/70">
                  iad Provence
                </span>
              </div>

              <div className="pt-2">
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-brand-light/90">
                  Manuel Opérationnel
                </p>
                <h3 className="text-2xl sm:text-3xl font-black text-white leading-[1.1] tracking-tight mt-1">
                  Le Guide Stratégique du Vendeur Particulier
                </h3>
              </div>
            </div>

            {/* Onglets / Piliers au centre du livre */}
            <div className="relative z-10 my-auto space-y-2 py-3 border-y border-white/15 text-xs text-white/90">
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-brand-light" />
                <span>Méthode d'estimation DVF Notariales</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-brand-light" />
                <span>Script de qualification bancaire (4 questions)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-brand-light" />
                <span>Checklists de valorisation & conformité ALUR</span>
              </div>
            </div>

            {/* Bas de couverture : auteur & mention A4 */}
            <div className="relative z-10 pt-2 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="relative h-10 w-10 rounded-full overflow-hidden border-2 border-brand-light/60 shadow-md">
                  <Image
                    src="/alexandre-lopez-face.jpg"
                    alt="Alexandre Lopez"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Alexandre Lopez</p>
                  <p className="text-[10px] text-white/75">Conseiller en immobilier iad</p>
                </div>
              </div>

              <span className="rounded-md bg-white/20 backdrop-blur-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                41 Pages A4
              </span>
            </div>
          </div>
        </div>

        {/* Badge d'action flottant au survol */}
        <div
          className={`absolute -bottom-4 left-1/2 -translate-x-1/2 z-40 rounded-full bg-brand text-white px-5 py-2.5 text-xs font-bold shadow-xl border border-white/20 flex items-center gap-2 transition-all duration-300 ${
            isHovered ? 'translate-y-0 opacity-100 scale-105' : 'translate-y-2 opacity-90 scale-100'
          }`}
        >
          <BookOpen className="h-4 w-4" />
          <span>Feuilleter l'exemplaire</span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </div>
      </motion.div>
    </div>
  )
}
