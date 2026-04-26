// app/problems/[id]/ProblemClient.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ProblemStatement } from '@/src/components/problems/ProblemStatement'
import { QueryEditor } from '@/src/components/problems/QueryEditor'
import { ResultTable } from '@/src/components/problems/ResultTable'
import { Button } from '@/src/components/ui/button'
import { Alert, AlertDescription } from '@/src/components/ui/alert'

interface ProblemClientProps {
  initialProblem: any
}

export function ProblemClient({ initialProblem }: ProblemClientProps) {
  const router = useRouter()
  const [query, setQuery] = useState("-- Write your SQL query here\nSELECT * FROM employees;")
  const [result, setResult] = useState<any[] | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)

  const runQuery = async () => {
    setIsRunning(true)
    setError(null)
    setResult(null)
    setIsCorrect(null)
    
    try {
      const response = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemId: initialProblem.id,
          query: query
        })
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Execution failed')
      }
      
      setResult(data.rows)
      setIsCorrect(data.isCorrect)
      
      if (!data.isCorrect) {
        setError(data.message)
      } else {
        // Show success message
        console.log('Success:', data.message)
      }
    } catch (err: any) {
      setError(err.message)
      setIsCorrect(false)
    } finally {
      setIsRunning(false)
    }
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 h-full overflow-hidden">
        {/* Left Panel - Problem Statement */}
        <div className="overflow-auto border rounded-lg p-4 bg-white dark:bg-gray-900">
          <Button 
            variant="outline" 
            className="mb-4" 
            onClick={() => router.back()}
          >
            ← Back to Problems
          </Button>
          <ProblemStatement problem={initialProblem} />
        </div>
        
        {/* Right Panel - Editor & Results */}
        <div className="flex flex-col gap-4 h-full overflow-hidden">
          <div className="flex-1 min-h-0">
            <QueryEditor
              value={query}
              onChange={setQuery}
              onRun={runQuery}
              isRunning={isRunning}
            />
          </div>
          
          <div className="border rounded-lg p-4 flex-1 overflow-auto bg-white dark:bg-gray-900">
            <h3 className="font-semibold mb-2">Results</h3>
            
            {error && (
              <Alert variant="destructive" className="mb-2">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {isCorrect === true && (
              <Alert className="mb-2 bg-green-50 border-green-500">
                <AlertDescription className="text-green-700">
                  ✓ Correct! Your query passed all tests.
                </AlertDescription>
              </Alert>
            )}
            
            {result && result.length > 0 && (
              <>
                <div className="text-sm text-muted-foreground mb-2">
                  Returned {result.length} row(s)
                </div>
                <ResultTable data={result} />
              </>
            )}
            
            {result && result.length === 0 && (
              <div className="text-gray-500 text-sm">Query returned no results</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}