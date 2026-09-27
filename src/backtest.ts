import { analyzeMarket } from "./strategy.js";
import { defaultRiskConfig, positionSize, type RiskConfig } from "./risk.js";
import type { BacktestResult, BacktestTrade, Candle } from "./types.js";

export function runBacktest(
  symbol: string,
  candles: Candle[],
  initialCapital: number,
  riskConfig: RiskConfig = defaultRiskConfig,
): BacktestResult {
  if (initialCapital <= 0) throw new Error("initialCapital must be greater than zero");
  if (candles.length < 35) throw new Error("At least 35 candles are required");

  let cash = initialCapital;
  let asset = 0;
  let entry = 0;
  let peakEquity = initialCapital;
  let maxDrawdown = 0;
  let wins = 0;
  let losses = 0;
  let grossProfit = 0;
  let grossLoss = 0;
  const returns: number[] = [];
  const tradeLog: BacktestTrade[] = [];
  let decisions = 0;

  for (let i = 34; i < candles.length; i += 1) {
    const history = candles.slice(0, i + 1);
    const candle = candles[i]!;
    const decision = analyzeMarket(history);
    decisions += 1;

    if (decision.signal === "BUY" && asset === 0) {
      const quantity = positionSize(cash, candle.close, riskConfig);
      const notional = quantity * candle.close;
      const fee = notional * riskConfig.feeRate;

      if (quantity > 0 && cash >= notional + fee) {
        cash -= notional + fee;
        asset = quantity;
        entry = candle.close;
        tradeLog.push({ timestamp: candle.timestamp, side: "BUY", price: candle.close, quantity, fee, pnl: 0 });
      }
    }

    if (decision.signal === "SELL" && asset > 0) {
      const notional = asset * candle.close;
      const fee = notional * riskConfig.feeRate;
      const pnl = (candle.close - entry) * asset - fee;

      cash += notional - fee;
      tradeLog.push({ timestamp: candle.timestamp, side: "SELL", price: candle.close, quantity: asset, fee, pnl });

      if (pnl >= 0) {
        wins += 1;
        grossProfit += pnl;
      } else {
        losses += 1;
        grossLoss += Math.abs(pnl);
      }

      asset = 0;
      entry = 0;
    }

    const equity = cash + asset * candle.close;
    peakEquity = Math.max(peakEquity, equity);
    maxDrawdown = Math.max(maxDrawdown, (peakEquity - equity) / peakEquity);
    returns.push((equity - initialCapital) / initialCapital);
  }

  const lastPrice = candles.at(-1)!.close;
  const finalEquity = cash + asset * lastPrice;
  const totalReturnPct = ((finalEquity - initialCapital) / initialCapital) * 100;
  const closedTrades = wins + losses;
  const mean = returns.length ? returns.reduce((a, b) => a + b, 0) / returns.length : 0;
  const variance = returns.length
    ? returns.reduce((sum, value) => sum + (value - mean) ** 2, 0) / returns.length
    : 0;

  return {
    symbol,
    initialCapital,
    finalEquity,
    totalReturnPct,
    maxDrawdownPct: maxDrawdown * 100,
    winRatePct: closedTrades ? (wins / closedTrades) * 100 : 0,
    trades: closedTrades,
    profitFactor: grossLoss === 0 ? (grossProfit > 0 ? Infinity : 0) : grossProfit / grossLoss,
    sharpeLikeRatio: variance === 0 ? 0 : mean / Math.sqrt(variance),
    decisions,
    tradeLog,
  };
}
