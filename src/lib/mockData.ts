import type { RainbowSighting } from "@/types";

export const MOCK_SIGHTINGS: RainbowSighting[] = [
  { id: "mock-1", lat: 35.6762, lng: 139.6503, reportedAt: "2026-05-30T08:00:00+09:00", source: "mock", description: "新宿駅上空" },
  { id: "mock-2", lat: 35.4437, lng: 139.6380, reportedAt: "2026-05-30T08:15:00+09:00", source: "mock", description: "横浜みなとみらい" },
  { id: "mock-3", lat: 35.6581, lng: 139.7017, reportedAt: "2026-05-30T08:30:00+09:00", source: "mock", description: "渋谷スクランブル" },
  { id: "mock-4", lat: 35.7295, lng: 139.7109, reportedAt: "2026-05-30T08:45:00+09:00", source: "mock", description: "上野公園" },
  { id: "mock-5", lat: 35.6197, lng: 139.7274, reportedAt: "2026-05-30T09:00:00+09:00", source: "mock", description: "品川駅東口" },
];
