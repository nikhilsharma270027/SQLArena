// app/api/duel/submit/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/src/lib/auth'
import { prisma } from '@/src/lib/prisma'
import { executeUserQuery } from '@/src/lib/sql/executor'
import { compareResults } from '@/src/lib/sql/comparator'

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers })
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { duelRoomId, sql } = await req.json()

    // Get duel room
    const duelRoom = await prisma.duelRoom.findUnique({
      where: { id: duelRoomId },
      include: { problem: true }
    })

    if (!duelRoom || duelRoom.status !== 'ACTIVE') {
      return NextResponse.json({ error: 'Duel not active' }, { status: 400 })
    }

    // Check if already finished
    if (duelRoom.winnerId) {
      return NextResponse.json({ error: 'Duel already finished' }, { status: 400 })
    }

    // Execute and validate SQL
    const { rows } = await executeUserQuery(duelRoom.problemId, sql)
    const comparisonResult = compareResults(rows, duelRoom.problem.expectedResult as any[])
    const isCorrect = comparisonResult.isCorrect

    // Save submission
    await prisma.duelSubmission.create({
      data: {
        duelRoomId,
        userId: session.user.id,
        sql,
        isCorrect
      }
    })

    // If correct, declare winner
    if (isCorrect && !duelRoom.winnerId) {
      const updatedRoom = await prisma.duelRoom.update({
        where: { id: duelRoomId },
        data: {
          winnerId: session.user.id,
          status: 'FINISHED',
          endedAt: new Date()
        }
      })

      // Update user stats
      await prisma.user.update({
        where: { id: session.user.id },
        data: { totalSolved: { increment: 1 } }
      })

      return NextResponse.json({
        correct: true,
        isWinner: true,
        message: '🎉 You won the duel!'
      })
    }

    return NextResponse.json({
      correct: isCorrect,
      isWinner: false,
      message: isCorrect ? '✅ Correct! But opponent hasn\'t submitted yet.' : '❌ Wrong answer. Keep trying!'
    })
  } catch (error: any) {
    console.error('Duel submit error:', error)
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}