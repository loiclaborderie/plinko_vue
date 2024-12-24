export const DECIMAL_MUTIPLIER = 10000
// Helper Functions
export function paddify(decimal: number): number {
  return Math.round(decimal * DECIMAL_MUTIPLIER)
}

export function unpaddify(int: number): number {
  return Math.floor(int / DECIMAL_MUTIPLIER)
}
