export function celsiusToFahrenheit(c: number): number {
  return Math.round(c * 9 / 5 + 32);
}

export function mmToInches(mm: number): number {
  return Math.round(mm * 0.0393701 * 100) / 100;
}

export function formatTemp(c: number): string {
  return `${celsiusToFahrenheit(c)}°F / ${Math.round(c)}°C`;
}

export function formatTempShort(c: number): string {
  return `${celsiusToFahrenheit(c)}° / ${Math.round(c)}°`;
}

export function formatPrecip(mm: number): string {
  if (mm === 0) return '0"';
  const inches = mmToInches(mm);
  return `${inches}" / ${Math.round(mm)}mm`;
}

export function formatPrecipAmount(mm: number): string {
  if (mm === 0) return '0"';
  const inches = mmToInches(mm);
  return `${inches}" / ${Math.round(mm)}mm`;
}

export function kmhToMph(kmh: number): number {
  return Math.round(kmh * 0.621371);
}

export function formatWindSpeed(kmh: number): string {
  return `${kmhToMph(kmh)} mph / ${Math.round(kmh)} km/h`;
}

export function degreesToCompass(deg: number): string {
  const dirs = ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW'];
  return dirs[Math.round(deg / 22.5) % 16];
}

export function cmToInches(cm: number): number {
  return Math.round(cm * 0.393701 * 10) / 10;
}

export function formatSnowfall(cm: number): string {
  if (cm === 0) return '—';
  return `${cmToInches(cm)}" / ${Math.round(cm)}cm`;
}

export function formatTime(isoString: string, timezone: string): string {
  return new Date(isoString).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: timezone,
  });
}
