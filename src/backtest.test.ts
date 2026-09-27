import { describe, expect, it } from "vitest";
import { generateMockCandles } from "./data/mockMarket.js";
import { runBacktest } from "./backtest.js";

describe("backtest", () => {
  it("runs against deterministic candle data", () => {
    const result = runBacktest("BTCUSDT", generateMockCandles(100), 10_000);

    expect(result.symbol).toBe("BTCUSDT");
    expect(result.decisions).toBe(66);
    expect(Number.isFinite(result.finalEquity)).toBe(true);
    expect(result.maxDrawdownPct).toBeGreaterThanOrEqual(0);
  });
});
