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

export interface TemplateCatalogItem {
  id: string
  name: string
  layoutCode: string
  category: 'Couvertures' | 'Éditorial' | 'Grilles & Checklists' | 'Comparatifs' | 'Méthode & Chiffres'
  archetype: string
  alignment: string
  alignIcon: React.ComponentType<{ className?: string }>
  description: string
  structure: string
  usedInPages: string
  component: React.ReactElement
}

const TEMPLATE_CATALOG: TemplateCatalogItem[] = [
  {
    id: 'cover',
    name: 'Couverture Principale Prestige',
    layoutCode: 'LAYOUT A1',
    category: 'Couvertures',
    archetype: 'CoverTemplate',
    alignment: 'Aligné à Gauche',
    alignIcon: AlignLeft,
    description: 'Couverture pleine page monographe, titrage officiel et attributions claires.',
    structure: 'Pleine page photo architecturale + Titrage majuscule d’autorité + Signature et millésime',
    usedInPages: 'Page 01',
    component: <CoverTemplate />,
  },
  {
    id: 'stage_cover',
    name: 'Garde d’Ouverture de Chapitre',
    layoutCode: 'LAYOUT A2',
    category: 'Couvertures',
    archetype: 'StageCoverTemplate',
    alignment: 'Aligné à Gauche',
    alignIcon: AlignLeft,
    description: 'Séparateur de chapitre en Bleu Nuit avec cadrage stratégique et photo feutrée.',
    structure: 'Bleu Nuit `#001D2D` + Titre du chapitre + Voile photo provençale + Paragraphes de cadrage',
    usedInPages: 'Pages 07, 13, 19, 23, 28, 32, 36',
    component: <StageCoverTemplate />,
  },
  {
    id: 'backcover',
    name: 'Quatrième de Couverture Prestige',
    layoutCode: 'LAYOUT A3',
    category: 'Couvertures',
    archetype: 'BackcoverTemplate',
    alignment: '100% Centré',
    alignIcon: AlignCenter,
    description: 'Clôture de livre en Bleu Nuit, citation, coordonnées directes et mentions légales.',
    structure: 'Bleu Nuit + Cartouche contacts directs + Mentions officielles iad France',
    usedInPages: 'Page 41 (Dernière page)',
    component: <BackcoverTemplate />,
  },
  {
    id: 'welcome',
    name: 'Édito d’Autorité & Portrait',
    layoutCode: 'LAYOUT B1',
    category: 'Éditorial',
    archetype: 'WelcomePhoneTemplate',
    alignment: 'Aligné à Gauche',
    alignIcon: AlignLeft,
    description: 'Lettre de l’auteur, bio & coordonnées + Portrait cadré d’Alexandre Lopez.',
    structure: 'Lettre éditoriale 4 paragraphes + Portrait cadré + Signature et coordonnées officielles',
    usedInPages: 'Page 03',
    component: <WelcomePhoneTemplate />,
  },
  {
    id: 'testimonial',
    name: 'Témoignage Propriétaire Sérénité',
    layoutCode: 'LAYOUT B2',
    category: 'Éditorial',
    archetype: 'TestimonialTemplate',
    alignment: '100% Centré',
    alignIcon: AlignCenter,
    description: 'Photo de bastide pleine page + Étoiles dorées et citation en typographie serif.',
    structure: 'Pleine page paysage + 5 étoiles dorées feutrées + Citation serif et attribution client',
    usedInPages: 'Page 02',
    component: <TestimonialTemplate />,
  },
  {
    id: 'checklist_bottom_photo',
    name: 'Photo Pleine Page & 4 Points Typographiques',
    layoutCode: 'LAYOUT C1',
    category: 'Grilles & Checklists',
    archetype: 'ChecklistPhotoBottomTemplate',
    alignment: 'Aligné à Gauche',
    alignIcon: AlignLeft,
    description: 'Photo d’exception pleine page (full bleed) + 4 points en pure typographie avec filets fins.',
    structure: 'Fond photo pleine page + Voile feutré Quiet Luxury + Grille 2x2 typographique pure + Citation conseil',
    usedInPages: 'Pages 11, 15, 22, 27, 31',
    component: <ChecklistPhotoBottomTemplate />,
  },
  {
    id: 'checklist_badges',
    name: 'Photo Pleine Page & Dispositifs Juridiques',
    layoutCode: 'LAYOUT C2',
    category: 'Grilles & Checklists',
    archetype: 'ChecklistBadgesTemplate',
    alignment: 'Aligné à Gauche',
    alignIcon: AlignLeft,
    description: 'Photo pleine page + 4 dispositifs juridiques présentés en pure typographie aérée sans cards.',
    structure: 'Fond photo pleine page + Voile feutré + 4 lignes typographiques avec tags + Conseil',
    usedInPages: 'Page 09',
    component: <ChecklistBadgesTemplate />,
  },
  {
    id: 'checklist_side_photo',
    name: 'Photo Pleine Page & Points de Contrôle',
    layoutCode: 'LAYOUT C3',
    category: 'Grilles & Checklists',
    archetype: 'ChecklistPhotoSideTemplate',
    alignment: 'Aligné à Gauche',
    alignIcon: AlignLeft,
    description: 'Photo pleine page + 5 points de contrôle méthodiques en typographie pure sans cards.',
    structure: 'Fond photo pleine page + Voile feutré + 5 lignes typographiques + Conseil',
    usedInPages: 'Page 12',
    component: <ChecklistPhotoSideTemplate />,
  },
  {
    id: 'split_photo',
    name: 'Photo Pleine Page & Protocole Préparation',
    layoutCode: 'LAYOUT C4',
    category: 'Grilles & Checklists',
    archetype: 'SplitPhotoTextTemplate',
    alignment: 'Aligné à Gauche',
    alignIcon: AlignLeft,
    description: 'Photo d’exception pleine page + 3 paragraphes éditoriaux aérés sans cartes.',
    structure: 'Fond photo pleine page + Voile feutré + Paragraphes éditoriaux + Conseil',
    usedInPages: 'Page 08',
    component: <SplitPhotoTextTemplate />,
  },
  {
    id: 'article_top_photo',
    name: 'Photo Pleine Page & Deux Options A vs B',
    layoutCode: 'LAYOUT D1',
    category: 'Comparatifs',
    archetype: 'ArticleTwoColumnsPhotoTopTemplate',
    alignment: 'Titre Centré',
    alignIcon: AlignCenter,
    description: 'Photo pleine page + Deux options comparatives face-à-face en pure typographie.',
    structure: 'Fond photo pleine page + Voile feutré + 2 options face-à-face sans cartes + Recommandation',
    usedInPages: 'Pages 08, 14',
    component: <ArticleTwoColumnsPhotoTopTemplate />,
  },
  {
    id: 'pros_cons',
    name: 'Photo Pleine Page & Atouts vs Exigences',
    layoutCode: 'LAYOUT D2',
    category: 'Comparatifs',
    archetype: 'ProsAndConsTemplate',
    alignment: 'Titres Centrés',
    alignIcon: AlignCenter,
    description: 'Photo pleine page + Bilan objectif 2 colonnes sans aucune carte avec filets fins.',
    structure: 'Fond photo pleine page + Voile feutré + 2 colonnes typographiques (+/−) + Arbitrage',
    usedInPages: 'Page 06',
    component: <ProsAndConsTemplate />,
  },
  {
    id: 'staging_vs',
    name: 'Home Staging Avant / Après',
    layoutCode: 'LAYOUT D3',
    category: 'Comparatifs',
    archetype: 'StagingComparisonVsTemplate',
    alignment: 'Comparatif Centré',
    alignIcon: AlignCenter,
    description: 'Analyse éditoriale + Double photo comparative côte à côte avant / après valorisation.',
    structure: '2 blocs de diagnostic + Double photo comparative architecturale avant/après',
    usedInPages: 'Page 25',
    component: <StagingComparisonVsTemplate />,
  },
  {
    id: 'photography_before_after',
    name: 'Photographie Pro vs Amateur',
    layoutCode: 'LAYOUT D4',
    category: 'Comparatifs',
    archetype: 'BeforeAfterPhotographyTemplate',
    alignment: 'Titre Centré',
    alignIcon: AlignCenter,
    description: 'Impact chiffré des visuels + 2 photos comparatives grand-angle HDR vs smartphone.',
    structure: '2 constats chiffrés + 2 photos architecturales haute définition en vis-à-vis',
    usedInPages: 'Page 24',
    component: <BeforeAfterPhotographyTemplate />,
  },
  {
    id: 'ask_yourself',
    name: 'Auto-Évaluation (3 Questions & Décision)',
    layoutCode: 'LAYOUT E1',
    category: 'Méthode & Chiffres',
    archetype: 'NumberedQuestionsTemplate',
    alignment: 'Aligné à Gauche',
    alignIcon: AlignLeft,
    description: '3 questions clés numérotées + Doubles cadres d’arbitrage Oui/Non + Photo en pied.',
    structure: '3 questions d’audit numérotées + Doubles blocs conditionnels d’orientation + Photo en pied',
    usedInPages: 'Page 04',
    component: <NumberedQuestionsTemplate />,
  },
  {
    id: 'consider_this',
    name: 'Repères de Marché (4 Statistiques DVF)',
    layoutCode: 'LAYOUT E2',
    category: 'Méthode & Chiffres',
    archetype: 'NumberedStatsTemplate',
    alignment: 'Aligné à Gauche',
    alignIcon: AlignLeft,
    description: 'Grille 2x2 des réalités de marché DVF + Encart d’analyse experte + Photo en pied.',
    structure: '4 repères chiffrés 01 à 04 en grille 2x2 + Note d’analyse d’Alexandre + Photo en pied',
    usedInPages: 'Page 05',
    component: <NumberedStatsTemplate />,
  },
  {
    id: 'three_columns_banner',
    name: '3 Piliers Stèles + Bandeau Formule',
    layoutCode: 'LAYOUT E3',
    category: 'Méthode & Chiffres',
    archetype: 'ThreeColumnsBannerTemplate',
    alignment: 'Titre Centré',
    alignIcon: AlignCenter,
    description: '3 colonnes numérotées + Formule financière en cartouche Bleu Nuit + Photo en bas.',
    structure: '3 colonnes / stèles numérotées + Cartouche formule notariée en Bleu Nuit + Photo en pied',
    usedInPages: 'Pages 10, 17',
    component: <ThreeColumnsBannerTemplate />,
  },
  {
    id: 'cma_article',
    name: 'Article Méthodologique (4 Points & CMA)',
    layoutCode: 'LAYOUT E4',
    category: 'Méthode & Chiffres',
    archetype: 'ArticlePhotoBottomTemplate',
    alignment: 'Titre Centré',
    alignIcon: AlignCenter,
    description: '4 points d’analyse comparative (CMA vs Expertise) + Encart d’arbitrage + Photo en bas.',
    structure: '4 points d’analyse numérotés 01 à 04 + Encart conseil d’expert + Photo en pied',
    usedInPages: 'Page 16',
    component: <ArticlePhotoBottomTemplate />,
  },
]

export default function GuideViewer() {
  const [guideVersion, setGuideVersion] = useState<'v2' | 'v1'>('v2')
  const [viewMode, setViewMode] = useState<ViewMode>('a4_sheets')
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('cover')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
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
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#006390]">
                  DESIGN SYSTEM ÉDITORIAL · 17 GABARITS
                </span>
                <h3 className="font-serif text-lg font-normal text-[#111111] mt-1">
                  Familles de Layouts A4
                </h3>
                <p className="text-xs text-[#666666] mt-1 leading-relaxed">
                  Sélectionnez un gabarit pour inspecter sa structure, son ratio texte/photo et ses pages de déploiement.
                </p>
              </div>

              {/* Filtres par Famille de Layout */}
              <div className="flex flex-wrap gap-1 pt-1 border-t border-[#E5E0D8]">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`text-[10px] font-semibold px-2 py-1 rounded-full transition-colors ${
                    selectedCategory === null
                      ? 'bg-[#001D2D] text-white'
                      : 'bg-white text-zinc-600 border border-zinc-200 hover:border-zinc-400'
                  }`}
                >
                  Tous (17)
                </button>
                {(['Couvertures', 'Éditorial', 'Grilles & Checklists', 'Comparatifs', 'Méthode & Chiffres'] as const).map(
                  (cat) => {
                    const count = TEMPLATE_CATALOG.filter((t) => t.category === cat).length
                    const isSelected = selectedCategory === cat
                    return (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`text-[10px] font-semibold px-2 py-1 rounded-full transition-colors ${
                          isSelected
                            ? 'bg-[#006390] text-white'
                            : 'bg-white text-zinc-600 border border-zinc-200 hover:border-zinc-400'
                        }`}
                      >
                        {cat} ({count})
                      </button>
                    )
                  }
                )}
              </div>

              {/* Liste des Gabarits Filtrés */}
              <div className="max-h-[600px] overflow-y-auto pr-1 space-y-2">
                {TEMPLATE_CATALOG.filter((tpl) => !selectedCategory || tpl.category === selectedCategory).map(
                  (tpl) => {
                    const isSelected = selectedTemplateId === tpl.id
                    return (
                      <button
                        key={tpl.id}
                        onClick={() => setSelectedTemplateId(tpl.id)}
                        className={`flex w-full flex-col rounded-md p-3 text-left transition-all border ${
                          isSelected
                            ? 'bg-[#001D2D] text-white border-[#001D2D] shadow-sm'
                            : 'bg-white text-zinc-800 border-zinc-200 hover:border-zinc-400'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span
                            className={`text-[9px] font-bold tracking-wider uppercase px-1.5 py-0.5 rounded ${
                              isSelected
                                ? 'bg-[#7DD3FC] text-[#001D2D]'
                                : 'bg-[#006390]/10 text-[#006390]'
                            }`}
                          >
                            {tpl.layoutCode}
                          </span>
                          <span
                            className={`text-[9.5px] font-medium ${
                              isSelected ? 'text-zinc-300' : 'text-zinc-500'
                            }`}
                          >
                            {tpl.category}
                          </span>
                        </div>
                        <span className="text-xs font-bold leading-snug">{tpl.name}</span>
                        <div
                          className={`text-[10px] mt-1.5 flex items-center justify-between ${
                            isSelected ? 'text-zinc-300' : 'text-zinc-500'
                          }`}
                        >
                          <span className="truncate max-w-[180px]">{tpl.usedInPages}</span>
                          <span className="font-mono text-[9px]">&lt;{tpl.archetype}&gt;</span>
                        </div>
                      </button>
                    )
                  }
                )}
              </div>
            </aside>

            {/* Colonne Droite : Fiche d'Inspection & Rendu A4 Isolé */}
            <main className="lg:col-span-8 space-y-4">
              <div className="no-print rounded-lg border border-zinc-200 bg-white p-4 sm:p-5 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-100">
                  <div className="flex items-center gap-2.5">
                    <span className="bg-[#001D2D] text-white text-[10px] font-bold tracking-wider px-2 py-1 rounded">
                      {activeTemplate.layoutCode}
                    </span>
                    <h2 className="text-sm sm:text-base font-bold text-zinc-900">
                      {activeTemplate.name}
                    </h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-semibold text-[#006390] bg-[#006390]/10 px-2.5 py-0.5 rounded-full">
                      {activeTemplate.category}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-500 border border-zinc-200 px-2 py-0.5 rounded">
                      &lt;{activeTemplate.archetype} /&gt;
                    </span>
                  </div>
                </div>

                {/* Métadonnées du Layout */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 text-xs">
                  <div>
                    <span className="text-[9.5px] font-bold uppercase tracking-wider text-zinc-400 block mb-0.5">
                      Architecture & Géométrie
                    </span>
                    <p className="text-zinc-700 font-medium leading-relaxed">
                      {activeTemplate.structure}
                    </p>
                  </div>
                  <div>
                    <span className="text-[9.5px] font-bold uppercase tracking-wider text-[#006390] block mb-0.5">
                      Déploiement dans le livre
                    </span>
                    <p className="text-zinc-700 font-medium leading-relaxed">
                      {activeTemplate.usedInPages}
                    </p>
                  </div>
                </div>
              </div>

              {/* Rendu A4 Isolé */}
              <div className="a4-page mx-auto w-full aspect-[210/297] shadow-xl rounded-sm overflow-hidden border border-zinc-200">
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
