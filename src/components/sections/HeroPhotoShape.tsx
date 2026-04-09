'use client'

import { useEffect, useRef } from 'react'

export function HeroPhotoShape() {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const shape1Ref = useRef<HTMLDivElement>(null)
  const shape2Ref = useRef<HTMLDivElement>(null)
  const imgRef   = useRef<HTMLImageElement>(null)

  useEffect(() => {
    let ticking = false

    const onScroll = () => {
      if (ticking) return
      ticking = true

      requestAnimationFrame(() => {
        // Offset de la section par rapport au haut de la page
        const top = wrapperRef.current?.getBoundingClientRect().top ?? 0
        const viewH = window.innerHeight

        // Ratio de progression dans le viewport : 0 (entre en bas) → 1 (sort en haut)
        const progress = 1 - (top + viewH) / (viewH * 2)
        const clamped = Math.max(0, Math.min(1, progress))

        // Vitesses différentes = effet profondeur
        const s1 = clamped * 60   // shape principale : bouge le plus
        const s2 = clamped * 40   // shape secondaire
        const im = clamped * 20   // photo : bouge le moins

        if (shape1Ref.current) shape1Ref.current.style.transform = `translateY(-${s1}px)`
        if (shape2Ref.current) shape2Ref.current.style.transform = `translateY(-${s2}px)`
        if (imgRef.current)    imgRef.current.style.transform    = `translateY(-${im}px)`

        ticking = false
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div ref={wrapperRef} className="hero-photo-wrapper">
      {/* Shape secondaire (profondeur, floutée) */}
      <div ref={shape2Ref} className="hero-photo-shape-2" />
      {/* Shape principale */}
      <div ref={shape1Ref} className="hero-photo-shape" />
      {/*
        Photo de la personne.
        • Placez votre photo dans /public/alex-lopez.png
        • Fond blanc ou transparent recommandé pour un rendu propre
      */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgRef}
        className="hero-photo-img"
        src="/alex-lopez.png"
        alt="Alex Lopez — Mandataire IAD Provence"
      />
    </div>
  )
}
