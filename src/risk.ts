export interface RiskConfig {
  riskPerTrade: number;
  maxPositionPct: number;
  feeRate: number;
}

export const defaultRiskConfig: RiskConfig = {
  riskPerTrade: 0.01,
  maxPositionPct: 0.25,
  feeRate: 0.001,
};

export function positionSize(
  equity: number,
  price: number,
  config: RiskConfig = defaultRiskConfig,
): number {
  if (equity <= 0 || price <= 0) return 0;

  const capitalAtRisk = equity * config.riskPerTrade;
  const maxNotional = equity * config.maxPositionPct;
  const notional = Math.min(capitalAtRisk, maxNotional);

  return notional / price;
}
