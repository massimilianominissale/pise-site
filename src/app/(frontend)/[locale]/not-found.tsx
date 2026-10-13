import Link from 'next/link'
import { headers } from 'next/headers'

import { DEFAULT_LOCALE, isLocale, localizedPath } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionary'

/** Page 404 : la langue vient de l'en-tête posé par le proxy (une page 404 ne reçoit pas les paramètres). */
export default async function NotFound() {
  const header = (await headers()).get('x-pise-locale') ?? undefined
  const locale = isLocale(header) ? header : DEFAULT_LOCALE
  const dict = getDictionary(locale)
  return (
    <section className="container not-found">
      <span className="pise-eyebrow eyebrow-mute">404</span>
      <h1 className="page-title">{dict.notFound.title}</h1>
      <p className="lead">{dict.notFound.text}</p>
      <div className="actions">
        <Link className="pise-btn" href={localizedPath(locale)}>
          {dict.notFound.back}
        </Link>
        <Link className="pise-btn pise-btn--outline" href={localizedPath(locale, 'brands')}>
          {dict.brands.ourBrands}
        </Link>
      </div>
    </section>
  )
}
