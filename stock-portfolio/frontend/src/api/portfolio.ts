import client from "./client";
import type {
  HoldingWithPrice,
  PortfolioSummary,
  Transaction,
  WatchlistItem,
} from "../types";

export const getHoldings = (): Promise<HoldingWithPrice[]> =>
  client.get("/api/portfolio/holdings");

export const getSummary = (): Promise<PortfolioSummary> =>
  client.get("/api/portfolio/summary");

export const getTransactions = (ticker?: string, limit = 100): Promise<Transaction[]> => {
  const params: Record<string, unknown> = { limit };
  if (ticker) params.ticker = ticker;
  return client.get("/api/portfolio/transactions", { params });
};

export const buyStock = (data: {
  ticker: string;
  shares: number;
  price: number;
  notes?: string;
}): Promise<Transaction> => client.post("/api/portfolio/buy", data);

export const sellStock = (data: {
  ticker: string;
  shares: number;
  price: number;
  notes?: string;
}): Promise<Transaction> => client.post("/api/portfolio/sell", data);

export const deleteHolding = (ticker: string): Promise<{ ok: boolean }> =>
  client.delete(`/api/portfolio/holdings/${ticker}`);

export const getWatchlist = (): Promise<WatchlistItem[]> =>
  client.get("/api/portfolio/watchlist");

export const addToWatchlist = (ticker: string, notes?: string): Promise<WatchlistItem> =>
  client.post("/api/portfolio/watchlist", { ticker, notes });

export const removeFromWatchlist = (ticker: string): Promise<{ ok: boolean }> =>
  client.delete(`/api/portfolio/watchlist/${ticker}`);
