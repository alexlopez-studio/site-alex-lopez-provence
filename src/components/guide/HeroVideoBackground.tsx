'use client'

import React, { useRef, useState, useEffect } from 'react'
import { Volume2, VolumeX, Play, Pause } from 'lucide-react'

interface HeroVideoBackgroundProps {
  videoSrc?: string
  posterSrc?: string
  overlayOpacity?: string
}

export function HeroVideoBackground({
  videoSrc = 'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-luxurious-villa-with-a-swimming-pool-42861-large.mp4',
  posterSrc = '/maison-bleue-cotignac.jpg',
  overlayOpacity = 'bg-gradient-to-r from-[#F9F8F4] via-[#F9F8F4]/85 to-[#F9F8F4]/30',
}: HeroVideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay policy fallback
        setIsPlaying(false)
      })
    }
  }, [])

  const togglePlay = () => {
    if (!videoRef.current) return
    if (isPlaying) {
      videoRef.current.pause()
      setIsPlaying(false)
    } else {
      videoRef.current.play()
      setIsPlaying(true)
    }
  }

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden select-none pointer-events-none">
      {/* 1. Vidéo en lecture automatique en arrière-plan */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        poster={posterSrc}
        onLoadedData={() => setIsLoaded(true)}
        className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-1000 ${
          isLoaded ? 'opacity-80 scale-105' : 'opacity-40'
        }`}
      >
        <source src={videoSrc} type="video/mp4" />
      </video>

      {/* 2. Filtre de contraste & dégradé cinématographique (garantit une lisibilité parfaite des textes) */}
      <div className={`absolute inset-0 ${overlayOpacity}`} />

      {/* 3. Voile supplémentaire doux en haut et bas pour transition fluide */}
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#F9F8F4] to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#F9F8F4] to-transparent" />

      {/* 4. Bouton de contrôle discret de lecture en bas à droite (cliquable) */}
      <div className="pointer-events-auto absolute bottom-4 right-4 z-20 hidden sm:block">
        <button
          type="button"
          onClick={togglePlay}
          aria-label={isPlaying ? 'Mettre la vidéo en pause' : 'Lancer la vidéo'}
          className="flex items-center gap-1.5 rounded-full bg-white/70 hover:bg-white px-3 py-1.5 text-[11px] font-semibold text-[#0F172A] shadow-md backdrop-blur-md border border-black/5 transition-all"
        >
          {isPlaying ? (
            <>
              <Pause className="h-3 w-3 text-[#00B4EC]" />
              <span>Pause ambiance</span>
            </>
          ) : (
            <>
              <Play className="h-3 w-3 text-[#00B4EC]" />
              <span>Vidéo ambiance</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}
