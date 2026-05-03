// app/api/submit/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/src/lib/auth'
import { prisma } from '@/src/lib/prisma'
import { executeUserQuery } from '@/src/lib/sql/executor'
import { compareResults } from '@/src/lib/sql/comparator'

export async function POST(req: NextRequest) {
  // 1. Authenticate user
  const session = await auth.api.getSession({ headers: req.headers })
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { problemId, sql } = await req.json()

  try {
    // 2. Execute user's SQL
    const { rows: userRows } = await executeUserQuery(problemId, sql)

    // 3. Fetch expected result and problem title from DB
    const problem = await prisma.problem.findUnique({
      where: { id: problemId },
      select: { expectedResult: true, title: true }
    })

    if (!problem || !problem.expectedResult) {
      return NextResponse.json({ error: 'Problem not ready' }, { status: 500 })
    }

    const isCorrect = compareResults(userRows, problem.expectedResult as any[])

    // 4. Check if user already solved this problem
    const existingSolve = await prisma.problemSolved.findUnique({
      where: {
        userId_problemId: {
          userId: session.user.id,
          problemId: problemId
        }
      }
    })

    // 5. Save submission (always save for history)
    await prisma.problemSubmission.create({
      data: {
        userId: session.user.id,
        problemId,
        code: sql,
        status: isCorrect ? 'ACCEPTED' : 'WRONG_ANSWER',
      }
    })

    // 6. If correct AND never solved before → update stats
    let isNewSolve = false
    if (isCorrect && !existingSolve) {
      await prisma.$transaction([
        // Create solved record
        prisma.problemSolved.create({
          data: {
            userId: session.user.id,
            problemId: problemId,
          }
        }),
        // Increment user's totalSolved
        prisma.user.update({
          where: { id: session.user.id },
          data: { totalSolved: { increment: 1 } }
        })
      ])
      isNewSolve = true
    }

    // 7. Return response with metadata
    return NextResponse.json({
      correct: isCorrect,
      isNewSolve: isNewSolve,
      message: isCorrect 
        ? (isNewSolve 
            ? '✅ Correct! Problem solved for the first time!' 
            : '✅ Correct! (Already solved before)')
        : '❌ Wrong answer. Try again!',
      rowCount: userRows.length,
      rows: userRows.slice(0, 50),
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 })
  }
}