import { useState } from "react";
import type { HoldingWithPrice } from "../../types";

interface Props {
  holdings: HoldingWithPrice[];
  onSell: (ticker: string) => void;
}

function pct(value: number) {
  const cls = value >= 0 ? "positive" : "negative";
  return (
    <span className={cls}>
      {value >= 0 ? "+" : ""}{value.toFixed(2)}%
    </span>
  );
}

function money(value: number) {
  const cls = value >= 0 ? "positive" : "negative";
  return (
    <span className={cls}>
      {value >= 0 ? "+" : ""}${Math.abs(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
    </span>
  );
}

export default function HoldingsTable({ holdings, onSell }: Props) {
  const [sortKey, setSortKey] = useState<keyof HoldingWithPrice>("market_value");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const sorted = [...holdings].sort((a, b) => {
    const av = a[sortKey] as number;
    const bv = b[sortKey] as number;
    return sortDir === "asc" ? av - bv : bv - av;
  });

  const handleSort = (key: keyof HoldingWithPrice) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const Th = ({ label, k }: { label: string; k: keyof HoldingWithPrice }) => (
    <th
      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-300 select-none"
      onClick={() => handleSort(k)}
    >
      {label} {sortKey === k ? (sortDir === "asc" ? "↑" : "↓") : ""}
    </th>
  );

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-800">
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ticker</th>
            <Th label="Shares" k="shares" />
            <Th label="Avg Cost" k="avg_cost" />
            <Th label="Price" k="current_price" />
            <Th label="Market Value" k="market_value" />
            <Th label="P&L" k="unrealized_pnl" />
            <Th label="P&L %" k="unrealized_pct" />
            <Th label="Day Chg" k="day_change_pct" />
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {sorted.map((h) => (
            <tr key={h.ticker} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
              <td className="px-4 py-3 font-bold text-blue-400">{h.ticker}</td>
              <td className="px-4 py-3 text-gray-300">{h.shares.toFixed(4)}</td>
              <td className="px-4 py-3 text-gray-300">${h.avg_cost.toFixed(2)}</td>
              <td className="px-4 py-3 text-gray-100 font-medium">${h.current_price.toFixed(2)}</td>
              <td className="px-4 py-3 text-gray-100">${h.market_value.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
              <td className="px-4 py-3">{money(h.unrealized_pnl)}</td>
              <td className="px-4 py-3">{pct(h.unrealized_pct)}</td>
              <td className="px-4 py-3">{pct(h.day_change_pct)}</td>
              <td className="px-4 py-3">
                <button
                  className="text-xs text-red-400 hover:text-red-300 font-medium"
                  onClick={() => onSell(h.ticker)}
                >
                  Sell
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {holdings.length === 0 && (
        <div className="text-center py-12 text-gray-600">
          No holdings yet. Add your first position above.
        </div>
      )}
    </div>
  );
}
