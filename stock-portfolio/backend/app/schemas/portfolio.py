from datetime import datetime
from typing import Optional
from pydantic import BaseModel, field_validator


class BuyRequest(BaseModel):
    ticker: str
    shares: float
    price: float
    executed_at: Optional[datetime] = None
    notes: Optional[str] = None

    @field_validator("ticker")
    @classmethod
    def ticker_upper(cls, v: str) -> str:
        return v.upper().strip()

    @field_validator("shares", "price")
    @classmethod
    def positive(cls, v: float) -> float:
        if v <= 0:
            raise ValueError("Must be positive")
        return v


class SellRequest(BaseModel):
    ticker: str
    shares: float
    price: float
    executed_at: Optional[datetime] = None
    notes: Optional[str] = None

    @field_validator("ticker")
    @classmethod
    def ticker_upper(cls, v: str) -> str:
        return v.upper().strip()

    @field_validator("shares", "price")
    @classmethod
    def positive(cls, v: float) -> float:
        if v <= 0:
            raise ValueError("Must be positive")
        return v


class HoldingOut(BaseModel):
    id: int
    ticker: str
    shares: float
    avg_cost: float
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class HoldingWithPrice(BaseModel):
    ticker: str
    shares: float
    avg_cost: float
    current_price: float
    market_value: float
    cost_basis: float
    unrealized_pnl: float
    unrealized_pct: float
    day_change: float
    day_change_pct: float


class TransactionOut(BaseModel):
    id: int
    ticker: str
    action: str
    shares: float
    price: float
    total_value: float
    executed_at: datetime
    notes: Optional[str]

    model_config = {"from_attributes": True}


class PortfolioSummary(BaseModel):
    total_cost_basis: float
    total_market_value: float
    total_unrealized_pnl: float
    total_unrealized_pct: float
    holdings_count: int
    day_pnl: float
    day_pnl_pct: float


class WatchlistItemIn(BaseModel):
    ticker: str
    notes: Optional[str] = None

    @field_validator("ticker")
    @classmethod
    def ticker_upper(cls, v: str) -> str:
        return v.upper().strip()


class WatchlistItemOut(BaseModel):
    id: int
    ticker: str
    added_at: datetime
    notes: Optional[str]

    model_config = {"from_attributes": True}
