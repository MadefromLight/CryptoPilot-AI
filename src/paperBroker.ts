import type { Portfolio, Side } from "./types.js";

export class PaperBroker {
  private portfolio: Portfolio;

  constructor(initialCash = 10_000) {
    if (initialCash <= 0) throw new Error("initialCash must be greater than zero");
    this.portfolio = { cash: initialCash, assetQuantity: 0, averageEntry: 0, realizedPnl: 0 };
  }

  getPortfolio(): Portfolio {
    return { ...this.portfolio };
  }

  reset(initialCash = 10_000): void {
    this.portfolio = { cash: initialCash, assetQuantity: 0, averageEntry: 0, realizedPnl: 0 };
  }

  execute(side: Side, price: number, quantity: number, feeRate = 0.001): Portfolio {
    if (price <= 0 || quantity <= 0) throw new Error("price and quantity must be greater than zero");

    const notional = price * quantity;
    const fee = notional * feeRate;

    if (side === "BUY") {
      if (this.portfolio.cash < notional + fee) throw new Error("Insufficient paper cash");

      const totalCost = this.portfolio.averageEntry * this.portfolio.assetQuantity + notional + fee;
      this.portfolio.assetQuantity += quantity;
      this.portfolio.averageEntry = totalCost / this.portfolio.assetQuantity;
      this.portfolio.cash -= notional + fee;
    } else {
      if (this.portfolio.assetQuantity < quantity) throw new Error("Insufficient paper asset");

      const pnl = (price - this.portfolio.averageEntry) * quantity - fee;
      this.portfolio.assetQuantity -= quantity;
      this.portfolio.cash += notional - fee;
      this.portfolio.realizedPnl += pnl;

      if (this.portfolio.assetQuantity === 0) this.portfolio.averageEntry = 0;
    }

    return this.getPortfolio();
  }
}
