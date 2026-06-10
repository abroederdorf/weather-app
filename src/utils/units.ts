export function celsiusToFahrenheit(c: number): number {
  return Math.round(c * 9 / 5 + 32);
}

export function mmToInches(mm: number): number {
  return Math.round(mm * 0.0393701 * 100) / 100;
}

export function formatTemp(c: number, metricFirst = false): string {
  const f = celsiusToFahrenheit(c);
  const cel = Math.round(c);
  return metricFirst ? `${cel}°C / ${f}°F` : `${f}°F / ${cel}°C`;
}

export function formatTempShort(c: number, metricFirst = false): string {
  const f = celsiusToFahrenheit(c);
  const cel = Math.round(c);
  return metricFirst ? `${cel}° / ${f}°` : `${f}° / ${cel}°`;
}

export function formatPrecip(mm: number, metricFirst = false): string {
  if (mm === 0) return metricFirst ? '0mm' : '0"';
  const inches = mmToInches(mm);
  return metricFirst ? `${Math.round(mm)}mm / ${inches}"` : `${inches}" / ${Math.round(mm)}mm`;
}

export function formatPrecipAmount(mm: number, metricFirst = false): string {
  if (mm === 0) return metricFirst ? '0mm' : '0"';
  const inches = mmToInches(mm);
  return metricFirst ? `${Math.round(mm)}mm / ${inches}"` : `${inches}" / ${Math.round(mm)}mm`;
}

export function kmhToMph(kmh: number): number {
  return Math.round(kmh * 0.621371);
}

export function formatWindSpeed(kmh: number, metricFirst = false): string {
  const mph = kmhToMph(kmh);
  return metricFirst ? `${Math.round(kmh)} km/h / ${mph} mph` : `${mph} mph / ${Math.round(kmh)} km/h`;
}

export function degreesToCompass(deg: number): string {
  const dirs = ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW'];
  return dirs[Math.round(deg / 22.5) % 16];
}

export function cmToInches(cm: number): number {
  return Math.round(cm * 0.393701 * 10) / 10;
}

export function formatSnowfall(cm: number, metricFirst = false): string {
  if (cm === 0) return '—';
  const inches = cmToInches(cm);
  return metricFirst ? `${Math.round(cm)}cm / ${inches}"` : `${inches}" / ${Math.round(cm)}cm`;
}

export function formatTime(isoString: string, timezone: string): string {
  return new Date(isoString).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: timezone,
  });
}
