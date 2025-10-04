// API Response Types

export interface MeteorListItem {
  slug: string;
  name: string;
  moidAu: number; // Backend uses camelCase
  periodYears: number; // Backend uses camelCase
}

export interface OrbitalElements {
  a: number; // semi-major axis (AU)
  e: number; // eccentricity
  i: number; // inclination (degrees)
  omega: number; // longitude of ascending node (degrees)
  w: number; // argument of perihelion (degrees)
  M0: number; // mean anomaly at epoch (degrees)
  epoch: string; // ISO string
}

export interface DerivedOrbitalData {
  q: number; // perihelion distance (AU)
  Q: number; // aphelion distance (AU)
  moid_au: number; // minimum orbit intersection distance
  period_years: number;
}

export interface MeteorDetail {
  slug: string;
  name: string;
  elements: OrbitalElements;
  derived: DerivedOrbitalData;
}

export interface TrajectoryPoint {
  tIso: string; // Backend uses camelCase
  rAu: [number, number, number]; // Backend uses camelCase [x, y, z] in AU
}

export interface TrajectoryResponse {
  meteorSlug: string; // Backend uses camelCase
  fromIso: string; // Backend uses camelCase
  toIso: string; // Backend uses camelCase
  stepSec: number; // Backend uses camelCase
  points: TrajectoryPoint[];
}

export interface RocketParams {
  v0_mps: number;
  burnSec: number;
  dv_mps: number;
  strategy: 'lead' | 'direct';
}

export interface SimulateRequest {
  meteorId: string;
  launchTimeIso: string;
  rocket: RocketParams;
}

export interface InterceptPoint {
  r_au: [number, number, number];
  t_iso: string;
}

export interface SimulationMetrics {
  miss_distance_km: number;
  time_to_intercept_s: number;
}

export interface SimulateResponse {
  meteorId: string;
  result: 'hit' | 'miss';
  t_impact_iso?: string;
  intercept_point?: InterceptPoint;
  metrics: SimulationMetrics;
}

export interface LiveFrame {
  t_iso: string;
  meteor: {
    r_au: [number, number, number];
  };
  rocket?: {
    r_au: [number, number, number];
    active: boolean;
  };
}

export interface HealthResponse {
  status: string;
}
