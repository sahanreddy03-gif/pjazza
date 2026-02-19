/**
 * Stripe server-side client
 * Only use in Route Handlers or Server Actions
 */

import Stripe from "stripe";

export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY ?? "sk_test_placeholder";
  return new Stripe(key, { typescript: true });
}
