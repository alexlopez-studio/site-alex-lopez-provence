'use client'

import React, { useRef, useState } from 'react'

interface SpotlightCardProps {
  children: React.ReactNode
  className?: string
  innerClassName?: string
  spotlightColor?: string
}

export function SpotlightCard({
  children,
  className = '',
  innerClassName = '',
  spotlightColor = 'rgba(0, 119, 182, 0.08)',
}: SpotlightCardProps) {
  const divRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [opacity, setOpacity] = useState(0)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return
    const rect = divRef.current.getBoundingClientRect()
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      className={`relative overflow-hidden rounded-[2rem] p-1.5 bg-surface border border-border/80 transition-all duration-300 hover:border-brand/40 hover:shadow-xl ${className}`}
    >
      {/* Halo radial de lumière qui suit la souris */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300"
        style={{
          opacity,
          background: `radial-gradient(400px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 80%)`,
        }}
      />

      {/* Cœur intérieur (Inner Core) */}
      <div
        className={`relative z-10 h-full w-full rounded-[calc(2rem-0.375rem)] bg-white p-7 sm:p-8 flex flex-col justify-between shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)] ${innerClassName}`}
      >
        {children}
      </div>
    </div>
  )
}
