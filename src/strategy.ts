import { calculateIndicators } from "./indicators.js";
import type { Candle, StrategyDecision } from "./types.js";

export function analyzeMarket(candles: Candle[]): StrategyDecision {
  const indicators = calculateIndicators(candles);
  const { smaFast, smaSlow, emaFast, emaSlow, rsi: relativeStrength } = indicators;

  if (
    smaFast === null ||
    smaSlow === null ||
    emaFast === null ||
    emaSlow === null ||
    relativeStrength === null
  ) {
    return {
      signal: "HOLD",
      confidence: 0,
      reason: "Insufficient historical data for the configured indicators.",
      indicators,
    };
  }

  let score = 0;
  const reasons: string[] = [];

  if (smaFast > smaSlow) {
    score += 1;
    reasons.push("fast SMA is above slow SMA");
  } else {
    score -= 1;
    reasons.push("fast SMA is below slow SMA");
  }

  if (emaFast > emaSlow) {
    score += 1;
    reasons.push("fast EMA is above slow EMA");
  } else {
    score -= 1;
    reasons.push("fast EMA is below slow EMA");
  }

  if (relativeStrength >= 50 && relativeStrength < 70) {
    score += 1;
    reasons.push("RSI supports positive momentum without being overbought");
  } else if (relativeStrength < 30) {
    score += 1;
    reasons.push("RSI indicates an oversold condition");
  } else if (relativeStrength >= 70) {
    score -= 1;
    reasons.push("RSI indicates an overbought condition");
  }

  const signal = score >= 2 ? "BUY" : score <= -2 ? "SELL" : "HOLD";
  const confidence = Math.min(0.95, Math.max(0.1, Math.abs(score) / 3));

  return {
    signal,
    confidence,
    reason: reasons.join("; "),
    indicators,
  };
}
