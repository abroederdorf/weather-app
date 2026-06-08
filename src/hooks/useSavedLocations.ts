import { useState, useCallback } from 'react';

export interface SavedLocation {
  id: string;
  name: string;
  region?: string;
  country: string;
  latitude: number;
  longitude: number;
}

const STORAGE_KEY = 'weather_saved_locations';

function loadFromStorage(): SavedLocation[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveToStorage(locations: SavedLocation[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(locations));
}

export function useSavedLocations() {
  const [locations, setLocations] = useState<SavedLocation[]>(loadFromStorage);

  const addLocation = useCallback((loc: Omit<SavedLocation, 'id'>) => {
    setLocations((prev) => {
      const exists = prev.some(
        (l) => Math.abs(l.latitude - loc.latitude) < 0.01 &&
               Math.abs(l.longitude - loc.longitude) < 0.01
      );
      if (exists) return prev;
      const next = [...prev, { ...loc, id: `${loc.latitude},${loc.longitude}` }];
      saveToStorage(next);
      return next;
    });
  }, []);

  const removeLocation = useCallback((id: string) => {
    setLocations((prev) => {
      const next = prev.filter((l) => l.id !== id);
      saveToStorage(next);
      return next;
    });
  }, []);

  return { locations, addLocation, removeLocation };
}
