// lib/sql/executor.ts
import { sqlPool } from '../db/sqlPool'
import { validateSql } from './validator';
import { prisma } from '../prisma'

export async function executeUserQuery(
  problemId: string,
  userSql: string,
  schemaSql?: string
): Promise<{ rows: any[]; rowCount: number }> {
  const validation = validateSql(userSql)
  if (!validation.valid) {
    throw new Error(validation.error)
  }

  const client = await sqlPool.connect()
  
  try {
    // If schemaSql not provided, fetch from database and use persistent schema
    if (!schemaSql) {
      const problem = await prisma.problem.findUnique({
        where: { id: problemId }
      })
      
      if (!problem) {
        throw new Error(`Problem with ID ${problemId} not found`)
      }
      
      schemaSql = problem.schemaSql
    }
    
    // Use persistent schema: problem_${problemId}
    const schemaName = `problem_${problemId}`
    
    // Check if schema exists, if not create it
    const schemaExists = await client.query(
      `SELECT EXISTS (SELECT FROM information_schema.schemata WHERE schema_name = $1)`,
      [schemaName]
    )
    
    if (!schemaExists.rows[0].exists) {
      // Create schema and setup tables
      await client.query(`CREATE SCHEMA IF NOT EXISTS ${schemaName}`)
      await client.query(`SET search_path TO ${schemaName}; ${schemaSql}`)
    } else {
      // Just set the search path to existing schema
      await client.query(`SET search_path TO ${schemaName}`)
    }
    
    // Clean and prepare the SQL
    let finalSql = userSql.trim().replace(/;+$/, '')
    
    // Add LIMIT if not present (prevent huge result sets)
    if (!/\bLIMIT\b/i.test(finalSql)) {
      finalSql = `${finalSql} LIMIT 1000`
    }
    
    // Execute user query
    const result = await client.query(finalSql)
    
    return { 
      rows: result.rows, 
      rowCount: result.rowCount || 0 
    }
  } catch (err: any) {
    throw new Error(`SQL Error: ${err.message}`)
  } finally {
    client.release()
  }
}