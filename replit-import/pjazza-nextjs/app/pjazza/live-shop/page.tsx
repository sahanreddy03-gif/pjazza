'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, ArrowRight, Star, CheckCircle, Video, Search,
  Utensils, Home, Ship, Car, Heart, Wrench, Smartphone,
  ShoppingBag, GraduationCap, PawPrint, Compass, Users,
  MapPin, Eye, Play, ChevronRight, Clock, Package,
  Grid3X3, Zap, Palette, Scissors
} from 'lucide-react';
import TopBar from '@/components/TopBar';
import BottomNav from '@/components/BottomNav';
import ScrollReveal from '@/components/ScrollReveal';

const imgElectronics = '/pjazza/images/stores/electronics-store.jpg';
const imgFashion = '/pjazza/images/stores/fashion-boutique.jpg';
const imgCar = '/pjazza/images/stores/car-dealership.jpg';
const imgRestaurant = '/pjazza/images/stores/restaurant.jpg';
const imgProperty = '/pjazza/images/stores/property-office.jpg';
const imgSpa = '/pjazza/images/stores/spa-center.jpg';
const imgHardware = '/pjazza/images/stores/hardware-store.jpg';
const imgPetShop = '/pjazza/images/stores/pet-shop.jpg';
const imgYacht = '/pjazza/images/stores/yacht-marina.jpg';
const imgSalon = '/pjazza/images/stores/hair-salon.jpg';
const imgBookstore = '/pjazza/images/stores/bookstore.jpg';
const imgGiftShop = '/pjazza/images/stores/gift-shop.jpg';

const categories = [
  { id: 'all', label: 'All Stores', Icon: Grid3X3 },
  { id: 'food', label: 'Food & Dining', Icon: Utensils },
  { id: 'property', label: 'Property', Icon: Home },
  { id: 'cars', label: 'Cars & Auto', Icon: Car },
  { id: 'yachts', label: 'Yachts & Marine', Icon: Ship },
  { id: 'home-services', label: 'Home Services', Icon: Wrench },
  { id: 'wellness', label: 'Wellness', Icon: Heart },
  { id: 'fashion', label: 'Fashion & Retail', Icon: ShoppingBag },
  { id: 'electronics', label: 'Electronics', Icon: Smartphone },
  { id: 'tourism', label: 'Tourism', Icon: Compass },
  { id: 'education', label: 'Education', Icon: GraduationCap },
  { id: 'pets', label: 'Pets & Animals', Icon: PawPrint },
  { id: 'beauty', label: 'Beauty', Icon: Scissors },
];

const stores = [
  { id: 'tec-001', name: 'TechHub Malta', sector: 'electronics', sectorLabel: 'Electronics', location: "St Julian's", rating: 4.8, reviews: 214, liveNow: true, viewers: 34, salesperson: 'Maria C.', delivery: 'Same-day', img: imgElectronics, featured: true },
  { id: 'fas-001', name: 'Luxe Boutique', sector: 'fashion', sectorLabel: 'Fashion & Retail', location: 'Sliema', rating: 4.9, reviews: 167, liveNow: true, viewers: 28, salesperson: 'Sophie V.', delivery: 'Same-day', img: imgFashion, featured: true },
  { id: 'car-001', name: 'Malta Motors', sector: 'cars', sectorLabel: 'Cars & Auto', location: 'Birkirkara', rating: 4.7, reviews: 89, liveNow: true, viewers: 45, salesperson: 'Joe Z.', delivery: 'Pickup', img: imgCar, featured: true },
  { id: 'fod-001', name: "Noni's Kitchen", sector: 'food', sectorLabel: 'Food & Dining', location: 'Sliema', rating: 4.8, reviews: 312, liveNow: true, viewers: 52, salesperson: 'Noni G.', delivery: '30 min', img: imgRestaurant, featured: false },
  { id: 'prp-001', name: 'Island Properties', sector: 'property', sectorLabel: 'Property', location: 'Valletta', rating: 4.6, reviews: 78, liveNow: true, viewers: 19, salesperson: 'Karl B.', delivery: 'Virtual tour', img: imgProperty, featured: false },
  { id: 'spa-001', name: 'Fortina Wellness', sector: 'wellness', sectorLabel: 'Wellness', location: 'Sliema', rating: 4.9, reviews: 203, liveNow: false, viewers: 0, salesperson: '', delivery: 'Book session', img: imgSpa, featured: false },
  { id: 'hdw-001', name: 'MaltaFix Hardware', sector: 'home-services', sectorLabel: 'Home Services', location: 'Mosta', rating: 4.5, reviews: 145, liveNow: true, viewers: 12, salesperson: 'Anton F.', delivery: 'Same-day', img: imgHardware, featured: false },
  { id: 'pet-001', name: 'Paws & Claws', sector: 'pets', sectorLabel: 'Pets & Animals', location: 'Naxxar', rating: 4.7, reviews: 98, liveNow: false, viewers: 0, salesperson: '', delivery: 'Same-day', img: imgPetShop, featured: false },
  { id: 'yht-001', name: 'Grand Harbour Charters', sector: 'yachts', sectorLabel: 'Yachts & Marine', location: 'Grand Harbour', rating: 4.9, reviews: 56, liveNow: true, viewers: 23, salesperson: 'Marco S.', delivery: 'Charter', img: imgYacht, featured: true },
  { id: 'sal-001', name: 'Salon de Malta', sector: 'beauty', sectorLabel: 'Beauty', location: 'Sliema', rating: 4.8, reviews: 187, liveNow: false, viewers: 0, salesperson: '', delivery: 'Book session', img: imgSalon, featured: false },
  { id: 'edu-001', name: 'The Book Nook', sector: 'education', sectorLabel: 'Education', location: 'Msida', rating: 4.6, reviews: 72, liveNow: false, viewers: 0, salesperson: '', delivery: 'Same-day', img: imgBookstore, featured: false },
  { id: 'tou-001', name: 'Malta Souvenirs', sector: 'tourism', sectorLabel: 'Tourism', location: 'Valletta', rating: 4.4, reviews: 234, liveNow: true, viewers: 16, salesperson: 'Diane Z.', delivery: 'Same-day', img: imgGiftShop, featured: false },
];

function PageHero() {
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
        <div className="pj-live-badge-lg" style={{ marginBottom: 16 }}>
          <span className="pj-live-dot" style={{ width: 8, height: 8 }} />
          <span>{stores.filter(s => s.liveNow).length} stores live now</span>
        </div>
        <h1 style={{ fontSize: 'var(--pj-size-h1)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.03em', color: 'var(--pj-text)', marginBottom: 12 }}>
          Shop any store
          <br />
          <span style={{ color: 'var(--pj-red)' }}>in Malta. Live.</span>
        </h1>
        <p style={{ fontSize: 'var(--pj-size-body)', color: 'var(--pj-text-secondary)', lineHeight: 1.6, maxWidth: 480 }}>
          Pick a store. A salesperson video-calls you from the shop floor. See products in real time. Buy and get same-day delivery.
        </p>
      </ScrollReveal>
    </div>
  );
}

function HowItWorksBanner() {
  return (
    <ScrollReveal>
      <div className="pj-section-tight" style={{ paddingTop: 0, paddingBottom: 0 }}>
        <div style={{ display: 'flex', gap: 1, borderRadius: 'var(--pj-radius-md)', overflow: 'hidden' }}>
          {[
            { num: '1', text: 'Pick a store', Icon: MapPin, color: 'var(--pj-red)' },
            { num: '2', text: 'Video call', Icon: Video, color: 'var(--pj-text)' },
            { num: '3', text: 'Buy & deliver', Icon: Package, color: 'var(--pj-green)' },
          ].map((step, i) => (
            <div key={i} style={{
              flex: 1,
              padding: '14px 8px',
              background: 'var(--pj-surface-1)',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 6,
            }}>
              <step.Icon size={18} strokeWidth={2} style={{ color: step.color }} />
              <span style={{ fontSize: 'var(--pj-size-xs)', fontWeight: 700, color: 'var(--pj-text-secondary)' }}>{step.text}</span>
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

function CategoryFilters({ active, onChange }: { active: string; onChange: (v: string) => void }) {
  return (
    <ScrollReveal>
      <div className="pj-section-tight" style={{ paddingTop: 0, paddingBottom: 0 }}>
        <div className="pj-scroll-x" style={{ gap: 8, paddingBottom: 4 }}>
          {categories.map((c) => (
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

function StoreCard({ store, index }: { store: typeof stores[0]; index: number }) {
  const router = useRouter();

  return (
    <ScrollReveal delay={index * 40}>
      <div
        className="pj-card pj-touch"
        style={{ padding: 0, overflow: 'hidden', cursor: 'pointer' }}
        onClick={() => store.liveNow ? router.push(`/pjazza/live-shop/${store.id}`) : undefined}
        data-testid={`card-store-${index}`}
      >
        <div style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden' }}>
          <img src={store.img} alt={store.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(transparent 30%, rgba(0,0,0,0.7))' }} />

          {store.liveNow && (
            <>
              <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', alignItems: 'center', gap: 4, padding: '5px 12px', borderRadius: 'var(--pj-radius-pill)', background: 'var(--pj-red)', fontSize: 12, fontWeight: 700, color: 'white' }}>
                <span className="pj-live-dot" style={{ background: 'white', width: 6, height: 6 }} />
                LIVE
              </div>
              <div style={{ position: 'absolute', top: 12, right: 12, display: 'flex', alignItems: 'center', gap: 4, padding: '5px 12px', borderRadius: 'var(--pj-radius-pill)', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', fontSize: 12, fontWeight: 600, color: 'white' }}>
                <Eye size={12} /> {store.viewers} watching
              </div>
            </>
          )}

          <div style={{ position: 'absolute', bottom: 12, left: 12, right: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <h3 style={{ fontSize: 'var(--pj-size-h3)', fontWeight: 700, color: 'white' }}>
                {store.name}
              </h3>
              <CheckCircle size={15} style={{ color: 'var(--pj-green)', flexShrink: 0 }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 'var(--pj-size-small)', color: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', gap: 3 }}>
                <MapPin size={12} /> {store.location}
              </span>
              <span style={{ fontSize: 'var(--pj-size-small)', color: 'rgba(255,255,255,0.7)' }}>
                {store.sectorLabel}
              </span>
            </div>
          </div>
        </div>

        <div style={{ padding: '14px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 'var(--pj-size-small)', color: 'var(--pj-gold)' }}>
                <Star size={13} fill="#D4A574" style={{ color: '#D4A574' }} /> {store.rating}
                <span style={{ color: 'var(--pj-text-tertiary)' }}>({store.reviews})</span>
              </span>
              {store.delivery && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 'var(--pj-size-small)', color: 'var(--pj-green)' }}>
                  <Zap size={12} /> {store.delivery}
                </span>
              )}
            </div>
          </div>

          {store.liveNow ? (
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                className="pj-btn-book"
                onClick={(e) => { e.stopPropagation(); router.push(`/pjazza/live-shop/${store.id}`); }}
                data-testid={`button-shop-live-${index}`}
              >
                <Video size={15} /> Shop Live with {store.salesperson}
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                className="pj-btn-secondary"
                style={{ width: '100%', padding: '10px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                data-testid={`button-notify-${index}`}
              >
                <Clock size={14} /> Notify When Live
              </button>
            </div>
          )}
        </div>
      </div>
    </ScrollReveal>
  );
}

function BottomCTA() {
  const router = useRouter();

  return (
    <div className="pj-section" style={{ textAlign: 'center' }}>
      <ScrollReveal>
        <h2 style={{ fontSize: 'var(--pj-size-h2)', fontWeight: 800, color: 'var(--pj-text)', marginBottom: 8, letterSpacing: '-0.01em' }}>
          Own a shop in Malta?
        </h2>
        <p style={{ fontSize: 'var(--pj-size-body)', color: 'var(--pj-text-tertiary)', marginBottom: 24, lineHeight: 1.6 }}>
          Go live and sell to all of Malta from your shop floor.
        </p>
        <button className="pj-btn-primary" style={{ minWidth: 200, padding: '18px 24px', fontSize: 16 }} onClick={() => router.push('/pjazza/business/onboard')} data-testid="button-list-your-shop">
          <span>List Your Shop</span>
          <ArrowRight size={18} strokeWidth={2.5} />
        </button>
      </ScrollReveal>
    </div>
  );
}

export default function LiveShop() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = stores.filter((s) => {
    const matchesCategory = activeCategory === 'all' || s.sector === activeCategory;
    const matchesSearch = searchQuery === '' ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.sectorLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const liveCount = filtered.filter(s => s.liveNow).length;
  const liveFirst = [...filtered].sort((a, b) => (b.liveNow ? 1 : 0) - (a.liveNow ? 1 : 0));

  return (
    <div className="pj-safe-bottom" style={{ minHeight: '100vh', background: 'var(--pj-black)' }}>
      <TopBar />
      <PageHero />
      <HowItWorksBanner />
      <SearchBar value={searchQuery} onChange={setSearchQuery} />
      <CategoryFilters active={activeCategory} onChange={setActiveCategory} />

      <div className="pj-section-tight" style={{ paddingBottom: 0, paddingTop: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontSize: 'var(--pj-size-body)', color: 'var(--pj-text-tertiary)' }}>
            <span className="pj-mono" style={{ fontWeight: 700, color: 'var(--pj-text-secondary)' }}>{filtered.length}</span> {filtered.length === 1 ? 'store' : 'stores'}
          </span>
          {liveCount > 0 && (
            <span className="pj-live-badge-lg">
              <span className="pj-live-dot" style={{ width: 8, height: 8 }} />
              <span className="pj-mono" style={{ fontWeight: 700 }}>{liveCount}</span> live now
            </span>
          )}
        </div>
      </div>

      <div className="pj-section" style={{ paddingTop: 8 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
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
      <BottomNav />
    </div>
  );
}
