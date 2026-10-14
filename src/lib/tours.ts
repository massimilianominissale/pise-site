import type { Locale } from '@/i18n/config'
import { localizedPath } from '@/i18n/config'
import type { VirtualTour } from '@/payload-types'

import { safeEmbedUrl } from './embed'
import { docHref } from './links'

export type TourLink = { href: string; external: boolean }

type TourLike = Pick<VirtualTour, 'slug' | 'embedUrl' | 'availability' | 'display'>

/** Adresse https de la visite IMRSIVO, à ouvrir dans un nouvel onglet. */
export const tourUrl = (tour: TourLike): string | null =>
  tour.availability === 'soon' ? null : safeEmbedUrl(tour.embedUrl, [])

/**
 * Où mène la vignette d'une visite : directement à la visite IMRSIVO, dans un nouvel onglet
 * (choix par défaut, comme sur l'ancien site), ou à la page de la visite quand celle-ci
 * l'affiche dans un lecteur intégré (ou qu'elle n'est pas encore en ligne).
 */
export const tourLink = (locale: Locale, tour: TourLike): TourLink => {
  const page = docHref(locale, 'tours', tour) ?? localizedPath(locale, 'tours')
  const url = tour.display === 'iframe' ? null : tourUrl(tour)
  return url ? { href: url, external: true } : { href: page, external: false }
}

/** Attributs d'un lien qui ouvre un nouvel onglet. */
export const newTab = { target: '_blank', rel: 'noopener noreferrer' } as const

/**
 * Lecteur d'une visite : intégré à la page si la visite le demande et que son domaine est
 * autorisé (Réglages › Intégrations), sinon vignette qui ouvre la visite dans un nouvel onglet.
 */
export const tourViewer = (
  tour: TourLike,
  frameOrigins: string[],
): { src: string; mode: 'iframe' | 'link' } | null => {
  const url = tourUrl(tour)
  if (!url) return null
  if (tour.display === 'iframe') {
    const framed = safeEmbedUrl(tour.embedUrl, frameOrigins)
    if (framed) return { src: framed, mode: 'iframe' }
  }
  return { src: url, mode: 'link' }
}
