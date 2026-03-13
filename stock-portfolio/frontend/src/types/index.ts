// Portfolio types
export interface HoldingWithPrice {
  ticker: string;
  shares: number;
  avg_cost: number;
  current_price: number;
  market_value: number;
  cost_basis: number;
  unrealized_pnl: number;
  unrealized_pct: number;
  day_change: number;
  day_change_pct: number;
}

export interface Transaction {
  id: number;
  ticker: string;
  action: "BUY" | "SELL";
  shares: number;
  price: number;
  total_value: number;
  executed_at: string;
  notes?: string;
}

export interface PortfolioSummary {
  total_cost_basis: number;
  total_market_value: number;
  total_unrealized_pnl: number;
  total_unrealized_pct: number;
  holdings_count: number;
  day_pnl: number;
  day_pnl_pct: number;
}

export interface WatchlistItem {
  id: number;
  ticker: string;
  added_at: string;
  notes?: string;
}

// Market types
export interface Quote {
  ticker: string;
  price: number | null;
  prev_close: number | null;
  day_change: number;
  day_change_pct: number;
  volume: number;
  market_cap: number | null;
  fifty_two_week_high: number | null;
  fifty_two_week_low: number | null;
}

export interface OHLCVPoint {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface SearchResult {
  symbol: string;
  name: string;
  exchange: string;
  type: string;
}

// Analysis types
export type Direction = "BUY" | "SELL" | "HOLD";

export interface Signal {
  strategy: string;
  direction: Direction;
  strength: number;
  reason: string;
  timestamp: string;
}

export interface Recommendation {
  ticker: string;
  direction: Direction;
  confidence: number;
  signals: Signal[];
  summary: string;
}

export interface IndicatorValues {
  ticker: string;
  period: string;
  dates: string[];
  open: (number | null)[];
  high: (number | null)[];
  low: (number | null)[];
  close: (number | null)[];
  volume: number[];
  sma_20: (number | null)[];
  sma_50: (number | null)[];
  sma_200: (number | null)[];
  ema_20: (number | null)[];
  bb_upper: (number | null)[];
  bb_middle: (number | null)[];
  bb_lower: (number | null)[];
  rsi: (number | null)[];
  macd_line: (number | null)[];
  macd_signal: (number | null)[];
  macd_histogram: (number | null)[];
}

export interface MLTrainResult {
  ticker: string;
  accuracy: number;
  f1_buy: number;
  f1_sell: number;
  f1_hold: number;
  n_samples: number;
  message: string;
}

// Backtest types
export interface BacktestRequest {
  ticker: string;
  strategy: string;
  start_date: string;
  end_date: string;
  initial_capital: number;
  strategy_params?: Record<string, unknown>;
}

export interface EquityPoint {
  date: string;
  value: number;
}

export interface TradeRecord {
  date: string;
  action: "BUY" | "SELL";
  price: number;
  shares: number;
  value: number;
  pnl?: number;
}

export interface BacktestResult {
  ticker: string;
  strategy: string;
  start_date: string;
  end_date: string;
  initial_capital: number;
  final_value: number;
  total_return_pct: number;
  annualized_return_pct: number;
  sharpe_ratio: number;
  max_drawdown_pct: number;
  win_rate: number;
  total_trades: number;
  equity_curve: EquityPoint[];
  trades: TradeRecord[];
}

export interface StrategyInfo {
  name: string;
  description: string;
  params: Record<string, unknown>;
}
