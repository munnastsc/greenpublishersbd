'use client';
import { Link } from 'react-router-dom';
import { BookOpen, Phone, Mail, MapPin, Share2, Play } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Footer() {
  const { lang } = useLanguage();

  return (
    <footer style={{ backgroundColor: '#1e293b', color: '#e2e8f0', marginTop: 'auto' }}>
      {/* Main Footer */}
      <div className="container" style={{ padding: '3rem 1rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem' }}>
        {/* Brand */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <BookOpen size={28} color="#10b981" />
            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: 'white' }}>
              GreenPublishers<span style={{ color: '#f59e0b' }}>BD</span>
            </h3>
          </div>
          <p style={{ color: '#94a3b8', lineHeight: 1.7, fontSize: '0.9rem' }}>
            {lang === 'en'
              ? 'Your trusted partner for quality books and educational video lessons in Bangladesh.'
              : 'বাংলাদেশে মানসম্পন্ন বই ও শিক্ষামূলক ভিডিওর জন্য আপনার বিশ্বস্ত অংশীদার।'}
          </p>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <a href="#" style={{ color: '#94a3b8', transition: 'color 0.2s' }} onMouseEnter={e => ((e.target as any).style.color = '#3b82f6')} onMouseLeave={e => ((e.target as any).style.color = '#94a3b8')}>
              <Share2 size={22} />
            </a>
            <a href="#" style={{ color: '#94a3b8', transition: 'color 0.2s' }} onMouseEnter={e => ((e.target as any).style.color = '#ef4444')} onMouseLeave={e => ((e.target as any).style.color = '#94a3b8')}>
              <Play size={22} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-links-hide">
          <h4 style={{ color: 'white', marginBottom: '1rem', fontSize: '1rem', borderBottom: '1px solid #334155', paddingBottom: '0.5rem' }}>
            {lang === 'en' ? 'Quick Links' : 'দ্রুত লিঙ্ক'}
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {[
              { en: 'Home', bn: 'হোম', url: '/' },
              { en: 'Books', bn: 'বই', url: '/books' },
              { en: 'Video Lessons', bn: 'ভিডিও ক্লাস', url: '/videos' },
              { en: 'About Us', bn: 'আমাদের সম্পর্কে', url: '/about' },
              { en: 'Contact Us', bn: 'যোগাযোগ', url: '/contact' },
            ].map(item => (
              <li key={item.url}>
                <Link to={item.url} style={{ color: '#94a3b8', fontSize: '0.9rem', transition: 'color 0.2s' }}
                  onMouseEnter={e => ((e.target as any).style.color = '#10b981')}
                  onMouseLeave={e => ((e.target as any).style.color = '#94a3b8')}>
                  › {lang === 'en' ? item.en : item.bn}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Categories */}
        <div className="footer-links-hide">
          <h4 style={{ color: 'white', marginBottom: '1rem', fontSize: '1rem', borderBottom: '1px solid #334155', paddingBottom: '0.5rem' }}>
            {lang === 'en' ? 'Categories' : 'বিভাগসমূহ'}
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {[
              { en: 'Fiction', bn: 'ফিকশন' },
              { en: 'Academic', bn: 'একাডেমিক' },
              { en: 'Science Fiction', bn: 'সায়েন্স ফিকশন' },
              { en: 'Poetry', bn: 'কবিতা' },
            ].map(c => (
              <li key={c.en}>
                <Link to={`/books?category=${c.en}`} style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                  › {lang === 'en' ? c.en : c.bn}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 style={{ color: 'white', marginBottom: '1rem', fontSize: '1rem', borderBottom: '1px solid #334155', paddingBottom: '0.5rem' }}>
            {lang === 'en' ? 'Contact Us' : 'যোগাযোগ'}
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', color: '#94a3b8', fontSize: '0.9rem' }}>
            <li style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
              <MapPin size={16} style={{ marginTop: '2px', flexShrink: 0, color: '#10b981' }} />
              Dhaka, Bangladesh
            </li>
            <li style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <Phone size={16} style={{ flexShrink: 0, color: '#10b981' }} />
              +880 1234 567 890
            </li>
            <li style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <Mail size={16} style={{ flexShrink: 0, color: '#10b981' }} />
              info@greenpublishersbd.com
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{ borderTop: '1px solid #334155', padding: '1rem' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          <p style={{ color: '#64748b', fontSize: '0.85rem', margin: 0 }}>
            &copy; {new Date().getFullYear()} Green Publishers BD. All rights reserved.
          </p>
          <p style={{ color: '#64748b', fontSize: '0.85rem', margin: 0 }}>
            www.greenpublishersbd.com
          </p>
        </div>
      </div>
    </footer>
  );
}
