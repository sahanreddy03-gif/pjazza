'use client';

export function SkeletonStreamCard() {
  return (
    <div className="pj-card pj-skeleton-card" style={{ width: 200, overflow: 'hidden' }}>
      <div className="pj-skeleton pj-skeleton-img" style={{ aspectRatio: '16/10' }} />
      <div style={{ padding: '12px 14px' }}>
        <div className="pj-skeleton pj-skeleton-line" style={{ width: '80%', height: 14, marginBottom: 8 }} />
        <div className="pj-skeleton pj-skeleton-line" style={{ width: '60%', height: 12, marginBottom: 12 }} />
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div className="pj-skeleton pj-skeleton-line" style={{ width: 48, height: 12 }} />
          <div className="pj-skeleton pj-skeleton-line" style={{ width: 56, height: 12 }} />
        </div>
      </div>
    </div>
  );
}

export function SkeletonStoreCard() {
  return (
    <div className="pj-card pj-skeleton-card" style={{ overflow: 'hidden' }}>
      <div className="pj-skeleton pj-skeleton-img" style={{ aspectRatio: '4/3' }} />
      <div style={{ padding: 16 }}>
        <div className="pj-skeleton pj-skeleton-line" style={{ width: '70%', height: 16, marginBottom: 8 }} />
        <div className="pj-skeleton pj-skeleton-line" style={{ width: '50%', height: 12, marginBottom: 12 }} />
        <div className="pj-skeleton pj-skeleton-line" style={{ width: '40%', height: 12 }} />
      </div>
    </div>
  );
}

export function SkeletonHero() {
  return (
    <div style={{ minHeight: '75vh', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '80px 24px 48px' }}>
      <div className="pj-skeleton pj-skeleton-line" style={{ width: 140, height: 28, marginBottom: 24, borderRadius: 'var(--pj-radius-pill)' }} />
      <div className="pj-skeleton pj-skeleton-line" style={{ width: '80%', maxWidth: 320, height: 48, marginBottom: 16 }} />
      <div className="pj-skeleton pj-skeleton-line" style={{ width: '90%', maxWidth: 400, height: 20, marginBottom: 24 }} />
      <div style={{ display: 'flex', gap: 12 }}>
        <div className="pj-skeleton pj-skeleton-line" style={{ width: 160, height: 48, borderRadius: 'var(--pj-radius-pill)' }} />
        <div className="pj-skeleton pj-skeleton-line" style={{ width: 140, height: 48, borderRadius: 'var(--pj-radius-pill)' }} />
      </div>
    </div>
  );
}

export default function Skeleton({ className = '', style }: { className?: string; style?: React.CSSProperties }) {
  return <div className={`pj-skeleton ${className}`} style={style} />;
}
