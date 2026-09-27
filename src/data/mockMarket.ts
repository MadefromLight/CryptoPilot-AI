import type { Candle } from "../types.js";

export function generateMockCandles(
  count = 250,
  startPrice = 60000,
  seed = 42,
): Candle[] {
  let price = startPrice;
  let state = seed >>> 0;
  const candles: Candle[] = [];

  const random = () => {
    state = (1664525 * state + 1013904223) >>> 0;
    return state / 4294967296;
  };

  for (let i = 0; i < count; i += 1) {
    const drift = Math.sin(i / 17) * 0.0012;
    const noise = (random() - 0.5) * 0.018;
    const open = price;
    const close = Math.max(100, open * (1 + drift + noise));
    const high = Math.max(open, close) * (1 + random() * 0.006);
    const low = Math.min(open, close) * (1 - random() * 0.006);
    const volume = 100 + random() * 900;

    candles.push({
      timestamp: Date.now() - (count - i) * 60_000,
      open,
      high,
      low,
      close,
      volume,
    });

    price = close;
  }

  return candles;
}
