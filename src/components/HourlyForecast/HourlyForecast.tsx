import { useRef, useEffect } from 'react';
import type { HourlyData } from '../../api/openmeteo';
import { getHoursForDay, formatHour } from '../../api/openmeteo';
import { formatTemp, formatPrecipAmount, formatWindSpeed, degreesToCompass, formatSnowfall } from '../../utils/units';
import { getUvLabel, getUvColor, getWeatherInfo } from '../../utils/weather';
import { useUnitPreference } from '../../hooks/useUnitPreference';
import styles from './HourlyForecast.module.css';

interface Props {
  hourly: HourlyData;
  selectedDay: number;
  timezone: string;
}

export function HourlyForecast({ hourly, selectedDay, timezone }: Props) {
  const { metricFirst } = useUnitPreference();
  const indices = getHoursForDay(hourly, selectedDay);
  const stripRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const strip = stripRef.current;
    if (!strip || strip.children.length === 0) return;

    let targetHour: number;
    if (selectedDay === 0) {
      const hourStr = new Date().toLocaleString('en-US', {
        timeZone: timezone,
        hour: 'numeric',
        hour12: false,
      });
      targetHour = parseInt(hourStr, 10) % 24;
    } else {
      targetHour = 8;
    }

    const card = strip.children[targetHour] as HTMLElement | undefined;
    if (card) {
      strip.scrollLeft = card.offsetLeft;
    }
  }, [selectedDay, timezone]);

  return (
    <div className={styles.section}>
      <h2 className={styles.title}>Hourly Forecast</h2>
      <div className={`scroll-x ${styles.strip}`} ref={stripRef}>
        {indices.map((i) => {
          const uv = hourly.uv_index[i];
          const snow = hourly.snowfall[i];
          return (
            <div key={i} className={styles.card}>
              <div className={styles.time}>{formatHour(hourly.time[i], timezone)}</div>
              <div className={styles.icon}>{getWeatherInfo(hourly.weathercode[i]).icon}</div>
              <div className={styles.temp}>{formatTemp(hourly.temperature_2m[i], metricFirst)}</div>
              <FeelsLike temp={hourly.apparent_temperature[i]} metricFirst={metricFirst} />
              <Row label="Rain" value={`${hourly.precipitation_probability[i]}%`} />
              <Row label="Amount" value={formatPrecipAmount(hourly.precipitation[i], metricFirst)} />
              <Row
                label="UV"
                value={`${Math.round(uv)} · ${getUvLabel(uv)}`}
                style={{ color: getUvColor(uv) }}
              />
              <Row label="Cloud" value={`${hourly.cloudcover[i]}%`} />
              <Row label="Wind" value={formatWindSpeed(hourly.wind_speed_10m[i], metricFirst)} />
              <Row label="Dir" value={degreesToCompass(hourly.wind_direction_10m[i])} />
              <Row label="Gusts" value={formatWindSpeed(hourly.wind_gusts_10m[i], metricFirst)} />
              {snow > 0 && <Row label="Snow" value={formatSnowfall(snow, metricFirst)} />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Row({
  label, value, style,
}: {
  label: string; value: string; style?: React.CSSProperties;
}) {
  return (
    <div className={styles.row}>
      <span className={styles.rowLabel}>{label}</span>
      <span className={styles.rowValue} style={style}>{value}</span>
    </div>
  );
}

function FeelsLike({ temp, metricFirst }: { temp: number; metricFirst: boolean }) {
  const [primary, secondary] = formatTemp(temp, metricFirst).split(' / ');
  return (
    <div className={styles.feelsLike}>
      <div className={styles.row}>
        <span className={styles.rowLabel}>Feels Like</span>
        <span className={styles.feelsHigh}>{primary}</span>
      </div>
      <div className={styles.feelsSecond}>
        <span className={styles.feelsLow}>{secondary}</span>
      </div>
    </div>
  );
}
