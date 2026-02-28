'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function CookiesPage() {
  const router = useRouter();

  return (
    <div className="pj-section" style={{ paddingTop: 60, paddingBottom: 80, maxWidth: 720 }}>
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <button className="pj-btn-ghost" style={{ gap: 6 }} onClick={() => router.back()}>
          <ArrowLeft size={16} /> Back
        </button>
        <Link href="/pjazza/discover" className="pj-btn-ghost" style={{ gap: 6, textDecoration: 'none', color: 'inherit' }}>
          Home
        </Link>
      </div>
      <h1 style={{ fontSize: 'var(--pj-size-h1)', fontWeight: 800, color: 'var(--pj-text)', marginBottom: 32 }}>
        Cookie Policy
      </h1>
      <p style={{ fontSize: 'var(--pj-size-small)', color: 'var(--pj-text-tertiary)', marginBottom: 32 }}>
        Last updated: February 2025
      </p>
      <div style={{ fontSize: 'var(--pj-size-body)', color: 'var(--pj-text-secondary)', lineHeight: 1.7 }}>
        <p style={{ marginBottom: 20 }}>
          PJAZZA uses cookies and similar technologies to provide, secure, and improve our service.
        </p>
        <h2 style={{ fontSize: 'var(--pj-size-h3)', fontWeight: 700, color: 'var(--pj-text)', marginTop: 32, marginBottom: 12 }}>Essential Cookies</h2>
        <p style={{ marginBottom: 20 }}>
          Required for authentication, security, and core functionality. These cannot be disabled.
        </p>
        <h2 style={{ fontSize: 'var(--pj-size-h3)', fontWeight: 700, color: 'var(--pj-text)', marginTop: 32, marginBottom: 12 }}>Analytics Cookies</h2>
        <p style={{ marginBottom: 20 }}>
          Help us understand how users interact with the platform. You can opt out via our cookie preferences.
        </p>
        <h2 style={{ fontSize: 'var(--pj-size-h3)', fontWeight: 700, color: 'var(--pj-text)', marginTop: 32, marginBottom: 12 }}>Managing Cookies</h2>
        <p style={{ marginBottom: 20 }}>
          You can control cookies via your browser settings. Disabling essential cookies may affect site functionality.
        </p>
      </div>
    </div>
  );
}
