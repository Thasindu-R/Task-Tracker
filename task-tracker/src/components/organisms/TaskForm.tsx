'use client'

import * as React from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/atoms/Button'
import { FormField } from '@/components/molecules/FormField'
import { cn } from '@/lib/utils'
import { PRIORITIES, STATUSES, type Task } from '@/types'
import { useCreateTask, useUpdateTask } from '@/hooks/useTasks'

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  priority: z.enum(PRIORITIES),
  status: z.enum(STATUSES),
  dueDate: z.string().optional(),
})

type TaskFormValues = z.infer<typeof taskSchema>

export type TaskFormProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  task?: Task | null
}

export function TaskForm({ open, onOpenChange, task }: TaskFormProps) {
  const createTask = useCreateTask()
  const updateTask = useUpdateTask()

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: task?.title ?? '',
      description: task?.description ?? '',
      priority: task?.priority ?? 'MEDIUM',
      status: task?.status ?? 'TODO',
      dueDate: task?.dueDate ? task.dueDate.slice(0, 10) : '',
    },
  })

  React.useEffect(() => {
    form.reset({
      title: task?.title ?? '',
      description: task?.description ?? '',
      priority: task?.priority ?? 'MEDIUM',
      status: task?.status ?? 'TODO',
      dueDate: task?.dueDate ? task.dueDate.slice(0, 10) : '',
    })
  }, [task, form])

  const onSubmit = async (values: TaskFormValues) => {
    const payload = {
      ...values,
      dueDate: values.dueDate ? new Date(values.dueDate).toISOString() : null,
    }

    if (task) {
      await updateTask.mutateAsync({ id: task.id, data: payload })
    } else {
      await createTask.mutateAsync(payload)
    }

    onOpenChange(false)
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40" />
        <Dialog.Content
          className={cn(
            'fixed left-1/2 top-1/2 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-background p-6 shadow-lg',
          )}
        >
          <Dialog.Title className="text-lg font-semibold">
            {task ? 'Edit task' : 'Create task'}
          </Dialog.Title>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-4 flex flex-col gap-4"
          >
            <FormField
              label="Title"
              name="title"
              placeholder="Write a task title"
              error={form.formState.errors.title?.message}
              {...form.register('title')}
            />
            <FormField
              label="Description"
              name="description"
              placeholder="Optional details"
              error={form.formState.errors.description?.message}
              {...form.register('description')}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium" htmlFor="priority">
                  Priority
                </label>
                <select
                  id="priority"
                  className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                  {...form.register('priority')}
                >
                  {PRIORITIES.map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium" htmlFor="status">
                  Status
                </label>
                <select
                  id="status"
                  className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                  {...form.register('status')}
                >
                  {STATUSES.map((value) => (
                    <option key={value} value={value}>
                      {value.replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <FormField
              label="Due date"
              name="dueDate"
              type="date"
              error={form.formState.errors.dueDate?.message}
              {...form.register('dueDate')}
            />

            <div className="flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" isLoading={form.formState.isSubmitting}>
                {task ? 'Save' : 'Create'}
              </Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
