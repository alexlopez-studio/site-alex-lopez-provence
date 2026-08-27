'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Download,
  BookOpen,
  AlertTriangle,
  Users,
  TrendingUp,
  ShieldCheck,
  Star,
  Phone,
  Mail,
  ChevronDown,
  Sparkles,
  MapPin,
  BadgeCheck,
  Eye,
  Check,
  Loader2,
  ArrowRight,
  Sliders,
  Award,
  Leaf,
  Compass,
  FileText,
} from 'lucide-react'
import { GuideVideoSpot } from './GuideVideoSpot'
import { GuideDownloadModal } from './GuideDownloadModal'
import { Interactive3DBookMockup } from './Interactive3DBookMockup'
import { InteractiveBeforeAfterSlider } from './InteractiveBeforeAfterSlider'
import { AnimatedCounter } from './AnimatedCounter'
import { SmartStickyCtaBar } from './SmartStickyCtaBar'
import { HeroVideoBackground } from './HeroVideoBackground'

const PHONE_RAW = '+33613180168'
const PHONE_DISPLAY = '06 13 18 01 68'
const EMAIL = 'alex@alexlopez-provence.fr'

// ─── 1. LES 6 ÉTAPES SIMPLES DU GUIDE (41 FICHES PRÊTES À L'EMPLOI) ───
const BOTANICAL_MODULES = [
  {
    num: '01',
    title: 'Mettre en valeur sa maison (sans rien dépenser)',
    pages: 'Fiches 07 – 13',
    summary: '20 astuces simples et naturelles pour désencombrer, faire entrer la lumière et déclencher le coup de cœur dès la première seconde.',
    tag: 'Astuces Déco & Lumière',
    icon: Sparkles,
  },
  {
    num: '02',
    title: 'Fixer le bon prix dès le départ',
    pages: 'Fiches 14 – 18',
    summary: 'La méthode simple pour connaître les vrais prix des maisons vendues dans votre village, sans sous-estimer ni faire fuir les acheteurs sérieux.',
    tag: 'Le Vrai Prix du Marché',
    icon: TrendingUp,
  },
  {
    num: '03',
    title: 'Des photos qui donnent envie et une belle annonce',
    pages: 'Fiches 19 – 23',
    summary: 'Les 5 angles photo indispensables avec votre smartphone et le modèle de texte qui attire les bons acheteurs.',
    tag: 'Photos & Annonce',
    icon: Eye,
  },
  {
    num: '04',
    title: 'Filtrer les curieux en 4 questions au téléphone',
    pages: 'Fiches 24 – 27',
    summary: 'Le petit questionnaire bienveillant pour savoir si l’acheteur a vraiment le budget avant de lui ouvrir la porte de chez vous.',
    tag: 'Zéro Perte de Temps',
    icon: Users,
  },
  {
    num: '05',
    title: 'Défendre son prix et refuser les offres au rabais',
    pages: 'Fiches 28 – 32',
    summary: 'Les réponses calmes et prêtes à l’emploi face aux acheteurs qui tentent de baisser votre prix de 30 000 €.',
    tag: 'Protéger votre Argent',
    icon: ShieldCheck,
  },
  {
    num: '06',
    title: 'Tous les papiers pour le notaire sans mauvaise surprise',
    pages: 'Fiches 33 – 41',
    summary: 'La liste à cocher des documents obligatoires (diagnostics, fosse septique, factures) pour signer en toute tranquillité.',
    tag: 'Tranquillité Notaire',
    icon: Award,
  },
]

// ─── 2. TÉMOIGNAGES DE PROPRIÉTAIRES DU COIN ───
const BOTANICAL_TESTIMONIALS = [
  {
    author: 'Michel & Christine B.',
    commune: 'Cotignac (83570)',
    type: 'Maison de village avec terrasse',
    text: '« Nous étions fatigués de faire visiter à des curieux le weekend. Grâce aux 4 questions à poser au téléphone, nous avons sélectionné 2 vrais acheteurs et vendu en 3 semaines sans baisser notre prix. Un guide clair et gratuit, merci ! »',
    rating: 5,
  },
  {
    author: 'Patrick V.',
    commune: 'Brignoles (83170)',
    type: 'Villa avec jardin et piscine',
    text: '« Les fiches sont directes et sans blabla. Les conseils pour les photos ont transformé notre annonce. Nous avons eu 3 appels sérieux dès le premier jour. »',
    rating: 5,
  },
  {
    author: 'Nathalie D.',
    commune: 'Saint-Maximin (83470)',
    type: 'Maison familiale',
    text: '« La liste des papiers pour le notaire nous a évité un gros blocage avec la fosse septique. Tout est expliqué simplement, c’est rassurant d’avoir ce document sous la main. »',
    rating: 5,
  },
]

// ─── 3. QUESTIONS FRÉQUENTES (RÉPONSES SANS DÉTOUR) ───
const BOTANICAL_FAQS = [
  {
    q: 'Pourquoi ce guide complet est-il 100% gratuit ?',
    a: 'Parce que je vis et travaille ici en Provence. Je préfère aider les propriétaires de ma région avec des conseils concrets. Si vous réussissez votre vente tout seul grâce au guide, j’en serai très heureux. Et si un jour vous avez une question, vous saurez à qui vous adresser en toute confiance.',
  },
  {
    q: 'Je vends seul : vais-je être harcelé au téléphone ?',
    a: 'Non, absolument pas. Vous recevez simplement votre guide par email ou téléchargement direct. Vos coordonnées restent privées et vous ne recevrez aucun appel de démarchage.',
  },
  {
    q: 'Les conseils sont-ils faciles à appliquer pour un particulier ?',
    a: 'Oui, c’est le but ! Tout a été rédigé sous forme de fiches pratiques et de listes à cocher simples, sans jargon d’agence ni calculs compliqués.',
  },
]

export function BotanicalGuideLandingPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0)

  // Formulaire final
  const [bottomFormData, setBottomFormData] = useState({
    prenom: '',
    nom: '',
    email: '',
    telephone: '',
    commune: '',
    opt_in: true,
  })
  const [bottomLoading, setBottomLoading] = useState(false)
  const [bottomSubmitted, setBottomSubmitted] = useState(false)
  const [bottomError, setBottomError] = useState<string | null>(null)

  const handleBottomSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setBottomError(null)

    if (!bottomFormData.email || !bottomFormData.email.includes('@')) {
      setBottomError('Veuillez renseigner une adresse email valide.')
      return
    }

    if (!bottomFormData.opt_in) {
      setBottomError('Veuillez accepter de recevoir le guide par email.')
      return
    }

    setBottomLoading(true)
    try {
      const res = await fetch('/api/guide/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...bottomFormData,
          source: 'botanical_landing_form',
        }),
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setBottomSubmitted(true)
      } else {
        setBottomError(data.error || 'Une erreur est survenue. Veuillez réessayer.')
      }
    } catch {
      setBottomError('Erreur de connexion. Veuillez vérifier votre réseau.')
    } finally {
      setBottomLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen bg-[#F9F8F4] text-[#0F172A] font-sans antialiased selection:bg-[#0077B6] selection:text-white pb-24">
      {/* ─── 0. MANDATORY PAPER GRAIN TEXTURE (TACTILE FEEL) ─── */}
      <div
        className="pointer-events-none fixed inset-0 z-50 opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
        }}
      />

      {/* ─── BARRE FLOTTANTE INTELLIGENTE ─── */}
      <SmartStickyCtaBar onOpenModal={() => setIsModalOpen(true)} />

      {/* ─── MODAL TÉLÉCHARGEMENT RAPIDE ─── */}
      <GuideDownloadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        source="botanical_landing_cta"
      />

      {/* ─── NAVIGATION ÉDITORIALE ARTISANALE ─── */}
      <header className="sticky top-0 z-40 bg-[#F9F8F4]/90 backdrop-blur-md border-b border-[#E6E2DA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3.5 group">
            <span className="font-playfair text-2xl sm:text-3xl font-semibold tracking-tight text-[#0F172A] group-hover:text-[#0077B6] transition-colors">
              Alexandre Lopez
            </span>
            <span className="hidden sm:inline-block h-4 w-px bg-[#E6E2DA]" />
            <span className="hidden sm:inline-block text-[11px] font-bold uppercase tracking-[0.2em] text-[#64748B]">
              Édition Propriétaire
            </span>
          </Link>

          <div className="flex items-center gap-5">
            <Link
              href="/guide-vendeur"
              className="hidden md:inline-flex items-center gap-1.5 text-xs font-semibold text-[#0077B6] hover:text-[#005f92] transition-colors"
            >
              <Eye className="h-3.5 w-3.5" />
              <span>Feuilleter l'exemplaire A4</span>
            </Link>

            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="group relative inline-flex items-center gap-2 rounded-full bg-[#0F172A] px-6 py-3 text-xs font-bold uppercase tracking-widest text-white shadow-sm hover:bg-[#0077B6] active:scale-[0.98] transition-all duration-300"
            >
              <span>Recevoir le Guide</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* ─── 1. HERO ARCH & PROMESSE (PLAYFAIR TYPOGRAPHY & ROMAN ARCH) ─── */}
        <section className="relative overflow-hidden pt-12 sm:pt-20 pb-20 sm:pb-32 border-b border-[#E6E2DA]">
          {/* ─── ARRIÈRE-PLAN VIDÉO IMMOBILIÈRE CINÉMATIQUE ─── */}
          <HeroVideoBackground />

          {/* Ligne décorative fluide en arrière-plan */}
          <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] rounded-full bg-[#E0F0FA]/30 blur-3xl -z-10" />

          <div className="max-w-7xl mx-auto px-4 sm:px-8">
            <div className="grid gap-14 lg:grid-cols-[1.1fr_0.9fr] items-center">
              {/* Colonne Gauche : Typographie & Promesse */}
              <div className="space-y-7 text-center lg:text-left">
                {/* Eyebrow Pill */}
                <div className="inline-flex items-center gap-2 rounded-full bg-[#E0F0FA] px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.22em] text-[#00B4EC] border border-[#00B4EC]/15">
                  <MapPin className="h-3.5 w-3.5 text-[#EA584A]" />
                  <span>Guide Gratuit du Propriétaire · Provence Verte & Verdon</span>
                </div>

                {/* Titre Principal — Simple, percutant et sans jargon */}
                <h1 className="font-playfair text-4xl sm:text-6xl lg:text-7xl font-semibold text-[#0F172A] tracking-tight leading-[1.08]">
                  Vous vendez entre particuliers ? <em className="font-normal italic text-[#00B4EC]">Voici comment réussir</em> sans brader votre maison.
                </h1>

                {/* Sous-promesse accessible et bienveillante */}
                <p className="font-source text-base sm:text-xl text-[#475569] leading-relaxed max-w-2xl mx-auto lg:mx-0 font-normal">
                  Le manuel pratique en <strong>41 fiches simples</strong> : fixez le bon prix, filtrez les curieux au téléphone en 4 questions et signez chez le notaire les yeux fermés. <strong>100% offert et prêt à l'emploi.</strong>
                </p>

                {/* Double CTA Pill & Signature 10° Slanted Coral Pill (Charte iad Page 22) */}
                <div className="pt-3 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-5">
                  {/* Gélule Corail Inclinée à 10° — Signature de la Charte Graphique iad */}
                  <div className="relative inline-block rotate-[-2deg] sm:rotate-[-3deg] hover:rotate-0 transition-transform duration-300">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(true)}
                      className="group relative inline-flex items-center justify-center gap-3 rounded-full bg-[#EA584A] px-9 py-4.5 text-sm sm:text-base font-extrabold italic text-white shadow-[0_12px_28px_rgba(234,88,74,0.38)] hover:bg-[#D94535] hover:shadow-[0_16px_36px_rgba(234,88,74,0.48)] active:scale-[0.98] transition-all duration-300"
                      style={{ letterSpacing: '-0.025em' }}
                    >
                      <span className="font-montserrat font-black italic uppercase">
                        Télécharger le Guide Gratuit !
                      </span>
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/25 text-white transition-transform group-hover:translate-x-1">
                        <Download className="h-4 w-4" />
                      </span>
                    </button>
                  </div>

                  <Link
                    href="/guide-vendeur"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-[#0F172A]/20 bg-white/80 backdrop-blur-sm px-7 py-4 text-xs sm:text-sm font-bold uppercase tracking-widest text-[#0F172A] hover:border-[#00B4EC] hover:text-[#00B4EC] transition-all duration-300 hover:-translate-y-0.5"
                  >
                    <BookOpen className="h-4 w-4 text-[#00B4EC]" />
                    <span>Feuilleter en ligne</span>
                  </Link>
                </div>

                {/* Badges de réassurance simples */}
                <div className="pt-3 flex flex-wrap items-center justify-center lg:justify-start gap-y-2 gap-x-6 text-xs text-[#64748B]">
                  <span className="flex items-center gap-1.5">
                    <Leaf className="h-3.5 w-3.5 text-[#00B4EC]" /> 41 Fiches Faciles à Suivre
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Leaf className="h-3.5 w-3.5 text-[#00B4EC]" /> Zéro Appel Commercial
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Leaf className="h-3.5 w-3.5 text-[#00B4EC]" /> 100% Gratuit & Immédiat
                  </span>
                </div>
              </div>

              {/* Colonne Droite : Cadre Roman Arch & Mockup 3D */}
              <div className="relative mx-auto w-full flex justify-center">
                {/* Arche Romaine Architecturale en arrière-plan */}
                <div className="relative rounded-t-[180px] sm:rounded-t-[220px] rounded-b-3xl bg-gradient-to-b from-[#E0F0FA]/60 via-white to-white p-4 sm:p-6 border border-[#E6E2DA] shadow-xl">
                  <Interactive3DBookMockup onOpenModal={() => setIsModalOpen(true)} />
                </div>
              </div>
            </div>

            {/* ─── EMPLACEMENT VIDÉO BOTANIQUE INTÉGRÉ AU HERO ─── */}
            <div className="mt-16 sm:mt-24">
              <GuideVideoSpot onOpenDownloadModal={() => setIsModalOpen(true)} />
            </div>
          </div>
        </section>

        {/* ─── 2. LES POINTS DOULOUREUX (LA VRAIE VIE DU VENDEUR SEUL) ─── */}
        <section className="py-20 sm:py-32 bg-white px-4 sm:px-8 border-b border-[#E6E2DA]">
          <div className="max-w-6xl mx-auto space-y-16">
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FEE2E2] px-4 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-[#EF4444]">
                <AlertTriangle className="h-3 w-3" />
                La réalité du terrain
              </span>
              <h2 className="font-playfair text-3xl sm:text-5xl font-semibold text-[#0F172A] tracking-tight">
                Vendre seul : <em className="italic font-normal">les 4 galères</em> que l'on découvre dès la première semaine
              </h2>
              <p className="font-source text-base sm:text-lg text-[#64748B]">
                Vous avez mis votre maison en vente vous-même pour préserver votre argent. C’est tout à fait normal. Mais sur le terrain, voici ce qui arrive souvent :
              </p>
            </div>

            {/* Grille Asymétrique des 4 points douloureux */}
            <div className="grid gap-8 sm:grid-cols-2">
              {/* Carte 1 */}
              <div className="rounded-3xl bg-[#F9F8F4] p-8 sm:p-10 border border-[#E6E2DA] shadow-xs hover:border-[#00B4EC]/30 transition-all duration-500 hover:-translate-y-1">
                <span className="font-playfair text-3xl font-bold text-[#EA584A] block mb-3">01.</span>
                <h3 className="font-playfair text-xl font-bold text-[#0F172A] mb-2.5">
                  Le téléphone qui sonne pour du démarchage
                </h3>
                <p className="font-source text-sm text-[#64748B] leading-relaxed">
                  À peine l’annonce en ligne sur LeBonCoin, vous recevez 10 appels d’agences insistantes pour 1 seul acheteur réel. C’est fatiguant et vous perdez patience.
                </p>
              </div>

              {/* Carte 2 (Décalée) */}
              <div className="md:translate-y-8 rounded-3xl bg-[#F9F8F4] p-8 sm:p-10 border border-[#E6E2DA] shadow-xs hover:border-[#00B4EC]/30 transition-all duration-500 hover:-translate-y-1">
                <span className="font-playfair text-3xl font-bold text-[#EA584A] block mb-3">02.</span>
                <h3 className="font-playfair text-xl font-bold text-[#0F172A] mb-2.5">
                  Le défilé des curieux du dimanche
                </h3>
                <p className="font-source text-sm text-[#64748B] leading-relaxed">
                  Bloquer ses samedis pour faire visiter à des gens qui « se promènent », qui n'ont pas encore vendu leur appartement ou qui n'ont même pas l'argent.
                </p>
              </div>

              {/* Carte 3 */}
              <div className="rounded-3xl bg-[#F9F8F4] p-8 sm:p-10 border border-[#E6E2DA] shadow-xs hover:border-[#00B4EC]/30 transition-all duration-500 hover:-translate-y-1">
                <span className="font-playfair text-3xl font-bold text-[#EA584A] block mb-3">03.</span>
                <h3 className="font-playfair text-xl font-bold text-[#0F172A] mb-2.5">
                  Les offres au rabais qui énervent
                </h3>
                <p className="font-source text-sm text-[#64748B] leading-relaxed">
                  Des visiteurs qui critiquent la peinture ou la cuisine pour vous demander -30 000 € ou -50 000 € d'un coup, sans savoir quoi leur répondre calmement.
                </p>
              </div>

              {/* Carte 4 (Décalée) */}
              <div className="md:translate-y-8 rounded-3xl bg-[#F9F8F4] p-8 sm:p-10 border border-[#E6E2DA] shadow-xs hover:border-[#00B4EC]/30 transition-all duration-500 hover:-translate-y-1">
                <span className="font-playfair text-3xl font-bold text-[#EA584A] block mb-3">04.</span>
                <h3 className="font-playfair text-xl font-bold text-[#0F172A] mb-2.5">
                  L’angoisse du prêt refusé après 45 jours
                </h3>
                <p className="font-source text-sm text-[#64748B] leading-relaxed">
                  Signer un compromis, attendre 1 mois et demi plein d’espoir, et apprendre au dernier moment que la banque refuse le crédit. Il faut tout recommencer à zéro.
                </p>
              </div>
            </div>

            {/* Phrase de transition chaleureuse */}
            <div className="pt-8 text-center max-w-xl mx-auto">
              <p className="font-source text-base font-semibold text-[#0F172A] bg-[#E0F0FA] py-3 px-6 rounded-full inline-block">
                💡 Rassurez-vous : il existe une méthode simple pour éviter chacun de ces 4 pièges.
              </p>
            </div>
          </div>
        </section>

        {/* ─── 3. LA SOLUTION SUR UN PLATEAU (LES 3 ÉTAPES FACILES) ─── */}
        <section className="py-20 sm:py-32 bg-[#F9F8F4] px-4 sm:px-8 border-b border-[#E6E2DA]">
          <div className="max-w-6xl mx-auto space-y-16">
            <div className="text-center space-y-4 max-w-2xl mx-auto">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E0F0FA] px-4 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-[#00B4EC]">
                <Sparkles className="h-3 w-3 text-[#EA584A]" />
                La solution facile
              </span>
              <h2 className="font-playfair text-3xl sm:text-5xl font-semibold text-[#0F172A] tracking-tight">
                3 réflexes simples pour vendre sans stress et au bon prix
              </h2>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {/* Pilier 1 */}
              <div className="rounded-3xl bg-white p-8 sm:p-10 border border-[#E6E2DA] shadow-xs flex flex-col justify-between hover:shadow-md transition-all duration-500">
                <div className="space-y-4">
                  <div className="h-12 w-12 rounded-2xl bg-[#E0F0FA] text-[#00B4EC] flex items-center justify-center">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                  <h3 className="font-playfair text-xl font-bold text-[#0F172A]">
                    1. Fixer le bon prix dès le départ
                  </h3>
                  <p className="font-source text-sm text-[#64748B] leading-relaxed">
                    Découvrez les vrais prix des maisons vendues récemment dans votre village pour ne pas brader votre bien ni faire fuir les acheteurs sérieux.
                  </p>
                </div>
                <div className="mt-8 pt-4 border-t border-[#E6E2DA] text-xs font-bold uppercase tracking-wider text-[#00B4EC] flex items-center gap-1.5">
                  <Check className="h-4 w-4 stroke-[2.5]" /> Vendre sans décote
                </div>
              </div>

              {/* Pilier 2 (Mis en avant) */}
              <div className="md:-translate-y-4 rounded-3xl bg-white p-8 sm:p-10 border-2 border-[#00B4EC]/40 shadow-lg flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="h-12 w-12 rounded-2xl bg-[#00B4EC] text-white flex items-center justify-center shadow-md">
                    <Users className="h-6 w-6" />
                  </div>
                  <h3 className="font-playfair text-xl font-bold text-[#0F172A]">
                    2. Les 4 questions à poser au téléphone
                  </h3>
                  <p className="font-source text-sm text-[#64748B] leading-relaxed">
                    Un petit script simple et poli pour vérifier si le visiteur a vraiment le budget avant de lui ouvrir la porte de votre maison.
                  </p>
                </div>
                <div className="mt-8 pt-4 border-t border-[#E6E2DA] text-xs font-bold uppercase tracking-wider text-[#00B4EC] flex items-center gap-1.5">
                  <Check className="h-4 w-4 stroke-[2.5]" /> 100% de visites utiles
                </div>
              </div>

              {/* Pilier 3 */}
              <div className="rounded-3xl bg-white p-8 sm:p-10 border border-[#E6E2DA] shadow-xs flex flex-col justify-between hover:shadow-md transition-all duration-500">
                <div className="space-y-4">
                  <div className="h-12 w-12 rounded-2xl bg-[#E0F0FA] text-[#00B4EC] flex items-center justify-center">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <h3 className="font-playfair text-xl font-bold text-[#0F172A]">
                    3. Tous les papiers prêts pour le notaire
                  </h3>
                  <p className="font-source text-sm text-[#64748B] leading-relaxed">
                    La liste à cocher des documents indispensables (diagnostics, assainissement, titres) pour signer sans stress ni mauvaise surprise.
                  </p>
                </div>
                <div className="mt-8 pt-4 border-t border-[#E6E2DA] text-xs font-bold uppercase tracking-wider text-[#00B4EC] flex items-center gap-1.5">
                  <Check className="h-4 w-4 stroke-[2.5]" /> Zéro blocage juridique
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── 4. DÉMONSTRATION VISUELLE INTERACTIVE AVANT / APRÈS ─── */}
        <section className="py-20 sm:py-32 bg-white px-4 sm:px-8 border-b border-[#E6E2DA]">
          <div className="max-w-5xl mx-auto space-y-12">
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E0F0FA] px-4 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-[#0077B6]">
                <Sliders className="h-3 w-3" />
                Valorisation Naturelle
              </span>
              <h2 className="font-playfair text-3xl sm:text-5xl font-semibold text-[#0F172A] tracking-tight">
                L’impact de la lumière provençale <em className="italic font-normal">& du cadrage</em>
              </h2>
              <p className="font-source text-base sm:text-lg text-[#64748B]">
                Glissez le séparateur pour observer la différence entre une annonce standard et l’application des 20 points du guide.
              </p>
            </div>

            {/* Cadre de l'arche avec le comparatif */}
            <div className="rounded-[36px] bg-[#F9F8F4] p-3 sm:p-5 border border-[#E6E2DA] shadow-lg">
              <InteractiveBeforeAfterSlider />
            </div>

            <div className="grid sm:grid-cols-3 gap-6 pt-4 text-center">
              <div className="rounded-2xl bg-[#F9F8F4] p-5 border border-[#E6E2DA]">
                <p className="font-playfair text-3xl font-bold text-[#0077B6]">x3</p>
                <p className="font-source text-xs text-[#64748B] mt-1">de demandes qualifiées dès la première semaine</p>
              </div>
              <div className="rounded-2xl bg-[#F9F8F4] p-5 border border-[#E6E2DA]">
                <p className="font-playfair text-3xl font-bold text-[#0077B6]">20</p>
                <p className="font-source text-xs text-[#64748B] mt-1">points de contrôle de valorisation sans frais</p>
              </div>
              <div className="rounded-2xl bg-[#F9F8F4] p-5 border border-[#E6E2DA]">
                <p className="font-playfair text-3xl font-bold text-[#0077B6]">100%</p>
                <p className="font-source text-xs text-[#64748B] mt-1">applicable immédiatement chez vous</p>
              </div>
            </div>
          </div>
        </section>

        {/* ─── 5. LE SOMMAIRE EN 6 ÉTAPES SIMPLES (41 FICHES PRÊTES À L'EMPLOI) ─── */}
        <section className="py-20 sm:py-32 bg-[#F9F8F4] px-4 sm:px-8 border-b border-[#E6E2DA]">
          <div className="max-w-6xl mx-auto space-y-16">
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#00B4EC]">
                Le contenu sur un plateau
              </span>
              <h2 className="font-playfair text-3xl sm:text-5xl font-semibold text-[#0F172A] tracking-tight">
                6 étapes faciles, <em className="italic font-normal">41 fiches prêtes à l'emploi</em>
              </h2>
              <p className="font-source text-sm sm:text-base text-[#64748B]">
                Tout est rédigé sous forme de listes à cocher et d'exemples concrets, faciles à appliquer en 10 minutes chez vous.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {BOTANICAL_MODULES.map((mod) => {
                const Icon = mod.icon
                return (
                  <div
                    key={mod.num}
                    className="rounded-3xl bg-white p-8 border border-[#E6E2DA] shadow-2xs hover:border-[#0077B6]/40 hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="font-playfair text-2xl font-bold text-[#0077B6]">
                          {mod.num}
                        </span>
                        <span className="rounded-full bg-[#E0F0FA] px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#0077B6]">
                          {mod.tag}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <Icon className="h-4 w-4 text-[#0077B6] shrink-0" />
                        <h3 className="font-playfair text-lg font-bold text-[#0F172A] leading-snug">
                          {mod.title}
                        </h3>
                      </div>
                      <p className="font-source text-xs text-[#0077B6] font-semibold mb-3">
                        {mod.pages}
                      </p>
                      <p className="font-source text-xs text-[#64748B] leading-relaxed">
                        {mod.summary}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ─── 6. PREUVE SOCIALE & CRÉDIBILITÉ DU TERROIR ─── */}
        <section className="py-20 sm:py-32 bg-white px-4 sm:px-8 border-b border-[#E6E2DA]">
          <div className="max-w-6xl mx-auto space-y-20">
            {/* Chiffres animés au défilement */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="rounded-3xl bg-[#F9F8F4] p-7 text-center border border-[#E6E2DA]">
                <div className="font-playfair text-4xl sm:text-5xl font-bold text-[#0077B6] mb-1">
                  <AnimatedCounter value={41} />
                </div>
                <div className="font-playfair text-sm font-bold text-[#0F172A]">Planches A4</div>
                <div className="font-source text-[11px] text-[#64748B]">Guide relié ou numérique</div>
              </div>

              <div className="rounded-3xl bg-[#F9F8F4] p-7 text-center border border-[#E6E2DA]">
                <div className="font-playfair text-4xl sm:text-5xl font-bold text-[#0077B6] mb-1">
                  <AnimatedCounter value={100} prefix="+" />
                </div>
                <div className="font-playfair text-sm font-bold text-[#0F172A]">Points de Contrôle</div>
                <div className="font-source text-[11px] text-[#64748B]">Checklists opérationnelles</div>
              </div>

              <div className="rounded-3xl bg-[#F9F8F4] p-7 text-center border border-[#E6E2DA]">
                <div className="font-playfair text-4xl sm:text-5xl font-bold text-[#0077B6] mb-1">
                  5/5
                </div>
                <div className="font-playfair text-sm font-bold text-[#0F172A]">Avis Vérifiés</div>
                <div className="font-source text-[11px] text-[#64748B]">Propriétaires du Var</div>
              </div>

              <div className="rounded-3xl bg-[#F9F8F4] p-7 text-center border border-[#E6E2DA]">
                <div className="font-playfair text-4xl sm:text-5xl font-bold text-[#0077B6] mb-1">
                  N°1
                </div>
                <div className="font-playfair text-sm font-bold text-[#0F172A]">Réseau iad France</div>
                <div className="font-source text-[11px] text-[#64748B]">+15 000 conseillers</div>
              </div>
            </div>

            {/* Témoignages Éditoriaux */}
            <div className="space-y-10">
              <div className="text-center space-y-2">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#0077B6]">
                  Retours d'expérience
                </span>
                <h3 className="font-playfair text-3xl sm:text-4xl font-semibold text-[#0F172A]">
                  Ce que partagent les propriétaires de Provence
                </h3>
              </div>

              <div className="grid gap-8 md:grid-cols-3">
                {BOTANICAL_TESTIMONIALS.map((t, idx) => (
                  <div
                    key={idx}
                    className="rounded-3xl bg-[#F9F8F4] p-8 border border-[#E6E2DA] flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-1 text-amber-400 mb-4">
                        {[...Array(t.rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-current" />
                        ))}
                      </div>
                      <blockquote className="font-playfair text-sm sm:text-base text-[#0F172A] leading-relaxed italic mb-6">
                        {t.text}
                      </blockquote>
                    </div>

                    <div className="pt-4 border-t border-[#E6E2DA]">
                      <p className="font-source text-xs font-bold text-[#0F172A]">{t.author}</p>
                      <p className="font-source text-[11px] text-[#0077B6] font-semibold">{t.commune}</p>
                      <p className="font-source text-[10px] text-[#64748B]">{t.type}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Labels officiels */}
            <div className="pt-6 border-t border-[#E6E2DA] flex flex-wrap items-center justify-center gap-10 opacity-80">
              <div className="flex items-center gap-2.5">
                <span className="font-playfair font-black text-2xl text-[#0077B6]">iad</span>
                <span className="font-source text-xs text-[#64748B] uppercase tracking-widest font-bold">France</span>
              </div>

              <div className="flex items-center gap-2 font-source text-xs font-semibold text-[#64748B]">
                <ShieldCheck className="h-4 w-4 text-[#0077B6]" />
                <span>Base DVF Notaires</span>
              </div>

              <div className="flex items-center gap-2 font-source text-xs font-semibold text-[#64748B]">
                <BadgeCheck className="h-4 w-4 text-[#0077B6]" />
                <span>Conformité Loi ALUR & SPANC</span>
              </div>
            </div>
          </div>
        </section>

        {/* ─── 7. COMMENT ÇA MARCHE (3 ÉTAPES ORGANIQUES) ─── */}
        <section className="py-20 sm:py-32 bg-[#F9F8F4] px-4 sm:px-8 border-b border-[#E6E2DA]">
          <div className="max-w-5xl mx-auto space-y-16">
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#0077B6]">
                Démarche fluide
              </span>
              <h2 className="font-playfair text-3xl sm:text-5xl font-semibold text-[#0F172A] tracking-tight">
                Recevez votre exemplaire en <em className="italic font-normal">3 étapes simples</em>
              </h2>
            </div>

            <div className="grid gap-8 md:grid-cols-3 relative">
              {/* Étape 1 */}
              <div className="rounded-3xl bg-white p-8 border border-[#E6E2DA] text-center space-y-3">
                <div className="mx-auto h-12 w-12 rounded-full bg-[#E0F0FA] text-[#0077B6] font-playfair font-bold text-lg flex items-center justify-center">
                  1
                </div>
                <h3 className="font-playfair text-lg font-bold text-[#0F172A]">Complétez le formulaire</h3>
                <p className="font-source text-xs text-[#64748B] leading-relaxed">
                  Indiquez simplement votre prénom, votre adresse email et la commune de votre bien (15 secondes).
                </p>
              </div>

              {/* Étape 2 */}
              <div className="rounded-3xl bg-white p-8 border border-[#E6E2DA] text-center space-y-3">
                <div className="mx-auto h-12 w-12 rounded-full bg-[#E0F0FA] text-[#0077B6] font-playfair font-bold text-lg flex items-center justify-center">
                  2
                </div>
                <h3 className="font-playfair text-lg font-bold text-[#0F172A]">Réception instantanée</h3>
                <p className="font-source text-xs text-[#64748B] leading-relaxed">
                  Vous recevez votre exemplaire PDF haute définition directement dans votre boîte mail + l'accès au lecteur en ligne.
                </p>
              </div>

              {/* Étape 3 */}
              <div className="rounded-3xl bg-white p-8 border border-[#E6E2DA] text-center space-y-3">
                <div className="mx-auto h-12 w-12 rounded-full bg-[#E0F0FA] text-[#0077B6] font-playfair font-bold text-lg flex items-center justify-center">
                  3
                </div>
                <h3 className="font-playfair text-lg font-bold text-[#0F172A]">Passez à l'action</h3>
                <p className="font-source text-xs text-[#64748B] leading-relaxed">
                  Imprimez les fiches A4 ou consultez les checklists depuis votre smartphone pour guider votre projet.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ─── 8. QUESTIONS FRÉQUENTES & FAQ ─── */}
        <section className="py-20 sm:py-32 bg-white px-4 sm:px-8 border-b border-[#E6E2DA]">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#0077B6]">
                Transparence & Clarté
              </span>
              <h2 className="font-playfair text-3xl sm:text-5xl font-semibold text-[#0F172A] tracking-tight">
                Questions fréquentes & objections
              </h2>
            </div>

            <div className="space-y-4">
              {BOTANICAL_FAQS.map((faq, idx) => (
                <div
                  key={idx}
                  className="rounded-3xl bg-[#F9F8F4] border border-[#E6E2DA] overflow-hidden transition-all duration-300"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                    className="w-full p-6 sm:p-7 text-left flex items-center justify-between gap-4 font-playfair font-bold text-base sm:text-lg text-[#0F172A] hover:text-[#0077B6] transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`h-5 w-5 shrink-0 text-[#64748B] transition-transform duration-300 ${
                        openFaqIndex === idx ? 'rotate-180 text-[#0077B6]' : ''
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {openFaqIndex === idx && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="px-6 pb-7 sm:px-7 font-source text-sm text-[#64748B] leading-relaxed border-t border-[#E6E2DA] pt-5">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── 9. OFFRE & FORMULAIRE FINAL (SUR FOND BG-BRAND-LIGHT #E0F0FA) ─── */}
        <section id="telecharger" className="py-20 sm:py-32 bg-[#E0F0FA] px-4 sm:px-8 border-b border-[#E6E2DA]">
          <div className="max-w-4xl mx-auto">
            <div className="rounded-[36px] bg-white p-8 sm:p-14 border border-[#E6E2DA] shadow-2xl">
              <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] items-center">
                {/* Texte de l'offre */}
                <div className="space-y-6">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E0F0FA] px-4 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-[#00B4EC]">
                    <Sparkles className="h-3 w-3 text-[#EA584A]" />
                    Votre Guide Offert
                  </span>

                  <h2 className="font-playfair text-3xl sm:text-4xl font-semibold text-[#0F172A] tracking-tight leading-tight">
                    Votre maison mérite <em className="italic font-normal text-[#00B4EC]">les bons conseils</em>, pas les doutes.
                  </h2>

                  <p className="font-source text-sm sm:text-base text-[#64748B] leading-relaxed">
                    Recevez votre exemplaire du <strong>Guide du Vendeur Particulier</strong> en PDF immédiatement. Pas de blabla, juste les bonnes méthodes pour réussir seul.
                  </p>

                  <div className="space-y-3 pt-2 font-source text-xs sm:text-sm text-[#0F172A] font-medium">
                    <div className="flex items-center gap-2.5">
                      <Check className="h-4 w-4 text-[#00B4EC] stroke-[2.5]" />
                      <span>41 fiches pratiques avec des exemples simples</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Check className="h-4 w-4 text-[#00B4EC] stroke-[2.5]" />
                      <span>Le script anti-curieux et la liste pour le notaire</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Check className="h-4 w-4 text-[#00B4EC] stroke-[2.5]" />
                      <span>100% gratuit, immédiat et sans aucun appel de démarchage</span>
                    </div>
                  </div>
                </div>

                {/* Formulaire de capture */}
                <div className="rounded-3xl bg-[#F9F8F4] p-7 border border-[#E6E2DA]">
                  {!bottomSubmitted ? (
                    <form onSubmit={handleBottomSubmit} className="space-y-4">
                      <h3 className="font-playfair font-bold text-lg text-[#0F172A]">
                        Où voulez-vous recevoir votre guide ?
                      </h3>

                      {bottomError && (
                        <div className="rounded-xl bg-[#FEE2E2] p-3 text-xs text-[#EF4444] font-medium">
                          {bottomError}
                        </div>
                      )}

                      <div>
                        <input
                          type="text"
                          required
                          placeholder="Votre prénom *"
                          value={bottomFormData.prenom}
                          onChange={(e) => setBottomFormData({ ...bottomFormData, prenom: e.target.value })}
                          className="w-full rounded-full border border-[#E6E2DA] bg-white px-5 py-3 text-xs sm:text-sm text-[#0F172A] focus:border-[#0077B6] focus:outline-none focus:ring-2 focus:ring-[#0077B6]/20 transition-all"
                        />
                      </div>

                      <div>
                        <input
                          type="email"
                          required
                          placeholder="Votre adresse email *"
                          value={bottomFormData.email}
                          onChange={(e) => setBottomFormData({ ...bottomFormData, email: e.target.value })}
                          className="w-full rounded-full border border-[#E6E2DA] bg-white px-5 py-3 text-xs sm:text-sm text-[#0F172A] focus:border-[#0077B6] focus:outline-none focus:ring-2 focus:ring-[#0077B6]/20 transition-all"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2.5">
                        <input
                          type="tel"
                          placeholder="Téléphone"
                          value={bottomFormData.telephone}
                          onChange={(e) => setBottomFormData({ ...bottomFormData, telephone: e.target.value })}
                          className="w-full rounded-full border border-[#E6E2DA] bg-white px-4 py-3 text-xs text-[#0F172A] focus:border-[#0077B6] focus:outline-none focus:ring-2 focus:ring-[#0077B6]/20 transition-all"
                        />
                        <input
                          type="text"
                          placeholder="Commune"
                          value={bottomFormData.commune}
                          onChange={(e) => setBottomFormData({ ...bottomFormData, commune: e.target.value })}
                          className="w-full rounded-full border border-[#E6E2DA] bg-white px-4 py-3 text-xs text-[#0F172A] focus:border-[#0077B6] focus:outline-none focus:ring-2 focus:ring-[#0077B6]/20 transition-all"
                        />
                      </div>

                      <div className="pt-1">
                        <label className="flex items-start gap-2.5 text-[11px] text-[#64748B] cursor-pointer">
                          <input
                            type="checkbox"
                            checked={bottomFormData.opt_in}
                            onChange={(e) => setBottomFormData({ ...bottomFormData, opt_in: e.target.checked })}
                            className="mt-0.5 h-3.5 w-3.5 rounded border-[#E6E2DA] text-[#0077B6] focus:ring-[#0077B6]"
                          />
                          <span>J'accepte de recevoir le guide PDF gratuit par email.</span>
                        </label>
                      </div>

                      <button
                        type="submit"
                        disabled={bottomLoading}
                        className="group w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#0077B6] py-4 px-6 text-xs sm:text-sm font-bold uppercase tracking-widest text-white shadow-md hover:bg-[#005f92] transition-all disabled:opacity-70 active:scale-[0.98]"
                      >
                        {bottomLoading ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Envoi en cours...</span>
                          </>
                        ) : (
                          <>
                            <span>Télécharger mon Guide (PDF)</span>
                            <Download className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
                          </>
                        )}
                      </button>
                    </form>
                  ) : (
                    <div className="text-center py-6 space-y-4">
                      <div className="mx-auto h-12 w-12 rounded-full bg-[#10B981]/15 text-[#10B981] flex items-center justify-center">
                        <Check className="h-6 w-6 stroke-[2.5]" />
                      </div>
                      <h4 className="font-playfair font-bold text-xl text-[#0F172A]">Guide expédié !</h4>
                      <p className="font-source text-xs text-[#64748B]">
                        Consultez votre boîte mail à <strong>{bottomFormData.email}</strong>.
                      </p>
                      <Link
                        href="/guide-vendeur"
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0077B6] px-6 py-3 text-xs font-bold uppercase tracking-widest text-white hover:bg-[#005f92] transition-all"
                      >
                        <BookOpen className="h-3.5 w-3.5" />
                        <span>Ouvrir l'exemplaire A4</span>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── 10. PIED DE PAGE LÉGAL (CONFORME IAD / RGPD) ─── */}
        <footer className="bg-white px-4 sm:px-8 py-14 border-t border-[#E6E2DA]">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-8 border-b border-[#E6E2DA]">
              <div>
                <span className="font-montserrat text-3xl font-extrabold text-[#EA584A] tracking-tight block">
                  Alexandre Lopez
                </span>
                <span className="font-montserrat text-xs font-semibold text-[#00B4EC] tracking-wide">
                  Conseiller en immobilier iad · Cotignac & Provence Verte (83)
                </span>
              </div>

              {/* Téléphone HTML pur (espaces simples selon charte page 7) */}
              <div className="flex flex-wrap items-center gap-6 text-sm font-montserrat">
                <a
                  href={'tel:' + PHONE_RAW}
                  className="inline-flex items-center gap-2 font-bold text-[#00B4EC] hover:text-[#008EC3]"
                >
                  <Phone className="h-4 w-4 text-[#EA584A]" />
                  <span>{PHONE_DISPLAY}</span>
                </a>
                <a
                  href={'mailto:' + EMAIL}
                  className="inline-flex items-center gap-2 text-[#64748B] hover:text-[#0F172A]"
                >
                  <Mail className="h-4 w-4" />
                  <span>{EMAIL}</span>
                </a>
              </div>
            </div>

            {/* Mentions légales */}
            <div className="font-source text-[11px] text-[#64748B] leading-relaxed space-y-3">
              <p>
                <strong>Statut Professionnel & Mentions Légales :</strong> EI Alexandre Lopez, mandataire indépendant en immobilier (sans détention de fonds), agent commercial de la SAS I@D France immatriculé au RSAC de Draguignan, titulaire de la carte de démarchage immobilier pour le compte de la société I@D France SAS. Tous les conseillers iad sont des agents commerciaux indépendants de la SAS I@D France.
              </p>
              <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                <p>© {new Date().getFullYear()} Alexandre Lopez · Tous droits réservés.</p>
                <div className="flex items-center gap-4">
                  <Link href="/mentions-legales" className="hover:underline">
                    Mentions Légales
                  </Link>
                  <span>·</span>
                  <Link href="/politique-confidentialite" className="hover:underline">
                    Politique de Confidentialité
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}
