// components/SubmitResultModal.tsx
'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'
import confetti from 'canvas-confetti'
interface SubmitResultModalProps {
  isOpen: boolean
  onClose: () => void
  isCorrect: boolean
  isNewSolve: boolean
  problemTitle: string
}

export function SubmitResultModal({ 
  isOpen, 
  onClose, 
  isCorrect, 
  isNewSolve, 
  problemTitle 
}: SubmitResultModalProps) {
  const router = useRouter()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (isOpen && isCorrect) {
      // Trigger confetti effect
      const duration = 3000
      const animationEnd = Date.now() + duration
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1000 }

      function randomInRange(min: number, max: number) {
        return Math.random() * (max - min) + min
      }

      const interval: any = setInterval(function() {
        const timeLeft = animationEnd - Date.now()

        if (timeLeft <= 0) {
          return clearInterval(interval)
        }

        const particleCount = 50 * (timeLeft / duration)

        // since particles fall down, start a bit higher than random
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } })
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } })
      }, 250)

      return () => clearInterval(interval)
    }
  }, [isOpen, isCorrect])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-white/60 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        {isCorrect ? (
          <>
            <div className="text-green-600 text-6xl text-center mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-center mb-2">Accepted!</h2>
            <p className="text-center text-gray-600 mb-4">
              {isNewSolve 
                ? `You solved "${problemTitle}" for the first time! +1 point`
                : `You already solved "${problemTitle}" before. Still correct!`}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  onClose()
                  router.push('/statistics')
                }}
                className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              >
                View Statistics
              </button>
              <button
                onClick={onClose}
                className="flex-1 bg-gray-200 text-gray-800 py-2 rounded hover:bg-gray-300"
              >
                Continue Solving
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="text-red-600 text-6xl text-center mb-4">❌</div>
            <h2 className="text-2xl font-bold text-center mb-2">Wrong Answer</h2>
            <p className="text-center text-gray-600 mb-4">
              Your query didn't return the expected result. Keep trying!
            </p>
            <button
              onClick={onClose}
              className="w-full bg-gray-200 text-gray-800 py-2 rounded hover:bg-gray-300"
            >
              Try Again
            </button>
          </>
        )}
      </div>
    </div>
  )
}