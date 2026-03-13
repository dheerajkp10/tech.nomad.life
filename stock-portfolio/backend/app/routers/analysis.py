from typing import Dict, List

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.portfolio import Holding
from app.schemas.analysis import IndicatorValues, MLTrainResult, Recommendation, Signal
from app.services import data_fetcher, indicators as ind, ml_signals, signal_aggregator
from app.services.strategies import get_all_strategies

router = APIRouter()


def _get_indicator_values(ticker: str, period: str) -> IndicatorValues:
    df = data_fetcher.get_history(ticker, period=period, interval="1d")
    close = df["Close"]

    def _to_list(series):
        return [round(float(v), 4) if not __import__("math").isnan(v) else None for v in series]

    sma20 = ind.compute_sma(close, 20)
    sma50 = ind.compute_sma(close, 50)
    sma200 = ind.compute_sma(close, 200)
    ema20 = ind.compute_ema(close, 20)
    bb = ind.compute_bollinger_bands(close)
    rsi = ind.compute_rsi(close)
    macd = ind.compute_macd(close)

    return IndicatorValues(
        ticker=ticker,
        period=period,
        dates=[str(d.date()) for d in df.index],
        open=_to_list(df["Open"]),
        high=_to_list(df["High"]),
        low=_to_list(df["Low"]),
        close=_to_list(close),
        volume=[float(v) for v in df["Volume"]],
        sma_20=_to_list(sma20),
        sma_50=_to_list(sma50),
        sma_200=_to_list(sma200),
        ema_20=_to_list(ema20),
        bb_upper=_to_list(bb["upper"]),
        bb_middle=_to_list(bb["middle"]),
        bb_lower=_to_list(bb["lower"]),
        rsi=_to_list(rsi),
        macd_line=_to_list(macd["macd_line"]),
        macd_signal=_to_list(macd["signal_line"]),
        macd_histogram=_to_list(macd["histogram"]),
    )


@router.get("/indicators/{ticker}", response_model=IndicatorValues)
def get_indicators(
    ticker: str,
    period: str = Query("6mo", description="1mo|3mo|6mo|1y|2y"),
):
    """Get all indicator values for chart overlays."""
    try:
        return _get_indicator_values(ticker.upper(), period)
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.get("/signals/{ticker}", response_model=List[Signal])
def get_signals(
    ticker: str,
    period: str = Query("1y", description="Amount of history to use for signal generation"),
):
    """Get individual signals from each strategy."""
    try:
        df = data_fetcher.get_history(ticker.upper(), period=period, interval="1d")
        strategies = get_all_strategies()
        signals = [s.generate_signal(df) for s in strategies]

        # Add ML signal if model exists
        ml_signal = ml_signals.predict(ticker.upper(), df)
        if ml_signal:
            signals.append(ml_signal)

        return signals
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/recommendation/{ticker}", response_model=Recommendation)
def get_recommendation(
    ticker: str,
    period: str = Query("1y"),
):
    """Get aggregated BUY/SELL/HOLD recommendation with confidence."""
    try:
        df = data_fetcher.get_history(ticker.upper(), period=period, interval="1d")
        strategies = get_all_strategies()
        signals = [s.generate_signal(df) for s in strategies]

        ml_signal = ml_signals.predict(ticker.upper(), df)
        if ml_signal:
            signals.append(ml_signal)

        return signal_aggregator.aggregate_signals(ticker.upper(), signals)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/portfolio-signals", response_model=Dict[str, Recommendation])
def get_portfolio_signals(
    period: str = Query("1y"),
    db: Session = Depends(get_db),
):
    """Get recommendations for all holdings at once."""
    holdings = db.query(Holding).all()
    result = {}
    for h in holdings:
        try:
            df = data_fetcher.get_history(h.ticker, period=period, interval="1d")
            strategies = get_all_strategies()
            signals = [s.generate_signal(df) for s in strategies]
            ml_signal = ml_signals.predict(h.ticker, df)
            if ml_signal:
                signals.append(ml_signal)
            result[h.ticker] = signal_aggregator.aggregate_signals(h.ticker, signals)
        except Exception:
            pass
    return result


@router.post("/train-ml/{ticker}", response_model=MLTrainResult)
def train_ml_model(
    ticker: str,
    lookback_days: int = Query(756, ge=200, le=2000),
):
    """Train or retrain the ML model for a ticker."""
    try:
        return ml_signals.train(ticker.upper(), lookback_days)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
