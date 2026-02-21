'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  ArrowLeft, Video, Mic, MicOff, VideoOff, Phone,
  ShoppingCart, Plus, Minus, X, Star, CheckCircle,
  Send, MapPin, Package, Shield, Clock, Truck,
  ChevronUp, ChevronDown, Eye, Play, MessageSquare,
  Zap, Heart
} from 'lucide-react';

const imgElectronics = '/pjazza/images/stores/electronics-store.jpg';
const imgFashion = '/pjazza/images/stores/fashion-boutique.jpg';
const imgCar = '/pjazza/images/stores/car-dealership.jpg';
const imgRestaurant = '/pjazza/images/stores/restaurant.jpg';
const imgProperty = '/pjazza/images/stores/property-office.jpg';
const imgHardware = '/pjazza/images/stores/hardware-store.jpg';
const imgYacht = '/pjazza/images/stores/yacht-marina.jpg';
const imgGiftShop = '/pjazza/images/stores/gift-shop.jpg';
const imgSalesperson1 = '/pjazza/images/stores/salesperson-1.jpg';
const imgSalesperson2 = '/pjazza/images/stores/salesperson-2.jpg';

const storeData: Record<string, { name: string; salesperson: string; salespersonImg: string; location: string; sector: string; viewers: number; img: string; products: { id: string; name: string; price: string; priceNum: number; desc: string }[] }> = {
  'tec-001': {
    name: 'TechHub Malta',
    salesperson: 'Maria C.',
    salespersonImg: imgSalesperson1,
    location: "St Julian's",
    sector: 'Electronics',
    viewers: 34,
    img: imgElectronics,
    products: [
      { id: 'p1', name: 'iPhone 16 Pro Max', price: '€1,399', priceNum: 1399, desc: '256GB, Natural Titanium' },
      { id: 'p2', name: 'MacBook Air M3', price: '€1,299', priceNum: 1299, desc: '15", 16GB RAM, 512GB' },
      { id: 'p3', name: 'Sony WH-1000XM5', price: '€329', priceNum: 329, desc: 'Wireless noise-cancelling' },
      { id: 'p4', name: 'iPad Pro 13"', price: '€1,199', priceNum: 1199, desc: 'M4 chip, 256GB' },
    ]
  },
  'fas-001': {
    name: 'Luxe Boutique',
    salesperson: 'Sophie V.',
    salespersonImg: imgSalesperson1,
    location: 'Sliema',
    sector: 'Fashion',
    viewers: 28,
    img: imgFashion,
    products: [
      { id: 'p1', name: 'Cashmere Wrap Coat', price: '€420', priceNum: 420, desc: 'Italian wool blend, camel' },
      { id: 'p2', name: 'Silk Midi Dress', price: '€195', priceNum: 195, desc: 'Emerald green, sizes XS-L' },
      { id: 'p3', name: 'Leather Tote Bag', price: '€280', priceNum: 280, desc: 'Full grain, cognac' },
      { id: 'p4', name: 'Linen Blazer', price: '€165', priceNum: 165, desc: 'Relaxed fit, navy' },
    ]
  },
  'car-001': {
    name: 'Malta Motors',
    salesperson: 'Joe Z.',
    salespersonImg: imgSalesperson2,
    location: 'Birkirkara',
    sector: 'Automotive',
    viewers: 45,
    img: imgCar,
    products: [
      { id: 'p1', name: '2024 VW Polo 1.0 TSI', price: '€18,500', priceNum: 18500, desc: '12,000 km, Reflex Silver' },
      { id: 'p2', name: '2023 SEAT Ibiza FR', price: '€16,900', priceNum: 16900, desc: '18,000 km, Midnight Black' },
      { id: 'p3', name: '2024 Toyota Yaris', price: '€19,200', priceNum: 19200, desc: '8,000 km, Hybrid, Pearl White' },
    ]
  },
  'fod-001': {
    name: "Noni's Kitchen",
    salesperson: 'Noni G.',
    salespersonImg: imgSalesperson1,
    location: 'Sliema',
    sector: 'Food & Dining',
    viewers: 52,
    img: imgRestaurant,
    products: [
      { id: 'p1', name: 'Sunday Feast for 4', price: '€85', priceNum: 85, desc: 'Rabbit stew, timpana, dessert' },
      { id: 'p2', name: 'Pastizzi Platter (50pc)', price: '€25', priceNum: 25, desc: 'Ricotta & pea mix' },
      { id: 'p3', name: 'Maltese Wine Box', price: '€45', priceNum: 45, desc: '3 bottles, Meridiana & Marsovin' },
    ]
  },
  'prp-001': {
    name: 'Island Properties',
    salesperson: 'Karl B.',
    salespersonImg: imgSalesperson2,
    location: 'Valletta',
    sector: 'Property',
    viewers: 19,
    img: imgProperty,
    products: [
      { id: 'p1', name: 'Sea View 2-Bed Apartment', price: '€1,350/mo', priceNum: 1350, desc: 'Sliema, furnished, 90sqm' },
      { id: 'p2', name: 'Valletta Townhouse', price: '€650,000', priceNum: 650000, desc: '3 beds, restored, 200sqm' },
    ]
  },
  'hdw-001': {
    name: 'MaltaFix Hardware',
    salesperson: 'Anton F.',
    salespersonImg: imgSalesperson2,
    location: 'Mosta',
    sector: 'Home Services',
    viewers: 12,
    img: imgHardware,
    products: [
      { id: 'p1', name: 'Bosch Drill Set', price: '€89', priceNum: 89, desc: '18V cordless, 50pc accessories' },
      { id: 'p2', name: 'Paint Bundle', price: '€65', priceNum: 65, desc: '10L exterior white + brushes' },
      { id: 'p3', name: 'Bathroom Renovation Kit', price: '€420', priceNum: 420, desc: 'Tiles, fixtures, adhesive' },
    ]
  },
  'yht-001': {
    name: 'Grand Harbour Charters',
    salesperson: 'Marco S.',
    salespersonImg: imgSalesperson2,
    location: 'Grand Harbour',
    sector: 'Yachts & Marine',
    viewers: 23,
    img: imgYacht,
    products: [
      { id: 'p1', name: 'Full Day Catamaran Charter', price: '€1,200', priceNum: 1200, desc: '40ft, up to 12 guests, crew included' },
      { id: 'p2', name: 'Sunset Cruise', price: '€350', priceNum: 350, desc: '3 hours, drinks included' },
      { id: 'p3', name: 'Gozo Day Trip', price: '€600', priceNum: 600, desc: 'Private boat, snorkeling gear' },
    ]
  },
  'tou-001': {
    name: 'Malta Souvenirs',
    salesperson: 'Diane Z.',
    salespersonImg: imgSalesperson1,
    location: 'Valletta',
    sector: 'Tourism',
    viewers: 16,
    img: imgGiftShop,
    products: [
      { id: 'p1', name: 'Handblown Mdina Glass', price: '€35', priceNum: 35, desc: 'Vase, blue-green swirl' },
      { id: 'p2', name: 'Maltese Lace Set', price: '€28', priceNum: 28, desc: 'Table runner + 4 coasters' },
      { id: 'p3', name: 'Filigree Bracelet', price: '€65', priceNum: 65, desc: 'Sterling silver, Maltese cross' },
    ]
  },
};

export default function LiveShopSession() {
  const router = useRouter();
  const params = useParams<{ storeId: string }>();
  const storeId = (params?.storeId as string) || 'tec-001';
  const store = storeData[storeId] || storeData['tec-001'];

  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [cartOpen, setCartOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [cart, setCart] = useState<{ id: string; name: string; price: string; priceNum: number; qty: number }[]>([]);
  const [productsOpen, setProductsOpen] = useState(true);
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
      <div style={{ position: 'relative', flex: 1, overflow: 'hidden' }}>
        <img
          src={store.img}
          alt={store.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.7)' }}
        />

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
                  data-testid="button-checkout"
                >
                  <Zap size={18} /> Pay Now
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
