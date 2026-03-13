import type { Signal } from "../../types";

const STRATEGY_ICONS: Record<string, string> = {
  RSI: "📉",
  MACD: "📈",
  BB: "🎯",
  MA_CROSS: "✂️",
  MOMENTUM: "🚀",
  MEAN_REV: "↩️",
  ML: "🤖",
};

const STRATEGY_NAMES: Record<string, string> = {
  RSI: "RSI",
  MACD: "MACD",
  BB: "Bollinger Bands",
  MA_CROSS: "MA Crossover",
  MOMENTUM: "Momentum",
  MEAN_REV: "Mean Reversion",
  ML: "ML Signal",
};

interface Props {
  signal: Signal;
}

export default function SignalCard({ signal }: Props) {
  const directionColors = {
    BUY: "border-green-700 bg-green-950",
    SELL: "border-red-700 bg-red-950",
    HOLD: "border-gray-700 bg-gray-900",
  };

  const badgeClass = {
    BUY: "badge-buy",
    SELL: "badge-sell",
    HOLD: "badge-hold",
  }[signal.direction];

  return (
    <div
      className={`border rounded-xl p-4 ${directionColors[signal.direction]}`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span>{STRATEGY_ICONS[signal.strategy] ?? "📊"}</span>
          <span className="text-sm font-semibold text-gray-200">
            {STRATEGY_NAMES[signal.strategy] ?? signal.strategy}
          </span>
        </div>
        <span className={badgeClass}>{signal.direction}</span>
      </div>

      {/* Strength bar */}
      <div className="mb-2">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Strength</span>
          <span>{(signal.strength * 100).toFixed(0)}%</span>
        </div>
        <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${
              signal.direction === "BUY"
                ? "bg-green-500"
                : signal.direction === "SELL"
                ? "bg-red-500"
                : "bg-gray-500"
            }`}
            style={{ width: `${signal.strength * 100}%` }}
          />
        </div>
      </div>

      <p className="text-xs text-gray-400 leading-relaxed">{signal.reason}</p>
    </div>
  );
}
