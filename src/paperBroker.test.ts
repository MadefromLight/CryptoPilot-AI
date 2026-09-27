import { describe, expect, it } from "vitest";
import { PaperBroker } from "./paperBroker.js";

describe("PaperBroker", () => {
  it("executes paper buy and sell orders", () => {
    const broker = new PaperBroker(1000);
    broker.execute("BUY", 100, 2, 0);
    expect(broker.getPortfolio().assetQuantity).toBe(2);

    broker.execute("SELL", 120, 2, 0);
    const portfolio = broker.getPortfolio();

    expect(portfolio.cash).toBe(1040);
    expect(portfolio.realizedPnl).toBe(40);
  });

  it("rejects orders without enough paper assets", () => {
    const broker = new PaperBroker(1000);
    expect(() => broker.execute("SELL", 100, 1)).toThrow("Insufficient paper asset");
  });
});
