// import { NextRequest, NextResponse } from 'next/server'
// import { executeQuery } from '@/src/lib/db-sandbox'

// export async function POST(req: NextRequest) {
//   try {
//     const { problemId, sql } = await req.json()

//     if (!problemId || !sql) {
//       return NextResponse.json({ error: 'Missing problemId or sql' }, { status: 400 })
//     }

//     const { rows, rowCount } = await executeQuery(problemId, sql)

//     return NextResponse.json({
//       success: true,
//       rowCount,
//       rows: rows.slice(0, 50), // return first 50 rows for display
//     })
//   } catch (err: any) {
//     return NextResponse.json({ error: err.message }, { status: 400 })
//   }
// }