'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Eye, DollarSign, Star, Video, TrendingUp,
  Ship, MessageSquare, Clock,
  ChevronRight, Calendar,
  Radio, Upload, CreditCard, Loader2, CheckCircle, Package, Settings
} from 'lucide-react';
import PjAppShell from '@/components/PjAppShell';
import ScrollReveal from '@/components/ScrollReveal';
import { createClient } from '@/src/lib/supabase/client';

type BusinessRow = { id: string; name: string; locality?: string | null; stripe_account_id?: string | null; subscription?: string | null; streaming_streak?: number | null };

function QuickStats({ revenueMonth, pendingCount, streak, avgResponse }: { revenueMonth: number; pendingCount: number; streak?: number; avgResponse?: number | null }) {
  const stats = [
    { value: `€${revenueMonth.toFixed(0)}`, label: 'This month', Icon: DollarSign, color: 'var(--pj-green)' },
    { value: String(pendingCount), label: 'Pending bookings', Icon: MessageSquare, color: 'var(--pj-text-secondary)' },
    { value: streak !== undefined ? String(streak) : '—', label: 'Stream streak', Icon: Radio, color: 'var(--pj-gold)' },
    { value: avgResponse != null ? `${avgResponse}m` : '—', label: 'Avg response', Icon: Clock, color: 'var(--pj-text-tertiary)' },
  ];

  return (
    <ScrollReveal>
      <div className="pj-stats-grid">
        {stats.map((s, i) => (
          <div key={i} className="pj-metric">
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
              <s.Icon size={14} strokeWidth={2} style={{ color: s.color }} />
              <span style={{ fontSize: 'var(--pj-size-micro)', color: 'var(--pj-text-tertiary)' }}>
                {s.label}
              </span>
            </div>
            <span
              className="pj-mono"
              style={{ fontSize: 'var(--pj-size-h2)', fontWeight: 800, color: 'var(--pj-text)' }}
              data-testid={`text-metric-${s.label.toLowerCase().replace(/\s/g, '-')}`}
            >
              {s.value}
            </span>
          </div>
        ))}
      </div>
    </ScrollReveal>
  );
}

function ConnectStripeSection({ businesses }: { businesses: BusinessRow[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const stripeStatus = searchParams.get('stripe');
  const [connectingId, setConnectingId] = useState<string | null>(null);

  const needsConnect = businesses.filter((b) => !b.stripe_account_id);
  const hasComplete = stripeStatus === 'complete';

  const handleConnect = async (businessId: string) => {
    setConnectingId(businessId);
    try {
      const res = await fetch('/api/stripe/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ business_id: businessId }),
      });
      const data = await res.json();
      if (data?.url) {
        window.location.href = data.url;
      } else {
        setConnectingId(null);
      }
    } catch {
      setConnectingId(null);
    }
  };

  if (needsConnect.length === 0) return null;

  return (
    <ScrollReveal delay={80}>
      <div
        className="pj-card"
        style={{
          padding: 16,
          borderColor: 'var(--pj-green-border, var(--pj-border))',
          background: 'var(--pj-green-soft, var(--pj-surface-1))',
        }}
      >
        {hasComplete && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, color: 'var(--pj-green)' }}>
            <CheckCircle size={18} />
            <span style={{ fontSize: 'var(--pj-size-small)', fontWeight: 700 }}>Stripe connected</span>
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <CreditCard size={18} style={{ color: 'var(--pj-text-tertiary)' }} />
          <span style={{ fontSize: 'var(--pj-size-small)', fontWeight: 700, color: 'var(--pj-text)' }}>
            Set up payments
          </span>
        </div>
        <p style={{ fontSize: 'var(--pj-size-xs)', color: 'var(--pj-text-secondary)', marginBottom: 12, lineHeight: 1.5 }}>
          Connect Stripe to accept payments from customers. Required before going live.
        </p>
        {needsConnect.map((b) => (
          <button
            key={b.id}
            className="pj-btn-primary"
            style={{ width: '100%', padding: 14, fontSize: 14, marginBottom: 8 }}
            onClick={() => handleConnect(b.id)}
            disabled={connectingId === b.id}
          >
            {connectingId === b.id ? (
              <Loader2 size={18} className="animate-spin" style={{ marginRight: 8 }} />
            ) : (
              <CreditCard size={18} style={{ marginRight: 8 }} />
            )}
            Connect Stripe · {b.name}
          </button>
        ))}
      </div>
    </ScrollReveal>
  );
}

function GoLiveButton() {
  const router = useRouter();

  return (
    <ScrollReveal delay={60}>
      <div className="pj-cta-container">
        <button
          className="pj-btn-primary"
          style={{ width: '100%', padding: '18px 24px', fontSize: 16, gap: 10 }}
          onClick={() => router.push('/pjazza/business/stream')}
          data-testid="button-go-live"
        >
          <Radio size={18} strokeWidth={2.5} />
          <span>GO LIVE</span>
        </button>
      </div>
    </ScrollReveal>
  );
}

type CruiseArrival = { ship_name: string; port: string; arrival_at: string; passenger_count: number | null; best_live_start: string | null; best_live_end: string | null };

function CruiseShipAlert() {
  const [cruises, setCruises] = useState<CruiseArrival[]>([]);

  useEffect(() => {
    fetch('/api/cruise-arrivals')
      .then((r) => r.json())
      .then((d: CruiseArrival[]) => setCruises(d ?? []))
      .catch(() => setCruises([]));
  }, []);

  const cruise = cruises[0];
  if (!cruise) return null;

  const arr = new Date(cruise.arrival_at);
  const start = cruise.best_live_start ? new Date(cruise.best_live_start) : null;
  const end = cruise.best_live_end ? new Date(cruise.best_live_end) : null;
  const arrivalStr = arr.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }) + ' · ' + arr.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  const bestTimeStr = start && end ? `${start.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })} - ${end.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}` : null;

  return (
    <ScrollReveal delay={100}>
      <div
        className="pj-card"
        style={{
          padding: 16,
          borderColor: 'var(--pj-red-border)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 'var(--pj-radius-md)',
              background: 'var(--pj-red-soft)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Ship size={18} strokeWidth={2} style={{ color: 'var(--pj-red)' }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <span style={{ fontSize: 'var(--pj-size-small)', fontWeight: 700, color: 'var(--pj-text)' }}>
                {cruise.ship_name} arriving
              </span>
            </div>
            <p style={{ fontSize: 'var(--pj-size-xs)', color: 'var(--pj-text-tertiary)', marginBottom: 8 }}>
              {arrivalStr} · {cruise.passenger_count?.toLocaleString() ?? '—'} passengers · {cruise.port}
            </p>
            {bestTimeStr && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <TrendingUp size={12} style={{ color: 'var(--pj-green)' }} />
                <span style={{ fontSize: 'var(--pj-size-micro)', color: 'var(--pj-green)', fontWeight: 600 }}>
                  Best time to go live: {bestTimeStr}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
}

function RevenueChart() {
  const days = [
    { label: 'Mon', value: 120, max: 540 },
    { label: 'Tue', value: 540, max: 540 },
    { label: 'Wed', value: 280, max: 540 },
    { label: 'Thu', value: 350, max: 540 },
    { label: 'Fri', value: 420, max: 540 },
    { label: 'Sat', value: 480, max: 540 },
    { label: 'Sun', value: 190, max: 540 },
  ];

  return (
    <ScrollReveal>
      <div className="pj-card" style={{ padding: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <h3 style={{ fontSize: 'var(--pj-size-h3)', fontWeight: 700, color: 'var(--pj-text)' }}>
              Revenue this week
            </h3>
            <span className="pj-mono" style={{ fontSize: 'var(--pj-size-h2)', fontWeight: 800, color: 'var(--pj-text)' }}>
              €2,380
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <TrendingUp size={14} style={{ color: 'var(--pj-green)' }} />
            <span style={{ fontSize: 'var(--pj-size-xs)', fontWeight: 700, color: 'var(--pj-green)' }}>
              +18%
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 80 }}>
          {days.map((d, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <div
                style={{
                  width: '100%',
                  height: `${(d.value / d.max) * 60}px`,
                  background: d.label === 'Tue' ? 'var(--pj-red)' : 'var(--pj-surface-3)',
                  borderRadius: 4,
                  transition: 'height 0.3s ease',
                }}
              />
              <span style={{ fontSize: 9, color: 'var(--pj-text-tertiary)', fontWeight: 500 }}>
                {d.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </ScrollReveal>
  );
}

type Booking = { id: string; amount: number; status: string; booking_type: string; date: string | null; time: string | null; guests: number | null; seller_photo_url?: string | null; created_at: string };

function IncomingBookings({ bookings, businessId }: { bookings: Booking[]; businessId: string }) {
  const [capturing, setCapturing] = useState<string | null>(null);
  const [addingProof, setAddingProof] = useState<string | null>(null);
  const [proofUrl, setProofUrl] = useState("");

  const needsProof = (r: Booking) => ["product", "service"].includes(r.booking_type ?? "");
  const handleCapture = async (bookingId: string) => {
    setCapturing(bookingId);
    try {
      const res = await fetch(`/api/bookings/${bookingId}/capture`, { method: 'POST' });
      if (res.ok) window.location.reload();
    } finally {
      setCapturing(null);
    }
  };

  const handleAddProof = async (bookingId: string) => {
    if (!proofUrl.trim()) return;
    setAddingProof(bookingId);
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ seller_photo_url: proofUrl.trim() }),
      });
      if (res.ok) { setAddingProof(null); setProofUrl(""); window.location.reload(); }
    } finally {
      setAddingProof(null);
    }
  };

  return (
    <ScrollReveal>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <MessageSquare size={14} style={{ color: 'var(--pj-text-tertiary)' }} />
          <span style={{ fontSize: 'var(--pj-size-h3)', fontWeight: 700, color: 'var(--pj-text)' }}>
            Incoming bookings
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {bookings.length === 0 ? (
            <div className="pj-card" style={{ padding: 20, textAlign: 'center' }}>
              <p style={{ fontSize: 'var(--pj-size-small)', color: 'var(--pj-text-tertiary)' }}>No bookings yet</p>
            </div>
          ) : (
            bookings.slice(0, 5).map((r) => (
            <div
              key={r.id}
              className="pj-card"
              style={{ padding: 14, display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'space-between' }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
                  <span className="pj-mono" style={{ fontSize: 'var(--pj-size-small)', fontWeight: 700, color: 'var(--pj-text)' }}>
                    €{Number(r.amount).toFixed(2)}
                  </span>
                  <span style={{ fontSize: 'var(--pj-size-micro)', color: 'var(--pj-text-tertiary)' }}>
                    {r.date ?? r.created_at.slice(0, 10)}
                  </span>
                </div>
                <p style={{ fontSize: 'var(--pj-size-xs)', color: 'var(--pj-text-secondary)' }}>
                  {r.booking_type} · {r.status}
                  {r.guests ? ` · ${r.guests} guests` : ''}
                </p>
              </div>
              {r.status === 'pending' && (
                needsProof(r) ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {r.seller_photo_url ? (
                      <span style={{ fontSize: 11, color: 'var(--pj-text-tertiary)' }}>Waiting for consumer approval</span>
                    ) : addingProof === r.id ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <input
                          type="url"
                          placeholder="Photo proof URL"
                          value={proofUrl}
                          onChange={(e) => setProofUrl(e.target.value)}
                          style={{ width: '100%', padding: 8, fontSize: 12 }}
                        />
                        <button
                          className="pj-btn-primary"
                          style={{ padding: '6px 12px', fontSize: 12 }}
                          onClick={() => handleAddProof(r.id)}
                          disabled={!proofUrl.trim()}
                        >
                          Save proof
                        </button>
                      </div>
                    ) : (
                      <button
                        className="pj-btn-secondary"
                        style={{ padding: '8px 14px', fontSize: 13 }}
                        onClick={() => setAddingProof(r.id)}
                      >
                        Add proof
                      </button>
                    )}
                  </div>
                ) : (
                  <button
                    className="pj-btn-primary"
                    style={{ padding: '8px 14px', fontSize: 13 }}
                    onClick={() => handleCapture(r.id)}
                    disabled={capturing === r.id}
                  >
                    {capturing === r.id ? '...' : 'Capture'}
                  </button>
                )
              )}
            </div>
          )))}
        </div>
      </div>
    </ScrollReveal>
  );
}

function UpcomingStreams() {
  const streams = [
    { title: 'Evening Menu Special', time: 'Today, 7:00 PM', category: 'Restaurant' },
    { title: 'New Property Walk-through', time: 'Tomorrow, 10:00 AM', category: 'Real Estate' },
  ];

  return (
    <ScrollReveal>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <Calendar size={14} style={{ color: 'var(--pj-text-tertiary)' }} />
          <span style={{ fontSize: 'var(--pj-size-h3)', fontWeight: 700, color: 'var(--pj-text)' }}>
            Scheduled streams
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {streams.map((s, i) => (
            <div key={i} className="pj-card" style={{ padding: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h4 style={{ fontSize: 'var(--pj-size-small)', fontWeight: 700, color: 'var(--pj-text)', marginBottom: 2 }}>
                  {s.title}
                </h4>
                <p style={{ fontSize: 'var(--pj-size-micro)', color: 'var(--pj-text-tertiary)' }}>
                  {s.time} · {s.category}
                </p>
              </div>
              <Clock size={16} style={{ color: 'var(--pj-text-tertiary)', flexShrink: 0 }} />
            </div>
          ))}
        </div>
      </div>
    </ScrollReveal>
  );
}

export default function BusinessDashboard() {
  const router = useRouter();
  const [businesses, setBusinesses] = useState<BusinessRow[]>([]);
  const [businessName, setBusinessName] = useState<string>('');
  const [businessLocality, setBusinessLocality] = useState<string>('');
  const [loaded, setLoaded] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [revenueMonth, setRevenueMonth] = useState(0);
  const [streak, setStreak] = useState<number | undefined>();
  const [avgResponse, setAvgResponse] = useState<number | null | undefined>();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        setLoaded(true);
        return;
      }
      supabase
        .from('businesses')
        .select('id, name, locality, stripe_account_id, subscription, streaming_streak')
        .eq('owner_id', user.id)
        .then(({ data }) => {
          setBusinesses(data ?? []);
          const first = (data ?? [])[0];
          if (first) {
            setBusinessName(first.name);
            setBusinessLocality(first.locality ?? '');
            fetch(`/api/bookings?business_id=${first.id}`)
              .then((r) => r.json())
              .then((b: Booking[]) => {
                setBookings(b ?? []);
                const now = new Date();
                const monthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
                const thisMonth = (b ?? []).filter(
                  (x: Booking) => x.status === 'completed' && (x.created_at || '').startsWith(monthStr)
                );
                setRevenueMonth(thisMonth.reduce((s, x) => s + Number(x.amount), 0));
              })
              .catch(() => {});
            fetch(`/api/businesses/${first.id}/stats`)
              .then((r) => r.json())
              .then((d) => {
                setStreak(d.streaming_streak ?? 0);
                setAvgResponse(d.avg_response_minutes ?? null);
              })
              .catch(() => {});
          }
          setLoaded(true);
        });
    });
  }, []);

  return (
    <PjAppShell>
    <div className="pj-safe-bottom" style={{ minHeight: '100vh', background: 'var(--pj-black)' }}>

      <div className="pj-section" style={{ paddingTop: 20, paddingBottom: 0 }}>
        <ScrollReveal>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <h1 style={{ fontSize: 'var(--pj-size-h2)', fontWeight: 800, color: 'var(--pj-text)', letterSpacing: '-0.01em' }}>
              Dashboard
            </h1>
            <div
              style={{
                padding: '2px 8px',
                borderRadius: 'var(--pj-radius-pill)',
                background: 'var(--pj-gold-soft)',
                fontSize: 'var(--pj-size-micro)',
                fontWeight: 700,
                color: 'var(--pj-gold)',
              }}
            >
              Founding Partner
            </div>
          </div>
          <p style={{ fontSize: 'var(--pj-size-small)', color: 'var(--pj-text-tertiary)' }}>
            {businessName ? `${businessName}${businessLocality ? ` · ${businessLocality}` : ''}` : 'Claim a business to get started'}
          </p>
          {loaded && !businessName && businesses.length === 0 && (
            <a
              href="/pjazza/business/onboard"
              className="pj-btn-primary"
              style={{ display: 'inline-flex', marginTop: 12, padding: '10px 18px', fontSize: 14, textDecoration: 'none', color: 'white', alignItems: 'center', gap: 8 }}
            >
              Claim your business
              <ChevronRight size={16} />
            </a>
          )}
        </ScrollReveal>
      </div>

      <div className="pj-section" style={{ paddingTop: 20, paddingBottom: 20 }}>
        <QuickStats revenueMonth={revenueMonth} pendingCount={bookings.filter((b) => b.status === 'pending').length} streak={streak} avgResponse={avgResponse} />

        <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <ConnectStripeSection businesses={businesses} />
          <GoLiveButton />
          <button
            className="pj-btn-primary pj-touch"
            style={{ width: '100%', padding: '16px 24px', fontSize: 15, background: 'var(--pj-surface-2)', color: 'var(--pj-text)', border: '1px solid var(--pj-border)' }}
            onClick={() => router.push('/pjazza/business/stream?tab=upload')}
          >
            <Upload size={18} style={{ marginRight: 8 }} />
            Upload video
          </button>
          <p style={{ fontSize: 'var(--pj-size-xs)', color: 'var(--pj-text-tertiary)', textAlign: 'center', marginTop: -4 }}>
            From phone or laptop — same flow. Record or upload, publish in seconds.
          </p>
          <button
            className="pj-btn-secondary"
            style={{ width: '100%', padding: '16px 24px', fontSize: 15 }}
            onClick={() => router.push('/pjazza/business/live')}
          >
            <Video size={18} style={{ marginRight: 8 }} />
            Accept live video calls
          </button>
          <button
            className="pj-btn-ghost"
            style={{ width: '100%', padding: '16px 24px', fontSize: 15, justifyContent: 'flex-start', textAlign: 'left' }}
            onClick={() => router.push('/pjazza/business/products')}
          >
            <Package size={18} style={{ marginRight: 8, flexShrink: 0 }} />
            Manage products
          </button>
          <button
            className="pj-btn-ghost"
            style={{ width: '100%', padding: '16px 24px', fontSize: 15, justifyContent: 'flex-start', textAlign: 'left' }}
            onClick={() => router.push('/pjazza/business/subscription')}
          >
            <CreditCard size={18} style={{ marginRight: 8, flexShrink: 0 }} />
            Subscription
          </button>
          <button
            className="pj-btn-ghost"
            style={{ width: '100%', padding: '16px 24px', fontSize: 15, justifyContent: 'flex-start', textAlign: 'left' }}
            onClick={() => router.push('/pjazza/business/settings')}
          >
            <Settings size={18} style={{ marginRight: 8, flexShrink: 0 }} />
            Business settings
          </button>
          <a
            href="/pjazza/agent"
            className="pj-btn-ghost"
            style={{ width: '100%', padding: 12, justifyContent: 'center', textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: 8 }}
          >
            Sales team: Agent portal
            <ChevronRight size={16} />
          </a>
        </div>

        <div style={{ marginTop: 20 }}>
          <CruiseShipAlert />
        </div>
      </div>

      <div className="pj-section" style={{ paddingTop: 0, paddingBottom: 20 }}>
        <div className="pj-dash-grid" style={{ padding: 0 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <RevenueChart />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <IncomingBookings bookings={bookings} businessId={businesses[0]?.id ?? ''} />
            <UpcomingStreams />
          </div>
        </div>
      </div>

      <div style={{ height: 32 }} />
    </div>
    </PjAppShell>
  );
}
