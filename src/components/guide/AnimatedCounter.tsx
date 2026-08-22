'use client'

import React, { useEffect, useState, useRef } from 'react'
import { useInView } from 'framer-motion'

interface AnimatedCounterProps {
  value: number
  suffix?: string
  prefix?: string
  duration?: number
}

export function AnimatedCounter({
  value,
  suffix = '',
  prefix = '',
  duration = 1.6,
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  useEffect(() => {
    if (!isInView) return

    let startTimestamp: number | null = null
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp
      const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1)

      // Easing cubic-bezier out-expo pour un ralentissement doux à la fin
      const easeProgress = 1 - Math.pow(2, -10 * progress)
      setCount(Math.floor(easeProgress * value))

      if (progress < 1) {
        window.requestAnimationFrame(step)
      } else {
        setCount(value)
      }
    }

    const frameId = window.requestAnimationFrame(step)
    return () => window.cancelAnimationFrame(frameId)
  }, [isInView, value, duration])

  return (
    <span ref={ref} className="tabular-nums font-black">
      {prefix}
      {count}
      {suffix}
    </span>
  )
}
