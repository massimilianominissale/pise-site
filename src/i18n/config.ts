/**
 * Langues du site. Le français est servi sans préfixe (/fabricants),
 * l'anglais et l'italien sous /en et /it, avec des segments d'URL traduits.
 */
export const LOCALES = ['fr', 'en', 'it'] as const
export type Locale = (typeof LOCALES)[number]
export const DEFAULT_LOCALE: Locale = 'fr'

export const isLocale = (value: string | undefined): value is Locale =>
  !!value && (LOCALES as readonly string[]).includes(value)

/**
 * Rubriques du site et leur segment d'URL par langue.
 * Chaque rubrique a un dossier par langue sous src/app/(frontend)/[locale] : le dossier français
 * contient la page, les dossiers anglais et italien la reprennent (une ligne). Voir src/proxy.ts.
 */
export const ROUTES = {
  brands: { fr: 'fabricants', en: 'brands', it: 'marchi' },
  products: { fr: 'produits', en: 'products', it: 'prodotti' },
  projects: { fr: 'realisations', en: 'projects', it: 'progetti' },
  tours: { fr: 'espaces-virtuels', en: 'virtual-spaces', it: 'spazi-virtuali' },
  generator: { fr: 'generateur', en: 'space-planner', it: 'generatore' },
  appointment: { fr: 'rendez-vous', en: 'appointment', it: 'appuntamento' },
  contact: { fr: 'contact', en: 'contact', it: 'contatti' },
  pro: { fr: 'pro', en: 'pro', it: 'pro' },
  news: { fr: 'actualites', en: 'news', it: 'notizie' },
  agency: { fr: 'agence', en: 'agency', it: 'agenzia' },
} as const satisfies Record<string, Record<Locale, string>>

export type RouteKey = keyof typeof ROUTES

/** Construit une adresse publique : localizedPath('en', 'brands', 'nardi') → /en/brands/nardi */
export const localizedPath = (
  locale: Locale,
  route?: RouteKey | null,
  ...slugs: (string | null | undefined)[]
) => {
  const parts: string[] = []
  if (locale !== DEFAULT_LOCALE) parts.push(locale)
  if (route) parts.push(ROUTES[route][locale])
  for (const slug of slugs) if (slug) parts.push(slug)
  return '/' + parts.join('/')
}

/** Segment traduit → segment français, pour le sélecteur de langue. */
export const toInternalSegment = (locale: Locale, segment: string): string => {
  for (const route of Object.values(ROUTES)) {
    if (route[locale] === segment) return route.fr
  }
  return segment
}

/** Segment français → segment de la langue demandée, pour le sélecteur de langue. */
export const toLocalizedSegment = (locale: Locale, frSegment: string): string => {
  for (const route of Object.values(ROUTES)) {
    if (route.fr === frSegment) return route[locale]
  }
  return frSegment
}
