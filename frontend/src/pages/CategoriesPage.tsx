import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { BookOpen, ChevronRight } from 'lucide-react';

export default function CategoriesPage() {
  const { lang } = useLanguage();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/categories');
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          {lang === 'en' ? 'All Categories' : 'সকল বিষয়'}
        </h1>
        
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {categories.map((cat: any) => (
              <Link key={cat.id} to={`/books?category=${cat.id}`} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                background: 'white', 
                padding: '1.5rem', 
                borderRadius: 'var(--radius-md)', 
                border: '1px solid #e2e8f0',
                textDecoration: 'none',
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'var(--primary)';
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = '#e2e8f0';
                e.currentTarget.style.boxShadow = 'none';
              }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ color: 'var(--primary)' }}><BookOpen size={24} /></div>
                  <div>
                    <div style={{ fontWeight: 700, color: '#334155' }}>{cat.nameBn}</div>
                    <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{cat.nameEn} {cat._count?.books ? `(${cat._count.books} books)` : ''}</div>
                  </div>
                </div>
                <ChevronRight size={20} color="#cbd5e1" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
