'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, Video, Mic, MicOff, VideoOff, Phone,
  ShoppingCart, Plus, Minus, X, CheckCircle,
  Send, MapPin, Shield, Truck,
  ChevronUp, ChevronDown, Eye, MessageSquare,
  Zap, VideoIcon, PhoneCall, Star, ExternalLink,
  ThumbsUp, ThumbsDown
} from 'lucide-react';
import dynamic from 'next/dynamic';
import CheckoutModal from '@/components/CheckoutModal';
import type { StoreWithProducts } from '@/src/lib/data';

const LiveKitVideoCall = dynamic(() => import('@/components/LiveKitVideoCall'), { ssr: false });

export default function LiveShopSessionClient({ store }: { store: StoreWithProducts }) {
  const router = useRouter();

  const [liveCallMode, setLiveCallMode] = useState(false);
  const [liveKitToken, setLiveKitToken] = useState<string | null>(null);
  const [liveCallLoading, setLiveCallLoading] = useState(false);
  const [liveCallError, setLiveCallError] = useState('');
  const [voiceOnly, setVoiceOnly] = useState(false);

  const connectLive = useCallback(async (audioOnly = false) => {
    setLiveCallLoading(true);
    setLiveCallError('');
    try {
      const res = await fetch('/api/livekit/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          room: `store-${store.id}`,
          identity: `customer-${crypto.randomUUID().slice(0, 8)}`,
          name: 'Customer',
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to connect');
      setLiveKitToken(data.token);
      setVoiceOnly(audioOnly);
      setLiveCallMode(true);
    } catch (err) {
      setLiveCallError(err instanceof Error ? err.message : 'Could not connect');
    } finally {
      setLiveCallLoading(false);
    }
  }, [store.id]);

  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [cartOpen, setCartOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [cart, setCart] = useState<{ id: string; name: string; price: string; priceNum: number; qty: number }[]>([]);
  const [productsOpen, setProductsOpen] = useState(true);
  const [aboutOpen, setAboutOpen] = useState(true);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ sender: string; text: string }[]>([
    { sender: store.salesperson, text: `Hi! Welcome to ${store.name}. What are you looking for today?` },
  ]);

  const addToCart = (product: { id: string; name: string; price: string; priceNum: number }) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === id);
      if (existing && existing.qty > 1) {
        return prev.map(item => item.id === id ? { ...item, qty: item.qty - 1 } : item);
      }
      return prev.filter(item => item.id !== id);
    });
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.priceNum * item.qty, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  const sendChat = () => {
    if (!chatMessage.trim()) return;
    setChatMessages(prev => [...prev, { sender: 'You', text: chatMessage }]);
    setChatMessage('');
    setTimeout(() => {
      setChatMessages(prev => [...prev, { sender: store.salesperson, text: "Sure! Let me show you that right now..." }]);
    }, 1500);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'var(--pj-black)', zIndex: 100, display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'relative', flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {liveCallMode && liveKitToken && process.env.NEXT_PUBLIC_LIVEKIT_URL ? (
          <div style={{ flex: 1, minHeight: 0, background: '#111' }}>
            <LiveKitVideoCall
              token={liveKitToken}
              serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
              video={!voiceOnly}
              onDisconnected={() => { setLiveCallMode(false); setLiveKitToken(null); }}
            />
          </div>
        ) : (
          <>
            {store.videoUrl ? (
              <video
                src={store.videoUrl}
                autoPlay
                muted
                loop
                playsInline
                style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.7)' }}
              />
            ) : (
              <img
                src={store.img}
                alt={store.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.7)' }}
              />
            )}
            <div style={{ position: 'absolute', bottom: 24, left: 12, right: 12, zIndex: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
              {!store.videoUrl && (
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.9)', textAlign: 'center' }}>Video call to browse and buy</p>
              )}
              <div style={{ display: 'flex', gap: 8, width: '100%', maxWidth: 320, justifyContent: 'center', flexWrap: 'wrap' }}>
                <button
                  onClick={() => connectLive(false)}
                  disabled={liveCallLoading}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: store.videoUrl ? '12px 24px' : '14px 28px',
                    borderRadius: 'var(--pj-radius-pill)',
                    background: 'var(--pj-red)', border: 'none', color: 'white',
                    fontSize: store.videoUrl ? 15 : 16, fontWeight: 700, cursor: liveCallLoading ? 'wait' : 'pointer',
                    boxShadow: '0 4px 20px rgba(220,38,38,0.5)',
                  }}
                  data-testid="button-connect-live"
                >
                  <VideoIcon size={18} />
                  {liveCallLoading ? 'Connecting...' : store.videoUrl ? 'Connect live with store' : 'Video call store'}
                </button>
                <button
                  onClick={() => connectLive(true)}
                  disabled={liveCallLoading}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: store.videoUrl ? '12px 20px' : '14px 24px',
                    borderRadius: 'var(--pj-radius-pill)',
                    background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.4)', color: 'white',
                    fontSize: store.videoUrl ? 14 : 15, fontWeight: 600, cursor: liveCallLoading ? 'wait' : 'pointer',
                  }}
                  data-testid="button-voice-call"
                >
                  <PhoneCall size={16} />
                  Voice call
                </button>
              </div>
              {liveCallError && (
                <p style={{ fontSize: 12, color: 'var(--pj-red)', textAlign: 'center' }}>{liveCallError}</p>
              )}
            </div>
          </>
        )}

        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'linear-gradient(rgba(0,0,0,0.6), transparent)', zIndex: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              onClick={() => router.push('/pjazza/live-shop')}
              style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)', border: 'none', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              data-testid="button-exit-session"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: 'white' }}>{store.name}</span>
                <CheckCircle size={13} style={{ color: 'var(--pj-green)' }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 2 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>
                  <MapPin size={10} /> {store.location}
                </span>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 'var(--pj-radius-pill)', background: 'var(--pj-red)', fontSize: 11, fontWeight: 700, color: 'white' }}>
              <span className="pj-live-dot" style={{ background: 'white', width: 5, height: 5 }} />
              LIVE
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 3, padding: '4px 10px', borderRadius: 'var(--pj-radius-pill)', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)', fontSize: 12, fontWeight: 600, color: 'white' }}>
              <Eye size={11} /> {store.viewers}
            </div>
          </div>
        </div>

        {!liveCallMode && (
          <div style={{ position: 'absolute', top: 80, right: 12, width: 100, height: 140, borderRadius: 'var(--pj-radius-md)', overflow: 'hidden', border: '2px solid rgba(255,255,255,0.15)', zIndex: 10 }}>
            <img
              src={store.salespersonImg}
              alt={store.salesperson}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div style={{ position: 'absolute', bottom: 4, left: 0, right: 0, textAlign: 'center' }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: 'white', background: 'rgba(0,0,0,0.6)', padding: '2px 8px', borderRadius: 'var(--pj-radius-pill)' }}>
                {store.salesperson}
              </span>
            </div>
          </div>
        )}

        {chatOpen && (
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, maxHeight: '50%', background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)', zIndex: 15, display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: 'white' }}>Chat with {store.salesperson}</span>
              <button onClick={() => setChatOpen(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }} data-testid="button-close-chat">
                <X size={18} />
              </button>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {chatMessages.map((msg, i) => (
                <div key={i} style={{ alignSelf: msg.sender === 'You' ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: 2, display: 'block' }}>{msg.sender}</span>
                  <div style={{
                    padding: '8px 12px', borderRadius: 'var(--pj-radius-md)',
                    background: msg.sender === 'You' ? 'var(--pj-red)' : 'rgba(255,255,255,0.1)',
                    fontSize: 14, color: 'white', lineHeight: 1.4,
                  }}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ padding: '8px 12px', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', gap: 8 }}>
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendChat()}
                placeholder="Ask about a product..."
                style={{ flex: 1, background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: 'var(--pj-radius-pill)', padding: '10px 16px', color: 'white', fontSize: 14, fontFamily: 'inherit', outline: 'none' }}
                data-testid="input-chat-message"
              />
              <button onClick={sendChat} style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--pj-red)', border: 'none', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} data-testid="button-send-chat">
                <Send size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      <div style={{ background: 'var(--pj-surface-1)', borderTop: '1px solid var(--pj-border)' }}>
        {/* About store — vibe, reviews, details */}
        <div style={{ borderBottom: '1px solid var(--pj-border)' }}>
          <button
            onClick={() => setAboutOpen(!aboutOpen)}
            style={{ width: '100%', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'none', border: 'none', color: 'var(--pj-text)', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
          >
            About {store.name}
            <ChevronDown size={18} style={{ transform: aboutOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
          </button>
          {aboutOpen && (
            <div style={{ padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: 16 }}>
              {(store.logoUrl || store.imageUrls?.length) ? (
                <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
                  {store.logoUrl && (
                    <div style={{ width: 64, height: 64, borderRadius: 12, overflow: 'hidden', flexShrink: 0, border: '1px solid var(--pj-border)' }}>
                      <img src={store.logoUrl} alt={store.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  )}
                  {(store.imageUrls || []).slice(0, 3).map((url, i) => (
                    <div key={i} style={{ width: 100, height: 64, borderRadius: 8, overflow: 'hidden', flexShrink: 0 }}>
                      <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  ))}
                </div>
              ) : null}
              {store.vibeSummary && (
                <div style={{ padding: 10, background: 'var(--pj-surface-2)', borderRadius: 'var(--pj-radius-md)', borderLeft: '3px solid var(--pj-red)' }}>
                  <p style={{ fontSize: 13, color: 'var(--pj-text-secondary)', lineHeight: 1.5, margin: 0 }}>{store.vibeSummary}</p>
                </div>
              )}
              {(store.googleReviews || store.tripadvisorReviews) ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                  {store.googleRating && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13 }}>
                      <Star size={14} fill="#D4A574" style={{ color: '#D4A574' }} /> {store.googleRating}
                      <span style={{ color: 'var(--pj-text-tertiary)' }}>({store.googleReviews} Google)</span>
                    </span>
                  )}
                  {store.tripadvisorReviews ? (
                    <span style={{ fontSize: 13, color: 'var(--pj-text-tertiary)' }}>{store.tripadvisorReviews} TripAdvisor</span>
                  ) : null}
                </div>
              ) : null}
              {store.curatedReviews && store.curatedReviews.length > 0 && (
                <div>
                  <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--pj-text-tertiary)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Crowd intelligence · 2 best, 2 honest</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {store.curatedReviews.map((r, i) => (
                      <div key={i} style={{ padding: 10, background: 'var(--pj-surface-2)', borderRadius: 8, borderLeft: `3px solid ${r.isPositive ? 'var(--pj-green)' : 'var(--pj-text-muted)'}` }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                          {r.isPositive ? <ThumbsUp size={12} style={{ color: 'var(--pj-green)' }} /> : <ThumbsDown size={12} style={{ color: 'var(--pj-text-tertiary)' }} />}
                          <span style={{ fontSize: 12, fontWeight: 600 }}>{r.author}</span>
                          <span style={{ fontSize: 11, color: 'var(--pj-text-tertiary)' }}>{r.platform} · {r.rating}/5</span>
                        </div>
                        <p style={{ fontSize: 12, color: 'var(--pj-text-secondary)', lineHeight: 1.5, margin: 0 }}>&quot;{r.text}&quot;</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {(store.addressFull || store.phone || store.websiteUrl) && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {store.addressFull && (
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6, fontSize: 12, color: 'var(--pj-text-secondary)' }}>
                      <MapPin size={14} style={{ flexShrink: 0, marginTop: 2 }} /> {store.addressFull}
                    </div>
                  )}
                  {store.phone && (
                    <a href={`tel:${store.phone}`} style={{ fontSize: 12, color: 'var(--pj-red)', textDecoration: 'none' }}>{store.phone}</a>
                  )}
                  {store.websiteUrl && (
                    <a href={store.websiteUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--pj-red)', textDecoration: 'none' }}>
                      <ExternalLink size={12} /> Website
                    </a>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {productsOpen && (
          <div style={{ maxHeight: 280, overflowY: 'auto' }}>
            <div style={{ padding: '12px 16px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--pj-text)' }}>Products from {store.name}</span>
              <button onClick={() => setProductsOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--pj-text-tertiary)', cursor: 'pointer' }} data-testid="button-collapse-products">
                <ChevronDown size={18} />
              </button>
            </div>
            <div style={{ padding: '0 16px 12px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {store.products.map((product) => {
                const inCart = cart.find(c => c.id === product.id);
                return (
                  <div
                    key={product.id}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
                      padding: '10px 12px', background: 'var(--pj-surface-2)', borderRadius: 'var(--pj-radius-md)',
                      border: inCart ? '1px solid var(--pj-red-border)' : '1px solid var(--pj-border)',
                    }}
                    data-testid={`card-product-${product.id}`}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--pj-text)', marginBottom: 2 }}>{product.name}</h4>
                      <p style={{ fontSize: 12, color: 'var(--pj-text-tertiary)' }}>{product.desc}</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                      <span className="pj-mono" style={{ fontSize: 15, fontWeight: 800, color: 'var(--pj-text)' }}>{product.price}</span>
                      {inCart ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <button
                            onClick={() => removeFromCart(product.id)}
                            style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--pj-surface-3)', border: 'none', color: 'var(--pj-text)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                            data-testid={`button-minus-${product.id}`}
                          >
                            <Minus size={14} />
                          </button>
                          <span className="pj-mono" style={{ fontSize: 14, fontWeight: 700, color: 'var(--pj-text)', minWidth: 20, textAlign: 'center' }}>{inCart.qty}</span>
                          <button
                            onClick={() => addToCart(product)}
                            style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--pj-red)', border: 'none', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                            data-testid={`button-plus-${product.id}`}
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => addToCart(product)}
                          style={{ padding: '6px 14px', borderRadius: 'var(--pj-radius-pill)', background: 'var(--pj-red)', border: 'none', color: 'white', fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                          data-testid={`button-add-${product.id}`}
                        >
                          <Plus size={12} /> Add
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {!productsOpen && (
          <button
            onClick={() => setProductsOpen(true)}
            style={{ width: '100%', padding: '10px 16px', background: 'none', border: 'none', color: 'var(--pj-text-secondary)', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}
            data-testid="button-expand-products"
          >
            <ChevronUp size={16} /> Show products ({store.products.length})
          </button>
        )}

        <div style={{ padding: '10px 16px', borderTop: '1px solid var(--pj-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              onClick={() => setMicOn(!micOn)}
              style={{ width: 44, height: 44, borderRadius: '50%', background: micOn ? 'var(--pj-surface-2)' : 'var(--pj-red)', border: 'none', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              data-testid="button-toggle-mic"
            >
              {micOn ? <Mic size={20} /> : <MicOff size={20} />}
            </button>
            <button
              onClick={() => setCamOn(!camOn)}
              style={{ width: 44, height: 44, borderRadius: '50%', background: camOn ? 'var(--pj-surface-2)' : 'var(--pj-red)', border: 'none', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              data-testid="button-toggle-cam"
            >
              {camOn ? <Video size={20} /> : <VideoOff size={20} />}
            </button>
            <button
              onClick={() => { setChatOpen(!chatOpen); }}
              style={{ width: 44, height: 44, borderRadius: '50%', background: chatOpen ? 'var(--pj-red)' : 'var(--pj-surface-2)', border: 'none', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              data-testid="button-toggle-chat"
            >
              <MessageSquare size={20} />
            </button>
            <button
              onClick={() => router.push('/pjazza/live-shop')}
              style={{ width: 44, height: 44, borderRadius: '50%', background: '#DC2626', border: 'none', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              data-testid="button-end-call"
            >
              <Phone size={20} style={{ transform: 'rotate(135deg)' }} />
            </button>
          </div>

          <button
            onClick={() => setCartOpen(!cartOpen)}
            style={{
              position: 'relative',
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '12px 20px',
              borderRadius: 'var(--pj-radius-pill)',
              background: cartCount > 0 ? 'var(--pj-red)' : 'var(--pj-surface-2)',
              border: 'none', color: 'white', fontSize: 14, fontWeight: 700, cursor: 'pointer',
            }}
            data-testid="button-open-cart"
          >
            <ShoppingCart size={18} />
            {cartCount > 0 ? (
              <span>{cartCount} items · {cartTotal.toLocaleString('en', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 })}</span>
            ) : (
              <span>Cart</span>
            )}
          </button>
        </div>
      </div>

      {cartOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', flexDirection: 'column' }}>
          <div style={{ flex: 1, background: 'rgba(0,0,0,0.6)' }} onClick={() => setCartOpen(false)} />
          <div style={{ background: 'var(--pj-surface-1)', borderTop: '1px solid var(--pj-border)', borderRadius: '20px 20px 0 0', maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--pj-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--pj-text)' }}>Your Cart</h2>
              <button onClick={() => setCartOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--pj-text-tertiary)', cursor: 'pointer' }} data-testid="button-close-cart">
                <X size={22} />
              </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
              {cart.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <ShoppingCart size={32} strokeWidth={1.5} style={{ color: 'var(--pj-text-tertiary)', marginBottom: 12 }} />
                  <p style={{ fontSize: 15, color: 'var(--pj-text-secondary)', fontWeight: 600 }}>Your cart is empty</p>
                  <p style={{ fontSize: 13, color: 'var(--pj-text-tertiary)', marginTop: 4 }}>Ask {store.salesperson} to show you products</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {cart.map((item) => (
                    <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: 'var(--pj-surface-2)', borderRadius: 'var(--pj-radius-md)' }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--pj-text)' }}>{item.name}</h4>
                        <span className="pj-mono" style={{ fontSize: 13, color: 'var(--pj-text-secondary)' }}>{item.price} x {item.qty}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--pj-surface-3)', border: 'none', color: 'var(--pj-text)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                          data-testid={`button-cart-minus-${item.id}`}
                        >
                          <Minus size={14} />
                        </button>
                        <span className="pj-mono" style={{ fontSize: 14, fontWeight: 700, color: 'var(--pj-text)', minWidth: 20, textAlign: 'center' }}>{item.qty}</span>
                        <button
                          onClick={() => addToCart(item)}
                          style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--pj-red)', border: 'none', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                          data-testid={`button-cart-plus-${item.id}`}
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div style={{ padding: '16px 20px', borderTop: '1px solid var(--pj-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 13, color: 'var(--pj-text-tertiary)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Truck size={14} style={{ color: 'var(--pj-green)' }} /> Same-day delivery
                  </span>
                  <span style={{ fontSize: 13, color: 'var(--pj-green)', fontWeight: 600 }}>FREE</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 13, color: 'var(--pj-text-tertiary)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Shield size={14} style={{ color: 'var(--pj-green)' }} /> Escrow protected
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, marginTop: 12 }}>
                  <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--pj-text)' }}>Total</span>
                  <span className="pj-mono" style={{ fontSize: 20, fontWeight: 800, color: 'var(--pj-text)' }}>
                    {cartTotal.toLocaleString('en', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 })}
                  </span>
                </div>
                <button
                  className="pj-btn-book"
                  style={{ fontSize: 16, padding: '16px 24px' }}
                  onClick={() => setCheckoutOpen(true)}
                  data-testid="button-checkout"
                >
                  <Zap size={18} /> Pay Now
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <CheckoutModal
        open={checkoutOpen}
        onClose={() => { setCheckoutOpen(false); setCart([]); }}
        total={cartTotal}
        storeName={store.name}
        itemCount={cartCount}
      />
    </div>
  );
}
