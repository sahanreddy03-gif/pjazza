"use client";

/**
 * Display-only currency converter — static rates (V1).
 * Shows EUR amount with approximate GBP/USD equivalent.
 * Rates updated manually; daily API update is V2.
 */

const RATES = {
  GBP: 0.86,
  USD: 1.08,
} as const;

type Currency = keyof typeof RATES;

export function CurrencyConverter({
  amountEur,
  showLabel = true,
  className = "",
}: {
  amountEur: number;
  showLabel?: boolean;
  className?: string;
}) {
  const gbp = amountEur * RATES.GBP;
  const usd = amountEur * RATES.USD;

  return (
    <span className={className} title="Approximate conversion (static rates)">
      {showLabel && <span style={{ color: "var(--pj-text-tertiary)", marginRight: 4 }}>€{amountEur.toFixed(2)}</span>}
      <span style={{ fontSize: 12, color: "var(--pj-text-tertiary)" }}>
        ≈ £{gbp.toFixed(2)} / ${usd.toFixed(2)}
      </span>
    </span>
  );
}
