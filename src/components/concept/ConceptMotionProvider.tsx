'use client'

import React, { useEffect, useRef, useState } from 'react'
import Lenis from 'lenis'

interface SpringItem {
  obj: HTMLElement
  prop: string
  val: number
  target: number
  vel: number
  tension: number
  friction: number
  initialized: boolean
}

const easings = {
  easeOutExpo: (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
  easeOutQuart: (t: number) => 1 - Math.pow(1 - t, 4),
  easeInOutCubic: (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
}

function tween(
  duration: number,
  easingFn: (t: number) => number,
  onUpdate: (p: number) => void,
  onComplete?: () => void
) {
  const start = performance.now()
  function frame(time: number) {
    const p = (time - start) / duration
    if (p >= 1) {
      onUpdate(easingFn(1))
      if (onComplete) onComplete()
    } else {
      onUpdate(easingFn(p))
      requestAnimationFrame(frame)
    }
  }
  requestAnimationFrame(frame)
}

interface ConceptMotionProviderProps {
  children: React.ReactNode
  showLoader?: boolean
  loaderSubtitle?: string
}

/**
 * ConceptMotionProvider
 * Reusable animation engine directly porting the physics from Downloads/untitled/index.html:
 * - Luxury Intro Loader (#loader)
 * - Lenis smooth scroll
 * - Spring Engine (tension/friction with 2-substep numerical integration)
 * - Inview observer for .inview-node elements with data-inview attributes
 * - Masked text reveals (.clip-mask .inner / .fac-title-line)
 * - Desktop hover physics (.hover-scale-card, .hover-lift, .btn-pill, .btn-arrow)
 * - Lenis anchor smooth scrolling
 */
export function ConceptMotionProvider({
  children,
  showLoader = false,
  loaderSubtitle,
}: ConceptMotionProviderProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [loaderActive, setLoaderActive] = useState(showLoader)

  useEffect(() => {
    // 1. Lenis setup
    const lenis = new Lenis({ smoothWheel: true })
    let lastTime = performance.now()
    let rafId: number

    // 2. Spring Engine
    const activeSprings: SpringItem[] = []

    function setSpring(obj: HTMLElement, prop: string, target: number, tension: number, friction: number) {
      const existing = activeSprings.find((s) => s.obj === obj && s.prop === prop)
      if (existing) {
        existing.target = target
        existing.tension = tension
        existing.friction = friction
      } else {
        activeSprings.push({
          obj,
          prop,
          val: target,
          target,
          vel: 0,
          tension,
          friction,
          initialized: true,
        })
      }
    }

    function setSpringImmediate(obj: HTMLElement, prop: string, val: number) {
      const existing = activeSprings.find((s) => s.obj === obj && s.prop === prop)
      if (existing) {
        existing.target = val
        existing.val = val
        existing.vel = 0
      } else {
        activeSprings.push({
          obj,
          prop,
          val,
          target: val,
          vel: 0,
          tension: 1,
          friction: 1,
          initialized: true,
        })
      }
    }

    function updateSprings(dt: number) {
      const step = Math.min(dt, 0.05)
      const substeps = 2
      const sdt = step / substeps
      const movingObjects = new Set<HTMLElement>()

      for (let i = 0; i < activeSprings.length; i++) {
        const s = activeSprings[i]
        const wasMoving = Math.abs(s.vel) > 0.001 || Math.abs(s.target - s.val) > 0.001
        if (wasMoving || !s.initialized) {
          for (let k = 0; k < substeps; k++) {
            s.vel += (-s.tension * (s.val - s.target) - s.friction * s.vel) * sdt
            s.val += s.vel * sdt
          }
          s.initialized = true
          movingObjects.add(s.obj)
        }
      }

      movingObjects.forEach((obj) => {
        let transform = ''
        let opacity: number | null = null
        activeSprings
          .filter((s) => s.obj === obj)
          .forEach((s) => {
            if (s.prop === 'x') transform += ` translateX(${s.val}px)`
            if (s.prop === 'y') transform += ` translateY(${s.val}px)`
            if (s.prop === 'scale') transform += ` scale(${s.val})`
            if (s.prop === 'rotate') transform += ` rotate(${s.val}deg)`
            if (s.prop === 'opacity') opacity = s.val
          })
        if (transform) obj.style.transform = transform
        if (opacity !== null) obj.style.opacity = String(opacity)
      })
    }

    // 3. rAF Loop
    function raf(time: number) {
      lenis.raf(time)
      const dt = (time - lastTime) / 1000
      lastTime = time
      updateSprings(dt)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    // 4. Luxury Intro Loader Logic (if enabled)
    const root = containerRef.current || document
    const loaderEl = root.querySelector<HTMLElement>('#loader')
    const wordmarkEl = root.querySelector<HTMLElement>('#loader-wordmark')
    const fillEl = root.querySelector<HTMLElement>('#loader-fill')

    if (showLoader && loaderEl && wordmarkEl && fillEl) {
      lenis.stop()
      document.documentElement.classList.add('scroll-locked')

      // Wordmark spring rise
      setTimeout(() => {
        setSpring(wordmarkEl, 'y', 0, 200, 22)
        setSpring(wordmarkEl, 'opacity', 1, 200, 22)
      }, 50)

      const MIN_MS = 1100
      const EXIT_MS = 800

      // Fill progress bar
      setTimeout(() => {
        tween(MIN_MS - 100, easings.easeInOutCubic, (p) => {
          fillEl.style.transform = `scaleX(${p})`
        })
      }, 100)

      // Exit slide up
      setTimeout(() => {
        tween(
          EXIT_MS,
          easings.easeInOutCubic,
          (p) => {
            loaderEl.style.transform = `translateY(${-105 * p}%)`
          },
          () => {
            setLoaderActive(false)
            lenis.start()
            document.documentElement.classList.remove('scroll-locked')
            triggerHeroReveals()
          }
        )
      }, MIN_MS)
    }

    // Helper to trigger hero reveals after loader or immediately
    function triggerHeroReveals() {
      // Trigger .clip-mask inner reveals
      const clipTitleParents = new Set<HTMLElement>()
      root.querySelectorAll<HTMLElement>('.clip-mask').forEach((el) => {
        const p = el.closest('h1, h2, p') as HTMLElement
        if (p) clipTitleParents.add(p)
        else clipTitleParents.add(el)
      })

      clipTitleParents.forEach((p) => {
        const inners = p.querySelectorAll<HTMLElement>('.inner')
        inners.forEach((inEl) => {
          inEl.style.transform = 'translateY(115%)'
          inEl.style.opacity = '0'
        })

        const obs = new IntersectionObserver(
          (e) => {
            if (e[0].isIntersecting) {
              obs.disconnect()
              inners.forEach((inEl, i) => {
                setTimeout(() => {
                  tween(950, easings.easeOutExpo, (t) => {
                    inEl.style.transform = `translateY(${115 - 115 * t}%)`
                    inEl.style.opacity = String(t)
                  })
                }, i * 120)
              })
            }
          },
          { threshold: 0.15 }
        )
        obs.observe(p)
      })
    }

    if (!showLoader) {
      triggerHeroReveals()
    }

    // 5. Inview Observer for .inview-node
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement
            const config = el.getAttribute('data-inview')
            if (config) {
              const p: Record<string, number> = { y: 0, scale: 1, opacity: 1, delay: 0, t: 170, f: 26 }
              config.split(',').forEach((part) => {
                const [k, v] = part.split(':').map((s) => s.trim())
                if (k && v !== undefined) p[k] = parseFloat(v)
              })

              setTimeout(() => {
                if (p.y) setSpring(el, 'y', 0, p.t, p.f)
                if (p.scale !== 1) setSpring(el, 'scale', 1, p.t, p.f)
                setSpring(el, 'opacity', 1, p.t, p.f)
              }, p.delay)
            }
            io.unobserve(el)
          }
        })
      },
      { threshold: 0.1 }
    )

    root.querySelectorAll<HTMLElement>('.inview-node').forEach((el) => {
      const config = el.getAttribute('data-inview')
      if (config) {
        const p: Record<string, number> = { y: 0, scale: 1 }
        config.split(',').forEach((part) => {
          const [k, v] = part.split(':').map((s) => s.trim())
          if (k === 'y' || k === 'scale') p[k] = parseFloat(v)
        })
        if (p.y) setSpringImmediate(el, 'y', p.y)
        if (p.scale !== 1) setSpringImmediate(el, 'scale', p.scale)
      }
      io.observe(el)
    })

    // 6. Desktop Hover Physics
    const isDesktop = () => window.innerWidth > 768

    // Cards hover-scale-card
    const hoverScaleElements = root.querySelectorAll<HTMLElement>('.hover-scale-card')
    hoverScaleElements.forEach((card) => {
      const onEnter = () => {
        if (isDesktop()) setSpring(card, 'scale', 1.03, 300, 22)
      }
      const onLeave = () => {
        if (isDesktop()) setSpring(card, 'scale', 1, 300, 22)
      }
      card.addEventListener('mouseenter', onEnter)
      card.addEventListener('mouseleave', onLeave)
    })

    // Cards hover-lift
    const hoverLiftElements = root.querySelectorAll<HTMLElement>('.hover-lift')
    hoverLiftElements.forEach((card) => {
      const onEnter = () => {
        if (isDesktop()) setSpring(card, 'y', -8, 300, 22)
      }
      const onLeave = () => {
        if (isDesktop()) setSpring(card, 'y', 0, 300, 22)
      }
      card.addEventListener('mouseenter', onEnter)
      card.addEventListener('mouseleave', onLeave)
    })

    // Buttons .btn-pill arrow nudge
    const btnPills = root.querySelectorAll<HTMLElement>('.btn-pill')
    btnPills.forEach((btn) => {
      const svg = btn.querySelector<HTMLElement>('svg')
      if (svg) {
        const onEnter = () => {
          if (isDesktop()) setSpring(svg, 'x', 5, 320, 20)
        }
        const onLeave = () => {
          if (isDesktop()) setSpring(svg, 'x', 0, 320, 20)
        }
        btn.addEventListener('mouseenter', onEnter)
        btn.addEventListener('mouseleave', onLeave)
      }
    })

    // Buttons .btn-arrow scale
    const btnArrows = root.querySelectorAll<HTMLElement>('.btn-arrow')
    btnArrows.forEach((btn) => {
      const svg = btn.querySelector<HTMLElement>('svg')
      if (svg) {
        const onEnter = () => {
          if (isDesktop()) setSpring(svg, 'scale', 1.15, 320, 18)
        }
        const onLeave = () => {
          if (isDesktop()) setSpring(svg, 'scale', 1, 320, 18)
        }
        btn.addEventListener('mouseenter', onEnter)
        btn.addEventListener('mouseleave', onLeave)
      }
    })

    // 7. Smooth Anchor Scroll inside Lenis
    const anchors = root.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')
    anchors.forEach((anchor) => {
      const onClick = (e: MouseEvent) => {
        const targetId = anchor.getAttribute('href')?.substring(1)
        if (targetId) {
          const target = document.getElementById(targetId)
          if (target) {
            e.preventDefault()
            lenis.scrollTo(target, { offset: -20 })
          }
        }
      }
      anchor.addEventListener('click', onClick)
    })

    // Cleanup
    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
      io.disconnect()
      document.documentElement.classList.remove('scroll-locked')
    }
  }, [showLoader])

  return (
    <div ref={containerRef}>
      {loaderActive && (
        <div id="loader">
          <div id="loader-wordmark" className="flex items-center" style={{ gap: '0.65rem' }}>
            <svg
              style={{ width: '1.75rem', height: '1.75rem', color: '#fff' }}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            <span
              style={{
                fontSize: '1.5rem',
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
              }}
            >
              Alexandre Lopez
            </span>
            {loaderSubtitle && (
              <span
                style={{
                  fontSize: '0.875rem',
                  opacity: 0.65,
                  letterSpacing: '0.15em',
                  marginLeft: '0.5rem',
                  borderLeft: '1px solid rgba(255,255,255,0.3)',
                  paddingLeft: '0.75rem',
                  textTransform: 'uppercase',
                }}
              >
                {loaderSubtitle}
              </span>
            )}
          </div>
          <div id="loader-track">
            <div id="loader-fill"></div>
          </div>
        </div>
      )}
      {children}
    </div>
  )
}
