'use client';

import React, { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import { auVectorToScene } from '@/lib/units';
import { useSimStore } from '@/state/useSimStore';

/**
 * RocketObject component - renders rocket and its path
 * Shows explosion effect on hit
 */
export default function RocketObject() {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const engineGlowRef = useRef<THREE.Mesh>(null);
  const [particles, setParticles] = useState<THREE.Vector3[]>([]);
  const [showExplosion, setShowExplosion] = useState(false);

  const rocket = useSimStore((state) => state.rocket);

  // Calculate current position during launch animation
  const position = useMemo(() => {
    if (rocket.launchStartTime && rocket.launchDuration && rocket.targetPosition) {
      const elapsed = Date.now() - rocket.launchStartTime;
      const progress = Math.min(elapsed / rocket.launchDuration, 1);

      // Smooth easing function (ease-in-out)
      const smoothProgress =
        progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      // Interpolate from Earth (0,0,0) to target position
      const earthPos = [0, 0, 0];
      const targetPos = rocket.targetPosition;

      return [
        earthPos[0] + (targetPos[0] - earthPos[0]) * smoothProgress,
        earthPos[1] + (targetPos[1] - earthPos[1]) * smoothProgress,
        earthPos[2] + (targetPos[2] - earthPos[2]) * smoothProgress,
      ];
    }

    if (!rocket.lastPoint) return [0, 0, 0];
    return auVectorToScene(rocket.lastPoint);
  }, [rocket.lastPoint, rocket.launchStartTime, rocket.launchDuration, rocket.targetPosition]);

  const impactPosition = useMemo(() => {
    if (!rocket.impactPoint) return null;
    return auVectorToScene(rocket.impactPoint);
  }, [rocket.impactPoint]);

  // Trigger explosion effect on hit
  useEffect(() => {
    if (rocket.result === 'hit' && impactPosition) {
      setShowExplosion(true);

      // Generate particle positions
      const particleCount = 50;
      const newParticles: THREE.Vector3[] = [];
      for (let i = 0; i < particleCount; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        const radius = Math.random() * 3;

        newParticles.push(
          new THREE.Vector3(
            impactPosition[0] + radius * Math.sin(phi) * Math.cos(theta),
            impactPosition[1] + radius * Math.sin(phi) * Math.sin(theta),
            impactPosition[2] + radius * Math.cos(phi)
          )
        );
      }
      setParticles(newParticles);

      // Hide explosion after 3 seconds
      setTimeout(() => setShowExplosion(false), 3000);
    }
  }, [rocket.result, impactPosition]);

  // Update rocket position and animate glow
  useFrame((state) => {
    if (meshRef.current && rocket.active) {
      meshRef.current.position.set(position[0], position[1], position[2]);

      // Orient rocket towards direction of travel
      const direction = new THREE.Vector3(position[0], position[1], position[2]).normalize();
      meshRef.current.lookAt(direction.multiplyScalar(100));
    }

    // Animate engine glow
    if (engineGlowRef.current && rocket.active) {
      const pulse = Math.sin(state.clock.elapsedTime * 10) * 0.2 + 0.8;
      engineGlowRef.current.scale.setScalar(pulse);
    }

    // Animate outer glow
    if (glowRef.current && rocket.active) {
      glowRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 3) * 0.1);
    }
  });

  if (!rocket.active && !rocket.result) {
    return null;
  }

  return (
    <group>
      {/* Rocket mesh - only show if active */}
      {rocket.active && (
        <>
          <mesh ref={meshRef} position={position}>
            <coneGeometry args={[0.3, 1.5, 8]} />
            <meshStandardMaterial
              color={0x00ffff}
              emissive={0x00ffff}
              emissiveIntensity={0.8}
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>

          {/* Outer glow */}
          <mesh ref={glowRef} position={position}>
            <coneGeometry args={[0.5, 2, 8]} />
            <meshBasicMaterial color={0x00ffff} transparent opacity={0.3} />
          </mesh>

          {/* Engine glow/exhaust */}
          <mesh ref={engineGlowRef} position={[position[0], position[1] - 0.8, position[2]]}>
            <sphereGeometry args={[0.4, 16, 16]} />
            <meshBasicMaterial color={0xff6600} transparent opacity={0.7} />
          </mesh>
        </>
      )}

      {/* Explosion particles on hit */}
      {showExplosion && impactPosition && (
        <group position={impactPosition}>
          {particles.map((pos, i) => (
            <mesh key={i} position={pos}>
              <sphereGeometry args={[0.1, 8, 8]} />
              <meshBasicMaterial color={0xff6600} transparent opacity={0.8} />
            </mesh>
          ))}
        </group>
      )}

      {/* Impact point marker */}
      {rocket.result === 'hit' && impactPosition && (
        <>
          <mesh position={impactPosition}>
            <sphereGeometry args={[0.5, 16, 16]} />
            <meshBasicMaterial color={0x00ff00} transparent opacity={0.3} wireframe />
          </mesh>
          <Html position={impactPosition}>
            <div className="bg-green-500/80 text-white px-3 py-1 rounded font-bold text-sm whitespace-nowrap pointer-events-none">
              ✓ HIT
            </div>
          </Html>
        </>
      )}

      {/* Miss marker */}
      {rocket.result === 'miss' && impactPosition && (
        <>
          <mesh position={impactPosition}>
            <sphereGeometry args={[0.5, 16, 16]} />
            <meshBasicMaterial color={0xff0000} transparent opacity={0.3} wireframe />
          </mesh>
          <Html position={impactPosition}>
            <div className="bg-red-500/80 text-white px-3 py-1 rounded font-bold text-sm whitespace-nowrap pointer-events-none">
              ✗ MISS
            </div>
          </Html>
        </>
      )}
    </group>
  );
}
