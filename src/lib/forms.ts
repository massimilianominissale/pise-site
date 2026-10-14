/**
 * Outils partagés par les formulaires (navigateur et serveur) : jours ouvrés,
 * créneaux, conversion de l'heure de Paris.
 */

/** Limite des requêtes Vercel (4,5 Mo) moins l'enveloppe du formulaire. */
export const MAX_ATTACHMENT_BYTES = 4 * 1024 * 1024

export type AppointmentFormat = 'video' | 'showroom' | 'virtual-tour' | 'factory'

/** Durée de chaque format, en minutes (le voyage en usine se fixe à la demande). */
export const FORMAT_MINUTES: Record<AppointmentFormat, number | null> = {
  video: 30,
  showroom: 60,
  'virtual-tour': 45,
  factory: null,
}

/** Créneaux proposés (heure de Paris), le matin et l'après-midi. */
export const slotsFor = (format: AppointmentFormat): { morning: string[]; afternoon: string[] } => {
  if (format === 'video') {
    return {
      morning: ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30'],
      afternoon: ['14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'],
    }
  }
  return { morning: ['09:00', '10:00', '11:00'], afternoon: ['14:00', '15:00', '16:00'] }
}

const pad = (n: number) => String(n).padStart(2, '0')
export const isoDate = (d: Date) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`

/** Dimanche de Pâques (algorithme de Meeus/Jones/Butcher). */
const easter = (year: number) => {
  const a = year % 19
  const b = Math.floor(year / 100)
  const c = year % 100
  const d = Math.floor(b / 4)
  const e = b % 4
  const f = Math.floor((b + 8) / 25)
  const g = Math.floor((b - f + 1) / 3)
  const h = (19 * a + b - d - g + 15) % 30
  const i = Math.floor(c / 4)
  const k = c % 4
  const l = (32 + 2 * e + 2 * i - h - k) % 7
  const m = Math.floor((a + 11 * h + 22 * l) / 451)
  const month = Math.floor((h + l - 7 * m + 114) / 31)
  const day = ((h + l - 7 * m + 114) % 31) + 1
  return new Date(year, month - 1, day)
}

/** Jours fériés en France métropolitaine. */
export const frenchHolidays = (year: number): Set<string> => {
  const e = easter(year)
  const plus = (days: number) =>
    isoDate(new Date(e.getFullYear(), e.getMonth(), e.getDate() + days))
  return new Set([
    `${year}-01-01`,
    plus(1), // lundi de Pâques
    `${year}-05-01`,
    `${year}-05-08`,
    plus(39), // Ascension
    plus(50), // lundi de Pentecôte
    `${year}-07-14`,
    `${year}-08-15`,
    `${year}-11-01`,
    `${year}-11-11`,
    `${year}-12-25`,
  ])
}

/** Jour ouvré proposé à la réservation : du lundi au vendredi, hors jours fériés, à partir de demain. */
export const isBookableDay = (date: Date, today = new Date()) => {
  const day = date.getDay()
  if (day === 0 || day === 6) return false
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)
  if (date < start) return false
  const limit = new Date(today.getFullYear(), today.getMonth() + 3, today.getDate())
  if (date > limit) return false
  return !frenchHolidays(date.getFullYear()).has(isoDate(date))
}

/** « 2026-11-10 » + « 10:30 », heure de Paris → instant ISO (UTC). Null si invalide. */
export const parisDateTimeToUtc = (date: string, time: string): string | null => {
  const d = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date)
  const t = /^(\d{2}):(\d{2})$/.exec(time)
  if (!d || !t) return null
  const [y, mo, da] = [Number(d[1]), Number(d[2]), Number(d[3])]
  const [h, mi] = [Number(t[1]), Number(t[2])]
  if (h > 23 || mi > 59) return null
  const local = new Date(y, mo - 1, da)
  if (local.getMonth() !== mo - 1 || !isBookableDay(local)) return null
  // Décalage de Paris à cet instant (+1 h l'hiver, +2 h l'été).
  const guess = Date.UTC(y, mo - 1, da, h, mi)
  const offsetName = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Europe/Paris',
    timeZoneName: 'shortOffset',
  })
    .formatToParts(new Date(guess))
    .find((p) => p.type === 'timeZoneName')?.value
  const offset = Number(/GMT([+-]\d+)/.exec(offsetName ?? '')?.[1] ?? 1)
  return new Date(guess - offset * 3600_000).toISOString()
}

/** Régions proposées dans le formulaire de contact (enregistrées en clair). */
export const REGIONS = [
  'Auvergne-Rhône-Alpes',
  'Bourgogne-Franche-Comté',
  'Bretagne',
  'Centre-Val de Loire',
  'Corse',
  'Grand Est',
  'Hauts-de-France',
  'Île-de-France',
  'Normandie',
  'Nouvelle-Aquitaine',
  'Occitanie',
  'Pays de la Loire',
  'Provence-Alpes-Côte d’Azur',
  'Outre-mer',
]
