// scripts/resetDatabase.ts
import { Pool } from 'pg'
import dotenv from 'dotenv'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)
dotenv.config({ path: '.env.local' })

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
})

async function resetDatabase() {
  console.log('🔄 Starting complete database reset...')
  
  try {
    // Step 1: Recreate public schema
    console.log('1. Recreating public schema...')
    await pool.query(`
      DROP SCHEMA IF EXISTS public CASCADE;
      CREATE SCHEMA public;
      GRANT ALL ON SCHEMA public TO public;
      GRANT ALL ON SCHEMA public TO neondb_owner;
    `)
    console.log('   ✅ Public schema recreated')
    
    await pool.end()
    
    // Step 2: Push Prisma schema
    console.log('2. Pushing Prisma schema...')
    await execAsync('npx prisma db push')
    console.log('   ✅ Schema pushed')
    
    // Step 3: Generate Prisma client
    console.log('3. Generating Prisma client...')
    await execAsync('npx prisma generate')
    console.log('   ✅ Client generated')
    
    // Step 4: Seed problems
    console.log('4. Seeding problems...')
    await execAsync('npx tsx src/scripts/seedAllProblems.ts')
    console.log('   ✅ Problems seeded')
    
    console.log('\n🎉 Database reset complete!')
  } catch (error) {
    console.error('❌ Reset failed:', error)
  }
}

resetDatabase()