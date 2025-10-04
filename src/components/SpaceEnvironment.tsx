'use client';

import { useRef } from 'react';
import * as THREE from 'three';

/**
 * SpaceEnvironment adds atmospheric effects to the scene
 * Includes subtle fog and animated background elements
 */
export default function SpaceEnvironment() {
  const fogRef = useRef<THREE.Fog>(null);

  return (
    <>
      {/* Subtle space fog for depth */}
      <fog ref={fogRef} attach="fog" args={['#0a0a1a', 150, 400]} />

      {/* Color tone for the background */}
      <color attach="background" args={['#0a0a1a']} />
    </>
  );
}
