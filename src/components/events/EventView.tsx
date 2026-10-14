import Link from 'next/link'

import { BrandCard } from '@/components/brands/BrandCard'
import { asMedia, Img } from '@/components/ui/Img'
import { JsonLd } from '@/components/ui/JsonLd'
import { type Locale, localizedPath } from '@/i18n/config'
import type { Dictionary } from '@/i18n/dictionary'
import { toBrandSummary } from '@/lib/brands'
import { formatDateRange } from '@/lib/format'
import { docHref } from '@/lib/links'
import { SITE_URL } from '@/lib/seo'
import type { Brand, Event } from '@/payload-types'

/** Fiche d'un salon : dates, lieu, stand, marques présentes, réservation d'un créneau. */
export function EventView({
  event,
  locale,
  dict,
}: {
  event: Event
  locale: Locale
  dict: Dictionary
}) {
  const t = dict.eventPage
  const brands = (event.brands ?? []).filter((b): b is Brand => typeof b === 'object' && b !== null)
  const ended = new Date(event.endDate ?? event.startDate) < new Date(new Date().toDateString())
  const dates = formatDateRange(locale, event.startDate, event.endDate)
  const place = [event.venue, event.city].filter(Boolean).join(', ')
  const book = `${localizedPath(locale, 'appointment')}?${new URLSearchParams({
    format: 'showroom',
    ...(brands[0]?.slug ? { fabricant: brands[0].slug } : {}),
  })}`
  const image = asMedia(event.image)

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'ExhibitionEvent',
          name: event.name,
          startDate: event.startDate,
          endDate: event.endDate ?? undefined,
          eventStatus: 'https://schema.org/EventScheduled',
          eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
          location: place
            ? {
                '@type': 'Place',
                name: event.venue || event.city,
                address: event.address || event.city || undefined,
              }
            : undefined,
          description: event.summary || undefined,
          image: image?.url
            ? /^https?:/.test(image.url)
              ? image.url
              : `${SITE_URL}${image.url}`
            : undefined,
          url: `${SITE_URL}${docHref(locale, 'events', event)}`,
          organizer: { '@type': 'Organization', name: 'Agence PISE', url: SITE_URL },
        }}
      />

      <section className="container page-intro">
        <div className="page-intro__title">
          <nav aria-label={dict.breadcrumb} className="crumb">
            <Link href={localizedPath(locale)}>{dict.home}</Link> / {dict.events.eyebrow}
          </nav>
          <span className="pise-eyebrow eyebrow-mute">
            {[dates, event.city].filter(Boolean).join(' · ')}
          </span>
          <h1 className="page-title page-title--md">{event.name}</h1>
        </div>
        <div className="page-intro__lead">
          {event.summary ? <p className="lead">{event.summary}</p> : null}
        </div>
      </section>

      {image ? (
        <div className="project-cover">
          <div className="project-cover__img">
            <Img media={image} sizes="100vw" priority />
          </div>
        </div>
      ) : null}

      <section className="container brand-story project-story">
        <div className="brand-story__text">
          {ended ? <p className="body mute">{t.past}</p> : null}
          <div className="actions">
            {!ended ? (
              <Link className="pise-btn" href={book}>
                {t.book}
              </Link>
            ) : null}
            {event.registrationUrl && !ended ? (
              <a
                className="pise-btn pise-btn--outline"
                href={event.registrationUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t.register} ↗
              </a>
            ) : null}
            {event.website ? (
              <a
                className="pise-link"
                href={event.website}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t.website}
              </a>
            ) : null}
          </div>
        </div>
        <dl className="facts facts--list">
          <div className="facts__item">
            <dt className="pise-eyebrow eyebrow-mute">{t.dates}</dt>
            <dd className="h3">{dates}</dd>
          </div>
          {place ? (
            <div className="facts__item">
              <dt className="pise-eyebrow eyebrow-mute">{t.place}</dt>
              <dd className="h3">{place}</dd>
            </div>
          ) : null}
          {event.booth ? (
            <div className="facts__item">
              <dt className="pise-eyebrow eyebrow-mute">{t.booth}</dt>
              <dd className="h3">{event.booth}</dd>
            </div>
          ) : null}
        </dl>
      </section>

      {brands.length ? (
        <section className="container section section--flush">
          <div className="section-head">
            <h2 className="sec-title">{t.brands}</h2>
          </div>
          <div className="brand-grid">
            {brands.map((b) => (
              <BrandCard key={b.id} brand={toBrandSummary(b, locale, dict)} />
            ))}
          </div>
        </section>
      ) : null}
    </>
  )
}
