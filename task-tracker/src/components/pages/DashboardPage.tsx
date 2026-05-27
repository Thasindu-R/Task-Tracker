'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/templates/DashboardLayout'
import { DashboardStats } from '@/components/organisms/DashboardStats'
import { TaskForm } from '@/components/organisms/TaskForm'
import { Button } from '@/components/atoms/Button'
import { useTasksQuery } from '@/hooks/useTasks'
import { useAuth } from '@/hooks/useAuth'
import { isOverdue } from '@/lib/utils'

export function DashboardPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const { data: tasks, isLoading } = useTasksQuery({}, { enabled: !!user })
  const [isFormOpen, setIsFormOpen] = React.useState(false)

  const stats = React.useMemo(() => {
    if (!tasks) return { todo: 0, inProgress: 0, done: 0, overdue: 0 }
    return {
      todo: tasks.filter((t) => t.status === 'TODO').length,
      inProgress: tasks.filter((t) => t.status === 'IN_PROGRESS').length,
      done: tasks.filter((t) => t.status === 'DONE').length,
      overdue: tasks.filter((t) => isOverdue(t.dueDate, t.status)).length,
    }
  }, [tasks])

  const overdueTasks = React.useMemo(() => {
    if (!tasks) return []
    return tasks.filter((t) => isOverdue(t.dueDate, t.status))
  }, [tasks])

  React.useEffect(() => {
    if (!loading && !user) {
      router.replace('/login')
    }
  }, [loading, router, user])

  if (loading || !user) {
    return (
      <DashboardLayout>
        <div className="flex flex-1 items-center justify-center text-sm text-slate-500">
          Loading dashboard...
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-sm text-slate-500">
              Welcome back! Here&apos;s an overview of your tasks.
            </p>
          </div>
          <Button
            onClick={() => setIsFormOpen(true)}
            className="bg-violet-600 hover:bg-violet-700 text-white"
          >
            New Task
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-28 rounded-xl bg-slate-100 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <DashboardStats stats={stats} overdueTasks={overdueTasks} />
        )}

        {isFormOpen && (
          <TaskForm onClose={() => setIsFormOpen(false)} onSuccess={() => {}} />
        )}
      </div>
    </DashboardLayout>
  )
}
