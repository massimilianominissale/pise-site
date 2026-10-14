import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { NewsletterForm } from '@/components/home/NewsletterForm'
import { type TourItem, ToursGrid } from '@/components/tours/ToursGrid'
import { EmbedViewer } from '@/components/ui/EmbedViewer'
import { asMedia, Img } from '@/components/ui/Img'
import { JsonLd } from '@/components/ui/JsonLd'
import { isLocale, type Locale, localizedPath } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionary'
import { safeEmbedUrl } from '@/lib/embed'
import { namesOf } from '@/lib/format'
import { docHref } from '@/lib/links'
import { getAllVirtualTours, getGlobal, getIntegrations } from '@/lib/payload'
import { alternates, ogImages, SITE_URL } from '@/lib/seo'
import type { Media, VirtualTour } from '@/payload-types'

type Props = { params: Promise<{ locale: string }> }

const KIND_ORDER = ['brand-showroom', 'pise-showroom', 'venue', 'trade-fair'] as const

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const dict = getDictionary(locale)
  const listings = await getGlobal('listings', locale)
  return {
    title: listings.tours?.title || dict.tours.eyebrow,
    description: listings.tours?.lead || dict.toursPage.lead,
    alternates: alternates(locale, '/espaces-virtuels'),
    openGraph: { images: ogImages(listings.tours?.image) },
  }
}

export default async function ToursPage({ params }: Props) {
  const { locale: param } = await params
  if (!isLocale(param)) notFound()
  const locale: Locale = param
  const dict = getDictionary(locale)
  const t = dict.toursPage

  const [listings, home, tours, integrations] = await Promise.all([
    getGlobal('listings', locale),
    getGlobal('home', locale),
    getAllVirtualTours(locale),
    getIntegrations(),
  ])

  // Visite affichée en grand : la première visite en ligne mise en avant, sinon la première en ligne.
  const playable = (tour: VirtualTour) =>
    tour.availability !== 'soon' ? safeEmbedUrl(tour.embedUrl, integrations.frameOrigins) : null
  const live = tours.filter((tour) => playable(tour))
  const hero = live.find((tour) => tour.featured) ?? live[0] ?? null
  const heroSrc = hero ? playable(hero) : null

  // Visites en ligne d'abord, puis celles qui ouvrent bientôt.
  const items: TourItem[] = [...tours]
    .sort((a, b) => Number(Boolean(playable(b))) - Number(Boolean(playable(a))))
    .map((tour) => ({
      id: tour.id,
      href: docHref(locale, 'tours', tour),
      title: tour.title,
      kind: tour.kind,
      kindLabel: dict.tours.kinds[tour.kind],
      location: tour.location ?? null,
      brands: namesOf(tour.brands),
      live: Boolean(playable(tour)),
      image: tour.thumbnail,
    }))
  const kinds = KIND_ORDER.filter((k) => tours.some((tour) => tour.kind === k)).map((k) => ({
    value: k,
    label: dict.tours.kinds[k],
  }))

  const appointment = (tour?: VirtualTour | null) =>
    `${localizedPath(locale, 'appointment')}?${new URLSearchParams({
      format: 'virtual-tour',
      ...(tour?.slug ? { visite: tour.slug } : {}),
    })}`
  const imrsivoImages = (home.imrsivo?.images ?? [])
    .map(asMedia)
    .filter((m): m is Media => Boolean(m))
  const title = listings.tours?.title || t.title

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: title,
          itemListElement: tours.map((tour, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: tour.title,
            url: `${SITE_URL}${docHref(locale, 'tours', tour)}`,
          })),
        }}
      />

      <section className="band band--ink tours-hero">
        <div className="container tours-hero__inner">
          <div className="page-intro page-intro--flush">
            <div className="page-intro__title">
              <nav aria-label={dict.breadcrumb} className="crumb crumb--on-ink">
                <Link href={localizedPath(locale)}>{dict.home}</Link> / {dict.tours.eyebrow}
              </nav>
              <h1 className="page-title">{title}</h1>
            </div>
            <div className="page-intro__lead tours-hero__lead">
              <p className="lead on-ink-mute">{listings.tours?.lead || t.lead}</p>
              <span className="cap on-ink-mute">{dict.tours.producedBy}</span>
            </div>
          </div>

          {hero && heroSrc ? (
            <EmbedViewer
              src={heroSrc}
              title={hero.title}
              caption={[hero.title, hero.location].filter(Boolean).join(' · ')}
              provider={t.embedded}
              poster={hero.thumbnail}
              rooms={(hero.rooms ?? []).map((r) => ({
                label: r.label,
                url: safeEmbedUrl(r.sceneId, integrations.frameOrigins),
              }))}
              labels={{
                enter: t.enter,
                fullscreen: t.fullscreen,
                exitFullscreen: t.exitFullscreen,
              }}
              action={
                <Link className="pise-btn pise-btn--small pise-btn--light" href={appointment(hero)}>
                  {dict.takeAppointment}
                </Link>
              }
            />
          ) : null}
        </div>
      </section>

      <section className="container section section--loose">
        <div className="section-head">
          <h2 className="sec-title">{t.all}</h2>
        </div>
        {tours.length ? (
          <ToursGrid
            tours={items}
            kinds={kinds}
            labels={{ all: dict.all, filter: t.kindsFilter, soon: dict.tours.soon }}
            extra={
              <div className="tour-list__signup">
                <span className="h3">{t.newsletterTitle}</span>
                <p className="body mute">{t.newsletterText}</p>
                <NewsletterForm locale={locale} labels={dict.newsletter} />
              </div>
            }
          />
        ) : (
          <div className="empty">
            <p className="body">{t.empty}</p>
            <Link className="pise-btn" href={appointment()}>
              {dict.brand.guidedTour}
            </Link>
          </div>
        )}
      </section>

      <section className="container how">
        <div className="how__intro">
          <span className="pise-eyebrow eyebrow-mute">{t.howEyebrow}</span>
          <h2 className="sec-title">{t.howTitle}</h2>
        </div>
        <ol className="how__steps">
          {t.steps.map((step, i) => (
            <li key={step.title} className="how__step">
              <span className="step__n">{String(i + 1).padStart(2, '0')}</span>
              <span className="h3">{step.title}</span>
              <p className="body mute">{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {home.imrsivo?.title ? (
        <section className="band band--stone">
          <div
            className={`container split split--imrsivo${imrsivoImages.length ? '' : ' split--solo'}`}
          >
            <div className="split__text">
              <span className="pise-eyebrow eyebrow-mute">{dict.imrsivo.eyebrow}</span>
              <h2 className="sec-title">{home.imrsivo.title}</h2>
              {home.imrsivo.text ? <p className="lead lead--sm">{home.imrsivo.text}</p> : null}
              <div className="partner-cta">
                <span className="body">{t.partnerCta}</span>
                <Link
                  className="pise-btn pise-btn--outline pise-btn--small"
                  href={`${localizedPath(locale, 'contact')}?demande=imrsivo`}
                >
                  {t.contactUs}
                </Link>
              </div>
            </div>
            {imrsivoImages.length ? (
              <div className="imrsivo__media">
                {imrsivoImages.slice(0, 3).map((image, i) => (
                  <div
                    key={image.id}
                    className={`imrsivo__img${i === 0 ? ' imrsivo__img--wide' : ''}`}
                  >
                    <Img
                      media={image}
                      sizes={i === 0 ? '(min-width: 1100px) 50vw, 100vw' : '25vw'}
                    />
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </section>
      ) : null}
    </>
  )
}
