'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const links = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/tasks', label: 'Tasks' },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden w-60 flex-col border-r border-border bg-background p-6 lg:flex">
      <div className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        Workspace
      </div>
      <nav className="mt-6 flex flex-col gap-2">
        {links.map((link) => {
          const active = pathname === link.href
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                active
                  ? 'bg-foreground text-background'
                  : 'text-muted-foreground hover:bg-muted',
              )}
            >
              {link.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
