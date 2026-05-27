'use client'

import * as React from 'react'
import {
  DndContext,
  type DragEndEvent,
  useDraggable,
  useDroppable,
} from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import type { Priority, Status, Task } from '@/types'
import { STATUSES } from '@/types'
import { TaskCard } from '@/components/molecules/TaskCard'
import { useDeleteTask, useTasksQuery, useUpdateTask } from '@/hooks/useTasks'

export type TaskBoardProps = {
  status?: Status
  priority?: Priority
  search?: string
  onEdit?: (task: Task) => void
}

function Column({
  id,
  title,
  children,
}: {
  id: Status
  title: string
  children: React.ReactNode
}) {
  const { isOver, setNodeRef } = useDroppable({ id })

  return (
    <section
      ref={setNodeRef}
      className={
        'flex min-h-[220px] flex-col gap-3 rounded-2xl border border-border bg-muted/40 p-4 transition-colors ' +
        (isOver ? 'bg-muted' : '')
      }
    >
      <header className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      </header>
      <div className="flex flex-1 flex-col gap-3">{children}</div>
    </section>
  )
}

function DraggableTask({
  task,
  onEdit,
  onDelete,
}: {
  task: Task
  onEdit?: (task: Task) => void
  onDelete?: (task: Task) => void
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: task.id,
      data: { status: task.status },
    })

  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.7 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TaskCard task={task} onEdit={onEdit} onDelete={onDelete} />
    </div>
  )
}

export function TaskBoard({
  status,
  priority,
  search,
  onEdit,
}: TaskBoardProps) {
  const { data } = useTasksQuery({ status, priority })
  const updateTask = useUpdateTask()
  const deleteTask = useDeleteTask()

  const tasks = React.useMemo(() => {
    if (!data) return []
    if (!search) return data
    const lowered = search.toLowerCase()
    return data.filter(
      (task) =>
        task.title.toLowerCase().includes(lowered) ||
        (task.description ?? '').toLowerCase().includes(lowered),
    )
  }, [data, search])

  const grouped = React.useMemo(() => {
    return STATUSES.reduce(
      (acc, current) => {
        acc[current] = tasks.filter((task) => task.status === current)
        return acc
      },
      {} as Record<Status, Task[]>,
    )
  }, [tasks])

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over) return

    const newStatus = over.id as Status
    const task = tasks.find((item) => item.id === active.id)
    if (!task || task.status === newStatus) return

    updateTask.mutate({
      id: task.id,
      data: { status: newStatus },
    })
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="grid gap-4 lg:grid-cols-4">
        {STATUSES.map((current) => (
          <Column key={current} id={current} title={current.replace('_', ' ')}>
            {grouped[current]?.map((task) => (
              <DraggableTask
                key={task.id}
                task={task}
                onEdit={onEdit}
                onDelete={(item) => deleteTask.mutate({ id: item.id })}
              />
            ))}
          </Column>
        ))}
      </div>
    </DndContext>
  )
}
