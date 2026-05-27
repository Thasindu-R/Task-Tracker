import { NextResponse, type NextRequest } from 'next/server'
import { z } from 'zod'
import type { Task as PrismaTask, User as PrismaUser } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { createServerClient } from '@/lib/supabase'
import { PRIORITIES, STATUSES, type Task } from '@/types'

const idSchema = z.string().uuid()

const taskUpdateSchema = z.object({
  title: z.string().min(1).optional(),
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

export async function GET(
  _request: NextRequest,
  context: { params: { id: string } },
) {
  const { user, error } = await getAuthedUser()
  if (!user) return json(null, error, 401)

  const parsedId = idSchema.safeParse(context.params.id)
  if (!parsedId.success) return json(null, 'Invalid id', 400)

  const task = await prisma.task.findFirst({
    where: { id: parsedId.data, userId: user.id },
  })

  if (!task) return json(null, 'Not found', 404)

  return json(serializeTask(task), null)
}

export async function PUT(
  request: NextRequest,
  context: { params: { id: string } },
) {
  const { user, error } = await getAuthedUser()
  if (!user) return json(null, error, 401)

  const parsedId = idSchema.safeParse(context.params.id)
  if (!parsedId.success) return json(null, 'Invalid id', 400)

  const body = await request.json().catch(() => null)
  const parsed = taskUpdateSchema.safeParse(body)
  if (!parsed.success) return json(null, 'Invalid request body', 400)

  const { title, description, priority, status, dueDate } = parsed.data

  const existing = await prisma.task.findFirst({
    where: { id: parsedId.data, userId: user.id },
  })

  if (!existing) return json(null, 'Not found', 404)

  const task = await prisma.task.update({
    where: { id: parsedId.data },
    data: {
      title,
      description: description ?? undefined,
      priority,
      status,
      dueDate: typeof dueDate === 'string' ? new Date(dueDate) : dueDate,
    },
  })

  return json(serializeTask(task), null)
}

export async function DELETE(
  _request: NextRequest,
  context: { params: { id: string } },
) {
  const { user, error } = await getAuthedUser()
  if (!user) return json(null, error, 401)

  const parsedId = idSchema.safeParse(context.params.id)
  if (!parsedId.success) return json(null, 'Invalid id', 400)

  const existing = await prisma.task.findFirst({
    where: { id: parsedId.data, userId: user.id },
  })

  if (!existing) return json(null, 'Not found', 404)

  const task = await prisma.task.update({
    where: { id: parsedId.data },
    data: { status: 'CANCELLED' },
  })

  return json(serializeTask(task), null)
}
