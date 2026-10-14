import 'server-only'

import type { Locale } from '@/i18n/config'

import { resolveLink } from './links'
import { getGlobal } from './payload'

/** Politique de confidentialité : le lien légal du pied de page qui y mène (null s'il manque). */
export const getPrivacyHref = async (locale: Locale) => {
  const footer = await getGlobal('footer', locale)
  for (const row of footer.legalLinks ?? []) {
    const link = resolveLink(row.link, locale)
    if (link && /confidential|privacy|riservatezza/i.test(link.href)) return link.href
  }
  return null
}
