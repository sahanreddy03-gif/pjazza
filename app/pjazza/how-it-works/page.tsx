'use client';

import { useRouter } from 'next/navigation';
import {
  ArrowRight, ArrowLeft, Video, MessageSquare, Lock, Package,
  CheckCircle, Shield, Eye, Star, Radio, DollarSign,
  Camera, Zap, Users, TrendingUp, ThumbsUp, Clock,
  ChevronDown, ChevronUp
} from 'lucide-react';
import { useState } from 'react';
import PjAppShell from '@/components/PjAppShell';
import ScrollReveal from '@/components/ScrollReveal';

function PageHero() {
  return (
    <div className="pj-section" style={{ paddingTop: 40, paddingBottom: 24 }}>
      <ScrollReveal>
        <button
          className="pj-btn-ghost"
          style={{ marginBottom: 16, gap: 6, padding: '4px 0' }}
          onClick={() => window.history.back()}
          data-testid="button-back"
        >
          <ArrowLeft size={14} /> Back
        </button>
        <span className="pj-label" style={{ display: 'block', marginBottom: 8 }}>HOW PJAZZA WORKS</span>
        <h1 style={{ fontSize: 'var(--pj-size-h1)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.03em', color: 'var(--pj-text)', marginBottom: 12 }}>
          Live shopping,
          <br />
          <span style={{ color: 'var(--pj-red)' }}>real trust.</span>
        </h1>
        <p style={{ fontSize: 'var(--pj-size-body)', color: 'var(--pj-text-secondary)', lineHeight: 1.6, maxWidth: 480 }}>
          PJAZZA connects buyers and sellers through live video. You see exactly what you're buying, chat directly with the seller, and every transaction is protected by escrow.
        </p>
      </ScrollReveal>
    </div>
  );
}

function BuyerFlow() {
  const steps = [
    {
      num: '01',
      Icon: Eye,
      title: 'Browse live streams',
      desc: 'Open PJAZZA and see who\'s live right now. Restaurants showing tonight\'s specials, property agents touring apartments, mechanics walking around cars, freelancers showing their portfolio — all live.',
      detail: 'Filter by sector, location, or popularity. Every business is verified with ID and reviews.'
    },
    {
      num: '02',
      Icon: Video,
      title: 'Watch and see for yourself',
      desc: 'No stock photos. No old listings. You see the actual product, service, or property in real time. Want a closer look? Just ask in the chat.',
      detail: 'Streams are HD quality. You can watch multiple at once and compare.'
    },
    {
      num: '03',
      Icon: MessageSquare,
      title: 'Chat and negotiate',
      desc: 'Type directly to the seller during their live stream. Ask about price, availability, delivery. Make an offer. Everything happens in real time.',
      detail: 'Private chats available for sensitive negotiations like property or high-value items.'
    },
    {
      num: '04',
      Icon: Lock,
      title: 'Buy with escrow protection',
      desc: 'When you\'re ready to buy, your payment goes into escrow — held safely by PJAZZA. The seller doesn\'t get paid until you confirm you received what was promised.',
      detail: 'If anything goes wrong, PJAZZA mediates. Your money is always protected.'
    },
    {
      num: '05',
      Icon: ThumbsUp,
      title: 'Confirm and review',
      desc: 'Once you receive your item or service, confirm delivery. The seller gets paid. Leave a review to help other buyers in Malta.',
      detail: 'Ratings build trust across the entire marketplace. Great sellers get featured.'
    },
  ];

  return (
    <div className="pj-section">
      <ScrollReveal>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <div style={{ width: 32, height: 32, borderRadius: 'var(--pj-radius-md)', background: 'var(--pj-red-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Users size={16} style={{ color: 'var(--pj-red)' }} />
          </div>
          <h2 style={{ fontSize: 'var(--pj-size-h2)', fontWeight: 700, color: 'var(--pj-text)', letterSpacing: '-0.01em' }}>
            For Buyers
          </h2>
        </div>
        <p style={{ fontSize: 'var(--pj-size-small)', color: 'var(--pj-text-tertiary)', marginBottom: 24, lineHeight: 1.5 }}>
          How shopping on PJAZZA works, step by step.
        </p>
      </ScrollReveal>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {steps.map((step, i) => (
          <ScrollReveal key={i} delay={i * 60}>
            <div className="pj-card" style={{ padding: 20 }}>
              <div style={{ display: 'flex', gap: 16 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 'var(--pj-radius-md)',
                      background: step.num === '04' ? 'var(--pj-green-soft)' : 'var(--pj-surface-2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <step.Icon size={20} strokeWidth={2} style={{ color: step.num === '04' ? 'var(--pj-green)' : 'var(--pj-text)' }} />
                  </div>
                  {i < steps.length - 1 && (
                    <div style={{ width: 1, flex: 1, background: 'var(--pj-border)', minHeight: 16 }} />
                  )}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <span className="pj-mono" style={{ fontSize: 'var(--pj-size-xs)', fontWeight: 700, color: 'var(--pj-red)' }}>{step.num}</span>
                    <h3 style={{ fontSize: 'var(--pj-size-body)', fontWeight: 700, color: 'var(--pj-text)' }}>{step.title}</h3>
                  </div>
                  <p style={{ fontSize: 'var(--pj-size-small)', color: 'var(--pj-text-secondary)', lineHeight: 1.6, marginBottom: 8 }}>{step.desc}</p>
                  <p style={{ fontSize: 'var(--pj-size-xs)', color: 'var(--pj-text-tertiary)', lineHeight: 1.5, fontStyle: 'italic' }}>{step.detail}</p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}

function SellerFlow() {
  const steps = [
    {
      num: '01',
      Icon: CheckCircle,
      title: 'Sign up and verify',
      desc: 'Create your business profile. Upload your ID for verification. Choose your sector — dining, property, services, retail, whatever you do.',
      detail: 'Founding partners get 90 days free. No credit card required.'
    },
    {
      num: '02',
      Icon: Camera,
      title: 'Go live in seconds',
      desc: 'Open the recording studio, point your phone at your product or workspace, and hit go. No equipment needed — just your phone.',
      detail: 'Choose presets optimized for product showcases, property tours, or portrait mode.'
    },
    {
      num: '03',
      Icon: Users,
      title: 'Reach all of Malta instantly',
      desc: 'Every buyer on PJAZZA sees your stream. No followers needed, no ad spend. Your audience is built in — anyone browsing your sector will find you.',
      detail: 'Cruise ship alerts tell you when thousands of tourists are arriving.'
    },
    {
      num: '04',
      Icon: MessageSquare,
      title: 'Chat, negotiate, close',
      desc: 'Respond to viewer questions live. Send offers directly. Close deals while customers are excited and engaged.',
      detail: 'Offers include quantity, price, and delivery details — all in one tap.'
    },
    {
      num: '05',
      Icon: DollarSign,
      title: 'Get paid securely',
      desc: 'Once the buyer confirms, the money transfers to you. PJAZZA takes a small commission only on completed sales. You pay nothing until you earn.',
      detail: 'Real-time analytics show your views, revenue, and conversion rates.'
    },
  ];

  return (
    <div className="pj-section">
      <ScrollReveal>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <div style={{ width: 32, height: 32, borderRadius: 'var(--pj-radius-md)', background: 'var(--pj-gold-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Radio size={16} style={{ color: 'var(--pj-gold)' }} />
          </div>
          <h2 style={{ fontSize: 'var(--pj-size-h2)', fontWeight: 700, color: 'var(--pj-text)', letterSpacing: '-0.01em' }}>
            For Sellers
          </h2>
        </div>
        <p style={{ fontSize: 'var(--pj-size-small)', color: 'var(--pj-text-tertiary)', marginBottom: 24, lineHeight: 1.5 }}>
          How selling on PJAZZA works, step by step.
        </p>
      </ScrollReveal>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {steps.map((step, i) => (
          <ScrollReveal key={i} delay={i * 60}>
            <div className="pj-card" style={{ padding: 20 }}>
              <div style={{ display: 'flex', gap: 16 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 'var(--pj-radius-md)',
                      background: step.num === '05' ? 'var(--pj-green-soft)' : 'var(--pj-surface-2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <step.Icon size={20} strokeWidth={2} style={{ color: step.num === '05' ? 'var(--pj-green)' : 'var(--pj-gold)' }} />
                  </div>
                  {i < steps.length - 1 && (
                    <div style={{ width: 1, flex: 1, background: 'var(--pj-border)', minHeight: 16 }} />
                  )}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <span className="pj-mono" style={{ fontSize: 'var(--pj-size-xs)', fontWeight: 700, color: 'var(--pj-gold)' }}>{step.num}</span>
                    <h3 style={{ fontSize: 'var(--pj-size-body)', fontWeight: 700, color: 'var(--pj-text)' }}>{step.title}</h3>
                  </div>
                  <p style={{ fontSize: 'var(--pj-size-small)', color: 'var(--pj-text-secondary)', lineHeight: 1.6, marginBottom: 8 }}>{step.desc}</p>
                  <p style={{ fontSize: 'var(--pj-size-xs)', color: 'var(--pj-text-tertiary)', lineHeight: 1.5, fontStyle: 'italic' }}>{step.detail}</p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}

function EscrowExplainer() {
  return (
    <div className="pj-section">
      <ScrollReveal>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <Shield size={20} style={{ color: 'var(--pj-green)' }} />
          <h2 style={{ fontSize: 'var(--pj-size-h2)', fontWeight: 700, color: 'var(--pj-text)', letterSpacing: '-0.01em' }}>
            Escrow Protection Explained
          </h2>
        </div>
        <p style={{ fontSize: 'var(--pj-size-small)', color: 'var(--pj-text-tertiary)', marginBottom: 24, lineHeight: 1.5 }}>
          Your money is never at risk. Here's exactly how it works.
        </p>
      </ScrollReveal>

      <ScrollReveal delay={60}>
        <div className="pj-card" style={{ padding: 24, borderColor: 'var(--pj-border-hover)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {[
              { step: 'You buy', desc: 'Your payment goes to PJAZZA\'s secure escrow account — not to the seller.', Icon: Lock, color: 'var(--pj-red)' },
              { step: 'Seller delivers', desc: 'The seller ships your item, completes the service, or hands over the keys.', Icon: Package, color: 'var(--pj-gold)' },
              { step: 'You confirm', desc: 'You inspect what you received. Happy? Confirm delivery. Not happy? Open a dispute.', Icon: CheckCircle, color: 'var(--pj-text)' },
              { step: 'Seller gets paid', desc: 'Once you confirm, the money releases to the seller. Protected start to finish.', Icon: DollarSign, color: 'var(--pj-green)' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: 'var(--pj-surface-2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <item.Icon size={18} strokeWidth={2} style={{ color: item.color }} />
                </div>
                <div>
                  <h4 style={{ fontSize: 'var(--pj-size-body)', fontWeight: 700, color: 'var(--pj-text)', marginBottom: 2 }}>{item.step}</h4>
                  <p style={{ fontSize: 'var(--pj-size-small)', color: 'var(--pj-text-secondary)', lineHeight: 1.5 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
}

function FAQ() {
  const faqs = [
    { q: 'Is PJAZZA free for buyers?', a: 'Yes, completely free. You only pay for what you buy. There are no subscription fees or hidden charges for shoppers.' },
    { q: 'How much does it cost for sellers?', a: 'Founding partners get 90 days completely free. After that, PJAZZA takes just 5% commission on completed sales only. You never pay unless you earn.' },
    { q: 'What if I don\'t receive my item?', a: 'Your money stays in escrow until you confirm delivery. If something goes wrong, PJAZZA mediates and can issue a full refund.' },
    { q: 'Do I need special equipment to go live?', a: 'No — just your smartphone. The recording studio has presets for product showcases, property tours, and more. It works with any phone camera.' },
    { q: 'What sectors does PJAZZA cover?', a: 'Everything — food & dining, property, cars, yachts, home services, freelancers, wellness, fashion, electronics, tourism, education, and pets. If it\'s a business in Malta, it belongs on PJAZZA.' },
    { q: 'Is my payment information safe?', a: 'Absolutely. All payments are processed through bank-grade encrypted systems. Your card details are never stored on PJAZZA\'s servers.' },
    { q: 'Can I schedule a live stream in advance?', a: 'Yes. Sellers can schedule streams so their audience knows when to tune in. Scheduled streams appear in the discovery feed.' },
    { q: 'What about delivery?', a: 'Delivery is arranged between buyer and seller. Many businesses offer same-day delivery across Malta. For services, you can book appointments directly through the platform.' },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="pj-section">
      <ScrollReveal>
        <span className="pj-label" style={{ display: 'block', marginBottom: 8 }}>FAQ</span>
        <h2 style={{ fontSize: 'var(--pj-size-h2)', fontWeight: 700, color: 'var(--pj-text)', marginBottom: 24, letterSpacing: '-0.01em' }}>
          Common questions
        </h2>
      </ScrollReveal>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {faqs.map((faq, i) => (
          <ScrollReveal key={i} delay={i * 40}>
            <div
              className="pj-card pj-touch"
              style={{ padding: 16, cursor: 'pointer' }}
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              data-testid={`faq-${i}`}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                <h4 style={{ fontSize: 'var(--pj-size-small)', fontWeight: 700, color: 'var(--pj-text)' }}>{faq.q}</h4>
                {openIndex === i ? (
                  <ChevronUp size={16} style={{ color: 'var(--pj-text-tertiary)', flexShrink: 0 }} />
                ) : (
                  <ChevronDown size={16} style={{ color: 'var(--pj-text-tertiary)', flexShrink: 0 }} />
                )}
              </div>
              {openIndex === i && (
                <p style={{ fontSize: 'var(--pj-size-small)', color: 'var(--pj-text-secondary)', lineHeight: 1.6, marginTop: 12 }}>
                  {faq.a}
                </p>
              )}
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}

function BottomCTA() {
  const router = useRouter();

  return (
    <div className="pj-section" style={{ textAlign: 'center' }}>
      <ScrollReveal>
        <h2 style={{ fontSize: 'var(--pj-size-h2)', fontWeight: 800, color: 'var(--pj-text)', marginBottom: 8, letterSpacing: '-0.01em' }}>
          Ready to try it?
        </h2>
        <p style={{ fontSize: 'var(--pj-size-small)', color: 'var(--pj-text-tertiary)', marginBottom: 24, lineHeight: 1.6 }}>
          Browse live streams or list your business — it takes 60 seconds.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', maxWidth: 440, margin: '0 auto' }}>
          <button className="pj-btn-primary" style={{ minWidth: 180, padding: '18px 24px', fontSize: 16 }} onClick={() => router.push('/pjazza/discover')} data-testid="button-start-shopping-bottom">
            <span>Start Shopping</span>
            <ArrowRight size={18} strokeWidth={2.5} />
          </button>
          <button className="pj-btn-secondary" style={{ minWidth: 160, padding: '16px 24px' }} onClick={() => router.push('/pjazza/business/onboard')} data-testid="button-list-business-bottom">
            List Your Business
          </button>
        </div>
      </ScrollReveal>
    </div>
  );
}

export default function HowItWorks() {
  return (
    <PjAppShell>
    <div className="pj-safe-bottom" style={{ minHeight: '100vh', background: 'var(--pj-black)' }}>
      <PageHero />
      <div className="pj-divider" />
      <BuyerFlow />
      <div className="pj-divider" />
      <SellerFlow />
      <div className="pj-divider" />
      <EscrowExplainer />
      <div className="pj-divider" />
      <FAQ />
      <div className="pj-divider" />
      <BottomCTA />
      <div style={{ height: 32 }} />
    </div>
    </PjAppShell>
  );
}
