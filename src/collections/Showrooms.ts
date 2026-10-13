import type { CollectionConfig } from 'payload'

import { anyone, isEditor } from '../access'
import { slugField } from '../fields/slug'
import { galleryField, GROUPS, l } from './shared'

/** Showrooms où voir les collections (recherche locale, données LocalBusiness). */
export const Showrooms: CollectionConfig = {
  slug: 'showrooms',
  labels: { singular: l('Showroom', 'Showroom'), plural: l('Showrooms', 'Showrooms') },
  admin: {
    group: GROUPS.content,
    useAsTitle: 'name',
    defaultColumns: ['name', 'city', 'phone'],
  },
  access: {
    read: anyone,
    create: isEditor,
    update: isEditor,
    delete: isEditor,
  },
  defaultSort: 'order',
  fields: [
    { name: 'name', label: l('Nom', 'Name'), type: 'text', required: true },
    {
      name: 'address',
      label: l('Adresse', 'Address'),
      type: 'group',
      fields: [
        { name: 'street', label: l('Rue', 'Street'), type: 'text' },
        {
          type: 'row',
          fields: [
            {
              name: 'postalCode',
              label: l('Code postal', 'Postcode'),
              type: 'text',
              admin: { width: '25%' },
            },
            { name: 'city', label: l('Ville', 'City'), type: 'text', admin: { width: '45%' } },
            {
              name: 'country',
              label: l('Pays', 'Country'),
              type: 'text',
              defaultValue: 'France',
              admin: { width: '30%' },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'latitude',
              label: l('Latitude', 'Latitude'),
              type: 'number',
              admin: { width: '50%', step: 0.000001 },
            },
            {
              name: 'longitude',
              label: l('Longitude', 'Longitude'),
              type: 'number',
              admin: { width: '50%', step: 0.000001 },
            },
          ],
        },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'phone', label: l('Téléphone', 'Phone'), type: 'text', admin: { width: '50%' } },
        { name: 'email', label: l('E-mail', 'Email'), type: 'email', admin: { width: '50%' } },
      ],
    },
    {
      name: 'openingHours',
      label: l('Horaires', 'Opening hours'),
      type: 'array',
      labels: { singular: l('Horaire', 'Opening hours'), plural: l('Horaires', 'Opening hours') },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'days',
              label: l('Jours', 'Days'),
              type: 'text',
              localized: true,
              required: true,
            },
            { name: 'hours', label: l('Horaires', 'Hours'), type: 'text', required: true },
          ],
        },
      ],
    },
    {
      name: 'description',
      label: l('Description', 'Description'),
      type: 'textarea',
      localized: true,
    },
    galleryField('images'),
    {
      name: 'brands',
      label: l('Marques exposées', 'Brands on display'),
      type: 'relationship',
      relationTo: 'brands',
      hasMany: true,
    },
    {
      name: 'virtualTour',
      label: l('Visite virtuelle', 'Virtual tour'),
      type: 'relationship',
      relationTo: 'virtual-tours',
    },
    slugField({ from: 'name' }),
    { name: 'order', label: l('Ordre', 'Order'), type: 'number', admin: { position: 'sidebar' } },
  ],
}
