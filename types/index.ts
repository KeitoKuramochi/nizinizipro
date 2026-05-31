// 位置情報
export type Location = {
  latitude: number;
  longitude: number;
};

// 太陽位置
export type SunPosition = {
  /** 方位角（度、0=北、時計回り） */
  azimuth: number;
  /** 仰角（度、0=水平線、正=地平線上） */
  altitude: number;
};

// 8方位ラベル
export type CompassLabel =
  | "北"
  | "北東"
  | "東"
  | "南東"
  | "南"
  | "南西"
  | "西"
  | "北西";

// 虹方角
export type RainbowDirection = {
  /** 方位角（度、0=北、時計回り） */
  azimuth: number;
  /** 8方位ラベル */
  label: CompassLabel;
};

// 気象データ
export type WeatherData = {
  /** 降水量 (mm/h) */
  precipitation: number;
  /** 雲量 (%) */
  cloudCover: number;
};

// 気象条件判定
export type WeatherCondition = {
  /** 「出やすい」または「出にくい」 */
  status: "出やすい" | "出にくい";
  /** 判定理由 */
  reason: string;
};

// 取得ステータス
export type FetchStatus = "loading" | "success" | "error";
