'use client';

import React, { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import Sidebar from '@/components/Sidebar';
import Controls from '@/components/Controls';
import HUD from '@/components/HUD';
import Legend from '@/components/Legend';
import { useSimStore } from '@/state/useSimStore';
import { LiveStreamManager } from '@/lib/ws';

// Dynamically import SceneCanvas to avoid SSR issues with Three.js
const SceneCanvas = dynamic(() => import('@/components/SceneCanvas'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center text-white">
      Loading 3D Scene...
    </div>
  ),
});

export default function Home() {
  const selectedMeteorSlug = useSimStore((state) => state.selectedMeteorSlug);
  const playing = useSimStore((state) => state.playing);
  const speed = useSimStore((state) => state.speed);
  const advanceTime = useSimStore((state) => state.advanceTime);
  const applyFrame = useSimStore((state) => state.applyFrame);
  const setError = useSimStore((state) => state.setError);

  const wsManagerRef = useRef<LiveStreamManager | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef<number>(Date.now());

  // Initialize WebSocket manager
  useEffect(() => {
    wsManagerRef.current = new LiveStreamManager();
    return () => {
      wsManagerRef.current?.close();
    };
  }, []);

  // Connect/disconnect WebSocket based on playing state and selected meteor
  useEffect(() => {
    if (!selectedMeteorSlug || !playing) {
      wsManagerRef.current?.close();
      return;
    }

    wsManagerRef.current?.connect({
      meteorId: selectedMeteorSlug,
      onFrame: (frame) => {
        applyFrame(frame);
      },
      onError: (error) => {
        console.error('WebSocket error:', error);
        setError('WebSocket connection error');
      },
      onClose: () => {
        console.log('WebSocket closed');
      },
    });

    return () => {
      wsManagerRef.current?.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMeteorSlug, playing]);

  // Animation loop for time advancement
  useEffect(() => {
    if (!playing) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      return;
    }

    const animate = () => {
      const now = Date.now();
      const deltaMs = now - lastFrameTimeRef.current;
      lastFrameTimeRef.current = now;

      // Advance time based on speed (deltaMs is in real time, multiply by speed)
      const deltaSeconds = (deltaMs / 1000) * speed;
      advanceTime(deltaSeconds);

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    lastFrameTimeRef.current = Date.now();
    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, speed]);

  return (
    <main className="w-screen h-screen overflow-hidden relative">
      {/* Sidebar */}
      <Sidebar />

      {/* 3D Scene */}
      <div className="absolute top-0 left-80 right-0 bottom-0">
        <SceneCanvas />
      </div>

      {/* HUD Overlay */}
      <HUD />

      {/* Legend */}
      <Legend />

      {/* Controls */}
      <Controls />
    </main>
  );
}
