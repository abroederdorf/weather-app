import type { HourlyData } from '../../api/openmeteo';
import { getHoursForDay, formatHour } from '../../api/openmeteo';
import { formatTemp, formatPrecipAmount, formatWindSpeed, degreesToCompass, formatSnowfall } from '../../utils/units';
import { getUvLabel, getUvColor } from '../../utils/weather';
import styles from './HourlyForecast.module.css';

interface Props {
  hourly: HourlyData;
  selectedDay: number;
  timezone: string;
}

export function HourlyForecast({ hourly, selectedDay, timezone }: Props) {
  const indices = getHoursForDay(hourly, selectedDay);

  return (
    <div className={styles.section}>
      <h2 className={styles.title}>Hourly Forecast</h2>
      <div className={`scroll-x ${styles.strip}`}>
        {indices.map((i) => {
          const uv = hourly.uv_index[i];
          const snow = hourly.snowfall[i];
          return (
            <div key={i} className={styles.card}>
              <div className={styles.time}>{formatHour(hourly.time[i], timezone)}</div>
              <div className={styles.temp}>{formatTemp(hourly.temperature_2m[i])}</div>
              <Row label="Feels" value={formatTemp(hourly.apparent_temperature[i])} />
              <Row label="Rain" value={`${hourly.precipitation_probability[i]}%`} />
              <Row label="Amount" value={formatPrecipAmount(hourly.precipitation[i])} />
              <Row
                label="UV"
                value={`${Math.round(uv)} · ${getUvLabel(uv)}`}
                style={{ color: getUvColor(uv) }}
              />
              <Row label="Cloud" value={`${hourly.cloudcover[i]}%`} />
              <Row label="Wind" value={formatWindSpeed(hourly.wind_speed_10m[i])} />
              <Row label="Dir" value={degreesToCompass(hourly.wind_direction_10m[i])} />
              <Row label="Gusts" value={formatWindSpeed(hourly.wind_gusts_10m[i])} />
              {snow > 0 && <Row label="Snow" value={formatSnowfall(snow)} />}
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
