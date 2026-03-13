"""
Fidelity CSV portfolio import.

Fidelity export columns (16 total):
  Account Number, Account Name, Symbol, Description, Quantity,
  Last Price, Last Price Change, Current Value, Today's Gain/Loss Dollar,
  Today's Gain/Loss Percent, Total Gain/Loss Dollar, Total Gain/Loss Percent,
  Percent Of Account, Cost Basis, Cost Basis Per Share, Type
"""
import io
import csv
import re
from datetime import datetime
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.portfolio import Holding, Transaction

router = APIRouter()

# Symbols to skip (cash, pending activity, etc.)
SKIP_SYMBOLS = {"", "--", "CASH", "FCASH", "FDRXX", "SPAXX", "FMPXX"}
SKIP_PREFIXES = ("Pending", "pending")


def _clean_number(value: str) -> Optional[float]:
    """Strip $, +, %, commas from a number string and return float or None."""
    if not value or value.strip() in ("--", "N/A", ""):
        return None
    cleaned = re.sub(r"[$%+, ]", "", value.strip())
    try:
        return float(cleaned)
    except ValueError:
        return None


class ImportResult(BaseModel):
    imported: int
    skipped: int
    errors: List[str]
    holdings: List[dict]


@router.post("/fidelity", response_model=ImportResult)
async def import_fidelity_csv(
    file: UploadFile = File(...),
    mode: str = "replace",   # "replace" | "merge"
    db: Session = Depends(get_db),
):
    """
    Import holdings from a Fidelity positions CSV export.

    mode="replace"  — clears all existing holdings first, then imports
    mode="merge"    — upserts: updates existing tickers, adds new ones
    """
    if not file.filename or not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="File must be a .csv")

    content = await file.read()
    text = content.decode("utf-8-sig")  # strip BOM if present

    reader = csv.DictReader(io.StringIO(text))

    # Normalize headers (strip whitespace)
    if reader.fieldnames is None:
        raise HTTPException(status_code=400, detail="CSV has no headers")

    # Build a case-insensitive header map
    raw_headers = [h.strip() for h in reader.fieldnames]

    imported = 0
    skipped = 0
    errors = []
    rows_to_import = []

    for row_num, row in enumerate(reader, start=2):
        # Normalise keys — guard against None values that appear in Fidelity's
        # footer/summary rows (e.g. "Account Total") where trailing columns are
        # missing and csv.DictReader fills them with None.
        row = {k.strip(): (v.strip() if v is not None else "") for k, v in row.items() if k}

        symbol = row.get("Symbol", "").strip().upper()
        description = row.get("Description", "").strip()

        # Skip non-equity rows
        if not symbol or symbol in SKIP_SYMBOLS:
            skipped += 1
            continue
        if any(description.startswith(p) for p in SKIP_PREFIXES):
            skipped += 1
            continue
        # Skip rows where symbol contains spaces (usually summary lines)
        if " " in symbol:
            skipped += 1
            continue

        quantity = _clean_number(row.get("Quantity", ""))
        cost_basis_per_share = _clean_number(row.get("Cost Basis Per Share", ""))
        cost_basis_total = _clean_number(row.get("Cost Basis", ""))
        last_price = _clean_number(row.get("Last Price", ""))

        if quantity is None or quantity <= 0:
            skipped += 1
            continue

        # Determine avg cost: prefer per-share, fall back to total/qty
        if cost_basis_per_share and cost_basis_per_share > 0:
            avg_cost = cost_basis_per_share
        elif cost_basis_total and cost_basis_total > 0 and quantity > 0:
            avg_cost = cost_basis_total / quantity
        elif last_price and last_price > 0:
            avg_cost = last_price  # fallback: use last price
            errors.append(
                f"Row {row_num} ({symbol}): no cost basis found, using last price ${last_price:.2f}"
            )
        else:
            errors.append(f"Row {row_num} ({symbol}): skipped — no price or cost basis data")
            skipped += 1
            continue

        rows_to_import.append({
            "ticker": symbol,
            "shares": quantity,
            "avg_cost": avg_cost,
        })

    if not rows_to_import:
        raise HTTPException(
            status_code=422,
            detail=f"No valid equity positions found in CSV. {skipped} rows skipped.",
        )

    # Apply to database
    if mode == "replace":
        # Delete all existing holdings
        db.query(Holding).delete()
        db.query(Transaction).filter(
            Transaction.notes == "__fidelity_import__"
        ).delete()

    now = datetime.utcnow()
    result_holdings = []

    for item in rows_to_import:
        ticker = item["ticker"]
        shares = item["shares"]
        avg_cost = item["avg_cost"]

        if mode == "replace":
            holding = Holding(
                ticker=ticker,
                shares=shares,
                avg_cost=avg_cost,
                created_at=now,
                updated_at=now,
            )
            db.add(holding)
        else:
            # Merge: upsert
            existing = db.query(Holding).filter(Holding.ticker == ticker).first()
            if existing:
                # Weighted average cost across old + new
                total_cost = (existing.shares * existing.avg_cost) + (shares * avg_cost)
                existing.shares += shares
                existing.avg_cost = total_cost / existing.shares
                existing.updated_at = now
            else:
                holding = Holding(
                    ticker=ticker,
                    shares=shares,
                    avg_cost=avg_cost,
                    created_at=now,
                    updated_at=now,
                )
                db.add(holding)

        # Record as a synthetic BUY transaction for audit trail
        txn = Transaction(
            ticker=ticker,
            action="BUY",
            shares=shares,
            price=avg_cost,
            total_value=shares * avg_cost,
            executed_at=now,
            notes="__fidelity_import__",
        )
        db.add(txn)

        result_holdings.append({"ticker": ticker, "shares": shares, "avg_cost": round(avg_cost, 4)})
        imported += 1

    db.commit()

    return ImportResult(
        imported=imported,
        skipped=skipped,
        errors=errors,
        holdings=result_holdings,
    )
