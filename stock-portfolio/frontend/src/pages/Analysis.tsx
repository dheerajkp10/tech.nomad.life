import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getIndicators, getRecommendation, trainML } from "../api/analysis";
import CandlestickChart from "../components/charts/CandlestickChart";
import IndicatorChart from "../components/charts/IndicatorChart";
import SignalCard from "../components/analysis/SignalCard";
import RecommendationBadge from "../components/analysis/RecommendationBadge";
import TickerSearch from "../components/analysis/TickerSearch";

const PERIODS = ["1mo", "3mo", "6mo", "1y", "2y"];

export default function Analysis() {
  const [activeTicker, setActiveTicker] = useState("");
  const [period, setPeriod] = useState("6mo");
  const [mlResult, setMlResult] = useState<string | null>(null);

  const indicatorQuery = useQuery({
    queryKey: ["indicators", activeTicker, period],
    queryFn: () => getIndicators(activeTicker, period),
    enabled: !!activeTicker,
    staleTime: 5 * 60 * 1000,
  });

  const recQuery = useQuery({
    queryKey: ["recommendation", activeTicker, period],
    queryFn: () => getRecommendation(activeTicker, period === "1mo" ? "3mo" : period),
    enabled: !!activeTicker,
    staleTime: 5 * 60 * 1000,
  });

  const mlMutation = useMutation({
    mutationFn: () => trainML(activeTicker),
    onSuccess: (data) => {
      setMlResult(
        `✅ ML model trained: accuracy=${(data.accuracy * 100).toFixed(1)}%, ` +
          `F1 BUY=${(data.f1_buy * 100).toFixed(0)}% SELL=${(data.f1_sell * 100).toFixed(0)}% HOLD=${(data.f1_hold * 100).toFixed(0)}%`
      );
    },
    onError: (err: Error) => {
      setMlResult(`❌ ${err.message}`);
    },
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Analysis</h1>
      </div>

      {/* Search bar */}
      <div className="card">
        <div className="flex gap-3 flex-wrap items-end">
          <div className="flex-1 min-w-52">
            <label className="text-xs text-gray-500 mb-1 block">Ticker</label>
            <TickerSearch
              onSelect={(t) => {
                setActiveTicker(t);
                setMlResult(null);
              }}
              placeholder="Search or enter ticker..."
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Period</label>
            <div className="flex gap-1">
              {PERIODS.map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    period === p
                      ? "bg-blue-600 text-white"
                      : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {!activeTicker && (
        <div className="text-center py-20 text-gray-600">
          Search for a ticker to start analysis
        </div>
      )}

      {activeTicker && (
        <>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-100">{activeTicker}</h2>
            <div className="flex gap-3 items-center flex-wrap">
              {mlResult && (
                <span className="text-xs text-gray-400 bg-gray-800 px-3 py-1.5 rounded-lg max-w-md">
                  {mlResult}
                </span>
              )}
              <button
                className="btn-secondary text-sm"
                onClick={() => mlMutation.mutate()}
                disabled={mlMutation.isPending}
              >
                {mlMutation.isPending ? "Training ML..." : "🤖 Train ML Model"}
              </button>
            </div>
          </div>

          {/* Recommendation */}
          {recQuery.isLoading ? (
            <div className="card animate-pulse h-40" />
          ) : recQuery.data ? (
            <RecommendationBadge rec={recQuery.data} />
          ) : null}

          {/* Charts */}
          <div className="card space-y-4">
            {indicatorQuery.isLoading ? (
              <div className="h-80 animate-pulse bg-gray-800 rounded-lg" />
            ) : indicatorQuery.data ? (
              <>
                <CandlestickChart data={indicatorQuery.data} height={350} />
                <IndicatorChart data={indicatorQuery.data} type="rsi" />
                <IndicatorChart data={indicatorQuery.data} type="macd" />
              </>
            ) : indicatorQuery.isError ? (
              <div className="text-red-400 text-sm py-8 text-center">
                {(indicatorQuery.error as Error).message}
              </div>
            ) : null}
          </div>

          {/* Signal cards */}
          <div>
            <h2 className="text-sm font-semibold text-gray-400 mb-3">
              Strategy Signals
            </h2>
            {recQuery.isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {Array.from({ length: 7 }).map((_, i) => (
                  <div key={i} className="h-28 animate-pulse bg-gray-800 rounded-xl" />
                ))}
              </div>
            ) : recQuery.data ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {recQuery.data.signals.map((signal) => (
                  <SignalCard key={signal.strategy} signal={signal} />
                ))}
              </div>
            ) : null}
          </div>
        </>
      )}
    </div>
  );
}
