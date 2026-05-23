'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { classifyTrackedLink, trackEvent } from '@/lib/analytics'

export function LinkClickTracker() {
  const pathname = usePathname()

  useEffect(function () {
    trackEvent('page_view', {
      page_path: pathname,
      page_location: window.location.href,
    })
  }, [pathname])

  useEffect(function () {
    function handleClick(event: MouseEvent) {
      const target = event.target instanceof Element ? event.target.closest('a') : null
      const href = target?.getAttribute('href')
      if (!target || !href) return

      const tracked = classifyTrackedLink({
        href,
        label: target.textContent,
        sourcePath: pathname,
        origin: window.location.origin,
      })

      if (!tracked) return
      trackEvent(tracked.name, tracked.params)
    }

    document.addEventListener('click', handleClick, true)
    return function () { document.removeEventListener('click', handleClick, true) }
  }, [pathname])

  return null
}
