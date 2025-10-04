// Risk color scale based on MOID (Minimum Orbit Intersection Distance)

export type RiskLevel = 'low' | 'medium' | 'high';

/**
 * Get risk level from MOID in AU
 * green: ≥0.05 AU
 * yellow: 0.02–0.05 AU
 * red: <0.02 AU
 */
export function getRiskLevel(moidAu: number): RiskLevel {
  if (moidAu >= 0.05) return 'low';
  if (moidAu >= 0.02) return 'medium';
  return 'high';
}

/**
 * Get Tailwind color class for risk level
 */
export function getRiskColor(moidAu: number): string {
  const level = getRiskLevel(moidAu);
  const colors: Record<RiskLevel, string> = {
    low: 'bg-risk-low',
    medium: 'bg-risk-medium',
    high: 'bg-risk-high',
  };
  return colors[level];
}

/**
 * Get text color class for risk level
 */
export function getRiskTextColor(moidAu: number): string {
  const level = getRiskLevel(moidAu);
  const colors: Record<RiskLevel, string> = {
    low: 'text-risk-low',
    medium: 'text-risk-medium',
    high: 'text-risk-high',
  };
  return colors[level];
}

/**
 * Get hex color for risk level (for Three.js)
 */
export function getRiskHexColor(moidAu: number): number {
  const level = getRiskLevel(moidAu);
  const colors: Record<RiskLevel, number> = {
    low: 0x10b981, // green
    medium: 0xf59e0b, // yellow
    high: 0xef4444, // red
  };
  return colors[level];
}
