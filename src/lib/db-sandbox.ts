// lib/db-sandbox.ts
import { Pool } from "pg";

// Use a dedicated read‑only database user with statement timeout
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  statement_timeout: 5000, // 5 seconds
  idle_in_transaction_session_timeout: 5000,
});

export async function executeQuery(sql: string) {
  const client = await pool.connect();
  try {
    // Block dangerous commands (simple check)
    const dangerous = /(DROP|ALTER|CREATE|INSERT|UPDATE|DELETE|TRUNCATE|REPLACE)/i;
    if (dangerous.test(sql)) {
      throw new Error("Only SELECT queries are allowed");
    }
    const result = await client.query(sql);
    return result.rows;
  } finally {
    client.release();
  }
}