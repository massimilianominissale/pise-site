import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'

import { BrandCard } from '@/components/brands/BrandCard'
import { PlayIcon, TourAnchor } from '@/components/cards'
import { ProductCard } from '@/components/products/ProductCard'
import { ProjectTile } from '@/components/projects/ProjectTile'
import { asMedia, Img } from '@/components/ui/Img'
import { JsonLd } from '@/components/ui/JsonLd'
import { RichText } from '@/components/ui/RichText'
import { isLocale, type Locale, localizedPath } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionary'
import { toBrandSummary } from '@/lib/brands'
import { namesOf } from '@/lib/format'
import { docHref } from '@/lib/links'
import { tourLink } from '@/lib/tours'
import { localizedDocPaths } from '@/lib/localized'
import { getProjectBySlug, getProjectsList } from '@/lib/payload'
import { localizedAlternates, ogImages, SITE_URL } from '@/lib/seo'
import type { Brand, Media, Product, VirtualTour } from '@/payload-types'

type Props = { params: Promise<{ locale: string; slug: string }> }

const hasText = (rich: unknown) => !!rich && JSON.stringify(rich).includes('"text":"')

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  if (!isLocale(locale)) return {}
  const project = await getProjectBySlug(slug, locale)
  if (!project) return {}
  return {
    title: project.meta?.title || project.title,
    description:
      project.meta?.description ||
      project.summary ||
      [namesOf(project.sectors)[0], project.city, namesOf(project.brands).join(', ')]
        .filter(Boolean)
        .join(' · '),
    alternates: localizedAlternates(
      locale,
      await localizedDocPaths('projects', 'projects', project.id),
    ),
    openGraph: { images: ogImages(project.meta?.image, project.cover) },
  }
}

export default async function ProjectPage({ params }: Props) {
  const { locale: param, slug } = await params
  if (!isLocale(param)) notFound()
  const locale: Locale = param
  const dict = getDictionary(locale)
  const t = dict.projectsPage

  const project = await getProjectBySlug(slug, locale)
  if (!project) notFound()
  // Lien venu d'une autre langue : adresse traduite.
  if (project.slug && project.slug !== decodeURIComponent(slug)) {
    redirect(docHref(locale, 'projects', project) ?? localizedPath(locale, 'projects'))
  }

  const { docs: recent } = await getProjectsList(locale, { page: 1 })
  const others = recent.filter((p) => p.id !== project.id).slice(0, 3)

  const brands = (project.brands ?? []).filter(
    (b): b is Brand => typeof b === 'object' && b !== null,
  )
  const products = (project.products ?? []).filter(
    (p): p is Product => typeof p === 'object' && p !== null && p._status === 'published',
  )
  const tour =
    project.virtualTour && typeof project.virtualTour === 'object'
      ? (project.virtualTour as VirtualTour)
      : null
  const gallery = (project.gallery ?? []).map(asMedia).filter((m): m is Media => Boolean(m))
  const sector = namesOf(project.sectors)[0]
  const eyebrow = [sector, project.city, project.year].filter(Boolean).join(' · ')
  const facts = [
    project.client ? { label: t.client, value: project.client } : null,
    project.city || project.region
      ? { label: t.place, value: [project.city, project.region].filter(Boolean).join(', ') }
      : null,
    project.year ? { label: t.year, value: String(project.year) } : null,
    sector ? { label: t.sectorLabel, value: namesOf(project.sectors).join(', ') } : null,
  ].filter((f): f is { label: string; value: string } => Boolean(f))
  const appointment = `${localizedPath(locale, 'appointment')}?${new URLSearchParams(
    brands[0]?.slug ? { fabricant: brands[0].slug } : {},
  )}`
  const projectsHref = localizedPath(locale, 'projects')
  const url = `${SITE_URL}${docHref(locale, 'projects', project)}`
  const cover = asMedia(project.cover)

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
                  name: dict.projects.eyebrow,
                  item: `${SITE_URL}${projectsHref}`,
                },
                { '@type': 'ListItem', position: 2, name: project.title },
              ],
            },
            {
              '@type': 'CreativeWork',
              '@id': `${url}#project`,
              name: project.title,
              url,
              abstract: project.summary || undefined,
              dateCreated: project.year ? String(project.year) : undefined,
              locationCreated: project.city ? { '@type': 'Place', name: project.city } : undefined,
              image: cover?.url
                ? /^https?:/.test(cover.url)
                  ? cover.url
                  : `${SITE_URL}${cover.url}`
                : undefined,
              creator: { '@type': 'Organization', name: 'Agence PISE' },
              mentions: [
                ...brands.map((b) => ({ '@type': 'Brand', name: b.name })),
                ...products.map((p) => ({
                  '@type': 'Product',
                  name: p.name,
                  url: `${SITE_URL}${docHref(locale, 'products', p)}`,
                })),
              ],
            },
          ],
        }}
      />

      <section className="container page-intro page-intro--project">
        <div className="page-intro__title">
          <nav aria-label={dict.breadcrumb} className="crumb">
            <Link href={projectsHref}>{dict.projects.eyebrow}</Link> / {project.title}
          </nav>
          {eyebrow ? <span className="pise-eyebrow eyebrow-mute">{eyebrow}</span> : null}
          <h1 className="page-title page-title--md">{project.title}</h1>
        </div>
        {project.summary ? <p className="lead page-intro__lead">{project.summary}</p> : null}
      </section>

      <section className="project-cover">
        <div className="project-cover__img">
          <Img media={project.cover} sizes="100vw" priority />
        </div>
      </section>

      {hasText(project.body) || facts.length || brands.length ? (
        <section
          className={`container brand-story project-story${hasText(project.body) ? '' : ' project-story--facts-only'}`}
        >
          {hasText(project.body) ? (
            <div className="brand-story__text">
              <RichText data={project.body} locale={locale} className="lead" />
            </div>
          ) : null}
          {facts.length || brands.length ? (
            <dl className="facts facts--list">
              {facts.map((fact) => (
                <div key={fact.label} className="facts__item">
                  <dt className="pise-eyebrow eyebrow-mute">{fact.label}</dt>
                  <dd className="h3">{fact.value}</dd>
                </div>
              ))}
              {brands.length ? (
                <div className="facts__item">
                  <dt className="pise-eyebrow eyebrow-mute">{t.brands}</dt>
                  <dd className="h3">
                    {brands.map((b, i) => (
                      <span key={b.id}>
                        {i ? ', ' : ''}
                        <Link className="facts__link" href={docHref(locale, 'brands', b) ?? '#'}>
                          {b.name}
                        </Link>
                      </span>
                    ))}
                  </dd>
                </div>
              ) : null}
            </dl>
          ) : null}
        </section>
      ) : null}

      {gallery.length ? (
        <section className="project-gallery" aria-label={t.gallery}>
          {gallery.map((image, i) => (
            <div
              key={image.id}
              className={`project-gallery__img project-gallery__img--${i % 3 === 0 ? 'wide' : 'half'}`}
            >
              <Img media={image} sizes={i % 3 === 0 ? '100vw' : '(min-width: 768px) 50vw, 100vw'} />
            </div>
          ))}
        </section>
      ) : null}

      {products.length ? (
        <section className="container section section--loose">
          <div className="section-head">
            <h2 className="sec-title">{t.productsUsed}</h2>
          </div>
          <div className="product-grid">
            {products.slice(0, 8).map((p) => (
              <ProductCard key={p.id} product={p} locale={locale} />
            ))}
          </div>
        </section>
      ) : brands.length ? (
        <section className="container section section--loose">
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

      {tour ? (
        <section className="band band--ink">
          <div className="container split split--tour">
            <TourAnchor
              className="tour-visual"
              link={tourLink(locale, tour)}
              label={tour.title}
              newTabLabel={dict.tours.newTab}
            >
              <Img
                media={tour.thumbnail ?? project.cover}
                sizes="(min-width: 1100px) 55vw, 100vw"
                alt=""
              />
              <span className="tour-card__scrim" />
              <span className="tour-card__play">
                <PlayIcon />
              </span>
            </TourAnchor>
            <div className="split__text">
              <span className="pise-eyebrow eyebrow-sky">{dict.tours.kinds[tour.kind]}</span>
              <h2 className="sec-title">{t.tourTitle}</h2>
              {tour.summary ? <p className="body on-ink-mute">{tour.summary}</p> : null}
              <div className="actions actions--center">
                <TourAnchor
                  className="pise-btn pise-btn--light"
                  link={tourLink(locale, tour)}
                  newTabLabel={dict.tours.newTab}
                >
                  {dict.brand.enter}
                </TourAnchor>
              </div>
              {tour.credit ? (
                <span className="cap on-ink-mute">{dict.brand.producedBy(tour.credit)}</span>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}

      <section className="container cta-band">
        <h2 className="sec-title cta-band__title">{t.ctaTitle}</h2>
        <p className="body mute cta-band__text">{t.ctaText}</p>
        <div className="cta-band__action">
          <Link className="pise-btn" href={appointment}>
            {dict.takeAppointment}
          </Link>
        </div>
      </section>

      {others.length ? (
        <section className="others">
          <div className="container section section--flush">
            <div className="section-head">
              <h2 className="h2">{t.others}</h2>
              <Link className="pise-link" href={projectsHref}>
                {dict.projects.all}
              </Link>
            </div>
            <div className="masonry masonry--row">
              {others.map((p) => (
                <ProjectTile
                  key={p.id}
                  project={p}
                  locale={locale}
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
