import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const VALID_STATUSES = ['new', 'in_progress', 'resolved']

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  let body: { status?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { status } = body
  if (!status || !VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }

  try {
    const updated = await prisma.case.update({
      where: { id },
      data: { status, updatedAt: new Date() },
    })
    return NextResponse.json(updated)
  } catch (e: unknown) {
    if (
      e &&
      typeof e === 'object' &&
      'code' in e &&
      (e as { code: string }).code === 'P2025'
    ) {
      return NextResponse.json({ error: 'Case not found' }, { status: 404 })
    }
    console.error('[PATCH /api/cases/[id]/status]', e)
    return NextResponse.json({ error: 'Failed to update status' }, { status: 500 })
  }
}
