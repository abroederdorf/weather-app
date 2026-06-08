export interface GeoResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  country_code: string;
  admin1?: string;
}

export async function searchLocations(query: string): Promise<GeoResult[]> {
  if (!query.trim()) return [];
  const params = new URLSearchParams({
    name: query.trim(),
    count: '5',
    language: 'en',
    format: 'json',
  });
  const res = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?${params}`
  );
  if (!res.ok) throw new Error(`Geocoding error: ${res.status}`);
  const data = await res.json();
  return data.results ?? [];
}
