import type { CompassLabel } from "@/types/index";

type CompassCardProps = {
  azimuth: number;
  compassLabel: CompassLabel;
};

const COMPASS_DIRECTIONS: { label: string; angle: number }[] = [
  { label: "N", angle: 0 },
  { label: "NE", angle: 45 },
  { label: "E", angle: 90 },
  { label: "SE", angle: 135 },
  { label: "S", angle: 180 },
  { label: "SW", angle: 225 },
  { label: "W", angle: 270 },
  { label: "NW", angle: 315 },
];

const COMPASS_SIZE = 240;
const CENTER = COMPASS_SIZE / 2;
const LABEL_RADIUS = CENTER - 18;

export function CompassCard({ azimuth, compassLabel }: CompassCardProps) {
  return (
    <div className="flex flex-col items-center gap-4 p-4 w-full max-w-xs mx-auto">
      <div
        className="relative"
        style={{ width: COMPASS_SIZE, height: COMPASS_SIZE }}
      >
        {/* 方位盤 SVG */}
        <svg
          width={COMPASS_SIZE}
          height={COMPASS_SIZE}
          viewBox={`0 0 ${COMPASS_SIZE} ${COMPASS_SIZE}`}
          className="absolute inset-0"
          aria-hidden="true"
        >
          {/* 外枠円 */}
          <circle
            cx={CENTER}
            cy={CENTER}
            r={CENTER - 4}
            fill="white"
            stroke="#d1d5db"
            strokeWidth="2"
          />
          {/* 目盛り線 */}
          {COMPASS_DIRECTIONS.map(({ angle }) => {
            const rad = ((angle - 90) * Math.PI) / 180;
            const inner = CENTER - 24;
            const outer = CENTER - 8;
            return (
              <line
                key={angle}
                x1={CENTER + inner * Math.cos(rad)}
                y1={CENTER + inner * Math.sin(rad)}
                x2={CENTER + outer * Math.cos(rad)}
                y2={CENTER + outer * Math.sin(rad)}
                stroke="#9ca3af"
                strokeWidth={angle % 90 === 0 ? 2 : 1}
              />
            );
          })}
          {/* 方位ラベル */}
          {COMPASS_DIRECTIONS.map(({ label, angle }) => {
            const rad = ((angle - 90) * Math.PI) / 180;
            const x = CENTER + LABEL_RADIUS * Math.cos(rad);
            const y = CENTER + LABEL_RADIUS * Math.sin(rad);
            const isCardinal = angle % 90 === 0;
            return (
              <text
                key={label}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={isCardinal ? 13 : 10}
                fontWeight={isCardinal ? "bold" : "normal"}
                fill={label === "N" ? "#ef4444" : "#374151"}
              >
                {label}
              </text>
            );
          })}
          {/* 中心点 */}
          <circle cx={CENTER} cy={CENTER} r={6} fill="#374151" />
        </svg>

        {/* 矢印（方位角に応じて回転） */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ transform: `rotate(${azimuth}deg)` }}
        >
          <svg
            width={COMPASS_SIZE}
            height={COMPASS_SIZE}
            viewBox={`0 0 ${COMPASS_SIZE} ${COMPASS_SIZE}`}
            aria-label={`方位角 ${azimuth}度 (${compassLabel})`}
          >
            {/* 矢印本体（北向き = 上向き） */}
            {/* 先端（赤・北側） */}
            <polygon
              points={`${CENTER},${CENTER - 70} ${CENTER - 10},${CENTER} ${CENTER + 10},${CENTER}`}
              fill="#ef4444"
            />
            {/* 後端（灰色・南側） */}
            <polygon
              points={`${CENTER},${CENTER + 70} ${CENTER - 10},${CENTER} ${CENTER + 10},${CENTER}`}
              fill="#9ca3af"
            />
          </svg>
        </div>
      </div>

      {/* テキスト表示 */}
      <div className="text-center">
        <p className="text-3xl font-bold text-gray-800">
          {Math.round(azimuth)}°
        </p>
        <p className="text-lg text-gray-600 mt-1">{compassLabel}</p>
      </div>
    </div>
  );
}
