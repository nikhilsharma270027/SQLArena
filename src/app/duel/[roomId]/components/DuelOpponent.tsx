// app/duel/[roomId]/components/DuelOpponent.tsx
'use client'

import { User, Clock, Trophy, Loader2 } from 'lucide-react'

interface DuelOpponentProps {
  opponent: {
    userId: string
    name: string
    onlineAt?: string
  } | null
  isReady: boolean
  score: number
}

export function DuelOpponent({ opponent, isReady, score }: DuelOpponentProps) {
  if (!opponent) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow border-2 border-dashed border-gray-300">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-500">Opponent</h3>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Loader2 className="h-4 w-4 animate-spin" />
            Waiting...
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
            <User className="h-6 w-6 text-gray-400" />
          </div>
          <div>
            <div className="text-lg font-medium text-gray-400">???: ???</div>
            <div className="text-sm text-gray-400">Waiting for player...</div>
          </div>
        </div>
        
        <div className="mt-3 pt-3 border-t">
          <div className="text-3xl font-bold text-gray-400">{score}</div>
          <div className="text-sm text-gray-400">Solutions</div>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg p-4 shadow transition-all ${
      isReady ? 'border-2 border-green-500' : 'border border-gray-200'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">Opponent</h3>
        {isReady ? (
          <div className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
            <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
            Ready
          </div>
        ) : (
          <div className="flex items-center gap-1 text-xs text-yellow-600 bg-yellow-50 px-2 py-1 rounded">
            <Clock className="h-3 w-3" />
            Joining...
          </div>
        )}
      </div>
      
      {/* Player Info */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
          {opponent.name ? (
            <span className="text-lg font-bold text-blue-600 dark:text-blue-300">
              {opponent.name.charAt(0).toUpperCase()}
            </span>
          ) : (
            <User className="h-6 w-6 text-blue-500" />
          )}
        </div>
        <div>
          <div className="text-lg font-medium">{opponent.name || 'Anonymous'}</div>
          <div className="text-sm text-gray-500">
            {isReady ? 'In duel' : 'Connecting...'}
          </div>
        </div>
      </div>
      
      {/* Score */}
      <div className="mt-3 pt-3 border-t">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-blue-600">{score}</span>
          <span className="text-sm text-gray-500">solved</span>
        </div>
        {score > 0 && (
          <div className="flex items-center gap-1 mt-1 text-xs text-green-600">
            <Trophy className="h-3 w-3" />
            {score === 1 ? '1 problem solved' : `${score} problems solved`}
          </div>
        )}
      </div>
      
      {/* Status Badge for Winner */}
      {score >= 1 && (
        <div className="mt-2 text-xs text-center text-orange-600 bg-orange-50 rounded px-2 py-1">
          ⚡ Leading by {score} solution{score !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  )
}