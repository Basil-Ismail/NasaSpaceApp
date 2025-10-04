'use client';

import React from 'react';

/**
 * Legend component - displays risk color indicators
 */
export default function Legend() {
  return (
    <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-md text-white px-4 py-3 rounded-lg pointer-events-none">
      <div className="font-bold text-sm mb-2">Risk Level</div>
      <div className="space-y-1 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-risk-low" />
          <span>Low (≥0.05 AU)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-risk-medium" />
          <span>Medium (0.02-0.05 AU)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-risk-high" />
          <span>High (&lt;0.02 AU)</span>
        </div>
      </div>
    </div>
  );
}
