import '@fontsource-variable/archivo'
import '@fontsource-variable/hanken-grotesk'
import type { Metadata } from 'next'
import React from 'react'

import './styles.css'

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SERVER_URL ||
      (process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        : 'http://localhost:3000'),
  ),
  title: {
    default: 'Agence PISE',
    template: '%s · Agence PISE',
  },
  description:
    "Mobilier et luminaires européens pour l'hôtellerie, la restauration, les bureaux et l'outdoor.",
  // Le site n'est pas encore lancé : rien ne doit être indexé tant que le domaine n'a pas basculé.
  robots: { index: false, follow: false },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}
