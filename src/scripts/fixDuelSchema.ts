import './utils/loadEnv'
import { prisma } from '../lib/prisma'
import { Pool } from 'pg'

const adminPool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
})

async function fix() {
  // Find the problem with "Manager" in the title (your duel problem)
  const problem = await prisma.problem.findFirst({
    where: { title: { contains: 'Manager' } }
  })

  if (!problem) {
    console.error('❌ No "Manager" problem found. Please check your problems.')
    return
  }

  console.log(`🔧 Fixing schema for problem: ${problem.title} (${problem.id})`)

  const schemaName = `problem_${problem.id}`

  // Drop and recreate schema
  await adminPool.query(`DROP SCHEMA IF EXISTS ${schemaName} CASCADE`)
  await adminPool.query(`CREATE SCHEMA ${schemaName}`)
  await adminPool.query(`SET search_path TO ${schemaName}; ${problem.schemaSql}`)

  // Grant permissions to read‑only user
  await adminPool.query(`GRANT USAGE ON SCHEMA ${schemaName} TO sql_runner`)
  await adminPool.query(`GRANT SELECT ON ALL TABLES IN SCHEMA ${schemaName} TO sql_runner`)

  // Verify the table exists
  const check = await adminPool.query(
    `SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = $1 AND table_name = 'employees')`,
    [schemaName]
  )
  if (check.rows[0].exists) {
    console.log(`✅ Table "employees" found in schema ${schemaName}`)
  } else {
    console.error(`❌ Table "employees" NOT found in schema ${schemaName}. Check your schemaSql.`)
  }

  await adminPool.end()
  await prisma.$disconnect()
}

fix().catch(console.error)