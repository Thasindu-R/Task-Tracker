import { NextResponse, type NextRequest } from 'next/server'
import { z } from 'zod'
import type { Task as PrismaTask, User as PrismaUser } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { createServerClient } from '@/lib/supabase'
import { PRIORITIES, STATUSES, type Task } from '@/types'

const querySchema = z.object({
  status: z.enum(STATUSES).optional(),
  priority: z.enum(PRIORITIES).optional(),
  sortBy: z.enum(['createdAt', 'dueDate', 'priority', 'title']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
})

const taskInputSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  priority: z.enum(PRIORITIES).optional(),
  status: z.enum(STATUSES).optional(),
  dueDate: z.union([z.string().datetime(), z.null()]).optional(),
})

type ApiResponse<T> = { data: T | null; error: string | null }

function json<T>(data: T | null, error: string | null, status = 200) {
  return NextResponse.json<ApiResponse<T>>({ data, error }, { status })
}

function serializeTask(task: PrismaTask): Task {
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    priority: task.priority,
    status: task.status,
    dueDate: task.dueDate ? task.dueDate.toISOString() : null,
    userId: task.userId,
    createdAt: task.createdAt.toISOString(),
    updatedAt: task.updatedAt.toISOString(),
  }
}

async function ensureUser(user: {
  id: string
  email: string
  user_metadata?: Record<string, unknown>
}): Promise<PrismaUser> {
  const avatarUrl =
    typeof user.user_metadata?.avatar_url === 'string'
      ? user.user_metadata.avatar_url
      : null
  const name =
    typeof user.user_metadata?.name === 'string'
      ? user.user_metadata.name
      : null

  return prisma.user.upsert({
    where: { id: user.id },
    update: {
      email: user.email,
      avatarUrl,
      name,
    },
    create: {
      id: user.id,
      email: user.email,
      avatarUrl,
      name,
    },
  })
}

async function getAuthedUser() {
  const supabase = createServerClient()
  const { data, error } = await supabase.auth.getUser()

  if (error || !data.user) {
    return { user: null, error: 'Unauthorized' }
  }

  await ensureUser(data.user)

  return { user: data.user, error: null }
}

export async function GET(request: NextRequest) {
  const { user, error } = await getAuthedUser()
  if (!user) return json(null, error, 401)

  const url = new URL(request.url)
  const raw = Object.fromEntries(url.searchParams.entries())
  const parsed = querySchema.safeParse(raw)

  if (!parsed.success) {
    return json(null, 'Invalid query parameters', 400)
  }

  const { status, priority, sortBy, sortOrder } = parsed.data

  const orderBy = sortBy
    ? { [sortBy]: sortOrder ?? 'desc' }
    : { createdAt: 'desc' }

  const tasks = await prisma.task.findMany({
    where: {
      userId: user.id,
      status,
      priority,
    },
    orderBy,
  })

  return json(tasks.map(serializeTask), null)
}

export async function POST(request: NextRequest) {
  const { user, error } = await getAuthedUser()
  if (!user) return json(null, error, 401)

  const body = await request.json().catch(() => null)
  const parsed = taskInputSchema.safeParse(body)

  if (!parsed.success) {
    return json(null, 'Invalid request body', 400)
  }

  const { title, description, priority, status, dueDate } = parsed.data

  const task = await prisma.task.create({
    data: {
      title,
      description: description ?? null,
      priority: priority ?? 'MEDIUM',
      status: status ?? 'TODO',
      dueDate: dueDate ? new Date(dueDate) : null,
      userId: user.id,
    },
  })

  return json(serializeTask(task), null, 201)
}
