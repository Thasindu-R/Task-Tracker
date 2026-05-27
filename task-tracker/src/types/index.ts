export const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'] as const
export type Priority = (typeof PRIORITIES)[number]

export const STATUSES = ['TODO', 'IN_PROGRESS', 'DONE', 'CANCELLED'] as const
export type Status = (typeof STATUSES)[number]

export type User = {
  id: string
  email: string
  avatarUrl: string | null
  name: string | null
}

export type Task = {
  id: string
  title: string
  description: string | null
  priority: Priority
  status: Status
  dueDate: string | null
  userId: string
  createdAt: string
  updatedAt: string
}
