import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { buyStock, sellStock } from "../../api/portfolio";
import type { HoldingWithPrice } from "../../types";

interface Props {
  mode: "buy" | "sell";
  defaultTicker?: string;
  holding?: HoldingWithPrice;
  onClose: () => void;
}

export default function TradeModal({ mode, defaultTicker = "", holding, onClose }: Props) {
  const [ticker, setTicker] = useState(defaultTicker.toUpperCase());
  const [shares, setShares] = useState("");
  const [price, setPrice] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  const qc = useQueryClient();

  useEffect(() => {
    if (holding) setPrice(holding.current_price.toFixed(2));
  }, [holding]);

  const mutation = useMutation({
    mutationFn: async () => {
      const payload = {
        ticker: ticker.toUpperCase(),
        shares: parseFloat(shares),
        price: parseFloat(price),
        notes: notes || undefined,
      };
      return mode === "buy" ? buyStock(payload) : sellStock(payload);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["holdings"] });
      qc.invalidateQueries({ queryKey: ["summary"] });
      onClose();
    },
    onError: (err: Error) => {
      setError(err.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!ticker || !shares || !price) {
      setError("All fields are required");
      return;
    }
    mutation.mutate();
  };

  const total = parseFloat(shares) * parseFloat(price) || 0;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold capitalize">
            <span className={mode === "buy" ? "text-green-400" : "text-red-400"}>
              {mode}
            </span>{" "}
            Position
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-300 text-xl">×</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Ticker</label>
            <input
              className="input"
              value={ticker}
              onChange={(e) => setTicker(e.target.value.toUpperCase())}
              placeholder="AAPL"
              disabled={mode === "sell" && !!defaultTicker}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Shares</label>
              <input
                className="input"
                type="number"
                min="0.001"
                step="any"
                value={shares}
                onChange={(e) => setShares(e.target.value)}
                placeholder="10"
              />
              {mode === "sell" && holding && (
                <p className="text-xs text-gray-600 mt-0.5">Max: {holding.shares.toFixed(4)}</p>
              )}
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Price ($)</label>
              <input
                className="input"
                type="number"
                min="0.01"
                step="any"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="150.00"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1 block">Notes (optional)</label>
            <input
              className="input"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Earnings play"
            />
          </div>

          {total > 0 && (
            <div className="bg-gray-800 rounded-lg px-4 py-3 text-sm">
              <span className="text-gray-400">Total value: </span>
              <span className="font-bold text-gray-100">
                ${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          )}

          {error && <p className="text-sm text-red-400">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button type="button" className="btn-secondary flex-1" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              disabled={mutation.isPending}
              className={`flex-1 font-medium px-4 py-2 rounded-lg transition-colors disabled:opacity-50 ${
                mode === "buy"
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-red-600 hover:bg-red-700 text-white"
              }`}
            >
              {mutation.isPending ? "..." : mode === "buy" ? "Buy" : "Sell"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
