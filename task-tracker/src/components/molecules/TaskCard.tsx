'use client'

import { Calendar, Pencil, Trash2 } from 'lucide-react'
import { Badge } from '@/components/atoms/Badge'
import { Button } from '@/components/atoms/Button'
import { Avatar } from '@/components/atoms/Avatar'
import { PriorityBadge } from '@/components/molecules/PriorityBadge'
import { formatDate } from '@/lib/utils'
import type { Task, User } from '@/types'

export type TaskCardProps = {
  task: Task
  user?: User | null
  onEdit?: (task: Task) => void
  onDelete?: (task: Task) => void
}

export function TaskCard({ task, user, onEdit, onDelete }: TaskCardProps) {
  return (
    <article className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-foreground">
            {task.title}
          </h3>
          {task.description ? (
            <p className="text-xs text-muted-foreground">{task.description}</p>
          ) : null}
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit?.(task)}
            aria-label={`Edit ${task.title}`}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete?.(task)}
            aria-label={`Delete ${task.title}`}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <PriorityBadge priority={task.priority} />
        <Badge status={task.status}>{task.status.replace('_', ' ')}</Badge>
        {task.dueDate ? (
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
            {formatDate(task.dueDate)}
          </span>
        ) : null}
      </div>

      <div className="flex items-center gap-2">
        <Avatar src={user?.avatarUrl} name={user?.name} email={user?.email} />
        <div className="text-xs text-muted-foreground">
          {user?.name ?? user?.email ?? 'You'}
        </div>
      </div>
    </article>
  )
}
