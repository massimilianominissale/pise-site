import Link from 'next/link'

import { asMedia, Img } from '@/components/ui/Img'
import { type Locale, localizedPath } from '@/i18n/config'
import type { Dictionary } from '@/i18n/dictionary'
import type { Home, Media } from '@/payload-types'

/**
 * Partenariat IMRSIVO (accueil et espaces virtuels) : présentation courte, puis lien vers la page
 * qui détaille les solutions (visites virtuelles, générateur d'aménagement).
 */
export function ImrsivoPartner({
  imrsivo,
  locale,
  dict,
  id,
}: {
  imrsivo: Home['imrsivo']
  locale: Locale
  dict: Dictionary
  id?: string
}) {
  if (!imrsivo?.title) return null
  const images = (imrsivo.images ?? []).map(asMedia).filter((m): m is Media => Boolean(m))
  return (
    <section
      id={id}
      className={`container split split--imrsivo${images.length ? '' : ' split--solo'}`}
    >
      <div className="split__text">
        <span className="pise-eyebrow eyebrow-mute">{dict.imrsivo.eyebrow}</span>
        <h2 className="sec-title">{imrsivo.title}</h2>
        {imrsivo.text ? <p className="lead lead--sm">{imrsivo.text}</p> : null}
        <div className="actions">
          <Link
            className="pise-btn pise-btn--outline"
            href={localizedPath(locale, null, 'imrsivo')}
          >
            {dict.imrsivo.cta}
          </Link>
        </div>
      </div>
      {images.length ? (
        <div className="imrsivo__media">
          {images.slice(0, 3).map((image, i) => (
            <div key={image.id} className={`imrsivo__img${i === 0 ? ' imrsivo__img--wide' : ''}`}>
              <Img media={image} sizes={i === 0 ? '(min-width: 1100px) 50vw, 100vw' : '25vw'} />
            </div>
          ))}
        </div>
      ) : null}
    </section>
  )
}
