'use client';

import React, { useMemo } from 'react';
import { Line } from '@react-three/drei';
import { auVectorToScene } from '@/lib/units';
import { getRiskHexColor } from '@/lib/colors';
import type { TrajectoryPoint } from '@/types/api';

interface OrbitPathProps {
  points: TrajectoryPoint[];
  moidAu: number;
  visible?: boolean;
}

/**
 * OrbitPath component renders meteor's trajectory as a polyline
 * Downsamples points to improve performance
 */
export default function OrbitPath({ points, moidAu, visible = true }: OrbitPathProps) {
  const scenePoints = useMemo(() => {
    // Downsample: take every Nth point to reduce complexity
    const downsampleFactor = Math.max(1, Math.floor(points.length / 300));
    const sampled = points.filter((_, i) => i % downsampleFactor === 0);

    return sampled.map((p) => auVectorToScene(p.rAu));
  }, [points]);

  const color = getRiskHexColor(moidAu);

  if (!visible || scenePoints.length < 2) {
    return null;
  }

  return (
    <>
      {/* Main orbit line */}
      <Line points={scenePoints} color={color} lineWidth={2} transparent opacity={0.7} />

      {/* Subtle glow effect */}
      <Line points={scenePoints} color={color} lineWidth={4} transparent opacity={0.25} />
    </>
  );
}
