'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ConceptMotionProvider } from '@/components/concept/ConceptMotionProvider'
import { trackEvent } from '@/lib/analytics'
import { GuideBook3DMockup } from '@/components/guide/GuideBook3DMockup'
import '@/components/concept/concept.css'
import '@/styles/design-tokens.css'

const GUIDE_CHAPTERS = [
  {
    id: 1,
    num: '01',
    shortTitle: 'Prix, DVF & Arbitrage',
    subBadge: 'Prix DVF & Bilan régulier',
    title: 'La fixation du juste prix DVF & le point régulier toutes les 3 semaines',
    badge: 'Chapitre 01 · Prix & Arbitrage',
    toolName: 'La matrice de suivi régulier & le protocole de baisse de prix',
    toolDesc: 'Comment instaurer un point d’étape régulier toutes les 3 semaines pour auditer vos statistiques d’annonces, interpréter les tendances et réajuster votre prix sans commettre les erreurs qui grillent un bien.',
    readTime: '5 min de lecture',
    image: '/images/guide/solution-01-prix-juste.jpg',
    points: [
      'Accéder aux vrais prix d’actes notariés signés dans votre rue (DVF) plutôt qu’aux prétentions affichées en vitrine.',
      'Le point d’étape régulier toutes les 3 semaines : instaurer un rituel d’analyse des statistiques (vues, favoris, appels) pour mesurer en continu la réponse du marché.',
      'Les erreurs fatales de la baisse de prix : éviter la baisse trop faible (-2 000 €) invisible pour les alertes acquéreurs, ou la baisse panique trop brutale d’un coup qui attire les offres prédatrices.',
      'Franchir les seuils psychologiques de recherche des portails pour relancer l’algorithme et réveiller les acheteurs en veille.',
    ],
  },
  {
    id: 2,
    num: '02',
    shortTitle: 'Présentation & Annonce',
    subBadge: 'Photos & Rédaction',
    title: 'La mise en scène du bien & la rédaction de l’annonce',
    badge: 'Chapitre 02 · Présentation & Annonce',
    toolName: 'Le protocole de mise en valeur & de rédaction',
    toolDesc: 'Les conseils pour réussir des clichés lumineux en lumière naturelle et rédiger un texte sincère qui déclenche le coup de cœur.',
    readTime: '5 min de lecture',
    image: '/images/guide/solution-02-mise-en-valeur.jpg',
    points: [
      'Les gestes de valorisation naturelle pour agrandir visuellement l’espace sans rien dépenser.',
      'Capter la lumière dorée du Sud pour sublimer terrasse, séjour et extérieurs.',
      'Rédiger une annonce chaleureuse qui touche la sensibilité des acquéreurs plutôt qu’un inventaire technique.',
    ],
  },
  {
    id: 3,
    num: '03',
    shortTitle: 'État du Bâti & Mairie',
    subBadge: 'Conformité & Démarches',
    title: 'L’état réel de la maison & les autorisations en mairie',
    badge: 'Chapitre 03 · Bâti & Démarches',
    toolName: 'La grille de conformité mairie & transparence',
    toolDesc: 'Le récapitulatif pour vérifier déclarations préalables (piscine, cabanon, véranda), assainissement et formuler les réserves sans risque de litige.',
    readTime: '6 min de lecture',
    image: '/images/guide/solution-05-bati-conformite.jpg',
    points: [
      'Démystifier les spécificités du Sud : fissures de sécheresse (RGA), toitures canal et humidité expliquées calmement.',
      'Vérifier les déclarations préalables en mairie : piscine, pool-house, véranda, abri de jardin et SPANC.',
      'La transparence protectrice : comment formuler les réserves chez le notaire pour annuler tout risque de recours pour vice caché.',
    ],
  },
  {
    id: 4,
    num: '04',
    shortTitle: 'Visites & Sécurité',
    subBadge: 'Qualification & Accueil',
    title: 'La qualification des acheteurs & la conduite des visites',
    badge: 'Chapitre 04 · Visites & Sérénité',
    toolName: 'Le cadrage téléphonique & la posture de visite',
    toolDesc: 'La méthode courtoise pour vérifier la maturité du projet, la capacité financière et accueillir les visiteurs en toute sécurité.',
    readTime: '4 min de lecture',
    image: '/images/guide/solution-03-visites-securite.jpg',
    points: [
      'Les questions clés au téléphone pour vérifier la solidité du projet sans jamais froisser l’interlocuteur.',
      'Valider la capacité de financement et demander une attestation de prêt avec professionnalisme.',
      'L’art du silence lors des visites : laisser les visiteurs s’approprier les lieux en protégeant son intimité.',
    ],
  },
  {
    id: 5,
    num: '05',
    shortTitle: 'Négociation & Notariat',
    subBadge: 'Offre écrite & Compromis',
    title: 'L’accord écrit, les clauses de prêt & le compromis notarié',
    badge: 'Chapitre 05 · Négociation & Notariat',
    toolName: 'Le dossier notarié complet dès le premier jour',
    toolDesc: 'La liste exacte des actes, diagnostics et attestations à réunir pour signer chez le notaire sans retard ni renégociation.',
    readTime: '5 min de lecture',
    image: '/images/guide/solution-04-dossier-notaire.jpg',
    points: [
      'Encadrer les clauses suspensives d’obtention de prêt et le montant de l’apport personnel dans l’offre écrite.',
      'Rassembler l’intégralité des pièces administratives et diagnostics dès le premier jour pour éviter les reports.',
      'Signer le compromis sans renégociation de dernière minute pour aborder l’acte authentique en toute sérénité.',
    ],
  },
]

export function GuideProLandingPage() {
  // Modal state
  const [contactOpen, setContactOpen] = useState(false)

  // Studio interactif du guide (Onglet actif 0 à 4)
  const [activeStudioTab, setActiveStudioTab] = useState(0)

  // Ouverture de la modale : on trace quel CTA a déclenché la demande de guide.
  const openGuideModal = (ctaLabel: string) => {
    trackEvent('guide_form_open', {
      cta_label: ctaLabel,
      source_path: '/guide-vendeur',
      form_location: 'modal',
    })
    setContactOpen(true)
  }

  // Form states (Modal & Footer)
  const [formData, setFormData] = useState({ prenom: '', email: '', opt_in: true })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Form states (Footer CTA)
  const [footerData, setFooterData] = useState({ prenom: '', email: '', opt_in: true })
  const [footerLoading, setFooterLoading] = useState(false)
  const [footerSubmitted, setFooterSubmitted] = useState(false)
  const [footerError, setFooterError] = useState<string | null>(null)
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const [showStickyHeader, setShowStickyHeader] = useState(false)

  // Observer de scroll pour révéler la capsule flottante en verre poli dès qu'on dépasse le Hero
  useEffect(() => {
    const handleScroll = () => {
      setShowStickyHeader(window.scrollY > 420)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Smooth scroll helper
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // Lock scroll when modal is open
  useEffect(() => {
    if (contactOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [contactOpen])

  // Lead capture handler
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (!formData.prenom.trim()) {
      setErrorMessage('Veuillez renseigner votre prénom.')
      return
    }

    if (!formData.email.trim() || !formData.email.includes('@')) {
      setErrorMessage('Veuillez renseigner une adresse email valide.')
      return
    }

    if (!formData.opt_in) {
      setErrorMessage('Veuillez accepter de recevoir le guide par email.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/guide/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prenom: formData.prenom.trim(),
          email: formData.email.trim(),
          source: 'landing_vendre_sans_agence_pro',
          opt_in: true,
        }),
      })

      const data = await res.json()
      if (res.ok && data.success) {
        trackEvent('generate_lead', {
          cta_label: 'Télécharger le guide offert',
          source_path: '/guide-vendeur',
          form_location: 'modal',
        })
        setSubmitted(true)
      } else {
        trackEvent('guide_form_error', { form_location: 'modal' })
        setErrorMessage(data.error || "Une erreur est survenue lors de l'envoi. Veuillez réessayer.")
      }
    } catch {
      setErrorMessage('Impossible de contacter le serveur. Veuillez vérifier votre connexion.')
    } finally {
      setLoading(false)
    }
  }

  const handleFooterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFooterError(null)

    if (!footerData.prenom.trim()) {
      setFooterError('Veuillez renseigner votre prénom.')
      return
    }

    if (!footerData.email.trim() || !footerData.email.includes('@')) {
      setFooterError('Veuillez renseigner une adresse email valide.')
      return
    }

    if (!footerData.opt_in) {
      setFooterError('Veuillez accepter de recevoir le guide par email.')
      return
    }

    setFooterLoading(true)
    try {
      const res = await fetch('/api/guide/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prenom: footerData.prenom.trim(),
          email: footerData.email.trim(),
          source: 'landing_vendre_sans_agence_pro_footer',
          opt_in: true,
        }),
      })

      const data = await res.json()
      if (res.ok && data.success) {
        trackEvent('generate_lead', {
          cta_label: 'Télécharger le guide offert',
          source_path: '/guide-vendeur',
          form_location: 'footer',
        })
        setFooterSubmitted(true)
      } else {
        trackEvent('guide_form_error', { form_location: 'footer' })
        setFooterError(data.error || "Une erreur est survenue lors de l'envoi. Veuillez réessayer.")
      }
    } catch {
      setFooterError('Impossible de contacter le serveur. Veuillez vérifier votre connexion.')
    } finally {
      setFooterLoading(false)
    }
  }

  return (
    <div className="concept-scope site-scope">
      {/*
        Sans JS, le moteur de reveal ne tourne pas et tout le contenu sous le
        hero reste a opacity: 0. On le rend visible d'emblée dans ce cas.
      */}
      <noscript>
        <style>{`
          .concept-scope .inview-node,
          .concept-scope .clip-mask .inner {
            opacity: 1 !important;
            transform: none !important;
          }
        `}</style>
      </noscript>

      <ConceptMotionProvider showLoader={false}>
        {/* ═════════════════════════════════════════════════════════════════════
            1. MODALE DE TÉLÉCHARGEMENT DU GUIDE (Centrée & Épurée)
        ═════════════════════════════════════════════════════════════════════ */}
        {contactOpen && (
          <div className="modal-overlay justify-center items-center p-4 sm:p-6" role="dialog" aria-modal="true">
            <div
              className="modal-backdrop"
              style={{ backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
              onClick={() => setContactOpen(false)}
            />
            <div
              className="modal-panel w-full max-h-[92svh] overflow-y-auto bg-white text-black p-6 sm:p-8 shadow-2xl rounded-3xl"
              style={{ maxWidth: '32rem' }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="eyebrow dark mb-1.5">
                    <div className="dot" />
                    Guide Pratique Offert · Provence & Côte d’Azur
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-medium tracking-tight mt-2 text-black">
                    Recevez votre guide offert
                  </h2>
                  <p className="text-xs sm:text-sm text-zinc-600 mt-1">
                    Le guide pratique pour vendre son bien sereinement en Provence & Côte d’Azur.
                  </p>
                </div>
                <button
                  className="btn-close bg-zinc-100 hover:bg-zinc-200"
                  onClick={() => setContactOpen(false)}
                  aria-label="Fermer la boîte de dialogue"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                    <path d="M6 6l12 12M18 6L6 18" />
                  </svg>
                </button>
              </div>

              {!submitted ? (
                <form onSubmit={handleContactSubmit} className="mt-6 flex flex-col gap-4" noValidate>
                  <div className="form-field">
                    <label htmlFor="m-prenom">Votre Prénom</label>
                    <input
                      type="text"
                      id="m-prenom"
                      placeholder="ex. Marc"
                      value={formData.prenom}
                      onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-field">
                    <label htmlFor="m-email">Votre Email</label>
                    <input
                      type="email"
                      id="m-email"
                      placeholder="ex. marc.dupont@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>

                  <label htmlFor="m-optin" className="consent-row flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      id="m-optin"
                      checked={formData.opt_in}
                      onChange={(e) => setFormData({ ...formData, opt_in: e.target.checked })}
                      className="mt-0.5"
                    />
                    <span className="text-xs text-zinc-500 leading-snug">
                      J’accepte de recevoir le guide et des conseils utiles par email. Aucun appel commercial masqué. Désinscription en 1 clic —{' '}
                      <Link href="/politique-confidentialite" className="underline hover:text-black">
                        Confidentialité
                      </Link>
                      .
                    </span>
                  </label>

                  {errorMessage && (
                    <p className="form-error text-xs text-red-600 font-medium" role="alert">
                      {errorMessage}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="site-btn-pill solid justify-center mt-2 w-full text-center py-3.5"
                    style={{ opacity: loading ? 0.7 : 1 }}
                  >
                    {loading ? 'Préparation de votre envoi...' : 'Télécharger le guide offert'}
                  </button>
                </form>
              ) : (
                <div className="mt-6 bg-zinc-100 p-6 rounded-2xl text-center">
                  <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center mx-auto mb-4 text-white">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="text-xl font-medium text-black">Guide envoyé à {formData.prenom} !</div>
                  <div className="text-sm text-zinc-600 mt-2 mb-6 leading-relaxed">
                    Vérifiez votre boîte de réception <strong>{formData.email}</strong>. Je reste à votre écoute si vous souhaitez échanger sur votre projet.
                  </div>
                  <div className="flex flex-col gap-2">
                    <Link
                      href="/guide-vendeur/consulter"
                      className="site-btn-pill solid justify-center py-3 text-xs"
                      onClick={() => setContactOpen(false)}
                    >
                      Consulter le guide en ligne dès maintenant →
                    </Link>
                    <button
                      type="button"
                      className="text-xs text-zinc-500 hover:text-black py-2"
                      onClick={() => {
                        setContactOpen(false)
                        setSubmitted(false)
                      }}
                    >
                      Fermer la fenêtre
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <main>
          {/* ─── CAPSULE FLOTTANTE EN VERRE POLI (FROSTED GLASS ÉPURÉ & STABLE) ─── */}
          <aside
            aria-label="Navigation rapide et téléchargement"
            className={`fixed top-3.5 sm:top-5 left-1/2 -translate-x-1/2 z-50 transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] no-print ${
              showStickyHeader
                ? 'translate-y-0 opacity-100 pointer-events-auto'
                : '-translate-y-12 opacity-0 pointer-events-none'
            }`}
            style={{
              width: 'min(94vw, 760px)',
            }}
          >
            {/* Corps de la capsule en véritable verre dépoli translucide */}
            <div
              className="relative rounded-full px-3.5 sm:px-5 py-2 sm:py-2.5 flex items-center justify-between gap-3 sm:gap-4 shadow-[0_16px_40px_-8px_rgba(0,40,62,0.2)]"
              style={{
                background: 'rgba(255, 255, 255, 0.82)',
                backdropFilter: 'blur(24px) saturate(190%)',
                WebkitBackdropFilter: 'blur(24px) saturate(190%)',
                border: '1px solid rgba(255, 255, 255, 0.7)',
                boxShadow:
                  '0 14px 36px -8px rgba(0, 48, 77, 0.16), inset 0 1.5px 1.5px 0 rgba(255, 255, 255, 0.95), inset 0 -1px 2px 0 rgba(0, 0, 0, 0.04)',
              }}
            >
              {/* Liseré supérieur satiné façon verre biseauté */}
              <div className="absolute inset-x-8 top-0 h-[1px] bg-gradient-to-r from-transparent via-white to-transparent pointer-events-none opacity-85" />

              {/* Gauche : Monogramme AL & Identité */}
              <div className="flex items-center gap-2.5 shrink-0">
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="flex items-center gap-2.5 group text-left"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#006390] to-[#003854] text-white flex items-center justify-center font-bold text-xs shadow-md border border-white/50 group-hover:scale-105 transition-transform">
                    AL
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-zinc-950 whitespace-nowrap group-hover:text-[#006390] transition-colors">
                      Alexandre Lopez
                    </div>
                    <div className="text-[10px] text-zinc-500 font-medium whitespace-nowrap hidden sm:block">
                      Guide Propriétaire Vendeur
                    </div>
                  </div>
                </button>
              </div>

              {/* Centre : Ancres de navigation fluides (parlantes pour le vendeur) */}
              <nav className="hidden sm:flex items-center gap-1 sm:gap-2 text-xs text-zinc-600 font-medium">
                <button
                  onClick={() => scrollToSection('realites')}
                  className="px-3 py-1 rounded-full hover:bg-black/5 hover:text-zinc-950 transition-colors whitespace-nowrap"
                >
                  Les 3 Difficultés
                </button>
                <button
                  onClick={() => scrollToSection('sommaire')}
                  className="px-3 py-1 rounded-full hover:bg-black/5 hover:text-zinc-950 transition-colors whitespace-nowrap"
                >
                  La Méthode
                </button>
              </nav>

              {/* Droite : Bouton CTA avec bulle de notification cyan */}
              <div className="flex items-center shrink-0">
                <button
                  onClick={() => openGuideModal('sticky_header')}
                  className="relative inline-flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full bg-[#006390] hover:bg-[#004d73] text-white text-xs font-semibold tracking-wide shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
                >
                  {/* Bulle de notification pulsante */}
                  <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-80" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#25cfff]" />
                  </span>

                  <span className="whitespace-nowrap">Recevoir le guide</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="w-3.5 h-3.5">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </button>
              </div>
            </div>
          </aside>

          {/* ═════════════════════════════════════════════════════════════════════
              HERO SECTION : L'ÎLOT SIGNATURE AUX COINS ARRONDIS (ANIMÉ SELON LES STANDARDS)
              - Bords arrondis généreux (var(--radius-card-lg, 2.5rem))
              - Pleine hauteur d'écran (100svh - 1.5rem)
              - Titre H1 animé au clip-mask
              - Éléments du hero animés avec le moteur spring (.inview-node + data-inview)
              - Zéro notation ni boîte d'avis superflue
              - Bouton CTA standardisé : « Télécharger le guide offert »
          ═════════════════════════════════════════════════════════════════════ */}
          <section
            id="guide-hero"
            className="relative overflow-hidden flex flex-col justify-between shadow-2xl"
            style={{
              background: 'radial-gradient(ellipse at 70% 30%, #004d73 0%, #00283e 100%)',
              minHeight: 'calc(100svh - 1.5rem)',
              borderRadius: 'var(--radius-card-lg, 2.5rem)',
            }}
          >
            {/* Texture photo fixe douce de Provence */}
            <div className="absolute inset-0 opacity-15 pointer-events-none mix-blend-overlay">
              <Image
                src="/images/provence-bastide-lavande.jpg"
                alt="Bastide provençale dans les oliviers et la lumière du Sud"
                fill
                className="object-cover"
                priority
              />
            </div>
            {/* Voile dégradé de profondeur */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'radial-gradient(circle at 85% 20%, rgba(37, 207, 255, 0.1) 0%, transparent 60%)',
              }}
            />

            {/* Nav Header épuré avec bouton CTA direct */}
            <header className="relative z-20 w-full px-6 sm:px-12 py-5 sm:py-6 flex justify-between items-center border-b border-white/10">
              <nav className="flex items-center gap-6 text-xs text-white/80">
                <button onClick={() => scrollToSection('realites')} className="hover:text-white transition-colors">
                  Les 3 Difficultés
                </button>
                <button onClick={() => scrollToSection('sommaire')} className="hover:text-white transition-colors">
                  La Méthode
                </button>
              </nav>

              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
                <span className="text-sm sm:text-base font-medium uppercase tracking-wider text-white">
                  Alexandre Lopez Immobilier
                </span>
              </div>

              {/* Bouton CTA d'entête accessible */}
              <div className="flex items-center justify-end">
                <button
                  onClick={() => openGuideModal('header_nav')}
                  className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 hover:bg-white/25 border border-white/20 text-xs font-medium text-white transition-all hover:scale-105"
                >
                  <span>Recevoir le guide</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </button>
              </div>
            </header>

            {/* Corps du Hero : Titre majestueux + Carte Guide avec respiration généreuse en bas */}
            <div className="relative z-10 px-6 sm:px-12 pt-6 sm:pt-10 pb-16 sm:pb-24 flex-1 flex flex-col justify-center">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                {/* Colonne Gauche : Titre et Promesse du Guide */}
                <div className="lg:col-span-7 flex flex-col items-start text-left">
                  {/* Titre H1 avec Clip Mask Reveal plus grand et impactant */}
                  <h1
                    id="guide-hero-title"
                    className="font-bold tracking-tight uppercase text-white text-left"
                    style={{
                      fontSize: 'clamp(2.35rem, 4.6vw, 3.85rem)',
                      lineHeight: 1.04,
                      letterSpacing: '-0.02em',
                      padding: 0,
                      margin: 0,
                      textAlign: 'left',
                    }}
                  >
                    <span className="clip-mask block text-left" style={{ paddingBottom: '0.1em', paddingRight: '0.25em' }}>
                      <span className="inner block text-left">Particulier,</span>
                    </span>
                    <span className="clip-mask block text-left" style={{ paddingBottom: '0.1em', paddingRight: '0.25em' }}>
                      <span className="inner block text-left">
                        Comment Vendre <span className="text-[#25cfff]">Votre Bien ?</span>
                      </span>
                    </span>
                  </h1>

                  {/* Sous-titre avec animation spring inview-node */}
                  <p
                    className="text-white/85 text-sm sm:text-base lg:text-lg mt-5 max-w-xl leading-relaxed text-left inview-node"
                    data-inview="y:24, delay:300, t:180, f:26"
                  >
                    Le <strong>guide pratique complet et 100% offert</strong> pour réussir votre vente en Provence & Côte d’Azur :
                    estimer au juste prix, valoriser simplement sans matériel pro, filtrer les acquéreurs et sécuriser chaque démarche chez le notaire.
                  </p>

                  {/* Rangée CTA animée */}
                  <div
                    className="flex flex-wrap items-center gap-4 mt-7 inview-node"
                    data-inview="y:24, delay:450, t:180, f:26"
                  >
                    <button
                      onClick={() => openGuideModal('hero_bouton_principal')}
                      className="relative site-btn-pill light py-3.5 sm:py-4 px-7 sm:px-8 text-xs sm:text-sm font-medium tracking-wider uppercase shadow-2xl hover:scale-105 transition-transform"
                    >
                      {/* Pastille de notification animée sur le bouton */}
                      <span className="absolute -top-1.5 -right-1.5 flex h-3.5 w-3.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#25cfff]" />
                      </span>

                      <span>Recevoir le guide</span>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 ml-2 inline">
                        <path d="M5 12h14M13 6l6 6-6 6" />
                      </svg>
                    </button>
                    <button
                      onClick={() => scrollToSection('sommaire')}
                      className="text-xs sm:text-sm text-white/80 hover:text-white underline underline-offset-4 py-2 px-3 transition-colors"
                    >
                      Découvrir les 5 chapitres ↓
                    </button>
                  </div>

                  {/* 2 réassurances animées statutaires */}
                  <div
                    className="flex flex-wrap items-center gap-4 sm:gap-6 mt-5 text-xs text-white/75 inview-node"
                    data-inview="y:20, delay:600, t:180, f:26"
                  >
                    <span className="flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5 text-emerald-400 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      100% Offert · Sans engagement
                    </span>
                    <span className="flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5 text-emerald-400 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Lecture simple & claire
                    </span>
                  </div>
                </div>

                {/* Colonne Droite : Véritable Modélisation 3D du Livre */}
                <div
                  className="lg:col-span-5 flex flex-col items-center justify-center inview-node"
                  data-inview="y:32, delay:350, t:200, f:26"
                >
                  <GuideBook3DMockup onOpenModal={() => openGuideModal('hero_livre_3d')} />
                </div>
              </div>
            </div>
          </section>

          {/* ═════════════════════════════════════════════════════════════════════
              SECTION 2 : LE DIAGNOSTIC (VRAIS POINTS DOULOUREUX DU VENDEUR)
              - 3 points douloureux vécus : L'Annonce Grillée, L'Invisibilité, L'Épuisement
              - Formulations percutantes et réelles
              - Passerelle fluide vers la méthode
          ═════════════════════════════════════════════════════════════════════ */}
          <section id="realites" className="site-section surface">
            <div className="site-section-inner">
              <div className="text-center max-w-3xl mx-auto">
                <div className="site-eyebrow dark inview-node -mt-2 mb-2" data-inview="y:16, delay:0">
                  <div className="dot" />
                  Le Diagnostic
                </div>
                <h2 className="site-title mt-2 inview-node" data-inview="y:20, delay:100">
                  <span className="clip-mask">
                    <span className="inner">Ce qui fait échouer ou ralentir une vente entre particuliers :</span>
                  </span>
                  <br />
                  <span className="clip-mask">
                    <span className="inner text-[#006390]">3 difficultés qui coûtent du temps, de l’énergie et de l’argent.</span>
                  </span>
                </h2>
                <p className="site-body text-zinc-600 mt-4 inview-node" data-inview="y:20, delay:200">
                  Vendre sans intermédiaire est à la portée de tous, mais sans méthode, ces trois difficultés transforment rapidement un projet de vie en parcours du combattant :
                </p>
              </div>

              {/* Grille des 3 points douloureux concrets et visuellement magnétiques */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-7 items-stretch mt-10">
                {[
                  {
                    num: '01.',
                    tag: 'La Fixation du Prix',
                    title: 'La mauvaise fixation du prix',
                    image: '/images/guide/solution-01-prix-juste.jpg',
                    lead: 'Estimer au feeling ou s’aligner sur les vitrines web surévaluées :',
                    points: [
                      { label: 'L’estimation au feeling :', desc: 'Se fier aux prix affichés en vitrine plutôt qu’aux actes notariés réellement signés.' },
                      { label: 'Le premier mois gaspillé :', desc: 'Zéro appel sérieux lors des 30 premiers jours, pourtant cruciaux pour créer l’engouement.' },
                      { label: 'L’annonce grillée :', desc: 'Le bien stagne sur les portails et vous finissez par devoir brader dans l’urgence.' },
                    ],
                  },
                  {
                    num: '02.',
                    tag: 'L’Image & l’Annonce',
                    title: 'Photos insuffisantes et annonce mal rédigée',
                    image: '/images/guide/solution-02-mise-en-valeur.jpg',
                    lead: 'Des clichés amateurs et un descriptif froid qui ne valorisent pas le bien :',
                    points: [
                      { label: 'Photos sombres ou insuffisantes :', desc: 'Des angles maladroits qui rétrécissent les pièces au lieu de révéler les volumes et la lumière.' },
                      { label: 'Le zapping en 3 secondes :', desc: 'Sur smartphone, 9 acheteurs qualifiés sur 10 passent au bien suivant sans jamais appeler.' },
                      { label: 'Une annonce noyée dans la masse :', desc: 'Un texte purement technique qui n’évoque aucune émotion et ne déclenche aucun coup de cœur.' },
                    ],
                  },
                  {
                    num: '03.',
                    tag: 'Visites & Sécurité',
                    title: 'Acheteurs non qualifiés et visites sans filtre',
                    image: '/images/guide/solution-03-visites-securite.jpg',
                    lead: 'Privilégier le volume au détriment de la qualification et de la sécurité :',
                    points: [
                      { label: 'Intrusion dans l’intimité :', desc: 'Faire entrer de parfaits inconnus chez soi sans savoir qui ils sont ni vérifier leur identité.' },
                      { label: 'Le défilé de promeneurs :', desc: 'Faire visiter des personnes qui n’ont ni budget vérifié, ni accord bancaire, ni projet immédiat.' },
                      { label: 'Visites mal exécutées :', desc: 'S’épuiser à bloquer ses week-ends et perdre des heures pour des visites sans issue et zéro offre.' },
                    ],
                  },
                ].map((card) => (
                  <article
                    key={card.num}
                    className="group bg-white rounded-[1.75rem] overflow-hidden border border-zinc-200/90 shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
                  >
                    <div className="flex-1 flex flex-col">
                      {/* Photo d'en-tête avec zoom fluide au survol */}
                      <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-zinc-100">
                        <Image
                          src={card.image}
                          alt={card.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/15 pointer-events-none" />

                        {/* Badges d'en-tête (Numéro + Tag) */}
                        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                          <span className="text-2xl font-bold text-white drop-shadow-md tracking-tight">
                            {card.num}
                          </span>
                          <span className="text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md text-white border border-white/25 font-medium shadow-sm">
                            {card.tag}
                          </span>
                        </div>
                      </div>

                      {/* Contenu textuel de la carte (Visible immédiatement, zéro friction) */}
                      <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="text-lg sm:text-xl font-bold tracking-tight text-zinc-950 mb-2 leading-snug transition-colors group-hover:text-[#006390]">
                            {card.title}
                          </h3>
                          <p className="text-xs sm:text-[13px] text-zinc-600 font-medium leading-relaxed mb-5">
                            {card.lead}
                          </p>

                          {/* 3 points de friction lisibles instantanément */}
                          <ul className="space-y-3.5 pt-4 border-t border-zinc-100">
                            {card.points.map((pt, idx) => (
                              <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-[12.5px] leading-relaxed text-zinc-600">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#006390] mt-1.5 shrink-0" />
                                <span>
                                  <strong className="text-zinc-950 font-semibold">{pt.label}</strong> {pt.desc}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {/* Passerelle vers le sommaire du guide */}
              <div className="mt-12 p-6 sm:p-7 rounded-2xl bg-white border border-zinc-200/90 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left inview-node" data-inview="y:20, delay:200">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-[#006390] mb-0.5">
                    Envie de surmonter chacune de ces difficultés ?
                  </div>
                  <div className="text-sm sm:text-base font-medium text-zinc-950">
                    Découvrez les méthodes et repères concrets détaillés dans votre livret offert
                  </div>
                </div>
                <button
                  onClick={() => scrollToSection('sommaire')}
                  className="site-btn-pill solid shrink-0 py-3.5 px-6 text-xs font-medium tracking-wider uppercase shadow-md hover:scale-105 transition-transform cursor-pointer"
                >
                  <span>Découvrir les chapitres du guide ↓</span>
                </button>
              </div>
            </div>
          </section>

          {/* ═════════════════════════════════════════════════════════════════════
              SECTION 3 : LA MÉTHODE EN 5 CHAPITRES CLÉS
              - Eyebrow : La Méthode (sans redite)
              - Titre épuré : 5 chapitres concrets pour réussir en toute autonomie
          ═════════════════════════════════════════════════════════════════════ */}
          <section id="sommaire" className="site-section light relative">
            <span id="studio-guide" className="sr-only" />
            <div className="site-section-inner">
              <div className="max-w-3xl">
                <div className="site-eyebrow dark inview-node -mt-2 mb-2" data-inview="y:16, delay:0">
                  <div className="dot" />
                  La Méthode
                </div>
                <h2 className="site-title mt-2 inview-node" data-inview="y:20, delay:100">
                  <span className="clip-mask">
                    <span className="inner">5 chapitres concrets pour réussir</span>
                  </span>
                  <br />
                  <span className="clip-mask">
                    <span className="inner text-[#006390]">votre vente en toute autonomie.</span>
                  </span>
                </h2>
                <p className="site-body text-zinc-600 mt-4 inview-node" data-inview="y:20, delay:200">
                  Consultez le détail de chaque chapitre ci-dessous pour découvrir les repères clés et méthodes pratiques abordés dans votre exemplaire :
                </p>
              </div>

              {/* Interface Interactive à 2 volets */}
              <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-7 sm:gap-8 items-start">
                {/* Colonne Gauche : Sélecteur des 5 Chapitres */}
                <div className="lg:col-span-5 flex flex-col gap-2.5">
                  {GUIDE_CHAPTERS.map((chap, idx) => {
                    const isActive = activeStudioTab === idx
                    return (
                      <button
                        key={chap.num}
                        type="button"
                        onClick={() => setActiveStudioTab(idx)}
                        className={`p-4 sm:p-5 rounded-2xl text-left transition-all duration-200 cursor-pointer flex items-center justify-between border-2 ${
                          isActive
                            ? 'bg-[#004d73] text-white border-[#25cfff] shadow-xl translate-x-1'
                            : 'bg-white text-zinc-900 border-zinc-200/85 hover:border-[#006390]/40 hover:bg-zinc-50/90 shadow-sm'
                        }`}
                      >
                        <div className="flex items-center gap-3.5 sm:gap-4">
                          <span
                            className={`text-sm sm:text-base font-bold w-7 text-center shrink-0 ${
                              isActive ? 'text-[#25cfff]' : 'text-zinc-400'
                            }`}
                          >
                            {chap.num}
                          </span>
                          <div>
                            <div className="text-xs sm:text-sm font-semibold tracking-tight leading-snug">
                              {chap.shortTitle}
                            </div>
                            <span
                              className={`inline-block mt-1 text-[10px] px-2.5 py-0.5 rounded-full font-semibold ${
                                isActive
                                  ? 'bg-white text-[#004d73] shadow-xs'
                                  : 'bg-zinc-100 text-zinc-700'
                              }`}
                            >
                              {chap.subBadge}
                            </span>
                          </div>
                        </div>

                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold transition-transform ${
                            isActive
                              ? 'bg-white text-[#004d73] translate-x-0.5 shadow-xs'
                              : 'text-zinc-400'
                          }`}
                        >
                          →
                        </div>
                      </button>
                    )
                  })}
                </div>

                {/* Colonne Droite : Grand Panneau Immersif du Chapitre Actif */}
                {(() => {
                  const current = GUIDE_CHAPTERS[activeStudioTab]
                  return (
                    <div className="lg:col-span-7 bg-white rounded-[2rem] border border-zinc-200/90 p-6 sm:p-8 shadow-xl flex flex-col justify-between transition-all duration-300">
                      <div>
                        {/* Visuel du chapitre avec bannière */}
                        <div className="relative h-48 sm:h-56 w-full rounded-2xl overflow-hidden mb-6 bg-zinc-100 shadow-inner">
                          <Image
                            src={current.image}
                            alt={current.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 1024px) 100vw, 55vw"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent" />
                          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-xs font-medium">
                            <span className="px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/20">
                              {current.badge}
                            </span>
                            <span className="px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/20">
                              ⏱️ {current.readTime}
                            </span>
                          </div>
                        </div>

                        {/* Titre complet du chapitre */}
                        <div className="flex items-center gap-2 text-xs font-semibold text-[#006390] uppercase tracking-wider mb-1.5">
                          <span>Chapitre {current.num}</span>
                          <span>·</span>
                          <span>Provence & Côte d’Azur</span>
                        </div>
                        <h3 className="text-xl sm:text-2xl font-semibold text-zinc-950 tracking-tight leading-snug mb-4">
                          {current.title}
                        </h3>

                        {/* Boîte Outil Pratique inclus avec contraste renforcé */}
                        <div className="p-4 sm:p-5 rounded-2xl bg-[#006390]/[0.07] border-2 border-[#006390]/35 mb-6">
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-[#004d73] text-white shadow-xs">
                              Outil Pratique Inclus
                            </span>
                            <span className="text-xs text-[#004d73] font-bold">
                              Dans ce chapitre
                            </span>
                          </div>
                          <div className="text-sm sm:text-base font-bold text-zinc-950 mt-1">
                            {current.toolName}
                          </div>
                          <p className="text-xs text-zinc-700 mt-1 leading-relaxed">
                            {current.toolDesc}
                          </p>
                        </div>

                        {/* Points clés développés */}
                        <div className="space-y-2.5 text-xs sm:text-sm text-zinc-700 mb-6">
                          <div className="text-xs font-semibold text-zinc-900 uppercase tracking-wider">
                            Ce que vous découvrirez dans ce chapitre :
                          </div>
                          {current.points.map((pt, pIdx) => (
                            <div key={pIdx} className="flex items-start gap-2.5">
                              <span className="w-4 h-4 rounded-full bg-[#006390]/10 text-[#006390] flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                                ✓
                              </span>
                              <span className="leading-relaxed">{pt}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Bouton CTA pour télécharger le guide complet */}
                      <div className="pt-4 border-t border-zinc-100 flex justify-end">
                        <button
                          type="button"
                          onClick={() => openGuideModal(`sommaire_chapitre_${current.num}`)}
                          className="site-btn-pill solid py-3.5 px-6 text-xs font-medium tracking-wider uppercase shadow-md hover:scale-105 transition-transform w-full sm:w-auto text-center cursor-pointer"
                        >
                          <span>Télécharger le guide complet</span>
                          <svg className="w-3.5 h-3.5 ml-2 inline" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M5 12h14M13 6l6 6-6 6" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )
                })()}
              </div>

              {/* Bandeau de réassurance sous le sommaire */}
              <div
                className="mt-12 p-6 sm:p-8 rounded-[1.75rem] bg-[#004d73] text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl inview-node"
                data-inview="y:20, delay:150"
              >
                <div className="text-center sm:text-left">
                  <div className="text-[11px] uppercase tracking-widest text-[#25cfff] font-semibold mb-1">
                    Prêt à réussir votre vente ?
                  </div>
                  <div className="text-lg sm:text-xl font-medium">
                    Retrouvez les 5 chapitres réunis dans votre livret offert
                  </div>
                  <div className="text-xs text-white/80 mt-1">
                    Repères de prix, valorisation, démarches administratives et sécurisation notariée réunis dans un document clair et complet.
                  </div>
                </div>
                <button
                  onClick={() => openGuideModal('sommaire_bas_de_section')}
                  className="site-btn-pill light shrink-0 py-3.5 px-6 text-xs sm:text-sm font-medium tracking-wider uppercase shadow-lg hover:scale-105 transition-transform cursor-pointer"
                >
                  <span>Télécharger le livret offert</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 ml-2 inline">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </button>
              </div>
            </div>
          </section>

          {/* ═════════════════════════════════════════════════════════════════════
              SECTION : « MON ENGAGEMENT » (Fond Bleu Profond #006390)
              - Silhouette d'Alexandre agrandie et calée tout en bas du conteneur
              - Eyebrow et titre sans redite
              - Bouton CTA « Télécharger le guide offert » direct
          ═════════════════════════════════════════════════════════════════════ */}
          <section
            id="confiance"
            className="site-section deep relative overflow-hidden"
            style={{ background: '#006390', color: '#ffffff', paddingBottom: 0 }}
          >
            <div className="site-section-inner relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
                {/* Silhouette détourée d'Alexandre Lopez (Calée tout en bas du conteneur) */}
                <div
                  className="lg:col-span-5 flex flex-col items-center justify-end relative inview-node self-end"
                  data-inview="y:30, delay:0, t:180, f:24"
                >
                  {/* Halo de lumière étendu et lumineux */}
                  <div
                    className="absolute inset-0 pointer-events-none rounded-full blur-3xl opacity-75"
                    style={{
                      background: 'radial-gradient(circle at 50% 60%, rgba(37, 207, 255, 0.35) 0%, rgba(0, 99, 144, 0.1) 60%, transparent 85%)',
                    }}
                  />
                  {/* Silhouette grande taille descendant jusqu'au bord inférieur */}
                  <div className="relative w-full max-w-[340px] sm:max-w-[400px] lg:max-w-[460px] h-[480px] sm:h-[540px] lg:h-[600px] flex items-end justify-center">
                    <Image
                      src="/concept/alexandre-portrait-tight.png"
                      alt="Alexandre Lopez - Conseiller immobilier en Provence & Côte d’Azur"
                      fill
                      sizes="(max-width: 640px) 340px, (max-width: 1024px) 400px, 460px"
                      className="object-contain object-bottom drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)]"
                      priority
                    />
                    {/* Badge flottant d'autorité au bas de silhouette */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 px-4 py-1.5 rounded-full bg-black/45 backdrop-blur-md border border-white/25 text-center shadow-xl whitespace-nowrap">
                      <span className="text-[10px] sm:text-xs font-medium text-white tracking-wide">
                        Alexandre Lopez · Conseiller Immobilier
                      </span>
                    </div>
                  </div>
                </div>

                {/* Explication : Mon Engagement (sans redite) */}
                <div className="lg:col-span-7 pb-12 sm:pb-16 pt-4 flex flex-col justify-center inview-node" data-inview="y:30, delay:150, t:180, f:24">
                  <div className="site-eyebrow light mb-2">
                    <div className="dot" />
                    Mon Engagement
                  </div>
                  <h2 className="site-title text-white mt-2">
                    <span className="clip-mask">
                      <span className="inner">Une démarche d’écoute</span>
                    </span>
                    <br />
                    <span className="clip-mask">
                      <span className="inner text-[#25cfff]">et de partage libre.</span>
                    </span>
                  </h2>

                  <div className="space-y-4 text-white/90 text-sm sm:text-base leading-relaxed mt-6">
                    <p>
                      En tant que conseiller immobilier en Provence & Côte d’Azur, je privilégie toujours l’écoute, la pédagogie et le partage d’expérience plutôt que les discours d’agence préformatés.
                    </p>
                    <p>
                      J’ai rédigé ce livret pour donner à chaque propriétaire les moyens de comprendre son marché, d’éviter les déconvenues et de mener son projet en toute connaissance de cause.
                    </p>
                    <p>
                      Même si vous choisissez de confier votre bien à une agence ou à un intermédiaire, ce guide vous sera précieux : il vous permet de comprendre les rouages et les spécificités du métier, de poser les bonnes questions et d’évaluer bien plus facilement la réelle efficacité des actions menées par les agents immobiliers.
                    </p>
                    <p>
                      Ce guide est un cadeau libre : il vous appartient. Si ces pages vous permettent de concrétiser votre vente sereinement et en toute autonomie, mon objectif est pleinement atteint. Et si un jour vous souhaitez un avis extérieur, une estimation affinée ou un accompagnement sur le terrain, vous saurez que ma porte vous est ouverte, en toute simplicité.
                    </p>
                  </div>

                  {/* Bouton CTA d'action directe */}
                  <div className="mt-8 pt-6 border-t border-white/20 flex flex-wrap items-center justify-between gap-4">
                    <button
                      onClick={() => openGuideModal('section_transmission')}
                      className="site-btn-pill light py-3.5 px-7 text-xs sm:text-sm font-medium tracking-wider uppercase shadow-xl hover:scale-105 transition-transform"
                    >
                      <span>Télécharger le guide offert</span>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 ml-2 inline">
                        <path d="M5 12h14M13 6l6 6-6 6" />
                      </svg>
                    </button>
                    <span className="text-xs text-white/70">
                      100% offert · Aucun engagement · Format PDF immédiat
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ═════════════════════════════════════════════════════════════════════
              SECTION 6 : FOIRE AUX QUESTIONS (DÉSAMORÇAGE DES OBJECTIONS & NURTURING)
              - 4 questions positives orientées accompagnement et transparence
              - Accordéon interactif fluide et sobre
          ═════════════════════════════════════════════════════════════════════ */}
          <section id="faq" className="site-section light">
            <div className="site-section-inner max-w-4xl mx-auto">
              <div className="text-center max-w-2xl mx-auto">
                <div className="site-eyebrow dark inview-node -mt-2 mb-2" data-inview="y:16, delay:0">
                  <div className="dot" />
                  Questions Fréquentes
                </div>
                <h2 className="site-title mt-2 inview-node" data-inview="y:20, delay:100">
                  <span className="clip-mask">
                    <span className="inner">Tout ce que vous devez savoir</span>
                  </span>
                  <br />
                  <span className="clip-mask">
                    <span className="inner text-[#006390]">avant de télécharger votre exemplaire.</span>
                  </span>
                </h2>
              </div>

              <div className="mt-10 space-y-3.5">
                {[
                  {
                    q: 'Ce livret est-il réellement 100% offert et sans engagement ?',
                    a: 'Oui, tout à fait. Votre exemplaire vous est envoyé immédiatement par email au format PDF. Il n’y a aucun frais, aucun abonnement payant, ni aucune obligation.',
                  },
                  {
                    q: 'Que vais-je recevoir après avoir téléchargé le guide ?',
                    a: 'Vous recevez immédiatement votre livret complet au format PDF dans votre boîte mail. Par la suite, je vous partagerai ponctuellement par email quelques repères de marché et des conseils pratiques pour vous accompagner à chaque étape de votre vente. Vous gardez le contrôle total : chaque email comporte un lien de désinscription en un clic.',
                  },
                  {
                    q: 'Mon bien n’est pas encore en vente ou je suis en simple réflexion, est-ce adapté ?',
                    a: 'C’est même le moment idéal. Plus vous anticipez l’analyse du marché, l’état du bâti et les vérifications administratives, plus votre vente sera sereine, rapide et maîtrisée le jour où vous déciderez de vous lancer.',
                  },
                  {
                    q: 'Pourquoi partager ce guide et ces conseils en libre accès ?',
                    a: 'Parce que je crois qu’un professionnel gagne d’abord la confiance par la preuve et le conseil utile. Que vous vendiez par vous-même ou que vous fassiez appel à une agence, ce livret vous donne toutes les clés pour comprendre les rouages du métier, poser les bonnes questions et évaluer précisément l’action des professionnels. Et si un jour vous souhaitez un avis extérieur ou un accompagnement sur le terrain, vous saurez à qui vous adresser.',
                  },
                ].map((faq, index) => {
                  const isOpen = openFaq === index
                  return (
                    <div
                      key={index}
                      className="border border-zinc-200/90 rounded-2xl overflow-hidden bg-white shadow-xs transition-all duration-200"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaq(isOpen ? null : index)}
                        className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-zinc-50/75 transition-colors"
                      >
                        <span className="text-sm sm:text-base font-semibold text-zinc-950 tracking-tight">
                          {faq.q}
                        </span>
                        <span
                          className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-sm font-bold transition-transform duration-200 ${
                            isOpen ? 'bg-[#006390] text-white rotate-45' : 'bg-zinc-100 text-zinc-600'
                          }`}
                        >
                          +
                        </span>
                      </button>
                      {isOpen && (
                        <div className="px-5 sm:px-6 pb-5 sm:pb-6 text-xs sm:text-sm text-zinc-600 leading-relaxed border-t border-zinc-100 pt-3">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </section>

          {/* ═════════════════════════════════════════════════════════════════════
              SECTION 7: FOOTER CTA (Fond Bleu Profond #006390)
              - Bouton CTA standardisé : « Télécharger le guide offert »
          ═════════════════════════════════════════════════════════════════════ */}
          <footer className="site-section deep" style={{ background: '#006390', color: '#ffffff' }}>
            <div className="site-section-inner">
              <div className="site-footer-cta light" style={{ borderBottom: 'none', paddingBottom: '2rem' }}>
                <div className="max-w-xl">
                  <div className="site-eyebrow light mb-2">
                    <div className="dot" />
                    Votre Exemplaire
                  </div>
                  <h2 className="site-title text-white mt-2">
                    Prenez le temps d’aborder votre vente
                    <br />
                    avec sérénité et clarté.
                  </h2>
                  <p className="text-white/85 text-sm mt-3 leading-relaxed">
                    Téléchargez librement votre guide pratique offert pour disposer de tous les repères utiles avant de lancer votre démarche.
                  </p>
                </div>

                {/* Formulaire Express Footer */}
                <div className="w-full max-w-md bg-white/10 border border-white/20 p-5 sm:p-6 rounded-2xl backdrop-blur-md">
                  {!footerSubmitted ? (
                    <form onSubmit={handleFooterSubmit} className="flex flex-col gap-3.5" noValidate>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <input
                          type="text"
                          placeholder="Votre Prénom"
                          value={footerData.prenom}
                          onChange={(e) => setFooterData({ ...footerData, prenom: e.target.value })}
                          className="w-full px-3.5 py-3 rounded-xl bg-white/15 border border-white/25 text-white placeholder-white/60 text-xs focus:outline-none focus:border-[#25cfff]"
                          required
                        />
                        <input
                          type="email"
                          placeholder="Votre Email"
                          value={footerData.email}
                          onChange={(e) => setFooterData({ ...footerData, email: e.target.value })}
                          className="w-full px-3.5 py-3 rounded-xl bg-white/15 border border-white/25 text-white placeholder-white/60 text-xs focus:outline-none focus:border-[#25cfff]"
                          required
                        />
                      </div>

                      {footerError && (
                        <p className="text-xs text-red-300 font-medium" role="alert">
                          {footerError}
                        </p>
                      )}

                      <button
                        type="submit"
                        disabled={footerLoading}
                        className="site-btn-pill light justify-center w-full py-3.5 text-xs font-medium tracking-wider uppercase shadow-lg hover:scale-[1.02] transition-transform"
                        style={{ opacity: footerLoading ? 0.7 : 1 }}
                      >
                        {footerLoading ? 'Préparation...' : 'Télécharger le guide offert'}
                      </button>
                    </form>
                  ) : (
                    <div className="text-center py-3">
                      <div className="text-sm font-medium text-white">Guide envoyé à {footerData.prenom} !</div>
                      <Link
                        href="/guide-vendeur/consulter"
                        className="inline-block text-xs text-[#25cfff] underline mt-2 hover:text-white"
                      >
                        Consulter le guide en ligne →
                      </Link>
                    </div>
                  )}
                </div>
              </div>

              {/* Mentions et crédits légaux avec ligne séparatrice unique */}
              <div className="pt-6 mt-4 border-t border-white/15 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-white/60">
                <div>
                  © {new Date().getFullYear()} Alexandre Lopez Immobilier · Conseiller en Provence & Côte d’Azur. Tous droits réservés.
                </div>
                <div className="flex items-center gap-5">
                  <Link href="/mentions-legales" className="hover:text-white transition-colors">
                    Mentions légales
                  </Link>
                  <Link href="/politique-confidentialite" className="hover:text-white transition-colors">
                    Confidentialité
                  </Link>
                </div>
              </div>
            </div>
          </footer>
        </main>
      </ConceptMotionProvider>
    </div>
  )
}
