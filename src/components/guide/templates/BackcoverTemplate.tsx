'use client'

import React from 'react'
import { Phone, Mail, Globe, MapPin, Award } from 'lucide-react'

export interface BackcoverTemplateProps {
  agentName?: string
  agentRole?: string
  agentPhone?: string
  agentEmail?: string
  agentWebsite?: string
  agentTerritory?: string
}

export function BackcoverTemplate({
  agentName = 'Alexandre Lopez',
  agentRole = 'Conseiller en Immobilier · Réseau iad France',
  agentPhone = '06 13 18 01 68',
  agentEmail = 'alex@alexlopez-provence.fr',
  agentWebsite = 'alexlopez-provence.fr',
  agentTerritory = 'Provence Verte & Verdon · Var',
}: BackcoverTemplateProps) {
  return (
    <div className="a4-sheet relative flex h-full w-full flex-col justify-between overflow-hidden bg-[#0F172A] p-12 sm:p-16 text-white shadow-sm">
      {/* ─── EN-TÊTE HAUT DE COUVERTURE ARRIÈRE ─── */}
      <div className="text-center pt-6">
        <span className="inline-block bg-[#0077B6] text-white text-[11px] font-extrabold uppercase tracking-[0.25em] px-4 py-1.5 rounded-full mb-6 shadow-md">
          ÉDITION PROPRIÉTAIRE · GUIDE OFFICIEL
        </span>
        <h1 className="font-script text-5xl sm:text-6xl md:text-7xl text-white mb-2 leading-none">
          {agentName}
        </h1>
        <p className="font-sans text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-[#00B4EC]">
          {agentRole}
        </p>
      </div>

      {/* ─── BLOC CENTRAL : CITATION D'ENGAGEMENT ─── */}
      <div className="my-auto max-w-lg mx-auto text-center space-y-6">
        <div className="flex justify-center">
          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-[#0077B6] to-[#00B4EC] flex items-center justify-center text-white shadow-xl">
            <Award className="h-8 w-8" />
          </div>
        </div>

        <blockquote className="font-sans text-base sm:text-lg font-light leading-relaxed text-slate-200 italic px-4">
          « Une vente immobilière réussie est avant tout une alliance de transparence, de rigueur juridique et d’une connaissance intime de notre terroir provençal. »
        </blockquote>

        <div className="h-[2px] w-24 bg-[#00B4EC] mx-auto" />
      </div>

      {/* ─── CARTOUCHE DE CONTACT DIRECT ET DE RÉSEAU ─── */}
      <div className="space-y-6">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/15 max-w-md mx-auto space-y-3.5 text-xs sm:text-sm text-slate-200">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-[#0077B6] flex items-center justify-center text-white shrink-0">
              <Phone className="h-4 w-4" />
            </div>
            <span className="font-bold text-white text-base tracking-wide">{agentPhone}</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center text-white shrink-0">
              <Mail className="h-4 w-4" />
            </div>
            <span>{agentEmail}</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center text-white shrink-0">
              <Globe className="h-4 w-4" />
            </div>
            <span>{agentWebsite}</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center text-white shrink-0">
              <MapPin className="h-4 w-4 text-[#00B4EC]" />
            </div>
            <span className="text-slate-300">{agentTerritory}</span>
          </div>
        </div>

        {/* Logo et Mentions Légales iad */}
        <div className="flex items-center justify-between text-[10px] text-slate-400 uppercase tracking-widest border-t border-white/10 pt-4">
          <div className="flex items-center gap-2">
            <span className="font-serif italic font-black text-xl text-white">iad</span>
            <span className="text-[9px] font-bold text-slate-300">FRANCE</span>
          </div>
          <span>© ALEXANDRE LOPEZ · TOUS DROITS RÉSERVÉS</span>
          <span>P. 41</span>
        </div>
      </div>
    </div>
  )
}
