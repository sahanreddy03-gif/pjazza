'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import PjAppShell from '@/components/PjAppShell';

const faqs = [
  { q: 'How do I shop live?', a: 'Browse the Live Shop, pick a store, and tap "Shop Live". A salesperson will video-call you from the shop floor. You can see products in real time, ask questions, and add items to your cart.' },
  { q: 'Is my payment secure?', a: 'Yes. Payments are held in escrow until you confirm delivery. Your money is protected—sellers only get paid once you\'re satisfied. We use bank-grade encryption.' },
  { q: 'How do I become a seller?', a: 'Go to Business → List Your Shop. Sign up, verify your identity, and complete onboarding. Founding partners get 90 days free. You can go live in minutes.' },
  { q: 'What sectors does PJAZZA cover?', a: 'All 12: Food & Dining, Property, Cars, Yachts, Home Services, Freelancers, Wellness, Fashion, Electronics, Tourism, Education, and Pets.' },
  { q: 'Can I record my live stream?', a: 'Yes. In the Recording Studio, you can go live or upload pre-recorded videos. Choose Product, Tour, or Portrait preset for best results.' },
  { q: 'How does delivery work?', a: 'Delivery is arranged between buyer and seller. Many businesses offer same-day delivery across Malta. For services, you book appointments directly.' },
  { q: 'What if I have a dispute?', a: 'Contact support. We mediate disputes and can issue refunds from escrow if the seller doesn\'t deliver as promised.' },
  { q: 'Is PJAZZA available outside Malta?', a: 'PJAZZA is focused on Malta for now. We may expand to Gozo and beyond in the future.' },
];

export default function HelpPage() {
  const router = useRouter();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <PjAppShell>
    <div className="pj-safe-bottom" style={{ minHeight: '100vh', background: 'var(--pj-black)' }}>
      <div className="pj-section" style={{ paddingTop: 60, paddingBottom: 100 }}>
        <button className="pj-btn-ghost" style={{ marginBottom: 24, gap: 6 }} onClick={() => router.back()}>
          <ArrowLeft size={16} /> Back
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <HelpCircle size={28} strokeWidth={2} style={{ color: 'var(--pj-text-tertiary)' }} />
          <h1 style={{ fontSize: 'var(--pj-size-h1)', fontWeight: 800, color: 'var(--pj-text)', letterSpacing: '-0.02em' }}>
            Help & FAQ
          </h1>
        </div>
        <p style={{ fontSize: 'var(--pj-size-body)', color: 'var(--pj-text-tertiary)', marginBottom: 32, lineHeight: 1.5 }}>
          Common questions about shopping and selling on PJAZZA.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="pj-card pj-touch"
              style={{ padding: 16, cursor: 'pointer' }}
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                <h3 style={{ fontSize: 'var(--pj-size-small)', fontWeight: 700, color: 'var(--pj-text)', flex: 1 }}>
                  {faq.q}
                </h3>
                {openIndex === i ? <ChevronUp size={18} style={{ color: 'var(--pj-text-tertiary)' }} /> : <ChevronDown size={18} style={{ color: 'var(--pj-text-tertiary)' }} />}
              </div>
              {openIndex === i && (
                <p style={{ fontSize: 'var(--pj-size-small)', color: 'var(--pj-text-secondary)', lineHeight: 1.6, marginTop: 12 }}>
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
        <div style={{ marginTop: 32, padding: 20, background: 'var(--pj-surface-1)', borderRadius: 'var(--pj-radius-lg)', border: '1px solid var(--pj-border)' }}>
          <p style={{ fontSize: 'var(--pj-size-small)', fontWeight: 600, color: 'var(--pj-text)', marginBottom: 8 }}>Still need help?</p>
          <p style={{ fontSize: 'var(--pj-size-small)', color: 'var(--pj-text-tertiary)', marginBottom: 12 }}>
            Call us at <a href="tel:+35679711799" style={{ color: 'var(--pj-red)', textDecoration: 'none', fontWeight: 600 }}>+356 79711799</a> or email <a href="mailto:hello@maltaverse.com" style={{ color: 'var(--pj-red)', textDecoration: 'none', fontWeight: 600 }}>hello@maltaverse.com</a>. We typically reply within 24 hours.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <a href="tel:+35679711799" className="pj-btn-secondary" style={{ textDecoration: 'none', color: 'inherit' }}>Call +356 79711799</a>
            <a href="/pjazza/contact" className="pj-btn-primary" style={{ textDecoration: 'none', color: 'white' }}>Contact form</a>
          </div>
        </div>
      </div>
    </div>
    </PjAppShell>
  );
}
