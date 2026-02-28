'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { createClient } from '@/src/lib/supabase/client';

type Business = { id: string; name: string; description: string | null; locality: string | null; address_full: string | null; phone: string | null; website_url: string | null; price_tier?: string | null; dietary_tags?: string[]; wheelchair_accessible?: boolean };

export default function BusinessSettingsPage() {
  const router = useRouter();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [selectedId, setSelectedId] = useState('');
  const [form, setForm] = useState({ name: '', description: '', locality: '', address: '', phone: '', website_url: '', price_tier: '', dietary_tags: [] as string[], wheelchair_accessible: false });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.push('/pjazza/agent?redirect=/pjazza/business/settings');
        setLoading(false);
        return;
      }
      fetch('/api/businesses?mine=1')
        .then((r) => r.json())
        .then((data: Business[]) => {
          setBusinesses(data);
          const first = data[0];
          if (first) {
            setSelectedId(first.id);
            setForm({
              name: first.name ?? '',
              description: first.description ?? '',
              locality: first.locality ?? '',
              address: first.address_full ?? '',
              phone: first.phone ?? '',
              website_url: first.website_url ?? '',
              price_tier: first.price_tier ?? '',
              dietary_tags: Array.isArray(first.dietary_tags) ? first.dietary_tags : [],
              wheelchair_accessible: !!first.wheelchair_accessible,
            });
          }
          setLoading(false);
        })
        .catch(() => setLoading(false));
    });
  }, [router]);

  useEffect(() => {
    const b = businesses.find((x) => x.id === selectedId);
    if (b) {
      setForm({
        name: b.name ?? '',
        description: b.description ?? '',
        locality: b.locality ?? '',
        address: b.address_full ?? '',
        phone: b.phone ?? '',
        website_url: b.website_url ?? '',
        price_tier: b.price_tier ?? '',
        dietary_tags: Array.isArray(b.dietary_tags) ? b.dietary_tags : [],
        wheelchair_accessible: !!b.wheelchair_accessible,
      });
    }
  }, [selectedId, businesses]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedId) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/businesses/${selectedId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name || undefined,
          description: form.description || undefined,
          locality: form.locality || undefined,
          address_full: form.address || undefined,
          phone: form.phone || undefined,
          website_url: form.website_url || undefined,
          price_tier: form.price_tier || undefined,
          dietary_tags: form.dietary_tags.length ? form.dietary_tags : undefined,
          wheelchair_accessible: form.wheelchair_accessible,
        }),
      });
      if (res.ok) router.push('/pjazza/business/dashboard');
      else {
        const d = await res.json();
        alert(d.error || 'Failed to save');
      }
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: 12, borderRadius: 8, marginBottom: 12,
    background: 'var(--pj-surface-2)', border: '1px solid var(--pj-border)',
    color: 'var(--pj-text)', fontSize: 15, fontFamily: 'inherit',
  } as const;

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
        <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--pj-text)', marginBottom: 8 }}>Business settings</h1>
        <p style={{ fontSize: 14, color: 'var(--pj-text-tertiary)', marginBottom: 24 }}>Edit your business details.</p>

        {businesses.length === 0 ? (
          <p style={{ fontSize: 14, color: 'var(--pj-text-secondary)' }}>Claim a business first.</p>
        ) : (
          <form onSubmit={handleSave}>
            {businesses.length > 1 && (
              <select
                value={selectedId}
                onChange={(e) => setSelectedId(e.target.value)}
                style={{ ...inputStyle, marginBottom: 20 }}
              >
                {businesses.map((b) => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            )}
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--pj-text-secondary)', marginBottom: 6 }}>Name</label>
            <input type="text" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required style={inputStyle} />
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--pj-text-secondary)', marginBottom: 6 }}>Description</label>
            <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--pj-text-secondary)', marginBottom: 6 }}>Locality</label>
            <input type="text" value={form.locality} onChange={(e) => setForm((f) => ({ ...f, locality: e.target.value }))} style={inputStyle} />
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--pj-text-secondary)', marginBottom: 6 }}>Address</label>
            <input type="text" value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} style={inputStyle} />
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--pj-text-secondary)', marginBottom: 6 }}>Phone</label>
            <input type="tel" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} style={inputStyle} />
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--pj-text-secondary)', marginBottom: 6 }}>Website</label>
            <input type="url" value={form.website_url} onChange={(e) => setForm((f) => ({ ...f, website_url: e.target.value }))} placeholder="https://" style={inputStyle} />
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--pj-text-secondary)', marginBottom: 6 }}>Price tier</label>
            <select value={form.price_tier} onChange={(e) => setForm((f) => ({ ...f, price_tier: e.target.value }))} style={inputStyle}>
              <option value="">Not set</option>
              <option value="€">€ Budget</option>
              <option value="€€">€€ Mid-range</option>
              <option value="€€€">€€€ Luxury</option>
            </select>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--pj-text-secondary)', marginBottom: 6 }}>Dietary tags (for discovery)</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
              {['halal', 'vegan', 'vegetarian', 'gluten_free'].map((tag) => (
                <button key={tag} type="button" onClick={() => setForm((f) => ({ ...f, dietary_tags: f.dietary_tags.includes(tag) ? f.dietary_tags.filter((t) => t !== tag) : [...f.dietary_tags, tag] }))} style={{ padding: '8px 14px', borderRadius: 8, border: form.dietary_tags.includes(tag) ? '1px solid var(--pj-gold)' : '1px solid var(--pj-border)', background: form.dietary_tags.includes(tag) ? 'rgba(212,165,116,0.15)' : 'var(--pj-surface-2)', color: 'var(--pj-text)', fontSize: 13, cursor: 'pointer' }}>
                  {tag.replace('_', '-')}
                </button>
              ))}
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, fontWeight: 600, color: 'var(--pj-text-secondary)', marginBottom: 24 }}>
              <input type="checkbox" checked={form.wheelchair_accessible} onChange={(e) => setForm((f) => ({ ...f, wheelchair_accessible: e.target.checked }))} />
              Wheelchair accessible
            </label>
            <button type="submit" className="pj-btn-primary" style={{ width: '100%', padding: 16 }} disabled={saving}>
              {saving ? <Loader2 size={18} className="animate-spin" style={{ marginRight: 8 }} /> : <Save size={18} style={{ marginRight: 8 }} />}
              {saving ? 'Saving…' : 'Save'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
