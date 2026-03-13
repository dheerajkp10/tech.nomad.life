import client from "./client";
import type {
  IndicatorValues,
  MLTrainResult,
  Recommendation,
  Signal,
} from "../types";

export const getIndicators = (ticker: string, period = "6mo"): Promise<IndicatorValues> =>
  client.get(`/api/analysis/indicators/${ticker}`, { params: { period } });

export const getSignals = (ticker: string, period = "1y"): Promise<Signal[]> =>
  client.get(`/api/analysis/signals/${ticker}`, { params: { period } });

export const getRecommendation = (ticker: string, period = "1y"): Promise<Recommendation> =>
  client.get(`/api/analysis/recommendation/${ticker}`, { params: { period } });

export const getPortfolioSignals = (period = "1y"): Promise<Record<string, Recommendation>> =>
  client.get("/api/analysis/portfolio-signals", { params: { period } });

export const trainML = (
  ticker: string,
  lookback_days = 756
): Promise<MLTrainResult> =>
  client.post(`/api/analysis/train-ml/${ticker}`, null, {
    params: { lookback_days },
  });
