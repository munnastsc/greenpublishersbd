'use client';
import { Link } from 'react-router-dom';
import { Home, BookOpen, ShoppingCart, User, LayoutGrid } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function BottomNav() {
  const { cart } = useCart();
  const { lang } = useLanguage();
  const location = useLocation(); const pathname = location.pathname;
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const u = localStorage.getItem('user');
    if (u) setUser(JSON.parse(u));
  }, [pathname]);

  const links = [
    { href: '/', icon: Home, labelEn: 'Home', labelBn: 'হোম' },
    { href: '/books', icon: BookOpen, labelEn: 'Books', labelBn: 'বই' },
    { href: '/cart', icon: ShoppingCart, labelEn: 'Cart', labelBn: 'কার্ট', badge: cart.length },
    { href: '/categories', icon: LayoutGrid, labelEn: 'Category', labelBn: 'বিভাগ' },
    {
      href: user ? '/profile' : '/auth',
      icon: User,
      labelEn: user ? user.name.split(' ')[0] : 'Login',
      labelBn: user ? user.name.split(' ')[0] : 'লগইন',
    },
  ];

  return (
    <nav className="bottom-nav">
      {links.map(({ href, icon: Icon, labelEn, labelBn, badge }) => {
        const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
        return (
          <Link key={href} href={href} className={`bottom-nav-item${active ? ' active' : ''}`}>
            <div style={{ position: 'relative' }}>
              <Icon size={22} />
              {badge ? <span className="bottom-nav-badge">{badge}</span> : null}
            </div>
            <span>{lang === 'bn' ? labelBn : labelEn}</span>
          </Link>
        );
      })}
    </nav>
  );
}
