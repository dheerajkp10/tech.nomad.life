from datetime import datetime
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.portfolio import Holding, Transaction
from app.models.watchlist import WatchlistItem
from app.schemas.portfolio import (
    BuyRequest,
    HoldingOut,
    HoldingWithPrice,
    PortfolioSummary,
    SellRequest,
    TransactionOut,
    WatchlistItemIn,
    WatchlistItemOut,
)
from app.services import data_fetcher

router = APIRouter()


@router.get("/holdings", response_model=List[HoldingWithPrice])
def get_holdings(db: Session = Depends(get_db)):
    """Get all holdings with live prices and P&L."""
    holdings = db.query(Holding).all()
    if not holdings:
        return []

    tickers = [h.ticker for h in holdings]
    quotes = data_fetcher.get_batch_quotes(tickers)

    result = []
    for h in holdings:
        q = quotes.get(h.ticker, {})
        current_price = q.get("price") or h.avg_cost
        day_change = q.get("day_change", 0.0) or 0.0
        day_change_pct = q.get("day_change_pct", 0.0) or 0.0
        market_value = h.shares * current_price
        cost_basis = h.shares * h.avg_cost
        unrealized_pnl = market_value - cost_basis
        unrealized_pct = (unrealized_pnl / cost_basis * 100) if cost_basis > 0 else 0.0

        result.append(
            HoldingWithPrice(
                ticker=h.ticker,
                shares=round(h.shares, 6),
                avg_cost=round(h.avg_cost, 4),
                current_price=round(current_price, 4),
                market_value=round(market_value, 2),
                cost_basis=round(cost_basis, 2),
                unrealized_pnl=round(unrealized_pnl, 2),
                unrealized_pct=round(unrealized_pct, 2),
                day_change=round(day_change, 4),
                day_change_pct=round(day_change_pct, 4),
            )
        )
    return result


@router.post("/buy", response_model=TransactionOut)
def buy(request: BuyRequest, db: Session = Depends(get_db)):
    """Record a buy transaction and upsert holding."""
    executed_at = request.executed_at or datetime.utcnow()

    # Create transaction
    txn = Transaction(
        ticker=request.ticker,
        action="BUY",
        shares=request.shares,
        price=request.price,
        total_value=request.shares * request.price,
        executed_at=executed_at,
        notes=request.notes,
    )
    db.add(txn)

    # Upsert holding (weighted average cost)
    holding = db.query(Holding).filter(Holding.ticker == request.ticker).first()
    if holding:
        total_cost = (holding.shares * holding.avg_cost) + (request.shares * request.price)
        holding.shares += request.shares
        holding.avg_cost = total_cost / holding.shares
        holding.updated_at = datetime.utcnow()
    else:
        holding = Holding(
            ticker=request.ticker,
            shares=request.shares,
            avg_cost=request.price,
        )
        db.add(holding)

    db.commit()
    db.refresh(txn)
    return txn


@router.post("/sell", response_model=TransactionOut)
def sell(request: SellRequest, db: Session = Depends(get_db)):
    """Record a sell transaction and update holding."""
    holding = db.query(Holding).filter(Holding.ticker == request.ticker).first()
    if not holding:
        raise HTTPException(status_code=404, detail=f"No holding found for {request.ticker}")
    if request.shares > holding.shares + 0.0001:
        raise HTTPException(
            status_code=400,
            detail=f"Cannot sell {request.shares} shares; only {holding.shares:.4f} held",
        )

    executed_at = request.executed_at or datetime.utcnow()
    txn = Transaction(
        ticker=request.ticker,
        action="SELL",
        shares=request.shares,
        price=request.price,
        total_value=request.shares * request.price,
        executed_at=executed_at,
        notes=request.notes,
    )
    db.add(txn)

    holding.shares -= request.shares
    holding.updated_at = datetime.utcnow()

    if holding.shares <= 0.0001:
        db.delete(holding)

    db.commit()
    db.refresh(txn)
    return txn


@router.delete("/holdings/{ticker}")
def delete_holding(ticker: str, db: Session = Depends(get_db)):
    """Remove a holding entirely."""
    holding = db.query(Holding).filter(Holding.ticker == ticker.upper()).first()
    if not holding:
        raise HTTPException(status_code=404, detail=f"No holding found for {ticker}")
    db.delete(holding)
    db.commit()
    return {"ok": True}


@router.get("/transactions", response_model=List[TransactionOut])
def get_transactions(
    ticker: Optional[str] = Query(None),
    limit: int = Query(100),
    db: Session = Depends(get_db),
):
    """Get transaction history."""
    query = db.query(Transaction).order_by(Transaction.executed_at.desc())
    if ticker:
        query = query.filter(Transaction.ticker == ticker.upper())
    return query.limit(limit).all()


@router.get("/summary", response_model=PortfolioSummary)
def get_summary(db: Session = Depends(get_db)):
    """Get aggregated portfolio summary."""
    holdings = db.query(Holding).all()
    if not holdings:
        return PortfolioSummary(
            total_cost_basis=0,
            total_market_value=0,
            total_unrealized_pnl=0,
            total_unrealized_pct=0,
            holdings_count=0,
            day_pnl=0,
            day_pnl_pct=0,
        )

    tickers = [h.ticker for h in holdings]
    quotes = data_fetcher.get_batch_quotes(tickers)

    total_cost = 0.0
    total_value = 0.0
    total_day_pnl = 0.0

    for h in holdings:
        q = quotes.get(h.ticker, {})
        price = q.get("price") or h.avg_cost
        day_change = q.get("day_change", 0.0) or 0.0
        prev_price = price - day_change

        total_cost += h.shares * h.avg_cost
        total_value += h.shares * price
        total_day_pnl += h.shares * day_change

    total_pnl = total_value - total_cost
    total_pnl_pct = (total_pnl / total_cost * 100) if total_cost > 0 else 0.0
    prev_total = total_value - total_day_pnl
    day_pnl_pct = (total_day_pnl / prev_total * 100) if prev_total > 0 else 0.0

    return PortfolioSummary(
        total_cost_basis=round(total_cost, 2),
        total_market_value=round(total_value, 2),
        total_unrealized_pnl=round(total_pnl, 2),
        total_unrealized_pct=round(total_pnl_pct, 2),
        holdings_count=len(holdings),
        day_pnl=round(total_day_pnl, 2),
        day_pnl_pct=round(day_pnl_pct, 2),
    )


# Watchlist routes
@router.get("/watchlist", response_model=List[WatchlistItemOut])
def get_watchlist(db: Session = Depends(get_db)):
    return db.query(WatchlistItem).order_by(WatchlistItem.added_at.desc()).all()


@router.post("/watchlist", response_model=WatchlistItemOut)
def add_to_watchlist(item: WatchlistItemIn, db: Session = Depends(get_db)):
    existing = db.query(WatchlistItem).filter(WatchlistItem.ticker == item.ticker).first()
    if existing:
        raise HTTPException(status_code=400, detail=f"{item.ticker} is already in watchlist")
    wl = WatchlistItem(ticker=item.ticker, notes=item.notes)
    db.add(wl)
    db.commit()
    db.refresh(wl)
    return wl


@router.delete("/watchlist/{ticker}")
def remove_from_watchlist(ticker: str, db: Session = Depends(get_db)):
    item = db.query(WatchlistItem).filter(WatchlistItem.ticker == ticker.upper()).first()
    if not item:
        raise HTTPException(status_code=404, detail=f"{ticker} not in watchlist")
    db.delete(item)
    db.commit()
    return {"ok": True}
