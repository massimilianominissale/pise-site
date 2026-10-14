import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import {
  AppointmentForm,
  type AppointmentLabels,
  type Member,
} from '@/components/forms/AppointmentForm'
import { isLocale, type Locale, localizedPath } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionary'
import type { AppointmentFormat } from '@/lib/forms'
import { namesOf } from '@/lib/format'
import { getPrivacyHref } from '@/lib/legal'
import {
  getBookableMembers,
  getBrandBySlug,
  getGlobal,
  getProductByReference,
  getShowrooms,
  getTourBySlug,
} from '@/lib/payload'
import { alternates, ogImages } from '@/lib/seo'

type Search = {
  format?: string
  conseiller?: string
  fabricant?: string
  visite?: string
  produit?: string
}
type Props = { params: Promise<{ locale: string }>; searchParams: Promise<Search> }

const FORMATS: AppointmentFormat[] = ['video', 'showroom', 'virtual-tour', 'factory']
const one = (v: unknown) => (typeof v === 'string' && v ? v.slice(0, 120) : undefined)

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const dict = getDictionary(locale)
  const listings = await getGlobal('listings', locale)
  const search = await searchParams
  const withContext = Object.values(search).some(Boolean)
  return {
    title: listings.appointment?.title || dict.appointmentPage.title,
    description: listings.appointment?.lead || dict.appointmentPage.lead,
    alternates: alternates(locale, '/rendez-vous'),
    openGraph: { images: ogImages(listings.appointment?.image) },
    ...(withContext ? { robots: { index: false, follow: true } } : {}),
  }
}

export default async function AppointmentPage({ params, searchParams }: Props) {
  const { locale: param } = await params
  if (!isLocale(param)) notFound()
  const locale: Locale = param
  const dict = getDictionary(locale)
  const t = dict.appointmentPage
  const search = await searchParams
  const brandSlug = one(search.fabricant)
  const tourSlug = one(search.visite)
  const reference = one(search.produit)

  const [listings, members, showrooms, brand, tour, product, privacy] = await Promise.all([
    getGlobal('listings', locale),
    getBookableMembers(locale),
    getShowrooms(locale),
    brandSlug ? getBrandBySlug(brandSlug, locale) : null,
    tourSlug ? getTourBySlug(tourSlug, locale) : null,
    reference ? getProductByReference(reference) : null,
    getPrivacyHref(locale),
  ])

  // Les référents de la marque concernée d'abord.
  const sorted = brand
    ? [...members].sort(
        (a, b) =>
          Number(namesOf(b.brands).includes(brand.name)) -
          Number(namesOf(a.brands).includes(brand.name)),
      )
    : members
  const memberOptions: Member[] = sorted.map((m) => ({
    id: m.id,
    name: m.name,
    caption:
      [m.zone, namesOf(m.brands).join(', ')].filter(Boolean).join(' · ') || m.jobTitle || null,
    photo: m.photo,
  }))

  const format = FORMATS.find((f) => f === search.format) ?? (tour ? 'virtual-tour' : null)
  const conseiller = Number.parseInt(one(search.conseiller) ?? '', 10)
  const context = [
    tour ? t.contextTour(tour.title) : null,
    brand && !tour ? t.contextBrand(brand.name) : null,
    product ? t.contextProduct(product.name) : null,
  ]
    .filter(Boolean)
    .join(' · ')

  // Libellés passés au formulaire : chaînes seulement (les fonctions restent côté serveur).
  const labels: AppointmentLabels = {
    form: dict.form,
    page: {
      ...t,
      stepOf: t.stepOf(1001, 1002, '{label}').replace('1001', '{n}').replace('1002', '{total}'),
      timeAt: t.timeAt('{time}'),
      home: dict.notFound.back,
      referentFor: undefined,
      contextTour: undefined,
      contextBrand: undefined,
      contextProduct: undefined,
    } as unknown as AppointmentLabels['page'],
  }

  return (
    <>
      <section className="container page-intro">
        <div className="page-intro__title">
          <nav aria-label={dict.breadcrumb} className="crumb">
            <Link href={localizedPath(locale)}>{dict.home}</Link> / {dict.appointment}
          </nav>
          <h1 className="page-title page-title--md">{listings.appointment?.title || t.title}</h1>
        </div>
        <p className="lead page-intro__lead">{listings.appointment?.lead || t.lead}</p>
      </section>

      <section className="container rdv-wrap">
        <AppointmentForm
          locale={locale}
          labels={labels}
          members={memberOptions}
          showrooms={showrooms.map((s) => ({
            id: s.id,
            name: [s.name, s.address?.city].filter(Boolean).join(' · '),
          }))}
          initialFormat={format}
          initialMember={Number.isFinite(conseiller) ? conseiller : null}
          context={context || null}
          hidden={{
            fabricant: brand?.slug ?? undefined,
            visite: tour?.title ?? undefined,
            produit: product?.reference ?? undefined,
          }}
          privacyHref={privacy}
          homeHref={localizedPath(locale)}
        />
      </section>
    </>
  )
}
