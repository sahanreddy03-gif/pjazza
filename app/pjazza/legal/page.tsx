'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, FileText, Shield, Cookie } from 'lucide-react';
import Link from 'next/link';

export default function LegalIndex() {
  const router = useRouter();

  const links = [
    { href: '/pjazza/legal/terms', label: 'Terms of Service', Icon: FileText },
    { href: '/pjazza/legal/privacy', label: 'Privacy Policy', Icon: Shield },
    { href: '/pjazza/legal/cookies', label: 'Cookie Policy', Icon: Cookie },
  ];

  return (
    <div className="pj-section" style={{ paddingTop: 60, minHeight: '80vh' }}>
      <button
        className="pj-btn-ghost"
        style={{ marginBottom: 24, gap: 6 }}
        onClick={() => router.back()}
      >
        <ArrowLeft size={16} /> Back
      </button>
      <h1 style={{ fontSize: 'var(--pj-size-h1)', fontWeight: 800, color: 'var(--pj-text)', marginBottom: 8 }}>
        Legal
      </h1>
      <p style={{ fontSize: 'var(--pj-size-body)', color: 'var(--pj-text-tertiary)', marginBottom: 32 }}>
        Transparency and trust. Read our policies.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {links.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="pj-card pj-touch"
            style={{
              padding: 20,
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              textDecoration: 'none',
              color: 'inherit',
            }}
          >
            <item.Icon size={22} strokeWidth={2} style={{ color: 'var(--pj-text-tertiary)' }} />
            <span style={{ fontSize: 'var(--pj-size-body)', fontWeight: 600, color: 'var(--pj-text)' }}>
              {item.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
