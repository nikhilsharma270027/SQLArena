// app/problems/[id]/ProblemClient.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ProblemStatement } from '@/src/components/problems/ProblemStatement'
import { QueryEditor } from '@/src/components/problems/QueryEditor'
import { ResultTable } from '@/src/components/problems/ResultTable'
import { Button } from '@/src/components/ui/button'
import { Alert, AlertDescription } from '@/src/components/ui/alert'
import { SubmitResultModal } from '@/src/components/SubmitResultModal'

interface ProblemClientProps {
  initialProblem: any
}

export function ProblemClient({ initialProblem }: ProblemClientProps) {
  const router = useRouter()
  const [query, setQuery] = useState("SELECT * FROM employees;")

  const [result, setResult] = useState<any[] | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  
  // Modal state
  const [showModal, setShowModal] = useState(false)
  const [submissionResult, setSubmissionResult] = useState({
    isCorrect: false,
    isNewSolve: false,
    message: ''
  })

  // Run query (just executes, doesn't grade)
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
      }
    } catch (err: any) {
      setError(err.message)
      setIsCorrect(false)
    } finally {
      setIsRunning(false)
    }
  }

  // Submit query (grades and tracks solves)
  const submitQuery = async () => {
    setIsSubmitting(true)
    setError(null)
    
    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemId: initialProblem.id,
          sql: query  // Note: using 'sql' not 'query' to match backend
        })
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Submission failed')
      }
      
      // Show the modal with results
      setSubmissionResult({
        isCorrect: data.correct,
        isNewSolve: data.isNewSolve,
        message: data.message
      })
      setShowModal(true)
      
      // Also update the result display if correct
      if (data.correct && data.rows) {
        setResult(data.rows)
        setIsCorrect(true)
      }
      
    } catch (err: any) {
      setError(err.message)
      // Show error modal or toast
      setSubmissionResult({
        isCorrect: false,
        isNewSolve: false,
        message: err.message
      })
      setShowModal(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleModalClose = () => {
    setShowModal(false)
    // If correct, optionally redirect to profile or stay
    if (submissionResult.isCorrect) {
      // Uncomment if you want auto-redirect after modal closes
      // router.push('/profile')
    }
  }

  return (
    <div className="flex flex-col h-screen overflow-scroll-auto">
      {/* Modal */}
      <SubmitResultModal
        isOpen={showModal}
        onClose={handleModalClose}
        isCorrect={submissionResult.isCorrect}
        isNewSolve={submissionResult.isNewSolve}
        problemTitle={initialProblem.title}
      />

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
        <div className="flex flex-col gap-4 h-full overflow-scroll-auto">
          <div className="flex-1 min-h-50">
            <QueryEditor
              value={query}
              onChange={setQuery}
              onRun={runQuery}
              onSubmit={submitQuery}
              isRunning={isRunning}
              isSubmitting={isSubmitting}
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
                  ✓ Your query is correct! Click "Submit" to save your solution.
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