import { useState, useEffect } from 'react';
import { Pencil, Trash2, X, Check, Video } from 'lucide-react';

const BLANK = { titleEn: '', titleBn: '', youtubeId: '', description: '', bookId: '', unitId: '' };

export default function AdminVideos() {
  const [videos, setVideos] = useState<any[]>([]);
  const [books, setBooks] = useState<any[]>([]);
  const [units, setUnits] = useState<any[]>([]);
  const [formData, setFormData] = useState(BLANK);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetchVideos();
    fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/books').then(r => r.json()).then(setBooks);
  }, []);

  useEffect(() => {
    if (formData.bookId) {
      fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/units?bookId=${formData.bookId}`).then(r => r.json()).then(setUnits);
    } else {
      setUnits([]);
      setFormData(f => ({ ...f, unitId: '' }));
    }
  }, [formData.bookId]);

  const fetchVideos = async () => {
    const res = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/videos');
    if (res.ok) setVideos(await res.json());
  };

  const showMsg = (t: string) => { setMsg(t); setTimeout(() => setMsg(''), 3000); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const method = editingId ? 'PUT' : 'POST';
    const body = editingId ? { id: editingId, ...formData } : formData;
    const res = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/videos', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (res.ok) {
      setFormData(BLANK);
      setEditingId(null);
      fetchVideos();
      showMsg(editingId ? 'Video updated!' : 'Video saved!');
    }
    setLoading(false);
  };

  const handleEdit = (v: any) => {
    setEditingId(v.id);
    setFormData({
      titleEn: v.titleEn,
      titleBn: v.titleBn || '',
      youtubeId: v.youtubeId,
      description: v.description || '',
      bookId: v.bookId ? String(v.bookId) : '',
      unitId: v.unitId ? String(v.unitId) : '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure?')) return;
    await fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/videos', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    fetchVideos();
  };

  const handleYoutubeChange = (val: string) => {
    let id = val;
    const match = val.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
    if (match) id = match[1];
    setFormData({ ...formData, youtubeId: id });
  };

  return (
    <div>
      <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', color: 'var(--primary-dark)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Video size={28} /> Manage Video Lessons
      </h2>

      {msg && (
        <div style={{ padding: '0.75rem 1rem', marginBottom: '1rem', backgroundColor: '#dcfce7', color: '#16a34a', borderRadius: 'var(--radius-sm)', border: '1px solid #86efac' }}>
          {msg}
        </div>
      )}

      <div style={{ background: 'white', border: `2px solid ${editingId ? 'var(--primary)' : 'var(--border-color)'}`, borderRadius: '10px', padding: '2rem', marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.25rem', color: editingId ? 'var(--primary)' : '#1e293b' }}>
          {editingId ? 'Edit Video' : 'Add New Video'}
        </h3>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="input-group">
            <label className="input-label">Lesson Title (English) *</label>
            <input required type="text" className="form-control" value={formData.titleEn} onChange={e => setFormData({ ...formData, titleEn: e.target.value })} />
          </div>
          <div className="input-group">
            <label className="input-label">Lesson Title (Bengali) — Optional</label>
            <input type="text" className="form-control" value={formData.titleBn} onChange={e => setFormData({ ...formData, titleBn: e.target.value })} />
          </div>

          <div className="input-group">
            <label className="input-label">Related Book (Optional)</label>
            <select className="form-control" value={formData.bookId} onChange={e => setFormData({ ...formData, bookId: e.target.value, unitId: '' })}>
              <option value="">General Video (Not linked to a book)</option>
              {books.map(b => <option key={b.id} value={b.id}>{b.titleEn} / {b.titleBn}</option>)}
            </select>
          </div>

          <div className="input-group">
            <label className="input-label">Unit (Optional){!formData.bookId && <span style={{ color: '#94a3b8', fontWeight: 400 }}> — বই সিলেক্ট করুন আগে</span>}</label>
            <select className="form-control" value={formData.unitId} onChange={e => setFormData({ ...formData, unitId: e.target.value })} disabled={!formData.bookId || units.length === 0}>
              <option value="">No Unit</option>
              {units.map(u => <option key={u.id} value={u.id}>{u.titleEn}{u.titleBn ? ` / ${u.titleBn}` : ''}</option>)}
            </select>
            {formData.bookId && units.length === 0 && (
              <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.25rem' }}>এই বইতে কোনো unit নেই। <a href="/admin/units" style={{ color: 'var(--primary)' }}>Unit তৈরি করুন</a></p>
            )}
          </div>

          <div className="input-group" style={{ gridColumn: '1 / -1' }}>
            <label className="input-label">YouTube URL or Video ID *</label>
            <input required type="text" className="form-control" placeholder="e.g. https://youtube.com/watch?v=dQw4w9WgXcQ" value={formData.youtubeId} onChange={e => handleYoutubeChange(e.target.value)} />
          </div>

          <div className="input-group" style={{ gridColumn: '1 / -1' }}>
            <label className="input-label">Description</label>
            <textarea className="form-control" rows={2} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
          </div>

          <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '0.75rem' }}>
            <button type="submit" className="btn btn-blue" disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Check size={16} /> {loading ? 'Saving...' : (editingId ? 'Update Video' : 'Save Video')}
            </button>
            {editingId && (
              <button type="button" onClick={() => { setFormData(BLANK); setEditingId(null); }} className="btn" style={{ background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <X size={16} /> Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div style={{ background: 'white', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '2rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.5rem' }}>All Videos ({videos.length})</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {videos.map((v: any) => (
            <div key={v.id} style={{ border: `1px solid ${editingId === v.id ? 'var(--primary)' : 'var(--border-color)'}`, borderRadius: '10px', overflow: 'hidden', background: editingId === v.id ? '#f0f9ff' : 'white' }}>
              <div style={{ position: 'relative', paddingTop: '56.25%' }}>
                <iframe src={`https://www.youtube.com/embed/${v.youtubeId}`} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} frameBorder="0" allowFullScreen />
              </div>
              <div style={{ padding: '1rem' }}>
                <h4 style={{ fontSize: '0.95rem', marginBottom: '0.25rem' }}>{v.titleEn}</h4>
                {v.titleBn && <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>{v.titleBn}</p>}
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                  {v.book && (
                    <span style={{ fontSize: '0.75rem', backgroundColor: '#f1f5f9', padding: '2px 8px', borderRadius: '4px', color: 'var(--primary)', fontWeight: 700 }}>
                      📚 {v.book.titleEn}
                    </span>
                  )}
                  {v.unit && (
                    <span style={{ fontSize: '0.75rem', backgroundColor: '#fef3c7', padding: '2px 8px', borderRadius: '4px', color: '#92400e', fontWeight: 700 }}>
                      📂 {v.unit.titleEn}
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => handleEdit(v)} style={{ flex: 1, background: '#eff6ff', border: '1px solid #bfdbfe', color: '#1d4ed8', borderRadius: '6px', padding: '0.4rem', cursor: 'pointer', fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}>
                    <Pencil size={13} /> Edit
                  </button>
                  <button onClick={() => handleDelete(v.id)} style={{ flex: 1, background: '#fff1f2', border: '1px solid #fca5a5', color: '#dc2626', borderRadius: '6px', padding: '0.4rem', cursor: 'pointer', fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}>
                    <Trash2 size={13} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
