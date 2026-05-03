// scripts/fixAllProblemSchemas.ts
import './utils/loadEnv'
import { prisma } from '../lib/prisma'
import { Pool } from 'pg'

const adminPool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
})

async function fixAll() {
  const problems = await prisma.problem.findMany()
  console.log(`Found ${problems.length} problems. Ensuring schemas...`)

  for (const problem of problems) {
    const schemaName = `problem_${problem.id}`
    console.log(`\nProcessing: ${problem.title} (${problem.id})`)

    // Drop and recreate schema
    try {
      await adminPool.query(`DROP SCHEMA IF EXISTS ${schemaName} CASCADE`)
      await adminPool.query(`CREATE SCHEMA ${schemaName}`)
      await adminPool.query(`SET search_path TO ${schemaName}; ${problem.schemaSql}`)
      await adminPool.query(`GRANT USAGE ON SCHEMA ${schemaName} TO sql_runner`)
      await adminPool.query(`GRANT SELECT ON ALL TABLES IN SCHEMA ${schemaName} TO sql_runner`)

      // Verify the first table (employees or departments) exists
      const firstTableName = problem.schemaSql.match(/CREATE TABLE (\w+)/i)?.[1]
      if (firstTableName) {
        const check = await adminPool.query(
          `SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = $1 AND table_name = $2)`,
          [schemaName, firstTableName]
        )
        if (check.rows[0].exists) {
          console.log(`  ✅ Table "${firstTableName}" exists`)
        } else {
          console.log(`  ⚠️ Table "${firstTableName}" NOT found, but schemaSql may be multiple tables.`)
        }
      }

    } catch (err) {
      console.error(`  ❌ Failed to create schema for ${problem.title}:`, err)
    }
  }

  await adminPool.end()
  await prisma.$disconnect()
  console.log('\n✅ All schemas processed.')
}

fixAll().catch(console.error)