import { useState, useEffect } from 'react';
import { Pencil, Trash2, X, Check, Plus, LayoutDashboard } from 'lucide-react';

const BLANK = { titleEn: '', titleBn: '', type: 'LATEST', targetId: '', order: '0' };

export default function AdminHomeSections() {
  const [sections, setSections] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [formData, setFormData] = useState<any>(BLANK);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [secRes, catRes] = await Promise.all([
        fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/home-sections'),
        fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/categories')
      ]);
      if (secRes.ok) setSections(await secRes.json());
      if (catRes.ok) setCategories(await catRes.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const showMsg = (t: string) => { setMsg(t); setTimeout(() => setMsg(''), 3000); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingId ? 'PUT' : 'POST';
    const body = {
      ...(editingId ? { id: editingId } : {}),
      ...formData,
      order: parseInt(formData.order),
      targetId: formData.targetId ? parseInt(formData.targetId) : null
    };
    const res = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/home-sections', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (res.ok) {
      setFormData(BLANK);
      setEditingId(null);
      fetchData();
      showMsg(editingId ? 'সেকশন আপডেট হয়েছে!' : 'নতুন সেকশন যোগ হয়েছে!');
    }
  };

  const handleEdit = (s: any) => {
    setEditingId(s.id);
    setFormData({ titleEn: s.titleEn, titleBn: s.titleBn, type: s.type, targetId: s.targetId ? String(s.targetId) : '', order: String(s.order) });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: number) => {
    if (!confirm('এই সেকশনটি মুছবেন?')) return;
    const res = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/home-sections', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    if (res.ok) { fetchData(); showMsg('সেকশন মুছে ফেলা হয়েছে।'); }
  };

  return (
    <div>
      <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', color: 'var(--primary-dark)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <LayoutDashboard size={28} /> হোম সেকশন পরিচালনা
      </h2>

      {msg && <div style={{ padding: '0.75rem 1rem', marginBottom: '1rem', backgroundColor: '#dcfce7', color: '#16a34a', borderRadius: '6px', border: '1px solid #86efac' }}>{msg}</div>}

      {/* Form */}
      <div style={{ background: 'white', border: `2px solid ${editingId ? 'var(--primary)' : 'var(--border-color)'}`, borderRadius: '10px', padding: '2rem', marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.25rem', color: editingId ? 'var(--primary)' : '#1e293b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={18} /> {editingId ? 'সেকশন সম্পাদনা করুন' : 'নতুন সেকশন যোগ করুন'}
        </h3>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="input-group">
            <label className="input-label">শিরোনাম (English) *</label>
            <input required type="text" className="form-control" value={formData.titleEn} onChange={e => setFormData({ ...formData, titleEn: e.target.value })} placeholder="Latest Books" />
          </div>
          <div className="input-group">
            <label className="input-label">শিরোনাম (বাংলা) *</label>
            <input required type="text" className="form-control" value={formData.titleBn} onChange={e => setFormData({ ...formData, titleBn: e.target.value })} placeholder="নতুন আসা বই" />
          </div>
          <div className="input-group">
            <label className="input-label">ধরন (Type)</label>
            <select className="form-control" value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value, targetId: '' })}>
              <option value="LATEST">সর্বশেষ বই (Latest Added)</option>
              <option value="CATEGORY">ক্যাটাগরি ভিত্তিক (Category)</option>
            </select>
          </div>
          {formData.type === 'CATEGORY' && (
            <div className="input-group">
              <label className="input-label">ক্যাটাগরি নির্বাচন *</label>
              <select required className="form-control" value={formData.targetId} onChange={e => setFormData({ ...formData, targetId: e.target.value })}>
                <option value="">বেছে নিন...</option>
                {categories.map((c: any) => <option key={c.id} value={c.id}>{c.nameEn} / {c.nameBn}</option>)}
              </select>
            </div>
          )}
          <div className="input-group">
            <label className="input-label">ক্রম (Order) — ছোট মানে আগে</label>
            <input required type="number" className="form-control" value={formData.order} onChange={e => setFormData({ ...formData, order: e.target.value })} />
          </div>
          <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '0.75rem' }}>
            <button type="submit" className="btn btn-blue" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Check size={16} /> {editingId ? 'আপডেট করুন' : 'সেকশন যোগ করুন'}
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
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.5rem' }}>হোমপেজ লেআউট ({sections.length} সেকশন)</h3>
        {loading ? <p>লোড হচ্ছে...</p> : sections.length === 0 ? (
          <p style={{ color: '#94a3b8', textAlign: 'center', padding: '2rem' }}>কোনো সেকশন নেই। উপরে যোগ করুন।</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {sections.map((s: any) => (
              <div key={s.id} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '0.875rem 1rem',
                border: `1px solid ${editingId === s.id ? 'var(--primary)' : '#e2e8f0'}`,
                borderRadius: '8px',
                background: editingId === s.id ? '#f0f9ff' : 'white',
                flexWrap: 'wrap', gap: '0.5rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '6px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.85rem', color: '#64748b', flexShrink: 0 }}>
                    {s.order}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{s.titleEn} <span style={{ color: '#94a3b8', fontWeight: 400 }}>/ {s.titleBn}</span></div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      {s.type === 'LATEST' ? 'সর্বশেষ বই' : `ক্যাটাগরি ID: ${s.targetId}`}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => handleEdit(s)} style={{ background: '#eff6ff', border: '1px solid #bfdbfe', color: '#1d4ed8', borderRadius: '6px', padding: '0.3rem 0.75rem', cursor: 'pointer', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Pencil size={13} /> সম্পাদনা
                  </button>
                  <button onClick={() => handleDelete(s.id)} style={{ background: '#fff1f2', border: '1px solid #fca5a5', color: '#dc2626', borderRadius: '6px', padding: '0.3rem 0.75rem', cursor: 'pointer', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
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
