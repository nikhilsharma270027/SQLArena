// components/DuelLoserModal.tsx
'use client'

import { useRouter } from 'next/navigation'

interface DuelLoserModalProps {
  isOpen: boolean
  onClose: () => void
  problemTitle: string
  opponentName?: string
}

export function DuelLoserModal({ 
  isOpen, 
  onClose, 
  problemTitle,
  opponentName = "Your opponent"
}: DuelLoserModalProps) {
  const router = useRouter()

  if (!isOpen) return null

  const handleGoHome = () => {
    onClose()
    router.push('/')
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-lg p-8 max-w-md w-full shadow-2xl border-2 border-red-300">
        <div className="text-center">
          <div className="text-6xl text-center mb-4">😔</div>
          <h2 className="text-3xl font-bold text-red-600 mb-2">YOU LOST!</h2>
          <p className="text-lg text-gray-700 mb-2">
            {opponentName} solved <span className="font-semibold">"{problemTitle}"</span> first!
          </p>
          <p className="text-sm text-gray-600 mb-6">
            Better luck next time! Keep practicing to improve your speed. 💪
          </p>
          
          <div className="bg-white rounded-lg p-4 mb-6 border border-red-200">
            <div className="text-sm text-gray-600 mb-1">Duel Status</div>
            <div className="text-2xl font-bold text-red-600">DEFEAT</div>
          </div>

          <button
            onClick={handleGoHome}
            className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold py-3 rounded-lg hover:from-red-600 hover:to-pink-600 transition-all transform hover:scale-105 mb-3"
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
