import type { HourlyData } from '../../api/openmeteo';
import { getHoursForDay, formatHour } from '../../api/openmeteo';
import { formatTemp, formatPrecipAmount } from '../../utils/units';
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
          return (
            <div key={i} className={styles.card}>
              <div className={styles.time}>{formatHour(hourly.time[i], timezone)}</div>
              <div className={styles.temp}>{formatTemp(hourly.temperature_2m[i])}</div>
              <Row label="Rain" value={`${hourly.precipitation_probability[i]}%`} />
              <Row label="Amount" value={formatPrecipAmount(hourly.precipitation[i])} />
              <Row
                label="UV"
                value={`${Math.round(uv)} · ${getUvLabel(uv)}`}
                style={{ color: getUvColor(uv) }}
              />
              <Row label="Cloud" value={`${hourly.cloudcover[i]}%`} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  style,
}: {
  label: string;
  value: string;
  style?: React.CSSProperties;
}) {
  return (
    <div className={styles.row}>
      <span className={styles.rowLabel}>{label}</span>
      <span className={styles.rowValue} style={style}>{value}</span>
    </div>
  );
}
