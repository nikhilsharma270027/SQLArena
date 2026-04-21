function canonicalRow(row: Record<string, any>): string {
  const sortedKeys = Object.keys(row).sort()
  const ordered: Record<string, any> = {}
  for (const key of sortedKeys) {
    ordered[key] = row[key]
  }
  return JSON.stringify(ordered)
}

export function areResultsEqual(userRows: any[], expectedRows: any[]): boolean {
  if (userRows.length !== expectedRows.length) return false

  const userSet = new Set(userRows.map(canonicalRow))
  const expectedSet = new Set(expectedRows.map(canonicalRow))

  for (const row of expectedSet) {
    if (!userSet.has(row)) return false
  }
  return true
}