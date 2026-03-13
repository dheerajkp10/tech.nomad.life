import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getHoldings, getTransactions, getSummary } from "../api/portfolio";
import HoldingsTable from "../components/portfolio/HoldingsTable";
import TradeModal from "../components/portfolio/TradeModal";
import FidelityImportModal from "../components/portfolio/FidelityImportModal";
import type { HoldingWithPrice } from "../types";

export default function Portfolio() {
  const [showBuy, setShowBuy] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [sellHolding, setSellHolding] = useState<HoldingWithPrice | null>(null);
  const [showTransactions, setShowTransactions] = useState(false);

  const { data: holdings = [], isLoading } = useQuery({
    queryKey: ["holdings"],
    queryFn: getHoldings,
    refetchInterval: 60000,
  });

  const { data: summary } = useQuery({
    queryKey: ["summary"],
    queryFn: getSummary,
  });

  const { data: transactions = [] } = useQuery({
    queryKey: ["transactions"],
    queryFn: () => getTransactions(undefined, 50),
    enabled: showTransactions,
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Portfolio</h1>
        <div className="flex gap-3">
          <button
            className="btn-secondary text-sm flex items-center gap-1.5"
            onClick={() => setShowImport(true)}
          >
            <span>📥</span> Import Fidelity CSV
          </button>
          <button
            className="btn-secondary text-sm"
            onClick={() => setShowTransactions((v) => !v)}
          >
            {showTransactions ? "Hide" : "Show"} Transactions
          </button>
          <button className="btn-primary text-sm" onClick={() => setShowBuy(true)}>
            + Buy
          </button>
        </div>
      </div>

      {/* Summary bar */}
      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            {
              label: "Market Value",
              value: `$${summary.total_market_value.toLocaleString(undefined, { maximumFractionDigits: 2 })}`,
              color: "",
            },
            {
              label: "Cost Basis",
              value: `$${summary.total_cost_basis.toLocaleString(undefined, { maximumFractionDigits: 2 })}`,
              color: "",
            },
            {
              label: "Unrealized P&L",
              value: `${summary.total_unrealized_pnl >= 0 ? "+" : ""}$${Math.abs(summary.total_unrealized_pnl).toLocaleString(undefined, { maximumFractionDigits: 2 })}`,
              color: summary.total_unrealized_pnl >= 0 ? "text-green-400" : "text-red-400",
            },
            {
              label: "P&L %",
              value: `${summary.total_unrealized_pct >= 0 ? "+" : ""}${summary.total_unrealized_pct.toFixed(2)}%`,
              color: summary.total_unrealized_pct >= 0 ? "text-green-400" : "text-red-400",
            },
          ].map((item) => (
            <div key={item.label} className="card">
              <p className="text-xs text-gray-500">{item.label}</p>
              <p className={`text-lg font-bold mt-0.5 ${item.color || "text-gray-100"}`}>
                {item.value}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Holdings */}
      <div className="card">
        <h2 className="text-sm font-semibold text-gray-400 mb-4">
          Holdings ({holdings.length})
        </h2>
        {isLoading ? (
          <div className="text-center py-12 text-gray-500">Loading...</div>
        ) : (
          <HoldingsTable
            holdings={holdings}
            onSell={(ticker) => {
              const h = holdings.find((h) => h.ticker === ticker);
              if (h) setSellHolding(h);
            }}
          />
        )}
      </div>

      {/* Transactions */}
      {showTransactions && (
        <div className="card">
          <h2 className="text-sm font-semibold text-gray-400 mb-4">Recent Transactions</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800">
                  {["Date", "Ticker", "Action", "Shares", "Price", "Total", "Notes"].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {transactions.map((t) => (
                  <tr key={t.id} className="border-b border-gray-800/50">
                    <td className="px-4 py-2 text-gray-400 text-xs">
                      {new Date(t.executed_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2 font-bold text-blue-400">{t.ticker}</td>
                    <td className="px-4 py-2">
                      <span className={t.action === "BUY" ? "badge-buy" : "badge-sell"}>
                        {t.action}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-gray-300">{t.shares.toFixed(4)}</td>
                    <td className="px-4 py-2 text-gray-300">${t.price.toFixed(2)}</td>
                    <td className="px-4 py-2 text-gray-100">${t.total_value.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                    <td className="px-4 py-2 text-gray-500 text-xs">{t.notes ?? "—"}</td>
                  </tr>
                ))}
                {transactions.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-gray-600">
                      No transactions yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modals */}
      {showBuy && <TradeModal mode="buy" onClose={() => setShowBuy(false)} />}
      {sellHolding && (
        <TradeModal
          mode="sell"
          defaultTicker={sellHolding.ticker}
          holding={sellHolding}
          onClose={() => setSellHolding(null)}
        />
      )}
      {showImport && <FidelityImportModal onClose={() => setShowImport(false)} />}
    </div>
  );
}
