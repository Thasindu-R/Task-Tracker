import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const updateSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional().nullable(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'DONE', 'CANCELLED']).optional(),
  dueDate: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val ? new Date(val) : null)),
})

async function getAuthenticatedUser(request: NextRequest) {
  const authorizationHeader = request.headers.get('authorization')
  const bearerToken = authorizationHeader?.startsWith('Bearer ')
    ? authorizationHeader.slice('Bearer '.length)
    : null

  const supabase = await createServerClient()
  const {
    data: { user },
  } = bearerToken
    ? await supabase.auth.getUser(bearerToken)
    : await supabase.auth.getUser()

  return user
}

async function syncUserRecord(user: {
  id: string
  email?: string | null
  user_metadata?: Record<string, unknown>
}) {
  if (!user.email) {
    return
  }

  await prisma.user.upsert({
    where: { id: user.id },
    update: {
      email: user.email,
      name:
        typeof user.user_metadata?.name === 'string'
          ? user.user_metadata.name
          : null,
    },
    create: {
      id: user.id,
      email: user.email,
      name:
        typeof user.user_metadata?.name === 'string'
          ? user.user_metadata.name
          : null,
    },
  })
}

export async function PUT(
  request: NextRequest,
  props: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getAuthenticatedUser(request)

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await syncUserRecord(user)

    const params = await props.params
    const taskId = params.id
    const task = await prisma.task.findUnique({ where: { id: taskId } })

    if (!task) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    if (task.userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const validationResult = updateSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validationResult.error.format(),
        },
        { status: 400 },
      )
    }

    const dataToUpdate = Object.fromEntries(
      Object.entries(validationResult.data).filter(
        (entry) => entry[1] !== undefined,
      ),
    )

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: dataToUpdate,
    })

    return NextResponse.json({ data: updatedTask }, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    )
  }
}

export async function DELETE(
  request: NextRequest,
  props: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getAuthenticatedUser(request)

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await syncUserRecord(user)

    const params = await props.params
    const taskId = params.id
    const task = await prisma.task.findUnique({ where: { id: taskId } })

    if (!task) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    if (task.userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    await prisma.task.delete({ where: { id: taskId } })

    return NextResponse.json({ data: { success: true } }, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    )
  }
}
