// app/api/duel/match/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/src/lib/auth'
import { prisma } from '@/src/lib/prisma'

function generateRoomCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase()
}

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers })
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { roomCode } = body
    
    // If joining existing room
    if (roomCode) {
      const room = await prisma.duelRoom.findUnique({
        where: { roomCode },
        include: { 
          problem: true,
          player1: {
            select: { id: true, name: true, email: true }
          }
        }
      })
      
      if (!room) {
        return NextResponse.json({ error: 'Room not found' }, { status: 404 })
      }
      
      if (room.status !== 'WAITING') {
        return NextResponse.json({ error: 'Room already started' }, { status: 400 })
      }
      
      // Join room as player 2
      const updatedRoom = await prisma.duelRoom.update({
        where: { id: room.id },
        data: {
          player2Id: session.user.id,
          status: 'ACTIVE',
          startedAt: new Date()
        },
        include: { 
          problem: true, 
          player1: {
            select: { id: true, name: true, email: true }
          },
          player2: {
            select: { id: true, name: true, email: true }
          }
        }
      })
      
      return NextResponse.json({
        roomId: updatedRoom.id,
        roomCode: updatedRoom.roomCode,
        problem: updatedRoom.problem,
        player1: updatedRoom.player1,
        status: updatedRoom.status
      })
    }
    
    // Create new room
    const problems = await prisma.problem.findMany()
    if (problems.length === 0) {
      return NextResponse.json({ error: 'No problems available' }, { status: 500 })
    }
    
    const randomProblem = problems[Math.floor(Math.random() * problems.length)]
    
    const room = await prisma.duelRoom.create({
      data: {
        roomCode: generateRoomCode(),
        problemId: randomProblem.id,
        player1Id: session.user.id,
        status: 'WAITING'
      },
      include: { 
        problem: true,
        player1: {
          select: { id: true, name: true, email: true }
        }
      }
    })
    
    return NextResponse.json({
      roomId: room.id,
      roomCode: room.roomCode,
      problem: room.problem,
      status: room.status
    })
  } catch (error) {
    console.error('Matchmaking error:', error)
    return NextResponse.json({ error: 'Failed to create/join room' }, { status: 500 })
  }
}