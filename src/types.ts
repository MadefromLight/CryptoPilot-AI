export type Side = "BUY" | "SELL";
export type Signal = "BUY" | "SELL" | "HOLD";

export interface Candle {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface IndicatorSnapshot {
  smaFast: number | null;
  smaSlow: number | null;
  emaFast: number | null;
  emaSlow: number | null;
  rsi: number | null;
}

export interface StrategyDecision {
  signal: Signal;
  confidence: number;
  reason: string;
  indicators: IndicatorSnapshot;
}

export interface BacktestTrade {
  timestamp: number;
  side: Side;
  price: number;
  quantity: number;
  fee: number;
  pnl: number;
}

export interface BacktestResult {
  symbol: string;
  initialCapital: number;
  finalEquity: number;
  totalReturnPct: number;
  maxDrawdownPct: number;
  winRatePct: number;
  trades: number;
  profitFactor: number;
  sharpeLikeRatio: number;
  decisions: number;
  tradeLog: BacktestTrade[];
}

export interface Portfolio {
  cash: number;
  assetQuantity: number;
  averageEntry: number;
  realizedPnl: number;
}
