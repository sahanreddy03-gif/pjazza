'use client';

import { useRouter } from 'next/navigation';
import TiltCard from '@/components/TiltCard';
import {
  ArrowRight, ArrowLeft, Utensils, Home, Ship, Car, Heart,
  Wrench, ShoppingBag, Smartphone, GraduationCap, PawPrint,
  Compass, Users, Eye, Star, CheckCircle, ChevronRight,
  Radio, Shield
} from 'lucide-react';
import PjAppShell from '@/components/PjAppShell';
import ScrollReveal from '@/components/ScrollReveal';
import BrandMarquee from '@/components/BrandMarquee';

const allSectors = [
  {
    id: 'dining',
    Icon: Utensils,
    name: 'Food & Dining',
    tagline: 'Watch tonight\'s specials being prepared',
    desc: 'Restaurants, cafes, bakeries, catering services, street food vendors, and wine bars. Watch chefs prepare your meal live, see the ambiance, browse the menu in real time, and book your table with confidence.',
    examples: ['Live kitchen streams', 'Menu walkthroughs', 'Daily specials showcases', 'Wine tasting events', 'Catering previews'],
    color: 'var(--pj-red)',
    businesses: 42,
    liveNow: 8,
  },
  {
    id: 'property',
    Icon: Home,
    name: 'Property & Real Estate',
    tagline: 'Tour apartments without leaving your couch',
    desc: 'Rentals, sales, commercial spaces, and holiday lets. Walk through properties via live video, ask the agent questions in real time, check the view from the balcony, and inspect every room before you commit.',
    examples: ['Live apartment tours', 'Commercial space walkthroughs', 'Neighbourhood showcases', 'Renovation progress streams', 'Open house events'],
    color: 'var(--pj-gold)',
    businesses: 28,
    liveNow: 5,
  },
  {
    id: 'cars',
    Icon: Car,
    name: 'Cars & Automotive',
    tagline: 'See the car, hear the engine, check the paint',
    desc: 'Dealerships, private sellers, mechanics, and auto parts. Watch live walkarounds of vehicles, hear the engine start, check paint condition, verify mileage on camera, and negotiate the price directly.',
    examples: ['Live car walkarounds', 'Engine start-ups', 'Interior inspections', 'Test drive streams', 'Mechanic consultations'],
    color: 'var(--pj-text-secondary)',
    businesses: 19,
    liveNow: 3,
  },
  {
    id: 'yachts',
    Icon: Ship,
    name: 'Yachts & Marine',
    tagline: 'Walk the deck before you book',
    desc: 'Yacht charters, boat sales, marina services, sailing lessons, and fishing trips. Tour the vessel live, check cabin conditions, see the view from the bow, and book your charter with full confidence.',
    examples: ['Yacht deck tours', 'Charter previews', 'Sunset cruise showcases', 'Boat condition inspections', 'Fishing trip demonstrations'],
    color: 'var(--pj-text-secondary)',
    businesses: 15,
    liveNow: 2,
  },
  {
    id: 'home-services',
    Icon: Wrench,
    name: 'Home Services & Trades',
    tagline: 'See the work. Hire with confidence.',
    desc: 'Plumbers, electricians, builders, painters, AC technicians, carpenters, and handymen. Watch tradespeople showcase their recent projects, demonstrate their skills live, and get quotes on camera.',
    examples: ['Project showcase streams', 'Before/after transformations', 'Live repair demonstrations', 'Material selection help', 'Quote consultations'],
    color: 'var(--pj-green)',
    businesses: 24,
    liveNow: 4,
  },
  {
    id: 'freelancers',
    Icon: Users,
    name: 'Freelancers & Professionals',
    tagline: 'Meet your expert before you hire',
    desc: 'Designers, developers, accountants, lawyers, consultants, photographers, videographers, and translators. See their portfolio live, discuss your project, get a feel for their style before committing.',
    examples: ['Portfolio walkthroughs', 'Live design sessions', 'Consultation previews', 'Skill demonstrations', 'Project planning streams'],
    color: 'var(--pj-gold)',
    businesses: 31,
    liveNow: 6,
  },
  {
    id: 'wellness',
    Icon: Heart,
    name: 'Health & Wellness',
    tagline: 'Tour the spa before you book',
    desc: 'Spas, gyms, yoga studios, beauty salons, clinics, physiotherapists, and nutritionists. Tour the facilities live, see the treatment rooms, meet the therapists, and book your session confidently.',
    examples: ['Spa facility tours', 'Gym equipment showcases', 'Treatment demonstrations', 'Class previews', 'Wellness consultations'],
    color: 'var(--pj-red)',
    businesses: 18,
    liveNow: 3,
  },
  {
    id: 'fashion',
    Icon: ShoppingBag,
    name: 'Fashion & Retail',
    tagline: 'Try before you buy — virtually',
    desc: 'Clothing shops, boutiques, accessories, jewellery, and vintage stores. Watch live styling sessions, see how fabrics look in real light, check sizes, and buy directly from the shop floor.',
    examples: ['New arrivals showcases', 'Styling sessions', 'Fabric and detail close-ups', 'Sale event streams', 'Seasonal collection launches'],
    color: 'var(--pj-text-secondary)',
    businesses: 22,
    liveNow: 4,
  },
  {
    id: 'electronics',
    Icon: Smartphone,
    name: 'Electronics & Tech',
    tagline: 'See it working before you pay',
    desc: 'Phone shops, computer repairs, gadget stores, gaming equipment, and smart home devices. Watch live product demonstrations, unboxings, condition checks for second-hand items, and tech support.',
    examples: ['Product unboxings', 'Device condition checks', 'Repair demonstrations', 'Gaming setup showcases', 'Smart home demos'],
    color: 'var(--pj-text-secondary)',
    businesses: 14,
    liveNow: 2,
  },
  {
    id: 'tourism',
    Icon: Compass,
    name: 'Tourism & Experiences',
    tagline: 'Preview the experience before you go',
    desc: 'Tour operators, excursion providers, boat trips, diving centres, event organisers, and cultural experiences. See exactly what the tour looks like, meet the guide, check the boat, and book live.',
    examples: ['Tour route previews', 'Dive site showcases', 'Event walkthroughs', 'Cultural experience demos', 'Boat trip previews'],
    color: 'var(--pj-gold)',
    businesses: 20,
    liveNow: 5,
  },
  {
    id: 'education',
    Icon: GraduationCap,
    name: 'Education & Training',
    tagline: 'Meet your tutor before you start',
    desc: 'Private tutors, language schools, music teachers, driving instructors, professional training, and workshops. Attend a sample lesson, meet the teacher, see the classroom, and enrol with confidence.',
    examples: ['Sample lesson streams', 'Classroom tours', 'Teaching style previews', 'Workshop demonstrations', 'Student Q&A sessions'],
    color: 'var(--pj-green)',
    businesses: 16,
    liveNow: 3,
  },
  {
    id: 'pets',
    Icon: PawPrint,
    name: 'Pets & Animals',
    tagline: 'Meet your new friend on camera',
    desc: 'Pet shops, veterinary clinics, groomers, breeders, pet supplies, and dog walkers. See puppies and kittens live, tour vet facilities, watch grooming sessions, and find trusted breeders.',
    examples: ['Pet meet-and-greet streams', 'Grooming session showcases', 'Vet clinic tours', 'Supply demonstrations', 'Training class previews'],
    color: 'var(--pj-red)',
    businesses: 11,
    liveNow: 2,
  },
];

function PageHero() {
  return (
    <div className="pj-section" style={{ paddingTop: 40, paddingBottom: 24 }}>
      <ScrollReveal>
        <button
          className="pj-btn-ghost"
          style={{ marginBottom: 16, gap: 6, padding: '4px 0' }}
          onClick={() => window.history.back()}
          data-testid="button-back"
        >
          <ArrowLeft size={14} /> Back
        </button>
        <span className="pj-label" style={{ display: 'block', marginBottom: 8 }}>ALL SECTORS</span>
        <h1 style={{ fontSize: 'var(--pj-size-h1)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.03em', color: 'var(--pj-text)', marginBottom: 12 }}>
          Every industry.
          <br />
          <span style={{ color: 'var(--pj-red)' }}>Every business.</span>
        </h1>
        <p style={{ fontSize: 'var(--pj-size-body)', color: 'var(--pj-text-secondary)', lineHeight: 1.6, maxWidth: 480 }}>
          PJAZZA covers 12 sectors across Malta's entire economy. From restaurants to freelancers, property to pet shops — if it's a business in Malta, it belongs here.
        </p>
      </ScrollReveal>
    </div>
  );
}

function QuickNav() {
  return (
    <ScrollReveal>
      <div className="pj-section-tight" style={{ paddingTop: 0 }}>
        <div className="pj-scroll-x" style={{ gap: 8, paddingBottom: 4 }}>
          {allSectors.map((s) => (
            <a
              key={s.id}
              href={`#sector-${s.id}`}
              className="pj-pill"
              style={{ textDecoration: 'none' }}
              data-testid={`button-jump-${s.id}`}
            >
              <s.Icon size={14} strokeWidth={2} style={{ color: s.color }} />
              {s.name.split(' & ')[0]}
            </a>
          ))}
        </div>
      </div>
    </ScrollReveal>
  );
}

function SectorCard({ sector, index }: { sector: typeof allSectors[0]; index: number }) {
  const router = useRouter();

  return (
    <ScrollReveal delay={index * 40}>
      <TiltCard
        id={`sector-${sector.id}`}
        className="pj-card pj-card-glow"
        style={{ padding: 0, overflow: 'hidden', scrollMarginTop: 80 }}
        data-testid={`card-sector-${sector.id}`}
      >
        <div style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 'var(--pj-radius-md)',
                background: 'var(--pj-surface-2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <sector.Icon size={22} strokeWidth={2} style={{ color: sector.color }} />
            </div>
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: 'var(--pj-size-h3)', fontWeight: 700, color: 'var(--pj-text)' }}>{sector.name}</h2>
              <p style={{ fontSize: 'var(--pj-size-xs)', color: sector.color, fontWeight: 600 }}>{sector.tagline}</p>
            </div>
          </div>

          <p style={{ fontSize: 'var(--pj-size-small)', color: 'var(--pj-text-secondary)', lineHeight: 1.6, marginBottom: 16 }}>
            {sector.desc}
          </p>

          <div style={{ marginBottom: 16 }}>
            <span style={{ fontSize: 'var(--pj-size-micro)', fontWeight: 700, color: 'var(--pj-text-tertiary)', letterSpacing: '0.05em', display: 'block', marginBottom: 8 }}>
              WHAT YOU'LL SEE
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {sector.examples.map((ex, i) => (
                <span
                  key={i}
                  style={{
                    fontSize: 'var(--pj-size-micro)',
                    padding: '4px 10px',
                    borderRadius: 'var(--pj-radius-pill)',
                    background: 'var(--pj-surface-2)',
                    color: 'var(--pj-text-secondary)',
                    fontWeight: 500,
                  }}
                >
                  {ex}
                </span>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: 16 }}>
              <span style={{ fontSize: 'var(--pj-size-xs)', color: 'var(--pj-text-tertiary)' }}>
                <span className="pj-mono" style={{ fontWeight: 700, color: 'var(--pj-text-secondary)' }}>{sector.businesses}</span> businesses
              </span>
              <span style={{ fontSize: 'var(--pj-size-xs)', color: 'var(--pj-text-tertiary)', display: 'flex', alignItems: 'center', gap: 4 }}>
                <span className="pj-live-dot" />
                <span className="pj-mono" style={{ fontWeight: 700, color: 'var(--pj-red)' }}>{sector.liveNow}</span> live now
              </span>
            </div>
            <button
              className="pj-btn-ghost"
              style={{ gap: 4, color: 'var(--pj-red)' }}
              onClick={() => router.push('/pjazza/discover')}
              data-testid={`button-explore-${sector.id}`}
            >
              Explore <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </TiltCard>
    </ScrollReveal>
  );
}

function SectorsList() {
  return (
    <div className="pj-section" style={{ paddingTop: 0 }}>
      <div className="pj-pitch-grid" style={{ gap: 16 }}>
        {allSectors.map((sector, i) => (
          <SectorCard key={sector.id} sector={sector} index={i} />
        ))}
      </div>
    </div>
  );
}

function SummaryStats() {
  return (
    <ScrollReveal>
      <div className="pj-section-tight">
        <div className="pj-card" style={{ padding: 24, borderColor: 'var(--pj-border-hover)' }}>
          <h3 style={{ fontSize: 'var(--pj-size-h3)', fontWeight: 700, color: 'var(--pj-text)', marginBottom: 16 }}>
            The full picture
          </h3>
          <div className="pj-stats-grid" style={{ gap: 12 }}>
            {[
              { value: '12', label: 'Sectors', Icon: Eye },
              { value: '260+', label: 'Businesses', Icon: CheckCircle },
              { value: '47', label: 'Live Now', Icon: Radio },
              { value: '100%', label: 'Escrow Protected', Icon: Shield },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: 'center', padding: 12 }}>
                <s.Icon size={16} strokeWidth={2} style={{ color: 'var(--pj-text-tertiary)', marginBottom: 6 }} />
                <div className="pj-mono" style={{ fontSize: 'var(--pj-size-h2)', fontWeight: 800, color: 'var(--pj-text)', marginBottom: 2 }}>
                  {s.value}
                </div>
                <div style={{ fontSize: 'var(--pj-size-micro)', color: 'var(--pj-text-tertiary)' }}>{s.label}</div>
              </div>
            ))}
          </div>
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
          Your sector not listed?
        </h2>
        <p style={{ fontSize: 'var(--pj-size-small)', color: 'var(--pj-text-tertiary)', marginBottom: 24, lineHeight: 1.6 }}>
          If you run a business in Malta, you belong on PJAZZA.
          <br />
          Get in touch — we'll set you up.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', maxWidth: 440, margin: '0 auto' }}>
          <button className="pj-btn-primary" style={{ minWidth: 180, padding: '18px 24px', fontSize: 16 }} onClick={() => router.push('/pjazza/business/onboard')} data-testid="button-join-pjazza">
            <span>Join PJAZZA</span>
            <ArrowRight size={18} strokeWidth={2.5} />
          </button>
          <button className="pj-btn-secondary" style={{ minWidth: 160, padding: '16px 24px' }} onClick={() => router.push('/pjazza/discover')} data-testid="button-browse-now">
            Browse Now
          </button>
        </div>
      </ScrollReveal>
    </div>
  );
}

export default function Sectors() {
  return (
    <PjAppShell>
    <div className="pj-safe-bottom" style={{ minHeight: '100vh', background: 'var(--pj-black)' }}>
      <PageHero />
      <QuickNav />
      <div className="pj-divider" />
      <SectorsList />
      <BrandMarquee />
      <SummaryStats />
      <div className="pj-divider" />
      <BottomCTA />
      <div style={{ height: 32 }} />
    </div>
    </PjAppShell>
  );
}
