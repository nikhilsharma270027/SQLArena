// app/api/run/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { executeUserQuery } from '@/src/lib/sql/executor'

export async function POST(req: NextRequest) {
  try {
    const { problemId, sql } = await req.json()
    const { rows, rowCount } = await executeUserQuery(problemId, sql)
    return NextResponse.json({
      success: true,
      rowCount,
      rows: rows.slice(0, 50)
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 })
  }
}