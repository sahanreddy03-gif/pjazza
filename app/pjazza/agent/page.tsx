'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Phone, Video, LogIn, LogOut, User, Store, Headphones,
  PhoneCall, Clock, Loader2
} from 'lucide-react';
import { createClient } from '@/src/lib/supabase/client';
import type { User as SupabaseUser } from '@supabase/supabase-js';

function AgentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') ?? '/pjazza/business/dashboard';
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [signUpMode, setSignUpMode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [readyForCalls, setReadyForCalls] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user: u } }) => {
      setUser(u);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_ev, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const supabase = createClient();
      const { error: err } = await supabase.auth.signInWithPassword({ email, password });
      if (err) {
        setError(err.message);
        return;
      }
      router.push(redirect);
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const supabase = createClient();
      const { error: err } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName || undefined, role: 'business' } },
      });
      if (err) {
        setError(err.message);
        return;
      }
      router.push(redirect);
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  };

  const handleOAuth = async (provider: "google" | "apple") => {
    setError(null);
    setSubmitting(true);
    try {
      const supabase = createClient();
      const { data, error: err } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${typeof window !== "undefined" ? window.location.origin : ""}/auth/callback?next=${encodeURIComponent(redirect)}`,
        },
      });
      if (err) {
        setError(err.message);
        return;
      }
      if (data?.url) window.location.href = data.url;
    } finally {
      setSubmitting(false);
    }
  };

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.refresh();
  };

  if (loading) {
    return (
      <div className="pj-safe-bottom" style={{ minHeight: '100vh', background: 'var(--pj-black)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 size={32} className="animate-spin" style={{ color: 'var(--pj-text-tertiary)' }} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="pj-safe-bottom" style={{ minHeight: '100vh', background: 'var(--pj-black)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div className="pj-card" style={{ maxWidth: 400, width: '100%', padding: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <div style={{ width: 48, height: 48, borderRadius: 'var(--pj-radius-md)', background: 'var(--pj-red-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Headphones size={24} style={{ color: 'var(--pj-red)' }} />
            </div>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--pj-text)' }}>
                {signUpMode ? 'Create account' : 'Sales Agent Portal'}
              </h1>
              <p style={{ fontSize: 13, color: 'var(--pj-text-tertiary)' }}>
                {signUpMode ? 'Sign up to claim your business' : 'Sign in to receive live calls'}
              </p>
            </div>
          </div>
          {redirect !== '/pjazza/business/dashboard' && (
            <p style={{ fontSize: 12, color: 'var(--pj-text-tertiary)', marginBottom: 16, padding: 10, background: 'var(--pj-surface-2)', borderRadius: 8 }}>
              Sign in to access <span className="pj-mono">{redirect}</span>
            </p>
          )}
          {error && (
            <p style={{ fontSize: 13, color: 'var(--pj-red)', marginBottom: 12, padding: 10, background: 'var(--pj-red-soft)', borderRadius: 8 }}>
              {error}
            </p>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
            <button
              type="button"
              onClick={() => handleOAuth('google')}
              disabled={submitting}
              className="pj-btn-secondary"
              style={{ width: '100%', padding: 14, fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84c-.2 1.05-.8 1.93-1.68 2.51V14h2.72c1.6-1.47 2.52-3.64 2.52-6.2z" fill="#4285F4"/><path d="M9 18c2.28 0 4.2-.76 5.64-2.06l-2.72-2.1c-.76.51-1.73.81-2.92.81-2.25 0-4.16-1.52-4.84-3.56H1.34v2.16C2.79 15.93 5.7 18 9 18z" fill="#34A853"/><path d="M4.16 10.71c-.17-.51-.27-1.06-.27-1.61 0-.55.1-1.1.27-1.61V5.33H1.34C.74 6.58.4 7.96.4 9.4s.34 2.82.94 4.06l2.42-1.87 2.39-1.88z" fill="#FBBC05"/><path d="M9 3.58c1.27 0 2.41.44 3.31 1.29l2.49-2.49C13.2.9 11.28 0 9 0 5.7 0 2.79 2.07 1.34 5.33L4.16 7.49C4.92 5.45 6.84 3.58 9 3.58z" fill="#EA4335"/></svg>
              Sign in with Google
            </button>
            <button
              type="button"
              onClick={() => handleOAuth('apple')}
              disabled={submitting}
              className="pj-btn-secondary"
              style={{ width: '100%', padding: 14, fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
              Sign in with Apple
            </button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ flex: 1, height: 1, background: 'var(--pj-border)' }} />
            <span style={{ fontSize: 12, color: 'var(--pj-text-tertiary)' }}>or</span>
            <div style={{ flex: 1, height: 1, background: 'var(--pj-border)' }} />
          </div>
          <form onSubmit={signUpMode ? handleSignUp : handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {signUpMode && (
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--pj-text-secondary)', marginBottom: 6 }}>Full name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  style={{
                    width: '100%', padding: 12, borderRadius: 'var(--pj-radius-md)',
                    background: 'var(--pj-surface-2)', border: '1px solid var(--pj-border)',
                    color: 'var(--pj-text)', fontSize: 15,
                  }}
                  placeholder="Your name"
                />
              </div>
            )}
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
            <button type="submit" className="pj-btn-primary" style={{ width: '100%', padding: 16 }} disabled={submitting}>
              {submitting ? <Loader2 size={18} className="animate-spin" style={{ marginRight: 8 }} /> : <LogIn size={18} style={{ marginRight: 8 }} />}
              {submitting ? (signUpMode ? 'Creating account…' : 'Signing in…') : (signUpMode ? 'Sign up' : 'Sign in')}
            </button>
          </form>
          <p style={{ fontSize: 12, color: 'var(--pj-text-muted)', marginTop: 16, textAlign: 'center' }}>
            {signUpMode ? (
              <>Already have an account?{' '}
                <button type="button" onClick={() => { setSignUpMode(false); setError(null); }} style={{ background: 'none', border: 'none', color: 'var(--pj-red)', fontWeight: 600, cursor: 'pointer' }}>
                  Sign in
                </button>
              </>
            ) : (
              <>Don&apos;t have an account?{' '}
                <button type="button" onClick={() => { setSignUpMode(true); setError(null); }} style={{ background: 'none', border: 'none', color: 'var(--pj-red)', fontWeight: 600, cursor: 'pointer' }}>
                  Sign up
                </button>
              </>
            )}
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
            onClick={handleSignOut}
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

export default function AgentPortalPage() {
  return (
    <Suspense fallback={null}>
      <AgentContent />
    </Suspense>
  );
}
