'use client'

import * as React from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/atoms/Button'
import { Avatar } from '@/components/atoms/Avatar'

export function Navbar() {
  const { user, logout } = useAuth()

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border bg-white px-4 md:px-6">
      <div className="flex items-center gap-2">
        <h1 className="text-xl font-bold tracking-tight text-violet-600">TaskTracker</h1>
      </div>
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <div className="flex items-center gap-2">
              <span className="hidden text-sm font-medium text-slate-700 sm:block">
                {user.name ?? user.email}
              </span>
              <Avatar src={user.avatarUrl} name={user.name} email={user.email} size={32} />
            </div>
            <Button variant="ghost" size="sm" onClick={() => logout()}>
              Sign out
            </Button>
          </>
        ) : null}
      </div>
    </header>
  )
}
