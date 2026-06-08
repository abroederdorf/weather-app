import { useState } from 'react';
import { useGeolocation } from './hooks/useGeolocation';
import { useWeather } from './hooks/useWeather';
import { useAirQuality } from './hooks/useAirQuality';
import { useSavedLocations } from './hooks/useSavedLocations';
import { CurrentWeather } from './components/CurrentWeather/CurrentWeather';
import { HourlyForecast } from './components/HourlyForecast/HourlyForecast';
import { DailyForecast } from './components/DailyForecast/DailyForecast';
import { SavedLocations } from './components/SavedLocations/SavedLocations';
import type { LocationTab } from './components/SavedLocations/SavedLocations';
import { LocationSearch } from './components/LocationSearch/LocationSearch';
import styles from './App.module.css';

const GEO_TAB_ID = '__geo__';

export default function App() {
  const geo = useGeolocation();
  const { locations, addLocation, removeLocation } = useSavedLocations();
  const [activeId, setActiveId] = useState<string>(GEO_TAB_ID);
  const [showSearch, setShowSearch] = useState(false);
  const [selectedDay, setSelectedDay] = useState(0);

  const activeLocation =
    activeId === GEO_TAB_ID
      ? geo.position ?? null
      : (locations.find((l) => l.id === activeId) ?? null);

  const activeLocationName =
    activeId === GEO_TAB_ID
      ? 'My Location'
      : (locations.find((l) => l.id === activeId)?.name ?? '');

  const weather = useWeather(
    activeLocation?.latitude ?? null,
    activeLocation?.longitude ?? null
  );

  const airQuality = useAirQuality(
    activeLocation?.latitude ?? null,
    activeLocation?.longitude ?? null
  );

  const tabs: LocationTab[] = [
    { id: GEO_TAB_ID, name: 'My Location', isGeo: true },
    ...locations.map((l) => ({ id: l.id, name: l.name })),
  ];

  function handleDaySelect(day: number) {
    setSelectedDay(day);
  }

  function handleTabSelect(id: string) {
    setActiveId(id);
    setSelectedDay(0);
  }

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <span className={styles.logo}>⛅ Weather</span>
        <span className={styles.tagline}>°F &amp; °C</span>
      </header>

      <main className={styles.main}>
        <SavedLocations
          tabs={tabs}
          activeId={activeId}
          onSelect={handleTabSelect}
          onRemove={removeLocation}
          onAddClick={() => setShowSearch(true)}
        />

        {geo.loading && activeId === GEO_TAB_ID && (
          <div className={styles.status}>Getting your location…</div>
        )}
        {geo.error && activeId === GEO_TAB_ID && (
          <div className={styles.error}>Location unavailable: {geo.error}</div>
        )}

        {weather.loading && <div className={styles.status}>Loading weather…</div>}
        {weather.error && <div className={styles.error}>Error: {weather.error}</div>}

        {weather.data && (
          <>
            <CurrentWeather
              data={weather.data}
              locationName={activeLocationName}
              selectedDay={selectedDay}
              airQuality={airQuality.data?.current ?? null}
            />
            <HourlyForecast
              hourly={weather.data.hourly}
              selectedDay={selectedDay}
              timezone={weather.data.timezone}
            />
            <DailyForecast
              daily={weather.data.daily}
              selectedDay={selectedDay}
              onDaySelect={handleDaySelect}
              timezone={weather.data.timezone}
            />
          </>
        )}
      </main>

      {showSearch && (
        <LocationSearch
          onAdd={(loc) => {
            addLocation(loc);
            const id = `${loc.latitude},${loc.longitude}`;
            setActiveId(id);
            setSelectedDay(0);
          }}
          onClose={() => setShowSearch(false)}
        />
      )}
    </div>
  );
}
