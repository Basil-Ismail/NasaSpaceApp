// Global state management with Zustand
import { create } from 'zustand';
import type { LiveFrame, SimulateResponse } from '@/types/api';

export interface RocketState {
  active: boolean;
  launchStartTime?: number; // timestamp when launch started
  launchDuration?: number; // duration of launch animation in ms
  targetPosition?: [number, number, number]; // target meteor position
  lastPoint?: [number, number, number];
  result?: 'hit' | 'miss';
  impactIso?: string;
  impactPoint?: [number, number, number];
  missDistanceKm?: number;
  simulationData?: SimulateResponse;
}

export type CameraMode = 'earth' | 'meteor';

export interface SimState {
  // Selected meteor
  selectedMeteorSlug: string | null;

  // Playback state
  playing: boolean;
  speed: 1 | 10 | 60;
  currentTimeIso: string;

  // Camera mode
  cameraMode: CameraMode;

  // Live frames buffer (keep last 10 frames for interpolation)
  frames: LiveFrame[];
  maxFrames: number;

  // Rocket state
  rocket: RocketState;

  // Error state
  error: string | null;

  // Actions
  setSelectedMeteor: (slug: string | null) => void;
  togglePlay: () => void;
  setSpeed: (speed: 1 | 10 | 60) => void;
  setCurrentTime: (iso: string) => void;
  advanceTime: (deltaSec: number) => void;
  applyFrame: (frame: LiveFrame) => void;
  clearFrames: () => void;
  setRocketOutcome: (result: SimulateResponse) => void;
  launchRocket: (targetPosition: [number, number, number]) => void;
  clearRocket: () => void;
  setCameraMode: (mode: CameraMode) => void;
  setError: (error: string | null) => void;
}

export const useSimStore = create<SimState>((set, get) => ({
  selectedMeteorSlug: null,
  playing: false,
  speed: 1,
  currentTimeIso: new Date().toISOString(),
  cameraMode: 'earth',
  frames: [],
  maxFrames: 10,
  rocket: {
    active: false,
  },
  error: null,

  setSelectedMeteor: (slug) => {
    set({
      selectedMeteorSlug: slug,
      frames: [],
      rocket: { active: false },
      error: null,
    });
  },

  togglePlay: () => {
    set((state) => ({ playing: !state.playing }));
  },

  setSpeed: (speed) => {
    set({ speed });
  },

  setCurrentTime: (iso) => {
    set({ currentTimeIso: iso });
  },

  advanceTime: (deltaSec) => {
    const current = new Date(get().currentTimeIso);
    current.setSeconds(current.getSeconds() + deltaSec);
    set({ currentTimeIso: current.toISOString() });
  },

  applyFrame: (frame) => {
    set((state) => {
      const newFrames = [...state.frames, frame];

      // Keep only last N frames
      if (newFrames.length > state.maxFrames) {
        newFrames.shift();
      }

      // Update rocket state from frame
      const rocketUpdate: Partial<RocketState> = {};
      if (frame.rocket) {
        rocketUpdate.lastPoint = frame.rocket.r_au;
        rocketUpdate.active = frame.rocket.active;
      }

      return {
        frames: newFrames,
        currentTimeIso: frame.t_iso,
        rocket: {
          ...state.rocket,
          ...rocketUpdate,
        },
      };
    });
  },

  clearFrames: () => {
    set({ frames: [] });
  },

  setRocketOutcome: (result) => {
    set({
      rocket: {
        active: false,
        result: result.result,
        impactIso: result.t_impact_iso,
        impactPoint: result.intercept_point?.r_au,
        missDistanceKm: result.metrics.miss_distance_km,
        simulationData: result,
      },
    });
  },

  launchRocket: (targetPosition) => {
    set({
      rocket: {
        active: true,
        launchStartTime: Date.now(),
        launchDuration: 3000, // 3 second launch animation
        targetPosition,
        lastPoint: [0, 0, 0], // Start from Earth center
      },
    });
  },

  clearRocket: () => {
    set({
      rocket: {
        active: false,
      },
    });
  },

  setCameraMode: (mode) => {
    set({ cameraMode: mode });
  },

  setError: (error) => {
    set({ error });
  },
}));
