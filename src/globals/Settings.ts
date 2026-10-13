import type { GlobalConfig } from 'payload'

import { isAdmin } from '../access'
import { l } from '../collections/shared'

/** Réglages généraux : identité de l'agence, coordonnées, réseaux, politique des robots IA. */
export const Settings: GlobalConfig = {
  slug: 'settings',
  label: l('Réglages généraux', 'General settings'),
  admin: { group: l('Réglages', 'Settings') },
  access: { read: () => true, update: isAdmin },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: l('Identité', 'Identity'),
          fields: [
            {
              name: 'siteName',
              label: l('Nom du site', 'Site name'),
              type: 'text',
              defaultValue: 'Agence PISE',
              required: true,
            },
            {
              name: 'description',
              label: l('Description de l’agence', 'Agency description'),
              type: 'textarea',
              localized: true,
              admin: {
                description: l(
                  'Reprise dans les données structurées, le fichier llms.txt et les moteurs IA. Même texte partout (site, Google, LinkedIn).',
                  'Used in structured data, llms.txt and AI engines.',
                ),
              },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'legalName',
                  label: l('Raison sociale', 'Legal name'),
                  type: 'text',
                  admin: { width: '50%' },
                },
                {
                  name: 'foundingYear',
                  label: l('Année de création', 'Founded'),
                  type: 'number',
                  admin: { width: '50%' },
                },
              ],
            },
            {
              name: 'defaultShareImage',
              label: l('Image de partage par défaut', 'Default share image'),
              type: 'upload',
              relationTo: 'media',
            },
          ],
        },
        {
          label: l('Coordonnées', 'Contact'),
          fields: [
            {
              name: 'contact',
              label: l('Coordonnées', 'Contact details'),
              type: 'group',
              fields: [
                { name: 'street', label: l('Adresse', 'Address'), type: 'text' },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'postalCode',
                      label: l('Code postal', 'Postcode'),
                      type: 'text',
                      admin: { width: '30%' },
                    },
                    {
                      name: 'city',
                      label: l('Ville', 'City'),
                      type: 'text',
                      admin: { width: '70%' },
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'phone',
                      label: l('Téléphone', 'Phone'),
                      type: 'text',
                      admin: { width: '50%' },
                    },
                    {
                      name: 'email',
                      label: l('E-mail', 'Email'),
                      type: 'email',
                      admin: { width: '50%' },
                    },
                  ],
                },
                {
                  name: 'responseTime',
                  label: l('Délai de réponse annoncé', 'Stated response time'),
                  type: 'text',
                  localized: true,
                  defaultValue: '24 h ouvrées',
                },
              ],
            },
            {
              name: 'socials',
              label: l('Réseaux sociaux', 'Social networks'),
              type: 'array',
              labels: { singular: l('Réseau', 'Network'), plural: l('Réseaux', 'Networks') },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'network',
                      label: l('Réseau', 'Network'),
                      type: 'select',
                      required: true,
                      options: ['instagram', 'linkedin', 'youtube', 'pinterest', 'facebook'].map(
                        (v) => ({
                          value: v,
                          label: v.charAt(0).toUpperCase() + v.slice(1),
                        }),
                      ),
                      admin: { width: '30%' },
                    },
                    {
                      name: 'url',
                      label: l('Adresse', 'URL'),
                      type: 'text',
                      required: true,
                      admin: { width: '70%' },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: l('Robots et IA', 'Robots and AI'),
          fields: [
            {
              name: 'allowAiSearchBots',
              label: l('Autoriser les robots de recherche IA', 'Allow AI search crawlers'),
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: l(
                  'OAI-SearchBot, PerplexityBot, Claude-SearchBot…',
                  'OAI-SearchBot, PerplexityBot, Claude-SearchBot…',
                ),
              },
            },
            {
              name: 'allowAiTrainingBots',
              label: l('Autoriser les robots d’entraînement IA', 'Allow AI training crawlers'),
              type: 'checkbox',
              defaultValue: false,
              admin: {
                description: l(
                  'GPTBot, ClaudeBot, Google-Extended… À décider avec PISE.',
                  'GPTBot, ClaudeBot, Google-Extended…',
                ),
              },
            },
          ],
        },
      ],
    },
  ],
}
