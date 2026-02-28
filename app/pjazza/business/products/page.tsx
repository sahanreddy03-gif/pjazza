'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, Plus, Trash2, Package, Loader2, CheckCircle
} from 'lucide-react';
import { createClient } from '@/src/lib/supabase/client';

type Business = { id: string; name: string };
type Product = { id: string; name: string; description: string | null; price: number; is_available: boolean };

export default function ProductsPage() {
  const router = useRouter();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedBiz, setSelectedBiz] = useState('');
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', description: '', price: 0 });

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.push('/pjazza/agent?redirect=/pjazza/business/products');
        return;
      }
      fetch('/api/businesses?mine=1')
        .then((r) => r.json())
        .then((data: Business[]) => {
          setBusinesses(data);
          if (data.length > 0 && !selectedBiz) setSelectedBiz(data[0].id);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    });
  }, [router, selectedBiz]);

  useEffect(() => {
    if (!selectedBiz) return;
    fetch(`/api/businesses/${selectedBiz}/products`)
      .then((r) => r.json())
      .then(setProducts)
      .catch(() => setProducts([]));
  }, [selectedBiz]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBiz || !form.name || form.price < 0) return;
    setAdding(true);
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          business_id: selectedBiz,
          name: form.name,
          description: form.description || null,
          price: Number(form.price),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setProducts((p) => [data, ...p]);
        setForm({ name: '', description: '', price: 0 });
        setAdding(false);
      } else throw new Error(data.error);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to add');
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
    if (res.ok) setProducts((p) => p.filter((x) => x.id !== id));
    else {
      const d = await res.json();
      alert(d.error || 'Failed to delete');
    }
  };

  return (
    <div className="pj-safe-bottom" style={{ minHeight: '100vh', background: 'var(--pj-black)' }}>
      <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--pj-border)' }}>
        <button
          onClick={() => router.push('/pjazza/business/dashboard')}
          className="pj-touch"
          style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', color: 'var(--pj-text-secondary)', fontSize: 14, cursor: 'pointer' }}
        >
          <ArrowLeft size={18} />
          Back
        </button>
      </div>

      <div style={{ padding: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <Package size={24} style={{ color: 'var(--pj-red)' }} />
          <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--pj-text)' }}>
            Products
          </h1>
        </div>
        <p style={{ fontSize: 14, color: 'var(--pj-text-tertiary)', marginBottom: 20 }}>
          Add products customers can buy during your live stream.
        </p>

        {loading ? (
          <Loader2 size={24} className="animate-spin" style={{ color: 'var(--pj-text-tertiary)' }} />
        ) : businesses.length === 0 ? (
          <p style={{ fontSize: 14, color: 'var(--pj-text-secondary)' }}>
            Claim a business first to add products.
          </p>
        ) : (
          <>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--pj-text-secondary)', marginBottom: 8 }}>
              Business
            </label>
            <select
              value={selectedBiz}
              onChange={(e) => setSelectedBiz(e.target.value)}
              style={{
                width: '100%', padding: 12, borderRadius: 8, marginBottom: 24,
                background: 'var(--pj-surface-2)', border: '1px solid var(--pj-border)',
                color: 'var(--pj-text)', fontSize: 15, fontFamily: 'inherit',
              }}
            >
              {businesses.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>

            <form onSubmit={handleAdd} style={{ marginBottom: 24, padding: 16, background: 'var(--pj-surface-1)', borderRadius: 12, border: '1px solid var(--pj-border)' }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--pj-text)', marginBottom: 12 }}>
                Add product
              </h3>
              <input
                type="text"
                placeholder="Product name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                required
                style={{
                  width: '100%', padding: 10, borderRadius: 8, marginBottom: 8,
                  background: 'var(--pj-surface-2)', border: '1px solid var(--pj-border)',
                  color: 'var(--pj-text)', fontSize: 14, fontFamily: 'inherit',
                }}
              />
              <input
                type="text"
                placeholder="Description (optional)"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                style={{
                  width: '100%', padding: 10, borderRadius: 8, marginBottom: 8,
                  background: 'var(--pj-surface-2)', border: '1px solid var(--pj-border)',
                  color: 'var(--pj-text)', fontSize: 14, fontFamily: 'inherit',
                }}
              />
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="Price (€)"
                value={form.price || ''}
                onChange={(e) => setForm((f) => ({ ...f, price: parseFloat(e.target.value) || 0 }))}
                required
                style={{
                  width: '100%', padding: 10, borderRadius: 8, marginBottom: 12,
                  background: 'var(--pj-surface-2)', border: '1px solid var(--pj-border)',
                  color: 'var(--pj-text)', fontSize: 14, fontFamily: 'inherit',
                }}
              />
              <button type="submit" className="pj-btn-primary" style={{ width: '100%', padding: 12 }} disabled={adding}>
                {adding ? <Loader2 size={16} className="animate-spin" style={{ marginRight: 6 }} /> : <Plus size={16} style={{ marginRight: 6 }} />}
                {adding ? 'Adding…' : 'Add product'}
              </button>
            </form>

            <div>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--pj-text)', marginBottom: 12 }}>
                Your products ({products.length})
              </h3>
              {products.length === 0 ? (
                <p style={{ fontSize: 14, color: 'var(--pj-text-tertiary)' }}>No products yet. Add one above.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {products.map((p) => (
                    <div
                      key={p.id}
                      className="pj-card"
                      style={{ padding: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}
                    >
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                          <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--pj-text)' }}>{p.name}</span>
                          {p.is_available && <CheckCircle size={14} style={{ color: 'var(--pj-green)' }} />}
                        </div>
                        {p.description && (
                          <p style={{ fontSize: 12, color: 'var(--pj-text-tertiary)', marginBottom: 4 }}>{p.description}</p>
                        )}
                        <span className="pj-mono" style={{ fontSize: 14, fontWeight: 700, color: 'var(--pj-text-secondary)' }}>
                          €{Number(p.price).toFixed(2)}
                        </span>
                      </div>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="pj-btn-ghost"
                        style={{ padding: 8, color: 'var(--pj-red)' }}
                        aria-label="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
