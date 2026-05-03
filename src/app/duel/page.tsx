// app/duel/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/src/components/ui/button'
import { Input } from '@/src/components/ui/input'

export default function DuelLobby() {
  const router = useRouter()
  const [roomCode, setRoomCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const createDuel = async () => {
    setIsLoading(true)
    const response = await fetch('/api/duel/match', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    })
    
    const data = await response.json()
    router.push(`/duel/${data.roomId}`)
  }

  const joinDuel = async () => {
    if (!roomCode) return
    
    setIsLoading(true)
    const response = await fetch('/api/duel/match', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roomCode })
    })
    
    const data = await response.json()
    router.push(`/duel/${data.roomId}`)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-8">SQL Duel</h1>
        
        <div className="space-y-6">
          <Button 
            onClick={createDuel} 
            disabled={isLoading}
            className="w-full"
            size="lg"
          >
            Create New Duel
          </Button>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or join existing</span>
            </div>
          </div>
          
          <div className="space-y-3">
            <Input
              placeholder="Enter Room Code"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              className="text-center font-mono text-lg"
              maxLength={6}
            />
            <Button 
              onClick={joinDuel} 
              disabled={!roomCode || isLoading}
              variant="outline"
              className="w-full"
            >
              Join Duel
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}