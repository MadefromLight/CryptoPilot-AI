import type { Candle } from "./types.js";

export function sma(values: number[], period: number): number | null {
  if (period <= 0 || values.length < period) return null;
  const slice = values.slice(-period);
  return slice.reduce((sum, value) => sum + value, 0) / period;
}

export function ema(values: number[], period: number): number | null {
  if (period <= 0 || values.length < period) return null;
  const multiplier = 2 / (period + 1);
  let average = values.slice(0, period).reduce((s, v) => s + v, 0) / period;

  for (const value of values.slice(period)) {
    average = (value - average) * multiplier + average;
  }

  return average;
}

export function rsi(values: number[], period = 14): number | null {
  if (period <= 0 || values.length <= period) return null;

  let gains = 0;
  let losses = 0;

  for (let i = 1; i <= period; i += 1) {
    const change = values[i]! - values[i - 1]!;
    if (change >= 0) gains += change;
    else losses += Math.abs(change);
  }

  let averageGain = gains / period;
  let averageLoss = losses / period;

  for (let i = period + 1; i < values.length; i += 1) {
    const change = values[i]! - values[i - 1]!;
    const gain = Math.max(change, 0);
    const loss = Math.max(-change, 0);
    averageGain = (averageGain * (period - 1) + gain) / period;
    averageLoss = (averageLoss * (period - 1) + loss) / period;
  }

  if (averageLoss === 0) return 100;
  const relativeStrength = averageGain / averageLoss;
  return 100 - 100 / (1 + relativeStrength);
}

export function calculateIndicators(candles: Candle[]): {
  smaFast: number | null;
  smaSlow: number | null;
  emaFast: number | null;
  emaSlow: number | null;
  rsi: number | null;
} {
  const closes = candles.map((c) => c.close);

  return {
    smaFast: sma(closes, 10),
    smaSlow: sma(closes, 30),
    emaFast: ema(closes, 12),
    emaSlow: ema(closes, 26),
    rsi: rsi(closes, 14),
  };
}
