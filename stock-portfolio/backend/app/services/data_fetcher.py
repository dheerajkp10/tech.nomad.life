import time
from datetime import date
from typing import Dict, List, Optional
import pandas as pd
import yfinance as yf


# Simple in-memory TTL cache
_cache: Dict[str, tuple] = {}  # key -> (data, expiry_ts)


def _cache_get(key: str):
    if key in _cache:
        data, expiry = _cache[key]
        if time.time() < expiry:
            return data
        del _cache[key]
    return None


def _cache_set(key: str, data, ttl_seconds: int):
    _cache[key] = (data, time.time() + ttl_seconds)


def _normalize_df(df: pd.DataFrame) -> pd.DataFrame:
    """Normalize OHLCV columns and index timezone."""
    df = df[["Open", "High", "Low", "Close", "Volume"]].copy()
    df.index = pd.to_datetime(df.index)
    if df.index.tz is not None:
        df.index = df.index.tz_convert(None)
    return df


def get_history(
    ticker: str,
    period: str = "1y",
    interval: str = "1d",
) -> pd.DataFrame:
    """
    Fetch OHLCV history for a ticker using a relative period string.
    Used by the analysis/signals endpoints.
    """
    cache_key = f"history:{ticker}:{period}:{interval}"
    ttl = 300 if interval in ("1m", "5m", "15m", "30m", "1h") else 3600
    cached = _cache_get(cache_key)
    if cached is not None:
        return cached

    t = yf.Ticker(ticker)
    df = t.history(period=period, interval=interval)
    if df.empty:
        raise ValueError(f"No data returned for ticker '{ticker}'")

    df = _normalize_df(df)
    _cache_set(cache_key, df, ttl)
    return df


def get_history_range(
    ticker: str,
    start: date,
    end: date,
    interval: str = "1d",
) -> pd.DataFrame:
    """
    Fetch OHLCV history for a ticker using EXACT start/end dates.
    Used by the backtester so historical data is precisely bounded —
    not relative to today's date.
    """
    cache_key = f"history_range:{ticker}:{start}:{end}:{interval}"
    ttl = 3600
    cached = _cache_get(cache_key)
    if cached is not None:
        return cached

    t = yf.Ticker(ticker)
    # yfinance end date is exclusive, so add 1 day
    end_exclusive = pd.Timestamp(end) + pd.Timedelta(days=1)
    df = t.history(start=str(start), end=str(end_exclusive.date()), interval=interval)
    if df.empty:
        raise ValueError(f"No data returned for ticker '{ticker}' in range {start} – {end}")

    df = _normalize_df(df)
    _cache_set(cache_key, df, ttl)
    return df


def get_quote(ticker: str) -> dict:
    """Fetch real-time quote for a ticker."""
    cache_key = f"quote:{ticker}"
    cached = _cache_get(cache_key)
    if cached is not None:
        return cached

    t = yf.Ticker(ticker)
    info = t.fast_info
    hist = t.history(period="2d", interval="1d")

    current_price = float(info.last_price) if info.last_price else None
    prev_close = float(hist["Close"].iloc[-2]) if len(hist) >= 2 else current_price
    day_change = (current_price - prev_close) if (current_price and prev_close) else 0.0
    day_change_pct = (day_change / prev_close * 100) if prev_close else 0.0

    result = {
        "ticker": ticker.upper(),
        "price": current_price,
        "prev_close": prev_close,
        "day_change": round(day_change, 4),
        "day_change_pct": round(day_change_pct, 4),
        "volume": int(info.three_month_average_volume or 0),
        "market_cap": getattr(info, "market_cap", None),
        "fifty_two_week_high": getattr(info, "year_high", None),
        "fifty_two_week_low": getattr(info, "year_low", None),
    }
    _cache_set(cache_key, result, 60)
    return result


def get_batch_quotes(tickers: List[str]) -> Dict[str, dict]:
    """Fetch quotes for multiple tickers efficiently."""
    results = {}
    for ticker in tickers:
        try:
            results[ticker] = get_quote(ticker)
        except Exception:
            results[ticker] = {"ticker": ticker, "price": None, "error": True}
    return results


def search_tickers(query: str) -> List[dict]:
    """Search for tickers by name or symbol."""
    try:
        search = yf.Search(query, max_results=10)
        quotes = search.quotes if hasattr(search, "quotes") else []
        return [
            {
                "symbol": q.get("symbol", ""),
                "name": q.get("longname") or q.get("shortname", ""),
                "exchange": q.get("exchange", ""),
                "type": q.get("quoteType", ""),
            }
            for q in quotes
            if q.get("symbol")
        ]
    except Exception:
        return []
