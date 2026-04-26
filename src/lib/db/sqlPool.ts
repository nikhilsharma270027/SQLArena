// lib/db/sqlPool.ts
import { Pool } from 'pg'

// Create a dedicated read-only connection for user queries
export const sqlPool = new Pool({
  connectionString: process.env.DATABASE_URL,
  statement_timeout: 5000,      // 5 seconds max execution
  query_timeout: 5000,
  idle_in_transaction_session_timeout: 10000,
  max: 20,                       // Max connections
  allowExitOnIdle: true,
})