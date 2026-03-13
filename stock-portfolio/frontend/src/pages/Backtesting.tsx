import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getStrategies, runBacktest } from "../api/backtest";
import EquityCurve from "../components/charts/EquityCurve";
import type { BacktestResult } from "../types";

function MetricCard({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <div className="card text-center">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className={`text-xl font-bold ${color ?? "text-gray-100"}`}>{value}</p>
    </div>
  );
}

export default function Backtesting() {
  // Build today's date in local time (not UTC) to avoid off-by-one near midnight
  const today = new Date();
  const localToday = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const [form, setForm] = useState({
    ticker: "AAPL",
    strategy: "RSI",
    start_date: "2022-01-01",
    end_date: localToday,
    initial_capital: 10000,
  });
  const [result, setResult] = useState<BacktestResult | null>(null);
  const [error, setError] = useState("");

  const { data: strategies = [] } = useQuery({
    queryKey: ["strategies"],
    queryFn: getStrategies,
  });

  const backtestMutation = useMutation({
    mutationFn: () =>
      runBacktest({
        ticker: form.ticker.toUpperCase(),
        strategy: form.strategy,
        start_date: form.start_date,
        end_date: form.end_date,
        initial_capital: form.initial_capital,
      }),
    onSuccess: (data) => {
      setResult(data);
      setError("");
    },
    onError: (err: Error) => {
      setError(err.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.ticker.trim()) {
      setError("Ticker is required");
      return;
    }
    backtestMutation.mutate();
  };

  const selectedStrategy = strategies.find((s) => s.name === form.strategy);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Backtesting</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Config form */}
        <div className="card lg:col-span-1">
          <h2 className="text-sm font-semibold text-gray-400 mb-4">Configuration</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Ticker</label>
              <input
                className="input"
                value={form.ticker}
                onChange={(e) =>
                  setForm((f) => ({ ...f, ticker: e.target.value.toUpperCase() }))
                }
                placeholder="AAPL"
              />
            </div>

            <div>
              <label className="text-xs text-gray-500 mb-1 block">Strategy</label>
              <select
                className="input"
                value={form.strategy}
                onChange={(e) =>
                  setForm((f) => ({ ...f, strategy: e.target.value }))
                }
              >
                {strategies.map((s) => (
                  <option key={s.name} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
              {selectedStrategy && (
                <p className="text-xs text-gray-600 mt-1">
                  {selectedStrategy.description}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Start Date</label>
                <input
                  className="input"
                  type="date"
                  value={form.start_date}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, start_date: e.target.value }))
                  }
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">End Date</label>
                <input
                  className="input"
                  type="date"
                  value={form.end_date}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, end_date: e.target.value }))
                  }
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-500 mb-1 block">
                Initial Capital ($)
              </label>
              <input
                className="input"
                type="number"
                min="100"
                value={form.initial_capital}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    initial_capital: parseFloat(e.target.value),
                  }))
                }
              />
            </div>

            {error && <p className="text-sm text-red-400">{error}</p>}

            <button
              type="submit"
              className="btn-primary w-full"
              disabled={backtestMutation.isPending}
            >
              {backtestMutation.isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Running...
                </span>
              ) : (
                "Run Backtest"
              )}
            </button>
          </form>
        </div>

        {/* Results */}
        <div className="lg:col-span-2 space-y-4">
          {!result && !backtestMutation.isPending && (
            <div className="card h-full flex items-center justify-center text-gray-600 min-h-64">
              Configure and run a backtest to see results
            </div>
          )}

          {result && (
            <>
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-bold">
                  {result.ticker} — {result.strategy}
                </h2>
                <span className="text-sm text-gray-500">
                  {result.start_date} → {result.end_date}
                </span>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                <MetricCard
                  label="Total Return"
                  value={`${result.total_return_pct >= 0 ? "+" : ""}${result.total_return_pct.toFixed(1)}%`}
                  color={result.total_return_pct >= 0 ? "text-green-400" : "text-red-400"}
                />
                <MetricCard
                  label="Ann. Return"
                  value={`${result.annualized_return_pct >= 0 ? "+" : ""}${result.annualized_return_pct.toFixed(1)}%`}
                  color={result.annualized_return_pct >= 0 ? "text-green-400" : "text-red-400"}
                />
                <MetricCard
                  label="Sharpe"
                  value={result.sharpe_ratio.toFixed(2)}
                  color={result.sharpe_ratio >= 1 ? "text-green-400" : result.sharpe_ratio >= 0 ? "text-yellow-400" : "text-red-400"}
                />
                <MetricCard
                  label="Max Drawdown"
                  value={`${result.max_drawdown_pct.toFixed(1)}%`}
                  color="text-red-400"
                />
                <MetricCard
                  label="Win Rate"
                  value={`${(result.win_rate * 100).toFixed(0)}%`}
                  color={result.win_rate >= 0.5 ? "text-green-400" : "text-yellow-400"}
                />
                <MetricCard
                  label="Trades"
                  value={result.total_trades.toString()}
                />
              </div>

              {/* Equity curve */}
              <div className="card">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-sm font-semibold text-gray-400">Equity Curve</h3>
                  <div className="text-sm">
                    <span className="text-gray-500">
                      ${result.initial_capital.toLocaleString()} →{" "}
                    </span>
                    <span
                      className={
                        result.final_value >= result.initial_capital
                          ? "text-green-400 font-bold"
                          : "text-red-400 font-bold"
                      }
                    >
                      ${result.final_value.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
                <EquityCurve
                  data={result.equity_curve}
                  initialCapital={result.initial_capital}
                />
              </div>

              {/* Trades table */}
              <div className="card">
                <h3 className="text-sm font-semibold text-gray-400 mb-3">
                  Trades ({result.trades.length})
                </h3>
                <div className="overflow-x-auto max-h-64">
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-gray-900">
                      <tr className="border-b border-gray-800">
                        {["Date", "Action", "Price", "Shares", "Value", "P&L"].map(
                          (h) => (
                            <th
                              key={h}
                              className="px-3 py-2 text-left text-xs font-medium text-gray-500"
                            >
                              {h}
                            </th>
                          )
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {result.trades.map((t, i) => (
                        <tr
                          key={i}
                          className={`border-b border-gray-800/50 ${
                            t.action === "SELL" && (t.pnl ?? 0) > 0
                              ? "bg-green-950/20"
                              : t.action === "SELL" && (t.pnl ?? 0) < 0
                              ? "bg-red-950/20"
                              : ""
                          }`}
                        >
                          <td className="px-3 py-1.5 text-gray-400 text-xs">{t.date}</td>
                          <td className="px-3 py-1.5">
                            <span
                              className={
                                t.action === "BUY" ? "badge-buy" : "badge-sell"
                              }
                            >
                              {t.action}
                            </span>
                          </td>
                          <td className="px-3 py-1.5 text-gray-300">
                            ${t.price.toFixed(2)}
                          </td>
                          <td className="px-3 py-1.5 text-gray-300">
                            {t.shares.toFixed(4)}
                          </td>
                          <td className="px-3 py-1.5 text-gray-300">
                            ${t.value.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                          </td>
                          <td className="px-3 py-1.5">
                            {t.pnl != null ? (
                              <span
                                className={
                                  t.pnl >= 0 ? "positive" : "negative"
                                }
                              >
                                {t.pnl >= 0 ? "+" : ""}${t.pnl.toFixed(2)}
                              </span>
                            ) : (
                              "—"
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
