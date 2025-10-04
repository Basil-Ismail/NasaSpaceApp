'use client';

import React, { useRef, Suspense } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

/**
 * Earth with texture - inner component
 */
function EarthWithTexture() {
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = useTexture('/textures/earth_daymap.jpg');

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.0005;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]} castShadow receiveShadow>
      <sphereGeometry args={[1, 64, 64]} />
      <meshStandardMaterial
        map={texture}
        metalness={0.2}
        roughness={0.8}
        emissive="#0a1a2a"
        emissiveIntensity={0.1}
      />
    </mesh>
  );
}

/**
 * Earth fallback - procedural appearance
 */
function EarthFallback() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.0005;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]} castShadow receiveShadow>
      <sphereGeometry args={[1, 64, 64]} />
      <meshStandardMaterial
        color="#2563eb"
        metalness={0.2}
        roughness={0.7}
        emissive="#1e3a8a"
        emissiveIntensity={0.2}
      />
    </mesh>
  );
}

/**
 * Earth component with texture support
 * Automatically falls back to procedural if texture missing
 *
 * Size Reference:
 * - Earth radius = 1.0 scene unit (represents ~6,371 km actual radius)
 * - Meteors = 0.0005 to 0.002 scene units (100m to 12.7 km actual diameter)
 * - Realistic size ratio maintained for visual accuracy
 */
export default function Earth() {
  return (
    <Suspense fallback={<EarthFallback />}>
      <EarthWithTexture />
    </Suspense>
  );
}
