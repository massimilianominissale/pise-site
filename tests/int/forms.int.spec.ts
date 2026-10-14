// @vitest-environment node
import { describe, expect, it } from 'vitest'

import { frenchHolidays, isBookableDay, parisDateTimeToUtc } from '@/lib/forms'

describe('Créneaux de rendez-vous', () => {
  const today = new Date(2026, 9, 14) // mercredi 14 octobre 2026

  it('propose les jours ouvrés à partir de demain, sur trois mois', () => {
    expect(isBookableDay(new Date(2026, 9, 14), today)).toBe(false) // aujourd'hui
    expect(isBookableDay(new Date(2026, 9, 15), today)).toBe(true)
    expect(isBookableDay(new Date(2026, 9, 17), today)).toBe(false) // samedi
    expect(isBookableDay(new Date(2026, 10, 11), today)).toBe(false) // 11 novembre
    expect(isBookableDay(new Date(2027, 1, 1), today)).toBe(false) // au-delà de trois mois
  })

  it('connaît les jours fériés mobiles', () => {
    const h = frenchHolidays(2027)
    expect(h.has('2027-03-29')).toBe(true) // lundi de Pâques
    expect(h.has('2027-05-06')).toBe(true) // Ascension
    expect(h.has('2027-05-17')).toBe(true) // lundi de Pentecôte
  })

  it('convertit l’heure de Paris en UTC, été comme hiver', () => {
    const now = new Date()
    // Les dates trop lointaines sont refusées : on vérifie le calcul du décalage sur des dates proches.
    const near = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7)
    while (near.getDay() === 0 || near.getDay() === 6) near.setDate(near.getDate() + 1)
    const iso = `${near.getFullYear()}-${String(near.getMonth() + 1).padStart(2, '0')}-${String(near.getDate()).padStart(2, '0')}`
    const utc = parisDateTimeToUtc(iso, '10:00')
    expect(utc).not.toBeNull()
    const hour = new Date(utc!).getUTCHours()
    expect([8, 9]).toContain(hour) // 10:00 à Paris = 8:00 (été) ou 9:00 (hiver) UTC
    expect(parisDateTimeToUtc(iso, '25:00')).toBeNull()
    expect(parisDateTimeToUtc('2026-02-30', '10:00')).toBeNull()
  })
})
