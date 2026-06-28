import { useState, useEffect } from 'react';
import FileUpload from '../../components/admin/FileUpload';

export default function AdminBanners() {
  const [banners, setBanners] = useState<any[]>([]);
  const [formData, setFormData] = useState({ titleEn: '', titleBn: '', subtitleEn: '', subtitleBn: '', imageUrl: '', link: '' });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => { fetchBanners(); }, []);

  const fetchBanners = async () => {
    const res = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/banners');
    if (res.ok) setBanners(await res.json());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/banners', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    if (res.ok) {
      setFormData({ titleEn: '', titleBn: '', subtitleEn: '', subtitleBn: '', imageUrl: '', link: '' });
      fetchBanners();
      setMsg('Banner added successfully!');
      setTimeout(() => setMsg(''), 3000);
    }
    setLoading(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure?')) return;
    const res = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/banners', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    if (res.ok) fetchBanners();
  };

  return (
    <div>
      <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', color: 'var(--primary-dark)' }}>Manage Banners</h2>

      {msg && (
        <div style={{ padding: '0.75rem 1rem', marginBottom: '1rem', backgroundColor: '#dcfce7', color: '#16a34a', borderRadius: 'var(--radius-sm)', border: '1px solid #86efac' }}>
          {msg}
        </div>
      )}

      <div style={{ background: 'white', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '2rem', marginBottom: '2rem' }}>
        <h3 className="section-title">Add New Banner</h3>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="input-group">
            <label className="input-label">Title (English)</label>
            <input type="text" className="form-control" value={formData.titleEn} onChange={e => setFormData({ ...formData, titleEn: e.target.value })} />
          </div>
          <div className="input-group">
            <label className="input-label">Title (Bengali)</label>
            <input type="text" className="form-control" value={formData.titleBn} onChange={e => setFormData({ ...formData, titleBn: e.target.value })} />
          </div>
          <div className="input-group">
            <label className="input-label">Subtitle (English)</label>
            <input type="text" className="form-control" value={formData.subtitleEn} onChange={e => setFormData({ ...formData, subtitleEn: e.target.value })} />
          </div>
          <div className="input-group">
            <label className="input-label">Subtitle (Bengali)</label>
            <input type="text" className="form-control" value={formData.subtitleBn} onChange={e => setFormData({ ...formData, subtitleBn: e.target.value })} />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <FileUpload label="ব্যানার ছবি" folder="images" value={formData.imageUrl} onChange={url => setFormData({ ...formData, imageUrl: url })} required />
          </div>
          <div className="input-group" style={{ gridColumn: '1 / -1' }}>
            <label className="input-label">Link URL (Optional)</label>
            <input type="text" className="form-control" placeholder="/books?category=1" value={formData.link} onChange={e => setFormData({ ...formData, link: e.target.value })} />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <button type="submit" className="btn btn-blue" disabled={loading}>{loading ? 'Adding...' : 'Add Banner'}</button>
          </div>
        </form>
      </div>

      <div style={{ background: 'white', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '2rem' }}>
        <h3 className="section-title">Current Banners</h3>
        {banners.length === 0 ? <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>No banners added yet.</p> : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem', marginTop: '1rem' }}>
            {banners.map((b: any) => (
              <div key={b.id} style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
                <div style={{ width: '100%', height: '150px', backgroundColor: '#f1f5f9', position: 'relative' }}>
                  <img src={b.imageUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Banner" />
                </div>
                <div style={{ padding: '1rem' }}>
                  <h4 style={{ fontSize: '0.95rem', marginBottom: '0.25rem' }}>{b.titleEn || 'No Title'}</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{b.titleBn}</p>
                  <button onClick={() => handleDelete(b.id)} className="btn" style={{ color: '#dc2626', border: '1px solid #fca5a5', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', width: '100%', marginTop: '1rem' }}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
