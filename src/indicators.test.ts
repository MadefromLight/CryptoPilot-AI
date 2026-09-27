import { describe, expect, it } from "vitest";
import { ema, rsi, sma } from "./indicators.js";

describe("indicators", () => {
  it("calculates SMA", () => {
    expect(sma([1, 2, 3, 4, 5], 3)).toBe(4);
  });

  it("returns null when there is insufficient data", () => {
    expect(sma([1, 2], 3)).toBeNull();
    expect(ema([1, 2], 3)).toBeNull();
  });

  it("calculates EMA", () => {
    expect(ema([1, 2, 3, 4, 5], 3)).toBeCloseTo(4.0625);
  });

  it("calculates RSI within bounds", () => {
    const value = rsi([1, 2, 3, 2, 4, 5, 4, 6], 3);
    expect(value).not.toBeNull();
    expect(value!).toBeGreaterThanOrEqual(0);
    expect(value!).toBeLessThanOrEqual(100);
  });
});
