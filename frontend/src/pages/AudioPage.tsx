import React, { useState, useEffect } from 'react';
import { Headphones, Music, Search, Lock, BookOpen, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import AudioPlayer from '../components/AudioPlayer';
import { Link } from 'react-router-dom';

type BookGroup = { book: any | null; lessons: any[] };

export default function AudioPage() {
  const { lang, t } = useLanguage();
  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeId, setActiveId] = useState<number | null>(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [showLockPopup, setShowLockPopup] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<BookGroup | null>(null);

  useEffect(() => {
    const fetchAudio = async () => {
      try {
        const response = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/audio');
        if (response.ok) {
          setLessons(await response.json());
        }
      } catch (error) {
        console.error('Failed to fetch audio', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAudio();

    const activated = localStorage.getItem('deviceActivated');
    if (activated === 'true') {
      setHasAccess(true);
    }
  }, []);

  const bookGroups: BookGroup[] = [];
  const seen = new Set<number | string>();
  lessons.forEach(l => {
    const key = l.book?.id ?? '__general__';
    if (!seen.has(key)) {
      seen.add(key);
      bookGroups.push({ book: l.book ?? null, lessons: [] });
    }
    bookGroups.find(g => (g.book?.id ?? '__general__') === key)!.lessons.push(l);
  });
  bookGroups.sort((a, b) => {
    if (a.book && !b.book) return -1;
    if (!a.book && b.book) return 1;
    return 0;
  });

  const filteredLessons = selectedGroup
    ? selectedGroup.lessons.filter((l: any) => {
        const title = lang === 'en' ? l.titleEn : (l.titleBn || l.titleEn);
        return title.toLowerCase().includes(search.toLowerCase());
      })
    : [];

  const activeLesson = activeId !== null ? filteredLessons.find(l => l.id === activeId) ?? null : null;
  const activeSrc = activeLesson?.audioUrl ?? null;
  const activeIdx = activeLesson ? filteredLessons.findIndex(l => l.id === activeId) : -1;

  const handleClick = (lesson: any) => {
    if (!hasAccess) { setShowLockPopup(true); return; }
    setActiveId(lesson.id);
  };

  const LockPopup = () => {
    const [code, setCode] = useState('');
    const [activating, setActivating] = useState(false);
    const [error, setError] = useState('');

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
          setHasAccess(true);
          setShowLockPopup(false);
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
      <div onClick={() => setShowLockPopup(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
        <div onClick={e => e.stopPropagation()} style={{ background: 'white', borderRadius: '16px', padding: '2.5rem 2rem', maxWidth: '380px', width: '100%', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
            <Lock size={28} color="#dc2626" />
          </div>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.75rem', color: '#1e293b' }}>
            {lang === 'en' ? 'Activation Required' : 'অ্যাক্টিভেশন প্রয়োজন'}
          </h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            {lang === 'en'
              ? 'Please enter your activation code to listen to audio lessons.'
              : 'অডিও লেসন শুনতে আপনার অ্যাক্টিভেশন কোডটি দিন।'}
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
            <button onClick={() => setShowLockPopup(false)} style={{ padding: '0.6rem 1.5rem', borderRadius: '30px', fontSize: '0.9rem', background: '#f1f5f9', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
              {lang === 'en' ? 'Close' : 'বন্ধ করুন'}
            </button>
          </div>
        </div>
      </div>
    );
  };

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
        {showLockPopup && <LockPopup />}

        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', color: 'var(--primary-dark)', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Headphones size={32} /> {lang === 'en' ? 'Audio Lessons' : 'অডিও লেসন'}
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>
            {lang === 'en' ? 'Select a book to listen to its lessons' : 'লেসন শুনতে একটি বই বেছে নিন'}
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
                  {group.book ? (lang === 'en' ? group.book.titleEn : group.book.titleBn) : (lang === 'en' ? 'General Lessons' : 'সাধারণ লেসন')}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Headphones size={13} />
                  {group.lessons.length} {lang === 'en' ? 'lessons' : 'টি লেসন'}
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
      {showLockPopup && <LockPopup />}

      <button
        onClick={() => { setSelectedGroup(null); setSearch(''); setActiveId(null); }}
        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)', fontWeight: 600, fontSize: '0.9rem', marginBottom: '1.25rem', padding: '0.4rem 0' }}
      >
        <ArrowLeft size={16} /> {lang === 'en' ? 'All Books' : 'সব বই'}
      </button>

      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {selectedGroup.book?.imageUrl ? (
            <img src={selectedGroup.book.imageUrl} alt="" style={{ width: '54px', height: '70px', objectFit: 'cover', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }} />
          ) : (
            <div style={{ width: '54px', height: '70px', borderRadius: '8px', background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BookOpen size={26} color="white" />
            </div>
          )}
          <div>
            <h1 style={{ fontSize: '1.8rem', color: 'var(--primary-dark)', marginBottom: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Headphones size={28} />
              {selectedGroup.book ? (lang === 'en' ? selectedGroup.book.titleEn : selectedGroup.book.titleBn) : (lang === 'en' ? 'General Lessons' : 'সাধারণ লেসন')}
            </h1>
            <p style={{ color: 'var(--text-muted)' }}>
              {filteredLessons.length} {lang === 'en' ? 'lessons available' : 'টি লেসন পাওয়া যাচ্ছে'}
            </p>
          </div>
        </div>
        <div className="search-container" style={{ margin: 0, minWidth: '260px' }}>
          <input type="text" placeholder={lang === 'en' ? 'Search lessons...' : 'লেসন খুঁজুন...'} className="search-input" value={search} onChange={e => setSearch(e.target.value)} />
          <button className="search-btn"><Search size={18} /></button>
        </div>
      </div>

      {hasAccess && activeSrc && activeLesson && (
        <div style={{ position: 'sticky', top: '10px', zIndex: 50, marginBottom: '2rem' }}>
          <AudioPlayer
            src={activeSrc}
            title={lang === 'en' ? activeLesson.titleEn : (activeLesson.titleBn || activeLesson.titleEn)}
            subtitle={selectedGroup.book ? (lang === 'en' ? selectedGroup.book.titleEn : selectedGroup.book.titleBn) : undefined}
            hasPrev={activeIdx > 0}
            hasNext={activeIdx < filteredLessons.length - 1}
            onPrev={() => { if (activeIdx > 0) setActiveId(filteredLessons[activeIdx - 1].id); }}
            onNext={() => { if (activeIdx < filteredLessons.length - 1) setActiveId(filteredLessons[activeIdx + 1].id); }}
          />
        </div>
      )}

      {filteredLessons.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-muted)' }}>
          <Headphones size={64} style={{ marginBottom: '1rem', opacity: 0.2 }} />
          <h3>{lang === 'en' ? 'No audio lessons found.' : 'কোনো অডিও লেসন পাওয়া যায়নি।'}</h3>
        </div>
      ) : (() => {
        const hasUnits = filteredLessons.some((l: any) => l.unit);

        const LessonRow = ({ l }: { l: any }) => {
          const isPlaying = hasAccess && activeId === l.id;
          return (
            <div
              onClick={() => handleClick(l)}
              style={{
                display: 'flex', alignItems: 'center', gap: '1rem',
                padding: '0.9rem 1.25rem',
                background: isPlaying ? 'linear-gradient(135deg, #1e293b, #0f172a)' : 'white',
                color: isPlaying ? 'white' : 'inherit',
                border: `1px solid ${isPlaying ? '#334155' : '#e2e8f0'}`,
                borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s',
                boxShadow: isPlaying ? '0 4px 20px rgba(0,0,0,0.15)' : 'none',
                opacity: !hasAccess ? 0.75 : 1,
              }}
            >
              <div style={{
                width: '40px', height: '40px', borderRadius: '50%', flexShrink: 0,
                background: isPlaying ? 'linear-gradient(135deg, #f59e0b, #ef4444)' : '#f1f5f9',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: isPlaying ? '0 2px 8px rgba(245,158,11,0.4)' : 'none'
              }}>
                {!hasAccess ? <Lock size={15} color="#94a3b8" /> : <Music size={17} color={isPlaying ? 'white' : '#64748b'} />}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: '0.92rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {lang === 'en' ? l.titleEn : (l.titleBn || l.titleEn)}
                </div>
                {l.description && (
                  <div style={{ fontSize: '0.76rem', opacity: 0.6, marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{l.description}</div>
                )}
              </div>
              {l.duration && <div style={{ fontSize: '0.8rem', opacity: 0.65, flexShrink: 0 }}>{l.duration}</div>}
            </div>
          );
        };

        if (!hasUnits) {
          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {filteredLessons.map((l: any) => <LessonRow key={l.id} l={l} />)}
            </div>
          );
        }

        const unitGroups: { unit: any | null; lessons: any[] }[] = [];
        const seenUnits = new Set<number | string>();
        filteredLessons.forEach((l: any) => {
          const key = l.unit?.id ?? '__none__';
          if (!seenUnits.has(key)) {
            seenUnits.add(key);
            unitGroups.push({ unit: l.unit ?? null, lessons: [] });
          }
          unitGroups.find(g => (g.unit?.id ?? '__none__') === key)!.lessons.push(l);
        });
        unitGroups.sort((a, b) => {
          if (a.unit && !b.unit) return -1;
          if (!a.unit && b.unit) return 1;
          return (a.unit?.order ?? 0) - (b.unit?.order ?? 0);
        });

        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {unitGroups.map((ug, i) => (
              <div key={i}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem', paddingBottom: '0.6rem', borderBottom: '2px solid #e2e8f0' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'linear-gradient(135deg, #f59e0b, #ef4444)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Headphones size={14} color="white" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '1rem', color: '#1e293b' }}>
                      {ug.unit ? (lang === 'en' ? ug.unit.titleEn : (ug.unit.titleBn || ug.unit.titleEn)) : (lang === 'en' ? 'Other Lessons' : 'অন্যান্য লেসন')}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{ug.lessons.length} {lang === 'en' ? 'lessons' : 'টি লেসন'}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {ug.lessons.map((l: any) => <LessonRow key={l.id} l={l} />)}
                </div>
              </div>
            ))}
          </div>
        );
      })()}
    </div>
  );
}
