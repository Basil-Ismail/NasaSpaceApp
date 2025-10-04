/**
 * Dummy data generator for multiple meteors
 * This provides fallback data until the real endpoint is ready
 */

import type { MeteorListItem, LiveFrame } from '@/types/api';

/**
 * Generate dummy meteor list (up to 20 meteors)
 */
export function generateDummyMeteors(count: number = 20): MeteorListItem[] {
  const meteors: MeteorListItem[] = [];

  const names = [
    'Apophis',
    'Bennu',
    'Ryugu',
    'Itokawa',
    'Eros',
    'Vesta',
    'Pallas',
    'Ceres',
    'Hygiea',
    'Juno',
    'Psyche',
    'Lutetia',
    'Ida',
    'Mathilde',
    'Gaspra',
    'Steins',
    'Toutatis',
    'Geographos',
    'Golevka',
    'Castalia',
  ];

  for (let i = 0; i < Math.min(count, 20); i++) {
    // Create more varied risk levels
    let riskLevel: number;
    if (i < 3) {
      // First 3: High risk (0.7 - 1.0)
      riskLevel = 0.7 + Math.random() * 0.3;
    } else if (i < 8) {
      // Next 5: Medium risk (0.3 - 0.7)
      riskLevel = 0.3 + Math.random() * 0.4;
    } else {
      // Rest: Low risk (0.0 - 0.3)
      riskLevel = Math.random() * 0.3;
    }

    // Vary MOID based on risk (higher risk = closer approach)
    const moidAu =
      riskLevel > 0.7
        ? 0.0001 + Math.random() * 0.003 // Very close (high risk)
        : riskLevel > 0.3
          ? 0.003 + Math.random() * 0.02 // Medium distance
          : 0.02 + Math.random() * 0.08; // Farther away

    meteors.push({
      slug: `meteor-${i + 1}`,
      name: names[i] || `Asteroid ${i + 1}`,
      derived: {
        moid_au: moidAu,
        v_rel_kms: 15 + Math.random() * 25, // 15-40 km/s
        tca_iso: new Date(Date.now() + Math.random() * 30 * 24 * 3600 * 1000).toISOString(),
        risk_score: riskLevel,
      },
    });
  }

  // Sort by risk score (highest first)
  return meteors.sort((a, b) => b.derived.risk_score - a.derived.risk_score);
}

/**
 * Generate dummy live frames for multiple meteors
 * Each frame contains positions for all active meteors
 */
export function generateDummyFrames(
  meteorSlugs: string[],
  timeIso: string
): Map<string, LiveFrame> {
  const frames = new Map<string, LiveFrame>();

  meteorSlugs.forEach((slug, index) => {
    // Generate orbital parameters for each meteor
    const orbitRadius = 0.01 + index * 0.005; // Varying orbit sizes
    const orbitSpeed = 0.001 / (1 + index * 0.1); // Varying speeds
    const phase = (index * Math.PI * 2) / meteorSlugs.length; // Distribute around orbit

    const time = new Date(timeIso).getTime() / 1000;
    const angle = time * orbitSpeed + phase;

    // Calculate position in AU
    const x = orbitRadius * Math.cos(angle);
    const y = orbitRadius * 0.3 * Math.sin(angle * 1.5); // Inclined orbit
    const z = orbitRadius * Math.sin(angle);

    frames.set(slug, {
      t_iso: timeIso,
      meteor: {
        r_au: [x, y, z],
      },
      rocket: null,
    });
  });

  return frames;
}

/**
 * Generate dummy trajectory points for a meteor
 */
export function generateDummyTrajectory(
  meteorSlug: string,
  fromIso: string,
  toIso: string,
  stepSec: number = 3600
) {
  const points = [];
  const start = new Date(fromIso).getTime();
  const end = new Date(toIso).getTime();

  // Get consistent orbit parameters based on meteor slug
  const index = parseInt(meteorSlug.split('-')[1] || '0') - 1;

  // Vary orbit sizes more dramatically (0.05 to 0.15 AU)
  const orbitRadius = 0.05 + index * 0.01 + Math.sin(index) * 0.02;
  const orbitSpeed = 0.0005 / (1 + index * 0.05);
  const phase = (index * Math.PI * 2) / 20;
  const inclination = (index * Math.PI) / 15; // Vary orbital plane

  for (let t = start; t <= end; t += stepSec * 1000) {
    const time = t / 1000;
    const angle = time * orbitSpeed + phase;

    // 3D elliptical orbit with inclination
    const x = orbitRadius * Math.cos(angle);
    const y = orbitRadius * 0.4 * Math.sin(angle * 1.5) * Math.cos(inclination);
    const z = orbitRadius * Math.sin(angle) * Math.sin(inclination);

    points.push({
      tIso: new Date(t).toISOString(),
      rAu: [x, y, z] as [number, number, number],
    });
  }

  return {
    meteorId: meteorSlug,
    from: fromIso,
    to: toIso,
    stepSec,
    points,
  };
}

/**
 * Check if we should use dummy data (when real API is not available)
 */
export function shouldUseDummyData(): boolean {
  // You can toggle this based on environment or API availability
  return process.env.NEXT_PUBLIC_USE_DUMMY_DATA === 'true' || false;
}
