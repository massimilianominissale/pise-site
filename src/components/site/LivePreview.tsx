'use client'

import { RefreshRouteOnSave } from '@payloadcms/live-preview-react'
import { usePathname, useRouter } from 'next/navigation'
import { useSyncExternalStore } from 'react'

const noSubscription = () => () => {}

/**
 * Mode aperçu : bandeau « Aperçu des brouillons » et rafraîchissement de la page à chaque
 * enregistrement dans l'administration (aperçu en direct de Payload).
 */
export function LivePreview({ label, exitLabel }: { label: string; exitLabel: string }) {
  const router = useRouter()
  const pathname = usePathname()
  // L'administration et le site partagent la même adresse : c'est l'origine des messages.
  const origin = useSyncExternalStore(
    noSubscription,
    () => window.location.origin,
    () => null,
  )
  // Dans le volet d'aperçu de l'administration, pas de bandeau.
  const embedded = useSyncExternalStore(
    noSubscription,
    () => window.self !== window.top,
    () => true,
  )

  return (
    <>
      {origin ? <RefreshRouteOnSave refresh={() => router.refresh()} serverURL={origin} /> : null}
      {embedded ? null : (
        <div className="preview-bar" role="status">
          <span>{label}</span>
          <a href={`/next/exit-preview?path=${encodeURIComponent(pathname ?? '/')}`}>{exitLabel}</a>
        </div>
      )}
    </>
  )
}
