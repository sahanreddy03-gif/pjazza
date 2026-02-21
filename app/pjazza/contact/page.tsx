'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Mail, Phone, Send, CheckCircle } from 'lucide-react';
import PjAppShell from '@/components/PjAppShell';
import { SITE } from '@/src/lib/site';

export default function ContactPage() {
  const router = useRouter();
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [form, setForm] = useState({ name: '', email: '', company: '', subject: '', message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus('success');
        setForm({ name: '', email: '', company: '', subject: '', message: '' });
      } else setStatus('error');
    } catch {
      setStatus('error');
    }
  };

  return (
    <PjAppShell>
      <div className="pj-safe-bottom" style={{ minHeight: '100vh', background: 'var(--pj-black)' }}>
        <div className="pj-section" style={{ paddingTop: 60, paddingBottom: 100 }}>
          <button className="pj-btn-ghost" style={{ marginBottom: 24, gap: 6 }} onClick={() => router.back()}>
            <ArrowLeft size={16} /> Back
          </button>

          <div style={{ marginBottom: 8 }}>
            <h1 style={{ fontSize: 'var(--pj-size-h1)', fontWeight: 800, color: 'var(--pj-text)', letterSpacing: '-0.02em' }}>
              Contact
            </h1>
          </div>
          <p style={{ fontSize: 'var(--pj-size-body)', color: 'var(--pj-text-tertiary)', marginBottom: 32, lineHeight: 1.5 }}>
            Get in touch for business inquiries, partnerships, or support. We typically respond within 24 hours.
          </p>

          {/* Contact details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 40 }}>
            <a
              href={`tel:${SITE.contact.phone.replace(/\s/g, '')}`}
              className="pj-card pj-touch"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                padding: 20,
                textDecoration: 'none',
                color: 'inherit',
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 'var(--pj-radius-md)',
                  background: 'var(--pj-red-soft)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Phone size={22} strokeWidth={2} style={{ color: 'var(--pj-red)' }} />
              </div>
              <div>
                <p style={{ fontSize: 'var(--pj-size-micro)', color: 'var(--pj-text-tertiary)', marginBottom: 2 }}>Phone</p>
                <p style={{ fontSize: 'var(--pj-size-body)', fontWeight: 700, color: 'var(--pj-text)' }}>{SITE.contact.phone}</p>
              </div>
            </a>
            <a
              href={`mailto:${SITE.contact.email}`}
              className="pj-card pj-touch"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                padding: 20,
                textDecoration: 'none',
                color: 'inherit',
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 'var(--pj-radius-md)',
                  background: 'var(--pj-red-soft)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Mail size={22} strokeWidth={2} style={{ color: 'var(--pj-red)' }} />
              </div>
              <div>
                <p style={{ fontSize: 'var(--pj-size-micro)', color: 'var(--pj-text-tertiary)', marginBottom: 2 }}>Email</p>
                <p style={{ fontSize: 'var(--pj-size-body)', fontWeight: 700, color: 'var(--pj-text)' }}>{SITE.contact.email}</p>
              </div>
            </a>
          </div>

          {/* Contact form */}
          <div className="pj-card" style={{ padding: 24, marginBottom: 32 }}>
            <h2 style={{ fontSize: 'var(--pj-size-h3)', fontWeight: 700, color: 'var(--pj-text)', marginBottom: 20 }}>
              Send a message
            </h2>

            {status === 'success' && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: 16,
                  background: 'var(--pj-green-soft)',
                  borderRadius: 'var(--pj-radius-md)',
                  marginBottom: 20,
                  border: '1px solid rgba(34, 197, 94, 0.2)',
                }}
              >
                <CheckCircle size={20} style={{ color: 'var(--pj-green)', flexShrink: 0 }} />
                <p style={{ fontSize: 'var(--pj-size-small)', color: 'var(--pj-text)', fontWeight: 600 }}>
                  Message sent. We&apos;ll get back to you soon.
                </p>
              </div>
            )}
            {status === 'error' && (
              <p style={{ fontSize: 'var(--pj-size-small)', color: 'var(--pj-red)', marginBottom: 16 }}>
                Something went wrong. Please try again or email us directly.
              </p>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label htmlFor="name" style={{ display: 'block', fontSize: 'var(--pj-size-small)', fontWeight: 600, color: 'var(--pj-text-secondary)', marginBottom: 6 }}>
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    className="pj-card"
                    style={{
                      width: '100%',
                      padding: 12,
                      border: '1px solid var(--pj-border)',
                      borderRadius: 'var(--pj-radius-md)',
                      background: 'var(--pj-surface-2)',
                      color: 'var(--pj-text)',
                      fontSize: 'var(--pj-size-body)',
                    }}
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" style={{ display: 'block', fontSize: 'var(--pj-size-small)', fontWeight: 600, color: 'var(--pj-text-secondary)', marginBottom: 6 }}>
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    className="pj-card"
                    style={{
                      width: '100%',
                      padding: 12,
                      border: '1px solid var(--pj-border)',
                      borderRadius: 'var(--pj-radius-md)',
                      background: 'var(--pj-surface-2)',
                      color: 'var(--pj-text)',
                      fontSize: 'var(--pj-size-body)',
                    }}
                    placeholder="you@company.com"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="company" style={{ display: 'block', fontSize: 'var(--pj-size-small)', fontWeight: 600, color: 'var(--pj-text-secondary)', marginBottom: 6 }}>
                  Company (optional)
                </label>
                <input
                  id="company"
                  type="text"
                  value={form.company}
                  onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: 12,
                    border: '1px solid var(--pj-border)',
                    borderRadius: 'var(--pj-radius-md)',
                    background: 'var(--pj-surface-2)',
                    color: 'var(--pj-text)',
                    fontSize: 'var(--pj-size-body)',
                  }}
                  placeholder="e.g. Nike, Hospitality Group"
                />
              </div>
              <div>
                <label htmlFor="subject" style={{ display: 'block', fontSize: 'var(--pj-size-small)', fontWeight: 600, color: 'var(--pj-text-secondary)', marginBottom: 6 }}>
                  Subject
                </label>
                <input
                  id="subject"
                  type="text"
                  required
                  value={form.subject}
                  onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: 12,
                    border: '1px solid var(--pj-border)',
                    borderRadius: 'var(--pj-radius-md)',
                    background: 'var(--pj-surface-2)',
                    color: 'var(--pj-text)',
                    fontSize: 'var(--pj-size-body)',
                  }}
                  placeholder="Partnership, Support, B2B inquiry..."
                />
              </div>
              <div>
                <label htmlFor="message" style={{ display: 'block', fontSize: 'var(--pj-size-small)', fontWeight: 600, color: 'var(--pj-text-secondary)', marginBottom: 6 }}>
                  Message
                </label>
                <textarea
                  id="message"
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: 12,
                    border: '1px solid var(--pj-border)',
                    borderRadius: 'var(--pj-radius-md)',
                    background: 'var(--pj-surface-2)',
                    color: 'var(--pj-text)',
                    fontSize: 'var(--pj-size-body)',
                    resize: 'vertical',
                    fontFamily: 'inherit',
                  }}
                  placeholder="Tell us about your business, partnership interest, or how we can help..."
                />
              </div>
              <button
                type="submit"
                disabled={status === 'sending'}
                className="pj-btn-primary"
                style={{ gap: 8, padding: 16 }}
              >
                {status === 'sending' ? (
                  <>Sending...</>
                ) : (
                  <>
                    <Send size={18} strokeWidth={2} />
                    Send message
                  </>
                )}
              </button>
            </form>
          </div>

          <p style={{ fontSize: 'var(--pj-size-xs)', color: 'var(--pj-text-muted)' }}>
            For urgent support, call {SITE.contact.phone}. For B2B and enterprise inquiries, we offer dedicated account managers.
          </p>
        </div>
      </div>
    </PjAppShell>
  );
}
