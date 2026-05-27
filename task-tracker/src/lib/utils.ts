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

export function isOverdue(dueDate: string | null, status: string) {
  if (!dueDate || status === 'DONE' || status === 'CANCELLED') return false
  return new Date(dueDate) < new Date()
}

export const STATUS_LABELS: Record<string, string> = {
  TODO: 'To Do',
  IN_PROGRESS: 'In Progress',
  DONE: 'Done',
  CANCELLED: 'Cancelled',
}

export const PRIORITY_LABELS: Record<Priority, string> = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
  URGENT: 'Urgent',
}

export const STATUS_STYLES: Record<string, string> = {
  TODO: 'bg-slate-100 text-slate-700 border-slate-200',
  IN_PROGRESS: 'bg-blue-100 text-blue-700 border-blue-200',
  DONE: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  CANCELLED: 'bg-neutral-100 text-neutral-700 border-neutral-200',
}

export const PRIORITY_STYLES: Record<Priority, string> = {
  LOW: 'bg-emerald-100 text-emerald-700',
  MEDIUM: 'bg-amber-100 text-amber-700',
  HIGH: 'bg-orange-100 text-orange-700',
  URGENT: 'bg-rose-100 text-rose-700',
}
