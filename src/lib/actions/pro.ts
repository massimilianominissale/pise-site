'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { isLocale, type Locale, localizedPath } from '@/i18n/config'
import { getCustomer, sessionCookieName } from '@/lib/auth'
import { MAX_ATTACHMENT_BYTES } from '@/lib/forms'
import { getPayloadClient } from '@/lib/payload'
import { isValidSiret, normalizeSiret } from '@/lib/siret'

/**
 * Espace pro : connexion, demande d'accès, mot de passe. Les comptes sont créés « en attente »
 * et ne peuvent se connecter qu'une fois validés par l'équipe dans l'administration.
 */

export type ProState = {
  status: 'idle' | 'success' | 'error'
  /** Clé du message à afficher (voir le dictionnaire, rubrique proPage.messages). */
  message?:
    | 'invalid'
    | 'pending'
    | 'locked'
    | 'exists'
    | 'generic'
    | 'passwordMismatch'
    | 'passwordWeak'
    | 'wrongPassword'
    | 'resetSent'
    | 'resetDone'
    | 'resetExpired'
  errors?: Record<string, 'required' | 'email' | 'siret' | 'file' | 'fileSize' | 'password'>
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const ACTIVITIES = ['architect', 'hospitality', 'company', 'reseller'] as const
const text = (form: FormData, name: string, max = 200) =>
  String(form.get(name) ?? '')
    .trim()
    .slice(0, max)
const localeOf = (form: FormData): Locale => {
  const l = String(form.get('locale') ?? '')
  return isLocale(l) ? l : 'fr'
}

const setSession = async (token: string, exp?: number) => {
  const jar = await cookies()
  jar.set(await sessionCookieName(), token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    ...(exp ? { expires: new Date(exp * 1000) } : {}),
  })
}

export async function loginCustomer(_prev: ProState, form: FormData): Promise<ProState> {
  const email = text(form, 'email', 254).toLowerCase()
  const password = String(form.get('password') ?? '')
  if (!email || !password) return { status: 'error', message: 'invalid' }
  const payload = await getPayloadClient()
  try {
    const result = await payload.login({ collection: 'customers', data: { email, password } })
    if (!result.token) return { status: 'error', message: 'generic' }
    await setSession(result.token, result.exp)
  } catch (error) {
    const status = (error as { status?: number }).status
    const name = (error as { name?: string }).name
    if (status === 403) return { status: 'error', message: 'pending' }
    if (name === 'LockedAuth') return { status: 'error', message: 'locked' }
    return { status: 'error', message: 'invalid' }
  }
  redirect(localizedPath(localeOf(form), 'pro'))
}

export async function logoutCustomer(form: FormData) {
  const jar = await cookies()
  jar.delete(await sessionCookieName())
  redirect(localizedPath(localeOf(form), 'pro'))
}

export async function requestAccess(_prev: ProState, form: FormData): Promise<ProState> {
  if (form.get('website_hp')) return { status: 'success' }

  const data = {
    company: text(form, 'company'),
    siret: normalizeSiret(text(form, 'siret', 30)),
    activity: ACTIVITIES.find((a) => a === form.get('activity')),
    website: text(form, 'website'),
    firstName: text(form, 'firstName', 100),
    lastName: text(form, 'lastName', 100),
    jobTitle: text(form, 'jobTitle', 120),
    email: text(form, 'email', 254).toLowerCase(),
    phone: text(form, 'phone', 40),
    password: String(form.get('password') ?? ''),
  }
  const errors: NonNullable<ProState['errors']> = {}
  for (const key of ['company', 'firstName', 'lastName', 'email'] as const)
    if (!data[key]) errors[key] = 'required'
  if (data.email && !EMAIL.test(data.email)) errors.email = 'email'
  if (!data.siret) errors.siret = 'required'
  else if (!isValidSiret(data.siret)) errors.siret = 'siret'
  if (data.password.length < 10) errors.password = 'password'
  if (form.get('consent') !== 'on') errors.consent = 'required'
  const file = form.get('kbis')
  const kbis = file instanceof File && file.size > 0 ? file : null
  if (!kbis) errors.kbis = 'required'
  else if (kbis.size > MAX_ATTACHMENT_BYTES) errors.kbis = 'fileSize'
  else if (kbis.type && kbis.type !== 'application/pdf') errors.kbis = 'file'
  if (Object.keys(errors).length) return { status: 'error', errors }

  const payload = await getPayloadClient()
  const existing = await payload.count({
    collection: 'customers',
    where: { email: { equals: data.email } },
  })
  if (existing.totalDocs) return { status: 'error', message: 'exists' }

  const locale = localeOf(form)
  try {
    const document = await payload.create({
      collection: 'documents',
      data: { title: `K-bis · ${data.company}`.slice(0, 200), kind: 'other', access: 'internal' },
      file: {
        data: Buffer.from(await kbis!.arrayBuffer()),
        mimetype: 'application/pdf',
        name: `kbis-${data.siret}.pdf`,
        size: kbis!.size,
      },
      locale: 'fr',
    })
    await payload.create({
      collection: 'customers',
      data: {
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        company: data.company,
        siret: data.siret,
        activity: data.activity,
        jobTitle: data.jobTitle || undefined,
        phone: data.phone || undefined,
        website: data.website || undefined,
        status: 'pending',
      },
    })
    // Suivi commercial : la demande apparaît dans « Demandes » (et dans Zoho une fois branché).
    await payload.create({
      collection: 'leads',
      data: {
        kind: 'pro-access',
        status: 'new',
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone || undefined,
        company: data.company,
        profile: data.activity,
        message: [
          `SIRET : ${data.siret}`,
          data.jobTitle && `Fonction : ${data.jobTitle}`,
          data.website && `Site : ${data.website}`,
        ]
          .filter(Boolean)
          .join('\n'),
        attachments: [document.id],
        consent: true,
        locale,
        sourcePage: localizedPath(locale, 'pro'),
      },
    })
    return { status: 'success' }
  } catch (error) {
    console.error('Demande d’accès pro impossible à enregistrer', error)
    return { status: 'error', message: 'generic' }
  }
}

export async function changePassword(_prev: ProState, form: FormData): Promise<ProState> {
  const customer = await getCustomer()
  if (!customer) return { status: 'error', message: 'generic' }
  const current = String(form.get('current') ?? '')
  const next = String(form.get('password') ?? '')
  if (next.length < 10) return { status: 'error', errors: { password: 'password' } }
  if (next !== String(form.get('confirm') ?? ''))
    return { status: 'error', message: 'passwordMismatch' }
  const payload = await getPayloadClient()
  try {
    await payload.login({
      collection: 'customers',
      data: { email: customer.email, password: current },
    })
  } catch {
    return { status: 'error', message: 'wrongPassword' }
  }
  await payload.update({ collection: 'customers', id: customer.id, data: { password: next } })
  return { status: 'success' }
}

export async function requestPasswordReset(_prev: ProState, form: FormData): Promise<ProState> {
  const email = text(form, 'email', 254).toLowerCase()
  if (!EMAIL.test(email)) return { status: 'error', errors: { email: 'email' } }
  const payload = await getPayloadClient()
  try {
    await payload.forgotPassword({ collection: 'customers', data: { email } })
  } catch (error) {
    console.error('Réinitialisation du mot de passe impossible', error)
  }
  // Même réponse que l'adresse existe ou non (ne révèle pas les comptes).
  return { status: 'success', message: 'resetSent' }
}

export async function resetPassword(_prev: ProState, form: FormData): Promise<ProState> {
  const token = text(form, 'token', 200)
  const password = String(form.get('password') ?? '')
  if (password.length < 10) return { status: 'error', errors: { password: 'password' } }
  if (password !== String(form.get('confirm') ?? ''))
    return { status: 'error', message: 'passwordMismatch' }
  const payload = await getPayloadClient()
  try {
    await payload.resetPassword({
      collection: 'customers',
      data: { token, password },
      overrideAccess: true,
    })
    return { status: 'success', message: 'resetDone' }
  } catch {
    return { status: 'error', message: 'resetExpired' }
  }
}
