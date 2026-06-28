import React, { useState, useEffect } from 'react';
import { Search, PlayCircle, Lock, BookOpen, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Link } from 'react-router-dom';

function VideoCard({ v, lang, hasAccess, onActivateSuccess }: { v: any, lang: string, hasAccess: boolean, onActivateSuccess: () => void }) {
  const [showLock, setShowLock] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [code, setCode] = useState('');
  const [activating, setActivating] = useState(false);
  const [error, setError] = useState('');

  const thumb = `https://img.youtube.com/vi/${v.youtubeId}/hqdefault.jpg`;

  const handleClick = () => {
    if (!hasAccess) { setShowLock(true); return; }
    setLoaded(true);
  };

  const handleActivate = async () => {
    if (!code.trim()) return;
    setActivating(true);
    setError('');
    
    let deviceId = localStorage.getItem('deviceId');
    if (!deviceId) {
      deviceId = crypto.randomUUID();
      localStorage.setItem('deviceId', deviceId);
    }

    try {
      const res = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/activation/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.trim(), deviceId })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('deviceActivated', 'true');
        setShowLock(false);
        onActivateSuccess();
      } else {
        setError(data.error || 'Activation failed');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setActivating(false);
    }
  };

  return (
    <div
      style={{
        background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px',
        overflow: 'hidden', transition: 'box-shadow 0.2s, transform 0.2s',
        boxShadow: '0 1px 4px rgba(0,0,0,0.05)'
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 1px 4px rgba(0,0,0,0.05)'; (e.currentTarget as HTMLDivElement).style.transform = 'none'; }}
    >
      {loaded ? (
        <div style={{ position: 'relative', paddingTop: '56.25%' }}>
          <iframe
            src={`https://www.youtube.com/embed/${v.youtubeId}?autoplay=1`}
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
            frameBorder="0" allowFullScreen allow="autoplay" title={v.titleEn}
          />
        </div>
      ) : (
        <div onClick={handleClick} style={{ position: 'relative', paddingTop: '56.25%', cursor: 'pointer', overflow: 'hidden' }}>
          <img
            src={thumb} alt={v.titleEn}
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s', filter: hasAccess ? 'none' : 'brightness(0.55)' }}
          />
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.15)' }}>
            {hasAccess ? (
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(220,38,38,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(220,38,38,0.4)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="white" style={{ marginLeft: '3px' }}><path d="M8 5v14l11-7z"/></svg>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid rgba(255,255,255,0.4)' }}>
                  <Lock size={22} color="white" />
                </div>
                <span style={{ color: 'white', fontSize: '0.72rem', fontWeight: 700, background: 'rgba(0,0,0,0.6)', padding: '2px 10px', borderRadius: '20px' }}>
                  {lang === 'en' ? 'Members Only' : 'শুধু সদস্যদের জন্য'}
                </span>
              </div>
            )}
          </div>
          <div style={{ position: 'absolute', bottom: '8px', right: '10px', background: 'rgba(0,0,0,0.75)', color: 'white', fontSize: '0.7rem', padding: '2px 6px', borderRadius: '3px' }}>YouTube</div>
        </div>
      )}
      <div style={{ padding: '1rem' }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.3rem', color: '#1e293b', lineHeight: 1.4 }}>
          {lang === 'en' ? v.titleEn : (v.titleBn || v.titleEn)}
        </h3>
        {v.description && (
          <p style={{ fontSize: '0.82rem', color: '#64748b', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {v.description}
          </p>
        )}
      </div>

      {showLock && (
        <div onClick={() => setShowLock(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: 'white', borderRadius: '16px', padding: '2.5rem 2rem', maxWidth: '380px', width: '100%', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
              <Lock size={28} color="#dc2626" />
            </div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.75rem', color: '#1e293b' }}>
              {lang === 'en' ? 'Activation Required' : 'অ্যাক্টিভেশন প্রয়োজন'}
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              {lang === 'en' ? 'Please enter your activation code to watch videos.' : 'ভিডিও দেখতে আপনার অ্যাক্টিভেশন কোডটি দিন।'}
            </p>
            {error && <p style={{ color: '#dc2626', fontSize: '0.85rem', marginBottom: '1rem', fontWeight: 600 }}>{error}</p>}
            
            <input 
              type="text" 
              placeholder={lang === 'en' ? 'Enter Code' : 'কোড দিন'}
              value={code}
              onChange={e => setCode(e.target.value)}
              style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1', marginBottom: '1rem', textAlign: 'center', fontSize: '1.1rem', letterSpacing: '2px', fontWeight: 600 }}
            />

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button onClick={handleActivate} disabled={activating || !code.trim()} className="btn btn-blue" style={{ padding: '0.6rem 1.5rem', borderRadius: '30px', fontSize: '0.9rem', opacity: (activating || !code.trim()) ? 0.7 : 1, border: 'none', cursor: 'pointer' }}>
                {activating ? (lang === 'en' ? 'Activating...' : 'অ্যাক্টিভেট হচ্ছে...') : (lang === 'en' ? 'Activate' : 'অ্যাক্টিভেট করুন')}
              </button>
              <button onClick={() => setShowLock(false)} style={{ padding: '0.6rem 1.5rem', borderRadius: '30px', fontSize: '0.9rem', background: '#f1f5f9', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                {lang === 'en' ? 'Close' : 'বন্ধ করুন'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

type BookGroup = { book: any | null; videos: any[] };

export default function VideosPage() {
  const { lang } = useLanguage();
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [hasAccess, setHasAccess] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<BookGroup | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/videos');
        if (response.ok) {
          setVideos(await response.json());
        }
      } catch (error) {
        console.error('Failed to fetch videos', error);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();

    const activated = localStorage.getItem('deviceActivated');
    if (activated === 'true') {
      setHasAccess(true);
    }
  }, []);

  const bookGroups: BookGroup[] = [];
  const seen = new Set<number | string>();
  videos.forEach(v => {
    const key = v.book?.id ?? '__general__';
    if (!seen.has(key)) {
      seen.add(key);
      bookGroups.push({ book: v.book ?? null, videos: [] });
    }
    bookGroups.find(g => (g.book?.id ?? '__general__') === key)!.videos.push(v);
  });
  bookGroups.sort((a, b) => {
    if (a.book && !b.book) return -1;
    if (!a.book && b.book) return 1;
    return 0;
  });

  const filteredVideos = selectedGroup
    ? selectedGroup.videos.filter((v: any) => {
        const title = lang === 'en' ? v.titleEn : (v.titleBn || v.titleEn);
        return title.toLowerCase().includes(search.toLowerCase());
      })
    : [];

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!selectedGroup) {
    return (
      <div className="container" style={{ padding: '2rem 1rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', color: 'var(--primary-dark)', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <PlayCircle size={32} /> {lang === 'en' ? 'Video Lessons' : 'ভিডিও ক্লাস'}
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>
            {lang === 'en' ? 'Select a book to view its videos' : 'ভিডিও দেখতে একটি বই বেছে নিন'}
            {!hasAccess && (
              <span style={{ marginLeft: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', background: '#fef2f2', color: '#dc2626', padding: '2px 10px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 700 }}>
                <Lock size={12} /> {lang === 'en' ? 'Activation Required' : 'অ্যাক্টিভেশন প্রয়োজন'}
              </span>
            )}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: '1.5rem' }}>
          {bookGroups.map((group, i) => (
            <div
              key={i}
              onClick={() => setSelectedGroup(group)}
              style={{
                cursor: 'pointer', background: 'white', borderRadius: '14px',
                overflow: 'hidden', border: '1px solid #e2e8f0',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)', transition: 'all 0.2s',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLDivElement).style.boxShadow = '0 10px 28px rgba(0,0,0,0.13)';
                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
                (e.currentTarget as HTMLDivElement).style.transform = 'none';
              }}
            >
              {group.book?.imageUrl ? (
                <img src={group.book.imageUrl} alt="" style={{ width: '100%', height: '190px', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: '190px', background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <BookOpen size={52} color="white" style={{ opacity: 0.65 }} />
                </div>
              )}
              <div style={{ padding: '1rem' }}>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1e293b', lineHeight: 1.4, marginBottom: '0.4rem' }}>
                  {group.book ? (lang === 'en' ? group.book.titleEn : group.book.titleBn) : (lang === 'en' ? 'General Videos' : 'সাধারণ ভিডিও')}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <PlayCircle size={13} />
                  {group.videos.length} {lang === 'en' ? 'videos' : 'টি ভিডিও'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <button
        onClick={() => { setSelectedGroup(null); setSearch(''); }}
        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)', fontWeight: 600, fontSize: '0.9rem', marginBottom: '1.25rem', padding: '0.4rem 0' }}
      >
        <ArrowLeft size={16} /> {lang === 'en' ? 'All Books' : 'সব বই'}
      </button>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {selectedGroup.book?.imageUrl ? (
            <img src={selectedGroup.book.imageUrl} alt="" style={{ width: '54px', height: '70px', objectFit: 'cover', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }} />
          ) : (
            <div style={{ width: '54px', height: '70px', borderRadius: '8px', background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BookOpen size={26} color="white" />
            </div>
          )}
          <div>
            <h1 style={{ fontSize: '1.8rem', color: 'var(--primary-dark)', marginBottom: '0.2rem' }}>
              {selectedGroup.book ? (lang === 'en' ? selectedGroup.book.titleEn : selectedGroup.book.titleBn) : (lang === 'en' ? 'General Videos' : 'সাধারণ ভিডিও')}
            </h1>
            <p style={{ color: 'var(--text-muted)' }}>
              {filteredVideos.length} {lang === 'en' ? 'videos' : 'টি ভিডিও'}
            </p>
          </div>
        </div>
        <div className="search-container" style={{ margin: 0, minWidth: '260px' }}>
          <input type="text" placeholder={lang === 'en' ? 'Search videos...' : 'ভিডিও খুঁজুন...'} className="search-input" value={search} onChange={e => setSearch(e.target.value)} />
          <button className="search-btn"><Search size={18} /></button>
        </div>
      </div>

      {filteredVideos.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
          <PlayCircle size={64} style={{ marginBottom: '1rem', opacity: 0.2 }} />
          <h3>{lang === 'en' ? 'No videos found.' : 'কোনো ভিডিও পাওয়া যায়নি।'}</h3>
        </div>
      ) : (() => {
        const hasUnits = filteredVideos.some(v => v.unit);
        if (!hasUnits) {
          return (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
              {filteredVideos.map(v => <VideoCard key={v.id} v={v} lang={lang} hasAccess={hasAccess} onActivateSuccess={() => setHasAccess(true)} />)}
            </div>
          );
        }
        
        const unitGroups: { unit: any | null; videos: any[] }[] = [];
        const seenUnits = new Set<number | string>();
        filteredVideos.forEach(v => {
          const key = v.unit?.id ?? '__none__';
          if (!seenUnits.has(key)) {
            seenUnits.add(key);
            unitGroups.push({ unit: v.unit ?? null, videos: [] });
          }
          unitGroups.find(g => (g.unit?.id ?? '__none__') === key)!.videos.push(v);
        });
        unitGroups.sort((a, b) => {
          if (a.unit && !b.unit) return -1;
          if (!a.unit && b.unit) return 1;
          return (a.unit?.order ?? 0) - (b.unit?.order ?? 0);
        });
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            {unitGroups.map((ug, i) => (
              <div key={i}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem', paddingBottom: '0.6rem', borderBottom: '2px solid #e2e8f0' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'linear-gradient(135deg, #f59e0b, #ef4444)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <PlayCircle size={15} color="white" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '1rem', color: '#1e293b' }}>
                      {ug.unit ? (lang === 'en' ? ug.unit.titleEn : (ug.unit.titleBn || ug.unit.titleEn)) : (lang === 'en' ? 'Other Videos' : 'অন্যান্য ভিডিও')}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{ug.videos.length} {lang === 'en' ? 'videos' : 'টি ভিডিও'}</div>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
                  {ug.videos.map(v => <VideoCard key={v.id} v={v} lang={lang} hasAccess={hasAccess} onActivateSuccess={() => setHasAccess(true)} />)}
                </div>
              </div>
            ))}
          </div>
        );
      })()}
    </div>
  );
}
