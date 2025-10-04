'use client';

import { useRef, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { useSimStore } from '@/state/useSimStore';
import { auVectorToScene } from '@/lib/units';
import * as THREE from 'three';

/**
 * CameraController - manages camera position based on view mode
 * Only animates when switching views, otherwise lets OrbitControls handle it
 */
export default function CameraController({ controlsRef }: { controlsRef: React.RefObject<any> }) {
  const { camera } = useThree();
  const isAnimating = useRef(false);
  const animationProgress = useRef(0);
  const startPosition = useRef(new THREE.Vector3());
  const startTarget = useRef(new THREE.Vector3());
  const endPosition = useRef(new THREE.Vector3());
  const endTarget = useRef(new THREE.Vector3());

  const cameraMode = useSimStore((state) => state.cameraMode);
  const frames = useSimStore((state) => state.frames);
  const selectedMeteorSlug = useSimStore((state) => state.selectedMeteorSlug);

  // Start animation when camera mode changes
  useEffect(() => {
    if (!controlsRef.current) return;

    // Store starting position
    startPosition.current.copy(camera.position);
    startTarget.current.copy(controlsRef.current.target);

    if (cameraMode === 'earth') {
      // Earth view - wide angle
      endPosition.current.set(50, 30, 50);
      endTarget.current.set(0, 0, 0);
    } else if (cameraMode === 'meteor' && frames.length > 0) {
      // Meteor view - follow selected meteor
      const latestFrame = frames[frames.length - 1];
      if (latestFrame?.meteor) {
        const scenePos = auVectorToScene(latestFrame.meteor.r_au);
        endPosition.current.set(scenePos[0] + 5, scenePos[1] + 3, scenePos[2] + 5);
        endTarget.current.set(scenePos[0], scenePos[1], scenePos[2]);
      }
    }

    // Start animation
    isAnimating.current = true;
    animationProgress.current = 0;
  }, [cameraMode, selectedMeteorSlug]);

  // Animation loop
  useEffect(() => {
    if (!isAnimating.current || !controlsRef.current) return;

    const animate = () => {
      if (!isAnimating.current) return;

      animationProgress.current += 0.02; // 2% per frame

      if (animationProgress.current >= 1) {
        // Animation complete
        camera.position.copy(endPosition.current);
        controlsRef.current.target.copy(endTarget.current);
        controlsRef.current.update();
        isAnimating.current = false;
        return;
      }

      // Smooth easing
      const t = animationProgress.current;
      const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

      // Interpolate position and target
      camera.position.lerpVectors(startPosition.current, endPosition.current, eased);
      controlsRef.current.target.lerpVectors(startTarget.current, endTarget.current, eased);
      controlsRef.current.update();

      requestAnimationFrame(animate);
    };

    const animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [cameraMode, camera, controlsRef]);

  return null;
}
