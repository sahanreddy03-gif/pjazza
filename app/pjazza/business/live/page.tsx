'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Video, Store } from 'lucide-react';
import dynamic from 'next/dynamic';

const LiveKitVideoCall = dynamic(() => import('@/components/LiveKitVideoCall'), { ssr: false });

type Business = { id: string; name: string; slug: string };

export default function BusinessLivePage() {
  const router = useRouter();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [selectedStore, setSelectedStore] = useState('');
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/businesses')
      .then((r) => r.json())
      .then((data: Business[]) => setBusinesses(data))
      .catch(() => setBusinesses([]));
  }, []);

  const goLive = async () => {
    if (!selectedStore) {
      setError('Select a store first');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/livekit/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          room: `store-${selectedStore}`,
          identity: `staff-${crypto.randomUUID().slice(0, 8)}`,
          name: businesses.find((b) => b.id === selectedStore)?.name || 'Store',
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to connect');
      setToken(data.token);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not connect');
    } finally {
      setLoading(false);
    }
  };

  const serverUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL;

  if (token && serverUrl) {
    return (
      <div style={{ position: 'fixed', inset: 0, background: 'var(--pj-black)', zIndex: 100, display: 'flex', flexDirection: 'column' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'linear-gradient(rgba(0,0,0,0.6), transparent)', zIndex: 20 }}>
          <button
            onClick={() => router.push('/pjazza/business/dashboard')}
            style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)', border: 'none', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          >
            <ArrowLeft size={18} />
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 'var(--pj-radius-pill)', background: 'var(--pj-red)', fontSize: 12, fontWeight: 700, color: 'white' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'white', animation: 'pj-pulse 1.5s infinite' }} />
            LIVE — Waiting for customer
          </div>
        </div>
        <div style={{ flex: 1, minHeight: 0 }}>
          <LiveKitVideoCall
            token={token}
            serverUrl={serverUrl}
            onDisconnected={() => { setToken(null); }}
          />
        </div>
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <Video size={24} style={{ color: 'var(--pj-red)' }} />
          <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--pj-text)' }}>
            Live video call
          </h1>
        </div>
        <p style={{ fontSize: 14, color: 'var(--pj-text-tertiary)', marginBottom: 24 }}>
          Open this page in a browser. When a customer taps &quot;Connect live&quot; in the app, you&apos;ll see them here. No software to install.
        </p>

        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--pj-text-secondary)', marginBottom: 8 }}>
          <Store size={14} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />
          Select your store
        </label>
        <select
          value={selectedStore}
          onChange={(e) => { setSelectedStore(e.target.value); setError(''); }}
          style={{
            width: '100%', padding: '12px 16px', borderRadius: 'var(--pj-radius-md)',
            background: 'var(--pj-surface-2)', border: '1px solid var(--pj-border)',
            color: 'var(--pj-text)', fontSize: 15, fontFamily: 'inherit',
          }}
        >
          <option value="">Choose store...</option>
          {businesses.map((b) => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </select>

        {error && (
          <p style={{ marginTop: 12, fontSize: 13, color: 'var(--pj-red)' }}>{error}</p>
        )}

        <button
          onClick={goLive}
          disabled={loading || !selectedStore}
          className="pj-btn-primary"
          style={{ width: '100%', marginTop: 24, padding: '16px 24px', fontSize: 16 }}
        >
          <Video size={18} style={{ marginRight: 8 }} />
          {loading ? 'Connecting...' : 'Go live — accept customer calls'}
        </button>
      </div>
    </div>
  );
}
