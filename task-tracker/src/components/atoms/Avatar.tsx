'use client'

import * as React from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

export type AvatarProps = {
  src?: string | null
  name?: string | null
  email?: string | null
  size?: number
  className?: string
}

function getInitials(name?: string | null, email?: string | null) {
  if (name) {
    const parts = name.trim().split(' ')
    const first = parts[0]?.[0] ?? ''
    const last = parts[1]?.[0] ?? ''
    return `${first}${last}`.toUpperCase()
  }
  if (email) return email.slice(0, 2).toUpperCase()
  return '?'
}

export function Avatar({
  src,
  name,
  email,
  size = 36,
  className,
}: AvatarProps) {
  const initials = getInitials(name, email)

  return (
    <div
      className={cn(
        'inline-flex items-center justify-center overflow-hidden rounded-full bg-muted text-sm font-semibold text-muted-foreground',
        className,
      )}
      style={{ width: size, height: size }}
      aria-label={name ?? email ?? 'User avatar'}
    >
      {src ? (
        <Image
          src={src}
          alt={name ?? email ?? 'User'}
          width={size}
          height={size}
          className="h-full w-full object-cover"
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  )
}
