import type { Locale } from '@/i18n/config'
import type { Dictionary } from '@/i18n/dictionary'
import type { Brand, Media, Sector } from '@/payload-types'

import { docHref } from './links'

/** Fabricant réduit à ce qu'affichent les cartes (données sérialisables pour les composants interactifs). */
export type BrandSummary = {
  id: number
  name: string
  href: string
  universes: string[]
  /** « Mobilier · Suède » */
  meta: string
  /** Premier univers seul, pour les petites cartes. */
  primaryUniverse: string | null
  country: string | null
  sectors: { slug: string; name: string }[]
  tagline: string | null
  image: Media | null
}

const media = (value: unknown): Media | null =>
  value && typeof value === 'object' && 'url' in value ? (value as Media) : null

export const universeLabels = (brand: Pick<Brand, 'universes'>, dict: Dictionary): string[] =>
  (brand.universes ?? []).map((u) => dict.universes[u])

export const toBrandSummary = (brand: Brand, locale: Locale, dict: Dictionary): BrandSummary => {
  const universes = universeLabels(brand, dict)
  const meta = [universes.join(', '), brand.country].filter(Boolean).join(' · ')
  return {
    id: brand.id,
    name: brand.name,
    href: docHref(locale, 'brands', brand) ?? '#',
    universes: brand.universes ?? [],
    meta,
    primaryUniverse: universes[0] ?? null,
    country: brand.country ?? null,
    sectors: (brand.sectors ?? [])
      .filter((s): s is Sector => typeof s === 'object' && s !== null)
      .map((s) => ({ slug: s.slug ?? String(s.id), name: s.name })),
    tagline: brand.tagline ?? null,
    image: media(brand.cardImage) ?? media(brand.heroImage),
  }
}
