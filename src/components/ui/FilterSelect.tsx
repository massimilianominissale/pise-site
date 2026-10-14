'use client'

import { useRouter } from 'next/navigation'

type Props = {
  label: string
  value: string
  /** Valeur → adresse de la page filtrée (calculée côté serveur). */
  options: { value: string; label: string; href: string }[]
}

/** Liste déroulante de filtre : choisir une valeur charge la page filtrée. */
export function FilterSelect({ label, value, options }: Props) {
  const router = useRouter()
  return (
    <select
      className="select"
      aria-label={label}
      value={value}
      onChange={(e) => {
        const option = options.find((o) => o.value === e.target.value)
        if (option) router.push(option.href, { scroll: false })
      }}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
}
