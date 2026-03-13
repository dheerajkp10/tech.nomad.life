"""
ML-based trading signal using RandomForest classifier.
Trained per-ticker on historical OHLCV data.
"""
import os
from datetime import datetime
from typing import Optional

import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, f1_score
from sklearn.preprocessing import LabelEncoder

from app.config import settings
from app.schemas.analysis import MLTrainResult, Signal
from app.services import indicators as ind

# Label encoding: 0=SELL, 1=HOLD, 2=BUY
LABEL_MAP = {0: "SELL", 1: "HOLD", 2: "BUY"}
DIRECTION_LABEL = {"SELL": 0, "HOLD": 1, "BUY": 2}


def _model_path(ticker: str) -> str:
    os.makedirs(settings.MODELS_CACHE_DIR, exist_ok=True)
    return os.path.join(settings.MODELS_CACHE_DIR, f"{ticker.upper()}_model.pkl")


def _build_features(df: pd.DataFrame) -> pd.DataFrame:
    """Compute all feature columns from raw OHLCV DataFrame."""
    close = df["Close"]
    volume = df["Volume"]

    features = pd.DataFrame(index=df.index)

    # Return features
    features["return_1d"] = close.pct_change(1)
    features["return_5d"] = close.pct_change(5)
    features["return_10d"] = close.pct_change(10)
    features["return_21d"] = close.pct_change(21)

    # Technical indicator features
    features["rsi_14"] = ind.compute_rsi(close, 14)

    macd_df = ind.compute_macd(close)
    features["macd_histogram"] = macd_df["histogram"]

    bb_df = ind.compute_bollinger_bands(close)
    features["bb_pct_b"] = bb_df["pct_b"]

    sma20 = ind.compute_sma(close, 20)
    sma50 = ind.compute_sma(close, 50)
    features["price_vs_sma20"] = (close / sma20) - 1
    features["price_vs_sma50"] = (close / sma50) - 1

    # Volatility features
    atr = ind.compute_atr(df)
    features["atr_pct"] = atr / close
    features["rolling_vol_10d"] = close.pct_change().rolling(10).std()

    # Volume feature
    vol_ma = volume.rolling(20).mean()
    features["volume_ratio"] = volume / vol_ma.replace(0, np.nan)

    return features


def _build_labels(close: pd.Series, forward_days: int = 5, threshold: float = 0.02) -> pd.Series:
    """
    Forward return labels:
      > +threshold → BUY (2)
      < -threshold → SELL (0)
      else         → HOLD (1)
    """
    forward_return = close.shift(-forward_days) / close - 1
    labels = forward_return.apply(
        lambda r: 2 if r > threshold else (0 if r < -threshold else 1)
    )
    return labels


def train(ticker: str, lookback_days: int = 756) -> MLTrainResult:
    """Train and persist a RandomForest model for the given ticker."""
    from app.services.data_fetcher import get_history

    period = "3y" if lookback_days >= 756 else "2y"
    df = get_history(ticker, period=period, interval="1d")

    if len(df) < 200:
        raise ValueError(f"Insufficient data for {ticker}: only {len(df)} rows")

    features = _build_features(df)
    labels = _build_labels(df["Close"])

    # Align and drop NaN rows
    combined = features.copy()
    combined["label"] = labels
    combined = combined.dropna()

    if len(combined) < 100:
        raise ValueError(f"Too few clean rows ({len(combined)}) for {ticker}")

    X = combined[features.columns].values
    y = combined["label"].astype(int).values

    # Time-ordered split (no shuffling)
    split_idx = int(len(X) * 0.8)
    X_train, X_test = X[:split_idx], X[split_idx:]
    y_train, y_test = y[:split_idx], y[split_idx:]

    model = RandomForestClassifier(
        n_estimators=200,
        max_depth=6,
        min_samples_leaf=10,
        class_weight="balanced",
        random_state=42,
        n_jobs=-1,
    )
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    accuracy = float(np.mean(y_pred == y_test))

    report = classification_report(y_test, y_pred, labels=[0, 1, 2], output_dict=True, zero_division=0)

    # Persist model and feature column list
    payload = {"model": model, "feature_columns": list(features.columns)}
    joblib.dump(payload, _model_path(ticker))

    return MLTrainResult(
        ticker=ticker.upper(),
        accuracy=round(accuracy, 4),
        f1_buy=round(report.get("2", {}).get("f1-score", 0.0), 4),
        f1_sell=round(report.get("0", {}).get("f1-score", 0.0), 4),
        f1_hold=round(report.get("1", {}).get("f1-score", 0.0), 4),
        n_samples=len(combined),
        message=f"Model trained on {len(X_train)} samples, validated on {len(X_test)} samples.",
    )


def predict(ticker: str, df: pd.DataFrame) -> Optional[Signal]:
    """
    Generate ML signal for ticker using latest data.
    Returns None if model not yet trained.
    """
    path = _model_path(ticker)
    if not os.path.exists(path):
        return None

    payload = joblib.load(path)
    model: RandomForestClassifier = payload["model"]
    feature_columns: list = payload["feature_columns"]

    features = _build_features(df)
    # Get latest row, ensuring all columns are present
    try:
        latest = features[feature_columns].iloc[-1:].values
    except KeyError:
        return None

    if np.isnan(latest).any():
        return None

    label_int = int(model.predict(latest)[0])
    proba = model.predict_proba(latest)[0]
    confidence = float(np.max(proba))
    direction = LABEL_MAP.get(label_int, "HOLD")

    # Only report a directional signal if confidence exceeds threshold
    if confidence < 0.45:
        direction = "HOLD"

    return Signal(
        strategy="ML",
        direction=direction,
        strength=round(confidence, 4),
        reason=f"RandomForest: {direction} (confidence={confidence:.1%})",
        timestamp=datetime.utcnow(),
    )
