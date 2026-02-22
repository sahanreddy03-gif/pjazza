'use client';

import { useEffect, useState, useRef } from 'react';

export default function LiveCount({
  target,
  suffix = '',
  duration = 1800,
  startOnView = true,
}: {
  target: number;
  suffix?: string;
  duration?: number;
  startOnView?: boolean;
}) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const [hasAnimated, setHasAnimated] = useState(!startOnView);

  useEffect(() => {
    if (startOnView && !hasAnimated) {
      const el = ref.current;
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setHasAnimated(true);
          }
        },
        { threshold: 0.2 }
      );
      observer.observe(el);
      return () => observer.disconnect();
    }
  }, [startOnView, hasAnimated]);

  useEffect(() => {
    if (!hasAnimated) return;
    const start = performance.now();
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [hasAnimated, target, duration]);

  return (
    <span ref={ref} className="pj-mono">
      {hasAnimated ? value.toLocaleString() : '0'}
      {suffix}
    </span>
  );
}
