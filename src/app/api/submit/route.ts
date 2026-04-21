import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/src/lib/auth'               // Better-Auth instance
import { executeQuery } from '@/src/lib/sqlExecutor'
import { areResultsEqual } from '@/src/lib/resultComparator'
import { prisma } from '@/src/lib/prisma'

export async function POST(req: NextRequest) {
  // 1. Authenticate user
  const session = await auth.api.getSession({ headers: req.headers })
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { problemId, sql } = await req.json()

  try {
    // 2. Execute user's SQL
    const { rows: userRows } = await executeQuery(problemId, sql)

    // 3. Fetch expected result from DB
    const problem = await prisma.problem.findUnique({
      where: { id: problemId },
      select: { expectedResult: true }
    })

    if (!problem || !problem.expectedResult) {
      return NextResponse.json({ error: 'Problem not ready' }, { status: 500 })
    }

    const isCorrect = areResultsEqual(userRows, problem.expectedResult as any[])

    // 4. Save submission
    await prisma.submission.create({
      data: {
        userId: session.user.id,
        problemId,
        code: sql,
        status: isCorrect ? 'ACCEPTED' : 'WRONG_ANSWER',
      }
    })

    // 5. Return result
    return NextResponse.json({
      correct: isCorrect,
      rowCount: userRows.length,
      rows: userRows.slice(0, 50),
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 })
  }
}