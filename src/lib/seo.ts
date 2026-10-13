import type { Metadata } from 'next'

import { LOCALES, type Locale } from '@/i18n/config'
import type { Media } from '@/payload-types'

import { switchLocaleHref } from './links'

/** Adresse publique du site (domaine de production, sinon adresse du déploiement). */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SERVER_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'http://localhost:3000')

/**
 * Le site n'est indexable qu'une fois le domaine basculé : variable SITE_INDEXABLE=true sur Vercel
 * (production uniquement). Les préversions ne le sont jamais.
 */
export const INDEXABLE =
  process.env.SITE_INDEXABLE === 'true' && process.env.VERCEL_ENV !== 'preview'

/** Balises canonique et hreflang d'une page, à partir de son adresse française. */
export const alternates = (locale: Locale, frPath: string): Metadata['alternates'] => {
  const languages: Record<string, string> = {}
  for (const l of LOCALES) languages[l] = switchLocaleHref(frPath, 'fr', l)
  languages['x-default'] = frPath
  return { canonical: switchLocaleHref(frPath, 'fr', locale), languages }
}

/** Image de partage (Open Graph) à partir d'un média du back-office. */
export const ogImages = (...candidates: unknown[]) => {
  for (const c of candidates) {
    if (c && typeof c === 'object' && 'url' in c && (c as Media).url) {
      const m = c as Media
      return [{ url: m.sizes?.hero?.url || m.url!, alt: m.alt || '' }]
    }
  }
  return undefined
}
