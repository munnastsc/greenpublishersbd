import { useState, useEffect } from 'react';
import FileUpload from '../../components/admin/FileUpload';

export default function AdminBooks() {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [publishers, setPublishers] = useState([]);

  const [formData, setFormData] = useState({
    id: null, titleEn: '', titleBn: '', price: '', originalPrice: '',
    categoryId: '', authorId: '', publisherId: '', imageUrl: '',
    rokomariLink: '', description: ''
  });
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [booksRes, catRes, authRes, pubRes] = await Promise.all([
        fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/books'),
        fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/categories'),
        fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/authors'),
        fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/publishers')
      ]);
      if (booksRes.ok) setBooks(await booksRes.json());
      if (catRes.ok) setCategories(await catRes.json());
      if (authRes.ok) setAuthors(await authRes.json());
      if (pubRes.ok) setPublishers(await pubRes.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (book: any) => {
    setFormData({
      id: book.id,
      titleEn: book.titleEn,
      titleBn: book.titleBn,
      price: book.price.toString(),
      originalPrice: book.originalPrice?.toString() || '',
      categoryId: book.categoryId?.toString() || '',
      authorId: book.authorId?.toString() || '',
      publisherId: book.publisherId?.toString() || '',
      imageUrl: book.imageUrl || '',
      rokomariLink: book.rokomariLink || '',
      description: book.description || ''
    });
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setFormData({ id: null, titleEn: '', titleBn: '', price: '', originalPrice: '', categoryId: '', authorId: '', publisherId: '', imageUrl: '', rokomariLink: '', description: '' });
    setIsEditing(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      price: parseFloat(formData.price),
      originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
      categoryId: formData.categoryId ? parseInt(formData.categoryId) : null,
      authorId: formData.authorId ? parseInt(formData.authorId) : null,
      publisherId: formData.publisherId ? parseInt(formData.publisherId) : null,
    };
    const method = isEditing ? 'PUT' : 'POST';
    const res = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/books', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.ok) { resetForm(); fetchData(); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('এই বইটি মুছে ফেলবেন?')) return;
    const res = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/books', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    if (res.ok) fetchData();
  };

  return (
    <div>
      <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', color: 'var(--primary-dark)' }}>Manage Books</h2>

      <div className="book-card" style={{ padding: '2rem', marginBottom: '2rem', textAlign: 'left', border: isEditing ? '2px solid var(--primary)' : '1px solid #e2e8f0' }}>
        <h3 className="section-title" style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
          {isEditing ? 'Edit Book' : 'Add New Book'}
        </h3>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="input-group">
            <label className="input-label">Title (English)</label>
            <input required type="text" className="form-control" value={formData.titleEn} onChange={e => setFormData({...formData, titleEn: e.target.value})} />
          </div>
          <div className="input-group">
            <label className="input-label">Title (Bengali / বাংলা নাম)</label>
            <input required type="text" className="form-control" value={formData.titleBn} onChange={e => setFormData({...formData, titleBn: e.target.value})} />
          </div>
          <div className="input-group">
            <label className="input-label">Selling Price (TK)</label>
            <input required type="number" className="form-control" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
          </div>
          <div className="input-group">
            <label className="input-label">Original Price / MRP (TK) — Optional</label>
            <input type="number" className="form-control" value={formData.originalPrice} onChange={e => setFormData({...formData, originalPrice: e.target.value})} />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <FileUpload label="বইয়ের ছবি" folder="images" value={formData.imageUrl} onChange={url => setFormData({...formData, imageUrl: url})} />
          </div>
          <div className="input-group" style={{ gridColumn: '1 / -1' }}>
            <label className="input-label">
              রকমারি / অন্য সাইটের কেনার লিঙ্ক (Buy Link) — Optional
              <span style={{ fontWeight: 400, color: '#94a3b8', fontSize: '0.8rem', marginLeft: '0.5rem' }}>
                (বুক ডিটেইলস পেজে বাটন দেখাবে)
              </span>
            </label>
            <input
              type="url"
              className="form-control"
              placeholder="https://www.rokomari.com/book/..."
              value={formData.rokomariLink}
              onChange={e => setFormData({...formData, rokomariLink: e.target.value})}
            />
          </div>
          <div className="input-group">
            <label className="input-label">Category</label>
            <select required className="form-control" value={formData.categoryId} onChange={e => setFormData({...formData, categoryId: e.target.value})}>
              <option value="">Select Category</option>
              {categories.map((c:any) => <option key={c.id} value={c.id}>{c.nameEn} / {c.nameBn}</option>)}
            </select>
          </div>
          <div className="input-group">
            <label className="input-label">Author</label>
            <select required className="form-control" value={formData.authorId} onChange={e => setFormData({...formData, authorId: e.target.value})}>
              <option value="">Select Author</option>
              {authors.map((a:any) => <option key={a.id} value={a.id}>{a.nameEn} / {a.nameBn}</option>)}
            </select>
          </div>
          <div className="input-group">
            <label className="input-label">Publisher</label>
            <select required className="form-control" value={formData.publisherId} onChange={e => setFormData({...formData, publisherId: e.target.value})}>
              <option value="">Select Publisher</option>
              {publishers.map((p:any) => <option key={p.id} value={p.id}>{p.nameEn} / {p.nameBn}</option>)}
            </select>
          </div>
          <div className="input-group">
            <label className="input-label">Description</label>
            <textarea className="form-control" style={{ height: '38px' }} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
          </div>
          <div style={{ gridColumn: '1 / -1', marginTop: '1rem', display: 'flex', gap: '1rem' }}>
            <button type="submit" className="btn btn-blue">{isEditing ? 'Update Book' : 'Save Book'}</button>
            {isEditing && <button type="button" onClick={resetForm} className="btn btn-outline">Cancel</button>}
          </div>
        </form>
      </div>

      <div className="book-card" style={{ padding: '2rem', textAlign: 'left' }}>
        <h3 className="section-title" style={{ marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Books Inventory</h3>
        {loading ? (
          <p>Loading inventory...</p>
        ) : books.length === 0 ? (
          <p>No books added yet.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left' }}>
                  <th style={{ padding: '0.75rem 0' }}>Book Info</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Buy Link</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {books.map((book: any) => (
                  <tr key={book.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '0.75rem 0' }}>
                      <div style={{ fontWeight: 600 }}>{book.titleEn}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{book.titleBn}</div>
                    </td>
                    <td>{book.category?.nameEn}</td>
                    <td>
                      <div style={{ color: 'var(--primary)', fontWeight: 'bold' }}>TK. {book.price}</div>
                      {book.originalPrice && (
                        <div style={{ fontSize: '0.8rem', color: '#94a3b8', textDecoration: 'line-through' }}>TK. {book.originalPrice}</div>
                      )}
                    </td>
                    <td style={{ fontSize: '0.8rem' }}>
                      {book.rokomariLink ? (
                        <a href={book.rokomariLink} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>
                          লিঙ্ক আছে ✓
                        </a>
                      ) : (
                        <span style={{ color: '#cbd5e1' }}>নেই</span>
                      )}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <button onClick={() => handleEdit(book)} className="btn" style={{ color: 'var(--primary)', border: '1px solid var(--primary)', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}>
                          Edit
                        </button>
                        <button onClick={() => handleDelete(book.id)} className="btn" style={{ color: '#dc2626', border: '1px solid #fca5a5', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
