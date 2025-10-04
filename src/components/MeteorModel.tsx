'use client';

import { useRef, Suspense } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

interface MeteorModelProps {
  position: [number, number, number];
  size: number;
  color: string;
  selected: boolean;
  playing: boolean;
  speed: number;
}

/**
 * MeteorModelWithTexture - Realistic meteor/asteroid with texture
 */
function MeteorModelWithTexture({
  position,
  size,
  color,
  selected,
  playing,
  speed,
}: MeteorModelProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = useTexture('/textures/asteroid.jpg');

  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

  useFrame(() => {
    if (meshRef.current && playing) {
      meshRef.current.rotation.x += 0.01 * speed;
      meshRef.current.rotation.y += 0.015 * speed;
    }
  });

  return (
    <mesh ref={meshRef} position={position} castShadow>
      <dodecahedronGeometry args={[size, 1]} />
      <meshStandardMaterial
        map={texture}
        color={color}
        emissive={color}
        emissiveIntensity={selected ? 0.4 : 0.2}
        metalness={0.6}
        roughness={0.8}
      />
    </mesh>
  );
}

/**
 * MeteorModelFallback - Procedural meteor without texture
 */
function MeteorModelFallback({
  position,
  size,
  color,
  selected,
  playing,
  speed,
}: MeteorModelProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (meshRef.current && playing) {
      meshRef.current.rotation.x += 0.01 * speed;
      meshRef.current.rotation.y += 0.015 * speed;
    }
  });

  return (
    <mesh ref={meshRef} position={position} castShadow>
      <dodecahedronGeometry args={[size, 1]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={selected ? 0.6 : 0.3}
        metalness={0.7}
        roughness={0.4}
      />
    </mesh>
  );
}

/**
 * MeteorModel - Main component with Suspense boundary
 */
export default function MeteorModel(props: MeteorModelProps) {
  return (
    <Suspense fallback={<MeteorModelFallback {...props} />}>
      <MeteorModelWithTexture {...props} />
    </Suspense>
  );
}
