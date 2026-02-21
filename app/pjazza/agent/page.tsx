'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Phone, Video, LogIn, LogOut, User, Store, Headphones,
  PhoneCall, Clock
} from 'lucide-react';

export default function AgentPortalPage() {
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [readyForCalls, setReadyForCalls] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder: in production, use Supabase Auth
    if (email && password) setLoggedIn(true);
  };

  if (!loggedIn) {
    return (
      <div className="pj-safe-bottom" style={{ minHeight: '100vh', background: 'var(--pj-black)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div className="pj-card" style={{ maxWidth: 400, width: '100%', padding: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <div style={{ width: 48, height: 48, borderRadius: 'var(--pj-radius-md)', background: 'var(--pj-red-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Headphones size={24} style={{ color: 'var(--pj-red)' }} />
            </div>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--pj-text)' }}>Sales Agent Portal</h1>
              <p style={{ fontSize: 13, color: 'var(--pj-text-tertiary)' }}>Sign in to receive live calls</p>
            </div>
          </div>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--pj-text-secondary)', marginBottom: 6 }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: '100%', padding: 12, borderRadius: 'var(--pj-radius-md)',
                  background: 'var(--pj-surface-2)', border: '1px solid var(--pj-border)',
                  color: 'var(--pj-text)', fontSize: 15,
                }}
                placeholder="agent@store.com"
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--pj-text-secondary)', marginBottom: 6 }}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: '100%', padding: 12, borderRadius: 'var(--pj-radius-md)',
                  background: 'var(--pj-surface-2)', border: '1px solid var(--pj-border)',
                  color: 'var(--pj-text)', fontSize: 15,
                }}
                placeholder="••••••••"
              />
            </div>
            <button type="submit" className="pj-btn-primary" style={{ width: '100%', padding: 16 }}>
              <LogIn size={18} style={{ marginRight: 8 }} />
              Sign in
            </button>
          </form>
          <p style={{ fontSize: 12, color: 'var(--pj-text-muted)', marginTop: 20, textAlign: 'center' }}>
            Sales agents receive login details from their business manager.
          </p>
        </div>
      </div>
    );
  }

  const mockIncoming = [
    { id: '1', name: 'Sarah M.', store: 'Property Malta', type: 'Property viewing', time: 'Just now' },
    { id: '2', name: 'Marco D.', store: 'Noni\'s Kitchen', type: 'Menu inquiry', time: '2 min ago' },
  ];

  return (
    <div className="pj-safe-bottom" style={{ minHeight: '100vh', background: 'var(--pj-black)' }}>
      <div style={{ padding: 20, borderBottom: '1px solid var(--pj-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <User size={20} style={{ color: 'var(--pj-text-tertiary)' }} />
            <div>
              <h1 style={{ fontSize: 18, fontWeight: 800, color: 'var(--pj-text)' }}>Agent Dashboard</h1>
              <p style={{ fontSize: 12, color: 'var(--pj-text-tertiary)' }}>Ready to assist customers</p>
            </div>
          </div>
          <button
            onClick={() => setLoggedIn(false)}
            className="pj-btn-ghost"
            style={{ gap: 6 }}
          >
            <LogOut size={16} /> Sign out
          </button>
        </div>

        <div
          className={`pj-card pj-touch ${readyForCalls ? '' : ''}`}
          style={{
            padding: 20,
            borderColor: readyForCalls ? 'var(--pj-green)' : 'var(--pj-border)',
            background: readyForCalls ? 'var(--pj-green-soft)' : 'var(--pj-surface-1)',
          }}
          onClick={() => setReadyForCalls(!readyForCalls)}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 44, height: 44, borderRadius: '50%',
                background: readyForCalls ? 'var(--pj-green)' : 'var(--pj-surface-3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Phone size={20} style={{ color: readyForCalls ? 'white' : 'var(--pj-text-tertiary)' }} />
              </div>
              <div>
                <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--pj-text)' }}>
                  {readyForCalls ? 'Accepting calls' : 'Offline'}
                </p>
                <p style={{ fontSize: 12, color: 'var(--pj-text-tertiary)' }}>
                  {readyForCalls ? 'Tap to go offline' : 'Tap to go online'}
                </p>
              </div>
            </div>
            <div style={{
              width: 52, height: 28, borderRadius: 14,
              background: readyForCalls ? 'var(--pj-green)' : 'var(--pj-surface-3)',
              position: 'relative',
              transition: 'background 0.2s',
            }}>
              <div style={{
                position: 'absolute',
                top: 2,
                left: readyForCalls ? 26 : 2,
                width: 24, height: 24, borderRadius: '50%',
                background: 'white',
                transition: 'left 0.2s',
              }} />
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <PhoneCall size={18} style={{ color: 'var(--pj-red)' }} />
          <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--pj-text)' }}>Incoming calls</h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {mockIncoming.map((call) => (
            <div
              key={call.id}
              className="pj-card pj-touch"
              style={{
                padding: 16,
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                borderColor: 'var(--pj-red-border)',
                cursor: 'pointer',
              }}
              onClick={() => router.push('/pjazza/business/live')}
            >
              <div style={{
                width: 44, height: 44, borderRadius: '50%',
                background: 'var(--pj-red-soft)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--pj-red)' }}>{call.name.charAt(0)}</span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--pj-text)' }}>{call.name}</p>
                <p style={{ fontSize: 12, color: 'var(--pj-text-tertiary)' }}>
                  {call.store} · {call.type}
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Clock size={14} style={{ color: 'var(--pj-text-tertiary)' }} />
                <span style={{ fontSize: 12, color: 'var(--pj-text-tertiary)' }}>{call.time}</span>
              </div>
              <button
                className="pj-btn-primary"
                style={{ padding: '10px 16px', fontSize: 13 }}
                onClick={(e) => { e.stopPropagation(); router.push('/pjazza/business/live'); }}
              >
                <Video size={14} style={{ marginRight: 4 }} /> Answer
              </button>
            </div>
          ))}
        </div>

        {mockIncoming.length === 0 && (
          <div className="pj-card" style={{ padding: 32, textAlign: 'center' }}>
            <Store size={40} style={{ color: 'var(--pj-text-muted)', margin: '0 auto 12px', display: 'block' }} />
            <p style={{ fontSize: 14, color: 'var(--pj-text-tertiary)', marginBottom: 8 }}>No incoming calls</p>
            <p style={{ fontSize: 12, color: 'var(--pj-text-muted)' }}>When customers request a live call, they&apos;ll appear here</p>
          </div>
        )}

        <div style={{ marginTop: 24 }}>
          <button
            className="pj-btn-primary"
            style={{ width: '100%', padding: 16 }}
            onClick={() => router.push('/pjazza/business/live')}
          >
            <Video size={18} style={{ marginRight: 8 }} />
            Open video call room
          </button>
        </div>
      </div>
    </div>
  );
}
