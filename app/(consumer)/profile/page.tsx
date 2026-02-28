"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/src/lib/supabase/client";
import { Calendar, LogIn, ChevronRight, Loader2, Check, Star, Leaf, Bell, Accessibility } from "lucide-react";
import { usePushNotifications } from "@/src/hooks/usePushNotifications";

const DIETARY_OPTIONS = [
  { id: "halal", label: "Halal" },
  { id: "vegan", label: "Vegan" },
  { id: "gluten_free", label: "Gluten-Free" },
] as const;

const ACCESSIBILITY_OPTIONS = [{ id: "wheelchair", label: "Wheelchair accessible" }] as const;

function BookingRow({
  booking: b,
  approving,
  setApproving,
  reviewing,
  setReviewing,
}: {
  booking: Booking;
  approving: string | null;
  setApproving: (id: string | null) => void;
  reviewing: string | null;
  setReviewing: (id: string | null) => void;
}) {
  const needsProof = ["product", "service"].includes(b.booking_type);
  const canApprove = b.status === "pending" && needsProof && b.seller_photo_url;
  const canReview = b.status === "completed";

  const handleApprove = async () => {
    setApproving(b.id);
    try {
      const res = await fetch(`/api/bookings/${b.id}/approve`, { method: "POST" });
      if (res.ok) window.location.reload();
    } finally {
      setApproving(null);
    }
  };

  return (
    <div className="rounded-xl border border-line bg-surface-card px-4 py-3 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div>
          <span className="pj-mono text-sm font-semibold text-ink">€{Number(b.amount).toFixed(2)}</span>
          <span className="text-xs text-ink-muted ml-2">{b.booking_type}</span>
        </div>
        <span className="text-xs font-medium text-ink-secondary">{b.status}</span>
      </div>
      {b.seller_photo_url && b.status === "pending" && (
        <a href={b.seller_photo_url} target="_blank" rel="noreferrer" className="text-xs text-live hover:underline">
          View proof
        </a>
      )}
      <div className="flex gap-2">
        {canApprove && (
          <button
            onClick={handleApprove}
            disabled={approving === b.id}
            className="flex items-center gap-1.5 rounded-lg bg-trust px-3 py-2 text-xs font-semibold text-white"
          >
            {approving === b.id ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
            Approve & release
          </button>
        )}
        {canReview && (
          <button
            onClick={() => setReviewing(b.id)}
            className="flex items-center gap-1.5 rounded-lg border border-line px-3 py-2 text-xs font-semibold text-ink"
          >
            <Star size={12} />
            Leave review
          </button>
        )}
      </div>
      {reviewing === b.id && (
        <ReviewForm bookingId={b.id} onDone={() => { setReviewing(null); window.location.reload(); }} />
      )}
    </div>
  );
}

function ReviewForm({ bookingId, onDone }: { bookingId: string; onDone: () => void }) {
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ booking_id: bookingId, rating, text }),
      });
      if (res.ok) onDone();
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 pt-2 border-t border-line">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((r) => (
          <button key={r} type="button" onClick={() => setRating(r)} className="p-0.5">
            <Star size={18} className={r <= rating ? "fill-warn text-warn" : "text-ink-muted"} />
          </button>
        ))}
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="How was it?"
        rows={2}
        className="rounded-lg border border-line p-2 text-xs"
      />
      <button type="submit" disabled={loading} className="rounded-lg bg-trust py-2 text-xs font-semibold text-white">
        {loading ? "..." : "Submit review"}
      </button>
    </form>
  );
}

type Booking = {
  id: string;
  business_id: string;
  amount: number;
  status: string;
  booking_type: string;
  date: string | null;
  time: string | null;
  seller_photo_url: string | null;
  created_at: string;
};

export default function ProfilePage() {
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [dietaryFilters, setDietaryFilters] = useState<string[]>([]);
  const [accessibilityFilters, setAccessibilityFilters] = useState<string[]>([]);
  const [savingDietary, setSavingDietary] = useState(false);
  const [savingAccessibility, setSavingAccessibility] = useState(false);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState<string | null>(null);
  const [reviewing, setReviewing] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user: u } }) => {
      setUser(u ? { id: u.id, email: u.email ?? undefined } : null);
      if (u) {
        supabase.from("profiles").select("dietary_filters, accessibility_filters").eq("id", u.id).maybeSingle().then(({ data }) => {
          setDietaryFilters(Array.isArray(data?.dietary_filters) ? data.dietary_filters : []);
          setAccessibilityFilters(Array.isArray(data?.accessibility_filters) ? data.accessibility_filters : []);
        });
        fetch("/api/bookings?consumer=1")
          .then((r) => r.json())
          .then((b: Booking[]) => setBookings(b ?? []))
          .catch(() => setBookings([]));
      }
      setLoading(false);
    });
  }, []);

  const push = usePushNotifications();
  const [pushEnabled, setPushEnabled] = useState(false);
  const [pushLoading, setPushLoading] = useState(false);

  const togglePush = async () => {
    if (!push.isSupported || !push.isReady) return;
    setPushLoading(true);
    try {
      if (pushEnabled) {
        await push.unsubscribe();
        setPushEnabled(false);
      } else {
        const ok = await push.subscribe();
        setPushEnabled(ok);
      }
    } finally {
      setPushLoading(false);
    }
  };

  const toggleAccessibility = async (id: string) => {
    const next = accessibilityFilters.includes(id)
      ? accessibilityFilters.filter((x) => x !== id)
      : [...accessibilityFilters, id];
    setAccessibilityFilters(next);
    setSavingAccessibility(true);
    try {
      const supabase = createClient();
      await supabase.from("profiles").update({ accessibility_filters: next }).eq("id", user!.id);
    } finally {
      setSavingAccessibility(false);
    }
  };

  const toggleDietary = async (id: string) => {
    const next = dietaryFilters.includes(id) ? dietaryFilters.filter((x) => x !== id) : [...dietaryFilters, id];
    setDietaryFilters(next);
    setSavingDietary(true);
    try {
      const supabase = createClient();
      await supabase.from("profiles").update({ dietary_filters: next }).eq("id", user!.id);
    } finally {
      setSavingDietary(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-ink-muted" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="space-y-5">
        <h1 className="text-base font-extrabold text-ink">Profile</h1>
        <p className="text-sm text-ink-muted">Sign in to see your bookings and preferences.</p>
        <Link
          href={`/pjazza/agent?redirect=${encodeURIComponent("/profile")}`}
          className="flex items-center gap-3 rounded-xl border border-line bg-surface-card px-4 py-3 text-sm font-semibold text-ink hover:bg-surface-alt transition-colors"
        >
          <LogIn size={18} />
          Sign in
          <ChevronRight size={16} className="ml-auto" />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-base font-extrabold text-ink">Profile</h1>
      <p className="text-xs text-ink-muted">{user.email}</p>

      {push.isSupported && (
        <div>
          <h2 className="text-sm font-semibold text-ink mb-3 flex items-center gap-2">
            <Bell size={16} />
            Push notifications
          </h2>
          <p className="text-xs text-ink-muted mb-2">
            {push.isReady ? "Get notified about bookings and updates." : "Add VAPID keys in .env.local to enable."}
          </p>
          {push.isReady && (
            <button
              type="button"
              onClick={togglePush}
              disabled={pushLoading}
              className={`rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                pushEnabled ? "border-trust bg-trust/10 text-trust" : "border-line bg-surface-card text-ink"
              }`}
            >
              {pushLoading ? "..." : pushEnabled ? "Enabled" : "Enable push"}
            </button>
          )}
        </div>
      )}

      <div>
        <h2 className="text-sm font-semibold text-ink mb-3 flex items-center gap-2">
          <Leaf size={16} />
          Dietary preferences
        </h2>
        <p className="text-xs text-ink-muted mb-2">Used to filter dining and food options.</p>
        <div className="flex flex-wrap gap-2">
          {DIETARY_OPTIONS.map((o) => (
            <button
              key={o.id}
              type="button"
              onClick={() => toggleDietary(o.id)}
              disabled={savingDietary}
              className={`rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                dietaryFilters.includes(o.id) ? "border-trust bg-trust/10 text-trust" : "border-line bg-surface-card text-ink"
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-sm font-semibold text-ink mb-3 flex items-center gap-2">
          <Accessibility size={16} />
          Accessibility
        </h2>
        <p className="text-xs text-ink-muted mb-2">Filter for wheelchair-accessible venues.</p>
        <div className="flex flex-wrap gap-2">
          {ACCESSIBILITY_OPTIONS.map((o) => (
            <button
              key={o.id}
              type="button"
              onClick={() => toggleAccessibility(o.id)}
              disabled={savingAccessibility}
              className={`rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                accessibilityFilters.includes(o.id) ? "border-trust bg-trust/10 text-trust" : "border-line bg-surface-card text-ink"
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-sm font-semibold text-ink mb-3 flex items-center gap-2">
          <Calendar size={16} />
          My Bookings
        </h2>
        {bookings.length === 0 ? (
          <p className="text-sm text-ink-muted">No bookings yet. Browse and book from a business page.</p>
        ) : (
          <div className="space-y-2">
            {bookings.slice(0, 10).map((b) => (
              <BookingRow
                key={b.id}
                booking={b}
                approving={approving}
                setApproving={setApproving}
                reviewing={reviewing}
                setReviewing={setReviewing}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
