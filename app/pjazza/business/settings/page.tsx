'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { createClient } from '@/src/lib/supabase/client';

type Business = { id: string; name: string; description: string | null; locality: string | null; address_full: string | null; phone: string | null; email: string | null; website_url: string | null; cover_image_url?: string | null; price_tier?: string | null; dietary_tags?: string[]; wheelchair_accessible?: boolean };
type BusinessLink = { id: string; link_type: string; url: string; label?: string | null };

export default function BusinessSettingsPage() {
  const router = useRouter();
  const [isNew, setIsNew] = useState(false);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [selectedId, setSelectedId] = useState('');
  const [form, setForm] = useState({ name: '', description: '', locality: '', address: '', phone: '', email: '', website_url: '', cover_image_url: '', price_tier: '', dietary_tags: [] as string[], wheelchair_accessible: false });
  const [links, setLinks] = useState<BusinessLink[]>([]);
  const [newLinkType, setNewLinkType] = useState('instagram');
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setIsNew(typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('new') === '1');
  }, []);

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
              email: (first as Business).email ?? '',
              website_url: first.website_url ?? '',
              cover_image_url: first.cover_image_url ?? '',
              price_tier: first.price_tier ?? '',
              dietary_tags: Array.isArray(first.dietary_tags) ? first.dietary_tags : [],
              wheelchair_accessible: !!first.wheelchair_accessible,
            });
            fetch(`/api/businesses/${first.id}/links`).then((r) => r.json()).then((data: BusinessLink[]) => setLinks(Array.isArray(data) ? data : [])).catch(() => setLinks([]));
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
        email: (b as Business).email ?? '',
        website_url: b.website_url ?? '',
        cover_image_url: b.cover_image_url ?? '',
        price_tier: b.price_tier ?? '',
        dietary_tags: Array.isArray(b.dietary_tags) ? b.dietary_tags : [],
        wheelchair_accessible: !!b.wheelchair_accessible,
      });
      fetch(`/api/businesses/${selectedId}/links`).then((r) => r.json()).then((data: BusinessLink[]) => setLinks(Array.isArray(data) ? data : [])).catch(() => setLinks([]));
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
          email: form.email || undefined,
          website_url: form.website_url || undefined,
          cover_image_url: form.cover_image_url.trim() || undefined,
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
        {isNew && (
          <div style={{ padding: 16, background: 'var(--pj-green-soft, rgba(34,197,94,0.15))', borderRadius: 12, marginBottom: 24, border: '1px solid var(--pj-green-border, rgba(34,197,94,0.3))' }}>
            <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--pj-text)', marginBottom: 4 }}>Business created</p>
            <p style={{ fontSize: 13, color: 'var(--pj-text-secondary)', lineHeight: 1.5 }}>Add details, cover photo, and products below. Then go to Dashboard → Upload video or Go live.</p>
          </div>
        )}
        <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--pj-text)', marginBottom: 8 }}>Business settings</h1>
        <p style={{ fontSize: 14, color: 'var(--pj-text-tertiary)', marginBottom: 24 }}>Edit your business details. Add a cover photo URL for discover.</p>

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
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--pj-text-secondary)', marginBottom: 6 }}>Email</label>
            <input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} placeholder="hello@business.com" style={inputStyle} />
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--pj-text-secondary)', marginBottom: 6 }}>Website</label>
            <input type="url" value={form.website_url} onChange={(e) => setForm((f) => ({ ...f, website_url: e.target.value }))} placeholder="https://" style={inputStyle} />
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--pj-text-secondary)', marginBottom: 6 }}>Cover photo URL</label>
            <input type="url" value={form.cover_image_url} onChange={(e) => setForm((f) => ({ ...f, cover_image_url: e.target.value }))} placeholder="https://..." style={inputStyle} />
            {form.cover_image_url && <img src={form.cover_image_url} alt="Preview" style={{ width: 120, height: 80, objectFit: 'cover', borderRadius: 8, marginBottom: 12 }} />}
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

            <div style={{ marginBottom: 24, padding: 16, background: 'var(--pj-surface-2)', borderRadius: 12, border: '1px solid var(--pj-border)' }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--pj-text)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Link2 size={16} /> Links (social, menu, events, etc.)
              </h3>
              <p style={{ fontSize: 12, color: 'var(--pj-text-tertiary)', marginBottom: 12 }}>Add links to your profile. Each shows as a button on your store page.</p>
              {links.map((l) => (
                <div key={l.id} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, padding: 8, background: 'var(--pj-black)', borderRadius: 8 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--pj-gold)', textTransform: 'capitalize', minWidth: 100 }}>{l.link_type.replace(/_/g, ' ')}</span>
                  <a href={l.url} target="_blank" rel="noopener noreferrer" style={{ flex: 1, fontSize: 12, color: 'var(--pj-text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.url}</a>
                  <button
                    type="button"
                    onClick={async () => {
                      const res = await fetch(`/api/businesses/${selectedId}/links?link_type=${encodeURIComponent(l.link_type)}`, { method: 'DELETE' });
                      if (res.ok) setLinks((prev) => prev.filter((x) => x.id !== l.id));
                    }}
                    style={{ padding: 6, background: 'none', border: 'none', color: 'var(--pj-text-tertiary)', cursor: 'pointer' }}
                    title="Remove link"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 12 }}>
                <select value={newLinkType} onChange={(e) => setNewLinkType(e.target.value)} style={{ ...inputStyle, marginBottom: 0, flex: '1 1 140px' }}>
                  <optgroup label="Social">
                    <option value="facebook">Facebook</option>
                    <option value="instagram">Instagram</option>
                    <option value="youtube">YouTube</option>
                    <option value="tiktok">TikTok</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="x">X (Twitter)</option>
                    <option value="pinterest">Pinterest</option>
                  </optgroup>
                  <optgroup label="Contact &amp; Order">
                    <option value="whatsapp">WhatsApp</option>
                    <option value="menu">Menu / Order</option>
                    <option value="reservations">Reservations</option>
                    <option value="deliveroo">Deliveroo</option>
                    <option value="wolt">Wolt</option>
                    <option value="ubereats">Uber Eats</option>
                  </optgroup>
                  <optgroup label="Bookings &amp; Reviews">
                    <option value="airbnb">Airbnb</option>
                    <option value="booking">Booking.com</option>
                    <option value="tripadvisor">TripAdvisor</option>
                    <option value="google_maps">Google Maps</option>
                  </optgroup>
                  <optgroup label="Other">
                    <option value="eventbrite">Eventbrite</option>
                    <option value="meetup">Meetup</option>
                    <option value="trustpilot">Trustpilot</option>
                    <option value="vimeo">Vimeo</option>
                    <option value="virtual_tour">Virtual Tour</option>
                    <option value="other">Other</option>
                  </optgroup>
                </select>
                <input
                  type="url"
                  value={newLinkUrl}
                  onChange={(e) => setNewLinkUrl(e.target.value)}
                  placeholder="https://..."
                  style={{ ...inputStyle, marginBottom: 0, flex: '2 1 200px' }}
                />
                <button
                  type="button"
                  onClick={async () => {
                    if (!newLinkUrl.trim()) return;
                    const res = await fetch(`/api/businesses/${selectedId}/links`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ link_type: newLinkType, url: newLinkUrl.trim() }),
                    });
                    const data = await res.json();
                    if (res.ok && data) {
                      setLinks((prev) => [...prev.filter((x) => x.link_type !== newLinkType), data]);
                      setNewLinkUrl('');
                    } else alert(data?.error || 'Failed to add link');
                  }}
                  disabled={!newLinkUrl.trim()}
                  style={{ padding: '10px 16px', borderRadius: 8, background: 'var(--pj-red)', border: 'none', color: 'white', fontSize: 13, fontWeight: 600, cursor: newLinkUrl.trim() ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', gap: 6 }}
                >
                  <Plus size={14} /> Add
                </button>
              </div>
            </div>

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
