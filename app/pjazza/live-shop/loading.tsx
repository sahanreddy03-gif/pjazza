import { SkeletonStoreCard } from '@/components/Skeleton';

export default function LiveShopLoading() {
  return (
    <div className="pj-safe-bottom" style={{ minHeight: '100vh', background: 'var(--pj-black)' }}>
      <div className="pj-section" style={{ paddingTop: 60, paddingBottom: 24 }}>
        <div className="pj-skeleton pj-skeleton-line" style={{ width: 180, height: 24, marginBottom: 12, borderRadius: 8 }} />
        <div className="pj-skeleton pj-skeleton-line" style={{ width: '70%', height: 16, marginBottom: 24 }} />
      </div>
      <div className="pj-section" style={{ paddingTop: 0 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <SkeletonStoreCard key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
