'use client'

import { useState } from 'react'

type Props = {
  value: string
  label: string
  doneLabel: string
  className?: string
  /** Sur mobile : ouvre le partage du téléphone quand il existe, sinon copie. */
  share?: { title: string }
  children?: React.ReactNode
}

/** Copie un lien (ou le partage sur mobile) et le confirme quelques secondes. */
export function CopyButton({ value, label, doneLabel, className, share, children }: Props) {
  const [done, setDone] = useState(false)

  const onClick = async () => {
    try {
      if (share && typeof navigator.share === 'function') {
        await navigator.share({ title: share.title, url: value })
        return
      }
      await navigator.clipboard.writeText(value)
      setDone(true)
      window.setTimeout(() => setDone(false), 2400)
    } catch {
      // Partage annulé ou presse-papiers refusé : rien à signaler.
    }
  }

  return (
    <button type="button" className={className} onClick={onClick} aria-label={label}>
      {children ?? (done ? doneLabel : label)}
      <span className="sr-only" aria-live="polite">
        {done ? doneLabel : ''}
      </span>
    </button>
  )
}
