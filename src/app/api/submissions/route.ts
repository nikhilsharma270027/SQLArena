// app/api/submissions/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/src/lib/prisma'
import { executeUserQuery } from '@/src/lib/sql/executor'
import { compareResults } from '@/src/lib/sql/comparator'
import { auth } from '@/src/lib/auth'

// interface
// Fetched problem: {
//   id: 'cmo78q4zw0000lwv5rcww92oy',
//   title: 'Select all employees',
//   description: 'Write a query to return all rows from the employees table.',
//   difficulty: 'EASY',
//   schemaSql: '\n' +
//     '          CREATE TABLE employees (id INT, name TEXT, salary INT);\n' +
//     "          INSERT INTO employees VALUES (1, 'Alice', 5000), (2, 'Bob', 6000);\n" +
//     '        ',
//   solutionQuery: 'SELECT * FROM employees ORDER BY id;',
//   expectedResult: [
//     { id: 1, name: 'Alice', salary: 5000 },
//     { id: 2, name: 'Bob', salary: 6000 }
//   ],
//   createdAt: 2026-04-20T13:38:25.868Z
// }

interface Problem {
    id: string
    title: string
    description: string
    difficulty: string
    schemaSql: string
    solutionQuery: string
    expectedResult: any[]
    createdAt: Date
}

export async function POST(request: NextRequest) {

    const session = await auth.api.getSession({ headers: request.headers })
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }


    try {
        const { problemId, query } = await request.json()

        if (!problemId || !query) {
            return NextResponse.json(
                { error: 'Problem ID and query are required' },
                { status: 400 }
            )
        }

        // Get problem from database
        const problem: Problem | any = await prisma.problem.findUnique({
            where: { id: problemId }
        })
        // console.log('Fetched problem:', problem) // Debug log

        if (!problem) {
            return NextResponse.json(
                { error: 'Problem not found' },
                { status: 404 }
            )
        }

        // Execute user's query against the problem's schema
        const { rows } = await executeUserQuery(
            problemId,
            query,
            problem.schemaSql
        )
        // console.log('User query executed. Rows returned:', rows)

        // Compare with expected results
        const comparison = compareResults(rows, problem.expectedResult as any[])
        // console.log('Comparison result:', comparison)
        // Store submission record (optional)
        await prisma.problemSubmission.create({
            data: {
                userId: session.user.id, // Replace with actual user ID from auth
                problemId,
                code: query,
                status: comparison.isCorrect ? 'ACCEPTED' : 'WRONG_ANSWER',
            }
        }).catch((err: Error) => console.error('Failed to save submission:', err))

        return NextResponse.json({
            success: true,
            isCorrect: comparison.isCorrect,
            message: comparison.message,
            rows: rows.slice(0, 100), // Return first 100 rows for display
            rowCount: rows.length,
            expectedRowCount: problem.expectedResult?.length || 0
        })
    } catch (error: any) {
        console.error('Submission error:', error)
        return NextResponse.json(
            {
                error: error.message || 'Failed to execute query',
                success: false
            },
            { status: 500 }
        )
    }
}