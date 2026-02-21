'use client';

import { useRouter } from 'next/navigation';
import {
  ArrowRight, TrendingUp, Users, Eye, Shield, Clock,
  Utensils, Home, Ship, Car, Heart, Wrench, CheckCircle,
  Zap, DollarSign, Target, Star, ShoppingBag, Smartphone,
  GraduationCap, PawPrint, Compass, MessageSquare
} from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';
import BrandMarquee from '@/components/BrandMarquee';

function PitchHero() {
  const router = useRouter();

  return (
    <div className="pj-section" style={{ paddingTop: 60, paddingBottom: 40 }}>
      <ScrollReveal>
        <div className="pj-live-badge" style={{ marginBottom: 20 }}>
          <span className="pj-live-dot" />
          <span>Founding Partners</span>
        </div>
        <h1 style={{ fontSize: 'var(--pj-size-h1)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.03em', color: 'var(--pj-text)', marginBottom: 16 }}>
          Your shop window
          <br />
          <span style={{ color: 'var(--pj-red)' }}>is now live.</span>
        </h1>
        <p style={{ fontSize: 'var(--pj-size-body)', color: 'var(--pj-text-secondary)', lineHeight: 1.6, marginBottom: 32, maxWidth: 480 }}>
          Whatever your business — restaurant, trade, retail, freelance — show Malta what you do in real time. No ads, no algorithms. Just real customers watching you, live.
        </p>
      </ScrollReveal>

      <ScrollReveal delay={100}>
        <div className="pj-cta-container">
          <button className="pj-btn-primary" style={{ width: '100%', padding: '18px 24px', fontSize: 16 }} onClick={() => router.push('/pjazza/business/dashboard')} data-testid="button-start-free">
            <span>Start Free — 90 Days</span>
            <ArrowRight size={18} strokeWidth={2.5} />
          </button>
          <p style={{ fontSize: 'var(--pj-size-micro)', color: 'var(--pj-text-tertiary)', textAlign: 'center', marginTop: 12 }}>
            No credit card. No commitment. Cancel anytime.
          </p>
        </div>
      </ScrollReveal>
    </div>
  );
}

function ProblemSection() {
  const problems = [
    { text: 'Customers search Google — but never visit your shop', Icon: Target },
    { text: 'Social media posts disappear in 24 hours', Icon: Clock },
    { text: 'You can\'t show the real experience online', Icon: Eye },
    { text: 'Word of mouth only reaches so far on a small island', Icon: MessageSquare },
  ];

  return (
    <div className="pj-section">
      <ScrollReveal>
        <span className="pj-label" style={{ display: 'block', marginBottom: 8 }}>THE PROBLEM</span>
        <h2 style={{ fontSize: 'var(--pj-size-h2)', fontWeight: 700, color: 'var(--pj-text)', marginBottom: 24, letterSpacing: '-0.01em' }}>
          Malta is small. But your reach is smaller.
        </h2>
      </ScrollReveal>

      <div className="pj-pitch-grid">
        {problems.map((p, i) => (
          <ScrollReveal key={i} delay={i * 80}>
            <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', padding: '12px 0' }}>
              <div style={{ width: 40, height: 40, borderRadius: 'var(--pj-radius-md)', background: 'var(--pj-red-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <p.Icon size={18} strokeWidth={2} style={{ color: 'var(--pj-red)' }} />
              </div>
              <p style={{ fontSize: 'var(--pj-size-body)', color: 'var(--pj-text-secondary)', lineHeight: 1.6, paddingTop: 8 }}>{p.text}</p>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}

function SolutionSection() {
  const features = [
    { Icon: Eye, title: 'Go live in 60 seconds', desc: 'Point your phone. Show your product, skill, or space. Start selling.' },
    { Icon: Users, title: 'Instant audience', desc: 'Every buyer browsing PJAZZA sees your stream. No followers needed.' },
    { Icon: Shield, title: 'Escrow payments', desc: 'Get paid securely. Customers buy with complete confidence.' },
    { Icon: Zap, title: 'Real-time chat & offers', desc: 'Negotiate live. Close deals while they\'re excited.' },
  ];

  return (
    <div className="pj-section">
      <ScrollReveal>
        <span className="pj-label" style={{ display: 'block', marginBottom: 8 }}>THE SOLUTION</span>
        <h2 style={{ fontSize: 'var(--pj-size-h2)', fontWeight: 700, color: 'var(--pj-text)', marginBottom: 24, letterSpacing: '-0.01em' }}>
          Your storefront — live to all of Malta.
        </h2>
      </ScrollReveal>

      <div className="pj-pitch-grid">
        {features.map((f, i) => (
          <ScrollReveal key={i} delay={i * 80}>
            <div className="pj-card" style={{ padding: 20, height: '100%' }}>
              <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <div style={{ width: 40, height: 40, borderRadius: 'var(--pj-radius-md)', background: 'var(--pj-surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <f.Icon size={18} strokeWidth={2} style={{ color: 'var(--pj-text)' }} />
                </div>
                <div>
                  <h3 style={{ fontSize: 'var(--pj-size-body)', fontWeight: 700, color: 'var(--pj-text)', marginBottom: 4 }}>{f.title}</h3>
                  <p style={{ fontSize: 'var(--pj-size-small)', color: 'var(--pj-text-tertiary)', lineHeight: 1.5 }}>{f.desc}</p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}

function ProofSection() {
  const metrics = [
    { value: '€540', label: 'avg revenue per session', sub: 'Restaurant, 20 min' },
    { value: '€420', label: 'jobs booked per stream', sub: 'Plumber, 15 min' },
    { value: '12x', label: 'higher conversion', sub: 'vs social media posts' },
  ];

  return (
    <div className="pj-section">
      <ScrollReveal>
        <span className="pj-label" style={{ display: 'block', marginBottom: 8 }}>THE PROOF</span>
        <h2 style={{ fontSize: 'var(--pj-size-h2)', fontWeight: 700, color: 'var(--pj-text)', marginBottom: 24, letterSpacing: '-0.01em' }}>
          Numbers that matter.
        </h2>
      </ScrollReveal>

      <div className="pj-grid-cards">
        {metrics.map((m, i) => (
          <ScrollReveal key={i} delay={i * 80}>
            <div className="pj-card" style={{ padding: 20 }}>
              <span className="pj-mono" style={{ fontSize: 'var(--pj-size-h1)', fontWeight: 800, color: 'var(--pj-text)', display: 'block', marginBottom: 4 }}>{m.value}</span>
              <p style={{ fontSize: 'var(--pj-size-small)', fontWeight: 600, color: 'var(--pj-text-secondary)', marginBottom: 2 }}>{m.label}</p>
              <p style={{ fontSize: 'var(--pj-size-micro)', color: 'var(--pj-text-tertiary)' }}>{m.sub}</p>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}

function IndustrySection() {
  const industries = [
    { Icon: Utensils, name: 'Restaurants & Cafes', example: 'Show tonight\'s specials live' },
    { Icon: Home, name: 'Real Estate', example: 'Live property tours' },
    { Icon: Ship, name: 'Yacht Charters', example: 'Walk the deck before they book' },
    { Icon: Car, name: 'Car Dealers', example: 'Live walkarounds + condition checks' },
    { Icon: Wrench, name: 'Tradespeople', example: 'Prove your skills on camera' },
    { Icon: Users, name: 'Freelancers', example: 'Showcase portfolio & skills live' },
    { Icon: Heart, name: 'Wellness & Spas', example: 'Tour facilities in real time' },
    { Icon: ShoppingBag, name: 'Fashion & Retail', example: 'Live styling & new arrivals' },
    { Icon: Smartphone, name: 'Electronics & Tech', example: 'Live product demos & unboxings' },
    { Icon: Compass, name: 'Tourism & Tours', example: 'Preview excursions & experiences' },
    { Icon: GraduationCap, name: 'Education', example: 'Sample lessons & class tours' },
    { Icon: PawPrint, name: 'Pets & Animals', example: 'Meet pets on camera before buying' },
  ];

  return (
    <div className="pj-section">
      <ScrollReveal>
        <span className="pj-label" style={{ display: 'block', marginBottom: 8 }}>12 SECTORS</span>
        <h2 style={{ fontSize: 'var(--pj-size-h2)', fontWeight: 700, color: 'var(--pj-text)', marginBottom: 24, letterSpacing: '-0.01em' }}>
          Built for every industry in Malta.
        </h2>
      </ScrollReveal>

      <div className="pj-grid-2">
        {industries.map((ind, i) => (
          <ScrollReveal key={i} delay={i * 40}>
            <div className="pj-card pj-touch" style={{ padding: 16, height: '100%' }}>
              <ind.Icon size={20} strokeWidth={2} style={{ color: 'var(--pj-red)', marginBottom: 12 }} />
              <h3 style={{ fontSize: 'var(--pj-size-small)', fontWeight: 700, color: 'var(--pj-text)', marginBottom: 4 }}>{ind.name}</h3>
              <p style={{ fontSize: 'var(--pj-size-micro)', color: 'var(--pj-text-tertiary)', lineHeight: 1.4 }}>{ind.example}</p>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}

function PricingSection() {
  return (
    <div className="pj-section">
      <ScrollReveal>
        <span className="pj-label" style={{ display: 'block', marginBottom: 8 }}>PRICING</span>
        <h2 style={{ fontSize: 'var(--pj-size-h2)', fontWeight: 700, color: 'var(--pj-text)', marginBottom: 24, letterSpacing: '-0.01em' }}>
          Simple. Transparent. Fair.
        </h2>
      </ScrollReveal>

      <ScrollReveal delay={80}>
        <div style={{ maxWidth: 560 }}>
          <div className="pj-card" style={{ padding: 24, borderColor: 'var(--pj-red-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <Star size={16} fill="#D4A574" style={{ color: '#D4A574' }} />
              <span style={{ fontSize: 'var(--pj-size-small)', fontWeight: 700, color: 'var(--pj-gold)' }}>Founding Partner</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 8 }}>
              <span className="pj-mono" style={{ fontSize: 'var(--pj-size-h1)', fontWeight: 800, color: 'var(--pj-text)' }}>€0</span>
              <span style={{ fontSize: 'var(--pj-size-small)', color: 'var(--pj-text-tertiary)' }}>for 90 days</span>
            </div>
            <p style={{ fontSize: 'var(--pj-size-small)', color: 'var(--pj-text-secondary)', marginBottom: 20, lineHeight: 1.5 }}>
              Then 5% commission on completed sales only. You pay nothing until you earn.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
              {[
                'Unlimited live streams',
                'Real-time analytics dashboard',
                'Escrow payment processing',
                'Customer chat & offers',
                'Cruise ship schedule alerts',
                'Priority "Founding Partner" badge',
              ].map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <CheckCircle size={14} style={{ color: 'var(--pj-green)', flexShrink: 0 }} />
                  <span style={{ fontSize: 'var(--pj-size-small)', color: 'var(--pj-text-secondary)' }}>{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={160}>
        <div style={{ padding: '24px 0 0', maxWidth: 560 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <DollarSign size={14} style={{ color: 'var(--pj-text-tertiary)' }} />
            <span style={{ fontSize: 'var(--pj-size-xs)', color: 'var(--pj-text-tertiary)' }}>Revenue math</span>
          </div>
          <p style={{ fontSize: 'var(--pj-size-small)', color: 'var(--pj-text-secondary)', lineHeight: 1.6 }}>
            2 streams/week × €200 avg = <span style={{ fontWeight: 700, color: 'var(--pj-text)' }}>€1,600/month</span>
            <br />
            <span style={{ color: 'var(--pj-text-tertiary)', fontSize: 'var(--pj-size-micro)' }}>
              Your cost: €80 commission. Your profit: €1,520.
            </span>
          </p>
        </div>
      </ScrollReveal>
    </div>
  );
}

function FinalCTA() {
  const router = useRouter();

  return (
    <div className="pj-section" style={{ textAlign: 'center' }}>
      <ScrollReveal>
        <h2 style={{ fontSize: 'var(--pj-size-h2)', fontWeight: 800, color: 'var(--pj-text)', marginBottom: 8, letterSpacing: '-0.01em' }}>
          Malta's first 180 businesses get
          <br />
          <span style={{ color: 'var(--pj-gold)' }}>Founding Partner status.</span>
        </h2>
        <p style={{ fontSize: 'var(--pj-size-small)', color: 'var(--pj-text-tertiary)', marginBottom: 24, lineHeight: 1.6 }}>
          Free forever on features. 90-day free trial on commission.
          <br />
          Lock in your position now.
        </p>
        <div className="pj-cta-container" style={{ margin: '0 auto' }}>
          <button className="pj-btn-primary" style={{ width: '100%', padding: '18px 24px', fontSize: 16 }} onClick={() => router.push('/pjazza/business/dashboard')} data-testid="button-claim-spot">
            <span>Claim Your Spot</span>
            <ArrowRight size={18} strokeWidth={2.5} />
          </button>
        </div>
        <p className="pj-mono" style={{ fontSize: 'var(--pj-size-micro)', color: 'var(--pj-text-tertiary)', marginTop: 16 }}>
          142 / 180 spots remaining
        </p>
      </ScrollReveal>
    </div>
  );
}

export default function BusinessOnboard() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--pj-black)' }}>
      <PitchHero />
      <div className="pj-divider" />
      <ProblemSection />
      <div className="pj-divider" />
      <SolutionSection />
      <BrandMarquee />
      <ProofSection />
      <div className="pj-divider" />
      <IndustrySection />
      <div className="pj-divider" />
      <PricingSection />
      <div className="pj-divider" />
      <FinalCTA />
      <div style={{ height: 48 }} />
    </div>
  );
}
