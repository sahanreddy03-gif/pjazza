/**
 * PJAZZA — Commission, delivery, and subscription config
 * @see docs/REFERENCE.md sections 2, 6.2, 6.3
 */

import type { CommissionConfig, IndustryType } from "@/src/types";

export const COMMISSION_RATES: Record<IndustryType, CommissionConfig> = {
  dining: { rate: 0.08, minTransaction: 20, cap: null },
  realestate: {
    rate: 0.005,
    minTransaction: 0,
    cap: null,
    tourFee: { min: 25, max: 50 },
  },
  yacht: { rate: 0.03, minTransaction: 0, cap: null },
  cars: { rate: 0.01, minTransaction: 0, cap: 200 },
  freelancer: { rate: 0.1, minTransaction: 0, cap: null },
  retail: { rate: 0.08, minTransaction: 0, cap: null },
  beauty: { rate: 0.08, minTransaction: 0, cap: null },
  tours: { rate: 0.08, minTransaction: 0, cap: null },
} as const;

export const DELIVERY = {
  sameTown: 3.99,
  islandWide: 5.99,
  freeThreshold: 50,
  pjazzaMargin: 0.3,
} as const;

export const SUBSCRIPTIONS = {
  free: {
    price: 0,
    livePerMonth: 3,
    smartClips: 0,
    analytics: false,
    atmosphereCam: false,
  },
  starter: {
    price: 49,
    livePerMonth: null,
    smartClips: 5,
    analytics: true,
    atmosphereCam: false,
  },
  pro: {
    price: 149,
    livePerMonth: null,
    smartClips: null,
    analytics: true,
    atmosphereCam: true,
  },
  enterprise: {
    price: 299,
    livePerMonth: null,
    smartClips: null,
    analytics: true,
    atmosphereCam: true,
  },
} as const;

export function calculateCommission(
  amount: number,
  industry: IndustryType
): { commission: number; netBusiness: number; pjazzaCut: number } {
  const config = COMMISSION_RATES[industry];

  if (amount < config.minTransaction) {
    return { commission: 0, netBusiness: amount, pjazzaCut: 0 };
  }

  let commission = amount * config.rate;

  if (config.cap !== null && commission > config.cap) {
    commission = config.cap;
  }

  return {
    commission,
    netBusiness: amount - commission,
    pjazzaCut: commission,
  };
}

export type DeliveryMethod = "hotel" | "home" | "pickup";

export function calculateDelivery(
  orderTotal: number,
  method: DeliveryMethod
): { fee: number; pjazzaMargin: number } {
  if (method === "pickup") return { fee: 0, pjazzaMargin: 0 };
  if (orderTotal >= DELIVERY.freeThreshold)
    return { fee: 0, pjazzaMargin: 0 };

  const fee = DELIVERY.islandWide;
  return {
    fee,
    pjazzaMargin: fee * DELIVERY.pjazzaMargin,
  };
}
