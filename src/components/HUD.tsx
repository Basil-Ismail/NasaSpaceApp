'use client';

import React, { useEffect, useState } from 'react';
import { useSimStore } from '@/state/useSimStore';
import { useMeteor } from '@/lib/api';
import { formatIsoDate } from '@/lib/time';
import { formatDistance, formatDuration, formatNumber } from '@/lib/units';

/**
 * HUD component - displays current simulation info and results
 */
export default function HUD() {
  const selectedMeteorSlug = useSimStore((state) => state.selectedMeteorSlug);
  const currentTimeIso = useSimStore((state) => state.currentTimeIso);
  const rocket = useSimStore((state) => state.rocket);
  const error = useSimStore((state) => state.error);

  // Fix hydration error by only rendering time on client side
  const [mounted, setMounted] = useState(false);

  const { data: meteorDetail } = useMeteor(selectedMeteorSlug);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="absolute top-4 left-80 right-4 pointer-events-none">
      <div className="flex flex-col gap-3">
        {/* Current time - only render after client mount to avoid hydration mismatch */}
        {mounted && (
          <div className="bg-black/70 backdrop-blur-md text-white px-4 py-2 rounded-lg inline-block self-start">
            <div className="text-xs text-gray-400">Simulation Time</div>
            <div className="font-mono text-sm">{formatIsoDate(currentTimeIso)}</div>
          </div>
        )}

        {/* Selected meteor info */}
        {meteorDetail?.derived && meteorDetail?.elements && (
          <div className="bg-black/70 backdrop-blur-md text-white px-4 py-3 rounded-lg inline-block self-start max-w-md">
            <div className="font-bold text-lg mb-2">{meteorDetail.name}</div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
              <div>
                <span className="text-gray-400">MOID:</span>{' '}
                <span className="font-mono">
                  {formatNumber(meteorDetail.derived.moid_au, 4)} AU
                </span>
              </div>
              <div>
                <span className="text-gray-400">Period:</span>{' '}
                <span className="font-mono">
                  {formatNumber(meteorDetail.derived.period_years, 2)} yrs
                </span>
              </div>
              <div>
                <span className="text-gray-400">Eccentricity:</span>{' '}
                <span className="font-mono">{formatNumber(meteorDetail.elements.e, 3)}</span>
              </div>
              <div>
                <span className="text-gray-400">Inclination:</span>{' '}
                <span className="font-mono">{formatNumber(meteorDetail.elements.i, 2)}°</span>
              </div>
              <div>
                <span className="text-gray-400">Perihelion:</span>{' '}
                <span className="font-mono">{formatNumber(meteorDetail.derived.q, 3)} AU</span>
              </div>
              <div>
                <span className="text-gray-400">Aphelion:</span>{' '}
                <span className="font-mono">{formatNumber(meteorDetail.derived.Q, 3)} AU</span>
              </div>
            </div>
          </div>
        )}

        {/* Rocket result banner */}
        {rocket.result && (
          <div
            className={`
              backdrop-blur-md px-6 py-4 rounded-lg inline-block self-start
              ${rocket.result === 'hit' ? 'bg-green-500/90 text-white' : 'bg-red-500/90 text-white'}
            `}
          >
            <div className="font-bold text-xl mb-2">
              {rocket.result === 'hit' ? '🎯 Meteor Neutralized!' : '❌ Rocket Missed'}
            </div>
            {rocket.missDistanceKm !== undefined && (
              <div className="text-sm">Miss Distance: {formatDistance(rocket.missDistanceKm)}</div>
            )}
            {rocket.impactIso && (
              <div className="text-sm">
                {rocket.result === 'hit' ? 'Impact' : 'Closest approach'} Time:{' '}
                {formatIsoDate(rocket.impactIso)}
              </div>
            )}
            {rocket.simulationData && (
              <div className="text-sm">
                Time to Intercept:{' '}
                {formatDuration(rocket.simulationData.metrics.time_to_intercept_s)}
              </div>
            )}
          </div>
        )}

        {/* Error banner */}
        {error && (
          <div className="bg-red-500/90 backdrop-blur-md text-white px-6 py-3 rounded-lg inline-block self-start">
            <div className="font-bold">⚠️ Error</div>
            <div className="text-sm">{error}</div>
          </div>
        )}
      </div>
    </div>
  );
}
