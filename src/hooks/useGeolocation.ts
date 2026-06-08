import { useState, useEffect } from 'react';

export interface GeoPosition {
  latitude: number;
  longitude: number;
}

export interface GeolocationState {
  position: GeoPosition | null;
  error: string | null;
  loading: boolean;
}

export function useGeolocation(): GeolocationState {
  const [state, setState] = useState<GeolocationState>({
    position: null,
    error: null,
    loading: true,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setState({ position: null, error: 'Geolocation not supported', loading: false });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setState({
          position: { latitude: pos.coords.latitude, longitude: pos.coords.longitude },
          error: null,
          loading: false,
        });
      },
      (err) => {
        setState({ position: null, error: err.message, loading: false });
      },
      { timeout: 10000 }
    );
  }, []);

  return state;
}
