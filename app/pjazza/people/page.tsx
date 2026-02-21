'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, ArrowRight, Star, CheckCircle, Video, Search,
  Wrench, Scale, Waves, Heart, Palette, Scissors,
  GraduationCap, Camera, Code, Calculator, Briefcase,
  ChefHat, Dumbbell, Music, Globe, MapPin, Clock,
  ChevronRight, Users, Shield, Calendar, Play
} from 'lucide-react';
import PjAppShell from '@/components/PjAppShell';
import ScrollReveal from '@/components/ScrollReveal';

const imgElectrician = '/pjazza/images/people/electrician.jpg';
const imgLawyer = '/pjazza/images/people/lawyer.jpg';
const imgPlumber = '/pjazza/images/people/plumber.jpg';
const imgYoga = '/pjazza/images/people/yoga.jpg';
const imgScuba = '/pjazza/images/people/scuba.jpg';
const imgChef = '/pjazza/images/people/chef.jpg';
const imgDeveloper = '/pjazza/images/people/developer.jpg';
const imgTrainer = '/pjazza/images/people/trainer.jpg';
const imgTechnician = '/pjazza/images/people/technician.jpg';
const imgAdvocate = '/pjazza/images/people/advocate.jpg';
const imgGuitarist = '/pjazza/images/people/guitarist.jpg';
const imgHairstylist = '/pjazza/images/people/hairstylist.jpg';
const imgPhotographer = '/pjazza/images/people/photographer.jpg';
const imgTutor = '/pjazza/images/people/tutor.jpg';
const imgCarpenter = '/pjazza/images/people/carpenter.jpg';
const imgAccountant = '/pjazza/images/people/accountant.jpg';
const imgSailor = '/pjazza/images/people/sailor.jpg';
const imgPilates = '/pjazza/images/people/pilates.jpg';
const imgDesigner = '/pjazza/images/people/designer.jpg';
const imgMakeup = '/pjazza/images/people/makeup.jpg';

const categories = [
  { id: 'all', label: 'All', Icon: Users },
  { id: 'trades', label: 'Tradespeople', Icon: Wrench },
  { id: 'legal', label: 'Legal & Finance', Icon: Scale },
  { id: 'fitness', label: 'Health & Fitness', Icon: Dumbbell },
  { id: 'education', label: 'Education', Icon: GraduationCap },
  { id: 'creative', label: 'Creative', Icon: Palette },
  { id: 'beauty', label: 'Beauty & Wellness', Icon: Scissors },
  { id: 'marine', label: 'Marine & Outdoor', Icon: Waves },
  { id: 'tech', label: 'Tech & Digital', Icon: Code },
  { id: 'food', label: 'Food & Cooking', Icon: ChefHat },
  { id: 'music', label: 'Music & Arts', Icon: Music },
];

const people = [
  { name: 'Mark Borg', specialty: 'Licensed Electrician', category: 'trades', location: 'Birkirkara', rating: 4.9, reviews: 87, hourly: '€35/hr', verified: true, liveNow: true, available: true, img: imgElectrician, topRated: true },
  { name: 'Dr. Sarah Mifsud', specialty: 'Corporate Lawyer', category: 'legal', location: 'Valletta', rating: 4.8, reviews: 54, hourly: '€120/hr', verified: true, liveNow: false, available: true, img: imgLawyer, topRated: true },
  { name: 'Antonio Galea', specialty: 'Master Plumber', category: 'trades', location: 'Mosta', rating: 4.7, reviews: 112, hourly: '€40/hr', verified: true, liveNow: true, available: true, img: imgPlumber, topRated: false },
  { name: 'Elena Vella', specialty: 'Yoga Instructor', category: 'fitness', location: 'Sliema', rating: 5.0, reviews: 63, hourly: '€25/session', verified: true, liveNow: false, available: true, img: imgYoga, topRated: true },
  { name: 'Pierre Camilleri', specialty: 'PADI Scuba Instructor', category: 'marine', location: 'Gozo', rating: 4.9, reviews: 148, hourly: '€60/dive', verified: true, liveNow: true, available: true, img: imgScuba, topRated: true },
  { name: 'Maria Grech', specialty: 'Maltese Cooking Teacher', category: 'food', location: 'Mdina', rating: 4.8, reviews: 41, hourly: '€45/class', verified: true, liveNow: false, available: true, img: imgChef, topRated: false },
  { name: 'David Azzopardi', specialty: 'Web Developer', category: 'tech', location: 'St Julian\'s', rating: 4.7, reviews: 38, hourly: '€55/hr', verified: true, liveNow: false, available: true, img: imgDeveloper, topRated: false },
  { name: 'Lisa Farrugia', specialty: 'Personal Trainer', category: 'fitness', location: 'Mellieha', rating: 4.9, reviews: 76, hourly: '€35/session', verified: true, liveNow: false, available: true, img: imgTrainer, topRated: true },
  { name: 'Joe Zammit', specialty: 'AC Technician', category: 'trades', location: 'Hamrun', rating: 4.6, reviews: 93, hourly: '€30/hr', verified: true, liveNow: false, available: true, img: imgTechnician, topRated: false },
  { name: 'Carmen Spiteri', specialty: 'Advocate & Notary', category: 'legal', location: 'Floriana', rating: 4.9, reviews: 67, hourly: '€100/hr', verified: true, liveNow: false, available: true, img: imgAdvocate, topRated: true },
  { name: 'Stefan Debono', specialty: 'Guitar Teacher', category: 'music', location: 'Rabat', rating: 4.8, reviews: 52, hourly: '€20/lesson', verified: true, liveNow: false, available: true, img: imgGuitarist, topRated: false },
  { name: 'Anna Cassar', specialty: 'Hair Stylist', category: 'beauty', location: 'Sliema', rating: 4.7, reviews: 134, hourly: '€40/session', verified: true, liveNow: true, available: true, img: imgHairstylist, topRated: false },
  { name: 'James Buttigieg', specialty: 'Photographer', category: 'creative', location: 'Valletta', rating: 4.9, reviews: 89, hourly: '€80/hr', verified: true, liveNow: false, available: true, img: imgPhotographer, topRated: true },
  { name: 'Roberta Attard', specialty: 'English & Maltese Tutor', category: 'education', location: 'Msida', rating: 4.8, reviews: 45, hourly: '€22/hr', verified: true, liveNow: false, available: true, img: imgTutor, topRated: false },
  { name: 'Chris Fenech', specialty: 'Carpenter & Joiner', category: 'trades', location: 'Siggiewi', rating: 4.7, reviews: 61, hourly: '€45/hr', verified: true, liveNow: false, available: true, img: imgCarpenter, topRated: false },
  { name: 'Nina Pace', specialty: 'Accountant', category: 'legal', location: 'Ta\' Xbiex', rating: 4.6, reviews: 33, hourly: '€50/hr', verified: true, liveNow: false, available: false, img: imgAccountant, topRated: false },
  { name: 'Marco Scicluna', specialty: 'Sailing Instructor', category: 'marine', location: 'Marsaxlokk', rating: 4.9, reviews: 28, hourly: '€70/session', verified: true, liveNow: false, available: true, img: imgSailor, topRated: true },
  { name: 'Diane Zahra', specialty: 'Pilates Instructor', category: 'fitness', location: 'San Gwann', rating: 4.8, reviews: 57, hourly: '€28/class', verified: true, liveNow: false, available: true, img: imgPilates, topRated: false },
  { name: 'Karl Gauci', specialty: 'Graphic Designer', category: 'creative', location: 'Gzira', rating: 4.7, reviews: 42, hourly: '€40/hr', verified: true, liveNow: false, available: true, img: imgDesigner, topRated: false },
  { name: 'Claire Bonnici', specialty: 'Makeup Artist', category: 'beauty', location: 'Naxxar', rating: 4.9, reviews: 98, hourly: '€55/session', verified: true, liveNow: false, available: true, img: imgMakeup, topRated: true },
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
        <h1 style={{ fontSize: 'var(--pj-size-h1)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.03em', color: 'var(--pj-text)', marginBottom: 12 }}>
          Hire anyone
          <br />
          <span style={{ color: 'var(--pj-red)' }}>in Malta.</span>
        </h1>
        <p style={{ fontSize: 'var(--pj-size-body)', color: 'var(--pj-text-secondary)', lineHeight: 1.6, maxWidth: 480 }}>
          Watch them work live. Book instantly.
        </p>
      </ScrollReveal>
    </div>
  );
}

function SearchBar({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <ScrollReveal>
      <div className="pj-section-tight" style={{ paddingTop: 0, paddingBottom: 8 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '14px 16px',
            borderRadius: 'var(--pj-radius-md)',
            background: 'var(--pj-surface-1)',
            border: '1px solid var(--pj-border)',
          }}
        >
          <Search size={18} strokeWidth={2} style={{ color: 'var(--pj-text-tertiary)', flexShrink: 0 }} />
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Search by name, skill, or location..."
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--pj-text)',
              fontSize: 'var(--pj-size-body)',
              fontFamily: 'inherit',
            }}
            data-testid="input-search-people"
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

function PersonCard({ person, index }: { person: typeof people[0]; index: number }) {
  return (
    <ScrollReveal delay={index * 40}>
      <div
        className="pj-card pj-touch"
        style={{ padding: 0, overflow: 'hidden' }}
        data-testid={`card-person-${index}`}
      >
        <div style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 14 }}>
            <div style={{ position: 'relative' }}>
              <img
                src={person.img}
                alt={person.name}
                className={`pj-avatar-lg ${person.liveNow ? 'pj-live-ring' : ''}`}
                style={{
                  border: person.liveNow ? '2.5px solid var(--pj-red)' : person.topRated ? '2.5px solid var(--pj-gold)' : '2.5px solid var(--pj-border)',
                }}
              />
              {person.liveNow && (
                <div style={{
                  position: 'absolute', bottom: -2, right: -2,
                  width: 20, height: 20, borderRadius: '50%',
                  background: 'var(--pj-red)', border: '2.5px solid var(--pj-black)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Play size={9} fill="white" strokeWidth={0} style={{ color: 'white', marginLeft: 1 }} />
                </div>
              )}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3, flexWrap: 'wrap' }}>
                <h3 style={{ fontSize: 'var(--pj-size-h3)', fontWeight: 700, color: 'var(--pj-text)' }}>
                  {person.name}
                </h3>
                {person.verified && (
                  <CheckCircle size={15} style={{ color: 'var(--pj-green)', flexShrink: 0 }} />
                )}
                {person.topRated && (
                  <span className="pj-gold-badge">
                    <Star size={10} fill="#D4A574" style={{ color: '#D4A574' }} /> Top Rated
                  </span>
                )}
              </div>
              <p style={{ fontSize: 'var(--pj-size-body)', fontWeight: 600, color: 'var(--pj-text-secondary)', marginBottom: 6 }}>
                {person.specialty}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 'var(--pj-size-small)', color: 'var(--pj-text-tertiary)' }}>
                  <MapPin size={13} /> {person.location}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 'var(--pj-size-small)', color: 'var(--pj-gold)' }}>
                  <Star size={13} fill="#D4A574" style={{ color: '#D4A574' }} /> {person.rating} <span style={{ color: 'var(--pj-text-tertiary)' }}>({person.reviews})</span>
                </span>
              </div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <span className="pj-mono" style={{ fontSize: 'var(--pj-size-h3)', fontWeight: 800, color: 'var(--pj-text)' }}>
                {person.hourly}
              </span>
            </div>
          </div>

          {person.liveNow && (
            <div style={{ marginBottom: 14 }}>
              <span className="pj-live-badge-lg">
                <span className="pj-live-dot" style={{ width: 8, height: 8 }} />
                LIVE NOW
              </span>
            </div>
          )}

          <div style={{ display: 'flex', gap: 8 }}>
            {person.liveNow ? (
              <>
                <button className="pj-btn-watch" style={{ flex: 1 }} data-testid={`button-watch-${index}`}>
                  <Play size={14} fill="currentColor" /> Watch Live
                </button>
                <button className="pj-btn-book" style={{ flex: 1 }} data-testid={`button-book-${index}`}>
                  <Calendar size={14} /> Book Now
                </button>
              </>
            ) : person.available ? (
              <button className="pj-btn-book" data-testid={`button-book-${index}`}>
                <Calendar size={14} /> Book Now
              </button>
            ) : (
              <button
                className="pj-btn-secondary"
                style={{ width: '100%', padding: '10px 20px', opacity: 0.5, cursor: 'default' }}
                disabled
                data-testid={`button-unavailable-${index}`}
              >
                Currently Unavailable
              </button>
            )}
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
          Offer your skills on PJAZZA
        </h2>
        <p style={{ fontSize: 'var(--pj-size-body)', color: 'var(--pj-text-tertiary)', marginBottom: 24, lineHeight: 1.6 }}>
          Go live and reach all of Malta instantly.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', maxWidth: 440, margin: '0 auto' }}>
          <button className="pj-btn-primary" style={{ minWidth: 180, padding: '18px 24px', fontSize: 16 }} onClick={() => router.push('/pjazza/business/onboard')} data-testid="button-list-yourself">
            <span>List Yourself</span>
            <ArrowRight size={18} strokeWidth={2.5} />
          </button>
        </div>
      </ScrollReveal>
    </div>
  );
}

export default function People() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = people.filter((p) => {
    const matchesCategory = activeCategory === 'all' || p.category === activeCategory;
    const matchesSearch = searchQuery === '' ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const liveCount = filtered.filter(p => p.liveNow).length;

  return (
    <PjAppShell>
    <div className="pj-safe-bottom" style={{ minHeight: '100vh', background: 'var(--pj-black)' }}>
      <PageHero />
      <SearchBar value={searchQuery} onChange={setSearchQuery} />
      <CategoryFilters active={activeCategory} onChange={setActiveCategory} />

      <div className="pj-section-tight" style={{ paddingBottom: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontSize: 'var(--pj-size-body)', color: 'var(--pj-text-tertiary)' }}>
            <span className="pj-mono" style={{ fontWeight: 700, color: 'var(--pj-text-secondary)' }}>{filtered.length}</span> {filtered.length === 1 ? 'person' : 'people'} found
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
        <div className="pj-people-grid">
          {filtered.length > 0 ? (
            filtered.map((person, i) => (
              <PersonCard key={`${person.name}-${i}`} person={person} index={i} />
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <Search size={32} strokeWidth={1.5} style={{ color: 'var(--pj-text-tertiary)', marginBottom: 12 }} />
              <p style={{ fontSize: 'var(--pj-size-h3)', fontWeight: 600, color: 'var(--pj-text-secondary)', marginBottom: 4 }}>
                No results found
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
