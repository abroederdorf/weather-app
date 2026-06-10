import type { DailyData } from '../../api/openmeteo';
import { formatTempShort, formatPrecipAmount, formatSnowfall } from '../../utils/units';
import { getWeatherInfo, getUvColor } from '../../utils/weather';
import { useUnitPreference } from '../../hooks/useUnitPreference';
import styles from './DailyForecast.module.css';

interface Props {
  daily: DailyData;
  selectedDay: number;
  onDaySelect: (index: number) => void;
  timezone: string;
}

function formatDayLabel(isoDate: string, index: number): string {
  if (index === 0) return 'Today';
  const date = new Date(isoDate + 'T12:00:00');
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

export function DailyForecast({ daily, selectedDay, onDaySelect }: Props) {
  const { metricFirst } = useUnitPreference();
  return (
    <div className={styles.section}>
      <h2 className={styles.title}>10-Day Forecast</h2>
      <div className={`scroll-x ${styles.strip}`}>
        {daily.time.map((date, i) => {
          const weather = getWeatherInfo(daily.weathercode[i]);
          const isSelected = i === selectedDay;
          const uv = daily.uv_index_max[i];
          const snow = daily.snowfall_sum[i];
          return (
            <button
              key={date}
              className={`${styles.card} ${isSelected ? styles.selected : ''}`}
              onClick={() => onDaySelect(i)}
            >
              <div className={styles.day}>{formatDayLabel(date, i)}</div>
              <div className={styles.icon}>{weather.icon}</div>
              <div className={styles.temp}>
                <span className={styles.high}>
                  {formatTempShort(daily.temperature_2m_max[i], metricFirst)}
                </span>
                <span className={styles.low}>
                  {formatTempShort(daily.temperature_2m_min[i], metricFirst)}
                </span>
              </div>
              <div className={styles.precip}>
                <span>💧 {daily.precipitation_probability_max[i]}%</span>
                <span>{formatPrecipAmount(daily.precipitation_sum[i], metricFirst)}</span>
              </div>
              <div className={styles.uv} style={{ color: getUvColor(uv) }}>
                UV {Math.round(uv)}
              </div>
              {snow > 0 && (
                <div className={styles.snow}>❄️ {formatSnowfall(snow, metricFirst)}</div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
