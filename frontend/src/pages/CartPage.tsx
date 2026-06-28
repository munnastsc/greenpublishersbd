import React from 'react';
import { Trash2, ShoppingBag, ArrowRight, Plus, Minus } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

export default function CartPage() {
  const { lang, t } = useLanguage();
  const { cart, removeFromCart, updateQuantity, totalPrice } = useCart();


  if (cart.length === 0) {
    return (
      <div className="container" style={{ padding: '6rem 1rem', textAlign: 'center', minHeight: '60vh' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem', opacity: 0.2 }}>
           <ShoppingBag size={100} />
        </div>
        <h2 style={{ fontSize: '2rem', color: '#1e293b', marginBottom: '1rem' }}>
          {lang === 'en' ? 'Your cart is empty' : 'আপনার কার্ট খালি'}
        </h2>
        <p style={{ color: '#64748b', marginBottom: '2.5rem' }}>
          {lang === 'en' ? 'Looks like you haven\'t added any books to your cart yet.' : 'মনে হচ্ছে আপনি এখনো কোনো বই কার্টে যোগ করেননি।'}
        </p>
        <Link to="/books" className="btn btn-blue" style={{ borderRadius: '30px', padding: '0.8rem 2.5rem', textDecoration: 'none' }}>
          {lang === 'en' ? 'Explore Books' : 'বই দেখুন'}
        </Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '3rem 1rem', maxWidth: '1000px', minHeight: '70vh' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
        <ShoppingBag size={32} color="var(--primary)" />
        <h1 style={{ fontSize: '2.2rem', color: '#1e293b', margin: 0, fontWeight: 800 }}>
          {lang === 'en' ? 'Shopping Cart' : 'শপিং কার্ট'}
        </h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2.5rem', alignItems: 'start' }} className="cart-grid">
        
        {/* Cart Items List */}
        <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-md)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid #f1f5f9', background: '#f8fafc', fontWeight: 700, fontSize: '0.9rem', color: '#64748b', display: 'grid', gridTemplateColumns: '1fr 120px 120px 50px', gap: '1rem' }} className="cart-header">
             <span>{lang === 'en' ? 'Product' : 'পণ্য'}</span>
             <span style={{ textAlign: 'center' }}>{lang === 'en' ? 'Price' : 'মূল্য'}</span>
             <span style={{ textAlign: 'center' }}>{lang === 'en' ? 'Quantity' : 'পরিমাণ'}</span>
             <span></span>
          </div>
          
          {cart.map((item) => (
            <div key={item.id} style={{ display: 'grid', gridTemplateColumns: '1fr 120px 120px 50px', gap: '1rem', alignItems: 'center', padding: '1.5rem', borderBottom: '1px solid #f1f5f9' }} className="cart-item-row">
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ width: '50px', height: '70px', backgroundColor: '#f1f5f9', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
                   {item.imageUrl ? <img src={item.imageUrl} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'cover' }} /> : <ShoppingBag size={20} color="#cbd5e1" />}
                </div>
                <div>
                  <h4 style={{ fontWeight: 700, fontSize: '0.95rem', margin: 0, color: '#1e293b' }}>{lang === 'en' ? item.titleEn : item.titleBn}</h4>
                  <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '2px 0 0' }}>{lang === 'en' ? item.authorNameEn : item.authorNameBn}</p>
                </div>
              </div>
              
              <div style={{ textAlign: 'center', fontWeight: 700, color: '#334155' }}>TK. {item.price}</div>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: '#f1f5f9', borderRadius: '20px', padding: '0.3rem' }}>
                <button 
                  onClick={() => updateQuantity && updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                  style={{ background: 'white', border: 'none', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
                >
                  <Minus size={12} />
                </button>
                <span style={{ fontWeight: 600, fontSize: '0.9rem', width: '20px', textAlign: 'center' }}>{item.quantity}</span>
                <button 
                  onClick={() => updateQuantity && updateQuantity(item.id, item.quantity + 1)}
                  style={{ background: 'white', border: 'none', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
                >
                  <Plus size={12} />
                </button>
              </div>
              
              <button onClick={() => removeFromCart(item.id)} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex', justifyContent: 'center' }}>
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>

        {/* Order Summary Sidebar */}
        <div style={{ background: 'white', padding: '2rem', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ marginBottom: '1.5rem', fontWeight: 800, fontSize: '1.25rem' }}>{lang === 'en' ? 'Order Summary' : 'অর্ডার সামারি'}</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
              <span>{lang === 'en' ? 'Subtotal' : 'সাবটোটাল'}</span>
              <span style={{ fontWeight: 600, color: '#1e293b' }}>TK. {totalPrice}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
              <span>{lang === 'en' ? 'Shipping' : 'ডেলিভারি চার্জ'}</span>
              <span style={{ fontSize: '0.85rem' }}>{lang === 'en' ? 'Calculated at checkout' : 'চেকআউটে হিসেব করা হবে'}</span>
            </div>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.3rem', marginBottom: '2rem', color: 'var(--primary)' }}>
             <span>{lang === 'en' ? 'Estimated Total' : 'সম্ভাব্য মোট'}</span>
             <span>TK. {totalPrice}</span>
          </div>

          <Link to="/checkout" className="btn btn-orange" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', borderRadius: '8px', display: 'flex', gap: '0.75rem', textDecoration: 'none', justifyContent: 'center' }}>
            {lang === 'en' ? 'Proceed to Checkout' : 'চেকআউট করুন'} <ArrowRight size={20} />
          </Link>
          
          <Link to="/books" style={{ display: 'block', textAlign: 'center', marginTop: '1.5rem', color: '#64748b', fontSize: '0.9rem', textDecoration: 'none', fontWeight: 600 }}>
             {lang === 'en' ? 'Continue Shopping' : 'আরও কেনাকাটা করুন'}
          </Link>
        </div>

      </div>

      <style>{`
        @media (max-width: 900px) {
          .cart-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 600px) {
          .cart-header {
            display: none !important;
          }
          .cart-item-row {
            grid-template-columns: 1fr auto !important;
            grid-template-rows: auto auto;
            gap: 0.5rem !important;
          }
          .cart-item-row > div:nth-child(1) {
            grid-column: 1 / -1;
          }
        }
      `}</style>
    </div>
  );
}
