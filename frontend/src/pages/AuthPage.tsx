import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { User, Lock, Mail, Phone, ArrowRight } from 'lucide-react';

export default function AuthPage() {
  const { lang, t } = useLanguage();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    const body = isLogin 
      ? { emailOrPhone: formData.email || formData.phone, password: formData.password }
      : formData;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Authentication failed');

      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', data.token);
      
      // Dispatch an event so Navbar updates immediately
      window.dispatchEvent(new Event('storage'));
      
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '4rem 1rem', display: 'flex', justifyContent: 'center' }}>
      <div style={{ background: 'white', padding: '2.5rem', borderRadius: '16px', width: '100%', maxWidth: '450px', boxShadow: '0 10px 40px rgba(0,0,0,0.05)' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', padding: '1rem', background: '#f0fdf4', borderRadius: '50%', color: 'var(--primary)', marginBottom: '1rem' }}>
            <User size={32} />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e293b' }}>
            {isLogin ? (lang === 'en' ? 'Welcome Back' : 'স্বাগতম') : (lang === 'en' ? 'Create Account' : 'অ্যাকাউন্ট তৈরি করুন')}
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.5rem' }}>
            {isLogin 
              ? (lang === 'en' ? 'Sign in to access your digital books and orders.' : 'আপনার বই এবং অর্ডারগুলো দেখতে লগইন করুন।')
              : (lang === 'en' ? 'Join GreenPublishers to access premium content.' : 'প্রিমিয়াম কন্টেন্ট পেতে নতুন অ্যাকাউন্ট খুলুন।')}
          </p>
        </div>

        {error && (
          <div style={{ background: '#fef2f2', color: '#ef4444', padding: '0.75rem 1rem', borderRadius: '8px', fontSize: '0.875rem', marginBottom: '1.5rem', border: '1px solid #fecaca' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {!isLogin && (
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600, color: '#475569' }}>
                {lang === 'en' ? 'Full Name' : 'আপনার নাম'}
              </label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none' }} placeholder={lang === 'en' ? 'John Doe' : 'আপনার নাম লিখুন'} />
              </div>
            </div>
          )}

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600, color: '#475569' }}>
              {isLogin ? (lang === 'en' ? 'Email or Phone' : 'ইমেইল বা মোবাইল নাম্বার') : (lang === 'en' ? 'Email Address' : 'ইমেইল ঠিকানা')}
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input required type="text" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none' }} placeholder={isLogin ? 'example@mail.com / 01xxxxxxxxx' : 'example@mail.com'} />
            </div>
          </div>

          {!isLogin && (
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600, color: '#475569' }}>
                {lang === 'en' ? 'Phone Number' : 'মোবাইল নাম্বার'}
              </label>
              <div style={{ position: 'relative' }}>
                <Phone size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input required type="text" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none' }} placeholder="01xxxxxxxxx" />
              </div>
            </div>
          )}

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600, color: '#475569' }}>
              {lang === 'en' ? 'Password' : 'পাসওয়ার্ড'}
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input required type="password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none' }} placeholder="••••••••" />
            </div>
          </div>

          <button type="submit" disabled={loading} style={{ width: '100%', background: 'var(--primary)', color: 'white', border: 'none', padding: '0.875rem', borderRadius: '8px', fontSize: '1rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
            {loading ? 'Processing...' : (isLogin ? (lang === 'en' ? 'Sign In' : 'লগইন করুন') : (lang === 'en' ? 'Register' : 'রেজিস্টার করুন'))}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.9rem', color: '#64748b' }}>
          {isLogin ? (lang === 'en' ? "Don't have an account? " : 'অ্যাকাউন্ট নেই? ') : (lang === 'en' ? 'Already have an account? ' : 'আগে থেকেই অ্যাকাউন্ট আছে? ')}
          <button onClick={() => { setIsLogin(!isLogin); setError(''); }} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}>
            {isLogin ? (lang === 'en' ? 'Register Now' : 'রেজিস্টার করুন') : (lang === 'en' ? 'Sign In' : 'লগইন করুন')}
          </button>
        </div>
      </div>
    </div>
  );
}
