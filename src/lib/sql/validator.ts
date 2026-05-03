// lib/sql/validator.ts
export function validateSql(sql: string): { valid: boolean; error?: string } {
  const trimmed = sql.trim();
  
  if (!trimmed) {
    return { valid: false, error: 'Query cannot be empty' };
  }
  
  // Remove single-line comments (--)
  const withoutComments = trimmed.replace(/^--.*$/gm, '').trim();
  
  if (!withoutComments) {
    return { valid: false, error: 'Query cannot be empty' };
  }
  
  const upper = withoutComments.toUpperCase();

  // Check if it contains SELECT (not necessarily at the very start)
  if (!/\bSELECT\b/i.test(upper)) {
    return { valid: false, error: 'Only SELECT queries are allowed' };
  }

  // Block multiple statements (allow trailing semicolon)
  const withoutTrailingSemicolon = upper.replace(/;$/, '');
  if (withoutTrailingSemicolon.includes(';')) {
    return { valid: false, error: 'Multiple SQL statements are not allowed' };
  }

  // Block dangerous keywords
  const dangerous = /\b(DROP|ALTER|CREATE|INSERT|UPDATE|DELETE|TRUNCATE|MERGE|REPLACE|GRANT|REVOKE)\b/i;
  if (dangerous.test(upper)) {
    return { valid: false, error: 'Data modification commands are forbidden' };
  }

  return { valid: true };
}