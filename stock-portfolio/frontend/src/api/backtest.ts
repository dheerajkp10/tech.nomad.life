import client from "./client";
import type { BacktestRequest, BacktestResult, StrategyInfo } from "../types";

export const getStrategies = (): Promise<StrategyInfo[]> =>
  client.get("/api/backtest/strategies");

export const runBacktest = (request: BacktestRequest): Promise<BacktestResult> =>
  client.post("/api/backtest/run", request);
