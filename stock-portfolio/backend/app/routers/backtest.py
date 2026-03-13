from __future__ import annotations
from typing import List

from fastapi import APIRouter, HTTPException

from app.schemas.backtest import BacktestRequest, BacktestResult, StrategyInfo
from app.services import backtester

router = APIRouter()

STRATEGY_INFOS = [
    StrategyInfo(
        name="RSI_2",
        description="Connors RSI(2) mean-reversion: buy extreme oversold dips above SMA200, sell extreme overbought peaks. Win rate ~65-68%.",
        params={"rsi_period": 2, "oversold": 10, "overbought": 90, "regime_period": 200},
    ),
    StrategyInfo(
        name="MACD_HIST",
        description="MACD histogram slope-flip with 200-SMA regime filter. Detects momentum peaks/troughs 2-3 bars earlier than zero-line crossovers.",
        params={"fast": 12, "slow": 26, "signal": 9, "regime_period": 200},
    ),
    StrategyInfo(
        name="BB_RSI",
        description="Bollinger Bands + RSI(14) confluence with ADX < 25 ranging gate. Only trades mean reversion in non-trending markets. Win rate ~60-70%.",
        params={"bb_period": 20, "bb_std": 2.0, "rsi_period": 14, "rsi_low": 30, "rsi_high": 70, "adx_threshold": 25},
    ),
    StrategyInfo(
        name="DUAL_EMA",
        description="EMA(12)/EMA(26) golden/death cross with volume confirmation. Volume filter eliminates low-liquidity false breakouts. Sharpe 0.8-1.2.",
        params={"fast": 12, "slow": 26, "vol_period": 20, "regime_period": 50},
    ),
    StrategyInfo(
        name="KELTNER",
        description="Keltner Channel compression → breakout. Detects volatility squeeze (ATR contraction) then trades the expansion breakout with volume spike.",
        params={"ema_period": 20, "atr_period": 14, "kc_mult": 2.0, "compress_ratio": 0.8, "vol_mult": 1.5},
    ),
    StrategyInfo(
        name="KAMA",
        description="Kaufman Adaptive Moving Average: fast in trends, flat in choppy markets. Uses Efficiency Ratio to filter noise. Sharpe 1.0-1.6.",
        params={"n": 10, "fast": 2, "slow": 30, "er_trend": 0.3, "er_chop": 0.2},
    ),
    StrategyInfo(
        name="MOMENTUM_12_1",
        description="Antonacci Dual Momentum: 12-month return skipping last month. Absolute filter: only long if asset beats cash (momentum > 0).",
        params={"long_period": 252, "skip_period": 21, "regime_period": 200},
    ),
    StrategyInfo(
        name="SUPERTREND",
        description="Supertrend ATR-based trailing stop indicator. Flips between uptrend (buy) and downtrend (sell) based on price vs ATR bands. Widely used 2022-2025.",
        params={"period": 10, "multiplier": 3.0},
    ),
    StrategyInfo(
        name="MEAN_REV_ADX",
        description="Z-score mean reversion gated by ADX < 25. Avoids fading strong trends. Improves base win rate from ~50% to ~62% vs unfiltered version.",
        params={"period": 20, "z_threshold": 2.0, "adx_period": 14, "adx_threshold": 25},
    ),
    StrategyInfo(
        name="STOCH_RSI",
        description="Stochastic RSI K/D crossover with 200-SMA trend confirmation. More sensitive than plain RSI. Win rate ~58-63% on daily swing trades.",
        params={"rsi_period": 14, "stoch_period": 14, "smooth_k": 3, "smooth_d": 3, "oversold": 20, "overbought": 80},
    ),
]


@router.get("/strategies", response_model=List[StrategyInfo])
def list_strategies():
    """List all available backtest strategies with their configurable parameters."""
    return STRATEGY_INFOS


@router.post("/run", response_model=BacktestResult)
def run_backtest(request: BacktestRequest):
    """Execute a backtest and return results."""
    if request.start_date >= request.end_date:
        raise HTTPException(status_code=400, detail="start_date must be before end_date")

    from datetime import date
    # Clamp end_date to today (handles JS UTC vs local timezone near midnight)
    if request.end_date > date.today():
        request.end_date = date.today()

    try:
        return backtester.run(request)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Backtest failed: {str(e)}")
