import type { CollectionConfig } from 'payload'

import { hasRole, isAdmin } from '../access'
import { GROUPS, l } from './shared'

/**
 * Demandes reçues par le site : contact, devis, rendez-vous, accès pro, sourcing.
 * Créées côté serveur par les formulaires, puis synchronisées avec Zoho.
 */
export const Leads: CollectionConfig = {
  slug: 'leads',
  labels: { singular: l('Demande', 'Lead'), plural: l('Demandes', 'Leads') },
  admin: {
    group: GROUPS.customers,
    useAsTitle: 'summary',
    defaultColumns: ['summary', 'kind', 'status', 'createdAt'],
  },
  access: {
    // Le compte IA peut lire les demandes (outil « leads de la semaine »), pas les modifier.
    read: ({ req }) => hasRole(req, 'admin', 'sales', 'ai'),
    create: ({ req }) => hasRole(req, 'admin', 'sales'),
    update: ({ req }) => hasRole(req, 'admin', 'sales'),
    delete: isAdmin,
  },
  defaultSort: '-createdAt',
  hooks: {
    beforeChange: [
      ({ data }) => {
        const who = [data?.firstName, data?.lastName].filter(Boolean).join(' ')
        const company = data?.company ? ` · ${data.company}` : ''
        return { ...data, summary: `${who || data?.email || 'Demande'}${company}` }
      },
    ],
  },
  fields: [
    { name: 'summary', label: l('Demande', 'Lead'), type: 'text', admin: { hidden: true } },
    {
      type: 'row',
      fields: [
        {
          name: 'kind',
          label: l('Type de demande', 'Lead type'),
          type: 'select',
          required: true,
          defaultValue: 'contact',
          options: [
            { label: l('Contact', 'Contact'), value: 'contact' },
            { label: l('Devis', 'Quote'), value: 'quote' },
            { label: l('Rendez-vous', 'Appointment'), value: 'appointment' },
            { label: l('Accès pro', 'Pro access'), value: 'pro-access' },
            { label: l('Sourcing', 'Sourcing'), value: 'sourcing' },
            { label: l('Newsletter', 'Newsletter'), value: 'newsletter' },
          ],
          admin: { width: '50%' },
        },
        {
          name: 'status',
          label: l('Statut', 'Status'),
          type: 'select',
          required: true,
          defaultValue: 'new',
          options: [
            { label: l('Nouvelle', 'New'), value: 'new' },
            { label: l('En cours', 'In progress'), value: 'in-progress' },
            { label: l('Devis envoyé', 'Quote sent'), value: 'quoted' },
            { label: l('Clôturée', 'Closed'), value: 'closed' },
          ],
          admin: { width: '50%' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'firstName',
          label: l('Prénom', 'First name'),
          type: 'text',
          admin: { width: '50%' },
        },
        { name: 'lastName', label: l('Nom', 'Last name'), type: 'text', admin: { width: '50%' } },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'email',
          label: l('E-mail', 'Email'),
          type: 'email',
          required: true,
          admin: { width: '50%' },
        },
        { name: 'phone', label: l('Téléphone', 'Phone'), type: 'text', admin: { width: '50%' } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'company', label: l('Société', 'Company'), type: 'text', admin: { width: '50%' } },
        {
          name: 'profile',
          label: l('Profil', 'Profile'),
          type: 'select',
          options: [
            { label: l('Architecte ou décorateur', 'Architect or designer'), value: 'architect' },
            { label: l('Hôtel ou restaurant', 'Hotel or restaurant'), value: 'hospitality' },
            { label: l('Entreprise', 'Company'), value: 'company' },
            { label: l('Revendeur', 'Reseller'), value: 'reseller' },
            { label: l('Autre', 'Other'), value: 'other' },
          ],
          admin: { width: '50%' },
        },
      ],
    },
    {
      name: 'project',
      label: l('Projet', 'Project'),
      type: 'group',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'placeType',
              label: l('Type de lieu', 'Place type'),
              type: 'text',
              admin: { width: '33%' },
            },
            { name: 'region', label: l('Région', 'Region'), type: 'text', admin: { width: '33%' } },
            {
              name: 'deadline',
              label: l('Échéance', 'Deadline'),
              type: 'text',
              admin: { width: '34%' },
            },
          ],
        },
        {
          name: 'quantities',
          label: l('Quantités estimées', 'Estimated quantities'),
          type: 'text',
        },
        {
          name: 'brands',
          label: l('Fabricants', 'Brands'),
          type: 'relationship',
          relationTo: 'brands',
          hasMany: true,
        },
        {
          name: 'products',
          label: l('Produits', 'Products'),
          type: 'relationship',
          relationTo: 'products',
          hasMany: true,
        },
      ],
    },
    { name: 'message', label: l('Message', 'Message'), type: 'textarea' },
    {
      name: 'attachments',
      label: l('Pièces jointes', 'Attachments'),
      type: 'relationship',
      relationTo: 'documents',
      hasMany: true,
      admin: {
        description: l(
          'Enregistrées avec le niveau d’accès « interne ».',
          'Stored with the “internal” access level.',
        ),
      },
    },
    {
      name: 'appointment',
      label: l('Rendez-vous', 'Appointment'),
      type: 'group',
      admin: { condition: (data) => data?.kind === 'appointment' },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'format',
              label: l('Format', 'Format'),
              type: 'select',
              options: [
                { label: l('Visio (30 min)', 'Video call (30 min)'), value: 'video' },
                { label: l('Showroom (1 h)', 'Showroom (1 h)'), value: 'showroom' },
                {
                  label: l('Visite virtuelle guidée (45 min)', 'Guided virtual tour (45 min)'),
                  value: 'virtual-tour',
                },
                { label: l('Voyage en usine', 'Factory visit'), value: 'factory' },
              ],
              admin: { width: '50%' },
            },
            {
              name: 'member',
              label: l('Avec', 'With'),
              type: 'relationship',
              relationTo: 'team-members',
              admin: { width: '50%' },
            },
          ],
        },
        {
          name: 'startsAt',
          label: l('Date et heure', 'Date and time'),
          type: 'date',
          admin: { date: { pickerAppearance: 'dayAndTime' } },
        },
      ],
    },
    {
      name: 'consent',
      label: l('Consentement RGPD', 'GDPR consent'),
      type: 'checkbox',
      required: true,
      admin: { position: 'sidebar', readOnly: true },
    },
    {
      name: 'newsletter',
      label: l('Inscription aux nouveautés', 'Newsletter opt-in'),
      type: 'checkbox',
      admin: { position: 'sidebar', readOnly: true },
    },
    {
      name: 'sourcePage',
      label: l('Page d’origine', 'Source page'),
      type: 'text',
      admin: { position: 'sidebar', readOnly: true },
    },
    {
      name: 'locale',
      label: l('Langue', 'Language'),
      type: 'text',
      admin: { position: 'sidebar', readOnly: true },
    },
    {
      name: 'zohoId',
      label: l('Identifiant Zoho', 'Zoho ID'),
      type: 'text',
      admin: { position: 'sidebar', readOnly: true },
    },
  ],
}
