import type { ForecastResponse } from '../../api/openmeteo';
import { getHoursForDay } from '../../api/openmeteo';
import type { AirQualityCurrent } from '../../api/airquality';
import {
  formatTemp, formatTempShort, formatPrecip,
  formatWindSpeed, degreesToCompass, formatSnowfall, formatTime,
} from '../../utils/units';
import { getWeatherInfo, getUvLabel, getUvColor, getAqiLabel, getAqiColor } from '../../utils/weather';
import { useUnitPreference } from '../../hooks/useUnitPreference';
import styles from './CurrentWeather.module.css';

interface Props {
  data: ForecastResponse;
  locationName: string;
  selectedDay: number;
  airQuality: AirQualityCurrent | null;
}

export function CurrentWeather({ data, locationName, selectedDay, airQuality }: Props) {
  const { metricFirst } = useUnitPreference();
  const { current, daily, hourly, timezone } = data;
  const isToday = selectedDay === 0;
  const weather = getWeatherInfo(isToday ? current.weathercode : daily.weathercode[selectedDay]);

  const dayLabel = isToday
    ? null
    : new Date(daily.time[selectedDay] + 'T12:00:00').toLocaleDateString('en-US', {
        weekday: 'long', month: 'long', day: 'numeric',
      });

  const maxWind = isToday ? null : (() => {
    const indices = getHoursForDay(hourly, selectedDay);
    return Math.max(...indices.map(i => hourly.wind_speed_10m[i]));
  })();

  return (
    <div className={styles.card}>
      <div className={styles.location}>{locationName}</div>
      {dayLabel && <div className={styles.dayLabel}>{dayLabel}</div>}

      <div className={styles.icon}>{weather.icon}</div>
      <div className={styles.condition}>{weather.label}</div>

      {isToday ? (
        <>
          <div className={styles.temp}>{formatTemp(current.temperature_2m, metricFirst)}</div>
          <div className={styles.feelsLike}>Feels like {formatTemp(current.apparent_temperature, metricFirst)}</div>
          <div className={styles.highLow}>
            <span className={styles.high}>H: {formatTemp(daily.temperature_2m_max[0], metricFirst)}</span>
            <span className={styles.sep}>·</span>
            <span className={styles.low}>L: {formatTemp(daily.temperature_2m_min[0], metricFirst)}</span>
          </div>

          <div className={styles.statRow}>
            <Stat label="Precip" value={formatPrecip(current.precipitation, metricFirst)} />
            <Stat label="Cloud" value={`${current.cloudcover}%`} />
          </div>

          <div className={styles.windRow}>
            <span className={styles.windLabel}>Wind</span>
            <span className={styles.windValue}>
              {formatWindSpeed(current.wind_speed_10m, metricFirst)} {degreesToCompass(current.wind_direction_10m)}
            </span>
          </div>
          <div className={styles.windRow}>
            <span className={styles.gustLabel}>Gusts</span>
            <span className={styles.windValue}>{formatWindSpeed(current.wind_gusts_10m, metricFirst)}</span>
          </div>

          <div className={styles.sunRow}>
            <span>☀️ {formatTime(daily.sunrise[0], timezone)}</span>
            <span className={styles.sep}>·</span>
            <span>🌙 {formatTime(daily.sunset[0], timezone)}</span>
          </div>
        </>
      ) : (
        <>
          <div className={styles.highLow}>
            <span className={styles.high}>H: {formatTemp(daily.temperature_2m_max[selectedDay], metricFirst)}</span>
            <span className={styles.sep}>·</span>
            <span className={styles.low}>L: {formatTemp(daily.temperature_2m_min[selectedDay], metricFirst)}</span>
          </div>
          <div className={styles.feelsLike}>
            Feels like H {formatTempShort(daily.apparent_temperature_max[selectedDay], metricFirst)}
            {' · '}L {formatTempShort(daily.apparent_temperature_min[selectedDay], metricFirst)}
          </div>

          <div className={styles.statRow}>
            <Stat label="Precip" value={`${daily.precipitation_probability_max[selectedDay]}%`} />
            <Stat label="Amount" value={formatPrecip(daily.precipitation_sum[selectedDay], metricFirst)} />
          </div>

          {maxWind !== null && (
            <div className={styles.windRow}>
              <span className={styles.windLabel}>Max Wind</span>
              <span className={styles.windValue}>{formatWindSpeed(maxWind, metricFirst)}</span>
            </div>
          )}

          <div className={styles.sunRow}>
            <span>☀️ {formatTime(daily.sunrise[selectedDay], timezone)}</span>
            <span className={styles.sep}>·</span>
            <span>🌙 {formatTime(daily.sunset[selectedDay], timezone)}</span>
          </div>

          <div className={styles.statRow}>
            <Stat
              label="UV Max"
              value={`${Math.round(daily.uv_index_max[selectedDay])} · ${getUvLabel(daily.uv_index_max[selectedDay])}`}
              style={{ color: getUvColor(daily.uv_index_max[selectedDay]) }}
            />
            {daily.snowfall_sum[selectedDay] > 0 && (
              <Stat label="Snow" value={formatSnowfall(daily.snowfall_sum[selectedDay], metricFirst)} />
            )}
          </div>
        </>
      )}

      {isToday && airQuality && (
        <div className={styles.aqiRow}>
          <span
            className={styles.aqiBadge}
            style={{ color: getAqiColor(airQuality.us_aqi) }}
          >
            AQI {airQuality.us_aqi} · {getAqiLabel(airQuality.us_aqi)}
          </span>
          <span className={styles.pm25}>
            PM2.5 {Math.round(airQuality.pm2_5)} µg/m³
          </span>
        </div>
      )}
    </div>
  );
}

function Stat({
  label, value, style,
}: {
  label: string; value: string; style?: React.CSSProperties;
}) {
  return (
    <div className={styles.stat}>
      <span className={styles.statLabel}>{label}</span>
      <span className={styles.statValue} style={style}>{value}</span>
    </div>
  );
}
