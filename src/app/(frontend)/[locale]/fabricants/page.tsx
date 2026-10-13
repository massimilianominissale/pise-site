import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { BrandsDirectory } from '@/components/brands/BrandsDirectory'
import { Img, asMedia } from '@/components/ui/Img'
import { JsonLd } from '@/components/ui/JsonLd'
import { isLocale, type Locale, localizedPath } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionary'
import { toBrandSummary } from '@/lib/brands'
import { getBrands, getGlobal } from '@/lib/payload'
import { alternates, ogImages, SITE_URL } from '@/lib/seo'

type Props = { params: Promise<{ locale: string }> }

const UNIVERSE_ORDER = ['furniture', 'lighting', 'outdoor', 'acoustics'] as const

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const dict = getDictionary(locale)
  const listings = await getGlobal('listings', locale)
  return {
    title: listings.brands?.title || dict.brands.listTitle,
    description: listings.brands?.lead || dict.brands.listLead,
    alternates: alternates(locale, '/fabricants'),
    openGraph: { images: ogImages(listings.brands?.image) },
  }
}

export default async function BrandsPage({ params }: Props) {
  const { locale: param } = await params
  if (!isLocale(param)) notFound()
  const locale: Locale = param
  const dict = getDictionary(locale)

  const [listings, brandDocs] = await Promise.all([getGlobal('listings', locale), getBrands(locale)])
  const brands = brandDocs.map((b) => toBrandSummary(b, locale, dict))
  const universes = UNIVERSE_ORDER.filter((u) => brands.some((b) => b.universes.includes(u))).map((u) => ({
    value: u,
    label: dict.universes[u],
  }))
  const intro = listings.brands
  const sourcing = intro?.sourcing

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: intro?.title || dict.brands.listTitle,
          itemListElement: brands.map((b, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: b.name,
            url: `${SITE_URL}${b.href}`,
          })),
        }}
      />

      <section className="container page-intro">
        <div className="page-intro__title">
          <nav aria-label={dict.breadcrumb} className="crumb">
            <Link href={localizedPath(locale)}>{dict.home}</Link> / {intro?.title || dict.brands.listTitle}
          </nav>
          <h1 className="page-title">{intro?.title || dict.brands.listTitle}</h1>
        </div>
        <p className="lead page-intro__lead">{intro?.lead || dict.brands.listLead}</p>
      </section>

      <BrandsDirectory
        brands={brands}
        universes={universes}
        labels={{
          all: dict.all,
          universes: dict.filterBy,
          sector: dict.brands.sector,
          sectorAll: dict.brands.sector,
          country: dict.brands.country,
          countryAll: dict.brands.country,
          countOne: dict.brands.countOne,
          countOther: dict.brands.countOther,
          see: dict.brands.see,
        }}
      />

      <section className="band band--stone">
        <div className={`container split split--sourcing${asMedia(sourcing?.image) ? '' : ' split--solo'}`}>
          <div className="split__text">
            <span className="pise-eyebrow eyebrow-mute">{dict.brands.sourcingEyebrow}</span>
            <h2 className="sec-title">{sourcing?.title || dict.brands.sourcingTitle}</h2>
            <p className="lead">{sourcing?.text || dict.brands.sourcingText}</p>
            <div className="actions">
              <Link className="pise-btn" href={`${localizedPath(locale, 'contact')}?demande=sourcing`}>
                {dict.brands.sourcingCta}
              </Link>
              <Link className="pise-btn pise-btn--outline" href={localizedPath(locale, 'appointment')}>
                {dict.takeAppointment}
              </Link>
            </div>
          </div>
          {asMedia(sourcing?.image) ? (
            <div className="sourcing__img">
              <Img media={sourcing?.image} sizes="(min-width: 1100px) 40vw, 100vw" />
            </div>
          ) : null}
        </div>
      </section>
    </>
  )
}
