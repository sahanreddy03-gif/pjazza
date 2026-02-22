'use client';

import { useState } from 'react';
import TiltCard from '@/components/TiltCard';
import { useViewTransition } from '@/src/hooks/useViewTransition';
import { haptic, ctaFeedback } from '@/src/utils/haptic';
import {
  ArrowLeft, ArrowRight, Star, CheckCircle, Video, Search,
  Utensils, Home, Ship, Car, Heart, Wrench, Smartphone,
  ShoppingBag, GraduationCap, PawPrint, Compass, MapPin,
  Eye, Clock, Package, Grid3X3, Zap, Scissors
} from 'lucide-react';
import PjAppShell from '@/components/PjAppShell';
import ScrollReveal from '@/components/ScrollReveal';
import type { StoreForList } from '@/src/lib/data';

// Retail = shops selling physical products (fashion, electronics, souvenirs, etc.)
// Experiences = property, dining, charters, cars, wellness
const RETAIL_SECTORS = ['fashion', 'electronics', 'beauty', 'tourism', 'education', 'pets', 'home-services'];
const EXPERIENCE_SECTORS = ['food', 'property', 'cars', 'yachts', 'wellness'];

function isRetail(sector: string) { return RETAIL_SECTORS.includes(sector); }
function isExperience(sector: string) { return EXPERIENCE_SECTORS.includes(sector); }

const macroFilters = [
  { id: 'all', label: 'All', Icon: Grid3X3 },
  { id: 'retail', label: 'Retail', Icon: ShoppingBag, desc: 'Shops selling products — fashion, electronics, beauty, souvenirs, etc.' },
  { id: 'experiences', label: 'Experiences', Icon: Compass, desc: 'Property, dining, yachts, cars, wellness' },
];

const categories = [
  { id: 'all', label: 'All Stores', Icon: Grid3X3, macro: 'all' as const },
  { id: 'food', label: 'Food & Dining', Icon: Utensils, macro: 'experiences' as const },
  { id: 'property', label: 'Property', Icon: Home, macro: 'experiences' as const },
  { id: 'cars', label: 'Cars & Auto', Icon: Car, macro: 'experiences' as const },
  { id: 'yachts', label: 'Yachts & Marine', Icon: Ship, macro: 'experiences' as const },
  { id: 'home-services', label: 'Home Services', Icon: Wrench, macro: 'retail' as const },
  { id: 'wellness', label: 'Wellness', Icon: Heart, macro: 'experiences' as const },
  { id: 'fashion', label: 'Fashion & Retail', Icon: ShoppingBag, macro: 'retail' as const },
  { id: 'electronics', label: 'Electronics', Icon: Smartphone, macro: 'retail' as const },
  { id: 'tourism', label: 'Tourism', Icon: Compass, macro: 'retail' as const },
  { id: 'education', label: 'Education', Icon: GraduationCap, macro: 'retail' as const },
  { id: 'pets', label: 'Pets & Animals', Icon: PawPrint, macro: 'retail' as const },
  { id: 'beauty', label: 'Beauty', Icon: Scissors, macro: 'retail' as const },
];

function PageHero({ liveCount }: { liveCount: number }) {
  return (
    <div className="pj-section" style={{ paddingTop: 40, paddingBottom: 16 }}>
      <ScrollReveal>
        <button
          className="pj-btn-ghost"
          style={{ marginBottom: 16, gap: 6, padding: '4px 0' }}
          onClick={() => window.history.back()}
          data-testid="button-back"
        >
          <ArrowLeft size={14} /> Back
        </button>
        <div className="pj-live-badge" style={{ marginBottom: 14 }}>
          <span className="pj-live-dot" style={{ width: 6, height: 6 }} />
          <span>{liveCount} live now</span>
          <span style={{ opacity: 0.6 }}>·</span>
          <span>video call any store</span>
        </div>
        <h1 style={{ fontSize: 'var(--pj-size-h1)', fontWeight: 700, lineHeight: 1.08, color: 'var(--pj-text)', marginBottom: 10 }}>
          Shop any store in Malta
        </h1>
        <p style={{ fontSize: 'var(--pj-size-body)', color: 'var(--pj-text-secondary)', lineHeight: 1.55, maxWidth: 440 }}>
          Watch streams or video call—see products in real time. Same-day delivery.
        </p>
      </ScrollReveal>
    </div>
  );
}

function HowItWorksBanner() {
  return (
    <ScrollReveal>
      <div className="pj-section-tight" style={{ paddingTop: 0, paddingBottom: 0 }}>
        <div style={{ display: 'flex', gap: 2, borderRadius: 'var(--pj-radius-md)', overflow: 'hidden', background: 'var(--pj-surface-1)', padding: 4, border: '1px solid var(--pj-border)' }}>
          {[
            { text: 'Pick store', Icon: MapPin },
            { text: 'Watch or call', Icon: Video },
            { text: 'Buy & deliver', Icon: Package },
          ].map((step, i) => (
            <div key={i} style={{
              flex: 1,
              padding: '10px 6px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
            }}>
              <step.Icon size={16} strokeWidth={2} style={{ color: 'var(--pj-text-tertiary)' }} />
              <span style={{ fontSize: 'var(--pj-size-micro)', fontWeight: 600, color: 'var(--pj-text-tertiary)' }}>{step.text}</span>
            </div>
          ))}
        </div>
      </div>
    </ScrollReveal>
  );
}

function SearchBar({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <ScrollReveal>
      <div className="pj-section-tight" style={{ paddingTop: 16, paddingBottom: 8 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '14px 16px', borderRadius: 'var(--pj-radius-md)',
          background: 'var(--pj-surface-1)', border: '1px solid var(--pj-border)',
        }}>
          <Search size={18} strokeWidth={2} style={{ color: 'var(--pj-text-tertiary)', flexShrink: 0 }} />
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Search stores, products, or locations..."
            style={{
              flex: 1, background: 'transparent', border: 'none', outline: 'none',
              color: 'var(--pj-text)', fontSize: 'var(--pj-size-body)', fontFamily: 'inherit',
            }}
            data-testid="input-search-stores"
          />
        </div>
      </div>
    </ScrollReveal>
  );
}

function MacroFilter({ active, onChange }: { active: string; onChange: (v: string) => void }) {
  const selected = macroFilters.find((m) => m.id === active);
  return (
    <ScrollReveal>
      <div className="pj-section-tight" style={{ paddingTop: 0, paddingBottom: 8 }}>
        <p className="pj-label" style={{ marginBottom: 10 }}>
          Browse by type
        </p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {macroFilters.map((m) => (
            <button
              key={m.id}
              className={`pj-pill ${active === m.id ? 'pj-pill-active' : ''}`}
              onClick={() => onChange(m.id)}
              data-testid={`button-macro-${m.id}`}
            >
              <m.Icon size={14} strokeWidth={2} />
              {m.label}
            </button>
          ))}
        </div>
        {selected?.desc && (
          <p style={{ fontSize: 'var(--pj-size-xs)', color: 'var(--pj-text-secondary)', marginTop: 10, lineHeight: 1.5 }}>
            {selected.desc}
          </p>
        )}
      </div>
    </ScrollReveal>
  );
}

function CategoryFilters({ active, onChange, macroFilter }: { active: string; onChange: (v: string) => void; macroFilter: string }) {
  const visibleCategories = macroFilter === 'all'
    ? categories
    : categories.filter((c) => c.id === 'all' || c.macro === macroFilter);

  return (
    <ScrollReveal>
      <div className="pj-section-tight" style={{ paddingTop: 0, paddingBottom: 0 }}>
        <p className="pj-label" style={{ marginBottom: 8 }}>
          {macroFilter === 'retail' ? 'Retail sectors' : macroFilter === 'experiences' ? 'Experience sectors' : 'Sectors'}
        </p>
        <div className="pj-scroll-x" style={{ gap: 8, paddingBottom: 4 }}>
          {visibleCategories.map((c) => (
            <button
              key={c.id}
              className={`pj-pill ${active === c.id ? 'pj-pill-active' : ''}`}
              onClick={() => onChange(c.id)}
              data-testid={`button-filter-${c.id}`}
            >
              <c.Icon size={14} strokeWidth={2} />
              {c.label}
            </button>
          ))}
        </div>
      </div>
    </ScrollReveal>
  );
}

function StoreCard({ store, index }: { store: StoreForList; index: number }) {
  const { push } = useViewTransition();
  const href = `/pjazza/live-shop/${store.slug || store.id}`;

  return (
    <ScrollReveal delay={index * 40}>
      <TiltCard
        className="pj-card pj-card-store pj-card-glow pj-touch"
        style={{ padding: 0, overflow: 'hidden', cursor: 'pointer' }}
        onClick={() => { haptic('light'); push(href); }}
        data-testid={`card-store-${index}`}
      >
        <div style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden' }}>
          <img src={store.img} alt={store.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }} className="pj-card-store-img" />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(transparent 40%, rgba(0,0,0,0.75))' }} />

          {store.liveNow && (
            <div style={{ position: 'absolute', top: 10, left: 10, display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 'var(--pj-radius-pill)', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)', fontSize: 11, fontWeight: 600, color: 'white', letterSpacing: '0.03em' }}>
              <span className="pj-live-dot" style={{ background: 'var(--pj-red)', width: 5, height: 5 }} />
              {store.viewers} watching
            </div>
          )}

          <div style={{ position: 'absolute', bottom: 10, left: 10, right: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
              {store.logoUrl && (
                <div style={{ width: 28, height: 28, borderRadius: 6, overflow: 'hidden', flexShrink: 0, border: '1px solid rgba(255,255,255,0.2)' }}>
                  <img src={store.logoUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}
              <h3 style={{ fontSize: 'var(--pj-size-h3)', fontWeight: 700, color: 'white', letterSpacing: '-0.02em' }}>
                {store.name}
              </h3>
              <CheckCircle size={14} style={{ color: 'var(--pj-green)', flexShrink: 0, opacity: 0.9 }} />
            </div>
            <p style={{ fontSize: 'var(--pj-size-xs)', color: 'rgba(255,255,255,0.65)', display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
              <MapPin size={11} style={{ flexShrink: 0 }} />
              {store.location} · {store.sectorLabel}
              <span style={{
                fontSize: 9, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em',
                padding: '2px 6px', borderRadius: 4, background: isRetail(store.sector) ? 'rgba(212,165,116,0.25)' : 'rgba(100,180,200,0.25)',
                color: isRetail(store.sector) ? '#D4A574' : '#64B4C8',
              }}>
                {isRetail(store.sector) ? 'Retail' : 'Experience'}
              </span>
            </p>
          </div>
        </div>

        <div style={{ padding: '12px 14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, flexWrap: 'wrap', gap: 6 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 'var(--pj-size-xs)', color: 'var(--pj-text-tertiary)' }}>
              <Star size={12} fill="#D4A574" style={{ color: '#D4A574' }} /> {store.rating}
              {store.googleReviews || store.tripadvisorReviews ? (
                <span>
                  {[store.googleReviews && `${store.googleReviews} Google`, store.tripadvisorReviews && `${store.tripadvisorReviews} TA`].filter(Boolean).join(' · ')}
                </span>
              ) : (
                <span>({store.reviews} reviews)</span>
              )}
            </span>
            {store.vibeSummary && (
              <span style={{ fontSize: 'var(--pj-size-xs)', color: 'var(--pj-text-secondary)', fontStyle: 'italic', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={store.vibeSummary}>
                {store.vibeSummary}
              </span>
            )}
            {store.delivery && !store.vibeSummary && (
              <span style={{ fontSize: 'var(--pj-size-xs)', color: 'var(--pj-green)' }}>
                {store.delivery}
              </span>
            )}
          </div>

          {store.liveNow ? (
            <button
              className="pj-btn-join"
              onClick={(e) => { e.stopPropagation(); haptic('light'); push(href); }}
              data-testid={`button-shop-live-${index}`}
            >
              <Video size={14} strokeWidth={2} /> Join
            </button>
          ) : (
            <button
              className="pj-btn-call"
              onClick={(e) => { e.stopPropagation(); haptic('light'); push(href); }}
              data-testid={`button-video-call-${index}`}
            >
              <Video size={14} strokeWidth={2} /> Call
            </button>
          )}
        </div>
      </TiltCard>
    </ScrollReveal>
  );
}

function BottomCTA() {
  const { push } = useViewTransition();

  return (
    <div className="pj-section" style={{ textAlign: 'center' }}>
      <ScrollReveal>
        <h2 style={{ fontSize: 'var(--pj-size-h2)', fontWeight: 800, color: 'var(--pj-text)', marginBottom: 8, letterSpacing: '-0.01em' }}>
          Own a shop in Malta?
        </h2>
        <p style={{ fontSize: 'var(--pj-size-body)', color: 'var(--pj-text-tertiary)', marginBottom: 24, lineHeight: 1.6 }}>
          Go live and sell to all of Malta from your shop floor.
        </p>
        <button className="pj-btn-primary" style={{ minWidth: 200, padding: '18px 24px', fontSize: 16 }} onClick={() => { ctaFeedback(); push('/pjazza/business/onboard'); }} data-testid="button-list-your-shop">
          <span>List Your Shop</span>
          <ArrowRight size={18} strokeWidth={2.5} />
        </button>
      </ScrollReveal>
    </div>
  );
}

export default function LiveShopClient({ initialStores }: { initialStores: StoreForList[] }) {
  const [macroFilter, setMacroFilter] = useState('all');
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleMacroChange = (v: string) => {
    setMacroFilter(v);
    if (v !== 'all') {
      const currentCat = categories.find((c) => c.id === activeCategory);
      if (!currentCat || currentCat.macro !== v) setActiveCategory('all');
    }
  };

  const filtered = initialStores.filter((s) => {
    const matchesMacro =
      macroFilter === 'all' ||
      (macroFilter === 'retail' && isRetail(s.sector)) ||
      (macroFilter === 'experiences' && isExperience(s.sector));
    const matchesCategory = activeCategory === 'all' || s.sector === activeCategory;
    const matchesSearch = searchQuery === '' ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.sectorLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesMacro && matchesCategory && matchesSearch;
  });

  const liveCount = filtered.filter(s => s.liveNow).length;
  const liveFirst = [...filtered].sort((a, b) => (b.liveNow ? 1 : 0) - (a.liveNow ? 1 : 0));

  return (
    <PjAppShell>
    <div className="pj-safe-bottom" style={{ minHeight: '100vh', background: 'var(--pj-black)' }}>
      <PageHero liveCount={liveCount} />
      <HowItWorksBanner />
      <SearchBar value={searchQuery} onChange={setSearchQuery} />
      <MacroFilter active={macroFilter} onChange={handleMacroChange} />
      <CategoryFilters active={activeCategory} onChange={setActiveCategory} macroFilter={macroFilter} />

      <div className="pj-section-tight" style={{ paddingBottom: 0, paddingTop: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <span style={{ fontSize: 'var(--pj-size-xs)', color: 'var(--pj-text-tertiary)' }}>
            <span className="pj-mono" style={{ fontWeight: 600, color: 'var(--pj-text-secondary)' }}>{filtered.length}</span> stores
          </span>
          {liveCount > 0 && (
            <span className="pj-live-badge" style={{ padding: '4px 10px', fontSize: 'var(--pj-size-micro)' }}>
              <span className="pj-live-dot" style={{ width: 5, height: 5 }} />
              <span className="pj-mono" style={{ fontWeight: 600 }}>{liveCount}</span> live
            </span>
          )}
        </div>
      </div>

      <div className="pj-section" style={{ paddingTop: 8 }}>
        <div className="pj-store-grid">
          {liveFirst.length > 0 ? (
            liveFirst.map((store, i) => (
              <StoreCard key={store.id} store={store} index={i} />
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <Search size={32} strokeWidth={1.5} style={{ color: 'var(--pj-text-tertiary)', marginBottom: 12 }} />
              <p style={{ fontSize: 'var(--pj-size-h3)', fontWeight: 600, color: 'var(--pj-text-secondary)', marginBottom: 4 }}>
                No stores found
              </p>
              <p style={{ fontSize: 'var(--pj-size-body)', color: 'var(--pj-text-tertiary)' }}>
                Try a different search or category
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="pj-divider" />
      <BottomCTA />
      <div style={{ height: 32 }} />
    </div>
    </PjAppShell>
  );
}
