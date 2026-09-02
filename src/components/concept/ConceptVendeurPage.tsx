'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import Image from 'next/image'
import Lenis from 'lenis'
import './concept.css'

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

export function ConceptVendeurPage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [contactOpen, setContactOpen] = useState(false)
  const [videoOpen, setVideoOpen] = useState(false)
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [userName, setUserName] = useState('')
  const [formData, setFormData] = useState({ name: '', email: '', message: '', optIn: false })
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [activeBgIndex, setActiveBgIndex] = useState(0)
  const [loaderVisible, setLoaderVisible] = useState(true)

  const videoRef = useRef<HTMLVideoElement>(null)
  const bgVideo0Ref = useRef<HTMLVideoElement>(null)
  const bgVideo1Ref = useRef<HTMLVideoElement>(null)
  const lenisRef = useRef<Lenis | null>(null)
  const activeSprings = useRef<SpringItem[]>([])
  const isHeroReadyRef = useRef(false)

  // Spring Engine
  const setSpring = useCallback((obj: HTMLElement, prop: string, target: number, tension: number, friction: number) => {
    const existing = activeSprings.current.find((s) => s.obj === obj && s.prop === prop)
    if (existing) {
      existing.target = target
      existing.tension = tension
      existing.friction = friction
    } else {
      activeSprings.current.push({
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
  }, [])

  const setSpringImmediate = useCallback((obj: HTMLElement, prop: string, val: number) => {
    const existing = activeSprings.current.find((s) => s.obj === obj && s.prop === prop)
    if (existing) {
      existing.target = val
      existing.val = val
      existing.vel = 0
    } else {
      activeSprings.current.push({
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
  }, [])

  const updateSprings = useCallback((dt: number) => {
    const step = Math.min(dt, 0.05)
    const substeps = 2
    const sdt = step / substeps
    const movingObjects = new Set<HTMLElement>()

    for (let i = 0; i < activeSprings.current.length; i++) {
      const s = activeSprings.current[i]
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
      activeSprings.current
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
  }, [])

  // Text clip mask reveal
  const revealTextClip = useCallback(
    (selector: string, stagger: number, duration: number, easing: keyof typeof easings, delay = 0) => {
      const inners = document.querySelectorAll<HTMLElement>(`${selector} .inner`)
      inners.forEach((el, i) => {
        setTimeout(() => {
          tween(duration, easings[easing], (p) => {
            el.style.transform = `translateY(${115 - 115 * p}%)`
            el.style.opacity = String(p)
          })
        }, delay + i * stagger)
      })
    },
    []
  )

  const handleBgVideoEnd = (endedIndex: number) => {
    const nextIndex = (endedIndex + 1) % 2
    setActiveBgIndex(nextIndex)
    if (nextIndex === 0 && bgVideo0Ref.current) {
      bgVideo0Ref.current.currentTime = 0
      bgVideo0Ref.current.play().catch(() => {})
    } else if (nextIndex === 1 && bgVideo1Ref.current) {
      bgVideo1Ref.current.currentTime = 0
      bgVideo1Ref.current.play().catch(() => {})
    }
  }

  // Master Animation Runtime: Lenis + Springs + Parallax + InView + Hovers
  useEffect(() => {
    // 1. Initialise Lenis smooth scroll
    const lenis = new Lenis({
      smoothWheel: true,
      duration: 1.2,
    })
    lenisRef.current = lenis

    const paraHero = document.getElementById('hero')
    const paraHeroBgWrap = document.getElementById('hero-bg-wrap')

    function updateParallax() {
      const wh = window.innerHeight
      if (paraHero && paraHeroBgWrap) {
        const hRect = paraHero.getBoundingClientRect()
        if (hRect.top < wh && hRect.bottom > 0) {
          const p = Math.max(0, Math.min(1, -hRect.top / hRect.height))
          paraHeroBgWrap.style.transform = `translateY(${p * 12}%)`
        }
      }
    }

    let lastTime = performance.now()
    let rafId: number

    function raf(time: number) {
      lenis.raf(time)
      const dt = (time - lastTime) / 1000
      lastTime = time
      updateSprings(dt)
      updateParallax()
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    // 2. IntersectionObserver for inview-node spring reveals
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement
            if (el.closest('#hero') && !isHeroReadyRef.current) return

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

    document.querySelectorAll<HTMLElement>('.inview-node').forEach((el) => {
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

    // 3. Line Title Inners Reveal
    const facTitleParents = new Set<HTMLElement>()
    document.querySelectorAll<HTMLElement>('.fac-title-line').forEach((el) => {
      const p = el.closest('h2, p') as HTMLElement
      if (p) facTitleParents.add(p)
    })

    facTitleParents.forEach((p) => {
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
        { threshold: 0.35 }
      )
      obs.observe(p)
    })

    // 4. Fac-body Word-by-Word Reveal
    const facBody = document.getElementById('fac-body')
    if (facBody && !facBody.dataset.split) {
      facBody.dataset.split = 'true'
      const words = facBody.innerText.split(' ')
      facBody.innerHTML = ''
      words.forEach((w) => {
        const span = document.createElement('span')
        span.innerText = w + ' '
        span.style.display = 'inline-block'
        span.style.opacity = '0'
        span.style.transform = 'translateY(18px)'
        facBody.appendChild(span)
      })

      const facIo = new IntersectionObserver(
        (e) => {
          if (e[0].isIntersecting) {
            facIo.disconnect()
            setTimeout(() => {
              facBody.querySelectorAll<HTMLElement>('span').forEach((el, i) => {
                setTimeout(() => {
                  tween(700, easings.easeOutQuart, (p) => {
                    el.style.opacity = String(p)
                    el.style.transform = `translateY(${18 - 18 * p}px)`
                  })
                }, i * 28)
              })
            }, 250)
          }
        },
        { threshold: 0.4 }
      )
      facIo.observe(facBody)
    }

    // 5. Trust Words Reveal
    const tWords = document.querySelectorAll<HTMLElement>('.trust-word')
    tWords.forEach((w) => {
      w.style.transform = 'translateY(115%)'
      w.style.opacity = '0'
    })

    const trustObs = new IntersectionObserver(
      (e) => {
        if (e[0].isIntersecting) {
          trustObs.disconnect()
          tWords.forEach((w, i) => {
            setTimeout(() => {
              tween(900, easings.easeOutExpo, (p) => {
                w.style.transform = `translateY(${115 - 115 * p}%)`
                w.style.opacity = String(p)
              })
            }, i * 150)
          })
        }
      },
      { threshold: 0.2 }
    )
    const trustH2 = document.querySelector('#trust h2')
    if (trustH2) trustObs.observe(trustH2)

    // 6. Desktop Hover Springs
    const isDesktop = () => window.innerWidth > 768

    document.querySelectorAll<HTMLElement>('.hover-arrow-row').forEach((row) => {
      const arrow = row.querySelector<HTMLElement>('.prog-arrow-circle')
      if (!arrow) return
      row.addEventListener('mouseenter', () => {
        if (isDesktop()) {
          setSpring(arrow, 'x', 8, 300, 20)
          setSpring(arrow, 'opacity', 1, 300, 20)
        }
      })
      row.addEventListener('mouseleave', () => {
        if (isDesktop()) {
          setSpring(arrow, 'x', 0, 300, 20)
          setSpring(arrow, 'opacity', 0.55, 300, 20)
        }
      })
    })

    document.querySelectorAll<HTMLElement>('.hover-scale-card').forEach((card) => {
      card.addEventListener('mouseenter', () => {
        if (isDesktop()) setSpring(card, 'scale', 1.03, 300, 22)
      })
      card.addEventListener('mouseleave', () => {
        if (isDesktop()) setSpring(card, 'scale', 1, 300, 22)
      })
    })

    document.querySelectorAll<HTMLElement>('.hover-lift').forEach((card) => {
      card.addEventListener('mouseenter', () => {
        if (isDesktop()) setSpring(card, 'y', -8, 300, 22)
      })
      card.addEventListener('mouseleave', () => {
        if (isDesktop()) setSpring(card, 'y', 0, 300, 22)
      })
    })

    document.querySelectorAll<HTMLElement>('.btn-pill').forEach((btn) => {
      const svg = btn.querySelector<HTMLElement>('svg')
      if (!svg) return
      btn.addEventListener('mouseenter', () => {
        if (isDesktop()) setSpring(svg, 'x', 5, 320, 20)
      })
      btn.addEventListener('mouseleave', () => {
        if (isDesktop()) setSpring(svg, 'x', 0, 320, 20)
      })
    })

    // 7. Intro Loader Sequence
    const loader = document.getElementById('loader')
    const loaderWordmark = document.getElementById('loader-wordmark')
    const loaderFill = document.getElementById('loader-fill')

    if (loader && loaderWordmark && loaderFill) {
      lenis.stop()
      setTimeout(() => {
        setSpring(loaderWordmark, 'y', 0, 200, 22)
        setSpring(loaderWordmark, 'opacity', 1, 200, 22)
      }, 50)

      setTimeout(() => {
        tween(1200, easings.easeInOutCubic, (p) => {
          loaderFill.style.transform = `scaleX(${p})`
        })
      }, 100)

      const timer = setTimeout(() => {
        isHeroReadyRef.current = true
        lenis.start()
        tween(
          850,
          easings.easeInOutCubic,
          (p) => {
            loader.style.transform = `translateY(${-105 * p}%)`
          },
          () => {
            setLoaderVisible(false)
          }
        )

        // Trigger Hero Reveals once loader exits
        revealTextClip('#hero-title', 140, 1100, 'easeOutExpo', 0)
        revealTextClip('.hero-tagline', 110, 900, 'easeOutExpo', 350)
        document.querySelectorAll<HTMLElement>('#hero .inview-node').forEach((el) => {
          io.unobserve(el)
          io.observe(el)
        })
      }, 1450)

      return () => {
        clearTimeout(timer)
        cancelAnimationFrame(rafId)
        lenis.destroy()
      }
    } else {
      isHeroReadyRef.current = true
      revealTextClip('#hero-title', 140, 1100, 'easeOutExpo', 0)
      revealTextClip('.hero-tagline', 110, 900, 'easeOutExpo', 350)
      return () => {
        cancelAnimationFrame(rafId)
        lenis.destroy()
      }
    }
  }, [setSpring, setSpringImmediate, updateSprings, revealTextClip])

  // Lock scroll when modals or menu are open
  useEffect(() => {
    if (menuOpen || contactOpen || videoOpen) {
      lenisRef.current?.stop()
      document.documentElement.style.overflow = 'hidden'
    } else {
      lenisRef.current?.start()
      document.documentElement.style.overflow = ''
    }
  }, [menuOpen, contactOpen, videoOpen])

  // Video play/pause on modal toggle
  useEffect(() => {
    if (videoOpen) {
      videoRef.current?.play().catch(() => {})
    } else {
      videoRef.current?.pause()
    }
  }, [videoOpen])

  // Handle escape key to close modals
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setMenuOpen(false)
        setContactOpen(false)
        setVideoOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const scrollToSection = (id: string) => {
    setMenuOpen(false)
    const element = document.getElementById(id)
    if (element && lenisRef.current) {
      lenisRef.current.scrollTo(element, { offset: -20 })
    } else if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError(null)

    if (!formData.name.trim()) {
      setSubmitError('Veuillez renseigner votre nom.')
      return
    }
    if (!formData.email.includes('@')) {
      setSubmitError('Veuillez renseigner une adresse email valide.')
      return
    }
    if (!formData.optIn) {
      setSubmitError('Veuillez accepter de recevoir le guide par email.')
      return
    }

    const parts = formData.name.trim().split(/\s+/)
    const prenom = parts[0]
    const nom = parts.slice(1).join(' ')

    setSubmitLoading(true)
    try {
      const res = await fetch('/api/guide/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email.trim(),
          prenom,
          nom,
          message: formData.message.trim(),
          opt_in: formData.optIn,
          source: 'concept_vendeur_modal',
        }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setUserName(prenom)
        setFormSubmitted(true)
      } else {
        setSubmitError(data.error || 'Une erreur est survenue. Veuillez réessayer.')
      }
    } catch {
      setSubmitError('Erreur de connexion. Veuillez vérifier votre réseau.')
    } finally {
      setSubmitLoading(false)
    }
  }

  return (
    <div className="concept-scope">
      {/* 1. Intro Luxury Loader */}
      {loaderVisible && (
        <div id="loader">
          <div id="loader-wordmark" className="flex items-center gap-3">
            <svg
              className="text-white"
              style={{ width: '1.75rem', height: '1.75rem' }}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            <span style={{ fontSize: '1.5rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Alexandre Lopez
            </span>
          </div>
          <div id="loader-track">
            <div id="loader-fill" />
          </div>
        </div>
      )}

      {/* 2. Contact Modal */}
      {contactOpen && (
        <div className="modal-overlay justify-center items-end sm:items-center p-3 sm:p-6" role="dialog" aria-modal="true">
          <div
            className="modal-backdrop"
            style={{ backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
            onClick={() => setContactOpen(false)}
          />
          <div
            className="modal-panel w-full max-h-[92svh] overflow-y-auto bg-white text-black p-6 sm:p-8 shadow-2xl rounded-3xl"
            style={{ maxWidth: '32rem' }}
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="eyebrow dark">
                  <div className="dot" />
                  Guide gratuit
                </div>
                <h2 className="text-3xl sm:text-4xl font-medium uppercase tracking-tight leading-tight mt-3">
                  Recevez
                  <br />
                  votre guide
                </h2>
              </div>
              <button
                className="btn-close bg-zinc-100 hover:bg-zinc-200"
                onClick={() => setContactOpen(false)}
                aria-label="Fermer la boîte de dialogue"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>

            {!formSubmitted ? (
              <form onSubmit={handleContactSubmit} className="mt-6 flex col gap-4" noValidate>
                <div className="form-field">
                  <label htmlFor="c-name">Nom complet</label>
                  <input
                    type="text"
                    id="c-name"
                    placeholder="Jean Dupont"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="c-email">Email</label>
                  <input
                    type="email"
                    id="c-email"
                    placeholder="jean@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="c-msg">Parlez-moi de votre bien (Optionnel)</label>
                  <textarea
                    id="c-msg"
                    rows={3}
                    placeholder="Maison T4 avec jardin, appartement..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>
                <label htmlFor="c-optin" className="consent-row flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="c-optin"
                    checked={formData.optIn}
                    onChange={(e) => setFormData({ ...formData, optIn: e.target.checked })}
                  />
                  <span>
                    J’accepte de recevoir le guide et des conseils par email. Vous pouvez vous désinscrire à tout moment — voir la{' '}
                    <a href="/politique-confidentialite">politique de confidentialité</a>.
                  </span>
                </label>

                {submitError && (
                  <p className="form-error" role="alert">
                    {submitError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={submitLoading}
                  className="btn-pill solid justify-center mt-2 w-full text-center"
                  style={{ opacity: submitLoading ? 0.7 : 1 }}
                >
                  {submitLoading ? 'Envoi en cours...' : 'Recevoir mon guide par email'}
                </button>
              </form>
            ) : (
              <div className="mt-6 bg-zinc-100 p-6 rounded-2xl text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center mx-auto mb-4">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="text-xl font-medium">Guide envoyé !</div>
                <div className="text-sm text-zinc-600 mt-2 mb-6 leading-relaxed">
                  Vérifiez votre boîte de réception, <strong>{userName}</strong>. Je reste à votre disposition si vous avez la moindre question.
                </div>
                <button
                  type="button"
                  className="btn-pill solid justify-center"
                  onClick={() => {
                    setContactOpen(false)
                    setFormSubmitted(false)
                    setSubmitError(null)
                    setFormData({ name: '', email: '', message: '', optIn: false })
                  }}
                >
                  Fermer
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. Video Modal */}
      {videoOpen && (
        <div className="modal-overlay justify-center items-center p-6" role="dialog" aria-modal="true">
          <div
            className="modal-backdrop bg-black/90"
            style={{ backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
            onClick={() => setVideoOpen(false)}
          />
          <div className="modal-panel w-full max-w-4xl relative z-10">
            <button
              onClick={() => setVideoOpen(false)}
              className="absolute -top-10 right-0 text-white text-xs uppercase tracking-wider opacity-80 hover:opacity-100 flex items-center gap-2 p-1"
            >
              Fermer
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
            <div className="bg-black rounded-3xl overflow-hidden aspect-video shadow-2xl">
              <video
                ref={videoRef}
                controls
                className="w-full h-full object-cover"
                poster="/concept/alexandre-photo.jpg"
              >
                <source src="/concept/video-villa.mp4" type="video/mp4" />
                Votre navigateur ne supporte pas la lecture de vidéos.
              </video>
            </div>
          </div>
        </div>
      )}

      {/* 4. Fullscreen Menu Overlay */}
      {menuOpen && (
        <div className="modal-overlay flex col" style={{ zIndex: 110 }}>
          <div className="modal-backdrop bg-[#006390]" onClick={() => setMenuOpen(false)} />
          <div className="modal-panel h-full w-full flex col p-2 sm:p-3">
            <div className="flex-1 flex col p-6 sm:p-10 text-white">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                  <span className="text-base font-medium uppercase tracking-wider">Alex. Lopez | iad</span>
                </div>
                <button
                  className="btn-close bg-white/15 hover:bg-white/25 text-white"
                  onClick={() => setMenuOpen(false)}
                  aria-label="Fermer le menu"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                    <path d="M6 6l12 12M18 6L6 18" />
                  </svg>
                </button>
              </div>

              <nav className="flex col justify-center gap-2 flex-1 my-12">
                <button onClick={() => scrollToSection('sommaire')} className="menu-link text-left">
                  Le Sommaire
                </button>
                <button onClick={() => scrollToSection('approche')} className="menu-link text-left">
                  Mon Approche
                </button>
                <button onClick={() => scrollToSection('avis')} className="menu-link text-left">
                  Avis Clients
                </button>
                <button onClick={() => scrollToSection('contact')} className="menu-link text-left">
                  Me Contacter
                </button>
              </nav>

              <div className="flex col gap-5 border-t border-white/15 pt-8">
                <button
                  className="btn-pill light self-start"
                  onClick={() => {
                    setMenuOpen(false)
                    setContactOpen(true)
                  }}
                >
                  Télécharger le guide
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </button>
                <div className="flex items-center text-sm gap-5 text-white/70 mt-2">
                  <a href="https://www.linkedin.com/in/alexandrelopeziad/" target="_blank" rel="noopener noreferrer" className="hover-text-white">
                    LinkedIn
                  </a>
                  <a href="https://card.iadfrance.fr/alexandre.lopez" target="_blank" rel="noopener noreferrer" className="hover-text-white">
                    iad France
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. MAIN PAGE BODY */}
      <main>
        {/* HERO SECTION */}
        <section id="hero">
          <div id="hero-bg-wrap">
            {/* Vidéo 1 : Bastide provençale */}
            <video
              ref={bgVideo0Ref}
              src="/concept/video-villa.mp4"
              poster="https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80&w=2000"
              autoPlay
              muted
              playsInline
              onEnded={() => handleBgVideoEnd(0)}
              className="object-cover transition-opacity duration-1000 ease-in-out"
              style={{
                width: '100%',
                height: '100%',
                position: 'absolute',
                inset: 0,
                zIndex: 1,
                opacity: activeBgIndex === 0 ? 1 : 0,
                pointerEvents: 'none',
              }}
            />
            {/* Vidéo 2 : Bord de mer / Côte d'Azur */}
            <video
              ref={bgVideo1Ref}
              src="/concept/video-mer.mp4"
              poster="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=2000"
              autoPlay
              muted
              playsInline
              onEnded={() => handleBgVideoEnd(1)}
              className="object-cover transition-opacity duration-1000 ease-in-out"
              style={{
                width: '100%',
                height: '100%',
                position: 'absolute',
                inset: 0,
                zIndex: 1,
                opacity: activeBgIndex === 1 ? 1 : 0,
                pointerEvents: 'none',
              }}
            />
            <div id="hero-bg-overlay" />
          </div>

          {/* Alexandre Lopez Cutout Portrait with InView Spring */}
          <div
            id="hero-portrait"
            className="hero-portrait inview-node"
            data-inview="y:35, scale:0.96, delay:250, t:180, f:24"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/concept/alexandre-hero.png" alt="Alexandre Lopez - Conseiller iad" className="hero-portrait-img" />
          </div>

          {/* Nav Header */}
          <header className="nav-header flex justify-between items-center">
            <nav className="nav-links flex-1 items-center gap-6">
              <button onClick={() => scrollToSection('sommaire')} className="hover:opacity-100 opacity-90 transition-opacity">
                Au Sommaire
              </button>
              <button onClick={() => scrollToSection('approche')} className="hover:opacity-100 opacity-90 transition-opacity">
                Mon Approche
              </button>
              <button
                onClick={() => setVideoOpen(true)}
                className="flex items-center gap-2 hover:opacity-100 opacity-90 transition-opacity text-white"
              >
                <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                  <svg className="w-2.5 h-2.5 ml-0.5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M5 3l14 9-14 9V3z" />
                  </svg>
                </span>
                Vidéo (1 min)
              </button>
            </nav>
            <div className="flex justify-center items-center gap-2 flex-1">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              <span className="text-base font-medium uppercase tracking-wider">Alex. Lopez | iad</span>
            </div>
            <div className="flex justify-end items-center flex-1 gap-5">
              <button
                className="hidden sm:inline-block uppercase tracking-wide hover:underline underline-offset-4"
                onClick={() => setContactOpen(true)}
              >
                Télécharger le guide
              </button>
              <button className="burger-btn" onClick={() => setMenuOpen(true)} aria-label="Ouvrir le menu">
                <span />
                <span />
              </button>
            </div>
          </header>

          {/* Hero Titles with Clip Mask Reveals */}
          <h1 id="hero-title">
            <div className="hero-title-line">
              <span className="clip-mask" style={{ paddingBottom: '0.12em' }}>
                <span className="inner">Vendez</span>
              </span>
            </div>
            <div className="hero-title-line">
              <span className="clip-mask" style={{ paddingBottom: '0.12em' }}>
                <span className="inner">Comme Un Pro</span>
              </span>
            </div>
          </h1>

          <div className="hero-bottom flex col">
            <div className="hero-tagline">
              <span className="clip-mask" style={{ paddingBottom: '0.14em' }}>
                <span className="inner">Sans agence. Sans commission.</span>
              </span>
              <br />
              <span className="clip-mask" style={{ paddingBottom: '0.14em' }}>
                <span className="inner">Le guide 100% gratuit.</span>
              </span>
            </div>
            <div className="hero-widgets flex flex-col sm:flex-row items-stretch sm:items-end gap-4">
              {/* Carte Vidéo de présentation */}
              <article
                className="glass-card flex items-center p-4 max-w-[22rem] gap-4 cursor-pointer hover:scale-[1.02] transition-transform group inview-node"
                data-inview="y:28, delay:550, t:200, f:26"
                style={{ backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
                onClick={() => setVideoOpen(true)}
              >
                <div className="relative shrink-0 w-16 h-20 rounded-xl overflow-hidden shadow-md border border-white/20 bg-black/40">
                  <Image
                    src="/concept/alexandre-photo.jpg"
                    alt="Vidéo de présentation Alexandre Lopez"
                    fill
                    className="object-cover object-top group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <svg className="w-3.5 h-3.5 ml-0.5 text-[#006390]" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M5 3l14 9-14 9V3z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="flex col gap-1">
                  <div className="eyebrow light text-[0.65rem]">
                    <div className="dot" />
                    Vidéo exclusive
                  </div>
                  <div className="text-sm font-medium leading-tight text-white group-hover:text-[#25cfff] transition-colors">
                    Voir la présentation
                  </div>
                  <div className="text-xs text-white/70 leading-snug">
                    Alexandre vous explique la méthode en 1 minute.
                  </div>
                </div>
              </article>

              {/* Carte Guide gratuit */}
              <article
                className="glass-card flex col p-5 max-w-[22rem] gap-4 cursor-pointer hover:scale-[1.02] transition-transform inview-node"
                data-inview="y:28, delay:650, t:200, f:26"
                style={{ backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
                onClick={() => setContactOpen(true)}
              >
                <div className="flex items-center justify-between">
                  <div className="eyebrow light">
                    <div className="dot" />
                    Nouveau
                  </div>
                  <div className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-xs font-medium">4.9/5 (150+ avis)</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="shrink-0 w-16 h-20 rounded-lg overflow-hidden relative border border-white/20 bg-slate-800">
                    <Image
                      src="/concept/alexandre-photo.jpg"
                      alt="Livre Guide"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex col gap-1">
                    <div className="text-base font-medium leading-tight">Le Guide Ultime du Vendeur</div>
                    <div className="text-xs text-white/70 leading-relaxed">
                      40 pages de conseils de pro et d&apos;astuces pour vendre par vous-même.
                    </div>
                  </div>
                </div>
                <button className="btn-pill light justify-center w-full py-3 normal-case tracking-normal">
                  Télécharger Gratuitement
                </button>
              </article>
            </div>
          </div>
        </section>

        {/* PAIN POINTS SECTION */}
        <section id="pain-points" className="bg-[#f4f4f5] rounded-3xl mt-3 py-20 px-6 sm:px-10">
          <div className="flex col items-center text-center">
            <div className="eyebrow dark mb-4 inview-node" data-inview="y:20, delay:0">
              <div className="dot" />
              La réalité du terrain
            </div>
            <h2 className="text-4xl sm:text-5xl font-medium leading-tight tracking-tight max-w-3xl mx-auto">
              <span className="clip-mask fac-title-line" style={{ paddingBottom: '0.14em' }}>
                <span className="inner">Vendre seul paraît idéal.</span>
              </span>
              <br />
              <span className="clip-mask fac-title-line" style={{ paddingBottom: '0.14em' }}>
                <span className="inner">Jusqu&apos;à ce que...</span>
              </span>
            </h2>
            <p className="text-lg leading-relaxed text-zinc-600 mt-6 max-w-xl inview-node" data-inview="y:20, delay:300">
              Sur le papier, c&apos;est simple. Dans les faits, près de 70% des vendeurs particuliers finissent par abandonner face aux obstacles du marché.
            </p>
          </div>

          <ul className="test-grid mt-14">
            <li className="inview-node test-card hover-lift bg-white shadow-sm" data-inview="y:40, delay:0, t:180, f:26">
              <div>
                <div className="text-4xl font-medium text-zinc-300 leading-none mb-6">01.</div>
                <h3 className="text-xl font-medium tracking-tight mb-3">Le bien &quot;grillé&quot;</h3>
                <p className="text-sm leading-relaxed text-zinc-600">
                  Un prix surestimé par attachement émotionnel. Résultat : des mois sans appel, et l&apos;obligation de brader la maison en urgence car elle a perdu de sa nouveauté.
                </p>
              </div>
            </li>

            <li className="inview-node test-card hover-lift bg-white shadow-sm" data-inview="y:40, delay:120, t:180, f:26">
              <div>
                <div className="text-4xl font-medium text-zinc-300 leading-none mb-6">02.</div>
                <h3 className="text-xl font-medium tracking-tight mb-3">Le défilé des curieux</h3>
                <p className="text-sm leading-relaxed text-zinc-600">
                  Passer ses soirées et week-ends à gérer des appels, préparer le bien, et faire visiter à des acheteurs sans aucun plan de financement validé en amont.
                </p>
              </div>
            </li>

            <li className="inview-node test-card hover-lift bg-white shadow-sm" data-inview="y:40, delay:240, t:180, f:26">
              <div>
                <div className="text-4xl font-medium text-zinc-300 leading-none mb-6">03.</div>
                <h3 className="text-xl font-medium tracking-tight mb-3">L&apos;anxiété juridique</h3>
                <p className="text-sm leading-relaxed text-zinc-600">
                  Diagnostics manquants, clauses du compromis mal rédigées, rétractations de dernière minute... Un stress permanent qui met en péril votre projet de vie.
                </p>
              </div>
            </li>
          </ul>

          <div className="flex justify-center mt-14 inview-node" data-inview="y:20, delay:350">
            <div className="flex col items-center text-center gap-6">
              <p className="text-base font-medium max-w-md">C&apos;est exactement pour vous éviter ce parcours du combattant que j&apos;ai créé ce guide pratique.</p>
              <button className="iad-gelule" onClick={() => setContactOpen(true)}>
                Contactez-moi !
              </button>
            </div>
          </div>
        </section>

        {/* TRUST & EXPERT WORD */}
        <section id="trust">
          <div className="flex col sm:flex-row justify-between relative z-20 gap-8">
            <div
              className="inview-node flex justify-center items-center w-30 h-30 rounded-full bg-white/5 border border-white/10 text-center flex-col"
              data-inview="scale:0.9, t:220, f:22"
            >
              <div className="text-3xl font-medium leading-none">100%</div>
              <div className="text-[0.65rem] text-white/60 font-medium uppercase tracking-wider max-w-[8em] mt-1.5 leading-snug">
                Gratuit & Sans Engagement
              </div>
            </div>
            <article
              className="inview-node flex max-w-lg gap-5 rounded-2xl bg-white/5 p-6 border border-white/10"
              data-inview="y:24, delay:120, t:200, f:26"
              style={{ backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
            >
              <div className="rounded-xl bg-white/10 px-4 py-2 text-2xl font-medium h-fit leading-none text-white/70">&quot;</div>
              <div className="flex col gap-2">
                <div className="text-xl font-medium tracking-tight">Pourquoi j&apos;offre ce guide ?</div>
                <div className="text-sm leading-relaxed text-white/70">
                  Je vois trop de vendeurs particuliers perdre des dizaines de milliers d&apos;euros à cause d&apos;erreurs évitables. En tant que conseiller iad, mon but n&apos;est pas de forcer la main, mais de vous donner toutes les clés. Si le défi s&apos;avère trop grand, vous saurez alors vers qui vous tourner en toute confiance.
                </div>
              </div>
            </article>
          </div>

          <h2 className="flex flex-col items-center">
            <div className="flex justify-center -mb-2 gap-3">
              <span className="clip-mask" style={{ paddingBottom: '0.12em' }}>
                <span className="inner trust-word ghost">Vendez</span>
              </span>
              <span className="clip-mask" style={{ paddingBottom: '0.12em' }}>
                <span className="inner trust-word ghost">Comme</span>
              </span>
            </div>
            <div className="flex justify-center gap-3">
              <span className="clip-mask" style={{ paddingBottom: '0.12em' }}>
                <span className="inner trust-word ink">Un</span>
              </span>
              <span className="clip-mask" style={{ paddingBottom: '0.12em' }}>
                <span className="inner trust-word ghost">Pro.</span>
              </span>
            </div>
          </h2>

          <figure
            className="coach-card inview-node hover-lift"
            data-inview="y:60, scale:0.92, t:170, f:26"
            onClick={() => setVideoOpen(true)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/concept/alexandre-photo.jpg" alt="Alexandre Lopez, conseiller immobilier" className="object-cover" />
            <div className="play-overlay">
              <div className="play-btn">
                <svg className="w-6 h-6 ml-0.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M5 3l14 9-14 9V3z" />
                </svg>
              </div>
            </div>
            <figcaption
              className="coach-caption"
              style={{ backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
            >
              <div className="text-sm font-medium">Alexandre Lopez</div>
              <div className="text-[0.65rem] opacity-80">Voir la présentation</div>
            </figcaption>
          </figure>
        </section>

        {/* SOMMAIRE SECTION */}
        <section id="sommaire">
          <div className="max-w-7xl mx-auto">
            <div className="eyebrow dark">
              <div className="dot" />
              Au sommaire du guide
            </div>
            <h2 className="text-4xl sm:text-5xl font-medium leading-tight tracking-tight mt-4">
              <span className="clip-mask fac-title-line" style={{ paddingBottom: '0.14em' }}>
                <span className="inner">Ce que vous</span>
              </span>
              <br />
              <span className="clip-mask fac-title-line" style={{ paddingBottom: '0.14em' }}>
                <span className="inner">allez découvrir</span>
              </span>
            </h2>

            <ul className="flex col mt-14 list-none p-0">
              <li>
                <div
                  className="program-row flex items-center inview-node hover-arrow-row gap-6 p-4 rounded-xl transition-colors cursor-pointer"
                  data-inview="y:26, delay:0, t:190, f:26"
                  onClick={() => setContactOpen(true)}
                >
                  <div className="w-10 text-sm font-medium text-zinc-500">01</div>
                  <div className="flex-1">
                    <div className="font-medium tracking-tight text-xl sm:text-2xl">Le secret de l&apos;estimation parfaite</div>
                    <div className="text-base text-zinc-600 mt-1 max-w-2xl">
                      La méthode exacte pour fixer un prix qui déclenche le coup de cœur immédiat, sans jamais brader votre patrimoine.
                    </div>
                  </div>
                  <div className="prog-arrow-circle">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </div>
                </div>
              </li>
              <li>
                <div
                  className="program-row flex items-center inview-node hover-arrow-row gap-6 p-4 rounded-xl transition-colors cursor-pointer"
                  data-inview="y:26, delay:90, t:190, f:26"
                  onClick={() => setContactOpen(true)}
                >
                  <div className="w-10 text-sm font-medium text-zinc-500">02</div>
                  <div className="flex-1">
                    <div className="font-medium tracking-tight text-xl sm:text-2xl">L&apos;art de la mise en valeur</div>
                    <div className="text-base text-zinc-600 mt-1 max-w-2xl">
                      Les techniques de professionnels (Home-Staging) pour transformer votre intérieur et justifier un prix dans la fourchette haute du marché.
                    </div>
                  </div>
                  <div className="prog-arrow-circle">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </div>
                </div>
              </li>
              <li>
                <div
                  className="program-row flex items-center inview-node hover-arrow-row gap-6 p-4 rounded-xl transition-colors cursor-pointer"
                  data-inview="y:26, delay:180, t:190, f:26"
                  onClick={() => setContactOpen(true)}
                >
                  <div className="w-10 text-sm font-medium text-zinc-500">03</div>
                  <div className="flex-1">
                    <div className="font-medium tracking-tight text-xl sm:text-2xl">Filtrer et convaincre</div>
                    <div className="text-base text-zinc-600 mt-1 max-w-2xl">
                      Le script complet pour écarter les curieux, vérifier les plans de financement et mener une visite qui donne envie d&apos;acheter.
                    </div>
                  </div>
                  <div className="prog-arrow-circle">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </div>
                </div>
              </li>
              <li>
                <div
                  className="program-row flex items-center inview-node hover-arrow-row gap-6 p-4 rounded-xl transition-colors cursor-pointer"
                  data-inview="y:26, delay:270, t:190, f:26"
                  onClick={() => setContactOpen(true)}
                >
                  <div className="w-10 text-sm font-medium text-zinc-500">04</div>
                  <div className="flex-1">
                    <div className="font-medium tracking-tight text-xl sm:text-2xl">Négociation & Sécurisation</div>
                    <div className="text-base text-zinc-600 mt-1 max-w-2xl">
                      Les arguments pour ne pas céder sur votre prix net vendeur et les pièges juridiques à éviter jusqu&apos;à la signature chez le notaire.
                    </div>
                  </div>
                  <div className="prog-arrow-circle">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </section>

        {/* MON APPROCHE SECTION */}
        <section id="approche">
          <div className="fac-grid">
            <div className="max-w-sm">
              <div className="w-16 h-16 rounded-2xl overflow-hidden relative mb-6 inview-node" data-inview="scale:0.85, t:240, f:20">
                <Image
                  src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=800"
                  alt="Salon immobilier moderne"
                  fill
                  className="object-cover"
                />
              </div>
              <h2 className="text-4xl sm:text-5xl font-medium leading-tight tracking-tight">
                <span className="clip-mask fac-title-line" style={{ paddingBottom: '0.14em' }}>
                  <span className="inner">Et si vous</span>
                </span>
                <br />
                <span className="clip-mask fac-title-line" style={{ paddingBottom: '0.14em' }}>
                  <span className="inner">aviez besoin</span>
                </span>
                <br />
                <span className="clip-mask fac-title-line" style={{ paddingBottom: '0.14em' }}>
                  <span className="inner">d&apos;aide ?</span>
                </span>
              </h2>
              <p className="text-sm leading-relaxed text-zinc-600 mt-6 max-w-xs" id="fac-body">
                L&apos;objectif de ce guide est de vous rendre autonome. Mais si le temps vous manque ou si la vente s&apos;avère complexe, vous saurez à qui faire appel.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-end gap-5">
              <figure className="court-card flex-1 w-full hover-scale-card inview-node" data-inview="y:48, delay:0, t:180, f:26">
                <div className="relative w-full aspect-[3/4]">
                  <Image
                    src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800"
                    alt="Intérieur de maison valorisé"
                    fill
                    className="object-cover"
                  />
                </div>
                <figcaption
                  className="absolute left-3 right-3 bottom-3 rounded-xl bg-black/60 text-white p-3 sm:p-4"
                  style={{ backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
                >
                  <div className="text-sm font-medium">Diffusion Puissante</div>
                  <div className="text-[0.7rem] opacity-85 mt-0.5 leading-snug">
                    Une visibilité maximale sur tous les portails immobiliers majeurs (SeLoger, Leboncoin, etc.).
                  </div>
                </figcaption>
              </figure>

              <figure className="court-card flex-1 w-full sm:mb-8 hover-scale-card inview-node" data-inview="y:48, delay:140, t:180, f:26">
                <div className="relative w-full aspect-[3/4]">
                  <Image
                    src="https://images.unsplash.com/photo-1600566753086-00f18efc2291?auto=format&fit=crop&q=80&w=800"
                    alt="Détail cuisine premium"
                    fill
                    className="object-cover"
                  />
                </div>
                <figcaption
                  className="absolute left-3 right-3 bottom-3 rounded-xl bg-[#006390]/80 text-white p-3 sm:p-4"
                  style={{ backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
                >
                  <div className="text-sm font-medium">Accompagnement Premium</div>
                  <div className="text-[0.7rem] opacity-85 mt-0.5 leading-snug">
                    Un suivi sur-mesure, de l&apos;estimation offerte jusqu&apos;à la remise des clés chez le notaire.
                  </div>
                </figcaption>
              </figure>
            </div>
          </div>
        </section>

        {/* STATS SECTION */}
        <section id="stats">
          <div className="eyebrow light">
            <div className="dot" />
            Mon Bilan
          </div>
          <h2 className="text-4xl sm:text-5xl font-medium leading-tight tracking-tight mt-4">
            <span className="clip-mask fac-title-line" style={{ paddingBottom: '0.14em' }}>
              <span className="inner">Un conseiller</span>
            </span>
            <br />
            <span className="clip-mask fac-title-line" style={{ paddingBottom: '0.14em' }}>
              <span className="inner">engagé</span>
            </span>
          </h2>
          <dl className="stats-grid">
            <div className="border-t border-white/20 pt-5 inview-node" data-inview="y:30, delay:0, t:180, f:24">
              <dt className="sr-only">Familles accompagnées</dt>
              <dd>
                <div className="font-medium tracking-tight leading-none text-5xl sm:text-6xl">45+</div>
                <div className="text-sm text-white/70 mt-3">Familles accompagnées</div>
              </dd>
            </div>
            <div className="border-t border-white/20 pt-5 inview-node" data-inview="y:30, delay:110, t:180, f:24">
              <dt className="sr-only">Avis positifs</dt>
              <dd>
                <div className="font-medium tracking-tight leading-none text-5xl sm:text-6xl">100%</div>
                <div className="text-sm text-white/70 mt-3">Avis positifs</div>
              </dd>
            </div>
            <div className="border-t border-white/20 pt-5 inview-node" data-inview="y:30, delay:220, t:180, f:24">
              <dt className="sr-only">Délai moyen de vente (Jours)</dt>
              <dd>
                <div className="font-medium tracking-tight leading-none text-5xl sm:text-6xl">30</div>
                <div className="text-sm text-white/70 mt-3">Jours : délai moyen de vente</div>
              </dd>
            </div>
            <div className="border-t border-white/20 pt-5 inview-node" data-inview="y:30, delay:330, t:180, f:24">
              <dt className="sr-only">Interlocuteur unique</dt>
              <dd>
                <div className="font-medium tracking-tight leading-none text-5xl sm:text-6xl">1</div>
                <div className="text-sm text-white/70 mt-3">Interlocuteur unique dédié</div>
              </dd>
            </div>
          </dl>
        </section>

        {/* TESTIMONIALS SECTION */}
        <section id="avis">
          <div className="eyebrow dark">
            <div className="dot" />
            Avis clients
          </div>
          <h2 className="text-4xl sm:text-5xl font-medium leading-tight tracking-tight mt-4">
            <span className="clip-mask fac-title-line" style={{ paddingBottom: '0.14em' }}>
              <span className="inner">Ils m&apos;ont</span>
            </span>
            <br />
            <span className="clip-mask fac-title-line" style={{ paddingBottom: '0.14em' }}>
              <span className="inner">fait confiance</span>
            </span>
          </h2>
          <ul className="test-grid">
            <li className="test-card hover-lift inview-node shadow-sm" data-inview="y:40, delay:0, t:180, f:26">
              <div>
                <div className="text-4xl leading-none text-[#25cfff]">&quot;</div>
                <blockquote className="text-lg leading-relaxed text-black mt-4">
                  Alexandre nous a d&apos;abord conseillé sur notre vente entre particuliers. Finalement, nous lui avons confié le mandat et la maison s&apos;est vendue en 2 semaines !
                </blockquote>
              </div>
              <figcaption className="border-t border-zinc-200 pt-4 mt-6">
                <div className="font-medium">Sophie & Thomas</div>
                <div className="text-sm text-zinc-500">Vendeurs</div>
              </figcaption>
            </li>
            <li className="test-card hover-lift inview-node shadow-sm" data-inview="y:40, delay:120, t:180, f:26">
              <div>
                <div className="text-4xl leading-none text-[#25cfff]">&quot;</div>
                <blockquote className="text-lg leading-relaxed text-black mt-4">
                  Un accompagnement au top, très à l&apos;écoute et toujours disponible. L&apos;estimation était très juste. Je recommande vivement son expertise.
                </blockquote>
              </div>
              <figcaption className="border-t border-zinc-200 pt-4 mt-6">
                <div className="font-medium">Marc L.</div>
                <div className="text-sm text-zinc-500">Acquéreur</div>
              </figcaption>
            </li>
            <li className="test-card hover-lift inview-node shadow-sm" data-inview="y:40, delay:240, t:180, f:26">
              <div>
                <div className="text-4xl leading-none text-[#25cfff]">&quot;</div>
                <blockquote className="text-lg leading-relaxed text-black mt-4">
                  Je voulais vendre seule mais j&apos;étais bloquée. Alexandre a pris le relais et a su mettre en valeur mon appartement. Merci !
                </blockquote>
              </div>
              <figcaption className="border-t border-zinc-200 pt-4 mt-6">
                <div className="font-medium">Julie D.</div>
                <div className="text-sm text-zinc-500">Vendeuse</div>
              </figcaption>
            </li>
          </ul>
        </section>

        {/* FOOTER SECTION */}
        <footer id="contact">
          <div className="footer-cta">
            <div>
              <div className="eyebrow light">
                <div className="dot" />
                Passez à l&apos;action
              </div>
              <p className="text-5xl sm:text-6xl font-medium tracking-tight leading-tight mt-4">
                Prêt à
                <br />
                vendre ?
              </p>
            </div>
            <button className="btn-pill light inview-node" data-inview="y:20, delay:150, t:200, f:24" onClick={() => setContactOpen(true)}>
              Télécharger le guide
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </button>
          </div>

          <div className="footer-cols">
            <div className="max-w-xs">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
                <span className="text-lg font-medium uppercase tracking-wider">Alex. Lopez</span>
              </div>
              <p className="text-sm leading-relaxed text-white/70 mt-4">
                Conseiller immobilier indépendant membre du premier réseau français (iad).
              </p>
              <address className="text-sm not-italic text-white/80 mt-6 flex col gap-1">
                <a href="mailto:alexandre.lopez@iadfrance.fr" className="hover-text-white">
                  alexandre.lopez@iadfrance.fr
                </a>
                <span className="text-white/60">Réseau iad France</span>
              </address>
            </div>

            <nav>
              <h3 className="text-xs font-medium uppercase tracking-wider text-white/50 mb-5">Plan de la page</h3>
              <ul className="text-sm flex col text-white/80 gap-3 list-none p-0">
                <li>
                  <button onClick={() => scrollToSection('sommaire')} className="hover-text-white">
                    Le Sommaire
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('approche')} className="hover-text-white">
                    Mon Approche
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('avis')} className="hover-text-white">
                    Avis Clients
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('contact')} className="hover-text-white">
                    Contact
                  </button>
                </li>
              </ul>
            </nav>

            <nav>
              <h3 className="text-xs font-medium uppercase tracking-wider text-white/50 mb-5">Réseaux & Mentions</h3>
              <ul className="text-sm flex col text-white/80 gap-3 list-none p-0">
                <li>
                  <a href="https://www.linkedin.com/in/alexandrelopeziad/" target="_blank" rel="noopener noreferrer" className="hover-text-white">
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a href="https://card.iadfrance.fr/alexandre.lopez" target="_blank" rel="noopener noreferrer" className="hover-text-white">
                    Profil iad
                  </a>
                </li>
                <li>
                  <a href="/mentions-legales" className="hover-text-white">
                    Mentions légales
                  </a>
                </li>
                <li>
                  <a href="/politique-confidentialite" className="hover-text-white">
                    Confidentialité
                  </a>
                </li>
              </ul>
            </nav>
          </div>

          <div className="footer-bottom">
            <div>© {new Date().getFullYear()} Alexandre Lopez. Tous droits réservés.</div>
          </div>
        </footer>
      </main>
    </div>
  )
}
