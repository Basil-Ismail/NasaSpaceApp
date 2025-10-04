'use client';

import React, { Suspense, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import Earth from './Earth';
import OrbitPath from './OrbitPath';
import MeteorObject from './MeteorObject';
import RocketObject from './RocketObject';
import SpaceEnvironment from './SpaceEnvironment';
import CameraController from './CameraController';
import { useSimStore } from '@/state/useSimStore';
import { useMeteor, useMeteors } from '@/lib/api';
import { fetchTrajectory } from '@/lib/api';
import { nowIso, addSeconds } from '@/lib/time';
import { useEffect, useState } from 'react';
import type { TrajectoryResponse } from '@/types/api';

/**
 * SceneCanvas - Main 3D scene with Earth, meteors, and rockets
 */
export default function SceneCanvas() {
  const controlsRef = useRef<any>(null);
  const selectedMeteorSlug = useSimStore((state) => state.selectedMeteorSlug);
  const { data: meteorDetail } = useMeteor(selectedMeteorSlug);
  const { data: allMeteors } = useMeteors(); // Get all meteors
  const [trajectory, setTrajectory] = useState<TrajectoryResponse | null>(null);
  const [allTrajectories, setAllTrajectories] = useState<Map<string, TrajectoryResponse>>(
    new Map()
  );

  // Fetch trajectories for ALL meteors on mount
  useEffect(() => {
    if (!allMeteors || allMeteors.length === 0) return;

    const loadAllTrajectories = async () => {
      const from = nowIso();
      const to = addSeconds(from, 6 * 3600); // 6 hours ahead
      const trajectoryMap = new Map<string, TrajectoryResponse>();

      // Load first 10 meteors to avoid overwhelming the system
      const meteorsToLoad = allMeteors.slice(0, 10);

      await Promise.all(
        meteorsToLoad.map(async (meteor) => {
          try {
            const data = await fetchTrajectory(meteor.slug, {
              from,
              to,
              stepSec: 300, // 5 minute steps (less frequent for performance)
            });
            trajectoryMap.set(meteor.slug, data);
          } catch (error) {
            console.error(`Failed to load trajectory for ${meteor.slug}:`, error);
          }
        })
      );

      setAllTrajectories(trajectoryMap);
    };

    loadAllTrajectories();
  }, [allMeteors]);

  // Fetch detailed trajectory when meteor is selected
  useEffect(() => {
    if (!selectedMeteorSlug) {
      setTrajectory(null);
      return;
    }

    const loadTrajectory = async () => {
      try {
        const from = nowIso();
        const to = addSeconds(from, 6 * 3600); // 6 hours ahead
        const data = await fetchTrajectory(selectedMeteorSlug, {
          from,
          to,
          stepSec: 60, // 1 minute steps
        });
        setTrajectory(data);
      } catch (error) {
        console.error('Failed to load trajectory:', error);
      }
    };

    loadTrajectory();
  }, [selectedMeteorSlug]);

  return (
    <div className="w-full h-full">
      <Canvas
        camera={{
          position: [50, 30, 50],
          fov: 60,
        }}
        gl={{ antialias: true }}
        shadows
      >
        <Suspense fallback={null}>
          {/* Lighting setup for realistic space scene */}
          <ambientLight intensity={0.2} />

          {/* Sun-like light from one side */}
          <directionalLight
            position={[100, 50, 50]}
            intensity={2}
            castShadow
            shadow-mapSize={[2048, 2048]}
            shadow-camera-far={500}
            shadow-camera-left={-100}
            shadow-camera-right={100}
            shadow-camera-top={100}
            shadow-camera-bottom={-100}
          />

          {/* Fill light for visibility */}
          <pointLight position={[-50, -50, -50]} intensity={0.5} color="#4a5568" />

          {/* Subtle rim light */}
          <pointLight position={[0, 100, 0]} intensity={0.3} color="#93c5fd" />

          {/* Stars background */}
          <Stars radius={300} depth={60} count={8000} factor={5} saturation={0} fade speed={0.5} />

          {/* Space environment effects */}
          <SpaceEnvironment />

          {/* Earth */}
          <Earth />

          {/* Camera controller for view switching */}
          <CameraController controlsRef={controlsRef} />

          {/* Render ALL meteors with their orbits (first 10 for performance) */}
          {allMeteors?.slice(0, 10).map((meteor: any) => {
            const meteorTrajectory = allTrajectories.get(meteor.slug);
            const isSelected = meteor.slug === selectedMeteorSlug;

            return (
              <React.Fragment key={meteor.slug}>
                {/* Orbit path for this meteor */}
                {meteorTrajectory && meteor.derived && (
                  <OrbitPath
                    points={meteorTrajectory.points}
                    moidAu={meteor.derived.moid_au}
                    visible={true}
                  />
                )}

                {/* Meteor object with slug for position calculation */}
                {meteor.derived && (
                  <MeteorObject
                    name={meteor.name}
                    moidAu={meteor.derived.moid_au}
                    selected={isSelected}
                    slug={meteor.slug}
                  />
                )}
              </React.Fragment>
            );
          })}

          {/* Detailed orbit path for selected meteor */}
          {trajectory && meteorDetail?.derived && selectedMeteorSlug && (
            <OrbitPath
              points={trajectory.points}
              moidAu={meteorDetail.derived.moid_au}
              visible={true}
            />
          )}

          {/* Rocket */}
          <RocketObject />

          {/* Camera controls - works alongside CameraController */}
          <OrbitControls
            ref={controlsRef}
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={5}
            maxDistance={200}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
