# StockPilot — Algorithmic Trading Dashboard

A local-first stock portfolio manager with algorithmic trading signals and backtesting.

## Features

- **Portfolio Tracker** — Track holdings, cost basis, unrealized P&L, and daily changes
- **7 Trading Signals** — RSI, MACD, Bollinger Bands, MA Crossover, Momentum, Mean Reversion, ML
- **Backtesting** — Test strategies on historical data with Sharpe ratio, max drawdown, equity curve
- **Charts** — Candlestick + BB/SMA overlays, RSI pane, MACD pane, portfolio allocation pie

## Quick Start

### Backend (Python / FastAPI)

```bash
cd backend
python3 -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

API docs at: **http://localhost:8000/docs**

### Frontend (React / Vite)

```bash
cd frontend
npm install
npm run dev
```

App at: **http://localhost:5173**

## Project Structure

```
stock-portfolio/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI entry point
│   │   ├── models/              # SQLAlchemy ORM models
│   │   ├── schemas/             # Pydantic request/response schemas
│   │   ├── routers/             # API route handlers
│   │   └── services/
│   │       ├── data_fetcher.py  # yfinance wrapper with caching
│   │       ├── indicators.py    # RSI, MACD, BB, MA (pure functions)
│   │       ├── strategies.py    # 6 strategy classes
│   │       ├── ml_signals.py    # RandomForest ML signal
│   │       ├── signal_aggregator.py  # Weighted signal → BUY/SELL/HOLD
│   │       └── backtester.py    # Vectorized backtesting engine
│   └── requirements.txt
└── frontend/
    └── src/
        ├── pages/               # Dashboard, Portfolio, Analysis, Backtesting
        ├── components/          # Charts, SignalCards, TradeModal, etc.
        └── api/                 # Axios API client functions
```

## Trading Strategies

| Strategy | Type | Signal Logic |
|----------|------|-------------|
| RSI | Mean Reversion | BUY < 30, SELL > 70 |
| MACD | Momentum | BUY/SELL on histogram zero-cross |
| Bollinger Bands | Mean Reversion | BUY at lower band, SELL at upper |
| MA Crossover | Trend Following | Golden/death cross (EMA 20/50) |
| Momentum | Trend | All timeframes (1/3/6mo) positive |
| Mean Reversion | Statistical | Z-score ±2σ from rolling mean |
| ML Signal | Machine Learning | RandomForest on 12 technical features |

Signals are aggregated by weighted vote → final BUY/SELL/HOLD with confidence %.

## ML Model

Train a per-ticker ML model via the Analysis page ("Train ML Model" button) or API:

```bash
curl -X POST "http://localhost:8000/api/analysis/train-ml/AAPL"
```

Uses 3 years of daily data, RandomForestClassifier, 80/20 time-ordered split.

## Scaling to Production

- Replace SQLite with PostgreSQL: change `DATABASE_URL` in `.env`
- Add auth: FastAPI JWT middleware + Axios auth interceptor
- Deploy: backend to Railway/Render, frontend to Vercel
