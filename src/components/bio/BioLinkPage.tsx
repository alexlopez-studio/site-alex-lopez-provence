'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Phone,
  MessageCircle,
  Mail,
  Share2,
  Check,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Download,
  BookOpen,
  Home,
  Calculator,
  Globe,
  Sparkles,
  ArrowUpRight,
  CheckCircle2,
} from 'lucide-react'
import '@/components/concept/concept.css'
import '@/styles/design-tokens.css'

export function BioLinkPage() {
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: 'Alexandre Lopez — Conseiller Immobilier · Provence & Côte d’Azur',
          text: 'Découvrez mes biens à la vente, mon guide propriétaire offert et mes coordonnées directes.',
          url: window.location.href,
        })
      } catch {
        // Annulation utilisateur
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch {
        // Fallback
      }
    }
  }

  return (
    <div
      className="concept-scope font-sans min-h-screen text-white relative overflow-x-hidden selection:bg-[#25cfff] selection:text-[#004d73]"
      style={{
        background: 'radial-gradient(ellipse at 70% 30%, #004d73 0%, #00283e 100%)',
        minHeight: '100svh',
      }}
    >
      {/* Texture photo fixe douce de Provence (identique au Hero de /guide-vendeur) */}
      <div className="fixed inset-0 opacity-15 pointer-events-none mix-blend-overlay">
        <Image
          src="/images/provence-bastide-lavande.jpg"
          alt="Provence bastide et oliviers"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Voile dégradé cyan en haut à droite */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 85% 20%, rgba(37, 207, 255, 0.18) 0%, transparent 60%)',
        }}
      />

      {/* Conteneur Mobile-First */}
      <main className="relative z-10 max-w-lg mx-auto px-4 sm:px-6 pt-5 pb-12">
        
        {/* ═════════════════════════════════════════════════════════════════════
            HEADER SUPÉRIEUR : Monogramme AL & Bouton Partage
        ═════════════════════════════════════════════════════════════════════ */}
        <div className="flex items-center justify-between gap-3 mb-6 pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#006390] to-[#003854] text-white flex items-center justify-center font-bold text-xs shadow-md border border-white/50">
              AL
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-white">
                Alexandre Lopez
              </div>
              <div className="text-[10px] text-white/70 font-medium">
                Conseiller iad · Provence & Côte d’Azur
              </div>
            </div>
          </div>

          <button
            onClick={handleShare}
            aria-label="Partager ce profil"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white transition-all active:scale-95 text-xs font-medium cursor-pointer shadow-xs"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-[11px] text-emerald-300">Lien copié</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span className="text-[11px]">Partager</span>
              </>
            )}
          </button>
        </div>

        {/* ═════════════════════════════════════════════════════════════════════
            PROFIL PRINCIPAL
        ═════════════════════════════════════════════════════════════════════ */}
        <header className="flex flex-col items-center text-center mb-7">
          {/* Avatar agrandi avec zoom sur le visage et pastille de disponibilité */}
          <div className="relative mb-4">
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full p-1 bg-gradient-to-tr from-[#25cfff] via-white/40 to-[#25cfff]/80 shadow-2xl">
              <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-[#004d73] bg-[#00283e]">
                <Image
                  src="/images/alexandre-lopez-avatar-bio.jpg"
                  alt="Alexandre Lopez"
                  fill
                  sizes="(max-width: 640px) 112px, 128px"
                  className="object-cover"
                  priority
                />
              </div>
            </div>
            {/* Statut vert pulsant */}
            <span
              className="absolute bottom-1 right-1 flex items-center justify-center p-1 bg-[#00283e] rounded-full shadow-md"
              title="Disponible pour votre projet"
            >
              <span className="relative flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border border-white/50" />
              </span>
            </span>
          </div>

          {/* Nom en typographie officielle (sans empattement) */}
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight uppercase text-white flex items-center justify-center gap-2 mb-1">
            <span>Alexandre Lopez</span>
            <span className="text-[#25cfff]" title="Profil officiel vérifié">
              <ShieldCheck className="w-5 h-5 fill-[#25cfff] text-[#004d73]" />
            </span>
          </h1>

          {/* Sous-titre officiel */}
          <p className="text-xs sm:text-sm uppercase tracking-[0.16em] font-semibold text-[#25cfff] mb-5">
            Conseiller Immobilier · Provence & Côte d’Azur
          </p>

          {/* 3 boutons de contact direct (Apple/Quiet Luxury style) */}
          <div className="w-full grid grid-cols-3 gap-2.5 max-w-sm">
            <a
              href="tel:+33613180168"
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-full bg-white/12 hover:bg-white/20 active:scale-95 border border-white/20 backdrop-blur-md transition-all text-xs font-medium text-white shadow-xs group"
            >
              <Phone className="w-3.5 h-3.5 text-[#25cfff] group-hover:scale-110 transition-transform" />
              <span>Appeler</span>
            </a>

            <a
              href="https://wa.me/33613180168?text=Bonjour%20Alexandre,%20je%20souhaite%20échanger%20sur%20mon%20projet%20immobilier"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-full bg-white/12 hover:bg-white/20 active:scale-95 border border-white/20 backdrop-blur-md transition-all text-xs font-medium text-white shadow-xs group"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span>WhatsApp</span>
            </a>

            <a
              href="mailto:alexandre.lopez@iadfrance.fr"
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-full bg-white/12 hover:bg-white/20 active:scale-95 border border-white/20 backdrop-blur-md transition-all text-xs font-medium text-white shadow-xs group"
            >
              <Mail className="w-3.5 h-3.5 text-cyan-300 group-hover:scale-110 transition-transform" />
              <span>Email</span>
            </a>
          </div>
        </header>

        {/* ═════════════════════════════════════════════════════════════════════
            BLOCS D'ACTIONS RÉINVENTÉS (Ultra-visuels & Compréhensifs)
        ═════════════════════════════════════════════════════════════════════ */}
        <div className="space-y-4 mb-8">

          {/* ─────────────────────────────────────────────────────────────────
              BLOC 1 (VEDETTE MAJEURE) : LE GUIDE PROPRIÉTAIRE VENDEUR (OPTION 1)
          ───────────────────────────────────────────────────────────────── */}
          <Link
            href="/guide-vendeur"
            className="group block relative rounded-[1.75rem] bg-white text-zinc-950 overflow-hidden shadow-2xl transition-all duration-300 hover:scale-[1.015] active:scale-[0.99] border-2 border-white"
          >
            {/* Bannière panoramique de prestige */}
            <div className="relative h-36 sm:h-44 w-full overflow-hidden bg-zinc-100">
              <Image
                src="/images/guide/provence-cote-dazur-cover.jpg"
                alt="Particulier, Comment Vendre Votre Bien ?"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 640px) 100vw, 512px"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
              
              {/* Badges statutaires flottants */}
              <div className="absolute top-3.5 left-3.5 flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-wider shadow-md flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  Guide 2026 · 100% Offert
                </span>
                <span className="px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md text-white/90 text-[10px] font-mono font-medium">
                  Format PDF
                </span>
              </div>

              {/* Titre sur la bannière */}
              <div className="absolute bottom-3.5 left-4 right-4 text-white">
                <div className="text-[10px] sm:text-[11px] font-semibold tracking-[0.2em] text-[#25cfff] uppercase mb-0.5 drop-shadow-sm">
                  Méthode Vendeur en Provence
                </div>
                <h2 className="text-lg sm:text-2xl font-bold uppercase tracking-tight text-white leading-tight drop-shadow-md">
                  Particulier, Comment Vendre Votre Bien ?
                </h2>
              </div>
            </div>

            {/* Corps du bloc */}
            <div className="p-4 sm:p-5">
              <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                Le livret méthodique complet pour fixer le juste prix DVF, filtrer les visites sans filtre et sécuriser le compromis chez le notaire.
              </p>

              {/* 3 repères visuels rapides */}
              <div className="grid grid-cols-3 gap-2 my-3.5 py-2.5 border-y border-zinc-100 text-[11px] text-zinc-700 font-medium">
                <span className="flex items-center justify-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  Prix notariés DVF
                </span>
                <span className="flex items-center justify-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  Filtre acheteurs
                </span>
                <span className="flex items-center justify-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  Dossier notaire
                </span>
              </div>

              {/* Grand bouton d'action officiel avec bulle cyan pulsante */}
              <span className="relative w-full py-3.5 px-6 rounded-full bg-[#006390] text-white text-xs font-semibold tracking-wider uppercase shadow-md group-hover:bg-[#004d73] transition-all flex items-center justify-center gap-2">
                {/* Bulle cyan pulsante */}
                <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-80" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#25cfff]" />
                </span>
                <span>Recevoir le guide offert</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </Link>

          {/* ─────────────────────────────────────────────────────────────────
              BLOC 2 : MES PROPRIÉTÉS EN VENTE (Vitrine iad France)
          ───────────────────────────────────────────────────────────────── */}
          <a
            href="https://www.iadfrance.fr/conseiller-immobilier/alexandre.lopez"
            target="_blank"
            rel="noopener noreferrer"
            className="group block relative rounded-[1.5rem] bg-white text-zinc-950 overflow-hidden shadow-lg transition-all duration-300 hover:scale-[1.015] active:scale-[0.99] border border-white/80"
          >
            {/* Bannière photo panoramique supérieure */}
            <div className="relative h-32 sm:h-36 w-full overflow-hidden bg-zinc-100">
              <Image
                src="/images/provence-bastide-lavande.jpg"
                alt="Propriétés en vente en Provence"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 640px) 100vw, 512px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <div className="absolute top-3 left-3">
                <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[#006390] text-[10px] font-bold uppercase tracking-wider shadow-xs">
                  Portefeuille Immobilier
                </span>
              </div>
              <div className="absolute bottom-3 left-4 right-4 text-white">
                <div className="text-base sm:text-lg font-bold drop-shadow-sm flex items-center justify-between">
                  <span>Mes Annonces & Biens en Vente</span>
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>
            </div>

            {/* Corps du bloc */}
            <div className="p-4 flex items-center justify-between gap-3">
              <p className="text-xs text-zinc-600 leading-relaxed">
                Villas, bastides et propriétés sélectionnées en Provence Verte, Var et Côte d’Azur.
              </p>
              <span className="shrink-0 px-3.5 py-1.5 rounded-full bg-[#006390]/10 text-[#006390] group-hover:bg-[#006390] group-hover:text-white text-[11px] font-semibold uppercase tracking-wider transition-all">
                Voir la vitrine
              </span>
            </div>
          </a>

          {/* ─────────────────────────────────────────────────────────────────
              BLOC 3 : CARTE DE VISITE VIRTUELLE (Format Carte de Prestige)
          ───────────────────────────────────────────────────────────────── */}
          <a
            href="/api/vcard"
            download="Alexandre-Lopez-iad.vcf"
            className="group block relative rounded-[1.5rem] p-4.5 sm:p-5 transition-all duration-300 hover:scale-[1.015] active:scale-[0.99] shadow-lg overflow-hidden border border-white/20"
            style={{
              background: 'linear-gradient(135deg, rgba(0, 99, 144, 0.85) 0%, rgba(0, 40, 62, 0.95) 100%)',
              backdropFilter: 'blur(20px)',
            }}
          >
            {/* Reflet satiné */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#25cfff]/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-12 h-12 rounded-2xl bg-white/15 border border-white/30 text-white flex items-center justify-center shrink-0 shadow-md group-hover:bg-[#25cfff] group-hover:text-[#004d73] transition-colors">
                  <Download className="w-6 h-6" />
                </div>
                <div className="min-w-0 text-left">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#25cfff]">
                      Carte de Visite Digitale
                    </span>
                    <span className="text-[9px] font-mono text-white/70 bg-white/10 px-1.5 py-0.2 rounded">
                      .vcf
                    </span>
                  </div>
                  <h2 className="text-sm sm:text-base font-bold text-white leading-snug">
                    Enregistrer mon Contact dans votre Téléphone
                  </h2>
                  <p className="text-xs text-white/75 mt-0.5">
                    Ajoutez mon numéro direct, email et fiche pro en 1 clic.
                  </p>
                </div>
              </div>

              <div className="shrink-0">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white text-[#004d73] group-hover:bg-[#25cfff] text-xs font-semibold uppercase tracking-wider transition-all shadow-sm">
                  <span>Ajouter</span>
                  <Download className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </a>

          {/* ─────────────────────────────────────────────────────────────────
              BLOC 4 : FAIRE ESTIMER VOTRE BIEN (Étude Comparative DVF)
          ───────────────────────────────────────────────────────────────── */}
          <a
            href="https://www.iadfrance.fr/conseiller-immobilier/alexandre.lopez/estimation"
            target="_blank"
            rel="noopener noreferrer"
            className="group block relative rounded-[1.5rem] bg-white text-zinc-950 p-4.5 sm:p-5 transition-all duration-300 hover:scale-[1.015] active:scale-[0.99] shadow-lg border border-white/80"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3.5 min-w-0">
                {/* Vignette Illustration */}
                <div className="relative w-14 h-14 rounded-2xl overflow-hidden shadow-xs shrink-0 border border-zinc-200 bg-zinc-100">
                  <Image
                    src="/images/guide/solution-01-prix-juste.jpg"
                    alt="Estimation immobilière"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="56px"
                  />
                </div>

                <div className="min-w-0 text-left">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#006390] mb-0.5">
                    Étude Notariée sous 48h
                  </div>
                  <h2 className="text-sm sm:text-base font-bold text-zinc-950 group-hover:text-[#006390] transition-colors leading-snug">
                    Faire Estimer la Valeur de Votre Bien
                  </h2>
                  <p className="text-xs text-zinc-600 line-clamp-1 mt-0.5">
                    Analyse comparative fondée sur les actes réels signés dans votre quartier.
                  </p>
                </div>
              </div>

              <div className="shrink-0">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#006390]/10 text-[#006390] group-hover:bg-[#006390] group-hover:text-white transition-all">
                  <ArrowUpRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </a>

          {/* ─────────────────────────────────────────────────────────────────
              BLOC 5 : SITE INTERNET OFFICIEL
          ───────────────────────────────────────────────────────────────── */}
          <Link
            href="/"
            className="group block relative rounded-[1.5rem] bg-white text-zinc-950 p-4.5 sm:p-5 transition-all duration-300 hover:scale-[1.015] active:scale-[0.99] shadow-lg border border-white/80"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3.5 min-w-0">
                {/* Vignette Lavandes */}
                <div className="relative w-14 h-14 rounded-2xl overflow-hidden shadow-xs shrink-0 border border-zinc-200 bg-zinc-100">
                  <Image
                    src="/lavandes-proche.jpg"
                    alt="Portail officiel Alexandre Lopez"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="56px"
                  />
                </div>

                <div className="min-w-0 text-left">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#006390] mb-0.5">
                    Portail Web Officiel
                  </div>
                  <h2 className="text-sm sm:text-base font-bold text-zinc-950 group-hover:text-[#006390] transition-colors leading-snug">
                    Visiter mon Site Internet alexandrelopez.fr
                  </h2>
                  <p className="text-xs text-zinc-600 line-clamp-1 mt-0.5">
                    Repères de marché locaux, analyses juridiques et actualités immobilières.
                  </p>
                </div>
              </div>

              <div className="shrink-0">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#006390]/10 text-[#006390] group-hover:bg-[#006390] group-hover:text-white transition-all">
                  <ChevronRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </Link>

        </div>

        {/* ═════════════════════════════════════════════════════════════════════
            RÉSEAUX SOCIAUX (Instagram, LinkedIn, Facebook)
        ═════════════════════════════════════════════════════════════════════ */}
        <section className="mb-4 text-center">
          <p className="text-[11px] uppercase tracking-[0.2em] text-white/70 font-semibold mb-3">
            Retrouvez-moi sur les réseaux
          </p>
          <div className="grid grid-cols-3 gap-2.5">
            {/* Instagram */}
            <a
              href="https://www.instagram.com/alexandrelopez_iad/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-3 px-3 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/15 text-white hover:text-[#25cfff] transition-all text-xs font-semibold group active:scale-95 shadow-xs"
            >
              <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
              <span>Instagram</span>
            </a>

            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/in/alexandrelopeziad/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-3 px-3 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/15 text-white hover:text-[#25cfff] transition-all text-xs font-semibold group active:scale-95 shadow-xs"
            >
              <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
              <span>LinkedIn</span>
            </a>

            {/* Facebook */}
            <a
              href="https://www.facebook.com/alexandrelopeziad"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-3 px-3 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/15 text-white hover:text-[#25cfff] transition-all text-xs font-semibold group active:scale-95 shadow-xs"
            >
              <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
              </svg>
              <span>Facebook</span>
            </a>
          </div>
        </section>

      </main>
    </div>
  )
}
