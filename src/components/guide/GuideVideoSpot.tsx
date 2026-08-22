'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Play,
  X,
  Clock,
  Sparkles,
  CheckCircle2,
  Download,
  ShieldCheck,
} from 'lucide-react'

interface GuideVideoSpotProps {
  onOpenDownloadModal?: () => void
  videoUrl?: string
  videoTitle?: string
}

export function GuideVideoSpot({
  onOpenDownloadModal,
  videoUrl,
  videoTitle = 'Comment réussir votre vente immobilière entre particuliers en Provence',
}: GuideVideoSpotProps) {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false)

  // URL vidéo par défaut ou personnalisée (supporte embed YouTube, Vimeo, ou lecteur local)
  const effectiveVideoEmbed =
    videoUrl ||
    'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0' // Placeholder remplaçable facilement

  return (
    <div className="w-full">
      {/* ─── CARTOUCHE VIDÉO PRINCIPALE ─── */}
      <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-white p-6 sm:p-8 md:p-10 shadow-[0_20px_50px_rgba(0,119,182,0.08)]">
        {/* Halo décoratif subtil */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand-light/50 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-surface-alt/60 blur-3xl" />

        <div className="relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          {/* 1. Vignette Vidéo Interactive avec bouton Play pulsant */}
          <div className="relative group cursor-pointer" onClick={() => setIsVideoModalOpen(true)}>
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-slate-900 shadow-xl ring-1 ring-black/10">
              {/* Image de couverture vidéo */}
              <Image
                src="/village-cotignac.jpg"
                alt="Vidéo de présentation du Guide Vendeur Particulier"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105 brightness-[82%]"
              />

              {/* Overlay dégradé */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />

              {/* Badge durée en haut à gauche */}
              <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md border border-white/20">
                <Clock className="h-3.5 w-3.5 text-brand-light" />
                <span>2 min 15</span>
              </div>

              {/* Badge présence Alexandre en haut à droite */}
              <div className="absolute top-4 right-4 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-foreground shadow-md backdrop-blur-md">
                <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
                <span>Conseil Terrain</span>
              </div>

              {/* Bouton Play Central Animé */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative flex items-center justify-center">
                  {/* Cercles de pulsation */}
                  <span className="absolute h-20 w-20 rounded-full bg-brand/40 animate-ping" />
                  <span className="absolute h-24 w-24 rounded-full bg-brand/20 animate-pulse" />
                  
                  {/* Bouton rond principal */}
                  <div className="relative flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-brand text-white shadow-[0_10px_30px_rgba(0,119,182,0.6)] transition-all duration-300 group-hover:scale-110 group-hover:bg-brand-hover">
                    <Play className="h-7 w-7 sm:h-8 sm:w-8 translate-x-0.5 fill-current" />
                  </div>
                </div>
              </div>

              {/* Bandeau bas de vidéo */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                <div className="flex items-center gap-2.5">
                  <div className="relative h-9 w-9 overflow-hidden rounded-full border-2 border-white shadow-md">
                    <Image
                      src="/alexandre-lopez-face.jpg"
                      alt="Alexandre Lopez"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white drop-shadow-sm">Alexandre Lopez</p>
                    <p className="text-[11px] text-white/80">Conseiller en immobilier iad Provence</p>
                  </div>
                </div>
                <span className="hidden sm:inline-flex text-[11px] font-medium bg-white/20 px-2.5 py-1 rounded-md backdrop-blur-xs text-white">
                  Cliquez pour regarder
                </span>
              </div>
            </div>
          </div>

          {/* 2. Texte Explicatif & Arguments Pédagogiques */}
          <div className="flex flex-col justify-between space-y-5">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-brand-light px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-brand">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Message vidéo d’Alexandre</span>
              </div>

              <h3 className="mt-3 text-xl sm:text-2xl font-bold tracking-tight text-foreground leading-tight">
                Pourquoi 2 ventes entre particuliers sur 3 échouent avant la signature
              </h3>

              <p className="mt-2.5 text-sm leading-relaxed text-muted">
                Dans cette courte vidéo, je vous explique sans langue de bois les 3 pièges méconnus du marché varois et comment les checklists du guide vous protègent.
              </p>
            </div>

            {/* 3 Clés abordées dans la vidéo */}
            <div className="space-y-2.5 pt-1">
              <div className="flex items-start gap-3 text-xs sm:text-sm text-foreground">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-brand mt-0.5" />
                <span><strong>L’illusion du prix d’annonce :</strong> pourquoi les prix affichés sur LeBonCoin faussent votre stratégie et comment utiliser les vraies ventes DVF.</span>
              </div>
              <div className="flex items-start gap-3 text-xs sm:text-sm text-foreground">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-brand mt-0.5" />
                <span><strong>Le script de qualification :</strong> les 4 questions pour écarter les curieux et les faux acquéreurs dès le premier appel.</span>
              </div>
              <div className="flex items-start gap-3 text-xs sm:text-sm text-foreground">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-brand mt-0.5" />
                <span><strong>La sécurité juridique :</strong> les documents cruciaux (SPANC, diagnostics) pour éviter toute clause suspensive piégeuse.</span>
              </div>
            </div>

            {/* Boutons d'action sous la vidéo */}
            <div className="pt-3 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setIsVideoModalOpen(true)}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-5 py-3 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-brand-hover transition-all"
              >
                <Play className="h-4 w-4 fill-current" />
                <span>Lancer la vidéo (2 min)</span>
              </button>

              {onOpenDownloadModal && (
                <button
                  type="button"
                  onClick={onOpenDownloadModal}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-surface px-5 py-3 text-xs sm:text-sm font-bold text-foreground hover:bg-white transition-all"
                >
                  <Download className="h-4 w-4 text-brand" />
                  <span>Télécharger le Guide direct</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ─── MODAL LECTEUR VIDÉO PLEIN ÉCRAN ─── */}
      <AnimatePresence>
        {isVideoModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-10">
            {/* Backdrop sombre avec flou */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsVideoModalOpen(false)}
              className="absolute inset-0 bg-black/85 backdrop-blur-md"
            />

            {/* Conteneur de la modale */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-4xl overflow-hidden rounded-3xl bg-[#0F172A] border border-white/10 shadow-2xl z-10"
            >
              {/* Header de la modale vidéo */}
              <div className="flex items-center justify-between border-b border-white/10 px-6 py-4 text-white">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-brand animate-pulse" />
                  <span className="text-sm font-bold truncate max-w-[280px] sm:max-w-md">
                    {videoTitle}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setIsVideoModalOpen(false)}
                  className="rounded-full p-2 text-white/70 hover:bg-white/10 hover:text-white transition-colors"
                  aria-label="Fermer la vidéo"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Corps vidéo (Lecteur / Présentation) */}
              <div className="relative aspect-video w-full bg-black">
                {videoUrl ? (
                  <iframe
                    src={effectiveVideoEmbed}
                    title={videoTitle}
                    className="h-full w-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  /* Lecteur interactif enrichi avec message d'Alexandre */
                  <div className="relative h-full w-full flex flex-col items-center justify-center p-6 text-center text-white bg-gradient-to-br from-slate-900 via-[#004B73] to-slate-900">
                    <div className="relative h-20 w-20 overflow-hidden rounded-full border-4 border-brand-light shadow-2xl mb-4">
                      <Image
                        src="/alexandre-lopez-face.jpg"
                        alt="Alexandre Lopez"
                        fill
                        className="object-cover"
                      />
                    </div>
                    
                    <span className="rounded-full bg-brand px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-white mb-2">
                      Message d'accueil d’Alexandre Lopez
                    </span>

                    <h4 className="text-xl sm:text-2xl font-bold max-w-lg mb-2">
                      « Bienvenue ! Ce guide a été pensé pour vous donner les mêmes outils que les professionnels. »
                    </h4>

                    <p className="text-sm text-white/80 max-w-md mb-6">
                      Découvrez les 41 planches de méthode, la grille de qualification des acheteurs et les fiches A4 imprimables.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3">
                      {onOpenDownloadModal && (
                        <button
                          type="button"
                          onClick={() => {
                            setIsVideoModalOpen(false)
                            onOpenDownloadModal()
                          }}
                          className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-bold text-white shadow-lg hover:bg-brand-hover transition-all"
                        >
                          <Download className="h-4 w-4" />
                          <span>Recevoir le Guide PDF Gratuit</span>
                        </button>
                      )}
                      <a
                        href="/guide-vendeur"
                        className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-bold text-white hover:bg-white/20 transition-all backdrop-blur-xs"
                      >
                        <span>Feuilleter l'édition en ligne</span>
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer de la modale */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/90 px-6 py-4 text-xs text-white/80 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-brand-light" />
                  <span>Alexandre Lopez · Conseiller en immobilier iad Provence Verte & Verdon</span>
                </div>
                <div className="text-white/60">
                  Besoin d’un conseil direct ? <a href="tel:+33613180168" className="text-brand-light font-bold hover:underline">06 13 18 01 68</a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
