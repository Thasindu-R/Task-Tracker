'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getAccessToken } from '@/lib/auth'
import type { Priority, Status, Task } from '@/types'

export type TaskFilters = {
  status?: Status
  priority?: Priority
  sortBy?: 'createdAt' | 'dueDate' | 'priority' | 'title'
  sortOrder?: 'asc' | 'desc'
}

type ApiResponse<T> = { data: T | null; error: string | null }

type TaskInput = {
  title: string
  description?: string
  priority?: Priority
  status?: Status
  dueDate?: string | null
}

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const accessToken = await getAccessToken()

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...(options?.headers ?? {}),
    },
  })

  const payload = (await response.json()) as ApiResponse<T>
  if (!response.ok || payload.error) {
    throw new Error(payload.error ?? 'Request failed')
  }

  if (!payload.data) {
    throw new Error('Empty response')
  }

  return payload.data
}

export function useTasksQuery(
  filters: TaskFilters,
  options?: { enabled?: boolean },
) {
  return useQuery<Task[]>({
    queryKey: ['tasks', filters],
    enabled: options?.enabled ?? true,
    queryFn: async () => {
      const params = new URLSearchParams()
      if (filters.status) params.set('status', filters.status)
      if (filters.priority) params.set('priority', filters.priority)
      if (filters.sortBy) params.set('sortBy', filters.sortBy)
      if (filters.sortOrder) params.set('sortOrder', filters.sortOrder)

      const queryString = params.toString()
      const url = queryString ? `/api/tasks?${queryString}` : '/api/tasks'

      return fetchJson<Task[]>(url)
    },
  })
}

export function useCreateTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: TaskInput) =>
      fetchJson<Task>('/api/tasks', {
        method: 'POST',
        body: JSON.stringify(input),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })
}

export function useUpdateTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<TaskInput> }) =>
      fetchJson<Task>(`/api/tasks/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] })
      const previous = queryClient.getQueriesData<Task[]>({
        queryKey: ['tasks'],
      })

      previous.forEach(([key, value]) => {
        if (!value) return
        queryClient.setQueryData<Task[]>(
          key,
          value.map((task) =>
            task.id === id
              ? {
                  ...task,
                  ...data,
                  dueDate:
                    typeof data.dueDate === 'string'
                      ? data.dueDate
                      : (data.dueDate ?? task.dueDate),
                }
              : task,
          ),
        )
      })

      return { previous }
    },
    onError: (_error, _vars, context) => {
      context?.previous.forEach(([key, value]) => {
        queryClient.setQueryData(key, value)
      })
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })
}

export function useDeleteTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id }: { id: string }) =>
      fetchJson<Task>(`/api/tasks/${id}`, {
        method: 'DELETE',
      }),
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] })
      const previous = queryClient.getQueriesData<Task[]>({
        queryKey: ['tasks'],
      })

      previous.forEach(([key, value]) => {
        if (!value) return
        queryClient.setQueryData<Task[]>(
          key,
          value.map((task) =>
            task.id === id ? { ...task, status: 'CANCELLED' } : task,
          ),
        )
      })

      return { previous }
    },
    onError: (_error, _vars, context) => {
      context?.previous.forEach(([key, value]) => {
        queryClient.setQueryData(key, value)
      })
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })
}
