import imageUrlBuilder from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'
import { client } from './sanity.client'

function getBuilder() {
  if (!client) return null
  return imageUrlBuilder(client)
}

/** Vérifie qu'un objet image Sanity a bien une référence asset */
function hasAsset(source: unknown): boolean {
  if (!source || typeof source !== 'object') return false
  const s = source as Record<string, unknown>
  return !!s.asset || !!(s._ref)
}

export function urlForImage(source: SanityImageSource) {
  const b = getBuilder()
  if (!b || !hasAsset(source)) return null
  try { return b.image(source) } catch { return null }
}

export function getImageUrl(source: SanityImageSource, width = 1200, height?: number): string {
  const b = getBuilder()
  if (!b || !hasAsset(source)) return ''
  try {
    let img = b.image(source).width(width).auto('format').quality(80)
    if (height) img = img.height(height)
    return img.url()
  } catch {
    return ''
  }
}

export function getOgImageUrl(source: SanityImageSource): string {
  const b = getBuilder()
  if (!b || !hasAsset(source)) return ''
  try {
    return b.image(source).width(1200).height(630).auto('format').quality(80).url()
  } catch {
    return ''
  }
}
