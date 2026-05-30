import type { BearingResult, RainbowSighting, UserLocation } from "@/types";

const EARTH_RADIUS_KM = 6371;

const DIRECTIONS_16: string[] = [
  "北", "北北東", "北東", "東北東",
  "東", "東南東", "南東", "南南東",
  "南", "南南西", "南西", "西南西",
  "西", "西北西", "北西", "北北西",
];

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

function haversineKm(from: UserLocation, to: RainbowSighting): number {
  const dLat = toRad(to.lat - from.lat);
  const dLng = toRad(to.lng - from.lng);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(from.lat)) * Math.cos(toRad(to.lat)) * Math.sin(dLng / 2) ** 2;
  return EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function bearingDegrees(from: UserLocation, to: RainbowSighting): number {
  const φ1 = toRad(from.lat);
  const φ2 = toRad(to.lat);
  const Δλ = toRad(to.lng - from.lng);
  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  // atan2 returns –π to π; normalise to 0–360
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
}

function toDirection16(degrees: number): string {
  // Each segment spans 22.5°; offset by half a segment so north (0°) maps to index 0
  const index = Math.round(degrees / 22.5) % 16;
  return DIRECTIONS_16[index];
}

export function calcBearing(from: UserLocation, to: RainbowSighting): BearingResult {
  const degrees = bearingDegrees(from, to);
  return {
    degrees,
    direction: toDirection16(degrees),
    distanceKm: haversineKm(from, to),
  };
}
