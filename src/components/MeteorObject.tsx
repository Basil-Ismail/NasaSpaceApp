'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import { auVectorToScene } from '@/lib/units';
import { getRiskHexColor } from '@/lib/colors';
import { lerpTime, lerpVector } from '@/lib/time';
import { useSimStore } from '@/state/useSimStore';
import MeteorModel from './MeteorModel';

interface MeteorObjectProps {
  name: string;
  moidAu: number;
  selected?: boolean;
  slug?: string; // Add slug for position calculation
}

/**
 * MeteorObject component - renders animated meteor with realistic appearance
 * Position can come from live frames OR from trajectory data
 */
export default function MeteorObject({ name, moidAu, selected = false, slug }: MeteorObjectProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const trailRef = useRef<THREE.Points>(null);

  const frames = useSimStore((state) => state.frames);
  const currentTimeIso = useSimStore((state) => state.currentTimeIso);
  const playing = useSimStore((state) => state.playing);
  const speed = useSimStore((state) => state.speed);

  const color = getRiskHexColor(moidAu);

  // Calculate interpolated position from frames OR use trajectory
  const position = useMemo(() => {
    // If we have live frames, use them
    if (frames.length > 0) {
      if (frames.length === 1) {
        return auVectorToScene(frames[0].meteor.r_au);
      }

      // Find two frames bracketing current time
      let frame0 = frames[0];
      let frame1 = frames[frames.length - 1];

      for (let i = 0; i < frames.length - 1; i++) {
        const t0 = new Date(frames[i].t_iso).getTime();
        const t1 = new Date(frames[i + 1].t_iso).getTime();
        const tCurrent = new Date(currentTimeIso).getTime();

        if (tCurrent >= t0 && tCurrent <= t1) {
          frame0 = frames[i];
          frame1 = frames[i + 1];
          break;
        }
      }

      // Interpolate between frames
      const t = lerpTime(frame0.t_iso, frame1.t_iso, currentTimeIso);
      const interpolated = lerpVector(frame0.meteor.r_au, frame1.meteor.r_au, t);

      return auVectorToScene(interpolated);
    }

    // Fallback: Use slug to generate position if no frames
    if (slug) {
      const index = parseInt(slug.split('-')[1] || '0', 10) - 1;
      const orbitRadius = 0.05 + index * 0.01 + Math.sin(index) * 0.02;
      const orbitSpeed = 0.0005 / (1 + index * 0.05);
      const phase = (index * Math.PI * 2) / 20;
      const inclination = (index * Math.PI) / 15;

      const time = new Date(currentTimeIso).getTime() / 1000;
      const angle = time * orbitSpeed + phase;

      const x = orbitRadius * Math.cos(angle);
      const y = orbitRadius * 0.4 * Math.sin(angle * 1.5) * Math.cos(inclination);
      const z = orbitRadius * Math.sin(angle) * Math.sin(inclination);

      return auVectorToScene([x, y, z]);
    }

    return [0, 0, 0];
  }, [frames, currentTimeIso, slug]);

  // Create trail particles
  const trailGeometry = useMemo(() => {
    const particles = 20;
    const positions = new Float32Array(particles * 3);

    for (let i = 0; i < particles; i++) {
      // Trail behind the meteor
      const offset = -i * 0.05;
      positions[i * 3] = offset;
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = 0;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geometry;
  }, []);

  // Update mesh position and rotation
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.set(position[0], position[1], position[2]);
      // Rotation only when playing, scaled by speed
      if (playing) {
        meshRef.current.rotation.x += 0.01 * speed;
        meshRef.current.rotation.y += 0.015 * speed;
      }
    }

    if (glowRef.current) {
      glowRef.current.position.set(position[0], position[1], position[2]);
      // Pulsing glow effect - only when playing
      if (playing) {
        const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.1 + 1;
        glowRef.current.scale.setScalar(pulse);
      }
    }

    if (trailRef.current) {
      trailRef.current.position.set(position[0], position[1], position[2]);
      trailRef.current.lookAt(0, 0, 0); // Point towards Earth
    }
  });

  // Realistic size variation based on slug
  // Real meteors: 100m to 10km diameter vs Earth's 12,742km diameter
  // Scale: 0.00001 to 0.001 of Earth's radius for realism
  // But we'll make them slightly bigger for visibility: 0.0005 to 0.002
  const index = slug ? parseInt(slug.split('-')[1] || '1', 10) : 1;
  const baseSize = 0.0005 + (index % 10) * 0.00015; // Range: 0.0005 to 0.00185
  const size = selected ? baseSize * 2.5 : baseSize; // Enlarge selected meteor for visibility
  const glowSize = size * 3.0; // Larger glow for visibility

  return (
    <group>
      {/* Outer glow */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[glowSize, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={selected ? 0.3 : 0.15} />
      </mesh>

      {/* Main meteor body with model */}
      <MeteorModel
        position={[position[0], position[1], position[2]]}
        size={size}
        color={color}
        selected={selected}
        playing={playing}
        speed={speed}
      />

      {/* Particle trail */}
      {selected && (
        <points ref={trailRef} geometry={trailGeometry}>
          <pointsMaterial size={0.1} color={color} transparent opacity={0.6} sizeAttenuation />
        </points>
      )}

      {/* Label */}
      {selected && (
        <Html position={[position[0], position[1] + 1, position[2]]}>
          <div className="bg-black/80 text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap pointer-events-none border border-white/20">
            <div className="font-bold">{name}</div>
            <div className="text-xs text-gray-400">MOID: {moidAu.toFixed(4)} AU</div>
          </div>
        </Html>
      )}
    </group>
  );
}
