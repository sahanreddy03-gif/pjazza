const items = [
  'Restaurants', 'Yachts', 'Real Estate', 'Cars', 'Artisans',
  'Tours', 'Wellness', 'Services', 'Retail', 'Cafés',
  'Salons', 'Charters', 'Freelancers', 'Experiences',
];

export default function BrandMarquee() {
  const separator = (
    <span
      style={{
        width: 4,
        height: 4,
        borderRadius: '50%',
        background: 'var(--pj-text-muted)',
        flexShrink: 0,
      }}
    />
  );

  const row = items.map((item, i) => (
    <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 24 }}>
      <span
        className="pj-display"
        style={{
          fontSize: 'var(--pj-size-small)',
          fontWeight: 600,
          color: 'var(--pj-text-tertiary)',
          whiteSpace: 'nowrap',
          letterSpacing: '0.02em',
        }}
      >
        {item}
      </span>
      {separator}
    </span>
  ));

  return (
    <div
      style={{
        overflow: 'hidden',
        padding: '24px 0',
        borderTop: '1px solid var(--pj-border)',
        borderBottom: '1px solid var(--pj-border)',
      }}
    >
      <div className="pj-marquee-track" style={{ gap: 24 }}>
        {row}
        {row}
      </div>
    </div>
  );
}
