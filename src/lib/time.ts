// Time utilities

/**
 * Parse ISO string to Date
 */
export function parseIso(iso: string): Date {
  return new Date(iso);
}

/**
 * Format Date to ISO string
 */
export function toIso(date: Date): string {
  return date.toISOString();
}

/**
 * Get current time as ISO string
 */
export function nowIso(): string {
  return new Date().toISOString();
}

/**
 * Add seconds to ISO string
 */
export function addSeconds(iso: string, seconds: number): string {
  const date = parseIso(iso);
  date.setSeconds(date.getSeconds() + seconds);
  return toIso(date);
}

/**
 * Calculate difference in seconds between two ISO strings
 */
export function diffSeconds(isoA: string, isoB: string): number {
  return (parseIso(isoA).getTime() - parseIso(isoB).getTime()) / 1000;
}

/**
 * Linear interpolation between two times
 * @param t0 Start time ISO
 * @param t1 End time ISO
 * @param tCurrent Current time ISO
 * @returns interpolation factor [0, 1]
 */
export function lerpTime(t0: string, t1: string, tCurrent: string): number {
  const start = parseIso(t0).getTime();
  const end = parseIso(t1).getTime();
  const current = parseIso(tCurrent).getTime();

  if (end <= start) return 1;
  const t = (current - start) / (end - start);
  return Math.max(0, Math.min(1, t));
}

/**
 * Linear interpolation between two vectors
 */
export function lerpVector(
  v0: [number, number, number],
  v1: [number, number, number],
  t: number
): [number, number, number] {
  return [v0[0] + (v1[0] - v0[0]) * t, v0[1] + (v1[1] - v0[1]) * t, v0[2] + (v1[2] - v0[2]) * t];
}

/**
 * Format ISO date to readable string
 */
export function formatIsoDate(iso: string): string {
  const date = parseIso(iso);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}
