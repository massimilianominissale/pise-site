'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export type NavItem = { href: string; label: string; newTab?: boolean }

const isActive = (pathname: string, href: string) =>
  href !== '/' && !/^https?:/.test(href) && (pathname === href || pathname.startsWith(href + '/'))

/** Entrées du menu, avec la rubrique courante signalée (aria-current). */
export function NavLinks({ items, className }: { items: NavItem[]; className?: string }) {
  const pathname = usePathname() ?? '/'
  return (
    <ul className={className}>
      {items.map((item) => (
        <li key={item.href + item.label}>
          <Link
            href={item.href}
            aria-current={isActive(pathname, item.href) ? 'page' : undefined}
            {...(item.newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          >
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  )
}
