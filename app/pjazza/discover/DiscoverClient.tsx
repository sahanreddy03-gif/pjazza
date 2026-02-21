'use client';

import { useRouter } from 'next/navigation';
import {
  Utensils, Home, Ship, Car, ShoppingBag, Wrench, Heart,
  Star, ChevronRight, Shield, CheckCircle, Eye, ArrowRight, Play,
  TrendingUp, Clock, Users, Flame, Smartphone, GraduationCap,
  PawPrint, Compass, Info, Grid3X3
} from 'lucide-react';
import TopBar from '@/components/TopBar';
import BottomNav from '@/components/BottomNav';
import ScrollReveal from '@/components/ScrollReveal';
import BrandMarquee from '@/components/BrandMarquee';
import type { StreamForList } from '@/src/lib/data';

const heroImg = '/pjazza/images/hero-discover.jpg';
const thumbProperty = '/pjazza/images/thumb-property.jpg';
const thumbYacht = '/pjazza/images/thumb-yacht.jpg';
const thumbCar = '/pjazza/images/thumb-car.jpg';

function HeroSection({ liveCount }: { liveCount: number }) {
  return (
    <div className="pj-image-wash" style={{ position: 'relative', height: '40vh', minHeight: 280, maxHeight: 500 }}>
      <img src={heroImg} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 2 }}>
        <div className="pj-container" style={{ paddingBottom: 28 }}>
          <div className="pj-live-badge" style={{ marginBottom: 12 }}>
            <span className="pj-live-dot" />
            <span>{liveCount} live now</span>
          </div>
          <h1 style={{ fontSize: 'var(--pj-size-h1)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.02em', color: 'var(--pj-text)', marginBottom: 8 }}>
            What's happening
            <br />
            right now
          </h1>
          <p style={{ fontSize: 'var(--pj-size-small)', color: 'var(--pj-text-secondary)', lineHeight: 1.5, maxWidth: 420 }}>
            Live streams across 12 sectors in Malta. Watch, shop, book — all in real time.
          </p>
        </div>
      </div>
    </div>
  );
}

function QuickLinks() {
  const router = useRouter();

  return (
    <ScrollReveal>
      <div className="pj-section-tight" style={{ paddingBottom: 0 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            className="pj-btn-secondary"
            style={{ flex: 1, justifyContent: 'center', gap: 6 }}
            onClick={() => router.push('/pjazza/how-it-works')}
            data-testid="button-link-how"
          >
            <Info size={14} /> How It Works
          </button>
          <button
            className="pj-btn-secondary"
            style={{ flex: 1, justifyContent: 'center', gap: 6 }}
            onClick={() => router.push('/pjazza/sectors')}
            data-testid="button-link-sectors"
          >
            <Grid3X3 size={14} /> All Sectors
          </button>
        </div>
      </div>
    </ScrollReveal>
  );
}

function LiveNowSection({ streams }: { streams: StreamForList[] }) {
  const router = useRouter();

  return (
    <div className="pj-section">
      <ScrollReveal>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <h2 style={{ fontSize: 'var(--pj-size-h2)', fontWeight: 700, color: 'var(--pj-text)', letterSpacing: '-0.01em' }}>
              Live Now
            </h2>
            <p style={{ fontSize: 'var(--pj-size-xs)', color: 'var(--pj-text-tertiary)', marginTop: 2 }}>
              Happening across Malta right now
            </p>
          </div>
          <button className="pj-btn-ghost" style={{ gap: 4 }} onClick={() => router.push('/pjazza/live-shop')} data-testid="button-see-all-live">
            See all <ChevronRight size={14} />
          </button>
        </div>
      </ScrollReveal>

      <div className="pj-stream-grid">
        {streams.map((stream, i) => (
          <ScrollReveal key={i} delay={i * 60}>
            <div
              className="pj-card pj-touch"
              style={{ width: 200, overflow: 'hidden' }}
              onClick={() => stream.slug ? router.push(`/pjazza/live-shop/${stream.slug}`) : router.push('/pjazza/live-shop')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && (stream.slug ? router.push(`/pjazza/live-shop/${stream.slug}`) : router.push('/pjazza/live-shop'))}
              data-testid={`card-live-stream-${i}`}
            >
              <div style={{ position: 'relative', aspectRatio: '16/10', overflow: 'hidden' }}>
                <img src={stream.img} alt={stream.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(transparent 40%, rgba(0,0,0,0.6))' }} />
                <div style={{ position: 'absolute', top: 8, left: 8, display: 'flex', alignItems: 'center', gap: 4, padding: '3px 8px', borderRadius: 'var(--pj-radius-pill)', background: 'var(--pj-red)', fontSize: 9, fontWeight: 700, color: 'white' }}>
                  <span className="pj-live-dot" style={{ background: 'white', width: 4, height: 4 }} />
                  LIVE
                </div>
                <div style={{ position: 'absolute', top: 8, right: 8, display: 'flex', alignItems: 'center', gap: 3, padding: '3px 8px', borderRadius: 'var(--pj-radius-pill)', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', fontSize: 9, fontWeight: 600, color: 'white' }}>
                  <Eye size={10} /> {stream.viewers}
                </div>
                <div style={{ position: 'absolute', bottom: 8, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Play size={14} fill="white" style={{ color: 'white', marginLeft: 2 }} />
                  </div>
                </div>
              </div>
              <div style={{ padding: '12px 14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 2 }}>
                  <span style={{ fontSize: 'var(--pj-size-small)', fontWeight: 700, color: 'var(--pj-text)' }}>{stream.name}</span>
                  <CheckCircle size={12} style={{ color: 'var(--pj-green)', flexShrink: 0 }} />
                </div>
                <p style={{ fontSize: 'var(--pj-size-micro)', color: 'var(--pj-text-tertiary)', marginBottom: 8 }}>
                  {stream.location} · {stream.category}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 'var(--pj-size-micro)', color: 'var(--pj-text-secondary)', display: 'flex', alignItems: 'center', gap: 3 }}>
                    <Star size={10} fill="#D4A574" style={{ color: '#D4A574' }} /> {stream.rating}
                  </span>
                  <span style={{ fontSize: 'var(--pj-size-micro)', fontWeight: 700, color: 'var(--pj-red)', display: 'flex', alignItems: 'center', gap: 3 }}>
                    Watch <ArrowRight size={10} />
                  </span>
                </div>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}

function SuccessStory() {
  return (
    <ScrollReveal>
      <div className="pj-section-tight" style={{ paddingTop: 0 }}>
        <div className="pj-card" style={{ padding: 20, borderColor: 'var(--pj-red-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <TrendingUp size={14} style={{ color: 'var(--pj-red)' }} />
            <span style={{ fontSize: 'var(--pj-size-xs)', fontWeight: 700, color: 'var(--pj-red)', letterSpacing: '0.02em' }}>SUCCESS STORY</span>
          </div>
          <p style={{ fontSize: 'var(--pj-size-h3)', fontWeight: 700, color: 'var(--pj-text)', lineHeight: 1.4, marginBottom: 12 }}>
            Joe the Plumber went live for 15 minutes.
            <br />
            <span style={{ color: 'var(--pj-gold)' }}>22 viewers. 3 new clients. €420 in jobs booked.</span>
          </p>
          <p style={{ fontSize: 'var(--pj-size-xs)', color: 'var(--pj-text-tertiary)' }}>
            Birkirkara · Last Thursday · Home Services
          </p>
        </div>
      </div>
    </ScrollReveal>
  );
}

function CategorySection() {
  const router = useRouter();

  const categories = [
    { Icon: Utensils, label: 'Dining' },
    { Icon: Home, label: 'Property' },
    { Icon: Ship, label: 'Yachts' },
    { Icon: Car, label: 'Cars' },
    { Icon: Wrench, label: 'Services' },
    { Icon: Users, label: 'Freelancers' },
    { Icon: Heart, label: 'Wellness' },
    { Icon: ShoppingBag, label: 'Fashion' },
    { Icon: Smartphone, label: 'Electronics' },
    { Icon: Compass, label: 'Tourism' },
    { Icon: GraduationCap, label: 'Education' },
    { Icon: PawPrint, label: 'Pets' },
  ];

  return (
    <ScrollReveal>
      <div className="pj-section-tight">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h2 style={{ fontSize: 'var(--pj-size-h2)', fontWeight: 700, color: 'var(--pj-text)', letterSpacing: '-0.01em' }}>
            Browse by category
          </h2>
          <button className="pj-btn-ghost" style={{ gap: 4 }} onClick={() => router.push('/pjazza/sectors')} data-testid="button-all-categories">
            All <ChevronRight size={14} />
          </button>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {categories.map((cat, i) => (
            <button key={i} className="pj-pill" data-testid={`button-category-${cat.label.toLowerCase()}`}>
              <cat.Icon size={14} strokeWidth={2} style={{ color: 'var(--pj-text-secondary)' }} />
              {cat.label}
            </button>
          ))}
        </div>
      </div>
    </ScrollReveal>
  );
}

function HowItWorks() {
  const router = useRouter();

  const steps = [
    { num: '01', title: 'Browse live streams', desc: 'Watch real businesses in action across all 12 sectors in Malta.' },
    { num: '02', title: 'Chat and negotiate', desc: 'Ask questions in real time. Request a closer look. Make an offer directly.' },
    { num: '03', title: 'Buy with escrow', desc: 'Your money is held safely until you confirm delivery. Every transaction protected.' },
  ];

  return (
    <div className="pj-section">
      <ScrollReveal>
        <span className="pj-label" style={{ display: 'block', marginBottom: 8 }}>HOW IT WORKS</span>
        <h2 style={{ fontSize: 'var(--pj-size-h2)', fontWeight: 700, color: 'var(--pj-text)', marginBottom: 24, letterSpacing: '-0.01em' }}>
          Three steps. Total confidence.
        </h2>
      </ScrollReveal>

      <div className="pj-grid-cards">
        {steps.map((step, i) => (
          <ScrollReveal key={i} delay={i * 80}>
            <div className="pj-card" style={{ padding: 20, display: 'flex', gap: 16, height: '100%' }}>
              <span className="pj-mono" style={{ fontSize: 'var(--pj-size-h2)', fontWeight: 800, color: 'var(--pj-red)', lineHeight: 1, flexShrink: 0 }}>{step.num}</span>
              <div>
                <h3 style={{ fontSize: 'var(--pj-size-body)', fontWeight: 700, color: 'var(--pj-text)', marginBottom: 4 }}>{step.title}</h3>
                <p style={{ fontSize: 'var(--pj-size-small)', color: 'var(--pj-text-tertiary)', lineHeight: 1.5 }}>{step.desc}</p>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>

      <ScrollReveal delay={260}>
        <div style={{ marginTop: 16, textAlign: 'center' }}>
          <button className="pj-btn-ghost" style={{ color: 'var(--pj-red)', gap: 6 }} onClick={() => router.push('/pjazza/how-it-works')} data-testid="button-learn-how-works">
            Full guide <ArrowRight size={14} />
          </button>
        </div>
      </ScrollReveal>
    </div>
  );
}

function TrustSection() {
  const features = [
    { Icon: Shield, title: 'Escrow Protection', desc: 'Money held safely until delivery confirmed' },
    { Icon: CheckCircle, title: 'Verified Businesses', desc: 'Every seller is ID-verified and reviewed' },
    { Icon: Eye, title: 'Live Video Proof', desc: 'See exactly what you\'re getting, in real time' },
  ];

  return (
    <div className="pj-section">
      <ScrollReveal>
        <span className="pj-label" style={{ display: 'block', marginBottom: 8 }}>TRUST & SAFETY</span>
        <h2 style={{ fontSize: 'var(--pj-size-h2)', fontWeight: 700, color: 'var(--pj-text)', marginBottom: 24, letterSpacing: '-0.01em' }}>
          Every transaction protected.
        </h2>
      </ScrollReveal>

      <div className="pj-grid-cards">
        {features.map((f, i) => (
          <ScrollReveal key={i} delay={i * 80}>
            <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', padding: '12px 0' }}>
              <div style={{ width: 40, height: 40, borderRadius: 'var(--pj-radius-md)', background: 'var(--pj-surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <f.Icon size={18} strokeWidth={2} style={{ color: 'var(--pj-green)' }} />
              </div>
              <div>
                <h3 style={{ fontSize: 'var(--pj-size-body)', fontWeight: 700, color: 'var(--pj-text)', marginBottom: 2 }}>{f.title}</h3>
                <p style={{ fontSize: 'var(--pj-size-small)', color: 'var(--pj-text-tertiary)', lineHeight: 1.5 }}>{f.desc}</p>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}

function HighValueSection() {
  const items = [
    { title: 'Sea View 2-Bed Apartment', location: 'Sliema', price: '€1,350/mo', img: thumbProperty, badge: 'Live Tour', sector: 'Property' },
    { title: '40ft Catamaran Charter', location: 'Grand Harbour', price: '€1,200/day', img: thumbYacht, badge: 'Live Tour', sector: 'Yacht' },
    { title: '2024 VW Polo 1.0 TSI', location: '12,000 km', price: '€18,500', img: thumbCar, badge: 'Walkaround', sector: 'Automotive' },
  ];

  return (
    <div className="pj-section">
      <ScrollReveal>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <h2 style={{ fontSize: 'var(--pj-size-h2)', fontWeight: 700, color: 'var(--pj-text)', letterSpacing: '-0.01em' }}>
              High-value listings
            </h2>
            <p style={{ fontSize: 'var(--pj-size-xs)', color: 'var(--pj-text-tertiary)', marginTop: 2 }}>
              Property · Yachts · Cars — escrow protected
            </p>
          </div>
        </div>
      </ScrollReveal>

      <div className="pj-listing-grid">
        {items.map((item, i) => (
          <ScrollReveal key={i} delay={i * 80}>
            <div className="pj-card pj-touch" style={{ overflow: 'hidden' }} data-testid={`card-listing-${i}`}>
              <div style={{ display: 'flex' }}>
                <div style={{ width: 120, flexShrink: 0, position: 'relative' }}>
                  <img src={item.img} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover', minHeight: 100 }} />
                  <div style={{ position: 'absolute', top: 8, left: 8, fontSize: 8, fontWeight: 700, color: 'white', background: 'var(--pj-red)', padding: '2px 6px', borderRadius: 'var(--pj-radius-pill)', display: 'flex', alignItems: 'center', gap: 3 }}>
                    <span className="pj-live-dot" style={{ width: 4, height: 4, background: 'white' }} /> {item.badge}
                  </div>
                </div>
                <div style={{ padding: 14, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <span style={{ fontSize: 'var(--pj-size-micro)', color: 'var(--pj-text-tertiary)', marginBottom: 2 }}>{item.sector}</span>
                  <h3 style={{ fontSize: 'var(--pj-size-small)', fontWeight: 700, color: 'var(--pj-text)', marginBottom: 4 }}>{item.title}</h3>
                  <p style={{ fontSize: 'var(--pj-size-micro)', color: 'var(--pj-text-tertiary)', marginBottom: 8 }}>{item.location}</p>
                  <span className="pj-mono" style={{ fontSize: 'var(--pj-size-h3)', fontWeight: 800, color: 'var(--pj-text)' }}>{item.price}</span>
                </div>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}

function CrowdIntelligence() {
  const venues = [
    { name: "Ta' Kris", percent: 78, status: 'Busy', Icon: Flame, color: 'var(--pj-red)', tip: 'Best before 6:30 PM' },
    { name: 'The Chophouse', percent: 52, status: 'Moderate', Icon: TrendingUp, color: 'var(--pj-gold)', tip: 'Happy hour until 7 PM' },
    { name: 'Café del Mar', percent: 18, status: 'Quiet', Icon: Clock, color: 'var(--pj-green)', tip: 'Sunset seats available' },
  ];

  return (
    <div className="pj-section">
      <ScrollReveal>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <Users size={16} style={{ color: 'var(--pj-text-tertiary)' }} />
          <h2 style={{ fontSize: 'var(--pj-size-h2)', fontWeight: 700, color: 'var(--pj-text)', letterSpacing: '-0.01em' }}>
            Crowd intelligence
          </h2>
        </div>
        <p style={{ fontSize: 'var(--pj-size-xs)', color: 'var(--pj-text-tertiary)', marginBottom: 20 }}>
          Real-time. Know before you go.
        </p>
      </ScrollReveal>

      <div className="pj-crowd-grid">
        {venues.map((v, i) => (
          <ScrollReveal key={i} delay={i * 60}>
            <div className="pj-card" style={{ padding: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <v.Icon size={14} style={{ color: v.color }} />
                  <span style={{ fontSize: 'var(--pj-size-small)', fontWeight: 700, color: 'var(--pj-text)' }}>{v.name}</span>
                </div>
                <span className="pj-mono" style={{ fontSize: 'var(--pj-size-h3)', fontWeight: 800, color: v.color }}>{v.percent}%</span>
              </div>
              <div style={{ height: 4, borderRadius: 2, background: 'var(--pj-surface-3)', marginBottom: 8, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${v.percent}%`, background: v.color, borderRadius: 2 }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 'var(--pj-size-xs)', fontWeight: 600, color: 'var(--pj-text-secondary)' }}>{v.status}</span>
                <span style={{ fontSize: 'var(--pj-size-micro)', color: 'var(--pj-text-tertiary)' }}>{v.tip}</span>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}

export default function DiscoverClient({ initialStreams, liveCount }: { initialStreams: StreamForList[]; liveCount: number }) {
  return (
    <div className="pj-safe-bottom" style={{ minHeight: '100vh', background: 'var(--pj-black)' }}>
      <TopBar />
      <HeroSection liveCount={liveCount} />
      <QuickLinks />
      <LiveNowSection streams={initialStreams} />
      <SuccessStory />
      <div className="pj-divider" />
      <CategorySection />
      <BrandMarquee />
      <HowItWorks />
      <div className="pj-divider" />
      <TrustSection />
      <div className="pj-divider" />
      <HighValueSection />
      <div className="pj-divider" />
      <CrowdIntelligence />
      <div style={{ height: 32 }} />
      <BottomNav />
    </div>
  );
}
