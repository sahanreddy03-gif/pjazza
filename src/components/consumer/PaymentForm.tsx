"use client";

/**
 * Stripe Payment form — PaymentElement for card payment
 */

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? ""
);

interface PaymentFormProps {
  clientSecret: string;
  amount: number;
  businessName: string;
  onConfirmed: () => void;
}

export function PaymentForm({
  clientSecret,
  amount,
  businessName,
  onConfirmed,
}: PaymentFormProps) {
  const options = {
    clientSecret,
    appearance: {
      theme: "stripe" as const,
    },
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <PaymentFormInner
        amount={amount}
        businessName={businessName}
        onConfirmed={onConfirmed}
      />
    </Elements>
  );
}

function PaymentFormInner({
  amount,
  businessName,
  onConfirmed,
}: {
  amount: number;
  businessName: string;
  onConfirmed: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;
    setError(null);
    setLoading(true);
    try {
      const { error: err } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url:
            typeof window !== "undefined"
              ? `${window.location.origin}${window.location.pathname}?redirect_status=succeeded`
              : "",
          payment_method_data: {
            billing_details: {
              name: "Guest",
            },
          },
        },
      });
      if (err) throw err;
      onConfirmed();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <h2 className="text-base font-extrabold text-ink">Pay deposit</h2>
      <p className="text-xs text-ink-muted">
        €{amount.toFixed(2)} for {businessName}
      </p>
      <div className="rounded-xl border border-line bg-surface-card p-4">
        <PaymentElement />
      </div>
      {error && <p className="text-xs text-live">{error}</p>}
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full py-3 rounded-xl font-extrabold text-sm bg-gradient-to-r from-pjazza-gold to-pjazza-honey text-white shadow-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
      >
        {loading ? "Processing..." : "Pay €" + amount.toFixed(2)}
      </button>
    </form>
  );
}
