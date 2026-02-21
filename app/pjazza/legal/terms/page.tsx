'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function TermsPage() {
  const router = useRouter();

  return (
    <div className="pj-section" style={{ paddingTop: 60, paddingBottom: 80, maxWidth: 720 }}>
      <button className="pj-btn-ghost" style={{ marginBottom: 24, gap: 6 }} onClick={() => router.back()}>
        <ArrowLeft size={16} /> Back
      </button>
      <h1 style={{ fontSize: 'var(--pj-size-h1)', fontWeight: 800, color: 'var(--pj-text)', marginBottom: 32 }}>
        Terms of Service
      </h1>
      <p style={{ fontSize: 'var(--pj-size-small)', color: 'var(--pj-text-tertiary)', marginBottom: 32 }}>
        Last updated: February 2025
      </p>
      <div style={{ fontSize: 'var(--pj-size-body)', color: 'var(--pj-text-secondary)', lineHeight: 1.7 }}>
        <p style={{ marginBottom: 20 }}>
          Welcome to PJAZZA. By using our platform, you agree to these terms. We recommend you read them carefully.
        </p>
        <h2 style={{ fontSize: 'var(--pj-size-h3)', fontWeight: 700, color: 'var(--pj-text)', marginTop: 32, marginBottom: 12 }}>1. Our Service</h2>
        <p style={{ marginBottom: 20 }}>
          PJAZZA is a live shopping marketplace connecting buyers and sellers in Malta. We facilitate live video streams, product discovery, bookings, and secure payments through escrow.
        </p>
        <h2 style={{ fontSize: 'var(--pj-size-h3)', fontWeight: 700, color: 'var(--pj-text)', marginTop: 32, marginBottom: 12 }}>2. Your Account</h2>
        <p style={{ marginBottom: 20 }}>
          You must provide accurate information when registering. You are responsible for keeping your credentials secure and for all activity under your account.
        </p>
        <h2 style={{ fontSize: 'var(--pj-size-h3)', fontWeight: 700, color: 'var(--pj-text)', marginTop: 32, marginBottom: 12 }}>3. For Sellers</h2>
        <p style={{ marginBottom: 20 }}>
          Sellers must comply with Maltese law, provide accurate listings, and fulfil orders as described. PJAZZA takes a commission on completed sales. Pricing and commission terms are disclosed during onboarding.
        </p>
        <h2 style={{ fontSize: 'var(--pj-size-h3)', fontWeight: 700, color: 'var(--pj-text)', marginTop: 32, marginBottom: 12 }}>4. For Buyers</h2>
        <p style={{ marginBottom: 20 }}>
          Payments are held in escrow until you confirm delivery. If there is a dispute, PJAZZA will mediate. Refunds are issued in accordance with our refund policy and Maltese consumer law.
        </p>
        <h2 style={{ fontSize: 'var(--pj-size-h3)', fontWeight: 700, color: 'var(--pj-text)', marginTop: 32, marginBottom: 12 }}>5. Prohibited Conduct</h2>
        <p style={{ marginBottom: 20 }}>
          You may not use PJAZZA for illegal activity, fraud, harassment, or to sell prohibited items. We reserve the right to suspend or terminate accounts that violate these terms.
        </p>
        <h2 style={{ fontSize: 'var(--pj-size-h3)', fontWeight: 700, color: 'var(--pj-text)', marginTop: 32, marginBottom: 12 }}>6. Limitation of Liability</h2>
        <p style={{ marginBottom: 20 }}>
          PJAZZA acts as a platform. We are not liable for disputes between buyers and sellers beyond our role as facilitator. Our liability is limited to the extent permitted by law.
        </p>
        <h2 style={{ fontSize: 'var(--pj-size-h3)', fontWeight: 700, color: 'var(--pj-text)', marginTop: 32, marginBottom: 12 }}>7. Changes</h2>
        <p style={{ marginBottom: 20 }}>
          We may update these terms. Continued use of the service after changes constitutes acceptance. Material changes will be communicated via email or in-app notice.
        </p>
        <h2 style={{ fontSize: 'var(--pj-size-h3)', fontWeight: 700, color: 'var(--pj-text)', marginTop: 32, marginBottom: 12 }}>8. Contact</h2>
        <p style={{ marginBottom: 20 }}>
          For questions about these terms, contact us at legal@pjazza.com or via our contact form.
        </p>
      </div>
    </div>
  );
}
