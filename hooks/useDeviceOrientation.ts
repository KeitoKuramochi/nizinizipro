"use client";

import { useState, useEffect, useCallback } from "react";

type DeviceOrientationEventWithPermission = typeof DeviceOrientationEvent & {
  requestPermission?: () => Promise<"granted" | "denied">;
};

type DeviceOrientationEventWithCompass = DeviceOrientationEvent & {
  webkitCompassHeading?: number;
};

type OrientationState = {
  heading: number | null;
  isSupported: boolean;
  needsPermission: boolean;
  requestPermission: () => Promise<void>;
};

export function useDeviceOrientation(): OrientationState {
  const [heading, setHeading] = useState<number | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  const [needsPermission, setNeedsPermission] = useState(false);

  const handleOrientation = useCallback((event: DeviceOrientationEvent) => {
    const e = event as DeviceOrientationEventWithCompass;

    // iOS: webkitCompassHeading は北=0, 時計回り増加（そのまま使える）
    if (typeof e.webkitCompassHeading === "number" && e.webkitCompassHeading >= 0) {
      setHeading(e.webkitCompassHeading);
      return;
    }

    // Android / 標準: absolute=true のとき alpha は反時計回り増加なので変換する
    if (event.alpha !== null) {
      const raw = event.alpha;
      setHeading((360 - raw) % 360);
    }
  }, []);

  const startListening = useCallback(() => {
    // absolute イベントを優先（より正確な北基準）
    window.addEventListener(
      "deviceorientationabsolute",
      handleOrientation as EventListener,
      true
    );
    window.addEventListener(
      "deviceorientation",
      handleOrientation as EventListener,
      true
    );
  }, [handleOrientation]);

  const requestPermission = useCallback(async () => {
    const DOE = DeviceOrientationEvent as DeviceOrientationEventWithPermission;
    if (typeof DOE.requestPermission === "function") {
      try {
        const result = await DOE.requestPermission();
        if (result === "granted") {
          setNeedsPermission(false);
          startListening();
        }
      } catch {
        // ユーザーが拒否 or 非対応
      }
    } else {
      startListening();
    }
  }, [startListening]);

  useEffect(() => {
    if (typeof window === "undefined" || !("DeviceOrientationEvent" in window)) {
      return;
    }
    setIsSupported(true);

    const DOE = DeviceOrientationEvent as DeviceOrientationEventWithPermission;

    // iOS 13+ は明示的な許可が必要
    if (typeof DOE.requestPermission === "function") {
      setNeedsPermission(true);
    } else {
      startListening();
    }

    return () => {
      window.removeEventListener(
        "deviceorientationabsolute",
        handleOrientation as EventListener,
        true
      );
      window.removeEventListener(
        "deviceorientation",
        handleOrientation as EventListener,
        true
      );
    };
  }, [startListening, handleOrientation]);

  return { heading, isSupported, needsPermission, requestPermission };
}
