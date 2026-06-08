import { useState, useEffect, useCallback, useRef } from 'react';

export interface GeoPosition {
  latitude: number;
  longitude: number;
}

export interface GeolocationState {
  position: GeoPosition | null;
  error: string | null;
  loading: boolean;
  permissionState: PermissionState | null;
  retry: () => void;
}

export function useGeolocation(): GeolocationState {
  const [position, setPosition] = useState<GeoPosition | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [permissionState, setPermissionState] = useState<PermissionState | null>(null);
  const permResultRef = useRef<PermissionStatus | null>(null);

  const request = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      },
      { timeout: 10000 }
    );
  }, []);

  // Track permission state
  useEffect(() => {
    navigator.permissions
      ?.query({ name: 'geolocation' })
      .then((result) => {
        permResultRef.current = result;
        setPermissionState(result.state);
        result.onchange = () => setPermissionState(result.state);
      })
      .catch(() => {
        // permissions API not available — leave as null
      });
    return () => {
      if (permResultRef.current) permResultRef.current.onchange = null;
    };
  }, []);

  // Initial request on mount
  useEffect(() => {
    request();
  }, [request]);

  return { position, error, loading, permissionState, retry: request };
}
