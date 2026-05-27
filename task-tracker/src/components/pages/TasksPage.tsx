'use client'

import * as React from 'react'
import { DashboardLayout } from '@/components/templates/DashboardLayout'
import { TaskBoard } from '@/components/organisms/TaskBoard'
import { TaskForm } from '@/components/organisms/TaskForm'
import { SearchBar } from '@/components/molecules/SearchBar'
import { Button } from '@/components/atoms/Button'
import { useTasksQuery, useDeleteTask, useUpdateTask } from '@/hooks/useTasks'
import type { Task, Status } from '@/types'
import { useQueryClient } from '@tanstack/react-query'

export function TasksPage() {
  const { data: tasks, isLoading } = useTasksQuery({})
  const { mutate: deleteTask } = useDeleteTask()
  const { mutate: updateTask } = useUpdateTask()
  const queryClient = useQueryClient()

  const [searchQuery, setSearchQuery] = React.useState('')
  const [formTask, setFormTask] = React.useState<Task | undefined>(undefined)
  const [isFormOpen, setIsFormOpen] = React.useState(false)

  const filteredTasks = React.useMemo(() => {
    if (!tasks) return []
    if (!searchQuery) return tasks
    return tasks.filter((t) => t.title.toLowerCase().includes(searchQuery.toLowerCase()))
  }, [tasks, searchQuery])

  const handleEdit = (task: Task) => {
    setFormTask(task)
    setIsFormOpen(true)
  }

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTask({ id })
    }
  }

  const handleStatusChange = (id: string, status: Status) => {
    updateTask({ id, data: { status } })
  }

  const handleOpenCreate = () => {
    setFormTask(undefined)
    setIsFormOpen(true)
  }

  const handleFormSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['tasks'] })
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 flex-1 min-h-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Tasks</h1>
            <p className="text-sm text-slate-500">Manage your tasks across different stages.</p>
          </div>
          <Button onClick={handleOpenCreate} className="bg-violet-600 hover:bg-violet-700 text-white">
            New Task
          </Button>
        </div>

        <div className="w-full max-w-md">
          <SearchBar onSearch={setSearchQuery} placeholder="Search tasks..." />
        </div>

        {isLoading ? (
          <div className="flex gap-6 h-[500px]">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex-1 rounded-xl bg-slate-100 animate-pulse" />
            ))}
          </div>
        ) : (
          <TaskBoard
            tasks={filteredTasks}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onStatusChange={handleStatusChange}
          />
        )}

        {isFormOpen && (
          <TaskForm 
            task={formTask} 
            onClose={() => setIsFormOpen(false)} 
            onSuccess={handleFormSuccess} 
          />
        )}
      </div>
    </DashboardLayout>
  )
}
