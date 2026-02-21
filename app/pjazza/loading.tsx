import { SkeletonHero, SkeletonStreamCard } from '@/components/Skeleton';

export default function PjazzaLoading() {
  return (
    <div className="pj-safe-bottom" style={{ minHeight: '100vh', background: 'var(--pj-black)' }}>
      <SkeletonHero />
      <div className="pj-section" style={{ paddingTop: 24 }}>
        <div style={{ display: 'flex', gap: 12, overflow: 'hidden' }}>
          {[1, 2, 3, 4].map((i) => (
            <SkeletonStreamCard key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
