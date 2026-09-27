import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "./app.js";

describe("API", () => {
  it("returns health", async () => {
    const response = await request(createApp()).get("/api/health");
    expect(response.status).toBe(200);
    expect(response.body.status).toBe("ok");
  });

  it("runs a backtest", async () => {
    const response = await request(createApp())
      .post("/api/backtests/run")
      .send({ symbol: "BTCUSDT", initialCapital: 10000 });

    expect(response.status).toBe(200);
    expect(response.body.symbol).toBe("BTCUSDT");
    expect(response.body.finalEquity).toBeTypeOf("number");
  });

  it("rejects invalid backtest input", async () => {
    const response = await request(createApp())
      .post("/api/backtests/run")
      .send({ initialCapital: -10 });

    expect(response.status).toBe(400);
  });
});
