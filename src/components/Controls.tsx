'use client';

import React, { useState } from 'react';
import { useSimStore } from '@/state/useSimStore';
import { postSimulate } from '@/lib/api';
import { nowIso } from '@/lib/time';
import type { RocketParams } from '@/types/api';

/**
 * Controls component - playback controls and rocket simulation form
 */
export default function Controls() {
  const selectedMeteorSlug = useSimStore((state) => state.selectedMeteorSlug);
  const playing = useSimStore((state) => state.playing);
  const speed = useSimStore((state) => state.speed);
  const cameraMode = useSimStore((state) => state.cameraMode);
  const togglePlay = useSimStore((state) => state.togglePlay);
  const setSpeed = useSimStore((state) => state.setSpeed);
  const setCameraMode = useSimStore((state) => state.setCameraMode);
  const setRocketOutcome = useSimStore((state) => state.setRocketOutcome);
  const setError = useSimStore((state) => state.setError);

  const [simulating, setSimulating] = useState(false);
  const [rocketParams, setRocketParams] = useState<RocketParams>({
    v0_mps: 12000,
    burnSec: 60,
    dv_mps: 3000,
    strategy: 'lead',
  });

  const handleSimulate = async () => {
    if (!selectedMeteorSlug) {
      setError('Please select a meteor first');
      return;
    }

    setSimulating(true);
    setError(null);

    try {
      const result = await postSimulate({
        meteorId: selectedMeteorSlug,
        launchTimeIso: nowIso(),
        rocket: rocketParams,
      });

      setRocketOutcome(result);

      // Show success message
      if (result.result === 'hit') {
        setError(null);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Simulation failed');
    } finally {
      setSimulating(false);
    }
  };

  return (
    <div className="absolute bottom-0 left-80 right-0 bg-space-darker/90 backdrop-blur-md border-t border-white/10 p-4">
      <div className="max-w-6xl mx-auto flex flex-wrap items-center gap-4">
        {/* Playback controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={togglePlay}
            className={`
              px-4 py-2 rounded-lg font-semibold transition-all duration-200
              ${
                playing
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-green-500 hover:bg-green-600 text-white'
              }
            `}
          >
            {playing ? '⏸ Pause' : '▶ Play'}
          </button>

          <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1">
            {([1, 10, 60] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSpeed(s)}
                className={`
                  px-3 py-1 rounded text-sm font-medium transition-all
                  ${
                    speed === s
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-white/10'
                  }
                `}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="h-8 w-px bg-white/20" />

        {/* Camera view toggle */}
        <div className="flex items-center gap-2">
          <span className="text-gray-400 text-sm">View:</span>
          <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1">
            <button
              onClick={() => setCameraMode('earth')}
              className={`
                px-3 py-1 rounded text-sm font-medium transition-all
                ${
                  cameraMode === 'earth'
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                }
              `}
            >
              🌍 Earth
            </button>
            <button
              onClick={() => setCameraMode('meteor')}
              className={`
                px-3 py-1 rounded text-sm font-medium transition-all
                ${
                  cameraMode === 'meteor'
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                }
              `}
              disabled={!selectedMeteorSlug}
            >
              ☄️ Meteor
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="h-8 w-px bg-white/20" />

        {/* Rocket simulation form */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-400">v0 (m/s):</label>
            <input
              type="number"
              value={rocketParams.v0_mps}
              onChange={(e) => setRocketParams({ ...rocketParams, v0_mps: Number(e.target.value) })}
              className="w-20 px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm"
              disabled={simulating}
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-400">Burn (s):</label>
            <input
              type="number"
              value={rocketParams.burnSec}
              onChange={(e) =>
                setRocketParams({ ...rocketParams, burnSec: Number(e.target.value) })
              }
              className="w-16 px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm"
              disabled={simulating}
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-400">Δv (m/s):</label>
            <input
              type="number"
              value={rocketParams.dv_mps}
              onChange={(e) => setRocketParams({ ...rocketParams, dv_mps: Number(e.target.value) })}
              className="w-20 px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm"
              disabled={simulating}
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-400">Strategy:</label>
            <select
              value={rocketParams.strategy}
              onChange={(e) =>
                setRocketParams({
                  ...rocketParams,
                  strategy: e.target.value as 'lead' | 'direct',
                })
              }
              className="px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm"
              disabled={simulating}
            >
              <option value="lead">Lead</option>
              <option value="direct">Direct</option>
            </select>
          </div>

          <button
            onClick={handleSimulate}
            disabled={!selectedMeteorSlug || simulating}
            className={`
              px-4 py-2 rounded-lg font-semibold transition-all duration-200
              ${
                !selectedMeteorSlug || simulating
                  ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
                  : 'bg-cyan-500 hover:bg-cyan-600 text-white'
              }
            `}
          >
            {simulating ? '🚀 Launching...' : '🚀 Launch Rocket'}
          </button>
        </div>
      </div>
    </div>
  );
}
