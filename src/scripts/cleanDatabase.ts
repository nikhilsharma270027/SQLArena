// scripts/cleanDatabase.ts
import { Pool } from 'pg'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
})

async function cleanDatabase() {
  console.log('🧹 Cleaning database...')
  
  try {
    // Drop all tables and enums
    await pool.query(`
      DO $$ DECLARE
        r RECORD;
      BEGIN
        FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
          EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
        END LOOP;
        
        FOR r IN (SELECT typname FROM pg_type WHERE typcategory = 'E' AND typnamespace = 'public'::regnamespace) LOOP
          EXECUTE 'DROP TYPE IF EXISTS ' || quote_ident(r.typname) || ' CASCADE';
        END LOOP;
      END $$;
    `)
    
    console.log('✅ Database cleaned successfully!')
  } catch (error) {
    console.error('❌ Cleanup failed:', error)
  } finally {
    await pool.end()
  }
}

cleanDatabase()