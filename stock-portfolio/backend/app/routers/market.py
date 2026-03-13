from __future__ import annotations
from typing import List, Optional

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel

from app.services import data_fetcher

router = APIRouter()


class Quote(BaseModel):
    ticker: str
    price: Optional[float]
    prev_close: Optional[float]
    day_change: float
    day_change_pct: float
    volume: int
    market_cap: Optional[float]
    fifty_two_week_high: Optional[float]
    fifty_two_week_low: Optional[float]


class OHLCVPoint(BaseModel):
    date: str
    open: float
    high: float
    low: float
    close: float
    volume: float


class SearchResult(BaseModel):
    symbol: str
    name: str
    exchange: str
    type: str


@router.get("/quote/{ticker}", response_model=Quote)
def get_quote(ticker: str):
    """Get real-time quote for a ticker."""
    try:
        q = data_fetcher.get_quote(ticker.upper())
        return Quote(**q)
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.get("/batch-quotes")
def get_batch_quotes(tickers: str = Query(..., description="Comma-separated tickers")):
    """Get quotes for multiple tickers."""
    ticker_list = [t.strip().upper() for t in tickers.split(",") if t.strip()]
    return data_fetcher.get_batch_quotes(ticker_list)


@router.get("/history/{ticker}", response_model=List[OHLCVPoint])
def get_history(
    ticker: str,
    period: str = Query("1y", description="1mo|3mo|6mo|1y|2y|5y"),
    interval: str = Query("1d", description="1d|1wk"),
):
    """Get OHLCV history for a ticker."""
    try:
        df = data_fetcher.get_history(ticker.upper(), period=period, interval=interval)
        result = []
        for ts, row in df.iterrows():
            result.append(
                OHLCVPoint(
                    date=str(ts.date()),
                    open=round(float(row["Open"]), 4),
                    high=round(float(row["High"]), 4),
                    low=round(float(row["Low"]), 4),
                    close=round(float(row["Close"]), 4),
                    volume=float(row["Volume"]),
                )
            )
        return result
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.get("/search", response_model=List[SearchResult])
def search_tickers(q: str = Query(..., min_length=1)):
    """Search for tickers by name or symbol."""
    results = data_fetcher.search_tickers(q)
    return [SearchResult(**r) for r in results]
