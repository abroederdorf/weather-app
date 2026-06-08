import { useState, useEffect } from 'react';
import { usePwaInstall } from './hooks/usePwaInstall';
import { useGeolocation } from './hooks/useGeolocation';
import { useWeather } from './hooks/useWeather';
import { useAirQuality } from './hooks/useAirQuality';
import { useSavedLocations } from './hooks/useSavedLocations';
import { CurrentWeather } from './components/CurrentWeather/CurrentWeather';
import { HourlyForecast } from './components/HourlyForecast/HourlyForecast';
import { DailyForecast } from './components/DailyForecast/DailyForecast';
import { LocationsPage } from './components/LocationsPage/LocationsPage';
import { LocationSearch } from './components/LocationSearch/LocationSearch';
import styles from './App.module.css';

const GEO_TAB_ID = '__geo__';

export default function App() {
  const { canInstall, install } = usePwaInstall();
  const geo = useGeolocation();
  const { locations, addLocation, removeLocation, reorderLocations } = useSavedLocations();
  const [activeId, setActiveId] = useState<string>(GEO_TAB_ID);
  const [view, setView] = useState<'weather' | 'locations'>('weather');
  const [showSearch, setShowSearch] = useState(false);
  const [selectedDay, setSelectedDay] = useState(0);

  // Fall back to first saved location when geo is unavailable
  useEffect(() => {
    if (activeId === GEO_TAB_ID && !geo.loading && !geo.position && locations.length > 0) {
      setActiveId(locations[0].id);
    }
  }, [geo.loading, geo.position, locations, activeId]);

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

  if (view === 'locations') {
    return (
      <>
        <LocationsPage
          locations={locations}
          activeId={activeId}
          onSelect={(id) => { setActiveId(id); setSelectedDay(0); setView('weather'); }}
          onRemove={removeLocation}
          onReorder={reorderLocations}
          onAddClick={() => setShowSearch(true)}
          onBack={() => setView('weather')}
          geoAvailable={!!geo.position}
          geoPermission={geo.permissionState}
          onRequestGeo={geo.retry}
          geoPosition={geo.position}
        />
        {showSearch && (
          <LocationSearch
            onAdd={(loc) => {
              addLocation(loc);
            }}
            onClose={() => setShowSearch(false)}
          />
        )}
      </>
    );
  }

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <span className={styles.logo}>⛅ Weather</span>
        <span className={styles.headerLocation}>{activeLocationName}</span>
        <div className={styles.headerActions}>
          {canInstall && (
            <button className={styles.installBtn} onClick={install} title="Install app">
              ⬇
            </button>
          )}
          <button
            className={styles.menuBtn}
            onClick={() => setView('locations')}
            title="Locations"
          >
            ☰
          </button>
        </div>
      </header>

      <main className={styles.main}>
        {geo.loading && activeId === GEO_TAB_ID && (
          <div className={styles.status}>Getting your location…</div>
        )}

        {weather.loading && <div className={styles.status}>Loading weather…</div>}
        {weather.error && <div className={styles.error}>Error: {weather.error}</div>}

        {!weather.loading && !weather.data && !weather.error && activeId !== GEO_TAB_ID && (
          <div className={styles.status}>Select a location to see weather</div>
        )}

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
              onDaySelect={(day) => setSelectedDay(day)}
              timezone={weather.data.timezone}
            />
          </>
        )}
      </main>
    </div>
  );
}
