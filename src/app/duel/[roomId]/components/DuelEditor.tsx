// app/duel/[roomId]/components/DuelEditor.tsx
'use client'

import { useState } from 'react'
import Editor from '@monaco-editor/react'
import { Button } from '@/src/components/ui/button'
import { ResultTable } from '@/src/components/problems/ResultTable'
import { Alert, AlertDescription } from '@/src/components/ui/alert'

export function DuelEditor({ problem, onSubmit }: { problem: any; onSubmit: (sql: string) => Promise<void> }) {
  const [sql, setSql] = useState('-- Write your SQL query here\nSELECT * FROM employees;')
  const [result, setResult] = useState<any[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const runQuery = async () => {
    setIsRunning(true)
    setError(null)
    setResult(null)
    
    try {
      const response = await fetch('/api/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ problemId: problem.id, sql })
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Query execution failed')
      }
      
      if (data.success) {
        setResult(data.rows)
      } else {
        setError(data.error || 'Query returned no results')
      }
    } catch (err: any) {
      setError(err.message)
      console.error('Run query error:', err)
    } finally {
      setIsRunning(false)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setError(null)
    try {
      await onSubmit(sql)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Clean description: handle markdown/code blocks if needed
  const renderDescription = () => {
    if (!problem.description) return null
    // Simple markdown-like rendering (you can use a library like react-markdown)
    return <div className="prose prose-sm dark:prose-invert max-w-none">{problem.description}</div>
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div className="p-4 border-b dark:border-gray-700">
        <h2 className="text-xl font-semibold">{problem.title}</h2>
        <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          {renderDescription()}
        </div>
      </div>
      
      <div className="p-4">
        <Editor
          height="300px"
          language="sql"
          value={sql}
          onChange={(value) => setSql(value || '')}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            automaticLayout: true,
          }}
        />
        
        <div className="flex gap-3 mt-4">
          <Button onClick={runQuery} disabled={isRunning || isSubmitting} variant="outline">
            {isRunning ? 'Running...' : 'Run Query'}
          </Button>
          <Button onClick={handleSubmit} disabled={isRunning || isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Answer'}
          </Button>
        </div>
        
        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {result && result.length > 0 && (
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Results ({result.length} rows):</h3>
            <div className="border rounded-md overflow-auto max-h-96">
              <ResultTable data={result} />
            </div>
          </div>
        )}
        
        {result && result.length === 0 && !error && (
          <div className="mt-4 text-gray-500 italic">Query returned no rows.</div>
        )}
      </div>
    </div>
  )
}