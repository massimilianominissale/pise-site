import type { Field, GroupField } from 'payload'

/** Collections vers lesquelles un lien interne peut pointer. */
export const LINKABLE = [
  'pages',
  'brands',
  'ranges',
  'products',
  'projects',
  'posts',
  'virtual-tours',
  'events',
] as const

type LinkOptions = {
  name?: string
  label?: GroupField['label']
  withLabel?: boolean
  required?: boolean
}

/** Lien éditable : vers une page du site ou une adresse externe. */
export const linkField = ({
  name = 'link',
  label = { fr: 'Lien', en: 'Link' },
  withLabel = true,
  required = false,
}: LinkOptions = {}): GroupField => {
  const fields: Field[] = [
    {
      type: 'row',
      fields: [
        {
          name: 'type',
          label: { fr: 'Type', en: 'Type' },
          type: 'radio',
          defaultValue: 'internal',
          options: [
            { label: { fr: 'Page du site', en: 'Internal page' }, value: 'internal' },
            { label: { fr: 'Adresse ou rubrique', en: 'URL or section' }, value: 'external' },
          ],
          admin: { layout: 'horizontal', width: '50%' },
        },
        {
          name: 'newTab',
          label: { fr: 'Ouvrir dans un nouvel onglet', en: 'Open in new tab' },
          type: 'checkbox',
          admin: { width: '50%', style: { alignSelf: 'flex-end' } },
        },
      ],
    },
    {
      name: 'reference',
      label: { fr: 'Page', en: 'Page' },
      type: 'relationship',
      relationTo: [...LINKABLE],
      required,
      admin: { condition: (_, sibling) => sibling?.type !== 'external' },
    },
    {
      name: 'url',
      label: { fr: 'Adresse', en: 'URL' },
      type: 'text',
      required,
      admin: {
        condition: (_, sibling) => sibling?.type === 'external',
        description: {
          fr: 'Adresse complète (https://…) ou rubrique du site en français (/fabricants, /rendez-vous) : elle est traduite automatiquement en anglais et en italien.',
          en: 'Full URL (https://…) or a site section in French (/fabricants, /rendez-vous): it is translated automatically.',
        },
      },
    },
  ]
  if (withLabel) {
    fields.push({
      name: 'label',
      label: { fr: 'Texte du lien', en: 'Label' },
      type: 'text',
      localized: true,
    })
  }
  return { name, label, type: 'group', fields }
}
