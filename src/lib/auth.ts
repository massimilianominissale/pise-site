import 'server-only'

import { headers } from 'next/headers'
import { cache } from 'react'

import type { Customer } from '@/payload-types'

import { getPayloadClient } from './payload'

export type SessionCustomer = Customer & { collection: 'customers' }

/** Compte pro connecté (cookie de session Payload), ou null. */
export const getCustomer = cache(async (): Promise<SessionCustomer | null> => {
  const payload = await getPayloadClient()
  try {
    const { user } = await payload.auth({ headers: await headers() })
    if (user && user.collection === 'customers') return user as SessionCustomer
  } catch {
    // Jeton expiré ou invalide : visiteur anonyme.
  }
  return null
})

/** Nom du cookie de session (le même que celui de l'administration). */
export const sessionCookieName = async () =>
  `${(await getPayloadClient()).config.cookiePrefix}-token`
