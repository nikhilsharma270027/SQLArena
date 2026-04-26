"use client"

import React from "react"

type Props = {
  won: number
  played: number
}

export default function BattleStatsCircle({ won, played }: Props) {
  const percentage = played === 0 ? 0 : (won / played) * 100

  const radius = 60
  const stroke = 8
  const normalizedRadius = radius - stroke * 0.5
  const circumference = normalizedRadius * 2 * Math.PI
  const strokeDashoffset =
    circumference - (percentage / 100) * circumference

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      
      {/* Circle */}
      <div className="relative w-40 h-40 flex items-center justify-center">
        <svg height={radius * 2} width={radius * 2}>
          
          {/* Background circle */}
          <circle
            stroke="#e5e7eb"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />

          {/* Progress circle */}
          <circle
            stroke="#111827"
            fill="transparent"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference + " " + circumference}
            style={{ strokeDashoffset }}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            className="transition-all duration-500"
          />
        </svg>

        {/* Center Text */}
        <div className="absolute flex items-center justify-center text-2xl font-semibold">
          <span>{won}</span>
          <span className="text-gray-400 text-lg">/{played}</span>
        </div>
      </div>

      {/* Label */}
      <p className="text-xs tracking-widest text-gray-500 uppercase">
        Duel Won / Played
      </p>
    </div>
  )
}