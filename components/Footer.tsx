'use client';

import Link from 'next/link';
import { Shield, FileText, Mail, Phone, Smartphone } from 'lucide-react';
import { SITE } from '@/src/lib/site';

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
        <div className="pj-footer-links" style={{ display: 'flex', flexWrap: 'wrap', gap: 20, alignItems: 'center' }}>
          <Link
            href="/pjazza/legal/terms"
            className="pj-footer-link"
            style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 'var(--pj-size-small)', color: 'var(--pj-text-tertiary)', textDecoration: 'none', transition: 'color 0.2s ease' }}
          >
            <FileText size={14} /> Terms
          </Link>
          <Link
            href="/pjazza/legal/privacy"
            className="pj-footer-link"
            style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 'var(--pj-size-small)', color: 'var(--pj-text-tertiary)', textDecoration: 'none', transition: 'color 0.2s ease' }}
          >
            <Shield size={14} /> Privacy
          </Link>
          <Link
            href="/pjazza/legal/cookies"
            className="pj-footer-link"
            style={{ fontSize: 'var(--pj-size-small)', color: 'var(--pj-text-tertiary)', textDecoration: 'none', transition: 'color 0.2s ease' }}
          >
            Cookies
          </Link>
          <Link
            href="/pjazza/help"
            className="pj-footer-link"
            style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 'var(--pj-size-small)', color: 'var(--pj-text-tertiary)', textDecoration: 'none', transition: 'color 0.2s ease' }}
          >
            <Mail size={14} /> Help
          </Link>
          <Link
            href="/pjazza/contact"
            className="pj-footer-link"
            style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 'var(--pj-size-small)', color: 'var(--pj-text-tertiary)', textDecoration: 'none', transition: 'color 0.2s ease' }}
          >
            <Phone size={14} /> Contact
          </Link>
          <Link
            href="/pjazza/install"
            className="pj-footer-link"
            style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 'var(--pj-size-small)', color: 'var(--pj-text-tertiary)', textDecoration: 'none', transition: 'color 0.2s ease' }}
          >
            <Smartphone size={14} /> Install app
          </Link>
        </div>
      </div>
      <p style={{ fontSize: 'var(--pj-size-micro)', color: 'var(--pj-text-muted)', lineHeight: 1.5, marginBottom: 8 }}>
        © {new Date().getFullYear()} Maltaverse. PJAZZA — Malta&apos;s live shopping marketplace. Escrow-protected payments. maltaverse.live
      </p>
      <p style={{ fontSize: 'var(--pj-size-micro)', color: 'var(--pj-text-muted)' }}>
        <a href={`tel:${SITE.contact.phone.replace(/\s/g, '')}`} style={{ color: 'var(--pj-text-tertiary)', textDecoration: 'none' }}>{SITE.contact.phone}</a>
        {' · '}
        <a href={`mailto:${SITE.contact.email}`} style={{ color: 'var(--pj-text-tertiary)', textDecoration: 'none' }}>{SITE.contact.email}</a>
      </p>
    </footer>
  );
}
