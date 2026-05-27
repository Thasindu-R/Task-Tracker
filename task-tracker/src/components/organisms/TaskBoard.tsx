'use client'

import * as React from 'react'
import type { Task, Status } from '@/types'
import { TaskCard } from '@/components/molecules/TaskCard'
import { STATUS_LABELS, STATUS_STYLES } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'

export type TaskBoardProps = {
  tasks: Task[]
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
  onStatusChange: (id: string, status: Status) => void
}

const COLUMNS: Status[] = ['TODO', 'IN_PROGRESS', 'DONE']

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function TaskBoard({ tasks, onEdit, onDelete, onStatusChange }: TaskBoardProps) {
  const { user } = useAuth()

  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-start">
      {COLUMNS.map((status) => {
        const columnTasks = tasks.filter((t) => t.status === status)

        return (
          <div key={status} className="flex-1 flex-col gap-4 flex min-w-[300px]">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className={`rounded-full px-3 py-1 text-xs font-semibold border ${STATUS_STYLES[status]}`}>
                  {STATUS_LABELS[status]}
                </span>
                <span className="text-xs font-medium text-slate-500">{columnTasks.length}</span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {columnTasks.length > 0 ? (
                columnTasks.map((task) => (
                  <div key={task.id}>
                    <TaskCard
                      task={task}
                      user={user}
                      onEdit={onEdit}
                      onDelete={(t) => onDelete(t.id)}
                    />
                  </div>
                ))
              ) : (
                <div className="flex h-32 items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 text-sm text-slate-500">
                  No tasks here yet
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
