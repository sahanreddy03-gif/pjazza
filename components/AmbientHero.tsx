'use client';

import { type ReactNode } from 'react';

export default function AmbientHero({ children }: { children: ReactNode }) {
  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Animated gradient orbs — ambient background */}
      <div
        className="pj-ambient-orb pj-ambient-orb-1"
        aria-hidden
      />
      <div
        className="pj-ambient-orb pj-ambient-orb-2"
        aria-hidden
      />
      <div
        className="pj-ambient-orb pj-ambient-orb-3"
        aria-hidden
      />
      {children}
    </div>
  );
}
