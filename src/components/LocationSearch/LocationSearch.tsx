import { useState, useEffect, useRef } from 'react';
import { searchLocations } from '../../api/geocoding';
import type { GeoResult } from '../../api/geocoding';
import type { SavedLocation } from '../../hooks/useSavedLocations';
import styles from './LocationSearch.module.css';

interface Props {
  onAdd: (loc: Omit<SavedLocation, 'id'>) => void;
  onClose: () => void;
}

export function LocationSearch({ onAdd, onClose }: Props) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeoResult[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
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
          placeholder="Search city…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {loading && <div className={styles.hint}>Searching…</div>}
        {!loading && results.length === 0 && query.trim() && (
          <div className={styles.hint}>No results found</div>
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
