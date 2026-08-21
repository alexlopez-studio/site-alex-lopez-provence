'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus, ArrowUpRight, Download, Eye, Check } from 'lucide-react'

// ─── APPLE EXACT DESIGN SYSTEM SPECIFICATIONS ───
// Viewport Content: 980px max-width centered
// Colors: #000000 (Black), #f5f5f7 (Primary Text), #86868b (Secondary Text), #1d1d1f (Row Rule & Border)
// Accent: #0071e3 (Apple Classic Blue)
// Spacing: Section padding 140px-180px, Drawer padding 70px / 180px

const DRAWERS = [
  {
    id: 'dvf-pricing',
    tag: 'Données & Notariat',
    headline: 'La vérité des prix ne se trouve pas sur les portails d’annonces.',
    lead: 'Les prix affichés sur Internet intègrent souvent une marge d’espérance irréaliste. En Provence Verte, l’écart moyen entre le prix demandé et l’acte authentique signé chez le notaire atteint 6% à 9%.',
    body: 'Le guide détaille la méthode d’exploitation de la base DVF (Demandes de Valeurs Foncières) pour analyser les ventes réelles de votre quartier sur les 24 derniers mois, pondérées par l’état du bien, son exposition et son calme.',
    stat: '−9%',
    statDesc: 'de décote moyenne évitée grâce à un positionnement DVF factuel',
  },
  {
    id: 'visual-staging',
    tag: 'Marketing Visuel',
    headline: '95% des acquéreurs effectuent leur premier tri sur un écran.',
    lead: 'Un reportage photographique avec grand angle calibré et lumière naturelle provençale multiplie par trois le nombre de demandes qualifiées dès la première semaine.',
    body: 'Nous vous livrons la checklist de désencombrement pièce par pièce (20 points de contrôle) pour transformer chaque espace en coup de cœur visuel immédiat, sans engager de dépenses superflues.',
    stat: 'x3',
    statDesc: 'de consultations qualifiées sur une annonce aux standards pro',
  },
  {
    id: 'buyer-vetting',
    tag: 'Sécurité Financière',
    headline: 'Filtrer la solvabilité bancaire avant de franchir votre porte.',
    lead: 'Plus d’un tiers des compromis entre particuliers échouent faute d’accord de prêt après 45 jours d’attente.',
    body: 'Le guide fournit la grille exacte de questions pour vérifier l’apport personnel, la simulation bancaire actualisée et la solidité du plan de financement de vos visiteurs avant toute visite.',
    stat: '45 jours',
    statDesc: 'économisés en écartant immédiatement les profils non finançables',
  },
  {
    id: 'legal-alur',
    tag: 'Urbanisme & Loi ALUR',
    headline: 'Un dossier juridique verrouillé pour une signature sans faille.',
    lead: 'Diagnostics techniques, conformité d’assainissement, servitudes et formalités Loi ALUR constituent la première cause d’abandon des vendeurs particuliers.',
    body: 'Apprenez à constituer votre dossier complet dès la mise en vente pour rassurer le notaire, éviter toute clause suspensive piégeuse et purger le délai de rétractation sans risque.',
    stat: '100%',
    statDesc: 'de sérénité juridique lors de la rédaction du compromis',
  },
]

const CHAPTERS = [
  {
    num: '01',
    title: 'Préparation & Diagnostic du Logement',
    pages: 'P. 07 – 13',
    summary: 'Les 20 réparations stratégiques, la checklist extérieure et le home staging émotionnel.',
  },
  {
    num: '02',
    title: 'Stratégie de Prix & Données DVF',
    pages: 'P. 14 – 18',
    summary: 'Calculer le juste prix au m² en croisant l’historique notarial et la concurrence active.',
  },
  {
    num: '03',
    title: 'Marketing Visuel & Diffusion Ciblée',
    pages: 'P. 19 – 23',
    summary: 'Photographie professionnelle, rédaction de l’annonce et choix des canaux de diffusion.',
  },
  {
    num: '04',
    title: 'Organisation des Visites & Tri Bancaire',
    pages: 'P. 24 – 27',
    summary: 'Le script de qualification des acheteurs et le protocole de visite sans stress.',
  },
  {
    num: '05',
    title: 'Négociation & Défense du Prix',
    pages: 'P. 28 – 32',
    summary: 'Répondre aux objections sur le prix sans agressivité et formaliser l’offre d’achat.',
  },
  {
    num: '06',
    title: 'Dossier Notarial & Clôture de Vente',
    pages: 'P. 33 – 41',
    summary: 'Diagnostics obligatoires, conformité ALUR, compromis de vente et signature définitive.',
  },
]

export function GuideLandingPage() {
  const [openDrawerId, setOpenDrawerId] = useState<string | null>('dvf-pricing')
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-[#000000] text-[#f5f5f7] font-sans antialiased selection:bg-[#0071e3] selection:text-white">
      {/* ─── 1. APPLE LOCAL NAVIGATION BAR ─── */}
      <nav className="sticky top-0 z-50 bg-[#000000]/80 backdrop-blur-xl border-b border-[#1d1d1f]">
        <div className="max-w-[980px] mx-auto px-6 h-12 flex items-center justify-between text-xs">
          <Link href="/" className="font-semibold text-[#f5f5f7] hover:text-white transition-colors">
            Alexandre Lopez <span className="text-[#86868b] font-normal">| Guide Vendeur</span>
          </Link>

          <div className="flex items-center gap-6">
            <a href="#methode" className="text-[#86868b] hover:text-[#f5f5f7] transition-colors hidden sm:inline">
              Méthode
            </a>
            <a href="#sommaire" className="text-[#86868b] hover:text-[#f5f5f7] transition-colors hidden sm:inline">
              Sommaire
            </a>
            <Link
              href="/guide-vendeur"
              className="text-[#0071e3] hover:text-[#2997ff] transition-colors font-medium flex items-center gap-1"
            >
              <Eye className="h-3.5 w-3.5" />
              <span>Feuilleter</span>
            </Link>
            <a
              href="#telecharger"
              className="bg-[#0071e3] hover:bg-[#0077ed] text-white font-medium px-3.5 py-1 rounded-full text-xs transition-all"
            >
              Télécharger
            </a>
          </div>
        </div>
      </nav>

      {/* ─── 2. HERO PRINCIPAL : ÉDITORIAL, LARGE & ÉPURÉ ─── */}
      <section className="pt-24 pb-20 md:pt-36 md:pb-32 px-6">
        <div className="max-w-[980px] mx-auto text-center space-y-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#86868b]">
            Édition Propriétaire · Provence Verte & Verdon
          </p>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[#f5f5f7] leading-[1.06] max-w-[880px] mx-auto">
            Vendre votre maison au juste prix. Sans intermédiaire improvisé.
          </h1>

          <p className="text-xl sm:text-2xl text-[#86868b] font-normal leading-relaxed max-w-[760px] mx-auto pt-2">
            Le manuel de référence en 41 pages. Données notariales, grilles d’audit, conformité légale et méthodes de négociation éprouvées sur le terrain.
          </p>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4 text-sm">
            <a
              href="#telecharger"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#0071e3] hover:bg-[#0077ed] text-white font-semibold px-7 py-3.5 rounded-full transition-all"
            >
              <Download className="h-4 w-4" />
              <span>Recevoir le Guide (PDF A4 Gratuit)</span>
            </a>

            <Link
              href="/guide-vendeur"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-[#0071e3] hover:text-[#2997ff] font-semibold px-6 py-3.5 transition-colors"
            >
              <span>Feuilleter l’édition numérique</span>
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Photographie Grand Format en Pleine Largeur */}
        <div className="mt-16 max-w-[980px] mx-auto">
          <div className="relative rounded-2xl overflow-hidden bg-[#161617] border border-[#1d1d1f] aspect-[16/9] shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85"
              alt="Architecture Provençale"
              className="h-full w-full object-cover brightness-[85%]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#000000]/80 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between text-xs text-white">
              <div>
                <span className="font-bold text-sm block">41 Planches A4 Imprimables</span>
                <span className="text-[#86868b]">Conçu pour les propriétaires en Provence</span>
              </div>
              <span className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-md border border-white/15 font-semibold">
                Accès Libre
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 3. SECTION PRINCIPALE : LES TIROIRS APPLE (EXPANDABLE DRAWERS) ─── */}
      <section id="methode" className="py-24 md:py-36 px-6 border-t border-[#1d1d1f]">
        <div className="max-w-[980px] mx-auto space-y-16">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#86868b]">
              Méthodologie & Rigueur
            </p>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#f5f5f7] leading-tight max-w-[700px]">
              L’innovation dans la méthode. La sérénité dans les faits.
            </h2>
          </div>

          {/* Liste des Tiroirs Interactifs Style Apple Vision Pro */}
          <div className="border-t border-[#1d1d1f]">
            {DRAWERS.map((drawer) => {
              const isOpen = openDrawerId === drawer.id
              return (
                <div key={drawer.id} className="border-b border-[#1d1d1f]">
                  <button
                    onClick={() => setOpenDrawerId(isOpen ? null : drawer.id)}
                    className="w-full py-8 sm:py-10 text-left flex items-start justify-between gap-6 group transition-colors"
                  >
                    <div className="space-y-2 max-w-[760px]">
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#86868b] block">
                        {drawer.tag}
                      </span>
                      <h3 className="text-2xl sm:text-3xl font-bold text-[#f5f5f7] group-hover:text-[#0071e3] transition-colors leading-snug">
                        {drawer.headline}
                      </h3>
                    </div>

                    <div className="h-10 w-10 rounded-full bg-[#161617] border border-[#1d1d1f] flex items-center justify-center shrink-0 text-[#f5f5f7] group-hover:border-[#0071e3] transition-colors">
                      {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                    </div>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="pb-12 pt-2 grid md:grid-cols-12 gap-8 text-[#86868b] text-base sm:text-lg leading-relaxed">
                          <div className="md:col-span-8 space-y-4">
                            <p className="text-[#f5f5f7] font-medium leading-relaxed">
                              {drawer.lead}
                            </p>
                            <p className="text-[#86868b] text-sm sm:text-base leading-relaxed">
                              {drawer.body}
                            </p>
                          </div>

                          <div className="md:col-span-4 bg-[#161617] border border-[#1d1d1f] rounded-2xl p-6 flex flex-col justify-center">
                            <div className="text-3xl sm:text-4xl font-bold text-[#0071e3] tracking-tight mb-1">
                              {drawer.stat}
                            </div>
                            <div className="text-xs text-[#86868b] leading-snug">
                              {drawer.statDesc}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ─── 4. SECTION SOMMAIRE DES 6 CHAPITRES DU GUIDE ─── */}
      <section id="sommaire" className="py-24 md:py-36 px-6 border-t border-[#1d1d1f]">
        <div className="max-w-[980px] mx-auto space-y-16">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#86868b]">
              Architecture du Document
            </p>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#f5f5f7]">
              Sommaire des 41 pages
            </h2>
            <p className="text-[#86868b] text-base sm:text-lg max-w-[650px]">
              Chaque étape répond à un objectif précis, avec des fiches de contrôle prêtes à être annotées et appliquées.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {CHAPTERS.map((chap) => (
              <div
                key={chap.num}
                className="bg-[#161617] border border-[#1d1d1f] rounded-2xl p-8 flex flex-col justify-between hover:border-white/20 transition-all space-y-6"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-[#86868b]">
                    <span className="font-semibold uppercase tracking-wider">Chapitre {chap.num}</span>
                    <span className="text-[#0071e3] font-medium">{chap.pages}</span>
                  </div>
                  <h3 className="text-xl font-bold text-[#f5f5f7] leading-snug">
                    {chap.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#86868b] leading-relaxed">
                    {chap.summary}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#1d1d1f] flex items-center justify-between text-xs text-[#0071e3] font-medium">
                  <span>Fiches & gabarits inclus</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 5. SECTION FORMULAIRE DE TÉLÉCHARGEMENT MINIMALISTE ─── */}
      <section id="telecharger" className="py-24 md:py-36 px-6 border-t border-[#1d1d1f]">
        <div className="max-w-[700px] mx-auto space-y-10">
          <div className="text-center space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#86868b]">
              Téléchargement Gratuit
            </p>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#f5f5f7]">
              Recevoir l’édition 2026
            </h2>
            <p className="text-sm sm:text-base text-[#86868b]">
              Indiquez votre adresse e-mail pour recevoir le guide PDF et accéder au lecteur web interactif.
            </p>
          </div>

          {submitted ? (
            <div className="bg-[#161617] border border-[#1d1d1f] rounded-3xl p-10 text-center space-y-6">
              <div className="h-12 w-12 rounded-full bg-[#0071e3] text-white flex items-center justify-center mx-auto">
                <Check className="h-6 w-6 stroke-[3]" />
              </div>
              <h3 className="text-2xl font-bold text-[#f5f5f7]">
                Votre exemplaire est prêt, {formData.firstName}.
              </h3>
              <p className="text-sm text-[#86868b] max-w-md mx-auto leading-relaxed">
                Vous pouvez dès à présent feuilleter les 41 planches sur notre lecteur web haute définition.
              </p>
              <div className="pt-2">
                <Link
                  href="/guide-vendeur"
                  className="inline-flex items-center gap-2 bg-[#0071e3] hover:bg-[#0077ed] text-white font-semibold px-8 py-3.5 rounded-full text-sm transition-all"
                >
                  <Eye className="h-4 w-4" />
                  <span>Ouvrir le lecteur web</span>
                </Link>
              </div>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="bg-[#161617] border border-[#1d1d1f] rounded-3xl p-8 sm:p-12 space-y-5"
            >
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[#86868b]">Prénom *</label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    placeholder="Jean"
                    className="w-full px-4 py-3 rounded-xl bg-[#000000] border border-[#1d1d1f] text-[#f5f5f7] placeholder:text-[#555555] text-sm focus:outline-hidden focus:border-[#0071e3] transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[#86868b]">Nom *</label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    placeholder="Dupont"
                    className="w-full px-4 py-3 rounded-xl bg-[#000000] border border-[#1d1d1f] text-[#f5f5f7] placeholder:text-[#555555] text-sm focus:outline-hidden focus:border-[#0071e3] transition-colors"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[#86868b]">Adresse e-mail *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="jean.dupont@email.com"
                    className="w-full px-4 py-3 rounded-xl bg-[#000000] border border-[#1d1d1f] text-[#f5f5f7] placeholder:text-[#555555] text-sm focus:outline-hidden focus:border-[#0071e3] transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[#86868b]">Téléphone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="06 12 34 56 78"
                    className="w-full px-4 py-3 rounded-xl bg-[#000000] border border-[#1d1d1f] text-[#f5f5f7] placeholder:text-[#555555] text-sm focus:outline-hidden focus:border-[#0071e3] transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[#86868b]">Commune du bien en Provence</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="Cotignac, Brignoles, Barjols, Saint-Maximin..."
                  className="w-full px-4 py-3 rounded-xl bg-[#000000] border border-[#1d1d1f] text-[#f5f5f7] placeholder:text-[#555555] text-sm focus:outline-hidden focus:border-[#0071e3] transition-colors"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#0071e3] hover:bg-[#0077ed] text-white font-semibold text-sm py-4 rounded-xl transition-all mt-4 cursor-pointer"
              >
                Télécharger le Guide Vendeur (PDF)
              </button>

              <p className="text-[11px] text-center text-[#86868b] pt-1">
                Aucun spam · Vos données ne sont jamais cédées
              </p>
            </form>
          )}
        </div>
      </section>

      {/* ─── 6. FOOTER DISCRET APPLE ─── */}
      <footer className="py-12 px-6 border-t border-[#1d1d1f] text-xs text-[#86868b]">
        <div className="max-w-[980px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div>
            <span className="font-script text-2xl text-[#f5f5f7] block mb-1">Alexandre Lopez</span>
            <span>Conseiller en immobilier iad France · Provence Verte & Verdon</span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/" className="hover:text-[#f5f5f7] transition-colors">Accueil</Link>
            <Link href="/vendre" className="hover:text-[#f5f5f7] transition-colors">Vendre</Link>
            <Link href="/guide-vendeur" className="hover:text-[#f5f5f7] transition-colors">Planches A4 (41)</Link>
            <Link href="/contact" className="hover:text-[#f5f5f7] transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
