import { useState, useEffect } from 'react';
import { FileText, Trash2, Pencil, X, Check, Plus, ExternalLink, Eye, EyeOff } from 'lucide-react';

const BLANK = { slug: '', titleEn: '', titleBn: '', contentEn: '', contentBn: '', active: true, sortOrder: '0' };

export default function AdminCustomPages() {
  const [pages, setPages] = useState<any[]>([]);
  const [formData, setFormData] = useState<any>(BLANK);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  useEffect(() => { fetchPages(); }, []);

  const fetchPages = async () => {
    const res = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/custom-pages');
    if (res.ok) setPages(await res.json());
  };

  const showMsg = (t: string) => { setMsg(t); setError(''); setTimeout(() => setMsg(''), 3000); };
  const showError = (t: string) => { setError(t); setTimeout(() => setError(''), 4000); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const method = editingId ? 'PUT' : 'POST';
    const body = editingId ? { id: editingId, ...formData } : formData;
    const res = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/custom-pages', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await res.json();
    if (res.ok) {
      setFormData(BLANK);
      setEditingId(null);
      fetchPages();
      showMsg(editingId ? 'পাতা আপডেট হয়েছে!' : 'নতুন পাতা তৈরি হয়েছে!');
    } else {
      showError(data.error || 'সংরক্ষণ ব্যর্থ হয়েছে।');
    }
    setLoading(false);
  };

  const handleEdit = (p: any) => {
    setEditingId(p.id);
    setFormData({ slug: p.slug, titleEn: p.titleEn, titleBn: p.titleBn, contentEn: p.contentEn, contentBn: p.contentBn, active: p.active, sortOrder: String(p.sortOrder) });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: number) => {
    if (!confirm('এই পাতাটি মুছবেন?')) return;
    await fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/custom-pages', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    fetchPages();
    showMsg('পাতা মুছে ফেলা হয়েছে।');
  };

  const autoSlug = (title: string) =>
    title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

  return (
    <div>
      <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', color: 'var(--primary-dark)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <FileText size={28} /> কাস্টম পাতা পরিচালনা
      </h2>

      <div style={{ padding: '0.75rem 1rem', marginBottom: '1.25rem', background: '#eff6ff', borderRadius: '8px', border: '1px solid #bfdbfe', fontSize: '0.9rem', color: '#1e40af' }}>
        প্রতিটি পাতার URL হবে: <strong>yourdomain.com/p/[slug]</strong> — এই লিংক Nav Menus-এ যোগ করতে পারবেন।
      </div>

      {msg && <div style={{ padding: '0.75rem 1rem', marginBottom: '1rem', backgroundColor: '#dcfce7', color: '#16a34a', borderRadius: '6px', border: '1px solid #86efac' }}>{msg}</div>}
      {error && <div style={{ padding: '0.75rem 1rem', marginBottom: '1rem', backgroundColor: '#fef2f2', color: '#dc2626', borderRadius: '6px', border: '1px solid #fca5a5' }}>{error}</div>}

      {/* Form */}
      <div style={{ background: 'white', border: `2px solid ${editingId ? 'var(--primary)' : 'var(--border-color)'}`, borderRadius: '10px', padding: '2rem', marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.25rem', color: editingId ? 'var(--primary)' : '#1e293b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={18} /> {editingId ? 'পাতা সম্পাদনা করুন' : 'নতুন পাতা তৈরি করুন'}
        </h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="input-group">
              <label className="input-label">শিরোনাম (English) *</label>
              <input
                required type="text" className="form-control"
                placeholder="About Us"
                value={formData.titleEn}
                onChange={e => {
                  const val = e.target.value;
                  setFormData((f: any) => ({ ...f, titleEn: val, slug: editingId ? f.slug : autoSlug(val) }));
                }}
              />
            </div>
            <div className="input-group">
              <label className="input-label">শিরোনাম (বাংলা) *</label>
              <input required type="text" className="form-control" placeholder="আমাদের সম্পর্কে" value={formData.titleBn} onChange={e => setFormData((f: any) => ({ ...f, titleBn: e.target.value }))} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1rem', alignItems: 'flex-end' }}>
            <div className="input-group">
              <label className="input-label">URL Slug * <span style={{ fontSize: '0.75rem', color: '#64748b' }}>(শুধু a-z, 0-9, - ব্যবহার করুন)</span></label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: '#94a3b8', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>/p/</span>
                <input required type="text" className="form-control" placeholder="about-us" value={formData.slug} onChange={e => setFormData((f: any) => ({ ...f, slug: e.target.value }))} />
              </div>
            </div>
            <div className="input-group">
              <label className="input-label">ক্রম (Order)</label>
              <input type="number" className="form-control" min="0" value={formData.sortOrder} onChange={e => setFormData((f: any) => ({ ...f, sortOrder: e.target.value }))} />
            </div>
            <div className="input-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label className="input-label">অবস্থা</label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', padding: '0.5rem 0.75rem', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
                <input type="checkbox" checked={formData.active} onChange={e => setFormData((f: any) => ({ ...f, active: e.target.checked }))} />
                <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{formData.active ? '✅ সক্রিয়' : '⛔ নিষ্ক্রিয়'}</span>
              </label>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="input-group">
              <label className="input-label">বিষয়বস্তু (English)</label>
              <textarea className="form-control" rows={8} placeholder="Write page content in English..." value={formData.contentEn} onChange={e => setFormData((f: any) => ({ ...f, contentEn: e.target.value }))} style={{ resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.7 }} />
            </div>
            <div className="input-group">
              <label className="input-label">বিষয়বস্তু (বাংলা)</label>
              <textarea className="form-control" rows={8} placeholder="বাংলায় পাতার বিষয়বস্তু লিখুন..." value={formData.contentBn} onChange={e => setFormData((f: any) => ({ ...f, contentBn: e.target.value }))} style={{ resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.7 }} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button type="submit" className="btn btn-blue" disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Check size={16} /> {loading ? 'সংরক্ষণ হচ্ছে...' : (editingId ? 'আপডেট করুন' : 'পাতা তৈরি করুন')}
            </button>
            {editingId && (
              <button type="button" onClick={() => { setFormData(BLANK); setEditingId(null); }} className="btn" style={{ background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <X size={16} /> বাতিল করুন
              </button>
            )}
          </div>
        </form>
      </div>

      {/* List */}
      <div style={{ background: 'white', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '2rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.5rem' }}>সকল কাস্টম পাতা ({pages.length})</h3>
        {pages.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
            <FileText size={48} style={{ marginBottom: '1rem', opacity: 0.3 }} />
            <p>কোনো পাতা নেই। উপরে তৈরি করুন।</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {pages.map((p: any) => (
              <div key={p.id} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '1rem',
                border: `1px solid ${editingId === p.id ? 'var(--primary)' : '#e2e8f0'}`,
                borderRadius: '8px',
                background: editingId === p.id ? '#f0f9ff' : 'white',
                flexWrap: 'wrap', gap: '0.5rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, minWidth: '200px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: p.active ? '#dbeafe' : '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {p.active ? <Eye size={18} color="var(--primary)" /> : <EyeOff size={18} color="#94a3b8" />}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{p.titleEn} <span style={{ color: '#94a3b8', fontWeight: 400 }}>/ {p.titleBn}</span></div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b', fontFamily: 'monospace' }}>/p/{p.slug}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <a href={`/p/${p.slug}`} target="_blank" rel="noopener noreferrer" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '0.3rem 0.6rem', color: '#64748b', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem' }}>
                    <ExternalLink size={13} /> দেখুন
                  </a>
                  <button onClick={() => handleEdit(p)} style={{ background: '#eff6ff', border: '1px solid #bfdbfe', color: '#1d4ed8', borderRadius: '6px', padding: '0.3rem 0.75rem', cursor: 'pointer', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Pencil size={13} /> সম্পাদনা
                  </button>
                  <button onClick={() => handleDelete(p.id)} style={{ background: '#fff1f2', border: '1px solid #fca5a5', color: '#dc2626', borderRadius: '6px', padding: '0.3rem 0.75rem', cursor: 'pointer', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Trash2 size={13} /> মুছুন
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
