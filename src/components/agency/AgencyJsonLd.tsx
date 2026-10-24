import { JsonLd } from '@/components/ui/JsonLd'
import { type Locale, localizedPath } from '@/i18n/config'
import { getGlobal, getPayloadClient, getShowrooms } from '@/lib/payload'
import { SITE_URL } from '@/lib/seo'

/** Fondateur de l'agence, cité dans la page « L'agence ». */
const FOUNDER = 'Pierre-Christophe Prot'

/**
 * Données structurées de la page « L'agence » : l'organisation (marques représentées, zone
 * desservie, fondateur), le siège et chaque showroom en LocalBusiness.
 */
export async function AgencyJsonLd({ locale }: { locale: Locale }) {
  const payload = await getPayloadClient()
  const [settings, showrooms, brands] = await Promise.all([
    getGlobal('settings', locale),
    getShowrooms(locale),
    payload.find({
      collection: 'brands',
      locale,
      depth: 0,
      limit: 100,
      sort: 'order',
      select: { name: true },
      where: { _status: { equals: 'published' } },
    }),
  ])
  const orgId = `${SITE_URL}/#organization`
  const name = settings.siteName || 'Agence PISE'
  const contact = settings.contact
  const agencyUrl = `${SITE_URL}${localizedPath(locale, 'agency')}`
  const address = (street?: string | null, postalCode?: string | null, city?: string | null) =>
    street
      ? {
          '@type': 'PostalAddress',
          streetAddress: street,
          postalCode: postalCode || undefined,
          addressLocality: city || undefined,
          addressCountry: 'FR',
        }
      : undefined

  const headOffice = contact?.street
    ? {
        '@type': 'LocalBusiness',
        '@id': `${SITE_URL}/#siege`,
        name: `${name} · ${contact.city ?? 'Orléans'}`,
        address: address(contact.street, contact.postalCode, contact.city),
        telephone: contact.phone || undefined,
        email: contact.email || undefined,
        parentOrganization: { '@id': orgId },
      }
    : null

  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'Organization',
            '@id': orgId,
            name,
            legalName: settings.legalName || undefined,
            url: SITE_URL,
            logo: `${SITE_URL}/brand/pise-logo.png`,
            description: settings.description || undefined,
            foundingDate: settings.foundingYear ? String(settings.foundingYear) : undefined,
            founder: { '@type': 'Person', name: FOUNDER },
            email: contact?.email || undefined,
            telephone: contact?.phone || undefined,
            address: address(contact?.street, contact?.postalCode, contact?.city),
            areaServed: { '@type': 'Country', name: 'France' },
            brand: brands.docs.map((b) => ({ '@type': 'Brand', name: b.name })),
            sameAs: (settings.socials ?? []).map((s) => s.url),
          },
          ...(headOffice ? [headOffice] : []),
          ...showrooms.map((showroom) => ({
            '@type': 'LocalBusiness',
            '@id': `${SITE_URL}/#showroom-${showroom.id}`,
            name: `${name} · ${showroom.name}`,
            url: agencyUrl,
            description: showroom.description || undefined,
            address: address(
              showroom.address?.street,
              showroom.address?.postalCode,
              showroom.address?.city,
            ),
            telephone: showroom.phone || contact?.phone || undefined,
            parentOrganization: { '@id': orgId },
          })),
        ],
      }}
    />
  )
}
