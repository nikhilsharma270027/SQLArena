// lib/sqlExecutor.ts
import { Pool } from 'pg'
import { validateSql } from './sqlValidator'

const readOnlyPool = new Pool({
  connectionString: process.env.READONLY_DATABASE_URL,
  statement_timeout: 5000,
  query_timeout: 5000,
  idle_in_transaction_session_timeout: 10000,
  max: 20,
})

export async function executeQuery(
  problemId: string,
  userSql: string,
  options?: { addLimit?: boolean }   // 👈 new option
) {
  const { addLimit = true } = options || {}

  const validation = validateSql(userSql)
  if (!validation.valid) {
    throw new Error(validation.error)
  }

  // Remove trailing semicolon and whitespace
  let finalSql = userSql.trim().replace(/;+$/, '')

  // Add LIMIT only if requested and not already present
  if (addLimit && !/\bLIMIT\b/i.test(finalSql)) {
    finalSql = `${finalSql} LIMIT 1000`
  }

  const schemaName = `problem_${problemId}`
  const client = await readOnlyPool.connect()

  try {
    await client.query(`SET search_path TO ${schemaName}`)
    const result = await client.query(finalSql)
    return { rows: result.rows, rowCount: result.rowCount }
  } catch (err: any) {
    throw new Error(`SQL error: ${err.message}`)
  } finally {
    client.release()
  }
}