// scripts/fullReset.ts
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

async function fullReset() {
  console.log('🔄 Full database reset...\n')
  
  try {
    // 1. Recreate schema
    console.log('1. Recreating public schema...')
    await pool.query(`
      DROP SCHEMA IF EXISTS public CASCADE;
      CREATE SCHEMA public;
      GRANT ALL ON SCHEMA public TO public;
      GRANT ALL ON SCHEMA public TO CURRENT_USER;
    `)
    console.log('   ✅ Schema recreated\n')
    
    await pool.end()
    
    // 2. Push Prisma schema
    console.log('2. Pushing Prisma schema...')
    const { stdout } = await execAsync('npx prisma db push')
    console.log('   ✅ Schema pushed\n')
    
    // 3. Generate client
    console.log('3. Generating Prisma client...')
    await execAsync('npx prisma generate')
    console.log('   ✅ Client generated\n')
    
    // 4. Seed problems
    console.log('4. Seeding problems...')
    await execAsync('npx tsx src/scripts/seedAllProblems.ts')
    console.log('   ✅ Problems seeded\n')
    
    console.log('🎉 Complete! Database is ready.')
  } catch (error) {
    console.error('❌ Reset failed:', error)
  }
}

fullReset()