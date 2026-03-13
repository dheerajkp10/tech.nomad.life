"""
Aggregates signals from multiple strategies into a single Recommendation.
"""
from typing import List

from app.schemas.analysis import Recommendation, Signal

STRATEGY_WEIGHTS = {
    "SUPERTREND":     0.15,   # strong trend-follow, reliable flip signals
    "KAMA":           0.13,   # adaptive — high signal quality
    "DUAL_EMA":       0.12,   # volume-confirmed crossover
    "MACD_HIST":      0.12,   # early histogram momentum
    "MOMENTUM_12_1":  0.12,   # empirically validated 12-1 momentum
    "BB_RSI":         0.10,   # mean-reversion confluence
    "STOCH_RSI":      0.10,   # sensitive oscillator
    "KELTNER":        0.08,   # breakout — less frequent, high conviction
    "RSI_2":          0.05,   # very short-term, complements others
    "MEAN_REV_ADX":   0.03,   # additional mean-reversion confirmation
    "ML":             0.00,   # ML signals kept in registry but not weighted by default
}

DIRECTION_SCORE = {"BUY": 1, "SELL": -1, "HOLD": 0}

BUY_THRESHOLD = 0.20
SELL_THRESHOLD = -0.20


def aggregate_signals(ticker: str, signals: List[Signal]) -> Recommendation:
    """
    Combine signals into a weighted BUY/SELL/HOLD recommendation.
    """
    if not signals:
        return Recommendation(
            ticker=ticker,
            direction="HOLD",
            confidence=0.0,
            signals=[],
            summary="No signals available.",
        )

    weighted_score = 0.0
    total_weight = 0.0

    for signal in signals:
        weight = STRATEGY_WEIGHTS.get(signal.strategy, 0.10)
        score = DIRECTION_SCORE.get(signal.direction, 0)
        weighted_score += weight * score * signal.strength
        total_weight += weight

    # Normalize
    if total_weight > 0:
        weighted_score /= total_weight

    # Determine direction and confidence
    if weighted_score > BUY_THRESHOLD:
        direction = "BUY"
        confidence = min((weighted_score - BUY_THRESHOLD) / (1.0 - BUY_THRESHOLD), 1.0)
    elif weighted_score < SELL_THRESHOLD:
        direction = "SELL"
        confidence = min((abs(weighted_score) - abs(SELL_THRESHOLD)) / (1.0 - abs(SELL_THRESHOLD)), 1.0)
    else:
        direction = "HOLD"
        confidence = 1.0 - abs(weighted_score) / abs(BUY_THRESHOLD)

    confidence = max(0.0, min(1.0, confidence))

    # Build summary
    buy_signals = [s for s in signals if s.direction == "BUY"]
    sell_signals = [s for s in signals if s.direction == "SELL"]
    hold_signals = [s for s in signals if s.direction == "HOLD"]

    summary_parts = [
        f"{len(buy_signals)} BUY, {len(sell_signals)} SELL, {len(hold_signals)} HOLD signals."
    ]
    strong_signals = sorted(
        [s for s in signals if s.direction != "HOLD"],
        key=lambda s: s.strength,
        reverse=True,
    )[:3]
    for s in strong_signals:
        summary_parts.append(s.reason)

    summary = " | ".join(summary_parts)

    return Recommendation(
        ticker=ticker,
        direction=direction,
        confidence=round(confidence, 4),
        signals=signals,
        summary=summary,
    )
