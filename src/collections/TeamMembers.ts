import type { CollectionConfig } from 'payload'

import { anyone, isEditor } from '../access'
import { GROUPS, l } from './shared'

/** L'équipe PISE : référents par marque et par zone, réservables pour un rendez-vous. */
export const TeamMembers: CollectionConfig = {
  slug: 'team-members',
  labels: { singular: l('Membre de l’équipe', 'Team member'), plural: l('Équipe', 'Team') },
  admin: {
    group: GROUPS.content,
    useAsTitle: 'name',
    defaultColumns: ['name', 'jobTitle', 'zone', 'bookable'],
  },
  access: {
    read: anyone,
    create: isEditor,
    update: isEditor,
    delete: isEditor,
  },
  defaultSort: 'order',
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'name',
          label: l('Prénom et nom', 'Full name'),
          type: 'text',
          required: true,
          admin: { width: '50%' },
        },
        {
          name: 'jobTitle',
          label: l('Fonction', 'Job title'),
          type: 'text',
          localized: true,
          admin: { width: '50%' },
        },
      ],
    },
    { name: 'photo', label: l('Photo', 'Photo'), type: 'upload', relationTo: 'media' },
    {
      type: 'row',
      fields: [
        { name: 'email', label: l('E-mail', 'Email'), type: 'email', admin: { width: '50%' } },
        { name: 'phone', label: l('Téléphone', 'Phone'), type: 'text', admin: { width: '50%' } },
      ],
    },
    {
      name: 'zone',
      label: l('Zone géographique', 'Area'),
      type: 'text',
      localized: true,
    },
    {
      name: 'brands',
      label: l('Marques suivies', 'Brands covered'),
      type: 'relationship',
      relationTo: 'brands',
      hasMany: true,
    },
    {
      name: 'showroom',
      label: l('Showroom de rattachement', 'Showroom'),
      type: 'relationship',
      relationTo: 'showrooms',
    },
    { name: 'bio', label: l('Présentation', 'Bio'), type: 'textarea', localized: true },
    {
      name: 'bookable',
      label: l('Réservable pour un rendez-vous', 'Bookable for appointments'),
      type: 'checkbox',
      defaultValue: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'calendarId',
      label: l('Identifiant d’agenda', 'Calendar ID'),
      type: 'text',
      admin: {
        position: 'sidebar',
        description: l(
          'Renseigné une fois l’outil d’agenda choisi.',
          'Set once the calendar tool is chosen.',
        ),
      },
    },
    { name: 'order', label: l('Ordre', 'Order'), type: 'number', admin: { position: 'sidebar' } },
  ],
}
