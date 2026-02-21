'use client';

import { useRouter } from 'next/navigation';
import {
  Eye, DollarSign, Star, Video, TrendingUp,
  Ship, MessageSquare, ArrowRight, Clock,
  ChevronRight, Users, CheckCircle, Calendar,
  Radio
} from 'lucide-react';
import TopBar from '@/components/TopBar';
import BottomNav from '@/components/BottomNav';
import ScrollReveal from '@/components/ScrollReveal';

function QuickStats() {
  const stats = [
    { value: '€2,340', label: 'This month', Icon: DollarSign, color: 'var(--pj-green)' },
    { value: '1,847', label: 'Total views', Icon: Eye, color: 'var(--pj-text-secondary)' },
    { value: '4.8', label: 'Rating', Icon: Star, color: 'var(--pj-gold)' },
    { value: '23', label: 'Streams', Icon: Video, color: 'var(--pj-red)' },
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

function CruiseShipAlert() {
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
                MSC Grandiosa arriving
              </span>
            </div>
            <p style={{ fontSize: 'var(--pj-size-xs)', color: 'var(--pj-text-tertiary)', marginBottom: 8 }}>
              Tomorrow 8:00 AM · 4,842 passengers · Grand Harbour
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <TrendingUp size={12} style={{ color: 'var(--pj-green)' }} />
              <span style={{ fontSize: 'var(--pj-size-micro)', color: 'var(--pj-green)', fontWeight: 600 }}>
                Best time to go live: 9:30 - 11:00 AM
              </span>
            </div>
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

function RecentRequests() {
  const requests = [
    { name: 'Sarah M.', message: 'Can I see the back garden?', time: '2m ago', type: 'Property Tour' },
    { name: 'Marco D.', message: 'Is the veal scallopini available tonight?', time: '8m ago', type: 'Booking' },
    { name: 'James K.', message: 'Schedule a live walkaround?', time: '1h ago', type: 'Car Viewing' },
  ];

  return (
    <ScrollReveal>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <MessageSquare size={14} style={{ color: 'var(--pj-text-tertiary)' }} />
            <span style={{ fontSize: 'var(--pj-size-h3)', fontWeight: 700, color: 'var(--pj-text)' }}>
              Recent requests
            </span>
          </div>
          <button className="pj-btn-ghost" style={{ gap: 4 }} data-testid="button-all-requests">
            All <ChevronRight size={14} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {requests.map((r, i) => (
            <div
              key={i}
              className="pj-card pj-touch"
              style={{ padding: 14, display: 'flex', alignItems: 'center', gap: 12 }}
              data-testid={`card-request-${i}`}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: 'var(--pj-surface-3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  fontSize: 'var(--pj-size-small)',
                  fontWeight: 700,
                  color: 'var(--pj-text-secondary)',
                }}
              >
                {r.name.charAt(0)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
                  <span style={{ fontSize: 'var(--pj-size-small)', fontWeight: 700, color: 'var(--pj-text)' }}>
                    {r.name}
                  </span>
                  <span style={{ fontSize: 'var(--pj-size-micro)', color: 'var(--pj-text-tertiary)' }}>
                    {r.time}
                  </span>
                </div>
                <p
                  style={{
                    fontSize: 'var(--pj-size-xs)',
                    color: 'var(--pj-text-secondary)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {r.message}
                </p>
              </div>
            </div>
          ))}
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
  return (
    <div className="pj-safe-bottom" style={{ minHeight: '100vh', background: 'var(--pj-black)' }}>
      <TopBar />

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
            Noni's Kitchen · Sliema
          </p>
        </ScrollReveal>
      </div>

      <div className="pj-section" style={{ paddingTop: 20, paddingBottom: 20 }}>
        <QuickStats />

        <div style={{ marginTop: 20 }}>
          <GoLiveButton />
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
            <RecentRequests />
            <UpcomingStreams />
          </div>
        </div>
      </div>

      <div style={{ height: 32 }} />
      <BottomNav />
    </div>
  );
}
