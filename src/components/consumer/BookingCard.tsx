"use client";

/**
 * Booking card — shows BookingFlow when logged in, sign-in prompt when not
 */

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/src/lib/supabase/client";
import { BookingFlow } from "./BookingFlow";
import type { Business } from "@/src/types";

interface BookingCardProps {
  business: Business;
}

export function BookingCard({ business }: BookingCardProps) {
  const [user, setUser] = useState<{ id: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user: u } }) => {
      setUser(u ? { id: u.id } : null);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="rounded-xl border border-line bg-surface-card p-4 text-center">
        <p className="text-sm text-ink-muted">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="rounded-xl border border-line bg-surface-card p-4 text-center space-y-3">
        <h2 className="text-base font-extrabold text-ink">Book now</h2>
        <p className="text-sm text-ink-muted">
          Sign in to book and pay your deposit.
        </p>
        <Link
          href={`/pjazza/agent?redirect=${encodeURIComponent(`/biz/${business.slug}`)}`}
          className="block w-full py-3 rounded-xl font-extrabold text-sm bg-gradient-to-r from-pjazza-gold to-pjazza-honey text-white shadow-lg hover:opacity-90 transition-opacity text-center"
        >
          Sign in to book
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-line bg-surface-card p-4">
      <BookingFlow business={business} />
    </div>
  );
}
