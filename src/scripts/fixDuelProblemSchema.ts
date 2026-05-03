// scripts/fixDuelProblemSchema.ts
import './utils/loadEnv'  // ensure env is loaded
import { prisma } from '../lib/prisma'  // import your existing prisma instance
import { Pool } from 'pg'
import path from 'path'

const adminPool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
})

async function fix() {
  // Use the problem ID from your logs
  const problemId = 'cmopsdn4i0000rcv58cg4ka7l'
  
  const problem = await prisma.problem.findUnique({ where: { id: problemId } })
  if (!problem) {
    console.error('Problem not found. Make sure the ID is correct.')
    return
  }

  const schemaName = `problem_${problem.id}`
  console.log(`Recreating schema ${schemaName} for: ${problem.title}`)

  // Drop and recreate schema
  await adminPool.query(`DROP SCHEMA IF EXISTS ${schemaName} CASCADE`)
  await adminPool.query(`CREATE SCHEMA ${schemaName}`)
  await adminPool.query(`SET search_path TO ${schemaName}; ${problem.schemaSql}`)

  // Grant permissions to read‑only user
  await adminPool.query(`GRANT USAGE ON SCHEMA ${schemaName} TO sql_runner`)
  await adminPool.query(`GRANT SELECT ON ALL TABLES IN SCHEMA ${schemaName} TO sql_runner`)

  console.log('✅ Schema recreated and permissions granted')
  await adminPool.end()
  await prisma.$disconnect()
}

fix().catch(console.error)