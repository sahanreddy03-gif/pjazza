'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronRight } from 'lucide-react';
import TiltCard from '@/components/TiltCard';
import { useViewTransition } from '@/src/hooks/useViewTransition';
import { haptic } from '@/src/utils/haptic';

gsap.registerPlugin(ScrollTrigger);

const listings = [
  { title: 'Sea View 2-Bed Apartment', location: 'Sliema', price: '€1,350/mo', img: '/pjazza/images/thumb-property.jpg', badge: 'Live Tour', sector: 'Property' },
  { title: '2024 VW Polo 1.0 TSI', location: '12,000 km', price: '€18,500', img: '/pjazza/images/thumb-car.jpg', badge: 'Walkaround', sector: 'Automotive' },
  { title: '40ft Catamaran Charter', location: 'Grand Harbour', price: '€1,200/day', img: '/pjazza/images/thumb-yacht.jpg', badge: 'Live Tour', sector: 'Yacht' },
  { title: 'Deep Tissue Massage', location: 'Fortina Spa, Sliema', price: '€65', img: '/pjazza/images/thumb-wellness.jpg', badge: 'Book Live', sector: 'Wellness' },
];

export default function FeaturedStack() {
  const { push } = useViewTransition();
  const stackRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!stackRef.current) return;
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const cards = cardsRef.current.filter(Boolean);
    if (cards.length === 0) return;

    const ctx = gsap.context(() => {
      // 3D stack: each card scales down and translates Z as it scrolls in
      cards.forEach((card, i) => {
        if (!card) return;
        gsap.fromTo(
          card,
          {
            opacity: 0,
            y: 80,
            scale: 0.92,
            rotateX: 12,
            transformPerspective: 1200,
            z: -60,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            rotateX: 0,
            z: 0,
            duration: 0.8,
            delay: i * 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 88%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
    }, stackRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="pj-section" ref={stackRef}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h2 style={{ fontSize: 'var(--pj-size-h2)', fontWeight: 700, color: 'var(--pj-text)', letterSpacing: '-0.01em' }}>
          Featured
        </h2>
        <button className="pj-btn-ghost pj-nav-hover" style={{ gap: 4 }} onClick={() => push('/pjazza/discover')} data-testid="button-browse-listings">
          Browse <ChevronRight size={14} />
        </button>
      </div>

      <div className="pj-listing-grid pj-featured-stack">
        {listings.map((item, i) => (
          <div
            key={i}
            ref={(el) => { cardsRef.current[i] = el; }}
            style={{ transformStyle: 'preserve-3d', perspective: '1200px' }}
          >
            <TiltCard
              className="pj-card pj-card-glow pj-touch"
              style={{ overflow: 'hidden', cursor: 'pointer' }}
              onClick={() => { haptic('light'); push('/pjazza/discover'); }}
              data-testid={`card-listing-${i}`}
            >
              <div style={{ display: 'flex' }}>
                <div style={{ width: 120, flexShrink: 0, position: 'relative', overflow: 'hidden' }}>
                  <img src={item.img} alt={item.title} className="pj-card-img-zoom" style={{ width: '100%', height: '100%', objectFit: 'cover', minHeight: 110 }} />
                  <div style={{ position: 'absolute', top: 8, left: 8, fontSize: 10, fontWeight: 700, color: 'white', background: 'var(--pj-red)', padding: '3px 8px', borderRadius: 'var(--pj-radius-pill)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span className="pj-live-dot" style={{ width: 5, height: 5, background: 'white' }} />
                    {item.badge}
                  </div>
                </div>
                <div style={{ padding: 16, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <span style={{ fontSize: 'var(--pj-size-small)', color: 'var(--pj-text-tertiary)', marginBottom: 3 }}>{item.sector}</span>
                  <h3 style={{ fontSize: 'var(--pj-size-body)', fontWeight: 700, color: 'var(--pj-text)', marginBottom: 4 }}>{item.title}</h3>
                  <p style={{ fontSize: 'var(--pj-size-small)', color: 'var(--pj-text-tertiary)', marginBottom: 10 }}>{item.location}</p>
                  <span className="pj-mono" style={{ fontSize: 'var(--pj-size-h3)', fontWeight: 800, color: 'var(--pj-text)' }}>{item.price}</span>
                </div>
              </div>
            </TiltCard>
          </div>
        ))}
      </div>
    </div>
  );
}
