'use client'

import * as React from 'react'
import { ClipboardList, Loader2, CheckCircle2, AlertCircle, Calendar } from 'lucide-react'
import type { Task } from '@/types'
import { formatDate } from '@/lib/utils'

export type DashboardStatsProps = {
  stats: {
    todo: number
    inProgress: number
    done: number
    overdue: number
  }
  overdueTasks: Task[]
}

export function DashboardStats({ stats, overdueTasks }: DashboardStatsProps) {
  const cards = [
    {
      label: 'To Do',
      value: stats.todo,
      icon: ClipboardList,
      color: 'text-slate-600',
      bgColor: 'bg-slate-100',
    },
    {
      label: 'In Progress',
      value: stats.inProgress,
      icon: Loader2,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      label: 'Done',
      value: stats.done,
      icon: CheckCircle2,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100',
    },
    {
      label: 'Overdue',
      value: stats.overdue,
      icon: AlertCircle,
      color: 'text-rose-600',
      bgColor: 'bg-rose-100',
    },
  ]

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="flex flex-col gap-3 rounded-xl border border-border bg-white p-4 shadow-sm sm:p-5 overflow-hidden">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className={`flex h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0 items-center justify-center rounded-lg ${card.bgColor} ${card.color}`}>
                <card.icon className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
              </div>
              <h3 className="truncate text-xs font-medium text-slate-600 sm:text-sm">{card.label}</h3>
            </div>
            <p className="truncate text-2xl font-bold text-slate-900 sm:text-3xl">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-slate-900">Overdue Tasks</h3>
        {overdueTasks.length > 0 ? (
          <ul className="divide-y divide-border">
            {overdueTasks.map((task) => (
              <li key={task.id} className="flex items-center justify-between py-3">
                <span className="font-medium text-slate-700">{task.title}</span>
                <span className="inline-flex items-center gap-1 text-sm text-rose-600">
                  <Calendar className="h-4 w-4" aria-hidden="true" />
                  {formatDate(task.dueDate)}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex items-center justify-center rounded-lg border border-dashed border-emerald-200 bg-emerald-50 p-8 text-emerald-700">
            No overdue tasks 🎉
          </div>
        )}
      </div>
    </div>
  )
}
