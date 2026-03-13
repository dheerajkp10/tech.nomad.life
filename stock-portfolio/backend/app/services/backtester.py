"""
Vectorized backtesting engine.
Signal on close[i] → execute on open[i+1].  No look-ahead bias.
Uses exact start/end dates via yfinance start=/end= parameters.
"""
from __future__ import annotations
import math
from datetime import date, timedelta
from typing import List

import numpy as np
import pandas as pd

from app.schemas.backtest import BacktestRequest, BacktestResult, EquityPoint, TradeRecord
from app.services.data_fetcher import get_history_range
from app.services.strategies import get_strategy

WARMUP_BARS = 250  # ~1 trading year — enough for all indicators (SMA200, 12-1 momentum)


def run(request: BacktestRequest) -> BacktestResult:
    """Execute a full backtest for a given strategy and ticker."""
    strategy = get_strategy(request.strategy, request.strategy_params)

    # Fetch data with a warmup window using EXACT dates (not relative period strings)
    warmup_start = request.start_date - timedelta(days=int(WARMUP_BARS * 1.5))
    df_full = get_history_range(request.ticker, warmup_start, request.end_date, interval="1d")

    if df_full.empty:
        raise ValueError(f"No data available for {request.ticker} in requested range")

    # Mark where the real backtest window starts (after warmup)
    start_ts = pd.Timestamp(request.start_date)
    end_ts = pd.Timestamp(request.end_date)
    df_full = df_full[df_full.index <= end_ts]

    backtest_start_idx = max(WARMUP_BARS, df_full.index.searchsorted(start_ts))

    cash = request.initial_capital
    shares_held = 0.0
    commission_pct = 0.001  # 0.1% per trade (realistic for retail)

    equity_curve: List[EquityPoint] = []
    trades: List[TradeRecord] = []
    entry_price = 0.0
    prev_signal_direction = "HOLD"

    for i in range(backtest_start_idx, len(df_full)):
        row = df_full.iloc[i]
        date_str = str(df_full.index[i].date())

        # Mark-to-market equity
        equity = cash + shares_held * float(row["Close"])
        equity_curve.append(EquityPoint(date=date_str, value=round(equity, 2)))

        # Generate signal on close of bar i (no look-ahead — uses data up to i)
        signal = strategy.generate_signal(df_full.iloc[: i + 1])
        new_direction = signal.direction

        # Execute on the OPEN of bar i+1
        if i + 1 < len(df_full):
            next_open = float(df_full["Open"].iloc[i + 1])
            next_date = str(df_full.index[i + 1].date())

            if new_direction == "BUY" and prev_signal_direction != "BUY" and shares_held == 0:
                invest = cash * (1 - commission_pct)
                shares_held = invest / next_open
                cash -= invest
                entry_price = next_open
                trades.append(TradeRecord(
                    date=next_date,
                    action="BUY",
                    price=round(next_open, 4),
                    shares=round(shares_held, 6),
                    value=round(invest, 2),
                ))

            elif new_direction == "SELL" and prev_signal_direction != "SELL" and shares_held > 0:
                proceeds = shares_held * next_open * (1 - commission_pct)
                pnl = proceeds - (shares_held * entry_price)
                trades.append(TradeRecord(
                    date=next_date,
                    action="SELL",
                    price=round(next_open, 4),
                    shares=round(shares_held, 6),
                    value=round(proceeds, 2),
                    pnl=round(pnl, 2),
                ))
                cash += proceeds
                shares_held = 0.0
                entry_price = 0.0

        prev_signal_direction = new_direction

    if not equity_curve:
        raise ValueError("No equity data generated — check ticker and date range")

    # Performance metrics
    equity_values = [p.value for p in equity_curve]
    eq_series = pd.Series(equity_values)
    final_value = equity_values[-1]
    total_return = (final_value / request.initial_capital) - 1

    n_days = len(equity_values)
    n_years = n_days / 252
    annualized_return = (1 + total_return) ** (1 / n_years) - 1 if n_years > 0 else 0.0

    daily_returns = eq_series.pct_change().dropna()
    if len(daily_returns) > 1 and daily_returns.std() > 0:
        sharpe = float((daily_returns.mean() / daily_returns.std()) * math.sqrt(252))
    else:
        sharpe = 0.0

    rolling_max = eq_series.cummax()
    drawdowns = (eq_series - rolling_max) / rolling_max
    max_drawdown = float(drawdowns.min())

    sell_trades = [t for t in trades if t.action == "SELL"]
    win_rate = (
        sum(1 for t in sell_trades if (t.pnl or 0) > 0) / len(sell_trades)
        if sell_trades else 0.0
    )

    return BacktestResult(
        ticker=request.ticker,
        strategy=request.strategy,
        start_date=str(request.start_date),
        end_date=str(request.end_date),
        initial_capital=request.initial_capital,
        final_value=round(final_value, 2),
        total_return_pct=round(total_return * 100, 2),
        annualized_return_pct=round(annualized_return * 100, 2),
        sharpe_ratio=round(sharpe, 3),
        max_drawdown_pct=round(max_drawdown * 100, 2),
        win_rate=round(win_rate, 4),
        total_trades=len(trades),
        equity_curve=equity_curve,
        trades=trades,
    )
