import { useQuery } from "@tanstack/react-query";
import { getHoldings, getSummary } from "../api/portfolio";
import { getPortfolioSignals } from "../api/analysis";
import PieAllocation from "../components/charts/PieAllocation";
import type { Recommendation } from "../types";
import { Link } from "react-router-dom";

function StatCard({
  label,
  value,
  sub,
  positive,
}: {
  label: string;
  value: string;
  sub?: string;
  positive?: boolean;
}) {
  return (
    <div className="card">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p
        className={`text-2xl font-bold ${
          positive === undefined
            ? "text-gray-100"
            : positive
            ? "text-green-400"
            : "text-red-400"
        }`}
      >
        {value}
      </p>
      {sub && <p className="text-xs text-gray-500 mt-0.5">{sub}</p>}
    </div>
  );
}

function SignalRow({ ticker, rec }: { ticker: string; rec: Recommendation }) {
  const badgeClass =
    rec.direction === "BUY"
      ? "badge-buy"
      : rec.direction === "SELL"
      ? "badge-sell"
      : "badge-hold";
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-800/50 last:border-0">
      <span className="font-bold text-blue-400 w-16">{ticker}</span>
      <span className={badgeClass}>{rec.direction}</span>
      <div className="flex-1 mx-4">
        <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${
              rec.direction === "BUY"
                ? "bg-green-500"
                : rec.direction === "SELL"
                ? "bg-red-500"
                : "bg-gray-500"
            }`}
            style={{ width: `${rec.confidence * 100}%` }}
          />
        </div>
      </div>
      <span className="text-xs text-gray-500 w-10 text-right">
        {(rec.confidence * 100).toFixed(0)}%
      </span>
    </div>
  );
}

export default function Dashboard() {
  const { data: summary } = useQuery({
    queryKey: ["summary"],
    queryFn: getSummary,
    refetchInterval: 60000,
  });

  const { data: holdings = [] } = useQuery({
    queryKey: ["holdings"],
    queryFn: getHoldings,
    refetchInterval: 60000,
  });

  const { data: signals } = useQuery({
    queryKey: ["portfolio-signals"],
    queryFn: () => getPortfolioSignals(),
    enabled: holdings.length > 0,
    refetchInterval: 300000,
  });

  const topMovers = [...holdings]
    .sort((a, b) => Math.abs(b.day_change_pct) - Math.abs(a.day_change_pct))
    .slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Link to="/portfolio" className="btn-primary text-sm">
          + Add Position
        </Link>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Portfolio Value"
          value={`$${(summary?.total_market_value ?? 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
          sub={`${summary?.holdings_count ?? 0} positions`}
        />
        <StatCard
          label="Total P&L"
          value={`${(summary?.total_unrealized_pnl ?? 0) >= 0 ? "+" : ""}$${Math.abs(summary?.total_unrealized_pnl ?? 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
          sub={`${(summary?.total_unrealized_pct ?? 0).toFixed(2)}% total`}
          positive={(summary?.total_unrealized_pnl ?? 0) >= 0}
        />
        <StatCard
          label="Today's P&L"
          value={`${(summary?.day_pnl ?? 0) >= 0 ? "+" : ""}$${Math.abs(summary?.day_pnl ?? 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
          sub={`${(summary?.day_pnl_pct ?? 0).toFixed(2)}% today`}
          positive={(summary?.day_pnl ?? 0) >= 0}
        />
        <StatCard
          label="Cost Basis"
          value={`$${(summary?.total_cost_basis ?? 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Allocation pie */}
        <div className="card">
          <h2 className="text-sm font-semibold text-gray-400 mb-4">Allocation</h2>
          <PieAllocation holdings={holdings} />
        </div>

        {/* Top movers */}
        <div className="card">
          <h2 className="text-sm font-semibold text-gray-400 mb-4">Today's Movers</h2>
          {topMovers.length === 0 ? (
            <p className="text-gray-600 text-sm text-center py-8">No positions yet</p>
          ) : (
            <div className="space-y-2">
              {topMovers.map((h) => (
                <div key={h.ticker} className="flex items-center justify-between text-sm">
                  <span className="font-bold text-blue-400 w-16">{h.ticker}</span>
                  <span className="text-gray-400">${h.current_price.toFixed(2)}</span>
                  <span
                    className={
                      h.day_change_pct >= 0 ? "positive font-medium" : "negative font-medium"
                    }
                  >
                    {h.day_change_pct >= 0 ? "+" : ""}{h.day_change_pct.toFixed(2)}%
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Signals overview */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-400">Signals Overview</h2>
            <Link to="/analysis" className="text-xs text-blue-400 hover:text-blue-300">
              View Analysis →
            </Link>
          </div>
          {!signals || Object.keys(signals).length === 0 ? (
            <p className="text-gray-600 text-sm text-center py-8">
              {holdings.length === 0
                ? "Add positions to see signals"
                : "Loading signals..."}
            </p>
          ) : (
            <div>
              {Object.entries(signals).map(([ticker, rec]) => (
                <SignalRow key={ticker} ticker={ticker} rec={rec} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
