import { useState, useEffect } from 'react';
import { fetchForecast } from '../api/openmeteo';
import type { ForecastResponse } from '../api/openmeteo';

interface WeatherState {
  data: ForecastResponse | null;
  error: string | null;
  loading: boolean;
}

const cache = new Map<string, { data: ForecastResponse; ts: number }>();
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

export function useWeather(
  latitude: number | null,
  longitude: number | null
): WeatherState {
  const [state, setState] = useState<WeatherState>({
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
    fetchForecast(latitude, longitude)
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
