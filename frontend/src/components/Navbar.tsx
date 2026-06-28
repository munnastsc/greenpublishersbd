'use client';

import { Link } from 'react-router-dom';
import { BookOpen, ShoppingCart, User, Search, Menu, Phone, Globe, Heart, ShieldCheck, X, Headphones, Video, Users, LayoutGrid, BookMarked, FileText } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Navbar({ initialMenus = [] }: { initialMenus?: any[] }) {
  const { lang, setLang, t } = useLanguage();
  const { cart } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); const pathname = location.pathname;

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, [pathname]);

  useEffect(() => {
    setMobileMenuOpen(false);
    setMobileSearchOpen(false);
  }, [pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/books?search=${encodeURIComponent(searchQuery)}`);
      setMobileSearchOpen(false);
    }
  };

  const [dynamicMenus, setDynamicMenus] = useState<any[]>([]);

  useEffect(() => {
    fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/menuitems')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) setDynamicMenus(data);
      })
      .catch(console.error);
  }, []);

  const navLinks = dynamicMenus.length > 0 ? dynamicMenus : (initialMenus && initialMenus.length > 0 ? initialMenus : [
    { id: 1, url: '/books', labelEn: 'Books', labelBn: 'বই' },
    { id: 5, url: '/audio', labelEn: 'Audio', labelBn: 'অডিও' },
    { id: 6, url: '/videos', labelEn: 'Video', labelBn: 'ভিডিও' },
    { id: 7, url: '/prosikkhon-manual', labelEn: 'Training Manual', labelBn: 'প্রশিক্ষণ ম্যানুয়াল' },
    { id: 4, url: '/shiksha-upokoron', labelEn: 'Education Tools', labelBn: 'শিক্ষা উপকরণ' }
  ]);

  const DRAWER_ICONS: Record<string, React.ReactNode> = {
    '/books': <BookOpen size={17} />,
    '/videos': <Video size={17} />,
    '/audio': <Headphones size={17} />,
    '/authors': <Users size={17} />,
    '/categories': <LayoutGrid size={17} />,
    '/contact': <Phone size={17} />,
    '/shiksha-upokoron': <BookMarked size={17} />,
    '/prosikkhon-manual': <FileText size={17} />,
  };

  return (
    <header className="site-header">
      {/* Top Bar */}
      <div className="top-bar">
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '1.5rem', color: '#64748b', fontWeight: 500 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Phone size={14} /> 16297
            </span>
            <span className="hidden-mobile">{t('Available from 9am - 11pm', 'সকাল ৯টা - রাত ১১টা পর্যন্ত')}</span>
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem' }}>
              <Globe size={14} color="var(--primary)" />
              <span onClick={() => setLang('en')} style={{ color: lang === 'en' ? 'var(--primary)' : '#94a3b8' }}>EN</span>
              <span style={{ color: '#cbd5e1' }}>|</span>
              <span onClick={() => setLang('bn')} style={{ color: lang === 'bn' ? 'var(--primary)' : '#94a3b8' }}>বাং</span>
            </div>
            <Link to="/admin/login" style={{ fontSize: '0.75rem', color: '#94a3b8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
              <ShieldCheck size={12} /> Admin
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="main-header">
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>

          {/* Hamburger (mobile only) */}
          <button
            className="hamburger-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
          >
            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>

          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none', flexShrink: 0 }}>
            <div style={{ backgroundColor: 'var(--primary)', padding: '6px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BookOpen size={26} color="white" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontWeight: 900, fontSize: '1.3rem', color: '#1e293b', lineHeight: 1 }}>Green<span style={{ color: 'var(--primary)' }}>Publishers</span></span>
              <span style={{ fontSize: '0.6rem', fontWeight: 700, color: 'var(--secondary)', letterSpacing: '1px' }}>ONLINE BOOKSTORE</span>
            </div>
          </Link>

          {/* Desktop Search */}
          <form className="search-container desktop-search" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="search-btn" type="submit">
              <Search size={20} />
            </button>
          </form>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            {/* Mobile Search Toggle */}
            <button
              className="mobile-search-btn"
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
            >
              <Search size={22} />
            </button>

            <Link to="/cart" style={{ display: 'flex', alignItems: 'center', color: '#334155', textDecoration: 'none', position: 'relative' }}>
              <div style={{ position: 'relative' }}>
                <ShoppingCart size={24} />
                {cart.length > 0 && (
                  <span style={{ position: 'absolute', top: '-10px', right: '-10px', backgroundColor: 'var(--secondary)', color: 'white', borderRadius: '50%', width: '18px', height: '18px', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                    {cart.length}
                  </span>
                )}
              </div>
            </Link>

            <Link to="/wishlist" className="hidden-mobile">
              <Heart size={24} color="#334155" />
            </Link>

            {user ? (
              <Link to="/profile" style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '7px 14px',
                borderRadius: 'var(--radius-sm)', border: '1px solid #e2e8f0',
                color: 'var(--primary)', textDecoration: 'none', fontWeight: 700, fontSize: '0.9rem'
              }}>
                <User size={18} /> <span className="hidden-mobile">{user.name.split(' ')[0]}</span>
              </Link>
            ) : (
              <Link to="/auth" style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '7px 14px',
                borderRadius: 'var(--radius-sm)', border: '1px solid #e2e8f0',
                color: '#334155', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem'
              }}>
                <User size={18} /> <span className="hidden-mobile">{t('Sign In', 'লগইন')}</span>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Search Bar */}
        {mobileSearchOpen && (
          <div className="mobile-search-bar" style={{ padding: '0.75rem 1rem', borderTop: '1px solid #e2e8f0', background: 'white' }}>
            <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                placeholder={t('searchPlaceholder')}
                className="form-control"
                value={searchQuery}
                autoFocus
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="btn btn-blue" style={{ padding: '0 1rem', flexShrink: 0 }}>
                <Search size={18} />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Desktop Nav Bar */}
      <nav className="nav-bar desktop-nav">
        <div className="container">
          <ul>
            <li>
              <Link to="/categories" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--primary)', fontWeight: 700 }}>
                <Menu size={20} /> {t('allCategories')}
              </Link>
            </li>
            {navLinks.map((m: any) => (
              <li key={m.id}>
                <Link to={m.url}>{lang === 'en' ? m.labelEn : m.labelBn}</Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Mobile Nav Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-nav-drawer" style={{
          position: 'fixed', top: 0, left: 0, width: '75%', maxWidth: '300px',
          height: '100vh', background: 'white', zIndex: 1000, boxShadow: '4px 0 20px rgba(0,0,0,0.15)',
          overflowY: 'auto', padding: '0'
        }}>
          <div style={{ background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))', padding: '1.1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: '5px', borderRadius: '6px', display: 'flex' }}>
                <BookOpen size={20} color="white" />
              </div>
              <div>
                <div style={{ color: 'white', fontWeight: 800, fontSize: '0.95rem', lineHeight: 1 }}>GreenPublishers<span style={{ color: '#fcd34d' }}>BD</span></div>
                <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.58rem', letterSpacing: '1px', marginTop: '2px' }}>ONLINE BOOKSTORE</div>
              </div>
            </div>
            <button onClick={() => setMobileMenuOpen(false)} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: 'white', cursor: 'pointer', borderRadius: '6px', padding: '5px', display: 'flex' }}>
              <X size={22} />
            </button>
          </div>
          {user && (
            <div style={{ padding: '0.85rem 1.25rem', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '1rem', flexShrink: 0 }}>
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1e293b' }}>{user.name}</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{user.email}</div>
              </div>
            </div>
          )}
          <nav style={{ padding: '0.5rem 0' }}>
            <Link to="/categories" onClick={() => setMobileMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.8rem 1.25rem', color: 'var(--primary)', fontWeight: 700, textDecoration: 'none', borderBottom: '1px solid #f1f5f9' }}>
              <LayoutGrid size={17} /> {t('allCategories')}
            </Link>
            {navLinks.map((m: any) => (
              <Link key={m.id} to={m.url} onClick={() => setMobileMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.8rem 1.25rem', color: '#334155', fontWeight: 500, textDecoration: 'none', borderBottom: '1px solid #f1f5f9', fontSize: '0.93rem' }}>
                <span style={{ color: 'var(--primary)', display: 'flex' }}>{DRAWER_ICONS[m.url] ?? <BookOpen size={17} />}</span>
                {lang === 'en' ? m.labelEn : m.labelBn}
              </Link>
            ))}
            <Link to="/wishlist" onClick={() => setMobileMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.8rem 1.25rem', color: '#334155', fontWeight: 500, textDecoration: 'none', borderBottom: '1px solid #f1f5f9', fontSize: '0.93rem' }}>
              <Heart size={17} color="#ef4444" /> {lang === 'en' ? 'Wishlist' : 'উইশলিস্ট'}
            </Link>
            {!user ? (
              <Link to="/auth" onClick={() => setMobileMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.85rem 1.25rem', color: 'white', fontWeight: 700, textDecoration: 'none', background: 'var(--primary)', margin: '1rem', borderRadius: '10px', justifyContent: 'center', fontSize: '0.95rem' }}>
                <User size={18} /> {lang === 'en' ? 'Sign In / Register' : 'লগইন / রেজিস্টার'}
              </Link>
            ) : (
              <Link to="/profile" onClick={() => setMobileMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.85rem 1.25rem', color: 'var(--primary)', fontWeight: 700, textDecoration: 'none', background: '#eff6ff', margin: '1rem', borderRadius: '10px', justifyContent: 'center', fontSize: '0.95rem', border: '1px solid #bfdbfe' }}>
                <User size={18} /> {lang === 'en' ? 'My Profile' : 'আমার প্রোফাইল'}
              </Link>
            )}
          </nav>
        </div>
      )}

      {/* Mobile Nav Overlay */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 999 }}
        />
      )}
    </header>
  );
}
