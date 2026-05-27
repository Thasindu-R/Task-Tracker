'use client'

import * as React from 'react'
import { Flame, Minus, TrendingDown, TrendingUp } from 'lucide-react'
import { Badge } from '@/components/atoms/Badge'
import type { Priority } from '@/types'

const priorityIcon: Record<Priority, React.ReactElement> = {
  LOW: <TrendingDown className="h-3.5 w-3.5" aria-hidden="true" />,
  MEDIUM: <Minus className="h-3.5 w-3.5" aria-hidden="true" />,
  HIGH: <TrendingUp className="h-3.5 w-3.5" aria-hidden="true" />,
  URGENT: <Flame className="h-3.5 w-3.5" aria-hidden="true" />,
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <Badge priority={priority} className="gap-1">
      {priorityIcon[priority]}
      <span>{priority}</span>
    </Badge>
  )
}
