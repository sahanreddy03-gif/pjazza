'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
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
        Privacy Policy
      </h1>
      <p style={{ fontSize: 'var(--pj-size-small)', color: 'var(--pj-text-tertiary)', marginBottom: 32 }}>
        Last updated: February 2025
      </p>
      <div style={{ fontSize: 'var(--pj-size-body)', color: 'var(--pj-text-secondary)', lineHeight: 1.7 }}>
        <p style={{ marginBottom: 20 }}>
          PJAZZA respects your privacy. This policy explains how we collect, use, and protect your data in line with the GDPR and Maltese data protection law.
        </p>
        <h2 style={{ fontSize: 'var(--pj-size-h3)', fontWeight: 700, color: 'var(--pj-text)', marginTop: 32, marginBottom: 12 }}>1. Data We Collect</h2>
        <p style={{ marginBottom: 20 }}>
          We collect account data (email, name, phone), transaction data (purchases, payments), usage data (how you use the app), and device data (browser, IP) for security and analytics.
        </p>
        <h2 style={{ fontSize: 'var(--pj-size-h3)', fontWeight: 700, color: 'var(--pj-text)', marginTop: 32, marginBottom: 12 }}>2. How We Use It</h2>
        <p style={{ marginBottom: 20 }}>
          We use your data to provide the service, process payments, prevent fraud, improve the platform, and send essential notifications. We do not sell your data to third parties.
        </p>
        <h2 style={{ fontSize: 'var(--pj-size-h3)', fontWeight: 700, color: 'var(--pj-text)', marginTop: 32, marginBottom: 12 }}>3. Sharing</h2>
        <p style={{ marginBottom: 20 }}>
          We share data with payment processors (Stripe), cloud providers (Supabase), and analytics tools. All are GDPR-compliant. We may share data when required by law.
        </p>
        <h2 style={{ fontSize: 'var(--pj-size-h3)', fontWeight: 700, color: 'var(--pj-text)', marginTop: 32, marginBottom: 12 }}>4. Your Rights</h2>
        <p style={{ marginBottom: 20 }}>
          Under GDPR you have the right to access, rectify, erase, restrict processing, and port your data. Contact us at privacy@pjazza.com. You may also lodge a complaint with the Maltese IDPC.
        </p>
        <h2 style={{ fontSize: 'var(--pj-size-h3)', fontWeight: 700, color: 'var(--pj-text)', marginTop: 32, marginBottom: 12 }}>5. Security</h2>
        <p style={{ marginBottom: 20 }}>
          We use encryption, secure authentication, and industry best practices to protect your data. Payment card details are handled by Stripe and never stored on our servers.
        </p>
        <h2 style={{ fontSize: 'var(--pj-size-h3)', fontWeight: 700, color: 'var(--pj-text)', marginTop: 32, marginBottom: 12 }}>6. Retention</h2>
        <p style={{ marginBottom: 20 }}>
          We retain data as long as your account is active and as required for legal, tax, or dispute resolution purposes.
        </p>
      </div>
    </div>
  );
}
