export function validateSql(sql: string): { valid: boolean; error?: string } {
  const trimmed = sql.trim()
  const upper = trimmed.toUpperCase()

  // Must start with SELECT
  if (!/^SELECT\s/i.test(upper)) {
    return { valid: false, error: 'Only SELECT queries are allowed' }
  }

  // Block multiple statements (basic)
  if (upper.includes(';') && !upper.endsWith(';')) {
    return { valid: false, error: 'Multiple SQL statements are not allowed' }
  }

  // Block dangerous keywords (extra safety)
  const dangerous = /\b(DROP|ALTER|CREATE|INSERT|UPDATE|DELETE|TRUNCATE|MERGE|REPLACE)\b/i
  if (dangerous.test(upper)) {
    return { valid: false, error: 'Data modification commands are forbidden' }
  }

  return { valid: true }
}