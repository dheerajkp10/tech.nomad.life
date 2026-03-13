from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel


class Signal(BaseModel):
    strategy: str        # "RSI" | "MACD" | "BB" | "MA_CROSS" | "MOMENTUM" | "MEAN_REV" | "ML"
    direction: str       # "BUY" | "SELL" | "HOLD"
    strength: float      # 0.0–1.0
    reason: str
    timestamp: datetime


class Recommendation(BaseModel):
    ticker: str
    direction: str       # "BUY" | "SELL" | "HOLD"
    confidence: float    # 0.0–1.0
    signals: List[Signal]
    summary: str


class IndicatorValues(BaseModel):
    ticker: str
    period: str
    dates: List[str]
    open: List[float]
    high: List[float]
    low: List[float]
    close: List[float]
    volume: List[float]
    sma_20: List[Optional[float]]
    sma_50: List[Optional[float]]
    sma_200: List[Optional[float]]
    ema_20: List[Optional[float]]
    bb_upper: List[Optional[float]]
    bb_middle: List[Optional[float]]
    bb_lower: List[Optional[float]]
    rsi: List[Optional[float]]
    macd_line: List[Optional[float]]
    macd_signal: List[Optional[float]]
    macd_histogram: List[Optional[float]]


class MLTrainResult(BaseModel):
    ticker: str
    accuracy: float
    f1_buy: float
    f1_sell: float
    f1_hold: float
    n_samples: int
    message: str
