# CryptoPilot AI

CryptoPilot AI is an AI-ready cryptocurrency market research and paper-trading platform built with TypeScript and Node.js.

The project is designed as a portfolio-grade backend system first. It separates market data, indicators, strategy signals, risk management, backtesting, paper execution, and HTTP APIs so each part can be tested and extended independently.

> **Current scope:** research and paper trading only. No real-money order execution is implemented.

## Architecture

```
Market Data -> Indicators -> Strategy -> Risk Engine -> Paper Broker
                    |            |            |
                    +------------+------------+
                                 |
                              Backtest
                                 |
                              Reports
                                 |
                              REST API
```

## Current capabilities

- TypeScript/Node.js backend
- OHLCV market-data model
- Technical indicators: SMA, EMA, RSI
- Signal generation from multiple indicators
- Risk limits and position sizing
- Historical backtesting
- Paper portfolio and order simulation
- Performance metrics: return, win rate, drawdown, Sharpe-style ratio
- REST API for health, strategy analysis, backtests and paper portfolio
- Deterministic mock market data for local development and tests
- Vitest test suite
- Docker and Docker Compose
- GitHub Actions CI

## Planned evolution

1. Live market-data adapter
2. Persistent PostgreSQL trade/research store
3. Redis caching
4. AI analyst/model provider
5. Feature engineering and ML experiments
6. Walk-forward validation
7. Strategy comparison and experiment tracking
8. Web dashboard
9. Optional exchange integration behind explicit risk controls

## Run locally

Requirements: Node.js 20+ and npm.

```bash
npm install
cp .env.example .env
npm run dev
```

API: `http://localhost:4000`

Run tests:

```bash
npm test
```

Build:

```bash
npm run build
npm start
```

## API

- `GET /api/health`
- `GET /api/market/:symbol/sample`
- `POST /api/backtests/run`
- `GET /api/paper/portfolio`
- `POST /api/paper/reset`

Example backtest request:

```json
{
  "symbol": "BTCUSDT",
  "initialCapital": 10000,
  "riskPerTrade": 0.01
}
```

## Research principles

CryptoPilot should never evaluate a strategy only on the data used to develop it. Future AI/ML work should use train/validation/test splits, walk-forward evaluation, transaction-cost assumptions and out-of-sample reporting.

Past performance is not evidence of future returns. The project is for software engineering, research and simulation.
