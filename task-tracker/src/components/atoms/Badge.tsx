'use client'

import * as React from 'react'
import { cn, getPriorityColor } from '@/lib/utils'
import type { Priority, Status } from '@/types'

const statusColors: Record<Status, string> = {
  TODO: 'bg-slate-100 text-slate-700',
  IN_PROGRESS: 'bg-blue-100 text-blue-700',
  DONE: 'bg-emerald-100 text-emerald-700',
  CANCELLED: 'bg-rose-100 text-rose-700',
}

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  priority?: Priority
  status?: Status
}

export function Badge({
  priority,
  status,
  className,
  children,
  ...props
}: BadgeProps) {
  const colorClass = priority
    ? getPriorityColor(priority)
    : status
      ? statusColors[status]
      : 'bg-muted text-muted-foreground'

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold',
        colorClass,
        className,
      )}
      {...props}
    >
      {children}
    </span>
  )
}
