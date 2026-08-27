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
  Zap,
} from 'lucide-react'
import { GuideVideoSpot } from './GuideVideoSpot'
import { GuideDownloadModal } from './GuideDownloadModal'
import { Interactive3DBookMockup } from './Interactive3DBookMockup'
import { InteractiveBeforeAfterSlider } from './InteractiveBeforeAfterSlider'
import { AnimatedCounter } from './AnimatedCounter'
import { SpotlightCard } from './SpotlightCard'
import { SmartStickyCtaBar } from './SmartStickyCtaBar'
import { HeroVideoBackground } from './HeroVideoBackground'

const PHONE_RAW = '+33613180168'
const PHONE_DISPLAY = '06 13 18 01 68'
const EMAIL = 'alex@alexlopez-provence.fr'

// ─── 1. SOMMAIRE DES 6 MODULES OPÉRATIONNELS DU GUIDE ───
const GUIDE_CHAPTERS = [
  {
    num: '01',
    title: 'Diagnostic & Préparation Émotionnelle',
    pages: 'P. 07 – 13',
    summary: 'Les 20 points de valorisation pièce par pièce, la checklist extérieure et le home staging pour déclencher le coup de cœur sans engager de dépenses superflues.',
    tag: 'Checklist A4',
    icon: Sparkles,
  },
  {
    num: '02',
    title: 'Stratégie de Prix & Données DVF Notariales',
    pages: 'P. 14 – 18',
    summary: 'Comment exploiter la base officielle des Demandes de Valeurs Foncières (DVF) pour positionner votre bien au juste prix réel et éviter de brûler votre annonce.',
    tag: 'Méthode DVF',
    icon: TrendingUp,
  },
  {
    num: '03',
    title: 'Marketing Visuel & Rédaction Persuasive',
    pages: 'P. 19 – 23',
    summary: 'Les règles de prise de vue grand angle avec lumière naturelle provençale et la formule de rédaction d’annonce qui maximise les demandes qualifiées.',
    tag: 'Guide Photo',
    icon: Eye,
  },
  {
    num: '04',
    title: 'Script de Qualification & Tri des Visiteurs',
    pages: 'P. 24 – 27',
    summary: 'La grille exacte de 4 questions téléphoniques pour vérifier l’apport et la solidité bancaire des acheteurs AVANT d’ouvrir votre porte le weekend.',
    tag: 'Script Téléphonique',
    icon: Users,
  },
  {
    num: '05',
    title: 'Négociation & Défense de votre Prix',
    pages: 'P. 28 – 32',
    summary: 'Les arguments factuels pour désamorcer les tentatives de négociation agressive de 30 000 € et formaliser une offre d’achat juridiquement solide.',
    tag: 'Fiche Négociation',
    icon: ShieldCheck,
  },
  {
    num: '06',
    title: 'Dossier Notarial & Sécurité Juridique',
    pages: 'P. 33 – 41',
    summary: 'Diagnostics obligatoires, conformité assainissement (SPANC), Loi ALUR, purge du délai de rétractation et suivi jusqu’à l’acte authentique.',
    tag: 'Sécurité Juridique',
    icon: Award,
  },
]

// ─── 2. TÉMOIGNAGES CLIENTS PROVENCE VERTE ───
const TESTIMONIALS = [
  {
    author: 'Michel & Christine B.',
    commune: 'Cotignac (83570)',
    type: 'Maison de village avec terrasse',
    text: '« Nous vendions seuls depuis 3 mois sans succès avec des visites inutiles. La grille de qualification bancaire et la méthode DVF du guide nous ont permis de recentrer le prix et de trouver un acheteur solvable en 3 semaines. Un outil indispensable ! »',
    rating: 5,
  },
  {
    author: 'Patrick V.',
    commune: 'Brignoles (83170)',
    type: 'Villa 5 pièces avec piscine',
    text: '« Ce qui m’a le plus aidé, c’est le script pour filtrer les faux acheteurs au téléphone. J’ai arrêté de perdre mes samedis avec des touristes. Les fiches A4 imprimables sont claires, pratiques et sans baratin. »',
    rating: 5,
  },
  {
    author: 'Nathalie D.',
    commune: 'Saint-Maximin-la-Sainte-Baume (83470)',
    type: 'Propriété de campagne',
    text: '« Le volet juridique sur l’assainissement et la constitution du dossier notaire m’a évité un blocage chez le notaire. Un vrai travail de pro mis à disposition avec bienveillance. Merci Alexandre ! »',
    rating: 5,
  },
]

// ─── 3. FAQ / OBJECTIONS TRAITÉES FRONTALEMENT ───
const FAQS = [
  {
    q: 'Pourquoi ce guide est-il 100% gratuit ? Y a-t-il un piège ?',
    a: 'Aucun piège et aucun engagement. C’est ma démarche de transmission et de transparence en Provence. Si vous réussissez votre vente seul grâce à ces outils, j’en serai sincèrement ravi ! Et si à un moment vous ressentez le besoin de déléguer la mise en valeur, les visites ou la négociation, vous saurez naturellement vers qui vous tourner.',
  },
  {
    q: 'Je vends sans agence pour économiser les frais, vais-je être harcelé au téléphone ?',
    a: 'Absolument pas. Je déteste le démarchage agressif autant que vous. Votre email et votre numéro ne sont jamais revendus et vous ne recevrez aucun appel indésirable. Vous restez 100% maître de vos décisions et de votre calendrier.',
  },
  {
    q: 'Ce guide est-il vraiment adapté aux particularités de la Provence Verte & Verdon ?',
    a: 'Oui, à 100%. Contrairement aux guides génériques trouvés sur Internet, celui-ci a été rédigé avec les réalités concrètes de notre territoire varois : typologie des bâtis anciens, assainissement autonome (SPANC), servitudes, conformité urbanisme et dynamique saisonnière du marché local.',
  },
]

export function GuideLeadLandingPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0)

  // Formulaire direct en bas de page
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
          source: 'landing_bottom_form',
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
    <div className="min-h-screen bg-white text-foreground font-sans antialiased selection:bg-brand selection:text-white pb-20">
      {/* ─── BARRE FLOTTANTE INTELLIGENTE (STICKY CTA) ─── */}
      <SmartStickyCtaBar onOpenModal={() => setIsModalOpen(true)} />

      {/* ─── MODAL TÉLÉCHARGEMENT RAPIDE ─── */}
      <GuideDownloadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        source="lead_landing_cta"
      />

      {/* ─── BANDEAU SUPÉRIEUR HAUTE COHÉRENCE MARQUE IAD ─── */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-border/80 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <span className="font-script text-2xl md:text-3xl text-foreground font-medium group-hover:text-brand transition-colors">
              Alexandre Lopez
            </span>
            <span className="hidden sm:inline-block h-4 w-px bg-border" />
            <span className="hidden sm:inline-block text-xs font-bold uppercase tracking-wider text-muted">
              Guide Vendeur Particulier
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href="/guide-vendeur"
              className="hidden md:inline-flex items-center gap-1.5 text-xs font-semibold text-brand hover:text-brand-hover transition-colors"
            >
              <Eye className="h-3.5 w-3.5" />
              <span>Feuilleter l'édition en ligne</span>
            </Link>

            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="group relative inline-flex items-center gap-2 rounded-full bg-brand pl-4 pr-1.5 py-1.5 text-xs sm:text-sm font-bold text-white shadow-sm hover:bg-brand-hover active:scale-[0.98] transition-all"
            >
              <span>Recevoir le Guide (PDF)</span>
              <span className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full bg-white/20 text-white transition-transform group-hover:translate-x-0.5">
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* ─── 1. HERO SECTION (VISIBLE SANS DÉFILER / ABOVE THE FOLD) ─── */}
        <section className="relative overflow-hidden bg-gradient-to-b from-surface/80 via-white/80 to-white pt-10 pb-16 sm:pt-16 sm:pb-24 border-b border-border/60">
          {/* ─── ARRIÈRE-PLAN VIDÉO IMMOBILIÈRE CINÉMATIQUE ─── */}
          <HeroVideoBackground overlayOpacity="bg-gradient-to-r from-white/95 via-white/85 to-white/40" />

          {/* Halos décoratifs subtils */}
          <div className="pointer-events-none absolute top-0 right-1/4 h-96 w-96 rounded-full bg-brand-light/30 blur-3xl -z-10" />
          <div className="pointer-events-none absolute bottom-0 left-10 h-80 w-80 rounded-full bg-surface-alt/40 blur-3xl -z-10" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] items-center">
              {/* Colonne Gauche : Promesse, Sous-promesse, Boutons Cinétiques */}
              <div className="space-y-6 text-center lg:text-left">
                {/* Badges d'autorité */}
                <div className="inline-flex flex-wrap items-center justify-center lg:justify-start gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-light px-3.5 py-1.5 text-xs font-bold text-brand uppercase tracking-wider">
                    <MapPin className="h-3.5 w-3.5" />
                    Provence Verte & Verdon
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-muted border border-border shadow-2xs">
                    <ShieldCheck className="h-3.5 w-3.5 text-success" />
                    Édition Propriétaire 2026
                  </span>
                </div>

                {/* 1. PROMESSE EN UNE PHRASE */}
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-foreground tracking-tight leading-[1.08]">
                  Vendez votre maison au juste prix entre particuliers,{' '}
                  <span className="text-brand">sans subir les curieux</span> ni brader votre patrimoine.
                </h1>

                {/* 2. SOUS-PROMESSE PÉDAGOGIQUE */}
                <p className="text-base sm:text-lg lg:text-xl text-muted leading-relaxed max-w-2xl mx-auto lg:mx-0">
                  Le manuel de référence en <strong>41 pages</strong> : méthode d'estimation DVF notariée, checklist de 20 points de valorisation, script de qualification bancaire et sécurité juridique. <strong>100% offert et sans engagement.</strong>
                </p>

                {/* 3. BOUTONS D'ACTION DIRECTS (NESTED BUTTON-IN-BUTTON KINETIC) */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    className="group w-full sm:w-auto inline-flex items-center justify-between sm:justify-center gap-3 rounded-full bg-brand pl-7 pr-2 py-3.5 text-sm sm:text-base font-bold text-white shadow-[0_12px_30px_rgba(0,119,182,0.28)] hover:bg-brand-hover hover:shadow-[0_16px_36px_rgba(0,119,182,0.36)] transition-all hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <span>Télécharger le Guide Gratuit (PDF)</span>
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white transition-transform group-hover:translate-x-1 group-hover:-translate-y-0.5">
                      <Download className="h-4 w-4" />
                    </span>
                  </button>

                  <Link
                    href="/guide-vendeur"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border-2 border-border bg-white px-6 py-4 text-sm font-bold text-foreground hover:border-brand hover:text-brand transition-all hover:-translate-y-0.5"
                  >
                    <BookOpen className="h-4 w-4 text-brand" />
                    <span>Feuilleter l'édition en ligne</span>
                  </Link>
                </div>

                {/* Micro-réassurances */}
                <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-y-2 gap-x-6 text-xs text-muted">
                  <span className="flex items-center gap-1.5">
                    <Check className="h-4 w-4 text-success stroke-[2.5]" /> 41 Fiches A4 Imprimables
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Check className="h-4 w-4 text-success stroke-[2.5]" /> Données Notariales DVF
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Check className="h-4 w-4 text-success stroke-[2.5]" /> Réseau iad N°1 France
                  </span>
                </div>
              </div>

              {/* Colonne Droite : Mockup 3D Interactif avec inclinaison et reflets */}
              <div className="relative mx-auto w-full flex justify-center">
                <Interactive3DBookMockup onOpenModal={() => setIsModalOpen(true)} />
              </div>
            </div>

            {/* ─── EMPLACEMENT VIDÉO INTÉGRÉ AU HERO ─── */}
            <div className="mt-14 sm:mt-20">
              <GuideVideoSpot onOpenDownloadModal={() => setIsModalOpen(true)} />
            </div>
          </div>
        </section>

        {/* ─── 2. LE PROBLÈME (LA DOULEUR NOMMÉE AVEC LES MOTS DU CLIENT) ─── */}
        <section className="py-16 sm:py-24 bg-surface px-4 sm:px-6 border-b border-border/80">
          <div className="max-w-6xl mx-auto">
            <div className="text-center space-y-4 max-w-3xl mx-auto mb-14">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-error-light px-3.5 py-1 text-xs font-bold text-error uppercase tracking-wider">
                <AlertTriangle className="h-3.5 w-3.5" />
                La réalité du terrain
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight">
                Vendre seul sans méthode : le parcours du combattant que personne ne vous dit
              </h2>
              <p className="text-sm sm:text-base text-muted leading-relaxed">
                Quand on met son bien sur un portail d’annonces, on s’attend à recevoir des acheteurs motivés. Mais sans protocole précis, la réalité est souvent bien différente.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {/* Problème 1 : Les curieux */}
              <SpotlightCard spotlightColor="rgba(239, 68, 68, 0.08)">
                <div>
                  <div className="h-10 w-10 rounded-xl bg-error-light text-error flex items-center justify-center font-black text-lg mb-4">
                    01
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">
                    Le défilé des curieux du dimanche
                  </h3>
                  <p className="text-sm text-muted leading-relaxed">
                    Passer ses week-ends entiers à nettoyer sa maison et accueillir des promeneurs qui « regardent juste pour voir », comparent avec le voisin ou n'ont même pas consulté leur banque.
                  </p>
                </div>
              </SpotlightCard>

              {/* Problème 2 : Les négociations sauvages */}
              <SpotlightCard spotlightColor="rgba(239, 68, 68, 0.08)">
                <div>
                  <div className="h-10 w-10 rounded-xl bg-error-light text-error flex items-center justify-center font-black text-lg mb-4">
                    02
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">
                    Les négociations agressives et destructrices
                  </h3>
                  <p className="text-sm text-muted leading-relaxed">
                    Faire face à des acheteurs qui tentent de baisser votre prix de 30 000 € à 50 000 € avec des critiques subjectives sur votre décoration ou votre jardin, sans argument technique solide.
                  </p>
                </div>
              </SpotlightCard>

              {/* Problème 3 : Le prêt refusé */}
              <SpotlightCard spotlightColor="rgba(239, 68, 68, 0.08)">
                <div>
                  <div className="h-10 w-10 rounded-xl bg-error-light text-error flex items-center justify-center font-black text-lg mb-4">
                    03
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">
                    L’angoisse du prêt refusé après 45 jours d’attente
                  </h3>
                  <p className="text-sm text-muted leading-relaxed">
                    Bloquer son bien pendant un mois et demi sous compromis pour apprendre au dernier moment que la banque refuse le crédit de l’acheteur, obligeant à tout recommencer de zéro.
                  </p>
                </div>
              </SpotlightCard>

              {/* Problème 4 : Le casse-tête juridique */}
              <SpotlightCard spotlightColor="rgba(239, 68, 68, 0.08)">
                <div>
                  <div className="h-10 w-10 rounded-xl bg-error-light text-error flex items-center justify-center font-black text-lg mb-4">
                    04
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">
                    Le casse-tête juridique & les diagnostics piégeux
                  </h3>
                  <p className="text-sm text-muted leading-relaxed">
                    DPE, conformité assainissement non collectif (SPANC), servitudes de passage, formalités Loi ALUR... La moindre omission peut donner droit à l’acheteur d’annuler la vente sans pénalité.
                  </p>
                </div>
              </SpotlightCard>
            </div>

            {/* Transition vers la solution */}
            <div className="mt-10 rounded-2xl bg-brand/5 border border-brand/20 p-6 text-center">
              <p className="text-sm sm:text-base font-medium text-foreground">
                💡 <strong>La bonne nouvelle ?</strong> Ces obstacles ne sont pas une fatalité. En appliquant une méthode professionnelle rigoureuse, vous éliminez 95% de ces frictions dès la première semaine.
              </p>
            </div>
          </div>
        </section>

        {/* ─── MODULE INTERACTIF EXCLUSIF : COMPARATIF VISUEL AVANT / APRÈS ─── */}
        <section className="py-16 sm:py-24 bg-white px-4 sm:px-6 border-b border-border">
          <div className="max-w-5xl mx-auto space-y-10">
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-light px-3.5 py-1 text-xs font-bold text-brand uppercase tracking-wider">
                <Sliders className="h-3.5 w-3.5" />
                Démonstration concrète
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight">
                95% des acquéreurs effectuent leur tri sur un écran
              </h2>
              <p className="text-sm sm:text-base text-muted">
                Découvrez la différence immédiate entre une photo classique et les 20 points de valorisation visuelle détaillés dans le guide.
              </p>
            </div>

            <InteractiveBeforeAfterSlider />

            <div className="grid sm:grid-cols-3 gap-4 pt-4 text-center">
              <div className="rounded-2xl bg-surface p-4 border border-border">
                <p className="text-xl font-black text-brand">x3</p>
                <p className="text-xs text-muted mt-1">de consultations qualifiées dès la 1ère semaine</p>
              </div>
              <div className="rounded-2xl bg-surface p-4 border border-border">
                <p className="text-xl font-black text-brand">20</p>
                <p className="text-xs text-muted mt-1">points de contrôle de désencombrement pièce par pièce</p>
              </div>
              <div className="rounded-2xl bg-surface p-4 border border-border">
                <p className="text-xl font-black text-brand">0 €</p>
                <p className="text-xs text-muted mt-1">de travaux lourds : uniquement de la valorisation astucieuse</p>
              </div>
            </div>
          </div>
        </section>

        {/* ─── 3. LES 3 BÉNÉFICES MAJEURS (RÉSULTATS CLIENTS CONCRETS) ─── */}
        <section className="py-16 sm:py-24 bg-surface px-4 sm:px-6 border-b border-border">
          <div className="max-w-6xl mx-auto">
            <div className="text-center space-y-4 max-w-3xl mx-auto mb-16">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-light px-3.5 py-1 text-xs font-bold text-brand uppercase tracking-wider">
                <Sparkles className="h-3.5 w-3.5" />
                Ce que le guide change pour vous
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight">
                Trois piliers pour reprendre le contrôle total de votre vente
              </h2>
              <p className="text-sm sm:text-base text-muted leading-relaxed">
                Pas de jargon commercial, uniquement des outils opérationnels testés sur le marché provençal.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {/* Bénéfice 1 */}
              <SpotlightCard spotlightColor="rgba(0, 119, 182, 0.12)">
                <div className="space-y-4">
                  <div className="h-12 w-12 rounded-2xl bg-brand text-white flex items-center justify-center shadow-md">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground leading-tight">
                    1. Fixer et défendre le vrai prix de marché DVF
                  </h3>
                  <p className="text-sm text-muted leading-relaxed">
                    Grâce à la méthode d’analyse des ventes réelles notariées de votre village (base DVF), vous évitez la sous-estimation qui fait perdre des dizaines de milliers d’euros ou la sur-estimation qui brûle votre annonce.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-border text-xs font-bold text-brand flex items-center gap-1.5">
                  <Check className="h-4 w-4 stroke-[2.5]" /> −9% de décote moyenne évitée
                </div>
              </SpotlightCard>

              {/* Bénéfice 2 */}
              <SpotlightCard spotlightColor="rgba(0, 119, 182, 0.12)">
                <div className="space-y-4">
                  <div className="h-12 w-12 rounded-2xl bg-brand text-white flex items-center justify-center shadow-md">
                    <Users className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground leading-tight">
                    2. Filtrer 100% des curieux avant d'ouvrir votre porte
                  </h3>
                  <p className="text-sm text-muted leading-relaxed">
                    Grâce au script téléphonique en 4 questions incontournables, vous vérifiez l'apport personnel et la solvabilité bancaire des visiteurs. Vous ne recevez chez vous que des acheteurs sérieux et prêts à signer.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-border text-xs font-bold text-brand flex items-center gap-1.5">
                  <Check className="h-4 w-4 stroke-[2.5]" /> 100% de vos visites qualifiées
                </div>
              </SpotlightCard>

              {/* Bénéfice 3 */}
              <SpotlightCard spotlightColor="rgba(0, 119, 182, 0.12)">
                <div className="space-y-4">
                  <div className="h-12 w-12 rounded-2xl bg-brand text-white flex items-center justify-center shadow-md">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground leading-tight">
                    3. Verrouiller votre dossier pour le notaire
                  </h3>
                  <p className="text-sm text-muted leading-relaxed">
                    Toutes les checklists indispensables (Loi ALUR, assainissement, diagnostics) pour constituer un dossier irréprochable dès la mise en vente, purger le délai de rétractation et signer sans risque d'annulation.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-border text-xs font-bold text-brand flex items-center gap-1.5">
                  <Check className="h-4 w-4 stroke-[2.5]" /> Sérénité juridique totale
                </div>
              </SpotlightCard>
            </div>

            {/* CTA intermédiaire */}
            <div className="mt-12 text-center">
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="group inline-flex items-center gap-2.5 rounded-full bg-brand pl-7 pr-2 py-3.5 text-sm sm:text-base font-bold text-white shadow-md hover:bg-brand-hover transition-all active:scale-[0.98]"
              >
                <span>Recevoir les checklists complètes (PDF Gratuit)</span>
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white transition-transform group-hover:translate-x-0.5">
                  <Download className="h-4 w-4" />
                </span>
              </button>
            </div>
          </div>
        </section>

        {/* ─── SOMMAIRE DES 6 MODULES / 41 PLANCHES ─── */}
        <section className="py-16 sm:py-24 bg-white px-4 sm:px-6 border-b border-border">
          <div className="max-w-6xl mx-auto">
            <div className="text-center space-y-3 max-w-2xl mx-auto mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-brand">
                Au sommaire du guide
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">
                6 modules complets, 41 planches méthodiques
              </h2>
              <p className="text-sm text-muted">
                Découvrez les fiches pratiques incluses dans votre exemplaire en libre accès.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {GUIDE_CHAPTERS.map((ch) => {
                const IconComponent = ch.icon
                return (
                  <SpotlightCard key={ch.num}>
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-2xl font-black text-brand">{ch.num}</span>
                        <span className="rounded-full bg-brand-light px-2.5 py-0.5 text-[11px] font-bold text-brand">
                          {ch.tag}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mb-1">
                        <IconComponent className="h-4 w-4 text-brand shrink-0" />
                        <h3 className="font-bold text-base text-foreground">{ch.title}</h3>
                      </div>
                      <p className="text-xs text-muted/80 font-medium mb-3">{ch.pages}</p>
                      <p className="text-xs text-muted leading-relaxed">{ch.summary}</p>
                    </div>
                  </SpotlightCard>
                )
              })}
            </div>
          </div>
        </section>

        {/* ─── 4. PREUVE SOCIALE & CRÉDIBILITÉ (CHIFFRES ANIMÉS, AVIS, LABELS) ─── */}
        <section className="py-16 sm:py-24 bg-surface px-4 sm:px-6 border-b border-border">
          <div className="max-w-6xl mx-auto space-y-16">
            {/* Chiffres clés animés au scroll */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="rounded-3xl bg-white p-6 text-center border border-border shadow-xs">
                <div className="text-3xl sm:text-4xl font-black text-brand mb-1">
                  <AnimatedCounter value={41} />
                </div>
                <div className="text-xs sm:text-sm font-semibold text-foreground">Pages Méthodiques</div>
                <div className="text-[11px] text-muted">Fiches imprimables A4</div>
              </div>

              <div className="rounded-3xl bg-white p-6 text-center border border-border shadow-xs">
                <div className="text-3xl sm:text-4xl font-black text-brand mb-1">
                  <AnimatedCounter value={100} prefix="+" />
                </div>
                <div className="text-xs sm:text-sm font-semibold text-foreground">Points de Contrôle</div>
                <div className="text-[11px] text-muted">Checklists exhaustives</div>
              </div>

              <div className="rounded-3xl bg-white p-6 text-center border border-border shadow-xs">
                <div className="text-3xl sm:text-4xl font-black text-brand mb-1">
                  5/5
                </div>
                <div className="text-xs sm:text-sm font-semibold text-foreground">Avis Vérifiés</div>
                <div className="text-[11px] text-muted">Propriétaires en Provence</div>
              </div>

              <div className="rounded-3xl bg-white p-6 text-center border border-border shadow-xs">
                <div className="text-3xl sm:text-4xl font-black text-brand mb-1">
                  N°1
                </div>
                <div className="text-xs sm:text-sm font-semibold text-foreground">Réseau iad France</div>
                <div className="text-[11px] text-muted">+15 000 conseillers</div>
              </div>
            </div>

            {/* Témoignages clients de Provence Verte */}
            <div>
              <div className="text-center space-y-2 mb-10">
                <span className="text-xs font-bold uppercase tracking-wider text-brand">
                  Retours d'expérience
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground">
                  Ce que disent les propriétaires du secteur
                </h3>
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                {TESTIMONIALS.map((t, idx) => (
                  <SpotlightCard key={idx}>
                    <div>
                      {/* Étoiles */}
                      <div className="flex items-center gap-1 text-amber-400 mb-3">
                        {[...Array(t.rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-current" />
                        ))}
                      </div>
                      <p className="text-xs sm:text-sm text-foreground leading-relaxed italic mb-4">
                        {t.text}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-border">
                      <p className="text-xs font-bold text-foreground">{t.author}</p>
                      <p className="text-[11px] text-brand font-medium">{t.commune}</p>
                      <p className="text-[10px] text-muted">{t.type}</p>
                    </div>
                  </SpotlightCard>
                ))}
              </div>
            </div>

            {/* Logos & Labels de confiance */}
            <div className="pt-6 border-t border-border flex flex-wrap items-center justify-center gap-8 sm:gap-12 opacity-85">
              <div className="flex items-center gap-2">
                <div className="flex flex-col leading-none">
                  <span className="font-serif italic font-black text-brand text-2xl">iad</span>
                  <span className="text-[9px] font-bold text-foreground uppercase tracking-widest -mt-0.5">France</span>
                </div>
                <span className="text-xs text-muted font-medium">Réseau N°1</span>
              </div>

              <div className="flex items-center gap-2 text-xs font-semibold text-muted">
                <ShieldCheck className="h-5 w-5 text-brand" />
                <span>Base DVF Notaires de France</span>
              </div>

              <div className="flex items-center gap-2 text-xs font-semibold text-muted">
                <BadgeCheck className="h-5 w-5 text-brand" />
                <span>Conformité Loi ALUR & SPANC</span>
              </div>
            </div>
          </div>
        </section>

        {/* ─── 5. COMMENT ÇA MARCHE (3 ÉTAPES SIMPLES) ─── */}
        <section className="py-16 sm:py-24 bg-white px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center space-y-3 max-w-2xl mx-auto mb-14">
              <span className="text-xs font-bold uppercase tracking-wider text-brand">
                Processus simple & rapide
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">
                Comment recevoir votre guide en 3 étapes
              </h2>
            </div>

            <div className="grid gap-8 md:grid-cols-3 relative">
              {/* Étape 1 */}
              <div className="rounded-3xl bg-surface p-7 sm:p-8 border border-border text-center space-y-3">
                <div className="mx-auto h-12 w-12 rounded-full bg-brand-light text-brand font-black text-lg flex items-center justify-center shadow-xs">
                  1
                </div>
                <h3 className="font-bold text-base text-foreground">Remplissez le formulaire</h3>
                <p className="text-xs text-muted leading-relaxed">
                  Indiquez simplement votre prénom, votre adresse email et la commune de votre bien (15 secondes chrono).
                </p>
              </div>

              {/* Étape 2 */}
              <div className="rounded-3xl bg-surface p-7 sm:p-8 border border-border text-center space-y-3">
                <div className="mx-auto h-12 w-12 rounded-full bg-brand-light text-brand font-black text-lg flex items-center justify-center shadow-xs">
                  2
                </div>
                <h3 className="font-bold text-base text-foreground">Réception immédiate</h3>
                <p className="text-xs text-muted leading-relaxed">
                  Vous recevez immédiatement votre exemplaire en PDF Haute Définition par email + un accès direct au lecteur interactif en ligne.
                </p>
              </div>

              {/* Étape 3 */}
              <div className="rounded-3xl bg-surface p-7 sm:p-8 border border-border text-center space-y-3">
                <div className="mx-auto h-12 w-12 rounded-full bg-brand-light text-brand font-black text-lg flex items-center justify-center shadow-xs">
                  3
                </div>
                <h3 className="font-bold text-base text-foreground">Appliquez la méthode</h3>
                <p className="text-xs text-muted leading-relaxed">
                  Imprimez les fiches A4 ou suivez les checklists depuis votre smartphone pour sécuriser chaque étape de votre vente.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ─── 6. OBJECTIONS & FAQ (3 QUESTIONS MAJEURES TRAITÉES FRONTALEMENT) ─── */}
        <section className="py-16 sm:py-24 bg-surface px-4 sm:px-6 border-t border-border">
          <div className="max-w-4xl mx-auto space-y-10">
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <span className="text-xs font-bold uppercase tracking-wider text-brand">
                Transparence totale
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">
                Questions fréquentes & objections
              </h2>
              <p className="text-sm text-muted">
                Les réponses claires et sans détour aux questions que vous vous posez.
              </p>
            </div>

            <div className="space-y-4">
              {FAQS.map((faq, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl bg-white border border-border overflow-hidden shadow-2xs transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-foreground hover:text-brand transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`h-5 w-5 shrink-0 text-muted transition-transform duration-200 ${
                        openFaqIndex === idx ? 'rotate-180 text-brand' : ''
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {openFaqIndex === idx && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="px-5 pb-6 sm:px-6 text-xs sm:text-sm text-muted leading-relaxed border-t border-border/60 pt-4">
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

        {/* ─── 7. OFFRE & FORMULAIRE FINAL (FOND BG-BRAND-LIGHT / #E0F0FA SELON BRAND.MD) ─── */}
        <section id="telecharger" className="py-16 sm:py-24 bg-brand-light px-4 sm:px-6 border-y border-border">
          <div className="max-w-4xl mx-auto">
            <div className="rounded-3xl bg-white p-8 sm:p-12 border border-border shadow-xl">
              <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] items-center">
                {/* Texte de l'offre */}
                <div className="space-y-5">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-light px-3.5 py-1 text-xs font-bold text-brand uppercase tracking-wider">
                    Téléchargement immédiat
                  </span>

                  <h2 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight leading-tight">
                    Votre projet de vente mérite les meilleures méthodes, pas du hasard.
                  </h2>

                  <p className="text-sm text-muted leading-relaxed">
                    Recevez instantanément votre exemplaire du <strong>Guide Stratégique du Vendeur Particulier</strong> en PDF A4 haute définition.
                  </p>

                  <div className="space-y-2.5 pt-2 text-xs text-foreground font-medium">
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-success stroke-[2.5]" />
                      <span>41 planches méthodiques opérationnelles</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-success stroke-[2.5]" />
                      <span>Checklists de valorisation & script téléphonique</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-success stroke-[2.5]" />
                      <span>100% gratuit, immédiat et sans engagement</span>
                    </div>
                  </div>
                </div>

                {/* Formulaire de capture direct */}
                <div className="rounded-2xl bg-surface p-6 border border-border shadow-2xs">
                  {!bottomSubmitted ? (
                    <form onSubmit={handleBottomSubmit} className="space-y-3.5">
                      <h3 className="font-bold text-base text-foreground">
                        Recevoir mon guide par email
                      </h3>

                      {bottomError && (
                        <div className="rounded-lg bg-error-light p-2.5 text-xs text-error font-medium">
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
                          className="w-full rounded-xl border border-border bg-white px-3.5 py-2.5 text-xs sm:text-sm text-foreground focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all"
                        />
                      </div>

                      <div>
                        <input
                          type="email"
                          required
                          placeholder="Votre adresse email *"
                          value={bottomFormData.email}
                          onChange={(e) => setBottomFormData({ ...bottomFormData, email: e.target.value })}
                          className="w-full rounded-xl border border-border bg-white px-3.5 py-2.5 text-xs sm:text-sm text-foreground focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="tel"
                          placeholder="Téléphone"
                          value={bottomFormData.telephone}
                          onChange={(e) => setBottomFormData({ ...bottomFormData, telephone: e.target.value })}
                          className="w-full rounded-xl border border-border bg-white px-3 py-2.5 text-xs text-foreground focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all"
                        />
                        <input
                          type="text"
                          placeholder="Commune"
                          value={bottomFormData.commune}
                          onChange={(e) => setBottomFormData({ ...bottomFormData, commune: e.target.value })}
                          className="w-full rounded-xl border border-border bg-white px-3 py-2.5 text-xs text-foreground focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all"
                        />
                      </div>

                      <div className="pt-1">
                        <label className="flex items-start gap-2 text-[11px] text-muted cursor-pointer">
                          <input
                            type="checkbox"
                            checked={bottomFormData.opt_in}
                            onChange={(e) => setBottomFormData({ ...bottomFormData, opt_in: e.target.checked })}
                            className="mt-0.5 h-3.5 w-3.5 rounded border-border text-brand focus:ring-brand"
                          />
                          <span>J'accepte de recevoir le guide PDF gratuit par email.</span>
                        </label>
                      </div>

                      <button
                        type="submit"
                        disabled={bottomLoading}
                        className="group w-full inline-flex items-center justify-center gap-2 rounded-full bg-brand py-3.5 px-6 text-sm font-bold text-white shadow-md hover:bg-brand-hover transition-all disabled:opacity-70 active:scale-[0.98]"
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
                      <div className="mx-auto h-12 w-12 rounded-full bg-success/15 text-success flex items-center justify-center">
                        <Check className="h-6 w-6 stroke-[2.5]" />
                      </div>
                      <h4 className="font-bold text-lg text-foreground">Guide envoyé avec succès !</h4>
                      <p className="text-xs text-muted">
                        Vérifiez votre boîte mail à <strong>{bottomFormData.email}</strong>.
                      </p>
                      <Link
                        href="/guide-vendeur"
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-5 py-2.5 text-xs font-bold text-white hover:bg-brand-hover transition-all"
                      >
                        <BookOpen className="h-3.5 w-3.5" />
                        <span>Ouvrir l'édition numérique</span>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── 8. PIED DE PAGE LÉGAL & CONTACT (OBLIGATOIRE RGPD / IAD) ─── */}
        <footer className="bg-white px-4 sm:px-6 py-12 border-t border-border">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-8 border-b border-border">
              <div>
                <span className="font-script text-3xl text-foreground font-medium block">
                  Alexandre Lopez
                </span>
                <span className="text-[11px] font-bold text-muted uppercase tracking-[0.16em]">
                  Conseiller en immobilier iad · Provence Verte & Verdon
                </span>
              </div>

              {/* Téléphone en texte HTML pur selon les règles de marque */}
              <div className="flex flex-wrap items-center gap-6 text-sm">
                <a
                  href={'tel:' + PHONE_RAW}
                  className="inline-flex items-center gap-2 font-bold text-brand hover:text-brand-hover"
                >
                  <Phone className="h-4 w-4" />
                  <span>{PHONE_DISPLAY}</span>
                </a>
                <a
                  href={'mailto:' + EMAIL}
                  className="inline-flex items-center gap-2 text-muted hover:text-foreground"
                >
                  <Mail className="h-4 w-4" />
                  <span>{EMAIL}</span>
                </a>
              </div>
            </div>

            {/* Mentions légales complètes */}
            <div className="text-[11px] text-muted leading-relaxed space-y-3">
              <p>
                <strong>Mentions Légales & Statut Professionnel :</strong> EI Alexandre Lopez, mandataire indépendant en immobilier (sans détention de fonds), agent commercial de la SAS I@D France immatriculé au RSAC de Draguignan, titulaire de la carte de démarchage immobilier pour le compte de la société I@D France SAS. Tous les conseillers iad sont des agents commerciaux indépendants de la SAS I@D France.
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
