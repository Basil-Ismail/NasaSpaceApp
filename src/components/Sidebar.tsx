'use client';

import React from 'react';
import { useMeteors } from '@/lib/api';
import { useSimStore } from '@/state/useSimStore';
import { getRiskColor, getRiskLevel } from '@/lib/colors';
import { formatNumber } from '@/lib/units';

/**
 * Sidebar component - displays list of meteors with risk indicators
 */
export default function Sidebar() {
  const { data: meteors, error, isLoading } = useMeteors();
  const selectedMeteorSlug = useSimStore((state) => state.selectedMeteorSlug);
  const setSelectedMeteor = useSimStore((state) => state.setSelectedMeteor);

  if (isLoading) {
    return (
      <div className="w-80 bg-space-darker/90 backdrop-blur-md border-r border-white/10 p-4">
        <h2 className="text-xl font-bold text-white mb-4">Meteors</h2>
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-80 bg-space-darker/90 backdrop-blur-md border-r border-white/10 p-4">
        <h2 className="text-xl font-bold text-white mb-4">Meteors</h2>
        <div className="text-red-400">Failed to load meteors</div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-space-darker/90 backdrop-blur-md border-r border-white/10 p-4 overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">Meteors</h2>
        <div className="bg-blue-500/20 text-blue-300 text-xs px-2 py-1 rounded-full font-bold">
          {meteors?.length || 0}
        </div>
      </div>

      <div className="space-y-2">
        {meteors?.map((meteor) => {
          const isSelected = meteor.slug === selectedMeteorSlug;
          const moidAu = meteor.moidAu; // Backend uses camelCase
          const riskLevel = getRiskLevel(moidAu);

          return (
            <button
              key={meteor.slug}
              onClick={() => setSelectedMeteor(meteor.slug)}
              className={`
                w-full text-left p-3 rounded-lg transition-all duration-200
                border
                ${
                  isSelected
                    ? 'bg-blue-500/30 border-blue-400/50'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }
              `}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-white truncate">{meteor.name}</div>
                  <div className="text-xs text-gray-400 mt-1">
                    MOID: {formatNumber(moidAu, 4)} AU
                  </div>
                  <div className="text-xs text-gray-400">
                    Period: {formatNumber(meteor.periodYears, 1)} years
                  </div>
                </div>
                <div
                  className={`
                    w-3 h-3 rounded-full flex-shrink-0 mt-1
                    ${getRiskColor(moidAu)}
                  `}
                  title={`Risk: ${riskLevel}`}
                />
              </div>
            </button>
          );
        })}
      </div>

      {meteors && meteors.length === 0 && (
        <div className="text-gray-400 text-sm">No meteors available</div>
      )}
    </div>
  );
}
