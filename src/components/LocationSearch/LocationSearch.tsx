import { useState, useEffect, useRef } from 'react';
import { searchLocations, reverseGeocode } from '../../api/geocoding';
import type { GeoResult } from '../../api/geocoding';
import type { SavedLocation } from '../../hooks/useSavedLocations';
import styles from './LocationSearch.module.css';

interface Props {
  onAdd: (loc: Omit<SavedLocation, 'id'>) => void;
  onClose: () => void;
}

function parseLatLon(query: string): { lat: number; lon: number } | null {
  const match = query.trim().match(/^(-?\d+(?:\.\d+)?)\s*[,\s]\s*(-?\d+(?:\.\d+)?)$/);
  if (!match) return null;
  const lat = parseFloat(match[1]);
  const lon = parseFloat(match[2]);
  if (lat < -90 || lat > 90 || lon < -180 || lon > 180) return null;
  return { lat, lon };
}

export function LocationSearch({ onAdd, onClose }: Props) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeoResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [coordPreview, setCoordPreview] = useState<{ lat: number; lon: number } | null>(null);
  const [adding, setAdding] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const coords = parseLatLon(query);
    if (coords) {
      setResults([]);
      setCoordPreview(coords);
      return;
    }
    setCoordPreview(null);
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const r = await searchLocations(query);
        setResults(r);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  function handleSelect(r: GeoResult) {
    onAdd({
      name: r.name,
      region: r.admin1,
      country: r.country,
      latitude: r.latitude,
      longitude: r.longitude,
    });
    onClose();
  }

  async function handleSelectCoords(lat: number, lon: number) {
    setAdding(true);
    try {
      const result = await reverseGeocode(lat, lon);
      onAdd(
        result
          ? { name: result.name, region: result.admin1, country: result.country, latitude: lat, longitude: lon }
          : { name: `${lat.toFixed(4)}, ${lon.toFixed(4)}`, region: undefined, country: '', latitude: lat, longitude: lon }
      );
    } finally {
      setAdding(false);
    }
    onClose();
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <span>Add Location</span>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>
        <input
          ref={inputRef}
          className={styles.input}
          placeholder="Search city or paste lat, lon…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {loading && <div className={styles.hint}>Searching…</div>}
        {adding && <div className={styles.hint}>Looking up location…</div>}
        {!loading && !adding && !coordPreview && results.length === 0 && query.trim() && (
          <div className={styles.hint}>No results found</div>
        )}
        {coordPreview && (
          <ul className={styles.list}>
            <li>
              <button
                className={styles.result}
                onClick={() => handleSelectCoords(coordPreview.lat, coordPreview.lon)}
                disabled={adding}
              >
                <span className={styles.cityName}>
                  📍 {coordPreview.lat.toFixed(4)}, {coordPreview.lon.toFixed(4)}
                </span>
                <span className={styles.region}>Tap to add this location</span>
              </button>
            </li>
          </ul>
        )}
        <ul className={styles.list}>
          {results.map((r) => (
            <li key={r.id}>
              <button className={styles.result} onClick={() => handleSelect(r)}>
                <span className={styles.cityName}>{r.name}</span>
                <span className={styles.region}>
                  {[r.admin1, r.country].filter(Boolean).join(', ')}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
