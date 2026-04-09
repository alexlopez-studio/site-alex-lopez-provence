import imageUrlBuilder from '@sanity/image-url'
import { client } from './sanity.client'

function getBuilder() {
  if (!client) return null
  return imageUrlBuilder(client)
}

export function urlForImage(source: unknown) {
  const b = getBuilder()
  if (!b) return null
  return b.image(source)
}

export function getImageUrl(source: unknown, width = 1200, height?: number): string {
  const b = getBuilder()
  if (!b || !source) return ''
  let img = b.image(source).width(width).auto('format').quality(80)
  if (height) img = img.height(height)
  return img.url()
}

export function getOgImageUrl(source: unknown): string {
  const b = getBuilder()
  if (!b || !source) return ''
  return b.image(source).width(1200).height(630).auto('format').quality(80).url()
}
