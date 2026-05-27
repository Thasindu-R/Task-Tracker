'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X } from 'lucide-react'
import { FormField } from '@/components/molecules/FormField'
import { Button } from '@/components/atoms/Button'
import { useCreateTask, useUpdateTask } from '@/hooks/useTasks'
import type { Task, Priority } from '@/types'
import { PRIORITY_LABELS, STATUS_LABELS } from '@/lib/utils'

export type TaskFormProps = {
  task?: Task
  onClose: () => void
  onSuccess: () => void
}

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title is too long'),
  description: z.string().max(500, 'Description is too long').optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
  status: z.enum(['TODO', 'IN_PROGRESS', 'DONE', 'CANCELLED']),
  dueDate: z.string().optional().nullable(),
})

type TaskFormValues = z.infer<typeof taskSchema>

export function TaskForm({ task, onClose, onSuccess }: TaskFormProps) {
  const [error, setError] = React.useState<string | null>(null)
  const isEditMode = !!task

  const { mutateAsync: createTask } = useCreateTask()
  const { mutateAsync: updateTask } = useUpdateTask()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: task?.title ?? '',
      description: task?.description ?? '',
      priority: task?.priority ?? 'MEDIUM',
      status: task?.status ?? 'TODO',
      dueDate: task?.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
    },
  })

  const onSubmit = async (data: TaskFormValues) => {
    setError(null)
    try {
      const payload = {
        ...data,
        dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : null,
      }

      if (isEditMode) {
        await updateTask({ id: task.id, data: payload })
      } else {
        await createTask(payload)
      }
      onSuccess()
      onClose()
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Failed to save task')
      } else {
        setError('Failed to save task')
      }
    }
  }

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-0 sm:p-4 backdrop-blur-sm">
      <div className="relative flex h-full w-full flex-col bg-white shadow-xl sm:h-auto sm:max-w-lg sm:rounded-2xl">
        <div className="flex items-center justify-between border-b border-border px-4 py-4 sm:border-none sm:px-6 sm:pb-0 sm:pt-6">
          <h2 className="text-xl font-semibold text-slate-900">
            {isEditMode ? 'Edit Task' : 'New Task'}
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 sm:absolute sm:right-4 sm:top-4"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6">

        {error ? (
          <div className="mb-4 rounded-lg bg-rose-50 p-3 text-sm text-rose-600">
            {error}
          </div>
        ) : null}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 flex flex-col">
          <FormField
            label="Title"
            {...register('title')}
            error={errors.title?.message}
            placeholder="What needs to be done?"
          />

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium leading-none text-foreground">Description</label>
            <textarea
              {...register('description')}
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm transition-shadow placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20"
              placeholder="Add some details..."
            />
            {errors.description?.message ? (
              <p className="text-xs text-rose-500">{errors.description.message}</p>
            ) : null}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium leading-none text-foreground">Priority</label>
              <select
                {...register('priority')}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20"
              >
                {['LOW', 'MEDIUM', 'HIGH', 'URGENT'].map((p) => (
                  <option key={p} value={p}>{PRIORITY_LABELS[p as Priority]}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium leading-none text-foreground">Status</label>
              <select
                {...register('status')}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20"
              >
                {['TODO', 'IN_PROGRESS', 'DONE', 'CANCELLED'].map((s) => (
                  <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                ))}
              </select>
            </div>
          </div>

          <FormField
            label="Due Date"
            type="date"
            {...register('dueDate')}
            error={errors.dueDate?.message}
          />

          <div className="mt-6 flex justify-end gap-3 sm:pb-6">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting} className="bg-violet-600 hover:bg-violet-700 text-white">
              {isEditMode ? 'Save Changes' : 'Create Task'}
            </Button>
          </div>
        </form>
        </div>
      </div>
    </div>
  )
}
