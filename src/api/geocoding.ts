export interface GeoResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  country_code: string;
  admin1?: string;
}

interface NominatimResult {
  place_id: number;
  name: string;
  lat: string;
  lon: string;
  address: {
    city?: string;
    town?: string;
    village?: string;
    hamlet?: string;
    suburb?: string;
    state?: string;
    country?: string;
    country_code?: string;
  };
  error?: string;
}

const HEADERS = {
  'User-Agent': 'WeatherApp/1.0 (https://weatherapp.alpinealicia.com)',
};

function extractName(item: NominatimResult): string {
  return (
    item.address.city ??
    item.address.town ??
    item.address.village ??
    item.address.hamlet ??
    item.address.suburb ??
    item.name
  );
}

function toGeoResult(item: NominatimResult): GeoResult {
  return {
    id: item.place_id,
    name: extractName(item),
    latitude: parseFloat(item.lat),
    longitude: parseFloat(item.lon),
    country: item.address.country ?? '',
    country_code: item.address.country_code ?? '',
    admin1: item.address.state,
  };
}

export async function searchLocations(query: string): Promise<GeoResult[]> {
  if (!query.trim()) return [];
  const params = new URLSearchParams({
    q: query.trim(),
    format: 'json',
    limit: '5',
    addressdetails: '1',
  });
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?${params}`,
    { headers: HEADERS }
  );
  if (!res.ok) throw new Error(`Geocoding error: ${res.status}`);
  const data: NominatimResult[] = await res.json();
  return data.map(toGeoResult);
}

export async function reverseGeocode(lat: number, lon: number): Promise<GeoResult | null> {
  const params = new URLSearchParams({
    lat: lat.toString(),
    lon: lon.toString(),
    format: 'json',
    addressdetails: '1',
  });
  const res = await fetch(
    `https://nominatim.openstreetmap.org/reverse?${params}`,
    { headers: HEADERS }
  );
  if (!res.ok) return null;
  const item: NominatimResult = await res.json();
  if (!item || item.error) return null;
  return toGeoResult(item);
}
