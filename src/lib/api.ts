// REST API client with SWR hooks
import useSWR from 'swr';
import axios from 'axios';
import type {
  MeteorListItem,
  MeteorDetail,
  TrajectoryResponse,
  SimulateRequest,
  SimulateResponse,
  HealthResponse,
} from '@/types/api';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Generic fetcher for SWR
const fetcher = async (url: string) => {
  try {
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || error.message);
    }
    throw error;
  }
};

/**
 * Hook to fetch health status
 */
export function useHealth() {
  return useSWR<HealthResponse>('/health', fetcher, {
    refreshInterval: 30000,
    revalidateOnFocus: false,
  });
}

/**
 * Hook to fetch all meteors from real API
 */
export function useMeteors() {
  return useSWR<MeteorListItem[]>('/meteors', fetcher, {
    revalidateOnFocus: false,
    refreshInterval: 60000, // Refresh every minute
  });
}

/**
 * Hook to fetch a specific meteor
 */
export function useMeteor(slug: string | null) {
  return useSWR<MeteorDetail>(slug ? `/meteors/${slug}` : null, fetcher, {
    revalidateOnFocus: false,
  });
}

/**
 * Fetch trajectory data from real API
 */
export async function fetchTrajectory(
  slug: string,
  params: {
    from: string;
    to: string;
    stepSec?: number;
  }
): Promise<TrajectoryResponse> {
  const response = await api.get<TrajectoryResponse>(`/meteors/${slug}/trajectory`, {
    params: {
      from: params.from,
      to: params.to,
      stepSec: params.stepSec || 120, // Default 2 minutes for smooth animation
    },
  });
  return response.data;
}

/**
 * Post simulation request (imperative)
 */
export async function postSimulate(request: SimulateRequest): Promise<SimulateResponse> {
  try {
    const response = await api.post<SimulateResponse>('/simulate', request);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Simulation failed: ${error.response?.data?.message || error.message}`);
    }
    throw error;
  }
}

/**
 * Error handler helper
 */
export function handleApiError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unknown error occurred';
}
