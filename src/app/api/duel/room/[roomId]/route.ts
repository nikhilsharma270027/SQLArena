// app/api/duel/room/[roomId]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/src/lib/prisma'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ roomId: string }> }
) {
  try {
    // ✅ Await the params (Next.js 16+ requirement)
    const { roomId } = await params
    
    console.log('Fetching duel room with ID:', roomId)

    const duelRoom = await prisma.duelRoom.findUnique({
      where: { id: roomId },
      include: {
        problem: true,
        player1: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        player2: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    if (!duelRoom) {
      console.log('Duel room not found:', roomId)
      return NextResponse.json(
        { error: 'Duel room not found' },
        { status: 404 }
      )
    }

    console.log('Duel room found:', duelRoom.id)
    return NextResponse.json(duelRoom)
  } catch (error) {
    console.error('Error fetching duel room:', error)
    return NextResponse.json(
      { error: 'Failed to fetch duel room' },
      { status: 500 }
    )
  }
}