'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useHeroGSAP() {
  const heroRef = useRef<HTMLDivElement>(null);
  const imgWrapRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const wordsRef = useRef<HTMLDivElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduceMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ctx = gsap.context(() => {
      if (reduceMotion) return;
      const words = wordsRef.current?.querySelectorAll('.pj-hero-word');
      if (words?.length) {
        gsap.fromTo(
          words,
          { y: 70, opacity: 0, rotationX: -12, transformPerspective: 800 },
          {
            y: 0,
            opacity: 1,
            rotationX: 0,
            duration: 0.85,
            stagger: 0.08,
            ease: 'power3.out',
            delay: 0.2,
          }
        );
      }
      gsap.fromTo(subRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, delay: 0.7, ease: 'power2.out' });
      gsap.fromTo(ctasRef.current, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, delay: 0.95, ease: 'power2.out' });

      // Scroll parallax — image and content move at different speeds
      if (heroRef.current && imgWrapRef.current && contentRef.current) {
        ScrollTrigger.create({
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.2,
          onUpdate: (self) => {
            const p = self.progress;
            const imgY = p * 180;
            const contentY = p * -60;
            gsap.set(imgWrapRef.current, { y: imgY * 0.7 });
            gsap.set(contentRef.current, { y: contentY });
          },
        });
      }
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return { heroRef, imgWrapRef, contentRef, wordsRef, subRef, ctasRef };
}
