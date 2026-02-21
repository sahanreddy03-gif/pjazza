'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Smartphone, Share2, PlusSquare, Download } from 'lucide-react';
import PjAppShell from '@/components/PjAppShell';

export default function InstallPage() {
  const router = useRouter();
  const isIOS = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isAndroid = typeof navigator !== 'undefined' && /Android/.test(navigator.userAgent);

  return (
    <PjAppShell>
      <div className="pj-safe-bottom" style={{ minHeight: '100vh', background: 'var(--pj-black)' }}>
        <div className="pj-section" style={{ paddingTop: 60, paddingBottom: 100 }}>
          <button className="pj-btn-ghost pj-touch" style={{ marginBottom: 24, gap: 6 }} onClick={() => router.back()}>
            <ArrowLeft size={16} /> Back
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 'var(--pj-radius-lg)',
                background: 'linear-gradient(135deg, var(--pj-red-soft) 0%, var(--pj-gold-soft) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid var(--pj-border)',
              }}
            >
              <Smartphone size={28} strokeWidth={2} style={{ color: 'var(--pj-red)' }} />
            </div>
            <div>
              <h1 style={{ fontSize: 'var(--pj-size-h1)', fontWeight: 800, color: 'var(--pj-text)', letterSpacing: '-0.02em' }}>
                Get the app
              </h1>
              <p style={{ fontSize: 'var(--pj-size-small)', color: 'var(--pj-text-tertiary)' }}>
                No app store. Add to home screen in seconds.
              </p>
            </div>
          </div>

          <p style={{ fontSize: 'var(--pj-size-body)', color: 'var(--pj-text-secondary)', lineHeight: 1.6, marginBottom: 40 }}>
            PJAZZA works as an installable app on your phone. Add it to your home screen for quick access — same full experience, no download from Google Play or App Store.
          </p>

          {/* Platform-specific instructions */}
          <div className="pj-card" style={{ padding: 24, marginBottom: 24, borderColor: 'var(--pj-border-hover)' }}>
            {isIOS ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 'var(--pj-radius-md)', background: 'var(--pj-surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Share2 size={20} style={{ color: 'var(--pj-text)' }} />
                  </div>
                  <h2 style={{ fontSize: 'var(--pj-size-h3)', fontWeight: 700, color: 'var(--pj-text)' }}>iPhone / iPad</h2>
                </div>
                <ol style={{ margin: 0, paddingLeft: 20, fontSize: 'var(--pj-size-body)', color: 'var(--pj-text-secondary)', lineHeight: 2 }}>
                  <li>Tap the <strong style={{ color: 'var(--pj-text)' }}>Share</strong> button (square with arrow) at the bottom of Safari</li>
                  <li>Scroll down and tap <strong style={{ color: 'var(--pj-text)' }}>Add to Home Screen</strong></li>
                  <li>Tap <strong style={{ color: 'var(--pj-text)' }}>Add</strong> — done. PJAZZA will appear on your home screen.</li>
                </ol>
              </>
            ) : isAndroid ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 'var(--pj-radius-md)', background: 'var(--pj-surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Download size={20} style={{ color: 'var(--pj-green)' }} />
                  </div>
                  <h2 style={{ fontSize: 'var(--pj-size-h3)', fontWeight: 700, color: 'var(--pj-text)' }}>Android</h2>
                </div>
                <ol style={{ margin: 0, paddingLeft: 20, fontSize: 'var(--pj-size-body)', color: 'var(--pj-text-secondary)', lineHeight: 2 }}>
                  <li>Tap the <strong style={{ color: 'var(--pj-text)' }}>⋮</strong> menu (top right in Chrome)</li>
                  <li>Select <strong style={{ color: 'var(--pj-text)' }}>Add to Home screen</strong> or <strong style={{ color: 'var(--pj-text)' }}>Install app</strong></li>
                  <li>Confirm — PJAZZA will appear on your home screen like a native app.</li>
                </ol>
              </>
            ) : (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 'var(--pj-radius-md)', background: 'var(--pj-surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Smartphone size={20} style={{ color: 'var(--pj-text-tertiary)' }} />
                  </div>
                  <h2 style={{ fontSize: 'var(--pj-size-h3)', fontWeight: 700, color: 'var(--pj-text)' }}>On your phone</h2>
                </div>
                <p style={{ fontSize: 'var(--pj-size-body)', color: 'var(--pj-text-secondary)', lineHeight: 1.7, margin: 0 }}>
                  Open <strong style={{ color: 'var(--pj-text)' }}>maltaverse.live</strong> on your phone, then use your browser&apos;s <strong style={{ color: 'var(--pj-text)' }}>Add to Home Screen</strong> or <strong style={{ color: 'var(--pj-text)' }}>Install</strong> option.
                </p>
              </>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: 16, background: 'var(--pj-surface-1)', borderRadius: 'var(--pj-radius-md)', border: '1px solid var(--pj-border)' }}>
            <PlusSquare size={20} style={{ color: 'var(--pj-gold)', flexShrink: 0, marginTop: 2 }} />
            <p style={{ fontSize: 'var(--pj-size-small)', color: 'var(--pj-text-tertiary)', lineHeight: 1.6, margin: 0 }}>
              Once installed, PJAZZA opens full-screen like a native app. All features — live shopping, video calls, escrow — work the same.
            </p>
          </div>
        </div>
      </div>
    </PjAppShell>
  );
}
