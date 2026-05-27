import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format } from 'date-fns'
import type { Priority } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date | null) {
  if (!date) return ''
  const parsed = typeof date === 'string' ? new Date(date) : date
  return format(parsed, 'MMM d, yyyy')
}

export function getPriorityColor(priority: Priority) {
  const map: Record<Priority, string> = {
    LOW: 'bg-emerald-100 text-emerald-700',
    MEDIUM: 'bg-amber-100 text-amber-700',
    HIGH: 'bg-orange-100 text-orange-700',
    URGENT: 'bg-rose-100 text-rose-700',
  }

  return map[priority]
}
