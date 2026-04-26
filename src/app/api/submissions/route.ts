// // app/api/submissions/route.ts
// import { NextRequest, NextResponse } from 'next/server'
// import { prisma } from '@/src/lib/prisma'
// import { executeUserQuery } from '@/src/lib/sql/executor'
// import { compareResults } from '@/src/lib/sql/comparator'

// export async function POST(request: NextRequest) {
//   try {
//     const { problemId, query } = await request.json()
    
//     if (!problemId || !query) {
//       return NextResponse.json(
//         { error: 'Problem ID and query are required' },
//         { status: 400 }
//       )
//     }
    
//     // Get problem from database
//     const problem = await prisma.problem.findUnique({
//       where: { id: problemId }
//     })
    
//     if (!problem) {
//       return NextResponse.json(
//         { error: 'Problem not found' },
//         { status: 404 }
//       )
//     }
    
//     // Execute user's query against the problem's schema
//     const { rows } = await executeUserQuery(
//       problemId,
//       query,
//       problem.schemaSql
//     )
    
//     // Compare with expected results
//     const comparison = compareResults(rows, problem.expectedResult as any[])
    
//     // Store submission record (optional)
//     await prisma.problemSubmission.create({
//       data: {
//         userId: 'temp_user_id', // Replace with actual user ID from auth
//         problemId,
//         code: query,
//         status: comparison.isCorrect ? 'ACCEPTED' : 'WRONG_ANSWER',
//       }
//     }).catch(err => console.error('Failed to save submission:', err))
    
//     return NextResponse.json({
//       success: true,
//       isCorrect: comparison.isCorrect,
//       message: comparison.message,
//       rows: rows.slice(0, 100), // Return first 100 rows for display
//       rowCount: rows.length,
//       expectedRowCount: problem.expectedResult?.length || 0
//     })
//   } catch (error: any) {
//     console.error('Submission error:', error)
//     return NextResponse.json(
//       { 
//         error: error.message || 'Failed to execute query',
//         success: false 
//       },
//       { status: 500 }
//     )
//   }
// }