// scripts/fixManagerProblem.ts
import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const prisma = new PrismaClient()
const adminPool = new Pool({ connectionString: process.env.DATABASE_URL })

async function fix() {
  const problem = await prisma.problem.findFirst({
    where: { title: { contains: 'Manager' } }
  })
  if (!problem) {
    console.log('Problem not found')
    return
  }
  const schemaName = `problem_${problem.id}`
  console.log(`Fixing schema for ${problem.title} (${problem.id})`)

  await adminPool.query(`DROP SCHEMA IF EXISTS ${schemaName} CASCADE`)
  await adminPool.query(`CREATE SCHEMA ${schemaName}`)
  await adminPool.query(`SET search_path TO ${schemaName}; ${problem.schemaSql}`)
  await adminPool.query(`GRANT USAGE ON SCHEMA ${schemaName} TO sql_runner`)
  await adminPool.query(`GRANT SELECT ON ALL TABLES IN SCHEMA ${schemaName} TO sql_runner`)

  console.log('Schema recreated and permissions granted')
  await adminPool.end()
  await prisma.$disconnect()
}

fix()