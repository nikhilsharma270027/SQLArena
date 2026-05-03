// app/duel/[roomId]/page.tsx
"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/src/lib/supabase/client";
import { DuelEditor } from "./components/DuelEditor";
import { DuelOpponent } from "./components/DuelOpponent";
import { Button } from "@/src/components/ui/button";
import { DuelWinnerModal } from "@/src/components/DuelWinnerModal";
import { DuelLoserModal } from "@/src/components/DuelLoserModal";

export default function DuelPage() {
  const params = useParams();
  const router = useRouter();
  const [room, setRoom] = useState<any>(null);
  const [opponent, setOpponent] = useState<any>(null);
  const [isReady, setIsReady] = useState(false);
  const [winner, setWinner] = useState<any>(null);
  const [myScore, setMyScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [duelResult, setDuelResult] = useState<'win' | 'lose' | null>(null);
  // Use ref to track channel for cleanup
  const channelRef = useRef<any>(null);

  useEffect(() => {
    fetchRoomDetails();
  }, []);

  // Fetch current user on mount
  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch("/api/auth/get-session");
      const data = await res.json();
      if (data.user) setCurrentUser(data.user);
    };
    fetchUser();
  }, []);

  // Separate useEffect for realtime setup - runs when room data is available
  useEffect(() => {
  if (!room || !currentUser) return

  const setupRealtime = async () => {
    if (channelRef.current) {
      await channelRef.current.unsubscribe()
    }
    const channel = supabase.channel(`duel:${params.roomId}`)
    channelRef.current = channel

    // Presence sync
    channel.on('presence', { event: 'sync' }, () => {
      const state = channel.presenceState()
      const players = Object.values(state).flat()
      console.log('Presence state:', state, 'count:', players.length)

      // Check for 2 different users, not just 2 entries
      const uniqueUserIds = new Set(players.map((p: any) => p.userId))
      if (uniqueUserIds.size === 2) {
        setIsReady(true)
      }

      // Opponent is the one whose userId is not the current user
      const opponentPlayer = players.find((p: any) => p.userId !== currentUser.id)
      if (opponentPlayer) setOpponent(opponentPlayer)
    })

    // Handle game-over event
    channel.on('broadcast', { event: 'game-over' }, (payload: any) => {
      setWinner(payload.payload.winner)
      if (payload.payload.winner.id !== currentUser.id) {
        setDuelResult('lose')
      }
    })

    // Handle submission event
    channel.on('broadcast', { event: 'submission' }, (payload: any) => {
      if (payload.payload.correct) {
        setOpponentScore((prev) => prev + 1)
      }
    })

    await channel.subscribe()
    // Track the current user's presence
    await channel.track({
      userId: currentUser.id,
      name: currentUser.name,
      onlineAt: new Date().toISOString()
    })
  }

  setupRealtime()

  return () => {
    if (channelRef.current) channelRef.current.unsubscribe()
  }
}, [room, currentUser, params.roomId])

  const fetchRoomDetails = async () => {
    try {
      console.log("Fetching room:", params.roomId);
      const response = await fetch(`/api/duel/room/${params.roomId}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Room data received:", data);
      setRoom(data);
    } catch (error) {
      console.error("Failed to fetch room details:", error);
      // Optionally redirect back to lobby
      // router.push('/duel')
    }
  };

  const handleSubmit = async (sql: string) => {
    try {
      const response = await fetch("/api/duel/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          duelRoomId: params.roomId,
          sql,
        }),
      });

      const result = await response.json();

      if (result.correct) {
        setMyScore((prev) => prev + 1);

        // Broadcast to opponent using the existing channel
        if (channelRef.current) {
          await channelRef.current.send({
            type: "broadcast",
            event: "submission",
            payload: {
              userId: room?.player1Id,
              correct: true,
            },
          });
        }

        if (result.isWinner) {
          setDuelResult('win');
          setWinner(currentUser);
          if (channelRef.current) {
            await channelRef.current.send({
              type: "broadcast",
              event: "game-over",
              payload: { winner: currentUser },
            });
          }
        }
      }

      // Show result to user
      if (result.message) {
        // You can add a toast notification here
        console.log(result.message);
      }
    } catch (error) {
      console.error("Submission failed:", error);
    }
  };

  if (!room)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Loading duel...</div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold">SQL Duel</h1>
          <div className="text-sm text-gray-500">
            Room Code: <span className="font-mono font-bold">{room.roomCode}</span>
          </div>
        </div>

        {/* Players Status */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
            <h3 className="font-semibold mb-2">You</h3>
            <div className="text-3xl font-bold text-blue-600">{myScore}</div>
            <div className="text-sm text-gray-500">Solutions</div>
          </div>

          <DuelOpponent opponent={opponent} isReady={isReady} score={opponentScore} />
        </div>

        {/* Duel Editor */}
        {isReady && !winner && <DuelEditor problem={room.problem} onSubmit={handleSubmit} />}

        {!isReady && (
          <div className="text-center py-12">
            <div className="animate-pulse text-gray-500 mb-4">Waiting for opponent to join...</div>
            <Button onClick={() => navigator.clipboard.writeText(room.roomCode)} className="mt-4">
              Copy Room Code
            </Button>
          </div>
        )}

        {/* Winner Modal */}
        <DuelWinnerModal
          isOpen={duelResult === 'win'}
          onClose={() => setDuelResult(null)}
          problemTitle={room.problem?.title || 'Problem'}
        />

        {/* Loser Modal */}
        <DuelLoserModal
          isOpen={duelResult === 'lose'}
          onClose={() => setDuelResult(null)}
          problemTitle={room.problem?.title || 'Problem'}
          opponentName={opponent?.name || 'Your opponent'}
        />
      </div>
    </div>
  );
}
