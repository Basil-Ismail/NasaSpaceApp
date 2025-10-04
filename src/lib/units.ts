// Unit conversions and formatters

export const AU_TO_KM = 149597870.7;
export const EARTH_RADIUS_KM = 6371;

// Scene scaling: 1 AU = 100 Earth radii in scene units
export const SCENE_SCALE = 100;
export const AU_TO_SCENE = SCENE_SCALE;

/**
 * Convert AU to kilometers
 */
export function auToKm(au: number): number {
  return au * AU_TO_KM;
}

/**
 * Convert AU to scene units
 */
export function auToScene(au: number): number {
  return au * AU_TO_SCENE;
}

/**
 * Convert AU vector to scene units
 */
export function auVectorToScene(rAu: [number, number, number]): [number, number, number] {
  return [rAu[0] * AU_TO_SCENE, rAu[1] * AU_TO_SCENE, rAu[2] * AU_TO_SCENE];
}

/**
 * Format distance in km with appropriate units
 */
export function formatDistance(km: number): string {
  if (km < 1) {
    return `${(km * 1000).toFixed(0)} m`;
  } else if (km < 1000) {
    return `${km.toFixed(1)} km`;
  } else if (km < 1000000) {
    return `${(km / 1000).toFixed(1)}K km`;
  } else {
    return `${(km / 1000000).toFixed(2)}M km`;
  }
}

/**
 * Format time duration in seconds
 */
export function formatDuration(seconds: number): string {
  if (seconds < 60) {
    return `${Math.floor(seconds)}s`;
  } else if (seconds < 3600) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}m ${secs}s`;
  } else {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${mins}m`;
  }
}

/**
 * Format number with precision
 */
export function formatNumber(value: number, decimals: number = 2): string {
  return value.toFixed(decimals);
}
