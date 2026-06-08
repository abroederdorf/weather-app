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
  return `${inches}"`;
}
