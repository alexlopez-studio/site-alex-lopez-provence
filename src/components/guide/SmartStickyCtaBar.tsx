'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, Phone, BookOpen, ArrowRight, ShieldCheck } from 'lucide-react'

interface SmartStickyCtaBarProps {
  onOpenModal: () => void
}

export function SmartStickyCtaBar({ onOpenModal }: SmartStickyCtaBarProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Devient visible après avoir scrollé plus de 500px (dépassement du Hero)
      if (window.scrollY > 500) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 280, damping: 26 }}
          className="fixed bottom-4 sm:bottom-6 inset-x-4 sm:inset-x-6 z-40 max-w-4xl mx-auto"
        >
          <div className="rounded-full bg-white/95 backdrop-blur-xl p-2 sm:p-2.5 pl-4 sm:pl-5 border border-border/80 shadow-[0_15px_40px_rgba(0,119,182,0.18)] flex items-center justify-between gap-3">
            {/* Infos du guide */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative h-9 w-9 sm:h-10 sm:w-10 rounded-full overflow-hidden shrink-0 border-2 border-brand/30">
                <Image
                  src="/alexandre-lopez-face.jpg"
                  alt="Alexandre Lopez"
                  fill
                  className="object-cover"
                />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5 text-xs font-bold text-foreground truncate">
                  <span>Guide Vendeur Particulier</span>
                  <span className="hidden md:inline-flex items-center gap-1 text-[10px] bg-brand-light text-brand px-2 py-0.5 rounded-full">
                    <ShieldCheck className="h-3 w-3" /> 41 Pages A4
                  </span>
                </div>
                <p className="hidden sm:block text-[11px] text-muted truncate">
                  Données DVF · Qualification bancaire · Sécurité notaire
                </p>
              </div>
            </div>

            {/* Actions rapides */}
            <div className="flex items-center gap-2 shrink-0">
              <a
                href="tel:+33613180168"
                className="hidden lg:inline-flex items-center gap-1.5 text-xs font-bold text-muted hover:text-brand px-3 py-2 transition-colors"
              >
                <Phone className="h-3.5 w-3.5" />
                <span>06 13 18 01 68</span>
              </a>

              <button
                type="button"
                onClick={onOpenModal}
                className="group relative inline-flex items-center gap-2 rounded-full bg-brand pl-4 sm:pl-5 pr-1.5 sm:pr-2 py-2 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-brand-hover active:scale-[0.98] transition-all"
              >
                <span>Recevoir le Guide (PDF)</span>
                <span className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-white/20 text-white transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
