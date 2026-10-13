import { NextResponse, type NextRequest } from 'next/server'

import { DEFAULT_LOCALE, isLocale, ROUTES } from './i18n/config'

/** Rubrique correspondant à un segment, quelle que soit sa langue (« brands » → rubrique fabricants). */
const routeOf = (segment: string) =>
  Object.values(ROUTES).find((route) => (Object.values(route) as string[]).includes(segment))

/**
 * Langues dans l'URL :
 * - /fabricants/nardi        → servi par /fr/fabricants/nardi
 * - /en/brands/nardi         → servi par /en/brands/nardi (dossier anglais qui reprend la page française)
 * - /fr/...                  → redirigé vers l'adresse sans préfixe
 * - /en/fabricants/nardi     → redirigé vers /en/brands/nardi (rubrique dans la langue de la page)
 *
 * Le proxy n'ajoute que la langue : réécrire aussi le nom de la rubrique fait boucler le
 * préchargement des liens de Next, d'où un dossier par langue pour chaque rubrique.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const segments = pathname.split('/').filter(Boolean)
  const first = segments[0]

  if (first === DEFAULT_LOCALE) {
    const url = request.nextUrl.clone()
    url.pathname = '/' + segments.slice(1).join('/')
    return NextResponse.redirect(url, 308)
  }

  const locale = isLocale(first) ? first : DEFAULT_LOCALE
  const rest = isLocale(first) ? segments.slice(1) : segments

  const route = rest[0] ? routeOf(rest[0]) : undefined
  if (route && route[locale] !== rest[0]) {
    const url = request.nextUrl.clone()
    const prefix = locale === DEFAULT_LOCALE ? [] : [locale]
    url.pathname = '/' + [...prefix, route[locale], ...rest.slice(1)].join('/')
    return NextResponse.redirect(url, 308)
  }

  const url = request.nextUrl.clone()
  url.pathname = '/' + [locale, ...rest].join('/')
  // La langue est transmise aux pages (utile à la page 404, qui ne reçoit pas les paramètres d'URL).
  const headers = new Headers(request.headers)
  headers.set('x-pise-locale', locale)
  return NextResponse.rewrite(url, { request: { headers } })
}

export const config = {
  // Tout sauf l'administration, l'API, les fichiers internes de Next et les fichiers statiques.
  matcher: [
    '/((?!admin|api|_next|next|brand|favicon.ico|robots.txt|sitemap.xml|llms.txt|.*\\.[a-z0-9]+$).*)',
  ],
}
