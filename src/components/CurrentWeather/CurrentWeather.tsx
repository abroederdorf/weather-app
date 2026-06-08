import type { ForecastResponse } from '../../api/openmeteo';
import { formatTemp, formatPrecip } from '../../utils/units';
import { getWeatherInfo } from '../../utils/weather';
import styles from './CurrentWeather.module.css';

interface Props {
  data: ForecastResponse;
  locationName: string;
}

export function CurrentWeather({ data, locationName }: Props) {
  const { current, daily } = data;
  const weather = getWeatherInfo(current.weathercode);

  return (
    <div className={styles.card}>
      <div className={styles.location}>{locationName}</div>
      <div className={styles.icon}>{weather.icon}</div>
      <div className={styles.condition}>{weather.label}</div>

      <div className={styles.temp}>{formatTemp(current.temperature_2m)}</div>

      <div className={styles.row}>
        <Stat label="Precipitation" value={formatPrecip(current.precipitation)} />
        <Stat label="Cloud Cover" value={`${current.cloudcover}%`} />
      </div>

      <div className={styles.highLow}>
        <span className={styles.high}>H: {formatTemp(daily.temperature_2m_max[0])}</span>
        <span className={styles.sep}>·</span>
        <span className={styles.low}>L: {formatTemp(daily.temperature_2m_min[0])}</span>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.stat}>
      <span className={styles.statLabel}>{label}</span>
      <span className={styles.statValue}>{value}</span>
    </div>
  );
}
