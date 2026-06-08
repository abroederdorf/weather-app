import { useState, useEffect } from 'react';
import { fetchAirQuality } from '../api/airquality';
import type { AirQualityResponse } from '../api/airquality';

interface AirQualityState {
  data: AirQualityResponse | null;
  error: string | null;
  loading: boolean;
}

const cache = new Map<string, { data: AirQualityResponse; ts: number }>();
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

export function useAirQuality(
  latitude: number | null,
  longitude: number | null
): AirQualityState {
  const [state, setState] = useState<AirQualityState>({
    data: null,
    error: null,
    loading: false,
  });

  useEffect(() => {
    if (latitude === null || longitude === null) return;

    const key = `${latitude.toFixed(4)},${longitude.toFixed(4)}`;
    const cached = cache.get(key);
    if (cached && Date.now() - cached.ts < CACHE_TTL) {
      setState({ data: cached.data, error: null, loading: false });
      return;
    }

    setState((s) => ({ ...s, loading: true, error: null }));
    fetchAirQuality(latitude, longitude)
      .then((data) => {
        cache.set(key, { data, ts: Date.now() });
        setState({ data, error: null, loading: false });
      })
      .catch((err) => {
        setState({ data: null, error: err.message, loading: false });
      });
  }, [latitude, longitude]);

  return state;
}
