import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { BookOpen, ShoppingCart, Star, Share2, Check, ShieldCheck, Truck, RefreshCcw, Heart, PlayCircle, MessageSquare, Send, ExternalLink, Headphones } from 'lucide-react';
import AudioPlayer from '../components/AudioPlayer';

function LazyVideoCard({ video, lang }: { video: any, lang: string }) {
  const [loaded, setLoaded] = useState(false);
  const thumb = `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`;
  return (
    <div style={{ background: 'white', borderRadius: '4px', overflow: 'hidden', border: '1px solid #e0f2fe' }}>
      {loaded ? (
        <div style={{ position: 'relative', paddingTop: '56.25%' }}>
          <iframe src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1`} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} frameBorder="0" allowFullScreen allow="autoplay" />
        </div>
      ) : (
        <div onClick={() => setLoaded(true)} style={{ position: 'relative', paddingTop: '56.25%', cursor: 'pointer' }}>
          <img src={thumb} alt={video.titleEn} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.2)' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <PlayCircle size={32} color="#dc2626" fill="#dc2626" />
            </div>
          </div>
        </div>
      )}
      <div style={{ padding: '0.75rem' }}>
        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0c4a6e' }}>{lang === 'en' ? video.titleEn : video.titleBn}</div>
      </div>
    </div>
  );
}

export default function BookDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const { addToCart } = useCart();
  
  const [book, setBook] = useState<any>(null);
  const [relatedBooks, setRelatedBooks] = useState<any[]>([]);
  const [videos, setVideos] = useState<any[]>([]);
  const [audioList, setAudioList] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [inWishlist, setInWishlist] = useState(false);
  
  const [reviews, setReviews] = useState<any[]>([]); // Stubbed for now
  const [activeAudioIdx, setActiveAudioIdx] = useState(0);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch book details
        const bookRes = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/books/${id}`);
        if (!bookRes.ok) throw new Error('Book not found');
        const bookData = await bookRes.json();
        setBook(bookData);

        // Fetch related books by category
        if (bookData.categoryId) {
          const relRes = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/categories/${bookData.categoryId}/books`);
          if (relRes.ok) {
            const relData = await relRes.json();
            setRelatedBooks(relData.filter((b: any) => b.id !== bookData.id).slice(0, 4));
          }
        }

        // Fetch videos
        const vidRes = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/videos`);
        if (vidRes.ok) {
          const allVids = await vidRes.json();
          setVideos(allVids.filter((v: any) => v.bookId === bookData.id));
        }

        // Fetch audio
        const audRes = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/audio`);
        if (audRes.ok) {
          const allAud = await audRes.json();
          setAudioList(allAud.filter((a: any) => a.bookId === bookData.id));
        }

      } catch (error) {
        console.error('Failed to fetch data', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  const handleAdd = () => {
    if (book) {
      addToCart({ id: book.id, titleEn: book.titleEn, titleBn: book.titleBn, price: book.price, imageUrl: book.imageUrl, quantity: 1 });
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  const toggleWishlist = () => {
    if (!user) {
      alert(lang === 'en' ? 'Please login to add to wishlist' : 'উইশলিস্টে যোগ করতে লগইন করুন');
      return;
    }
    setInWishlist(!inWishlist);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!book) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <h1 style={{ fontSize: '1.5rem', color: 'var(--text-muted)' }}>Book not found</h1>
      </div>
    );
  }

  const avgRating = 5; // Stubbed

  return (
    <div style={{ backgroundColor: 'var(--bg-color)' }}>
      <div className="container" style={{ padding: '2rem 1rem' }}>
        <div className="product-grid">

          {/* Column 1: Image */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="product-image-box" style={{ position: 'relative' }}>
              {book.imageUrl ? (
                <img src={book.imageUrl} alt={book.titleEn} style={{ width: '100%', height: 'auto', borderRadius: 'var(--radius-sm)' }} />
              ) : (
                <div style={{ width: '100%', height: '350px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
                  <BookOpen size={100} color="#cbd5e1" />
                </div>
              )}
              <button
                onClick={toggleWishlist}
                style={{
                  position: 'absolute', top: '15px', right: '15px', background: 'white',
                  border: '1px solid #e2e8f0', borderRadius: '50%', width: '40px', height: '40px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                  boxShadow: 'var(--shadow-sm)', color: inWishlist ? '#dc2626' : '#64748b'
                }}>
                <Heart size={20} fill={inWishlist ? 'currentColor' : 'none'} />
              </button>
            </div>
            <button className="btn btn-outline" style={{ width: '100%', fontWeight: 700, padding: '0.8rem' }}>
              {lang === 'en' ? 'Look Inside' : 'একটু পড়ে দেখুন'}
            </button>
          </div>

          {/* Column 2: Details */}
          <div className="product-info-box">
            <div style={{ borderBottom: '1px solid #eee', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
              <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#111827', lineHeight: 1.2 }}>
                {lang === 'en' ? book.titleEn : book.titleBn}
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem' }}>
                <span style={{ color: '#6b7280' }}>{lang === 'en' ? 'by' : 'লেখক:'}</span>
                <Link to={`/books?author=${book.authorId}`} style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
                  {book.author ? (lang === 'en' ? book.author.nameEn : book.author.nameBn) : 'Unknown Author'}
                </Link>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#f59e0b' }}>
                  {[1, 2, 3, 4, 5].map(i => <Star key={i} size={16} fill={i <= avgRating ? 'currentColor' : 'none'} />)}
                </div>
                <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                  {lang === 'en' ? '5.0 Rating (0 Reviews)' : '৫.০ রেটিং (০টি রিভিউ)'}
                </span>
              </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '2.25rem', fontWeight: 800, color: '#111827' }}>TK. {book.price}</span>
                {book.originalPrice && book.originalPrice > book.price && (
                  <>
                    <span style={{ fontSize: '1.25rem', color: '#9ca3af', textDecoration: 'line-through' }}>TK. {book.originalPrice}</span>
                    <span style={{ color: 'var(--secondary)', fontWeight: 700, fontSize: '1rem' }}>
                      {Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100)}% {lang === 'en' ? 'OFF' : 'ছাড়'}
                    </span>
                  </>
                )}
              </div>
              <p style={{ color: '#10b981', fontWeight: 600, marginTop: '0.5rem', fontSize: '0.95rem' }}>
                {lang === 'en' ? 'In Stock (Available)' : 'স্টকে আছে'}
              </p>
            </div>

            {/* Cart + Buy buttons */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
              <button
                onClick={handleAdd}
                className="btn btn-blue"
                style={{ flex: 1, minWidth: '150px', padding: '1rem', fontSize: '1rem', backgroundColor: added ? '#10b981' : 'var(--primary)', display: 'flex', gap: '0.5rem', justifyContent: 'center' }}
              >
                {added ? <Check size={20} /> : <ShoppingCart size={20} />}
                {added ? (lang === 'en' ? 'Added!' : 'যোগ হয়েছে') : (lang === 'en' ? 'Add to Cart' : 'কার্টে যোগ করুন')}
              </button>
              <button
                onClick={() => { handleAdd(); navigate('/cart'); }}
                className="btn btn-orange"
                style={{ flex: 1, minWidth: '150px', padding: '1rem', fontSize: '1rem', justifyContent: 'center', display: 'flex' }}
              >
                {lang === 'en' ? 'Buy Now' : 'এখনই কিনুন'}
              </button>
            </div>

            {/* Rokomari Link */}
            {book.rokomariLink && (
              <a
                href={book.rokomariLink}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
                  width: '100%', padding: '0.85rem', marginBottom: '2rem',
                  background: 'linear-gradient(135deg, #ff6b00, #f59e0b)',
                  color: 'white', borderRadius: 'var(--radius-sm)',
                  fontSize: '1rem', fontWeight: 700, textDecoration: 'none',
                  boxShadow: '0 2px 8px rgba(255,107,0,0.3)'
                }}
              >
                <ExternalLink size={18} /> {lang === 'en' ? 'Buy from Rokomari' : 'রকমারিতে কিনুন'}
              </a>
            )}

            {/* Audio Lessons */}
            {audioList.length > 0 && (
              <div style={{ marginTop: '2rem', marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1e293b' }}>
                  <Headphones size={24} color="var(--primary)" /> {lang === 'en' ? 'Audio Lessons' : 'অডিও লেসন'}
                </h3>
                <AudioPlayer
                  src={audioList[activeAudioIdx]?.audioUrl}
                  title={lang === 'en' ? audioList[activeAudioIdx]?.titleEn : (audioList[activeAudioIdx]?.titleBn || audioList[activeAudioIdx]?.titleEn)}
                  subtitle={lang === 'en' ? `Lesson ${activeAudioIdx + 1} of ${audioList.length}` : `লেসন ${activeAudioIdx + 1} / ${audioList.length}`}
                  hasPrev={activeAudioIdx > 0}
                  hasNext={activeAudioIdx < audioList.length - 1}
                  onPrev={() => setActiveAudioIdx(i => Math.max(0, i - 1))}
                  onNext={() => setActiveAudioIdx(i => Math.min(audioList.length - 1, i + 1))}
                />
                {audioList.length > 1 && (
                  <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {audioList.map((a: any, idx: number) => (
                      <button
                        key={a.id}
                        onClick={() => setActiveAudioIdx(idx)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '0.75rem',
                          padding: '0.6rem 1rem',
                          background: activeAudioIdx === idx ? '#f1f5f9' : 'transparent',
                          border: `1px solid ${activeAudioIdx === idx ? 'var(--primary)' : '#e2e8f0'}`,
                          borderRadius: '8px', cursor: 'pointer', textAlign: 'left', transition: '0.15s',
                          color: activeAudioIdx === idx ? 'var(--primary)' : '#334155'
                        }}
                      >
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, minWidth: '20px', opacity: 0.5 }}>{idx + 1}</span>
                        <span style={{ flex: 1, fontSize: '0.88rem', fontWeight: activeAudioIdx === idx ? 700 : 400 }}>
                          {lang === 'en' ? a.titleEn : (a.titleBn || a.titleEn)}
                        </span>
                        {a.duration && <span style={{ fontSize: '0.75rem', opacity: 0.55 }}>{a.duration}</span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Video Lessons */}
            {videos.length > 0 && (
              <div style={{ marginTop: '2rem', background: '#f0f9ff', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid #bae6fd' }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0369a1' }}>
                  <PlayCircle size={24} /> {lang === 'en' ? 'Lesson Videos' : 'বইয়ের ভিডিও লেসনসমূহ'}
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                  {videos.map(v => (
                    <LazyVideoCard key={v.id} video={v} lang={lang} />
                  ))}
                </div>
              </div>
            )}

            {/* Specifications */}
            <div style={{ marginTop: '3rem' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', borderBottom: '2px solid #eee', paddingBottom: '0.5rem', display: 'inline-block' }}>
                {lang === 'en' ? 'Specifications' : 'বইয়ের বিবরণ'}
              </h3>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  {[
                    { labelEn: 'Title', labelBn: 'বইয়ের নাম', valEn: book.titleEn, valBn: book.titleBn },
                    { labelEn: 'Author', labelBn: 'লেখক', valEn: book.author?.nameEn, valBn: book.author?.nameBn },
                    { labelEn: 'Category', labelBn: 'বিষয়', valEn: book.category?.nameEn, valBn: book.category?.nameBn },
                    { labelEn: 'Publisher', labelBn: 'প্রকাশনী', valEn: book.publisher?.nameEn, valBn: book.publisher?.nameBn },
                  ].map((row, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td style={{ padding: '0.8rem 0', color: '#6b7280', width: '30%', fontWeight: 500 }}>{lang === 'en' ? row.labelEn : row.labelBn}</td>
                      <td style={{ padding: '0.8rem 0', color: '#111827', fontWeight: 600 }}>{lang === 'en' ? row.valEn : row.valBn}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Description */}
            {book.description && (
              <div style={{ marginTop: '2rem' }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', borderBottom: '2px solid #eee', paddingBottom: '0.5rem', display: 'inline-block' }}>
                  {lang === 'en' ? 'Description' : 'বই সম্পর্কে'}
                </h3>
                <div 
                  className="prose"
                  style={{ color: '#4b5563', lineHeight: 1.6 }}
                  dangerouslySetInnerHTML={{ __html: book.description }}
                />
              </div>
            )}
          </div>

          {/* Column 3: Sidebar */}
          <aside className="product-sidebar">
            <div className="sidebar-card">
              <h4 style={{ marginBottom: '1rem', fontSize: '1rem' }}>{lang === 'en' ? 'Green Publishers Promise' : 'আমাদের প্রতিশ্রুতি'}</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', fontSize: '0.85rem' }}>
                  <div style={{ backgroundColor: '#f1f5f9', padding: '8px', borderRadius: '50%' }}><Truck size={18} color="var(--primary)" /></div>
                  <span>{lang === 'en' ? 'Fast Home Delivery' : 'সারা দেশে হোম ডেলিভারি'}</span>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', fontSize: '0.85rem' }}>
                  <div style={{ backgroundColor: '#f1f5f9', padding: '8px', borderRadius: '50%' }}><ShieldCheck size={18} color="var(--primary)" /></div>
                  <span>{lang === 'en' ? '100% Original Books' : '১০০% অরিজিনাল বই'}</span>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', fontSize: '0.85rem' }}>
                  <div style={{ backgroundColor: '#f1f5f9', padding: '8px', borderRadius: '50%' }}><RefreshCcw size={18} color="var(--primary)" /></div>
                  <span>{lang === 'en' ? 'Easy Return Policy' : 'সহজ রিটার্ন পলিসি'}</span>
                </div>
              </div>
            </div>

            {relatedBooks.length > 0 && (
              <div className="sidebar-card" style={{ padding: '1rem' }}>
                <h4 style={{ marginBottom: '1rem', fontSize: '1rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>
                  {lang === 'en' ? 'Related Books' : 'সম্পর্কিত বই'}
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {relatedBooks.map((rb: any) => (
                    <Link key={rb.id} to={`/books/${rb.id}`} style={{ display: 'flex', gap: '0.75rem', textDecoration: 'none' }}>
                      <div style={{ width: '60px', height: '80px', backgroundColor: '#f3f4f6', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '2px' }}>
                        {rb.imageUrl ? <img src={rb.imageUrl} alt={rb.titleEn} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <BookOpen size={24} color="#cbd5e1" />}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#333', lineHeight: 1.3 }}>{lang === 'en' ? rb.titleEn : rb.titleBn}</span>
                        <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{rb.author ? (lang === 'en' ? rb.author.nameEn : rb.author.nameBn) : ''}</span>
                        <span style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 700, marginTop: '2px' }}>TK. {rb.price}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <button className="btn" style={{ background: '#1e293b', color: 'white', width: '100%', fontSize: '0.9rem', display: 'flex', justifyContent: 'center' }}>
              <Share2 size={16} style={{ marginRight: '8px' }} /> {lang === 'en' ? 'Share this book' : 'শেয়ার করুন'}
            </button>
          </aside>
        </div>
      </div>
    </div>
  );
}
