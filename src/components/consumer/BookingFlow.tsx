"use client";

/**
 * Booking flow — date/time/guests → Stripe PaymentIntent → confirmation
 */

import { useState } from "react";
import type { Business } from "@/src/types";
import type { BookingType } from "@/src/types";
import { Button } from "@/src/components/ui";
import { PaymentForm } from "./PaymentForm";

const INDUSTRY_TO_BOOKING_TYPE: Partial<Record<string, BookingType>> = {
  dining: "table",
  tours: "tour",
  realestate: "property_viewing",
  yacht: "tour",
  cars: "property_viewing",
  freelancer: "service",
  retail: "product",
  beauty: "service",
};

const DEFAULT_DEPOSIT = 25;

interface BookingFlowProps {
  business: Business;
}

export function BookingFlow({ business }: BookingFlowProps) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [guests, setGuests] = useState(2);
  const [notes, setNotes] = useState("");
  const [step, setStep] = useState<"form" | "payment" | "confirm">("form");
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const bookingType = INDUSTRY_TO_BOOKING_TYPE[business.industry] ?? "table";
  const amount = DEFAULT_DEPOSIT;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          business_id: business.id,
          booking_type: bookingType,
          date: date || null,
          time: time || null,
          guests: guests || null,
          notes: notes || null,
          amount,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to create booking");
      setClientSecret(data.clientSecret);
      setBookingId(data.bookingId);
      setStep("payment");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function handleConfirmed() {
    setStep("confirm");
  }

  if (step === "confirm") {
    return (
      <div className="rounded-xl border border-trust bg-trust/10 p-4 text-center">
        <p className="text-lg font-bold text-trust">Booking confirmed!</p>
        <p className="text-xs text-ink-muted mt-1">
          Your deposit has been held. The business will confirm shortly.
        </p>
      </div>
    );
  }

  if (step === "payment" && clientSecret) {
    return (
      <PaymentForm
        clientSecret={clientSecret}
        amount={amount}
        businessName={business.name}
        onConfirmed={handleConfirmed}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <h2 className="text-base font-extrabold text-ink">Book now</h2>
      <div className="space-y-2">
        <label className="block text-xs font-semibold text-ink">
          Date
        </label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full rounded-xl border border-line bg-surface-card px-4 py-3 text-sm text-ink"
        />
      </div>
      <div className="space-y-2">
        <label className="block text-xs font-semibold text-ink">
          Time
        </label>
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="w-full rounded-xl border border-line bg-surface-card px-4 py-3 text-sm text-ink"
        />
      </div>
      <div className="space-y-2">
        <label className="block text-xs font-semibold text-ink">
          Guests
        </label>
        <input
          type="number"
          min={1}
          max={20}
          value={guests}
          onChange={(e) => setGuests(parseInt(e.target.value, 10) || 1)}
          className="w-full rounded-xl border border-line bg-surface-card px-4 py-3 text-sm text-ink"
        />
      </div>
      <div className="space-y-2">
        <label className="block text-xs font-semibold text-ink">
          Notes (optional)
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Dietary requirements, special requests..."
          rows={2}
          className="w-full rounded-xl border border-line bg-surface-card px-4 py-3 text-sm text-ink placeholder:text-ink-muted"
        />
      </div>
      <p className="text-xs text-ink-muted">
        Deposit: €{amount.toFixed(2)} (held until confirmed)
      </p>
      {error && (
        <p className="text-xs text-live">{error}</p>
      )}
      <Button
        type="submit"
        variant="primary"
        fullWidth
        disabled={loading}
      >
        {loading ? "Creating..." : "Continue to payment"}
      </Button>
    </form>
  );
}

