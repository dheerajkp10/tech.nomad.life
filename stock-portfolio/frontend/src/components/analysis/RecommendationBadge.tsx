import type { Recommendation } from "../../types";

interface Props {
  rec: Recommendation;
}

export default function RecommendationBadge({ rec }: Props) {
  const config = {
    BUY: { color: "text-green-400", bg: "bg-green-900/50 border-green-700", ring: "ring-green-500" },
    SELL: { color: "text-red-400", bg: "bg-red-900/50 border-red-700", ring: "ring-red-500" },
    HOLD: { color: "text-yellow-400", bg: "bg-yellow-900/30 border-yellow-700", ring: "ring-yellow-500" },
  }[rec.direction];

  const pct = Math.round(rec.confidence * 100);

  return (
    <div className={`border rounded-2xl p-6 ${config.bg}`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Recommendation</p>
          <p className={`text-5xl font-black ${config.color}`}>{rec.direction}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500 mb-1">Confidence</p>
          <p className={`text-3xl font-bold ${config.color}`}>{pct}%</p>
        </div>
      </div>

      {/* Confidence bar */}
      <div className="mb-4">
        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${
              rec.direction === "BUY"
                ? "bg-green-500"
                : rec.direction === "SELL"
                ? "bg-red-500"
                : "bg-yellow-500"
            }`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <p className="text-sm text-gray-400 leading-relaxed">{rec.summary}</p>
    </div>
  );
}
