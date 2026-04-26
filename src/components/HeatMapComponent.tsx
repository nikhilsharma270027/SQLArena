"use client"

import React from "react"

type DayData = {
  date: string
  count: number
}

// Generate last 365 days (mock data for now)
function generateData(): DayData[] {
  const data: DayData[] = []
  const today = new Date()

  for (let i = 364; i >= 0; i--) {
    const d = new Date()
    d.setDate(today.getDate() - i)

    data.push({
      date: d.toISOString().split("T")[0],
      count: 0, // replace with real value
    })
  }

  return data
}

// Color scale
function getColor(count: number) {
  if (count === 0) return "bg-gray-200"
  if (count < 2) return "bg-green-200"
  if (count < 5) return "bg-green-400"
  return "bg-green-600"
}

export default function HeatMap() {
  const data = generateData()

  // Split into weeks (7 days each)
  const weeks: DayData[][] = []
  for (let i = 0; i < data.length; i += 7) {
    weeks.push(data.slice(i, i + 7))
  }

  const months = [
    "May","Jun","Jul","Aug","Sep","Oct",
    "Nov","Dec","Jan","Feb","Mar","Apr"
  ]

  return (
    <div className="w-full rounded-2xl border p-6 shadow-sm bg-white">
      
      {/* Title */}
      <h2 className="text-xl font-semibold text-center">HeatMap</h2>
      <p className="text-center text-gray-500 text-sm mb-6">
        Your daily battle activity over the past year.
      </p>

      {/* Month labels */}
      <div className="flex justify-between text-xs text-gray-600 mb-2 px-8">
        {months.map((m) => (
          <span key={m}>{m}</span>
        ))}
      </div>

      {/* Heatmap grid */}
      <div className="flex gap-[3px] overflow-x-auto px-2">
        {weeks.map((week, i) => (
          <div key={i} className="flex flex-col gap-[3px]">
            {week.map((day, j) => (
              <div
                key={j}
                className={`w-3 h-3 rounded-sm ${getColor(day.count)}`}
                title={`${day.date} - ${day.count} battles`}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center mt-4 text-xs text-gray-600">
        <span>0 battles in the last year</span>

        <div className="flex items-center gap-2">
          <span>Less</span>
          <div className="flex gap-1">
            <div className="w-3 h-3 bg-gray-200 rounded-sm" />
            <div className="w-3 h-3 bg-green-200 rounded-sm" />
            <div className="w-3 h-3 bg-green-400 rounded-sm" />
            <div className="w-3 h-3 bg-green-600 rounded-sm" />
          </div>
          <span>More</span>
        </div>
      </div>
    </div>
  )
}