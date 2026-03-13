from datetime import date
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, field_validator


class BacktestRequest(BaseModel):
    ticker: str
    strategy: str
    start_date: date
    end_date: date
    initial_capital: float = 10000.0
    strategy_params: Dict[str, Any] = {}

    @field_validator("ticker")
    @classmethod
    def ticker_upper(cls, v: str) -> str:
        return v.upper().strip()

    @field_validator("initial_capital")
    @classmethod
    def positive_capital(cls, v: float) -> float:
        if v <= 0:
            raise ValueError("Initial capital must be positive")
        return v


class EquityPoint(BaseModel):
    date: str
    value: float


class TradeRecord(BaseModel):
    date: str
    action: str         # "BUY" | "SELL"
    price: float
    shares: float
    value: float
    pnl: Optional[float] = None   # Only set on SELL


class BacktestResult(BaseModel):
    ticker: str
    strategy: str
    start_date: str
    end_date: str
    initial_capital: float
    final_value: float
    total_return_pct: float
    annualized_return_pct: float
    sharpe_ratio: float
    max_drawdown_pct: float
    win_rate: float
    total_trades: int
    equity_curve: List[EquityPoint]
    trades: List[TradeRecord]


class StrategyInfo(BaseModel):
    name: str
    description: str
    params: Dict[str, Any]
