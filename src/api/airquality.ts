export interface AirQualityCurrent {
  us_aqi: number;
  pm2_5: number;
}

export interface AirQualityResponse {
  current: AirQualityCurrent;
}

export async function fetchAirQuality(
  latitude: number,
  longitude: number
): Promise<AirQualityResponse> {
  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    current: 'us_aqi,pm2_5',
    timezone: 'auto',
  });

  const res = await fetch(
    `https://air-quality-api.open-meteo.com/v1/air-quality?${params}`
  );
  if (!res.ok) throw new Error(`Air quality API error: ${res.status}`);
  return res.json();
}
