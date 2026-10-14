// @vitest-environment node
import { describe, expect, it } from 'vitest'

import { safeEmbedUrl } from '@/lib/embed'

describe('Outils intégrés en iframe', () => {
  it('n’accepte que des adresses https', () => {
    expect(safeEmbedUrl('http://visites.imrsivo.com/johanson', [])).toBeNull()
    expect(safeEmbedUrl('javascript:alert(1)', [])).toBeNull()
    expect(safeEmbedUrl('pas une adresse', [])).toBeNull()
    expect(safeEmbedUrl(' https://visites.imrsivo.com/johanson ', [])).toBe(
      'https://visites.imrsivo.com/johanson',
    )
  })

  it('respecte les domaines autorisés dans Réglages › Intégrations', () => {
    const origins = ['https://visites.imrsivo.com', 'https://app.mobilia.fr/']
    expect(safeEmbedUrl('https://visites.imrsivo.com/station-f', origins)).toBe(
      'https://visites.imrsivo.com/station-f',
    )
    expect(safeEmbedUrl('https://app.mobilia.fr/pise', origins)).toBe('https://app.mobilia.fr/pise')
    expect(safeEmbedUrl('https://exemple.com/visite', origins)).toBeNull()
    expect(safeEmbedUrl('https://visites.imrsivo.com.exemple.com/x', origins)).toBeNull()
  })
})
