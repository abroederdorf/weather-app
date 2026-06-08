export interface CurrentWeatherData {
  temperature_2m: number;
  apparent_temperature: number;
  precipitation: number;
  cloudcover: number;
  weathercode: number;
  wind_speed_10m: number;
  wind_direction_10m: number;
  wind_gusts_10m: number;
}

export interface HourlyData {
  time: string[];
  temperature_2m: number[];
  apparent_temperature: number[];
  precipitation_probability: number[];
  precipitation: number[];
  weathercode: number[];
  uv_index: number[];
  cloudcover: number[];
  wind_speed_10m: number[];
  wind_direction_10m: number[];
  wind_gusts_10m: number[];
  snowfall: number[];
}

export interface DailyData {
  time: string[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  apparent_temperature_max: number[];
  apparent_temperature_min: number[];
  weathercode: number[];
  precipitation_sum: number[];
  precipitation_probability_max: number[];
  sunrise: string[];
  sunset: string[];
  uv_index_max: number[];
  snowfall_sum: number[];
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
    current: [
      'temperature_2m', 'apparent_temperature', 'precipitation',
      'cloudcover', 'weathercode', 'wind_speed_10m',
      'wind_direction_10m', 'wind_gusts_10m',
    ].join(','),
    hourly: [
      'temperature_2m', 'apparent_temperature', 'precipitation_probability',
      'precipitation', 'weathercode', 'uv_index', 'cloudcover',
      'wind_speed_10m', 'wind_direction_10m', 'wind_gusts_10m', 'snowfall',
    ].join(','),
    daily: [
      'temperature_2m_max', 'temperature_2m_min',
      'apparent_temperature_max', 'apparent_temperature_min',
      'weathercode', 'precipitation_sum', 'precipitation_probability_max',
      'sunrise', 'sunset', 'uv_index_max', 'snowfall_sum',
    ].join(','),
    temperature_unit: 'celsius',
    precipitation_unit: 'mm',
    wind_speed_unit: 'kmh',
    timezone: 'auto',
    forecast_days: '10',
  });

  const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
  if (!res.ok) throw new Error(`Open-Meteo error: ${res.status}`);
  return res.json();
}

export function getHoursForDay(hourly: HourlyData, dayIndex: number): number[] {
  if (hourly.time.length === 0) return [];
  const start = dayIndex * 24;
  const end = Math.min(start + 24, hourly.time.length);
  const indices: number[] = [];
  for (let i = start; i < end; i++) indices.push(i);
  return indices;
}

export function formatHour(isoTime: string, timezone: string): string {
  return new Date(isoTime).toLocaleTimeString('en-US', {
    hour: 'numeric',
    hour12: true,
    timeZone: timezone,
  });
}
