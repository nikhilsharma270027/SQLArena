// scripts/utils/loadEnv.ts
import dotenv from 'dotenv'
import path from 'path'

// Load .env.local from the project root (two levels up from this script if placed in scripts/utils)
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL is not set. Check .env.local')
  process.exit(1)
}