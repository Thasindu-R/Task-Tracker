import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const taskSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().max(500).optional().nullable(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM'),
  status: z.enum(['TODO', 'IN_PROGRESS', 'DONE', 'CANCELLED']).default('TODO'),
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

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request)

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await syncUserRecord(user)

    const tasks = await prisma.task.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ data: tasks }, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request)

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await syncUserRecord(user)

    const body = await request.json()
    const validationResult = taskSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validationResult.error.format(),
        },
        { status: 400 },
      )
    }

    const taskData = validationResult.data

    const task = await prisma.task.create({
      data: {
        ...taskData,
        userId: user.id,
      },
    })

    return NextResponse.json({ data: task }, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    )
  }
}
