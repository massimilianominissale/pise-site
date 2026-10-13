'use server'

import { headers } from 'next/headers'

import { isLocale } from '@/i18n/config'
import { getPayloadClient } from '@/lib/payload'

export type NewsletterState = { status: 'idle' | 'success' | 'error' }

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

/**
 * Inscription à la newsletter : enregistrée comme demande « Newsletter » dans le back-office
 * (synchronisée avec Zoho lorsque le connecteur sera branché).
 */
export async function subscribeNewsletter(
  _prev: NewsletterState,
  form: FormData,
): Promise<NewsletterState> {
  // Champ invisible : rempli uniquement par les robots.
  if (form.get('website')) return { status: 'success' }

  const email = String(form.get('email') ?? '')
    .trim()
    .toLowerCase()
  const consent = form.get('consent') === 'on'
  const locale = String(form.get('locale') ?? 'fr')
  if (!EMAIL.test(email) || email.length > 254 || !consent) return { status: 'error' }

  try {
    const payload = await getPayloadClient()
    const existing = await payload.find({
      collection: 'leads',
      where: { and: [{ kind: { equals: 'newsletter' } }, { email: { equals: email } }] },
      limit: 1,
      depth: 0,
    })
    if (existing.totalDocs === 0) {
      const referer = (await headers()).get('referer')
      await payload.create({
        collection: 'leads',
        data: {
          kind: 'newsletter',
          status: 'new',
          email,
          consent: true,
          newsletter: true,
          locale: isLocale(locale) ? locale : 'fr',
          sourcePage: referer ? new URL(referer).pathname.slice(0, 300) : undefined,
        },
      })
    }
    return { status: 'success' }
  } catch (error) {
    console.error('Inscription newsletter impossible', error)
    return { status: 'error' }
  }
}
