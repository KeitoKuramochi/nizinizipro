export type UserLocation = {
  lat: number;
  lng: number;
  accuracy: number; // metres
};

export type RainbowSighting = {
  id: string;
  lat: number;
  lng: number;
  reportedAt: string; // ISO 8601
  source: "mock" | "x_api";
  description?: string;
};

export type BearingResult = {
  degrees: number;   // 0–360, clockwise from north
  direction: string; // 16-point compass label e.g. "北北東"
  distanceKm: number;
};
