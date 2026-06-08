export interface CurrentWeatherData {
  temperature_2m: number;
  precipitation: number;
  cloudcover: number;
  weathercode: number;
}

export interface HourlyData {
  time: string[];
  temperature_2m: number[];
  precipitation_probability: number[];
  precipitation: number[];
  uv_index: number[];
  cloudcover: number[];
}

export interface DailyData {
  time: string[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  weathercode: number[];
  precipitation_sum: number[];
  precipitation_probability_max: number[];
}

export interface ForecastResponse {
  current: CurrentWeatherData;
  hourly: HourlyData;
  daily: DailyData;
  timezone: string;
  utc_offset_seconds: number;
}

export async function fetchForecast(
  latitude: number,
  longitude: number
): Promise<ForecastResponse> {
  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    current: 'temperature_2m,precipitation,cloudcover,weathercode',
    hourly: 'temperature_2m,precipitation_probability,precipitation,uv_index,cloudcover',
    daily: 'temperature_2m_max,temperature_2m_min,weathercode,precipitation_sum,precipitation_probability_max',
    temperature_unit: 'celsius',
    precipitation_unit: 'mm',
    timezone: 'auto',
    forecast_days: '10',
  });

  const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
  if (!res.ok) throw new Error(`Open-Meteo error: ${res.status}`);
  return res.json();
}

export function getHoursForDay(hourly: HourlyData, dayIndex: number): number[] {
  const dayTimes = hourly.time;
  const indices: number[] = [];

  // Build a date string for the day using the hourly times
  if (dayTimes.length === 0) return indices;

  // Each day has 24 hours; dayIndex * 24 .. dayIndex * 24 + 23
  const start = dayIndex * 24;
  const end = Math.min(start + 24, dayTimes.length);
  for (let i = start; i < end; i++) {
    indices.push(i);
  }
  return indices;
}

export function formatHour(isoTime: string, timezone: string): string {
  const date = new Date(isoTime);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    hour12: true,
    timeZone: timezone,
  });
}
