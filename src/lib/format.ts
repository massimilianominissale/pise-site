import type { Locale } from '@/i18n/config'

/** « 12 – 16 avril 2027 » ; une seule date si la fin manque. */
export const formatDateRange = (locale: Locale, start: string, end?: string | null): string => {
  const format = new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Europe/Paris',
  })
  const from = new Date(start)
  if (!end) return format.format(from)
  return format.formatRange(from, new Date(end))
}

/** Noms des documents liés déjà chargés (les identifiants seuls sont ignorés). */
export const namesOf = (
  items: unknown[] | null | undefined,
  key: 'name' | 'title' = 'name',
): string[] =>
  (items ?? [])
    .map((i) => (i && typeof i === 'object' ? (i as Record<string, unknown>)[key] : null))
    .filter((n): n is string => typeof n === 'string' && n.length > 0)

/** « PDF · 2,3 Mo » */
export const formatFile = (
  locale: Locale,
  mimeType?: string | null,
  bytes?: number | null,
): string => {
  const ext = mimeType?.split('/').pop()?.replace('vnd.', '').toUpperCase()
  const type = mimeType === 'application/pdf' ? 'PDF' : ext && ext.length <= 5 ? ext : null
  const size = bytes
    ? new Intl.NumberFormat(locale, {
        style: 'unit',
        unit: bytes >= 1_000_000 ? 'megabyte' : 'kilobyte',
        unitDisplay: 'short',
        maximumFractionDigits: 1,
      }).format(bytes >= 1_000_000 ? bytes / 1_000_000 : Math.max(1, Math.round(bytes / 1000)))
    : null
  return [type, size].filter(Boolean).join(' · ')
}
