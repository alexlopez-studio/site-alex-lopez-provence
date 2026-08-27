'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  Move,
  Type,
  Sliders,
  RotateCcw,
  Undo2,
  Redo2,
  Plus,
  Trash2,
  Bold,
  Italic,
  CaseUpper,
  Copy,
  Check,
  Eye,
  Pencil,
  Grid,
  Save,
  CheckCircle2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  ImageIcon,
  Sparkles,
  Square,
} from 'lucide-react'
import savedCoverConfig from './cover-saved-config.json'

export interface CoverElementConfig {
  id: string
  name: string
  text?: string
  subtitle?: string
  badgeText?: string
  top: number // percentage (0 - 100)
  left: number // percentage (0 - 100)
  fontSize: number // px
  fontFamily: 'serif' | 'script' | 'sans' | 'montserrat'
  fontWeight: 'normal' | 'semibold' | 'bold' | 'extrabold'
  isItalic: boolean
  isUppercase: boolean
  align: 'left' | 'center' | 'right'
  tracking: string
  lineHeight: number // ex: 1.05, 1.2, 1.4
  color: string
  borderRadius: number // px (for boxes)
  bgOpacity: number // percentage
  blur: number // px
  showBorders: boolean
  hasBox: boolean // if it renders as a floating card
  widthPercent: number // width as % of page
}

const DEFAULT_COVER_ELEMENTS: Record<string, CoverElementConfig> =
  (savedCoverConfig.elements as unknown as Record<string, CoverElementConfig>) || {
    header: {
      id: 'header',
      name: 'Surtitre Thématique',
      text: 'IMMOBILIER & ART DE VIVRE EN PROVENCE',
      top: 8,
      left: 50,
      fontSize: 12,
      fontFamily: 'sans',
      fontWeight: 'bold',
      isItalic: false,
      isUppercase: true,
      align: 'center',
      tracking: '0.32em',
      lineHeight: 1.2,
      color: '#FDFBF7',
      borderRadius: 0,
      bgOpacity: 0,
      blur: 0,
      showBorders: false,
      hasBox: false,
      widthPercent: 90,
    },
    title: {
      id: 'title',
      name: 'Titre Principal',
      text: 'LE GUIDE POUR VENDRE SA MAISON',
      top: 18,
      left: 50,
      fontSize: 48,
      fontFamily: 'serif',
      fontWeight: 'bold',
      isItalic: false,
      isUppercase: true,
      align: 'center',
      tracking: '-0.02em',
      lineHeight: 1.04,
      color: '#FDFBF7',
      borderRadius: 0,
      bgOpacity: 0,
      blur: 0,
      showBorders: false,
      hasBox: false,
      widthPercent: 88,
    },
    signature: {
      id: 'signature',
      name: 'Signature Auteur',
      text: 'Alexandre Lopez',
      top: 29,
      left: 50,
      fontSize: 46,
      fontFamily: 'script',
      fontWeight: 'normal',
      isItalic: false,
      isUppercase: false,
      align: 'center',
      tracking: 'normal',
      lineHeight: 1,
      color: '#FFFFFF',
      borderRadius: 0,
      bgOpacity: 0,
      blur: 0,
      showBorders: false,
      hasBox: false,
      widthPercent: 80,
    },
    cartouche: {
      id: 'cartouche',
      name: 'Cartouche Blanc Flottant',
      subtitle: 'Le guide complet pour réussir votre vente en Provence',
      badgeText: '41 FICHES MÉTHODIQUES · DONNÉES DVF RÉELLES',
      top: 60,
      left: 50,
      fontSize: 16,
      fontFamily: 'serif',
      fontWeight: 'bold',
      isItalic: false,
      isUppercase: false,
      align: 'center',
      tracking: 'normal',
      lineHeight: 1.25,
      color: '#0F172A',
      borderRadius: 24,
      bgOpacity: 95,
      blur: 16,
      showBorders: true,
      hasBox: true,
      widthPercent: 72,
    },
    footer: {
      id: 'footer',
      name: 'Pied de Page Éditorial',
      text: 'ALEXANDRE LOPEZ · CONSEILLER IMMOBILIER IAD FRANCE · PROVENCE VERTE & VERDON',
      subtitle: 'ÉDITION PROPRIÉTAIRE · MÉTHODE & OUTILS',
      top: 92,
      left: 50,
      fontSize: 10,
      fontFamily: 'sans',
      fontWeight: 'semibold',
      isItalic: false,
      isUppercase: true,
      align: 'center',
      tracking: '0.22em',
      lineHeight: 1.3,
      color: '#FFFFFF',
      borderRadius: 0,
      bgOpacity: 0,
      blur: 0,
      showBorders: false,
      hasBox: false,
      widthPercent: 92,
    },
  }

const HERO_IMAGES = [
  { id: 'bastide', label: 'Bastide & Lavande', url: '/images/provence-bastide-lavande.jpg' },
  { id: 'cover-alt', label: 'Guide Provence', url: '/images/guide-cover-provence.jpg' },
  { id: 'cotignac', label: 'Village Provençal', url: '/village-cotignac.jpg' },
]

const PRESET_COLORS = [
  { label: 'Craie Pure', value: '#FDFBF7' },
  { label: 'Blanc', value: '#FFFFFF' },
  { label: 'Bleu Nuit', value: '#0F172A' },
  { label: 'Bleu Provence', value: '#0077B6' },
  { label: 'Cyan iad', value: '#00B4EC' },
  { label: 'Or / Sable', value: '#D4AF37' },
  { label: 'Corail iad', value: '#EA584A' },
  { label: 'Gris Ardoise', value: '#64748B' },
]

export function VisualCoverEditor() {
  const [elements, setElements] = useState<Record<string, CoverElementConfig>>(DEFAULT_COVER_ELEMENTS)
  const [history, setHistory] = useState<Record<string, CoverElementConfig>[]>([DEFAULT_COVER_ELEMENTS])
  const [historyIndex, setHistoryIndex] = useState<number>(0)

  const [selectedId, setSelectedId] = useState<string>('cartouche')
  const [heroImage, setHeroImage] = useState<string>(
    savedCoverConfig.heroImage || '/images/provence-bastide-lavande.jpg'
  )
  const [showGrid, setShowGrid] = useState(true)
  const [isEditMode, setIsEditMode] = useState(true)
  const [copiedCode, setCopiedCode] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [overlayGradient, setOverlayGradient] = useState<'cinema' | 'soft' | 'none'>(
    (savedCoverConfig.overlayGradient as 'cinema' | 'soft' | 'none') || 'cinema'
  )

  const containerRef = useRef<HTMLDivElement>(null)

  // Enregistrement dans l'historique Undo / Redo
  const pushHistory = useCallback(
    (newElements: Record<string, CoverElementConfig>) => {
      setHistory((prev) => {
        const upToCurrent = prev.slice(0, historyIndex + 1)
        return [...upToCurrent, newElements]
      })
      setHistoryIndex((prev) => prev + 1)
    },
    [historyIndex]
  )

  // Chargement de la configuration initiale
  useEffect(() => {
    async function loadSavedConfig() {
      try {
        const res = await fetch('/api/guide/save-cover')
        const data = await res.json()
        if (data?.config?.elements) {
          const loaded = { ...data.config.elements }
          // S'assurer que le cartouche possède bien hasBox: true
          Object.keys(loaded).forEach((k) => {
            if (k === 'cartouche' || loaded[k].id === 'cartouche') {
              loaded[k].hasBox = true
            }
          })
          setElements(loaded)
          setHistory([loaded])
          setHistoryIndex(0)
          if (data.config.heroImage) setHeroImage(data.config.heroImage)
          if (data.config.overlayGradient) setOverlayGradient(data.config.overlayGradient)
        }
      } catch (e) {
        console.error('Erreur chargement config couverture:', e)
      }
    }
    loadSavedConfig()
  }, [])

  // Raccourcis clavier (Cmd+Z / Ctrl+Z pour Undo)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        if (e.shiftKey) {
          handleRedo()
        } else {
          handleUndo()
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [historyIndex, history])

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1
      setHistoryIndex(prevIndex)
      setElements(history[prevIndex])
    }
  }

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1
      setHistoryIndex(nextIndex)
      setElements(history[nextIndex])
    }
  }

  const selectedElement = elements[selectedId]

  const updateSelected = (key: keyof CoverElementConfig, value: any) => {
    if (!selectedId || !elements[selectedId]) return
    const updated = {
      ...elements,
      [selectedId]: {
        ...elements[selectedId],
        [key]: value,
      },
    }
    setElements(updated)
    pushHistory(updated)
  }

  // Ajouter un nouveau bloc de texte ou un cartouche
  const handleAddNewText = (type: 'title' | 'cartouche' | 'badge' | 'paragraph' | 'script') => {
    const newId = `${type}_${Date.now()}`
    let newElement: CoverElementConfig

    if (type === 'cartouche') {
      newElement = {
        id: newId,
        name: 'Nouveau Cartouche Blanc',
        subtitle: 'Le guide complet pour réussir votre vente en Provence',
        badgeText: '41 FICHES MÉTHODIQUES · DONNÉES DVF RÉELLES',
        top: 60,
        left: 50,
        fontSize: 16,
        fontFamily: 'serif',
        fontWeight: 'bold',
        isItalic: false,
        isUppercase: false,
        align: 'center',
        tracking: 'normal',
        lineHeight: 1.25,
        color: '#0F172A',
        borderRadius: 24,
        bgOpacity: 95,
        blur: 16,
        showBorders: true,
        hasBox: true,
        widthPercent: 72,
      }
    } else if (type === 'title') {
      newElement = {
        id: newId,
        name: 'Nouveau Grand Titre',
        text: 'NOUVEAU TITRE MAJESTUEUX',
        top: 45,
        left: 50,
        fontSize: 34,
        fontFamily: 'serif',
        fontWeight: 'bold',
        isItalic: false,
        isUppercase: true,
        align: 'center',
        tracking: 'normal',
        lineHeight: 1.1,
        color: '#FDFBF7',
        borderRadius: 0,
        bgOpacity: 0,
        blur: 0,
        showBorders: false,
        hasBox: false,
        widthPercent: 80,
      }
    } else if (type === 'badge') {
      newElement = {
        id: newId,
        name: 'Nouveau Badge',
        text: '★ ÉDITION LIMITÉE ★',
        top: 48,
        left: 50,
        fontSize: 10,
        fontFamily: 'sans',
        fontWeight: 'bold',
        isItalic: false,
        isUppercase: true,
        align: 'center',
        tracking: '0.24em',
        lineHeight: 1,
        color: '#00B4EC',
        borderRadius: 999,
        bgOpacity: 25,
        blur: 8,
        showBorders: true,
        hasBox: true,
        widthPercent: 45,
      }
    } else if (type === 'script') {
      newElement = {
        id: newId,
        name: 'Texte Manuscrit',
        text: 'Alexandre Lopez',
        top: 52,
        left: 50,
        fontSize: 42,
        fontFamily: 'script',
        fontWeight: 'normal',
        isItalic: false,
        isUppercase: false,
        align: 'center',
        tracking: 'normal',
        lineHeight: 1,
        color: '#FFFFFF',
        borderRadius: 0,
        bgOpacity: 0,
        blur: 0,
        showBorders: false,
        hasBox: false,
        widthPercent: 70,
      }
    } else {
      newElement = {
        id: newId,
        name: 'Paragraphe de texte',
        text: 'Ajoutez votre texte descriptif ou vos mentions ici...',
        top: 50,
        left: 50,
        fontSize: 14,
        fontFamily: 'sans',
        fontWeight: 'normal',
        isItalic: false,
        isUppercase: false,
        align: 'center',
        tracking: 'normal',
        lineHeight: 1.4,
        color: '#FDFBF7',
        borderRadius: 0,
        bgOpacity: 0,
        blur: 0,
        showBorders: false,
        hasBox: false,
        widthPercent: 75,
      }
    }

    const updated = {
      ...elements,
      [newId]: newElement,
    }
    setElements(updated)
    setSelectedId(newId)
    pushHistory(updated)
  }

  // Supprimer le bloc sélectionné
  const handleDeleteSelected = () => {
    if (!selectedId || Object.keys(elements).length <= 1) return
    const updated = { ...elements }
    delete updated[selectedId]
    const remainingKeys = Object.keys(updated)
    setElements(updated)
    setSelectedId(remainingKeys[0] || '')
    pushHistory(updated)
  }

  // Centrage parfait en 1 clic
  const snapToCenterH = () => {
    if (!selectedId) return
    updateSelected('left', 50)
    updateSelected('align', 'center')
  }

  const snapToLeft = () => {
    if (!selectedId) return
    updateSelected('left', 50)
    updateSelected('align', 'left')
  }

  const snapToRight = () => {
    if (!selectedId) return
    updateSelected('left', 50)
    updateSelected('align', 'right')
  }

  const handleDragEnd = (id: string, _: any, info: any) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()

    const deltaXPercent = (info.offset.x / rect.width) * 100
    const deltaYPercent = (info.offset.y / rect.height) * 100

    setElements((prev) => {
      const el = prev[id]
      if (!el) return prev
      let newLeft = Math.round(el.left + deltaXPercent)
      let newTop = Math.round(el.top + deltaYPercent)

      // Aimantation magnétique si proche du centre 50%
      if (Math.abs(newLeft - 50) <= 3) {
        newLeft = 50
      }

      newTop = Math.max(2, Math.min(96, newTop))
      newLeft = Math.max(10, Math.min(90, newLeft))

      const updated = {
        ...prev,
        [id]: {
          ...el,
          top: newTop,
          left: newLeft,
        },
      }
      pushHistory(updated)
      return updated
    })
  }

  const resetAll = () => {
    setElements(DEFAULT_COVER_ELEMENTS)
    pushHistory(DEFAULT_COVER_ELEMENTS)
  }

  const handleSave = async () => {
    setIsSaving(true)
    setSaveSuccess(false)
    try {
      const payload = {
        elements,
        heroImage,
        overlayGradient,
        updatedAt: new Date().toISOString(),
      }

      // 1. Sauvegarde locale
      localStorage.setItem('alex_guide_cover_config', JSON.stringify(payload))

      // 2. Sauvegarde dans le projet via API (met à jour cover-saved-config.json)
      const res = await fetch('/api/guide/save-cover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        setSaveSuccess(true)
        setTimeout(() => setSaveSuccess(false), 3500)
      }
    } catch (e) {
      console.error('Erreur sauvegarde:', e)
    } finally {
      setIsSaving(false)
    }
  }

  const copyConfigAsTsx = () => {
    const code = `// ─── CONFIGURATION COUVERTURE PERSONNALISÉE ───
export const CUSTOM_COVER_CONFIG = ${JSON.stringify(
      { elements, heroImage, overlayGradient },
      null,
      2
    )};
`
    navigator.clipboard.writeText(code)
    setCopiedCode(true)
    setTimeout(() => setCopiedCode(false), 2500)
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4 sm:p-6 lg:p-8 bg-[#F4F1EA] text-[#111111] min-h-screen">
      {/* ─── COLONNE GAUCHE : LE CANVAS A4 INTERACTIF ─── */}
      <div className="flex-1 flex flex-col items-center">
        {/* Barre d'outils supérieure du Canvas */}
        <div className="w-full max-w-[560px] flex items-center justify-between gap-2 mb-4 bg-white/95 backdrop-blur-md px-3.5 py-2.5 rounded-2xl shadow-sm border border-[#E5E0D8]">
          <div className="flex items-center gap-1.5">
            {/* BOUTONS RETOUR ARRIÈRE / RÉTABLIR */}
            <button
              onClick={handleUndo}
              disabled={historyIndex <= 0}
              className={`p-1.5 rounded-xl text-xs transition-colors flex items-center gap-1 ${
                historyIndex > 0
                  ? 'text-slate-800 hover:bg-slate-100'
                  : 'text-slate-300 cursor-not-allowed'
              }`}
              title="Retour arrière (Cmd+Z)"
            >
              <Undo2 className="h-4 w-4" />
              <span className="text-[11px] font-semibold hidden sm:inline">Annuler</span>
            </button>

            <button
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
              className={`p-1.5 rounded-xl text-xs transition-colors flex items-center gap-1 ${
                historyIndex < history.length - 1
                  ? 'text-slate-800 hover:bg-slate-100'
                  : 'text-slate-300 cursor-not-allowed'
              }`}
              title="Rétablir (Cmd+Shift+Z)"
            >
              <Redo2 className="h-4 w-4" />
            </button>

            <div className="h-4 w-[1px] bg-slate-200 mx-1" />

            <button
              onClick={() => setIsEditMode(!isEditMode)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                isEditMode
                  ? 'bg-[#0F172A] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {isEditMode ? <Pencil className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              <span>{isEditMode ? 'Mode Drag & Move' : 'Aperçu Réel'}</span>
            </button>

            <button
              onClick={() => setShowGrid(!showGrid)}
              className={`p-1.5 rounded-xl text-xs transition-colors ${
                showGrid ? 'bg-[#0077B6]/15 text-[#0077B6] font-bold' : 'text-slate-500 hover:bg-slate-100'
              }`}
              title="Afficher/Masquer l'axe de centrage 50%"
            >
              <Grid className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* BOUTON ENREGISTRER */}
            <button
              onClick={handleSave}
              disabled={isSaving}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl shadow-xs transition-all ${
                saveSuccess
                  ? 'bg-emerald-600 text-white ring-2 ring-emerald-400'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              {saveSuccess ? (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-100" />
                  <span>Enregistré !</span>
                </>
              ) : (
                <>
                  <Save className="h-3.5 w-3.5" />
                  <span>{isSaving ? 'Sauvegarde...' : 'Enregistrer'}</span>
                </>
              )}
            </button>

            <button
              onClick={copyConfigAsTsx}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0077B6] hover:bg-[#006094] text-white text-xs font-bold rounded-xl shadow-xs transition-all"
            >
              {copiedCode ? <Check className="h-3.5 w-3.5 text-emerald-300" /> : <Copy className="h-3.5 w-3.5" />}
              <span className="hidden sm:inline">{copiedCode ? 'Copié' : 'Code'}</span>
            </button>
          </div>
        </div>

        {/* ─── FEUILLE A4 EN TEMPS RÉEL (FORMAT STRICT 1 : 1.414) ─── */}
        <div
          ref={containerRef}
          className="relative w-full max-w-[560px] aspect-[1/1.414] bg-[#0B132B] rounded-2xl shadow-2xl overflow-hidden select-none border-4 border-white/80 ring-1 ring-black/10"
        >
          {/* FOND IMAGE */}
          <div className="absolute inset-0 z-0">
            <img
              src={heroImage}
              alt="Fond de couverture"
              className="h-full w-full object-cover object-center"
            />
            {/* Voile de dégradé cinématique */}
            {overlayGradient === 'cinema' && (
              <div className="absolute inset-0 bg-gradient-to-b from-[#0B132B]/75 via-black/20 to-[#0B132B]/85" />
            )}
            {overlayGradient === 'soft' && (
              <div className="absolute inset-0 bg-gradient-to-b from-[#0B132B]/45 via-transparent to-[#0B132B]/60" />
            )}
          </div>

          {/* REPÈRE AXE CENTRAL 50% RIGIDE */}
          {showGrid && isEditMode && (
            <div className="absolute inset-0 z-1 pointer-events-none">
              <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[1.5px] bg-[#00B4EC] opacity-75 shadow-xs" />
              <div className="absolute top-1/3 left-0 right-0 h-[1px] bg-white/20 border-dashed border-t border-white/30" />
              <div className="absolute top-2/3 left-0 right-0 h-[1px] bg-white/20 border-dashed border-t border-white/30" />
            </div>
          )}

          {/* ─── RENDU DYNAMIQUE DE TOUS LES ÉLÉMENTS DE LA COUVERTURE ─── */}
          {Object.values(elements).map((el) => {
            const isSelected = selectedId === el.id

            const fontClass =
              el.fontFamily === 'serif'
                ? 'font-serif'
                : el.fontFamily === 'script'
                ? 'font-script'
                : el.fontFamily === 'montserrat'
                ? 'font-montserrat'
                : 'font-sans'

            const weightClass =
              el.fontWeight === 'extrabold'
                ? 'font-black'
                : el.fontWeight === 'bold'
                ? 'font-bold'
                : el.fontWeight === 'semibold'
                ? 'font-semibold'
                : 'font-normal'

            const isCartoucheOrBox = el.hasBox || el.id === 'cartouche'

            return (
              <div
                key={el.id}
                style={{
                  position: 'absolute',
                  top: `${el.top}%`,
                  left: `${el.left}%`,
                  width: `${el.widthPercent}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                className="z-10"
              >
                <motion.div
                  drag={isEditMode}
                  dragMomentum={false}
                  onDragEnd={(e, info) => handleDragEnd(el.id, e, info)}
                  onClick={() => setSelectedId(el.id)}
                  className={`w-full cursor-move transition-shadow ${
                    isSelected && isEditMode
                      ? 'ring-2 ring-[#00B4EC] ring-offset-2 ring-offset-black/60 rounded-2xl p-0.5 bg-black/20'
                      : isEditMode
                      ? 'hover:outline-dashed hover:outline-1 hover:outline-white/50'
                      : ''
                  }`}
                >
                  {isCartoucheOrBox ? (
                    // Rendu en Cartouche / Boîte blanche arrondie
                    <div
                      style={{
                        borderRadius: `${el.borderRadius || 24}px`,
                        backgroundColor: `rgba(255, 255, 255, ${(el.bgOpacity ?? 95) / 100})`,
                        backdropFilter: `blur(${el.blur || 16}px)`,
                        textAlign: el.align || 'center',
                      }}
                      className="px-6 py-5 sm:px-8 sm:py-6 shadow-[0_24px_50px_rgba(0,0,0,0.35)] border border-white/70 ring-1 ring-black/5 mx-auto"
                    >
                      <div className="w-10 h-[2px] bg-[#0077B6] mx-auto mb-3 rounded-full" />
                      <p
                        style={{
                          fontSize: `${el.fontSize}px`,
                          color: el.color || '#0F172A',
                          lineHeight: el.lineHeight || 1.25,
                          textTransform: el.isUppercase ? 'uppercase' : 'none',
                          fontStyle: el.isItalic ? 'italic' : 'normal',
                        }}
                        className={`${fontClass} ${weightClass} tracking-tight m-0`}
                      >
                        {el.subtitle || el.text}
                      </p>
                      {el.badgeText && (
                        <>
                          <div className="w-10 h-[2px] bg-[#0077B6] mx-auto mt-3 mb-2.5 rounded-full" />
                          <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.18em] text-[#0077B6] font-extrabold m-0">
                            {el.badgeText}
                          </p>
                        </>
                      )}
                    </div>
                  ) : (
                    // Rendu de texte standard / surtitre / signature / titre
                    <div
                      style={{
                        fontSize: `${el.fontSize}px`,
                        letterSpacing: el.tracking || 'normal',
                        textAlign: el.align || 'center',
                        lineHeight: el.lineHeight || 1.1,
                        color: el.color || '#FFFFFF',
                        textTransform: el.isUppercase ? 'uppercase' : 'none',
                        fontStyle: el.isItalic ? 'italic' : 'normal',
                      }}
                      className={`${fontClass} ${weightClass} drop-shadow-[0_4px_20px_rgba(0,0,0,0.75)] m-0`}
                    >
                      <p className="m-0">{el.text}</p>
                      {el.subtitle && (
                        <p className="text-[8px] sm:text-[9px] tracking-[0.26em] text-white/75 font-medium mt-1">
                          {el.subtitle}
                        </p>
                      )}
                    </div>
                  )}
                </motion.div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ─── COLONNE DROITE : LE PANNEAU DE CONTRÔLE & RICH TEXT EDITOR ─── */}
      <div className="w-full lg:w-[420px] bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-[#E5E0D8] space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <Type className="h-4 w-4 text-[#0077B6]" />
              <span>Éditeur Rich Text & Disposition</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Modifiez, ajoutez ou déplacez vos textes avec synchronisation globale.
            </p>
          </div>

          <button
            onClick={resetAll}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
            title="Réinitialiser toutes les positions par défaut"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>

        {/* ─── BOUTONS D'AJOUT DE NOUVEAUX ÉLÉMENTS ─── */}
        <div className="space-y-1.5 bg-[#F8FAFC] p-3 rounded-xl border border-slate-200">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <Plus className="h-3.5 w-3.5 text-[#0077B6]" />
            <span>Ajouter un élément à la couverture</span>
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={() => handleAddNewText('cartouche')}
              className="px-2.5 py-1.5 text-xs font-semibold bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-800 text-left transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <Square className="h-3.5 w-3.5 text-[#0077B6]" />
              <span>+ Cartouche Blanc</span>
            </button>
            <button
              onClick={() => handleAddNewText('title')}
              className="px-2.5 py-1.5 text-xs font-semibold bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-800 text-left transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <Type className="h-3.5 w-3.5 text-slate-600" />
              <span>+ Grand Titre</span>
            </button>
            <button
              onClick={() => handleAddNewText('script')}
              className="px-2.5 py-1.5 text-xs font-semibold bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-800 text-left transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <Sparkles className="h-3.5 w-3.5 text-slate-600" />
              <span>+ Signature</span>
            </button>
            <button
              onClick={() => handleAddNewText('badge')}
              className="px-2.5 py-1.5 text-xs font-semibold bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-800 text-left transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <AlignLeft className="h-3.5 w-3.5 text-slate-600" />
              <span>+ Badge / Puce</span>
            </button>
          </div>
        </div>

        {/* ─── LISTE DES BLOCS SUR LA PAGE ─── */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
            Bloc sélectionné ({Object.keys(elements).length} éléments)
          </label>
          <div className="grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto pr-1">
            {Object.values(elements).map((el) => (
              <button
                key={el.id}
                onClick={() => setSelectedId(el.id)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold text-left transition-all truncate ${
                  selectedId === el.id
                    ? 'bg-[#0077B6] text-white shadow-xs'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200/60'
                }`}
              >
                {el.name}
              </button>
            ))}
          </div>
        </div>

        {/* ─── RICH TEXT EDIT & CONTRÔLES DU BLOC SÉLECTIONNÉ ─── */}
        {selectedElement && (
          <div className="space-y-4 pt-3 border-t border-slate-200">
            {/* Header du bloc + Coordonnées + Bouton Supprimer */}
            <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-200/70">
              <div>
                <span className="text-xs font-bold text-slate-800">{selectedElement.name}</span>
                <span className="ml-2 text-[10px] text-slate-400 font-mono">
                  X:{selectedElement.left}% · Y:{selectedElement.top}%
                </span>
              </div>

              <button
                onClick={handleDeleteSelected}
                className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors flex items-center gap-1 text-[11px] font-semibold"
                title="Supprimer ce texte"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Supprimer</span>
              </button>
            </div>

            {/* BARRE D'OUTILS RICH TEXT (Police, Gras, Italique, Majuscule) */}
            <div className="space-y-1.5 bg-slate-50/80 p-3 rounded-xl border border-slate-200/60">
              <label className="text-[11px] font-semibold text-slate-700">Style Typographique</label>

              {/* Choix de Police */}
              <div className="grid grid-cols-3 gap-1.5 mb-2">
                <button
                  onClick={() => updateSelected('fontFamily', 'serif')}
                  className={`py-1 px-2 rounded-lg text-xs font-serif border transition-all ${
                    selectedElement.fontFamily === 'serif'
                      ? 'bg-[#0077B6] text-white border-[#0077B6]'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Playfair (Serif)
                </button>
                <button
                  onClick={() => updateSelected('fontFamily', 'script')}
                  className={`py-1 px-2 rounded-lg text-xs font-script border transition-all ${
                    selectedElement.fontFamily === 'script'
                      ? 'bg-[#0077B6] text-white border-[#0077B6]'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Allura (Script)
                </button>
                <button
                  onClick={() => updateSelected('fontFamily', 'sans')}
                  className={`py-1 px-2 rounded-lg text-xs font-sans border transition-all ${
                    selectedElement.fontFamily === 'sans'
                      ? 'bg-[#0077B6] text-white border-[#0077B6]'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Inter (Sans)
                </button>
              </div>

              {/* Boutons Gras, Italique, Majuscule */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() =>
                    updateSelected(
                      'fontWeight',
                      selectedElement.fontWeight === 'bold' ? 'normal' : 'bold'
                    )
                  }
                  className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1 border text-xs font-bold ${
                    selectedElement.fontWeight === 'bold' || selectedElement.fontWeight === 'extrabold'
                      ? 'bg-slate-800 text-white border-slate-800'
                      : 'bg-white text-slate-700 border-slate-200'
                  }`}
                >
                  <Bold className="h-3.5 w-3.5" />
                  <span>Gras</span>
                </button>

                <button
                  onClick={() => updateSelected('isItalic', !selectedElement.isItalic)}
                  className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1 border text-xs italic ${
                    selectedElement.isItalic
                      ? 'bg-slate-800 text-white border-slate-800'
                      : 'bg-white text-slate-700 border-slate-200'
                  }`}
                >
                  <Italic className="h-3.5 w-3.5" />
                  <span>Italique</span>
                </button>

                <button
                  onClick={() => updateSelected('isUppercase', !selectedElement.isUppercase)}
                  className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1 border text-xs ${
                    selectedElement.isUppercase
                      ? 'bg-slate-800 text-white border-slate-800'
                      : 'bg-white text-slate-700 border-slate-200'
                  }`}
                >
                  <CaseUpper className="h-3.5 w-3.5" />
                  <span>Majuscules</span>
                </button>
              </div>

              {/* Palette de Couleurs */}
              <div className="pt-2">
                <label className="text-[10px] font-semibold text-slate-600 block mb-1">
                  Couleur du texte
                </label>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {PRESET_COLORS.map((c) => (
                    <button
                      key={c.value}
                      onClick={() => updateSelected('color', c.value)}
                      className={`h-6 w-6 rounded-full border-2 transition-transform shadow-2xs ${
                        selectedElement.color === c.value
                          ? 'scale-125 ring-2 ring-[#0077B6] border-white'
                          : 'border-slate-300'
                      }`}
                      style={{ backgroundColor: c.value }}
                      title={c.label}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Raccourcis de centrage instantané */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-600">Positionnement & Centrage</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={snapToLeft}
                  className={`py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 border transition-all ${
                    selectedElement.align === 'left'
                      ? 'bg-[#0077B6] text-white border-[#0077B6]'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <AlignLeft className="h-3.5 w-3.5" />
                  <span>Gauche</span>
                </button>

                <button
                  onClick={snapToCenterH}
                  className={`py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 border transition-all ${
                    selectedElement.left === 50 && selectedElement.align === 'center'
                      ? 'bg-[#0077B6] text-white border-[#0077B6] ring-2 ring-[#0077B6]/30'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <AlignCenter className="h-3.5 w-3.5" />
                  <span>Centrer (50%)</span>
                </button>

                <button
                  onClick={snapToRight}
                  className={`py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 border transition-all ${
                    selectedElement.align === 'right'
                      ? 'bg-[#0077B6] text-white border-[#0077B6]'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <AlignRight className="h-3.5 w-3.5" />
                  <span>Droite</span>
                </button>
              </div>
            </div>

            {/* Position Y (Hauteur verticale sur la page) */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-slate-600">
                <span className="font-semibold">Hauteur Verticale (Y)</span>
                <span className="font-mono font-bold text-slate-900">{selectedElement.top} %</span>
              </div>
              <input
                type="range"
                min="2"
                max="96"
                value={selectedElement.top}
                onChange={(e) => updateSelected('top', Number(e.target.value))}
                className="w-full accent-[#0077B6]"
              />
            </div>

            {/* Position X (Position horizontale) */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-slate-600">
                <span className="font-semibold">Position Horizontale (X)</span>
                <span className="font-mono font-bold text-slate-900">{selectedElement.left} %</span>
              </div>
              <input
                type="range"
                min="10"
                max="90"
                value={selectedElement.left}
                onChange={(e) => updateSelected('left', Number(e.target.value))}
                className="w-full accent-[#0077B6]"
              />
            </div>

            {/* Taille de police */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-slate-600">
                <span className="font-semibold">Taille de Police</span>
                <span className="font-mono font-bold text-slate-900">{selectedElement.fontSize} px</span>
              </div>
              <input
                type="range"
                min="8"
                max="72"
                value={selectedElement.fontSize}
                onChange={(e) => updateSelected('fontSize', Number(e.target.value))}
                className="w-full accent-[#0077B6]"
              />
            </div>

            {/* Largeur du conteneur */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-slate-600">
                <span className="font-semibold">Largeur du bloc</span>
                <span className="font-mono font-bold text-slate-900">{selectedElement.widthPercent} %</span>
              </div>
              <input
                type="range"
                min="30"
                max="98"
                value={selectedElement.widthPercent}
                onChange={(e) => updateSelected('widthPercent', Number(e.target.value))}
                className="w-full accent-[#0077B6]"
              />
            </div>

            {/* Modification des textes */}
            {selectedElement.text !== undefined && (
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-600">Contenu du Texte</label>
                <textarea
                  value={selectedElement.text}
                  onChange={(e) => updateSelected('text', e.target.value)}
                  rows={2}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0077B6]"
                />
              </div>
            )}

            {selectedElement.subtitle !== undefined && (
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-600">Sous-titre</label>
                <textarea
                  value={selectedElement.subtitle}
                  onChange={(e) => updateSelected('subtitle', e.target.value)}
                  rows={2}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0077B6]"
                />
              </div>
            )}

            {/* Réglages spécifiques au Cartouche / Boîte */}
            {(selectedElement.hasBox || selectedElement.id === 'cartouche') && (
              <div className="space-y-3 pt-3 border-t border-slate-100 bg-slate-50/70 p-3 rounded-xl">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-600">
                    <span className="font-semibold">Arrondi des angles (Rayon)</span>
                    <span className="font-mono font-bold text-slate-900">
                      {selectedElement.borderRadius || 24} px
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="40"
                    value={selectedElement.borderRadius || 24}
                    onChange={(e) => updateSelected('borderRadius', Number(e.target.value))}
                    className="w-full accent-[#0077B6]"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-600">
                    <span className="font-semibold">Opacité du fond blanc</span>
                    <span className="font-mono font-bold text-slate-900">
                      {selectedElement.bgOpacity ?? 95} %
                    </span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={selectedElement.bgOpacity ?? 95}
                    onChange={(e) => updateSelected('bgOpacity', Number(e.target.value))}
                    className="w-full accent-[#0077B6]"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* ─── CHOIX DE LA PHOTO DE FOND ─── */}
        <div className="space-y-2 pt-4 border-t border-slate-200">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
            <ImageIcon className="h-3.5 w-3.5 text-slate-500" />
            <span>Photo Provençale d'Arrière-plan</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {HERO_IMAGES.map((img) => (
              <button
                key={img.id}
                onClick={() => setHeroImage(img.url)}
                className={`relative rounded-xl overflow-hidden aspect-video border-2 transition-all ${
                  heroImage === img.url
                    ? 'border-[#0077B6] ring-2 ring-[#0077B6]/30 shadow-xs'
                    : 'border-slate-200 opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img.url} alt={img.label} className="h-full w-full object-cover" />
                <span className="absolute inset-x-0 bottom-0 bg-black/60 text-[8px] text-white p-0.5 text-center truncate font-medium">
                  {img.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* GRAND BOUTON ENREGISTRER EN BAS DU PANNEAU */}
        <div className="pt-2">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`w-full py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all ${
              saveSuccess
                ? 'bg-emerald-600 text-white ring-2 ring-emerald-400 scale-[1.01]'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            {saveSuccess ? (
              <>
                <CheckCircle2 className="h-4 w-4 text-emerald-100" />
                <span>Configuration Enregistrée avec Succès !</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>{isSaving ? 'Enregistrement en cours...' : 'Enregistrer la Couverture'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
