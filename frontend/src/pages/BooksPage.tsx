import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { BookOpen, Star, Search, ShoppingCart, Filter, ArrowUpDown, ChevronDown, Building } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';

export default function BooksPage() {
  const { lang, t } = useLanguage();
  const { addToCart } = useCart();
  const [searchParams, setSearchParams] = useSearchParams();

  const [books, setBooks] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Derived filters
  const [authors, setAuthors] = useState<any[]>([]);
  const [publishers, setPublishers] = useState<any[]>([]);
  const [featuredPublisherId, setFeaturedPublisherId] = useState<number | null>(null);

  // Filter state
  const [search, setSearch] = useState('');
  const [selCat, setSelCat] = useState('');
  const [selAuthor, setSelAuthor] = useState('');
  const [selPublisher, setSelPublisher] = useState('');
  const [priceRange, setPriceRange] = useState(2000);
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [booksRes, catsRes] = await Promise.all([
          fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/books'),
          fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/categories')
        ]);
        
        if (booksRes.ok && catsRes.ok) {
          const booksData = await booksRes.json();
          const catsData = await catsRes.json();
          
          setBooks(booksData);
          setCategories(catsData);

          // Extract unique authors and publishers
          const uniqueAuthors = new Map();
          const uniquePublishers = new Map();
          let greenPubId = null;

          booksData.forEach((b: any) => {
            if (b.author?.id) uniqueAuthors.set(b.author.id, b.author);
            if (b.publisher?.id) {
              uniquePublishers.set(b.publisher.id, b.publisher);
              if (b.publisher.nameEn?.toLowerCase().includes('green') || b.publisher.nameBn?.includes('গ্রীন')) {
                greenPubId = b.publisher.id;
              }
            }
          });

          setAuthors(Array.from(uniqueAuthors.values()));
          setPublishers(Array.from(uniquePublishers.values()));
          setFeaturedPublisherId(greenPubId);
        }
      } catch (error) {
        console.error('Failed to fetch data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const query = searchParams.get('search');
    if (query) setSearch(query);
    const cat = searchParams.get('category');
    if (cat) setSelCat(cat);
    const auth = searchParams.get('author');
    if (auth) setSelAuthor(auth);
    const pub = searchParams.get('publisher');
    if (pub) setSelPublisher(pub);
  }, [searchParams]);

  const updateURL = (key: string, value: string) => {
    if (value) {
      searchParams.set(key, value);
    } else {
      searchParams.delete(key);
    }
    setSearchParams(searchParams);
  };

  const filtered = books
    .filter((b: any) => {
      const title = lang === 'en' ? b.titleEn : b.titleBn;
      const matchSearch = title?.toLowerCase().includes(search.toLowerCase()) || false;
      const matchCat = selCat ? b.categoryId === parseInt(selCat) : true;
      const matchAuthor = selAuthor ? b.author?.id === parseInt(selAuthor) : true;
      const matchPublisher = selPublisher ? b.publisher?.id === parseInt(selPublisher) : true;
      const matchPrice = b.price <= priceRange;
      return matchSearch && matchCat && matchAuthor && matchPublisher && matchPrice;
    })
    .sort((a: any, b: any) => {
      if (sortBy === 'priceLow') return a.price - b.price;
      if (sortBy === 'priceHigh') return b.price - a.price;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const featuredBooks = featuredPublisherId
    ? filtered.filter((b: any) => b.publisher?.id === featuredPublisherId)
    : [];
  const otherBooks = featuredPublisherId
    ? filtered.filter((b: any) => b.publisher?.id !== featuredPublisherId)
    : filtered;

  const BookCard = ({ book }: { book: any }) => (
    <div key={book.id} className="book-card" style={{ padding: '12px', display: 'flex', flexDirection: 'column' }}>
      <Link to={`/books/${book.id}`} style={{ textDecoration: 'none' }}>
        <div style={{ height: '240px', backgroundColor: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem', borderRadius: 'var(--radius-sm)', padding: '10px' }}>
          {book.imageUrl
            ? <img src={book.imageUrl} alt={book.titleEn} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
            : <BookOpen size={48} color="#cbd5e1" />
          }
        </div>
        <h3 className="book-title" style={{ fontSize: '0.95rem', height: '2.8rem', color: '#1e293b' }}>
          {lang === 'en' ? book.titleEn : book.titleBn}
        </h3>
      </Link>
      <p className="book-author" style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.5rem' }}>
        {lang === 'en' ? book.author?.nameEn : book.author?.nameBn}
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#f59e0b', marginBottom: '0.75rem' }}>
        {[1, 2, 3, 4, 5].map(i => <Star key={i} size={10} fill="currentColor" />)}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span className="book-price" style={{ fontSize: '1.1rem', fontWeight: 800 }}>TK. {book.price}</span>
          {book.originalPrice && book.originalPrice > book.price && <span className="book-price-old" style={{ fontSize: '0.85rem' }}>TK. {book.originalPrice}</span>}
        </div>
        <button
          onClick={() => addToCart({ id: book.id, titleEn: book.titleEn, titleBn: book.titleBn, price: book.price, imageUrl: book.imageUrl, quantity: 1, author: book.author })}
          style={{ backgroundColor: 'white', border: '1px solid var(--primary)', color: 'var(--primary)', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: '0.2s' }}
        >
          <ShoppingCart size={18} />
        </button>
      </div>
    </div>
  );

  const SectionHeading = ({ label, color = 'var(--primary)' }: { label: string; color?: string }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '2rem 0 1.25rem' }}>
      <div style={{ width: '5px', height: '28px', borderRadius: '3px', background: color, flexShrink: 0 }} />
      <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>{label}</h2>
      <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
    </div>
  );

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2rem', color: '#1e293b', marginBottom: '0.5rem', fontWeight: 800 }}>
          {lang === 'en' ? 'Books Collection' : 'বইয়ের সংগ্রহ'}
        </h1>
        <p style={{ color: '#64748b' }}>{filtered.length} {lang === 'en' ? 'books found' : 'টি বই পাওয়া গেছে'}</p>
      </div>

      {/* Filter Bar */}
      <div style={{
        background: 'white', padding: '1rem 1.5rem', borderRadius: '12px',
        border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)',
        marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          {/* Search */}
          <div style={{ position: 'relative', flex: '1', minWidth: '250px' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              type="text"
              className="form-control"
              style={{ paddingLeft: '40px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
              placeholder={lang === 'en' ? 'Search books, authors...' : 'বই বা লেখকের নাম দিয়ে খুঁজুন...'}
              value={search}
              onChange={e => { setSearch(e.target.value); updateURL('search', e.target.value); }}
            />
          </div>

          {/* Quick Filter Buttons */}
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setShowFilters(!showFilters)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.25rem',
                borderRadius: '8px', background: showFilters ? 'var(--primary)' : 'white',
                color: showFilters ? 'white' : '#475569',
                border: '1px solid #cbd5e1', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s'
              }}>
              <Filter size={18} /> {lang === 'en' ? 'Filters' : 'ফিল্টার'}
              <ChevronDown size={14} style={{ transform: showFilters ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '0 1rem', background: 'white' }}>
              <ArrowUpDown size={16} color="#64748b" />
              <select
                className="form-control"
                style={{ width: 'auto', border: 'none', background: 'transparent', padding: '0.6rem 0', fontWeight: 600, color: '#475569', outline: 'none' }}
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
              >
                <option value="newest">{lang === 'en' ? 'Newest' : 'নতুন বই'}</option>
                <option value="priceLow">{lang === 'en' ? 'Price: Low' : 'দাম: কম'}</option>
                <option value="priceHigh">{lang === 'en' ? 'Price: High' : 'দাম: বেশি'}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Expandable Filters */}
        {showFilters && (
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9',
            animation: 'fadeIn 0.3s ease'
          }}>
            <div className="input-group">
              <label className="input-label" style={{ marginBottom: '8px' }}>{lang === 'en' ? 'Price Range' : 'মূল্য পরিসীমা'}</label>
              <input type="range" min="0" max="2000" step="50" value={priceRange} onChange={e => setPriceRange(parseInt(e.target.value))} style={{ width: '100%', accentColor: 'var(--primary)' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#64748b', marginTop: '4px' }}>
                <span>0 TK</span>
                <span style={{ fontWeight: 700, color: 'var(--primary)' }}>Up to {priceRange} TK</span>
              </div>
            </div>

            <div className="input-group">
              <label className="input-label" style={{ marginBottom: '8px' }}>{lang === 'en' ? 'Category' : 'ক্যাটাগরি'}</label>
              <select className="form-control" value={selCat} onChange={e => { setSelCat(e.target.value); updateURL('category', e.target.value); }}>
                <option value="">{lang === 'en' ? 'All Categories' : 'সব ক্যাটাগরি'}</option>
                {categories.map((c: any) => <option key={c.id} value={c.id}>{lang === 'en' ? c.nameEn : c.nameBn}</option>)}
              </select>
            </div>

            <div className="input-group">
              <label className="input-label" style={{ marginBottom: '8px' }}>{lang === 'en' ? 'Author' : 'লেখক'}</label>
              <select className="form-control" value={selAuthor} onChange={e => { setSelAuthor(e.target.value); updateURL('author', e.target.value); }}>
                <option value="">{lang === 'en' ? 'All Authors' : 'সব লেখক'}</option>
                {authors.map((a: any) => <option key={a.id} value={a.id}>{lang === 'en' ? a.nameEn : a.nameBn}</option>)}
              </select>
            </div>

            <div className="input-group">
              <label className="input-label" style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Building size={14} /> {lang === 'en' ? 'Publisher' : 'প্রকাশনী'}
              </label>
              <select className="form-control" value={selPublisher} onChange={e => { setSelPublisher(e.target.value); updateURL('publisher', e.target.value); }}>
                <option value="">{lang === 'en' ? 'All Publishers' : 'সব প্রকাশনী'}</option>
                {publishers.map((p: any) => <option key={p.id} value={p.id}>{lang === 'en' ? p.nameEn : p.nameBn}</option>)}
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button
                onClick={() => { setSelCat(''); setSelAuthor(''); setSelPublisher(''); setPriceRange(2000); setSearch(''); setSearchParams({}); }}
                style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #fee2e2', background: '#fff', color: '#ef4444', fontWeight: 600, cursor: 'pointer' }}
              >
                {lang === 'en' ? 'Reset All' : 'সব মুছুন'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Books Display */}
      {filtered.length === 0 ? (
        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '5rem' }}>
          <BookOpen size={64} style={{ opacity: 0.1, marginBottom: '1rem', margin: '0 auto' }} />
          <p style={{ color: '#64748b' }}>
            {lang === 'en' ? 'No books found matching your criteria.' : 'আপনার শর্তানুসারে কোনো বই পাওয়া যায়নি।'}
          </p>
        </div>
      ) : featuredPublisherId && !selPublisher ? (
        <>
          {/* Featured Publisher Section */}
          {featuredBooks.length > 0 && (
            <>
              <SectionHeading label={lang === 'en' ? 'Green Publishers Books' : 'গ্রীন পাবলিশার্স এর বইসমূহ'} color="var(--primary)" />
              <div className="books-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem' }}>
                {featuredBooks.map((book: any) => <BookCard key={book.id} book={book} />)}
              </div>
            </>
          )}

          {/* Other Publishers Section */}
          {otherBooks.length > 0 && (
            <>
              <SectionHeading label={lang === 'en' ? 'Other Publications' : 'অন্যান্য প্রকাশনীর বইসমূহ'} color="#64748b" />
              <div className="books-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem' }}>
                {otherBooks.map((book: any) => <BookCard key={book.id} book={book} />)}
              </div>
            </>
          )}
        </>
      ) : (
        <div className="books-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem' }}>
          {filtered.map((book: any) => <BookCard key={book.id} book={book} />)}
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
