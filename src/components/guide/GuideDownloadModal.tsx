'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Download,
  Check,
  BookOpen,
  Phone,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Loader2,
} from 'lucide-react'

interface GuideDownloadModalProps {
  isOpen: boolean
  onClose: () => void
  source?: string
}

export function GuideDownloadModal({
  isOpen,
  onClose,
  source = 'landing_modal_cta',
}: GuideDownloadModalProps) {
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    email: '',
    telephone: '',
    commune: '',
    opt_in: true,
  })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (!formData.email || !formData.email.includes('@')) {
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
          ...formData,
          source,
        }),
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setSubmitted(true)
      } else {
        setErrorMessage(data.error || 'Une erreur est survenue. Veuillez réessayer.')
      }
    } catch {
      setErrorMessage('Erreur de connexion. Veuillez vérifier votre réseau.')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setSubmitted(false)
    setFormData({
      prenom: '',
      nom: '',
      email: '',
      telephone: '',
      commune: '',
      opt_in: true,
    })
    setErrorMessage(null)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleReset}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-xl overflow-hidden rounded-3xl bg-white shadow-2xl z-10 border border-border my-8"
          >
            {/* Header modal */}
            <div className="bg-brand px-6 py-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                  <Download className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white leading-tight">
                    Recevoir le Guide Vendeur (41 pages)
                  </h3>
                  <p className="text-xs text-brand-light">
                    Format PDF Haute Définition + Accès en ligne immédiat
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleReset}
                className="rounded-full p-1.5 text-white/80 hover:bg-white/20 hover:text-white transition-colors"
                aria-label="Fermer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Corps du modal */}
            <div className="p-6 sm:p-8">
              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="text-center sm:text-left mb-2">
                    <p className="text-sm text-muted">
                      Remplissez vos coordonnées pour recevoir immédiatement votre lien de téléchargement et la version interactive par email.
                    </p>
                  </div>

                  {errorMessage && (
                    <div className="rounded-xl bg-error-light/50 border border-error/20 p-3 text-xs text-error font-medium">
                      {errorMessage}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-foreground mb-1">
                        Prénom <span className="text-brand">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ex : Philippe"
                        value={formData.prenom}
                        onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                        className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted/60 focus:border-brand focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-foreground mb-1">
                        Nom
                      </label>
                      <input
                        type="text"
                        placeholder="Ex : Dupont"
                        value={formData.nom}
                        onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                        className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted/60 focus:border-brand focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-foreground mb-1">
                      Adresse Email <span className="text-brand">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="votre-email@exemple.fr"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted/60 focus:border-brand focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-foreground mb-1">
                        Téléphone
                      </label>
                      <input
                        type="tel"
                        placeholder="06 .. .. .. .."
                        value={formData.telephone}
                        onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                        className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted/60 focus:border-brand focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-foreground mb-1">
                        Commune du bien
                      </label>
                      <input
                        type="text"
                        placeholder="Ex : Cotignac, Brignoles..."
                        value={formData.commune}
                        onChange={(e) => setFormData({ ...formData, commune: e.target.value })}
                        className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted/60 focus:border-brand focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all"
                      />
                    </div>
                  </div>

                  {/* RGPD */}
                  <div className="pt-1">
                    <label className="flex items-start gap-2.5 text-xs text-muted cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.opt_in}
                        onChange={(e) => setFormData({ ...formData, opt_in: e.target.checked })}
                        className="mt-0.5 h-4 w-4 rounded border-border text-brand focus:ring-brand"
                      />
                      <span>
                        J'accepte de recevoir gratuitement le guide en PDF par email et des conseils pratiques pour ma vente. Zéro spam, désinscription en 1 clic.
                      </span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-brand py-3.5 px-6 text-sm font-bold text-white shadow-lg hover:bg-brand-hover active:scale-[0.99] transition-all disabled:opacity-70 mt-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Génération de votre accès...</span>
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4" />
                        <span>Télécharger mon Guide Gratuit (PDF)</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-center gap-4 text-[11px] text-muted pt-2">
                    <span className="inline-flex items-center gap-1">
                      <ShieldCheck className="h-3.5 w-3.5 text-success" /> 100% Gratuit
                    </span>
                    <span>·</span>
                    <span>Sans engagement</span>
                    <span>·</span>
                    <span>Données protégées</span>
                  </div>
                </form>
              ) : (
                /* État de succès */
                <div className="text-center py-4 space-y-5">
                  <div className="mx-auto h-16 w-16 rounded-full bg-success/15 text-success flex items-center justify-center">
                    <Check className="h-8 w-8 stroke-[2.5]" />
                  </div>

                  <div>
                    <h4 className="text-2xl font-bold text-foreground">
                      Votre guide est prêt !
                    </h4>
                    <p className="mt-2 text-sm text-muted max-w-md mx-auto">
                      Un email vient de vous être envoyé à <strong className="text-foreground">{formData.email}</strong> avec votre exemplaire complet en PDF haute résolution.
                    </p>
                  </div>

                  {/* Actions directes */}
                  <div className="pt-2 flex flex-col gap-3 max-w-sm mx-auto">
                    <Link
                      href="/guide-vendeur"
                      onClick={onClose}
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-3.5 text-sm font-bold text-white shadow-md hover:bg-brand-hover transition-all"
                    >
                      <BookOpen className="h-4 w-4" />
                      <span>Consulter le Guide en Ligne Immédiatement</span>
                    </Link>

                    <button
                      type="button"
                      onClick={handleReset}
                      className="inline-flex items-center justify-center rounded-full border border-border px-5 py-2.5 text-xs font-semibold text-muted hover:text-foreground hover:bg-surface transition-all"
                    >
                      Fermer cette fenêtre
                    </button>
                  </div>

                  <div className="rounded-2xl bg-surface p-4 border border-border text-left mt-6">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 overflow-hidden rounded-full shrink-0 border border-brand/20">
                        <Image
                          src="/alexandre-lopez-face.jpg"
                          alt="Alexandre Lopez"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="text-xs">
                        <p className="font-bold text-foreground">Besoin d'un éclairage sur votre bien ?</p>
                        <p className="text-muted">
                          Alexandre Lopez répond directement au <a href="tel:+33613180168" className="text-brand font-bold">06 13 18 01 68</a>.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
