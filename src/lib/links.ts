import {
  DEFAULT_LOCALE,
  isLocale,
  type Locale,
  localizedPath,
  toInternalSegment as toFrench,
  toLocalizedSegment,
} from '@/i18n/config'

/**
 * Adresses publiques du site. Utilisable côté serveur comme côté navigateur.
 */

type Slugged = { slug?: string | null; brand?: unknown }

const slugOf = (doc: unknown): string | null =>
  doc && typeof doc === 'object' && 'slug' in doc ? ((doc as Slugged).slug ?? null) : null

/** Adresse d'un document selon sa collection. */
export const docHref = (locale: Locale, relationTo: string, doc: unknown): string | null => {
  const slug = slugOf(doc)
  if (!slug) return null
  switch (relationTo) {
    case 'brands':
      return localizedPath(locale, 'brands', slug)
    case 'ranges': {
      const brandSlug = slugOf((doc as Slugged).brand)
      return brandSlug ? localizedPath(locale, 'brands', brandSlug, slug) : null
    }
    case 'products':
      return localizedPath(locale, 'products', slug)
    case 'projects':
      return localizedPath(locale, 'projects', slug)
    case 'posts':
      return localizedPath(locale, 'news', slug)
    case 'virtual-tours':
      return localizedPath(locale, 'tours', slug)
    case 'events':
      return localizedPath(locale, 'agency', 'salons', slug)
    case 'pages':
      return localizedPath(locale, null, slug)
    default:
      return null
  }
}

/**
 * Rubrique saisie en français dans le back-office (« /fabricants#marques ») → adresse dans la langue
 * demandée (« /en/brands#marques »). Les adresses externes sont rendues telles quelles.
 */
export const localizeHref = (locale: Locale, href: string): string => {
  if (!href.startsWith('/') || href.startsWith('//')) return href
  const match = href.match(/^([^?#]*)(.*)$/)
  const path = match?.[1] ?? href
  const suffix = match?.[2] ?? ''
  const segments = path.split('/').filter(Boolean)
  if (segments[0] && isLocale(segments[0])) segments.shift()
  if (segments.length) segments[0] = toLocalizedSegment(locale, segments[0])
  const prefix = locale === DEFAULT_LOCALE ? '' : `/${locale}`
  const base = (prefix + '/' + segments.join('/')).replace(/\/$/, '') || '/'
  return base + suffix
}

export type LinkValue = {
  type?: 'internal' | 'external' | null
  newTab?: boolean | null
  reference?: { relationTo: string; value: unknown } | null
  url?: string | null
  label?: string | null
}

export type ResolvedLink = { href: string; label: string; newTab: boolean; external: boolean }

/** Champ « lien » du back-office → adresse, texte et cible. Null si le lien n'est pas renseigné. */
export const resolveLink = (
  link: LinkValue | null | undefined,
  locale: Locale,
  fallbackLabel = '',
): ResolvedLink | null => {
  if (!link) return null
  let href: string | null = null
  if (link.type === 'external') {
    href = link.url ? localizeHref(locale, link.url.trim()) : null
  } else if (link.reference) {
    href = docHref(locale, link.reference.relationTo, link.reference.value)
  }
  if (!href) return null
  const reference = link.reference?.value as { name?: string; title?: string } | undefined
  const label = link.label || reference?.title || reference?.name || fallbackLabel
  const external = /^https?:\/\//.test(href)
  return { href, label, newTab: Boolean(link.newTab), external }
}

/** Adresse équivalente dans une autre langue (pour le sélecteur de langue). */
export const switchLocaleHref = (pathname: string, from: Locale, to: Locale): string => {
  const segments = pathname.split('/').filter(Boolean)
  if (segments[0] && isLocale(segments[0])) segments.shift()
  if (segments.length) {
    // Segment de la langue d'origine → segment français → segment de la langue cible.
    const frSegment = toFrench(from, segments[0])
    segments[0] = toLocalizedSegment(to, frSegment)
  }
  const prefix = to === DEFAULT_LOCALE ? '' : `/${to}`
  return (prefix + '/' + segments.join('/')).replace(/\/$/, '') || '/'
}
