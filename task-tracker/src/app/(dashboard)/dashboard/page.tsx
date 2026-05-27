'use client'

import { DashboardLayout } from '@/components/templates/DashboardLayout'
import { DashboardStats } from '@/components/organisms/DashboardStats'
import { TaskCard } from '@/components/molecules/TaskCard'
import { useTasksQuery } from '@/hooks/useTasks'
import type { Task } from '@/types'

export default function DashboardPage() {
  const { data } = useTasksQuery({ sortBy: 'createdAt', sortOrder: 'desc' })
  const recentTasks: Task[] = (data ?? []).slice(0, 3)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <DashboardStats />
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent tasks</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {recentTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </section>
      </div>
    </DashboardLayout>
  )
}
