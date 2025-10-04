'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

/**
 * Earth component with optional texture
 * Scale: Earth radius = 1 in scene units
 *
 * To use this version:
 * 1. Add earth_daymap.jpg to /public/textures/
 * 2. Replace the Earth.tsx import in SceneCanvas.tsx
 */
export default function EarthWithTexture() {
  const meshRef = useRef<THREE.Mesh>(null);

  // Load Earth texture (will show loading fallback if not found)
  const earthTexture = useTexture('/textures/earth_daymap.jpg', undefined, undefined, () =>
    console.warn('Earth texture not found')
  );

  // Rotate Earth slowly
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.001;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <sphereGeometry args={[1, 64, 64]} />
      <meshStandardMaterial
        map={earthTexture || undefined}
        color={earthTexture ? undefined : '#1e40af'}
        metalness={0.1}
        roughness={0.8}
      />
    </mesh>
  );
}
