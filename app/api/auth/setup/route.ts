import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  try {
    const count = await prisma.staff.count()
    if (count > 0) {
      return NextResponse.json({ error: 'Setup already complete. A staff account already exists.' }, { status: 403 })
    }

    const { email, password, name } = await req.json()

    if (!email || !password || !name) {
      return NextResponse.json({ error: 'name, email and password are all required' }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
    }

    const hashed = await bcrypt.hash(password, 12)

    const staff = await prisma.staff.create({
      data: { email: email.toLowerCase().trim(), password: hashed, name, role: 'admin' },
      select: { id: true, email: true, name: true, role: true },
    })

    return NextResponse.json({ success: true, staff })
  } catch (e) {
    console.error('[POST /api/auth/setup]', e)
    return NextResponse.json({ error: 'Failed to create staff account' }, { status: 500 })
  }
}
