'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  Printer,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  LayoutGrid,
  Mail,
  Copy,
  Check,
  Share2,
  ArrowLeft,
  Search,
  Layers,
  Sparkles,
  AlignLeft,
  AlignCenter,
} from 'lucide-react'
import { GUIDE_PAGES, GUIDE_MODULES } from './GuidePagesData'
import { GUIDE_PAGES_V1, GUIDE_MODULES_V1 } from './GuidePagesDataV1'
import { NURTURING_EMAILS, type NurturingEmail } from './NurturingEmailsData'
import { A4PageRenderer } from './A4PageRenderer'
import {
  CoverTemplate,
  TestimonialTemplate,
  WelcomePhoneTemplate,
  NumberedQuestionsTemplate,
  NumberedStatsTemplate,
  ProsAndConsTemplate,
  StageCoverTemplate,
  SplitPhotoTextTemplate,
  ChecklistBadgesTemplate,
  ChecklistPhotoBottomTemplate,
  ChecklistPhotoSideTemplate,
  StagingComparisonVsTemplate,
  ArticleTwoColumnsPhotoTopTemplate,
  ArticlePhotoBottomTemplate,
  ThreeColumnsBannerTemplate,
  BeforeAfterPhotographyTemplate,
  BackcoverTemplate,
} from './templates'

type ViewMode = 'a4_sheets' | 'templates_studio' | 'interactive_reader' | 'nurturing_hub'

const TEMPLATE_CATALOG = [
  {
    id: 'cover',
    name: '01 · Couverture Principale',
    archetype: 'CoverTemplate',
    alignment: 'Aligné à Gauche',
    alignIcon: AlignLeft,
    description: 'Grand visuel de chambre apaisante + Titre Left + Cartouche bas droit.',
    component: <CoverTemplate />,
  },
  {
    id: 'testimonial',
    name: '02 · Témoignage Client Full Photo',
    archetype: 'TestimonialTemplate',
    alignment: '100% Centré',
    alignIcon: AlignCenter,
    description: 'Photo plein format + Carte sombre centrale translucide + 5 étoiles blanches.',
    component: <TestimonialTemplate />,
  },
  {
    id: 'welcome',
    name: '03 · Welcome & iPhone Mockup',
    archetype: 'WelcomePhoneTemplate',
    alignment: 'Aligné à Gauche',
    alignIcon: AlignLeft,
    description: 'Titre minuscule "welcome", bio & coordonnées + Mockup iPhone réaliste.',
    component: <WelcomePhoneTemplate />,
  },
  {
    id: 'ask_yourself',
    name: '04 · Ask Yourself... (3 Questions)',
    archetype: 'NumberedQuestionsTemplate',
    alignment: 'Aligné à Gauche',
    alignIcon: AlignLeft,
    description: 'Badge noir rectangulaire + Chiffres 01/02/03 + Filets + Cadre conditionnel.',
    component: <NumberedQuestionsTemplate />,
  },
  {
    id: 'consider_this',
    name: '05 · Consider This (4 Statistiques)',
    archetype: 'NumberedStatsTemplate',
    alignment: 'Aligné à Gauche',
    alignIcon: AlignLeft,
    description: 'Badge noir + Chiffres 01/02/03/04 + Filets horizontaux fins + Encart récapitulatif.',
    component: <NumberedStatsTemplate />,
  },
  {
    id: 'pros_cons',
    name: '06 · Pros & Cons (2 Colonnes)',
    archetype: 'ProsAndConsTemplate',
    alignment: 'Titres & En-têtes Centrés',
    alignIcon: AlignCenter,
    description: 'Titre centré "Pros & Cons" + 2 colonnes équilibrées séparées par filet vertical.',
    component: <ProsAndConsTemplate />,
  },
  {
    id: 'stage_cover',
    name: '07 · Page de Garde de Chapitre',
    archetype: 'StageCoverTemplate',
    alignment: 'Aligné à Gauche',
    alignIcon: AlignLeft,
    description: 'Photo d’ambiance sombre + Badge STAGE ONE/TWO/THREE + Grand titre blanc.',
    component: <StageCoverTemplate />,
  },
  {
    id: 'split_photo',
    name: '08 · Split 50/50 Photo Verticale',
    archetype: 'SplitPhotoTextTemplate',
    alignment: 'Aligné à Gauche',
    alignIcon: AlignLeft,
    description: 'Photo verticale 44% à gauche + Titre majuscule & Corps de texte à droite.',
    component: <SplitPhotoTextTemplate />,
  },
  {
    id: 'checklist_badges',
    name: '09 · Checklist Badges Noirs',
    archetype: 'ChecklistBadgesTemplate',
    alignment: 'Aligné à Gauche',
    alignIcon: AlignLeft,
    description: 'Titre "Preparing your home" + Badges rectangulaires noirs (MAKE REPAIRS, etc.).',
    component: <ChecklistBadgesTemplate />,
  },
  {
    id: 'checklist_bottom_photo',
    name: '10 · Badges Noirs + Photo Panoramique Bas',
    archetype: 'ChecklistPhotoBottomTemplate',
    alignment: 'Aligné à Gauche',
    alignIcon: AlignLeft,
    description: 'Badges en haut + Grande photo d’intérieur horizontale en bas.',
    component: <ChecklistPhotoBottomTemplate />,
  },
  {
    id: 'checklist_side_photo',
    name: '11 · Badges Noirs + Photo Latérale',
    archetype: 'ChecklistPhotoSideTemplate',
    alignment: 'Aligné à Gauche',
    alignIcon: AlignLeft,
    description: 'Badges et textes à gauche + Photo verticale d’ambiance à droite.',
    component: <ChecklistPhotoSideTemplate />,
  },
  {
    id: 'staging_vs',
    name: '12 · Comparatif Staging VS',
    archetype: 'StagingComparisonVsTemplate',
    alignment: 'Titre & Comparatif Centrés',
    alignIcon: AlignCenter,
    description: 'Titre centré "staging your home" + Double photo côte à côte avec badge VS.',
    component: <StagingComparisonVsTemplate />,
  },
  {
    id: 'article_top_photo',
    name: '13 · Article Photo Haut + 2 Colonnes',
    archetype: 'ArticleTwoColumnsPhotoTopTemplate',
    alignment: 'Titre Centré',
    alignIcon: AlignCenter,
    description: 'Photo panoramique en haut + Titre centré + 2 colonnes de texte.',
    component: <ArticleTwoColumnsPhotoTopTemplate />,
  },
  {
    id: 'cma_article',
    name: '14 · CMA vs Expertise + Photo Bas',
    archetype: 'ArticlePhotoBottomTemplate',
    alignment: 'Titre Centré',
    alignIcon: AlignCenter,
    description: 'Titre centré "CMA VS. APPRAISAL" + 4 paragraphes + Photo panoramique en bas.',
    component: <ArticlePhotoBottomTemplate />,
  },
  {
    id: 'three_columns_banner',
    name: '15 · 3 Colonnes & Bandeau Noir Bas',
    archetype: 'ThreeColumnsBannerTemplate',
    alignment: 'Titre Centré',
    alignIcon: AlignCenter,
    description: 'Titre centré "places to research" + 3 colonnes numérotées + Bandeau noir plein.',
    component: <ThreeColumnsBannerTemplate />,
  },
  {
    id: 'photography_before_after',
    name: '16 · Photographie Avant / Après',
    archetype: 'BeforeAfterPhotographyTemplate',
    alignment: 'Titre Centré',
    alignIcon: AlignCenter,
    description: 'Titre centré "THE VALUE OF PHOTOGRAPHY" + 2 photos comparatives (Owner vs Pro).',
    component: <BeforeAfterPhotographyTemplate />,
  },
  {
    id: 'backcover',
    name: '17 · Quatrième de Couverture Dark',
    archetype: 'BackcoverTemplate',
    alignment: '100% Centré',
    alignIcon: AlignCenter,
    description: 'Fond noir profond + Titre Alexandre Lopez + Citation + Cartouche coordonnées.',
    component: <BackcoverTemplate />,
  },
]

export default function GuideViewer() {
  const [guideVersion, setGuideVersion] = useState<'v2' | 'v1'>('v2')
  const [viewMode, setViewMode] = useState<ViewMode>('a4_sheets')
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('cover')
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0)
  const [selectedModule, setSelectedModule] = useState<number | null>(null)
  const [copiedEmailId, setCopiedEmailId] = useState<number | null>(null)
  const [copiedLink, setCopiedLink] = useState<boolean>(false)
  const [searchQuery, setSearchQuery] = useState<string>('')

  const currentPages = guideVersion === 'v2' ? GUIDE_PAGES : GUIDE_PAGES_V1
  const currentModules = guideVersion === 'v2' ? GUIDE_MODULES : GUIDE_MODULES_V1

  const activePage = currentPages[currentPageIndex] || currentPages[0]
  const activeTemplate = TEMPLATE_CATALOG.find((t) => t.id === selectedTemplateId) || TEMPLATE_CATALOG[0]

  // Filtrage des pages pour le mode recherche / module
  const filteredPages = currentPages.filter((p) => {
    if (selectedModule !== null && p.moduleNumber !== selectedModule) return false
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase()
      return (
        p.title.toLowerCase().includes(q) ||
        p.subtitle?.toLowerCase().includes(q) ||
        p.moduleTitle.toLowerCase().includes(q) ||
        p.paragraphs?.some((text) => text.toLowerCase().includes(q))
      )
    }
    return true
  })

  const handlePrint = () => {
    window.print()
  }

  const handleCopyEmail = (email: NurturingEmail) => {
    const fullText = `OBJET A : ${email.subjectA}\nOBJET B : ${email.subjectB}\nPRÉHEADER : ${email.preheader}\n\n${email.body}`
    navigator.clipboard.writeText(fullText)
    setCopiedEmailId(email.id)
    setTimeout(() => setCopiedEmailId(null), 2500)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Guide du Vendeur Particulier — Alexandre Lopez',
        text: 'Découvrez le guide stratégique complet pour vendre votre bien immobilier en Provence.',
        url: window.location.href,
      }).catch(() => null)
    } else {
      navigator.clipboard.writeText(window.location.href)
      setCopiedLink(true)
      setTimeout(() => setCopiedLink(false), 2500)
    }
  }

  return (
    <div className="min-h-screen bg-[#F4F1EA] text-[#111111] font-sans antialiased selection:bg-[#111111] selection:text-[#FAF8F5]">
      {/* ─── BARRE DE CONTRÔLE SUPÉRIEURE (NON IMPRIMABLE) ─── */}
      <header className="no-print sticky top-0 z-50 border-b border-[#E5E0D8] bg-[#FAF8F5]/95 backdrop-blur-md px-4 sm:px-8 py-3.5 shadow-xs">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          {/* Logo / Retour site */}
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#8C827A] hover:text-[#111111] transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Accueil</span>
            </Link>
            <div className="h-4 w-[1px] bg-[#E5E0D8] hidden sm:block" />
            <div>
              <div className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#111111]">
                GUIDE VENDEUR PARTICULIER
              </div>
              <div className="text-[9px] text-[#8C827A] tracking-wider uppercase hidden md:block">
                Alexandre Lopez · {guideVersion === 'v2' ? 'Version 2 (En cours)' : 'Archive v1 (Originale)'} ({currentPages.length} Pages)
              </div>
            </div>

            {/* Commutateur de version pour comparaison V2 vs V1 */}
            <div className="flex items-center rounded-lg border border-[#006390]/25 bg-[#006390]/5 p-0.5 text-[11px]">
              <button
                onClick={() => {
                  setGuideVersion('v2')
                  setCurrentPageIndex(0)
                }}
                className={`px-2.5 py-0.5 rounded font-semibold transition-all ${
                  guideVersion === 'v2'
                    ? 'bg-[#006390] text-white shadow-xs'
                    : 'text-[#006390] hover:bg-[#006390]/10'
                }`}
              >
                V2 (Nouvelle)
              </button>
              <button
                onClick={() => {
                  setGuideVersion('v1')
                  setCurrentPageIndex(0)
                }}
                className={`px-2.5 py-0.5 rounded font-semibold transition-all ${
                  guideVersion === 'v1'
                    ? 'bg-zinc-800 text-white shadow-xs'
                    : 'text-zinc-600 hover:bg-zinc-200/60'
                }`}
              >
                V1 (Archive)
              </button>
            </div>
          </div>

          {/* Sélecteur de Mode */}
          <div className="flex items-center rounded-full border border-[#E5E0D8] bg-[#EFECE6] p-1 text-xs">
            <button
              onClick={() => setViewMode('a4_sheets')}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                viewMode === 'a4_sheets'
                  ? 'bg-[#111111] text-[#FAF8F5] shadow-xs'
                  : 'text-[#595959] hover:text-[#111111]'
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Planches A4 (41)</span>
            </button>
            <button
              onClick={() => setViewMode('templates_studio')}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                viewMode === 'templates_studio'
                  ? 'bg-[#111111] text-[#FAF8F5] shadow-xs'
                  : 'text-[#595959] hover:text-[#111111]'
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Gabarits Types</span>
              <span className="ml-1 rounded-full bg-[#E0D9CE] px-1.5 py-0.2 text-[9px] font-bold text-[#111111]">
                17
              </span>
            </button>
            <button
              onClick={() => setViewMode('interactive_reader')}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                viewMode === 'interactive_reader'
                  ? 'bg-[#111111] text-[#FAF8F5] shadow-xs'
                  : 'text-[#595959] hover:text-[#111111]'
              }`}
            >
              <BookOpen className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Lecteur Web</span>
            </button>
            <button
              onClick={() => setViewMode('nurturing_hub')}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                viewMode === 'nurturing_hub'
                  ? 'bg-[#111111] text-[#FAF8F5] shadow-xs'
                  : 'text-[#595959] hover:text-[#111111]'
              }`}
            >
              <Mail className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">E-mails Nurturing</span>
              <span className="ml-1 rounded-full bg-[#E0D9CE] px-1.5 py-0.2 text-[9px] font-bold text-[#111111]">
                8
              </span>
            </button>
          </div>

          {/* Boutons d'Action (Landing Page / Imprimer / Partager) */}
          <div className="flex items-center gap-2">
            <Link
              href="/guide-vendeur"
              className="inline-flex items-center gap-1.5 rounded-full border border-[#0077B6]/30 bg-[#E0F0FA] px-3.5 py-1.5 text-xs font-bold text-[#0077B6] hover:bg-[#0077B6] hover:text-white transition-all shadow-xs"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span className="hidden md:inline">Landing Page</span>
            </Link>
            <button
              onClick={handlePrint}
              title="Imprimer ou enregistrer au format PDF"
              className="inline-flex items-center gap-1.5 rounded-full border border-[#0F172A] bg-[#0F172A] px-3.5 py-1.5 text-xs font-semibold text-white transition-all hover:bg-[#0077B6] shadow-xs"
            >
              <Printer className="h-3.5 w-3.5" />
              <span className="hidden md:inline">Imprimer / PDF</span>
            </button>
            <button
              onClick={handleShare}
              title="Partager ce guide"
              className="rounded-sm border border-[#E5E0D8] bg-white p-1.5 text-[#595959] hover:border-[#111111] hover:text-[#111111] transition-colors"
            >
              {copiedLink ? <Check className="h-4 w-4 text-emerald-600" /> : <Share2 className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* ─── CONTENU PRINCIPAL SELON LE MODE CHOISI ─── */}

      {/* 1. MODE PLANCHES A4 (IMPRIMABLE & EXPORT PDF) */}
      {viewMode === 'a4_sheets' && (
        <div className="mx-auto max-w-5xl py-8 px-4 sm:px-6">
          {/* Bandeau d'explication d'impression */}
          <div className="no-print mb-8 rounded-sm border border-[#D5CEC2] bg-[#FAF8F5] p-5 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-lg font-normal text-[#111111]">
                  Format Éditorial Imprimable (210 × 297 mm)
                </h3>
                <p className="text-xs text-[#595959] mt-0.5 max-w-xl leading-relaxed">
                  Toutes les 41 pages sont générées à partir des 17 composants de gabarits types. Cliquez sur <strong>Imprimer / PDF</strong> pour générer votre livret complet.
                </p>
              </div>
              {/* Filtre rapide par module */}
              <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                <button
                  onClick={() => setSelectedModule(null)}
                  className={`rounded-full px-2.5 py-1 transition-colors ${
                    selectedModule === null
                      ? 'bg-[#111111] text-white'
                      : 'bg-white text-[#595959] border border-[#E5E0D8]'
                  }`}
                >
                  Tous ({currentPages.length})
                </button>
                {currentModules.map((m) => (
                  <button
                    key={m.number}
                    onClick={() => setSelectedModule(m.number)}
                    className={`rounded-full px-2.5 py-1 transition-colors ${
                      selectedModule === m.number
                        ? 'bg-[#111111] text-white'
                        : 'bg-white text-[#595959] border border-[#E5E0D8]'
                    }`}
                  >
                    M0{m.number}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Liste des planches A4 */}
          <div className="space-y-10 print:space-y-0">
            {filteredPages.map((page) => (
              <div
                key={page.pageNumber}
                className="a4-page mx-auto w-full max-w-[210mm] aspect-[210/297] transition-all"
              >
                <A4PageRenderer page={page} isPrintMode={false} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. MODE STUDIO GABARITS TYPES (DESIGN SYSTEM) */}
      {viewMode === 'templates_studio' && (
        <div className="mx-auto max-w-6xl py-8 px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Colonne Gauche : Liste des Gabarits Types */}
            <aside className="no-print lg:col-span-4 rounded-sm border border-[#E5E0D8] bg-[#FAF8F5] p-5 shadow-2xs space-y-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8C827A]">
                  DESIGN SYSTEM · 17 GABARITS TYPES
                </span>
                <h3 className="font-serif text-lg font-normal text-[#111111] mt-1">
                  Catalogue des Composants
                </h3>
                <p className="text-xs text-[#666666] mt-1 leading-relaxed">
                  Sélectionnez un gabarit pour inspecter son rendu isolé, ses règles d’alignement et sa typographie.
                </p>
              </div>

              <div className="max-h-[640px] overflow-y-auto pr-1 space-y-2">
                {TEMPLATE_CATALOG.map((tpl) => {
                  const Icon = tpl.alignIcon
                  const isSelected = selectedTemplateId === tpl.id
                  return (
                    <button
                      key={tpl.id}
                      onClick={() => setSelectedTemplateId(tpl.id)}
                      className={`flex w-full flex-col rounded-sm p-3 text-left transition-all border ${
                        isSelected
                          ? 'bg-[#111111] text-white border-[#111111] shadow-xs'
                          : 'bg-white text-[#222222] border-[#E5E0D8] hover:border-[#111111]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold">{tpl.name}</span>
                        <span
                          className={`inline-flex items-center gap-1 text-[9px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            isSelected
                              ? 'bg-white/20 text-white'
                              : 'bg-[#F2EDE4] text-[#555555]'
                          }`}
                        >
                          <Icon className="h-3 w-3" />
                          {tpl.alignment}
                        </span>
                      </div>
                      <span
                        className={`text-[10px] font-mono mt-1 ${
                          isSelected ? 'text-white/70' : 'text-[#8C827A]'
                        }`}
                      >
                        &lt;{tpl.archetype} /&gt;
                      </span>
                    </button>
                  )
                })}
              </div>
            </aside>

            {/* Colonne Droite : Inspection & Rendu du Gabarit */}
            <main className="lg:col-span-8 space-y-4">
              <div className="no-print rounded-sm border border-[#E5E0D8] bg-[#FAF8F5] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-black">
                      {activeTemplate.name}
                    </span>
                    <span className="text-[10px] font-mono bg-black text-white px-2 py-0.5 rounded-xs">
                      &lt;{activeTemplate.archetype} /&gt;
                    </span>
                  </div>
                  <p className="text-xs text-[#555555] mt-1">
                    {activeTemplate.description}
                  </p>
                </div>

                <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-sm bg-white border border-[#E5E0D8] shrink-0">
                  <activeTemplate.alignIcon className="h-3.5 w-3.5 text-black" />
                  <span>{activeTemplate.alignment}</span>
                </div>
              </div>

              {/* Rendu A4 Isolé */}
              <div className="a4-page mx-auto w-full aspect-[210/297] shadow-xl rounded-sm overflow-hidden border border-black/10">
                {activeTemplate.component}
              </div>
            </main>
          </div>
        </div>
      )}

      {/* 3. MODE LECTEUR INTERACTIF FEUILLETOIR */}
      {viewMode === 'interactive_reader' && (
        <div className="mx-auto max-w-6xl py-8 px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Colonne latérale : Sommaire & Navigation */}
            <aside className="no-print lg:col-span-4 rounded-sm border border-[#E5E0D8] bg-[#FAF8F5] p-5 shadow-2xs">
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-[#8C827A]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher une étape, un mot-clé..."
                    className="w-full rounded-sm border border-[#E5E0D8] bg-white py-1.5 pl-8 pr-3 text-xs text-[#111111] placeholder:text-[#8C827A] focus:border-[#111111] focus:outline-none"
                  />
                </div>
              </div>

              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8C827A] mb-3">
                SOMMAIRE DU GUIDE
              </div>

              <div className="max-h-[600px] overflow-y-auto pr-1 space-y-1.5 text-xs">
                {currentPages.map((page, idx) => (
                  <button
                    key={page.pageNumber}
                    onClick={() => setCurrentPageIndex(idx)}
                    className={`flex w-full items-center justify-between rounded-sm p-2.5 text-left transition-colors ${
                      currentPageIndex === idx
                        ? 'bg-[#111111] text-[#FAF8F5] font-medium'
                        : 'hover:bg-[#EFECE6] text-[#3E3E3E]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <span className="font-mono text-[10px] opacity-70">
                        {String(page.pageNumber).padStart(2, '0')}
                      </span>
                      <span className="truncate">{page.title}</span>
                    </div>
                    <span className="text-[9px] uppercase tracking-wider opacity-60">
                      {page.moduleNumber > 0 ? `M${page.moduleNumber}` : 'INTRO'}
                    </span>
                  </button>
                ))}
              </div>
            </aside>

            {/* Zone centrale de lecture */}
            <main className="lg:col-span-8">
              {/* Navigateur de page */}
              <div className="no-print mb-4 flex items-center justify-between rounded-sm border border-[#E5E0D8] bg-[#FAF8F5] px-4 py-2 text-xs">
                <button
                  disabled={currentPageIndex === 0}
                  onClick={() => setCurrentPageIndex((prev) => Math.max(0, prev - 1))}
                  className="flex items-center gap-1 font-semibold uppercase tracking-wider text-[#111111] disabled:opacity-30"
                >
                  <ChevronLeft className="h-4 w-4" /> Page Précédente
                </button>
                <span className="font-mono text-xs text-[#8C827A]">
                  Page {currentPageIndex + 1} sur {currentPages.length}
                </span>
                <button
                  disabled={currentPageIndex === currentPages.length - 1}
                  onClick={() => setCurrentPageIndex((prev) => Math.min(currentPages.length - 1, prev + 1))}
                  className="flex items-center gap-1 font-semibold uppercase tracking-wider text-[#111111] disabled:opacity-30"
                >
                  Page Suivante <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              {/* Rendu de la page active */}
              <div className="a4-page mx-auto w-full aspect-[210/297] shadow-lg rounded-sm overflow-hidden">
                <A4PageRenderer page={activePage} isPrintMode={false} />
              </div>
            </main>
          </div>
        </div>
      )}

      {/* 4. MODE HUB SÉQUENCE E-MAILS DE NURTURING */}
      {viewMode === 'nurturing_hub' && (
        <div className="mx-auto max-w-5xl py-8 px-4 sm:px-6">
          <div className="mb-8 rounded-sm border border-[#D5CEC2] bg-[#FAF8F5] p-6 shadow-2xs">
            <span className="inline-block text-[10px] font-bold uppercase tracking-[0.2em] text-[#8C827A] mb-1">
              STRATÉGIE DE CONVERSION POST-TÉLÉCHARGEMENT
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#111111]">
              La Séquence E-mails de Nurturing (8 Épisodes)
            </h2>
            <p className="text-xs sm:text-sm text-[#595959] mt-2 max-w-3xl leading-relaxed">
              Ces e-mails sont calibrés pour être envoyés automatiquement aux propriétaires qui téléchargent votre guide. Chaque message respecte le tempo psychologique du vendeur, apporte une immense valeur pédagogique et propose une transition naturelle vers un audit sans engagement.
            </p>
          </div>

          {/* Liste des 8 E-mails */}
          <div className="space-y-8">
            {NURTURING_EMAILS.map((email) => (
              <div
                key={email.id}
                className="rounded-sm border border-[#E5E0D8] bg-[#FAF8F5] p-6 sm:p-8 shadow-xs"
              >
                {/* En-tête de l'e-mail */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#E5E0D8] pb-4 gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-[#111111] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                        E-MAIL 0{email.id}
                      </span>
                      <span className="text-xs font-semibold text-[#8C827A]">
                        {email.timing}
                      </span>
                    </div>
                    <h3 className="font-serif text-lg sm:text-xl font-normal text-[#111111] mt-1.5">
                      {email.phase}
                    </h3>
                  </div>

                  <button
                    onClick={() => handleCopyEmail(email)}
                    className="inline-flex items-center gap-1.5 rounded-sm border border-[#111111] bg-white px-3 py-1.5 text-xs font-semibold text-[#111111] hover:bg-[#111111] hover:text-white transition-colors"
                  >
                    {copiedEmailId === email.id ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                        <span>Copié dans le presse-papier !</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>Copier l'e-mail complet</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Objets & Preheader */}
                <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="rounded-sm bg-[#FAF8F5] border border-[#E5E0D8] p-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C827A] block mb-1">
                      Objet A (Standard)
                    </span>
                    <p className="font-medium text-[#111111]">{email.subjectA}</p>
                  </div>
                  <div className="rounded-sm bg-[#FAF8F5] border border-[#E5E0D8] p-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C827A] block mb-1">
                      Objet B (Test A/B - Curiosité)
                    </span>
                    <p className="font-medium text-[#111111]">{email.subjectB}</p>
                  </div>
                </div>

                <div className="mt-3 rounded-sm bg-[#FAF8F5] border border-[#E5E0D8] p-3 text-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C827A] block mb-1">
                    Texte de Prévisualisation (Preheader)
                  </span>
                  <p className="italic text-[#595959]">{email.preheader}</p>
                </div>

                {/* Corps de l'e-mail */}
                <div className="mt-6 border-t border-[#E5E0D8] pt-5">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8C827A] block mb-3">
                    CORPS DU MESSAGE
                  </span>
                  <div className="whitespace-pre-line text-xs sm:text-sm text-[#2C2C2C] leading-relaxed bg-white p-5 rounded-sm border border-[#E5E0D8] font-sans">
                    {email.body}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
