'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Badge } from '@/src/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/src/components/ui/table'
import { Sword, Trophy, Users } from 'lucide-react'

interface BattleRecord {
  id: string
  date: string
  problem: string
  player1: {
    name: string
    result: 'WON' | 'LOST' | 'DRAW'
  }
  player2: {
    name: string
    result: 'WON' | 'LOST' | 'DRAW'
  }
  duration: string
}

export default function BattleHistoryPage() {
  // TODO: Fetch battle history from backend
  const [battles, setBattles] = useState<BattleRecord[]>([])

  const getResultColor = (result: string) => {
    switch (result) {
      case 'WON':
        return 'bg-green-500/20 text-green-700 border-green-200'
      case 'LOST':
        return 'bg-red-500/20 text-red-700 border-red-200'
      case 'DRAW':
        return 'bg-yellow-500/20 text-yellow-700 border-yellow-200'
      default:
        return 'bg-gray-500/20 text-gray-700 border-gray-200'
    }
  }

  const emptyState = battles.length === 0

  return (
    <div className="flex flex-col min-h-screen px-4 py-8">
      <div className="max-w-6xl w-full mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Sword className="w-6 h-6 text-battle-green" />
            <h1 className="text-4xl font-bold">Battle History</h1>
          </div>
          <p className="text-muted-foreground">
            Track all completed battles and player records
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-battle-green mb-2">0</div>
                <p className="text-sm text-muted-foreground">Total Battles</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-500 mb-2">0%</div>
                <p className="text-sm text-muted-foreground">Win Rate</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-500 mb-2">0</div>
                <p className="text-sm text-muted-foreground">Players Faced</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Battle History Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Battle Records
            </CardTitle>
            <CardDescription>
              All battles between two players
            </CardDescription>
          </CardHeader>

          <CardContent>
            {emptyState ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Trophy className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No battles yet
                </h3>
                <p className="text-muted-foreground text-center">
                  Start a new battle to see the history here
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Problem</TableHead>
                      <TableHead>Player 1</TableHead>
                      <TableHead>Result</TableHead>
                      <TableHead>Player 2</TableHead>
                      <TableHead>Result</TableHead>
                      <TableHead>Duration</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {battles.map((battle) => (
                      <TableRow key={battle.id}>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(battle.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="font-medium">
                          {battle.problem}
                        </TableCell>
                        <TableCell>{battle.player1.name}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={getResultColor(battle.player1.result)}
                          >
                            {battle.player1.result}
                          </Badge>
                        </TableCell>
                        <TableCell>{battle.player2.name}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={getResultColor(battle.player2.result)}
                          >
                            {battle.player2.result}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {battle.duration}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
