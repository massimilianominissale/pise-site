import type { FieldHook, TextField } from 'payload'

/** Transforme un texte en identifiant d'URL : « Net Lounge » → « net-lounge ». */
export const slugify = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/&/g, '-et-')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

/**
 * Identifiant saisi : nettoyé tel quel (un doublon est refusé à l'enregistrement).
 * Identifiant laissé vide : calculé depuis le nom, avec un suffixe -2, -3… s'il est déjà pris
 * (deux fabricants peuvent avoir un produit du même nom).
 */
const formatSlug =
  (sourceField: string, unique: boolean): FieldHook =>
  async ({ value, data, originalDoc, req, collection }) => {
    if (typeof value === 'string' && value.trim()) return slugify(value)
    const source = data?.[sourceField] ?? originalDoc?.[sourceField]
    if (typeof source !== 'string') return value
    const base = slugify(source)
    if (!unique || !collection || !base) return base
    const selfId = originalDoc?.id
    for (let n = 1; n < 100; n++) {
      const candidate = n === 1 ? base : `${base}-${n}`
      const { totalDocs } = await req.payload.count({
        collection: collection.slug,
        locale: req.locale && req.locale !== 'all' ? req.locale : undefined,
        req,
        where: {
          and: [
            { slug: { equals: candidate } },
            ...(selfId != null ? [{ id: { not_equals: selfId } }] : []),
          ],
        },
      })
      if (!totalDocs) return candidate
    }
    return `${base}-${Date.now()}`
  }

type SlugOptions = {
  /** Champ à partir duquel l'identifiant est calculé s'il est laissé vide. */
  from?: string
  /** Identifiant traduit par langue (pages, actualités) ou commun (fabricants, produits). */
  localized?: boolean
  unique?: boolean
}

export const slugField = ({
  from = 'title',
  localized = false,
  unique = true,
}: SlugOptions = {}): TextField => ({
  name: 'slug',
  label: { fr: 'Identifiant d’URL', en: 'URL slug' },
  type: 'text',
  index: true,
  unique,
  localized,
  admin: {
    position: 'sidebar',
    description: {
      fr: 'Calculé automatiquement à partir du nom si laissé vide.',
      en: 'Generated from the name when left empty.',
    },
  },
  hooks: {
    beforeValidate: [formatSlug(from, unique)],
  },
})
