import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'

import { BrandCard } from '@/components/brands/BrandCard'
import { TourCard } from '@/components/cards'
import { ProductCard } from '@/components/products/ProductCard'
import { ProjectTile } from '@/components/projects/ProjectTile'
import { EmbedViewer } from '@/components/ui/EmbedViewer'
import { Img } from '@/components/ui/Img'
import { JsonLd } from '@/components/ui/JsonLd'
import { isLocale, type Locale, localizedPath } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionary'
import { toBrandSummary } from '@/lib/brands'
import { safeEmbedUrl } from '@/lib/embed'
import { docHref } from '@/lib/links'
import { tourViewer } from '@/lib/tours'
import { localizedDocPaths } from '@/lib/localized'
import {
  getAllVirtualTours,
  getIntegrations,
  getProjectsOfTour,
  getTourBySlug,
} from '@/lib/payload'
import { localizedAlternates, ogImages, SITE_URL } from '@/lib/seo'
import type { Brand, Product } from '@/payload-types'

type Props = { params: Promise<{ locale: string; slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  if (!isLocale(locale)) return {}
  const tour = await getTourBySlug(slug, locale)
  if (!tour) return {}
  const dict = getDictionary(locale)
  return {
    title: tour.meta?.title || tour.title,
    description:
      tour.meta?.description ||
      tour.summary ||
      [dict.tours.kinds[tour.kind], tour.location].filter(Boolean).join(' · '),
    alternates: localizedAlternates(
      locale,
      await localizedDocPaths('virtual-tours', 'tours', tour.id),
    ),
    openGraph: { images: ogImages(tour.meta?.image, tour.thumbnail) },
  }
}

export default async function TourPage({ params }: Props) {
  const { locale: param, slug } = await params
  if (!isLocale(param)) notFound()
  const locale: Locale = param
  const dict = getDictionary(locale)
  const t = dict.toursPage

  const tour = await getTourBySlug(slug, locale)
  if (!tour) notFound()
  if (tour.slug && tour.slug !== decodeURIComponent(slug)) {
    redirect(docHref(locale, 'tours', tour) ?? localizedPath(locale, 'tours'))
  }

  const [integrations, projects, allTours] = await Promise.all([
    getIntegrations(),
    getProjectsOfTour(tour.id, locale),
    getAllVirtualTours(locale),
  ])

  const viewer = tourViewer(tour, integrations.frameOrigins)
  const brands = (tour.brands ?? []).filter((b): b is Brand => typeof b === 'object' && b !== null)
  const products = (tour.products ?? []).filter(
    (p): p is Product => typeof p === 'object' && p !== null && p._status === 'published',
  )
  const others = allTours.filter((x) => x.id !== tour.id).slice(0, 3)
  const appointment = `${localizedPath(locale, 'appointment')}?${new URLSearchParams({
    format: 'virtual-tour',
    ...(tour.slug ? { visite: tour.slug } : {}),
    ...(brands[0]?.slug ? { fabricant: brands[0].slug } : {}),
  })}`
  const toursHref = localizedPath(locale, 'tours')
  const eyebrow = [dict.tours.kinds[tour.kind], tour.location].filter(Boolean).join(' · ')

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'BreadcrumbList',
              itemListElement: [
                {
                  '@type': 'ListItem',
                  position: 1,
                  name: dict.tours.eyebrow,
                  item: `${SITE_URL}${toursHref}`,
                },
                { '@type': 'ListItem', position: 2, name: tour.title },
              ],
            },
            {
              '@type': 'VirtualLocation',
              name: tour.title,
              url: `${SITE_URL}${docHref(locale, 'tours', tour)}`,
              description: tour.summary || undefined,
            },
          ],
        }}
      />

      <section className="band band--ink tours-hero">
        <div className="container tours-hero__inner">
          <div className="page-intro page-intro--flush">
            <div className="page-intro__title">
              <nav aria-label={dict.breadcrumb} className="crumb crumb--on-ink">
                <Link href={toursHref}>{dict.tours.eyebrow}</Link> / {tour.title}
              </nav>
              {eyebrow ? <span className="pise-eyebrow eyebrow-sky">{eyebrow}</span> : null}
              <h1 className="page-title page-title--md">{tour.title}</h1>
            </div>
            <div className="page-intro__lead tours-hero__lead">
              {tour.summary ? <p className="lead on-ink-mute">{tour.summary}</p> : null}
              {tour.credit ? (
                <span className="cap on-ink-mute">{dict.brand.producedBy(tour.credit)}</span>
              ) : null}
            </div>
          </div>

          {viewer ? (
            <EmbedViewer
              src={viewer.src}
              mode={viewer.mode}
              title={tour.title}
              caption={[tour.title, tour.location].filter(Boolean).join(' · ')}
              provider={viewer.mode === 'iframe' ? t.embedded : t.external}
              poster={tour.thumbnail}
              rooms={(tour.rooms ?? []).map((r) => ({
                label: r.label,
                url: safeEmbedUrl(r.sceneId, integrations.frameOrigins),
              }))}
              labels={{
                enter: t.enter,
                fullscreen: t.fullscreen,
                exitFullscreen: t.exitFullscreen,
                open: t.open,
                newTab: dict.tours.newTab,
              }}
              action={
                <Link className="pise-btn pise-btn--small pise-btn--light" href={appointment}>
                  {t.guided}
                </Link>
              }
            />
          ) : (
            <div className="viewer viewer--soon">
              <div className="viewer__stage">
                <Img media={tour.thumbnail} sizes="100vw" />
                <span className="tour-card__scrim" />
                <div className="viewer__soon">
                  <span className="pise-eyebrow">{dict.tours.soon}</span>
                  <p className="body">{t.soonText}</p>
                  <Link className="pise-btn pise-btn--light" href={appointment}>
                    {t.guided}
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {brands.length || products.length ? (
        <section className="container section section--loose">
          <div className="section-head">
            <h2 className="sec-title">{t.shown}</h2>
          </div>
          {products.length ? (
            <div className="product-grid">
              {products.slice(0, 8).map((p) => (
                <ProductCard key={p.id} product={p} locale={locale} />
              ))}
            </div>
          ) : (
            <div className="brand-grid">
              {brands.map((b) => (
                <BrandCard key={b.id} brand={toBrandSummary(b, locale, dict)} />
              ))}
            </div>
          )}
        </section>
      ) : null}

      {projects.length ? (
        <section className="container section section--flush">
          <div className="section-head">
            <h2 className="h2">{t.projects}</h2>
          </div>
          <div className="masonry masonry--row">
            {projects.map((p) => (
              <ProjectTile
                key={p.id}
                project={p}
                locale={locale}
                sizes="(min-width: 1100px) 33vw, 100vw"
              />
            ))}
          </div>
        </section>
      ) : null}

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

      {others.length ? (
        <section className="band band--ink">
          <div className="container section">
            <div className="section-head">
              <h2 className="sec-title">{t.others}</h2>
              <Link className="pise-link pise-link--light" href={toursHref}>
                {dict.tours.all}
              </Link>
            </div>
            <div className="tour-others">
              {others.map((x) => (
                <TourCard
                  key={x.id}
                  tour={x}
                  locale={locale}
                  dict={dict}
                  sizes="(min-width: 1100px) 33vw, 100vw"
                />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  )
}
