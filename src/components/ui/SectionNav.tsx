'use client'

import { useEffect, useState } from 'react'

type Item = { id: string; label: string }

/** Sommaire collant d'une page longue ; la section visible est signalée (aria-current). */
export function SectionNav({ items, label }: { items: Item[]; label: string }) {
  const [current, setCurrent] = useState(items[0]?.id)

  useEffect(() => {
    const sections = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => Boolean(el))
    if (!sections.length || !('IntersectionObserver' in window)) return
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setCurrent(visible[0].target.id)
      },
      { rootMargin: '-160px 0px -55% 0px' },
    )
    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [items])

  return (
    <nav aria-label={label} className="section-nav">
      <ul className="pise-nav container section-nav__list">
        {items.map((item) => (
          <li key={item.id}>
            <a href={`#${item.id}`} aria-current={current === item.id ? 'true' : undefined}>
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
