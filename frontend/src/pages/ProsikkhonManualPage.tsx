import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { FileText, Download } from 'lucide-react';

export default function ProsikkhonManualPage() {
  const { lang } = useLanguage();
  const [manuals, setManuals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchManuals = async () => {
      try {
        const response = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/training-manuals');
        if (response.ok) {
          setManuals(await response.json());
        }
      } catch (error) {
        console.error('Failed to fetch manuals', error);
      } finally {
        setLoading(false);
      }
    };
    fetchManuals();
  }, []);

  return (
    <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh', padding: '2rem 0' }}>
      <div className="container">
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', color: 'var(--primary-dark)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileText size={32} /> {lang === 'en' ? 'Training Manuals' : 'প্রশিক্ষণ ম্যানুয়াল'}
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>
            {lang === 'en' ? 'Download our training materials.' : 'আমাদের প্রশিক্ষণ ম্যানুয়ালগুলো ডাউনলোড করুন।'}
          </p>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : manuals.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', background: 'white', borderRadius: 'var(--radius-md)' }}>
            <FileText size={48} color="#cbd5e1" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ color: '#64748b' }}>{lang === 'en' ? 'No manuals found.' : 'কোনো ম্যানুয়াল পাওয়া যায়নি।'}</h3>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {manuals.map((m: any) => (
              <div key={m.id} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                <div style={{ width: '50px', height: '50px', borderRadius: '10px', background: 'var(--bg-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                  <FileText size={24} color="var(--primary)" />
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', color: '#1e293b' }}>
                  {lang === 'en' ? m.titleEn : (m.titleBn || m.titleEn)}
                </h3>
                {m.descriptionBn && (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {lang === 'en' ? m.descriptionEn : m.descriptionBn}
                  </p>
                )}
                {m.fileUrl && (
                  <a href={m.fileUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--primary)', color: 'white', padding: '0.6rem 1.25rem', borderRadius: '8px', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' }}>
                    <Download size={16} /> {lang === 'en' ? 'Download' : 'ডাউনলোড করুন'}
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
