import type { CollectionConfig } from 'payload'

import { isEditor, isEditorOrAI, publishedOrStaff } from '../access'
import { slugField } from '../fields/slug'
import { draftHooks, GROUPS, l, versioned } from './shared'

/** Salons et événements où l'Agence PISE expose. */
export const Events: CollectionConfig = {
  slug: 'events',
  labels: { singular: l('Salon', 'Trade fair'), plural: l('Salons', 'Trade fairs') },
  admin: {
    group: GROUPS.content,
    useAsTitle: 'name',
    defaultColumns: ['name', 'startDate', 'city', '_status'],
  },
  access: {
    read: publishedOrStaff,
    create: isEditorOrAI,
    update: isEditorOrAI,
    delete: isEditor,
  },
  versions: versioned,
  hooks: draftHooks,
  defaultSort: '-startDate',
  fields: [
    { name: 'name', label: l('Nom', 'Name'), type: 'text', required: true, localized: true },
    {
      type: 'row',
      fields: [
        {
          name: 'startDate',
          label: l('Début', 'Start'),
          type: 'date',
          required: true,
          admin: {
            width: '50%',
            date: { pickerAppearance: 'dayOnly', displayFormat: 'd MMMM yyyy' },
          },
        },
        {
          name: 'endDate',
          label: l('Fin', 'End'),
          type: 'date',
          admin: {
            width: '50%',
            date: { pickerAppearance: 'dayOnly', displayFormat: 'd MMMM yyyy' },
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'city', label: l('Ville', 'City'), type: 'text', admin: { width: '33%' } },
        { name: 'venue', label: l('Lieu', 'Venue'), type: 'text', admin: { width: '33%' } },
        { name: 'booth', label: l('Stand', 'Booth'), type: 'text', admin: { width: '34%' } },
      ],
    },
    { name: 'address', label: l('Adresse', 'Address'), type: 'text' },
    { name: 'summary', label: l('Présentation', 'Summary'), type: 'textarea', localized: true },
    { name: 'image', label: l('Image', 'Image'), type: 'upload', relationTo: 'media' },
    {
      type: 'row',
      fields: [
        {
          name: 'website',
          label: l('Site du salon', 'Fair website'),
          type: 'text',
          admin: { width: '50%' },
        },
        {
          name: 'registrationUrl',
          label: l('Lien d’inscription ou badge', 'Registration link'),
          type: 'text',
          admin: { width: '50%' },
        },
      ],
    },
    {
      name: 'brands',
      label: l('Fabricants présents', 'Brands exhibited'),
      type: 'relationship',
      relationTo: 'brands',
      hasMany: true,
    },
    slugField({ from: 'name', localized: true }),
  ],
}
