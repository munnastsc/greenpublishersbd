import { useState, useEffect } from 'react';
import { FileText, Trash2, Pencil, X, Check, Plus } from 'lucide-react';
import FileUpload from '../../components/admin/FileUpload';

const BLANK = { titleEn: '', titleBn: '', descriptionEn: '', descriptionBn: '', imageUrl: '', fileUrl: '', sortOrder: '0' };

export default function AdminTrainingManuals() {
  const [items, setItems] = useState<any[]>([]);
  const [formData, setFormData] = useState(BLANK);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    const res = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/training-manuals');
    if (res.ok) setItems(await res.json());
  };

  const showMsg = (t: string) => { setMsg(t); setTimeout(() => setMsg(''), 3000); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const method = editingId ? 'PUT' : 'POST';
    const body = editingId ? { id: editingId, ...formData } : formData;
    const res = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/training-manuals', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (res.ok) {
      setFormData(BLANK);
      setEditingId(null);
      fetchItems();
      showMsg(editingId ? 'ম্যানুয়াল আপডেট হয়েছে!' : 'ম্যানুয়াল সংরক্ষিত হয়েছে!');
    }
    setLoading(false);
  };

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setFormData({
      titleEn: item.titleEn,
      titleBn: item.titleBn,
      descriptionEn: item.descriptionEn || '',
      descriptionBn: item.descriptionBn || '',
      imageUrl: item.imageUrl || '',
      fileUrl: item.fileUrl || '',
      sortOrder: String(item.sortOrder)
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: number) => {
    if (!confirm('এই ম্যানুয়ালটি মুছবেন?')) return;
    await fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/training-manuals', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    fetchItems();
  };

  return (
    <div>
      <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', color: '#0f766e', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <FileText size={28} /> প্রশিক্ষণ ম্যানুয়াল পরিচালনা
      </h2>

      {msg && (
        <div style={{ padding: '0.75rem 1rem', marginBottom: '1rem', backgroundColor: '#dcfce7', color: '#16a34a', borderRadius: '6px', border: '1px solid #86efac' }}>
          {msg}
        </div>
      )}

      {/* Form */}
      <div style={{ background: 'white', border: `2px solid ${editingId ? '#0f766e' : 'var(--border-color)'}`, borderRadius: '10px', padding: '2rem', marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.25rem', color: editingId ? '#0f766e' : '#1e293b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={18} /> {editingId ? 'ম্যানুয়াল সম্পাদনা করুন' : 'নতুন ম্যানুয়াল যোগ করুন'}
        </h3>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="input-group">
            <label className="input-label">শিরোনাম (English) *</label>
            <input required type="text" className="form-control" placeholder="Training Manual Vol. 1" value={formData.titleEn} onChange={e => setFormData({ ...formData, titleEn: e.target.value })} />
          </div>
          <div className="input-group">
            <label className="input-label">শিরোনাম (বাংলা) *</label>
            <input required type="text" className="form-control" placeholder="প্রশিক্ষণ ম্যানুয়াল ১ম খণ্ড" value={formData.titleBn} onChange={e => setFormData({ ...formData, titleBn: e.target.value })} />
          </div>

          <div className="input-group" style={{ gridColumn: '1 / -1' }}>
            <label className="input-label">বিবরণ (English)</label>
            <textarea className="form-control" rows={2} placeholder="Brief description..." value={formData.descriptionEn} onChange={e => setFormData({ ...formData, descriptionEn: e.target.value })} style={{ resize: 'vertical' }} />
          </div>
          <div className="input-group" style={{ gridColumn: '1 / -1' }}>
            <label className="input-label">বিবরণ (বাংলা)</label>
            <textarea className="form-control" rows={2} placeholder="সংক্ষিপ্ত বিবরণ..." value={formData.descriptionBn} onChange={e => setFormData({ ...formData, descriptionBn: e.target.value })} style={{ resize: 'vertical' }} />
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <FileUpload label="কভার ইমেজ" folder="images" value={formData.imageUrl} onChange={url => setFormData({ ...formData, imageUrl: url })} />
          </div>
          <div>
            <FileUpload label="ফাইল / PDF আপলোড" folder="files" value={formData.fileUrl} onChange={url => setFormData({ ...formData, fileUrl: url })} />
          </div>
          <div className="input-group">
            <label className="input-label">ক্রম (Sort Order)</label>
            <input type="number" className="form-control" min="0" value={formData.sortOrder} onChange={e => setFormData({ ...formData, sortOrder: e.target.value })} />
          </div>

          <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '0.75rem' }}>
            <button type="submit" className="btn btn-blue" disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#0f766e' }}>
              <Check size={16} /> {loading ? 'সংরক্ষণ হচ্ছে...' : (editingId ? 'আপডেট করুন' : 'সংরক্ষণ করুন')}
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
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.5rem' }}>সকল ম্যানুয়াল ({items.length})</h3>
        {items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
            <FileText size={48} style={{ marginBottom: '1rem', opacity: 0.3 }} />
            <p>কোনো ম্যানুয়াল নেই। উপরে যোগ করুন।</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {items.map((item: any) => (
              <div key={item.id} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '0.875rem 1rem',
                border: `1px solid ${editingId === item.id ? '#0f766e' : '#e2e8f0'}`,
                borderRadius: '8px',
                background: editingId === item.id ? '#f0fdf4' : 'white',
                flexWrap: 'wrap', gap: '0.5rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, minWidth: '200px' }}>
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt="" style={{ width: '44px', height: '44px', objectFit: 'cover', borderRadius: '6px', flexShrink: 0 }} />
                  ) : (
                    <div style={{ width: '44px', height: '44px', borderRadius: '8px', background: 'linear-gradient(135deg, #ccfbf1, #99f6e4)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <FileText size={20} color="#0f766e" />
                    </div>
                  )}
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.titleEn}</div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{item.titleBn}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => handleEdit(item)} style={{ background: '#eff6ff', border: '1px solid #bfdbfe', color: '#1d4ed8', borderRadius: '6px', padding: '0.3rem 0.75rem', cursor: 'pointer', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Pencil size={13} /> সম্পাদনা
                  </button>
                  <button onClick={() => handleDelete(item.id)} style={{ background: '#fff1f2', border: '1px solid #fca5a5', color: '#dc2626', borderRadius: '6px', padding: '0.3rem 0.75rem', cursor: 'pointer', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
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
