'use client';

/**
 * Global ambient background — alive, premium atmosphere on every page.
 * Animated mesh gradients + subtle noise. Fixed, non-intrusive.
 */
export default function GlobalAmbient() {
  return (
    <div className="pj-global-ambient" aria-hidden>
      {/* Animated gradient mesh — slow, organic movement */}
      <div className="pj-ambient-mesh" />
      {/* Extra depth orbs (subtle, far corners) */}
      <div className="pj-ambient-glob-1" />
      <div className="pj-ambient-glob-2" />
      <div className="pj-ambient-glob-3" />
      {/* Film grain overlay — premium texture */}
      <div className="pj-ambient-noise" />
    </div>
  );
}
