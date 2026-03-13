import client from "./client";
import type { OHLCVPoint, Quote, SearchResult } from "../types";

export const getQuote = (ticker: string): Promise<Quote> =>
  client.get(`/api/market/quote/${ticker}`);

export const getBatchQuotes = (tickers: string[]): Promise<Record<string, Quote>> =>
  client.get("/api/market/batch-quotes", { params: { tickers: tickers.join(",") } });

export const getHistory = (
  ticker: string,
  period = "1y",
  interval = "1d"
): Promise<OHLCVPoint[]> =>
  client.get(`/api/market/history/${ticker}`, { params: { period, interval } });

export const searchTickers = (q: string): Promise<SearchResult[]> =>
  client.get("/api/market/search", { params: { q } });
