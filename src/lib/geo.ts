export type LatLng = {
  lat: number;
  lng: number;
};

const EARTH_RADIUS_KM = 6371;

function toRad(deg: number) {
  return (deg * Math.PI) / 180;
}

/**
 * Distância em linha reta (fórmula de Haversine) entre dois pontos, em km.
 * Aproximação local/mock — não considera rotas reais de ruas/trânsito.
 * Quando a integração com Google Maps (Distance Matrix API) for adicionada,
 * esta função pode ser usada como fallback/estimativa rápida no client.
 */
export function distanceKm(from: LatLng, to: LatLng): number {
  const dLat = toRad(to.lat - from.lat);
  const dLng = toRad(to.lng - from.lng);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(from.lat)) * Math.cos(toRad(to.lat)) * Math.sin(dLng / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return EARTH_RADIUS_KM * c;
}

/**
 * Estimativa grosseira de tempo de deslocamento para moto em área urbana.
 * Mock — sem dados reais de trânsito.
 */
export function estimateTravelMinutes(km: number, averageSpeedKmh = 28): number {
  return Math.max(1, Math.round((km / averageSpeedKmh) * 60));
}
