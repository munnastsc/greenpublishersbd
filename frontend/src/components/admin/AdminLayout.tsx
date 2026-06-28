import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Book, Layers, Users, Building,
  Menu as MenuIcon, Video, ShoppingCart, LogOut, Eye, Image as ImageIcon, Tag, Settings, Headphones, BookMarked, FileText, PanelLeft
} from 'lucide-react';

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token && location.pathname !== '/admin/login') {
      navigate('/admin/login');
    } else {
      setChecking(false);
    }
  }, [navigate, location]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  if (checking) return <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem' }}>Loading...</div>;

  const menuItems = [
    { label: 'Dashboard', icon: <LayoutDashboard size={18} />, href: '/admin' },
    { label: 'Manage Books', icon: <Book size={18} />, href: '/admin/books' },
    { label: 'Categories', icon: <Layers size={18} />, href: '/admin/categories' },
    { label: 'Authors', icon: <Users size={18} />, href: '/admin/authors' },
    { label: 'Publishers', icon: <Building size={18} />, href: '/admin/publishers' },
    { label: 'Nav Menus', icon: <MenuIcon size={18} />, href: '/admin/menus' },
    { label: 'Home Sections', icon: <Layers size={18} />, href: '/admin/home-sections' },
    { label: 'Videos', icon: <Video size={18} />, href: '/admin/videos' },
    { label: 'Audio Lessons', icon: <Headphones size={18} />, href: '/admin/audio' },
    { label: 'Units', icon: <Layers size={18} />, href: '/admin/units' },
    { label: 'শিক্ষা উপকরণ', icon: <BookMarked size={18} />, href: '/admin/educational-materials' },
    { label: 'প্রশিক্ষণ ম্যানুয়াল', icon: <FileText size={18} />, href: '/admin/training-manuals' },
    { label: 'Custom Pages', icon: <PanelLeft size={18} />, href: '/admin/custom-pages' },
    { label: 'Banners', icon: <ImageIcon size={18} />, href: '/admin/banners' },
    { label: 'Orders', icon: <ShoppingCart size={18} />, href: '/admin/orders' },
    { label: 'Coupons', icon: <Tag size={18} />, href: '/admin/coupons' },
    { label: 'Users', icon: <Users size={18} />, href: '/admin/users' },
    { label: 'Site Settings', icon: <Settings size={18} />, href: '/admin/settings' },
  ];

  const adminUser = JSON.parse(localStorage.getItem('adminUser') || '{}');

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 80px)', backgroundColor: '#f3f4f6' }}>
      {/* Sidebar */}
      <aside style={{ width: '260px', backgroundColor: '#111827', color: 'white', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid #1f2937', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Book size={24} color="#10b981" />
          <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>Admin<span style={{ color: '#f59e0b' }}>Panel</span></span>
        </div>
        
        <nav style={{ flex: 1, padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem', overflowY: 'auto' }}>
          {menuItems.map(item => {
            // Need to match exactly for Dashboard, but prefix for others
            const isActive = item.href === '/admin' 
              ? location.pathname === '/admin' 
              : location.pathname.startsWith(item.href);

            return (
              <Link key={item.href} to={item.href} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                borderRadius: '0.5rem',
                textDecoration: 'none',
                color: isActive ? 'white' : '#9ca3af',
                backgroundColor: isActive ? '#1f2937' : 'transparent',
                transition: 'all 0.2s',
                fontSize: '0.9rem'
              }}>
                {item.icon} {item.label}
              </Link>
            )
          })}
        </nav>

        <div style={{ padding: '1rem', borderTop: '1px solid #1f2937', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Link to="/" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.75rem 1rem',
            color: '#9ca3af',
            textDecoration: 'none',
            fontSize: '0.9rem'
          }}>
            <Eye size={18} /> View Live Site
          </Link>
          <button onClick={handleLogout} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.75rem 1rem',
            color: '#f87171',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            fontSize: '0.9rem',
            textAlign: 'left',
            width: '100%'
          }}>
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <header style={{ height: '60px', backgroundColor: 'white', padding: '0 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e5e7eb' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1f2937', margin: 0 }}>
            {menuItems.find(m => m.href === location.pathname)?.label || 'Admin Control Panel'}
          </h2>
          <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>
            Logged in as: {adminUser.email || 'admin@greenpublishers.com'}
          </div>
        </header>
        
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', backgroundColor: '#f3f4f6' }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
