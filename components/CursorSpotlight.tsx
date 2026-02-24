'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Subtle cursor spotlight — radial glow that follows the mouse.
 * Desktop only. Respects reduced motion.
 */
export default function CursorSpotlight() {
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const reduceMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouch = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);
    if (reduceMotion || isTouch) return;

    setMounted(true);
    const el = ref.current;
    if (!el) return;

    let x = 0;
    let y = 0;
    let targetX = 0;
    let targetY = 0;

    const onMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };

    const animate = () => {
      x += (targetX - x) * 0.08;
      y += (targetY - y) * 0.08;
      el.style.setProperty('--spot-x', `${x}px`);
      el.style.setProperty('--spot-y', `${y}px`);
      requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', onMove);
    animate();
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  if (!mounted) return null;

  return <div ref={ref} className="pj-cursor-spotlight" aria-hidden />;
}
