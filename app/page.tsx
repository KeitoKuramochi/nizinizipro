"use client";

import { useGeolocation } from "@/hooks/useGeolocation";
import { useWeather } from "@/hooks/useWeather";
import { getSunPosition, getRainbowDirection, isSunBelowHorizon } from "@/lib/sunCalc";
import { CompassCard } from "@/components/CompassCard";
import { WeatherCondition } from "@/components/WeatherCondition";

export default function Home() {
  const { location, status: geoStatus, errorMessage: geoError } = useGeolocation();
  const { condition, status: weatherStatus } = useWeather(location);

  // 位置情報取得中
  if (geoStatus === "loading") {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4">
        <p className="text-gray-600 text-base">位置情報を取得中...</p>
      </main>
    );
  }

  // 位置情報エラー（拒否・取得失敗）
  if (geoStatus === "error" || location === null) {
    const message =
      geoError ?? "位置情報の許可が必要です。ブラウザの設定から許可してください。";
    // ブラウザが Geolocation 非対応の場合はそのメッセージを表示
    const displayMessage = message.includes("許可") || message.includes("Geolocation")
      ? "位置情報の許可が必要です。ブラウザの設定から許可してください。"
      : message;
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4">
        <p className="text-red-600 text-base text-center">{displayMessage}</p>
      </main>
    );
  }

  // 位置情報取得成功: 太陽位置・虹方角を計算
  const sunPosition = getSunPosition(location, new Date());
  const rainbowDirection = getRainbowDirection(sunPosition);
  const isNight = isSunBelowHorizon(sunPosition);

  // 夜間
  if (isNight) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4">
        <p className="text-gray-600 text-base">現在夜間のため、虹は出ません。</p>
      </main>
    );
  }

  // 正常表示（CompassCard + WeatherCondition）
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-xs">
        <CompassCard
          azimuth={rainbowDirection.azimuth}
          compassLabel={rainbowDirection.label}
        />
      </div>

      <div className="mt-6 w-full max-w-xs">
        {weatherStatus === "error" ? (
          <p className="text-center text-sm text-gray-600">
            気象データの取得に失敗しました。太陽位置のみ表示しています。
          </p>
        ) : (
          <WeatherCondition condition={condition} status={weatherStatus} />
        )}
      </div>
    </main>
  );
}
