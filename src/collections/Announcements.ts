import type { CollectionConfig } from 'payload'

import { isEditor, isEditorOrAI, publishedOrStaff } from '../access'
import { linkField } from '../fields/link'
import { draftHooks, GROUPS, l, versioned } from './shared'

/** Bandeaux et fenêtres d'annonce (salon, nouveauté, promotion), avec dates et ciblage. */
export const Announcements: CollectionConfig = {
  slug: 'announcements',
  labels: { singular: l('Annonce', 'Announcement'), plural: l('Annonces', 'Announcements') },
  admin: {
    group: GROUPS.content,
    useAsTitle: 'internalName',
    defaultColumns: ['internalName', 'format', 'startsAt', 'endsAt', '_status'],
  },
  access: {
    read: publishedOrStaff,
    create: isEditorOrAI,
    update: isEditorOrAI,
    delete: isEditor,
  },
  versions: versioned,
  hooks: draftHooks,
  defaultSort: '-startsAt',
  fields: [
    {
      name: 'internalName',
      label: l('Nom interne', 'Internal name'),
      type: 'text',
      required: true,
      admin: {
        description: l('Visible seulement dans l’administration.', 'Only visible in the admin.'),
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'format',
          label: l('Format', 'Format'),
          type: 'select',
          required: true,
          defaultValue: 'bar',
          options: [
            { label: l('Bandeau en haut de page', 'Top bar'), value: 'bar' },
            { label: l('Fenêtre', 'Pop-up'), value: 'popup' },
          ],
          admin: { width: '50%' },
        },
        {
          name: 'tone',
          label: l('Couleur', 'Colour'),
          type: 'select',
          defaultValue: 'ink',
          options: [
            { label: l('Anthracite', 'Ink'), value: 'ink' },
            { label: l('Bleu PISE', 'PISE blue'), value: 'ocean' },
          ],
          admin: { width: '50%' },
        },
      ],
    },
    {
      name: 'message',
      label: l('Message', 'Message'),
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'body',
      label: l('Texte de la fenêtre', 'Pop-up text'),
      type: 'textarea',
      localized: true,
      admin: { condition: (data) => data?.format === 'popup' },
    },
    {
      name: 'image',
      label: l('Image de la fenêtre', 'Pop-up image'),
      type: 'upload',
      relationTo: 'media',
      admin: { condition: (data) => data?.format === 'popup' },
    },
    linkField({ name: 'link' }),
    {
      type: 'row',
      fields: [
        {
          name: 'startsAt',
          label: l('Début de diffusion', 'Starts'),
          type: 'date',
          admin: { width: '50%', date: { pickerAppearance: 'dayAndTime' } },
        },
        {
          name: 'endsAt',
          label: l('Fin de diffusion', 'Ends'),
          type: 'date',
          admin: { width: '50%', date: { pickerAppearance: 'dayAndTime' } },
        },
      ],
    },
    {
      name: 'targeting',
      label: l('Pages ciblées', 'Targeting'),
      type: 'select',
      defaultValue: 'all',
      options: [
        { label: l('Tout le site', 'Whole site'), value: 'all' },
        { label: l('Accueil seulement', 'Home only'), value: 'home' },
        { label: l('Adresses choisies', 'Selected paths'), value: 'paths' },
      ],
    },
    {
      name: 'paths',
      label: l('Adresses', 'Paths'),
      type: 'text',
      hasMany: true,
      admin: {
        condition: (data) => data?.targeting === 'paths',
        description: l(
          'Exemple : /fabricants ou /fabricants/* pour toute la rubrique.',
          'Example: /fabricants or /fabricants/*.',
        ),
      },
    },
    {
      name: 'frequency',
      label: l('Fréquence d’affichage', 'Display frequency'),
      type: 'select',
      defaultValue: 'session',
      options: [
        { label: l('Une fois par visite', 'Once per session'), value: 'session' },
        { label: l('Une seule fois', 'Once'), value: 'once' },
        { label: l('À chaque page', 'Every page'), value: 'always' },
      ],
      admin: { position: 'sidebar' },
    },
  ],
}
