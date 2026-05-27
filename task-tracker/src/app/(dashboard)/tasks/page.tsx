'use client'

import * as React from 'react'
import { DashboardLayout } from '@/components/templates/DashboardLayout'
import { TaskBoard } from '@/components/organisms/TaskBoard'
import { TaskForm } from '@/components/organisms/TaskForm'
import { SearchBar } from '@/components/molecules/SearchBar'
import { Button } from '@/components/atoms/Button'
import {
  PRIORITIES,
  STATUSES,
  type Priority,
  type Status,
  type Task,
} from '@/types'

export default function TasksPage() {
  const [search, setSearch] = React.useState('')
  const [status, setStatus] = React.useState<Status | ''>('')
  const [priority, setPriority] = React.useState<Priority | ''>('')
  const [open, setOpen] = React.useState(false)
  const [editingTask, setEditingTask] = React.useState<Task | null>(null)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <SearchBar onSearch={setSearch} />
          <Button
            onClick={() => {
              setEditingTask(null)
              setOpen(true)
            }}
          >
            New task
          </Button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <select
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
            value={status}
            onChange={(event) => setStatus(event.target.value as Status | '')}
          >
            <option value="">All statuses</option>
            {STATUSES.map((value) => (
              <option key={value} value={value}>
                {value.replace('_', ' ')}
              </option>
            ))}
          </select>
          <select
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
            value={priority}
            onChange={(event) =>
              setPriority(event.target.value as Priority | '')
            }
          >
            <option value="">All priorities</option>
            {PRIORITIES.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>

        <TaskBoard
          status={status || undefined}
          priority={priority || undefined}
          search={search}
          onEdit={(task) => {
            setEditingTask(task)
            setOpen(true)
          }}
        />
      </div>

      <TaskForm open={open} onOpenChange={setOpen} task={editingTask} />
    </DashboardLayout>
  )
}
