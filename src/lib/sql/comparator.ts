// lib/sql/comparator.ts
function canonicalizeRow(row: Record<string, any>): string {
  // Sort keys for consistent comparison
  const sortedKeys = Object.keys(row).sort()
  const ordered: Record<string, any> = {}
  for (const key of sortedKeys) {
    ordered[key] = row[key]
  }
  return JSON.stringify(ordered)
}

export function compareResults(
  userRows: any[], 
  expectedRows: any[]
): { isCorrect: boolean; message: string } {
  // Check row count
  if (userRows.length !== expectedRows.length) {
    return {
      isCorrect: false,
      message: `Row count mismatch: Got ${userRows.length}, expected ${expectedRows.length}`
    }
  }
  
  // Check data equality (order-independent)
  const userSet = new Set(userRows.map(canonicalizeRow))
  const expectedSet = new Set(expectedRows.map(canonicalizeRow))
  
  for (const row of expectedSet) {
    if (!userSet.has(row)) {
      return {
        isCorrect: false,
        message: 'Result data does not match expected output'
      }
    }
  }
  
  return {
    isCorrect: true,
    message: 'Correct! Your query returned the expected results.'
  }
}