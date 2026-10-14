import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { ContactForm } from '@/components/forms/ContactForm'
import { JsonLd } from '@/components/ui/JsonLd'
import { isLocale, type Locale, localizedPath } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionary'
import { REGIONS } from '@/lib/forms'
import { getPrivacyHref } from '@/lib/legal'
import { getBrands, getGlobal, getProductByReference, getShowrooms } from '@/lib/payload'
import { alternates, ogImages, SITE_URL } from '@/lib/seo'
import type { Showroom } from '@/payload-types'

type Search = { demande?: string; produit?: string; fabricant?: string }
type Props = { params: Promise<{ locale: string }>; searchParams: Promise<Search> }

const REQUESTS = ['devis', 'sourcing', 'plans', 'imrsivo'] as const
const one = (v: unknown) => (typeof v === 'string' && v ? v.slice(0, 120) : undefined)

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const dict = getDictionary(locale)
  const listings = await getGlobal('listings', locale)
  const search = await searchParams
  return {
    title: listings.contact?.title || dict.contactPage.title,
    description: listings.contact?.lead || dict.contactPage.lead,
    alternates: alternates(locale, '/contact'),
    openGraph: { images: ogImages(listings.contact?.image) },
    ...(Object.values(search).some(Boolean) ? { robots: { index: false, follow: true } } : {}),
  }
}

/** Itinéraire vers un showroom (coordonnées si elles existent, sinon adresse). */
const directionsHref = (s: Showroom) => {
  const lat = s.address?.latitude
  const lon = s.address?.longitude
  const destination =
    lat != null && lon != null
      ? `${lat},${lon}`
      : [s.name, s.address?.street, s.address?.postalCode, s.address?.city]
          .filter(Boolean)
          .join(', ')
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`
}

/** Carte OpenStreetMap centrée sur un showroom (sans clé ni cookie publicitaire). */
const mapSrc = (lat: number, lon: number) => {
  const d = 0.012
  const bbox = [lon - d * 1.6, lat - d, lon + d * 1.6, lat + d].join(',')
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lon}`
}

export default async function ContactPage({ params, searchParams }: Props) {
  const { locale: param } = await params
  if (!isLocale(param)) notFound()
  const locale: Locale = param
  const dict = getDictionary(locale)
  const t = dict.contactPage
  const search = await searchParams
  const request = REQUESTS.find((r) => r === search.demande) ?? null
  const reference = one(search.produit)
  const brandSlug = one(search.fabricant)

  const [listings, settings, brands, showrooms, product, privacy] = await Promise.all([
    getGlobal('listings', locale),
    getGlobal('settings', locale),
    getBrands(locale),
    getShowrooms(locale),
    reference ? getProductByReference(reference) : null,
    getPrivacyHref(locale),
  ])

  const contact = settings.contact
  const context = [
    request ? t.context[request] : null,
    product ? `${product.name} (${product.reference})` : null,
  ]
    .filter(Boolean)
    .join(' · ')
  // Devis d'un produit : sa marque est cochée d'office.
  const productBrand = product ? brands.find((b) => b.id === product.brand)?.slug : null
  const mapped = showrooms.find((s) => s.address?.latitude != null && s.address?.longitude != null)
  const lead = listings.contact?.lead || t.lead
  const response = contact?.responseTime ? ` ${t.responseTime(contact.responseTime)}` : ''

  return (
    <>
      <section className="container page-intro">
        <div className="page-intro__title">
          <nav aria-label={dict.breadcrumb} className="crumb">
            <Link href={localizedPath(locale)}>{dict.home}</Link> / {dict.contact}
          </nav>
          <h1 className="page-title page-title--md">{listings.contact?.title || t.title}</h1>
        </div>
        <p className="lead page-intro__lead">
          {lead}
          {response}
        </p>
      </section>

      <section className="container contact">
        <div className="contact__form">
          <ContactForm
            locale={locale}
            labels={{
              form: dict.form,
              page: {
                ...t,
                takeAppointment: dict.takeAppointment,
                responseTime: undefined,
                context: undefined,
              } as never,
            }}
            brands={brands.map((b) => ({ slug: b.slug ?? String(b.id), name: b.name }))}
            regions={REGIONS}
            request={request}
            context={context || null}
            products={product ? [product.reference] : []}
            preselectedBrands={[brandSlug, productBrand].filter((b): b is string => Boolean(b))}
            privacyHref={privacy}
            appointmentHref={localizedPath(locale, 'appointment')}
          />
        </div>

        <aside className="contact__aside">
          <div className="panel">
            <span className="h3">{t.voiceTitle}</span>
            <p className="body mute">{t.voiceText}</p>
            <Link className="pise-btn" href={localizedPath(locale, 'appointment')}>
              {dict.takeAppointment}
            </Link>
          </div>

          {contact?.street || contact?.phone || contact?.email ? (
            <address className="contact__agency">
              <span className="pise-eyebrow eyebrow-mute">{settings.siteName || t.agency}</span>
              {contact.street ? <span className="body">{contact.street}</span> : null}
              {contact.postalCode || contact.city ? (
                <span className="body">
                  {[contact.postalCode, contact.city].filter(Boolean).join(' ')}
                </span>
              ) : null}
              {contact.phone ? (
                <a className="pise-textlink" href={`tel:${contact.phone.replace(/[^\d+]/g, '')}`}>
                  {contact.phone}
                </a>
              ) : null}
              {contact.email ? (
                <a className="pise-textlink" href={`mailto:${contact.email}`}>
                  {contact.email}
                </a>
              ) : null}
            </address>
          ) : null}

          {showrooms.length ? (
            <div className="contact__showrooms">
              <span className="pise-eyebrow eyebrow-mute">{t.showrooms}</span>
              <ul className="rows">
                {showrooms.map((s) => (
                  <li key={s.id} className="rdv-row">
                    <span className="body">
                      {[s.name, s.address?.city].filter(Boolean).join(' · ')}
                    </span>
                    <a
                      className="cap"
                      href={directionsHref(s)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {t.directions}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </aside>
      </section>

      {mapped?.address?.latitude != null && mapped.address.longitude != null ? (
        <section className="contact-map">
          <iframe
            title={`${t.map} · ${mapped.name}`}
            src={mapSrc(mapped.address.latitude, mapped.address.longitude)}
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </section>
      ) : null}

      {contact?.street ? (
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: settings.siteName || 'Agence PISE',
            url: SITE_URL,
            email: contact.email || undefined,
            telephone: contact.phone || undefined,
            address: {
              '@type': 'PostalAddress',
              streetAddress: contact.street,
              postalCode: contact.postalCode || undefined,
              addressLocality: contact.city || undefined,
              addressCountry: 'FR',
            },
          }}
        />
      ) : null}
    </>
  )
}
