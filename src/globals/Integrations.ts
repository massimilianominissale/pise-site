import type { GlobalConfig } from 'payload'

import { isAdmin, isStaff } from '../access'
import { l } from '../collections/shared'

/**
 * Services externes. Les secrets (clés d'API Zoho, agenda…) restent dans les
 * variables d'environnement Vercel, jamais dans la base.
 */
export const Integrations: GlobalConfig = {
  slug: 'integrations',
  label: l('Intégrations', 'Integrations'),
  admin: { group: l('Réglages', 'Settings') },
  access: { read: isStaff, update: isAdmin },
  fields: [
    {
      name: 'mobilia',
      label: l('Générateur de visuels (Mobilia)', 'Visual generator (Mobilia)'),
      type: 'group',
      fields: [
        { name: 'enabled', label: l('Activé', 'Enabled'), type: 'checkbox', defaultValue: false },
        {
          name: 'embedUrl',
          label: l('Adresse de l’outil (iframe)', 'Tool URL (iframe)'),
          type: 'text',
        },
      ],
    },
    {
      name: 'frameOrigins',
      label: l('Domaines autorisés en iframe', 'Allowed iframe origins'),
      type: 'text',
      hasMany: true,
      admin: {
        description: l(
          'Domaines de Mobilia et d’IMRSIVO, par exemple https://visites.imrsivo.com. Repris dans la politique de sécurité du site.',
          'Mobilia and IMRSIVO domains. Used in the site security policy.',
        ),
      },
    },
    {
      name: 'zoho',
      label: l('Zoho', 'Zoho'),
      type: 'group',
      fields: [
        {
          name: 'enabled',
          label: l('Synchronisation activée', 'Sync enabled'),
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'module',
          label: l('Module des conditions commerciales', 'Commercial terms module'),
          type: 'select',
          options: [
            { label: 'CRM', value: 'crm' },
            { label: 'Books', value: 'books' },
            { label: 'Inventory', value: 'inventory' },
          ],
          admin: { description: l('À confirmer avec PISE.', 'To be confirmed with PISE.') },
        },
      ],
    },
    {
      name: 'calendar',
      label: l('Agenda des rendez-vous', 'Appointment calendar'),
      type: 'group',
      fields: [
        {
          name: 'provider',
          label: l('Outil', 'Provider'),
          type: 'select',
          options: [
            { label: l('À choisir', 'To be chosen'), value: 'none' },
            { label: 'Google Calendar', value: 'google' },
            { label: 'Microsoft 365', value: 'microsoft' },
            { label: 'Zoho Bookings', value: 'zoho-bookings' },
            { label: 'Cal.com', value: 'calcom' },
          ],
          defaultValue: 'none',
        },
      ],
    },
    {
      name: 'chatbot',
      label: l('Chatbot', 'Chatbot'),
      type: 'group',
      fields: [
        { name: 'enabled', label: l('Activé', 'Enabled'), type: 'checkbox', defaultValue: false },
      ],
    },
  ],
}
