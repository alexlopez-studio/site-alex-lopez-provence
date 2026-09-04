'use client'

import React from 'react'
import { Phone, Mail, Globe, MapPin, ShieldCheck } from 'lucide-react'

export interface BackcoverTemplateProps {
  pageNumber?: number
  quote?: string
  agentName?: string
  agentRole?: string
  agentPhone?: string
  agentEmail?: string
  agentWebsite?: string
  agentTerritory?: string
}

export function BackcoverTemplate({
  pageNumber = 32,
  agentName = 'Alexandre Lopez',
  agentRole = 'Conseiller en Immobilier · Réseau iad France',
  agentPhone = '06 13 18 01 68',
  agentEmail = 'alex@alexlopez-provence.fr',
  agentWebsite = 'alexlopez-provence.fr',
  agentTerritory = 'Cotignac, Haut-Var & Provence Verte',
  quote = '« Une vente immobilière réussie est avant tout une alliance de transparence, de rigueur technique et d’une connaissance intime de notre terroir provençal. »',
}: BackcoverTemplateProps) {
  return (
    <div className="a4-sheet relative flex h-full w-full flex-col justify-between overflow-hidden bg-[#001D2D] text-white shadow-2xl p-8 sm:p-11 md:p-12 select-none aspect-[1/1.414]">
      {/* ─── 1. FOLIO SUPÉRIEUR ─── */}
      <div className="border-b border-white/15 pb-3 flex items-center justify-between text-[9px] uppercase tracking-[0.25em] font-semibold text-white/70">
        <span className="text-[#7DD3FC] font-bold">
          Édition Propriétaire · Provence
        </span>
        <span>
          Guide Pratique du Vendeur
        </span>
      </div>

      {/* ─── 2. BLOC CENTRAL : AUTEUR & CITATION D'ENGAGEMENT ─── */}
      <div className="max-w-lg mx-auto my-auto text-center py-6">
        <div className="inline-flex items-center gap-2 border border-[#7DD3FC]/30 bg-[#7DD3FC]/10 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-[0.2em] text-[#7DD3FC] mb-4">
          <ShieldCheck className="h-3.5 w-3.5 text-[#7DD3FC]" />
          <span>Accompagnement & Expertise Locale</span>
        </div>

        <h1 className="font-sans text-2xl sm:text-3xl font-bold tracking-tight text-white mb-1.5">
          {agentName}
        </h1>
        <p className="text-xs font-semibold text-[#7DD3FC] uppercase tracking-wider mb-6">
          {agentRole}
        </p>

        <div className="w-12 h-px bg-[#7DD3FC]/50 mx-auto mb-6" />

        <blockquote className="font-serif text-sm sm:text-base md:text-lg font-normal leading-relaxed text-zinc-200 italic mb-4">
          {quote}
        </blockquote>
      </div>

      {/* ─── 3. CARTOUCHE DE CONTACT & RÉSEAU ─── */}
      <div className="space-y-4">
        <div className="bg-white/5 border border-white/10 rounded-lg p-4 max-w-md mx-auto grid grid-cols-2 gap-3 text-[11px] text-zinc-200">
          <div className="flex items-center gap-2.5">
            <Phone className="h-4 w-4 text-[#7DD3FC] shrink-0" />
            <span className="font-semibold text-white">{agentPhone}</span>
          </div>

          <div className="flex items-center gap-2.5">
            <Mail className="h-4 w-4 text-[#7DD3FC] shrink-0" />
            <span className="truncate">{agentEmail}</span>
          </div>

          <div className="flex items-center gap-2.5">
            <Globe className="h-4 w-4 text-[#7DD3FC] shrink-0" />
            <span>{agentWebsite}</span>
          </div>

          <div className="flex items-center gap-2.5">
            <MapPin className="h-4 w-4 text-[#7DD3FC] shrink-0" />
            <span className="truncate">{agentTerritory}</span>
          </div>
        </div>

        {/* Mentions Légales & Signature */}
        <div className="border-t border-white/15 pt-3 flex items-center justify-between text-[9px] uppercase tracking-wider text-white/50">
          <span>Réseau iad France · RSAC Draguignan</span>
          <span>© Alexandre Lopez · Tous droits réservés</span>
          <span className="font-bold text-white">
            Page {String(pageNumber).padStart(2, '0')}
          </span>
        </div>
      </div>
    </div>
  )
}
