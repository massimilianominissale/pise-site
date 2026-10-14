import 'server-only'

import { type Locale, LOCALES, localizedPath, type RouteKey } from '@/i18n/config'

import { getLocalizedSlugs } from './payload'

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
