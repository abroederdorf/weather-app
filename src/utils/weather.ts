export interface WeatherInfo {
  label: string;
  icon: string;
}

const WEATHER_CODES: Record<number, WeatherInfo> = {
  0:  { label: 'Clear sky',          icon: '☀️' },
  1:  { label: 'Mainly clear',       icon: '🌤️' },
  2:  { label: 'Partly cloudy',      icon: '⛅' },
  3:  { label: 'Overcast',           icon: '☁️' },
  45: { label: 'Fog',                icon: '🌫️' },
  48: { label: 'Icy fog',            icon: '🌫️' },
  51: { label: 'Light drizzle',      icon: '🌦️' },
  53: { label: 'Drizzle',            icon: '🌦️' },
  55: { label: 'Heavy drizzle',      icon: '🌧️' },
  61: { label: 'Light rain',         icon: '🌧️' },
  63: { label: 'Rain',               icon: '🌧️' },
  65: { label: 'Heavy rain',         icon: '🌧️' },
  71: { label: 'Light snow',         icon: '🌨️' },
  73: { label: 'Snow',               icon: '❄️' },
  75: { label: 'Heavy snow',         icon: '❄️' },
  77: { label: 'Snow grains',        icon: '🌨️' },
  80: { label: 'Light showers',      icon: '🌦️' },
  81: { label: 'Showers',            icon: '🌧️' },
  82: { label: 'Violent showers',    icon: '⛈️' },
  85: { label: 'Snow showers',       icon: '🌨️' },
  86: { label: 'Heavy snow showers', icon: '❄️' },
  95: { label: 'Thunderstorm',       icon: '⛈️' },
  96: { label: 'Thunderstorm + hail',icon: '⛈️' },
  99: { label: 'Thunderstorm + hail',icon: '⛈️' },
};

export function getWeatherInfo(code: number): WeatherInfo {
  return WEATHER_CODES[code] ?? { label: 'Unknown', icon: '🌡️' };
}

export function getUvLabel(uv: number): string {
  if (uv < 3) return 'Low';
  if (uv < 6) return 'Moderate';
  if (uv < 8) return 'High';
  if (uv < 11) return 'Very High';
  return 'Extreme';
}

export function getUvColor(uv: number): string {
  if (uv < 3) return '#4ade80';
  if (uv < 6) return '#facc15';
  if (uv < 8) return '#fb923c';
  if (uv < 11) return '#f87171';
  return '#c084fc';
}
