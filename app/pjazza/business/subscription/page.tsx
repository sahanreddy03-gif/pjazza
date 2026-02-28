'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle, Loader2 } from 'lucide-react';
import { createClient } from '@/src/lib/supabase/client';
import { SUBSCRIPTIONS } from '@/src/config/commissions';

type PlanId = keyof typeof SUBSCRIPTIONS;

export default function SubscriptionPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ id: string } | null>(null);
  const [businesses, setBusinesses] = useState<{ id: string; name: string; subscription?: string | null }[]>([]);
  const [selectedBiz, setSelectedBiz] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user: u } }) => {
      if (!u) {
        router.push('/pjazza/agent?redirect=/pjazza/business/subscription');
        setLoading(false);
        return;
      }
      setUser({ id: u.id });
      fetch('/api/businesses?mine=1')
        .then((r) => r.json())
        .then((data: { id: string; name: string; subscription?: string | null }[]) => {
          setBusinesses(data);
          const first = data[0];
          if (first) setSelectedBiz(first.id);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    });
  }, [router]);

  const handleSelectPlan = async (plan: PlanId) => {
    if (!selectedBiz) return;
    if (plan === 'free') {
      setSaving(plan);
      try {
        const res = await fetch(`/api/businesses/${selectedBiz}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ subscription: plan }),
        });
        if (res.ok) setBusinesses((prev) => prev.map((b) => (b.id === selectedBiz ? { ...b, subscription: plan } : b)));
      } finally { setSaving(null); }
      return;
    }
    if (plan === 'starter' || plan === 'pro') {
      setCheckoutLoading(plan);
      try {
        const res = await fetch('/api/stripe/subscription', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ business_id: selectedBiz, plan }),
        });
        const data = await res.json();
        if (data?.url) window.location.href = data.url;
      } finally { setCheckoutLoading(null); }
    }
  };

  const biz = businesses.find((b) => b.id === selectedBiz);
  const currentPlan = (biz?.subscription || 'free') as PlanId;

  if (loading) {
    return (
      <div className="pj-safe-bottom" style={{ minHeight: '100vh', background: 'var(--pj-black)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 size={24} className="animate-spin" style={{ color: 'var(--pj-text-tertiary)' }} />
      </div>
    );
  }

  return (
    <div className="pj-safe-bottom" style={{ minHeight: '100vh', background: 'var(--pj-black)' }}>
      <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--pj-border)' }}>
        <button
          onClick={() => router.push('/pjazza/business/dashboard')}
          className="pj-touch"
          style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', color: 'var(--pj-text-secondary)', fontSize: 14, cursor: 'pointer' }}
        >
          <ArrowLeft size={18} />
          Back
        </button>
      </div>

      <div style={{ padding: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--pj-text)', marginBottom: 8 }}>Subscription</h1>
        <p style={{ fontSize: 14, color: 'var(--pj-text-tertiary)', marginBottom: 24 }}>Choose your plan.</p>

        {businesses.length > 0 && (
          <select
            value={selectedBiz}
            onChange={(e) => setSelectedBiz(e.target.value)}
            style={{ width: '100%', padding: 12, borderRadius: 8, marginBottom: 24, background: 'var(--pj-surface-2)', border: '1px solid var(--pj-border)', color: 'var(--pj-text)' }}
          >
            {businesses.map((b) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {(Object.keys(SUBSCRIPTIONS) as PlanId[]).map((planId) => {
            const plan = SUBSCRIPTIONS[planId];
            const isCurrent = currentPlan === planId;
            return (
              <div
                key={planId}
                className="pj-card"
                style={{
                  padding: 20,
                  borderColor: isCurrent ? 'var(--pj-gold)' : 'var(--pj-border)',
                  opacity: saving ? 0.7 : 1,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--pj-text)', textTransform: 'capitalize' }}>{planId}</h3>
                    <span className="pj-mono" style={{ fontSize: 18, fontWeight: 800, color: 'var(--pj-text)' }}>€{plan.price}/mo</span>
                  </div>
                  {isCurrent && (
                    <CheckCircle size={20} style={{ color: 'var(--pj-green)' }} />
                  )}
                </div>
                <ul style={{ fontSize: 13, color: 'var(--pj-text-secondary)', marginBottom: 16, paddingLeft: 20, lineHeight: 1.6 }}>
                  <li>Go live: {plan.livePerMonth ?? 'Unlimited'}x/month</li>
                  {plan.smartClips !== null && <li>Smart Clips: {plan.smartClips}/mo</li>}
                  {plan.analytics && <li>Analytics</li>}
                  {plan.atmosphereCam && <li>Atmosphere Camera</li>}
                </ul>
                <button
                  onClick={() => handleSelectPlan(planId)}
                  disabled={isCurrent || (saving !== null && saving !== planId) || (checkoutLoading !== null && checkoutLoading !== planId)}
                  className={isCurrent ? 'pj-btn-ghost' : 'pj-btn-primary'}
                  style={{ width: '100%', padding: 12, fontSize: 14 }}
                >
                  {saving === planId || checkoutLoading === planId ? '...' : isCurrent ? 'Current plan' : planId === 'free' ? 'Downgrade' : 'Upgrade'}
                </button>
              </div>
            );
          })}
        </div>

        <p style={{ fontSize: 12, color: 'var(--pj-text-tertiary)', marginTop: 24 }}>
          Starter & Pro redirect to Stripe Checkout. Add STRIPE_PRICE_STARTER and STRIPE_PRICE_PRO in .env.local.
        </p>
      </div>
    </div>
  );
}
