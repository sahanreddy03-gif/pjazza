'use client';

import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowRight, Play, Eye, Star, CheckCircle, Shield,
  Utensils, Home, Ship, Car, Heart, Wrench,
  ShoppingBag, Smartphone, GraduationCap, PawPrint, Compass,
  Users, Video, MessageSquare, ChevronRight, Briefcase, Quote
} from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';
import TiltCard from '@/components/TiltCard';
import MagneticButton from '@/components/MagneticButton';
import AmbientHero from '@/components/AmbientHero';
import LiveCount from '@/components/LiveCount';
import { useViewTransition } from '@/src/hooks/useViewTransition';
import { useHeroGSAP } from '@/src/hooks/useHeroGSAP';
import { haptic, ctaFeedback } from '@/src/utils/haptic';
import type { StreamForList } from '@/src/lib/data';

const BrandMarquee = dynamic(() => import('@/components/BrandMarquee'), { ssr: false });
const FeaturedStack = dynamic(() => import('@/components/FeaturedStack'), { ssr: false });
const HowItWorksPinned = dynamic(() => import('@/components/HowItWorksPinned'), { ssr: false });

const heroImg = '/pjazza/images/hero-malta.jpg';
const thumbProperty = '/pjazza/images/thumb-property.jpg';
const thumbCar = '/pjazza/images/thumb-car.jpg';
const thumbYacht = '/pjazza/images/thumb-yacht.jpg';
const thumbWellness = '/pjazza/images/thumb-wellness.jpg';

const imgElectrician = '/pjazza/images/people/electrician.jpg';
const imgYoga = '/pjazza/images/people/yoga.jpg';
const imgScuba = '/pjazza/images/people/scuba.jpg';
const imgLawyer = '/pjazza/images/people/lawyer.jpg';
const imgChef = '/pjazza/images/people/chef.jpg';
const imgHairstylist = '/pjazza/images/people/hairstylist.jpg';
const heroVideo = '/pjazza/video/woman-live-stream-and-social-media-with-hands-ci-2025-12-17-14-25-07-utc.mov';

function Hero({ liveCount, businessCount }: { liveCount: number; businessCount?: number }) {
  const { push } = useViewTransition();
  const { heroRef, imgWrapRef, contentRef, wordsRef, subRef, ctasRef } = useHeroGSAP();
  const router = useRouter();
  const [showVideo, setShowVideo] = useState(false);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduceMotion) setShowVideo(true);
  }, []);

  // Prefetch key routes so first navigation feels instant
  useEffect(() => {
    router.prefetch('/pjazza/live-shop');
    router.prefetch('/pjazza/discover');
    router.prefetch('/pjazza/business/onboard');
    router.prefetch('/pjazza/business/dashboard');
  }, [router]);

  useEffect(() => {
    if (!showVideo) return;
    const defer = window.requestIdleCallback
      ? (cb: () => void) => window.requestIdleCallback(cb, { timeout: 2200 })
      : (cb: () => void) => window.setTimeout(cb, 400);
    defer(() => setVideoSrc(heroVideo));
  }, [showVideo]);

  return (
    <AmbientHero>
      <div ref={heroRef} className="pj-image-wash pj-hero-gsap" style={{ position: 'relative', minHeight: '75vh', display: 'flex', alignItems: 'flex-end' }}>
        <div ref={imgWrapRef} style={{ position: 'absolute', inset: 0 }}>
          {showVideo ? (
            <video
              src={heroVideo}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster={heroImg}
              style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }}
            />
          ) : (
            <Image
              src={heroImg}
              alt=""
              fill
              sizes="100vw"
              priority
              style={{ objectFit: 'cover', opacity: 0.45 }}
            />
          )}
        </div>
        <div ref={contentRef} style={{ position: 'relative', zIndex: 2, width: '100%' }}>
          <div className="pj-container" style={{ paddingBottom: 48, paddingTop: 80 }}>
            <div className="pj-live-badge-lg" style={{ marginBottom: 20 }}>
              <span className="pj-live-dot" style={{ width: 8, height: 8 }} />
              <span>{liveCount} live now across Malta</span>
            </div>
            <h1
              ref={wordsRef}
              style={{
                fontSize: 'var(--pj-size-hero)',
                fontWeight: 800,
                lineHeight: 0.95,
                letterSpacing: '-0.03em',
                color: 'var(--pj-text)',
                marginBottom: 20,
              }}
            >
              <span style={{ display: 'block' }}>
                <span className="pj-hero-word">Watch</span>{' '}
                <span className="pj-hero-word">it</span>{' '}
                <span className="pj-hero-word">live.</span>
              </span>
              <span style={{ display: 'block' }}>
                <span className="pj-hero-word">Buy</span>{' '}
                <span className="pj-hero-word">it</span>
              </span>
              <span style={{ display: 'block' }}>
                <span className="pj-hero-word pj-hero-accent">now.</span>
              </span>
            </h1>
            <p
              ref={subRef}
              style={{
                fontSize: 'var(--pj-size-h3)',
                lineHeight: 1.5,
                color: 'var(--pj-text-secondary)',
                maxWidth: 440,
                marginBottom: 16,
              }}
            >
              Malta&apos;s live shopping marketplace. See every product, service, and property in real time before you buy.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 36, fontSize: 'var(--pj-size-small)', color: 'var(--pj-text-tertiary)' }}>
              <span><strong className="pj-mono" style={{ color: 'var(--pj-text)' }}>{businessCount ?? 60}+</strong> businesses</span>
              <span>·</span>
              <span><strong className="pj-mono" style={{ color: 'var(--pj-text)' }}>12</strong> sectors</span>
              <span>·</span>
              <span>Escrow protected</span>
            </div>
            <div ref={ctasRef} style={{ display: 'flex', flexWrap: 'wrap', gap: 12, maxWidth: 440 }} className="pj-hero-ctas">
              <MagneticButton
                className="pj-btn-primary pj-btn-cta pj-touch"
                style={{ flex: 1, minWidth: 180, padding: '18px 24px', fontSize: 16 }}
                onClick={() => { ctaFeedback(); push('/pjazza/live-shop'); }}
                data-testid="button-start-shopping"
              >
                <Play size={16} fill="white" style={{ marginRight: 2 }} />
                <span>Shop Live</span>
              </MagneticButton>
              <MagneticButton
                className="pj-btn-secondary pj-touch"
                style={{ flex: 1, minWidth: 160, padding: '16px 24px' }}
                onClick={() => { ctaFeedback(); push('/pjazza/business/onboard'); }}
                data-testid="button-sell-on-pjazza"
              >
                <span>Sell on PJAZZA</span>
              </MagneticButton>
            </div>
            <p style={{ marginTop: 16, fontSize: 'var(--pj-size-small)', color: 'var(--pj-text-tertiary)' }}>
              Questions? <button type="button" onClick={() => push('/pjazza/contact')} className="pj-touch" style={{ background: 'none', border: 'none', color: 'var(--pj-red)', fontWeight: 600, cursor: 'pointer', padding: 0, textDecoration: 'underline' }}>Contact us</button> — we reply within 24 hours.
            </p>
          </div>
        </div>
      </div>
    </AmbientHero>
  );
}

function LiveNowPreview({ streams }: { streams: StreamForList[] }) {
  const { push } = useViewTransition();

  return (
    <div className="pj-section">
      <ScrollReveal>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span className="pj-live-dot" style={{ width: 8, height: 8 }} />
              <h2 style={{ fontSize: 'var(--pj-size-h2)', fontWeight: 700, color: 'var(--pj-text)', letterSpacing: '-0.01em' }}>
                Live Now
              </h2>
            </div>
            <p style={{ fontSize: 'var(--pj-size-small)', color: 'var(--pj-text-tertiary)', marginTop: 2 }}>
              Watch, chat, and buy in real time
            </p>
          </div>
          <button className="pj-btn-ghost" style={{ gap: 4 }} onClick={() => push('/pjazza/live-shop')} data-testid="button-see-all-live">
            See all <ChevronRight size={14} />
          </button>
        </div>
      </ScrollReveal>

      <div className="pj-stream-grid">
        {streams.length === 0 ? (
          <ScrollReveal>
            <div className="pj-card" style={{ padding: 40, textAlign: 'center', minWidth: 200 }}>
              <Video size={40} style={{ color: 'var(--pj-text-muted)', marginBottom: 12, display: 'block', margin: '0 auto 12px' }} />
              <p style={{ fontSize: 'var(--pj-size-body)', fontWeight: 600, color: 'var(--pj-text)', marginBottom: 4 }}>No live streams right now</p>
              <p style={{ fontSize: 'var(--pj-size-small)', color: 'var(--pj-text-tertiary)', marginBottom: 16 }}>Check back soon — new streams go live daily</p>
              <button className="pj-btn-secondary pj-touch" onClick={() => { ctaFeedback(); push('/pjazza/live-shop'); }}>Browse Live Shop</button>
            </div>
          </ScrollReveal>
        ) : streams.map((stream, i) => (
          <ScrollReveal key={i} delay={i * 60}>
            <TiltCard
              className="pj-card pj-card-glow pj-touch"
              style={{ width: 200, overflow: 'hidden', cursor: 'pointer' }}
              onClick={() => { haptic('light'); stream.slug ? push(`/pjazza/live-shop/${stream.slug}`) : push('/pjazza/live-shop'); }}
              role="button"
              tabIndex={0}
              onKeyDown={(e: React.KeyboardEvent) => e.key === 'Enter' && (stream.slug ? push(`/pjazza/live-shop/${stream.slug}`) : push('/pjazza/live-shop'))}
              data-testid={`card-live-stream-${i}`}
            >
              <div style={{ position: 'relative', aspectRatio: '16/10', overflow: 'hidden' }}>
                <img src={stream.img} alt={stream.name} className="pj-card-img-zoom" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(transparent 40%, rgba(0,0,0,0.6))' }} />
                <div style={{ position: 'absolute', top: 8, left: 8, display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 'var(--pj-radius-pill)', background: 'var(--pj-red)', fontSize: 11, fontWeight: 700, color: 'white' }}>
                  <span className="pj-live-dot" style={{ background: 'white', width: 5, height: 5 }} />
                  LIVE
                </div>
                <div style={{ position: 'absolute', top: 8, right: 8, display: 'flex', alignItems: 'center', gap: 3, padding: '4px 10px', borderRadius: 'var(--pj-radius-pill)', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', fontSize: 11, fontWeight: 600, color: 'white' }}>
                  <Eye size={11} /> {stream.viewers}
                </div>
                <div style={{ position: 'absolute', bottom: 8, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Play size={16} fill="white" style={{ color: 'white', marginLeft: 2 }} />
                  </div>
                </div>
              </div>
              <div style={{ padding: '12px 14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 2, minWidth: 0 }}>
                  <span className="pj-card-stream-name" style={{ fontSize: 'var(--pj-size-body)', fontWeight: 700, color: 'var(--pj-text)' }}>{stream.name}</span>
                  <CheckCircle size={13} style={{ color: 'var(--pj-green)', flexShrink: 0 }} />
                </div>
                <p className="pj-card-stream-name" style={{ fontSize: 'var(--pj-size-small)', color: 'var(--pj-text-tertiary)', marginBottom: 8 }}>
                  {stream.location} · {stream.category}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 'var(--pj-size-small)', color: 'var(--pj-text-secondary)', display: 'flex', alignItems: 'center', gap: 3 }}>
                    <Star size={12} fill="#D4A574" style={{ color: '#D4A574' }} /> {stream.rating}
                  </span>
                  <span style={{ fontSize: 'var(--pj-size-small)', fontWeight: 700, color: 'var(--pj-red)', display: 'flex', alignItems: 'center', gap: 3 }}>
                    Watch <ArrowRight size={12} />
                  </span>
                </div>
              </div>
            </TiltCard>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}

function AllSectors() {
  const { push } = useViewTransition();

  const sectors = [
    { Icon: Utensils, name: 'Food & Dining', color: 'var(--pj-red)' },
    { Icon: Home, name: 'Property', color: 'var(--pj-gold)' },
    { Icon: Car, name: 'Cars & Auto', color: 'var(--pj-text-secondary)' },
    { Icon: Ship, name: 'Yachts & Marine', color: 'var(--pj-text-secondary)' },
    { Icon: Wrench, name: 'Home Services', color: 'var(--pj-green)' },
    { Icon: Users, name: 'Freelancers', color: 'var(--pj-gold)' },
    { Icon: Heart, name: 'Health & Wellness', color: 'var(--pj-red)' },
    { Icon: ShoppingBag, name: 'Fashion & Retail', color: 'var(--pj-text-secondary)' },
    { Icon: Smartphone, name: 'Electronics', color: 'var(--pj-text-secondary)' },
    { Icon: Compass, name: 'Tourism', color: 'var(--pj-gold)' },
    { Icon: GraduationCap, name: 'Education', color: 'var(--pj-green)' },
    { Icon: PawPrint, name: 'Pets & Animals', color: 'var(--pj-red)' },
  ];

  return (
    <div className="pj-section">
      <ScrollReveal>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h2 style={{ fontSize: 'var(--pj-size-h2)', fontWeight: 700, color: 'var(--pj-text)', letterSpacing: '-0.01em' }}>
            12 Sectors
          </h2>
          <button className="pj-btn-ghost" style={{ gap: 4 }} onClick={() => push('/pjazza/sectors')} data-testid="button-all-sectors">
            View all <ChevronRight size={14} />
          </button>
        </div>
      </ScrollReveal>

      <div className="pj-grid-2">
        {sectors.map((s, i) => (
          <ScrollReveal key={i} delay={i * 30}>
            <TiltCard
              className="pj-card pj-touch"
              style={{ padding: 16, height: '100%', cursor: 'pointer' }}
              onClick={() => push('/pjazza/sectors')}
              data-testid={`card-sector-${s.name.toLowerCase().replace(/[^a-z]/g, '-')}`}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 'var(--pj-radius-md)',
                    background: 'var(--pj-surface-2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <s.Icon size={20} strokeWidth={2} style={{ color: s.color }} />
                </div>
                <h3 style={{ fontSize: 'var(--pj-size-body)', fontWeight: 700, color: 'var(--pj-text)' }}>
                  {s.name}
                </h3>
              </div>
            </TiltCard>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}

function StatsBar({ businessCount = 60 }: { businessCount?: number }) {
  return (
    <ScrollReveal>
      <div className="pj-section-tight" style={{ paddingTop: 0, paddingBottom: 0 }}>
        <div className="pj-stats-grid" style={{ gap: 1 }}>
          {[
            { value: <LiveCount target={2400} suffix="+" />, label: 'watching now' },
            { value: `${businessCount}+`, label: 'businesses' },
            { value: '12', label: 'sectors' },
            { value: 'Escrow', label: 'protected' },
          ].map((stat, i) => (
            <div
              key={i}
              className="pj-float"
              style={{
                textAlign: 'center',
                padding: 18,
                background: 'var(--pj-surface-1)',
                borderRadius: i === 0 ? '12px 0 0 12px' : i === 3 ? '0 12px 12px 0' : '0',
                borderLeft: i > 0 ? '1px solid var(--pj-border)' : 'none',
                animationDelay: `${i * 0.15}s`,
              }}
              data-testid={`text-stat-${stat.label.replace(/\s/g, '-')}`}
            >
              <div className="pj-mono" style={{ fontSize: 'var(--pj-size-h3)', fontWeight: 700, color: 'var(--pj-text)', marginBottom: 2 }}>
                {stat.value}
              </div>
              <div style={{ fontSize: 'var(--pj-size-small)', color: 'var(--pj-text-tertiary)' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </ScrollReveal>
  );
}

function PeoplePreview() {
  const { push } = useViewTransition();

  const featured = [
    { name: 'Mark Borg', role: 'Electrician', rating: 4.9, liveNow: true, topRated: true, img: imgElectrician },
    { name: 'Elena Vella', role: 'Yoga Instructor', rating: 5.0, liveNow: false, topRated: true, img: imgYoga },
    { name: 'Pierre Camilleri', role: 'Scuba Instructor', rating: 4.9, liveNow: true, topRated: true, img: imgScuba },
    { name: 'Dr. Sarah Mifsud', role: 'Lawyer', rating: 4.8, liveNow: false, topRated: true, img: imgLawyer },
    { name: 'Maria Grech', role: 'Cooking Teacher', rating: 4.8, liveNow: false, topRated: false, img: imgChef },
    { name: 'Anna Cassar', role: 'Hair Stylist', rating: 4.7, liveNow: true, topRated: false, img: imgHairstylist },
  ];

  return (
    <div className="pj-section">
      <ScrollReveal>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h2 style={{ fontSize: 'var(--pj-size-h2)', fontWeight: 700, color: 'var(--pj-text)', letterSpacing: '-0.01em' }}>
            Hire Anyone
          </h2>
          <button className="pj-btn-ghost" style={{ gap: 4 }} onClick={() => push('/pjazza/people')} data-testid="button-all-people">
            View all <ChevronRight size={14} />
          </button>
        </div>
      </ScrollReveal>

      <div className="pj-stream-grid">
        {featured.map((person, i) => (
          <ScrollReveal key={i} delay={i * 50}>
            <TiltCard
              className="pj-card pj-touch"
              style={{ width: 160, padding: 16, textAlign: 'center', cursor: 'pointer' }}
              onClick={() => push('/pjazza/people')}
              data-testid={`card-person-preview-${i}`}
            >
              <div style={{ position: 'relative', display: 'inline-block', marginBottom: 10 }}>
                <img
                  src={person.img}
                  alt={person.name}
                  className={person.liveNow ? 'pj-live-ring' : ''}
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: person.liveNow ? '2.5px solid var(--pj-red)' : person.topRated ? '2.5px solid var(--pj-gold)' : '2.5px solid var(--pj-border)',
                  }}
                />
                {person.liveNow && (
                  <div style={{
                    position: 'absolute', bottom: -2, right: -2,
                    width: 18, height: 18, borderRadius: '50%',
                    background: 'var(--pj-red)', border: '2.5px solid var(--pj-black)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Play size={8} fill="white" strokeWidth={0} style={{ color: 'white', marginLeft: 1 }} />
                  </div>
                )}
              </div>
              <h3 style={{ fontSize: 'var(--pj-size-body)', fontWeight: 700, color: 'var(--pj-text)', marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {person.name}
              </h3>
              <p style={{ fontSize: 'var(--pj-size-small)', color: 'var(--pj-text-secondary)', fontWeight: 600, marginBottom: 6, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {person.role}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                <Star size={12} fill="#D4A574" style={{ color: '#D4A574' }} />
                <span style={{ fontSize: 'var(--pj-size-small)', color: 'var(--pj-gold)', fontWeight: 600 }}>{person.rating}</span>
              </div>
            </TiltCard>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}

function Testimonials() {
  const items = [
    { quote: 'Finally — I can show customers exactly what they\'re getting. No more misunderstandings.', author: 'Maria G.', role: 'Restaurant owner, Sliema' },
    { quote: 'Sold a €4,200 watch in 12 minutes. Live video made the difference.', author: 'David M.', role: 'Luxury retail, Valletta' },
    { quote: 'Clients love seeing the property live before they fly over. Saves everyone time.', author: 'Sarah K.', role: 'Property agent' },
  ];

  return (
    <div className="pj-section" style={{ paddingTop: 48, paddingBottom: 48 }}>
      <ScrollReveal>
        <span className="pj-label" style={{ display: 'block', marginBottom: 8 }}>TRUSTED BY BUSINESSES</span>
        <h2 style={{ fontSize: 'var(--pj-size-h1)', fontWeight: 800, color: 'var(--pj-text)', marginBottom: 40, letterSpacing: '-0.02em' }}>
          What sellers are saying
        </h2>
      </ScrollReveal>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {items.map((t, i) => (
          <ScrollReveal key={i} delay={i * 80}>
            <div className="pj-card" style={{ padding: 24, borderColor: 'var(--pj-border-hover)' }}>
              <Quote size={24} style={{ color: 'var(--pj-red)', opacity: 0.5, marginBottom: 12 }} />
              <p style={{ fontSize: 'var(--pj-size-body)', color: 'var(--pj-text-secondary)', lineHeight: 1.7, marginBottom: 16 }}>
                &ldquo;{t.quote}&rdquo;
              </p>
              <div>
                <span style={{ fontSize: 'var(--pj-size-small)', fontWeight: 700, color: 'var(--pj-text)' }}>{t.author}</span>
                <span style={{ fontSize: 'var(--pj-size-small)', color: 'var(--pj-text-tertiary)' }}> · {t.role}</span>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}

function B2BEnterprise() {
  const { push } = useViewTransition();
  return (
    <div className="pj-section" style={{ paddingTop: 48, paddingBottom: 48 }}>
      <ScrollReveal>
        <span className="pj-label" style={{ display: 'block', marginBottom: 8 }}>B2B & ENTERPRISE</span>
        <h2 style={{ fontSize: 'var(--pj-size-h1)', fontWeight: 800, color: 'var(--pj-text)', marginBottom: 16, letterSpacing: '-0.02em' }}>
          Built for brands.
          <br />
          <span style={{ color: 'var(--pj-gold)' }}>Retail, hospitality & more.</span>
        </h2>
        <p style={{ fontSize: 'var(--pj-size-body)', color: 'var(--pj-text-secondary)', lineHeight: 1.6, maxWidth: 520, marginBottom: 28 }}>
          From global brands to local chains — PJAZZA powers live shopping for fashion, restaurants, hotels, and retail. Your sales team gets a mobile app to receive calls and assist customers in real time. One platform for your whole market.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          <button
            className="pj-btn-primary"
            style={{ minWidth: 200, padding: '16px 24px' }}
            onClick={() => { ctaFeedback(); push('/pjazza/contact'); }}
          >
            <Briefcase size={18} style={{ marginRight: 8 }} />
            Get in touch
          </button>
          <button
            className="pj-btn-secondary"
            onClick={() => push('/pjazza/how-it-works')}
          >
            See how it works
          </button>
        </div>
      </ScrollReveal>
    </div>
  );
}

function FinalCTA({ businessCount = 60 }: { businessCount?: number }) {
  const { push } = useViewTransition();

  return (
    <div className="pj-section" style={{ textAlign: 'center', paddingTop: 64, paddingBottom: 64 }}>
      <ScrollReveal>
        <h2 style={{ fontSize: 'var(--pj-size-h1)', fontWeight: 800, color: 'var(--pj-text)', marginBottom: 12, letterSpacing: '-0.02em' }}>
          Everything Malta has to offer.
          <br />
          <span style={{ color: 'var(--pj-gold)' }}>Live.</span>
        </h2>
        <p style={{ fontSize: 'var(--pj-size-body)', color: 'var(--pj-text-tertiary)', marginBottom: 32, lineHeight: 1.6, maxWidth: 380, margin: '0 auto 32px' }}>
        12 sectors. {businessCount}+ businesses. One marketplace.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', maxWidth: 480, margin: '0 auto' }}>
          <button
            className="pj-btn-primary pj-touch"
            style={{ minWidth: 180, padding: '18px 24px', fontSize: 16 }}
            onClick={() => { ctaFeedback(); push('/pjazza/live-shop'); }}
            data-testid="button-explore-now"
          >
            <Play size={16} fill="white" style={{ marginRight: 2 }} />
            <span>Shop Live</span>
          </button>
          <button
            className="pj-btn-secondary pj-touch"
            style={{ minWidth: 160, padding: '16px 24px' }}
            onClick={() => { ctaFeedback(); push('/pjazza/business/onboard'); }}
            data-testid="button-list-business"
          >
            List Your Business
          </button>
          <button
            className="pj-btn-ghost pj-touch"
            style={{ minWidth: 140, padding: '14px 20px', fontSize: 14 }}
            onClick={() => push('/pjazza/install')}
          >
            <Smartphone size={16} style={{ marginRight: 6 }} />
            Install app
          </button>
        </div>
      </ScrollReveal>
    </div>
  );
}

function TrustLine() {
  return (
    <ScrollReveal>
      <div className="pj-section-tight" style={{ paddingTop: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, flexWrap: 'wrap', padding: '16px 0' }}>
          {[
            { Icon: Shield, text: 'Escrow protected' },
            { Icon: CheckCircle, text: 'Verified sellers' },
            { Icon: Video, text: 'Live video proof' },
          ].map((item, i) => (
            <div key={i} className="pj-float" style={{ display: 'flex', alignItems: 'center', gap: 6, animationDelay: `${i * 0.2}s` }}>
              <item.Icon size={15} strokeWidth={2} style={{ color: 'var(--pj-green)' }} />
              <span style={{ fontSize: 'var(--pj-size-small)', fontWeight: 600, color: 'var(--pj-text-tertiary)' }}>{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </ScrollReveal>
  );
}

export default function LandingClient({ initialStreams, liveCount, businessCount = 60 }: { initialStreams: StreamForList[]; liveCount: number; businessCount?: number }) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--pj-black)' }}>
      <Hero liveCount={liveCount} businessCount={businessCount} />
      <StatsBar businessCount={businessCount} />
      <TrustLine />
      <LiveNowPreview streams={initialStreams} />
      <div className="pj-divider" />
      <AllSectors />
      <BrandMarquee />
      <FeaturedStack />
      <div className="pj-divider" />
      <PeoplePreview />
      <div className="pj-divider" />
      <HowItWorksPinned />
      <div className="pj-divider" />
      <Testimonials />
      <div className="pj-divider" />
      <B2BEnterprise />
      <div className="pj-divider" />
      <FinalCTA businessCount={businessCount} />
      <div style={{ height: 48 }} />
    </div>
  );
}
