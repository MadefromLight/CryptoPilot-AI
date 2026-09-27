import express from "express";
import cors from "cors";
import helmet from "helmet";
import { z } from "zod";
import { generateMockCandles } from "./data/mockMarket.js";
import { runBacktest } from "./backtest.js";
import { analyzeMarket } from "./strategy.js";
import { PaperBroker } from "./paperBroker.js";

export function createApp() {
  const app = express();
  const broker = new PaperBroker();

  app.use(helmet());
  app.use(cors());
  app.use(express.json());

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", service: "cryptopilot-ai" });
  });

  app.get("/api/market/:symbol/sample", (req, res) => {
    const symbol = req.params.symbol.toUpperCase();
    const candles = generateMockCandles(250);
    res.json({
      symbol,
      candles,
      analysis: analyzeMarket(candles),
    });
  });

  app.post("/api/backtests/run", (req, res) => {
    const schema = z.object({
      symbol: z.string().min(3).max(20).default("BTCUSDT"),
      initialCapital: z.number().positive().default(10_000),
      riskPerTrade: z.number().positive().max(0.05).default(0.01),
    });

    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid request", details: parsed.error.flatten() });
      return;
    }

    const candles = generateMockCandles(500);
    const result = runBacktest(parsed.data.symbol, candles, parsed.data.initialCapital, {
      riskPerTrade: parsed.data.riskPerTrade,
      maxPositionPct: 0.25,
      feeRate: 0.001,
    });

    res.json(result);
  });

  app.get("/api/paper/portfolio", (_req, res) => {
    res.json(broker.getPortfolio());
  });

  app.post("/api/paper/reset", (req, res) => {
    const initialCash = z.number().positive().default(10_000).parse(req.body?.initialCash);
    broker.reset(initialCash);
    res.json(broker.getPortfolio());
  });

  app.use((_req, res) => {
    res.status(404).json({ error: "Route not found" });
  });

  return app;
}
