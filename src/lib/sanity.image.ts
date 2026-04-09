import imageUrlBuilder from '@sanity/image-url'
import { client } from './sanity.client'

const builder = imageUrlBuilder(client)

export function urlForImage(source: any) {
  return builder.image(source)
}

export function getImageUrl(
  source: any,
  width: number = 1200,
  height?: number
): string {
  if (!source) return ''
  let img = builder.image(source).width(width).auto('format').quality(80)
  if (height) img = img.height(height)
  return img.url()
}

export function getOgImageUrl(source: any): string {
  if (!source) return ''
  return builder.image(source).width(1200).height(630).auto('format').quality(80).url()
}
