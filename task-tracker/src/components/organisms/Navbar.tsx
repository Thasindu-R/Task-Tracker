'use client'

import Link from 'next/link'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { LogOut } from 'lucide-react'
import { Avatar } from '@/components/atoms/Avatar'
import { Button } from '@/components/atoms/Button'
import { useAuth } from '@/hooks/useAuth'

export function Navbar() {
  const { user, logout } = useAuth()

  return (
    <header className="flex items-center justify-between border-b border-border bg-background px-6 py-4">
      <Link href="/dashboard" className="text-lg font-semibold">
        Task Tracker
      </Link>

      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <Button variant="ghost" className="gap-2">
            <Avatar
              src={user?.avatarUrl}
              name={user?.name}
              email={user?.email}
              size={32}
            />
            <span className="text-sm">
              {user?.name ?? user?.email ?? 'Account'}
            </span>
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content
          align="end"
          className="z-50 mt-2 w-48 rounded-md border border-border bg-background p-2 shadow-md"
        >
          <DropdownMenu.Item asChild>
            <button
              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted"
              onClick={logout}
            >
              <LogOut className="h-4 w-4" />
              Log out
            </button>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </header>
  )
}
