'use client'

import { STATUSES } from '@/types'
import { useTasksQuery } from '@/hooks/useTasks'

export function DashboardStats() {
  const { data } = useTasksQuery({})
  const tasks = data ?? []

  const total = tasks.length
  const done = tasks.filter((task) => task.status === 'DONE').length
  const completionRate = total > 0 ? Math.round((done / total) * 100) : 0

  const counts = STATUSES.reduce(
    (acc, status) => {
      acc[status] = tasks.filter((task) => task.status === status).length
      return acc
    },
    {} as Record<string, number>,
  )

  return (
    <section className="grid gap-4 md:grid-cols-3">
      <div className="rounded-2xl border border-border bg-card p-4">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          Total tasks
        </p>
        <p className="mt-2 text-2xl font-semibold">{total}</p>
      </div>
      <div className="rounded-2xl border border-border bg-card p-4">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          Completion rate
        </p>
        <p className="mt-2 text-2xl font-semibold">{completionRate}%</p>
      </div>
      <div className="rounded-2xl border border-border bg-card p-4">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          In progress
        </p>
        <p className="mt-2 text-2xl font-semibold">{counts.IN_PROGRESS ?? 0}</p>
      </div>
    </section>
  )
}
