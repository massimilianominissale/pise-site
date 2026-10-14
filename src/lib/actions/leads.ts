'use server'

import { headers } from 'next/headers'

import { isLocale, type Locale } from '@/i18n/config'
import { getPayloadClient } from '@/lib/payload'
import { MAX_ATTACHMENT_BYTES, parisDateTimeToUtc } from '@/lib/forms'

/**
 * Formulaires publics (contact, devis, rendez-vous) : chaque envoi devient une « Demande »
 * dans le back-office, synchronisée avec Zoho lorsque le connecteur sera branché.
 */

export type FormState = {
  status: 'idle' | 'success' | 'error'
  /** Champs en erreur (nom du champ → clé du message dans le dictionnaire). */
  errors?: Record<string, 'required' | 'email' | 'file' | 'fileSize' | 'slot'>
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

const text = (form: FormData, name: string, max = 300) =>
  String(form.get(name) ?? '')
    .trim()
    .slice(0, max)

const PROFILES = ['architect', 'hospitality', 'company', 'reseller', 'other'] as const
const FORMATS = ['video', 'showroom', 'virtual-tour', 'factory'] as const

const ATTACHMENT_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/zip',
  'application/x-zip-compressed',
  'image/vnd.dwg',
  'application/acad',
  'application/octet-stream',
]

const sourcePage = async () => {
  const referer = (await headers()).get('referer')
  try {
    return referer ? new URL(referer).pathname.slice(0, 300) : undefined
  } catch {
    return undefined
  }
}

const brandIds = async (slugs: string[]) => {
  if (!slugs.length) return []
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'brands',
    where: { slug: { in: slugs.slice(0, 20) } },
    depth: 0,
    limit: 20,
    select: { slug: true },
  })
  return docs.map((d) => d.id)
}

const productIds = async (references: string[]) => {
  if (!references.length) return []
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'products',
    where: { reference: { in: references.slice(0, 20) } },
    depth: 0,
    limit: 20,
    select: { slug: true },
  })
  return docs.map((d) => d.id)
}

/** Champs communs : identité, consentement. Renvoie les erreurs éventuelles. */
const contactFields = (form: FormData) => {
  const data = {
    firstName: text(form, 'firstName', 100),
    lastName: text(form, 'lastName', 100),
    email: text(form, 'email', 254).toLowerCase(),
    phone: text(form, 'phone', 40),
    company: text(form, 'company', 150),
    profile: PROFILES.find((p) => p === form.get('profile')),
    consent: form.get('consent') === 'on',
    newsletter: form.get('newsletter') === 'on',
    message: text(form, 'message', 5000),
    locale: (isLocale(String(form.get('locale'))) ? String(form.get('locale')) : 'fr') as Locale,
  }
  const errors: NonNullable<FormState['errors']> = {}
  if (!data.firstName) errors.firstName = 'required'
  if (!data.lastName) errors.lastName = 'required'
  if (!data.email) errors.email = 'required'
  else if (!EMAIL.test(data.email)) errors.email = 'email'
  if (!data.consent) errors.consent = 'required'
  return { data, errors }
}

/** Formulaire de contact (et demandes de devis, sourcing, envoi de plans). */
export async function submitContact(_prev: FormState, form: FormData): Promise<FormState> {
  // Champ invisible : rempli uniquement par les robots.
  if (form.get('website')) return { status: 'success' }

  const { data, errors } = contactFields(form)
  const file = form.get('attachment')
  const attachment = file instanceof File && file.size > 0 ? file : null
  if (attachment) {
    if (attachment.size > MAX_ATTACHMENT_BYTES) errors.attachment = 'fileSize'
    else if (attachment.type && !ATTACHMENT_TYPES.includes(attachment.type))
      errors.attachment = 'file'
  }
  if (Object.keys(errors).length) return { status: 'error', errors }

  const request = text(form, 'demande', 40)
  const kind = request === 'devis' ? 'quote' : request === 'sourcing' ? 'sourcing' : 'contact'
  const references = form
    .getAll('produit')
    .map((r) => String(r).trim())
    .filter(Boolean)
  const brandSlugs = form
    .getAll('brands')
    .map((b) => String(b))
    .filter(Boolean)
  const context = request && kind === 'contact' ? `[${request}] ` : ''

  try {
    const payload = await getPayloadClient()
    let attachments: number[] = []
    if (attachment) {
      const doc = await payload.create({
        collection: 'documents',
        data: {
          title:
            `Pièce jointe · ${[data.firstName, data.lastName].join(' ')} · ${attachment.name}`.slice(
              0,
              200,
            ),
          kind: 'other',
          access: 'internal',
        },
        file: {
          data: Buffer.from(await attachment.arrayBuffer()),
          mimetype: attachment.type || 'application/octet-stream',
          name: attachment.name.replace(/[^\w.\- ]+/g, '_').slice(-120) || 'piece-jointe',
          size: attachment.size,
        },
        locale: 'fr',
      })
      attachments = [doc.id]
    }

    await payload.create({
      collection: 'leads',
      data: {
        kind,
        status: 'new',
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone || undefined,
        company: data.company || undefined,
        profile: data.profile,
        project: {
          placeType: text(form, 'placeType', 80) || undefined,
          region: text(form, 'region', 80) || undefined,
          deadline: text(form, 'deadline', 80) || undefined,
          quantities: text(form, 'quantities', 200) || undefined,
          brands: await brandIds(brandSlugs),
          products: await productIds(references),
        },
        message: `${context}${data.message}`.trim() || undefined,
        attachments,
        consent: true,
        newsletter: data.newsletter,
        locale: data.locale,
        sourcePage: await sourcePage(),
      },
    })
    return { status: 'success' }
  } catch (error) {
    console.error('Demande de contact impossible à enregistrer', error)
    return { status: 'error' }
  }
}

/** Demande de rendez-vous : créneau souhaité, confirmé ensuite par l'équipe. */
export async function submitAppointment(_prev: FormState, form: FormData): Promise<FormState> {
  if (form.get('website')) return { status: 'success' }

  const { data, errors } = contactFields(form)
  const format = FORMATS.find((f) => f === form.get('format'))
  if (!format) errors.format = 'required'
  const date = text(form, 'date', 10)
  const time = text(form, 'time', 5)
  const startsAt = format && format !== 'factory' ? parisDateTimeToUtc(date, time) : null
  if (format && format !== 'factory' && !startsAt) errors.slot = 'slot'
  if (Object.keys(errors).length) return { status: 'error', errors }

  const memberId = Number.parseInt(text(form, 'member', 12), 10)
  const brandSlug = text(form, 'fabricant', 80)
  const tour = text(form, 'visite', 120)
  const reference = text(form, 'produit', 80)
  const period = text(form, 'period', 300)
  const showroom = text(form, 'showroom', 120)
  const context = [
    showroom ? `Showroom : ${showroom}` : null,
    tour ? `Visite : ${tour}` : null,
    period ? `Période souhaitée : ${period}` : null,
  ].filter(Boolean)

  try {
    const payload = await getPayloadClient()
    let member: number | undefined
    if (Number.isFinite(memberId)) {
      const found = await payload.find({
        collection: 'team-members',
        where: { and: [{ id: { equals: memberId } }, { bookable: { equals: true } }] },
        depth: 0,
        limit: 1,
      })
      member = found.docs[0]?.id
    }
    await payload.create({
      collection: 'leads',
      data: {
        kind: 'appointment',
        status: 'new',
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone || undefined,
        company: data.company || undefined,
        profile: data.profile,
        project: {
          brands: await brandIds(brandSlug ? [brandSlug] : []),
          products: await productIds(reference ? [reference] : []),
        },
        appointment: { format, member, startsAt: startsAt ?? undefined },
        message: [...context, data.message].filter(Boolean).join('\n') || undefined,
        consent: true,
        newsletter: data.newsletter,
        locale: data.locale,
        sourcePage: await sourcePage(),
      },
    })
    return { status: 'success' }
  } catch (error) {
    console.error('Demande de rendez-vous impossible à enregistrer', error)
    return { status: 'error' }
  }
}
