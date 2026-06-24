import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const cases = await prisma.case.findMany({
      include: { request: true, triage: true },
      orderBy: { createdAt: 'desc' },
    })

    const sorted = cases

    const result = sorted.map(c => ({
      id: c.id,
      status: c.status,
      createdAt: c.createdAt,
      studentName: c.request.name,
      studentEmail: c.request.email,
      university: c.request.university,
      course: c.request.course,
      year: c.request.year,
      message: c.request.message,
      category: c.triage.category,
      urgency: c.triage.urgency,
      safeguarding: c.triage.safeguarding,
      disposition: c.triage.disposition,
      confidence: c.triage.confidence,
      reasoning: c.triage.reasoning,
      injectionFlag: c.triage.injectionFlag,
      studentReply: c.studentReply,
      staffSummary: c.staffSummary,
      clarifyQuestion: c.clarifyQuestion,
    }))

    return NextResponse.json(result)
  } catch (e) {
    console.error('[GET /api/cases]', e)
    return NextResponse.json({ error: 'Failed to fetch cases' }, { status: 500 })
  }
}
