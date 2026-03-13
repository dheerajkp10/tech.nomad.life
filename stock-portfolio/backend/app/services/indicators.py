"""
Pure functions for computing technical indicators.
All functions accept pandas Series/DataFrame and return Series/DataFrame.
No side effects.
"""
from __future__ import annotations
import numpy as np
import pandas as pd


# ---------------------------------------------------------------------------
# Core trend indicators
# ---------------------------------------------------------------------------

def compute_sma(close: pd.Series, period: int) -> pd.Series:
    """Simple Moving Average."""
    return close.rolling(period).mean()


def compute_ema(close: pd.Series, period: int) -> pd.Series:
    """Exponential Moving Average."""
    return close.ewm(span=period, adjust=False).mean()


def compute_rsi(close: pd.Series, period: int = 14) -> pd.Series:
    """
    Relative Strength Index via Wilder's smoothed method (EWM com=period-1).
    Returns Series of values 0–100.
    """
    delta = close.diff()
    gain = delta.clip(lower=0)
    loss = -delta.clip(upper=0)
    avg_gain = gain.ewm(com=period - 1, min_periods=period).mean()
    avg_loss = loss.ewm(com=period - 1, min_periods=period).mean()
    rs = avg_gain / avg_loss.replace(0, np.nan)
    return 100 - (100 / (1 + rs))


def compute_macd(
    close: pd.Series,
    fast: int = 12,
    slow: int = 26,
    signal: int = 9,
) -> pd.DataFrame:
    """
    MACD indicator.
    Returns DataFrame: macd_line, signal_line, histogram.
    """
    ema_fast = close.ewm(span=fast, adjust=False).mean()
    ema_slow = close.ewm(span=slow, adjust=False).mean()
    macd_line = ema_fast - ema_slow
    signal_line = macd_line.ewm(span=signal, adjust=False).mean()
    histogram = macd_line - signal_line
    return pd.DataFrame({"macd_line": macd_line, "signal_line": signal_line, "histogram": histogram})


def compute_bollinger_bands(
    close: pd.Series,
    period: int = 20,
    std_dev: float = 2.0,
) -> pd.DataFrame:
    """
    Bollinger Bands.
    Returns DataFrame: upper, middle, lower, pct_b.
    """
    middle = close.rolling(period).mean()
    std = close.rolling(period).std()
    upper = middle + std_dev * std
    lower = middle - std_dev * std
    pct_b = (close - lower) / (upper - lower).replace(0, np.nan)
    return pd.DataFrame({"upper": upper, "middle": middle, "lower": lower, "pct_b": pct_b})


def compute_atr(df: pd.DataFrame, period: int = 14) -> pd.Series:
    """
    Average True Range (Wilder's EWM smoothing).
    df must have High, Low, Close columns.
    """
    high, low, close = df["High"], df["Low"], df["Close"]
    prev_close = close.shift(1)
    tr = pd.concat(
        [high - low, (high - prev_close).abs(), (low - prev_close).abs()],
        axis=1,
    ).max(axis=1)
    return tr.ewm(com=period - 1, min_periods=period).mean()


def compute_momentum(close: pd.Series, period: int = 14) -> pd.Series:
    """Rate of change: (close / close.shift(period)) - 1."""
    return (close / close.shift(period)) - 1


def compute_zscore(close: pd.Series, period: int = 20) -> pd.Series:
    """Rolling z-score of price relative to its mean."""
    mean = close.rolling(period).mean()
    std = close.rolling(period).std()
    return (close - mean) / std.replace(0, np.nan)


# ---------------------------------------------------------------------------
# Advanced indicators
# ---------------------------------------------------------------------------

def compute_adx(df: pd.DataFrame, period: int = 14) -> pd.DataFrame:
    """
    Average Directional Index (Wilder).
    Returns DataFrame: adx, plus_di, minus_di.

    ADX < 20  → no trend (ranging market)
    ADX 20-25 → weak trend
    ADX > 25  → strong trend
    """
    high, low, close = df["High"], df["Low"], df["Close"]
    prev_high = high.shift(1)
    prev_low = low.shift(1)
    prev_close = close.shift(1)

    # True Range
    tr = pd.concat(
        [high - low, (high - prev_close).abs(), (low - prev_close).abs()],
        axis=1,
    ).max(axis=1)

    # Directional movement
    up_move = high - prev_high
    down_move = prev_low - low

    plus_dm = np.where((up_move > down_move) & (up_move > 0), up_move, 0.0)
    minus_dm = np.where((down_move > up_move) & (down_move > 0), down_move, 0.0)

    plus_dm_s = pd.Series(plus_dm, index=df.index)
    minus_dm_s = pd.Series(minus_dm, index=df.index)

    # Wilder smoothing
    atr_w = tr.ewm(com=period - 1, min_periods=period).mean()
    plus_di = 100 * plus_dm_s.ewm(com=period - 1, min_periods=period).mean() / atr_w
    minus_di = 100 * minus_dm_s.ewm(com=period - 1, min_periods=period).mean() / atr_w

    dx = (100 * (plus_di - minus_di).abs() / (plus_di + minus_di).replace(0, np.nan))
    adx = dx.ewm(com=period - 1, min_periods=period).mean()

    return pd.DataFrame({"adx": adx, "plus_di": plus_di, "minus_di": minus_di})


def compute_kama(close: pd.Series, n: int = 10, fast: int = 2, slow: int = 30) -> pd.Series:
    """
    Kaufman's Adaptive Moving Average (KAMA).

    In trending markets (high Efficiency Ratio) it behaves like a fast EMA.
    In choppy/ranging markets (low ER) it barely moves, avoiding whipsaws.

    ER  = abs(net direction) / sum(absolute daily moves)
    SC  = (ER * (fast_sc - slow_sc) + slow_sc) ^ 2
    KAMA = KAMA_prev + SC * (close - KAMA_prev)
    """
    fast_sc = 2.0 / (fast + 1)
    slow_sc = 2.0 / (slow + 1)

    kama_values = [float("nan")] * len(close)
    close_vals = close.values.astype(float)

    # Seed the first valid KAMA with the close price at index n
    for i in range(len(close_vals)):
        if i < n:
            continue
        if np.isnan(kama_values[i - 1]) or i == n:
            kama_values[i] = close_vals[i]
            continue
        window = close_vals[i - n: i + 1]
        direction = abs(window[-1] - window[0])
        volatility = np.sum(np.abs(np.diff(window)))
        er = direction / volatility if volatility > 0 else 0.0
        sc = (er * (fast_sc - slow_sc) + slow_sc) ** 2
        kama_values[i] = kama_values[i - 1] + sc * (close_vals[i] - kama_values[i - 1])

    return pd.Series(kama_values, index=close.index)


def compute_efficiency_ratio(close: pd.Series, n: int = 10) -> pd.Series:
    """
    Kaufman Efficiency Ratio: net direction / total path over n bars.
    Range 0–1: 0 = choppy, 1 = perfectly trending.
    """
    direction = close.diff(n).abs()
    volatility = close.diff().abs().rolling(n).sum()
    return direction / volatility.replace(0, np.nan)


def compute_supertrend(df: pd.DataFrame, period: int = 10, multiplier: float = 3.0) -> pd.DataFrame:
    """
    Supertrend indicator.

    Uses ATR-based bands around HL midpoint. Price above upper band → uptrend (BUY).
    Price below lower band → downtrend (SELL).

    Returns DataFrame: supertrend (the support/resistance line), direction (1=up, -1=down).
    """
    atr = compute_atr(df, period)
    hl_mid = (df["High"] + df["Low"]) / 2

    basic_upper = hl_mid + multiplier * atr
    basic_lower = hl_mid - multiplier * atr

    supertrend = pd.Series(np.nan, index=df.index)
    direction = pd.Series(0, index=df.index)

    final_upper = basic_upper.copy()
    final_lower = basic_lower.copy()

    close = df["Close"]

    for i in range(1, len(df)):
        # Final upper band
        if basic_upper.iloc[i] < final_upper.iloc[i - 1] or close.iloc[i - 1] > final_upper.iloc[i - 1]:
            final_upper.iloc[i] = basic_upper.iloc[i]
        else:
            final_upper.iloc[i] = final_upper.iloc[i - 1]

        # Final lower band
        if basic_lower.iloc[i] > final_lower.iloc[i - 1] or close.iloc[i - 1] < final_lower.iloc[i - 1]:
            final_lower.iloc[i] = basic_lower.iloc[i]
        else:
            final_lower.iloc[i] = final_lower.iloc[i - 1]

        # Direction
        if pd.isna(supertrend.iloc[i - 1]):
            direction.iloc[i] = 1 if close.iloc[i] > final_upper.iloc[i] else -1
        elif supertrend.iloc[i - 1] == final_upper.iloc[i - 1]:
            direction.iloc[i] = -1 if close.iloc[i] < final_lower.iloc[i] else 1
        else:
            direction.iloc[i] = 1 if close.iloc[i] > final_upper.iloc[i] else -1

        supertrend.iloc[i] = final_lower.iloc[i] if direction.iloc[i] == 1 else final_upper.iloc[i]

    return pd.DataFrame({"supertrend": supertrend, "direction": direction,
                         "final_upper": final_upper, "final_lower": final_lower})


def compute_keltner_channels(
    df: pd.DataFrame, ema_period: int = 20, atr_period: int = 10, multiplier: float = 2.0
) -> pd.DataFrame:
    """
    Keltner Channels: EMA ± multiplier * ATR.
    Returns DataFrame: upper, middle (EMA), lower.
    """
    middle = compute_ema(df["Close"], ema_period)
    atr = compute_atr(df, atr_period)
    upper = middle + multiplier * atr
    lower = middle - multiplier * atr
    return pd.DataFrame({"upper": upper, "middle": middle, "lower": lower})


def compute_stoch_rsi(
    close: pd.Series, rsi_period: int = 14, stoch_period: int = 14,
    smooth_k: int = 3, smooth_d: int = 3,
) -> pd.DataFrame:
    """
    Stochastic RSI — applies Stochastic oscillator to RSI values.
    Returns DataFrame: stoch_rsi, k (smoothed), d (signal line).
    Range 0–100.
    """
    rsi = compute_rsi(close, rsi_period)
    rsi_min = rsi.rolling(stoch_period).min()
    rsi_max = rsi.rolling(stoch_period).max()
    stoch_rsi = 100 * (rsi - rsi_min) / (rsi_max - rsi_min).replace(0, np.nan)
    k = stoch_rsi.rolling(smooth_k).mean()
    d = k.rolling(smooth_d).mean()
    return pd.DataFrame({"stoch_rsi": stoch_rsi, "k": k, "d": d})
