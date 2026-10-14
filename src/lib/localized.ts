import 'server-only'

import { type Locale, LOCALES, localizedPath, type RouteKey } from '@/i18n/config'

import { docHref } from './links'
import { getLocalizedSlugs, getPayloadClient } from './payload'

type Collection = Parameters<typeof getLocalizedSlugs>[0]

/** Adresse d'un document à identifiant traduit, dans chaque langue (balises hreflang). */
export const localizedDocPaths = async (
  collection: Collection,
  route: RouteKey | null,
  id: number,
  ...prefix: string[]
): Promise<Record<Locale, string>> => {
  const slugs = await getLocalizedSlugs(collection, id)
  return Object.fromEntries(
    LOCALES.map((l) => [l, localizedPath(l, route, ...prefix, slugs[l])]),
  ) as Record<Locale, string>
}

/** Adresse d'une page libre dans chaque langue, pages parentes comprises. */
export const localizedPagePaths = async (id: number): Promise<Record<Locale, string>> => {
  const payload = await getPayloadClient()
  const entries = await Promise.all(
    LOCALES.map(async (l) => {
      const page = await payload.findByID({
        collection: 'pages',
        id,
        locale: l,
        depth: 3,
        populate: { pages: { slug: true, parent: true } },
      })
      return [l, docHref(l, 'pages', page) ?? localizedPath(l)] as const
    }),
  )
  return Object.fromEntries(entries) as Record<Locale, string>
}
