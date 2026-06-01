"use client";

import { useGeolocation } from "@/hooks/useGeolocation";
import { useWeather } from "@/hooks/useWeather";
import { useDeviceOrientation } from "@/hooks/useDeviceOrientation";
import { getSunPosition, getRainbowDirection, isSunBelowHorizon } from "@/lib/sunCalc";
import { CompassCard } from "@/components/CompassCard";
import { WeatherCondition } from "@/components/WeatherCondition";

function AppHeader() {
  return (
    <header className="w-full py-4 px-4 border-b border-gray-200 bg-white">
      <div className="max-w-lg mx-auto flex items-center gap-2">
        <span className="text-2xl" aria-hidden="true">🌈</span>
        <h1 className="text-xl font-bold text-gray-800 tracking-tight">NiziDoko</h1>
        <span className="text-sm text-gray-500 ml-1">虹の方角チェッカー</span>
      </div>
    </header>
  );
}

function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center gap-3" role="status" aria-live="polite">
      <div
        className="w-10 h-10 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"
        aria-hidden="true"
      />
      <p className="text-gray-600 text-base">位置情報を取得中...</p>
    </div>
  );
}

export default function Home() {
  const { location, status: geoStatus, errorMessage: geoError } = useGeolocation();
  const { condition, status: weatherStatus } = useWeather(location);
  const { heading, isSupported, needsPermission, requestPermission } = useDeviceOrientation();

  // 位置情報取得中
  if (geoStatus === "loading") {
    return (
      <div className="flex flex-col min-h-screen">
        <AppHeader />
        <main className="flex flex-1 flex-col items-center justify-center p-4">
          <LoadingSpinner />
        </main>
      </div>
    );
  }

  // 位置情報エラー（拒否・取得失敗）
  if (geoStatus === "error" || location === null) {
    return (
      <div className="flex flex-col min-h-screen">
        <AppHeader />
        <main className="flex flex-1 flex-col items-center justify-center p-4">
          <div className="w-full max-w-sm text-center">
            <p className="text-4xl mb-4" aria-hidden="true">📍</p>
            <p className="text-red-600 text-base">
              位置情報の許可が必要です。
            </p>
            <p className="text-red-600 text-base mt-1">
              ブラウザの設定から許可してください。
            </p>
            {geoError && !geoError.includes("User denied") && (
              <p className="text-gray-500 text-sm mt-3">{geoError}</p>
            )}
          </div>
        </main>
      </div>
    );
  }

  // 位置情報取得成功: 太陽位置・虹方角を計算
  const sunPosition = getSunPosition(location, new Date());
  const rainbowDirection = getRainbowDirection(sunPosition);
  const isNight = isSunBelowHorizon(sunPosition);

  // 夜間
  if (isNight) {
    return (
      <div className="flex flex-col min-h-screen">
        <AppHeader />
        <main className="flex flex-1 flex-col items-center justify-center p-4">
          <div className="text-center">
            <p className="text-4xl mb-4" aria-hidden="true">🌙</p>
            <p className="text-gray-600 text-base">現在夜間のため、虹は出ません。</p>
          </div>
        </main>
      </div>
    );
  }

  // 正常表示（CompassCard + WeatherCondition）
  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />
      <main className="flex flex-1 flex-col items-center justify-start p-4 pt-6">
        <div className="w-full max-w-sm">
          <CompassCard
            azimuth={rainbowDirection.azimuth}
            compassLabel={rainbowDirection.label}
            deviceHeading={heading}
          />
        </div>

        {/* iOS: 方位センサー許可ボタン */}
        {isSupported && needsPermission && (
          <div className="mt-3 w-full max-w-sm">
            <button
              onClick={requestPermission}
              className="w-full py-2 px-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 text-sm font-medium active:bg-blue-100"
            >
              🧭 方位センサーを有効にする
            </button>
          </div>
        )}

        <div className="mt-4 w-full max-w-sm">
          {weatherStatus === "error" ? (
            <p className="text-center text-sm text-gray-600 px-2">
              気象データの取得に失敗しました。太陽位置のみ表示しています。
            </p>
          ) : (
            <WeatherCondition condition={condition} status={weatherStatus} />
          )}
        </div>
      </main>
    </div>
  );
}
