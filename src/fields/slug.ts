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

const formatSlug =
  (sourceField: string): FieldHook =>
  ({ value, data, originalDoc }) => {
    if (typeof value === 'string' && value.trim()) return slugify(value)
    const source = data?.[sourceField] ?? originalDoc?.[sourceField]
    return typeof source === 'string' ? slugify(source) : value
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
    beforeValidate: [formatSlug(from)],
  },
})
