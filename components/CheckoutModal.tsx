'use client';

import { useState } from 'react';
import { X, CreditCard, CheckCircle, Loader2, Shield } from 'lucide-react';

interface CheckoutModalProps {
  open: boolean;
  onClose: () => void;
  total: number;
  storeName: string;
  itemCount: number;
}

export default function CheckoutModal({ open, onClose, total, storeName, itemCount }: CheckoutModalProps) {
  const [step, setStep] = useState<'form' | 'processing' | 'success'>('form');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('processing');
    setTimeout(() => setStep('success'), 2200);
  };

  const handleClose = () => {
    setStep('form');
    setCardNumber('');
    setExpiry('');
    setCvc('');
    onClose();
  };

  if (!open) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 300, display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }} onClick={handleClose} />
      <div
        style={{
          background: 'var(--pj-surface-1)',
          borderTop: '1px solid var(--pj-border)',
          borderRadius: '24px 24px 0 0',
          maxHeight: '90vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--pj-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--pj-text)' }}>
            {step === 'success' ? 'Payment Complete' : 'Secure Checkout'}
          </h2>
          <button onClick={handleClose} style={{ background: 'none', border: 'none', color: 'var(--pj-text-tertiary)', cursor: 'pointer', padding: 4 }}>
            <X size={22} />
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
          {step === 'form' && (
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, padding: 12, background: 'rgba(34, 197, 94, 0.08)', borderRadius: 'var(--pj-radius-md)', border: '1px solid rgba(34, 197, 94, 0.2)' }}>
                <Shield size={18} style={{ color: 'var(--pj-green)' }} />
                <span style={{ fontSize: 'var(--pj-size-small)', fontWeight: 600, color: 'var(--pj-green)' }}>Escrow protected · Your payment is held until delivery</span>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 'var(--pj-size-xs)', fontWeight: 600, color: 'var(--pj-text-secondary)', marginBottom: 8 }}>Card number</label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
                  placeholder="4242 4242 4242 4242"
                  maxLength={19}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    borderRadius: 'var(--pj-radius-md)',
                    border: '1px solid var(--pj-border)',
                    background: 'var(--pj-surface-2)',
                    color: 'var(--pj-text)',
                    fontSize: 16,
                    fontFamily: 'inherit',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                  required
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 'var(--pj-size-xs)', fontWeight: 600, color: 'var(--pj-text-secondary)', marginBottom: 8 }}>Expiry</label>
                  <input
                    type="text"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value.replace(/\D/g, '').slice(0, 4).replace(/(\d{2})/, '$1/'))}
                    placeholder="MM/YY"
                    maxLength={5}
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      borderRadius: 'var(--pj-radius-md)',
                      border: '1px solid var(--pj-border)',
                      background: 'var(--pj-surface-2)',
                      color: 'var(--pj-text)',
                      fontSize: 16,
                      fontFamily: 'inherit',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 'var(--pj-size-xs)', fontWeight: 600, color: 'var(--pj-text-secondary)', marginBottom: 8 }}>CVC</label>
                  <input
                    type="text"
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    placeholder="123"
                    maxLength={4}
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      borderRadius: 'var(--pj-radius-md)',
                      border: '1px solid var(--pj-border)',
                      background: 'var(--pj-surface-2)',
                      color: 'var(--pj-text)',
                      fontSize: 16,
                      fontFamily: 'inherit',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                    required
                  />
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                <span style={{ fontSize: 'var(--pj-size-body)', color: 'var(--pj-text-tertiary)' }}>Total</span>
                <span className="pj-mono" style={{ fontSize: 22, fontWeight: 800, color: 'var(--pj-text)' }}>
                  {total.toLocaleString('en', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 })}
                </span>
              </div>
              <button type="submit" className="pj-btn-primary" style={{ width: '100%', padding: '18px 24px', fontSize: 16 }}>
                <CreditCard size={18} />
                Pay {total.toLocaleString('en', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 })}
              </button>
            </form>
          )}

          {step === 'processing' && (
            <div style={{ textAlign: 'center', padding: '60px 24px' }}>
              <Loader2 size={48} className="pj-spin" style={{ color: 'var(--pj-red)', margin: '0 auto 24px', display: 'block' }} />
              <p style={{ fontSize: 'var(--pj-size-body)', fontWeight: 600, color: 'var(--pj-text)', marginBottom: 8 }}>Processing payment...</p>
              <p style={{ fontSize: 'var(--pj-size-small)', color: 'var(--pj-text-tertiary)' }}>Your payment is being secured in escrow</p>
            </div>
          )}

          {step === 'success' && (
            <div style={{ textAlign: 'center', padding: '40px 24px' }}>
              <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(34, 197, 94, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                <CheckCircle size={40} style={{ color: 'var(--pj-green)' }} />
              </div>
              <p style={{ fontSize: 'var(--pj-size-h3)', fontWeight: 700, color: 'var(--pj-text)', marginBottom: 8 }}>Order confirmed!</p>
              <p style={{ fontSize: 'var(--pj-size-body)', color: 'var(--pj-text-secondary)', marginBottom: 8 }}>
                {itemCount} item{itemCount > 1 ? 's' : ''} from {storeName}
              </p>
              <p style={{ fontSize: 'var(--pj-size-small)', color: 'var(--pj-text-tertiary)', marginBottom: 24 }}>
                €{total.toLocaleString()} held in escrow until you confirm delivery
              </p>
              <button onClick={handleClose} className="pj-btn-primary" style={{ width: '100%', padding: '16px 24px' }}>
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
