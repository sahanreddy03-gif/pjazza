'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Video, MessageSquare, Shield, ArrowRight } from 'lucide-react';
import { useViewTransition } from '@/src/hooks/useViewTransition';

gsap.registerPlugin(ScrollTrigger);

const steps = [
  { num: '01', Icon: Video, title: 'Watch live', color: 'var(--pj-red)' },
  { num: '02', Icon: MessageSquare, title: 'Chat & negotiate', color: 'var(--pj-text)' },
  { num: '03', Icon: Shield, title: 'Protected payment', color: 'var(--pj-green)' },
];

export default function HowItWorksPinned() {
  const { push } = useViewTransition();
  const sectionRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!sectionRef.current || !pinRef.current) return;
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 30%',
        end: 'bottom 50%',
        pin: pinRef.current,
        pinSpacing: true,
      });

      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        gsap.fromTo(
          card,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            delay: i * 0.15,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 60%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={sectionRef} className="pj-section pj-how-pinned">
      <div ref={pinRef} style={{ background: 'var(--pj-black)', paddingBottom: 40 }}>
        <h2 style={{ fontSize: 'var(--pj-size-h2)', fontWeight: 700, color: 'var(--pj-text)', marginBottom: 24, letterSpacing: '-0.01em' }}>
          See it. Chat it. Buy it.
        </h2>
        <div className="pj-grid-cards">
          {steps.map((step, i) => (
            <div
              key={i}
              ref={(el) => { cardsRef.current[i] = el; }}
              className="pj-card"
              style={{ padding: 20, display: 'flex', alignItems: 'center', gap: 16, height: '100%' }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 'var(--pj-radius-md)',
                  background: 'var(--pj-surface-2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <step.Icon size={22} strokeWidth={2} style={{ color: step.color }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span className="pj-mono" style={{ fontSize: 'var(--pj-size-small)', fontWeight: 700, color: 'var(--pj-red)' }}>{step.num}</span>
                <h3 style={{ fontSize: 'var(--pj-size-h3)', fontWeight: 700, color: 'var(--pj-text)' }}>{step.title}</h3>
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 20, textAlign: 'center' }}>
          <button
            className="pj-btn-ghost pj-nav-hover"
            style={{ color: 'var(--pj-text-secondary)', gap: 6 }}
            onClick={() => push('/pjazza/how-it-works')}
            data-testid="button-learn-more-how"
          >
            Learn more <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
