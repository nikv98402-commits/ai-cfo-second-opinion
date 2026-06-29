import type { RedFlag, RiskLevel, RiskSeverity } from "@/lib/finance/types";

const pointsBySeverity: Record<RiskSeverity, number> = {
  low: 5,
  medium: 10,
  high: 20,
  critical: 35
};

export function calculateRiskScore(redFlags: RedFlag[]) {
  return Math.min(
    100,
    redFlags.reduce((score, flag) => score + pointsBySeverity[flag.severity], 0)
  );
}

export function riskLevelFromScore(score: number): RiskLevel {
  if (score <= 25) return "low";
  if (score <= 50) return "medium";
  if (score <= 75) return "high";
  return "critical";
}
