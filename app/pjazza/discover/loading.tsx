import { SkeletonStreamCard } from '@/components/Skeleton';

export default function DiscoverLoading() {
  return (
    <div className="pj-safe-bottom" style={{ minHeight: '100vh', background: 'var(--pj-black)' }}>
      <div className="pj-section" style={{ paddingTop: 60, paddingBottom: 24 }}>
        <div className="pj-skeleton pj-skeleton-line" style={{ width: 200, height: 28, marginBottom: 12, borderRadius: 8 }} />
        <div className="pj-skeleton pj-skeleton-line" style={{ width: '60%', height: 18, marginBottom: 20 }} />
      </div>
      <div className="pj-section" style={{ paddingTop: 0 }}>
        <div style={{ display: 'flex', gap: 12, overflow: 'hidden', flexWrap: 'nowrap' }}>
          {[1, 2, 3, 4, 5].map((i) => (
            <SkeletonStreamCard key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
