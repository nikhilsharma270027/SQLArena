// lib/sql/executor.ts
import { sqlPool } from '../db/sqlPool'
import { validateSql } from './validator';

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
    // Create a temporary schema for this problem if schemaSql provided
    if (schemaSql) {
      const schemaName = `temp_${problemId}_${Date.now()}`
      
      // Create temporary schema
      await client.query(`CREATE SCHEMA IF NOT EXISTS ${schemaName}`)
      await client.query(`SET search_path TO ${schemaName}`)
      
      // Execute schema setup
      await client.query(schemaSql)
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