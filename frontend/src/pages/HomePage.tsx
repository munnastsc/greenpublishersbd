import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { BookOpen, Star, ChevronRight, ShoppingCart, ArrowRight, Library, GraduationCap, Moon, Calculator, Globe2, BookMarked } from 'lucide-react';

export default function HomePage() {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [banners, setBanners] = useState([]);
  const [homeSections, setHomeSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const { lang, t } = useLanguage();
  const { addToCart } = useCart();

  const categoryIcons = [
    <Library size={24} />,
    <GraduationCap size={24} />,
    <Moon size={24} />,
    <Calculator size={24} />,
    <Globe2 size={24} />,
    <BookMarked size={24} />
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [booksRes, catRes, bannerRes, sectionRes] = await Promise.all([
          fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/books?limit=12'),
          fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/categories'),
          fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/banners'),
          fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/homesections')
        ]);
        
        if (booksRes.ok) setBooks(await booksRes.json());
        if (catRes.ok) setCategories(await catRes.json());
        if (bannerRes.ok) setBanners(await bannerRes.json());
        if (sectionRes.ok) setHomeSections(await sectionRes.json());
      } catch (error) {
        console.error('Failed to fetch data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const activeBanner: any = banners.find((b: any) => b.isActive) || null;
  const activeSections = homeSections.filter((s: any) => s.isActive).sort((a: any, b: any) => a.sortOrder - b.sortOrder);

  return (
    <div style={{ paddingBottom: '4rem' }}>
      {/* Dynamic Banner */}
      <div className="container" style={{ margin: '1rem auto' }}>
        <div className="banner-box" style={{
          width: '100%',
          height: '300px',
          background: activeBanner?.imageUrl ? `url(${activeBanner.imageUrl}) center/cover no-repeat` : 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
          borderRadius: 'var(--radius-sm)',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          padding: '2.5rem 4rem',
          color: 'white',
          boxShadow: 'var(--shadow-sm)'
        }}>
          {!activeBanner?.imageUrl && (
            <>
              <div style={{ zIndex: 1, maxWidth: '65%' }}>
                <span style={{ backgroundColor: 'var(--secondary)', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 800, marginBottom: '1rem', display: 'inline-block' }}>
                  {activeBanner ? (lang === 'en' ? activeBanner.titleEn : (activeBanner.titleBn || activeBanner.titleEn)) : (lang === 'en' ? 'WELCOME' : 'স্বাগতম')}
                </span>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '0.8rem', color: 'white', lineHeight: 1.1, fontWeight: 900 }}>
                  {activeBanner ? (lang === 'en' ? activeBanner.titleEn : (activeBanner.titleBn || activeBanner.titleEn)) : (lang === 'en' ? 'Welcome to Green Publishers' : 'গ্রিন পাবলিশার্স বিডিতে আপনাকে স্বাগতম')}
                </h1>
                <p style={{ fontSize: '1rem', marginBottom: '2rem', opacity: 0.9, fontWeight: 400 }}>
                  {lang === 'en' ? 'Find your next favorite book here.' : 'আপনার পরবর্তী পছন্দের বইটি এখানে খুঁজে নিন।'}
                </p>
                <Link to={activeBanner?.linkUrl || "/books"} className="btn btn-orange" style={{ padding: '0.7rem 2rem', fontSize: '0.95rem', borderRadius: '30px', textDecoration: 'none', display: 'inline-block' }}>
                  {lang === 'en' ? 'Explore More' : 'আরও দেখুন'}
                </Link>
              </div>
              <div style={{ position: 'absolute', right: '5%', bottom: '-20px', width: '280px', height: '350px', opacity: 0.15 }}>
                <BookOpen size={260} color="white" />
              </div>
            </>
          )}
          {activeBanner?.imageUrl && activeBanner?.linkUrl && (
             <Link to={activeBanner.linkUrl} style={{ position: 'absolute', inset: 0 }} />
          )}
        </div>
      </div>

      {/* Categories */}
      {categories.length > 0 && (
        <div className="container" style={{ marginTop: '2.5rem' }}>
          <div className="home-section-header" style={{ marginBottom: '15px' }}>
            <h2 className="section-title" style={{ fontSize: '1.2rem' }}>{lang === 'en' ? 'Shop by Subject' : 'বিষয় ভিত্তিক বই'}</h2>
            <Link to="/categories" style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 700, textDecoration: 'none' }}>
              {lang === 'en' ? 'All Subjects' : 'সব বিষয়'} ›
            </Link>
          </div>
          <div className="subject-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem' }}>
            {categories.slice(0, 6).map((cat: any, idx: number) => (
              <Link key={cat.id} to={`/books?category=${cat.id}`} className="subject-card" style={{ padding: '1rem' }}>
                <div className="subject-icon" style={{ width: '45px', height: '45px' }}>
                  {categoryIcons[idx % categoryIcons.length]}
                </div>
                <span className="subject-name" style={{ fontSize: '0.9rem' }}>{lang === 'en' ? cat.nameEn : cat.nameBn}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Main Books Content */}
      <div className="container" style={{ marginTop: '3rem' }}>
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          (activeSections.length > 0 ? activeSections : [{ id: 0, titleEn: 'New Arrivals', titleBn: 'নতুন প্রকাশনা' }]).map((section: any) => (
            <section key={section.id} style={{ marginBottom: '3rem' }}>
              <div className="home-section-header" style={{ marginBottom: '15px' }}>
                <h2 className="section-title" style={{ fontSize: '1.2rem' }}>
                  {lang === 'en' ? section.titleEn : (section.titleBn || section.titleEn)}
                </h2>
                <Link to="/books" style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                  {lang === 'en' ? 'View All' : 'সবগুলো দেখুন'} <ChevronRight size={16} />
                </Link>
              </div>
              
              <div className="books-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: '1rem' }}>
                {books.map((book: any) => (
                  <div key={book.id} className="book-card" style={{ padding: '10px' }}>
                    <Link to={`/books/${book.id}`} style={{ textDecoration: 'none' }}>
                      <div style={{ 
                        height: '180px', 
                        backgroundColor: '#f8fafc', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        marginBottom: '0.5rem', 
                        borderRadius: 'var(--radius-sm)',
                        padding: '8px'
                      }}>
                        {book.imageUrl ? (
                          <img src={book.imageUrl} alt={book.titleEn} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                        ) : (
                          <BookOpen size={40} color="#cbd5e1" />
                        )}
                      </div>
                      <h3 className="book-title" style={{ fontSize: '0.85rem', marginBottom: '2px', height: '2.4rem' }}>{lang === 'en' ? book.titleEn : book.titleBn}</h3>
                    </Link>
                    <p className="book-author" style={{ fontSize: '0.75rem', marginBottom: '4px' }}>{lang === 'en' ? book.author?.nameEn : book.author?.nameBn}</p>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#f59e0b', marginBottom: '0.5rem' }}>
                      {[1,2,3,4,5].map(i => <Star key={i} size={10} fill="currentColor" />)}
                      <span style={{ fontSize: '0.7rem', color: '#94a3b8', marginLeft: '4px' }}>({(book.id % 50) + 15})</span>
                    </div>
                    
                    <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span className="book-price" style={{ fontSize: '1rem' }}>TK. {book.price}</span>
                        {book.originalPrice && (
                          <span className="book-price-old" style={{ fontSize: '0.8rem' }}>TK. {book.originalPrice}</span>
                        )}
                      </div>
                      <button 
                        onClick={() => addToCart({ id: book.id, titleEn: book.titleEn, titleBn: book.titleBn, price: book.price, imageUrl: book.imageUrl, quantity: 1 })} 
                        style={{ 
                          backgroundColor: '#fff', 
                          border: '1px solid #e2e8f0', 
                          color: 'var(--primary)',
                          borderRadius: '4px',
                          width: '32px',
                          height: '32px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                      >
                         <ShoppingCart size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))
        )}
      </div>

      <div style={{ backgroundColor: 'white', borderTop: '1px solid #e2e8f0', marginTop: '4rem', padding: '2rem 0' }}>
         <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', textAlign: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
               <div style={{ color: 'var(--primary)', marginBottom: '0.25rem' }}><Library size={30} /></div>
               <h4 style={{ margin: 0, fontSize: '0.95rem' }}>
                 {lang === 'en' ? 'Original Books' : '১০০% অরিজিনাল বই'}
               </h4>
               <p style={{ fontSize: '0.8rem', color: '#64748b' }}>
                 {lang === 'en' ? 'Directly from publishers' : 'সরাসরি প্রকাশনী থেকে'}
               </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
               <div style={{ color: 'var(--primary)', marginBottom: '0.25rem' }}><ArrowRight size={30} /></div>
               <h4 style={{ margin: 0, fontSize: '0.95rem' }}>
                 {lang === 'en' ? 'Fast Delivery' : 'দ্রুত ডেলিভারি'}
               </h4>
               <p style={{ fontSize: '0.8rem', color: '#64748b' }}>
                 {lang === 'en' ? 'Nationwide Shipping' : 'সারাদেশে ডেলিভারি'}
               </p>
            </div>
         </div>
      </div>
    </div>
  );
}
