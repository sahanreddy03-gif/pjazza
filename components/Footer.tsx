'use client';

import Link from 'next/link';
import { Shield, FileText, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer
      className="pj-section-tight"
      style={{
        paddingTop: 32,
        paddingBottom: 32,
        borderTop: '1px solid var(--pj-border)',
        marginTop: 'auto',
      }}
    >
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img
            src="/pjazza/images/logo-white.svg"
            alt="PJAZZA"
            style={{ height: 24, width: 'auto', display: 'block' }}
          />
          <span style={{ fontSize: 'var(--pj-size-micro)', color: 'var(--pj-text-tertiary)' }}>by Maltaverse</span>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              padding: '4px 10px',
              borderRadius: 'var(--pj-radius-pill)',
              background: 'rgba(34, 197, 94, 0.08)',
              border: '1px solid rgba(34, 197, 94, 0.2)',
              fontSize: 'var(--pj-size-micro)',
              fontWeight: 700,
              color: 'var(--pj-green)',
              letterSpacing: '0.03em',
            }}
          >
            <Shield size={12} strokeWidth={2.5} />
            GDPR Compliant
          </span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, alignItems: 'center' }}>
          <Link
            href="/pjazza/legal/terms"
            style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 'var(--pj-size-small)', color: 'var(--pj-text-tertiary)', textDecoration: 'none' }}
          >
            <FileText size={14} /> Terms
          </Link>
          <Link
            href="/pjazza/legal/privacy"
            style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 'var(--pj-size-small)', color: 'var(--pj-text-tertiary)', textDecoration: 'none' }}
          >
            <Shield size={14} /> Privacy
          </Link>
          <Link
            href="/pjazza/legal/cookies"
            style={{ fontSize: 'var(--pj-size-small)', color: 'var(--pj-text-tertiary)', textDecoration: 'none' }}
          >
            Cookies
          </Link>
          <Link
            href="/pjazza/help"
            style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 'var(--pj-size-small)', color: 'var(--pj-text-tertiary)', textDecoration: 'none' }}
          >
            <Mail size={14} /> Help
          </Link>
        </div>
      </div>
      <p style={{ fontSize: 'var(--pj-size-micro)', color: 'var(--pj-text-muted)', lineHeight: 1.5 }}>
        © {new Date().getFullYear()} Maltaverse. PJAZZA — Malta&apos;s live shopping marketplace. Escrow-protected payments. maltaverse.live
      </p>
    </footer>
  );
}
