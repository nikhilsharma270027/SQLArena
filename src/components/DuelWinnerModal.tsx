// components/DuelWinnerModal.tsx
'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import confetti from 'canvas-confetti'

interface DuelWinnerModalProps {
  isOpen: boolean
  onClose: () => void
  problemTitle: string
}

export function DuelWinnerModal({ 
  isOpen, 
  onClose, 
  problemTitle 
}: DuelWinnerModalProps) {
  const router = useRouter()

  useEffect(() => {
    if (isOpen) {
      // Trigger confetti effect
      const duration = 4000
      const animationEnd = Date.now() + duration
      const defaults = { startVelocity: 40, spread: 360, ticks: 80, zIndex: 1000 }

      function randomInRange(min: number, max: number) {
        return Math.random() * (max - min) + min
      }

      const interval: any = setInterval(function() {
        const timeLeft = animationEnd - Date.now()

        if (timeLeft <= 0) {
          return clearInterval(interval)
        }

        const particleCount = 80 * (timeLeft / duration)

        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } })
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } })
      }, 250)

      return () => clearInterval(interval)
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleGoHome = () => {
    onClose()
    router.push('/')
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg p-8 max-w-md w-full shadow-2xl border-2 border-yellow-400">
        <div className="text-center">
          <div className="text-7xl text-center mb-4 animate-bounce">🏆</div>
          <h2 className="text-4xl font-bold text-yellow-600 mb-2">YOU WIN!</h2>
          <p className="text-lg text-gray-700 mb-2">
            You solved <span className="font-semibold">"{problemTitle}"</span> first!
          </p>
          <p className="text-sm text-gray-600 mb-6">
            You defeated your opponent in this duel. Great job! 🎯
          </p>
          
          <div className="bg-white rounded-lg p-4 mb-6 border border-yellow-200">
            <div className="text-sm text-gray-600 mb-1">Duel Status</div>
            <div className="text-2xl font-bold text-yellow-600">VICTORY</div>
          </div>

          <button
            onClick={handleGoHome}
            className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold py-3 rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all transform hover:scale-105 mb-3"
          >
            Back to Home
          </button>
          
          <button
            onClick={onClose}
            className="w-full bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
